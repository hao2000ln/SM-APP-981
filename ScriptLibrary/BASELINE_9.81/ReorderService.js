/**
 * @fileOverview  Provide the functionality of Reorder Management
 * @author Mi Quan
 * @date May. 2014
 */
 
var logger = getLog("ReorderService");

/**
 * @public
 * @description  Entrypoint of reorder.
 * @param {String} query - Query
 * 
 */  
function reOrder(query) {

 	var reorderRule  = getReorderRule(query);
 	
 	if(reorderRule!=null){
		do{
 			work(reorderRule);
		
		} while(reorderRule.getNext()==RC_SUCCESS);
	}
}
 
 
/**
 * @private
 * @description  return first cursor of query result 
 * @param {String} query - Query
 * @return {reorderRule} reorderRule - reorderRule
 */   
function getReorderRule(query) {
 
 	var reorderRules = [];
	if(query==null || query =="") {
		query="not null(reorder.stockroom)";
	}else {
		query+="and not null(reorder.stockroom)";	
	}  
 	var reorderRule = new SCFile("reorderRule"); 	
 	var rc = reorderRule.doSelect(query) ;
	if (rc == RC_SUCCESS){ 
 		return 	reorderRule;
	}else {
		return null;
	}  
 }
 
 



/**
 * @private
 * @description  Execution for each reorderRule.
 * @param {reorderRule} reorderRules - reorderRule
 */   	
function work(reorderRules) {

	var stockRooms = reorderRules.reorder_stockroom;
	
 	if (stockRooms!= null ) {		
		var length = stockRooms.length();
		
		var j;
		for (j=0; j<length; j++) {
		
			var stock = lib.StockService.getStockforModelByStockRoom(stockRooms[j],reorderRules.part_no);
 			var stockroom = lib.StockService.getStockRoom(stockRooms[j]);
			
			if (stock==null) {
  				if (stockroom == null) { 
					continue; 
				}else {
 					stock = lib.StockService.InitialStock(stockroom,reorderRules.part_no, reorderRules.part_desc);
				}
			}  
			 
			if(reorderRules.reorder_stock_point[j] >= stock.available + stock.on_order) {
			
				var modelVendor = getModelVendor(stock.part_no);
 				if (modelVendor!= null) {
				
					if (reorderRules.generate_order =="generate.order") {
 						GenerateOrder(stock,modelVendor,reorderRules,stockroom, reorderRules.reorder_stock_amount[j]) ;
					
					} else {						
						sendEmailOrderNotification(stockroom,reorderRules, reorderRules.reorder_stock_amount[j], reorderRules.reorder_stock_point[j]);
					}
				
				} else {
						sendEmailWarningNotification(stockroom,reorderRules); 
				} 
				
			} 
		
		}

	}

}


/**
 * @private
 * @description  GenerateOrder
 * @param {stock} stock - stock
 * @param {modelVendor} modelVendor - modelVendor
 * @param {reorderRule} reorderRules - reorderRules
 * @param {stockroom} stockRooms - stockRooms
 * @param {float} amount - amount 
 */ 
