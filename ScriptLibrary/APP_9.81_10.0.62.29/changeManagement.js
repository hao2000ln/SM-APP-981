var $ = lib.c.$;

function updateRelatedErrors( record )
{
	var changeID = record.number;
	var rc;
	var relation = new SCFile("screlation", SCFILE_READONLY);
	relation.setFields(["depend"]);
	
	vars.$L_mode = "save";
	
	if ( relation.doSelect( "source=\"" + changeID + "\" and " +
	                      "source.filename=\"cm3r\" and "+
	                      "depend.filename=\"knownerror\" and "+
	                      "depend.active = true" ) == RC_SUCCESS )
	{
		var errorID = relation.depend;
		if (lib.problemManagement.checkOpenChanges( errorID ) == false )
		{
			var errorRec = new SCFile("knownerror");
			if ( errorRec.doSelect("id=\"" + errorID + "\"" ) == RC_SUCCESS )
			{   
			    do
			    {
			    	var phase = new SCFile("knownerrorphase", SCFILE_READONLY);
			    	if (phase.doSelect("name=\"" + errorRec.current_phase +"\"") == RC_SUCCESS )
			    	{
			    		if ( phase.phasechg_rfc_close == true )
			    		{
			    			var nextPhase = lib.problemManagement.getNextPhase( errorRec.current_phase ,
			    												errorRec.category, "knownerrorcat");
			    			if ( nextPhase == errorRec.current_phase )
			    			{
			    				rc = errorRec.doAction("closeme");			    					
			    			}
			    			else
			    			{
			    				errorRec.resolution=funcs.denull(errorRec.resolution);
			    				if ( funcs.lng(errorRec.resolution) == 0 )
			    				{
			    					var msg = funcs.scmsg(162, "ScriptLibrary");
			    					errorRec.resolution.push(msg);
			    				}
								rc = errorRec.doAction("nextphase");	
							}
								
							if (rc == RC_CANT_HAVE || rc == 51 ) {
			    				lib.interoperabilityHelpers.rescheduleAction( record, "PM.rfc.check" );
			    			}
						}
					}
				}
				while (errorRec.getNext() == RC_SUCCESS);
			}
		}
	}
}

//this function returns current phase sequence number
function getCurrentChangePhaseSeq(fileName, categoryName,phaseName)
{
	//get category
	var category = new SCFile(fileName, SCFILE_READONLY);
    category.setFields(["phases"]);
	var queryStr = "name=\""+categoryName+"\"";
	var returnCode = category.doSelect(queryStr);
	var phaseList = category.phases;
	var i=0;
	for ( i in phaseList ) 
	{
		if(phaseList[i] != null && phaseList[i] == phaseName)
		{
			return eval(i)+2;
		}
	}
	//if no match, default to 1st phase
	return 1;
}


//get next phase name, based on current phase
function getNextPhaseName(fileName, categoryName, phaseName)
{
	var category = new SCFile(fileName, SCFILE_READONLY);
	category.setFields(["phases"]);
	var queryStr = "name=\""+categoryName+"\"";
	var returnCode = category.doSelect(queryStr);
	var phaseList = category.phases;
	var i=0;
	for ( i in phaseList ) 
	{
		if(phaseList[i] != null && phaseList[i] == phaseName)
		{
			return phaseList[i+1];
		}
	}
	//if no match, default to 1st phase
	return phaseList[0];
}

//find changes that are currently in verification phase
//whose device id is same as the one passed in
function checkChangesForVerification()
{
	var deviceId = vars.$L_file.logical_name;
	var cm3rSql="logical.name=\""+deviceId+"\" and current.phase=\"Verification\"";
	var changes = new SCFile("cm3r");
	var rc = changes.doSelect(cm3rSql);

	if (rc == RC_SUCCESS)
	{
		do
		{
			var verify = verifyChange(changes);
			rc = changes.getNext();
		}while (rc == RC_SUCCESS);
	}
}

function verifyChange(aChange)
{
	var expectedFieldNames = aChange.expected_state_field_names;
	var expectedFieldValues = aChange.expected_state_field_values;
	var verified = "passed";
	var i;
	var length = expectedFieldNames.length(); 
	for (i=0;i<length;++i)
	{
		var reg = /\./g;
		var actualValue = vars.$L_file[expectedFieldNames[i]].replace( reg, "_" );
		if (actualValue ==  null || expectedFieldValues[i] != actualValue)
		{
			verified = "failed";
			break;
		}
	}	
	updateChangeVerifyStatus(aChange,verified);		
} 

