var _ = lib.Underscore.require(),
    IDOLKMQueryParameter = lib.IDOLKMQueryParameter.require(),
    IDOLParametricResultConverter = lib.IDOLParametricResultConverter.require(),
    IDOLKMQuery = lib.IDOLKMQuery.require();

var KMQueryParametric = (function() {

  function KMQueryParametric() {
    IDOLKMQuery.apply(this, arguments);
  }

  function F() {}
  F.prototype = IDOLKMQuery.prototype;

  KMQueryParametric.prototype = new F();

  KMQueryParametric.prototype.constructor = KMQueryParametric;

  KMQueryParametric.prototype.getSelectedLibraries = function() {
    var criteria = this.criteria;
    var field = criteria['__field__'];
    if (field) {
      var kmlibs = this.getAvailableLibraries(funcs.operator());
      var selected = _.findWhere(kmlibs, { kbname : field.libname });
      var selectedLibs = [ selected ];
      this.getSelectedLibraries = function() { return selectedLibs; };
      return selectedLibs;
    }
    return [];
  };

  KMQueryParametric.prototype.hasAttachmentLibrary = function() {
    return false;
  };

  KMQueryParametric.prototype.hasSharePoint = function() {
    return false;
  };

  KMQueryParametric.prototype.buildParams = function() {
    var criteria = this.criteria;
    return IDOLKMQueryParameter.buildParametricSearchCommand(this, criteria);
  };

  KMQueryParametric.prototype.getResponseFormatter = function() {
    return IDOLParametricResultConverter.convert;
  };

  return KMQueryParametric;
}());

function require() {
    return KMQueryParametric;
}