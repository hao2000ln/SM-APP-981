var Util = lib.DeltaMigrationUtil;
var RECORD_LIMIT_FOR_UNL = 300;


/**
 * this function will do some initialize function before exporting
 */
function unload_data_init() {
    Util.messageList_init();
    Util.kpiList_init();

    var i;
    for (i = 1; i <= 5; i++) {
        Util.scheduler_register("bg_load_unload" + i);
        Util.scheduler_watchDogHungry("bg_load_unload" + i);
    }
    // if background schedule has started, then within 1 minutes, kpi "bg_load_unload*" will have title=1
    var f = new SCFile("schedule");
    f.expiration = new Date();
    for (i = 1; i <= 5; i++) {
        f.name = "bg_load_unload" + i + " report.";
        f.javascript = "lib.DeltaMigrationUtil.scheduler_watchDogFeed(\"bg_load_unload" + i + "\");";
        f._class = "bg_load_unload" + i;
        f.doInsert();
    }
}


// check parameters before exporting using opt 1.
function unload_data_parameters_ok_opt1() {
    var currentOperatorTimezone = Util.getCurrentOperatorTimezone();
    var currentOperatorDateFormat = Util.getCurrentOperatorDateFormat();
    if (currentOperatorDateFormat == "Not set") {
        Util.messageList_add("error", "Please specify date format for " + funcs.operator());
        return false;
    }
    if (currentOperatorTimezone == "Not set") {
        Util.messageList_add("error", "Please specify time zone for " + funcs.operator());
        return false;
    }
    return true;
}


// check parameters before exporting using opt 2.
function unload_data_parameters_ok(FILE_PATH, start_date, end_date) {
    var currentOperatorTimezone = Util.getCurrentOperatorTimezone();
    var systemDefaultTimezone = Util.getSystemDefaultTimezone();
    var currentOperatorDateFormat = Util.getCurrentOperatorDateFormat();
    var systemDefaultDateFormat = Util.getSystemDefaultDateFormat();
    if (systemDefaultDateFormat.indexOf("yyyy") < 0) {
        Util.messageList_add("error", "Please use 4 digits year in System Information Record's data format.");
        return false;
    }
    if (currentOperatorTimezone != systemDefaultTimezone) {
        Util.messageList_add("error", "Please use same timezone as that in System Information Record.");
        return false;
    }
    if (currentOperatorDateFormat != systemDefaultDateFormat) {
        Util.messageList_add("error", "Please use same date format as that in System Information Record.");
        return false;
    }
    if (end_date >= new Date()) {
        Util.messageList_add("error", "End time should be earlier than now.");
        return false;
    }
    if (start_date >= end_date) {
        Util.messageList_add("error", "Start time should be earlier than end time.");
        return false;
    }
    return true;
}


