/** This function adds or updates a validation node based on the passed in ID.
 *	The function relys on several RAD variables being set.
 *
 *	@param {xmlString} 	-	the xml String containing the validation information
 *	@param {string} id    - the xml field name to be added/updated
 *	@return The new xml String
 *   @type xmlString
 */
function addValidation(xmlString, id) {
    var xml = new XML();

    if (xmlString == null || xmlString == "") {
        xmlString = "<validations></validations>";
    }
    if (xml.setContent(xmlString)) {
        var type = vars.$field_type;
        if (type == null || type == "") {
            type = "string";
        }
        var node = new XML(type);

        if (id != null) {
            node.setAttributeValue("id", id);
        }

        if (vars.$mandatory != "" && vars.$mandatory != null) {
            node.setAttributeValue("mandatory", vars.$mandatory);
        }
        if (vars.$readonly != "" && vars.$readonly != null) {
            node.setAttributeValue("readonly", vars.$readonly);
        }
        if (vars.$visible != "" && vars.$visible != null) {
            node.setAttributeValue("visible", vars.$visible);
        }

        if (vars.$match_type != null) {
            var lng;
            var i;
            var childNode;
            if (vars.$match_type == "table") {
                if (vars.$match_field != null && vars.$match_field != "") {
                    node.setAttributeValue("matchField", vars.$match_field);
                    node.setAttributeValue("matchTable", vars.$match_table);
                    if (vars.$multiSelections != null && vars.$multiSelections != "") {
                        node.setAttributeValue("multiSelections", vars.$multiSelections);
                    } else {
                        node.setAttributeValue("multiSelections", 0);
                    }
                }
                if (vars.$match_group != null && vars.$match_group != "" && funcs.type(vars.$match_group) == 8 && funcs.lng(funcs.denull(vars.$match_group)) > 0) {
                    lng = funcs.lng(vars.$match_group);
                    var groupNode = new XML("matchGroup");
                    for (i = 0; i < lng; i++) {
                        vars.$match_group.setType(8);
                        childNode = new XML("groupField");
                        if (vars.$match_group[i] != null && vars.$match_group[i] != "null") {
                            childNode.setValue(vars.$match_group[i]);
                            groupNode = lib.xmlHelpers.addChildElement(groupNode, childNode);
                        }
                    }
                    node = lib.xmlHelpers.addChildElement(node, groupNode);
                }
                if (vars.$query != null) {
                    node.setAttributeValue("query", vars.$query);
                }
            }
            if (vars.$match_type == "list") {
                lng = vars.$match_values.length();
                for (i = 0; i < lng; i++) {
                    if (vars.$match_values[i] != null && vars.$match_values[i] != "") {
                        var item = node.addElement("value");
                        item.setValue(vars.$match_values[i]);
                    }
                }
            } else if (vars.$match_type == "script" && vars.$script != "" && vars.$script != null) {
                node.setAttributeValue("matchScript", vars.$script);
                lng = funcs.lng(vars.$parameters);
                var paramNode = new XML("parameters");
                for (i = 0; i < lng; i++) {
                    childNode = new XML("param");
                    childNode.setValue(vars.$parameters[i]);
                    paramNode = lib.xmlHelpers.addChildElement(paramNode, childNode);
                }
                node = lib.xmlHelpers.addChildElement(node, paramNode);
            }
        }

        if (vars.$field_type == "number") {
            if (vars.$gt != null) {
                node.setAttributeValue(vars.$gte, vars.$gt);
            }
            if (vars.$lt != null) {
                node.setAttributeValue(vars.$lte, vars.$lt);
            }
        }

        if (vars.$field_type == "date") {
            var date;
            if (vars.$gt != null) {
                date = lib.tzFunctions.convertDateStringToGMT(vars.$gt, 6);
                node.setAttributeValue(vars.$gte, date);
            }
            if (vars.$lt != null) {
                date = lib.tzFunctions.convertDateStringToGMT(vars.$lt, 6);
                node.setAttributeValue(vars.$lte, date);
            }
        }

        xml = lib.xmlHelpers.addReplaceChild(xml, node, "id");

        return xml.toXMLString();
    }

    return xmlString;
}

