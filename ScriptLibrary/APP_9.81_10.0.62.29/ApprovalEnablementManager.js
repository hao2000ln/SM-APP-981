
var $ = lib.c.$;
var fieldTypes = new Array("number", "character", "date/time", "logical", "label", "record", "offset", "array", "structure", 
							"operator", "expression", "pseudofield", "global var", "local var", "field");

var oobApprovalSupportedTables = new Array("request","cm3r","cm3t","SurveyDefinition","timeperiodDefinition","ocmq", "svcCartItem","incidents","WorkflowDemo");


/**
 * @public
 * @description  Check whether should use new approval inbox/delegation mechanism
 * @return {boolean} true/false
 */
function isNewApprovalInboxDelegation(){

	//return false;
	return lib.ProcessDesignerEnablement.isPDEnabled();
	

}

/**
 * @public
 * @description  Check whether the approval is enabled for the object
 * @param {String} workflowName - Workflow Name
 * @param {String} tableName - tableName
 */
function isApprovalEnabled(objName){

	var obj = $("Object").select('file.name="'+ objName+'"').uniqueResult();
	if (obj!=null){
	   	if(obj["approval.enabled"]!= null ){  
	    	return obj["approval.enabled"];  	
	  	}else {  
	  		return false;    
	  	}
	}
}

//print(isApprovalEnabled("rmCategory"));

//enableApprovalSupporting("newrmCategory","rmCategory");
/**
 * @public
 * @description  Approval Enablement EntryPoint
 * @param {String} workflowName - Workflow Name
 * @param {String} tableName - tableName
 */
function enableApprovalSupporting(workflowName,tableName){
	
	if(tableName!=null && lib.ArrayUtil.indexOf(oobApprovalSupportedTables,tableName)==-1 && isApprovalEnabled(tableName) == false ) {	
	
		print("start enablement for "+ tableName +".");
		enableObject(tableName);
		print("oenableObject done.");
		enableDbdict(tableName);
		print("enableDbdict done.");
	
		enableRuleSet(tableName); 
		print("enableRuleSet done.");
		
 		var datadict = $("datadict").select('name="'+ tableName +'"').uniqueResult();	
		var secArea ;	
		if (datadict!=null) { 
			secArea = datadict["sc.area"]; 
		} 
	
 		enableSecurity(tableName, secArea);
		print("enableSecurity done.");
	
		enableApprovals(workflowName,tableName);
		print("enableApprovals done.");
	
		enableMassApproval(tableName,secArea);  
		print("enableMassApproval done.");
		
		print("finished enablement for " +tableName +".");
		
	}
	
}


//enableDbdict("abc")
/**
 * @public
 * @description  Add approval.status, current.pending.groups,future.groups, approved.groups in the table
 * @param {String} tableName - tableName
 */
