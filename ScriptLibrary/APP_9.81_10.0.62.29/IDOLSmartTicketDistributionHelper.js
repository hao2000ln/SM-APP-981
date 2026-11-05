var IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require(),
    IDOLSmartTicketCategoryDistribution = lib.IDOLSmartTicketCategoryDistribution.require(),
    IDOLSmartTicketCategoryDistributionMand = lib.IDOLSmartTicketCategoryDistributionMand.require();

function drawDistribution(fCategorizer, company) {
  
  var html = '';
  try {
    var async = isAsync();
    if(async) {
       var cache = getCache(fCategorizer['adapter.id'], company);
       if(cache) {
          html = cache;
       }else{
          html += '<h1>'  + system.functions.scmsg('57', 'idol') + '</h1>';
          html += '<pre>' + system.functions.scmsg('58', 'idol') + '</pre>';
       }
    }else{
       html = calculateDistribution(fCategorizer, company);
    }
  } catch(e) {
    html += '<h1>' + e + '</h1>';
    html += '<pre>' + e.stack + '</pre>';
  }
  vars['$L.smart.ticket.category.distribution'] = html;
}

function isAsync() {
  
  var ret = false;
  var settings = new SCFile("settings", SCFILE_READONLY);
  var sql = "name=\"Smart Ticket\"";
  if (settings.doSelect(sql) == RC_SUCCESS) {
     ret = lib.settings.getValue("Smart Ticket", "distribute.asyc", settings);
  }
  if(ret) {
     return system.functions.val(ret,4);
  }else{
     return false;
  }
  
  //return lib.settings.getSettingValue("Smart Ticket", "distribute.asyc");
}


function calculateDistribution( fCategorizer, company ){
   var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer, company);
   //var results = IDOLSmartTicketCategoryDistribution.analyze(categorizer);
   var results = IDOLSmartTicketCategoryDistributionMand.analyze( categorizer );
   html = IDOLSmartTicketCategoryDistribution.toHTML(results);
   saveCache(fCategorizer['adapter.id'], company, html);
   return html;
}

function getNextId(){
  var sql = "true";
  var distributionCacheFile = new SCFile("SmartTicketDistributionCache", SCFILE_READONLY);
  var count = distributionCacheFile.doCount(sql);
  return count + 1;
}

function getCache( categorizerId, company ) {
    var distributionCacheFile = new SCFile("SmartTicketDistributionCache");
    var checkSql = 'categoizer.id="'+ categorizerId +'"';
    if(company) {
       checkSql = checkSql +  ' and ' + 'company="'+ company +'"';
    }
    if(RC_SUCCESS == distributionCacheFile.doSelect(checkSql)) {
      var bufferArray = distributionCacheFile['htmlbuffer'];
      var ret = "";
      for(var i=0; i<bufferArray.length(); i++ ){
         if(bufferArray[i]){
           ret = ret + bufferArray[i];
         }
      }
      return ret;
    }else{
      return null;
    }
}

function saveCache( categorizerId, company, html ){
    var distributionCacheFile = new SCFile("SmartTicketDistributionCache");
    var checkSql = 'categoizer.id="'+ categorizerId +'"';
    if(company) {
       checkSql = checkSql +  ' and ' + 'company="'+ company +'"';
    }
    
    //print(checkSql);
    
    if(RC_SUCCESS == distributionCacheFile.doSelect(checkSql)){
       distributionCacheFile['generate.time'] = system.functions.tod();
       distributionCacheFile['htmlbuffer'] = []
       distributionCacheFile['htmlbuffer'].push(html);    
  	   distributionCacheFile.doUpdate();
    }else{
       var newdistributionCacheFile = new SCFile("SmartTicketDistributionCache");
       newdistributionCacheFile['categoizer.id'] = categorizerId;
       newdistributionCacheFile['company'] = company;
       newdistributionCacheFile['generate.time'] = system.functions.tod();
       newdistributionCacheFile['htmlbuffer'] = []
       newdistributionCacheFile['htmlbuffer'].push(html);       
       newdistributionCacheFile['id'] = getNextId();
  	   newdistributionCacheFile.doInsert();    
    }
}
