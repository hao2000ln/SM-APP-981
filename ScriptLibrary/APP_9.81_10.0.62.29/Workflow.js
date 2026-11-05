var $ = lib.c.$;

function getPhase(workflow, phaseName) {
    var phase = new SCFile("WorkflowPhase");
    var sql = "workflowName =\"" + workflow.name + "\" and phaseName = \"" + phaseName + "\" and tableName=\"" + workflow.tableName + "\"";

    if (phase.doSelect(sql) == RC_SUCCESS) {
        return phase;
    }
}


function savePhase(workflow, info) {
    var phase = new SCFile("WorkflowPhase");
    var sql = "workflowName =\"" + workflow.name + "\" and phaseName = \"" + info.phaseName + "\" and tableName=\"" + workflow.tableName + "\"";

    if (phase.doSelect(sql) == RC_SUCCESS) {
        phase.description = info.description;
        phase.displayForm = info.displayForm;
        phase.onCreateRules = info.onCreateRules;
        phase.onUpdateRules = info.onUpdateRules;
        phase.onDeleteRules = info.onDeleteRules;
        var rc = phase.doUpdate();
        if (rc == RC_SUCCESS) {
            print("Phase settings updated.");
        }
    }
}

function newTransition(workflow, currentPhase) {
    var phase = getPhase(workflow, vars.$wf_from_phase);
    var i;
    var type = vars.$wf_type;
    var rc;
    if (type != "auto" && type != "default") {
        type = "manual";
    }

    if (type == "auto") {
        i = funcs.lng(funcs.denull(phase.autoTransition));

        phase.autoTransition[i].atToPhase = vars.$wf_phasename;
        phase.autoTransition[i].atCondition = vars.$wf_condition;
        phase.autoTransition[i].atRules = vars.$wf_rules;
        phase.manualTransition[i].atCondXML = vars.$wf_conditionXML;
        phase.manualTransition[i].atCondDesc = vars.$wf_conditionDesc;
    } else if (type == "manual") {
        var id = 0;
        var x;
        for (x in phase.manualTransition) {
            if (phase.manualTransition[x].mtId != null) {
                id = Math.max(id, phase.manualTransition[x].mtId);
            }
        }
        id++;

        i = funcs.lng(funcs.denull(phase.manualTransition));
        phase.manualTransition[i].mtToPhase = vars.$wf_phasename;
        phase.manualTransition[i].mtOptionName = vars.$wf_option;
        phase.manualTransition[i].mtOptionLoc = funcs.val(vars.$wf_location);
        phase.manualTransition[i].mtCondition = funcs.val(vars.$wf_condition, 10);
        phase.manualTransition[i].mtOption = getOptionNumber(phase, vars.$wf_location);
        phase.manualTransition[i].mtRules = vars.$wf_rules;
        phase.manualTransition[i].mtSecRight = vars.$wf_secRight;
        phase.manualTransition[i].mtId = id;
        phase.manualTransition[i].mtCondXML = vars.$wf_conditionXML;
        phase.manualTransition[i].mtCondDesc = vars.$wf_conditionDesc;
    } else {
        phase.defaultTransition = vars.$wf_phasename;
        phase.defaultTransitionRules = vars.$wf_rules;
    }

    rc = phase.doUpdate();

    var newPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    newPhase.setFields("phaseName");
    var sql = "workflowName =\"" + workflow.name + "\" and phaseName = \"" + vars.$wf_phasename + "\" and tableName=\"" + workflow.tableName + "\"";

    if (newPhase.doSelect(sql) != RC_SUCCESS) {
        createNewPhase(vars.$wf_phasename, workflow);
    }

    if (rc == RC_SUCCESS) {
        print("Transition added.");
        return true;
    }

    return false;
}

function saveTransition(workflow, currentPhase, transitionId) {
    var phase = getPhase(workflow, currentPhase);
    var tokens = transitionId.split(":");
    var i = tokens[1] - 1;
    if (tokens[0].toString() == "true" && tokens[1].toString() != "0") {
        phase.autoTransition[i].atToPhase = vars.$wf_phasename;
        phase.autoTransition[i].atCondition = null;
        phase.autoTransition[i].atCondition = vars.$wf_condition;
        phase.autoTransition[i].atRules = vars.$wf_rules;
    } else if (tokens[1].toString() != "0") {
        phase.manualTransition[i].mtToPhase = vars.$wf_phasename;
        phase.manualTransition[i].mtOptionName = vars.$wf_option;
        phase.manualTransition[i].mtOptionLoc = vars.$wf_location;
        phase.manualTransition[i].mtCondition = funcs.val(vars.$wf_condition, 10);
        phase.manualTransition[i].mtRules = vars.$wf_rules;
        if (phase.manualTransition[i].mtOption == null ||
            (vars.$wf_location == 1 && phase.manualTransition[i].mtOption > 80) ||
            ((vars.$wf_location == 2 && phase.manualTransition[i].mtOption < 280) ||
                phase.manualTransition[i].mtOption > 300) ||
            (vars.$wf_location == 3 && phase.manualTransition[i].mtOption < 3000)) {
            phase.manualTransition[i].mtOption = 0;
            phase.manualTransition[i].mtOption = getOptionNumber(phase, vars.$wf_location);
        }
        phase.manualTransition[i].mtSecRight = vars.$wf_secRight;

        if (phase.manualTransition[i].mtId == null) {
            var id = 0;
            var x;
            for (x in phase.manualTransition) {
                if (phase.manualTransition[x].mtId != null) {
                    id = Math.max(id, phase.manualTransition[x].mtId);
                }
            }
            id++;
            phase.manualTransition[i].mtId = id;
        }
    } else {
        phase.defaultTransition = vars.$wf_phasename;
        phase.defaultTransitionRules = vars.$wf_rules;
    }

    var rc = phase.doUpdate();
    if (rc == RC_SUCCESS) {
        print("Transition Updated");
        return true;
    }

    return false;
}

function createNewPhase(phaseName, workflow) {
    var phase = new SCFile("WorkflowPhase");

    phase.phaseName = phaseName;
    phase.workflowName = workflow.name;
    phase.tableName = workflow.tableName;
    phase.active = true;

    var temp = lib.tableFunctions.cnvrtCamelCase(phaseName);
    temp = lib.tableFunctions.cnvrt2title(temp);
    phase.description = temp;

    var rc = phase.doInsert();
}

