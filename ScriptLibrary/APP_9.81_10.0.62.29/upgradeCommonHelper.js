var $ = lib.c.$;

// Upgrade logger
var logger = getLog("Upgrade");


/**
 * Compare globallists
 *
 * the globallists those set to "build.startup" will rebuild when server restarts.
 * the purpose of this method is to reduce some rename results which are not real conflict.
 */
function compareStartupGloballists(gl, prefix) {
    // compare build.startup only
    if (gl["build.startup"] != true) {
        return false;
    }

    if (prefix == null) {
        prefix = "upgrade";
    }

    // query patch data record
    var newgl = new SCFile(prefix + "globallists");
    var rc = newgl.doSelect("name=\"" + gl["name"] + "\"");

    if (rc != RC_SUCCESS || newgl["build.startup"] != true) {
        return false;
    }

    // user defined globallists
    if (gl["user.defined"] == true) {
        if (newgl["user.defined"] != true || gl["value.list"] != newgl["value.list"] || gl["display.list"] != newgl["display.list"]) {
            return false;
        }
    }

    var fields = ["guard.dups", "list.variable", "display.variable", "list.field", "display.field", "filename", "sql",
        "sort.field", "application", "server.application", "localize.values", "user.defined", "use.scmessage"
    ];

    return compareGloballistsFields(gl, newgl, fields);
}


/**
 * Compare globallists fields
 */
function compareGloballistsFields(g1, g2, fields) {
    var i;
    for (i = 0; i < fields.length; i++) {
        var result = compareGloballistsFieldValue(g1[fields[i]], g2[fields[i]]);

        if (result == false) {
            lib.upgradeLog.detail("globallists \"" + g1["name"] + "\", field \"" + fields[i] + "\" not same.");
            return false;
        }
    }

    return true;
}


/**
 * Compare globallists field value
 */
function compareGloballistsFieldValue(v1, v2) {
    if (v1 == v2) {
        return true;
    }

    // treat false same as null
    if ((v1 == null && v2 == false) || (v2 == null && v1 == false)) {
        return true;
    }

    return false;
}


function fixSystemData() {
    // fix Counters
    fixCounters();

    // fix numbers	
    fixNumbers();

    fixInboxNumber();

    // synchronize unique key
}


function isValidTable(table) {
    var fdbdict = new SCFile("dbdict", SCFILE_READONLY);
    fdbdict.setFields(["name"]);
    var rc = fdbdict.doSelect("name=\"" + table + "\"");
    return rc == RC_SUCCESS;
}


function isValidScriptLibrary(name) {
    var script = $("ScriptLibrary", SCFILE_READONLY).setFields(["name"]).select("name=\"" + name + "\"").uniqueResult();
    return script != null;
}


/**
 * Fix dirty data of Counters
 */
function fixCounters(module) {
    var isAPM = ("APM" == module);

    if (!isAPM) {
        lib.upgradeLog.upgrade("Updating counters ...");
        lib.upgradeLog.detail("Updating counters ...");
    }

    var fCounter = new SCFile("counters");
    var rcCounter = fCounter.doSelect("table.name~=\"WorkflowHistory\" and table.name~=\"msglog\"");

    while (rcCounter == RC_SUCCESS) {
        var table = fCounter.table_name;

        if (!isAPM) {
            lib.upgradeLog.detail("Updating counter of " + table);
        }

        var rc = lib.BaseUtil.synchronizeCounter(fCounter);

        if (isAPM) {
            if (rc == RC_SUCCESS) {
                lib.patchrelHelper.info(funcs.scmsg(201, "object", ["Counters", table]));
            } else if (rc == RC_ERROR) {
                lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["Counters", table]));
            }
        }

        rcCounter = fCounter.getNext();
    }
}


/**
 * Fix dirty data of Number
 */
