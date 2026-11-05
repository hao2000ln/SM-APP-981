/**
 * Smart Search actions can be executed by displayoption/displayevent
 *
 * displayoption (option = 9527), this is the mechanism used in version 9.41
 * every page which want to enable Context Aware search must have a corresponding
 * displayoption with same code
 *
 * configure displayoption in every displayscreen can be annoying, especially 
 * for some module may have multiple displayscreen related.
 * 
 * In version 9.50, we introduced a new displayevent 'se.global_context_aware'
 * which applied to every displayscreen when condition evaluation passed.
 *
 * But for users who used 9.41 and configured displayoption before, and when
 * they want to switch to use 'displayevent' instead, they have to execute 
 * script 'IDOLSmartSearchPreconditionMigration' to migrate their settings.
 *
 * Above migration script can be triggered when user change 'Smart Search'
 * settings (db -> settings -> 'Smart Search')
 */
var _ = lib.Underscore.require(),
    IDOLKMMapping = lib.IDOLKMMapping.require(),
    IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(),
    IDOLGlobalSearchPreconditionCriteria = lib.IDOLGlobalSearchPreconditionCriteria.require();

var logger = getLog('IDOLGlobalSearchPrecondition');

var IDOLGlobalSearchPrecondition = (function() {

  function convertToJSON(precondition) {
    var library = precondition.library.toArray(),
        sql = precondition.sql.toArray(),
        ast = parseQuery(precondition.criteria),
        criteria = IDOLGlobalSearchPreconditionCriteria.compile(ast);

    var zip = _.zip(library, sql);
    var search = _.map(zip, function(z) {
      return { library : z[0], sql : z[1] };
    });
    var text = funcs.parse_evaluate(precondition['display.name'], 2);
    return {
      id : precondition.id,
      filename : precondition.filename,
      text : text,
      search : search,
      when : {
        format : precondition.format,
        criteria : criteria
      }
    };
  }

  // The result will be save in client side as configuration, like value => caption mapping etc.
  function readPreconditions() {
    var fSmartsearchpreconditions = new SCFile('smartsearchpreconditions', SCFILE_READONLY), preconditions = [];
    fSmartsearchpreconditions.setOrderBy(['id'], [SCFILE_ASC]);
    var rc = fSmartsearchpreconditions.doSelect('nullsub(ess, false) = $G.ess');
    while (rc === RC_SUCCESS) {
      preconditions.push(convertToJSON(fSmartsearchpreconditions));
      rc = fSmartsearchpreconditions.getNext();
    }
    return preconditions;
  }
  
  function evaluateEnableCondition(scfile, format) {
    var filename = funcs.filename(scfile);
    var query = 'filename = "' + filename + '" and nullsub(ess, false) = $G.ess';

    var fSmartsearchpreconditions = new SCFile('smartsearchpreconditions', SCFILE_READONLY);
    fSmartsearchpreconditions.setOrderBy(['id'], [SCFILE_ASC]);
    var rc = fSmartsearchpreconditions.doSelect(query);
    while (rc === RC_SUCCESS) {
      // NOTE: the type of 'enable.condition' is string, it cannot return boolean false
      var condition = fSmartsearchpreconditions['enable.condition'] || 'true';
      if (funcs.evaluate_query(condition, scfile)) {
        var predefinedFormat = fSmartsearchpreconditions.format;
        if (!predefinedFormat || predefinedFormat === format) {
          logger.trace('matched condition: ' + condition + ', format: ' + format);
          return true;
        }
      }
      rc = fSmartsearchpreconditions.getNext();
    }
    return false;
  }

  function getFieldMappings() {
    var mappings = IDOLKMMapping.getFieldMappings();
    var definitions = IDOLGlobalSearchPrecondition.readPreconditions();
    // some times there can have multiple library use one table
    // e.g. 'Known Error' and 'Problem' are using same sm table 'rootcause'
    return _.map(definitions, function(def) {
      var m = _.findWhere(mappings, { filename : def.filename });
      if (m) {
        def.fields = m.searchs;
      }
      return def;
    });
  }

  var GlobalSearch = IDOLAdvancedSettings.GlobalSearch;

  var isDisplayEventEnabled = GlobalSearch.SMART_ACTION_METHOD === 'displayevent';

  return {
    getFieldMappings : getFieldMappings,
    readPreconditions : readPreconditions,
    evaluateEnableCondition : function() {
      // for performance reason, caculate and cache the result
      return isDisplayEventEnabled && evaluateEnableCondition.apply(this, arguments);
    }
  };
}());

// This function was evaluated in EVERY page (displayevent), should never ever throw exception
// otherwise the full system is unaccessiable.
function evaluateSmartSearchCondition() {
  try {
    return IDOLGlobalSearchPrecondition.evaluateEnableCondition.apply(this, arguments);
  } catch (e) {
    logger.error(e);
    return false;
  }
}

function require() {
  return IDOLGlobalSearchPrecondition;
}