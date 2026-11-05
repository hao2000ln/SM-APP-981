var $ = lib.c.$;
var escapeDbField = lib.upgradeHelper.escapeDbField;

function executePreActionUpdate() {
    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);

    // remove temporary dbdict
    removeTemporaryDbdict();

    // stop inactivity timer
    stopInactivityTimer();

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.40.0015")) {
        lib.upgradeLanguage.fixLanguages();

        updateWorkflowPhase();
        updateWorkflowHistoryFast();
        updateCm3rCatPhase();
        updateAllScmessages();

        if (lib.upgradeVersionUtil.getPdVersion() == "") {
            updateSecRights();
            updateSecRole();
        }
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.41.0020")) {
        updateSqldbinfo();

        // update "cm3t" dbdict because some OOB version is incorrect
        lib.upgradeLog.detail("Sort dbdict cm3t field index.");
        lib.upgradeDbdictMerge.sortDbdictFieldIndex("cm3t", 1);

        // delete "kmquery" dbdict because the structure is incorrect if customer added new kmknowledgebase record
        if (!lib.upgradeCommonHelper.checkKmqueryDbdict()) {
            lib.upgradeLog.detail("Delete dbdict kmquery.");
            callrad("apm.upgrade.fremove.file", ["names,1"], ["kmquery"]);
        }
    }

    if (fromIndex == lib.upgradeVersionUtil.getVersionIndex("9.41.0020 PD")) {
        var upgradestatus = lib.upgradeUtility.getUpgradeStatus();
        if (upgradestatus != null && upgradestatus["option"] == "rename") {
            lib.upgradePDMigration.updateHybridCategory();
        }
    }

    if (lib.upgradeVersionUtil.getPdVersion() == "" && fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.50.0025")) {
        renameClassicProcesses();
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.51.0015")) {
        // remove "coderevision" because 950 OOB dbdict is not able to be updated
        lib.upgradeLog.detail("Delete dbdict coderevision.");
        callrad("apm.upgrade.fremove.file", ["names,1"], ["coderevision"]);
    }

    if (fromIndex <= lib.upgradeVersionUtil.getVersionIndex("9.60.0007")) {
        // update legacy codes
        updateCodes();
    }

    // update legacy scmessage
    updateLegacyScmessages();

    checkDbdictNumberColumn();

    // remove dbdict, for example, reportcache
    lib.upgradeCommonHelper.removeDbdicts();

    fixDatadict();

    lib.upgradeHelper.cleanPdPatches();

    // cleanup legacy PD data
    cleanLegacyProcessDesignerData();

    lib.upgradeCommonHelper.fixDbdictRcenv();

    lib.upgradeCommonHelper.fixSystemData();
}


/**
 * Remove temporary dbdict which start with "SMSQL"
 */
function removeTemporaryDbdict() {
    lib.upgradeLog.detail("Remove temporary dbdict.");

    var dbdict = new SCFile("dbdict");
    var rc = dbdict.doSelect('name#"SMSQL"');
    while (rc == RC_SUCCESS) {

        try {
            callrad("apm.upgrade.fremove.file", ["names,1"], [dbdict.name]);
            var msg = funcs.scmsg(203, "object", ["dbdict", dbdict.name]);
            lib.upgradeLog.detail(msg);
        } catch (e) {
            lib.upgradeLog.error(e.toString());
        }

        rc = dbdict.getNext();
    }
}


/**
 * Stop inactivity timer
 */
function stopInactivityTimer() {
    if (lib.upgradeCommonHelper.isValidScriptLibrary("InactiveTimerSetup")) {
        var info = lib.InactiveTimerSetup.getInfo();
        var process = info.process_start_infos;
        var status = process[0][1][0];

        if (status == "active") {
            lib.upgradeLog.detail("Stop Inactivity Timer.");
            lib.InactiveTimerSetup.stopInactiveTimer();
        }
    }
}


