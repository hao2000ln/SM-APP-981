/**
 * @fileOverview  Provide the functionality of Stock Management
 * @author Mi Quan
 * @date May. 2014
 */
 


/**
 * @public
 * @description  Initial stock data
 * @param {stockroom} room - room
 * @param {String} partno - partno
 * @param {String} partdesc - partdesc 
 * @return {stock} stock - stock  
 */  
function InitialStock(room, partno, partdesc) {

 	var stock = new SCFile("stock");    
	stock.stockroom= room.stockroom;
	stock.part_no= partno;
	stock.description=partdesc;
	stock.installed=0;
	stock.available=0;
	stock.reserved=0;
	stock.unavailable=0;
	stock.received=0;
	stock.on_order=0;
 	stock.config_filename= getConfigFile(partno);
	stock.location = room.location;
	stock.serialized = true;
   	stock.doSave();
 	return stock;
} 

/**
 * @public
 * @description  get Stock for Model ByStockRoom
 * @param {String} stockroom - stockroom
 * @param {String} partno - partno
 * @return {stock} stock - stock  
 */
function getStockforModelByStockRoom(stockroom, partno){

	var stock = new SCFile("stock");
 	var query = "stockroom=\""+stockroom+"\" and part.no=\""+partno+"\"";
 	var rc = stock.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return stock;
	}else {
		return null;
	}
}


/**
 * @public
 * @description  Stock Change Entry point
 * @param {stock} stock - stock
 * @param {number} amount - amount
 * @param {number} type - type
 */
function stockChange(stock, amount, type, schId){
 	 
 	if (stock!=null && funcs.filename(stock)=="stock") {
		switch (type) {
		//order
		case 1: 
			 if(stock.on_order==null || stock.on_order=="") {
			 	stock.on_order = 0; 
			 }
			 stock.on_order = stock.on_order+amount;
			 break;
   
		//receive and on_order
		case 2: 
			 if(stock.received==null || stock.received=="") {
			 	stock.received = 0; 
			 }
			 stock.on_order = stock.on_order - amount;
			 stock.received =  stock.received+ amount;
			 break;
 
		//available
		case 3: 
			 if(stock.available==null || stock.available=="") {
			 	stock.available = 0; 
			 }
			 stock.available = stock.available + amount;
			 break; 
 
		//reserved
		case 4: 
			 if(stock.reserved==null || stock.reserved=="") {
			 	stock.reserved = 0; 
			 }
			 stock.reserved = stock.reserved + amount;
			 break;
 
		//installed
		case 5: 
			 if(stock.installed==null || stock.installed=="") {
			 	stock.installed = 0; 
			 }
			 stock.installed = stock.installed + amount;
			 break;   
 
		//unavailable
		case 6: 
			 if(stock.unavailable==null || stock.unavailable=="") {
			 	stock.unavailable = 0; 
			 }
			 stock.unavailable = stock.unavailable + amount;
			 break;   
 
		//received
		case 7: 
			 if(stock.received==null || stock.received=="") {
			 	stock.received = 0; 
			 }
			 stock.received = stock.received + amount;
			 break;   

		}	
			
		if 	(schId!=null) { 		
	 		var schedule = new SCFile("schedule"); 	 			
	 		query = "schedule.id=\""+ schId+"\"";	
			var rc = schedule.doSelect(query) ;
			if  (rc == RC_SUCCESS){ 
				schedule.doDelete();
			}
		}	
		
 		var lock = lib.KMUtils.lockrecord(stock);
  		if (lock==true) {
  			stock.doSave();
  			var unlock =false;
 			do{
 				unlock=lib.KMUtils.unlockrecord(stock);
 			} while(unlock==false); 
  		}else {	
 	
 			var schedule = new SCFile("schedule"); 	
 			schedule.name = "Stock update for productCatalog:"+ stock.part_no+ " in stockroom:" + stock.stockroom  ;
 			schedule._class="ocm"; 			
	  		schedule.expiration = funcs.evaluate(funcs.parse("tod()+'00:05:00'", 2));	
 			schedule.status = "scheduled";
 			schedule.doSave();
  			schedule.javascript = "lib.StockService.schedulerStockChange("+"\""+
  									stock.stockroom+"\","+"\""+stock.part_no+"\","
  									+amount+","+type+","+"\""+schedule.schedule_id+"\");";

 			schedule.doSave();
 		}
 	}
}

