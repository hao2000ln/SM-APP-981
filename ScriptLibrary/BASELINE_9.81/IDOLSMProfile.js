var _ = lib.Underscore.require(),
    QueryHelper = lib.QueryHelper,
    settings = lib.settings;

var PROFILE_MAPPING = {
  // Change Management Profiles
  "cm3r"           : { "profile" : "cm3profile", "variable.name" : "$G.cm3r.environment", "name" : "Change" },
  "cm3t"           : { "profile" : "cm3profile", "variable.name" : "$G.cm3t.environment", "name" : "Change Tasks" },

  // Configuration Management Profiles
  "device"         : { "profile" : "icmenv", "variable.name" : "$G.am.environment" },

  // Contract Management Profiles
  "contract"       : { "profile" : "ctenv", "variable.name" : "$G.ct.environment", "name" : "Change"},

  // Incident Management Profiles
  "probsummary"    : { "profile" : "pmenv", "variable.name" : "$G.pm.environment" },
  
  // Problem Management Profiles
  "rootcause"      : { "profile" : "rcenv", "variable.name" : "$G.rc.environment", "name" : "Problem" },
  "rootcausetask"  : { "profile" : "rcenv", "variable.name" : "$G.rc.environment", "name" : "Problem" },
  "knownerror"     : { "profile" : "rcenv", "variable.name" : "$G.rc.environment", "name" : "Problem" },
  "knownerrortask" : { "profile" : "rcenv", "variable.name" : "$G.rc.environment", "name" : "Problem" },
  
  // Request Management Profiles
  "ocmq"           : { "profile" : "ocmprofile", "variable.name" : "$G.ocmq.environment" },
  "ocmo"           : { "profile" : "ocmprofile", "variable.name" : "$G.ocmo.environment" },
  "ocml"           : { "profile" : "ocmprofile", "variable.name" : "$G.ocml.environment" },

  // PD Request Management
  "request"        : { "name" : "Request" },
  "requestTask"    : { "name" : "Request Task" },
  
  // Service Desk Profiles
  "incidents"      : { "profile" : "smenv", "variable.name" : "$G.sm.environment", "name" : "Service Desk" }
};


var IDOLSMProfile = (function() {

  function collectSecRightAppendQuery(area, queries) {
    var secRights = new SCFile('secRights', SCFILE_READONLY);
    var rc = secRights.doSelect(new QueryCond('area', EQ, area));
    while (rc === RC_SUCCESS) {
      var i = funcs.index('append.query', secRights.settingId);
      if (i > 0) {
        var query = secRights.settingValue[i - 1] || '';
        if (query) {
          queries.push(query);
        }
      }
      rc = secRights.getNext();
    }
  }

  function collectProfileAppendQuery(profile, queries) {
    var scprofile = new SCFile(profile, SCFILE_READONLY), rc;
    rc = scprofile.doSelect(true);
    while (rc === RC_SUCCESS) {
      var query = scprofile["append.query"];
      if (query) {
        queries.push(query);
      }
      rc = scprofile.getNext();
    }
  }

  function getAppendQueryDefs(filename) {
    var module = PROFILE_MAPPING[filename], queries = [];
    if (!module) { return queries; }

    if (module.profile) {
      collectProfileAppendQuery(module.profile, queries);
    }

    if (module.name) {
      collectSecRightAppendQuery(module.name, queries);
    }

    queries = _.map(queries, function(query) {
      return query.replace(/^\s*and\s+/, '');
    });

    return _.compact(queries);
  }

  function appendQuery(query, filename) {
    return QueryHelper.buildFullQuery(query, filename);
  }

  function getTableAccessFolders(filename) {
    var module = PROFILE_MAPPING[filename];
    if (!module) { return []; }

    var smvarname = module["variable.name"];
    if (smvarname) {
      // XXX: vars['$G.pm.environment']['tableAccess']['folder'] will return null
      // but RAD expression can return correct folders
      var script = "folder in tableAccess in " + smvarname;
      var folders = funcs.parse_evaluate(script, 2);
      return folders.toArray();
    }
    return [];
  }

  return {
    getQueryDefines : getAppendQueryDefs,
    appendQuery : appendQuery,
    getTableAccessFolders : getTableAccessFolders
  };
}());

function require() {
  return IDOLSMProfile;
}