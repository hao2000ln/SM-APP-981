/******************************************************
 * Module Name: SMIS TaskLog Manager
 * Function: provide functions to push, query task log
 * Author: DeHong Wang
 * Version: 1.00
 * Creation Date: Jan, 2014
 *******************************************************/

function checkQueryParamter(startTime, endTime) {
    var retMsg = null;
    var logStartTime = funcs.val(startTime, 3);
    var logEndTime = funcs.val(endTime, 3);

    if (logStartTime == null && startTime != null) {
        retMsg = funcs.scmsg(55, "smis", ["From"]);
    } else if (logEndTime == null && endTime != null) {
        retMsg = funcs.scmsg(55, "smis", ["To"]);
    }

    return retMsg;
}

/**	
 *  This function is to combine query filter for SMIS Task log.
 *
 *	@param {intID} - Integration Instance ID
 *  @param {startTime} - Task create time.
 *  @param {endTime} - Task create time.
 *  @param {internalTableName} - Internal table name
 *  @param {internalID} - Internal ID
 *  @param {externalID} - External ID
 *  @param {taskID} - Task ID
 *  @param {direction} - Direction: Inbound or Outbound
 *  @param {status} - Task execution status.
 *	@returns {String} query filter for SMIS Task Log
 */
function getQueryFilter(intID, startTime, internalTableName, endTime, internalID, externalID, taskID, direction, status) {
    var sqlQuery = "intId=" + intID;
    var logStartTime = funcs.val(startTime, 3);
    var logEndTime = funcs.val(endTime, 3);
    var logInternalTableName = funcs.val(internalTableName, 2);
    var logInternalID = funcs.val(internalID, 2);
    var logExternalID = funcs.val(externalID, 2);
    var logTaskID = funcs.val(taskID, 2);
    var logDirection = funcs.val(direction, 2);
    var logStatus = funcs.val(status, 2);

    if (!lib.smis_CommonLib.isEmpty(logInternalID)) {
        sqlQuery += " and internal.id=\"" + logInternalID + "\"";
    }

    if (!lib.smis_CommonLib.isEmpty(logStartTime)) {
        sqlQuery += " and log.time >= '" + startTime + "'";
    }

    if (!lib.smis_CommonLib.isEmpty(logEndTime)) {
        sqlQuery += " and log.time <= '" + endTime + "'";
    }

    if (!lib.smis_CommonLib.isEmpty(logInternalTableName)) {
        sqlQuery += " and internal.table.name=\"" + logInternalTableName + "\"";
    }

    if (!lib.smis_CommonLib.isEmpty(logExternalID)) {
        sqlQuery += " and external.id=\"" + logExternalID + "\"";
    }

    if (!lib.smis_CommonLib.isEmpty(logTaskID)) {
        sqlQuery += " and task.id=\"" + logTaskID + "\"";
    }

    if (!lib.smis_CommonLib.isEmpty(logDirection) && logDirection != "BOTH") {
        sqlQuery += " and direction=\"" + logDirection + "\"";
    }

    if (!lib.smis_CommonLib.isEmpty(logStatus)) {
        sqlQuery += " and status=\"" + logStatus + "\"";
    }

    return sqlQuery;
}

/**	
 *  This function is to add a message in SMIS Task log.
 *  If it's first time to push log, create a new record of Task Log.
 *  If attachment log is not empty, add them in attachment array.
 *
 *	@param {taskEntity} - Task Object
 *  @param {status} - Task Status. Refer to smis_Constants.
 *	@returns {Number} Task Log ID or null
 */
