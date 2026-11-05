var $ = lib.c.$;
var _ = lib.Underscore.require();

var getElement = lib.xmlHelpers.getElement;


function getRadQueryFromCondtionXml(conditionXml) {
    //if condition is empty, return true
    if (conditionXml == null || conditionXml == "") {
        return [true, "Always"];
    }

    //get root children
    conditionXml = parseXmlString(conditionXml);
    var xmlObject = new XML();
    try {
        xmlObject.setContent(conditionXml);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return [false, "Never"];
    }

    try {
        var xml = xmlObject.getDocumentElement();
        var description = ""; //  This will hold the English description of the condition
        var finalCondition = "";
        var element = xml.getFirstChildElement();
        var array = [];
        if (element.getName() == "condition") {
            array = getRadQueryFromCondtion(element, true, finalCondition, description);
            finalCondition = array[0];
            description = array[1];
        } else if (element.getName() == "collection") {
            array = getRadQueryFromCollection(element, true, finalCondition, description);
            finalCondition = array[0];
            description = array[1];
        } else if (element.getName() == "never") {
            return [false, "Never"];
        } else {
            print("unable to parse, this xml string does not contain either a condition or a collection element");
            return [false, "Never"];
        }

        //walk through all children and generate query	
        do {
            element = element.getNextSiblingElement();
            if (element == null) {
                break;
            }

            if (element.getName() == "condition") {
                array = getRadQueryFromCondtion(element, false, finalCondition, description);
                finalCondition = array[0];
                description = array[1];
            } else if (element.getName() == "collection") {
                array = getRadQueryFromCollection(element, false, finalCondition, description);
            }
            finalCondition = array[0];
            description = array[1];
        } while (true);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return [false, "Never"];
    }

    return [finalCondition, description];
}

function getDescriptionFromConditionXml(query) {
    return lib.descriptionGenerator.getDescription(query);
}

function getRadQueryFromCondtion(element, isFirstElement, finalQuery, finalDescription) {
    var query = finalQuery;
    var description = finalDescription;
    if (description == null || description == undefined) {
        description = "";
    }

    if (isFirstElement != true) {
        isFirstElement = false;
    }

    var logical = element.getAttributeValue("logical");
    var negate = element.getAttributeValue("negate");

    if (logical == null || logical.length == 0) {
        logical = "and";
    }

    //only put and or if this is not first element	
    if (!isFirstElement) {
        query += " " + logical;
        description += " " + logical;
    }
    if (negate != null && negate.length != 0) {
        if (negate == "true") {
            query += " not";
            description += " not";
        }
    }

    //get operand node
    var field = "";
    var desc = "";
    var variable = "";
    var array = [];
    var comparison;
    var value;
    var type;

    var operand = getElement(element, "operand", null);
    if (operand != null) {
        type = operand.getAttributeValue("type");
    }

    if (type == "field") {
        array = processOperandForField(operand);
    } else if (type == "crosstablefield") {
        array = processOperandForCrossTableField(operand);
    } else if (type == "variable") {
        array = processOperandForVariable(operand);
    } else if (type == "useroption") {
        array = processOperandForUseroption(operand);
    } else if (type == "security") {
        array = processOperandForSecurity(operand);
    } else if (type == "expression") {
        return processOperandForExpression(operand, finalQuery, finalDescription);
    } else if (type == "authorization") {
        comparison = getComparison(getElement(element, "Comparison", null).getValue());
        value = getElement(element, "Value", null);
        return processOperandForAuth(operand, query, description, comparison, value);
    }

    //next get comparison
    comparison = getComparison(getElement(element, "Comparison", null).getValue());

    var temp;

    //next get value and data type
    value = getElement(element, "Value", null);
    var valueType = value.getAttributeValue("type");

    if (valueType == null || valueType == "") {

        var dataType = value.getAttributeValue("dataType");
        if (dataType == null || dataType == "") {
            dataType = "string";
        }
        var stringValue = getValue(value.getValue(), dataType);
        if (comparison[0] != "isin") {
            if ((stringValue == "NULL" || stringValue == "'NULL'") && (comparison[0] == "~=" || comparison[0] == "=")) {
                if (comparison[0] == "~=") {
                    query += " not same(" + array[0] + ",NULL)";
                } else {
                    query += " same(" + array[0] + ",NULL)";
                }
            } else {
                if (comparison[0] == "~=") {
                    query += " not same(" + array[0] + "," + stringValue + ") ";
                } else {
                    query += array[0] + comparison[0] + stringValue;
                }
            }

            temp = array[1] + comparison[1] + stringValue;
            description += temp;
        } else {
            query += "index(" + stringValue + "," + array[0] + ")>0";
            temp = array[1] + " contains " + stringValue;
            description += temp;
        }
    } else {
        var valueArray = [];
        if (valueType == "field") {
            valueArray = processOperandForField(value);
        } else if (valueType == "crosstablefield") {
            valueArray = processOperandForCrossTableField(value);
        } else if (valueType == "variable") {
            valueArray = processOperandForVariable(value);
        } else if (valueType == "useroption") {
            valueArray = processOperandForUseroption(value);
        } else if (valueType == "security") {
            valueArray = processOperandForSecurity(value);
        } else if (valueType == "expression") {
            return processOperandForExpression(operand, finalDescription);
        } else {
            print("type " + valueType + " is not supported");
        }

        if (comparison != "isin") {
            if (comparison[0] == "~=") {
                query += " not same(" + array[0] + "," + valueArray[0] + ") ";
            } else {
                query += array[0] + comparison[0] + valueArray[0];
            }
            temp = array[1] + comparison[1] + valueArray[1];
            description += temp;
        } else {
            query += "index(" + valueArray[0] + "," + array[0] + ")>0";
            description += valueArray[1] + " contains " + array[1];
        }
    }

    return [query, description];
}

