

/**
 * CR:84557
 *
 * This function update opened.by.uid and updated.by.uid fields to always store operator name 
 *

 **/
function updateInteractionFields() {
	// get count of svcCoung
	// explicit reference makes dependence problem, should we fix this?
	
    var fIncident = new SCFile("incidents");

    var rc = fIncident.doSelect("null(updated.by.uid) or null(opened.by.uid)");

	 if (rc == RC_SUCCESS)
    {
    	rc = fIncident.getFirst();
    	
    	while (rc == RC_SUCCESS)
        {     
         if(fIncident["opened.by"] != null && fIncident["opened.by"] != "" || fIncident["updated.by"] != null && fIncident["updated.by"] != "" )
           {
             var operatorUpdateName =  (fIncident["updated.by"] != null && fIncident["updated.by"] != "" ) ? fIncident["updated.by"] : fIncident["opened.by"];
             var operatorOpenName =  (fIncident["opened.by"] != null && fIncident["opened.by"] != "" ) ? fIncident["opened.by"] : fIncident["updated.by"];
            
             var fOperator = new SCFile("operator");            
             
             var rc1 = fOperator.doSelect("name=\"" + operatorUpdateName + "\" or full.name=\"" + operatorUpdateName + "\"");
             if (rc1== RC_SUCCESS)
               
             {              
              fIncident["updated.by.uid"] = fOperator["name"];
             }  
             else
              fIncident["updated.by.uid"] = operatorUpdateName;  
             var fOperator2 = new SCFile("operator");  
               
             var rc2 = fOperator2.doSelect("name=\"" + operatorOpenName + "\" or full.name=\"" + operatorOpenName + "\"");
             if (rc2== RC_SUCCESS)
               
             {
              fIncident["opened.by.uid"] = fOperator2["name"];
              
             }  
              else
              fIncident["opened.by.uid"] = operatorOpenName;
                     
             var ret;
             system.functions.rtecall("trigger", ret, 0);             
             fIncident.doUpdate();
             system.functions.rtecall("trigger", ret, 1); 
           }         
         
         rc = fIncident.getNext();
       }
    } 
}




//updateInteractionFields();

