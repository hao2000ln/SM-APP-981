var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_Order_Info");

var select = lib.GatewayAPI_RAD._select;
var build_list = lib.GatewayAPI_RAD.build_list;
var SVCCATALOG_FILE = lib.GatewayAPI_Constants.JOINSVCDISPLAY_FILENAME();
var select = lib.GatewayAPI_RAD._select;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var indexOf = lib.GatewayAPI_Util.indexOf;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var getMessage = lib.GatewayAPI_Util.getMessage;
var escapeStringforXML=lib.StringUtil.escapeStringforXML;

//Define node name
var requested_for_node = "RequestedFor";
var requested_for_type_node = "RequestedForType";
var requested_for_dept_node = "RequestedForDept";
var delivery_node = "Delivery";
var serviceSLA_node = "ServiceSLA";
var quantity_node = "Quantity";

function displayInitOrderInfo() {

	var itemNames = vars.$L_file["names"];
	var	itemSize = itemNames.length();
	if (itemSize == 0){
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	var emptyList = true;
	for (var i = 0; i < itemSize; i++){
		var itemName = itemNames[i];
		var item = _getItemDetail(itemName);
		if (item != null ){
			emptyList = false;
			vars.$L_file["fields.definition"][i] = getOrderInfo(item);
			
		}
	}
	
	if (emptyList){
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	if (log.isDebug()) log.debug("Return file is : " + vars.$L_file);
	
}

function getOrderInfo(item, language){
	var cartItemHandler = lib.GatewayAPI_CartItem.createCartItemHandler( item.name, null, language );
	cartItemHandler.extractOrderInformation();
	return _populateFieldDefinition(cartItemHandler,item);
}


function _getItemDetail(name) {

	//Default type is "normal"
	setExitType(NORMAL_EXIT);
	var itemName = name;
	if (log.isDebug()) log.debug("Item Name is : "+itemName);
	if (itemName == null || itemName == "") return null;
	var item = select(SVCCATALOG_FILE,"name=\""+itemName+"\"");
	return item;
	
}

function _populateFieldDefinition(cartItemHandler,item){

	var fieldDefObjs = _getFieldDefObj(cartItemHandler,item);

	var xml = _populateFDXML(fieldDefObjs, item);
	
	return xml;
}

function _populateFDXML(fieldDefObjs, item){
	var xml = new XML();
		xml.setContent("<fields item=\"" + escapeStringforXML(item.name) + "\"/>");
	
	if (item.type != "item" && item.type != "bundle") return xml.toXMLString();
	
	var chField,chName,chCanValues,chCanValue;
	var tmpArray;
	
	for (var i=0;i<fieldDefObjs.length;i++) {
		field = _createNode(xml,"field");
		field.setAttributeValue("name",fieldDefObjs[i].name);
		
		chCanValues = _createNode(xml,"candidateValues");
		tmpArray = fieldDefObjs[i].values;
		
		for (var j in tmpArray) {
			chCanValue = _createNode(xml,"candidateValue",tmpArray[j].caption);
			chCanValue.setAttributeValue("id",tmpArray[j].id);
			chCanValues.appendNode(chCanValue);
		}
		
		field.appendNode(chCanValues);
		field.setAttributeValue("mandatory",fieldDefObjs[i].mandatory);
		
		xml.appendNode(field);
	}
	return xml.toXMLString();
}

function _createNode(xml,nodeName,value) {
	
	if (value == undefined || value == null) return xml.createNode(1,nodeName);
	
	var node = xml.createNode(1,nodeName);
	node.setValue(value);
	return node;
}


function _getFieldDefObj(cartItemHandler,item){
	
	var validFields = _getVisibleFields(cartItemHandler,item);  
	var retList = [];
    var tmpObj,tmpArray,tmpcValue;
    var delivery_list =  cartItemHandler.delivery_list ;
    var service_id_list =  cartItemHandler.service_id_list ;
    var service_title_list =  cartItemHandler.service_title_list ;
    var requested_for_type =  cartItemHandler.requested_for_type ;
    var dept_list = vars.$G_requester_depts;
    if (dept_list == null){
    	dept_list = [];
    	var qry = "serviceRequesters=\"" + getCurrentOperator().contact_name + "\"";
    	var depts = new SCFile("dept");
    	var rc = depts.doSelect(qry);
    	if (rc == RC_SUCCESS){
    		do {
    			dept_list.push(depts.dept_full_name);
    			rc = depts.getNext();
    		}while(rc == RC_SUCCESS)
    	}
    }
   
    for (var i=0;i<validFields.length;i++) {
    	tmpObj = {};
    	
    	tmpObj.name = validFields[i].caption;
    	tmpObj.mandatory = "required";
		if (validFields[i].field == "requested.for.type") {
			//To support the situation one item has individual AND department.
			var typeList = [];
			var typeDipsList = [];
			if (item.subscribeIndividual) {
				typeList.push("individual");
				typeDipsList.push(getMessage(153));
			}
			
			if (item.subscribeDept) {
				typeList.push("department");
				typeDipsList.push(getMessage(152));
			}
			tmpArray = _genCandidateValue(typeList,typeDipsList);
			tmpObj.values = tmpArray;
			
		}
		
    	if (validFields[i].field == "delivery") {
    		tmpArray = _genCandidateValue(delivery_list,delivery_list);
    		tmpObj.values = tmpArray;
    	}
    		
    	if (validFields[i].field == "serviceSLA") {
    		tmpArray = _genCandidateValue(service_id_list,service_title_list);
    		tmpObj.values = tmpArray;
    	}   	
    		
    	if (validFields[i].field == "requested.for.dept") {
    		tmpArray = _genCandidateValue(dept_list,dept_list);
    		tmpObj.values = tmpArray;
    	}   	
    	retList.push(tmpObj);
    }
    
    return retList;
    
}


function _genCandidateValue(idList,captionList){
	var tmpcValue;
	var tmpArray = [];
	var length = 0;
	if (idList == null){
		return tmpArray;
	}
	try {
		length = idList.length();
	} catch (e){
		length = idList.length;
	}
	
	if (idList != undefined 
    		&& idList != null && length > 0) {
    		
    	for (var j=0;j<length;j++) {
			tmpcValue = {};
		 	tmpcValue.id = idList[j];
		 	tmpcValue.caption = captionList[j] || idList[j];
		 	tmpArray.push(tmpcValue);
		}
    }
    
    
    return tmpArray;
}


function _getVisibleFields(cartItemHandler, item) {

    
    var one_click =  cartItemHandler.one_click ;
	var createSubscription =  cartItemHandler.createSubscription ;
	var subscribeIndividual =  cartItemHandler.subscribeIndividual ;
    var requested_for_type =  cartItemHandler.requested_for_type ;
    var subscribeDept =  cartItemHandler.subscribeDept ;
    var delivery =  cartItemHandler.delivery ;
    var delivery_list =  cartItemHandler.delivery_list ;
    var service_id_list =  cartItemHandler.service_id_list ;
    var service_title_list =  cartItemHandler.service_title_list ;
    var service_sla =  cartItemHandler.service_sla ;
    
    
    
    
    var retList = [];
    if (item.infoOnly == true) return retList;
    
    
    //$requested.for  		([$createSubscription]=false | [type]="bundle") & [infoOnly]<>true
    var requested_for_visible = createSubscription == false || item.type == "bundle";
	
    //$requested.for.type   [$createSubscription]=true & [$subscribeIndividual]=true & [infoOnly]<>true
    var individual_requested_for_type_visible = createSubscription == true && subscribeIndividual == true;
	
	//$requested.for  		[$createSubscription]=true & [$subscribeIndividual]=true & [$requested.for.type]="individual" & [infoOnly]<>true    
    var individual_requested_for_visible = createSubscription == true && subscribeIndividual == true && requested_for_type == "individual";
    
    //$requested.for.type	[$createSubscription]=true & [$subscribeDept]=true & [infoOnly]<>true
    var department_requested_for_type_visible = createSubscription == true && subscribeDept == true;

    //$requested.for.dept	[$createSubscription]=true & [$subscribeDept]=true & [$requested.for.type]="department" & [infoOnly]<>true
    var requested_for_dept_visible = createSubscription == true && subscribeDept == true && requested_for_type == "department";
    
    //$quantity				[$L.one.click]<>true & [$subscribeDept]<>true & [infoOnly]<>true
    var quantity_visible = one_click != true && subscribeDept != true;
	
	//$delivery				[$delivery]<>"" & [infoOnly]<>true
    var delivery_visible = delivery != null && delivery != "";
       
    //$service.sla			[$service.id.list]<>"" & [infoOnly]<>true
    var service_sla_visible = service_id_list != null && service_id_list != "" && service_id_list.length() > 0;
    
     
    if (requested_for_visible || individual_requested_for_visible ) {//$requested.for
    	retList.push(_genFieldObj("requested.for",requested_for_node));
    
    } 
    
    if (individual_requested_for_type_visible || department_requested_for_type_visible) { //$requested.for.type 
    	 retList.push(_genFieldObj("requested.for.type",requested_for_type_node));
    }
	
	//for the situation one item can individual AND department, should change the condition from 'requested_for_dept_visible' to 'department_requested_for_type_visible'
	if (department_requested_for_type_visible) {//$requested.for.dept
	    retList.push(_genFieldObj("requested.for.dept",requested_for_dept_node));
    }
	
	if (quantity_visible) {//$quantity
    	retList.push(_genFieldObj("quantity",quantity_node));
    }
    
	if (delivery_visible) {//$delivery
    	retList.push(_genFieldObj("delivery",delivery_node));
    } 

    if(service_sla_visible) {//$service.sla
    	retList.push(_genFieldObj("serviceSLA",serviceSLA_node));
    } //
    
    return retList;
}
 
function _genFieldObj(field,nodeName) {
	var tmpObj = {};
	tmpObj.field = field;
	tmpObj.caption = nodeName;
	return tmpObj;
}