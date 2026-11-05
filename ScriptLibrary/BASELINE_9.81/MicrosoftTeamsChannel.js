var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsChannel");
var API = lib.MicrosoftGraphAPI;

const ROLE_OWNER = "owner";


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
    API.setLoggerLevel(level);
}


/**
 * refresh channel mapping record
 *
 * @param {SCFile} mappingRecord
 *                 msTeamsChannelMapping record
 */
function refreshMappingCondition(mappingRecord) {
    var mapping = mappingRecord.mapping;
    var i;
    var length = mapping.length();
    for (i = 0; i < length; i++) {
        // refresh condition & condition description according to the condition XML
        var conditionXML = mapping[i][2];
        var queries = lib.conditionXmlParser.getRadQueryFromCondtionXml(conditionXML);
        var condition = queries[0];
        var conditionDesc = queries[1];

        mapping[i][0] = condition;
        mapping[i][1] = conditionDesc;
    }
}


/**
 * validate channel mapping record
 *
 * @param {SCFile}  mappingRecord
 * @returns {Object} 
 *          {result, field, message}
 */
function validateMapping(mappingRecord) {
    if (!mappingRecord) {
        return {
            result: false
        };
    }

    var mapping = mappingRecord.mapping;

    var invalidChannelMsg = funcs.scmsg(1, "ruleset", [funcs.scmsg("caption;channel", "msteams")]);

    var length = mapping.length();
    if (length == 0) {
        return {
            result: false,
            field: "mapping,channelId,1",
            message: invalidChannelMsg
        };
    }

    var i;
    for (i = 0; i < length; i++) {
        var channelId = mapping[i][3];
        if (!channelId) {
            return {
                result: false,
                field: "mapping,channelId," + String(i + 1),
                message: invalidChannelMsg
            };
        }
    }

    return {
        result: true
    };
}

/**
 * get all active channels
 *
 * @returns {Array} channel object {id, name, fullname}
 */
function getAllActiveChannels() {

    // key: teamId, value: displayName
    var teamMap = new Map();

    var channels = [];

    var isMultiInstanceMode = lib.MicrosoftTeamsConfiguration.isMultiInstanceMode();

    // key: teamId, value: integration name
    var intMap = new Map();

    $("!msTeamsChannelInfo").fields("channelId", "displayName", "teamId").find('active=true').each(function(channel) {
        var teamId = channel.teamId;

        var channelObj = {
            id: channel.channelId,
            name: channel.displayName,
            fullname: channel.displayName
        };

        if (!teamMap.has(teamId)) {
            var team = $("!msTeamsTeamInfo").fields("displayName").find('teamId=:id', teamId).one();
            if (team) {
                teamMap.set(teamId, team.displayName);
            }
        }

        var teamName = teamMap.get(teamId);
        if (teamName) {
            channelObj.fullname = teamName + " - " + channelObj.name;
        }

        // append integration name in multiple company mode
        if (isMultiInstanceMode) {
            var intName;
            if (!intMap.has(teamId)) {
                intName = lib.MicrosoftTeamsUtil.getIntNameByTeamId(teamId);
                intMap.set(teamId, intName);
            } else {
                intName = intMap.get(teamId);
            }

            if (intName) {
                channelObj.fullname = intName + " - " + channelObj.fullname;
            }
            // integration instance has been deleted, show int id instead
            else {
                var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(teamId);
                channelObj.fullname = intId + " - " + channelObj.fullname;
            }
        }

        channels.push(channelObj);
    });

    return channels;
}


/**
 * return all supported modules
 *
 * @returns {Array}
 */
function getAllModules() {
    var modules = [];

    $("!msTeamsChannelMapping").fields("tablename").selectAll().each(function(mapping) {
        modules.push(mapping.tablename);
    });

    return modules;
}

/**
 * generate team channel for specific record
 *
 * @param {SCFile) record
 * @param {String} mode
 *                 default or ess
 * @returns {Object}  channel information, the format is
 *          {
 *              error: {
 *                  code
 *                  message
 *              },
 *              id,
 *              webUrl
 *          }
 */
