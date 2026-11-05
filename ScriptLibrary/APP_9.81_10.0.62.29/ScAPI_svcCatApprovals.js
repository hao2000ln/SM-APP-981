/** @fileoverview svcCatApprovals - contains functions used by the Service Catalog module
*   @author Levin
*/
var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var CURRENTRECORD_NOT_UPDATE2DATE = lib.ScAPI_Constants.CURRENTRECORD_NOT_UPDATE2DATE();
var CURRENTRECORD_LOCKED = lib.ScAPI_Constants.CURRENTRECORD_LOCKED();
var getQuoteFileName = lib.ScAPI_Util.getQuoteFileName;
var getRequestFileNames = lib.ScAPI_Util.getRequestFileNames;
var getChangeGroups = lib.ScAPI_Util.getChangeGroups;
var getQuoteGroups = lib.ScAPI_Util.getQuoteGroups;
var getRequestGroups = lib.ScAPI_Util.getRequestGroups;
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var us_convert_currency = lib.ScAPI_RAD.us_convert_currency;
var getDigitAfterDecimal = lib.ScAPI_Util.getDigitAfterDecimal;
var tod = lib.ScAPI_RAD._tod;
var _buildXmlFromFile = lib.ScAPI_WSInterface_Interaction_Inbox.buildXmlFromFile;
var queryBuilder = lib.ScAPI_RAD._queryBuilder;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;

var _createNode = lib.ScAPI_WSInterface_svcCatalogGather._createNode;

var scmsg = funcs.scmsg;
var _getIfApprovalModLaterThanTime = lib.ScAPI_Util.getIfApprovalModLaterThanTime;
var INCIDENT_TABLE = "ti";
var CARTITEM_TABLE = "tc";
var arrayIndexOf = lib.ApprovalDelegationGroups.arrayIndexOf;
var log = lib.ScAPI_Logger.log("ScAPI_svcCatApprovals");

function getFilterCondtion(file,query) {
	var newquery = "";
	keyset = file['approvals'];
	var i, rowcount = keyset.length();
	for(i = 0; i < rowcount; i++){
		var oneapprove = "";
		var filename = keyset[i]['file.name'];
		var name1 = keyset[i]['name'];
		var uniquekey = keyset[i]['unique.key'];
		var component = keyset[i]['component'];
		if(filename !=null && filename !=""){
			oneapprove = oneapprove + "(file.name=\""+filename +"\"";
		}        
		if(name1 !=null && name1 !=""){
			if(oneapprove.length > 0){
				oneapprove = oneapprove + " and name=\""+name1+"\""; 
			}
			else{
				oneapprove = oneapprove + "(name=\""+name1+"\""; 
			}
		}        
		if(uniquekey !=null && uniquekey !=""){
			if(oneapprove.length > 0){
				oneapprove = oneapprove + " and unique.key=\""+uniquekey+"\"";
			}
			else{
				oneapprove = oneapprove + "(unique.key=\""+uniquekey+"\"";
			}
		}
		if(component !=null && component !=""){
			if(oneapprove.length > 0){
				oneapprove = oneapprove + " and component=\""+component+"\"";
			}
			else{
				oneapprove = oneapprove + "(component=\""+component+"\"";
			}
		}
		if(oneapprove.length > 0){
			oneapprove = oneapprove +") or ";
		}
		newquery = newquery + oneapprove;
	}
	if(newquery.length > 0){
		newquery=newquery.substring(0,newquery.length - 3);
		query = "("+query+") and ("+ newquery +")";
	}
	if (file['in.id.string']) {
		query = '(' + query + ') and unique.key isin {' + file['in.id.string'] + '}';
	}
	return query;
}

function OperatorFullnameBroker () {
	this.cache = {};
}

OperatorFullnameBroker.prototype = {
	getFullnameByContactName: function (contactName) {
		if (!this.cache[contactName]) {
			if (!this.populateCache(contactName, 'contact.name')){
				return null;
			}
		}
		return this.cache[contactName];
	},
	
	populateCache: function (value, field) {
		var db = new SCFile('operator', SCFILE_READONLY);
		db.setFields(["full.name"]);
		if (RC_SUCCESS != db.doSelect(field + '="' + value + '"')) {
			return false;
		}
		this.cache[value] = db['full.name'];
		return true;
	}
};