function getRadQueryFromCollection(collectionNode, isFirstElement, finalCondition, description) {
    if (isFirstElement != true) {
        isFirstElement = false;
    }

    var logical = collectionNode.getAttributeValue("logical");
    var negate = collectionNode.getAttributeValue("negate");

    if (logical == null || logical.length == 0 || logical == undefined) {
        logical = "and";
    }

    //only put and or if this is not first element	
    if (!isFirstElement) {
        finalCondition += " " + logical + " ";
        description += " " + logical + " ";
    }

    if (negate != null && negate.length != 0) {
        if (negate == "true") {
            finalCondition += " not ";
            description += " not ";
        }
    }

    finalCondition += "(";
    description += "(";

    var element = collectionNode.getFirstChildElement();
    if (!element) {
        return [true, "Always"]; //return true for a empty collection.
    }

    var array;

    if (element.getName() == "condition") {
        array = getRadQueryFromCondtion(element, true, finalCondition, description);
        finalCondition = array[0];
        description = array[1];
    } else if (element.getName() == "collection") {
        array = getRadQueryFromCollection(element, true, finalCondition, description);
        finalCondition = array[0];
        description = array[1];
    }

    //find all children and decide if it is collection or condition
    do {
        element = element.getNextSiblingElement();
        if (element == null) {
            break;
        }

        if (element.getName() == "condition") {
            array = getRadQueryFromCondtion(element, false, finalCondition, description);
            finalCondition = array[0];
            description = array[1];
        } else if (element.getName() == "collection") {
            array = getRadQueryFromCollection(element, false, finalCondition, description);
            finalCondition = array[0];
            description = array[1];
        }
    } while (true);

    finalCondition += ")";
    description += ")";
    return [finalCondition, description];
}

function processOperandForCrossTableField(operand) {
    //first, find the variable to use for table variable
    var tableName = getElement(operand, "TableName", null);

    var tableVariable = "";
    switch (tableName.getValue()) {
        case "CurrentRecord":
            tableVariable = "$L.file";
            break;

        case "SavedRecord":
            tableVariable = "$L.file.save";
            break;
    }

    //next, find field name
    var fieldName = getElement(operand, "FieldName", null);
    var fieldNameCaption = fieldName.getAttributeValue("caption");
    fieldNameCaption = fieldNameCaption || fieldName.getValue();
    var relation = getElement(operand, "relation", null);
    var targetTable = getElement(relation, "TargetTable", null);
    var targetField = getElement(relation, "TargetField", null);
    var variableName = tableVariable + "." + fieldName.getValue() + "." + targetTable.getValue() + "." + targetField.getValue();

    var crossTableField = getElement(relation, "FieldName", null);
    var crossTableFieldCaption = crossTableField.getAttributeValue("caption");
    crossTableFieldCaption = crossTableFieldCaption || crossTableField.getValue();
    var query = " " + crossTableField.getValue() + " in " + variableName;
    var description = " " + crossTableFieldCaption + " in " + fieldNameCaption + " in " + tableName.getValue();
    return [query, description];
}

