/******************************************************
 * Module Name: SmartEmail Task processor
 * Function: Task Processor to process email
 * Author: Tian, ShaoQin
 * Version: 1.10
 * Creation Date: Mar, 2016
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var ReturnCode = lib.SmartEmailReturnCode.getReturnCode();

var isProcessRetryReturnCode = lib.SmartEmailReturnCode.isProcessRetryReturnCode;
var isIgnoredReturnCode = lib.SmartEmailReturnCode.isIgnoredReturnCode;

var ProcessorClass = Class.create({

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
     * check whether is refresh refreshToken task
     */
    isRefreshTokenAction: function(task) {
        return (task.action == lib.SmartEmailConstants.ACTION_REFRESH_REFRESHTOKEN());
    },

    processTask: function(task) {

        if (null == task.inRecord) {
            this.log.info("SmartEmailProcessor", "skipping task[" + task.id + "] due to this task is null.");
            return;
        }

        var operatorName = lib.SmartEmailConstants.EMAIL_AGENT_NAME();
        this.log.info("SmartEmailProcessor", "set user to " + operatorName);
        lib.SmartEmailUtil.setOperator(operatorName);

        this.failedList = {};

        //Add a log for task creation in task log.
        var taskStatus = lib.smis_Constants.TASK_STATUS_INPROGRESS();
        lib.smis_TaskLogManager.pushSMISTaskLog(task, taskStatus);

        //if not preProcess, ignore the current record, go to next record
        var processStatusCode;
        if (this.log.isDebugEnabled()) {
            this.log.debug("SmartEmailProcessor", "task status is : " + task.status);
            this.log.debug("SmartEmailProcessor", "task.responseCode is : " + task.responseCode);
        }

        var isRefreshTokenAction = this.isRefreshTokenAction(task);
        if (!isRefreshTokenAction) {
            // Add it for auto test. If 'isMailServer' is false, the code will not connect to the mail server.
            var isMailServer = task.inRecord.isMailServer;
            // If we can not get value from task, it means that we need to connect to the real mail server, set isMailServer to true.
            if (isMailServer == undefined || isMailServer == null) {
                isMailServer = true;
            }
            if (ReturnCode.CONNECTION_FAILURE == this.manager.initMailReceiver(isMailServer)) {
                processStatusCode = ReturnCode.CONNECTION_FAILURE;
            }

            // if the responseCode is 200, it means the preProcess & process have been processed successfully. It is no need to do them again.
            // if task.inRecord.progress is 0(failed in preProcess) or 1(failed in process), the preProcess and process should be processed again.
            // if task.inRecord.progress is 2(failed in postProcess) means that preProcess and process are processed successfully, no need to process again.
            if (this.log.isDebugEnabled()) {
                this.log.debug("SmartEmailProcessor", "task.inRecord.progress is : " + task.inRecord.progress);
            }
        }

        var needRetry;

        if (task.responseCode == ReturnCode.SUCCESS || task.inRecord.progress == 2) {
            //The preProcess and process is processed, but there is a retry for postProcess and we need the 'processStatusCode' from process.
            if (this.log.isDebugEnabled()) {
                this.log.debug("SmartEmailProcessor", "Retry for postProcess, processStatusCode is: " + task.responseCode);
            }
            processStatusCode = task.responseCode;
        } else {
            if (this.log.isDebugEnabled()) {
                this.log.debug("SmartEmailProcessor", "SmartEmailManager preProcess Start");
            }
            processStatusCode = this.manager.preProcess(task);
            if (this.log.isDebugEnabled()) {
                this.log.debug("SmartEmailProcessor", "SmartEmailManager preProcess End");
            }

            if (ReturnCode.SUCCESS == processStatusCode) {
                if (this.log.isDebugEnabled()) {
                    this.log.debug("SmartEmailProcessor", "processRequestTask including SmartEmailManager process Start");
                }
                processStatusCode = this.processRequestTask(task);
                if (this.log.isDebugEnabled()) {
                    this.log.debug("SmartEmailProcessor", "processRequestTask including SmartEmailManager process End");
                }
            }

            if (isProcessRetryReturnCode(processStatusCode)) {
                needRetry = this.processRetryTask(task);
                if (!needRetry) {
                    task.inRecord["progress"] = lib.SmartEmailConstants.SMARTEMAIL_PROCESS();
                    if (!isRefreshTokenAction) {
                        this.manager.errorHandling(processStatusCode, task);
                    }
                }
            } else if (isIgnoredReturnCode(processStatusCode)) {
                // do nothing when is ignored error codes
                if (this.log.isDebugEnabled()) {
                    this.log.debug("SmartEmailProcessor", "Error code is Ignored, error code is: " + processStatusCode);
                }
                this.manager.ignoreHandling(processStatusCode, task);
                task.status = lib.smis_Constants.TASK_STATUS_IGNORED();
                //lib.smis_TaskManager.removeTask(task);
            } else if (ReturnCode.SUCCESS != processStatusCode) {
                this.log.error("SmartEmailProcessor", "Failed to process it, error code is: " + processStatusCode);
                this.manager.errorHandling(processStatusCode, task);
                task.status = lib.smis_Constants.TASK_STATUS_ERROR();
                //lib.smis_TaskManager.removeTask(task);
            } else if (ReturnCode.SUCCESS == processStatusCode) {
                if (this.log.isDebugEnabled()) {
                    this.log.debug("SmartEmailProcessor", "Process it successfully.");
                }
                this.manager.successHandling(task);
            }
        }

        task.responseCode = processStatusCode;
        var postStatusCode = ReturnCode.SUCCESS;

        if (!isProcessRetryReturnCode(processStatusCode)) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("SmartEmailProcessor", "SmartEmailManager postProcess Start");
            }
            postStatusCode = this.manager.postProcess(task, processStatusCode);

            if (isProcessRetryReturnCode(postStatusCode)) {
                needRetry = this.processRetryTask(task);
                if (!needRetry) {
                    task.inRecord["progress"] = lib.SmartEmailConstants.SMARTEMAIL_POSTPROCESS();
                    this.manager.errorHandling(postStatusCode, task);
                } else {
                    task.responseCode = processStatusCode;
                    lib.smis_TaskManager.updateTask(task);
                }
            } else if (ReturnCode.SUCCESS != postStatusCode) {
                if (this.log.isDebugEnabled()) {
                    this.log.debug("SmartEmailProcessor", "Failed to do post processing, error code is: " + postStatusCode);
                }
                this.manager.errorHandling(postStatusCode, task);
                task.responseCode = postStatusCode;
                task.status = lib.smis_Constants.TASK_STATUS_ERROR();
                lib.smis_TaskManager.removeTask(task);
            } else {
                if (this.log.isDebugEnabled()) {
                    this.log.debug("SmartEmailProcessor", "post processing successfully, removeTask");
                }
                lib.smis_TaskManager.removeTask(task);
                if (ReturnCode.SUCCESS == processStatusCode) {
                    task.status = lib.smis_Constants.TASK_STATUS_SUCCESS();
                } else if (isIgnoredReturnCode(processStatusCode)) {
                    task.status = lib.smis_Constants.TASK_STATUS_IGNORED();
                } else {
                    task.status = lib.smis_Constants.TASK_STATUS_FAILED();
                }
            }
            if (this.log.isDebugEnabled()) {
                this.log.debug("SmartEmailProcessor", "SmartEmailManager postProcess End, postStatusCode is: " + postStatusCode);
            }
        }

        if (this.log.isDebugEnabled()) {
            this.log.debug("SmartEmailProcessor", "task.responseCode is : " + task.responseCode);
        }
        lib.smis_TaskLogManager.pushSMISTaskLog(task, task.status);

        this.manager.finalize(task);
    },

    /**
     * Process End User Request via Email.
     */
    processRequestTask: function(task) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("SmartEmailProcessor", "Process End User Request.");
        }

        var inRecord = task.inRecord;
        //not validate the field exist in record

        var smisContext = {};

        var isRefreshTokenAction = this.isRefreshTokenAction(task);

        if (!isRefreshTokenAction) {
            smisContext = lib.smis_CommonLib.task2Context(task, smisContext);
            smisContext["instanceName"] = this.configItem.name;
            smisContext["instanceId"] = this.configItem.intId;
            smisContext['token'] = inRecord['token'];
            smisContext['contact.info'] = task['contact.info'];
            task.smisContext = smisContext;

            var outRecord = this.mapping.getOutRecord(inRecord, smisContext, task.direction);
            task.outRecord = outRecord;

            this.mapping.setFieldValues(inRecord, outRecord, task.internalObject, smisContext, task.direction);
        }

        var processStatusCode = this.manager.process(task);

        if (ReturnCode.SUCCESS == processStatusCode) {
            task.status = lib.smis_Constants.TASK_STATUS_SUCCESS();
            //lib.smis_TaskManager.removeTask(task);
        } else {
            // if failed, add to failed list
            if (task.internalId) {
                this.failedList[task.internalId] = task.id;
            }
            if (task.externalId) {
                this.failedList[task.externalId] = task.id;
            }
        }

        // clean smisContext
        task.smisContext = null;
        smisContext = null;

        return processStatusCode;
    },

    /**
     * Process End User Request via Email.
     */
    processRetryTask: function(task) {
        task.retry++;
        if (this.log.isDebugEnabled()) {
            this.log.debug("processRetryTask", "The task has been tried " + task.retry + " times.");
        }
        if (task.retry >= this.configItem.maxRetryTime) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("processRetryTask", "The task has been tried " + task.retry + " times. Equal or greater than " + this.configItem.maxRetryTime + " times. Remove the task.");
            }
            task.expired = true;
            task.status = lib.smis_Constants.TASK_STATUS_FAILED();
            lib.smis_TaskManager.removeTask(task);
            return false;
        } else {
            task.expired = false;
            task.status = lib.smis_Constants.TASK_STATUS_WAITING();
            lib.smis_TaskManager.updateTask(task);
            return true;
        }
    }

});

function getClass() {
    return ProcessorClass;
}