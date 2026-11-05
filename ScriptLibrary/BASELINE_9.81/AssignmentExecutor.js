var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;

var parseRuleXML = lib.AssignmentWizard.parseRuleXML;
var parseRuleJSON = lib.AssignmentWizard.parseRuleJSON;
var FILENAME = funcs.filename;
var FIELDTYPE = lib.dbdictHelper.getFieldType;
var DELETE = funcs._delete;
var val = funcs.val;
var CallRad = lib.executor.CallRad;
var CallRadWithBackend = lib.executor.CallRadWithBackend;
var getQuerySql = lib.QueryEditorParser.getQuery;
var assignmentUtil = lib.AssignmentUtil;
var str = funcs.str;
var _null = funcs._null;
var _type = funcs.type;
var _min = funcs.min;
var scmsg = funcs.scmsg;
var msg = funcs.msg;
var msgCls = "local:assignmentRule";

var GROUPASSIGNTYPE_SERVICEBSD = "serviceBased";
var GROUPASSIGNTYPE_PREDEFINED = "predefined";
var GROUPASSIGNTYPE_FIXED = "fixed";
var GROUPASSIGNTYPE_JS = "js";

var ASSIGNEEASSIGNTYPE_NONE = "none";
var ASSIGNEEASSIGNTYPE_GROUPMEMBER = "groupMember";
var ASSIGNEEASSIGNTYPE_COORDINATOR = "coordinator";
var ASSIGNEEASSIGNTYPE_FIXED = "fixed";

var ASSUGNEEGROUPMEMBERTYPE_RUDROBIN = "roundRobin";

var STOP = "stop";

var MAX_RETURN_GROUP = 100; //CONSTANT
var maxReturnGroupMsg = "";

var MAX_RETURN_ASSIGNEE = 100; //CONSTANT
var maxReturnAssigneeMsg = "";

var MAX_ISIN_STR = 200; //CONSTANT

