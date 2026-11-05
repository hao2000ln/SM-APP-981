/** This function reads the validation XML and returns the proper query.
 *  If the field does not have a match table/field, the query will be returned as "false"
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be used
 *  @param {string} value - the value of the xml field
 *  @return The proper query ofr the xml field
 *   @type String
 */
function getQuery(xmlString, id, value, optionXML) {

    var blank = "false";
    var all = "true";
    var xml = new XML();
    var xml_option = new XML();

    if (xml.setContent(xmlString) && xml_option.setContent(optionXML)); {
        var sql;
        var regenSql = false;
        var crossTableSql = false;
        var element = lib.xmlHelpers.getElement(xml, id, "id");
        var element_option = lib.xmlHelpers.getElement(xml_option, id, "id");
        if (element != null && element_option != null) {

            var field = element.getAttributeValue("matchField");
            var table = element.getAttributeValue("matchTable");

            //Start for logical name
            if (lib.dynamicFormGenerator.needDisplayField(table, field) && !lib.dynamicFormGenerator.need2ndLevelDisplayField(table, field)) {
                regenSql = true;
            }
            if (lib.dynamicFormGenerator.need2ndLevelDisplayField(table, field)) {
                crossTableSql = true;
            }
            //End for logical name

            var query = element.getAttributeValue("query");
            var multiselection = element.getAttributeValue("multiSelections");
            var cursorLine = element_option.getAttributeValue("cursorLine");

            var type = lib.tableFunctions.getFieldType(field, table);

            if (value == null || value === "" || value === undefined) {
                sql = all;
            }
            if (multiselection != null && multiselection != "" && cursorLine != null && cursorLine != "") {
                var arrayValues = value.split("\n");
                value = arrayValues[cursorLine - 1];
                if (value == null || value === "" || value === undefined) {
                    sql = all;
                }
            }
            if (type == 1 && value != "" && value !== undefined) {
                sql = field + "=" + value;
            } else if (type == 2 && value != "" && value !== undefined) {
                sql = field + "#\"" + value + "\"";
            } else if (type == 3 && value != "" && value !== undefined) {
                sql = field + "='" + value + "'";
            }

            if (sql == null) sql = all;

            //Start for logical name
            var queryFields = "";
            if (crossTableSql) {
                var finalTargetTable = lib.DisplayName.getRefTable(field, table);
                var uniqueKeys = lib.dbdictHelper.getUniqueKey(finalTargetTable);
                var finalTargetField = uniqueKeys[0];
                var finalTargetDisplayField = lib.DisplayName.getRefTableDisplayField(finalTargetTable);
                if (value !== null && value !== "" && value !== undefined) {
                    sql = table + ";" + field + ";" + finalTargetTable + ";" + finalTargetField + ";" + finalTargetTable + ";" + finalTargetDisplayField + "#\"" + value + "\"";
                } else {
                    queryFields = table + ";" + field + ";" + finalTargetTable + ";" + finalTargetField + ";" + finalTargetTable + ";" + finalTargetDisplayField;
                }
            }

            if (regenSql) {
                sql = lib.DisplayName.reGenLinkQuery(sql, table);
            }
            //End for logical name

            if (query != null && query != "") {
                query = replaceElementValue(optionXML, xmlString, query);
                sql = sql + " and " + query;
            }

            //Start for logical name
            //if(regenSql){
            //sql=lib.DisplayName.reGenLinkQuery(sql,table);
            //}

            if (crossTableSql) {
                var fields = new Array();
                fields.push("*");
                if (queryFields !== "") {
                    fields.push(queryFields);
                }
                sql = system.functions.generate_sql_query(fields, sql, table, false);
            }
            //End for logical name
            if (sql === null || sql === "") sql = "true";

            return sql;
        }
    }

    return blank;
}


/** This function reads the options XML and returns the contents of the specified field
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return The value of the xml field
 *   @type String
 */
