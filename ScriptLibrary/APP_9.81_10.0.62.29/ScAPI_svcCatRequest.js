/** @fileoverview svcCatalog - contains functions used by the Service Catalog module
*   @author SMCi
*/
var log = lib.ScAPI_Logger.log("ScAPI_svcCatRequest");
var svcCat_create_request = lib.ScAPI_RAD.svcCat_create_request;
var se_call_process = lib.ScAPI_RAD.se_call_process;
var us_link = lib.ScAPI_RAD.us_link;
var select = lib.ScAPI_RAD._select;
var xmlEx  = lib.ScAPI_xmlEx.xmlEx;

var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var CURRENTRECORD_LOCKED = lib.ScAPI_Constants.CURRENTRECORD_LOCKED();
var CURRENTRECORD_NOT_UPDATE2DATE = lib.ScAPI_Constants.CURRENTRECORD_NOT_UPDATE2DATE();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var checkInteractionCart = lib.ScAPI_WSInterface_svcCart_Util.checkInteractionCart;
var _getIfApprovalModLaterThanTime = lib.ScAPI_Util.getIfApprovalModLaterThanTime;
var callback_type_value = vars['$G.callbackType'].toArray();//new Array("E-mail", "Email", "None", "Telephone", "Page");


function createRequest(){
  var temp_ess = vars.$G_ess;
  _createRequest();
  vars.$G_ess = temp_ess;
}

/**  This function is called to submit request. It will query cart object with id and create interaction record.
*
*/
function _createRequest() {
  var info = lib.ScAPI_Util.getSystemInfo();
  vars.$G_webserver_url = info['webserver.url'];
  vars.$G_ess_url = info['ess.url'];
  vars.$G_src_url = info['src.url'];
  vars.$G_ess = true;
  
 
  /* Determine the request type, and follow the different process
   * There are three types: service catalog, support catalog, self-service
   * case-insensitive, service catalog and support catalog is the same in this API, and it is the default value
   */
  
  var serviceType = funcs.tolower(vars['$L.file']['variable1']);
  vars['$L.file']['variable1'] = null; // clear this dummy field
  if (serviceType != null && serviceType != "service catalog" && serviceType != "support catalog" 
      && serviceType != "self-service") { // request type is incorrect
      setExitType(BAD_VALIDATION_EXIT);
      setErrorMsg(lib.ScAPI_Util.getMessage(155));
      return;
  }
  if (serviceType == 'self-service') { 
      _createSelfServiceInteraction();
      return;
  }
  /*: determine request type ends ::~ */
  
  var cartId = vars.$L_file.cartId;
  vars.$L_file.cartId = null;

  //Verify the onbehalf value
  var isOnbehalf = vars.$L_file.bRequestOnBehalf;
  
  if(isOnbehalf == null || isOnbehalf==""){
  	  vars.$L_file.bRequestOnBehalf=false;
  }
  else{
	  var onbehalfisboolean = ((isOnbehalf.toString()) != "true" && (isOnbehalf.toString()) != "false");
	  if(onbehalfisboolean){
	  	  vars.$L_file.bRequestOnBehalf=false;
	  }
  }
  
  if (!cartId) {
      setExitType(BAD_VALIDATION_EXIT);
      setErrorMsg(lib.ScAPI_Util.getMessage(100)); 
      return;
  } 
  
  var cart = lib.ScAPI_RAD._select("svcCart", "cartId=" + cartId);
  if (cart == null) {
      setExitType(NO_RECORD_EXIT);
      setErrorMsg(lib.ScAPI_Util.getMessage(108));      
      return;
  }
  
  var cartItem = lib.ScAPI_RAD._select("svcCartItem", "cartId=" + cartId);
  if (cartItem == null) {
      setExitType(BAD_VALIDATION_EXIT);
      setErrorMsg(lib.ScAPI_Util.getMessage(115));      
      return;
  }
    
  setExitType(NORMAL_EXIT);
  
  
  var sdID = cart.sdID;
  if (sdID != null && sdID != "") {
	  /* there is a request for this cart*/
	  var interaction = lib.ScAPI_RAD._select("incidents", "incident.id=\"" + sdID + "\"");
	  if (interaction == null) { 
          _createInteraction(cart);
	  } else {
	  	setExitType(BAD_VALIDATION_EXIT);
	    setErrorMsg(lib.ScAPI_Util.getMessage(124));      
	  }
  } else {
  	  _createInteraction(cart);
  }  
}

/*
    update interaction
*/

function _updateInteraction(interaction, cart) {
   /*do nothing*/

}

/*
    create a new interaction
*/

