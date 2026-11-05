/******************************************************
 * Module Name: Microsoft Teams Chat
 * Function: API
 * Author: Zhang, Qi
 * Version: 1.00
 * Creation Date: Aug, 2022
 *******************************************************/
var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsChat");
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
 * create SMIS send notification tasks
 *
 * @param {String} intId
 * @param {Array} users
 * @param {String} text
 * @param {String} refId
 * @returns {Boolean} true if task created
 */
function newNotificationTasks(intId, users, text, refId) {
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

        // find conversation, user chat conversation not have botId and serviceUrl
        var conversation = $("msConversation", SCFILE_READONLY).find("operatorName=:name and null(botId) and null(serviceUrl)", operatorName).one();

        // conversation not started for user yet
        if (!conversation) {
            conversation = new SCFile("msConversation");
            conversation.operatorName = operatorName;
        }

        // create user chat task
        if (lib.MicrosoftTeamsTaskManager.newTaskForNotification(configItem, conversation, text, refId)) {
            result = true;
        }
    });

    return result;
}


/**
 * sends chat message
 *
 * @param {String} operatorName
 * @param {String} chatId
 * @param {String} message
 * @returns {Object}
 */
function sendToChat(intId, operatorName, chatId, message) {
    // not talk yet, create chat first
    if (!chatId) {
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

        // create one on one chat
        var result = createOneOnOneChat(intId, msUserId);
        if (result.error) {
            return result;
        }

        chatId = result.id;

        // create conversation record
        if (chatId) {
            var conversation = new SCFile("msConversation");
            conversation.conversationId = chatId;
            conversation.userId = msUserId;
            conversation.operatorName = operatorName;
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

    var chatMessageObj = createChatMessageObj(message);

    // post chat message    
    var response = API.postChatMessage(intId, chatId, chatMessageObj);
    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    if (respObj.error) {
        logger.error(`[${intId}]`, JSON.stringify(respObj.error));
    }

    return respObj;
}


/**
 * create an one on one chat
 *
 * @param {String} intId
 * @param {String} userId
 * @returns {Object}
 */
function createOneOnOneChat(intId, userId) {
    // default user to create chat
    var defaultUser = lib.MicrosoftTeamsConfiguration.getUsername(intId);

    const odataBind = lib.AzureAuthentication.API_ENDPOINT() + "/v1.0/users";

    var chatObj = {
        "chatType": "oneOnOne",
        "members": [{
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": ["owner"],
                "user@odata.bind": `${odataBind}('${userId}')`
            },
            {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                "roles": ["owner"],
                "user@odata.bind": `${odataBind}('${defaultUser}')`
            }
        ]
    };

    var response = API.createChat(intId, chatObj);
    return lib.MicrosoftTeamsUtil.parseResponse(response);
}


/**
 * create chat message object according to the text
 *
 * @see https://docs.microsoft.com/en-us/graph/api/chatmessage-post
 * 
 * @param {String} text
 * @returns {Object}
 */
function createChatMessageObj(text) {
    if (!text) {
        return {
            "body": {
                "content": ""
            }
        };
    }

    var isJSONFormat = true;
    try {
        JSON.parse(text);
    } catch (e) {
        isJSONFormat = false;
    }

    // plain text
    if (!isJSONFormat) {
        return {
            "body": {
                "contentType": "text",
                "content": text
            }
        };
    }

    // message in Adaptive Card format
    var uuid = lib.UUID.generateUUID();

    return {
        "body": {
            "contentType": "html",
            "content": "<attachment id=\"" + uuid + "\"></attachment>"
        },
        "attachments": [{
            "id": uuid,
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": text
        }]
    };
}