function getOptionNumber(phase, type) {
    var option = 60;
    var newOption = 0;
    var arrays = new SCDatum();
    arrays.setType(8);

    var i;
    var iLoopTimes = phase.manualTransition.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (phase.manualTransition[i].mtOptionLoc == type) {
            arrays = funcs.insert(arrays, 0, 1, phase.manualTransition[i].mtOption);
        }
    }

    iLoopTimes = phase.action.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (phase.action[i].actionLoc == type) {
            arrays = funcs.insert(arrays, 0, 1, phase.action[i].actionOption);
        }
    }

    if (type == 2) {
        option = 280;
    } else if (type == 3) {
        option = 3000;
    }

    for (i = 0; i < 20; i++) {
        newOption = option + i;

        if (funcs.index(newOption, arrays) == 0) {
            return newOption;
        }
    }

    print("No empty option found.");
    return null;
}

/**
 The parameter values will be printed in rtm:3 log if it is called by RAD
 */
function getWorkflowNameByLocalFile() {
    return getWorkflowName(vars.$L_file);
}


/**QCCR1E101238, SM934, dengxin
 **add readonly for doselect, and add the selected fields
 **getWorkflowName, apply for category 
 */
function getWorkflowName(record, object) {
    var filename = getWorkflowTableName(funcs.filename(record));
    var obj = lib.objectHelper.getObject(object, filename, null, record);
    obj = obj[0];
    if (obj != null) {
        if (obj.workflowLocation == "object") {
            return obj.workflow;
        } else if (obj.workflowLocation == "category") {
            var category = new SCFile(obj.category_file_name, SCFILE_READONLY);
            category.setFields("workflow");
            var sql = "name=\"" + record.category + "\"";
            if (category.doSelect(sql) == RC_SUCCESS) {
                return category.workflow;
            }
        }
        return obj.file_name;
    }

    return null;
}

function createDefaultWorkflow(tableName, wfName, type) {
    var wf = new SCFile("Workflow");
    if (wfName == null) {
        wfName = tableName;
    }
    wf.name = wfName;
    wf.tableName = tableName;
    wf.type = "simple";
    wf.defaultPhase = tableName;
    wf.defaultForm = tableName;
    var rc = wf.doInsert();
    var phase;
    if (rc == RC_SUCCESS) {
        phase = new SCFile("WorkflowPhase");
        phase.workflowName = tableName;
        phase.tableName = tableName;
        phase.phaseName = tableName;
        rc = phase.doInsert();
    }
    if (rc == RC_SUCCESS && type == "document") {
        phase = new SCFile("WorkflowPhase");
        phase.workflowName = tableName;
        phase.tableName = tableName;
        phase.phaseName = "new";
        phase.defaultTransition = tableName;
        rc = phase.doInsert();
    }

    return rc;
}

function getNewPhaseActiveFlag(oldPhase, phaseName) {
    var phase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    phase.setFields("active");
    var sql = "workflowName =\"" + oldPhase.workflowName + "\" and phaseName = \"" + phaseName + "\" and tableName=\"" + oldPhase.tableName + "\"";

    if (phase.doSelect(sql) == RC_SUCCESS) {
        return phase.active;
    }
    return true;
}

function getActionForEdit(action, phase, position) {
    position--;
    action.name = phase.action[position].actionName;
    var msgclass = "wfA." + phase.phaseName + "_" + phase.workflowName + "_" + phase.tableName;
    var engString = lib.WorkflowTriggers.getEngTransitionMsg(msgclass, phase.action[position].actionId);
    if (engString != null) {
        var temp = funcs.scmsg(phase.action[position].actionMsgId, msgclass);
        action.name = temp;
    }

    action.action = phase.action[position].actionId;
    action.conditionXML = phase.action[position].actionCondXML;
    action.conditionDesc = phase.action[position].actionCondDesc;
    action.id = msgclass;
    action.location = funcs.val(phase.action[position].actionLoc);
    action.condition = phase.action[position].actionCondition;
    action.lock = phase.action[position].actionLock;
    action.runAction = phase.action[position].actionRunAction;
}

function addNewAction(thisAction, phase, position) {
    position--;
    if (position >= 0) {
        phase.action[position].actionName = thisAction.name;
        var msgclass = "wfA." + phase.phaseName + "_" + phase.workflowName + "_" + phase.tableName;
        var id = phase.action[position].actionMsgId;
        var rc = lib.WorkflowTriggers.setLocalTransitionMsg(msgclass, id, thisAction.name);

        if (rc == true) {
            var engString = lib.WorkflowTriggers.getEngTransitionMsg(msgclass, id);
            phase.action[position].actionName = engString;
        }
        var oldAction = phase.action[position].actionLoc;
        phase.action[position].actionId = thisAction.action;
        phase.action[position].actionCondition = funcs.val(thisAction._condition, 10);
        phase.action[position].actionCondXML = thisAction.conditionXML;
        if (phase.action[position].actionCondition == null || phase.action[position].actionCondition == "") {
            if (phase.action[position].actionCondXML == null || phase.action[position].actionCondXML == "") {
                phase.action[position].actionCondition = funcs.val("true", 10);
            } else {
                phase.action[position].actionCondition = funcs.val("false", 2);
            }
        }
        phase.action[position].actionCondDesc = thisAction.conditionDesc;
        phase.action[position].actionLoc = funcs.val(thisAction.location);
        if (phase.action[position].actionOption == null || (oldAction != null && oldAction != thisAction.location)) {
            phase.action[position].actionOption = getOptionNumber(phase, thisAction.location);
        }
        phase.action[position].actionLock = thisAction.lock;
        phase.action[position].actionRunAction = thisAction.runAction;
    }
}

/** method to split the parameter for wfEvent **/
function parseEvent(event) {
    var strEvent = String(event);
    return strEvent.split(':');
}


/** get workflow from existing workflow phase **/
function getWorkflowViaPhase(phase) {
    var workflow = new SCFile("Workflow");
    var workflowSql = "name =\"" + phase.workflowName + "\" and tableName=\"" + phase.tableName + "\"";
    if (workflow.doSelect(workflowSql) == RC_SUCCESS) {
        vars['$L.migrated.workflow'] = workflow.is_legacy_workflow == true;
        return workflow;
    }
}