function enableDbdict(tableName){

	var sourcedbdict = lib.upgradeDbdictChangeFieldType.getSchema(tableName);

	var length = sourcedbdict.field.length();

  	var aprovalstatus_existed= false;
  	var currentpendinggroups_existed= false;
  	var approvedgroups_existed= false;
  	var futuregroups_existed= false;
  	
  	
	for (var i=0; i < length; i++) { 
            
            if (sourcedbdict.field[i].name =="approval.status") {
            	
            	aprovalstatus_existed = true;
            	
	        }
	        
	        if (sourcedbdict.field[i].name =="current.pending.groups") {
            	
            	 currentpendinggroups_existed = true;
            	
	        }
	        
	        if (sourcedbdict.field[i].name =="approved.groups") {
            	
            	 approvedgroups_existed = true;
            	
	        }
	        
	        if (sourcedbdict.field[i].name =="future.groups") {
            	
            	 futuregroups_existed = true;
            	
	        }
	        if(aprovalstatus_existed==true && currentpendinggroups_existed==true && approvedgroups_existed==true && futuregroups_existed==true){
	        	break;
	        	return;
	        }
	       
	 }     

	if (aprovalstatus_existed==false) {
		var sqlFieldOptions = new SCDatum();
	
		sqlFieldOptions.setType(system.library.DataTypeConst.typeStructure());
		sqlFieldOptions.push("m1");
		sqlFieldOptions.push("APPROVAL_STATUS");
		sqlFieldOptions.push("VARCHAR(30)")
		sqlFieldOptions.push(false)

		addNewField(sourcedbdict, "approval.status", 2,null , -1, sqlFieldOptions );
	}
	
	if(	currentpendinggroups_existed==false) { 
	
		var sqlFieldOptions = new SCDatum();
		sqlFieldOptions.setType(system.library.DataTypeConst.typeStructure());
		sqlFieldOptions.push("z1");
		sqlFieldOptions.push("CURRENT_PENDING_GROUPS");
		sqlFieldOptions.push("VARCHAR(70)")
		sqlFieldOptions.push(false)
		addNewField(sourcedbdict, "current.pending.groups", 8,2 , -1, sqlFieldOptions );
	
	}	
	
	if(	approvedgroups_existed==false) { 
		
		var sqlFieldOptions = new SCDatum();
		sqlFieldOptions.setType(system.library.DataTypeConst.typeStructure());
		sqlFieldOptions.push("m1");
		sqlFieldOptions.push("APPROVED_GROUPS");
		sqlFieldOptions.push("TEXT")
		sqlFieldOptions.push(false)
		addNewField(sourcedbdict, "approved.groups", 8,2 , -1, sqlFieldOptions );
	}	
		
	if(	futuregroups_existed==false) { 
		
		var sqlFieldOptions = new SCDatum();
		sqlFieldOptions.setType(system.library.DataTypeConst.typeStructure());
		sqlFieldOptions.push("m1");
		sqlFieldOptions.push("FUTURE_GROUPS");
		sqlFieldOptions.push("TEXT")
		sqlFieldOptions.push(false)
		addNewField(sourcedbdict, "future.groups", 8,2 , -1, sqlFieldOptions );
	}
}

/**
 * @public
 * @description  Enable Object
 * @param {String} objName - Object Name
 */
//enableObject("rmCategory")
function enableObject(objName){

	 
	 
	 var obj = $("Object").select('file.name="'+ objName+'"').uniqueResult();
	 if (obj!=null){	 
	 	
	 	obj["approval.condition"]= true;
	 	obj["approval.status.field"] = "approval.status";
	 	obj["approval.process"]="object.approval.process"
	 	obj["denial.process"]="object.approval.process";
	 	obj["retract.process"]="object.approval.process";
	 	obj["single.notify.approval"]="Approval Notification";
	 	obj["single.notify.denial"]="Denial Notification";
	 	obj["single.notify.retraction"]="Retract Notification";
	 	obj["log.approvals"]=true;
	 	obj["approval.recalc"]="evaluate(nullsub(parse(str(approvalsRecalc in $L.wfPhase), 2), false))" ;
	 	obj["approval.reset"] ="not  (same(current.phase in $L.file, current.phase in $L.file.save)) or evaluate(nullsub(parse(str(approvalsReset in $L.wfPhase), 2), false))"; 
	 	obj["approval.enabled"]=true
	 	obj.doUpdate();
	 }	
	 
}

//enableObject("rmCategory")
/**
 * @public
 * @description  Enable SingleApprovals
 * @param {String} workflowName - Workflow Name
 * @param {String} tableName - tableName
 */
function enableApprovals(workflowName,tableName){


	enableMenusForSingleApproval(workflowName,tableName);
	
}


//enableMenusForSingleApproval("requestnew","request");
/**
 * @public
 * @description  Enable Menus for Approve/Deny/Retract
 * @param {String} workflowName - Workflow Name
 * @param {String} tableName - tableName
 */
