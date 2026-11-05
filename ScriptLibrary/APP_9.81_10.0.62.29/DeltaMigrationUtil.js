function getTimeString(datetime) {
	var s = dateTime_convertDatetoString(datetime, 6);
	return s.substr(0, 4) + s.substr(5, 2) + s.substr(8, 2);
}


function getTimeString2(datetime) {
	var s = dateTime_convertDatetoString(datetime, 6);
	return s.substr(0, 4) + s.substr(5, 2) + s.substr(8, 2) + "_" + s.substr(11, 2) + s.substr(14, 2) + s.substr(17, 2);
}


function getTimeString3(datetime) {
	var s = dateTime_convertDatetoString(datetime, 6);
	return s.substr(0, 4) + "/" + s.substr(5, 2) + "/" + s.substr(8, 2) + " " + s.substr(11, 2) + ":" + s.substr(14, 2) + ":" + s.substr(17, 2);
}


function scheduler_register(schedulerName) {
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
		f.kpiName = schedulerName;
		f.completed = 0;
		f.total = 0;
		f.doUpdate();
	}
	else {
		f.kpiName = schedulerName;
		f.completed = 0;
		f.total = 0;
		f.doInsert();
	}
}


function scheduler_watchDogHungry(schedulerName) {
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
		f.kpiName = schedulerName;
		f.total = 0;
		f.doUpdate();
	}
	else {
		f.kpiName = schedulerName;
		f.total = 0;
		f.doInsert();
	}
}


function scheduler_watchDogFeed(schedulerName) {
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
		f.kpiName = schedulerName;
		f.total = 1;
		f.doUpdate();
	}
	else {
		f.kpiName = schedulerName;
		f.total = 1;
		f.doInsert();
	}
}

function scheduler_isItStarted(schedulerName) {
	var f = new SCFile("DeltaMigToolKPI", SCFILE_READONLY);
	f.setFields(["total"]);
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
	 	// watch dog feeded, so the scheduler must has been started.
		if (f.total == 1) {
			return true;
		}
	}
	return false;
}


function scheduler_areAllStarted() {
	return scheduler_isItStarted("bg_load_unload1") &&
		scheduler_isItStarted("bg_load_unload2") &&
		scheduler_isItStarted("bg_load_unload3") &&
		scheduler_isItStarted("bg_load_unload4") &&
		scheduler_isItStarted("bg_load_unload5");
}


function scheduler_isItDisabledTriggers(schedulerName) {
	var f = new SCFile("DeltaMigToolKPI", SCFILE_READONLY);
	f.setFields(["completed"]);
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
		// after scheduler disable the triggers, it will setup this flag to 1
		if (f.completed == 1) { 
			return true;
		}
	}
	return false;
}


function scheduler_disable_triggers(schedulerName) {
	var ret = new SCDatum();
	funcs.rtecall("trigger", ret, 0);
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
		f.completed = 1;
		f.doUpdate();
	}
}


function scheduler_enable_triggers(schedulerName) {
	var ret = new SCDatum();
	funcs.rtecall("trigger", ret, 1);
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + schedulerName + "\"")) {
		f.completed = 0;
		f.doUpdate();
	}
}


/*********************************************
 *  log tools, contains init(), add() and print() functions
 *    version 1: keep logs in variable, failed, schedule use messageList_add() to add log, but foreground wizard can only get log from itself, not from backgroun schedule 
 *    version 2: keep logs in SM table, failed, raw SM932 can create new DB, but TG DB can't add new table, maybe forbidden
 *    version 3: keep logs in global variable, failed, same as version 1
 *    version 4: background schedule write file, foreground wizard read file 
 *********************************************/
// version 3
vars.$myMessageListFlag = [];
vars.$myMessageListTimestamp = [];
vars.$myMessageListContent = [];

function messageList_init() {
	vars.$myMessageListFlag = [];
	vars.$myMessageListTimestamp = [];
	vars.$myMessageListContent = [];

	writeFile("../logs/delta_migration.log", 't', "");
}


function messageList_add(newMsgFlag, newMsgContent) {
	if (newMsgFlag == null || newMsgFlag == "" || newMsgContent == null || newMsgContent == "") {
		return;
	}

	vars.$myMessageListFlag.push(newMsgFlag);
	vars.$myMessageListTimestamp.push(getCurrentTimeInFormatType6plusMillseconds());
	vars.$myMessageListContent.push(newMsgContent);

	// print on screen 
	messageList_printInstantMsg(newMsgFlag, newMsgContent);

	// also add it to log file
	var pid = funcs.nullsub(funcs.sysinfo_get("ClientPID"), "Unknown PID");
	// date format is same as that in sm.log, mm/dd/yyyy hh:mm:ss
	var dateString = dateTime_convertDatetoString(new Date(), 4);

	// write external log
	var fullText = pid + "  " + dateString + " " + newMsgFlag + " " + newMsgContent + "\n";
	writeFile("../logs/delta_migration.log", 'a', fullText);
}


function messageList_printAllMessage() {
	print("***********************************");
	print("All Delta Migration Tool Messages:");
	var i;
	for (i = 0; i < vars.$myMessageListContent.length; i++) {
		print(vars.$myMessageListTimestamp[i] + "  " + vars.$myMessageListFlag[i] + ":" + vars.$myMessageListContent[i]);
	}
	print("***********************************");
}


/**
 *	 print message of error, warning or info level
 *
 *    @param {Number} level	-  'info', 'warning' or 'error'
 *    @param {String} content  -  the message content
 **/
function messageList_printInstantMsg(level, content) {
	
	var index = 1;
	if (level == "info") {
		index = 1;
	}
	if (level == "warning") {
		index = 2;
	}
	if (level == "error") {
		index = 3;
	}

	var rteReturnValue = new SCDatum();
	funcs.rtecall("msg", rteReturnValue, content, index);
}


function kpiList_init() {
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("true")) {
		do {
			f.doDelete();
		}
		while (RC_SUCCESS == f.getNext());
	}
	return true;
}


function kpiList_register(kpiName, tableName, query, estimatedSeconds, unlFileName, total, fromTime, toTime) {
	messageList_add("info", "register " + kpiName);
	
	var f = new SCFile("DeltaMigToolKPI");
	f.kpiName = kpiName;
	f.tableName = tableName;
	f.query = query;
	f.unlFileName = unlFileName;
	f.completed = 0;
	f.total = total;
	f.remainSeconds = estimatedSeconds;
	
	// try to get fromTime and toTime according to kpi name
	// this is to keep the import in order
	var names = kpiName.match(/(\d)+/g);
	if (kpiName.indexOf("import_") == 0 && funcs.lng(names) == 4) {
		var fromTimeDateString = names[0];
		var fromTimeTimeString = names[1];
		var toTimeDateString = names[2];
		var toTimeTimeString = names[3];
		f.fromTime = dateTime_convertStringToDate(fromTimeDateString, fromTimeTimeString);
		f.toTime = dateTime_convertStringToDate(toTimeDateString, toTimeTimeString);
	}

	if (fromTime != null && fromTime != "") {
		f.fromTime = fromTime;
	}
	if (toTime != null && toTime != "") {
		f.toTime = toTime;
	}

	var f2 = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f2.doSelect("tableName=\"" + f.tableName + "\" and not null(fromTime) and not null(toTime)")) {
		do {
			if (f2.toTime - f.fromTime == 0) {
				f.prevKpiName = f2.kpiName;
			}
			else if (f2.fromTime - f.toTime == 0) {
				f2.prevKpiName = f.kpiName;
				f2.doUpdate();
			}
		}
		while (RC_SUCCESS == f2.getNext());
	}
	
	var sqltablename = null;
	var sysmodtimeFound = false;
	
	var file = new SCFile("dbdict", SCFILE_READONLY);
	var rc = file.doSelect("name=\"" + tableName + "\"");
	if (rc == RC_SUCCESS) {
		var sql_table_alias = "m1";
		var i;
		var length = file.field.length();
		for (i = 0; i < length; i++) {
			if (file.field[i].name == "sysmodtime" || file.field[i].name == "SYSMODTIME") {
				sql_table_alias = file.field[i].sql_field_options.sql_table_alias;
				sysmodtimeFound = true;
				break;
			}
		}
		
		if (sysmodtimeFound) {
			length = file.sql_tables.length();
			for (i = 0; i < length; i++) {
				if (file.sql_tables[i].sql_table_alias.toLowerCase() == sql_table_alias) {
					sqltablename = file.sql_tables[i].sql_table_name;
					break;
				}
			}
		}
	}
	
	if (sqltablename == null) {
		f.sysmodtimeIsInDB = false;
	} else {
		f.sysmodtimeIsInDB = true;
	}

	f.sqlTableOfSysmodtime = sqltablename;
	f.doInsert();
}


