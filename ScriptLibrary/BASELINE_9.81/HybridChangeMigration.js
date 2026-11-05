/*TODO*/
//last phase close control
//init ruleset to set phase's update control, close control
//localization--checking generated scmessage


//lib.PDCodeMigration.isUpgradeFromPD3;

var $ = lib.c.$;
var UPGRADE_PREFIX = lib.upgradeConstants.NEW_PREFIX();
var CUSTOMER_VERSION_PREFIX = lib.upgradeVersionUtil.getOldPrefix();
var PD_CODE_MIGRATION_DISABLE_SUFFIX = "_disabled";
var PD_CODE_MIGRATION_WF_PREFIX = "Migrated ";
var AUTO_UPGRADED_SUFFIX_IN_DESC = " - Automatically Upgraded.";
var NOT_MIGRATED_CHANGE_CATEGORY = ["KM Document"];
var PD_OOB_CHANGE_MODULE_CATEGORY = ['Change Proposal', 'Emergency Change', 'Normal Change', 'Standard Change', 'Build and Test', 'Change Backout activity', 'Change Execution', 'CMDB Update', 'Deployment activity', 'Implementation activity', 'PIR', 'Planning and Schedule', 'Risk and Impact Analysis', 'Automation'];
var _needMigrateCategoryFunc = null;
var _null=funcs._null;
var printIt=lib.PDCodeMigration.printIt;
var OOB_CHG_Processes=["backout.release","cm.approve.next.phase","cm.close","cm.close.save","cm.copyopen","cm.km.approveext","cm.km.approveint","cm.next.phase","cm.ok","cm.open","cm.open.save","cm.open.classic","cm.open.save.classic","cm.terminate","cm.update.deny.1","cm.update.deny.2","cm.update.retract","cm.update.save","terminate.release"];


/**
 * Get the object record which will be used to do migration
 * @param  {String} objectName   object name
 * @return {SCFile}              The object record
 */
function getObjectInfo(objectName) {

    var upgradeObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + UPGRADE_PREFIX + objectName + "\"").uniqueResult();
    var customerObject = $("Object", SCFILE_READONLY).select("file.name=\"" + CUSTOMER_VERSION_PREFIX + objectName + "\"").uniqueResult();
    if(customerObject == null){
    
        customerObject = $("Object", SCFILE_READONLY).select("file.name=\"" + objectName + "\"").uniqueResult();
    }
    if (null == upgradeObjectFile) {

        hasCustomization = false;
        if (objectName == "cm3r") {
            customerObject["master.fc"] = "cm3r";
            customerObject["open.state"] = "cm.open";
            customerObject["close.state"] = "cm.close";
            customerObject["default.state"] = "cm.view";
            customerObject["browse.state"] = "cm.browse";
            customerObject["category.file.name"] = "cm3rcategory";
            customerObject["phase.file.name"] = "cm3rcatphase";
            return customerObject;
        } else if (objectName == "cm3t") {
            customerObject["master.fc"] = "cm3t";
            customerObject["open.state"] = "cm.open";
            customerObject["close.state"] = "cm.close";
            customerObject["default.state"] = "cm.view";
            customerObject["browse.state"] = "cm.browse";
            customerObject["category.file.name"] = "cm3tcategory";
            customerObject["phase.file.name"] = "cm3tcatphase";
            return customerObject;
        }

    } else {
        hasCustomization = true;
        //return the customer version Object
        return customerObject;

    }

}
/**
 * Get the phase record that will be used to do the migration . As the original PD change enablement don't touch the phase record, we can return the phase record in the upgraded system directly.
 * @param  {String} phaseFile    phase file name
 * @param  {String} phaseName    source record.
 * @return {SCFile}              The phase record
 */

function getPhaseInfo(phaseFile, phaseName) {
    var phase = new SCFile(phaseFile, SCFILE_READONLY);
    if (RC_SUCCESS == phase.doSelect('name="' + phaseName + '"')) {
        return phase;
    }
    return null;

}

/**
 * Check whether the legacy change category should be migrated.
 * @param  {Record} category   Legacy category record.
 * @return {Boolean}           The result that whehter legacy change category should be migrated
 */