function enableMenusForSingleApproval(workflowName,tableName){


	 var workflow = $("Workflow").select('name="'+ workflowName+'" and tableName="'+tableName+'"').uniqueResult(); 
	 
	// {["Deny", "ApprovalEnablement-Deny", $canApproveDeny="true", "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"variable\"><VariableName caption=\"$canApproveDeny\">$canApproveDeny</VariableName></operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition></collection></XmlCondition>", 2, 311, false, , "( $canApproveDeny = \"true\")", 7]}
	
	 
	 if (workflow!=null){	
	 
	 
	 	if(lib.ArrayUtil.contains(workflow.initRules,"ApprovalEnablement-Init")==false) { 
	 		workflow.initRules = system.functions.denull(workflow.initRules);
 			workflow.initRules.push("ApprovalEnablement-Init");
 		} 
	 	
	 	var approveExisted=false;
	 	var denyExisted=false;
	 	var retractExisted=false; 
	 	 
	 
	 	workflow.action = system.functions.denull(workflow.action);
	 	var i =workflow.action.length(); 
 	 	for (j=0;j<i;j++){
	 	
	 		if(workflow.action[j].actionName=="Approval>Approve" && workflow.action[j].actionId=="ApprovalEnablement-Approve")
	 			approveExisted=true;
	 		if(workflow.action[j].actionName=="Approval>Deny" && workflow.action[j].actionId=="ApprovalEnablement-Deny")
	 			denyExisted=true;
	 		if(workflow.action[j].actionName=="Approval>Retract" && workflow.action[j].actionId=="ApprovalEnablement-Retract")
	 			retractExisted=true;	
	 	}
	 	 
	 	 
	  	var length= workflow.action.length();  	
	  	var optionId=310;	  	
	  	for(j=0;j<length; j++) {	  		
	  		if(workflow.action[j].actionLoc==2){	  		
	  			if(workflow.action[j].actionOption>optionId)  optionId=workflow.action[j].actionOption;
	  			
	  		}	  	
	  	}
	  	
	  	optionId ++;  	
	  
	 	if(approveExisted==false){
 		 	workflow.action[i].actionName = "Approval>Approve"; 
	        workflow.action[i].actionId = "ApprovalEnablement-Approve"; 
	        workflow.action[i].actionCondition = '$canApproveDeny="true"';  
	        workflow.action[i].actionCondXML =  "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"variable\"><VariableName caption=\"$canApproveDeny\">$canApproveDeny</VariableName></operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition></collection></XmlCondition>"
	        
	        workflow.action[i].actionLoc = 2; 
	        workflow.action[i].actionOption = optionId; 
	        workflow.action[i].actionLock = false; 
	        workflow.action[i].actionRunAction = null; 
	        workflow.action[i].actionCondDesc = "( $canApproveDeny = \"true\")"; 
	        workflow.action[i].actionMsgId = i+1; 
        }
        
       	optionId ++;  	
        
        if(denyExisted==false){
        	
	        i =workflow.action.length(); 
 		 	workflow.action[i].actionName = "Approval>Deny"; 
	        workflow.action[i].actionId = "ApprovalEnablement-Deny"; 
	        workflow.action[i].actionCondition =  '$canApproveDeny="true"';
	        workflow.action[i].actionCondXML =  "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"variable\"><VariableName caption=\"$canApproveDeny\">$canApproveDeny</VariableName></operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition></collection></XmlCondition>"
	        
	        workflow.action[i].actionLoc = 2; 
	        workflow.action[i].actionOption = optionId; 
	        workflow.action[i].actionLock = false; 
	        workflow.action[i].actionRunAction = null; 
	        workflow.action[i].actionCondDesc = "( $canApproveDeny = \"true\")"; 
	        workflow.action[i].actionMsgId = i+1;
        }
        
        optionId ++; 
        
        if(retractExisted==false){
	        i =workflow.action.length();
 		 	workflow.action[i].actionName = "Approval>Retract"; 
	        workflow.action[i].actionId = "ApprovalEnablement-Retract"; 
	        workflow.action[i].actionCondition = '$canRetract="true"';  
	        workflow.action[i].actionCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"variable\"><VariableName caption=\"$canRetract\">$canRetract</VariableName></operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition></collection></XmlCondition>"
	        workflow.action[i].actionLoc = 2; 
	        workflow.action[i].actionOption = optionId; 
	        workflow.action[i].actionLock = false; 
	        workflow.action[i].actionRunAction = null; 
	        workflow.action[i].actionCondDesc =  "( $canRetract = \"true\")"; 
	        workflow.action[i].actionMsgId = i+1;
        }
        
        if(approveExisted!=true || denyExisted!=true || retractExisted!=true) {
	 		workflow.doSave();
	 	}


	 	 
	 } 

}



//enableRuleSet("requestTask")
/**
 * @public
 * @description  Generate Approval/Deny/Retract and relative initialize ruleSet.
 * @param {String} objName - Object Name
 */
