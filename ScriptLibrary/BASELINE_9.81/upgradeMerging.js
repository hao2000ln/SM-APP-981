var $ = lib.c.$;
var _ = lib.Underscore.require();

var unix = (funcs.version()[0] == "unix") ? true : false;
var sep = unix ? "/" : "\\";
var copy = unix ? "cp" : "copy";
var diff3 = ".." + sep + "bin" + sep + "diff3 -m --diff-program=.." + sep + "bin" + sep + "diff ";
var parent = getFolder();

function unzip() {
	showLog("Start unziping the oob xml zip. It will cost 5-10 minutes.", 1, 1);
	showLog(" ", 1, 1);
	var rc = false;
	var baseVersion = getSelectedBaseVersion();
	if (baseVersion==null) {
	    baseVersion=lib.upgradeVersionUtil.getDefaultBaseVersion(true);
	    if (baseVersion == null) {
	        showLog("Abort to unzip the oob xml zip as the base version doesn't exist.", 1, 2);
	        return;
	    }
	}
	var path = parent + "3waymerge" + sep + "oob" + sep + baseVersion + ".zip";
	try {
		if (parent != null) {	
			if (!lib.upgradeUtility.isFile(path)) {
		        showLog("Abort to unzip the oob xml zip as " + path + " doesn't exist.", 1, 2);
		        return;
		    }
			rc = uncompressFile(path);
		}
	} catch (er) {
		rc = false;
		// SM server unzip error message
		showLog(er.toString(), 1, 3);
		var failMsg = "Failed to unzip " + path + " Auto merge skipped.";
		// warning message in UI
		showLog(failMsg, 1, 2);
		// upgrade error log
		showLog(failMsg, 2, 3);
	}
	
	if (rc) {
		showLog("Finish unziping.", 1, 1);
	}
	
	return rc;
}


/**
 * Merge record
 *
 * @param {String} type
 * @param {String} query
 * @param {String} prefix
 * @param {String} baseVersion
 * @param {String} parentFolder
 * @returns {Boolean}
 */
function mergeRecord(type, query, prefix, baseVersion, parentFolder) {

	if (baseVersion == null) {
		baseVersion = getSelectedBaseVersion();
	}
	
	parentFolder = parentFolder || parent;
	
	// external
	if (mergeRecordExternal(type, query, prefix, baseVersion, parentFolder)) {
		return true;
	}
	
	// internal
	return mergeRecordInternal(type, query, prefix, baseVersion, parentFolder);
}


/**
 * Merge record using external tool
 *
 * @param {String} type
 * @param {String} query
 * @param {String} prefix
 * @param {String} baseVersion
 * @param {String} parentFolder
 * @returns {Boolean}
 */
function mergeRecordExternal(type, query, prefix, baseVersion, parentFolder){
	var tgtQuery = buildRenamedQuery(query, type, prefix);
	var oldObj = getRecord(type, query);
	var newObj = getRecord(type, tgtQuery);

	if(oldObj != null && newObj != null){
		var sig = getRecord("signaturemake", "table.name=\"" + type + "\"");
		if(sig != null){
			var filename = getFileName(oldObj, sig.key);
			var oob = parentFolder + "3waymerge" + sep + "oob" + sep + baseVersion + sep + type + sep + filename + ".xml";
			
			var baseForder = parentFolder + "3waymerge" + sep + "work" + sep + "base" + sep + type + sep;
			makeDir(baseForder);
			var base = baseForder + filename + ".xml";
			
			var localForder = parentFolder + "3waymerge" + sep + "work" + sep + "customer" + sep + type + sep;
			makeDir(localForder);
			var local = localForder + filename + ".xml";
			
			var upgradeFolder = parentFolder + "3waymerge" + sep + "work" + sep + "upgrade" + sep + type + sep;
			makeDir(upgradeFolder);
			var upgrade = upgradeFolder + filename + ".xml";
			
			var mergeFolder = parentFolder + "3waymerge" + sep + "work" + sep + "merge" + sep + type + sep;
			makeDir(mergeFolder);
			var result = mergeFolder + filename + ".xml";
			
			if (!copyFile(oob, base)) {
			    return false;
			}
			saveToXML(oldObj, local, false);
			saveToXML(newObj, upgrade, true, getExclusion(sig.table_name, sig.fields, sig.fieldarray_type), prefix);
			//skip the automerge for format record
			if(type != "format"){
				if(compare(local, base, upgrade, result)){
					var xml = readFile(result, false);
					oldObj.setRecord(xml);
					rc = oldObj.doUpdate();
					if(rc === RC_SUCCESS || rc === true){
						return true;
					}

				}
			}
		}
	}
    return false;
}

function saveToXML(file, path, tailor, exclusion, prefix){
	var text = file.getXml().toXMLString();
	text = tailoring(text, tailor, exclusion, prefix);
	return writeFile(path, false, text);
}

function compare(local, oob, upgrade, result){
	var command = diff3 + " \"" + local + "\" \"" + oob + "\" \"" + upgrade + "\" > \"" + result + "\"";
//	print(command);
	var rc = sysExec(command);
	if(rc[0] == 0 && rc[1] == 0){
		return true;
	}
	return false;
}

