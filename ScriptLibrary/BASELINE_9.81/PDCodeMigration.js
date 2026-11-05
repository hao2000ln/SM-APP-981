/**
 * We have 2 options
 * opt#1. Keep customer invest and remove PD OOB
 * opt#2. Keep both customer invest and PD OOB
 */
var OPT1 = "opt1";
var OPT2 = "opt2";
var OPTION = OPT2;

var UPGRADE_PREFIX = lib.upgradeConstants.NEW_PREFIX();

var FIRST_PHASE_X = 40;
var PHASE_SPACING = 220;
var FIRST_PHASE_Y = 50;

var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;

var _val = system.functions.val;
var _parse = system.functions.parse;
var addMigrationPatchRecord = lib.PDCodeMigrationUtil.addMigrationPatchRecord;
var CUSTOMER_VERSION_PREFIX = lib.upgradeVersionUtil.getOldPrefix();
var PD_CODE_MIGRATION_DISABLE_SUFFIX = "_disabled";
var PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX = " codeless";
var PD_CODE_MIGRATION_WF_PREFIX = "Migrated ";
var PD_ENABLEMENT_DISABLE_SUFFIX = "_disabled_by_PDHD";
var PD_ENABLEMENT_DISABLE_SUFFIX_REQ = "_disabled_by_PDRM";
var PD_ENABLEMENT_DISABLE_SUFFIX_CHG = "_bak_by_PD";
var PD_ENABLEMENT_TOBE_USED_SUFFIX = "_for_pd4_tobe_used";

var AUTO_UPGRADED_SUFFIX_IN_DESC = " - Automatically Upgraded.";

var MIGRATE_PROFILE_SUFFIX = "_migrated";

var PHASE_NAME_LOGGING = "Logging";
var PHASE_NAME_INPROGRESS = "In Progress";
var PHASE_NAME_CLOSURE = "Closure";
var LEVEL1_INDENT = " ";
var LEVEL2_INDENT = "    ";
var LEVEL3_INDENT = "      ";

// the object names which needs to be migrated as normal approach,
// e.g.:"probsummary", "incidents", "rootcause", "rootcausetask"
// "cm3r", "cm3t"
var OBJECT_NAMES = ["probsummary", "incidents"];
var INCIDENT_OBJECT_NAMES = ["probsummary"];
var SERVICEDESK_OBJECT_NAMES = ["incidents"];

// the object names for request module
var REQUEST_OBJECT_NAMES = ["ocmq", "ocmo", "ocml"];
var REQUEST_DATADICT_MAPTO_AREA = {
    "ocmq": null,
    "ocmo": null,
    "ocml": null,
    "ocmqcat": "Legacy Request Management Configuration",
    "ocmocat": "Legacy Request Management Configuration",
    "ocmlcat": "Legacy Request Management Configuration"
};

var areaTableMap = {
    "Quote": "ocmq",
    "Order": "ocmo",
    "Line Item": "ocml"
};

// TODO, to add more fields in legacy profile "ocmprofile"
REQUEST_PROFILE_MAPPED_FIELDS = ["manager.group", "require.password", "groups", "approval.groups", "allowedStatus", "audit", "calcrsk", "new.category", "new.phase"];

//oob process list that will be made compatible under hybrid and PD mode , so will ignore them during the hybrid script update
var OOB_PROCESS_LIST = ["cc.cloneadd", "cc.createchange", "cc.first.log", "cc.first.log2", "cc.gotoincident", "cc.qopensave", "cc.save.bg", "cc.second.log", "escalate.interaction", "im.close.bg", "im.close", "im.first.exit", "im.first.new", "im.first.save", "im.first", "im.reopen", "im.resolve", "im.save", "sd.search.init", "sm.save"];

//oob link list that will be made compatible under hybrid and PD mode , so will ignore them during the hybrid script update
var OOB_LINK_LIST = ["advFind.incident.search", "advFind.SD.search", "IM.close.incident", "IM.open.incident", "IM.summary", "IM.update.incident", "SD.open.interaction", "SD.update.interaction", "Survey.IM.addFilter", "Survey.SD.addFilter"];

var copycurrent = system.functions.copycurrent;

//var IS_UPGRADE_FROM_PD3_UPGHISTORY = isUpgradeFromPD3();

var SUMMARY_REPORT_OBJS = []; // array of {title:xxx, needManualCheck:true/false, files:[f1, f2]}


var TURE_CONDITION_XML = '<XmlCondition><collection logical="" negate=""><condition logical="" negate="false"><operand type="expression"><Expression caption="">"true"</Expression></operand></condition></collection></XmlCondition>';
var TURE_CONDITION_DESC = "( Expression: true)";

function migrateByModules() {
    //0. set trigger and counter on/off
    // 0.1 trigger off as this migration tool will be invoked by upgrade tool, upgrade tool will make trigger off
    var ret = 0;
    system.functions.rtecall("trigger", ret, 0);
    // 0.2 counter on otherwise create workflow etc will fail with empty key.
    system.functions.rtecall("counter", ret, 1);


    //1. migrate Incident module
    migrateIncidentModule();
    //2. migrate ServieDesk module
    migrateServiceDeskModule();
    //3. migrate the built-in Processes to make sure the workflow Rule sets working
    var radNames = ["im.save.problem", "im.save", "im.close", "cc.save", "cc.qopensave"];
    migrateBuiltinProcesses(radNames);

    //5. detect uncompatible areas
    detectUncompactibleCodes();

    //6. add triggers to related PD category tables to sync the PD category data back to the legacy category table if user check the sync category back option
    if (vars["$sync.category.back"] == "true") {
        synCategoryData();
    }

    //7. QCCR1E127135, delete the non-use ModuleStatus for Problem Module
    lib.ProcessDesignHelpDeskEnableManager.removeModuleStatus();


    //x-1. generate report string which no-need manual check
    var date = new Date();
    lib.ddmEventUtil.sortObjects(SUMMARY_REPORT_OBJS, "category desc");

    printIt("Following is the PD code migration report which is for your information:");
    vars["$pd.wapper.migration.report"] = "Process Designer Migration Report \n\n";
    vars["$pd.wapper.migration.report"] += "Completed Migration Tasks \n";
    vars["$pd.wapper.migration.report"] = vars["$pd.wapper.migration.report"] + date.toString() + "\n";
    var category = "";
    var i, j;

    for (i = 0, len = SUMMARY_REPORT_OBJS.length; i < len; i++) {
        if (SUMMARY_REPORT_OBJS[i].needManualCheck === true) {
            continue;
        }
        if (i == 0 || (i > 0 && category !== SUMMARY_REPORT_OBJS[i].category)) {
            vars["$pd.wapper.migration.report"] = vars["$pd.wapper.migration.report"] + LEVEL1_INDENT + SUMMARY_REPORT_OBJS[i].category + " Records Related Changes\n";
            category = SUMMARY_REPORT_OBJS[i].category;
        }
        var files = SUMMARY_REPORT_OBJS[i].files;
        if (null == files || files.length === 0) {
            vars["$pd.wapper.migration.report"] += "\n";
            printIt("");
            continue;
        } else {
            vars["$pd.wapper.migration.report"] = vars["$pd.wapper.migration.report"] + LEVEL2_INDENT + SUMMARY_REPORT_OBJS[i].title + "\n";
            printIt(SUMMARY_REPORT_OBJS[i].title);

        }
        for (j = 0, lenJ = files.length; j < lenJ; j++) {
            vars["$pd.wapper.migration.report"] += LEVEL3_INDENT + files[j] + "\n";
            printIt(LEVEL2_INDENT + files[j]);
        }
        vars["$pd.wapper.migration.report"] += "\n";
        printIt("");
    }

    writePDMigrationLog(vars["$pd.wapper.migration.report"]);
    writePDMigrationLog("===========================================================================================================================================================================\n");
    writePDMigrationLog("The Next Step\n");


    //x-2. generate report string which need manual check
    printIt("Following is the Process Designer code migration report which needs your manual review:");
    vars["$pd.wapper.migration.report.manual"] = "To successfully complete the migration process, review and validate the following records.\n";
    for (i = 0, len = SUMMARY_REPORT_OBJS.length; i < len; i++) {
        if (SUMMARY_REPORT_OBJS[i].needManualCheck !== true) {
            continue;
        }

        if (i == 0 || (i > 0 && category !== SUMMARY_REPORT_OBJS[i].category)) {
            vars["$pd.wapper.migration.report.manual"] = vars["$pd.wapper.migration.report.manual"] + LEVEL1_INDENT + SUMMARY_REPORT_OBJS[i].category + " Records Related Changes\n";
            category = SUMMARY_REPORT_OBJS[i].category;
        }

        var files = SUMMARY_REPORT_OBJS[i].files;
        if (null == files || files.length === 0) {
            vars["$pd.wapper.migration.report.manual"] += "\n";
            printIt("");
            continue;
        } else {
            vars["$pd.wapper.migration.report.manual"] = vars["$pd.wapper.migration.report.manual"] + LEVEL2_INDENT + SUMMARY_REPORT_OBJS[i].title + "\n";
            printIt(SUMMARY_REPORT_OBJS[i].title);
        }

        for (j = 0, lenJ = files.length; j < lenJ; j++) {
            vars["$pd.wapper.migration.report.manual"] += LEVEL3_INDENT + files[j] + "\n";
            printIt(LEVEL2_INDENT + files[j]);
        }
        vars["$pd.wapper.migration.report.manual"] += "\n";
        printIt("");
    }

    writePDMigrationLog(vars["$pd.wapper.migration.report.manual"]);

    //add pmdPatch record for message generated for workflow
    addMsgPDMpatch();

    //x. turn trigger back, how can I know the original value is on or off? - no, RTE does not provide such method
    //system.functions.rtecall("trigger", ret, 1);
    // x.2 counter off because in SM upgrade process it should be off.
    system.functions.rtecall("counter", ret, 0);
}

function writePDMigrationLog(log) {
    var PDMIGRATION_LOG_PATH = "../logs/pdmigration.log";
    writeFile(PDMIGRATION_LOG_PATH, 'a', log);
}


function migrateIncidentModule() {
    //1. objects
    if (migrateObjects(INCIDENT_OBJECT_NAMES) == false) {
        printIt("Migration Incident Object fail, ignore migrating Incident Module!", true);
        return;
    }
    //2. workflow
    createIncidentWorkflowsByCategories();
    //3. migrate Incident and ServiceDesk categories
    migrateIncidentCategories();
    //4. migrate security if it is upgraded from PD3, ignore if it is upgraded from non-PD, comment out this because it's already done in upgradeConvert
    //migrateIncidentSecurity();
    //5. migrate solution matching
    migrateIncidentSolutionMatching();
    //6. migrate category based alerts
    migrateCategoryAlert();
    //7. fixing the Change Category behavior for incident module
    fixIncidentChangeCategoryAction();
}

function migrateIncidentSecurity() {
    //if(IS_UPGRADE_FROM_PD3_UPGHISTORY) 
    {
        var ret = 0;
        system.functions.rtecall("trigger", ret, 1);
        lib.IncidentUpgradeManager.getInstance().upgradeProfiles();
        system.functions.rtecall("trigger", ret, 0);
        lib.IncidentUpgradeManager.getInstance().upgradeOperators();
        system.functions.rtecall("trigger", ret, 1);
        lib.IncidentUpgradeManager.getInstance().upgradeUserRoles();
        system.functions.rtecall("trigger", ret, 0);
    }
}

function isUpgradeFromPD3() {
    var ret = false;
    var upghis = new SCFile("upgradehistory");
    var rc = upghis.doSelect('true');
    while (rc == RC_SUCCESS) {
        if (upghis["new.version"] === "PD 9.30.3") { // if it is PD4, return false directly
            return false;
        } else if (upghis["new.version"] === "PD 9.30.2") { // if it is PD3, make as true and continue to check whether there is PD4
            ret = true;
        }
        rc = upghis.getNext();
    }
    return ret;
}

function migrateServiceDeskModule() {
    //1. objects
    migrateObjects(SERVICEDESK_OBJECT_NAMES);
    //2. workflow
    createServideDeskWorkflowsByCategories();
    //3. categories, which are migrated together with Incident module, no need here.
    // do nother here
    //4. migrate security, comment out because it's done in upgradeConvert
    //migrateServiceDeskSecurity();
    //5. fix 'create new interaction' processing
    fixSDNewProcessing();
    //6. QCCR1E125727, need to enable the setting 'Enable Streamlined Interaction'
    // rollback it by commenting below line, it will be tracked with ER QCCR1E126880.
}

function migrateServiceDeskSecurity() {
    //if(IS_UPGRADE_FROM_PD3_UPGHISTORY)
    {
        var ret = 0;
        system.functions.rtecall("trigger", ret, 1);
        lib.ServiceDeskUpgradeManager.getInstance().upgradeProfiles();
        system.functions.rtecall("trigger", ret, 0);
        lib.ServiceDeskUpgradeManager.getInstance().upgradeOperators();
        system.functions.rtecall("trigger", ret, 1);
        lib.ServiceDeskUpgradeManager.getInstance().upgradeUserRoles();
        system.functions.rtecall("trigger", ret, 0);
    }
}

function migrateObjects(objs) {
    printIt("Start migrating Objects...", true);
    var i;
    for (i = 0, len = objs.length; i < len; i++) {
        if (migrateObject(objs[i]) == false) {
            return false;
        }
    }
    printIt("Finish migrating Objects.", true);
    return true;
}

function migrateObject(obj) {
    return migrateObjectOpt2(obj);
}



function migrateObjectOpt2(objectName) {
    printIt(" -> start migrating Object \"" + objectName + "\"...", true);


    //0. check whether this Object is migrated already by checking the existance of the disabled record by PD code migration
    var pdMigrationDisabledObjectFile = $("Object").select("file.name=\"" + objectName + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
    if (null !== pdMigrationDisabledObjectFile) {
        printIt("The Object \"" + objectName + "\" has already been migrated, ignore it!");
        return false;
    }

    // if it is not from PD3, then the pd enablement script should be run before running this code migration tool, so the tool
    //var isUpgradeFromPD3Flag = isUpgradeFromPD3(); // here I do not use the const otherwise the UT case will fail.
    var hasCustomization = true;
    //if(isUpgradeFromPD3Flag)
    {
        var upgradeObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + UPGRADE_PREFIX + objectName + "\"").uniqueResult();
        if (null == upgradeObjectFile) {
            hasCustomization = false;
        }
    }




    //1. rename the Object name to xxx_disabled_by_PDCM, which is
    //   . either the PD enabled object if the system is upgrade from non-PD, or the system is upgrade from PDCP3 but there is not any customization on this object
    //   . or, the non-PD object if the system is upgrade from PDCP3 but there is some customization on this object
    var reportObj = {};
    var changedFiles = [];
    reportObj.files = changedFiles;
    reportObj.category = "Object";
    reportObj.filename = "object";

    SUMMARY_REPORT_OBJS.push(reportObj);

    //if(isUpgradeFromPD3Flag==true) 
    {
        if (hasCustomization == false) {
            reportObj.title = "The following object is replaced with the out-of-box Process Designer-based version. Backups of the original object (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.";
            changedFiles.push(objectName);
            printIt("The object \"" + objectName + "is replaced with the out-of-box Process Designer-based version. Backups of the original object (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.");

        } else {
            reportObj.title = "The following object is replaced with the out-of-box Process Designer-based version plus your customozation on original object. Backups of the original object (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.";
            changedFiles.push(objectName);
            printIt("The object \"" + objectName + "is replaced with the out-of-box Process Designer-based version plus your customozation on original object. Backups of the original object (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.");

        }
    }


    var orgObjectFile = $("Object").select('file.name="' + objectName + '"').uniqueResult();
    
    if (null !== orgObjectFile) {
        orgObjectFile["file.name"] = objectName + PD_CODE_MIGRATION_DISABLE_SUFFIX;
        if (hasCustomization == false) {
            // if no customization on the Object, just copy the orginal Object with PD code migration disable suffix, which marks this module is enabled.
            orgObjectFile.doInsert();

            // remove the empty items from array fields in case there are any empty items
            orgObjectFile = $("Object").select('file.name="' + objectName + '"').uniqueResult();


            // make sure the fields $L.lastinc, $L.oldinc and $L.mode.add be in local.variables for incidents object
            var addDefaultForSD = false;
            if (objectName === "incidents") {
                if (!arrayContains(orgObjectFile["local.variables"], "$L.lastinc")) {
                    orgObjectFile["local.variables"].push("$L.lastinc");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.oldinc")) {
                    orgObjectFile["local.variables"].push("$L.oldinc");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.cost")) {
                    orgObjectFile["local.variables"].push("$L.cost");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.display.cost")) {
                    orgObjectFile["local.variables"].push("$L.display.cost");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.value.cost")) {
                    orgObjectFile["local.variables"].push("$L.value.cost");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.handle.start")) {
                    orgObjectFile["local.variables"].push("$L.handle.start");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.pmtapi")) {
                    orgObjectFile["local.variables"].push("$L.pmtapi");
                    addDefaultForSD = true;
                }
                if (!arrayContains(orgObjectFile["local.variables"], "$L.mode.add")) {
                    orgObjectFile["local.variables"].push("$L.mode.add");
                    addDefaultForSD = true;
                }
                //for Exit & New
                if (!arrayContains(orgObjectFile["local.variables"], "$L.viewLastInteraction")) {
                    orgObjectFile["local.variables"].push("$L.viewLastInteraction");
                    addDefaultForSD = true;
                }
            }

            var removeEmptyItemsFlag1 = removeEmptyItemsFromArray(orgObjectFile, "assignedToFields", null);
            var removeEmptyItemsFlag2 = removeEmptyItemsFromArray(orgObjectFile, "workgroupFields", null);
            var removeEmptyItemsFlag3 = removeEmptyItemsFromArray(orgObjectFile, "local.variables", null);
            var removeEmptyItemsFlag4 = removeEmptyItemsFromArray(orgObjectFile, "global.lists", null);
            var removeEmptyItemsFlag5 = removeEmptyItemsFromArray(orgObjectFile, "parent.id", ["parent.object"]);
            var removeEmptyItemsFlag6 = removeEmptyItemsFromArray(orgObjectFile, "watch.variables", ["watch.variable.name", "watch.variable.type", "watch.variable.global.list"]);
            if (addDefaultForSD || removeEmptyItemsFlag1 || removeEmptyItemsFlag2 || removeEmptyItemsFlag3 || removeEmptyItemsFlag4 || removeEmptyItemsFlag5 || removeEmptyItemsFlag6) {
                orgObjectFile.doUpdate();
            }

            return true;
        } else {
            orgObjectFile.doUpdate();
        }
    } else {
        printIt("Can not find the original Object \"" + objectName + "\", ignore it!");
    }

    // get PD OOB Object
    var pdEnabledObjectFile = null;
    var legacyObjectFile = null;
    // if(isUpgradeFromPD3Flag==true)
    {
        if (hasCustomization == true) {
            pdEnabledObjectFile = $("Object").select('file.name="' + UPGRADE_PREFIX + objectName + '"').uniqueResult();
            legacyObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + CUSTOMER_VERSION_PREFIX + objectName + "\"").uniqueResult();
           
        } else {
            // already return above, no need to handle here
        }
    }



    //2. clone from the the PD OOB Object, and set PD security/category/workflow info
    var pdMigratedObjectFile = pdEnabledObjectFile;
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
        mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "assignedToFields");
        // 2.4 merge legacy Workgroup fields to this Object
        mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "workgroupFields");
        // 2.5 merge legacy local variables to this Object
        mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "local.variables");


        // make sure the fields $L.lastinc, $L.oldinc and $L.mode.add be in local.variables for incidents object
        if (objectName === "incidents") {
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.lastinc")) {
                pdMigratedObjectFile["local.variables"].push("$L.lastinc");
            }
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.oldinc")) {
                pdMigratedObjectFile["local.variables"].push("$L.oldinc");
            }

            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.cost")) {
                pdMigratedObjectFile["local.variables"].push("$L.cost");
            }
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.display.cost")) {
                pdMigratedObjectFile["local.variables"].push("$L.display.cost");
            }
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.value.cost")) {
                pdMigratedObjectFile["local.variables"].push("$L.value.cost");
            }
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.handle.start")) {
                pdMigratedObjectFile["local.variables"].push("$L.handle.start");
            }
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.pmtapi")) {
                pdMigratedObjectFile["local.variables"].push("$L.pmtapi");
            }
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.mode.add")) {
                pdMigratedObjectFile["local.variables"].push("$L.mode.add");
            }
            //for Exit & New
            if (!arrayContains(pdMigratedObjectFile["local.variables"], "$L.viewLastInteraction")) {
                pdMigratedObjectFile["local.variables"].push("$L.viewLastInteraction");
            }
        }

        // 2.6 merge legacy global list to this Object
        mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "global.lists");
        // 2.7 merge legacy Parent Lock Information and Watch Variables
        mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "parent.id", ["parent.object"]);
        mergeArrayFieldValue(pdMigratedObjectFile, legacyObjectFile, "watch.variables", ["watch.variable.name", "watch.variable.type", "watch.variable.global.list"]);

        // 2.7 alert, no need as we are using PD based OOB?
        // 2.8 approval, no need as we are using PD based OOB

        pdMigratedObjectFile.doInsert();
        addMigrationPatchRecord("Object", pdMigratedObjectFile, pdMigratedObjectFile["file.name"], false);
    } else {
        printIt("Can not find the PD OOB Object for \"" + objectName + "\", ignore it!");
        return false;
    }

    //3. For add/update related processes, need to make sure the $L.exit is set to "normal" or "added", otherwise the default/auto transitions will not be executed
    // I am going to enhance the DOC Engine, so that we donot need to change the Processes
    //dealVarExitInProcess(objectName);

    printIt(" -> migrated Object \"" + objectName + "\" done.", true);
    return true;
}

