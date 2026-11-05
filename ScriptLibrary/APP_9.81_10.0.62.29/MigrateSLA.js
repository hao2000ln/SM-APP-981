/* 
* Introduction: This function is to set the SLA category while migrating sla data.
	If the sla related slo have same type, set the sla category as the slo type; 
	If not, set sla's category to "sla".
* Date:20140811
* Author:xiaoning.li 
* @param  Agreement ID of SLA record.
* @return SLA type.
*/ 

function migrateSLA(agreementid){

    var slacategory="sla"
	var slofile = new SCFile("slo",SCFILE_READONLY);
	slofile.setFields(["type"]);
	var rc = slofile.doSelect("agreement.id=\""+agreementid+"\""+" and type <>\"null\"");
	
    var slotypeArray = [];
    if (rc==RC_SUCCESS){
	   while(rc==RC_SUCCESS){
          slotypeArray.push(slofile.type)
          rc=slofile.getNext();
	   }
	   
		var firstslotype=slotypeArray[0];
	    for(var j=1; j<slotypeArray.length; j++)
		{
		   if(firstslotype != slotypeArray[j]){
		    return slacategory;
		   }
	
	    }
	    return firstslotype;
	}
	
	else {
		return slacategory;
	}
}


