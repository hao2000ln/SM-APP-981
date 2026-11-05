var $ = lib.c.$;

function getWorkflowModuleAndArea() {
    var _scmsg = funcs.scmsg;
    var tree = {};

    var secArea = new SCFile("secArea", SCFILE_READONLY);
    secArea.setFields(["name", "module"]);
    var rc = secArea.doSelect(true);
    while (rc == RC_SUCCESS) {
        var name = secArea["name"];
        var module = secArea["module"];
        if (module === null || module === "") {
            rc = secArea.getNext();
            continue;
        }

        var nameDesc = _scmsg(name, "local:secArea");
        if (nameDesc.indexOf("Could not be found") > 0) {
            nameDesc = name;
        }

        var moduleDesc = _scmsg(module, "local:secModule");
        if (moduleDesc.indexOf("Could not be found") > 0) {
            moduleDesc = module;
        }

        // add tree node
        var treeNode = tree[module];
        if (treeNode == null) {
            treeNode = {};
            tree[module] = treeNode;
        }
        treeNode["desc"] = moduleDesc;

        var nodes = treeNode["nodes"];
        if (nodes == null) {
            nodes = {};
            treeNode["nodes"] = nodes;
        }
        nodes[name] = nameDesc;

        rc = secArea.getNext();
    }

    return tree;
}

function getWorkflowList(module, area, start, count) {
    if (null == count || "" == count || "null" == count) {
        count = 25;
    }
    if (null == start || "" == start || "null" == count) {
        start = 0;
    }

    var data = [];
    var total = 0;

    // construct where clause
    var whereClause = "";
    if (area != null && area != "" && area != "null") {
        whereClause += 'ta02.sc.area="' + area + '"';
    }

    if (module != null && module != "" && module !== "null") {
        var moduleWhere = 'ta03.module="' + module + '"';
        if (whereClause.length == 0) {
            whereClause = moduleWhere;
        } else {
            whereClause += " and " + moduleWhere;
        }
    }

    var query = 'SELECT ta01.name, ta01.tableName, ta01.description, ta01.sysmodtime, ta01.sysmoduser, ta01.sysrestricted, ta02.sc.area AS Workflow_tableName_datadict_name_datadict_sc.area, ta03.module AS datadict_sc.area_secArea_name_secArea_module FROM Workflow ta01 LEFT OUTER JOIN datadict ta02 ON  ( ta01.tableName = ta02.name )  LEFT OUTER JOIN secArea ta03 ON  ( ta02.sc.area = ta03.name )';
    if (whereClause.length > 0) {
        query = query + ' WHERE ( ' + whereClause + ')';
    }

    var workflow = new SCFile("Workflow", SCFILE_READONLY);
    var sortOrder = [SCFILE_ASC];
    var sortField = ["name"];
    workflow.setOrderBy(sortField, sortOrder);
    total = workflow.doCount(query);
    var rc = workflow.doSelect(query);
    if (rc == RC_SUCCESS) {
        funcs.rgoto(workflow, Number(start));
    }

    var name;
    var tableName;
    var description;
    var sysmodtime;
    var sysmoduser;
    var sysrestricted;
    var hpProprietary;
    var id;

    var cur = 0;
    while (rc == RC_SUCCESS) {
        cur++;
        if (cur > count) {
            break;
        }

        name = workflow["name"];
        tableName = workflow["tableName"];
        description = workflow["description"];
        sysmodtime = workflow["sysmodtime"];
        sysmoduser = workflow["sysmoduser"];
        sysrestricted = workflow["sysrestricted"];

        hpProprietary = "false";
        if (sysrestricted == true) {
            hpProprietary = "true";
        }

        id = name + " - " + tableName;

        data.push({
            "id": id,
            "name": name,
            "tableName": tableName,
            "description": description,
            "modTime": sysmodtime,
            "modUser": sysmoduser,
            "hpProprietary": hpProprietary
        });

        rc = workflow.getNext();
    }

    return {
        "data": data,
        "total": total
    };
}

