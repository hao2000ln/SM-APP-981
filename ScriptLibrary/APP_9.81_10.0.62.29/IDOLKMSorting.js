var _ = lib.Underscore.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require();

var IDOLKMSorting = (function() {
  var SORT_FILED_MAPPING = {
    "sysmodtime" : function(name, value) {
      name = IDOLKMFieldMapping.mappingIDOLDateField("sysmodtime");
      return name+":"+value;
    },
    "kmstatus" : function(name, value) {
      name = "KMSTATUS_MATCH";
      return name+":"+value;
    },
    "score" : function(name, value) {
      return "Relevance";
    }
  };

  function getSortInfo(sortInfo) {
    var asort =[];
    if(sortInfo) {
      var sorts = sortInfo.split(',');

      asort = _.map(sorts, function(field) {
        var tmap = field.split(" ");
        var name = tmap[0];
        var value = tmap[1];
        var sortfield;
        value = (value === 'asc') ? "increasing" : "decreasing";

        func = SORT_FILED_MAPPING[name];
        if (_.isFunction(func)) {
          sortfield = func(name, value);
        }
        return sortfield;
      });
    }

    return _.isEmpty(asort) ? {} : { "sort" : asort.join('+') };
  }

  return {
    getSortInfo : getSortInfo
  }
})();

function require() {
  return IDOLKMSorting;
}