/**
  function before data loading by lots of unl files
  return value will be used to setup $tablesToBeExported, which is a array, its item is:
    <table name>$
    <timestamp field>$
    <suggestion, such as 'export by default', 'need confirm'>$
    <time estimation, in seconds>$
    <unload or not, 'true' or 'false', if 'suggestion is 'export by default', it is 'true', otherwise it is false, but user can modify in next GUI>$
    <comments, such as 'table structure are same', can be modified by user later>
  $tablesToBeExported  will be displayed and updated in next wizard, for user to select which tables are to be exported
  
  input:  1,  folder that contains UNL files
          2,  time range
  output: 1,  return value will be used to setup $tablesToBeExported
*/
function unload_data_pre_check(FILE_PATH, start_date, end_date) {

    Util.messageList_init();
    Util.messageList_add("debug", "function unload_data_pre_check(FILE_PATH,str_start_date,str_end_date) START");

    var operatorTimeZone = lib.tzFunctions.getTZforOperator(funcs.operator());
    var contentForReadme = "";
    contentForReadme += "This folder contains files for delata migration, \n";
    contentForReadme += "Time range from " + start_date + " to " + end_date + "(timezone:" + operatorTimeZone + ").\n";
    contentForReadme += "\n";
    contentForReadme += "Files under this folder(please don't modify them):\n";
    contentForReadme += "Overall Export Status Report.html    real-time report for the migration process, to be used when exporting.\n";
    contentForReadme += "table_exported.txt    record how many tables have delta data and UNL(s) exported, this information will be used during importing.\n";
    contentForReadme += "Overall Import Status Report.html    real-time report for the migration process, to be used when importing.\n";
    contentForReadme += "<SM table name>_unload_result.txt    record how many UNLs are to be migrated for specified table.\n";
    contentForReadme += "<SM table name>_unload_structure.txt    describe the table structure of old environment, will be used to be compared with table structure in new environment.\n";
    contentForReadme += "<SM table name>_unload_structure_new.txt    describe the table structure of new environment.\n";
    contentForReadme += "<SM table name>_<start time>_<end time>.UNL    unloaded UNL files, format of start and end time is 'yyyymmdd_hhMMss'\n";
    writeFile(FILE_PATH + "readme.txt", 't', contentForReadme);

    var contentFeedback = readFile(FILE_PATH + "readme.txt", "t");
    if (contentFeedback == contentForReadme) {
        Util.messageList_add("info", "Output folder ready.");
    } else {
        Util.messageList_add("error", "Can't write files into output folder.");
        return null;
    }

    var array_tableToBeExported = [];
    var tableToBeExported = "";

    // check background schedulers
    if (!Util.scheduler_areAllStarted()) {
        Util.messageList_add("error", "background scheduler 'dmt_unload_load*' not started yet, please start them in 'System Status'. If they are already there, wait for 1 minute and try again.");
        return array_tableToBeExported;
    }

    var array_fileAndTimestampField = getPotentialFilesAndTimestampFieldFromDbdict();

    // tables to be exported    
    array_tableToBeExported = generateExportTables(array_fileAndTimestampField, start_date, end_date);

    // register tables with delta data, to estimate unload time
    var fkpi = new SCFile("DeltaMigToolKPI");
    if (RC_SUCCESS == fkpi.doSelect("kpiName#\"export_\"")) {
        do {
            fkpi.doDelete();
        }
        while (RC_SUCCESS == fkpi.getNext());
    }

    var row;
    var tableName;
    var timestampField;
    var sQuery;

    var i;
    for (i = 0; i < array_tableToBeExported.length; i++) {
        row = array_tableToBeExported[i].split("$");
        tableName = row[0];
        timestampField = row[1];

        if (row[4] == "false") {
            continue;
        }
        Util.messageList_add("info", "check " + tableName);

        sQuery = timestampField + ">='" + Util.dateTime_convertDatetoString(start_date, vars.$lo_operator.date_order) + "'" +
            " and " + timestampField + "<'" + Util.dateTime_convertDatetoString(end_date, vars.$lo_operator.date_order) + "'";

        var kpiName = "export_" + tableName + "_" + Util.getTimeString2(start_date) + "_" + Util.getTimeString2(end_date);
        var unlFileName = tableName + "_" + Util.getTimeString2(start_date) + "_" + Util.getTimeString2(end_date) + ".unl";
        var estimatedTime = parseFloat(row[3]);
        Util.kpiList_register(kpiName, tableName, sQuery, estimatedTime, unlFileName, 1, start_date, end_date);
    }
    Util.kpiList_calculateRecordsNumber();

    for (i = 0; i < array_tableToBeExported.length; i++) {
        row = array_tableToBeExported[i].split("$");
        tableName = row[0];
        timestampField = row[1];
        var suggestion = row[2];
        estimatedTime = parseFloat(row[3]);
        var exportOrNot = row[4];

        if (RC_SUCCESS == fkpi.doSelect("kpiName#\"export_" + tableName + "\"")) {
            if (fkpi.recordsNumber != null) {
                estimatedTime += fkpi.recordsNumber / 300;
            }
            estimatedTime = Math.floor(estimatedTime * 100) / 100;
        }

        tableToBeExported = "";
        tableToBeExported += tableName + "$" + timestampField + "$";
        tableToBeExported += suggestion + "$";
        tableToBeExported += estimatedTime + "$";
        tableToBeExported += exportOrNot + "$";

        array_tableToBeExported[i] = tableToBeExported;
    }

    Util.messageList_add("debug", "function unload_data_pre_check(FILE_PATH,str_start_date,str_end_date) END");
    Util.messageList_add("info", "finish checking before unload.");

    // sort export tables
    array_tableToBeExported = sortExportTable(array_tableToBeExported);

    return array_tableToBeExported;
}


