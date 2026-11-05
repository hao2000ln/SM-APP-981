var $ = lib.c.$;
var log = getLog("WorkflowTriggers");

function localizeTransitions(record, oldrecord) {
    var i;
    var iLoopTimes;
    var j;
    var jLoopTimes;
    var undefined = "undefined";

    if (oldrecord == null || oldrecord.manualTransition != record.manualTransition) {
        var msgclass = "wfT";
        var actionType = "addonly";
        var ids = [];
        var labels = [];

        iLoopTimes = record.manualTransition.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (record.manualTransition[i].mtId != null && record.manualTransition[i].mtId != undefined && record.manualTransition[i].mtId != "") {
                ids.push(record.phaseName + "_" + record.workflowName + "_" + record.tableName + ":" + record.manualTransition[i].mtId);
                labels.push(record.manualTransition[i].mtOptionName);
            }
        }

        var language = "en";
        if (vars.$G_my_language != null) {
            language = vars.$G_my_language;
        }

        lib.localizeTable.localizeList(ids, labels, language, msgclass, actionType);

        var deleteFields = [];
        var updateFields = [];
        var updateLabels = [];

        jLoopTimes = oldrecord ? oldrecord.manualTransition.length() : 0;
        for (j = 0; j < jLoopTimes; j++) {
            var match = false;
            iLoopTimes = record.manualTransition.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (record.manualTransition[i].mtId != null && record.manualTransition[i].mtId != undefined && record.manualTransition[i].mtId != "") {
                    if (oldrecord.manualTransition[j].mtId != null && oldrecord.manualTransition[j].mtId != undefined && oldrecord.manualTransition[j].mtId != "") {
                        if (record.manualTransition[i].mtId == oldrecord.manualTransition[j].mtId) {
                            match = true;
                            if (record.manualTransition[i].mtOptionName != oldrecord.manualTransition[j].mtOptionName) {
                                updateFields.push(record.phaseName + "_" + record.workflowName + "_" + record.tableName + ":" + record.manualTransition[i].mtId);
                                updateLabels.push(record.manualTransition[i].mtOptionName);
                            }
                        }
                    }
                }
            }

            if (match == false) {
                deleteFields.push(oldrecord.phaseName + "_" + oldrecord.workflowName + "_" + oldrecord.tableName + ":" + oldrecord.manualTransition[j].mtId);
            }
        }

        if (updateFields.length != 0) {
            var updateAction = "add";
            lib.localizeTable.localizeList(updateFields, updateLabels, language, msgclass, updateAction);
        }

        if (deleteFields != null) {
            var deleteAction = "delete";
            lib.localizeTable.localizeList(deleteFields, null, language, msgclass, deleteAction);
        }
    }
}

function localizeWorkflowActions(record, oldrecord) {
    var i;
    var iLoopTimes;
    var j;
    var jLoopTimes;
    var undefined = "undefined";

    if (oldrecord == null || oldrecord.action != record.action) {
        var msgclass = "wfA";
        var actionType = "addonly";
        var ids = [];
        var labels = [];
        iLoopTimes = record.action.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (record.action[i].actionMsgId != null && record.action[i].actionMsgId != undefined && record.action[i].actionMsgId != "") {
                ids.push("workflow:" + record.name + "_" + record.tableName + ":" + record.action[i].actionMsgId);
                labels.push(record.action[i].actionName);
            }
        }

        var language = "en";
        if (vars.$G_my_language != null) {
            language = vars.$G_my_language;
        }

        lib.localizeTable.localizeList(ids, labels, language, msgclass, actionType);

        var deleteFields = [];
        var addFields = [];
        var addLabels = [];

        jLoopTimes = oldrecord ? oldrecord.action.length() : 0;
        for (j = 0; j < jLoopTimes; j++) {
            var match = false;
            iLoopTimes = record.action.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (record.action[i].actionMsgId != null && record.action[i].actionMsgId != undefined && record.action[i].actionMsgId != "") {
                    if (oldrecord.action[j].actionMsgId != null && oldrecord.action[j].actionMsgId != undefined && oldrecord.action[j].actionMsgId != "") {
                        if (record.action[i].actionMsgId == oldrecord.action[j].actionMsgId) {
                            match = true;
                            break;
                        }
                    }
                }
            }

            if (match == false) {
                deleteFields.push("workflow:" + oldrecord.name + "_" + oldrecord.tableName + ":" + oldrecord.action[j].actionMsgId);
            }
        }

        if (deleteFields.length != 0) {
            var deleteAction = "delete";
            lib.localizeTable.localizeList(deleteFields, null, language, msgclass, deleteAction);
        }
    }
}