function getValue(xmlString, id, validationXml) {
    var xml = new XML();
    var valXml = new XML();
    if (xml.setContent(xmlString)) {

        var element = lib.xmlHelpers.getElement(xml, id, "id");
        if (element == null) {
            return null;
        }
        var value = element.getValue();

        //Start for logical name
        var multiselection = element.getAttributeValue("multiSelections");
        var cursorLine = element.getAttributeValue("cursorLine");
        if (validationXml !== undefined && validationXml !== null && validationXml !== "" && valXml.setContent(validationXml)) {
            var node = lib.xmlHelpers.getElement(valXml, id, "id");
            var matchField = node.getAttributeValue("matchField");
            var matchTable = node.getAttributeValue("matchTable");

            //QCCR1E158897, add back for searching value input in xmlfill, and return the value to query.
            var opXmlstring = funcs.str(vars["$original.options"]);
            //end

            if (matchField != null && matchTable != null && matchField != "" && matchTable != "") {
                if (lib.dynamicFormGenerator.needDisplayField(matchTable, matchField)) {
                    if (multiselection != null && multiselection != "" && cursorLine != null && cursorLine != "" && multiselection != "0" && multiselection != "1") {
                        var displayValue = [];
                        for (var a = 0; a < cursorLine; a++) {
                            displayValue[a] = element.getAttributeValue("display" + (a + 1));

                            //QCCR1E158897, add back for searching value input in xmlfill, and return the value to query.
                            if ((displayValue[a] == null || displayValue[a] == "") && opXmlstring != null) {
                                var displayXml = new XML();
                                if (displayXml.setContent(opXmlstring)) {
                                    var opElement = lib.xmlHelpers.getElement(displayXml, id, "id");
                                    if (opElement != null) {
                                        displayValue[a] = opElement.getAttributeValue("display" + (a + 1));
                                    }
                                }
                            }
                            //QCCR1E158897 end
                        }
                        value = displayValue.join("\n");
                    } else {
                        value = element.getAttributeValue("display");

                        //QCCR1E158897, add back for searching value input in xmlfill, and return the value to query.
                        if ((value == null || value == "") && opXmlstring != null) {
                            var displayXml = new XML();
                            if (displayXml.setContent(opXmlstring)) {
                                var opElement = lib.xmlHelpers.getElement(displayXml, id, "id");
                                if (opElement != null) {
                                    value = opElement.getAttributeValue("display");
                                }
                            }
                        }
                        //QCCR1E158897 end

                    }
                }
            }
        }

        //end for logical name
        return value;
    }

}

/** This function reads the options XML and returns the nodeName, value, type of the specified field
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return An array of NodeName, Value, Type
 *   @type Array [nodeName], [value], [type]
 */
function getNodeValueType(optionXML, validationXML, id) {
    var xml = new XML();
    var value, nodeName, type;
    if (xml.setContent(optionXML)); {
        var node = lib.xmlHelpers.getElement(xml, id, "id");
        if (node != null) {
            value = node.getValue();
            nodeName = node.getName();
            var xmlValidation = new XML();
            if (xmlValidation.setContent(validationXML)) {
                var id = node.getAttributeValue("id");
                var rules = lib.xmlHelpers.getElement(xmlValidation, id, "id");
                if (rules != null) {
                    type = rules.getName();
                } else {
                    if (nodeName == "checkbox") {
                        type = "checkbox";
                    }
                }
            }
        }
    }
    return ([nodeName, value, type]);

}

/** This function reads the validation XML and returns the correct filename
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return The table name
 *   @type String
 */
function getTableName(xmlString, id) {
    return getMatchAttr(xmlString, id, 'matchTable');
}

/** This function reads the validation XML and returns the JS name
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return The Match Script name
 *   @type String
 */
function getMatchScript(xmlString, id) {
    return getMatchAttr(xmlString, id, 'matchScript');
}

/** This function reads the validation XML and returns the correct attribute value 
 *
 *   @param {xmlString}  -   the xml String containing the validation information
 *   @param {string} id    - the xml field name to be checked
 *   @param {string} attrName - the name of the attribute
 *   @return The Attribute Value
 *   @type String
 */
function getMatchAttr(xmlString, id, attrName) {
    var xml = new XML();
    if (xml.setContent(xmlString)); {
        var element = lib.xmlHelpers.getElement(xml, id, "id");
        if (element == null)
            return null;
        var value = element.getAttributeValue(attrName);
        if (value == "") {
            return null;
        }
        return value;
    }

}

/** This function reads the validation XML and returns the correct field name
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return The field name
 *   @type String
 */
function getFieldName(xmlString, id) {
    var xml = new XML();
    if (xml.setContent(xmlString)); {
        var element = lib.xmlHelpers.getElement(xml, id, "id");
        if (element == null)
            return null;
        var value = element.getAttributeValue("matchField");

        return value;
    }

}

