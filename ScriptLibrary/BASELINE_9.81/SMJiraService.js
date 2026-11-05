var logger = getLog("jira.SMJiraService");
var $ = lib.c.$;
var _ = lib.Underscore.require();
var jiraUtil = lib.SMJiraUtil;
var getDisplayValue = lib.globalListTools.getDisplayValue;

var STATUS_NEW = 'new';
var STATUS_DONE = 'success';
var STATUS_FAILED = 'failed';
var STATUS_SKIP = 'skip';
var STATUS_INPROGRESS = 'in progress';
var STATUS_WAITING = lib.smis_Constants.TASK_STATUS_WAITING();

var OUTBOUND = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
var INBOUND = lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
var BOTH = lib.smis_Constants.MAPPING_DIRECTION_BOTH();

var JIRACOMMENT = "Update to external service";

function setLoggerLevel(level) {
    logger.setLevel(level);
}

//Auto Sync smFile To Jira
function syncSMRecordToJira(smFile) {
    var instance = vars.$jiraProject;
    jiraUtil.recordDebugLogs(logger, 'sync sm record ' + smFile['number'] + ' by SMIS instance - ' + instance);

    var fieldMapping = jiraUtil.getFieldMappingByInstanceId(instance);
    if (!fieldMapping) {
        return false;
    }
    var configItem = lib.smis_ConfigurationManager.getInstanceConfig(instance);
    var config = jiraUtil.getSMISConfig(configItem);
    var jiraInfo = jiraUtil.getJiraInfoBySMKey(funcs.filename(smFile), smFile['number']);
    //create SM->Jira
    if (!jiraInfo) {
        return createFromSMtoJira(smFile, fieldMapping, instance, config);
    } else {
        return updateTriggerBySM(smFile, fieldMapping, jiraInfo, config);
    }
}

/**
 * If the phase of the current Jira record is include in "Stop Phase define in smis", 
 * The sm update will not sync to jira
 */
function inExcludePhase(jiraInfo, config) {
    var excludes = config['jiraStopPhase'];
    var jiraPhase = jiraInfo.jiraPhase;
    if (!excludes || !jiraPhase) {
        return false;
    }
    return excludes.includes(jiraPhase);
}

//Create Jira record from smFile
function createFromSMtoJira(smFile, fieldMapping, instance, config) {
    var i;
    var len = fieldMapping.length();
    var smField;
    var epField;
    var direction;
    var module;
    var smFieldList = [];
    var fileName = funcs.filename(smFile);
    var newData = {};
    for (i = 0; i < len; i++) {
        smField = fieldMapping[i]["SMField"];
        direction = fieldMapping[i]["direction"];
        module = fieldMapping[i]["SMModule"];
        epField = fieldMapping[i]["EPField"];

        if (!jiraUtil.matchMoudel(fileName, module)) {
            continue;
        }

        if (direction == BOTH || direction == OUTBOUND) {
            smFieldList.push(smField);
            if (smFile.getFieldType(smField) == lib.DataTypeConst.typeArray()) {
                newData[smField] = jiraUtil.convertArrayToHtmlString(smFile[smField]);
            } else if (smFile.getFieldType(smField) == lib.DataTypeConst.typeCharacter()) {
                newData[smField] = lib.EmojiUtil.convertEmojiSymbol2Code(smFile[smField]);
            } else {
                newData[smField] = smFile[smField];
            }
        }
    }
    var smData = {
        "fieldList": smFieldList,
        "newData": newData,
        "oldData": {}
    };

    var threadCount = config['threads'];
    var jiraInfo = new SCFile("JiraInfo");
    var id = jiraUtil.nextId("JiraInfo");
    jiraInfo.id = id;
    jiraInfo.intId = instance;
    jiraInfo.intThread = (id % threadCount) + 1;
    jiraInfo.smKey = smFile['number'];
    jiraInfo.smTable = fileName;
    jiraInfo.jiraProject = assignProject(instance, vars.$G_jira_allInstanceInfo);
    jiraInfo.jiraType = vars.$jiraAction;
    jiraInfo.jiraAction = vars.$jiraAction;
    jiraInfo.syncStatus = STATUS_NEW;
    jiraInfo.smUpdateAt = new Date();
    jiraInfo.twoWayUpdate = false;
    jiraInfo.smData = JSON.stringify(smData, null, 4);
    var rc = jiraInfo.doInsert();
    return rc == 0;
}


