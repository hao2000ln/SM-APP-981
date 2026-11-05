/**
 * @fileoverview  Handles functionality associated with Common task plan(changePlan table).
 * @
 */
var $ = lib.c.$;
var _ = lib.Underscore.require();
var log = getLog("TaskPlannerHelper");

//task initial status
var WAITING = "0";
var READY = "1";
var WITHDRAWN = "31";
var CANCELLED = "30";

//task waiting
var WAITING_NOT_WAITING = 0;
var WAITING_NO_PENDING = 1;
var WAITING_PENDING = 2;
var WAITING_PENDING_DONE = 3;
var TPUTILITY = lib.TaskPlannerUtilities;
var FILENAME = funcs.filename;


/**
 *	This function make child task waiting when parent task was not created.
 *
 *	@param {changeplan} plan - The Change Plan(changeplan) record.
 *	@param {number} index - the index of the task in the change plan.
 */
function setDependencyRelationship(plan, index) {
    var i = index;
    var pTaskCount = 0;
    if (plan.tasks[i].dependentIds != "" && plan.tasks[i].dependentIds != null) {
        pTaskCount = plan.tasks[i].dependentIds.length();
    }

    var lng = plan.tasks.length();
    var pTaskNumber = -1;
    var brk = 0;
    //if one or more parent tasks, find the null parent taskNumber.
    var n;
    var k;
    for (n = 0; n < pTaskCount; n++) {
        for (k = 0; k < lng; k++) {
            if (plan.tasks[i].dependentIds[n] == plan.tasks[k].taskId) {
                pTaskNumber = plan.tasks[k].taskNumber;
                if (!pTaskNumber) {
                    brk = 1;
                    break;
                }
            }
        }
        if (brk == 1) {
            break;
        }
    }

    if (pTaskNumber == -1) {
        return READY;
    } else if (pTaskNumber == "" || pTaskNumber == null) {
        return WAITING;
    } else {
        return READY;
    }
}

/**
 *  This function determines the status of a newly opened task
 *
 *  @param {number} index - the index of the task in the change plan
 *  @param {changePlan} plan - The Change Plan(changePlan) record
 *  @param {cm3r} change - The Change (cm3r) record associated with this change plan.
 */
function setInitStatus(index, plan, change) {
    //update $L.tableAccess if it is empty.
    //QCCR90225 Current Record Authorization condition expression is not working.
    lib.tableAccess.setTableAccess(change);
    evaluateConditionToStatus(plan, change, index);
    if (plan.tasks[index].activeCondValue === WITHDRAWN) {
        return plan.tasks[index].activeCondValue;
    } else {
        var taskWaitingStatus = getTaskWaitingStatus(plan, index);
        if (taskWaitingStatus === WAITING_PENDING) {
            return WAITING;
        }
    }
    return plan.tasks[index].activeCondValue;
}

/**
 *  This function evaluate tasks' activation condition in change plan.
 *  By default, it evaluate all tasks' condition. Otherwise, specify the index of task.
 *
 *  @param {changePlan} plan - The Change Plan(changePlan) record
 *  @param {cm3r} change - The Change (cm3r) record.
 *  @param {number} index - The index of the task in the change plan.
 */
