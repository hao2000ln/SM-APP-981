var Util = lib.DeltaMigrationUtil;
var $ = lib.c.$;

var COUNTER_BAK_SUFFIX = "_DeltaMigrationBackup";

/*
    this function will do some initialize function before importing, include:
      disable triggers in background scheduler session
*/
function load_data_init() {
	
	Util.messageList_init();
	Util.kpiList_init();

	var i;
	for (i = 1; i <= 5; i++) {
		Util.scheduler_register("bg_load_unload" + i);
		Util.scheduler_watchDogHungry("bg_load_unload" + i);
	}
	
	var f = new SCFile("schedule");
	f.expiration = new Date();
	for (i = 1; i <= 5; i++) {
		f.name = "bg_load_unload" + i + " report.";
		f.javascript = "lib.DeltaMigrationUtil.scheduler_watchDogFeed(\"bg_load_unload" + i + "\");";
		f._class = "bg_load_unload" + i;
		f.doInsert();
	}

	f = new SCFile("schedule");
	f.expiration = new Date();
	for (i = 2; i <= 5; i++) {
		f.name = "disable triggers - bg_load_unload" + i;
		f.javascript = "lib.DeltaMigrationUtil.scheduler_disable_triggers(\"bg_load_unload" + i + "\");";
		f._class = "bg_load_unload" + i;
		f.doInsert();
	}
}


/*
  function before data loading by lots of unl files
  return value will be used to setup $tablesToBeLoaded, which is a array, its item is:
    <table name>$
    <suggestion, such as 'import by default', 'need confirm'>$
    <import or not, 'true' or 'false', if 'suggestion is 'import by default', it is 'true', otherwise it is false, but user can modify in next GUI>$
    <comments, such as 'table structure are same', can be modified by user later>
  $tablesToBeLoaded  will be displayed and updated in next wizard, for user to select which tables are to be imported
  
  input:  1,  folder that contains UNL files 
  output: 1,  return value will be used to setup $tablesToBeLoaded
*/
function load_data_pre_check(FILE_PATH) {

	Util.messageList_init();
	Util.messageList_add("info", "start checking before load");

	// check input parameter here
	var contentFeedback = readFile(FILE_PATH + "readme.txt", "t");
	if (contentFeedback == -1) {
		Util.messageList_add("error", "Selected folder is empty, or 'readme.txt' missing. Please check the folder again.");
		return null;
	}
	
	// check background schedulers
	if (!Util.scheduler_areAllStarted()) {
		Util.messageList_add("error", "Background scheduler 'dmt_unload_load*' not started yet, please start them in 'System Status'. If they are already there, wait for 1 minute and try again.");
		return null;
	}
	
	if (Util.scheduler_isItDisabledTriggers("bg_load_unload2") == false ||
		Util.scheduler_isItDisabledTriggers("bg_load_unload3") == false ||
		Util.scheduler_isItDisabledTriggers("bg_load_unload4") == false ||
		Util.scheduler_isItDisabledTriggers("bg_load_unload5") == false
	) {
		Util.messageList_add("error", "Background scheduler 'dmt_unload_load*' are trying to disable triggers, please wait at most 1 minutes before starting importing.");
		return null;
	}

	var array_fileAndTimestampField = getExportedTableAndTimestampFieldFromFile(FILE_PATH + "table_exported.txt");
	if (array_fileAndTimestampField == null || funcs.lng(array_fileAndTimestampField) == 0) {
		Util.messageList_add("error", "Can't find list of exported tables in 'table_exported.txt'.");
		return null;
	}

	var array_tableToBeLoaded = [];
	var tableToBeLoaded = "";

	var i;
	for (i = 0; i < array_fileAndTimestampField.length; i++) {
		tableName = array_fileAndTimestampField[i].split(",")[0];
		timestampField = array_fileAndTimestampField[i].split(",")[1];
		migration_suggestion = "?";
		migration_finalDecision = false;
		migration_userConfirm = "";

		var fileName = FILE_PATH + tableName + "_unload_result.txt";
		var fileBody = readFile(fileName, "t");
		if (fileBody == -1) {
			continue;
		}
		fileBody = fileBody.replace(/\r\n/g, "\n");

		// get the table structure of table to load UNL, if it is different from that of old environment, then the UNL file should not be loaded.
		var tableStructureCompareResult = compareTableStructureBetweenTxtFileAndCurrent(FILE_PATH + tableName + "_unload_structure.txt");
		if (tableStructureCompareResult == "same") {
			Util.messageList_add("debug", "File structure match -   " + tableName);
			migration_suggestion = "import by default";
			migration_finalDecision = true;
			migration_userConfirm = "";
		}
		else {
			if (tableStructureCompareResult == "descriptor missing") {
				Util.messageList_add("debug", "File structure match -   " + tableName);
				continue;
			}
			print("File structure changed -   " + tableName);
			migration_suggestion = "need confirm, table structure changed.";
			migration_finalDecision = false;
			migration_userConfirm = "";
		}

		var Tags = fileBody.split("\n");
		var tLng = funcs.lng(Tags);
		if (tLng < 1) {
			print("No UNL file for " + tableName + "!");
			continue;
		}
		tableToBeLoaded = tableName + "$" + migration_suggestion + "$" + migration_finalDecision + "$" + migration_userConfirm;
		array_tableToBeLoaded.push(tableToBeLoaded);
	}
	
	Util.messageList_add("info", "finish checking before load");
	
	return array_tableToBeLoaded;
}


