var _e = lib.StringUtil.escapeAllStr;

function getActiveLangList() {
    var langList = [];
    lib.c.$('!language').fields("unique.id").select('active=true').iterate(function(item) {
        langList.push(item.unique_id);
    });

    return langList;
}

function syncLocalizedMsgList(msgId, newMsgId, msgClass, langList) {
    var msg = new SCFile("scmessage");
    var newMsg = new SCFile("scmessage");

    var k;
    for (k = 0; k < langList.length; k++) {
        var language = langList[k];

        var sql = "syslanguage=\"" + language + "\" and class=\"" + _e(msgClass) + "\" and message.id=\"" + _e(msgId) + "\"";
        var newSql = "syslanguage=\"" + language + "\" and class=\"" + _e(msgClass) + "\" and message.id=\"" + _e(newMsgId) + "\"";

        if (msg.doSelect(sql) == RC_SUCCESS && newMsg.doSelect(newSql) == RC_SUCCESS) {
            newMsg.message = msg.message;
            newMsg.doUpdate();
        }
    }
}

// Sync Actions
function syncLocalizedActions(phase, workflowName, newWorkflowName, langList) {
    var i;
    var iLoopTimes = phase.action.length();
    for (i = 0; i < iLoopTimes; i++) {
        var msgId = phase.phaseName + "_" + workflowName + "_" + phase.tableName + ":" + phase.action[i].actionMsgId;
        var newMsgId = phase.phaseName + "_" + newWorkflowName + "_" + phase.tableName + ":" + phase.action[i].actionMsgId;
        syncLocalizedMsgList(msgId, newMsgId, 'wfA', langList);
    }
}

// Sync Transitions
function syncLocalizedTransitions(phase, workflowName, newWorkflowName, langList) {
    var i;
    var iLoopTimes = phase.manualTransition.length();
    for (i = 0; i < iLoopTimes; i++) {
        var msgId = phase.phaseName + "_" + workflowName + "_" + phase.tableName + ":" + phase.manualTransition[i].mtId;
        var newMsgId = phase.phaseName + "_" + newWorkflowName + "_" + phase.tableName + ":" + phase.manualTransition[i].mtId;

        syncLocalizedMsgList(msgId, newMsgId, 'wfT', langList);
    }
}

// Sync WorkflowActions
function syncLocalizedWorkflowActions(workflowName, newWorkflowName, tableName, langList) {
    var workflow = new SCFile('Workflow', SCFILE_READONLY);
    workflow.setFields("action");

    var rc = workflow.doSelect('name="' + _e(workflowName) + '" and tableName="' + tableName + '"');
    if (rc != RC_SUCCESS) {
        return;
    }

    var i;
    var iLoopTimes = workflow.action.length();
    for (i = 0; i < iLoopTimes; i++) {
        var msgId = 'workflow:' + workflowName + "_" + tableName + ":" + workflow.action[i].actionMsgId;
        var newMsgId = 'workflow:' + newWorkflowName + "_" + tableName + ":" + workflow.action[i].actionMsgId;
        syncLocalizedMsgList(msgId, newMsgId, 'wfA', langList);
    }
}

function syncLocalizedPhaseName(phase, workflowName, newWorkflowName, langList) {
    var msgId = phase.phaseName + ';' + workflowName + ';' + phase.tableName;
    var newMsgId = phase.phaseName + ';' + newWorkflowName + ';' + phase.tableName;
    syncLocalizedMsgList(msgId, newMsgId, 'local:WorkflowPhase', langList);
}

// Sync Workflow Localized Data
function syncLocalizedWorkflow(workflowName, newWorkflowName, tableName) {
    var langList = getActiveLangList();
    var phase = new SCFile("WorkflowPhase");
    var psql = "workflowName = \"" + _e(newWorkflowName) + "\" and tableName = \"" + tableName + "\"";

    var rc = phase.doSelect(psql);
    while (rc == RC_SUCCESS) {
        syncLocalizedActions(phase, workflowName, newWorkflowName, langList);
        syncLocalizedTransitions(phase, workflowName, newWorkflowName, langList);
        syncLocalizedPhaseName(phase, workflowName, newWorkflowName, langList);
        rc = phase.getNext();
    }

    syncLocalizedWorkflowActions(workflowName, newWorkflowName, tableName, langList);
}

/**
 * Get the localized display name for workflow phase
 */
function getPhaseDisplayName(workflow, table, phaseName) {
    var phaseDesc = "";
    var scmessage = new SCFile("scmessage");
    var sql = "class =\"local:WorkflowPhase\"" + " and message.id = \"" + phaseName +
        ";" + workflow + ";" + table + "\"";
    if (scmessage.doSelect(sql) === RC_SUCCESS) {
        phaseDesc = scmessage.message;
    }
    return phaseDesc;
}