function assignProject(instance, allInstance) {
    var all = JSON.parse(allInstance);
    var instances = all['instance'];
    var projects = all['projects'];
    var index = instances.indexOf(instance);
    return projects[index];
}

//Update Jira record from incident
function updateTriggerBySM(smFile, fieldMapping, jiraInfo, config) {
    var excludePhase = false;
    var typeChanged = false;
    if (inExcludePhase(jiraInfo, config)) {
        excludePhase = true;
    }
    /* Stop sync jira update to sm if the jira issueType is changed */
    if (jiraInfo['jiraAction'] != jiraInfo['jiraType']) {
        jiraUtil.recordDebugLogs(logger, 'Jira changed the issue type, stopped syncing...');
        typeChanged = true;
    }

    var reSync = false;
    if (jiraInfo.syncStatus == STATUS_FAILED) {
        reSync = true;
        jiraInfo.jiraAction = vars.$jiraAction;
        jiraInfo.jiraType = vars.$jiraAction;
        jiraInfo.intId = vars.$jiraProject;
        jiraInfo.jiraProject = assignProject(vars.$jiraProject, vars.$G_jira_allInstanceInfo);
        removePendingTask(jiraInfo);
    }
    var i;
    var len = fieldMapping.length();
    var smField;
    var epField;
    var direction;
    var module;
    var smData = JSON.parse(jiraInfo['smData']);
    var smFieldList = reSync ? smData['fieldList'] : [];
    var oldData = smData['newData'];
    var newData = {};
    var changed = false;
    for (i = 0; i < len; i++) {
        smField = fieldMapping[i]["SMField"];
        direction = fieldMapping[i]["direction"];
        module = fieldMapping[i]["SMModule"];
        epField = fieldMapping[i]["EPField"];
        var fileName = funcs.filename(smFile);
        if (!jiraUtil.matchMoudel(fileName, module)) {
            continue;
        }

        if (direction == BOTH || direction == OUTBOUND) {
            if (smFile.getFieldType(smField) == lib.DataTypeConst.typeArray()) {
                newData[smField] = jiraUtil.convertArrayToHtmlString(smFile[smField]);
            } else if (smFile.getFieldType(smField) == lib.DataTypeConst.typeCharacter()) {
                newData[smField] = lib.EmojiUtil.convertEmojiSymbol2Code(smFile[smField]);
            } else {
                newData[smField] = smFile[smField];
            }
            var newValue = newData[smField];
            var oldValue = oldData[smField];
            if (newValue != oldValue) {
                smFieldList.push(smField);
                changed = true;
            }else if(null == newValue || undefined == newValue || "" == newValue){
                smFieldList.push(smField);
            }
        }
    }
    if (!changed && reSync == false) {
        jiraUtil.recordDebugLogs(logger, 'no fields changed...');
        return;
    }
    smData = {
        "fieldList": _.unique(smFieldList),
        "newData": newData,
        "oldData": oldData
    };
    var threadCount = config['threads'];
    jiraInfo.intThread = jiraUtil.assignThread(jiraInfo.intThread, threadCount);

    if (!excludePhase && !typeChanged) {
        jiraInfo.syncStatus = STATUS_NEW;
    }
    jiraInfo.smUpdateAt = new Date();
    jiraInfo.smData = JSON.stringify(smData, null, 4);
    var rc = jiraInfo.doUpdate();
    return rc == 0;
}

/* Remove failed task for resynchronization */
function removePendingTask(info) {
    var task = new SCFile("SMISTaskQueue");
    var rc = task.doSelect('internalId="' + info.smKey + '" and status = "' + STATUS_WAITING + '"');
    if (RC_SUCCESS == rc) {
        task.doDelete();
    }
}