function kpiList_unregister(kpiName) {
	var f = new SCFile("DeltaMigToolKPI");
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + kpiName + "\"")) {
		f.doDelete();
	}
}


function kpiList_calculateRecordsNumber() {

	// 1.sysmodtimeIsInDB true
	var db_type = getDatabaseType();

	var statements = [];
	var statement = "";
	var f = new SCFile("DeltaMigToolKPI", SCFILE_READONLY);
	f.setFields(["kpiName","sqlTableOfSysmodtime"]);
	
	if (RC_SUCCESS == f.doSelect("sysmodtimeIsInDB=true and not null(fromTime) and not null(toTime)")) {
		do {
			if (databaseTypeIsSqlServer(db_type)) {
				statement = "update dmt set dmt.RECORDSNUMBER = (";
				statement += "select count(*) from <tableName>";
				statement += " where SYSMODTIME>=dmt.FROMTIME";
				statement += " and SYSMODTIME<dmt.TOTIME";
				statement += ") from <DMT KPI table> dmt where dmt.KPINAME='<kpiName>'";
			}
			else if (databaseTypeIsOracle(db_type)) {
				statement = "update <DMT KPI table> dmt set dmt.RECORDSNUMBER = (";
				statement += "select count(*) from <tableName>";
				statement += " where SYSMODTIME>=dmt.FROMTIME";
				statement += " and SYSMODTIME<dmt.TOTIME";
				statement += ") where dmt.KPINAME='<kpiName>'";
			}
			else if (databaseTypeIsPostgreSQL(db_type)) {
				statement = 'update <DMT KPI table> set "RECORDSNUMBER" = (';
				statement += 'select count(*) from <tableName>';
				statement += ' where "SYSMODTIME">=<DMT KPI table>."FROMTIME"';
				statement += ' and "SYSMODTIME"<<DMT KPI table>."TOTIME"';
				statement += ') where "KPINAME"=\'<kpiName>\'';
			}
			
			statement = statement.replace(/<tableName>/g, f.sqlTableOfSysmodtime);
			statement = statement.replace(/<kpiName>/g, f.kpiName);
			statement = statement.replace(/<DMT KPI table>/g, "DELTAMIGTOOLKPIM1");
			statements.push(statement);

		} while (RC_SUCCESS == f.getNext());
	}
	statements.push("commit");

	// use the query to get record number
	var names = new SCDatum();
	var values = new SCDatum();
	var returns = new SCDatum();
	names.push("values");
	values.push(statements);
	try {
		funcs.rtecall("callrad", returns, "SQLexecute", names, values, false);
	}
	catch (e) {
		print("Can't calulate record number for " + f.kpiName);
	}
	
	// TODO sysmodtimeIsInDB false
}


function kpiList_getQueryForRecordNumberDuring(tableName, kpiName) {
	var ret = "update dmt set dmt.RECORDSNUMBER = (";
	ret += "select count(*) from <tableName>";
	ret += " where sysmodtime>=dmt.fromTime";
	ret += " and sysmodtime<dmt.toTime";
	ret += ") from <DMT KPI table> dmt where dmt.KPINAME='<kpiName>'";
	
	var sqltablename;
	var dbtype;

	var i, length;
	
	var file = new SCFile("dbdict", SCFILE_READONLY);
	var rc = file.doSelect("name=\"" + tableName + "\"");
	if (rc == RC_SUCCESS) {
		var sql_table_alias = "m1";
		length = file.field.length();
		for (i = 0; i < length; i++) {
			if (file.field[i].name == "sysmodtime" || file.field[i].name == "SYSMODTIME") {
				sql_table_alias = file.field[i].sql_field_options.sql_table_alias;
				break;
			}
		}
		length = file.sql_tables.length();
		for (i = 0; i < length; i++) {
			if (file.sql_tables[i].sql_table_alias.toLowerCase() == sql_table_alias) {
				sqltablename = file.sql_tables[i].sql_table_name;
				dbtype = file.sql_tables[i].sql_db_type;
				break;
			}
		}
		ret = ret.replace(/<tableName>/g, sqltablename);
	}

	rc = file.doSelect("name=\"DeltaMigToolKPI\"");
	if (rc == RC_SUCCESS) {
		length = file.sql_tables.length();
		for (i = 0; i < length; i++) {
			if (file.sql_tables[i].sql_table_alias.toLowerCase() == "m1") {
				sqltablename = file.sql_tables[i].sql_table_name;
				dbtype = file.sql_tables[i].sql_db_type;
				break;
			}
		}
		ret = ret.replace(/<DMT KPI table>/g, sqltablename);
	}
	
	ret = ret.replace(/<kpiName>/g, kpiName);
	return ret;
}


function kpiList_update(FILE_PATH, unlFileName, completedOrNot, mode) {

	var f = new SCFile("DeltaMigToolKPI");

	if (RC_SUCCESS == f.doSelect("unlFileName=\"" + unlFileName + "\"")) {

		if (mode == "import") {
			// check if previous task finished
			var prevTaskFinished = true;
			var f2 = new SCFile("DeltaMigToolKPI", SCFILE_READONLY);
			f2.setFields(["kpiName"]);
		
			// if previous task not finished, schedule another task to import self again
			if (RC_SUCCESS == f2.doSelect("kpiName=\"" + f.prevKpiName + "\" and completed<total")) {
				lib.DeltaMigrationImport.createImportScheduler(FILE_PATH, f.unlFileName);
			}
			else {
				f.completed = completedOrNot;
				f.doUpdate();
				f.remainSeconds = 0;
				messageList_add("info", unlFileName + " completed.");
			}
		}
		// export
		else {
			var exportedUnl = readFile(FILE_PATH + f.unlFileName, "b");
			if (exportedUnl == -1) {
				f.completed = completedOrNot;
				f.remainSeconds = 0;
				f.unlFileName += "(0 record)";
				f.doUpdate();
				messageList_add("info", unlFileName + " completed.");
			}
			else {
				f.completed = completedOrNot;
				f.remainSeconds = 0;
				f.doUpdate();
				messageList_add("info", unlFileName + " completed.");

				writeFile(FILE_PATH + f.tableName + "_unload_result.txt", 'a', f.unlFileName + "\n");
				var existsTable = readFile(FILE_PATH + "table_exported.txt", "t");
				if (existsTable.indexOf("\n" + f.tableName + ",") <= 0) {
					writeFile(FILE_PATH + "table_exported.txt", "a", f.tableName + ",sysmodtime\n");
				}
			}
		}
	} 
	else {
		messageList_add("error", "not find kpi for " + unlFileName + ".");
	}
}


function kpiList_generateExportStatusReportHTML(htmlFilePathName) {
	return kpiList_generateStatusReportHTML(htmlFilePathName, "export");
}


function kpiList_generateImportStatusReportHTML(htmlFilePathName) {
	return kpiList_generateStatusReportHTML(htmlFilePathName, "import");
}