/** This function returns the validation text for a specified dynamic field node.
 *
 *	@param {string} name    - the xml field name to be checked for validation
 *	@param {xmlString} 	-	the xml String containing the validation information
 *	@return The String containing the validation rules for the field
 *   @type String
 */
function setValidationText(name, xmlString) {
    var xml = new XML();
    var valString = "";
    if (xmlString == null || xmlString == "") {
        xmlString = "<validations></validations>";
    }
    if (xml.setContent(xmlString)) {
        var node = lib.xmlHelpers.getElement(xml, name, "id");
        if (node != null) {
            if (node.getAttributeValue("mandatory") != null && node.getAttributeValue("mandatory") != "") {
                valString += funcs.scmsg(18, "dfwxml") + "  ";
            }

            if (node.getAttributeValue("matchField") != null && node.getAttributeValue("matchTable") != null &&
                node.getAttributeValue("matchField") != "" && node.getAttributeValue("matchTable") != "") {
                valString += "Must match the " + node.getAttributeValue("matchField") +
                    " field in the " + node.getAttributeValue("matchTable") + " table.  ";
            }

            if (node.getAttributeValue("query") != null && node.getAttributeValue("query") != "") {
                valString += funcs.scmsg(19, "dfwxml") + "  " + node.getAttributeValue("matchTable") + ". ";
            }

            if (node["value"] != null) {
                valString += funcs.scmsg(13, "dfwxml") + "  ";
            }
            if (node.getAttributeValue("gt") != null && node.getAttributeValue("gt") != "") {
                valString += funcs.scmsg(14, "dfwxml") + " " + lib.tzFunctions.convertDateStringToLocal(node.getAttributeValue("gt"), 6) + ".  ";
            }
            if (node.getAttributeValue("gte") != null && node.getAttributeValue("gte") != "") {
                valString += funcs.scmsg(15, "dfwxml") + " " + lib.tzFunctions.convertDateStringToLocal(node.getAttributeValue("gte"), 6) + ".  ";
            }
            if (node.getAttributeValue("lt") != null && node.getAttributeValue("lt") != "") {
                valString += funcs.scmsg(16, "dfwxml") + " " + lib.tzFunctions.convertDateStringToLocal(node.getAttributeValue("lt"), 6) + ".  ";
            }
            if (node.getAttributeValue("lte") != null && node.getAttributeValue("lte") != "") {
                valString += funcs.scmsg(17, "dfwxml") + " " + lib.tzFunctions.convertDateStringToLocal(node.getAttributeValue("lte"), 6) + ".  ";
            }
        }

        return valString;
    }
}

