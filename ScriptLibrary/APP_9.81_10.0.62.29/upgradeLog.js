/***
 		Write Log Util For Upgrade

 List of upgrade log files (refer to page 47 in released upgrade guide)
 
 detail.log       specific information about the upgrade, such as which files are being signed at any time.
 
 except.log       The exception.log file may have important messages about data type mismatches that you should resolve, or database
                  dictionaries that it cannot upgrade. 
 
 upgrade.log      Information about where the upgrade is at any point. This file contains only the main steps of the upgrade.
 
 datascan.log     Information about data scanning.
 
 appsChanges.log  TODO
 

 usage:
 	lib.upgradeLog.writeLog(MESSAGE, LOGNAME);
 	lib.upgradeLog.writeLog(MESSAGE, LOGNAME, STATUS_ARRAY, status, syspub, line);
 	
 	lib.upgradeLog.error("log message ...");
	lib.upgradeLog.scError(msgid)
	lib.upgradeLog.scError(msgid, params_array);
	
	RAD statement
	$L.void=jscall("upgradeLog", msgid, params_array)
 	
 Tod
 2011-01-05 
***/

//RAD: apm.upgrade.wizard start panel hard code
var L_VERSION = lib.upgradeConstants.TARGET_VERSION();
/**
*  For Dev DEBUG, print the message in SM instead of writing file log 
*  Please set DEBUG false in production environment.
**/ 
var DEBUG = false;

// set SM logs fold path for the log default path
var SM_LOG_PATH = lib.upgradeUtility.getRteLogPath();

/**
*   write SM upgrade error.log, log message defined in scmessage table
*
*	@param {String} scmsgid	-  The name of the scmessage id
*	@param {Array}	msgParams	-	The message parameters array
**/
function scError(scmsgid, msgParams) {
	if (msgParams == null || msgParams == undefined) {
		error(funcs.scmsg(scmsgid, "upg"));
	} else {
		error(funcs.scmsg(scmsgid,"upg", initMsgArgs(msgParams)));
	}
}

function scDetail(scmsgid, msgParams) {
	if (msgParams == null || msgParams == undefined) {
		detail(funcs.scmsg(scmsgid, "upg"));
	} else {
		detail(funcs.scmsg(scmsgid,"upg", initMsgArgs(msgParams)));
	}
}

function scAppsChanges(scmsgid, msgParams) {
	if (msgParams == null || msgParams == undefined) {
		appsChanges(funcs.scmsg(scmsgid, "upg"));
	} else {
		appsChanges(funcs.scmsg(scmsgid,"upg", initMsgArgs(msgParams)));
	}
}

function scUpgrade(scmsgid, msgParams) {
	if (msgParams == null || msgParams == undefined) {
		upgrade(funcs.scmsg(scmsgid, "upg"));
	} else {
		upgrade(funcs.scmsg(scmsgid,"upg", initMsgArgs(msgParams)));
	}
}

function scDatascan(scmsgid, msgParams) {
	if (msgParams == null || msgParams == undefined) {
		datascan(funcs.scmsg(scmsgid, "upg"));
	} else {
		datascan(funcs.scmsg(scmsgid,"upg", initMsgArgs(msgParams)));
	}
}

/**
*   write SM upgrade error.log
*
*	@param {String} log	-  The log statements
**/
function error(log) {
	writeLog(log, getLogPath() + "except.log"); 
}

function detail(log) {
	writeLog(log, getLogPath() + "detail.log");
}

function appsChanges(log) {
	writeLog(log, getLogPath() + "appsChanges.log");
}

function upgrade(log) {
	writeLog(log, getLogPath() + "upgrade.log");
}

function datascan(log) {
	writeLog(log, getLogPath() + "datascan.log");
}

/**
*   get log message parameters
*
*	@param {Array} msgParams	-  The scmessage log parameters
**/
function initMsgArgs(msgParams) {
	if (msgParams != null && msgParams != undefined) {
		var paramsLength;
	    if (typeof(msgParams.length) == "number") {
	    	// Javascript array
	    	paramsLength = msgParams.length;
	    } else if (typeof(msgParams.length) == "function") {
	    	// RAD array object length 
	    	paramsLength = msgParams.length();
	    } else {
	    	error("Unsupport message parameters ...");
	    	return;
	    }
	    
	   	var args = new SCFile();
		args.setType( 8 );	//type array
		var i;
		for (i=0; i<paramsLength; i++) {
			args.push(msgParams[i]);
		}
		return args;
	}
}