function evaluateConditionToStatus(plan, change, index) {
    //backup the original variables
    funcs.parse_evaluate("$L.file.backup = $L.file", 11);

    //install the variable for the condition evaluation
    if (change === undefined || change === null) {
        change = new SCFile("cm3r");
        change.doSelect("number=\"" + plan.number + "\""); //ignore return code        
    }
    vars.$L_file = change;

    //evaluate the conditions and corresponding target status.
    var lng = plan.tasks.length();
    var i = 0;
    if (index !== null && index >= 0 && index < lng) {
        i = index;
        lng = index + 1;
    }

    var taskPlanerFileName = null;
    var taskPlanMapping = $("taskPlannerMapping", SCFILE_READONLY).setFields("taskFileName").select("parentFileName=\"" + plan.fileName + "\"").uniqueResult();
    if (taskPlanMapping) {
        taskPlanerFileName = taskPlanMapping["taskFileName"];
    }

    var enableTaskStrongDependency = lib.settings.getSettingValue("Condition Editor", "enable.task.strong.dependency");
    while (i < lng) {
        if (plan.tasks[i].activeCond === null || plan.tasks[i].activeCond === "") {
            var pIsActive = checkParentTaskActive(plan, plan.tasks[i].dependentIds, taskPlanerFileName);
            if (plan.tasks[i].dependentIds && pIsActive) {
                plan.tasks[i].activeCondValue = WAITING;
            } else {
                if (enableTaskStrongDependency == "true") {
                    plan.tasks[i].activeCondValue = setDependencyRelationship(plan, i);
                } else {
                    plan.tasks[i].activeCondValue = READY;
                }
            }
        } else {
            var cond = funcs.str(plan.tasks[i].activeCond);
            cond = cond.replace(new RegExp('"', 'g'), '\\"');
            vars.$L_category = funcs.nullsub(vars.$L_category, $("#cm3rcategoryService").getCategory(change["category"]));
            vars.$L_object = funcs.nullsub(vars.$L_object, $("#objectService").getObject(FILENAME(change)));
            var script = " $L.active=evaluate(parse(\"" + cond + "\", 4));if ($L.active=true) then ($L.active.status=\"1\") else ($L.active.status=\"31\")";

            // add by Xiong-jie MA, init the variables for cross table fields and user option support
            lib.Workflow.initVarForCondition(plan.tasks[i].activeCondXML);
            // end add by Xiong-jie MA

            funcs.parse_evaluate(script, 11);
            plan.tasks[i].activeCondValue = vars.$L_active_status;
        }
        i++;
    }
    //restore the original variables
    vars.$L_file = vars.$L_file_backup;
}

/**
 *  This function get parent tasks is active or not.
 *  Any one parent task is active, the function will return true
 *
 *  @param {changePlan} plan - The Change Plan(changePlan) record
 *  @param {array} ptaskids - parent task list in plan.
 *  @param {string} taskTableName - task table name.
 */
function checkParentTaskActive(plan, ptaskids, taskTableName) {
    if (!plan || !ptaskids || !taskTableName) {
        return false;
    }

    var lng = plan.tasks.length();
    var jlng = ptaskids.length();
    var i;
    var j;
    for (i = 0; i < lng; i++) {
        for (j = 0; j < jlng; j++) {
            if (plan.tasks[i].taskId == ptaskids[j]) {
                var taskquery = "false";
                if (plan.tasks[i].taskNumber) {
                    taskquery = "number=\"" + plan.tasks[i].taskNumber + "\"";
                }

                var pIsActive;

                var task = $(taskTableName, SCFILE_READONLY).setFields(["active", "status"]).select(taskquery).uniqueResult();
                if (task) { //if parent task was created, should check active status
                    if (task.active == true) { //if parent task is active, return true
                        return true;
                    } else if (task.status >= "30" || task.status == "Cancelled") { //if parent task was closed or cancelled, should check parent task's parent task
                        if (plan.tasks[i].dependentIds && plan.tasks[i].dependentIds.length() > 0) {
                            //recursion invoke, check parent task status.
                            pIsActive = checkParentTaskActive(plan, plan.tasks[i].dependentIds, taskTableName);
                            if (pIsActive) { //parent task's parent task is active, child task could waiting, so return true.
                                return true;
                            }
                        } else { //parent was closed or cancelled and parent task has't parent task, child task could active, so return false.
                            return false;
                        }
                    }
                } else { //if parent task was not opened, should set child to waiting, so return true.
                    if (plan.tasks[i].dependentIds && plan.tasks[i].dependentIds.length() > 0) {
                        //recursion invoke, check parent task status.
                        pIsActive = checkParentTaskActive(plan, plan.tasks[i].dependentIds, taskTableName);
                        //parent task's parent task is active, child task could waiting, so return true.
                        if (pIsActive) {
                            return true;
                        }
                    }
                }
            }
        } // for j
    } // for i

    return false;
}

