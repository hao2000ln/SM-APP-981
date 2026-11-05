//use Underscore.js
var _ = lib.Underscore.require();
var _scmsg = funcs.scmsg;

function validateOOIntegration(fileName) {
    var confItem = lib.smis_ConfigurationManager.getEnabledConfigItem("SMOO");
    if (confItem) {
        var mappingFile = new SCFile("taskPlannerMapping", SCFILE_READONLY);
        var queryFieldList = ["ooEnable"];
        mappingFile.setFields(queryFieldList);
        var sql = "taskFileName=\"" + fileName + "\"";
        var scFind = mappingFile.doSelect(sql);
        if (scFind === RC_SUCCESS) {
            if (mappingFile.ooEnable == true) {
                return true;
            }
        }
    }
    return false;
}

function generateOOParameterHTML() {
    var style = 'table{width:100% ;FONT-SIZE: 11px}';
    var html = "<html><head></head><style>" + style + "</style><body><table>{tableheader}{tablecontent}<table></body></html>";
    var tableHead = "<tr bgcolor=\"#01a982\" style=\"font-weight:bold;color:white;\" align=\"center\">" +
        "<td>" + _scmsg(1005, "AutomationTask") + "</td>" + //1005
        "<td>" + _scmsg(1006, "AutomationTask") + "</td>" + //1006
        "<td>" + _scmsg(1007, "AutomationTask") + "</td>" + //1007
        "<td>" + _scmsg(1008, "AutomationTask") + "</td>" + //1008
        "<td>" + _scmsg(1009, "AutomationTask") + "</td>" + //1009
        "<td>" + _scmsg(1010, "AutomationTask") + "</td>" + //1010
        "</tr>";
    var tableContent = "";

    var taskFile = vars.$L_file;
    if (taskFile) {
        var fileId = taskFile["parentTicket"];
        var linkName = taskFile["oolink.name"];
        var fileName = funcs.filename(taskFile);
        var pfName = getParentFileName(fileName);
        var query = "fileId=\"" + fileId + "\" and fileName=\"" + pfName + "\" and name=\"" + linkName + "\"";
        var item = new SCFile("OOFlowConfigurationItem", SCFILE_READONLY);
        var ret = item.doSelect(query);
        if (ret === RC_SUCCESS) {
            var params = item.paraFields;
            var class1 = 'bgcolor="#eaeff3"';
            var class2 = 'bgcolor="#f8f9f9"';
            var tmpstyle = "";
            var i;
            var length = params.length();
            for (i = 0; i < length; i++) {
                if (i % 2 == 0) {
                    tmpstyle = class1;
                } else {
                    tmpstyle = class2;
                }
                var rq = params[i]["paraField.required"];
                var pn = params[i]["paraField.name"];
                var ft = params[i]["paraField.fieldType"] == null ? "" : params[i]["paraField.fieldType"];
                var fn = params[i]["paraField.fieldName"] == null ? "" : params[i]["paraField.fieldName"];
                var mt = params[i]["paraField.mapToTable"] == null ? "" : params[i]["paraField.mapToTable"];
                var dv = params[i]["paraField.defaultValue"] == null ? "" : params[i]["paraField.defaultValue"];
                var mtn = params[i]["paraField.mapTableName"] == null ? "" : params[i]["paraField.mapTableName"];
                var mtf = params[i]["paraField.mapTableField"] == null ? "" : params[i]["paraField.mapTableField"];
                var stf = params[i]["paraField.selectTableField"] == null ? "" : params[i]["paraField.selectTableField"];
                var rtv = getParamValue(params[i], taskFile);
                var tooltip = _scmsg(1005, "AutomationTask") + ": " + pn + "&#10;"; //1005
                tooltip += _scmsg(1006, "AutomationTask") + ": " + rq + "&#10;"; //1006
                tooltip += _scmsg(1007, "AutomationTask") + ": " + ft + "&#10;"; //1007
                tooltip += _scmsg(1008, "AutomationTask") + ": " + fn + "&#10;"; //1008
                tooltip += _scmsg(1009, "AutomationTask") + ": " + mt + "&#10;"; //1009
                tooltip += _scmsg(1014, "AutomationTask") + ": " + mtn + "&#10;"; //1014
                tooltip += _scmsg(1011, "AutomationTask") + ": " + mtf + "&#10;"; //1011
                tooltip += _scmsg(1012, "AutomationTask") + ": " + stf + "&#10;"; //1012
                tooltip += _scmsg(1013, "AutomationTask") + ": " + dv + "&#10;"; //1013
                tooltip += _scmsg(1010, "AutomationTask") + ": " + rtv; //1010

                tableContent += "<tr title=\"" + tooltip + "\"" + tmpstyle + " onmouseover=\"currentBgColor=this.style.backgroundColor; this.style.backgroundColor='#E0DFE3';\"" +
                    "onmouseout=\"this.style.backgroundColor=currentBgColor\">";
                if (rq == "true") {
                    pn = "<a style=\"FONT-FAMILY: arial; COLOR: red\">*</a>" + _.escapeHTML(pn);
                }
                tableContent += "<td>" + pn + "</td>";
                tableContent += "<td>" + _.escapeHTML(rq) + "</td>";
                tableContent += "<td>" + _.escapeHTML(ft) + "</td>";
                tableContent += "<td>" + _.escapeHTML(fn) + "</td>";
                tableContent += "<td>" + _.escapeHTML(mt) + "</td>";
                tableContent += "<td>" + _.escapeHTML(rtv) + "</td>";
                tableContent += "</tr>";
            }
        }
    }
    var reg = new RegExp("{tableheader}", "g");
    html = html.replace(reg, tableHead);
    var treg = new RegExp("{tablecontent}", "g");
    html = html.replace(treg, tableContent);
    return html;
}

