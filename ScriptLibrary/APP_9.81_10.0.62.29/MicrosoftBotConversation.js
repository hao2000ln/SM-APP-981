/******************************************************
 * Module Name: Microsoft Bot Conversation
 * Function: API
 * Author: Zhang, Qi
 * Version: 1.00
 * Creation Date: Feb, 2022
 *******************************************************/
var $ = lib.c.$;
var logger = getLog("MicrosoftBotConversation");
var restAPI = lib.MicrosoftBotRestAPI;

const codeNotFound = lib.MicrosoftTeamsConstants.ERROR_CODE_NOTFOUND();


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
    restAPI.setLoggerLevel(level);
}


/**
 * add or update bot conversation reference
 *
 * @param {Object} conversationReference
 *              format is:
 *              {
 *                 "conversationId": <unique id of conversation>
 *                 "serviceUrl": <base URL for bot API requests>
 *                 "botId": <unique id of bot>
 *                 "userId": <Microsoft user id>
 *                 "operatorName": <SM operator name>
 *              }
 * @param {Boolean}
 */
function addConversationReference(conversationReference) {
    if (!conversationReference) {
        logger.error("conversation reference is empty!");
        return false;
    }

    if (logger.isDebugEnabled()) {
        logger.debug("conversation reference: " + JSON.stringify(conversationReference));
    }

    var conversationId = conversationReference.conversationId;
    if (!conversationId) {
        logger.error("conversation id is empty!");
        return false;
    }

    var serviceUrl = conversationReference.serviceUrl;
    if (!serviceUrl) {
        logger.error("service url is empty!");
        return false;
    }

    var botId = conversationReference.botId;
    if (!botId) {
        logger.error("bot id is empty!");
        return false;
    }

    var userId = conversationReference.userId;
    var operatorName = conversationReference.operatorName;
    if (!userId) {
        logger.error("Microsoft user id is empty!");
        return false;
    }

    var reference = $("msConversation").find("conversationId=:id", conversationId).one();
    var rc;

    // add
    if (!reference) {
        reference = new SCFile("msConversation");
        reference.conversationId = conversationId;
        reference.serviceUrl = serviceUrl;
        reference.botId = botId;
        reference.userId = userId;
        // operatorName is a redundant field copied from msUserInfo
        reference.operatorName = operatorName;

        rc = reference.doInsert();
        if (rc != RC_SUCCESS) {
            logger.error("add reference failed: " + RCtoString(rc));
            return false;
        }

        return true;
    }
    // update
    else {
        var changed = (reference.serviceUrl != serviceUrl) ||
            (reference.botId != botId) ||
            (reference.userId != userId) ||
            (reference.operatorName != operatorName);

        if (changed) {
            reference.serviceUrl = serviceUrl;
            reference.botId = botId;
            reference.userId = userId;
            if (operatorName) {
                reference.operatorName = operatorName;
            }

            rc = reference.doUpdate();
            if (rc != RC_SUCCESS) {
                logger.error("update reference failed: " + RCtoString(rc));
                return false;
            }
        }
        return true;
    }
}


/**
 * create SMIS send notification tasks
 *
 * @param {String} intId
 * @param {Array} users
 * @param {String} text
 * @param {String} refId
 * @returns {Boolean} true if task created
 */