function updateChangeVerifyStatus(aChange,verified)
{
	aChange.verification = verified;
	var rc = aChange.doUpdate(); 
}

function retrieveState(changeId, ciList )
{
	var ddmEvent = new SCFile("dataModEvent", SCFILE_READONLY);
	
	// split to multiple arrays to avoid performance issue in case there is large number of ci list
	var subCiList = lib.ArrayUtil.split(ciList.toArray(), 1000);
	
	var fieldNameArray = [];
	var fieldValueArray = [];
	var fieldDisplayArray = [];	
	var dmeModeArray = [];
	var fieldIspasswordArray = [];
	
	var obj = {};
	var modeObj = {};
	var obj_ispassword = {};
	var ciLengthObj = {};
	
	var ddmSql="";
	
	var structObj = {};
	var fieldStructObj = [];
	var struct;
	
	var i;
	var j;
	for (i = 0; i < subCiList.length; i++)
	{
		ddmSql = "linkedRecordId=\""+changeId+"\" and recordId isin {";
		
		var sub = subCiList[i];
		
		for (j = 0; j < sub.length; j++)
		{
			if (j > 0) {
			    ddmSql += ",";
			}
			ddmSql += "\"" + sub[j] + "\"";					
		}
		ddmSql += "} and status=\"proposed\"";
				
		var rc = ddmEvent.doSelect(ddmSql);
	
		var hasState = false;
		if (rc == RC_SUCCESS)
		{
			hasState = true;
			do
			{
				var newValue = ddmEvent.newValue;
				var fieldtype = lib.tableFunctions.getFieldType(ddmEvent.fieldName,ddmEvent.tableName);
				
				if(fieldtype==3){
					newValue = funcs.str(lib.dmeTimeConvert.formatFromISODate(newValue)) ;
				}
				
				struct = lib.expectedStateHelper.getStructName(ddmEvent.tableName, ddmEvent.fieldName);
				if (struct != null) {
				    if (!lib.ArrayUtil.contains(fieldStructObj, ddmEvent.fieldName)) {
				        fieldStructObj.push(ddmEvent.fieldName);
				    }
				    
				    if (structObj[struct] == null) {
				        structObj[struct] = {};
				        structObj[struct][ddmEvent.fieldName] = 0;
				    } else if (structObj[struct][ddmEvent.fieldName] == null) {
				        structObj[struct][ddmEvent.fieldName] = 0;
				    }
				}
				
				//if different values are planned for common field for multiple CIs , this field will not be loaded. 
				if(obj[ddmEvent.fieldName]!=null && (obj[ddmEvent.fieldName]["value"] != newValue || modeObj[ddmEvent.fieldName] != ddmEvent.mode)){
				    rc = ddmEvent.getNext();
					continue;		
				 }
				
				var displayValue = lib.ddmEventHelper.formatValue(ddmEvent.tableName, ddmEvent.fieldName, newValue);
				obj[ddmEvent.fieldName] = {value: newValue, display: displayValue};
				
				modeObj[ddmEvent.fieldName] = ddmEvent.mode;
				obj_ispassword[ddmEvent.fieldName] = ddmEvent.is_password == null ? false : ddmEvent.is_password;
				
				if (struct != null) {
				    structObj[struct][ddmEvent.fieldName] += 1;
				}
				
				if(ciLengthObj[ddmEvent.fieldName] ==null){
					ciLengthObj[ddmEvent.fieldName] = 1;
				}else{
					 
				    ciLengthObj[ddmEvent.fieldName] = ciLengthObj[ddmEvent.fieldName] + 1;	
				}			
				 
				rc = ddmEvent.getNext();
				
			}while (rc == RC_SUCCESS);
		}
	}

	for (i in obj) {
		fieldNameArray.push(i);
		fieldValueArray.push(obj[i].value);
		fieldDisplayArray.push(''+obj[i].display);
		dmeModeArray.push(modeObj[i]);
		fieldIspasswordArray.push(obj_ispassword[i]);
	}
	
	var commonFieldNameList = lib.GetFieldNames.getAllFieldsForExpState(vars.$this_filename)[0].toArray(); 
	
	for (i = 0 ; i <fieldNameArray.length; i++ ){
		 if(lib.ArrayUtil.contains(commonFieldNameList,fieldNameArray[i]) && !lib.ArrayUtil.contains(fieldStructObj, fieldNameArray[i]) && ciLengthObj[fieldNameArray[i]]>=ciList.length()){
     	 	vars.$field_name=funcs.insert(vars.$field_name,1,1,fieldNameArray[i]);
	 	 	vars.$field_value=funcs.insert(vars.$field_value,1,1,fieldValueArray[i]);
	 	 	vars.$field_value_display=funcs.insert(vars.$field_value_display,1,1,fieldDisplayArray[i]);
	 	 	vars.$dme_mode=funcs.insert(vars.$dme_mode,1,1,dmeModeArray[i]);
	 	 	vars.$field_ispassword=funcs.insert(vars.$field_ispassword,1,1,fieldIspasswordArray[i]);
	 	 }
	}
	
	for (struct in structObj) {
	    var sameFields = false;
	    var field;
	    for (field in structObj[struct]) {
	        if (structObj[struct][field] < ciList.length()) {
	            break;
	        }
	        sameFields = true;
	    }
	    
	    if (!sameFields) {
	        continue;
	    }
	    
	    for (field in structObj[struct]) {
	        var index = lib.ArrayUtil.indexOf(fieldNameArray, field);
	        if (index >= 0) {
	            vars.$field_name=funcs.insert(vars.$field_name,1,1,fieldNameArray[index]);
	 	 	    vars.$field_value=funcs.insert(vars.$field_value,1,1,fieldValueArray[index]);
	 	 	    vars.$field_value_display=funcs.insert(vars.$field_value_display,1,1,fieldDisplayArray[index]);
	 	 	    vars.$dme_mode=funcs.insert(vars.$dme_mode,1,1,dmeModeArray[index]);
	 	 	    vars.$field_ispassword=funcs.insert(vars.$field_ispassword,1,1,fieldIspasswordArray[index]);
	        }
	    }
	}
			
	return hasState;	
}