function getAllSubPhases(workflowName, tableName, phaseName, phaseList) {
    var _lng = funcs.lng;
    var _denull = funcs.denull;
    if (phaseName !== null && phaseName !== "" && !$.contains(phaseList, phaseName)) {
        var toPhase = "";
        var workflowPhase = $("WorkflowPhase", SCFILE_READONLY).select(
            'workflowName ="' + workflowName + '" and phaseName = "' + phaseName +
            '" and tableName="' + tableName + '"').uniqueResult();

        if (workflowPhase != null) {
            if (workflowPhase.active === true) {
                phaseList.push(phaseName);
            }
            if (null !== workflowPhase.defaultTransition && "" !== workflowPhase.defaultTransition) {
                toPhase = workflowPhase.defaultTransition;
                getPhasesAfterCurrentPhase(workflowName, tableName, toPhase, phaseList);
            }
            var mlng = _lng(_denull(workflowPhase.manualTransition));
            var alng = _lng(_denull(workflowPhase.autoTransition));

            var i;
            for (i = 0; i < mlng; i++) {
                toPhase = workflowPhase.manualTransition[i].mtToPhase;
                getAllSubPhases(workflowName, tableName, toPhase, phaseList);
            }
            var j;
            for (j = 0; j < alng; j++) {
                toPhase = workflowPhase.autoTransition[j].atToPhase;
                getAllSubPhases(workflowName, tableName, toPhase, phaseList);
            }
        }
    }
}

function getApprovalPhases(wfName, tableName, recordId, curPhase) {
    var _denull = funcs.denull;
    var phases = [];

    // check if it is a workflow embeded in record
    var recordFlow = false;
    if (recordId != null && recordId != "" && recordId != "null" && curPhase != null &&
        curPhase != "" && curPhase != "null") {
        recordFlow = true;
    }

    var workflowPhase = $("WorkflowPhase", SCFILE_READONLY);
    workflowPhase = workflowPhase.setFields(["phaseName", "approvals"]);
    workflowPhase.select('workflowName="' + wfName + '" and tableName="' + tableName + '"').iterate(
        function(wfPhase) {
            var hasApproval = false;
            var phaseName = wfPhase["phaseName"];
            var approvals = _denull(wfPhase["approvals"]);
            if (approvals != null && approvals.length() > 0) {
                phases.push(phaseName);
                hasApproval = true;
            }

            if (phaseName == curPhase && recordFlow && !hasApproval) {
                // check if has Approval for current phase
                var approval = $("Approval", SCFILE_READONLY);
                approval = approval.setFields(["name"]);
                approval = approval.select(
                        'unique.key="' + recordId + '" and file.name="' + tableName + '"')
                    .uniqueResult();
                if (approval != null) {
                    phases.push(phaseName);
                }
            }
        });

    if (recordFlow) {
        // check if has ApprovalLog for previous phase
        var approvalLog = $("ApprovalLog", SCFILE_READONLY);
        approvalLog = approvalLog.setFields(["current.phase"]);
        approvalLog.select('unique.key="' + recordId + '" and file.name="' + tableName + '"').iterate(
            function(approvalLog) {
                var histPhase = approvalLog["current.phase"];
                if (!$.contains(phases, histPhase)) {
                    phases.push(histPhase);
                }
            });
    }

    return phases;
}

function getFieldCaption(name, fields, captions) {
    var _scmsg = funcs.scmsg;

    var caption = name;
    var idx = $.indexOf(fields, name);
    if (idx != -1) {
        caption = captions[idx];
        var captionStr = _scmsg(caption, "sccaption");
        if (captionStr.indexOf("Could not be found") == -1) {
            caption = captionStr;
        }
    }
    return caption;
}

function checkApproval(datas, query) {
    var _str = funcs.str;
    var approval = $("Approval", SCFILE_READONLY);
    approval = approval.setFields(["name", "approval.status", "pending.count", "current.pending.groups"]);
    approval.select(query).iterate(
        function(approval) {
            datas.push([approval["name"], approval["approval.status"], approval["pending.count"],
                _str(approval["current.pending.groups"])
            ]);
        });
}

