
/**
 * @public
 * @description  Whether need to migrate the ocml
 * @param {record} OCMO - OCMO
 * @return {boolean} true/false (skip/notskip) 
 */
function evaluteOrder(record){

	var result = true;	
	var parentTicket=record.parent_order;
	var sql="number=\""+parentTicket+"\"";
	var order=new SCFile("ocmo", SCFILE_READONLY); 
	order.setFields("description");
	
	if(order.doSelect(sql)===RC_SUCCESS){
		if (order.description.toArray().toString().indexOf("reordered")>0) {		
			result = false;
 		}	 
	}
 	return result;
	
}