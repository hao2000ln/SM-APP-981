var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_Interaction_Info");

var select = lib.GatewayAPI_RAD._select;
var fun = system.functions;
var queryBuilder = lib.GatewayAPI_RAD._queryBuilder;

var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var getDisplayNameByLogicalName = lib.GatewayAPI_Util.getDisplayNameByLogicalName;
var defaultCurrency; // global variable
var tod = lib.GatewayAPI_RAD._tod;
var getDigitAfterDecimal = lib.GatewayAPI_Util.getDigitAfterDecimal;
var getRecurringCostInfo = lib.GatewayAPI_WSInterface_Interaction_Inbox.getRecurringCostInfo;
var _getInteractionSQLByOperator = lib.GatewayAPI_WSInterface_Interaction_Inbox._getInteractionSQL;
var us_convert_currency = lib.GatewayAPI_RAD.us_convert_currency;
var convert_currency=lib.GatewayAPI_svcCatApprovals.convert_currency;
var index = lib.GatewayAPI_RAD._index;
var getOperatorCurrency=lib.GatewayAPI_svcCatApprovals.getOperatorCurrency;

var fileName = "incidents";
var rate;
var _null=system.functions._null;
var lang;
var defaultLang="en";

function getInteractionInfo(){
	return _getInteractionInfo(false);
}

function getAllInteractionInfo(){
	return _getInteractionInfo(true);
}

function getIncident(isAll, id, operator, fields, aclQuery) {
    var query;
    if (aclQuery) {
      query = lib.GatewayAPI_svcCatApprovals._getInteractionSQLByQuery(id, aclQuery);
      return select("incidents", query, fields);
    }
    if(isAll) {
        query = _getFullInteractionSQL(id);
    } else {
        query = _getInteractionSQL(id, operator);
    }
    var incident = select("incidents", query, fields);
        
    if(incident != null) {
      return incident;
    }
    incident = select("incidents", _getInteractionApprovalSQL(id), fields);
    if(incident != null) {
      return incident;
    }
    return select("incidents", _getCartItemApprovalSQL(id), fields);
}  
function _getInteractionInfo(isAll){    
    setExitType(BAD_VALIDATION_EXIT);
    
    var	oper = getCurrentOperator();
    defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    var operCurrency=oper.display_currency_code;
	var sysCurrency=vars.$G_root_currency;
	if (operCurrency !=sysCurrency){
		rate = lib.GatewayAPI_Cache.getCurrencyRateCache().get(operCurrency, sysCurrency);
    } 
    lang = vars.$L_file.kpf_id;
    var company = vars['$lo.operator']['company'];
	if (company == null) company = 'DEFAULT';
	var configs = _getAllSrcConfig(company);
    
    var file = vars['$L.file'];
    var id = file['incident.id'];
    var aclQuery = file['other'];
    file['other'] = null;
    
    var fields  = ['severity', 'open.time', 'opened.by'
    			   , 'description'
    			   , 'opened.by.uid','affected.item', 'open', 'callback.type'
                   , 'category', 'priority.code', 'subcategory', 'product.type', 'resolution.code', 'callback.contact'
                   , 'needed.by.time', 'approval.status', 'cartId'
                   , 'title'
                   , 'bRequestOnBehalf','contact.fullname','callback.contact.fullname'
                   , 'owner.name', 'callback.type','svc.cost',
                   'contact.name','logical.name','other','source.service','resolution','category'
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
    var incident = getIncident(isAll, id, oper.name, fields, aclQuery);
    
    if (incident != null){
        _setToFile(incident, configs,rate);
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
        if(incident['bRequestOnBehalf']==true)
        {
          var canResubmitROB=_checkCanResubmit(incident,oper.name);
          if(canResubmitROB==true && system.functions.str(vars.$L_tableAccess_update)=="true")
          		vars.$L_file['vendor']="true";
          else vars.$L_file['vendor']="false";
        }
        
        if(incident['open']=="Closed")
           vars.$L_file['room'] = "false"
        else        
           vars.$L_file['room'] = system.functions.str(vars.$L_tableAccess_close);	
           
        var cartId = incident['cartId'];
   	    if(cartId!=null) {
	            	setDetailCartItems(cartId,rate,lang);
		}  
    
    } else {
    	setExitType(NO_RECORD_EXIT);
    	vars.$L_file=null;
    	return;
	}
     
    setExitType(NORMAL_EXIT);
    return;
}


function _getInteractionApprovalSQL(id){
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$gwgroups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'incidents');
    return 'select * from incidents a inner join Approval b on (a.incident.id=b.unique.key) where b.current.pending.groups isin $gwgroups and a.incident.id="'+id+'"';   
}

