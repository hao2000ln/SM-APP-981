var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsHostedContent");
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
 * get hosted content urls from reply
 *
 * @param {SCFile} reply
 * @returns {Array}
 */
function getHostedContentUrls(reply) {

    var hostedContentUrls = [];

    var teamId = reply.teamId;
    var channelId = reply.channelId;
    var messageId = reply.messageId;
    var replyId = reply.replyId;

    // embeded image content has the string as below:
    // src="https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies/${replyId}/hostedContents/${contentId}/$value"

    var regPrefix = lib.AzureAuthentication.API_ENDPOINT() + `/v1.0/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies/${replyId}/hostedContents/`;
    regPrefix = regPrefix.replace(/\//g, "\\/");
    regPrefix = regPrefix.replace(/\./g, "\\.");
    var regSuffix = '\/\\$value"';

    var regexp = new RegExp('\\s+src\\s*=\\s*"' + regPrefix + '[A-Za-z0-9_=]+' + regSuffix, "g");

    var content = reply.content;
    if (content) {
        var results = content.match(regexp);
        if (results) {
            results.forEach(function(result) {
                var url = result.substring(result.indexOf('"') + 1, result.length - 1);
                hostedContentUrls.push(url);
            });
        }
    }

    return hostedContentUrls;
}


/**
 * synchronize hosted content of the record
 *
 * @param {String} messageId
 * @param {String} hostedContentUrl
 * @returns {Object} the format is
 *          {
 *              error: {
 *                  code
 *                  message
 *              },
 *              count
 *          }
 */
function synchronizeHostedContent(messageId, hostedContentUrl) {
    var msgInfo = $("!msTeamsMessageInfo").fields("teamId", "fileName", "fileId").find("messageId=:id", messageId).one();
    if (!msgInfo) {
        logger.error(`synchronize hosted content failed, message "${messageId}" not found.`);
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("15", "msteams")
            }
        };
    }

    var fileName = msgInfo.fileName;
    var fileId = msgInfo.fileId;

    // check record
    var key = funcs.dbdict_helper("unique.key", fileName)[0];
    var file = $(fileName, SCFILE_READONLY).fields(key).find(key + "=:id", fileId).one();
    if (!file) {
        logger.warn(`record "${fileName}:${fileId}" not found, ignore.`);
        return {
            count: 0
        };
    }

    logger.info(`synchronize hosted content of record "${fileName}:${fileId}".`);
    if (logger.isDebugEnabled()) {
        logger.debug(`hosted content url: ${hostedContentUrl}`);
    }

    var contentId = getHostedContentIdFromUrl(hostedContentUrl);
    if (!contentId) {
        logger.error(`synchronize hosted content failed, hosted content url is invalid: ${hostedContentUrl}`);
        return {
            error: {
                code: codeNotFound,
                message: funcs.scmsg("23", "msteams")
            }
        };
    }

    // get hosted content 
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(msgInfo.teamId);
    var respHeaders = {};
    var response = lib.MicrosoftGraphAPI.resourceLink(intId, hostedContentUrl, respHeaders, true);

    // response in JSON format if error occurred
    var respObj = {};
    try {
        respObj = JSON.parse(response);
    } catch (e) {}
    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    var contentType = respHeaders["Content-Type"];
    if (logger.isDebugEnabled()) {
        logger.debug(`hosted content type: ${contentType}`);
    }

    var strError;

    // check attachment type
    var attachmentType = getSupportedTypeByContentType(contentType[0]);
    if (!attachmentType || !lib.AttachmentUtil.isAttachmentAllowed(`test.${attachmentType}`)) {
        strError = funcs.scmsg("attachment;3", "msteams");
        logger.warn(`[${intId}]`, strError);
        return {
            error: {
                code: "InternalError",
                message: strError
            }
        };
    }

    // get related attachment file name
    var attachmentName = convertContentIdToAttachmentName(contentId, attachmentType);

    if (logger.isDebugEnabled()) {
        logger.debug(`hosted content attachment name: ${attachmentName}`);
    }

    // ignore if attachment exists
    var query = "application=:fileName and topic=:fileId and filename=:attachment";
    var sysattachment = $("!SYSATTACHMENTS").fields("uid").find(query, fileName, fileId, attachmentName).one();
    if (sysattachment) {
        logger.warn(`attachment "${attachmentName}" already exists, ignore.`);
        return {
            count: 0
        };
    }

    // check attachment size
    var attachmentSize = response.length;
    strError = lib.MicrosoftTeamsAttachment.checkAttachmentSize(fileName, fileId, attachmentSize);
    if (strError) {
        logger.warn(`[${intId}]`, strError);
        return {
            error: {
                code: "InternalError",
                message: strError
            }
        };
    }

    // insert attachment
    var attachObj = new Attachment();
    attachObj.name = attachmentName;
    attachObj.type = attachmentType;
    attachObj.value = response;
    var uuid = file.insertAttachment(attachObj);
    var rc = getLastRC();

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
 * get hosted content id from resource url
 *
 * @param {String} hostedContentUrl
 * @returns {String}
 */
function getHostedContentIdFromUrl(hostedContentUrl) {
    if (!hostedContentUrl) {
        return "";
    }

    // resource url format:
    // https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies/${replyId}/hostedContents/${contentId}/$value

    var suffix = "/$value";
    if (!hostedContentUrl.endsWith(suffix)) {
        return "";
    }

    var url = hostedContentUrl.substring(0, hostedContentUrl.length - suffix.length);
    var index = url.lastIndexOf('/');
    if (index == -1 || index == url.length - 1) {
        return "";
    }

    return url.substring(index + 1);
}


/**
 * get supported attachment type according to the contentType
 *
 * @param {String} contentType e.g. image/png
 * @returns {String}
 */
function getSupportedTypeByContentType(contentType) {
    // support image only
    if (contentType == null || !contentType.startsWith("image/")) {
        return null;
    }

    return contentType.substring(6);
}


/**
 * convert content id to attachment name
 *
 * @param {String} contentId
 * @param {String} type
 * @returns {String}
 */
function convertContentIdToAttachmentName(contentId, type) {

    var prefix = "Teams_";

    var name = prefix + mapContentId(contentId);
    if (type) {
        name += "." + type;
    }

    return name;
}


function mapContentId(contentId) {
    if (!contentId) {
        return "";
    }

    // content id is a very long string, convert into shorter string as attachment name
    return funcs.make_sig(contentId);
}