function getCloseLabel(filename, currentPhase, file)
{
	var catName = "cm3rcategory";
	if(filename == "cm3t") {
		catName = "cm3tcategory";
	}
	var categoryFile = new SCFile(catName, SCFILE_READONLY);
	categoryFile.setFields(["phases"]);
	var rc = categoryFile.doSelect("name =  \"" + vars.$L_file.category.toString() + "\"");
	
	var isLastPhase = false;
	var fLastPhase = categoryFile.phases.pop();		
	if (fLastPhase != null && currentPhase == fLastPhase.toString()) {
		isLastPhase = true;
	}
		
	var msgClosePhase =getEngCloseLabel(852,"cm3","Close Phase;")+ getBalloonHelp(852, "cm3");
	var msgCloseTask = getEngCloseLabel(851,"cm3","Close Task;")+ getBalloonHelp(851, "cm3");
	var msgCloseChange =getEngCloseLabel(850,"cm3","Close Change;")+getBalloonHelp(850, "cm3");
	var closeLabel;
	
	if(isLastPhase)
	{
		if (filename == "cm3r") {
			closeLabel=msgCloseChange;
		}
		else {
		    closeLabel=msgCloseTask;
		}
	}
	else {
	    closeLabel = msgClosePhase;
	}
	
	//special case for Unplanned Change, phase Discovery Assessment
	if (currentPhase == "Discovery Assessment" && filename=="cm3r")
	{
		if (file!= null && file.approval_status!=null &&  file.approval_status== "approved") {
			closeLabel=msgCloseChange;
		}
		else {
		    closeLabel=msgClosePhase;
		}	
	}
	return 	closeLabel;	 
}

function getBalloonHelp(messageNumb,messageClass)
{
	var ret="";
	var tempstr=funcs.scmsg( messageNumb, messageClass);
	if(tempstr.indexOf(";")>=0)
	{
		ret= tempstr.split(";")[1];
	}
	return ret;
}

function getEngCloseLabel(messageNumb,messageClass,defaultvalue)
{
	var ret="";
	var messFile = new SCFile("scmessage", SCFILE_READONLY);
	var rc = messFile.doSelect("class=\"" + messageClass + "\" and message.id=" + messageNumb + " and syslanguage=\"en\"");
	if (rc == RC_SUCCESS)
	{
		var tmpstr = messFile.message;
		if(tmpstr.indexOf(";")>0)
		{
			ret = tmpstr.split(";")[0]+";";
		}
		else
		{
			ret = tmpstr;
		}
	}
	else
	{
		ret=defaultvalue;
	}
	return ret;
}