/**
 *  This function get task's waiting status
 *
 *  It check whether a task is pending on other tasks and the other tasks' status
 *
 *  @param {changePlan} plan - The Change Plan(changePlan) record
 *  @param {number} index - The index of the task in the change plan.
 */
function getTaskWaitingStatus(plan, index) {
    if (plan.tasks[index].status !== null && plan.tasks[index].status !== WAITING) {
        return WAITING_NOT_WAITING;
    }

    var plan_tasks = plan.tasks;
    var deps = plan.tasks[index].dependentIds;
    var plan_task_deps = [];

    var i;
    var iLoopTimes;
    if (deps !== null) {
        iLoopTimes = deps.length();
        for (i = 0; i < iLoopTimes; i++) {
            plan_task_deps.push(deps[i]);
        }
        while (true) {
            var deps_insert = [];
            iLoopTimes = plan_tasks.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (funcs.index(plan_tasks[i].taskId, plan_task_deps) > 0 && plan.tasks[i].dependentIds !== null) {
                    var j;
                    var jLoopTimes = plan.tasks[i].dependentIds.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        deps_insert.push(plan.tasks[i].dependentIds[j]);
                    }
                }
            }
            for (i = deps_insert.length - 1; i >= 0; i--) {
                if (funcs.index(deps_insert[i], plan_task_deps) > 0) {
                    deps_insert.splice(i, 1);
                } else {
                    plan_task_deps.push(deps_insert[i]);
                }
            }
            if (deps_insert.length === 0) {
                break;
            }
        }
    }

    if (plan_task_deps.length > 0) {
        iLoopTimes = plan_tasks.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (i !== index) {
                var id = plan.tasks[i].taskId;
                if (funcs.index(id, plan_task_deps) > 0) {
                    if (plan.tasks[i].taskNumber !== null && plan.tasks[i].taskActive === true) {
                        return WAITING_PENDING;
                    } else if (plan.tasks[i].taskNumber === null || plan.tasks[i].taskNumber === "") {
                        if (plan.tasks[i].activeCond === null || plan.tasks[i].activeCond === "") {
                            return WAITING_PENDING;
                        } else {
                            if (plan.tasks[i].activeCondValue === null || plan.tasks[i].activeCondValue === "") {
                                return WAITING_PENDING;
                            } else if (plan.tasks[i].activeCondValue === WITHDRAWN) {
                                //return WAITING_PENDING;
                            }
                        }
                    }
                }
            }
        }
        return WAITING_PENDING_DONE;
    }

    return WAITING_NO_PENDING;
}


/**
 * Update waiting task status
 *
 * @returns {Number} updated number 
 */
function tryWatingTaskActivation(plan, index, newStatus, taskFileName, taskFileUk) {
    var taskNumber = plan.tasks[index].taskNumber;
    var task = new SCFile(taskFileName);
    var tsql = taskFileUk + " = \"" + taskNumber + "\"";
    if (task.doSelect(tsql) === RC_SUCCESS) {
        if (plan.tasks[index].taskStatus === WAITING && (newStatus === WITHDRAWN || newStatus === READY)) {
            task.status = getTaskStatusFromStatusMapping(newStatus, FILENAME(task));

            logInfo(`Update waiting task ${taskNumber} to ${task.status}.`);

            vars.$bypass_bg_authcheck = true;
            var rc = task.doAction("save");
            vars.$bypass_bg_authcheck = false;

            plan.tasks[index].taskActive = task['record.active'];
            plan.tasks[index].taskStatus = newStatus;

            // update successfully
            if (RC_SUCCESS === rc && task.status !== getTaskStatusFromStatusMapping(WAITING, FILENAME(task))) {
                return 1;
            }

            var msg = `Unable to update status of task ${taskNumber}.`;
            if (rc != RC_SUCCESS) {
                msg += " " + RCtoString(rc);
            }
            logInfo(msg);
        }
    }

    return 0;
}

