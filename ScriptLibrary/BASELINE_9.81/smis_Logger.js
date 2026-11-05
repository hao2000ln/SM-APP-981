/******************************************************
* Module Name: SMIS Logger
* Function: log class, provide basic logger functions
* Author: Dianel Woo
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var LoggerClass = Class.create({
  initialize: function(filePath) {
    this.commLib = lib.smis_CommonLib;
    this.BACLOGLEVEL=20;//by default it's info
    this.logFile = filePath;
    
    this.processID = funcs.sysinfo_get("ProcessID");
	this.serverPID = funcs.sysinfo_get("ServerPID");  
  },
  setDefaultLevel: function(logLevel) {
	this.BACLOGLEVEL=this._getNumericLogLevel(logLevel);
  },  
  log: function(level, context, msg){
	if (this.BACLOGLEVEL == null || this.BACLOGLEVEL==undefined) {
		throw "Logger is not correctly initialized";
	}		
		
	if (this._getNumericLogLevel(level) >= this.BACLOGLEVEL) {
		if (this.commLib.isEmpty(this.logFile)) {
			print(this.commLib.formatDate(new Date(),"mm/dd/yyyy HH:MM:ss") + " " + this.processID + "( " + this.serverPID + ") " + "SMIS [" + level +"][" + context +"]: " + msg);
		} else {
			//this.commLib.smisPrint(this.commLib.formatDate(new Date(),"mm/dd/yyyy HH:MM:ss") + " SMIS [" + level +"][" + context +"]: " + msg,this.logFile);
			this.commLib.smisPrint(this.commLib.formatDate(new Date(),"mm/dd/yyyy HH:MM:ss") +  " " + this.processID + "( " + this.serverPID + ") " + " SMIS [" + level +"][" + context +"]: " + msg,this.logFile);	
		}
		
	}  
  },
  
  isDebugEnabled: function() {
    return this.BACLOGLEVEL <= 10;
  },
    
  debug: function(context, msg) {
    this.log("DEBUG", context, msg);
  },  
  info: function(context, msg) {
    this.log("INFO", context, msg);
  },
  warn: function(context, msg) {
    this.log("WARNING", context, msg);
  },
  warning: function(context, msg) {
    this.log("WARNING", context, msg);
  },
  error: function(context, msg) {
    this.log("ERROR", context, msg);
  },
  _getNumericLogLevel: function(level) {
	switch (level) {
		case "DEBUG"    : return 10;
		case "INFO"     : return 20;
		case "WARNING"  : return 30;
		case "ERROR"    : return 40;
		case "OFF"      : return 50;		
	}
	return 20;
	//throw "Invalid log level :" + level;
  }  

});


function getClass() {return LoggerClass;}
