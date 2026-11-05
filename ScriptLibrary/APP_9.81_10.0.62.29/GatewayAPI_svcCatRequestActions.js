/** @fileoverview svcCatalog - contains functions used by the Service Catalog module
*   @author SMCi
*/
var log = lib.GatewayAPI_Logger.log("GatewayAPI_svcCatRequestActions");
var svcCat_create_request = lib.GatewayAPI_RAD.svcCat_create_request;
var se_call_process = lib.GatewayAPI_RAD.se_call_process;
var us_link = lib.GatewayAPI_RAD.us_link;
var select = lib.GatewayAPI_RAD._select;
var xmlEx  = lib.GatewayAPI_xmlEx.xmlEx;

var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var CURRENTRECORD_LOCKED = lib.GatewayAPI_Constants.CURRENTRECORD_LOCKED();
var CURRENTRECORD_NOT_UPDATE2DATE = lib.GatewayAPI_Constants.CURRENTRECORD_NOT_UPDATE2DATE();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var checkInteractionCart = lib.GatewayAPI_WSInterface_svcCart_Util.checkInteractionCart;
var _getIfApprovalModLaterThanTime = lib.GatewayAPI_Util.getIfApprovalModLaterThanTime;
var callback_type_value = vars['$G.callbackType'].toArray();//new Array("E-mail", "Email", "None", "Telephone", "Page");
var getTimeZone=lib.GatewayAPI_svcCatRequest.getTimeZone;
var _checkPermission=lib.GatewayAPI_svcCatRequest._checkPermission;



function closeRequest(){
	var closureCode="Cancelled";
	_closeRequest(closureCode);
}

function acceptRequest(){

	var closureCode="Fulfilled";
	_closeRequest(closureCode);

}

function rejectServiceRequest(){

	var targetStatus="Dispatched";
	_createInteractionComments(targetStatus);

}

function rejectSupportRequest(){

	var targetStatus="In Progress";
	_createInteractionComments(targetStatus);

}

function addActivityLog(){
	_createInteractionComments();

}

function _closeRequest(closureCode) {
	getTimeZone();
    setExitType(NORMAL_EXIT);    
    //Give $lo.contact.name value for ESS user.
    vars['$lo.contact.name'] = funcs.nullsub(vars['$lo.contact.name'], lib.GatewayAPI_Util.getCurrentOperator()['contact.name']);
    var File = lib.DBUtils.File;
    var requestID = vars.$L_file['incident.id'];
    var comments = vars.$L_file['other'];
    if(comments == null || comments == ""){
       comments = "No longer having the problem";
    }
    
    if(requestID == null || requestID == ""){
	   setExitType(BAD_VALIDATION_EXIT);
	   setErrorMsg(lib.GatewayAPI_Util.getMessage(138));
	   return;    
    }
    
    var incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');
    if(incidents == null) {
        setErrorMsg(lib.GatewayAPI_Util.getMessage(140));
		setExitType(NO_RECORD_EXIT);
		return;
    }
    var returnCode;
    var ess_temp = vars.$G_ess;
    var ess_two_temp = vars.$G_ess_two;
    vars.$G_ess = true;
    vars.$G_ess_two = true;
    
    vars['$byapi'] = true;
    vars['$api.update'] = new Array(comments);
    var obj   = new SCFile('Object');
    obj.doSelect('file.name="incidents"');
    if(obj['workflowLocation'] != null){
      
       vars.$G_bg_activity_text = new Array(comments);      
	}
	incidents.each(function(incident) {
	   if(incident.open == "Closed"){
	      setExitType(BAD_VALIDATION_EXIT);
	      setErrorMsg(lib.GatewayAPI_Util.getMessage(139));
	      return;	   	   
	   }
	   /*
	   if(incident.approval_status == "pending"){
	      setExitType(BAD_VALIDATION_EXIT);
	      setErrorMsg(lib.GatewayAPI_Util.getMessage(142));
	      return;	   	   
	   }*/
	   
	    var operatorObj = getCurrentOperator();
	    var operatorContactName = operatorObj.contact_name;
	   
	    var operator = funcs.operator();
	    var ownername = incident['opened.by'];
	    var contact = incident['contact.name'];
	    var callbackContact = incident['callback.contact'];
	    // It need to compare the owner name with the operator name or the user full name according to QCCR73278.
	   /* if( ownername != operator && ownername != vars.$lo_ufname && operatorContactName != contact && operatorContactName != callbackContact){
	      setExitType(BAD_VALIDATION_EXIT);
	      setErrorMsg(lib.GatewayAPI_Util.getMessage(137));
	      return;
	    }*/
	    //The value of comments is stored in $api.update and will be handled in Process sd.esscloseme and ess.sm.close
	    //incident['resolution'] = new Array(comments);
	    incident['resolution.code']=closureCode;
		returnCode = incident.doAction('esscloseme');	
	});
	
	vars.$G_ess = ess_temp;
	vars.$G_ess_two = ess_two_temp;
	
	if(returnCode != RC_SUCCESS) {
	  if(returnCode == 3) { 
	    setExitType(CURRENTRECORD_LOCKED);
	  }
	  else {
		setExitType(BAD_VALIDATION_EXIT);
	  }
		
	  if (returnCode) {
		vars.$L_file['variable1'] = "" + returnCode;
		vars.$L_file['variable3'] = RCtoString(returnCode);
	  }
	}
}


function _createInteractionComments(targetStatus) {
	getTimeZone();
	setExitType(NORMAL_EXIT);
    
    var File = lib.DBUtils.File;
    var file = vars['$L.file'];
    var sdID = file['incident.id'];
    var fileName = "incident";
    var comments = file['other'];

    var incidents = new File('incidents').getRecords('incident.id="' + sdID + '"');
    if(incidents == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }
    var temp_ess = vars.$G_ess;
    vars.$G_ess = true;
    var returnCode;
    try{
		incidents.each(function(incident) {
			if (_checkPermission(incident)) {
				vars.$update_action = new Array(comments);
				var obj   = new SCFile('Object');
      			obj.doSelect('file.name="incidents"');
      			if(obj['workflowLocation'] != null){
            		vars.$G_bg_activity_text = vars.$update_action;
				}
				vars['$update.incident.ws'] = true;
				if (targetStatus!=null){
    				incident['open']=targetStatus;
   			    }
				returnCode = incident.doAction('save');
				vars['$update.incident.ws'] = false;
				if(returnCode != RC_SUCCESS) {
					if(returnCode == 3) {
	                    setExitType(CURRENTRECORD_LOCKED);
	                }
	                else {
						setExitType(BAD_VALIDATION_EXIT);
		            	setErrorMsg(RCtoString(returnCode));
		            }	
					return;
				}
			} 
		});
	} catch(ex) {
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
	}
	if(returnCode != RC_SUCCESS) {
	  if(returnCode == 3) {
	  	setExitType(CURRENTRECORD_LOCKED);
	  }
	  else{
	  	setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(RCtoString(returnCode));
	  }
	  return;
	}
	vars.$G_ess = temp_ess;
}