function updateWaitingTasks(plan, change, depth) {
    var numberOfUpdate = null;
    var numberofLoop = 0;
    var parentFileName = FILENAME(change);

    //set up control variables
    var tempValid = false;
    if (vars.$bypass_failed_validation !== null) {
        tempValid = vars.$bypass_failed_validation;
    }
    vars.$bypass_failed_validation = true;

    //disable task's trigger to update pending task
    var tempFromPlan = false;
    if (vars.$from_changePlan !== null) {
        tempFromPlan = vars.$from_changePlan;
    }
    vars.$from_changePlan = true;
    while (numberOfUpdate === null || numberOfUpdate > 0) {
        numberOfUpdate = 0;
        numberofLoop++;
        var lng = plan.tasks.length();
        var i;
        for (i = 0; i < lng; i++) {
            if (plan.tasks[i].taskNumber !== null) {
                if (plan.tasks[i].taskActive != false && plan.tasks[i].taskStatus === WAITING) {
                    var targetStatus = setInitStatus(i, plan, change);
                    var taskFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
                    var taskFileUk = TPUTILITY.getUniqueKey(taskFileName);
                    numberOfUpdate = numberOfUpdate + tryWatingTaskActivation(plan, i, targetStatus, taskFileName, taskFileUk);
                }
            }
        }
    }

    //restore the original bypass validation flag.    
    vars.$bypass_failed_validation = tempValid;
    vars.$from_changePlan = tempFromPlan;
}

/**
 * Get Left Phases from phaseName in the workflow  
 * return the Phase Array saved in the totalPhases
 */
function getToPhases(workflow, phaseName, fileName, totalPhases) {
    if (phaseName !== null && phaseName !== "" && totalPhases[phaseName] == null) {
        var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
        var query = "workflowName=\"" + workflow + "\" and phaseName=\"" + phaseName + "\"" + " and tableName=\"" + fileName + "\"";
        if (wfPhase.doSelect(query) === RC_SUCCESS) {
            //only add active phases
            if (wfPhase.active === true) {
                totalPhases[phaseName] = true;
            }
            var toPhase;
            //check all the default transition
            if (null !== wfPhase.defaultTransition && "" !== wfPhase.defaultTransition) {
                toPhase = wfPhase.defaultTransition;
                getToPhases(workflow, toPhase, fileName, totalPhases);
            }
            //check all the auto transition
            var lng = funcs.lng(wfPhase.autoTransition);
            var i;
            for (i = 0; i < lng; i++) {
                toPhase = wfPhase.autoTransition[i].atToPhase;
                getToPhases(workflow, toPhase, fileName, totalPhases);
            }
            //check all the manual transition
            lng = funcs.lng(wfPhase.manualTransition);
            for (i = 0; i < lng; i++) {
                toPhase = wfPhase.manualTransition[i].mtToPhase;
                getToPhases(workflow, toPhase, fileName, totalPhases);
            }
        }
    }
}

/**
 *  This function checks to see if a Change is allowed to leave the current phase based on the
 *  closedByPhase fields in the Change Plan.
 *
 *
 *  @param {String} fromPhase - The Name of the current phase
 *  @param {changePlan} plan - The current Change Plan
 *  @param {String} workflowName - The Name of the current workflow
 *  @param {String} toPhase - next phase you want to move to
 */