function kpiList_generateStatusReportHTML(htmlFilePathName, type) {

	var f = new SCFile("DeltaMigToolKPI");
	var f2 = new SCFile("DeltaMigToolKPI");
	var f3 = new SCFile("DeltaMigToolKPI");
	
	// clear old statistic result.
	if (RC_SUCCESS == f.doSelect("kpiName#\"" + type + "\"")) {
		do {
			kpiName = f.kpiName;
			tableName = kpiName.split("_")[1];
			yyyymmdd = kpiName.split("_")[2];
			if (tableName == "allTable" || yyyymmdd == "allTime") {
				f.total = 0;
				f.completed = 0;
				f.remainSeconds = 0;
				f.doUpdate();
			}
		}
		while (RC_SUCCESS == f.getNext());
	}
	
	// scan all UNL level KPI, to update higher level KPI 
	if (RC_SUCCESS == f.doSelect("kpiName#\"" + type + "\"")) {
		do {
			kpiName = f.kpiName;
			tableName = kpiName.split("_")[1];
			yyyymmdd = kpiName.split("_")[2];
			if (tableName != "allTable" && yyyymmdd != "allTime") {
				// update table level KPI
				kpiName2 = type + "_" + tableName + "_allTime";
				if (RC_SUCCESS != f2.doSelect("kpiName=\"" + kpiName2 + "\"")) {
					kpiList_register(kpiName2, tableName, "", 0, "", 0);
					f2.doSelect("kpiName=\"" + kpiName2 + "\"");
				}
				f2.total += 1;
				f2.completed += f.completed;

				if (f.completed == 0) {
					f2.remainSeconds += f.remainSeconds;
				}
				f2.doUpdate();

				// update highest level KPI 
				kpiName3 = type + "_allTable_allTime";
				if (RC_SUCCESS != f3.doSelect("kpiName=\"" + kpiName3 + "\"")) {
					kpiList_register(kpiName3, "", "", 0, "", 0);
					f3.doSelect("kpiName=\"" + kpiName3 + "\"");
				}
				f3.total += 1;
				f3.completed += f.completed;
				if (f.completed == 0) {
					f3.remainSeconds += f.remainSeconds;
				}
				f3.doUpdate();
			}
		}
		while (RC_SUCCESS == f.getNext());
	}

	var html = lib.htmlTemplates.getBasicListTemplate();

	// check failed schedule
	var errorList = [];
	var fsche = new SCFile("schedule", SCFILE_READONLY);
	fsche.setFields(["name","status"]);
	var qsche = "";
	if (type == "export") {
		qsche = "name#\"unload data - \" and status#\"application failed\"";
	}
	else {
		qsche = "name#\"load data - \" and status#\"application failed\"";
	}
	if (RC_SUCCESS == fsche.doSelect(qsche)) {
		do {
			// for failed export/import, reschedule it later. 
			errorList.push("schedule '" + fsche.name + "'' failed: " + fsche.status);
		}
		while (RC_SUCCESS == fsche.getNext());
	}

	// prepare highest level progress report
	if (RC_SUCCESS == f3.doSelect("kpiName=\"" + type + "_allTable_allTime\"")) {
		completePct = Math.floor(100.0 * f3.completed / f3.total);
		if (completePct < 100) {
			html += "<script language='javascript'>";
			html += "var refresh = setTimeout(\"window.location.reload()\", 15000);";
			html += "</script>";
		}
		if (type == "export") {
			html += "<h2>General Status of Delta Migration Tool Exporting</h2>";
		}
		else {
			html += "<h2>General Status of Delta Migration Tool Importing</h2>";
		}

		if (completePct < 100) {
			html += "<h3>Overall progress: <completePct>%   (<remainTime> remain...)</h3>\n";
		}
		else {
			html += "<h3>Overall progress: <completePct>%</h3>\n";
		}
		html += "<p><b></b></p>\n";
		html = html.replace("<completePct>", completePct);

		var remainTime = "?";
		if (f3.remainSeconds <= 60) {
			remainTime = "1 minute";
		}
		else if (f3.remainSeconds < 3600) {
			minutes_total = f3.remainSeconds / 60;
			remainTime = String(Math.ceil(minutes_total)) + " minutes";
		}
		else {
			hours_total = f3.remainSeconds / 3600;
			remainTime = String(Math.ceil(hours_total)) + " hours";
		}
		html = html.replace("<remainTime>", remainTime);
	}
	
	// prepare error information if there's any
	if (funcs.lng(errorList) > 0) {
		html += "<p></p>\n";
		html += "<table id='errorList' width='100%' border='0'>\n";
		
		var i;
		for (i = 0; i < errorList.length; i++) {
			html += " <tr valign=top>\n";
			html += "   <td><font size='1' color='red'>&nbsp;" + errorList[i] + "</font></td>\n";
			html += " </tr>\n";
		}
		html += "</table>\n";
		html += "<p><b>Please check related UNL files.</b></p>\n";
	}

	// prepare table level progress report
	if (RC_SUCCESS == f2.doSelect("kpiName#\"" + type + "\"")) {
		html += "<h3>Table level progress:  <finishedTablesNumber>/<overallTablesNumber></h3>\n";
		html += "<table id='tableLevelReport' width='300' border='1' bordercolor='#aaaaaa'>\n";
		html += "  <tr>\n";
		html += "   <th width='250' id='col_1' style=\"color:white;font-size:15px;background-color:blue\">Table name</th>\n";
		html += "   <th width='50' id='col_2' style=\"color:white;font-size:15px;background-color:blue\">Progress</th>\n";
		html += " </tr>\n";
		
		var finishedTablesNumber = 0;
		var overallTablesNumber = 0;
		do {
			kpiName = f2.kpiName;
			tableName = kpiName.split("_")[1];
			yyyymmdd = kpiName.split("_")[2];
			if (tableName != "allTable" && yyyymmdd == "allTime") {
				completePct = Math.floor(100.0 * f2.completed / f2.total);

				strRowClass = overallTablesNumber % 2 == 1 ? "evenRow" : "oddRow";

				html += " <tr valign=top CLASS=\"" + strRowClass + "\">\n";
				html += "   <td><font size='1' color='#666666'>&nbsp;" + tableName + "</font></td>\n";
				html += "   <td><font size='1' color='#666666'>&nbsp;" + completePct + "%</font></td>\n";
				html += " </tr>\n";

				overallTablesNumber++;
				if (completePct == 100) {
					finishedTablesNumber++;
				}
			}
		}
		while (RC_SUCCESS == f2.getNext());
		
		html += "</table>\n";
		html += "<p><b></b></p>\n";
		html = html.replace("<overallTablesNumber>", overallTablesNumber);
		html = html.replace("<finishedTablesNumber>", finishedTablesNumber);
	}

	// prepare UNL level progress report
	if (RC_SUCCESS == f.doSelect("kpiName#\"" + type + "\"")) {

		html += "<h3>UNL file level progress:  <finishedUnlNumber>/<overallUnlNumber></h3>\n";
		html += "<table id='unlLevelReport' width='300' border='1' bordercolor='#aaaaaa'>\n";
		html += "  <tr>\n";
		html += "   <th width='250' id='col_1' style=\"color:white;font-size:15px;background-color:blue\">UNL file name</th>\n";
		html += "   <th width='50' id='col_2' style=\"color:white;font-size:15px;background-color:blue\">Progress</th>\n";
		html += " </tr>\n";
		
		var finishedUnlNumber = 0;
		var overallUnlNumber = 0;
		do {
			kpiName = f.kpiName;
			tableName = kpiName.split("_")[1];
			yyyymmdd = kpiName.split("_")[2];
			if (tableName != "allTable" && yyyymmdd != "allTime") {
				completePct = Math.floor(100.0 * f.completed / f.total);

				strRowClass = overallUnlNumber % 2 == 1 ? "evenRow" : "oddRow";

				html += " <tr valign=top CLASS=\"" + strRowClass + "\">\n";
				html += "   <td><font size='1' color='#666666'>&nbsp;" + f.unlFileName + "</font></td>\n";
				html += "   <td><font size='1' color='#666666'>&nbsp;" + completePct + "%</font></td>\n";
				html += " </tr>\n";

				overallUnlNumber++;
				if (completePct == 100) {
					finishedUnlNumber++;
				}
			}
		}
		while (RC_SUCCESS == f.getNext());

		html += "</table>\n";
		html += "<p><b></b></p>\n";

		html = html.replace("<overallUnlNumber>", overallUnlNumber);
		html = html.replace("<finishedUnlNumber>", finishedUnlNumber);
	}
	
	writeFile(htmlFilePathName, 't', html);
}


function kpiList_overallStatusCompletedOrNot(type) {
	var f = new SCFile("DeltaMigToolKPI", SCFILE_READONLY);
	f.setFields(["completed","total"]);
	if (RC_SUCCESS == f.doSelect("kpiName=\"" + type + "_allTable_allTime\"")) {
		if (f.completed == f.total && f.total > 0) {
			return true;
		}
	}
	return false;
}


