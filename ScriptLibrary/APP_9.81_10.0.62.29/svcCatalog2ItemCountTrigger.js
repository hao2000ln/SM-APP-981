var str = system.functions.str;
var isEmpty = lib.ArrayUtil.isEmpty;
var indexOf = lib.ArrayUtil.indexOf;
var contains = lib.ArrayUtil.contains;
var length = lib.ArrayUtil.length;
var isArray = lib.ScAPI_Util.isArray;

function each(arr, callback) {
	for (var i=0; i<length(arr); ++i) {
		callback(arr[i]);
	}
}

function subtract(set1, set2) {
   var rt = isArray( set1 );
   var rt1 = isArray( set2 );
   var ret = [];
 
   if ((!rt[0] && rt[1]>0) || (!rt1[0] && rt1[1]>0))
     return ((rt[0] && rt[1]>0)? set1: ((rt1[0] && rt[11]>0)? set2:ret));
    
	
	var ret = [];
	each(set1, function (item) {
	 
		if (!contains(set2, item)) {	
		
			ret[ret.length] = item;
		}
	});
	return ret;
}






function updateSvcItemCount(before, after) {


    var ifaccessfilterChange = (before.access_filter != after.access_filter) ? true : false;
    
    var ifaccessListChange = ifArrayChanged(before.access_list, after.access_list) ;
	if( ifaccessfilterChange || ifaccessListChange) {
	  var svcItemCountfile = new SCFile('svcItemCount');
	  var rc = svcItemCountfile.doSelect('item.name = "' + after.name + '"');
			
   
	 if (rc == RC_SUCCESS)
      {
    	rc = svcItemCountfile.getFirst();
    	
    	while (rc == RC_SUCCESS)
        { 
          if(ifaccessfilterChange)
          {
          var access_filter = new SCDatum(after.access_filter);
          svcItemCountfile["access.filter"] = access_filter;
          
          }
          if(ifaccessListChange)  
            svcItemCountfile["access.list"] = after.access_list;
          svcItemCountfile["support.item"] = after["support.item"] ;

          var ret;
          system.functions.rtecall("trigger", ret, 0);             
          svcItemCountfile.doUpdate();
          system.functions.rtecall("trigger", ret, 1); 
                
         
          rc = svcItemCountfile.getNext();
       }
    } 
	
  }	 
	
}

function ifArrayChanged(before, after) {
   
	var removed = subtract(before, after);	
  
    
  
	if (!isEmpty(system.functions.denull(removed)))
	{
	
	
	  return true;
	  }
	var added = subtract(after, before);
	 
	if (!isEmpty(system.functions.denull(added)))
	{
	
	  return true;
	  }
	return false;
}