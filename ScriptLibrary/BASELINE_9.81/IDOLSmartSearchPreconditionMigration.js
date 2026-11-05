/**
 * In Service Manager 9.41, "smartsearchprecondition" was evaluated in displayoption
 * The consequence of this design is it required to add many displayoption with same id (9527)
 * Code is duplicate heavily and hard to take modification.
 *
 *
 * In Service Manager 9.50, we use one "displayevent" to replace multiple "displayoption"
 * But customer may already have tailoring in there displayoption "Condition".
 * 
 * In order to keep those modifications, we use this script to collect and aggregate the "Condition" by module.
 *
 *
 * e.g.
 * displayoption: "example.open_gs_assistant" 
 *     condition: status = "Open"
 *            id: 9527
 *
 * displayoption: "example.closed_gs_assistant"
 *     condition: status = "Closed"
 *            id: 9527
 *
 *
 * After migration the "condition" looks like:
 *
 * condition: (screen.id in $L.screen = "example.open" and status = "Open") or (screen.id in $L.screen = "example.closed" and status = "Closed")
 *
 */
var _ = lib.Underscore.require(),
    IDOLCommon = lib.IDOLCommon.require();

var logger = getLog('IDOLSmartSearchPreconditionMigration');

var IDOLSmartSearchPreconditionMigration = (function() {

  var DEFAULT_DISPLAYSCREEN_VARIABLE_NAME_IN_DOCENGINE = 'screen.id in $L.screen';
  var DEFAULT_SMART_SEARCH_PRECONDITION_DISPLAYOPTION_ID = 9527;

  function isSCDatum(d) {
    return _.isObject(d) && (d && d.toString().indexOf("[C++ object Datum]") !== -1);
  }

  function toText(d) {
    return isSCDatum(d) ? d.getText() : d;
  }

  /**
   * @return [String] module names (sm table names)
   */
  function collectSmartSearchPreconditionModules() {
    var fSmartsearchpreconditions = new SCFile('smartsearchpreconditions', SCFILE_READONLY);
    var rc = fSmartsearchpreconditions.doSelect(true);
    var filenames = [];
    while (rc === RC_SUCCESS) {
      filenames.push(fSmartsearchpreconditions.filename);
      rc = fSmartsearchpreconditions.getNext();
    }
    return filenames;
  }

  /**
   * @param names: [String]
   * @return [{ filename : String, state :String } , ...]
   */
  function collectStatesDefinitionFromObject(names) {
    names = _.uniq(names);
    var allStates = [];
    var fObject = new SCFile('Object', SCFILE_READONLY);
    var rc = fObject.doSelect(new QueryCond('file.name', ISIN, names));
    while (rc === RC_SUCCESS) {
      var manualStates = fObject['manual.states'] ? fObject['manual.states'].toArray() : [];
      var filename = fObject['file.name'];
      var states = _.chain([
        fObject['open.state'], 
        fObject['close.state'], 
        fObject['list.state'],
        fObject['default.state'],
        fObject['search.state'],
        fObject['browse.state'],
        manualStates
      ])
      .flatten()
      .compact()
      .map(function(d) {
        return { filename : filename, state : d };
      })
      .value();

      allStates = allStates.concat(states);
      rc = fObject.getNext();
    }
    return allStates;
  }

  /**
   * @param states: [{ filename : String, state :String } , ...]
   * @return [{ filename : String, state : String, screenId : String}, ...]
   */
  function collectDisplayscreenDefinitionFromStates(states) {
    var names = _.pluck(states, 'state');
    var fStates = new SCFile('States', SCFILE_READONLY);
    var rc = fStates.doSelect(new QueryCond('state', ISIN, names));
    var displayscreens = [];
    while (rc === RC_SUCCESS) {
      var name = fStates['state'];
      // every state can have only one related displayscreen, can reuse the
      // passed in states object.
      var o = _.findWhere(states, { state : name });
      o['screenId'] = fStates['display.screen'];
      displayscreens.push(o);

      rc = fStates.getNext();
    }
    return displayscreens;
  }

  /**
   * @param displayscreens [{ filename : String, state : String, screenId : String}, ...]
   * @return [{ filename : String, state : String, screenId : String }, ...]
   */
  function collectDisplayoptionDefinitionFromDisplayscreen(displayscreens) {
    var names = _.pluck(displayscreens, 'screenId');
    var fDisplayoption = new SCFile('displayoption', SCFILE_READONLY);
    var query = new QueryCond('screen.id', ISIN, names)
      .and(new QueryCond('txt.option', EQ, DEFAULT_SMART_SEARCH_PRECONDITION_DISPLAYOPTION_ID));
    var rc = fDisplayoption.doSelect(query);
    var displayoptions = [];
    while (rc === RC_SUCCESS) {
      var screenId = fDisplayoption['screen.id'];
      var o = _.findWhere(displayscreens, { screenId : screenId});
      if (o) {
        displayoptions.push({
          screenId : screenId,
          condition : toText(fDisplayoption['condition']),
          userCondition : toText(fDisplayoption['user.condition']),
          filename : o.filename
        });
      }
      rc = fDisplayoption.getNext();
    }
    return displayoptions;
  }

  /**
   * @param displayoptions: [{ filename : String, state : String, screenId : String, id : String }, ...]
   * @return {String : String}
   */
  function aggregateDisplayoptionConditions(displayoptions) {
    var groups = _.groupBy(displayoptions, 'filename');
    /// XXX: _.mapObject is not avaialbe in current apps Underscore library
    var results = {};
    _.each(groups, function(displayoptions, filename) {
      var conditions = _.map(displayoptions, function(displayoption) {
        var condition = displayoption.condition,
            userCondition = displayoption.userCondition,
            screenId = displayoption.screenId;

        var criteria = new QueryCond(DEFAULT_DISPLAYSCREEN_VARIABLE_NAME_IN_DOCENGINE, EQ, screenId).asRAD();
        return IDOLCommon.compositeCriteria([condition, userCondition, criteria], 'and');
      });
      var condition = IDOLCommon.compositeCriteria(conditions, 'or');
      results[filename] = condition;
    });
    return results;
  }

  // [filename] -> [States] -> [displyscreen] -> [displayoption] -> {preconditions}
  var computePreconditions = _.compose(
    aggregateDisplayoptionConditions,
    collectDisplayoptionDefinitionFromDisplayscreen,
    collectDisplayscreenDefinitionFromStates,
    collectStatesDefinitionFromObject,
    collectSmartSearchPreconditionModules);

  function migratePreconditions(force) {
    var moduleEnableConditions = computePreconditions();
    var fSmartsearchpreconditions = new SCFile('smartsearchpreconditions');
    var rc = fSmartsearchpreconditions.doSelect(true);
    while (rc === RC_SUCCESS) {
      var filename = fSmartsearchpreconditions.filename;
      var condition = moduleEnableConditions[filename];
      var id = fSmartsearchpreconditions.id;
      if (!fSmartsearchpreconditions['enable.condition'] || force) {
        logger.info('migrate precondition: [' + id + '] with condition: ' + condition);
        fSmartsearchpreconditions['enable.condition'] = moduleEnableConditions[filename];
        fSmartsearchpreconditions.doSave();
      } else {
        logger.info('skip migrate: [' + id + ']');
      }
      rc = fSmartsearchpreconditions.getNext();
    }
  }

  return {
    migrate : migratePreconditions
  };
}());

function require() {
  return IDOLSmartSearchPreconditionMigration;
}
