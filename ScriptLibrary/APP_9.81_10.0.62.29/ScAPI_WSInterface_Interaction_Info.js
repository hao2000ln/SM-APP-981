var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_Interaction_Info");

var select = lib.ScAPI_RAD._select;
var fun = system.functions;
var queryBuilder = lib.ScAPI_RAD._queryBuilder;

var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var getDisplayNameByLogicalName = lib.ScAPI_Util.getDisplayNameByLogicalName;
var defaultCurrency; // global variable
var tod = lib.ScAPI_RAD._tod;
var getDigitAfterDecimal = lib.ScAPI_Util.getDigitAfterDecimal;
var getRecurringCostInfo = lib.ScAPI_WSInterface_Interaction_Inbox.getRecurringCostInfo;
var _getInteractionSQLByOperator = lib.ScAPI_WSInterface_Interaction_Inbox._getInteractionSQL;

function getInteractionInfo(){
	return _getInteractionInfo(false);
}

function getAllInteractionInfo(){
	return _getInteractionInfo(true);
}

function _getInteractionInfo(isAll){    
    setExitType(BAD_VALIDATION_EXIT);
    
    var	oper = getCurrentOperator();
    defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    
    var company = vars['$lo.operator']['company'];
	if (company == null) company = 'DEFAULT';
	var configs = lib.ScAPI_svcCatApprovals.getAllSrcConfig(company);
    
    var file = vars['$L.file'];
    var id = file['incident.id'];
    
    if(isAll) {
    	var query = _getFullInteractionSQL(id);
    } else {
    	var query = _getInteractionSQL(id, oper.name);
    }
    
    var fields  = ['severity', 'open.time', 'opened.by'
    			   //, 'description'
    			   , 'opened.by.uid','affected.item', 'open', 'callback.type'
                   , 'category', 'priority.code', 'subcategory', 'product.type', 'resolution.code', 'callback.contact'
                   , 'needed.by.time', 'approval.status', 'cartId'
                   //, 'title'
                   , 'bRequestOnBehalf','contact.fullname','callback.contact.fullname'
                   , 'owner.name', 'callback.type','svc.cost',
                   'contact.name','logical.name','other','source.service','resolution'
                  ];
    if (configs != null){ 
        for (var config in configs){
            var configFields = configs[config]["fields"];
            if (configFields != null){
                for (var j = 0; j < system.functions.lng(configFields); j++ ){
                    if(!lib.ArrayUtil.contains(fields,configFields[j])){
                        fields[system.functions.lng(fields)] = configFields[j]; 
                    }
                }
            }
        }
    }     
   
	var incident = select("incidents", query, fields);
        
    if(incident == null) {             
        var incident = select("incidents", _getInteractionApprovalSQL(id), fields);
    }
   
    if(incident == null) {             
        var incident = select("incidents", _getCartItemApprovalSQL(id), fields);
    }
    
    if (incident != null){
        _setToFile(incident, configs);
        var tableAccess = new SCDatum(system.vars.$G_sm_environment.tableAccess);
        var obj   = new SCFile('Object');
	
	    obj.doSelect('file.name="incidents"');
	    	    
	   // if(lib.ProcessDesignerEnablement.isServicedeskEnabled())
	   // {
	    // lib.tableAccess.setTableAccess(file);
	   // }
	  //  else
         lib.tableAccess.setAccessVars(file,tableAccess,obj,true);
        
     
        vars.$L_file['vendor'] = system.functions.str(vars.$L_tableAccess_update);
        if(incident['open']=="Closed")
           vars.$L_file['room'] = "false"
        else        
           vars.$L_file['room'] = system.functions.str(vars.$L_tableAccess_close);	 
    
    } else {
    	setExitType(NO_RECORD_EXIT);
    	return;
	}
    
    
    setExitType(NORMAL_EXIT);
    return;
}


function _getInteractionApprovalSQL(id){
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$L_groups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'incidents');
    return 'select * from incidents a inner join Approval b on (a.incident.id=b.unique.key) where b.current.pending.groups isin $L.groups and a.incident.id="'+id+'"';   
}

function _getCartItemApprovalSQL(id){
	var dbtype = system.functions.dbdict_helper('db.type');
	if(dbtype=='postgresql'){
		return _getCartItemApprovalSQLForPostgres(id);
	}
	
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$L_groups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'incidents');    
    var sql = 'select * from incidents a inner join svcCartItem c on (a.incident.id=c.sdID) inner join Approval b on (c.cartItemId=b.unique.key and b.file.name="svcCartItem") where b.current.pending.groups isin $L.groups and a.incident.id="'+id+'"';
    return sql;
}

