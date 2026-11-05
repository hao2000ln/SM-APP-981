var _ = lib.Underscore.require();

var IDOLSettings = (function() {

  function Reader(name) {
    var fsettings = new SCFile('settings', SCFILE_READONLY);
    var rc = fsettings.doSelect(new QueryCond('name', EQ, name));
    if (rc !== RC_SUCCESS) {
      throw new Error(name + ' settings is not available.');
    }
    this._name = name;
    this._fsettings = fsettings;
  }

  // NOTE: lib.settings.getValue always return "string", even the field type already 
  // set to "number"/"boolean". 
  // Has to convert it manually.
  var CONVERTERS = {
    "integer" : parseInt,
    "float"   : parseFloat,
    "string"  : _.identity,
    "boolean" : function(v) { return v === 'true'; }
  };

  Reader.prototype._getSettingValue = function(key, type) {
    var name = this._name,
        fsettings = this._fsettings;

    var value = lib.settings.getValue(name, key, fsettings);
    var convert = CONVERTERS[type] || _.identity;
    return convert(value);
  };

  _.chain(CONVERTERS).keys().map(function(type) {
    // XXX: mapObject is not available in Underscore 1.6.0
    var methodName = 'get' + _.capitalize(type) + 'Value';
    return [type, methodName];
  }).each(function(args) {
    var type = args[0], methodName = args[1];

    Reader.prototype[methodName] = function(key) {
      return this._getSettingValue(key, type);
    };
  });

  return {
    createSettingReader : function(name) {
      return new Reader(name);
    }
  };
} ());


function require() {
  return IDOLSettings;
}