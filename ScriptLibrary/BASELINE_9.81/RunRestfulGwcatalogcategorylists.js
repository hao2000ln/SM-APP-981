var _ = lib.Underscore.require();
var $ = lib.c.$;
var restm=lib.RestfulMain;
var logger = getLog('RunRestfulgwcatalogcategorylists');
var makeSort=lib.RestfulQuery.makeSort;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var tod = lib.GatewayAPI_RAD._tod;


function POST(req, res) {
	//logger.setLevel("debug");
    var startTime = new Date();
    var msgs=[];
	var start = +req.body.gwcatalogitem.start || 1;
	var count = +req.body.gwcatalogitem.count || 50;
    var mixedLanguage = req.body.gwcatalogitem.mixedLanguage;
	
  
	if(start<1) start=1;
	if(count<1) count=50;

	var appendquery = req.body.gwcatalogitem.query;
   
    var sql ='select t1.name name,t1.parent parent,t1.access.filter access.filter'+
                    ',t2.displayName displayName,t2.description description'+     
                    ' from svcCatalog t1 left outer join svcDisplay t2 on (t1.name=t2.name)';
    var countSql ='SELECT count(distinct t1.name)' 
     		+ ' from svcCatalog t1 left outer join svcDisplay t2 on (t1.name=t2.name)';           
     
    var beforeCW = new Date();
	 logger.debug("beforegetCapabilityWordCache Total Time Cost : " + (beforeCW.getTime()- startTime.getTime()));
	var capability = [];
	var oriOperator=funcs.operator();
	var requestOnBehalf=req.body.gwcatalogitem.operator;
	if (requestOnBehalf !=null && requestOnBehalf !="") {
	   if (oriOperator!=requestOnBehalf)
	    lib.GatewayAPI_Util.changeUserSession(requestOnBehalf);
	} 
	var newOper=funcs.operator();
    capability = lib.GatewayAPI_Cache.getCapabilityWordCache().get(newOper);
    var afterCW = new Date();
	logger.debug("aftergetCapabilityWordCache Total Time Cost : " + (afterCW.getTime()- beforeCW.getTime()));
    var filter = new QueryCond('active', EQ, true)
                .and(new QueryCond('access.list', ISIN, capability).or(new QueryCond('access.list', EQ, null)))
                .asRAD();
	if (appendquery!=null && appendquery!='') 
	{
	 
	  sql+= ' where '+appendquery + ' and '+filter;
	  countSql+= ' where '+appendquery + ' and '+filter;
	}
	else
	{
	  sql += ' where '+ filter;
	  countSql += ' where '+ filter;
	}
    logger.debug("sql is" + sql);
    

	var fieldList = ['name','parent','displayName','description'];
     
    var beforeQuery = new Date();
	logger.debug("beforeQuery Total Time Cost : " + (beforeQuery.getTime()- afterCW.getTime()));

	var sortinput = req.body.gwcatalogitem.sort;
    var returnFile;
    if (sortinput != null) {
        var sort = makeSort(sortinput,{});
        var sortFields = sort.sort;
        var sortSeqs = sort.sortorder;
        returnFile = $("joinsvcDisplay", SCFILE_READONLY).setFields(fieldList).setOrderBy(sortFields, sortSeqs).select(sql);
    } else {
        returnFile = $("joinsvcDisplay", SCFILE_READONLY).setFields(fieldList).select(sql);
    }
	
	var aferQuery = new Date();
	logger.debug("aferQuery Total Time Cost : " + (aferQuery.getTime()- beforeQuery.getTime()));
	var countFile= $('svcCatalog', SCFILE_READONLY).select(countSql);
	var totalCount=0;
	var rc1=countFile.rc;
	if (rc1==RC_SUCCESS) totalCount = countFile.uniqueResult()[0];
	var rc=returnFile.rc;
    var afterCount = new Date();
	 logger.debug("afterCount Total Time Cost : " + (afterCount.getTime()- aferQuery.getTime()));
	var f = returnFile.scfile;
	
    var beforeSkip = new Date();
	 logger.debug("beforeSkip start Total Time Cost : " + (beforeSkip.getTime()- afterCount.getTime()));
  // skip the start
	var recordIndex = 0;
	while (rc == RC_SUCCESS && recordIndex < start - 1) {
    recordIndex++;
    rc = f.getNext();
    }

  // get the page data    
	var data = [];
	var recordIndex = 0;    
    var catalogItemNames = [];
	while (rc == RC_SUCCESS && recordIndex < count) {
	  var startRepack = new Date();
	  var canaccess = true;
	  logger.debug("Category/item and access filter evaluation--- : " + f.name+" === "+f.access_filter);
      if (f.access_filter && f.access_filter.toString() != '' && f.access_filter.toString() != 'true')
      {  
         if(f.access_filter.toString().indexOf("$L.file")!==-1){
             canaccess=true;
         }
         else{
             canaccess = funcs.evaluate(funcs.parse(f.access_filter.toString(), 2));
         }
         logger.debug("Category/item and access filter evaluation result is--- : " + f.name+" === "+canaccess);
      } 
    
      if(canaccess)
      {
	 	     var value = {
              name: f.name,
              displayName: f.displayName,
              description: f.description,
              parent: f.parent.toArray()
              };
      
	    data.push(removeEmptyKeysAndWrapIt(value));
	    catalogItemNames.push(value.name);
	  }else {
	   totalCount=totalCount-1;
	  }
	 
      var beforeGetNext = new Date();
	  rc = f.getNext();
	  logger.debug("getNext Time Cost : " + (new Date().getTime() - beforeGetNext.getTime()));
	  recordIndex++;
	  logger.debug("repack one  Time Cost : " + (new Date().getTime() - startRepack.getTime()));
	}
	
	if (mixedLanguage != null) {
        var localization = lib.GatewayAPI_Util.getLocalizedCatalogMap(catalogItemNames, mixedLanguage);
        // Replace displayName and decriptin in english locale for catalog items
        for (var i = 0; i < data.length; i++) {
            var name = data[i].name;
            if (localization[name] != null ) {
                data[i].displayName = localization[name].displayName;
                data[i].description = localization[name].description;
            }
        }
    }
      var repack = new Date();
      logger.debug("repack Total Time Cost : " + (repack.getTime()- afterCount.getTime()));
      logger.debug("Total Time Cost : " + (new Date().getTime()- startTime.getTime()));
      res.send({Messages: msgs, entities: data, '@start': start, '@count': data.length, '@totalcount': totalCount });

	if (newOper!=oriOperator)
	    lib.GatewayAPI_Util.changeUserSession(oriOperator);
	    
}


function removeEmptyKeysAndWrapIt(obj) {
	if(obj != null) {
		for(var key in obj) {
			if(obj[key]==null || obj[key]==='') {
				delete obj[key];
			}
		}
	}
	return obj;
	
}


    
function cleanParameter(parm) {	
    if (parm) {
        parm = parm.replace(/\\\\/g, '\\');
        parm = parm.replace(/\\\"/g, '\"');
        parm = parm.replace(/"/g, '');
    } 
    return parm;
}

function authorize() {
  return true;
}



