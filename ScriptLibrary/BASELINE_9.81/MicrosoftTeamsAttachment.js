var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsAttachment");
var API = lib.MicrosoftGraphAPI;

const codeNotFound = lib.MicrosoftTeamsConstants.ERROR_CODE_NOTFOUND();


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
 * synchronize attachments metadata of the channel
 *
 * @param {String} channelId
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code
 *                  message
 *              },
 *              count
 *          }
 */
function synchronizeAttachmentsMetadata(channelId) {

    logger.info(`synchronize attachment metadata of channel ${channelId}.`);

    var channel = $("msTeamsChannelInfo").find("channelId=:id", channelId).one();
    if (!channel) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("6", "msteams")
            }
        };
    }
    if (!channel.driveId || !channel.driveItemId) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("16", "msteams", [channel.displayName])
            }
        };
    }

    // list attachments of the channel
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(channel.teamId);
    var params = "$select=id,name,size,file";

    var response = API.driveItemChildren(intId, channel.driveId, channel.driveItemId, params);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    // update channel object
    var attachments = [];

    var value = respObj.value;
    if (value) {
        var messageAttachmentMap = getMessageAttachmentMap(channelId);

        value.forEach(function(item) {
            var attachment = $.createSCStructure(item.id, item.name, item.size);
            if (item.file) {
                attachment.push(item.file.mimeType);
            } else {
                attachment.push(null);
            }
            // include in files
            var files = getAttachmentIncludeInFiles(messageAttachmentMap, item.name);
            if (files && files.length > 0) {
                files.sort();
                attachment.push(files.join());
            }

            attachments.push(attachment);
        });
    }

    channel.attachments = attachments;

    var rc = channel.doUpdate();
    if (rc == RC_SUCCESS) {
        return {
            count: attachments.length
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
 * synchronize attachments of the record
 *
 * @param {String} messageId
 * @param {String} attachmentName
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code
 *                  message
 *              },
 *              count
 *          }
 */
