/**
 * Populate 'idolindex' table when configuration changed.
 * 
 * Since different kinds of classification may use the same data source, so
 * merge them together to reduce the record count
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLIndexCore');

var IDOLIndexCore = (function() {
  function findTitleField(configs, module) {
    var titles = _.chain(configs).pluck('title').compact().uniq().value();
    if (titles.length > 1) {
      throw new Error("Multi title fields defined in " + module + " module: " + titles.join(','));
    } else if (titles.length === 0) {
      throw new Error("Module " + module + " doesn't have title field defined");
    }
    return titles[0];
  }

  function findTimestampField(configs, module) {
    var timestamps = _.chain(configs).pluck('timestamp').compact().uniq().value();
    if (timestamps.length > 1)
      throw new Error("Multi timestamp fields defined in " + module + " module: " + timestamps.join(','));
    return timestamps[0];
  }

  function mergeModule(configs, module) {
    var title = findTitleField(configs, module), 
        timestamp = findTimestampField(configs, module), 
        contents = _.chain(configs).pluck('contents').flatten().compact().uniq().value(), 
        // Problem hunter module have some extra fields can be defined
        properties = _.chain(configs).pluck('properties').flatten().compact().uniq().value(),
        security = _.chain(configs).pluck('security').flatten().compact().uniq().value();
    
    var names = _.chain(configs).pluck('name').uniq().value();
    if (names.length > 1) {
      throw new Error('Module ' + module + ' has multiple idol database name');
    }
    var name = names[0] || module;
    
    var query = _.pluck(configs, 'query').join(' or ') || 'true';
    
    var expiries = _.chain(configs).pluck('expiry').uniq().value();
    if (expiries.length > 1) {
      throw new Error('Module ' + module + ' has multiple expiry time');
    }
    var expiry = expiries[0] || 0;
    
    function fieldtype(field) {
      if (title === field) {
        return 'title';
      } else if (_.contains(contents, field)) {
        return 'content';
      } else if (_.contains(properties, field)) {
        return 'property';
      } else if (_.contains(security, field)) {
        return 'security';
      } else if (timestamp === field) {
        return 'timestamp';
      }
      return 'unknown';
    }

    var fields = _.chain(configs).map(function(config) {
      // Get all fields defined in this configuration
      return [config.title, config.timestamp, config.properties, config.security, config.contents];
    }).flatten().compact().uniq().map(function(name) {
      return { name : name, type : fieldtype(name) };
    }).value();

    return {
      title : title,
      timestamp : timestamp,
      fields : fields,
      module : module,
      query : query,
      name : name, // IDOL database name
      expiry : expiry
    };
  }

  return {
    merge : function(configs, module) {
      return _.chain(configs).filter(function(d) {
        return !module || d.module === module;
      }).groupBy(function(d) {
        return d.module;
      }).map(mergeModule).value();
    }
  };
})();

function require() {
  return IDOLIndexCore;
}