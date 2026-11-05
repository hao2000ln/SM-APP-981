var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var scmsg = funcs.scmsg;
var msg = funcs.msg;
var cursor_field_name_set = funcs.cursor_field_name_set;
var getElement = lib.xmlHelpers.getElement;
var getDescription = lib.QueryEditorParser.getDescription;

// consts
var MSG_CLASS = "local:assignmentRule";
// const for assignment type
var ASSIGNMENT_AUTO = "auto";
var ASSIGNMENT_MANUAL = "manual";

// const for assign types
var GROUP_ASSIGN_TYPE_SERVICE = "serviceBased";
var ASSIGNEE_ASSIGN_TYPE_NONE = "none";
var ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER = "groupMember";
var ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_ROUND_ROBIN = "roundRobin";
var ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_NUMBER_OF_ASSIGNED = "numberOfAssigned";
var ASSIGNEE_ASSIGN_TYPE_COORDINATOR = "coordinator";
var ASSIGN_TYPE_FIXED = "fixed";
var ASSIGN_TYPE_JS = "js";
var ASSIGNMENT_TIME_RECENT_DEFAULT_DAYS = 60;
// const for xml element names
var XML_ELEMENT_ASSIGNMENT_TYPE = "assignmentType";
var XML_ELEMENT_DEFAULT_GROUP = "defaultGroup";
var XML_ELEMENT_GROUP_FIELD_NAME = "groupFieldName";
var XML_ELEMENT_GROUP_ASSIGN_TYPE = "groupAssignType";
var XML_ELEMENT_GROUP_SERVICE_FIELD_NAME = "groupServiceFieldName";
var XML_ELEMENT_GROUP_FIXED_VALUE = "groupFixedValue";
var XML_ELEMENT_GROUP_SCRIPT = "groupScript";
var XML_ELEMENT_ASSIGNEE_FIELD_NAME = "assigneeFieldName";
var XML_ELEMENT_ASSIGNEE_ASSIGN_TYPE = "assigneeAssignType";
var XML_ELEMENT_ASSIGNEE_GROUP_MEMBER_TYPE = "assigneeGroupMemberType";
var XML_ELEMENT_ASSIGNMENT_TIME_FIELD_NAME = "assignmentTimeFieldName";
var XML_ELEMENT_ASSIGNMENT_TIME_RECENT_DAYS = "assignmentTimeRecentDays";
var XML_ELEMENT_ACTIVE_TICKET_QUERY_XML = "activeTicketQueryXml";
var XML_ELEMENT_ASSIGNEE_COORDINATOR_TYPE = "assigneeCoordinatorType";
var XML_ELEMENT_ASSIGNEE_FIXED_VALUE = "assigneeFixedValue";
var XML_ELEMENT_ASSIGNEE_SCRIPT = "assigneeScript";
// const for parameter names
var PARAM_ASSIGNMENT_TYPE = "$L.assignment.type";
var PARAM_DEFAULT_GROUP = "$L.default.group";
var PARAM_GROUP_FIELD_NAME = "$L.group.field.name";
var PARAM_GROUP_ASSIGN_TYPE = "$L.group.assign.type";
var PARAM_GROUP_SERVICE_FIELD_NAME = "$L.group.service.field.name";
var PARAM_GROUP_FIXED_VALUE = "$L.group.fixed.value";
var PARAM_GROUP_SCRIPT = "$L.group.script";
var PARAM_ASSIGNEE_FIELD_NAME = "$L.assignee.field.name";
var PARAM_ASSIGNEE_ASSIGN_TYPE = "$L.assignee.assign.type";
var PARAM_ASSIGNEE_GROUP_MEMBER_TYPE = "$L.assignee.group.member.type";
var PARAM_ASSIGNMENT_TIME_FIELD_NAME = "$L.assignment.time.field.name";
var PARAM_ACTIVE_TICKET_QUERY_XML = "$L.query.xml";
var PARAM_ACTIVE_TICKET_QUERY_DESC = "$L.query.desc";
var PARAM_ASSIGNEE_COORDINATOR_TYPE = "$L.assignee.coordinator.type";
var PARAM_ASSIGNEE_FIXED_VALUE = "$L.assignee.fixed.value";
var PARAM_ASSIGNEE_SCRIPT = "$L.assignee.script";
var PARAM_ASSIGNMENT_TIME_RECENT_DAYS = "$L.assignment.recent.days";
var PARAM_ASSIGNMENT_BYSKILL = "$L.assignment.byskill";

/**
 * Get a field list of a file with ordered by caption.
 *
 * @param {string}
 *          filename - the file name.
 * @param {int}
 *          type - the field type (SM type).
 * @return {array of object} the Array of filed list with field name and localized caption.
 */