function updateWorkflowPhase() {
    lib.upgradeLog.upgrade("Update WorkflowPhase.");
    lib.upgradeLog.detail("Update WorkflowPhase.");

    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"WorkflowPhase\"");
    if (dbdict == null) {
        return;
    }

    var record = new SCFile("WorkflowPhase");
    var rc = record.doSelect("tableName#\"cm3\"");

    while (rc == RC_SUCCESS) {
        var i;

        if (record['phaseName'] === "closed") {
            record['phaseName'] = "Closed";
            record.doUpdate();
            lib.upgradeLog.detail("Workflow Phase " + record['phaseName'] + " of " + "Workflow " + record['workflowName'] + " is updated from \"closed\" to \"Closed\"");
        }

        var length;

        if (record['manualTransition'] != null && funcs.lng(record['manualTransition']) > 0) {
            length = funcs.lng(record['manualTransition']);
            for (i = 0; i < length; i++) {
                if (record['manualTransition'][i]['mtToPhase'] != null && record['manualTransition'][i]['mtToPhase'] === "closed") {
                    record['manualTransition'][i]['mtToPhase'] = "Closed";
                    record.doUpdate();
                    lib.upgradeLog.detail("toPhase field in Manual transition in Workflow Phase " + record['phaseName'] + " of " + "Workflow " + record['workflowName'] + " is updated from \"closed\" to \"Closed\"");
                }
            }
        }

        if (record['autoTransition'] != null && funcs.lng(record['autoTransition']) > 0) {
            length = funcs.lng(record['autoTransition']);
            for (i = 0; i < length; i++) {
                if (record['autoTransition'][i]['atToPhase'] != null && record['autoTransition'][i]['atToPhase'] === "closed") {
                    record['autoTransition'][i]['atToPhase'] = "Closed";
                    record.doUpdate();
                    lib.upgradeLog.detail("toPhase field in Auto transition in Workflow Phase " + record['phaseName'] + " of " + "Workflow " + record['workflowName'] + " is updated from \"closed\" to \"Closed\"");
                }
            }
        }

        rc = record.getNext();
    }
}

function updateWorkflowHistory() {
    lib.upgradeLog.upgrade("Update WorkflowHistory.");
    lib.upgradeLog.detail("Update WorkflowHistory.");

    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"WorkflowHistory\"");
    if (dbdict == null) {
        return;
    }

    var record = new SCFile("WorkflowHistory");
    var rc = record.doSelect("linkedTableName#\"cm3\"");

    while (rc == RC_SUCCESS) {
        if (record['fromPhase'] == "closed") {
            record['fromPhase'] = "Closed";
            record.doUpdate();
            lib.upgradeLog.detail("fromPhase field in WorkflowHistory " + record['id'] + " is updated from \"closed\" to \"Closed\"");
        }

        if (record['toPhase'] == "closed") {
            record['toPhase'] = "Closed";
            record.doUpdate();
            lib.upgradeLog.detail("toPhase field in WorkflowHistory " + record['id'] + " is updated from \"closed\" to \"Closed\"");
        }

        rc = record.getNext();
    }

}

function updateWorkflowHistoryFast() {
    var tablename = lib.upgradeUtility.getDatabaseTableName("WorkflowHistory");
    if (tablename == null) {
        return;
    }

    lib.upgradeLog.upgrade("Update WorkflowHistory.");
    lib.upgradeLog.detail("Update WorkflowHistory.");

    var dbType = lib.dbdictHelper.getDbType();

    lib.upgradeLog.detail("Updating the field fromPhase in WorkflowHistory from closed to Closed...");
    var sql1 = "update " + tablename + " set " + escapeDbField(dbType, "FROMPHASE") + "='Closed' where " + escapeDbField(dbType, "FROMPHASE") + "='closed'";
    lib.upgradeHelper.executeSQL(sql1);
    lib.upgradeLog.detail("Finish updating the field fromPhase in WorkflowHistory from closed to Closed.");

    lib.upgradeLog.detail("Updating the field toPhase in WorkflowHistory from closed to Closed...");
    var sql2 = "update " + tablename + " set " + escapeDbField(dbType, "TOPHASE") + "='Closed' where " + escapeDbField(dbType, "TOPHASE") + "='closed'";
    lib.upgradeHelper.executeSQL(sql2);
    lib.upgradeLog.detail("Finish updating the field toPhase in WorkflowHistory from closed to Closed.");
}