/**
 * gets the next workflow record, if it is adding a new record, then gets the first workflow
 */
function getNextWorkflowPhaseByLocalFile(currentWorkflowPhase) {
    return getNextWorkflowPhase(vars.$L_file, currentWorkflowPhase);
}

/**
 * gets the next workflow record, if it is adding a new record, then gets the first workflow
 */
function getNextWorkflowPhase(currentRecord, currentWorkflowPhase) {
    var filename = getWorkflowTableName(funcs.filename(currentRecord));

    // update by Xiong-jie MA 2014-07-28, to support file level ruleset/action
    var objectRet = lib.objectHelper.getObject(null, filename, null, currentRecord);
    var object = objectRet[0];
    var workflowName = getWorkflowName(currentRecord, object);
    if (workflowName != null) {
        var workflow = new SCFile("Workflow");
        var workflowSql = "name =\"" + workflowName + "\" and tableName=\"" + filename + "\"";
        if (workflow.doSelect(workflowSql) == RC_SUCCESS) {
            vars.$L_workflow = workflow;
            var phase;
            if (currentWorkflowPhase == null) {
                phase = getPhase(workflow, workflow.firstPhase);
                return combinCommonPhase(phase, workflow, object);
            } else {
                phase = getPhase(workflow, currentWorkflowPhase);
                return combinCommonPhase(phase, workflow, object);
            }
        }
    }

    return null;
}

/**
 * gets the next Phase (be noted, here it is not WorkflowPhase)
 */
function getNextPhase(currentRecord, currentWorkflowPhase, object) {
    if (funcs.exists("current.phase", currentRecord) && object["phase.file.name"] != null) {
        var rec = new SCFile(object["phase.file.name"]);
        var sql = "name =\"" + currentWorkflowPhase + "\"";
        if (rec.doSelect(sql) == RC_SUCCESS) {
            return rec;
        } else {
            return null;
        }
    }

    return null;
}

/** 
 *	let workflow rules/action run before phase rules/action,
 **/
function combinCommonPhase(phase, workflow, object) {
    //workflow may null in some document flow
    if (workflow == null) {
        workflow = new SCFile("Workflow");
        var workflowSql = "name =\"" + phase.workflowName + "\" and tableName=\"" + phase.tableName + "\"";
        if (workflow.doSelect(workflowSql) != RC_SUCCESS) {
            return phase;
        }
    }

    // update by Xiong-jie MA 2014-08-02, to support "After successful enter"
    joinArray(workflow, phase, "onUpdateRules");
    joinArray(workflow, phase, "afterUpdateRules");
    joinArray(workflow, phase, "initRules");
    joinArray(workflow, phase, "onDisplayRules");
    joinArray(workflow, phase, "afterEnterRules");

    if (null != object) {
        joinArray(object, phase, "onUpdateRules");
        joinArray(object, phase, "afterUpdateRules");
        joinArray(object, phase, "initRules");
        joinArray(object, phase, "onDisplayRules");
        joinArray(object, phase, "afterEnterRules");
    }

    //set mark action flag to indicate from workflow, the actually value should minus 10000
    var i;
    var iLoopTimes = workflow.action.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (null == workflow.action[i]) {
            continue;
        }
        workflow.action[i].actionMsgId = 10000 + workflow.action[i].actionMsgId;
    }
    joinArray(workflow, phase, "action");

    if (null != object) {
        //set mark action flag to indicate from object, the actually value should minus 20000
        iLoopTimes = object.action.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (null == object.action[i]) {
                continue;
            }
            object.action[i].actionMsgId = 20000 + object.action[i].actionMsgId;
        }
        joinArray(object, phase, "action");
        // set the actionMsgId back after merge
        iLoopTimes = object.action.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (null == object.action[i]) {
                continue;
            }
            object.action[i].actionMsgId = object.action[i].actionMsgId - 20000;
        }
    }

    return phase;
}

/** 
 *	append Datum list2 to list1
 *   Use RAD function to join the array to resolve array of structure combination.
 *   phase.onXRule=phase.onXRule may make the value to empty. remove the null setting.
 **/
function joinArray(workflow, phase, field) {
    var wfFieldValue = workflow[field];
    if (wfFieldValue == null) {
        return;
    }
    var wfLen = funcs.lng(wfFieldValue);

    if (wfLen == 0) {
        return;
    }
    if (wfLen == 1 && wfFieldValue[0] == null) {
        return;
    }

    if (workflow != null && phase != null) {
        //QCCR1E132181 Signal 11 error received when changing workflow phase to Post Implementation Reiew
        if (phase[field] == null) {
            phase[field] = [];
        }
        //QCCR1E119220, [Performance Improvement] Need to optimize JS function by using funcs.insert() instead of parse_evaluate()
        var i;
        for (i = wfLen - 1; i >= 0; i--) {
            insertDatum(phase[field], 1, 1, wfFieldValue[i], false);
        }
    }
}

function getFormForEdit(form, phase, position) {
    position--;
    form.string = phase.altForm[position].altFormDesc;
    var msgclass = "wfF." + phase.phaseName + "_" + phase.workflowName + "_" + phase.tableName;
    var engString = lib.WorkflowTriggers.getEngTransitionMsg(msgclass, phase.altForm[position].altFormId);
    if (engString != null) {
        var temp = funcs.scmsg(phase.altForm[position].altFormId, msgclass);
        form.string = temp;
    }
    form.string1 = phase.altForm[position].altFormName;
    form.strings1[2] = phase.altForm[position].altFormCondXML;
    form.strings1[3] = msgclass;
    form.strings1[4] = funcs.str(phase.altForm[position].altFormId);
    form._boolean = phase.altForm[position].altFormCondition;
    form.strings[0] = phase.altForm[position].altFormRight;
    form.strings2[0] = lib.simpleCondition.getDescription(phase.altForm[position].altFormCondXML);
}