function fixNumbers(module) {
    var numbers = [
        ["calendarFilterEditForm", "id"],
        ["calendarFilterFieldMapping", "id"],
        ["calendarFilterPredefined", "id"],
        ["eventout", "evsysseq"],
        ["idolDataFilter", "ID"],
        ["idolpbmhunter", "pbmhunter.id"],
        ["kmattachments", "id"],
        ["timeperiodCalendarMapping", "id"],
        ["timeperiodCategory", "id"],
        ["timeperiodDefinition", "id"],
        ["timeperiodOccurrence", "id"],
        ["timeperiodRule", "id"]
    ];

    var isAPM = ("APM" == module);

    if (!isAPM) {
        lib.upgradeLog.upgrade("Updating numbers ...");
        lib.upgradeLog.detail("Updating numbers ...");
    }

    var i;
    for (i = 0; i < numbers.length; i++) {
        fixNumber(numbers[i][0], numbers[i][1], null, module);
    }
}

function fixInboxNumber() {
    fixNumber("inbox", "inbox.id", 999990);
}

/**
 * Fix data of a number file
 *
 * @param	table
 * @param	field	
 */
function fixNumber(table, field, maxValue, module) {
    var ntable = table;
    if (table == "idolDataFilter") {
        ntable = "idoldatafilter";
    } else if (table == "eventout") {
        ntable = "event";
    }
    var fNumber = new SCFile("number");
    var rcNumber = fNumber.doSelect("name=\"" + ntable + "\"");

    if (rcNumber != RC_SUCCESS) {
        return;
    }

    var isAPM = ("APM" == module);

    // select record	
    var fFile = new SCFile(table, SCFILE_READONLY);
    var fields = [field];
    fFile.setFields(fields);
    var orders = [SCFILE_DSC];
    fFile.setOrderBy(fields, orders);

    var rcFile = fFile.doSelect(true);

    if (rcFile == RC_SUCCESS) {
        var updated = false;
        var value = fFile[field];

        // special for those which id type is varchar rather than number
        if (typeof value == 'string') {
            var prefix = (fNumber["prefix"] == null) ? "" : fNumber["prefix"];
            var suffix = (fNumber["suffix"] == null) ? "" : fNumber["suffix"];

            do {
                value = fFile[field].substring(prefix.length, fFile[field].length - suffix.length);
                value = Number(value);

                if ((maxValue == null || value < maxValue) && value > fNumber.number) {
                    fNumber.number = value.valueOf();
                    updated = true;
                }

                rcFile = fFile.getNext();
            }
            while (rcFile == RC_SUCCESS);
        }
        // normal counters data error
        else if ((maxValue == null || value < maxValue) && value > fNumber.number) {
            fNumber.number = fFile[field];
            updated = true;
        }

        if (updated) {
            // update Number record	
            var rc = fNumber.doUpdate();

            if (!isAPM) {
                lib.upgradeLog.detail("Updating number of " + table);
            } else {
                if (rc == RC_SUCCESS) {
                    lib.patchrelHelper.info(funcs.scmsg(201, "object", ["Number", table]));
                } else {
                    lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["Number", table]));
                }
            }
        }
    }
}


/**
 * Create schedule records
 *
 * @param	scheduleObjs
 */