function createIncidentWorkflowsByCategories() {
    var pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "Incident";
    var tableName = "probsummary";
    createFixedWorkflowByCategories(true, pdMigratedWorkflowName, tableName);
}

function createServideDeskWorkflowsByCategories() {
    pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "ServiceDesk";
    tableName = "incidents";
    createFixedWorkflowByCategories(false, pdMigratedWorkflowName, tableName);
    appendSDBGtransition(pdMigratedWorkflowName);
}

function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[c];
    });
}

function createFixedWorkflowByCategories(hasLogging, pdMigratedWorkflowName, tableName, legacyObjectName, legacyWF) {
    // set trigger on to make sure the related scmsg could be auto generated
    var ret = 0;
    var triggerStatus = system.functions.sysinfo_get("trigger");
    system.functions.rtecall("trigger", ret, 1);

    printIt("Creating Workflow \"" + pdMigratedWorkflowName + "\" for table \"" + tableName + "...", true);
    // 0. check if this workflow is already added
    var pdMigratedWorkflow = $("Workflow").select("tableName=\"" + tableName + "\" and name=\"" + pdMigratedWorkflowName + "\"").uniqueResult();
    if (null !== pdMigratedWorkflow) {
        printIt("The Workflow \"" + pdMigratedWorkflowName + "\" has already been migrated, ignore it!");
        return;
    }

    var objectFile = $("Object").select("file.name=\"" + tableName + "\"").uniqueResult();
    var legacyObjectFile = null;
    if (legacyObjectName != null) {
        legacyObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + legacyObjectName + "\"").uniqueResult();
    } else {
        // assume it is upgrade from non-PD, and the pd enablement script has been run
        legacyObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + tableName + PD_ENABLEMENT_DISABLE_SUFFIX + "\"").uniqueResult();
        if (null == legacyObjectFile) {
            // assume it is upgraded from PDCP3, and has customization on Object
            legacyObjectFile = $("Object", SCFILE_READONLY).select("file.name=\"" + CUSTOMER_VERSION_PREFIX+ tableName  + "\" and workflowLocation=NULL").uniqueResult();
            if (null == legacyObjectFile) {
                // keep it as null, assume it is upgraded from PDCP3 and no customization on Object.
            }
        }
    }

    if (null == objectFile) {
        printIt("Can not find the Object \"" + tableName + "\", ignore creating workflow!", true);
        return;
    }
    var altOpenStateDSName = null;
    if (legacyObjectFile != null) {
        altOpenStateDSName = legacyObjectFile["open.state"];
    } else {
        if (tableName === "probsummary") {
            altOpenStateDSName = "im.open";
        } else if (tableName === "incidents") {
            altOpenStateDSName = "sm.open";
        } else if (tableName === "cm3r") {
            altOpenStateDSName = "cm.open";
        } else if (tableName === "cm3t") {
            altOpenStateDSName = "change.open";
        }
    }
    var altOpenStateDS = $("States").select("state=\"" + altOpenStateDSName + "\"").uniqueResult();
    if (null == altOpenStateDS) {
        printIt("Can not find the alternative open state\"" + altOpenStateDSName + "\", use default db.view!");
        altOpenStateDS = $("States").select("state=\"db.view\"").uniqueResult();
    }
    var altDefaultStateDSName = null;
    if (legacyObjectFile != null) {
        altDefaultStateDSName = legacyObjectFile["default.state"];
    } else {
        if (tableName === "probsummary") {
            altDefaultStateDSName = "im.view";
        } else if (tableName === "incidents") {
            altDefaultStateDSName = "sm.view";
        } else if (tableName === "cm3r") {
            altDefaultStateDSName = "cm.view";
        } else if (tableName === "cm3t") {
            altDefaultStateDSName = "change.view";
        }
    }
    var altDefaultStateDS = $("States").select("state=\"" + altDefaultStateDSName + "\"").uniqueResult();
    if (null == altDefaultStateDS) {
        printIt("Can not find the alternative default state\"" + altDefaultStateDSName + "\", use default db.view!");
        altDefaultStateDS = $("States").select("state=\"db.view\"").uniqueResult();
    }
    var openStateDS = $("displayscreen").select("screen.id=\"" + altOpenStateDS["display.screen"] + "\"").uniqueResult();
    if (null == openStateDS) {
        printIt("Can not find the display screen\"" + altOpenStateDS["display.screen"] + "\", ignore creating workflow!");
        return;
    }
    var defaultStateDS = $("displayscreen").select("screen.id=\"" + altDefaultStateDS["display.screen"] + "\"").uniqueResult();
    if (null == openStateDS) {
        printIt("Can not find the display screen\"" + altDefaultStateDS["display.screen"] + "\", ignore creating workflow!");
        return;
    }

    // 1. add the workflow
    // 1.1 workflow record itself
    var body = {
        "name": pdMigratedWorkflowName,
        "tableName": tableName,
        "defaultPhase": PHASE_NAME_INPROGRESS,
        "firstPhase": hasLogging ? PHASE_NAME_LOGGING : PHASE_NAME_INPROGRESS
    };
    body["optimize.autotran.save"] = true;
    body["onDisplayRules"] = ["common.relatedrecord.init.vars", "common.workflow.init.vars"];
    if (legacyWF !== false) {
        body["is.legacy.workflow"] = true;
        if (legacyObjectFile != null) {
            body["legacy.fc"] = legacyObjectFile["master.fc"];
            body["legacy.open.state"] = legacyObjectFile["open.state"];
            body["legacy.close.state"] = legacyObjectFile["close.state"];
            body["legacy.default.state"] = legacyObjectFile["default.state"];
            body["legacy.browse.state"] = legacyObjectFile["browse.state"];
        } else {
            body["legacy.fc"] = tableName;
            if (tableName === "probsummary") {
                body["legacy.open.state"] = "im.open";
                body["legacy.close.state"] = null;
                body["legacy.default.state"] = "im.view";
                body["legacy.browse.state"] = "im.browse";
            } else if (tableName === "incidents") {
                body["legacy.open.state"] = "sm.open";
                body["legacy.close.state"] = null;
                body["legacy.default.state"] = "sm.view";
                body["legacy.browse.state"] = "sm.browse";
            } else if (tableName === "cm3r") {
                body["legacy.open.state"] = "cm.open";
                body["legacy.close.state"] = null;
                body["legacy.default.state"] = "cm.view";
                body["legacy.browse.state"] = "cm.browse";
            } else if (tableName === "cm3t") {
                body["legacy.open.state"] = "change.open";
                body["legacy.close.state"] = null;
                body["legacy.default.state"] = "change.view";
                body["legacy.browse.state"] = "cm.browse";
            }
        }
    }
    var workflow = addWorkflow(body);

    // 1.2. create phase "Logging"
    var phase1 = {
        "phaseName": PHASE_NAME_LOGGING,
        "workflowName": pdMigratedWorkflowName,
        "tableName": tableName,
        "xCoordinate": FIRST_PHASE_X,
        "yCoordinate": FIRST_PHASE_Y,
        "active": true,
        "phaseOrder": 1
    };
    if (altOpenStateDS['input.condition'] != null) {
        var ioStr = system.functions.str(altOpenStateDS['input.condition']);
        phase1["updateCond"] = ioStr;
        phase1["updateCondXML"] = '<XmlCondition><collection logical="" negate="">' + '<condition logical="" negate="false"><operand type="expression">' + '<Expression caption="">"' + html2Escape(ioStr) + '"</Expression>' + '</operand></condition></collection></XmlCondition>';
        phase1["updateCondDesc"] = "( Expression: " + ioStr + ")";
    }
    var loggingPhase = hasLogging ? addWorkflowPhase(phase1) : null;

    // 1.3. create phase "In Progress"
    var phase2 = {
        "phaseName": PHASE_NAME_INPROGRESS,
        "workflowName": pdMigratedWorkflowName,
        "tableName": tableName,
        "xCoordinate": FIRST_PHASE_X + PHASE_SPACING * 1,
        "yCoordinate": FIRST_PHASE_Y,
        "active": true,
        "phaseOrder": 2
    };
    if (altDefaultStateDS['input.condition'] != null) {
        var ioStr = system.functions.str(altDefaultStateDS['input.condition']);
        if (!hasLogging) {
            ioStr = "(($L.mode~=\"add\") and (" + ioStr + ")) " + " or " + "(($L.mode=\"add\") and (" + phase1["updateCond"] + ")) ";
        }
        phase2["updateCond"] = ioStr;
        phase2["updateCondXML"] = '<XmlCondition><collection logical="" negate="">' + '<condition logical="" negate="false"><operand type="expression">' + '<Expression caption="">"' + html2Escape(ioStr) + '"</Expression>' + '</operand></condition></collection></XmlCondition>';
        phase2["updateCondDesc"] = "( Expression: " + ioStr + ")";
    }
    var inProgressPhase = addWorkflowPhase(phase2);

    // 1.4 add default transitiion between phase 1 and phase 2
    var transitionBody = {
        "toPhase": PHASE_NAME_INPROGRESS
    };
    loggingPhase = hasLogging ? addDefaultTransition(PHASE_NAME_LOGGING, pdMigratedWorkflowName, tableName, transitionBody) : null;

    // 1.5. create phase "Closure"
    var phase3 = {
        "phaseName": PHASE_NAME_CLOSURE,
        "workflowName": pdMigratedWorkflowName,
        "tableName": tableName,
        "xCoordinate": FIRST_PHASE_X + PHASE_SPACING * 2,
        "yCoordinate": FIRST_PHASE_Y,
        "active": true,
        "phaseOrder": 3
    };
    if (defaultStateDS.io != null) {
        var ioStr = system.functions.str(defaultStateDS.io);
        phase3["updateCond"] = ioStr;
        phase3["updateCondXML"] = '<XmlCondition><collection logical="" negate="">' + '<condition logical="" negate="false"><operand type="expression">' + '<Expression caption="">"' + html2Escape(ioStr) + '"</Expression>' + '</operand></condition></collection></XmlCondition>';
        phase3["updateCondDesc"] = "( Expression: " + ioStr + ")";
    }
    var closurePhase = addWorkflowPhase(phase3);

    var statuesField = objectFile.statusField;
    // 1.6 add auto transitiion from phase 2 (In Progress) to phase 3 (Closure)
    transitionBody = {
        "atToPhase": PHASE_NAME_CLOSURE,
        "atCondition": statuesField + ' in $L.file="Closed" or ' + statuesField + ' in $L.file="Resolved"',
        "atCondXML": '<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"field\"><TableName>CurrentRecord</TableName><FieldName caption=\"Status\">' + statuesField + '</FieldName></operand><Comparison>equals</Comparison><Value dataType=\"string\">Closed</Value></condition><condition logical=\"OR\" negate=\"false\"><operand type=\"field\"><TableName>CurrentRecord</TableName><FieldName caption=\"Status\">' + statuesField + '</FieldName></operand><Comparison>equals</Comparison><Value dataType=\"string\">Resolved</Value></condition></collection></XmlCondition>',
        "atCondDesc": '( Status in CurrentRecord = \"Closed\" OR Status in CurrentRecord = \"Resolved\")',
        "atxCoordinate": 0,
        "atyCoordinate": 0,
        "atDescription": ""
    };
    inProgressPhase = addAutoTransition(PHASE_NAME_INPROGRESS, pdMigratedWorkflowName, tableName, transitionBody);

    // 1.7 add auto transitiion from phase 3 (Closure) to phase 2 (In Progress) 
    transitionBody = {
        "atToPhase": PHASE_NAME_INPROGRESS,
        "atCondition": 'not  (same(' + statuesField + ' in $L.file, "Closed")) and not  (same(' + statuesField + ' in $L.file, "Resolved"))',
        "atCondXML": '<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"field\"><TableName>CurrentRecord</TableName><FieldName caption=\"Status\">' + statuesField + '</FieldName></operand><Comparison>neq</Comparison><Value dataType=\"string\">Closed</Value></condition><condition logical=\"AND\" negate=\"false\"><operand type=\"field\"><TableName>CurrentRecord</TableName><FieldName caption=\"Status\">' + statuesField + '</FieldName></operand><Comparison>neq</Comparison><Value dataType=\"string\">Resolved</Value></condition></collection></XmlCondition>',
        "atCondDesc": '( Status in CurrentRecord != \"Closed\" AND Status in CurrentRecord != \"Resolved\")',
        "atxCoordinate": FIRST_PHASE_X + PHASE_SPACING * 1 + 120,
        "atyCoordinate": FIRST_PHASE_Y + 100,
        "atDescription": ""
    };
    closurePhase = addAutoTransition(PHASE_NAME_CLOSURE, pdMigratedWorkflowName, tableName, transitionBody);

    // 1.8 add dynamic forms according to the configuration in category for Incident workflow
    if (tableName === "probsummary") {
        var category = new SCFile("category");
        var rc = category.doSelect('active=true');
        var idx = 0;
        var idx2 = 0;
        while (rc == RC_SUCCESS) {
            // logging phase
            loggingPhase.altForm[idx].altFormId = idx;
            loggingPhase.altForm[idx]["altFormName"] = category["open.format"];
            loggingPhase.altForm[idx]["altFormDesc"] = category["open.format"];
            loggingPhase.altForm[idx]["altFormCondition"] = 'category in $L.file="' + category["name"] + '"';
            loggingPhase.altForm[idx]["altFormCondXML"] = '<XmlCondition>' + '<collection logical="" negate="">' + '<condition logical="" negate="false">' + '<operand type="field">' + '<TableName>CurrentRecord</TableName>' + '<FieldName caption="Category">category</FieldName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType="string">' + category["name"] + '</Value>' + '</condition></collection></XmlCondition>';
            loggingPhase.altForm[idx]["altFormCondDesc"] = '( Category in CurrentRecord = "' + category["name"] + '")';
            loggingPhase.altForm[idx]["altFormType"] = "disp";

            // in_progress phase for update mode
            inProgressPhase.altForm[idx2]["altFormId"] = idx2;
            inProgressPhase.altForm[idx2]["altFormName"] = category["update.format"];
            inProgressPhase.altForm[idx2]["altFormDesc"] = category["update.format"];
            inProgressPhase.altForm[idx2]["altFormCondition"] = 'category in $L.file="' + category["name"] + '" and not (same($L.mode, "close"))';
            inProgressPhase.altForm[idx2]["altFormCondXML"] = '<XmlCondition>' + '<collection logical="" negate="">' + '<condition logical="" negate="false">' + '<operand type="field">' + '<TableName>CurrentRecord</TableName>' + '<FieldName caption="Category">category</FieldName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType="string">' + category["name"] + '</Value>' + '</condition>' + '<condition logical=\"AND\" negate=\"false\">' + '<operand type=\"variable\">' + '<VariableName caption=\"$L.mode\">$L.mode</VariableName>' + '</operand>' + '<Comparison>neq</Comparison>' + '<Value dataType=\"string\">close</Value></condition>' + '</collection>' + '</XmlCondition>';
            inProgressPhase.altForm[idx2]["altFormCondDesc"] = '( Category in CurrentRecord = "' + category["name"] + '" AND $L.mode != \"close\")';
            inProgressPhase.altForm[idx2]["altFormType"] = "disp";

            // closure phase for close mode
            closurePhase.altForm[idx2]["altFormId"] = idx2;
            closurePhase.altForm[idx2]["altFormName"] = category["close.format"];
            closurePhase.altForm[idx2]["altFormDesc"] = category["close.format"];
            closurePhase.altForm[idx2]["altFormCondition"] = 'category in $L.file="' + category["name"] + '" and not (same($L.action, "reopen"))';
            closurePhase.altForm[idx2]["altFormCondXML"] = '<XmlCondition>' + '<collection logical="" negate="">' + '<condition logical="" negate="false">' + '<operand type="field">' + '<TableName>CurrentRecord</TableName>' + '<FieldName caption="Category">category</FieldName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType="string">' + category["name"] + '</Value>' + '</condition>' + '<condition logical=\"AND\" negate=\"false\">' + '<operand type=\"variable\">' + '<VariableName caption=\"$L.mode\">$L.action</VariableName>' + '</operand>' + '<Comparison>neq</Comparison>' + '<Value dataType=\"string\">reopen</Value></condition>' + '</collection>' + '</XmlCondition>';
            closurePhase.altForm[idx2]["altFormCondDesc"] = '( Category in CurrentRecord = "' + category["name"] + '" AND $L.action != \"reopen\")';
            closurePhase.altForm[idx2]["altFormType"] = "disp";

            // in_progress phase for close mode
            idx2++;
            inProgressPhase.altForm[idx2]["altFormId"] = idx2;
            inProgressPhase.altForm[idx2]["altFormName"] = category["close.format"];
            inProgressPhase.altForm[idx2]["altFormDesc"] = category["close.format"];
            inProgressPhase.altForm[idx2]["altFormCondition"] = 'category in $L.file="' + category["name"] + '" and same($L.mode, "close")';
            inProgressPhase.altForm[idx2]["altFormCondXML"] = '<XmlCondition>' + '<collection logical="" negate="">' + '<condition logical="" negate="false">' + '<operand type="field">' + '<TableName>CurrentRecord</TableName>' + '<FieldName caption="Category">category</FieldName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType="string">' + category["name"] + '</Value>' + '</condition>' + '<condition logical=\"AND\" negate=\"false\">' + '<operand type=\"variable\">' + '<VariableName caption=\"$L.mode\">$L.mode</VariableName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType=\"string\">close</Value></condition>' + '</collection>' + '</XmlCondition>';
            inProgressPhase.altForm[idx2]["altFormCondDesc"] = '( Category in CurrentRecord = "' + category["name"] + '" AND $L.mode = \"close\")';
            inProgressPhase.altForm[idx2]["altFormType"] = "disp";

            // closure phase for reopen mode
            closurePhase.altForm[idx2]["altFormId"] = idx2;
            closurePhase.altForm[idx2]["altFormName"] = category["update.format"];
            closurePhase.altForm[idx2]["altFormDesc"] = category["update.format"];
            closurePhase.altForm[idx2]["altFormCondition"] = 'category in $L.file="' + category["name"] + '" and (same($L.action, "reopen"))';
            closurePhase.altForm[idx2]["altFormCondXML"] = '<XmlCondition>' + '<collection logical="" negate="">' + '<condition logical="" negate="false">' + '<operand type="field">' + '<TableName>CurrentRecord</TableName>' + '<FieldName caption="Category">category</FieldName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType="string">' + category["name"] + '</Value>' + '</condition>' + '<condition logical=\"AND\" negate=\"false\">' + '<operand type=\"variable\">' + '<VariableName caption=\"$L.mode\">$L.action</VariableName>' + '</operand>' + '<Comparison>equals</Comparison>' + '<Value dataType=\"string\">reopen</Value></condition>' + '</collection>' + '</XmlCondition>';
            closurePhase.altForm[idx2]["altFormCondDesc"] = '( Category in CurrentRecord = "' + category["name"] + '" AND $L.action = \"reopen\")';
            closurePhase.altForm[idx2]["altFormType"] = "disp";

            rc = category.getNext();
            idx++;
            idx2++;
        }
        loggingPhase.doAction("save");
        inProgressPhase.doAction("save");
        closurePhase.doAction("save");
    }

    system.functions.rtecall("trigger", ret, triggerStatus); //set trigger back
    printIt("Created Workflow \"" + pdMigratedWorkflowName + "\" for table \"" + tableName + ".", true);
}

