var $ = lib.c.$;
var _ = lib.Underscore.require();

function getWizardName(rule, isJSONFormat) {
    var ruleName = "callWizard";
    var fieldName = "wizardName";
    if (!isJSONFormat) {
        var xml = new XML();
        xml.setContent(rule);
        var result = lib.xmlHelpers.getElement(xml, ruleName, null);

        var wizard = lib.xmlHelpers.getElement(result, fieldName, null);

        return wizard.getValue();
    } else {
        var jsonObj = JSON.parse(rule);
        return jsonObj[fieldName];
    }
}

function getExternalName(rule, isJSONFormat) {
    var ruleName = "callExternalURL";
    var fieldName = "url";

    if (!isJSONFormat) {
        var xml = new XML();
        xml.setContent(rule);
        var result = lib.xmlHelpers.getElement(xml, ruleName, null);

        var wizard = lib.xmlHelpers.getElement(result, fieldName, null);

        return wizard.getValue();
    } else {
        var jsonObj = JSON.parse(rule);
        return jsonObj[fieldName];
    }
}

function getProcessName(rule, isJSONFormat) {
    var ruleName = "callProcess";
    var fieldName = "process";

    if (!isJSONFormat) {
        var xml = new XML();
        xml.setContent(rule);
        var result = lib.xmlHelpers.getElement(xml, ruleName, null);

        var process = lib.xmlHelpers.getElement(result, fieldName, null);

        return process.getValue();
    } else {
        var jsonObj = JSON.parse(rule);
        return jsonObj[fieldName];
    }
}

function getScriptName(rule, isJSONFormat) {
    var ruleName = "runSMScript";
    var fieldName = "script";
    if (!isJSONFormat) {
        var xml = new XML();
        xml.setContent(rule);
        var result = lib.xmlHelpers.getElement(xml, ruleName, null);

        var script = lib.xmlHelpers.getElement(result, fieldName, null);

        return script.getValue();
    } else {
        var jsonObj = JSON.parse(rule);
        return jsonObj[fieldName];
    }
}

function getNotificationName(rule, isJSONFormat) {
    var ruleName = "notification";
    var fieldName = "notificationRecord";

    if (!isJSONFormat) {
        var xml = new XML();
        xml.setContent(rule);
        var result = lib.xmlHelpers.getElement(xml, ruleName, null);

        var notification = lib.xmlHelpers.getElement(result, fieldName, null);

        return notification.getValue();
    } else {
        var jsonObj = JSON.parse(rule);
        return jsonObj[fieldName];
    }
}

/**
 * Load the configuration from sendHTMLEmail/SendTeamsMessage rule from JSON rule string,
 * set the info into related variables.
 *
 * The possible JSON format:
 * 1. Users type:
 * {
 *   type:"sendHTMLEmail",
 *   tempName:"IM Alert Reassign",
 *   recipient:"Users",
 *   js:null,
 *   userList:{
 *       sendTo:"operator",// or "contacts"
 *       user:["aUser", "bUser"]
 *     },
 *   group:null,
 *   field:null
 * }
 * 2. Group type:
 * {
 *   type:"sendHTMLEmail",
 *   tempName:"IM Alert Reassign",
 *   recipient:"Group",
 *   js:null,
 *   userList:null,
 *   group:{
 *       sendTo:"All",
 *       type:"assignment",
 *       value:"E-CAB"
 *     },
 *   field:null
 * }
 * 3. JS type:
 * {
 *   type:"sendHTMLEmail",
 *   tempName:"IM Alert Reassign",
 *   recipient:"Set Using Javascript",
 *   js:'value="";',
 *   userList:null,
 *   group:null,
 *   field:null
 * }
 * 4. Current record type:
 * {
 *   type:"sendHTMLEmail",
 *   tempName:"IM Alert Reassign",
 *   recipient:"Current Record",
 *   js:'value="";',
 *   userList:null,
 *   group:null,
 *   field:{
 *       type:"ocmgroups", // or "operator", etc
 *       sendTo:"Members",
 *       value:"active"
 *     }
 * }
 */
function loadCommonSendRuleFromJSON(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);
    
    loadCommonSendRuleRecipientFromJSON(jsonObj);
    if (jsonObj.type = "sendHTMLEmail") {
         loadCommonSendRuleRecipientFromJSON(jsonObj, "cc");
         loadCommonSendRuleRecipientFromJSON(jsonObj, "bcc");
    }
}    
    
function loadCommonSendRuleRecipientFromJSON(jsonObj, recipientType) {
    var suffix = "";
    if (recipientType) {
        suffix = "." + recipientType;
    }
    var tempName = jsonObj.tempName;
    var recipient = jsonObj["recipient" + suffix] || "--Select--";
    var js = jsonObj.js;

    var userList = jsonObj["userList" + suffix];
    var group = jsonObj["group" + suffix];
    var field = jsonObj.field;

    if (tempName != null && tempName != "") {
        vars.$tempName = tempName;
        vars["$recipient" + suffix] = recipient;
        if (!recipientType && vars.$recipient == "Set Using Javascript") {
            vars.$js = js;
        }
        if (recipient == "Users") {
            vars["$sendToUsers" + suffix] = userList.sendTo;
            if (userList.sendTo == "operator") {
                vars["$users1" + suffix] = userList.user;
            }
            if (userList.sendTo == "contacts") {
                vars["$users2" + suffix] = userList.user;
            }
        }

        if (recipient == "Group") {
            vars["$sendToGroup" + suffix] = group.type;
            if (group.type == "assignment") {
                vars["$asgroup" + suffix] = group.value;
                vars["$gARecp" + suffix] = group.sendTo;
            }
            if (group.type == "cm3groups") {
                vars["$cmgroup" + suffix] = group.value;
                vars["$gCRRecp" + suffix] = group.sendTo;
            }
            if (group.type == "ocmgroups") {
                vars["$ocmgroup" + suffix] = group.value;
                vars["$gCRRecp" + suffix] = group.sendTo;
            }
            if (group.type == "kmgroup") {
                vars["$kmgroup" + suffix] = group.value;
                vars["$gKRecp" + suffix] = group.sendTo;
            }
        }

        if (vars.$recipient == "Current Record") {
            vars.$field = field.value;
            vars.$fieldType = field.type;
            if (vars.$fieldType == "cm3groups" || vars.$fieldType == "ocmgroups") {
                vars.$gCRRecp = field.sendTo;
            }
            if (vars.$fieldType == "assignment") {
                vars.$gARecp = field.sendTo;
            }
            if (vars.$fieldType == "kmgroup") {
                vars.$gKRecp = field.sendTo;
            }
        }
    }

    var datadict = new SCFile("datadict", SCFILE_READONLY);
    var sql = "name=\"" + vars.$L_tablename + "\"";
    var rc = datadict.doSelect(sql);
    if (rc == RC_SUCCESS) {
        vars.$fieldNames = datadict.fields;
        vars.$fieldCaptions = datadict.captions;
    }
}


