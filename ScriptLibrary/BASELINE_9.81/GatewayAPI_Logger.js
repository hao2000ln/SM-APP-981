
Logger.DEBUG = 0;
Logger.INFO = 1;
Logger.WARN = 2;
Logger.ERROR = 3;

function Logger( le ) {

	  if (le == undefined || le == null || le < 0) le = Logger.INFO;

	return {
		logLevel: le,
		setLogLevel: function(level) {this.logLevel = level},

		debug: function( msg, clazz ) {
			this._printLog( Logger.DEBUG, msg, clazz );
		},

		isDebug: function(){
			return this.logLevel <= Logger.DEBUG;
		},

		info: function(msg,clazz) {
			this._printLog(Logger.INFO,msg,clazz);
		},

		isInfo:function() {
			return this.logLevel <= Logger.INFO;
		},

		warn: function(msg,clazz) {
			this._printLog(Logger.WARN,msg,clazz);
		},

		isWarn:function() {
			return this.logLevel <= Logger.WARN;
		},

		error: function(msg,clazz) {
			this._printLog(Logger.ERROR,msg,clazz);
		},

		isError:function() {
			return this.logLevel <= Logger.ERROR;
		},

		_printLog: function(l, msg,clazz) {

			if (l == null || l < 0) l = Logger.INFO;
                        clazz = clazz || 'GatewayAPI_Logger';

			var prefix = "";
			switch (l) {
				case Logger.DEBUG:
					prefix = "DEBUG";
					break;
				case Logger.INFO:
					prefix = "INFO";
					break;
				case Logger.WARN:
					prefix = "WARN";
					break;
				case Logger.ERROR:
					prefix = "ERROR";
					break;
				default:
					prefix = "ERROR";
			}

			if (this.logLevel <= l) {
				//print("["+prefix+"]["+clazz+"]: "+msg);
				system.functions.rtecall("log", vars.$L_log, "["+prefix+"]["+clazz+"]: "+msg);

			}
		}
	}
}

__log_instance = Logger( Logger.INFO );


function log( fileName ) {
    return {
        isDebug : function( functionName ) { return __log_instance.isDebug(); },
        isInfo : function( functionName ) { return __log_instance.isInfo(); },
        isWarn : function( functionName ) { return __log_instance.isWarn(); },
        isError : function( functionName ) { return __log_instance.isError(); },

        debug : function( msg ) { __log_instance.debug( msg, fileName ); },
        info : function( msg ) { __log_instance.info( msg, fileName ); },
        warn : function( msg ) { __log_instance.warn( msg, fileName ); },
        error : function( msg ) { __log_instance.error( msg, fileName ); }
    };
}