/**
 * generate tables to be exported
 *
 * @param {Array} fileAndTimestampFields
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array}
 */
function generateExportTables(fileAndTimestampFields, startDate, endDate) {
    var exportTables = [];

    var tableName;
    var timestampField;
    var tableToBeExported;
    var sQuery;

    var i;
    for (i = 0; i < fileAndTimestampFields.length; i++) {
        tableName = fileAndTimestampFields[i].split(",")[0];
        timestampField = fileAndTimestampFields[i].split(",")[1];
        if (timestampField == null || timestampField == "") {
            tableToBeExported = "";
            tableToBeExported += tableName + "$" + timestampField + "$";
            tableToBeExported += "no sysmodtime field$";
            tableToBeExported += "0" + "$";
            tableToBeExported += "false$";

            exportTables.push(tableToBeExported);
            continue;
        }

        var ff = new SCFile(tableName, SCFILE_READONLY);
        var ufields = ff.getUniqueFields();
        ff.setFields(ufields.length > 0 ? ufields : timestampField);

        var sampleSearchStartTime = new Date();

        // search by start time and end time first, just to check if delta data exists or not
        sQuery = timestampField + ">='" + Util.dateTime_convertDatetoString(startDate, vars.$lo_operator.date_order) + "'" +
            " and " + timestampField + "<'" + Util.dateTime_convertDatetoString(endDate, vars.$lo_operator.date_order) + "'";

        sQuery = appendQuery(tableName, sQuery);

        Util.messageList_add("debug", "check delta data in " + tableName + "...");

        // check if there is data
        if (ff.doSelect(sQuery) != RC_SUCCESS) {
            tableToBeExported = "";
            tableToBeExported += tableName + "$" + timestampField + "$";
            tableToBeExported += "no delta data within time range$";
            tableToBeExported += "0" + "$";
            tableToBeExported += "false$";

            exportTables.push(tableToBeExported);
            continue;
        }

        Util.messageList_add("info", "find delta data in " + tableName);

        var sampleSearchEndTime = new Date();
        var secondsConsumed = 0.001 * (sampleSearchEndTime - sampleSearchStartTime); // time used for scan all records in the table
        secondsConsumed = Math.round(secondsConsumed * 10) / 10;

        tableToBeExported = "";
        tableToBeExported += tableName + "$" + timestampField + "$";
        tableToBeExported += "export by default$";
        tableToBeExported += secondsConsumed + "$";
        tableToBeExported += "true$";

        exportTables.push(tableToBeExported);
    }

    return exportTables;
}


function appendQuery(tableName, query) {

    // support multiple languange environment
    const l10nlist = [
        "format",
        "help",
        "scmessage",
        "unitofmeasure"
    ];

    // make sure to query all languages
    if (lib.ArrayUtil.contains(l10nlist, tableName)) {
        query += ' and syslanguage~="xxx"';
    }

    return query;
}


function sortExportTable(table) {

    return table.sort(function(row1, row2) {

        var a1 = row1.split("$");
        var a2 = row2.split("$");

        // sort by migrate decision first		
        var n1 = 0;
        var n2 = 0;
        if (a1[4] == "true" || a1[4] == true) {
            n1 = -1;
        }
        if (a2[4] == "true" || a2[4] == true) {
            n2 = -1;
        }
        if (n1 != n2) {
            return n1 - n2;
        }

        var name1 = a1[0] || "";
        var name2 = a2[0] || "";

        return name1.localeCompare(name2);
    });
}