function loadSendHTMLEmailRuleFromJSON(ruleString) {
    loadCommonSendRuleFromJSON(ruleString);
}


/**
 * Populate the configuration into sendHTMLEmail/TeamsMessage rule with JSON format,
 * please refer to method loadCommonSendRuleFromJSON's description for
 * more detail about the JSON format of this rule.
 */
function populateCommonSendRuleJSON(type) {
    var jsonObj = {};
    jsonObj.type = type;
    vars.$L_file.type = type;
    
    jsonObj.tempName = vars.$tempName;
    
    populateCommonSendRuleRecipientJSON(jsonObj);
    
    if (type == "sendHTMLEmail") {
        populateCommonSendRuleRecipientJSON(jsonObj, "cc");
        populateCommonSendRuleRecipientJSON(jsonObj, "bcc");
    }
    
    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
}

function populateCommonSendRuleRecipientJSON(jsonObj, recipientType) {
    var suffix = "";
    if (recipientType == "cc" || recipientType == "bcc") {
        suffix = "." + recipientType;
    }

    var userList = null;
    var group = null;
    var field = null;
    
    var recipientVar = "$recipient" + suffix;
    
    jsonObj["recipient" + suffix] = vars[recipientVar];

    if (!recipientType && vars.$recipient == "Set Using Javascript") {
        jsonObj.js = vars.$js;
    }
    if (vars[recipientVar] == "Users") {
        userList = {};
        var sendToUsersVar = "$sendToUsers" + suffix;
        userList.sendTo = vars[sendToUsersVar];
        if (vars[sendToUsersVar] == "operator") {
            var users1Var = "$users1" + suffix;
            vars[users1Var] = funcs.denull(vars[users1Var]);
            if (null == vars[users1Var]) {
                userList.user = [];
            } else {
                userList.user = vars[users1Var].toArray();
            }
        }
        if (vars[sendToUsersVar] == "contacts") {
            var users2Var = "$users2" + suffix;
            vars[users2Var] = funcs.denull(vars[users2Var]);
            if (null == vars[users2Var]) {
                userList.user = [];
            } else {
                userList.user = vars[users2Var].toArray();
            }
        }
        
        jsonObj["userList" + suffix] = userList;
    }

    if (vars[recipientVar] == "Group") {
        group = {};
        var sendToGroupVar = "$sendToGroup" + suffix;
        group.type = vars[sendToGroupVar];
        if (vars[sendToGroupVar] == "assignment") {
            group.sendTo = vars["$gARecp" + suffix];
            group.value = vars["$asgroup" + suffix];
        }
        if (vars[sendToGroupVar] == "kmgroup") {
            group.sendTo = vars["$gKRecp" + suffix];
            group.value = vars["$kmgroup" + suffix];
        }
        if (vars[sendToGroupVar] == "cm3groups") {
            group.sendTo = vars["$gCRRecp" + suffix];
            group.value = vars["$cmgroup" + suffix];
        }
        if (vars[sendToGroupVar] == "ocmgroups") {
            group.sendTo = vars["$gCRRecp" + suffix];
            group.value = vars["$ocmgroup" + suffix];
        }
        
        jsonObj["group" + suffix] = group;
    }

    if (!recipientType && vars.$recipient == "Current Record") {
        field = {};
        field.value = vars.$field;
        field.type = vars.$fieldType;
        if (vars.$fieldType == "cm3groups" || vars.$fieldType == "ocmgroups") {
            field.sendTo = vars.$gCRRecp;
        } else if (vars.$fieldType == "assignment") {
            field.sendTo = vars.$gARecp;
        } else if (vars.$fieldType == "kmgroup") {
            field.sendTo = vars.$gKRecp;
        }
        jsonObj.field = field;
    }
}

function populateSendHTMLEmailRuleJSON() {
    populateCommonSendRuleJSON("sendHTMLEmail");
}

function populateSendTeamsMessageRuleJSON() {
    populateCommonSendRuleJSON("sendTeamsMessage");
}

function getTemplateName(rule, isJSONFormat) {
    if (!isJSONFormat) {
        var ruleName = "sendHTMLEmail";
        var xml = new XML();
        xml.setContent(rule);
        var result = lib.xmlHelpers.getElement(xml, ruleName, null);
        var tempName = lib.xmlHelpers.getElement(result, "tempName", null);
        return tempName.getValue();
    } else {
        var jsonObj = JSON.parse(rule);
        return jsonObj["tempName"];
    }
}