/** This function sets a field value in the options XML
 *
 *  @param {xmlString}  -   the xml String containing the option information
 *  @param {string} id    - the xml field name to be set
 *  @param {string} value - the value to set the field to
 *  @param {string} lineNumber -    the line number of multiple selection values to set the field to
 *  @return the resulting XML String
 *   @type XMLString
 */
function setFieldValue(xmlString, id, value, lineNumber, validationString, needDisplayField, displayValue) {
    if (lineNumber == null)
        lineNumber = 0;
    var xml = new XML();
    var valXml = new XML();
    if (xml.setContent(xmlString)) {

        if (displayValue === null || displayValue === "NULL") {
            displayValue = "";
        }

        var element = lib.xmlHelpers.getElement(xml, id, "id");

        if (element == null)
            return xmlString;
        if (value != null) {
            if (system.functions.type(value) === 8) {
                value = system.functions.str(value);
            }

            var optionValue = getValue(xmlString, id);
            var multiselection = element.getAttributeValue("multiSelections");
            var cursorLine = element.getAttributeValue("cursorLine");

            if (multiselection != null && multiselection != "" && cursorLine != null && cursorLine != "") {

                var arrayValues = optionValue.split("\n");

                var valueIndex = parseInt(cursorLine) + lineNumber - 1;

                if (arrayValues[valueIndex] == null || arrayValues[valueIndex] == "") {
                    arrayValues[valueIndex] = value;
                    // Start,added by Henrry for logical name
                    if (needDisplayField) {
                        element.setAttributeValue("hasdisplay", "true");
                        element.setAttributeValue("display" + (valueIndex + 1), displayValue);
                    }
                    //end
                } else {
                    var isValidTablevalue = lib.dynamicFormValidation.isValidMatchFieldValue(arrayValues[valueIndex], id, xmlString, validationString);

                    if (!isValidTablevalue || lineNumber == 0) {
                        arrayValues[valueIndex] = value;
                        // Start,added by Henrry for logical name
                        if (needDisplayField) {
                            element.setAttributeValue("hasdisplay", "true");
                            element.setAttributeValue("display" + (valueIndex + 1), displayValue);
                        }
                        //end
                    } else {
                        // Start,added by Henrry for logical name
                        if (needDisplayField) {
                            element.setAttributeValue("hasdisplay", "true");
                            var lng = system.functions.lng(arrayValues);
                            for (var i = lng; i > valueIndex; i--) {
                                element.setAttributeValue("display" + (i + 1), element.getAttributeValue("display" + i));
                            }
                            element.setAttributeValue("display" + (valueIndex + 1), displayValue);
                        }
                        //end
                        arrayValues.splice(valueIndex, 0, value);
                    }
                }

                value = arrayValues.join("\n");

            } else {
                if (needDisplayField) {
                    element.setAttributeValue("hasdisplay", "true");
                    element.setAttributeValue("display", displayValue);
                }
            }
            element.setValue(value);

        }

        return xml.toXMLString();
    }
    return xmlString;
}

/** This function reads the option xml and gets the field name from the button value
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} button    - the button to be checked
 *  @return The field name
 *   @type String
 */
function getFieldFromButton(xmlString, button) {
    var xml = new XML();
    if (xml.setContent(xmlString)); {
        var element = lib.xmlHelpers.getElement(xml, button, "button");
        if (element == null)
            return null;
        var value = element.getAttributeValue("id");

        return value;
    }

}

/** This function gets the group by fields if they exist
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return The group field names
 *   @type Array
 */
function getGroupFields(xmlString, id) {
    var fields = new SCDatum();
    fields.setType(8);
    var xml = new XML();

    if (xml.setContent(xmlString)); {
        var element = lib.xmlHelpers.getElement(xml, id, "id");
        if (element == null)
            return null;
        var groupNode = lib.xmlHelpers.getElement(element, "matchGroup", null);
        if (groupNode != null) {

            var groupField = groupNode.getFirstChildElement();
            while (groupField != null) {
                if (groupField.getValue() != null && groupField.getValue() != "null") {
                    fields = system.functions.insert(fields, 0, 1, groupField.getValue());
                }
                groupField = groupField.getNextSiblingElement();
            }
        }
    }
    return fields;
}

