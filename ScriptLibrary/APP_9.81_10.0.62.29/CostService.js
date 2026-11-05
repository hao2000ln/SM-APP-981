var $ = lib.c.$;
var _ = lib.Underscore.require();
var filename = funcs.filename;
var msg = funcs.msg;
var scmsg = funcs.scmsg;
var round = funcs.round;
var convertCurrency = lib.ScAPI_RAD.us_convert_currency;
var getDigitAfterDecimal = lib.ScAPI_Util.getDigitAfterDecimal;
var delnull = funcs.denull;
var date = funcs.date;
var rtecall = funcs.rtecall;


/**
 * @public
 * @description  Recalculate cost for all sub tasks, labor cost, part cost and  update to parent ticket.
 * @param {String} parentFileName - parentFileName
 * @param {String} childFileName - childFileName
 * @param {String} parentFileName - parentFileName
 * @param {String} parentTicket - parentTicket
 * @param {String} schClass - Schedule class
 * @param {String} schId - Schedule Id
 * 
 */
function populateTotalCost(parentFileName, childFileName,parentTicket,schClass,schId){

 	  
      var parent= new SCFile(parentFileName);
      var sql="number=\""+parentTicket +"\"";
      if (parentFileName=="rootcause") {      
          sql="id=\""+parentTicket +"\"";
      } 
      var totalcost = 0;     
      
      if(parent.doSelect(sql)==RC_SUCCESS) { 
            
            if(parent.cost_currency_code==null || parent.cost_currency_code=="") {
                parent.cost_currency_code=vars["$G.root.currency"];
            }
                 
           	totalcost = calculateTicketTotalCost(parentFileName,childFileName,parentTicket,parent);
		            								
		    if (totalcost===undefined){
		    	msg(scmsg(4, "ticketCost",[parentTicket]),2) ;
				return ;
			}        								
         	parent.total_cost = totalcost;
         	var ret;
        	rtecall("trigger", ret, 0);
        	var rc = parent.doSave();
        	rtecall("trigger", ret, 1);
      }  
      
}


/**
 * @public
 * @description  Calculate total part cost and convert to target currency
 * @param {String} parentFileName - parentFileName
 * @param {String} childFileName - childFileName
 * @param {String} parentTicket - parentTicket
 * @param {File} parentFile - parentFile
 * @return {Number} totalcost - totalcost
 */
function calculateTicketTotalCost(parentFileName,childFileName,parentTicket,parentFile){

	var laborpartcost = 0;
	var taskcost = 0;
	var totalcost = 0;
	
	var parentLabor = parentFile.labor;
	
	var parentPart = null;
	
	var parentCurrency = parentFile.cost_currency_code;
	
	if(parentFileName!="request" && parentFileName!="requestTask" ){
	 
	 	parentPart = parentFile.parts;
	}
	 	 
	laborpartcost = calculateTotalPartLaborCost(parentFileName,parentLabor,parentPart,parentCurrency,true);   
    
    if (laborpartcost===undefined){
    	return ;
    }
    taskcost = sumTasksCost(parentTicket, childFileName,parentCurrency);
  	if (taskcost===undefined){
    	return ;
    }
      
    totalcost = laborpartcost+taskcost;
    var digit = getDigitAfterDecimal(parentCurrency);
    totalcost = round(totalcost, digit);
    return totalcost;

}

/**
 * @public
 * @description  Sub all sub task cost and convert to parent currency
 * @param {String} parentTicket - parentTicket
 * @param {String} childFileName - childFileName
 * @param {String} parentCurrency - parentCurrency 
 * @return {Number} totalcost - totalcost 
 */
function  sumTasksCost(parentTicket, childFileName, parentCurrency) 
{
	var child= new SCFile(childFileName, SCFILE_READONLY);
	child.setFields(["cost.currency.code","total.cost"]);
	
	var sql="";
	if (childFileName =="requestTask") {
		 sql="parent.request=\""+parentTicket +"\"";
	}else if (childFileName == "rootcausetask") {
         sql="parent.problem=\""+parentTicket +"\"";
	}else if (childFileName == "cm3t") {
         sql ="parent.change=\""+parentTicket +"\"";
	}else if (childFileName == "imTask"){
	 	 sql ="parent.incident=\""+parentTicket +"\"";
	}
			
	var totalCost = 0;	
	if(child.doSelect(sql)== RC_SUCCESS){
		do {
			var convertedCost = 0; 
			convertedCost = convertCost(child.cost_currency_code,parentCurrency, child.total_cost);
			totalCost=totalCost+convertedCost;	
					
		}while  (child.getNext() == RC_SUCCESS);
						
	}
	
	return totalCost;	 
}
 
 
/**
 * @public
 * @description  convert cost from source currency to target currency
 * @param {String} sourceCurrency - sourceCurrency
 * @param {String} targetCurrency - targetCurrency
 * @param {Number} cost - cost
 * @return {Number} convertedcost - convertedcost 
 */