function processOperandForField(operand) {
    //first, find the variable to use for table variable
    var tableName = getElement(operand, "TableName", null);

    var query;
    var description;
    var tableVariable = "";

    switch (tableName.getValue()) {
        case "Category":
            tableVariable = "$L.category";
            break;

        case "Phase":
            tableVariable = "$L.phase";
            break;

        case "Object":
            tableVariable = "$L.object";
            break;

        case "CurrentFile":
            tableVariable = "$L.file";
            break;

        case "MappingRecord":
            tableVariable = "$L.mapping";
            break;

        case "CurrentRecord":
            tableVariable = "$L.file";
            break;

        case "SavedFile":
            tableVariable = "$L.file.save";
            break;

        case "SavedRecord":
            tableVariable = "$L.file.save";
            break;

        case "FormatControl":
            tableVariable = "$L.fc";
            break;

        case "Profile":
            tableVariable = "$L.env";
            break;

        case "CURRENT_USER":
            description = "";
            query = "";
            return processOperandForCurrentUser(operand, query, description);

        case "CurrentRecordAuth":
            description = "";
            query = "";
            var value = "";
            return processOperandForAuth(operand, query, description, "", value);

        case "CurrentWFPhase":
            tableVariable = "$L.wfPhase";
            break;

        case "SavedWFPhase":
            tableVariable = "$L.wfPhase.save";
            break;
    }

    //next, find field name
    var fieldName = getElement(operand, "FieldName", null);
    var fieldNameCaption = fieldName.getAttributeValue("caption");
    fieldNameCaption = fieldNameCaption || fieldName.getValue();
    query = " " + fieldName.getValue() + " in " + tableVariable;
    description = " " + fieldNameCaption + " in " + tableName.getValue();
    return [query, description];
}

//process the case where operand checks current user's User Id, Member Groups and Approver Groups
function processOperandForCurrentUser(operand, finalQuery, finalDescription) {

    var type = getElement(operand, "FieldName", null);

    var query;
    var description;

    switch (type.getValue()) {
        case "userId":
            query = "$G.UserId";
            description = "User Id";
            break;

        case "userApprovalGroups":
            query = "$G.ApproverGroups";
            description = "User Approval Groups";
            break;

        case "userMemberGroups":
            query = "$G.MemberGroups";
            description = "User Member Groups";
            break;
    }

    finalQuery += " " + query;
    finalDescription += " " + description;
    return [finalQuery, finalDescription];
}