function addNewForm(thisAction, phase, position) {
    position--;
    if (position >= 0) {
        phase.altForm[position].altFormDesc = thisAction.string;
        var msgclass = "wfF." + phase.phaseName + "_" + phase.workflowName + "_" + phase.tableName;
        var id = phase.altForm[position].altFormId;
        var rc = lib.WorkflowTriggers.setLocalTransitionMsg(msgclass, id, thisAction.string);

        if (rc == true) {
            var engString = lib.WorkflowTriggers.getEngTransitionMsg(msgclass, id);
            phase.altForm[position].altFormDesc = engString;
        }
        phase.altForm[position].altFormName = thisAction.string1;
        phase.altForm[position].altFormCondXML = thisAction.strings1[2];
        phase.altForm[position].altFormCondition = funcs.parse(thisAction._boolean, 4);
        phase.altForm[position].altFormRight = thisAction.strings[0];

        if (phase.altForm[position].altFormId == null) {
            id = 0;
            var x;
            for (x in phase.altForm) {
                if (phase.altForm[x].altFormId != null) {
                    id = Math.max(id, phase.altForm[x].altFormId);
                }
            }
            id++;
            phase.altForm[position].altFormId = id;
        }
    }

}

/**
copy the rules and use the prefix rule name
**/
function copyRuleSet(phase, prefix, field) {
    phase[field] = funcs.denull(phase[field]);
    var i;
    var lng = funcs.lng(phase[field]);
    for (i = 0; i < lng; i++) {
        var rule = new SCFile("RuleSet");
        var pRule = new SCFile("RuleSet", SCFILE_READONLY);
        pRule.setFields("id");
        var rsql = "id=\"" + phase[field][i] + "\"";
        var psql = "id=\"" + prefix + "." + phase[field][i] + "\"";

        if (pRule.doSelect(psql) != RC_SUCCESS) {
            if (rule.doSelect(rsql) == RC_SUCCESS) {
                rule.id = prefix + "." + rule.id;
                rule.name = "(" + prefix + ") " + rule.name;
                rule.sysrestricted = false;
                rule.doInsert();
            }
        }
        phase[field][i] = prefix + "." + phase[field][i];
    }
}

