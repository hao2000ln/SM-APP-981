/******************************************************
 * Module Name: SMOO
 * Function: RESTful way to execute OO flow
 * Author: Yang, Wen-Ying
 * Version: 1.00
 * Creation Date: May, 2010
 *******************************************************/
var log = getLog('SMOOHttpRequest');
//log.setLevel('debug');

function getEnabledOOConfigItem() {
    return lib.smis_ConfigurationManager.getEnabledConfigItem("SMOO");
}

function getBaseUrl() {
    var confItem = getEnabledOOConfigItem();
    if (!confItem) {
        funcs.msg(funcs.scmsg("ConfigurationManager_8", "smis"), 2);
        return false;
    }

    var url = confItem.getConfigParameterValue("oo.server.url");
    if (lib.SMOOUtil.checkURL(url)) {
        return url;
    } else {
        funcs.msg(funcs.scmsg(15, "smoo"), 2);
        return false;
    }
}

function getUUID(name) {
    var file = new SCFile("OOFlow", SCFILE_READONLY);
    file.setFields("uuid");

    var findUUID = file.doSelect("name=\"" + name + "\"");
    if (findUUID == RC_SUCCESS) {
        return file.uuid;
    } else {
        var msg = funcs.scmsg(6, "smoo", [name]);
        print(msg);
        return null;
    }
}

function getDisplayName(uuid) {
    var file = new SCFile("OOFlow", SCFILE_READONLY);
    file.setFields("name");

    var findUUID = file.doSelect("uuid=\"" + uuid + "\"");
    if (findUUID == RC_SUCCESS) {
        return file.name;
    } else {
        return null;
    }
}