function _createInteraction(cart) {
	try{
		checkInteractionCart(null, cart);
	}catch (ex){
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
		return;
	}

	var serviceType = "service catalog";

    var srcXml = null;
    
	// Added for support SRC Tailoring
    if (funcs.exists("variable2", vars['$L.file'])) {
    	srcXml = vars['$L.file']['variable2'];
    	vars['$L.file']['variable2'] = null; // set to null
    }
	
	// the fill work should be done in begin to make sure other fields such as contact.fullname are consistent
	var fieldsInXml = [];
	if (srcXml && fillFileFromXml(vars['$L.file'], srcXml, fieldsInXml) == false)
	{
		setExitType(BAD_VALIDATION_EXIT);
		return;
	}

	// Added for support non-cart request
	var cartItem = lib.ScAPI_RAD._select("svcCartItem", "cartId=" + cart.cartId);
	if (cartItem != null)
	{
		var itemName    = cartItem['item.description'];
		var itemOptions = cartItem['options'];
		if (cartItem.getNext() != RC_SUCCESS)
		{
			var catalog = lib.ScAPI_RAD._select("svcCatalog", "name=\"" + itemName + "\"");
			if (catalog != null)
			{
				if (catalog['non.cart'] == true)
				{
					vars.$L_file.one_click = true;
					vars.$L_file['svc.options'] = itemOptions;
				}
				if (catalog['support.item'] == true)
				{
					vars.$L_file['source.service'] = 'support catalog';
					vars.$L_file['category'] = catalog['category'];
					vars.$L_file['subcategory'] = catalog['subcategory'];
					vars.$L_file['product.type'] = catalog['product.type'];
					serviceType = "support catalog";
				}
			}
		}
	}

	var company = vars['$lo.operator']['company'];
	if (company == null) {
		company = 'DEFAULT';
	}
	if (!svcSrcValidation(srcXml, "submit", serviceType, company)) {
	    setExitType(BAD_VALIDATION_EXIT);
		return;
	}

	var operator = lib.ScAPI_Util.getCurrentOperator();
	vars.$L_file.alternate_contact = operator["contact.name"];

	vars.$L_file.incident_id = null;
	
	setTitle(vars.$L_file);
	setDescription(vars.$L_file);
	setInitialImpact(vars.$L_file);
	setSeverity(vars.$L_file);

	//QCCR1E120406 - Due to the APPs logic change this line was asked to get removed.

	setContact(vars.$L_file);
	setCallBack(vars.$L_file);
	
	conjunctionContactAndCallBack(vars.$L_file, fieldsInXml);

	// Call add RAD
	var addExit = svcCat_create_request(cart, vars.$L_file);
	if (lib.SeExternalHelper.isNormalAction(addExit)==false) // May validate failed by formatctrl
	{
		setExitType(BAD_VALIDATION_EXIT);
		vars['$L.file']['incident.id'] = null; // Set incident.id to null while add failed
		return;
	}
}


