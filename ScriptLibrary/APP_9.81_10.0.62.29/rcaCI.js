function affectedCI()
{
    var _denull = system.functions.denull;
    var member = new Array();
    
    vars.$file.affected_ci = _denull(vars.$file.affected_ci); 
    vars.$affected_ci_sub = _denull(vars.$affected_ci_sub); 
    
    if (vars.$affected_ci_sub == null) {
	    vars.$affected_ci_sub={};
    }
      
   
   //Remove duplicate or null affected ci
    var original_ci_sub_length =  vars.$affected_ci_sub.length();      
    vars.$affected_ci_sub = lib.ArrayUtil.removeDuplicateEmptyElement(lib.ArrayUtil.toJsArray(vars.$affected_ci_sub));    
    if(original_ci_sub_length != vars.$affected_ci_sub.length()){
       
   	   print(system.functions.scmsg( 40, "trigger",["AffectedCI"]))
    
    }
   	
    //assign the value to affected.ci and remove the empty value
    if (vars.$affected_ci_sub.length() > 0 ) {
       
        member = _denull(vars.$affected_ci_sub); 
        var idx=0;
        for (var i =0; i < vars.$affected_ci_sub.length(); i++) {         
		    	vars.$file.affected_ci[idx++].ci_device_name = member[i];
	    }
	    
    }
   
    //remove the redundant elements if necessary
    if (vars.$file.affected_ci.length() > vars.$affected_ci_sub.length()) {
	    for (var j = vars.$affected_ci_sub.length(); j < vars.$file.affected_ci.length(); j++) {
		    vars.$file.affected_ci[j]=null;
	    }
	vars.$file.affected_ci = _denull(vars.$file.affected_ci);
    }

	//calculate the affected ci count
    vars.$file.affected_ci_count= _denull(vars.$file.affected_ci).length();
}





    
    
    
    