function schedulerStockChange(stockroom, partno, amount, type, schId){

	var stock =  getStockforModelByStockRoom(stockroom, partno);
 	stockChange(stock, amount, type, schId);
}


/**
 * @public
 * @description  get StockRoom by room name
 * @param {String} room - room
 * @return {stockroom} stockroom - stockroom  
 */
function getStockRoom(room){
	
	var stockroom = new SCFile("stockroom"); 	
 	var query = "stockroom=\""+room+"\"";
 	var rc = stockroom.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return stockroom;
	}else {
		return null;
	}
}



/**
 * @public
 * @description  get All StockRoom
 * @param {String} room - room
 * @return {String} stockroom.stockroom - stockroom  
 */
function getAllStockRoom(){
	
	var stockrooms = [];
	var stockroom = new SCFile("stockroom",SCFILE_READONLY); 	
 	var query = "true";
 	stockroom.setFields("stockroom");
 	
 	var rc = stockroom.doSelect(query) ;
	while (rc == RC_SUCCESS){ 
		stockrooms.push(stockroom.stockroom);
		rc = stockroom.getNext();
	} 
	return stockrooms;
}

/**
 * @public
 * @description  get Location by location full name
 * @param {String} fullname - fullname
 * @return {String} location.location - location.location  
 */
function getLocationbyFullname(fullname) {

	var location = new SCFile("location", SCFILE_READONLY); 	
 	var query = "location.full.name=\""+fullname+"\"";
  	location.setFields("location");
 
 	var rc = location.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return location.location;
	}else {
		return null;
	}


}
/**
 * @public
 * @description  get Config File by partno
 * @param {String} partno - partno
 * @return {String} filename - filename  
 */
function getConfigFile(partno) {

	var productCatalog = new SCFile("productCatalog",SCFILE_READONLY);
	query = "part.no=\""+ partno+"\"";
	
 	productCatalog.setFields("config.filename");
	var rc = productCatalog.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		if (productCatalog.config_filename!=null && productCatalog.config_filename!="" ){
			return productCatalog.config_filename;		
		}
	} 
	
	return "device";
}


/**
 * @public
 * @description  get ProductCatalog By PartNo  
 * @param {String} fullname - fullname
 * @return {String} location.location - location.location  
 */
function getProductCatalogByPartNo(partno) {

	var productCatalog = new SCFile("productCatalog");
	query = "part.no=\""+ partno+"\"";	
	var rc = productCatalog.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return productCatalog;
	}else {
		return null;
	}

}

/**
 * @public
 * @description  get Required Files for CI update 
 * @param {ocmlrec} ocmlrec - ocmlrec
 * @return {Array} required array in productCatalog  
 */
function getRequriedField(ocmlrec, required) {
	 
	var requiredArray = required;	
 	
	var length;
	var requiredFields = "";
 	
	if (requiredArray!=null) {
	
		length = requiredArray.length();
		
		var i;
		for(i=0;i<length;i++){ 
			 
			if(requiredArray[i]==true && (ocmlrec.receiving_fields[i]==null || ocmlrec.receiving_fields[i]=="")) {
				
				requiredFields+= (ocmlrec.receiving_fields_desc[i])+" , ";
			} 
			 
		}		
		
		var len= requiredFields.length;
	
		if (len>0) {
		
			requiredFields=requiredFields.substring(0,len-2);
		}
		
	}
		
 	return requiredFields;
}


/**
 * @public
 * @description  initial ReceivingLog
 * @param {productCatalog} productCatalog - productCatalog
 * @param {requestTask} requestTask - requestTask 
 * @return {ocmlrec} ocmlrec - ocmlrec
 */