/**
 * Add Workflow.
 *
 * @param {HashMap} workflow_body
 *         workflow_body = {
 *            "name": "TestJSWorkflow",
 *            "tableName": "MigrationSourceTable",
 *            "defaultPhase": "Phase 1",
 *            "firstPhase": "Phase 1" }
 *
 * @return the Workflow record.
 */
function addWorkflow(workflow_body) {
    var workflow = new SCFile("Workflow");
    var field;
    for (field in workflow_body) {
        workflow[field] = workflow_body[field];
    }
    workflow.doAction("add");
    addMigrationPatchRecord("Workflow", workflow, workflow["name"], false);
    return workflow;
}

/**
 * Add Workflow Phase.
 *
 * @param {HashMap} phase_body
 *         var phase_body = {
 *            "phaseName": "Phase 1",
 *            "workflowName": "TestJSWorkflow",
 *            "tableName": "MigrationSourceTable",
 *            "active": true }
 *
 * @return WorkflowPhase record.
 * @type object
 */
function addWorkflowPhase(phase_body) {
    var workflowPhase = new SCFile("WorkflowPhase");
    var field;
    for (field in phase_body) {
        workflowPhase[field] = phase_body[field];
    }
    workflowPhase.doAction("add");
    addMigrationPatchRecord("WorkflowPhase", workflowPhase, workflowPhase["name"], false);
    return workflowPhase;
}

/**
 * Add Auto Transition into the specified Workflow Phase.
 *
 * @param {String}
 *            phaseName - The Workflow Phase Name
 * @param {String}
 *            workflowName - The workflow name
 * @param {String}
 *            tablename - The Workflow table name
 * @param {HashMap}
 *            trasition_body - The transition content var transition_body = {
 *            "atToPhase": "Phase 2", // The tranistion target phase
 *
 * @return WorkflowPhase record.
 * @type object
 */
function addAutoTransition(phaseName, workflowName, tableName, transition_body) {
    var workflowPhase = new SCFile("WorkflowPhase");
    var query = "phaseName=\"" + phaseName + "\" and tableName=\"" + tableName + "\" and workflowName=\"" + workflowName + "\"";
    var ret = workflowPhase.doSelect(query);

    var transitionType = "autoTransition";
    var transitions = workflowPhase[transitionType];
    var transitionsLen = transitions.length();

    var oldworkflowphase = workflowPhase;

    var field;
    if (transitions[0] == null) {
        for (field in transition_body) {
            workflowPhase[transitionType][0][field] = transition_body[field];
        }
    } else {
        for (field in transition_body) {
            workflowPhase[transitionType][transitionsLen][field] = transition_body[field];
        }
    }
    workflowPhase.doAction("save");
    return workflowPhase;
}

/**
 * Add Default Transition into the specified Workflow Phase.
 *
 * @param {String}
 *            phaseName - The Workflow Phase Name
 * @param {String}
 *            workflowName - The workflow name
 * @param {String}
 *            tablename - The Workflow table name
 * @param {HashMap}
 *            trasition_body - The transition content var transition_body = {
 *            "toPhase": "Phase 2" // The tranistion target phase
 *
 * @return WorkflowPhase record.
 * @type object
 */
function addDefaultTransition(phaseName, workflowName, tableName, transition_body) {
    var workflowPhase = new SCFile("WorkflowPhase");
    var query = "phaseName=\"" + phaseName + "\" and tableName=\"" + tableName + "\" and workflowName=\"" + workflowName + "\"";
    var ret = workflowPhase.doSelect(query);

    workflowPhase["defaultTransition"] = transition_body["toPhase"];
    workflowPhase.doAction("save");
    return workflowPhase;
}

function prepareCategories2Migrate() {
    var sdCatSelected = [],
        imCatSelected = [],
        pmCatSelected = [],
        allCat = [];

    var category = new SCFile("category");
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        if (category.name == "problem") {
            pmCatSelected.push(category.name);
        } else if (category.name == "service catalog") {
            sdCatSelected.push(category.name);
        } else if (category.name == "incident" || category.name == "request for information" || category.name == "request for change" || category.name == "complaint") {
            sdCatSelected.push(category.name);
            imCatSelected.push(category.name);
        } else if (!(_str.startsWith(category.name, "NEW") || _str.startsWith(category.name, "OLD") || _str.startsWith(category.name, "PRE")) && category.active) {
            sdCatSelected.push(category.name);
            imCatSelected.push(category.name);
            pmCatSelected.push(category.name);
        }
        allCat.push(category.name);
        rc = category.getNext();
    }

    vars['$sdcat2migrate.selected'] = sdCatSelected;
    vars['$imcat2migrate.selected'] = imCatSelected;
    vars['$pmcat2migrate.selected'] = pmCatSelected;
    vars['$cat2migrate'] = allCat;
}


function prepareCategories2MigrateByDesc() {
    var sdCatSelected = [],
        imCatSelected = [],
        pmCatSelected = [],
        allCat = [];


    var category = new SCFile("sdCategory");
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        if (_.endsWith(category.description, AUTO_UPGRADED_SUFFIX_IN_DESC)) {
            sdCatSelected.push(category.name);
        }
        rc = category.getNext();
    }

    var category = new SCFile("imCategory");
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        if (_.endsWith(category.description, AUTO_UPGRADED_SUFFIX_IN_DESC)) {
            imCatSelected.push(category.name);
        }
        rc = category.getNext();
    }

    var category = new SCFile("pbmCategory");
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        if (_.endsWith(category.description, AUTO_UPGRADED_SUFFIX_IN_DESC)) {
            pmCatSelected.push(category.name);
        }
        rc = category.getNext();
    }

    vars['$sdcat2migrate.selected'] = sdCatSelected;
    vars['$imcat2migrate.selected'] = imCatSelected;
    vars['$pmcat2migrate.selected'] = pmCatSelected;
}


/**
 * Incident and Service Desk category, both are from category table.
 * During upgrade,the function called in both testing Env and production Env, need diffrent logic.
 *  @param 	{String} 	callInProduction 	        -  flag about whether function is called in production
 */