//process the case where operand checks current record authorization
function processOperandForAuth(operand, finalQuery, finalDescription, comparison, value) {
    var type = getElement(operand, "FieldName", null);
    var query;
    var description;

    var dataType = value.getAttributeValue("dataType");
    if (dataType == null || dataType == "") {
        dataType = "string";
    }

    var stringValue = getValue(value.getValue(), dataType);
    switch (type.getValue()) {
        case "new":
            query = "$L.tableAccess.new" + comparison[0] + stringValue;
            if ((stringValue == "true" && comparison[0] == "=") || (stringValue == "false" && comparison[0] == "~=")) {
                description = "user has \"New\" authorization";
            } else {
                description = "user does not have \"New\" authorization";
            }
            break;

        case "update":
            query = "$L.tableAccess.update" + comparison[0] + stringValue;
            if ((stringValue == "true" && comparison[0] == "=") || (stringValue == "false" && comparison[0] == "~=")) {
                description = "user has \"Update\" authorization";
            } else {
                description = "user does not have \"Update\" authorization";
            }
            break;

        case "delete_close":
            query = "$L.tableAccess.delete" + comparison[0] + stringValue;
            if ((stringValue == "true" && comparison[0] == "=") || (stringValue == "false" && comparison[0] == "~=")) {
                description = "user has \"Close/Delete\" authorization";
            } else {
                description = "user does not have \"Close/Delete\" authorization";
            }
            break;

        case "expert":
            query = "$L.tableAccess.expert" + comparison[0] + stringValue;
            if ((stringValue == "true" && comparison[0] == "=") || (stringValue == "false" && comparison[0] == "~=")) {
                description = "user has \"Expert\" authorization";
            } else {
                description = "user does not have \"Expert\" authorization";
            }
            break;

        case "admin":
            query = "$L.tableAccess.admin" + comparison[0] + stringValue;
            if ((stringValue == "true" && comparison[0] == "=") || (stringValue == "false" && comparison[0] == "~=")) {
                description = "user has \"Admin\" authorization";
            } else {
                description = "user does not have \"Admin\" authorization";
            }
            break;
    }

    finalQuery += " " + query;
    finalDescription += " " + description;
    return [finalQuery, finalDescription];
}

//process the case where operand is a variable
function processOperandForVariable(operand) {
    //first, find the variable to use for table variable
    var variableName = getElement(operand, "VariableName", null);
    return [" " + variableName.getValue(), " " + variableName.getValue()];
}

//process the case where operand is a user option
function processOperandForUseroption(operand) {
    //first, find the variable to use for table variable
    var variableName = getElement(operand, "UserOptionName", null);
    return [" $L.UO." + variableName.getValue(), " User Option " + variableName.getValue()];
}

//process the case where operand is a security area and right
function processOperandForSecurity(operand) {
    var area = getElement(operand, "Area", null).getValue();
    var areaCaption = getElement(operand, "Area", null).getAttributeValue("caption");
    if (areaCaption == null || areaCaption == "") {
        areaCaption = area;
    }

    var right = getElement(operand, "Right", null).getValue();
    var rightCaption = getElement(operand, "Right", null).getAttributeValue("caption");
    if (rightCaption == null || rightCaption == "") {
        rightCaption = right;
    }

    var query = " jscall(\"security.getToken\", \"" + area + "\", \"" + right + "\")";
    var desc = " the \"" + rightCaption + "\" value in the \"" + areaCaption + "\" Security Area";
    return [query, desc];
}

//process the case where operand is a security area and right
function processOperandForExpression(operand, query, description) {
    var expression = getElement(operand, "Expression", null).getValue();
    expression = convertSign(expression);
    expression = expression.substring(1, expression.length - 1);
    query = query + expression;
    var desc = description + " Expression: " + expression;
    return [query, desc];
}

function getComparison(compareStr) {
    switch (compareStr) {
        case "equals":
            return ["=", " = "];
        case "gt":
            return [">", " > "];
        case "lt":
            return ["<", " < "];
        case "startswith":
            return ["#", " " + "Starts With" + " "];
        case "get":
            return [">=", " >= "];
        case "let":
            return ["<=", " <= "];
        case "neq":
            return ["~=", " != "];
    }

    return [compareStr, compareStr];
}

function getValue(valueStr, dataType) {
    switch (dataType) {
        case "boolean":
            return valueStr;
        case "string":
            // QCCR1E108024,Support user option array in task planner and conditional editor.
            // By Xiong-jie MA 2014-05-14
            //  currently both the string and array of string fields are treated as string type,
            //  add the logic here to treat it as array while this value starts with "{" and 
            //  ends with "}"
            if (valueStr != "NULL") {
                var tmpStr = _.trim(valueStr);

                if (_.startsWith(tmpStr, "{") && _.endsWith(tmpStr, "}")) {
                    return valueStr.replace(/\\/g, "\\\\");
                } else {
                    return "\"" + valueStr.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
                }
            } else {
                return "NULL";
            }
        case "number":
            return valueStr;
        case "datetime":
            return "'" + valueStr + "'";
        case "null":
            return "NULL";
    }

    return valueStr;
}