function initialReceivingLog(productCatalog, requestTask) {

	var ocmlrec = new SCFile("ocmlrec");
	ocmlrec.quantity = 1;
	ocmlrec.location =  getLocationbyFullname(requestTask.ship_to_code);
	ocmlrec.stockroom = ocmlrec.location;
	
  	ocmlrec.operator = vars.$lo_ufname;
 	ocmlrec.receive_date = funcs.tod();
 	var vendormodel =lib.ReorderService.getModelVendor(productCatalog.part_no);
 	if (vendormodel!=null) {
		ocmlrec.vendor_part_no = vendormodel.vendor_part_no ;
		ocmlrec.vendor_contract_no = vendormodel.vendor_contract_no ;
	}
	 
    ocmlrec.receiving_fields = funcs.denull(productCatalog.receiving_field_default);
    ocmlrec.receiving_fields_desc = funcs.denull(productCatalog.receiving_field_desc);
    ocmlrec.receiving_fields_name = funcs.denull(productCatalog.receiving_field_value);    
    vars.$L_rec_field_req = funcs.denull(productCatalog.receiving_field_required);
    vars.$L_rec_field_type = funcs.denull(productCatalog.receiving_field_type);
  	vars.$L_show = false;
   	if (ocmlrec.receiving_fields_desc !=null && ocmlrec.receiving_fields_desc.length()>0){
 		vars.$L_show = true;
 	}
    if(productCatalog.asset_number_file!=null){
    
		var callRtn= new SCDatum();
		var nextNumber = new SCDatum();
		funcs.rtecall("getnumber", callRtn, nextNumber, productCatalog.asset_number_file);	
		if(nextNumber!=null) {
		
			ocmlrec.logical_name = nextNumber.getText(); 			
			ocmlrec.asset_tag = ocmlrec.logical_name;
		}    
 
    }
	ocmlrec.part_no = productCatalog.part_no;	
	ocmlrec.manufacturer = productCatalog.manufacturer;
	ocmlrec.model = productCatalog.model;
	ocmlrec.model_ext = productCatalog.model_ext;
	ocmlrec.part_desc = productCatalog.part_desc;
	ocmlrec.category = productCatalog.product_catalog_category;
	
	ocmlrec.unit_cost = productCatalog.cost;
	ocmlrec.request = requestTask.parent_request;
 	ocmlrec.requesttask = requestTask.number;
	ocmlrec.vendor = requestTask.vendor;

	ocmlrec.status ="received";

	return ocmlrec;
}


/**
 * @public
 * @description  Generate ReceivingLog
 * @param {ocmlrec} ocmlrec - ocmlrec
 * @param {requestTask} requestTask - requestTask 
 * @return {requestTask} requestTask - requestTask
 */
function logReceipt(ocmlrec, requestTask){
	
	var callRtn= new SCDatum();
	var nextNumber = new SCDatum();
	funcs.rtecall("getnumber", callRtn, nextNumber, "ocmlrec");	
	ocmlrec.receive_no = Number(nextNumber.getText()); 	
	ocmlrec.doSave();
	
	requestTask.received_quantity = requestTask.received_quantity + ocmlrec.quantity;
	var received=funcs.nullsub(requestTask.received_quantity, 0);
    var ordered=funcs.nullsub(requestTask.ordered_quantity, 0);
    requestTask.received_quantity=received;
    requestTask.ordered_quantity=ordered;
    requestTask.balance=ordered-received;
	requestTask.doSave();
	
	var stock = getStockforModelByStockRoom(ocmlrec.stockroom, ocmlrec.part_no);
 	stockChange(stock, ocmlrec.quantity, 2);
	return requestTask;

}

/**
 * @public
 * @description  Clean OnOrder when Request Task is closed or cancelled. 
 * @param {requestTask} requestTask - requestTask 
 */