/** This function determines if the requested.for is valid.  If null, it also prints a message.
 *
 *	@param {String} strRequestedFor		- the string for $requested.for field
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function requestedForIsValid(strRequestedFor) {
    if (strRequestedFor == null || strRequestedFor == "") {
        print(funcs.scmsg(1203, "fc"));
        return false;
    }
    return true;
}

/** This function determines if the dynamic form is valid or not.  If not it also prints a message that states what is not valid.
 *
 *	@param {XML String} form	    	- the dynamic form to be checked for validation
 *	@param {XML String} validations 	- The XML String containing the validation rules.
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function formIsValid(form, validations) {
    validations = lib.ScAPI_DVD_Utility.parseDateRangeValidation(validations);
    var xml = new XML();
    var valid = true;
    if (xml.setContent(form)) {
        var node = xml.getFirstChildElement();
        while (node != null && valid == true) {
            valid = elementIsValid(node, validations, form);
            node = node.getNextSiblingElement();
        }
    }

    return valid;
}


/** This function determines if a element of the dynamic form is valid or not.  If not it also prints a message that states what is not valid.
 *
 *	@param {element} element	    	- the xml element from the dynamic form to be checked for validation
 *	@param {XML String} validations 	- The XML String containing the validation rules.
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function elementIsValid(element, validations, form) {
    var xml = new XML();
    if (element != null) {
        var name = element.getAttributeValue("id");
        var label = element.getAttributeValue("label");
        var regex = element.getAttributeValue("regex");
        var regexMsg = element.getAttributeValue("regexMsg");

        var isValid = true;

        var value = element.getValue();
        var display = element.getAttributeValue("display");
        if (value == '' && display != '') {
            funcs.msg(funcs.scmsg('20', 'dfwxml', [label]));
            return false;
        }
        if (validations != null) {
            if (xml.setContent(validations)) {
                var rules = lib.xmlHelpers.getElement(xml, name, "id");
                if (rules != null) {
                    var type = rules.getName();

                    if (value == null || value == "") {
                        if (rules.getAttributeValue("mandatory") != null && rules.getAttributeValue("mandatory") != "") {
                            if (isMandatory(name, label, value, rules, form, validations)) {
                                var msg = funcs.scmsg(117, "ScriptLibrary", [label]);
                                print(msg);
                                return false;
                            }
                        }
                    }

                    if (type == "string") {
                        isValid = isValidString(name, label, value, rules, form, validations);
                    } else if (type == "number") {
                        return isValidNumber(name, label, value, rules);
                    } else if (type == "date") {
                        return isValidDate(name, label, value, rules);
                    }
                }
            }
        }
    }

    if (value && regex && type == "string") {
        var match = new RegExp(regex).test(value);
        if (!match) {
            print(regexMsg);
        }

        return match;
    }

    return isValid;
}


/** This function determines if a mandatory condition field is valid or not.  
 *
 *	@param {String} name	    	- the name of the field to be checked.
 *	@param {String} label	    	- the name of the field to be checked.
 *	@param {String} value	    	- the name of the field to be checked.
 *	@param {XML} 	rules	    	- xml of options
 *	@param {XML} 	validations	    - xml of option.validation
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function isMandatory(name, label, value, rules, form, validations) {
    var replaceValue = lib.xmlFill.replaceElementValue;
    var condition = rules.getAttributeValue("mandatory");
    var readonly = rules.getAttributeValue("readonly");
    var visible = rules.getAttributeValue("visible");

    if (condition != null && condition != "") {
        var readonlyConverted = (readonly == null || readonly == "") ? "false" : replaceValue(form, validations, readonly);
        var visibleConverted = (visible == null || visible == "") ? "true" : replaceValue(form, validations, visible);
        if (funcs.parse_evaluate(readonlyConverted, 4) || !funcs.parse_evaluate(visibleConverted, 4)) {
            return false;
        }

        var conditionConverted = replaceValue(form, validations, condition);
        var conditionEva = funcs.parse_evaluate(conditionConverted, 4);

        return conditionEva;
    }
}


/** This function determines if a string field is valid or not.  If not it also prints a message that states what is not valid.
 *
 *	@param {String} name	    	- the name of the field to be checked.
 *	@param {String} label	    	- the name of the field to be checked.
 *	@param {String} value	    	- the name of the field to be checked.
 *	@param {XML} 	rules	    	- xml of options
 *	@param {XML} 	validations	    - xml of option.validation
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function isValidString(name, label, value, rules, form, validations) {
    var field = rules.getAttributeValue("matchField");
    var table = rules.getAttributeValue("matchTable");
    var query = rules.getAttributeValue("query");
    var matchScript = rules.getAttributeValue("matchScript");
    var msg;

    var multiSelections = parseInt(rules.getAttributeValue("multiSelections"));

    if (field != null && table != null && field != "" && table != "" && value != null && value != "" && multiSelections != null) {
        var fieldValues = value.split("\n");

        var file = new SCFile(table, SCFILE_READONLY);
        file.setFields(field);
        var i;
        for (i = 0; i < fieldValues.length; i++) {
            var fieldValue = fieldValues[i];
            var sql = field + " = \"" + fieldValue + "\"";
            if (multiSelections > 1 && (fieldValue == null || fieldValue == "")) {
                continue;
            }
            if (query != null && query != '') {
                query = lib.xmlFill.replaceElementValue(form, validations, query);
                sql = sql + " and " + query;
            }

            //start for logical name
            var fields = ["*"];
            sql = funcs.generate_sql_query(fields, sql, table, false);

            if (sql === null || sql === "") {
                sql = "true";
            }
            //end for logical name

            if (file.doSelect(sql) == RC_SUCCESS) {
                continue;
            } else {
                var fDbdict = lib.dbdictHelper.initDbdictFile(table);
                var fieldType = lib.dbdictHelper.getFieldType(fDbdict, field);
                if (fieldType == 8) {
                    continue;
                }
                msg = funcs.scmsg(118, "ScriptLibrary", [fieldValue, table]);
                print(msg);
                return false;
            }
        }
        return true;
    }

    var list = rules.getFirstChildElement();

    if (list != null && !matchScript) {
        while (list != null) {
            if (list.getValue() == value) {
                return true;
            }
            list = list.getNextSiblingElement();
        }
        msg = funcs.scmsg(119, "ScriptLibrary", [value]);
        print(msg);
        return false;
    }
    return true;
}

/** This function determines if a number field is valid or not.  If not it also prints a message that states what is not valid.
 *
 *	@param {String} name	    	- the name of the field to be checked.
 *	@param {String} label	    	- the name of the field to be checked.
 *	@param {String} value	    	- the name of the field to be checked.
 *	@param {XML} 	rules	    	- the name of the field to be checked.
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function isValidNumber(name, label, value, rules) {
    if (value != null && value != "") {
        var msg;
        var PreValue = value;
        value = funcs.val(value);
        if (value == null || value != PreValue) {
            msg = funcs.scmsg(120, "ScriptLibrary", [label]);
            print(msg);
            return false;
        }

        var gt = rules.getAttributeValue("gt");
        var gte = rules.getAttributeValue("gte");
        var lt = rules.getAttributeValue("lt");
        var lte = rules.getAttributeValue("lte");

        if (gt != null && gt != "") {
            if (value <= gt) {
                msg = funcs.scmsg(121, "ScriptLibrary", [label, gt]);
                print(msg);
                return false;
            }
        }

        if (gte != null && gte != "") {
            if (value < gte) {
                msg = funcs.scmsg(122, "ScriptLibrary", [label, gte]);
                print(msg);
                return false;
            }
        }

        if (lt != null && lt != "") {
            if (value >= lt) {
                msg = funcs.scmsg(123, "ScriptLibrary", [label, lt]);
                print(msg);
                return false;
            }
        }
        if (lte != null && lte != "") {
            if (value > lte) {
                msg = funcs.scmsg(124, "ScriptLibrary", [label, lte]);
                print(msg);
                return false;
            }
        }
    }

    return true;
}

/** This function determines if a date field is valid or not.  If not it also prints a message that states what is not valid.
 *
 *	@param {String} name	    	- the name of the field to be checked.
 *	@param {String} label	    	- the name of the field to be checked.
 *	@param {String} value	    	- the name of the field to be checked.
 *	@param {XML} 	rules	    	- the name of the field to be checked.
 *	@return True if the field is valid, false if not
 *   @type Boolean
 */
