var _ = lib.Underscore.require();

var IDOLPreference = (function() {
  function getLibraries() {
    var preference = new SCFile('kmlibpreference', SCFILE_READONLY),
        operator = funcs.operator();

    var query = new QueryCond("operator.name", EQ, operator);
    var rc = preference.doSelect(query);
    if (rc === RC_SUCCESS) {
      return preference['library.name'].toArray();
    }
    // indicate that current user has no library selection, check them all
    return null;
  }

  function saveLibraries(selectedLibraries) {
    var preference = new SCFile('kmlibpreference'),
        operator = funcs.operator();

    var query = new QueryCond("operator.name", EQ, operator);
    var rc = preference.doSelect(query);
    if (rc === RC_NO_MORE) {
      preference['operator.name'] = operator;
    }

    preference['library.name'] = _.clone(selectedLibraries);
    return preference.doSave();
  }

  return {
    getLibraries: getLibraries,
    saveLibraries: saveLibraries
  };
}());

function require() {
  return IDOLPreference;
}