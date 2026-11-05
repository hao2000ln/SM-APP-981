var _ = lib.Underscore.require();

// almost same as ScriptLibrary 'GetFieldNames', but ignore the 'available' flag
// that make system field caption can also be seen on the search page
var IDOLGlobalSearchFieldCaption = (function() {

  function pickSCFileCaptions(filename) {
    var datadict = new SCFile('datadict', SCFILE_READONLY);
    var rc = datadict.doSelect(new QueryCond('name', EQ, filename));
    if (rc === RC_SUCCESS) {
      var fields = datadict.fields.toArray();
      var captions = _.map(fields, function(fieldname) {
        return funcs.get_field_caption(fieldname, filename);
      });
      return _.object(fields, captions);
    }
    return {};
  }

  function getCaptions(filename) {
    var join = new SCFile('joindefs', SCFILE_READONLY);
    var rc = join.doSelect(new QueryCond('join.name', EQ, filename));
    if (rc === RC_SUCCESS) {
      var tables = join.join_tables, captions = {}, length = tables.length(), i;
      for (i = 0; i < length; i++) {
        var tblCaptions = pickSCFileCaptions(tables[i].table_name);
        _.extend(captions, tblCaptions);
      }
      return captions;
    } else {
      return pickSCFileCaptions(filename);
    }
  }

  return {
    getCaptions : getCaptions
  };

}());

function require() {
  return IDOLGlobalSearchFieldCaption;
}