function updateCm3rCatPhase() {
    lib.upgradeLog.upgrade("Update cm3rcatphase.");
    lib.upgradeLog.detail("Update cm3rcatphase.");

    var record = new SCFile("cm3rcatphase");
    var rc = record.doSelect("name=\"closed\"");

    if (rc == RC_SUCCESS) {
        var findRecord = $("cm3rcatphase", SCFILE_READONLY).setFields(["name"]).select("name=\"Closed\"").uniqueResult();
        if (findRecord == null) {
            record["name"] = "Closed";
            record.doUpdate();
            lib.upgradeLog.detail("cm3rcatphase is updated from \"closed\" to \"Closed\"");
        }
    }

}

function updateAllScmessages() {
    lib.upgradeLog.upgrade("Update scmessage.");
    lib.upgradeLog.detail("Update scmessage.");
    var activedSupportedLanguages = lib.upgradeLanguage.getActivedSupportedLanguages();
    var i;
    for (i = 0; i < activedSupportedLanguages.length; i++) {
        updateScmessage(activedSupportedLanguages[i]);
    }
}

function updateScmessage(language) {
    lib.upgradeLog.detail("Update scmessage for " + language);

    var record = new SCFile("scmessage");
    var rc = record.doSelect("class=\"local:WorkflowPhase\" and message.id#\"closed\" and syslanguage=\"" + language + "\"");

    while (rc == RC_SUCCESS) {
        if (record['message.id'].indexOf("cm3t") !== -1 || record['message.id'].indexOf("cm3r") !== -1) {
            record['message.id'] = record['message.id'].replace("closed", "Closed");
            if (record['message'] === "closed") {
                record['message'] = "Closed";
            }
            record.doUpdate();
            lib.upgradeLog.detail("update from \"closed\" to \"Closed\" in scmessage \"" + record['message.id'] + "\"");
        }

        rc = record.getNext();
    }
}

function updateSecRights() {
    if (lib.upgradeCommonHelper.isValidTable("secRights")) {
        lib.upgradeLog.upgrade("Update secRights.");
        lib.upgradeLog.detail("Update secRights.");

        var right = new SCFile("secRights");
        var rc = right.doSelect("role=\"default\"");
        while (rc == RC_SUCCESS) {
            if (right["role"] == "default") {
                right["role"] = "DEFAULT";
                right.doUpdate();
            }
            rc = right.getNext();
        }
    }
}

function updateSecRole() {
    if (lib.upgradeCommonHelper.isValidTable("secRole")) {
        lib.upgradeLog.upgrade("Update secRole.");
        lib.upgradeLog.detail("Update secRole.");

        var role = new SCFile("secRole");
        var rc = role.doSelect("name=\"default\"");
        while (rc == RC_SUCCESS) {
            if (role["name"] == "default") {
                role["name"] = "DEFAULT";
                role.doUpdate();
            }
            rc = role.getNext();
        }
    }
}

function updateSqldbinfo() {
    if (lib.upgradeDatabaseFieldTypeUpdate.getDbType() != 0) {
        return;
    }

    var sqldbinfo = lib.upgradeUtility.getRecord("sqldbinfo", "sql.db.type=\"sqlserver\"");
    if (sqldbinfo != null) {
        if (sqldbinfo["max.row.size"] == null || sqldbinfo["max.row.size"] != 0) {
            sqldbinfo["max.row.size"] = 0;
            var rc = sqldbinfo.doUpdate();
            if (rc == RC_SUCCESS) {
                lib.upgradeLog.detail("The field max.row.size of sqldbinfo sqlserver is updated to 0.");
            }
        }
    }
}

function fixDatadict() {
    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"kmknowledgebasetemp\"");
    var datadict = lib.upgradeUtility.getRecord("datadict", "name=\"kmknowledgebasetemp\"");

    if (dbdict != null && datadict == null) {
        lib.upgradeLog.detail("Fix datadict for kmknowledgebasetemp.");
        dbdict.doUpdate();
    }
}

/**
 * Cleanup legacy useless Process Designer records
 */
function cleanLegacyProcessDesignerData() {

    lib.upgradeLog.upgrade("Cleanup legacy Process Designer records.");
    lib.upgradeLog.detail("Cleanup legacy Process Designer records.");

    var objects = ["activityactions", "kmknowledgebase", "kmknowledgebasetemp", "Object", "Process", "screlconfig"];
    var suffixes = ["_for_pd4_tobe_used", "_for_pdrequest_tobe_used"];

    var i;
    var j;
    for (i = 0; i < objects.length; i++) {
        var objType = objects[i];
        var keys = lib.dbdictHelper.getUniqueKey(objType);
        if (keys == null) {
            continue;
        }
        var key = keys[0];

        $(objType).select("true").iterate(function(record) {
            var objName = record[key];

            for (j = 0; j < suffixes.length; j++) {
                var suffix = suffixes[j];

                // end with suffix
                if (objName.indexOf(suffix, objName.length - suffix.length) !== -1) {
                    record.doDelete();
                }
            }
        });
    }
}