function localizeActions(record, oldrecord) {
    var i;
    var iLoopTimes;
    var j;
    var jLoopTimes;
    var undefined = "undefined";

    if (oldrecord == null || oldrecord.action != record.action) {
        var msgclass = "wfA";
        var actionType = "addonly";
        var ids = [];
        var labels = [];
        iLoopTimes = record.action.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (record.action[i].actionMsgId != null && record.action[i].actionMsgId != undefined && record.action[i].actionMsgId != "") {
                ids.push(record.phaseName + "_" + record.workflowName + "_" + record.tableName + ":" + record.action[i].actionMsgId);
                labels.push(record.action[i].actionName);
            }
        }

        var language = "en";
        if (vars.$G_my_language != null) {
            language = vars.$G_my_language;
        }

        lib.localizeTable.localizeList(ids, labels, language, msgclass, actionType);

        var deleteFields = [];
        var addFields = [];
        var addLabels = [];

        jLoopTimes = oldrecord ? oldrecord.action.length() : 0;
        for (j = 0; j < jLoopTimes; j++) {
            var match = false;
            iLoopTimes = record.action.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (record.action[i].actionMsgId != null && record.action[i].actionMsgId != undefined && record.action[i].actionMsgId != "") {
                    if (oldrecord.action[j].actionMsgId != null && oldrecord.action[j].actionMsgId != undefined && oldrecord.action[j].actionMsgId != "") {
                        if (record.action[i].actionMsgId == oldrecord.action[j].actionMsgId) {
                            match = true;
                            break;
                        }
                    }
                }
            }

            if (match == false) {
                deleteFields.push(oldrecord.phaseName + "_" + oldrecord.workflowName + "_" + oldrecord.tableName + ":" + oldrecord.action[j].actionMsgId);
            }
        }

        if (deleteFields.length != 0) {
            var deleteAction = "delete";
            lib.localizeTable.localizeList(deleteFields, null, language, msgclass, deleteAction);
        }
    }
}


function localizeForms(record, oldrecord) {
    var i;
    var iLoopTimes;
    var j;
    var jLoopTimes;
    var undefined = "undefined";

    if (oldrecord == null || oldrecord.altForm != record.altForm) {
        var msgclass = "wfF";
        var actionType = "addonly";
        var ids = [];
        var labels = [];
        iLoopTimes = record.altForm.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (record.altForm[i].altFormId != null && record.altForm[i].altFormId != undefined && record.altForm[i].altFormId != "") {
                ids.push(record.phaseName + "_" + record.workflowName + "_" + record.tableName + ":" + record.altForm[i].altFormId);
                labels.push(record.altForm[i].altFormDesc);
            }
        }

        var language = "en";
        if (vars.$G_my_language != null) {
            language = vars.$G_my_language;
        }

        lib.localizeTable.localizeList(ids, labels, language, msgclass, actionType);

        var deleteFields = [];

        jLoopTimes = oldrecord ? oldrecord.altForm.length() : 0;
        for (j = 0; j < jLoopTimes; j++) {
            var match = false;
            iLoopTimes = record.altForm.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (record.altForm[i].altFormId != null && record.altForm[i].altFormId != undefined && record.altForm[i].altFormId != "") {
                    if (oldrecord.altForm[j].altFormId != null && oldrecord.altForm[j].altFormId != undefined && oldrecord.altForm[j].altFormId != "") {
                        if (record.altForm[i].altFormId == oldrecord.altForm[j].altFormId) {
                            match = true;
                        }
                    }
                }
            }

            if (match == false) {
                deleteFields.push(oldrecord.phaseName + "_" + oldrecord.workflowName + "_" + oldrecord.tableName + ":" + oldrecord.altForm[j].altFormId);
            }
        }

        if (deleteFields != null) {
            var deleteAction = "delete";
            lib.localizeTable.localizeList(deleteFields, null, language, msgclass, deleteAction);
        }

        //check which message needs to be updated
        var updateIds = [];
        var updateLabels = [];

        jLoopTimes = oldrecord ? oldrecord.altForm.length() : 0;
        for (j = 0; j < jLoopTimes; j++) {
            iLoopTimes = record.altForm.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (record.altForm[i].altFormId != null && record.altForm[i].altFormId != undefined && record.altForm[i].altFormId != "") {
                    if (oldrecord.altForm[j].altFormId != null && oldrecord.altForm[j].altFormId != undefined && oldrecord.altForm[j].altFormId != "") {
                        if (record.altForm[i].altFormId == oldrecord.altForm[j].altFormId) {
                            if (record.altForm[i].altFormDesc != oldrecord.altForm[j].altFormDesc) {
                                updateIds.push(record.phaseName + "_" + record.workflowName + "_" + record.tableName + ":" + record.altForm[i].altFormId);
                                updateLabels.push(record.altForm[i].altFormDesc);
                            }
                        }
                    }
                }
            }
        }

        if (updateIds != null) {
            var updateAction = "update";
            lib.localizeTable.localizeList(updateIds, updateLabels, language, msgclass, updateAction);
        }
    }
}

