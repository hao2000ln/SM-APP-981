/**
* @fileOverview  Provide the functionality of diff and merge records 
* @author Ryan
* @date March 2013
*/
var IGNORE_FIELDS = {
	"sysmodtime": "",
	"sysmoduser": "",
	"sysmodcount": "",
	"update.time": "",
	"update.date":"",
	"updated.by": "",
	"update.action":"",
	"page": "",
	"handle.time":""
};
					
var IGNORE_MOD_FIELDS = {
	"cm3r": {
		"date.entered": ""
	},
	"device": {
		"date.entered": "",
		"devicemodtime":""
	},
	"rootcause": {},
	"probsummary": { "prev.update.time":""},
	"incidents": {
		"update.action.ess":""	
	},
	"cm3t": {
		"id": "",
		"date.entered": ""
	},
	"ocmq": {},
	"ocml": {},
	"ocmo": {}
};

/**
* @public
* @description  Differentiate the un-saved record and db record
* @param {record} L_diff_result - RecordDiffRsult
* @param {record} L_template_current - Template current
* @param {record} L_template_modified - Template db
* @param {record} L_template_save - Template un saved
* @return {int} rc - 1=conflicts 2=no conflicts 3=system fields 
*/


function diff( $L_diff_result, $L_template_current, $L_template_modified, $L_template_save ){

	var tempInfoCurrent  = $L_template_current.templateInfo;
	var tempInfoModified = $L_template_modified.templateInfo;
	var tempInfoSave 	 = $L_template_save.templateInfo;
	var lastDiffConflicts= $L_diff_result.conflicts;
	
	var diffResult 		 = new SCFile("RecordDiffResult");
	var diffContent		 = diffResult.conflicts
	var userContent		 = diffResult.usermodified;

	var tableName 		 = $L_template_current.tablename;

	var userXbg   = vars.$userXbg;
	var bgXsave   = vars.$bgXsave;
	var userXsave = vars.$userXsave;

	var choiceCache = cacheChoice( lastDiffConflicts );

	//1:conflicts; 2:no conflict; 3:system conflict
	var rc = 2;

	var lng = system.functions.lng(system.functions.denull( tempInfoCurrent ));

	var pos = 0;
	var upos = 0;

	try{

		for( var i=0; i< lng; i++){
	
			var valueCurrent  = system.functions.str( tempInfoCurrent[i].value );
			var valueModified = system.functions.str( tempInfoModified[i].value );
			var valueSave 	  = system.functions.str( tempInfoSave[i].value);
	
			// Conflict fields
			if( (valueCurrent != valueSave) && (valueModified != valueSave) && (valueCurrent != valueModified) ){
				if(isIgnoreField(tableName, tempInfoCurrent[i].field)) {
					userXbg.push(i);
					continue;
				}

				// determine if the conflict is on system fields, if it is, then stop all the rest works.
				if(tempInfoCurrent[i].fieldUsage == "1") {
					rc = 3;
					return rc;
				}

				rc = 1;
				
				// To construct the diffContent, then show it in the conflict fields sub-format
				// Caption
				diffContent[pos].caption 	= tempInfoCurrent[i].caption;
				// Original display value
				diffContent[pos].origin     = tempInfoSave[i].display;
				// Unsaved display value
				diffContent[pos].unsaved    = tempInfoCurrent[i].display;
				// Database display value
				diffContent[pos].dbvalue 	= tempInfoModified[i].display;
				// Field type
				diffContent[pos].type 		= tempInfoCurrent[i].type;
				// Field index in template
				diffContent[pos].idx		= ""+i;
				// Choice
				diffContent[pos].choice 	= getCachedChoice( tempInfoCurrent[i].field, tempInfoModified[i].display, choiceCache );
				// Field usage type, defined in data policy
				diffContent[pos].fieldusage = tempInfoCurrent[i].fieldUsage;
				// Field name in dbdict
				diffContent[pos].field 		= tempInfoCurrent[i].field;
				// To keep the index in template
				userXbg.push(i);

				pos++;
				continue;

			}

			// User modified-only fields
			if( valueCurrent != valueSave && valueModified == valueSave ){
				if (isIgnoreField(tableName, tempInfoCurrent[i].field)){
					userXsave.push(i);
					continue;
				}

				userContent[upos].ucaption = tempInfoCurrent[i].caption;
				userContent[upos].uorigin  = tempInfoSave[i].display;
				userContent[upos].uunsaved = tempInfoCurrent[i].display;
				userContent[upos].utype	   = tempInfoCurrent[i].type;
				userContent[upos].uidx	   = ""+i;
				userContent[upos].uchoice  = "3";
				userContent[upos].ufieldusage = tempInfoCurrent[i].fieldUsage;
				userContent[upos].ufield = tempInfoCurrent[i].field;

				userXsave.push(i);
				upos++;

				continue;

			}

			// background modifeied only.
			if( valueCurrent == valueSave && valueModified != valueSave ){

				bgXsave.push(i);
				continue;

			}


		}
		
		sort(diffContent);
		sort(userContent);

		$L_diff_result.conflicts = diffContent;
		$L_diff_result.usermodified = userContent;


		return rc;
	}
	catch(e){
		print(e);
	}	

}