function renameClassicProcesses() {
    lib.upgradeLog.upgrade("Rename Classic Processes.");
    lib.upgradeLog.detail("Rename Classic Processes.");
    var list = ["cm.open", "cm.open.save"];
    var suffix = ".classic";
    var process = new SCFile("Process");
    var i;
    for (i = 0; i < list.length; i++) {
        var query = "process=\"" + list[i] + "\"";
        var rc = process.doSelect(query);
        if (rc == RC_SUCCESS) {
            var old_process = process["process"];
            process["process"] += suffix;
            lib.upgradeLog.detail("Rename Classic Process " + old_process + " to " + process["process"] + ".");
            process.doUpdate();
        }
    }
}

function checkDbdictNumberColumn() {
    lib.upgradeLog.detail("Checking the SQL Name of the field number in dbdict ...");

    var dbdict = new SCFile("dbdict");
    var rc = dbdict.doSelect("true");
    while (rc == RC_SUCCESS) {
        var fields = dbdict["field"];
        var i;
        var length = fields.length();
        for (i = 0; i < length; i++) {
            var field = fields[i];
            if (field["name"] == "number") {
                var columnName = field["sql.field.options"]["sql.column.name"];
                if (columnName == "NUMBERPRGN") {
                    lib.upgradeLog.detail("The SQL Name of the field number in dbdict " + dbdict["name"] + " is NUMBERPRGN.");
                }
                break;
            }
        }
        rc = dbdict.getNext();
    }

    lib.upgradeLog.detail("Checking the SQL Name of the field number in dbdict is finished.");
}

function updateCodes() {
    lib.upgradeLog.detail("Update codes records.");
    var activeLanguages = lib.upgradeLanguage.getActivedSupportedLanguages();
    var i;
    for (i = 0; i < activeLanguages.length; i++) {
        var scmessage = new SCFile("scmessage");
        var rc = scmessage.doSelect("syslanguage=\"" + activeLanguages[i] + "\" and class=\"local:codes\" and message.id=\"taskStatus;closed\"");
        if (rc == RC_SUCCESS) {
            scmessage["message.id"] = "taskStatus;Closed";
            if (activeLanguages[i] == "en") {
                scmessage["message"] = "Closed";
            }
            scmessage.doUpdate();
        }
    }
    var fcodes = $("codes").select('type="taskStatus" and value="closed"').uniqueResult();
    if (fcodes) {
        fcodes.value = "Closed";
        fcodes.doUpdate();
        lib.upgradeLog.detail(funcs.scmsg(201, "object", ["codes", "taskStatus-closed"]));
    }
}

function updateLegacyScmessages() {
    lib.upgradeLog.detail("Update scmessage records.");

    var activeLanguages = lib.upgradeLanguage.getActivedSupportedLanguages();
    var i;
    var query;
    var fmsg;
    for (i = 0; i < activeLanguages.length; i++) {
        query = 'syslanguage="' + activeLanguages[i] + '" and class="global" and message.id="Customer"';
        fmsg = $("scmessage").find(query).uniqueResult();
        if (fmsg) {
            fmsg.message_id = "customer";
            fmsg.doUpdate();
        }

        query = 'class="wfT" and message.id="closed_Subscription_cm3r:1" and syslanguage="' + activeLanguages[i] + '"';
        fmsg = $("scmessage").find(query).uniqueResult();
        if (fmsg) {
            fmsg.message_id = "Closed_Subscription_cm3r:1";
            fmsg.doUpdate();
        }

        query = 'class="local:WorkFlowPhase" and message.id like "*;Survey;SurveyDefinition" and syslanguage="' + activeLanguages[i] + '"';
        fmsg = $("scmessage").find(query).uniqueResult();
        if (fmsg) {
            fmsg.class = "local:WorkflowPhase";
            fmsg.doUpdate();
        }
    }
}