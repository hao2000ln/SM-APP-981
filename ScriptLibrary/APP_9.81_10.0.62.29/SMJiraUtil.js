var logger = getLog("jira.SMJiraUtil");
var $ = lib.c.$;
var getParam = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

var OUTBOUND = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
var INBOUND = lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
var BOTH = lib.smis_Constants.MAPPING_DIRECTION_BOTH();

var ACTIVITY_TYPE_JIRA = 'Jira Update';
var jiraRestBase = "rest/api/2";

function basicAuth(httpHeader, username, password) {
    var authHeader = new Header();
    authHeader.name = "Authorization";
    authHeader.value = "Basic " + lib.smis_CommonLib.encode64(username + ":" + password);
    httpHeader.push(authHeader);
    return httpHeader;
}
function bearerAuth(httpHeader, token) {
    var authHeader = new Header();
    authHeader.name = "Authorization";
    authHeader.value = "Bearer " + token;
    httpHeader.push(authHeader);
    return httpHeader;
}

function getSMISConfig(configItem) {
    var deployType = getParam(configItem, 'jira.deployType');
    var baseUrl = getParam(configItem, 'jira.baseUrl');
    var email = getParam(configItem, 'jira.email');
    var token = getParam(configItem, 'jira.token');
    var threads = getParam(configItem, 'jira.threads.number');
    var threads_max = getParam(configItem, 'jira.threads.number.max');

    var proxyHost = getParam(configItem, 'jira.proxyHost');
    var proxyPort = getParam(configItem, 'jira.proxyPort');
    var proxyUsername = getParam(configItem, 'jira.proxyUsername');
    var proxyPassword = getParam(configItem, 'jira.proxyPassword');

    var jiraProjects = getParam(configItem, 'jira.projects');
    var refeSMKey = getParam(configItem, 'jira.reference.smKey');
    var refeSMTable = getParam(configItem, 'jira.reference.smTable');
    var specialFields = getParam(configItem, 'jira.specialFields');
    var special = null;
    if (specialFields) {
        special = {};
        var arr = specialFields.split(";");
        var i;
        for (i = 0; i < arr.length; i++) {
            var item = arr[i].match(/(\S+):(\S+)/);
            if (item) {
                special[item[1]] = item[2];
            }
        }
    }
    var jiraStopPhase = getParam(configItem, 'jira.phase.skip');
    if (jiraStopPhase) {
        jiraStopPhase = jiraStopPhase.split("~");
    }

    var instance = configItem['intId'];

    var config = {
        "instance": instance,
        "deployType": deployType,
        "baseUrl": baseUrl,
        "email": email,
        "token": token,
        "threads": threads ? Number(threads) : 1,
        "threads_max": threads_max ? Number(threads_max) : 1,
        "proxyHost": proxyHost,
        "proxyPort": Number(proxyPort),
        "proxyUsername": proxyUsername ? proxyUsername : null,
        "proxyPassword": proxyPassword ? proxyPassword : null,
        "jiraProjects": jiraProjects,
        "refeSMKey": refeSMKey,
        "refeSMTable": refeSMTable,
        "specialFields": special,
        "jiraStopPhase": jiraStopPhase ? jiraStopPhase : []
    };
    return config;
}

/**
 * Create request header for http request
 */
function createRequestHeader(config) {
    var headers = [];
    if(config["deployType"] == "Data Center") {
        headers = bearerAuth(headers, config.token);
    }
    else {
        headers = basicAuth(headers, config.email, config.token);
    }
    
    var lan = vars['$G.my.language'];
    headers.push(new Header('Content-Type', 'application/json;charset=UTF-8'));
    headers.push(new Header('Accept-Language', lan));
    return headers;
}

function isHttpSuccess(responseHeader) {
    var returnCode = responseHeader['returnCode'];
    if (returnCode == 200 || returnCode == 201 || returnCode == 204) {
        return true;
    } else {
        return false;
    }
}
/**
 * Is Jira Enabled
 */
function isJiraEnable(file) {
    if (vars.$jiraEnable != null) {
        return vars.$jiraEnable;
    }
    return checkJiraEnable(file);
}

function checkJiraEnable(file) {
    var instance = getAllEnabledInstance(funcs.filename(file));
    if (instance && instance.length > 0) {
        vars.$jiraEnable = true;
        return true;
    }
    return false;
}

/**
 * @table Current module
 * @return Instances available for the current module and their associated jira projects
 */