function clearOnOrderWhenRequestTaskClosed(requestTask){
 
 	var balance =requestTask.balance;	
 	if (balance==null || balance=="" ||Number(balance)==0){
	
		return;
		
	} else {
	
		var location =  getLocationbyFullname(requestTask.ship_to_code); 
 	
		var stock = getStockforModelByStockRoom(location,requestTask.part_no);
 
		if (stock!=null){
			stockChange(stock, -balance, 1);
		}
	
	} 
}


/**
 * @public
 * @description  Take inventory for a productCatalog
 * @param {productCatalog} productCatalog - productCatalog 
 */
function takeInventory(productCatalog){
	var stockrooms = getAllStockRoom();
	var length = stockrooms.length;
	
 	var total_installed=0;
	var total_available=0;
	var total_reserved=0;
	var total_unavailable=0;
	var total_received=0;
	var total_on_order=0;
	
	print(funcs.scmsg(17, "stock",[productCatalog.part_no])) ;
	
	var i; 
	for(i=0;i<length;i++) {
	
		var installed=0;
		var available=0;
		var reserved=0;
		var unavailable=0;
		var received=0;
		var on_order=0;
	
		print(funcs.scmsg(18, "stock",[stockrooms[i]])) ;
		
		var stock = getStockforModelByStockRoom(stockrooms[i],productCatalog.part_no);
		
		//get onorder
		var requestTask = new SCFile("requestTask", SCFILE_READONLY);
		requestTask.setFields(["balance"]);
		var sql="category=\"Purchase\" and open=\"true\" and part.no=\""+ productCatalog.part_no +"\" and ship.to.code=\"" + lib.ReorderService.getLocationFullname(stockrooms[i],1) + "\"";
 		if(requestTask.doSelect(sql)==RC_SUCCESS){		
			do{
				on_order += requestTask.balance;				
			}while(requestTask.getNext()==RC_SUCCESS);
		}
		
		//get received
		var ocmlrec = new SCFile("ocmlrec", SCFILE_READONLY);
		ocmlrec.setFields(["quantity"]);
		sql= "status=\"received\" and part.no=\""+ productCatalog.part_no +"\" and location=\"" + stockrooms[i] + "\"";
 		if(ocmlrec.doSelect(sql)==RC_SUCCESS){		
			do{
				received += ocmlrec.quantity;				
			}while(ocmlrec.getNext()==RC_SUCCESS);
		}
		
		//get installed/available/reserved/unavilable
		var fileName = "device";		 
		if(productCatalog.config_filename!=null && productCatalog.config_filename!=""){			
			fileName = productCatalog.config_filename;		
		}
 		var configFile = new SCFile(fileName, SCFILE_READONLY);
 		configFile.setFields(["istatus"]);
		sql= "part.no=\""+ productCatalog.part_no +"\" and location=\"" + stockrooms[i] + "\"";
 		if(configFile.doSelect(sql)==RC_SUCCESS){		
			do{
				
 				var status = lib.RequestTaskService.getTargetStockNumberValue(configFile.istatus);
 				if(status==3) {				
					available += 1;					
				} else if(status==4){
					reserved += 1;
				} else if(status==5){
					installed += 1;
				} else if(status==6){
					unavailable += 1;
				}		
			}while(configFile.getNext()==RC_SUCCESS);
		}
 		if(stock==null && (installed>0 || available>0 || reserved>0 || unavailable>0 || received>0 || on_order>0)) {		
			stock = InitialStock(getStockRoom(stockrooms[i]),productCatalog.part_no,productCatalog.part_desc);
		}
		
		if (stock!=null) {
			
			//update stock information			
			stock.installed =installed;
			stock.available =available;
			stock.reserved = reserved;
			stock.unavailable =unavailable;
			stock.received = received;
			stock.on_order = on_order;		
			stock.doSave();
			
			
			total_installed += stock.installed;
			total_available += stock.available;
			total_reserved += stock.reserved;
			total_unavailable += stock.unavailable;
			total_received += stock.received;
			total_on_order += stock.on_order;
		}
	 	
	}
	
	inventory =  getInventoryByPartno(productCatalog.part_no);
	inventory.installed = total_installed;
	inventory.available = total_available;
	inventory.reserved = total_reserved;
	inventory.unavailable = total_unavailable;
	inventory.received = total_received;
	inventory.on_order = total_on_order; 	
	inventory.doSave();
	
	print(funcs.scmsg(19, "stock",[productCatalog.part_no])) ;
}