function needMigrateCategory(category) {
    if (category.name.indexOf(UPGRADE_PREFIX) == 0 || CUSTOMER_VERSION_PREFIX !="" && category.name.indexOf(CUSTOMER_VERSION_PREFIX) == 0) {
        return false;
    }

    if (lib.ArrayUtil.contains(NOT_MIGRATED_CHANGE_CATEGORY, category.name)) {
        return false;
    }

    if (lib.ArrayUtil.contains(PD_OOB_CHANGE_MODULE_CATEGORY, category.name)) {
        var categoryFile = funcs.filename(category);


        var upgradeCategoryFile = $(categoryFile, SCFILE_READONLY).select("name=\"" + UPGRADE_PREFIX + category.name + "\"").uniqueResult();

        if (null == upgradeCategoryFile) {
            hasCustomization = false;
            if (category.workflow == null || $.trim(category.workflow).length == 0) {
                return true;
            }
            return false;
        } else {

            hasCustomization = true;
            return true;
        }

    }

    return true;
}

/**
 * Migrate Process to make sure the Rule sets of auto-generated workflow work.
 * @param {array of String}
 *            rads - the RAD used in built-in Processes, which need to pass in the names/values parameters.
 */
function migrateProcesses(rads) {

    printIt("Start migrating Processes to pass in the names/values parameters of RAD call...", true);
    var changedFiles = [];
    var process = new SCFile("Process");
    var sql = 'application isin {"' + rads.join('","') + '"}';
    //print(sql);

    var rc = process.doSelect(sql);
    while (rc == RC_SUCCESS) {
        if (lib.PDCodeMigration.isIgnoreRecord(process.process, true) || lib.PDCodeMigration.isOOBRecordList(process.process, OOB_CHG_Processes)) {
            rc = process.getNext();
            continue;
        }
        printIt("Changing Process " + process.process + " to makes sure the Rule sets of the auto-generated Workflow working",true);

        // add names/values to the RAD parameters
        var radsOfProcess = process.rad;
        var radLen = radsOfProcess.length();
        var modifyFlag = false;
        var i;
        for (i = 0; i < radLen; i++) {
            if (lib.ArrayUtil.contains(rads, radsOfProcess[i].application)){
                if (lib.ArrayUtil.contains(radsOfProcess[i].names, "names")) {
                    printIt("The Process " + process.process + " had been already updated to pass into the names/values, ignore the migration for this Process.", true);
                    break;
                }
                modifyFlag = true;
                // backup it
                var processBak = $("Process").select("process=\"" + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
                if (null != processBak) { // the backup process already exists, ignore the backup
                    printIt("The backup of the Process " + process.process + " exists already, ignore the backup.",true);
                } else { // backup the process
                    processBak = $("Process").select("process=\"" + process.process + "\"").uniqueResult();
                    processBak.process = process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                    processBak.doInsert();
                    printIt("The Process " + process.process + " is backuped to " + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX,true);
                }

                if (radsOfProcess[i]["pre.rad.expressions"] == null) {
                    radsOfProcess[i]["pre.rad.expressions"] = [];
                }

                radsOfProcess[i]["pre.rad.expressions"].push(funcs.parse('if $G.pd.change.enabled then ($L.pd.file.names={"$L.category", "$L.wfExitRules", "$L.wfTransitionRules", "$L.wfT.Phase", "$L.fc", "$L.fc.master", "$L.workflow", "$L.phase", "$L.saved", "$L.parent", "$L.wfPhase", "$L.wfPhase.save", "$L.orig.format", "$L.wfRules", "$L.wfMode", "$L.wfType", "$L.to.phaseId"};if (not  (null($L.object))) then ($L.pd.file.names=denull(local.variables in $L.object)+$L.pd.file.names);$L.pd.file.vars={};$L.pd.file.vars=getvariables($L.pd.file.names))', 11));
                radsOfProcess[i].names.push("names");
                radsOfProcess[i].names.push("values");
                radsOfProcess[i].values.push("$L.pd.file.names");
                radsOfProcess[i].values.push("$L.pd.file.vars");
              
                var addExp = funcs.parse('if ($G.pd.change.enabled and $L.exit~="bad.val" and $L.exit~="badval" and $L.exit~="nosave") then ($L.void=setvariables($L.pd.file.names, $L.pd.file.vars))', 11);
                if (radsOfProcess[i]["post.rad.expressions"] == null) {
                    radsOfProcess[i]["post.rad.expressions"] = [addExp];
                } else {
                    //insert as the first line
                    radsOfProcess[i]["post.rad.expressions"] = funcs.insert(radsOfProcess[i]["post.rad.expressions"], 1, 1, addExp);
                }
            } 
        }

        if (modifyFlag === true) {
            process.doUpdate();
            lib.PDCodeMigrationUtil.addMigrationPatchRecord("Process", process, process["process"], false);
            changedFiles.push(process.process);
        }

        rc = process.getNext();
    }

    // add to report
    var reportObj = {};
    reportObj.title = "The following process records are updated to pass the names/values parameters into while invoking the main logic RAD," + " which makes sure the Rule sets of the auto-generated workflows can work." + "Backups of the original process (identified by the suffix " + PD_CODE_MIGRATION_DISABLE_SUFFIX + ") have been created.";
    reportObj.files = changedFiles;
    reportObj.category = "Process";
    reportObj.filename = "process";

    var SUMMARY_REPORT_OBJS = lib.PDCodeMigration.getReportOBJ();
    SUMMARY_REPORT_OBJS.push(reportObj);
    printIt("Finished migrating Processes to pass in the names/values parameters of RAD call.", true);
}


function migrateGroups() { 
////do nothing, upgrade's fixData will do this.
}

function migrateSecurity() {
//do nothing, upgrade's fixData will do this.
}

function migrateChangeModule() {
    setNeedMigrateCategoryFunc(needMigrateCategory);
    createDynamicWorkflowByCategories("cm3r");
    createDynamicWorkflowByCategories("cm3t");
    migrateStates();
    migrateObject("cm3r");
    migrateObject("cm3t");
    migrateProcesses(["cm.update.save","cm.close.save","cm.open.save","cm.close","cm.open"]);    
    lib.PDCodeMigration.changeSetting ("Change", "openMethod", "category");
    migrateSecurity();
    migrateGroups();
}

function applyWorkflowToCategory(cat, wkFlowName) {

    var category = new SCFile(funcs.filename(cat));
    category.doSelect('name="' + cat.name + '"');
    category.workflow = wkFlowName;
    var rc = category.doUpdate();
    lib.PDCodeMigrationUtil.addMigrationPatchRecord(funcs.filename(cat), category, category["name"], false);
    lib.PDCodeMigration.printIt("Apply the workflow \"" + wkFlowName + "\" to category \"" + cat.name + "\".");
}

/**
 * Create model for the migrated category.
 * @param  {Record} cat   category file record.
 * @param  {Record} wkFlow   workflow record.
 */
function createChmModel4Category(cat, wkFlow) {

    var model = new SCFile("changeModel");
    model.id = wkFlow.name;
    model.name = wkFlow.name;
    model.description = wkFlow.description;
    model.category = cat.name;
    model.doInsert();
    lib.PDCodeMigrationUtil.addMigrationPatchRecord("changeModel", model, model["id"], false);
    lib.PDCodeMigration.printIt("Created Change Model \"" + model.name + "\" for category \"" + cat.name + "\".");
}
function setNeedMigrateCategoryFunc(needMigrateCategoryFunc) {
    _needMigrateCategoryFunc = needMigrateCategoryFunc;
}


/**
 * Create migrated workflow flor the object.
 * @param  {String} objectName   name of object.
 */
function createDynamicWorkflowByCategories(objectName) {

    // set trigger on to make sure the related scmsg could be auto generated
    var ret = 0;
    funcs.rtecall("trigger", ret, 1);

    var obj = getObjectInfo(objectName);
    if (obj) {
        var cat = new SCFile(obj["category.file.name"], SCFILE_READONLY);
        var rc = cat.doSelect('true');
        while (rc == RC_SUCCESS) {
            if (_needMigrateCategoryFunc(cat)) {
                lib.PDCodeMigration.printIt("Creating workflows for Category \"" + cat.name + "\"...", true);
                var wkFlowName = PD_CODE_MIGRATION_WF_PREFIX + cat.name;
                var workflow = new SCFile("Workflow");
                var sql = "name=\"" + wkFlowName + "\" and tableName=\"" + objectName + "\"";
                if (workflow.doSelect(sql) != RC_SUCCESS) {
                    workflow.name = wkFlowName;
                    workflow.tableName = objectName;
                    workflow.description = cat.description + AUTO_UPGRADED_SUFFIX_IN_DESC;
                    workflow.type = "standard";

                    workflow["is.legacy.workflow"] = true;

                    //copy object info

                    workflow["legacy.fc"] = obj["master.fc"];
                    workflow["legacy.open.state"] = obj["open.state"];
                    workflow["legacy.close.state"] = obj["close.state"];
                    workflow["legacy.default.state"] = obj["default.state"];
                    workflow["legacy.browse.state"] = obj["browse.state"];

                    //applyRuleset(workflow, "initRules", "chm.classic.init.classic.flag");
                    applyRuleset(workflow, "onDisplayRules", "chm.classic.clean.transition.flag");
                    applyRuleset(workflow, "onDisplayRules", "common.relatedrecord.init.vars");
                    applyRuleset(workflow, "onDisplayRules", "common.workflow.init.vars");

                    var createdPhases = createPhases(cat, workflow, obj);

                    if (createdPhases.length > 0) {
                        workflow.defaultPhase = createdPhases[0].name;
                        workflow.firstPhase = createdPhases[0].name;
                        workflow.doInsert();
                        lib.PDCodeMigrationUtil.addMigrationPatchRecord("Workflow", workflow, workflow["name"], false);

                        var i;
                        for (i = 0; i < createdPhases.length; i++) {
                            createdPhases[i].doInsert();
                            if (i < createdPhases.length - 1) {
                                localTransitionMsg(createdPhases[i], workflow);
                            }
                            lib.PDCodeMigrationUtil.addMigrationPatchRecord("WorkflowPhase", createdPhases[i], createdPhases[i]["name"], false);
                        }


                        applyWorkflowToCategory(cat, wkFlowName);
                        if (objectName == "cm3r") {
                            //createChmModel4Category(cat, workflow);
                        }
                        lib.PDCodeMigration.printIt("Created workflows \"" + wkFlowName + "\"for Category \"" + cat.name + "\".", true);
                    } else {
                        lib.PDCodeMigration.printIt("No valid phase exits for Category \"" + cat.name + "\", ignore it.", true);
                    }


                } else {
                    lib.PDCodeMigration.printIt("The workflow \"" + wkFlowName + "\" has already been created for Category \"" + cat.name + "\", ignore it.", true);
                }

            }

            rc = cat.getNext();
        }

    }

    funcs.rtecall("trigger", ret, 0); //set trigger back to off

}

/**
 * Apply a ruleset to record of workflow, workflow phase or object
 * @param  {Record} scopeObj the record to apply rule
 * @param  {String} ruletype   the field of the record to apply rule.
 * @param  {String} rule    name of rule.
 */
function applyRuleset(scopeObj, ruletype, rule) {
    var lng = funcs.lng(funcs.denull(scopeObj[ruletype]));
    scopeObj[ruletype][lng] = rule;

}

/**
 * Apply RAD condition to fields of file record
 * @param  {String} condStr Condition string
 * @param  {Record} record    record to apply condition.
 * @param  {Array} condFields    array of condition/conditon XML/condition description fields.
 */
function applyRADCondition(condStr, record, condFields) {
    condStr = funcs.str(condStr); //condStr maybe boolean false, so change to string firstly.
    if (condStr && condStr != "") {
        record[condFields[0]] = funcs.parse(condStr, 4); //lib.WorkflowTriggers.convertResult(condStr) 
        record[condFields[1]] = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">\
					                                         <operand type=\"expression\"><Expression caption=\"\">\"" +
            lib.PDCodeMigration.html2Escape(condStr) + "\"</Expression>\
					                                         </operand></condition></collection></XmlCondition>";
        record[condFields[2]] = "(Expression:" + funcs.str(condStr) + ")";
    }
}

/**
 * Combine the condition with a default condition
 * @param  {String} cond  condition string
 * @param  {String} defaultCond   default condition string.
 * @param  {String} defaultCondSimple	the simple default condition string when simple pattern matchs.
 * @param  {String} simplePattern   pattern string to select the simple default condition string.
 * @return {String}   The combined condiiton string
 */
function combineCondWithDefault(cond, defaultCond, defaultCondSimple, simplePattern) {
    var condStr = funcs.str(cond);
    if (!condStr || condStr == "" || condStr == "true") {
        return defaultCond;
    }

    if (condStr == "false") {
        return "false";
    }

    if (simplePattern && condStr.indexOf(simplePattern) > -1) {
        return defaultCondSimple ? (" ( " + condStr + " ) and ( " + defaultCondSimple + " ) ") : condStr;
    }

    return " ( " + condStr + " ) and ( " + defaultCond + " ) ";
}


/**
 * Create the workflow phase record
 * @param  {Record} cat category file record
 * @param  {Record} workflow    workflow record.
 * @param  {Record} phase    classic phase record.
 * @param  {Number} order    phase order.
 * @param  {Number} totalPhase    count of phases
 * @return {Record}              The workflow phase record
 */
function createPhase(cat, workflow, phase, order, totalPhase) {
    var wfPhase = new SCFile("WorkflowPhase");
    wfPhase.workflowName = workflow.name;
    wfPhase.tableName = workflow.tableName;
    wfPhase.phaseName = phase.name;
    wfPhase.phaseOrder = order;
    wfPhase.description = phase.description;
    wfPhase.active = true;
    wfPhase.displayForm = phase["view.default"];
    //wfPhase.altForm[0]["altFormName"] = phase["view.default"];
    //wfPhase.altForm[0]["altFormDesc"] = "Default Format";
    //wfPhase.altForm[0]["altFormType"] = "disp";
    //applyRADCondition("$L.mode~=\"close\"", wfPhase.altForm[0], ["altFormCondition", "altFormCondXML", "altFormCondDesc"]);


    wfPhase.approvals = phase["approvals"];
    wfPhase.alerts = phase["alerts"];
    if (_null(phase["recalc.approvals"]) == false) {
        if (cat.name == "Unplanned Change") { //special handling for unplanned change.
            applyRADCondition(combineCondWithDefault(phase["recalc.approvals"], /*"$L.wfMode~=\"open\" and */"open in $L.file=true"), wfPhase, ["approvalsRecalc", "approvalsRecalcXML", "approvalsRecalcDesc"]);
        } else {
            applyRADCondition(phase["recalc.approvals"], wfPhase, ["approvalsRecalc", "approvalsRecalcXML", "approvalsRecalcDesc"]);
        }
    }
    //same(approval.status in $L.file, approval.status in $L.file.save) is checked by RAD "cm.update.save" originally.
    //it prevent approval reset when change is approved in current phase.
    if(_null(phase["reset.approvals"])==false) {
        applyRADCondition(combineCondWithDefault(phase["reset.approvals"], "same(approval.status in $L.file, approval.status in $L.file.save) and open in $L.file=true"), wfPhase, ["approvalsReset", "approvalsResetXML", "approvalsResetDesc"]);
    }
    if(_null(phase["recalc.alerts"])==false) {
        applyRADCondition(phase["recalc.alerts"], wfPhase, ["alertsRecalc", "alertsRecalcXML", "alertsRecalcDesc"]);
    }
    if(_null(phase["reset.alerts"])==false) {
        applyRADCondition(phase["reset.alerts"], wfPhase, ["alertsReset", "alertsResetXML", "alertsResetDesc"]);
    }

    var updateCondStr = combineCondWithDefault(phase.upd_control, "$L.tableAccess.update=true");
    if (order == 1) {
        updateCondStr = combineCondWithDefault(phase.upd_control, "$L.tableAccess.update=true and $L.mode~=\"add\" or $L.tableAccess.new=true and $L.mode=\"add\"");
    }
    if (order == totalPhase || (cat.name == "Unplanned Change" && phase.name == "Discovery Assessment")) { //last phase or special handling for unplanned change.
        //updateCondStr = combineCondWithDefault(updateCondStr, "nullsub($L.editable.flag, true)=true");
    }

    applyRADCondition(updateCondStr, wfPhase, ["updateCond", "updateCondXML", "updateCondDesc"]);

    if (order == 1) { //apply ruleset for first phase
        applyRuleset(wfPhase, "initRules", "chm.classic.cm.open");
    }

    if (order == totalPhase) { //last phase
        if (workflow.tableName == "cm3t") {
            applyRuleset(wfPhase, "afterUpdateRules", "common.taskplan.updatedependenttaskstatus");
        }
    }
    wfPhase.xCoordinate = 20 + (order * 140);
    wfPhase.yCoordinate = 60;

    return wfPhase;
}

/**
 * Create transtion between phases
 * @param  {Record} workfklow the workflow record.
 * @param  {Record} wfPhaseFrom the workflow phase to be transitioned from.
 * @param  {Record} wfPhaseTo   the workflow phase to be transitioned.
 * @param  {Record} phaseFrom    classic phase record of the phase to be transitioned from.
 * @param  {Record} cat    category Record.
 */
function linkPhaseByTransition(workfklow, wfPhaseFrom, wfPhaseTo, phaseFrom, cat) {
    wfPhaseFrom.manualTransition[0].mtToPhase = wfPhaseTo.name;
    wfPhaseFrom.manualTransition[0].mtOptionName = "nextphase"; //scmessage will be "Close Phase"
    wfPhaseFrom.manualTransition[0].mtOptionLoc = 1;
    wfPhaseFrom.manualTransition[0].mtId = 1;


    var transitionCond = combineCondWithDefault(phaseFrom["cls.control"], "approval.status in $L.file=\"approved\" and $L.mode~=\"add\" and $L.mode~=\"close\"", "$L.mode~ = \"add\" and $L.mode~=\"close\")"/*,"approval.status in $L.file"*/);
    transitionCond = combineCondWithDefault(transitionCond, "open in $L.file=true", null, "open in $L.file");

    if (cat.name == "Unplanned Change" /**&& wfPhaseFrom.name == "Discovery Assessment"*/ ) {
        //special handling for unplanned change.only denied one can be transitioned to next phase.
        if (wfPhaseFrom.name == "Discovery Assessment") {
            transitionCond = "approval.status in $L.file=\"denied\" and $L.mode~=\"add\" and $L.mode~=\"close\" and open in $L.file=true";
        } else {
            transitionCond = "approval.status in $L.file~=\"pending\" and $L.mode~=\"add\" and $L.mode~=\"close\" and open in $L.file=true";
        }
    }

    applyRADCondition(transitionCond, wfPhaseFrom.manualTransition[0], ["mtCondition", "mtCondXML", "mtCondDesc"]);


    wfPhaseFrom.manualTransition[0].mtxCoordinate = 20 + (wfPhaseFrom.phaseOrder * 140) + 120;
    wfPhaseFrom.manualTransition[0].mtyCoordinate = 80;
    wfPhaseFrom.manualTransition[0].mtOption = lib.Workflow.getOptionNumber(wfPhaseFrom, 1);
}


/**
 * create scmessage for close phases transition
 * @param  {Record} wfPhase the workflow phase record.
 * @param  {Record} workflow   the workflow record.
 * @param  {Record} obj   the Object record.
 */
function localTransitionMsg(wfPhase, workflow) {

    var msg = new SCFile("scmessage");
    var rc = msg.doSelect("class =\"wfT\" and message.id=\"" + (wfPhase.name + "_" + workflow.name + "_" + workflow.tableName + ":1") + "\"");
    if (rc != RC_SUCCESS) {
        msg["class"] = "wfT";
        msg["message.id"] = wfPhase.name + "_" + workflow.name + "_" + workflow.tableName + ":1";
    }
    msg.message = "Close Phase";
    msg.doSave();
}
/**
 * Create workflow phases for all the phases of the given category
 * @param  {Record} cat the category record.
 * @param  {Record} workflow   the workflow record.
 * @param  {Record} obj   the Object record.
 * @return {Array}          Array of created workflow phases
 */
function createPhases(cat, workflow, obj) {
    cat.phases = lib.ArrayUtil.removeDuplicateEmptyElement(cat.phases.toArray());
    var lng = cat.phases.length();
    var createdPhases = [];
    var previousPhase = null;
    var previousPhaseInfo = null;
    var i;
    for (i = 0; i < lng; i++) {
        var phaseName = cat.phases[i];
        var phaseInfo = getPhaseInfo(obj["phase.file.name"], phaseName);
        if (phaseInfo) {
            var wfPhase = createPhase(cat, workflow, phaseInfo, i + 1, lng);
            createdPhases.push(wfPhase);
            if (previousPhase) {
                linkPhaseByTransition(workflow, previousPhase, wfPhase, previousPhaseInfo, cat);
            }
            previousPhase = wfPhase;
            previousPhaseInfo = phaseInfo;
        }
    }


    return createdPhases;
}

/**
 * Migrate object
 * @param  {String} objectName the name of the object record.
 */
function migrateObject(objectName) {
    lib.PDCodeMigration.printIt(" -> start migrating Object \"" + objectName + "\"...", true);


    //0. check whether this Object is migrated already by checking the existance of the disabled record by PD code migration
    var pdMigrationDisabledObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + objectName + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
    if (null !== pdMigrationDisabledObjectFile) {
        lib.PDCodeMigration.printIt("The Object \"" + objectName + "\" has already been migrated, ignore it!");
        return false;
    }

    var hasCustomization = true;
    var upgradeObjectFile = $("Object").select("file.name=\"" + UPGRADE_PREFIX + objectName + "\"").uniqueResult();
    if (null == upgradeObjectFile) {
        hasCustomization = false;
    }

    var reportObj = {};
    var changedFiles = [];
    reportObj.files = changedFiles;
    reportObj.category = "Object";
    reportObj.filename = "object";
    var SUMMARY_REPORT_OBJS = lib.PDCodeMigration.getReportOBJ();
    SUMMARY_REPORT_OBJS.push(reportObj);


    if (hasCustomization == true) {
        var orgObjectFile = $("Object").select('file.name="' + objectName + '"').uniqueResult();
        if (null !== orgObjectFile) {
            //1. rename the Object name to xxx_disabled_by_PDCM   
            orgObjectFile["file.name"] = objectName + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            orgObjectFile.doUpdate();

            //2. clone from the the PD OOB Object, and set PD security/category/workflow info
            var pdMigratedObjectFile = upgradeObjectFile;
            var legacyObjectFile = orgObjectFile;
            if (null !== pdMigratedObjectFile) {
                // 2.1 rename it
                pdMigratedObjectFile["file.name"] = objectName;

                // 2.2 keep to use legacy customized data for following fields
                pdMigratedObjectFile["number.record"] = legacyObjectFile["number.record"];
                pdMigratedObjectFile["phase.file.name"] = legacyObjectFile["phase.file.name"];
                pdMigratedObjectFile["paging.file"] = legacyObjectFile["paging.file"];
                pdMigratedObjectFile["joindef"] = legacyObjectFile["joindef"];
                pdMigratedObjectFile["statusField"] = legacyObjectFile["statusField"];
                pdMigratedObjectFile["use.locking"] = legacyObjectFile["use.locking"];
                pdMigratedObjectFile["lock.on.display"] = legacyObjectFile["lock.on.display"];
                pdMigratedObjectFile["lock.parent"] = legacyObjectFile["lock.parent"];
                //pdMigratedObjectFile["category.file.name"] for category file name, always use PD OOB

                // 2.3 merge legacy Assigned to fields to this Object
                lib.PDCodeMigration.mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "assignedToFields");
                // 2.4 merge legacy Workgroup fields to this Object
                lib.PDCodeMigration.mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "workgroupFields");
                // 2.5 merge legacy local variables to this Object
                lib.PDCodeMigration.mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "local.variables");


                // 2.6 merge legacy global list to this Object
                lib.PDCodeMigration.mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "global.lists");
                // 2.7 merge legacy Parent Lock Information and Watch Variables
                lib.PDCodeMigration.mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "parent.id", ["parent.object"]);
                lib.PDCodeMigration.mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "watch.variables", ["watch.variable.name", "watch.variable.type", "watch.variable.global.list"]);

                // 2.7 alert, no need as we are using PD based OOB
                // 2.8 approval, no need as we are using PD based OOB
                pdMigratedObjectFile.doInsert();
                lib.PDCodeMigrationUtil.addMigrationPatchRecord("Object", pdMigratedObjectFile, pdMigratedObjectFile["file.name"], false);
            } else {
                lib.PDCodeMigration.printIt("Can not find the PD OOB Object for \"" + objectName + "\", ignore it!");
                return false;
            }



            reportObj.title = "The following object is replaced with the out-of-box Process Designer-based version plus your customozation on original object. Backups of the original object (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.";
            changedFiles.push(objectName);
            lib.PDCodeMigration.printIt("The object \"" + objectName + "is replaced with the out-of-box Process Designer-based version plus your customozation on original object. Backups of the original object (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.");


        } else {
            lib.PDCodeMigration.printIt("Can not find the original Object \"" + objectName + "\", ignore it!");
        }

    }


    lib.PDCodeMigration.printIt(" -> migrated Object \"" + objectName + "\" done.", true);
    return true;
}
/**
 * Migrate a state
 * @param  {stateName} name of the state.
 * @param  {saveCloseProcessInfo} fill tailringed save/close into this out parameter.
 * @param  {changedFiles} fill changed file into into this out parameter for report.
 */
