var _ = lib.Underscore.require(),
    IDOLKMQuery = lib.IDOLKMQuery.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require(),
    IDOLKMSearchXMLConverter = lib.IDOLKMSearchXMLConverter.require(),
    IDOLKMQueryResultConsumer = lib.IDOLKMQueryResultConsumer.require();

var logger = getLog('IDOLKMQueryDefault');

var IDOLKMQueryDefault = (function() {

  function KMQueryDefaultBehavior(fKMQuery) {
    IDOLKMQuery.apply(this, arguments);
  }

  function F() {}

  F.prototype = IDOLKMQuery.prototype;

  KMQueryDefaultBehavior.prototype = new F();

  KMQueryDefaultBehavior.prototype.constructor = KMQueryDefaultBehavior;

  // This method will be override by child class
  // in 'quick search' mode, it will retrieve selected library from 'user preference'
  KMQueryDefaultBehavior.prototype.getSelectedLibraries = function() {
    // in fact, the 'kbname' in 'fKMQuery.kblist' is the display name 'kbdescription' in 'kmknowledgebase'
    // cannot use it to determine library selections

    /***************************************************************************
     * It's better to add additional field in kmquery dbdict, make it like
     *
     * kmquery
     *   kblist
     *     kbname
     *     kbcheckbox
     *     kbdisplayname
     *
     * at that moment, we don't need to manually add field when library was added
     * neither need to iterate all library to determine its selection status
     ****************************************************************************/ 
    var kmlibs = this.getAvailableLibraries(funcs.operator());
    var fKMQuery = this.fKMQuery;
    var selectedLibs = _.filter(kmlibs, function(kmlib) {
      var name = IDOLKMFieldMapping.normalizeLibraryName(kmlib.kbname);
      var selected = fKMQuery[name];
      if (_.isString(selected)) {
        return selected.toLowerCase() === 'true';
      }
      return !!selected;
    });

    this.getSelectedLibraries = function() { return selectedLibs; };
    return selectedLibs;
  };

  KMQueryDefaultBehavior.prototype.getResponseFormatter = function() {
    var self = this;
    return function(xml) {
      var json = IDOLKMSearchXMLConverter.convert(xml);
      return IDOLKMQueryResultConsumer.consume(self, json);
    };
  };

  KMQueryDefaultBehavior.prototype.search = function() {
    try {
      return IDOLKMQuery.prototype.search.apply(this, arguments);
    } catch(e) {
      logger.error(e);
      return {
        html : '<h4>' + e.message + '</h4>',
        page : { currentPage : 0, lastPage : 0, total : 0 }
      };
    }
  };

  return KMQueryDefaultBehavior;
}());

function require() {
  return IDOLKMQueryDefault;
}