function getRecipientList(rule, record, isJSONFormat, templateName, recipientType) {
    var suffix = "";
    
    if (recipientType) {
        suffix = "." + recipientType;
    }
    
    var usersVar = "$users" + suffix;
    vars[usersVar] = null;
    var ruleName = "sendHTMLEmail";
    var xml = null;
    var result = null;
    var recipient = null;
    var jsonObj = null;

    if (!isJSONFormat) {
        xml = new XML();
        xml.setContent(rule);
        result = lib.xmlHelpers.getElement(xml, ruleName, null);
        recipient = lib.xmlHelpers.getElement(result, "recipient", null).getValue();
    } else {
        jsonObj = JSON.parse(rule);
        recipient = jsonObj["recipient" + suffix];
    }

    if (!recipientType && recipient == "Set Using Javascript") {
        var js = null;
        if (!isJSONFormat) {
            js = lib.xmlHelpers.getElement(result, "js", null).getValue();
        } else {
            js = jsonObj.js;
        }

        try {
            var users = [];
            eval(js);
            return users;
        } catch (e) {
            print("Could not process javascript in the Send HTML Email Rule.");
            print(e.toString());
            return null;
        }
    }

    if (recipient == "Users") {
        if (!isJSONFormat) {
            var userList = lib.xmlHelpers.getElement(result, "userList", null);
            var checkUser = userList.getFirstChildElement();
            do {
                if (checkUser != null) {
                    var user = checkUser.getValue();
                    if (user != null && user != "null") {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, user);
                    }
                }
                checkUser = checkUser.getNextSiblingElement();
            } while (checkUser != null);
        } else {
            vars[usersVar] = _.uniq(jsonObj["userList" + suffix].user);
        }
        return vars[usersVar];
    }

    var j;
    var jLoopTimes;

    var asgrec;
    var kmgrec;
    var cmgrec;
    var ocmgrec;

    if (recipient == "Group") {
        var groupType = null;
        var sendTo = null;
        var groupName = null;
        if (!isJSONFormat) {
            var group = lib.xmlHelpers.getElement(result, "group", null);
            groupType = group.getAttributeValue("type");
            sendTo = group.getAttributeValue("sendTo");
            groupName = group.getValue();
        } else {
            var groupVar = "group" + suffix;
            groupType = jsonObj[groupVar].type;
            sendTo = jsonObj[groupVar].sendTo;
            groupName = jsonObj[groupVar].value;
        }

        /**QCCR1E101184, SM934, dengxin
         **add readonly for doselect, and add the selected fields
         **apply for asgrec,kmgrec,cmgrec,ocmgrec,rec,
         */

        if (groupType == "assignment") {
            asgrec = new SCFile("assignment", SCFILE_READONLY);
            asgrec.setFields(["wdManagerName", "operators", "approvers", "memberGroupEmail", "approverGroupEmail"]);
            if (asgrec.doSelect("name=\"" + groupName + "\"") == RC_SUCCESS) {
                var hasSmartToken = false;
                if (sendTo != "Manager") {
                    var item = null;
                    if (null != templateName) {
                        item = $('htmltemplates', SCFILE_READONLY)
                            .setFields(['htmlcode'])
                            .select('name="' + lib.StringUtil.escapeAllStr(templateName) + '"')
                            .uniqueResult();
                    }
                    if (item) {
                        hasSmartToken = hasEmailAction(item.htmlcode);
                    }
                }

                vars[usersVar] = getUserList4Assignment(asgrec, sendTo, hasSmartToken);
            }

            return vars[usersVar];
        }

        if (groupType == "kmgroup") {
            kmgrec = new SCFile("kmgroup", SCFILE_READONLY);
            kmgrec.setFields(["manager", "operators"]);
            if (kmgrec.doSelect("name=\"" + groupName + "\"") == RC_SUCCESS) {
                if ((sendTo == "All" || sendTo == "Manager") && kmgrec.manager != null) {
                    vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, kmgrec.manager);
                }
                if (sendTo == "All" || sendTo == "Operators") {
                    jLoopTimes = kmgrec.operators.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, kmgrec.operators[j]);
                    }
                }
            }

            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }

        if (groupType == "cm3groups") {
            cmgrec = new SCFile("cm3groups", SCFILE_READONLY);
            cmgrec.setFields(["members", "approvers"]);
            if (cmgrec.doSelect("name=\"" + groupName + "\"") == RC_SUCCESS) {
                if (sendTo == "All" || sendTo == "Members") {
                    jLoopTimes = cmgrec.members.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, cmgrec.members[j]);
                    }
                }
                if (sendTo == "All" || sendTo == "Approvers") {
                    jLoopTimes = cmgrec.approvers.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, cmgrec.approvers[j]);
                    }
                }
            }
            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }

        if (groupType == "ocmgroups") {
            ocmgrec = new SCFile("ocmgroups", SCFILE_READONLY);
            ocmgrec.setFields(["members", "approvers"]);
            if (ocmgrec.doSelect("name=\"" + groupName + "\"") == RC_SUCCESS) {

                if (sendTo == "All" || sendTo == "Members") {
                    jLoopTimes = ocmgrec.members.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, ocmgrec.members[j]);
                    }
                }
                if (sendTo == "All" || sendTo == "Approvers") {
                    jLoopTimes = ocmgrec.approvers.length();
                    for (j = 0; j < jLoopTimes; j++) {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, ocmgrec.approvers[j]);
                    }
                }
            }
            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }
    }

    if (!recipientType && recipient == "Current Record") {
        var type = null;
        var name = null;
        var sendTo = null;
        if (!isJSONFormat) {
            var field = lib.xmlHelpers.getElement(result, "field", null);
            type = field.getAttributeValue("type");
            name = field.getValue();
            sendTo = field.getAttributeValue("sendTo");
        } else {
            type = jsonObj.field.type;
            name = jsonObj.field.value;
            sendTo = jsonObj.field.sendTo;
        }

        var evalValue = record[name];
        var recordType = funcs.type(evalValue);
        var recordQuery = "name";
        if (type == "contacts") {
            recordQuery = "contact.name";
        }
        if (recordType == 8) { // fixing QCCR1E104106 Cannot send an HTML notification to approver in Change Management
            recordQuery = recordQuery + " isin " + funcs.str(record[name]);
        } else {
            recordQuery = recordQuery + " = \"" + record[name] + "\"";
        }

        var rec;
        if (type == "operator") {
            rec = new SCFile("operator", SCFILE_READONLY);
            rec.setFields("name");
            if (rec.doSelect(recordQuery) == RC_SUCCESS) {
                do {
                    vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, rec.name);
                } while (rec.getNext() == RC_SUCCESS);
            }
            return vars[usersVar];
        }

        if (type == "contacts") {
            rec = new SCFile("contacts", SCFILE_READONLY);
            rec.setFields("contact.name");
            if (rec.doSelect(recordQuery) == RC_SUCCESS) {
                do {
                    vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, rec.contact_name);
                } while (rec.getNext() == RC_SUCCESS);
            }

            return vars[usersVar];
        }

        if (type == "assignment") {
            var hasSmartToken = false;
            if (sendTo != "Manager") {
                var item = null;
                if (null != templateName) {
                    item = $('htmltemplates', SCFILE_READONLY)
                        .setFields(['htmlcode'])
                        .select('name="' + lib.StringUtil.escapeAllStr(templateName) + '"')
                        .uniqueResult();
                }
                if (item) {
                    hasSmartToken = hasEmailAction(item.htmlcode);
                }
            }

            vars[usersVar] = [];
            asgrec = new SCFile("assignment", SCFILE_READONLY);
            asgrec.setFields(["wdManagerName", "operators", "approvers", "memberGroupEmail", "approverGroupEmail"]);
            if (asgrec.doSelect(recordQuery) == RC_SUCCESS) {
                do { // do while was added for QCCR1E137068 HPSM Chg. Mgmt: No mail notification is sent for the Deployment Approval...
                    var list = getUserList4Assignment(asgrec, sendTo, hasSmartToken);
                    lib.ArrayUtil.addAll(vars[usersVar], list);
                } while (asgrec.getNext() == RC_SUCCESS);
            }

            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }

        if (type == "kmgroup") {
            kmgrec = new SCFile("kmgroup", SCFILE_READONLY);
            kmgrec.setFields(["manager", "operators"]);
            if (kmgrec.doSelect(recordQuery) == RC_SUCCESS) {
                do { // do while was added for QCCR1E137068 HPSM Chg. Mgmt: No mail notification is sent for the Deployment Approval...
                    if ((sendTo == "All" || sendTo == "Manager") && kmgrec.manager != null) {
                        vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, kmgrec.manager);
                    }
                    if (sendTo == "All" || sendTo == "Operators") {
                        jLoopTimes = kmgrec.operators.length();
                        for (j = 0; j < jLoopTimes; j++) {
                            vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, kmgrec.operators[j]);
                        }
                    }
                } while (kmgrec.getNext() == RC_SUCCESS);
            }

            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }

        if (type == "cm3groups") {
            cmgrec = new SCFile("cm3groups", SCFILE_READONLY);
            cmgrec.setFields(["members", "approvers"]);
            if (cmgrec.doSelect(recordQuery) == RC_SUCCESS) {
                do { // do while was added for QCCR1E137068 HPSM Chg. Mgmt: No mail notification is sent for the Deployment Approval...
                    if (sendTo == "All" || sendTo == "Members") {
                        jLoopTimes = cmgrec.members.length();
                        for (j = 0; j < jLoopTimes; j++) {
                            vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, cmgrec.members[j]);
                        }
                    }
                    if (sendTo == "All" || sendTo == "Approvers") {
                        jLoopTimes = cmgrec.approvers.length();
                        for (j = 0; j < jLoopTimes; j++) {
                            vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, cmgrec.approvers[j]);
                        }
                    }
                } while (cmgrec.getNext() == RC_SUCCESS);
            }
            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }

        if (type == "ocmgroups") {
            ocmgrec = new SCFile("ocmgroups", SCFILE_READONLY);
            ocmgrec.setFields(["members", "approvers"]);
            if (ocmgrec.doSelect(recordQuery) == RC_SUCCESS) {
                do { // do while was added for QCCR1E137068 HPSM Chg. Mgmt: No mail notification is sent for the Deployment Approval...
                    if (sendTo == "All" || sendTo == "Members") {
                        jLoopTimes = ocmgrec.members.length();
                        for (j = 0; j < jLoopTimes; j++) {
                            vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, ocmgrec.members[j]);
                        }
                    }
                    if (sendTo == "All" || sendTo == "Approvers") {
                        jLoopTimes = ocmgrec.approvers.length();
                        for (j = 0; j < jLoopTimes; j++) {
                            vars[usersVar] = funcs.insert(vars[usersVar], 0, 1, ocmgrec.approvers[j]);
                        }
                    }
                } while (ocmgrec.getNext() == RC_SUCCESS);
            }
            vars[usersVar] = funcs.denull(vars[usersVar]);
            return vars[usersVar];
        }
    }
}