function tailoring(xml, tailor, exclusion, prefix){
	var regex;
	if(tailor){
		regex = new RegExp(prefix, "g");
		xml = xml.replace(regex, "");
	}else{
		exclusion = ["sysmodtime", "sysmoduser", "sysmodcount"];
	}
	
	var i;
	for(i = 0; i < exclusion.length; i++){
		var str = "<" + exclusion[i] + "\\stype(.)*?</" + exclusion[i] + ">";
		regex = new RegExp(str, "g");
		xml = xml.replace(regex, "");
	}
	xml = unix?xml.replace(/></g, ">\r\n<"):xml.replace(/></g, ">\n<");
	return xml;
}

function getExclusion(table, fields, excluded){
	if(excluded == 0){
		return fields.toArray();
	}
	var file = new SCFile("dbdict", SCFILE_READONLY);
	var rc = file.doSelect("name=\"" + table + "\"");
	var exclusions = [];
	if(rc == RC_SUCCESS){
		var i, length = file.field.length();
		for(i = 0; i < length; i++){
			if(file.field[i].level == 1 && funcs.index(file.field[i].name, fields) == 0){
				exclusions[exclusions.length] = file.field[i].name;
			}
		}
	}
	return exclusions;
}

function getFileName(file, key){
	var name = file[key[0]];
	
	var i, length = key.length();
	for(i = 1; i < length; i++){
		name+= "-" + file[key[i]];
	}
	if(typeof name == "string" && name != null){
		return name.replace(/[\s\/\?:><\"\*]/g, "_");
	}
	return name;
}

/**
 * To get the path for upgrade package
 */
function getFolder(){
	var file = getRecord("upgradestatus", "true");
	if(file != null){
		return file.path;
	}
	return null;
}	

/**
 * To get the base version selected by user for 3 way merge
 *
 */
function getSelectedBaseVersion(){
	var statusFile = getRecord("upgradestatus", "true");	
	if(statusFile != null && statusFile.automerge_baseversion != null){		
		return statusFile.automerge_baseversion;
	}else{
		return null;
	}
}

/**
 * To get whether the automerge is enabled
 *
 */
function getAutomergeEnabled(){
	var statusFile = getRecord("upgradestatus", "true");	
	if(statusFile != null && statusFile.automerge_enable != null){		
		return statusFile.automerge_enable;
	}else{
		return false;
	}
}
	

/**
 * Build the new query statement with the specified prefix.
 * The prefix will be put at the beginning of the string.
 */
function buildRenamedQuery(query, table, prefix ){
	var names = lib.upgradeHelper.getFieldNamesForRename(table);
	var target = query;
	var i;
	for(i = 0; i < names.length; i++){
		var regex = new RegExp(names[i] + "[\\s]*=[\\s]*\"");
		target = target.replace(regex, names[i] + "=\"" + prefix);
	}
	return target;
}


/**
 * Merge record internal
 *
 * @param {String} table
 * @param {String} query
 * @param {String} prefix
 * @param {String} baseVersion
 * @param {String} parentFolder
 * @returns {Boolean}
 */
function mergeRecordInternal(table, query, prefix, baseVersion, parentFolder) {
	
	// ignore ScriptLibrary and htmltemplates
	if (table == "ScriptLibrary" || table == "htmltemplates") {
		return false;
	}
	
	if (!supportFieldMerge(table)) {
		return false;
	}
	
	var tgtQuery = buildRenamedQuery(query, table, prefix);
	var oldObj = getRecord(table, query);
	var newObj = getRecord(table, tgtQuery);

	if (oldObj == null || newObj == null) {
		return false;
	}

	var xml = getOOBFileXML(table, query, baseVersion, parentFolder);
	if (xml == null || xml.length == 0) {
		return false;
	}
	
	var ancestorObj = new SCFile(table);
	setXMLRecord(ancestorObj, xml);

	// diff
	var diffResult = diffCommon(newObj, oldObj, ancestorObj, prefix);	
	var diffContent = diffResult.conflicts;

	var i, length;
	for (i = 0, length = diffContent.length(); i < length; i++) {
		var diffLine = diffContent[i]; 
		
		// field type
		var type = diffLine.type;
		
		var strTarget   = diffLine.dbvalue;
		var strSource   = diffLine.unsaved;
		var strAncestor = diffLine.origin;
	
		// keep oob update if no customization 	
		if (compareValue(strTarget, strAncestor, type, prefix, table, diffLine.field)) {
			diffContent[i].choice = 1;
		}
		// keep customization if OOB unchanged
		else if (compareValue(strSource, strAncestor, type, prefix, table, diffLine.field)) {
			diffContent[i].choice = 2;
		}
		else {
//			print("file:" + table + ",field:" + diffLine.field + " compare false.");
			return false;
		}
	}

	// merge
	var rc = mergeDiffResult(oldObj, diffResult);
	return (rc === RC_SUCCESS || rc === true);
}


/**
 * To determine whether the specified string is null, empty or not.
 */
function isEmpty(s){
	if(s == null || s == ""){
		return true;
	}
	return false;
}

/**
 * To trim the whitespace on the head and tail for the specified string
 */
function trim(s) {
	try {
		return s.replace(/^\s+|\s+$/g,"");
	} catch(e) {
		return s;
	}
}

/**
 * 
 */
function merge(result){
	var file = getRecord("upgradeobjects", "object.name = \"" + lib.upgradeCommonLib.replaceSpecialCharacter(result.upgobject_key) + "\"");
	if(file != null){
		if(!isEmpty(file.contents[0].table) && !isEmpty(file.contents[0].query)){
			if(mergeRecord(file.contents[0].table, file.contents[0].query, result.upgprefix)){
				result.result="Auto Merged";
				var rc = result.doUpdate();
        		if(rc === RC_SUCCESS || rc === true){
        			return true;
        		}
			}
		}
	}
	return false;
}

/**
 * Auto merge the result, log shows when finishing
 */
function autoMerge(result, logType){
	if ((result.result != "Renamed" && result.result != "Previously Reconciled") || result.object_type == "Application Cluster"){
		return null;
	}
	
	var msg;
	if(merge(result)){
		msg = funcs.scmsg("SUC_AUTO_MERGED", "upg", [result.object_type, result.object_name]);
		showLog(msg, logType, 1);
		return true;
	}else{
		msg = funcs.scmsg("FAIL_AUTO_MERGED", "upg", [result.object_type, result.object_name]);
		showLog(msg, logType, 1);
		return false;
	}
}

/**
 * Auto merge the results(This should be list through getting next.), logType determins what kind of message will be shown: Message view or log file.
 */
function massAutoMerge(result, logType){
	if(logType == null){
		logType = 1;
	}
	var succount = 0;
	var failcount = 0;
	var skipcount = 0;
	var rc = result.getFirst();
	while(rc === RC_SUCCESS || rc === true){
		var retValue = autoMerge(result, logType);
		if(retValue === true){
			succount++;
		}else if(retValue === false){
			failcount++;
		}else if(retValue == null){
			skipcount++;
		}
		rc = result.getNext();
	}		
	showLog(funcs.scmsg("REC_AUTO_MERGED", "upg", [succount]), logType, 1);				
	showLog(funcs.scmsg("FAIL_MASS_MERGED", "upg", [failcount]), logType, 1);		
	showLog(funcs.scmsg("MASS_REC_SKIPPED", "upg", [skipcount]), logType, 1);
	//go back to the first record to avoid client navigating to last record
	result.getFirst();			
}

/**
 * Use the query to get the record in the table <type>, and get the another record using the query with prefix in the same table.
 * The old record will be replaced with the new record which is queried by the one with prefix.
 */
function cover(type, query, prefix){
	var srcObj = new SCFile(type);
	var tgtObj = new SCFile(type);
	var tgtQuery = buildRenamedQuery(query, type, prefix);
	var srcrc = srcObj.doSelect(query);
	var tgtrc = tgtObj.doSelect(tgtQuery);

	if(srcrc == RC_SUCCESS && tgtrc == RC_SUCCESS){
		lib.upgradeHelper.removePrefixFromNumberFields(type, srcObj, tgtObj);
		var xml = tgtObj.getXml().toXMLString();
		var regex = new RegExp(prefix, "g");
		xml = xml.replace(regex, "");
		srcObj.setRecord(xml);
		var rc = srcObj.doUpdate();
		return (rc === RC_SUCCESS || rc === true);
	}
    return false;
}

/**
 * Assert result should be "renamed" or "Auto Merged" before calling this function.
 * result: record of table upgraderesults
 */
function revert(result){
	var ret = new SCDatum();
	var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 0);
	
	var file = getRecord("upgradeobjects", "object.name = \"" + lib.upgradeCommonLib.replaceSpecialCharacter(result.upgobject_key) + "\"");
	if(file != null){
		if(cover(file.contents[0].table, file.contents[0].query, lib.upgradeVersionUtil.getOldPrefix(lib.upgradeHelper.getOldVersion()))){
			result.result="Renamed";
			if (result.original_result != null) {
			    result.result = result.original_result;
			}
			result.version_reconciled = "";
			result.upgprefix = lib.upgradeConstants.NEW_PREFIX();
			var rc = result.doUpdate();
        	if(rc === RC_SUCCESS || rc === true){
        		var reconciliation = getRecord("upgreconciliation", "object.name=\"" + lib.upgradeCommonLib.replaceSpecialCharacter(result.object_name) + "\"");
        		if(reconciliation != null){
        			reconciliation.doDelete();
        		}
        		print(funcs.scmsg("SUC_REVERT", "upg", [result.object_type, result.object_name]));
        		return true;
        	}
		}
	}
	funcs.msg(funcs.scmsg("FAIL_TO_REVERT", "upg", [result.object_type, result.object_name]), 3);
	
	funcs.rtecall("trigger", ret, triggerStatus);
	
	return false;
}

function revertRAD(result) {
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();
    
    argNames.setType(8); 
    argVals.setType(8);      
    argTypes.setType(8);
    results.setType(8);
    
    argNames.push("file");
    argVals.push(result);
    argTypes.push(6);
    
    lib.RAD.run("apm.upgrade.revert.rad", argNames, argVals, argTypes, results);
    
    if (vars.$status=="success") {
        print(funcs.scmsg("SUC_REVERT", "upg", [result.object_type, result.object_name]));
        return true;
    }
    
    funcs.msg(funcs.scmsg("FAIL_TO_REVERT", "upg", [result.object_type, result.object_name]), 3);
    return false;
}

/**
 * The specified parameter <result> should be a list which can be next util it gets last.
 */
function massRevert(result){
	var succount = 0;
	var failcount = 0;
	var rc = result.getFirst();
	var list = ["Auto Merged", "Replaced"];
	var list2 = ["Replaced"];
	while(rc === RC_SUCCESS || rc === true){
		if (result.object_type=="Application Cluster" && funcs.index(result.result, list2) > 0) {
		    if(revertRAD(result)){
				succount++;
			}else{
				failcount++;
			}
		} else if(funcs.index(result.result, list) > 0){
			if(revert(result)){
				succount++;
			}else{
				failcount++;
			}
		}
		rc = result.getNext();
	}					
	print(funcs.scmsg("REC_REVERTED", "upg", [succount]));
	if(failcount > 0){
		funcs.msg(funcs.scmsg("FAIL_MASS_REVERTED", "upg", [failcount]), 3);
	}
	//go back to the first record to avoid client to navigate to last record
	result.getFirst();	
}

/**
 * This function will be called in RAD=apm.upgrade.wizard. The logs will be written into log files.
 */
function autoMergeAll(){
	if (unzip()) {
		var file = new SCFile("upgraderesults");
		var rc = file.doSelect("(result = \"Renamed\" or result=\"Previously Reconciled\") and object.type~=\"Application Cluster\" and object.type~=\"format\"");
		if(rc == RC_SUCCESS){
			massAutoMerge(file, 2);
		}
	}
}

/**
 * To get the record through the query in the specified table. Returns null if no records exists.
 */
function getRecord(table, query){
	var file = new SCFile(table);
	var rc = file.doSelect(query);
	if(rc == RC_SUCCESS){
		return file;
	}
	return null;
}

/**
 * copy source file to target
 */
function copyFile(source, target){
	var rc = sysExec( copy + " \"" + source + "\" \"" + target + "\"");
	if(rc[0] == 0 && rc[1] == 0){
		return true;
	}
	return false;
}

/**
 * Show logs on the Message view or log files. This denpends on logType.
 */
function showLog(message, logType, logLevel){
	if(logType == 1){ // log will be output to Message View
		funcs.msg(message, logLevel);
	}else if(logType == 2){ // log will be written to log file
		if(logLevel == 1){
			lib.upgradeLog.detail(message);
		}else if(logLevel == 3){
			lib.upgradeLog.error(message);
		}
	}
	
}

/**
 * Get oob file name with same SM version of tailored application
 */
function getOOBFileName(type, query, baseVersion){
	var oldObj = getRecord(type, query);

	if(oldObj != null){
		var sig = getRecord("signaturemake", "table.name=\"" + type + "\"");
		if(sig != null){
			var filename = getFileName(oldObj, sig.key);
			if (baseVersion == null) {
				baseVersion = getSelectedBaseVersion();
			}
			var oob = "oob-" + baseVersion + "-" + type + "-" + filename;

			return oob;
		}
	}

	return "";
}

/**
 * Get oob xml content with same SM version of tailored application
 *
 * @param {String} parentFolder
 */
function getOOBFileXML(type, query, baseVersion, parentFolder){
	var oldObj = getRecord(type, query);

	if(oldObj != null){
		var sig = getRecord("signaturemake", "table.name=\"" + type + "\"");
		if(sig != null){
			var filename = getFileName(oldObj, sig.key);
			if (baseVersion == null) {
				baseVersion = getSelectedBaseVersion();
			}
			
			parentFolder = parentFolder || parent;
			
			var oob = parentFolder + "3waymerge" + sep + "oob" + sep + baseVersion + sep + type + sep + filename + ".xml";
			var exist = lib.upgradeUtility.isFile(oob);
			if (!exist) {
			    return "";
			}
			
			var xml = readFile(oob, false);

			return xml;
		}
	}

	return "";
}

/**
 * Assert result should be "Renamed" or "Auto Merged" or "Previously Reconciled" or "Reconciled" before calling this function.
 * result: record of table upgraderesults
 */
function chooseUpgrade(result){
	var ret = new SCDatum();
	var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 0);
	
	var file = getRecord("upgradeobjects", "object.name = \"" + lib.upgradeCommonLib.replaceSpecialCharacter(result.upgobject_key) + "\"");
	if(file != null){
		if(cover(file.contents[0].table, file.contents[0].query, lib.upgradeConstants.NEW_PREFIX())){
			if (result.original_result == null) {
			    result.original_result = result.result;
			}
			result.result="Replaced";
			result.version_reconciled = "";
			result.upgprefix = lib.upgradeVersionUtil.getOldPrefix(lib.upgradeHelper.getOldVersion());
			var rc = result.doUpdate();
        			if(rc === RC_SUCCESS || rc === true){
        				var reconciliation = getRecord("upgreconciliation", "object.name=\"" + lib.upgradeCommonLib.replaceSpecialCharacter(result.object_name) + "\"");
        				if(reconciliation != null){
        					reconciliation.doDelete();
        				}
				print(funcs.scmsg("SUC_CHOOSE_UPGRADE", "upg", [result.object_type, result.object_name]));
        				return true;
        			}
		}
	}
	funcs.msg(funcs.scmsg("FAIL_CHOOSE_UPGRADE", "upg", [result.object_type, result.object_name]), 3);
	
	funcs.rtecall("trigger", ret, triggerStatus);
	
	return false;
}