function checkApprovalLog(datas, query, phaseName) {
    var approvalLog = $("ApprovalLog", SCFILE_READONLY);
    approvalLog = approvalLog.setFields(["action", "operator", "date", "current.phase"]);
    approvalLog.select(query).iterate(function(approvalLog) {
        var action = approvalLog["action"];
        var operator = approvalLog["operator"];
        var date = funcs.str(approvalLog["date"]);
        var currentPhase = approvalLog["current.phase"];
        if (currentPhase == phaseName) {
            datas.push([action, operator, date]);
        }
    });
}

function getApprovalInfo(phaseName, wfName, tableName, recordId, curPhase) {
    var _denull = funcs.denull;

    var infos = {
        "title": [],
        "data": []
    };

    // check if it is a workflow embeded in record
    var recordFlow = false;
    if (recordId != null && recordId != "" && recordId != "null" && curPhase != null &&
        curPhase != "" && curPhase != "null") {
        recordFlow = true;
    }

    if (recordFlow) {
        var svcCartItem;
        var datadict;
        var datadictFields;
        var datadictCaptions;

        if (phaseName == curPhase) {
            // check Approval
            var approvalQry = 'unique.key="' + recordId + '" and file.name="' + tableName + '"';
            checkApproval(infos.data, approvalQry);

            // check line item approval for interaction
            if (tableName == "incidents") {
                svcCartItem = $("svcCartItem", SCFILE_READONLY);
                svcCartItem = svcCartItem.setFields("cartItemId");

                svcCartItem.select('sdID="' + recordId + '"').iterate(function(item) {
                    approvalQry = 'unique.key="' + item["cartItemId"] + '" and file.name="svcCartItem"';
                    checkApproval(infos.data, approvalQry);
                });
            }

            if (infos.data.length > 0) {
                // get title caption
                var nameTitle = "name";
                var statusTitle = "approval.status";
                var countTitle = "pending.count";
                var groupTitle = "current.pending.groups";
                datadict = $("datadict").select('name="Approval"').uniqueResult();
                if (datadict != null) {
                    datadictFields = datadict["fields"];
                    datadictCaptions = datadict["captions"];
                    nameTitle = getFieldCaption(nameTitle, datadictFields, datadictCaptions);
                    statusTitle = getFieldCaption(statusTitle, datadictFields, datadictCaptions);
                    countTitle = getFieldCaption(countTitle, datadictFields, datadictCaptions);
                    groupTitle = getFieldCaption(groupTitle, datadictFields, datadictCaptions);
                }
                infos.title = [nameTitle, statusTitle, countTitle, groupTitle];
            }
        } else {
            // check ApprovalLog
            var approvallogQry = 'unique.key="' + recordId + '" and file.name="' + tableName + '"';
            checkApprovalLog(infos.data, approvallogQry, phaseName);

            // check line item approval for interaction
            if (tableName == "incidents") {
                svcCartItem = $("svcCartItem", SCFILE_READONLY);
                svcCartItem = svcCartItem.setFields("cartItemId");

                svcCartItem.select('sdID="' + recordId + '"').iterate(function(item) {
                    approvallogQry = 'unique.key="' + item["cartItemId"] + '" and file.name="svcCartItem"';
                    checkApprovalLog(infos.data, approvallogQry, phaseName);
                });
            }

            if (infos.data.length > 0) {
                // get title caption
                var actionTitle = "action";
                var operatorTitle = "operator";
                var dateTitle = "date";
                datadict = $("datadict").select('name="ApprovalLog"').uniqueResult();
                if (datadict != null) {
                    datadictFields = datadict["fields"];
                    datadictCaptions = datadict["captions"];
                    actionTitle = getFieldCaption(actionTitle, datadictFields, datadictCaptions);
                    operatorTitle = getFieldCaption(operatorTitle, datadictFields, datadictCaptions);
                    dateTitle = getFieldCaption(dateTitle, datadictFields, datadictCaptions);
                }
                infos["title"] = [actionTitle, operatorTitle, dateTitle];
            }
        }
    }

    if (infos["data"].length == 0) {
        // check workflow approval
        var workflowPhase = $("WorkflowPhase", SCFILE_READONLY).select(
            'workflowName ="' + wfName + '" and phaseName = "' + phaseName + '" and tableName="' +
            tableName + '"').uniqueResult();
        if (workflowPhase != null) {
            var approvals = _denull(workflowPhase["approvals"]);
            if (approvals != null) {
                var i;
                var iLoopTimes = approvals.length();
                for (i = 0; i < iLoopTimes; i++) {
                    infos["data"].push([approvals[i]]);
                }
            }
        }
    }

    return infos;
}