/**
 * validate operators 
 * @param  {Array} users - operator name array
 * @return {boolean} all users exist in operator
 */
function validateOperators(users) {
    if (!users) {
        return false;
    }
    
    var i;
    var name;
    var operator;
    var nameList = lib.ArrayUtil.toJsArray(users);
    if (nameList.length == 0) {
        return false;
    }
    for (i=0; i<nameList.length; i++) {
        name = nameList[i];
        if (!name) {
            return false;
        }
        operator = lib.operatorUtil.getOperatorByName(name, ["name"]);
        if (!operator) {
            return false;
        }
    }
    
    return true;
}

/**
 * validate contacts 
 * @param  {Array} users - contact name array
 * @return {boolean} all users exist in contacts
 */
function validateContacts(users) {
    if (!users) {
        return false;
    }
    
    var i;
    var name;
    var contact;
    var nameList = lib.ArrayUtil.toJsArray(users);
    if (nameList.length == 0) {
        return false;
    }
    for (i=0; i<nameList.length; i++) {
        name = nameList[i];
        if (!name) {
            return false;
        }
        contact = lib.operatorUtil.getContactByName(name, ["contact.name"]);
        if (!contact) {
            return false;
        }
    }
    
    return true;
}

/**
 * validate group
 * @param  {String} groupFilename
 * @param  {String} groupName
 * @return {boolean} groupName exists in groupFilename table
 */
function validateGroup(groupFilename, groupName) {
    if (!groupFilename || !groupName) {
        return false;
    }
    var groupFile = new SCFile(groupFilename, SCFILE_READONLY);
    groupFile.setFields(["name"]);
    var rc = groupFile.doSelect("name=\"" + groupName + "\"");
    return rc == RC_SUCCESS;
}

function populateSetClockRuleJSON() {
    var jsonObj = {};
    jsonObj.type = "setClock";
    vars.$L_file.type = "setClock";

    jsonObj.clockAction = vars.$L_clockAction;
    jsonObj.clockNameType = vars.$L_clockNameType;
    if (vars.$L_clockNameType == "Fixed Name") {
        jsonObj.clockName = vars.$L_clockName;
    }

    // add clock schedule fields
    jsonObj.clockScheduleType = vars.$L_clockScheduleType;
    if (vars.$L_clockScheduleType == "value" && vars.$L_clockSchedule != null) {
        jsonObj.clockSchedule = vars.$L_clockSchedule;
    }

    // add clock timezone fields
    jsonObj.clockTimezoneType = vars.$L_clockTimezoneType;
    if (vars.$L_clockTimezoneType == "value") {
        jsonObj.clockTimezone = vars.$L_clockTimezone;
    }

    if (vars.$L_clockNameType == "Set Using Javascript" ||
        vars.$L_clockScheduleType == "Set Using Javascript" ||
        vars.$L_clockTimezoneType == "Set Using Javascript") {
        jsonObj.scriptField = vars.$L_scriptField;
    }

    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;

    if (vars.$L_clockNameType == "Fixed Name" && vars.$L_clockName != "" && vars.$L_clockName != null) {
        var codesRec = new SCFile("codes");
        var query = "type=\"ClockName:" + vars.$L_tablename + "\" and value=\"" + vars.$L_clockName + "\"";
        if (codesRec.doSelect(query) != RC_SUCCESS) {
            codesRec.type = "ClockName:" + vars.$L_tablename;
            codesRec.value = vars.$L_clockName;
            codesRec.doInsert();
        }
    }
}


function populateMandatoryRuleJSON() {
    var jsonObj = {};
    jsonObj.type = "mandatoryFields";
    jsonObj.messageType = vars.$messageType;
    jsonObj.validateAll = vars.$validateAll;
    var fields = [];
    jsonObj.fieldList = fields;
    vars.$L_file.type = "mandatoryFields";

    vars.$fieldNames = funcs.denull(vars.$fieldNames);
    vars.$defaultValues = funcs.denull(vars.$defaultValues);
    var i;
    var iLoopTimes = vars.$fieldNames.length();
    for (i = 0; i < iLoopTimes; ++i) {
        var aField = {};
        aField.fieldName = vars.$fieldNames[i];
        if (vars.$defaultValues.length() > i && vars.$defaultValues[i] != null && funcs._null(vars.$defaultValues[i]) == false) {
            aField["default"] = vars.$defaultValues[i];
        } else {
            aField["default"] = "";
        }
        fields.push(aField);
    }

    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;
}

