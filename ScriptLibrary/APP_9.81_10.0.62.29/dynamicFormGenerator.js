/** @fileoverview dynamicFormGenerator

*   @author Pete Budic
*/

/** This function reads the option XML inside of the Catalog Item and sets the option names
 *  and descriptions in SC array format.
 *
 *  @param {File} fCatalogItem    - the svcCatalog record
 *  @return Boolean success or failure
 *   @type Boolean
 */
var _ = lib.Underscore.require();

function setOptionFields(fCatalogItem) {

    var xmlString;
    var xmlObject = new XML();
    var costString;

    if (fCatalogItem.options == null || fCatalogItem.options == "") {
        fCatalogItem.options = "<form></form>";
    }

    // Walk through the nodes to get the names and descriptions
    xmlString = fCatalogItem.options;
    if (!xmlObject.setContent(xmlString)) {
        fCatalogItem.options = "<form></form>";
        return false;
    }
    var names = [];
    var labels = [];
    var valDesc = [];

    var parent = xmlObject.getParentNode();
    var form = parent.getFirstChildElement();
    var node = form.getFirstChildElement();
    var i = 0;
    while (node != null) {
        names[i] = node.getAttributeValue("id");
        labels[i] = node.getAttributeValue("label");
        valDesc[i] = lib.dynamicFormValidation.setValidationText(names[i], fCatalogItem.option_validations);
        i++;

        node = node.getNextSiblingElement();
    }

    fCatalogItem.option_validations = lib.dynamicFormValidation.addButtonIds(fCatalogItem.option_validations);
    fCatalogItem.options = addButtonIds(fCatalogItem.options, fCatalogItem.option_validations);
    fCatalogItem.options = addDvdVarDependantIds(fCatalogItem);
    fCatalogItem.option_names = names;
    fCatalogItem.option_desc = labels;
    fCatalogItem.option_validation_desc = valDesc;

    return true;
}

/** This function is to evaluate visible condition of a catalog dynamic form element.
 *
 *  @param {File} fCatalogItem - the svcCatalog record.
 *  @param {XML String} form - the dynamic form to be checked for visibility.
 *  @return Boolean - whether visible or not.
 *  @type Boolean
 */
function evaluateVisible(fCatalogItem, form, condition) {

    if (condition != null && condition != "") {
        //fCatalogItem['option.validations'] for type information
        var conditionConverted = lib.xmlFill.replaceElementValue(form, fCatalogItem['option.validations'], condition);
        var conditionEva = funcs.parse_evaluate(conditionConverted, 4);
        return conditionEva == true ? "true" : "false";
    }

    return "false";
}

/** This function filter catalog dynamic form based on form elements' visible condition
 *
 *  @param {File} fCatalogItem - the svcCatalog record
 *  @param {XML String} form - the dynamic form to be filtered
 *  @return The filtered xml dynamic form
 *  @type xmlString
 */
function filterVisible(fCatalogItem, form, mode) {
    var validation = fCatalogItem.option_validations || "<validation></validation>";
    var validationXML = new XML();
    validationXML.setContent(validation);
    form = form || "<form></form>";
    var formXML = new XML();
    formXML.setContent(form);
    if (mode == "edit") {
        formXML.setAttributeValue("ignoreDvd", false);
        var formJson = xmlToJson(formXML);
        var validationJson = xmlToJson(validationXML);
        formJson = lib.dynamicFormDvd.evaluate(formJson, validationJson);
        formXML = updateXML(formXML, formJson);
    }
    //commit
    else {
        formXML.setAttributeValue("ignoreDvd", true);
        var element = formXML.getFirstChildElement();
        while (element != null) {
            var visible = element.getAttributeValue("visibleResult");
            if (visible == "false") {
                setValue(element, "");
            }
            element = element.getNextSiblingElement();
        }
    }

    return formXML.toXMLString();
}

function setDefaultValue(options, oldOptions, file, mode) {
    var optionMapping = file['option.mappings'];
    if (!optionMapping || optionMapping == "{}" || !options) {
        return options;
    }

    var mapping = JSON.parse(optionMapping);
    oldOptions = oldOptions || "<form></form>";
    var optionsXml = new XML();
    optionsXml.setContent(options);
    var oldOptionsXml = new XML();
    oldOptionsXml.setContent(oldOptions);

    var values = lib.dynamicFormValidation.getAllOptionValues(optionsXml);
    var oldValues = lib.dynamicFormValidation.getAllOptionValues(oldOptionsXml);

    var fieldsEditByUser = [];
    if (mode == "preview") {
        fieldsEditByUser = vars.$allDiff == null ? [] : vars.$allDiff;
    } else if (mode == "order" || mode == "editCart") {
        var edit = optionsXml.getAttributeValue("editByUser");
        if (edit) {
            fieldsEditByUser = edit.split(",");
        }
    }

    var diffrentValues = [];
    diffrentValues = lib.dynamicFormValidation.getDifferent(values, oldValues);
    fieldsEditByUser = lib.ArrayUtil.merge(fieldsEditByUser, diffrentValues);
    var currentElement;
    var k;
    for (k in mapping) {
        currentElement = lib.xmlHelpers.getElement(optionsXml, k, "id");
        var item = mapping[k];
        //Change by User, need keep the change
        var editByUser = false;
        if (lib.ArrayUtil.contains(fieldsEditByUser, k)) {
            editByUser = true;
        }

        //Default with dependent
        var key;
        var index;
        var length = item.length;
        for (index = 0; index < length; index++) {
            var object = item[index];
            var objectKeys = Object.keys(object);
            key = objectKeys[0];
            var fields = object[key];
            var defaultFirst;
            var flag;
            var i;
            var len = fields.length;
            for (i = 0; i < len; i++) {
                var field = fields[i];
                defaultFirst = false;
                if (field['##SM_DEFAULT_FORCE##'] != null) {
                    if (field['##SM_DEFAULT_FORCE##'] == "true") {
                        defaultFirst = true;
                    }
                    delete field['##SM_DEFAULT_FORCE##'];
                }
                flag = true;
                var id;
                for (id in field) {
                    if (field[id] != values[id]) {
                        flag = false;
                    }
                }
                if (flag == true) {
                    break;
                }
            }
            var value = null;
            if (flag == true) {
                // if key is "nullkey", clear the value
                if (key == "##SM_NULL_KEY##") {
                    value = ""
                } else {
                    value = key;
                    // convert to local date value
                    value = convertValueDate(k, value, file["option.validations"], true);
                }
            }

            if (currentElement && value != null && (editByUser == false || defaultFirst == true)) {
                currentElement.setValue(value);
                
                //add for ExternalJS
                if (currentElement.getAttributeValue("hasdisplay") == "true") {
                    currentElement.setAttributeValue("display", value);
                }

                values[k] = value;
                fieldsEditByUser = lib.dynamicFormValidation.removeByValue(lib.ArrayUtil.toJsArray(fieldsEditByUser), k);
                //If the defaultFirst is checked, set user selection to true
                if (defaultFirst == true) {
                    currentElement.setAttributeValue("isDefaultFirst", "true");
                } else {
                    currentElement.removeAttribute("isDefaultFirst");
                }
                break;
            }

            if (currentElement && value != null) {
                break;
            }

            if (currentElement) {
                currentElement.removeAttribute("isDefaultFirst");
            }
        }
    }

    if (mode == "preview") {
        vars.$allDiff = fieldsEditByUser;
    } else if (mode == "order" || mode == "editCart") {
        optionsXml.setAttributeValue("editByUser", fieldsEditByUser.toString());
    }

    return optionsXml.toXMLString();
}

/**
 * Add for default value Feature
 * This function is copy editByUser from $L.item to $L.item.before.display
 */
function setEditByUser(displayOptions, options) {
    var oldOptions = displayOptions || "<form></form>";
    var newOptions = options || "<form></form>";
    var oldXml = new XML();
    oldXml.setContent(oldOptions);
    var newXml = new XML();
    newXml.setContent(newOptions);

    var editByUser = newXml.getAttributeValue("editByUser");
    if (editByUser) {
        oldXml.setAttributeValue("editByUser", editByUser);
    } else {
        oldXml.removeAttribute("editByUser");
    }
    return oldXml.toXMLString();
}

/** This function adds a new user selection node to the options field in the catalog record
 *
 *  @param {File} fCatalogItem - the svcCatalog record
 *  @return Boolean success or failure
 *   @type Boolean
 */
