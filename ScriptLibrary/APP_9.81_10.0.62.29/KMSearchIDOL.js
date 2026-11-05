/**  @fileoverview KMSearchIDOL
 *   @author Yanng,Chun-Fu
 */
var _ = lib.Underscore.require(),
    IDOLServiceQuery = lib.IDOLServiceQuery.require(),
    XQuery = lib.XQuery.require();

var KMSearchIDOL =( function() {

  function getIDOLDocIDBySEDOCID(indexName, sedocid) {
    var searchParam={
      "DatabaseMatch":indexName,
      "FieldText":"MATCH{" + sedocid + "}:SEDOCID"
    };
    var doc = IDOLServiceQuery.doQuery(searchParam);
    var hits = XQuery.query('responsedata/autn:hit', doc);
    return _.map(hits, function(hit) {
      return XQuery.queryText('autn:id', hit);
    });
  }

  function deleteDocument(indexName, sedocid) {
    var ids = getIDOLDocIDBySEDOCID(indexName, sedocid);
    if (ids && ids.length > 0) {
      var strIds = ids.join('+');
      return IDOLServiceQuery.doDelete({ Docs: strIds });
    }
    return 0;
  }


  return {
    deleteDocument          : deleteDocument
  }
}());

function require() {
  return KMSearchIDOL;
}