function getAllEnabledInstance(table) {
    var projects = [];
    var instance = [];
    var alias = [];
    var singleProject = [];
    var sql = 'template="SMJira" and status~="Disabled"';
    $('!SMISConfiguration').fields('intId', 'paramInfo').find(sql).each(function(item) {
        var jiraProjects = getParam(item, 'jira.projects');
        var incidentEnabled = getParam(item, 'jira.incidentModuleEnabled');
        var ali = getParam(item, "jira.alias");
        var changeEnabled = getParam(item, 'jira.changeModuleEnabled');
        var instanceId = item['intId'];

        if (jiraProjects && matchTableAndModule(table, incidentEnabled, changeEnabled)) {
            projects.push(jiraProjects);
            instance.push(instanceId);
            alias.push(ali);
        }
    });
    var instanceInfo = {
        "alias": alias,
        "projects": projects,
        "instance": instance
    };
    vars.$G_jira_allInstanceInfo = JSON.stringify(instanceInfo);
    return instance;
}

/**
 * eg: if incident moudel is enable and current moudel is probsummary
 */
function matchTableAndModule(table, incidentEnabled, changeEnabled) {
    if (table == "probsummary") {
        return incidentEnabled == true || incidentEnabled == "true";
    } else if (table == "cm3r") {
        return changeEnabled == true || changeEnabled == "true";
    }
    return false;
}

function setLoggerLevel(level) {
    level = level ? level.toLowerCase() : "info";
    if (level == "off") {
        level = "fatal";
    }
    logger.setLevel(level);
    lib.SMJiraManager.setLoggerLevel(level);
    lib.SMJiraAdapter.setLoggerLevel(level);
    lib.JiraIncidentModule.setLoggerLevel(level);
    lib.JiraChangeModule.setLoggerLevel(level);
    lib.SMJiraService.setLoggerLevel(level);
}

/**
 * Check whether synchronization conditions are met for incident
 */
function customerIncidentConfig(file) {
    return checkAutoCondition(file);
}

/**
 * Check whether synchronization conditions are met for change
 */
function customerChangeConfig(file) {
    return checkAutoCondition(file);
}

function checkAutoCondition(file) {
    var table = funcs.filename(file);
    var projects = getAllEnabledInstance(table);
    var project = vars.$jiraProject;
    if (project && projects.includes(project) && vars.$jiraAction) {
        return true;
    }
    return false;
}

function autoSyncForIncident(file) {
    lib.SMJiraCustomerConfig.incidentAutoSync(file);
}

function autoSyncForChange(file) {
    lib.SMJiraCustomerConfig.changeAutoSync(file);
}

/* convert sm description(Array) to Jira description(rich text) */
function convertArrayToHtmlString(arr) {
    var i;
    var result = "";
    var len = lib.ArrayUtil.length(arr);
    if (len < 1) {
        return result;
    }
    result = lib.EmojiUtil.convertEmojiSymbol2Code(arr[0]);
    for (i = 1; i < len; i++) {
        if (arr[i]) {
            result = result + "\n" + lib.EmojiUtil.convertEmojiSymbol2Code(arr[i]);
        }
    }
    return result;
}

/* convert Jira description(rich text) to sm description(Array) */
function convertHtmlStringToArray(str) {
    if (!str) {
        str = "";
    }
    var arr = str.split("\n");
    arr = arr.filter(function(item) {
        return item.trim() != "";
    });
    return lib.ArrayUtil.toSCDatum(arr);
}

function getFieldMappingByInstanceId(instance) {
    var smisMappings = $('!SMISFieldMapping').fields(['fieldMapping']).find('intId=:instance', instance).one();
    if (smisMappings) {
        return smisMappings["fieldMapping"];
    } else {
        return null;
    }
}

function getValueMappingByInstanceId(instance) {
    var smisMappings = $('!SMISFieldMapping').fields(['valueMapping']).find('intId=:instance', instance).one();
    if (smisMappings) {
        return smisMappings["valueMapping"];
    } else {
        return null;
    }
}

/* get InboundFields by module and smisFieldmapping */
function getInboundFields(instance, smTable) {
    var fieldMappings = getFieldMappingByInstanceId(instance);
    var inBoundFieldList = [];
    var i;
    var smField;
    var epField;
    var direction;
    var module;
    var len = fieldMappings.length();
    for (i = 0; i < len; i++) {
        smField = fieldMappings[i]["SMField"];
        direction = fieldMappings[i]["direction"];
        module = fieldMappings[i]["SMModule"];
        if (!matchMoudel(smTable, module)) {
            continue;
        }
        if (direction == BOTH || direction == INBOUND) {
            inBoundFieldList.push(smField);
        }
    }
    return inBoundFieldList;
}