function migrateState(stateName, saveCloseProcessInfo, changedFiles) {

    var state = new SCFile("States");
    var savePos = -1;
    var closePos = -1;
    var i;

    var rc = state.doSelect('state="' + stateName + '"');

    if (rc == RC_SUCCESS) {
        state.state = state.state + PD_CODE_MIGRATION_DISABLE_SUFFIX;

        //check whether this State is migrated already by checking the existance of the disabled record by PD code migration
        var pdMigrationDisabledFile = $("States", SCFILE_READONLY).select("state=\"" + state.state + "\"").uniqueResult();
        if (null !== pdMigrationDisabledFile) {
            lib.PDCodeMigration.printIt("The State \"" + stateName + "\" has already been migrated, ignore it!", true);
            return;
        }


        state.doUpdate();
        state.state = stateName;
        var total = funcs.lng(state['process.label']);
        for (i = 0; i < total; ++i) {
            if (savePos == -1 && state['process.label'][i] == "save") {
                if (state['valid.process'][i] != "cm.update.save") {
                    saveCloseProcessInfo.save = state['valid.process'][i];
                }
                savePos = i;
                continue;
            }
            if (closePos == -1 && state['process.label'][i] == "close") {
                if (state['valid.process'][i] != "cm.close") {
                    saveCloseProcessInfo.close = state['valid.process'][i];
                }
                closePos = i;
                continue;
            }
        }
        state['process.label'][total] = "save";
        state['valid.process'][total] = "cm.save.wrapper";
        state['process.condition'][total] = funcs.parse("$G.pd.change.enabled=true", 4);
        if (savePos != -1) {
            state['process.condition'][savePos] = funcs.parse('false and (' + funcs.str(state['process.condition'][savePos]) + ')', 4);
        }
        state.doInsert();
        lib.PDCodeMigrationUtil.addMigrationPatchRecord("States", state, state["state"], false);
        changedFiles.push(state.state);

    }
}