function getApprovalInbox() {
    setExitType(NORMAL_EXIT);

    var File = lib.DBUtils.File;
    
	var currentOperator = vars['$lo.operator'];
	var defaultCurrency = currentOperator['display.currency.code'] || vars['$G.root.currency'];
	
	var digitAfterDecimal = getDigitAfterDecimal(defaultCurrency);
    
    var approvalModule = vars['$L.file']['approval.module'];
    
    var dateFrom = null;
    if (vars['$L.file']['date.from'] != null){
	    dateFrom = new XMLDate(vars['$L.file']['date.from']).getDatum().getText();
    }
    var dateTo = null;
    if (vars['$L.file']['date.to'] != null){
	    dateTo = new XMLDate(vars['$L.file']['date.to']).getDatum().getText();
    }
    
    try{
	    // Generate a query
    	var query = generateSRCApprovalInboxSql(approvalModule, dateFrom, dateTo);
    } catch (ex) {
    	setExitType(BAD_VALIDATION_EXIT);
    	setErrorMsg(ex);
    	return;
    }
    var company = currentOperator['company'];
    if (company == null) {
        company = 'DEFAULT';
    }
    
    // Prepare for delegated determination
    var ownSql = getApprovalInboxOwnSql();
    var delegateSql = lib.ApprovalDelegationGroups.getDelegationSql();
    var isDelegatedApproval = function(lApproval) // Return whether it is a delegated approval
    {
        // If no delegattion definition, always return NO
        if (delegateSql == '') {
            return 'NO';
        }
        
        var delegated;
        if (funcs.evaluate_query(ownSql, lApproval) == true) {
            delegated = 'NO';
        }
        else {
            delegated = 'YES';
        }
        
        return delegated;
    };

	//No need to return the custom fields
	
    var keyfields  = ['file.name','name','unique.key','component'];
    var fields  = ['file.name','name','unique.key','component','requested.by','sysmodtime'];
    var fieldsi = ['title', 'contact.name', 'category', 'cartId', 'svc.cost']; //incidents field
    var filedss = ['sdID','item.description','cost','requested.for','requested.for.fullname', 'recurring.cost', 'recurring.cost.interval']; //svcCartItem field
    var fieldsc = ['number', 'brief.description']; //cm3r field
    var fieldsq = ['number', 'brief.description', 'total.cost', 'requested.for']; //ocmq field
    var approvals = null;
    query = getFilterCondtion(vars['$L.file'],query);
	var sortableFields = {
		FileName: 'file.name',
		ApprovalType: 'name',
		UniqueKey: 'unique.key',
		Component: 'component',
		RequestedBy: 'requested.by',
		Date: 'sysmodtime'
	};
	var sortBy = sortableFields[vars['$L.file']['sortby']];

    var file = new File(
			'Approval', 
			//fields, 
			null,
			sortBy, 
			vars['$L.file']['orderby']
		);
	
	if (!vars['$L.file']['in.id.string']) {
		var start = vars['$L.file']['start'], 
			pagesize = vars['$L.file']['pagesize'];
		if (!vars['$L.file']['start']) {
			vars['$L.file']['start'] = 1;
		}
		if (!vars['$L.file']['pagesize']) {
			vars['$L.file']['pagesize'] = 10;
		}
		file.setPaging(vars['$L.file']['start'], vars['$L.file']['pagesize']);
	}
	
	var totalCount = lib.ScAPI_RAD._count('Approval', query);
	vars['$L.file']._count = totalCount;
	
	approvals = file.getRecords(query);
	
    if(approvals == null) {
        vars['$L.file']['approvals'] = null;
		setExitType(NO_RECORD_EXIT);
		return;
    }
    var count = 0;
    var keyscount = 0;
    keyscount = vars['$L.file']['approvals'].length();
    
    
	var ofb = new OperatorFullnameBroker();
	
	var ocmqFileName = getQuoteFileName();

	var requestFileNames = getRequestFileNames();
    var i;
    
	approvals.each(function(approval) {			
		for(i = 0; i < fields.length; i++) {
			vars['$L.file']['approvals'][count][fields[i]] = approval[fields[i]];
		}
		
		var requestRecords;
		
		// If it is a line item approval, set the parent ticket ID and item name(description).
		if(approval['file.name'] == 'svcCartItem') {
		
			var svcCartItemRecords = new File('svcCartItem', filedss).getRecords('cartItemId="' + approval['unique.key'] + '"');
			if(svcCartItemRecords != null) {
				var svcCartItemRecord = svcCartItemRecords.scFile;
				vars['$L.file']['approvals'][count]['price'] = svcCartItemRecord['cost'];
				vars['$L.file']['approvals'][count]['module'] = 'Service';
				vars['$L.file']['approvals'][count]['parent.ticket.id'] = svcCartItemRecord['sdID'];
				vars['$L.file']['approvals'][count]['item.name'] = svcCartItemRecord['item.description'];
				vars['$L.file']['approvals'][count]['requestedfor'] = svcCartItemRecord['requested.for'];
				vars['$L.file']['approvals'][count]['requested.for.fullname'] = svcCartItemRecord['requested.for.fullname'];
				if (svcCartItemRecord['recurring.cost']) {
					vars['$L.file']['approvals'][count]['recurring.costs.info'] = svcCartItemRecord['cartItemId']  + ":" + svcCartItemRecord['svcCatalogId'] + ":" + svcCartItemRecord['recurring.cost'] + ":" + svcCartItemRecord['recurring.cost.interval'];
				}
				
				// Give price and currency for line item and bundle.
				//remove currency conversion
				
				requestRecords = new File('incidents', fieldsi).getRecords('incident.id="' + svcCartItemRecord['sdID'] + '"');
				if(requestRecords != null) {
					requestRecords.each(function(requestRecord) {
						vars['$L.file']['approvals'][count]['request.title'] = requestRecord['title'];
						
						//Below 4 line add by Fei, zhi-chao on 2010-08-27
					});
				}
			}

		}
		
		// If it is a interaction approval, set the interaction title and description.
		if(approval['file.name'] == 'incidents') {
			requestRecords = _queryIncidents(approval['unique.key'], fieldsi, vars['$L.file']['include.recurring.cost']);
			if(requestRecords != null) {
				var svcCartItem_Recurring_Cost_Info = "";
				requestRecords.each(function(requestRecord) {
					vars['$L.file']['approvals'][count]['price'] = requestRecord['svc.cost'];
					vars['$L.file']['approvals'][count]['module'] = 'Service';
					vars['$L.file']['approvals'][count]['request.title'] = requestRecord['title'];
					
					vars['$L.file']['approvals'][count]['requestedfor'] = requestRecord['contact.name'];//add by Fei, Zhi-Chao on 2010-08-27
					vars['$L.file']['approvals'][count]['requested.for.fullname'] = ofb.getFullnameByContactName(requestRecord['contact.name']);
					if (requestRecord[CARTITEM_TABLE+'.recurring.cost']) {
						svcCartItem_Recurring_Cost_Info += requestRecord[CARTITEM_TABLE+'.cartItemId'] + ":" 
							+ requestRecord[CARTITEM_TABLE+'.svcCatalogId'] + ":" 
							+ requestRecord[CARTITEM_TABLE+'.recurring.cost'] + ":" 
							+ requestRecord[CARTITEM_TABLE+'.recurring.cost.interval'];
					}
					if (svcCartItem_Recurring_Cost_Info != "") {
						svcCartItem_Recurring_Cost_Info += ";";
					}
				});
				if (svcCartItem_Recurring_Cost_Info != "") {
					vars['$L.file']['approvals'][count]['recurring.costs.info'] = svcCartItem_Recurring_Cost_Info;
				}
			}
			
		}
	
		// If it is a change approval, retrieve change info
		if(approval['file.name'] == 'cm3r') {
			var changeRecords = new File('cm3r', fieldsc).getRecords('number="' + approval['unique.key'] + '"');
			if(changeRecords != null) {
				changeRecords.each(function(changeRecord) {
					vars['$L.file']['approvals'][count]['module'] = 'Change';
					vars['$L.file']['approvals'][count]['request.title'] = changeRecord['brief.description'];

				});
			}
		}
		
		// If it is a interaction approval, retrieve quote info.
		if (funcs.index(approval['file.name'], requestFileNames) > 0) {
		
			var quoteRecords = new File(approval['file.name'], fieldsq).getRecords('number="' + approval['unique.key'] + '"');
			if(quoteRecords != null) {
				quoteRecords.each(function(quoteRecord) {
					vars['$L.file']['approvals'][count]['price'] = quoteRecord['total.cost'];
					vars['$L.file']['approvals'][count]['module'] = 'Quote';
					vars['$L.file']['approvals'][count]['request.title'] = quoteRecord['brief.description'];
					
					vars['$L.file']['approvals'][count]['requestedfor'] = quoteRecord['requested.for'];
					vars['$L.file']['approvals'][count]['requested.for.fullname'] = ofb.getFullnameByContactName(quoteRecord['requested.for']);
					
				});
			}
			
		}
		
		// Is it a delegate approval
		var id = scmsg(approval['file.name'], 'tablename') + ' ' + approval['unique.key'];
		vars['$L.file']['approvals'][count]['record'] = id;
		vars['$L.file']['approvals'][count]['modtime'] = approval['sysmodtime'];
		vars['$L.file']['approvals'][count]['isDelegateApproval'] = isDelegatedApproval(approval);
		//add matched groups for 139800
		vars['$L.file']['approvals'][count]['matched.groups'] = getMatchedGroups(approvalModule,approval);	
		count++;
	});

	if(keyscount > 0 && keyscount > count) {
		for(i = count; i < keyscount; i++) {
			vars['$L.file']['approvals'][i] = null;
		}
	}
	
}