// Open Generic SelfService Ticket
function _createSelfServiceInteraction()
{
	setExitType(BAD_VALIDATION_EXIT);

    var srcXml = null;
    
	// Added for support SRC Tailoring
	if (funcs.exists("variable2", vars['$L.file'])) {
    	srcXml = vars['$L.file']['variable2'];
    	vars['$L.file']['variable2'] = null; // set to null
    }
	
	// the fill work should be done in begin to make sure other fields such as contact.fullname are consistent
	var fieldsInXml = [];
	if (srcXml && fillFileFromXml(vars['$L.file'], srcXml, fieldsInXml) == false)
	{
		setExitType(BAD_VALIDATION_EXIT);
		return;
	}

	var company = vars['$lo.operator']['company'];
	if (company == null) {
		company = 'DEFAULT';
	}
	
	if (!svcSrcValidation(srcXml, "submit", "self-service", company)) {
	    setExitType(BAD_VALIDATION_EXIT);
		return;
	}
		
	setTitle(vars.$L_file);
	setDescription(vars.$L_file);
	setSeverity(vars.$L_file);
	setContact(vars.$L_file);
	
	// call link:incidents
	var linkRecord = select('link', 'name="incidents"');
	us_link(vars['$L.file'], 'contact.name', linkRecord, 'fill');

	setCallBack(vars.$L_file);
	
	var errorMsg = setAffectedItem(vars.$L_file);
	if (errorMsg) {
		setErrorMsg(errorMsg);
		setExitType(BAD_VALIDATION_EXIT);
		return;
	}
	
	conjunctionContactAndCallBack(vars.$L_file, fieldsInXml);

	// prepare variable
	var lFileSave = new SCFile('incidents');

	// start
	vars['$G.ess'] = true; // set $G.ess to true
	var obj   = new SCFile('Object');
	var caty  = new SCFile('category');
	var env   = new SCFile('smenv');
	var state = new SCFile('States');
	obj.doSelect('file.name="incidents"');
	env = vars['$G.sm.environment'];
	state.doSelect('state="' + obj['open.state'] + '"');
	vars['$L.format'] = env['ess.initial.format'];
	
	var i, length;
	
	// call init process in States
	var initProcess = state['init.process'];
	if (initProcess != null)
	{
		var initNames  = ['$L.mode','$L.format'];
		var initValues = ['add',null];
		var rpr = se_call_process(vars['$L.file'], initProcess, true, false, env, vars['$L.file'], lFileSave, [obj,null,null], initNames, initValues);
		// build variable according to the process's return
		length = rpr.names.length();
		for (i = 0;i < length;i++) {
			vars[rpr.names[i]] = rpr.values[i];
		}
	}
	//check if PD or not

    if(obj['workflowLocation'] != null)
	{
	vars['$L.file']["category"] = "incident";//not using defCat now
	vars['$post.open.fulfillment.record'] = true; 
	var returnCode = vars['$L.file'].doAction('add');
	vars['$post.open.fulfillment.record'] = null; 
					
	if(returnCode != true)
	 {
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(RCtoString(returnCode));
	  return;
	 }
	 setExitType(NORMAL_EXIT);
	 return;
	}

	// call process define in "Submit" display option
	var action = 'log';
	var saveProcess = null;
	length = state['process.label'].length();
	for (i = 0;i < length;i++)
	{
		if (state['process.label'][i] == action)
		{
			saveProcess = state['valid.process'][i];
			break;
		}
	}
	
	if (saveProcess != null)
	{
		var fc  = new SCFile("formatctrl");
		var mfc = new SCFile("formatctrl");
		fc.doSelect('name="' + funcs.str(vars['$L.format']) + '"');
		var mfcName = funcs.nullsub(obj['master.fc'], 'incidents');
		mfc.doSelect('name="' + mfcName + '"');
		var pNames  = ['$L.mode','$L.action','$L.format','$L.fc','$L.fc.master','$L.exit','$L.bg'];
		var pValues = ['add',action,vars['$L.format'],fc,mfc,'normal',vars['$G.bg']];
		var cpr = se_call_process(vars['$L.file'], saveProcess, true, false, env, vars['$L.file'], lFileSave, [obj,caty,null], pNames, pValues);
		var lExitIdx = funcs.index('$L.exit', cpr.names);
		var lExit = null;
		if (--lExitIdx > -1) {
			lExit = cpr.values[lExitIdx];
		}

		if (lExit == 'normal' || lExit == null)  // save success
		{
			setExitType(NORMAL_EXIT);
			return;
		}
		else // save failed, maybe validate failed in formatctrl
		{
			vars['$L.file']['incident.id'] = null;
			return;
		}
	} 
}


/**
 * Eventhough SM 932 allow the tailoring of "affected.item", it still has to keep it business logic.
 */
function setAffectedItem(incident, withDisplayName) {
	var affectedItem = incident['affected.item'];                  // check: affected.item
	if (affectedItem != null)
	{
		var valid = false;
		var affectedItemValues = lib.ScAPI_Subscriptions.getSDSubscribedCIs(incident.contact_name, withDisplayName);
		if (!withDisplayName && funcs.index(affectedItem, affectedItemValues) > 0) {
			valid = true;
		}
		if (withDisplayName && affectedItemValues) {
			var i;
			for (i=0; i<affectedItemValues.length; i++) {
				var affectedItemObj = lib.JSON3.parse(affectedItemValues[i]);
				if (affectedItemObj.value == affectedItem || affectedItemObj.key == affectedItem) {
					valid = true;
					break;
				}
			}

		}
		if (!valid) {
			var msg = lib.ScAPI_Util.getMessage(157);
			return msg;
		}
		if (affectedItem == lib.ScAPI_Constants.SUBSCRIPTION_OTHER()){
			affectedItem = null;
			incident['affected.item'] = null;
		}
	}
}

function setTitle(incident) {
	if (!incident["title"] && incident["description"] && incident["description"].length()>0) {
		incident["title"] = incident["description"][0];
	}
}

function setDescription(incident) {
	if (!incident["description"] || (incident["description"].length()==1&&(incident["description"][0]==null||incident["description"][0]==""))) {
		incident["description"] = [incident["title"]];
	}
}

function setInitialImpact(incident) {
	if (!incident["initial.impact"]) {
		incident["initial.impact"]="4";
	}
}

function setSeverity(incident) {
	if (!incident['severity']) {
		incident['severity'] = "4";
	}
}

function setContact(incident,fieldsInXml) {
	var fContact = null;

	if ( incident.contact_name != null ) {
	 fContact = select('contacts', 'contact.name="'+incident.contact_name+'"', ['contact.name', 'full.name']);
	 if(fieldsInXml == null || (arrayIndexOf(fieldsInXml,"contact.fullname") < 0 && arrayIndexOf(fieldsInXml,"contact.name") >= 0)){
		
		if ( fContact != null ){
			incident.contact_name = fContact.contact_name;
			incident.contact_fullname = fContact.full_name;
		}
	}
   }
	if(incident.contact_name == null || fContact == null) {
	  if (incident.contact_fullname != null) {
		fContact = select('contacts', 'full.name="'+incident.contact_fullname+'"', ['contact.name', 'full.name']);
		if ( fContact != null ){
		  incident.contact_name = fContact.contact_name;
		  incident.contact_fullname = fContact.full_name;
		}
	  }
	  else{
		var operator = getCurrentOperator();
		incident.contact_name = operator.contact_name;
		var tmpContact = lib.ScAPI_Util.getContactFields(incident['contact.name'], ['full.name']);
		incident.contact_fullname = tmpContact.full_name;
		}
	}
}