function convertCost(sourceCurrency,targetCurrency,cost){
	
	var rstObj = convertCurrency( sourceCurrency, targetCurrency, cost, funcs.tod());	
	var rc = rstObj.getReturnCode();					
	if (rc == 'success' || rc == 'fuzzy' )	{				
		return rstObj.getTargetQuantity();														
	}else {
		throw {exceptionName:"CostConvertException",sourceCurrency:sourceCurrency,targetCurrency:targetCurrency};
	}

}	

 

/**
 * @public
 * @description  Calculate total part cost and convert to target currency
 * @param {Array} labor - structure
 * @param {Array} part - structure
 * @param {String} targetCurrency - targetCurrency
 * @return {Number} cost - cost
 */
function calculateTotalPartLaborCost(fileName,labor, part, targetCurrency, notAdjust){

	var cost = 0;
	var laborcost = 0;
	var partcost = 0;
	 
	try{
	
		if (labor!=null){
			laborcost = calculateTotalLaborCost(labor,targetCurrency);
		}
		 
	    if(fileName!="request" && fileName!="requestTask" && part!=null){
	    	 
	    	partcost = calculateTotalPartCost(part,targetCurrency);
	    
	    } 
    
    }catch(err){
		var exceptionName = err.exceptionName;
            	
		if(exceptionName=="OperatorDoesNotExist"){
			
			msg(scmsg(1, "ticketCost",[err.operatorName]),3) ;

		}else if(exceptionName=="RateDoesNotCompletely"){
			 
			msg(scmsg(2, "ticketCost",[err.operatorName]),3) ;
			
		}else if(exceptionName=="CostConvertException"){				
			
			msg(scmsg(3, "ticketCost",[err.sourceCurrency,err.targetCurrency]),3) ;
		
		}else if(exceptionName=="PartDoesNotExist"){

            msg(scmsg(5, "ticketCost",[err.partNo]),3) ;

		}else if(exceptionName=="PartCostNotComplete"){

            msg(scmsg(6, "ticketCost",[err.partNo]),3) ;

        }else if(exceptionName=="LaborDateIsNull"){	
			
			msg(scmsg(7, "ticketCost"),3) ;
		
		}else if(exceptionName=="WorderHourNotRight"){				
			
			msg(scmsg(8, "ticketCost"),3) ;
		
        }	
				
		return ;
    }
    cost = laborcost + partcost;
    
    if(notAdjust==null || notAdjust==false){
        var digit = getDigitAfterDecimal(targetCurrency);
    	cost = round(cost, digit);    	
    }
    return cost;
}


/**
 * @public
 * @description  Calculate total part cost and convert to target currency
 * @param {Arrya} labor - structure
 * @param {String} targetCurrency - targetCurrency
 * @return {Number} cost - cost
 */
function calculateTotalPartCost(part, targetCurrency){

 	    var length = part.length();
        var partCost = 0 ;

        for (i=0; i<length; i++){
                if (part[i].quantity>0) {
                     var convertedCost = 0;
                     var rate = retrivePartRate(part[i].part_no);
                     convertedCost = convertCost(rate[1],targetCurrency,rate[0] * part[i].quantity);
                     partCost = partCost + convertedCost;
                }

        }
        return partCost; 	
	
}



/**
 * @public
 * @description  Calculate purchase task cost and convert to target currency
 * @param {String} part - part
 * @param {Number} quantity - quantity
 * @param {Number} unitcost - unitcost 
 * @param {String} targetCurrency - targetCurrency
 * @return {Number} cost - cost
 */
function calculatePurchaseTaskCost(part,quantity,unitcost,targetCurrency){ 
  	try{  	
 		    
	    var rate = retrivePartRate(part);
        convertedCost =  unitcost * quantity;
        var digit = getDigitAfterDecimal(targetCurrency);
		convertedCost = round(convertedCost, digit);    	
		
	}catch(err){
	
		var exceptionName = err.exceptionName;
            	
		if(exceptionName=="CostConvertException"){				
			
			msg(scmsg(3, "ticketCost",[err.sourceCurrency,err.targetCurrency]),3) ;
		
		}else if(exceptionName=="PartDoesNotExist"){

            msg(scmsg(5, "ticketCost",[err.partNo]),3) ;

		}else if(exceptionName=="PartCostNotComplete"){

            msg(scmsg(6, "ticketCost",[err.partNo]),3) ;

        }
		return;
	
	}
	return convertedCost;
	
	
}