function getParamValue(param, taskFile) {
    var pfName = getParentFileName(funcs.filename(taskFile));
    var tmpvalue = "";
    if (param.paraField_fieldType != null && param.paraField_fieldType != "" &&
        param.paraField_fieldName != null && param.paraField_fieldName != "") {
        var pFile = new SCFile(pfName);
        var tmpSql = "number=\"" + taskFile.parentTicket + "\"";
        var tmpret = pFile.doSelect(tmpSql);
        if (param.paraField_fieldType === "Parent File") {
            if (tmpret === RC_SUCCESS) {
                tmpvalue = pFile[param.paraField_fieldName];
            }
        } else if (param.paraField_fieldType === "Current File") {
            tmpvalue = taskFile[param.paraField_fieldName];
        } else if (param.paraField_fieldType === "Additional Properties") {
            var ticketContextConfig = new SCFile("ticketContextConfig", SCFILE_READONLY);
            ticketContextConfig.setFields("value");
            var sql2 = "fileId=\"" + taskFile.parentTicket + "\" and id=\"" + param.paraField_fieldName + "\"";
            var tmpretCode = ticketContextConfig.doSelect(sql2);
            if (tmpretCode === RC_SUCCESS) {
                tmpvalue = ticketContextConfig.value;
            }
        } else if (param.paraField_fieldType === "User Options") {
            if (tmpret === RC_SUCCESS) {
                var result = lib.TaskPlannerService.getUserOption(pFile, param.paraField_fieldName);
                if (result && result["Option.Value"]) {
                    tmpvalue = result["Option.Value"].toArray().join();
                }
            }
        } else if (param.paraField_fieldType === "JavaScript") {
            var expressionValue = eval(param.paraField_expression);
            tmpvalue = value == null ? "" : expressionValue;
        }
        tmpvalue = tmpvalue == null ? "" : tmpvalue;
        if (tmpvalue != "" && param.paraField_mapToTable) {
            tmpvalue = getMappedTableFieldValue(tmpvalue, param.paraField_mapTableName, param.paraField_mapTableField, param.paraField_selectTableField);
        }
        if (tmpvalue == "") {
            tmpvalue = param.paraField_defaultValue == null ? "" : param.paraField_defaultValue;
        }
    } else {
        tmpvalue = param.paraField_defaultValue == null ? "" : param.paraField_defaultValue;
    }
    if (tmpvalue.getType && tmpvalue.getType() == "ARRAY") {
        tmpvalue = tmpvalue.toArray();
    }

    return tmpvalue;
}