function kpiList_updateAndscheduleNextStatusReportUpdate(htmlFilePathName, type, CLASS_NAME) {
	// if overall status is not 100%, schedule next update
	if (kpiList_overallStatusCompletedOrNot(type) == false) {
		var scriptJS = "lib.DeltaMigrationUtil.kpiList_updateAndscheduleNextStatusReportUpdate(\"" + htmlFilePathName + "\",\"" + type + "\",\"" + CLASS_NAME + "\");";
		scriptJS = funcs.strrep(scriptJS, "\\", "\\\\");
		var scriptExpiry = new Date();
		var nowPlusDelay = scriptExpiry.getMinutes() + 1;
		scriptExpiry.setMinutes(nowPlusDelay);
		var scriptName = "prepare real-time report for delta migration progress";

		var newSchedule = new SCFile("schedule");
		newSchedule._class = CLASS_NAME;
		newSchedule.name = scriptName;
		newSchedule.expiration = scriptExpiry;
		newSchedule.javascript = scriptJS;

		newSchedule.doInsert();
	}
	else {	// post complete
		if (type == "import") {
			// assign new tasks to make bg_load_unload* restore triggers
			var f = new SCFile("schedule");
			f.expiration = new Date();
			var i;
			for (i = 2; i <= 5; i++) {
				f._class = "bg_load_unload" + i;
				f.name = "enable triggers - " + f._class;
				f.javascript = "lib.DeltaMigrationUtil.scheduler_enable_triggers(\"" + f._class + "\");";
				f.doInsert();
			}
			
			// post process
			lib.DeltaMigrationImport.load_data_post();
		}
	}

	// update status report
	kpiList_generateStatusReportHTML(htmlFilePathName, type);
}


function getCurrentOperatorTimezone() {
	var f = new SCFile("operator", SCFILE_READONLY);
	f.setFields(["time.zone"]);
	var q = new QueryCond("name", EQ, funcs.operator());

	if (f.doSelect("operator", q) == RC_SUCCESS) {
		if (f.time_zone) {
			return f.time_zone;
		}
	}
	return "Not set";
}


function getSystemDefaultTimezone() {
	var f = new SCFile("info", SCFILE_READONLY);
	f.setFields(["time.zone"]);
	var q = new QueryCond("type", EQ, "company");

	if (f.doSelect(q) == RC_SUCCESS && f.time_zone) {
		return f.time_zone;
	}

	return "Not set";
}


function getDateFormatByOrder(type) {
	switch (type) {
	case "1":
		return "mm/dd/yy hh:MM:ss";
	case "2":
		return "dd/mm/yy hh:MM:ss";
	case "3":
		return "yy/mm/dd hh:MM:ss";
	case "4":
		return "mm/dd/yyyy hh:MM:ss";
	case "5":
		return "dd/mm/yyyy hh:MM:ss";
	case "6":
		return "yyyy/mm/dd hh:MM:ss";
	default:
		return "Not set";
	}
}


function getCurrentOperatorDateFormat() {
	var type = String(vars.$lo_operator.date_order);
	return getDateFormatByOrder(type);
}


function getSystemDefaultDateFormat() {
	var f = new SCFile("info", SCFILE_READONLY);
	f.setFields(["date.order","time.zone"]);
	var q = new QueryCond("type", EQ, "company");
	var type = "?";
	if (f.doSelect(q) == RC_SUCCESS && f.time_zone) {
		type = String(f.date_order);
	}

	return getDateFormatByOrder(type);
}


function getSqlTableName(tableName) {
	var file = new SCFile("dbdict", SCFILE_READONLY);
	var rc = file.doSelect("name=\"" + tableName + "\"");
	if (rc == RC_SUCCESS) {
		var i, length = file.sql_tables.length();
		for (i = 0; i < length; i++) {
			if (file.sql_tables[i].sql_table_alias.toLowerCase() == "m1") {
				return file.sql_tables[i].sql_table_name;
			}
		}
	}
	return "";
}


function getDatabaseType() {
	var file = new SCFile("dbdict", SCFILE_READONLY);
	var rc = file.doSelect("name=\"dbdict\"");
	if (rc == RC_SUCCESS) {
		var i, length = file.sql_tables.length();
		for (i = 0; i < length; i++) {
			if (file.sql_tables[i].sql_table_alias.toLowerCase() == "m1") {
				tablename = file.sql_tables[i].sql_table_name;
				return file.sql_tables[i].sql_db_type;
			}
		}
	}
	return "";
}


function databaseTypeIsSqlServer(db_type) {
	return (db_type.toLowerCase().indexOf("sql") == 0);
}


function databaseTypeIsOracle(db_type) {
	return (db_type.toLowerCase().indexOf("ora") == 0);
}


function databaseTypeIsPostgreSQL(db_type) {
	return (db_type.toLowerCase().indexOf("postgre") == 0);
}


function dateTime_addSeconds(start_date, add_seconds) {
	var ret = new Date();
	rs = start_date.getTime();
	rs += add_seconds * 1000;
	rs = Math.round(rs / 1000) * 1000;
	ret.setTime(rs);

	return ret;
}


function dateTime_convertDatetoString(date, dateOrder) {
	if (date == null) {
		return null;
	}
	var strMonth = funcs.str(funcs.month(date));
	var strDay = funcs.str(funcs.day(date));
	var strYear = funcs.str(funcs.year(date));
	var strTime = funcs.str(funcs.time(date));
	var strDate;

	if (funcs.lng(strMonth) == 1) {
		strMonth = "0" + strMonth;
	}
	if (funcs.lng(strDay) == 1) {
		strDay = "0" + strDay;
	}

	if (dateOrder == 1) {
		strDate = strMonth + "/" + strDay + "/" + strYear.substr(2) + " " + strTime;
	} else if (dateOrder == 2) {
		strDate = strDay + "/" + strMonth + "/" + strYear.substr(2) + " " + strTime;
	} else if (dateOrder == 3) {
		strDate = strYear.substr(2) + "/" + strMonth + "/" + strDay + " " + strTime;
	} else if (dateOrder == 4) {
		strDate = strMonth + "/" + strDay + "/" + strYear + " " + strTime;
	} else if (dateOrder == 5) {
		strDate = strDay + "/" + strMonth + "/" + strYear + " " + strTime;
	} else if (dateOrder == 6) {
		strDate = strYear + "/" + strMonth + "/" + strDay + " " + strTime;
	}

	return strDate;
}


function dateTime_convertStringToDate(yyyymmdd, hhmmss) {
	var yyyy = parseInt(yyyymmdd.substr(0, 4), 10);
	var mm = parseInt(yyyymmdd.substr(4, 2), 10);
	var dd = parseInt(yyyymmdd.substr(6, 2), 10);
	var hh = parseInt(hhmmss.substr(0, 2), 10);
	var minute = parseInt(hhmmss.substr(2, 2), 10);
	var ss = parseInt(hhmmss.substr(4, 2), 10);

	var ret = new Date();
	ret.setFullYear(yyyy, mm - 1, dd);
	ret.setHours(hh, minute, ss, 0);
	
	return ret;
}


/*
  tool function to generate text descriptor of table structure
    parse each field of table's 'dbdict' record, then record it as text
    use txt file to export, instead of export xml directly. The reason is 
      1. for get a better understanding of the structure
      2. in later version, only neccessary fields(such as name, type) will be exported and compared,
  input:  1. table name 
  output: 1. table structure descriptor, of below format, "." will be replaced ad "_"
*/
function getTableStructureFromDbdict(tableName) {
	/*
	  this version will export txt file of all feilds, include null fields, 
	  but with limited attribute only: name, type, sql type
	  level N fields will have 2*N space at the beginning of the line.
	*/
	var descp = "unknown, by dbdict '" + tableName + "'";
	var f = new SCFile("dbdict", SCFILE_READONLY);
	if (RC_SUCCESS == f.doSelect("name=\"" + tableName + "\"")) {
		descp = f.name + "\n";
		descp += "descriptor version:2.0\n";
		descp += "level,index,name,type,sql type\n";
		var i, length = funcs.lng(f.field);
		for (i = 0; i < length; i++) {
			var field = f.field[i]; 
			descp += field.level + ",";
			descp += field.index + ",";
			descp += field.name + ",";
			descp += field.type + ",";
			descp += field.sql_field_options.sql_data_type + "\n";
		}
	}
	return descp;
}


