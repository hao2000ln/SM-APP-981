

_ifArrayChanged = lib.svcCatalog2ItemCountTrigger.ifArrayChanged;

function indexOf(arr, item) {
	for (var i=0; i<arr.length; ++i)
		if (arr[i] == item)
			return i;
	return -1;
}

function contains(arr, item) {
	return indexOf(arr, item) != -1;
}



function updateAllsvcItemCounts() {	
	var updatedItemCountNameArr = new Array();
    var fSvcItemCount = new SCFile("svcItemCount");
   
    var arrayNumber = 0;
    var count = 0;
    var rc = fSvcItemCount.doSelect(true);
    
	 if (rc == RC_SUCCESS)
    {
    	rc = fSvcItemCount.getFirst();
    	
    	while (rc == RC_SUCCESS)
        {     
         if( !contains(updatedItemCountNameArr, fSvcItemCount["item.name"] )) {
            
           
             var fSvcCatalog = new SCFile("svcCatalog");            
             
             var rc1 = fSvcCatalog.doSelect("name=\"" + fSvcItemCount.item_name + "\"");
             if (rc1== RC_SUCCESS){                 
              
              if(updateItemCount(fSvcItemCount,fSvcCatalog))
                count++;			 
              
			   var fSvcItemCountSameName = new SCFile("svcItemCount");
     
               var rc2 = fSvcItemCountSameName.doSelect("item.name=\"" + fSvcItemCount.item_name + "\" and id ~=" + fSvcItemCount.id );
			   
			    if (rc2 == RC_SUCCESS){
			   
    	           rc2 = fSvcItemCountSameName.getFirst();    	
    	           while (rc2 == RC_SUCCESS) {     
                     if( updateItemCount(fSvcItemCountSameName,fSvcCatalog))
                       count++;        
                     rc2 = fSvcItemCountSameName.getNext();
                   }
                } 
             }
          }
         
          if( !contains(updatedItemCountNameArr, fSvcItemCount["item.name"] ))
	       updatedItemCountNameArr[arrayNumber++] = fSvcItemCount.item_name;  
		  rc = fSvcItemCount.getNext();
        }         
         
       
      }
     print("finish update records totally: " + count);  
      
   } 


function updateItemCount(fSvcItemCount,fSvcCatalog) {
       
  var ifaccessfilterChange = (fSvcItemCount.access_filter != fSvcCatalog.access_filter) ? true : false;
    
  var ifaccessListChange = _ifArrayChanged(fSvcItemCount.access_list, fSvcCatalog.access_list) ;  
  
  
  if( ifaccessfilterChange || ifaccessListChange) {			  
    if ( ifaccessfilterChange){		 
      var access_filter = new SCDatum(fSvcCatalog["access.filter"]);       
      fSvcItemCount["access.filter"] = access_filter; 
    }
    if (ifaccessListChange) {		  
      fSvcItemCount["access.list"] = fSvcCatalog["access.list"];
    }

    fSvcItemCount["support.item"] = fSvcCatalog["support.item"];

    var ret;
    system.functions.rtecall("trigger", ret, 0);             
    fSvcItemCount.doUpdate();
    print("update svcItemCount...item.name = " + fSvcItemCount.item_name);
    system.functions.rtecall("trigger", ret, 1); 
    return true;
	
    }
	return false;
}

//updateAllsvcItemCounts();