var AssignmentExecutor = $({
    assignmentType: "", //auto or manual
    defaultGroup: "",
    groupFieldName: "",
    groupAssignType: "", //Service based(serviceBased), Fixed(fixed) or Advanced JS(js)
    groupServiceFieldName: "",
    contactFieldName: "",
    isGroupServiceBased: false,
    isGroupLangBased: false,
    isGroupCompanyBased: false,
    isGroupLocationBased: false,
    isGroupDepartmentBased: false,
    checkGroupSchedule: false,
    groupQueryXml: "",
    groupFixedValue: "",
    groupScript: "",
    assigneeFieldName: "",
    assigneeAssignType: "", //None(none), Assign to group member(groupMember--->Round Robin/Number of assigned tickets), 
    //Assign to coordinator(coordinator), Fixed(fixed) or Advanced JS(js)
    assigneeGroupMemberType: "", //Round Robin(roundRobin) or Number of assigned tickets(numberOfAssigned)
    assignmentTimeFieldName: "",
    activeTicketQueryXml: "",
    assigneeCoordinatorType: "", //incident, change or problem
    assigneeFixedValue: "",
    assigneeScript: "",

    setGroupOK: false,
    setAssigneeOK: false,
    assignedGroupValue: "",
    oriGroupValue: "",
    assignedAssigneeValue: "",
    setGroupByJS: false,
    setAssigneeByJS: false,
    assignmentTimeRecentDays: "",

    init: function(request) {
        var jsonString = request.getParameter("$L.ruleJSON");
        var xmlString = request.getParameter("$L.ruleXML");
        var assignmentRuleConf = null;

        if (null == jsonString || "" == jsonString) {
            var ruleSet = new XML();
            ruleSet.setContent(xmlString);
            var parent = ruleSet.getDocumentElement();
            var rule = parent.getFirstChildElement();
            assignmentRuleConf = parseRuleXML(rule.toXMLString());
        } else {
            assignmentRuleConf = parseRuleJSON(jsonString);
        }

        this.assignmentType = assignmentRuleConf.assignmentType;
        this.defaultGroup = assignmentRuleConf.defaultGroup;
        this.groupFieldName = assignmentRuleConf.groupFieldName;
        this.groupAssignType = assignmentRuleConf.groupAssignType;
        this.groupServiceFieldName = assignmentRuleConf.groupServiceFieldName;
        this.contactFieldName = assignmentRuleConf.contactFieldName;
        this.isGroupServiceBased = assignmentRuleConf.isGroupServiceBased;
        this.isGroupLangBased = assignmentRuleConf.isGroupLangBased;
        this.isGroupCompanyBased = assignmentRuleConf.isGroupCompanyBased;
        this.isGroupLocationBased = assignmentRuleConf.isGroupLocationBased;
        this.isGroupDepartmentBased = assignmentRuleConf.isGroupDepartmentBased;
        this.checkGroupSchedule = assignmentRuleConf.checkGroupSchedule;
        this.groupQueryXml = assignmentRuleConf.groupQueryXml;
        this.groupFixedValue = assignmentRuleConf.groupFixedValue;
        this.groupScript = assignmentRuleConf.groupScript;
        this.assigneeFieldName = assignmentRuleConf.assigneeFieldName;
        this.assigneeAssignType = assignmentRuleConf.assigneeAssignType;
        this.assigneeGroupMemberType = assignmentRuleConf.assigneeGroupMemberType;
        this.assignmentTimeFieldName = assignmentRuleConf.assignmentTimeFieldName;
        this.activeTicketQueryXml = assignmentRuleConf.activeTicketQueryXml;
        this.assigneeCoordinatorType = assignmentRuleConf.assigneeCoordinatorType;
        this.assigneeFixedValue = assignmentRuleConf.assigneeFixedValue;
        this.assigneeScript = assignmentRuleConf.assigneeScript;
        this.assignmentTimeRecentDays = assignmentRuleConf.assignmentTimeRecentDays;
    },

    /**
     *	Valiation of Assignment Group and Assignee Value is not handled at runtime, 
     *   it should be handled with other rule type outside this rule type
     */
    executeRule: function(request) {
        vars.$isDefaultGroupAssigned = false;

        if (vars.$G_bg === true) {
            this.assignmentType = "auto";
        }

        var groupdDsplayScreen = this.handleAssignmentGroup(request);
        if (groupdDsplayScreen === "assignmentExecutorGroup.view") {
            return groupdDsplayScreen;
        } else if (groupdDsplayScreen === STOP) {
            return;
        }
        this.setGroupValue(request, this.assignedGroupValue);

        var assigneeDsplayScreen = this.handleAssignee(request);
        if (assigneeDsplayScreen === "assignmentExecutorAssignee.view") {
            return assigneeDsplayScreen;
        } else if (assigneeDsplayScreen === STOP) {
            return;
        }
        this.setAssigneeValue(request, this.assignedAssigneeValue);
    },

    handleAssignmentGroup: function(request) {
        var groupObj;
        var currentRecord = request.getParameter("$L.file");

        if (this.groupAssignType === GROUPASSIGNTYPE_JS) {
            vars.$L_file = request.getParameter("$L.file");
            vars.$L_file_save = request.getParameter("$L.file.save");
            var record = request.getParameter("$L.file");
            var oldRecord = request.getParameter("$L.file.save");
            var groupValue;
            try {
                eval(this.groupScript);
            } catch (e) {
                msg(scmsg("validate.groupJS", msgCls, ["'" + request.getParameter("$L.runningRuleset") + "'"]), 3);
                logInfo(e.toString());
                request.setAttribute("$L.result", 1);
                return STOP;
            }

            //groupValue is not set in js
            if (groupValue === undefined || _str.isBlank(groupValue)) {
                this.setDefaultGroup(request);
            }
            //groupValue is set in js
            else {
                this.setGroupByJS = true;
                if (!(groupValue instanceof Array)) {
                    if (_type(groupValue) === $.Array) {
                        groupValue = groupValue.toArray();
                    } else if (_type(groupValue) === $.Character) {
                        groupValue = [groupValue];
                    }
                }
                if (groupValue instanceof Array) {
                    groupObj = filterGroupValue(groupValue, this.checkGroupSchedule, this.assignmentType, currentRecord);
                    if (groupObj) {
                        groupValue = groupObj.group;
                        maxReturnGroupMsg = groupObj.msg;
                    }

                    if (groupValue.length === 0) {
                        this.setDefaultGroup(request);
                    } else if (groupValue.length === 1) {
                        this.setGroupOK = true;
                        this.assignedGroupValue = groupValue[0];
                        request.setAttribute("$L.result", 0);
                    }
                    // May need popup window based on field type
                    else {
                        if (this.assignmentType === "auto") { // pick the first group
                            this.setGroupOK = true;
                            this.assignedGroupValue = groupValue[0];
                            request.setAttribute("$L.result", 0);
                        }
                        //popup window to let user select a group
                        else {

                            var returnGroup = [];
                            returnGroup = groupValue;

                            request.setAttribute("$L.groups", returnGroup);
                            request.setAttribute("$L.groupTitle", scmsg("select.group.title", msgCls));
                            request.setAttribute("$L.ruleXML", request.getParameter("$L.ruleXML"));
                            request.setAttribute("$L.ruleJSON", request.getParameter("$L.ruleJSON"));
                            request.setAttribute("$L.file", request.getParameter("$L.file"));
                            request.setAttribute("$L.file.save", request.getParameter("$L.file.save"));
                            if ("" !== maxReturnGroupMsg && null !== maxReturnGroupMsg) {
                                msg(scmsg("select.group", msgCls) + " (" + maxReturnGroupMsg + ")", 1);
                                maxReturnGroupMsg = "";
                            } else {
                                msg(scmsg("select.group", msgCls), 1);
                            }
                            return "assignmentExecutorGroup.view";
                        }
                    }
                }
            }
        } else if (this.groupAssignType === GROUPASSIGNTYPE_FIXED) {
            if (null === this.groupFixedValue || "" === this.groupFixedValue) {
                this.setDefaultGroup(request);
            } else {
                groupObj = filterGroupValue(this.groupFixedValue, this.checkGroupSchedule, this.assignmentType, currentRecord);
                if (groupObj && groupObj.group.length !== 0) {
                    this.setGroupOK = true;
                    this.assignedGroupValue = groupObj.group[0];
                    request.setAttribute("$L.result", 0);
                } else {
                    this.setDefaultGroup(request);
                }
            }
        } else {
            currentRecord = request.getParameter("$L.file");
            var serviceName = currentRecord[this.groupServiceFieldName];
            var group = [];

            if (this.groupAssignType === GROUPASSIGNTYPE_SERVICEBSD) {
                groupObj = getGroupByService(serviceName, this.checkGroupSchedule, this.assignmentType);
            }
            // "Predefined"
            else {
                var sql = "true";
                var userProfile = assignmentUtil.getUserProfile(currentRecord, this.contactFieldName);
                var additionalQuerySql = "";
                var sqlQuery = "";

                if (this.isGroupServiceBased) {
                    var baseSql = "SELECT ta01.name as name,ta01.calendar.name as calendar.name,ta01.time.zone as time.zone FROM assignment ta01 LEFT OUTER JOIN device ta02 ON ";
                    var condition = "(ta01.name = ta02.assignment or ta01.name = ta02.support.groups)";
                    sqlQuery = " WHERE ta02.logical.name=\"" + serviceName + "\"";

                    if (!_str.isBlank(this.groupQueryXml)) {
                        additionalQuerySql = getQuerySql(this.groupQueryXml, {
                            CurrentRecord: currentRecord,
                            SavedRecord: request.getParameter("$L.file.save"),
                            TargetFile: FILENAME(currentRecord)
                        }, "ta01");
                        sqlQuery += " and " + additionalQuerySql;
                    }
                    if (!userProfile['invalid']) {
                        if (this.isGroupLangBased && userProfile['language']) {
                            sqlQuery += " and ta01.supported.languages=\"" + userProfile['language'] + "\"";
                        }
                        if (this.isGroupCompanyBased && vars.$G_system_info["multi.company"] && userProfile['company']) {
                            sqlQuery += " and ta01.supported.companies=\"" + userProfile['company'] + "\"";
                        }
                        if (this.isGroupLocationBased && userProfile['location']) {
                            sqlQuery += " and ta01.supported.locations=\"" + userProfile['location'] + "\"";
                        }
                        if (this.isGroupDepartmentBased && userProfile['dept']) {
                            sqlQuery += " and ta01.supported.depts=\"" + userProfile['dept'] + "\"";
                        }
                    }
                    sql = baseSql + condition + sqlQuery + " order by name";

                    if ("auto" === this.assignmentType) {
                        condition = "(ta01.name = ta02.assignment)";
                        sql = baseSql + condition + sqlQuery + " order by name";
                        groupObj = assignmentUtil.getAvailableAssignmentGroup(true, sql, this.checkGroupSchedule, this.assignmentType, MAX_RETURN_GROUP, currentRecord);
                        if (groupObj.group.length === 0) {
                            condition = "(ta01.name = ta02.support.groups)";
                            sql = baseSql + condition + sqlQuery + " order by name";
                            groupObj = assignmentUtil.getAvailableAssignmentGroup(true, sql, this.checkGroupSchedule, this.assignmentType, MAX_RETURN_GROUP, currentRecord);
                        }
                    } else {
                        groupObj = assignmentUtil.getAvailableAssignmentGroup(true, sql, this.checkGroupSchedule, this.assignmentType, MAX_RETURN_GROUP, currentRecord);
                    }
                } else {
                    if (!_str.isBlank(this.groupQueryXml)) {
                        additionalQuerySql = getQuerySql(this.groupQueryXml, {
                            CurrentRecord: currentRecord,
                            SavedRecord: request.getParameter("$L.file.save"),
                            TargetFile: FILENAME(currentRecord)
                        });
                        sql += " and " + additionalQuerySql;
                    }
                    if (!userProfile['invalid']) {
                        if (this.isGroupLangBased && userProfile['language']) {
                            sql += " and supported.languages=\"" + userProfile['language'] + "\"";
                        }
                        if (this.isGroupCompanyBased && vars.$G_system_info["multi.company"] && userProfile['company']) {
                            sql += " and supported.companies=\"" + userProfile['company'] + "\"";
                        }
                        if (this.isGroupLocationBased && userProfile['location']) {
                            sql += " and supported.locations=\"" + userProfile['location'] + "\"";
                        }
                        if (this.isGroupDepartmentBased && userProfile['dept']) {
                            sql += " and supported.depts=\"" + userProfile['dept'] + "\"";
                        }
                    }
                    groupObj = assignmentUtil.getAvailableAssignmentGroup(false, sql, this.checkGroupSchedule, this.assignmentType, MAX_RETURN_GROUP, currentRecord);
                }
            }

            group = groupObj.group;
            maxReturnGroupMsg = groupObj.msg;
            if (!(group instanceof Array)) {
                if (_type(group) === $.Array) {
                    group = group.toArray();
                }
            }
            if (group instanceof Array) {
                if (group.length === 0) {
                    this.setDefaultGroup(request);
                } else if (group.length === 1) {
                    this.setGroupOK = true;
                    this.assignedGroupValue = group[0];
                    request.setAttribute("$L.result", 0);
                }
                // May need popup window based on field type
                else {
                    if (this.assignmentType === "auto") { // pick the first group
                        this.setGroupOK = true;
                        this.assignedGroupValue = group[0];
                        request.setAttribute("$L.result", 0);
                    }
                    //popup window to let user select a group
                    else {
                        request.setAttribute("$L.groups", group);
                        request.setAttribute("$L.groupTitle", scmsg("select.group.title", msgCls));
                        request.setAttribute("$L.ruleXML", request.getParameter("$L.ruleXML"));
                        request.setAttribute("$L.ruleJSON", request.getParameter("$L.ruleJSON"));
                        request.setAttribute("$L.file", request.getParameter("$L.file"));
                        request.setAttribute("$L.file.save", request.getParameter("$L.file.save"));
                        if ("" !== maxReturnGroupMsg && null !== maxReturnGroupMsg) {
                            msg(scmsg("select.group", msgCls) + " (" + maxReturnGroupMsg + ")", 1);
                            maxReturnGroupMsg = "";
                        } else {
                            msg(scmsg("select.group", msgCls), 1);
                        }
                        return "assignmentExecutorGroup.view";
                    }
                }
            }
        }
    },

    handleAssignee: function(request) {
        var assignmentGroup = this.assignedGroupValue;
        var assignee = [];

        if (this.assigneeAssignType === ASSIGNEEASSIGNTYPE_NONE) {
            this.setAssigneeOK = true;
            request.setAttribute("$L.result", 0);
            return;
        } else if (this.assigneeAssignType === ASSIGNEEASSIGNTYPE_GROUPMEMBER) {
            if (this.assigneeGroupMemberType === ASSUGNEEGROUPMEMBERTYPE_RUDROBIN) {
                assignee = getAssigneeForRoundRobin(assignmentGroup, FILENAME(request.getParameter("$L.file")), this.assigneeFieldName, this.assignmentTimeFieldName, this.assignmentTimeRecentDays);
            }
            //numberOfAssigned
            else {
                var querySql = true;
                if (null !== this.activeTicketQueryXml && "" !== this.activeTicketQueryXml && "null" !== this.activeTicketQueryXml) {
                    querySql = getQuerySql(this.activeTicketQueryXml, {
                        CurrentRecord: request.getParameter("$L.file"),
                        SavedRecord: request.getParameter("$L.file.save"),
                        TargetFile: FILENAME(request.getParameter("$L.file"))
                    });
                }
                assignee = getAssigneeForNoOfAssigned(assignmentGroup, FILENAME(request.getParameter("$L.file")), this.assigneeFieldName, querySql);
            }
            //process assignee with returned value
            if (assignee.length === 0) {
                this.setAssigneeOK = true;
                this.assignedAssigneeValue = "";
                request.setAttribute("$L.result", 0);
            } else if (assignee.length === 1) {
                this.setAssigneeOK = true;
                this.assignedAssigneeValue = assignee[0];
                request.setAttribute("$L.result", 0);
            }
            // need popup window to let user select one assignee based on assignmentType
            else {
                if (this.assignmentType === "auto") { // pick the first group
                    this.setAssigneeOK = true;
                    this.assignedAssigneeValue = assignee[0];
                    request.setAttribute("$L.result", 0);
                }
                //popup window to let user select a assignee
                else {
                    request.setAttribute("$L.assignees", assignee);
                    request.setAttribute("$L.assigneeTitle", scmsg("select.assignee.title", msgCls));
                    request.setAttribute("$L.selectedgroup", this.assignedGroupValue);
                    request.setAttribute("$L.ruleXML", request.getParameter("$L.ruleXML"));
                    request.setAttribute("$L.ruleJSON", request.getParameter("$L.ruleJSON"));
                    request.setAttribute("$L.file", request.getParameter("$L.file"));
                    request.setAttribute("$L.file.save", request.getParameter("$L.file.save"));
                    if ("" !== maxReturnAssigneeMsg && null !== maxReturnAssigneeMsg) {
                        msg(scmsg("select.assignee", msgCls) + " (" + maxReturnAssigneeMsg + ")", 1);
                        maxReturnAssigneeMsg = "";
                    } else {
                        msg(scmsg("select.assignee", msgCls), 1);
                    }
                    return "assignmentExecutorAssignee.view";
                }
            }
        } else if (this.assigneeAssignType === ASSIGNEEASSIGNTYPE_COORDINATOR) {
            var assignmentGroupRecord;
            var field = this.assigneeCoordinatorType;

            assignmentGroupRecord = getAssignmentGroup(assignmentGroup);
            if (null !== assignmentGroupRecord[field] && "" !== assignmentGroupRecord[field]) {
                assignee.push(assignmentGroupRecord[field]);
            }

            if (assignee.length === 0) {
                this.setAssigneeOK = true;
                this.assignedAssigneeValue = "";
                request.setAttribute("$L.result", 0);
            } else {
                this.setAssigneeOK = true;
                this.assignedAssigneeValue = assignee[0];
                request.setAttribute("$L.result", 0);
            }
        } else if (this.assigneeAssignType === ASSIGNEEASSIGNTYPE_FIXED) {
            if ("" === this.assigneeFixedValue || null === this.assigneeFixedValue) {
                this.setAssigneeOK = true;
                this.assignedAssigneeValue = "";
                request.setAttribute("$L.result", 0);
            } else {
                this.setAssigneeOK = true;
                this.assignedAssigneeValue = this.assigneeFixedValue;
                request.setAttribute("$L.result", 0);
            }
        }
        //js
        else {
            vars.$L_file = request.getParameter("$L.file");
            vars.$L_file_save = request.getParameter("$L.file.save");
            var record = request.getParameter("$L.file");
            var oldRecord = request.getParameter("$L.file.save");
            var assigneeValue;
            try {
                eval(this.assigneeScript);
            } catch (e) {
                msg(scmsg("validate.assigneeJS", msgCls, ["'" + request.getParameter("$L.runningRuleset") + "'"]), 3);
                logInfo(e.toString());
                request.setAttribute("$L.result", 1);
                this.rollBackGroupValue(request);
                return STOP;
            }
            //assigneeValue is not set in js
            if (assigneeValue === undefined) {
                this.setAssigneeOK = true;
                request.setAttribute("$L.result", 0);
                return;
            }
            //assigneeValue is set in js
            else {
                this.setAssigneeByJS = true;
                if (!(assigneeValue instanceof Array)) {
                    if (_type(assigneeValue) === $.Array) {
                        assigneeValue = assigneeValue.toArray();
                    }
                }
                if (assigneeValue instanceof Array) {
                    if (assigneeValue.length === 0) {
                        this.setAssigneeOK = true;
                        this.assignedAssigneeValue = "";
                        request.setAttribute("$L.result", 0);
                    } else if (assigneeValue.length === 1) {
                        this.setAssigneeOK = true;
                        this.assignedAssigneeValue = assigneeValue[0];
                        request.setAttribute("$L.result", 0);

                    }
                    // May need popup window based on field type
                    else {
                        if (this.assignmentType === "auto") { // pick the first group
                            this.setAssigneeOK = true;
                            this.assignedAssigneeValue = assigneeValue[0];
                            request.setAttribute("$L.result", 0);
                        }
                        //popup window to let user select a assignee
                        else {
                            var returnAssignee = [];
                            returnAssignee = assigneeValue;
                            if (assigneeValue.length > MAX_RETURN_ASSIGNEE) {
                                returnAssignee = [];
                                var y;
                                for (y = 0; y < assigneeValue.length; y++) {
                                    if (returnAssignee.length < MAX_RETURN_ASSIGNEE) {
                                        returnAssignee.push(assigneeValue[y]);
                                    }
                                }
                                maxReturnAssigneeMsg = scmsg("return.maxAssignee", msgCls, [MAX_RETURN_ASSIGNEE, assigneeValue.length - MAX_RETURN_ASSIGNEE]);
                            }
                            request.setAttribute("$L.assignees", returnAssignee);
                            request.setAttribute("$L.assigneeTitle", scmsg("select.assignee.title", msgCls));
                            request.setAttribute("$L.selectedgroup", this.assignedGroupValue);
                            request.setAttribute("$L.ruleXML", request.getParameter("$L.ruleXML"));
                            request.setAttribute("$L.ruleJSON", request.getParameter("$L.ruleJSON"));
                            request.setAttribute("$L.file", request.getParameter("$L.file"));
                            request.setAttribute("$L.file.save", request.getParameter("$L.file.save"));
                            if ("" !== maxReturnAssigneeMsg && null !== maxReturnAssigneeMsg) {
                                msg(scmsg("select.assignee", msgCls) + " (" + maxReturnAssigneeMsg + ")", 1);
                                maxReturnAssigneeMsg = "";
                            } else {
                                msg(scmsg("select.assignee", msgCls), 1);
                            }
                            return "assignmentExecutorAssignee.view";
                        }
                    }
                } else if (null === assigneeValue || "" === assigneeValue) {
                    this.setAssigneeOK = true;
                    this.assignedAssigneeValue = "";
                    this.setAssigneeByJS = true;
                    request.setAttribute("$L.result", 0);
                } else {
                    this.setAssigneeOK = true;
                    this.assignedAssigneeValue = assigneeValue;
                    request.setAttribute("$L.result", 0);
                }
            }
        }
    },

    setGroupValue: function(request, groupValue) {
        var ticket = request.getParameter("$L.file");
        var fileName = FILENAME(ticket);
        var fieldType = 0;
        if (this.setGroupOK) {
            //set group
            if (("" !== groupValue && null !== groupValue && !this.setGroupByJS) || this.setGroupByJS) {
                this.oriGroupValue = ticket[this.groupFieldName];
                fieldType = getFieldType(fileName, this.groupFieldName);
                if (fieldType === 8) {
                    var n;
                    var lng = ticket[this.groupFieldName].length();
                    for (n = 0; n < lng; n++) {
                        ticket[this.groupFieldName] = DELETE(ticket[this.groupFieldName], 1, 1);
                    }
                    ticket[this.groupFieldName][0] = groupValue;
                } else {
                    ticket[this.groupFieldName] = val(groupValue, fieldType);
                }
            }
        }
    },

    rollBackGroupValue: function(request) {
        var ticket = request.getParameter("$L.file");
        ticket[this.groupFieldName] = this.oriGroupValue;
    },

    setAssigneeValue: function(request, assigneeValue) {
        var ticket = request.getParameter("$L.file");
        var fileName = FILENAME(ticket);
        var fieldType = 0;
        if (this.setAssigneeOK) {
            //Set assignee
            if ((this.assigneeAssignType !== ASSIGNEEASSIGNTYPE_NONE && "" !== assigneeValue && null !== assigneeValue && !this.setAssigneeByJS) || (this.assigneeAssignType !== ASSIGNEEASSIGNTYPE_NONE && this.setAssigneeByJS)) {
                fieldType = getFieldType(fileName, this.assigneeFieldName);
                if (fieldType === 8) {
                    var n;
                    var lng = ticket[this.assigneeFieldName].length();
                    for (n = 0; n < lng; n++) {
                        ticket[this.assigneeFieldName] = DELETE(ticket[this.assigneeFieldName], 1, 1);
                    }
                    ticket[this.assigneeFieldName][0] = assigneeValue;
                } else {
                    ticket[this.assigneeFieldName] = val(assigneeValue, fieldType);

                }
            }
        }

    },

    setDefaultGroup: function(request) {
        if (null === this.defaultGroup) {
            this.assignedGroupValue = "";
        } else {
            this.assignedGroupValue = this.defaultGroup;
            vars.$isDefaultGroupAssigned = true;
        }
        this.setGroupOK = true;
        request.setAttribute("$L.result", 0);
    },

    pickupGroup: function(request) {
        var selectedGroup = request.getParameter("$L.selectedgroup");
        this.assignedGroupValue = selectedGroup;
        this.setGroupOK = true;
        this.setGroupValue(request, this.assignedGroupValue);
        var assigneeDs = this.handleAssignee(request);
        if (assigneeDs === "assignmentExecutorAssignee.view") {
            return assigneeDs;
        }
        this.setAssigneeValue(request, this.assignedAssigneeValue);
    },

    pickupAssignee: function(request) {
        request.setAttribute("$L.result", 0);
        this.setAssigneeOK = true;
        this.setAssigneeValue(request, request.getParameter("$L.selectedassignee"));

    },

    cancel: function(request) {
        request.setAttribute("$L.result", 1);
        return;
    }
});

