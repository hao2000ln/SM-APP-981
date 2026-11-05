var _funcs = system.functions,
    JSON = lib.JSON.json();

var Serialization = (function() {
  
  // SCFile serialize and unserialize
  function serialize(record) {
    var dTag = new SCDatum();
    _funcs.tag(dTag, record);
    return _funcs.str(dTag);
  }

  function unserialize(tag) {
    var filename = tag.substring(0, tag.indexOf(';'));
    // TODO: to prevent accident that string contains ';' character
    if (/^[a-zA-Z0-9_]+$/.test(filename) && system.files[filename]) {
      var file = new SCFile(filename);
      var dSql = new SCDatum();
      _funcs.tagquery(file, dSql, tag);
      return file;
    }
    return tag;
  }

  function stringify(obj) {
    return JSON.stringify(obj, function(key, value) {
      // SCFile
      if (typeof value === 'object' && 
          value.getType && value.getType() === 'RELATION') {
        return serialize(value);
      }
      return value;
    }, ' ');
  }

  function parse(str) {
    return JSON.parse(str, function(key, value) {
      if (typeof value === 'string' && value.indexOf(';') > 0) {
        return unserialize(value);
      }
      return value;
    });
  }
  
  return {
    stringify : stringify,
    parse : parse
  };
}());

function require() {
  return Serialization;
}