function addNewSelection(fCatalogItem, type, name, desc, options, labels, costs) {
    var xmlString;
    var xmlObject = new XML();
    var setType = type;
    var multi = false;
    var style;

    if (setType == "multitext") {
        setType = "text";
        multi = true;
    }

    if (setType == "radio") {
        setType = "select";
        style = "radio";
    }

    if (setType == "combo") {
        setType = "select";
        style = "combo";
    }

    if (fCatalogItem.options == null || fCatalogItem.options == "") {
        fCatalogItem.options = "<form></form>";
    }

    if (fCatalogItem.options != null) {
        xmlString = fCatalogItem.options;
        if (!xmlObject.setContent(xmlString)) {
            fCatalogItem.options = "<form></form>";
            return false;
        }

        var parent = xmlObject.getParentNode();
        var form = parent.getFirstChildElement();

        var node = form.addElement(setType);
        node.setAttributeValue("id", name);
        node.setAttributeValue("label", desc);
        setNodeHelpAndRegex(type, node);

        if (multi == true) {
            node.setAttributeValue("multiline", "true");
        }

        if (style != null) {
            node.setAttributeValue("style", style);
        }

        if (vars.$mandatory != null && vars.$mandatory != "") {
            node.setAttributeValue("mandatory", vars.$mandatory);
        }

        if (vars.$visible != null && vars.$visible != "") {
            node.setAttributeValue("visible", vars.$visible);
        }

        if (vars.$readonly != null && vars.$readonly != "") {
            node.setAttributeValue("readonly", vars.$readonly);
        }

        fCatalogItem.option_costs = setCostAdj(fCatalogItem.option_costs, name, options, labels, costs);

        if (options != null) {
            if (setType == "select" && style == "combo") {
                var nullElement = node.addElement("option");
                nullElement.addAttribute("label", "");
            }

            var i;
            var lng = options.length();
            for (i = 0; i < lng; i++) {
                if (options[i] == null) {
                    continue;
                }

                var myLabel;
                var operand;

                if (setType == "select") {
                    var element = node.addElement("option");
                    element.setValue(options[i]);

                    if (labels.length() >= i && labels[i] != null) {
                        myLabel = labels[i];

                        if (costs.length() > i) {
                            if (costs[i] != null && parseFloat(costs[i]) != 0 && !Number.isNaN(parseFloat(costs[i]))) {
                                if (costs[i] > 0) {
                                    operand = "+";
                                } else {
                                    operand = "";
                                }
                                myLabel = labels[i] + " [" + operand + lib.money.formatCurrency(costs[i], fCatalogItem.currency) + "]";
                            }
                        }
                        element.addAttribute("label", myLabel);
                    } else {
                        element.addAttribute("label", options[i]);
                    }
                }
                if (setType == "checkbox") {
                    if (costs.length() > 0) {
                        myLabel = labels[i];
                        if (costs[i] != null && parseFloat(costs[i]) != 0 && !Number.isNaN(parseFloat(costs[i]))) {
                            if (costs[i] > 0) {
                                operand = "+";
                            } else {
                                operand = "";
                            }
                            myLabel = labels[i] + " [" + operand + lib.money.formatCurrency(costs[i], fCatalogItem.currency) + "]";
                        }
                        node.setAttributeValue("label", myLabel);
                    }
                }
            }
        }

        if (setType == "text") {
            if (fCatalogItem.option_validations != null) {
                var validations = fCatalogItem.option_validations;
                var valXML = new XML();
                var valString = validations;
                if (valXML.setContent(valString)) {
                    var valNode = lib.xmlHelpers.getElement(valXML, name, "id");
                    if (valNode != null) {
                        if (valNode.getAttributeValue("matchField") != null && valNode.getAttributeValue("matchTable") != null &&
                            valNode.getAttributeValue("matchField") != "" && valNode.getAttributeValue("matchTable") != "") {
                            node.setAttributeValue("button", 8001);
                        }
                    }
                }
            }
        }
        fCatalogItem.options = xmlObject.toXMLString();
    }

    return true;
}

function dependencyCheckOnRemove(fCatalogItem, id) {
    var hasDepend = false;
    var msg;

    if (fCatalogItem != null && fCatalogItem.options != null) {
        hasDepend = lib.svcCatalog.checkFieldDepended(fCatalogItem, id);
        if (hasDepend == true) {
            msg = funcs.scmsg(229, "svcCat", [id]);
            funcs.rtecall("msg", vars.$L_ret, msg, 3);
            return true;
        }
    }
    return false;
}


/** This function removes a user selection node from the options field in the catalog record
 *
 *  @param {File} fCatalogItem    - the svcCatalog record
 *   @param {String} id - The id of the node to be deleted.
 *  @return Boolean success or failure
 *   @type Boolean
 */
function removeSelection(fCatalogItem, id) {
    if (dependencyCheckOnRemove(fCatalogItem, id) == true) {
        return false;
    }

    var xmlObject = new XML();
    var validXML = new XML();
    if (fCatalogItem.options != null) {
        var xmlString = fCatalogItem.options;
        if (!xmlObject.setContent(xmlString)) {
            fCatalogItem.options = "<form></form>";
            return false;
        }

        var parent = xmlObject.getParentNode();
        var form = parent.getFirstChildElement();

        form = lib.xmlHelpers.removeChild(form, id, "id");

        fCatalogItem.options = form.toXMLString();
        var validXMLString;

        if (fCatalogItem.option_validations != null) {
            validXMLString = fCatalogItem.option_validations;
            if (validXML.setContent(validXMLString)) {
                validXML = lib.xmlHelpers.removeChild(validXML, id, "id");
                fCatalogItem.option_validations = validXML.toXMLString();
            }
        }
        if (fCatalogItem.option_costs != null) {
            validXMLString = fCatalogItem.option_costs;
            if (validXML.setContent(validXMLString)) {
                validXML = lib.xmlHelpers.removeChild(validXML, id, "id");
                fCatalogItem.option_costs = validXML.toXMLString();
            }
        }

        if (fCatalogItem.option_mappings != null) {
            var mappings = removeMappingById(fCatalogItem.option_mappings, id);
            fCatalogItem.option_mappings = mappings;
        }
    }

    return true;
}

function removeMappingById(optionMappings, id) {
    var mappingString = optionMappings;
    try {
        var mappings = JSON.parse(mappingString);
        if (mappings[id]) {
            delete mappings[id];
        }
        return JSON.stringify(mappings);
    } catch (e) {
        return mappingString;
    }
}

/** This function build User Selection dependency Objecct of User Selection with name="name"
 * if a -> b   b -> c   
 * the OptionRelationShip Object built as below:     
 * {"a":{"name":"a","provider":{},"toBeRemoved":false}}
 * {"b":{"name":"b","provider":{"a":{"name":"a","provider":{},"toBeRemoved":false}},"toBeRemoved":false}}
 * *{"c":{"name":"c","provider":{"b":{"name":"b","provider":{"a":{"name":"a","provider":{},"toBeRemoved":false}},"toBeRemoved":false}},"toBeRemoved":false}}
 *@param {name} the User Selection name
 */