function chooseUpgradeRAD(result) {
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();
    
    argNames.setType(8); 
    argVals.setType(8);      
    argTypes.setType(8);
    results.setType(8);
    
    argNames.push("file");
    argVals.push(result);
    argTypes.push(6);
    
    lib.RAD.run("apm.upgrade.chooseupg.rad", argNames, argVals, argTypes, results);
    
    if (vars.$status=="success") {
        print(funcs.scmsg("SUC_CHOOSE_UPGRADE", "upg", [result.object_type, result.object_name]));
        return true;
    }
    
    funcs.msg(funcs.scmsg("FAIL_CHOOSE_UPGRADE", "upg", [result.object_type, result.object_name]), 3);
    return false;
}

/**
 * The specified parameter <result> should be a list which can be next util it gets last.
 */
function massChooseUpgrade(result){
	var succount = 0;
	var failcount = 0;
	var rc = result.getFirst();
	var list = ["Renamed", "Auto Merged", "Previously Reconciled", "Reconciled", "Kept Customer Non-OOB"];
	var list2 = ["Kept Customer", "Renamed", "Kept Customer Non-OOB", "Previously Reconciled"];
	while(rc === RC_SUCCESS || rc === true){
		if (result.object_type=="Application Cluster" && funcs.index(result.result, list2) > 0) {
		    if(chooseUpgradeRAD(result)){
				succount++;
			}else{
				failcount++;
			}
		} else if(funcs.index(result.result, list) > 0){
			if(chooseUpgrade(result)){
				succount++;
			}else{
				failcount++;
			}
		}
		rc = result.getNext();
	}
	print(funcs.scmsg("REC_MASS_CHOOSE_UPGRADE", "upg", [succount]));
	if(failcount > 0){
		funcs.msg(funcs.scmsg("FAIL_MASS_CHOOSE_UPGRADE", "upg", [failcount]), 3);
	}
	//go back to the first record to avoid client to navigate to last record
	result.getFirst();	
}	
	
	
function showResult(type, name, language) {
    var result = new SCFile("upgraderesults", SCFILE_READONLY);
    var rc = result.doSelect("object.type=\""+type+"\" and object.name#\""+name+"\"");
    var count = 0;
    while (rc == RC_SUCCESS) {
        count++;
        print("Object Type: "+type+", Object Name: "+result.object_name+", Result: "+result.result);
        rc = result.getNext();
    }
    
    if (count == 0) {
        print("No match object found!");
    }
}