/**
  main function for data migration by lots of unl files
  create background schedule for data unloading
  input:  1,   folder to contain UNL files 
          2,   start time, end time
          3,   array_tableToBeExported, which is generated by function 'unload_data_pre_check' and modified by wizard '...Check_before_Export' 
  output: 1,  lots of "schedule" record, to run app "unload.background", the parameters for this app are:
    strings[2]: target unl file name
    strings[3]: condition to retrieve records by
    strings[4]: table to retrieve records from       
         2,   after this “schedule" record performed, a lots of unl files will be created in specified folder.
*/
function unload_data_utility(FILE_PATH, start_date, end_date, array_tableToBeExported) {

    Util.messageList_add("info", "start creating schedule for unload.");

    writeFile(FILE_PATH + "table_exported.txt", "t", "Table Name,Timestamp Field Name\n");
    var fkpi = new SCFile("DeltaMigToolKPI");
    if (RC_SUCCESS == fkpi.doSelect("kpiName#\"export_\"")) {
        do {
            fkpi.doDelete();
        }
        while (RC_SUCCESS == fkpi.getNext());
    }

    var i;
    var length = lib.ArrayUtil.length(array_tableToBeExported);
    for (i = 0; i < length; i++) {
        var row = array_tableToBeExported[i].split("$");
        var tableName = row[0];
        var timestampField = row[1];

        if (row[4] == "false") {
            continue;
        }
        Util.messageList_add("info", "check " + tableName);
        var structureDescrp = Util.getTableStructureFromDbdict(tableName);
        writeFile(FILE_PATH + tableName + "_unload_structure.txt", 't', structureDescrp);

        var sQuery = "true";
        if (timestampField) {
            sQuery = timestampField + ">='" + Util.dateTime_convertDatetoString(start_date, vars.$lo_operator.date_order) + "'" +
                " and " + timestampField + "<'" + Util.dateTime_convertDatetoString(end_date, vars.$lo_operator.date_order) + "'";
            sQuery = appendQuery(tableName, sQuery);
        }

        var kpiName = "export_" + tableName + "_" + Util.getTimeString2(start_date) + "_" + Util.getTimeString2(end_date);
        var unlFileName = tableName + "_" + Util.getTimeString2(start_date) + "_" + Util.getTimeString2(end_date) + ".unl";
        var estimatedTime = parseFloat(row[3]);
        Util.kpiList_register(kpiName, tableName, sQuery, estimatedTime, unlFileName, 1, start_date, end_date);
    }
    Util.kpiList_calculateRecordsNumber();

    //  if it contains too many record, split the time range
    var haveSplitableBigUNLFiles = true;
    var loopLimit = 1000;
    var loop = 1;
    while (haveSplitableBigUNLFiles && loop <= loopLimit) {
        loop++;
        if (RC_SUCCESS == fkpi.doSelect("sysmodtimeIsInDB=true and kpiName#\"export_\" and recordsNumber>" + RECORD_LIMIT_FOR_UNL)) {
            var splitBigUNLFiles = false;
            do {
                var intervalSeconds = Math.floor((fkpi.toTime - fkpi.fromTime) / 1000);
                if (intervalSeconds < 2) {
                    continue;
                }

                splitBigUNLFiles = true;
                tableName = fkpi.tableName;
                timestampField = fkpi.query;
                timestampField = timestampField.substr(0, timestampField.indexOf(">="));

                var splitInto;
                if (intervalSeconds >= 10) {
                    splitInto = 10;
                } else {
                    splitInto = intervalSeconds;
                }

                Util.messageList_add("info", "split " + fkpi.kpiName + " into " + splitInto + " pieces.");
                Util.kpiList_unregister(fkpi.kpiName);

                var time1 = new Date();
                var time2 = new Date();

                for (i = 1; i < splitInto; i++) {
                    time1 = Util.dateTime_addSeconds(fkpi.fromTime, intervalSeconds / splitInto * (i - 1));
                    time2 = Util.dateTime_addSeconds(fkpi.fromTime, intervalSeconds / splitInto * i);
                    sQuery = timestampField + ">='" + Util.dateTime_convertDatetoString(time1, vars.$lo_operator.date_order) + "'" +
                        " and " + timestampField + "<'" + Util.dateTime_convertDatetoString(time2, vars.$lo_operator.date_order) + "'";

                    kpiName = "export_" + tableName + "_" + Util.getTimeString2(time1) + "_" + Util.getTimeString2(time2);
                    unlFileName = tableName + "_" + Util.getTimeString2(time1) + "_" + Util.getTimeString2(time2) + ".unl";
                    estimatedTime = fkpi.remainSeconds;
                    Util.kpiList_register(kpiName, tableName, sQuery, estimatedTime, unlFileName, 1, time1, time2);
                    Util.messageList_add("debug", "new " + kpiName);
                }

                time1 = Util.dateTime_addSeconds(fkpi.fromTime, intervalSeconds / splitInto * (splitInto - 1));
                time2 = fkpi.toTime;
                sQuery = timestampField + ">='" + Util.dateTime_convertDatetoString(time1, vars.$lo_operator.date_order) + "'" +
                    " and " + timestampField + "<'" + Util.dateTime_convertDatetoString(time2, vars.$lo_operator.date_order) + "'";

                kpiName = "export_" + tableName + "_" + Util.getTimeString2(time1) + "_" + Util.getTimeString2(time2);
                unlFileName = tableName + "_" + Util.getTimeString2(time1) + "_" + Util.getTimeString2(time2) + ".unl";
                estimatedTime = fkpi.remainSeconds;
                Util.kpiList_register(kpiName, tableName, sQuery, estimatedTime, unlFileName, 1, time1, time2);
                Util.messageList_add("debug", "new " + kpiName);

            }
            while (RC_SUCCESS == fkpi.getNext());

            if (!splitBigUNLFiles) {
                haveSplitableBigUNLFiles = false;
            }
        } else {
            haveSplitableBigUNLFiles = false;
        }
        Util.kpiList_calculateRecordsNumber();
    }

    if (RC_SUCCESS == fkpi.doSelect("kpiName#\"export_\" and recordsNumber=0")) {
        do {
            fkpi.remainSeconds = 0;
            fkpi.doUpdate();
        }
        while (RC_SUCCESS == fkpi.getNext());
    }

    // adjust estimated time, 
    // if a table's unload estimated time is 30 seconds, then the sum of all its tasks' estimated time should be a litle more than 30 seconds 

    // schedule these tasks
    var fsche = new SCFile("schedule");
    if (RC_SUCCESS == fsche.doSelect("name#\"unload data - \"")) {
        do {
            fsche.doDelete();
        }
        while (RC_SUCCESS == fsche.getNext());
    }

    var rc = fkpi.doSelect("kpiName#\"export_\"");
    while (rc == RC_SUCCESS) {
        if (fkpi.unlFileName != null) {
            // randomly assign the unload work to schedule 'bg_load_unload2'... 'bg_load_unload5'
            // 'bg_load_unload1' will be used to prepare HTML report
            var rnd = 2 + Math.floor(Math.random() * 4);
            fsche._class = "bg_load_unload" + rnd;
            fsche.application = "unload.background";
            fsche.strings[2] = FILE_PATH + fkpi.unlFileName;
            fsche.strings[3] = fkpi.query;
            fsche.strings[4] = fkpi.tableName;

            fsche.name = "unload data - " + fkpi.tableName + "_" + Util.getTimeString2(fkpi.fromTime) + "_" + Util.getTimeString2(fkpi.toTime);

            fsche.javascript = "lib.DeltaMigrationUtil.kpiList_update(\"" + FILE_PATH + "\",\"" + fkpi.unlFileName + "\",1,\"export\");";
            fsche.expiration = new Date();
            fsche.doInsert();
            Util.messageList_add("info", "schedule for '" + fkpi.unlFileName + "' created under " + fsche._class + ".");
        }
        rc = fkpi.getNext();
    }

    Util.kpiList_generateExportStatusReportHTML(FILE_PATH + "Overall Export Status Report.html");

    // setup 'bg_load_unload1' to update 'Overall Export Status Report.html' every minutes, until 100% completed.
    var f2 = new SCFile("schedule");
    f2._class = "bg_load_unload1";
    f2.name = "prepare real-time report for delta migration progress";
    var scriptJS = "lib.DeltaMigrationUtil.kpiList_updateAndscheduleNextStatusReportUpdate(\"" + FILE_PATH + "Overall Export Status Report.html\",\"export\",\"" + f2._class + "\");";
    scriptJS = funcs.strrep(scriptJS, "\\", "\\\\");
    f2.javascript = scriptJS;
    f2.expiration = new Date();
    f2.doInsert();

    Util.messageList_add("debug", "function unload_data_utility(FILE_PATH,str_start_date,str_end_date) END");
    Util.messageList_add("info", "finish creating schedule for unload.");
    Util.messageList_add("info", "delta data are scheduled to export, please open 'Overall Export Status Report.html' in output folder for real-time status.");

    return "SUCCESS";
}