function isValidDate(name, label, value, rules) {
    if (value != null && value != "") {
        var msg;
        value = funcs.val(value, 3);
        var svalue = funcs.str(value);
        //He, Peng-Fei the value will be the current time if svalue is null. So use svalue to judge if it is a valid date format
        if (svalue == null) {
            msg = funcs.scmsg(125, "ScriptLibrary", [label]);
            print(msg);
            return false;
        }

        var sgt = lib.tzFunctions.convertDateStringToLocal(rules.getAttributeValue("gt"), 6);
        var sgte = lib.tzFunctions.convertDateStringToLocal(rules.getAttributeValue("gte"), 6);
        var slt = lib.tzFunctions.convertDateStringToLocal(rules.getAttributeValue("lt"), 6);
        var slte = lib.tzFunctions.convertDateStringToLocal(rules.getAttributeValue("lte"), 6);
        var gt = funcs.val(sgt, 3);
        var gte = funcs.val(sgte, 3);
        var lt = funcs.val(slt, 3);
        var lte = funcs.val(slte, 3);

        if (gt != null && gt != "") {
            if (value <= gt) {
                msg = funcs.scmsg(121, "ScriptLibrary", [label, sgt]);
                print(msg);
                return false;
            }
        }

        if (gte != null && gte != "") {
            if (value < gte) {
                msg = funcs.scmsg(122, "ScriptLibrary", [label, sgte]);
                print(msg);
                return false;
            }
        }

        if (lt != null && lt != "") {
            if (value >= lt) {
                msg = funcs.scmsg(123, "ScriptLibrary", [label, slt]);
                print(msg);
                return false;
            }
        }
        if (lte != null && lte != "") {
            if (value > lte) {
                msg = funcs.scmsg(124, "ScriptLibrary", [label, slte]);
                print(msg);
                return false;
            }
        }
    }

    return true;
}

