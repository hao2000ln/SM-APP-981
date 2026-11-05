var _ = lib.Underscore.require(),
    KMSearch_Mobile = lib.KMSearch_Mobile,
    IDOLKMQueryDefault = lib.IDOLKMQueryDefault.require(),
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require(),
    logger = getLog('IDOLKMQueryMobile');

var IDOLKMQueryMobile = (function() {

  function KMQueryMobile(fKMQuery) {
    IDOLKMQueryDefault.apply(this, arguments);
    this.fKMQuery.doccount = 20;
  }

  function F() {}
  F.prototype = IDOLKMQueryDefault.prototype;

  KMQueryMobile.prototype = new F();

  KMQueryMobile.prototype.constructor = KMQueryMobile;
  
  KMQueryMobile.prototype.getResponseFormatter = function() {
    var hitlist = this.fKMQuery.hitlist;
    var innerKMQuery = this.fKMQuery
    return function(doc) {
      var docList = lib.IDOLKMSearchXMLConverter.require().convert(doc);
      docList = lib.IDOLKMSearchResult_Mobile.getHitList(docList, innerKMQuery);
      return KMSearch_Mobile.buildSearchResult(docList, hitlist);
    };
  };
  
  KMQueryMobile.prototype.getSelectedLibraries = function() {
    var kmlibs = this.getAvailableLibraries(funcs.operator());
    var selectedLibs = _.filter(kmlibs, function(kmlib) {
      return IDOLGlobalSearchLibrary.isKMDocument(kmlib) || 
              kmlib.kbtype ==='splib' || 
              kmlib.kbtype ==='weblib';
    });
    this.getSelectedLibraries = function() { return selectedLibs; };
    logger.info('mobile selectable libraries:' + selectedLibs);
    return selectedLibs;
  };

  return KMQueryMobile;
}());

function require() {
  return IDOLKMQueryMobile;
}