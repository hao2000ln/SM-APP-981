var _ = lib.Underscore.require(),
  $ = lib.c.$,
  IDOLTopicMap = lib.IDOLProblemHunter.require(),
  IDOLHTMLBuilder = lib.IDOLHTMLBuilder.require(),
  IDOLQueryBuilder = lib.IDOLQueryBuilder.require(),
  IDOLModuleConfiguration = lib.IDOLModuleConfiguration.require(),
  IDOLCommon = lib.IDOLCommon.require(),
  XQuery = lib.XQuery.require(),
  JSON = lib.JSON.json();

var logger = getLog('IDOLHTALauncher');

var IDOLHTALauncher = (function() {

  function doSearchHotTopic(keyword, range, criteria, customQuery, language, hintMinScore) {
    var filename = funcs.filename(criteria),
      fallback = IDOLQueryBuilder.createFallbackHandler();

    var response = IDOLTopicMap.query(keyword, criteria, range, customQuery, fallback.handler, hintMinScore, language);
     // warnings = XQuery.query('responsedata/autn:warning', response);
    //logger.info("search result:"+JSON.stringify(response));
    /*
    var warnings="";
    _.chain(warnings).map(function(node) {
      return node.getValue();
    }).compact().sort().uniq().each(function(message) {
      // QCCR1E113358 Hidden warning message from idol
      // funcs.msg(message, 2);
      logger.warn(message);
    });

    var json = IDOLTopicMap.buildResult(response, filename, fallback.hasError());
    json.topic = keyword;
    */
    return response;
  }

  function searchHotTopic2Json(keyword, range, criteria, customQuery) {
    var json = doSearchHotTopic(keyword, range, criteria, customQuery);
    if ( json && json.subtopics && json.subtopics.length <= 0 )
    {
      json = doSearchHotTopic(keyword, range, criteria, customQuery, 0);
    }

    if (json.subtopics.length > 0) {
      var filename = funcs.filename(criteria);
      var config = IDOLModuleConfiguration.get(filename);
      var actions = _.result(config, 'actions');

      json.actions = actions;
    } else {
      json = null;
    }

    return json;
  }

  function searchHotTopic(keyword, range, criteria, customQuery, language) {
    var json = doSearchHotTopic(keyword, range, criteria, customQuery, language);
    if ( json && json.subtopics && json.subtopics.length <= 0 )
    {
      json = doSearchHotTopic(keyword, range, criteria, customQuery,language, 0);
    }

    return (json.subtopics.length > 0) ? JSON.stringify(json) : '';
  }

  function generateHotTopic(filename, data, state) {
    if (data) {
      var config = IDOLModuleConfiguration.get(filename),
        actions = _.result(config, 'actions');
      return IDOLHTMLBuilder.applyTemplate({
        TOPICMAP_DATA : data,
        SAVE_STATE : state || null
      }, actions);
    } else {
      return "<h1>" + funcs.scmsg(1010, 'idol') + "</h1>";
    }
  }

  function buildSelectedQuery(filename, ids) {
    if (!_.isArray(ids)) { ids = [ids]; }
    var names = IDOLCommon.getReferenceFields(filename);
    if (names.length > 1) {
      throw new Error(filename + " unique key has more than one field, currently not supported");
    }
    return [names[0], "isin", "{" + _.map(ids, function(id) { return "\"" + id + "\""; }).join(",") + "}"].join(" ");
  }

  function getTicketsHandler(event, docs, selector, topic, group) {
    var filename = funcs.filename(vars["$L.file"]),
      query = buildSelectedQuery(filename, docs),
      process;

    switch (event) {
      case 'single':
        process = "idol.hot.topic.view"; break;
      case 'multiple':
        var config = IDOLModuleConfiguration.get(filename),
          actions = _.result(config, 'actions');

        var action = _.find(actions, function(action) { return action.id === selector; });
        if (!action) {
          throw new Error("cannot find handler for \"" + selector + "\". (filename: " + filename + ")");
        }
        process = _.result(action, 'process');
        break;
      default:
        throw new Error("cannot recognize event type: " + event);
    }

    var params = { filename : filename,  query : query, topic : topic, group : group };

    return {
      process : process,
      params : params
    };
  }

  return {
    searchHotTopic : searchHotTopic,
    searchHotTopic2Json : searchHotTopic2Json,
    generateHotTopic : generateHotTopic,
    getTicketsHandler : getTicketsHandler
  };
}());

function require() {
  return IDOLHTALauncher;
}