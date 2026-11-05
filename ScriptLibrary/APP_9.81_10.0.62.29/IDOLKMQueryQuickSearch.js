var _ = lib.Underscore.require(),
    IDOLKMQuery = lib.IDOLKMQuery.require(),
    IDOLGlobalSearchXMLConverter = lib.IDOLGlobalSearchXMLConverter.require();

var IDOLKMQueryQuickSearch = (function() {

  function KMQueryQuickSearch(fKMQuery) {
    IDOLKMQuery.apply(this, arguments);
    this.fKMQuery.doccount = 10;
    this.searchType='quicksearch';
  }

  function F() {}
  F.prototype = IDOLKMQuery.prototype;

  KMQueryQuickSearch.prototype = new F();

  KMQueryQuickSearch.prototype.constructor = KMQueryQuickSearch;

  KMQueryQuickSearch.prototype.getSelectedLibraries = function() {
    var names = this.criteria['__library__'] || [];
    var kmlibs = this.getAvailableLibraries(funcs.operator());
    var selectedLibs = _.filter(kmlibs, function(kmlib) {
      return _.indexOf(names, kmlib.kbname) !== -1;
    });
    this.getSelectedLibraries = function() { return selectedLibs; };
    return selectedLibs;
  };

  KMQueryQuickSearch.prototype.getResponseFormatter = function() {
    return IDOLGlobalSearchXMLConverter.convert;
  };

  return KMQueryQuickSearch;
}());

function require() {
  return IDOLKMQueryQuickSearch;
}