function validateParams(fileName, taskFile) {
    var ret = {};
    ret.valid = true;
    ret.msg = "";
    var linkName = taskFile["oolink.name"];
    if (linkName == "" || linkName == null) {
        ret.valid = false;
        ret.msg = _scmsg(1004, "AutomationTask"); //SCMSG**1001**AutomationTask
    } else {
        var parentFileId = taskFile["parentTicket"];
        var pfName = getParentFileName(fileName);
        var ooFlowConfItem = new SCFile("OOFlowConfigurationItem", SCFILE_READONLY);
        var query = "name=\"" + linkName + "\" and fileId=\"" + parentFileId + "\" and fileName=\"" + pfName + "\"";
        var tmp = ooFlowConfItem.doSelect(query);
        if (tmp === RC_SUCCESS) {
            var ooflowFile = new SCFile("OOFlow", SCFILE_READONLY);
            ooflowFile.setFields("uuid");
            var sql = "uuid = \"" + ooFlowConfItem["OOFlow.uuid"] + "\"";
            var rc = ooflowFile.doSelect(sql);
            if (rc === RC_SUCCESS) {
                ret.valid = true;
            } else {
                ret.msg = _scmsg(1001, "AutomationTask"); //SCMSG**1001**AutomationTask
            }
        } else {
            ret.msg = _scmsg(1002, "AutomationTask"); //SCMSG**1002**AutomationTask
        }
    }
    if (!ret.valid) {
        setAutomationTaskFailed(taskFile, ret.msg, fileName);
    }
    return ret;
}

function setExecutionModetoTask(taskFile) {

    var linkName = taskFile["oolink.name"];
    var fileName = funcs.filename(taskFile);
    var query = "fileId=\"" + taskFile.parentTicket + "\" and fileName=\"" + getParentFileName(fileName) + "\" and name=\"" + linkName + "\"";
    var item = new SCFile("OOFlowConfigurationItem", SCFILE_READONLY);
    item.setFields(["auto"]);
    var ret = item.doSelect(query);
    if (ret === RC_SUCCESS) {
        if (item["auto"]) {
            taskFile["ooexecution.mode"] = "auto";
        } else {
            taskFile["ooexecution.mode"] = "manual";
        }
    } else {
        taskFile["ooexecution.mode"] = "manual";
    }
}

function getParentFileName(taskFileName) {
    var mappingFile = new SCFile("taskPlannerMapping", SCFILE_READONLY);
    var queryFieldList = ["parentFileName"];
    mappingFile.setFields(queryFieldList);
    var sql = "taskFileName=\"" + taskFileName + "\"";
    var scFind = mappingFile.doSelect(sql);
    if (scFind === RC_SUCCESS) {
        return mappingFile.parentFileName;
    }
    return "";
}