function populateMandatoryRule() {
    var xml = new XML();
    xml.setContent("<mandatoryFields></mandatoryFields>");
    var messageType = xml.addElement("messageType");
    messageType.setValue(vars.$messageType);
    var fieldList = xml.addElement("fieldList");
    vars.$fieldNames = funcs.denull(vars.$fieldNames);
    vars.$defaultValues = funcs.denull(vars.$defaultValues);
    var i;
    var iLoopTimes = vars.$fieldNames.length();
    for (i = 0; i < iLoopTimes; ++i) {
        var fieldName = fieldList.addElement("fieldName");
        fieldName.setValue(vars.$fieldNames[i]);
        if (vars.$defaultValues.length() > i && vars.$defaultValues[i] != null && funcs._null(vars.$defaultValues[i]) == false) {
            fieldName.setAttributeValue("default", vars.$defaultValues[i]);
        }
    }
    var validateAll = xml.addElement("validateAll");
    validateAll.setValue(vars.$validateAll);

    vars.$L_xmlstring = xml.toXMLString();
    vars.$L_file.ruleXML = xml.toXMLString();
}

function loadMandatoryRuleFromJSON(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);
    var validateAll = jsonObj.validateAll;
    if (validateAll != null) {
        vars.$validateAll = validateAll;
    }

    var messageType = jsonObj.messageType;
    if (messageType != null) {
        vars.$messageType = messageType;
    }

    var fieldList = jsonObj.fieldList;
    if (fieldList == null) {
        return;
    }

    var checkField;
    var i;

    for (i = 0; i < fieldList.length; i++) {
        checkField = fieldList[i];
        if (checkField != null) {
            var field = checkField.fieldName;
            if (field != null && field != "null") {
                vars.$fieldNames = funcs.insert(vars.$fieldNames, 0, 1, field);
                var defaultV = checkField["default"];
                if (defaultV == null) {
                    defaultV = "";
                }
                vars.$defaultValues = funcs.insert(vars.$defaultValues, 0, 1, defaultV);
            }
        }
    }
}

function loadMandatoryRuleFromXml(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var rule = new XML();
    rule.setContent(ruleString);

    var messageType = lib.xmlHelpers.getElement(rule, "messageType", null);
    if (messageType != null) {
        vars.$messageType = messageType.getValue();
    }

    var validateAll = lib.xmlHelpers.getElement(rule, "validateAll", null);
    if (validateAll != null) {
        vars.$validateAll = validateAll.getValue();
    }

    var fieldList = lib.xmlHelpers.getElement(rule, "fieldList", null);
    if (fieldList == null) {
        return;
    }
    var checkField = fieldList.getFirstChildElement();

    do {
        if (checkField != null) {
            var field = checkField.getValue();
            if (field != null && field != "null") {
                vars.$fieldNames = funcs.insert(vars.$fieldNames, 0, 1, field);
            }

            if (checkField.getAttributeValue("default") != null) {
                var defaultValue = checkField.getAttributeValue("default");
                if (defaultValue != null) {
                    vars.$defaultValues = funcs.insert(vars.$defaultValues, 0, 1, defaultValue);
                }
            }
        }
        checkField = checkField.getNextSiblingElement();
    }
    while (checkField != null);
}

function clearFieldRuleJSON() {
    var jsonObj = {};
    jsonObj.type = "clearFields";
    var fields = [];
    jsonObj.fieldList = fields;
    vars.$L_file.type = "clearFields";

    vars.$fieldNames = funcs.denull(vars.$fieldNames);
    vars.$clearFields = funcs.denull(vars.$clearFields);
    var i;
    var iLoopTimes = vars.$fieldNames.length();
    for (i = 0; i < iLoopTimes; ++i) {
        var aField = {};
        aField.fieldName = vars.$fieldNames[i];
        if (vars.$clearFields.length() > i && vars.$clearFields[i] != null && funcs._null(vars.$clearFields[i]) == false) {
            aField.Clear = vars.$clearFields[i];
        } else {
            aField.Clear = "";
        }
        fields.push(aField);
    }

    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;
}

function clearFieldRule() {
    var xml = new XML();
    xml.setContent("<clearFields></clearFields>");
    var fieldList = xml.addElement("fieldList");
    vars.$fieldNames = funcs.denull(vars.$fieldNames);
    vars.$clearFields = funcs.denull(vars.$clearFields);
    var i;
    var iLoopTimes = vars.$fieldNames.length();
    for (i = 0; i < iLoopTimes; ++i) {
        var fieldName = fieldList.addElement("fieldName");
        fieldName.setValue(vars.$fieldNames[i]);

        if (vars.$clearFields.length() > i && vars.$clearFields[i] != null && funcs._null(vars.$clearFields[i]) == false) {
            fieldName.setAttributeValue("Clear", vars.$clearFields[i]);
        }
    }

    vars.$L_xmlstring = xml.toXMLString();
    vars.$L_file.ruleXML = xml.toXMLString();
}

function clearFieldRuleFromJSON(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }
    var jsonObj = JSON.parse(ruleString);
    var fieldList = jsonObj.fieldList;
    if (fieldList == null) {
        return;
    }

    var checkField;
    var i;
    for (i = 0; i < fieldList.length; i++) {
        checkField = fieldList[i];
        if (checkField != null) {
            var field = checkField.fieldName;
            if (field != null && field != "null") {
                vars.$fieldNames = funcs.insert(vars.$fieldNames, 0, 1, field);
                var clearFields = checkField.Clear;
                if (clearFields == null) {
                    clearFields = "";
                }
                vars.$clearFields = funcs.insert(vars.$clearFields, 0, 1, clearFields);
            }
        }
    }
}

function clearFieldRuleFromXml(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var rule = new XML();
    rule.setContent(ruleString);
    var fieldList = lib.xmlHelpers.getElement(rule, "fieldList", null);
    if (fieldList == null) {
        return;
    }
    var checkField = fieldList.getFirstChildElement();

    do {
        if (checkField != null) {
            var field = checkField.getValue();
            if (field != null && field != "null") {
                vars.$fieldNames = funcs.insert(vars.$fieldNames, 0, 1, field);
            }

            if (checkField.getAttributeValue("Clear") != null) {
                var clearFields = checkField.getAttributeValue("Clear");
                if (clearFields != null) {
                    vars.$clearFields = funcs.insert(vars.$clearFields, 0, 1, clearFields);
                }
            }
        }
        checkField = checkField.getNextSiblingElement();
    }
    while (checkField != null);
}