function getTableStructureFromStructDescpFile(fileName) {
	// here just return file content
	var tableDescp = readFile(fileName, "t");
	if (tableDescp == "" || tableDescp == null || tableDescp == -1) {
		return "N/A";
	}

	return tableDescp;

	// here arrange the file content to an html 
}


function getCompareResultOfStructDescpFile(fileNameA, fileNameB) {
	var html = lib.htmlTemplates.getBasicListTemplate();

	var tableDescpA = readFile(fileNameA, "t");
	var tableDescpB = readFile(fileNameB, "t");
	if (tableDescpA == -1 || tableDescpB == -1) {
		return html;
	}

	tableDescpA = tableDescpA.replace(/\r\n/g, "\n");
	tableDescpB = tableDescpB.replace(/\r\n/g, "\n");
	var tableDescpALines = tableDescpA.split("\n");
	var tableDescpBLines = tableDescpB.split("\n");
	var error_srcTableHasMoreFieldAtLine = "";
	var error_curTableFieldTypeChangedAtLine = "";
	var error_curTableFieldLengthShortenedAtLine = "";
	var error_curTableHasMoreFieldAtLine = "";
	var info_curTableFieldLengthExtendedAtLine = "";
	var info_curTableHasMoreFieldAtButtum = "";

	if (tableDescpALines[1].indexOf("descriptor version:2.0") >= 0 && tableDescpBLines[1].indexOf("descriptor version:2.0") >= 0) {
		var lineIndexA = 3;
		var lineIndexB = 3;
		var lineIndexAMax = funcs.lng(tableDescpALines);
		var lineIndexBMax = funcs.lng(tableDescpBLines);
		var lineStructLevelA;
		var lineStructIndexA;
		var lineStructLevelB;
		var lineStructIndexB;
		var lineStructLevelA_prev = -1;
		var lineStructIndexA_prev = -1;
		var lineStructLevelB_prev = -1;
		var lineStructIndexB_prev = -1;

		htmlRowId = 0;
		html += "<b>Risk of importing the delta data to this table: </b><br>";
		html += "<auto-compare suggestion><br><br>";
		html += "<b>Detailed Comparision Result:</b>";
		html += "<DIV class=\"DetailedFieldCompareResultTable\"><TABLE class=\"listTable\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
		newHtmlRow = "<tr>";
		newHtmlRow += "<th id='col_1'><font size='2'>Field name (not include alias)</font></th>";
		newHtmlRow += "<th id='col_2'><font size='2'>Comparision result</font></th>";
		newHtmlRow += "</tr>";
		html += newHtmlRow;
		do {
			// if this is the last empty line, skip it.
			if ((tableDescpALines[lineIndexA] == "" && tableDescpBLines[lineIndexB] == "") ||
				(tableDescpALines[lineIndexA] == null && tableDescpBLines[lineIndexB] == null)) {
				lineIndexA++;
				lineIndexB++;
				continue;
			}
			// if this is alias, skip it
			while (tableDescpALines[lineIndexA].split(",")[0] == tableDescpALines[lineIndexA - 1].split(",")[0] &&
				tableDescpALines[lineIndexA].split(",")[1] == tableDescpALines[lineIndexA - 1].split(",")[1]) {
				print("skip alias in source: " + tableDescpALines[lineIndexA].split(",")[2]);
				lineIndexA++;
			}
			while (tableDescpBLines[lineIndexB].split(",")[0] == tableDescpBLines[lineIndexB - 1].split(",")[0] &&
				tableDescpBLines[lineIndexB].split(",")[1] == tableDescpBLines[lineIndexB - 1].split(",")[1]) {
				print("skip alias in current: " + tableDescpBLines[lineIndexB].split(",")[2]);
				lineIndexB++;
			}

			// convert DB type in Oracle to that in Sql Server
			var normalizedTableDescpALine = tableDescpALines[lineIndexA];
			var normalizedTableDescpBLine = tableDescpBLines[lineIndexB];

			//  replace VARCHAR2 to varchar
			normalizedTableDescpALine = normalizedTableDescpALine.replace(/,VARCHAR2\(/g, ",VARCHAR(");
			normalizedTableDescpBLine = normalizedTableDescpBLine.replace(/,VARCHAR2\(/g, ",VARCHAR(");
			//  replace DATE to DATETIME
			normalizedTableDescpALine = normalizedTableDescpALine.replace(/,DATE$/g, ",DATETIME");
			normalizedTableDescpBLine = normalizedTableDescpBLine.replace(/,DATE$/g, ",DATETIME");
			//  replace CLOB to TEXT
			normalizedTableDescpALine = normalizedTableDescpALine.replace(/,CLOB$/g, ",TEXT");
			normalizedTableDescpBLine = normalizedTableDescpBLine.replace(/,CLOB$/g, ",TEXT");
			//  replace BLOB to IMAGE
			normalizedTableDescpALine = normalizedTableDescpALine.replace(/,BLOB$/g, ",IMAGE");
			normalizedTableDescpBLine = normalizedTableDescpBLine.replace(/,BLOB$/g, ",IMAGE");

			tableAFieldName = normalizedTableDescpALine.split(",")[2];
			tableBFieldName = normalizedTableDescpBLine.split(",")[2];
			var srcSqlType = normalizedTableDescpALine.split(",")[4];
			var curSqlType = normalizedTableDescpBLine.split(",")[4];

			if (normalizedTableDescpALine == normalizedTableDescpBLine) {
				print("field match: " + tableDescpALines[lineIndexA]);
				if (tableDescpALines[lineIndexA].split(",")[4] != tableDescpBLines[lineIndexB].split(",")[4]) {
					// add a new row in html table
					strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
					newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
					newHtmlRow += "<td width=40%><font size='1'>" + tableAFieldName + "</font></td>";
					newHtmlRow += "<td width=60%><font size='1'>match (<DB type 1> to <DB type 2>)</font></td>";
					newHtmlRow += "</TR>";
					newHtmlRow = funcs.strrep(newHtmlRow, "<DB type 1>", tableDescpALines[lineIndexA].split(",")[4]);
					newHtmlRow = funcs.strrep(newHtmlRow, "<DB type 2>", tableDescpBLines[lineIndexB].split(",")[4]);
					html += newHtmlRow;
					htmlRowId++;
					// new row added.
				}
				else {
					// add a new row in html table
					strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
					newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
					newHtmlRow += "<td width=40%><font size='1'>" + tableAFieldName + "</font></td>";
					newHtmlRow += "<td width=60%><font size='1'>match</font></td>";
					newHtmlRow += "</TR>";
					html += newHtmlRow;
					htmlRowId++;
					// new row added.
				}
				lineIndexA++;
				lineIndexB++;
			}
			else if (tableAFieldName == tableBFieldName) {
				print("field name match: " + tableDescpALines[lineIndexA] + ".");

				if (normalizedTableDescpALine.split(",")[3] != normalizedTableDescpBLine.split(",")[3]) {
					// add a new row in html table
					strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
					newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
					newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
					newHtmlRow += "<td width=60%><font size='1'>type changed from <old type> to <new type></font></td>";
					newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
					newHtmlRow = funcs.strrep(newHtmlRow, "<old type>", tableDescpALines[lineIndexA].split(",")[3]);
					newHtmlRow = funcs.strrep(newHtmlRow, "<new type>", tableDescpBLines[lineIndexB].split(",")[3]);
					newHtmlRow += "</TR>";
					html += newHtmlRow;
					htmlRowId++;
					// new row added.
					error_curTableFieldTypeChangedAtLine += ";Level:" + tableDescpALines[lineIndexA].split(",")[0] + "Index:" + tableDescpALines[lineIndexA].split(",")[1];
				}
				else if (srcSqlType.indexOf("VARCHAR") >= 0 &&
					curSqlType.indexOf("VARCHAR") >= 0) {
					var srcLength = parseInt(srcSqlType.match(/(\d)+/g)[0], 10);
					var curLength = parseInt(curSqlType.match(/(\d)+/g)[0], 10);

					if (srcLength > curLength) {
						// add a new row in html table
						strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
						newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
						newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
						newHtmlRow += "<td width=60%><font size='1' color='red'>sql type changed from <old type> to <new type></font></td>";
						newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
						newHtmlRow = funcs.strrep(newHtmlRow, "<old type>", tableDescpALines[lineIndexA].split(",")[4]);
						newHtmlRow = funcs.strrep(newHtmlRow, "<new type>", tableDescpBLines[lineIndexB].split(",")[4]);
						newHtmlRow += "</TR>";
						html += newHtmlRow;
						htmlRowId++;
						// new row added.
						error_curTableFieldLengthShortenedAtLine += ";Level:" + tableDescpALines[lineIndexA].split(",")[0] + "Index:" + tableDescpALines[lineIndexA].split(",")[1];
					}
					else if (srcLength < curLength) {
						// add a new row in html table
						strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
						newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
						newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
						newHtmlRow += "<td width=60%><font size='1'>sql type changed from <old type> to <new type></font></td>";
						newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
						newHtmlRow = funcs.strrep(newHtmlRow, "<old type>", tableDescpALines[lineIndexA].split(",")[4]);
						newHtmlRow = funcs.strrep(newHtmlRow, "<new type>", tableDescpBLines[lineIndexB].split(",")[4]);
						newHtmlRow += "</TR>";
						html += newHtmlRow;
						htmlRowId++;
						// new row added.
						info_curTableFieldLengthExtendedAtLine += ";Level:" + tableDescpALines[lineIndexA].split(",")[0] + "Index:" + tableDescpALines[lineIndexA].split(",")[1];
					}
					else {
						// add a new row in html table
						strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
						newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
						newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
						newHtmlRow += "<td width=60%><font size='1'>match</font></td>";
						newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
						newHtmlRow += "</TR>";
						html += newHtmlRow;
						htmlRowId++;
						// new row added.
					}
				} 
				else if (srcSqlType != curSqlType) {
					// add a new row in html table
					strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
					newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
					newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
					newHtmlRow += "<td width=60%><font size='1' color='red'>DB type changed from <old type> to <new type></font></td>";
					newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
					newHtmlRow = funcs.strrep(newHtmlRow, "<old type>", tableDescpALines[lineIndexA].split(",")[4]);
					newHtmlRow = funcs.strrep(newHtmlRow, "<new type>", tableDescpBLines[lineIndexB].split(",")[4]);
					newHtmlRow += "</TR>";
					html += newHtmlRow;
					htmlRowId++;
					// new row added.
					error_curTableFieldTypeChangedAtLine += ";Level:" + tableDescpALines[lineIndexA].split(",")[0] + "Index:" + tableDescpALines[lineIndexA].split(",")[1];
				} 
				else {
					// add a new row in html table
					strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
					newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
					newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
					newHtmlRow += "<td width=60%><font size='1'>match</font></td>";
					newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
					newHtmlRow += "</TR>";
					html += newHtmlRow;
					htmlRowId++;
					// new row added.
				}
				lineIndexA++;
				lineIndexB++;
			} 
			else {
				// search below tableDescpB lines, if tableAFieldName exists?
				var thisFieldInTableDescpAExistInB = -1;
				var t;
				for (t = lineIndexB + 1; t < lineIndexBMax; t++) {
					tableBFieldName = tableDescpBLines[t].split(",")[2];

					if (tableAFieldName == tableBFieldName) {
						thisFieldInTableDescpAExistInB = t;
					}
				}

				// if yes, guess tableDescpB has some additional fields, show each and lineIndexB++ 
				if (thisFieldInTableDescpAExistInB > 0) {
					do {
						tableBFieldName = tableDescpBLines[lineIndexB].split(",")[2];
						print("new field in cur env: " + tableBFieldName);
						if (lineIndexA == lineIndexAMax || tableDescpALines[lineIndexA] == "" || tableDescpALines[lineIndexA] == null) {
							// add a new row in html table
							strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
							newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
							newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
							newHtmlRow += "<td width=60%><font size='1'>extra field in current env.</font></td>";
							newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableBFieldName);
							newHtmlRow += "</TR>";
							html += newHtmlRow;
							htmlRowId++;
							// new row added.
							info_curTableHasMoreFieldAtButtum += ";Level:" + tableDescpBLines[lineIndexB].split(",")[0] + "Index:" + tableDescpBLines[lineIndexB].split(",")[1];
						} 
						else {
							// add a new row in html table
							strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
							newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
							newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
							newHtmlRow += "<td width=60%><font size='1' color='red'>extra field in current env.</font></td>";
							newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableBFieldName);
							newHtmlRow += "</TR>";
							html += newHtmlRow;
							htmlRowId++;
							// new row added.
							error_curTableHasMoreFieldAtLine += ";Level:" + tableDescpBLines[lineIndexB].split(",")[0] + "Index:" + tableDescpBLines[lineIndexB].split(",")[1];
						}
						lineIndexB++;
					}
					while (lineIndexB < thisFieldInTableDescpAExistInB);

				}
				// if not, this is an additional field in tableDescpA  
				else {
					print("new field in source env: " + tableAFieldName);
					// add a new row in html table
					strRowClass = htmlRowId % 2 == 0 ? "evenRow" : "oddRow";
					newHtmlRow = "<TR valign=top CLASS=\"" + strRowClass + "\">";
					newHtmlRow += "<td width=40%><font size='1'><field name></font></td>";
					newHtmlRow += "<td width=60%><font size='1' color='red'>extra field in source env.</font></td>";
					newHtmlRow = funcs.strrep(newHtmlRow, "<field name>", tableAFieldName);
					newHtmlRow += "</TR>";
					html += newHtmlRow;
					htmlRowId++;
					// new row added.
					error_srcTableHasMoreFieldAtLine += ";Level:" + tableDescpALines[lineIndexA].split(",")[0] + "Index:" + tableDescpALines[lineIndexA].split(",")[1];
					lineIndexA++;
				}
			}

		} 
		while (lineIndexA < lineIndexAMax || lineIndexB < lineIndexBMax);
		
		html += "</TABLE></DIV>";

		var risksForAutoCompareSuggestion = "";
		if (error_srcTableHasMoreFieldAtLine != "") {
			risksForAutoCompareSuggestion = "<font color=\"red\">Warning: Source table has extra fields.</font><br>";
		}
		if (error_curTableHasMoreFieldAtLine != "") {
			risksForAutoCompareSuggestion += "<font color=\"red\">Warning: Current table has extra fields not at buttum.</font><br>";
		}
		if (error_curTableFieldTypeChangedAtLine != "") {
			risksForAutoCompareSuggestion += "<font color=\"red\">Warning: Some fields' type changed.</font><br>";
		}
		if (error_curTableFieldLengthShortenedAtLine != "") {
			risksForAutoCompareSuggestion += "<font color=\"red\">Warning: Some fields are shortened.</font><br>";
		}
		
		if (risksForAutoCompareSuggestion == "") {
			if (info_curTableFieldLengthExtendedAtLine != "" && info_curTableHasMoreFieldAtButtum != "") {
				risksForAutoCompareSuggestion = "None, some fields are extended and current table has more fields at buttum.<br>";
			}
			else if (info_curTableFieldLengthExtendedAtLine != "") {
				risksForAutoCompareSuggestion = "None, some fields are extended.<br>";
			}
			else if (info_curTableHasMoreFieldAtButtum != "") {
				risksForAutoCompareSuggestion += "None, current table has more fields at buttum.<br>";
			}
			else {
				risksForAutoCompareSuggestion = "None.<br>";
			}
		}

		html = funcs.strrep(html, "<auto-compare suggestion>", risksForAutoCompareSuggestion);
	}
	
	return html;
}