function checkTaskAvailChangePhase(taskCategory,changeNumber){
	var rtv=false;
	var availPhases=taskCategory['request.phases'];
	if(null===availPhases || funcs._null(availPhases) ||funcs._null(changeNumber)){
		rtv=true;
	}
	else{
		var chg=new SCFile("cm3r", SCFILE_READONLY);
		chg.setFields(["current.phase"]);
		var sql="number=\""+changeNumber+"\"";
		if (chg.doSelect(sql)== RC_SUCCESS){
			var currentPhase=chg['current.phase'];
			var i;
			var length = availPhases.length(); 
			for(i=0;i<length;i++){
				if(currentPhase===availPhases[i]){
					rtv=true;
					break;
				}
			}
		}
		
	}
	return rtv;
}

function verifyChangeCategory(change)
{
    if (change.category == null)
    {
        return false;
    }

    var category = new SCFile("cm3rcategory");
	//add for QCCR1E112452, Cannot open new Change Task via SOAP request
	if ( funcs.filename(  change) ==  "cm3t"  ) {
		category = new SCFile ("cm3tcategory" );
	}
    var rc = category.doSelect("name=\""+change.category+"\"");
    
    if (rc == RC_SUCCESS)
    {
        // add for QCDefect 99137 to check task's Available change phase
		if ( funcs.filename( change) ==  "cm3t"  ) {
			if(!checkTaskAvailChangePhase(category,change['parent.change'])){
				return false;
			}
		}
		
        if (funcs.index("SysAdmin", vars.$lo_ucapex)>0 || funcs.index("ChMAdmin", vars.$lo_ucapex)>0 || funcs.evaluate(funcs.nullsub(category.avail_cond, false)))
        {
            return true;
        }
    }
    
    return false;
}

function createRecord()
{
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var argTypes = new SCDatum();
	var results = new SCDatum();
	
	if (!verifyChangeCategory(vars.$L_file))
	{
		vars.$L_exit="normal";
		if(funcs.filename(vars.$L_file)==="cm3t"){
			funcs.msg(funcs.scmsg(1002, "cm3"));
		}
		else{
			funcs.msg(funcs.scmsg(1001, "cm3"));
		}
	    return;
	}

	argNames.setType(8); 
	argVals.setType(8);      
	argTypes.setType(8);
	results.setType(8);
 
	argNames.push("file");     
	argNames.push("name");     
	argNames.push("boolean1");  
	argNames.push("names");
	argNames.push("values");

	argVals.push(vars.$L_file);
	
	if(lib.ProcessDesignerEnablement.isChangeEnabled() == true ){
		argVals.push("cm.open");
	}else {
	    argVals.push("cm.open.classic");
	}
	
	argVals.push("true");
	argVals.push("{$L.exit}");
	argVals.push("{}");

	argTypes.push(6);
	argTypes.push(2);
	argTypes.push(4);
	argTypes.push(8);
	argTypes.push(8);

	results.push("values");

	var radResults = lib.RAD.run( "se.call.process", argNames, argVals, argTypes, results );
	vars.$L_exit = radResults.results[0].pop();

	if ( vars.$L_exit == "bg" ) {
		vars.$L_exit="normal";
	}
}

/**
 * check if current phase is the last phase
 */
function isInLastPhase(change)
{
	var filename = funcs.filename(change);

	if (filename == "cm3r" && change.category == "Unplanned Change" && change.current_phase == "Discovery Assessment" && change.approval_status == "approved") {
		return true;
	}
				
	var category = null;
	if (filename == "cm3r") {
		category = new SCFile("cm3rcategory", SCFILE_READONLY);
        category.setFields(["phases"]);
	}
	else if (filename == "cm3t") {
		category = new SCFile("cm3tcategory", SCFILE_READONLY);
		category.setFields(["phases"]);
	}
		
	var sql = "name = \"" + change.category + "\"";	
	var rc = category.doSelect(sql);
	
	if (rc != RC_SUCCESS) {
		return false;
	}
		
	var phases = category.phases;
	if (phases == null || phases.length()==0) {
		return true;
	}
		
	return (phases[phases.length()-1] == change.current_phase);
}

/**
 * check if current phase is the last phase in workflow
 */