function getXmlWithCaptions(conditionXml, fileName) {
    //if condition is empty, return true
    if (conditionXml == null || conditionXml == "") {
        return conditionXml;
    }

    //if file name is empty, return true
    if (fileName == null || fileName == "") {
        return conditionXml;
    }
    //get root children
    var xmlObject = new XML();
    try {
        xmlObject.setContent(conditionXml);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return conditionXml;
    }

    try {
        var xml = xmlObject.getDocumentElement();
        var description = ""; //  This will hold the English description of the condition
        var finalCondition = "";
        var element = xml.getFirstChildElement();
        var array = [];
        if (element.getName() == "condition") {
            setCaptionForCondition(element, fileName);
        } else if (element.getName() == "collection") {
            setCaptionForCollection(element, fileName);
        }

        //walk through all children 	
        do {
            element = element.getNextSiblingElement();
            if (element == null) {
                break;
            }

            if (element.getName() == "condition") {
                setCaptionForCondition(element, fileName);
            } else if (element.getName() == "collection") {
                setCaptionForCollection(element, fileName);
            }
        } while (true);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return conditionXml;
    }

    return xmlObject.toXMLString();
}

function setCaptionForCollection(collectionNode, fileName) {
    var element = collectionNode.getFirstChildElement();
    if (element.getName() == "condition") {
        setCaptionForCondition(element, fileName);
    } else if (element.getName() == "collection") {
        setCaptionForCollection(element, fileName);
    }

    //find all children and decide if it is collection or condition
    do {
        element = element.getNextSiblingElement();
        if (element == null) {
            break;
        }
        if (element.getName() == "condition") {
            setCaptionForCondition(element, fileName);
        } else if (element.getName() == "collection") {
            setCaptionForCollection(element, fileName);
        }
    } while (true);
}

function setCaptionForCondition(element, fileName) {
    var operand = getElement(element, "operand", null);

    var type = operand.getAttributeValue("type");

    if (type == "field") {
        //first, find the variable to use for table variable
        var tableName = getElement(operand, "TableName", null).getValue();

        //next, find field name
        var fieldName = getElement(operand, "FieldName", null);
        var caption = getCaptionForField(fieldName.getValue(), tableName, fileName);

        fieldName.addAttribute("caption", caption);
    } else if (type == "variable") {
        var variableName = getElement(operand, "VariableName", null);
        variableName.addAttribute("caption", variableName.getValue());
    } else if (type == "security") {
        var area = getElement(operand, "Area", null);
        area.addAttribute("caption", area.getValue());
        var right = getElement(operand, "Right", null);
        right.addAttribute("caption", right.getValue());
    }

    return element;
}

function getCaptionForField(fieldName, tableCaption, fileName) {

    var tableName = fileName;
    var object;
    var sql;

    if (tableCaption == "CurrentFile" || tableCaption == "CurrentRecord") {
        tableName = fileName;
    } else if (tableCaption == "SavedFile" || tableCaption == "SavedRecord") {
        tableName = fileName;
    } else if (tableCaption == "Category") {
        //get category file name based on Object record
        object = new SCFile("Object", SCFILE_READONLY);
        object.setFields("category.file.name");
        sql = "file.name=\"" + fileName + "\"";
        if (object.doSelect(sql) == RC_SUCCESS) {
            tableName = object.category_file_name;
        } else {
            tableName = "cm3rcategory";
        }
    } else if (tableCaption == "Object") {
        tableName = "Object";
    } else if (tableCaption == "Phase") {
        //get phaser file name based on Object record
        object = new SCFile("Object", SCFILE_READONLY);
        object.setFields("phase.file.name");
        sql = "file.name=\"" + fileName + "\"";
        if (object.doSelect(sql) == RC_SUCCESS) {
            tableName = object.phase_file_name;
        } else {
            tableName = "cm3rphase";
        }
    } else if (tableCaption == "Profile") {
        if (fileName == "cm3r" || fileName == "cm3t") {
            tableName = "cm3profile";
        } else if (fileName == "ocmq" || fileName == "ocml" || fileName == "ocmo") {
            tableName = "ocmprofile";
        } else if (fileName == "incidents") {
            tableName = "smenv";
        } else if (fileName == "probsummary") {
            tableName = "pmenv";
        }
    } else if (tableCaption == "CurrentWFPhase" || tableCaption == "SavedWFPhase") {
        tableName = "WorkflowPhase";
    }

    //get caption based on table name and field name
    var caption = lib.tableFunctions.getFieldCaption(fieldName, tableName);

    return caption;
}