function populateMandatoryVariableRule() {
    var xml = new XML();
    xml.setContent("<mandatoryVariables></mandatoryVariables>");
    var messageType = xml.addElement("messageType");
    messageType.setValue(vars.$messageType);
    var variableList = xml.addElement("variableList");
    vars.$variableNames = funcs.denull(vars.$variableNames);
    vars.$defaultValues = funcs.denull(vars.$defaultValues);
    var i;
    var iLoopTimes = vars.$variableNames.length();
    for (i = 0; i < iLoopTimes; ++i) {
        var variableName = variableList.addElement("variableName");
        variableName.setValue(vars.$variableNames[i]);
        if (vars.$defaultValues.length() > i && vars.$defaultValues[i] != null && funcs._null(vars.$defaultValues[i]) == false) {
            variableName.setAttributeValue("default", vars.$defaultValues[i]);
        }
    }
    var validateAll = xml.addElement("validateAll");
    validateAll.setValue(vars.$validateAll);

    vars.$L_xmlstring = xml.toXMLString();
    vars.$L_file.ruleXML = xml.toXMLString();
}

function populateMandatoryVariableRuleJSON() {
    var jsonObj = {};
    jsonObj.type = "mandatoryVariables";
    jsonObj.messageType = vars.$messageType;
    jsonObj.validateAll = vars.$validateAll;
    var variables = [];
    jsonObj.variableList = variables;
    vars.$L_file.type = "mandatoryVariables";

    vars.$variableNames = funcs.denull(vars.$variableNames);
    vars.$defaultValues = funcs.denull(vars.$defaultValues);

    var i;
    var iLoopTimes = vars.$variableNames.length();
    for (i = 0; i < iLoopTimes; ++i) {
        var aVariable = {};
        aVariable.variableName = vars.$variableNames[i];
        if (vars.$defaultValues.length() > i && vars.$defaultValues[i] != null && funcs._null(vars.$defaultValues[i]) == false) {
            aVariable["default"] = vars.$defaultValues[i];
        } else {
            aVariable["default"] = "";
        }
        variables.push(aVariable);
    }

    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;
}

function loadMandatoryVariableRuleFromXml(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var rule = new XML();
    rule.setContent(ruleString);
    var messageType = lib.xmlHelpers.getElement(rule, "messageType", null);
    if (messageType != null) {
        vars.$messageType = messageType.getValue();
    }

    var validateAll = lib.xmlHelpers.getElement(rule, "validateAll", null);
    if (validateAll != null) {
        vars.$validateAll = validateAll.getValue();
    }

    var variableList = lib.xmlHelpers.getElement(rule, "variableList", null);
    if (variableList == null) {
        return;
    }
    var checkField = variableList.getFirstChildElement();

    do {
        if (checkField != null) {
            var variable = checkField.getValue();
            if (variable != null && variable != "null") {
                vars.$variableNames = funcs.insert(vars.$variableNames, 0, 1, variable);
            }

            if (checkField.getAttributeValue("default") != null) {
                var defaultValue = checkField.getAttributeValue("default");
                if (defaultValue != null) {
                    vars.$defaultValues = funcs.insert(vars.$defaultValues, 0, 1, defaultValue);
                }
            }
        }
        checkField = checkField.getNextSiblingElement();
    }
    while (checkField != null);
}

function loadMandatoryVariableRuleFromJSON(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);

    var validateAll = jsonObj.validateAll;
    if (validateAll != null) {
        vars.$validateAll = validateAll;
    }

    var messageType = jsonObj.messageType;
    if (messageType != null) {
        vars.$messageType = messageType;
    }

    var variableList = jsonObj.variableList;
    if (variableList == null) {
        vars.$variableNames = [];
        vars.$defaultValues = [];
        return;
    }

    var checkVariable;
    var i;
    for (i = 0; i < variableList.length; i++) {
        checkVariable = variableList[i];
        if (checkVariable != null) {
            var field = checkVariable.variableName;
            if (field != null && field != "null") {
                vars.$variableNames = funcs.insert(vars.$variableNames, 0, 1, field);
                var defaultV = checkVariable["default"];
                if (defaultV == null) {
                    defaultV = "";
                }
                vars.$defaultValues = funcs.insert(vars.$defaultValues, 0, 1, defaultV);
            }
        }
    }

}


function loadValidateRuleFromXml(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var rule = new XML();
    rule.setContent(ruleString);
    var messageType = lib.xmlHelpers.getElement(rule, "messageType", null);
    if (messageType != null) {
        vars.$messageType = messageType.getValue();
    }
    if (lib.xmlHelpers.getElement(rule, "fieldName", null) != null) {
        vars.$fieldName = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
    }
    if (lib.xmlHelpers.getElement(rule, "toTable", null) != null) {
        vars.$toTable = lib.xmlHelpers.getElement(rule, "toTable", null).getValue();
    }
    if (lib.xmlHelpers.getElement(rule, "toField", null) != null) {
        vars.$toField = lib.xmlHelpers.getElement(rule, "toField", null).getValue();
    }
    if (lib.xmlHelpers.getElement(rule, "filter", null) != null) {
        vars.$filter = lib.xmlHelpers.getElement(rule, "filter", null).getValue();
    }

    //get fill data
    var fieldList = lib.xmlHelpers.getElement(rule, "fillDataList", null);
    if (fieldList != null) {
        var checkField = fieldList.getFirstChildElement();
        do {
            if (checkField == null) {
                break;
            }
            var fillFrom = lib.xmlHelpers.getElement(checkField, "fillFrom");
            if (fillFrom != null) {
                vars.$fillFroms = funcs.insert(vars.$fillFroms, 0, 1, fillFrom.getValue());
            }
            var fillTo = lib.xmlHelpers.getElement(checkField, "fillTo");
            if (fillTo != null) {
                vars.$fillTos = funcs.insert(vars.$fillTos, 0, 1, fillTo.getValue());
            }

            checkField = checkField.getNextSiblingElement();
        }
        while (checkField != null);
    }
}

function populateValidateRule() {
    var xml = new XML();
    xml.setContent("<validateRecord></validateRecord>");

    var messageType = xml.addElement("messageType");
    messageType.setValue(vars.$messageType);

    var fieldName = xml.addElement("fieldName");
    fieldName.setValue(vars.$fieldName);

    var toTable = xml.addElement("toTable");
    toTable.setValue(vars.$toTable);

    var toField = xml.addElement("toField");
    toField.setValue(vars.$toField);

    if (!funcs._null(vars.$filter)) {
        var filter = xml.addElement("filter");
        filter.setValue(vars.$filter);
    }

    if (vars.$fillFroms != null) {
        var fillDataList = xml.addElement("fillDataList");
        var i;
        var iLoopTimes = vars.$fillFroms.length();
        for (i = 0; i < iLoopTimes; ++i) {
            if (!funcs._null(vars.$fillFroms[i])) {
                var fillData1 = fillDataList.addElement("fillData");
                var fillFrom = fillData1.addElement("fillFrom");
                fillFrom.setValue(vars.$fillFroms[i]);
                if (!funcs._null(vars.$fillTos[i])) {
                    var fillTo = fillData1.addElement("fillTo");
                    fillTo.setValue(vars.$fillTos[i]);
                }
            }
        }
    }

    vars.$L_xmlstring = xml.toXMLString();
    vars.$L_file.ruleXML = xml.toXMLString();
}

