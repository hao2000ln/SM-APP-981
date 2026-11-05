/******************************************************
 * Module Name: Microsoft Teams Notification
 * Function: API
 * Author: Zhang, Qi
 * Version: 1.00
 * Creation Date: Aug, 2022
 *******************************************************/
var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsNotification");


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
    lib.MicrosoftBotConversation.setLoggerLevel(level);
    lib.MicrosoftTeamsChat.setLoggerLevel(level);
}


/**
 * send notifications to the conversation of specific users
 * the function will create tasks in the SMIS queue
 *
 * @param {Datum} users
 * @param {String} text
 * @param {String} refId
 * @returns {Boolean}
 */
function sendNotifications(users, text, refId) {
    if (!text) {
        return false;
    }
    
    // ignore default empty notification text
    if (text == funcs.scmsg(1971, "us")) {
        return false;
    }

    users = lib.ArrayUtil.toJsArray(users);
    if (!users || users.length == 0) {
        return false;
    }

    var operatorName = lib.MicrosoftTeamsUtil.getOperatorNameByUser(users[0]);
    var intId = lib.MicrosoftTeamsUtil.getIntIdByOperator(operatorName);
    if (!intId) {
        return false;
    }

    if (!lib.MicrosoftTeamsConfiguration.isEnabled(intId)) {
        return false;
    }

    if (logger.isDebugEnabled()) {
        var message = `send to "${users}": "${text}"`;
        if (refId) {
            message = `"${refId}" ${message}`;
        }
        logger.debug(message);
    }

    var notificationMode = lib.MicrosoftTeamsConfiguration.getNotificationMode(intId) ||
        lib.MicrosoftTeamsConstants.NOTIFICATION_MODE_USER();

    // bot conversation
    if (notificationMode == lib.MicrosoftTeamsConstants.NOTIFICATION_MODE_BOT()) {
        return lib.MicrosoftBotConversation.newNotificationTasks(intId, users, text, refId);
    }
    // user chat
    else {
        return lib.MicrosoftTeamsChat.newNotificationTasks(intId, users, text, refId);
    }
}


/**
 * sends notification message
 *
 * @param {String} operatorName
 * @param {String} serviceUrl
 * @param {String} conversationId
 * @param {String} message
 * @returns {Object}
 */
function sendNotification(intId, operatorName, serviceUrl, conversationId, message) {

    logger.info(`[${intId}]`, `send message to "${operatorName}".`);
    if (logger.isDebugEnabled()) {
        logger.debug(`[${intId}]`, `raw message is: ${message}`);
    }

    if (!message) {
        var msg = "message to send is empty!";
        logger.warn(`[${intId}]`, msg);
        return {
            error: {
                code: lib.MicrosoftTeamsConstants.ERROR_CODE_NOTFOUND(),
                message: msg
            }
        };
    }

    // bot conversation
    if (serviceUrl) {
        return lib.MicrosoftBotConversation.sendToConversation(intId, operatorName, serviceUrl, conversationId, message);
    }
    // user chat
    else {
        return lib.MicrosoftTeamsChat.sendToChat(intId, operatorName, conversationId, message);
    }
}