function createSchedules(scheduleObjs, module) {
    var typeDateTime = lib.DataTypeConst.typeDateTime();
    var theXMLDate = new XMLDate(new Date());
    var isAPM = ("APM" == module);

    var i;
    var obj;
    var name;
    var fschedule;
    var rc;
    var message;

    // add schedule
    for (i = 0; i < scheduleObjs.adds.length; i++) {
        obj = scheduleObjs.adds[i];
        if (obj == null) {
            continue;
        }
        name = obj.name;

        fschedule = $("schedule", SCFILE_READONLY).setFields(["name"]).select("name=\"" + name + "\"").uniqueResult();
        // schedule exists already
        if (fschedule) {
            continue;
        }

        fschedule = new SCFile("schedule");

        fschedule.name = name;
        fschedule._class = obj._class;
        fschedule.sched_class = obj.sched_class;

        if (obj.description) {
            fschedule.description = [obj.description];
        }

        if (obj.repeat) {
            fschedule.repeat = funcs.val(obj.repeat, typeDateTime);
        }

        fschedule.expiration = theXMLDate.getDatum();

        fschedule.javascript = obj.javascript;
        fschedule.application = obj.application;
        fschedule.strings = obj.strings;
        fschedule.strings1 = obj.strings1;

        // set schedule.id in Upgrade
        if (!isAPM) {
            fschedule.schedule_id = obj.schedule_id;
        }

        rc = fschedule.doInsert();
        if (rc == RC_SUCCESS) {
            message = funcs.scmsg(200, "object", ["schedule", name]);
            if (isAPM) {
                lib.patchrelHelper.info(message);
            } else {
                lib.upgradeLog.detail(message);
            }
        } else {
            if (isAPM) {
                lib.patchrelHelper.error(funcs.scmsg(124, "patchrel", ["schedule", name]));
            }
        }
    }

    // update schedule
    for (i = 0; i < scheduleObjs.updates.length; i++) {
        obj = scheduleObjs.updates[i];
        if (obj == null) {
            continue;
        }
        name = obj.name;

        fschedule = $("schedule").select("name=\"" + name + "\"").uniqueResult();
        if (!fschedule) {
            continue;
        }

        if (obj.javascript) {
            fschedule.javascript = obj.javascript;
        }

        if (obj.repeat) {
            fschedule.repeat = funcs.val(obj.repeat, typeDateTime);
        }

        if (!fschedule["class"] && fschedule["sched.class"]) {
            fschedule["class"] = fschedule["sched.class"];
        }

        rc = fschedule.doUpdate();
        if (rc == RC_SUCCESS) {
            message = funcs.scmsg(201, "object", ["schedule", name]);
            if (isAPM) {
                lib.patchrelHelper.info(message);
            } else {
                lib.upgradeLog.detail(message);
            }
        } else {
            if (isAPM) {
                lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["schedule", name]));
            }
        }
    }

    // remove
    if (scheduleObjs.removes) {
        for (i = 0; i < scheduleObjs.removes.length; i++) {
            obj = scheduleObjs.removes[i];
            if (obj == null) {
                continue;
            }
            name = obj.name;

            fschedule = $("schedule").select(`name="${name}"`).one();
            if (!fschedule) {
                continue;
            }

            rc = fschedule.doDelete();
            if (rc == RC_SUCCESS) {
                message = funcs.scmsg(203, "object", ["schedule", name]);
                if (isAPM) {
                    lib.patchrelHelper.info(message);
                } else {
                    lib.upgradeLog.detail(message);
                }
            } else {
                if (isAPM) {
                    lib.patchrelHelper.error(funcs.scmsg(122, "patchrel", ["schedule", name]));
                }
            }
        }
    }

}


/**
 * Get post upgrade prompt message
 *
 * @param {String} 	module, APM or Upgrade
 * @returns {String}
 */
function getPostUpgradePromptMessage(module) {
    var msgs;
    if (module == "APM") {
        msgs = [];
    } else {
        msgs = [
            getPostUpgradePromptMessageForLogicalName(),
            getPostUpgradePromptMessageForEndUserChat(),
            getPostUpgradePromptMessageForMigratePDData()
        ];
    }

    var message = "";

    var i;
    for (i = 0; i < msgs.length; i++) {
        var msg = msgs[i];
        if (message.length == 0) {
            message = msg;
        } else if (msg.length > 0) {
            message += "\n" + msg;
        }
    }

    return message;
}


/**
 * Get post upgrade prompt message for logical name feature
 *
 * @returns {String}
 */
function getPostUpgradePromptMessageForLogicalName() {
    var msg1 = funcs.scmsg(450, "upg") + "\n";
    var msg2 = "";
    var msg3 = funcs.scmsg(451, "upg");

    // get field list
    var mfields = lib.DisplayName.getAliasTableMapFields();

    var i;
    var j;
    for (i = 0; i < mfields.length; i++) {
        var mfield = mfields[i];
        var table = mfield.table;
        var fields = mfield.fields;

        for (j = fields.length - 1; j >= 0; j--) {
            var result = checkAliasTable(table, fields[j]);

            // remove the field which mapped to alias table
            if (result) {
                fields.pop();
            }
        }

        if (fields.length > 0) {
            msg2 += "  " + table + ": " + fields.toString() + "\n";
        }
    }

    // no field need to mapped
    if (msg2.length == 0) {
        return "";
    }

    return msg1 + msg2 + msg3;
}