function enableRuleSet(objName){ 

	var ruleSet_init = $("RuleSet").select('id="ApprovalEnablement-Init"').uniqueResult();
	 
	if (ruleSet_init!=null){	  
 		if(lib.ArrayUtil.contains(ruleSet_init["tablename"],objName)==false) { 
 			ruleSet_init["tablename"] = system.functions.denull(ruleSet_init["tablename"] );
 			ruleSet_init["tablename"].push(objName);
 			ruleSet_init.doUpdate();
 		} 
 	}	 
	
 	var ruleSet_Approve = $("RuleSet").select('id="ApprovalEnablement-Approve"').uniqueResult();
	 
	if (ruleSet_Approve!=null){	  
 		if(lib.ArrayUtil.contains(ruleSet_Approve["tablename"],objName)==false) { 
			ruleSet_Approve["tablename"] = system.functions.denull(ruleSet_Approve["tablename"] );
 			ruleSet_Approve["tablename"].push(objName);
 			ruleSet_Approve.doUpdate();
 		} 
 	}	 
 	
 	
 	
 	var ruleSet_Deny = $("RuleSet").select('id="ApprovalEnablement-Deny"').uniqueResult();
	 
	if (ruleSet_Deny!=null){	  
 		if(lib.ArrayUtil.contains(ruleSet_Deny["tablename"],objName)==false) { 
 			ruleSet_Deny["tablename"] = system.functions.denull(ruleSet_Deny["tablename"] );
 			ruleSet_Deny["tablename"].push(objName);
 			ruleSet_Deny.doUpdate();
 		} 
 	}	 
 	
 	
 	
 	var ruleSet_Retract = $("RuleSet").select('id="ApprovalEnablement-Retract"').uniqueResult();
	 
	if (ruleSet_Retract!=null){	  
 		if(lib.ArrayUtil.contains(ruleSet_Retract["tablename"],objName)==false) {
 			ruleSet_Retract["tablename"] = system.functions.denull(ruleSet_Retract["tablename"] );
 			ruleSet_Retract["tablename"].push(objName);
 			ruleSet_Retract.doUpdate();
 		} 
 	}	 
	
}




/**
 * @public
 * @description  Enable Security Data for approval enablement
 * @param {String} ObjName - Object Name
 * @param {String} secArea - SecArea
 */
function enableSecurity(objName,secArea){ 
	
	
	enableSettingsConfig(secArea);
	
	var secRole = enableSecRole(objName);
	
	enableFolderRights(secRole["name"],secArea);
	
	enableSecRights(secRole["name"], secArea);
 
 }
 
/**
 * @public
 * @description  Enable FolderRights for SecRole and SecArea
 * @param {String} secRole - SecArea
 * @param {String} secArea - SecArea
 */
function enableFolderRights(secRole,secArea){
	
 	var folderRights = $("FolderRights").select('name="'+ secRole + '" and tablename="' +secArea +'"').uniqueResult();
	if (folderRights ==null) {
	
	 	folderRights = new SCFile("FolderRights");
		folderRights ["name"]  = secRole;
		folderRights ["tablename"] = secArea;
		folderRights ["folder"] = "DEFAULT";
		folderRights ["view"] = true;  
		folderRights.doInsert();
		
	}


}

//enableSecRights("rmCategory approver","Request Management Configuration");

/**
 * @public
 * @description  Update SecRights for 'approvals' and 'approve.delegate'
 * @param {String} objName - Object Name
 * @param {String} secArea - SecArea
 */
function enableSecRights(secRole, secArea){

	
	var secRights = $("secRights").select('role="'+ secRole +'" and area ="'+ secArea + '"').uniqueResult();
	
	if(secRights!=null) {
		 
		if(lib.ArrayUtil.contains(secRights["settingId"],"approvals")==false) { 
 			secRights["settingId"].push("approvals");
 			secRights["settingValue"].push("true");
 		}
		
		
		if(lib.ArrayUtil.contains(secRights["settingId"],"approve.delegate")==false) { 
 			secRights["settingId"].push("approve.delegate");
 			secRights["settingValue"].push("true");
 		} 
		 
		secRights["view"]=true;
		secRights["expert"]=true;
 		
		if(lib.ArrayUtil.contains(secRights["folders"],"DEFAULT")==false) { 
 			secRights["folders"].push("DEFAULT");
 		} 
		secRights.doSave();
		
	}

}