function checkCanLeavePhase(workflowName, fromPhase, toPhase, plan, allowOpen) {
    //  If there is no plan simply return true
    if (plan === null) {
        return null;
    }

    var parentFileName = plan.fileName;
    var taskFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
    var needToClose = [];
    if (allowOpen !== true) {
        allowOpen = false;
    } else {
        return needToClose;
    }

    var allReachablePhase = null;

    //  Otherwise loop through the tasks and make sure the correct ones are closed
    var i;
    var lng = plan.tasks.length();
    for (i = 0; i < lng; i++) {
        var task = plan.tasks[i];
        if (task.taskActive === true && !isLegacyFinishedStatus(getTaskStatusFromStatusMapping(task.taskStatus, taskFileName))) {
            if (allReachablePhase == null) {
                allReachablePhase = {};
                getToPhases(workflowName, toPhase, parentFileName, allReachablePhase);
            }

            var closeByPhase = task.closeByPhase;
            if (closeByPhase == null || closeByPhase === "" || closeByPhase === fromPhase || !allReachablePhase[closeByPhase]) {
                needToClose.push(task.taskNumber);
            }
        }
    }

    //  Return the list of tasks that need to close.
    return needToClose;
}

/**
 *  This function is to check whether whether the status in legacy task category should be considerred as finished.
 *  With these status , category phase with this task can move to next phase successfully. 
 *  Currently for legacy task category , if the status is cancelled(30) or withdrawed(31),we will treat them as finished . 
 *
 *  @param {number} status - The value of status
 *  
 */
function isLegacyFinishedStatus(status) {
    if (status === CANCELLED || status === WITHDRAWN) {
        return true;
    }
    return false;
}

/**
 *  This function updates the Change Plan when a task is created or updated
 *  @param {SCFile} task - the task that is created or updated.
 */
function updatePlan(task) {
    var startTasks = false;
    var sql;
    var parentFileName;
    var parentFileUniqueKey;
    var parentFile;

    if (vars.$from_changePlan === null || vars.$from_changePlan !== true || vars.$from_changePlan === undefined) {
        var plan = new SCFile("changePlan");
        sql = "number=\"" + task.parentTicket + "\"";
        if (plan.doSelect(sql) === RC_SUCCESS) {
            if (plan !== null) {
                var exists = false;
                var lng = funcs.lng(funcs.denull(plan.tasks));
                var lastId = 1;
                var i;
                for (i = 0; i < lng; i++) {
                    if (plan.tasks[i].taskNumber === task.number) {
                        //refresh the correspond task plan record
                        exists = true;
                        //Add status map here
                        //Common Task Status
                        var taskStatusField = TPUTILITY.getTaskStatusField(FILENAME(task));
                        var commonTaskStatus = getTaskPlannerStatusFromStatusMapping(task[taskStatusField], FILENAME(task));
                        plan.tasks[i].taskActive = task['record.active'];
                        if ("" !== commonTaskStatus && null !== commonTaskStatus && !funcs._null(commonTaskStatus)) {
                            plan.tasks[i].taskStatus = commonTaskStatus;
                        }

                        var intStatus = funcs.val(commonTaskStatus);
                        //current task is closed
                        if (task['record.active'] === false || task.open === false || (intStatus !== null && intStatus > 19)) {
                            startTasks = true;
                        }
                    } else {
                        // set to true if exists closed task
                        if (plan.tasks[i].taskActive === false) {
                            startTasks = true;
                        }
                    }

                    lastId = Math.max(lastId, plan.tasks[i].taskId);
                }
                if (exists === false) {
                    plan.tasks = funcs.insert(plan.tasks, 1, 0);
                    plan.tasks[i].taskId = lastId + 1;
                    plan.tasks[i].taskNumber = task.number;
                    plan.tasks[i].taskStatus = task.status;
                    plan.tasks[i].taskCategory = task.category;
                    plan.tasks[i].taskDescription = task.brief_desc;
                    plan.tasks[i].taskAssignment = task.assign_dept;
                    plan.tasks[i].taskActive = task['record.active'];
                    parentFileName = TPUTILITY.getTableNameByTaskFileName(FILENAME(task), "Module");
                    parentFileUniqueKey = TPUTILITY.getUniqueKey(parentFileName);
                    parentFile = new SCFile(parentFileName, SCFILE_READONLY);
                    parentFile.setFields(["current.phase"]);
                    sql = parentFileUniqueKey + "=\"" + task.parentTicket + "\"";
                    var ret = parentFile.doSelect(sql);
                    if (ret === RC_SUCCESS) {
                        plan.tasks[i].openInPhase = parentFile.current_phase;
                    }
                }
                plan.doUpdate();
            }
        }
    }

    // Logic to start tasks that were dependent on tasks that have been closed.
    if (startTasks === true) {
        parentFileName = TPUTILITY.getTableNameByTaskFileName(FILENAME(task), "Module");
        parentFileUniqueKey = TPUTILITY.getUniqueKey(parentFileName);
        parentFile = new SCFile(parentFileName);
        sql = parentFileUniqueKey + "=\"" + task.parentTicket + "\"";
        if (parentFile.doSelect(sql) === RC_SUCCESS) {
            // evaluate condition for all tasks
            lib.tableAccess.setTableAccess(parentFile);
            evaluateConditionToStatus(plan, parentFile);

            updateWaitingTasks(plan, parentFile);
        }
    }
}