function compareTableStructureBetweenTxtFileAndCurrent(fileName) {
	var oldTableDescp = readFile(fileName, "t");
	if (oldTableDescp == null || oldTableDescp == "") {
		print("Table structure descriptor missing:" + fileName);
		return "descriptor missing";
	}
	var oldTableLines = oldTableDescp.split("\n");
	if (funcs.lng(oldTableLines) < 2) {
		print("can't get table structure in UNL folder:" + fileName);
		return "can't compare";
	}
	var newTableDescp = "Undefined, please specify descriptor version.";
	var tableName = oldTableLines[0];
	
	// for unix, it will use /n, but for windows, /r/n, 
	//  so when migrate from windows to unix, need to remove /r in each txt line
	if (tableName.indexOf("\r") >= 0) {
		tableName = funcs.substr(tableName, 0, funcs.lng(tableName) - 1);
	}
	newTableDescp = getTableStructureFromDbdict(tableName);

	var fileNameNew = fileName.replace("_unload_structure", "_unload_structure_new");
	writeFile(fileNameNew, 't', newTableDescp);

	if (funcs.same(oldTableDescp, newTableDescp)) {
		return "same";
	}

	return "mismatch";
}


function getCurrentTimeInFormatType6plusMillseconds() {
	var curDate = new Date();
	var year = 1900 + curDate.getYear();
	var month = 1 + curDate.getMonth();
	var day = curDate.getDate();
	var hour = curDate.getHours();
	var minute = curDate.getMinutes();
	var second = curDate.getSeconds();
	var millsecond = curDate.getMilliseconds();

	if (month < 10) {
		mm = "0" + month;
	} else {
		mm = String(month);
	}

	if (day < 10) {
		dd = "0" + day;
	} else {
		dd = String(day);
	}

	if (hour < 10) {
		hh = "0" + hour;
	} else {
		hh = String(hour);
	}

	if (minute < 10) {
		MM = "0" + minute;
	} else {
		MM = String(minute);
	}

	if (second < 10) {
		ss = "0" + second;
	} else {
		ss = String(second);
	}

	if (millsecond < 10) {
		sss = "0" + millsecond;
	} else {
		sss = String(millsecond);
	}
	if (millsecond < 100) {
		sss = "0" + sss;
	}

	return String(year) + "/" + mm + "/" + dd + " " + hh + ":" + MM + ":" + ss + "." + sss;
}