/*
  main function for data loading by lots of unl files
  
  input:  1,  folder that contains UNL files 
          2,  $tablesToBeLoaded (include user's final decision about migrate or not)
  output: 1,  UNL files
          2,  <table name>_load_result.txt (include how many UNL files loaded.)
*/

function load_data_utility(FILE_PATH, array_tableToBeLoaded) {

	Util.messageList_add("info", "start checking before load");
	
	// preliminary process
	load_data_pre();
	
	var f = new SCFile("schedule");
	if (RC_SUCCESS == f.doSelect("name#\"load data - \"")) {
		do {
			f.doDelete();
		}
		while (RC_SUCCESS == f.getNext());
	}

	var array_fileAndTimestampField = getExportedTableAndTimestampFieldFromFile(FILE_PATH + "table_exported.txt");

	var i, j;
	for (i = 0; i < array_fileAndTimestampField.length; i++) {
		tableName = array_fileAndTimestampField[i].split(",")[0];
		timestampField = array_fileAndTimestampField[i].split(",")[1];

		var fileName = FILE_PATH + tableName + "_unload_result.txt";
		var fileBody = readFile(fileName, "t");
		if (fileBody == -1) {
			print("File does not exist -   " + fileName);
			continue;
		}
		fileBody = fileBody.replace(/\r\n/g, "\n");

		// check user confirmation in array_tableToBeLoaded
		var importOrNotByDefault = null;
		var importOrNotByUserConfirm = null;
		var importTheseUNL = false;
		for (j = funcs.lng(array_tableToBeLoaded) - 1; j >= 0; j--) {
			tableToBeLoaded = array_tableToBeLoaded[j];
			var columns = tableToBeLoaded.split("$");
			migration_tableName = columns[0];
			if (tableName == migration_tableName) {
				migration_suggestion = columns[1];
				migration_finalDecision = columns[2];
				migration_userConfirm = columns[3];
				if (migration_finalDecision == true || migration_finalDecision == "true") {
					importTheseUNL = true;
				}
				break;
			}
		}

		if (importTheseUNL) {
			Util.messageList_add("info", "Delta data for file " + migration_tableName + " will be imported.");
		} else {
			Util.messageList_add("info", "Delta data for file " + migration_tableName + " will not be imported, (" + migration_suggestion + "," + migration_userConfirm + ")");
			continue;
		}

		var Tags = fileBody.split("\n");
		var tLng = funcs.lng(Tags);
		if (tLng < 1) {
			Util.messageList_add("warning", "File " + fileName + " is empty!");
			continue;
		}

		var rnd = 2 + Math.floor(Math.random() * 4);
		for (j = 0; j < tLng; j++) {
			if (funcs.lng(funcs.denull(Tags[j])) == 0) {
				continue;
			}
			
			Util.messageList_add("info", "schedule for load " + Tags[j] + " created under bg_load_unload" + rnd);
			Util.kpiList_register("import_" + Tags[j], tableName, "", 1, Tags[j], 1);
			
			// create new schedule to run "bg_load_unload" for each unload file
			createImportScheduler(FILE_PATH, Tags[j]);
		}
	}

	Util.kpiList_generateImportStatusReportHTML(FILE_PATH + "Overall Import Status Report.html");

	// setup 'bg_load_unload1' to update 'Overall Export Status Report.html' every minutes, until 100% completed.
	var f2 = new SCFile("schedule");
	f2._class = "bg_load_unload1";
	f2.name = "prepare real-time report for delta migration progress";
	var scriptJS = "lib.DeltaMigrationUtil.kpiList_updateAndscheduleNextStatusReportUpdate(\"" + FILE_PATH + "Overall Import Status Report.html\",\"import\",\"" + f2._class + "\");";
	scriptJS = funcs.strrep(scriptJS, "\\", "\\\\");
	f2.javascript = scriptJS;
	var scriptExpiry = new Date();
	var nowPlusDelay = scriptExpiry.getMinutes() + 1;
	scriptExpiry.setMinutes(nowPlusDelay);
	f2.expiration = scriptExpiry;
	f2.doInsert();

	Util.messageList_add("info", "finish creating schedule for load.");
	Util.messageList_add("info", "delta data are scheduled to import, please open 'Overall Import Status Report.html' in target folder for real-time status.");
}