function setLocalTransitionMsg(msgclass, id, message) {
    var language = "en";
    if (vars.$G_my_language != null) {
        language = vars.$G_my_language;
    }

    if (message != null && msgclass != null) {
        var msg = new SCFile("scmessage");
        var sql = "syslanguage=\"" + language + "\" and class=\"" + msgclass + "\" and message.id=\"" + id + "\"";
        if (msg.doSelect(sql) == RC_SUCCESS) {
            msg.message = message;
            msg.doUpdate();
            return true;
        }
    }
    return false;
}

function getEngTransitionMsg(msgclass, id) {
    var message;
    var msg = new SCFile("scmessage", SCFILE_READONLY);
    msg.setFields(["message"]);
    var sql = "syslanguage=\"en\" and class=\"" + msgclass + "\" and message.id=\"" + id + "\"";
    if (msg.doSelect(sql) == RC_SUCCESS) {
        message = msg.message;
    }
    return message;

}

function setMessageIds(phase) {
    var mtArray = [];
    var i;
    var iLoopTimes = phase.manualTransition.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (phase.manualTransition[i].mtId != null) {
            mtArray = funcs.insert(mtArray, 0, 1, phase.manualTransition[i].mtId);
        }
    }

    iLoopTimes = phase.manualTransition.length();
    for (i = 0; i < iLoopTimes; i++) {
        if ((phase.manualTransition[i].mtId == -999 || phase.manualTransition[i].mtId == null) && phase.manualTransition[i].mtOptionName != null) {
            phase.manualTransition[i].mtId = getNextOpenId(mtArray);
            mtArray = funcs.insert(mtArray, 0, 1, phase.manualTransition[i].mtId);
        }
    }

    var actionArray = [];
    iLoopTimes = phase.action.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (phase.action[i].actionMsgId != null) {
            actionArray = funcs.insert(actionArray, 0, 1, phase.action[i].actionMsgId);
        }
    }
    iLoopTimes = phase.action.length();
    for (i = 0; i < iLoopTimes; i++) {
        if ((phase.action[i].actionMsgId == -999 || phase.action[i].actionMsgId == null) && phase.action[i].actionId != null) {
            phase.action[i].actionMsgId = getNextOpenId(actionArray);
            actionArray = funcs.insert(actionArray, 0, 1, phase.action[i].actionMsgId);
        }
    }

    var formArray = [];
    iLoopTimes = phase.altForm.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (phase.altForm[i].altFormId != null) {
            formArray = funcs.insert(formArray, 0, 1, phase.altForm[i].altFormId);
        }
    }
    iLoopTimes = phase.altForm.length();
    for (i = 0; i < iLoopTimes; i++) {
        if ((phase.altForm[i].altFormId == -999 || phase.altForm[i].altFormId == null) && phase.altForm[i].altFormName != null) {
            phase.altForm[i].altFormId = getNextOpenId(formArray);
            formArray = funcs.insert(formArray, 0, 1, phase.altForm[i].altFormId);
        }
    }

}

function getNextOpenId(array) {
    var i;
    for (i = 1; i < 30; i++) {
        if (funcs.index(i, array) == 0) {
            return i;
        }
    }
}


/**
 * translate xml strings to SM conditions
 */
function populateWorkflowConditions(record, oldrecord) {
    var i;
    var iLoopTimes;
    var result;

    //convert condition for action
    var action = record.action;
    if (action != null) {
        iLoopTimes = action.length();
        for (i = 0; i < iLoopTimes; ++i) {
            action[i].actionCondition = null;
            if (action[i].actionCondXML != null) {
                result = lib.conditionXmlParser.getRadQueryFromCondtionXml(action[i].actionCondXML);
                action[i].actionCondition = convertResult(result[0]);
            }
            //populate option number
            if (action[i].actionOption == -999 && action[i].actionLoc != null) {
                action[i].actionOption = lib.Workflow.getOptionNumber(record, record.manualTransition[i].mtOptionLoc);
            }
        }
    }

    //convert condition for backend transition
    var bt = record.backendTransition;
    if (bt != null) {
        iLoopTimes = bt.length();
        for (i = 0; i < iLoopTimes; ++i) {
            bt[i].btCondition = null;
            if (bt[i].btCondXML != null) {
                result = lib.conditionXmlParser.getRadQueryFromCondtionXml(bt[i].btCondXML);
                bt[i].btCondition = convertResult(result[0]);
            }
        }
    }
}

