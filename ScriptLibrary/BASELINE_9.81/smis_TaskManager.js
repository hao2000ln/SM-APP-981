/******************************************************
 * Module Name: SMIS Task Manager
 * Function: provide functions to push, read tasks
 * Author: Tian, Shao-Qin
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/

var _ = lib.Underscore.require();


function getSMISLog() {
    var instance = lib.smis_ConfigurationManager.singletonInstance();
    if (instance) {
        return instance.getLogger();
    } else {
        return getLog("smis_TaskManager");
    }
}

function pushTask(task) {
    return pushTaskWithId(task);
}

function pushTaskWithId(task, busId) {
    var logger = getSMISLog();
    var newTask = new SCFile("SMISTaskQueue");
    newTask.intId = task.intId;
    newTask.integrationName = task.integrationName;

    var callRtn = new SCDatum();
    var nextNumber = new SCDatum();
    funcs.rtecall("getnumber", callRtn, nextNumber, "SMISTaskQueue");
    newTask.id = nextNumber.getText();

    // extra info
    newTask.action = task.action;
    newTask.object = task.object;
    newTask.internalId = task.internalId;
    newTask.externalId = task.externalId;
    newTask.requestData = task.requestData;
    newTask.direction = task.direction;
    newTask.retry = 0;
    newTask.expired = false;
    newTask.enqueueTime = new Date();

    if (!!!task.status) {
        newTask.status = lib.smis_Constants.TASK_STATUS_WAITING();
    } else {
        newTask.status = task.status;
    }
    newTask.data = [];
    if (busId !== undefined && busId !== null && busId !== "") {
        newTask.busId = busId;
    }

    lib.smis_CommonLib.convertStringToArray(lib.smis_CommonLib.toJSON(task.inRecord), newTask.data, 2048);

    var rc = newTask.doInsert();
    if (rc != RC_SUCCESS) {
        logger.error("smis_TaskManager", "Failed. Cann't push task " + newTask.getText());
        return null;
    }

    //Add by DeHong Wang Jan-15-2014
    //Add a log for task creation in task log.
    var taskStatus = lib.smis_Constants.TASK_STATUS_NEW();
    lib.smis_TaskLogManager.pushSMISTaskLog(newTask, taskStatus);
    return newTask.id;
}


function removeTaskWithId(intId, busId) {
    var findTask = new SCFile("SMISTaskQueue");
    var r = findTask.doSelect("intId = \"" + intId + "\" and busId = \"" + busId + "\"");

    while (r != RC_NO_MORE) {
        findTask.deleteAttachments();
        var rc = findTask.doDelete();
        if (rc != RC_SUCCESS) {
            throw new Error("Cann't remove task with busId " + busId + ", Detail: " + findTask.getText());
        }
        r = findTask.getNext();
    }
}

function removeTask(task) {
    var logger = getSMISLog();

    if (logger != null && logger.isDebugEnabled()) {
        logger.debug("smis_TaskManager", "removeTask: " + task.id);
    }

    var findTask = new SCFile("SMISTaskQueue");
    var f = findTask.doSelect("id = \"" + task.id + "\"");

    if (f == RC_SUCCESS) {
        findTask.deleteAttachments();
        var rc = findTask.doDelete();
        if (rc != RC_SUCCESS) {
            if (logger != null) {
                logger.error("smis_TaskManager", "Failed. Cann't remove task " + findTask.getText());
            }
        }
    }
}

function updateTask(task) {
    var logger = getSMISLog();

    if (logger != null && logger.isDebugEnabled()) {
        logger.debug("smis_TaskManager", "updateTask: " + task.id);
    }

    var findTask = new SCFile("SMISTaskQueue");
    var rc = findTask.doSelect("id = \"" + task.id + "\"");

    findTask.retry = task.retry;
    findTask.expired = task.expired;

    // info for task process info
    findTask.object = task.object;
    findTask.action = task.action;
    findTask.internalId = task.internalId;
    findTask.externalId = task.externalId;
    findTask.requestData = task.requestData;
    findTask.responseCode = task.responseCode;
    findTask.responseMsg = task.responseMsg;
    // findTask.data = task.data;

    if (!!!task.status) {
        findTask.status = lib.smis_Constants.TASK_STATUS_WAITING();
    } else {
        findTask.status = task.status;
    }

    rc = findTask.doUpdate();
    if (rc != RC_SUCCESS) {
        if (logger != null) {
            logger.error("smis_TaskManager", "Failed. Cann't update task " + findTask.getText());
        }
    }
}

function readTasks(intId, busId) {
    var logger = getSMISLog();

    if (logger.isDebugEnabled()) {
        logger.debug("smis_TaskManager", "readRecords");
    }

    var findTask = new SCFile("SMISTaskQueue", SCFILE_READONLY);
    //set sort by id, enqueueTimestamp asc
    findTask.setOrderBy(["enqueueTime", "id"], [SCFILE_ASC, SCFILE_ASC]);
    var query = 'expired <> true and intId = "' + intId + '"';
    if (busId !== undefined && busId !== null && busId !== "") {
        query += ' and busId = "' + busId + '"';
    }
    var f = findTask.doSelect(query);

    if (f != RC_SUCCESS) {
        if (logger.isDebugEnabled()) {
            logger.debug("smis_TaskManager", "No records found.");
        }
    }

    var list = [];
    var commLib = lib.smis_CommonLib;
    while (f == RC_SUCCESS) {
        var task = new(lib.smis_Task.getClass())(intId);
        var data = commLib.getStringFromArray(findTask.data);
        task.inRecord = commLib.fromJSON(data);
        task.id = findTask.id;
        task.direction = findTask.direction;
        task.retry = findTask.retry;
        task.expired = findTask.expired;
        task.enqueueTime = findTask.enqueueTime;
        task.integrationName = findTask.integrationName;

        // info for task process info
        task.object = findTask.object;
        task.action = findTask.action;
        task.internalId = findTask.internalId;
        task.externalId = findTask.externalId;
        task.requestData = findTask.requestData;
        task.responseCode = findTask.responseCode;
        task.responseMsg = findTask.responseMsg;

        task.status = findTask.status;

        list.push(task);

        f = findTask.getNext();
    }

    return list;
}

//read task on by one, get it by iteration, memory efficiency
function pipeTasks(intId) {

    var logger = getSMISLog();

    if (logger.isDebugEnabled()) {
        logger.debug("smis_TaskManager", "readRecords pipe");
    }

    var findTask = new SCFile("SMISTaskQueue", SCFILE_READONLY);
    //set sort by id, enqueueTimestamp asc
    findTask.setOrderBy(["enqueueTime", "id"], [SCFILE_ASC, SCFILE_ASC]);
    var f = findTask.doSelect("expired <> true and intId = \"" + intId + "\"");

    if (f != RC_SUCCESS) {
        if (logger.isDebugEnabled()) {
            logger.debug("smis_TaskManager", "No records found.");
        }
    }

    var commLib = lib.smis_CommonLib;

    var pipeObject = {
        next: function() {
            var r = findTask.getNext();
            if (r === RC_SUCCESS) {
                this.updateProps();
                return true;
            } else {
                return false;
            }
        },

        updateProps: function() {
            var data = commLib.getStringFromArray(findTask.data);
            this.intId = intId;
            this.inRecord = commLib.fromJSON(data);
            this.id = findTask.id;
            this.direction = findTask.direction;
            this.retry = findTask.retry;
            this.expired = findTask.expired;
            this.enqueueTime = findTask.enqueueTime;
            this.integrationName = findTask.integrationName;
            // info for task process info
            this.object = findTask.object;
            this.action = findTask.action;
            this.internalId = findTask.internalId;
            this.externalId = findTask.externalId;
            this.requestData = findTask.requestData;
            this.responseCode = findTask.responseCode;
            this.responseMsg = findTask.responseMsg;
            this.status = findTask.status;
        }
    };

    if (f === RC_SUCCESS) {
        pipeObject.updateProps();
        return pipeObject;
    } else {
        return null;
    }
}


function readFirstTaskToExecute(integrationName) {
    var logger = getSMISLog();

    if (logger.isDebugEnabled()) {
        logger.debug("smis_TaskManager", "readFirstTaskToExecute");
    }

    var findTask = new SCFile("SMISTaskQueue", SCFILE_READONLY);
    //set sort by id, enqueueTimestamp asc
    findTask.setOrderBy(["enqueueTime", "id"], [SCFILE_ASC, SCFILE_ASC]);
    var f = findTask.doSelect("expired <> true and integrationName = \"" + integrationName + "\" and status = " + lib.smis_Constants.TASK_STATUS_WAITING() + '"');

    if (f == RC_SUCCESS) {
        var commLib = lib.smis_CommonLib;
        var task = new(lib.smis_Task.getClass())(findTask.intId);
        var data = commLib.getStringFromArray(findTask.data);
        task.inRecord = commLib.fromJSON(data);
        task.id = findTask.id;
        task.direction = findTask.direction;
        task.retry = findTask.retry;
        task.expired = findTask.expired;
        task.enqueueTime = findTask.enqueueTime;
        task.integrationName = findTask.integrationName;

        // info for task process info
        task.object = findTask.object;
        task.action = findTask.action;
        task.internalId = findTask.internalId;
        task.externalId = findTask.externalId;
        task.requestData = findTask.requestData;
        task.responseCode = findTask.responseCode;
        task.responseMsg = findTask.responseMsg;

        task.status = findTask.status;
        return task;
    }

    return null;
}


function readTask(intId, taskId) {

    var findTask = new SCFile("SMISTaskQueue", SCFILE_READONLY);
    var f = findTask.doSelect("id = \"" + taskId + "\"");

    if (f == RC_SUCCESS) {
        intId = findTask.intId;
        var task = new(lib.smis_Task.getClass())(intId);
        var data = lib.smis_CommonLib.getStringFromArray(findTask.data);
        task.inRecord = lib.smis_CommonLib.fromJSON(data);
        task.id = findTask.id;
        task.direction = findTask.direction;
        task.retry = findTask.retry;
        task.expired = findTask.expired;
        task.enqueueTime = findTask.enqueueTime;
        task.integrationName = findTask.integrationName;

        // info for task process info
        task.object = findTask.object;
        task.action = findTask.action;
        task.internalId = findTask.internalId;
        task.externalId = findTask.externalId;
        task.requestData = findTask.requestData;
        task.responseCode = findTask.responseCode;
        task.responseMsg = findTask.responseMsg;

        task.status = findTask.status;

        return task;
    }

}

/**	
 *   get fields from task
 *
 *	@param {id} - task id
 *	@return - fields array
 */
