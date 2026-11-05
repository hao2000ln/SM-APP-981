/** @fileoverview svcCatApprovals - contains functions used by the Service Catalog module
*   @author Levin
*/
var select = lib.GatewayAPI_RAD._select;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var CURRENTRECORD_NOT_UPDATE2DATE = lib.GatewayAPI_Constants.CURRENTRECORD_NOT_UPDATE2DATE();
var CURRENTRECORD_LOCKED = lib.GatewayAPI_Constants.CURRENTRECORD_LOCKED();
var getQuoteFileName = lib.GatewayAPI_Util.getQuoteFileName;
var getRequestFileNames = lib.GatewayAPI_Util.getRequestFileNames;
var getChangeGroups = lib.GatewayAPI_Util.getChangeGroups;
var getQuoteGroups = lib.GatewayAPI_Util.getQuoteGroups;
var getRequestGroups = lib.GatewayAPI_Util.getRequestGroups;
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var getDigitAfterDecimal = lib.GatewayAPI_Util.getDigitAfterDecimal;
var tod = lib.GatewayAPI_RAD._tod;
var _buildXmlFromFile = lib.GatewayAPI_WSInterface_Interaction_Inbox.buildXmlFromFile;
var queryBuilder = lib.GatewayAPI_RAD._queryBuilder;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var fun = system.functions;
var getDelegateLists = lib.ApprovalDelegationService.initDelegation;
var $ = lib.c.$;
var oper ;
var operCurrency ;

var _createNode = lib.GatewayAPI_WSInterface_svcCatalogGather._createNode;

var scmsg = system.functions.scmsg;
var _getIfApprovalModLaterThanTime = lib.GatewayAPI_Util.getIfApprovalModLaterThanTime;
var INCIDENT_TABLE = "ti";
var CARTITEM_TABLE = "tc";
var arrayIndexOf = lib.ApprovalDelegationGroups.arrayIndexOf;
var log = lib.GatewayAPI_Logger.log("GatewayAPI_svcCatApprovals");