function commonStatusToLocalStatus(commonStatus, taskFile) {
    if (FILENAME(taskFile) === "cm3t") {
        return commonStatus;
    }

    var ret = "";
    if (commonStatus !== null && commonStatus !== "") {
        if (commonStatus === "1") {
            ret = "Ready";
        } else if (commonStatus === "0") {
            ret = "Planned";
        } else if (commonStatus === "31") {
            ret = "Withdrawn";
        } else if (commonStatus === "22") {
            ret = "Closed";
        } else if (commonStatus === "20") {
            ret = "Completed";
        } else if (commonStatus === "30") {
            ret = "Cancelled";
        }
    }

    return ret;
}

function LocalStatusToCommonStatus(localStatus, taskFile) {

    if (FILENAME(taskFile) === "cm3t") {
        return localStatus;
    }

    var ret = "-1";
    if (localStatus !== null && localStatus !== "") {
        if (localStatus === "Ready" || localStatus === "In Progress") {
            ret = "1";
        } else if (localStatus === "Planned") {
            ret = "0";
        } else if (localStatus === "Withdraw") {
            ret = "31";
        } else if (localStatus === "Closed") {
            ret = "22";
        } else if (localStatus === "Completed") {
            ret = "20";
        } else if (localStatus === "Cancelled") {
            ret = "30";
        }
    }

    return ret;
}


function enableEditTicketContext(fileId, fileName) {
    var fRec = new SCFile("ticketContextConfig", SCFILE_READONLY);
    var sql = "fileId=\"" + fileId + "\" and fileName=\"" + fileName + "\"";
    var selectRC = fRec.doSelect(sql);
    if (selectRC === RC_SUCCESS) {
        return true;
    }

    return false;
}


function referenceCheck(fileId, fileName, ticketCotnextTicketID) {
    var ret = false;
    var changePlan = new SCFile("changePlan", SCFILE_READONLY);
    var sql = "fileId=\"" + fileId + "\" and fileName=\"" + fileName + "\"";

    if (changePlan.doSelect(sql) === RC_SUCCESS) {
        var tasks = changePlan.tasks;
        var len = tasks.length();
        var i;
        var j;
        for (i = 0; i < len; i++) {
            var temp = tasks[i].inputs;
            if (temp != null) {
                var len1 = temp.length();
                for (j = 0; j < len1; j++) {
                    if (temp[j].inputType === "3" && temp[j].inputId === ticketCotnextTicketID) {
                        ret = true;
                    }
                }
            }
            temp = tasks[i].outputs;
            if (temp != null) {
                len1 = temp.length();
                for (j = 0; j < len1; j++) {
                    if (temp[j].outputType === "3" && temp[j].outputId === ticketCotnextTicketID) {
                        ret = true;
                    }
                }
            }
        }
    }

    return ret;
}