function getTaskFields(id) {
    var task = readTask(null, id);

    var names = [];
    if (task != null) {
        names = _.keys(task.inRecord);
    }

    var fields = [];
    var captions = [];

    var fieldList = _.getFieldList(task.object);
    var fieldNames;
    var fieldCaptions;
    var index;
    if (fieldList) {
        fieldNames = fieldList[0].toArray();
        fieldCaptions = fieldList[1].toArray();
        _(names).each(function(name) {
            index = _.indexOf(fieldNames, name);
            if (index != -1) {
                fields.push(name);
                captions.push(fieldCaptions[index]);
            }
        });
    }
    return [fields, captions];
}

/**	
 *   get values from task
 *
 *	@param {id} - task id
 *   @param {fields} - fields list
 *	@return - value array
 */
function getTaskValues(id, fields) {
    var task = readTask(null, id);

    if (task != null) {
        var values = [];
        var i;
        var length = _.arrayLen(fields);
        for (i = 0; i < length; i++) {
            values.push(task.inRecord[fields[i]]);
        }
        return values;
    }

    return [];
}

/**	
 *   get values from task's record
 *
 *	@param {id} - task id
 *   @param {fields} - fields list
 *	@return - value array
 */
function getRecordValues(id, fields) {
    var task = readTask(null, id);

    if (task != null) {
        var values = [];
        var table = task.object;
        var record = new SCFile(table, SCFILE_READONLY);
        record.setFields(fields);
        var keyField = lib.CalendarDao.getUniqueKeyField(table);

        var sql = keyField + "=\"" + task.internalId + "\"";
        var ret = record.doSelect(sql);
        if (ret == RC_SUCCESS) {
            var i;
            var length = _.arrayLen(fields);
            for (i = 0; i < length; i++) {
                values.push(record[fields[i]]);
            }
            return values;
        }
    }

    return [];
}

