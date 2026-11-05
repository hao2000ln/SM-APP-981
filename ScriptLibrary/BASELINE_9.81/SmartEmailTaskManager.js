/******************************************************
 * Module Name: SmartEmail Task Manager
 * Function: Task Manager to read and update task
 * Author: Tian, ShaoQin
 * Version: 1.10
 * Creation Date: Mar, 2016
 *******************************************************/

var $ = lib.c.$;
var logger = getLog("SmartEmailTaskManager");


function getNextTask() {
    const LOCK_NAME = "SmartEmail_Lock";

    lib.SmartEmailSMHelper.lock(LOCK_NAME);

    try {
        const templateName = "SmartEmail";
        var task = lib.smis_TaskManager.readFirstTaskToExecute(templateName);

        if (task != null) {
            // update task's status to running
            task.status = lib.smis_Constants.TASK_STATUS_RUNNING();
            lib.smis_TaskManager.updateTask(task);
        }

        return task;
    } catch (err) {
        print(err);
    } finally {
        lib.SmartEmailSMHelper.unlock(LOCK_NAME);
    }
}


/**
 * create new SMIS task for refresh the refresh token
 *
 * @param   {SCFile} configItem
 * @returns  {Boolean}
 */
function newTaskForRefreshRefreshToken(configItem) {

    var intId = configItem.intId;
    var tokenModule = lib.SmartEmailUtil.getSmartEmailTokenModule(intId);

    if (checkTaskForRefreshRefreshToken(configItem, tokenModule)) {
        return false;
    }

    var task = {
        "intId": intId,
        "integrationName": configItem.name,
        "object": "oauthToken",
        "internalId": tokenModule,
        "inRecord": {}, // empty object 
        "direction": "RL", // Inbound
        "action": lib.SmartEmailConstants.ACTION_REFRESH_REFRESHTOKEN()
    };

    var id = lib.smis_TaskManager.pushTask(task);
    return id != null;
}


function defaultCheckQuery(intId, action) {
    return `intId="${intId}" and expired~=true and action="${action}"`;
}


function quickFindTask(query) {
    return $("!SMISTaskQueue").fields("id").find(query).one();
}


function checkTaskForRefreshRefreshToken(configItem, tokenModule) {
    // 1. check graph protocol
    var protocol = configItem.getConfigParameterValue("protocol");
    if (!lib.SmartEmailUtil.isEWSGraph(protocol)) {
        return true;
    }

    // 2. check grant type
    var grantType = configItem.getConfigParameterValue("grantType");
    if (grantType != lib.OAuthAuthentication.grantTypeAuthCode()) {
        return true;
    }

    var intId = configItem.intId;

    // 3. check current task
    var action = lib.SmartEmailConstants.ACTION_REFRESH_REFRESHTOKEN();
    var query = defaultCheckQuery(intId, action);

    var task = quickFindTask(query);
    if (task) {
        return true;
    }

    // 4. check last refresh time of current token
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