function migrateIncidentCategories(callInProduction) {
    //0. check any new fields in customer's legacy category dbdict, and auto add to pd category dbdict.
    //   menwhile also check the keys, for e.g., the whether the unique key has more fields (like company field).
    //   -- unique key has more fields does not handle here, the company as unique is added in OOB.
    //   also need to compare the field length, enlarge the pd category dbdict fields if necessary
    var oobCategoryFields = ["name", "activity", "open.format", "update.format", "close.format", "count",
        "alert1", "alert2", "alert3", "reassign", "default.assign", "avail.post",
        "qbe.format", "dl.alert", "dl.group", "alert1.expression", "alert2.expression",
        "alert3.expression", "dl.expression", "reass.expression", "print.override", "print.open",
        "print.open.format", "print.update", "print.update.format", "print.close",
        "print.close.format", "alert.pages", "initial.format", "check.duplicates",
        "check.parents", "device.types", "include.unexpired", "expires.after",
        "script", "browse.format", "review.print.formats", "open.print.formats",
        "update.print.formats", "close.print.formats", "assignment.expression",
        "category.format", "wdClsDuration", "wdUD1", "wdUD2", "wdPriority",
        "wdClsCustSatisfaction", "wdClsActDuration", "wdClsRoot", "wdClsLevel",
        "wdClsParent", "wdClsInflatePriority", "wdClsTimeStamp", "wdTips", "print.format",
        "active", "sysmodcount", "sysmoduser", "sysmodtime", "copy.open.link", "company",
        "engine.alerts", "approvals"
    ];
    var categoryFieldsMapping = { // the mapping fields from PD category to non-PD category fields for character type which will be used to enlarge the length if necessary
        name: "name",
        company: "company"
    };
    if (!callInProduction) { //Do not run in product,dbdict is ready in testing and applied to production 
        var addedFieldsOfCategory = lib.PDCodeMigrationUtil.migrateDbdict("category", "imCategory", oobCategoryFields, categoryFieldsMapping);
        lib.PDCodeMigrationUtil.migrateDbdict("category", "sdCategory", oobCategoryFields, categoryFieldsMapping);
        lib.PDCodeMigrationUtil.enlargeFieldLength("pbmCategory", "description", 250);
        lib.PDCodeMigrationUtil.migrateDbdict("category", "pbmCategory", oobCategoryFields, categoryFieldsMapping);
        var oobSubcategoryFields = ["category", "subcategory", "subcategory.name", "description", "company",
            "active", "sysmodcount", "sysmoduser", "sysmodtime"
        ];
        var subcategoryFieldsMapping = { // the mapping fields from PD category to non-PD category fields for character type which will be used to enlarge the length if necessary
            "subcategory.name": "subcategory",
            "name": "subcategory", //this is only added for sdSucategory as it's field name is name rather than subcategory.name in pbmSubcategory and imSubcategory
            category: "category",
            company: "company"
        };
        var addedFieldsOfSubcategory = lib.PDCodeMigrationUtil.migrateDbdict("subcategory", "imSubcategory", oobSubcategoryFields, subcategoryFieldsMapping);
        lib.PDCodeMigrationUtil.migrateDbdict("subcategory", "sdSubcategory", oobSubcategoryFields, subcategoryFieldsMapping);
        lib.PDCodeMigrationUtil.migrateDbdict("subcategory", "pbmSubcategory", oobSubcategoryFields, subcategoryFieldsMapping);
        var oobAreaFields = ["category", "subcategory", "product.type", "description", "company", "active", "sysmodcount", "sysmodtime", "sysmoduser"];
        var areaFieldsMapping = { // the mapping fields from PD category to non-PD category fields for character type which will be used to enlarge the length if necessary
            "area.name": "product.type",
            subcategory: "subcategory",
            category: "category",
            company: "company"
        };
        var addedFieldsOfArea = lib.PDCodeMigrationUtil.migrateDbdict("producttype", "imArea", oobAreaFields, areaFieldsMapping);
        lib.PDCodeMigrationUtil.enlargeFieldLength("sdArea", "description", 250);
        lib.PDCodeMigrationUtil.migrateDbdict("producttype", "sdArea", oobAreaFields, areaFieldsMapping);
        lib.PDCodeMigrationUtil.migrateDbdict("producttype", "pbmArea", oobAreaFields, areaFieldsMapping);
    }

    //1. clean up the PD category tables (sdCategory and imCategory)
    if (!callInProduction) { //Do not run in product,conflict PD category already renamed in testing and moved to produciton.         
        if (OPTION == OPT2) {
            renameOOBCategoryIfConflict();
        } else {
            deleteRecords("sdCategory", 'true');
            deleteRecords("sdSubcategory", 'true');
            deleteRecords("sdArea", 'true');
            deleteRecords("imCategory", 'true');
            deleteRecords("imSubcategory", 'true');
            deleteRecords("imArea", 'true');
            deleteRecords("pbmCategory", 'true');
            deleteRecords("pbmSubcategory", 'true');
            deleteRecords("pbmArea", 'true');
        }
    }

    //1.1. prepare the categories to be migrated.
    if (!vars['$cat2migrate']) {
        if (callInProduction) //In production, we get the list of categories migrated by its description
        {
            prepareCategories2MigrateByDesc();
        } else {
            prepareCategories2Migrate();
        }
    }
    var sdcat2Migrate = vars['$sdcat2migrate.selected'].toArray();
    var imcat2Migrate = vars['$imcat2migrate.selected'].toArray();
    var pmcat2Migrate = vars['$pmcat2migrate.selected'].toArray();

    //1.2. calculate shareflag of the categoires to be migrated.
    var shareFlags = {};
    var catArrs = [sdcat2Migrate, imcat2Migrate, pmcat2Migrate];
    var weights = [1, 2, 4];
    var i, j;
    for (i = 0; i < catArrs.length; ++i) {
        if (catArrs[i] == null) {
            continue;
        }
        for (j = 0; j < catArrs[i].length; ++j) {
            var catName = catArrs[i][j];
            if (catName) {
                shareFlags[catName] = shareFlags[catName] ? shareFlags[catName] + weights[i] : weights[i];
            }
        }
    }
    var shareFlagMap = {
        1: 0, //interaction only
        2: 1, //Incident only
        3: 3, //SD&IM
        4: 2, //PM only
        5: 5, //SD &PM
        6: null, //IM&PM,not valid
        7: 4 //SD&IM&PM
    };
    var catIndex;
    for (catIndex in shareFlags) {
        shareFlags[catIndex] = shareFlagMap[shareFlags[catIndex]];
    }

    // set trigger on to make sure the related scmsg for name localization could be auto generated
    var ret = 0;
    var triggerStatus = system.functions.sysinfo_get("trigger");
    system.functions.rtecall("trigger", ret, 1);

    //2. add into PD category tables
    var item;
    var changedFiles = [];
    if (!callInProduction) //Do not run in product,categoies already migrated in testing Env and moved to production
    {
        var category = new SCFile("category");
        var rc = category.doSelect('true');
        while (rc == RC_SUCCESS) {

            if (lib.ArrayUtil.contains(imcat2Migrate, category.name)) {
                printIt("Adding category \"" + category.name + "\" to table \"imCategory\"...");
                changedFiles.push(category.name);
                var imCategory = new SCFile("imCategory");
                imCategory.name = category.name;
                imCategory.sharedflag = shareFlags[category.name];
                imCategory.active = category.active;
                imCategory.avail_post = category.avail_post;
                imCategory.description = category.name + AUTO_UPGRADED_SUFFIX_IN_DESC;
                imCategory.workflow = PD_CODE_MIGRATION_WF_PREFIX + "Incident";
                imCategory.company = category.company;
                for (item in addedFieldsOfCategory) {

                    imCategory[item] = category[item];
                }
                imCategory.doInsert();
                addMigrationPatchRecord("imCategory", imCategory, imCategory["name"], false);
                printIt("Added category \"" + category.name + "\" to table \"imCategory\".");
            }

            if (lib.ArrayUtil.contains(sdcat2Migrate, category.name)) {
                printIt("Adding category \"" + category.name + "\" to table \"sdCategory\"...");
                var sdCategory = new SCFile("sdCategory");
                sdCategory.name = category.name;
                sdCategory.sharedflag = shareFlags[category.name];
                sdCategory.active = category.active;
                //for the shared cateogry, set allow escalate default as true.
                sdCategory.escalate = (sdCategory.sharedflag == 3 || sdCategory.sharedflag == 5 || sdCategory.sharedflag == 4) ? true : null;
                sdCategory.description = category.name + AUTO_UPGRADED_SUFFIX_IN_DESC;
                sdCategory.workflow = PD_CODE_MIGRATION_WF_PREFIX + "ServiceDesk";
                sdCategory.approvals = category.approvals;
                sdCategory.company = category.company;
                for (item in addedFieldsOfCategory) {
                    sdCategory[item] = category[item];
                }
                sdCategory.doInsert();
                addMigrationPatchRecord("sdCategory", sdCategory, sdCategory["name"], false);
                printIt("Added category \"" + category.name + "\" to table \"sdCategory\"...");
            }
            if (lib.ArrayUtil.contains(pmcat2Migrate, category.name)) {
                printIt("Adding category \"" + category.name + "\" to table \"pbmCategory\"...");
                var pbmCategory = new SCFile("pbmCategory");
                pbmCategory.name = category.name;
                pbmCategory.sharedflag = shareFlags[category.name];
                pbmCategory.active = pbmCategory.name == "problem" ? true : category.active;
                pbmCategory.description = category.name + AUTO_UPGRADED_SUFFIX_IN_DESC;
                pbmCategory.workflow = "Problem";
                pbmCategory.company = category.company;
                for (item in addedFieldsOfCategory) {
                    pbmCategory[item] = category[item];
                }
                pbmCategory.doInsert();
                addMigrationPatchRecord("pbmCategory", pbmCategory, pbmCategory["name"], false);
                printIt("Added category \"" + category.name + "\" to table \"pbmCategory\"...");
            }

            rc = category.getNext();
        }
        var reportObj = {};
        reportObj.title = "The following category records and their corresponding subcategory/producttype records" + " are migrated to the Process Designer-based Incident related category tables(imCategory,imSubcategory and imArea)." + "Meanwhile the conflicted Process Designer-based OOB category records are renamed with suffix \"" + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\":";
        reportObj.files = imcat2Migrate;
        reportObj.needManualCheck = false;
        reportObj.category = "Category";
        reportObj.filename = "category";

        SUMMARY_REPORT_OBJS.push(reportObj);
        reportObj = {};
        reportObj.title = "The following category records and their subcategory/producttype records" + " are migrated to the Process Designer-based Interaction related category tables(sdCategory,sdSubcategory and sdArea)." + "Meanwhile the conflicted Process Designer-based OOB category records are renamed with suffix \"" + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\":";
        reportObj.files = sdcat2Migrate;
        reportObj.needManualCheck = false;
        reportObj.category = "Category";
        reportObj.filename = "category";

        SUMMARY_REPORT_OBJS.push(reportObj);
        reportObj = {};
        reportObj.title = "The following category records and their subcategory/producttype records" + " are migrated to the Process Designer-based Problem related category tables(pbmCategory,pbmSubcategory and pbmArea)." + "Meanwhile the conflicted Process Designer-based OOB category records are renamed with suffix \"" + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\":";
        reportObj.files = pmcat2Migrate;
        reportObj.needManualCheck = false;
        reportObj.category = "Category";
        reportObj.filename = "category";

        SUMMARY_REPORT_OBJS.push(reportObj);
    }

    //3. add into PD subcategory tables
    var subcategory = new SCFile("subcategory");
    var rc = subcategory.doSelect('true');
    while (rc == RC_SUCCESS) {

        if (lib.ArrayUtil.contains(imcat2Migrate, subcategory.category)) {
            printIt("Adding subcategory \"" + subcategory.subcategory + "\" to table \"imSubcategory\"...");
            var imSubcategory = new SCFile("imSubcategory");
            imSubcategory.subcategory_name = subcategory.subcategory;
            imSubcategory.category = subcategory.category;
            imSubcategory.sharedflag = shareFlags[subcategory.category];
            imSubcategory.active = subcategory.active;
            imSubcategory.description = subcategory.subcategory + AUTO_UPGRADED_SUFFIX_IN_DESC;
            imSubcategory.company = subcategory.company;
            for (item in addedFieldsOfSubcategory) {
                imSubcategory[item] = subcategory[item];
            }
            imSubcategory.doSave(); //Use doSave instead of doInsert, in Production, the subcategory may already migrated in testing Env and moved to production
            addMigrationPatchRecord("imSubcategory", imSubcategory, imSubcategory.subcategory_name, false);
            printIt("Added subcategory \"" + subcategory.subcategory + "\" to table \"imSubcategory\".");
        }
        if (lib.ArrayUtil.contains(sdcat2Migrate, subcategory.category)) {
            printIt("Adding subcategory \"" + subcategory.subcategory + "\" to table \"sdSubcategory\"...");
            var sdSubcategory = new SCFile("sdSubcategory");
            sdSubcategory.name = subcategory.subcategory;
            sdSubcategory.category = subcategory.category;
            sdSubcategory.sharedflag = shareFlags[subcategory.category];
            sdSubcategory.active = subcategory.active;
            sdSubcategory.description = subcategory.subcategory + AUTO_UPGRADED_SUFFIX_IN_DESC;
            sdSubcategory.company = subcategory.company;
            for (item in addedFieldsOfSubcategory) {
                sdSubcategory[item] = subcategory[item];
            }
            sdSubcategory.doSave();
            addMigrationPatchRecord("sdSubcategory", sdSubcategory, sdSubcategory.name, false);
            printIt("Added subcategory \"" + subcategory.subcategory + "\" to table \"sdSubcategory\"...");
        }
        if (lib.ArrayUtil.contains(pmcat2Migrate, subcategory.category)) {
            printIt("Adding subcategory \"" + subcategory.subcategory + "\" to table \"pbmSubcategory\"...");
            var pbmSubcategory = new SCFile("pbmSubcategory");
            pbmSubcategory.subcategory_name = subcategory.subcategory;
            pbmSubcategory.category = subcategory.category;
            pbmSubcategory.sharedflag = shareFlags[subcategory.category];
            pbmSubcategory.active = subcategory.active;
            pbmSubcategory.description = subcategory.subcategory + AUTO_UPGRADED_SUFFIX_IN_DESC;
            pbmSubcategory.company = subcategory.company;
            for (item in addedFieldsOfSubcategory) {
                pbmSubcategory[item] = subcategory[item];
            }
            pbmSubcategory.doSave();
            addMigrationPatchRecord("pbmSubcategory", pbmSubcategory, pbmSubcategory.subcategory_name, false);
            printIt("Added subcategory \"" + subcategory.subcategory + "\" to table \"pbmSubcategory\"...");
        }

        rc = subcategory.getNext();
    }

    //4. add into PD area tables
    var producttype = new SCFile("producttype");
    var rc = producttype.doSelect('true');
    while (rc == RC_SUCCESS) {

        if (lib.ArrayUtil.contains(imcat2Migrate, producttype.category)) {
            printIt("Adding area \"" + producttype.product_type + "\" to table \"imArea\"...");
            var imArea = new SCFile("imArea");
            imArea.area_name = producttype.product_type;
            imArea.category = producttype.category;
            imArea.subcategory = producttype.subcategory;
            imArea.sharedflag = shareFlags[producttype.category];
            imArea.active = producttype.active;
            imArea.description = producttype.product_type + AUTO_UPGRADED_SUFFIX_IN_DESC;
            imArea.company = producttype.company;
            for (item in addedFieldsOfArea) {
                imArea[item] = producttype[item];
            }
            imArea.doSave();
            addMigrationPatchRecord("imArea", imArea, imArea.area_name, false);
            printIt("Added area \"" + producttype.product_type + "\" to table \"imArea\".");
        }
        if (lib.ArrayUtil.contains(sdcat2Migrate, producttype.category)) {
            printIt("Adding area \"" + producttype.product_type + "\" to table \"sdArea\"...");
            var sdArea = new SCFile("sdArea");
            sdArea.area_name = producttype.product_type;
            sdArea.category = producttype.category;
            sdArea.subcategory = producttype.subcategory;
            sdArea.sharedflag = shareFlags[producttype.category];
            sdArea.active = producttype.active;
            sdArea.description = producttype.product_type + AUTO_UPGRADED_SUFFIX_IN_DESC;
            sdArea.company = producttype.company;
            for (item in addedFieldsOfArea) {
                sdArea[item] = producttype[item];
            }
            sdArea.doSave();
            addMigrationPatchRecord("sdArea", sdArea, sdArea.area_name, false);
            printIt("Added area \"" + producttype.product_type + "\" to table \"sdArea\"...");
        }
        if (lib.ArrayUtil.contains(pmcat2Migrate, producttype.category)) {
            printIt("Adding area \"" + producttype.product_type + "\" to table \"pbmArea\"...");
            var pbmArea = new SCFile("pbmArea");
            pbmArea.area_name = producttype.product_type;
            pbmArea.category = producttype.category;
            pbmArea.subcategory = producttype.subcategory;
            pbmArea.sharedflag = shareFlags[producttype.category];
            pbmArea.active = producttype.active;
            pbmArea.description = producttype.product_type + AUTO_UPGRADED_SUFFIX_IN_DESC;
            pbmArea.company = producttype.company;
            for (item in addedFieldsOfArea) {
                pbmArea[item] = producttype[item];
            }
            pbmArea.doSave();
            addMigrationPatchRecord("pbmArea", pbmArea, pbmArea.area_name, false);
            printIt("Added area \"" + producttype.product_type + "\" to table \"pbmArea\"...");
        }

        rc = producttype.getNext();
    }
    system.functions.rtecall("trigger", ret, triggerStatus); // set trigger back

    //5. auto check mandaten setting for category tables
    var mandantenMap = {
        "category": ["imCategory", "sdCategory", "pbmCategory"],
        "subcategory": ["imSubcategory", "sdSubcategory", "pbmSubcategory"],
        "producttype": ["imArea", "sdArea", "pbmArea"]
    };
    migrationMandaten(mandantenMap);
}


function migrationMandaten(mandantenMap) {
    printIt("Start migrating mandanten...", true);
    for (fileName in mandantenMap) {
        var newFiles = mandantenMap[fileName];
        printIt("Migrating mandanten field for table \"" + fileName + "\"...");
        var mandantFile = $("scmandant", SCFILE_READONLY).select("filename=\"" + fileName + "\"").uniqueResult();
        if (mandantFile == null) {
            printIt("Can not find mandant for file \"" + fileName + "\", ignore it.");
            continue;
        }

        for (var i = 0, len = newFiles.length; i < len; i++) {
            var checkExistFile = $("scmandant", SCFILE_READONLY).select("filename=\"" + newFiles[i] + "\"").uniqueResult();
            if (checkExistFile != null) {
                printIt("The mandanten field for new file \"" + newFiles[i] + "\" already exists, ignore it.");
                continue;
            }
            var newFile = new SCFile("scmandant");
            newFile.filename = newFiles[i];
            newFile["fieldname"] = mandantFile["fieldname"];
            newFile["linkage.field"] = mandantFile["linkage.field"];
            newFile["source.filename"] = mandantFile["source.filename"];
            newFile["source.fieldname"] = mandantFile["source.fieldname"];
            newFile["excludename"] = mandantFile["excludename"];
            newFile.doInsert();
            addMigrationPatchRecord("scmandant", newFile, newFile["filename"], false);
            printIt("The mandanten field for new file \"" + newFiles[i] + "\" is added.");
        }
        printIt("Migrated mandanten field for table \"" + fileName + "\".");

        printIt("Migrating mandanten query for table \"" + fileName + "\"...");
        var scaccess = new SCFile("scaccess", SCFILE_READONLY);
        var rc = scaccess.doSelect('filename="' + fileName + '"');
        while (rc == RC_SUCCESS) {
            for (var i = 0, len = newFiles.length; i < len; i++) {
                var checkExistFile = $("scaccess", SCFILE_READONLY).select("filename=\"" + newFiles[i] + "\" and security.id=\"" + scaccess["security.id"] + "\"").uniqueResult();
                if (checkExistFile != null) {
                    printIt("The mandanten query for new file \"" + newFiles[i] + "\" with security group \"" + scaccess["security.id"] + "\" already exists, ignore it.");
                    continue;
                }
                var newFile = new SCFile("scaccess");
                newFile.filename = newFiles[i];
                newFile["security.id"] = scaccess["security.id"];
                newFile["restricting.query"] = scaccess["restricting.query"];
                newFile.doInsert();
                addMigrationPatchRecord("scaccess", newFile, newFile["filename"], false);
                printIt("The mandanten query for new file \"" + newFiles[i] + "\" with security group \"" + scaccess["security.id"] + "\" is added.");
            }


            rc = scaccess.getNext();
        }

        printIt("Migrated mandanten query for table \"" + fileName + "\".");
    }
    printIt("Finished migrating mandanten.", true);
}

function renameOOBCategoryIfConflict() {
    //1. retrieve all legacy category records
    var legacyCategies = [];
    var category = new SCFile("category");
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        legacyCategies.push(category.name);
        rc = category.getNext();
    }
    printIt("The legacy categories:" + legacyCategies);

    //2. check PD incident categories
    printIt("Checking conflict imCategories...");
    renameConflictCategories("imCategory", "imSubcategory", "imArea", legacyCategies);

    //3. check PD service desk categories
    printIt("Checking conflict sdCategories...");
    renameConflictCategories("sdCategory", "sdSubcategory", "sdArea", legacyCategies);

    //3. check PD problem categories
    printIt("Checking conflict pbmCategories...");
    renameConflictCategories("pbmCategory", "pbmSubcategory", "pbmArea", legacyCategies);
}

function renameConflictCategories(catFileName, subCatFileName, areaFileName, legacyCategies) {
    var category = new SCFile(catFileName);
    var rc = category.doSelect('true');
    while (rc == RC_SUCCESS) {
        printIt("Checking " + catFileName + " \"" + category["name"] + "\"");
        if (!_.endsWith(category["name"], PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX) && containsInArray(legacyCategies, category["name"])) {
            if ($(catFileName, SCFILE_READONLY).select("name=\"" + category["name"] + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\"").uniqueResult() == null) {
                printIt("Updating " + catFileName + " \"" + category["name"] + "\" to name \"" + category["name"] + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\"...");
                var oldCategoryName = category["name"];
                // rename the category name if conflict
                category["name"] = category["name"] + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX;
                category.doUpdate();
                addMigrationPatchRecord(catFileName, category, category["name"], false);
                printIt("Updated " + catFileName + " \"" + category["name"] + "\" to name \"" + category["name"] + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\".");

                // the subcategies and area should be updated by trigger while updating the category, below code just in case trigger is disabled
                // rename the related subcategory's category name
                var subcategory = new SCFile(subCatFileName);
                var rcSubcategory = subcategory.doSelect('category="' + oldCategoryName + '"');
                while (rcSubcategory == RC_SUCCESS) {
                    printIt("Updating " + subCatFileName + " \"" + subcategory.subcategory_name + "\"'s category name to \"" + oldCategoryName + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\"...");
                    subcategory.category = oldCategoryName + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX;
                    subcategory.doUpdate();
                    addMigrationPatchRecord(subCatFileName, subcategory, subcategory.subcategory_name, false);
                    printIt("Updated " + subCatFileName + " \"" + subcategory.subcategory_name + "\"'s category name to \"" + oldCategoryName + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\".");

                    rcSubcategory = subcategory.getNext();
                }
                // rename the related area's category name
                var area = new SCFile(areaFileName);
                var rcArea = area.doSelect('category="' + oldCategoryName + '"');
                while (rcArea == RC_SUCCESS) {
                    printIt("Updating " + areaFileName + " \"" + area.area_name + "\"'s category name to \"" + oldCategoryName + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\"...");
                    area.category = oldCategoryName + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX;
                    area.doUpdate();
                    addMigrationPatchRecord(areaFileName, area, area.area_name, false);
                    printIt("Updated " + areaFileName + " \"" + area.area_name + "\"'s category name to \"" + oldCategoryName + PD_CODE_MIGRATION_CAT_RENAMED_SUFFIX + "\".");

                    rcArea = area.getNext();
                }
            }
        }

        rc = category.getNext();
    }
}

function containsInArray(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }

    return false;
}

function deleteRecords(fileName, query) {
    printIt("Purging records in table \"" + fileName + "\"...");
    var file = new SCFile(fileName);
    /*
    var rc = file.doSelect(query);
    while(rc == RC_SUCCESS) {
        file.doDelete();
        rc = file.getNext();
    }
    */
    file.doPurge(query);
    printIt("Purged records in table \"" + fileName + "\".");

    return;
}

/**
 * Merge the link lines from newest OOB to customized one, which will
 *   . handle the category/subcategory/product.type link lines specifically to refer to PD category related tables
 *   . merge the new link lines in newest OOB link to customized link.
 *
 * @param {array of String}
 *            fileNames - The HelpDesk file names.
 *
 * @return
 */