function getAlertList(start, count, filter) {
    var _str = funcs.str;
    var _type = funcs.type;
    var _rgoto = funcs.rgoto;
    var data = [];
    var total = 0;


    // set value
    if (null == count || "" == count || "null" == count) {
        count = 25;
    }
    if (null == start || "" == start || "null" == count) {
        start = 0;
    }

    var query = 'true';
    if (null != filter && "" != filter) {
        filter = escapeFilterStr(filter);
        query = 'name like "' + filter + '*"';
    }

    var alertDef = new SCFile("AlertDef", SCFILE_READONLY);
    var sortOrder = [SCFILE_ASC];
    var sortField = ["name"];
    alertDef.setOrderBy(sortField, sortOrder);
    total = alertDef.doCount(query);

    alertDef.setFields(["name", "description", "alert.status", "sched.condition", "alert.condition"]);
    var rc = alertDef.doSelect(query);
    if (rc == RC_SUCCESS) {
        _rgoto(alertDef, Number(start));
    }

    var cur = 0;
    while (rc == RC_SUCCESS) {
        cur++;
        if (cur > count) {
            break;
        }

        var name = alertDef["name"];
        var description = alertDef["description"];
        if (description != null) {
            if (_type(description) == $.Array) {
                description = description.toArray();
            }
        } else {
            description = "";
        }
        var status = alertDef["alert.status"];
        var schedCond = _str(alertDef["sched.condition"]);
        var alertCond = _str(alertDef["alert.condition"]);
        data.push({
            "name": name,
            "description": description,
            "status": status,
            "scheduleCond": schedCond,
            "alertCond": alertCond
        });

        rc = alertDef.getNext();
    }

    return {
        "data": data,
        "total": total
    };
}

function getApprovalList(start, count, filter) {
    var _str = funcs.str;
    var _type = funcs.type;
    var _rgoto = funcs.rgoto;
    var data = [];
    var total = 0;


    // set value
    if (null == count || "" == count || "null" == count) {
        count = 25;
    }
    if (null == start || "" == start || "null" == count) {
        start = 0;
    }

    var query = 'true';
    if (null != filter && "" != filter) {
        filter = escapeFilterStr(filter);
        query = 'name like "' + filter + '*"';
    }

    var approvalDef = new SCFile("ApprovalDef", SCFILE_READONLY);
    var sortOrder = [SCFILE_ASC];
    var sortField = ["name"];
    approvalDef.setOrderBy(sortField, sortOrder);
    total = approvalDef.doCount(query);

    approvalDef.setFields(["name", "appr.condition", "description"]);
    var rc = approvalDef.doSelect(query);
    if (rc == RC_SUCCESS) {
        _rgoto(approvalDef, Number(start));
    }

    var cur = 0;
    while (rc == RC_SUCCESS) {
        cur++;
        if (cur > count) {
            break;
        }

        var name = approvalDef["name"];
        var condition = _str(approvalDef["appr.condition"]);
        var description = approvalDef["description"];
        if (description != null) {
            if (_type(description) == $.Array) {
                description = description.toArray();
            }
        } else {
            description = "";
        }
        data.push({
            "name": name,
            "description": description,
            "approvalCond": condition
        });

        rc = approvalDef.getNext();
    }

    return {
        "data": data,
        "total": total
    };
}

