
var instanceId = "1";

function testScheduleJob() {
	lib.smis_SecurityUtilities.setupGlobals();
	var config = lib.smis_ConfigurationManager.getInstanceConfig(instanceId);
	
	if (config != null) {
		var controller = new (lib.SmartEmailController.getClass())(config);
		controller.startup();
	}
}


function testEmailProcessor(taskId) {
//	lib.smis_SecurityUtilities.setupGlobals();
//	var task = lib.SmartEmailTaskManager.getNextTask();
	var task = lib.smis_TaskManager.readTask(instanceId, taskId);
	if (task == null) {
		print("task is null, return");
		return;
	}
	print("task.id: " + task.id + ", task.intId: " + task.intId);
	var configItem = lib.smis_ConfigurationManager.getInstanceConfig(task.intId);
	var processor = new (lib.SmartEmailProcessor.getClass())(configItem);
	processor.processTask(task);
	
//	update task's status
//	task.status = lib.smis_Constants.TASK_STATUS_RUNNING();
//	lib.smis_TaskManager.updateTask(task);
}


testScheduleJob();
testEmailProcessor("13");

//removeTasks();

function removeTasks(){
    var findTask = new SCFile ( "SMISTaskQueue" );
//    var ret = findTask.doSelect( "expired <> true and intId = \"" + instanceId + "\"" );
 	var ret = findTask.doSelect( "expired <> true" );
    while (ret == RC_SUCCESS) {
    	print("task id: " + findTask.id);
		ret = findTask.getNext();
		findTask.doDelete();
	}
	print("delete end.");
}
