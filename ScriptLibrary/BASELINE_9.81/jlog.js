function msg(text, level) {
	system.functions.msg(text, level);
}

function setLoggerLevel(loggerName, level) {
	getLog(loggerName).setLevel(level);
}

function trace(loggerName, msgText){
	getLog(loggerName).trace(msgText);
}


function debug(loggerName, msgText){
	getLog(loggerName).debug(msgText);
}


function info(loggerName, msgText){
	getLog(loggerName).info(msgText);
}


function warn(loggerName, msgText){
	getLog(loggerName).warn(msgText);
}


function error(loggerName, msgText){
	getLog(loggerName).error(msgText);
}


function fatal(loggerName, msgText){
	getLog(loggerName).fatal(msgText);
}


function isTraceEnabled(loggerName){
	return getLog(loggerName).isTraceEnabled();
}


function isDebugEnabled(loggerName){
	return getLog(loggerName).isDebugEnabled();
}


function isInfoEnabled(loggerName){
	return getLog(loggerName).isInfoEnabled();
}


function isWarnEnabled(loggerName){
	return getLog(loggerName).isWarnEnabled();
}


function isErrorEnabled(loggerName){
	return getLog(loggerName).isErrorEnabled();
}


function isFatalEnabled(loggerName){
	return getLog(loggerName).isFatalEnabled();
}