function resolve(action, type, name, language) {
    if (action != "revert" && action != "upgrade") {
        print("Unsupported action!");
        return;
    }
    
    var result = new SCFile("upgraderesults");
    var rc = result.doSelect("object.type=\""+type+"\" and object.name like \"*"+name+"*\"");
    
    if (rc != RC_SUCCESS) {
        print("No match object found!");
        return;
    }
    
    switch (action) {
        case "revert":
            massRevert(result);
            break;
        case "upgrade":
            massChooseUpgrade(result);
            break;
        default:
            print("Unsupported action!");
            break;
    }
}

function handleResult4PD() {
    replaceRecord4PD();
    updateResult4PD();
    setRemoveResult4PD();
}

function replaceRecord4PD() {
    var upgprefix = lib.upgradeVersionUtil.getOldPrefix();
    
    var pdpatch = new SCFile("pdpatches", SCFILE_READONLY);
    var rc = pdpatch.doSelect("filename~=\"datadict\" and action=\"replace\"");
    while (rc==RC_SUCCESS) {
        var query=lib.upgradeHelper.getTagQuery(new SCFile(pdpatch["filename"]), pdpatch["tag"]);
        var obname=lib.upgradeHelper.getObjectNameFromTag(pdpatch["filename"], pdpatch["tag"]);
        var result=lib.upgradeUtility.getRecord("upgraderesults", "object.type=\""+pdpatch["filename"]+"\" and object.name=\""+obname+"\"");
        if (result!=null) {
            if (result["result"]=="Renamed" || result["result"]=="Previously Reconciled" || result["result"] == "Kept Customer Non-OOB") {
                var ret=cover(pdpatch["filename"], query, lib.upgradeConstants.NEW_PREFIX());
                if (ret) {
                    result["original.result"] = result["result"];
                    result["result"] = "Replaced";
                    result["upgprefix"] = upgprefix;
                }
            }
            result["version.reconciled"]="PD Enable: Replaced";
            result.doUpdate();
        } else {
            print("There is no result of "+pdpatch["tag"]);
        }
        rc=pdpatch.getNext();
    }
}

