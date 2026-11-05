/**
 * Smart Search configurations.
 * All the configurations are evaluated only once, need re-login to make modification take effect.
 */
var _ = lib.Underscore.require(),
    IDOLSettings = lib.IDOLSettings.require();

var logger = getLog('IDOLAdvancedSettings');

var IDOLAdvancedSettings = (function() {

  var reader = IDOLSettings.createSettingReader('Smart Search');
  function findGlobalEventId(uniqueid) {
    var de = new SCFile('displayevent', SCFILE_READONLY);
    de.setFields(["event"]);
    var query = new QueryCond('id', EQ, uniqueid).and(new QueryCond('screen.id', EQ, 'se.global'));
    var rc = de.doSelect(query);
    return rc === RC_SUCCESS ? de['event'] : null;
  }

  var DE_OPEN = reader.getStringValue('displayevent.open'),
      DE_CONTEXT_AWARE = reader.getStringValue('displayevent.context.aware');

  // This 'displayevent' appears in EVERY page. (RAD => display)
  var OPEN_RECORD_EVENT = findGlobalEventId(DE_OPEN);
  var DISPLAYEVENT_CONTEXT_AWARE_EVENT = findGlobalEventId(DE_CONTEXT_AWARE);
  
  if (!OPEN_RECORD_EVENT) {
    logger.warn('unable to find displayevent for "open" action');
  }
  if (!DISPLAYEVENT_CONTEXT_AWARE_EVENT) {
    logger.warn('unable to find displayevent for "context aware search" action');
  }

  // its value can be 'displayevent' or 'displayoption'
  var SMART_ACTION_METHOD = reader.getStringValue('smart.search.action.method');
  var CONTEXT_AWARE_EVENT = (SMART_ACTION_METHOD === 'displayevent') ? DISPLAYEVENT_CONTEXT_AWARE_EVENT : 9527;

  logger.info('context aware event handler: ' + CONTEXT_AWARE_EVENT);

  var SMART_SEARCH_SETTINGS = {
    PAGE_SIZE : reader.getIntegerValue('search.page.size'),
    PARAMETRIC_PAGE_SIZE : reader.getIntegerValue('parametric.search.page.size'),

    // XXX: this configuration is not valid when spell check max term was specified in IDOL server
    SPELLCHECK_THRESHOLD : reader.getIntegerValue('spell.check.threshold'),
    MAX_PRINT_CHARACTERS : reader.getIntegerValue('max.field.length'),

    // IDOL server side has 'MaxQueryTerms' limitation, if 'action=Query' has a very long Text
    // error will returned, so use 'action=SuggestOnText' instead
    SUGGEST_ON_TEXT_THRESHOLD : reader.getIntegerValue('search.suggest.threshold'),
    MAIN_SEARCH_CHARACTERS : reader.getIntegerValue('search.result.character'),
    QUICK_SEARCH_CHARACTERS : reader.getIntegerValue('context.aware.search.result.character'),
    PREVIEW_CHARACTERS : reader.getIntegerValue('preview.characters'),

    QUERY_TIMEOUT : reader.getIntegerValue('query.timeout.ms'),
    HIGH_FREQ_QUERY_STRATEGY : reader.getStringValue('query.strategy'),
    ENABLE_INSTANT_SEARCH : reader.getBooleanValue('enable.instant.search'),
    INSTANT_SEARCH_DELAY : reader.getIntegerValue('instant.search.delay'),

    SMART_ACTION_METHOD : SMART_ACTION_METHOD, 

    OPEN_RECORD_EVENT : OPEN_RECORD_EVENT,
    CONTEXT_AWARE_EVENT : CONTEXT_AWARE_EVENT,

    IGNORE_SPECIALS : reader.getBooleanValue('IgnoreSpecials'),
    
    MINSCORE : reader.getFloatValue('minScore'),
    ENABLE_AUTOMATICALLY_ADD_QUOTATION : reader.getBooleanValue('enable.automatically.add.quotation'),
    // Since client side support multiple "context"
    // When user switch ticket / switch thread, we save the "context search" result in the cache
    // after that when user switch back, the saved result appears
    //
    // e.g.
    // 1. user is working on "IM10001", and fired "Context aware search". Sidebar appears and show related record to "IM10001"
    // 2. switch to "IM10002", and fired "Context aware search". Sidebar appears and show related record to "IM10002"
    // 3. switch back to "IM10001", the sidebar context will show record related to "IM10001" again which keep the state fired before.
    //
    // this cache size it to indicate how many state can be saved in client
    // the larger this value, the more memory can be consumed in browser client side
    CONTEXT_AWARE_CACHE_SIZE : reader.getIntegerValue('context.limit'),


    ENABLE_ESS_CONTEXT_AWARENESS_SEARCH : reader.getBooleanValue('enable.ess.context.aware'),

    // false: trigger suggestion bar while user typing,
    // true: manually click "suggest" button to trigger suggestion
    // true/false value choose looks strange but for compatible reason.
    MANUAL_TRIGGER_CONTEXT_AWARE_SEARCH : reader.getBooleanValue('manual.trigger.context.aware'),

    DISPLAY_RECORD_COUNT : reader.getBooleanValue('display.record.count'),
    
    REDO_CLEANUP_TIME : reader.getIntegerValue('redocleanup'),
    CONNECTOR_DAILY_BACKUP_FOLDER : reader.getStringValue('connector.daily.backup.folder'),
    CONNECTOR_DAILY_BACKUP_TIME : reader.getStringValue('connector.daily.backup.time'),
    AUTO_DETECT_LANGUAGE : reader.getBooleanValue('auto.detectlanguange'),
    SHOW_HOTNEWS_TOP_COUNT : reader.getIntegerValue('show.hotnews.top.count')
  };

  return {
    GlobalSearch : SMART_SEARCH_SETTINGS
  };
}());

function require() {
  return IDOLAdvancedSettings;
}


// var JSON = lib.JSON.json();
// print(JSON.stringify(IDOLAdvancedSettings.GlobalSearch, null, ' '));