function synchronizeAttachment(messageId, attachmentName) {
    var msgInfo = $("!msTeamsMessageInfo").fields(["channelId", "fileName", "fileId"]).find("messageId=:id", messageId).one();
    if (!msgInfo) {
        logger.error(`synchronize attachment "${attachmentName}" failed, message "${messageId}" not found.`);
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("15", "msteams")
            }
        };
    }

    var fileName = msgInfo.fileName;
    var fileId = msgInfo.fileId;

    logger.info(`synchronize attachment "${attachmentName}" of record "${fileName}:${fileId}".`);

    var channelInfo = $("!msTeamsChannelInfo").fields("teamId", "driveId", "attachments").find("channelId=:id", msgInfo.channelId).one();
    if (!channelInfo || !channelInfo.driveId || !channelInfo.attachments) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("attachment;1", "msteams")
            }
        };
    }

    // check attachment in the channel file folder
    var attachmentId;
    var attachmentSize;
    var attachmentType;

    var attachments = channelInfo.attachments;
    var i;
    var length = attachments.length();
    for (i = 0; i < length; i++) {
        if (attachmentName == attachments[i].name) {
            attachmentId = attachments[i].id;
            attachmentSize = attachments[i].size;
            attachmentType = attachments[i].mimeType;
            break;
        }
    }

    // attachment meta data may not synchronized yet, return error to retry
    if (!attachmentId) {
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("attachment;2", "msteams")
            }
        };
    }

    var strError;

    // check file extension
    if (!lib.AttachmentUtil.isAttachmentAllowed(attachmentName)) {
        strError = funcs.scmsg("attachment;3", "msteams");
        logger.warn(strError);
        return {
            error: {
                code: "InternalError",
                message: strError
            }
        };
    }

    // check attachment size
    strError = checkAttachmentSize(fileName, fileId, attachmentSize);
    if (strError) {
        logger.warn(strError);
        return {
            error: {
                code: "InternalError",
                message: strError
            }
        };
    }

    // check record
    var key = funcs.dbdict_helper("unique.key", fileName)[0];
    var file = $(fileName, SCFILE_READONLY).fields(key).find(key + "=:id", fileId).one();
    if (!file) {
        logger.warn(`record "${fileName}:${fileId}" not found, ignore.`);
        return {
            count: 0
        };
    }

    // list content
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(channelInfo.teamId);
    var response = API.driveItemContent(intId, attachmentType, channelInfo.driveId, attachmentId);

    // special error handle for "function type" response because of RTE's bug
    if (typeof response == "function") {
        var errorMsg = "unknown error occurred in doHttpRequest().";
        logger.error(`[${intId}]`, errorMsg);
        return {
            error: {
                code: "UnknownError",
                message: errorMsg
            }
        };
    }

    // response in JSON format if error occurred
    var respObj = {};
    try {
        respObj = JSON.parse(response);
    } catch (e) {}
    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    // rename if attachment exists
    var newName = lib.AttachmentUtil.adjustAttachmentName(fileName, fileId, attachmentName);
    if (newName != attachmentName) {
        attachmentName = newName;
        logger.info(`[${intId}]`, `attachment already exists, rename to "${attachmentName}".`);
    }

    // insert attachment
    var attachObj = new Attachment();
    attachObj.name = attachmentName;
    attachObj.type = attachmentType;
    attachObj.value = response;

    // check attachment content, make sure extension fit with content
    var rc = checkAttachmentLegal(attachObj);
    if (rc != RC_SUCCESS) {
        strError = funcs.scmsg("attachment;8", "msteams");
        logger.warn(strError);
        return {
            error: {
                code: "InternalError",
                message: strError
            }
        };
    }

    var uuid = file.insertAttachment(attachObj);
    rc = getLastRC();

    if (uuid && rc == RC_SUCCESS) {
        logger.info(`[${intId}]`, `attachment "${attachmentName}" created.`);
        return {
            count: 1
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
 * check attachment size
 *
 * @param {String} fileName
 * @param {String} fileId
 * @param {Number} attachmentSize
 * @returns {String}
 */
function checkAttachmentSize(fileName, fileId, attachmentSize) {

    var strError = null;

    // max size of single attachment
    var maxSize = vars.$G_system_info.max_attach_size;
    if (maxSize && attachmentSize > Number(maxSize)) {
        strError = funcs.scmsg("attachment;4", "msteams", [String(attachmentSize) + "(B)", String(maxSize) + "(B)"]);
        return strError;
    }

    // total size of single record
    var totalSize = vars.$G_system_info.total_attach_size;
    if (totalSize) {
        var query = 'application="' + fileName + '" and topic="' + fileId + '" and segment=0';
        var currentSize = attachmentSize;
        $("!SYSATTACHMENTS").fields("size").find(query).each(function(attach) {
            var size = attach.size;
            currentSize += size;
        });

        if (currentSize > Number(totalSize)) {
            strError = funcs.scmsg("attachment;5", "msteams", [String(currentSize) + "(B)", String(totalSize) + "(B)"]);
            return strError;
        }
    }

    return null;
}


/**
 * get message attachment map
 *
 * @param {String} channelId
 * @returns {Map} { key: messageId, value: attachment name list }
 */
function getMessageAttachmentMap(channelId) {

    var messageAttachmentMap = new Map();

    $("!msTeamsMessageInfo").fields("messageId").find("channelId=:id", channelId).each(function(message) {
        var messageId = message.messageId;

        var attlist = [];

        $("!msTeamsReplyInfo").fields("attachments").find("messageId=:id", messageId).each(function(reply) {
            var attachments = reply.attachments;
            if (!attachments || funcs._null(attachments)) {
                return false;
            }

            var i;
            var length = attachments.length();
            for (i = 0; i < length; i++) {
                attlist.push(attachments[i].name);
            }
        });

        messageAttachmentMap.set(messageId, attlist);
    });

    return messageAttachmentMap;
}


/**
 * get file list which contains attachment
 *
 * @param {Map} messageAttachmentMap
 * @param {String} attachmentName
 * @returns {Array}
 */
function getAttachmentIncludeInFiles(messageAttachmentMap, attachmentName) {
    if (!attachmentName) {
        return [];
    }

    var files = [];

    messageAttachmentMap.forEach(function(value, key) {
        if (value && value.indexOf(attachmentName) >= 0) {
            var message = $("!msTeamsMessageInfo").fields("fileId").find("messageId=:id", key).one();
            if (message) {
                files.push(message.fileId);
            }
        }
    });

    return files;
}