function executeOOFlow(requestTask, fileName) {
    var pfName = getParentFileName(fileName);
    if (!pfName) {
        return null;
    }

    var ooFlowPlanLinkName = requestTask.oolink_name;
    if (!ooFlowPlanLinkName) {
        return null;
    }

    var ooFlowConfItem = new SCFile("OOFlowConfigurationItem", SCFILE_READONLY);
    var query = "name=\"" + ooFlowPlanLinkName + "\" and fileId=\"" + requestTask.parentTicket + "\"";
    var tmp = ooFlowConfItem.doSelect(query);
    if (tmp !== RC_SUCCESS) {
        return null;
    }

    var params = ooFlowConfItem.paraFields;
    var paralength = params.length();
    var secparams = funcs.denull(ooFlowConfItem.secureFields);

    var i;
    var length = secparams.length();
    for (i = 0; i < length; i++) {
        params[paralength + i].paraField_name = secparams[i].secureField_name;
        params[paralength + i].paraField_required = secparams[i].secureField_required;
        params[paralength + i].paraField_defaultValue = secparams[i].secureField_defaultValue;
    }

    var uuid = ooFlowConfItem.OOFlow_uuid;
    var isAsync = ooFlowConfItem.async;
    var fileID = requestTask.number;
    var operator = funcs.operator();
    var paraList = [];
    var valueList = [];
    var activityLogID = "";
    var assetsFieldValueList = [];
    var assetParamsIndex = -1;

    var j;
    length = params.length();
    for (j = 0; j < length; j++) {
        var tmpvalue = "";
        paraList.push(params[j].paraField_name);
        if (params[j].paraField_fieldType != null && params[j].paraField_fieldType != "" &&
            params[j].paraField_fieldName != null && params[j].paraField_fieldName != "") {
            var pFile = new SCFile(pfName);
            var tmpSql = "number=\"" + requestTask.parentTicket + "\"";
            var tmpret = pFile.doSelect(tmpSql);
            if (params[j].paraField_fieldType === "Parent File") {
                if (tmpret === RC_SUCCESS) {
                    tmpvalue = pFile[params[j].paraField_fieldName];
                    if (pfName == "cm3r" && params[j].paraField_fieldName == "assets") {
                        assetParamsIndex = j;
                    }
                }
            } else if (params[j].paraField_fieldType === "Current File") {
                tmpvalue = requestTask[params[j].paraField_fieldName];
                if (fileName == "cm3t" && params[j].paraField_fieldName == "asset") {
                    assetParamsIndex = j;
                }
            } else if (params[j].paraField_fieldType === "Additional Properties") {
                var ticketContextConfig = new SCFile("ticketContextConfig", SCFILE_READONLY);
                ticketContextConfig.setFields("value");
                var sql2 = "fileId=\"" + requestTask.parentTicket + "\" and id=\"" + params[j].paraField_fieldName + "\"";
                var tmpretCode = ticketContextConfig.doSelect(sql2);
                if (tmpretCode === RC_SUCCESS) {
                    tmpvalue = ticketContextConfig.value;
                }
            } else if (params[j].paraField_fieldType === "User Options") {
                if (tmpret === RC_SUCCESS) {
                    var result = lib.TaskPlannerService.getUserOption(pFile, params[j].paraField_fieldName);
                    if (result && result["Option.Value"]) {
                        tmpvalue = result["Option.Value"].toArray().join();
                    }
                }
            } else if (params[j].paraField_fieldType === "JavaScript") {
                var expressionValue = eval(params[j].paraField_expression);
                tmpvalue = value == null ? "" : expressionValue;
            }
            tmpvalue = tmpvalue == null ? "" : tmpvalue;
            if (tmpvalue != "" && params[j].paraField_mapToTable) {
                if (assetParamsIndex > -1) {
                    tmpvalue = getMappedTableFieldListValue(tmpvalue, params[j].paraField_mapTableName, params[j].paraField_mapTableField, params[j].paraField_selectTableField);
                    assetsFieldValueList = tmpvalue;
                } else {
                    tmpvalue = getMappedTableFieldValue(tmpvalue, params[j].paraField_mapTableName, params[j].paraField_mapTableField, params[j].paraField_selectTableField);
                }
            }
            if (tmpvalue == null || tmpvalue == "") {
                tmpvalue = params[j].paraField_defaultValue == null ? "" : params[j].paraField_defaultValue;
            }
        } else {
            tmpvalue = params[j].paraField_defaultValue == null ? "" : params[j].paraField_defaultValue;
        }

        if (params[j].paraField_required == "true" && (tmpvalue == null || tmpvalue == "")) {
            var msg = _scmsg(1003, "AutomationTask"); //SCMSG**1003**AutomationTask
            setAutomationTaskFailed(requestTask, msg, fileName);
            return null;
        }
        if (tmpvalue.getType && tmpvalue.getType() == "ARRAY") {
            tmpvalue = tmpvalue.toArray();
        }
        valueList.push(tmpvalue);
    }

    var res = [];
    if (assetParamsIndex > -1 && assetsFieldValueList.length > 0) {
        var ii;
        for (ii = 0; ii < assetsFieldValueList.length && isNotEmpty(assetsFieldValueList[ii]); ii++) {
            valueList[assetParamsIndex] = assetsFieldValueList[ii];
            res[ii] = lib.SMOOHttpRequest.execute(uuid, paraList, valueList, fileID, operator, isAsync, fileName, activityLogID);
        }
    } else {
        res.push(lib.SMOOHttpRequest.execute(uuid, paraList, valueList, fileID, operator, isAsync, fileName, activityLogID));
    }
    return res;
}