function filterGroupValue(groupValue, checkGroupSchedule, assignmentType, currentRecord) {

    var groupQuery = "";

    if (groupValue instanceof Array) {
        if (groupValue.length > 0) {
            groupQuery = "name isin {";
            var i;
            for (i = 0; i < groupValue.length; i++) {
                groupQuery += '"' + groupValue[i] + '"';
                if (i !== groupValue.length - 1) {
                    groupQuery += ",";
                }
            }
            groupQuery += "}";
        }
    } else {
        groupQuery = "name=\"" + groupValue + "\"";
    }

    if (groupQuery === "") {
        return null;
    } else {
        return assignmentUtil.getAvailableAssignmentGroup(false, groupQuery, checkGroupSchedule, assignmentType, MAX_RETURN_GROUP, currentRecord);
    }
}

function isValidDatadictField(fileName, fieldName) {
    var dataDict = new SCFile("datadict");
    var sql = "name=\"" + fileName + "\"";
    var fields = [];
    var validField = false;
    if (dataDict.doSelect(sql) === RC_SUCCESS) {
        fields = dataDict.fields;
        if (lib.ArrayUtil.contains(fields, fieldName)) {
            validField = true;
        }
    }
    return validField;
}

function getFieldType(fileName, field) {
    var dbDict = new SCFile("dbdict");
    var dbsql = "name=\"" + fileName + "\"";
    dbDict.doSelect(dbsql);
    var fieldType = FIELDTYPE(dbDict, field);
    return fieldType;
}

