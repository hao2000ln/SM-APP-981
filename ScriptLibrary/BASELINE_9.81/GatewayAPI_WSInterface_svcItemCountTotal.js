
function updategwsvcItemCountTotal(itemId,itemName) {
	var fsvcItemCountTotal = new SCFile("gwsvcItemCountTotal");
	var query="itemId=\""+itemId+"\"";
    var rc=fsvcItemCountTotal.doSelect(query);
	if(rc == RC_SUCCESS ) {
	    fsvcItemCountTotal['popularity']=getPopularity(itemId); 
	    fsvcItemCountTotal['isPopular']=checkPopular(fsvcItemCountTotal['popularity']);
	    fsvcItemCountTotal.doUpdate();
	} else {
		fsvcItemCountTotal['itemId'] = itemId;	
		fsvcItemCountTotal['_name'] = itemName;	
		fsvcItemCountTotal['popularity']=getPopularity(itemId); 
	    fsvcItemCountTotal['isPopular']=checkPopular(fsvcItemCountTotal['popularity']);
	    fsvcItemCountTotal.doInsert();
	}
}
	
	


function getPopularity(itemId) {
	var popularity;
	var sql ='select itemId, sum(count) as temp from svcItemCount where itemId='+itemId
	     +' group by itemId';
	var svcItemCount = lib.c.$("svcItemCount", SCFILE_READONLY).select(sql);
	var rc= svcItemCount.rc;
	var f = svcItemCount.scfile;
	if (rc == RC_SUCCESS){
		if(f!=null) {
			popularity = f.temp;
		} else {
			popularity = 0;
		}
	} else {
		popularity = 0;
	}
	return (popularity);
}	


function checkPopular(popularity){
	var popularity;
    if(popularity>3){	
		return true;
	}else {
    	return false;
    }
}	


