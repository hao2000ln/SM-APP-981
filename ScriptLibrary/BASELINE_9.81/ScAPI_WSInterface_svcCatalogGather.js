var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_svcCatalogGather");

var SVCCATALOG_FILE = lib.ScAPI_Constants.SVCCATALOG_FILENAME();
var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var tod = lib.ScAPI_RAD._tod;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var svcCat_get_catalog_structure = lib.ScAPI_RAD.svcCat_get_catalog_structure;
var svcCat_check_catalog = lib.ScAPI_RAD.svcCat_check_catalog;
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var getMsg = lib.ScAPI_Util.getMessage;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var currentOperator; 
var defaultCurrency;
var CHILDREN_TYPE = lib.svcCatalogMixTrigger.CHILDREN_TYPE;

function getItem() {

	currentOperator = getCurrentOperator();
	defaultCurrency = currentOperator.display_currency_code || vars.$G_root_currency;
	setExitType(NORMAL_EXIT);
	
	var contactName = vars.$L_file.contact_name;
	var oper = null;
	if (contactName != null) {
		oper = select("operator", 'contact.name="' + contactName + '"');
		if (oper == null){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMsg(102));
			return;
		}
	} else {
		oper = currentOperator;
		contactName = currentOperator['contact.name'];
	}
	var catalogs = svcCat_get_catalog_structure(contactName, oper);  //FALCON, JENNIFER,,, CAFFREY, AARON
	vars.$L_file.catalog = catalogs;

}

function getAllCategoryOrItem() {

	currentOperator = getCurrentOperator();
	defaultCurrency = currentOperator.display_currency_code || vars.$G_root_currency;
	setExitType(NORMAL_EXIT);
	
	var opertype = null;
	var categoryid = null;
	var categoryname = null;
	var contactName = vars.$L_file.contact_name;
	var oper = null;
	var item = null;
	if (contactName != null) {
		oper = select("operator", 'contact.name="' + contactName + '"');
		if (oper == null){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMsg(102));
			return;
		}
	} else {
		oper = currentOperator;
		contactName = currentOperator['contact.name'];
		vars.$L_file.contact_name = contactName;
	}
	
	categoryid = vars.$L_file.catalogid;
	
	if(categoryid !=null && categoryid !=""){
	   var strQuery = "id="+categoryid;
	   item = select(SVCCATALOG_FILE,strQuery);
	   if(item != null){
	      categoryname = item.name;
		  
	      var childrenType = item.children_type;
	      if (
	      		childrenType != null && 
	      		childrenType != CHILDREN_TYPE.ITEM && 
	      		childrenType != CHILDREN_TYPE.MIXED){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMsg(146));
			return;	   	      
	      }
		  
	      var catalogtype = item.type;
	      if(catalogtype != "category"){
		   setExitType(BAD_VALIDATION_EXIT);
		   setErrorMsg(getMsg(146));
		   return;	   	      
	      }	      
	   }
	   else{
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMsg(144));
			return;	   
	   }
	   opertype = "getallitem";
	}
	else{
	   opertype = "getallcategory";
	}
	
	var catalogs = svcCat_get_catalog_structure(contactName, oper, opertype, categoryname);
	vars.$L_file.catalog = catalogs;
}

function buildAllCatalogXML(strQuery){
	//get the target item
	var fields = ['type','id','name','category.type','parent', 'children.type'];
	var item = select(SVCCATALOG_FILE,strQuery,fields);
	
	if (item == null ) {
		return "";
	}
	var xmlStr = "<catalog>";
	var cur = null;
	var costConverted = null;
	var costTmp = 0;
	var digit = _getDigitAfterDecimal();
	do {
		var nodeStr = "<catalogItem type=\"" + item.type + "\">";
		
		nodeStr += "<catalogid>" + item.id + "</catalogid>";
		nodeStr += "<name>" + escapeStringforXML(item.name) + "</name>";
		nodeStr += "<categoryType>" + (item.children_type || CHILDREN_TYPE.EMPTY) + "</categoryType>";
		
		var parents = item.parent;
		var parArray;
		if (parents) {
			parArray = parents.toArray();
		}
		
		var nodeParentsStr = "";
		if (parArray && parArray.length>0) {
			nodeParentsStr += "<parents>";
			var j;
			for(j = 0; j < parArray.length; j++){
				var nodeParentStr = "";
				if (parArray[j] != null) {
					nodeParentStr += "<parent>" + escapeStringforXML(parArray[j]) + "</parent>";
					nodeParentsStr += nodeParentStr;
				}
			}
			nodeParentsStr += "</parents>";
		} else {
			nodeParentsStr += "<parents/>";
		}
		
		nodeStr += nodeParentsStr;
		nodeStr += "</catalogItem>";
		xmlStr += nodeStr;
	} while (item.getNext() == RC_SUCCESS);
	//compress and base64Encode the string before sending to RTE, will decrease the XML parse time used by SRC UI
	// It should not be base64 encoded in 931
	xmlStr += "</catalog>";
	return xmlStr;
}