/**
 * @public
 * @description  Get Inventory by PartNo
 * @param {String} partno - partno 
 * @return {inventory} inventory - inventory
 */
function getInventoryByPartno(partno) {

	var inventory = new SCFile("inventory");
	query = "part.no=\""+ partno+"\"";	
	var rc = inventory.doSelect(query) ;
	if  (rc == RC_SUCCESS){ 
		return inventory;
	}else {
		return generateInventory(partno);
	}

}

/**
 * @public
 * @description  Generate Inventory by PartNo
 * @param {String} partno - partno 
 * @return {inventory} inventory - inventory
 */
function generateInventory(partno) {

	var inventory = new SCFile("inventory");
	inventory.part_no= partno;
	inventory.installed=0;
	inventory.available=0;
	inventory.reserved=0;
	inventory.unavailable=0;
	inventory.received=0;
	inventory.on_order=0;
	inventory.doSave();
	
	return inventory;
}


/**
 * @public
 * @description  get Stock by purchase task
 * @param {record} RequestTask - RequestTask 
 * @return {stock} Stock - Stock
 */
function getStockByPurchaseRequestTask(record) {

	var stock = new SCFile("stock");
	var sql = "part.no=\""+record.part_no +"\" and stockroom=\""+ getLocationbyFullname(record.ship_to_code)+"\"";
 
	if(stock.doSelect(sql) !== RC_SUCCESS){
		var room = getStockRoom(getLocationbyFullname(record.ship_to_code));
		 
		var productCatalog = new SCFile("productCatalog", SCFILE_READONLY);
		productCatalog.setFields(["part.no","part.desc"]);
		var modelsql = "part.no=\"" + record.part_no +"\"";
		 
		var partno = record.part_no;
		var partdesc = null;
 		if(productCatalog.doSelect(modelsql) === RC_SUCCESS){
			partno = productCatalog.part_no;
			partdesc = productCatalog.part_desc;
		}
		stock = InitialStock(room, partno, partdesc);
	}
 
	return stock;
 
}

/**
 * @public
 * @description  Update on order quantity when purchase task is created or updated.
 * @param {record} RequestTask - RequestTask 
 * @param {oldRecord} RequestTask - RequestTask 
 */ 
function UpdateOrderedQuantity(record, oldRecord ){
 	var newStock = null;
	var oldStock = null;
	var diff = 0;
	 
	
 	if ((oldRecord==null || (oldRecord!=null && oldRecord.part_no==null))  && record.part_no!=null && record.ship_to_code!=null && record.ordered_quantity!=null) {
 		newStock=getStockByPurchaseRequestTask(record);		
		stockChange(newStock,record.ordered_quantity,1);
			
	}else if(oldRecord!=null && record!=null && oldRecord.part_no!=null && record.part_no!=null && record.ship_to_code!=null && oldRecord.ship_to_code!=null && record.ordered_quantity!=null && oldRecord.ordered_quantity!=null){
 		oldStock=getStockByPurchaseRequestTask(oldRecord);
		newStock=getStockByPurchaseRequestTask(record);
		 
		if(oldRecord.part_no == record.part_no  && oldRecord.ship_to_code == record.ship_to_code){		
 			diff = record.ordered_quantity - oldRecord.ordered_quantity;			
 			if (diff!=0){
				stockChange(newStock,diff,1);
			}			
		}else{
					
			stockChange(oldStock,-oldRecord.ordered_quantity,1);		
			stockChange(newStock,record.ordered_quantity,1);
			
		}
	}
}




