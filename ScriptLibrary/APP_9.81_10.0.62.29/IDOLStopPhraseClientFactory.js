var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLRequest = lib.IDOLRequest.require(),
    IDOLURLParser = lib.IDOLURLParser.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLHTTPRequest = lib.IDOLHTTPChannel.require(),
    IDOLKMIndexStatus = lib.IDOLKMIndexStatus.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require();

//management stop phrase index job priority is 100
var sPrioritystr = "priority=100"
    
//Max Retry times is 5 
var MAX_RETRY_TIME = 5;
//Inteval is 1 second
var RETRY_WAIT_INTEVAL = 1;
var logger = getLog('IDOLStopPhraseClientFactory');

var IDOLStopPhraseClientFactory = (function() {

  function IDOLStopPhraseClientInternal() {}
      
  IDOLStopPhraseClientInternal.prototype.doPost = function( url, requestbody ){
    var httpHeaders = new Array();
    var contentHeader = new Header();
    contentHeader.name = "Content-Type";
    contentHeader.value = "application/json";
    httpHeaders.push(contentHeader);

    try {
       var response = doHTTPRequest("POST", url, httpHeaders, requestbody);
       return response;
    }
    catch (ex) {
       print("Exception for connecting smart search services: " + ex);
       return "";
    }
  }

  IDOLStopPhraseClientInternal.prototype.doGet = function( url ){
    var httpHeaders = new Array();
    try {
       var response = doHTTPRequest("GET", url, httpHeaders, null, 30, 30, 30);
       return response;
    }
    catch (ex) {
       print("Exception for connecting smart search services: " + ex);
       return "";
    }    
  }

  ///---------------------------------------------------------------------  
  function IDOLStopPhraseClient() {}
  IDOLStopPhraseClient.prototype = new IDOLStopPhraseClientInternal();
  
  IDOLStopPhraseClient.prototype.getQueryEndPoint = function() {
    var idolUrl = IDOLConfigure.getEndPoint();
    var result = lib.IDOL_Tools_Tree.getIDOLTree(idolUrl);
    var saContent = result['saContent'];
    var idolServerEP = IDOLURLParser.parse(idolUrl);
    var ret=idolUrl;
    for (var i = 0; i < saContent.length; i++) {
      if(saContent[i].name == "SmartSearch"){
        continue;  
      }else if(saContent[i].status == 'online' || saContent[i].status === 'RUNNING'){
        ret = idolServerEP.protocol + '://' + saContent[i].host + ':' + saContent[i].port + '/'
        break;
      }else{
        ret = idolServerEP.protocol + '://' + saContent[i].host + ':' + saContent[i].port + '/'
      }
    }
    
    logger.info("getQueryEndPoint: " + ret);
    return ret;
  };
  
  IDOLStopPhraseClient.prototype.getUpdateEndPoint = function() {
    var endpoint =  IDOLConfigure.getIDOLIndexBaseURL();
    logger.info("getUpdateEndPoint: " + endpoint);
    return endpoint;    
  };
  
  IDOLStopPhraseClient.prototype.getIndexResultEndPoint = function() {
    return IDOLConfigure.getEndPoint();
  };
   
  
  IDOLStopPhraseClient.prototype.getStopPhraseList = function() {
    try {
      var aStopPhrases = [];
       var endPoint = this.getQueryEndPoint();
        if (endPoint) {
          var xRetVal = IDOLRequest.doIDOLGet(endPoint, { action : 'QuerySummaryManagement' , List : 'StopPhrase'});
           if (xRetVal) {
            _.each(XQuery.query('responsedata/stopphrase/phrase', xRetVal), function(xPhrase) {
             aStopPhrases.push(String(xPhrase.getNodeValue("phrase")))
            }); 
           } 
          }
        return aStopPhrases;
    } catch (ex) {
      print(system.functions.scmsg("stopphrase.error.getstopphraseslist.idol","idolfarm"));
      logger.info(ex.toString() + " Stack: " + ex.stack);
    }
    
    return null;
  };
  
  IDOLStopPhraseClient.prototype.addStopPhraseList = function( stopPhrases ) {
    try{
      return this._manageStopPhrases("add", stopPhrases );
    } catch (ex) {
      print(system.functions.scmsg("stopphrase.error.addstopphraseslist.idol","idolfarm"));
      logger.info("add stophphreases meet error:" + stopPhrases + " exception:" + ex.toString() + " Stack: " + ex.stack);
    }
    return false;
  };  
  
  IDOLStopPhraseClient.prototype.removeStopPhraseList = function( stopPhrases ) {
    try{
      return this._manageStopPhrases("remove", stopPhrases );
    } catch (ex) {
      print(system.functions.scmsg("stopphrase.error.removestopphraseslist.idol","idolfarm"));
      logger.info("remove stophphreases meet error:" + stopPhrases + " exception:" + ex.toString() + " Stack: " + ex.stack);
    }
    return false;
  };
  
  /*
  IDOLStopPhraseClient.prototype._manageStopPhrases = function (sAction, aStopPhrases ){
   
    var aLocalStopPhrases = _.map(
         _.uniq( 
           _.filter( 
             aStopPhrases, 
                 function( stopphrase ){ 
                   return (stopphrase !== null) && (stopphrase!== "null"); 
                 }
              )
           ), 
           function(phrase){ 
             return encodeURIComponent(_.trim(phrase));
           }
      );
      
      
    var endPoint = this.getUpdateEndPoint();
    var ret = [];
    
    for(var i=0; i<aLocalStopPhrases.length; i++ ){
       var jRequest ={'action':sAction, 'stopPhrase':  aLocalStopPhrases[i], 'indexId':null, 'indexResult': null };    
       jRequest['indexId'] = this._manageStopPhrase(jRequest);
       ret.push(jRequest);
    }
    
    logger.info( sAction + " StopPhrases:" + _.pluck(ret, 'stopPhrase') + " return indexIDs :" + _.pluck(ret, 'indexId'));
    
    var retryTime = 0;
    var allDone = false;
    var checkResult = {};
    
    while( retryTime < MAX_RETRY_TIME){
      checkResult =  this._isAllDone(ret);      
      if(checkResult['alldone']){
        allDone = true;
        break;
      }
      system.functions.sleep(RETRY_WAIT_INTEVAL);
      retryTime ++;
    }

    if(allDone){
      logger.info("indexIDs:"  + _.pluck(ret, 'indexId') + " already all done , final allIndexResult:" + _.pluck(checkResult['allIndexResult'], 'indexResult'));
    }else{
      logger.info("indexIDs:"  + _.pluck(ret, 'indexId') + " has retry for " + (MAX_RETRY_TIME * RETRY_WAIT_INTEVAL) +" seconds,  but still not all done, final all IndexResult:" + _.pluck(checkResult['allIndexResult'], 'indexResult'));
    }
    
    if(this._isAllSucceed( checkResult['allIndexResult'] )){
      return true;
    }else{
      return false;
    }
 }*/
  
  
    
  IDOLStopPhraseClient.prototype._manageStopPhrases = function (sAction, aStopPhrases ){
  
    var aLocalStopPhrases = _.chain(aStopPhrases)
                             .filter(function(stopphrase){ return (stopphrase !== undefined) && (stopphrase !== null); })
                             .uniq()
                             .map(function(phrase){ return encodeURIComponent(_.trim(phrase));})
                             .value();
      
    var sLocalStopPhrases = aLocalStopPhrases.join(",");
    var endPoint = this.getUpdateEndPoint();
    var ret = [];
    var jRequest ={'action':sAction, 'stopPhrase': sLocalStopPhrases, 'indexId':null, 'indexResult': null };    
    jRequest['indexId'] = this._manageStopPhrase(jRequest);
    ret.push(jRequest);
    logger.info( sAction + " StopPhrases:" + sLocalStopPhrases + " return indexIDs :" + _.pluck(ret, 'indexId'));
    
    var retryTime = 0;
    var allDone = false;
    var checkResult = {};
    
    while( retryTime < MAX_RETRY_TIME){
      checkResult =  this._isAllDone(ret);      
      if(checkResult['alldone']){
        allDone = true;
        break;
      }
      system.functions.sleep(RETRY_WAIT_INTEVAL);
      retryTime ++;
    }

    if(allDone){
      logger.info("indexIDs:"  + _.pluck(ret, 'indexId') + " already all done , final allIndexResult:" + _.pluck(checkResult['allIndexResult'], 'indexResult'));
    }else{
      logger.info("indexIDs:"  + _.pluck(ret, 'indexId') + " has retry for " + (MAX_RETRY_TIME * RETRY_WAIT_INTEVAL) +" seconds,  but still not all done, final all IndexResult:" + _.pluck(checkResult['allIndexResult'], 'indexResult'));
    }
    
    if(this._isAllSucceed( checkResult['allIndexResult'] )){
      logger.info("update stop phrases succeed, all index is done with -1(complete), stopPhrases: " + _.pluck(checkResult['allIndexResult'], 'stopPhrase'));
      return true;
    }else{
      return false;
    }
  }
  
  
  IDOLStopPhraseClient.prototype._manageStopPhrase = function(jRequest) {
    sStopPhrase = jRequest['stopPhrase'];
    sAction = jRequest['action'];
    
    var ret="0000";
    try {
      var sURL = this.getUpdateEndPoint();
      sURL += 'DREQUERYSUMMARYMANAGEMENT?Action=' + sAction + '&' + sPrioritystr + '&' + 'List=StopPhrase' + '&' + 'Phrase=' + sStopPhrase;
      logger.info(sURL);
      var xRetVal = lib.jsaci.runIDOLAction(sURL, true);
      //print(xRetVal);
      if (_.startsWith(xRetVal, "INDEXID=")) {
        var pos = xRetVal.indexOf("INDEXID=") + "INDEXID=".length;
        ret = xRetVal.substring(pos);      
        return parseInt(ret);
      } else {
        logger.info("Action: " + sAction + " for stop phrase: " + sStopPhrase + " returned: " + xRetVal +" meet error");
      } 
    } catch (ex) {
      logger.info("add stopPhrase meet error:" + sStopPhrase + " exception:" + ex.toString() + " Stack: " + ex.stack);
      print(ex.toString() + " Stack: " + ex.stack);
    } 
    return ret;
  }
  
  IDOLStopPhraseClient.prototype._isAllSucceed = function( aRequestArray ) {
    for(var i=0; i< aRequestArray.length; i++ ){
      var request = aRequestArray[i];  
      if(request['indexResult'] != -1){
        return false;
      }
    }
    return true; 
  }
  
  IDOLStopPhraseClient.prototype._isAllDone = function( jRequestArray ) {
      
    var retIndexArray = []; 
     
    for(var i=0; i< jRequestArray.length; i++ ){
      var request = jRequestArray[i];  
      var indexId = request['indexId'];
      
      var indexResult = this._checkIndexStatus(indexId);
      request['indexResult'] = indexResult['rc'];
      retIndexArray.push(request);
      
      if(indexResult['rc'] != -1 && indexResult['rc'] != -37){
        return {'alldone':false, 'allIndexResult':retIndexArray};
      }
    } 
    return {'alldone':true, 'allIndexResult':retIndexArray};
  };
 
  
  IDOLStopPhraseClient.prototype._checkIndexStatus = function (indexID) {  
    var rc = {'rc':2, 'reason':''};
    var ret = 2;
    var reason = '';
        
    try {
     var endPoint = this.getIndexResultEndPoint();
     var xml = IDOLRequest.doIDOLGet(endPoint, { action : 'IndexerGetStatus' , index : indexID});

     if(xml == null) {
       rc['rc'] = 2;
       rc['reason']  = 'no response from IDOL server';
       return rc;
     }
     
     var ret = 2;
     var reason = '';
     //logger.info(xml);
     var child = lib.jsaci.getResponsedata(xml);
     if(child != null) {
       var item = lib.jsaci.findFirstNamedItem(child,"item");
       
       while(item != null) {
         if(indexID == -1)  {
           var statusnow = lib.jsaci.getFirstNamedItemValue(item,"status");
           if(statusnow =="-4") {
             ret = -1;
             reason ="Index data fail due to database name error!";
           } else if(statusnow =="-5") {
             ret = -1;
             reason =  "Index data fail due to bad parameter!";
           }
           if( statusnow =="-1"  || statusnow== "-37" || "-10" == statusnow) {
             ret = 0;
             reason = 'Seems complete';
           }
           rc['rc'] = ret;
           rc['reason'] = reason;
           break;
         }
         if(indexID.toString().replace('\n','') == lib.jsaci.getFirstNamedItemValue(item,"id"))  {
           var specialstatus = lib.jsaci.getFirstNamedItemValue(item,"status");
           logger.info('index status code = ' + specialstatus );
           switch (specialstatus) {
             case '-4' :
               throw "Index data fail due to database name error!";
             case '-1' :
               ret = -1;
               break;
             case '-37': 
               ret = -37;
               logger.error(' index failed on index id = ' + indexID );
               break;
             case '-10': 
               ret = 2;
               reason = ' indexing return code = -10, the index action was interrupted.';
               logger.error(' indexing return code = -10, the index action was interrupted.' );
               break;
             case '-34' : 
               ret = 1;
               reason =  'the document is pending commit.' ;
               logger.info( 'the document is pending commit.' );
               break;
             case '-9' :
               ret = 2;
               logger.error(' IDOL host out of memory. ');
               break;
             case '-7' :
               ret = 1;
               reason =  'document is in queue, waiting for processing.';
               logger.info('document is in queue, waiting for processing.');
               break;
             case '-2' :
               ret = 2;
               reason = ' not space left on IDOL host. ';
               logger.error(' not space left on IDOL host. ');
               break;
             case '-28' :
               ret = 2; 
               reason = ' The index ID is not valid, ' + indexID ;
               logger.error(' The index ID is not valid, ' + indexID );
               break;
             case '-25': 
               ret = 1;
               reason = 'IDOL DIH is busy, document is to be sent to IDOL server. Wait for retry till finished. ';
               logger.error( 'IDOL DIH is busy, document is to be sent to IDOL server. Wait for retry till finished. ');
               break;
             default: 
               ret = 2;
           }
           rc['rc'] = ret;
           rc['reason'] = reason;
           return rc; 
       }
       item = item.getNextSiblingElement();
     }
    }     
   } catch (ex) {
    logger.info(ex.toString() + " Stack: " + ex.stack);
    print(ex.toString() + " Stack: " + ex.stack);
   }

   rc['rc'] = ret;
   rc['reason'] = reason;
   return rc;
  }
  
  ///---------------------------------------------------------------------  
  function IDOLStopPhraseClientInContainer() {}
  IDOLStopPhraseClientInContainer.prototype = new IDOLStopPhraseClientInternal();
  
  IDOLStopPhraseClientInContainer.prototype.getEndPoint = function() {
    return IDOLConfigure.getConfigurationMsvcEndPoint();
  };
  
  IDOLStopPhraseClientInContainer.prototype.getStopPhraseList = function() {
    try{
      var endpoint = this.getEndPoint() + "itom-sma-smarta-configuration/api/classic/retrieveHotTopicAnalysisStopPhrases/v1";
      return lib.JSON.json().parse(this.doGet(endpoint));
    } catch (ex) {
      print(system.functions.scmsg("stopphrase.error.getstopphraseslist","idolfarm"));
      logger.info("getStopPhraseList meet error:" + sStopPhrase + " exception:" + ex.toString() + " Stack: " + ex.stack);
    }
    return null;
  };
  
  IDOLStopPhraseClientInContainer.prototype.addStopPhraseList = function( requestBody ) {
   try{
     if(requestBody){
       var endpoint = this.getEndPoint() + "itom-sma-smarta-configuration/api/classic/addHotTopicAnalysisStopPhrases/v1";  
       this.doPost(endpoint, lib.JSON2.toJSON(requestBody));
       return true;
     }
   } catch (ex) {
     print(system.functions.scmsg("stopphrase.error.addstopphraseslist","idolfarm"));
     logger.info("add stopPhrase meet error:" + sStopPhrase + " exception:" + ex.toString() + " Stack: " + ex.stack);
   }
   return false
  }; 
  
  IDOLStopPhraseClientInContainer.prototype.removeStopPhraseList = function( requestBody ) {
   try{
     if(requestBody){
       var endpoint = this.getEndPoint() + "itom-sma-smarta-configuration/api/classic/removeHotTopicAnalysisStopPhrases/v1";   
       this.doPost(endpoint, lib.JSON2.toJSON(requestBody));
       return true;
     }
   } catch (ex) {
     print(system.functions.scmsg("stopphrase.error.removestopphraseslist","idolfarm"));
     logger.info("remove stopPhrase meet error:" + sStopPhrase + " exception:" + ex.toString() + " Stack: " + ex.stack);
   }
 
   return false;
  };
  ///---------------------------------------------------------------------
    
  function createInstance() {   
     if(IDOLConfigure.isInContainer()){
        return new IDOLStopPhraseClientInContainer();
     }else{                                                 
       return new IDOLStopPhraseClient();
     }
  }
  
  function createMemoizedInstance( ) {        
    return _.memoize(createInstance, function() {
      return IDOLConfigure.getEndPoint();
    });
  }

  var instance = {
    //create : createMemoizedInstance(),
    create : createInstance,
    invalidCache : function() {
      instance.create = createMemoizedInstance();
    }
  };

  return instance;
}());


function require() {
  return IDOLStopPhraseClientFactory;
}