function clone(workflow, newWorkflowName, doRules, prefix) {
    // First check to see if new workflow name is valid
    var wf = new SCFile("Workflow");

    var wfCheck = "name=\"" + newWorkflowName + "\" and tableName=\"" + workflow.tableName + "\"";
    if (wf.doSelect(wfCheck) == RC_SUCCESS) {
        var msg = "The workflow name already exists, please select another";
        print(msg);
        return false;
    }
    doRules = doRules == "true";
    // Create new Workflow and WorkflowPhase records
    wf.name = newWorkflowName;
    wf.tableName = workflow.tableName;
    wf.type = workflow.type;
    wf.defaultPhase = workflow.defaultPhase;
    wf.description = workflow.description;
    wf.defaultForm = workflow.defaultForm;
    wf.firstPhase = workflow.firstPhase;
    wf.onCreateRules = workflow.onCreateRules;
    wf.onUpdateRules = workflow.onUpdateRules;
    wf.afterAddRules = workflow.afterAddRules;
    wf.afterUpdateRules = workflow.afterUpdateRules;
    wf.initRules = workflow.initRules;
    wf.onDisplayRules = workflow.onDisplayRules;
    //QCCR1E113617
    wf.onEnterRules = workflow.onEnterRules;
    wf.onExitRules = workflow.onExitRules;
    wf.afterEnterRules = workflow.afterEnterRules;

    wf.action = workflow.action;
    wf.backendTransition = workflow.backendTransition;
    wf.sysrestricted = false;
    wf['optimize.autotran.save'] = workflow['optimize.autotran.save'];

    var i;
    var j;
    var lng;
    var tlng;

    var rule;
    var pRule;
    var rsql;
    var psql;

    if (doRules) {
        //Clone workflow based Rulesets
        lng = wf.action.length();
        for (i = 0; i < lng; i++) {
            if (wf.action[i].actionId == null) {
                continue;
            }
            rule = new SCFile("RuleSet");
            pRule = new SCFile("RuleSet", SCFILE_READONLY);
            pRule.setFields("id");
            rsql = "id=\"" + wf.action[i].actionId + "\"";
            psql = "id=\"" + prefix + "." + wf.action[i].actionId + "\"";

            if (pRule.doSelect(psql) != RC_SUCCESS) {
                if (rule.doSelect(rsql) == RC_SUCCESS) {
                    rule.id = prefix + "." + rule.id;
                    rule.name = "(" + prefix + ") " + rule.name;
                    rule.sysrestricted = false;
                    rule.doInsert();
                }
            }
            wf.action[i].actionId = prefix + "." + wf.action[i].actionId;
        }

        //clone backendTransition based on rulesets
        lng = wf.backendTransition.length();
        for (i = 0; i < lng; i++) {
            if (wf.backendTransition[i].btRule == null) {
                continue;
            }
            rule = new SCFile("RuleSet");
            pRule = new SCFile("RuleSet", SCFILE_READONLY);
            pRule.setFields("id");
            rsql = "id=\"" + wf.backendTransition[i].btRule + "\"";
            psql = "id=\"" + prefix + "." + wf.backendTransition[i].btRule + "\"";

            if (pRule.doSelect(psql) != RC_SUCCESS) {
                if (rule.doSelect(rsql) == RC_SUCCESS) {
                    rule.id = prefix + "." + rule.id;
                    rule.name = "(" + prefix + ") " + rule.name;
                    rule.sysrestricted = false;
                    rule.doInsert();
                }
            }
            wf.backendTransition[i].btRule = prefix + "." + wf.backendTransition[i].btRule;
        }

        copyRuleSet(wf, prefix, "onCreateRules");
        copyRuleSet(wf, prefix, "onUpdateRules");
        copyRuleSet(wf, prefix, "afterAddRules");
        copyRuleSet(wf, prefix, "afterUpdateRules");
        copyRuleSet(wf, prefix, "initRules");
        copyRuleSet(wf, prefix, "onDisplayRules");
        //QCCR1E113617 
        copyRuleSet(wf, prefix, "onEnterRules");
        copyRuleSet(wf, prefix, "onExitRules");
        copyRuleSet(wf, prefix, "afterEnterRules");
    }
    wf.doInsert();

    var phase = new SCFile("WorkflowPhase");
    var sql = "workflowName = \"" + workflow.name + "\" and tableName = \"" + workflow.tableName + "\"";

    if (phase.doSelect(sql) == RC_SUCCESS) {
        do {
            phase.workflowName = newWorkflowName;

            //Do not clone form for the phase
            if (doRules) {
                //Clone Rule Sets that are defined as "Available as action" (field isAction set to true)
                lng = phase.action.length();
                for (i = 0; i < lng; i++) {
                    rule = new SCFile("RuleSet");
                    pRule = new SCFile("RuleSet", SCFILE_READONLY);
                    pRule.setFields("id");
                    rsql = "id=\"" + phase.action[i].actionId + "\"";
                    psql = "id=\"" + prefix + "." + phase.action[i].actionId + "\"";

                    if (pRule.doSelect(psql) != RC_SUCCESS) {
                        if (rule.doSelect(rsql) == RC_SUCCESS) {
                            rule.id = prefix + "." + rule.id;
                            rule.name = "(" + prefix + ") " + rule.name;
                            rule.sysrestricted = false;
                            rule.doInsert();
                        }
                    }
                    phase.action[i].actionId = prefix + "." + phase.action[i].actionId;
                }

                copyRuleSet(phase, prefix, "onCreateRules");
                copyRuleSet(phase, prefix, "onUpdateRules");
                copyRuleSet(phase, prefix, "onDeleteRules");
                copyRuleSet(phase, prefix, "afterUpdateRules");
                copyRuleSet(phase, prefix, "initRules");
                copyRuleSet(phase, prefix, "onDisplayRules");
                //QCCR1E113617 
                copyRuleSet(phase, prefix, "afterEnterRules");

                lng = phase.manualTransition.length();
                for (i = 0; i < lng; i++) {
                    if (phase.manualTransition != null) {
                        tlng = funcs.lng(phase.manualTransition[i].mtRules);
                        for (j = 0; j < tlng; j++) {
                            rule = new SCFile("RuleSet");
                            pRule = new SCFile("RuleSet", SCFILE_READONLY);
                            pRule.setFields("id");
                            if (phase.manualTransition[i] != null && phase.manualTransition[i].mtRules[j] != null && phase.manualTransition[i].mtRules[j] != "") {
                                rsql = "id=\"" + phase.manualTransition[i].mtRules[j] + "\"";
                                psql = "id=\"" + prefix + "." + phase.manualTransition[i].mtRules[j] + "\"";
                                if (pRule.doSelect(psql) != RC_SUCCESS) {
                                    if (rule.doSelect(rsql) == RC_SUCCESS) {
                                        rule.id = prefix + "." + rule.id;
                                        rule.name = "(" + prefix + ") " + rule.name;
                                        rule.sysrestricted = false;
                                        rule.doInsert();
                                    }
                                }
                                phase.manualTransition[i].mtRules[j] = prefix + "." + phase.manualTransition[i].mtRules[j];
                            }
                        }
                    }
                }

                lng = phase.autoTransition.length();
                for (i = 0; i < lng; i++) {
                    if (phase.autoTransition != null) {
                        if (phase.autoTransition[i].atRules != null) {
                            tlng = funcs.lng(phase.autoTransition[i].atRules);
                            for (j = 0; j < tlng; j++) {
                                rule = new SCFile("RuleSet");
                                pRule = new SCFile("RuleSet", SCFILE_READONLY);
                                pRule.setFields("id");
                                if (phase.autoTransition != null && phase.autoTransition[i].atRules[j] != null && phase.autoTransition[i].atRules[j] != "") {
                                    rsql = "id=\"" + phase.autoTransition[i].atRules[j] + "\"";
                                    psql = "id=\"" + prefix + "." + phase.autoTransition[i].atRules[j] + "\"";

                                    if (pRule.doSelect(psql) != RC_SUCCESS) {
                                        if (rule.doSelect(rsql) == RC_SUCCESS) {
                                            rule.id = prefix + "." + rule.id;
                                            rule.name = "(" + prefix + ") " + rule.name;
                                            rule.sysrestricted = false;
                                            rule.doInsert();
                                        }
                                    }
                                    phase.autoTransition[i].atRules[j] = prefix + "." + phase.autoTransition[i].atRules[j];
                                }
                            }
                        }
                    }
                }

                //QCCR1E95254 add defaultTransitionRules clone.
                if (phase.defaultTransitionRules != null) {
                    tlng = funcs.lng(phase.defaultTransitionRules);
                    for (j = 0; j < tlng; j++) {
                        rule = new SCFile("RuleSet");
                        pRule = new SCFile("RuleSet", SCFILE_READONLY);
                        pRule.setFields("id");
                        if (phase.defaultTransitionRules[j] != null && phase.defaultTransitionRules[j] != "") {
                            rsql = "id=\"" + phase.defaultTransitionRules[j] + "\"";
                            psql = "id=\"" + prefix + "." + phase.defaultTransitionRules[j] + "\"";

                            if (pRule.doSelect(psql) != RC_SUCCESS) {
                                if (rule.doSelect(rsql) == RC_SUCCESS) {
                                    rule.id = prefix + "." + rule.id;
                                    rule.name = "(" + prefix + ") " + rule.name;
                                    rule.sysrestricted = false;
                                    rule.doInsert();
                                }
                            }
                            phase.defaultTransitionRules[j] = prefix + "." + phase.defaultTransitionRules[j];
                        }
                    }
                }
            }

            phase.doInsert();
        }
        while (phase.getNext() == RC_SUCCESS);
    }

    // Create new ModuleStatus records with new workflow name
    cloneStatus(workflow, newWorkflowName);

    lib.WorkflowLocalization.syncLocalizedWorkflow(workflow.name, newWorkflowName, workflow.tableName);
    return true;
}


function getNewCatPhase(category, currentPhase, filename) {
    var workflow = new SCFile("Workflow", SCFILE_READONLY);
    workflow.setFields("firstPhase");
    var sql = "name =\"" + category.workflow + "\" and tableName=\"" + filename + "\"";
    if (workflow.doSelect(sql) == RC_SUCCESS) {
        return workflow.firstPhase;
    }

    return currentPhase;
}

