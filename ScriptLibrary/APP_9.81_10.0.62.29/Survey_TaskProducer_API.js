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
		var list = [];
		var emailList = [];
		for (var i = 0; i < entryMap.length; i++) {
			var map = entryMap[i];//print(lib.JSON2.toJSON(map));
			
			var taskData = this.connector.prepareTaskData(map);
			list = list.concat(taskData);

			for (var j = 0; j < map.recipients.length; j++) {
				var recipient = map.recipients[j];
				emailList.push({"email": recipient.email, "ticketId": map.ticketId});
			}
		}

		var batchCount = this.BATCH_COUNT? this.BATCH_COUNT: 5000; 
		var k = 0;
		var subList = [];
		var emailSubList = [];
		for (var i = 0; i < list.length; i++) {
			subList.push(list[i]);
			emailSubList.push(emailList[i]);
			k++;
			if (k == batchCount) {
				// push the batch task to taskQueue
				this.pushToTaskQueue(subList, emailSubList);
				subList = [];
				emailSubList = [];
				k = 0;
			}
		}
		
		if (subList.length > 0) {
			// push the remaining data to taskQueue
			this.pushToTaskQueue(subList, emailSubList);
		}
	},
	
	pushToTaskQueue: function(list, emailList) {
		var task = {};
		task.intId = this.surveyDefinition.integrationInstance.intId;
		task.integrationName = this.surveyDefinition.integrationInstance.name;
		
		var taskData = {"list": list, "surveyId": this.surveyDefinition.surveyId, "emailList": emailList};
		task.inRecord = taskData;
		
		lib.smis_TaskManager.pushTask(task);
	}

  
});


function getClass() {return TaskProducerClass;}
