var $ = lib.c.$;
var _ = lib.Underscore.require();
var log = getLog('RuleEngine');

var srcRecord;

var endUserChat = lib.EndUserChat;

const RESULT_ITEM_RETCODE = "returnCode";
const RESULT_ITEM_MSG = "message";
const RESULT_ITEM_MSGTYPE = "messageType";
const RESULT_ITEM_CURSOR = "cursorPosition";
const RESULT_ITEM_VALUE = "value";


function getType(ruleString, isJSONFormat) {
    if (isJSONFormat) {
        var jsonObj = rteJSONParse(ruleString);
        return jsonObj.type;
    } else {
        var xml = new XML();
        if (xml.setContent(ruleString)) {
            var parent = xml.getDocumentElement();
            var rule = parent.getFirstChildElement();
            if (rule == null) {
                return null;
            }
            ruleString = rule.toXMLString();
            return rule.getName();
        }
    }
    return null;
}

function setRuleXML(ruleSet, position, type) {
    var xmlString = "<rule>";

    xmlString += ruleSet.rule[position - 1].ruleXML;
    xmlString += "<condition>" + ruleSet.rule[position - 1].condition + "</condition>";
    xmlString += "</rule>";

    return xmlString;
}

function run(ruleSetString, record, oldRecord, isJSONFormat) {
    srcRecord = vars.$L_file_src;
    var result = initResult();

    const MANDATORY = "mandatoryFields";
    const MANDATORYVAR = "mandatoryVariables";
    const SETFIELD = "setField";
    const CLEARFIELDS = "clearFields";
    const NUMBERREC = "setNumber";
    const RUNJS = "runJS";
    const JSVAL = "JSValidate";
    //Added new rule type "chat assignment" for End User Chat by Henrry
    const CHATASSIGNMENT = "ChatAssignment";
    const VALFIELD = "validateRecord";
    const VALLIST = "validateList";
    const VALDATE = "validateDate";
    const SETCLOCK = "setClock";
    const CALLMACRO = "callMacro";
    const SENDTEAMSMESSAGE = "sendTeamsMessage";

    var type;

    if (!isJSONFormat) {
        var ruleSet = new XML();
        var rule;

        if (ruleSet.setContent(ruleSetString)) {
            var parent = ruleSet.getDocumentElement();

            rule = parent.getFirstChildElement();

            while (rule != null) {
                type = rule.getName();
                //print("RuleEngin Type=="+type);
                switch (type) {
                    case MANDATORY:
                        result = runMandatory(rule, record, oldRecord);
                        break;

                    case MANDATORYVAR:
                        result = runMandatoryVar(rule, record, oldRecord);
                        break;

                    case SETFIELD:
                        result = runSetValue(rule, record, oldRecord);
                        break;

                    case CLEARFIELDS:
                        result = runClearField(rule, record, oldRecord);
                        break;

                    case NUMBERREC:
                        result = runSetNumber(rule, record, oldRecord);
                        break;

                    case RUNJS:
                        runJS(rule, record, oldRecord);
                        break;

                    case JSVAL:
                        result = runJSVal(rule, record, oldRecord);
                        break;

                    case VALFIELD:
                        result = runValField(rule, record, oldRecord);
                        break;

                    case VALLIST:
                        result = runValList(rule, record, oldRecord);
                        break;

                    case VALDATE:
                        result = runValDate(rule, record, oldRecord);
                        break;

                    case SETCLOCK:
                        result = runSetClock(rule, record, oldRecord);
                        break;

                    case CALLMACRO:
                        result = runCallMacro(rule, record, oldRecord);
                        break;
                }

                if (result != null && result[RESULT_ITEM_VALUE] > 0) {
                    return result;
                }
                rule = rule.getNextSiblingElement();
            }
        }
    } else {
        var jsonObj = rteJSONParse(ruleSetString);
        type = jsonObj.type;
        //print("RuleEngin Type=="+type);
        switch (type) {
            case MANDATORY:
                result = runMandatory(jsonObj, record, oldRecord, true);
                break;

            case MANDATORYVAR:
                result = runMandatoryVar(jsonObj, record, oldRecord, true);
                break;

            case SETFIELD:
                result = runSetValue(jsonObj, record, oldRecord, true);
                break;

            case CLEARFIELDS:
                result = runClearField(jsonObj, record, oldRecord, true);
                break;

            case NUMBERREC:
                result = runSetNumber(jsonObj, record, oldRecord, true);
                break;

            case RUNJS:
                runJS(jsonObj, record, oldRecord, true);
                break;

            case JSVAL:
                result = runJSVal(jsonObj, record, oldRecord, true);
                break;

            case CHATASSIGNMENT:
                result = runChatAssignment(jsonObj, record, oldRecord, true);
                break;

            case VALFIELD:
                result = runValField(jsonObj, record, oldRecord, true);
                break;

            case VALLIST:
                result = runValList(jsonObj, record, oldRecord, true);
                break;

            case VALDATE:
                result = runValDate(jsonObj, record, oldRecord, true);
                break;

            case SETCLOCK:
                result = runSetClock(jsonObj, record, oldRecord, true);
                break;

            case CALLMACRO:
                result = runCallMacro(jsonObj, record, oldRecord, true);
                break;

            case SENDTEAMSMESSAGE:
                result = runSendTeamsMessage(jsonObj, record, oldRecord);
                break;
        }
    }

    return result;
}

function initResult() {
    var result = {};
    result[RESULT_ITEM_VALUE] = 0;

    return result;
}

function runSetClock(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var cursorPosition;
    var tablename = funcs.filename(record);
    // by default to use screen to display the message
    result[RESULT_ITEM_MSGTYPE] = "screen";

    if (rule == null || record == null) {
        result[RESULT_ITEM_MSG] = funcs.scmsg(35, "scev");
        return result;
    }

    var clockAction = getRuleFieldValue(rule, "clockAction", isJSONFormat);
    var clockType = tablename;
    var voidVar = new SCDatum();
    var errCode = new SCDatum();
    var tag = new SCDatum();
    voidVar = funcs.rtecall("tag", errCode, tag, record);
    var clockKey = funcs.substr(tag, funcs.index(";", tag) + 1);
    var clockNameType = getRuleFieldValue(rule, "clockNameType", isJSONFormat);

    var clockName;
    if (clockNameType == "Fixed Name") {
        clockName = getRuleFieldValue(rule, "clockName", isJSONFormat);
    }
    // remove below lines of setting clockName with JS by Xiong-jie MA to support schedule and timezone
    // end remove

    // add by Xiong-jie MA to support schedule and timezone
    // fixed value of schedule
    var clockSchedule = null;
    var clockScheduleType = getRuleFieldValue(rule, "clockScheduleType", isJSONFormat);
    if (clockScheduleType == "value") {
        clockSchedule = getRuleFieldValue(rule, "clockSchedule", isJSONFormat);
    }

    // fixed value of schedule
    var clockTimezone = null;
    var clockTimezoneType = getRuleFieldValue(rule, "clockTimezoneType", isJSONFormat);
    // other types of timezone (execpt "Set Using Javascript")
    var moduleControl = $("slamodulecontrol", SCFILE_READONLY).select("table.name=\"" + tablename + "\"").uniqueResult();
    if (null == moduleControl) { // in case the file has not yet configured in SLA module control, use empty file.
        moduleControl = new SCFile("slamodulecontrol");
    }
    // . System Server by default
    clockTimezone = vars.$lo_time_zone;
    // . Technician
    if (clockTimezoneType == "tech") {
        var techField = moduleControl.technician_field;
        if (null == techField) {
            //funcs.log("The Technician Field is not configured in slamodulecontrol for table \"" + tablename + "\", use field name \"ticket.owner\" as default.");
            techField = "ticket.owner";
        }
        var tech = record[techField];
        if (null != tech) {
            clockTimezone = lib.tzFunctions.getTZforOperator(tech);
            if (clockTimezone == -1) {
                clockTimezone = vars.$lo_time_zone;
            }
        } else {
            //funcs.log("Can not get the Technician from field \"" + techField + "\" of table \"" + tablename + "\", use system timezone instead.");
        }
    } else if (clockTimezoneType == "customer") {
        var customerField = moduleControl.customer_field;
        if (null == customerField) {
            //funcs.log("The Customer Field is not configured in slamodulecontrol for table \"" + tablename + "\", use field name \"contact.name\" as default.");
            customerField = "contact.name";
        }
        var customer = record[customerField];
        if (null != customer) {
            clockTimezone = lib.tzFunctions.getTZforContact(customer);
            if (clockTimezone == -1) {
                clockTimezone = vars.$lo_time_zone;
            }
        } else {
            //funcs.log("Can not get the Customer from field \"" + customerField + "\" of table \"" + tablename + "\", use system timezone instead.");
        }
    } else if (clockTimezoneType == "ci") {
        var ciFields = moduleControl.ci_fields;
        var ciField = null;
        if (null == ciFields || null == ciFields[0]) {
            //funcs.log("The CI Field is not configured in slamodulecontrol for table \"" + tablename + "\", use field name \"logical.name\" as default.");
            ciField = "logical.name";
        } else {
            ciField = ciFields[0];
        }
        var ci = record[ciField];
        if (null != ci) {
            clockTimezone = lib.tzFunctions.getTZforDevice(ci);
            if (clockTimezone == -1) {
                clockTimezone = vars.$lo_time_zone;
            }
        } else {
            //funcs.log("Can not get the CI from field \"" + ciField + "\" of table \"" + tablename + "\", use system timezone instead.");
        }
    } else if (clockTimezoneType == "value") {
        clockTimezone = getRuleFieldValue(rule, "clockTimezone", isJSONFormat);
    } else {
        // do nothing here, leave to next logics of setting with JS
    }

    // any of the clock name, schedule or timezone is set with JS
    if (clockNameType == "Set Using Javascript" ||
        (clockAction != "stopClock" && clockScheduleType == "Set Using Javascript") ||
        (clockAction != "stopClock" && clockTimezoneType == "Set Using Javascript")) {
        var useJSFlags = [];
        if (clockNameType == "Set Using Javascript") {
            useJSFlags.push(true);
        } else {
            useJSFlags.push(false);
        }
        if (clockAction != "stopClock" && clockScheduleType == "Set Using Javascript") {
            useJSFlags.push(true);
        } else {
            useJSFlags.push(false);
        }
        if (clockAction != "stopClock" && clockTimezoneType == "Set Using Javascript") {
            useJSFlags.push(true);
        } else {
            useJSFlags.push(false);
        }

        var js = getRuleFieldValue(rule, "scriptField", isJSONFormat);
        var array = executeClockJS(js, record, oldRecord, useJSFlags);
        if (clockNameType != "Fixed Name") {
            clockName = array[0];
        }
        if (clockScheduleType == "Set Using Javascript") {
            clockSchedule = array[1];
        }
        if (clockTimezoneType == "Set Using Javascript") {
            clockTimezone = array[2];
        }
        if (clockName === "Error" || clockSchedule === "Error" || clockTimezone === "Error") {
            result[RESULT_ITEM_MSG] = funcs.scmsg(40, "ruleset");
            result[RESULT_ITEM_RETCODE] = "1";

            return result;
        }
    }
    // end add

    if (null == clockName || $.trim(clockName) == "") {
        result[RESULT_ITEM_MSG] = funcs.scmsg(2138, "fc");
        result[RESULT_ITEM_RETCODE] = "1";

        return result;
    }

    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var radResults = new SCDatum();

    argNames.setType(8);
    argVals.setType(8);
    radResults.setType(8);

    argNames.push("name");
    argNames.push("prompt");
    argNames.push("query");

    argVals.push(clockType);
    argVals.push(clockName);
    argVals.push(clockKey);

    if (clockAction == "stopClock") {
        var application = "apm.stop.clock";
        argNames.push("string1");
        argVals.push("stop");
    } else {
        application = "apm.start.clock";
        // add by Xiong-jie MA to support schedule and timezone
        if (null != clockSchedule && clockSchedule != "") {
            argNames.push("string1");
            argVals.push(clockSchedule);
            argNames.push("text");
            argVals.push(clockTimezone);
        }
        // end add
    }
    radResults.push("values");

    try {
        var runRadResult = funcs.rtecall("callrad",
            radResults,
            application, //RAD app name
            argNames,
            argVals,
            false);

        result[RESULT_ITEM_RETCODE] = "0";
        return result;
    } catch (e) {
        var msg = funcs.scmsg(207, "ruleset");
        printRuleError(msg, e);
        result[RESULT_ITEM_RETCODE] = "1";
        return result;
    }
}