function getRuleSetList(tablename, start, count, filter) {
    var _rgoto = funcs.rgoto;
    var data = [];
    var total = 0;

    // set value
    if (null == count || "" == count || "null" == count) {
        count = 25;
    }
    if (null == start || "" == start || "null" == count) {
        start = 0;
    }

    var query = '(tablename="' + tablename + '" or null(tablename))';
    if (null != filter && "" != filter) {
        filter = escapeFilterStr(filter);
        query += ' and (id like "' + filter + '*" or name like "' + filter + '*")';
    }

    var ruleSet = new SCFile("RuleSet", SCFILE_READONLY);
    var sortOrder = [SCFILE_ASC];
    var sortField = ["name"];
    ruleSet.setOrderBy(sortField, sortOrder);
    total = ruleSet.doCount(query);

    ruleSet.setFields(["id", "name"]);
    var rc = ruleSet.doSelect(query);
    if (rc == RC_SUCCESS) {
        _rgoto(ruleSet, Number(start));
    }

    var cur = 0;
    while (rc == RC_SUCCESS) {
        cur++;
        if (cur > count) {
            break;
        }

        var id = ruleSet["id"];
        var name = ruleSet["name"];
        data.push({
            "Rules": id,
            "RulesName": name
        });

        rc = ruleSet.getNext();
    }

    return {
        "data": data,
        "total": total
    };
}

function getActionList(tablename, start, count, filter) {
    var data = [];
    var total = 0;

    var query = '(tablename="' + tablename + '" or null(tablename)) and isAction=true';
    if (null != filter && "" != filter) {
        filter = escapeFilterStr(filter);
        query += ' and (name like "' + filter + '*")';
    }

    var ruleSet = new SCFile("RuleSet", SCFILE_READONLY);
    var sortOrder = [SCFILE_ASC];
    var sortField = ["name"];
    ruleSet.setOrderBy(sortField, sortOrder);
    ruleSet.setFields(["id", "name"]);

    var rc = ruleSet.doSelect(query);

    while (rc == RC_SUCCESS) {
        var id = ruleSet["id"];
        var name = ruleSet["name"];
        data.push({
            "value": id,
            "displayText": name
        });

        total++;

        rc = ruleSet.getNext();
    }

    return {
        "data": data,
        "total": total
    };
}


function getNextPhases(workflowName, tableName, phaseName) {
    var phases = [];
    getPhasesAfterCurrentPhase(workflowName, tableName, phaseName, phases);

    return lib.ArrayUtil.removeDuplicateEmptyElement(phases).toString();
}

/**
 * Get the localized display name for workflow phase
 */
function getPhaseDisplayName(workflow, table, phaseName) {
    return lib.WorkflowLocalization.getPhaseDisplayName(workflow, table, phaseName);
}

function getPhasesAfterCurrentPhase(workflowName, tableName, phaseName, phaseList) {

    if (phaseName !== null && phaseName !== "" && !lib.ArrayUtil.contains(phaseList, phaseName)) {
        var toPhase = "";
        var workflowPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
        var sql = "workflowName =\"" + workflowName + "\" and phaseName = \"" + phaseName +
            "\" and tableName=\"" + tableName + "\"";
        if (workflowPhase.doSelect(sql) === RC_SUCCESS) {
            if (workflowPhase.active === true) {}
            if (null !== workflowPhase.defaultTransition && "" !== workflowPhase.defaultTransition) {
                toPhase = workflowPhase.defaultTransition;
                phaseList.push(getPhaseDisplayName(workflowName, tableName, toPhase));
            }
            var mlng = funcs.lng(funcs.denull(workflowPhase.manualTransition));
            var alng = funcs.lng(funcs.denull(workflowPhase.autoTransition));

            var i;
            for (i = 0; i < mlng; i++) {
                toPhase = workflowPhase.manualTransition[i].mtToPhase;
                phaseList.push(getPhaseDisplayName(workflowName, tableName, toPhase));
            }
            var j;
            for (j = 0; j < alng; j++) {
                toPhase = workflowPhase.autoTransition[j].atToPhase;
                phaseList.push(getPhaseDisplayName(workflowName, tableName, toPhase));
            }
        } else {
            funcs.log("Can not find the WorkflowPhase definition for workflow of " +
                workflowName);
        }
    }

}