function getMatchedGroups(approvalModule,approval) // Return matched approval groups
{   
	var approval_groups= [];
	var matched_groups = [];
	var lOperator = vars['$lo.operator']['name'];
	var cm3rGroups = getChangeGroups();
	
    var smGroups   = vars['$G.sm.environment']['approval.groups'].toArray();
    if (funcs.index(lOperator, cm3rGroups) == 0) {
        cm3rGroups.push(lOperator);
    }
    
    if (funcs.index(lOperator, smGroups) == 0) {
        smGroups.push(lOperator);
    }	
	 
	if (approvalModule == null){
	    lib.ArrayUtil.addAllWithoutDuplicate(approval_groups, cm3rGroups);	  
	    lib.ArrayUtil.addAllWithoutDuplicate(approval_groups, smGroups);	  
	
	} else if (approvalModule == 'Change') {
	   
	    approval_groups = cm3rGroups;
	    
	} else if (approvalModule == 'Quote') {
	    var test;
	    var ocmqGroups;
	   
	    if (lib.ProcessDesignerEnablement.isRequestEnabled()) {
	   	    
    		var requestGroups = lib.ScAPI_Util.getRequestGroups();
    		
    		if (funcs.index(lOperator, requestGroups) == 0) {
    		    requestGroups.push(lOperator);
    		}
    		
        	approval_groups = requestGroups;
        	
        	if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
    		    ocmqGroups = getQuoteGroups();  
    			if (funcs.index(lOperator, ocmqGroups) == 0) {
    			    ocmqGroups.push(lOperator);
    			}
        		approval_groups = approval_groups + ocmqGroups;
        	}
        } else {
	        ocmqGroups = getQuoteGroups(); 
            if (funcs.index(lOperator, ocmqGroups) == 0) {
                ocmqGroups.push(lOperator);
            }		

    	    approval_groups = ocmqGroups;
        } 
	   
	} else if (approvalModule == 'Service'){	   
		approval_groups = smGroups;
	} 	
	
    approval_groups = lib.ApprovalDelegationGroups.addDelegateGroups( approval_groups, approval['file.name']);	
   
    var pending_groups = [];
    var future_groups = [];
       
    if(approval['current.pending.groups'] !=null ) {
	    pending_groups = approval['current.pending.groups'].toArray();
	}
	
	if(approval['future.groups'] != null ) {
	    future_groups = approval['future.groups'].toArray();
	}    
	    
    var i, length_array_groups = lib.ArrayUtil.length(approval_groups);
  
	for(i = 0; i < length_array_groups; i++) {
	
	    if(arrayIndexOf(pending_groups,approval_groups[i])>=0 ||  arrayIndexOf(future_groups,approval_groups[i])>=0 ){	   
		    matched_groups.push(approval_groups[i]);  
		}
	}
   	    
    return lib.JSON2.toJSON(matched_groups);
}
  