function printRuleError(message, e) {
    var msg = message + " " + e.toString();
    funcs.msg(msg, 2);

    log.error(message);
    log.error(e.toString());
}


function executeClockJS(js, record, oldRecord, useJSFlags) {
    try {
        if (useJSFlags[0] === false) {
            var clockName = null;
        }
        if (useJSFlags[1] === false) {
            var clockSchedule = null;
        }
        if (useJSFlags[2] === false) {
            var clockTimezone = null;
        }

        eval(js);
        if (clockName === undefined) {
            throw "clockName is undefined";
        }
        if (clockSchedule === undefined) {
            throw "clockSchedule is undefined";
        }
        if (clockTimezone === undefined) {
            throw "clockTimezone is undefined";
        }

        return [clockName, clockSchedule, clockTimezone];
    } catch (e) {
        var msg = funcs.scmsg(208, "ruleset");
        printRuleError(msg, e);
        return ["Error", "Error", "Error"];
    }
}

/**
 * The json format of the rule:
 * {
 *   "type":"callMacro",
 *   "macroName":"xx"
 * }
 */
function runCallMacro(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var cursorPosition;
    var tablename = funcs.filename(record);

    if (rule == null || record == null) {
        result[RESULT_ITEM_MSG] = funcs.scmsg(35, "scev");
        return result;
    }

    var macroName;
    if (isJSONFormat) {
        macroName = rule["macroName"];
    } else {
        macroName = lib.xmlHelpers.getElement(rule, "macroName", null).getValue();
    }
    var macroRecord = new SCFile("macro");
    macroRecord.doSelect("filename=\"" + tablename + "\" and name=\"" + macroName + "\"");

    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var radResults = new SCDatum();

    argNames.setType(8);
    argVals.setType(8);
    radResults.setType(8);

    argNames.push("record");
    argNames.push("index");
    argNames.push("second.file");
    argNames.push("file");

    argVals.push(macroRecord);
    argVals.push(macroRecord.id);
    argVals.push(oldRecord);
    argVals.push(record);

    try {
        var runRadResult = funcs.rtecall("callrad",
            radResults,
            "macro.execute", //RAD app name
            argNames,
            argVals,
            false);

        result[RESULT_ITEM_RETCODE] = "0";

        return result;
    } catch (e) {
        var msg = funcs.scmsg(209, "ruleset");
        printRuleError(msg, e);
        result[RESULT_ITEM_RETCODE] = "1";
        return result;
    }
}


/**
 * The json format of the rule:
 * {
 *   "type":"mandatoryFields",
 *   "messageType":"pop-up",  -- the possible value is "pop-up" or "screen"
 *   "validateAll":"true",    -- the possible value is "true" or "false"
 *   "fieldList":[{"fieldName"":"field1", "default"="default value 1"},{},{},{}],
 * }
 */
