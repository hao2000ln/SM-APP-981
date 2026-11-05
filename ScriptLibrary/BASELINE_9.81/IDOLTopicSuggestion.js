var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLQueryBuilder = lib.IDOLQueryBuilder.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLModuleConfiguration = lib.IDOLModuleConfiguration;

var IDOLTopicSuggestion = (function() {

  function convertToJSONResult(doc) {
    var collection = XQuery.query('responsedata/autn:hit', doc);
    return _.map(collection, function(hit) {
      var title = XQuery.queryText('autn:title', hit),
          reference = XQuery.queryText('autn:reference', hit);

      return { reference : reference, title : title };
    });
  }

  function suggestParentIncident(topic) {
    var sql = IDOLModuleConfiguration.getParentIncidentSearchQuery();
    
    var filename = 'probsummary',
        client = IDOLClientFactory.create('HotTopic'),
        config = IDOLConfigure.getTopicmapConfig(filename);

    var params = IDOLQueryBuilder.buildCriteriaViaSQL(filename, sql, topic);
    var doc = client.executeAction(_.extend(params, {
      action : 'SuggestOnText',
      outputencoding : 'utf8',
      maxresults : 3,
      print : 'none'
    }));
    return convertToJSONResult(doc);
  }

  return {
    suggestParentIncident : suggestParentIncident
  };
}());

function require() {
  return IDOLTopicSuggestion;
}