function _queryIncidents(incidentId, incident_fields, is_include_recurring_cost) {
	var File = lib.DBUtils.File;
	if (is_include_recurring_cost) {
		return new File('incidents').getRecords(_getIncidentsWithCartItemSQL(incidentId, incident_fields));
	} else {
		return new File('incidents', incident_fields).getRecords('incident.id="' + incidentId + '"');
	}
}

function _getIncidentsWithCartItemSQL(incidentId, incident_fields) {
    var i;
	var cartitem_fields = ['cartItemId', 'svcCatalogId', 'recurring.cost', 'recurring.cost.interval'];
 	var select_incident_phrase = "";
 	if (incident_fields) {
 		for (i=0; i<incident_fields.length;i++) {
	 		select_incident_phrase += INCIDENT_TABLE + "." + incident_fields[i] + ",";
	 	}
 	}
 	if (!select_incident_phrase) {
 		select_incident_phrase = INCIDENT_TABLE + ".*,";
 	}
 	var select_cartitem_phrase = "";
 	for (i=0; i<cartitem_fields.length; i++) {
 		select_cartitem_phrase += CARTITEM_TABLE + "." + cartitem_fields[i];
 		if (i<cartitem_fields.length-1) {
 			select_cartitem_phrase += ",";
 		}
 	}
 	var sql = "SELECT " + select_incident_phrase + " "
 		+ select_cartitem_phrase
 		+" FROM incidents "+ INCIDENT_TABLE
 		+ " left outer join "
 		+ "svcCartItem " + CARTITEM_TABLE 
 		+ " on ( " + INCIDENT_TABLE + ".cartId = " + CARTITEM_TABLE + ".cartId ) WHERE " + INCIDENT_TABLE + ".incident.id=\"%s\""; 
 	sql = queryBuilder(sql, [incidentId]);
 	return sql;
}

function getServiceType(incidents){
	var serviceType = null;
	if (incidents['category'] == 'service catalog') {
	    serviceType = 'service catalog';
	} else { // if category in not "service catalog", determine its type need to know whether it related to one cart
	    if (incidents['source.service'] == 'support catalog') {
	        serviceType = 'support catalog';
	    }
	    else {
	        serviceType = 'self-service';
	    }
	}
	return serviceType;
}

function getSDCartItems(sd_id) {
	var cartItems = [];
	var cartItemQuery = "sdID=\"" + sd_id + "\"";
	
	var svcCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
	svcCartItem.setFields(['cartItemId']);
	if (svcCartItem.doSelect(cartItemQuery) === RC_SUCCESS) {
		do {
			cartItems.push(svcCartItem.cartItemId);
		} while(svcCartItem.getNext() == RC_SUCCESS);
	}
	
	return cartItems;
}