function getTableRuleSetsAndActions(tableName) {
    if (null == tableName) {
        return {
            "actions": null,
            "rules": null
        };
    }

    // QCCR1E116139, add security check to avoid security attack, this will be refined in later version after RTE and Client have a better solution
    if (!funcs.index("SysAdmin", vars["$lo.ucapex"]) > 0 &&
        lib.security.getRights("Tailoring", "view") !== "true") { // we only check the view right to keep consistent as front end.
        return {
            "status": 1,
            "message": "You are not authorized to save the Object based Rule Sets and Actions!"
        };
    }

    var actionFields = ["action"];
    var ruleSetFields = ["onCreateRules", "afterAddRules", "onEnterRules", "onExitRules", "initRules", "onDisplayRules", "onUpdateRules", "afterUpdateRules", "afterEnterRules"];
    var allFields = actionFields.concat(ruleSetFields);

    var object = new SCFile("Object", SCFILE_READONLY);
    object.setFields(allFields);
    var rc = object.doSelect('file.name="' + tableName + '"');
    if (rc !== RC_SUCCESS) {
        return {
            "actions": null,
            "rules": null
        };
    }

    var actions = [];
    var idx;
    var len = object.action.length();
    for (idx = 0; idx < len; idx++) {
        actions.push({
            actionName: object.action[idx]["actionName"],
            actionId: object.action[idx]["actionId"],
            actionCondition: object.action[idx]["actionCondition"],
            actionCondXML: object.action[idx]["actionCondXML"],
            actionLoc: object.action[idx]["actionLoc"],
            actionOption: object.action[idx]["actionOption"],
            actionLock: object.action[idx]["actionLock"],
            actionRunAction: object.action[idx]["actionRunAction"],
            actionCondDesc: object.action[idx]["actionCondDesc"],
            actionMsgId: object.action[idx]["actionMsgId"]
        });
    }

    var rules = {};
    len = ruleSetFields.length;
    var i;
    for (i = 0; i < len; i++) {
        rules[ruleSetFields[i]] = [];
        var lenIn = object[ruleSetFields[i]].length();
        for (idx = 0; idx < lenIn; idx++) {
            rules[ruleSetFields[i]].push({
                "Rules": object[ruleSetFields[i]][idx]
            });
        }
    }

    return {
        "actions": actions,
        "rules": rules
    };
}

function saveTableRuleSetsAndActions(tableName, jsonStr) {
    if (null == tableName) {
        return {
            "status": 0,
            "message": null
        };
    }

    // QCCR1E116139, add security check to avoid security attack, this will be refined in later version after RTE and Client have a better solution
    if (!funcs.index("SysAdmin", vars["$lo.ucapex"]) > 0 &&
        lib.security.getRights("Tailoring", "view") !== "true") { // we only check the view right to keep consistent as front end.
        return {
            "status": 1,
            "message": "You are not authorized to save the Object based Rule Sets and Actions!"
        };
    }

    var data = JSON.parse(jsonStr);

    var actionFields = ["action"];
    var ruleSetFields = ["onCreateRules", "afterAddRules", "onEnterRules", "onExitRules", "initRules", "onDisplayRules", "onUpdateRules", "afterUpdateRules", "afterEnterRules"];
    var allFields = actionFields.concat(ruleSetFields);

    var object = new SCFile("Object");
    //  object.setFields(allFields);
    var rc = object.doSelect('file.name="' + tableName + '"');
    if (rc !== RC_SUCCESS) {
        return {
            "status": 0,
            "message": null
        };
    }
    var oldObject = new SCDatum();
    funcs.copycurrent(oldObject, object);

    var actions = new SCDatum();
    actions.setType(8);
    object.action = actions;
    var len;
    var idx;
    if (null != data.actions) {
        len = data.actions.length;
        for (idx = 0; idx < len; idx++) {
            var action = data.actions[idx];
            object.action[idx].actionName = action["actionName"];
            object.action[idx].actionId = action["actionId"];
            // as action["actionCondition"] is not parsed into here from client side, re-generate it again here according to the condition xml.
            object.action[idx].actionCondition = funcs.parse(lib.conditionXmlParser.getRadQueryFromCondtionXml(action["actionCondXML"])[0], 2);
            object.action[idx].actionCondXML = action["actionCondXML"];
            object.action[idx].actionLoc = action["actionLoc"];
            object.action[idx].actionOption = action["actionOption"];
            object.action[idx].actionLock = action["actionLock"];
            object.action[idx].actionRunAction = action["actionRunAction"];
            object.action[idx].actionCondDesc = action["actionCondDesc"];
            object.action[idx].actionMsgId = action["actionMsgId"];
        }
    }

    len = ruleSetFields.length;
    var i;
    for (i = 0; i < len; i++) {
        if (null != data.rules[ruleSetFields[i]]) {
            var rules = new SCDatum();
            rules.setType(8);
            object[ruleSetFields[i]] = rules;
            var lenIn = data.rules[ruleSetFields[i]].length;
            for (idx = 0; idx < lenIn; idx++) {
                object[ruleSetFields[i]][idx] = data.rules[ruleSetFields[i]][idx]["Rules"];
            }
        }
    }

    rc = object.doUpdate(object);
    if (rc !== RC_SUCCESS) {
        return {
            "status": 1,
            "message": RCtoString(rc)
        };
    }

    // generate the scmsg for actions
    localizeTableActions(object, oldObject);

    return {
        "status": 0,
        "message": null
    };
}