function pushSMISTaskLog(taskEntity, status) {
    var statusVal = lib.smis_Constants.getTaskStatusVal(status);

    var logger = new(lib.smis_Logger.getClass())();
    var taskID = taskEntity.id;

    if (taskEntity == null) {
        logger.warn("smis_TaskLogManager", "Failed. Task Object is null! Can not push any Task Log.");
        return null;
    }

    if (status == lib.smis_Constants.TASK_STATUS_ERROR() && taskEntity.responseCode == RC_CANT_HAVE) {
        status = lib.smis_Constants.TASK_STATUS_LOCKEDERROR();
    }

    var message = getTaskMessageByStatus(taskEntity, status);

    var taskLogEntity = findTaskLog(taskID);
    var isTaskLogExisting;

    if (taskLogEntity == null) {
        taskLogEntity = new SCFile("SMISTaskLog");
        var callRtn = new SCDatum();
        var nextNumber = new SCDatum();
        funcs.rtecall("getnumber", callRtn, nextNumber, "SMISTaskLog");

        taskLogEntity.id = nextNumber;
        taskLogEntity.message = [];
        isTaskLogExisting = false;
    } else {

        isTaskLogExisting = true;
    }

    //To reset data for array fields.
    taskLogEntity.request_data = [];
    taskLogEntity.response_message = [];
    taskLogEntity.task_data = [];

    taskLogEntity.intId = taskEntity.intId;
    taskLogEntity.task_id = taskEntity.id;
    taskLogEntity.integration_name = taskEntity.integrationName;
    taskLogEntity.direction = taskEntity.direction;
    taskLogEntity.task_create_time = taskEntity.enqueueTime;
    taskLogEntity.internal_table_name = taskEntity.object;
    taskLogEntity.action = taskEntity.action;
    taskLogEntity.internal_id = taskEntity.internalId;
    taskLogEntity.external_id = taskEntity.externalId;
    taskLogEntity.response_code = taskEntity.responseCode;

    lib.smis_CommonLib.convertStringToArray(taskEntity.requestData, taskLogEntity.request_data, 2048);
    lib.smis_CommonLib.convertStringToArray(taskEntity.responseMsg, taskLogEntity.response_message, 2048);
    lib.smis_CommonLib.convertStringToArray(lib.smis_CommonLib.toJSON(taskEntity.inRecord), taskLogEntity.task_data, 2048);

    taskLogEntity.log_time = new Date();
    taskLogEntity.update_by = funcs.operator();

    // taskLogEntity.status = status;
    taskLogEntity.status = statusVal;
    lib.smis_CommonLib.convertStringToArray(message, taskLogEntity.message, 2048);

    //Add attachment log in attachment array in Task Log
    if (taskEntity.attachLogs != undefined && taskEntity.attachLogs != null) {
        var i;
        for (i = 0; i < taskEntity.attachLogs.length; i++) {
            taskLogEntity.attachment[i].date = taskEntity.attachLogs[i].date;
            taskLogEntity.attachment[i].filename = taskEntity.attachLogs[i].filename;
            taskLogEntity.attachment[i].logaction = taskEntity.attachLogs[i].action;
            taskLogEntity.attachment[i].result = taskEntity.attachLogs[i].result;
            taskLogEntity.attachment[i].size = taskEntity.attachLogs[i].len;
            taskLogEntity.attachment[i].failurereason = taskEntity.attachLogs[i].reason;
        }
    }

    var rc;

    if (isTaskLogExisting) {
        rc = taskLogEntity.doSave();
    } else {
        rc = taskLogEntity.doInsert();
    }

    if (rc == RC_SUCCESS) {
        if (logger.isDebugEnabled()) {
            logger.debug("smis_TaskLogManager", "Success to push task log " + taskLogEntity.getText());
        }

        return taskLogEntity.id;
    } else {
        logger.warn("smis_TaskLogManager", "Failed. Cann't push task log " + taskLogEntity.getText());
        return null;
    }
}

/**	
 *  This function is to search whether the task log has been created for a task.
 *
 *	@param {taskID} - Task ID of a task
 *	@returns {SCFile} SCFile SMISTaskLog
 */
function findTaskLog(taskID) {
    var taskLogEntity = new SCFile("SMISTaskLog");
    var findTaskLogResult = taskLogEntity.doSelect("task.id=\"" + taskID + "\"");

    if (findTaskLogResult == RC_SUCCESS) {
        return taskLogEntity;
    } else {
        return null;
    }
}

/**	
 *   This function is to combine message from task object by task status
 *
 *	@param {taskEntity} - task object
 *	@param {status} - task status
 *	@returns {String} combined message
 */
function getTaskMessageByStatus(taskEntity, status) {
    var message = funcs.str(new Date()) + " " + vars['$lo.time.zone'] + " ";
    if (status == lib.smis_Constants.TASK_STATUS_NEW()) {
        message += "Created Task to process: " + taskEntity.id;
    } else if (status == lib.smis_Constants.TASK_STATUS_INPROGRESS()) {
        message += "Picked up Task " + taskEntity.id + " for processing";
    } else if (status == lib.smis_Constants.TASK_STATUS_ERROR() ||
        status == lib.smis_Constants.TASK_STATUS_LOCKEDERROR() ||
        status == lib.smis_Constants.TASK_STATUS_FAILED()) {
        message += "Error processing Task " + taskEntity.id + " for record ";

        if (lib.CaseExchange_CommonLib.isInbound(taskEntity.direction)) {
            //Inbound
            message += "External ID " + taskEntity.externalId + "; ";
        } else if (lib.CaseExchange_CommonLib.isOutbound(taskEntity.direction)) {
            //Outbound
            message += "Internal ID " + taskEntity.internalId + "; ";
        }
        message += " Error Message: " + (taskEntity.responseMsg || "<Empty>");

    } else if (status == lib.smis_Constants.TASK_STATUS_SUCCESS()) {
        message += "Task " + taskEntity.id + " successfully processed for record ";
        message += "External ID " + (taskEntity.externalId || "<Empty>") + " and Internal record " + (taskEntity.internalId || "<Empty>") + ".";
        message += " <Event " + taskEntity.action + ">";

        //Some post scripts maybe failed and put error message in task responseMsg field.
        if (!lib.smis_CommonLib.isEmpty(taskEntity.responseMsg)) {
            message += " With error message: " + taskEntity.responseMsg;
        }
    } else if (status == lib.smis_Constants.TASK_STATUS_IGNORED()) {
        message += "Task " + taskEntity.id + " ignored.";
        message += " Ignore Message: " + (taskEntity.responseMsg || "<Empty>");
    }

    return message;
}