/**	
 *   set values back to task
 *
 *   @param {fields} - fields list
 *   @param {values} - values list
 *	@param {ftask} - task file
 *	@return - value array
 */
function mergeTask(fields, values, ftask) {
    var task = readTask(null, ftask.id);
    if (task == null) {
        return;
    }
    var i;
    var length = _.arrayLen(fields);
    for (i = 0; i < length; i++) {
        task.inRecord[fields[i]] = values[i];
    }
    ftask.data = [];
    lib.smis_CommonLib.convertStringToArray(lib.smis_CommonLib.toJSON(task.inRecord), ftask.data, 2048);
}

/**	
 *   run task now
 *
 *	@param {id} - task id
 *	@return - void
 */
function taskRunNow(id) {
    var task = readTask(null, id);
    if (!!!task) {
        print("Task[" + id + "] not exists.");
        return;
    }

    var intId = task.intId;

    var config = lib.smis_ConfigurationManager.getInstanceConfig(intId);
    var bootstrap = new(lib.smis_Bootstrap.getClass())(config);
    bootstrap.runnow(id);
}

/*
 * check if there is any failed task with same internalId in the task queue
 * @param {intId} - int Id
 * @param {internalId} - internal Id
 * @return - true or false
 */
function existsFailedTasks(intId, internalId) {
    var task = new SCFile("SMISTaskQueue", SCFILE_READONLY);
    task.setFields(['id']);
    var ret = task.doSelect("intId=\"" + intId + "\" and " + "internalId=\"" + internalId + "\" and expired <> true and retry > 0");
    if (ret == RC_SUCCESS) {
        return true;
    }

    return false;
}

/*
 * get integration name by int id
 * @param {intId} - int Id
 * @return - string
 */
function getIntegrationName(intId) {
    var instance = new SCFile("SMISConfiguration", SCFILE_READONLY);
    instance.setFields(['name']);
    var ret = instance.doSelect("intId=\"" + intId + "\"");
    if (ret == RC_SUCCESS) {
        return instance.name;
    }

    return null;
}

/**
 * This function is to check if the start time and end time input by user is valid
 *
 * @param {startTime} - from date in ui
 * @param {endTime} - to date in ui
 * @return - error message
 * @type - String
 **/
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