function GenerateOrder(stock, modelVendor, reorderRules,stockRooms, amount) {

	var order = new SCFile("request");
 	order.model="Order";
	order.category="Order";	 
	order.bill_to_code = modelVendor.bill_to_code;
 	if (stock.location!=null) {	
		order.ship_to_code =getLocationFullname(stock.location[0],"1");
	}else {	
		order.ship_to_code =getLocationFullname(modelVendor.ship_to_code,"2");
	}
  	order.description[0]=  funcs.scmsg(3, "stock", [reorderRules.part_desc,stock.stockroom]); 	
    // add 1 min to make sure the requested date is in the future
    order.requested_date = new Date(funcs.tod().getTime() + 60000);
//  order.requested_date = funcs.tod();
 	
 	order.severity="3";
 	order.impact="3"; 	
 	order.brief_description=funcs.scmsg(4, "stock", [reorderRules.part_desc]);
  	if (stockRooms.manager!=null) {
 		order.assigned_to =getOperator(stockRooms.manager);  				
 	} else { 
	 	order.assigned_to =getOperator(reorderRules.default_stock_manager);
 	} 	
 	order.assigned_group =getAssignment(order.assigned_to); 
  	
   	order.requestor_name ="MANAGER, STOCK";
  	
  	// generate order request
	var rteReturnValue = new SCDatum();
	var rteNames = new SCDatum();
	var rteVals = new SCDatum();
  	rteNames.setType(8); //type array
    rteNames.push("file");       
    rteNames.push("boolean1");         
    rteVals.setType(8);
    rteVals.push(order);     
    rteVals.push(true);	    
    funcs.rtecall("callrad",rteReturnValue,"request.new",rteNames,rteVals,false); //false to run in the same thread, true to run in new one.  
	
    //check request number
	if (vars.$exit != "normal" || !order.number) {
	    logger.error("Reorder request failed.");
	    return;
	}
	
 	//update orderTask
	var orderTask = lib.RequestService.getFirstRequestTask(order.number);
	if(orderTask!=null) {
	
		orderTask.priority = order.priority;
		orderTask.assigned_group = order.assigned_group;
		orderTask.assigned_to = order.assigned_to;
		orderTask.part_no  = reorderRules.part_no;
		orderTask.vendor =  modelVendor.vendor;
 		orderTask.ordered_quantity  = Number(amount);
		orderTask.description[0] =order.description[0];
		orderTask.ship_to_code = order.ship_to_code; 
		orderTask.impact="3";
   		orderTask.doAction("save");
    		
  		//update stock information
  		lib.StockService.stockChange(stock,Number(amount),1);
	}
   
}


/**
 * @private
 * @description  getLocationFullName
 * @param {String} location - location
 * @param {String} type - type
 * @return {String} fullName  
 */
function getLocationFullname(location, type) {

	if (location == null) { 
		return null;
	}
		
	var query = "";
	if (type=="1") {
	 	query = "location=\""+ location+"\"";
	} else {
		query = "location.code=\""+ location+"\"";
	}
	
	var flocation = new SCFile("location",SCFILE_READONLY);
 	flocation.setFields("location.full.name");
	var rc = flocation.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return flocation.location_full_name;
	}else {
		return null;
	}

}


/**
 * @private
 * @description  getOperatorName by Contact
 * @param {String} contact - contact name
 * @return {String} name  
 */
function getOperator(contactName){

	if (contactName == null) { 
		return null;
	}
		
	var operator = new SCFile("operator",SCFILE_READONLY);
 	var query = "contact.name=\""+ contactName+"\"";
 	operator.setFields("name");		
 	
	var rc = operator.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return operator.name;
	}else {
		return null;
	}

}


/**
 * @private
 * @description  getAssignment by operatorName
 * @param {String} operator  - operator name
 * @return {String} Assignment group name  
 */
function getAssignment(operator){

	if (operator == null) {
		return null;
	}
 	var mygroup = new SCFile("myGroups");    
	
	var rc= mygroup.doSelect("name=\""+operator+"\"");
    if ( rc == RC_SUCCESS )	{    
    	if (mygroup.member_of!=null && mygroup.member_of[0]!=null ){  
    			return mygroup.member_of[0];   	 		
   	 	}else {
   	 		return AssignStockManagerToOperator(mygroup);
   	 	}
    }else {
    	return GenerateMyGroupForOperator(operator);
    } 

}


/**
 * @private
 * @description  Assign Stock Manager to Operator
 * @param {String} mygroup  - AssignmentGroup
 * @return {String} Assignment group name  
 */
function AssignStockManagerToOperator(mygroup) {
	var stockManager = [];
	
 	var oldRecord ;
	var rc =funcs.fduplicate(oldRecord,mygroup);
 	stockManager.push("Stock Managers");
 	mygroup.member_of = stockManager;
 	mygroup.doSave();
 	 
 	lib.MyGroupsSync.syncToAssignmentWhenMyGroupsChange(oldRecord, mygroup);
 	
 	return "Stock Managers"; 
}

/**
 * @private
 * @description  Generate myGroup data for operator
 * @param {String} operator  - operator name
 * @return {String} Assignment group name  
 */
function GenerateMyGroupForOperator(operator) {

	var mygroup = new SCFile("myGroups");    
 	var stockManager = [];
 	
 	mygroup.name=operator; 	
 	stockManager.push("Stock Managers");
 	mygroup.member_of = stockManager;
 	
 	mygroup.doSave();
 	lib.MyGroupsSync.syncToAssignmentWhenMyGroupsChange(null, mygroup);
 	
	return "Stock Managers";
} 


