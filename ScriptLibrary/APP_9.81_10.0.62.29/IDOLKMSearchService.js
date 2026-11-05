/**  
 *   provide KM Interfaces on global search content. 
 *   @author Yang,Chun-Fu
 */
 
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLRequest =lib.IDOLRequest.require();
    IDOLClientFactory = lib.IDOLClientFactory.require();
var logger = getLog('IDOLKMSearchService');
var setting = {action: 'query'};

var KMSearchService =( function() {
  
  function getDocRefByDocID(indexName, sedocid) {
  print('getDocRef'+indexName+' --'+sedocid);
    var searchParam={
      "DatabaseMatch": indexName,
       "text"        : '*',
       "action": 'query',
      "Combine"      : "simple+drereference",
      "anylanguage": 'true',
      "FieldText"    : "MATCH{" + sedocid + "}:SEDOCID",
      "PrintFields":"SEDOCID"
    };
    var doc = doQuery(searchParam);
    var hits = XQuery.query('responsedata/autn:hit', doc);
    return _.map(hits, function(hit) {
      return encodeURIComponent(XQuery.queryText('autn:reference', hit));
    });
  }
  
  function doQuery(params) {
      var client = IDOLClientFactory.create('GlobalSearch');
      var queryParams = _.extend(params, setting);
      return client.executeAction(queryParams);
      
      //var idolUrl = lib.IDOLConfigure.require().getConfig()['server.url'];
      //var queryParams = _.extend(params, setting);
      //return IDOLRequest.doIDOLPost(idolUrl, params);
  }


  return {
    getDocRefByDocID: getDocRefByDocID,
    doQuery:doQuery
  }
}());

function require() {
  return KMSearchService;
}