function mergeMasterLinkLines(fileNames) {
    var retChangedLinks = [];
    if (fileNames == null) {
        return;
    }
    for (var i = 0, len = fileNames.length; i < len; i++) {
        var fileName = fileNames[i];
        if (fileName == null || fileName == "") { // ignore the empty link name
            continue;
        }

        // to link is the customized link
        var toLink = $("link").select("name=\"" + fileName + "\"").uniqueResult();
        if (null == toLink) {
            printIt("The link \"" + fileName + "\" can not be found, ignore the merge from OOB to customized Link!");
            continue;
        }
        // from link is the newest OOB link which is renamed by upgrade tool if the link is customized
        var fromLink = $("link", SCFILE_READONLY).select("name=\"" + UPGRADE_PREFIX + fileName + "\"").uniqueResult();
        if (null == fromLink) {
            printIt("The link \"" + fileName + "\" is not customized, ignore the merge from OOB to customized Link!");
            continue;
        }

        // backup the orginal link
        var linkBak = $("link").select("name=\"" + fileName + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
        if (null != linkBak) { // the backup link already exists, ignore the backup
            printIt("The backup of the link " + fileName + " exists already, ignore the backup.");
        } else { // backup the link
            var linkBak = $("link").select("name=\"" + fileName + "\"").uniqueResult();
            linkBak.name = fileName + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            linkBak.doInsert();
            printIt("The link " + fileName + " is backuped to " + fileName + PD_CODE_MIGRATION_DISABLE_SUFFIX);
        }

        // special handle for category related link lines
        toLink = $("link").select("name=\"" + fileName + "\"").uniqueResult();
        var toLinkChangedFlag1 = handleCategoryRelatedLinkLines(fromLink, toLink);

        // get new link lines in OOB newest link, and merge to customized link
        toLink = $("link").select("name=\"" + fileName + "\"").uniqueResult();
        var diffFieldArray = getDiffItems(fromLink["source.fields"], toLink["source.fields"]);

        if (toLinkChangedFlag1 || (diffFieldArray !== null && diffFieldArray.length > 0)) { // backup the orginal link
            var linkBak = $("link").select("name=\"" + fileName + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
            if (null != linkBak) { // the backup link already exists, ignore the backup
                printIt("The backup of the link " + fileName + " exists already, ignore the backup.");
            } else { // backup the link
                var linkBak = $("link").select("name=\"" + fileName + "\"").uniqueResult();
                linkBak.name = fileName + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                linkBak.doInsert();
                printIt("The link " + fileName + " is backuped to " + fileName + PD_CODE_MIGRATION_DISABLE_SUFFIX);
            }
        }

        if (diffFieldArray !== null && diffFieldArray.length > 0) {
            toLink = $("link").select("name=\"" + fileName + "\"").uniqueResult();
            utilMigrateLinkLineByLink(fromLink, toLink, diffFieldArray);
        }
        if (toLinkChangedFlag1 || (diffFieldArray !== null && diffFieldArray.length > 0)) {
            retChangedLinks.push(fileName);
        }
    }

    return retChangedLinks;
}

/**
 *
 * @return boolean true if the toLink is changed
 */
function handleCategoryRelatedLinkLines(fromLink, toLink) {
    var retFlag = false;
    for (var i = 0, len = fromLink["source.fields"].length(); i < len; i++) {
        if (fromLink["source.fields"][i] === "category" && fromLink["target.files"][i] === "category") {
            fromLink["source.fields"][i] = fromLink["source.fields"][i] + PD_CODE_MIGRATION_DISABLE_SUFFIX;
        } else if (fromLink["source.fields"][i] === "category" + PD_ENABLEMENT_TOBE_USED_SUFFIX && fromLink["target.files"][i] !== "category") {
            fromLink["source.fields"][i] = "category";
        } else if (fromLink["source.fields"][i] === "subcategory" && fromLink["target.files"][i] === "subcategory") {
            fromLink["source.fields"][i] = fromLink["source.fields"][i] + PD_CODE_MIGRATION_DISABLE_SUFFIX;
        } else if (fromLink["source.fields"][i] === "subcategory" + PD_ENABLEMENT_TOBE_USED_SUFFIX && fromLink["target.files"][i] !== "subcategory") {
            fromLink["source.fields"][i] = "subcategory";
        } else if (fromLink["source.fields"][i] === "product.type" && fromLink["target.files"][i] === "producttype") {
            fromLink["source.fields"][i] = fromLink["source.fields"][i] + PD_CODE_MIGRATION_DISABLE_SUFFIX;
        } else if (fromLink["source.fields"][i] === "product.type" + PD_ENABLEMENT_TOBE_USED_SUFFIX && fromLink["target.files"][i] !== "producttype") {
            fromLink["source.fields"][i] = "product.type";
        }
    }

    for (var i = 0, len = toLink["source.fields"].length(); i < len; i++) {
        if (toLink["source.fields"][i] === "category" && toLink["target.files"][i] === "category") {
            toLink["source.fields"][i] = toLink["source.fields"][i] + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            retFlag = true;
        } else if (toLink["source.fields"][i] === "subcategory" && toLink["target.files"][i] === "subcategory") {
            toLink["source.fields"][i] = toLink["source.fields"][i] + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            retFlag = true;
        } else if (toLink["source.fields"][i] === "product.type" && toLink["target.files"][i] === "producttype") {
            toLink["source.fields"][i] = toLink["source.fields"][i] + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            retFlag = true;
        }
    }
    if (retFlag) {
        toLink.doUpdate();
        addMigrationPatchRecord("link", toLink, toLink["name"], false);
    }

    return retFlag;
}

/**
 * This util is help to copy the link line from 1 link to another, ususally it will be used
 * while customer upgrades their system as current upgrade merge tool is not smart enough.
 */
function utilMigrateLinkLineByName(fromLinkName, toLinkName, linkLines) {
    var fromLink = $("link", SCFILE_READONLY).select("name=\"" + fromLinkName + "\"").uniqueResult();
    if (null == fromLink) {
        printIt("The from link can not be found, ignore!");
        return;
    }
    var toLink = $("link").select("name=\"" + toLinkName + "\"").uniqueResult();
    if (null == toLink) {
        printIt("The to link can not be found, ignore!");
        return;
    }
    utilMigrateLinkLineByLink(fromLink, toLink, linkLines);
}

function utilMigrateLinkLineByLink(fromLink, toLink, linkLines) {
    printIt("Start migrating linklines from " + fromLink.name + " to " + toLink.name + "...");
    if (null == linkLines || linkLines.length == 0) {
        printIt("You do not specify any diff link lines, ignore!");
        return;
    }
    vars["$L.from.link"] = fromLink;
    vars["$L.to.link"] = toLink;

    var fromLinkLineLen = fromLink["source.fields"].length();
    for (var i = 0, len = linkLines.length; i < len; i++) {
        printIt("Migrating linkline " + linkLines[i] + "...");
        var fromIdx = getItemIndexInSMArray(fromLink["source.fields"], linkLines[i]);
        if (-1 == fromIdx) {
            printIt("The link line " + linkLines[i] + " can not be found in from link, ignore!");
            continue;
        }
        var toIdx = getItemIndexInSMArray(toLink["source.fields"], linkLines[i]);
        if (toIdx > -1) {
            printIt("The link line " + linkLines[i] + " already exists in to link, ignore!");
            continue;
        }
        var currentToLinkLineLen = toLink["source.fields"].length();
        /*
        if(currentToLinkLineLen>0
          && (toLink["source.fields"][currentToLinkLineLen]==null||toLink["source.fields"][currentToLinkLineLen]=="")) {
            currentToLinkLineLen--;
        }
        */

        /*
        toLink["source.fields"][currentToLinkLineLen] = fromLink["source.fields"][fromIdx];
        toLink["target.files"][currentToLinkLineLen] = fromLink["target.files"][fromIdx];
        toLink["target.fields"][currentToLinkLineLen] = fromLink["target.fields"][fromIdx];
        toLink["comment"][currentToLinkLineLen] = fromLink["comment"][fromIdx];
        toLink["add.query"][currentToLinkLineLen] = fromLink["add.query"][fromIdx];// always store string type of this field????
        toLink["qbe.format"][currentToLinkLineLen] = fromLink["qbe.format"][fromIdx];
        toLink["sort.fields"][currentToLinkLineLen] = fromLink["sort.fields"][fromIdx];
        toLink["project.source.fields"][currentToLinkLineLen] = fromLink["project.source.fields"][fromIdx];
        toLink["project.target.fields"][currentToLinkLineLen] = fromLink["project.target.fields"][fromIdx];
        toLink["link.expressions"][currentToLinkLineLen] = fromLink["link.expressions"][fromIdx];
        toLink["post.expressions"][currentToLinkLineLen] = fromLink["post.expressions"][fromIdx];
        toLink["structure"][currentToLinkLineLen] = fromLink["structure"][fromIdx];
        toLink["target.formats"][currentToLinkLineLen] = fromLink["target.formats"][fromIdx];
        toLink["javascript.pre"][currentToLinkLineLen] = fromLink["javascript.pre"][fromIdx];
        toLink["javascript.post"][currentToLinkLineLen] = fromLink["javascript.post"][fromIdx];
        toLink["target.sort.field"][currentToLinkLineLen] = fromLink["target.sort.field"][fromIdx];
        toLink["target.sort.order"][currentToLinkLineLen] = fromLink["target.sort.order"][fromIdx];
        */
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in source.fields in $L.to.link = " + (fromIdx + 1) + " in source.fields in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in target.files in $L.to.link = " + (fromIdx + 1) + " in target.files in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in target.fields in $L.to.link = " + (fromIdx + 1) + " in target.fields in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in comment in $L.to.link = " + (fromIdx + 1) + " in comment in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in add.query in $L.to.link = " + (fromIdx + 1) + " in add.query in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in qbe.format in $L.to.link = " + (fromIdx + 1) + " in qbe.format in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in sort.fields in $L.to.link = " + (fromIdx + 1) + " in sort.fields in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in project.source.fields in $L.to.link = " + (fromIdx + 1) + " in project.source.fields in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in project.target.fields in $L.to.link = " + (fromIdx + 1) + " in project.target.fields in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in link.expressions in $L.to.link = " + (fromIdx + 1) + " in link.expressions in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in post.expressions in $L.to.link = " + (fromIdx + 1) + " in post.expressions in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in structure in $L.to.link = " + (fromIdx + 1) + " in structure in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in target.formats in $L.to.link = " + (fromIdx + 1) + " in target.formats in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in javascript.pre in $L.to.link = " + (fromIdx + 1) + " in javascript.pre in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in javascript.post in $L.to.link = " + (fromIdx + 1) + " in javascript.post in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in target.sort.field in $L.to.link = " + (fromIdx + 1) + " in target.sort.field in $L.from.link", 11);
        system.functions.parse_evaluate((currentToLinkLineLen + 1) + " in target.sort.order in $L.to.link = " + (fromIdx + 1) + " in target.sort.order in $L.from.link", 11);

        printIt("Finish linkline " + linkLines[i] + "...");
    }
    toLink.doUpdate();
    addMigrationPatchRecord("link", toLink, toLink["name"], false);

    printIt("Finish migrating linklines from " + fromLink.name + " to " + toLink.name + ".");
}

function getItemIndexInSMArray(sourceFields, linkLineName) {
    var ret = -1;
    for (var i = 0, len = sourceFields.length(); i < len; i++) {
        if (sourceFields[i] == linkLineName) {
            ret = i;
            break;
        }
    }

    return ret;
}

/**
 * Change the validation against non-PD category related tables to PD related tables.
 *
 * @param {array of String}
 *            fileNames - The HelpDesk file names which need to be handled.
 *
 * @return
 */
function migrateValidity(pdCategoryMap) {
    // make sure the related field names in pd category table should keep consistent as non-PD
    // such changes are not put into OOB because the changes are only useful for PD wrapper customers.
    // the PD subcategory talbes, need to add alias subcategory.name
    lib.PDCodeMigrationUtil.addFieldAliasName("imSubcategory", "subcategory.name", "subcategory");
    lib.PDCodeMigrationUtil.addFieldAliasName("sdSubcategory", "name", "subcategory");
    lib.PDCodeMigrationUtil.addFieldAliasName("pbmSubcategory", "subcategory.name", "subcategory");
    // the PD area tables, need to add alias on area.name
    lib.PDCodeMigrationUtil.addFieldAliasName("imArea", "area.name", "product.type");
    lib.PDCodeMigrationUtil.addFieldAliasName("sdArea", "area.name", "product.type");
    lib.PDCodeMigrationUtil.addFieldAliasName("pbmArea", "area.name", "product.type");

    var retArray = [];
    var validity = new SCFile("validity");

    var sql = 'query.file="category" or query.file="subcategory"  or query.file="producttype"';
    var rc = validity.doSelect(sql);
    while (rc == RC_SUCCESS) {
        var validityName = "Unique ID:" + validity.filename + ";Field Name:" + validity.field_name + ";Sequence:" + validity.sequence;

        // 0. ignore the backup record
        if (isIgnoreRecord(validity.filename, true) || isIgnoreRecord(validity.field_name, true)) {
            rc = validity.getNext();
            continue;
        }
        // and ignore the records which does not defined in the pdCategoryMap
        var categoryMap = null;
        for (var file in pdCategoryMap) {
            if (getItemIndexInSMArray(validity.files, file) > -1) {
                categoryMap = pdCategoryMap[file];
            }
        }
        if (categoryMap == null) {
            printIt("The validity record " + validityName + " is not in the handled files, ignore it!");
            rc = validity.getNext();
            continue;
        }

        // 1. backup
        var queryStr = buildValidityQuery(validity.filename + PD_CODE_MIGRATION_DISABLE_SUFFIX,
            validity.field_name + PD_CODE_MIGRATION_DISABLE_SUFFIX, validity.sequence);
        var validityBak = $("validity").select(queryStr).uniqueResult();
        if (null != validityBak) { // the backup validity already exists, ignore the backup
            printIt("The backup of the link " + linkName + " exists already, ignore the backup.");
        } else { // backup the validity
            queryStr = buildValidityQuery(validity.filename, validity.field_name, validity.sequence);
            var validityBak = $("validity").select(queryStr).uniqueResult();
            validityBak.filename = validity.filename + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            validityBak.field_name = validity.field_name + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            validityBak.doInsert();
            var validityBackupName = "Unique ID:" + validity.filename + PD_CODE_MIGRATION_DISABLE_SUFFIX + ";Field Name:" + validity.field_name + PD_CODE_MIGRATION_DISABLE_SUFFIX + ";Sequence:" + validity.sequence;
            printIt("The validity " + validityName + " is backuped to " + validityBackupName);
        }

        // 2. change validity and save
        validity.query_file = categoryMap[validity.query_file];
        validity.doUpdate();
        addMigrationPatchRecord("validity", validity, validityName, true);
        retArray.push(validityName);

        rc = validity.getNext();
    }

    return retArray;
}

function getRTEVersion() {
    var ret = system.functions.version();
    return ret[2].substring(0, 4);
}

function buildValidityQuery(uId, fieldName, sequence) {
    var query = "";
    if (uId == null) {
        query += "filename = NULL";
    } else {
        query += "filename=\"" + uId + "\"";
    }
    if (fieldName == null) {
        query += " and field.name = NULL";
    } else {
        query += " and field.name=\"" + fieldName + "\"";
    }
    if (sequence == null) {
        query += " and sequence = NULL";
    } else {
        query += " and sequence=\"" + sequence + "\"";
    }

    return query;
}

/**
 * Disable the category related link linkes in format level links.
 *   . handle the category/subcategory/product.type link lines to disable it.
 *
 * @param {array of String}
 *            fileNames - The HelpDesk file names which indicate the master link names.
 *
 * @return
 */
function disableCategoryLinkLinesInFormatLink(fileNames) {
    var retArray = [];
    var link = new SCFile("link");
    var sql = "true";
    var rc = link.doSelect(sql);
    while (rc == RC_SUCCESS) {
        var linkName = link.name;
        var isMasterLinkFlag = false;
        for (var i = 0, len = fileNames.length; i < len; i++) {
            if (linkName === fileNames[i]) { // exaectly the master link
                isMasterLinkFlag = true;
                break;
            }

            if (_.endsWith(linkName, PD_CODE_MIGRATION_DISABLE_SUFFIX) || _str.startsWith(linkName, "AUDIT")) {
                isMasterLinkFlag = true;
                break;
            }

            if ((_str.startsWith(linkName, "NEW") || _str.startsWith(linkName, "OLD") || _str.startsWith(linkName, "PRE")) && _.endsWith(linkName, fileNames[i])) { // the renamed master link
                isMasterLinkFlag = true;
                break;
            }
        }
        if (isMasterLinkFlag === false) {
            var linkChangedFlag = false;
            var sourceFields = link["source.fields"];
            var idx = getItemIndexInSMArray(sourceFields, "category");
            while (idx !== -1 && link["target.files"][idx] === "category") {
                link["source.fields"][idx] = "category" + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                linkChangedFlag = true;

                idx = getItemIndexInSMArray(sourceFields, "category");
            }
            idx = getItemIndexInSMArray(sourceFields, "subcategory");
            while (idx !== -1 && link["target.files"][idx] === "subcategory") {
                link["source.fields"][idx] = "subcategory" + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                linkChangedFlag = true;

                idx = getItemIndexInSMArray(sourceFields, "subcategory");
            }
            idx = getItemIndexInSMArray(sourceFields, "product.type");
            while (idx !== -1 && link["target.files"][idx] === "producttype") {
                link["source.fields"][idx] = "product.type" + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                linkChangedFlag = true;

                idx = getItemIndexInSMArray(sourceFields, "product.type");
            }

            if (linkChangedFlag === true) {
                var linkBak = $("link").select("name=\"" + linkName + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
                if (null != linkBak) { // the backup link already exists, ignore the backup
                    printIt("The backup of the link " + linkName + " exists already, ignore the backup.");
                } else { // backup the link
                    var linkBak = $("link").select("name=\"" + linkName + "\"").uniqueResult();
                    linkBak.name = linkName + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                    linkBak.doInsert();
                    printIt("The link " + linkName + " is backuped to " + linkName + PD_CODE_MIGRATION_DISABLE_SUFFIX);
                }

                link.doUpdate();
                addMigrationPatchRecord("link", link, link["name"], false);
                retArray.push(linkName);
            }
        }
        rc = link.getNext();
    }

    return retArray;
}


/**
 * Get the diff items which exists in 1st SM array but does not exist in 2nd SM Array.
 * @return the diff array with JS array type.
 */
function getDiffItems(smArray1, smArray2) {
    var retArray = [];
    if (null == smArray1) {
        return retArray;
    }
    if (null == smArray2) {
        return smArray1.toArray();
    }
    var item;
    for (var i = 0, len = smArray1.length(); i < len; i++) {
        item = smArray1[i];
        var flag = false;
        for (var j = 0, lenJ = smArray2.length(); j < lenJ; j++) {
            if (item == smArray2[j]) {
                flag = true;
                break;
            }
        }
        if (flag == false) {
            retArray.push(item);
        }
    }

    return retArray;
}

/**
 * Get the diff item positions of smArray1 which exists in 1st SM array but does not exist in 2nd SM Array.
 * @return the position array with JS array type.
 */
function getDiffItemPositions(smArray1, smArray2) {
    var retArray = [];
    if (null == smArray1) {
        return retArray;
    }
    var item;
    for (var i = 0, len = smArray1.length(); i < len; i++) {
        item = smArray1[i];
        var flag = false;
        for (var j = 0, lenJ = smArray2.length(); j < lenJ; j++) {
            if (item == smArray2[j]) {
                flag = true;
                break;
            }
        }
        if (flag == false) {
            retArray.push(i);
        }
    }

    return retArray;
}

/**
 * Get the positions of smArray1 which item is the same as expected value.
 * @return the position array with JS array type.
 */
function getSameItemPosition(smArray1, value) {
    var retPos = -1;
    if (null == smArray1) {
        return retPos;
    }
    var item;
    for (var i = 0, len = smArray1.length(); i < len; i++) {
        if (smArray1[i] == value) {
            retPos = i;
            break;
        }
    }

    return retPos;
}

function mergeArrayFieldValue(toFile, fromFile, fieldName, relatedFieldNames) {
    var customizedNewValuePositions = getDiffItemPositions(fromFile[fieldName], toFile[fieldName]);
    var valueLen = 0;
    if (null != toFile[fieldName]) {
        valueLen = toFile[fieldName].length();
    }
    // sync related fields from fromFile to toFile if exist
    if (relatedFieldNames != null) {
        for (var i = 0, len = toFile[fieldName].length(); i < len; i++) {
            var sameValuePosition = getSameItemPosition(fromFile[fieldName], toFile[fieldName][i]);
            if (sameValuePosition < 0) { // continue if not exist
                continue;
            }
            for (var j = 0; j < relatedFieldNames.length; j++) {
                toFile[relatedFieldNames[j]][i] = fromFile[relatedFieldNames[j]][sameValuePosition];
            }
        }
    }
    // append new fields
    for (var i = 0, len = customizedNewValuePositions.length; i < len; i++) {
        toFile[fieldName][valueLen] = fromFile[fieldName][customizedNewValuePositions[i]];
        if (relatedFieldNames != null) {
            for (var j = 0; j < relatedFieldNames.length; j++) {
                toFile[relatedFieldNames[j]][valueLen] = fromFile[relatedFieldNames[j]][customizedNewValuePositions[i]];
            }
        }
        valueLen++;
    }

    // remove the items which value of the fieldName is empty in toFile
    removeEmptyItemsFromArray(toFile, fieldName, relatedFieldNames);
}

function removeEmptyItemsFromArray(toFile, fieldName, relatedFieldNames) {
    var fieldValueArray = toFile[fieldName].toArray();
    var relatedFieldsValueObj = {};
    if (relatedFieldNames != null) {
        for (var i = 0; i < relatedFieldNames.length; i++) {
            relatedFieldsValueObj[relatedFieldNames[i]] = toFile[relatedFieldNames[i]].toArray();
        }
    }
    var removedFlag = false;
    if (null != fieldValueArray) {
        for (var i = fieldValueArray.length - 1; i >= 0; i--) {
            var itemValue = fieldValueArray[i];
            if (itemValue == "" || itemValue == null) {
                removedFlag = true;
                fieldValueArray.splice(i, 1);
                for (var arrayKey in relatedFieldsValueObj) {
                    if (relatedFieldsValueObj[arrayKey] != null && relatedFieldsValueObj[arrayKey].length > i) {
                        relatedFieldsValueObj[arrayKey].splice(i, 1);
                    }
                }
            }
        }
    }
    if (removedFlag) {
        toFile[fieldName] = fieldValueArray;
        for (var arrayKey in relatedFieldsValueObj) {
            toFile[arrayKey] = relatedFieldsValueObj[arrayKey];
        }
    }
    return removedFlag;
}


/**
 * Migrate Incident Solution Matching, which will reads the user input
 * from var $use.pd.solution.matching.
 * If var $use.pd.solution.matching is NOT set to false, then
 *   - disable the solution in legacy process by changing the Processes which invokes
 *     RAD "us.incident.matching.wrapper" or "us.problem.matching" by change the RAD condtion to false,
 *     in OOB such processes are: im.first, im.first.exit, im.first.new, im.first.save
 *   - and add the rule set "im.incident.matching" in the generated workflow "Incident_PDCM";
 */
function migrateIncidentSolutionMatching() {
    if (vars["$use.pd.solution.matching"] === false) {

        printIt("You select to use Non-PD solution matching, ignore the migration for using Non-PD Incident solution matching.", true);

        var reportObj = {};
        reportObj.title = "You selected to keep using non Process Designer-based solution matching, so you need to manually migrated the"; + " solution matching related configuration from non Process Designer-based profile to Process Designer-based Security. Please refer to the migration guide for more detail.";
        reportObj.needManualCheck = true;
        reportObj.files = [];
        SUMMARY_REPORT_OBJS.push(reportObj);

        return;
    }

    printIt("Start migrating to use PD Incident solution matching...", true);

    // seach out the Processes, and disable the non-PD Incident/Problem matching
    var changedFiles = [];
    var radName1 = "us.incident.matching.wrapper";
    var radName2 = "us.problem.matching";
    var radNameSave = "im.save.problem";
    var process = new SCFile("Process");
    var sql = "application=\"" + radName1 + "\" or application=\"" + radName2 + "\"";
    var rc = process.doSelect(sql);
    while (rc == RC_SUCCESS) {
        if (isIgnoreRecord(process.process, true) || isOOBRecordList(process.process, OOB_PROCESS_LIST)) {
            rc = process.getNext();
            continue;
        }
        printIt("Changing Process " + process.process + " to disable the non-PD Incident Solution Matching");
        // backup it
        var processBak = $("Process").select("process=\"" + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
        if (null != processBak) { // the backup process already exists, ignore the backup
            printIt("The backup of the Process " + process.process + " exists already, ignore the backup.");
        } else { // backup the process
            processBak = $("Process").select("process=\"" + process.process + "\"").uniqueResult();
            processBak.process = process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX;
            processBak.doInsert();
            printIt("The Process " + process.process + " is backuped to " + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX);
        }

        // change the RAD condition to false
        var rads = process.rad;
        var radLen = rads.length()
        for (var i = 0; i < radLen; i++) {
            if (rads[i].application === radName1 || rads[i].application === radName2) {
                if (null != rads[i]["rad.condition"]) {
                    var strCond = system.functions.str(rads[i]["rad.condition"]);
                    if (!_str.startsWith(strCond, "false")) {
                        rads[i]["rad.condition"] = system.functions.parse("false and (" + strCond + ")", 2);
                    }
                } else {
                    rads[i]["rad.condition"] = system.functions.parse("false", 2);
                }
            }
            /*
		    else if (rads[i].application===radNameSave) {// use se.view.engine or se.base.method to replace the non-PD RAD for add/update
		        rads[i].application = "se.view.engine";
		        rads[i].names=["file", "description", "name", "index", "text"];
		        rads[i].values=["$L.file", "$L.action", "$L.related.filename", "$L.related.id", "$L.exit"];
		    }
		    */
            // else if () // disable the RAD invoke us.save.relation??? TODO, ...
        }

        // append call PD Incident Solution matching RAD at the end of the process
        var radNamePDSolution = "incident.matching";
        if (rads[radLen - 1]["application"] == radNamePDSolution) {
            printIt("The PD solution matching RAD \"" + radNamePDSolution + "\" already configured in the Process \"" + process.process + "\", ignore it.");
        } else {
            rads[radLen]["application"] = radNamePDSolution;
            var condStr = "$L.continue and not  ($G.bg)";
            // append the condition in Ruleset im.incident.matching
            var pdRuleCondStr = getPDSolutionMatchingRuleCondition();

            if (pdRuleCondStr == null || pdRuleCondStr == "") { // use default if can not find the condition in rule
                condStr += " and (jscall(\"security.getRights\",\"Incident\",\"use.solution.matching\")=true and  (jscall(\"ServiceDeskSwitch.getSDSwitch\")=true or (nullsub($isLinkedIncident,false)=false and nullsub($isSDEscalatedIncident,false)=false) ) and nullsub( $sdsolvedirectly,false)=false  and nullsub(first.call in $L.file, false)=false)";
                condStr += " and (not  ($G.bg) and nullsub($inChangeCat, false)=false)"
            } else {
                condStr += " and " + pdRuleCondStr;
            }

            rads[radLen]["rad.condition"] = system.functions.parse(condStr, 2);

            rads[radLen].names = ["file", "types", "name"];
            rads[radLen].values = ["$L.file", "$L.exit.matching", "\"Matched Incident\""];
            if (rads[radLen]["post.rad.expressions"] == null) {
                rads[radLen]["post.rad.expressions"] = [];
            }
            rads[radLen]["post.rad.expressions"].push(system.functions.parse("if (null(agreement.ids in $L.file) and not  (null(agreement.id in $L.file))) then (1 in agreement.ids in $L.file=agreement.id in $L.file)", 11));
            rads[radLen]["post.rad.expressions"].push(system.functions.parse("if same($L.exit.matching, \"back\") then ($L.exit=\"bad.val\")", 11));
        }

        process.doUpdate();
        addMigrationPatchRecord("Process", process, process["process"], false);
        changedFiles.push(process.process);

        rc = process.getNext();
    }
    // add to report
    var reportObj = {};
    reportObj.title = "The following process records are updated to disable the non Process Designer-based Incident solution matching " + " and to use the Process Designer-based solution matching."
    // + " meanwhile the orginal Process records are backuped with suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\":";
    + "Backups of the original process (identified by the suffix " + PD_CODE_MIGRATION_DISABLE_SUFFIX + ") have been created."
    reportObj.files = changedFiles;
    reportObj.needManualCheck = false;
    reportObj.category = "Process";
    reportObj.filename = "process";

    SUMMARY_REPORT_OBJS.push(reportObj);


    printIt("Finish migrating to use PD Incident solution matching.", true);
}

/**
 * Migrate Process to make sure the Rule sets of auto-generated workflow work.
 * @param {array of String}
 *            rads - the RAD used in built-in Processes, which need to pass in the names/values parameters.
 */
function migrateBuiltinProcesses(radNames) {
    printIt("Start migrating built-in Processes to pass in the names/values parameters of RAD call...", true);
    if (radNames == null || radNames.length == 0) {
        printIt("The radNames is empty, ignore the migration for Built-in Process.");

        return;
    }

    // seach out the Processes
    var changedFiles = [];
    var process = new SCFile("Process");
    var sql = "";
    for (var i = 0, len = radNames.length; i < len; i++) {
        if (i > 0) {
            sql += " or "
        }
        sql += "application=\"" + radNames[i] + "\""
    }
    // special handle for Process sm.save
    sql += " or process=\"sm.save\""
    // special handle for Process im.close.bg
    sql += " or process=\"im.close.bg\""

    var rc = process.doSelect(sql);
    while (rc == RC_SUCCESS) {
        if (isIgnoreRecord(process.process, true) || isOOBRecordList(process.process, OOB_PROCESS_LIST)) {
            rc = process.getNext();
            continue;
        }
        printIt("Changing Process " + process.process + " to makes sure the Rule sets of the auto-generated Workflow working");

        // add names/values to the RAD paramters
        var rads = process.rad;
        var radLen = rads.length();
        var modifyFlag = false;
        for (var i = 0; i < radLen; i++) {
            if (containsInArray(radNames, rads[i].application) || (rads[i].application === "se.base.method" && process.process === "sm.save")) {
                if (arrayContains(rads[i].names, "names")) {
                    printIt("The Process " + process.process + " had been already updated to parse into the names/values, ignore the migration for this Process.");
                    break;
                } else {}
                modifyFlag = true;
                // backup it
                var processBak = $("Process").select("process=\"" + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
                if (null != processBak) { // the backup process already exists, ignore the backup
                    printIt("The backup of the Process " + process.process + " exists already, ignore the backup.");
                } else { // backup the process
                    processBak = $("Process").select("process=\"" + process.process + "\"").uniqueResult();
                    processBak.process = process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                    processBak.doInsert();
                    printIt("The Process " + process.process + " is backuped to " + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX);
                }

                if (rads[i]["pre.rad.expressions"] == null) {
                    rads[i]["pre.rad.expressions"] = [];
                }

                rads[i]["pre.rad.expressions"].push(system.functions.parse("$L.file.names={\"$L.category\", \"$L.workflow\", \"$L.phase\", \"$L.saved\", \"$L.parent\", \"$L.wfPhase\", \"$L.wfPhase.save\", \"$L.orig.format\", \"$L.wfRules\", \"$L.wfMode\", \"$L.wfType\", \"$L.to.phaseId\"}", 11));
                rads[i]["pre.rad.expressions"].push(system.functions.parse("if (not null($L.object)) then $L.file.names=denull(local.variables in $L.object) + $L.file.names", 11));
                rads[i]["pre.rad.expressions"].push(system.functions.parse("$L.file.vars={};$L.file.vars=getvariables($L.file.names)", 11));
                rads[i].names.push("names");
                rads[i].names.push("values");
                rads[i].values.push("$L.file.names");
                rads[i].values.push("$L.file.vars");
                if (rads[i].application === "se.base.method" && process.process === "sm.save" && !arrayContains(rads[i].names, "boolean1")) {
                    rads[i].names.push("boolean1");
                    rads[i].values.push("$G.bg");
                }

                var addExp = system.functions.parse("if ($L.exit~=\"bad.val\" and $L.exit~=\"badval\") then ($L.void=setvariables($L.file.names, $L.file.vars))", 11);
                if (rads[i]["post.rad.expressions"] == null) {
                    rads[i]["post.rad.expressions"] = [addExp];
                } else {
                    //insert as the first line
                    rads[i]["post.rad.expressions"] = system.functions.insert(rads[i]["post.rad.expressions"], 1, 1, addExp);
                }
            } else if (rads[i].application === "se.call.process" && process.process === "im.close.bg") {
                if (!(arrayContains(rads[i].names, "name") && arrayContains(rads[i].values, "\"im.close\""))) {
                    continue;
                }
                //if(arrayContains(rads[i]["pre.rad.expressions"], "$L.values={};$L.values=getvariables($L.names)")) {
                if (arrayContains(rads[i].names, "second.record")) {
                    printIt("The Process " + process.process + " had been already updated to parse into the second.record, ignore the migration for this Process.");
                    break;
                }
                modifyFlag = true;
                // backup it
                var processBak = $("Process").select("process=\"" + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\"").uniqueResult();
                if (null != processBak) { // the backup process already exists, ignore the backup
                    printIt("The backup of the Process " + process.process + " exists already, ignore the backup.");
                } else { // backup the process
                    processBak = $("Process").select("process=\"" + process.process + "\"").uniqueResult();
                    processBak.process = process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX;
                    processBak.doInsert();
                    printIt("The Process " + process.process + " is backuped to " + process.process + PD_CODE_MIGRATION_DISABLE_SUFFIX);
                }

                if (rads[i]["pre.rad.expressions"] == null) {
                    rads[i]["pre.rad.expressions"] = [];
                }
                rads[i]["pre.rad.expressions"].push(system.functions.parse('$L.names=$L.names+{"$L.category", "$L.workflow", "$L.phase", "$L.saved", "$L.parent", "$L.wfPhase", "$L.wfPhase.save", "$L.orig.format", "$L.wfRules", "$L.wfMode", "$L.wfType", "$L.to.phaseId"}', 11));
                rads[i]["pre.rad.expressions"].push(system.functions.parse("$L.values={};$L.values=getvariables($L.names)", 11));
                rads[i].names.push("second.record");
                rads[i].values.push("$L.file.save");
                if (rads[i]["post.rad.expressions"] == null) {
                    rads[i]["post.rad.expressions"] = [];
                }
                rads[i]["post.rad.expressions"].push(system.functions.parse("if ($L.exit~=\"bad.val\" and $L.exit~=\"badval\") then ($L.void=setvariables($L.file.names, $L.file.vars))", 11));
            }
        }

        if (modifyFlag === true) {
            process.doUpdate();
            addMigrationPatchRecord("Process", process, process["process"], false);
            changedFiles.push(process.process);
        }

        rc = process.getNext();
    }

    // add to report
    var reportObj = {};
    reportObj.title = "The following process records are updated to pass the names/values parameters into while invoking the main logic RAD," + " which makes sure the Rule sets of the auto-generated workflows can work." + "Backups of the original process (identified by the suffix " + PD_CODE_MIGRATION_DISABLE_SUFFIX + ") have been created."
    reportObj.files = changedFiles;
    reportObj.category = "Process";
    reportObj.filename = "process";

    SUMMARY_REPORT_OBJS.push(reportObj);

    printIt("Finished migrating built-in Processes to pass in the names/values parameters of RAD call.", true);
}

function isIgnoreRecord(recordName, needIgnoreRenamed) {

    if (_.endsWith(recordName, PD_CODE_MIGRATION_DISABLE_SUFFIX) || _str.startsWith(recordName, "AUDIT")) {
        return true;
    }

    if (needIgnoreRenamed) {
        if ((_str.startsWith(recordName, UPGRADE_PREFIX) || _str.startsWith(recordName, "OLD") || _str.startsWith(recordName, "PRE"+CUSTOMER_VERSION_PREFIX))) {
            return true;
        }
    }

    return false;
}


function isOOBRecordList(recordName, oobList) {
    if (lib.ArrayUtil.contains(oobList, recordName)) {

        return true;
    }

    return false;
}

function getPDSolutionMatchingRuleCondition() {
    var ruleset = $("RuleSet").select("id=\"im.incident.matching\"").uniqueResult();
    if (null == ruleset) {
        printIt("Return null condition as the RuleSet \"im.incident.matching\" is not found.");
        return null;
    }

    var rules = ruleset.rule;
    if (null == rules) {
        printIt("Return null as rules in RuleSet \"im.incident.matching\" is empty");
        return null;
    }
    for (var i = 0, len = rules.length(); i < len; i++) {
        if (rules[i].type === "callProcess") {
            var processName = null;
            if (rules[i].ruleJSON != null && rules[i].ruleJSON != "") {
                processName = lib.RuleWizardHelpers.getProcessName(rules[i].ruleJSON, true);
            } else {
                if (rules[i].ruleXML != null && rules[i].ruleXML != "") {
                    processName = lib.RuleWizardHelpers.getProcessName("<xml>" + rules[i].ruleXML + "</xml>");
                }
            }
            if (processName === "im.incident.matching") {
                var retCondStr = system.functions.str(rules[i].condition);
                var process = $("Process").select("process=\"" + processName + "\"").uniqueResult();
                if (null == process) {
                    printIt("Return null as Process \"" + processName + "\" is not found");
                    return null;
                }
                var rads = process.rad;
                if (null == rads) {
                    printIt("Return null as rads in Process is empty");
                    return null;
                }
                for (var j = 0, len = rads.length(); j < len; j++) {
                    if (rads[j].application === "incident.matching") {
                        retCondStr = "(" + retCondStr + ") and (" + system.functions.str(rads[j]["rad.condition"]) + ")";
                        return retCondStr;
                    }
                }
                printIt("Return null as no RAD \"incident.matching\" call is invoked in Process");
                return null;
            }
        }
    }

    printIt("Return null as no Rule calls process \"im.incident.matching\" in the RuleSet");
    return null;
}

function arrayContains(smArray, item) {
    for (var i = 0, len = smArray.length(); i < len; i++) {
        var arrayItem = smArray[i];

        if (typeof(item) === "string" && typeof(arrayItem) !== "string") {
            arrayItem = system.functions.str(arrayItem);
        }
        if (arrayItem == item) {
            return true;
        }
    }

    return false;
}


function detectUncompactibleCodes() {
    printIt("Start detecting uncompactible codes...", true);

    // 0. current.phase in saved record usage, no need to detect as it seems it is not impact non-PD and PD CP3 customers

    // 1. merge the linklines of master link
    var fileNames = ["probsummary", "incidents", "rootcause"];
    var changedFiles = mergeMasterLinkLines(fileNames);
    // set to report
    var reportObj = {};
    reportObj.title = "The following link records are updated to add the latest OOB PD linklines " + " and the category related target tables are changed to use PD related category tables." + " Backups of the original link records (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created."
    reportObj.files = changedFiles;
    reportObj.category = "Link";
    reportObj.filename = "link";

    SUMMARY_REPORT_OBJS.push(reportObj);

    // 2. update the Validity to refer to PD category related tables
    var pdCategoryMap = {
        probsummary: {
            category: "imCategory",
            subcategory: "imSubcategory",
            producttype: "imArea"
        },
        incidents: {
            category: "sdCategory",
            subcategory: "sdSubcategory",
            producttype: "sdArea"
        },
        rootcause: {
            category: "pbmCategory",
            subcategory: "pbmSubcategory",
            producttype: "pbmArea"
        }
    };
    changedFiles = migrateValidity(pdCategoryMap);
    // set to report
    reportObj = {};
    reportObj.title = "The following validity records are updated to perform validation against Process Designer-based category tables (such as category, subcategory, and producttype) instead of legacy category tables." + " Backups of the original validity records (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created.";
    reportObj.files = changedFiles;
    reportObj.needManualCheck = true;
    reportObj.category = "Validity";
    reportObj.filename = "validity";

    SUMMARY_REPORT_OBJS.push(reportObj);

    // 3. update the format level link to disable the category related link lines
    var ignoreMasterLinks = ["probsummary", "incidents", "rootcause", "rootcausetask", "knownerror", "knownerrortask"];
    var ignoreLinks = ["pm.profile", "core", "IM.new.category", "pm.profile.util",
        "probcause.user", "probcause.user.1", "pm.resolve.cat", "problem.type", "product.type",
        "protocore", "sc.knowledge.prompt.core", "screlate.search.problem", "subcategory", "svcCatalog", "advFind.incident.search", "advFind.SD.search", "IM.close.incident", "IM.open.incident", "IM.summary", "IM.update.incident", "SD.open.interaction", "SD.update.interaction", "Survey.IM.addFilter", "Survey.SD.addFilter"
    ];
    changedFiles = disableCategoryLinkLinesInFormatLink(ignoreMasterLinks.concat(ignoreLinks));
    // set to report
    reportObj = {};
    reportObj.title = "The following format level link records are updated to disable the" + " category/subcategory/product.type link lines." + " Backups of the original link records (identified by the suffix \"" + PD_CODE_MIGRATION_DISABLE_SUFFIX + "\") have been created."
    reportObj.files = changedFiles;
    reportObj.needManualCheck = false;
    reportObj.category = "Link";
    reportObj.filename = "link";

    SUMMARY_REPORT_OBJS.push(reportObj);

    printIt("Finished detecting uncompactible codes.", true);
}



/**
 * Write the migration log to log file.
 * @param {boolean}
 *            isAlsoConsole - whether also print the log to console.
 *
 */
function printIt(content, isAlsoConsole) {
    if (isAlsoConsole === true) {
        print(content);
    }
    system.functions.log(content);
}


/**
 * This method is used to insert the triggers to sync the PD category data back to the legacy category data for Incident , Service Desk and Problem modules
 */
function synCategoryData() {
    printIt("Start migrating the configuration of syncing category data back...", true);

    var AFTER_ADD = 2;
    var AFTER_UPDATED = 4;
    var AFTER_DELETE = 6;

    //add triggers to sync imCategory data to category tables
    addTrigger("sync.added.imcategory", "imCategory", AFTER_ADD, "lib.SyncPDCategoryData.syncCategoryData(record);");
    addTrigger("sync.updated.imcategory", "imCategory", AFTER_UPDATED, "lib.SyncPDCategoryData.syncCategoryData(record,oldrecord);");
    addTrigger("sync.deleted.imcategory", "imCategory", AFTER_DELETE, "lib.SyncPDCategoryData.deleteCategoryData(record);");


    //add triggers to sync imSubCategory data to subcategory tables 
    addTrigger("sync.added.imsubcategory", "imSubcategory", AFTER_ADD, "lib.SyncPDCategoryData.syncSubCategoryData(record);");
    addTrigger("sync.updated.imsubcategory", "imSubcategory", AFTER_UPDATED, "lib.SyncPDCategoryData.syncSubCategoryData(record,oldrecord);");
    addTrigger("sync.deleted.imsubcategory", "imSubcategory", AFTER_DELETE, "lib.SyncPDCategoryData.deleteSubCategoryData(record);");

    //add triggers to sync imArea data to product.type tables 
    addTrigger("sync.added.imArea", "imArea", AFTER_ADD, "lib.SyncPDCategoryData.syncAreaData(record);");
    addTrigger("sync.updated.imArea", "imArea", AFTER_UPDATED, "lib.SyncPDCategoryData.syncAreaData(record,oldrecord);");
    addTrigger("sync.deleted.imArea", "imArea", AFTER_DELETE, "lib.SyncPDCategoryData.deleteAreaData(record);");


    //add triggers to sync sdCategory data to category tables
    addTrigger("sync.added.sdcategory", "sdCategory", AFTER_ADD, "lib.SyncPDCategoryData.syncCategoryData(record);");
    addTrigger("sync.updated.sdcategory", "sdCategory", AFTER_UPDATED, "lib.SyncPDCategoryData.syncCategoryData(record,oldrecord);");
    addTrigger("sync.deleted.sdcategory", "sdCategory", AFTER_DELETE, "lib.SyncPDCategoryData.deleteCategoryData(record);");


    //add triggers to sync sdSubCategory data to subcategory tables 
    addTrigger("sync.added.sdsubcategory", "sdSubcategory", AFTER_ADD, "lib.SyncPDCategoryData.syncSubCategoryData(record);");
    addTrigger("sync.updated.sdsubcategory", "sdSubcategory", AFTER_UPDATED, "lib.SyncPDCategoryData.syncSubCategoryData(record,oldrecord);");
    addTrigger("sync.deleted.sdsubcategory", "sdSubcategory", AFTER_DELETE, "lib.SyncPDCategoryData.deleteSubCategoryData(record);");

    //add triggers to sync sdArea data to product.type tables 
    addTrigger("sync.added.sdArea", "sdArea", AFTER_ADD, "lib.SyncPDCategoryData.syncAreaData(record);");
    addTrigger("sync.updated.sdArea", "sdArea", AFTER_UPDATED, "lib.SyncPDCategoryData.syncAreaData(record,oldrecord);");
    addTrigger("sync.deleted.sdArea", "sdArea", AFTER_DELETE, "lib.SyncPDCategoryData.deleteAreaData(record);");



    //add triggers to sync pbmCategory data to category tables
    addTrigger("sync.added.pbmcategory", "pbmCategory", AFTER_ADD, "lib.SyncPDCategoryData.syncCategoryData(record);");
    addTrigger("sync.updated.pbmcategory", "pbmCategory", AFTER_UPDATED, "lib.SyncPDCategoryData.syncCategoryData(record,oldrecord);");
    addTrigger("sync.deleted.pbmcategory", "pbmCategory", AFTER_DELETE, "lib.SyncPDCategoryData.deleteCategoryData(record);");


    //add triggers to sync pbmSubCategory data to subcategory tables 
    addTrigger("sync.added.pbmsubcategory", "pbmSubcategory", AFTER_ADD, "lib.SyncPDCategoryData.syncSubCategoryData(record);");
    addTrigger("sync.updated.pbmsubcategory", "pbmSubcategory", AFTER_UPDATED, "lib.SyncPDCategoryData.syncSubCategoryData(record,oldrecord);");
    addTrigger("sync.deleted.pbmsubcategory", "pbmSubcategory", AFTER_DELETE, "lib.SyncPDCategoryData.deleteSubCategoryData(record);");

    //add triggers to sync pbmArea data to product.type tables 
    addTrigger("sync.added.pbmArea", "pbmArea", AFTER_ADD, "lib.SyncPDCategoryData.syncAreaData(record);");
    addTrigger("sync.updated.pbmArea", "pbmArea", AFTER_UPDATED, "lib.SyncPDCategoryData.syncAreaData(record,oldrecord);");
    addTrigger("sync.deleted.pbmArea", "pbmArea", AFTER_DELETE, "lib.SyncPDCategoryData.deleteAreaData(record);");




    //insert the customized fields dynamically into the SyncPDCategoryData ScriptLibrary
    var oobCategoryFields = ["name", "activity", "open.format", "update.format", "close.format", "count",
        "alert1", "alert2", "alert3", "reassign", "default.assign", "avail.post",
        "qbe.format", "dl.alert", "dl.group", "alert1.expression", "alert2.expression",
        "alert3.expression", "dl.expression", "reass.expression", "print.override", "print.open",
        "print.open.format", "print.update", "print.update.format", "print.close",
        "print.close.format", "alert.pages", "initial.format", "check.duplicates",
        "check.parents", "device.types", "include.unexpired", "expires.after",
        "script", "browse.format", "review.print.formats", "open.print.formats",
        "update.print.formats", "close.print.formats", "assignment.expression",
        "category.format", "wdClsDuration", "wdUD1", "wdUD2", "wdPriority",
        "wdClsCustSatisfaction", "wdClsActDuration", "wdClsRoot", "wdClsLevel",
        "wdClsParent", "wdClsInflatePriority", "wdClsTimeStamp", "wdTips", "print.format",
        "active", "sysmodcount", "sysmoduser", "sysmodtime", "copy.open.link", "company",
        "engine.alerts", "approvals"
    ];
    insertCustFieldsForSync("category", oobCategoryFields);

    var oobSubcategoryFields = ["category", "subcategory", "subcategory.name", "description", "company",
        "active", "sysmodcount", "sysmoduser", "sysmodtime"
    ];
    insertCustFieldsForSync("subcategory", oobSubcategoryFields);


    var oobAreaFields = ["category", "subcategory", "product.type", "description", "company", "active", "sysmodcount", "sysmodtime", "sysmoduser"];
    insertCustFieldsForSync("producttype", oobAreaFields);

    printIt("Finished migrating the configuration of syncing category data back.", true);
}

/**
 * This method is used to add the triggers into db
 *
 * @param {String}
 *            triggerName - The name of the trigger to be added
 * @param {String}
 *            tableName - The table name on which trigger will be applied
 * @param {String}
 *            triggerType - The type of the trigger
 * @param {String}
 *            calledScript - The script method will be called for the trigger
 *
 * @return void
 */
function addTrigger(triggerName, tableName, triggerType, calledScript) {
    var trigger = new SCFile("triggers");
    trigger.trigger_name = triggerName;
    trigger.table_name = tableName;
    trigger.trigger_type = triggerType;
    trigger.javascript = calledScript;
    trigger.doSave();
    addMigrationPatchRecord("triggers", trigger, trigger.trigger_name, false);
}



/**
 * This method is used to insert the customized fields list into SyncPDCategoryData script file . For example insert " categoryCustFields=["custField1"];" before the line contains
 * /**end to insert customized field list for category during the PD migration**
 * @param {String}
 *            tableName - The table name
 * @param {String}
 *            oobFieldList - The OOB field list for the table specified with the tableName param
 *
 * @return void
 */
function insertCustFieldsForSync(tableName, oobFieldList) {
    var customizedFieldList = getCustomizedFieldList(tableName, oobFieldList);
    if (customizedFieldList.length > 0) {
        var scriptLib = new SCFile("ScriptLibrary");
        scriptLib.doSelect("name=\"SyncPDCategoryData\"");
        var script = scriptLib.script;
        var lines = script.split("\n");
        var initialLines = lines.length;
        var addingLine = "";
        if (tableName == "category") {
            addingLine = "  categoryCustFields=[";
        } else if (tableName == "subcategory") {
            addingLine = "  subcategoryCustFields=[";
        } else if (tableName == "producttype") {
            addingLine = "  areaCustFields=[";
        }
        for (var i = 0; i < customizedFieldList.length; i++) {
            addingLine = addingLine + "\"" + customizedFieldList[i] + "\"";
            if (i == customizedFieldList.length - 1) {
                addingLine = addingLine + "];";
            } else {
                addingLine = addingLine + ",";
            }
        }

        var insertPoint = lib.ArrayUtil.indexOf(lines, "/**end to insert customized field list for " + tableName + " during the PD migration**/");
        if (insertPoint > 0 && !lib.ArrayUtil.contains(lines, addingLine)) {
            lines.splice(insertPoint, 0, addingLine);
        }

        if (initialLines < lines.length) {
            scriptLib.script = lines.join("\n");
            scriptLib.doSave();
        }
    }

}

/**
 * This method is used to get the customized field list for a table compared with the OOB field list
 *
 * @param {String}
 *            tableName - The table name
 * @param {String}
 *            oobFieldList - The OOB field list for the table specified with the tableName param
 *
 * @return the customizedFieldList
 */
function getCustomizedFieldList(tableName, oobFieldList) {
    var start = new Date();
    var fieldList = [];
    var fdbdict = new SCFile("dbdict", SCFILE_READONLY);
    fdbdict.doSelect("name=\"" + tableName + "\"");
    var length = fdbdict.field.length();
    for (var i = 0; i < length; i++) {
        if (fdbdict.field[i].level == 1 && !lib.ArrayUtil.contains(oobFieldList, fdbdict.field[i].name)) {
            fieldList.push(fdbdict.field[i].name);
        }
    }

    return fieldList;
}



function createStage1Alert(category, alertList) {
    if (category.alert1 != null || category.alert1_expression != null) {
        var alertDef = new SCFile("AlertDef");
        alertDef.name = "Incident Alert Stage 1" + getAlertNameSuffix(category);
        alertDef.description[0] = alertDef.name;
        alertDef['alert.type'] = "none";
        alertDef['sched.condition'] = _val("nullsub(status in $L.file, \"\")~={\"DEADLINE ALERT\", \"closed\", \"resolved\"} and category in $L.file=\"" + category.name + "\"", 10);
        alertDef['sched.class'] = "alert";
        alertDef['alert.condition'] = _val("nullsub(status in $L.file, \"\")~={\"DEADLINE ALERT\", \"closed\", \"resolved\"} and flag in $L.file=true", 10);
        alertDef['calc.type'] = "expression";
        if (category.alert1_expression != null) {
            alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.alert1_expression)), 11);
        } else {
            alertDef['calc.expression'] = _parse("alert.time in $L.file=tod()+'" + system.functions.str(category.alert1) + "'", 11);
        }
        alertDef['calc.expression'] = _parse(system.functions.str(alertDef['calc.expression']) + ";$L.alert.time=alert.time in $L.file", 11);
        alertDef['statements'] = [_parse("status in $L.file=\"alert stage 1\"", 11), _parse("alert1 in $L.file=true", 11)];
        alertDef['format.control'] = getAlertFCName(category);
        alertDef.doSave();
        addMigrationPatchRecord("AlertDef", alertDef, alertDef["name"], false);
        alertList.push(alertDef.name);
    }
}


function createStage2Alert(category, alertList) {
    if ((category.alert1 != null || category.alert1_expression != null) && (category.alert2 != null || category.alert2_expression != null)) {
        var alertDef = new SCFile("AlertDef");
        alertDef.name = "Incident Alert Stage 2" + getAlertNameSuffix(category);
        alertDef.description[0] = alertDef.name;
        alertDef['alert.type'] = "none";
        alertDef['sched.condition'] = _val("nullsub(status in $L.file, \"\")~={\"DEADLINE ALERT\", \"closed\", \"resolved\"} and category in $L.file=\"" + category.name + "\"", 10);
        alertDef['sched.class'] = "alert";
        alertDef['alert.condition'] = _val(" nullsub(status in $L.file, \"\")=\"alert stage 1\" and flag in $L.file=true", 10);
        alertDef['calc.type'] = "expression";
        if (category.alert2_expression != null) {
            alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.alert2_expression)), 11);
        } else {
            if (category.alert1_expression != null) {
                alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.alert1_expression)) + ";alert.time in $L.file=alert.time in $L.file+'" + system.functions.str(category.alert2) + "'", 11);
            } else {
                alertDef['calc.expression'] = _parse("alert.time in $L.file=tod()+'" + system.functions.str(category.alert1) + "'+'" + system.functions.str(category.alert2) + "'", 11);
            }
        }
        alertDef['calc.expression'] = _parse(system.functions.str(alertDef['calc.expression']) + ";$L.alert.time=alert.time in $L.file", 11);
        alertDef['statements'] = [_parse("status in $L.file=\"alert stage 2\";$L.void=jscall(\"alertStageService.stageReassignment\",$L.file)", 11), _parse("alert2 in $L.file=true", 11)];
        alertDef['format.control'] = getAlertFCName(category);
        alertDef.doSave();
        addMigrationPatchRecord("AlertDef", alertDef, alertDef["name"], false);
        alertList.push(alertDef.name);
    }
}