/**
 * @public
 * @description  Generate Sec Role (Object Name plus 'approver')for Object
 * @param {String} objName - Object Name
 * @return {SecRole} secRole - SecRole
 */
 
function enableSecRole(objName){

	var name = objName + " " + "approver";
	var des = "Approve "+ objName  + " before they can be processed and filled.";
	
	
	var secRole = $("secRole").select('name="'+ name + '"').uniqueResult();
	
	if (secRole ==null) {
	
	 	secRole = new SCFile("secRole");
		secRole ["name"]  = name;
		secRole ["description"] = des;
	
		secRole.doInsert();
	}
	
	return secRole;	

}

/**
 * @public
 * @description  Enable Setting Config Data for 'Can Approve' and 'Can Delegate Approvals'
 * @param {String} secArea - SecArea
 */

function enableSettingsConfig(secArea){


	var settings = $("settingsConfig").select('setting="'+ secArea + '" and id="approvals"').uniqueResult();	

	if (settings==null) {
		var approval = new SCFile("settingsConfig");
		
		approval["setting"] = secArea;
		approval["id"] = "approvals";
		approval["label"] = "Can Approve";
		approval["type"] = "boolean";
		approval["description"] = "If selected (set to true), enable members of this role to approve/deny or retract pervious approval/denial";
		approval["settingType"] = "area";
		
		approval.doInsert();
	}
	
	settings = $("settingsConfig").select('setting="'+ secArea + '" and id="approve.delegate"').uniqueResult();	
	
	if (settings==null) {
		var delegateApproval = new SCFile("settingsConfig");
		
		delegateApproval["setting"] = secArea;
		delegateApproval["id"] = "approve.delegate";
		delegateApproval["label"] = "Can Delegate Approvals";
		delegateApproval["type"] = "boolean";
		delegateApproval["description"] = "If selected (set to true), enable members of this role to delegate approvals";
		delegateApproval["settingType"] = "area";
		
		delegateApproval.doInsert(); 
	}
	
	var approvalmsg = $("scmessage").select('class="local:settingsConfig" and message.id="'+ secArea +';approvals"').uniqueResult();		
	if(approvalmsg==null){
		approvalmsg = new SCFile("scmessage");	
		approvalmsg["class"] ="local:settingsConfig"
		approvalmsg["message.id"] = secArea + ";approvals"		
	}
	approvalmsg["message"] ="Can Approve";	
	approvalmsg.doSave();
	
	var approvalDelegatemsg = $("scmessage").select('class="local:settingsConfig" and message.id="'+ secArea +';approve.delegate"').uniqueResult();	
	if(approvalDelegatemsg==null){
		approvalDelegatemsg = new SCFile("scmessage");	
 		approvalDelegatemsg["class"] ="local:settingsConfig";
		approvalDelegatemsg["message.id"] =  secArea +";approve.delegate";	
	} 	
	approvalDelegatemsg["message"] ="Can Delegate Approvals";	 
	approvalDelegatemsg.doSave();	
 
}

/**
 * @public
 * @description  Enable Mass Approval Function
 * @param {String} objName - Object Name
 * @param {String} secArea - SecArea
 */
function enableMassApproval(objName,secArea){

	 
	enableMenusForMassApproval(objName,secArea);
	
}	




//enableMenusForMassApproval("rmCategory", "Request Management Configuration" );

/**
 * @public
 * @description  Generate displayOption and relative States data to show the Mass Approval Menu in the QBE List
 * @param {String} objName - Object Name
 * @param {String} secArea - SecArea
 */