/**
 * Create a new schedule record for import
 */
function createImportScheduler(filePath, fileName) {
	var fsche = new SCFile("schedule");
	fsche.application = "bgload";
	fsche.strings[0] = filePath + fileName;
	fsche.strings[1] = "database load/unload.winnt";
	fsche.strings[2] = "false";
	
	fsche.expiration = Util.dateTime_addSeconds(new Date(), 3);
	fsche.name = "load data - " + fileName;
	fsche.javascript = "lib.DeltaMigrationUtil.kpiList_update(\"" + filePath + "\",\"" + fileName + "\",1,\"import\");";
	var rnd = 2 + Math.floor(Math.random() * 4);
	fsche._class = "bg_load_unload" + rnd;
	
	fsche.doInsert();
}


function compareTableStructureBetweenTxtFileAndCurrent(fileName) {
	var oldTableDescp = readFile(fileName, "t");
	if (oldTableDescp == -1 || oldTableDescp == null || oldTableDescp == "") {
		print("Table structure descriptor missing:" + fileName);
		return "descriptor missing";
	}
	var oldTableLines = oldTableDescp.split("\n");
	if (funcs.lng(oldTableLines) < 2) {
		print("can't get table structure in UNL folder:" + fileName);
		return "can't compare";
	}
	
	var tableName = oldTableLines[0];
	
	// for unix, it will use /n, but for windows, /r/n, 
	// so when migrate from windows to unix, need to remove /r in each txt line
	if (tableName.indexOf("\r") >= 0) {
		tableName = funcs.substr(tableName, 0, funcs.lng(tableName) - 1);
	}

	var newTableDescp = Util.getTableStructureFromDbdict(tableName);

	var fileNameNew = fileName.replace("_unload_structure", "_unload_structure_new");
	writeFile(fileNameNew, 't', newTableDescp);

	if (funcs.same(oldTableDescp, newTableDescp)) {
		return "same";
	}

	return "mismatch";
}