/**
 * @private
 * @description  Retrieve modelvendor by partno
 * @param {String} partno  - partno
 * @return {modelvendor} modelvendor  
 */
function getModelVendor(partno){

	var modelvendor = new SCFile("modelvendor",SCFILE_READONLY);
 	var query = "part.no=\""+ partno+"\"";
 	
	var rc = modelvendor.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return modelvendor;
	}else {
		return null;
	}

}


/**
 * @private
 * @description  Send Email for reorder 
 * @param {stockroom} stockroom  - stockroom
 * @param {reorderRule} reorderRules  - reorderRules 
 */
function sendEmailOrderNotification(stockroom,reorderRules,amount,point) {

	var template = "RM Reorder";
	vars.$stockroom=stockroom.stockroom;
	vars.$amount = amount;
	vars.$point = point;
 	
	sendEmail(template,stockroom,reorderRules);	
}

/**
 * @private
 * @description  Send Warning Email due to no modelvendor data for partno 
 * @param {reorderRule} reorderRules  - reorderRules 
 */
function sendEmailWarningNotification(stockroom,reorderRules) {
	 	
	var template = "RM Reorder Warning";
	sendEmail(template,stockroom,reorderRules);	
}


/**
 * @private
 * @description  Send Email 
 * @param {String} template  - template 
 * @param {stockroom} stockroom  - stockroom 
 * @param {reorderRule} reorderRules  - reorderRules 
 */
function sendEmail(template, stockroom, reorderRules) {

	var recipients ;
	
	if (stockroom.manager!=null) {
 		recipients =getContactEmailAddress(stockroom.manager); 
 				
 	} else { 
	 	recipients =getContactEmailAddress(reorderRules.default_stock_manager);
 	}
  	var subject = system.library.htmlemailtemplates.getMailHeader(template, reorderRules, reorderRules,recipients, vars.$G_my_language);
				
	var emailBody= lib.htmlemailtemplates.getMailBody(template, reorderRules, reorderRules,recipients, vars.$G_my_language);
	
	if(recipients!=null && recipients !="") {
	   lib.timeperiodConflict.sendEmail(recipients, subject, emailBody);
	}
}

/**
 * @private
 * @description  get Contact Email Address
 * @param {String} contactname  - contactname
 * @return {String} email  - email 
 */
function getContactEmailAddress(contactname){

	if (contactname == null) { 
		return null;
	}
		
	var contact = new SCFile("contacts",SCFILE_READONLY);
 	var query = "contact.name=\""+ contactname+"\"";
 	contact.setFields("email");		
 	
	var rc = contact.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return contact.email;
	}else {
		return null;
	}

}


/**
 * @public
 * @description  fix reorder amount
 * @param {String} amount  - amount
 * @param {number} lotsize  - lotsize 
 * @param {number} max  - max
 * @return {number} result  - result
 */
function fixQty(amount,lotsize,max){

	var amt=0;
	var result =0;
 	amt = funcs.round(Number(amount)/Number(lotsize),0);
 	
	if(amt==0) {
	    amt=1;
	}
	result= Number(lotsize)*amt;
	while (result>max) {
		
		amt= amt-1;
		result= Number(lotsize)*amt;
	}
	return result;
}

/**
 * @public
 * @description  warning if no manager for stockroom when configure reorder rule.
 * @param {Array} stockrooms  - stockroom

 */
function WarningStockroomsWithNoManager(stockrooms){

	 var rooms = [];
	 var requiredRooms ="";
	 
	 if(stockrooms!=null && stockrooms.length()>0){
	 
	    var i;
	    var j;
	 	var length = stockrooms.length();
	 	
	 	for(i=0; i<length; i++) { 		
	 		var stockroom=  lib.StockService.getStockRoom(stockrooms[i]);
	   		if(stockroom.manager==null || stockroom.manager==""){ 		
	 			rooms.push(stockrooms[i]);
	 		} 
	 	
	 	}
	 	
	 	var reqLength = rooms.length; 	
	 	if (reqLength>0){  	
	 		for(j=0;j<reqLength;j++) { 		
	 			requiredRooms+= (rooms[j])+" , "; 		
	 		} 	
	 	} 
	 	
	 	var len= requiredRooms.length;	
		if (len>0) {	
			requiredRooms=requiredRooms.substring(0,len-2);
			print(funcs.scmsg(16, "stock",[requiredRooms])) ;
		}
	 
	 }

}