/**
 * Check whether field is mapped to alias table
 *
 * @param {String} table
 * @param {String} field
 * @returns {Boolean} true if field mapped to an alias table 
 */
function checkAliasTable(table, field) {
    var dbdict = $(table, SCFILE_READONLY).dbdict();
    var fields = dbdict.field;

    var i;
    var length = fields.length();
    for (i = 0; i < length; i++) {
        var f = fields[i];

        // check array type field
        if (f.name == field && f.type == lib.DataTypeConst.typeArray()) {
            // alias table start with 'a'
            var alias = f.sql_field_options.sql_table_alias;
            return (alias != null && alias.toLowerCase().indexOf("a") == 0);
        }
    }

    return false;
}


/**
 * Get post upgrade prompt message for end user chat
 *
 * @returns {String}
 */
function getPostUpgradePromptMessageForEndUserChat() {
    var result = checkAliasTable("device", "support.groups");
    if (result) {
        return "";
    }

    return funcs.scmsg(453, "upg");
}


/**
 * Get post upgrade prompt message for migrate process designer data
 *
 * @returns {String}
 */
function getPostUpgradePromptMessageForMigratePDData() {
    return funcs.scmsg(452, "upg");
}


/**
 * Check kmquery dbdict structure
 *
 * @returns {Boolean}
 */
function checkKmqueryDbdict() {
    var dbdict = new SCFile("dbdict", SCFILE_READONLY);
    var rc = dbdict.doSelect("name=\"kmquery\"");
    if (rc != RC_SUCCESS) {
        return false;
    }

    var fields = dbdict.field;
    var i;
    var length = fields.length();
    for (i = 0; i < length; i++) {
        var field = fields[i];

        // check sql table mapping
        var alias = field.sql_field_options.sql_table_alias;

        // not map to nulltable
        if (alias != null && alias.length > 0 && alias.slice(0, 1).toLowerCase() == "n") {
            return false;
        }

        if (field.level == 1) {
            // boolean type should not be null
            if (field.type == 4 && alias == null) {
                return false;
            }
        }
    }

    return true;
}


/**
 * Get legacy content pack modules
 *
 * @returns {Array}
 */
function getLegacyContentPackModules() {
    return [
        "Process_Designer",
        "Process_Designer_LanguagePack",
        "Risk Assessment",
        "Survey_Integration",
        "UCMDB_Enhancement"
    ];
}


/**
 * Deprecate legacy content packs
 *
 * Those content packs have been merged into OOB already, no need to show in the scversion UI after upgrade. 
 *
 * @param {String} upgradeType
 */
function deprecateLegacyContentPack(upgradeType) {
    var isAPM = ("APM" == upgradeType);
    var cpmodules = getLegacyContentPackModules();

    $("contentversion").selectAll().iterate(function(content) {
        var module = content.module;

        if (module.indexOf("LanguagePack") == 0 || lib.ArrayUtil.contains(cpmodules, module)) {

            if (content.deprecated) {
                return false;
            }

            // deprecate content pack infomation
            content.deprecated = true;
            var rc = content.doUpdate();

            var message;
            if (rc == RC_SUCCESS) {
                message = funcs.scmsg(201, "object", ["contentversion", module]);
                if (isAPM) {
                    lib.patchrelHelper.debug(message);
                } else {
                    lib.upgradeLog.detail(message);
                }
            } else {
                message = funcs.scmsg(121, "patchrel", ["contentversion", module]);
                if (isAPM) {
                    lib.patchrelHelper.error(message);
                } else {
                    lib.upgradeLog.error(message);
                }
            }
        }
    });

}


/**
 * Expire globallists
 *
 * @param {String} module
 */
function expireGlobalLists(module) {
    var isAPM = ("APM" == module);

    // update expiration date if build at startup with filename
    // exclude "Startup Lists" because it will cause issue occasionally
    var query = "not null(filename) and build.startup = true and name ~= \"Startup Lists\"";
    $("globallists").select(query).iterate(function(list) {
        list.expiration = new Date();
        var rc = list.doUpdate();

        if (rc != RC_SUCCESS) {
            var message = funcs.scmsg(121, "patchrel", ["globallists", list.name]);
            if (isAPM) {
                lib.patchrelHelper.error(message);
            } else {
                lib.upgradeLog.error(message);
            }
        }
    });

}