/** This function is to replace the brackets [] in query with the real value
*   Brackets in double quotation mark should not be replaced

*   @param {xmlString}  -   the xml user filled in
*   @param {xmlValidation}    - the xml String containing the validation information
*   @param {query} - query statement defined in user option
*   @return The group field names
*   @type Array
*/
function replaceElementValue(xmlString, xmlValidation, query) {
    var reg = /\"(.*?)\"/gi; //regular expression for finding out double quotation mark ""
    var subStringArr = [];
    var tmp;
    var firstBracketIndex = 0;
    var secondBracketIndex = 0;
    var result = '';
    while ((tmp = reg.exec(query)) != null) {
        firstBracketIndex = tmp.index;
        if (firstBracketIndex > 0) {
            subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
        }
        secondBracketIndex = firstBracketIndex + tmp[0].length;
        subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
    }
    if (secondBracketIndex != query.length) {
        subStringArr.push(query.substring(secondBracketIndex, query.length));
    }

    for (var i = 0; i < subStringArr.length; i++) {
        var tempstr = subStringArr[i];
        if (tempstr.charAt(0) != '"') {
            tempstr = replaceBracketsValue(xmlString, xmlValidation, tempstr);
        }
        result += tempstr;
    }

    return result;
}

/** This function is to replace the brackets [] in query with the real value

*   @param {xmlString}  -   the xml user filled in
*   @param {xmlValidation}    - the xml String containing the validation information
*   @param {query} - query statement defined in user option
*   @return The group field names
*   @type Array
*/
function replaceBracketsValue(xmlString, xmlValidation, query) {
    var reg = /\[(.*?)\]/gi; //regular expression for find out brackets []
    var subStringArr = [];
    var tmp;
    var firstBracketIndex = 0;
    var secondBracketIndex = 0;
    var result = '';
    while ((tmp = reg.exec(query)) != null) {
        firstBracketIndex = tmp.index;
        if (firstBracketIndex > 0) {
            subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
        }
        secondBracketIndex = firstBracketIndex + tmp[0].length;
        subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
    }
    if (secondBracketIndex != query.length) {
        subStringArr.push(query.substring(secondBracketIndex, query.length));
    }

    for (var i = 0; i < subStringArr.length; i++) {
        var tempstr = subStringArr[i];
        if (tempstr.charAt(0) == '[') {
            tempstr = tempstr.substring(1, tempstr.length - 1);

            var element = getNodeValueType(xmlString, xmlValidation, tempstr);
            var nodeName = element[0];
            var nodeValue = element[1];
            var nodeType = element[2];
            // if the depended field is a string or picklist, doulbe quotation mark should be added automatically
            if (nodeType == "string" || nodeType == "multitext" || nodeType == "picklist" || nodeType == "combo" || nodeType == "radio") {
                tempstr = '"' + nodeValue + '"';
            } else if (nodeType == "date") {
                tempstr = nodeValue == "" ? "NULL" : "'" + nodeValue + "'";
            } else {
                if (nodeType == "checkbox") {
                    tempstr = nodeValue;
                    if (tempstr == "") {
                        tempstr = "false";
                    }
                } else if (nodeType == "number") {
                    tempstr = nodeValue == "" ? "NULL" : nodeValue;
                }
                query = nodeValue;
            }
        }
        result += tempstr;
    }


    return result;
}

/** This function reads the validation XML and returns the correct multiSelections
 *
 *  @param {xmlString}  -   the xml String containing the validation information
 *  @param {string} id    - the xml field name to be checked
 *  @return The multiSelections value
 *   @type String
 */
function getMultiSelections(xmlString, id) {
    var xml = new XML();
    if (xml.setContent(xmlString)); {
        var element = lib.xmlHelpers.getElement(xml, id, "id");
        if (element == null)
            return null;
        var value = element.getAttributeValue("multiSelections");

        return value;
    }

}


/** This function remove duplicate option array values in the options XML
 *
 *  @param {record}     -   current svcCartItem/joinsvcDisplay
 *  @param {xmlString}  -   the xml String containing the option information
 *  @return the resulting XML String
 *   @type XMLString
 */