function getAssignmentGroup(groupName) {
    var assignmentGroup = new SCFile("assignment");
    var sql = "name=\"" + groupName + "\"";
    if (assignmentGroup.doSelect(sql) === RC_SUCCESS) {
        return assignmentGroup;
    }
    return assignmentGroup;
}

function getGroupByService(serviceName, checkWorkSch, assignmentType) {
    var sql = "SELECT ta01.name as name,ta01.calendar.name as calendar.name,ta01.time.zone as time.zone FROM assignment ta01 LEFT OUTER JOIN device ta02 ON  ( ta01.name = ta02.support.groups )  WHERE ta02.logical.name=\"" + serviceName + "\"";
    sql += " order by name";
    return assignmentUtil.getAvailableAssignmentGroup(false, sql, checkWorkSch, assignmentType, MAX_RETURN_GROUP);
}

/**
 *
 */
function getRecentDaysTime(recentDays) {
    var dt = Number(recentDays) * 24 * 3600 * 1000;
    var dateTime = new Date(Date.now() - dt);

    return funcs.str(dateTime);
}

function getAssigneeForRoundRobin(groupName, queryFile, assigneeField, assignTimeField, recentDays) {
    var assignmentGroup = new SCFile("assignment");
    var sql = "name=\"" + groupName + "\"";

    var queryMembers = "";
    var assignees = [];
    var possibleAssignees = {};
    var tempAssignees = [];
    var minTime = "0";
    var minTimeArray = [];
    if (recentDays === "" || recentDays === null) {
        recentDays = 0;
    }
    var assignedTime = getRecentDaysTime(recentDays);

    if (assignmentGroup.doSelect(sql) === RC_SUCCESS) {
        if (_null(assignmentGroup.operators)) {
            return assignees;
        }
        //Group members are not null
        else {
            var ticket = new SCFile(queryFile, SCFILE_READONLY);
            sql = "";
            var groupMemberLng = assignmentGroup.operators.length();

            //Number of group members is greater than the sql 'isin' clause str limitation
            if (groupMemberLng > MAX_ISIN_STR) {
                var divGroups = Math.ceil(groupMemberLng / MAX_ISIN_STR);

                var a;
                for (a = 0; a < divGroups; a++) {
                    queryMembers = "{";
                    var b;
                    for (b = a * MAX_ISIN_STR;
                        (b < (a + 1) * MAX_ISIN_STR) && b < groupMemberLng; b++) {
                        if ((b + 1) == (a + 1) * MAX_ISIN_STR || (b + 1) == groupMemberLng) {
                            queryMembers += "\"" + assignmentGroup.operators[b] + "\"";
                        } else {
                            queryMembers += "\"" + assignmentGroup.operators[b] + "\",";
                        }
                    }
                    queryMembers += "}";

                    sql = "select " + assigneeField + ", max(" + assignTimeField + ") time from " + queryFile + " where " + assignTimeField + ">='" + assignedTime + "' and " + assigneeField + " isin " + queryMembers + " group by " + assigneeField + " order by time";
                    if (Number(recentDays) == 0) {
                        sql = "select " + assigneeField + ", max(" + assignTimeField + ") time from " + queryFile + " where " + assigneeField + " isin " + queryMembers + " group by " + assigneeField + " order by time";
                    }
                    if (ticket.doSelect(sql) === RC_SUCCESS) {
                        minTimeArray.push(new Date(ticket[1]).getTime());
                        do {
                            tempAssignees.push({
                                time: new Date(ticket[1]).getTime(),
                                assignee: ticket[0]
                            });
                            possibleAssignees[ticket[0]] = "1"; //use object rather than array to store the possible assignee
                        } while (ticket.getNext() === RC_SUCCESS);
                    }
                }

                //records returned by doing select
                if (minTimeArray.length > 0) {
                    //check if there are group members who are never assigned tickets
                    getAssigneesNeverAssignedTickets(assignees, possibleAssignees, assignmentGroup);

                    //returns assignees who is never assigned tickets
                    if (assignees.length > 0) {
                        return assignees;
                    }
                    //returns assignees whose assigned time is the earlist
                    else {
                        minTime = _min(minTimeArray);
                        getAssigneesByAssignedTime(assignees, minTime, tempAssignees);
                        return assignees;
                    }
                }
                //no records returned by doing select, means all the group members have no assigned tickets
                else {
                    getAssigneesFromGroupMembers(assignees, assignmentGroup);
                    return assignees;
                }
            }
            //Number of group members is not greater than the sql 'isin' clause str limitation
            else {
                queryMembers = "{";
                var i;
                for (i = 0; i < groupMemberLng; i++) {
                    if ((i + 1) == groupMemberLng) {
                        queryMembers += "\"" + assignmentGroup.operators[i] + "\"";
                    } else {
                        queryMembers += "\"" + assignmentGroup.operators[i] + "\",";
                    }
                }
                queryMembers += "}";

                sql = "select " + assigneeField + ", max(" + assignTimeField + ") time from " + queryFile + " where " + assignTimeField + ">='" + assignedTime + "' and " + assigneeField + " isin " + queryMembers + " group by " + assigneeField + " order by time";
                if (Number(recentDays) == 0) {
                    sql = "select " + assigneeField + ", max(" + assignTimeField + ") time from " + queryFile + " where " + assigneeField + " isin " + queryMembers + " group by " + assigneeField + " order by time";
                }
                //records returned by doing select
                if (ticket.doSelect(sql) === RC_SUCCESS) {
                    minTime = new Date(ticket[1]).getTime();
                    do {
                        tempAssignees.push({
                            time: new Date(ticket[1]).getTime(),
                            assignee: ticket[0]
                        });
                        possibleAssignees[ticket[0]] = "1";
                    } while (ticket.getNext() === RC_SUCCESS);

                    //check if there are group members who are never assigned tickets
                    getAssigneesNeverAssignedTickets(assignees, possibleAssignees, assignmentGroup);
                    //returns assignees who is never assigned tickets
                    if (assignees.length > 0) {
                        return assignees;
                    }
                    //returns assignees whose assigned time is the earlist
                    else {
                        getAssigneesByAssignedTime(assignees, minTime, tempAssignees);
                        return assignees;
                    }
                }
                //no records returned by doing select, means all the group members have no assigned tickets
                else {
                    getAssigneesFromGroupMembers(assignees, assignmentGroup);
                    return assignees;
                }
            }
        }
    }
    return assignees;
}

