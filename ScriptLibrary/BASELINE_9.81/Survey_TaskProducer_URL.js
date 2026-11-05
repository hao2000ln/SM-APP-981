/******************************************************
* Module Name: Survey integration Filter
* Function: get survey targets
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Mar., 2013
*******************************************************/


var Class = lib.smis_Prototype.getClass();

var TaskProducerClass = Class.create(lib.Survey_TaskProducer.getClass(), {

	processEntryList: function(entryMap) {
		for (var i = 0; i < entryMap.length; i++) {
			var map = entryMap[i];//print(lib.JSON2.toJSON(map));
			var task = {};
			task.intId = this.surveyDefinition.integrationInstance.intId;
			task.integrationName = this.surveyDefinition.integrationInstance.name;
			
			var mails = this.connector.prepareTaskData(map);
			var taskData = {"mails": mails, "surveyId": map.surveyId, "ticketId": map.ticketId};
			task.inRecord = taskData;
			
			lib.smis_TaskManager.pushTask(task);
		}
	}

  
});


function getClass() {return TaskProducerClass;}