function checkOutputOfTask(taskfile) {
    var fileId = taskfile.parentTicket;
    var fileName = TPUTILITY.getTableNameByTaskFileName(FILENAME(taskfile), "ticket");
    var taskFileKey = TPUTILITY.getUniqueKey(FILENAME(taskfile));
    var taskID = taskfile[taskFileKey];

    var ret = false;
    var changePlan = new SCFile("changePlan", SCFILE_READONLY);
    var sql1 = "fileId=\"" + fileId + "\" and fileName=\"" + fileName + "\"";
    if (changePlan.doSelect(sql1) === RC_SUCCESS) {
        var sql = "(";
        var tasks = changePlan.tasks;
        var len = tasks.length();
        var i;
        var j;
        for (i = 0; i < len; i++) {
            if (tasks[i].taskNumber === taskID) {
                var outputs = tasks[i].outputs;
                var len1 = outputs.length();
                for (j = 0; j < len1; j++) {
                    var t = outputs[j];
                    if (j > 0) {
                        sql = sql + " or ";
                    }
                    sql = sql + " id=\"" + t.outputId + "\"";
                }
            }
        }

        sql = sql + ") and fileId=\"" + fileId + "\" and fileName=\"" + fileName + "\" ";
        var tcc = new SCFile("ticketContextConfig", SCFILE_READONLY);
        tcc.setFields("value");
        if (tcc.doSelect(sql) === RC_SUCCESS) {
            do {
                if (tcc.value === "" || tcc.value === null) {
                    ret = true;
                    break;
                }
            } while (tcc.getNext() === RC_SUCCESS);
        }
    }

    return ret;
}

function getFileFieldbak(fileName) {
    var fields = [];
    var fieldName = [];
    var caption = [];
    vars.$fieldList = [];
    vars.$fieldCaptionList = [];
    fields = lib.TaskPlannerRemoteServiceImplementation.getParentFileFields(fileName);
    var i;
    for (i = 0; i < fields.length; i++) {
        vars.$fieldList.push(fields[i].name);
        vars.$fieldCaptionList.push(fields[i].description);
    }
}

function getFileField(fileName) {
    var fieldType = [];
    var fieldName = [];
    var caption = [];
    vars.$fieldList = [];
    vars.$fieldCaptionList = [];

    fieldType.push($.Logical);
    fieldType.push($.Character);
    fieldType.push($.Number);
    var fields = $("#datadictService").getFileFields(fileName, fieldType);
    _.each(fields, function(field) {
        vars.$fieldList.push(field.value);
        vars.$fieldCaptionList.push(field.disp);
    });
}