/* Get Jira's corresponding fieldList by fieldmapping and sm fieldlist */
function getEpFieldsBySMFields(instance, smFields, smTable) {
    var fieldMappings = getFieldMappingByInstanceId(instance);
    var epFieldList = [];
    var i;
    var smField;
    var epField;
    var module;
    var len = fieldMappings.length();
    for (i = 0; i < len; i++) {
        smField = fieldMappings[i]["SMField"];
        module = fieldMappings[i]["SMModule"];
        if (!matchMoudel(smTable, module)) {
            continue;
        }
        var index = smFields.indexOf(smField);
        if (index > -1) {
            epFieldList[index] = fieldMappings[i]['EPField'];
        }
    }
    return epFieldList;
}

/* Get SM's corresponding fieldList by fieldmapping and Jira fieldlist */
function getSMFieldsByEPFields(instance, epFields, smTable) {
    var fieldMappings = getFieldMappingByInstanceId(instance);
    var smFieldList = [];
    var i;
    var smField;
    var epField;
    var module;
    var len = fieldMappings.length();
    for (i = 0; i < len; i++) {
        epField = fieldMappings[i]["EPField"];
        module = fieldMappings[i]["SMModule"];
        if (!matchMoudel(smTable, module)) {
            continue;
        }
        var index = epFields.indexOf(epField);
        if (index > -1) {
            smFieldList[index] = fieldMappings[i]['SMField'];
        }
    }
    return smFieldList;
}

/**
 * convert Mon Dec 12 2022 20:52:30 GMT+0800 (China Standard Time) to 2022-12-12 20:52 
 * which is supported by jira api
 */
function convertDateToJiraDate(date) {
    date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minu = date.getMinutes();
    var result = year + "-" + month + "-" + day + " " + hour + ":" + minu;
    return result;
}

function getJiraInfoByJiraKey(key) {
    var jiraInfo = $('!JiraInfo', true).find('jiraKey="' + key + '"').one();
    return jiraInfo;
}

function getJiraInfoMoreById(id) {
    var jiraInfoMore = $('!JiraInfoMore', true).find('id="' + id + '"').one();
    return jiraInfoMore;
}

function getJiraInfoById(id) {
    var info = $('!JiraInfo', true).find('id="' + id + '"').one();
    return info;
}

function getJiraInfoBySMKey(smTable, smKey) {
    var query = 'smKey="' + smKey + '" and smTable ="' + smTable + '"';
    var jiraInfo = $('!JiraInfo', true).find(query).one();
    return jiraInfo ? jiraInfo : null;
}

function getJiraInfoMoreBySMKey(smTable, smKey) {
    var query = 'smKey="' + smKey + '" and smTable ="' + smTable + '"';
    var jiraInfoMore = $('!JiraInfoMore', true).find(query).one();
    return jiraInfoMore ? jiraInfoMore : null;
}

/**
 * Convert the time in different formats into timestamps and compare
 * @return Whether date1 is after(more than) date2
 */
function compareUpdateTimes(date1, date2) {
    if (!date1) {
        return false;
    }
    if (!date2) {
        return true;
    }
    var dateA = new Date(date1);
    var dateB = new Date(date2);
    return dateB < dateA;
}

function getSMRecordBySMKey(table, key) {
    if (table == "probsummary") {
        var incident = $('!probsummary', true).find('number="' + key + '"').one();
        return incident;
    } else if (table == "cm3r") {
        var change = $('!cm3r', true).find('number="' + key + '"').one();
        return change;
    }
}

/**
 * Match smtable and smisMoudel
 * probsummary - IncidentMoudel
 * cm3r - ChangeMoudel
 */
function matchMoudel(table, module) {
    if (getMoudelNameByTable(table) == module) {
        return true;
    }
    return false;
}

function getMoudelNameByTable(table) {
    switch (table) {
        case "cm3r":
            return "changeModule";
        case "probsummary":
            return "incidentModule";
        default:
            return null;
    }
}

function getJiraBrowseUrl(number) {
    var jiraInfo = $('!JiraInfo').fields(["id", "jiraBaseUrl", "jiraKey"]).find('smKey="' + number + '"').one();
    if (jiraInfo && jiraInfo['jiraKey']) {
        var url = jiraInfo['jiraBaseUrl'] + "/browse/" + jiraInfo['jiraKey'];
        return url;
    } else {
        return null;
    }
}

function hasEndPointInfo() {
    if (vars.$jiraProject && vars.$jiraAction) {
        return true;
    }
    return false;
}