/**
*   get log message path
*	retrieve the log path based on the upgrade package path and write it to global variable $G_UpgradeLogPath
*   
*	@return the log path. eg: the logs folder under upgrade package path, if the path is not existed in 'upgradestatus' table, return SM log path.
**/
function getLogPath() {
	if (vars.$G_UpgradeLogPath == null 
			|| vars.$G_UpgradeLogPath == undefined) {		
		var dbdict = new SCFile("dbdict");
		var rc = dbdict.doSelect("name=\"upgradestatus\"");
		if (rc == RC_SUCCESS) {
			// get path from upgradestatus table
			var upgradestatus = new SCFile("upgradestatus", SCFILE_READONLY);
			rc = upgradestatus.doSelect("true");
			if (rc == RC_SUCCESS && upgradestatus.path != null && lib.upgradeUtility.isDirectory(upgradestatus.path)) {
				// retrieve log path based on upgrade package path and set it as global variable
				vars.$G_UpgradeLogPath = lib.upgradeUtility.getLogPath(upgradestatus.path); 
			} else {
				return SM_LOG_PATH;
			}
		} else {
			// table does not exist
			funcs.msg("upgradestatus does not exist in SM.");
			return SM_LOG_PATH;
		}
	}
	return 	vars.$G_UpgradeLogPath;
}


/**
*	 get OS default path,  'c:\\' for windows,  '/usr/' for Linux
*
*    @return existing path 
**/
function getOSDefaultPath() {
	//return default path for different OS(win, unix).
	var osName = funcs.version().os;
	return osName.indexOf("win") != -1 ? "C:\\" : "/usr/";
}


/**
*	write log function does same works like RAD: apm.upgrade.log
*   
*	@param content  string -->  log content
*	@param logname  string -->  log file name
* 	@param statusArray array --> upgrade status array
*		 example: var array = ["version","path","option","copyold",false,false,2,"last_action","steps","syslang", "status","IM_tickets_sla_conversion",false];
* 	@param status   boolean --> a flag that insert log into upgradestatus 
* 	@param syspub   string -->  user name. example: "falcon" 
* 	@param line     string -->  widget name, widget display the upgrade progress.
* 
* 	@param global variable  vars.$G_DbgAppTrc  boolean --> sm log flag
* 	@param global variable  vars.$G_internal_log  boolean --> a flag that insert log into upgradepseudolog 
**/
function writeLog(content, logname, statusArray, status, syspub, line) {
	var pid = funcs.nullsub(funcs.sysinfo_get("ClientPID"), "Unknown PID");
	// date format 11/21/10 23:04:00,  getTODdate get current SM datetime with timezone
	var fullText = lib.upgradeCommonLib.formatDate(funcs.tod(),"yyyy-mm-dd HH:MM:ss") + " " + content + "\n";
	var fullPath;

	if (statusArray == null) {
		fullPath = logname;
	} else {
		var path = funcs.nullsub(statusArray[1], "");
		if (path != "") {
		    path = lib.upgradeUtility.getLogPath(path);
		}
		fullPath = path + logname;
	}
	
	if (syspub != null) {
		var logmsg = "$SYSPUB." + syspub + ";" + fullText;
		sendMsg(syspub, logmsg);
	}
	
	if (line != null) {
		if (line != "status") {
			line = "status" + line;
		}
		funcs.rtecall("statusupdate", vars.$L_err, line, content);
	}
	
	// write external log
	if (DEBUG) {
		print(fullPath + ": " + fullText);
	} else {
		writeFile(fullPath, 'a', fullText);
	}
    
	
	// update status table
	if (statusArray != null && status) {
		//last action
		statusArray[7] = content;
		var statusmsg = "$SYSPUB.apmstatus;" + content;
		addOrUpdateStatus(statusArray);
		sendMsg(syspub, statusmsg);		
	} 
	
}

/**
*	 call 'msg' rad, send message to user
*
*    @param {String} user	-  the sm user name, eg: falcon
*    @param {String} content  -  the message content
**/
function sendMsg(user, content) {
	var rteReturnValue = new SCDatum();
	var rteNames = new SCDatum();
	var rteValues = new SCDatum();
	 
	//Parameter names for RAD app message 
	rteNames.push("text"); // message
	rteNames.push("name"); // user

	//Parameter values for RAD app message
	rteValues.push(content);
	rteValues.push(user);
	
	funcs.rtecall("callrad", 
	rteReturnValue, 
	"msg", //RAD app name
	rteNames, 
	rteValues,
	false, //false to run in same thread, true to run in new thread
	true); //condition for executing the rad app

}

function upgradeStatusSave(status) {
	var rteReturnValue = new SCDatum();
	var rteNames = new SCDatum();
	var rteValues = new SCDatum();
	 
	//Parameter names for RAD app message 
	rteNames.push("record"); // status

	//Parameter values for RAD app message
	rteValues.push(status);
	
	funcs.rtecall("callrad", 
	rteReturnValue, 
	"apm.upgrade.status.save", //RAD app name
	rteNames, 
	rteValues,
	false, //false to run in same thread, true to run in new thread
	true); //condition for executing the rad app
}