function removeNullAndDuplicateOptionFieldValue(record, xmlString, validationString) {

    var xml = new XML();
    var valXML = new XML();
    if (xml.setContent(xmlString)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            if (node.getAttributeValue("id") != null) {
                var xmlElement = lib.xmlHelpers.getElement(xml, node.getAttributeValue("id"), "id");
                var optionValue = xmlElement.getValue();
                var multiselection = xmlElement.getAttributeValue("multiSelections");
                var cursorLine = xmlElement.getAttributeValue("cursorLine");
                //Added for logical name solution
                var matchTable = "device";
                var matchField = "";

                if (validationString !== "" && validationString !== null && validationString !== undefined && valXML.setContent(validationString)) {
                    var valElement = lib.xmlHelpers.getElement(valXML, node.getAttributeValue("id"), "id");
                    if (valElement != null) {
                        matchTable = valElement.getAttributeValue("matchTable");
                        matchField = valElement.getAttributeValue("matchField");
                    }
                }
                //end
                if (optionValue != null && multiselection != null && multiselection != "" && multiselection != "0" && multiselection != "1") {

                    var arrayValues = optionValue.split("\n");

                    var arrayNoDups = lib.tableUtil.removeNullAndDuplicate(record, arrayValues);
                    var lngArrayNoDups = lib.ArrayUtil.length(arrayNoDups);

                    if (cursorLine != null && cursorLine != "" && parseInt(cursorLine) > lngArrayNoDups) {
                        xmlElement.setAttributeValue("cursorLine", lngArrayNoDups);
                    }
                    //Added for logical name solution
                    var hasDisplay = xmlElement.getAttributeValue("hasdisplay");
                    var secondLevelDisplay = lib.dynamicFormGenerator.need2ndLevelDisplayField(matchTable, matchField);
                    var displayName = "";
                    if (hasDisplay === true || hasDisplay === "true") {
                        var lng = lib.ArrayUtil.length(arrayValues);
                        for (var i = 1; i <= lng; i++) {
                            var removeResult = xmlElement.removeAttribute("display" + i);
                        }
                        for (var j = 0; j < lngArrayNoDups; j++) {
                            if (secondLevelDisplay) {
                                var refTable = lib.DisplayName.getRefTable(matchField, matchTable);
                                displayName = lib.DisplayName.getDisplayNameById(refTable, arrayNoDups[j]);
                            } else {
                                displayName = lib.DisplayName.getDisplayNameById(matchTable, arrayNoDups[j]);
                            }
                            xmlElement.setAttributeValue("display" + (j + 1), displayName);
                        }
                    }
                    //end
                    var valueNoDups = arrayNoDups.join("\n");

                    xmlElement.setValue(valueNoDups);
                }

            }

            node = node.getNextSiblingElement();
        }

    }

    return xml.toXMLString();
}
//add for logical name
function needDisplayFieldCheckByXML(id, validationXML) {
    var rt = false;
    var valXml = new XML();
    if (valXml.setContent(validationXML)) {
        var node = lib.xmlHelpers.getElement(valXml, id, "id");
        var matchField = node.getAttributeValue("matchField");
        var matchTable = node.getAttributeValue("matchTable");
        rt = lib.dynamicFormGenerator.needDisplayField(matchTable, matchField);
    }

    return rt;
}

function need2ndLevelDisplayFieldCheckByXML(id, validationXML) {
    var rt = false;
    var valXml = new XML();
    if (valXml.setContent(validationXML)) {
        var node = lib.xmlHelpers.getElement(valXml, id, "id");
        var matchField = node.getAttributeValue("matchField");
        var matchTable = node.getAttributeValue("matchTable");
        rt = lib.dynamicFormGenerator.need2ndLevelDisplayField(matchTable, matchField);
    }

    return rt;
}

function getDisplayField(id, validationXML, needDisplay, need2ndDisplay) {
    var displayField = null;
    var valXml = new XML();
    if (valXml.setContent(validationXML)) {
        var node = lib.xmlHelpers.getElement(valXml, id, "id");
        var matchField = node.getAttributeValue("matchField");
        var matchTable = node.getAttributeValue("matchTable");
        if (needDisplay && !need2ndDisplay) {
            displayField = lib.DisplayName.getRefTableDisplayField(matchTable);
        } else if (need2ndDisplay) {
            var refTable = lib.DisplayName.getRefTable(matchField, matchTable);
            var refTableDisplayField = lib.DisplayName.getRefTableDisplayField(refTable);
            var uniqueKeys = lib.dbdictHelper.getUniqueKey(refTable);
            var refTableKey = uniqueKeys[0];
            displayField = matchTable + "_" + matchField + "_" + refTable + "_" + refTableKey + "_" + refTable + "_" + refTableDisplayField;
        }
    }
    return displayField;
}