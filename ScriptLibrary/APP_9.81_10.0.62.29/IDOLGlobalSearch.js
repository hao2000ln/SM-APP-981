var _ = lib.Underscore.require(),
    IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(),
    IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require(),
    IDOLPreference = lib.IDOLPreference.require(),
    IDOLErrorCode = lib.IDOLErrorCode.require(),
    XQuery = lib.XQuery.require(),
    reloadQuery = lib.AddQuotation.reloadQuery;

var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;
var logger = getLog('IDOLGlobalSearch');

var IDOLGlobalSearch = (function() {

  var _last_selected_libraries;

  var CHARACTERS = {
    main : GlobalSearchSettings.MAIN_SEARCH_CHARACTERS,
    quick : GlobalSearchSettings.QUICK_SEARCH_CHARACTERS
  };

  function buildSearchOptions(qs) {
    var from = qs.from;
    var ignoreSpecials = GlobalSearchSettings.IGNORE_SPECIALS;
    var minScore = (GlobalSearchSettings.MINSCORE || GlobalSearchSettings.MINSCORE==0)?GlobalSearchSettings.MINSCORE:30;
    if (from === 'count') {
      // XXX: 'count' can only happened in "Smart Search" window
      return {
        "TotalResults" : true,
        "IgnoreSpecials" : ignoreSpecials,
        "MinScore" : minScore,
        "Print" : 'NoResults',
        "Predict" : false,
        "SpellCheck" : false,
        "Highlight" : "",
        "StartTag" : "",
        "EndTag" : "",
        "Summary" : "",
        "PrintFields" : ""
      };
    } else {
      var start = parseInt(qs.start, 10) || 1,
          limit = parseInt(qs.limit, 10) || GlobalSearchSettings.PAGE_SIZE,
          characters = CHARACTERS[from] || 200;
          //if ( from === "main") ignoreSpecials = false;
      return {
        "Start": start,
        // ignore speicial operator, like 'and', 'or', 'not' etc
        // and only enable those operator in "Smart Search (main)" window
        //"IgnoreSpecials" : !(from === 'main'),
        "IgnoreSpecials" : ignoreSpecials,
        "MinScore" : minScore,
        "MaxResults": start + limit - 1,
        "MaxPrintChars": GlobalSearchSettings.MAX_PRINT_CHARACTERS,
        "Characters" : characters
      };
    }
  }

  function searchSelectedLibrary(qs, criteria) {
    lib.IDOLKMHotnewsSearch.checkQuickSearchParameter(qs);
    var options = buildSearchOptions(qs);
    var fKMQuery = new SCFile('kmquery');
    fKMQuery.query = reloadQuery(qs.query) || "";
    var IDOLKMQuery = IDOLKMQueryFactory.create('quicksearch', fKMQuery, criteria);
    try {
      // print hit list when running in main search mode
      IDOLKMQuery.from = qs.from;
      // XXX: typeof qs.force === 'string'
      IDOLKMQuery.force = qs.force === 'true';
      // Search within results
      IDOLKMQuery.searchWithinResults = !!criteria['__history__'];

      var results = IDOLKMQuery.search(options);
      lib.IDOLKMHotnewsSearch.mergeHotnews(results, qs, criteria);
      if (qs.from === 'main') { // only save selected status for main search page
        var libraries = criteria['__library__'] || [];
        var strnames = libraries.sort().join(',');

        // Database writing is a time consuming process
        // dirty check to increase performance.
        if (_last_selected_libraries !== strnames) {
          logger.debug('save selected library "' + strnames + '"');
          IDOLPreference.saveLibraries(libraries);
          _last_selected_libraries = strnames;
        }  
      }
      return results;
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
    search: searchSelectedLibrary
  };
}());

function require() {
  return IDOLGlobalSearch;
}