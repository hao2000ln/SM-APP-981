/******************************************************
* Module Name: Survey logger
* Function: store global logger
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Apr., 2013
*******************************************************/


//to store global singleton instance
function SingletonInstanceContainer() {}

function getLogger() {
	if (SingletonInstanceContainer.logger)
		return SingletonInstanceContainer.logger;
	else
		return new (lib.smis_Logger.getClass())();
}

function storeSurveyDefinition(surveyDefinition) {
	SingletonInstanceContainer.surveyDefinition = surveyDefinition;
	SingletonInstanceContainer.logger = surveyDefinition.getLogger();
}