function newNotificationTasks(intId, users, text, refId) {
    var botAppId = lib.MicrosoftTeamsConfiguration.getBotClientID(intId);
    if (!botAppId) {
        logger.warn(`[${intId}]`, "Bot application id is empty.");
        return false;
    }

    var configItem = lib.MicrosoftTeamsConfiguration.getConfigurationItem(intId);

    var result = false;

    users.forEach(function(user) {
        if (!user) {
            return;
        }

        var operatorName = lib.MicrosoftTeamsUtil.getOperatorNameByUser(user);
        if (!operatorName) {
            logger.warn(`[${intId}]`, `User "${user}" not found.`);
            return;
        }

        // format of bot id in conversation is '28:botAppId' 
        var botId = `28:${botAppId}`;

        // find conversation
        var conversation = $("msConversation", SCFILE_READONLY).find("operatorName=:name and botId=:botId", operatorName, botId).one();

        // conversation not started for user yet
        if (!conversation) {
            conversation = new SCFile("msConversation");
            conversation.operatorName = operatorName;

            // find serviceUrl of the bot
            var exist = $("!msConversation").fields("serviceUrl").find("botId=:id and not null(serviceUrl)", botId).one();
            if (!exist || !exist.serviceUrl) {
                logger.warn(`[${intId}]`, "Bot API endpoint not found.");
                return;
            }

            conversation.serviceUrl = exist.serviceUrl;
        }

        // create bot conversation task
        if (lib.MicrosoftTeamsTaskManager.newTaskForNotification(configItem, conversation, text, refId)) {
            result = true;
        }
    });

    return result;
}


/**
 * sends conversation message
 *
 * @param {String} operatorName
 * @param {String} serviceUrl
 * @param {String} conversationId
 * @param {String} message
 * @returns {Object}
 */
function sendToConversation(intId, operatorName, serviceUrl, conversationId, message) {

    var activityObj = createActivityObj(message);

    // not talk with bot yet, create conversation first
    if (!conversationId) {
        var msg;
        var msUserId = lib.MicrosoftTeamsUtil.getMsUserByOperator(operatorName);

        if (!msUserId) {
            msg = funcs.scmsg("28", "msteams", [operatorName]);
            logger.warn(`[${intId}]`, msg);
            return {
                error: {
                    code: codeNotFound,
                    message: msg
                }
            };
        }

        var botId = lib.MicrosoftTeamsConfiguration.getBotClientID(intId);
        var result = startConversation(intId, msUserId, botId, serviceUrl, activityObj);

        if (result.error) {
            return result;
        }

        // create conversation record
        if (result.id) {
            var conversation = new SCFile("msConversation");
            conversation.conversationId = result.id;
            conversation.userId = msUserId;
            conversation.operatorName = operatorName;
            conversation.botId = botId;
            conversation.serviceUrl = serviceUrl;
            conversation.doInsert();
        } else {
            msg = JSON.stringify(result);
            logger.error(`[${intId}]`, msg);
            return {
                error: {
                    code: codeNotFound,
                    message: msg
                }
            };
        }
    }

    // call bot RESTful API    
    var response = restAPI.sendConversationActivity(intId, serviceUrl, conversationId, activityObj);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
    }

    return respObj;
}


/**
 * create activity object according to the text
 *
 * @see https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-api-reference#activity-object
 *
 * @param {String} text
 * @returns {Object}
 */
function createActivityObj(text) {
    var activityObj = {
        "type": "message"
    };

    var cardObj = null;
    try {
        cardObj = JSON.parse(text);
    } catch (e) {}

    // support both plain text and card
    if (!cardObj) {
        activityObj.text = text;
    } else {
        var attachment = {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": cardObj
        };
        activityObj.attachments = [attachment];
    }

    return activityObj;
}


/**
 * start a new conversation
 *
 * @param {String} intId
 * @param {String} userId
 * @param {String} botId
 * @param {String} serviceUrl
 * @param {Object} activityObj
 * @returns {Object}
 */
function startConversation(intId, userId, botId, serviceUrl, activityObj) {

    var tenantId = lib.MicrosoftTeamsConfiguration.getTenantID(intId);

    var conversationObj = {
        "bot": {
            "id": botId
        },
        "isGroup": false,
        "members": [{
            "id": userId
        }],
        "tenantId": tenantId,
        "activity": activityObj
    };

    // call bot RESTful API    
    var response = restAPI.startConversation(intId, serviceUrl, conversationObj);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
        return respObj;
    }

    // {"id": conversationId}
    return respObj;
}