function getAssigneesNeverAssignedTickets(assignees, possibleAssignees, assignmentGroup) {
    var assigneeCount = 0;
    var j;
    var operatorLength = assignmentGroup.operators.length();
    for (j = 0; j < operatorLength; j++) {
        if (possibleAssignees[assignmentGroup.operators[j]] == null) {
            assigneeCount++;
            if (assignees.length < MAX_RETURN_ASSIGNEE) {
                assignees.push(assignmentGroup.operators[j]);
            }
        }
    }
    if (assigneeCount > MAX_RETURN_ASSIGNEE) {
        maxReturnAssigneeMsg = scmsg("return.maxAssignee", msgCls, [MAX_RETURN_ASSIGNEE, assigneeCount - MAX_RETURN_ASSIGNEE]);
    }
}

function getAssigneesFromGroupMembers(assignees, assignmentGroup) {
    var assigneeCount = 0;
    var e;
    var operatorLength = assignmentGroup.operators.length();
    for (e = 0; e < operatorLength; e++) {
        assigneeCount++;
        if (assignees.length < MAX_RETURN_ASSIGNEE) {
            assignees.push(assignmentGroup.operators[e]);
        }
    }
    if (assigneeCount > MAX_RETURN_ASSIGNEE) {
        maxReturnAssigneeMsg = scmsg("return.maxAssignee", msgCls, [MAX_RETURN_ASSIGNEE, assigneeCount - MAX_RETURN_ASSIGNEE]);
    }
}