function denyApproval(arg) {
    setExitType(NORMAL_EXIT);
    var returnCode;
    var File = lib.DBUtils.File;
    var file = vars['$L.file'];
    var id = file['unique.key'];
    var fileName = file['file.name'];
    var approvalType = file['name'];
    
    var comments = file['comments'];
    var component = file['component'];
    if(component == null) {
    	component = 'NULL';
    }
    else {
    	component = '"' + component + '"';
    }
    
    var originalUpdateTime = file['sysmodtime']; 
	 //check if approvals are up2date or not, if not up2date, set Exit Type:INCIDENT_NOT_UPDATE2DATE with returnCode:999, then return;
    if (_getIfApprovalModLaterThanTime( id, fileName,approvalType,originalUpdateTime,component)){
       setExitType(CURRENTRECORD_NOT_UPDATE2DATE);
       return;
    }
	//Validate comments
    if(comments.length() == 1 && comments[0] == null) {
    	setExitType(BAD_VALIDATION_EXIT);
    	funcs.rtecall('msg', returnCode, funcs.scmsg(130, 'SvcCatAPI'));
    	return;
    }
    
    vars['$denyAllComment'] = comments;
    
    var query = 'unique.key="' + id + '" and file.name="' + fileName + '" and name="' + approvalType + '" and component=' + component;

    if (arg) {  
		// get approvals for cart items
		var cartItems = getSDCartItems(id);
		var cartItemsStr = "";
		
		var i;
		for (i=0; i<cartItems.length; i++) {
			cartItemsStr = '"' + cartItems[i] + '",';
		}
		
		if (cartItemsStr !== "") {
			var queryWithCartItems = '(unique.key isin {' + cartItemsStr.slice(0, -1) + '} and file.name="svcCartItem")';
			query = 'approvals.record=true and approval.status="pending" and ((' + query + ') or ' + queryWithCartItems + ')';
		}
    }
    
    var approvals = new File('Approval').getRecords(query);

    if(approvals == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }
    
    if(new File('Approval').getRecords(generateApprovalInboxSql() + ' and ' + query) == null) {
    	setExitType(BAD_VALIDATION_EXIT);
    	return;
    }
    else {
    	vars['$svcCatalog.can.approve'] = true;
    	vars['$fg.approval'] = false;
    }
    
    var matched_groups = file['matched.groups.src'];   
    
    approvals.each(function(approval) {
        if( matched_groups != null && matched_groups != "") {
            approval['matched.groups.src'] = matched_groups;
        }
    	returnCode = approval.doAction('deny');
        if(returnCode == 3) {
	        setExitType(CURRENTRECORD_LOCKED);
	        return;
	    }
	    if(returnCode == 28) {
	        setExitType(BAD_VALIDATION_EXIT);
	        return;
	    }
	    
    });
}

function approveApproval(arg) {
    setExitType(NORMAL_EXIT);
    var returnCode;
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
	//Validate comments
    if(comments.length() == 1 && comments[0] == null) {
    	comments = [""];
    }
    vars['$denyAllComment'] = comments;
    
    var query = 'unique.key="' + id + '" and file.name="' + fileName + '" and name="' + approvalType + '" and component=' + component;
    
    if (arg) {  
		// get approvals for cart items
		var cartItems = getSDCartItems(id);
		var cartItemsStr = "";
		
		var i;
		for (i=0; i<cartItems.length; i++) {
			cartItemsStr = '"' + cartItems[i] + '",';
		}
		
		if (cartItemsStr !== "") {
			var queryWithCartItems = '(unique.key isin {' + cartItemsStr.slice(0, -1) + '} and file.name="svcCartItem")';
			query = 'approvals.record=true and approval.status="pending" and ((' + query + ') or ' + queryWithCartItems + ')';
		}
    }
    
    var approvals = new File('Approval').getRecords(query);

    if(approvals == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }
    
    if(new File('Approval').getRecords(generateApprovalInboxSql() + ' and ' + query) == null) {
    	setExitType(BAD_VALIDATION_EXIT);
    	return;
    }
    else {
    	vars['$svcCatalog.can.approve'] = true;
    	vars['$fg.approval'] = false;
    }
    
    var matched_groups = file['matched.groups.src'];
    approvals.each(function(approval) {
        if( matched_groups != null && matched_groups != "") {
            approval['matched.groups.src'] = matched_groups;
        }
    	returnCode = approval.doAction('approve');
    	if(returnCode == 3) {
	        setExitType(CURRENTRECORD_LOCKED);
	        return;
	    }
	    if(returnCode == 28) {
	        setExitType(BAD_VALIDATION_EXIT);
	        return;
	    }
    });
}