function createStage3Alert(category, alertList) {
    if ((category.alert1 != null || category.alert1_expression != null) && (category.alert2 != null || category.alert2_expression != null) && (category.alert3 != null || category.alert3_expression != null)) {
        var alertDef = new SCFile("AlertDef");
        alertDef.name = "Incident Alert Stage 3" + getAlertNameSuffix(category);
        alertDef.description[0] = alertDef.name;
        alertDef['alert.type'] = "none";
        alertDef['sched.condition'] = system.functions.val(" nullsub(status in $L.file, \"\")~={\"DEADLINE ALERT\", \"closed\", \"resolved\"} and category in $L.file=\"" + category.name + "\"", 10);
        alertDef['sched.class'] = "alert";
        alertDef['alert.condition'] = system.functions.val(" nullsub(status in $L.file, \"\")=\"alert stage 2\" and flag in $L.file=true", 10);
        alertDef['calc.type'] = "expression";
        if (category.alert3_expression != null) {
            alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.alert3_expression)), 11);
        } else {
            if (category.alert2_expression != null) {
                alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.alert2_expression)) + ";alert.time in $L.file=alert.time in $L.file+'" + system.functions.str(category.alert3) + "'", 11);
            } else {
                if (category.alert1_expression != null) {
                    alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.alert1_expression)) + ";alert.time in $L.file=alert.time in $L.file+'" + system.functions.str(category.alert2) + "'+'" + system.functions.str(category.alert3) + "'", 11);
                } else {
                    alertDef['calc.expression'] = _parse("alert.time in $L.file=tod()+'" + system.functions.str(category.alert1) + "'+'" + system.functions.str(category.alert2) + "'+'" + system.functions.str(category.alert3) + "'", 11);
                }
            }
        }
        alertDef['calc.expression'] = _parse(system.functions.str(alertDef['calc.expression']) + ";$L.alert.time=alert.time in $L.file", 11);
        alertDef['statements'] = [_parse("status in $L.file=\"alert stage 3\";$L.void=jscall(\"alertStageService.stageReassignment\",$L.file)", 11), _parse("alert3 in $L.file=true", 11)];
        alertDef['format.control'] = getAlertFCName(category);
        alertDef.doSave();
        addMigrationPatchRecord("AlertDef", alertDef, alertDef["name"], false);
        alertList.push(alertDef.name);
    }
}