function OptionRelationShip(name) {

    this.name = name;
    this.provider = {};
    this.toBeRemoved = false;

    this.addDepant = function(node) {
        this.provider[node.name] = node;
    };

    this.canRemove = function(removeSet) {
        if (removeSet[this.name]) {
            return true;
        }
        if (this.toBeRemoved) {
            removeSet[this.name] = "closed";
            var depName;
            for (depName in this.provider) {
                if (!(this.provider[depName].canRemove(removeSet))) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    };
}

/** This function removes a user selection node from the options field in the catalog record
 *
 *  @param {File} fCatalogItem    - the svcCatalog record
 *  @param {optionNames} - support mass delete, the options to delete
 *  @return Boolean success or failure
 *   @type Boolean
 */
function removeAllSelection(fCatalogItem, selectedOptionsNames) {
    var msg;
    var selectedOptions = [];
    var optionNames = [];
    optionNames = fCatalogItem.option_names.toArray();

    if (!(selectedOptionsNames instanceof Array)) {
        selectedOptions = selectedOptionsNames.toArray();
    } else {
        selectedOptions = selectedOptionsNames;
    }

    var cachedRelation = {};
    var removedOptions = {};

    //build dependant graph
    var i;
    for (i = 0; i < optionNames.length; i++) {
        //name is provider or giver, dependentOptions is a list of depenants.
        var dependentOptions = lib.svcCatalog.getDependentOptions(fCatalogItem, optionNames[i]);
        var srcNode = cachedRelation[optionNames[i]];
        if (!srcNode) {
            srcNode = new OptionRelationShip(optionNames[i]);
            cachedRelation[optionNames[i]] = srcNode;
        }

        var j;
        for (j = 0; j < dependentOptions.length; j++) {
            var depNode = cachedRelation[dependentOptions[j]];
            if (!depNode) {
                depNode = new OptionRelationShip(dependentOptions[j]);
                cachedRelation[dependentOptions[j]] = depNode;
            }
            srcNode.addDepant(depNode);
        }
    }

    //mark to be removed
    for (i = 0; i < selectedOptions.length; i++) {
        cachedRelation[selectedOptions[i]].toBeRemoved = true;
    }

    //check if can remove
    for (i = 0; i < selectedOptions.length; i++) {
        var name = selectedOptions[i];
        var pendingSet = {};
        _.extend(pendingSet, removedOptions);

        if (cachedRelation[name].canRemove(pendingSet)) {
            removedOptions[name] = cachedRelation[name];
        } else {
            if (lib.ArrayUtil.contains(selectedOptions, name)) {
                var providerKeys = _.keys(cachedRelation[name].provider);
                msg = funcs.scmsg(231, "svcCat", [name, providerKeys.toString().replace(/,/g, ", ")]);
                funcs.rtecall("msg", vars.$L_ret, msg, 3);
            }
        }
    }

    //begin remove
    var id;
    for (id in removedOptions) {
        var xmlObject = new XML();
        var validXML = new XML();
        if (fCatalogItem.options != null) {
            var xmlString = fCatalogItem.options;
            if (!xmlObject.setContent(xmlString)) {
                fCatalogItem.options = "<form></form>";
                return false;
            }

            var parent = xmlObject.getParentNode();
            var form = parent.getFirstChildElement();
            form = lib.xmlHelpers.removeChild(form, id, "id");
            fCatalogItem.options = form.toXMLString();
            var validXMLString;

            if (fCatalogItem.option_validations != null) {
                validXMLString = fCatalogItem.option_validations;
                if (validXML.setContent(validXMLString)) {
                    validXML = lib.xmlHelpers.removeChild(validXML, id, "id");
                    fCatalogItem.option_validations = validXML.toXMLString();
                }
            }
            if (fCatalogItem.option_costs != null) {
                validXMLString = fCatalogItem.option_costs;
                if (validXML.setContent(validXMLString)) {
                    validXML = lib.xmlHelpers.removeChild(validXML, id, "id");
                    fCatalogItem.option_costs = validXML.toXMLString();
                }
            }

            if (fCatalogItem.option_mappings != null) {
                var mappings = removeMappingById(fCatalogItem.option_mappings, id);
                fCatalogItem.option_mappings = mappings;
            }
        }
    }

    return true;
}

/** This function returns the XML element that has the id attribute of the passed in String
 *
 *  @param  {XML String} xmlString    - the xml that contains the dynamic form information
 *   @param     {String} id - The id of the node to be returned.
 *  @return The element corresponding to the passed in ID.
 *   @type  XML
 */
function getElementById(xmlString, id) {
    if (!xmlString) {
        return null;
    }

    var element = new XML();
    element.setContent(xmlString);

    return lib.xmlHelpers.getElement(element, id, "id");
}

/** This function replaces an existing user selection node to the options field in the catalog record
 *
 *  @param {File} fCatalogItem    - the svcCatalog record
 *  @return XML String the new XML String
 *   @type Boolean
 */
function replaceSelection(fCatalogItem, type, oldname, name, desc, options, labels, costs) {
    var xmlString;
    var xmlObject = new XML();
    var newXml = new XML();
    var replaceXml = new XML();
    var setType = type;
    var multi = false;
    var style;

    xmlString = fCatalogItem.options;

    if (setType == "multitext") {
        setType = "text";
        multi = true;
    }

    if (setType == "radio") {
        setType = "select";
        style = "radio";
    }

    if (setType == "combo") {
        setType = "select";
        style = "combo";
    }

    if (xmlString != null) {
        if (!xmlObject.setContent(xmlString)) {
            return false;
        }

        var parent = xmlObject.getParentNode();
        var form = parent.getFirstChildElement();
        var node = form.getFirstChildElement();

        newXml.setContent("<form></form>");
        replaceXml.setContent("<form></form>");
        var newParent = newXml.getParentNode();
        var newForm = newParent.getFirstChildElement();

        // We don't have a node.removeChild() function, so we have to rebuild the entire
        // XML and leave out what we are removing.
        while (node != null) {
            if (node.getAttributeValue("id") != oldname) {
                newForm = lib.xmlHelpers.addChildElement(newForm, node);
            } else {
                var replacenode = replaceXml.addElement(setType);
                replacenode.setAttributeValue("id", name);
                replacenode.setAttributeValue("label", desc);
                setNodeHelpAndRegex(type, replacenode);

                if (multi == true) {
                    replacenode.setAttributeValue("multiline", "true");
                }

                if (style != null) {
                    replacenode.setAttributeValue("style", style);
                }

                if (vars.$mandatory != null && vars.$mandatory != "") {
                    replacenode.setAttributeValue("mandatory", vars.$mandatory);
                }

                if (vars.$visible != null && vars.$visible != "") {
                    replacenode.setAttributeValue("visible", vars.$visible);
                }

                if (vars.$readonly != null && vars.$readonly != "") {
                    replacenode.setAttributeValue("readonly", vars.$readonly);
                }

                fCatalogItem.option_costs = setCostAdj(fCatalogItem.option_costs, name, options, labels, costs);

                if (fCatalogItem.option_costs == null) {
                    fCatalogItem.option_costs = "<costs/>";
                }

                if (options == null) {
                    continue;
                }

                if (setType == "select" && style == "combo") {
                    var nullElement = replacenode.addElement("option");
                    nullElement.addAttribute("label", "");
                }
                var lng = options.length();
                var i;
                for (i = 0; i < lng; i++) {
                    if (options[i] == null) {
                        continue;
                    }

                    var myLabel;
                    var operand;

                    if (setType == "select") {
                        var element = replacenode.addElement("option");
                        element.setValue(options[i]);
                        element.addAttribute("id", "" + i);
                        if (labels[i] != null) {
                            myLabel = labels[i];

                            if (costs.length() > i) {
                                if (costs[i] != null && parseFloat(costs[i]) != 0 && !Number.isNaN(parseFloat(costs[i]))) {
                                    if (costs[i] > 0) {
                                        operand = "+";
                                    } else {
                                        operand = "";
                                    }
                                    myLabel = labels[i] + " [" + operand + lib.money.formatCurrency(costs[i], fCatalogItem.currency) + "]";
                                }
                            }
                            element.addAttribute("label", myLabel);
                        } else {
                            element.addAttribute("label", options[i]);
                        }
                    }
                    if (setType == "checkbox") {
                        if (costs.length() > 0) {
                            myLabel = labels[i];
                            if (costs[i] != null && parseFloat(costs[i]) != 0 && !Number.isNaN(parseFloat(costs[i]))) {
                                if (costs[i] > 0) {
                                    operand = "+";
                                } else {
                                    operand = "";
                                }
                                myLabel = labels[i] + " [" + operand + lib.money.formatCurrency(costs[i], fCatalogItem.currency) + "]";
                            }
                            replacenode.setAttributeValue("label", myLabel);
                        }
                    }
                }

                newForm = lib.xmlHelpers.addChildElement(newForm, replacenode);
            }
            node = node.getNextSiblingElement();
        }

        fCatalogItem.options = newXml.toXMLString();
        return true;
    }

    return true;
}

/**  This function is used to set the dynamic form content for bundle options.
 *
 *  @param {Record} record - The current bundle record
 */
function setBundleOptions(record) {
    if (record.type != "bundle") {
        return;
    }
    var add = false;

    // Initialize the localized version of the catalog record
    var svcDisplay = new SCFile("svcDisplay");
    var sql = "name=\"" + record.name + "\" and syslanguage~=\"xxx\"";

    if (svcDisplay.doSelect(sql) == RC_SUCCESS) {
        do {
            var options = new XML();
            record.option_instructions = "";
            options.setContent("<form></form>");

            var bundle = record.bundle;

            var i;
            var length = bundle.length();
            for (i = 0; i < length; i++) {
                var node;
                var label;
                var operator;

                if (bundle[i].item_option == "mandatory") {
                    node = options.addElement("label");
                    node.setAttributeValue("id", "opt" + (i + 1));
                    label = "(" + bundle[i].item_quantity + ") " + getLocalizedName(bundle[i].item_name, svcDisplay.syslanguage);
                    node.setValue(label);
                } else if (bundle[i].item_option == "default") {
                    node = options.addElement("checkbox");
                    node.setAttributeValue("id", "opt" + (i + 1));
                    label = "(" + bundle[i].item_quantity + ") " + getLocalizedName(bundle[i].item_name, svcDisplay.syslanguage);

                    if (bundle[i].item_cost_adj != 0 && bundle[i].item_cost_adj != null) {
                        operator;
                        if (bundle[i].item_cost_adj > 0) {
                            operator = "+";
                        }
                        label = label + " [" + operator + lib.money.formatCurrency(bundle[i].item_cost_adj, record.currency) + "]";
                    }
                    node.setAttributeValue("label", label);
                    node.setValue("true");
                } else if (bundle[i].item_option == "optional") {
                    node = options.addElement("checkbox");
                    node.setAttributeValue("id", "opt" + (i + 1));
                    label = "(" + bundle[i].item_quantity + ") " + getLocalizedName(bundle[i].item_name, svcDisplay.syslanguage);

                    if (bundle[i].item_cost_adj != 0 && bundle[i].item_cost_adj != null) {
                        operator;
                        if (bundle[i].item_cost_adj > 0) {
                            operator = "+";
                        }
                        label = label + " [" + operator + lib.money.formatCurrency(bundle[i].item_cost_adj, record.currency) + "]";
                    }
                    node.setAttributeValue("label", label);
                }
            }

            svcDisplay.options = options.toXMLString();
            svcDisplay.doUpdate();
        }
        while (svcDisplay.getNext() == RC_SUCCESS);
    }
}

/**  This function is used to determine if a bundle should be ordered.
 *
 *  @param {Record} record - The current bundle record
 *   @returns  Whether or not the bundle line should be added.
 *   @type Boolean
 */
function checkBundle(record, line, level, bundleItem) {
    var form = new XML();
    var recordForm = new XML();
    var strName = funcs.filename(record);

    if (strName == "svcCatalog") {
        var sql = "name=\"" + record.name + "\"";
        record = new SCFile("joinsvcDisplay", SCFILE_READONLY);
        record.setFields("options");
        record.doSelect(sql);
    }

    if (level > 1 && bundleItem != null) {
        form.setContent(bundleItem);
    } else if (record.options != null) {
        form.setContent(record.options);
    } else {
        form = null;
    }

    if (form) {
        var node = lib.xmlHelpers.getElement(form, line, "id");

        if (node != null) {
            if (node.getValue() == "true") {
                return true;
            }
            // Otherwise we get the value from the cart item options
            else {
                var name = node.getNodeName();
                var nodeLabel = node.getAttributeValue("label");

                if (record.bundle_options != null) {
                    recordForm.setContent(record.bundle_options);

                    var bElement = lib.svcCatBundles.getBundleElement(recordForm, line, "id", name, nodeLabel);
                    if (bElement != null) {
                        if (bElement.getValue() == "true") {
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false;
}

/** This function adds/modifies button ids for text elements that have match tables and fields.
 *
 *  @param {xmlString}  -   the xml String containing the option information
 *  @param {validationString}   -   the xml String containing the validation information
 *  @return The new xml String
 *   @type xmlString
 */
function addButtonIds(xmlString, validationString) {
    var xml = new XML();
    var valXML = new XML();

    if (valXML.setContent(validationString)) {
        if (xml.setContent(xmlString)) {
            var node = xml.getFirstChildElement();
            var matchField = "";
            var matchTable = "";
            while (node != null) {
                if (node.getAttributeValue("id") != null) {
                    var valElement = lib.xmlHelpers.getElement(valXML, node.getAttributeValue("id"), "id");
                    if (valElement != null) {
                        if (valElement.getAttributeValue("button") != null && valElement.getAttributeValue("button") != "0") {
                            node.setAttributeValue("button", valElement.getAttributeValue("button"));

                            //Start,added by Henrry for logical name
                            var multiselection = node.getAttributeValue("multiSelections");
                            var cursorLine = node.getAttributeValue("cursorLine");
                            matchField = valElement.getAttributeValue("matchField");
                            matchTable = valElement.getAttributeValue("matchTable");
                            if (needDisplayField(matchTable, matchField)) {
                                node.setAttributeValue("hasdisplay", "true");
                                var displayName = "";
                                var refTable;
                                if (multiselection != null && multiselection != "" && multiselection != "0" && multiselection != "1") {
                                    node.removeAttribute("display");
                                    var arrayValue = [];
                                    if (node.getValue() !== null && node.getValue() !== "" && node.getValue() !== undefined) {
                                        arrayValue = node.getValue().split("\n");
                                    }
                                    var i;
                                    for (i = 1; i < 1000; i++) {
                                        var removeResult = node.removeAttribute("display" + i);
                                        if (removeResult === null || removeResult === "") {
                                            break;
                                        }
                                    }
                                    var a;
                                    for (a = 0; a < arrayValue.length; a++) {
                                        displayName = lib.DisplayName.getDisplayNameById(matchTable, arrayValue[a]);
                                        if (need2ndLevelDisplayField(matchTable, matchField)) {
                                            refTable = lib.DisplayName.getRefTable(matchField, matchTable);
                                            displayName = lib.DisplayName.getDisplayNameById(refTable, arrayValue[a]);
                                        }
                                        //QCCR1E158897, set displayName to "" instead of setting string value "null" back to xml string.
                                        if (displayName == null) {
                                            displayName = "";
                                        }
                                        //end                   
                                        node.setAttributeValue("display" + (a + 1), displayName);
                                    }
                                } else {
                                    if (node.getValue() === "" || node.getValue() === null) {
                                        node.removeAttribute("display");
                                    } else {
                                        displayName = lib.DisplayName.getDisplayNameById(matchTable, node.getValue());
                                        if (need2ndLevelDisplayField(matchTable, matchField)) {
                                            refTable = lib.DisplayName.getRefTable(matchField, matchTable);
                                            displayName = lib.DisplayName.getDisplayNameById(refTable, node.getValue());
                                        }
                                        node.setAttributeValue("display", displayName);
                                    }
                                }
                            }
                            if (valElement.getAttributeValue("matchScript")) {
                                node.setAttributeValue("hasdisplay", "true");
                            }
                            //End
                            if (valElement.getAttributeValue("multiSelections") != null && valElement.getAttributeValue("multiSelections") != "0") {
                                node.setAttributeValue("multiSelections", valElement.getAttributeValue("multiSelections"));
                            }
                        }
                    }
                }

                node = node.getNextSiblingElement();
            }

            return xml.toXMLString();
        }
    }

    return xmlString;
}

/** This function creates or edits the cost XML associated with an option.
 *
 *  @param {costString}     -   the xml String containing the cost information
 *   @param {name}  -               the name of the element to be added/modified in the cost information
 *  @param {options}        -   the list of options that should be added
 *  @param {labels}         -   the labels of the options without the cost adjustments
 *  @param {costs}          -   the cost adjustments associated to these options
 *  @return The xmlString for the cost information
 *   @type xmlString
 */
function setCostAdj(costString, name, options, labels, costs) {
    var costObject = new XML();
    if (costString == null) {
        costString = "<costs/>";
    }

    if (costObject.setContent(costString)) {
        var node = new XML("selectnode");
        node.setAttributeValue("id", name);
        if (options != null) {
            var i;
            var length = options.length();
            for (i = 0; i < length; i++) {
                if (options[i] != null) {
                    var opt = new XML("option");
                    opt.setValue(options[i]);

                    if (labels.length() >= i && labels[i] != null) {
                        opt.setAttributeValue("label", labels[i]);
                    }
                    if (costs.length() > 0 && costs[i] != null) {
                        opt.setAttributeValue("costadj", costs[i]);
                    }

                    node = lib.xmlHelpers.addChildElement(node, opt);
                }
            }
        }
        costObject = lib.xmlHelpers.addReplaceChild(costObject, node, "id");
    }

    return costObject.toXMLString();
}

/** This function returns an option cost if there is an associated cost adjustment.
 *
 *  @param {optionXML}  -       the xml  containing the option information
 *  @param {value} -            the value of the option
 *  @return The cost adjustment for that value
 *   @type xmlString
 */
function getOptionCost(optionXML, value) {
    if (optionXML != null) {
        var node = optionXML.getFirstChildElement();

        while (node != null) {
            if (node.getValue() == value) {
                return node.getAttributeValue("costadj");
            }
            node = node.getNextSiblingElement();
        }
    }
    return null;
}

/** This function returns an option label if there is an associated cost adjustment.
 *
 *  @param {optionXML}  -       the xml  containing the option information
 *  @param {value} -            the value of the option
 *  @return The cost adjustment for that value
 *  @return The  label
 *   @type xmlString
 */
function getOptionLabel(optionXML, value) {
    if (optionXML != null) {
        var node = optionXML.getFirstChildElement();

        while (node != null) {
            if (node.getValue() == value) {
                return node.getAttributeValue("label");
            }
            node = node.getNextSiblingElement();
        }
    }
    return null;
}

/** This function sets the variable $L.connector.names list based on what has already been used
 *   The list should not display the fields that have already been used once in user selection.
 *
 *  @param {aOptionnames}   -   The array of fields already used in userselection for the catalog item
 *  @return true
 *   @type Boolean
 */
function getFieldNames(aOptionNames) {

    if (aOptionNames != null) {
        var myIndex = 0;
        var aNames = [];

        aNames = aOptionNames.toArray();

        var i;
        for (i = 0; i < aNames.length; i++) {
            var strOption = aNames[i];
            myIndex = funcs.index(strOption, vars.$L_connector_names);

            if (myIndex > 0) {
                vars.$L_connector_names = funcs._delete(vars.$L_connector_names, myIndex);
            }
        }
    }

    return true;
}


/** This function sets the option string based on the newly rearranged user selections by the user.
 *   This is assuming the id (option.names) in the user selection list to be unique for each user selection.
 *
 *  @param {aOptionNames}   -   The array of fields already used in userselection for the catalog item
 *  @param optionXML        -   The xml  containing the option information.
 *  @return true
 *   @type Boolean
 */
function rearrangeOptionFields(aOptionNames, optionXML) {
    if (aOptionNames != null && optionXML != null) {
        vars.$L_file.options = rearrangeFields(aOptionNames, optionXML);
    }
}

function rearrangeCostFields(aOptionNames, optionCostXML) {
    if (aOptionNames != null && optionCostXML != null) {
        vars.$L_file.option_costs = rearrangeFields(aOptionNames, optionCostXML);
    }
}

function rearrangeFields(aOptionNames, optionXML) {
    var options = new XML();
    options.setContent("<form></form>");

    var xml = new XML();
    xml.setContent(optionXML);

    var aIds = [];
    aIds = aOptionNames.toArray();

    var i;
    for (i = 0; i < aIds.length; i++) {
        var node = lib.xmlHelpers.getElement(xml, aIds[i], "id");

        if (node != null) {
            options = lib.xmlHelpers.addChildElement(options, node);
        }
    }

    return options.toXMLString();
}

/** This function returns the localized item name.
 *
 *  @param name             -   The non localized name of the catalog item the catalog item
 *  @param syslanguage      -   The language that the item should be searched on
 *  @return displayName
 *   @type String
 */
function getLocalizedName(name, syslanguage) {
    if (syslanguage == null || syslanguage == "") {
        syslanguage = lib.svcCatalogLocalizeData.getCurrentLanguage();
    }

    var fsvcDisplay = new SCFile("svcDisplay", SCFILE_READONLY);
    fsvcDisplay.setFields("displayName");
    var sql = "name=\"" + name + "\" and syslanguage=\"" + syslanguage + "\"";

    if (fsvcDisplay.doSelect(sql) == RC_SUCCESS) {
        return fsvcDisplay.displayName;
    } else {
        return name;
    }
}

function checkUserSelectionExisted(name, oldName, actionType, record) {
    var b = true;
    var sn = null;
    var xml = new XML();
    if (xml.setContent(record.options)) {
        if ("add" == actionType) {
            sn = name;
        } else if ("edit" == actionType) {
            if (name != oldName) {
                sn = name;
            }
        }
        if (sn != null) {
            var elem = lib.xmlHelpers.getElement(xml.getDocumentElement(), name, "id");
            b = (elem == null);
        }
    }
    return b;
}

function checkPicklistDuplicated(pickList, pickListLabel, pickListCost) {
    var b = true;
    var isValid = function(idx) {
        var pl = ((pickList && idx < funcs.denull(pickList).length()) ? pickList[idx] : null);
        var pll = ((pickListLabel && idx < funcs.denull(pickListLabel).length()) ? pickListLabel[idx] : null);
        var plc = ((pickListCost && idx < funcs.denull(pickListCost).length()) ? pickListCost[idx] : null);
        b = ((pl != null && pll != null && plc != null) || (!pl && !pll && !plc));

        return b;
    };

    if (pickList != null) {
        var i;
        var j;
        var length = funcs.denull(pickList).length();
        for (i = 0; b && i < length; i++) {

            if (isValid(i) && pickList[i]) {
                for (j = i + 1; j < length; j++) {
                    if (pickList[i] == pickList[j]) {
                        b = false;
                        break;
                    }
                }
            }
        }
    }
    return b;
}

/*
 * The cost in pick list must be a postive number
 *
 */
function checkPicklistCost(pickListCost) {
    var i;
    var length = pickListCost.length();
    for (i = 0; i < length; i++) {
        if (pickListCost[i] != null && pickListCost[i] != "") {
            if (Number.isNaN(pickListCost[i])) { //check if cost is number 
                return false;
            }
            var tmpNum = Number(pickListCost[i]);
            if (tmpNum < 0) { //check if cost is negative
                return false;
            }
        }
    }
    return true;
}

/** QCCR1E108158
 * Convert the option definition in option XML to local option definitions
 * @param {string} form - The option XML string in svcCartItem
 * @param {string} displayForm - The option XML string in svcDisplay
 * @return the converted option XML string
 **/
function convertFormDisplay(form, displayForm) {
    var xml = new XML();
    var displayXml = new XML();
    if (xml.setContent(form) && displayXml.setContent(displayForm)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            convertElementField(node, displayXml);
            node = node.getNextSiblingElement();
        }
    }

    return xml.toXMLString();
}


/** QCCR1E108158
 * Convert each option definition field of the option XML to local option definition in svcDisplay
 * @param {string} element - The element of the option XML string
 * @param {string} displayXml - The option XML Object in svcDisplay
 * @return the converted element of the option XML
 **/
function convertElementField(element, displayXml) {
    if (element != null && displayXml != null) {
        var id = element.getAttributeValue("id");
        var value = element.getValue();
        var name_id = element.getName();
        var option;
        if (id != null && id != "") {
            option = lib.xmlHelpers.getElement(displayXml, id, "id");
        } else {
            option = lib.xmlHelpers.getElementByValue(displayXml, value);
        }

        if (option != null) {
            var label = option.getAttributeValue("label");
            var name = option.getName();

            if (name == name_id) {
                element.setAttributeValue("label", label);

                //localize the child option label
                if (name == "select") {
                    var optionNode = element.getFirstChildElement();

                    while (optionNode != null) {
                        convertElementField(optionNode, option);
                        optionNode = optionNode.getNextSiblingElement();
                    }
                }
            }
        } else if (name_id == "option") {
            var elementValue = element.getValue();
            var childOption = lib.xmlHelpers.getElementByValue(displayXml, elementValue);
            if (childOption != null) {
                var optionLabel = childOption.getAttributeValue("label");
                var optionValue = childOption.getValue();

                if (optionValue == elementValue) {
                    element.setAttributeValue("label", optionLabel);
                }
            }
        }
    }
}

/** QCCR1E108158
 * Convert the options together with value in option XML from local to original one before display 
 * @param {string} form - The original option XML string in svcCartItem
 * @param {string} displayForm - The option XML string used for display 
 * @return the converted option XML string
 **/
function convertFormValue(form, displayForm) {
    var xml = new XML();
    var displayXml = new XML();
    if (xml.setContent(form) && displayXml.setContent(displayForm)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            convertElementFieldValue(node, displayXml);
            node = node.getNextSiblingElement();
        }
    }

    return xml.toXMLString();
}

/** QCCR1E108158
 * Convert one option together with value in option XML from local to original one before display 
 * @param {string} element - The element of the option XML string
 * @param {string} displayXml - The option XML Object of display
 * @return the converted element of the option XML
 **/
function convertElementFieldValue(element, displayXml) {
    if (element != null && displayXml != null) {
        var id = element.getAttributeValue("id");
        var name_id = element.getName();
        var option = lib.xmlHelpers.getElement(displayXml, id, "id");
        if (option != null) {
            var value = option.getValue();
            var cusorLineValue = option.getAttributeValue("cursorLine");
            var visibleValue = option.getAttributeValue("visibleResult");

            var name = option.getName();
            if (name == name_id) {
                lib.xmlHelpers.setValue(element, value);
                var display = option.getAttributeValue("display");
                if (display) {
                    element.setAttributeValue("display", display);
                }
                if (cusorLineValue != null && cusorLineValue != "") {
                    element.setAttributeValue("cursorLine", cusorLineValue);
                }
                if (visibleValue != null && visibleValue != "") {
                    element.setAttributeValue("visibleResult", visibleValue);
                }
            }
        }

    }

    return element;
}

/** QCCR1E87767
 * Convert the date value in option XML to local time or GMT time
 * @param {string} form - The option XML string
 * @param {string} validations - The validations XML string
 * @param {boolean} tolocal - true when convert GMT to local time, false when convert local time to GMT
 * @return the converted option XML string
 **/
function convertFormDate(form, validations, tolocal) {
    if (tolocal == null) {
        tolocal = true;
    }

    var xml = new XML();
    if (xml.setContent(form)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            convertElementDate(node, validations, tolocal);
            node = node.getNextSiblingElement();
        }
    }

    return xml.toXMLString();
}

/** QCCR1E87767
 * Convert the date value in the element of the option XML to local time or GMT time
 * Assumpt that the date value is validated.
 * @param {string} form - The element of the option XML string
 * @param {string} validations - The validations XML string
 * @param {boolean} tolocal - true when convert GMT to local time, false when convert local time to GMT
 * @return the converted element of the option XML
 **/
function convertElementDate(element, validations, tolocal) {
    if (element != null && validations != null) {
        var xml = new XML();
        if (xml.setContent(validations)) {
            var name = element.getAttributeValue("id");
            var rules = lib.xmlHelpers.getElement(xml, name, "id");
            if (rules != null) {
                var value = element.getValue();
                if (value == null || value == "") {
                    return element;
                }

                var type = rules.getName();
                element.setAttributeValue("type", type); //add for QCCR1E119980
                if (type == "date") {
                    value = convertDateString(value, tolocal);
                    element.setValue(value);
                }
            }
        }
    }

    return element;
}

/**
 * Convert the date value to local time or GMT time
 * Assumpt that the date value is validated.
 *
 * @param {String} name - The name of the option
 * @param {String} value - The value of the option
 * @param {String} validations - The validations XML string
 * @param {Boolean} tolocal - true when convert GMT to local time, false when convert local time to GMT
 * @returns {String}  the converted element of the option XML
 **/
function convertValueDate(name, value, validations, tolocal) {
    if (name != null && value != null && validations != null) {
        var xml = new XML();
        if (xml.setContent(validations)) {
            var rules = lib.xmlHelpers.getElement(xml, name, "id");
            if (rules != null) {
                var type = rules.getName();
                if (type == "date") {
                    value = convertDateString(value, tolocal);
                }
            }
        }
    }

    return value;
}

function convertDateString(dateValue, tolocal) {
    if (tolocal) {
        return lib.tzFunctions.convertDateStringToLocal(dateValue, 6);
    } else {
        return lib.tzFunctions.convertDateStringToGMT(dateValue, 6);
    }
}

/**
 * This function will be called in Process 'svcCat.apply.useroption.template' :
 *  $L.void=jscall("dynamicFormGenerator.applyTemplate", $L.file, $L.wiz.copy)
 *  $L_file: joinsvcDisplay
 *  $L_temp: svcOptionsTemplate
 *  @date 2014-03-20
 */
function applyTemplate(catalogFile, templateFile) {
    catalogFile.option_instructions = templateFile.option_instructions;
    catalogFile.options = applyTemplateForField(catalogFile['options'], templateFile['options']);
    catalogFile.option_validations = applyTemplateForField(catalogFile.option_validations, templateFile.option_validations);
    catalogFile.option_costs = applyTemplateForField(catalogFile.option_costs, templateFile.option_costs);
    catalogFile.option_mappings = applyTemplateDefaultMappings(catalogFile.option_mappings, templateFile.option_mappings);
    return setOptionFields(catalogFile);
}


function hasDuplicateOptions(catalog, template) {
    var duplicate = [];
    var templateOptions = template['option.names'].toArray();
    var catalogOptions = catalog['option.names'].toArray();

    var i;
    var len = templateOptions.length;
    for (i = 0; i < len; i++) {
        var value = templateOptions[i];
        if (catalogOptions.indexOf(value) > -1) {
            duplicate.push(value);
        }
    }

    if (duplicate.length > 0) {
        return duplicate.toString().replace(/,/g, ", ");
    } else {
        return false;
    }
}

/**
 * This function is used to apply template for dedicated fields of joinsvcDisplay table
 *  
 *  fieldXml: XML String value of joinsvcDisplay[filedName]
 *  templateXml: XML String value of svcOptionsTemplate[filedName]

 *  @date 2014-03-20
 */
function applyTemplateForField(fieldXml, templateXml) {

    var xmlString = new XML();
    var newXml = new XML();

    if (fieldXml == null || fieldXml == "") {
        return templateXml;
    }

    if (newXml.setContent(templateXml) && xmlString.setContent(fieldXml)) {
        var newParent = newXml.getParentNode();
        var newForm = newParent.getFirstChildElement();
        var node = newForm.getFirstChildElement();
        while (node != null) {
            xmlString = lib.xmlHelpers.addReplaceChild(xmlString, node, "id");
            node = node.getNextSiblingElement();
        }
    }
    return xmlString.toXMLString();
}

/***
 * This function is used to Apply the default values configuration in the template to svcCatalog.
 */
function applyTemplateDefaultMappings(catalogFileMappings, templateMappings) {
    var mergeResult = {};
    if (catalogFileMappings) {
        mergeResult = JSON.parse(catalogFileMappings);
    }
    if (templateMappings) {
        var template = JSON.parse(templateMappings);
        var field;
        for (field in template) {
            mergeResult[field] = template[field];
        }
    }
    if (Object.keys(mergeResult).length > 0) {
        return JSON.stringify(mergeResult);
    } else {
        return null;
    }
}

/** calculate if current selected User selection can be moved up or down, return true if can be moved, or else return false
 *  selectedRow:  Current selected User Option row: e.g: 3
 *  aNames:       Array value of option.names of svcCatalog: e.g: ["ab", "cd" "de"]
 *  aRows:        Array value of selected User Selection Rows: e.g: ["3","5"]
 *  upOrDown:     move up or down, UP:0 Down:1

 *  @date 2014-04-06
 */
function canUserSelectionMove(selectedRow, aRows, aNames, upOrDown) {

    if (selectedRow != null) //means move up
    {
        var nextRow = (upOrDown == 0) ? (selectedRow - 1) : ((upOrDown == 1) ? (selectedRow + 1) : null);

        if (!lib.ArrayUtil.contains(aRows, nextRow)) {
            if (aNames[nextRow - 1] != null) {
                return true;
            } else {
                return false;
            }
        } else {
            return canUserSelectionMove(nextRow, aRows, aNames, upOrDown);
        }
    }

    return false;
}

/**
 * This function will be called in Process 'svcCat.move.useroption.up' and 'svcCat.move.useroption.down':
 * $L.canmove=jscall("dynamicFormGenerator.canUserSelectionsMoveupOrDown", $L.selectrows, option.names in $L.file, 1)
 *  selectedRows: selected User Option rows: e.g: {3, 5}
 *  aOptionNames: option.names of svcCatalog: e.g: {"ab", "cd" "de"}
 *  upOrDown: move up or down, UP:0 Down:1
 *  @date 2014-04-06
 */
function canUserSelectionsMoveupOrDown(selectedRows, aOptionNames, upOrDown) {

    if (aOptionNames != null && selectedRows != null) {
        var canMove = [];
        var aNames = [];
        if (!(aOptionNames instanceof Array)) {
            aNames = aOptionNames.toArray();
        } else {
            aNames = aOptionNames;
        }
        var aRows = [];
        if (!(selectedRows instanceof Array)) {
            aRows = selectedRows.toArray();
        } else {
            aRows = selectedRows;
        }

        var i;
        for (i = 0; i < aRows.length; i++) {
            var selectedRow = parseInt(aRows[i]);
            canMove[i] = canUserSelectionMove(selectedRow, aRows, aNames, upOrDown);
        }

        return canMove;
    }

    return null;
}

/**
 *  This function is to check if moving up or down will break the dependency between userselection
 *  @selectedRows: selected User Option rows: e.g: {3, 5}
 *  @canRemove Whether the selected User Option can be moved： e.g {true, false}
 *  @optionNames: option.names of svcCatalog: e.g: {"country", "color", "version"}
 *  @upOrDown: move up or down, UP:0 Down:1
 *  @mappings the option.mappings in svcCatalog
 */
function checkMappingDependency(selectedRows, file, upOrDown) {
    var mappings = file['option.mappings'];
    var optionNames = file['option.names'];

    if (!selectedRows || mappings == null || mappings == "{}") {
        return true;
    }
    var canMove = false;
    if (upOrDown == 0) {
        canMove = checkMoveUp(selectedRows, optionNames, mappings);
    } else if (upOrDown == 1) {
        canMove = checkMoveDown(selectedRows, optionNames, mappings);
    }
    return canMove;
}

function checkMoveUp(selectedRows, optionNames, mappings) {
    var i;
    var len = selectedRows.length();
    for (i = 0; i < len; i++) {
        var index = selectedRows[i];
        if (index == 1) {
            continue;
        }
        var preIndex = index - 1;
        while (lib.ArrayUtil.contains(selectedRows, preIndex) && preIndex > 0) {
            preIndex = preIndex - 1;
        }

        if (preIndex > 0) {
            var field = optionNames[index - 1];
            var prefield = optionNames[preIndex - 1];
            var mapping = lib.dynamicFormValidation.getMapping(field, mappings);
            if (mapping) {
                var key;
                for (key in mapping) {
                    var item = mapping[key];
                    var value;
                    for (value in item) {
                        var conditions = item[value];
                        var ci;
                        var clen = conditions.length;
                        for (ci = 0; ci < clen; ci++) {
                            var condition = conditions[ci];
                            var con;
                            for (con in condition) {
                                if (prefield == con) {
                                    var msg = funcs.scmsg(232, "svcCat", [field, prefield]);
                                    funcs.rtecall("msg", vars.$L_ret, msg, 3);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

function checkMoveDown(selectedRows, optionNames, mappings) {
    var i;
    var len = selectedRows.length();
    var optionLen = optionNames.length();
    for (i = 0; i < len; i++) {
        var index = selectedRows[i];
        if (index == optionLen) {
            continue;
        }

        var nextIndex = index + 1;
        while (lib.ArrayUtil.contains(selectedRows, nextIndex) && nextIndex < optionLen) {
            nextIndex = nextIndex + 1;
        }

        if (nextIndex < optionLen + 1) {
            var field = optionNames[index - 1];
            var nextField = optionNames[nextIndex - 1];
            var mapping = lib.dynamicFormValidation.getMapping(nextField, mappings);
            if (mapping) {
                var key;
                for (key in mapping) {
                    var item = mapping[key];
                    var value;
                    for (value in item) {
                        var conditions = item[value];
                        var ci;
                        var clen = conditions.length;
                        for (ci = 0; ci < clen; ci++) {
                            var condition = conditions[ci];
                            var con;
                            for (con in condition) {
                                if (field == con) {
                                    var msg = funcs.scmsg(233, "svcCat", [field, nextField]);
                                    funcs.rtecall("msg", vars.$L_ret, msg, 3);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}
/**
Merge Table Properties "AccessibleDescription" between format
called by: us.get.qbe.format
return the merged string 
 */
function mergeTableAccessible(from, to) {
    var a = from.indexOf('AccessibleDescription=');
    if (a < 0) {
        return to;
    }

    var b = from.indexOf('\t', a);
    var fromDesc = from.substring(a, b);

    a = to.indexOf('AccessibleDescription=');
    if (a < 0) {
        a = to.indexOf(';');
        return to.substring(0, a + 1) + fromDesc + '\t' + to.substring(a + 1);
    } else {
        b = to.indexOf('\t', a);
        return to.substring(0, a) + fromDesc + to.substring(b);
    }
}

//add for QCCR1E119980
function convertSvcOptionDate(form, tolocal) {
    if (tolocal == null) {
        tolocal = true;
    }
    var xml = new XML();
    if (xml.setContent(form)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            convertSvcOptionElementDate(node, tolocal);
            node = node.getNextSiblingElement();
        }
    }
    return xml.toXMLString();
}

//add for QCCR1E119980
function convertSvcOptionElementDate(element, tolocal) {
    if (element != null) {
        var value = element.getValue();
        if (value == null || value == "") {
            return element;
        }

        var type = element.getAttributeValue("type");
        if (type == "date") {
            if (tolocal) {
                element.setValue(lib.tzFunctions.convertDateStringToLocal(value, 6));
            } else {
                element.setValue(lib.tzFunctions.convertDateStringToGMT(value, 6));
            }
        }
    }
    return element;
}

//add for QCCR1E119980
function addFormDataTypeAttribute(form, validations) {
    var xml = new XML();
    if (xml.setContent(form)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            addDataTypeAttribute(node, validations);
            node = node.getNextSiblingElement();
        }
    }
    return xml.toXMLString();
}

//add for QCCR1E119980
function addDataTypeAttribute(element, validations, tolocal) {
    if (element != null && validations != null) {
        var xml = new XML();
        if (xml.setContent(validations)) {
            var name = element.getAttributeValue("id");
            var rules = lib.xmlHelpers.getElement(xml, name, "id");
            if (rules != null) {
                var value = element.getValue();
                if (value == null || value == "") {
                    return element;
                }

                element.setAttributeValue("type", rules.getName());
            }
        }
    }
    return element;
}
//end for QCCR1E119980

//add for logical name
function needDisplayField(table, field) {
    var rt = false;
    if (lib.DisplayName.hasDisplayName(table)) {
        var uniqueKey = funcs.dbdict_helper("unique.key", table)[0];
        if (uniqueKey !== undefined && uniqueKey !== null && uniqueKey !== "") {
            var index = uniqueKey.lastIndexOf(",");
            if (index >= 0) {
                uniqueKey = uniqueKey.substr(index + 1);
            }
            if (uniqueKey === field) {
                rt = true;
            }
        }
    } else {
        rt = need2ndLevelDisplayField(table, field);
    }
    return rt;
}

function need2ndLevelDisplayField(table, field) {
    var rt = false;
    var refTable = lib.DisplayName.getRefTable(field, table);
    if (refTable !== null && refTable !== "" && refTable !== undefined) {
        rt = true;
    }
    return rt;
}
//end for logical name

// part of xml convert to json for condition evaluate
function xmlToJson(xmlObject) {
    var jsonStr = {};
    //var xmlObject = new XML();
    var id;
    var type;
    var label;
    var madantory;
    var visible;
    var readonly;
    var value;
    var isDefaultFirst;

    //xmlObject.setContent(xml);
    var parent = xmlObject.getParentNode();
    var form = parent.getFirstChildElement();
    var node = form.getFirstChildElement();
    while (node != null) {

        id = node.getAttributeValue("id");
        type = node.getName();
        label = node.getAttributeValue("label");
        madantory = node.getAttributeValue("mandatory");
        visible = node.getAttributeValue("visible");
        readonly = node.getAttributeValue("readonly");
        value = node.getNodeValue();
        isDefaultFirst = node.getAttributeValue("isDefaultFirst");

        jsonStr[id] = {};
        if (madantory != "") {
            jsonStr[id]["mandatory"] = madantory;
        }
        if (visible != "") {
            jsonStr[id]["visible"] = visible;
        }
        if (readonly != "") {
            jsonStr[id]["readonly"] = readonly;
        }
        if (isDefaultFirst && isDefaultFirst != "") {
            jsonStr[id]["isDefaultFirst"] = isDefaultFirst;
        }
        jsonStr[id]["type"] = type;
        jsonStr[id]["value"] = value;

        node = node.getNextSiblingElement();
    }

    return jsonStr;
}

// update xml to add 3 new attributes "mandatoryResult" and "visibleResult" and "readonlyResult";
function updateXML(xmlObject, jsonStr) {
    // var xmlObject = new XML();
    var id;
    //xmlObject.setContent(xml);
    var parent = xmlObject.getParentNode();
    var form = parent.getFirstChildElement();
    var node = form.getFirstChildElement();
    while (node != null) {
        id = node.getAttributeValue("id");
        if (jsonStr[id].hasOwnProperty("visibleResult")) {
            node.setAttributeValue("visibleResult", jsonStr[id]["visibleResult"]);
        }
        if (jsonStr[id].hasOwnProperty("readonlyResult")) {
            node.setAttributeValue("readonlyResult", jsonStr[id]["readonlyResult"]);
        }
        if (jsonStr[id].hasOwnProperty("mandatoryResult")) {
            if (jsonStr[id]["visibleResult"] == false || jsonStr[id]["readonlyResult"] == true) {
                node.setAttributeValue("mandatoryResult", false);
            } else {
                node.setAttributeValue("mandatoryResult", jsonStr[id]["mandatoryResult"]);
            }
        }
        node = node.getNextSiblingElement();
    }
    //return xmlObject.toXMLString();
    return xmlObject;
}

function setValue(xmlObj, value) {
    if (!value) {
        value = "";
    }
    var valueNode = xmlObj.createNode(3, null, value);
    var oldValue = xmlObj.getValue();
    var node = xmlObj.getFirstChildElement();
    if (node && (!oldValue || oldValue == "")) {
        xmlObj.insertBefore(valueNode, node);
    } else {
        xmlObj.setValue(value);
    }
}

function setNodeHelpAndRegex(type, node) {
    if (vars.$field_help != null && vars.$field_help != "") {
        node.setAttributeValue("help", vars.$field_help);
    }

    if (type != 'text' || vars.$field_type != "string" || vars.$match_type != 'regex') {
        return;
    }

    if (vars.$field_regex != null && vars.$field_regex != "") {
        node.setAttributeValue("regex", vars.$field_regex);
    }

    if (vars.$field_regex_msg != null && vars.$field_regex_msg != "") {
        node.setAttributeValue("regexMsg", vars.$field_regex_msg);
    }
}

//add for QCCR1E159483
function addDvdVarDependantIds(fCatalogItem) {
    var xml = new XML();

    var xmlString = fCatalogItem.options;
    if (xml.setContent(xmlString)) {
        xml.setAttributeValue("supportDvdvar", true);
        var node = xml.getFirstChildElement();

        while (node != null) {
            if (node.getAttributeValue("id") != null) {
                var optionName = node.getAttributeValue("id");
                //name is provider or giver, dependentOptions is a list of depenants.
                var dependentOptions = lib.svcCatalog.getDvdvarDependentOptions(fCatalogItem, optionName);
                if (dependentOptions.length > 0) {
                    node.setAttributeValue("Dvdvar", true);
                } else {
                    node.removeAttribute("Dvdvar");
                }
            }
            node = node.getNextSiblingElement();
        }
    }
    return xml.toXMLString();
}

function recoveryReadonlyVaule(originItem, item) {
    var xml = new XML();
    var originXml = new XML();
    var readonlyResult;

    if (xml.setContent(item) && originXml.setContent(originItem)) {
        var node = xml.getFirstChildElement();
        while (node != null) {
            var id = node.getAttributeValue("id");
            var originNode = lib.xmlHelpers.getElement(originXml, id, "id");

            if (originNode != null) {
                readonlyResult = originNode.getAttributeValue("readonlyResult");
            }

            if (readonlyResult == "true") {
                recoveryElementValue(node, originNode);
            }
            node = node.getNextSiblingElement();
        }
    }
    return xml.toXMLString();
}

function recoveryElementValue(element, originElement) {
    if (element == null || originElement == null) {
        return element;
    }
    var value = element.getValue();
    var oldValue = originElement.getValue();
    if (value != oldValue) {
        setValue(element, oldValue);
    }
    return element;
}

function getDisplayValuesByName(file, optionName) {
    var type;
    var results = [];
    var values = [];
    var displayValues = [];
    var options = file['options'];
    var optionXml = new XML();
    optionXml.setContent(options);

    var node = lib.xmlHelpers.getElement(optionXml, optionName, "id");
    if (node != null) {
        type = node.getNodeName();
    }
    if (type == "checkbox") {
        values = ["true", "false"];
        displayValues = ["true", "false"];
    } else if (type == "select") {
        var selectOption = node.getFirstChildElement();
        while (selectOption != null) {
            var optionLabel = selectOption.getAttributeValue("label");
            var id = selectOption.getValue();
            if (id && optionLabel) {
                values.push(id);
                displayValues.push(optionLabel);
            }
            selectOption = selectOption.getNextSiblingElement();
        }
    }
    results[0] = values;
    results[1] = displayValues;
    return results;
}

function refreshDefaultConfig(mappings) {
    vars.$lengthOfDefault = 0;
    vars.$defaults = [];
    vars.$conditions = [];
    vars.$forces = [];
    vars.$uniques = [];
    var object;
    var key;
    var displayValue;
    var getDisplayValue = lib.globalListTools.getDisplayValue;
    var i;
    var len = mappings.length;
    for (i = 0; i < len; i++) {
        object = mappings[i];
        key = Object.keys(object)[0];
        //value
        if (key == "##SM_NULL_KEY##") {
            vars.$defaults.push("[Empty]");
        } else {
            if (vars.$display_type == "picklist") {
                displayValue = getDisplayValue(key, vars.$defaultList, vars.$defaultListLabel);
                vars.$defaults.push(displayValue);
            } else {
                vars.$defaults.push(key);
            }
        }

        //condition
        var condition = object[key][0];
        var valueList;
        var displayList;
        var conditionString = "";
        var field;
        for (field in condition) {
            if (field != "##SM_DEFAULT_FORCE##") {
                var value = condition[field] == "" ? "null" : condition[field];
                var valueAndDisplay = getDisplayValuesByName(vars.$L_file, field);
                valueList = valueAndDisplay[0];
                displayList = valueAndDisplay[1];
                value = getDisplayValue(value, valueList, displayList);
                conditionString += field + " is " + value + " and ";
            }
        }
        if (conditionString == "") {
            conditionString = "true";
        } else {
            conditionString = conditionString.substring(0, conditionString.length - 5);
        }
        vars.$conditions.push(conditionString);

        //is force default
        if (object[key][0]['##SM_DEFAULT_FORCE##'] == "true") {
            vars.$forces.push("true");
        } else {
            vars.$forces.push("false");
        }
    }
    vars.$lengthOfDefault = funcs.lng(vars.$defaults);

    for (i = 0; i < vars.$lengthOfDefault; i++) {
        var unique = vars.$defaults[i].replace(/[\r\n]/g, "") + "-" + vars.$conditions[i] + "-" + vars.$forces[i];
        vars.$uniques.push(unique);
    }
}

function addEditByUserAttribute(originItem, item) {
    var xml = new XML();
    var originXml = new XML();

    if (xml.setContent(item) && originXml.setContent(originItem)) {
        var fieldsEditByUser = [];
        var diffrentValues = [];
        var edit = xml.getAttributeValue("editByUser");
        if (edit) {
            fieldsEditByUser = edit.split(",");
        }
        var values = lib.dynamicFormValidation.getAllOptionValues(xml);
        var oldValues = lib.dynamicFormValidation.getAllOptionValues(originXml);

        diffrentValues = lib.dynamicFormValidation.getDifferent(values, oldValues);

        fieldsEditByUser = lib.ArrayUtil.merge(fieldsEditByUser, diffrentValues);
        xml.setAttributeValue("editByUser", fieldsEditByUser.toString());
        return xml.toXMLString();
    }

    return item;
}