function setCallBack(incident,fieldsInXml) {
	var fContact = null;
	
	if (incident.callback_contact != null) {	
	   fContact = select('contacts', 'contact.name="'+incident.callback_contact+'"', ['contact.name', 'full.name']);
	   if(fieldsInXml == null || (arrayIndexOf(fieldsInXml,"callback.contact.fullname") < 0 && arrayIndexOf(fieldsInXml,"callback.contact") >= 0)){
	  
		if ( fContact != null ){
			incident.callback_contact = fContact.contact_name;
			incident.callback_contact_fullname = fContact.full_name;
		}
	}
	} 
	if( incident.callback_contact == null || fContact == null)
	{
	  if (incident.callback_contact_fullname != null) {
		fContact = select('contacts', 'full.name="'+incident.callback_contact_fullname+'"', ['contact.name', 'full.name']);
		if ( fContact != null ){
		  incident.callback_contact = fContact.contact_name;
		  incident.callback_contact_fullname = fContact.full_name;
		}
	  }
	  else{
		var operator = getCurrentOperator();
		incident.callback_contact = operator.contact_name;
		var tmpContact = lib.ScAPI_Util.getContactFields(incident['callback.contact'], ['full.name']);
		incident.callback_contact_fullname = tmpContact.full_name;
	   }
	}
}

/**
 * Set contact and callback if one of them are not present in checkout panel and no explicit value in webservice API.
 * For Request-On-Behalf mode, OOB service-checkout panel contains no "contact.name", SRC-UI would set "contact.name" value
 * in webservice API, this value should be honored in this case. However, if "contact.name" present in the checkout panel by customization,
 * the value in checkout panel take the priority.
 */
function conjunctionContactAndCallBack(incident, fieldsInXml) {
	if (incident.contact_name == null || incident.contact_name == "") {
		if (arrayIndexOf(fieldsInXml,"contact.name") < 0 && arrayIndexOf(fieldsInXml,"callback.contact") > -1) {
			incident.contact_name = incident.callback_contact;
		}
	}
	if (incident.callback_contact == null || incident.callback_contact == "") {
		if (arrayIndexOf(fieldsInXml,"callback.contact") < 0 && arrayIndexOf(fieldsInXml,"contact.name") > -1) {
			incident.callback_contact = incident.contact_name;
		}
	}
}

function arrayIndexOf(array1,string1)
{
	var i;
	for(i=0;i<array1.length;++i)
	{
		if (array1[i] == string1) {
			return i;
		}
	}
	return -1;		
}

//This function is to cancel a request
function cancelRequest() {
    setExitType(NORMAL_EXIT);
    var obj   = new SCFile('Object');	
	obj.doSelect('file.name="incidents"');
    //Give $lo.contact.name value for ESS user.
    vars['$lo.contact.name'] = funcs.nullsub(vars['$lo.contact.name'], lib.ScAPI_Util.getCurrentOperator()['contact.name']);

    var File = lib.DBUtils.File;
    var requestID = vars.$L_file['incident.id'];
    var incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');

    if(incidents == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }
    
    var returnCode;
    vars['$byapi'] = true;
    vars['$procceed'] = 'yes';
	incidents.each(function(incident) {

		if(obj['workflowLocation'] != null) {
			if(lib.ProcessDesignerEnablement.isMigratedWorkflowUsed("incidents", incident['category'])) { 
				returnCode = incident.doAction('cancelrequest');
			}
			else {
				returnCode = incident.doAction('esscancelrequest');
			}
		} else { 
			returnCode = incident.doAction('cancelrequest');
		}
	});
	
	if(returnCode != RC_SUCCESS && returnCode != 0) {
		setExitType(BAD_VALIDATION_EXIT);
		return;
	}
}