function setAutomationTaskFailed(requestTask, msg, fileName) {
    //Add Activitylog
    var desarray = [msg];
    lib.SMOOHttpRequest.addActivityLog(desarray, requestTask["number"], "", fileName);
    requestTask.ooexecution_status = "Error";
}

function getMappedTableFieldValue(fieldValue, mappedTableName, mappedTableField, selectTableField) {
    if (fieldValue.getType && fieldValue.getType() == "ARRAY") {
        return getMappedTableFieldListValue(fieldValue, mappedTableName, mappedTableField, selectTableField);
    }

    var device = new SCFile(mappedTableName, SCFILE_READONLY);
    device.setFields(selectTableField);
    var query = mappedTableField + "=\"" + fieldValue + "\"";
    var ret = device.doSelect(query);
    if (ret == RC_SUCCESS) {
        return device[selectTableField];
    } else {
        return "";
    }
}

function isNotEmpty(str) {
    return (str && str.length > 0);
}

function getMappedTableFieldListValue(fieldValue, mappedTableName, mappedTableField, selectTableField) {

    if (!fieldValue.getType || fieldValue.getType() != "ARRAY") {
        return getMappedTableFieldValue(fieldValue, mappedTableName, mappedTableField, selectTableField);
    }

    var device = new SCFile(mappedTableName, SCFILE_READONLY);
    device.setFields(selectTableField);
    var query = mappedTableField + " isin " + funcs.str(fieldValue);
    var ret = device.doSelect(query);
    var vList = [];
    while (ret == RC_SUCCESS) {
        vList.push(device[selectTableField]);
        ret = device.getNext();
    }
    return vList;
}

function isOOEabled(fileName) {
    var confItem = lib.smis_ConfigurationManager.getEnabledConfigItem("SMOO");
    if (confItem) {
        var mappingFile = new SCFile("taskPlannerMapping", SCFILE_READONLY);
        var queryFieldList = ["ooEnable"];
        mappingFile.setFields(queryFieldList);
        var sql = "taskFileName=\"" + fileName + "\"";
        var scFind = mappingFile.doSelect(sql);
        if (scFind === RC_SUCCESS) {
            if (mappingFile.ooEnable == true) {
                return true;
            }
        }
    }
    return false;
}

function refreshOOFlowStatus() {
    var toUpdate = new SCFile("AutomationTaskUpdate");
    var query = "true";
    var sortOrder = [SCFILE_ASC];
    var sortFields = ["lastUpdateTime"];
    toUpdate.setOrderBy(sortFields, sortOrder);
    var ret = toUpdate.doSelect(query);
    const MAX = 20;
    var count = 0;

    while (ret == RC_SUCCESS && count < MAX) {
        updateAutomationTask(toUpdate);
        count++;
        ret = toUpdate.getNext();
    }
}

