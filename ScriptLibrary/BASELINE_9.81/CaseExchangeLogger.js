/******************************************************
* Module Name: Case Exchange
* Function: Case Exchange Logger
* Author: He, Peng-Fei
* Version: 1.00
* Creation Date: Mar, 2014
*******************************************************/
var logger = null;

/**
*	Retrieve smis logger object
*
*	@Return - smis logger object of a spcific connector
*	@Type - logger object
**/
function getLogger() {
	if (!logger) {
		initLogger();
	}
	return logger;
}

/**
*	Initiate the logger by a configItem.
*	If configItem is not defince, new a default logger
*	@param - configItem
**/
function initLogger(configItem) {
	if (!configItem){
		logger = new (lib.smis_Logger.getClass())();
	} else {
		logger = configItem.getLogger();
	}
}

/**
*	Destory the logger object
*
**/
function destoryLogger() {
	logger = null;
}