function updateResult4PD() {
    var pdpatch = new SCFile("pdpatches", SCFILE_READONLY);
    var rc = pdpatch.doSelect("filename~=\"datadict\" and (action=\"add\" or action=\"update\")");
    while (rc==RC_SUCCESS) {
        var obname=lib.upgradeHelper.getObjectNameFromTag(pdpatch["filename"], pdpatch["tag"]);
        var result=lib.upgradeUtility.getRecord("upgraderesults", "object.type=\""+pdpatch["filename"]+"\" and object.name=\""+obname+"\"");
        if (result!=null) {
            result["version.reconciled"]="PD Enable: Updated";
            result.doUpdate();
        } else {
            print("There is no result of "+pdpatch["tag"]);
        }
        rc=pdpatch.getNext();
    }
}

function setRemoveResult4PD() {
    var pdpatch = new SCFile("pdpatches", SCFILE_READONLY);
    var rc = pdpatch.doSelect("filename~=\"datadict\" and action=\"remove\"");
    while (rc==RC_SUCCESS) {
        var query=lib.upgradeHelper.getTagQuery(new SCFile(pdpatch["filename"]), pdpatch["tag"]);
        var obname=lib.upgradeHelper.getObjectNameFromTag(pdpatch["filename"], pdpatch["tag"]);
        var result=lib.upgradeUtility.getRecord("upgraderesults", "object.type=\""+pdpatch["filename"]+"\" and object.name=\""+obname+"\"");
        if (result!=null) {
            result["version.reconciled"]="PD Enable: Need to be removed";
            result.doUpdate();
        } else {
            result = new SCFile("upgraderesults");
            result["object.type"] = pdpatch["filename"];
            result["object.name"] = obname;
            result["result"] = "Already Current";
            result["version.reconciled"]="PD Enable: Need to be removed";
            result["query"] = query;
            result.doInsert();
        }
        rc=pdpatch.getNext();
    }
}


