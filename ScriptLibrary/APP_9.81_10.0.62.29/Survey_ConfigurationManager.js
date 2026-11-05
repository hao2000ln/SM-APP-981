/******************************************************
* Module Name: Survey integration configuration manager
* Function: initialize configuration item
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Mar., 2013
*******************************************************/


/*
 get config item by survey id
 
 @param {String} id - survey id
 @return {ConfigItem} - survey config item
*/
function getSurveyDefinition(surveyId) {
	var surveyDefinition = null;

	var surveyFile = new SCFile("SurveyDefinition");
	var ret = surveyFile.doSelect("id=\"" + surveyId + "\"");
	if (ret == RC_SUCCESS) {
		surveyDefinition = makeDefinition(surveyFile);
		
		var integrationInstance = lib.smis_ConfigurationManager.getEnabledConfigItem("SMSurvey");
		if (integrationInstance != null) { // if no enabled survey integration, return null
			surveyDefinition.integrationInstance = lib.smis_ConfigurationManager.getInstanceConfig(integrationInstance.intId);
		}	
	}
	
	// store global surveyDefinition and logger
	lib.Survey_Logger.storeSurveyDefinition(surveyDefinition);
	
	return surveyDefinition;
}

function makeDefinition(surveyFile) {
	var surveyDefinition = new (lib.Survey_Definition.getClass())(surveyFile.id);
	var fields = lib.Survey_Utilities.getAllFields("SurveyDefinition");
	copyFields(surveyDefinition, surveyFile, fields);
	
	if (surveyDefinition.lastProcessingTime == null)
		surveyDefinition.lastProcessingTime = new Date(0);
	
	surveyDefinition.optionalParameters = getOptionalParameters(surveyFile);
	surveyDefinition.connectorDefinition = getConnectorDefinition(surveyDefinition);
	return surveyDefinition;
}


function getConnectorDefinition(surveyDefinition) {
	var connectorDefinition = {};
	
	var connectorFile = new SCFile("SurveyConnector");
	var ret = connectorFile.doSelect("id=\"" + surveyDefinition.connectorId + "\" and active=true");
	if (ret == RC_SUCCESS) {
		var fields = ["id", "name", "type", "url", "username", "password"];
		copyFields(connectorDefinition, connectorFile, fields);
		connectorDefinition.parameterMapping = getParameterMapping(surveyDefinition.connectorId, surveyDefinition.tableName);
		connectorDefinition.recipientMapping = getRecipientMapping(surveyDefinition.connectorId, surveyDefinition.tableName, surveyDefinition.recipients);
		return connectorDefinition;
	}
	
	return null;
}

function getOptionalParameters(surveyFile) {
	var list = [];
	var lng = system.functions.lng( system.functions.denull(surveyFile.optionalParameters));
	if ( lng == null )
		lng = 0;
		
	for (var i = 0; i < lng; i++) {
		var param = {"parameter": surveyFile.optionalParameters[i].parameter, "fieldname": surveyFile.optionalParameters[i].fieldname};
		list.push(param);
	}
	
	return list;
}

function getParameterMapping(connectorId, module) {
	var list = [];
	
	var parameterMappingFile = new SCFile("SurveyParameterMapping");
	var ret = parameterMappingFile.doSelect("connectorId=\"" + connectorId + "\" and module=\"" + module + "\" and active=true");
	while (ret == RC_SUCCESS) {
		var parameterMapping = {};
		var fields = ["id", "connectorId", "module", "orderId", "mappingType", "mappingValue", "parameter", "label"];
		copyFields(parameterMapping, parameterMappingFile, fields);
		
		list.push(parameterMapping);
		ret = parameterMappingFile.getNext();
	}
	
	function compare(param1, param2){
		if(param1.orderId < param2.orderId){
		    return -1;
		}else if(param1.orderId > param2.orderId){
		    return 1;
		}else{
		    return 0;
		}
	}
	list.sort(compare);
	
	return list;
}

function getRecipientMapping(connectorId, module, recipientList) {
	var list = [];
	
	var recipientMappingFile = new SCFile("SurveyRecipientMapping");
	var query = "connectorId=\"" + connectorId + "\" and module=\"" + module + "\" and parameter isin " + system.functions.str(recipientList) + " and active=true";
	var ret = recipientMappingFile.doSelect(query);
	while (ret == RC_SUCCESS) {
		var recipientMapping = {};
		var fields = ["id", "connectorId", "module", "recipientType", "group", "subgroup", "recipient", "parameter", "mappingType", "label"];
		copyFields(recipientMapping, recipientMappingFile, fields);
		
		list.push(recipientMapping);
		ret = recipientMappingFile.getNext();
	}
	
	return list;
}

function copyFields(jsObj, smObj, fields) {
	for (var i = 0; i < fields.length; i++) {
		var type = system.functions.type(smObj[fields[i]]); // 1-number, 2-string, 3-date, 4-boolean, 8-array
		if (type == 8) {
			jsObj[fields[i]] = lib.ArrayUtil.toJsArray(smObj[fields[i]]);
		} else
			jsObj[fields[i]] = smObj[fields[i]];
	}
}

function getTaskProducer(surveyDefinition) {
	var taskProducer;
	switch (surveyDefinition.connectorType) {
		case "internal":
			taskProducer = new (lib.Survey_TaskProducer_URL.getClass())(surveyDefinition);
			break;
		case "url":
			taskProducer = new (lib.Survey_TaskProducer_URL.getClass())(surveyDefinition);
			break;
		case "api":
		case "apiMed":
			taskProducer = new (lib.Survey_TaskProducer_API.getClass())(surveyDefinition);
			break;
		default:
			taskProducer = new (lib.Survey_TaskProducer_URL.getClass())(surveyDefinition);
			break;
	}
	
	return taskProducer;
}

function getConnector(surveyDefinition) {
	var connector;
	switch (surveyDefinition.connectorType) {
		case "internal":
			connector = new (lib.Survey_Connector_URL.getClass())(surveyDefinition);
			break;
		case "url":
			connector = new (lib.Survey_Connector_URL.getClass())(surveyDefinition);
			break;
		case "api":
		case "apiMed":
			connector = new (lib.Survey_Connector_API.getClass())(surveyDefinition);
			break;
		default:
			connector = new (lib.Survey_Connector.getClass())(surveyDefinition);
			break;
	}
	
	return connector;
}

function getConnectorById(surveyId) {
	var surveyDefinition = getSurveyDefinition(surveyId);
	return getConnector(surveyDefinition);
}