/**
* @private
* @description  ignore the field
* @param {String} tableName - table name
* @param {String} fieldName - field name
*  
*/

function isIgnoreField(tableName, fieldName){
	var isIgnore = false;
	
	if (fieldName in IGNORE_FIELDS){
		isIgnore = true;
	}

	if (tableName in IGNORE_MOD_FIELDS){
		if (fieldName in IGNORE_MOD_FIELDS[tableName])
			isIgnore = true;
	}
	
	return isIgnore;
}

/**
* @private
* @description  sort the field by field type
* @param {Array} content - field type
*  
*/

function sort(content){
	for (var i = 0; i < content.length-1; i++){
		for (var j = content.length-1; j > i; j--){
			if (rule(content[j-1].fieldusage, content[j].fieldusage)){
				var temp = content[j-1];
				content[j-1] = content[j];
				content[j] = temp;
			}
		}
	}
}

/**
* @private
* @description  rule for ordering
* @param {String} former - former field name
* @param {String} latter - latter field name
* @return{Boolean} isExchange 
*/

function rule(former, latter){
	//sort rule: Application(2), Data(3),System(1), Deprecated(4)
	var rules = new Array("2", "3" ,"1", "4");
	var isExchange = true;
	var reference = -1;
	for (var i=0; i < rules.length; i++){
		if (former != null && latter != null){
			if (former==rules[i] || latter==rules[i]){
				if (former==rules[i]) isExchange = false;
				break;
			}
		} else if (latter == null){
			isExchange = false;
			break;
		}
		
	}
	
	return isExchange;
}

/**
* @public
* @description  Merge the record
* @param {record} L_diff_result - RecordDiffRsult
* @param {record} L_template_current - Template current
* @param {record} L_template_modified - Template db
* @param {record} L_template_save - Template un saved
* @param {record} L_file - $L.file.db
* @param {record} L_file_current - $L.file.unsave
* @param {record} L_file_save - $L.file.save
*/

function merge( $L_template_current, $L_template_modified, $L_template_save, $L_diff_result, $L_merge_temp, $L_file, $L_file_current, $L_file_save ){

	try{
		
		var tempInfoCurrent  = $L_template_current.templateInfo;
		var tempInfoModified = $L_template_modified.templateInfo;
		var tempInfoSave 	 = $L_template_save.templateInfo;
		var diffContent		 = $L_diff_result.conflicts;
		var userContent      = $L_diff_result.usermodified;

		var tempInfo 		= $L_merge_temp.templateInfo;
		var position		= 0;
	
		var userXbg   = vars.$userXbg;
		var bgXsave   = vars.$bgXsave;
		var userXsave = vars.$userXsave;

		// Resolve the conflicts of which user chooses to merge.
		if( system.functions.lng(system.functions.denull(userXbg)) >0 ){
			for( var i = 0; i<system.functions.lng(system.functions.denull(diffContent)); i++ ){
					
					if(diffContent[i].caption == null || diffContent[i].caption == "") continue;

					var idx = diffContent[i].idx; //get the template index of conflicted field. 

					var field = diffContent[i].field;
					if(diffContent[i].choice == "2") continue; //bypass RTE unknown defect
					$L_file[field] = applyChoice( $L_file_save[field], $L_file_current[field], $L_file[field], diffContent[i].choice );	
				
					position++;
	
			}
		}
		
		// Apply the merge with user modified only fields.
		for( var j = 0; j<system.functions.lng(system.functions.denull(userContent)); j++ ){

			if(userContent[j].ucaption == null || userContent[j].ucaption == "") continue;

			var idx = userContent[j].uidx;

			var field = userContent[j].ufield;
			$L_file[field] = applyChoice( $L_file_save[field], $L_file_current[field], $L_file[field], userContent[j].uchoice );	
			
			position++;

			}

	}
	catch(e){
		print(e);
	}

}

/**
* @private
* @description  return the chosen record
* @param {String} content - field type
* @param {String} content - field type
* @param {String} content - field type
* @param {String} content - field type
* @return {Record} 
*/

