/**
 * See {@link module:c}
 * 
 * @private
 * @method
 */
var $ = lib.c.$;

var TASKPLANTABLE = "changePlan";
var TICKETMODELFIELD = "modelId";
var PARENTTICKETFIELD = "parentTicket";

//task initial status
var WAITING = "0";
var READY = "1";
var WITHDRAWN = "31";

var TPUTILITY = lib.TaskPlannerUtilities;
var TPHELPER = lib.TaskPlannerHelper;

var FILENAME = funcs.filename;

var CONTEXT_INPUT_TYPE_PARENTRECORD = "2";
var CONTEXT_INPUT_TYPE_USERSELECTION = "1";
var CONTEXT_INPUT_TYPE_CONTEXT = "3";

var TASK_CONTEXT_FILENAME = "ticketContextConfig";


/**
 *  This function is to print log info.
 *
 *  @param {String} info - Message info to be printed.
 *  
 */
function logInfo(info) {
    var log = getLog("TaskPlannerService");
    if (log.isInfoEnabled()) {
        log.info(info);
    }
}

function mergeArray(bigArrayID, bigArrayType, smallArray, method) {
    var len = smallArray.length();
    var i;
    var j;
    for (i = 0; i < len; i++) {
        var type = smallArray[i][method + "Type"];
        var id = smallArray[i][method + "Id"];
        var len1 = bigArrayID.length;
        var t = true;
        for (j = 0; j < len1; j++) {
            if (type === bigArrayType[j] && id === bigArrayID[j]) {
                t = false;
                break;
            }
        }
        if (t) {
            bigArrayID.push(id);
            bigArrayType.push(type);
        }
    }
}

function getUserOption(parentRecord, option_name) {
    var fileName = FILENAME(parentRecord);
    var uniqueS = TPUTILITY.getUniqueKey(fileName);
    var ticketId = parentRecord[uniqueS];
    var userOptionFile = new SCFile("userOption");
    var sql = "Ticket.ID=\"" + ticketId + "\" and Option.Name=\"" + option_name + "\"";
    if (userOptionFile.doSelect(sql) === RC_SUCCESS) {
        return userOptionFile;
    }

    return null;
}

function addUserOptions(record) {
    if (record.svcCartId == null) {
        return;
    }

    var fsvcCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
    const query = `cartId=${record.svcCartId} and (action.id="${record.number}" or null(action.id))`;
    var findCartId = fsvcCartItem.doSelect(query);
    if (findCartId == RC_SUCCESS) {
        if (fsvcCartItem.options != null) {
            fsvcCartItem["action.id"] = record.number;
            lib.UserOption.syncSvcCartItemToUserOption(fsvcCartItem);
        }
    }
}


/**
 *  Get task plan information from changePlan table.
 *
 *  History:
 *  2014-03-01, wang,xun(xunw@hp.com) - function created
 *
 *  @fileid, number or modelid of change plan, for example, RM10001, C100032 etc
 *  @filename, parent filename, such as 'request', 'requestModel'.
 *  @taskid, task plan data id.
 *  @method, 'inputs' or 'outputs'.
 *
 *  @returns array field inputs or outputs which included task plan data.
 */
function getTaskPlanData(fileid, filename, taskid, method) {
    var changePlan = new SCFile("changePlan", SCFILE_READONLY);
    var sql = "fileId=\"" + fileid + "\" and fileName=\"" + filename + "\"";
    if (changePlan.doSelect(sql) === RC_SUCCESS) {
        var tasks = changePlan.tasks;
        var len = tasks.length();
        var i;
        for (i = 0; i < len; i++) {
            if (taskid === tasks[i].taskNumber) {
                if (method === "input") {
                    return lib.ArrayUtil.toJsArray(tasks[i].inputs);
                } else if (method === "output") {
                    return lib.ArrayUtil.toJsArray(tasks[i].outputs);
                }
            }
        }
    }

    return null;
}

function parse_field_value(file, fieldname) {
    var fvalue = file[fieldname];
    return fvalue;
}

function getFieldCaption(fieldName, parentFile) {
    var fileName = FILENAME(parentFile);
    var sql = "name=\"" + fileName + "\"";
    var datafilesc = $.cachedSelect("datadict", sql);

    var ret = fieldName;
    if (datafilesc != null) {
        var fieldlist = datafilesc.fields;
        var captionlist = datafilesc.captions;
        var len = fieldlist.length();
        var i;
        for (i = 0; i < len; i++) {
            if (fieldlist[i] === fieldName) {
                ret = captionlist[i];
                break;
            }
        }
    }
    return ret;
}

function getParentFile(input) {
    var fileName = FILENAME(input);
    var sql1 = "parentFileName=\"" + fileName + "\"";

    var map = $.cachedSelect("taskPlannerMapping", sql1);

    if (map != null) {
        return input;
    }

    var sql2 = "taskFileName=\"" + fileName + "\"";
    map = $.cachedSelect("taskPlannerMapping", sql2);
    if (map != null) {
        var parentTicketID = input.parentTicket;
        var parentTicketFilename = map.parentFileName;
        //var parent = new SCFile(parentTicketFilename);        
        var uniqueS = TPUTILITY.getUniqueKey(parentTicketFilename);
        var sql3 = uniqueS + "=\"" + parentTicketID + "\"";
        var parent = $.cachedSelect(parentTicketFilename, sql3);
        if (parent != null) {
            return parent;
        }
    }
    return null;
}

/**
 *  mock function to save information to user selection .
 *
 *  History:
 *  2014-03-07, wang,xun(xunw@hp.com)
 *
 */
function saveUserSelection(selectionID, selectionValue, fileName, fileId) {
    print("here to save userselection");
}

/**
 *  mock function to save information to parent reord .
 *
 *  History:
 *  2014-03-07, wang,xun(xunw@hp.com)
 *
 */
function saveParentFile(fieldName, fieldValue, fileName, fileId) {
    print("here to save parent file field value");
}


/**
 *  function to save information to ticket Context.
 *
 *  @id, ticket Context config record id
 *  @value, ticket Context config record id's value which want to save to ticketContextConfig table
 *  @fileName, ticket Context config record fileName field
 *  @fileId, ticket Context config record fileId field
 *
 *  History:
 *  2014-03-07, wang,xun(xunw@hp.com)
 */
function saveContext(id, value, fileName, fileId) {
    var config = new SCFile(TASK_CONTEXT_FILENAME);
    var sql = "fileName=\"" + fileName + "\" and id=\"" + id + "\" and fileId=\"" + fileId + "\"";
    if (config.doSelect(sql) === RC_SUCCESS) {
        config.value = value;
        config.doUpdate();
    }
    return;
}

function initResult() {
    var RESULTXML = "<result></result>";
    var result = new XML();
    result.setContent(RESULTXML);
    result.setValue(0);
    return result;
}

function isSame(newrecord, oldrecord) {
    var compareFieldList = [];
    compareFieldList.push("id");
    compareFieldList.push("label");
    compareFieldList.push("valueList");
    compareFieldList.push("displayList");
    var i;
    for (i = 0; i < compareFieldList.length; i++) {
        var newf = newrecord[compareFieldList[i]];
        var oldf = oldrecord[compareFieldList[i]];
        if (!funcs.same(funcs.nullsub(newf, ""), funcs.nullsub(oldf, ""))) {
            return false;
        }
    }
    return true;
}

function addMessageRecord(class_str, msgid_str, msg_str, language) {
    var message = new SCFile("scmessage");
    var sql = "syslanguage=\"" + language + "\" and class=\"" + class_str + "\" and message.id=\"" + msgid_str + "\"";
    var ret = message.doSelect(sql);
    //print("the finding ret:" + RCtoString(ret));
    //print("the found msg:" + message);
    //print("the found msg.message:" + message.message);
    //print("the found msg.message_id:" + message.message_id);
    if (ret !== RC_SUCCESS || (message.message === null && message.message_id === null)) { // or the found message is null, this might be caused by the RTE cache bug
        message.syslanguage = language;
        message._class = class_str;
        message.message_id = msgid_str;
        message.message = msg_str;
        message.doInsert();
    } else {
        // do nothing
    }
}

function isFieldExistInPreDefined(fileName, categoryName, fieldName) {
    var exist = false;
    var preDefined = new SCFile("taskPlannerFieldsDef", SCFILE_READONLY);
    var sql1 = "fileName=\"" + fileName + "\"";
    var sql2 = "fileName=\"" + fileName + "\" and taskCategoryName=\"" + categoryName + "\"";
    if (preDefined.doSelect(sql1) === RC_SUCCESS) {
        var i;
        var iLoopTimes = preDefined.fields.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (fieldName === preDefined.fields[i].name) {
                exist = true;
                break;
            }
        }
    }
    if (!exist) {
        if (preDefined.doSelect(sql2) === RC_SUCCESS) {
            var j;
            var jLoopTimes = preDefined.fields.length();
            for (j = 0; j < jLoopTimes; j++) {
                if (fieldName === preDefined.fields[j].name) {
                    exist = true;
                    break;
                }
            }
        }
    }
    return exist;
}