function generateChannelMessage(record, mode) {

    var fileName = funcs.filename(record);
    var key = record.getUniqueFields()[0];
    var fileId = record[key];

    // special error code
    const codeNotFound = lib.MicrosoftTeamsConstants.ERROR_CODE_NOTFOUND();
    const codeForbidden = lib.MicrosoftTeamsConstants.ERROR_CODE_FORBIDDEN();

    var fMapping = $("!msTeamsChannelMapping").fields("mapping").find("tablename=:tablename", fileName).one();
    if (!fMapping) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("12", "msteams")
            }
        };
    }

    // get corresponding channel
    var channelId = getChannelMeetCondition(fMapping);

    if (!channelId) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("13", "msteams")
            }
        };
    }

    // get respond message
    var fMessageInfo = lib.MicrosoftTeamsUtil.getMessageInfo(record);

    if (fMessageInfo) {
        // return message url if channel mapping unchanged
        if (fMessageInfo.channelId == channelId) {
            return {
                id: fMessageInfo.messageId,
                webUrl: fMessageInfo.webUrl
            };
        }
        // return message url for inactive message even if channel mapping changed.
        // inactive message means the record has been closed, no need to create new message.
        else if (!fMessageInfo.active) {
            if (logger.isDebugEnabled) {
                logger.debug("message has been inactive, will not create a new one although channel mapping changed.");
            }
            return {
                id: fMessageInfo.messageId,
                webUrl: fMessageInfo.webUrl
            };
        }
        // inactive message if channel mapping changed
        else {
            logger.info("channel mapping changed, inactive the previous message and create a new one.");

            // 1.synchronize replies for last time
            var sync = lib.MicrosoftTeamsMessage.newTaskForSyncReply(fMessageInfo);

            // 2.inactive message
            fMessageInfo.active = false;
            fMessageInfo.doUpdate();

            // 3.send channel changed reply
            logger.info(`post channel mapping changed reply of record "${fileName}:${fileId}".`);
            var tableName = funcs.scmsg(fileName, "tablename");
            var msgContent = sync ? funcs.scmsg("25", "msteams", [tableName]) : funcs.scmsg("26", "msteams", [tableName]);
            var chatMessageResource = {
                "body": {
                    "contentType": "html",
                    "content": msgContent
                }
            };
            lib.MicrosoftTeamsReply.replyMessage(fMessageInfo, chatMessageResource);
        }
    }

    // create message in channel
    var channelInfo = $("!msTeamsChannelInfo").fields("displayName", "teamId").find("channelId=:id", channelId).one();
    if (!channelInfo || !channelInfo.teamId) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("6", "msteams")
            }
        };
    }

    var teamId = channelInfo.teamId;
    var displayName = channelInfo.displayName;
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(teamId);

    logger.info(`[${intId}]`, `send message in team channel "${displayName}" for record "${fileName}:${fileId}".`);

    var response = API.postChannelMessage(intId, teamId, channelId, defaultChannelMessage(intId, record, mode));
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    var respError = respObj.error;
    if (respError) {
        logger.error(`[${intId}]`, JSON.stringify(respError));

        // return friendly error message
        switch (respError.code) {
            case codeNotFound:
                respError.message = funcs.scmsg("14", "msteams", [displayName]);
                break;
            case codeForbidden:
                respError.message = funcs.scmsg("17", "msteams", [displayName]);
                break;
        }

        return respObj;
    }

    logger.info(`[${intId}]`, "send channel message successfully.");

    // create message info record
    fMessageInfo = new SCFile("msTeamsMessageInfo");
    fMessageInfo.messageId = respObj.id;
    fMessageInfo.teamId = teamId;
    fMessageInfo.channelId = channelId;
    fMessageInfo.webUrl = decodeURIComponent(respObj.webUrl);
    fMessageInfo.fileName = fileName;
    fMessageInfo.fileId = fileId;
    fMessageInfo.active = true;

    var rc = fMessageInfo.doInsert();
    if (rc == RC_SUCCESS) {
        return {
            id: fMessageInfo.messageId,
            webUrl: fMessageInfo.webUrl
        };
    } else {
        return {
            error: {
                code: String(rc),
                message: RCtoString(rc)
            }
        };
    }

}


/**
 * get corresponding channel which meet condition
 *
 * @param {SCFile} mappingRecord
 * @returns {String} channel id
 */
