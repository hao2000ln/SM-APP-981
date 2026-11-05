var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsMessage");
var API = lib.MicrosoftGraphAPI;

// JSON batch requests size, maximum is 20
var isBatchMode = true;
const BATCH_REQUEST_SIZE = 10;

const PROP_NEXTLINK = "@odata.nextLink";


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
 * synchronize replies for all active team channel messages
 *
 * @param {String} module
 * @param {String} piiDisplayName
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code,
 *                  message
 *              },
 *              count,
 *              attachments: [
 *                  messageId,
 *                  values: []
 *              ],
 *              hostedContents: [
 *                  messageId,
 *                  values: []
 *              ]
 *          }
 */
function synchronizeAllActiveMessages(intId, module, piiDisplayName) {
    logger.info(`[${intId}]`, `synchronize all active message replies.`);

    var query = `fileName="${module}" and active=true`;

    if (lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
        // append teamId query
        var teamIds = [];
        $("!msTeamsTeamInfo").fields("teamId").find("intId=:intId", intId).each(
            (team) => teamIds.push(team.teamId)
        );

        if (teamIds.length == 0) {
            query = "false";
        } else {
            var strTeamIds = "";
            var i;
            for (i = 0; i < teamIds.length; i++) {
                if (i > 0) {
                    strTeamIds += ',';
                }
                strTeamIds += '"' + teamIds[i] + '"';
            }
            query += ' and teamId isin {' + strTeamIds + '}';
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug(`[${intId}]`, `message query: ${query}`);
    }

    return synchronizeMessages(query, piiDisplayName);
}


/**
 * synchronize replies for multiple team channel messages
 *
 * @param {String} query
 * @param {String} piiDisplayName
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code,
 *                  message
 *              },
 *              count,
 *              attachments: [
 *                  messageId,
 *                  values: []
 *              ],
 *              hostedContents: [
 *                  messageId,
 *                  values: []
 *              ]
 *          }
 */
function synchronizeMessages(query, piiDisplayName) {
    const t0 = Date.now();

    var attachmentsAll = [];
    var hostedContentsAll = [];
    var error;
    var countMessage = 0;
    var countReply = 0;

    var result;

    // single mode
    if (!isBatchMode) {
        logger.info("batch mode is off");

        $("msTeamsMessageInfo", SCFILE_READONLY).find(query).forEach(function(message) {
            result = synchronizeMessage(message, piiDisplayName);
            if (result.error) {
                error = result.error;
            } else {
                countMessage++;
                countReply += result.count;

                if (result.attachments && result.attachments.length > 0) {
                    var attachmentObj = {
                        messageId: message.messageId,
                        values: result.attachments
                    };
                    attachmentsAll.push(attachmentObj);
                }

                if (result.hostedContents && result.hostedContents.length > 0) {
                    var contentObj = {
                        messageId: message.messageId,
                        values: result.hostedContents
                    };
                    hostedContentsAll.push(contentObj);
                }
            }
        });
    }
    // batch mode
    else {
        logger.info("batch mode is on, batch size is " + BATCH_REQUEST_SIZE + ".");

        var messageIds = [];
        var messageNumber = 0;

        $("!msTeamsMessageInfo").fields("messageId").find(query).forEach(function(message) {
            messageNumber++;
            messageIds.push(message.messageId);

            if (messageNumber == BATCH_REQUEST_SIZE) {
                result = synchronizeMessagesInBatchMode(messageIds, null, piiDisplayName);
                if (result.error) {
                    error = result.error;
                } else {
                    countMessage += BATCH_REQUEST_SIZE;
                    countReply += result.count;

                    if (result.attachments && result.attachments.length > 0) {
                        attachmentsAll = attachmentsAll.concat(result.attachments);
                    }
                    if (result.hostedContents && result.hostedContents.length > 0) {
                        hostedContentsAll = hostedContentsAll.concat(result.hostedContents);
                    }
                }

                messageNumber = 0;
                messageIds = [];
            }
        });

        // synchronize messages left
        if (messageIds.length > 0) {
            result = synchronizeMessagesInBatchMode(messageIds, null, piiDisplayName);
            if (result.error) {
                error = result.error;
            } else {
                countMessage += messageIds.length;
                countReply += result.count;

                if (result.attachments && result.attachments.length > 0) {
                    attachmentsAll = attachmentsAll.concat(result.attachments);
                }
                if (result.hostedContents && result.hostedContents.length > 0) {
                    hostedContentsAll = hostedContentsAll.concat(result.hostedContents);
                }
            }
        }
    }

    result = {
        "count": countReply,
        "attachments": attachmentsAll,
        "hostedContents": hostedContentsAll
    };

    if (error) {
        result.error = error;
    }

    const t1 = Date.now();

    logger.info("totally " + countReply + (countReply > 1 ? " replies" : " reply") + " of " + countMessage + (countMessage > 1 ? " messages" : " message") + " synchronized, " +
        "time elapsed: " + (t1 - t0) / 1000 + "s.");

    return result;
}


/**
 * synchronize replies for all multiple team channel messages in batch mode
 *
 * @param {Array} messageIds 
 * @param {Array} urls (optional) 
 * @param {String} piiDisplayName
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code,
 *                  message
 *              },
 *              count,
 *              attachments: [
 *                  messageId,
 *                  values: []
 *              ],
 *              hostedContent: [
 *                  messageId,
 *                  values: []
 *              ]
 *          }
 */
function synchronizeMessagesInBatchMode(messageIds, urls, piiDisplayName) {

    if (!messageIds || messageIds.length == 0) {
        return {
            count: 0
        };
    }

    var result;
    var message;
    var intId;

    // single message
    if (messageIds.length == 1) {
        message = $("msTeamsMessageInfo", SCFILE_READONLY).find("messageId=:id", messageIds[0]).one();

        if (urls && urls.length == 1 && urls[0]) {
            intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(message.teamId);
            var pagingValue = pagingReplies(intId, [], urls[0]);
            result = lib.MicrosoftTeamsReply.saveReplyInfo(message, pagingValue, piiDisplayName);
        } else {
            result = synchronizeMessage(message, piiDisplayName);
        }

        if (result.error) {
            return result;
        }

        var attachments = [{
            messageId: messageIds[0],
            values: result.attachments
        }];

        var hostedContents = [{
            messageId: messageIds[0],
            values: result.hostedContents
        }];

        return {
            "count": result.count,
            "attachments": attachments,
            "hostedContents": hostedContents
        };
    }

    // multiple messages

    var messageMap = new Map();
    var i;
    var messageId;

    if (urls) {
        for (i = 0; i < messageIds.length; i++) {
            messageId = messageIds[i];
            message = $("msTeamsMessageInfo", SCFILE_READONLY).find("messageId=:id", messageId).one();
            messageMap.set(String(i), message);
        }
    } else {
        urls = [];

        for (i = 0; i < messageIds.length; i++) {
            messageId = messageIds[i];
            message = $("msTeamsMessageInfo", SCFILE_READONLY).find("messageId=:id", messageId).one();
            messageMap.set(String(i), message);

            var teamId = message.teamId;
            var channelId = message.channelId;
            var url = `/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies`;
            urls.push(url);
        }
    }

    intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(message.teamId);
    var responseObj = lib.MicrosoftTeamsUtil.jsonBatchGet(intId, urls);
    if (responseObj.error) {
        logger.error(`[${intId}]`, "synchronizeInBatchMode", JSON.stringify(responseObj.error));
        return responseObj;
    }

    var count = 0;
    var attachmentsAll = [];
    var hostedContentsAll = [];

    // paging
    var pagingMessageIds = [];
    var pagingUrls = [];

    var values = responseObj.values;
    for (i = 0; i < values.length; i++) {
        message = messageMap.get(String(i));
        if (!message) {
            continue;
        }

        if (values[i].error) {
            logger.error(`[${intId}]`, 'synchronize replies of "' + message.fileName + ":" + message.fileId + '" in batch mode failed: ' + JSON.stringify(values[i].error));
            continue;
        }

        var value = values[i].value;
        if (!value || value.length == 0) {
            continue;
        }

        // get paging replies
        var nextLink = values[i][PROP_NEXTLINK];
        if (nextLink) {
            pagingMessageIds.push(message.messageId);
            pagingUrls.push(nextLink);
        }

        // save replies
        result = lib.MicrosoftTeamsReply.saveReplyInfo(message, value, piiDisplayName);

        if (result.attachments && result.attachments.length > 0) {
            var attachmentObj = {
                messageId: message.messageId,
                values: result.attachments
            };
            attachmentsAll.push(attachmentObj);
        }

        if (result.hostedContents && result.hostedContents.length > 0) {
            var contentObj = {
                messageId: message.messageId,
                values: result.hostedContents
            };
            hostedContentsAll.push(contentObj);
        }

        count += result.count;
    }

    // get paging result
    if (pagingUrls.length > 0) {
        var pagingResult = synchronizeMessagesInBatchMode(pagingMessageIds, pagingUrls, piiDisplayName);
        if (!pagingResult.error) {
            count += pagingResult.count;
            var pagingAttachments = pagingResult.attachments;
            if (pagingAttachments && pagingAttachments.length > 0) {
                attachmentsAll = attachmentsAll.concat(pagingAttachments);
            }
            var pagingContents = pagingResult.hostContents;
            if (pagingContents && pagingContents.length > 0) {
                hostedContentsAll = hostedContentsAll.concat(pagingContents);
            }
        }
    }

    return {
        "count": count,
        "attachments": attachmentsAll,
        "hostedContents": hostedContentsAll
    };
}


/**
 * synchronize replies for a team channel message
 *
 * this function doesn't synchronize attachments, 
 * it returns attachment names of new replies
 *
 * @param {SCFile} message msTeamsMessageInfo
 * @param {String} piiDisplayName
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code,
 *                  message
 *              },
 *              count,
 *              attachments: [],
 *              hostedContents: []
 *          }
 */
function synchronizeMessage(message, piiDisplayName) {

    var teamId = message.teamId;
    var channelId = message.channelId;
    var messageId = message.messageId;
    var fileName = message.fileName;
    var fileId = message.fileId;

    if (logger.isDebugEnabled()) {
        logger.debug(`synchronize message replies of record "${fileName}:${fileId}".`);
    }

    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(teamId);
    var response = API.channelMessageReplies(intId, teamId, channelId, messageId);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`synchronize replies of "${fileName}:${fileId}" failed: ` + JSON.stringify(respObj.error));
        return respObj;
    }

    var value = respObj.value;

    // get paging replies
    var nextLink = respObj[PROP_NEXTLINK];
    value = pagingReplies(intId, value, nextLink);

    // save replies
    return lib.MicrosoftTeamsReply.saveReplyInfo(message, value, piiDisplayName);
}