/**
 * Set record by xml content
 *
 * @param {SCFile} file
 * @param {String} xmlString
 */
function setXMLRecord(file, xmlString) {
	if (xmlString == null || xmlString.length == 0) {
		return;
	}
	
	file.setRecord(xmlString);
}

/**
 * Get diff result
 * 
 * @param {SCFile} fileSource
 * @param {SCFile} fileTarget
 * @param {SCFile} fileAncestor
 * @param {String} prefix of renamed record
 * @returns {Object) record diff result
 * 
 */
function diff(fileSource, fileTarget, fileAncestor, prefix) {
	var filename = funcs.filename(fileTarget);
	
	if (filename == "ScriptLibrary") {
		return diffScriptLibrary(fileSource, fileTarget, fileAncestor, prefix);
	}
	else if (filename == "htmltemplates") {
		return diffHtmltemplates(fileSource, fileTarget, fileAncestor, prefix);
	}
	else {
		return diffCommon(fileSource, fileTarget, fileAncestor, prefix);
	}
}


/**
 * Get diff result of ScriptLibrary
 * 
 * @param {SCFile} fileSource
 * @param {SCFile} fileTarget
 * @param {SCFile} fileAncestor
 * @param {String} prefix of renamed record
 * @returns {String) record diff result
 * 
 */
function diffScriptLibrary(fileSource, fileTarget, fileAncestor, prefix) {
	var xmlDiff	= new XML("mergedata");
	var xmlSrc 	= new XML("source");
	var xmlTgt 	= new XML("target");
	
	xmlSrc.setAttributeValue("name", "name=\"" + fileSource.name + "\"");
	xmlSrc.setText(fileSource.script);	
	
	xmlTgt.setAttributeValue("name", "name=\"" + fileTarget.name + "\"");
	xmlTgt.setText(fileTarget.script);
	
	xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlSrc);
	xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlTgt);

	if (fileAncestor != null && fileAncestor.script != null)
	{
		var xmlAncestor = new XML("ancestor");	
		var baseVersion = getSelectedBaseVersion();
		var name = 'name="oob-';
		if (baseVersion) {
			name += baseVersion + '-';
		}
		name += 'ScriptLibrary-' + fileTarget.name + '"';
		xmlAncestor.setAttributeValue("name", name);
		xmlAncestor.setText(fileAncestor.script);		
		xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlAncestor);
	}
	
	return xmlDiff.toXMLString();
}


/**
 * Get diff result of htmltemplates
 * 
 * @param {SCFile} fileSource
 * @param {SCFile} fileTarget
 * @param {SCFile} fileAncestor
 * @param {String} prefix of renamed record
 * @returns {String) record diff result
 * 
 */
function diffHtmltemplates(fileSource, fileTarget, fileAncestor, prefix) {
	var xmlDiff	= new XML("mergedata");
	var xmlSrc 	= new XML("source");
	var xmlTgt 	= new XML("target");
	
	xmlSrc.setAttributeValue("name", "name=\"" + fileSource.name + "\"");
	xmlSrc.setText(fileSource.expression);	
	
	xmlTgt.setAttributeValue("name", "name=\"" + fileTarget.name + "\"");
	xmlTgt.setText(fileTarget.expression);
	
	xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlSrc);
	xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlTgt);

	if (fileAncestor != null && fileAncestor.expression != null)
	{
		var xmlAncestor = new XML("ancestor");	
		var baseVersion = getSelectedBaseVersion();		
		xmlAncestor.setAttributeValue("name", "name=\"oob-" + baseVersion + "-htmltemplates-" + fileTarget.name + "\"");
		xmlAncestor.setText(fileAncestor.expression);		
		xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlAncestor);
	}
	
	return xmlDiff.toXMLString();
}


/**
 * Get diff result
 * 
 * @param {SCFile} fileSource
 * @param {SCFile} fileTarget
 * @param {SCFile} fileAncestor
 * @param {String} prefix of renamed record
 * @returns {SCFile) RecordDiffResult
 * 
 */