//This function is to close a request
function closeRequest() {
	getTimeZone();
    setExitType(NORMAL_EXIT);    
    //Give $lo.contact.name value for ESS user.
    vars['$lo.contact.name'] = funcs.nullsub(vars['$lo.contact.name'], lib.ScAPI_Util.getCurrentOperator()['contact.name']);
    var File = lib.DBUtils.File;
    var requestID = vars.$L_file['incident.id'];
    var comments = vars.$L_file['other'];
    
    if(comments == null || comments == ""){
       comments = "No longer having the problem";
    }
    
    if(requestID == null || requestID == ""){
	   setExitType(BAD_VALIDATION_EXIT);
	   setErrorMsg(lib.ScAPI_Util.getMessage(138));
	   return;    
    }
    
    var incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');
    if(incidents == null) {
        setErrorMsg(lib.ScAPI_Util.getMessage(140));
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
	      setErrorMsg(lib.ScAPI_Util.getMessage(139));
	      return;	   	   
	   }
	   /*
	   if(incident.approval_status == "pending"){
	      setExitType(BAD_VALIDATION_EXIT);
	      setErrorMsg(lib.ScAPI_Util.getMessage(142));
	      return;	   	   
	   }*/
	   
	    var operatorObj = getCurrentOperator();
	    var operatorContactName = operatorObj.contact_name;
	   
	    var operator = funcs.operator();
	    var ownername = incident['opened.by'];
	    var contact = incident['contact.name'];
	    var callbackContact = incident['callback.contact'];
	    // It need to compare the owner name with the operator name or the user full name according to QCCR73278.
	    if( ownername != operator && ownername != vars.$lo_ufname && operatorContactName != contact && operatorContactName != callbackContact){
	      setExitType(BAD_VALIDATION_EXIT);
	      setErrorMsg(lib.ScAPI_Util.getMessage(137));
	      return;
	    }
	    //The value of comments is stored in $api.update and will be handled in Process sd.esscloseme and ess.sm.close
	    //incident['resolution'] = new Array(comments);
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


//This function is to resubmit a request
function resubmitRequest() {
	getTimeZone();
    setExitType(NORMAL_EXIT);
	
    var File = lib.DBUtils.File;
    var requestID = vars.$L_file['incident.id'];
    var updateAction = vars.$L_file['other'];
    var deleteAttachmentIds = vars.$L_file['room'];
    vars.$L_file['room'] = null;
   
    var incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');
    
    // Added for support SRC Tailoring for SM 9.4
    var srcXml = vars['$L.file']['variable2'];
	vars['$L.file']['variable2'] = null; // set to null
	
    if(incidents == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }

    if(updateAction == null) {
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(lib.ScAPI_Util.getMessage(130));
		return;
    } else if (incidents.scFile['category'] != "service catalog") {
        setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(lib.ScAPI_Util.getMessage(133, [incidents.scFile['category']]));
		return;
    } else if (incidents.scFile['approval.status'] == "approved") {
        setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(lib.ScAPI_Util.getMessage(132));
		return;
    }
    
    var ess_temp = vars.$G_ess;
    
    vars.$sm_activity = "Cart Edited";
    vars.$G_ess = true;
    vars.$update_action = new Array(updateAction);
    vars.$update_action_ess = new Array(updateAction);
    var obj   = new SCFile('Object');
    obj.doSelect('file.name="incidents"');
    if(obj['workflowLocation'] != null){
       vars.$G_bg_activity_text = new Array(updateAction);
	}
    var returnCode;
    vars.$update_incident_ws = true;
	incidents.each(function(incident) {
		var fieldsInXml = [];
		if (srcXml && fillFileFromXml(incident, srcXml, fieldsInXml) == false) {
			setExitType(BAD_VALIDATION_EXIT);
			return;
		}
		setContact(incident,fieldsInXml); 
		setCallBack(incident,fieldsInXml);
		conjunctionContactAndCallBack(incident, fieldsInXml);
		var company = vars['$lo.operator']['company'];
		if (company == null) {
			company = 'DEFAULT';
		}
		if (svcSrcValidation(srcXml, "resubmit", lib.ScAPI_svcCatApprovals.getServiceType(incident), company)) {
			if (deleteAttachmentIds) {
				var delteAttachmentIdsArray = deleteAttachmentIds.split(";");
				var i;
				for (i = 0; i<delteAttachmentIdsArray.length; i++) {
					incident.deleteAttachment(delteAttachmentIdsArray[i]);
				}
			}
			if(obj['workflowLocation'] != null){
			 returnCode = incident.doAction('resubmit');
			}
			else {
			returnCode = incident.doAction('save');
			}
		}
		else{					   
		   setExitType(BAD_VALIDATION_EXIT);		       
		   return;
		}	
	});
	
	if(returnCode == RC_SUCCESS && obj['workflowLocation'] == null) {
		incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');
		incidents.each(function(incident) {
			returnCode = incident.doAction('resubmit');
		});
	}
	
	vars.$update_incident_ws = false;
	vars.$G_ess = ess_temp;
	
	if(returnCode != RC_SUCCESS) {
	  if(returnCode == 3) { 
	    setExitType(CURRENTRECORD_LOCKED);
	  }
	  else {       
		setExitType(BAD_VALIDATION_EXIT);
	  }
	}
}

//This function is to update a request, only description, callback.type, urgency, service fields are allowd to update.
function updateRequest() {
	getTimeZone();
	setExitType(NORMAL_EXIT);

	// Added for support SRC Tailoring for SM 9.4
	var srcXml = vars['$L.file']['variable2'];
	vars['$L.file']['variable2'] = null; // set to null

    var File = lib.DBUtils.File;
    var requestID = vars.$L_file['incident.id'];
    var incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');
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
				var fieldsInXml = [];
				if (srcXml && fillFileFromXml(incident, srcXml, fieldsInXml) == false)
	  			{
	      			setExitType(BAD_VALIDATION_EXIT);
			        return;
	  			}
	  			setContact(incident,fieldsInXml); 
		        setCallBack(incident,fieldsInXml);
				conjunctionContactAndCallBack(incident, fieldsInXml);
				vars.$update_action = new Array(vars.$L_file['other']);
				var obj   = new SCFile('Object');
      			obj.doSelect('file.name="incidents"');
      			if(obj['workflowLocation'] != null){
            		vars.$G_bg_activity_text = vars.$update_action;
				}
				vars['$update.incident.ws'] = true;
				var company = vars['$lo.operator']['company'];
				if (company == null) {
					company = 'DEFAULT';
				}
				if (svcSrcValidation(srcXml, "resubmit", lib.ScAPI_svcCatApprovals.getServiceType(incident), company))
				{
 				  var errorMsg = setAffectedItem(incident, true);
				  if (errorMsg) {
					  setErrorMsg(errorMsg);
					  setExitType(BAD_VALIDATION_EXIT);
					  return;
				  }
					returnCode = incident.doAction('save');
					vars['$update.incident.ws'] = false;
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
				}
				else{					   
		             setExitType(BAD_VALIDATION_EXIT);		               
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
		 if (returnCode) {
		     setErrorMsg(RCtoString(returnCode));
		 }
      }	
	}
	vars.$G_ess = temp_ess;
}