function createDeadlineAlert(category, alertList) {
    if (category.dl_alert != null || category.dl_expression != null) {
        var alertDef = new SCFile("AlertDef");
        alertDef.name = "Incident Deadline" + getAlertNameSuffix(category);
        alertDef.description[0] = alertDef.name;
        alertDef['alert.type'] = "none";
        alertDef['sched.condition'] = _val("nullsub(status in $L.file, \"\")~={\"DEADLINE ALERT\", \"closed\", \"resolved\"} and category in $L.file=\"" + category.name + "\"", 10);
        alertDef['sched.class'] = "alert";
        alertDef['alert.condition'] = _val("nullsub(status in $L.file, \"\")~={\"DEADLINE ALERT\", \"closed\", \"resolved\"} and flag in $L.file=true", 10);
        alertDef['calc.type'] = "expression";
        if (category.dl_expression != null) {
            alertDef['calc.expression'] = _parse(fixAlertExpression(system.functions.str(category.dl_expression)), 11);
        } else {
            alertDef['calc.expression'] = _parse("deadline.alert in $L.file=nullsub(reopen.time in $L.file, open.time in $L.file)+'" + system.functions.str(category.dl_alert) + "'", 11);
        }
        alertDef['calc.expression'] = _parse(system.functions.str(alertDef['calc.expression']) + ";$L.alert.time=deadline.alert in $L.file;if (not  (null($L.alert.time)) and $L.alert.time<tod()+'00:00:10') then ($L.alert.time=tod()+'00:00:10')", 11);
        alertDef['statements'] = [_parse("status in $L.file=\"DEADLINE ALERT\";$L.void=jscall(\"alertStageService.deadlineReassignment\",$L.file,\"" + category.dl_group + "\")", 11), _parse("deadline in $L.file=true", 11)];
        alertDef['format.control'] = getAlertFCName(category);
        alertDef.doSave();
        addMigrationPatchRecord("AlertDef", alertDef, alertDef["name"], false);
        alertList.push(alertDef.name);
    }
}