function ticketExist(ticket) {
    var rt = false;
    if (funcs._null(ticket)) {
        return rt;
    }
    var fileName = FILENAME(ticket);
    var key = TPUTILITY.getUniqueKey(fileName);
    if ("" == key) {
        logInfo("Can not find the UniqueKey of table " + fileName);
        return;
    }
    var ticketid = ticket[key];
    var sql = String(key) + "=\"" + ticketid + "\"";
    //var smRecord=$.cachedSelect(fileName, sql); 
    var smRecord = $(fileName, SCFILE_READONLY).setFields([key]).select(sql).uniqueResult();
    if (smRecord != null) {
        rt = true;
    }
    return rt;
}

/**
 * To check whether the file is a registered modle file name in Task Planner Mapping (taskPlannerMapping).
 */
function isRegisteredModelFileName(fileName) {
    var sql = "modelFileName=\"" + fileName + "\"";
    var rec = $.cachedSelect("taskPlannerMapping", sql);
    if (rec != null) {
        return true;
    }
    return false;
}

/**
 * Additional Properties is add from Change without changemodel
 */
function isFromModel(modelFileName, modelId, fileId) {
    var sql = 'fileName="' + modelFileName + '" and fileId="' + modelId + '" and id="' + fileId + '"';
    var ticketContext = new SCFile("ticketContextConfig", SCFILE_READONLY);
    ticketContext.setFields("id");
    if (ticketContext.doSelect(sql) == RC_SUCCESS) {
        return true;
    }
    return false;
}

/**
 * The ChangeModel/RequestModel is used by some ticket
 */
function isModelUsed(modelName, modelId, id) {
    var ticketContextConfig = new SCFile("ticketContextConfig", SCFILE_READONLY);
    var sql;
    if (modelName == "requestModel") {
        sql = `SELECT t.id FROM ticketContextConfig t INNER JOIN request r ON (t.fileId = r.number and r.modelname = "${modelId}" and t.id= "${id}")`;
    } else if (modelName == "changeModel") {
        sql = `SELECT t.id FROM ticketContextConfig t INNER JOIN cm3r c ON (t.fileId = c.number and c.changeModel = "${modelId}" and t.id= "${id}")`;
    } else {
        return true;
    }
    if (ticketContextConfig.doSelect(sql) == RC_SUCCESS) {
        return true;
    }
    return false;
}

/**
 * @class TaskPlannerService.
 * @classdesc Handles functionality associated with common task planner, used by RuleSet(apps) call.
 */