function createInteractionComment() {
	getTimeZone();
	setExitType(NORMAL_EXIT);
    
    var File = lib.DBUtils.File;
    var file = vars['$L.file'];
    var id = file['unique.key'];
    var fileName = file['file.name'];
    var approvalType = file['name'];
    var component = file['component'];
    if(component == null) {
    	component = 'NULL';
    }
    else {
    	component = '"' + component + '"';
    }
    
    var comments = file['comments'];
    var originalUpdateTime = file['sysmodtime']; 
     //check if approvals are up2date or not, if not up2date, set Exit Type:INCIDENT_NOT_UPDATE2DATE with returnCode:999, then return;
    if (_getIfApprovalModLaterThanTime( id, fileName,approvalType,originalUpdateTime,component)){
       setExitType(CURRENTRECORD_NOT_UPDATE2DATE);
       return;
    }
    
    var sdID = id;

    if (fileName == "svcCartItem") {
    	var svcCartItem = new File("svcCartItem").getRecords('cartItemId="' + id + '"');
    	if(svcCartItem == null) {  
			setExitType(NO_RECORD_EXIT);
			return;
    	}
    	sdID = svcCartItem.scFile.sdID;
    }
    
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
	
	var ApprovalFile = new SCFile("Approval", SCFILE_READONLY);
    var fields1 = ["sysmodtime"];
    ApprovalFile.setFields(fields1);
    var query = 'unique.key="' + id + '" and file.name="' + fileName + '" and name="' + approvalType + '" and component=' + component;
    var result = ApprovalFile.doSelect(query);
    if (result == RC_SUCCESS) {
        file['sysmodtime'] = ApprovalFile.sysmodtime;
    }
    
	if(returnCode != RC_SUCCESS) {
	  if(returnCode == 3) {
	  	setExitType(CURRENTRECORD_LOCKED);
	  }
	  else{   
	  	setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(RCtoString(returnCode));
	  }
	}
	vars.$G_ess = temp_ess;
}

function _checkPermission(interaction) {
	if (interaction.open == 'Closed') {
		throw lib.ScAPI_Util.getMessage(131);
		//The Request has been closed.
//		return false;
	}
	return true;
}

function getTimeZone() {
	if (vars.$lo_time_zone != null) {
		return;
	}
	var operator = getCurrentOperator();
	if (operator['time.zone'] != null){
		vars.$lo_time_zone = operator['time.zone'];
		return;
	}
	var info = lib.ScAPI_Util.getSystemInfo();
	vars.$lo_time_zone = info['time.zone'];
	
}

/* Parse xml and write data to the given file, only support data type (1,2,3,4)
 * @Return: boolean
 */