function getPhaseList(workflowName, tableName) {
    var orderByFields = ['phaseOrder'];
    var orderBySeq = [SCFILE_ASC];
    var fields = ['phaseName'];
    var phase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    phase.setFields(fields);
    phase.setOrderBy(orderByFields, orderBySeq);
    var sql = "workflowName =\"" + workflowName + "\" and tableName=\"" + tableName + "\"";
    var phaseList = [];
    var result = phase.doSelect(sql);
    while (result == RC_SUCCESS) {
        phaseList.push(phase.phaseName);
        result = phase.getNext();
    }
    return phaseList;
}

/*
 *Use this setupWorkflow function to support category workflow display
 *If workflow field is not exist or empty, don't show the workflow widget.
 *If the category is used only in one object, use the object directly.
 *If the category is used in multi module, choose the one with same workflow record defination
 **/
function setupWorkflow() {
    // if workflow is empty, we may choose to hide it.
    if (funcs.exists("workflow", vars.$L_file)) {
        if (vars.$L_file.workflow == null || vars.$L_file.workflow == "" || vars.$L_file.workflow == "null") {
            vars.$L_wfgWFName = null;
            vars.$L_wfgWFTable = null;
        } else if (vars.$L_file.workflow != null) {
            var fname = lib.dbdictHelper.getPrimaryTablename(vars.$L_file);

            var obj = new SCFile("Object", SCFILE_READONLY);
            obj.setFields("file.name");
            var objRet = obj.doSelect("category.file.name=\"" + fname + "\"  and not null(workflowLocation)");
            var fileNameArray = [];
            while (objRet == RC_SUCCESS) {
                if (!lib.ArrayUtil.contains(fileNameArray, obj.file_name)) {
                    fileNameArray.push(obj.file_name);
                }
                objRet = obj.getNext();
            }
            vars.$L_wfgWFName = vars.$L_file.workflow;

            var workflow;
            var workflowRet;

            if (fileNameArray.length == 1) { //if only one object, no need to additional query
                vars.$L_wfgWFTable = null;
                vars.$L_wfgWFName = null;
                workflow = new SCFile("Workflow", SCFILE_READONLY);
                workflow.setFields("name");
                workflowRet = workflow.doSelect("tableName=\"" + fileNameArray[0] + "\" and name=\"" + vars.$L_file.workflow + "\"");
                if (workflowRet == RC_SUCCESS) {
                    vars.$L_wfgWFTable = fileNameArray[0];
                    vars.$L_wfgWFName = workflow.name;
                }
            } else if (fileNameArray.length > 1) {
                var i;
                for (i = 0; i < fileNameArray.length; i++) { //if multi-object found, find the one with existing workflow
                    workflow = new SCFile("Workflow", SCFILE_READONLY);
                    workflow.setFields("name");
                    workflowRet = workflow.doSelect("tableName=\"" + fileNameArray[i] + "\" and name=\"" + vars.$L_file.workflow + "\"");
                    if (workflowRet == RC_SUCCESS) {
                        vars.$L_wfgWFTable = fileNameArray[i];
                        break;
                    }
                }
            }
        }
    }

    vars.$L_clientType = funcs.sysinfo_get("ClientOSName");
}

/**
 * Initialize the variables which are used by the cross table and user option in condition. 
 * This method should be invoked before evaluating the condition.
 * @param {String} conditionXML
 */
function initVarForCondition(conditionXML) {
    if (null == conditionXML || typeof conditionXML != "string" || $.trim(conditionXML) == "") {
        return;
    }

    var crossTableType = "crosstablefield";
    var userOptionType = "useroption";
    // to avoid performance issue while current condition xml does not use any cross table fileds or user options, we do not parse this xml instead of checking key words directly
    var crossTableTag = "\"" + crossTableType + "\"";
    var userOptionTag = "\"" + userOptionType + "\"";
    if (conditionXML.indexOf(crossTableTag) < 0 && conditionXML.indexOf(userOptionTag) < 0) {
        return;
    }

    // the return of the configs is the array of structure{type, uoName, fromTable, fromTableType, fromField, toTable, toField, fieldName}
    var configs = lib.conditionXmlParser.getAdditionalVariablesConfigFromCondtionXml(conditionXML);
    if (null != configs) {
        var dbdictService = $("#dbdictService");
        var i;
        for (i = 0; i < configs.length; i++) {
            if (configs[i].type == crossTableType) {
                var crossTableVarName = null;
                if (configs[i].fromTableType == "CurrentRecord") {
                    crossTableVarName = "$L.file.";
                } else {
                    crossTableVarName = "$L.file.save.";
                }
                crossTableVarName += (configs[i].fromField + "." + configs[i].toTable + "." + configs[i].toField);
                // init the cross table varialbe

                if (null != vars.$L_file[configs[i].fromField]) {
                    var crossTableFile = $(configs[i].toTable, SCFILE_READONLY).select(configs[i].toField + '="' + vars.$L_file[configs[i].fromField] + '"').uniqueResult();

                    if (crossTableFile == null) {
                        crossTableFile = new SCFile(configs[i].toTable);
                    }
                } else {
                    crossTableFile = new SCFile(configs[i].toTable);
                }

                try {
                    vars[crossTableVarName] = crossTableFile;
                } catch (e) {
                    print("Error while setting the cross table varialbe \"" + crossTableVarName + "\":" + e.toString());
                }
            } else if (configs[i].type == userOptionType) {
                // init the user option variable

                var dbdict = dbdictService.getValidDbdict(funcs.filename(vars.$L_file));
                if (null == dbdict) {
                    print("dbdict " + funcs.filename(vars.$L_file) + " does not exist...");
                    break;
                }
                var pk = dbdictService.getPrimaryKey(dbdict.key);
                if (null == pk) {
                    print("Primary Key of dbdict " + funcs.filename(vars.$L_file) + " does not exist...");
                    break;
                }
                var pkField = (pk.name)[0];

                var uo = $("userOption", SCFILE_READONLY).fields(["IsMulti", "Option.Value"]).select('Ticket.ID="' + vars.$L_file[pkField] + '" and Option.Name="' + configs[i].uoName + '"').uniqueResult();
                if (uo != null) {
                    try {
                        var isMulti = uo["IsMulti"];
                        if (isMulti) {
                            vars["$L.UO." + configs[i].uoName] = uo["Option.Value"];
                        } else {
                            vars["$L.UO." + configs[i].uoName] = uo["Option.Value"][0];
                        }
                    } catch (e) {
                        print("Error while setting the User Option \"" + "$L.UO." + configs[i].uoName + "\":" + e.toString());
                    }
                } else {
                    //QCCR1E137342 and QCCR1E153220
                    var re_tmp = getUserOptionByName(configs[i].uoName);
                    if (re_tmp["UO_existe"] == true) {
                        vars["$L.UO." + configs[i].uoName] = re_tmp["value"];
                    }
                    //below is origin UO code
                    else {
                        try {
                            vars["$L.UO." + configs[i].uoName] = null;
                        } catch (e) {
                            print("Error while setting the User Option \"" + "$L.UO." + configs[i].uoName + "\" to null:" + e.toString());
                        }
                        continue;
                    }
                }
            }
        }
    }
}

