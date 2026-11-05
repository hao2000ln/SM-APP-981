var RESULT_ITEM_RETCODE = "returnCode";
var RESULT_ITEM_MSG = "message";
var RESULT_ITEM_MSGTYPE = "messageType";
var RESULT_ITEM_CURSOR = "cursorPosition";
var RESULT_ITEM_VALUE = "value";

var getFieldCaption = lib.RuleEngine.getFieldCaption;


function getType(ruleString) {
    return lib.RuleEngine.getType(ruleString);
}

function setRuleXML(ruleSet, position, type) {
    return lib.RuleEngine.setRuleXML(ruleSet, position, type);
}

function run(ruleSetString, record, oldRecord, isJSONFormat) {
    var result = lib.RuleEngine.initResult();
    const VALRANGE = "validateRange";
    var type;

    if (!isJSONFormat) {
        var ruleSet = new XML();
        var rule;

        if (ruleSet.setContent(ruleSetString)) {
            var parent = ruleSet.getDocumentElement();
            rule = parent.getFirstChildElement();

            while (rule != null) {
                type = rule.getName();
                switch (type) {
                    case VALRANGE:
                        result = runValRange(rule, record, oldRecord);
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
        switch (type) {
            case VALRANGE:
                result = runValRange(jsonObj, record, oldRecord, true);
                break;
        }
    }

    return result;
}

/**
 * It is for legacy code with XML result, still keep it in case this method is still be invoked by some other code.
 */
function parseResult(result) {
    lib.RuleEngine.parseResult();
}

function runRAD(ruleSetString, record, oldRecord, isJSONFormat) {
    var result = run(ruleSetString, record, oldRecord, isJSONFormat);
    if (result == null) {
        return;
    }
    lib.RuleEngine.parseResult2(result);
}


//This function is used to validate a field against a range of text or range of numbers.

function runValRange(rule, record, oldRecord, isJSONFormat) {
    var result = lib.RuleEngine.initResult();

    var cursorPosition;
    var tempMsgStr;
    var invalid = false;
    var tablename = funcs.filename(record);

    var msgType;
    if (isJSONFormat) {
        msgType = rule.messageType;
    } else {
        var messageTypeXML = lib.xmlHelpers.getElement(rule, "messageType", null);
        if (messageTypeXML != null) {
            msgType = messageTypeXML.getValue();
        }
    }

    var fieldName;
    if (isJSONFormat) {
        fieldName = rule.fieldName;
    } else {
        fieldName = lib.xmlHelpers.getElement(rule, "fieldName", null).getValue();
    }
    var dtype = lib.tableFunctions.getFieldType(fieldName, tablename, false);

    if (record[fieldName] == null) {
        result[RESULT_ITEM_RETCODE] = "0";
        return result;
    }

    var val1 = record[fieldName].toString();

    var not;
    var operator;
    if (isJSONFormat) {
        if (rule.comparison) {
            not = rule.comparison.not;
            operator = rule.comparison.operator;
        }
    } else {
        var comparisonXML = lib.xmlHelpers.getElement(rule, "comparison", null);
        var notXML = comparisonXML.getFirstChildElement();
        not = notXML.getValue();

        var operatorXML = notXML.getNextSiblingElement();
        operator = operatorXML.getValue();
    }

    if (not == "true") {
        not = "!";
    } else {
        not = "";
    }

    var rangeType;
    if (isJSONFormat) {
        rangeType = rule.rangeType;
    } else {
        rangeType = lib.xmlHelpers.getElement(rule, "rangeType", null).getValue();
    }

    var caption1 = getFieldCaption(fieldName, tablename);
    var params = new Array(3);

    var val2;
    var val3;
    var temp;

    switch (rangeType) {
        case "Field":
            var compareField1;
            var compareField2;
            if (isJSONFormat) {
                if (rule.compareField) {
                    compareField1 = rule.compareField.cField1;
                    compareField2 = rule.compareField.cField2;
                }
            } else {
                var compareFieldXML = lib.xmlHelpers.getElement(rule, "compareField", null);
                var compareField1XML = compareFieldXML.getFirstChildElement();
                compareField1 = compareField1XML.getValue();
                var compareField2XML = compareField1XML.getNextSiblingElement();
                compareField2 = compareField2XML.getValue();
            }

            if (compareField1 != "" && compareField1 != null) {
                val2 = funcs.val(record[compareField1], 2);
            }

            if (compareField2 != "" && compareField2 != null) {
                val3 = funcs.val(record[compareField2], 2);
            }

            if (val2 == null || val2 == "") {
                params[0] = getFieldCaption(compareField1, tablename);
                params[1] = getFieldCaption(fieldName, tablename);
                return getReturnMsgXML(params, 60, "ruleset", msgType, compareField1);
            }
            if (operator == "Between" && (val3 == null || val3 == "")) {
                params[0] = getFieldCaption(compareField2, tablename);
                params[1] = getFieldCaption(fieldName, tablename);
                return getReturnMsgXML(params, 60, "ruleset", msgType, compareField2);
            }

            if (dtype == 1) {
                if (funcs.val(val2, 1) == null) {
                    params[0] = val1;
                    params[1] = val2;
                    return getReturnMsgXML(params, 57, "ruleset", msgType, compareField1);
                }
                if (operator == "Between" && funcs.val(val3, 1) == null) {
                    params[0] = val1;
                    params[1] = val3;
                    return getReturnMsgXML(params, 57, "ruleset", msgType, compareField2);
                }
            }

            tempMsgStr = getRangeMsgParam(val1, val2, val3, operator);

            if (operator == "Between" && val2 > val3) {
                temp = val2;
                val2 = val3;
                val3 = temp;
            }

            if (rangeCompare(val1, val2, val3, not, operator, dtype) == 1) {
                params[0] = getFieldCaption(fieldName, tablename);
                params[1] = tempMsgStr;
                if (not == "!") {
                    return getReturnMsgXML(params, 51, "ruleset", msgType, fieldName);
                } else {
                    return getReturnMsgXML(params, 43, "ruleset", msgType, fieldName);
                }
            }
            result[RESULT_ITEM_RETCODE] = "0";
            return result;

        case "Text/Num":
            if (isJSONFormat) {
                if (rule.value) {
                    val2 = rule.value.value1;
                    val3 = rule.value.value2;
                }
            } else {
                var valueXML = lib.xmlHelpers.getElement(rule, "value", null);
                var value1XML = valueXML.getFirstChildElement();
                val2 = "" + value1XML.getValue();
                var value2XML = value1XML.getNextSiblingElement();
                val3 = "" + value2XML.getValue();
            }

            if (val1 == null || val1 == "") {
                params[0] = getFieldCaption(fieldName, tablename);
                return getReturnMsgXML(params, 1, "ruleset", msgType, fieldName);
            }

            tempMsgStr = getRangeMsgParam(val1, val2, val3, operator);

            if (funcs.rtecall("isnumeric", vars.$rc, val2)) {
                val2 = parseFloat(val2);
            }
            if (funcs.rtecall("isnumeric", vars.$rc, val3)) {
                val3 = parseFloat(val3);
            }

            if (operator == "Between" && val2 > val3) {
                temp = val2;
                val2 = val3;
                val3 = temp;
            }

            if (rangeCompare(val1, val2, val3, not, operator, dtype) == 1) {
                params[0] = getFieldCaption(fieldName, tablename);
                params[1] = tempMsgStr;
                if (not == "!") {
                    return getReturnMsgXML(params, 51, "ruleset", msgType, fieldName);
                } else {
                    return getReturnMsgXML(params, 43, "ruleset", msgType, fieldName);
                }
            }

            result[RESULT_ITEM_RETCODE] = "0";
            return result;
    }

}


function getReturnMsgXML(params, msgid, msgclass, msgType, cursorField) {
    var result = lib.RuleEngine.initResult();
    result[RESULT_ITEM_MSG] = "";

    var messageText = funcs.scmsg(msgid, msgclass, params);
    messageText = formatMessage(messageText);
    result[RESULT_ITEM_MSG] = messageText;

    if (msgType != null) {
        result[RESULT_ITEM_MSGTYPE] = msgType;
    }
    result[RESULT_ITEM_CURSOR] = cursorField;

    result[RESULT_ITEM_RETCODE] = "1";
    return result;
}

function formatMessage(msg) {
    msg = msg.replace(/Less Than Or Equal To/g, "less than or equal to");
    msg = msg.replace(/Greater Than Or Equal To/g, "greater than or equal to");
    msg = msg.replace(/Equal To/g, "equal to");
    msg = msg.replace(/Between/g, "between");
    return msg;
}

function getRangeMsgParam(val1, val2, val3, operator) {
    var tempMsgStr = lib.RuleEngine.getOperatorDisplayValue(operator) + " " + val2;

    if (val2 != null && val2 != "" && val3 != null && val3 != "") {
        tempMsgStr = tempMsgStr + " and " + val3;
    }
    return tempMsgStr;
}

function rangeCompare(val1, val2, val3, not, operator, type) {
    if (type == 1) {
        val1 = funcs.val(val1, 1);
        val2 = funcs.val(val2, 1);
        val3 = funcs.val(val3, 1);
    }

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
                var res1 = val1 >= val2;
                var res2 = res1 && (val1 <= val3);
                if (eval(not + "res2")) {
                    return 0;
                } else {
                    return 1;
                }
        }
    } catch (e) {
        var msg = funcs.scmsg(206, "ruleset");
        lib.RuleEngine.printRuleError(msg, e);
        return 1;
    }
}