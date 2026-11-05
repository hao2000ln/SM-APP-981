var _ = lib.Underscore.require(),
  scmsg = funcs.scmsg;
//var logger = getLog('IDOLModuleConfiguration');
var IDOLModuleConfiguration = (function() {
  var PDE = lib.ProcessDesignerEnablement || (function() {
      // fallback to fit older apps
      // TODO: move these functions to IDOLCommon
      function isIncidentEnabled() { return lib.IDOL_Help.isPDEnabled("probsummary"); }
      function isProblemEnabled() { return lib.IDOL_Help.isPDEnabled("rootcause"); }
      function isChangeEnabled() { return lib.IDOL_Help.isChangeEnabled("cm3r"); }
      
      return {
        isIncidentEnabled : _.memoize(isIncidentEnabled),
        isProblemEnabled : _.memoize(isProblemEnabled),
        isChangeEnabled : _.memoize(isChangeEnabled)
      };
    })();
  // TODO: should expose following configuration to a UI page
  // XXX: The 'id' attribute in 'actions': The 'id' is also used as css selector, 
  //      and icon was drawed according to this 'id' value
  // 
  //      Currently there are only two icons, one is attached to id 'idol-action-list'
  //      Another is attached to id which start with 'idol-action-link'
  //
  // TODO: add icon configuration, since attachment can be stored in SM database
  //       could read these attachement, and generate CSS file with 'data-uri'
  var MODULE_CONFIGS = {
    // Service Desk
    "incidents": {
      actions : [{
        id: 'idol-action-list',
        text: scmsg(1023, 'idol'),
        aria: scmsg(1023, 'idol'),
        process: 'idol.hot.topic.view'
      }, {
        id: 'idol-action-link-incident',
        text: scmsg(1025, 'idol'),
        aria: scmsg(1025, 'idol'),
        process: function() {
          return PDE.isIncidentEnabled() ? 'idol.hot.topic.create.pd.incident' : 'idol.hot.topic.create.incident';
        }
      }, {
        id: 'idol-action-link-article',
        text: scmsg(1029, 'idol'),
        aria: scmsg(1029, 'idol'),
        process: function() {
          return 'idol.hot.topic.create.document';
        }
      }],
      displayscreen : "idol.hta.sd",
      relationship : "Related Interactions",
      next : function() { return generateTicketID("incident"); },
      escalate : function(source, depends) {
        var filename = funcs.filename(source);
        if (filename === "probsummary") {
          copyInteractionToIncident(source, depends);
        }
      }
    },

    // Incident Management
    "probsummary": {
      actions : function() {
        var list = {
          id: 'idol-action-list',
          text: scmsg(1013, 'idol'),
          aria: scmsg(1013, 'idol'),
          process: 'idol.hot.topic.view'
        }, createProblem = {
          id: 'idol-action-link-problem',
          text: scmsg(1012, 'idol'),
          aria: scmsg(1012, 'idol'),
          process: function() {
            return PDE.isProblemEnabled() ? 'idol.hot.topic.create.pd.problem' : 'idol.hot.topic.create.problem';
          }
        }, createChange = {
          id: 'idol-action-link-change',
          text: scmsg(1026, 'idol'),
          aria: scmsg(1026, 'idol'),
          process: function() {
            return PDE.isChangeEnabled() ? 'idol.hot.topic.create.pd.change' : 'idol.hot.topic.create.change';
          }
        }, createArticle = {
          id: 'idol-action-link-article',
          text: scmsg(1029, 'idol'),
          aria: scmsg(1029, 'idol'),
          process: function() {
            return 'idol.hot.topic.create.document';
          }
        }, createParent = {
          id: 'idol-action-link-parent',
          text: scmsg(1030, 'idol'),
          aria: scmsg(1030, 'idol'),
          process: function() {
            return 'idol.hot.topic.create.parent';
          }
        };
        if (vars['$hta.analytics.action']==="setparent") {
          return [list, createParent];
        }

        if (vars['$hta.analytics.action']==="createproblem") {
          return [list, createProblem];
        }
        return [list, createChange, createArticle];
      },
      displayscreen : "idol.hta.im",
      relationship : "Related Incidents",
      next : function() { return generateTicketID("incident management"); },
      escalate : function(source, depends) {
        var filename = funcs.filename(source);
        switch (filename) {
          case "rootcause": copyIncidentToProblem(source, depends); break;
          case "cm3r": copyIncidentToChange(source, depends); break;
          default: // do nothing
        }
      }
    },


    // Problem Management
    "rootcause": {
      actions : [{
        id: 'idol-action-list',
        text: scmsg(1027, 'idol'),
        aria: scmsg(1027, 'idol'),
        process: 'idol.hot.topic.view'
      }, {
        id: 'idol-action-link-change',
        text: scmsg(1026, 'idol'),
        aria: scmsg(1026, 'idol'),
        process: function() {
          return PDE.isChangeEnabled() ? 'idol.hot.topic.create.pd.change' : 'idol.hot.topic.create.change';
        }
      }, {
        id: 'idol-action-link-article',
        text: scmsg(1029, 'idol'),
        aria: scmsg(1029, 'idol'),
        process: function() {
          return 'idol.hot.topic.create.document';
        }
      }],
      displayscreen : "idol.hta.pm",
      relationship : "Related Problems",
      next : function() { return generateTicketID("problem management"); },
      escalate : function(source, depends) {
        var filename = funcs.filename(source);
        if (filename === "cm3r") {
          copyProblemToChange(source, depends);
        }
      }
    },

    // Change Management
    "cm3r": {
       actions : [{
        id: 'idol-action-list',
        text: scmsg(1033, 'idol'),
        aria: scmsg(1033, 'idol'),
        process: 'idol.hot.topic.view'
      }],
      displayscreen : "idol.hta.cm3r",
      relationship : "Related Changes",
      next : function() { return generateTicketID("cm3r"); }
    },
    
    
    //Internal Survey
    "SurveyInternal": {
      actions : [{
        id: 'idol-action-list',
        text: scmsg(1031, 'idol'),
        aria: scmsg(1031, 'idol'),
        process: 'idol.hot.topic.view'
      },{
        id: 'idol-action-link-interaction',
        text: scmsg(1032, 'idol'),
        aria: scmsg(1032, 'idol'),
        process: function() {
          return 'idol.hot.topic.create.interaction';
        }
      }],
      displayscreen : "idol.hta.survey",
      next : function() { return generateTicketID("SurveyInternal"); }
     
    }
    
  };

  function copyInteractionToIncident(incident, interactions) {
    incident["severity"] = interactions["severity"];
    incident["affected.item"] = interactions["affected.item"];
    incident["logical.name"] = interactions["logical.name"];
    incident["subcategory"] = interactions["subcategory"];
    incident["category"] = interactions["category"];
    incident["product.type"] = interactions["product.type"];
    incident["initial.impact"] = interactions["initial.impact"];
    incident["severity"] = interactions["severity"];
    incident["priority.code"] = interactions["priority.code"];
    var assignment = interactions["assignment"];
    incident["assignment"] = _.isArray(assignment) ? assignment[0] : assignment;
    // copy fields
  }

  function copyIncidentToProblem(problem, incidents) {
    problem["assignment"] = incidents["assignment"];
    problem["subcategory"] = incidents["subcategory"];
    problem["product.type"] = incidents["product.type"];
    problem["initial.impact"] = incidents["initial.impact"];
    problem["severity"] = incidents["severity"];
    problem["affected.item"] = incidents["affected.item"];
    problem["logical.name"] = incidents["logical.name"];
    // copy fields
  }

  function copyIncidentToChange(change, incidents) {
    change["initial.impact"] = incidents["initial.impact"];
    change["severity"] = incidents["severity"];
    change["affected.item"] = incidents["affected.item"];

    var rc = incidents.getFirst(), cis = [];
    while (rc === RC_SUCCESS) {
      cis.push(incidents["logical.name"]);
      rc = incidents.getNext();
    }
    change.assets = _.chain(cis).compact().uniq().value();
    // copy fields
  }

  function copyProblemToChange(change, problems) {
    change["affected.item"] = problems["affected.item"];
    change["initial.impact"] = problems["initial.impact"];
    change["severity"] = problems["severity"];
    change["priority.code"] = problems["priority.code"];
    change["assign.dept"] = problems["assignment"];

    var rc = problems.getFirst(), cis = [];
    while (rc === RC_SUCCESS) {
      cis.push(problems["logical.name"]);
      rc = problems.getNext();
    }
    change.assets = _.chain(cis).compact().uniq().value();
    // copy fields
  }

  function generateTicketID(cls) {
    var rtc = new SCDatum(), next = new SCDatum();
    funcs.rtecall("getnumber", rtc, next, cls);
    return next;
  }

  return {
    get : function(filename) {
      var config = MODULE_CONFIGS[filename];
      if (!config) throw new Error(filename + " is not configured in HTA");
      return config;
    },
    isCustomizedQueryEnabled : true
  };
})();