//return true when the required fields are filled, return false if not.
function checkValidation(requiredList, valueList) {
    var i = 0;
    if (requiredList.length() > 0) {
        while (i in requiredList) {
            if (requiredList[i] == "true" || requiredList[i] == true) {
                if (valueList != null && i in valueList) {
                    if (valueList[i] == null || valueList[i] == "") {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            i++;
        }
    }

    return true;
}

function authorHeader() {
    var confItem = getEnabledOOConfigItem();
    var userName = confItem.getConfigParameterValue("oo.user.name");
    var password = confItem.getConfigParameterValue("oo.password");
    return lib.SMOOUtil.basicAuthorHeader(userName, password);
}

function csrfHeader(token) {
    return header("X-CSRF-TOKEN", token);
}


function outHeaderList(list) {
    var k = 0;
    for (k = 0; k < list.length; k++) {
        log.debug('HEADER', k, '>>>', list[k].name, '->', list[k].value);
    }

    return list;
}

function csrfCookie(token) {
    var header = new Header();
    header.name = "Cookie";
    header.value = "X-CSRF-TOKEN-OO=" + token;
    return header;
}

function jsonHeader() {
    return header("Content-Type", "application/json");
}

function header(name, value) {
    var h = new Header();
    h.name = name;
    h.value = value;
    return h;
}

function findCookie(cookieList, name) {
    var k = 0;
    for (k = 0; k < cookieList.length; k++) {
        var item = cookieList[k];
        if (item.indexOf(name) == 0) {
            return item;
        }
    }

    return '';
}

function createHeaders() {
    if (log.isDebugEnabled()) {
        log.debug('>>> create headers');
    }

    var baseUrl = getBaseUrl();
    if (!baseUrl) {
        return [];
    }

    var url = lib.SMOOUtil.joinUrl(baseUrl, '/oo/rest/v2/l10n/available-languages');
    var respList = {};
    var basicAuthor = authorHeader();
    var confItem = getEnabledOOConfigItem();
    var connTimeout = parseInt(confItem.getConfigParameterValue("http.conn.timeout"));
    var recTimeout = parseInt(confItem.getConfigParameterValue("http.rec.timeout"));
    if (Number.isNaN(connTimeout)) {
        connTimeout = 30;
    }
    if (Number.isNaN(recTimeout)) {
        recTimeout = 30;
    }

    // get session id
    if (log.isDebugEnabled()) {
        log.debug('>>> create headers: get-session-id: url=', url);
    }
    doHTTPRequest("HEAD", url, [basicAuthor], '', connTimeout, recTimeout, recTimeout, respList);
    // var cookieList = respList['Set-Cookie'];
    var cookie = findCookie(respList['Set-Cookie'], 'JSESSIONID');

    if (log.isDebugEnabled()) {
        log.debug('>>> create headers: get-session-id: cookie=', cookie);

        // get csrf token
        log.debug('>>> create headers: get-csrf-token: url=', url);
    }

    doHTTPRequest("HEAD", url, [header("Cookie", cookie)], '', connTimeout, recTimeout, recTimeout, respList);
    var token = respList['X-CSRF-TOKEN'];
    cookie = cookie + '; X-CSRF-TOKEN-OO=' + token;
    if (log.isDebugEnabled()) {
        log.debug('>>> create headers: get-csrf-token: token=', token);
        log.debug('>>> create headers: get-csrf-token: cookie=', cookie);
        log.debug('<<< create headers');
    }

    return [basicAuthor, jsonHeader(), csrfHeader(respList['X-CSRF-TOKEN']), header("Cookie", cookie)];
}


function doExecute(uuid, paramList, valueList) {
    if (log.isDebugEnabled()) {
        log.debug('>>> doExecute');
    }

    if (typeof(paramList.length) == 'function') {
        paramList = paramList.toArray();
    }

    if (typeof(valueList.length) == 'function') {
        valueList = valueList.toArray();
    }

    var baseUrl = getBaseUrl();
    if (!baseUrl) {
        return '';
    }

    var url = lib.SMOOUtil.joinUrl(baseUrl, '/oo/rest/v2/executions');
    var params = {};
    var k = 0;
    for (k = 0; k < paramList.length; k++) {
        params[paramList[k]] = valueList[k];
    }

    var body = {
        flowUuid: uuid,
        logLevel: 'STANDARD',
        inputs: params
    };

    var confItem = getEnabledOOConfigItem();
    var connTimeout = parseInt(confItem.getConfigParameterValue("http.conn.timeout"));
    var recTimeout = parseInt(confItem.getConfigParameterValue("http.rec.timeout"));
    if (Number.isNaN(connTimeout)) {
        connTimeout = 30;
    }
    if (Number.isNaN(recTimeout)) {
        recTimeout = 30;
    }
    // Execute
    var headerList = createHeaders();
    if (log.isDebugEnabled()) {
        outHeaderList(headerList);
    }

    var bodyStr = rteJSONStringify(body);
    if (log.isDebugEnabled()) {
        log.debug('>>> doExecute: url=', url);
        log.debug('>>> doExecute: bodyStr=', bodyStr);
    }

    var respHeaders = {};
    var runId = doHTTPRequest("POST", url, headerList, bodyStr, connTimeout, recTimeout, 0, respHeaders);

    var returnCode = respHeaders.returnCode;
    if (returnCode != 200 && returnCode != 201) {
        log.error(`doExecute error ${returnCode}: ${runId}`);
        return '';
    }

    if (log.isDebugEnabled()) {
        log.debug('<<< doExecute: runId=', runId);
    }

    return runId;
}

/**
des: execute ooflow in restful way, return the response with code and url for popup message usage or error message.
para: 
uuid: OO flow uuid
paralist: OO flow para list
valuelist: OO flow value list
fildID: the number of Incident/Change where the report need to be saved
operator: the operator who execute the oo flow
asyncWay: true to be execute in async way
       false to be execute in sync way (wait the result of execution)
*/
function execute(uuid, paramList, valueList, fileID, operator, asyncWay, fileName, activityLogID) {
    /**
     * QCCR1E91727 set filename to empty string if fileName is null passed in
     */
    if (!fileName) {
        fileName = "";
    }

    var ooflowDN = getDisplayName(uuid);
    var url = getBaseUrl();
    if (!url) {
        var msg = funcs.scmsg(15, "smoo");
        return [msg];
    }

    var desarray = [];
    var errorMsg;

    if (uuid == null && uuid == "") {
        errorMsg = funcs.scmsg(7, "smoo");
        print(errorMsg);
        desarray = [];
        desarray[0] = "OO Flow:" + ooflowDN + ": " + errorMsg;
        desarray[1] = "======================================================================";
        activityLogID = updateActivityLog(desarray, fileID, operator, fileName);
        return [activityLogID];
    }

    var runId;
    try {
        runId = doExecute(uuid, paramList, valueList);
    } catch (ex) {
        print(ex);
        errorMsg = funcs.scmsg(8, "smoo", [ex.toString()]);
    }

    var json;

    if (!errorMsg) {
        // wait 1s to get result
        funcs.sleep(1);
        json = getExecuteStatus(runId, !asyncWay);
        if (json.error) {
            errorMsg = funcs.scmsg(8, "smoo", [JSON.stringify(json.error)]);
        }
    }

    if (errorMsg) {
        log.error("execute", errorMsg);
        desarray = [];
        desarray[0] = "OO Flow:" + ooflowDN + ": " + errorMsg;
        desarray[1] = "======================================================================";
        activityLogID = updateActivityLog(desarray, fileID, operator, fileName, activityLogID);
        return [activityLogID];
    }

    // print('json', rteJSONStringify(json));
    json = json.executionSummary;
    var returnCode = json.resultStatusType;
    // var response = json.resultStatusName;
    // var flowresult = rteJSONStringify(jsonLog.flowOutput);
    var flowresult = '';

    var reporturl = lib.SMOOUtil.joinUrl(getBaseUrl(), '/oo/#/runtimeWorkspace/runs/' + runId);

    desarray = lib.SMOOUtil.activityDescription(ooflowDN, runId, reporturl, json);
    activityLogID = updateActivityLog(desarray, fileID, operator, fileName, activityLogID);

    // task still running, create background schedule to update activity later
    if (asyncWay && json.status == 'RUNNING' && activityLogID) {
        generateActivitySchedule(ooflowDN, runId, fileName, activityLogID);
    }

    var res = [
        reporturl,
        returnCode,
        activityLogID,
        flowresult,
        runId,
        asyncWay
    ];
    return res;
}

function getExecuteStatus(runId, waitFor) {
    if (log.isDebugEnabled()) {
        log.debug('>>> getExecuteStatus: runId=', runId, 'waitFor=', waitFor);
    }
    var MAX_WAIT_TIME = 300;

    var url = getBaseUrl();
    if (!url) {
        return {};
    }

    var confItem = getEnabledOOConfigItem();

    url = lib.SMOOUtil.joinUrl(url, "/oo/rest/v2/executions/" + runId + "/execution-log");
    var userName = confItem.getConfigParameterValue("oo.user.name");
    var password = confItem.getConfigParameterValue("oo.password");
    var httpHeaders = [];
    var lang = confItem.getConfigParameterValue("Accept-Language");
    httpHeaders = lib.smis_RestClient.createBasicAuthHttpHeaders(lang, userName, password);

    try {
        var connTimeout = confItem.getConfigParameterValue("http.conn.timeout");
        var recTimeout = confItem.getConfigParameterValue("http.rec.timeout");

        var beginTime = Date.now();
        var waitTime = 0;
        var json = {};
        do {
            if (log.isDebugEnabled()) {
                log.debug('>>> getExecuteStatus: waitTime=', waitTime, 'url=', url);
            }

            var respHeaders = {};
            var strContent = lib.smis_RestClient.doRESTGetRequest(url, httpHeaders, parseInt(connTimeout), parseInt(recTimeout), parseInt(recTimeout), respHeaders);

            var returnCode = respHeaders.returnCode;
            if (returnCode != 200) {
                return {
                    "error": {
                        "code": returnCode,
                        "message": strContent
                    }
                };
            }

            json = rteJSONParse(strContent);
            if (log.isDebugEnabled()) {
                log.debug('>>> getExecuteStatus: json.executionSummary.status=', json.executionSummary.status);
            }

            waitTime = (Date.now() - beginTime) / 1000;

            if (json.executionSummary.status == 'RUNNING' && waitTime < MAX_WAIT_TIME && waitFor == true) {
                funcs.sleep(3);
            }
        } while (json.executionSummary.status == 'RUNNING' && waitTime < MAX_WAIT_TIME && waitFor == true);

    } catch (ex) {
        log.error("getExecuteStatus", ex);
    }

    return json;
}


/**
 * generate a schedule record to call 'getExecuteStatus' to update activity log
 *
 * @param {String} ooflowDN 
 * @param {String} runTaskID
 * @param {String} fileName
 * @param {String} activityLogID
 * @returns {String} schedule name
 */
function generateActivitySchedule(ooflowDN, runTaskID, fileName, activityLogID) {
    log.info(`create schedule to update activity log "${activityLogID}".`);

    var schedule = new SCFile("schedule");

    schedule._class = "linker";
    schedule.expiration = new Date();
    schedule.name = "scheduleUpdateOOActivityLog_" + runTaskID;

    const jsStr = `lib.SMOOHttpRequest.scheduleUpdateActivityLog("${ooflowDN}", "${runTaskID}", "${fileName}", "${activityLogID}");`;
    schedule.javascript = jsStr;

    var rc = schedule.doInsert();
    if (rc == RC_SUCCESS) {
        return schedule.name;
    } else {
        return null;
    }
}


/**
 * call 'getExecuteStatus' to update activity log in schedule
 *
 * @param {String} ooflowDN 
 * @param {String} runTaskID
 * @param {String} fileName
 * @param {String} activityLogID
 */
function scheduleUpdateActivityLog(ooflowDN, runTaskID, fileName, activityLogID) {

    // try to get task execute status
    var response = getExecuteStatus(runTaskID, true);

    if (response.error) {
        var errorMsg = funcs.scmsg(8, "smoo", [JSON.stringify(response.error)]);
        log.error("scheduleUpdateActivityLog", errorMsg);
        return;
    }

    var summary = response.executionSummary;
    var reportUrl = lib.SMOOUtil.joinUrl(getBaseUrl(), '/oo/#/runtimeWorkspace/runs/' + runTaskID);
    var description = lib.SMOOUtil.activityDescription(ooflowDN, runTaskID, reportUrl, summary);

    var activity = new SCFile(getActivityFileName(fileName));
    var rc = activity.doSelect(`thenumber="${activityLogID}"`);
    if (rc == RC_SUCCESS) {
        // replace description
        activity.description = description;
        activity.doUpdate();
    }
}


function addActivityLogOld(description, fileID, operator, fileName) {
    var activity = new SCFile(getActivityFileName(fileName));
    activity.type = "OO Response";
    activity.number = fileID;
    activity.datestamp = new Date();
    activity.operator = operator;
    activity.description = description;
    activity.doInsert();
    return activity.thenumber;
}

function addActivityLog(description, fileID, operator, fileName) {
    var rteReturnValue = new SCDatum();
    var rteNames = new SCDatum();
    var rteValues = new SCDatum();

    //Parameter names for RAD app message 
    rteNames.push("number1"); //number
    rteNames.push("string1"); //type
    rteNames.push("names"); // desc
    rteNames.push("text"); //filename

    //Parameter values for RAD app message
    rteValues.push(fileID);
    rteValues.push("OO Response");
    rteValues.push(description);
    rteValues.push(getActivityFileName(fileName));

    funcs.rtecall("callrad",
        rteReturnValue,
        "write.activity.log", //RAD app name
        rteNames,
        rteValues,
        false, //false to run in same thread, true to run in new thread
        true); //condition for executing the rad app

    return vars.$smradrtemessages; // rad return "thenumber" of activity record
}

function updateActivityLog(description, fileID, operator, fileName, activityLogID) {
    if (activityLogID != null) {
        var activity = new SCFile(getActivityFileName(fileName));
        var rc = activity.doSelect("thenumber=\"" + activityLogID + "\"");
        if (rc == RC_SUCCESS) {
            var oldLog = activity.description.toArray();
            activity.description = oldLog.concat(description);
            activity.doUpdate();
            return activity.thenumber;
        } else {
            return addActivityLog(description, fileID, operator, fileName);
        }
    } else {
        return addActivityLog(description, fileID, operator, fileName);
    }
}

function getActivityFileName(fileName) {
    var tmpfileName = fileName;
    if (fileName == "request") {
        tmpfileName = "Request";
    } else if (fileName == "requestTask") {
        tmpfileName = "RequestTask";
    } else if (fileName == "sdchat") {
        tmpfileName = "Sdchat";
    }

    var activityFileName = "activity" + tmpfileName;
    return activityFileName;
}