/** This function adds/modifies button ids for text elements that have match tables and fields.
 *
 *	@param {xmlString} 	-	the xml String containing the validation information
 *	@return The new xml String
 *   @type xmlString
 */
function addButtonIds(xmlString) {
    var xml = new XML();
    if (xmlString == null || xmlString == "") {
        xmlString = "<validations></validations>";
    }
    if (xml.setContent(xmlString)) {
        var node = xml.getFirstChildElement();
        var i = 4001;
        while (node != null) {
            if ((node.getAttributeValue("matchField") != null && node.getAttributeValue("matchTable") != null &&
                    node.getAttributeValue("matchField") != "" && node.getAttributeValue("matchTable") != "") ||
                (node.getAttributeValue("matchScript") != null && node.getAttributeValue("matchScript") != "")) {
                node.setAttributeValue("button", i);
                i++;

            } else {
                node.setAttributeValue("button", 0);
            }
            node = node.getNextSiblingElement();
        }
        return xml.toXMLString();
    }

    return xmlString;
}

/** This function adds/modifies button ids for text elements that have match tables and fields.
 *
 *	@param {validations} 	-	the xml String containing the validation information
 *	@param {form} 	-	the xml String containing the options information
 *	@param {fieldValue} -	the option value
 *	@param {id} -	the option id
 *	@return The new xml String
 *   @type boolean
 */
