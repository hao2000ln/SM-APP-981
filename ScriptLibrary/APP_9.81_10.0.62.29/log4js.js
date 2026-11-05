/**
 * Create a new logger
 * @constructor
 * @class The main Log class.  Create a new instance of this class to send all logging events.
 * @param level The cut-off logger level.  You can adjust this level in the constructor and leave all other logging events in place.  Defaults to {@link Log#WARN}.
 * @param logger The logger to use.  The logger is a function that accepts the logging events and informs the user or developer. Defaults to {@link Log#writeLogger}.
 */
function Log(level,prefix ) {
       //logger = logger || Log.alertLogger; // default value for logger entity
       level = level || "INFO";
       prefix = prefix || "";
       var _currentLevel = Log.INFO;
       var _logger = Log.alertLogger; // default to write Logger
       var _prefix = false;
       var _filepath =""; // log file path
       
       this.toString = function(){
         return "Log Level is " + this.getLevel() + ";" +
                " prefix is " + this.getPrefix()  ;
       }
   
       /**
        * Sets the current logger prefix 
        * @param {String} prefix This prefix will be prepended to all messages.
        */
       this.setPrefix = function(pre) {
           if (pre!='undefined') { _prefix = pre; }
	   else { _prefix = false; }
       }
       /**
        * Sets the current logger function
        * @param logger The function that will be called when a log event needs to be displayed
        */
       this.setLogger = function(logger) {
           if (logger!='undefined') { _logger = logger; }
       }

       /**
        * Sets the current threshold log level for this Log instance.  Only events that have a priority of this level or greater are logged.
        * @param level The new threshold priority level for logging events.  This can be one of the static members {@link Log#DEBUG},  {@link Log#INFO}, {@link Log#WARN}, {@link Log#ERROR}, {@link Log#FATAL}, {@link Log#NONE}, or it can be one of the strings ["debug", "info", "warn", "error", "fatal", "none"].
        */
       this.setLevel = function(level) { 
           if (level!='undefined' && typeof level =='number') {
                   _currentLevel = level;
           } else if (level!='undefined') {
                   if (level=='DEBUG') { _currentLevel = Log.DEBUG; }
                   else if (level=='INFO') { _currentLevel = Log.INFO; }
                   else if (level=='ERROR') { _currentLevel = Log.ERROR; }
                   else if (level=='FATAL') { _currentLevel = Log.FATAL; }
                   else if (level=='WARN') { _currentLevel = Log.WARN; }
                   else if (level=='ALL') { _currentLevel = Log.ALL; }
				   else if (level=='OFF') { _currentLevel = Log.OFF; }
                   else { _currentLevel = Log.OFF }
           }
       }

       /**
        * Gets the current prefix
	* @return current prefix
	*/
       
       this.getPrefix = function() { return _prefix; }

       /**
        * Gets the current event logger function
	* @return current logger
	*/
       
       this.getLogger = function() { return _logger; }

       /**
        * Gets the current threshold priority level
	* @return current level
	*/
       
       this.getLevel = function() { return _currentLevel; }
       
       if (level!='undefined') { this.setLevel(level); }
       //if (logger!='undefined') { this.setLogger(logger); }
       if (prefix!='undefined') { this.setPrefix(prefix); }
}
/**
 * Log an event with priority of "debug"
 * @param s the log message
 */
Log.prototype.debug     = function(s) { if (this.getLevel()<=Log.DEBUG) { this._log(s,"DEBUG",this); } }
/**
 * Log an event with priority of "info"
 * @param s the log message
 */
Log.prototype.info      = function(s) { if (this.getLevel()<=Log.INFO ) { this._log(s,"INFO",this); } }
/**
 * Log an event with priority of "warn"
 * @param s the log message
 */
Log.prototype.warn      = function(s) { if (this.getLevel()<=Log.WARN ) { this._log(s,"WARN",this); } }
/**
 * Log an event with priority of "error"
 * @param s the log message
 */
Log.prototype.error     = function(s) { if (this.getLevel()<=Log.ERROR) { this._log(s,"ERROR",this); } }
/**
 * Log an event with priority of "fatal" 
 * @param s the log message
 */
Log.prototype.fatal     = function(s) { if (this.getLevel()<=Log.FATAL) { this._log(s,"FATAL",this); } }

/**
 * _log is the function that actually calling the configured logger function.
 * It is possible that this function could be extended to allow for more
 * than one logger.
 * 
 * This method is used by {@link Log#debug}, {@link Log#info}, {@link Log#warn}, {@link Log#error}, and {@link Log#fatal}
 * @private
 * @param {String} msg The message to display
 * @param level The priority level of this log event
 * @param {Log} obj The originating {@link Log} object.
 */
Log.prototype._log = function(msg,level,obj) { 
   if (this.getPrefix()) {
			this.getLogger()(this.getPrefix()+" - "+msg,level,obj); 
		} else {
			this.getLogger()(msg,level,obj); 
		}
}

Log.ALL         = 1;
Log.DEBUG       = 1;
Log.INFO        = 2;
Log.WARN        = 3;
Log.ERROR       = 4;
Log.FATAL       = 5;
Log.OFF		    = 6;


/**
 * Static alert logger method.  This logger will use Service Manager print method to send message to screen
 * @param {String} msg The message to display
 * @param level The priority level of this log event
 */
Log.alertLogger = function(msg,level) { print(level+" - "+msg); }

Log.rtecallLogger = function(msg, level) {
    system.functions.rtecall("log",null, level + "-" + msg);
}

function isEmpty(str) {
	return str == 'undefined' || str == null ;
}
