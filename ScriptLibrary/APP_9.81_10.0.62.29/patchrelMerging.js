var $ = lib.c.$;


/**
 * This function will be called in RAD=sm.patchrel.wizard. The logs will be written into log files.
 */
function autoMergeAll() {

	if (!unzip()) {
		return;
	}

	var result = new SCFile("patchrelresults");
	var rc = result.doSelect('(result="Renamed" or result="Previously Reconciled" or result="Replaced") and object.type~="Application Cluster" and object.type~="format"');
	if(rc == RC_SUCCESS){
		massAutoMerge(result);
	}
}


/**
 * Unzip oob xml zip
 *
 * @returns	{Boolean}	true if unzip successfully
 */
function unzip() {

	lib.patchrelHelper.debug("Start unziping the oob xml zip.");

	var folder = getFolder();
	if (folder == null || folder.length == 0) {
		lib.patchrelHelper.error("Abort to unzip the oob xml zip as path is empty.");
		return false;
	}
	
	var sep = lib.upgradeUtility.getPathSeperator();
	var path = folder + "3waymerge" + sep + "oob" + sep + lib.patchrelHelper.getBaseAppVersionShort() + ".zip";

	if (!lib.upgradeUtility.isFile(path)) {
        lib.patchrelHelper.error("Abort to unzip the oob xml zip as " + path + " doesn't exist.");
        return false;
    }

	var rc = false;

	try {
		rc = uncompressFile(path);
	}
	catch (ex) {
		rc = false;
		
		// SM server unzip error message
		lib.patchrelHelper.error(ex.toString());
		var msg = "Failed to unzip " + path + ", auto merge skipped.";
		lib.patchrelHelper.error(msg);
	}
	
	if (rc) {
		lib.patchrelHelper.debug("Finish unziping.");
	}
	
	return rc;
}


/**
 * Get patch folder
 *
 * @returns	{String} 	folder path
 */
function getFolder() {
	var status = $("patchrelstatus", SCFILE_READONLY).select("true").uniqueResult();
	if (status == null) {
		return null;
	}
	
	return status.path;
}


/**
 * Auto merge the results(This should be list through getting next.
 *
 * @param	{SCFile}	patchrelresult record
 */
function massAutoMerge(result){

	var succount = 0;
	var failcount = 0;
	var skipcount = 0;

	var rc = result.getFirst();
	while(rc === RC_SUCCESS || rc === true) {
		
		var retValue = autoMerge(result);
		if(retValue === true) {
			succount++;
		}
		else if(retValue === false) {
			failcount++;
		}
		else if(retValue == null) {
			skipcount++;
		}
		
		rc = result.getNext();
	}
	
	lib.patchrelHelper.debug(funcs.scmsg("REC_AUTO_MERGED",  "upg", [succount]));				
	lib.patchrelHelper.debug(funcs.scmsg("FAIL_MASS_MERGED", "upg", [failcount]));		
	lib.patchrelHelper.debug(funcs.scmsg("MASS_REC_SKIPPED", "upg", [skipcount]));
	
	//go back to the first record to avoid client navigating to last record
	result.getFirst();			
}


/**
 * Auto merge the result
 *
 * @param		{SCFile}	patchrelresult record
 * @returns	{Boolean}	true:succeed, false:fail, null:skip 
 */
function autoMerge(result){
	
	if (result.result != "Renamed" && result.result != "Previously Reconciled" && result.result != "Replaced") {
		return null;
	}
	
	var objType = result.object_type;
	if (objType == "Application Cluster" || objType == "format") {
		return null;
	}
	
	if (merge(result)) {
		lib.patchrelHelper.debug(funcs.scmsg("SUC_AUTO_MERGED", "upg", [objType, result.object_name]));
		return true;
	}
	else {
		lib.patchrelHelper.debug(funcs.scmsg("FAIL_AUTO_MERGED", "upg", [objType, result.object_name]));
		return false;
	}
}


/**
 * Merge the result
 *
 * @param		{SCFile}	patchrelresult record
 * @returns	{Boolean}	true:succeed, false:fail 
 */
function merge(result) {

	var query = 'object.name="' + lib.upgradeCommonLib.replaceSpecialCharacter(result.object_key) + '"';
	var pobj = $("patchrelobjects", SCFILE_READONLY).select(query).uniqueResult();
	if (pobj == null) {
		lib.patchrelHelper.debug('patchrelobjects record "' + query + '" not found.');
		return false;
	}
	
	var content = pobj.contents[0];
	if (!lib.upgradeMerging.isEmpty(content.table) && !lib.upgradeMerging.isEmpty(content.query)) {
		var mergeResult = lib.upgradeMerging.mergeRecord(content.table, content.query, result.prefix, lib.patchrelHelper.getBaseAppVersionShort(), getFolder()); 
		if (mergeResult) {
			result.result="Auto Merged";
			var rc = result.doUpdate();
    		if (rc === RC_SUCCESS || rc === true) {
    			return true;
    		}
		}
	}
	
	return false;
}