function applyChoice(saveVersion, currentVersion, modifiedVersion, choice){

		switch(choice){

			case "1": return saveVersion;
			case "2": return modifiedVersion;
			case "3": return currentVersion;
			default : return currentVersion;
		}

}

/**
* @private
* @description  generate the query to the record
* @param {Record} record - record
*  
*/

function genQuery(record){

	var query = "";
	var fileName = system.functions.filename(record);
	var datadict = new SCFile("datadict");
	var recordName = system.functions.scmsg(fileName,"tablename");
	var keys = null;

	if( datadict.doSelect("name=\"" + fileName + "\"") == RC_SUCCESS ) keys = datadict.unique_key;
    else {
        print("Error: Can not open Data Policy for file " + fileName);
        return null;
    }

    query = keys[0] + "=\"" + record[keys[0]] + "\"";
    for(var i = 1, iLoopTimes = keys.length(); i < iLoopTimes; i++){

    	query = query + " and " + keys[i] + "=\"" + record[keys[i]] + "\"";
    }

    return query;

}


/**
* @Public
* @description  call RAD record.update.conflicts for auto-merge
* @param
* @return [$L.file,$L.file.save,$L.exit,$L.list] or null 
*/

function autoMerge() {

	var isGUI = (system.functions.gui() == true || system.functions.gui() == "true") ? true : false;
	var hasModified = false;
	var fileName = system.functions.filename(system.vars.$L_file);
	if (fileName == "incidents") {
		hasModified = !system.functions.iscurrent(system.vars.$L_file);
	} else {
		var modified = vars.$G_RC_MODIFIED;
		var updateStatus = system.functions.updatestatus(system.vars.$L_file);
		hasModified = (updateStatus == modified);
	}
	var mode = (vars.$L_mode)? vars.$L_mode : "";

	if (hasModified && isGUI &&  mode.indexOf("add") != 0 && exists(system.vars.$L_file)) {

		try {
			var argNames = new SCDatum();
			var argVals = new SCDatum();
			var argTypes = new SCDatum();
			var results = new SCDatum();

			argNames.setType(8);
			argVals.setType(8);
			argTypes.setType(8);
			results.setType(8);

			argNames.push("file");
			argNames.push("second.file");
			argNames.push("prompt");
			argNames.push("boolean1");
			argNames.push("second.record");
			

			argVals.push(vars.$L_file);
			argVals.push(vars.$L_file_save);
			argVals.push(vars.$L_exit);
			argVals.push("true");
			argVals.push(vars.$L_list);


			argTypes.push(6);
			argTypes.push(6);
			argTypes.push(2);
			argTypes.push(4);
			argTypes.push(6);


			results.push("file");
			results.push("second.file");
			results.push("prompt");
			results.push("second.record");

			return system.library.RAD.run("record.update.conflicts", argNames, argVals, argTypes, results);
			
			
		} catch (e) {
			print(e);
			return null;
		}
	} else return null;

}

/**
* @Public
* @description  check corresponding record against current file in memory if has been deleted from database or not
* @param record   current file in memory
* @return true or false 
*/
function exists(record)
{
	var lVoid    = new SCDatum();
    var lRtnCode = new SCDatum();
    var lRtnSql  = new SCDatum();
    var lTag     = lib.DBUtils.getTagByRecord(record);
    var lInitedFile = new SCFile(system.functions.filename(record));
    return system.functions.rtecall("tagquery", lRtnCode, lInitedFile, lRtnSql, lTag);
}

/**
* @Private
* @description QCCR1E98296 cache the last user choices in case there is second round of manual merge.
* @param record   RecordDiffResult
* @return hashmap {"field":"choice"}
*/

function cacheChoice( conflicts ){

	var lng = system.functions.lng( system.functions.denull( conflicts ) );
	var choiceCache = {};

	for(var i=0; i<lng; i++){
		
		if( conflicts[i]["field"] == null ) continue;

		var key = conflicts[i]["field"];
		var value = {};
		value["choice"]  = conflicts[i]["choice"];
		value["dbvalue"] = conflicts[i]["dbvalue"];
		choiceCache[key] = value;
	}

	return choiceCache;
}

/**
* @Private
* @description QCCR1E98296 get cached last choice
* @param record   RecordDiffResult
* @return cached choice if value unchanged; default choice if changed.
*/

function getCachedChoice( field, value, choiceCache ){

	if(choiceCache[field]){

		var cachedValue = choiceCache[field]["dbvalue"];
		if(value == cachedValue) return choiceCache[field]["choice"];
		else return "3";
	}
	else return "3";
}