function getCurrentApprovals() {
    setExitType(NORMAL_EXIT);
    
    var File = lib.DBUtils.File;
    var id = vars['$L.file']['id'];
    
    var interactions = new File('incidents').getRecords('incident.id="' + id + '"');
    
    if(interactions == null) {
		setExitType(NO_RECORD_EXIT);
		return;
    }

    lib.ApprovalIntegration.buildApprovalInfoVar('incidents', id, 'SRC');
    
    var sourceArrayList = [vars.$L_aplItem_desc, vars.$L_aplItem_class, vars.$L_aplItem_approver, vars.$L_aplItem_level, vars.$L_aplItem_status, vars.$L_aplItem_date, vars.$L_aplItem_sysmodtime];
    var targetFieldList = ['desc', 'class', 'approver', 'level', 'status', 'dateStr','sysmodtime'];
    
    var i, j, length;
    
	// Return the unique key list in response.
	var uniqueKeyList = ['file.name', 'unique.key', 'name', 'component'];
	length = vars['$L.aplItem.tag'].length();
	for(i = 0; i < length; i++) {
		for(j = 0; j < uniqueKeyList.length; j++) {
			vars['$L.file']['ApprovalStatus'][i][uniqueKeyList[j]] = lib.Utilities.getKeyValueFromTag(vars['$L.aplItem.tag'][i], uniqueKeyList[j]);
		}
	}
	 //convert from string to date type
	length = vars.$L_aplItem_date.length();
    for (j = 0; j < length; j ++) {
    	vars.$L_aplItem_date[j] = funcs.val(vars.$L_aplItem_date[j],3);
    	vars.$L_aplItem_date[j] = new SCDatum(vars.$L_aplItem_date[j]);
    }
    
    length = vars.$L_aplItem_sysmodtime.length();
    for (j = 0; j < length; j ++) {    	
    	vars.$L_aplItem_sysmodtime[j] = funcs.val(vars.$L_aplItem_sysmodtime[j],3); 
    	vars.$L_aplItem_sysmodtime[j] = new SCDatum(vars.$L_aplItem_sysmodtime[j]);    	
    }	   
	
	for(i = 0; i < sourceArrayList.length; i++) {
		_arrayCopy(sourceArrayList[i], vars['$L.file']['ApprovalStatus'], targetFieldList[i]);	
	}
	
	length = vars['$L.file']['ApprovalStatus'].length();
	for(i = 0; i < length; i++) {
		vars['$L.file']['ApprovalStatus'][i]['approver.fullname'] = _getFullnameByName(vars['$L.file']['ApprovalStatus'][i]['approver']);
	}
	
	vars['$L.file']['pending.future.count']=  vars.$L_pendingCount;
	//remove comments from the API getCurrentApproval
}


function getApprovalLogs() {
    setExitType(NORMAL_EXIT);
    
    var File = lib.DBUtils.File;
    var id = vars['$L.file']['id'];
    if (id == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(138)); 
		return;
    }
    var filename = "";
    var copyFields = ['action','component','current.phase','date','file.name','group','name','operator.fullname','unique.key'];
    var cnt = 0;
    var i;
    
    // Get directly logs
    var dirLogs = new File('ApprovalLog').getRecords('unique.key="' + id + '"');
    if (dirLogs != null) {
        dirLogs.each(function (dirLog) {
            for (i = 0; i < copyFields.length; i++) {
                vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = dirLog[copyFields[i]];
                filename = dirLog['file.name'];
            }
            
            cnt++;
        });
    }
    
    // Get related logs
    if (filename == "incidents") {
        var cartItems = new File('svcCartItem').getRecords('sdID="' + id + '"');
        if (cartItems != null) {
            cartItems.each(function (cartItem) {
                var relLogs = new File('ApprovalLog').getRecords('file.name="svcCartItem" and unique.key="' + cartItem['cartItemId'] + '"');
                if (relLogs != null) {
                    relLogs.each(function (relLog) {
                        for (i = 0; i < copyFields.length; i++) {
                            vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = relLog[copyFields[i]];
                        }
                        
                        vars['$L.file']['ApprovalLogs'][cnt]['item.name'] = cartItem['item.description'];
                        cnt++;
                    });
                }
            });
        }
    }
    
    if (cnt == 0) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(141, [funcs.scmsg(filename, "tablename"),id])); 
		return;
    }
}

function _arrayCopy(sourceArray, targetArrayStructure, fieldName) {
    var i, length = sourceArray.length();
	for(i = 0; i < length; i++) {
		targetArrayStructure[i][fieldName] = sourceArray[i];
	}
}

function _getFullnameByName(approverName) {
	
	var operator = select('operator', 'name="' + approverName + '"', ['full.name']);
	
	if(operator == null) {
		return approverName;
	}
	
	return operator['full.name'];
}

