var _ = lib.Underscore.require(),
    Serialization = lib.IDOLSerialization.require();

var Scheduler = (function() {
  
  function Schedule(cfg) {
    var schedule = new SCFile("schedule");

    _.each(cfg, function(value, name) {
      schedule[name] = value;
    });
    
    this.set = function(name, value) {
      schedule[name] = value;
      return this;
    };
    // the first argument is the function which will be called in schedule
    // the rest arguments are parameters needed by schedule function
    this.javascript = function(func) {
      if (typeof func !== 'function') {
        throw func + ' is not a javascript function';
      }
      
      var params = _.map(_.rest(arguments), Serialization.stringify);
      schedule.strings = params;

      var script = func.toString();
      if (script.indexOf('[native code]') > -1) {
        script = func.name;
      }
      
      var schedule_javascript = [
        'var _ = lib.Underscore.require();',
        'var Serialization = lib.IDOLSerialization.require();',
        // The 'record' is not point to schedule object, so use 
        // '$L.schedule' instead, this behavior is depend on the 
        // implementation of RAD 'scheduler'
        'var schedule = vars["$L.schedule"];',
        'var logger = getLog("schedule class: " + schedule["class"]);',
        '',
        'try {',
        '  var strings = schedule.strings.toArray();',
        '  var args = _.map(strings, Serialization.parse);',
        '  var fn = (' + _.trim(script) + ');',
        '  fn.apply(schedule, args);',
        '} catch (e) {',
        '  logger.error("exception happened in background schedule: ");',
        '  logger.error(schedule);',
        '  logger.error(e);',
        '  logger.error(e.stack);',
        '  throw e',
        '}'
      ].join('\n');
      
      schedule.javascript = schedule_javascript;
      return this;
    };
    this.start = function() {
      schedule.doInsert();
      return this;
    };
    // invoke immediately, for test only
    this.debug = function() {
      system.vars['$L.schedule'] = schedule;
      var script = '(function(){' + schedule.javascript + '})()';
      eval(script);
    };
  }
  return {
    schedule : function(cfg) {
      return new Schedule(cfg);
    }
  };
}());

function require() {
  return Scheduler;
}