function escapeStringforXML( value )
{
  if( value != null ) {
	  value = value.replace( /&/g, "&amp;" );   // escape all & characters
	  value = value.replace( />/g, "&gt;" );   // escape all > characters
	  value = value.replace( /</g, "&lt;" );   // escape all < characters
	  value = value.replace( /"/g, "&quot;" ); // escape all " characters to &quot;
	  value = value.replace(/'/g, "&apos;"); // escape all ' characters to &apos;
  }
  return value;
}

function constructXML1(strQuery){
	return "aaa";
}

function constructXML(strQuery){
	//get the target item
	var fields = ['type','id','name','category.type','parent','cost','recurring.cost','currency','recurring.cost.interval','class'];
	var item = select(SVCCATALOG_FILE,strQuery, fields);
	
	if (item == null ) {
		return "";
	}
	
	var convert = _getAllCurrencySourceToRoot(vars.$G_root_currency, tod());
	
	var xml = new XML();
	xml.setContent("<catalog/>");
	var cur = null;
	var costConverted = null;
	var costTmp = 0;
	var digit = _getDigitAfterDecimal();
	do {
		var node = xml.createNode(1,"catalogItem");
		node.setAttributeValue("type", item.type);
			
		//set Name
		node.appendNode(_createNode(xml,"name",item.name));
			
		//fix the currency
		cur = defaultCurrency;
			
		//set Cost -- convert the cost based on login user's currency
		if (item.type != "category"){
			if (item.cost == null || item.cost == "") {
			    item.cost = 0;
			}
			if (item['recurring.cost'] == null || item['recurring.cost'] == "") {
			    item['recurring.cost'] = 0;
			}
			if (item.currency == null || item.currency == "") {
			    item.currency = vars.$G_root_currency;
			}

			//set currency
			node.appendNode(_createNode(xml,"currency",cur));
			
			if (item.currency != cur){
				costConverted = currencyConvert(item.currency,cur,item.cost, vars.$G_root_currency, convert);
				costTmp = funcs.round(costConverted, digit);
				recurConverted = currencyConvert(item.currency,cur,item['recurring.cost'], vars.$G_root_currency, convert);
				recurTmp = funcs.round(recurConverted, digit);
			} else {
				costTmp = funcs.round(item.cost, digit);
				recurTmp = funcs.round(item['recurring.cost'], digit);
			}
			node.appendNode(_createNode(xml,"cost",costTmp));
			node.appendNode(_createNode(xml,"recurringCost",recurTmp));
		
			if (item["recurring.cost.interval"] == null){
				item["recurring.cost.interval"] = "";
			}
			node.appendNode(_createNode(xml,"per",item["recurring.cost.interval"]));
		}
		
		node.appendNode(_createNode(xml, "class", item['class']));
			
		var nodeParents = xml.createNode(1, "parents");
		var parents = item.parent;
		var parArray = parents.toArray();
		
		var j;	
		for(j = 0; j < parArray.length; j++){
			var nodeParent = xml.createNode(1, "parent");
			if (parArray[j] != null) {
				nodeParent.setValue(parArray[j]);
				nodeParents.appendNode(nodeParent);
			}
		}
		node.appendNode(nodeParents);
			
		xml.appendNode(node);
		
	} while (item.getNext() == RC_SUCCESS);
	return xml.toXMLString();
}

function _getDigitAfterDecimal() {

  var currency = new SCFile("currency", SCFILE_READONLY);
  currency.setFields(["digits.after.decimal"]);
  
  if (currency.doSelect("currency.code=\""+defaultCurrency+"\"") == RC_SUCCESS) {
  	 return currency.digits_after_decimal;
  } else {
  	 return 2;
  }
  
}

function _createNode(xml,nodeName,value) {
	
	if (value == undefined || value == null) {
	    return xml.createNode(1,nodeName);
	}
	
	var node = xml.createNode(1,nodeName);
	node.setValue(value);
	return node;
}

// Private methods
function _getContactByLoginName(loginName) {
	var operator = new SCFile("operator", SCFILE_READONLY);
	operator.setFields(["contact.name"]);
	if(operator.doSelect("name = \"" + loginName + "\"") == RC_SUCCESS){
		return operator.contact_name;
	}
}

//parameter requestFor is login name in operator
function _getInteractionInstance(requestFor) {
	
	var interaction = new SCFile("incidents");
	interaction["contact.name"] = requestFor;//vars.$lo_contact_name;
	interaction["callback.contact"] = requestFor;//vars.$lo_contact_name;
	interaction["alternate.contact"] = requestFor;//vars.$lo_contact_name;
	interaction["category"] = "service catalog";
	interaction["subcategory"] = "service catalog";
	interaction["problem.type"] = "service catalog";
	interaction["product.type"] = "service catalog";

	var link = lib.ScAPI_RAD.se_get_record("incidents", "name", "link", true); // TODO

	lib.ScAPI_RAD.us_link(interaction,"contact.name",link,"fill",true);//TODO for fill.contact.name
	lib.ScAPI_RAD.us_link(interaction,"callback.contact",link,"fill",true);//TODO for fill.callback.name
	lib.ScAPI_RAD.us_link(interaction,"alternate.contact",link,"fill",true);//TODO for fill.alternate.contact

	return interaction;
}

function _getAllCapabilityByUser(capWords){
	var capabilities = new SCFile("capability", SCFILE_READONLY);
	capabilities.setFields(["capability"]);
	var resultCap = [];
	var strCapWords = funcs.str(capWords);

	var result = capabilities.doSelect('parent.tree isin ' + strCapWords + ' or capability isin ' + strCapWords);
	if(result != null){
		do{
			resultCap.push(capabilities["capability"]);
			result = capabilities.getNext();
		}while(result == RC_SUCCESS);
	}
	return resultCap;
}

function _arrayToString(arr){
	var result = "{";
	var i;
	for(i = 0; i < arr.length; i++){
		result = result + "\"" + arr[i] + "\"";
		if(i != arr.length - 1){
			result = result + ",";
		}
	}
	result += "}";
	return result;
}

function _search(arr, value){
	if (arr == null) {
		return -1;
	}
	
	var len = 0;
	try {
		len = arr.length();
	} catch(e) {
		len = arr.length;
	}
	var i;
	for (i = 0; i < len; i++){
		if (arr[i] == value) {
		    return i;
		}
	}
	return -1;
}

function _getAllCurrencySourceToRoot(rootCurrency, date){
	var convert = [];
	var curconvert = select("curconvert",'date <= \''+ funcs.str(date)+'\' and root.code ="'+rootCurrency+'"');
	if (curconvert != null){
		do{
			if (convert[curconvert['currency.code']] == null){
				convert[curconvert['currency.code']] = new tmpConvert(rootCurrency, curconvert['currency.code'], curconvert['date'], curconvert['rate']);
			} else {
				if(convert[curconvert['currency.code']].date < curconvert.date){
					convert[curconvert['currency.code']] = new tmpConvert(rootCurrency, curconvert['currency.code'], curconvert['date'], curconvert['rate']);
				}
			}
		}while(RC_SUCCESS == curconvert.getNext());
	}
	//add same currency convert rate as 1
	convert[rootCurrency] = new tmpConvert(rootCurrency, rootCurrency, tod(), 1);
	return convert;
}

function tmpConvert(source, target, date, rate){
	this.source = source;
	this.target = target;
	this.date = date;
	this.rate = rate;
}

function currencyConvert(source, target, cost, rootCurrency, arrConvert){
	var result = 0;
	if (source == target){
		return cost;
	}
	if (arrConvert[source] != null){
		result = cost/arrConvert[source].rate;
		if (target == rootCurrency){
			return result;
		}
	} else {
		return -1;
	}
	if (arrConvert[target] != null){
		result = result * arrConvert[target].rate;
	} else {
		return -1;
	}
	return result;
}


function checkItem() {

	currentOperator = getCurrentOperator();
	defaultCurrency = currentOperator.display_currency_code || vars.$G_root_currency;
	setExitType(NORMAL_EXIT);
	
	var contactName = vars.$L_file.contact_name;
	var oper = null;
	if (contactName != null) {
		oper = select("operator", 'contact.name="' + contactName + '"');
		if (oper == null){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMsg(102));
			return;
		}
	} else {
		oper = currentOperator;
		contactName = currentOperator['contact.name'];
	}

	var result = svcCat_check_catalog(contactName, oper);  //FALCON, JENNIFER,,, CAFFREY, AARON
	vars['$L.file']['hasService'] = result.hasService();
	vars['$L.file']['hasSupport'] = result.hasSupport();
}

function getCount(sql){
	var catalog = select(SVCCATALOG_FILE,sql);
	if (catalog != null) {
	   return 1;
	}
	return 0;
}