/**
 * Clean legacy data in configuration item module
 *
 * @param {String} module
 */
function cleanLegacyConfigurationItemModule(module) {
    var isAPM = ("APM" == module);

    // delete legacy ModuleStatus records which workflow is empty
    var query = 'module="device" and null(workflow)';
    $("ModuleStatus").select(query).iterate(function(status) {
        status.doDelete();

        var msg = funcs.scmsg(203, "object", ["ModuleStatus", "device-" + status.status + "-empty"]);
        if (isAPM) {
            lib.patchrelHelper.detailLog(msg);
        } else {
            lib.upgradeLog.detail(msg);
        }
    });
}


/**
 * Update special scmessages
 *
 * @param {String} module
 */
function updateScMessages(module) {
    // remove '\n' at the end of scmenu message
    const msgId = "INCIDENT MANAGEMENT-Incident Mgmt Admin Menu";
    const query = 'class="scmenu" and message.id="' + msgId + '\n"';

    var updated = false;

    $("scmessage").select(query).each(function(fmsg) {
        if (fmsg.message_id.endsWith('\n')) {
            fmsg.message_id = fmsg.message_id.substring(0, fmsg.message_id.length - 1);

            if (fmsg.message.endsWith('\n')) {
                fmsg.message = fmsg.message.substring(0, fmsg.message.length - 1);
            }

            var rc = fmsg.doUpdate();
            if (rc == RC_SUCCESS) {
                updated = true;
            }
        }
    });

    if (updated) {
        var msg = funcs.scmsg(201, "object", ["scmessage", msgId]);
        var isAPM = ("APM" == module);
        if (isAPM) {
            lib.patchrelHelper.detailLog(msg);
        } else {
            lib.upgradeLog.detail(msg);
        }
    }

}


/**
 * Return the current upgrade type
 *
 * @returns {String} upgrade type, "Upgrade" or "APM" 
 */
function getCurrentUpgradeType() {
    // get the latest upgradehistory	
    var history = $("upgradehistory", SCFILE_READONLY).setOrderBy(["id"], [SCFILE_DSC]).select("id>0").uniqueResult();
    if (history == null) {
        return "Upgrade";
    }

    var type = history.type;
    if ("Upgrade" == type || "APM" == type) {
        return type;
    }

    var versionOld = history.old_version;
    var versionNew = history.new_version;

    return getUpgradeType(versionOld, versionNew);
}


/**
 * Return the upgrade type according to the versions
 *
 * @param 	{String} versionOld 
 * @param 	{String} versionNew
 * @returns {String} upgrade type, "Upgrade" or "APM" 
 */
function getUpgradeType(versionOld, versionNew) {

    if (versionOld == null || versionNew == null) {
        return "Upgrade";
    }

    // version start with letter is Content Pack, return APM 
    var regexp = /^[A-Za-z]/;
    if (regexp.test(versionOld) || regexp.test(versionNew)) {
        logger.debug("Version in upgradehistory is for Content Pack.");
        return "APM";
    }

    var olds = versionOld.split('.');
    var news = versionNew.split('.');

    var i;
    var length = Math.min(olds.length, news.length);
    for (i = 0; i < length; i++) {
        var n1 = Number(olds[i]);
        var n2 = Number(news[i]);

        // invalid version
        if (n1 > n2 || Number.isNaN(n1) || Number.isNaN(n2)) {
            logger.warn("Invalid version in upgradehistory.");
            return "Upgrade";
        }

        if (n1 == n2) {
            continue;
        }

        // different major version. e.g. 7.11, 9.40
        if (i == 0) {
            return "Upgrade";
        }
        /*
         * different minor version, e.g.
         * Upgrade: 9.21, 9.40
         * APM    : 9.40, 9.41
         */
        else if (i == 1) {
            return Math.floor(n1 / 10) < Math.floor(n2 / 10) ? "Upgrade" : "APM";
        } else {
            return "APM";
        }
    }

    return "APM";
}