function getFilterCondtion(file,query) {
	var newquery = "";
	keyset = file['approvals'];
	var rowcount = keyset.length();
	for(var i = 0; i < rowcount; i++){
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
	this.cache = {}; // cache with key contact.name
	this.cache2 = {}; // cache with key login name
	this.cacheApprovalGroup = {}; // cache with key login name with the value array of operator fullname
}

OperatorFullnameBroker.prototype = {
	getFullnameByContactName: function (contactName) {
		var op = this.getOp(contactName);
		if(op) {
			return op['full.name'];
		} else {
			return null;
		}
	},
	/**
     * @param loginName  the operator login name
     * @param tryApprovalGroup whether try to treat the loginName as a group, and get the approvers of this group
     */
	getFullnameByLoginName: function (loginName, tryApprovalGroup) {
	    // if tryApprovalGroup, try to get directly from group cache 
	    if(tryApprovalGroup && this.cacheApprovalGroup[loginName]) {
	    	return this.cacheApprovalGroup[loginName];
	    }
	    
		var op = this.getOpByLoginName(loginName);
		if(op) {
			return op['full.name'];
		} else {
		    if(tryApprovalGroup) {
		        return this.getGroupApprovers(loginName);
		    } else {
				return null;
			}
		}
	},
	
	getCurrencyByContactName: function (contactName) {
		var op = this.getOp(contactName);
		var currency;
		if(op) {
			currency = op['display.currency.code'];
		}
		return currency?currency:vars['$G.root.currency'];
	},
	
	getOp: function (contactName) {
		if (!this.cache[contactName]) {
			var query = 'contact.name="' + contactName + '"';
			var op = $("operator", SCFILE_READONLY).setFields(["name", "full.name","display.currency.code"]).select(query).uniqueResult();
			if(op) {
				this.cache[contactName] = {
					'full.name': op['full.name'],
					'display.currency.code': op['display.currency.code'],
				};
				this.cache2[op['name']] = {
					'full.name': op['full.name'],
					'display.currency.code': op['display.currency.code'],
				};
			}
		}
		return this.cache[contactName];
	},
	
	getOpByLoginName: function (loginName) {
		if (!this.cache2[loginName]) {
			var query = 'name="' + loginName + '"';
			var op = $("operator", SCFILE_READONLY).setFields(["contact.name", "full.name","display.currency.code"]).select(query).uniqueResult();
			if(op) {
				this.cache2[loginName] = {
					'full.name': op['full.name'],
					'display.currency.code': op['display.currency.code'],
				};
				this.cache[op['contact.name']] = {
					'full.name': op['full.name'],
					'display.currency.code': op['display.currency.code'],
				};
			}
		}
		return this.cache2[loginName];
	},
	
	getGroupApprovers: function (groupName) {
		if (!this.cacheApprovalGroup[groupName]) {
			var query = 'name="' + groupName + '"';
			var grp = $("assignment", SCFILE_READONLY).setFields(["approvers"]).select(query).uniqueResult();
			if(grp) {
			    var approvers = [];
			    if(grp['approvers'] && grp['approvers'].length()>0) {
					for(var i=0, len=grp['approvers'].length(); i<len; i++) {
						approvers.push(this.getFullnameByLoginName(grp['approvers'][i]));
					}
				}
				this.cacheApprovalGroup[groupName] = rteJSONStringify(approvers);
			}
		}
		return this.cacheApprovalGroup[groupName];
	},
}

/**
 * @public
 * @description  Set fields original.approver and original.approver.fullname
 * @param orgApproval
 * @param targetObj
 * @param delegateLists {Array} [delegationListAll,delegationListPart] with format {module:xx, group:xx, approver:xx, area:xx}
 * @return 
 */
function setOriginalApprover(orgApproval, targetObj, delegateLists, ofb) {
	var curPendingGroups = orgApproval['current.pending.groups'];
	if(curPendingGroups==null || curPendingGroups.length() === 0) {
		return;
	}
	if(!delegateLists || delegateLists.length <= 0) {
		return;
	}
	for(var i=0, len=curPendingGroups.length(); i<len; i++) {
		// check in delegationListAll
		if(delegateLists[0] && delegateLists[0].length>0) {
			for(var j=0, lenJ=delegateLists[0].length; j<lenJ; j++) {
				if(curPendingGroups[i]===delegateLists[0][j]['approver'] || curPendingGroups[i]===delegateLists[0][j]['group']) {
					targetObj['original.approver'] = curPendingGroups[i];
					break;
				}
			}
            //handle currentPendingGroup is group not operator and the delegation group is 'all'
            if (!targetObj['original.approver']){
                for(var j=0, lenJ=delegateLists[0].length; j<lenJ; j++) {
                    if("all"===delegateLists[0][j]['group']) {
                        targetObj['original.approver'] = curPendingGroups[i];
                        break;
                    }
                }
            }
        }
		if(!targetObj['original.approver'] && delegateLists[1] && delegateLists[1].length>0) {
			for(var j=0, lenJ=delegateLists[1].length; j<lenJ; j++) {
				// module should match
				if(((orgApproval['file.name']==='incidents' || orgApproval['file.name']==='svcCartItem') && delegateLists[1][j]['module']==='SVC')
				 ||(orgApproval['file.name']==='cm3r' && delegateLists[1][j]['module']==='Change') || (orgApproval['file.name']==='request' && delegateLists[1][j]['module']==='Request')) {
					if(curPendingGroups[i]===delegateLists[1][j]['approver'] || curPendingGroups[i]===delegateLists[1][j]['group']) {
						targetObj['original.approver'] = curPendingGroups[i];
						break;
					}
				}
			}
            //handle currentPendingGroup is group not operator and the delegation group is 'all'
            if (!targetObj['original.approver']){
                for(var j=0, lenJ=delegateLists[1].length; j<lenJ; j++) {
                    if(((orgApproval['file.name']==='incidents' || orgApproval['file.name']==='svcCartItem') && delegateLists[1][j]['module']==='SVC')
                 ||(orgApproval['file.name']==='cm3r' && delegateLists[1][j]['module']==='Change') || (orgApproval['file.name']==='request' && delegateLists[1][j]['module']==='Request')) {
                        if("all"===delegateLists[1][j]['group']) {
                            targetObj['original.approver'] = curPendingGroups[i];
                            break;
                        }
                    }
                }
            }
        }
		if(targetObj['original.approver']) {
			break;
		}
	}
	// set fullname
	if(targetObj['original.approver']) {
		targetObj['original.approver.fullname'] = ofb.getFullnameByLoginName(targetObj['original.approver']);
		if(!targetObj['original.approver.fullname']) {
			targetObj['original.approver.fullname'] = targetObj['original.approver'];
		}
	}
}

function getApprovalInbox() {
    setExitType(NORMAL_EXIT);

    var File = lib.DBUtils.File;
    
    var approvalModule = vars['$L.file']['approval.module'];
    var dateFrom = null;
    if (vars['$L.file']['date.from'] != null){
	    dateFrom = new XMLDate(vars['$L.file']['date.from']).getDatum().getText();
    }
    var dateTo = null;
    if (vars['$L.file']['date.to'] != null){
	    dateTo = new XMLDate(vars['$L.file']['date.to']).getDatum().getText();
    }
    var query;
    try{
	    // Generate a query
    	query = generateSRCApprovalInboxSql(approvalModule, dateFrom, dateTo);
    } catch (ex) {
    	setExitType(BAD_VALIDATION_EXIT);
    	setErrorMsg(ex);
    	return;
    }
    
    // Prepare for delegated determination
    var ownSql = getApprovalInboxOwnSql();
    var delegateSql = lib.ApprovalDelegationGroups.getDelegationSql();
    var isDelegatedApproval = function(lApproval) // Return whether it is a delegated approval
    {
        if (delegateSql == '') return 'NO'; // If no delegattion definition, always return NO
        
        var delegated;
        if (system.functions.evaluate_query(ownSql, lApproval) == true) delegated = 'NO';
        else delegated = 'YES';
        return delegated;
    }

	//No need to return the custom fields
	
    var keyfields  = ['file.name','name','unique.key','component'];
    var fields  = ['file.name','name','unique.key','component','requested.by','sysmodtime'];
    var fieldsi = ['title', 'contact.name', 'category', 'cartId', 'svc.cost']; //incidents field
    var filedss = ['sdID','svcCatalogId','item.description','cost','requested.for','requested.for.fullname', 'recurring.cost', 'recurring.cost.interval']; //svcCartItem field
    var fieldsc = ['number', 'brief.description', 'requested.by']; //cm3r field
    var fieldsq = ['number', 'brief.description', 'total.cost', 'requested.for']; //ocmq field
    var approvals = null;
    query = getFilterCondtion(vars['$L.file'], query);
	var sortableFields = {
		FileName: 'file.name',
		ApprovalType: 'name',
		UniqueKey: 'unique.key',
		Component: 'component',
		RequestedBy: 'requested.by',
		Date: 'sysmodtime'
	};
	var sortBy = sortableFields[vars['$L.file']['sortby']];
	if(!sortBy) {
		sortBy = sortableFields.Date;
	}
	var orderBy = vars['$L.file']['orderby'];
	if(!orderBy) {
		orderBy = 'DESC';
	}

    var file = new File(
			'Approval', 
			//fields, 
			null,
			sortBy, 
			orderBy
		);

	if (!vars['$L.file']['in.id.string']) {
		var start = vars['$L.file']['start'], 
			pagesize = vars['$L.file']['pagesize'];
		if (!vars['$L.file']['start'])
			vars['$L.file']['start'] = 1;
		if (!vars['$L.file']['pagesize'])
			vars['$L.file']['pagesize'] = 10;
		file.setPaging(vars['$L.file']['start'], vars['$L.file']['pagesize']);
	}
	
	var totalCount = lib.GatewayAPI_RAD._count('Approval', query);
	vars['$L.file']._count = totalCount;
	approvals = file.getRecords(query);
	
    if(approvals == null) {
        vars['$L.file']['approvals'] = null;
		// xjma: here we should not return with no.record, otherwise HTTP return code will be 404, we should keep it as 200, and just set msg "No (more) records found"
		// setExitType(NO_RECORD_EXIT);
		setErrorMsg(system.functions.scmsg(330, 'scjsdesc')); 
		return;
    }
    var count = 0;
    var keyscount = 0;
    keyscount = vars['$L.file']['approvals'].length();


	var ofb = new OperatorFullnameBroker();
	var ocmqFileName = getQuoteFileName();
	var requestFileNames = getRequestFileNames();

	approvals.each(function(approval) {			
		for(var i = 0; i < fields.length; i++) {
			vars['$L.file']['approvals'][count][fields[i]] = approval[fields[i]];
		}
		// If it is a line item approval, set the parent ticket ID and item name(description).
		if(approval['file.name'] == 'svcCartItem') {
			var svcCartItemRecords = new File('svcCartItem', filedss).getRecords('cartItemId="' + approval['unique.key'] + '"');
			if(svcCartItemRecords != null) {
				var svcCartItemRecord = svcCartItemRecords.scFile;
				var orgCurrency = vars['$G.root.currency'];
				vars['$L.file']['approvals'][count]['price'] = convert_currency(orgCurrency, svcCartItemRecord['cost']);
				vars['$L.file']['approvals'][count]['currency'] = getOperatorCurrency(); 
				vars['$L.file']['approvals'][count]['module'] = 'Service';
				vars['$L.file']['approvals'][count]['parent.ticket.id'] = svcCartItemRecord['sdID'];
				var svcCatalogId = svcCartItemRecord['svcCatalogId'];
				vars['$L.file']['approvals'][count]['requestedfor'] = svcCartItemRecord['requested.for'];
				vars['$L.file']['approvals'][count]['requested.for.fullname'] = svcCartItemRecord['requested.for.fullname'];
				if (svcCartItemRecord['recurring.cost']) {
					vars['$L.file']['approvals'][count]['recurring.costs.info'] = svcCartItemRecord['cartItemId']
							 + ":" + svcCartItemRecord['svcCatalogId']
							 + ":" + convert_currency(orgCurrency, svcCartItemRecord['recurring.cost'])
							 + ":" + svcCartItemRecord['recurring.cost.interval'];
				}
				
				// Give price and currency for line item and bundle.
				//remove currency conversion
				
				var requestRecords = new File('incidents', fieldsi).getRecords('incident.id="' + svcCartItemRecord['sdID'] + '"');
				if(requestRecords != null) {
					requestRecords.each(function(requestRecord) {
						vars['$L.file']['approvals'][count]['request.title'] = requestRecord['title'];
						
						//Below 4 line add by Fei, zhi-chao on 2010-08-27
					});
				}
				
				// set display name of the catalog item
				var itemRecords = new File('joinsvcDisplay', ['displayName']).getRecords('id="' + svcCatalogId + '"');
				if(itemRecords != null) {
					var itemRecord = itemRecords.scFile;
					vars['$L.file']['approvals'][count]['item.name'] = itemRecord['displayName'];
				}
			}

		}

		// If it is a interaction approval, set the interaction title and description.
		if(approval['file.name'] == 'incidents') {
			var requestRecords = _queryIncidents(approval['unique.key'], fieldsi, vars['$L.file']['include.recurring.cost']);
			if(requestRecords != null) {
				var svcCartItem_Recurring_Cost_Info = "";
				requestRecords.each(function(requestRecord) {
					var orgCurrency = vars['$G.root.currency'];
					vars['$L.file']['approvals'][count]['price'] = convert_currency(orgCurrency, requestRecord['svc.cost']);
					vars['$L.file']['approvals'][count]['currency'] = getOperatorCurrency();
					vars['$L.file']['approvals'][count]['module'] = 'Service';
					vars['$L.file']['approvals'][count]['request.title'] = requestRecord['title'];
					
					vars['$L.file']['approvals'][count]['requestedfor'] = requestRecord['contact.name'];//add by Fei, Zhi-Chao on 2010-08-27
					vars['$L.file']['approvals'][count]['requested.for.fullname'] = ofb.getFullnameByContactName(requestRecord['contact.name']);
					if (requestRecord[CARTITEM_TABLE+'.recurring.cost']) {
						svcCartItem_Recurring_Cost_Info += requestRecord[CARTITEM_TABLE+'.cartItemId'] + ":" 
							+ requestRecord[CARTITEM_TABLE+'.svcCatalogId'] + ":" 
							+ convert_currency(orgCurrency, requestRecord[CARTITEM_TABLE+'.recurring.cost']) + ":" 
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

					// by xjma, also set the request for info according to the request by
					vars['$L.file']['approvals'][count]['requestedfor'] = changeRecord['requested.by'];
					vars['$L.file']['approvals'][count]['requested.for.fullname'] = ofb.getFullnameByContactName(changeRecord['requested.by']);
				});
			}
		}
		
		  // If it is a request fulfillment approval, retrieve request info, added for service portal 2020.02 release
        if(approval['file.name'] == 'request') {
            var quoteRecords = new File('request', fieldsc).getRecords('number="' + approval['unique.key'] + '"');
            if(quoteRecords != null) {
                quoteRecords.each(function(quoteRecord) {
                    vars['$L.file']['approvals'][count]['module'] = 'Request';
                    vars['$L.file']['approvals'][count]['request.title'] = quoteRecord['brief.description'];
                    vars['$L.file']['approvals'][count]['requestedfor'] = quoteRecord['requested.for'];
                    vars['$L.file']['approvals'][count]['requested.for.fullname'] = ofb.getFullnameByContactName(quoteRecord['requested.for']);
                    vars['$L.file']['approvals'][count]['price'] = convert_currency(quoteRecord['cost.currency.code'], quoteRecord['total.cost']);
                    vars['$L.file']['approvals'][count]['currency'] = getOperatorCurrency();
                });
            }
        }
           
		// If it is a interaction approval, retrieve quote info. 
		//Comment out below code since ocmq is not used any more.
		/* if (fun.index(approval['file.name'], requestFileNames) > 0) {
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
		}*/
		
		// Is it a delegate approval
		var id = scmsg(approval['file.name'], 'tablename') + ' ' + approval['unique.key'];
		vars['$L.file']['approvals'][count]['record'] = id;
		vars['$L.file']['approvals'][count]['modtime'] = approval['sysmodtime'];
		var isDelegated = isDelegatedApproval(approval);
		vars['$L.file']['approvals'][count]['isDelegateApproval'] = isDelegated;
		// set original.approver and original.approver.fullname
		if(isDelegated) {
			setOriginalApprover(approval, vars['$L.file']['approvals'][count], getDelegateLists(), ofb);
		}
		
		// commented by xjma
		// vars['$L.file']['approvals'][count]['matched.groups'] = getMatchedGroups(approvalModule,approval);	
		count++;
	});

	if(keyscount > 0 && keyscount > count)
		for(var i = count; i < keyscount; i++)
			vars['$L.file']['approvals'][i] = null;
}

function getOperatorCurrency() {
	if (oper == null)
		oper = getCurrentOperator();
	if (operCurrency == null)
		operCurrency = oper.display_currency_code || vars.$G_root_currency;
	return operCurrency;
}

function convert_currency(itemCurrency, itemCost) {
	if (itemCurrency == null)
		itemCurrency = vars.$G_root_currency;
	if (itemCost == null)
		return 0;
	getOperatorCurrency();
	if (itemCurrency == operCurrency)
		return itemCost;
	var rtObj = us_convert_currency(itemCurrency, operCurrency, itemCost, tod());
	//return rtObj.getTargetQuantity().toFixed(2)
	return Math.round(rtObj.getTargetQuantity() * 100) / 100;
}

function getMatchedGroups(approvalModule,approval) // Return matched approval groups
{
	var approval_groups= new Array();
	var matched_groups = new Array();
	var lOperator = vars['$lo.operator']['name'];
	var cm3rGroups = getChangeGroups();
	
    var smGroups   = vars['$G.sm.environment']['approval.groups'].toArray();
    if (system.functions.index(lOperator, cm3rGroups) == 0) cm3rGroups.push(lOperator);
    
    if (system.functions.index(lOperator, smGroups) == 0) smGroups.push(lOperator);	
	
	 
	if (approvalModule == null){
	 lib.ArrayUtil.addAllWithoutDuplicate(approval_groups, cm3rGroups);	  
	  lib.ArrayUtil.addAllWithoutDuplicate(approval_groups, smGroups);	  
	
	} else if (approvalModule == 'Change') {
	   
	    approval_groups = cm3rGroups;
	 
	    
	} /*comment out the code for 2020.02 release
        else if (approvalModule == 'Quote') {
	  var test;
	   
	   	    if (lib.ProcessDesignerEnablement.isRequestEnabled()) {
	   	    
		var requestGroups = lib.GatewayAPI_Util.getRequestGroups();
		
		if (system.functions.index(lOperator, requestGroups) == 0) requestGroups.push(lOperator);
		
    	approval_groups = requestGroups;
    	
    	
    	if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
		    var ocmqGroups = getQuoteGroups();  
			if (system.functions.index(lOperator, ocmqGroups) == 0) ocmqGroups.push(lOperator);
    		approval_groups = approval_groups + ocmqGroups;
    	}
       } else {
	    var ocmqGroups = getQuoteGroups(); 
        if (system.functions.index(lOperator, ocmqGroups) == 0) ocmqGroups.push(lOperator);		

    	approval_groups = ocmqGroups;
    	      
       } */
      else if (approvalModule == 'Request') {  
        var requestGroups = lib.GatewayAPI_Util.getRequestGroups(); 
        approval_groups = requestGroups;   
	   
	} else if (approvalModule == 'Service'){	   
		approval_groups = smGroups;
	} 	
	
	
    approval_groups = lib.ApprovalDelegationGroups.addDelegateGroups( approval_groups, approval['file.name']);	
    
	    
   
	 var pending_groups = new Array();
      var future_groups = new Array();
     
       
	 if(approval['current.pending.groups'] !=null )
	    pending_groups = approval['current.pending.groups'].toArray();
	
	 if(approval['future.groups'] != null )
	    future_groups = approval['future.groups'].toArray();    
	   
	    
	     var length_array_groups = lib.ArrayUtil.length(approval_groups);
  
	for(var i = 0; i < length_array_groups; i++) {
	
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
	var cartitem_fields = ['cartItemId', 'svcCatalogId', 'recurring.cost', 'recurring.cost.interval'];
 	var select_incident_phrase = "";
 	if (incident_fields) {
 		for (var i=0; i<incident_fields.length;i++) {
	 		select_incident_phrase += INCIDENT_TABLE + "." + incident_fields[i] + ",";
	 	}
 	}
 	if (!select_incident_phrase) {
 		select_incident_phrase = INCIDENT_TABLE + ".*,";
 	}
 	var select_cartitem_phrase = "";
 	for (var i=0; i<cartitem_fields.length; i++) {
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
 		+ " on ( " + INCIDENT_TABLE + ".incident.id = " + CARTITEM_TABLE + ".sdID ) WHERE " + INCIDENT_TABLE + ".incident.id=\"%s\""; 
 	sql = queryBuilder(sql, [incidentId]);
 	return sql;
}

function getServiceType(incidents){
	var serviceType = null;
	if (incidents['category'] == 'service catalog') {
	    serviceType = 'service catalog';
	} else { // if category in not "service catalog", determine its type need to know whether it related to one cart
	    if (incidents['source.service'] == 'support catalog') serviceType = 'support catalog';
	    else serviceType = 'self-service';
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
    if(component == null || component == "null")
    	component = 'NULL';
    else
    	component = '"' + component + '"';
    var originalUpdateTime = file['sysmodtime']; 
	 //check if approvals are up2date or not, if not up2date, set Exit Type:INCIDENT_NOT_UPDATE2DATE with returnCode:999, then return;
    if (_getIfApprovalModLaterThanTime( id, fileName,approvalType,originalUpdateTime,component)){
       setExitType(CURRENTRECORD_NOT_UPDATE2DATE);
       return;
       }
	//Validate comments
    if(comments==null || comments.length() == 1 && comments[0] == null) {
    	setExitType(BAD_VALIDATION_EXIT);
    	var returnCode;
    	system.functions.rtecall('msg', returnCode, system.functions.scmsg(130, 'SvcCatAPI'));
    	return;
    }
    
    vars['$denyAllComment'] = comments;
    
   
    
    var query = 'unique.key="' + id + '" and file.name="' + fileName + '" and name="' + approvalType + '" and component=' + component;

    if (arg) {  
		// get approvals for cart items
		var cartItems = getSDCartItems(id);
		var cartItemsStr = "";
		
		for (var i=0; i<cartItems.length; i++) {
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
       if( matched_groups != null && matched_groups != "")
          approval['matched.groups.src'] = matched_groups;
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
    if(component == null || component == "null")
    	component = 'NULL';
    else
    	component = '"' + component + '"';
    var comments = file['comments'];
    var originalUpdateTime = file['sysmodtime']; 
     //check if approvals are up2date or not, if not up2date, set Exit Type:INCIDENT_NOT_UPDATE2DATE with returnCode:999, then return;
    if (_getIfApprovalModLaterThanTime( id, fileName,approvalType,originalUpdateTime,component)){
       setExitType(CURRENTRECORD_NOT_UPDATE2DATE);
       return;
       }
	//Validate comments
    if(comments==null || comments.length() == 1 && comments[0] == null) {
    	comments = [""];
    }
    vars['$denyAllComment'] = comments;
    
    var query = 'unique.key="' + id + '" and file.name="' + fileName + '" and name="' + approvalType + '" and component=' + component;
    if (arg) {  
		// get approvals for cart items
		var cartItems = getSDCartItems(id);
		var cartItemsStr = "";
		
		for (var i=0; i<cartItems.length; i++) {
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
         if( matched_groups != null && matched_groups != "")
            approval['matched.groups.src'] = matched_groups;
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

const APPROVAL_STATUS_FIELDS = ['unique.key','approver.fullname','approver','class','dateStr','desc','level','status','name','component','file.name','sysmodtime'];
function getCurrentApprovals() {
    setExitType(NORMAL_EXIT);

    var File = lib.DBUtils.File;
    var id = vars['$L.file']['id'];
    var fileName = vars['$L.file']['temp1'];
    if(fileName==null || fileName==='') {
    	fileName = "incidents";
    }
    
    // get incident id if type is svcCartItem
    if (fileName == "svcCartItem") {
    	var fCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
        fCartItem.setFields(['sdID']);
        var fCartItemRlt = fCartItem.doSelect('cartItemId="' + id + '"');
        if(fCartItemRlt == RC_SUCCESS) { // if the incidents record exists, the treat the same as we are getting the approval log for incidents
        	id = fCartItem.sdID;
        	fileName = "incidents";
        }
    }

    var query = 'file.name="' + fileName + '" and unique.key="' + id + '"';
    
    // get related cart items if type is incidents
    if (fileName == "incidents") {
        var fCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
        fCartItem.setFields(['cartItemId']);
        var fCartItemRlt = fCartItem.doSelect('sdID="' + id + '"');
        var itemCount = 0;
        if(fCartItemRlt == RC_SUCCESS) {
        	query += ' or (file.name="svcCartItem" and unique.key isin {';
        }
        while(fCartItemRlt == RC_SUCCESS) {
            if(itemCount>0) {
            	query += ',';
            }
            query += '"' + fCartItem.cartItemId + '"';
            itemCount++;
            
    		fCartItemRlt = fCartItem.getNext();
    	}
    	if(itemCount>0) {
        	query += '})';
        }
    }
    
    var fApproval = new SCFile("Approval", SCFILE_READONLY);
    var fRlt1 = fApproval.doSelect(query);
    var count = 0, pendingCount = 0;
    var ofb = new OperatorFullnameBroker();
    while (fRlt1 == RC_SUCCESS) {
        var allStatusSize = system.functions.lng(fApproval.all_status);
        var historyCountInOneApproval = 0;
        for (var i = 0; i < allStatusSize; i++) {
            if(!fApproval.all_status[i].approver) {
            	continue;
            }
            // unique key fields
            vars['$L.file']['ApprovalStatus'][count]['unique.key'] = fApproval['unique.key'];
            vars['$L.file']['ApprovalStatus'][count]['file.name'] = fApproval['file.name'];
            vars['$L.file']['ApprovalStatus'][count]['name'] = fApproval['name'];
            vars['$L.file']['ApprovalStatus'][count]['component'] = fApproval['component'];
            // user blank string to show NULL
            vars['$L.file']['ApprovalStatus'][count]['desc'] = fApproval.all_status[i].desc;
            // set comments to field class
            vars['$L.file']['ApprovalStatus'][count]['class'] = getCommentsAsString(fApproval['comments']);
            vars['$L.file']['ApprovalStatus'][count]['level'] = system.functions.nullsub(fApproval.all_status[i].level,"");
            if(fApproval.all_status[i].status == "Pending" || fApproval.all_status[i].status == "Future") {
	            vars['$L.file']['ApprovalStatus'][count]['approver'] = system.functions.nullsub(fApproval.all_status[i].approver,"");
	            vars['$L.file']['ApprovalStatus'][count]['approver.fullname'] = ofb.getFullnameByLoginName(fApproval.all_status[i].approver, true);
	        } else { // for history status (Approved/Denied), directly use the info in Approval record
	        	if(fApproval['approved.by'] && fApproval['approved.by'].length()>historyCountInOneApproval) {
	        		vars['$L.file']['ApprovalStatus'][count]['approver'] = fApproval['approved.by'][historyCountInOneApproval];
	        	}
	        	if(fApproval['approved.by.fullname'] && fApproval['approved.by.fullname'].length()>historyCountInOneApproval) {
	        		vars['$L.file']['ApprovalStatus'][count]['approver.fullname'] = fApproval['approved.by.fullname'][historyCountInOneApproval];
	        	}
	        	historyCountInOneApproval ++;
	        }
            if((fApproval.approval_status == "pending" || fApproval.approval_status == "future") 
              && (fApproval.all_status[i].status == "Pending" || fApproval.all_status[i].status == "Future")) {
                pendingCount = pendingCount+1;
            }
            //No need to localize approval status as client use it to do jugement.
            var tmpvStatus1 = system.functions.nullsub(fApproval.all_status[i].status,"");
            /*var tmpvStatus2 = system.functions.scmsg(tmpvStatus1,"global");
            if (tmpvStatus2.indexOf("Could not be found")>-1){
            	tmpvStatus2 = tmpvStatus1;
            }
            //End Localization
            vStatus.push(tmpvStatus2);*/
            //vars['$L.file']['ApprovalStatus'][count]['status'] = tmpvStatus1;
            //If the approval is inactive, change the status to "Future" to align with SM 
            if (fApproval.approvals_record == false && tmpvStatus1 == "Pending")
            {
                vars['$L.file']['ApprovalStatus'][count]['status']="Future";
            }
            else
            {
                vars['$L.file']['ApprovalStatus'][count]['status'] = tmpvStatus1;
            }
            vars['$L.file']['ApprovalStatus'][count]['dateStr'] = fApproval.all_status[i].date;
            vars['$L.file']['ApprovalStatus'][count]['sysmodtime'] = fApproval.sysmodtime;
            
            count++; 
        }
        
        fRlt1 = fApproval.getNext();
    }
    vars['$L.file']['pending.future.count']=  pendingCount;

    // order by field dateStr desc (for approved/denied records), if it is empty then order by field status (Pending/Future)
    var approvalStatuses = vars['$L.file']['ApprovalStatus'];
    if(!approvalStatuses) {
    	return;
    }
    var len = approvalStatuses.length();
    var fieldLen = APPROVAL_STATUS_FIELDS.length;
    var fieldName, fieldValue;
    for(var i=0; i<len-1; i++) {
    	for(var j=i+1; j<len; j++) {
    		if ( (approvalStatuses[i]['dateStr']!=null && approvalStatuses[j]['dateStr']!=null && approvalStatuses[i]['dateStr']<approvalStatuses[j]['dateStr']) // both are approved/denied records, order by date desc
    		  || (approvalStatuses[i]['dateStr']==null && approvalStatuses[j]['dateStr']==null && approvalStatuses[i]['status']<approvalStatuses[j]['status']) // both are pending/future records, order by status desc
    		  || (approvalStatuses[i]['dateStr']!=null && approvalStatuses[j]['dateStr']==null) // put pending/future records ahead of approved/denied records
    		) {
    			for(var k=0; k<fieldLen; k++) {
    				fieldName = APPROVAL_STATUS_FIELDS[k];
    				fieldValue = approvalStatuses[i][fieldName];
    				approvalStatuses[i][fieldName] = approvalStatuses[j][fieldName];
    				approvalStatuses[j][fieldName] = fieldValue;
    			}
    		}
    	}
    }
}

function getCommentsAsString(lNewComments) {
    var retStr = '';
    var size = system.functions.lng(system.functions.denull(lNewComments));
    for (var i = 0; i < size; i++) {
        retStr += system.functions.nullsub(lNewComments[i],"") + '\n';
    }
    return retStr;
}


function getApprovalLogs() {
    setExitType(NORMAL_EXIT);
    
    var File = lib.DBUtils.File;
    var id = vars['$L.file']['id'];
    if (id == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(138)); 
		return;
    }
    var filename = "";
    var copyFields = ['action','component','current.phase','date','file.name','group','name','operator.fullname','unique.key'];
    var cnt = 0;
    
    // Get directly logs
    var dirLogs = new File('ApprovalLog').getRecords('unique.key="' + id + '"');
    if (dirLogs != null) {
        dirLogs.each(function (dirLog) {
            for (var i = 0; i < copyFields.length; i++) {
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
                        for (var i = 0; i < copyFields.length; i++) {
                            vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = relLog[copyFields[i]];
                        }
                        
                        vars['$L.file']['ApprovalLogs'][cnt]['item.name'] = cartItem['item.description'];
                        cnt++;
                    });
                }
            });
        }
    }
    /*
    if (cnt == 0) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(141, [system.functions.scmsg(filename, "tablename"),id])); 
		return;
    }
    */
}

function _arrayCopy(sourceArray, targetArrayStructure, fieldName) {
	for(var i = 0; i < sourceArray.length(); i++) {
		targetArrayStructure[i][fieldName] = sourceArray[i];
	}
}

function getApprovalInboxOwnSql()
{
    var lOperator = vars['$lo.operator']['name'];
    
    
    var cm3rGroups = getChangeGroups();
    var ocmqGroups = getQuoteGroups();
    var requestGroups = getRequestGroups();
  
    var smGroups   = vars['$G.sm.environment']['approval.groups'].toArray();
    cm3rGroups = appendArrayElement(cm3rGroups, lOperator);
    ocmqGroups = appendArrayElement(ocmqGroups, lOperator);
    requestGroups = appendArrayElement(requestGroups, lOperator);
    smGroups = appendArrayElement(smGroups, lOperator);
    
    var customSql = lib.ApprovalCustomPlugin.appendCustomApprovalSql();
    var sql = generateApprovalInboxBaseSql(cm3rGroups, smGroups, requestGroups);
    /* by xjma, comment the request approvals for the 2019.01 release
    var ocmqSql  = 'file.name="ocmq" and current.pending.groups isin ' + system.functions.str(ocmqGroups);
    if (lib.ProcessDesignerEnablement.isRequestEnabled()) {
    	var requestSql  = 'file.name="request\" and current.pending.groups isin ' + system.functions.str(requestGroups);
    	sql += ' or (' + requestSql + ')';
    	if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
    		sql += ' or (' + ocmqSql  + ')';
    	}
    } else {
    	sql += ' or (' + ocmqSql  + ')';
    }
    */
    if (customSql) sql += customSql;
    return sql;
}

function appendArrayElement(groups, operator) {
    var index = funcs.index(operator, groups);
    if (index > 0) {
        groups = funcs._delete(groups, index);
    }
    groups.push(operator);
    return groups;
}

function generateApprovalInboxBaseSql(cm3rGroups, smGroups, requestGroups) {
    var cm3rGroupsStr = system.functions.str(cm3rGroups);
    var smGroupsStr = system.functions.str(smGroups);
    var requestGroupsStr = system.functions.str(requestGroups);
    if (cm3rGroupsStr == smGroupsStr && smGroupsStr == requestGroupsStr) {
        return '(file.name="cm3r" or file.name="incidents" or file.name="svcCartItem" or file.name="request") and current.pending.groups isin ' + cm3rGroupsStr;
    }
    var changeSql = 'file.name="cm3r" and current.pending.groups isin ' + cm3rGroupsStr;
    if (smGroupsStr == requestGroupsStr) {
        return '(' + changeSql + ') or ((file.name="incidents" or file.name="svcCartItem" or file.name="request") and current.pending.groups isin ' + smGroupsStr + ')';
    }
    var requestSql = 'file.name="request" and current.pending.groups isin ' + requestGroupsStr;
    if (cm3rGroupsStr == smGroupsStr) {
        return '((file.name="cm3r" or file.name="incidents" or file.name="svcCartItem") and current.pending.groups isin ' + smGroupsStr + ') or (' + requestSql + ')';
    }
    var sdCartItemSql = '(file.name="incidents" or file.name="svcCartItem") and current.pending.groups isin ' + smGroupsStr;
    if (cm3rGroupsStr == requestGroupsStr) {
        return '((file.name="cm3r" or file.name="request") and current.pending.groups isin ' + cm3rGroupsStr + ') or (' + sdCartItemSql + ')';
    }
    return '(' + changeSql + ') or (' + sdCartItemSql + ') or (' + requestSql + ')';
}

function generateApprovalInboxSql() {
    var sql = 'approval.status="pending" and (approvals.record=NULL or approvals.record=true)';
    var ownSql = getApprovalInboxOwnSql();
    var delegateSql = lib.ApprovalDelegationGroups.getDelegationSql();
    
    if (delegateSql) sql += ' and (' + ownSql + delegateSql + ')';
    else sql += ' and (' + ownSql + ')';
    
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
		sql = '(file.name isin {"svcCartItem","incidents","cm3r","request"';
		// by xjma, comment the request approvals for the 2019.01 release 
		// sql += ',"' + requestFileNames.join('", "') + '"';
		sql += '})';
	} else if (approvalModule == 'Change') {
		sql = 'file.name="cm3r"';
	} /*else if (approvalModule == 'Quote') {
		sql = '(file.name isin {"';
		sql += requestFileNames.join('", "');
		sql += '"})';*/
	  else if (approvalModule == 'Request') {
        sql = 'file.name="request"'; 	
	} else if (approvalModule == 'Service'){
		sql = '(file.name isin {"svcCartItem","incidents"})';
	} else {
		throw lib.GatewayAPI_Util.getMessage(181)
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
	
	var arrConfig = new Array();
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
	var fields = new Array();
	for (var obj in arrConfig){
		fields = unionArray(arrConfig[obj]['fields'], fields);
	}
	return fields;
}

function unionArray(arrayA, arrayB) {
    for (var i = 0; i < arrayA.length; ++i) {
        var inArrID = false;
        for (var j = 0; j < arrayB.length; ++j) {
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

function _getInteractionSQLByQuery(id ,query) {
    return 'incident.id = "' + id + '" and (' + query + ')';
										  
}

function getIncidentRecords(id, aclQuery) {
    var File = lib.DBUtils.File;
    var fields = ['opened.by.uid', 'contact.name'];
    if (aclQuery) {
        // try to get incident record for custom tab query
        return new File("incidents", fields).getRecords(_getInteractionSQLByQuery(id, aclQuery));
    }
    var query = lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getInteractionSQL(id, vars.$lo_operator.name);
    var incidentRecords = new File("incidents", fields).getRecords(query);
    if (incidentRecords != null) {
        return incidentRecords;
    }
    incidentRecords = new File("incidents", fields).getRecords(lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getInteractionApprovalSQL(id));
    if (incidentRecords != null) {
        return incidentRecords;
    }
    return new File("incidents", fields).getRecords(lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getCartItemApprovalSQL(id));
}											   

function getInteractionComments(){
    setExitType(NORMAL_EXIT);
    var File = lib.DBUtils.File;
    var id = vars['$L.file']['id'];
    var aclQuery = vars['$L.file']['query'];										
    if (id == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(138)); 
		return;
    }
    var incidentRecords = getIncidentRecords(id, aclQuery);
    var requestor;
    var openedByUid;
    if (incidentRecords)
    {
        requestor = incidentRecords.scFile['contact.name'];
        openedByUid = incidentRecords.scFile['opened.by.uid'];
    } else {
        // No permission to view comments of this ticket
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(system.functions.scmsg(330, 'scjsdesc')); 
        return;
    }
	
    var filename = "incidents";
    // vars['$L.file']['filename'] = filename; // Use incidents as default by now. vars['$L.file']['filename']
    var copyFields = ['action','component','current.phase','date','file.name','group','name','operator.fullname','unique.key'];
    var cnt = 0;
    
    // Get directly logs
    var dirLogs = new File('ApprovalLog').getRecords('file.name="' + filename + '" and unique.key="' + id + '"');
    if (dirLogs != null) {
        dirLogs.each(function (dirLog) {
            for (var i = 0; i < copyFields.length; i++) {
                vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = dirLog[copyFields[i]];
            }
            
            vars['$L.file']['ApprovalLogs'][cnt]['comments'] = lib.GatewayAPI_Util.covertArrayToStringInLine(dirLog['comments']);
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
                        for (var i = 0; i < copyFields.length; i++) {
                            vars['$L.file']['ApprovalLogs'][cnt][copyFields[i]] = relLog[copyFields[i]];
                        }
                        
                        vars['$L.file']['ApprovalLogs'][cnt]['item.name'] = cartItem['item.description'];
                        vars['$L.file']['ApprovalLogs'][cnt]['comments'] = lib.GatewayAPI_Util.covertArrayToStringInLine(relLog['comments']);
                        cnt++;
                    });
                }
            });
        }
    }


    
    //get activities
    var xml = new XML();
    var idx=0;
    var cpFields = ['thenumber','number','type','datestamp','operator'];
    var acts = new File('activityservicemgt').getRecords('number="' + id + '" and cust.visible=true');
    
    var currentOperator = getCurrentOperator();
    
    
    if(acts!=null){
        var ofb = new OperatorFullnameBroker(); 
    	acts.each(function(act){
    		var operatorName = ofb.getFullnameByLoginName(act['operator']);
    		for(var i=0;i<cpFields.length;i++){
    			vars['$L.file']['ActivityLogs'][idx][cpFields[i]]=act[cpFields[i]];

    			vars['$L.file']['ActivityLogs'][idx]['operatorfullname']=operatorName;
    		}
    		//TODO: compile desction into xml stream.
    		var descSize = system.functions.lng(act['description']);
    		xml.setContent("<description/>");
    		for(var i=0;i<descSize;i++){
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

    // comment by xjma, this should not be 404
    //if (cnt == 0 && idx == 0) {
    //    setExitType(NO_RECORD_EXIT);
    //    setErrorMsg(lib.GatewayAPI_Util.getMessage(141, [system.functions.scmsg(filename, "tablename"),id])); 
	//	return;
    //}
    
    //get approval comments
    var fApproval = new SCFile("Approval");
    var lFilename = "incidents";
    var classTmp = "Request";
    var vComments = new Array();
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
        var fCartItem = new SCFile("svcCartItem");
        var fRlt2 = fCartItem.doSelect("sdID=\"" + id + "\"");
        while (fRlt2 == RC_SUCCESS)
        {
            var fApprovalItem = new SCFile("Approval");
            var fRlt3 = fApprovalItem.doSelect("file.name=\"" + system.functions.filename(fCartItem) + 
                         "\" and unique.key=\"" + fCartItem.cartItemId + "\"");
            while (fRlt3 == RC_SUCCESS)
            {
                var classTmp = fApprovalItem.component;
                if (classTmp == null) classTmp = fCartItem.item_description;
           
	            // integrate comments
                lib.ApprovalIntegration.buildNewComments(vComments, fApprovalItem.comments, classTmp, 'SRC');
	            
	            fRlt3 = fApprovalItem.getNext();
            }
            
            fRlt2 = fCartItem.getNext();
        }
    }
    
    vars['$L.file']['ApprovalComments'] = vComments;
    
}

function test() {
	var ofb = new OperatorFullnameBroker();
	var op = ofb.getOp('FALCON, JENNIFER');
	print(rteJSONStringify(op));
	var fullName = ofb.getFullnameByContactName('FALCON, JENNIFER');
	print(fullName);
	fullName = ofb.getFullnameByLoginName('falcon');
	print(fullName);
	fullName = ofb.getFullnameByLoginName('sdapprover');
	print(fullName);
	
	fullName = ofb.getFullnameByLoginName('Service Manager');
	print(fullName);
	fullName = ofb.getFullnameByLoginName('Service Manager', true);
	print(fullName);
}
//test();
