var _ = lib.Underscore.require(),
    IDOLKMAdvancedQuery    = lib.IDOLKMAdvancedQuery.require(),
    KMIDOLLanguageMap = lib.KMIDOLLanguageMap.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLErrorCode = lib.IDOLErrorCode.require(),
    KMUtils = lib.KMUtils,
    KMQuery = lib.KMQuery;

var logger = getLog('IDOLKMNLProcessing');

var IDOLKMNLProcessing = (function() {

  function extractPhrases(query,queries)
  {
	var phrase;
	
	while (query.indexOf("\"") >= 0) {
		var newstripstr = "";
		phrase = "";
		var startquote = query.indexOf("\"");
		var closequote = query.indexOf("\"", startquote + 1);
		if (closequote < 0) {
			newstripstr = query.substring(0, startquote);
			newstripstr += query.substring(startquote + 1);
			query = newstripstr;
			break;
		}
		if (closequote > 0) {
			phrase += query.substring(startquote, closequote + 1);
			newstripstr = query.substring(0, startquote);
			newstripstr += query.substring(closequote + 1);
			queries.push(phrase);
			query = newstripstr;
		}
	}
	return query;
  }
  

  function appendRawQueryText(fKMQuery, queries) {
    var query = fKMQuery.query || "";
    query = _.trim(query);
    query = extractPhrases(query,queries);
    var langCode = getLangCode(fKMQuery);
    _.each(langCode, function(code){
       query = lib.KMQuery.stripStop(query, langCode);
       query= _.trim(query);
    });
    if(query){
       query=query.replace(/\([ |\t]*\)/g, "");
       if(query){
         query = query.replace(/:/g,' ');
         queries.push(query);
       }
    }
  }

  function appendAdvancedSearch(fKMQuery, queries) {
    if (vars.$G_advsearch) {
      var query = IDOLKMAdvancedQuery.advancedFilter(fKMQuery);
      if (query) {
        queries.push(query);
      }
    }
  }

  function appendSearchInResults(fKMQuery, queries) {
    if (fKMQuery.searchinresults) {
      try{
        var previousSubmit = JSON.parse(fKMQuery.submitstring);
        var query= previousSubmit.text;
        var langCode = getLangCode(fKMQuery);
        _.each(langCode, function(code){
           query = lib.KMQuery.stripStop(query, langCode);
           query= _.trim(query);
        });
        if(query){
            queries.push(query);
        }
      } catch(e) {
        logger.warn('cannot search in result because the previous query is not valid. (' + fKMQuery.submitstring);
        logger.warn(e);
      }
    }
  }

  function natrureLanguageProcess(fKMQuery) {
    var queries = [];
    appendRawQueryText(fKMQuery, queries);
    appendAdvancedSearch(fKMQuery, queries);
    appendSearchInResults(fKMQuery, queries);
    var query = IDOLCommon.compositeCriteria(queries);
    query = _.trim(query);
    if(!query){ 
      var error =  new Error(funcs.scmsg('2001', 'idol'));
      error.id = IDOLErrorCode.INVALID_QUERY_TEXT
      throw error;
    }
    return { Text : query };
  }

  function getLangCode(fKMQuery) {
    var langCode = fKMQuery.locale || KMUtils.getKMlangcode(vars.$G_my_language.slice(0, 2)) || 'en';
    langCode = langCode.split(',');
    
    langCode = _.map(langCode,function (code){
      // some language have more than 2 chars...
      if (code.length > 2) {
        code = code.slice(0, 2);
      }
      return code;
    });
    
    return langCode;
  }

  function buildLanguageParams(langCode) {
    var langFilter = { "AnyLanguage":true };

    if( vars.$G_advsearch ){
      var languageType =[];
      _.each(langCode, function ( code ){
        var idolCode = KMIDOLLanguageMap[code];
        if(idolCode){languageType.push(idolCode);}
      });
      
      if(languageType.length) {
        langFilter= { "MatchLanguageType" : languageType.join(',') };
      }
    }
    return langFilter;
  }

  function buildNaturalLanguageParams(fKMQuery) {
    var langCode = getLangCode(fKMQuery);

    var langParams = buildLanguageParams(langCode),
        textParams = natrureLanguageProcess(fKMQuery);

    return _.extend(langParams, textParams);
  }

  return {
    buildNaturalLanguageParams : buildNaturalLanguageParams
  }
})();

function require() {
  return IDOLKMNLProcessing;
}