function getRuleDescription(ruleType, currentDes, tableName, values) {
    var index;
    var names;
    var desc;
    var i;
    var iLoopTimes;
    if (ruleType == "mandatory" || "clearFields") {
        index = currentDes.indexOf("<fields>");
        if (index > -1) {
            names = "";
            iLoopTimes = values.length();
            for (i = 0; i < iLoopTimes; ++i) {
                names += lib.tableFunctions.getFieldCaption(values[i], tableName) + ";";
            }

            desc = names.substring(0, names.length - 1) + currentDes.substring(index + 8);
            return desc;
        }
    }

    if (ruleType == "mandatoryVariables") {
        index = currentDes.indexOf("<variables>");
        if (index > -1) {
            names = "";
            iLoopTimes = values.length();
            for (i = 0; i < iLoopTimes; ++i) {
                names += lib.tableFunctions.getFieldCaption(values[i], tableName) + ";";
            }

            desc = names.substring(0, names.length - 1) + currentDes.substring(index + 11);
            return desc;
        }
    }
    return currentDes;
}


function populateFields() {
    var datadict = new SCFile("datadict", SCFILE_READONLY);
    var sql = "name=\"" + vars.$L_tablename + "\"";
    var rc = datadict.doSelect(sql);
    if (rc == RC_SUCCESS) {
        vars.$fillToValues = datadict.fields;
        vars.$fillToCaptions = datadict.captions;
    }

    var datadict2 = new SCFile("datadict", SCFILE_READONLY);
    var sql2 = "name=\"" + vars.$toTable + "\"";
    rc = datadict2.doSelect(sql2);
    if (rc == RC_SUCCESS) {
        vars.$fillFromValues = datadict2.fields;
        vars.$fillFromCaptions = datadict2.captions;
    }
}

function loadValidateListRuleFromXml(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var rule = new XML();
    rule.setContent(ruleString);
    var messageType = lib.xmlHelpers.getElement(rule, "messageType", null);
    if (messageType != null) {
        vars.$messageType = messageType.getValue();
    }

    if (lib.xmlHelpers.getElement(rule, "toList", null) != null) {
        vars.$toList = lib.xmlHelpers.getElement(rule, "toList", null).getValue();
    }
    if (lib.xmlHelpers.getElement(rule, "fieldName", null) != null) {
        vars.$fieldName = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
    }
    if (lib.xmlHelpers.getElement(rule, "toGlobal", null) != null) {
        vars.$toGlobal = lib.xmlHelpers.getElement(rule, "toGlobal", null).getValue();
    }

    var List = lib.xmlHelpers.getElement(rule, "manualList", null);
    if (List != null) {
        var checkList = List.getFirstChildElement();
        do {
            if (checkList == null) {
                break;
            }

            var toManual = checkList.getValue();

            if (toManual != null) {
                vars.$toManual = funcs.insert(vars.$toManual, 0, 1, toManual);
            }

            checkList = checkList.getNextSiblingElement();
        }
        while (checkList != null);
    }
}


function populateValidateListRule() {
    var xml = new XML();
    xml.setContent("<validateList></validateList>");

    var messageType = xml.addElement("messageType");
    messageType.setValue(vars.$messageType);

    var toList = xml.addElement("toList");
    toList.setValue(vars.$toList);

    var fieldName = xml.addElement("fieldName");
    fieldName.setValue(vars.$fieldName);

    var toGlobal = xml.addElement("toGlobal");
    toGlobal.setValue(vars.$toGlobal);

    if (vars.$toManual != null) {
        var manualList = xml.addElement("manualList");
    }

    var i;
    var iLoopTimes = vars.$toManual.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (!funcs._null(vars.$toManual[i])) {
            var manualItem = manualList.addElement("manualItem");
            manualItem.setValue(vars.$toManual[i]);
        }
    }

    vars.$L_xmlstring = xml.toXMLString();
    vars.$L_file.ruleXML = xml.toXMLString();
}

function populateClockNames() {
    var clockRecs = new SCFile("codes", SCFILE_READONLY);
    var clockNameArray = new SCDatum();
    var query = "type=\"ClockName:" + vars.$L_tablename + "\"";
    if (clockRecs.doSelect(query) == RC_SUCCESS) {
        clockRecs.getFirst();
        do {
            clockNameArray.push(clockRecs.value);
        } while (clockRecs.getNext() == RC_SUCCESS);

    }
    vars.$clockNameList = clockNameArray;
}


function populateDateFieldsList() {
    var datadict = new SCFile("datadict", SCFILE_READONLY);
    datadict.doSelect("name=\"" + vars.$L_tablename + "\"");
    if (datadict.getFirst() == RC_SUCCESS) {
        var fieldNames = new SCDatum();
        var fieldCaptions = new SCDatum();

        var i;
        var iLoopTimes = datadict.types.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (datadict.types[i] == 3) {
                fieldNames.push(datadict.fields[i]);
                fieldCaptions.push(datadict.captions[i]);
            }
        }

        vars.$fieldsNameList = fieldNames;
        vars.$fieldsCaptionList = fieldCaptions;

        fieldNames.push("[Current Date/Time]");
        fieldCaptions.push("[Current Date/Time]");

        vars.$fieldsNameList2 = fieldNames;
        vars.$fieldsCaptionList2 = fieldCaptions;
    }

}

function populateTextNumFieldsList() {
    var datadict = new SCFile("datadict", SCFILE_READONLY);
    datadict.doSelect("name=\"" + vars.$L_tablename + "\"");
    if (datadict.getFirst() == RC_SUCCESS) {
        var fieldNames = new SCDatum();
        var fieldCaptions = new SCDatum();
        var i;
        var iLoopTimes = datadict.types.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (datadict.types[i] == 1) {
                fieldNames.push(datadict.fields[i]);
                fieldCaptions.push(datadict.captions[i]);
            }
            if (datadict.types[i] == 2) {
                fieldNames.push(datadict.fields[i]);
                fieldCaptions.push(datadict.captions[i]);
            }
        }
        vars.$fieldsNameList = fieldNames;
        vars.$fieldsCaptionList = fieldCaptions;
    }
}


function populateFieldsSetNumberRule() {
    var datadict = new SCFile("datadict", SCFILE_READONLY);
    datadict.doSelect("name=\"" + vars.$L_tablename + "\"");
    if (datadict.getFirst() == RC_SUCCESS) {
        var fieldNames = new SCDatum();
        var fieldCaptions = new SCDatum();

        var i;
        var iLoopTimes = datadict.types.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (datadict.types[i] == 1 || datadict.types[i] == 2) {
                fieldNames.push(datadict.fields[i]);
                fieldCaptions.push(datadict.captions[i]);
            }
        }
        vars.$fieldsNameList = fieldNames;
        vars.$fieldsCaptionList = fieldCaptions;
    }
}

