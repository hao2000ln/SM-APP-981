/******************************************************
 * Module Name: SmartEmail Controller
 * Function: provide default workflow control
 * Author: Tian, ShaoQin
 * Version: 1.10
 * Creation Date: Mar, 2016
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var ReturnCode = lib.SmartEmailReturnCode.getReturnCode();

var ControllerClass = Class.create({

    initialize: function(configItem) {

        this.configItem = configItem;

        this.log = this.configItem.getLogger();

        try {
            var managerName = this.configItem.mgrName;
            this.manager = new(lib[managerName].getClass())(this.configItem);

            this.mapping = new(lib.smis_FieldMappingProcessor.getClass())(this.configItem);
        } catch (e) {
            this.log.error("Controller", e);
        }
    },

    /**
     * Default invoketion flow
     */
    startup: function() {
        this.log.info("SmartEmailController", "startup");

        var operatorName = lib.SmartEmailConstants.EMAIL_AGENT_NAME();
        this.log.info("SmartEmailController", "set user to " + operatorName);
        lib.SmartEmailUtil.setOperator(operatorName);

        // get email Ids
        var isMailServer = true;
        var returnCode = this.manager.readEmailIDs(isMailServer);
        if (ReturnCode.SUCCESS != returnCode) {
            this.manager.errorHandling(returnCode, null);
        }

        // append additional tasks
        try {
            this.manager.appendTasks();
        } catch (ex) {
            this.log.warn("SmartEmailController", "Error when appending tasks: " + ex);
        }

    },

    // Define runnow function for SMIS Controller mechanism but do nothing
    runnow: function(taskId) {}

});

function getClass() {
    return ControllerClass;
}


function processSmartEmail() {
    this.log = new(lib.smis_Logger.getClass())();
    // set Service Desk permissions
    //lib.SmartEmailSecurityUtils.setGlobalPermission(vars.$G_sm_environment);
    // set Incident permissions
    // fix hybrid pd reopen issue
    lib.SmartEmailSecurityUtils.setGlobalPermission(vars.$G_pm_environment);

    //var oriOperator = system.functions.operator();
    var task = lib.SmartEmailTaskManager.getNextTask();
    if (task == null) {
        this.log.info("SmartEmailController", "No task in queue, nothing to process");
        return;
    }
    this.log.info("SmartEmailController", "task.id: " + task.id + ", task.intId: " + task.intId);
    var configItem = lib.smis_ConfigurationManager.getInstanceConfig(task.intId);
    if (configItem != null) {
        var processor = new(lib.SmartEmailProcessor.getClass())(configItem);
        processor.processTask(task);
    } else {
        // instance not exist any more, remove it
        this.log.info("SmartEmailController", "remove the task since the instance can't be found.");
        lib.smis_TaskManager.removeTask(task);
    }

    //print("reset user to original: " + oriOperator);
    //lib.reportExport.setOperator( oriOperator );
    // update task's status
    // task.status = lib.smis_Constants.TASK_STATUS_RUNNING();
    // lib.smis_TaskManager.updateTask(task);
}