//QCCR1E137342 and QCCR1E153220
function getUserOptionByName(uoName) {
    var filename = funcs.filename(vars.$L_file);
    var val_return = {};
    var xml;
    val_return["UO_existe"] = false;
    val_return["value"] = null;

    if (filename == "cm3r" || filename == "request") {
        xml = vars.$L_file["svc.options"];
    } else if (filename == "cm3t") {
        var change_parent = $("cm3r", SCFILE_READONLY).setFields(["svc.options"]).select('number="' + vars.$L_file["header"]["parent.change"] + '"').uniqueResult();

        if (change_parent == null) {
            return val_return;
        }
        xml = change_parent["svc.options"];
    } else if (filename == "requestTask") {
        var request_parent = $("request", SCFILE_READONLY).setFields(["svc.options"]).select('number="' + vars.$L_file["parent.request"] + '"').uniqueResult();

        if (request_parent == null) {
            return val_return;
        }
        xml = request_parent["svc.options"];
    } else {
        return val_return;
    }

    //check if xml has uoName
    var node = lib.dynamicFormGenerator.getElementById(xml, uoName);
    if (node != null) {
        val_return["value"] = node.getValue();
        val_return["UO_existe"] = true;
    }

    return val_return;
}

function replaceDotWithUnderscore(str) {
    if (null == str) {
        return str;
    } else {
        str = str.replace(/\./g, "_");
        return str;
    }
}


function initWrapperPDVariables(object, record, oldRecord, mode) {
    var tableName = object["file.name"];
    // $L.category
    if (null == vars["$L.category"] && record["category"] != null && record["category"] != "" &&
        null != object["category.file.name"] && "" != object["category.file.name"]) {
        vars["$L.category"] = $(object["category.file.name"], SCFILE_READONLY).select('name="' + record.category + '"').uniqueResult();
    }

    // $L.workflow
    var workflowName = null;
    if (null == vars["$L.workflow"]) {
        vars["$L.workflow"] = getWorkflow(object, record);
    }

    // $L.wfPhase & // $L.wfPhase.save
    if (null == vars["$L.wfPhase"]) {
        vars["$L.wfPhase"] = getWorkflowPhaseByRecord(object, record, vars["$L.workflow"], mode);
    }
    if (record["current.phase"] == null && record["current.phase"] == "") {
        record["current.phase"] = vars["$L.wfPhase"]["phaseName"];
    }
    if (null == vars["$L.wfPhase.save"]) {
        if (record["current.phase"] == oldRecord["current.phase"]) {
            vars["$L.wfPhase.save"] = vars["$L.wfPhase"];
        } else {
            vars["$L.wfPhase.save"] = getWorkflowPhaseByRecord(object, oldRecord, vars["$L.workflow"], mode);
        }
    }

    // $L.phase
    if (null == vars["$L.phase"]) {
        vars["$L.phase"] = getNextPhase(record, record["current.phase"], object);
    }

    // $L.to.phaseId
    // $L.wfAnswer // it seems it is not used in se.base.method
    // $L.wfMode
    if (null == vars["$L.wfMode"]) {
        if (record["current.phase"] == oldRecord["current.phase"]) {
            vars["$L.wfMode"] = "save";
        } else {
            vars["$L.wfMode"] = "open";
        }
    }
    // $L.wfType
    // $L.wfRules
    //$L.saved // it seems it is not used in se.view.engine
    //$L.copy.number // it seems it is not used in se.view.engine
    //$L.parent
    //$L.orig.format
    //$L.action.save // it seems it is not used in se.view.engine
}

function getWorkflowPhaseByRecord(object, record, workflow, mode) {
    var workflowPhase = new SCFile("WorkflowPhase");
    var sql = null;
    if (object.workflowLocation == "default") {
        sql = "phaseName=\"" + object["file.name"] + "\" and workflowName=\"" + workflow.name + "\" and tableName=\"" + object["file.name"] + "\"";
    } else {
        if (record["current.phase"] != null && record["current.phase"] != "") {
            sql = "phaseName=\"" + record["current.phase"] + "\" and workflowName=\"" + workflow.name + "\" and tableName=\"" + object["file.name"] + "\"";
        }
    }
    if (sql == null) {
        var tryNew = false;
        if (mode != null && mode.substring(0, 3) === "add") {
            tryNew = true;
        }
        if (tryNew === false) {
            sql = "phaseName=\"" + workflow["defaultPhase"] + "\" and workflowName=\"" + workflow["name"] + "\" and tableName=\"" + object["file.name"] + "\"";
        } else {
            if (workflow["firstPhase"] != null) {
                sql = "phaseName=\"" + workflow["firstPhase"] + "\" and workflowName=\"" + workflow["name"] + "\" and tableName=\"" + object["file.name"] + "\"";
            } else {
                sql = "phaseName=\"new\" and workflowName=\"" + workflow["name"] + "\" and tableName=\"" + object["file.name"] + "\"";
            }
        }
    }
    workflowPhase = $("WorkflowPhase", SCFILE_READONLY).select(sql).uniqueResult();
    workflowPhase = combinCommonPhase(workflowPhase, workflow, object);

    return workflowPhase;
}