function runMandatory(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var messageType;
    var cursorPosition;
    var cursorPostionFirstField;
    var tempFieldList = "";
    var logicalnameTempFieldList = "";
    var validationFailed = false;
    var logicalnameValidation = false;
    var runResult;
    var tablename = funcs.filename(record);
    var tempTranslateAnd = funcs.scmsg(301, "ruleset");

    if (tempTranslateAnd.indexOf("Could not be found") > -1) {
        tempTranslateAnd = "and";
    }
    tempTranslateAnd = " " + tempTranslateAnd + " ";

    if (rule == null || record == null) {
        result[RESULT_ITEM_MSG] = "Invalid Parameters";
        return result;
    }

    var msgType;
    var validateAll;
    if (isJSONFormat) {
        msgType = rule.messageType;
        validateAll = rule.validateAll + "";
    } else {
        var messageTypeXML = lib.xmlHelpers.getElement(rule, "messageType", null);
        if (messageTypeXML != null) {
            msgType = messageTypeXML.getValue();
        }

        var validateAllXML = lib.xmlHelpers.getElement(rule, "validateAll", null);
        if (validateAllXML != null) {
            validateAll = validateAllXML.getValue();
        }
    }

    var fieldList;
    var checkField;
    var field;
    var defaultValue;

    if (isJSONFormat) {
        fieldList = rule.fieldList;
        if (null == fieldList) {
            return;
        }
        var i;
        for (i = 0; i < fieldList.length; i++) {
            checkField = fieldList[i];
            field = checkField.fieldName;

            defaultValue = checkField["default"];
            runResult = runMandatoryItem(field, defaultValue, msgType, validateAll, tablename, result, record, oldRecord);
            if (runResult.tempField != null && !runResult.isRefTableField) {
                if (tempFieldList == "") {
                    tempFieldList = runResult.tempField;
                    cursorPostionFirstField = field;
                } else {
                    if (tempFieldList != "") {
                        tempFieldList = tempFieldList.replace(tempTranslateAnd, ", ");
                        tempFieldList = tempFieldList + tempTranslateAnd + runResult.tempField;
                    }
                }
            } else {
                if (runResult.tempField != null && runResult.isRefTableField) {
                    if (logicalnameTempFieldList == "") {
                        logicalnameTempFieldList = runResult.tempField;
                        if (cursorPostionFirstField === undefined || cursorPostionFirstField === "" || cursorPostionFirstField === null) {
                            cursorPostionFirstField = field;
                        }
                    } else {
                        if (logicalnameTempFieldList != "") {
                            logicalnameTempFieldList = logicalnameTempFieldList.replace(tempTranslateAnd, ", ");
                            logicalnameTempFieldList = logicalnameTempFieldList + tempTranslateAnd + runResult.tempField;
                        }
                    }
                }
            }
            if (runResult.validationFailed) {
                validationFailed = runResult.validationFailed;
            }
            if (runResult.isRefTableField) {
                logicalnameValidation = runResult.isRefTableField;
            }
            if (runResult["break"]) {
                break;
            }
        }
    } else {
        fieldList = lib.xmlHelpers.getElement(rule, "fieldList", null);
        checkField = fieldList.getFirstChildElement();
        do {
            field = checkField.getValue();
            defaultValue = checkField.getAttributeValue("default");
            runResult = runMandatoryItem(field, defaultValue, msgType, validateAll, tablename, result, record, oldRecord);
            if (runResult.tempField != null && !runResult.isRefTableField) {
                if (tempFieldList == "") {
                    tempFieldList = runResult.tempField;
                    cursorPostionFirstField = field;
                } else {
                    if (tempFieldList != "") {
                        tempFieldList = tempFieldList.replace(tempTranslateAnd, ", ");
                        tempFieldList = tempFieldList + tempTranslateAnd + runResult.tempField;
                    }
                }
            } else {
                if (runResult.tempField != null && runResult.isRefTableField) {
                    if (logicalnameTempFieldList == "") {
                        logicalnameTempFieldList = runResult.tempField;
                        if (cursorPostionFirstField === undefined || cursorPostionFirstField === "" || cursorPostionFirstField === null) {
                            cursorPostionFirstField = field;
                        }
                    } else {
                        if (logicalnameTempFieldList != "") {
                            logicalnameTempFieldList = logicalnameTempFieldList.replace(tempTranslateAnd, ", ");
                            logicalnameTempFieldList = logicalnameTempFieldList + tempTranslateAnd + runResult.tempField;
                        }
                    }
                }
            }
            if (runResult.validationFailed) {
                validationFailed = runResult.validationFailed;
            }
            if (runResult.isRefTableField) {
                logicalnameValidation = runResult.isRefTableField;
            }
            if (runResult["break"]) {
                break;
            }

            checkField = checkField.getNextSiblingElement();
        }
        while (checkField != null);
    }

    if (validateAll == "true" && (validationFailed == true || logicalnameValidation == true)) {
        var params = new Array(3);
        var returnCode = 1;
        var messageNo = 1;
        params[0] = tempFieldList;
        if (tempFieldList.indexOf(tempTranslateAnd) > -1) {
            messageNo = 9;
        }
        if (tempFieldList !== "" && tempFieldList !== null) {
            result[RESULT_ITEM_MSG] = funcs.scmsg(messageNo, "ruleset", params);
        }
        //Start: Added by Henrry for logical name solution validation
        if (logicalnameValidation) {
            messageNo = "logicalname.validation";
            params[0] = logicalnameTempFieldList;
            if (logicalnameTempFieldList.indexOf(tempTranslateAnd) > -1) {
                messageNo = "logicalname.validation.all";
            }
            if (result[RESULT_ITEM_MSG] !== undefined && result[RESULT_ITEM_MSG] !== "" && result[RESULT_ITEM_MSG] !== null) {
                result[RESULT_ITEM_MSG] += "\n" + funcs.scmsg(messageNo, "ruleset", params);
            } else {
                result[RESULT_ITEM_MSG] = funcs.scmsg(messageNo, "ruleset", params);
            }
        }
        //End

        if (msgType != null) {
            result[RESULT_ITEM_MSGTYPE] = msgType;
        }
        result[RESULT_ITEM_CURSOR] = cursorPostionFirstField;
        result[RESULT_ITEM_RETCODE] = returnCode + "";
    }

    return result;
}

function runMandatoryItem(field, defaultValue, msgType, validateAll, tablename, result, record, oldRecord) {
    var ret = {
        "validationFailed": false,
        "break": false,
        "tempField": null,
        "isRefTableField": false
    };

    var notArrayFlag = true;
    var ftype = funcs.type(record[field]);
    if (ftype == 8) { // array
        record[field] = funcs.denull(record[field]);
        if (record[field].length() == 0) {
            notArrayFlag = false;
        }
    }

    if (notArrayFlag && record[field] != null && (ftype != 2 || record[field] != "")) { // not array and not null and not empty string
        result[RESULT_ITEM_RETCODE] = "0";
    } else {
        var caption;
        var params;

        //Start: Added by Henrry for logical name solution validation
        var smField = field.replace(/_/g, ".");
        var refTable = lib.DisplayName.getRefTable(smField, funcs.filename(record));
        var displayValue = null;
        if (refTable !== "" && refTable !== null) {
            displayValue = funcs.get_display_value(record, smField);
        }
        if ((record[field] === null || record[field] === "" || funcs._null(record[field])) &&
            ((notArrayFlag && displayValue !== null && displayValue !== "" && displayValue !== undefined) || (!notArrayFlag && funcs.lng(displayValue) > 0))) {
            result[RESULT_ITEM_RETCODE] = "1";
            caption = getFieldCaption(smField, tablename);
            params = new Array(3);
            params[0] = caption;

            if (!caption) {
                params[0] = field;
            } else {
                params[0] = funcs.scmsg(caption, "sccaption");
                if (funcs.index("Could not be found:", params[0]) > 0) {
                    params[0] = caption;
                }
            }
            ret.tempField = params[0];

            if (validateAll != "true") {
                result[RESULT_ITEM_MSG] = funcs.scmsg("logicalname.validation", "ruleset", params);

                if (msgType != null) {
                    result[RESULT_ITEM_MSGTYPE] = msgType;
                }
                result[RESULT_ITEM_CURSOR] = smField;
                ret["break"] = true;
            }
            ret.validationFailed = true;
            ret.isRefTableField = true;
        } else { //End
            var returnCode = 1;
            var fieldType = lib.tableFunctions.getFieldType(field, tablename, !notArrayFlag);
            if (defaultValue != null && defaultValue.length != 0) {
                if (notArrayFlag) {
                    record[field] = funcs.val(defaultValue, fieldType);
                    returnCode = 0;
                } else {
                    //field = field.replace(/\./g, "_");
                    record[field][0] = defaultValue;
                    returnCode = 0;
                }
            } else {
                caption = getFieldCaption(smField, tablename);
                params = new Array(3);
                params[0] = caption;

                if (!caption) {
                    params[0] = field;
                } else {
                    params[0] = funcs.scmsg(caption, "sccaption");
                    if (funcs.index("Could not be found:", params[0]) > 0) {
                        params[0] = caption;
                    }
                }
                ret.tempField = params[0];

                if (validateAll != "true") {
                    result[RESULT_ITEM_MSG] = funcs.scmsg(1, "ruleset", params);

                    if (msgType != null) {
                        result[RESULT_ITEM_MSGTYPE] = msgType;
                    }
                    result[RESULT_ITEM_CURSOR] = smField;
                }
                ret.validationFailed = true;
            }

            result[RESULT_ITEM_RETCODE] = returnCode + "";
            if (validateAll != "true" && (returnCode != 0 || returnCode != "0")) {
                ret["break"] = true;
            }
        }
    }

    return ret;
}

