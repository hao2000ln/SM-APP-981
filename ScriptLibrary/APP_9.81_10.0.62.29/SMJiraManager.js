/******************************************************
 * Module Name: SMIS Jira Manager
 * Function: Adapter Interface
 * Author: Jiang, Zhi-Qiang
 * Version: 1.00
 * Creation Date: NOV, 2022
 *******************************************************/
var $ = lib.c.$;
var logger = getLog('SMJiraManager');
var Class = lib.smis_Prototype.getClass();
var REQUIRED = ['jira.deployType', 'jira.baseUrl', 'jira.email', 'jira.token', 'jira.threads.number', 'jira.projects', 'jira.alias', "jira.reference.smTable", 'jira.reference.smKey'];
var REQUIRED_LABEL = ['deployType', 'baseURL', 'Email', 'Token', 'jiraThreadNumber', 'jiraProject', 'Alias', 'jiraSMTable', 'jiraSMKey'];

var OUTBOUND = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
var INBOUND = lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
var BOTH = lib.smis_Constants.MAPPING_DIRECTION_BOTH();

var STATUS_NEW = 'new';
var STATUS_DONE = 'success';
var STATUS_FAILED = 'failed';
var STATUS_SKIP = 'skip';
var STATUS_INPROGRESS = 'in progress';

var ACTION_TWOWAYUPDATE = 'Two-way update';
var ACTION_COMMENT = "comment";
var ACTION_ATTACHMENT = "attachment";

var ATTACHMENT_BOUNDARY = "412714466419050041004123568715";
var jiraRestBase = "rest/api/2";
var jiraUtil = lib.SMJiraUtil;
var jiraService = lib.SMJiraService;

var STATUS_WAITING = lib.smis_Constants.TASK_STATUS_WAITING();

var SMJiraManagerClass = Class.create(lib.smis_Manager.getClass(), {
    validateParams: function() {
        // validate required
        var k;
        for (k = 0; k < REQUIRED.length; k++) {
            var value = this.configItem.getConfigParameterValue(REQUIRED[k]);
            if (!value) {
                var label = funcs.scmsg('label-' + REQUIRED_LABEL[k], 'jira');
                var param = '$param.' + REQUIRED[k];
                funcs.cursor_field_name_set(param);
                return lib.smis_CommonLib.msg("58", [label]);
            }
        }

        //validate at least one module is emabled
        var moduleList = this.EPAdapter.getModuleList();
        if (moduleList.valueList.length < 1) {
            return funcs.scmsg('module-required', 'octane');
        }

        //validate project alias
        var ALIAS_PARAM = 'jira.alias';
        var name = this.configItem.getConfigParameterValue(ALIAS_PARAM);
        if (name) {
            if (name != name.trim()) {
                this.configItem.setConfigParameterValue(ALIAS_PARAM, name.trim());
            }
            if (!isAliasValid(this.configItem.intId, ALIAS_PARAM, name)) {
                funcs.cursor_field_name_set('$param.jira.alias');
                var msg = funcs.scmsg('param.name.duplicated', 'alm', [name]);
                return msg;
            }
        }
    },

    beforeEnableInstance: function() {
        var ALIAS_PARAM = 'jira.alias';
        var name = this.configItem.getConfigParameterValue(ALIAS_PARAM);
        if (!isAliasValid(this.configItem.intId, ALIAS_PARAM, name)) {
            var msg = funcs.scmsg('param.name.duplicated', 'alm', [name]);
            jiraUtil.printMessage(msg, 2);
            return false;
        }

        // get modules
        var modules = this.EPAdapter.getModuleList();
        var moduleList = lib.ArrayUtil.map(modules.valueList, function(name, k) {
            return ({
                name: name,
                label: modules.displayList[k]
            });
        });

        // check field mapping
        var intId = this.configItem.intId;
        var fm = $("!SMISFieldMapping", true).find("intId=:id", intId).one();
        if (null == fm) {
            return false;
        }
        var fieldCount = getfieldCount(fm);

        return checkFieldMapping(fieldCount, moduleList);

    },

    enableInstance: function() {
        enableInstance(this.configItem);
    },

    disableInstance: function() {
        disableInstance(this.configItem);
    },
    
    refreshInstanceStatus: function() {
        return refreshInstanceStatus(this.configItem);
    },

    appendTasks: function() {
        appendTasks(this.configItem, this.options);
    },

    getDestObj: function() {
        return {};
    },

    isScheduleBased: function() {
        return false;
    },

    preProcess: function(task) {
        jiraUtil.setConfigItemModule(this.configItem, task);
        return true;
    },

    process: function(task) {
        var syncResult = false;
        var direction = task.direction;
        var action = task.action;
        if (action == ACTION_COMMENT) {
            syncResult = handleCommentTask(task, this.configItem);
        } else if (action == ACTION_ATTACHMENT) {
            syncResult = handleAttachmentTask(task, this.configItem);
        } else if (direction == INBOUND) {
            syncResult = handleInBoundTask(task, this.configItem);
        } else if (direction == OUTBOUND) {
            syncResult = handleOutBoundTask(task, this.configItem);
        }
        return syncResult;
    },

    postProcess: function() {},

    finalize: function() {},

    getRealTimeTask: function() {
        return null;
    }
});


function getfieldCount(fm) {
    var size = fm.fieldMapping.length();
    var fieldCount = {};
    for (var k = 0; k < size; k++) {
        var name = fm.fieldMapping[k].SMField;
        var direction = fm.fieldMapping[k].direction;
        var _module = fm.fieldMapping[k].SMModule;
        if (!_module) continue;

        if (fieldCount[_module]) {
            fieldCount[_module] = fieldCount[_module] + 1;
        } else {
            fieldCount[_module] = 1;
        }
    }
    return fieldCount;
}

function checkFieldMapping(fieldCount, moduleList) {
    for (var k = 0; k < moduleList.length; k++) {
        var item = moduleList[k];
        if (!fieldCount[item.name] || fieldCount[item.name] < 1) {
            //'At least one field mapping is required for module \'' + item.label + '\' in SMIS Field Mapping.';
            var msg = funcs.scmsg('field-mapping-required', 'alm', [item.label]);
            jiraUtil.printMessage(msg, 2);
            return false;
        }
    }
    return true;
}

/* Check for duplicate aliases of projects */
function isAliasValid(intId, alias_param, currentAlias) {
    var found = false;
    $('!SMISConfiguration').fields('paramInfo', 'name', 'intId').find('template="SMJira" and intId~=:id', intId).each(function(config) {
        var alias = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue(config, alias_param);
        if (alias == currentAlias) {
            found = true;
            return true;
        }
    });
    return !found;
}
/* enable background processor when enable smis enstance */
function enableInstance(configItem) {
    lib.SMJiraUtil.setLoggerLevel(configItem.loggerLevel);

    addInfoRecord(configItem);
    addScheduleRecord(configItem);

    var hasRunningSch = lib.smis_SchedulerManager.getProcID(configItem) != null;

    if (!hasRunningSch) {
        logger.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_4", "smis"));
        lib.smis_SchedulerManager.triggerSchedule(configItem);
    }
}