function isValidMatchFieldValue(fieldValue, id, form, validations) {

    if (validations == null || validations == "") {
        return true;
    }
    var xml_validation = new XML();

    if (xml_validation.setContent(validations)) {

        var element_validation = lib.xmlHelpers.getElement(xml_validation, id, "id");

        var field = element_validation.getAttributeValue("matchField");
        var table = element_validation.getAttributeValue("matchTable");
        var query = element_validation.getAttributeValue("query");

        var file = new SCFile(table, SCFILE_READONLY);
        file.setFields(field);
        var sql = field + " = \"" + fieldValue + "\"";
        if (query != null && query != '') {
            query = lib.xmlFill.replaceElementValue(form, validations, query);
            sql = sql + " and " + query;
        }

        //start for logical name
        var fields = ["*"];
        sql = funcs.generate_sql_query(fields, sql, table, false);
        if (sql === null || sql === "") {
            sql = "true";
        }
        //end for logical name
        if (file.doSelect(sql) == RC_SUCCESS) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function updateOptions() {}

function addMapping(file, id) {
    var mappings = file['option.mappings'];
    var optionNames = file['option.names'];
    if (!mappings) {
        mappings = "{}";
    }
    var json = JSON.parse(mappings);
    var item = vars.$option_mappings;

    var newItem;
    if (item) {
        // convert to GMT date value
        item = lib.dynamicFormGenerator.convertValueDate(id, item, file["option.validations"]);
        if (vars.$needMapping == true) {
            try {
                newItem = JSON.parse(item);
                json[id] = newItem;
                json = sortMappingBySelection(json, optionNames);
            } catch (e) {
                print("The condition is incorrect");
                return;
            }
        } else {
            newItem = {};
            //Default value without dependent.
            if (vars.$defaultForce) {
                newItem[item] = [{
                    "##SM_DEFAULT_FORCE##": "true"
                }];
            } else {
                newItem[item] = [{}];
            }
            newItem = [newItem];
            json[id] = newItem;
        }
    } else {
        delete json[id];
    }
    return JSON.stringify(json);
}

function sortMappingBySelection(mappings, optionNames) {
    var options = lib.ArrayUtil.toJsArray(optionNames);
    var json = mappings;
    var sortJson = {};
    var i;
    var len = options.length;
    for (i = 0; i < len; i++) {
        var name = options[i];
        if (json[name]) {
            sortJson[name] = json[name];
        }
    }
    return sortJson;
}

/**
 * Get all value of user selection
 */
function getAllOptionValues(optionsXml) {
    var values = {};
    if (!optionsXml) {
        return values;
    }
    var node = optionsXml.getFirstChildElement();
    while (node != null) {
        var id = node.getAttributeValue("id");
        var value = node.getValue();

        var type = node.getNodeName();
        //If the node is readonly, the value is option label, neeed change to value.
        if (type == "select") {
            var options = {};
            var option = node.getFirstChildElement();
            while (option != null) {
                var optionLabel = option.getAttributeValue("label");
                var optionValue = option.getValue();
                if (optionLabel && optionValue) {
                    options[optionLabel] = optionValue;
                }
                option = option.getNextSiblingElement();
            }
            if (options[value] != null) {
                value = options[value];
            }
        } else if (type == "checkbox" && value == "") {
            value = "false";
        }
        values[id] = value;
        node = node.getNextSiblingElement();
    }
    return values;
}

/**
 * Get the field List edit by user
 */
function getDifferent(values, oldValues) {
    var diff = [];
    var key;
    for (key in values) {
        if (oldValues.hasOwnProperty(key)) {
            var value = values[key].replace(/[\r\n]/g, "");
            var oldValue = oldValues[key].replace(/[\r\n]/g, "");
            if (value != oldValue) {
                diff.push(key);
            }
        }
    }
    return diff;
}
/**
 * Get mappings by user selection's Name
 */
function getMapping(field, optionMapping) {
    if (!optionMapping) {
        return null;
    }
    var mappings = JSON.parse(optionMapping);
    if (mappings[field]) {
        return mappings[field];
    } else {
        return null;
    }
}

function getMappingFields(id, file) {
    var options = file['options'];
    var optionNames = lib.ArrayUtil.toJsArray(file['option.names']);
    var fields = [];
    var index = optionNames.indexOf(id);
    if (index > -1) {
        fields = optionNames.slice(0, index);
    } else {
        fields = optionNames;
    }
    var fieldsType = getFieldTypeByOptions(options);
    //copy fields to results
    var results = [...fields];
    var i;
    var len = fields.length;
    for (i = 0; i < len; i++) {
        var field = fields[i];
        if (fieldsType[field] != "select" && fieldsType[field] != "checkbox") {
            removeByValue(results, field);
        }
    }
    return results;
}

function getFieldTypeByOptions(options) {
    var types = {};
    var optionXml = new XML();
    optionXml.setContent(options);
    var node = optionXml.getFirstChildElement();
    while (node != null) {
        var id = node.getAttributeValue("id");
        var type = node.getNodeName();
        types[id] = type;
        node = node.getNextSiblingElement();
    }
    return types;
}

function removeByValue(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * Only picklist and checkbox can be used as trigger conditions for default values, 
 * And needs to be defined in front of the current selection 
 */
function checkNeedMapping(fieldId, selections, options) {
    selections = lib.ArrayUtil.toJsArray(selections);
    var optionsXml = new XML();
    optionsXml.setContent(options);

    var i;
    var len = selections.length;
    var index = selections.indexOf(fieldId);
    //index < 0 means add user selection, index > -1 means edit
    if ((index < 0 && len < 1) || (index > -1 && len < 2)) {
        return false;
    } else {
        var optionType = {};
        var node = optionsXml.getFirstChildElement();
        while (node != null) {
            var id = node.getAttributeValue("id");
            var type = node.getNodeName();
            optionType[id] = type;
            node = node.getNextSiblingElement();
        }
        len = index < 0 ? len : index;
        for (i = 0; i < len; i++) {
            var prefield = selections[i];
            if (optionType[prefield] == "select" || optionType[prefield] == "checkbox") {
                return true;
            }
        }
    }

    return false;
}