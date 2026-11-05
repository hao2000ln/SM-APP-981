/*
 *	Smart Analytics Services for Query/Search functions
 *
 *	author He, Peng-Fei
 *
 *	var IDOLServiceQuery = lib.IDOLServiceQuery.require();
 *	var result = IDOLServiceQuery.doQuery({outputencoding: 'utf8'});
 */

var _ = lib.Underscore.require(),
        IDOLHTTPChannel = lib.IDOLHTTPChannel.require(),
        IDOLRequest =lib.IDOLRequest.require(),
        IDOLDistributeManagement = lib.IDOLDistributeManagement.require(),
        idolUrl = lib.IDOLConfigure.require().getConfig()['server.url'];

var logger = getLog('IDOLServiceQuery');

var IDOLServiceQuery = function() {

    var setting = {action: 'query'};

    /**
     *   Call idol query function with additional parameters
     *	The paramters are passed as js object. Input other params exception action=query. e.g. {outputencoding: 'utf8', maxresults : 300}
     *
     *   @param {params} - additonal parameters except action=query to do query in idol.
     *	@param {language} - Language code
     *	@return - The query result from idol
     *   @type - String
     **/
    function doQuery(params) {
    	
        var queryParams = _.extend(params, setting);

        logger.trace('start lib.IDOLRequest.require().doIDOLPost with params:' + lib.JSON.json().stringify(params));
        
        var IDOLConfigureObj = lib.IDOLConfigure.require();
        
		if(IDOLConfigureObj.isInContainer()){
			idolUrl = IDOLConfigureObj.getSearchMsvcEndPoint();
		}
        var result = IDOLRequest.doIDOLPost(idolUrl, params);

        logger.trace('finish call lib.IDOLRequest.require().doIDOLPost() with result: ' + result);

        return result
    }
    
    function createIndex(indexName){
    	
        var strurl = lib.jsaci.getIDOLServerIndexUrl()+"DRECREATEDBASE?DREDbName="+indexName+"&Internal=false&ReadOnly=false";
    	var result = lib.jsaci.sendRequestToIDOL(strurl, "");
    	if(result == null)
    	{
        	lib.jsaci.myPrint("get result timeout for createIndex");
        	return -1;
    	}
    	
    	
    	return 0;
    }
    

    function deleteIndex(indexName){
    	
        var idolUrl = lib.IDOLConfigure.require().getIDOLIndexBaseURL()+'DREDELDBASE';
        var result =  IDOLHTTPChannel.doGet(idolUrl,{
            DREDbName:indexName
        });

        return  _.trim(result.split('=')[1]) >0 ? 0 : -1;
    }
    
    /**
    *	delete index indexed data
    **/
    function doDelete(params) {
    	var portPos = idolUrl.lastIndexOf(':');
		var port = idolUrl.substring(portPos + 1, idolUrl.length - 1);
		var contenturl = idolUrl.substring(0, portPos + 1) + lib.jsaci.getServerIndexPort();
		
    	if(IDOLConfigureObj.isInContainer()){
			contenturl = IDOLConfigureObj.getIndexMsvcEndPoint();
		}
		contenturl += '/DREDELETEREF?';
		
		var idx = 0
		for (var obj in params) {
		   if(idx == 0){
		     contenturl += obj + '=' + params[obj];
		   }else{
			contenturl += '&' + obj + '=' + params[obj];
		   }
		   
		   idx++;
		}
		try {
			var result = lib.jsaci.runIDOLAction(contenturl, false);
			return 0;
		} catch (e) {
		    logger.error(e.message);
		    logger.error(e.stack);
			return -1;
		}
	}
	
	/**
    *	index strdata to a specified database
    **/
	function indexDocument(database, strdata) {
		
		var result = lib.jsaci.IndexDataToIdol(database, strdata);
    	return 0;
    }
    
    function flushIndexData()
    {
       var strurl =lib.jsaci.getIDOLServerIndexUrl()+"DRESYNC?";
  
       var result =  lib.jsaci.sendRequestToIDOL(strurl,"");
      if(result == null)
      {
          myPrint("get result timeout for flushIndexData");
          // system.functions.sleep(3);
      }
      return result;
    }
    
    function createGLSIndex( indexDbName )
    {
		
       var glsURL = glsIndexUrl+"DRECREATEDBASE?DREDbName="+indexDbName+"&Internal=false&ReadOnly=false",
           result = lib.jsaci.sendRequestToIDOL(glsURL, "");
       
       if(result == null)
       {
          logger.error("get result timeout for createIndexDb");
          return -1;
       }
    
       if ( !IDOLDistributeManagement.isVDBExist( indexDbName )){
    	   IDOLDistributeManagement.addVDB( indexDbName );
    	}
    	
    	return 0;
    }
    

    return {
        doQuery: doQuery,
        createIndex:createIndex,
        deleteIndex:deleteIndex,
        doDelete: doDelete,
        indexDocument: indexDocument,
        flushIndexData:flushIndexData,
        createGLSIndex:createGLSIndex
        
    }
}()

function require() {
	idolUrl = lib.IDOLConfigure.require().getConfig()['server.url'];
    return IDOLServiceQuery;
}