function fillFileFromXml(lFile, srcXml, fieldsInXml)
{
    var bSucc = true;
    
    var xml = new xmlEx(srcXml);
    if (xml.isDocumentElement() && xml.getName() == 'fields')
    {
        var nodes = xml.getAllChildren();
        var nodeName, nodeType, nodeText;
        var i;
        for (i in nodes)
        {
            if (nodes[i].getName() != 'field') {
            	continue; // Only process node with name field
            }
            
            nodeName = nodes[i].getAttribute('name');
            if (fieldsInXml) {
            	fieldsInXml.push(nodeName);
            }
            if (nodeName == null || nodeName == "") {
            	continue; // ignore null or blank name, this will cause js exception
            }
            nodeType = nodes[i].getAttribute('fieldType');
            nodeText = nodes[i].getValue();
            if (nodeText == "") {
            	nodeText = null;
            }

            if (nodeType == 'character')
            {
            	if (nodeName == "description") {
            		lFile[nodeName] = [''];
            		lFile[nodeName][0] = nodeText;
            	} else {
            		lFile[nodeName] = nodeText;
            	}                
            }
            else if (nodeType == 'number')
            {
                lFile[nodeName] = funcs.val(nodeText, 1);
            }
            else if (nodeType == 'logical')
            {
                lFile[nodeName] = funcs.val(nodeText, 4);
            }
            else if (nodeType == 'datetime')
            {
            	var value = new XMLDate(nodeText).getDatum();
            	if ( nodeText == null || nodeText == '') {
                	lFile[nodeName] = null;
                } else if (funcs.type(value) == 3) {
                    lFile[nodeName] = value;
                } else { // Cannot convert this string to sm datetime
                    bSucc = false;
                    setErrorMsg(lib.ScAPI_Util.getMessage(171, [nodeName]));
                    break;
                }
            }
        }
    }
    else
    {
        setErrorMsg(lib.ScAPI_Util.getMessage(170));
        bSucc = false;
    }
    return bSucc;
}

function svcSrcValidation(SvcSrcXML, operation, screenType, company)
{      
	var mRead, mUpdate, mCreate;
	mRead = [];
	mUpdate = [];
	mCreate = [];
	mDefault = [];
	mMultiline = [];
	mDateType = [];
	mLookUpTable = [];
	mLookUpField = [];
	mMandatory = [];
	mLabel = [];
	var readIdx,createIdx,updateIdx;
	readIdx=createIdx=updateIdx=0;
	
	var srcConfig = new SCFile( "svcSrcConfig", SCFILE_READONLY );
	srcConfig.setFields(["options"]);
	var rcSrcConfig = srcConfig.doSelect("screen.type=\"" + screenType + "\" and company=\"" + company + "\"");
	//if the checkout panel not configured, return the default one.
	if (rcSrcConfig != RC_SUCCESS) {
		srcConfig.doSelect("screen.type=\"" + screenType + "\" and company=\"DEFAULT\"");
	}
    
    var nodeIndex;
    
	var xml = new xmlEx(srcConfig['options']);
			
	if (xml.isDocumentElement() && xml.getName() == 'sections') {
		var nodes = xml.getAllChildren();
		var nodeName, nodeType, nodeText;
		for (nodeIndex in nodes)
		{
			var child = nodes[nodeIndex].getAllChildren();
			var childIndex;
			for (childIndex in child)
			{
				nodeName = child[childIndex].getAttribute('field');
								
				nodeModifiability = child[childIndex].getAttribute('modifiability');
				if ( nodeModifiability == "create") { 				          
		  			mCreate[createIdx++] = nodeName;
				}
				else if (nodeModifiability == "view") {  				                  
					mRead[readIdx++] = nodeName;
				} 
				else if ( nodeModifiability == "update") { 				               
					mUpdate[updateIdx++] = nodeName;
				}
				var defaultValue = child[childIndex].getAttribute('defaultValue');
				if (defaultValue != null) {
					mDefault[nodeName] = defaultValue;
				}
				var isMultiline = child[childIndex].getAttribute('multiline');
				mMultiline[nodeName] = isMultiline;
				if (mMultiline[nodeName] == null){
					mMultiline[nodeName] = "false";
				}
				var dateType = child[childIndex].getAttribute('fieldType');
				mDateType[nodeName] = dateType;
				var lookUpTable = child[childIndex].getAttribute('lookUpTable');
				var lookUpField = child[childIndex].getAttribute('lookUpField');
				if (lookUpTable) {
					mLookUpTable[nodeName] = lookUpTable;
					mLookUpField[nodeName] = lookUpField;
				}
				var mandatory = child[childIndex].getAttribute("mandatory");
				
				if (mandatory=="true") {
					mMandatory[nodeName] = mandatory;
				}
				
				var labelId = child[childIndex].getAttribute("labelId");
				var label = child[childIndex].getAttribute("label");
				if (labelId) {
					mLabel[nodeName] = funcs.scmsg(labelId, "srcconfig");
				} else {
					mLabel[nodeName] = label;
				}
			} // loop child
		} //loop nodes 
	} //Endif 'sections'
			            
	xml = new xmlEx(SvcSrcXML);
	var retCode = true;
    if (xml.isDocumentElement() && xml.getName() == 'fields')
    {
    	var nodes = xml.getAllChildren();
        var nodeName, nodeType, nodeText;
        for (nodeIndex in nodes)
        {
            if (nodes[nodeIndex].getName() != 'field') {
            	continue; // Only process node with name field
            }
            
            nodeName = nodes[nodeIndex].getAttribute('name');
            
            if (nodeName == null || nodeName == "") {
            	continue; // ignore null or blank name, this will cause js exception
            }
            
            nodeText = nodes[nodeIndex].getValue();
            
            if (mMandatory[nodeName]) {
            	if (nodeText == null || nodeText == "") {
            		var label = mLabel[nodeName];
            		var msg = funcs.scmsg(117, "ScriptLibrary", [label]);
            		setErrorMsg(msg);
            		return false;
            	}
            }
            
            if (nodeText != null && nodeText != "" && mLookUpTable[nodeName]) {
            	if (!checkLookupTableForCheckoutPanel(mLookUpField[nodeName], mLookUpTable[nodeName], nodeText)) {
            	
            		return false;
            	}
            }
            
            if (operation == "submit")
            {
            	//if new value is not equal to default value, it is not allowed to fill
            	var defaultValue = funcs.nullsub(mDefault[nodeName], "");
            	var isChanged = false;
            	if (mMultiline[nodeName] == "true" && defaultValue != null && defaultValue != 'undefined') {
            		isChanged = standardLineBreaker(defaultValue) != standardLineBreaker(nodeText);
            	} else {
            		isChanged = defaultValue != nodeText;
            	}
            	if ((defaultValue == null || defaultValue == 'undefined' || isChanged) && mDateType[nodeName] != 'datetime'){
   	            	//Check if present in Read and Update array
   	            	
	   	            retCode = svcSrcValidationCheck(mRead, nodeName,"view");
	   	        }
            } 
            else if (operation == "resubmit") {            
	            //Check if present in Read and Create array
   	            retCode = svcSrcValidationCheck(mRead, nodeName,"view") && 
   	            	(svcSrcValidationCheck(mCreate, nodeName,"create"));
   	            	   	            	
            }
            if (!retCode) {
            	break;
            }
        }
    }

    if (!retCode) {
    	setExitType(BAD_VALIDATION_EXIT);
    }
    return retCode;
}