function isInLastWfPhase(change)
{
	 var category="";
	 var workflow="";
	 var nextPhase="";	 	
	 var catRec = new SCFile("cm3rcategory", SCFILE_READONLY);
	 catRec.setFields(["workflow"]);		
	 catRec.doSelect("name=\""+change.category+"\"");
 	 workflow=catRec.workflow;
	 var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
	 wfPhase.setFields(["manualTransition"]);
	 wfPhase.doSelect("workflowName=\""+workflow+"\" and tableName=\"cm3r\" and phaseName=\""+change.current_phase+"\"");
	 var len=funcs.lng(funcs.denull(wfPhase.manualTransition));
	 if(len>0){
	 	return false;
	 }
	 
	 return true;
}

/**
 * check if given change is closed
 */
function isChangeClosed(changeNum)
{
	var change = new SCFile("cm3r", SCFILE_READONLY);
	change.setFields(["status","open"]);
	var sql = "number = \"" + changeNum + "\"";
	var rc = change.doSelect(sql);
	if (rc != RC_SUCCESS) {
		return false;
	}
	else {
		/* Closed Change: status=="closed", open==false */
		return change.status=="closed" && !change.open;
	}
}

/**
 * check if current change phase matches the task category
 */
function isPhaseMatched(changeNum, taskCategory)
{
	var change = new SCFile("cm3r", SCFILE_READONLY);
	change.setFields("current_phase");
	var sql = "number = \"" + changeNum + "\"";
	var rc = change.doSelect(sql);
	if (rc != RC_SUCCESS) {
		return false;
	}
	var changePhase = change.current_phase;
	
	var taskCat = new SCFile("cm3tcategory", SCFILE_READONLY);
	taskCat.setFields("request_phases");
	sql = "name = \"" + taskCategory + "\"";
	rc = taskCat.doSelect(sql);
	if (rc != RC_SUCCESS) {
		return false;
	}
		
	var phases = taskCat.request_phases;
	var i;
	var length = phases.length();
	for (i = 0; i < length; ++i) {
		if (changePhase == phases[i]) {
			return true;
		}
	}
	return false;
}


/**
 * Return the phase record for the passed phase name
 */
function getPhaseRecord( name, type )
{
	if ( type != "cm3t" ) {
		type = "cm3r";
	}
	var filename = type+"catphase";
	
	var phase = new SCFile( filename );
	var sql = "name=\""+name+"\"";
	var rc = phase.doSelect( sql );
	
	return phase;
}	


/*******************************************************************************************************************************************
 * function closeChange(): This function would close a change if there is a transition available from a particular phase to Closure/Closed phase.
 * If there is a transition available to Abandoned phase and not Closure phase, then the change would be moved to Abandoned phase. 
 * If a change phase has a transition to both Abandoned phase as well as Closure phase, then the transition to Closure phase would be taken.
 *******************************************************************************************************************************************/
function closeChange() {
    if (vars.$L_file != null) {
        var action;

        var catRec = new SCFile("cm3rcategory", SCFILE_READONLY);
        catRec.setFields(["workflow"]);
        catRec.doSelect("name=\"" + vars.$L_file.category + "\"");

        var workflow = catRec.workflow;

        var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
        wfPhase.setFields(["manualTransition"]);
        wfPhase.doSelect("workflowName=\"" + workflow + "\" and tableName=\"cm3r\" and phaseName=\"" + vars.$L_file.current_phase + "\"");

        var i;
        var length = wfPhase.manualTransition.length();
        for (i = 0; i < length; i++) {
            var transition = wfPhase.manualTransition[i];
            var toPhase = transition.mtToPhase;
            if (toPhase) {
                toPhase = toPhase.toUpperCase();
                if (toPhase == "ABANDONED") {
                    action = transition.mtOptionName;
                }
                if (toPhase == "CLOSURE" || toPhase == "CLOSED") {
                    action = transition.mtOptionName;
                    break;
                }
            }
        }

        if (action == null && lib.ProcessDesignerEnablement.isMigratedWorkflowUsed("cm3r", vars['$L.file']['category'])) {
            //for migrated workflow, we still support the close DO to close change.
            action = "close";
        }

        if (action) {
            /*
             * QCCR75860:
             *   Get unreasonable SOAP response in API 'CloseChange' webservice
             * QCCR75495: 
             *   In web service,when 'closeChange',the response's status will return 'success' even if there're error mesaage in the reponse and not really close it
             */
            var file = new SCFile();
            funcs.fduplicate(file, vars.$L_file);
            var fields;

            switch (file.doAction(action)) {

                case RC_VALIDATION_FAILED:
                case 71:
                    vars.$L_exit = "badval";
                    break;

                case RC_MODIFIED:
                case 51:
                    vars.$L_exit = "changed";
                    break;

                case RC_CANT_HAVE:
                case 3:
                    vars.$L_exit = "locked";
                    break;

                case RC_ERROR:
                    vars.$L_exit = "error";
                    break;

                default:
                    // copy the state back into $L.file
                    fields = lib.FileUtil._field(funcs.filename(vars.$L_file)).getFirstLevelFieldNames();
                    funcs.recordcopy(file, fields, vars.$L_file, fields);
                    vars.$L_exit = "normal";
            }
        }
        // invalid action 
        else {
            vars.$L_exit = lib.BaseUtil.getExitWithReturnCode(70);
        }

    }

}