function getApprovalInboxOwnSql()
{
    var lOperator = vars['$lo.operator']['name'];
    
    var cm3rGroups = getChangeGroups();
    var ocmqGroups = getQuoteGroups();
    var requestGroups = getRequestGroups();
  
    var smGroups   = vars['$G.sm.environment']['approval.groups'].toArray();
    if (funcs.index(lOperator, cm3rGroups) == 0) {
        cm3rGroups.push(lOperator);
    }
    if (funcs.index(lOperator, ocmqGroups) == 0) {
        ocmqGroups.push(lOperator);
    }
    if (funcs.index(lOperator, requestGroups) == 0) {
        requestGroups.push(lOperator);
    }
    if (funcs.index(lOperator, smGroups) == 0) {
        smGroups.push(lOperator);
    }
    
    var changeSql   = 'file.name="cm3r" and current.pending.groups isin ' + funcs.str(cm3rGroups);
    var ocmqSql  = 'file.name="ocmq" and current.pending.groups isin ' + funcs.str(ocmqGroups);
    
    var sdSql       = 'file.name="incidents" and current.pending.groups isin ' + funcs.str(smGroups);
    var cartItemSql = 'file.name="svcCartItem" and current.pending.groups isin ' + funcs.str(smGroups);
    
    var customSql = lib.ApprovalCustomPlugin.appendCustomApprovalSql();
    var sql = '(' + changeSql + ') or (' + sdSql + ') or (' + cartItemSql + ')';
    
    if (lib.ProcessDesignerEnablement.isRequestEnabled()) {
    	var requestSql  = 'file.name="request\" and current.pending.groups isin ' + funcs.str(requestGroups);
    	sql += ' or (' + requestSql + ')';
    	if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
    		sql += ' or (' + ocmqSql  + ')';
    	}
    } else {
    	sql += ' or (' + ocmqSql  + ')';
    }
    
    if (customSql) {
        sql += customSql;
    }
    return sql;
}

function generateApprovalInboxSql() {
    var sql = 'approval.status="pending" and (approvals.record=NULL or approvals.record=true)';
    var ownSql = getApprovalInboxOwnSql();
    var delegateSql = lib.ApprovalDelegationGroups.getDelegationSql();
    
    if (delegateSql) {
        sql += ' and (' + ownSql + delegateSql + ')';
    }
    else {
        sql += ' and (' + ownSql + ')';
    }
    
    return sql;
}

function generateSRCApprovalInboxSql(approvalModule, dateFrom, dateTo) {
	var sql;
	var dateClause = "";
	if (dateFrom != null){
		dateClause += " and sysmodtime >= '" + dateFrom + "'";
	}
	if (dateTo != null){
		dateClause += " and sysmodtime <= '" + dateTo + "'";
	}
	
	var quoteFileName = getQuoteFileName();
	
	var requestFileNames = getRequestFileNames();
	
	if (approvalModule == null){
		sql = '(file.name isin {"svcCartItem","incidents","cm3r","';
		sql += requestFileNames.join('", "');
		sql += '"})';
	} else if (approvalModule == 'Change') {
		sql = 'file.name="cm3r"';
	} else if (approvalModule == 'Quote') {
		sql = '(file.name isin {"';
		sql += requestFileNames.join('", "');
		sql += '"})';
	} else if (approvalModule == 'Service'){
		sql = '(file.name isin {"svcCartItem","incidents"})';
	} else {
		throw lib.ScAPI_Util.getMessage(181);
	}
	
	sql += ' and (' + generateApprovalInboxSql() + ')';
	
	sql += dateClause;
	return sql;
}

function getAllSrcConfig(company) {
	var query = 'company="' + company + '"';
	var configs = select('svcSrcConfig', query);
	
	if (!configs) {
		query = "company=\"DEFAULT\"";
		configs = select('svcSrcConfig', query);
	}
	
	var arrConfig = [];
	if (configs != null) {
		do {
			var tempConfig = new srcConfig(configs);
			arrConfig[configs['screen.type']] = tempConfig;
			result = configs.getNext();
		} while (result == RC_SUCCESS);
	}
	
	return arrConfig;
}

function getAllAddtionalFields(arrConfig) {
	var fields = [];
	var obj;
	for (obj in arrConfig){
		fields = unionArray(arrConfig[obj]['fields'], fields);
	}
	return fields;
}

function unionArray(arrayA, arrayB) {
    var i, j;
    for (i = 0; i < arrayA.length; ++i) {
        var inArrID = false;
        for (j = 0; j < arrayB.length; ++j) {
            if (arrayB[j] == arrayA[i]) {
                inArrID = true;
                break;
            }
        }
        
        if (!inArrID) {
            arrayB.push(arrayA[i]);
        }
    }
    return arrayB;
}

function srcConfig(config){
	this.screenType = config['screen.type'];
	this.fields= config['fields'].toArray();
}

function getInteractionComments(){
    setExitType(NORMAL_EXIT);
    
    var File = lib.DBUtils.File;
    var id = vars['$L.file']['id'];
    if (id == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(138)); 
		return;
    }
    
    var filename = "incidents";