var TaskPlannerService = $({
    /**
     *  This function is to initialize ticketContext table for Model and Module ticket.
     *  If Model Level plan exists, corresponding Ticket Level plan will be generated.
     *  
     *  @param {record} record - The current Model(changeModel/requestModel) or Module(cm3r/request) record.  
     */
    initTicketContext: function(record) {
        var contextFile = new SCFile("ticketContext");
        var contextConfig = new SCFile("ticketContextConfig");
        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" == key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        var sql = "fileId=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";
        if (contextConfig.doSelect(sql) === RC_SUCCESS) {
            do {
                contextConfig.doDelete();
            } while (contextConfig.getNext() === RC_SUCCESS);
        }
        contextFile.fileName = fileName;
        contextFile.fileId = ticketid;
        contextFile.doSave();
    },

    initOOFlowConfiguration: function(record) {
        var planFile = new SCFile("OOFlowConfiguration");
        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" == key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        planFile.fileName = fileName;
        planFile.fileId = ticketid;
        planFile.doSave();
    },

    removeOOFlowConfiguration: function(record) {
        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" == key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        var sql = "fileId=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";
        $("OOFlowConfigurationItem").select(sql).iterate(function(tmprecord) {
            tmprecord.doDelete();
        });

        $("OOFlowConfiguration").select(sql).iterate(function(tmprecord) {
            tmprecord.doDelete();
        });
    },

    /**
     *  This function is to delete related ChangePlan/ticketContext/ticketContextConfig records if Model record gets deleted.
     *    
     *  @param {record} record - The current Model(changeModel/requestModel) record.  
     */
    removeChangePlanAndContext: function(record) {
        var contextFile = new SCFile("ticketContext");
        var contextConfig = new SCFile("ticketContextConfig");
        var taskPlan = new SCFile(TASKPLANTABLE);
        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" == key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        var sql = "fileId=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";
        var modelTaskPlanSql = "number=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";
        if (contextFile.doSelect(sql) === RC_SUCCESS) {
            contextFile.doDelete();
        }
        if (contextConfig.doSelect(sql) === RC_SUCCESS) {
            do {
                contextConfig.doDelete();
            } while (contextConfig.getNext() === RC_SUCCESS);
        }
        if (taskPlan.doSelect(modelTaskPlanSql) === RC_SUCCESS) {
            taskPlan.doDelete();
        }
    },

    /**
     *  This function is to update task description defined in changePlan from task record title.
     *    
     *  @param {record} record - The current Task(cm3t/requestTask etc.) record.  
     */
    syncTaskTitleToChangePlan: function(record) {
        var taskFileName = FILENAME(record);
        var parentFileName = TPUTILITY.getTableNameByTaskFileName(taskFileName, "Module");
        var key = TPUTILITY.getUniqueKey(taskFileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + taskFileName);
            return;
        }
        var taskid = record[key];
        var taskPlan = new SCFile(TASKPLANTABLE);
        var sql = "number=\"" + record.parentTicket + "\" and fileName=\"" + parentFileName + "\"";
        if (taskPlan.doSelect(sql) === RC_SUCCESS) {
            if (taskPlan !== null) {
                var lng = funcs.lng(funcs.denull(taskPlan.tasks));
                var i;
                for (i = 0; i < lng; i++) {
                    if (taskPlan.tasks[i].taskNumber === taskid) {
                        taskPlan.tasks[i].taskDescription = record.title;
                        break;
                    }
                }
                taskPlan.doUpdate();
            }
        }
    },

    /**
     *  This function is to update task planner status d from task record status.
     *    
     *  @param {record} record - The current Task(cm3t/requestTask etc.) record.  
     */
    syncTaskTitleAndStatusToChangePlan: function(record) {
        if (!ticketExist(record)) {
            return;
        }

        var taskFileName = FILENAME(record);
        var taskStatusField = TPUTILITY.getTaskStatusField(taskFileName);
        var status = TPHELPER.getTaskPlannerStatusFromStatusMapping(record[taskStatusField], taskFileName);

        var parentFileName = TPUTILITY.getTableNameByTaskFileName(taskFileName, "Module");
        var key = TPUTILITY.getUniqueKey(taskFileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + taskFileName);
            return;
        }
        var taskid = record[key];
        var taskPlan = new SCFile(TASKPLANTABLE);
        var sql = "number=\"" + record.parentTicket + "\" and fileName=\"" + parentFileName + "\"";
        if (taskPlan.doSelect(sql) === RC_SUCCESS) {
            if (taskPlan !== null) {
                var lng = funcs.lng(funcs.denull(taskPlan.tasks));
                var i;
                for (i = 0; i < lng; i++) {
                    if (taskPlan.tasks[i].taskNumber === taskid) {
                        if ("" !== status && null !== status && !funcs._null(status)) {
                            taskPlan.tasks[i].taskStatus = status;
                        }
                        taskPlan.tasks[i].taskActive = record.record_active;
                        taskPlan.tasks[i].taskDescription = record.title;
                        break;
                    }
                }
                taskPlan.doUpdate();
            }
        }
    },

    addOutSideTaskToChangePlan: function(record) {

        var taskFileName = FILENAME(record);
        var parentFileName = TPUTILITY.getTableNameByTaskFileName(taskFileName, "Module");
        var key = TPUTILITY.getUniqueKey(taskFileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + taskFileName);
            return;
        }
        var taskid = record[key];
        var taskPlan = new SCFile(TASKPLANTABLE);
        var sql = "number=\"" + record.parentTicket + "\" and fileName=\"" + parentFileName + "\"";
        if (taskPlan.doSelect(sql) === RC_SUCCESS) {
            if (taskPlan !== null) {
                var exists = false;
                var lastId = 1;
                var lng = funcs.lng(funcs.denull(taskPlan.tasks));
                var i;
                for (i = 0; i < lng; i++) {
                    if (taskPlan.tasks[i].taskNumber === taskid) {
                        exists = true;
                    }
                    lastId = Math.max(lastId, taskPlan.tasks[i].taskId);
                }
                if (exists == false) {
                    taskPlan.tasks = funcs.insert(taskPlan.tasks, 1, 0);
                    taskPlan.tasks[i].taskId = lastId + 1;
                    taskPlan.tasks[i].taskNumber = taskid;
                    taskPlan.tasks[i].taskStatus = record.status;
                    taskPlan.tasks[i].taskCategory = record.category;
                    taskPlan.tasks[i].taskDescription = record.title;
                    //taskPlan.tasks[i].taskAssignment = task.assign_dept;
                    //taskPlan.tasks[i].taskActive = record.open;
                    taskPlan.tasks[i].taskActive = record['record.active'];
                    var parent = new SCFile(parentFileName, SCFILE_READONLY);
                    var parentKey = TPUTILITY.getUniqueKey(parentFileName);
                    if ("" === parentKey) {
                        logInfo("Can not find the UniqueKey of table " + parentFileName);
                        return;
                    }
                    var query = String(parentKey) + "=\"" + record.parentTicket + "\"";
                    var ret = parent.doSelect(query);
                    if (ret === RC_SUCCESS) {
                        taskPlan.tasks[i].openInPhase = parent.current_phase;
                    } else {
                        logInfo("Can not find the Parent ticket of task '" + taskid + "'");
                        return;
                    }
                    taskPlan.doUpdate();
                }
            }
        }

    },

    syncChangePhaseToTaskParentPhase: function(oldRecord, record) {
        if (record['current.phase'] == oldRecord['current.phase']) {
            return;
        }

        var parentFileName = FILENAME(record);
        var changeId = record['number'];
        var taskPlan = new SCFile(TASKPLANTABLE, SCFILE_READONLY);
        var task = new SCFile("cm3t");
        var sql = "number=\"" + changeId + "\" and fileName=\"" + parentFileName + "\"";
        var taskSql = "";
        if (taskPlan.doSelect(sql) === RC_SUCCESS) {
            if (taskPlan !== null) {
                var lng = funcs.lng(funcs.denull(taskPlan.tasks));
                var i;
                for (i = 0; i < lng; i++) {
                    if (taskPlan.tasks[i].taskNumber !== null) {
                        taskSql = "number=\"" + taskPlan.tasks[i].taskNumber + "\"";
                        if (task.doSelect(taskSql) === RC_SUCCESS) {
                            if (task['parent.phase'] !== record['current.phase']) {
                                task['parent.phase'] = record['current.phase'];
                                task.doUpdate();
                            }
                        }
                    }
                }
            }
        }
    },

    /**
     *  This function is to initialize task plan information in changePlan table from Model Level to Ticket Level.
     *  If Model Level plan exists, corresponding Ticket Level plan will be generated.
     *  
     *  @param {record} oldRecord - The saved Module(cm3r/request) record.
     *  @param {record} record - The current Module(cm3r/request) record.  
     */
    initModelPlanToInstancePlan: function(oldRecord, record) {
        if (!ticketExist(record)) {
            return;
        }

        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        var modelTableName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
        if ("" === modelTableName) {
            logInfo("Please configure Common Task Planner Mapping for table of " + fileName);
            return;
        }
        var modelid = record[TICKETMODELFIELD];
        var oldModelid = oldRecord[TICKETMODELFIELD];

        var taskPlan = new SCFile(TASKPLANTABLE);
        var modelTaskPlanSql = "number=\"" + modelid + "\" and fileName=\"" + modelTableName + "\"";
        var ticketTaskPlanSql = "number=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";

        //Check if ticket level plan exists (this is for "Apply Model" feature),
        //if ticket level plan exists and no tasks have been opened, overwrite ticket level plan by model level plan
        //if ticket level plan exists and one or more tasks have been opened, keep current plan. Return bad validation(can not apply model in this case)
        var i;
        var lng;
        var taskOpen;
        if (taskPlan.doSelect(ticketTaskPlanSql) === RC_SUCCESS) {
            if (modelid !== oldModelid) {
                taskOpen = false;
                lng = funcs.lng(funcs.denull(taskPlan.tasks));
                if (lng === null) {
                    lng = 0;
                }
                if (oldModelid == null) {
                    for (i = 0; i < lng; i++) {
                        if (null !== taskPlan.tasks[i].taskNumber && "" !== taskPlan.tasks[i].taskNumber) {
                            //QCCR1E136565, SM952, Xin Deng
                            //change taskOpen back to true to enable the correct logic for auto transition, if the task has been opened, then don't reopen a duplicate one 
                            //modified by hanrui 2014-03-21, commented the taskOpen=true for the time being
                            taskOpen = true;
                            //taskOpen=false;

                            break;
                        }
                    }
                }
                if (taskOpen === true) {
                    logInfo("One or more tasks have been opened, can not initialize Model Level Plan to Ticket Level Plan");
                    return taskPlan;
                } else {
                    if (taskPlan.doSelect(modelTaskPlanSql) === RC_SUCCESS) {
                        lng = funcs.lng(funcs.denull(taskPlan.tasks));
                        if (lng === null) {
                            lng = 0;
                        }
                        for (i = 0; i < lng; i++) {
                            taskPlan.tasks[i].taskStatus = WAITING;
                        }
                    } else {
                        taskPlan = new SCFile(TASKPLANTABLE);
                    }
                }
            }
        }
        //get task plan defined in model, create ticket level plan based on this. This method will only be executed once at run time when parent ticket gets created.
        else if (taskPlan.doSelect(modelTaskPlanSql) === RC_SUCCESS) {
            lng = funcs.lng(funcs.denull(taskPlan.tasks));
            if (lng === null) {
                lng = 0;
            }
            for (i = 0; i < lng; i++) {
                taskPlan.tasks[i].taskStatus = WAITING;
            }
        }
        taskPlan.number = ticketid;
        taskPlan.fileName = fileName;
        taskPlan.doSave();

        //Handle ticket context
        var ticketContextConfigModelLevel = new SCFile("ticketContextConfig");
        var ticketContextConfigTicketLevel = new SCFile("ticketContextConfig");
        var ticketContextConfigModelLevelSql = "fileId=\"" + modelid + "\" and fileName=\"" + modelTableName + "\"";
        var ticketContextConfigTicketLevelSql = "fileId=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";
        // if ticketLevel context already exists, return
        if (ticketContextConfigTicketLevel.doSelect(ticketContextConfigTicketLevelSql) === RC_SUCCESS) {
            if (modelid !== oldModelid) {
                taskOpen = false;
                lng = funcs.lng(funcs.denull(taskPlan.tasks));
                if (lng === null) {
                    lng = 0;
                }
                for (i = 0; i < lng; i++) {
                    if (null !== taskPlan.tasks[i].taskNumber && "" !== taskPlan.tasks[i].taskNumber) {
                        //modified by hanrui 2014-03-21, commented the taskOpen=true for the time being
                        //taskOpen=true;
                        taskOpen = false;
                        break;
                    }
                }
                if (taskOpen === true) {
                    logInfo("One or more tasks have been opened, can not initialize Model Level Context to Ticket Level Context");
                    return taskPlan;
                } else {
                    do {
                        ticketContextConfigTicketLevel.doDelete();
                    } while (ticketContextConfigTicketLevel.getNext() === RC_SUCCESS);

                    if (ticketContextConfigModelLevel.doSelect(ticketContextConfigModelLevelSql) === RC_SUCCESS) {
                        do {
                            ticketContextConfigTicketLevel = ticketContextConfigModelLevel;
                            ticketContextConfigTicketLevel.fileId = ticketid;
                            ticketContextConfigTicketLevel.fileName = fileName;
                            ticketContextConfigTicketLevel.doSave();
                        } while (ticketContextConfigModelLevel.getNext() === RC_SUCCESS);
                    }
                }
            }
        }
        // Initialize model context to ticket context
        else if (ticketContextConfigModelLevel.doSelect(ticketContextConfigModelLevelSql) === RC_SUCCESS) {
            do {
                ticketContextConfigTicketLevel = ticketContextConfigModelLevel;
                ticketContextConfigTicketLevel.fileId = ticketid;
                ticketContextConfigTicketLevel.fileName = fileName;
                ticketContextConfigTicketLevel.doSave();
            } while (ticketContextConfigModelLevel.getNext() === RC_SUCCESS);
        }
    },

    initModelOOFlowConfToInstanceConf: function(oldRecord, record) {
        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        var modelTableName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
        if ("" === modelTableName) {
            logInfo("Please configure Common Task Planner Mapping for table of " + fileName);
            return;
        }
        var modelid = record[TICKETMODELFIELD];
        if (null === modelid || "" === modelid) {
            logInfo("Can not find related model in ticket of " + ticketid);
            return;
        }

        //OOFlowPlanLinks
        var ooFlowPlanLinksModelLevel = new SCFile("OOFlowConfigurationItem");
        var ooFlowPlanLinksTicketLevel = new SCFile("OOFlowConfigurationItem");
        var ooFlowPlanLinksModelLevelSql = "fileId=\"" + modelid + "\" and fileName=\"" + modelTableName + "\"";
        var ooFlowPlanLinksTicketLevelSql = "fileId=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";
        if (ooFlowPlanLinksModelLevel.doSelect(ooFlowPlanLinksModelLevelSql) === RC_SUCCESS) {
            do {
                ooFlowPlanLinksTicketLevel = ooFlowPlanLinksModelLevel;
                ooFlowPlanLinksTicketLevel.fileId = ticketid;
                ooFlowPlanLinksTicketLevel.fileName = fileName;
                ooFlowPlanLinksTicketLevel.doSave();
            } while (ooFlowPlanLinksModelLevel.getNext() === RC_SUCCESS);
        }
    },

    /**
     *  This function is to prepare task data (initialize $L.file(cm3t/requestTask)) based on changePlan and decide if open a new task .
     *  It is usually used in ticket Rule Set.
     *  Note: For the time being, link record used to copy specify fields value from parent file to task is not handled coz there is no
     *        a common solution of getting the link.
     *  @param {record} record - The Module(cm3r/request) record.
     *    
     */
    preOpenTask: function(record) {

        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        var ticketid = record[key];
        var taskTableName = TPUTILITY.getTableNameByParentFileName(fileName, "Task");
        if ("" === taskTableName) {
            logInfo("Please configure Common Task Planner Mapping for table of " + fileName);
            return;
        }
        key = TPUTILITY.getUniqueKey(taskTableName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + taskTableName);
            return;
        }

        //get taskNumberCls from object table for getting Task ID from number table purpose when opening task
        var taskNumberCls = TPUTILITY.getNumbeRecordName(taskTableName);
        if ("" === taskNumberCls) {
            logInfo("Please configure Number Record Name in Object for table of " + fileName);
            return;
        }

        var taskPlan = new SCFile(TASKPLANTABLE);
        var sql = "number=\"" + ticketid + "\" and fileName=\"" + fileName + "\"";

        if (taskPlan.doSelect(sql) === RC_SUCCESS) {

            var APPLYTEMPLATE = lib.Template.applyTemplate;
            //Initialize task/$L.file
            //var task=new SCFile(taskTableName);

            //task.parent_phase=record.current_phase;
            //eval("task."+PARENTTICKETFIELD+"=\""+ticketid+"\"");

            var i;
            var iLoopTimes = taskPlan.tasks.length();
            for (i = 0; i < iLoopTimes; i++) {

                if (record.current_phase === taskPlan.tasks[i].openInPhase && (null === taskPlan.tasks[i].taskNumber || "" === taskPlan.tasks[i].taskNumber)) {
                    // tempstatus will be 0/WAITING, 1/READY, 31/WITHDRAWN
                    var tempstatus = TPHELPER.setInitStatus(i, taskPlan, record);
                    if (tempstatus == WITHDRAWN) {
                        continue;
                    }

                    var task = new SCFile(taskTableName);
                    if (fileName === "cm3r") {
                        task.parent_phase = record.current_phase;
                    }
                    task[PARENTTICKETFIELD] = String(ticketid);

                    task.category = taskPlan.tasks[i].taskCategory;
                    task.title = taskPlan.tasks[i].taskDescription;
                    var taskStatusField = TPUTILITY.getTaskStatusField(taskTableName);
                    task[taskStatusField] = TPHELPER.getTaskStatusFromStatusMapping(tempstatus, taskTableName);
                    //task.status = TPHELPER.commonStatusToLocalStatus(tempstatus, task);
                    //if(fileName==="request"){
                    task.oolink_name = taskPlan.tasks[i].taskOOFlowLink;
                    //}                        
                    //get template defined in task plan
                    var planTemplate = taskPlan.tasks[i].taskTemplate;

                    //get default template configured in task category
                    var defaultTemplate = TPUTILITY.getTaskTemplateFromCategory(taskTableName, task.category);
                    //get related link.........TBD

                    //get task number
                    //modify by wangxun, invoke function to generate request task number follow the 
                    //request task environment setting's value
                    var temptaskNum = "";
                    if (fileName === "request") {
                        temptaskNum = lib.RequestSetting.getNumberForRequestTask(ticketid);
                        task.number = temptaskNum;
                    } else {
                        var newid = new Datum();
                        var rcode = new Datum();
                        rcode = funcs.rtecall("getnumber", rcode, newid, taskNumberCls);
                        task[key] = newid.getText();
                        temptaskNum = newid.getText();
                    }

                    /**    Copy field value to task: link-->default template-->planner template    */
                    // link naming convention: tasktablename.task.request
                    var linkName = taskTableName + ".task.request";
                    var link = new SCFile("link", SCFILE_READONLY);
                    link.setFields(["name"]);
                    var linkSql = "name=\"" + linkName + "\"";
                    if (link.doSelect(linkSql) === RC_SUCCESS) {
                        var rteReturnValue = new SCDatum();
                        var rteNames = new SCDatum();
                        var rteVals = new SCDatum();

                        rteNames.setType(8);
                        rteNames.push("file");
                        rteNames.push("record");
                        rteNames.push("name");

                        rteVals.setType(8);
                        rteVals.push(task);
                        rteVals.push(record);
                        rteVals.push(linkName);

                        var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
                        vars.$bypass_bg_authcheck = true;
                        var oriBg = vars.$G_bg;
                        vars.$G_bg = true;
                        //false to run in the same thread, true to run in new one. 
                        try {
                            funcs.rtecall("callrad", rteReturnValue, "move.fields.by.link", rteNames, rteVals, false);
                        } catch (e) {
                            print(e.toString());
                        }
                        vars.$G_bg = oriBg;
                        vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
                    }

                    /** handle template*/
                    if (null !== defaultTemplate && "" !== defaultTemplate) {
                        APPLYTEMPLATE(task, TPUTILITY.getTemplateObject(taskTableName, defaultTemplate), TPUTILITY.getMassUpdateFlagByTemplateState(taskTableName, defaultTemplate));
                    }
                    if (null !== planTemplate && "" !== planTemplate) {
                        APPLYTEMPLATE(task, TPUTILITY.getTemplateObject(taskTableName, planTemplate), TPUTILITY.getMassUpdateFlagByTemplateState(taskTableName, planTemplate));
                    }
                    //handle set fields value
                    if (null !== taskPlan.tasks[i].taskFieldsSetting && "" !== taskPlan.tasks[i].taskFieldsSetting) {
                        var j;
                        var jLoopTimes = taskPlan.tasks[i].taskFieldsSetting.length();
                        for (j = 0; j < jLoopTimes; j++) {

                            //var dbDict=new SCFile("dbdict");
                            //var dbsql="name=\""+taskTableName+"\"";
                            //dbDict.doSelect(dbsql);
                            var field = taskPlan.tasks[i].taskFieldsSetting[j].fieldName;
                            var value = taskPlan.tasks[i].taskFieldsSetting[j].fieldValue;
                            //var fieldType=lib.dbdictHelper.getFieldType(dbDict,field);
                            //value=funcs.val(value, fieldType );
                            //task[field]=value;
                            if (isFieldExistInPreDefined(taskTableName, taskPlan.tasks[i].taskCategory, field)) {
                                try {
                                    if (task.getFieldType(field) == 8) { // 8: array type
                                        if (value && !(value instanceof Array)) {
                                            value = [value];
                                        }
                                    }

                                    task.setFieldValue(field, value);
                                } catch (ex) {
                                    //print(ex.toString()+" when setting value '"+value+"' to field '"+field+"'.");
                                    print("Field set error in TaskPlanner: can not set '" + value + "' to field '" + field + "'.");
                                    return;
                                }
                            }
                        }
                    }
                    var assignmentRuleSet = taskPlan.tasks[i].taskAssignment;
                    if (null !== assignmentRuleSet && "" !== assignmentRuleSet) {
                        this.runTaskAssignmentRuleSet(task, assignmentRuleSet);
                    }

                    //back up related fields value for rollback
                    var oriTaskNumber = taskPlan.tasks[i].taskNumber;
                    var oriTaskDescription = taskPlan.tasks[i].taskDescription;
                    var oriTaskStatus = taskPlan.tasks[i].taskStatus;
                    var oriTaskActive = taskPlan.tasks[i].taskActive;

                    //modify by wangxun
                    //taskPlan.tasks[i].taskNumber=eval("task."+key+"=\""+newid.getText()+"\"");
                    taskPlan.tasks[i].taskNumber = task[key]; // confirmed with Han Rui that the previous logic is urgly.
                    taskPlan.tasks[i].taskDescription = task.title;
                    taskPlan.tasks[i].taskStatus = tempstatus;
                    //taskPlan.tasks[i].taskActive=task.open;
                    taskPlan.tasks[i].taskActive = true;
                    taskPlan.doUpdate();

                    var opRt = this.openTask(task, tempstatus);

                    if (opRt !== RC_SUCCESS) {
                        taskPlan.tasks[i].taskNumber = oriTaskNumber;
                        taskPlan.tasks[i].taskDescription = oriTaskDescription;
                        taskPlan.tasks[i].taskStatus = oriTaskStatus;
                        taskPlan.tasks[i].taskActive = oriTaskActive;
                        taskPlan.doUpdate();
                    }
                    // Reload changePlan record in case it is modified after call openTask()
                    else if (i < iLoopTimes - 1) {
                        taskPlan.doSelect(sql);
                    }
                }
            } // for
        } else {
            logInfo("No Task Plan for ticket of " + ticketid);
        }
    },

    /**
     *  This function is to callrad to run specific RuleSet.
     *  @param {record} task - The task(cm3t/requestTask) record.
     *  @param {String} assignmentRuleSet - The RuleSet name.
     */
    runTaskAssignmentRuleSet: function(task, assignmentRuleSet) {
        var rteReturnValue = new SCDatum();
        var rteNames = new SCDatum();
        var rteVals = new SCDatum();

        rteNames.setType(8);
        rteNames.push("file");
        rteNames.push("name");

        rteVals.setType(8);
        rteVals.push(task);
        rteVals.push(assignmentRuleSet);
        var oriBg = vars.$G_bg;
        vars.$G_bg = true;
        //false to run in the same thread, true to run in new one.  
        funcs.rtecall("callrad", rteReturnValue, "Ruleset.run", rteNames, rteVals, false);
        vars.$G_bg = oriBg;
    },

    /**
     *  This function is to open task record.
     *  @param {record} task - The task(cm3t/requestTask) record.
     *  
     */
    openTask: function(record, tempstatus) {
        var workflowName = TPUTILITY.getWorkFlow(FILENAME(record), record.category);
        if (null === workflowName || "" === workflowName) {
            logInfo("Can not find the workflow for task of " + record.category);
            return;
        }
        var workflow = new SCFile("Workflow", SCFILE_READONLY);
        workflow.setFields(["firstPhase"]);
        var firstPhase = "";
        var sql = "name=\"" + workflowName + "\" and tableName=\"" + FILENAME(record) + "\"";
        if (workflow.doSelect(sql) === RC_SUCCESS) {
            firstPhase = workflow.firstPhase;
        }
        record.current_phase = firstPhase;
        var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
        var bypassValidationOrig = vars.$bypass_failed_validation;
        vars.$bypass_bg_authcheck = true;
        vars.$bypass_failed_validation = true;
        var openResult = record.doAction("add");
        vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
        vars.$bypass_failed_validation = bypassValidationOrig;

        return openResult;
    },

    /**
     *  This function updates the ChangePlan when a task is created or updated
     *  @param {record} task - the task that is created or updated.
     */
    refreshTaskStatus: function(record) {
        TPHELPER.updatePlan(record);
    },

    /**
     *  This function return the String of task list that need to be closed at current phase of parent record.
     *  If the list is not null, tasks in this list should be closed before parent record moving to next phase.
     *
     *  @param {record} oldRecord - Current saved record
     *  @param {record} record - Current record
     *  @return the String of task list that need to be closed at current phase of parent record.
     */
    getNeedToCloseTaskList: function(oldRecord, record) {
        if (oldRecord.current_phase !== record.current_phase) {
            var allowOpen = null;
            var needToCloseArray = [];
            var fileName = FILENAME(record);
            if (fileName === "cm3r") {
                var phaseRecord = new SCFile("cm3rcatphase", SCFILE_READONLY);
                phaseRecord.setFields(["allow.open.tasks"]);
                var phaseSql = "name=\"" + oldRecord.current_phase + "\"";
                if (phaseRecord.doSelect(phaseSql) === RC_SUCCESS) {
                    allowOpen = phaseRecord.allow_open_tasks;
                }
            }
            var key = TPUTILITY.getUniqueKey(fileName);
            if ("" === key) {
                logInfo("Can not find the UniqueKey of table " + fileName);
                return "";
            }
            var id = record[key];
            var workflowName = TPUTILITY.getWorkFlow(fileName, TPUTILITY.getParentCategory(id, fileName));
            var taskPlan = new SCFile(TASKPLANTABLE);
            var sql = "number=\"" + id + "\" and fileName=\"" + fileName + "\"";

            if (taskPlan.doSelect(sql) === RC_SUCCESS) {
                needToCloseArray = TPHELPER.checkCanLeavePhase(workflowName, oldRecord.current_phase, record.current_phase, taskPlan, allowOpen);
            }
            if (needToCloseArray !== null) {
                return needToCloseArray.join(",");
            } else {
                return "";
            }
        } else {
            return "";
        }
    },

    /**
     *  dynamic generate the validation xml for xml fill function.
     *
     *  History:
     *  2014-03-01, wang,xun(xunw@hp.com) - function created
     *  @taskFile, task record SCFile
     *  @buttonId, the button id end user clicked, you could get it by RAD function option()
     *  @xmlString, the xml string buffer to contain id for this XML element
     *
     *  @returns XML format validation string for feed RAD us.xml.fill or BLANK string for error.
     */
    generateValidations: function(taskFile, buttonId, xmlString) {
        //look for ID from button id
        var token = "button=\"" + buttonId;
        var index = xmlString.indexOf(token);
        var section = xmlString.substring(index);
        var token2 = "id=\"";
        var token3 = "\"";
        var index2 = section.indexOf(token2);
        var section2 = section.substring(index2 + 4);
        var index3 = section2.indexOf(token3);
        var nodeId = section2.substring(0, index3);
        var parentID = taskFile.parentTicket;
        var parentFileName = TPUTILITY.getTableNameByTaskFileName(FILENAME(taskFile), "ticket");
        var ticketContext = new SCFile(TASK_CONTEXT_FILENAME, SCFILE_READONLY);
        ticketContext.setFields(["tableFieldName", "addlTypeInfo"]);
        var sql = "fileName=\"" + parentFileName + "\" and fileId=\"" + parentID + "\" and id=\"" + nodeId + "\"";
        if (ticketContext.doSelect(sql) === RC_SUCCESS) {
            var validation = "<validations><string button=\"" + buttonId + "\" id=\"" + nodeId + "\" matchField=\"" + ticketContext.tableFieldName + "\" matchTable=\"" + ticketContext.addlTypeInfo + "\"></validations>";
            return validation;
        } else {
            return "";
        }
    },

    /**
     *  Production manager mention they want show all ticket context in parent ticket level.
     *
     *  History:
     *  2014-03-01, wang,xun(xunw@hp.com) - function created
     *  @parentFile, parent file scfile, for example, request or cm3r file.
     *
     *  @returns XML format contain all ticket context configuration.
     */
    createFormParentFile: function(parentFile) {
        var parentFileName = FILENAME(parentFile);
        var uniqueS = TPUTILITY.getUniqueKey(parentFileName);
        var parentID = parentFile[uniqueS];
        var changePlan = new SCFile("changePlan", SCFILE_READONLY);
        var sql = "fileId=\"" + parentID + "\" and fileName=\"" + parentFileName + "\"";
        var allTaskContextID = [];
        var allTaskContextType = [];
        var i;
        var len;
        if (changePlan.doSelect(sql) === RC_SUCCESS) {
            var tasks = changePlan.tasks;
            len = tasks.length();
            for (i = 0; i < len; i++) {
                mergeArray(allTaskContextID, allTaskContextType, tasks[i].inputs, "input");
                mergeArray(allTaskContextID, allTaskContextType, tasks[i].outputs, "output");
            }
        }
        var arrayContext = [];
        var arrayUserSelection = [];
        var arrayParent = [];
        len = allTaskContextID.length;
        for (i = 0; i < len; i++) {
            var type = allTaskContextType[i];
            var tempid = allTaskContextID[i];
            if (CONTEXT_INPUT_TYPE_CONTEXT === type) {
                arrayContext.push(tempid);
            } else if (CONTEXT_INPUT_TYPE_USERSELECTION === type) {
                arrayUserSelection.push(tempid);
            } else if (CONTEXT_INPUT_TYPE_PARENTRECORD === type) {
                arrayParent.push(tempid);
            }
        }
        var form = new XML("form");
        this.createFormContext(parentID, parentFileName, form, arrayContext, null);
        this.createFormUserSelection(form, arrayUserSelection, parentFile);
        this.createFormParentRecord(form, arrayParent, parentFile);
        return form.toXMLString();
    },

    /**
     *  Generate XML format string buffer base on particular fileid and filename( for example 'request' and 'RM10001')
     *
     *  History:
     *  2014-03-01, wang,xun(xunw@hp.com) - function created
     *
     *  @fileid, number or modelid of change plan, for example, RM10001, C100032 etc
     *  @filename, parent filename, such as 'request', 'requestModel'.
     *  @formXML, the XML buffer, this variable will be modified in this function and added ticket context config XML buffer in it.
     *  @idList, ticket context config id list belong to current change plan.
     *  @invoker, if invoker is not null then return all context config ticket of current ticket back.
     *
     *  @returns blank.
     */
    createFormContext: function(fileId, fileName, formXML, idList, invoker) {
        var isModelFile = isRegisteredModelFileName(fileName);
        if (!isModelFile) {
            var modelFileName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
            var modelId = TPUTILITY.getModelIdByTicketID(fileName, fileId);
        }

        var form = formXML;
        if (formXML === null) {
            form = new XML("form");
        }
        var orderBySeq = [SCFILE_ASC, SCFILE_ASC];
        var fields = ['id', 'label'];
        var config = new SCFile(TASK_CONTEXT_FILENAME, SCFILE_READONLY);
        config.setOrderBy(fields, orderBySeq);
        var sql = "false";
        var optionIndex = 4000;
        sql = "fileId=\"" + fileId + "\" and fileName=\"" + fileName + "\"";
        var i;
        if (idList !== null) {
            var appendsql = "";
            var len = idList.length;
            for (i = 0; i < len; i++) {
                appendsql = appendsql + "\"" + idList[i] + "\"";
                if (i < (len - 1)) {
                    appendsql = appendsql + ",";
                }
            }
            if (appendsql !== "") {
                sql = sql + " and id isin {" + appendsql + "}";
            }
        }
        if (invoker === null && (idList === null || (idList !== null && idList.length === 0))) {
            return "";
        }
        if (config.doSelect(sql) === RC_SUCCESS) {
            do {
                var type = "text";
                var option;
                var suffix = ":";
                var isRecord = false;
                switch (config.type) {
                    case "list":
                        type = "select";
                        break;
                    case "globallist":
                        type = "select";
                        break;
                    case "boolean":
                        suffix = "";
                        type = "checkbox";
                        break;
                    case "record":
                        isRecord = true;
                        break;
                }
                var node = form.addElement(type);
                node.setAttributeValue("id", config.id);
                var class_str = "local:" + TASK_CONTEXT_FILENAME;
                var number_str = null;
                if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                    number_str = modelFileName + "_" + modelId + "_" + config.id;
                } else {
                    number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                }
                var msg = funcs.scmsg(number_str, class_str);
                if (funcs.index("Could not be found:", msg) > 0) {
                    msg = config.label;
                }
                node.setAttributeValue("label", msg);
                var value = config.value;
                if (isRecord) {
                    ++optionIndex;
                    node.setAttributeValue("button", optionIndex);
                    var ref = lib.DisplayName.getRefTable(config.tableFieldName, config.fileName);
                    if (ref === "device") {
                        var displayValue = lib.DisplayName.getDisplayNameByLogicalName(value);
                        if (displayValue != null) {
                            node.setAttributeValue("hasdisplay", true);
                            node.setAttributeValue("display", displayValue);
                        }
                    }
                }
                if (value !== null) {
                    node.setValue(value);
                }
                if (type === "select") {
                    if (value === null) {
                        node.setValue(config.valueList[0]);
                    }
                    var style = "combo";
                    var defaultValue;
                    if (config.displayType === "radio") {
                        style = "radio";
                    }
                    node.setAttributeValue("style", style);
                    if (config.type === "globallist") {
                        var gl = new SCFile("globallists", SCFILE_READONLY);
                        sql = "name=\"" + config.addlTypeInfo + "\"";
                        if (gl.doSelect(sql) === RC_SUCCESS) {
                            config.displayList = funcs.val(gl.display_list, 8);
                            config.valueList = funcs.val(gl.value_list, 8);
                            var temp = /\./g;
                            var listVar = funcs.parse(gl.list_variable, 2);
                            var localList = funcs.parse(gl.display_variable, 2);
                            if (localList !== null) {
                                config.displayList = vars[localList];
                            }
                            if (listVar !== null) {
                                config.valueList = vars[listVar];
                            }
                            if (config.mandatory !== true) {
                                config.displayList = funcs.insert(config.displayList, 1, 1, "-None-");
                                config.valueList = funcs.insert(config.valueList, 1, 1, "null");
                            }
                        }
                    }
                    if (config.displayList !== null && config.valueList !== null) {
                        var iLoopTimes = config.valueList.length();
                        var fromModel = false;
                        if (!isModelFile) {
                            fromModel = isFromModel(modelFileName, modelId, config.id);
                        }
                        for (i = 0; i < iLoopTimes; i++) {
                            option = node.addElement("option");
                            if (config.displayList[i] !== null && config.displayList[i] !== "") {
                                if (config.type === "list") {
                                    var ttemp = funcs.str(config.valueList[i]);
                                    var mclass;
                                    if (!isModelFile && fromModel) {
                                        mclass = "sCfg." + modelFileName + "_" + modelId + "_" + config.id;
                                    } else {
                                        mclass = "sCfg." + config.fileName + "_" + config.fileId + "_" + config.id;
                                    }
                                    var lmsg = funcs.scmsg(ttemp, mclass);
                                    if (funcs.index("Could not be found:", lmsg) === 0) {
                                        option.setAttributeValue("label", lmsg);
                                    } else {
                                        option.setAttributeValue("label", config.displayList[i]);
                                    }
                                } else {
                                    option.setAttributeValue("label", config.displayList[i]);
                                }
                            } else {
                                option.setAttributeValue("label", config.valueList[i]);
                            }
                            option.setValue(config.valueList[i]);
                        }
                    } else {
                        if (config.displayList === null) {
                            logInfo("The value of Display Variable in Global List:\"" + config.addlTypeInfo + "\" is null");
                        }
                        if (config.valueList === null) {
                            logInfo("The value of List Variable in Global List:\"" + config.addlTypeInfo + "\" is null");
                        }
                    }
                }
                node.setAttributeValue("inputtype", CONTEXT_INPUT_TYPE_CONTEXT);
            } while (config.getNext() === RC_SUCCESS);
        }
        return;
    },

    getUserOptionDefintion: function(useroption) {
        if (useroption === null) {
            return null;
        }

        var sql = "id=" + useroption.CatalogItem_ID;
        var svcCatalog = new SCFile("svcCatalog", SCFILE_READONLY);
        svcCatalog.setFields("options");

        if (svcCatalog.doSelect(sql) === RC_SUCCESS) {
            var optionxml = new XML();
            optionxml.setContent(svcCatalog.options);
            var xml = optionxml.getDocumentElement();

            if (xml != null) {
                var element = xml.getFirstChildElement();
                if (element !== null) {
                    do {
                        if (useroption.Option_Name === element.getAttributeValue("id")) {
                            return {
                                "id": element.getAttributeValue("id"),
                                "label": element.getAttributeValue("label"),
                                "mandatory": element.getAttributeValue("mandatory"),
                                "visible": element.getAttributeValue("visible"),
                                "inputtype": element.getName()
                            };
                        }
                        element = element.getNextSiblingElement();
                    } while (element !== null);
                }
            }
        }
        return null;
    },

    createFormUserSelection: function(formXML, idList, record) {
        var parentFile = getParentFile(record);
        var len = idList.length;
        var i;
        for (i = 0; i < len; i++) {
            var option_name = idList[i];
            var option = getUserOption(parentFile, option_name);
            if (option === null) {
                return;
            }

            var t = this.getUserOptionDefintion(option);

            if (t != null) {
                var inputype = "";
                if (t.inputtype == "select") {
                    inputype = "text";
                } else {
                    inputype = t.inputtype;
                }
                var node = formXML.addElement(inputype);
                node.setAttributeValue("id", t.id);
                node.setAttributeValue("label", option["Option.Label"]);
                node.setAttributeValue("inputtype", CONTEXT_INPUT_TYPE_PARENTRECORD);

                var tempstr = "";

                if (option.Option_Value != null) {
                    var j;
                    var jLoopTimes = option.Option_Value.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        tempstr = tempstr + option.Option_Value[j] + ",";
                    }
                    tempstr = tempstr.substring(0, tempstr.length - 1);

                    if (option.Option_Type == "date") {
                        tempstr = lib.tzFunctions.convertDateStringToLocal(tempstr, lib.DateOrderConstant.yyyymmdd());
                    }
                }

                node.setValue(tempstr);
            } else {
                return;
            }
        }
        return;
    },

    createFormParentRecord: function(formXML, idList, record) {
        var parentFile = getParentFile(record);
        var dbDict = new SCFile("dbdict");
        var sql = "name=\"" + FILENAME(parentFile) + "\"";

        var NULLSUB = funcs.nullsub;

        if (dbDict.doSelect(sql) === RC_SUCCESS) {
            var len = idList.length;
            var node;
            var type;
            var i;
            for (i = 0; i < len; i++) {
                var fieldType = lib.dbdictHelper.getFieldType(dbDict, idList[i]);
                var fname = idList[i];
                var value = funcs.val(NULLSUB(parse_field_value(parentFile, fname), ""), 2);
                var ref = lib.DisplayName.getRefTable(fname, FILENAME(parentFile));
                if (fieldType === 1 || fieldType === 2 || fieldType === 3) {
                    type = "text";
                } else if (fieldType === 4) {
                    type = "checkbox";
                    value = funcs.val(value, 4);
                } else if (fieldType === 8 || fieldType === 9) {
                    type = "text";
                    if (ref != "device") {
                        var temp = parse_field_value(parentFile, fname);
                        if (temp === null) {
                            value = "";
                        } else {
                            value = "";
                            var len1 = temp.length();
                            var j;
                            for (j = 0; j < len1; j++) {
                                if (j > 0) {
                                    value = value + ",";
                                }
                                value = value + funcs.str(NULLSUB(temp[j], ""));
                            }
                        }
                    }
                }
                node = formXML.addElement(type);
                node.setAttributeValue("id", fname);
                node.setAttributeValue("label", getFieldCaption(idList[i], parentFile));
                node.setAttributeValue("inputtype", CONTEXT_INPUT_TYPE_PARENTRECORD);
                node.setValue(value);
                if (ref === "device") {
                    var displayValue = lib.DisplayName.getDisplayNameByLogicalName(value);
                    node.setAttributeValue("hasdisplay", true);
                    node.setAttributeValue("display", displayValue);
                }
            }
        }
    },

    /**
     *  Generate dynamic xml format data for task file.
     *
     *  History:
     *  2014-03-01, wang,xun(xunw@hp.com) - function created
     *  @taskFile, task file scfile, for example, requestTask or cm3t file.
     *  @method, input or output correspond, inputs and outputs field in changePlan table.
     *
     *  @returns XML format contain all ticket context configuration for current task file.
     */
    createFormAll: function(taskFile, method) {
        var parentID = taskFile.parentTicket;
        var parentFileName = TPUTILITY.getTableNameByTaskFileName(FILENAME(taskFile), "ticket");
        var taskID = taskFile.number;
        var buffer = getTaskPlanData(parentID, parentFileName, taskID, method);
        if (buffer == null) {
            return "";
        }
        var arrayContext = [];
        var arrayUserSelection = [];
        var arrayParent = [];
        var i;
        for (i = 0; i < buffer.length; i++) {
            var item = buffer[i];
            var type = item[method + "Type"];
            var tempid;
            if (CONTEXT_INPUT_TYPE_CONTEXT === type) {
                tempid = item[method + "Id"];
                arrayContext.push(tempid);
            } else if (CONTEXT_INPUT_TYPE_USERSELECTION === type) {
                tempid = item[method + "Id"];
                arrayUserSelection.push(tempid);
            } else if (CONTEXT_INPUT_TYPE_PARENTRECORD === type) {
                tempid = item[method + "Id"];
                arrayParent.push(tempid);
            }
        }
        var form = new XML("form");
        this.createFormContext(parentID, parentFileName, form, arrayContext, null);

        if (method === "input") {
            this.createFormUserSelection(form, arrayUserSelection, taskFile);
            this.createFormParentRecord(form, arrayParent, taskFile);
        }

        return form.toXMLString();
    },

    /**
     *  parse dynamic XML form xml buffer and get the user input data stored in XML string buffer.
     *
     *  History:
     *  2014-03-01, wang,xun(xunw@hp.com) - function created
     *
     *  @formXML, XML string data which included user input.
     *  @taskfile, task file, for example, requestTask, the current task $L.file
     *
     *  @returns for this function is a xml format buffer which like the below example format:
     *  <result>1<message>mesg in formation</message></result>
     *  since all user input must go through the validation test and verify 
     *  so if failed, 
     *  result===1 and message elements include waring messages information
     *  if success ,
     *  result===0
     */
    parseForm: function(formXML, taskfile, invokemethod) {
        var result = initResult();
        var form = new XML();
        if (formXML !== null && formXML !== "") {
            if (form.setContent(formXML)) {
                var parent = form.getDocumentElement();
                var node = parent.getFirstChildElement();
                var fileName = TPUTILITY.getTableNameByTaskFileName(FILENAME(taskfile), "ticket");
                var fileId = taskfile.parentTicket;
                while (node !== null) {
                    var value = node.getValue();
                    if (invokemethod === "closetask" && (value === null || value === "")) {
                        return true;
                    }
                    var id = node.getAttributeValue("id");
                    var inputtype = node.getAttributeValue("inputtype");
                    result = this.validateContext(id, value, fileName, fileId);

                    if (result.getValue() !== "0") {
                        return result;
                    }
                    if (inputtype === CONTEXT_INPUT_TYPE_CONTEXT) {
                        saveContext(id, value, fileName, fileId);
                    } else if (inputtype === CONTEXT_INPUT_TYPE_USERSELECTION) {
                        saveUserSelection(id, value, fileName, fileId);
                    } else if (inputtype === CONTEXT_INPUT_TYPE_PARENTRECORD) {
                        saveParentFile(id, value, fileName, fileId);
                    }
                    node = node.getNextSiblingElement();
                }
            }
        }

        return result;
    },

    /**
     *  verify user input when save dynamic format xml which contain user input.
     *
     *  History:
     *  2014-03-01, wang,xun(xunw@hp.com) - function created
     *
     *  @id, ticket context configuration ID for this model or instance ticket.
     *  @value, correspond value
     *  @fileName, filename which this ticket context belonged, e.g. request
     *  @fileId, fileid which this ticket context belonged, e.g. RM10002
     *  
     *  @returns for this function is a xml format buffer which like the below example format:
     *  <result>1<message>mesg in formation</message></result>
     *  since all user input must go through the validation test and verify 
     *  so if failed, 
     *  result===1 and message elements include waring messages information
     *  if success ,
     *  result===0
     */
    validateContext: function(id, value, fileName, fileId) {
        var isModelFile = isRegisteredModelFileName(fileName);
        if (!isModelFile) {
            var modelFileName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
            var modelId = TPUTILITY.getModelIdByTicketID(fileName, fileId);
        }

        var result = initResult();
        var message = result.addElement("message");
        var config = new SCFile(TASK_CONTEXT_FILENAME, SCFILE_READONLY);
        var sql = "fileName=\"" + fileName + "\" and id=\"" + id + "\" and fileId=\"" + fileId + "\"";
        if (config.doSelect(sql) === RC_SUCCESS) {
            var test;
            var msg;
            var class_str;
            var number_str;
            if (config.type === "record" && value !== null && value !== "") {
                var targetTable = config['addlTypeInfo'];
                var targetTableField = config['tableFieldName'];
                var vFile = new SCFile(targetTable, SCFILE_READONLY);
                var vSql = String(targetTableField) + "=\"" + value + "\"";
                if (vFile.doSelect(vSql) !== RC_SUCCESS) {
                    result.setValue(1);
                    class_str = "local:" + TASK_CONTEXT_FILENAME;
                    if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                        number_str = modelFileName + "_" + modelId + "_" + config.id;
                    } else {
                        number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                    }
                    msg = funcs.scmsg(number_str, class_str);
                    if (msg === null) {
                        msg = config.label;
                    }
                    message.setValue(funcs.scmsg(9, "settings", [msg, value]));
                    return result;
                }
            }
            if (config.type === "number" && value !== null && value !== "") {
                test = new SCDatum();
                test.setType(1);
                test = funcs.val(value, 1);
                if (test === null || test === "") {
                    result.setValue(1);
                    class_str = "local:" + TASK_CONTEXT_FILENAME;
                    if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                        number_str = modelFileName + "_" + modelId + "_" + config.id;
                    } else {
                        number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                    }
                    msg = funcs.scmsg(number_str, class_str);
                    if (msg === null) {
                        msg = config.label;
                    }
                    message.setValue(funcs.scmsg(1, "settings", [msg, value]));
                    return result;
                }
            }
            if (config.type === "datetime" && value !== null && value !== "") {
                test = new SCDatum();
                test.setType(3);
                test = funcs.val(value, 3);
                if (test === null || test === "") {
                    result.setValue(1);
                    class_str = "local:" + TASK_CONTEXT_FILENAME;
                    if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                        number_str = modelFileName + "_" + modelId + "_" + config.id;
                    } else {
                        number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                    }
                    msg = funcs.scmsg(number_str, class_str);
                    if (msg === null) {
                        msg = config.label;
                    }
                    message.setValue(funcs.scmsg(2, "settings", [msg, value]));
                    return result;
                }
            }
            if (config.type === "condition" && value !== null && value !== "") {
                test = new SCDatum();
                test.setType(10);
                test = funcs.evaluate(funcs.parse(value, 4));
                if (test === null) {
                    result.setValue(1);
                    class_str = "local:" + TASK_CONTEXT_FILENAME;
                    if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                        number_str = modelFileName + "_" + modelId + "_" + config.id;
                    } else {
                        number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                    }
                    msg = funcs.scmsg(number_str, class_str);
                    if (msg === null) {
                        msg = config.label;
                    }
                    message.setValue(funcs.scmsg(3, "settings", [msg, value]));
                    return result;
                }
            }
            if (config.mandatory === true) {
                if (value === null || value === "") {
                    result.setValue(1);
                    class_str = "local:" + TASK_CONTEXT_FILENAME;
                    if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                        number_str = modelFileName + "_" + modelId + "_" + config.id;
                    } else {
                        number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                    }
                    msg = funcs.scmsg(number_str, class_str);
                    if (msg === null) {
                        msg = config.label;
                    }
                    message.setValue(funcs.scmsg(4, "settings", [msg]));
                    return result;
                }
            }
            if (config.validationScript !== null) {
                var js = config.validationScript;
                try {
                    eval(js);
                } catch (e) {
                    class_str = "local:" + TASK_CONTEXT_FILENAME;
                    if (!isModelFile && isFromModel(modelFileName, modelId, config.id)) {
                        number_str = modelFileName + "_" + modelId + "_" + config.id;
                    } else {
                        number_str = config.fileName + "_" + config.fileId + "_" + config.id;
                    }
                    msg = funcs.scmsg(number_str, class_str);
                    if (msg === null) {
                        msg = config.label;
                    }
                    print(funcs.scmsg(5, "settings", [msg]));
                    logInfo(e.toString());
                }
            }
        }
        return result;
    },

    /**
     *  Trigger function after success added.
     *
     *  History:
     *  2014-03-07, wang,xun(xunw@hp.com)
     *
     */
    triggerAfterAddContextConfig_localLabel: function(contextconfigrecord) {
        var fileName = contextconfigrecord.fileName;
        var fileId = contextconfigrecord.fileId;
        var label = contextconfigrecord.label;
        var id = contextconfigrecord.id;

        if (!isRegisteredModelFileName(fileName)) { // do NOT localize the ticket context field name if it is not at model level
            var modelFileName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
            var modelId = TPUTILITY.getModelIdByTicketID(fileName, fileId);
            if (isFromModel(modelFileName, modelId, id)) {
                return;
            }
        }

        var class_str = "local:" + TASK_CONTEXT_FILENAME;
        var number_str = fileName + "_" + fileId + "_" + id;
        var content_str = label;
        var activeLanguage = [];
        activeLanguage = lib.localizeTable.getActiveLanguages();
        var i;
        for (i = 0; i < activeLanguage.length; ++i) {
            addMessageRecord(class_str, number_str, content_str, activeLanguage[i]);
        }
    },

    /**
     *  Trigger function after success updated.
     *
     *  History:
     *  2014-03-07, wang,xun(xunw@hp.com)
     *
     */
    triggerAfterUpdateConextConfig_localLabel: function(contextconfigrecord, oldrecord) {
        var fileName = contextconfigrecord.fileName;
        var fileId = contextconfigrecord.fileId;
        var label = contextconfigrecord.label;
        var id = contextconfigrecord.id;

        if (!isRegisteredModelFileName(fileName)) { // do NOT localize the ticket context field name if it is not at model level
            var modelFileName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
            var modelId = TPUTILITY.getModelIdByTicketID(fileName, fileId);
            if (isFromModel(modelFileName, modelId, id)) {
                return;
            }
        }

        if (!isSame(contextconfigrecord, oldrecord)) {
            var class_str = "local:" + TASK_CONTEXT_FILENAME;
            var number_str = fileName + "_" + fileId + "_" + id;
            var content_str = label;
            var activeLanguage = [];
            activeLanguage = lib.localizeTable.getActiveLanguages();
            var i;
            for (i = 0; i < activeLanguage.length; ++i) {
                // just add the messaggge if it does not exist
                addMessageRecord(class_str, number_str, content_str, activeLanguage[i]);
            }
        }
    },

    /**
     *  Trigger function after success deleted.
     *
     *  History:
     *  2014-03-07, wang,xun(xunw@hp.com)
     *
     */
    triggerAfterDeleteConextConfig_localLabel: function(contextconfigrecord) {
        var fileName = contextconfigrecord.fileName;
        var fileId = contextconfigrecord.fileId;
        var label = contextconfigrecord.label;
        var id = contextconfigrecord.id;
        if (!isRegisteredModelFileName(fileName)) { // do NOT localize the ticket context field name if it is not at model level 
            var modelFileName = TPUTILITY.getTableNameByParentFileName(fileName, "Model");
            var modelId = TPUTILITY.getModelIdByTicketID(fileName, fileId);
            if (isFromModel(modelFileName, modelId, id)) {
                return;
            }
        } else if (isModelUsed(fileName, fileId, id)) {
            return;
        }

        var class_str = "local:" + TASK_CONTEXT_FILENAME;
        var number_str = fileName + "_" + fileId + "_" + id;
        var sql = "class=\"" + class_str + "\" and message.id=\"" + number_str + "\"";
        var message = new SCFile("scmessage");
        if (message.doSelect(sql) === RC_SUCCESS) {
            do {
                message.doDelete();
            }
            while (message.getNext() === RC_SUCCESS);
        }
        //delete scmessage for ManuaList
        if (contextconfigrecord.type == "list") {
            var msgclass = "sCfg." + fileName + "_" + fileId + "_" + id;
            var query = "class=\"" + msgclass + "\"";
            if (message.doSelect(query) === RC_SUCCESS) {
                do {
                    message.doDelete();
                } while (message.getNext() === RC_SUCCESS);
            }
        }
    },

    checkOutputOfTask: function(record) {
        return lib.TaskPlannerHelper.checkOutputOfTask(record);
    },

    localizeManualList: function(record, oldrecord) {
        if (!isRegisteredModelFileName(record.fileName)) { // do NOT localize the ticket context field name if it is not at model level
            var modelFileName = TPUTILITY.getTableNameByParentFileName(record.fileName, "Model");
            var modelId = TPUTILITY.getModelIdByTicketID(record.fileName, record.fileId);
            if (isFromModel(modelFileName, modelId, record.id)) {
                return;
            }
        }
        if (record.type === "list" || oldrecord.type === "list") {
            if (!funcs.same(oldrecord.valueList, record.valueList)) {
                var msgclass = "sCfg." + record.fileName + "_" + record.fileId + "_" + record.id;
                var actionType = "add";
                var ids = [];
                var labels = [];
                var i;
                var j;
                for (i in record.valueList) {
                    ids.push(record.valueList[i]);
                    labels.push(record.displayList[i]);
                }
                var language;
                language = "en";
                if (vars.$G_my_language !== null) {
                    language = vars.$G_my_language;
                }
                lib.localizeTable.localizeList(ids, labels, language, msgclass, actionType);
                var deleteFields = [];
                for (j in oldrecord.valueList) {
                    var match = false;
                    for (i in record.valueList) {
                        if (record.valueList[i] === oldrecord.valueList[j]) {
                            match = true;
                        }
                    }
                    if (match === false) {
                        deleteFields.push(oldrecord.valueList[j]);
                    }
                }
                if (deleteFields !== null) {
                    var deleteAction = "delete";
                    lib.localizeTable.localizeList(deleteFields, null, language, msgclass, deleteAction);
                }
            }
        }
    },

    /**
     * Get the ticket context field value according to the field name
     * @fileName The ticket file name.
     * @ticketNumber the ticket number.
     * @ticketContextFieldName the ticket context filed name.
     * 
     * @returns the value of the specified ticket context field.
     */
    getTicketContextFieldValue: function(fileName, ticketNumber, ticketContextFieldName) {
        var ticketContextConfigFile = new SCFile("ticketContextConfig", SCFILE_READONLY);
        var sql = "fileName=\"" + fileName + "\" and id=\"" + ticketContextFieldName + "\" and fileId=\"" + ticketNumber + "\"";
        ticketContextConfigFile.setFields(["value"]);
        if (ticketContextConfigFile.doSelect(sql) === RC_SUCCESS) {
            return ticketContextConfigFile.value;
        }
        return null;
    }
});

function getClass() {
    return TaskPlannerService;
}