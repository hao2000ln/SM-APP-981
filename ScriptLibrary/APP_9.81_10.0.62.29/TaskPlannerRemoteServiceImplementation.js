var $ = lib.c.$;
var TASKPLANTABLE = "changePlan";
var TICKETMODELFIELD = "modelId";
var TPUTILITY = lib.TaskPlannerUtilities;
var FILENAME = funcs.filename;
var WAITING = "0";
var QueryEditor = lib.QueryEditorParser;

/**
 *  This function saves task plan information into changePlan table for both Model and Ticket level.
 *  
 *  @param {Strinig} editorType - model or ticket.
 *  @param {Strinig} taskXml - Planned task info in Task Planner Editor returned from Web Client.
 *  
 */
function saveTaskPlan(editorType, parentFileName, taskXml) {
    if ("" == parentFileName || null == parentFileName || parentFileName == undefined || "null" == parentFileName) {
        return saveLegacyTaskPlan(editorType, taskXml);
    }

    var resp = {};
    resp.error = false;
    resp.errorMessage = "no message";
    if (null === taskXml || "" === taskXml) {
        logInfo("Task Planner info is empty.");
        resp.error = true;
        resp.errorMessage = funcs.scmsg("19", "taskplan");
        return resp;
    }

    if (taskXml !== null && taskXml !== "") {
        var taskxml = new XML();
        var i = 0;
        taskxml.setContent(taskXml);
        var xml = taskxml.getDocumentElement();
        var fileName = "";
        var id = "";
        if (xml !== null) {
            var element = xml.getFirstChildElement();
            if (element !== null) {
                var _INSERT = funcs.insert;
                var _VAL = funcs.val;
                var _XMLHELPER = lib.xmlHelpers;
                var _TASKS = "";
                fileName = element.getValue();
                element = element.getNextSiblingElement(); //fileId
                id = element.getValue();
                if (null === fileName || "" === fileName || null === id || "" === id) {
                    logInfo("Task Planner info is not correct. Please provide both fileName and fileId");
                    resp.error = true;
                    resp.errorMessage = funcs.scmsg("20", "taskplan");

                    return resp;
                }
                var taskPlan = new SCFile(TASKPLANTABLE);
                var taskPlanSql = "number=\"" + id + "\" and fileName=\"" + fileName + "\"";
                if (taskPlan.doSelect(taskPlanSql) === RC_SUCCESS) {
                    var n;
                    var lng = taskPlan.tasks.length();
                    for (n = 0; n < lng; n++) {
                        taskPlan.tasks = funcs._delete(taskPlan.tasks, 1, 1);
                    }
                }
                element = element.getNextSiblingElement();
                element = element.getFirstChildElement();
                if (element !== null) {
                    do {
                        _TASKS = taskPlan.tasks[i];
                        taskPlan.tasks = _INSERT(taskPlan.tasks, 1, 0);
                        var tempElement = _XMLHELPER.getElement(element, "taskId", null);
                        if (tempElement !== null) {
                            _TASKS.taskId = _VAL(tempElement.getValue());
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskNumber", null);
                        if (tempElement !== null) {
                            _TASKS.taskNumber = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskStatus", null);
                        if (tempElement !== null) {
                            _TASKS.taskStatus = tempElement.getValue();
                            if (editorType === "ticket" && tempElement.getValue() === "undefined") {
                                _TASKS.taskStatus = WAITING;
                            }
                            if (editorType === "model" && tempElement.getValue() === "undefined") {
                                _TASKS.taskStatus = "";
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskActive", null);
                        if (tempElement !== null) {
                            _TASKS.taskActive = _VAL(tempElement.getValue(), 4);
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskCategory", null);
                        if (tempElement !== null) {
                            _TASKS.taskCategory = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskCoords", null);
                        if (tempElement !== null) {
                            _TASKS.taskCoords = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskSize", null);
                        if (tempElement !== null) {
                            _TASKS.taskSize = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskTemplate", null);
                        if (tempElement !== null) {
                            _TASKS.taskTemplate = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskDescription", null);
                        if (tempElement !== null) {
                            _TASKS.taskDescription = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "openInPhase", null);
                        if (tempElement !== null) {
                            _TASKS.openInPhase = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "closeByPhase", null);
                        if (tempElement !== null) {

                            _TASKS.closeByPhase = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskAssignment", null);
                        if (tempElement !== null) {
                            _TASKS.taskAssignment = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskOOFlowLink", null);
                        if (tempElement !== null) {
                            _TASKS.taskOOFlowLink = tempElement.getValue();
                        }
                        /*Active Condition*/
                        tempElement = _XMLHELPER.getElement(element, "activeCondDesc", null);

                        if (tempElement !== null) {
                            _TASKS.activeCondDesc = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "activeCondXML", null);

                        if (tempElement !== null) {
                            tempElement = tempElement.getFirstChildElement();

                            if (tempElement !== null) {
                                _TASKS.activeCondXML = tempElement.toXMLString();
                                var result = lib.conditionXmlParser.getRadQueryFromCondtionXml(_TASKS.activeCondXML);
                                _TASKS.activeCond = lib.WorkflowTriggers.convertResult(result[0]);
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "mandatory", null);
                        if (tempElement !== null) {
                            tempElement = tempElement.getValue();
                            _TASKS["mandatory"] = tempElement;

                        }
                        tempElement = _XMLHELPER.getElement(element, "dependentIds", null);
                        var dI;
                        if (tempElement !== null) {
                            dI = 0;
                            var dIdElement = tempElement.getFirstChildElement();
                            if (dIdElement !== null) {
                                do {
                                    _TASKS.dependentIds = _INSERT(_TASKS.dependentIds, 0, 1, _VAL(dIdElement.getValue()));
                                    dIdElement = dIdElement.getNextSiblingElement();
                                    dI++;
                                } while (dIdElement !== null);
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "dependentCoords", null);
                        if (tempElement !== null) {
                            dI = 0;
                            var dCoordElement = tempElement.getFirstChildElement();
                            if (dCoordElement !== null) {
                                do {
                                    _TASKS.dependentCoords = _INSERT(_TASKS.dependentCoords, 0, 1, funcs.str(dCoordElement.getValue()));
                                    dCoordElement = dCoordElement.getNextSiblingElement();
                                    dI++;
                                } while (dCoordElement !== null);
                            }
                        }

                        var tpElmt;

                        tempElement = _XMLHELPER.getElement(element, "taskFieldsSetting", null);

                        if (tempElement !== null) {
                            var fS = 0;
                            var fSetting = tempElement.getFirstChildElement();
                            if (fSetting !== null) {
                                do {
                                    funcs.log("do taskFieldsSetting");
                                    if (_TASKS.taskFieldsSetting === null) {
                                        _TASKS.taskFieldsSetting = $.createSCArray();
                                    }

                                    _TASKS.taskFieldsSetting = _INSERT(_TASKS.taskFieldsSetting, 1, 0);
                                    tpElmt = _XMLHELPER.getElement(fSetting, "fieldName", null);
                                    var field = "";
                                    if (tpElmt !== null) {
                                        field = tpElmt.getValue();
                                        _TASKS.taskFieldsSetting[fS].fieldName = field;
                                    }
                                    tpElmt = _XMLHELPER.getElement(fSetting, "fieldValue", null);
                                    if (tpElmt !== null) {
                                        var value = tpElmt.getValue();
                                        var originalvalue = tpElmt.getValue();
                                        var taskTableName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
                                        if ("" === taskTableName) {
                                            logInfo("Please configure Common Task Planner Mapping for table '" + parentFileName + "'.");
                                            resp.error = true;
                                            resp.errorMessage = funcs.scmsg("21", "taskplan", [parentFileName]);

                                            return resp;
                                        }
                                        var task = new SCFile(taskTableName);
                                        try {
                                            if (task.getFieldType(field) == 8) { // 8: array type
                                                if (value && !(value instanceof Array)) {
                                                    value = [value];
                                                }
                                            }

                                            task.setFieldValue(field, value);
                                        } catch (e) {
                                            logInfo("Field set error in task '" + _TASKS.taskDescription + "': can not set '" + value + "' to field '" + field + "'.");
                                            resp.error = true;
                                            resp.errorMessage = funcs.scmsg("22", "taskplan", [_TASKS.taskDescription, value, field]);
                                            return resp;
                                        }
                                        _TASKS.taskFieldsSetting[fS].fieldValue = originalvalue;
                                    }
                                    fSetting = fSetting.getNextSiblingElement();
                                    fS++;
                                } while (fSetting !== null);
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "inputs", null);
                        if (tempElement !== null) {
                            var iP = 0;
                            var iPuts = tempElement.getFirstChildElement();
                            if (iPuts !== null) {
                                do {
                                    if (_TASKS.inputs === null) {
                                        _TASKS.inputs = $.createSCArray();
                                    }
                                    _TASKS.inputs = _INSERT(_TASKS.inputs, 1, 0);
                                    tpElmt = _XMLHELPER.getElement(iPuts, "inputId", null);
                                    if (tpElmt !== null) {
                                        _TASKS.inputs[iP].inputId = tpElmt.getValue();
                                    }
                                    tpElmt = _XMLHELPER.getElement(iPuts, "inputType", null);
                                    if (tpElmt !== null) {
                                        _TASKS.inputs[iP].inputType = tpElmt.getValue();
                                    }
                                    iPuts = iPuts.getNextSiblingElement();
                                    iP++;
                                } while (iPuts !== null);
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "outputs", null);
                        if (tempElement !== null) {
                            var oP = 0;
                            var oPuts = tempElement.getFirstChildElement();
                            if (oPuts !== null) {
                                do {
                                    if (_TASKS.outputs === null) {
                                        _TASKS.outputs = $.createSCArray();
                                    }
                                    _TASKS.outputs = _INSERT(_TASKS.outputs, 1, 0);
                                    tpElmt = _XMLHELPER.getElement(oPuts, "outputId", null);
                                    if (tpElmt !== null) {
                                        _TASKS.outputs[oP].outputId = tpElmt.getValue();
                                    }
                                    tpElmt = _XMLHELPER.getElement(oPuts, "outputType", null);
                                    if (tpElmt !== null) {
                                        _TASKS.outputs[oP].outputType = tpElmt.getValue();
                                    }
                                    oPuts = oPuts.getNextSiblingElement();
                                    oP++;
                                } while (oPuts !== null);
                            }
                        }
                        i++;
                        element = element.getNextSiblingElement();
                    } while (element !== null);
                }
            }
        }

        taskPlan.number = id;
        taskPlan.fileName = fileName;

        if (validateTaskPlan(taskPlan, parentFileName, resp)) {
            taskPlan.doSave();
            if (editorType === "ticket") {
                var record = new SCFile(fileName);
                var key = TPUTILITY.getUniqueKey(fileName);
                if ("" === key) {
                    logInfo("Can not find the UniqueKey of table " + fileName);
                    resp.error = true;
                    resp.errorMessage = funcs.scmsg("23", "taskplan", [fileName]);
                    return resp;
                }
                var sql = "" + key + "=\"" + id + "\"";
                if (record.doSelect(sql) === RC_SUCCESS) {
                    $("#taskPlannerService").preOpenTask(record);
                }
            }
        } else {
            return resp;
        }
    }
    return resp;
}

function validateTaskPlan(taskPlan, parentFileName, resp) {
    var valid = true;
    var tasks = taskPlan.tasks;
    var i;
    var iLoopTimes = tasks.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (funcs.lng(funcs.denull(tasks[i].dependentIds)) > 0) {
            var j;
            var jLoopTimes = tasks[i].dependentIds.length();
            for (j = 0; j < jLoopTimes; j++) {
                var parentTask = getParentTaskByDependId(tasks, tasks[i].dependentIds[j]);
                var taskNodeName = tasks[i].taskDescription;
                //Depended task exists
                if (parentTask) {
                    var parentCategory = TPUTILITY.getParentCategory(taskPlan.number, taskPlan.fileName);
                    var workflowName = TPUTILITY.getWorkFlow(parentFileName, parentCategory);
                    if (!validateReachablePhase(workflowName, parentFileName, parentTask.openInPhase, tasks[i].openInPhase)) {
                        valid = false;
                        logInfo("The Open In Phase of task '" + taskNodeName + "' cannot be set prior to the Open In Phase of its dependent task.");
                        resp.error = true;
                        resp.errorMessage = funcs.scmsg("24", "taskplan", [taskNodeName]);
                        return valid;
                    }
                    var closePhase1 = parentTask.closeByPhase;
                    var closePhase2 = tasks[i].closeByPhase;
                    if ("" === closePhase1 || null === closePhase1) {
                        closePhase1 = parentTask.openInPhase;
                    }
                    if ("" === closePhase2 || null === closePhase2) {
                        closePhase2 = tasks[i].openInPhase;
                    }
                    if (!validateReachablePhase(workflowName, parentFileName, closePhase1, closePhase2)) {
                        valid = false;
                        logInfo("The Close By Phase of task '" + taskNodeName + "' cannot be set prior to the Close By Phase of its dependent task. Please be noted that if the Close By Phase is empty , it will take Open In Phase value by default.");
                        resp.error = true;
                        resp.errorMessage = funcs.scmsg("25", "taskplan", [taskNodeName]);
                        return valid;
                    }
                } else {
                    valid = false;
                    logInfo("Can not find the dependent task of task '" + taskNodeName + "'");
                    resp.error = true;
                    resp.errorMessage = funcs.scmsg("26", "taskplan", [taskNodeName]);
                    return valid;
                }
            }
        }
    }
    return valid;
}

function getParentTaskByDependId(tasks, taskId) {
    var i;
    var iLoopTimes = tasks.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (tasks[i].taskId === taskId) {
            return tasks[i];
        }
    }
    return null;
}

function validateReachablePhase(workflowName, parentFileName, startPhase, endPhase) {
    var ret = true;
    var avaiPhases = [];
    getPhasesAfterCurrentPhase(workflowName, parentFileName, startPhase, avaiPhases);
    if (!lib.ArrayUtil.contains(avaiPhases, endPhase)) {
        ret = false;
    }
    return ret;
}

/**
 *  This method is for legacy apps (before 940)
 *
 */
function saveLegacyTaskPlan(editorType, taskXml) {

    var resp = {};
    resp.error = false;
    resp.errorMessage = "no message";
    if (null === taskXml || "" === taskXml) {
        logInfo("Task Planner info is null.");
        resp.error = true;
        resp.errorMessage = "Task Planner info is null.";
        return resp;
    }
    if (taskXml !== null && taskXml !== "") {
        var taskxml = new XML();
        var i = 0;
        taskxml.setContent(taskXml);
        var xml = taskxml.getDocumentElement();
        if (xml !== null) {

            var element = xml.getFirstChildElement();
            if (element !== null) {
                var _INSERT = funcs.insert;
                var _VAL = funcs.val;
                var _XMLHELPER = lib.xmlHelpers;
                var _TASKS = "";
                var fileName = element.getValue();
                element = element.getNextSiblingElement(); //fileId
                var id = element.getValue();
                if (null === id || "" === id) {
                    logInfo("Task Planner info is not correct. Please provide fileId.");
                    resp.error = true;
                    resp.errorMessage = "Task Planner info is not correct. Please provide fileId.";
                    return resp;
                }
                var planTable = "changePlan";
                var taskPlanSql = "number=\"" + id + "\"";
                if (editorType === "model") {
                    planTable = "changeModel";
                    taskPlanSql = "id=\"" + id + "\"";
                }
                var taskPlan = new SCFile(planTable);

                if (taskPlan.doSelect(taskPlanSql) === RC_SUCCESS) {
                    var n;
                    var lng = taskPlan.tasks.length();
                    for (n = 0; n < lng; n++) {
                        taskPlan.tasks = funcs._delete(taskPlan.tasks, 1, 1);
                    }
                } else {
                    if (editorType === "model") {
                        logInfo("Please save change model firstly.");
                        resp.error = true;
                        resp.errorMessage = "Please save change model firstly.";
                        return resp;
                    }
                }
                element = element.getNextSiblingElement();
                element = element.getFirstChildElement();
                if (element !== null) {
                    do {
                        _TASKS = taskPlan.tasks[i];
                        taskPlan.tasks = _INSERT(taskPlan.tasks, 1, 0);
                        var tempElement = _XMLHELPER.getElement(element, "taskId", null);
                        if (tempElement !== null) {
                            _TASKS.taskId = _VAL(tempElement.getValue());
                        }

                        if (editorType === "ticket") {
                            tempElement = _XMLHELPER.getElement(element, "taskNumber", null);

                            if (tempElement !== null && tempElement !== "") {
                                if (tempElement.getValue() !== null && tempElement.getValue() !== "") {
                                    _TASKS.taskNumber = tempElement.getValue();
                                }
                            }

                            tempElement = _XMLHELPER.getElement(element, "taskStatus", null);
                            if (tempElement !== null && tempElement !== "") {
                                _TASKS.taskStatus = tempElement.getValue();

                                if (tempElement.getValue() === "undefined") {
                                    _TASKS.taskStatus = WAITING;
                                }
                            }
                            tempElement = _XMLHELPER.getElement(element, "taskActive", null);
                            if (tempElement !== null && tempElement !== "") {
                                _TASKS.taskActive = _VAL(tempElement.getValue(), 4);
                            }
                        }

                        tempElement = _XMLHELPER.getElement(element, "taskCategory", null);
                        if (tempElement !== null) {
                            _TASKS.taskCategory = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskCoords", null);
                        if (tempElement !== null) {
                            _TASKS.taskCoords = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskTemplate", null);
                        if (tempElement !== null) {
                            _TASKS.taskTemplate = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "taskDescription", null);
                        if (tempElement !== null) {
                            _TASKS.taskDescription = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "openInPhase", null);
                        if (tempElement !== null) {
                            _TASKS.openInPhase = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "closeByPhase", null);
                        if (tempElement !== null) {
                            _TASKS.closeByPhase = tempElement.getValue();
                        }

                        /*Active Condition*/
                        tempElement = _XMLHELPER.getElement(element, "activeCondDesc", null);
                        if (tempElement !== null) {
                            _TASKS.activeCondDesc = tempElement.getValue();
                        }
                        tempElement = _XMLHELPER.getElement(element, "activeCondXML", null);
                        if (tempElement !== null) {
                            tempElement = tempElement.getFirstChildElement();
                            if (tempElement !== null) {
                                _TASKS.activeCondXML = tempElement.toXMLString();
                                var result = lib.conditionXmlParser.getRadQueryFromCondtionXml(_TASKS.activeCondXML);
                                _TASKS.activeCond = lib.WorkflowTriggers.convertResult(result[0]);
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "mandatory", null);
                        if (tempElement !== null) {
                            tempElement = tempElement.getValue();
                            _TASKS["mandatory"] = tempElement;
                        }
                        var dI;
                        tempElement = _XMLHELPER.getElement(element, "dependentIds", null);
                        if (tempElement !== null) {
                            dI = 0;
                            var dIdElement = tempElement.getFirstChildElement();
                            if (dIdElement !== null) {
                                do {
                                    _TASKS.dependentIds = _INSERT(_TASKS.dependentIds, 0, 1, _VAL(dIdElement.getValue()));
                                    dIdElement = dIdElement.getNextSiblingElement();
                                    dI++;
                                } while (dIdElement !== null);
                            }
                        }
                        tempElement = _XMLHELPER.getElement(element, "dependentCoords", null);
                        if (tempElement !== null) {
                            dI = 0;
                            var dCoordElement = tempElement.getFirstChildElement();
                            if (dCoordElement !== null) {
                                do {
                                    _TASKS.dependentCoords = _INSERT(_TASKS.dependentCoords, 0, 1, funcs.str(dCoordElement.getValue()));
                                    dCoordElement = dCoordElement.getNextSiblingElement();
                                    dI++;
                                } while (dCoordElement !== null);
                            }
                        }
                        i++;
                        element = element.getNextSiblingElement();
                    } while (element !== null);
                }
            }
        }
    }

    if (editorType === "ticket") {
        taskPlan.number = id;
    } else {
        taskPlan.id = id;
    }

    taskPlan.doSave();
    if (editorType === "ticket") {
        var change = new SCFile("cm3r");
        var sql = "number=\"" + id + "\"";
        if (change.doSelect(sql) === RC_SUCCESS) {

            var changePhase = new SCFile("cm3rcatphase");
            var phaseSql = "name=\"" + change.current_phase + "\"";
            if (changePhase.doSelect(phaseSql) === RC_SUCCESS) {

                var rteReturnValue = new SCDatum();
                var rteNames = new SCDatum();
                var rteVals = new SCDatum();

                rteNames.setType(8);
                rteNames.push("file");
                rteNames.push("name");
                rteNames.push("file.variables");

                rteVals.setType(8);
                rteVals.push(change);
                rteVals.push("changePlan.buildtable");
                rteVals.push([null, null, changePhase]);

                var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
                vars.$bypass_bg_authcheck = true;
                var oriBg = vars.$G_bg;
                vars.$G_bg = true;
                //false to run in the same thread, true to run in new one.  
                funcs.rtecall("callrad", rteReturnValue, "se.call.process", rteNames, rteVals, false);
                vars.$G_bg = oriBg;
                vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
            } else {
                logInfo("Can not find change phase:" + change.current_phase + ".");
                resp.error = true;
                resp.errorMessage = "Can not find change phase:" + change.current_phase + ".";
                return resp;
            }
        }
    }

    return resp;
}

function preOpenTask(record) {
    //task initil status
    var WAITING = "0";
    var READY = "1";
    var WITHDRAWN = "31";

    var fileName = "cm3r";
    var ticketid = record.number;
    var taskTableName = "cm3t";

    var taskPlan = new SCFile("changePlan");
    var sql = "number=\"" + ticketid + "\"";

    if (taskPlan.doSelect(sql) === RC_SUCCESS) {
        var changePlan = lib.changePlan;
        var APPLYTEMPLATE = lib.Template.applyTemplate;

        //Initialize task/$L.file
        var i;
        var iLoopTimes = taskPlan.tasks.length();
        for (i = 0; i < iLoopTimes; i++) {

            if (record.current_phase === taskPlan.tasks[i].openInPhase && (null === taskPlan.tasks[i].taskNumber || "" === taskPlan.tasks[i].taskNumber)) {
                var tempstatus = changePlan.setInitStatus(i, taskPlan, record);
                if (tempstatus !== WITHDRAWN) {
                    var task = new SCFile(taskTableName);

                    task.parent_change = ticketid;
                    task.category = taskPlan.tasks[i].taskCategory;
                    task.brief_desc = taskPlan.tasks[i].taskDescription;
                    task.status = tempstatus;

                    //get template defined in task plan
                    var planTemplate = taskPlan.tasks[i].taskTemplate;

                    //get default template configured in task category
                    var defaultTemplate = TPUTILITY.getTaskTemplateFromCategory(taskTableName, task.category);
                    //get related link.........TBD

                    //get task number
                    var newid = new Datum();
                    var rcode = new Datum();
                    rcode = funcs.rtecall("getnumber", rcode, newid, "cm3t");
                    task.number = newid.getText();

                    /**    Copy field value to task: link-->default template-->planner template    */
                    var linkName = "cm3t.task.request";
                    var link = new SCFile("link");
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
                    //back up related fields value for rollback
                    var oriTaskNumber = taskPlan.tasks[i].taskNumber;
                    var oriTaskDescription = taskPlan.tasks[i].taskDescription;
                    var oriTaskStatus = taskPlan.tasks[i].taskStatus;
                    var oriTaskActive = taskPlan.tasks[i].taskActive;

                    taskPlan.tasks[i].taskNumber = task.number;
                    taskPlan.tasks[i].taskDescription = task.brief_desc;
                    taskPlan.tasks[i].taskStatus = tempstatus;
                    taskPlan.tasks[i].taskActive = true;
                    taskPlan.doUpdate();
                    var opRt = openTask(task);
                    if (opRt !== RC_SUCCESS) {
                        taskPlan.tasks[i].taskNumber = oriTaskNumber;
                        taskPlan.tasks[i].taskDescription = oriTaskDescription;
                        taskPlan.tasks[i].taskStatus = oriTaskStatus;
                        taskPlan.tasks[i].taskActive = oriTaskActive;
                        taskPlan.doUpdate();
                    }
                }
            }
        }
        changePlan.updateWaitingTasks(taskPlan, record);
    } else {
        logInfo("No Task Plan for ticket of " + ticketid);
    }
}

function openTask(record) {
    var taskFileName = "cm3t";
    var workflowName = TPUTILITY.getWorkFlow(taskFileName, record.category);
    if (null === workflowName || "" === workflowName) {
        logInfo("Can not find the workflow for task of " + record.category);
        return;
    }
    var workflow = new SCFile("Workflow", SCFILE_READONLY);
    workflow.setFields(["firstPhase", "defaultPhase"]);
    var firstPhase = "";
    var defaultPhase = "";
    var sql = "name=\"" + workflowName + "\" and tableName=\"" + taskFileName + "\"";
    if (workflow.doSelect(sql) === RC_SUCCESS) {
        firstPhase = workflow.firstPhase;
        defaultPhase = workflow.defaultPhase;
    }
    record.current_phase = defaultPhase;
    if (record.status === WAITING) {
        record.current_phase = firstPhase;
    }
    record.open = true;
    var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
    var bypassValidationOrig = vars.$bypass_failed_validation;
    vars.$bypass_bg_authcheck = true;
    vars.$bypass_failed_validation = true;
    var openResult = record.doAction("add");
    vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
    vars.$bypass_failed_validation = bypassValidationOrig;

    return openResult;
}

/**
 *  This function is to print log info.
 *
 *  @param {String} info - Message info to be printed.
 *  
 */
function logInfo(info) {
    var log = getLog("TaskPlannerRemoteServiceImplementation");
    if (log.isInfoEnabled()) {
        log.info(info);
    }
}

/**
 *  This function returns the phase list that is after StartPhase(including StartPhase).
 *  
 *  @param {String} pareFileCategory - Module(cm3r/request) category.
 *  @param {String} parentFileName - Module(cm3r/request) file name.
 *  @param {String} taskCategory - Task(cm3t/requestTask) category.
 *  @param {String} startPhase - Module(cm3r/request) workflow phase.
 *  @return the phase list.
 */

function getEndPhaseList(pareFileCategory, parentFile, taskCategory, startPhase) {

    var resultAvaiPhases = [];
    var category = pareFileCategory;
    var currentPhase = startPhase;
    var workflowName = "";
    var taskCats = [];
    var avaiPhases = [];
    var parentFileName = parentFile;
    var taskFileName = "";
    if ("" === parentFile || null === parentFile || parentFile === undefined || "null" === parentFile) {
        parentFileName = "cm3r";
        taskFileName = "cm3t";
    } else {
        taskFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
        if ("" === taskFileName || null === taskFileName) {
            logInfo("Please configure Common Task Planner Mapping for table of " + parentFileName);
            return;
        }
    }
    workflowName = TPUTILITY.getWorkFlow(parentFileName, category);
    getPhasesAfterCurrentPhase(workflowName, parentFileName, currentPhase, avaiPhases);
    avaiPhases = sortPhaseByPhaseOrder(avaiPhases, parentFileName, workflowName);
    var j;
    for (j = 0; j < avaiPhases.length; j++) {
        resultAvaiPhases.push({
            phaseName: avaiPhases[j],
            phaseDesc: TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFileName, avaiPhases[j])
        });
    }
    if (parentFileName === "cm3r") {
        var tempAvaiPhases = [];
        var taskCatFile = new SCFile("cm3tcategory", SCFILE_READONLY);
        taskCatFile.setFields(["request.phases"]);
        var sql = "name=\"" + taskCategory + "\"";
        var phaseNames = [];
        if (taskCatFile.doSelect(sql) === RC_SUCCESS) {
            var lng = funcs.lng(funcs.denull(taskCatFile.request_phases));
            if (null !== lng && lng > 0) {
                for (j = 0; j < lng; j++) {
                    if (lib.ArrayUtil.contains(avaiPhases, taskCatFile.request_phases[j])) {
                        phaseNames.push(taskCatFile.request_phases[j]);
                    }
                }
                if (phaseNames.length > 0) {
                    phaseNames = sortPhaseByPhaseOrder(phaseNames, parentFileName, workflowName);
                    var h;
                    for (h = 0; h < phaseNames.length; h++) {
                        tempAvaiPhases.push({
                            phaseName: phaseNames[h],
                            phaseDesc: TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFileName, phaseNames[h])
                        });
                    }
                    resultAvaiPhases = tempAvaiPhases;
                } else {
                    return null;
                }
            }
        }
    }

    return resultAvaiPhases;
}

function getAvailableTaskCategories(parentFileName, start, count, query, editorType, id, parentCategory) {
    var taskFileName = "";
    if ("" === parentFileName || null === parentFileName || parentFileName === undefined || "null" === parentFileName) {
        taskFileName = "cm3t";
        parentFileName = "cm3r";
    } else {
        taskFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
    }
    var active = "true";
    var nCount = 0;
    var resultTaskCatsPage = [];
    var resultTaskCats = [];
    var obj = new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["category.file.name"]);
    var sql = "file.name=\"" + taskFileName + "\"";
    var catFile;

    if (obj.doSelect(sql) === RC_SUCCESS) {
        catFile = obj.category_file_name;
        if ("" !== catFile && null !== catFile) {
            var cat = new SCFile(catFile, SCFILE_READONLY);
            cat.setFields(["name"]);

            var catSql = "active=\"" + active + "\"";
            if (taskFileName === "cm3t") {
                catSql = "avail.cond=\"" + active + "\"";
                //Filter change task categories based on available phase
                var phases = getChangeTargetPhases(parentFileName, editorType, id, parentCategory);
                catSql = catSql + " and (request.phases isin " + phases + " or null(request.phases))";
            }
            if (null !== query && "" !== query) {
                catSql = catSql + " and name like \"" + query + "*\"";
            }
            var sortOrder = [SCFILE_ASC];
            var sortField = ["name"];
            cat.setOrderBy(sortField, sortOrder);
            nCount = cat.doCount(catSql);
            if (cat.doSelect(catSql) === RC_SUCCESS) {
                if (null === count || "" === count) {
                    count = 25;
                }
                if (null === start || "" === start) {
                    start = 0;
                }
                var successFlag;
                var rcode = new Datum();
                var c = 0;
                successFlag = funcs.rtecall("rgoto", rcode, cat, Number(start));

                do {
                    c++;
                    if (null !== count && c > count) {
                        break;
                    }
                    resultTaskCats.push(cat.name);
                } while (cat.getNext() === RC_SUCCESS);
            }
        }
    }

    var i;
    for (i = 0; i < resultTaskCats.length; i++) {
        resultTaskCatsPage[i] = {
            "taskCategoryName": resultTaskCats[i],
            "taskCategoryDesc": getLocalizedCategoryDesc(catFile, resultTaskCats[i])
        };
    }

    return {
        categories: resultTaskCatsPage,
        total: nCount
    };
}

/**
 * get localized category description scmessage
 */
function getLocalizedCategoryDesc(categoryFile, categoryName) {
    if (!categoryFile) {
        return categoryName;
    }

    var scmessage = new SCFile("scmessage", SCFILE_READONLY);
    var sql = `class="local:${categoryFile}" and message.id="${categoryName}"`;
    if (scmessage.doSelect(sql) === RC_SUCCESS) {
        return scmessage.message;
    }
    return "";
}

function getChangeTargetPhases(parentFileName, editorType, id, parentCategory) {
    var phaseList = "{";
    var recordFile = null;
    var sql = "";
    var changeCategory = parentCategory ? parentCategory : null;
    var changeWorkFlow = "";
    var avaiPhases = [];
    if (editorType === "model") {
        if (changeCategory == null) {
            recordFile = new SCFile("changeModel", SCFILE_READONLY);
            recordFile.setFields(["category"]);
            sql = "id=\"" + id + "\"";
            if (recordFile.doSelect(sql) === RC_SUCCESS) {
                changeCategory = recordFile['category'];
            }
        }
        if (changeCategory != null) {
            changeWorkFlow = TPUTILITY.getWorkFlow(parentFileName, changeCategory);
            avaiPhases = TPUTILITY.getActiveWorkFlowPhases(parentFileName, changeWorkFlow);
        }
    } else {
        recordFile = new SCFile("cm3r", SCFILE_READONLY);
        recordFile.setFields(["category", "current.phase"]);
        sql = "number=\"" + id + "\"";
        if (recordFile.doSelect(sql) === RC_SUCCESS) {
            if (changeCategory == null) {
                changeCategory = recordFile['category'];
            }
            changeWorkFlow = TPUTILITY.getWorkFlow(parentFileName, changeCategory);
            getPhasesAfterCurrentPhase(changeWorkFlow, parentFileName, recordFile['current.phase'], avaiPhases);
        }
    }
    var i;
    for (i = 0; i < avaiPhases.length; i++) {
        if ((i + 1) == avaiPhases.length) {
            phaseList += "\"" + avaiPhases[i] + "\"";
        } else {
            phaseList += "\"" + avaiPhases[i] + "\",";
        }
    }
    phaseList += "}";
    return phaseList;
}

function getAvailablePhases(id, editorType, parentFile, taskCategory, openInPhase, parentCategory) {

    var modelFileName = null;
    var parentFileName = parentFile;
    var category = null;
    var workflowName = null;
    var currentPhase = null;
    var avaiPhases = [];

    if (editorType === "model") {
        if ("" === parentFile || null === parentFile || parentFile === undefined || "null" === parentFile) {
            modelFileName = "changeModel";
            parentFileName = "cm3r";
        } else {
            modelFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Model");
        }

        category = parentCategory || TPUTILITY.getParentCategory(id, modelFileName);
        workflowName = TPUTILITY.getWorkFlow(parentFileName, category);
        avaiPhases = TPUTILITY.getActiveWorkFlowPhases(parentFileName, workflowName);
    }
    if (editorType === "ticket") {
        if ("" === parentFile || null === parentFile || parentFile === undefined || "null" === parentFile) {
            parentFileName = "cm3r";
        }
        category = TPUTILITY.getParentCategory(id, parentFileName);
        currentPhase = TPUTILITY.getCurrentPhase(id, parentFileName);
        workflowName = TPUTILITY.getWorkFlow(parentFileName, category);
        getPhasesAfterCurrentPhase(workflowName, parentFileName, currentPhase, avaiPhases);
        avaiPhases = sortPhaseByPhaseOrder(avaiPhases, parentFileName, workflowName);
    }

    var resultAvaiPhases = [];
    var j;

    if (parentFileName === "cm3r") {
        var taskCatFile = new SCFile("cm3tcategory", SCFILE_READONLY);
        taskCatFile.setFields(["request.phases"]);
        var sql = "name=\"" + taskCategory + "\"";
        var phaseNames = [];
        if (taskCatFile.doSelect(sql) === RC_SUCCESS) {
            var lng = funcs.lng(funcs.denull(taskCatFile.request_phases));

            if (null !== lng && lng > 0) {
                for (j = 0; j < lng; j++) {
                    if (lib.ArrayUtil.contains(avaiPhases, taskCatFile.request_phases[j])) {
                        phaseNames.push(taskCatFile.request_phases[j]);
                    }
                }
                if (phaseNames.length > 0) {
                    phaseNames = sortPhaseByPhaseOrder(phaseNames, parentFileName, workflowName);
                    var h;
                    for (h = 0; h < phaseNames.length; h++) {
                        resultAvaiPhases.push({
                            phaseName: phaseNames[h],
                            phaseDesc: TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFileName, phaseNames[h])
                        });
                    }
                    // add the phase description for the current start phase
                    if (openInPhase && !lib.ArrayUtil.contains(phaseNames, openInPhase)) {
                        resultAvaiPhases.push({
                            phaseName: openInPhase,
                            phaseDesc: TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFileName, openInPhase)
                        });
                    }
                } else {
                    return null;
                }
            }
        }

    }

    if (resultAvaiPhases.length == 0) {
        for (j = 0; j < avaiPhases.length; j++) {
            resultAvaiPhases.push({
                phaseName: avaiPhases[j],
                phaseDesc: TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFileName, avaiPhases[j])
            });
        }
        // add the phase description for the current start phase
        if (openInPhase && !lib.ArrayUtil.contains(avaiPhases, openInPhase)) {
            resultAvaiPhases.push({
                phaseName: openInPhase,
                phaseDesc: TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFileName, openInPhase)
            });
        }
    }

    return resultAvaiPhases;
}

/**
 *  This function returns the phase list that is after current phase based on workflow transition.
 *  
 *  @param {String} workflowName - Parent ticket(change, request etc) workflow name.
 *  @param {String} tableName - Module(cm3r/request) table name.
 *  @param {String} phaseName - Current phase.
 *  @param {String} phaseList - Phase name list to be returned.
 *  
 */
function getPhasesAfterCurrentPhase(workflowName, tableName, phaseName, phaseList) {

    if (phaseName !== null && phaseName !== "" && !lib.ArrayUtil.contains(phaseList, phaseName)) {
        var toPhase = "";
        var workflowPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
        var sql = "workflowName =\"" + workflowName + "\" and phaseName = \"" + phaseName + "\" and tableName=\"" + tableName + "\"";

        if (workflowPhase.doSelect(sql) === RC_SUCCESS) {
            if (workflowPhase.active === true) {
                phaseList.push(phaseName);
            }
            if (null !== workflowPhase.defaultTransition && "" !== workflowPhase.defaultTransition) {
                toPhase = workflowPhase.defaultTransition;
                getPhasesAfterCurrentPhase(workflowName, tableName, toPhase, phaseList);
            }
            var mlng = funcs.lng(funcs.denull(workflowPhase.manualTransition));
            var alng = funcs.lng(funcs.denull(workflowPhase.autoTransition));

            var i;
            var j;
            for (i = 0; i < mlng; i++) {
                toPhase = workflowPhase.manualTransition[i].mtToPhase;
                getPhasesAfterCurrentPhase(workflowName, tableName, toPhase, phaseList);
            }
            for (j = 0; j < alng; j++) {
                toPhase = workflowPhase.autoTransition[j].atToPhase;
                getPhasesAfterCurrentPhase(workflowName, tableName, toPhase, phaseList);
            }
        } else {
            logInfo("Can not find the WorkflowPhase definition for workflow of " + workflowName);
        }
    }

}

/**
 *  This function sorts the phase list based on phaseOrder.
 *  
 *  @param {String} phaseArray - Phase list to be sorted.
 *  @param {String} parentFileName - Module(cm3r/request) table name.
 *  @param {String} workflowName - Module(cm3r/request) workflow name.
 *  @return the sorted phase list.
 */
function sortPhaseByPhaseOrder(phaseArray, parentFileName, workflowName) {

    var allOrderedPhases = [];
    allOrderedPhases = TPUTILITY.getActiveWorkFlowPhases(parentFileName, workflowName);
    var index = new SCDatum(8);
    var phases = new SCDatum(8);
    var temp = new SCDatum(8);
    var returnArray = [];
    var i;
    for (i = 0; i < phaseArray.length; i++) {
        index.push(lib.ArrayUtil.indexOf(allOrderedPhases, phaseArray[i]));
        phases.push(phaseArray[i]);
    }
    if (phases.length() > 0) {
        temp.push(index);
        temp.push(phases);
        var retcode;
        funcs.rtecall("sort", retcode, temp, 0, 0);
        returnArray = temp[1].toArray();
    }
    return returnArray;
}

/**
 *  This function returns the RuleSet list of Assignment type.
 *  
 *  @param {String} parentFileName - Module(cm3r/request) table name.
 *  @return the RuleSet list. 
 */

function getAssignmentRuleSets(parentFileName) {
    var RuleTypeID = "assignment";
    var resultObjs = [];
    if (parentFileName === null || parentFileName === "") {
        return "";
    }
    var tableName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
    var id = new SCDatum(8);
    var name = new SCDatum(8);
    var rulesetfile = new SCFile("RuleSet", SCFILE_READONLY);
    var queryFieldList = ["id"];
    var filterstr = "<" + RuleTypeID + ">";
    rulesetfile.setFields(queryFieldList);
    var sql = "tablename=\"" + tableName + "\" OR null(tablename)";
    var rulesetfile2 = new SCFile("RuleSet", SCFILE_READONLY);
    var sql2 = "";
    var scFind = rulesetfile.doSelect(sql);
    if (scFind === RC_SUCCESS) {
        scFind = rulesetfile.getFirst();
        var len;
        while (scFind === RC_SUCCESS) {
            sql2 = "id=\"" + rulesetfile.id + "\"";
            if (rulesetfile2.doSelect(sql2) === RC_SUCCESS) {
                var rules = rulesetfile2.rule;
                len = rules.length();
                var j;
                for (j = 0; j < len; j++) {
                    var ruleType = rules[j].type;
                    if (ruleType === RuleTypeID) {
                        id.push(rulesetfile2.id);
                        name.push(rulesetfile2.name);
                        break;
                    } else if (ruleType == null || ruleType === "") {
                        var hasfilterstr = funcs.index(filterstr, rules[j].ruleXML);
                        if (hasfilterstr > 0) {
                            id.push(rulesetfile2.id);
                            name.push(rulesetfile2.name);
                            break;
                        }
                    }
                }
            }
            scFind = rulesetfile.getNext();
        }

        if (name.length() > 0) {
            var temp = new SCDatum(8);
            temp.push(id);
            temp.push(name);
            var retcode;
            funcs.rtecall("sort", retcode, temp, 1, 1);
            id = temp[0];
            name = temp[1];
            len = name.length();
            var a;
            for (a = 0; a < len; a++) {
                var tempid = id.pop();
                var tempname = name.pop();
                resultObjs.push({
                    ruleSetId: tempid,
                    ruleSetName: tempname
                });
            }
        }
    }
    return resultObjs;
}

/**
 *  This function returns the Task template list.
 *  Paramater of firstResult and maxResults needs to be handled in the future.
 *  @param {String} parentFileName - Module(cm3r/request) table name.
 *  @param {String} firstResult - 0.
 *  @param {String} maxResults - 10.
 *  @return the template list.
 */
function getTaskTemplates(parentFileName, start, count, query) {
    var taskFileName = "";
    var resultObjs = [];
    var name = new SCDatum(8);
    if ("" === parentFileName || null === parentFileName || parentFileName === undefined || "null" === parentFileName) {
        taskFileName = "cm3t";
    } else {
        taskFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
    }
    var templatefile = new SCFile("Template", SCFILE_READONLY);
    var queryFieldList = ["name"];
    templatefile.setFields(queryFieldList);
    var sortOrder = [SCFILE_ASC];
    var sortField = ["name"];
    templatefile.setOrderBy(sortField, sortOrder);
    var sql = "tablename=\"" + taskFileName + "\"";
    if (null !== query && "" !== query) {
        sql = sql + " and name like \"" + query + "*\"";
    }
    var nCount = templatefile.doCount(sql);
    if (templatefile.doSelect(sql) === RC_SUCCESS) {
        if (null === count || "" === count) {
            count = 25;
        }
        if (null === start || "" === start) {
            start = 0;
        }
        var successFlag;
        var rcode = new Datum();
        var c = 0;
        successFlag = funcs.rtecall("rgoto", rcode, templatefile, Number(start));

        do {
            c++;
            if (null !== count && c > count) {
                break;
            }
            var templatename = templatefile.name;
            name.push(templatename);
        } while (templatefile.getNext() === RC_SUCCESS);

        var temp = new SCDatum(8);
        temp.push(name);
        var retcode;
        funcs.rtecall("sort", retcode, temp, 0, 1);
        name = temp[0];
        var a;
        var len = name.length();
        for (a = 0; a < len; a++) {
            var tempname = name.pop();
            resultObjs.push({
                taskTemplateName: tempname
            });
        }
    }

    return {
        templates: resultObjs,
        total: nCount
    };
}

/**
 *  This function is to validate ticket and phase info during planning tasks within task editor.
 *  
 *  @param {String} id - The parent file id for ticket type, or model id for model type.
 *  @param {String} editorType - ticket or model.
 *  @param {String} parentFileName - Module(cm3r/request) table name.
 *  @param {String} startPhase - Module(cm3r/request) workflow phase.
 *  @param {String} endPhase - Module(cm3r/request) workflow phase.
 *  @return true or false.
 */
function validateTicketOrEndPhase(id, editorType, parentFileName, startPhase, endPhase) {

    if (parentFileName === null || parentFileName === "" || id === null || id === "" || editorType === null || editorType === "") {
        return "false";
    }
    var ret = "false";

    var tempCategory;
    var wfname;
    var a;
    var list;

    if (editorType === "ticket") {
        var pfile = new SCFile(parentFileName, SCFILE_READONLY);
        var queryFieldList = ["open", "category", "current.phase"];
        tempCategory = "";
        var tempCurrentPhase = "";
        pfile.setFields(queryFieldList);
        var uniquekey = TPUTILITY.getUniqueKey(parentFileName);
        var sql = uniquekey + "=\"" + id + "\"";
        var scFind = pfile.doSelect(sql);
        if (scFind === RC_SUCCESS) {
            scFind = pfile.getFirst();
            while (scFind === RC_SUCCESS) {
                if (pfile.open) {
                    if (startPhase !== null && startPhase !== "" && endPhase !== null && endPhase !== "") {
                        tempCategory = pfile.category;
                        tempCurrentPhase = pfile.current_phase;
                        wfname = TPUTILITY.getWorkFlow(parentFileName, tempCategory);
                        list = [];
                        getPhasesAfterCurrentPhase(wfname, parentFileName, tempCurrentPhase, list);
                        var start = -1;
                        var end = -1;
                        for (a = 0; a < list.length; a++) {
                            if (list[a] === startPhase) {
                                start = a;
                            }
                            if (list[a] === endPhase) {
                                end = a;
                            }
                        }
                        if (start >= 0 && end >= 0 && start <= end) {
                            ret = "true";
                        }
                    } else if (startPhase === null || startPhase === "" || endPhase === null || endPhase === "") {
                        return "true";
                    }
                }
                scFind = pfile.getNext();
            }
        }
    } else if (editorType === "model") {
        tempCategory = "";
        var modelFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Model");
        tempCategory = TPUTILITY.getParentCategory(id, modelFileName);
        wfname = TPUTILITY.getWorkFlow(parentFileName, tempCategory);
        list = TPUTILITY.getActiveWorkFlowPhases(parentFileName, wfname);
        for (a = 0; a < list.length; a++) {
            var t = list[a];
            if (t === startPhase) {
                start = a;
            }
            if (t === endPhase) {
                end = a;
            }
        }
        if (start >= 0 && end >= 0 && start <= end) {
            ret = "true";
        }
    }

    return ret;
}

/**
 *  This function gets task fields from datadict/dbdict
 *  
 *  @param {String} parentFileName - Moduel file name (cm3r/request etc.)
 *  @return the field list.
 */
function getAdditionalTaskFields(parentFileName) {

    var ristrictFields = ['title'];
    var taskFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Task");
    var taskFields = [];
    var dataDict = new SCFile("datadict");
    var sql = "name=\"" + taskFileName + "\"";

    var fields = [];
    var captions = [];
    var sysFieldType = [];
    var gl = [];
    var fu = [];
    if (dataDict.doSelect(sql) === RC_SUCCESS) {
        fields = dataDict.fields;
        captions = dataDict.captions;
        sysFieldType = dataDict.sysFieldType;
        gl = dataDict.globallist;
        fu = dataDict.fieldUsage;

        var dbDict = new SCFile("dbdict");
        if (dbDict.doSelect(sql) === RC_SUCCESS) {
            var dbdictService = $("#dbdictService");
            var descriptor = dbdictService.getDescriptorMeta(dbDict["field"]);

            checkAddlFields(descriptor.childs, fields, captions, sysFieldType, gl, ristrictFields, taskFields, fu);
        }
    }
    return taskFields;
}

function checkAddlFields(childs, fields, captions, sysFieldType, gl, ristrictFields, taskFields, fu) {
    var _index = funcs.index;
    var scmsg = funcs.scmsg;
    var sccaption = "";
    var i;
    for (i = 0; i < childs.length; i++) {
        var child = childs[i];
        var fieldName = child.field.name;
        var idx = _index(fieldName, fields);

        if (idx !== 0 && sysFieldType[idx - 1] !== 1 && _index(fieldName, ristrictFields) == 0) {
            var fieldType = child.field.type;
            sccaption = captions[idx - 1];
            var captionStr = scmsg(captions[idx - 1], "sccaption");
            if (captionStr.indexOf("Could not be found") == -1) {
                sccaption = captionStr;
            }
            fieldType = "" + fieldType + "";
            if ("" !== fu[idx - 1] && null !== fu[idx - 1]) {
                fieldType = fieldType + "-" + fu[idx - 1];
            }
            if ("" !== gl[idx - 1] && null !== gl[idx - 1]) {
                taskFields.push({
                    name: fieldName,
                    description: sccaption,
                    type: fieldType,
                    globallist: gl[idx - 1]
                });
            } else {
                taskFields.push({
                    name: fieldName,
                    description: sccaption,
                    type: fieldType
                });
            }
        }

        if (child.childs.length > 0 && child.field.type != $.Array) {
            checkAddlFields(child.childs, fields, captions, sysFieldType, gl,
                ristrictFields, taskFields, fu);
        }
    }
}

/**
 *  This function returns ticket context fields from ticketContextConfig table
 *  
 *  @param {String} id - The parent file id for ticket type, or model id for model type.
 *  @param {String} editorType - ticket or model.
 *  @param {String} parentFileName - Module(cm3r/request) table name.
 *  @return the field list.
 */
function getTicketContextFields(id, editorType, parentFileName) {

    var contextFields = [];
    var fileName = parentFileName;
    var queryFieldList = ["id", "label"];
    var contextFile = new SCFile("ticketContextConfig", SCFILE_READONLY);
    var modelFileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Model");
    if (editorType === "model") {
        fileName = modelFileName;
    } else {
        var modelId = TPUTILITY.getModelIdByTicketID(parentFileName, id);
    }
    var sql = "fileId=\"" + id + "\" and fileName=\"" + fileName + "\"";
    contextFile.setFields(queryFieldList);
    if (contextFile.doSelect(sql) === RC_SUCCESS) {
        var msgClass = "local:ticketContextConfig";
        do {
            var msgId = null;
            if (editorType === "model") {
                msgId = fileName + "_" + id + "_" + contextFile.id;
            } else {
                msgId = modelFileName + "_" + modelId + "_" + contextFile.id;
            }
            var msg = funcs.scmsg(msgId, msgClass);
            if (funcs.index("Could not be found:", msg) > 0) {
                msg = contextFile.label;
            }
            contextFields.push({
                name: contextFile.id,
                description: msg
            });
        } while (contextFile.getNext() === RC_SUCCESS);
    }

    return contextFields;
}

/**
 *  This function gets parent file fields from datadict/dbdict
 *  
 *  @param {String} parentFileName - Moduel file name (cm3r/request etc.)
 *  @return the field list.
 */
function getParentFileFields(parentFileName) {
    var scmsg = funcs.scmsg;
    var fileFields = [];
    var fields = [];
    var captions = [];
    var sysFieldType = [];

    var dataDict = new SCFile("datadict");
    var sql = "name=\"" + parentFileName + "\"";
    if (dataDict.doSelect(sql) === RC_SUCCESS) {
        fields = dataDict.fields;
        captions = dataDict.captions;
        var i;
        var iLoopTimes = fields.length();
        for (i = 0; i < iLoopTimes; i++) {
            var captionStr = scmsg(captions[i], "sccaption");
            if (captionStr.indexOf("Could not be found") == -1) {
                fileFields.push({
                    name: fields[i],
                    description: captionStr
                });
            } else {
                fileFields.push({
                    name: fields[i],
                    description: captions[i]
                });
            }
        }
    }

    return fileFields;
}

/**
 *  This function returns user option fields from userOption table
 *  
 *  @param {String} id - The parent file id for ticket type, or model id for model type.
 *  @param {String} editorType - ticket or model.
 *  @param {String} parentFileName - Module(cm3r/request) table name.
 *  @return the field list.
 */
function getUserOptionFields(id, editorType, parentFileName) {
    var optionFields = [];
    if ("ticket" === editorType) {
        var userOpts = new SCFile("userOption", SCFILE_READONLY);
        var sql = "select Option.Name, min(Option.Label) from userOption where Ticket.ID=\"" + id + "\" group by Option.Name";
        if (userOpts.doSelect(sql) === RC_SUCCESS) {
            do {
                optionFields.push({
                    name: userOpts[0],
                    description: userOpts[1]
                });

            } while (userOpts.getNext() === RC_SUCCESS);
        }
    }

    return optionFields;
}

function getOOFlowConfigurationItem(id, editorType, parentFileName) {

    var links = [];
    var fileName = parentFileName;
    var configItem = new SCFile("OOFlowConfigurationItem", SCFILE_READONLY);
    configItem.setFields([
        "fileName",
        "fileId",
        "name",
        "OOFlow.uuid",
        "OOFlow.path",
        "paraFields"
    ]);
    if (editorType === "model") {
        fileName = TPUTILITY.getTableNameByParentFileName(parentFileName, "Model");
    }
    var sql = "fileId=\"" + id + "\" and fileName=\"" + fileName + "\"";
    var ret = configItem.doSelect(sql);
    while (ret === RC_SUCCESS) {
        var link = {};
        link.fileName = configItem.fileName;
        link.fileId = configItem.fileId;
        link.linkName = configItem.name;
        link.uuid = configItem.OOFlow_uuid;
        link.path = configItem.OOFlow_path;
        link.linkParams = [];
        var i;
        var iLoopTimes = configItem.paraFields.length();
        for (i = 0; i < iLoopTimes; i++) {
            var para = {};
            para.paraName = configItem.paraFields[i].paraField_name;
            para.required = configItem.paraFields[i].paraField_required;
            para.type = configItem.paraFields[i].paraField_fieldType == null ? "" : configItem.paraFields[i].paraField_fieldType;
            para.fieldName = configItem.paraFields[i].paraField_fieldName == null ? "" : configItem.paraFields[i].paraField_fieldName;
            para.defaultValue = configItem.paraFields[i].paraField_defaultValue == null ? "" : configItem.paraFields[i].paraField_defaultValue;
            link.linkParams.push(para);
        }
        links.push(link);
        ret = configItem.getNext();
    }

    return links;
}

function isOOFlowEnabled(parentFileName) {
    var confItem = lib.smis_ConfigurationManager.getEnabledConfigItem("SMOO");
    if (confItem) {
        var mappingFile = new SCFile("taskPlannerMapping", SCFILE_READONLY);
        var queryFieldList = ["ooEnable"];
        mappingFile.setFields(queryFieldList);
        var sql = "parentFileName=\"" + parentFileName + "\"";
        var scFind = mappingFile.doSelect(sql);
        if (scFind === RC_SUCCESS) {
            if (mappingFile.ooEnable == true) {
                return true;
            }
        }
    }
    return false;
}

function readGraph(id, editorType, parentFile) {
    var resp = {};
    resp.error = false;
    resp.errorMessage = "no message";

    if ("" === parentFile || null === parentFile || parentFile === undefined || "null" === parentFile) {
        return readLegacyGraph(id, editorType);
    }

    var mapping = $("taskPlannerMapping", SCFILE_READONLY).setFields(["taskFileName", "modelFileName"]).select('parentFileName="' + parentFile + '"').uniqueResult();
    if (null === mapping || funcs._null(mapping)) {
        funcs.msg(funcs.scmsg("18", "taskplan", [parentFile]), 3);
        logInfo("Task Planner Mapping is not configured for table '" + parentFile + "'.");
        resp.error = true;
        resp.errorMessage = funcs.scmsg("30", "taskplan", [parentFile]);
        return resp;
    }
    var fileName = parentFile;
    var phaseDesc = "";
    var taskStatusDesc = "";
    var fileNameDesc = "";
    var workflowName = "";
    var parentCategory = "";

    if (editorType == "model") {
        fileName = mapping["modelFileName"];
    }
    parentCategory = TPUTILITY.getParentCategory(id, fileName);
    var plan = $("changePlan", SCFILE_READONLY).select('fileId="' + id + '" and fileName="' + fileName + '"').uniqueResult();

    // initializeGraphDocument
    var graphXml = new XML();
    graphXml.setContent("<mxGraphModel></mxGraphModel>");
    var root = graphXml.addElement("root");
    var gCell0 = root.addElement("mxCell");
    gCell0.addAttribute("id", "0");

    var gCell1 = root.addElement("mxCell");
    gCell1.addAttribute("id", "1");
    gCell1.addAttribute("parent", "0");
    var gChMProperties = gCell1.addElement("chMProperties");
    gChMProperties.addAttribute("as", "value");
    // set chMProperties
    gChMProperties.addAttribute("number", id);
    gChMProperties.addAttribute("fileName", fileName);
    fileNameDesc = funcs.scmsg(fileName, "tablename");
    if (fileNameDesc.indexOf("Could not be found") !== -1) {
        fileNameDesc = fileName;
    }

    gChMProperties.addAttribute("fileNameDesc", fileNameDesc);
    if (plan != null) {
        var tasks = plan["tasks"];
        if (tasks != null) {
            var taskIdDepends = {};
            var taskCoordDepends = {};
            var i;
            var iLoopTimes = tasks.length();
            for (i = 0; i < iLoopTimes; i++) {
                var task = tasks[i];
                if (!funcs._null(task)) {
                    var taskId = task["taskId"];
                    var taskStatus = task["taskStatus"];
                    if (taskStatus == null) {
                        taskStatus = -1;
                    }
                    taskStatusDesc = funcs.scmsg("taskStatus;" + taskStatus, "local:codes");
                    if (taskStatusDesc.indexOf("Could not be found") !== -1) {
                        taskStatusDesc = taskStatus;
                    }
                    var taskNumber = task["taskNumber"];
                    if (taskNumber == null) {
                        taskNumber = "";
                    }

                    var gTaskCell = root.addElement("mxCell");
                    gTaskCell.addAttribute("vertex", "1");
                    gTaskCell.addAttribute("parent", "1");
                    var style = "defaultTaskStyle";
                    if (taskStatus == 0) {
                        if ("" == taskNumber) {
                            style = "planned";
                        } else {
                            style = "waiting";
                        }
                    } else if (taskStatus == 1) {
                        style = "ready";
                    } else if ((taskStatus > 1 && taskStatus < 20) || taskStatus == "reopened") {
                        style = "inProgress";
                    } else if ((taskStatus > 19 && taskStatus < 30) || taskStatus == "closed") {
                        style = "completed";
                    } else if (taskStatus > 29) {
                        style = "failed";
                    } else if (taskStatus == "initial" || taskStatus == "waiting") {
                        style = "planned";
                    }
                    gTaskCell.addAttribute("style", style);
                    gTaskCell.addAttribute("id", taskId);
                    var dependentIds = task["dependentIds"];
                    if (dependentIds != null) {
                        taskIdDepends[taskId] = dependentIds;
                    }
                    var dependentCoords = task["dependentCoords"];
                    if (dependentCoords != null) {
                        taskCoordDepends[taskId] = dependentCoords;
                    }
                    var _str = funcs.str;
                    var chMTaskProperties = gTaskCell.addElement("chMTaskProperties");
                    chMTaskProperties.addAttribute("as", "value");
                    chMTaskProperties.addAttribute("taskCategory", _str(task["taskCategory"]));
                    chMTaskProperties.addAttribute("taskDescription", _str(task["taskDescription"]));
                    chMTaskProperties.addAttribute("openInPhase", _str(task["openInPhase"]));
                    workflowName = TPUTILITY.getWorkFlow(parentFile, parentCategory);
                    phaseDesc = TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFile, _str(task["openInPhase"]));
                    chMTaskProperties.addAttribute("openInPhaseDesc", _str(phaseDesc));

                    chMTaskProperties.addAttribute("taskId", _str(task["taskId"]));
                    if (task["taskNumber"] != null) {
                        chMTaskProperties.addAttribute("taskNumber", _str(task["taskNumber"]));
                    }
                    if (task["taskStatus"] != null) {
                        chMTaskProperties.addAttribute("taskStatus", _str(task["taskStatus"]));
                        chMTaskProperties.addAttribute("taskStatusDesc", _str(taskStatusDesc));
                    }
                    if (task["taskTemplate"] != null) {
                        chMTaskProperties.addAttribute("taskTemplate", _str(task["taskTemplate"]));
                    }
                    if (task["closeByPhase"] != null) {
                        chMTaskProperties.addAttribute("closeByPhase", _str(task["closeByPhase"]));
                        phaseDesc = TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFile, _str(task["closeByPhase"]));
                        chMTaskProperties.addAttribute("closeByPhaseDesc", _str(phaseDesc));
                    }
                    if (task["taskAssignment"] != null) {
                        chMTaskProperties.addAttribute("taskAssignment", _str(task["taskAssignment"]));
                    }
                    if (task["taskActive"] != null) {
                        chMTaskProperties.addAttribute("taskActive", _str(task["taskActive"]));
                    }
                    if (task["activeCond"] != null) {
                        chMTaskProperties.addAttribute("activeCond", _str(task["activeCond"]));
                    }
                    if (task["activeCondXML"] != null) {
                        chMTaskProperties.addAttribute("activeCondXML", _str(task["activeCondXML"]));
                    }
                    if (task["activeCondValue"] != null) {
                        chMTaskProperties.addAttribute("activeCondValue", _str(task["activeCondValue"]));
                    }
                    if (task["mandatory"] != null) {
                        chMTaskProperties.addAttribute("mandatory", _str(task["mandatory"]));
                    }
                    if (task["activeCondDesc"] != null) {
                        chMTaskProperties.addAttribute("activeCondDesc", _str(task["activeCondDesc"]));
                    }
                    if (task["taskOOFlowLink"] != null) {
                        chMTaskProperties.addAttribute("taskOOFlowLink", _str(task["taskOOFlowLink"]));
                    }

                    var inputs = task["inputs"];
                    if (inputs != null) {
                        var inputsStr = "";
                        var j;
                        var jLoopTimes = inputs.length();
                        for (j = 0; j < jLoopTimes; j++) {
                            if (j > 0) {
                                inputsStr += ",";
                            }

                            var input = inputs[j];
                            inputsStr += (input["inputId"] + "-" + input["inputType"]);
                        }
                        chMTaskProperties.addAttribute("inputs", inputsStr);
                    }

                    var outputs = task["outputs"];
                    if (outputs != null) {
                        var outputsStr = "";
                        var k;
                        var kLoopTimes = outputs.length();
                        for (k = 0; k < kLoopTimes; k++) {
                            if (k > 0) {
                                outputsStr += ",";
                            }

                            var output = outputs[k];
                            outputsStr += (output["outputId"] + "-" + output["outputType"]);
                        }
                        chMTaskProperties.addAttribute("outputs", outputsStr);
                    }

                    var taskFieldsSettings = task["taskFieldsSetting"];
                    if (taskFieldsSettings != null) {
                        var l;
                        var lLoopTimes = taskFieldsSettings.length();
                        for (l = 0; l < lLoopTimes; l++) {
                            var taskFieldsSetting = taskFieldsSettings[l];
                            chMTaskProperties.addAttribute("addlField-" + taskFieldsSetting["fieldName"],
                                taskFieldsSetting["fieldValue"]);
                        }
                    }

                    var mxGeometry = gTaskCell.addElement("mxGeometry");
                    mxGeometry.addAttribute("as", "geometry");

                    // task size
                    var taskHeight = "35";
                    var taskWidth = "120";
                    var taskSize = task["taskSize"];
                    if (taskSize != null) {
                        var sizeArr = taskSize.split(",");
                        if (sizeArr != null && sizeArr.length > 0) {
                            if (sizeArr[0]) {
                                taskHeight = sizeArr[0];
                            }
                            if (sizeArr[1]) {
                                taskWidth = sizeArr[1];
                            }
                        }
                    }
                    mxGeometry.addAttribute("height", taskHeight);
                    mxGeometry.addAttribute("width", taskWidth);

                    // task position
                    var taskCoords = task["taskCoords"];
                    if (taskCoords != null) {
                        var coordArr = taskCoords.split(",");
                        if (coordArr != null && coordArr.length > 0) {
                            var taskX = coordArr[0];
                            var taskY = coordArr[1];
                            mxGeometry.addAttribute("x", taskX == null ? "0" : taskX);
                            mxGeometry.addAttribute("y", taskY == null ? "0" : taskY);
                        }
                    }
                }

            }
            // add transition elements
            var key;
            for (key in taskIdDepends) {
                var idDepends = taskIdDepends[key];
                var coordDepends = taskCoordDepends[key];
                var coordLength = coordDepends ? coordDepends.length() : 0;
                var de;
                var deLoopTimes = idDepends.length();
                for (de = 0; de < deLoopTimes; de++) {
                    var gTransitionCell = root.addElement("mxCell");
                    gTransitionCell.addAttribute("edge", "1");
                    gTransitionCell.addAttribute("parent", "1");
                    gTransitionCell.addAttribute("source", idDepends[de]);
                    gTransitionCell.addAttribute("target", key);
                    var gTransitionGeometry = gTransitionCell.addElement("mxGeometry");
                    gTransitionGeometry.addAttribute("as", "geometry");

                    // add transition position
                    if (de < coordLength) {
                        var tCoord = coordDepends[de];
                        if (tCoord != null) {
                            var tCoordArr = tCoord.split(",");
                            if (tCoordArr != null && tCoordArr.length > 0) {
                                var tx = tCoordArr[0];
                                var ty = tCoordArr[1];
                                if (tx && ty) {
                                    var gArray = gTransitionGeometry.addElement("Array");
                                    gArray.addAttribute("as", "points");
                                    var gPoint = gArray.addElement("mxPoint");
                                    gPoint.addAttribute("x", tx);
                                    gPoint.addAttribute("y", ty);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    //check if related ticket context records exist
    TPUTILITY.checkTicketContext(fileName, id);
    return {
        graphXML: graphXml.toXMLString(),
        parentFileName: parentFile,
        taskFileName: mapping["taskFileName"],
        modelFileName: mapping["modelFileName"]
    };

}

function readLegacyGraph(id, editorType) {

    var planTable = "changePlan";
    var parentFile = "cm3r";
    var fileName = parentFile;
    var phaseDesc = "";
    var taskStatusDesc = "";
    var fileNameDesc = "";
    var workflowName = "";
    var changeCategory = "";
    var planSql = "number=\"" + id + "\"";
    if (editorType == "model") {
        planTable = "changeModel";
        fileName = "changeModel";
        planSql = "id=\"" + id + "\"";
    }

    var plan = new SCFile(planTable, SCFILE_READONLY);
    plan.doSelect(planSql);
    // initializeGraphDocument
    var graphXml = new XML();
    graphXml.setContent("<mxGraphModel></mxGraphModel>");
    var root = graphXml.addElement("root");
    var gCell0 = root.addElement("mxCell");
    gCell0.addAttribute("id", "0");

    var gCell1 = root.addElement("mxCell");
    gCell1.addAttribute("id", "1");
    gCell1.addAttribute("parent", "0");
    var gChMProperties = gCell1.addElement("chMProperties");
    gChMProperties.addAttribute("as", "value");
    // set chMProperties
    gChMProperties.addAttribute("number", id);
    gChMProperties.addAttribute("fileName", fileName);
    fileNameDesc = funcs.scmsg(fileName, "tablename");
    if (fileNameDesc.indexOf("Could not be found") !== -1) {
        fileNameDesc = fileName;
    }

    gChMProperties.addAttribute("fileNameDesc", fileNameDesc);
    if (plan != null) {
        if (editorType == "model") {
            changeCategory = plan.category;
        } else {
            var changeSql = "number=\"" + id + "\"";
            var changeTicket = new SCFile("cm3r", SCFILE_READONLY);
            changeTicket.setFields(["category"]);
            if (changeTicket.doSelect(changeSql) === RC_SUCCESS) {
                changeCategory = changeTicket.category;
            }
        }
        var tasks = plan["tasks"];
        if (tasks != null) {
            var taskIdDepends = {};
            var i;
            var iLoopTimes = tasks.length();
            for (i = 0; i < iLoopTimes; i++) {
                var task = tasks[i];
                if (!funcs._null(task)) {

                    var taskId = task["taskId"];
                    var taskStatus = task["taskStatus"];
                    if (taskStatus == null) {
                        taskStatus = -1;
                    }
                    taskStatusDesc = funcs.scmsg("taskStatus;" + taskStatus, "local:codes");
                    if (taskStatusDesc.indexOf("Could not be found") !== -1) {
                        taskStatusDesc = taskStatus;
                    }
                    var taskNumber = task["taskNumber"];
                    if (taskNumber == null) {
                        taskNumber = "";
                    }

                    var gTaskCell = root.addElement("mxCell");
                    gTaskCell.addAttribute("vertex", "1");
                    gTaskCell.addAttribute("parent", "1");
                    var style = "defaultTaskStyle";
                    if (taskStatus == 0) {
                        if ("" == taskNumber) {
                            style = "planned";
                        } else {
                            style = "waiting";
                        }
                    } else if (taskStatus == 1) {
                        style = "ready";
                    } else if ((taskStatus > 1 && taskStatus < 20) || taskStatus == "reopened") {
                        style = "inProgress";
                    } else if ((taskStatus > 19 && taskStatus < 30) || taskStatus == "closed") {
                        style = "completed";
                    } else if (taskStatus > 29) {
                        style = "failed";
                    } else if (taskStatus == "initial" || taskStatus == "waiting") {
                        style = "planned";
                    }
                    gTaskCell.addAttribute("style", style);
                    gTaskCell.addAttribute("id", taskId);

                    var dependentIds = task["dependentIds"];
                    if (dependentIds != null) {
                        taskIdDepends[taskId] = dependentIds;
                    }
                    var _str = funcs.str;
                    var chMTaskProperties = gTaskCell.addElement("chMTaskProperties");
                    chMTaskProperties.addAttribute("as", "value");
                    chMTaskProperties.addAttribute("taskCategory", _str(task["taskCategory"]));
                    chMTaskProperties.addAttribute("taskDescription", _str(task["taskDescription"]));
                    chMTaskProperties.addAttribute("openInPhase", _str(task["openInPhase"]));
                    workflowName = TPUTILITY.getWorkFlow(parentFile, changeCategory);
                    phaseDesc = TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFile, _str(task["openInPhase"]));
                    chMTaskProperties.addAttribute("openInPhaseDesc", _str(phaseDesc));

                    chMTaskProperties.addAttribute("taskId", _str(task["taskId"]));
                    if (task["taskNumber"] != null) {
                        chMTaskProperties.addAttribute("taskNumber", _str(task["taskNumber"]));
                    }
                    if (task["taskStatus"] != null) {
                        chMTaskProperties.addAttribute("taskStatus", _str(task["taskStatus"]));
                        chMTaskProperties.addAttribute("taskStatusDesc", _str(taskStatusDesc));
                    }
                    if (task["taskTemplate"] != null) {
                        chMTaskProperties.addAttribute("taskTemplate", _str(task["taskTemplate"]));
                    }
                    if (task["closeByPhase"] != null) {
                        chMTaskProperties.addAttribute("closeByPhase", _str(task["closeByPhase"]));
                        phaseDesc = TPUTILITY.getWorkFlowPhaseDescription(workflowName, parentFile, _str(task["closeByPhase"]));
                        chMTaskProperties.addAttribute("closeByPhaseDesc", _str(phaseDesc));
                    }

                    if (task["taskActive"] != null) {
                        chMTaskProperties.addAttribute("taskActive", _str(task["taskActive"]));
                    }
                    if (task["activeCond"] != null) {
                        chMTaskProperties.addAttribute("activeCond", _str(task["activeCond"]));
                    }
                    if (task["activeCondXML"] != null) {
                        chMTaskProperties.addAttribute("activeCondXML", _str(task["activeCondXML"]));
                    }
                    if (task["activeCondValue"] != null) {
                        chMTaskProperties.addAttribute("activeCondValue", _str(task["activeCondValue"]));
                    }
                    if (task["mandatory"] != null) {
                        chMTaskProperties.addAttribute("mandatory", _str(task["mandatory"]));
                    }
                    if (task["activeCondDesc"] != null) {
                        chMTaskProperties.addAttribute("activeCondDesc", _str(task["activeCondDesc"]));
                    }

                    var mxGeometry = gTaskCell.addElement("mxGeometry");
                    mxGeometry.addAttribute("as", "geometry");
                    mxGeometry.addAttribute("height", "35");
                    mxGeometry.addAttribute("width", "120");
                    var taskCoords = task["taskCoords"];
                    if (taskCoords != null) {
                        var coordArr = taskCoords.split(",");
                        if (coordArr != null && coordArr.length > 0) {
                            var taskX = coordArr[0];
                            var taskY = coordArr[1];
                            mxGeometry.addAttribute("x", taskX == null ? "0" : taskX);
                            mxGeometry.addAttribute("y", taskY == null ? "0" : taskY);
                        }
                    }
                }

            }
            // add transition elements
            var key;
            for (key in taskIdDepends) {
                var depends = taskIdDepends[key];
                var de;
                var deLoopTimes = depends.length();
                for (de = 0; de < deLoopTimes; de++) {
                    var gTransitionCell = root.addElement("mxCell");
                    gTransitionCell.addAttribute("edge", "1");
                    gTransitionCell.addAttribute("parent", "1");
                    gTransitionCell.addAttribute("source", depends[de]);
                    gTransitionCell.addAttribute("target", key);
                    var gTransitionGeometry = gTransitionCell.addElement("mxGeometry");
                    gTransitionGeometry.addAttribute("as", "geometry");
                }
            }
        }
    }

    return {
        graphXML: graphXml.toXMLString(),
        parentFileName: "cm3r",
        taskFileName: "cm3t",
        modelFileName: "changeModel"
    };

}

function getPreDefinedTaskFields(parentFile, taskCategory) {
    var ristrictFields = ['title'];
    var _index = funcs.index;
    var _scmsg = funcs.scmsg;
    var _val = funcs.val;

    var _ = lib.Underscore.require();

    var mapping = $("taskPlannerMapping", SCFILE_READONLY).setFields(["taskFileName"]).select('parentFileName="' + parentFile + '"').uniqueResult();
    var taskFile = mapping["taskFileName"];
    var dbdict = $(taskFile).dbdict();
    var datadict = $("datadict").select('name="' + taskFile + '"').uniqueResult();
    var datadictFields = datadict.fields;
    var captions = datadict.captions;
    var sysFieldType = datadict.sysFieldType;
    var gl = datadict.globallist;
    var fu = datadict.fieldUsage;

    var fields = [];
    var categoryDefinedFields = $("taskPlannerFieldsDef", SCFILE_READONLY).select(
            'fileName="' + taskFile + '" and taskCategoryName="' + taskCategory + '"')
        .uniqueResult();

    function getField(definedField) {
        var field = {};
        var fieldName = definedField["name"];
        if (null === fieldName || "" === fieldName) {
            return;
        }
        var idx = _index(fieldName, datadictFields);
        if (idx !== 0 && sysFieldType[idx - 1] !== 1 && _index(fieldName, ristrictFields) == 0) {
            var dbdictField = $("#dbdictService").getFieldByName(fieldName, dbdict["field"], false);

            var fieldType = dbdictField["type"];
            var sccaption = captions[idx - 1];
            var captionStr = _scmsg(sccaption, "sccaption");
            if (captionStr.indexOf("Could not be found") == -1) {
                sccaption = captionStr;
            }
            fieldType = "" + fieldType + "";
            if (!$.isEmpty(fu[idx - 1])) {
                fieldType = fieldType + "-" + fu[idx - 1];
            }

            field.name = fieldName;
            field.description = sccaption;
            field.type = fieldType;
            if (!$.isEmpty(gl[idx - 1])) {
                field.globallist = gl[idx - 1];
            }

            if (definedField["mandatory"] != null) {
                field.mandatory = _val(definedField["mandatory"], $.Logical);
            }
            if (definedField["isRecordType"] != null) {
                field.isRecordType = _val(definedField["isRecordType"], $.Logical);
            }
            if (field.isRecordType) {
                var relationId = definedField["relation.id"];
                var relation = $("relation", SCFILE_READONLY).setFields(["target.file", "target.field"]).select('id=' + relationId).uniqueResult();
                if (relation != null) {
                    field.targetFile = relation["target.file"];
                    field.targetField = relation["target.field"];
                    var queryXml = definedField["queryXML"];
                    if (!$.isEmpty(queryXml)) {
                        field.query = QueryEditor.getQuery(queryXml, {
                            TargetFile: field.targetFile
                        });
                    }
                }
            }

            //fields.push(field);
            return field;
        }
    }

    var moduleDefinedFields = $("taskPlannerFieldsDef", SCFILE_READONLY).select(
        'fileName="' + taskFile + '" and taskCategoryName=NULL').uniqueResult();

    var i = 0;
    var iLoopTimes;
    var definedFields;
    var currentField;

    if (moduleDefinedFields != null) {
        definedFields = moduleDefinedFields["fields"];
        iLoopTimes = definedFields.length();
        for (i = 0; i < iLoopTimes; i++) {
            currentField = getField(definedFields[i]);
            fields.push(currentField);
        }
    }

    if (categoryDefinedFields != null) {
        definedFields = categoryDefinedFields["fields"];
        iLoopTimes = definedFields.length();
        for (i = 0; i < iLoopTimes; i++) {
            var definedField = definedFields[i];
            // check if it is exist;
            var obj = _.findWhere(fields, {
                name: definedField["name"]
            });
            currentField = getField(definedFields[i]);
            if (obj == null) {
                fields.push(currentField);
            } else {
                obj["mandatory"] = definedField["mandatory"];
                obj["isRecordType"] = definedField["isRecordType"];
                obj["targetFile"] = currentField["targetFile"];
                obj["targetField"] = currentField["targetField"];
                obj["query"] = currentField["query"];
            }
        }
    }

    return fields;
}

function getRecords(file, field, queryEditorQuery, start, count, inputQuery) {

    var nCount = 0;
    var recordsPage = [];
    var sql = "";
    var fields = [field];

    var queryDisplay = false;

    // get display field
    var displayField = null;
    var key = lib.dbdictHelper.getUniqueKey(file)[0];
    if (field == key) {
        displayField = lib.DisplayName.getRefTableDisplayField(file);
        if (displayField && displayField != field) {
            fields = [field, displayField];
            queryDisplay = true;
        }
    }

    var ticketRecord = new SCFile(file, SCFILE_READONLY);
    ticketRecord.setFields(fields);

    if (null !== queryEditorQuery && "" !== queryEditorQuery) {
        sql = queryEditorQuery;
        if (null != inputQuery && "" != inputQuery) {
            // query by display field instead 
            if (queryDisplay) {
                sql += " and " + displayField + " like \"" + inputQuery + "*\"";
            } else {
                sql += " and " + field + " like \"" + inputQuery + "*\"";
            }
        }
        nCount = ticketRecord.doCount(sql);
        var sortOrder = [SCFILE_ASC];
        var sortField = (displayField ? [displayField] : [field]);
        ticketRecord.setOrderBy(sortField, sortOrder);
        if (ticketRecord.doSelect(sql) === RC_SUCCESS) {
            if (null === count || "" === count) {
                count = 25;
            }
            if (null === start || "" === start) {
                start = 0;
            }
            var successFlag;
            var rcode = new Datum();
            var c = 0;
            successFlag = funcs.rtecall("rgoto", rcode, ticketRecord, Number(start));

            do {
                c++;
                if (null !== count && c > count) {
                    break;
                }

                var name = ticketRecord[field];
                var display;
                if (queryDisplay) {
                    display = ticketRecord[displayField];
                }

                var item = {
                    "name": name,
                    "display": display || name
                };
                recordsPage.push(item);

            } while (ticketRecord.getNext() === RC_SUCCESS);
        }
    }
    return {
        total: nCount,
        records: recordsPage
    };
}

function getSuggestedMaxTaskNumber() {
    return lib.settings.getSettingValue("Condition Editor", "suggested.max.task.number");
}