function require() {
  return IDOLModuleConfiguration;
}

 
/**
 * This function is for "CreateProblem" feature of HTA
 * This function would be evaluated by RTE, so the return value should be in POD type (string, number, bool)
 *
 * @param facet : getIDOLFieldName/getFieldValue/getSearchCriteria
 * @param keys : number of file probsummary
 * @returns {*}
 */
function getAction4CreateProblem( facet, keys )
{
  function getIDOLFieldName()
  {
    return "hasrelatedproblem";
  }

  function getDependFieldName()
  {
    return "number";
  }

  function getFieldValue( keys )
  {
    return hasRelatedProblem(keys[0]);
  }

  function getSearchCriteria()
  {
    return "null(hasrelatedproblem) or (hasrelatedproblem = false)";
  }

  function hasRelatedProblem( key )
  {
    var f = new SCFile('screlation');
    var q = ' select count(*) as cnt from screlation where source="' + key + '" and depend.filename="rootcause" and type="Related Problems"';
    var rc = f.doSelect(q);
    var cnt = (rc == RC_SUCCESS)? f.cnt: 0;

    return cnt > 0;
  }

  switch (facet)
  {
    case 'getIDOLFieldName' : return getIDOLFieldName();
    case 'getFieldValue'    : return getFieldValue(keys);
    case 'getSearchCriteria': return getSearchCriteria();
    case 'getKeyFielName': return getDependFieldName();
  }

  return null;
}
function triggerHTAIndex(filename, query)
{
   var f = new SCFile(filename);
   var rc = f.doSelect(query);
   while(rc == RC_SUCCESS)
   {
      lib.KMAdmin.kmtriggerBeforeUpdate(filename, f);
      lib.KMAdmin.kmtriggerAfterUpdate(filename, f);
      rc = f.getNext();
   }
   
}
function buildHTAFields(file)
{
  var filename = funcs.filename(file)
  if(!filename || filename != "probsummary")
  {
    return "";
  }
  var strHtaField ="";
  var keys =[];
  var filedname = getAction4CreateProblem("getKeyFielName");
  keys.push(file[filedname]);
  if(getAction4CreateProblem("getFieldValue",keys))
  {
    var idolFieldName = getAction4CreateProblem("getIDOLFieldName");
    idolFieldName = idolFieldName.toUpperCase();
    strHtaField = "#DREFIELD "+idolFieldName+"=\"true\"\n";
  }
  if(getAction4CreateChangeArticle("getFieldValue",keys))
  {
    var idolFieldName = getAction4CreateChangeArticle("getIDOLFieldName");
    idolFieldName = idolFieldName.toUpperCase();
    strHtaField += "#DREFIELD "+idolFieldName+"=\"true\"\n";
  }
  //logger.info("buildHTAFields for "+keys[0] +" return :"+strHtaField);
  return strHtaField;
}
/**
 * This function is for "CreateChange/Article" feature of HTA
 * This function would be evaluated by RTE, so the return value should be in POD type (string, number, bool)
 *
 * @param facet : getIDOLFieldName/getFieldValue/getSearchCriteria
 * @param keys : number of file probsummary
 * @returns {*}
 */
 
function getAction4CreateChangeArticle( facet, keys )
{
  function getIDOLFieldName()
  {
    return "hasrelatedchange";
  }

  function getDependFieldName()
  {
    return "number";
  }

  function getFieldValue( keys )
  {
    return hasRelatedProblem(keys[0]);
  }

  function getSearchCriteria()
  {
    return "null(hasrelatedchange) or (hasrelatedchange = false)";
  }

  function hasRelatedProblem( key )
  {
    var f = new SCFile('screlation');
    var q = ' select count(*) as cnt from screlation where source="' + key + '" and depend.filename="cm3r" ';
    var rc = f.doSelect(q);
    var cnt = (rc == RC_SUCCESS)? f.cnt: 0;

    return cnt > 0;
  }

  switch (facet)
  {
    case 'getIDOLFieldName' : return getIDOLFieldName();
    case 'getFieldValue'    : return getFieldValue(keys);
    case 'getSearchCriteria': return getSearchCriteria();
  }

  return null;
}


function getParentIncidentSearchQuery() {
  return 'master.incident=true and problem.status~="Closed"';
}