/*******************************************************************************************************************************************
function nextChangePhase(): This function would move a change to next available phase. The exceptions are Abandoned, Backout and Closure/Closed 
phases.
*******************************************************************************************************************************************/
function nextChangePhase() {
	var returnCode = 0;
	if (vars.$L_file != null) {
		var category = "";
		var workflow = "";
		var nextPhase = "";
		var catRec = new SCFile("cm3rcategory", SCFILE_READONLY);
        catRec.setFields(["workflow"]);
		catRec.doSelect("name=\"" + vars.$L_file.category + "\"");
		workflow = catRec.workflow;
		var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
		wfPhase.setFields(["manualTransition"]);
		wfPhase.doSelect("workflowName=\"" + workflow + "\" and tableName=\"cm3r\" and phaseName=\"" + vars.$L_file.current_phase + "\"");
		var i;
		var length = wfPhase.manualTransition.length();
		for (i = 0; i < length; i++) {
			if (wfPhase.manualTransition[i].mtToPhase != null && wfPhase.manualTransition[i].mtToPhase != "") {
				if (wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "ABANDONED" && wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "BACKOUT" && wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "CLOSURE" && wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "CLOSED") {
					vars.$L_file.doAction(wfPhase.manualTransition[i].mtOptionName);
					returnCode = getLastRC();
					break;
				}
			}
		}
	}
	if (returnCode == 3) {
		vars.$L_exit = "locked";
	} else if (returnCode == 71) {
		vars.$L_exit = "badval";
	} else if (returnCode == 9) {
		vars.$L_exit = "no.record";
	} else {
		vars.$L_exit = "normal";
	}
}	


/*******************************************************************************************************************************************
 * function closeTask(): This function would close a task if there is a transition available from a particular phase to Closed phase. 
 * If there is a transition available to Cancelled phase and not Closed phase, then the task would be moved to Cancelled phase. If a task
 * phase has a transition to both Cancelled phase as well as Closed phase, then the transition to Closed phase would be taken.
 *******************************************************************************************************************************************/
function closeTask() {
    var retCode;

    if (vars.$L_file != null) {
        var action;

        var catRec = new SCFile("cm3tcategory", SCFILE_READONLY);
        catRec.setFields(["workflow"]);
        catRec.doSelect("name=\"" + vars.$L_file.category + "\"");

        var workflow = catRec.workflow;

        var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
        wfPhase.setFields(["manualTransition"]);
        wfPhase.doSelect("workflowName=\"" + workflow + "\" and tableName=\"cm3t\" and phaseName=\"" + vars.$L_file.current_phase + "\"");

        var i;
        var length = wfPhase.manualTransition.length();
        for (i = 0; i < length; i++) {
            var transition = wfPhase.manualTransition[i];
            var toPhase = transition.mtToPhase;
            if (toPhase) {
                toPhase = toPhase.toUpperCase();
                if (toPhase == "CANCELLED") {
                    action = transition.mtOptionName;
                }
                if (toPhase == "CLOSED" || toPhase == "CLOSURE") {
                    action = transition.mtOptionName;
                    break;
                }
            }
        }

        if (action == null && lib.ProcessDesignerEnablement.isMigratedWorkflowUsed("cm3t", vars['$L.file']['category'])) {
            // for migrated workflow, we still support the close DO to close change task.
            action = "close";
        }

        if (action) {
            // get real return code with RTE function getLastRC;
            var rs = vars.$L_file.doAction(action);
            retCode = getLastRC();
        }
        // invalid action 
        else {
            retCode = 70;
        }
    }

    // return the exact exit instead of "Normal" here.
    vars.$L_exit = lib.BaseUtil.getExitWithReturnCode(retCode);
}