/**
*	 save or update a record to 'upgradestatus' table
*    do same works as RAD: apm.upgrade.status.save
*
*    @param {Array} statusArray	-  the status array
**/
function addOrUpdateStatus(statusArray) {
	if (vars.$G_DbgAppTrc) {
		vars.$L_scsFlg = funcs.rtecall("log", vars.$L_rtnCod,
			 "*** Upgrade Status: Script \"upgradeLog.addOrUpdateStatus\" started. ***");
	}
	
	var upgradestatus = new SCFile("upgradestatus");
	var rc = upgradestatus.doSelect("version = \"" + statusArray[0] + "\"");

	upgradestatus.path = statusArray["path"];
	upgradestatus.option = statusArray["option"];
	upgradestatus.copyold = statusArray["copyold"];
	upgradestatus.internallog = statusArray["internallog"];
	upgradestatus.data_loaded = statusArray["data_loaded"];
	upgradestatus.current_step = statusArray["current_step"];
	upgradestatus.last_action = statusArray["last_action"];
	upgradestatus.steps = statusArray["steps"];
	upgradestatus.syslang = statusArray["syslang"];
	upgradestatus.status = statusArray["status"];
	upgradestatus.IM_tickets_sla_conversion = statusArray["IM.tickets.sla.conversion"];
	upgradestatus.custom = statusArray["custom"];
	
	if (rc == RC_SUCCESS) {
		upgradestatus.doUpdate();
	} else {
		// create new record if it can not be found
			upgradestatus.version = funcs.nullsub(statusArray[0], "current");
		upgradestatus.doInsert();
	}
	
	if (vars.$G_DbgAppTrc) {
		vars.$L_scsFlg = funcs.rtecall("log", vars.$L_rtnCod, 
			"*** Upgrade Status: addUpgradeStatus completed. ***");
	}
}

/**
*	 save upgrade package path in load transfer.bin
*
*    @param {String} path	-  The upgrade package path
**/
function saveUpgradePackagePath(path) {
	if (path != null && path != "") {
		var statusArray = [L_VERSION,path,,,,,,,,,,];
		addOrUpdateStatus(statusArray);
		vars.$G_UpgradeLogPath = path;
	}
}



/**
*	 define the upgrade phase key and name
*
**/
var PHASE = 
{
      
	"Load Transfer":
						{
							"Load Transfer":"Load Transfer"
						},
						
	"Apply OOB Package":
						{
							"Pre Upgrade Action Check":"Pre Upgrade Action Check",
							"Pre Upgrade Action Update":"Pre Upgrade Action Update",
							"Pre Upgrade Action Purge":"Pre Upgrade Action Purge",
							"Pre Upgrade Action":"Pre Upgrade Action",
							"Pre Upgrade Action PriorOrEqual SC6.2":"Pre Upgrade Action SC6.2 or Earlier",
							"Load Upgrade File":"Load Upgrade File",
							"Upgrade Dbdicts":"Upgrade Dbdicts",
							"Load Upgrading Data":"Load Upgrading Data",
							"Upgrade Data":"Upgrade Data",
							"Post Upgrade Action":"Post Upgrade Action",
							"Post Upgrade Action Prior SM7":"Post Upgrade Action Prior to SM7",
							"Post Upgrade Action Prior SM71":"Post Upgrade Action Prior to SM71",
							"Post Upgrade Action Prior SM920":"Post Upgrade Action Prior to SM920",
							"Post Upgrade Action Prior SM930":"Post Upgrade Action Prior to SM930",
							"Post Upgrade Action Prior SM940":"Post Upgrade Action Prior to SM940",
							"Post Upgrade Action Prior SM950":"Post Upgrade Action Prior to SM950",
							"Post Upgrade Action Prior SM960":"Post Upgrade Action Prior to SM960",
							"Post Upgrade Action Prior New Version":"Post Upgrade Action Prior to New Version",
							"Post Upgrade Action Auto Merge":"Post Upgrade Action Auto Merge",
							"Post Upgrade Action Purge":"Post Upgrade Action Purge",
							"Post Upgrade Action Update":"Post Upgrade Action Update",
							"Post Upgrade Action Notification":"Post Upgrade Action Notification",
							"Post Upgrade Action Restore":"Post Upgrade Action Restore"
						},
						
	"Create Custom Package":
						{
							"Pre Create Action Check":"Pre Create Action Check",
							"Build Signatures":"Build Signatures",
							"Build Distribution":"Build Distribution",
							"Export Data":"Export Data",
							"Transfer Data":"Transfer Data"
						},
						
	"Apply Custom Package":
						{
							"Pre Upgrade Action Check":"Custom Pre Upgrade Action Check",
							"Pre Upgrade Action Update":"Custom Pre Upgrade Action Update",
							"Pre Upgrade Action Purge":"Custom Pre Upgrade Action Purge",
							"Pre Upgrade Action":"Custom Pre Upgrade Action",
							"Pre Upgrade Action PriorOrEqual SC6.2":"Custom Pre Upgrade Action SC6.2 or Earlier",
							"Load Upgrade File":"Custom Load Upgrade File",
							"Upgrade Dbdicts":"Custom Upgrade Dbdicts",
							"Load Upgrading Data":"Custom Load Upgrading Data",
							"Upgrade Data":"Custom Upgrade Data",
							"Post Upgrade Action":"Custom Post Upgrade Action",
							"Post Upgrade Action Prior SM7":"Custom Post Upgrade Action Prior to SM7",
							"Post Upgrade Action Prior SM71":"Custom Post Upgrade Action Prior to SM71",
							"Post Upgrade Action Prior SM920":"Custom Post Upgrade Action Prior to SM920",
							"Post Upgrade Action Prior SM930":"Custom Post Upgrade Action Prior to SM930",
							"Post Upgrade Action Prior SM940":"Custom Post Upgrade Action Prior to SM940",
							"Post Upgrade Action Prior SM950":"Custom Post Upgrade Action Prior to SM950",
							"Post Upgrade Action Prior SM960":"Custom Post Upgrade Action Prior to SM960",
							"Post Upgrade Action Prior New Version":"Post Upgrade Action Prior to New Version",
							"Post Upgrade Action Auto Merge":"Custom Post Upgrade Action Auto Merge",
							"Post Upgrade Action Purge":"Custom Post Upgrade Action Purge",
							"Post Upgrade Action Update":"Custom Post Upgrade Action Update",
							"Post Upgrade Action Notification":"Custom Post Upgrade Action Notification",
							"Post Upgrade Action Restore":"Custom Post Upgrade Action Restore"						
						}
						
};




