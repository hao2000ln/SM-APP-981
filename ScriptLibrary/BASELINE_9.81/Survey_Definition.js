/******************************************************
* Module Name: Survey integration configuration item
* Function: configuration item for each survey
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Mar., 2013
*******************************************************/


var Class = lib.smis_Prototype.getClass();

var SurveyDefinitionClass = Class.create({
	
	surveyId: null,
	name: null,
	sendInterval: null,
	connector: null,
	connectorDefinition: null,
	optionalParameters: null,
	integrationInstance: null, // smis integration instance

	initialize: function(surveyId) {
		this.surveyId = surveyId;
	},
	
	getConnector: function() {
		return this.connector;
	},
	  
	getIntervalTimeDate: function() {
		if (this.sendInterval == null || this.sendInterval == "") this.sendInterval = 0;
		var interval = system.functions.val(this.sendInterval,1);
		return system.functions.val(interval,3);
  	
  	},
  	
  	getLogger: function() {
  		if (this.integrationInstance != null)
			return this.integrationInstance.getLogger();
	
		return new (lib.smis_Logger.getClass())();
  	},
  	
  	calculateParameterSequence: function() {
  		var list = [];
  		var parameterMapping = this.connectorDefinition.parameterMapping;
  		for (var i = 0; i < parameterMapping.length; i++) {
  			list.push(parameterMapping[i].parameter);
  		}
  		
  		// calculate optional parameters
  		var optionalParameters = this.optionalParameters;
  		for (var j = 0; j < optionalParameters.length; j++) {
  			list.push(optionalParameters[j].parameter);
  		}
  		
  		return list;
  	}
  	


});

function getClass() {return SurveyDefinitionClass;}