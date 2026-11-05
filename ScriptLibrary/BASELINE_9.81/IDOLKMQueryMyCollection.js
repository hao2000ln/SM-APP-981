var _ = lib.Underscore.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    IDOLKMQueryQuickSearch = lib.IDOLKMQueryQuickSearch.require();

var IDOLKMQueryMyCollection = (function() {
  function KMQueryMyCollection(fKMQuery) {
    IDOLKMQueryQuickSearch.apply(this, arguments);
    this.searchType="mycollection";
  }

  function F() {}
  F.prototype = IDOLKMQueryQuickSearch.prototype;

  KMQueryMyCollection.prototype = new F();

  KMQueryMyCollection.prototype.constructor = KMQueryMyCollection;

  // Only pick 'Knowledge Library' as my collection
  KMQueryMyCollection.prototype.getSelectedLibraries = function() {
    var libraries = this.getAvailableLibraries();
    var selectedLibs = _.filter(libraries, function(kmlib) {
      return kmlib.kbtype === 'sclib' && kmlib.sclibtablename === 'kmdocument';
    });
    this.getSelectedLibraries = function() { return selectedLibs; };
    return selectedLibs;
  };

  KMQueryMyCollection.prototype._generateKMQuerySQL = function() {
    var name = funcs.operator();
    var inboxCriteria = lib.inboxFilter.getFilterQuery(name);
    var sql = '(inbox.type="kmdocument" and inbox.class="classRecord") ' + inboxCriteria;

    var inbox = new SCFile('inbox', SCFILE_READONLY);
    inbox.setFields(['normalized.query']);

    var rc = inbox.doSelect(sql), filters = [];
    while (rc === RC_SUCCESS) {
      filters.push(inbox['normalized.query']);
      rc = inbox.getNext();
    }
    return IDOLCommon.compositeCriteria(filters, ' OR ');
  };

  // TODO: may cache the generated query string
  // since my collection doesn't change freqently
  KMQueryMyCollection.prototype.perLibAdHocCriteria = function(kmlib) {
    if (kmlib.kbtype === 'sclib' && kmlib.sclibtablename === 'kmdocument') {
      var fieldMappingStrategy = function(fieldname) {
        return IDOLKMFieldMapping.mappingIDOLField(fieldname, kmlib.kbname);
      };
      var sql = this._generateKMQuerySQL() || false;
      var ast = parseQuery(sql);
      return IDOLQueryEvaluator.convertToIDOLQuery(ast, null, fieldMappingStrategy);
    }
  };

  return KMQueryMyCollection;
}());

function require() {
  return IDOLKMQueryMyCollection;
}