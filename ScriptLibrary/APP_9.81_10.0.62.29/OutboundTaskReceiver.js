/*
* API for receiving task from SM
* param task - should provide intId, action, internalId, externalId, inrecord
*/
function pushTask(task, attachList) {
	var intId = task.intId;
	var configItem = lib.smis_ConfigurationManager._getInstanceConfigByIntId(intId);
	task.integrationName = configItem.name;
	
	// if synchromouns, set it running to prevent background schedule to run it
	if (!configItem.getConfigParameterValue("asynchronousProcessing")) {
		task.status = lib.smis_Constants.TASK_STATUS_RUNNING();
	}
	
	// push to task queue first
	var taskId = lib.smis_TaskManager.pushTask(task);
	if (taskId != null) {
		var findTask = new SCFile("SMISTaskQueue");
		var ret = findTask.doSelect("id=\"" + taskId + "\"");
		if (ret == RC_SUCCESS) {
			if (attachList != null && attachList.length > 0) {
	              for (var i = 0; i < attachList.length; i++)
	              {
	                    var taskAttachid = findTask.insertAttachment( attachList[i] );
	                    var attachRelation = new Object();
						attachRelation.smattachid = attachList[i]['href'];
						attachRelation.epattachid = taskAttachid;
						attachRelation.internalid = findTask['internalId'];
						attachRelation.createdby = lib.CaseExchangeConstants.CREATE_BY_SM();
						attachRelation.filenameinsm = attachList[i]['name'];
						attachRelation.filenameinep = attachList[i]['name'];
						attachRelation.smisInstanceId = task['intId'];//SMIS Instance id
						attachRelation.internalObject = task['object'];//SM Table name
						
						attachRelation.createdate = system.functions.tod();
						lib.CaseExchange_AttachRelationShip.createAttachRelationShip(attachRelation);
	              }
	        }
        }
	}

	// if synchronous, execute the task immediately
	if (!configItem.getConfigParameterValue("asynchronousProcessing") || task.action == 'Acknowledge') {
		var bootstrap = new (lib.smis_Bootstrap.getClass())(configItem);
		bootstrap.runnow(taskId);
	}
}