// convert diffent format of data/time string(depend on contacts setting), to standard 'mm/dd/yyyy hh:MM:ss'
function convertToStandardDateFormat(oldStr, oldFormatType) {

	var ret = null;
	if (oldFormatType == "1" || oldFormatType == 1) {
		ret = oldStr.substr(0, 6) + "20" + oldStr.substr(6);
	}
	if (oldFormatType == "2" || oldFormatType == 2) {
		ret = oldStr.substr(3, 3) + oldStr.substr(0, 3) + "20" + oldStr.substr(6);
	}
	else if (oldFormatType == "3" || oldFormatType == 3) {
		ret = oldStr.substr(3, 5) + "/" + "20" + oldStr.substr(0, 2) + oldStr.substr(8);
	}
	else if (oldFormatType == "4" || oldFormatType == 4) {
		ret = oldStr;
	}
	else if (oldFormatType == "5" || oldFormatType == 5) {
		ret = oldStr.substr(3, 3) + oldStr.substr(0, 3) + oldStr.substr(6);
	}
	else if (oldFormatType == "6" || oldFormatType == 6) {
		ret = oldStr.substr(5, 5) + "/" + oldStr.substr(0, 4) + oldStr.substr(10);
	}

	return ret;
}


function convertDateFormatTo(curDate, newFormatType) {
	var year = 1900 + curDate.getYear();
	var month = 1 + curDate.getMonth();
	var day = curDate.getDate();
	var hour = curDate.getHours();
	var minute = curDate.getMinutes();
	var second = curDate.getSeconds();
	var millsecond = curDate.getMilliseconds();

	yyyy = String(year);
	yy = yyyy.substr(2, 2);
	if (month < 10) {
		mm = "0" + month;
	} else {
		mm = String(month);
	}

	if (day < 10) {
		dd = "0" + day;
	} else {
		dd = String(day);
	}

	if (hour < 10) {
		hh = "0" + hour;
	}
	else {
		hh = String(hour);
	}

	if (minute < 10) {
		MM = "0" + minute;
	} else {
		MM = String(minute);
	}

	if (second < 10) {
		ss = "0" + second;
	} else {
		ss = String(second);
	}

	var ret = null;
	if (newFormatType == "1" || newFormatType == 1) {
		ret = mm + "/" + dd + "/" + yy + " " + hh + ":" + MM + ":" + ss;
	}
	else if (newFormatType == "2" || newFormatType == 2) {
		ret = dd + "/" + ddmm + "/" + yy + " " + hh + ":" + MM + ":" + ss;
	}
	else if (newFormatType == "3" || newFormatType == 3) {
		ret = yy + "/" + mm + "/" + dd + " " + hh + ":" + MM + ":" + ss;
	}
	else if (newFormatType == "4" || newFormatType == 4) {
		ret = mm + "/" + dd + "/" + yyyy + " " + hh + ":" + MM + ":" + ss;
	}
	else if (newFormatType == "5" || newFormatType == 5) {
		ret = dd + "/" + mm + "/" + yyyy + " " + hh + ":" + MM + ":" + ss;
	}
	else if (newFormatType == "6" || newFormatType == 6) {
		ret = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + MM + ":" + ss;
	}
	
	return ret;
}


/*
  tool function to prepare HTML description for wizards 
  input:  1. wizard name 
  output: 1. description in HTML style, to be displayed on wizard form
*/
function getDescriptionHtmlForWizards(wizardName) {

	var html = lib.htmlTemplates.getBasicListTemplate();
	
	switch (wizardName) {
	case "Delta Migration General (Intro)":
		html += "<h1>General Introduction of Delta Migration Tool</h1>";
		html += "<p><b>It may take serveral days when old version of Service Manager upgrade to new version, the production data that generated at that time on old environment also need to migrate to new environment. </b></p>";
		html += "<p><b>This tool is used to migration data from old production environment to new production environment.</b></p>";
		html += "<p>current time: " + new Date() + "</p>";
		break;
	case "Delta Migration General (Select Mode)":
		html += "<h1>Select migration mode</h1>";
		html += "<p><b>Two modes are available to migration data: </b></p>";
		html += "<p><b>The first one is to use this tool to generate a unload script, then use it to unload data from old environment manually, and load data onto new environment manually. </b></p>";
		html += "<p><b>The second one is to use this tool to generate some background schedule, they will abstract data into multiple UNL fiels in specified folder, then copy the whole folder to new environment, run the tool again, some background schedule will be generated to load data into tables. </b></p>";
		break;
	case "Delta Migration by UNL (Intro)":
		html += "<h1>Detailed steps to migration using mode 1</h1>";
		html += "<p><b>Specify the start time in the coming wizard window. </b></p>";
		html += "<p><b>Then a unload script named 'delta_data_after_<yyyymmdd>' will be created in old environment. </b></p>";
		html += "<p><b>Use this unload script to retrive data from onld environment to a UNL file</b></p>";
		html += "<p><b>Finally, deploy the UNL file onto new environment.</b></p>";
		break;
	case "Delta Migration by UNL (Select Params)":
		html += "<h1>Select the start day of data to be migrated:</h1>";
		html += "<p><b>Note: it may take some time if many days' data are to be migrated. </b></p>";
		break;
	case "Delta Migration by Bg UNLs (Intro)":
		html += "<h1>Detailed steps to migration using mode 2</h1>";
		html += "<p><b>Create a folder in old environment, make sure Service Manager can add file into it. </b></p>";
		html += "<p><b>Start scheduler 'dmt.unload.load', it will open 5 small schedulers from 'bg_load_unload1' to 'bg_load_unload5' </b></p>";
		html += "<p><b>Input the folder name, and specify the start time/end time in the coming wizard window. </b></p>";
		html += "<p><b>Then some schedules will be created, they will retrieve data into UNL files and save them in the folder mentioned above. </b></p>";
		html += "<p><b>Wait until all schedules finished</b></p>";
		html += "<p><b>Copy the whole folder to new environment</b></p>";
		html += "<p><b>Login SM of new environment, click menu item 'Delta Migration Import', the guide in it will show you how to continue.</b></p>";
		break;
	case "Delta Migration by Bg UNLs (Select Params)":
		html += "<h1>Select below parameters:</h1>";
		html += "<p><b>Target folder to contains UNL files for migration. </b></p>";
		html += "<p><b>Start time and end time of data to be migrated.</b></p>";
		html += "<p><b>Note: it may take some time if many days' data are to be migrated. </b></p>";
		break;
	case "Delta Migration by Bg UNLs (Check before Export)":
		html += "<h1>Please review the tables to be migrated:</h1>";
		html += "<p><b>If you think no need to migrate data in some tables, modify column 'Migrate?' from 'yes' to 'no', and provide comments. </b></p>";
		break;
	case "Delta Migration by Bg UNLs (Confirm before Export)":
		html += "<h1>Please review the tables to be migrated again:</h1>";
		break;
	case "Delta Migration by Bg UNLs (Run)":
		html += "<p><b>Background tasks are scheduled. </b></p>";
		html += "<p><b>To see the current process status, goto the UNL folder you selected, open 'Overall Export Status Report.html' </b></p>";
		html += "<p><b>Please wait until 'Overall Export Status Report.html' show 100% completed. </b></p>";
		break;
	case "Delta Migration by Bg UNLs (Intro for Import)":
		html += "<h1>Detailed steps to add data into new environment using mode 2</h1>";
		html += "<p><b>Start scheduler 'dmt.unload.load', it will open 5 small schedulers from 'bg_load_unload1' to 'bg_load_unload5' </b></p>";
		html += "<p><b>A folder contains multiple UNL files, multiple txt files should already be in the new environment.) </b></p>";
		html += "<p><b>Input the folder name in the coming wizard window. </b></p>";
		html += "<p><b>Then some schedules will be created, they will load data from UNL files in the folder mentioned above, to SM. </b></p>";
		html += "<p><b>Wait until all schedules finished</b></p>";
		break;
	case "Delta Migration by Bg UNLs (Select Params for Import)":
		html += "<h1>Select below parameters:</h1>";
		html += "<p><b>Target folder that contains UNL files for migration. </b></p>";
		break;
	case "Delta Migration by Bg UNLs (Check before Import)":
		html += "<h1>Please review the tables to be migrated:</h1>";
		html += "<p><b>If the table structure of new environment is same as that in old environment, delta data in it will be migrated by defalut, unless you cancel it. </b></p>";
		html += "<p><b>If the table structure of new environment is different from that in old environment, delta data in it will not be migrated by defalut, unless you checked and make sure it can be migrated using UNL files. </b></p>";
		break;
	case "Delta Migration by Bg UNLs (Confirm before Import)":
		html += "<h1>Please review the tables to be migrated again:</h1>";
		break;
	case "Delta Migration by Bg UNLs (Run for Import)":
		html += "<p><b>Background tasks are scheduled. </b></p>";
		html += "<p><b>To see the current process status, goto the UNL folder you selected, open 'Overall Import Status Report.html' </b></p>";
		html += "<p><b>Please wait until 'Overall Import Status Report.html' show 100% completed. </b></p>";
		break;
	default:
		html += "<p><b>Default Introduction of Delta Migration Tool...</b></p>";
		break;
	}

	return html;
}