function enableMenusForMassApproval(objName,secArea){

	var obj = $("Object").select('file.name="'+ objName+'"').uniqueResult();
	if (obj!=null){	 
	 
		var defaultstate= obj["default.state"];
	 	
	 	var states = $("States").select('state="'+ defaultstate+'"').uniqueResult();
	 	
	 	if (states!=null){
	 	
	 		states["process.label"]=system.functions.denull(states["process.label"]);
	 		states["valid.process"]=system.functions.denull(states["valid.process"]);
	 		states["process.condition"]=system.functions.denull(states["process.condition"]);
	 		states["run.save.before"]=system.functions.denull(states["run.save.before"]);
	 		
	 		var length = states["process.label"].length();
	 		
	 		var existed = false;
			 
			for (var i=0; i<length ; i ++ ){
			
				if(states["process.label"][i]=="ticketmassapprove" && states["valid.process"][i]=="ticket.approve.mass"){
					existed = true;
					 
					break;
				} 			
			}	 		
	 		 
	 		if (existed==false) {
		 		states["process.label"].push("ticketmassapprove");
		 		states["valid.process"].push("ticket.approve.mass");
		 		states["process.condition"].push(true);
		 		states["run.save.before"].push(null);
		 		states.doAction("save");
	 		}
	 		
	 		var displayScreen = states["display.screen"];
	 		
	 		
	 		var disOpt = $("displayoption").select('id="'+ displayScreen+"_"+"ticketmassapprove"+'"').uniqueResult();
	 		 
	 		if (disOpt==null) {
	 		
		 		var displayOption = new SCFile("displayoption") ;
		 		
		 		displayOption["screen.id"]= displayScreen;
		 		displayOption["id"]= displayScreen+"_"+"ticketmassapprove";
		 		displayOption["action"]= "ticketmassapprove";
		 		
		 		
		 		var checkOption = new SCFile("displayoption"); 
		 		
		 		var optNumber = 5000;
		 		
	    		for (var opSeed = 5000; opSeed < 6000; opSeed++) { 
	        			//print('screen.id="db.view" and gui.option=' + opSeed); 
	       			 if (RC_SUCCESS != checkOption.doSelect('screen.id="'+ displayScreen + '" and gui.option=' + opSeed)) { 
	            		optNumber  = opSeed; 
	           		 break; 
	       		 } 
	   			}
		 		
		 		displayOption["gui.option"]= optNumber;
		 		displayOption["txt.option"]= optNumber;
		 		displayOption["txt.bank"]= 1;
		 		displayOption["default"]= "Mass Approve";
		 		displayOption["balloon"]= "Mass Approve";
		 		displayOption["condition"]= system.functions.parse('jscall("security.hasRight", "'+secArea+'", "expert")=true',4);
		 		displayOption["language"] ="ENG"
		 		
		 		
		 		displayOption.doInsert();
	 		
	 		}
	 	} 
	 
	 
	}
}




/**
* Method: addNewField
*
* add the field to dbdict.
* @param scFile - SCFile
* @param fieldName - field.name
* @param fieldType - field.type
* @param subFieldType - if field.type is "Array", then a sub type should be provied.
* @param oldFieldIndex - index of the old field that has been renamed before this adding operation
* 
* return the index of the new filed in the table,
*			or -1, if the field add operation failed.
*/
function addNewField(scFile, fieldName, fieldType, subFieldType, oldFieldIndex, sqlFieldOptions) {  	
	 //field
	var newIndex =	getIndexForNewField(scFile,fieldName,oldFieldIndex);
    if (fieldType == system.library.DataTypeConst.typeArray()) {
		var field = createField(scFile, fieldName, 1, newIndex, fieldType, null);
		scFile.field.push(field);
		 //sub field
		field = createField(scFile, fieldName, 2, 1, null, subFieldType, sqlFieldOptions);		 		
		scFile.field.push(field);
	} else {
 		var field = createField(scFile, fieldName, 1, newIndex, fieldType, null, sqlFieldOptions); 
 		scFile.field.push(field);
	} 
	
	if (submit(scFile)) {	
		//New field added: [dbdict:rootcausetask,field:workaround,type:8]  		
  		lib.upgradeLog.scDetail(1108,[getFieldDescription2(scFile.name,fieldName,fieldType)]);
  		return newIndex;
  	} else {
  		return -1;
  	}
  	
}



/**
* Method: createField

* construct a field with the specified values.
*
* @param scFile - SCFile
* @param fieldName - field.name
* @param level - field.level
* @param index - field.index
* @param fieldType - field.type
* @param subFieldType - if field.type is "Array", then a sub type should be provied.
*
* return the field created.
*/
function createField(scFile,fieldName,level,index,fieldType,subFieldType,sqlFieldOptions) {
    // a field is of type of structure
	var field = new SCDatum();
	field.setType(system.library.DataTypeConst.typeStructure());
	field.push(fieldName);
	field.push(level);
	field.push(index);
 	//type
	if (fieldType == null) {
		field.push(subFieldType);
	} else {
	   field.push(fieldType);
	}
	
	//structure
	field.push(null);
	
	//db2.field.name
	field.push(null);	
	
	//db2.length
	field.push(null);
	
	//sql.field.options
	//var sqlFieldOptions = createStructure([null,null,rdbmsFieldType,false]);  
	field.push(sqlFieldOptions);
 	//structure.array.options
	var structArrayOptions = createStructure([false,null,null,false]);	
	field.push(structArrayOptions);
	
	return field;
}