function _getCartItemApprovalSQL(id){
	var dbtype = system.functions.dbdict_helper('db.type');
	if(dbtype=='postgresql'){
		return _getCartItemApprovalSQLForPostgres(id);
	}
	
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$gwgroups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'incidents');    
    var sql = 'select * from incidents a inner join svcCartItem c on (a.incident.id=c.sdID) inner join Approval b on (c.cartItemId=b.unique.key and b.file.name="svcCartItem") where b.current.pending.groups isin $gwgroups and a.incident.id="'+id+'"';
    return sql;
}

function _getCartItemApprovalSQLForPostgres(id){
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$gwgroups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'incidents');   
     
    var sql = 'select c.cartItemId from incidents a inner join svcCartItem c on (a.incident.id=c.sdID) where a.incident.id="'+id+'"';
    var itemList = [];
    lib.c.$('incidents', SCFILE_READONLY).select(sql).iterate(function(item){itemList.push(''+item[0])});
   	vars.$cartItemForApproval = itemList;
   	var sqlApproval = 'unique.key isin $cartItemForApproval and file.name="svcCartItem" and current.pending.groups isin $gwgroups';
   	
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

function _setToFile(incident, configs,rate){
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
	         var xml = _buildXmlFromFile(incident, configs[serviceType].fields);
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
    if (rate != null ) {
		vars.$L_file['svc.cost'] = incident['svc.cost']==null?incident['svc.cost']:incident['svc.cost']*rate;
	}
	if (incident['contact.fullname'] == null){
		var tmpContact = lib.GatewayAPI_Util.getContactFields(incident['contact.name'], ['full.name']);
		vars.$L_file['contact.fullname'] = tmpContact['full.name'];
	} else {
		vars.$L_file['contact.fullname'] = incident['contact.fullname'];
	}
	if (incident['callback.contact.fullname'] == null){
		var tmpContact = lib.GatewayAPI_Util.getContactFields(incident['callback.contact'], ['full.name']);
		vars.$L_file['callback.contact.fullname'] = tmpContact['full.name'];
	} else {
		vars.$L_file['callback.contact.fullname'] = incident['callback.contact.fullname'];
	}
	
	if (incident['contact.name'] !=null){
		var contactsfile=lib.GatewayAPI_Util.getContactFields(incident['contact.name'],['operator.id']);
		var contactOperator= contactsfile['operator.id'];
		if (contactOperator!=null){
			var data ={};
			data[funcs.filename(vars.$L_file)] ={ "extra_rest_contactOperator":contactOperator};
			vars["$extra.rest.data"]=lib.smis_CommonLib.toJSON(data);
		}
	}
	
    vars.$L_file['cartId'] = incident['cartId'];
    vars.$L_file['logical.name'] = incident['logical.name'];
    vars.$L_file['title'] = incident['title'];
    vars.$L_file['bRequestOnBehalf'] = incident['bRequestOnBehalf'];
    var contactValue = lib.GatewayAPI_Util.getContactValue(incident['callback.contact'], incident['callback.type'], incident['other']);
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

function findCartIndex(arr, id) {
	for(var i=0; i< arr.length; i++) {
		if(arr[i].cartItemId === id) {
			return i;
		}
	}
	return -1;
}

function setDetailCartItems(cartId,rate,lang,number) {
	if (cartId != null) {
	   if (!lang) {
         lang = defaultLang;
       }
	    var initsql="SELECT t1.cartItemId, t1.svcCatalogId,t1.item.description,t1.options options1,t1.optionList,t1.option.costs,t1.quantity, t1.cost, t1.requested.for.fullname,"
        +"t1.requested.for.type, t1.requested.for.dept, t1.status,t1.recurring.cost,t1.recurring.cost.interval,t1.requested.for, t1.bundle, t1.bundle.options,t1.approval.status,t1.delivery,t1.serviceSLA,"
        +"t2.displayName displayName, t2.options options2, t2.syslanguage lang"
        +" FROM  svcCartItem t1 left outer join svcDisplay t2 on (t1.item.description=t2.name)"
        +" WHERE cartId="+cartId;
        if (number) {
            initsql=initsql + " and t1.action.id=\"" + number + "\"";
        }
        var strQuery=initsql;
		if(lang != defaultLang) {
		  strQuery=strQuery+"and (t2.syslanguage=\"" +lang+ "\" OR t2.syslanguage=\"" +defaultLang+ "\")";
		} else {
		  strQuery=strQuery+"and t2.syslanguage=\"" +lang+ "\"";
		}
        var svcCartItem = select ("svcCartItem", strQuery);
        if (lang != defaultLang && svcCartItem == null) {
        //if there is no record for the target language, get the default one.
          strQuery = initsql+" and t2.syslanguage=\"" +defaultLang+ "\"";
          svcCartItem = select ("svcCartItem", strQuery);
        }
    
		if (svcCartItem != null) {	
		    var cartItems = [];	
			do {
				var	itemCost = svcCartItem.cost;
				var	itemrecurringCost = svcCartItem.recurring_cost;
				if (rate != null ) {
					itemCost = svcCartItem.cost==null?svcCartItem.cost:svcCartItem.cost*rate;
					itemrecurringCost = svcCartItem.recurring_cost==null?svcCartItem.recurring_cost:svcCartItem.recurring_cost*rate;
				}

				//log.info("svcCartItem[optionList] : " + svcCartItem['optionList'])
			    var currentItem = {
				  cartItemId: svcCartItem['cartItemId'],
				  catalogId: svcCartItem['svcCatalogId'],
				  name: svcCartItem['item.description'],
				  displayName:svcCartItem['displayName'],
				  bundle:svcCartItem['bundle']==true?"true":"false",
				  optionCosts:svcCartItem['option.costs'],
				  optionsValue:svcCartItem['options1'],
				  options:svcCartItem['bundle']==true?svcCartItem['bundle.options']:svcCartItem['options1'],
				  bundleOptions:svcCartItem['bundle']==true?svcCartItem['options2']:null,
				  optionList:convertOptionsToList(svcCartItem['options1']),
				  //optionList:svcCartItem['optionList'] ==null?'':svcCartItem['optionList'].toArray(),
				  quantity: svcCartItem['quantity'],
				  currency: getOperatorCurrency(),
				  cost: itemCost,
				  requestedForFullName: svcCartItem['requested.for.fullname'],
				  requestedForType: svcCartItem['requested.for.type'],
				  requestedForDept: svcCartItem['requested.for.dept'],
				  requestedFor:svcCartItem['requested.for'],
				  status: svcCartItem['status'],
				  approvalStatus: svcCartItem['approval.status'],
				  recurringCost:itemrecurringCost,
				  recurringCostInterval:svcCartItem['recurring.cost.interval'],
				  delivery:svcCartItem['delivery'],
				  serviceSla:svcCartItem['serviceSLA']
				}
				if(lang === defaultLang) {
				  cartItems.push(currentItem);
				} else {
				  var findIndex = findCartIndex(cartItems, currentItem.cartItemId);
				  if(findIndex !== -1 && svcCartItem.lang === lang) {
				    cartItems.splice(findIndex, 1, currentItem);
				  } else if(findIndex === -1) {
				    cartItems.push(currentItem);
				  }
				}
				rc = svcCartItem.getNext();
			} while (rc == RC_SUCCESS);
			// convert the cart items into json string and set to returned object (as RTE currently does not support array of object),use folder to mapping cartItemsJson since it is not allowed to add new field in dbdict for gatewayAPI.
				vars.$L_file['folder'] = rteJSONStringify(cartItems); // the returned caption is cartItems
	
		} 
	} 
}

function convertOptionsToList(options) {
  var list = [];
  if (options != null && options != "" && options != "<form/>") {
    var optionXML = new XML();
    if (optionXML.setContent(options)) {
      var element = optionXML.getFirstChildElement();
      if (element != null) {
        while (element != null && element.getName() != null && element.getName() != "") {
          var v = element.getValue();
          list.push(element.getAttributeValue("id") + ":" + v);
          element = element.getNextSiblingElement();
        }
      }
    }
  }

  return list;
}

	
function convertOptionList(optionList) {
	var newOptionList = new Array();
	if (!optionList) return optionList;
	var newIndex = 0;
	for (var i = 0; i < optionList.length() && optionList[i] ; i++) {
		if (optionList[i].indexOf(":") == -1) {
			newOptionList[newIndex - 1] += "\n" + optionList[i];
		} else {
			newOptionList.push(optionList[i]);
			newIndex++;
		}
	}
	return newOptionList;
}


function _getSvcCartItemByCartSQL(cartId){
	var sql = "(cartId = %s)";
	return queryBuilder(sql, [cartId]);
}


function _checkCanResubmit(incident,loginName){
	var contactfile=lib.GatewayAPI_Util.getContactFields(incident['callback.contact'], ['operator.id']);
	var callBackContact=contactfile['operator.id'];
	if (callBackContact!=null&&callBackContact==loginName){
		return true;
	}
	else {
		return false;
	}
}

function _getAllSrcConfig(company) {
	var query = 'company="' + company + '" and module="incidents"';
	var configs = select('gwPortalFormConfig', query);
	
	if (!configs) {
		query = "company=\"DEFAULT\" and module=\"incidents\"";
		configs = select('gwPortalFormConfig', query);
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

/**
* Get the first portal configuration for specified module, module can be cm3r, request and etc.
*
* @param {string} module module name
* @returns {object} src config that maybe null
*/
function getSrcConfigByModule(module) {
    var company = vars['$lo.operator']['company'];
    var configs;
    var query;
    if (company != null) {
        query = 'company="' + company + '" and module="' + module + '"';
        configs = select('gwPortalFormConfig', query);  
    }
    if (!configs) {
        query = "company=\"DEFAULT\" and module=\"" + module + "\"";
        configs = select('gwPortalFormConfig', query);
    }
    
    if (configs != null) {
         return new srcConfig(configs);
    }
    return null;
}

function srcConfig(config){
	this.screenType = config['screen.type'];
	log.info("this.screenType:"+ this.screenType);
	this.fields= config['fields'].toArray();
	log.info("this.fields:"+ this.fields);
}

/**
*  Construct xml content for SCFile by field list
*
*  @param {object} IFile - SCFILE
*  @param {array} fieldsAry - field list shown in xml content
*  @param {array} currencyFieldAry - contains cost fields in currency
*  @param {string} currency - convert number from this currency  to currency of current operator
*  @returns {string} xml content
*/
function buildXmlContentFromFile(lFile, fieldsAry,currencyFieldAry,currency) {
  return _buildXmlFromFile(lFile, fieldsAry,currencyFieldAry,currency);
}

function _buildXmlFromFile(lFile, fieldsAry,currencyFieldAry,currency) {
	if (fieldsAry == null)
		return null;

	var srcXml = new XML();
	srcXml.setContent('<fields></fields>');

	var relAry = ['null', 'number', 'character', 'datetime', 'logical', 'label', 'file', 'offset', 'array', 'structure', 'operator', 'expression'];
	var sType = function (value) // sType private function
	{
		var iType = fun.type(value);
		if (iType == null)
			iType = 0;

		return relAry[iType];
	}
		
	var xmlstr = function (value) // xmlstr private function
	{ 
		if (value == null)
			return '';
		var type = fun.type(value);
		if (type == 1 || type == 2 || type == 4) {
			return value;
		} else if (type == 3) {
			return new XMLDate(value).getISODateTimeString();
		} 
		 else // other not support type, only use RAD str function
		{
			return fun.str(value);
		}
	}

	for (var i in fieldsAry) {
		var field = fieldsAry[i];
		var value = lFile[field];
		if (!_null(value)) {
			var node = srcXml.createNode(1, 'field');
			node.addAttribute('name', field);
			if (lib.DataTypeConst.typeArray() == fun.type(value)) // Special customization  for 'description' and 'resolution'
			{
		      node.addAttribute('fieldType', 'character');
		      value=_arrayToCharacter(value);
			} else {
			  node.addAttribute('fieldType', sType(value));
			}
			// for special cost fields, convert the number.
			if (currencyFieldAry != null && index(field, currencyFieldAry) >=0) {
			  node.addAttribute("currency", getOperatorCurrency());
			  value = convert_currency(currency, value);
			}
			node.setText(xmlstr(value));
			if (lib.dynamicFormGenerator.needDisplayField(fileName, field)) {
				node.addAttribute("display", lib.DisplayName.getDisplayNameByLogicalName(value));
			}

			srcXml.appendNode(node);
		} 
	}
	return srcXml.toXMLString();
}

function _arrayToCharacter(value)
{
			var desc = "";
			for (var j = 0; j < value.length(); j++) {
				if (value[j] != null) {
					if (j == 0) {
						desc = value[j];
					} else {
						desc = desc + "\n" + value[j];
					}
				} else {
					if (j != 0) {
						desc = desc + "\n";
					}
				}
			}

			return desc;
}