function getAlertNameSuffix(category) {
    return " for " + category.name;
}

function getAlertFCName(category) {
    var fc = new SCFile("formatctrl");
    var sql = "name=\"IM." + category.name + ".alerts\"";
    if (RC_SUCCESS == fc.doSelect(sql)) {
        return "IM." + category.name + ".alerts";
    } else {
        var sql = "name=\"IM.alerts\"";
        if (RC_SUCCESS == fc.doSelect(sql)) {
            return "IM.alerts";
        }
    }

    return null;
}

function addAlertToWorkflow(alertList) {
    var wkFlowPhase = $("WorkflowPhase").select("workflowName=\"" + PD_CODE_MIGRATION_WF_PREFIX + "Incident" + "\" and phaseName=\"" + PHASE_NAME_INPROGRESS + "\"").uniqueResult();

    if (wkFlowPhase && alertList.length > 0) {
        for (var i = 0; i < alertList.length; ++i) {
            if (alertList[i] && alertList[i] != "" && system.functions.index(alertList[i], wkFlowPhase.alerts) < 1) {
                wkFlowPhase.alerts.push(alertList[i]);
            }
        }


        if (system.functions.index("im.alert.stage.processing", wkFlowPhase.onUpdateRules) < 1) {
            wkFlowPhase.onUpdateRules.push("im.alert.stage.processing");
        }

        if (wkFlowPhase.alertsReset === null) {
            wkFlowPhase.alertsResetXML = TURE_CONDITION_XML;
            wkFlowPhase.alertsResetDesc = TURE_CONDITION_DESC;
        }

        wkFlowPhase.doUpdate();
    }
}

function fixAlertExpression(expression) {
    expression = expression.replace(/\$file/g, "$L.file");
    return expression;
}

function migrateCategoryAlert() {

    printIt("Start migrating category based alerts...", true);
    var migratedAlerts = [];
    var engineAlerts = [];
    var migratedCategories = $("imCategory").select("workflow=\"" + PD_CODE_MIGRATION_WF_PREFIX + "Incident\"").list();
    for (var i = 0; i < migratedCategories.length; ++i) {

        var legacyCategory = $("category").select("name=\"" + migratedCategories[i].name + "\"").uniqueResult();
        if (legacyCategory) {
            //migrate category based alerts
            createStage1Alert(legacyCategory, migratedAlerts);
            createStage2Alert(legacyCategory, migratedAlerts);
            createStage3Alert(legacyCategory, migratedAlerts);
            createDeadlineAlert(legacyCategory, migratedAlerts);

            //migrate standard alerts
            engineAlerts = engineAlerts.concat(legacyCategory.engine_alerts.toArray());

        }
    }

    addAlertToWorkflow(engineAlerts.concat(migratedAlerts));

    var reportObj = {};
    reportObj.title = "The following Alert Definition records are created based on the stage 1/2/3 and deadline configuration in legacy category to support incident escalation when no one updates the incident within a specified time:";
    reportObj.files = migratedAlerts;
    reportObj.category = "Alert Definition";
    reportObj.filename = "alertDef";


    SUMMARY_REPORT_OBJS.push(reportObj);

    printIt("Finish migrating category based alerts.", true);


}

function appendSDBGtransition(workflowName) {
    var workflow = $("Workflow").select("name=\"" + workflowName + "\" and tableName=\"incidents\"").uniqueResult();
    if (workflow) {
        workflow.backendTransition[0][5] = "event.linked";
        workflow.backendTransition[0][0] = PHASE_NAME_INPROGRESS;
        workflow.backendTransition[0][2] = "sd.set.open.linked";

        workflow.backendTransition[1][5] = "event.close";
        workflow.backendTransition[1][0] = "Closure";
        workflow.backendTransition[1][2] = "sd.set.closed";

        workflow.backendTransition[2][5] = "event.callback";
        workflow.backendTransition[2][0] = PHASE_NAME_INPROGRESS;
        workflow.backendTransition[2][2] = "sd.set.call.back";

        workflow.doUpdate();
    }
}

function fixIncidentChangeCategoryAction() {
    // find the DO "change Category" and disable it
    var displayoption = new SCFile("displayoption");
    var rc = displayoption.doSelect('screen.id="apm.edit.problem" and action="newcat" and default="Change Category"');
    var actionCondStr = null;
    if (rc == RC_SUCCESS) {
        if (displayoption["user.condition"] == null || system.functions.str(displayoption["user.condition"]) == "") {
            displayoption["user.condition"] = false; //system.functions.parse('false', 11);
            displayoption["user.condition.txt"] = 'false';
            actionCondStr = system.functions.str(displayoption["condition"])
        } else {
            var userCondStr = system.functions.str(displayoption["user.condition"]);
            //displayoption["user.condition"] = system.functions.parse('(' + userCondStr + ') and false', 11);
            displayoption["user.condition"] = '(' + userCondStr + ') and false';
            displayoption["user.condition.txt"] = '(' + userCondStr + ') and false';
            actionCondStr = userCondStr;
        }
        var rc2 = displayoption.doUpdate();
        //print("rc2:" + rc2 + ", RCtoString(rc2):" + RCtoString(rc2));
        if (rc2 != RC_SUCCESS) {
            printIt("Update Display Option \"" + displayoption.id + "\" fail, the error string:" + RCtoString(rc2) + ", ignore adding the Action for it.");
            return;
        }
        addMigrationPatchRecord("displayoption", displayoption, displayoption["id"], false);


        var reportObj = {};
        reportObj.title = "The following displayoption records are disabled by setting the User Condition to false.";
        reportObj.files = [displayoption.id];
        reportObj.needManualCheck = false;
        reportObj.category = "Display Option";
        reportObj.filename = "displayoption";

        SUMMARY_REPORT_OBJS.push(reportObj);
    } else {
        printIt("Can not find the Display Option \"Change Category\", ignore adding the Action for it.");
        return;
    }

    //add change category action in workflow
    var pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "Incident";
    var wfPhase = $("WorkflowPhase").select("workflowName=\"" + pdMigratedWorkflowName + "\" and tableName=\"probsummary\" and phaseName=\"" + PHASE_NAME_INPROGRESS + "\"").uniqueResult();
    if (wfPhase) {
        wfPhase.action[0].action = "Change Category";
        wfPhase.action[0].actionName = "Change Category";
        wfPhase.action[0].actionId = "im.changeCategory";
        wfPhase.action[0].actionCondition = system.functions.parse(actionCondStr, 11);
        wfPhase.action[0].actionCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"" + system.functions.str(actionCondStr) + "\"</Expression></operand></condition></collection></XmlCondition>";
        wfPhase.action[0].actionLoc = 2;
        wfPhase.action[0].actionOption = 280;
        wfPhase.action[0].actionLock = false;
        wfPhase.action[0].actionRunAction = null;
        wfPhase.action[0].actionCondDesc = "( Expression: " + system.functions.str(actionCondStr) + ")";
        wfPhase.action[0].actionMsgId = 1;
        wfPhase.doUpdate();
    } else {
        printIt("Can not find the Migrated Incident Workflow Phase \"" + PHASE_NAME_INPROGRESS + "\", ignore adding the Action for it.");
        return;
    }
}

function fixSDNewProcessing() {

    //1.provide Exit&New for the migrated workflow interaction    
    var pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "ServiceDesk";
    var wfPhase = $("WorkflowPhase").select("workflowName=\"" + pdMigratedWorkflowName + "\" and tableName=\"incidents\" and phaseName=\"" + PHASE_NAME_INPROGRESS + "\"").uniqueResult();
    if (wfPhase) {
        wfPhase.initRules[0] = "sd.check.view.last.interaction";
        wfPhase.doUpdate();
    }
    var doData = '<model name="displayoption" query="id=&quot;cc.edit.incident_exitnew&quot;"><keys><id sctype="string">cc.edit.incident_exitnew</id></keys><instance recordid="cc.edit.incident_exitnew" uniquequery="id=&quot;cc.edit.incident_exitnew&quot;"><screen.id type="string">cc.edit.incident</screen.id><language type="string">ENG</language><gui.option type="decimal">1</gui.option><txt.option type="decimal">1</txt.option><txt.bank type="decimal">1</txt.bank><labels sctype="structure"><default type="string">Exit &amp; New</default><balloon type="string">Exit &amp; New</balloon></labels><condition type="operator">$L.tableAccess.new and $L.viewLastInteraction=true and nullsub($G.ess, false)=false and $G.bg=false</condition><action type="string">back</action><post.expressions sctype="array"><post.expressions sctype="operator">$additionAction="new"</post.expressions></post.expressions><rad sctype="structure"/><condition.txt type="string">$L.tableAccess.new and $L.viewLastInteraction=true and nullsub($G.ess, false)=false and $G.bg=false</condition.txt><unique.id type="decimal">19937</unique.id><gui.sig type="decimal">3933734902</gui.sig><text.sig type="decimal">560996132</text.sig><sysmodcount type="decimal">3</sysmodcount><sysmoduser type="string">falcon</sysmoduser><sysmodtime type="dateTime">04/08/15 02:25:48</sysmodtime><id type="string">cc.edit.incident_exitnew</id></instance></model>';
    var doExitNew = new SCFile("displayoption");
    doExitNew.setRecord(doData);
    var ret = 0;
    var triggerStatus = system.functions.sysinfo_get("trigger");
    system.functions.rtecall("trigger", ret, 1); //turn on trigger so displaycache refreshed
    doExitNew.doSave();
    system.functions.rtecall("trigger", ret, triggerStatus);

    //provoide change category
    pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "ServiceDesk";
    var wfPhase = $("WorkflowPhase").select("workflowName=\"" + pdMigratedWorkflowName + "\" and tableName=\"incidents\" and phaseName=\"" + PHASE_NAME_INPROGRESS + "\"").uniqueResult();
    if (wfPhase) {
        wfPhase.action[0].action = "Change Category";
        wfPhase.action[0].actionName = "Change Category";
        wfPhase.action[0].actionId = "sd.action.change.category";
        wfPhase.action[0].actionCondition = system.functions.parse('$L.mode="add" and $L.tableAccess.new=true and $G.ess=false', 11);
        wfPhase.action[0].actionCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"$L.mode=&quot;add&quot; and $L.tableAccess.new=true and  $G.ess=false\"</Expression></operand></condition></collection></XmlCondition>";
        wfPhase.action[0].actionLoc = 2;
        wfPhase.action[0].actionOption = 280;
        wfPhase.action[0].actionLock = false;
        wfPhase.action[0].actionRunAction = null;
        wfPhase.action[0].actionCondDesc = "( Expression: $L.mode=\"add\" and $L.tableAccess.new=true and  $G.ess=false)";
        wfPhase.action[0].actionMsgId = 1;
        wfPhase.doUpdate();
    }
}


function addMsgPDMpatch() {
    var pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "Incident";
    var msgs = new SCFile("scmessage");
    var ret = msgs.doSelect('class#"local:Workflow" and message.id like "*' + pdMigratedWorkflowName + '*"');
    while (ret == RC_SUCCESS) {
        addMigrationPatchRecord("scmessage", msgs, msgs["message.id"], false);
        ret = msgs.getNext();
    }

    pdMigratedWorkflowName = PD_CODE_MIGRATION_WF_PREFIX + "ServiceDesk";
    var msgs = new SCFile("scmessage");
    var ret = msgs.doSelect('class#"local:Workflow" and message.id like "*' + pdMigratedWorkflowName + '*"');
    while (ret == RC_SUCCESS) {
        addMigrationPatchRecord("scmessage", msgs, msgs["message.id"], false);
        ret = msgs.getNext();
    }

}

function changeSetting(settingName, settingId, settingValue) {
    printIt("Start changing setting \"" + settingName + "\" -> \"" + settingId + "\" to value \"" + settingValue + "\"...", true);
    var settings = $("settings").select("name=\"" + settingName + "\"").uniqueResult();
    if (null == settings) {
        printIt("Can't find the setting \"" + settingName + "\", ignore it!", true);
        return;
    }

    var settingIds = settings.settingId;
    var settingValues = settings.settingValue;
    if (null == settingIds) {
        return;
    }
    for (var i = 0, len = settingIds.length(); i < len; i++) {
        if (settingIds[i] === settingId) {
            if (settingValues[i] === settingValue) { // already current value
                printIt("The setting item's value is already current, ignore it!", true);
                return;
            }

            settingValues[i] = settingValue;

            //settings.doAction("save");
            settings.doUpdate();

            addMigrationPatchRecord("settings", settings, settingName, false);

            if (settingName === "Service Desk" && settingId === "sd.new.entry.enabled") {
                // add setingConfig to patch, which is updated in SL sdUtil.switchStreamlinedSD
                var settingsConfig = new SCFile("settingsConfig");
                var rc = settingsConfig.doSelect('setting="Service Desk" and id="allow.escalate"');
                if (rc == RC_SUCCESS) {
                    addMigrationPatchRecord("settingsConfig", settingsConfig, "setting:" + settingsConfig.setting + ";id:" + settingsConfig.id, false);
                }
                // add env to patch, which is updated in SL sdUtil.switchStreamlinedSD
                var env = new SCFile("environment");
                var rc = env.doSelect('name="service desk"');
                if (rc == RC_SUCCESS) {
                    addMigrationPatchRecord("environment", env, env.name, false);
                }
            }
            printIt("Finish changing the setting item's value!", true);
            return;
        }
    }
    printIt("Can't find the setting item \"" + settingId + "\", ignore it!", true);
}

function getReportOBJ() {
    return SUMMARY_REPORT_OBJS;
}