/**
 * translate xml strings to SM conditions
 */
function populateWorkflowPhaseConditions(record, oldrecord) {
    var i;
    var iLoopTimes;
    var result;

    //convert condition for manual transition
    var mt = record.manualTransition;
    if (mt != null) {
        iLoopTimes = mt.length();
        for (i = 0; i < iLoopTimes; ++i) {
            mt[i].mtCondition = null;
            if (mt[i].mtCondXML != null) {
                result = lib.conditionXmlParser.getRadQueryFromCondtionXml(mt[i].mtCondXML);
                mt[i].mtCondition = convertResult(result[0]);
            }
            //populate option number
            if (mt[i].mtOption == -999 && mt[i].mtOptionLoc != null) {
                mt[i].mtOption = lib.Workflow.getOptionNumber(record, mt[i].mtOptionLoc);
            }
        }
    }

    //convert condition for default transition
    var at = record.autoTransition;
    if (at != null) {
        iLoopTimes = at.length();
        for (i = 0; i < iLoopTimes; ++i) {
            at[i].atCondition = null;
            if (at[i].atCondXML != null) {
                result = lib.conditionXmlParser.getRadQueryFromCondtionXml(at[i].atCondXML);
                at[i].atCondition = convertResult(result[0]);
            }
        }
    }

    //convert condition for action
    var action = record.action;
    if (action != null) {
        iLoopTimes = action.length();
        for (i = 0; i < iLoopTimes; ++i) {
            action[i].actionCondition = null;
            if (action[i].actionCondXML != null) {
                result = lib.conditionXmlParser.getRadQueryFromCondtionXml(action[i].actionCondXML);
                action[i].actionCondition = convertResult(result[0]);
            }
            //populate option number
            if (action[i].actionOption == -999 && action[i].actionLoc != null) {
                action[i].actionOption = lib.Workflow.getOptionNumber(record, record.manualTransition[i].mtOptionLoc);
            }
        }
    }

    //convert approval recal and reset condition	
    record.approvalsRecalc = null;
    if (record.approvalsRecalcXML != null) {
        result = lib.conditionXmlParser.getRadQueryFromCondtionXml(record.approvalsRecalcXML);
        record.approvalsRecalc = convertResult(result[0]);

    }
    record.approvalsReset = null;
    if (record.approvalsResetXML != null) {
        result = lib.conditionXmlParser.getRadQueryFromCondtionXml(record.approvalsResetXML);
        record.approvalsReset = convertResult(result[0]);
    }

    //convert alert recal and reset condition	
    record.alertsRecalc = null;
    if (record.alertsRecalcXML != null) {
        result = lib.conditionXmlParser.getRadQueryFromCondtionXml(record.alertsRecalcXML);
        record.alertsRecalc = convertResult(result[0]);
    }
    record.alertsReset = null;
    if (record.alertsResetXML != null) {
        result = lib.conditionXmlParser.getRadQueryFromCondtionXml(record.alertsResetXML);
        record.alertsReset = convertResult(result[0]);
    }

    //convert the edit condition
    record.updateCond = null;
    if (record.updateCondXML != null) {
        result = lib.conditionXmlParser.getRadQueryFromCondtionXml(record.updateCondXML);
        record.updateCond = convertResult(result[0]);
    }

    //convert the additional forms condition
    var af = record.altForm;
    if (af != null) {
        iLoopTimes = af.length();
        for (i = 0; i < iLoopTimes; ++i) {
            af[i].altFormCondition = null;
            if (af[i].altFormCondXML != null) {
                result = lib.conditionXmlParser.getRadQueryFromCondtionXml(af[i].altFormCondXML);
                af[i].altFormCondition = convertResult(result[0]);
            }
        }
    }
}

/**
 * This function is called to convert the result type to operator. Exceptions are true and false values
 */
function convertResult(res) {
    if (log.isDebugEnabled()) {
        log.debug(res);
    }

    if (funcs.str(res).split(' ').join('') == "(true)") {
        return funcs.val("true", 4);
    }

    if (funcs.str(res).split(' ').join('') == "(false)") {
        return funcs.val("false", 4);
    }

    return funcs.val(res, 10);
}


