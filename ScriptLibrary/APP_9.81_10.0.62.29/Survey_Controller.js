/******************************************************
 * Module Name: Survey integration Controller
 * Function: contains basic work flow for all survey
 * Author: Tian, Shao-Qin
 * Version: 1.00
 * Creation Date: Mar., 2013
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var ControllerClass = Class.create(lib.smis_DefaultController.getClass(), {

    initialize: function(configItem) {

        this.configItem = configItem;
        this.log = this.configItem.getLogger();

        try {
            var managerName = this.configItem.mgrName;
            eval("this.manager = new (lib." + managerName + ".getClass())(this.configItem);");
        } catch (e) {
            this.log.error("Survey_Controller", e);
        }
    },


    doExcute: function() {
        this.log.debug("Survey_Controller", "Survey Controller: doExecute");

        var task = lib.smis_TaskManager.pipeTasks(this.configItem.intId);
        var hasTask = (task === null) ? false : true;
        while (hasTask) {
            //if not preProcess, ignore the current record, go to next record
            if (!this.manager.preProcess(task)) {
                lib.smis_TaskManager.removeTask(task);
                this.log.warn("Survey_Controller", "manager preProcess failed. Ignore this record.");
                continue;
            }

            var success = this.manager.process(task);
            if (success) {
                lib.smis_TaskManager.removeTask(task);
            } else {
                task.retry++;
                if (task.retry >= this.configItem.maxRetryTime) {
                    task.expired = true;
                }

                lib.smis_TaskManager.updateTask(task);
            }
            this.manager.postProcess(task);

            hasTask = task.next();
        }
        this.manager.finalize();
    },

    runnow: function(taskId) {
        var task = lib.smis_TaskManager.readTask(this.configItem.intId, taskId);
        //if not preProcess, ignore the current record, go to next record
        if (!this.manager.preProcess(task)) {
            lib.smis_TaskManager.removeTask(task);
            this.log.warn("Survey_Controller", "manager preProcess failed. Ignore this record.");
        } else {
            var success = this.manager.process(task);
            if (success) {
                lib.smis_TaskManager.removeTask(task);
            } else {
                task.retry++;
                if (task.retry >= this.configItem.maxRetryTime) {
                    task.expired = true;
                }

                lib.smis_TaskManager.updateTask(task);
            }
            this.manager.postProcess(task);
        }
        this.manager.finalize();
    }

});


function getClass() {
    return ControllerClass;
}