function updateInboxLocalization(upgradeType, INBOX_NUMBER_LIMIT) {
    upgradeType = upgradeType == null ? "Upgrade" : upgradeType;
    var logerror = lib.upgradeLog.error;
    var logdetail = lib.upgradeLog.detail;
    if (upgradeType == "APM") {
        logerror = lib.patchrelHelper.error;
        logdetail = lib.patchrelHelper.info;
    }

    logdetail("Update Inbox Localization.");

    INBOX_NUMBER_LIMIT = INBOX_NUMBER_LIMIT == null ? 5000 : INBOX_NUMBER_LIMIT;

    var inbox = new SCFile("inbox", SCFILE_READONLY);
    inbox.setFields("inbox.id");
    var count = inbox.doCount("true");
    if (count <= 0) {
        return;
    } else if (count > INBOX_NUMBER_LIMIT) {
        logerror("The number of inbox is more than " + INBOX_NUMBER_LIMIT + " and Upgrade Utility will not generate inbox localization information. Please follow the upgrade guide to do it.");
    } else {
        lib.localizeTable.createAllEntries("inbox", "inbox.name");
        logdetail("Update " + count + " Inbox Localization.");
    }
}


/**
 * Update Service Catalog Connection Localization
 */
function updateSvcCatInterfaceLocalization(upgradeType) {
    var logdetail = lib.upgradeLog.detail;
    if (upgradeType == "APM") {
        logdetail = lib.patchrelHelper.info;
    }

    logdetail("Update Catalog Connector Localization.");
    lib.localizeTable.createAllEntries("svcCatInterface", "interface.name");
}


/**
 * update system language which is null
 *
 * @param {String} filename
 * @param {String} language
 */
function updateSystemLanguage(filename, language) {
    var sqlTable = lib.upgradeUtility.getDatabaseTableName(filename);

    var dbType = lib.dbdictHelper.getDbType();
    var lanField = lib.upgradeHelper.escapeDbField(dbType, "SYSLANGUAGE");

    var batchUpdateSql = `update ${sqlTable} ` +
        `set ${lanField}='${language}' where ${lanField} is NULL`;

    lib.upgradeLog.detail('Update ' + funcs.scmsg(filename, "tablename") + ' System Language.');

    lib.upgradeHelper.executeSQL(batchUpdateSql);
}


/**
 * Fix dbdict "rcenv"
 */
function fixDbdictRcenv() {

    var found = false;

    var dbdict = $("rcenv").dbdict();
    var fields = dbdict.field;

    var i;
    var length = fields.length();
    for (i = 0; i < length; i++) {
        var field = fields[i];

        if (field.name == "pmt.AllowedStatus") {
            found = true;
            field.name = "pmt.allowedStatus";

            // the field type is array, change next field together
            field = fields[++i];
            if (field.name == "pmt.AllowedStatus") {
                field.name = "pmt.allowedStatus";
            }

            continue;
        }

        // the field is updated in 9.63, but 9.63 upgrade utility not merge the dbdict correctly.
        // so there will be 2 fields in dbdict after upgrade to 9.63. 
        if (field.name == "pmt.allowedStatus") {
            if (!found) {
                break;
            }

            field.name = "fieldNotUsed";
            field = fields[++i];
            if (field.name == "pmt.allowedStatus") {
                field.name = "fieldNotUsed";
            }

            break;
        }
    }

    if (found) {
        var rc = dbdict.doUpdate();
        var msg = funcs.scmsg(201, "object", ["dbdict", "rcenv"]);
        lib.upgradeLog.detail(msg);
    }
}

function removeDbdicts() {
    lib.upgradeLog.detail("Removing dbdicts. ");
    var dbdictNames = ["reportcache"];
    var i;
    for (i = 0; i < dbdictNames.length; i++) {
        removeDbdict(dbdictNames[i]);
    }
    lib.upgradeLog.detail("Removed dbdicts. ");
}

function removeDbdict(name) {
    var dbdict = new SCFile("dbdict");
    var rc = dbdict.doSelect("name=\"" + name + "\"");
    if (rc == RC_SUCCESS) {
        dbdict.doRemove();
        lib.upgradeLog.detail("Removed dbdict " + name);
    }
}