function runMandatoryVar(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var messageType;
    var cursorPosition;
    var tempVarList = "";
    var validationFailed = false;
    var tablename = funcs.filename(record);
    var tempTranslateAnd = funcs.scmsg(301, "ruleset");

    if (tempTranslateAnd.indexOf("Could not be found") > -1) {
        tempTranslateAnd = "and";
    }
    tempTranslateAnd = " " + tempTranslateAnd + " ";

    if (rule == null || record == null) {
        result[RESULT_ITEM_MSG] = "Invalid Parameters";
        return result;
    }

    var msgType;
    var validateAll;
    if (isJSONFormat) {
        msgType = rule.messageType;
        validateAll = rule.validateAll + "";
    } else {

        var messageTypeXML = lib.xmlHelpers.getElement(rule, "messageType", null);
        if (messageTypeXML != null) {
            msgType = messageTypeXML.getValue();
        }

        var validateAllXML = lib.xmlHelpers.getElement(rule, "validateAll", null);
        if (validateAllXML != null) {
            validateAll = validateAllXML.getValue();
        }
    }

    var variableList;
    var returnCode;
    var defaultValue;
    var params;
    var smVariable;
    var variable;

    if (isJSONFormat) {
        variableList = rule.variableList;
        if (null == variableList) {
            return;
        }
        var i;
        for (i = 0; i < variableList.length; i++) {
            var checkVariable = variableList[i];
            variable = checkVariable.variableName;
            if (!funcs._null(vars[variable])) {
                result[RESULT_ITEM_RETCODE] = "0";
            } else {
                returnCode = 1;
                defaultValue = checkVariable["default"];
                if (defaultValue != null && defaultValue.length != 0) {
                    if (typeof(defaultValue) == "string") {
                        vars[variable] = defaultValue;
                    } else {
                        $L_Variable = eval(variable.replace(/\./g, "_") + "=" + defaultValue);
                    }

                    returnCode = 0;
                } else {
                    smVariable = variable.replace(/_/g, ".");

                    params = new Array(3);
                    params[0] = smVariable;

                    if (tempVarList == "") {
                        tempVarList = params[0];
                    } else {
                        if (tempVarList != "") {
                            tempVarList = tempVarList.replace(tempTranslateAnd, ", ");
                            tempVarList = tempVarList + tempTranslateAnd + params[0];
                        }
                    }

                    if (validateAll != "true") {
                        result[RESULT_ITEM_MSG] = funcs.scmsg(1, "ruleset", params);

                        if (msgType != null) {
                            result[RESULT_ITEM_MSGTYPE] = msgType;
                        }

                        result[RESULT_ITEM_CURSOR] = smVariable;
                    }
                    validationFailed = true;
                }

                result[RESULT_ITEM_RETCODE] = returnCode + "";
                if (validateAll != "true" && (returnCode != 0 || returnCode != "0")) {
                    break;
                }
            }
        }
    } else {
        variableList = lib.xmlHelpers.getElement(rule, "variableList", null);
        var checkField = variableList.getFirstChildElement();

        do {
            variable = checkField.getValue();

            if (!funcs._null(vars[variable])) {
                result[RESULT_ITEM_RETCODE] = "0";
            } else {
                returnCode = 1;
                defaultValue = checkField.getAttributeValue("default");
                if (defaultValue != null && defaultValue.length != 0) {
                    if (typeof(defaultValue) == "string") {
                        vars[variable] = defaultValue;
                    } else {
                        $L_Variable = eval(variable.replace(/\./g, "_") + "=" + defaultValue);
                    }

                    returnCode = 0;
                } else {
                    smVariable = variable.replace(/_/g, ".");

                    params = new Array(3);
                    params[0] = smVariable;

                    if (tempVarList == "") {
                        tempVarList = params[0];
                    } else {
                        if (tempVarList != "") {
                            tempVarList = tempVarList.replace(tempTranslateAnd, ", ");
                            tempVarList = tempVarList + tempTranslateAnd + params[0];
                        }
                    }

                    if (validateAll != "true") {
                        result[RESULT_ITEM_MSG] = funcs.scmsg(1, "ruleset", params);

                        if (msgType != null) {
                            result[RESULT_ITEM_MSGTYPE] = msgType;
                        }

                        result[RESULT_ITEM_CURSOR] = smVariable;
                    }
                    validationFailed = true;
                }

                result[RESULT_ITEM_RETCODE] = returnCode + "";
                if (validateAll != "true" && (returnCode != 0 || returnCode != "0")) {
                    break;
                }
            }
            checkField = checkField.getNextSiblingElement();
        }
        while (checkField != null);
    }

    if (validateAll == "true" && validationFailed == true) {
        params[0] = tempVarList;
        returnCode = 1;
        var messageNo = 1;
        if (tempVarList.indexOf(tempTranslateAnd) > -1) {
            messageNo = 9;
        }

        result[RESULT_ITEM_MSG] = funcs.scmsg(messageNo, "ruleset", params);

        if (msgType != null) {
            result[RESULT_ITEM_MSGTYPE] = msgType;
        }
        result[RESULT_ITEM_CURSOR] = smVariable;

        result[RESULT_ITEM_RETCODE] = returnCode + "";
    }
    return result;
}

/**
 * The json format of the rule:
 * {
 *   "type":"clearFields",
 *   "fieldList":[{"fieldName"":"field1", "Clear"="No"},{"fieldName"":"field2", "Clear"="Yes"},{},{}],
 * }
 */
function runClearField(rule, record, oldRecord, isJSONFormat) {

    var result = initResult();
    var tablename = funcs.filename(record);

    if (rule == null || record == null) {
        result[RESULT_ITEM_MSG] = "Invalid Parameters";
        return result;
    }

    var fieldList;
    var fieldName;
    var checkField;
    var clear;

    if (isJSONFormat) {
        fieldList = rule.fieldList;
        if (null == fieldList) {
            return;
        }
        var i;
        for (i = 0; i < fieldList.length; i++) {
            checkField = fieldList[i];
            clear = checkField.Clear;
            if (clear == null) {
                clear = "No";
            }
            fieldName = checkField.fieldName;
            record[fieldName] = null;

            // clear display name value
            var refTable = lib.DisplayName.getRefTable(fieldName, tablename);
            if (refTable) {
                if (log.isDebugEnabled()) {
                    log.debug("Clear display name value of field: " + fieldName);
                }
                funcs.clean_display_value(record, fieldName);
            }

            if (clear == "Yes") {
                clearRelatedFields(checkField, record, isJSONFormat);
            }

            result[RESULT_ITEM_RETCODE] = "0";
        }
    } else {
        fieldList = lib.xmlHelpers.getElement(rule, "fieldList", null);
        checkField = fieldList.getFirstChildElement();
        do {
            clear = checkField.getAttributeValue("Clear");

            if (clear == null) {
                clear = "No";
            }

            fieldName = checkField.getValue();
            record[fieldName] = null;

            if (clear == "Yes") {
                clearRelatedFields(checkField, record);
            }
            /* comment below 2 no use lines         
                        var clField = fieldName.replace(/\_/g, ".")
                        var caption = getFieldCaption( clField, tablename );
            */
            //print("Fields cleared are " + caption);                       

            result[RESULT_ITEM_RETCODE] = "0";

            checkField = checkField.getNextSiblingElement();

        } while (checkField != null);
    }

    return result;
}


function clearRelatedFields(element, record, isJSONFormat) {
    var relink = new SCFile("link"); // no need to use  SCFILE_READONLY and setFields because link is cached at RTE side.
    var tablename = funcs.filename(record);
    var sql = "name= \"" + tablename + "\"";

    if (relink.doSelect(sql) == RC_SUCCESS) {
        var field = null;
        if (isJSONFormat) {
            field = element.fieldName;
        } else {
            field = element.getValue();
        }
        var index = funcs.index(field, relink.source_fields);
        index--;

        if (index > -1) {

            var clearFields = relink.project_target_fields[index];
            //print("Linked Fields are = " + relink.project_target_fields.toArray());
            //print("Related Fields cleared are = " + clearFields);         

            var i;
            var iLoopTimes = clearFields.length();
            for (i = 0; i < iLoopTimes; i++) {
                record[clearFields[i]] = null;
            }
        }
    }
}

/**
 * The json format of the rule:
 *{
 *    "type": "setField",
 *    "fieldName": "active",
 *    "script": "value=5;"
 *}
 */
function runSetValue(rule, record, oldRecord, isJSONFormat) {
    //var evalString;
    var value;
    var field;
    var js;
    if (isJSONFormat) {
        field = rule.fieldName;
        js = rule.script;
    } else {
        const fieldName = "fieldName";
        field = lib.xmlHelpers.getElement(rule, fieldName, null).getValue();
        const scriptField = "script";
        js = lib.xmlHelpers.getElement(rule, scriptField, null).getValue();
    }
    var result = initResult();

    result[RESULT_ITEM_MSG] = "";
    result[RESULT_ITEM_RETCODE] = "0";
    result[RESULT_ITEM_CURSOR] = "";

    var returnCode = 0;
    var message = "";
    var cursorPosition = "";

    try {
        value = evalValue(js, record, oldRecord);
    } catch (e) {
        var msg = funcs.scmsg(206, "ruleset");
        printRuleError(msg, e);
    }

    //evalString = "record." + field + " = value ";
    //var rc = eval( evalString );
    if (funcs.dbdict_helper("field.type", funcs.filename(record), field) == 8 && !_.isArray(value)) {
        record[field] = [value];
    } else {
        record[field] = value;
    }

    if (returnCode != null) {
        result[RESULT_ITEM_RETCODE] = returnCode + "";
    } else {
        result[RESULT_ITEM_RETCODE] = "0";
    }

    if (message != null) {
        result[RESULT_ITEM_MSG] = message;
    }

    if (cursorPosition != null) {
        result[RESULT_ITEM_CURSOR] = cursorPosition;
    }

    return result;
}


function runJS(rule, record, oldRecord) {
    const scriptField = "script";
    var js = lib.xmlHelpers.getElement(rule, scriptField, null).getValue();
    try {
        eval(js);
    } catch (e) {
        var msg = funcs.scmsg(206, "ruleset");
        printRuleError(msg, e);
    }
}

/**
 * The json format of the rule:
 * {
 *   "type":"JSValidate",
 *   "script":"xx"
 * }
 */
function runJSVal(rule, record, oldRecord, isJSONFormat) {
    const scriptField = "script";
    var js = null;
    if (isJSONFormat) {
        js = rule[scriptField];
    } else {
        js = lib.xmlHelpers.getElement(rule, scriptField, null).getValue();
    }

    //although this resultXml variable is no longer a xml here , to void the issue that they define some variable in the Javascript(say result variable) and execute 
    //in eval method will overwrite the new variable defined , we will keep it as it is
    var resultXml = initResult();

    resultXml[RESULT_ITEM_MSG] = "";
    resultXml[RESULT_ITEM_MSGTYPE] = "";
    resultXml[RESULT_ITEM_RETCODE] = "0";
    resultXml[RESULT_ITEM_CURSOR] = "";

    var returnCode = 0;
    var message = "";
    var msgType = "";
    var cursorPosition = "";
    try {
        eval(js);
    } catch (e) {
        var msg = funcs.scmsg(206, "ruleset");
        printRuleError(msg, e);
    }

    if (returnCode != null) {
        resultXml[RESULT_ITEM_RETCODE] = returnCode + "";
    } else {
        resultXml[RESULT_ITEM_RETCODE] = "0";
    }

    if (message != null) {
        resultXml[RESULT_ITEM_MSG] = message;
    }

    if (msgType != null) {
        resultXml[RESULT_ITEM_MSGTYPE] = msgType;
    }

    if (cursorPosition != null) {
        resultXml[RESULT_ITEM_CURSOR] = cursorPosition;
    }

    return resultXml;
}