function getFieldGlobalList(fileName, fieldName, fromDs) {

    var taskMapping = new SCFile("taskPlannerMapping", SCFILE_READONLY);
    var mapSql = "taskFileName=\"" + fileName + "\"";
    taskMapping.doSelect(mapSql);
    var oriStatusField = taskMapping['taskStatusField'];

    var oriTaskStatus = [];
    var oriTaskPlannerStatus = [];
    var gl = "";
    var caption = "";
    var f = new SCFile("datadict", SCFILE_READONLY);
    var sql = "name=\"" + fileName + "\"";
    if (f.doSelect(sql) === RC_SUCCESS) {
        var fields = f.fields;
        var gls = f.globallist;
        var caps = f.captions;
        var i;
        var iLoopTimes = fields.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (fieldName === fields[i]) {
                gl = gls[i];
                caption = caps[i];
                var captionStr = funcs.scmsg(caption, "sccaption");
                if (null !== captionStr && captionStr.indexOf("Could not be found") == -1) {
                    caption = captionStr;
                }
                break;
            }
        }
    }

    var a;
    var aLoopTimes = taskMapping.statusMapping.length();
    for (a = 0; a < aLoopTimes; a++) {
        oriTaskStatus[a] = taskMapping.statusMapping[a].taskStatus;
        oriTaskPlannerStatus[a] = taskMapping.statusMapping[a].taskPlannerStatus;
    }

    var n;
    var lng = vars.$L_file.statusMapping.length();
    for (n = 0; n < lng; n++) {
        vars.$L_file.statusMapping = funcs._delete(vars.$L_file.statusMapping, 1, 1);
    }

    if ("" !== gl && null !== gl) {
        vars.$taskStatusValue = [];
        vars.$taskStatusDis = [];

        var glFile = new SCFile("globallists", SCFILE_READONLY);
        var glsql = "name=\"" + gl + "\"";
        if (glFile.doSelect(glsql) === RC_SUCCESS) {
            var vlaueV = glFile['list.variable'];
            var disV = glFile['display.variable'];
            vars.$taskStatusValue = vars[vlaueV];
            vars.$taskStatusDis = vars[disV];
            var j;
            var jLoopTimes = vars.$taskStatusValue.length();
            for (j = 0; j < jLoopTimes; j++) {
                vars.$L_file.statusMapping = funcs.insert(vars.$L_file.statusMapping, 1, 0);
                vars.$L_file.statusMapping[j].taskStatus = vars.$taskStatusValue[j];
                //added below statements to dynamicly address global list
                if (oriTaskStatus.length > 0 && oriTaskPlannerStatus.length > 0) {
                    var z;
                    for (z = 0; z < oriTaskStatus.length; z++) {
                        if (oriTaskStatus[z] == vars.$taskStatusValue[j] && fieldName == oriStatusField) {
                            vars.$L_file.statusMapping[j].taskPlannerStatus = oriTaskPlannerStatus[z];
                            break;
                        }
                    }
                }
            }
        }
    } else {
        if (null !== fieldName && "" !== fieldName) {
            logInfo("Please configure related global list for Task Status Field '" + caption + "'.");
            funcs.msg(funcs.scmsg("3", "taskplannermapping", [caption]), 2);
        }
    }
}

function checkStatusMapping(fileRecord, status) {
    var rt = 0;
    var lng = funcs.lng(funcs.denull(fileRecord.statusMapping));
    var i;
    for (i = 0; i < lng; i++) {
        if (status == fileRecord.statusMapping[i].taskPlannerStatus) {
            rt++;
        }
    }
    return rt;
}

function checkAllStatusHasMapping(fileRecord) {
    var rt = 1;
    var lng = funcs.lng(funcs.denull(fileRecord.statusMapping));
    var i;
    for (i = 0; i < lng; i++) {
        if ("" == fileRecord.statusMapping[i].taskPlannerStatus || null == fileRecord.statusMapping[i].taskPlannerStatus) {
            rt = 0;
            break;
        }
    }

    return rt;
}

function getTaskStatusFromStatusMapping(tempstatus, taskTableName) {
    var status = "";
    var sql = "taskFileName=\"" + taskTableName + "\"";
    var taskplmap = $.cachedSelect("taskPlannerMapping", sql);

    if (taskplmap != null) {
        var lng = funcs.lng(funcs.denull(taskplmap.statusMapping));
        var i;
        for (i = 0; i < lng; i++) {
            if (tempstatus == taskplmap.statusMapping[i].taskPlannerStatus) {
                status = taskplmap.statusMapping[i].taskStatus;
                break;
            }
        }
    } else {
        logInfo("Can not find Task Planner Mapping record for task table " + taskTableName);
    }

    return status;
}

function getTaskPlannerStatusFromStatusMapping(tempstatus, taskTableName) {
    var status = "";
    var sql = "taskFileName=\"" + taskTableName + "\"";
    var taskplmap = $.cachedSelect("taskPlannerMapping", sql);

    if (taskplmap != null) {
        var lng = funcs.lng(funcs.denull(taskplmap.statusMapping));
        var i;
        for (i = 0; i < lng; i++) {
            if (tempstatus == taskplmap.statusMapping[i].taskStatus) {
                status = taskplmap.statusMapping[i].taskPlannerStatus;
                break;
            }
        }
    } else {
        logInfo("Can not find Task Planner Mapping record for task table " + taskTableName);
    }

    return status;
}

function logInfo(info) {
    if (log.isInfoEnabled()) {
        log.info(info);
    }
}