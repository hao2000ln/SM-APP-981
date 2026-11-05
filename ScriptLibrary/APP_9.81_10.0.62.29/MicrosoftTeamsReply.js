var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsReply");
var API = lib.MicrosoftGraphAPI;


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
 * save replyInfo record
 *
 * @param {SCFile} message
 * @param {Array} replyObjs
 * @param {String} piiDisplayName
 * @returns {Object}
 *          {
 *              count,
 *              attachments: [],
 *              hostedContents: []
 *          }
 */
function saveReplyInfo(message, replyObjs, piiDisplayName) {

    if (!replyObjs || replyObjs.length == 0) {
        if (logger.isDebugEnabled()) {
            logger.debug("no reply found.");
        }
        return {
            count: 0
        };
    }

    var fileName = message.fileName;
    var fileId = message.fileId;

    var countAdd = 0;
    var countUpdate = 0;
    var countDelete = 0;

    var fReply;
    var attachmentsAll = [];
    var hostedContentsAll = [];

    var ri;
    for (ri = 0; ri < replyObjs.length; ri++) {
        var replyObj = replyObjs[ri];

        var replyId = replyObj.id;
        fReply = $("msTeamsReplyInfo").find("replyId=:id", replyId).one();

        var rc;

        // message reply has been deleted in Teams, delete reply record 
        if (replyObj.deletedDateTime) {
            if (fReply) {
                rc = fReply.doDelete();
                if (rc == RC_SUCCESS) {
                    countDelete++;
                }
            }
        } else {
            var lastModifiedDateTime = new Date(replyObj.lastModifiedDateTime);

            // content
            var body = replyObj.body;

            // user
            var user = null;
            var from = replyObj.from;
            if (from) {
                user = from.user;
            }

            // user not exists, ignore bot reply 
            if (!user) {
                continue;
            }

            // hosted content
            var hostedContentUrls;

            // attachments
            var attachments = replyObj.attachments;

            var attachmentsDatum = [];
            var attachmentDatum;
            var attachmentName;

            // update reply
            if (fReply) {

                // compare last modified time, ignore milliseconds since it is not saved.
                var currentTime = fReply.lastModifiedDateTime;
                if (!currentTime || lastModifiedDateTime.getTime() > currentTime.getTime() + 1000) {

                    fReply.lastModifiedDateTime = lastModifiedDateTime;

                    // update content
                    if (body) {
                        fReply.contentType = body.contentType;
                        fReply.content = body.content;
                    } else {
                        fReply.contentType = "";
                        fReply.content = "";
                    }

                    // update user display name
                    if (user) {
                        // set user name to PII display name if has
                        fReply.userDisplayName = piiDisplayName || user.displayName;
                    }

                    // update host contents
                    hostedContentUrls = lib.MicrosoftTeamsHostedContent.getHostedContentUrls(fReply);
                    if (hostedContentUrls && hostedContentUrls.length > 0) {
                        hostedContentsAll = hostedContentsAll.concat(hostedContentUrls);
                    }

                    // attachments
                    if (attachments && attachments.length > 0) {

                        // current attachments
                        var attachmentsDatumOld = fReply.attachments;
                        var aoldlength = attachmentsDatumOld.length();
                        var attachmentOld;

                        var i;
                        var j;

                        // copy attachmentsDatumOld to attachmentsDatum
                        for (i = 0; i < aoldlength; i++) {
                            attachmentOld = attachmentsDatumOld[i];
                            if (attachmentOld.id) {
                                attachmentDatum = $.createSCStructure(attachmentOld.id, attachmentOld.name);
                                attachmentsDatum.push(attachmentDatum);
                            }
                        }

                        // check new attachments
                        for (i = 0; i < attachments.length; i++) {
                            var attachmentNew = attachments[i];
                            if (attachmentNew.contentType != "reference") {
                                continue;
                            }

                            attachmentName = attachmentNew.name;
                            var found = false;

                            // compare with current attachments
                            for (j = 0; j < aoldlength; j++) {
                                attachmentOld = attachmentsDatumOld[j];
                                if (attachmentOld.name == attachmentName) {
                                    found = true;
                                    break;
                                }
                            }

                            if (found) {
                                continue;
                            }

                            // new attachment
                            if (attachmentsAll.indexOf(attachmentName) == -1) {
                                attachmentsAll.push(attachmentName);
                            }

                            // add record
                            attachmentDatum = $.createSCStructure(attachmentNew.id, attachmentName);
                            attachmentsDatum.push(attachmentDatum);
                        }

                        fReply.attachments = attachmentsDatum;
                    }

                    rc = fReply.doUpdate();
                    if (rc == RC_SUCCESS) {
                        countUpdate++;
                    }
                }
            }
            // create new reply
            else {
                fReply = new SCFile("msTeamsReplyInfo");

                fReply.replyId = replyId;
                fReply.messageId = message.messageId;
                fReply.channelId = message.channelId;
                fReply.teamId = message.teamId;
                fReply.fileName = fileName;
                fReply.fileId = fileId;
                fReply.webUrl = replyObj.webUrl;
                fReply.lastModifiedDateTime = lastModifiedDateTime;
                fReply.createdDateTime = new Date(replyObj.createdDateTime);

                // user
                if (user) {
                    fReply.userId = user.id;
                    // set user name to PII display name if has
                    fReply.userDisplayName = piiDisplayName || user.displayName;
                }

                // content
                if (body) {
                    fReply.contentType = body.contentType;
                    fReply.content = body.content;
                }

                // hosted contents
                hostedContentUrls = lib.MicrosoftTeamsHostedContent.getHostedContentUrls(fReply);
                if (hostedContentUrls && hostedContentUrls.length > 0) {
                    hostedContentsAll = hostedContentsAll.concat(hostedContentUrls);
                }

                // attachments
                if (attachments && attachments.length > 0) {
                    attachments.forEach(function(attachment) {
                        if (attachment.contentType == "reference") {
                            attachmentName = attachment.name;
                            if (attachmentsAll.indexOf(attachmentName) == -1) {
                                attachmentsAll.push(attachmentName);
                            }

                            // update record
                            attachmentDatum = $.createSCStructure(attachment.id, attachmentName);
                            attachmentsDatum.push(attachmentDatum);
                        }
                    });

                    fReply.attachments = attachmentsDatum;
                }

                rc = fReply.doInsert();
                if (rc == RC_SUCCESS) {
                    countAdd++;
                }
            }
        }
    }

    var count = countAdd + countUpdate + countDelete;

    if (logger.isDebugEnabled()) {
        var info = count + " message " + (count > 1 ? "replies" : "reply") + ` synchronized of record "${fileName}:${fileId}".`;
        if (count > 0) {
            info += " add:" + countAdd + ", update:" + countUpdate + ", delete:" + countDelete + ".";
        }
        logger.debug(info);
    }

    return {
        "count": count,
        "attachments": attachmentsAll,
        "hostedContents": hostedContentsAll
    };
}


/**
 * create a new reply to a message
 *
 * @param {SCFile} message
 * @param {Object} chatMessageResource
 * @returns {Object}
 */
function replyMessage(message, chatMessageResource) {
    logger.info('post reply to message of record "' + message.fileName + ":" + message.fileId + '".');

    var teamId = message.teamId;
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(teamId);
    var response = API.replyMessage(intId, teamId, message.channelId, message.messageId, chatMessageResource);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    return respObj;
}