function parseXmlString(xmlString) {
    var position = xmlString.indexOf("<Expression caption=\"\">");
    if (position > 0) {
        var part1 = xmlString.substring(0, position + 12);
        var lastPos = xmlString.indexOf("</Expression>");
        var part2 = xmlString.substring(position + 12, lastPos);
        var part3 = xmlString.substring(lastPos);

        part2 = part2.replace("<", "@");
        part2 = part2.replace("<=", "^");

        xmlString = part1 + part2 + part3;
    }
    return xmlString;
}

function convertSign(expression) {
    expression = expression.replace("@", "<");
    expression = expression.replace("^", "<=");
    return expression;
}


/**
 * Get the condition configurations from condtion XML, which need to initialize additional variables for cross table and user option.
 * @param {String} conditionXml
 * @return {array of configuration with structure{type, uoName, fromTable, fromTableType, fromField, toTable, toField, fieldName}}
 */
function getAdditionalVariablesConfigFromCondtionXml(conditionXml) {
    conditionXml = parseXmlString(conditionXml);
    var xmlObject = new XML();
    try {
        xmlObject.setContent(conditionXml);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());

        return null;
    }

    var ret = [];

    try {
        var array;

        var xml = xmlObject.getDocumentElement();
        var element = xml.getFirstChildElement();
        if (element.getName() == "condition") {
            array = getAdditionalVariablesConfigFromCondtion(element);
            if (null != array) {
                ret = ret.concat(array);
            }
        } else if (element.getName() == "collection") {
            array = getAdditionalVariablesConfigFromCollection(element);
            if (null != array) {
                ret = ret.concat(array);
            }
        } else if (element.getName() == "never") {
            return null;
        } else {
            print("unable to parse, this xml string does not contain either a condition or a collection element");
            return null;
        }

        //walk through all children and generate query  
        do {
            element = element.getNextSiblingElement();
            if (element == null) {
                break;
            }

            if (element.getName() == "condition") {
                array = getAdditionalVariablesConfigFromCondtion(element);
                if (null != array) {
                    ret = ret.concat(array);
                }
            } else if (element.getName() == "collection") {
                array = getAdditionalVariablesConfigFromCollection(element);
                if (null != array) {
                    ret = ret.concat(array);
                }
            }
        } while (true);

        return ret;
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return null;
    }
}

/* Get the condition configuration from condition which need to initialize additional variables for cross table
 * @param {Element} element the operand or value element
 * @return {type, fromTable, fromTableType, fromField, toTable, toField, fieldName}
 */
function processAdditionalVariableConfigForCrossTable(element) {
    var returnConf = {};
    returnConf.type = "crosstablefield";

    // first, find the variable to use for table variable
    var tableName = getElement(element, "TableName", null);

    switch (tableName.getValue()) {
        case "CurrentRecord":
            returnConf.fromTableType = "CurrentRecord";
            returnConf.fromTable = funcs.filename(vars.$L_file);
            break;

        case "SavedRecord":
            returnConf.fromTableType = "SavedRecord";
            returnConf.fromTable = funcs.filename(vars.$L_file_save);
            break;

        default:
            print("Invalid configuration for cross table configuration");
            returnConf.fromTableType = null;
            returnConf.fromTable = null;
            return returnConf;
    }

    // find field name
    var fieldName = getElement(element, "FieldName", null);
    returnConf.fromField = fieldName.getValue();
    // find relation
    var relation = getElement(element, "relation", null);
    if (null == relation) {
        print("Invalid configuration for cross table configuration, donot have relation");
        return returnConf;
    }
    // find TargetTable under relation
    var targetTable = getElement(relation, "TargetTable", null);
    returnConf.toTable = targetTable.getValue();
    // find TargetField under relation
    var targetField = getElement(relation, "TargetField", null);
    returnConf.toField = targetField.getValue();
    // find FieldName under relation
    var fieldNameSub = getElement(relation, "FieldName", null);
    returnConf.fieldName = fieldNameSub.getValue();

    return returnConf;
}