function diffCommon(fileSource, fileTarget, fileAncestor, prefix) {
	// diff result
	var diffResult = new SCFile("RecordDiffResult", SCFILE_READONLY);
	
	var filename = funcs.filename(fileTarget);
	
	var dbdict = $(filename).dbdict();
	if (dbdict == null) {
		return diffResult;
	}
	
	var datadict = $("datadict", SCFILE_READONLY).setFields(["fields","captions"]).select("name=\"" + filename + "\"").uniqueResult();
	if (datadict == null) {
		return diffResult;
	}
	
	lib.upgradeHelper.removePrefixFromNumberFields(filename, fileTarget, fileSource);

	// exclude field types for compare	
	var excludeTypes = [
		lib.DataTypeConst.typeDateTime(),
		lib.DataTypeConst.typeStructure()
	];
	
	// exclude fields for compare
	var excludeFields = [
		"sysmoduser",
		"sysmodtime",
		"sysmodcount"
	];
	
	var make = $("signaturemake", SCFILE_READONLY).select("table.name=\"" + filename + "\"").uniqueResult();
	// exclude fieleds of signaturemake 
	if (make != null && make.fieldarray_type == 0) {
		excludeFields = lib.ArrayUtil.toJsArray(make.fields);
	}
	
	// append special exclude fields
	appendSpecialExcludeFields(fileSource, fileTarget, excludeFields);
	 
	var diffContent = diffResult.conflicts;
	var pos = 0;
	
	var i, length = datadict.fields.length();
	for (i = 0; i < length; i++) {
		var field = datadict.fields[i];
		
		// ignore exclucde field
		if (lib.ArrayUtil.contains(excludeFields, field)) {
			continue;
		}

		// signaturemake use include fields
		if (make != null && make.fieldarray_type == 1) {
			if (!lib.ArrayUtil.contains(make.fields, field)) {
				continue;
			}
		}
		
		// ignore exclude type
		var type = getFieldType(dbdict, field);
		if (lib.ArrayUtil.contains(excludeTypes, type)) {
			continue;
		}
		
		var valueSource   = fileSource[field];
		var valueTarget   = fileTarget[field];
		var valueAncestor = fileAncestor != null ? fileAncestor[field] : null;

		if (!compareValue(valueSource, valueTarget, type, prefix)) {
			diffContent[pos].type 	 = type;					// field type 
			diffContent[pos].caption = datadict.captions[i];	// caption
			diffContent[pos].field 	 = field; 					// field name in dbdict
			
			var strTarget   = convertToString(valueTarget, type);
			var strSource   = convertToString(valueSource, type);
			var strAncestor = convertToString(valueAncestor, type);
			
			// trim prefix
			if (prefix != null && prefix.length > 0 && strSource != null && strSource.indexOf(prefix) == 0) {
			    strSource = strSource.substr(prefix.length);
			}
			
			diffContent[pos].dbvalue = strTarget;	// target value
			diffContent[pos].unsaved = strSource; 	// source value
			diffContent[pos].origin  = strAncestor;	// ancestor value

			// choose target value by default
			diffContent[pos].choice = 2;
			
			// if target is empty but source has value, choose source 						
			if ((strTarget == null || strTarget.length == 0) && strSource != null && strSource.length > 0) {
				diffContent[pos].choice = 1;
			} 
			// if target is same as ancestor, choose source
			if (compareValue(valueTarget, valueAncestor, type)) {
				diffContent[pos].choice = 1;
			}
			
			pos++; 
		}
	}
	
	return diffResult;
}


/**
 * Append special exclude fields
 *
 * @param {SCFile} fileSource 
 * @param {SCFile} fileTarget 
 * @param {Array} excludeFields 
 */
function appendSpecialExcludeFields(fileSource, fileTarget, excludeFields) {
	var filename = funcs.filename(fileTarget);

	// globallists	
	if (filename == "globallists") {
		/*
		 * for build startup gl, ignore "value.list" and "display.list" if not user defined.
		 * no need to compare these 2 lists, because they will generate automatically 
		 */
		if (fileSource.build_startup && fileTarget.build_startup) {
			if (fileSource.use_defined != true && fileTarget.use_defined != true) {
				excludeFields.push("value.list");
				excludeFields.push("display.list");
			} 
		}
	}
}


/**
 * Get field type
 *
 * @param {String} dbdict
 * @param {String} fieldName
 * @returns {Number}
 */
function getFieldType(dbdict, fieldName) {
	var type = lib.dbdictHelper.getFieldType(dbdict, fieldName);
	
	var arrayType = lib.DataTypeConst.typeArray(); 
	if (type != arrayType) {
		return type;
	}
	
	// if type is array, the return value is like 8.2
	var fields = dbdict.field;
	var i, length = fields.length();
	for (i = 0; i < length; i++) {
		if (fields[i].name == fieldName && fields[i].type != arrayType) {
			return Number(arrayType + "." + fields[i].type);
		}
	}

    return type;	
}


/**
 * Compare values
 *
 * @param {Object} valueSource
 * @param {Object} valueTarget
 * @param {Number} fieldType
 * @param {String} prefix
 * @param {String} fileName		(optional)
 * @param {String} fieldName	(optional)
 *
 * @returns {boolean} equals or not
 */
function compareValue(valueSource, valueTarget, fieldType, prefix, fileName, fieldName) {
	if (funcs.same(valueSource, valueTarget)) {
		return true;
	}
	
	// string type
	if (fieldType == lib.DataTypeConst.typeCharacter()) {
	    if (valueSource == prefix + (valueTarget != null ? valueTarget : "")) {
		    return true;
		}
	}
	
	// number type
	if (fieldType == lib.DataTypeConst.typeNumber() && Number(valueSource) == lib.upgradeHelper.getNumberTypeFieldIncreaseValueForRename() + Number(valueTarget)) {
		return true;
	}

	// boolean type	
	if (fieldType == lib.DataTypeConst.typeBoolean()) {
		// null equals false
		if (valueSource == null) {
			return String(valueTarget) == "false";
		}	
		if (valueTarget == null) {
			return String(valueSource) == "false";
		}		
	}
		
	if (fileName != null && fieldName != null) {		
		return compareValueSpecially(fileName, fieldName, valueSource, valueTarget, fieldType);
	}
	
	return false;
}