function displayJiraInfo(file) {
    cleanUp();
    var key = file['number'];
    var table = funcs.filename(file);
    var jiraInfo = jiraUtil.getJiraInfoBySMKey(table, key);

    var jiraEnable = jiraUtil.isJiraEnable(file);
    var active = jiraUtil.isActive(file);

    vars.$smJira = jiraEnable && (active || jiraInfo != null);

    if (!jiraEnable) {
        return;
    } else {
        if (jiraInfo) {
            vars.$jiraProject = jiraInfo.intId;
            vars.$jiraAction = jiraInfo.jiraAction;
            vars.$jiraIssueType = jiraInfo.jiraType;
            vars.$jiraKey = jiraInfo.jiraKey;
            vars.$lastSyncAt = jiraInfo.syncAt;
            vars.$status = jiraInfo.syncStatus;
            vars.$jiraPhase = jiraInfo.jiraPhase;
        }

        if (jiraInfo || active) {
            var allInstance;
            if (!vars.$G_jira_allInstanceInfo) {
                jiraUtil.getAllEnabledInstance(table);
            }
            allInstance = JSON.parse(vars.$G_jira_allInstanceInfo);
            vars.$jiraProjects = allInstance['instance'];
            vars.$jiraProjectsDisplay = allInstance['alias'];
            lib.SMJiraCustomerConfig.supportJiraTypes(table);
        }
    }

    //diaplay attachments
    displayInfoMore(file);
}

function cleanUp() {
    vars.$jiraProject = null;
    vars.$jiraAction = null;
    vars.$jiraKey = null;
    vars.$lastSyncAt = null;
    vars.$status = null;
    vars.$jiraProjects = null;
    vars.jiraActions = null;
    vars.$jiraIssueType = null;
    vars.$jiraActionsDisPlay = null;
    vars.$jiraPhase = null;
    vars.$smJira = null;
}

/* add sm activity log to jirainfomore then syn to jira comments */
function addCommentToInfoMore(smTable, activity) {
    var activityType = activity['type'];
    var smKey = activity['number'];
    if (activityType != JIRACOMMENT) {
        return false;
    }
    var jiraInfo = jiraUtil.getJiraInfoBySMKey(smTable, smKey);
    if (!jiraInfo) {
        return false;
    }
    var configItem = lib.smis_ConfigurationManager.getInstanceConfig(jiraInfo.intId);
    var threadCount = configItem.getConfigParameterValue("jira.threads.number");

    var jiraInfoMore = jiraUtil.getJiraInfoMoreBySMKey(smTable, smKey);
    if (jiraInfoMore) {
        //Update
        jiraInfoMore.intThread = jiraUtil.assignThread(jiraInfo['intThread'], threadCount);
        var comments = funcs.denull(jiraInfoMore['comments']);
        var len = comments.length();
        jiraInfoMore.comments[len].commentId = activity['thenumber'];
        jiraInfoMore.comments[len].commentTable = funcs.filename(activity);
        jiraInfoMore.comments[len].commentSyncStatus = STATUS_NEW;
        jiraInfoMore.status = STATUS_INPROGRESS;
        jiraInfoMore.doUpdate();
    } else {
        //Create
        jiraInfoMore = new SCFile("JiraInfoMore");
        jiraInfoMore.id = jiraUtil.nextId("JiraInfoMore");
        jiraInfoMore.intId = jiraInfo['intId'];
        jiraInfoMore.intThread = jiraUtil.assignThread(jiraInfo['intThread'], threadCount);
        jiraInfoMore.smTable = smTable;
        jiraInfoMore.smKey = smKey;
        jiraInfoMore.jiraKey = jiraInfo.jiraKey ? jiraInfo.jiraKey : "<pending>";
        jiraInfoMore.status = STATUS_NEW;

        jiraInfoMore.comments[0].commentId = activity['thenumber'];
        jiraInfoMore.comments[0].commentTable = funcs.filename(activity);
        jiraInfoMore.comments[0].commentSyncStatus = STATUS_NEW;
        jiraInfoMore.doInsert();
    }
    return true;
}

