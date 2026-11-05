var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsTaskManager");


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
}


/**
 * create new SMIS task for attachments metadata synchronization according to msTeamsChannelInfo record
 *
 * @param   {SCFile} configItem
 * @param   {String} channelId
 * @returns  {Boolean}
 */
function newTaskForSyncAttachmentMeta(configItem, channelId) {

    if (checkTaskForSyncAttachmentMeta(configItem, channelId)) {
        return false;
    }

    var channelInfo = $("!msTeamsChannelInfo").fields(["displayName", "driveId", "driveItemId"]).find("channelId=:id", channelId).one();

    var task = new SCFile("SMISTaskQueue");
    task.intId = configItem.intId;
    task.integrationName = configItem.name;
    task.object = "msTeamsChannelInfo";
    task.internalId = channelInfo.displayName;
    task.externalId = channelId;
    var requestData = {
        "driveId": channelInfo.driveId,
        "driveItemId": channelInfo.driveItemId
    };
    task.requestData = formatJSONStringify(requestData);
    task.direction = "RL"; // Inbound
    task.action = lib.MicrosoftTeamsConstants.ACTION_SYNC_CHANNEL_ATTACHMENTS_METADATA();

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function defaultCheckQuery(configItem, action) {
    return 'intId="' + configItem.intId + '" and expired~=true and action="' + action + '"';
}


function checkTaskForSyncAttachmentMeta(configItem, channelId) {
    var query = defaultCheckQuery(configItem, lib.MicrosoftTeamsConstants.ACTION_SYNC_CHANNEL_ATTACHMENTS_METADATA());
    query += ' and object="msTeamsChannelInfo" and externalId="' + channelId + '"';

    var task = quickFindTask(query);
    return (task != null);
}


function quickFindTask(query) {
    return $("!SMISTaskQueue").fields("id").find(query).one();
}


/**
 * create new SMIS task for reply synchronization according to msTeamsMessageInfo record
 *
 * @param   {SCFile} configItem
 * @param   {SCFile} msgInfo
 * @returns  {Boolean}
 */
function newTaskForSyncReply(configItem, msgInfo) {

    if (checkTaskForSyncReply(configItem, msgInfo)) {
        return false;
    }

    var task = new SCFile("SMISTaskQueue");
    task.intId = configItem.intId;
    task.integrationName = configItem.name;
    task.object = msgInfo.fileName;
    task.internalId = msgInfo.fileId;
    task.externalId = msgInfo.messageId;
    task.direction = "RL"; // Inbound
    task.action = lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_REPLIES();

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function checkTaskForSyncReply(configItem, msgInfo) {
    var query = defaultCheckQuery(configItem, lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_REPLIES());
    query += ' and object="' + msgInfo.fileName + '" and internalId="' + msgInfo.fileId + '"';

    var task = quickFindTask(query);
    return (task != null);
}


/**
 * create new SMIS task for all active replies synchronization
 *
 * @param   {SCFile} configItem
 * @param   {String} module
 * @returns  {Boolean}
 */
function newTaskForSyncReplyAllActive(configItem, module) {

    if (checkTaskForSyncReplyAllActive(configItem, module)) {
        return false;
    }

    var task = new SCFile("SMISTaskQueue");
    task.intId = configItem.intId;
    task.integrationName = configItem.name;
    task.object = module;
    task.direction = "RL"; // Inbound
    task.action = lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_REPLIES();

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function checkTaskForSyncReplyAllActive(configItem, module) {
    // 1. check current task
    var action = lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_REPLIES();
    var query = defaultCheckQuery(configItem, action);
    query += ' and object="' + module + '" and null(internalId)';

    var task = quickFindTask(query);
    if (task) {
        return true;
    }

    // 2. check previous task during interval time
    var interval = configItem.getConfigParameterValue("synchronizeInterval");
    if (Number.isNaN(interval) || interval <= 0) {
        return false;
    }

    var intervalTime = funcs.str(new Date(Date.now() - interval * 60 * 1000));
    var intId = configItem.intId;
    query = `intId="${intId}" and null(internal.id) and internal.table.name="${module}" and action="${action}" and task.create.time>'${intervalTime}'`;

    var tasklog = $("!SMISTaskLog").fields("id").find(query).one();
    if (tasklog) {
        if (logger.isDebugEnabled()) {
            logger.debug(`[${intId}]`, `previous synchronize reply task found in last ${interval} minutes, ignore append task.`);
        }
        return true;
    } else {
        if (logger.isDebugEnabled()) {
            logger.debug(`[${intId}]`, `no previous synchronize reply task found in last ${interval} minutes, append new task.`);
        }
        return false;
    }
}


/**
 * create new SMIS task for attachments synchronization according to msTeamsMessageInfo record
 *
 * @param   {SCFile} configItem
 * @param   {SCFile} msgInfo
 * @param   {Array} attachments
 * @returns  {Boolean}
 */
function newTaskForSyncAttachments(configItem, msgInfo, attachments) {
    if (!msgInfo || !attachments || attachments.length == 0) {
        return false;
    }

    var result = false;

    attachments.forEach(function(attachment) {
        if (newTaskForSyncAttachment(configItem, msgInfo, attachment)) {
            result = true;
        }
    });

    return result;
}


/**
 * create new SMIS task for attachment synchronization according to msTeamsMessageInfo record
 *
 * @param   {SCFile} configItem
 * @param   {SCFile} msgInfo
 * @param   {String} attachment
 * @returns  {Boolean}
 */
function newTaskForSyncAttachment(configItem, msgInfo, attachment) {

    if (checkTaskForSyncAttachment(configItem, msgInfo, attachment)) {
        return false;
    }

    var channelInfo = $("!msTeamsChannelInfo").fields("displayName").find("channelId=:id", msgInfo.channelId).one();

    var task = new SCFile("SMISTaskQueue");
    task.intId = configItem.intId;
    task.integrationName = configItem.name;
    task.object = msgInfo.fileName;
    task.internalId = msgInfo.fileId;
    task.externalId = channelInfo.displayName + "/" + attachment;
    var requestData = {
        "messageId": msgInfo.messageId,
        "attachment": attachment
    };
    task.requestData = formatJSONStringify(requestData);
    task.direction = "RL"; // Inbound
    task.action = lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_ATTACHMENT();

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function checkTaskForSyncAttachment(configItem, msgInfo, attachment) {
    var query = defaultCheckQuery(configItem, lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_ATTACHMENT());
    var requestData = {
        "messageId": msgInfo.messageId,
        "attachment": attachment
    };
    query += ' and object="' + msgInfo.fileName + '" and internalId="' + msgInfo.fileId +
        '" and requestData="' + lib.StringUtil.escapeAllStr(formatJSONStringify(requestData)) + '"';

    var task = quickFindTask(query);
    return (task != null);
}


/**
 * create new SMIS task for hosted contents synchronization according to msTeamsMessageInfo record
 *
 * @param   {SCFile} configItem
 * @param   {SCFile} msgInfo
 * @param   {Array} hostedContentUrls
 * @returns  {Boolean}
 */
function newTaskForSyncHostedContents(configItem, msgInfo, hostedContentUrls) {
    if (!msgInfo || !hostedContentUrls || hostedContentUrls.length == 0) {
        return false;
    }

    var result = false;

    hostedContentUrls.forEach(function(url) {
        if (newTaskForSyncHostedContent(configItem, msgInfo, url)) {
            result = true;
        }
    });

    return result;
}


/**
 * create new SMIS task for hosted content synchronization according to msTeamsMessageInfo record
 *
 * @param   {SCFile} configItem
 * @param   {SCFile} msgInfo
 * @param   {String} hostedContentUrl
 * @returns  {Boolean}
 */
function newTaskForSyncHostedContent(configItem, msgInfo, hostedContentUrl) {

    if (checkTaskForSyncHostedContent(configItem, msgInfo, hostedContentUrl)) {
        return false;
    }

    var task = new SCFile("SMISTaskQueue");
    task.intId = configItem.intId;
    task.integrationName = configItem.name;
    task.object = msgInfo.fileName;
    task.internalId = msgInfo.fileId;
    var contentId = lib.MicrosoftTeamsHostedContent.getHostedContentIdFromUrl(hostedContentUrl);
    task.externalId = "hostedContent:" + lib.MicrosoftTeamsHostedContent.mapContentId(contentId);
    var requestData = {
        "messageId": msgInfo.messageId,
        "url": hostedContentUrl
    };
    task.requestData = formatJSONStringify(requestData);
    task.direction = "RL"; // Inbound
    task.action = lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_HOSTEDCONTENT();

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function checkTaskForSyncHostedContent(configItem, msgInfo, hostedContentUrl) {
    var query = defaultCheckQuery(configItem, lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_HOSTEDCONTENT());
    var requestData = {
        "messageId": msgInfo.messageId,
        "url": hostedContentUrl
    };
    query += ' and object="' + msgInfo.fileName + '" and internalId="' + msgInfo.fileId + '" and requestData="' +
        lib.StringUtil.escapeAllStr(formatJSONStringify(requestData)) + '"';

    var task = quickFindTask(query);
    return (task != null);
}


/**
 * post reply for attachment synchronized failed
 *
 * @param {SCFile} task
 */
function postFailedAttachmentReply(task) {

    var fileName = task.object;
    var fileId = task.internalId;

    logger.info(`post synchronize attachment failed reply of record "${fileName}:${fileId}".`);

    var requestData;
    try {
        requestData = JSON.parse(task.requestData);
    } catch (e) {
        logger.error(e.message);
        return;
    }

    var messageId = requestData.messageId;
    var attachment = requestData.attachment;

    var msgInfo = $("msTeamsMessageInfo", SCFILE_READONLY).find("messageId=:id", messageId).one();
    if (!msgInfo) {
        logger.error(`message not found of record "${fileName}:${fileId}".`);
        return;
    }

    var msg = funcs.scmsg("attachment;6", "msteams", ["<b>" + attachment + "</b>"]);
    if (task.responseMsg) {
        msg += "<br>" + task.responseMsg;
    }

    var chatMessageResource = {
        "body": {
            "contentType": "html",
            "content": msg
        }
    };

    lib.MicrosoftTeamsReply.replyMessage(msgInfo, chatMessageResource);
}


/**
 * post reply for image hosted content synchronized failed
 *
 * @param {SCFile} task
 */
function postFailedImageReply(task) {

    var fileName = task.object;
    var fileId = task.internalId;

    logger.info(`post synchronize image failed reply of record "${fileName}:${fileId}".`);

    var requestData;
    try {
        requestData = JSON.parse(task.requestData);
    } catch (e) {
        logger.error(e.message);
        return;
    }

    var messageId = requestData.messageId;

    var msgInfo = $("msTeamsMessageInfo", SCFILE_READONLY).find("messageId=:id", messageId).one();
    if (!msgInfo) {
        logger.error(`message not found of record "${fileName}:${fileId}".`);
        return;
    }

    var msg = funcs.scmsg("attachment;7", "msteams");
    if (task.responseMsg) {
        msg += "<br>" + task.responseMsg;
    }

    var chatMessageResource = {
        "body": {
            "contentType": "html",
            "content": msg
        }
    };

    lib.MicrosoftTeamsReply.replyMessage(msgInfo, chatMessageResource);
}


/**
 * create new SMIS task for send notification
 *
 * @param   {SCFile} configItem
 * @param   {SCFile} conversationReference
 * @param   {String} message
 * @param   {String} refId
 * @returns  {Boolean}
 */
function newTaskForNotification(configItem, conversationReference, message, refId) {

    var task = new SCFile("SMISTaskQueue");
    task.intId = configItem.intId;
    task.integrationName = configItem.name;
    task.object = "msConversation";
    task.internalId = refId + " > " + conversationReference.operatorName;
    task.externalId = conversationReference.operatorName;
    var requestData = {
        "serviceUrl": conversationReference.serviceUrl || "",
        "conversationId": conversationReference.conversationId || "",
        "message": message || ""
    };
    task.requestData = formatJSONStringify(requestData);
    task.direction = "LR"; // Outbound
    task.action = lib.MicrosoftTeamsConstants.ACTION_SEND_MESSAGE();

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


/**
 * create new SMIS task for refresh the refresh token
 *
 * @param   {SCFile} configItem
 * @returns  {Boolean}
 */
function newTaskForRefreshRefreshToken(configItem) {

    var intId = configItem.intId;
    var tokenModule = lib.MicrosoftTeamsUtil.getTeamsTokenModule(intId);

    if (checkTaskForRefreshRefreshToken(configItem, tokenModule)) {
        return false;
    }

    var task = {
        "intId": intId,
        "integrationName": configItem.name,
        "object": "oauthToken",
        "internalId": tokenModule,
        "direction": "RL", // Inbound
        "action": lib.MicrosoftTeamsConstants.ACTION_REFRESH_REFRESHTOKEN()
    };

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function checkTaskForRefreshRefreshToken(configItem, tokenModule) {
    // 1. check grant type
    var grantType = configItem.getConfigParameterValue("grantType");
    if (grantType != lib.OAuthAuthentication.grantTypeAuthCode()) {
        return true;
    }

    // 2. check current task
    var action = lib.MicrosoftTeamsConstants.ACTION_REFRESH_REFRESHTOKEN();
    var query = defaultCheckQuery(configItem, action);

    var task = quickFindTask(query);
    if (task) {
        return true;
    }

    var intId = configItem.intId;

    // 3. check last refresh time of current token
    var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(tokenModule);
    if (!ftoken) {
        if (logger.isDebugEnabled()) {
            logger.debug(`[${intId}]`, `token not retrieved yet, ignore append refresh token task.`);
        }
        return true;
    }

    var needRefresh = lib.OAuthAuthentication.needRefreshRefreshToken(ftoken.lastRefreshTime);

    if (needRefresh) {
        logger.info(`[${intId}]`, `refresh token needs to refresh, append new task.`);
    }

    return !needRefresh;
}


function formatJSONStringify(obj) {
    return JSON.stringify(obj, null, "   ");
}