/*
  tool function to prepare confirm report before execution for wizards 
  input:  1,   wizard name 
          2,   a array of confirmed information, for export and for import, the structure is different  
  output: 1,  description in HTML style, to be displayed on wizard form
*/
function getReportHtmlForWizards(wizardName, array_confirmdList) {

	var num_potentialTables = 0;
	var num_tablesWithDeltaData = 0;
	var num_tablesNotSuggestedToImportHere = 0;
	var num_userForcedDisabledTables = 0;
	var num_userForcedEnabledTables = 0;
	var num_migrateTables = 0;
	var num_migrateUNLs = 0;
	var array_tablesNotSuggestedToImportHere = [];
	var array_userForcedDisabledTables = [];
	var array_userForcedEnabledTables = [];
	var array_migrateTables = [];
	var seconds_total = 0;

	var html = lib.htmlTemplates.getBasicListTemplate();
	var i, length = lib.ArrayUtil.length(array_confirmdList);
	
	switch (wizardName) {
	case "Delta Migration by Bg UNLs (Confirm before Export)":
		/* for confirm before export, the structure of 'array_cofirmedList'
		<table name>$
		<timestamp field>$
		<suggestion, such as 'export by default', 'need confirm'>$
		<time estimation, in seconds>$
		<unload or not, 'true' or 'false', if 'suggestion is 'export by default', it is 'true', otherwise it is false, but user can modify in next GUI>$
		<comments, such as 'table structure are same', can be modified by user later>
		*/
		for (i = 0; i < length; i++) {
			thisTableInfo = array_confirmdList[i];
			tableName = thisTableInfo.split("$")[0];
			timeStapmField = thisTableInfo.split("$")[1];
			suggestion = thisTableInfo.split("$")[2];
			secondsNeeded = thisTableInfo.split("$")[3];
			migrateDecision = thisTableInfo.split("$")[4];
			comment = thisTableInfo.split("$")[5];

			num_potentialTables++;
			if (suggestion == "export by default") {
				num_tablesWithDeltaData++;
			}
			if (migrateDecision == "true" && suggestion != "export by default") {
				num_userForcedEnabledTables++;
			}
			if (migrateDecision == "false" && suggestion == "export by default") {
				num_userForcedDisabledTables++;
				array_userForcedDisabledTables.push(tableName);
			}
			if (migrateDecision == "true") {
				num_migrateTables++;
				array_migrateTables.push(tableName);
				seconds_total += parseFloat(secondsNeeded);
			}
		}
		/****
      Totally <#> tables with modification time field are checked in the current system: 

- <#> tables have delta data

- <#> tables are ignored by user

<#> tables will export delta data:

- Estimated export time is <#> seconds/minutes/hours
      ****/

		html += "<p><b>Totally " + num_potentialTables + " tables containing modification time field are checked in this system: </b></p>";
		html += "<p><b>- " + num_tablesWithDeltaData + " tables have the delta data.</b></p>";
		html += "<p><b>- " + num_userForcedDisabledTables + " tables are ignored by the user.</b></p>";
		html += "<p><b>" + num_migrateTables + " tables will export the delta data.</b></p>";
		if (seconds_total < 60) {
			html += "<p><b>- Estimated export time is 1 minute.</b></p>";
		} 
		else if (seconds_total < 3600) {
			minutes_total = seconds_total / 60;
			html += "<p><b>- Estimated export time is " + Math.ceil(minutes_total) + " minutes</b></p>";
		} 
		else {
			hours_total = seconds_total / 3600;
			html += "<p><b>- Estimated export time is " + 0.1 * Math.round(10 * hours_total) + " hours</b></p>";
		}

		break;
		
	case "Delta Migration by Bg UNLs (Confirm before Import)":
		/* for confirm before import, the structure of 'array_cofirmedList'
		<table name>$
		<suggestion, such as 'import by default', 'need confirm'>$
		<import or not, 'true' or 'false', if 'suggestion is 'import by default', it is 'true', otherwise it is false, but user can modify in next GUI>$
		<comments, such as 'table structure are same', can be modified by user later>
		*/
		for (i = 0; i <length; i++) {
			thisTableInfo = array_confirmdList[i];
			tableName = thisTableInfo.split("$")[0];
			suggestion = thisTableInfo.split("$")[1];
			migrateDecision = thisTableInfo.split("$")[2];
			comment = thisTableInfo.split("$")[3];

			num_potentialTables++;
			if (suggestion == "import by default") {
				num_tablesWithDeltaData++;
			}
			if (suggestion != "import by default") {
				num_tablesNotSuggestedToImportHere++;
				array_tablesNotSuggestedToImportHere.push(tableName + ", suggestion:" + suggestion);
			}
			if (migrateDecision == "true" && suggestion != "import by default") {
				num_userForcedEnabledTables++;
				array_userForcedEnabledTables.push(tableName + ", user comments:" + comment);
			}
			if (migrateDecision == "false" && suggestion == "import by default") {
				num_userForcedDisabledTables++;
				array_userForcedDisabledTables.push(tableName + ", user comments:" + comment);
			}
			if (migrateDecision == "true") {
				num_migrateTables++;
				array_migrateTables.push(tableName);
			}
		}
		html += "<p><b>Totally " + num_potentialTables + " tables have delta data from the existing environment. </b></p>";
		html += "<p><b>- " + num_tablesNotSuggestedToImportHere + " tables are suggested not to import</b></p>";
		html += "<p><b>- " + num_userForcedDisabledTables + " tables are ignored by the user.</b></p>";
		html += "<p><b>- " + num_userForcedEnabledTables + " tables will be forced to import</b></p>";
		html += "<p><b>" + num_migrateTables + " tables will import the delta data</b></p>";
		break;
		
	default:
		html += "";
		break;
	}

	return html;
}