/*
 * Only support json format
 * Start for End User Chat Assignment group routing
 */

function runChatAssignment(rule, record, oldRecord, isJSONFormat) {
    const groupfield = "groupfield";
    const contactfield = "contactfield";
    const servicefield = "servicefield";
    const deptbased = "deptbased";
    const servicebased = "servicebased";
    const locationbased = "locationbased";
    const languagebased = "languagebased";
    const companybased = "companybased";
    const scriptField = "script";

    var groupfieldname = rule[groupfield];
    var contactfieldname = rule[contactfield];
    var servicefieldname = rule[servicefield];
    var deptbase = rule[deptbased];
    var servicebase = rule[servicebased];
    var locationbase = rule[locationbased];
    var languagebase = rule[languagebased];
    var companybase = rule[companybased];
    var js = rule[scriptField];

    var resultXml = initResult();

    resultXml[RESULT_ITEM_MSG] = "";
    resultXml[RESULT_ITEM_MSGTYPE] = "";
    resultXml[RESULT_ITEM_RETCODE] = "0";
    resultXml[RESULT_ITEM_CURSOR] = "";

    var returnCode = 0;
    var message = "";
    var msgType = "";
    var cursorPosition = "";
    //chatGroupValue is set by js
    if (js !== null && js !== undefined && js !== "") {
        var chatGroupValue;
        try {
            eval(js);
        } catch (e) {
            var msg = funcs.scmsg(206, "ruleset");
            printRuleError(msg, e);
        }

        //chatGroupValue is not set in js
        if (chatGroupValue === undefined) {
            returnCode = 1;
            message = funcs.scmsg(202, "ruleset");
            msgType = "screen";
        } else {
            if (!(chatGroupValue instanceof Array)) {
                if (funcs.type(chatGroupValue) === 8) {
                    chatGroupValue = chatGroupValue.toArray();
                }
            }
            if (chatGroupValue instanceof Array) {
                returnCode = 1;
                message = funcs.scmsg(203, "ruleset");
                msgType = "screen";
            } else {
                if (chatGroupValue === "" || chatGroupValue === null) {
                    setChatGroupValue(record, groupfieldname, "");
                } else {
                    var group = endUserChat.getAvailableAssignmentGroup(true, false, chatGroupValue, null);
                    setChatGroupValue(record, groupfieldname, group);
                }
            }
        }
    }
    //chatGroupValue is not set by js, need perform assignment group routing by using end user profile info based on ruleset and assignment configuration
    else {
        var groupValue = "";
        var userProfile = endUserChat.getUserProfile(record, contactfieldname);
        if (userProfile['invalid']) {
            returnCode = 1;
            message = funcs.scmsg(205, "ruleset");
            msgType = "screen";
        }
        var sql = "";
        //Need adhoc sql join query
        //if(servicebase==="true" && record[servicefieldname]){
        if (servicebase === "true") {
            sql = "SELECT ta01.name as name,ta01.calendar.name as calendar.name,ta01.time.zone as time.zone FROM assignment ta01 LEFT OUTER JOIN device ta02 ON  ( ta01.name = ta02.support.groups )  WHERE ta01.support.chat=true and ta02.logical.name=\"" + record[servicefieldname] + "\"";
            if (deptbase === "true" && userProfile['dept']) {
                sql += " and ta01.supported.depts=\"" + userProfile['dept'] + "\"";
            }
            if (locationbase === "true" && userProfile['location']) {
                sql += " and ta01.supported.locations=\"" + userProfile['location'] + "\"";
            }
            if (languagebase === "true" && userProfile['language']) {
                sql += " and ta01.supported.languages=\"" + userProfile['language'] + "\"";
            }
            if (companybase === "true" && userProfile['company']) {
                sql += " and ta01.supported.companies=\"" + userProfile['company'] + "\"";
            }
            sql += " order by name";
            groupValue = endUserChat.getAvailableAssignmentGroup(false, true, null, sql);
        } else {
            sql = "support.chat=true";
            if (deptbase === "true" && userProfile['dept']) {
                sql += " and supported.depts=\"" + userProfile['dept'] + "\"";
            }
            if (locationbase === "true" && userProfile['location']) {
                sql += " and supported.locations=\"" + userProfile['location'] + "\"";
            }
            if (languagebase === "true" && userProfile['language']) {
                sql += " and supported.languages=\"" + userProfile['language'] + "\"";
            }
            //company based
            if (companybase === "true" && userProfile['company']) {
                sql += " and supported.companies=\"" + userProfile['company'] + "\"";
            }
            groupValue = endUserChat.getAvailableAssignmentGroup(false, false, null, sql);
        }
        setChatGroupValue(record, groupfieldname, groupValue);
    }

    if (returnCode != null) {
        resultXml[RESULT_ITEM_RETCODE] = returnCode + "";
    } else {
        resultXml[RESULT_ITEM_RETCODE] = "0";
    }

    if (message != null) {
        resultXml[RESULT_ITEM_MSG] = message;
    }

    if (msgType != null) {
        resultXml[RESULT_ITEM_MSGTYPE] = msgType;
    }

    if (cursorPosition != null) {
        resultXml[RESULT_ITEM_CURSOR] = cursorPosition;
    }

    return resultXml;
}

function setChatGroupValue(record, groupfieldname, groupValue) {
    var groupFieldType = funcs.dbdict_helper("field.type", record, groupfieldname);
    if (groupFieldType === 8) {
        var n;
        var lng = record[groupfieldname].length();
        for (n = 0; n < lng; n++) {
            record[groupfieldname] = funcs._delete(record[groupfieldname], 1, 1);
        }
        record[groupfieldname][0] = groupValue;
    } else {
        record[groupfieldname] = funcs.val(groupValue, groupFieldType);
    }
}
/*
 * End for End User Chat Assignment group routing
 */

////----------

function runSetNumber(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();

    result[RESULT_ITEM_MSG] = "";
    result[RESULT_ITEM_CURSOR] = "";

    var field;
    var overwrite;
    var numRecClass;
    if (isJSONFormat) {
        field = rule.fieldName;
        numRecClass = rule.numberRecord;
        overwrite = rule.overwrite;
    } else {
        var smField = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
        field = smField;
        numRecClass = lib.xmlHelpers.getElement(rule, "numberRecord", null).getValue();
        overwrite = lib.xmlHelpers.getElement(rule, "overwrite", null).getValue();
    }
    var value = new SCDatum();
    value.setType(2);

    var rc1;
    var returnCode = 0;

    if (record[field] == null || record[field] == "" || overwrite == "true") {
        var rc = funcs.rtecall("getnumber", rc1, value, numRecClass);
        if (lib.tableFunctions.getFieldType(smField, funcs.filename(record)) == 1) {
            if (value != null && funcs.val(value, 1) == null) {
                returnCode = 1;
                var message = "";
                var cursorPosition = smField;
                var params = new Array(3);
                var caption = getFieldCaption(smField, funcs.filename(record));

                params[0] = caption;
                if (!caption) {
                    params[0] = smField;
                }

                result[RESULT_ITEM_MSG] = funcs.scmsg(50, "ruleset", params);
                result[RESULT_ITEM_CURSOR] = cursorPosition;
                result[RESULT_ITEM_RETCODE] = returnCode + "";
                return result;
            }
        }

        record[field] = value;
    }

    result[RESULT_ITEM_RETCODE] = returnCode + "";
    return result;
}


function evalValue(js, record, oldRecord) {
    var value;
    eval(js);
    return value;
}

/**
 * It is for legacy code with XML result, still keep it in case this method is still be invoked by some other code.
 */
function parseResult(result) {
    vars.$L_result = result.getAttributeValue("returnCode");

    if (vars.$L_result != "0") {
        var message = lib.xmlHelpers.getElement(result, "message", null);
        if (message != null) {
            vars.$L_message = message.getValue();
        }
        var messageType = lib.xmlHelpers.getElement(result, "messageType", null);
        if (messageType != null) {
            vars.$L_msgType = messageType.getValue();
        }
    }

    //dengxin CR97948, for returnCode=0, the cursor also need focus on the field. so copy the cursorField logic out.
    var cursorField = lib.xmlHelpers.getElement(result, "cursorPosition", null);
    if (cursorField != null && cursorField.getValue() != "") {
        vars.$L_cursorField = cursorField.getValue();
    }
}

/**
 * It is for new code with JS object result.
 */
function parseResult2(result) {
    if (result == null) {
        return;
    }

    vars.$L_result = result[RESULT_ITEM_RETCODE];

    if (vars.$L_result != "0") {
        var message = result[RESULT_ITEM_MSG];
        if (message != null && message != "") {
            vars.$L_message = message;
        }
        var messageType = result[RESULT_ITEM_MSGTYPE];
        if (messageType != null && messageType != "") {
            vars.$L_msgType = messageType;
        }
    }

    //dengxin CR97948, for returnCode=0, the cursor also need focus on the field. so copy the cursorField logic out.
    var cursorField = result[RESULT_ITEM_CURSOR];
    if (cursorField != null && cursorField != "") {
        vars.$L_cursorField = cursorField;
    }
}