/**
 * Get the condition configuration from condition which need to initialize additional variables for user option
 * @param {Element} element the operand or value element
 * @return {type, uoName}
 */
function processAdditionalVariableConfigForUserOption(element) {
    var returnConf = {};
    returnConf.type = "useroption";

    // first, find the variable to use for table variable
    var uoName = getElement(element, "UserOptionName", null);
    if (null == uoName) {
        print("Invalid configuration for user option configuration, donot have \"UserOptionName\"");
        return returnConf;
    }
    returnConf.uoName = uoName.getValue();

    return returnConf;
}

/**
 * Get the condition configurations from condition which need to initialize additional variables for cross table and user option.
 * @param {Element} element the condition element
 * @return {array of configuration with structure{type, uoName, fromTable, fromTableType, fromField, toTable, toField, fieldName}}
 */
function getAdditionalVariablesConfigFromCondtion(element) {
    var ret = [];
    var type;

    //get operand node
    var operand = getElement(element, "operand", null);
    if (operand != null) {
        type = operand.getAttributeValue("type");
    }

    var config;
    if (type == "crosstablefield") {
        config = processAdditionalVariableConfigForCrossTable(operand);
        ret.push(config);
    } else if (type == "useroption") {
        config = processAdditionalVariableConfigForUserOption(operand);
        ret.push(config);
    }

    //next get value and data type
    var value = getElement(element, "Value", null);
    var valueType = value.getAttributeValue("type");
    if (valueType == "crosstablefield") {
        config = processAdditionalVariableConfigForCrossTable(value);
        ret.push(config);
    } else if (valueType == "useroption") {
        config = processAdditionalVariableConfigForUserOption(value);
        ret.push(config);
    }

    if (null != ret && ret.length > 0) {
        return ret;
    } else {
        return null;
    }
}

/**
 * Get the condition configurations from collection which need to initialize additional variables for cross table and user option.
 * @param {Element} collectionNode
 * @return {array of configuration with structure{type, uoName, fromTable, fromTableType, fromField, toTable, toField, fieldName}}
 */
function getAdditionalVariablesConfigFromCollection(collectionNode) {
    var ret = [];
    var array;

    var element = collectionNode.getFirstChildElement();
    if (element.getName() == "condition") {
        array = getAdditionalVariablesConfigFromCondtion(element);
        if (null != array) {
            ret = ret.concat(array);
        }
    } else if (element.getName() == "collection") {
        array = getAdditionalVariablesConfigFromCollection(element);
        if (null != array) {
            ret = ret.concat(array);
        }
    }

    //find all children and decide if it is collection or condition
    do {
        element = element.getNextSiblingElement();
        if (element == null) {
            break;
        }

        if (element.getName() == "condition") {
            array = getAdditionalVariablesConfigFromCondtion(element);
            if (null != array) {
                ret = ret.concat(array);
            }
        } else if (element.getName() == "collection") {
            array = getAdditionalVariablesConfigFromCollection(element);
            if (null != array) {
                ret = ret.concat(array);
            }
        }
    } while (true);

    if (null != ret && ret.length > 0) {
        return ret;
    } else {
        return null;
    }
}

/**
 * Get all the fields which are used in the condition according to the condition XML.
 * The condition item which are not for the field of current file will be ignored.
 * The condition item which is for cross table field, it is treated as the source field of current file.
 * @param {String} conditionXML
 * @return {array of string}
 */