/**
 * Make attachment to be selected in wizard
 */
function makeSelectAttachmentListVars(file) {
    var list = makeSelectAttachmentList(file);
    var _makeFileSize = lib.OctaneInfoMore._makeFileSize;

    vars['$jira.attach.list.id'] = list.map(n => n.id);
    vars['$jira.attach.list.name'] = list.map(n => n.name);
    vars['$jira.attach.list.date'] = list.map(n => n.date);
    vars['$jira.attach.list.size'] = list.map(n => _makeFileSize(n.size));
    vars['$jira.attach.list.sizeValue'] = list.map(n => n.size);
}

/**
 * File attachments can be selected
 * return All - Selected
 */
function makeSelectAttachmentList(file) {
    var list = getAllAttachmentList(file);
    if (list.length == 0) {
        return list;
    }
    var current = getCurrentAttachmentList(file);
    if (!current) {
        return list;
    }
    return list.filter(item => !current[item.id]);
}

/**
 * All of the file attachments
 */
function getAllAttachmentList(file) {
    var fileName = funcs.filename(file);
    var id = file.number;
    var list = [];

    var sql = 'segment=0 AND topic=:id AND application =:fileName AND type = "5"';
    $('!SYSATTACHMENTS').fields('uid', 'filename', 'size', 'sysmodtime').find(sql, id, fileName).each(function(item) {
        list.push({
            id: item.uid,
            name: item.filename,
            size: item.size,
            date: item.sysmodtime
        });
    });
    return list;
}

/**
 * Currnet Selected Attachment by file
 */
function getCurrentAttachmentList(file) {
    var info = jiraUtil.getJiraInfoMoreBySMKey(funcs.filename(file), file.number);
    if (!info) {
        return null;
    }
    return getCurrentAttachmentListByInfo(info);
}

/**
 * Currnet Selected Attachment by OctaneInfoMore
 */
function getCurrentAttachmentListByInfo(info) {
    var size = info.attachments.length();
    var current = {};
    var k;
    for (k = 0; k < size; k++) {
        var id = info.attachments[k].attachId;
        current[id] = true;
    }
    return current;
}

/**
 * Selected attachment name in wizard.
 */
function getSelectAttachNameList() {
    var rows = funcs.multiselect_selection("rows");

    vars.$L_selectRows = rows;

    if (!rows) {
        return [];
    }

    var list = rows.toArray();

    return list.map(n => vars['$jira.attach.list.name'][n - 1]);
}

/**
 * Save selected attachment to OctaneInfoMore
 */
function saveSelectedAttachment(file) {
    var rows = vars.$L_selectRows;

    if (!rows) {
        return false;
    }
    var list = rows.toArray();

    var fileName = funcs.filename(file);
    var number = file.number;
    var info = jiraUtil.getJiraInfoBySMKey(fileName, number);
    if (!info) {
        logger.warn('jira info not found for file: ', file);
        return;
    }
    var configItem = lib.smis_ConfigurationManager.getInstanceConfig(info.intId);
    var threadCount = configItem.getConfigParameterValue("jira.threads.number");

    var infoMore = jiraUtil.getJiraInfoMoreBySMKey(fileName, number);
    if (!infoMore) {
        infoMore = new SCFile('JiraInfoMore');
        infoMore.id = jiraUtil.nextId('JiraInfoMore');
        infoMore.intId = info.intId;
        infoMore.smKey = info.smKey;
        infoMore.jiraKey = info.jiraKey ? info.jiraKey : "<pending>";
        infoMore.smTable = info.smTable;
    }

    infoMore.intThread = jiraUtil.assignThread(info['intThread'], threadCount);
    var current = getCurrentAttachmentListByInfo(infoMore);
    list = list.filter(n => {
        var id = vars['$jira.attach.list.id'][n - 1];
        return !current[id];
    });
    var size = list.length;
    infoMore.attachments = funcs.insert(infoMore.attachments, 1, size, jiraUtil.makeStruct());
    var k;
    for (k = 0; k < size; k++) {
        var index = list[k] - 1;
        infoMore.attachments[k].attachId = vars['$jira.attach.list.id'][index];
        infoMore.attachments[k].attachName = vars['$jira.attach.list.name'][index];
        infoMore.attachments[k].attachSize = vars['$jira.attach.list.sizeValue'][index];
        infoMore.attachments[k].attachDate = vars['$jira.attach.list.date'][index];
        infoMore.attachments[k].attachSyncStatus = STATUS_NEW;
    }

    if (infoMore.status != STATUS_SKIP) {
        infoMore.status = STATUS_NEW;
    }

    infoMore.doSave();

    return true;
}