function runRAD(ruleSetString, record, oldRecord, isJSONFormat) {
    var result = run(ruleSetString, record, oldRecord, isJSONFormat);
    if (result == null) {
        return;
    }

    parseResult2(result);
}

function runValField(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var messageType;
    var cursorPosition;
    var msgType;
    var fieldName;

    if (isJSONFormat) {
        msgType = rule.messageType;
        fieldName = rule.fieldName;
    } else {
        var messageTypeXML = lib.xmlHelpers.getElement(rule, "messageType", null);
        if (messageTypeXML != null) {
            msgType = messageTypeXML.getValue();
        }
        //get the field name
        fieldName = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
    }

    //if the field is null or empty return Pass, the not empty check should be handled by Mandatory Check Rule type
    var fieldValue = record[fieldName];
    if (funcs._null(fieldValue) || fieldValue == "") {
        result[RESULT_ITEM_RETCODE] = "0";
        return result;
    }

    //QCCR1E122997, if the field value is not changed, return true directly
    // dirty data should not be handled here.
    var oldFieldValue = null;
    if (oldRecord != null) {
        oldFieldValue = oldRecord[fieldName];
    }
    if (vars["$L.mode"] !== "add" && funcs.same(fieldValue, oldFieldValue)) {
        // QCCR1E125809, need to check whether always validation is checked for this rule
        var alwaysValidate = false;
        if (isJSONFormat) { // only the json format supports to configure the alwaysValidate in rule
            alwaysValidate = rule.alwaysValidate;
        }
        if (alwaysValidate !== true && alwaysValidate !== "true") {
            result[RESULT_ITEM_RETCODE] = "0";
            return result;
        }
    }

    var toTable;
    var toField;
    var filterStr;

    if (isJSONFormat) {
        toTable = rule.toTable;
        toField = rule.toField;
        filterStr = rule.filter;
    } else {
        //get to table name
        toTable = lib.xmlHelpers.getElement(rule, "toTable", null).getValue();

        //get to field name
        toField = lib.xmlHelpers.getElement(rule, "toField", null).getValue();

        //get filter
        var filter = lib.xmlHelpers.getElement(rule, "filter", null);
        filterStr = "";
        if (filter != null) {
            filterStr = filter.getValue();
        }
    }
    //query for the to table
    var toRecord = new SCFile(toTable, SCFILE_READONLY);

    // set select fields
    //  . set the toField to select fields 
    var selctFields = [toField];
    //  . set the fill from fields to select fileds
    var fieldList;
    var fillFieldIndex;
    if (isJSONFormat) {
        if (rule.fillDataList && rule.fillDataList.length > 0) {
            fieldList = rule.fillDataList;
            fillFieldIndex = 0;
        }
    } else {
        fieldList = lib.xmlHelpers.getElement(rule, "fillDataList", null);
    }
    var fillFromFields = [];
    var fillToFields = [];
    var checkField = null;
    if (fieldList != null) {
        if (isJSONFormat) {
            checkField = fieldList[0];
        } else {
            checkField = fieldList.getFirstChildElement();
        }
        while (checkField != null) {
            var fillFrom;
            if (isJSONFormat) {
                fillFrom = checkField.fillFrom;
            } else {
                fillFrom = lib.xmlHelpers.getElement(checkField, "fillFrom");
            }
            if (fillFrom == null) {
                break;
            }

            var fillTo;
            if (isJSONFormat) {
                fillTo = checkField.fillTo;
            } else {
                fillTo = lib.xmlHelpers.getElement(checkField, "fillTo");
            }
            if (fillTo == null) {
                print(funcs.scmsg(3, "ruleset"));
            }

            if (!isJSONFormat) {
                fillFrom = fillFrom.getValue();
                fillTo = fillTo.getValue();
            }
            fillFromFields.push(fillFrom);
            fillToFields.push(fillTo);

            if (isJSONFormat) {
                fillFieldIndex++;
                checkField = fieldList[fillFieldIndex];
            } else {
                checkField = checkField.getNextSiblingElement();
            }
        }
    }
    var i;
    for (i = 0; i < fillFromFields.length; i++) {
        selctFields.push(fillFromFields[i]);
    }
    // . finally set the var selctFields to select fields
    toRecord.setFields(selctFields);

    var sql;
    var rc;
    var toRecordValue;
    var rcHasNext;

    //evaluates if the field to compare to the table is an array or not 
    if (funcs.type(fieldValue) != 8) {
        if (typeof(fieldValue) == "string") {
            sql = toField + "=\"" + fieldValue + "\"";
        } else {
            sql = toField + "=" + fieldValue;
        }

        //appends the filter if there is one.
        if (filterStr != null && filterStr != "") {
            sql += " and (" + filterStr + ")";
        }

        rc = toRecord.doSelect(sql);

        if (rc == RC_SUCCESS) {
            toRecordValue = toRecord[toField];
            rcHasNext = toRecord.getNext();
            if (rcHasNext != RC_SUCCESS && funcs.type(fieldValue) == funcs.type(toRecordValue) && fieldValue != toRecordValue) {
                vars.$L_file[fieldName] = toRecordValue;
            }
            if (rcHasNext == RC_SUCCESS) {
                log.warn("Too many records found for \"" + toField + "\" field in table \"" + toTable + "\" with sql:" + sql + ", based on filter in the rule, filter:" + filterStr);
            }
        }
    } else {
        fieldValue = funcs.denull(fieldValue);
        fieldValue = removeNullElementFromArray(fieldValue);
        var iLoopTimes = fieldValue.length();
        for (i = 0; i < iLoopTimes; i++) {
            //verifies if it is an array of characters or numbers 
            //before creating the sql expression
            if (typeof(fieldValue[i]) == "string") {
                sql = toField + "=\"" + fieldValue[i] + "\"";
            } else {
                sql = toField + "=" + fieldValue[i];
            }

            //appends the filter if there is one.
            if (filterStr != null && filterStr != "") {
                sql += " and (" + filterStr + ")";
            }

            rc = toRecord.doSelect(sql);

            if (rc != RC_SUCCESS) {
                break;
            }

            if (rc == RC_SUCCESS) {
                toRecordValue = toRecord[toField];
                rcHasNext = toRecord.getNext();
                if (rcHasNext != RC_SUCCESS && funcs.type(fieldValue[i]) == funcs.type(toRecordValue) && fieldValue[i] != toRecordValue) {
                    vars.$L_file[fieldName][i] = toRecordValue;
                }
                if (rcHasNext == RC_SUCCESS) {
                    log.warn("Too many records found for \"" + toField + "\" field in table \"" + toTable + "\" with sql:" + sql + ", based on filter in the rule, filter:" + filterStr);
                }
            }
        }
    }

    //if the field is not found, set return value to false
    if (rc != RC_SUCCESS) {
        result[RESULT_ITEM_RETCODE] = "1";

        var smField = fieldName.replace(/_/g, ".");
        var caption = getFieldCaption(smField, funcs.filename(record));
        var params = [caption];
        if (!caption) {
            params[0] = smField;
        }
        result[RESULT_ITEM_MSG] = funcs.scmsg(2, "ruleset", params);

        if (msgType != null) {
            result[RESULT_ITEM_MSGTYPE] = msgType;
        }

        result[RESULT_ITEM_CURSOR] = smField;
        return result;
    }

    //set the return code to 0
    result[RESULT_ITEM_RETCODE] = "0";

    //get fill data
    for (i = 0; i < fillFromFields.length; i++) {
        record[fillToFields[i]] = toRecord[fillFromFields[i]];
    }

    return result;
}

function removeNullElementFromArray(arrayValue) {
    var i;
    for (i = arrayValue.length() - 1; i >= 0; i--) {
        if (null === arrayValue[i] || "" === arrayValue[i]) {
            arrayValue = funcs._delete(arrayValue, i + 1);
        }
    }

    return arrayValue;
}