function getWorkflow(object, record) {
    var workflowName = null;
    if (object.workflowLocation == "category") {
        if (record["category"] != null && record["category"] != "") {
            workflowName = getWorkflowName(record, object);
        }
    } else if (object.workflowLocation == "object") {
        workflowName = object.workflow;
    } else if (object.workflowLocation == "default") {
        workflowName = object["file.name"];
    }

    if (workflowName) {
        return $("Workflow", SCFILE_READONLY).select("name=\"" + workflowName + "\" and tableName=\"" + object["file.name"] + "\"").uniqueResult();
    }
}


function initWorkflowVariables() {
    var idFieldNameMap = {
        cm3r: "number",
        cm3t: "number",
        device: "logical.name",
        imTask: "id",
        incidents: "incident.id",
        kmdocument: "id",
        knownerror: "id",
        ocmq: "number",
        probsummary: "number",
        request: "number",
        requestTask: "number",
        riskgroup: "id",
        rootcause: "id",
        rootcausetask: "id",
        sdchat: "number",
        sla: "agreement.id",
        SurveyDefinition: "id",
        svcCatalog: "id",
        timeperiodDefinition: "id"
    };

    var sourceFilename = funcs.filename(vars.$L_file);

    if (vars["$L.wfPhase"] != null) {
        vars["$L.wfgWFName"] = vars["$L.wfPhase"]["workflowName"];
        vars["$L.wfgWFTable"] = vars["$L.wfPhase"]["tableName"];
        vars["$L.wfgWFPhase"] = vars["$L.wfPhase"]["phaseName"];
        vars["$L.wfgWFRecId"] = vars["$L.file"][idFieldNameMap[sourceFilename]];
    }

    vars["$L.clientType"] = funcs.sysinfo_get("ClientOSName");
}

function cloneStatus(workflow, newWorkflowName) {
    var status = new SCFile("ModuleStatus");
    var sql = "module = \"" + workflow.tableName + "\" and workflow = \"" + workflow.name + "\"";
    if (status.doSelect(sql) == RC_SUCCESS) {
        do {
            status.workflow = newWorkflowName;
            status.doInsert();
        }
        while (status.getNext() == RC_SUCCESS);
    }
}


/**
 * Return the workflow table name according to the filename
 *
 * @param {String} filename
 * @returns {String} 
 */
function getWorkflowTableName(filename) {

    // handle service catalog specially
    if (filename == "joinsvcDisplay") {
        return "svcCatalog";
    }

    // handle device specially	
    if (lib.ArrayUtil.contains(vars.$G_joinfiles, filename)) {
        return "device";
    }

    return filename;
}


/**
 * Merge Object workflow perperties
 * 
 * @param {SCFile} object
 */
function mergeObjectWorkflow(object) {

    if (object == null || object.file_name == null) {
        return;
    }

    var filenameBase;

    // handle service catalog specially
    if (object.file_name == "joinsvcDisplay") {
        filenameBase = "svcCatalog";
    }
    // handle device specially	
    else if (lib.ArrayUtil.contains(vars.$G_joinfiles, object.file_name)) {
        filenameBase = "device";
    } else {
        return;
    }

    var objBase = $("Object", SCFILE_READONLY).setFields(["workflow", "workflowLocation"]).select('file.name="' + filenameBase + '"').uniqueResult();

    if (objBase != null) {

        var i;

        // merge workflow properties
        var fieldWf = [
            "workflow",
            "workflowLocation",
            "action",
            "onCreateRules",
            "onUpdateRules",
            "afterAddRules",
            "afterUpdateRules",
            "initRules",
            "onDisplayRules",
            "onEnterRules",
            "onExitRules",
            "afterEnterRules"
        ];

        for (i = 0; i < fieldWf.length; i++) {
            object[fieldWf[i]] = objBase[fieldWf[i]];
        }

        // merge approval properties
        var fieldApproval = [
            "approval.enabled",
            "approval.condition",
            "approval.status.field",
            "approval.process",
            "denial.process",
            "retract.process",
            "single.notify.approval",
            "single.notify.denial",
            "single.notify.retraction",
            "approval.recalc",
            "approval.reset",
            "log.approvals"
        ];

        for (i = 0; i < fieldApproval.length; i++) {
            object[fieldApproval[i]] = objBase[fieldApproval[i]];
        }

        // merge local variables which related with workflow
        lib.ArrayUtil.addAllWithoutDuplicate(object.local_variables, objBase.local_variables);
    }
}

function refreshWorkflowVariables() {
    if (vars.$refresh_record == true) {
        var object = $("Object", SCFILE_READONLY).select("file.name=\"" + funcs.filename(vars.$L_file) + "\"").uniqueResult();
        if (object == null || object["category.file.name"] == null) {
            vars.$refresh_record = false;
            return;
        }

        var category = $(object["category.file.name"], SCFILE_READONLY).select("name=\"" + vars.$L_file.category + "\"").uniqueResult();
        if (category == null) {
            vars.$refresh_record = false;
            return;
        }

        var result = lib.RAD.run("se.get.workflowPhase",
            ["file", "second.file", "record", "second.record", "text"],
            [vars.$L_file, category, object, vars.$L_wfPhase, "browse"],
            [6, 6, 6, 6, 2],
            ["second.record"]);

        if (result.results.length() > 0 && result.results[0] != null) {
            vars.$L_wfPhase = result.results[0];
        }

        initWorkflowVariables();

        funcs.fduplicate(vars["$L.file.save"], vars["$L.file"]);

        vars.$refresh_record = false;
    }
}


/**
 * get manual transition list of record current phase
 *
 * @param {SCFile} record
 * @returns {Array} manual transition name list
 */
function getManualTransitionsOfCurrentPhase(record) {
    if (!record) {
        return [];
    }

    var filename = funcs.filename(record);

    var object = $("Object", SCFILE_READONLY).find("file.name=:filename", filename).one();
    var workflow = getWorkflow(object, record);
    if (!workflow) {
        return [];
    }

    var phase = getWorkflowPhaseByRecord(object, record, workflow);
    if (!phase) {
        return [];
    }

    var manualTransitions = phase.manualTransition;
    if (!manualTransitions) {
        return [];
    }

    var mts = [];

    var i;
    var length = manualTransitions.length();
    for (i = 0; i < length; i++) {
        var transition = manualTransitions[i];
        if (transition.mtOptionName) {
            mts.push(transition.mtOptionName);
        }
    }

    return mts;
}