/**
 * display attachments sync with jira
 */
function displayInfoMore(file) {
    cleanInfoMore();
    var info = jiraUtil.getJiraInfoMoreBySMKey(funcs.filename(file), file.number);
    if (!info) {
        return;
    }

    var size = info.attachments.length();

    if (size < 1) {
        return;
    }

    var list = [];
    var k;
    for (k = 0; k < size; k++) {
        var id = info.attachments[k].attachId;
        if (!id) {
            continue;
        }
        list.push({
            id: info.attachments[k].attachId,
            name: info.attachments[k].attachName,
            size: info.attachments[k].attachSize,
            status: info.attachments[k].attachSyncStatus,
            syncAt: info.attachments[k].attachSyncAt,
            result: info.attachments[k].attachSyncResult
        });
    }

    var statusMap = {
        "new": funcs.scmsg('status-new', 'octane'),
        "failed": funcs.scmsg('status-failed', 'octane'),
        "success": funcs.scmsg('status-success', 'octane')
    };

    var _makeFileSize = lib.OctaneInfoMore._makeFileSize;
    var makeResult = lib.OctaneInfoMore.makeResult;

    vars['$jira.attach.list.result'] = [];

    vars['$jira.attach.list.id'] = list.map(n => n.id);
    vars['$jira.attach.list.name'] = list.map(n => n.name);
    vars['$jira.attach.list.size'] = list.map(n => _makeFileSize(n.size));
    vars['$jira.attach.list.status'] = list.map(n => statusMap[n.status] || n.status);
    vars['$jira.attach.list.syncAt'] = list.map(n => n.syncAt);
    vars['$jira.attach.list.result'] = list.map(n => makeResult(n.result));
}

function cleanInfoMore() {
    vars['$jira.attach.list.id'] = [];
    vars['$jira.attach.list.name'] = [];
    vars['$jira.attach.list.size'] = [];
    vars['$jira.attach.list.status'] = [];
    vars['$jira.attach.list.syncAt'] = [];
    vars['$jira.attach.list.result'] = [];
}

/**
 * Remove an attachment from the list
 */
function removeAttachment(file, attachId) {
    if (!file || !attachId) {
        return;
    }

    var info = jiraUtil.getJiraInfoMoreBySMKey(funcs.filename(file), file.number);

    var size = info.attachments.length();

    var index = -1;

    var i;
    for (i = 0; i < size; i++) {
        if (info.attachments[i].attachId == attachId) {
            index = i;
            break;
        }
    }

    if (index >= 0) {
        var k;
        for (k = index; k < size; k++) {
            info.attachments[k].attachId = info.attachments[k + 1].attachId;
            info.attachments[k].attachName = info.attachments[k + 1].attachName;
            info.attachments[k].attachSize = info.attachments[k + 1].attachSize;
            info.attachments[k].attachDate = info.attachments[k + 1].attachDate;
            info.attachments[k].attachSyncStatus = info.attachments[k + 1].attachSyncStatus;
            info.attachments[k].attachSyncAt = info.attachments[k + 1].attachSyncAt;
            info.attachments[k].attachSyncResult = info.attachments[k + 1].attachSyncResult;
        }
        info.attachments = funcs.denull(info.attachments);

        info.doUpdate();
    }
}