/**
 * Compare values specially
 *
 * @param {String} fileName		(optional)
 * @param {String} fieldName	(optional)
 * @param {Object} valueSource
 * @param {Object} valueTarget
 * @param {Number} fieldType
 *
 * @returns {boolean} equals or not
 */
function compareValueSpecially(fileName, fieldName, valueSource, valueTarget, fieldType) {

	// compare array character which doesn't care about order
	if ( (fileName == "secRights" && fieldName == "folders") ||
	     (fileName == "devtype" && fieldName == "sub.type") ) {
		
		if (valueSource == null || valueTarget == null) {
			return false;
		}
	
		var folderSource = convertFromString(valueSource, fieldType);
		var folderTarget = convertFromString(valueTarget, fieldType);
		
		var diff = _.difference(_.uniq(folderSource), _.uniq(folderTarget));
		return diff.length == 0;
	}

	return false;
}


/**
 * Convert an Object to String
 *
 * @param {Object} value
 * @param {Number} type
 * @returns {String} 
 */
function convertToString(value, type) {
	if (value == null) {
		return null;
	}
	
	// array
	if (Math.floor(type) == lib.DataTypeConst.typeArray()) {
		return value.join("\n");
	}
	
	// logical expression
	if (type == lib.DataTypeConst.typeBoolean() && typeof value == "object") {
		return value.getText();
	}
	
	return String(value);
}


/**
 * Convert an Object from String
 *
 * @param {Object} value
 * @param {Number} type
 * @returns {String} 
 */
function convertFromString(value, type) {
	if (value == null) {
		return null;
	}
	
	var itype = Math.floor(type);
	
	switch (itype) {
	
		// array
		case lib.DataTypeConst.typeArray():
			var array = value.split("\n");
			
			// convert array type
			var stype = String(type);
			if (stype.indexOf('.') > 0) {
				var subtype = Number(stype.substring(2));				 
				if (subtype != lib.DataTypeConst.typeCharacter()) {
					var i;
					for (i = 0; i < array.length; i++) {
						array[i] = convertFromString(array[i], subtype);		
					}
				}
			}
			
			return array;
			
		// number
		case lib.DataTypeConst.typeNumber():
			return Number(value);
			
		// boolean, expression and variable
		case lib.DataTypeConst.typeBoolean():
		case lib.DataTypeConst.typeExpression():
		case lib.DataTypeConst.typeGlobalVariable():
		case lib.DataTypeConst.typeLocalVariable():
			return funcs.parse(value, type);
			
		default:
			return value; 	
	}
}


/**
 * Merge diff result into file
 *
 * @param {SCFile} file
 * @param {SCFile) diffResult
 * @returns {Object} result of update 
 */
function mergeDiffResult(file, diffResult) {
	if (diffResult == null) {
	    return RC_SUCCESS;
	}
	
	var filename = funcs.filename(file);
	
	// ScriptLibrary
	if (filename == "ScriptLibrary") {
		return mergeDiffResultScriptLibrary(file, diffResult);
	}
	// htmltemplates
	else if (filename == "htmltemplates") {
		return mergeDiffResultHtmltemplates(file, diffResult);
	}
	else {
		return mergeDiffResultCommon(file, diffResult);
	}
}


/**
 * Merge diff result for ScriptLibrary file
 *
 * @param {SCFile} file
 * @param {String) diffResult
 * @returns {Object} result of update 
 */
function mergeDiffResultScriptLibrary(file, diffResult) {
	var xmlString = lib.xmlHelpers.getTargetXML(diffResult);
	file.script = xmlString;
	return file.doUpdate(); 
}


/**
 * Merge diff result for htmltemplates file
 *
 * @param {SCFile} file
 * @param {String) diffResult
 * @returns {Object} result of update 
 */
function mergeDiffResultHtmltemplates(file, diffResult) {
	var xmlString = lib.xmlHelpers.getTargetXML(diffResult);
	file.expression = xmlString;
	return file.doUpdate(); 
}


/**
 * Merge diff result for common file
 *
 * @param {SCFile} file
 * @param {SCFile) diffResult
 * @returns {Object} result of update 
 */
function mergeDiffResultCommon(file, diffResult) {
	var diffContent	= diffResult.conflicts;

	var changed = false;
	
	var i, length = funcs.lng(funcs.denull(diffContent));
	for (i = 0; i < length; i++ ) {
		// ignore none field
		var caption = diffContent[i].caption;
		if (caption == null || caption.length == 0) {
			continue;
		}

		var value = diffContent[i].dbvalue;

		var choice = diffContent[i].choice;
		if (choice == 1) {
			value = diffContent[i].unsaved;
		}
		else if (choice == 3) {
			value = diffContent[i].origin;
		}
		
		var type = Number(diffContent[i].type);
		value = convertFromString(value, type);
				
		file[diffContent[i].field] = value;
		
		changed = true;
	}
	
//	print(lib.debugUtils.display(file));

	if (changed) {
		return file.doUpdate();
	}
	else {
		return RC_SUCCESS;
	}
}


/**
 * Check whether the file type supports field level merge
 *
 * @param {String} filename
 * @returns {boolean}
 */
function supportFieldMerge(filename) {
	var list = lib.upgradeConfiguration.getSupportFieldMergeFiles();
	return lib.ArrayUtil.contains(list, filename);
}
