var _ = lib.Underscore.require(),
    IDOLKMSearchResultHTMLFormatter = lib.IDOLKMSearchResultHTMLFormatter.require();

var IDOLKMQueryResultConsumer = (function() {

  function consumeEmptyResults(idolkmquery) {
    var html = generateEmptyHTML(idolkmquery);
    var page = generateEmptyPagination(idolkmquery);
    print(funcs.scmsg(257, "km"));
    return {
      html : html,
      page : page
    };
  }

  function generateEmptyHTML(idolkmquery) {
    var fKMQuery = idolkmquery.fKMQuery;
    var strStyle = vars.$G_km_globalenv.kmhitliststyle;
    return strStyle + "<DIV></DIV>";
  }

  function generateEmptyPagination() {
    return {
      currentPage : 0,
      lastPage : 0,
      total : 0
    };
  }

  function consumeSearchResults(response, idolkmquery) {
    var html = generateHTMLPage(response, idolkmquery);
    var pagination = generatePaginationInfo(response, idolkmquery);

    return {
      html : html,
      page : pagination
    };
  }

  function generateHTMLPage(response, idolkmquery) {
    var fKMQuery = idolkmquery.fKMQuery;
    var num = response.num, 
        total = response.total,
        data = response.data;

    data.unshift(num, total);
    var hitlist = fKMQuery.hitlist;
    return IDOLKMSearchResultHTMLFormatter.getHTMLHitList(data, fKMQuery.hitlist);
  }

  function generatePaginationInfo(response, idolkmquery) {
    var fKMQuery = idolkmquery.fKMQuery;
    var pageSize = fKMQuery.doccount,
        start = fKMQuery.docstart || 0,
        maxdocs = fKMQuery.maxdocs,
        total = response.total;

    // For 'Service Catalog' scenario, not all record returned from search engine
    // can be viewed by user, so search 'maxdocs' records then filter out invalid
    // 'Service Catalog' before result returned.

    //setup the paging variables
    var currentPage = total == 0 ? 0 : (Math.floor(start / pageSize) + 1);
    var remainder = (funcs.min(total, maxdocs) % pageSize) > 0 ? 1 : 0;
    var lastPage = Math.floor(funcs.min(total, maxdocs) / pageSize) + remainder;

    return {
      currentPage : currentPage,
      lastPage : lastPage,
      total : total
    };
  }

  function consume(idolkmquery, response) {
    if (idolkmquery.hasLibrarySelected()) {
      return consumeSearchResults(response, idolkmquery);
    } else {
      return consumeEmptyResults(idolkmquery);
    }
  }

  return {
    consume : consume
  };
}());

function require() {
  return IDOLKMQueryResultConsumer;
}