function checkLookupTableForCheckoutPanel( field, table, value)
{
	if ( field != null && table != null && 
			     field != "" && table != "" && value != null && value !="")
	{
		var file = new SCFile( table );
		var sql = field + " = \"" + value + "\"";	
			
		
		if ( file.doSelect( sql ) == RC_SUCCESS ) {
			return true;
		}
		else
		{
			var fDbdict=lib.dbdictHelper.initDbdictFile(table);
			var fieldType= lib.dbdictHelper.getFieldType(fDbdict,field);
			if(fieldType==8)
			{
				return false; 
			}
			var msg = funcs.scmsg(118, "ScriptLibrary", [value, table]);
			setErrorMsg(msg);
			return false;
		}
	}
}

function svcSrcValidationCheck(action, nodeName, param1)
{
	var index;
	for (index = 0; index < action.length; index++)
	{
	  if (action[index] == nodeName)
		{
			if (param1 == "view") {
			setErrorMsg(lib.ScAPI_Util.getMessage(181, [nodeName]));
			} else if (param1 == "create") {
			setErrorMsg(lib.ScAPI_Util.getMessage(182, [nodeName]));
			}
			return false;
		}
	}
	return true;
}

/**
*This function is to replace the different line breaker to the starndard Windows pattern. \r\n
*/
function standardLineBreaker(s1){
	return s1.replace(/(\r\n)|\n|\r/ig, "\r\n");
}

/**
*This function is to implement the SRC API:getlocksvccatinteraction
*/
function checkLockbeforeUpdateRequest(){

   setExitType(NORMAL_EXIT);
   var File = lib.DBUtils.File;
   var requestID = vars.$L_file['incident.id'];
   var incidents = new File('incidents').getRecords('incident.id="' + requestID + '"');
    if(incidents == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }
   var obj   = new SCFile('Object');	
   obj.doSelect('file.name="incidents"');
   
   var unique = obj['unique.field'];
   
   if (funcs.type(unique)==lib.DataTypeConst.typeArray()) {
       unique=funcs.denull(unique);
   }
   var unique_string = "";
   var index, length = unique.length();
   for (index = 0; index < length; index++){
	
   unique_string = unique_string + vars['$L.file'][unique[index]];
   }
   
   if (unique_string == null || unique_string == ""){
	  setExitType(BAD_VALIDATION_EXIT);
	  
	  return;
	}
   var lock_name="incidents;"+unique_string;
   if(lock_name != "" && lock_name != null) {
      vars['$L.file']['other'] = funcs.get_lock_owner(lock_name); 
   }
   if(vars['$L.file']['other'] != null && vars['$L.file']['other'] != "")
   {
      setExitType(CURRENTRECORD_LOCKED);      
      setErrorMsg(lib.ScAPI_Util.getMessage(188, [funcs.nullsub(vars['$L.file']['other'], "unknown user/task")]));
	  return;
   }

}