/* delete schedule record and kill backgound processor when disable smis enstance*/
function disableInstance(configItem) {
    deleteScheduleRecord(configItem);
    stopProcess(configItem);
    deleteInfoRecord(configItem);
}

/** Refresh process and schedule status for SM Jira instance status
 *  When no process, return disabled
 *  When one schedule is failed, return error status
 *  When one schedule at least is running and others are not error, return running status
 *  When all schedules are rescheduled, return sleeping status
 *  Refer to the funciton smis_ConfigurationManager.refreshIntegrationInstances
 */
function refreshInstanceStatus(configItem) {
    var status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
    
    var threadCount = +configItem.getConfigParameterValue("jira.threads.number");
    if (threadCount == 0) {
        return status;
    }
    
    var i;
    var threadNames = [];
    var className = lib.smis_SchedulerManager._getSchClassName(lib.smis_SchedulerManager.getInfoType(configItem));
    for (i=1; i<=threadCount; i++) {
        threadNames.push(className + i);
    }
    
    var scheduleStatus;
    var processName;
    var statusRunning = lib.smis_Constants.INSTANCE_STATUS_RUNNING();
    
    var procs = funcs.processes();
    var procsLen = procs.length();
    for (i=0; i<procsLen; i++) {
        processName = procs[i+.3];
        if (threadNames.includes(processName)) { // search matched process name
            scheduleStatus = lib.smis_SchedulerManager.getScheduleStatusByName(processName);
            if (logger.isDebugEnabled()) {
                logger.debug("refreshInstanceStatus", "Refresh the status of the process: " + processName);
                logger.debug("refreshInstanceStatus", "The status of the schedule: " + scheduleStatus);
            }
            if (scheduleStatus == lib.smis_Constants.SCHEDULE_STATUS_FAILED()) {
                // when one schedule is failed, set the status to error for the instance.
                status = lib.smis_Constants.INSTANCE_STATUS_ERROR();
                logger.error("refreshInstanceStatus", "The schedule " + processName + " is failed ");
                break;
            } else if (scheduleStatus == lib.smis_Constants.SCHEDULE_STATUS_RUNNING()) {
                // when one schedule is running, set the status to running
                status = statusRunning;
            } else if (scheduleStatus == lib.smis_Constants.SCHEDULE_STATUS_RESCHEDULED() && status != statusRunning) {
                // when no running schedule, set the status to sleeping
                status = lib.smis_Constants.INSTANCE_STATUS_SLEEPING();
            }
        }
    }

    return status;
}

function appendTasks(configItem, options) {
    var thread = options['thread'];
    var lastSyncParamName = 'jira.lastSyncTime';

    var defaultSyncTime = new Date();

    var nextSyncTime = new Date();
    var lastSyncTime = configItem.getConfigParameterValue(lastSyncParamName);

    lastSyncTime = jiraUtil.isDateValid(lastSyncTime) ? lastSyncTime : defaultSyncTime;
    logger.info('===>appendTask', "instance = " + configItem['intId'] + ", thread = " + thread);
    if (logger.isDebugEnabled()) {
        logger.debug('run, lastSyncTime=', lastSyncTime);
        logger.debug('run, nextSyncTime=', nextSyncTime);
    }

    configItem.setConfigParameterValue(lastSyncParamName, nextSyncTime);
    lib.smis_ConfigurationManager.updateParam(configItem);

    /* jira to sm */
    pullJiraUpdate(configItem, lastSyncTime, thread);

    /* sm to jira */
    createTaskForBasicInfo(configItem, thread);

    /* sm to jira comments, attachments */
    createTaskForMoreInfo(configItem, thread);
}

/* Scanning for updates in Jira systems, then create task in jirainfo */
function pullJiraUpdate(configItem, lastSyncTime, thread) {
    var config = jiraUtil.getSMISConfig(configItem);
    getJiraIssueByTime(config, lastSyncTime, thread);
}

/**
 * Data format: ({expand:"schema,names", startAt:0, maxResults:50, total:2, 
 * issues:[{expand:"", id:"10032",self:"", key:"", fields:{summary:"", description:" ", customfield_10070:"", updated:"", status:}}]})
 */
function getJiraIssueByTime(config, lastSyncTime, thread) {
    var issues = [];
    var issuesFromIncident = getIssueFromIncident(config, lastSyncTime, thread);
    var issuesFromChange = getIssueFromChange(config, lastSyncTime, thread);
    //merge two array
    issues = [...issuesFromIncident, ...issuesFromChange];

    if (issues.length > 0) {
        syncJiraUpdateToSM(issues, config);
    } else {
        jiraUtil.recordDebugLogs(logger, 'There are no records updated in jira since...' + lastSyncTime);
    }
}

//Data format: ({maxResults:50, startAt:0, total:1, isLast:true, values:[{id:"", name:"", description:""}]})
function getJiraFieldNameById(id, config) {
    var fieldName = id;
    var deployType = config["deployType"];
    if(deployType == "Data Center"){
        var fieldUrl = config.baseUrl + "/" + jiraRestBase + "/field";
        var field = sendRequestWithResponse("GET", fieldUrl, null, config);
     
        if (field) {
            var i;
            for (i = 0; i < field.length; i++) {
                if (field[i] && id == field[i]["id"]) {
                    fieldName = field[i]["name"] || id;
                    break;
                }
            }
        }
    }
    else {
        var fieldUrl = config.baseUrl + "/" + jiraRestBase + "/field/search?id=" + id;
        var field = sendRequestWithResponse("GET", fieldUrl, null, config);
        if (field && field['total'] == 1) {
            fieldName = field['values'][0]['name'];
        }
    }
    return fieldName;
}

function getIssueFromIncident(config, lastSyncTime, thread) {
    return searchIssues(config, lastSyncTime, "probsummary", thread);
}

function getIssueFromChange(config, lastSyncTime, thread) {
    return searchIssues(config, lastSyncTime, "cm3r", thread);
}

/* Search for records updated from the last sync to the present in Jira  */
function searchIssues(config, lastSyncTime, table, thread) {
    var issues = [];
    var searchUrl = config.baseUrl + "/" + jiraRestBase + "/search";
    var startAt = 0;
    var maxResults = 50;
    var nextRound = true;
    var body = createBodyForSearch(config, lastSyncTime, table, thread, startAt, maxResults);
    while (nextRound) {
        try {
            var response = sendRequestWithResponse("POST", searchUrl, JSON.stringify(body), config);
            if (response) {
                var increment = response['issues'];
                if (increment && increment.length > 0) {
                    issues = [...issues, ...increment];
                }
                var total = response['total'];
                startAt = startAt + maxResults;
                if (!total || total <= startAt) {
                    nextRound = false;
                } else {
                    body['startAt'] = startAt;
                }
            } else {
                return issues;
            }
        } catch (e) {
            logger.error(e);
            return issues;
        }
    }
    return issues;
}