//set configItem.module for field mapping
function setConfigItemModule(configItem, task) {
    var requestData = JSON.parse(task.requestData);
    var table = requestData['smTable'];
    var module = getMoudelNameByTable(table);
    configItem["configItem"]["module"] = module;
    lib.smis_ConfigurationManager.updateParam(configItem);
}

function generateJiraSMTable(smTable, instanceId, thread) {
    if (smTable && instanceId) {
        return smTable + "-" + instanceId + "-" + thread;
    } else {
        return null;
    }
}

function getActivityByCommentId(commentTable, smKey, commentId) {
    var activity = new SCFile(commentTable);
    var query = 'number = "' + smKey + '" and thenumber = "' + commentId + '"';
    if (activity.doSelect(query) == RC_SUCCESS) {
        var description = activity['description'];
        return convertArrayToHtmlString(description);
    } else {
        return null;
    }
}

/** struct for array of structure*/
function makeStruct() {
    var datum = new SCDatum();
    datum.setType(9);
    return datum;
}

/**
 * Add activity after cerate from sm to jira
 */
function addActivityForCreate(info) {
    var smTable = info.smTable;
    var actTable = getActTableBySMTable(smTable);
    var message = funcs.scmsg('jira-create-item', 'jira', [info.jiraType, info.jiraKey]);
    lib.OctaneUtil.addActivity(ACTIVITY_TYPE_JIRA, actTable, info.smKey, message);
}

/**
 * Add activity after sync attachment from sm to jira
 */
function addActivityForAttach(infoMore, attachName, syncResult) {
    var msgId = syncResult ? "jira-add-attach" : "jira-add-attach-fail";
    var info = getJiraInfoBySMKey(infoMore.smTable, infoMore.smKey);
    var actTable = getActTableBySMTable(info.smTable);
    var message = funcs.scmsg(msgId, 'jira', [attachName, info.jiraType, info.jiraKey]);
    lib.OctaneUtil.addActivity(ACTIVITY_TYPE_JIRA, actTable, info.smKey, message);
}

/**
 * get activity table
 */
function getActTableBySMTable(smTable) {
    var actTable = "activity";
    if (smTable == "cm3r") {
        actTable = "activitycm3r";
    }
    return actTable;
}

/**
 * Check whether the current SM record is active
 */
function isActive(smFile) {
    var fileName = funcs.filename(smFile);
    var field = "active";
    if (fileName == "probsummary") {
        field = "flag";
    } else if (fileName == "cm3r") {
        field = "active";
    }
    if (smFile[field] == true || smFile[field] == "true") {
        return true;
    } else {
        return false;
    }
}

/* Check if value is a valide time string */
function isDateValid(value) {
    if (value) {
        return !Number.isNaN(new Date(value).valueOf());
    } else {
        return false;
    }
}

/* nextId */
function nextId(name) {
    var nextNumber = new SCDatum();
    funcs.rtecall("getnumber", 1, nextNumber, name);
    return nextNumber;
}

/* Reassign threads if the thread ID is greater than the number of bus threads */
function assignThread(threadId, threadCount) {
    if (threadId <= threadCount) {
        return threadId;
    } else {
        var mod = threadId % threadCount;
        if (mod == 0) {
            return threadCount;
        } else {
            return mod;
        }
    }
}

/* Whether the string is in JSON format or not */
function isJsonString(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (obj && typeof obj == 'object') {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}

/* get jiraIssue by jiraKey*/
function pullJiraIssue(key, config, fields) {
    var headers = createRequestHeader(config);
    var url = config.baseUrl + "/" + jiraRestBase + "/issue/" + key;
    var appendQuery = appendFields(fields);
    url = url + appendQuery;
    var responseHeader = {};
    try {
        var response = doHTTPRequest('GET', url, headers, null, 0, 0, 0, responseHeader, false, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        if (isHttpSuccess(responseHeader) && response) {
            return JSON.parse(response);
        } else {
            return null;
        }
    } catch (ex) {
        logger.error("ex ====" + ex);
        return null;
    }
}

/* append ?fields=status,priority to rest url*/
function appendFields(fields) {
    if (!fields || fields.length < 1) {
        return "";
    }
    var i;
    var len = fields.length;
    var append = '?fields='
    for (i = 0; i < len; i++) {
        append = append + fields[i] + ',';
    }
    return append;
}


/*print log to client*/
function printMessage(msg, level) {
    funcs.rtecall("msg", new SCDatum(), msg, level);
}

/*record debug logs to sm.log*/
function recordDebugLogs(log, msg) {
    if (log.isDebugEnabled()) {
        log.debug("===> " + msg);
    }
}