function _getCartItemApprovalSQLForPostgres(id){
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$L_groups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'incidents');   
     
    var sql = 'select c.cartItemId from incidents a inner join svcCartItem c on (a.incident.id=c.sdID) where a.incident.id="'+id+'"';
    var itemList = [];
    lib.c.$('incidents', SCFILE_READONLY).select(sql).iterate(function(item){itemList.push(''+item[0])});
   	vars.$L_cartItemForApproval = itemList;
   	var sqlApproval = 'unique.key isin $L.cartItemForApproval and file.name="svcCartItem" and current.pending.groups isin $L.groups';
   	
   	var foundApproval = false;
   	lib.c.$('Approval', SCFILE_READONLY).select(sqlApproval).iterate(function(item){foundApproval=true});
   	if(foundApproval) {
   		return 'incident.id="'+id+'"';
   	} else {
   		return 'false';
   	}
}

function _getInteractionSQL(id, loginName){
    var sql = "incident.id = \"%s\" and (alternate.contact=$lo.contact.name or contact.name=$lo.contact.name or callback.contact=$lo.contact.name or opened.by.uid = \"%s\")";
    return queryBuilder(sql, [id, loginName]);
}

function _getFullInteractionSQL(id){
    var sql = "incident.id = \"%s\"";//   and (alternate.contact=$lo.contact.name or contact.name=$lo.contact.name or callback.contact=$lo.contact.name or opened.by.uid = \"%s\")";
    return queryBuilder(sql, [id]);
}

function _setToFile(incident, configs){
    var serviceType = null;
    if (incident['category'] == 'service catalog') {
        serviceType = 'service catalog';
    } else { // if category in not "service catalog", determine its type need to know whether it related to one cart
        if (incident['source.service'] == 'support catalog') 
            serviceType = 'support catalog';
        else 
            serviceType = 'self-service';
    }
    vars.$L_file['user.type'] = serviceType;
    var configFields = null;
	if (configs != null){
	    if (configs[serviceType] != undefined && configs[serviceType] != null && configs[serviceType].fields != null){	         
	         var xml = lib.ScAPI_WSInterface_Interaction_Inbox.buildXmlFromFile(incident, configs[serviceType].fields);
	         //SET IN WSDL ServiceCatalogAPI.InteractionInfo	        
	         vars.$L_file['variable3'] = xml;	         
	    }
    }
    

    vars.$L_file['contact.name'] = incident['contact.name'];
    vars.$L_file['severity'] = incident['severity'];
    vars.$L_file['open.time'] = incident['open.time'];
    vars.$L_file['opened.by'] = incident['opened.by.uid'];
    
    
    var desc = "";
	for (var j = 0; j < incident['description'].length(); j++){
		if (incident['description'][j] != null){
			if (j == 0){
				desc = incident['description'][j];
			} else {
				desc = desc + "\n" + incident['description'][j];
			}
		} else {
			if (j!=0){
				desc = desc + "\n";
			}
		}
	}
	
   var solution = "";
   for (var j = 0; j < incident['resolution'].length(); j++){
		if (incident['resolution'][j] != null){
			if (j == 0){
				solution = incident['resolution'][j];
			} else {
				solution = solution + "\n" + incident['resolution'][j];
			}
		} else {
			if (j!=0){
				solution = solution + "\n";
			}
		}
	}	
	 //SET IN WSDL ServiceCatalogAPI.InteractionInfo   
    vars.$L_file['fax'] = desc;
    vars.$L_file['location'] = solution;
    vars.$L_file['affected.item'] = incident['affected.item'];
    vars.$L_file['open'] = incident['open'];
    vars.$L_file['callback.type'] = incident['callback.type'];
    vars.$L_file['category'] = incident['category'];
    //TODO ???
    vars.$L_file['type'] = incident['type'];
    vars.$L_file['priority.code'] = incident['priority.code'];
    vars.$L_file['subcategory'] = incident['subcategory'];
    vars.$L_file['product.type'] = incident['product.type'];
    vars.$L_file['resolution.code'] = incident['resolution.code'];
    vars.$L_file['callback.contact'] = incident['callback.contact'];
    vars.$L_file['needed.by.time'] = incident['needed.by.time'];
    vars.$L_file['approval.status'] = incident['approval.status'];
    
	var	oper = getCurrentOperator();	  
    var currency = oper.display_currency_code || vars.$G_root_currency;
    //SET IN WSDL ServiceCatalogAPI.InteractionInfo
    vars.$L_file['variable1'] = currency;
    vars.$L_file['svc.cost'] = incident['svc.cost'];
	
	if (incident['contact.fullname'] == null){
		var tmpContact = lib.ScAPI_Util.getContactFields(incident['contact.name'], ['full.name']);
		vars.$L_file['contact.fullname'] = tmpContact['full.name'];
	} else {
		vars.$L_file['contact.fullname'] = incident['contact.fullname'];
	}
	if (incident['callback.contact.fullname'] == null){
		var tmpContact = lib.ScAPI_Util.getContactFields(incident['callback.contact'], ['full.name']);
		vars.$L_file['callback.contact.fullname'] = tmpContact['full.name'];
	} else {
		vars.$L_file['callback.contact.fullname'] = incident['callback.contact.fullname'];
	}
	
    vars.$L_file['cartId'] = incident['cartId'];
    vars.$L_file['logical.name'] = incident['logical.name'];
    vars.$L_file['title'] = incident['title'];
    vars.$L_file['bRequestOnBehalf'] = incident['bRequestOnBehalf'];
    var contactValue = lib.ScAPI_Util.getContactValue(incident['callback.contact'], incident['callback.type'], incident['other']);
    //SET IN WSDL ServiceCatalogAPI.InteractionInfo
    vars.$L_file['variable2'] = contactValue;
 
    vars.$L_file['owner.name'] = incident['owner.name'];    

    setOwnerFullName(incident['owner.name']);
    setOpenByFullName(incident['opened.by.uid']);
}

