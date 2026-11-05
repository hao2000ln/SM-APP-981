var _lng = funcs.lng;
var _scmsg = funcs.scmsg;

function getFilterFieldByName(fieldName) {
    var filterForm = new SCFile("calendarFilterEditForm", SCFILE_READONLY);
    var query = "fieldId=\"" + fieldName + "\" and active=true";
    var ret = filterForm.doSelect(query);
    if (ret == RC_SUCCESS) {
        return filterForm;
    } else {
        return null;
    }
}

function getFilterFieldMapping(fieldId, module) {
    var mapping = new SCFile("calendarFilterFieldMapping", SCFILE_READONLY);
    var query = "fieldId=\"" + fieldId + "\" and module=\"" + module + "\" and active=true";
    var ret = mapping.doSelect(query);
    if (ret == RC_SUCCESS) {
        return mapping;
    } else {
        return null;
    }
}

function getFieldTabname(tabvalue) {
    var retName = tabvalue;
    var tabValues = lib.timeperiodMapping.getCalendarMappingObjects()[0];
    var tabDisp = lib.timeperiodMapping.getCalendarMappingObjects()[1];
    tabValues = funcs.insert(tabValues, 1, 1, "common");
    tabDisp = funcs.insert(tabDisp, 1, 1, _scmsg("common", "timeperiod"));

    var i;
    var length = _lng(tabValues);
    for (i = 0; i < length; i++) {
        if (tabValues[i] == tabvalue) {
            retName = tabDisp[i];
            break;
        }
    }
    return retName;
}

function localizedLable(id, dbdict, value) {
    var loStr = _scmsg(id, "local:" + dbdict);
    if (loStr == null || loStr == "") {
        loStr = value;
    }
    return loStr;
}

function findTrueFields(fields) {
    var trueFields = [];

    var length = _lng(fields);
    var j;
    for (j = 0; j < length; j++) {
        var field = fields[j];

        var valueCount = _lng(field.values);
        var k;
        for (k = 0; k < valueCount; k++) {
            var value = field.values[k];
            if (value.value == 'all') {
                trueFields.push(field.field);
                break;
            }
        }
    }

    return trueFields;
}

function isTrueField(trueFields, field) {
    var k;
    for (k = 0; k < trueFields.length; k++) {
        if (field === trueFields[k]) {
            return true;
        }
    }

    return false;
}