function getFieldsFromCondtionXml(conditionXml) {
    //if condition is empty, return true
    if (conditionXml == null || conditionXml == "") {
        return [];
    }

    //get root children
    conditionXml = parseXmlString(conditionXml);
    var xmlObject = new XML();
    try {
        xmlObject.setContent(conditionXml);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return [];
    }

    var retArray = [];

    try {
        var xml = xmlObject.getDocumentElement();
        var element = xml.getFirstChildElement();
        var array = [];
        if (element.getName() == "condition") {
            getFieldsFromCondtion(element, retArray);
        } else if (element.getName() == "collection") {
            getFieldsFromCollection(element, retArray);
        } else if (element.getName() == "never") {
            return [];
        } else {
            print("unable to parse, this xml string does not contain either a condition or a collection element");
            return [];
        }

        //walk through all children and generate query	
        do {
            element = element.getNextSiblingElement();
            if (element == null) {
                break;
            }

            if (element.getName() == "condition") {
                getFieldsFromCondtion(element, retArray);
            } else if (element.getName() == "collection") {
                getFieldsFromCollection(element, retArray);
            }
        } while (true);
    } catch (e) {
        print("Invalid XML string.");
        print(e.toString());
        return [];
    }

    return retArray;
}

function getFieldsFromCondtion(element, retArray) {
    //get operand node
    var type;
    var operand = getElement(element, "operand", null);
    if (operand != null) {
        type = operand.getAttributeValue("type");
    }

    if (type == "field") {
        processFieldNameForField(operand, retArray);
    } else if (type == "crosstablefield") {
        processFieldNameForCrossTableField(operand, retArray);
    } else if (type == "variable") {
        // do nothing
    } else if (type == "useroption") {
        // do nothing
    } else if (type == "security") {
        // do nothing
    } else if (type == "expression") {
        // do nothing if the the condition is configured as RAD Expression, and return directly
        return;
    } else if (type == "authorization") {
        // do nothing and return directly
        return;
    }

    //next get value and data type
    var value = getElement(element, "Value", null);
    var valueType = value.getAttributeValue("type");

    if (valueType == null || valueType == "") {
        // do nothing
    } else {
        if (valueType == "field") {
            processFieldNameForField(value, retArray);
        } else if (valueType == "crosstablefield") {
            processFieldNameForCrossTableField(value, retArray);
        } else if (valueType == "variable") {
            // do nothing
        } else if (valueType == "useroption") {
            // do nothing
        } else if (valueType == "security") {
            // do nothing
        } else {
            print("type " + valueType + " is not supported");
        }
    }
}

function getFieldsFromCollection(collectionNode, retArray) {
    var element = collectionNode.getFirstChildElement();

    if (!element) {
        return; // for empty condition
    }

    if (element.getName() == "condition") {
        getFieldsFromCondtion(element, retArray);
    } else if (element.getName() == "collection") {
        getFieldsFromCollection(element, retArray);
    }

    //find all children and decide if it is collection or condition
    do {
        element = element.getNextSiblingElement();
        if (element == null) {
            break;
        }

        if (element.getName() == "condition") {
            getFieldsFromCondtion(element, retArray);
        } else if (element.getName() == "collection") {
            getFieldsFromCollection(element, retArray);
        }
    } while (true);
}

function processFieldNameForField(operand, retArray) {
    //first, find the variable to use for table variable
    var tableName = getElement(operand, "TableName", null);

    var tableNameValue = tableName.getValue();
    if (tableNameValue === "CurrentFile" || tableNameValue === "CurrentRecord" ||
        tableNameValue === "SavedFile" || tableNameValue === "SavedRecord") {
        var fieldName = getElement(operand, "FieldName", null);
        if (null === fieldName) {
            return;
        }
        var fieldNameStr = fieldName.getValue();
        if (!arrayContains(retArray, fieldNameStr)) {
            retArray.push(fieldNameStr);
        }
    } else {
        // do nothing if table name is "Category", "Phase", "Object", "MappingRecord",
        // "FormatControl", "Profile", "CURRENT_USER", "CurrentRecordAuth", "CurrentWFPhase" or "SavedWFPhase"
    }
}

function processFieldNameForCrossTableField(operand, retArray) {
    var fieldName = getElement(operand, "FieldName", null);
    if (null === fieldName) {
        return;
    }
    var fieldNameStr = fieldName.getValue();
    if (!arrayContains(retArray, fieldNameStr)) {
        retArray.push(fieldNameStr);
    }
}

function arrayContains(array, item) {
    if (null === array) {
        return false;
    }

    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i] === item) {
            return true;
        }
    }

    return false;
}