/**
 * This function syncs up workflow with category associated with the workflow
 */
function syncCategory(record, oldrecord) {
    if (record['is.legacy.workflow'] == true && (record['tableName'] == "cm3r" || record['tableName'] == "cm3t")) {
        var sch = new SCFile("schedule");
        var name = "sync " + record['tableName'] + " category for workflow " + record["name"];
        if (sch.doSelect('name="' + name + '"') != RC_SUCCESS) {
            sch.name = name;
            sch.javascript = 'lib.changeManagement.syncCatPhase("' + record['tableName'] + '","' + record["name"] + '");';
            sch.expiration = new Date();
            sch['class'] = "change";
            sch.status = "scheduled";
            sch.doInsert();
        }
    }
}

/**
 * This function syncs up workflow phase with phase record defined in Object record
 */
function syncPhase(record, oldrecord, action) {
    //see if there is any phase record defined on object record
    var obj = new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["phase.file.name"]);
    var sql = "file.name=\"" + record.tableName + "\"";
    if (obj.doSelect(sql) == RC_SUCCESS) {
        if (obj.phase_file_name == null || funcs._null(obj.phase_file_name)) {
            return;
        }

        if (action == "add") {
            processAddPhase(record, obj.phase_file_name);
        } else if (action == "update") {
            processAddPhase(record, obj.phase_file_name);
        } else if (action == "delete") {
            processDeletePhase(record, obj.phase_file_name);
        }
    }
}

function processAddPhase(record, phaseFileName) {
    //first, see if the phase exist	
    var phase = new SCFile(phaseFileName);
    var sql = "name=\"" + record.phaseName + "\"";
    if (phase.doSelect(sql) == RC_SUCCESS) {
        if (phase.description != record.description) {
            phase.description = record.description;
            phase.doUpdate();
        }
        return; //if already exist, do nothing
    } else {
        phase.name = record.phaseName;
        phase.description = record.description;
        var rc = phase.doInsert();
    }
}

function processDeletePhase(record, phaseFileName) {
    //see if any other workflow phase record with this phase name exist
    var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    wfPhase.setFields(["phaseName"]);
    var sql = "phaseName=\"" + record.phaseName + "\"";
    if (wfPhase.doSelect(sql) == RC_SUCCESS) {
        return; //if other wfphase exists, do nothing
    } else {
        var phase = new SCFile(phaseFileName);
        sql = "name=\"" + record.phaseName + "\"";
        if (phase.doSelect(sql) == RC_SUCCESS) {
            phase.doDelete();
        }
    }
}

/**
 *  strip invalid tag to avoid xss attack for description 
 */
function workflowDescriptionHandling(record) {
    //strip invalid tag to avoid xss attack
    if (record["description"] != null && record["description"] != "") {
        record["description"] = lib.XSSUtil.strip_tags(record["description"]);
    }
}

/**
 *  strip invalid tag to avoid xss attack for description , manual transition and auto transition
 */
function workflowPhaseDescriptionHandling(record) {

    if (record["detailedDescription"] != null && record["detailedDescription"] != "") {
        record["detailedDescription"] = lib.XSSUtil.strip_tags(record["detailedDescription"]);
    }

    var i;
    var length;

    if (record['manualTransition'] != null && funcs.lng(record['manualTransition']) > 0) {
        length = funcs.lng(record['manualTransition']);
        for (i = 0; i < length; i++) {
            if (record['manualTransition'][i]['mtDescription'] != null && record['manualTransition'][i]['mtDescription'] != "") {
                record['manualTransition'][i]['mtDescription'] = lib.XSSUtil.strip_tags(record['manualTransition'][i]['mtDescription']);
            }
        }
    }

    if (record['autoTransition'] != null && funcs.lng(record['autoTransition']) > 0) {
        length = funcs.lng(record['autoTransition']);
        for (i = 0; i < length; i++) {
            if (record['autoTransition'][i]['atDescription'] != null && record['autoTransition'][i]['atDescription'] != "") {
                record['autoTransition'][i]['atDescription'] = lib.XSSUtil.strip_tags(record['autoTransition'][i]['atDescription']);
            }
        }
    }
}

/**
 * Delete Workflow related ModuleStatus
 *
 * @param	{SCFile}	workflow
 */
function deleteModuleStatus(workflow) {
    $("ModuleStatus").select('module="' + workflow.tableName + '" and workflow="' + workflow.name + '"').iterate(function(status) {
        status.doDelete();
    });
}