//    vars['$L.file']['filename'] = filename; // Use incidents as default by now. vars['$L.file']['filename']
    var copyFields = ['action','component','current.phase','date','file.name','group','name','operator.fullname','unique.key'];
    var cnt = 0;
    var i;
    
    // Get directly logs
    var dirLogs = new File('ApprovalLog').getRecords('file.name="' + filename + '" and unique.key="' + id + '"');
    if (dirLogs != null) {
        dirLogs.each(function (dirLog) {
            for (i = 0; i < copyFields.length; i++) {
                vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = dirLog[copyFields[i]];
            }
            
            vars['$L.file']['ApprovalLogs'][cnt]['comments'] = lib.ScAPI_Util.covertArrayToStringInLine(dirLog['comments']);
            cnt++;
        });
    }
    
    // Get related logs
    if (filename == "incidents") {
        var cartItems = new File('svcCartItem').getRecords('sdID="' + id + '"');
        if (cartItems != null) {
            cartItems.each(function (cartItem) {
                var relLogs = new File('ApprovalLog').getRecords('file.name="svcCartItem" and unique.key="' + cartItem['cartItemId'] + '"');
                if (relLogs != null) {
                    relLogs.each(function (relLog) {
                        for (i = 0; i < copyFields.length; i++) {
                            vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = relLog[copyFields[i]];
                        }
                        
                        vars['$L.file']['ApprovalLogs'][cnt]['item.name'] = cartItem['item.description'];
                        vars['$L.file']['ApprovalLogs'][cnt]['comments'] = lib.ScAPI_Util.covertArrayToStringInLine(relLog['comments']);
                        cnt++;
                    });
                }
            });
        }
    }
    
    var incidentRecords = new File("incidents", ['opened.by.uid', 'contact.name']).getRecords('incident.id=\"' + id + '\"');
    var requestor;
    var openedByUid;
    if (incidentRecords)
    {
    	requestor = incidentRecords.scFile['contact.name'];
    	openedByUid = incidentRecords.scFile['opened.by.uid'];
    }
    
    //get activities
    var xml = new XML();
    var idx=0;
    var cpFields = ['thenumber','number','type','datestamp','operator'];
    var acts = new File('activityservicemgt').getRecords('number="' + id + '" and cust.visible=true');
    
    var currentOperator = getCurrentOperator();
    
    if(acts!=null){
    	acts.each(function(act){
    		var operatorName = _getFullnameByName(act['operator']);
    		for(i=0;i<cpFields.length;i++){
    			vars['$L.file']['ActivityLogs'][idx][cpFields[i]]=act[cpFields[i]];

    			vars['$L.file']['ActivityLogs'][idx]['operatorfullname']=operatorName;
    		}
    		//TODO: compile desction into xml stream.
    		var descSize = funcs.lng(act['description']);
    		xml.setContent("<description/>");
    		for(i=0;i<descSize;i++){
    			var nodeDesc = xml.createNode(1,"description");
    			if(act['description'][i] != null){
    				nodeDesc.setValue(act['description'][i]);
    			}else{
    				nodeDesc.setValue("");
    			}
    			xml.appendNode(nodeDesc);
    		}
    		vars['$L.file']['ActivityLogs'][idx]['descriptions'] = xml.toXMLString();

    		if (currentOperator['name'] == openedByUid) {
    			if (act['unread'] && act['operator'] != currentOperator['name']) { 
    				vars['$L.file']['ActivityLogs'][idx]['unread'] = true;
	    			act['unread'] = false;
	    			act.doUpdate();
    			}
    		}
    		
       		idx++;
    	});
    
    }
    
    if (cnt == 0 && idx == 0) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(141, [funcs.scmsg(filename, "tablename"),id])); 
		return;
    }
    
    //get approval comments
    var fApproval = new SCFile("Approval", SCFILE_READONLY);
    fApproval.setFields(["comments"]);
    var lFilename = "incidents";
    var classTmp = "Request";
    var vComments = [];
    var fRlt1 = fApproval.doSelect("file.name=\"" + lFilename + "\" and unique.key=\"" + id + "\"");
    while (fRlt1 == RC_SUCCESS)
    {
        // integrate comments
        lib.ApprovalIntegration.buildNewComments(vComments, fApproval.comments, classTmp, 'SRC');
        
        fRlt1 = fApproval.getNext();
    }
    // get class Line Item and its components
    if (lFilename == "incidents") // only support table incidents
    {
        var fCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
        fCartItem.setFields(["cartItemId","item.description"]);
        var fRlt2 = fCartItem.doSelect("sdID=\"" + id + "\"");
        while (fRlt2 == RC_SUCCESS)
        {
            var fApprovalItem = new SCFile("Approval", SCFILE_READONLY);
            fApprovalItem.setFields(["component","comments"]);
            var fRlt3 = fApprovalItem.doSelect("file.name=\"" + funcs.filename(fCartItem) + 
                         "\" and unique.key=\"" + fCartItem.cartItemId + "\"");
            while (fRlt3 == RC_SUCCESS)
            {
                classTmp = fApprovalItem.component;
                if (classTmp == null) {
                    classTmp = fCartItem.item_description;
                }
           
	            // integrate comments
                lib.ApprovalIntegration.buildNewComments(vComments, fApprovalItem.comments, classTmp, 'SRC');
	            
	            fRlt3 = fApprovalItem.getNext();
            }
            
            fRlt2 = fCartItem.getNext();
        }
    }
    
    vars['$L.file']['ApprovalComments'] = vComments;
}