function updateAutomationTask(toUpdate) {
    if (!isOOEabled(toUpdate["fileName"])) {
        return;
    }

    var response = getOOFlowExecuteStatus(toUpdate["ooflow.runid"]);
    var resSummary = response.executionSummary;

    // error occurred
    if (!resSummary) {
        toUpdate.lastUpdateTime = new Date();
        toUpdate.doUpdate();
        return;
    }

    var flowPath = resSummary.flowPath;
    var status = resSummary.status;
    var resultStatusType = resSummary.resultStatusType;
    var resultStatusName = resSummary.resultStatusName;
    // var flowOutput = response.flowOutput;

    var file;
    var tIndex;
    var updateRet;
    var handle = false;
    var description;

    if (status == "COMPLETED" && resultStatusType == "RESOLVED" && resultStatusName == "success") {
        //update task set execution status = "Success";
        file = getTaskFile(toUpdate["fileName"], toUpdate["fileId"]);
        if (file) {
            description = lib.SMOOUtil.activityDescription(flowPath, toUpdate["ooflow.runid"], file["ooexecution.reporturl"], resSummary);

            if (file.ooexecution_runid && file.ooexecution_runid.getType && file.ooexecution_runid.getType() == "ARRAY") {
                tIndex = funcs.index(toUpdate["ooflow.runid"], file.ooexecution_runid);
                file.ooexecution_status_list[tIndex - 1] = "Success";
                if (setOOExecutionStatus(file, file.ooexecution_status_list) == RC_SUCCESS) {
                    addActivityLog(toUpdate["fileId"], toUpdate["fileName"], description);
                    toUpdate.doDelete();
                    handle = true;
                }
            } else {
                file.ooexecution_status = "Success";
                updateRet = file.doAction("save");
                if (updateRet == RC_SUCCESS) {
                    addActivityLog(toUpdate["fileId"], toUpdate["fileName"], description);
                    toUpdate.doDelete();
                    handle = true;
                }
            }
        }
    } else if (status == "COMPLETED" && resultStatusType == "ERROR" && resultStatusName == "failure") {
        //update task set execution status = "Error";
        file = getTaskFile(toUpdate["fileName"], toUpdate["fileId"]);
        if (file) {
            description = lib.SMOOUtil.activityDescription(flowPath, toUpdate["ooflow.runid"], file["ooexecution.reporturl"], resSummary);

            if (file.ooexecution_runid && file.ooexecution_runid.getType && file.ooexecution_runid.getType() == "ARRAY") {
                tIndex = funcs.index(toUpdate["ooflow.runid"], file.ooexecution_runid);
                file.ooexecution_status_list[tIndex - 1] = "Error";
                if (setOOExecutionStatus(file, file.ooexecution_status_list) == RC_SUCCESS) {
                    addActivityLog(toUpdate["fileId"], toUpdate["fileName"], description);
                    toUpdate.doDelete();
                    handle = true;
                }
            } else {
                file.ooexecution_status = "Error";
                updateRet = file.doAction("save");
                if (updateRet == RC_SUCCESS) {
                    addActivityLog(toUpdate["fileId"], toUpdate["fileName"], description);
                    toUpdate.doDelete();
                    handle = true;
                }
            }
        }
    }

    // not handle successfully, update timestamp
    if (!handle) {
        toUpdate.lastUpdateTime = new Date();
        toUpdate.doUpdate();
    }
}


function addActivityLog(fileId, fileName, desarray) {
    lib.SMOOHttpRequest.addActivityLog(desarray, fileId, "", fileName);
}

function getTaskFile(fileName, fileId) {
    var file = new SCFile(fileName);
    var query = "number=\"" + fileId + "\"";
    var ret = file.doSelect(query);
    if (ret == RC_SUCCESS) {
        return file;
    } else {
        return null;
    }
}

function getOOFlowExecuteStatus(runid) {
    return lib.SMOOHttpRequest.getExecuteStatus(runid);
}

function setOOExecutionStatus(taskFile, statusList) {
    var isSuccess = false;
    var isFailure = false;
    var i;
    var length = statusList.length();
    for (i = 0; i < length; i++) {
        if (statusList[i] == "Success") {
            isSuccess = true;
        } else if (statusList[i] == "Error") {
            isFailure = true;
            isSuccess = false;
            break;
        } else {
            isSuccess = false;
        }
    }

    if (isSuccess) {
        taskFile.ooexecution_status = "Success";
    } else if (isFailure) {
        taskFile.ooexecution_status = "Error";
    }

    return taskFile.doAction("save");
}


function isResolvedCode(returnCode) {
    if (!returnCode) {
        return false;
    }
    return returnCode.toUpperCase() == 'RESOLVED';
}

function isErrorCode(returnCode) {
    if (!returnCode) {
        return false;
    }
    return returnCode.toUpperCase() == 'ERROR';
}