function buildFilterQueryStr(filter, module) {
    var retquery = "";
    var groupCount = _lng(filter.groups);
    var i;
    for (i = 0; i < groupCount; i++) {
        var tmpquery = "";
        var fg = filter.groups[i];
        var fields = fg.fields;
        var trueFields = findTrueFields(fields);
        var hasfields = false;
        var length = _lng(fields);
        var j;
        for (j = 0; j < length; j++) {
            var betweenDate = false;
            var multiBooleanData = false;
            var field = fields[j];
            var fieldname = field.field;

            if (isTrueField(trueFields, fieldname)) {
                continue;
            }

            var fieldmapping = getFilterFieldMapping(fieldname, module);

            if (fieldmapping != null) {
                if (hasfields) {
                    tmpquery += " or ";
                }
                hasfields = true;
                var mappedField = fieldmapping.mappingField;
                var fieldType = this.getFieldType(mappedField, module);
                var crossTableAlias = "";
                if (module == "timeperiodDefinition") {
                    crossTableAlias = "tp." + mappedField;
                } else {
                    crossTableAlias = mappedField;
                }
                
                var obj;
                var value;
                var k;
                
                var valueCount = _lng(field.values);

                if (valueCount > 1 && fieldType != 3 && fieldType != 4) {
                    for (k = 0; k < valueCount; k++) {
                        var tempValue;
                        value = field.values[k];
                        if (value.value == "null") {
                            tmpquery += crossTableAlias + "=NULL";
                        } else if (fieldType == 8) {
                            obj = funcs.val(value.value, 8);
                            if (funcs.type(obj) == 8) {
                                tmpquery += crossTableAlias + "=" + value.value;
                            } else {
                                tempValue = value.value.replace(/(\\)/g, "\\\\");
                                tempValue = tempValue.replace(/(\")/g, "\\\"");
                                tmpquery += crossTableAlias + "=\"" + tempValue + "\"";
                            }
                        } else {
                            tempValue = value.value.replace(/(\\)/g, "\\\\");
                            tempValue = tempValue.replace(/(\")/g, "\\\"");
                            tmpquery += crossTableAlias + "=\"" + tempValue + "\"";
                        }
                        if (k < valueCount - 1) {
                            tmpquery += " or ";
                        }
                    }
                    multiBooleanData = true;
                } else if (valueCount > 1 && fieldType == 3) {
                    betweenDate = true;
                    if ((field.values[0].value == null || field.values[0].value == "") && (field.values[1].value == null || field.values[1].value == "")) {
                        //bypass this condition when has no values when select "between" operator
                    } else if (field.values[0].value == null || field.values[0].value == "") {
                        tmpquery += crossTableAlias + " <= '" + formatDateString(field.values[1].value) + "'";
                    } else if (field.values[1].value == null || field.values[1].value == "") {
                        tmpquery += crossTableAlias + " >= '" + formatDateString(field.values[0].value) + "'";
                    } else {
                        tmpquery += crossTableAlias + " >= '" + formatDateString(field.values[0].value) + "' and " + crossTableAlias + " <= '" + formatDateString(field.values[1].value) + "'";
                    }
                } else if (valueCount > 1 && fieldType == 4) {
                    for (k = 0; k < valueCount; k++) {
                        value = field.values[k];
                        if (value.value == "null") {
                            value.value = "NULL";
                        }
                        if (k > 0) {
                            tmpquery += " or ";
                        }
                        tmpquery += crossTableAlias + "=" + value.value + " ";
                    }
                    multiBooleanData = true;
                } else if (field.oper && field.oper != "") {
                    tmpquery += crossTableAlias + field.oper;
                } else {
                    tmpquery += crossTableAlias + " = ";
                }
                if (!betweenDate && !multiBooleanData) {
                    for (k = 0; k < valueCount; k++) {
                        value = field.values[k];
                        if (value.value == "null") {
                            tmpquery += "NULL";
                        } else {
                            if (fieldType == 3) // filed type is date
                            {
                                tmpquery += "'" + formatDateString(value.value) + "'";
                            } else if (fieldType == 4) // field type is logic or array
                            {
                                tmpquery += value.value;
                            } else if (fieldType == 8) // field type is array and value is also array 
                            {
                                obj = funcs.val(value.value, 8);
                                if (funcs.type(obj) == 8) {
                                    tmpquery += value.value;
                                } else {
                                    tempValue = value.value.replace(/(\\)/g, "\\\\");
                                    tempValue = tempValue.replace(/(\")/g, "\\\"");
                                    tmpquery += "\"" + tempValue + "\"";

                                }

                            } else {
                                tempValue = value.value.replace(/(\\)/g, "\\\\");
                                tempValue = tempValue.replace(/(\")/g, "\\\"");
                                tmpquery += "\"" + tempValue + "\"";

                            }
                        }
                        if (k < valueCount - 1) {
                            tmpquery += ",";
                        }
                    }
                    if (valueCount > 1) {
                        tmpquery += "} ";
                    }

                }
            }
            if (hasfields && j == _lng(fields) - 1) {
                tmpquery = " ( " + tmpquery + " ) ";
            }
        }
        if (i == 0 && hasfields) {
            retquery += tmpquery;
        } else if (i > 0 && hasfields && lib.SysUtil._trimStr(retquery) != "") {
            retquery += " and " + tmpquery;
        } else {
            retquery += tmpquery;
        }
    }

    return retquery;
}

function formatDateString(orgDate) {
    var dtstr = orgDate;
    var temp = dtstr.replace(/-/g, "/");
    var dtValue = lib.tzFunctions.convertDateStringOnTZ(temp, vars.$lo_time_zone, 6, vars.$lo_time_zone, vars.$lo_date_order);
    return dtValue;
}

function getFieldType(field, filename) {
    var dbdict = new SCFile("dbdict");
    var query = "name=\"" + filename + "\"";
    var ret = dbdict.doSelect(query);
    if (ret == RC_SUCCESS) {
        var i;
        var length = dbdict.field.length();
        for (i = 0; i < length; i++) {
            if (dbdict.field[i].name == field) {
                return dbdict.field[i].type;
            }
        }
    }
    return 0;
}

function newId() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, "calendarFilter");
    return newid.getText();
}

/**
 * Conver perdefined query string to filter
 * @param queryStr 
 * @return filter object
 */


function convertPredefinedQuery(queryStr, file) {
    if (queryStr == null || queryStr == "" || lib.SysUtil._trimStr(queryStr) == "true") {
        return {};
    }
    var filtertosave = new SCFile("calendarFilter");
    var groupStrs = queryStr.split(" and ");
    if (_lng(groupStrs) == 0) {
        return {};
    } else {
        filtertosave["id"] = "";
        filtertosave["category"] = "";
        filtertosave["name"] = "Predefined";
        filtertosave["description"] = "predefined query";
        filtertosave["active"] = true;
        filtertosave["public"] = true;

        var i;
        var ilength = _lng(groupStrs);
        for (i = 0; i < ilength; i++) {
            var grouptosave = filtertosave["groups"][i];
            var querySubStr = groupStrs[i].replace(/(^\(+)|(\)+$)/g, "");
            var queryTerms = querySubStr.split(" or ");
            if (_lng(queryTerms) > 1) {
                grouptosave.virtualgroup = false;
            } else {
                grouptosave.virtualgroup = true;
            }
            var jlength = _lng(queryTerms);
            var j;
            for (j = 0; j < jlength; j++) {
                var fieldtosave = grouptosave["filterfields"][j];
                var fieldName = "";
                var fieldValue = "";
                var splitter = "";
                var hasOP = false;
                if (queryTerms[j].indexOf(" isin ") >= 0) {
                    splitter = " isin ";
                } else if (queryTerms[j].indexOf(" > ") >= 0) {
                    hasOP = true;
                    splitter = " > ";
                } else if (queryTerms[j].indexOf(" < ") >= 0) {
                    hasOP = true;
                    splitter = " < ";
                } else if (queryTerms[j].indexOf(" >= ") >= 0) {
                    hasOP = true;
                    splitter = " >= ";
                } else if (queryTerms[j].indexOf(" <= ") >= 0) {
                    hasOP = true;
                    splitter = " <= ";
                } else if (queryTerms[j].indexOf(" # ") >= 0) {
                    hasOP = true;
                    splitter = " # ";
                } else if (queryTerms[j].indexOf(" = ") >= 0) {
                    splitter = " = ";
                }
                if (splitter != "") {
                    fieldName = queryTerms[j].split(splitter)[0];
                    fieldtosave.fieldname = lib.SysUtil._trimStr(fieldName);
                    fieldtosave.panel = "";
                    fieldtosave.oper = lib.SysUtil._trimStr(splitter);
                    fieldtosave.values = [];
                    fieldValue = queryTerms[j].split(splitter)[1];
                    if (vars.$L_file == null) {
                        vars.$L_file = vars.$file;
                    }
                    fieldValue = fieldValue.replace(/(\;)/g, "");
                    fieldValue = fieldValue.replace(/(\')/g, "\"");

                    var evalValue = lib.CalendarUtilities.getDateTimeEval(fieldValue, file);
                    if (evalValue) {
                        evalValue = lib.CalendarUtilities.formatDate(evalValue, "yyyy-mm-dd HH:MM:ss");
                    } else {
                        evalValue = lib.CalendarUtilities.getEval(fieldValue, file);
                    }

                    var shouldSplitValue = false;
                    if (evalValue && funcs.type(evalValue) == 8) {
                        shouldSplitValue = true;
                    } else if (evalValue && typeof evalValue == "object") {
                        evalValue = fieldValue;
                        shouldSplitValue = true;
                    }
                    fieldValue = funcs.str(evalValue);
                    if (fieldValue == null) {
                        fieldValue = "null";
                    }
                    var values = [];
                    if (shouldSplitValue) {
                        fieldValue = fieldValue.replace(/[\{\}]+/g, "");
                        values = fieldValue.split(",");
                    } else {
                        values.push(fieldValue);
                    }
                    var klength = _lng(values);
                    var k;
                    for (k = 0; k < klength; k++) {
                        var tmpValue = lib.SysUtil._trimStr(values[k]);
                        tmpValue = tmpValue.replace(/(^\"+)|(\"+$)/g, "");
                        tmpValue = tmpValue.replace(/(^\'+)|(\'+$)/g, "");
                        fieldtosave.values[k].value = tmpValue;
                        fieldtosave.values[k].text = getValueLabel(tmpValue, fieldtosave.fieldname);
                    }
                }
            }
        }
    }
    return this.convertCalendarFilter(filtertosave);
}

function getValueLabel(value, fieldName) {
    if (!fieldName || fieldName == "") {
        return value;
    }
    var filterField = new SCFile("calendarFilterEditForm");
    var query = "fieldId=\"" + fieldName + "\" and active=true";
    var ret = filterField.doSelect(query);
    if (ret == RC_SUCCESS) {
        if (filterField["type"] == "TEXT_PICKER" || filterField["type"] == "DATE_PICKER") {
            return value;
        } else {
            return getValueLableFromDataStore(filterField, value);
        }
    } else {
        return value;
    }
}

function getValueLableFromDataStore(filterField, labelValue) {
    var retValue = {};
    var valueArray = [];
    var valueType = filterField["dataSource"];
    var infos = {};
    infos.values = [];
    infos.labels = [];
    var selfdefValues = filterField["uservalues"];
    var selfdefLabels = filterField["userlabels"];
    var valuesCount = funcs.lng(selfdefValues);
    var labelsCount = funcs.lng(selfdefLabels);
    var tempCount = Math.max(valuesCount, labelsCount);
    var label;
    var x;
    for (x = 0; x < tempCount; x++) {
        var value = "";
        label = "";
        if (x <= valuesCount) {
            value = lib.CalendarUtilities.getEval(selfdefValues[x]);
            if (value == null) {
                value = "";
            }
        } else {
            value = selfdefLabels[x];
        }
        if (x <= labelsCount) {
            if (selfdefLabels[x]) {
                label = lib.CalendarUtilities.getEval(selfdefLabels[x]);
                if (label == null) {
                    label = "";
                }
            }
        } else {
            label = value;
        }
        if (value == "" && label != "") {
            value = label;
        } else if (value != "" && label == "") {
            label = value;
        }
        if (value != "" && label != "") {
            infos.values.push(value);
            infos.labels.push(label);
        }
    }
    label = getValueLabelFromInfos(labelValue, infos);
    if (label != null) {
        return label;
    }
    if (valueType == "gl" && filterField["globalListName"] && filterField["globalListName"] != "") {
        infos = lib.CalendarUtilities.getValuesFromGL(filterField["globalListName"], infos);
        return getValueLabelFromInfos(labelValue, infos);
    } else if (valueType == "rad" && filterField["radExp"] && filterField["radExp"] != "") {
        infos = lib.CalendarUtilities.getValuesFromRADExp(filterField["radExp"], infos);
        return getValueLabelFromInfos(labelValue, infos);
    } else if (valueType == "query") {
        return getFiledValuesFromQuery(filterField["valueField"],
            filterField["displayField"],
            filterField["queryTable"],
            filterField["query"],
            filterField["orderField"],
            infos, labelValue);
    }
    return labelValue;
}

function getValueLabelFromInfos(value, infos) {
    //for (var k=0; k < _lng(infos.values); k++)
    //{
    //  if (infos.values[k] == value) return infos.labels[k];
    // }
    var ix = funcs.index(value, infos.values);
    if (ix > 0) {
        return infos.labels[ix - 1];
    }
    return null;
}

function getFiledValuesFromQuery(valueField, displayField, queryTable, query,
    sortField, infos, value) {
    if (isEmpty(value) || isEmpty(displayField) || isEmpty(valueField) || isEmpty(queryTable)) {
        return value;
    } else {
        var table = new SCFile(queryTable, SCFILE_READONLY);
        table.setFields([valueField, displayField]);
        if (!isEmpty(sortField)) {
            table.setOrderBy([sortField], [SCFILE_ASC]);
        }
        var tmpquery = "";
        if (!isEmpty(query)) {
            tmpquery += query;
        }
        if (!isEmpty(value)) {
            if (!isEmpty(tmpquery)) {
                tmpquery += " and ";
            }
            var fieldType = funcs.type(table[valueField]);
            if (fieldType == 1 || fieldType == 4) {
                tmpquery += valueField + "=" + value;
            } else if (fieldType == 3) {
                tmpquery += valueField + "='" + value + "'";
            } else {
                tmpquery += valueField + "=\"" + value + "\"";
            }
        }
        var rc = table.doSelect(tmpquery);
        if (rc == RC_SUCCESS) {
            return table[displayField];
        }
    }
    return value;
}

/**
 * Conver db filter to json filter 
 * @param calendarFilter  
 * @return filter json object
 */
function convertCalendarFilter(filter) {
    var returnFilter = null;
    returnFilter = {};
    returnFilter.id = filter["id"];
    returnFilter.groups = [];
    var filterInfo = {};
    filterInfo.name = filter["name"];
    filterInfo.category = filter["category"];
    filterInfo.description = filter["description"];
    filterInfo["general"] = filter["public"];
    filterInfo["userRight"] = ""; //have to implement this with user right
    returnFilter.info = filterInfo;
    var i;
    var ilength = _lng(filter.groups);
    for (i = 0; i < ilength; i++) {
        var group = filter.groups[i];
        var returnGroup = {};
        returnGroup.virtual = group.virtualgroup;
        returnGroup.fields = [];
        var j;
        var jlength = _lng(group.filterfields);
        for (j = 0; j < jlength; j++) {
            var field = group.filterfields[j];
            var fieldForm = this.getFilterFieldByName(field["fieldname"]);
            if (fieldForm != null) {
                var returnField = {};
                returnField.field = fieldForm["fieldId"];
                returnField.label = localizedLable(fieldForm["id"], "calendarFilterEditForm", fieldForm["alternateLabel"]);
                returnField.type = fieldForm["type"];
                returnField.multiSelect = fieldForm["multiSelectable"] ? "true" : "false";
                returnField.tab = getFieldTabname(fieldForm["panel"]);
                returnField.oper = field["oper"];
                returnField.values = [];
                var k;
                var klength = _lng(field["values"]);
                for (k = 0; k < klength; k++) {
                    var value = field["values"][k];
                    var returnValues = {};
                    returnValues.value = value.value;
                    returnValues.text = getValueLabel(value.value, fieldForm["fieldId"]);
                    returnField.values.push(returnValues);
                }
                returnGroup.fields.push(returnField);
            }
        }
        if (_lng(returnGroup.fields) > 0) {
            returnFilter.groups.push(returnGroup);
        }
    }
    return returnFilter;
}

function convertQueryToRegexp(str) {
    var tmpStr = str;
    tmpStr = tmpStr.replace(new RegExp('\\.', 'gi'), '\\.');
    tmpStr = tmpStr.replace(new RegExp('\\*', 'gi'), '.*');
    tmpStr = tmpStr.replace(new RegExp('\\?', 'gi'), '.?');
    tmpStr = tmpStr.replace(new RegExp('\\(', 'gi'), '\\(');
    tmpStr = tmpStr.replace(new RegExp('\\)', 'gi'), '\\)');
    tmpStr = tmpStr.replace(new RegExp('\\[', 'gi'), '\\[');
    tmpStr = tmpStr.replace(new RegExp('\\]', 'gi'), '\\]');
    tmpStr = tmpStr.replace(new RegExp('\\$', 'gi'), '\\$');
    tmpStr = tmpStr.replace(new RegExp('\\:', 'gi'), '\\:');
    var retReg = new RegExp(tmpStr, "gi");
    return retReg;
}

function validatePredfinedFilter(queryStr) {
    var html = "";
    if (queryStr == null || queryStr == "") {
        return "";
    }
    if (lib.SysUtil._trimStr(queryStr) == "true") {
        return "true";
    }
    var groupStrs = queryStr.split(" and ");
    if (_lng(groupStrs) == 0) {
        return "invalid expression";
    } else {
        var i;
        var ilength = _lng(groupStrs);
        for (i = 0; i < ilength; i++) {
            html += "<style>";
            html += ".listTable{font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 12px;border-top: #ccc 1px solid;border-bottom: #ccc 1px solid;}";
            html += ".listTable A{color: #0000CC;}";
            html += ".operatorLabel{font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 12px;color: #0000CC;}";
            html += "</style>";
            html += "<table border=0 class=\"listTable\">";
            var querySubStr = groupStrs[i].replace(/(^\(+)|(\)+$)/g, "");
            var queryTerms = querySubStr.split(" or ");
            var j;
            var jlength = _lng(queryTerms);
            for (j = 0; j < jlength; j++) {
                html += "<tr>";
                var fieldName = "";
                var fieldValue = "";
                var splitter = "";
                var hasOP = false;
                if (queryTerms[j].indexOf(" isin ") >= 0) {
                    splitter = " isin ";
                } else if (queryTerms[j].indexOf(" > ") >= 0) {
                    hasOP = true;
                    splitter = " > ";
                } else if (queryTerms[j].indexOf(" < ") >= 0) {
                    hasOP = true;
                    splitter = " < ";
                } else if (queryTerms[j].indexOf(" >= ") >= 0) {
                    hasOP = true;
                    splitter = " >= ";
                } else if (queryTerms[j].indexOf(" <= ") >= 0) {
                    hasOP = true;
                    splitter = " <= ";
                } else if (queryTerms[j].indexOf(" # ") >= 0) {
                    hasOP = true;
                    splitter = " # ";
                } else if (queryTerms[j].indexOf(" = ") >= 0) {
                    splitter = " = ";
                }
                if (splitter != "") {
                    fieldName = queryTerms[j].split(splitter)[0];
                    fieldValue = queryTerms[j].split(splitter)[1];
                    if (vars.$L_file == null) {
                        vars.$L_file = vars.$file;
                    }
                    fieldValue = fieldValue.replace(/(\;)/g, "");
                    fieldValue = fieldValue.replace(/(\')/g, "\"");
                    var values = [];
                    var shouldSplitValue = false;
                    if (fieldValue && typeof fieldValue == "object") {
                        shouldSplitValue = true;
                    } else if (fieldValue && funcs.type(fieldValue) == 8) {
                        shouldSplitValue = true;
                    }
                    if (shouldSplitValue) {
                        fieldValue = fieldValue.replace(/[\{\}]+/g, "");
                        values = fieldValue.split(",");
                    } else {
                        values.push(fieldValue);
                    }

                    var klength = _lng(values);
                    var k;
                    for (k = 0; k < klength; k++) {
                        html += "<td>";
                        var tmpValue = lib.SysUtil._trimStr(values[k]);
                        html += fieldName + splitter + tmpValue;
                        html += "</td>";
                    }
                }
                html += "</tr>";
                if (j < _lng(queryTerms) - 1) {
                    html += "<tr><td><a>or</a></td></tr>";
                }
            }
            html += "</table>";
            if (i < _lng(groupStrs) - 1) {
                html += "</table><br><a class=\"operatorLabel\">and<a><p>";
            }
        }
    }
    return html;
}

function isEmpty(value) {
    if (!value || lib.SysUtil._trimStr(value) == "") {
        return true;
    }
    else {
        return false;
    }
}