/* Synchronize Jira's updates to sm */
function syncJiraUpdateToSM(issues, config) {
    jiraUtil.recordDebugLogs(logger, 'synchronize jira updates to  SM...');
    var i;
    var len = issues.length;
    for (i = 0; i < len; i++) {
        var issue = issues[i];
        jiraUtil.recordDebugLogs(logger, 'synchronize jira issue...' + issue['key']);
        var jiraKey = issue['key'];
        var jiraInfo = jiraUtil.getJiraInfoByJiraKey(jiraKey);
        if (!jiraInfo) {
            continue;
        }

        var smTable = jiraInfo['smTable'];
        var smRecord = jiraUtil.getSMRecordBySMKey(smTable, jiraInfo['smKey']);
        var smActive = jiraUtil.isActive(smRecord);
        var jiraIssueType = issue['fields']['issuetype']['name'];
        jiraInfo.jiraType = jiraIssueType;
        /* Stop sync jira update to sm if the sm record is inactive */
        if (!smActive) {
            jiraUtil.recordDebugLogs(logger, 'sm record is inactive, stopped syncing...');
            jiraInfo.doUpdate();
            continue;
        }
        /* Stop sync jira update to sm if the jira issueType is changed*/
        if (jiraIssueType != jiraInfo['jiraAction']) {
            jiraUtil.recordDebugLogs(logger, 'Jira changed the issue type, stopped syncing...');
            jiraInfo.doUpdate();
            continue;
        }

        var smData = JSON.parse(jiraInfo['smData']);
        var smFieldList = smData['fieldList'];
        var jiraUpdate = issue['fields']['updated'];
        var smUpdate = jiraInfo['smUpdateAt'];
        var syncAt = jiraInfo['syncAt'];

        if (jiraUtil.compareUpdateTimes(syncAt, jiraUpdate)) {
            continue;
        }

        var fieldMapping = jiraUtil.getFieldMappingByInstanceId(config.instance);
        var k;
        var smField;
        var epField;
        var direction;
        var module;
        var length = fieldMapping.length();
        var jiraData = jiraInfo['jiraData'] ? JSON.parse(jiraInfo['jiraData']) : {};
        var jiraOldData = jiraData['newData'] ? jiraData['newData'] : {};
        var epFieldList = [];
        var jiraNewData = {};
        var changed = false;
        for (k = 0; k < length; k++) {
            smField = fieldMapping[k]["SMField"];
            direction = fieldMapping[k]["direction"];
            module = fieldMapping[k]["SMModule"];
            epField = fieldMapping[k]["EPField"];
            var specialFields = config['specialFields'];
            if (!jiraUtil.matchMoudel(smTable, module)) {
                continue;
            }
            if (direction == BOTH || direction == INBOUND) {
                var oldValue = jiraOldData[epField];
                var epValue = issue['fields'][epField];
                if (specialFields && specialFields[epField]) {
                    epValue = epValue[specialFields[epField]];
                } else if (epValue && epValue['id'] && fieldMapping[k]['valueMappingGroup']) {
                    var obj = {
                        "id": epValue['id']
                    };
                    epValue = JSON.stringify(obj);
                    if (typeof oldValue == 'object') {
                        oldValue = JSON.stringify(oldValue);
                    }
                }
                if (oldValue != epValue) {
                    //jiraUpdate > smUpdate
                    if (jiraInfo.syncStatus == STATUS_DONE) {
                        epFieldList.push(epField);
                        changed = true;
                    } else if (jiraInfo.syncStatus == STATUS_NEW) {
                        var smNewData = smData['newData'][smField];
                        var smOldData = smData['oldData'][smField];
                        if (smNewData == smOldData || (epValue != smOldData && jiraUtil.compareUpdateTimes(jiraUpdate, smUpdate))) {
                            epFieldList.push(epField);
                            smFieldList = smFieldList.filter(function(value, index, arr) {
                                return value != smField;
                            });
                            changed = true;
                        }
                    }
                } else if (null == epValue || undefined == epValue || "" == epValue) {
                    epFieldList.push(epField);
                }
                jiraNewData[epField] = epValue;
            }
        }
        var jiraStatus = issue['fields']['status']['name'];

        if (changed == false) {
            jiraUtil.recordDebugLogs(logger, 'no fields changed...');
            if (jiraStatus != jiraInfo.jiraPhase) {
                jiraInfo.jiraPhase = jiraStatus;
                jiraInfo.doUpdate();
            }
            continue;
        }

        var jiraData = {
            "fieldList": epFieldList,
            "newData": jiraNewData,
            "oldData": jiraOldData
        };

        smData['fieldList'] = smFieldList;

        if (jiraInfo.syncStatus == STATUS_NEW && smFieldList.length > 0) {
            jiraInfo['twoWayUpdate'] = true;
        } else {
            jiraInfo.syncStatus = STATUS_NEW;
        }
        var jiraUpdated = issue['fields']['updated'];
        jiraInfo.jiraPhase = jiraStatus;
        jiraInfo.jiraUpdateAt = new Date(jiraUpdated);
        jiraInfo.jiraData = JSON.stringify(jiraData, null, 4);
        jiraInfo.smData = JSON.stringify(smData, null, 4);
        jiraInfo.doUpdate();
    }
}

/**
 * Create request body form Jira issue search
 *{
 *   jql:project = SMBT AND updated > '2022-12-9 13:20',
 *   fields:['update','issuetype','status']
 *}
 */
function createBodyForSearch(config, lastSyncTime, table, thread, startAt, maxResults) {
    var jql = createJQLForSearch(config, lastSyncTime, table, thread);
    jiraUtil.recordDebugLogs(logger, 'create body for search, jql == ' + jql);
    var epFields = [];
    epFields.push("updated");
    epFields.push("issuetype");
    epFields.push("status");
    var fieldMappings = jiraUtil.getFieldMappingByInstanceId(config.instance);
    var i;
    var len = fieldMappings.length();
    for (i = 0; i < len; i++) {
        epFields.push(fieldMappings[i]['EPField']);
    }
    var fields = epFields.filter(function(item, index) {
        return epFields.indexOf(item) === index;
    });
    var body = {
        "jql": jql,
        "fields": fields,
        "maxResults": maxResults,
        "startAt": startAt
    };
    return body;
}

/* create jql for jira issue search */
function createJQLForSearch(config, lastSyncTime, table, thread) {
    var time = jiraUtil.convertDateToJiraDate(new Date(lastSyncTime) - 1000 * 30);
    var refeTableId = config['refeSMTable'];
    var refeTableName = getJiraFieldNameById(refeTableId, config);
    var project = config["jiraProjects"];
    var refeTable = joinRefeTable(table, refeTableName, config, thread);
    var jql = "project = " + project + " AND ( " + refeTable + " ) AND updated > '" + time + "' ORDER BY created DESC";
    return jql;
}

/* Need to reallocate threads when the number of threads decreases */
function joinRefeTable(table, refeTableName, config, thread) {
    var intId = config['instance'];
    var maxThread = config['threads_max'];
    var threadCount = config['threads'];
    var result = "";
    while (thread <= maxThread) {
        result = result + "'" + refeTableName + "' ~ " + jiraUtil.generateJiraSMTable(table, intId, thread);
        thread = thread + threadCount;
        if (thread <= maxThread) {
            result = result + " OR ";
        }
    }
    return result;
}