function getFileFields(filename, type) {
    var fields = [];

    var datadict = $("datadict").select('name="' + filename + '"').uniqueResult();
    var setting = $("settings", SCFILE_READONLY).select('name="Condition Editor"').uniqueResult();
    var settingIds = setting["settingId"];
    var settingValues = setting["settingValue"];
    var displaySystemfields = false;
    var displayDeprecatedfields = false;
    var i;
    var iLoopTimes = settingIds.length();
    for (i = 0; i < iLoopTimes; i++) {
        var settingId = settingIds[i];
        if ("display.systemfields" == settingId) {
            displaySystemfields = (settingValues[i] == "true");
        }
        if ("display.deprecatedfields" == settingId) {
            displayDeprecatedfields = (settingValues[i] == "true");
        }
    }
    if (datadict != null) {
        var dbdict = $(filename).dbdict();
        var descriptor = $("#dbdictService").getDescriptorMeta(dbdict["field"]);
        var allFields = dbdict["field"];
        var datadictFields = datadict["fields"];
        var datadictCaptions = datadict["captions"];
        var sysFieldTypes = datadict["sysFieldType"];
        checkFields(descriptor.childs, datadictFields, datadictCaptions, sysFieldTypes, fields, displaySystemfields, displayDeprecatedfields, type);
    }

    if (fields.length > 0) {
        fields = _.sortBy(fields, "disp");
    }

    return fields;
}

function checkFields(childs, datadictFields, datadictCaptions, sysFieldTypes, fields, displaySystemfields, displayDeprecatedfields, type) {
    var _index = funcs.index;
    var sccaption = "";
    var i;
    for (i = 0; i < childs.length; i++) {
        var child = childs[i];
        if (child.field.type === type) {
            var fieldName = child.field.name;
            var idx = _index(fieldName, datadictFields);
            if (idx <= 0) { // try filed name with parent
                idx = _index(child.parent.field.name + "," + fieldName, datadictFields);
            }
            if (idx > 0) {
                var datadictType = sysFieldTypes[idx - 1];
                // skip system fields
                if (datadictType === 1 && !displaySystemfields) {
                    continue;
                }

                // skip deprecated fields
                if (datadictType === 4 && !displayDeprecatedfields) {
                    continue;
                }

                var caption = datadictCaptions[idx - 1];
                var captionStr = scmsg(caption, "sccaption");
                if (null !== captionStr && captionStr.indexOf("Could not be found") == -1) {
                    caption = captionStr;
                }
                fields.push({
                    value: fieldName,
                    disp: caption
                });
            }
        } else if (child.childs.length > 0 && child.field.type !== $.Array) {
            checkFields(child.childs, datadictFields, datadictCaptions, sysFieldTypes, fields, displaySystemfields, displayDeprecatedfields, type);
        }
    }
}

/**
 * Validate whether a field name is valid in a file.
 *
 * @param {string}
 *          filename - the file name.
 * @param {string}
 *          fieldname - the field name.
 * @param {int}
 *          type - the field type (SM type).
 * @return {boolean} true if the field name is valid name and type in a file, otherwize returns false.
 */
function validateFieldName(filename, fieldname, type) {
    var datadict = $("datadict").select('name="' + filename + '"').uniqueResult();
    var setting = $("settings", SCFILE_READONLY).select('name="Condition Editor"').uniqueResult();
    var settingIds = setting["settingId"];
    var settingValues = setting["settingValue"];
    var displaySystemfields = false;
    var displayDeprecatedfields = false;
    var i;
    var iLoopTimes = settingIds.length();
    for (i = 0; i < iLoopTimes; i++) {
        var settingId = settingIds[i];
        if ("display.systemfields" == settingId) {
            displaySystemfields = (settingValues[i] == "true");
        }
        if ("display.deprecatedfields" == settingId) {
            displayDeprecatedfields = (settingValues[i] == "true");
        }
    }
    if (datadict != null) {
        var dbdict = $(filename).dbdict();
        var descriptor = $("#dbdictService").getDescriptorMeta(dbdict["field"]);
        var allFields = dbdict["field"];
        var datadictFields = datadict["fields"];
        var sysFieldTypes = datadict["sysFieldType"];
        return validateFields(descriptor.childs, datadictFields, sysFieldTypes, displaySystemfields, displayDeprecatedfields, fieldname, type);
    }

    return false;
}

