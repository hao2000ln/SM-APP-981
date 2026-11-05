function checkChildGoupAllclosed (strLineItemID,quotesID, dependencyType){
   if (dependencyType=="close") {
   	dependencyType="closed";
   }
   var childLineItem =  new  SCFile( "ocml"  );
   var rc =  childLineItem.doSelect ( "parent.quote=\""  +  quotesID +  "\" and parent.line.item=\"" + strLineItemID +  "\""  );  
   while (rc == RC_SUCCESS)
    {
      var childGroupLineItem =  new  SCFile( "ocml") ;
      var rc =  childGroupLineItem.doSelect ( "parent.quote=\""  +  quotesID +  "\" and group.parent=\"" + childLineItem. number +  "\""  );
      while (rc == RC_SUCCESS)
       {
         if ( childGroupLineItem. status !=  dependencyType ) {
              return  false ;
          }
       
        rc =  childGroupLineItem.getNext () ;
      }              
     rc = childLineItem.getNext () ;   
    }
    return true;
}

function groupIsAvailable(gName){
	if (gName){
		if (trim(gName)=="") {
			return false;
		}
		if (trim(gName)=="undefined") {
			return false;
		}
		if (trim(gName)=="NULL") {
			return false;
		}
		if (trim(gName)=="null") {
			return false;
		}
		if (trim(gName)=="Null") {
			return false;
		}
		return true;		
	}
	return false;
}

function trim(str){  
    return str.replace(/(^\s*)|(\s*$)/g, "");  
}

//print(groupIsAvailable("undefined"));


/**
 * Additional line items check
 * This function is called in rad ocm.dates.check 
 */
function checkLineItems() {
	// customize here
//	if (vars.$G_bg) {
//		vars.$recalc_comp = true;
//		vars.$use_order_base = true;
//	}
}