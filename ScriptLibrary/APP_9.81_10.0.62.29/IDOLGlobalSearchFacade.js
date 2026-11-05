var _ = lib.Underscore.require(),
    IDOLGlobalSearch = lib.IDOLGlobalSearch.require(),
    IDOLGlobalSearchMyCollection = lib.IDOLGlobalSearchMyCollection.require();

var logger = getLog('IDOLGlobalSearchFacade');

var IDOLGlobalSearchFacade = (function() {

  var SEARCH_DISPATCHER = {
    GLOBAL_SEARCH: IDOLGlobalSearch.search,
    MY_COLLECTION: IDOLGlobalSearchMyCollection.search
  };

  function search(qs) {
    var mode = qs.mode || 'GLOBAL_SEARCH';
    var handler = SEARCH_DISPATCHER[mode];
    if (!handler) {
      logger.warn('Cannot find search mode : "' + mode + '", use default one');
      handler = IDOLGlobalSearch.search;
    }
    return handler.apply(null, arguments);
  }

  return {
    search : search
  };

}());

function require() {
  return IDOLGlobalSearchFacade;
}