function setOwnerFullName(ownername){
    var oper = select("operator", "name=\"" + ownername + "\"", ['full.name']);
    if (oper != null){
        //SET IN WSDL ServiceCatalogAPI.InteractionInfo
        vars.$L_file['floor'] = oper['full.name'];
    }
}

function setOpenByFullName(ownername){
    var oper = select("operator", "name=\"" + ownername + "\"", ['full.name']);
    if (oper != null){
        //SET IN WSDL ServiceCatalogAPI.InteractionInfo
        vars.$L_file['updated.by'] = oper['full.name'];
    }
}

function getInteractionCostsInfo() {
	setExitType(BAD_VALIDATION_EXIT);
	var id = vars['$L.file']['incident.id'];
	var query = _getInteractionSQL(id);
    var fields  = ['cartId'];
    var incident = select("incidents", query, fields);
    if (incident != null){
        var recurring_Cost_Info = getRecurringCostInfo(incident['cartId']);
		if (recurring_Cost_Info != "") {
			vars['$L.file']['recurring.costs.info'] = recurring_Cost_Info;
		}
    } else {
    	setExitType(NO_RECORD_EXIT);
    	return;
	}
	setExitType(NORMAL_EXIT);
}

function getInteractionActivityInfo() {
	setExitType(BAD_VALIDATION_EXIT);
	var incidentId = vars['$L.file']['incident.id'];
	var oper;
	var operName = vars.$L_file["loginName"];
	if (operName != null){
		oper = select("operator", "name=\"" + operName + "\"");
		if (oper == null) { //The interaction owner is not valid.
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMsg(125)); 
			return;
		}
	} else {
		oper = getCurrentOperator();
		vars.$L_file["loginName"] = oper['name'];
	}
		
	var sql = _getInteractionSQLByOperator(oper) + " and incident.id = \"" + incidentId + "\"";
	
	var incident = new SCFile("incidents", SCFILE_READONLY);
	incident.setFields(['opened.by.uid', 'contact.name']);
	vars.$L_file["has.new.activity"] = false;
    var result = incident.doSelect(sql);
    if (result == RC_SUCCESS) {
    	if (oper['name'] == incident['opened.by.uid']) {
    		vars.$L_file["has.new.activity"] = hasNewActivity(incidentId, oper['name'], incident['opened.by.uid']);
    	}
    }
    setExitType(NORMAL_EXIT);
}


function hasNewActivity(incidentId, requestor, openedByUid) {
	var sql2 = "operator~=\"" + openedByUid + "\" "+ " and cust.visible=true and unread=true and number=\"" + incidentId + "\"";
	var file = new SCFile("activityservicemgt");
    var result = file.doSelect(sql2);
    var hasNew = false;
	if (result == RC_SUCCESS) {
		hasNew = true;
	}
	return hasNew;
}