function getAssigneesByAssignedTime(assignees, minTime, tempAssignees) {
    var assigneeCount = 0;
    var d;
    for (d = 0; d < tempAssignees.length; d++) {
        if (minTime === tempAssignees[d].time) {
            assigneeCount++;
            if (assignees.length < MAX_RETURN_ASSIGNEE) {
                assignees.push(tempAssignees[d].assignee);
            }
        }
    }

    if (assigneeCount > MAX_RETURN_ASSIGNEE) {
        maxReturnAssigneeMsg = scmsg("return.maxAssignee", msgCls, [MAX_RETURN_ASSIGNEE, assigneeCount - MAX_RETURN_ASSIGNEE]);
    }
}

function getAssigneesByAssignedNo(assignees, count, tempAssignees) {
    var assigneeCount = 0;
    var h;
    for (h = 0; h < tempAssignees.length; h++) {
        if (count === tempAssignees[h].ncount) {
            assigneeCount++;
            if (assignees.length < MAX_RETURN_ASSIGNEE) {
                assignees.push(tempAssignees[h].assignee);
            }
        }
    }
    if (assigneeCount > MAX_RETURN_ASSIGNEE) {
        maxReturnAssigneeMsg = scmsg("return.maxAssignee", msgCls, [MAX_RETURN_ASSIGNEE, assigneeCount - MAX_RETURN_ASSIGNEE]);
    }
}

