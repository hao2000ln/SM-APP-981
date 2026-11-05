/******************************************************
 * Module Name: SMIS Controller
 * Function: provide default workflow control
 * Author: Tian, Shao-Qin
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var ControllerClass = Class.create({
    initialize: function(configItem, options) {
        
        this.configItem = configItem;
        this.options = options;
        this.log = this.configItem.getLogger();

        try {
            var managerName = this.configItem.mgrName;
            this.manager = new(lib[managerName].getClass())(this.configItem, options);

            this.mapping = new(lib.smis_FieldMappingProcessor.getClass())(this.configItem);
        } catch (e) {
            this.log.error("Controller", e);
        }
    },


    /**
     *	Default invoketion flow
     */
    startup: function() {

        try {
            this.beforeExcute();
            this.doExcute();
            this.afterExcute();

        } catch (e) {
            this.exceptionCatch(e);
        }

    },


    beforeExcute: function() {},

    doExcute: function() {
        if (this.log.isDebugEnabled()) {
            this.log.debug("Controller", "Controller: doExecute");
        }
        //throw "Test Error";

        // maintain an list including all failed object & internalId
        var failedList = {};

        try {
            this.manager.appendTasks();
        } catch (ex) {
            this.log.warn("Controller", "Error when appending tasks: " + ex);
        }
        
        var thread = null;
        if(this.options){
            thread = this.options['thread'];
        }
        var tasks = lib.smis_TaskManager.readTasks(this.configItem.intId, thread);
        if (tasks.length > 0) {
            var i;
            for (i = 0; i < tasks.length; i++) {

                var task = tasks[i];

                var ticketId = null;
                if (task.internalId) {
                    ticketId = task.internalId;
                } else if (task.externalId) {
                    ticketId = task.externalId;
                }

                if (task.status === lib.smis_Constants.TASK_STATUS_RUNNING()) {
                    this.log.info("Controller", "skipping task[" + task.id + "] due to this task is running.");
                    continue;
                }

                // skip the task if previous task with same ticket failed.
                if (ticketId && (failedList[task.internalId] || failedList[task.externalId])) {
                    this.log.info("Controller", "skipping task[" + task.id + "] due to previous task with same record [" + ticketId + "] failed.");
                    continue;
                }

                //set the task status to running
                task.status = lib.smis_Constants.TASK_STATUS_RUNNING();
                lib.smis_TaskManager.updateTask(task);

                //Add By DeHong Wang Jan-15-2014
                //Add a log for task creation in task log.
                var taskStatus = lib.smis_Constants.TASK_STATUS_INPROGRESS();
                lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
                //Add End

                //if not preProcess, ignore the current record, go to next record
                if (!this.manager.preProcess(task)) {
                    lib.smis_TaskManager.removeTask(task);
                    this.log.warn("Controller", "manager preProcess failed. Ignore this record.");
                    continue;
                }

                // process task
                var success = this.processTask(task);

                if (success) {
                    //Add By DeHong Wang Jan-15-2014
                    taskStatus = lib.smis_Constants.TASK_STATUS_SUCCESS();
                    lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
                    //Add End

                    lib.smis_TaskManager.removeTask(task);

                } else {
                    // if failed, add to failed list
                    if (task.internalId) {
                        failedList[task.internalId] = task.id;
                    }
                    if (task.externalId) {
                        failedList[task.externalId] = task.id;
                    }

                    task.retry++;
                    if (task.retry >= this.configItem.maxRetryTime) {
                        task.expired = true;
                        //Add By DeHong Wang Jan-17-2014
                        taskStatus = lib.smis_Constants.TASK_STATUS_FAILED();
                        //Add End
                    } else {
                        //Add By DeHong Wang Jan-15-2014
                        taskStatus = lib.smis_Constants.TASK_STATUS_ERROR();
                        //Add End
                    }
                    //set the task status to waiting
                    task.status = lib.smis_Constants.TASK_STATUS_WAITING();
                    lib.smis_TaskManager.updateTask(task);

                    //Add By DeHong Wang Jan-15-2014
                    //Add a log for task creation in task log.
                    lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
                    //Add End
                }

                this.manager.postProcess(task);
            }
        }
        this.manager.finalize();
    },

    /*
     * process task for schedule, runnow, realtime
     */
    processTask: function(task) {
        var inRecord = task.inRecord;
        //not validate the field exist in record

        var destObject = this.manager.getDestObj();
        var smisContext = {};
        smisContext = lib.smis_CommonLib.task2Context(task, smisContext);
        smisContext["instanceName"] = this.configItem.name;
        smisContext["instanceId"] = this.configItem.intId;
        task.smisContext = smisContext;
        task.destObject = destObject;

        var outRecord = this.mapping.getOutRecord(inRecord, smisContext, task.direction);
        task.outRecord = outRecord;

        this.mapping.setFieldValues(inRecord, outRecord, destObject, smisContext, task.direction);

        // update task action in case action is customized
        task.action = smisContext.action;
        task.externalReferences = smisContext.externalReferences;

        var success = this.manager.process(task);

        return success;
    },

    /**
     *	Run Now invoketion flow
     */
    runnow: function(taskId) {
        var task = lib.smis_TaskManager.readTask(this.configItem.intId, taskId);

        if (!!!task) {
            print("Task[" + taskId + "] not exists.");
            return task;
        }

        var existsFailedTasks = lib.smis_TaskManager.existsFailedTasks(task.intId, task.internalId);
        if (existsFailedTasks == true) {
            print("There is failed tasks of this record in the task queue, please fix them first.");

            if (task.status == lib.smis_Constants.TASK_STATUS_RUNNING()) {
                task.status = lib.smis_Constants.TASK_STATUS_WAITING();
                lib.smis_TaskManager.updateTask(task);
            }
            return task;
        }

        //Add By DeHong Wang Jan-27-2014
        //Add a log for task creation in task log.
        var taskStatus = lib.smis_Constants.TASK_STATUS_INPROGRESS();
        lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
        //Add End

        var ret = true; //this.mapping.validate(inRecord, task.direction);
        if (ret) {
            var inRecord = task.inRecord;
            var outRecord = this.mapping.getOutRecord(inRecord, task.direction);
            task.outRecord = outRecord;
            if (this.manager.preProcess(task)) {
                var success = this.processTask(task);
                
                if (success) {
                    //Add By DeHong Wang Jan-27-2014
                    taskStatus = lib.smis_Constants.TASK_STATUS_SUCCESS();
                    lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
                    //Add End

                    lib.smis_TaskManager.removeTask(task);
                } else {
                    task.retry++;
                    if (task.retry >= this.configItem.maxRetryTime) {
                        task.expired = true;
                        //Add By DeHong Wang Jan-17-2014
                        taskStatus = lib.smis_Constants.TASK_STATUS_FAILED();
                        //Add End
                    } else {
                        //Add By DeHong Wang Jan-15-2014
                        taskStatus = lib.smis_Constants.TASK_STATUS_ERROR();
                        //Add End
                    }
                    //set the task status to waiting
                    task.status = lib.smis_Constants.TASK_STATUS_WAITING();
                    lib.smis_TaskManager.updateTask(task);

                    //Add By DeHong Wang Jan-27-2014
                    lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
                    //Add End
                }

                this.manager.postProcess(task);
            } else {
                //Add By DeHong Wang Jan-27-2014
                taskStatus = lib.smis_Constants.TASK_STATUS_FAILED();
                lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);
                //Add End

                lib.smis_TaskManager.removeTask(task);
                this.log.warn("Controller", "manager preProcess failed. Ignore this record.");
            }
        }
        this.manager.finalize();

        return task;
    },

    /**
     *	Run Now invoketion flow
     */
    runrealtime: function(bid) {
        var task = this.manager.getRealTimeTask(bid);

        var success = false;
        var ret = true; //this.mapping.validate(inRecord, task.direction);
        if (ret) {
            if (this.manager.preProcess(task)) {
                success = this.processTask(task);
                this.manager.postProcess(task);
            } else {
                this.log.warn("Controller", "manager preProcess failed. Ignore this record.");
            }
        }
        this.manager.finalize();

        return success;
    },

    afterExcute: function() {},

    exceptionCatch: function(e) {}
});


function getClass() {
    return ControllerClass;
}