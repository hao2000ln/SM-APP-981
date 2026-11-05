var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('LiveActions');

function initial() {
  var IDOLGlobalSearchInitializer = lib.IDOLGlobalSearchInitializer.require();
  return IDOLGlobalSearchInitializer.initialize();
}

// getQuery = 'GET' + 'Query'
// GET => HTTP GET
function getQuery(qs) {
  try {
    var IDOLGlobalSearchFacade = lib.IDOLGlobalSearchFacade.require();

    var params = _.pick(qs, 'query', 'limit', 'mode', 'from', 'start', 'force');
    var criteria = qs.criteria;
    if (criteria) {
      criteria = JSON.parse(criteria);
    }
    return IDOLGlobalSearchFacade.search(qs, criteria || {});
  } catch(e) {
    logger.error(e);
    logger.error(e.stack);
    e.errorCode = 'GS-0001';
    throw e;
  }
}

// Smart Search, advanced filter, dropdown list values
function getTags(qs) {
  try {
    var IDOLGlobalSearchAutoCompletionFilter = lib.IDOLGlobalSearchAutoCompletionFilter.require();

    var params = _.pick(qs, 'query', 'prefix', 'start', 'limit');
    var criteria = qs.criteria;
    if (criteria) {
      criteria = JSON.parse(criteria);
    }
    return IDOLGlobalSearchAutoCompletionFilter.query(params, criteria);
  } catch(e) {
    logger.error(e);
    logger.error(e.stack);
    e.errorCode = 'GS-1001';
    throw e;
  }
}


// XXX: the passed in query string object has flag to distinguish whether this 
// library list request is for Smart Search or Context Aware search
  
// qs.from === 'quick'  => context aware search
// qs.from === 'main'   => smart search
function getLibraries(qs) {
  try {
    var IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require();
    var data = IDOLGlobalSearchLibrary.getLibraryWithSelection();
    return { data : data };
  } catch(e) {
    logger.error(e);
    logger.error(e.stack);
    e.errorCode = 'GS-2001';
    throw e;
  }
}

function getPreview(qs) {
  try {
    var IDOLGlobalSearchPreview = lib.IDOLGlobalSearchPreview.require();
    var params = _.pick(qs, 'filename', 'query', 'id', 'database', 'reference', 'summary');
    return IDOLGlobalSearchPreview.getPreview(params);
  } catch(e) {
    logger.error(e);
    logger.error(e.stack);
    e.errorCode = 'GS-3001';
    throw e;
  }
}

// record counting is a time consuming task
// if count use too much time, user can disable counting and use this API to perform
// a record counting later
//
// The option can be fount at
// idol -> Smart Search -> More -> Tailoring -> Display number of records ...
function getCount(qs) {
  try {
    var IDOLGlobalSearchFacade = lib.IDOLGlobalSearchFacade.require();

    var params = _.pick(qs, 'query', 'mode');
    params.from = 'count';
    
    var criteria = qs.criteria;
    if (criteria) {
      criteria = JSON.parse(criteria);
    }

    return IDOLGlobalSearchFacade.search(params, criteria || {});
  } catch (e) {
    logger.error(e);
    logger.error(e.stack);
    e.errorCode = 'GS-4001';
    throw e;
  }
}