/*******************************************************************************************************************************************
function nextTaskPhase(): This function would move a task to next available phase. The exceptions are Cancelled and Closed phases.
*******************************************************************************************************************************************/
function nextTaskPhase()
{
	if (vars.$L_file!=null)
	{	     
		 var category="";
		 var workflow="";
	 	 var nextPhase="";
	 	 	
	 	 var catRec = new SCFile("cm3tcategory", SCFILE_READONLY);
	 	 catRec.setFields(["workflow"]);
	 	 catRec.doSelect("name=\""+vars.$L_file.category+"\"");
	 
	 	 workflow=catRec.workflow;
	 	  	
		 var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
		 wfPhase.setFields(["manualTransition"]);
		 wfPhase.doSelect("workflowName=\""+workflow+"\" and tableName=\"cm3t\" and phaseName=\""+vars.$L_file.current_phase+"\"");
	     
	     var i;
	     var length = wfPhase.manualTransition.length(); 
		 for(i=0;i<length;i++)
		 {
		 	if(wfPhase.manualTransition[i].mtToPhase!=null && wfPhase.manualTransition[i].mtToPhase!="")
		 	{
		  		if(wfPhase.manualTransition[i].mtToPhase.toUpperCase()!="CANCELLED" && wfPhase.manualTransition[i].mtToPhase.toUpperCase()!="CLOSED")
		 		{
		 		    vars.$L_file.doAction(wfPhase.manualTransition[i].mtOptionName);
		  			break;
		 		}  		 
		 	}
		 }
		 
	}	 	

	vars.$L_exit="normal";
}


/**
 * This function is used to transform legacy OOB view format to new OOB PD view format.
 * @param  {String} format The format name
 * @return {String}        format name
 */
function transDispFmt(format){
	return (format === "sc.manage.cmr" || format === "sc.manage.cmr.g")?"sc.manage.chm":format;
}

/**
 * This function is used to get phase display value.
 * @param  {SCFile} record change record
 * @return {String}        display value
 */
function phaseName(record){
	return $("#datadictService").displayValue(record,"current.phase");
}

/**
 * This function is used to sync workflow phases to category from workflow definition.
 * @param  {String} table name
 * @param  {String} workflow name
 */
function syncCatPhase(table, workflow) {
    var catFile = table + "category";
    var cats = new SCFile(catFile);

    var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
    wfPhase.setFields(["phaseOrder","phaseName"]);
    var sql = "workflowName =\"" + workflow + "\" and tableName=\"" + table + "\"";
    var phases = [];
    if (wfPhase.doSelect(sql) == RC_SUCCESS) {
        do {
            var order = wfPhase.phaseOrder;
            phases[order] = wfPhase.phaseName;
        }
        while (wfPhase.getNext() == RC_SUCCESS);
        phases = lib.ArrayUtil.removeDuplicateEmptyElement(phases);
    }

    var rc = cats.doSelect('workflow="' + workflow + '"');
    while (rc == RC_SUCCESS) {
        cats.phases = phases;
        cats.doUpdate();
        rc = cats.getNext();
    }
}

/**
 * This function would copy cm3t if parent is active from displayoption definition.
 * If record type is cm3r,Check the permissions of the current user
 */
function canCopyChangeTask(record){
    var filename = funcs.filename(record);
    if (filename == "cm3t"){
        var changeNumber = record["parent.change"];
	    if(changeNumber==="" || changeNumber===null){
	        return true;
	    }	
	    var sql="number=\""+changeNumber+"\"";
	    var cm3r = $("cm3r", SCFILE_READONLY).setFields(["active"]).select(sql).uniqueResult();
	    if(cm3r != null && !cm3r["active"]){
	        return false;
	    }else{
	        return true;
	    }
    }else if(filename == "cm3r"){
    	var id = record["changeModel"];
		if(id !=null){
			var changeModel = $("!changeModel").fields("secRole").find("id=:id",id).one();
			var cmSecRole = funcs.denull(changeModel["secRole"]);
			var opSecRole = funcs.denull(vars.$G_role);
			if(cmSecRole == null||(cmSecRole.length()==0)||(lib.ArrayUtil.contains(cmSecRole,"<all>"))){
				return true;
			}
			var i;
			var length = cmSecRole.length();
			for(i=0; i<length; i++){
				if(lib.ArrayUtil.contains(opSecRole,cmSecRole[i])){
					return true;
				}
			}
			return false;
		}
		return true;
    }else{
    	return true;
    }
}


/**
 *  This functions build and return change task attachment HTML tables
 *   
 *  @param {String} change number
 *  @returns {string} change task attachment HTML table
 */