/**
 * get paging replies
 *
 * @param {Array} values
 * @param {String} nextLink
 * @returns {Array}
 *
 * @see https://docs.microsoft.com/en-us/graph/paging
 */
function pagingReplies(intId, values, nextLink) {
    while (nextLink) {
        if (logger.isDebugEnabled()) {
            logger.debug(`[${intId}]`, `next replies link: ${nextLink}`);
        }

        var response = API.resourceLink(intId, nextLink);
        var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

        if (respObj.error) {
            logger.error(`[${intId}]`, "pagingReplies", JSON.stringify(respObj.error));
            break;
        }

        var valueDelta = respObj.value;
        if (valueDelta) {
            values = values.concat(valueDelta);
        }

        nextLink = respObj[PROP_NEXTLINK];
    }

    return values;
}


/** 
 * close record message
 *
 * @param {SCFile} record
 */
function closeRecordMessage(record) {
    var messageInfo = lib.MicrosoftTeamsUtil.getMessageInfo(record);
    if (!messageInfo) {
        return;
    }

    logger.info('close message of record "' + messageInfo.fileName + ':' + messageInfo.fileId + '".');

    // 1. synchronize replies for last time
    var sync = newTaskForSyncReply(messageInfo);

    // 2. inactive messageInfo
    messageInfo.active = false;
    messageInfo.doUpdate();

    // 3. send record closed reply
    if (sync) {
        var fileName = messageInfo.fileName;
        var fileId = messageInfo.fileId;

        logger.info(`post closed reply of record "${fileName}:${fileId}".`);
        var chatMessageResource = {
            "body": {
                "contentType": "html",
                "content": funcs.scmsg("24", "msteams", [funcs.scmsg(fileName, "tablename")])
            }
        };
        lib.MicrosoftTeamsReply.replyMessage(messageInfo, chatMessageResource);
    }
}


/**
 * new task for synchronize message
 *
 * @param {SCFile} messageInfo
 * @returns {Boolean}
 *      true if task created to sync reply, even task exists already
 *      false means SMIS integration disabled or not synchronize message 
 */
function newTaskForSyncReply(messageInfo) {
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(messageInfo.teamId);
    var configItem = lib.MicrosoftTeamsConfiguration.getConfigurationItem(intId);
    if (configItem) {
        if (configItem.getConfigParameterValue("synchronizeMessage")) {
            lib.MicrosoftTeamsTaskManager.newTaskForSyncReply(configItem, messageInfo);
            return true;
        } else {
            logger.info(`[${intId}]`, `Message synchronization is disabled, ignore reply synchronization.`);
        }
    } else {
        logger.error(`[${intId}]`, `MicrosoftTeams integration is disabled, ignore reply synchronization.`);
    }

    return false;
}


/**
 * check whether message has reply
 *
 * @param {String} messageId
 * @returns {Boolean}
 */
function checkMessageHasReply(messageId) {
    var reply = $("!msTeamsReplyInfo").fields("replyId").find("messageId=:id", messageId).one();
    return reply != null;
}