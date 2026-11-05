var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_svcCart_Util");

var select = lib.ScAPI_RAD._select;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var getMessage = lib.ScAPI_Util.getMessage;
var fun = system.functions;

function checkInteractionCart(interaction, cart){
	if(!checkPermission(interaction, cart)){
		throw getMessage(113);
	}
	if ( interaction != null && interaction.approval_status == "approved" ){
		throw getMessage(114, [interaction.incident_id]);
	}
}

function checkPermission(interaction, cart){
	var currentOper = system.functions.operator();
	if (interaction != null) {
		if ( currentOper == interaction['opened.by.uid'] ) return true;
		
		var operatorObj = getCurrentOperator();
	    var operatorContactName = operatorObj.contact_name;
	    var contact = interaction['contact.name'];
	    var callbackContact = interaction['callback.contact'];
	    if (operatorContactName == contact || operatorContactName == callbackContact) return true;
	    
		var approval = select("Approval", "unique.key=\"" + interaction.incident_id + "\"");
		for(i = 0; i < approval.current_pending_groups.length(); i++){
			if ( currentOper == approval.current_pending_groups[i] ){
			return true;
			}
		}
	
		for(i = 0; i < approval.future_groups.length(); i++){
			if ( currentOper == approval.future_groups[i] ){
				return true;
			}
		}
	}
	if (cart != null) {
		var contact_name = getCurrentOperator().contact_name;
		if (contact_name == cart.owner) return true;
	}
	
	return false;
	
}

function validateOrder(item, order) {
	if (! order) return null;	
	var cartItem = null,cartItemID = null;
	var requestedForDept = order["requested.for.dept"];
	var requestedForType = order["requested.for.type"];
    
    
    var delivery = order["delivery"];
    var serviceSLA = order["serviceSLA"];
    
    if (item["subscribeDept"] == true && item["subscribeIndividual"] !== true){
    	if (requestedForType != "department"){
    		log.info("Invalid Requested For Type. The type must be department.");
    		throw getMessage(105);
    	}
    }
    
    if (item["subscribeIndividual"] == true && item["subscribeDept"] != true){
    	if (requestedForType != "individual"){
    		log.info("Invalid Requested For Type. The type must be individual.");
    		throw getMessage(106);
    	}
    }

    if (item["subscribeIndividual"] == true && item["subscribeDept"] == true){
    	if (requestedForType != "department" && requestedForType != "individual"){
    		log.info("Invalid Requested For Type. The type must be department or individual.");
    		throw getMessage(107);
    	}
    }
    
   
    if( order["cartItems"] == null){
     var quantity = order["quantity"];
     _validateQuantity(item,quantity);
     }
     else {     
     var cartItemsList = order["cartItems"];
     for (var i in cartItemsList)  {          
			
      var cartItem = cartItemsList[i];		
      var quantity = cartItem.quantity;
      _validateQuantity(item,quantity);
     
     }
    
    var cartItemHandler = lib.ScAPI_CartItem.createCartItemHandler( item.name );
	cartItemHandler.extractOrderInformation();
	var validFields = lib.ScAPI_WSInterface_Order_Info._getVisibleFields(cartItemHandler,item);  
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
    
    if (delivery != null) {
    	if(delivery_list != null && fun.lng(delivery_list) > 0 && _search(delivery_list, delivery) < 0) {
    		log.info("Invalid delivery");
    		throw getMessage(119);
    	}
    }
    
    if(service_id_list != null && fun.lng(service_id_list) > 0 && _search(service_id_list, serviceSLA) < 0){
    	log.info("Invalid serviceSLA");
    	throw getMessage(120);
    }
    
    if (requestedForDept != null && requestedForType == "department") {
    	if(dept_list != null && fun.lng(dept_list) > 0 && _search(dept_list, requestedForDept) < 0){
    		log.info("Invalid request for department");
    		throw getMessage(121);
    	}
    }
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
	for (var i = 0; i < len; i++){
		if (arr[i] == value) return i;
	}
	return -1;
}

/*

validate quantity, only >0 number, not string,not null
*/
function _validateQuantity(item, quantity){

 var $L_temp;
 if (quantity == null || quantity < 1 || (system.functions.rtecall("isnumeric",$L_temp, system.functions.str(quantity)) == false)){
   log.info("Invalid quantity. Quantity must be number and greater than 0.");
   throw getMessage(117);
  }
    
 if (quantity > 1 && item.restrictQuantity){
   log.info("Invalid quantity. Quantity is restrict to 1 as defined in item.");
   throw getMessage(118);
  }
  
 }
}