/**
*	write the phase infomation to upgrade and detail log
*	@phaseLevel {String} -  The level of the phase, 
*							the value should be: "Apply OOB Package":"Create Custom Package":"Apply Custom Package"
*	@phaseKey {String} -  The key of the phase
*	@phaseStatus {String} -  The statusof the phase,
*							the value should be: "start":"finish"
*	@logFile {String} -  The log file to write the phase info,
*							the value should be: "upgrade.log":"detail.log"
*	@logPath {String} -  The log file to write the phase info,
**/
function logPhaseInfo(phaseLevel, phaseKey, phaseStatus, logFile, logPath) 
{

	if (phaseLevel == undefined || phaseLevel == null || phaseLevel == "") 
	{
		return;
	}

	if (phaseKey == undefined || phaseKey == null || phaseKey == "") 
	{
		return;
	}
	
	if (phaseStatus == undefined || phaseStatus == null || phaseStatus == "") 
	{
		return;
	}
	
	if (logFile == undefined || logFile == null || logFile == "") 
	{
		return;
	}
	
	
	/*****
	* set the log path, when applying OOB package, the log path is kept in upgradestatus table,
	* when creating custom package, the log path should be provided
	******/
	var tmpLogPath;
	
	if (logPath == undefined || logPath == null || logPath == "") 
	{
		tmpLogPath = getLogPath();
	}
	else
	{
		tmpLogPath = logPath;
	}

	var phaseName = PHASE[phaseLevel][phaseKey];

	if (phaseName == undefined || phaseName == null || phaseName == "") 
	{
		return;
	}
	
	var logText;
	
	if (phaseStatus == "start")
	{
	
		logText = "**** Start Phase [" + phaseName + "] ****";
		
		if (logFile == "upgrade")
		{
	
			writeLog(logText, tmpLogPath + "upgrade.log");
		
		}
		else if (logFile == "detail")
		{
		
			writeLog(logText, tmpLogPath + "detail.log");
		
		}
		else
		{
		
			return;
			
		}
	
	}
	else if (phaseStatus == "finish")
	{
	
		logText = "**** Finish Phase [" + phaseName + "] ****";
	
		if (logFile == "upgrade")
		{
		
			writeLog(logText, tmpLogPath + "upgrade.log");
			writeFile(tmpLogPath + "upgrade.log", 'a', "\n");
		
		}
		else if (logFile == "detail")
		{
		
			writeLog(logText, tmpLogPath + "detail.log");
			writeFile(tmpLogPath + "detail.log", 'a', "\n");
		
		}
		else
		{
		
			return;
			
		}
	
	}
	else
	{
	
		return;
		
	}
	
}