function populateRADResultXML(message) {
    var RESULTXML = "<result></result>";
    var result = new XML();
    result.setContent(RESULTXML);
    var messageXML = result.addElement("message");
    messageXML.setValue(message);
    result.setAttributeValue("returnCode", 1);
    return result;
}

function populateSetFieldRuleJSON() {
    var jsonObj = {};
    jsonObj.type = "setField";
    jsonObj.fieldName = vars.$L_ruleFieldName;
    jsonObj.script = vars.$L_ruleScript;

    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.type = "setField";
    vars.$L_file.ruleXML = null;
}

function loadSetFieldRuleFromJSON(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);
    vars.$L_ruleFieldName = jsonObj.fieldName;
    vars.$L_ruleScript = jsonObj.script;
}

function loadValidateListRuleFromJson(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);
    vars.$messageType = jsonObj.messageType;
    vars.$toList = jsonObj.toList;
    vars.$fieldName = jsonObj.fieldName;

    vars.$toGlobal = jsonObj.toGlobal;
    vars.$toManual = jsonObj.manualList;
}

function populateValidateListRuleJSON() {

    var jsonObj = {};
    jsonObj.type = "validateList";
    jsonObj.messageType = vars.$messageType;
    jsonObj.toList = vars.$toList;
    jsonObj.fieldName = vars.$fieldName;
    jsonObj.toGlobal = vars.$toGlobal;

    if (vars.$toManual != null) {
        var manualItems = [];
        jsonObj.manualList = manualItems;
        var i;
        var iLoopTimes = vars.$toManual.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (!funcs._null(vars.$toManual[i])) {
                manualItems.push(vars.$toManual[i]);
            }
        }
    }

    vars.$L_file.type = "validateList";
    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;
}

function loadValidateRangeRuleFromJson(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);

    vars.$messageType = jsonObj.messageType;
    vars.$fieldName = jsonObj.fieldName;
    vars.$rangeType = jsonObj.rangeType;

    if (jsonObj.comparison) {
        vars.$not = jsonObj.comparison.not;
        vars.$operator = jsonObj.comparison.operator;
    }
    if (jsonObj.compareField) {
        vars.$compareField1 = jsonObj.compareField.cField1;
        vars.$compareField2 = jsonObj.compareField.cField2;
    }
    if (jsonObj.value) {
        vars.$value1 = jsonObj.value.value1;
        vars.$value2 = jsonObj.value.value2;
    }
}


function populateValidateRangeRuleJSON() {

    var jsonObj = {};
    jsonObj.type = "validateRange";

    jsonObj.fieldName = vars.$L_fieldName;
    jsonObj.messageType = vars.$L_messageType;
    jsonObj.rangeType = vars.$rangeType;

    jsonObj.comparison = {};
    jsonObj.comparison.not = vars.$L_not;
    jsonObj.comparison.operator = vars.$operator;

    jsonObj.compareField = {};
    jsonObj.compareField.cField1 = vars.$L_compareField1;
    jsonObj.compareField.cField2 = vars.$L_compareField2;

    jsonObj.value = {};
    jsonObj.value.value1 = vars.$L_value1;
    jsonObj.value.value2 = vars.$L_value2;

    vars.$L_file.type = "validateRange";
    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;
}

function loadValidateRecordRuleFromJSON(ruleString) {
    if (ruleString == null || ruleString == "") {
        return;
    }

    var jsonObj = JSON.parse(ruleString);

    vars.$messageType = jsonObj.messageType;
    vars.$fieldName = jsonObj.fieldName;
    vars.$toTable = jsonObj.toTable;
    vars.$toField = jsonObj.toField;
    vars.$filter = jsonObj.filter;
    vars.$alwaysValidate = jsonObj.alwaysValidate;
    if (vars.$alwaysValidate == null) {
        vars.$alwaysValidate = false;
    }

    var i;
    var lng = jsonObj.fillDataList.length;
    for (i = 0; i < lng; ++i) {
        vars.$fillFroms = funcs.insert(vars.$fillFroms, 0, 1, jsonObj.fillDataList[i].fillFrom);
        vars.$fillTos = funcs.insert(vars.$fillTos, 0, 1, jsonObj.fillDataList[i].fillTo);
    }
}

function populateValidateRecordRuleJSON() {

    var jsonObj = {};
    jsonObj.type = "validateRecord";

    jsonObj.messageType = vars.$messageType;
    jsonObj.fieldName = vars.$fieldName;
    jsonObj.toTable = vars.$toTable;
    jsonObj.toField = vars.$toField;
    jsonObj.filter = vars.$filter;
    jsonObj.alwaysValidate = vars.$alwaysValidate;

    var fillFields = [];
    jsonObj.fillDataList = fillFields;
    if (vars.$fillFroms != null) {
        var i;
        var iLoopTimes = vars.$fillFroms.length();
        for (i = 0; i < iLoopTimes; ++i) {
            if (!funcs._null(vars.$fillFroms[i])) {
                var fillField = {};
                fillField.fillFrom = vars.$fillFroms[i];
                fillField.fillTo = vars.$fillTos[i];
                fillFields.push(fillField);
            }
        }
    }

    vars.$L_file.type = "validateRecord";
    vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
    vars.$L_file.ruleXML = null;
}

/**
 * return true if the email body contains a email action
 * @body Email body defined in htmltemplates
 */
function hasEmailAction(body) {
    var action_regx = /email_action\(.*?\)/i;
    var ret = action_regx.test(body);
    return ret;
}

function getUserList4Assignment(group, sendTo, hasSmartToken) {
    var list = [];
    if ((sendTo == "Manager") && group.wdManagerName != null) {
        list.push(group.wdManagerName);
    } else if (sendTo == "Approvers") {
        if (hasSmartToken || group.approverGroupEmail == null) {
            lib.ArrayUtil.addAll(list, funcs.denull(group.approvers));
        } else {
            list.push(group.approverGroupEmail);
        }
    } else if (sendTo == "Operators") {
        if (hasSmartToken || group.memberGroupEmail == null) {
            lib.ArrayUtil.addAll(list, funcs.denull(group.operators));
        } else {
            list.push(group.memberGroupEmail);
        }
    } else if (sendTo == "All") {
        if (hasSmartToken || group.memberGroupEmail == null) {
            lib.ArrayUtil.addAll(list, funcs.denull(group.operators));
        } else {
            list.push(group.memberGroupEmail);
        }

        if (hasSmartToken || group.approverGroupEmail == null) {
            lib.ArrayUtil.addAll(list, funcs.denull(group.approvers));
        } else {
            list.push(group.approverGroupEmail);
        }

        if (group.wdManagerName) {
            list.push(group.wdManagerName);
        }
    }

    return list;
}