function addDays(start_date, add_days) {
    return new Date(start_date + add_days * 86400000);
}


function getPotentialFilesAndTimestampFieldFromDbdict() {

    // exclude list
    var exclude = lib.DeltaMigrationConfiguration.getExportExcludeList();

    var array_fileAndTimestampField = [];

    var f = new SCFile("dbdict", SCFILE_READONLY);
    f.doSelect("true");
    var num_DbdictRecord = 0;

    do {
        var fileName = f.name;

        if (lib.ArrayUtil.contains(exclude, fileName)) {
            continue;
        }

        var timestampField = "?";
        var find_sysmodtime = false;
        var find_sysmoduser = false;
        var find_sysmodcount = false;

        // if one file no sysmodtime field, and if it doesn't belong to below exceptions, then ignore this file
        var i;
        var length = f.field.length();
        for (i = 0; i < length; i++) {
            if (f.field[i].name == "sysmodtime") {
                timestampField = "sysmodtime";
                find_sysmodtime = true;
            }
            if (f.field[i].name == "sysmoduser") {
                find_sysmoduser = true;
            }
            if (f.field[i].name == "sysmodcount") {
                find_sysmodcount = true;
            }
        }
        if (find_sysmodtime) {
            array_fileAndTimestampField.push(fileName + "," + timestampField + "," + find_sysmoduser + "," + find_sysmodcount);
        } else {
            array_fileAndTimestampField.push(fileName + "," + "," + find_sysmoduser + "," + find_sysmodcount);
        }

        num_DbdictRecord++;
    }
    while (RC_SUCCESS == f.getNext() && num_DbdictRecord < 99999999);

    return array_fileAndTimestampField;
}