/**
 * @public
 * @description  Calculate purchase task cost and convert to target currency
 * @param {String} sourceCurrency - unitcost 
 * @param {String} targetCurrency - targetCurrency
 * @param {Number} unitcost - unitcost 
 * @return {Number} cost - cost
 */
function calculateUnitCost(sourceCurrency,targetCurrency,unitcost){
  	try{  	 		  	       

    	convertedCost = convertCost(sourceCurrency,targetCurrency,unitcost);
        var digit = getDigitAfterDecimal(targetCurrency);
		convertedCost = round(convertedCost, digit);    	
		
	}catch(err){
	
		var exceptionName = err.exceptionName;
            	
		if(exceptionName=="CostConvertException"){				
			
			msg(scmsg(3, "ticketCost",[err.sourceCurrency,err.targetCurrency]),3) ;
		
		}
		return;
	
	}
	return convertedCost;
	
	
}


/**
 * @public
 * @description  Calculate total labor cost and convert to target currency
 * @param {Arrya} labor - structure
 * @param {String} targetCurrency - targetCurrency
 * @return {Number} cost - cost
 */
function calculateTotalLaborCost(labor, targetCurrency){

  	var length = labor.length(); 
  	  	
  	var laborCost = 0 ; 
	 
	for (i=0; i<length; i++){
	
		if (labor[i].operator!=null) {			
			var convertedCost = 0;
			if (labor[i].labor_date==null)
			{
			  throw {exceptionName:"LaborDateIsNull"};	
			}
			if (labor[i].hours_worked!=null && !(labor[i].hours_worked>0))
			{
			  throw {exceptionName:"WorderHourNotRight"};	
			}
			var rate = retriveLaborRateforOperator(labor[i].operator);						
			convertedCost = convertCost(rate[1],targetCurrency,rate[0] * labor[i].hours_worked);			
			laborCost = laborCost + convertedCost;
		}
	
	}  
 	return laborCost; 
}

/**
 * @public
 * @description  Retrive Labor Rate Information 
 * @param {String} operatorName - operatorName
 * @return {Array} rate.hour and rate.currency.code
 */
function retriveLaborRateforOperator(operatorName){

	 var operator= new SCFile("operator",SCFILE_READONLY); 
	 operator.setFields(["rate.hour","rate.currency.code"]);
     var sql="name=\""+operatorName +"\""; 
     var rate = [];
     if(operator.doSelect(sql)==RC_SUCCESS) { 
     
     	if(operator.rate_hour!=null && operator.rate_currency_code !=null) {     	
     		rate.push(operator.rate_hour);
     		rate.push(operator.rate_currency_code) ;
     	}else {      
     		throw {exceptionName:"RateDoesNotCompletely",operatorName:operatorName};		
      		
     	}
     }else{
     	throw {exceptionName:"OperatorDoesNotExist",operatorName:operatorName};		
		 
     }
     return rate;   
	
}


/**
 * @public
 * @description  Retrive Part Rate Information 
 * @param {string} partNo - Part Number
 */
function retrivePartRate(partNo){

	 var part= new SCFile("productCatalog",SCFILE_READONLY);
	 part.setFields(["cost","cost.currency.code"]);
     var sql="part.no=\"" + lib.StringUtil.escapeAllStr(partNo) + "\"";
     var rate = [];
     if(part.doSelect(sql)==RC_SUCCESS) {

        if(part.cost!=null && part.cost_currency_code !=null) {
                rate.push(part.cost);
                rate.push(part.cost_currency_code) ;
        }else {
                throw {exceptionName:"PartCostNotComplete",partNo:PartNo};
        }
     }else{
        throw {exceptionName:"PartDoesNotExist",partNo:PartNo};
     }

     return rate;
}
	


/**
 * main API to validate the labor and parts in record.
 * @param  {SCFile} record current record
 * @return {boolean}        pass or not
 */
function costValidation(record){

	var returnResult={isValid:true, errMsg:null};
	var fileName = filename(record);
	if(record["cost.currency.code"] === null || record["cost.currency.code"]===""){
		record["cost.currency.code"] = vars["$G.root.currency"];
	}
	else if($("currency").count('currency.code="'+record["cost.currency.code"]+'"')==0){
		var message = scmsg("currency_invalid","CostService",[record["cost.currency.code"]]);
		return {isValid:false, errMsg:message};
	}

	//validate parts
	if (fileName != "request" && fileName != "requestTask") {
		var result = validateField(record, "parts");
		if(result.code === "invalid"){
			var message = scmsg(result.msg,"CostService",[result.line].concat(result.msgValues));
			return {isValid:false, errMsg:message};
		}
	}
	
	//validate labor
	var result = validateField(record, "labor");
	if(result.code === "invalid"){
			var message = scmsg(result.msg,"CostService",[result.line].concat(result.msgValues));
			return {isValid:false, errMsg:message};
		}

	return returnResult;

}

