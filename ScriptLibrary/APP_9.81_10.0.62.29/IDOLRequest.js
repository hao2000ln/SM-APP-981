/**
 * This script is used for sm-idol integration communication
 * 
 * it will send http request to idol server
 * when response status is not 'SUCCESS', it will treat it as a error response,
 * write log and throw exceptions
 * 
 * recommend to use doPost, because idol get and post are doing the same thing
 * and post doesn't have size limitation
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    scmsg = system.functions.scmsg;

var logger = getLog('IDOLRequest');

var ChannelFactory = (function() {
  function createChannel() {
    var Config = lib.IDOLConfigure.require();
    var type = Config.getAPIChannel();
    return type === 'oem' ?
      lib.IDOLOEMAPIChannel.require():
      lib.IDOLHTTPChannel.require();
  }
  return {
    create : createChannel
  };
})();

var IDOLRequest = (function() {
  
  function doRequest(method, endpoint, params) {
    try {
      var channel = ChannelFactory.create();      
      var handler = channel[method],
          response = handler(endpoint, params);
     
      return handleResponse(response);
        
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
  
  function doOCRPost(endpoint, params){
    //This function dont convert idol response.
    endpoint = lib.IDOL_Utilities.getCommonEndpoint(endpoint);
     try {
      var channel = ChannelFactory.create();      
      var handler = channel['doPost'];
      return handler(endpoint, params);
    } catch (e) {
      logger.error("Do idol request error:"+e);
      throw e;
    }
  }

  function doGet(endpoint, params) {
  	endpoint = lib.IDOL_Utilities.getCommonEndpoint(endpoint);
    return doRequest('doGet', endpoint, params);
  }
  
  function doJsonPost(endpoint, params)
  {
    endpoint = lib.IDOL_Utilities.getCommonEndpoint(endpoint);
     try {
      var channel = ChannelFactory.create();      
      var handler = channel['doPost'];
      return {json:handler(endpoint, params)};
     
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
  
  function doPost(endpoint, params) {
  	endpoint = lib.IDOL_Utilities.getCommonEndpoint(endpoint);
    return doRequest('doPost', endpoint, params);
  }

  /*
   * The IDOL response message format is like: 
   * 
   * <autnresponse xmlns:autn="http://schemas.autonomy.com/aci/">
   * <action>XXXXX</action>
   * <response>XXXXX</response>
   * <responsedata>
   *  ......
   * </responsedata>
   * </autnresponse>
   */
  function handleResponse(response) {
    var doc = new XML();
    doc.setContent(response);
    
    var status = XQuery.queryText('response', doc);
    if (status === 'ERROR') {
      logger.error(response);
      var obj = XQuery.queryOne('responsedata/error', doc),
          errorstring = XQuery.queryText('errorstring', obj),
          errordescription = XQuery.queryText('errordescription', obj);
      var msg = [errorstring, errordescription].join('\n');
      var error = new Error(msg);
      error.xml = doc;
      throw error;      
    } else if (status !== 'SUCCESS') {
      logger.error(response);
      // scmsg: Invalid status: "%S". Please refer log for details
      var failure = new Error(scmsg(1003, 'idol', [status]));
      failure.xml = doc;
      throw failure;
    }
    return doc;
  }

  
  // In fact, in IDOL get and post are doing the same thing.
  return {
    doIDOLGet : doGet,
    doIDOLPost : doPost,
    doIDOLOCRPost : doOCRPost,
    doIDOLJsonPost : doJsonPost
  };
})();

function require() {
  return IDOLRequest;
}