function getChannelMeetCondition(mappingRecord) {

    // initial variables
    initConditionEditorVariables();

    var mapping = mappingRecord.mapping;
    var i;
    var length = mapping.length();
    var typeBoolean = lib.DataTypeConst.typeBoolean();
    for (i = 0; i < length; i++) {
        var condition = mapping[i][0];
        if (condition == null || condition == true || funcs.parse_evaluate(condition, typeBoolean)) {
            var channelId = mapping[i][3];
            if (channelId && channelId != lib.MicrosoftTeamsConstants.EMPTY_CHANNELID()) {
                if (logger.isDebugEnabled()) {
                    logger.debug("find channel which meet the condition: " + condition);
                }
                return channelId;
            }
        }
    }

    return null;
}


/**
 * initial variables for condition editor
 */
function initConditionEditorVariables() {

    // $L.category
    if (!vars.$L_category) {
        var categoryName = vars.$L_file.category;

        if (categoryName && vars.$L_object) {
            var categoryFileName = vars.$L_object.category_file_name;
            if (categoryFileName) {
                vars.$L_category = $(categoryFileName).find("name=:name", categoryName).one();
            }
        }
    }
}


/**
 * generate default channel message
 *
 * @param {SCFile} record
 * @param {String} mode
 *                 default or ess
 * @returns {Object}
 */
function defaultChannelMessage(intId, record, mode) {

    var content;

    var templateScript = lib.MicrosoftTeamsConfiguration.getMessagePostTemplate(intId);

    // use customized message template    
    if (templateScript) {
        try {
            content = eval('lib.' + templateScript + '(record, mode)');
        } catch (e) {
            logger.error(`[${intId}]`, e.message);
        }
    }

    // use default template
    if (!content) {
        content = lib.MicrosoftTeamsTemplate.generateMessage(record, mode);
    }

    content = JSON.stringify(content);
    return lib.MicrosoftTeamsChat.createChatMessageObj(content);
}


/**
 * check whether channel has message
 *
 * @param {String} channelId
 * @returns {Boolean}
 */
function checkChannelHasMessage(channelId) {
    var message = $("!msTeamsMessageInfo").fields("messageId").find("channelId=:id", channelId).one();
    return message != null;
}


/**
 * check whether channel is used in mapping
 *
 * @param {String} channelId
 * @returns {Boolean}
 */
function checkChannelUsedInMapping(channelId) {

    if (!channelId) {
        return false;
    }

    var found = false;

    // go through channel mappings
    $("!msTeamsChannelMapping").fields("mapping").selectAll().each(function(channelMapping) {
        var mapping = channelMapping.mapping;
        var i;
        var length = mapping.length();
        for (i = 0; i < length; i++) {
            if (channelId == mapping[i][3]) {
                found = true;
                return true;
            }
        }
    });

    return found;
}


/**
 * clear channel used in channel mapping
 *
 * @param {SCFile} channel
 */
function clearChannelUsedInMapping(channel) {

    if (!channel) {
        return;
    }

    var emptyChannelId = lib.MicrosoftTeamsConstants.EMPTY_CHANNELID();

    // go through channel mappings
    $("msTeamsChannelMapping").selectAll().each(function(channelMapping) {
        var found = false;

        var mapping = channelMapping.mapping;
        var i;
        var length = mapping.length();
        for (i = 0; i < length; i++) {
            if (channel.channelId == mapping[i][3]) {
                mapping[i][3] = emptyChannelId;
                found = true;
            }
        }

        if (found) {
            var rc = channelMapping.doUpdate();
            if (rc == RC_SUCCESS) {
                logger.info(funcs.scmsg("20", "msteams", [channel.displayName, channelMapping.tablename]));
            }
        }
    });
}


/**
 * check whether the user is the channel owner
 */
function isChannelOwner(intId, teamId, channelId, userId) {
    if (!userId) {
        return false;
    }

    var response = API.channelMembers(intId, teamId, channelId);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return false;
    }

    var value = respObj.value;
    if (!value) {
        return false;
    }

    var i;
    for (i = 0; i < value.length; i++) {
        var member = value[i];
        if (member.roles == ROLE_OWNER && member.userId == userId) {
            return true;
        }
    }

    return false;
}