/**
 * validate specific field
 * @param  {SCFile} record    current record
 * @param  {String} fieldName field name
 * @return {Object}           result
 */
function validateField(record, fieldName){

	var tempRecord = new SCFile(filename(record));
	var tempField = delnull(tempRecord[fieldName]);
	var currentField = record[fieldName];
	var lng = funcs.lng(delnull(record[fieldName]));
	var purified = false;

	for(var i=0; i<lng; i++){
		var result = applyRules(currentField[i],fieldName);
		
		if (result.code === "invalid") {
			result.line = i+1;
			return result;
		}
		if (result.code === "illegal" ){
			purified=true;
			continue;
		}
		if (result.code === "valid"){
			tempField.push(currentField[i]);
		}
	}

	if (purified) {
		record[fieldName] = tempField;
		return {"code":"valid"};
	}

	return {"code":"valid"};
}

/**
 * apply rules to field which needs validation
 * @param  {SCDatum} structure one item in the array of structure field
 * @param  {String} fieldName field name of the array
 * @return {Object}           result
 */
function applyRules(structure, fieldName){

	var result = {"code":"valid","msgValues":[]};
	var nowDate = date(new Date());


	if(fieldName === "parts"){
		//check if this item of array need to be removed.
		if((structure["part.no"] === null || structure["part.no"] === "") && ( structure["quantity"] === null)){
			result.code = "illegal";
			return result;
		}

		//check date time
		var partDate = date(structure["date"]);
		if(partDate === null || partDate === "" || partDate.getTime() > nowDate.getTime() ){
			result.code = "invalid";
			result.field = "date";
			result.msg = "part_date_error";
			return result;
		}
		//check part number
		if(structure["part.no"]===null || structure["part.no"] === ""){
			result.code = "invalid";
			result.field = "part.no";
			result.msg = "part_number_error";
			return result;
		}

		var part = $("productCatalog").select('part.no="' + lib.StringUtil.escapeAllStr(structure["part.no"]) + '"').uniqueResult();
		if(!part){
			result.code = "invalid";
			result.field = "part.no";
			result.msg = "part_number_none";
			result.msgValues.push(structure["part.no"]);
			return result;
		}
		if(part.cost == null || part["cost.currency.code"] == null || part["cost.currency.code"] == ""){
			result.code = "invalid";
			result.field = "part.no";
			result.msg = "part_number_info";
			result.msgValues.push(structure["part.no"]);
			return result;
		}

		//check quantity
		var quantity = structure["quantity"];
		if(quantity===null || quantity <= 0){
			result.code = "invalid";
			result.field = "quantity";
			result.msg = "part_quantity_error";
			return result;
		}
	}

	if (fieldName === "labor") {

		//check if this item of array need to be removed
		if((structure["operator"] === null || structure["operator"] === "") && (structure["hours.worked"] === null)){
			result.code = "illegal";
			return result;
		}

		//check date time
		var laborDate = date(structure["labor.date"]);
		if(laborDate === null || laborDate === "" || laborDate.getTime() > nowDate.getTime() ){
			result.code = "invalid";
			result.field = "labor.date";
			result.msg = "labor_date_error";
			return result;
		}
		//check operator
		if(structure["operator"] === null || structure["operator"] === ""){
			result.code = "invalid";
			result.field = "operator";
			result.msg = "labor_operator_error";
			return result;
		}
		var op = lib.operatorUtil.getOperatorByName(structure["operator"]);
		if (op === null) {
			result.code = "invalid";
			result.field = "operator";
			result.msg = "labor_operator_none";
			result.msgValues.push(structure["operator"]);
			return result;
		}
		if (op.rate_hour == null || op.rate_currency_code == null || op.rate_currency_code == ""){
			result.code = "invalid";
			result.field = "operator";
			result.msg = "labor_operator_info";
			result.msgValues.push(structure["operator"]);
			return result;
		}

		//check working hours
		var workingHours = structure["hours.worked"];
		if(workingHours===null || workingHours <= 0){
			result.code = "invalid";
			result.field = "hours.worked";
			result.msg = "labor_hours_error";
			return result;
		}

	}

	return result;
}

