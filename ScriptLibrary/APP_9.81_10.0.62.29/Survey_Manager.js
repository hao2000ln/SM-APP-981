/******************************************************
* Module Name: Survey integration Manager
* Function: contains business logic for survey
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Mar., 2013
*******************************************************/


var Class = lib.smis_Prototype.getClass();

var ManagerClass = Class.create(lib.smis_Manager.getClass(), {

  	initialize: function(configItem) {
		this.configItem = configItem;
	
  	},
  	
  	process: function(task) {
	  	var log = this.configItem.getLogger();
  		log.debug("Survey_Manager", "Processing task: " + task.inRecord.surveyId);
	  	
	  	var surveyId = task.inRecord.surveyId;
	  	var connector = lib.Survey_ConfigurationManager.getConnectorById(surveyId);
	  	
	  	var ret = false;
	  	try {
		  	ret = connector.process(task); 
   	  	} catch (ex) {
   	  		log.error("Survey_Manager", "Error when processing task: " + ex);
   	  		ret = false;
   	  	}
   	  	
   	  	return ret; 
  	}
  

  
});



function getClass() {return ManagerClass;}