/**
* Create structure-typed property for  a field.
*/
function createStructure(array) {
	var struct = new SCDatum();
	struct.setType(system.library.DataTypeConst.typeStructure());
	for (var i=0; i<array.length; i++) {
		struct.push(array[i]);
	}
	return struct;
	
}



/**
* Method: getIndexForNewField
*
* get the index value for creating a new field in the table.
* 
* @param scFile - SCFile
* @param fieldName - name of the field
* @param oldFieldIndex - index of the old field that has been renamed before this adding operation
* return the index value
*/
function getIndexForNewField(scFile,fieldName,oldFieldIndex) {
	var alias = findFieldAlias(scFile,fieldName,oldFieldIndex);
  	if (alias) {
	  	return alias.newFieldLevelOneIndex	;	  		
  	}
	 return getMaxFieldIndex(scFile)+1;

}




/**
* Method: getMaxFieldIndex
*
* get the max index value of the field of the table.
* 
* @param scFile - SCFile
*
* return the max index value
*/
function getMaxFieldIndex(scFile) {
  var max=1;
  for (var i=0;i<scFile.field.length();i++) { 
     //field should be level 1
    if (scFile.field[i].level == 1) {   
        max = system.functions.max(max, scFile.field[i].index);
    }
  }                                      
  return max; 	
}


function findFieldAlias(scFile,fieldName,oldFieldIndex) {
	if (oldFieldIndex==-1) {
		return null;
	}
	
	for (var i=0;i<changeListObjects.length;i++) {
  		if (changeListObjects[i].tableName==scFile.name) {  		
	  		//as field and its alias has the same index value, they have to be changed together
	  		for (var j=0;j<changeListObjects[i].fields.length;j++) {
	  			//the new fields of field and alias has the same index value too
	  			if (changeListObjects[i].fields[j].oldFieldLevelOneIndex != null 
	  				&& oldFieldIndex==changeListObjects[i].fields[j].oldFieldLevelOneIndex) {
	  				return changeListObjects[i].fields[j];
	  			}
	  		}	 		
	  		return null;
	  	}
  	}
}


/*
	 all changes to SM dbdict and backend Database.
	@param scFile - SCFile
	
	return ture, if the submit succed; false otherwise.
*/
function submit(scFile) {  
	//update to backend RDBMS TABLE
	if (updateDB(scFile) == true) {
		//update dbdict
		if (scFile.doUpdate() == RC_SUCCESS) {
			return true;
		} else {
			//Update of dbdict:rootcausetask failed
			lib.upgradeLog.scError(1115,[scFile.name]);
			return false;
		}
	} else {
		//Update of RDBMS table schema:rootcausetask failed
		lib.upgradeLog.scError(1116,[scFile.name]);
		return false;
	}
}



/**
* Method: updateDB
*
* Update field in the backend RDBMS TABLE
*/
function updateDB(scFile) {
	var rteReturnValue ;
	var rteNames = new SCDatum();
	var rteValues = new SCDatum(); 		
	rteNames.push("record"); 		  
	rteNames.push("all.null");
	rteNames.push("boolean1");
	rteValues.setType(8);
	
	rteValues=system.functions.insert(rteValues, 0, 1, scFile);
	rteValues=system.functions.insert(rteValues, 0, 1, true);
	rteValues=system.functions.insert(rteValues, 0, 1, true);
	var rteReturnValue = new SCDatum();
	
	//this rad app will have to run in the same thread
	var result = system.functions.rtecall("callrad", 
							rteReturnValue, 
							"dbdict.sql.changes", //RAD app name
							rteNames, 
							rteValues,
							false); //false to run in same thread, true to run in new thread
	
	return 	result;
}


/**
* get field description for outputing to log file.
* format: [dbdict:field:type]
*/
function getFieldDescription2(dbdict,field,type) {
	return "[dbdict:"+dbdict+",field:"+field+",type:"+fieldTypes[system.functions.val(type)-1]+"]" ;
}