function runValList(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var messageType;
    var cursorPosition;
    var msgType;
    var fieldName;

    if (isJSONFormat) {
        msgType = rule.messageType;
        fieldName = rule.fieldName;
    } else {
        var messageTypeXML = lib.xmlHelpers.getElement(rule, "messageType", null);
        if (messageTypeXML != null) {
            msgType = messageTypeXML.getValue();
        }
        //get the field name
        fieldName = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
    }

    var smField;
    var caption;
    var params;

    //if the field is null or empty return
    var fieldValue = record[fieldName];

    if (funcs._null(fieldValue) || fieldValue == "") {
        result[RESULT_ITEM_RETCODE] = "1";

        smField = fieldName.replace(/_/g, ".");
        caption = getFieldCaption(smField, funcs.filename(record));
        params = new Array(3);
        params[0] = caption;
        if (!caption) {
            params[0] = smField;
        }
        result[RESULT_ITEM_MSG] = funcs.scmsg(2, "ruleset", params);

        if (msgType != null) {
            result[RESULT_ITEM_MSGTYPE] = msgType;
        }

        result[RESULT_ITEM_CURSOR] = smField;
        return result;
    }

    //get to list 
    var toList;
    var toGlobal;
    if (isJSONFormat) {
        toList = rule.toList;
        toGlobal = rule.toGlobal;
    } else {
        toList = lib.xmlHelpers.getElement(rule, "toList", null).getValue();

        //get to list name
        toGlobal = lib.xmlHelpers.getElement(rule, "toGlobal", null).getValue();
    }

    var i;
    var iLoopTimes;

    //query for the Global list
    if (toList == "Global List") {

        var gl = new SCFile("globallists", SCFILE_READONLY);
        var sql = "name=\"" + toGlobal + "\"";
        var rc = gl.doSelect(sql);
        var rc1;

        if (rc == RC_SUCCESS) {

            var temp_string = gl.value_list.toString();
            var temp_array = new Datum();
            temp_array.setType(8);

            temp_array = funcs.val(gl.value_list, 8);

            if (funcs.type(fieldValue) != 8) {
                rc1 = funcs.index(fieldValue, temp_array);
            } else {
                fieldValue = funcs.denull(fieldValue);
                iLoopTimes = fieldValue.length();
                for (i = 0; i < iLoopTimes; i++) {
                    rc1 = funcs.index(fieldValue[i], temp_array);
                    if (rc1 == 0) {
                        break;
                    }
                }
            }
            if (rc1 > 0) {
                rc1 = RC_SUCCESS;

                //set the return code to 0
                result[RESULT_ITEM_RETCODE] = "0";

                return result;
            }
        }
    } else {
        //query for Manual List

        var y = 0;
        var temp_string2 = [];

        if (isJSONFormat) {
            if (rule.manualList != null) {
                temp_string2 = rule.manualList;
            }
        } else {
            var List = lib.xmlHelpers.getElement(rule, "manualList", null);

            if (List != null) {
                var rc2 = RC_ERROR;
                var checkList = List.getFirstChildElement();

                do {
                    if (checkList == null) {
                        break;
                    }

                    var toManual = checkList.getValue();

                    temp_string2[y] = toManual;
                    y++;
                    checkList = checkList.getNextSiblingElement();

                }
                while (checkList != null);
            }
        }

        var temp_array2 = new Datum();
        temp_array2.setType(8);

        temp_array2 = funcs.val(temp_string2, 8);
        if (funcs.type(fieldValue) != 8) {
            rc2 = funcs.index(fieldValue, temp_array2);
        } else {
            fieldValue = funcs.denull(fieldValue);

            iLoopTimes = fieldValue.length();
            for (i = 0; i < iLoopTimes; i++) {
                rc2 = funcs.index(fieldValue[i], temp_array2);
                if (rc2 == 0) {
                    break;
                }
            }
        }

        if (rc2 > 0) {
            rc2 = RC_SUCCESS;

            //set the return code to 0
            result[RESULT_ITEM_RETCODE] = "0";

            return result;
        }

    }

    //if the field is not found, set return value to false
    if (rc1 != RC_SUCCESS || rc2 != RC_SUCCESS) {

        result[RESULT_ITEM_RETCODE] = "1";

        smField = fieldName.replace(/_/g, ".");
        caption = getFieldCaption(smField, funcs.filename(record));
        params = new Array(3);
        params[0] = caption;
        if (!caption) {
            params[0] = smField;
        }
        result[RESULT_ITEM_MSG] = funcs.scmsg(2, "ruleset", params);

        if (msgType != null) {
            result[RESULT_ITEM_MSGTYPE] = msgType;
        }

        result[RESULT_ITEM_CURSOR] = smField;
        return result;
    }
}


function runValDate(rule, record, oldRecord, isJSONFormat) {
    var result = initResult();
    var message;
    var messageType;
    var cursorPosition;
    var tempMsgStr;

    var msgType;
    var fieldName;
    if (isJSONFormat) {
        msgType = rule.messageType;
        fieldName = rule.fieldName;
    } else {
        var messageTypeXML = lib.xmlHelpers.getElement(rule, "messageType", null);
        if (messageTypeXML != null) {
            msgType = messageTypeXML.getValue();
        }

        fieldName = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
    }

    var val1 = record[fieldName];
    if (val1 == null) {
        result[RESULT_ITEM_RETCODE] = "0";
        return result;
    }

    var comparison;
    var not;
    if (isJSONFormat) {
        comparison = rule.comparison;
        not = rule.comparison.not;
    } else {
        var comparisonXML = lib.xmlHelpers.getElement(rule, "comparison", null);
        var notXML = comparisonXML.getFirstChildElement();
        not = notXML.getValue();
    }
    if (not == "true") {
        not = "!";
    } else {
        not = "";
    }

    var operator;
    var rangeType;
    if (isJSONFormat) {
        operator = rule.comparison.operator;
        rangeType = rule.rangeType;
    } else {
        var operatorXML = notXML.getNextSiblingElement();
        operator = operatorXML.getValue();
        rangeType = lib.xmlHelpers.getElement(rule, "rangeType", null).getValue();
    }

    var smField = fieldName.replace(/_/g, ".");
    var caption = getFieldCaption(smField, funcs.filename(record));
    var params = new Array(3);
    params[0] = caption;
    if (!caption) {
        params[0] = smField;
    }

    var messageText;
    var val2;
    var val3;

    switch (rangeType) {
        case "Field":
            var compareField1;
            var offset1;
            var daysValue1;
            var hoursValue1;
            var minutesValue1;

            var compareField2;
            var offset2;
            var daysValue2;
            var hoursValue2;
            var minutesValue2;

            if (isJSONFormat) {
                var compareField = rule.compareField;
                compareField1 = compareField.cField1;
                offset1 = compareField.offset1;
                daysValue1 = compareField.days1;
                hoursValue1 = compareField.hours1;
                minutesValue1 = compareField.mins1;
                compareField2 = compareField.cField2;
                offset2 = compareField.offset2;
                daysValue2 = compareField.days2;
                hoursValue2 = compareField.hours2;
                minutesValue2 = compareField.mins2;
            } else {
                var compareFieldXML = lib.xmlHelpers.getElement(rule, "compareField", null);
                var compareField1XML = compareFieldXML.getFirstChildElement();
                compareField1 = compareField1XML.getValue();
                var offset1XML = compareField1XML.getNextSiblingElement();
                offset1 = offset1XML.getValue();
                var daysValue1XML = offset1XML.getNextSiblingElement();
                daysValue1 = daysValue1XML.getValue();
                var hoursValue1XML = daysValue1XML.getNextSiblingElement();
                hoursValue1 = hoursValue1XML.getValue();
                var minutesValue1XML = hoursValue1XML.getNextSiblingElement();
                minutesValue1 = minutesValue1XML.getValue();
                var compareField2XML = minutesValue1XML.getNextSiblingElement();
                compareField2 = compareField2XML.getValue();
                var offset2XML = compareField2XML.getNextSiblingElement();
                offset2 = offset2XML.getValue();
                var daysValue2XML = offset2XML.getNextSiblingElement();
                daysValue2 = daysValue2XML.getValue();
                var hoursValue2XML = daysValue2XML.getNextSiblingElement();
                hoursValue2 = hoursValue2XML.getValue();
                var minutesValue2XML = hoursValue2XML.getNextSiblingElement();
                minutesValue2 = minutesValue2XML.getValue();
            }

            if (compareField1 != "" && compareField1 != null) {
                if (compareField1 == "[Current Date/Time]") {
                    val2 = funcs.tod();
                } else {
                    val2 = record[compareField1];
                }
                if (val2 != "" && val2 != null) {
                    var val2Offset = (daysValue1 * 24 * 60 * 60 * 1000) + (hoursValue1 * 60 * 60 * 1000) + (minutesValue1 * 60 * 1000);
                    if (offset1 == "-") {
                        val2Offset = -1 * val2Offset;
                    }
                }
                // QCCR69605 - Displays Wrong Error message when checking Validate Date Rule while leaving Relative Date/Time field blank
                // If the comparison date is null, the rule should not run.
                // If the user wants to enforce the logic, they need to use a mandatory rule.
                else {
                    result[RESULT_ITEM_RETCODE] = "0";
                    return result;
                }
            }

            if (compareField2 != "" && compareField2 != null) {
                if (compareField2 == "[Current Date/Time]") {
                    val3 = funcs.tod();
                } else {
                    val3 = record[compareField2];
                }
                var val3Offset = (daysValue2 * 24 * 60 * 60 * 1000) + (hoursValue2 * 60 * 60 * 1000) + (minutesValue2 * 60 * 1000);
                if (offset2 == "-") {
                    val3Offset = -1 * val3Offset;
                }
            }

            tempMsgStr = setDateMsgParam(val1, val2 - (-1 * val2Offset), val3 - (-1 * val3Offset), val2, val3, operator);

            if (tempMsgStr == "Date/Time" || tempMsgStr == "Duration" || tempMsgStr == "Mismatch") {
                if (tempMsgStr == "Mismatch") {
                    messageText = funcs.scmsg(54, "ruleset");
                } else {
                    params[1] = funcs.scmsg(getFieldTypeMessageNumber(tempMsgStr), "ruleset");
                    messageText = funcs.scmsg(53, "ruleset", params);
                }
                result[RESULT_ITEM_MSG] = messageText;

                if (msgType != null) {
                    result[RESULT_ITEM_MSGTYPE] = msgType;
                }

                result[RESULT_ITEM_CURSOR] = smField;

                result[RESULT_ITEM_RETCODE] = "1";
                return result;
            }

            if (dateCompare((val1 - val1 % 100), (val2 - val2 % 100 - (-val2Offset)), (val3 - val3 % 100 - (-val3Offset)), not, operator) == 1) {

                params[1] = tempMsgStr;
                if (not == "!") {
                    messageText = funcs.scmsg(51, "ruleset", params);
                } else {
                    messageText = funcs.scmsg(43, "ruleset", params);
                }
                result[RESULT_ITEM_MSG] = messageText;
                if (msgType != null) {
                    result[RESULT_ITEM_MSGTYPE] = msgType;
                }
                result[RESULT_ITEM_CURSOR] = smField;

                result[RESULT_ITEM_RETCODE] = "1";
                return result;
            }

            result[RESULT_ITEM_RETCODE] = "0";
            return result;

        case "Date/Time":
            var dateValue1;
            var dateValue2;
            if (isJSONFormat) {
                dateValue1 = rule.dateValue.dateValue1;
                dateValue2 = rule.dateValue.dateValue2;
            } else {
                var dateValueXML = lib.xmlHelpers.getElement(rule, "dateValue", null);
                var dateValue1XML = dateValueXML.getFirstChildElement();
                dateValue1 = dateValue1XML.getValue();
                var dateValue2XML = dateValue1XML.getNextSiblingElement();
                dateValue2 = dateValue2XML.getValue();
            }
            if (dateValue1 != "" && dateValue1 != null) {
                val2 = funcs.val(dateValue1, 3);
            }
            if (dateValue2 != "" && dateValue2 != null) {
                val3 = funcs.val(dateValue2, 3);
            }

            tempMsgStr = setDateMsgParam(val1, val2, val3, dateValue1, dateValue2, operator);

            if (tempMsgStr == "Date/Time" || tempMsgStr == "Duration") {
                params[1] = funcs.scmsg(getFieldTypeMessageNumber(tempMsgStr), "ruleset");

                result[RESULT_ITEM_MSG] = funcs.scmsg(53, "ruleset", params);

                if (msgType != null) {
                    result[RESULT_ITEM_MSGTYPE] = msgType;
                }

                result[RESULT_ITEM_CURSOR] = smField;

                result[RESULT_ITEM_RETCODE] = "1";
                return result;
            }

            if (dateCompare((val1 - val1 % 100), (val2 - val2 % 100), (val3 - val3 % 100), not, operator) == 1) {

                params[1] = tempMsgStr;
                if (not == "!") {
                    messageText = funcs.scmsg(51, "ruleset", params);
                } else {
                    messageText = funcs.scmsg(43, "ruleset", params);
                }

                result[RESULT_ITEM_MSG] = messageText;

                if (msgType != null) {
                    result[RESULT_ITEM_MSGTYPE] = msgType;
                }

                result[RESULT_ITEM_CURSOR] = smField;

                result[RESULT_ITEM_RETCODE] = "1";
                return result;
            }

            result[RESULT_ITEM_RETCODE] = "0";
            return result;
    }

    result[RESULT_ITEM_RETCODE] = "0";
    return result;
}