function getTaskAttachmentHTML(changeNumber) {

    var numbers = [];
    $("cm3t", SCFILE_READONLY).setFields(['number']).setOrderBy(['number'], [SCFILE_DSC]).select('parent.change="' + changeNumber + '"').iterate(function(task) {
        numbers.push(task.number);
    });

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("cm3t", numbers);
    
    return sHtmlReturn;
}


/**
 *  This functions build and return change attachment HTML tables
 *   
 *  @param {String} change number
 *  @returns {string} change attachment HTML table
 */
function getAttachmentHTML(changeNumber) {

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("cm3r", [changeNumber]);

    return sHtmlReturn;
}


/**
 *  Return the total attachment number of change tasks
 *   
 *  @param {String} change number
 *  @returns {Number} the total attachment number of task records
 */
function countTaskAttachments(changeNumber) {
    
    var attach_number = 0;

    $("cm3t", SCFILE_READONLY).setFields(['number']).select('parent.change="' + changeNumber + '"').iterate(function(task) {
        attach_number += lib.AttachmentUtil.countAttachments(task.number, "cm3t");
    });

    return attach_number;
}


/**
 * used in change copy, update close by phase for copied change tasks
 */
function updateChangePlanOfCloseTasks(changeNum, taskNumList, taskPhaseList, oldTaskList, newTaskList) {
	var plan = $('changePlan').select('fileName="cm3r" and number="'+lib.StringUtil.escapeStr(changeNum)+'"').uniqueResult();

	var map = {};	
	var k;
	var length = taskNumList.length();
	for (k=0;k<length;k++) {
		map[taskNumList[k]]=taskPhaseList[k];
	}
	
	var map2 = {};
	length = newTaskList.length();
	for (k=0;k<length;k++) {
		map2[newTaskList[k]]=map[oldTaskList[k]];
	}
	
	var planLng = plan.tasks.length();
	for(k=0;k<planLng;k++) {
		var taskNum=plan.tasks[k].taskNumber;
		if(taskNum && map2[taskNum]) {
			plan.tasks[k].closeByPhase=map2[taskNum];
		}
	}
	
	plan.doUpdate();
}


/**
 * Used in change copy, only manually tasks needs to be copied. 
 * Return a list which is opened manually.
 */
function getManualTaskList(change) {
    var log = getLog('changeManagement.getManualTaskList');

    var model = $('changePlan', SCFILE_READONLY).select('fileName="changeModel" and number="' + lib.StringUtil.escapeStr(change.changeModel) + '"').uniqueResult();
    var plan = $('changePlan', SCFILE_READONLY).select('fileName="cm3r" and number="' + lib.StringUtil.escapeStr(change.number) + '"').uniqueResult();

    var modelMap = {};
    var k;
    var taskId;
    
    if (model) {
        var modelLng = model.tasks.length();
        for (k = 0; k < modelLng; k++) {
            taskId = model.tasks[k].taskId;
            modelMap[taskId] = true;
        }
    }

    var manualTaskList = [];
    var phaseList = [];
    if (plan) {
        var planLng = plan.tasks.length();
        for (k = 0; k < planLng; k++) {
            taskId = plan.tasks[k].taskId;
            var taskNum = plan.tasks[k].taskNumber;

            var closeByPhase = plan.tasks[k].closeByPhase;
            var openInPhase = plan.tasks[k].openInPhase;
            log.info('openByPhase, closeByPhase=', openInPhase, closeByPhase);
            if (!modelMap[taskId] && taskNum) {
                manualTaskList.push(taskNum);
                phaseList.push(closeByPhase || openInPhase);
            }
        }
    }

    return {
        "numberList": manualTaskList,
        "phaseList": phaseList
    };
}


/**
 * get task first phase
 *
 * @param {SCFile} task
 * @returns {SCFile} phase
 */
function getTaskFirstPhase(task) {
    var category = $("!cm3tcategory").fields("workflow").find("name=:name", task.category).one();
    if (!category || !category.workflow) {
        return null;
    }

    var workflow = $("!Workflow").fields("firstPhase").find('tableName="cm3t" and name=:name', category.workflow).one();
    if (!workflow || !workflow.firstPhase) {
        return null;
    }

    var phase = $("cm3tcatphase").find("name=:name", workflow.firstPhase).one();

    return phase;
}


function getChange(number) {
    return $('cm3r').select('number="' + number + '"').uniqueResult();
}