function sendRequestWithResponse(method, url, body, config) {
    var reqHeaders = jiraUtil.createRequestHeader(config);
    var resHeader = {};
    try {
        var response = doHTTPRequest(method, url, reqHeaders, body, 0, 0, 0, resHeader, false, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        if (jiraUtil.isHttpSuccess(resHeader)) {
            return JSON.parse(response);
        } else {
            logger.error("sendRequestField", url + ":" + response);
            return null;
        }
    } catch (e) {
        logger.error("sendRequestField", url + ":" + e);
    }
}

//Push SMISTask To Queue
function createTaskForBasicInfo(configItem, thread) {
    var instance = configItem.intId;
    var sql = 'intId = "' + instance + '" and intThread = "' + thread + '" and syncStatus = "' + STATUS_NEW + '"';
    $("!JiraInfo", true).find(sql).each(function(item) {
        var smUpdate = item.smUpdateAt;
        var jiraUpdate = item.jiraUpdateAt;
        var syncAt = item.syncAt;
        var twoWay = item.twoWayUpdate;
        if (twoWay) {
            createTwoWayTask(item, configItem);
        } else if (!syncAt || (jiraUtil.compareUpdateTimes(smUpdate, jiraUpdate) && jiraUtil.compareUpdateTimes(smUpdate, syncAt))) {
            createOutBoundTask(item, configItem);
        } else if (syncAt && jiraUtil.compareUpdateTimes(jiraUpdate, smUpdate) && jiraUtil.compareUpdateTimes(jiraUpdate, syncAt)) {
            createInboundTask(item, configItem);
        }
    });
}

function createTwoWayTask(item, configItem) {
    jiraUtil.recordDebugLogs(logger, 'Since the last sync SM and Jira have been updated..' + item.smKey + '->' + item.jiraKey);
    try {
        pushJiraInfoToTaskQueue(item, configItem, true);
    } catch (e) {
        logger.error(e.stack);
    }
}

function createOutBoundTask(item, configItem) {
    var config = jiraUtil.getSMISConfig(configItem);
    var excludePhase = jiraService.inExcludePhase(item, config);
    if (excludePhase) {
        item.syncStatus = STATUS_DONE;
        item.doUpdate();
        return;
    }
    jiraUtil.recordDebugLogs(logger, 'Create outbound task ...' + item.smKey + '->' + item.jiraKey);
    try {
        pushSMInfoToTaskQueue(item, configItem);
    } catch (e) {
        logger.error(e.stack);
    }
}

function createInboundTask(item, configItem) {
    jiraUtil.recordDebugLogs(logger, 'Create inbound task ...' + item.jiraKey + "->" + item.smKey);
    try {
        pushJiraInfoToTaskQueue(item, configItem, false);
    } catch (e) {
        logger.error(e.stack);
    }
}

function pushSMInfoToTaskQueue(item, configItem) {
    logger.info(`putSmInfoToTaskQueue, id=${item.id}, smTable=${item.smTable}, smId=${item.smKey}`);
    var task = new SCFile("SMISTaskQueue");
    var rc = task.doSelect('internalId="' + item.smKey + '" and status = "' + STATUS_WAITING + '"');
    if (RC_SUCCESS == rc) {
        logger.info("SMISTaskQueue created......");
        return;
    }
    task = new(lib.smis_Task.getClass())(configItem.intId);
    task.integrationName = configItem.name;
    task.action = item.jiraAction;
    task.internalId = item.smKey;
    task.externalId = item.jiraKey;
    task.object = 'JiraInfo,' + item.id;
    var smData = JSON.parse(item.smData);
    task.inRecord = smData['newData'];

    var requestData = {
        "jiraInfo": item.id,
        "smKey": item.smKey,
        "smTable": item.smTable,
        "jiraKey": item.jiraKey,
        "jiraType": item.jiraType,
        "jiraProject": item.jiraProject,
        "module": item.jiraAction,
        "smFieldList": smData['fieldList'],
        "intId": item.intId,
        "threadId": item.intThread
    };
    task.requestData = JSON.stringify(requestData);
    task.direction = OUTBOUND;

    var id = lib.smis_TaskManager.pushTaskWithId(task, item.intThread);
    return id != null;
}

function createTaskForMoreInfo(configItem, thread) {
    var instance = configItem['intId'];
    var config = jiraUtil.getSMISConfig(configItem);
    var sql = 'intId = "' + instance + '" and intThread = "' + thread + '" and status ~= "' + STATUS_DONE + '" and jiraKey ~= "<pending>"';
    $("!JiraInfoMore", true).find(sql).each(function(item) {
        var info = jiraUtil.getJiraInfoBySMKey(item.smTable, item.smKey);
        var isExclude = jiraService.inExcludePhase(info, config);
        if (isExclude) {
            return;
        }
        /* Stop sync jira update to sm if the jira issueType is changed */
        if (info['jiraAction'] != info['jiraType']) {
            return;
        }

        var comments = item['comments'];
        var attachments = item['attachments'];
        var newComments = 0;
        var newAttachments = 0;

        try {
            newComments = pushCommentsToTaskQueue(comments, item, configItem);
            logger.info("pushed" + newComments + "new comment tasks to task queue...");
        } catch (e) {
            logger.error("Error occurs during push comments to Task Queue --", e.stack);
        }

        try {
            newAttachments = pushAttachmentsToTaskQueue(attachments, item, configItem);
            logger.info("pushed" + newComments + "new attachment tasks to task queue...");
        } catch (e) {
            logger.error("Error occurs during push attachments to Task Queue --", e.stack);
        }
        updateJiraInfoStatus(item['id'], newComments, newAttachments);
    });
}

/**
 * update status of jira info more
 */
function updateJiraInfoStatus(id, newComments, newAttachments) {
    var info = jiraUtil.getJiraInfoMoreById(id);
    var count = newComments + newAttachments;
    if (count > 0) {
        info.status = STATUS_INPROGRESS;
    } else {
        info.status = STATUS_DONE;
    }
    info.doUpdate();
}


function pushCommentsToTaskQueue(comments, jiraInfoMore, configItem) {
    var i;
    var len = comments.length();
    var count = 0;
    for (i = 0; i < len; i++) {
        var comment = comments[i];
        var commentId = comment['commentId'];
        var commentTable = comment['commentTable'];
        var syncStatus = comment['commentSyncStatus'];
        if (syncStatus != STATUS_NEW) {
            continue;
        }
        logger.info(`pushCommentsToTaskQueue, smRecord=${jiraInfoMore.smKey}, commentId=${commentId}`);
        var task = new SCFile("SMISTaskQueue");
        var rc = task.doSelect('internalId="' + commentId + '" and status = "' + STATUS_WAITING + '"');
        if (rc == RC_SUCCESS) {
            logger.info("SMISTaskQueue created......");
            continue;
        }
        task = new(lib.smis_Task.getClass())(configItem.intId);
        task.integrationName = configItem.name;
        task.action = ACTION_COMMENT;
        task.internalId = jiraInfoMore.smKey;
        task.externalId = jiraInfoMore.jiraKey;
        task.object = "jiraInfoMore," + jiraInfoMore.id;
        var requestData = {
            "commentId": commentId,
            "smTable": jiraInfoMore.smTable,
            "smKey": jiraInfoMore.smKey,
            "jiraKey": jiraInfoMore.jiraKey,
            "commentTable": commentTable,
            "intId": jiraInfoMore.intId,
            "threadId": jiraInfoMore.intThread
        };
        task.requestData = JSON.stringify(requestData);
        task.direction = OUTBOUND;

        var id = lib.smis_TaskManager.pushTaskWithId(task, jiraInfoMore.intThread);
        if (id) {
            count++;
        }
    }
    return count;
}

function pushAttachmentsToTaskQueue(attachments, jiraInfoMore, configItem) {
    var i;
    var len = attachments.length();
    var count = 0;
    for (i = 0; i < len; i++) {
        var attachment = attachments[i];
        var attachId = attachment['attachId'];
        var attachName = attachment['attachName'];
        var syncStatus = attachment['attachSyncStatus'];
        if (syncStatus != STATUS_NEW) {
            continue;
        }
        logger.info(`Push Attachments To TaskQueue, smRecord=${jiraInfoMore.smKey}, attachId=${attachId}`);
        var task = new SCFile("SMISTaskQueue");
        var rc = task.doSelect('internalId="' + attachId + '" and status = "' + STATUS_WAITING + '"');
        if (rc == RC_SUCCESS) {
            logger.info("SMISTaskQueue created......");
            continue;
        }
        task = new(lib.smis_Task.getClass())(configItem.intId);
        task.integrationName = configItem.name;
        task.action = ACTION_ATTACHMENT;
        task.internalId = jiraInfoMore.smKey;
        task.externalId = jiraInfoMore.jiraKey;
        task.object = "jiraInfoMore," + jiraInfoMore.id;
        var requestData = {
            "attachId": attachId,
            "smTable": jiraInfoMore.smTable,
            "smKey": jiraInfoMore.smKey,
            "jiraKey": jiraInfoMore.jiraKey,
            "attachName": attachName,
            "intId": jiraInfoMore.intId,
            "threadId": jiraInfoMore.intThread
        };
        task.requestData = JSON.stringify(requestData);
        task.direction = OUTBOUND;

        var id = lib.smis_TaskManager.pushTaskWithId(task, jiraInfoMore.intThread);
        if (id) {
            count++;
        }
    }
    return count;
}

function pushJiraInfoToTaskQueue(item, configItem, twoWayUpdate) {
    logger.info(`putSmInfoToTaskQueue, id=${item.id}, smTable=${item.smTable}, smId=${item.smKey}`);
    var task = new SCFile("SMISTaskQueue");
    var rc = task.doSelect('internalId="' + item.smKey + '" and status = "' + STATUS_WAITING + '"');
    if (rc == RC_SUCCESS) {
        logger.info("SMISTaskQueue created......");
        return;
    }
    task = new(lib.smis_Task.getClass())(configItem.intId);
    task.integrationName = configItem.name;
    task.action = item.jiraAction;
    task.internalId = item.smKey;
    task.externalId = item.jiraKey;
    task.object = 'JiraInfo,' + item.id;
    var jiraData = JSON.parse(item.jiraData);
    var smData = JSON.parse(item.smData);
    task.inRecord = jiraData['newData'];

    var requestData = {
        "jiraInfo": item.id,
        "smKey": item.smKey,
        "smTable": item.smTable,
        "jiraKey": item.jiraKey,
        "jiraType": item.jiraType,
        "jiraProject": item.jiraProject,
        "module": item.jiraAction,
        "epFieldList": jiraData['fieldList'],
        "intId": item.intId,
        "threadId": item.intThread
    };
    if (twoWayUpdate) {
        requestData['smFieldList'] = smData['fieldList'];
        requestData['smNewData'] = smData['newData'];
        task.action = ACTION_TWOWAYUPDATE;
    }
    task.requestData = JSON.stringify(requestData);
    task.direction = INBOUND;

    var id = lib.smis_TaskManager.pushTaskWithId(task, item.intThread);
    return id != null;
}

/* sm create/update to jira */
function handleOutBoundTask(task, configItem) {
    var outRecord = task.outRecord;
    var requestData = JSON.parse(task.requestData);
    var jiraKey = requestData['jiraKey'];
    var syncResult = {};
    if (!jiraKey) {
        syncResult = doCreateFromSMToJira(requestData, outRecord, configItem);
        task.externalId = syncResult['jiraKey'];
        task.responseMsg = syncResult['message'];
        return syncResult['result'];
    } else {
        syncResult = doUpdateFromSMToJira(requestData, outRecord, configItem);
        task.responseMsg = syncResult['message'];
        return syncResult['result'];
    }
}

/* jira update to sm */
function handleInBoundTask(task, configItem) {
    var smisAction = task.action;
    if (smisAction == ACTION_TWOWAYUPDATE) {
        return twoWayUpdate(task, configItem);
    } else {
        var outRecord = task.outRecord;
        var requestData = JSON.parse(task.requestData);
        return updateSMRecord(requestData, outRecord, configItem);
    }
}

/* Jira and SM have separate updates for different fields, which need to be synchronized in both directions */
function twoWayUpdate(task, configItem) {
    //JiraToSM
    var outRecord = task.outRecord;
    var requestData = JSON.parse(task.requestData);
    var updateSM = updateSMRecord(requestData, outRecord, configItem);
    if (!updateSM) {
        logger.error("update SM Record field");
    }

    //smToJira
    var smOutRecord = getOutRecordByRequestData(requestData, configItem);
    var updateJira = doUpdateFromSMToJira(requestData, smOutRecord, configItem);
    if (!updateJira) {
        logger.error("update Jira Record field");
    }
    return updateSM && updateJira;
}

/* sync sm activity to jira comments */
function handleCommentTask(task, configItem) {
    var reqData = JSON.parse(task.requestData);
    var commentTable = reqData['commentTable'];
    var smTable = reqData['smTable'];
    var smKey = reqData['smKey'];
    var commentId = reqData['commentId'];
    var jiraKey = reqData['jiraKey'];
    var activity = jiraUtil.getActivityByCommentId(commentTable, smKey, commentId);
    activity = lib.StringUtil.stripHtmlTags(activity);
    var syncResult = sendActivityToJira(activity, configItem, jiraKey);
    updateInfoMoreAfterComm(smTable, smKey, commentId, syncResult);
    return syncResult;
}

/* sync sm attachment to jira */
function handleAttachmentTask(task, configItem) {
    var reqData = JSON.parse(task.requestData);
    var smTable = reqData['smTable'];
    var smKey = reqData['smKey'];
    var jiraKey = reqData['jiraKey'];
    var attachId = reqData['attachId'];
    var smRecord = jiraUtil.getSMRecordBySMKey(smTable, smKey);
    if (!smRecord) {
        return false;
    }
    var attachment = smRecord.getAttachment(attachId);

    var syncResult = sendAttachmentToJira(jiraKey, configItem, attachment);

    updateInfoMoreAfterSyncAtt(smTable, smKey, attachId, syncResult);

    return syncResult['result'];
}

/* After successfully sync sm attachment to Jira, update JiraInfoMore */
function updateInfoMoreAfterSyncAtt(smTable, smKey, attachId, syncResult) {
    var result = syncResult["result"];
    var jiraInfoMore = jiraUtil.getJiraInfoMoreBySMKey(smTable, smKey);
    var attachName = "";
    var attachments = jiraInfoMore['attachments'];
    var i;
    var len = attachments.length();
    for (i = len - 1; i > -1; i--) {
        if (attachId == attachments[i]['attachId']) {
            attachments[i]['attachSyncAt'] = new Date();
            attachments[i]['attachSyncStatus'] = result ? STATUS_DONE : STATUS_SKIP;
            attachments[i]['attachSyncResult'] = result ? "" : syncResult['message'];
            attachName = attachments[i]['attachName'];
        }
    }
    jiraInfoMore.attachments = attachments;
    jiraInfoMore.doUpdate();

    jiraUtil.addActivityForAttach(jiraInfoMore, attachName, syncResult);
}

/**
 * send sm attachment to Jira
 */
function sendAttachmentToJira(jiraKey, configItem, attachment) {
    var config = jiraUtil.getSMISConfig(configItem);
    var headers = [];
    if (config["deployType"] == "Data Center") {
        headers = jiraUtil.bearerAuth(headers, config.token);
    }
    else {
        headers = jiraUtil.basicAuth(headers, config.email, config.token);
    }
    headers.push(new Header('X-Atlassian-Token', "no-check"));
    headers.push(new Header('Accept', "application/json"));
    headers.push(new Header('Content-Type', 'multipart/form-data; boundary=' + ATTACHMENT_BOUNDARY));

    var url = config.baseUrl + "/" + jiraRestBase + "/issue/" + jiraKey + "/attachments";
    var responseHeader = {};
    var body = makeAttBody(attachment);
    try {
        var result = false;
        var message = null;
        var response = doHTTPRequest('POST', url, headers, body, 0, 0, 0, responseHeader, true, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        if (jiraUtil.isHttpSuccess(responseHeader)) {
            result = true;
        } else {
            jiraUtil.recordDebugLogs(logger, 'Send attachment to Jira failed, ' + response);
            message = setResponseMsg(response);
            result = false;
        }
    } catch (ex) {
        message = ex;
        logger.error("ex ====" + ex);
    }
    return {
        "result": result,
        "message": message
    };
}

/* return error message if the smis task is failed, and record it in SMISTaskLog */
function setResponseMsg(response) {
    var message = "";
    if (response) {
        var jiraRes = JSON.parse(response);
        var errorMessages = jiraRes['errorMessages'];
        var errors = jiraRes['errors'];

        if (errorMessages && errorMessages.length > 0) {
            message = errorMessages.toString();
        } else if (errors) {
            var strErrors = JSON.stringify(errors);
            message = strErrors == "{}" ? "" : strErrors;
        }
    }
    return message;
}

/**
 * Jira attachment body
 * ByteBuffer is a new Object implemented by server in 9.80
 */
function makeAttBody(attach) {
    var body = null;
    var name = attach.name;
    var value = attach.value;
    var type = attach.type;

    var buf = new ByteBuffer();
    var header = '--' + ATTACHMENT_BOUNDARY + '\r\n' +
        'Content-Disposition: form-data; name="file"; filename="' + encodeURIComponent(name) + '"\r\n' +
        'Content-Type: ' + type + '\r\n' +
        '\r\n';
    var end = '\r\n' +
        '--' + ATTACHMENT_BOUNDARY + '--\r\n';

    buf.append(header);
    buf.append(value);
    buf.append(end);
    body = buf.getBytes();
    return body;
}

/* After successfully sync sm activity to jira comments, update JiraInfoMore */
function updateInfoMoreAfterComm(smTable, smKey, commentId, syncResult) {
    var jiraInfoMore = jiraUtil.getJiraInfoMoreBySMKey(smTable, smKey);
    var comments = jiraInfoMore['comments'];
    var i;
    var len = comments.length();
    for (i = len - 1; i > -1; i--) {
        if (commentId == comments[i]['commentId']) {
            comments[i]['commentSyncAt'] = new Date();
            comments[i]['commentSyncStatus'] = syncResult ? STATUS_DONE : STATUS_SKIP;
            comments[i]['commentSyncResult'] = syncResult ? "Success" : "Failure";
        }
    }
    jiraInfoMore.comments = comments;
    jiraInfoMore.doUpdate();
}

/* send sm activity to Jira as a comment */
function sendActivityToJira(activity, configItem, jiraKey) {
    var config = jiraUtil.getSMISConfig(configItem);
    var headers = jiraUtil.createRequestHeader(config);
    var url = config.baseUrl + "/" + jiraRestBase + "/issue/" + jiraKey + "/comment";
    var responseHeader = {};
    var reqBody = {
        "body": activity
    };
    try {
        var response = doHTTPRequest('POST', url, headers, JSON.stringify(reqBody), 0, 0, 0, responseHeader, false, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        if (jiraUtil.isHttpSuccess(responseHeader)) {
            return true;
        } else {
            jiraUtil.recordDebugLogs(logger, 'sendActivityToJira failed ' + response);
            return false;
        }
    } catch (ex) {
        logger.error("ex ====" + ex);
    }
}

/* get the fields and the value that need to be sync to Jira via requestData */
function getOutRecordByRequestData(requestData, configItem) {
    var smNewData = requestData['smNewData'];
    var smFieldList = requestData['smFieldList'];
    var smTable = requestData['smTable'];
    var outRecord = getEpRecordBySMRecord(smNewData, smFieldList, smTable, configItem);
    return outRecord;
}

/* Generate the fields and teh value that need to be sync to Jira via smData and fieldList */
function getEpRecordBySMRecord(smNewData, smFieldList, smTable, configItem) {
    var instance = configItem['intId'];
    var epFieldList = jiraUtil.getEpFieldsBySMFields(instance, smFieldList, smTable);

    var fieldMapping = jiraUtil.getFieldMappingByInstanceId(instance);
    var valueMapping = jiraUtil.getValueMappingByInstanceId(instance);

    var outRecord = {};
    var i;
    var len = smFieldList.length;
    for (i = 0; i < len; i++) {
        var epField = epFieldList[i];
        var smField = smFieldList[i];
        var smValue = smNewData[smField];
        outRecord[epField] = setEpValueByFieldMapping(smField, smValue, epField, fieldMapping, valueMapping);
    }
    return outRecord;
}

/*Get the ep field value by sm field value and fieldMapping valueMapping */
function setEpValueByFieldMapping(smField, smValue, epField, fieldMapping, valueMapping) {
    var i;
    var len = fieldMapping.length();
    var hasValMapping = false;
    var valueGroup;
    for (i = 0; i < len; i++) {
        var item = fieldMapping[i];
        var smFieldName = item["SMField"];
        if (smFieldName == smField && item['valueMappingGroup']) {
            hasValMapping = true;
            valueGroup = item['valueMappingGroup'];
        }
    }
    if (hasValMapping) {
        var j;
        var length = valueMapping.length();
        for (j = 0; j < length; j++) {
            var vpItem = valueMapping[j];
            if (vpItem['valueMappingGroupID'] == valueGroup && vpItem["SMValue"] == smValue) {
                return vpItem['EPValue'];
            }
        }
        return smValue;
    } else {
        return smValue;
    }
}

/* Create jira issue from sm record */
function doCreateFromSMToJira(requestData, outRecord, configItem) {
    var config = jiraUtil.getSMISConfig(configItem);
    var headers = jiraUtil.createRequestHeader(config);
    var url = config.baseUrl + "/" + jiraRestBase + "/issue";
    jiraUtil.recordDebugLogs(logger, 'do create from sm to jira ' + url);

    var responseHeader = {};
    var body = createRequestBody(requestData, outRecord, config, "create");
    var jiraResponse;
    var result = false;
    var message = null;
    var jiraKey = null;
    try {
        var response = doHTTPRequest('POST', url, headers, JSON.stringify(body), 0, 0, 0, responseHeader, false, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        if (jiraUtil.isHttpSuccess(responseHeader)) {
            jiraResponse = JSON.parse(response);
            jiraKey = jiraResponse['key'];
            result = true;
        } else {
            jiraUtil.recordDebugLogs(logger, 'do create response ' + response);
            message = setResponseMsg(response);
            result = false;
        }
    } catch (ex) {
        message = ex;
        logger.error("ex ====" + ex);
    }
    updateInfoAfterCreate(requestData.jiraInfo, jiraResponse, config, body, result);
    return {
        "result": result,
        "message": message,
        "jiraKey": jiraKey
    };
}

/* sync sm updates to jira */
function doUpdateFromSMToJira(requestData, outRecord, configItem) {
    var config = jiraUtil.getSMISConfig(configItem);
    var headers = jiraUtil.createRequestHeader(config);
    var url = config.baseUrl + "/" + jiraRestBase + "/issue/" + requestData.jiraKey;
    var responseHeader = {};
    var body = createRequestBody(requestData, outRecord, config, "update");
    var result = false;
    var message = null;
    try {
        var response = doHTTPRequest('PUT', url, headers, JSON.stringify(body), 0, 0, 0, responseHeader, false, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        if (jiraUtil.isHttpSuccess(responseHeader)) {
            result = true;
        } else {
            jiraUtil.recordDebugLogs(logger, 'update failed ' + response);
            message = setResponseMsg(response);
            result = false;
        }
    } catch (ex) {
        message = ex;
        logger.error("ex ====" + ex);
    }
    updateInfoAfterOutBoundTask(requestData.jiraInfo, config, body, result);
    return {
        "result": result,
        "message": message
    };
}

/* Create request body for jira create/update api*/
function createRequestBody(requestData, outRecord, config, action) {
    var body = {};
    var fields = {};
    var smFields = requestData.smFieldList;
    var fieldList = jiraUtil.getEpFieldsBySMFields(config['instance'], smFields, requestData['smTable']);
    var specialFields = config['specialFields'];
    var thread = requestData['threadId'];
    var i;
    for (i = 0; i < fieldList.length; i++) {
        var epField = fieldList[i];
        if (specialFields && specialFields[epField]) {
            var key = specialFields[epField];
            var keyValue = {};
            keyValue[key] = outRecord[epField];
            fields[epField] = keyValue;
        } else {
            var outValue = outRecord[epField];
            if (jiraUtil.isJsonString(outValue)) {
                outValue = JSON.parse(outValue);
            }
            fields[epField] = outValue;
        }
    }
    if (action == "create") {
        fields['issuetype'] = {
            "name": requestData.jiraType
        };
        fields['project'] = {
            "key": requestData.jiraProject
        };
        var jiraSMTable = config['refeSMTable'];
        var jiraSMKey = config['refeSMKey'];
        fields[jiraSMTable] = jiraUtil.generateJiraSMTable(requestData.smTable, config['instance'], thread);
        fields[jiraSMKey] = requestData['smKey'];
    }
    body['fields'] = fields;
    return body;
}

/* After successfully creating a Jira issue from a SM record, update JiraInfo */
function updateInfoAfterCreate(jiraInfoId, jiraResponse, config, body, result) {
    var jiraInfo = jiraUtil.getJiraInfoById(jiraInfoId);
    if (jiraInfo) {
        if (result == true) {
            jiraInfo.jiraKey = jiraResponse.key;
            var issue = jiraUtil.pullJiraIssue(jiraResponse.key, config, ['status']);
            var status = issue == null ? "" : issue['fields']['status']['name'];
            jiraInfo.jiraPhase = status;
            var self = jiraResponse.self;
            jiraInfo.jiraSelf = self;
            jiraInfo.jiraBaseUrl = self.split("/rest/")[0];
            jiraInfo.syncStatus = STATUS_DONE;
            jiraInfo.syncAt = new Date();
            jiraInfo.jiraData = setJiraData(jiraInfo, config, body, "create");
            jiraInfo.doUpdate();

            saveKeyToInfoMore(jiraInfo, jiraResponse.key);
            jiraUtil.addActivityForCreate(jiraInfo);
        } else {
            jiraInfo.syncStatus = STATUS_FAILED;
            jiraInfo.syncAt = new Date();
            jiraInfo.doUpdate();
        }
    }
}

/* set Jira data after create from sm to jira*/
function setJiraData(jiraInfo, config, body, action) {
    var fields = body['fields'];
    var smTable = config['refeSMTable'];
    var smkey = config['refeSMKey'];
    delete fields['issuetype'];
    delete fields['project'];
    delete fields[smTable];
    delete fields[smkey];

    var mergeData = {};
    if ("update" == action) {
        var jiraData = JSON.parse(jiraInfo['jiraData'])['newData'];
        mergeData = jiraData ? jiraData : {};
        for (key in fields) {
            mergeData[key] = fields[key];
        }
    } else if ("create" == action) {
        mergeData = fields;
    }

    var jiraData = {
        "fieldList": [],
        "newData": mergeData,
        "oldData": mergeData
    };
    return JSON.stringify(jiraData, null, 4);
}

/* Sync Jira Key to infomore after successful creation of Jira Issue */
function saveKeyToInfoMore(info, key) {
    var infoMore = jiraUtil.getJiraInfoMoreBySMKey(info.smTable, info.smKey);
    if (infoMore) {
        infoMore.jiraKey = key;
        infoMore.doUpdate();
    }
}

/* After successfully sync sm updates to jira, update JiraInfo */
function updateInfoAfterOutBoundTask(jiraInfoId, config, body, result) {
    var jiraInfo = jiraUtil.getJiraInfoById(jiraInfoId);
    if (jiraInfo) {
        jiraInfo.syncStatus = result ? STATUS_DONE : STATUS_FAILED;
        jiraInfo.jiraData = setJiraData(jiraInfo, config, body, "update");
        jiraInfo.twoWayUpdate = false;
        jiraInfo.syncAt = new Date();
        jiraInfo.doUpdate();
    }
}

/* Handling InBound Task, sync jira update to sm record */
function updateSMRecord(requestData, outRecord, configItem) {
    var smTable = requestData['smTable'];
    var smKey = requestData['smKey'];
    var smRecord = jiraUtil.getSMRecordBySMKey(smTable, smKey);
    var jiraFields = requestData['epFieldList'];
    var fieldList = jiraUtil.getSMFieldsByEPFields(configItem['intId'], jiraFields, requestData['smTable']);
    if (!smRecord || !fieldList) {
        jiraUtil.recordDebugLogs(logger, 'sm record' + smKey + ' not found in table ' + smTable);
        return false;
    }
    var i;
    var len = fieldList.length;
    var updateJiraInfo = {};
    for (i = 0; i < len; i++) {
        var field = fieldList[i];
        var value = outRecord[field];
        var fieldType = smRecord.getFieldType(field);
        updateJiraInfo[field] = value;
        if (fieldType == lib.DataTypeConst.typeArray()) {
            value = jiraUtil.convertHtmlStringToArray(value);
        } else if (fieldType == lib.DataTypeConst.typeDateTime()) {
            value = lib.smis_CommonLib.convertToType(value, 'date');
        }
        smRecord[field] = value;
    }
    var result = smRecord.doUpdate();
    if (result == 0) {
        updateInfoAfterInboundTask(requestData.jiraInfo, updateJiraInfo);
        return true;
    }
}

/* After successfully sync jira updates to sm record, update JiraInfo */
function updateInfoAfterInboundTask(jiraInfoId, updateJiraInfo) {
    var jiraInfo = jiraUtil.getJiraInfoById(jiraInfoId);
    if (jiraInfo) {
        var smData = JSON.parse(jiraInfo.smData);
        var oldData = smData['newData'];
        var key;
        for (key in updateJiraInfo) {
            smData['newData'][key] = updateJiraInfo[key];
        }
        smData['oldData'] = oldData;
        jiraInfo.smData = JSON.stringify(smData, null, 4);
        jiraInfo.twoWayUpdate = false;
        jiraInfo.syncStatus = STATUS_DONE;
        jiraInfo.syncAt = new Date();
        jiraInfo.doUpdate();
    }
}

/* add schedule record when enable smis instance*/
function addScheduleRecord(configItem) {
    var scheduleClass = lib.smis_SchedulerManager.getInfoType(configItem);
    var info = new SCFile("info");
    var RC = info.doSelect("type = \"" + scheduleClass + "\"");
    if (RC != RC_SUCCESS) {
        return false;
    }
    var process_info = info['process.start.infos'];
    var i;
    var len = process_info.length();
    for (i = 0; i < len; i++) {
        scheduleClass = process_info[i]['name'];
        var sch = new SCFile("schedule");
        var rc = sch.doSelect("name = \"" + scheduleClass + "\"");
        var existed = false;

        if (rc == RC_SUCCESS) {
            if (logger.isDebugEnabled()) {
                logger.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_1", "smis", [configItem.name + configItem.intId]));
            }
            existed = true;
        }

        sch.name = scheduleClass;
        var className = lib.smis_SchedulerManager._getSchClassName(scheduleClass);
        sch["class"] = className;
        sch["sched.class"] = className;

        sch.repeat = configItem.getIntervalTimeDate();
        sch.repeata = false; //Annually
        sch.repeatb = false; //Semi-Annually
        sch.repeatm = false; //Monthly
        sch.repeatq = false; //Quarterly
        sch.strings = [sch.name, sch.name];
        //the four options are all false, means the "Other" is true

        sch.javascript = SCHEDULER_SCRIPT(configItem['intId'], i + 1);
        sch.description = ["SM-Jira Intergration"];

        var result = null;
        if (existed) {
            result = sch.doUpdate();
        } else {
            result = sch.doInsert();
        }
    }
    return result == RC_SUCCESS;
}

function SCHEDULER_SCRIPT(intId, thread) {
    return "lib.SMJiraManager.runSchedule(" + intId + ", " + thread + ")";
}

function runSchedule(intId, thread) {
    var config = lib.smis_ConfigurationManager.getInstanceConfig(intId);
    if (config != null) {
        var options = {
            "thread": thread
        };
        var ctrlName = config.ctrlName;
        var controller = new(lib[ctrlName].getClass())(config, options);
        controller.startup();
    }
}

/* create background processor initialization registory when enable smis enstance */
function addInfoRecord(configItem) {
    var type = lib.smis_SchedulerManager.getInfoType(configItem);
    var info = new SCFile("info");
    var RC = info.doSelect("type = \"" + type + "\"");
    if (RC == RC_SUCCESS) {
        info.doDelete();
    }
    info = new SCFile("info");
    info.type = type;
    info.description = "Info for the integration " + configItem.template;
    info.format = "info.startup";

    var dd = 30;
    var className = lib.smis_SchedulerManager._getSchClassName(info.type);
    var number = configItem.getConfigParameterValue("jira.threads.number");
    number = number ? number : 1;

    var thread_max = configItem.getConfigParameterValue("jira.threads.number.max");
    thread_max = thread_max ? thread_max : 1;

    if (number > thread_max) {
        configItem.setConfigParameterValue("jira.threads.number.max", number);
        lib.smis_ConfigurationManager.updateParam(configItem);
    }

    var i;
    for (i = 0; i < number; i++) {
        info["process.start.infos"][i].name = info.type + (i + 1);
        info["process.start.infos"][i].parameters = ["scheduler", className + (i + 1), "" + dd, "1"];
        info["process.start.infos"][i]["suppress.restart"] = false;
    }

    return info.doInsert();
}

function deleteInfoRecord(configItem) {
    lib.smis_SchedulerManager.deleteInfoRecord(configItem);
}

/*delete schedule record*/
function deleteScheduleRecord(configItem) {
    var number = configItem.getConfigParameterValue("jira.threads.number");
    number = number ? number : 1;
    var i;
    var schName;
    var result = false;
    for (i = 1; i < number + 1; i++) {
        schName = configItem.name + configItem.intId + i;
        var sch = new SCFile("schedule");
        var RC = sch.doSelect("name = \"" + schName + "\"");

        if (RC == RC_SUCCESS) {
            if (logger.isDebugEnabled()) {
                logger.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_2", "smis", [sch.name]));
            }
            result = sch.doDelete();
        }
    }
    return result;
}

/* stop backgound processor */
function stopProcess(configItem) {
    //all process
    var process = new SCDatum();
    process.setType(8);
    process = funcs.processes();
    var number = Number(configItem.getConfigParameterValue("jira.threads.number"));
    var i;
    var schName;
    var schedClass;
    for (i = 1; i < number + 1; i++) {
        schedClass = lib.smis_SchedulerManager.getInfoType(configItem) + i;
        className = lib.smis_SchedulerManager._getSchClassName(schedClass);
        if (!lib.smis_SchedulerManager.hasScheduleRecord(schedClass)) {
            var hasRunningSch = getProcID(className, process) != null;
            if (hasRunningSch) {
                logger.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_6", "smis"));
                lib.smis_SchedulerManager.stopSchedule(configItem, className);
                if (getProcID(className, process) != null) {
                    lib.smis_SchedulerManager.stopSchedule(configItem, className);
                }
                if (getProcID(className, process) != null) {
                    logger.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_7", "smis"));
                }
            }
        }
    }
}

function getProcID(className, procs) {
    var procsLen = procs.length();
    var procsCount;
    for (procsCount = 0; procsCount < procsLen; procsCount++) {
        var proc = procs[procsCount];
        if (procs[procsCount + .3] == className) {
            return procs[procsCount + .1];
        }
    }
    return null;
}


/* set log level */
function setLoggerLevel(level) {
    logger.setLevel(level);
}

function getClass() {
    return SMJiraManagerClass;
}