function setDateMsgParam(val1, val2, val3, origVal1, origVal2, operator) {

    var tempMsgStr;
    var dVal1 = new Date();
    dVal1.setTime(val1);
    var xdVal1 = new XMLDate(dVal1);

    var dVal2 = new Date();
    dVal2.setTime(val2);
    var xdVal2 = new XMLDate(dVal2);

    var dVal3 = new Date();
    dVal3.setTime(val3);
    var xdVal3 = new XMLDate(dVal3);

    if (xdVal1.toSCDuration() != "<null>") {
        if (xdVal2.toSCDuration() != "<null>") {
            tempMsgStr = getOperatorDisplayValue(operator) + " " + xdVal2.toSCDuration();
            if (origVal2 != null && origVal2 != "" && xdVal3.toSCDuration() != "<null>") {
                tempMsgStr = tempMsgStr + " and " + xdVal3.toSCDuration();
            }
            if (origVal2 != null && origVal2 != "" && xdVal3.toSCDuration() == "<null>") {
                tempMsgStr = "Mismatch";
            }

        } else {
            tempMsgStr = "Date/Time";
        }

    } else {
        if (xdVal2.toSCDuration() == "<null>") {
            tempMsgStr = getOperatorDisplayValue(operator) + " " + funcs.str(xdVal2.getDate());
            if (origVal2 != null && origVal2 != "" && xdVal3.toSCDuration() == "<null>") {
                tempMsgStr = tempMsgStr + " and " + funcs.str(xdVal3.getDate());
            }
            if (origVal2 != null && origVal2 != "" && xdVal3.toSCDuration() != "<null>") {
                tempMsgStr = "Mismatch";
            }
        } else {
            tempMsgStr = "Duration";
        }
    }

    return tempMsgStr;
}

/**
 * Return the display value of operator from the globallist
 */
function getOperatorDisplayValue(operator) {
    var index = lib.ArrayUtil.indexOf(vars.$G_ruleset_operator_list, operator);

    if (index >= 0) {
        return vars.$G_ruleset_operator_disp[index];
    }

    return operator.toLowerCase();
}

function dateCompare(val1, val2, val3, not, operator) {
    try {
        switch (operator) {
            case "Equal To":
                if (eval(not + "(val1 == val2)")) {
                    return 0;
                } else {
                    return 1;
                }

            case "Less Than Or Equal To":
                if (eval(not + "(val1 <= val2)")) {
                    return 0;
                } else {
                    return 1;
                }

            case "Greater Than Or Equal To":
                if (eval(not + "(val1 >= val2)")) {
                    return 0;
                } else {
                    return 1;
                }

            case "Between":
                if (eval(not + "((val1 >= val2) && (val1 <= val3))")) {
                    return 0;
                } else {
                    return 1;
                }
        }
    } catch (e) {
        var msg = funcs.scmsg(206, "ruleset");
        printRuleError(msg, e);
        return 1;
    }
}

/** This function returns the element value specified by the element field Id of the rule depending on whether 
 * the rule information is saved as xml or json. 
 *
 *  @param  {XML or JSON} Rule    - the object that contains rule information
 *   @param     {String} id - The id of the rule field to be returned.
 *   @param     {Boolean} isJsonFormat - the flag to indicate whether rule is saved as json format
 *  @return The value of the rule field 
 *   @type  String
 */
function getRuleFieldValue(rule, id, isJsonFormat) {

    if (isJsonFormat) {
        return rule[id];
    }

    var element = lib.xmlHelpers.getElement(rule, id, null);
    if (element != null) {
        return element.getValue();
    }

    return null;
}


/**
 * The json format of the rule:
 * {
 *   "type": "sendTeamsMessage",
 *   "tempName": "xx",
 *   "recipient": "Users/Group",
 *   "userList": {
 *       "sendTo": "operator/contacts"
 *       "user": []
 *   },
 *   "group": {
 *       "type",
 *       "sendTo",
 *       "value"
 *   },
 *   "field": {
 *       "value",
 *       "type"
 *   }
 * }
 */
function runSendTeamsMessage(rule, record, oldRecord) {
    var result = initResult();

    // ruleset succeed always even message not send, e.g. no teams integration 
    result[RESULT_ITEM_RETCODE] = "0";

    if (rule == null || record == null) {
        result[RESULT_ITEM_MSG] = funcs.scmsg(35, "scev");
        return result;
    }

    var errorMsg;

    // send to users
    var users = lib.RuleWizardHelpers.getRecipientList(JSON.stringify(rule), record, true, template);
    if (users) {
        users = lib.ArrayUtil.toJsArray(users);
    }
    if (!users || users.length == 0) {
        errorMsg = funcs.scmsg("401", "us");
        funcs.msg(errorMsg, 2);
        result[RESULT_ITEM_MSG] = errorMsg;
        return result;
    }

    // message template
    var template = rule.tempName;
    var lang = lib.NotificationRecipientsHelp.determinLang(users);
    var message = lib.MicrosoftTeamsTemplate.generateMessageFromTemplate(template, record, null, lang);
    if (!message) {
        errorMsg = funcs.scmsg("27", "msteams");
        funcs.msg(errorMsg, 2);
        result[RESULT_ITEM_MSG] = errorMsg;
        return result;
    }

    // send to teams conversation 
    var key = record.getUniqueFields()[0];
    var fileId = record[key];
    lib.MicrosoftTeamsNotification.sendNotifications(users, message, fileId);

    return result;
}


/**
 * get field caption of table, the table may be a joindef table
 *
 * @param {String} field
 * @param {String} table
 * @returns {String}
 */
function getFieldCaption(field, table) {
    if (!table) {
        return field;
    }

    // check joindef first
    var joins = funcs.dbdict_helper("joinfile.names", table);
    if (joins) {
        var i;
        var length = joins.length();
        for (i = 0; i < length; i++) {
            var caption = funcs.get_field_caption(field, joins[i]);
            if (caption) {
                return caption;
            }
        }
    }

    return funcs.get_field_caption(field, table);
}

/**
 * @param {string} type: field type, example: Date/Time, Duration
 * @returns {string}: FIELD_TYPE_<Upper field type> prefix
 *                    example: FIELD_TYPE_DATETIME, FIELD_TYPE_DURATION
 */
function getFieldTypeMessageNumber(type) {
    type = type.toUpperCase().replace("/", "");
    return "FIELD_TYPE_" + type;
}