function getExportedTableAndTimestampFieldFromFile(filePathName) {
	var ret = [];
	var fileBody = readFile(filePathName, "t");
	if (fileBody == -1) {
		return ret;
	}

	var Tags = fileBody.split("\n");
	var i;
	for (i = 0; i < Tags.length; i++) {
		if (Tags[i] != null && Tags[i] != "" && Tags[i] != "Table Name,Timestamp Field Name") {
			// also check dbdict, in case the table doesn't exists in new environment
			var f = new SCFile("dbdict", SCFILE_READONLY);
			var q = "name=\"" + Tags[i].split(",")[0] + "\"";
			if (RC_SUCCESS == f.doSelect(q)) {
				ret.push(Tags[i]);
			}
		}
	}
	
	return ret;
}


/**
 * Import single unload file
 *
 * @param	{String}	path
 */
function load_data_utility_single(path) {

	var rc = new SCDatum();

	if (path == null) {
		funcs.rtecall("msg", rc, funcs.scmsg("25", "us"), 3);
		return;
	}
	if (!lib.upgradeUtility.isFile(path)) {
		funcs.rtecall("msg", rc, funcs.scmsg("875", "us", [path]), 3);
		return;
	}

	// disable trigger
	funcs.rtecall("trigger", rc, 0);
	
	Util.messageList_init();
	
	// pre process
	load_data_pre();

	try {
		callrad("file.load", ["name"], [path]);
	}
	catch (ex) {
	}
	
	// enable trigger
	funcs.rtecall("trigger", rc, 1);

	// post process
	load_data_post();
}


/**
 * Preliminary  action before importing
 */
function load_data_pre() {
	Util.messageList_add("info", "disable specific counters");
	disableSpecificCounters();
}


/**
 * Post action after importing completed
 */
function load_data_post() {
	Util.messageList_add("info", "import post process start");
	
	Util.messageList_add("info", "refresh globallist");
	$("globallists").selectAll().iterate(function(list) {
		if (list.filename == null || list.filename.length == 0) {
			return false;
		}

		if (list.build_startup) {
			// update expiration date if build at startup
			list.expiration = new Date();
			list.doUpdate();
		}
		else {
			// rebuild if not build at startup
		    callrad("apm.server.initer", ["names"], [[list.name]]);		
		}
	});
		
	Util.messageList_add("info", "enable specific counters");
	enableSpecificCounters();
	
	Util.messageList_add("info", "synchronize counters");
	lib.BaseUtil.synchronizeCounters();
	
	Util.messageList_add("info", "compile displayscreen");
	callrad("us.compile.screens");
	
	Util.messageList_add("info", "import post process complete");
}


function disableSpecificCounters() {
	var list = lib.DeltaMigrationConfiguration.getImportDisableCounterList();
	
	var i;
	for (i = 0; i < list.length; i++) {
		var tablename = list[i];
		var counter = $("counters").select('table.name="' + tablename + '"').uniqueResult();
		if (counter == null) {
			continue;
		}
		
		var counterbak = $("counters").select('table.name="' + tablename + COUNTER_BAK_SUFFIX + '"').uniqueResult();
		if (counterbak != null) {
			counterbak.doDelete();
		}

		// change table name value		
		counter.table_name += COUNTER_BAK_SUFFIX;
		counter.doUpdate();
	}
}


function enableSpecificCounters() {
	var list = lib.DeltaMigrationConfiguration.getImportDisableCounterList();
	
	var i;
	for (i = 0; i < list.length; i++) {
		var tablename = list[i];
		var counter = $("counters").select('table.name="' + tablename + '"').uniqueResult();
		if (counter != null) {
			continue;
		}
	
		var counterbak = $("counters").select('table.name="' + tablename + COUNTER_BAK_SUFFIX + '"').uniqueResult();
		if (counterbak == null) {
			continue;
		}
		
		counterbak.table_name = tablename;
		counterbak.doUpdate();
	}
}
