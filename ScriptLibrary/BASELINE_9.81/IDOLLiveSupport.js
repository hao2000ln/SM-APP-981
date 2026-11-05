var _ = lib.Underscore.require(),
    IDOLRequest = lib.IDOLRequest.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    JSON = lib.JSON.json(),
    XQuery = lib.XQuery.require();

var logger = getLog('IDOLLiveSupport');

var IDOLLiveSupport = (function() {
  function buildResults(doc) {
    var collection = XQuery.query('responsedata/autn:hit', doc);
    var data = _.map(collection, function(hit) {
      return {
        "reference" : XQuery.queryText('autn:reference', hit),
        "title": XQuery.queryText('autn:title', hit),
        "content": XQuery.queryText('autn:content/DOCUMENT/DRECONTENT', hit),
        "database": XQuery.queryText('autn:database', hit)
      }
    });
    var total = XQuery.queryText('responsedata/autn:totalhits', doc);
    return {
      total : parseInt(total),
      data: data
    }
  }

  function suggestInteractions(snapshot) {
    var description = snapshot.description;
    var endpoint = IDOLConfigure.getEndPoint();
    var doc = IDOLRequest.doIDOLGet(endpoint, {
      action: 'SuggestOnText',
      databasematch: 'incidents',
      text: description
    });
    return buildResults(doc);
  }

  function suggestIncidents(snapshot) {
    var description = snapshot.description;
    var endpoint = IDOLConfigure.getEndPoint();
    var doc = IDOLRequest.doIDOLGet(endpoint, {
      action: 'SuggestOnText',
      databasematch: 'probsummary',
      text: description
    });
    return buildResults(doc);
  }

  return {
    suggestInteractions: suggestInteractions,
    suggestIncidents: suggestIncidents
  }
})();


function require() {
  return IDOLLiveSupport;
}