function validateFields(childs, datadictFields, sysFieldTypes, displaySystemfields, displayDeprecatedfields, fieldname, type) {
    var _index = funcs.index;
    var sccaption = "";
    var i;
    for (i = 0; i < childs.length; i++) {
        var child = childs[i];
        if (child.field.type === type) {
            var curFieldName = child.field.name;
            if (curFieldName !== fieldname) {
                continue;
            }
            var idx = _index(curFieldName, datadictFields);
            if (idx <= 0) { // try filed name with parent
                idx = _index(child.parent.field.name + "," + curFieldName, datadictFields);
            }
            if (idx > 0) {
                var datadictType = sysFieldTypes[idx - 1];
                // skip system fields
                if (datadictType === 1 && !displaySystemfields) {
                    return false;
                }

                // skip deprecated fields
                if (datadictType === 4 && !displayDeprecatedfields) {
                    return false;
                }

                return true;
            }
        } else if (child.childs.length > 0 && child.field.type !== $.Array) {
            var flag = validateFields(child.childs, datadictFields, sysFieldTypes, displaySystemfields, displayDeprecatedfields, fieldname, type);
            if (flag === true) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Validate whether a value has a valid record in a file.
 *
 * @param {string}
 *          tablename - the file name.
 * @param {string}
 *          fieldname - the field name.
 * @param {string}
 *          fieldValue - the field value.
 * @param {string}
 *          filterStr - the additional filter string.
 * @return {boolean} true if the field value has a valid record in a file, otherwize returns false.
 */
function validateAgainstTable(tableName, fieldName, fieldValue, filterStr) {
    var sql;
    var rc;
    var record = new SCFile(tableName, SCFILE_READONLY);
    record.setFields(fieldName);

    if (typeof(fieldValue) == "string") {
        sql = fieldName + "=\"" + fieldValue + "\"";
    } else {
        sql = fieldName + "=" + fieldValue;
    }

    //appends the filter if there is one.
    if (filterStr != null && filterStr != "") {
        sql += " and " + filterStr;
    }

    rc = record.doSelect(sql);

    //if the field is not found, return false
    if (rc != RC_SUCCESS) {
        return false;
    }

    return true;
}

/**
 * Parse the rule xml.
 *
 * @param {string}
 *          xmlString - the xml string.
 * @return {object}.
 */
function parseRuleXML(xmlString) {

    var xml = new XML();
    xml.setContent(xmlString);

    var assignmentType = getElement(xml, XML_ELEMENT_ASSIGNMENT_TYPE);
    var defaultGroup = getElement(xml, XML_ELEMENT_DEFAULT_GROUP);
    var groupFieldName = getElement(xml, XML_ELEMENT_GROUP_FIELD_NAME);
    var groupAssignType = getElement(xml, XML_ELEMENT_GROUP_ASSIGN_TYPE);
    var groupServiceFieldName = getElement(xml, XML_ELEMENT_GROUP_SERVICE_FIELD_NAME);
    var groupFixedValue = getElement(xml, XML_ELEMENT_GROUP_FIXED_VALUE);
    var groupScript = getElement(xml, XML_ELEMENT_GROUP_SCRIPT);
    var assigneeFieldName = getElement(xml, XML_ELEMENT_ASSIGNEE_FIELD_NAME);
    var assigneeAssignType = getElement(xml, XML_ELEMENT_ASSIGNEE_ASSIGN_TYPE);
    var assigneeGroupMemberType = getElement(xml, XML_ELEMENT_ASSIGNEE_GROUP_MEMBER_TYPE);
    var assignmentTimeFieldName = getElement(xml, XML_ELEMENT_ASSIGNMENT_TIME_FIELD_NAME);
    var assignmentTimeRecentDays = getElement(xml, XML_ELEMENT_ASSIGNMENT_TIME_RECENT_DAYS);
    var activeTicketQueryXml = getElement(xml, XML_ELEMENT_ACTIVE_TICKET_QUERY_XML);
    var assigneeCoordinatorType = getElement(xml, XML_ELEMENT_ASSIGNEE_COORDINATOR_TYPE);
    var assigneeFixedValue = getElement(xml, XML_ELEMENT_ASSIGNEE_FIXED_VALUE);
    var assigneeScript = getElement(xml, XML_ELEMENT_ASSIGNEE_SCRIPT);

    if (assignmentType != null) {
        assignmentType = assignmentType.getValue();
    } else {
        assignmentType = "";
    }
    if (defaultGroup != null) {
        defaultGroup = defaultGroup.getValue();
    } else {
        defaultGroup = "";
    }
    if (groupFieldName != null) {
        groupFieldName = groupFieldName.getValue();
    } else {
        groupFieldName = "";
    }
    if (groupAssignType != null) {
        groupAssignType = groupAssignType.getValue();
    } else {
        groupAssignType = "";
    }
    if (groupServiceFieldName != null) {
        groupServiceFieldName = groupServiceFieldName.getValue();
    } else {
        groupServiceFieldName = "";
    }
    if (groupFixedValue != null) {
        groupFixedValue = groupFixedValue.getValue();
    } else {
        groupFixedValue = "";
    }
    if (groupScript != null) {
        groupScript = groupScript.getValue();
    } else {
        groupScript = "";
    }
    if (assigneeFieldName != null) {
        assigneeFieldName = assigneeFieldName.getValue();
    } else {
        assigneeFieldName = "";
    }
    if (assigneeAssignType != null) {
        assigneeAssignType = assigneeAssignType.getValue();
    } else {
        assigneeAssignType = "";
    }
    if (assigneeGroupMemberType != null) {
        assigneeGroupMemberType = assigneeGroupMemberType.getValue();
    } else {
        assigneeGroupMemberType = "";
    }
    if (assignmentTimeFieldName != null) {
        assignmentTimeFieldName = assignmentTimeFieldName.getValue();
    } else {
        assignmentTimeFieldName = "";
    }
    if (assignmentTimeRecentDays != null) {
        assignmentTimeRecentDays = assignmentTimeRecentDays.getValue();
    } else {
        assignmentTimeRecentDays = "";
    }
    if (activeTicketQueryXml != null) {
        activeTicketQueryXml = activeTicketQueryXml.getValue();
    } else {
        activeTicketQueryXml = "";
    }
    if (assigneeCoordinatorType != null) {
        assigneeCoordinatorType = assigneeCoordinatorType.getValue();
    } else {
        assigneeCoordinatorType = "";
    }
    if (assigneeFixedValue != null) {
        assigneeFixedValue = assigneeFixedValue.getValue();
    } else {
        assigneeFixedValue = "";
    }
    if (assigneeScript != null) {
        assigneeScript = assigneeScript.getValue();
    } else {
        assigneeScript = "";
    }

    return {
        "assignmentType": assignmentType,
        "defaultGroup": defaultGroup,
        "groupFieldName": groupFieldName,
        "groupAssignType": groupAssignType,
        "groupServiceFieldName": groupServiceFieldName,
        "groupFixedValue": groupFixedValue,
        "groupScript": groupScript,
        "assigneeFieldName": assigneeFieldName,
        "assigneeAssignType": assigneeAssignType,
        "assigneeGroupMemberType": assigneeGroupMemberType,
        "assignmentTimeFieldName": assignmentTimeFieldName,
        "activeTicketQueryXml": activeTicketQueryXml,
        "assigneeCoordinatorType": assigneeCoordinatorType,
        "assigneeFixedValue": assigneeFixedValue,
        "assigneeScript": assigneeScript,
        "assignmentTimeRecentDays": assignmentTimeRecentDays
    };
}

/**
 * Parse the rule JSON.
 *
 * @param {string}
 *          jsonString - the JSON string.
 * @return {object}.
 */
function parseRuleJSON(jsonString) {
    return JSON.parse(jsonString);
}

var BaseRuleSetOKOnlyWizard = lib.BaseRuleSetOKOnlyWizard.getClass();
var AssignmentWizard = $(BaseRuleSetOKOnlyWizard, {
    assignmentType: "auto",
    defaultGroup: "",
    groupFieldName: "assignment",
    groupAssignType: "",
    groupServiceFieldName: "",
    groupFixedValue: "",
    groupScript: "",
    assigneeFieldName: "assignee",
    assigneeAssignType: "none",
    assigneeGroupMemberType: "roundRobin",
    assignmentTimeFieldName: "",
    activeTicketQueryXml: "",
    activeTicketQueryDesc: "true",
    assigneeCoordinatorType: "",
    assigneeFixedValue: "",
    assigneeScript: "",
    assignmentTimeRecentDays: "",
    assignmentBySkill: false,

    // constructor
    init: function init(request) {
        this._super.apply(this, arguments);
        this.assignmentType = request.getParameter(PARAM_ASSIGNMENT_TYPE);
        this.defaultGroup = request.getParameter(PARAM_DEFAULT_GROUP);
        this.groupFieldName = request.getParameter(PARAM_GROUP_FIELD_NAME);
        this.groupAssignType = request.getParameter(PARAM_GROUP_ASSIGN_TYPE);
        this.groupServiceFieldName = request.getParameter(PARAM_GROUP_SERVICE_FIELD_NAME);
        this.groupFixedValue = request.getParameter(PARAM_GROUP_FIXED_VALUE);
        this.groupScript = request.getParameter(PARAM_GROUP_SCRIPT);
        this.assigneeFieldName = request.getParameter(PARAM_ASSIGNEE_FIELD_NAME);
        this.assigneeAssignType = request.getParameter(PARAM_ASSIGNEE_ASSIGN_TYPE);
        this.assigneeGroupMemberType = request.getParameter(PARAM_ASSIGNEE_GROUP_MEMBER_TYPE);
        this.assignmentTimeFieldName = request.getParameter(PARAM_ASSIGNMENT_TIME_FIELD_NAME);
        this.activeTicketQueryDESC = request.getParameter(PARAM_ACTIVE_TICKET_QUERY_DESC);
        this.activeTicketQueryXml = request.getParameter(PARAM_ACTIVE_TICKET_QUERY_XML);
        this.assigneeCoordinatorType = request.getParameter(PARAM_ASSIGNEE_COORDINATOR_TYPE);
        this.assigneeFixedValue = request.getParameter(PARAM_ASSIGNEE_FIXED_VALUE);
        this.assigneeScript = request.getParameter(PARAM_ASSIGNEE_SCRIPT);
        this.assignmentTimeRecentDays = request.getParameter(PARAM_ASSIGNMENT_TIME_RECENT_DAYS);
        this.assignmentBySkill = request.getParameter(PARAM_ASSIGNMENT_BYSKILL);
    },

    /**
     * @protected
     */
    getTitle: function getTitle(request) {
        return scmsg(76, "ruleset");
    },

    /**
     * @protected
     */
    getMainTitle: function getMainTitle(request) {
        return scmsg(76, "ruleset");
    },

    /**
     * @protected
     */
    getPrompt: function getPrompt(request) {
        return scmsg(107, "ruleset");
    },

    /**
     * @protected
     */
    getSubFormat: function getSubFormat(request) {
        return "RuleSet.assignment";
    },

    /**
     * @protected
     */
    setResult: function setResult(request) {
        this._super.apply(this, arguments);

        // used for auto complete
        var formatName = "wizard.js.okonly.large";
        var format = $("format", SCFILE_READONLY).select('name="' + formatName + '"').uniqueResult();
        format["name"] = "wizard-" + this.getSubFormat(request);
        request.setAttribute("$L.format", format);

        request.setAttribute(PARAM_ASSIGNMENT_TYPE, this.assignmentType);
        request.setAttribute(PARAM_DEFAULT_GROUP, this.defaultGroup);
        request.setAttribute(PARAM_GROUP_FIELD_NAME, this.groupFieldName);
        request.setAttribute(PARAM_GROUP_ASSIGN_TYPE, this.groupAssignType);

        if (this.groupAssignType === GROUP_ASSIGN_TYPE_SERVICE) {
            request.setAttribute(PARAM_GROUP_SERVICE_FIELD_NAME, this.groupServiceFieldName);
        } else if (this.groupAssignType === ASSIGN_TYPE_FIXED) {
            request.setAttribute(PARAM_GROUP_FIXED_VALUE, this.groupFixedValue);
        } else if (this.groupAssignType === ASSIGN_TYPE_JS) {
            request.setAttribute(PARAM_GROUP_SCRIPT, this.groupScript);
        }

        if (this.assigneeAssignType !== ASSIGNEE_ASSIGN_TYPE_NONE) {
            request.setAttribute(PARAM_ASSIGNEE_FIELD_NAME, this.assigneeFieldName);
        }

        request.setAttribute(PARAM_ASSIGNEE_ASSIGN_TYPE, this.assigneeAssignType);
        if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_NONE) {
            // do nothing here
        } else if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER) {
            request.setAttribute(PARAM_ASSIGNEE_GROUP_MEMBER_TYPE, this.assigneeGroupMemberType);
            request.setAttribute(PARAM_ASSIGNMENT_BYSKILL, this.assignmentBySkill);
            if (this.assigneeGroupMemberType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_ROUND_ROBIN) {
                request.setAttribute(PARAM_ASSIGNMENT_TIME_FIELD_NAME, this.assignmentTimeFieldName);
                request.setAttribute(PARAM_ASSIGNMENT_TIME_RECENT_DAYS, this.assignmentTimeRecentDays);
            } else if (this.assigneeGroupMemberType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_NUMBER_OF_ASSIGNED) {
                request.setAttribute(PARAM_ACTIVE_TICKET_QUERY_XML, this.activeTicketQueryXml);
            }
        } else if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_COORDINATOR) {
            request.setAttribute(PARAM_ASSIGNEE_COORDINATOR_TYPE, this.assigneeCoordinatorType);
        } else if (this.assigneeAssignType === ASSIGN_TYPE_FIXED) {
            request.setAttribute(PARAM_ASSIGNEE_FIXED_VALUE, this.assigneeFixedValue);
        } else if (this.assigneeAssignType === ASSIGN_TYPE_JS) {
            request.setAttribute(PARAM_ASSIGNEE_SCRIPT, this.assigneeScript);
        }

        var fields;
        var fieldValues;
        var fieldDisps;

        // set filed list variables
        if (!_str.isBlank(this.tablename)) {
            fields = getFileFields(this.tablename, $.Character);
            fieldValues = $.createSCArray();
            fieldDisps = $.createSCArray();
            _.each(fields, function(field) {
                fieldValues.push(field.value);
                fieldDisps.push(field.disp);
            });

            request.setAttribute("$L.assignment.fields", fieldValues);
            request.setAttribute("$L.assignment.fields.local", fieldDisps);
        }
        if (!_str.isBlank(this.tablename)) {
            fields = getFileFields(this.tablename, $.Datetime);
            fieldValues = $.createSCArray();
            fieldDisps = $.createSCArray();
            _.each(fields, function(field) {
                fieldValues.push(field.value);
                fieldDisps.push(field.disp);
            });

            request.setAttribute("$L.assignment.time.fields", fieldValues);
            request.setAttribute("$L.assignment.time.fields.local", fieldDisps);
        }
    },

    /**
     * @protected
     */
    doWizard: function doWizard(request) {

        this._super.apply(this, arguments);

        // setup active ticket query editor
        if (this.activeTicketQueryXml != null) {
            vars["$xmlString2"] = this.activeTicketQueryXml;
        } else {
            vars["$xmlString2"] = '';
        }

        return "assignmentWizard.view";
    },

    /**
     * @protected
     */
    validate: function validate(request) {
        if (_str.isBlank(this.rule["ruleDesc"])) {
            msg(scmsg(2103, "fc"), 3);
            cursor_field_name_set("ruleDesc");
            return false;
        }

        if (_str.isBlank(this.assignmentType)) {
            msg(scmsg("require.assignmentType", MSG_CLASS), 3);
            cursor_field_name_set(PARAM_ASSIGNMENT_TYPE);
            return false;
        }

        if (!_str.isBlank(this.defaultGroup)) {
            if (!validateAgainstTable("assignment", "name", this.defaultGroup)) {
                msg(scmsg("validate.defaultGroup.UI", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_DEFAULT_GROUP);
                return false;
            }
        }

        if (_str.isBlank(this.groupFieldName)) {
            msg(scmsg("require.groupFieldName", MSG_CLASS), 3);
            cursor_field_name_set(PARAM_GROUP_FIELD_NAME);
            return false;
        } else {
            if (!validateFieldName(this.tablename, this.groupFieldName, $.Character)) {
                msg(scmsg("validate.groupFieldName.UI", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_GROUP_FIELD_NAME);
                return false;
            }
        }

        if (this.groupAssignType === GROUP_ASSIGN_TYPE_SERVICE) {
            if (_str.isBlank(this.groupServiceFieldName)) {
                msg(scmsg("require.groupServiceFieldName", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_GROUP_SERVICE_FIELD_NAME);
                return false;
            } else {
                if (!validateFieldName(this.tablename, this.groupServiceFieldName, $.Character)) {
                    msg(scmsg("validate.groupServiceFieldName.UI", MSG_CLASS), 3);
                    cursor_field_name_set(PARAM_GROUP_SERVICE_FIELD_NAME);
                    return false;
                }
            }
        } else if (this.groupAssignType === ASSIGN_TYPE_FIXED) {
            if (_str.isBlank(this.groupFixedValue)) {
                msg(scmsg("require.groupFixedValue", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_GROUP_FIXED_VALUE);
                return false;
            } else if (!validateAgainstTable("assignment", "name", this.groupFixedValue)) {
                msg(scmsg("validate.groupFixedValue.UI", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_GROUP_FIXED_VALUE);
                return false;
            }
        } else if (this.groupAssignType === ASSIGN_TYPE_JS) {
            if (_str.isBlank(this.groupScript)) {
                msg(scmsg("require.groupScript", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_GROUP_SCRIPT);
                return false;
            }
        } else if (_str.isBlank(this.groupAssignType)) {
            msg(scmsg("require.groupAssignType", MSG_CLASS), 3);
            cursor_field_name_set(PARAM_GROUP_ASSIGN_TYPE);
            return false;
        }

        if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_NONE) {
            // do nothing here
        } else if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER) {
            if (_str.isBlank(this.assigneeGroupMemberType)) {
                msg(scmsg("require.assigneeGroupMemberType", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_ASSIGNEE_GROUP_MEMBER_TYPE);
                return false;
            }
            if (this.assigneeGroupMemberType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_ROUND_ROBIN) {
                if (_str.isBlank(this.assignmentTimeFieldName)) {
                    msg(scmsg("require.assignmentTimeFieldName", MSG_CLASS), 3);
                    cursor_field_name_set(PARAM_ASSIGNMENT_TIME_FIELD_NAME);
                    return false;
                } else if (_str.isBlank(this.assignmentTimeRecentDays)) {
                    msg(scmsg("require.assignmentTimeRecentDays", MSG_CLASS), 3);
                    cursor_field_name_set(PARAM_ASSIGNMENT_TIME_RECENT_DAYS);
                    return false;
                } else if (Number(this.assignmentTimeRecentDays) < 0) {
                    msg(scmsg("validate.assignmentTimeRecentDays", MSG_CLASS), 3);
                    cursor_field_name_set(PARAM_ASSIGNMENT_TIME_RECENT_DAYS);
                    return false;
                } else if (!validateFieldName(this.tablename, this.assignmentTimeFieldName, $.Datetime)) {
                    msg(scmsg("validate.assignmentTimeFieldName.UI", MSG_CLASS), 3);
                    cursor_field_name_set(PARAM_ASSIGNMENT_TIME_FIELD_NAME);
                    return false;
                }
            }
        } else if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_COORDINATOR) {
            if (_str.isBlank(this.assigneeCoordinatorType)) {
                msg(scmsg("require.assigneeCoordinatorType", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_ASSIGNEE_COORDINATOR_TYPE);
                return false;
            }
        } else if (this.assigneeAssignType === ASSIGN_TYPE_FIXED) {
            if (_str.isBlank(this.assigneeFixedValue)) {
                msg(scmsg("require.assigneeFixedValue", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_ASSIGNEE_FIXED_VALUE);
                return false;
            } else if (!validateAgainstTable("operator", "name", this.assigneeFixedValue)) {
                msg(scmsg("validate.assigneeFixedValue.UI", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_ASSIGNEE_FIXED_VALUE);
                return false;
            }
        } else if (this.assigneeAssignType === ASSIGN_TYPE_JS) {
            if (_str.isBlank(this.assigneeScript)) {
                msg(scmsg("require.assigneeScript", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_ASSIGNEE_SCRIPT);
                return false;
            }
        } else if (_str.isBlank(this.assigneeAssignType)) {
            msg(scmsg("require.assigneeAssignType", MSG_CLASS), 3);
            cursor_field_name_set(PARAM_ASSIGNEE_ASSIGN_TYPE);
            return false;
        }

        if (this.assigneeAssignType !== ASSIGNEE_ASSIGN_TYPE_NONE) {
            if (_str.isBlank(this.assigneeFieldName)) {
                msg(scmsg("require.assigneeFieldName", MSG_CLASS), 3);
                cursor_field_name_set(PARAM_ASSIGNEE_FIELD_NAME);
                return false;
            } else {
                if (!validateFieldName(this.tablename, this.assigneeFieldName, $.Character)) {
                    msg(scmsg("validate.assigneeFieldName.UI", MSG_CLASS), 3);
                    cursor_field_name_set(PARAM_ASSIGNEE_FIELD_NAME);
                    return false;
                }
            }
        }

        return true;
    },

    showWizard: function showWizard(request) {
        var xmlString = this.rule["ruleXML"];
        var jsonString = this.rule["ruleJSON"];
        var assignmentConf = null;

        if (_str.isBlank(this.rule["ruleDesc"])) {
            this.rule["ruleDesc"] = "Assignment";
        }

        if (null == jsonString || "" == jsonString) {
            if (_str.isBlank(xmlString)) {
                xmlString = "<assignment></assignment>";
            }

            assignmentConf = parseRuleXML(xmlString);
        } else {
            assignmentConf = parseRuleJSON(jsonString);
        }

        this.assignmentType = assignmentConf.assignmentType;
        if (this.assignmentType === null || this.assignmentType === "") {
            this.assignmentType = ASSIGNMENT_AUTO;
        }
        this.defaultGroup = assignmentConf.defaultGroup;
        this.groupFieldName = assignmentConf.groupFieldName;
        this.groupAssignType = assignmentConf.groupAssignType;
        this.groupServiceFieldName = assignmentConf.groupServiceFieldName;
        this.groupFixedValue = assignmentConf.groupFixedValue;
        this.groupScript = assignmentConf.groupScript;
        this.assigneeFieldName = assignmentConf.assigneeFieldName;
        this.assigneeAssignType = assignmentConf.assigneeAssignType;
        this.assigneeGroupMemberType = assignmentConf.assigneeGroupMemberType;
        this.assignmentTimeFieldName = assignmentConf.assignmentTimeFieldName;
        this.activeTicketQueryXml = assignmentConf.activeTicketQueryXml;
        if (!_str.isBlank(this.activeTicketQueryXml) &&
            null !== this.activeTicketQueryXml &&
            "" !== this.activeTicketQueryXml &&
            "null" !== this.activeTicketQueryXml) {
            this.activeTicketQueryDesc = getDescription(this.activeTicketQueryXml);
            request.setAttribute(PARAM_ACTIVE_TICKET_QUERY_DESC, this.activeTicketQueryDesc);
            request.setAttribute(PARAM_ACTIVE_TICKET_QUERY_XML, this.activeTicketQueryXml);
        } else {
            this.activeTicketQueryDesc = "Always";
            request.setAttribute(PARAM_ACTIVE_TICKET_QUERY_DESC, this.activeTicketQueryDesc);
        }
        this.assigneeCoordinatorType = assignmentConf.assigneeCoordinatorType;
        this.assigneeFixedValue = assignmentConf.assigneeFixedValue;
        this.assigneeScript = assignmentConf.assigneeScript;
        this.assignmentBySkill = assignmentConf.assignmentBySkill;
        this.assignmentTimeRecentDays = assignmentConf.assignmentTimeRecentDays;

        if (this.assignmentTimeRecentDays === null || this.assignmentTimeRecentDays === "") {
            this.assignmentTimeRecentDays = ASSIGNMENT_TIME_RECENT_DEFAULT_DAYS;
            request.setAttribute(PARAM_ASSIGNMENT_TIME_RECENT_DAYS, this.assignmentTimeRecentDays);
        }

        return this.doWizard(request);
    },

    wizard: function wizard(request) {
        return this.doWizard(request);
    },

    ok: function ok(request) {
        if (this.validate(request)) {
            this._super.apply(this, arguments);

            var jsonObj = {};
            jsonObj.type = "assignment";
            jsonObj.assignmentType = "";
            jsonObj.defaultGroup = "";
            jsonObj.groupFieldName = "";
            jsonObj.groupAssignType = "";
            jsonObj.groupServiceFieldName = "";
            jsonObj.groupFixedValue = "";
            jsonObj.groupScript = "";
            jsonObj.assigneeFieldName = "";
            jsonObj.assigneeAssignType = "";
            jsonObj.assigneeGroupMemberType = "";
            jsonObj.assignmentTimeFieldName = "";
            jsonObj.assignmentTimeRecentDays = "";
            jsonObj.assignmentBySkill = false;
            jsonObj.activeTicketQueryXml = "";
            jsonObj.assigneeCoordinatorType = "";
            jsonObj.assigneeFixedValue = "";
            jsonObj.assigneeScript = "";

            if (this.assignmentType != null) {
                jsonObj.assignmentType = this.assignmentType;
            }
            if (this.defaultGroup != null) {
                jsonObj.defaultGroup = this.defaultGroup;
            }
            if (this.groupFieldName != null) {
                jsonObj.groupFieldName = this.groupFieldName;
            }

            if (this.groupAssignType != null) {
                jsonObj.groupAssignType = this.groupAssignType;
                if (this.groupAssignType === GROUP_ASSIGN_TYPE_SERVICE) {
                    if (this.groupServiceFieldName != null) {
                        jsonObj.groupServiceFieldName = this.groupServiceFieldName;
                    }
                } else if (this.groupAssignType === ASSIGN_TYPE_FIXED) {
                    if (this.groupFixedValue != null) {
                        jsonObj.groupFixedValue = this.groupFixedValue;
                    }
                } else if (this.groupAssignType === ASSIGN_TYPE_JS) {
                    if (this.groupScript != null) {
                        jsonObj.groupScript = this.groupScript;
                    }
                }
            }

            if (this.assigneeFieldName != null) {
                jsonObj.assigneeFieldName = this.assigneeFieldName;
            }

            if (this.assigneeAssignType != null) {
                jsonObj.assigneeAssignType = this.assigneeAssignType;
                if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_NONE) {
                    // do nothing here
                } else if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER) {
                    if (this.assigneeGroupMemberType != null) {
                        jsonObj.assigneeGroupMemberType = this.assigneeGroupMemberType;
                        jsonObj.assignmentBySkill = this.assignmentBySkill;
                        if (this.assigneeGroupMemberType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_ROUND_ROBIN) {
                            if (this.assignmentTimeFieldName != null) {
                                jsonObj.assignmentTimeFieldName = this.assignmentTimeFieldName;
                            }
                            if (this.assignmentTimeRecentDays != null) {
                                jsonObj.assignmentTimeRecentDays = this.assignmentTimeRecentDays;
                            }
                        } else if (this.assigneeGroupMemberType === ASSIGNEE_ASSIGN_TYPE_GROUP_MEMBER_NUMBER_OF_ASSIGNED) {
                            if (this.activeTicketQueryXml != null) {
                                jsonObj.activeTicketQueryXml = this.activeTicketQueryXml;
                            }
                        }
                    }
                } else if (this.assigneeAssignType === ASSIGNEE_ASSIGN_TYPE_COORDINATOR) {
                    if (this.assigneeCoordinatorType != null) {
                        jsonObj.assigneeCoordinatorType = this.assigneeCoordinatorType;
                    }
                } else if (this.assigneeAssignType === ASSIGN_TYPE_FIXED) {
                    if (this.assigneeFixedValue != null) {
                        jsonObj.assigneeFixedValue = this.assigneeFixedValue;
                    }
                } else if (this.assigneeAssignType === ASSIGN_TYPE_JS) {
                    if (this.assigneeScript != null) {
                        jsonObj.assigneeScript = this.assigneeScript;
                    }
                }
            }

            this.rule["type"] = "assignment";
            this.rule["ruleJSON"] = rteJSONStringify(jsonObj);
            this.rule["ruleXML"] = null;
        } else {
            return this.doWizard(request);
        }
    }
});

function getClass() {
    return AssignmentWizard;
}