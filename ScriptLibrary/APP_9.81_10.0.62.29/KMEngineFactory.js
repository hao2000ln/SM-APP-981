var logger = getLog('KMEngineFactory');

var KMEngineFactory = (function() {

  function isIDOLEnabled() {
    if (vars['$G.bg']) {
      var IDOLConfigure = lib.IDOLConfigure.require();
      // make sure read from database.
      IDOLConfigure.clearIDOLServerConfigCache();
      var config = IDOLConfigure.getConfig();
      return config['enable'];
    } else {
      return vars['$lo.idol.enabled'];
    }
  }

  function createKMEngine() {
    if (isIDOLEnabled()) {
      return lib.IDOLKMEngine.require();
    } else {
//      throw new Error('No search engine found');
      logger.warn('No search engine found');
      return lib.PseudoKMEngine.require();
    }
  }

  return {
    create : function() {
      var engine = createKMEngine();
      logger.trace('using search engine: ' + engine.name);
      return engine;
    }
  };
}());

function require() {
  return KMEngineFactory;
}