/**
 * Migrate all states that need migration.
 */
function migrateStates() {
    var objChange = getObjectInfo("cm3r");
    var objTask = getObjectInfo("cm3t");

    var reportObj = {};
    var changedFiles = [];
    reportObj.files = changedFiles;
    reportObj.category = "State";
    reportObj.filename = "States";
    var SUMMARY_REPORT_OBJS = lib.PDCodeMigration.getReportOBJ();
    SUMMARY_REPORT_OBJS.push(reportObj);


    var tailoringProcessInfo = {};
    if (objChange['default.state'] != "cm.view") {
        migrateState(objChange['default.state'], tailoringProcessInfo, changedFiles);
    }

    if (objTask['default.state'] != objChange['default.state']) {
        tailoringProcessInfo.cm3r = {};
        tailoringProcessInfo.cm3r.save = tailoringProcessInfo.save;
        delete tailoringProcessInfo.save;
        tailoringProcessInfo.cm3r.close = tailoringProcessInfo.close;
        delete tailoringProcessInfo.close;
        tailoringProcessInfo.cm3t = {};
        if (objTask['default.state'] != "cm.view") {

            migrateState(objTask['default.state'], tailoringProcessInfo.cm3t, changedFiles);
        }
    }

    if (tailoringProcessInfo.save || tailoringProcessInfo.close) {
        //change and task use same state and has tailoring
        var fProcess = new SCFile("Process");
        fProcess.doSelect('process="cm.save.wrapper"');
        fProcess['process.condition'][2] = fProcess['process.condition'][0];
        fProcess['next.process'][2] = tailoringProcessInfo.save ? tailoringProcessInfo.save : fProcess['next.process'][0];
        fProcess['process.condition'][3] = fProcess['process.condition'][1];
        fProcess['next.process'][3] = tailoringProcessInfo.close ? tailoringProcessInfo.close : fProcess['next.process'][1];
        fProcess['process.condition'][0] = funcs.parse('false and (' + funcs.str(fProcess['process.condition'][0]) + ')', 4);
        fProcess['process.condition'][1] = funcs.parse('false and (' + funcs.str(fProcess['process.condition'][1]) + ')', 4);
        fProcess.doUpdate();
        lib.PDCodeMigrationUtil.addMigrationPatchRecord("Process", fProcess, fProcess["process"], false);

    }

    if (tailoringProcessInfo.cm3r && (tailoringProcessInfo.cm3r.save || tailoringProcessInfo.cm3r.close || tailoringProcessInfo.cm3t.save || tailoringProcessInfo.cm3t.close)) {
        //change and task use diffrent state and has tailoring
        var fProcess = new SCFile("Process");
        fProcess.doSelect('process="cm.save.wrapper"');
        fProcess['process.condition'][2] = funcs.parse('filename($L.file)="cm3r" and (' + funcs.str(fProcess['process.condition'][0]) + ')', 4);
        fProcess['next.process'][2] = tailoringProcessInfo.cm3r.save ? tailoringProcessInfo.cm3r.save : fProcess['next.process'][0];
        fProcess['process.condition'][3] = funcs.parse('filename($L.file)="cm3r" and (' + funcs.str(fProcess['process.condition'][1]) + ')', 4);
        fProcess['next.process'][3] = tailoringProcessInfo.cm3r.close ? tailoringProcessInfo.cm3r.close : fProcess['next.process'][1];
        fProcess['process.condition'][4] = funcs.parse('filename($L.file)="cm3t" and (' + funcs.str(fProcess['process.condition'][0]) + ')', 4);
        fProcess['next.process'][4] = tailoringProcessInfo.cm3t.save ? tailoringProcessInfo.cm3t.save : fProcess['next.process'][1];
        fProcess['process.condition'][5] = funcs.parse('filename($L.file)="cm3t" and (' + funcs.str(fProcess['process.condition'][1]) + ')', 4);
        fProcess['next.process'][5] = tailoringProcessInfo.cm3t.close ? tailoringProcessInfo.cm3t.close : fProcess['next.process'][1];
        fProcess['process.condition'][0] = funcs.parse('false and (' + funcs.str(fProcess['process.condition'][0]) + ')', 4);
        fProcess['process.condition'][1] = funcs.parse('false and (' + funcs.str(fProcess['process.condition'][1]) + ')', 4);
        fProcess.doUpdate();
        lib.PDCodeMigrationUtil.addMigrationPatchRecord("Process", fProcess, fProcess["process"], false);
    }

    reportObj.title = "The following State is updated. Backups of the original State (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.";
    reportObj.files=changedFiles;

}



//migrateChangeModule();
//var ret = 0;
//funcs.rtecall("trigger", ret, 1);