function localizeTableActions(record, oldRecord) {
    var i = 0;
    var j = 0;
    if (oldRecord.action != record.action) {
        var msgclass = "wfA";
        var actionType = "addonly";
        var ids = [];
        var labels = [];
        var iLoopTimes = record.action.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (record.action[i].actionMsgId != null && record.action[i].actionMsgId != "undefined" && record.action[i].actionMsgId != "") {
                ids.push("file:" + record.file_name + ":" + record.action[i].actionMsgId);
                labels.push(record.action[i].actionName);
            }
        }
        var language;
        language = "en";
        if (vars.$G_my_language != null) {
            language = vars.$G_my_language;
        }
        lib.localizeTable.localizeList(ids, labels, language, msgclass, actionType);

        var deleteFields = [];
        var addFields = [];
        var addLabels = [];
        var jLoopTimes = oldRecord.action.length();
        for (j = 0; j < jLoopTimes; j++) {
            var match = false;
            iLoopTimes = record.action.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (record.action[i].actionMsgId != null && record.action[i].actionMsgId != undefined && record.action[i].actionMsgId != "") {
                    if (oldRecord.action[j].actionMsgId != null && oldRecord.action[j].actionMsgId != undefined && oldRecord.action[j].actionMsgId != "") {
                        if (record.action[i].actionMsgId == oldRecord.action[j].actionMsgId) {
                            match = true;
                            break;
                        }
                    }
                }
            }

            if (match == false) {
                deleteFields.push("file:" + oldRecord.file_name + ":" + oldRecord.action[j].actionMsgId);
            }
        }

        if (deleteFields.length != 0) {
            var deleteAction = "delete";
            lib.localizeTable.localizeList(deleteFields, null, language, msgclass, deleteAction);
        }
    }
}

/**
 *This method is used to check whether workflow properties is available in apps side. For PD Content Pack before PD4 , there is no such properties and Workflow Properties button 
 *should be hidden.
 */
function isWorkflowPropertyAvailable() {
    return lib.tableFunctions.getFieldType("onCreateRules", "Workflow") != -1;
}

/**
 * Escape the filter string for e.g.,
 *   - replace " to \"
 */
function escapeFilterStr(filter) {
    if (null != filter && "" != filter) {
        filter = filter.replace(/\\/g, '\\\\');
        filter = filter.replace(/"/g, '\\"');
    }

    return filter;
}

//--------------------- add for ide -------------------------

lib.WorkflowRemoteService = {
    "getWorkflowModuleAndArea": getWorkflowModuleAndArea,
    "getWorkflowList": getWorkflowList,
    "getApprovalPhases": getApprovalPhases,
    "getApprovalInfo": getApprovalInfo,
    "getAlertList": getAlertList,
    "getApprovalList": getApprovalList,
    "getRuleSetList": getRuleSetList,
    "getActionList": getActionList,
    "getNextPhases": getNextPhases,
    "getPhasesAfterCurrentPhase": getPhasesAfterCurrentPhase,
    "getTableRuleSetsAndActions": getTableRuleSetsAndActions,
    "saveTableRuleSetsAndActions": saveTableRuleSetsAndActions,
    "localizeTableActions": localizeTableActions,
    "isWorkflowPropertyAvailable": isWorkflowPropertyAvailable
};