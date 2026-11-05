/**
 * Configurations for Client Side (webiter).
 */
var _ = lib.Underscore.require();

var IDOLGlobalSearchInitializer = (function() {

  function checkLicense() {
    var licensed = true,
        enabled = vars.$lo_idol_enabled;
    return licensed && enabled;
  }

  function getFieldMappings() {
    // no license, no library load
    var IDOLGlobalSearchPrecondition = lib.IDOLGlobalSearchPrecondition.require();
    var mappings = IDOLGlobalSearchPrecondition.getFieldMappings();
    return { mappings : mappings };
  }

  function getSettings() {
    // lazy load to improve performance
    // those code will be executed during login process
    var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(); 
    var settings = IDOLAdvancedSettings.GlobalSearch || {};

    return {
      pageSize           : settings.PAGE_SIZE,
      parametricPageSize : settings.PARAMETRIC_PAGE_SIZE,
      drillDownEvt       : settings.OPEN_RECORD_EVENT,
      smartActionEvt     : settings.CONTEXT_AWARE_EVENT,
      enableESSCS        : settings.ENABLE_ESS_CONTEXT_AWARENESS_SEARCH,
      manualTrigger      : settings.MANUAL_TRIGGER_CONTEXT_AWARE_SEARCH,
      contextCacheSize   : settings.CONTEXT_AWARE_CACHE_SIZE,
      displayCount       : settings.DISPLAY_RECORD_COUNT,
      queryStrategy      : settings.HIGH_FREQ_QUERY_STRATEGY,
      enableInstant      : settings.ENABLE_INSTANT_SEARCH,
      queryDelay         : settings.INSTANT_SEARCH_DELAY,
      detectLanguage     : settings.AUTO_DETECT_LANGUAGE
    };
  }

  function initialize() {
    var licensed = checkLicense();
    // no need to load field mapping if user doesn't have license
    if (!licensed) {
      return { hasLicense : licensed };
    }
    var mappings = getFieldMappings(),
        settings = getSettings();
    return _.extend({}, mappings, settings, { hasLicense : licensed });
  }

  return {
    initialize : initialize
  };
}());

function require() {
  return IDOLGlobalSearchInitializer;
}