/**
 *
 */
function getAssigneeForNoOfAssigned(groupName, queryFile, assigneeField, appendSql) {
    var assignmentGroup = new SCFile("assignment");
    var sql = "name=\"" + groupName + "\"";
    var members = [];
    var queryMembers = "";
    var assignees = [];
    var possibleAssignees = {};
    var tempAssignees = [];
    var count = "0";
    var countArray = [];
    if (assignmentGroup.doSelect(sql) === RC_SUCCESS) {
        if (_null(assignmentGroup.operators)) {
            return assignees;
        }
        //Group members are not null
        else {
            var ticket = new SCFile(queryFile, SCFILE_READONLY);
            sql = "";
            var groupMemberLng = assignmentGroup.operators.length();

            //Number of group members is greater than the sql 'isin' clause str limitation
            if (groupMemberLng > MAX_ISIN_STR) {
                var divGroups = Math.ceil(groupMemberLng / MAX_ISIN_STR);

                var a;
                for (a = 0; a < divGroups; a++) {
                    queryMembers = "{";
                    var b;
                    for (b = a * MAX_ISIN_STR;
                        (b < (a + 1) * MAX_ISIN_STR) && b < groupMemberLng; b++) {
                        if ((b + 1) == (a + 1) * MAX_ISIN_STR || (b + 1) == groupMemberLng) {
                            queryMembers += "\"" + assignmentGroup.operators[b] + "\"";
                        } else {
                            queryMembers += "\"" + assignmentGroup.operators[b] + "\",";
                        }
                    }
                    queryMembers += "}";

                    sql = "select " + assigneeField + ", count(*) ncnt from " + queryFile + " where " + assigneeField + " isin " + queryMembers + " and " + appendSql + " group by " + assigneeField + " order by ncnt";
                    if (ticket.doSelect(sql) === RC_SUCCESS) {
                        countArray.push(ticket[1]);
                        do {
                            tempAssignees.push({
                                ncount: ticket[1],
                                assignee: ticket[0]
                            });
                            possibleAssignees[ticket[0]] = "1"; //use object rather than array to store the possible assignee
                        } while (ticket.getNext() === RC_SUCCESS);
                    }
                }

                //records returned by doing select
                if (countArray.length > 0) {
                    //check if there are group members who are never assigned tickets
                    getAssigneesNeverAssignedTickets(assignees, possibleAssignees, assignmentGroup);

                    //returns assignees who is never assigned tickets
                    if (assignees.length > 0) {
                        return assignees;
                    }
                    //returns assignees whose assigned time is the earlist
                    else {
                        count = _min(countArray);
                        getAssigneesByAssignedNo(assignees, count, tempAssignees);
                        return assignees;
                    }
                }
                //no records returned by doing select, means all the group members have no assigned tickets
                else {
                    getAssigneesFromGroupMembers(assignees, assignmentGroup);
                    return assignees;
                }
            }
            //Number of group members is not greater than the sql 'isin' clause str limitation
            else {
                queryMembers = "{";
                var i;
                for (i = 0; i < groupMemberLng; i++) {
                    if ((i + 1) == groupMemberLng) {
                        queryMembers += "\"" + assignmentGroup.operators[i] + "\"";
                    } else {
                        queryMembers += "\"" + assignmentGroup.operators[i] + "\",";
                    }
                }
                queryMembers += "}";

                sql = "select " + assigneeField + ", count(*) ncnt from " + queryFile + " where " + assigneeField + " isin " + queryMembers + " and " + appendSql + " group by " + assigneeField + " order by ncnt";
                //records returned by doing select
                if (ticket.doSelect(sql) === RC_SUCCESS) {
                    count = ticket[1];
                    do {
                        tempAssignees.push({
                            ncount: ticket[1],
                            assignee: ticket[0]
                        });
                        possibleAssignees[ticket[0]] = "1"; //use object rather than array to store the possible assignee
                    } while (ticket.getNext() === RC_SUCCESS);

                    //check if there are group members who are never assigned tickets
                    getAssigneesNeverAssignedTickets(assignees, possibleAssignees, assignmentGroup);
                    //returns assignees who is never assigned tickets
                    if (assignees.length > 0) {
                        return assignees;
                    }
                    //returns assignees whose assigned time is the earlist
                    else {
                        getAssigneesByAssignedNo(assignees, count, tempAssignees);
                        return assignees;
                    }
                }
                //no records returned by doing select, means all the group members have no assigned tickets
                else {
                    getAssigneesFromGroupMembers(assignees, assignmentGroup);
                    return assignees;
                }
            }
        }
    }
    return assignees;
}

function logInfo(info) {
    var log = getLog("AssignmentExecutor");
    if (log.isInfoEnabled()) {
        log.info(info);
    }
}

function getClass() {
    return AssignmentExecutor;
}