/**
  main function for data migration by single unl file
  create data unload script for delta data migration, the unload script will be used to abstract records after a specified time from all registed tables
  input: start time 
  output: a UNL script "delta_data_after_mm/dd/yyyy", to be used to retrive all records after start time from registered tables.  
*/
function generate_delta_data_unload(start_date) {
    var sQuery = "";
    var array_fileAndTimestampField = getPotentialFilesAndTimestampFieldFromDbdict();

    var strStartDate = Util.getTimeString2(start_date);
    var f = new SCFile("unload");
    if (RC_SUCCESS == f.doSelect("name=\"" + "delta_data_after_" + strStartDate + "\"")) {
        f.doDelete();
        print("Unload Script: delta_data_after_" + strStartDate + " updated.");
    }

    f.name = "delta_data_after_" + strStartDate;
    f.purge = false;
    f.unload = true;

    var validTables = 0;
    var tableName;
    var timestampField;

    var i;
    for (i = 0; i < array_fileAndTimestampField.length; i++) {
        tableName = array_fileAndTimestampField[i].split(",")[0];
        timestampField = array_fileAndTimestampField[i].split(",")[1];

        if (timestampField != null && timestampField != "") {
            sQuery = timestampField + ">='" + Util.dateTime_convertDatetoString(start_date, vars.$lo_operator.date_order) + "'";

            f.record[validTables].filename = tableName;
            f.record[validTables].query = sQuery;
            f.record[validTables].datamap = false;
            validTables++;
        } else {
            print("no sysmodtime - " + tableName + " ... ");
        }
    }

    f.doInsert();

    return f.name;
}