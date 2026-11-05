var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require(),
    IDOLErrorCode = lib.IDOLErrorCode.require(),
    IDOLGlobalSearchXMLConverter = lib.IDOLGlobalSearchXMLConverter.require();
var reloadQuery = lib.AddQuotation.reloadQuery;

var IDOLGlobalSearchMyCollection = (function() {

  function searchMyCollection(qs) {
    var options = {};
    var keyword = reloadQuery(qs.query) || '',
        start = parseInt(qs.start, 10) || 1,
        limit = parseInt(qs.limit, 10) || 10;

    var fKMQuery = new SCFile('kmquery');
    options = options || {};
    options = _.extend(options, {
      "Start": start,
      "MaxResults": start + limit - 1,
      "MaxPrintChars": 200
    });
    fKMQuery.query = keyword || "*";

    var IDOLKMQuery = IDOLKMQueryFactory.create('mycollection', fKMQuery);
    try {
      return IDOLKMQuery.search(options);
    } catch (e) {
      // ignore empty query, or 'all stop words' query
      // TODO: should return corresponding HTTP response code, like 404
      if (e.id === IDOLErrorCode.INVALID_QUERY_TEXT) {
        return { data : [], total : 0, messages : [e.message] };
      }
      throw e;
    }
  }

  return {
    search : searchMyCollection
  };
}());

function require() {
  return IDOLGlobalSearchMyCollection;
}