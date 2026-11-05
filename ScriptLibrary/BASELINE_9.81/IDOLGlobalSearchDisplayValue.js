var _ = lib.Underscore.require(),
    tzFunctions = lib.tzFunctions,
    DisplayName = lib.DisplayName;

var IDOLGlobalSearchDisplayValue = (function() {

  var dateOrder = tzFunctions.getLocalDateOrder();

  function getJoinedGlobalListValueMappings(filename, fieldname) {
    var join = new SCFile('joindefs', SCFILE_READONLY);
    var rc = join.doSelect(new QueryCond('join.name', EQ, filename));
    if (rc === RC_SUCCESS) {
      var tables = join.join_tables, mappings = {}, i, length;
      for (i = 0, length = tables.length(); i < length; i++) {
        var _filename = tables[i].table_name;
        var _mappings = getGlobalListValueMappings(_filename, fieldname);
        _.extend(mappings, _mappings);
      }
      return mappings;
    } else {
      return getGlobalListValueMappings(filename, fieldname);
    }
  }

  function toArray(arr) {
    if (_.isSCArray(arr)) {
      return arr.toArray();
    } else if (_.isArray(arr)) {
      return arr;
    }
    return [];
  }

  function getGlobalListValueMappings(filename, fieldname) {
    var datadict = new SCFile('datadict', SCFILE_READONLY);
    var rc = datadict.doSelect(new QueryCond('name', EQ, filename));

    if (rc === RC_SUCCESS) {
      var index = funcs.index(fieldname, datadict.fields);
      if (index > 0) {
        var glname = datadict.globallist[index - 1];

        var gl = new SCFile('globallists', SCFILE_READONLY);
        var glrc = gl.doSelect(new QueryCond('name', EQ, glname));
        if (glrc === RC_SUCCESS) {
          var valueVar = gl['list.variable'],
              dispVar = gl['display.variable'];

          if (!valueVar) { return {}; }

          // if no displayvalue defined, use its raw value instead
          dispVar = dispVar || valueVar;

          var values = toArray(vars[valueVar]),
              texts = toArray(vars[dispVar]);

          return _.object(values, texts);
        }
      }
    }
    return {};
  }

  function hasher(filename, fieldname) {
    return [filename, fieldname].join(',');
  }

  var getCachedGlobalListValueMappings = _.memoize(getJoinedGlobalListValueMappings, hasher);

  var getCachedFieldReferenceTable = _.memoize(DisplayName.getFieldReferenceTable, hasher);

  var EPOCH_TIME_FORMAT = /\d{10}e/;

  function epochToDate(epoch) {
    var utcSeconds = parseInt(epoch, 10);
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    return tzFunctions.convertDatetoString(d, dateOrder);
  }

  function toDisplay(filename, fieldname, value) {
    var displayValue;

    if (_.isArray(value) || _.isSCArray(value)) {
      displayValue = _.map(value, function(v) { 
        return toDisplay(filename, fieldname, v); 
      }).join(', ');
    } else if (EPOCH_TIME_FORMAT.test(value)) {
      displayValue = epochToDate(value);
    } else {
      var refTbl = getCachedFieldReferenceTable(filename, fieldname);
      if (!!refTbl) {
        displayValue = DisplayName.getDisplayNameById(refTbl, value);
      } else if (_.isDate(value)) {
        displayValue = tzFunctions.convertDatetoString(value, dateOrder);
      } else {
        var mappings = getCachedGlobalListValueMappings(filename, fieldname);
        displayValue = mappings[value];
      }
      displayValue = displayValue || value;
    }
    return displayValue;
  }

  return {
    toDisplay : toDisplay
  };
}());

function require() {
  return IDOLGlobalSearchDisplayValue;
}