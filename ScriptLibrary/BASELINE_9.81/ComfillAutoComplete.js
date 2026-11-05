var $ = lib.c.$;
var log = getLog("AutoComplete");

var ComfillAutoCompleteUtil = lib.ComfillAutoCompleteUtil;

/**
 * Filter the data against the target table
 *
 * @param args The string representation of the option object. The option object looks like below
 *             var option = {
 *               // Indicates if the client needs the link definition
 *               linkInfo: true,
 *               // The form name that displays the current record [optional]
 *               format: "form1.g",
 *               // The table name the user is operating on [optional]
 *               table: "table1",
 *               // The field the user is filling data
 *               field: "srcField.1",
 *               // The text that has been typed in
 *               value: "abc",
 *               // record size
 *               size: 10
 *             }
 *
 * @return The string representation of the result object. The result object looks like below
 *             var result = {
 *               // the text that has been typed in
 *               value: "abc",
 *               // The fields returned
 *               fields: ["field.1", "field.2"],
 *               // The records matched
 *               data: [
 *                 ["value 0,0", "value 0,1"],
 *                 ["value 1,0", "value 1,1"]
 *               ],
 *               // Whether has more records
 *               hasMoreRecords: true,
 *               // fields and values from link should be updated to client directly.
 *               postFields: ["field 1", "field 2"],
 *               postValues: ["value 0", values 1],
 *               hasPostStatement: boolean,
 *               alias: ["alias 1", "alias 2"],
 *               // The link definition, only available if option.linkInfo is present and is set to true
 *               link: {
 *                 // The target field defined in the link line. It's the field to be displayed
 *                 targetField: "field.1",
 *                 // The fields mapping between the target table and the source table
 *                 mapping: {
 *                   "field.1": "srcField.1",
 *                   "field.2": "srcField.2"
 *                 }
 *               }
 *             }
 */
function filter(args) {
    var option = JSON.parse(args);
    return JSON.stringify(AutoComplete.filter(option));
}

/**
 * Update the corresponding fields according to the user's selection
 *
 * @param args The string representation of the option object. The option object looks like below
 *             var option = {
 *               // The form name that displays the current record [optional]
 *               format: "form1.g",
 *               // The table name the user is operating on [optional]
 *               table: "table1",
 *               // The field the user is filling data
 *               field: "srcField.1",
 *               // The row data the user selected
 *               data: ["value 0,0", "value 0,1"],
 *               // field list should be updated
 *               fieldlist: ["field.1", "field.2"],
 *               //function typ from client
 *               actionType: validation/autocomplete
 *             }
 *
 * @return The string representation of the result object. The result object looks like below
 *             var result = {
 *               // The status indicate if the current file is updated
 *               status: true
 *             }
 */
function update(args) {
    var option = JSON.parse(args);
    return JSON.stringify(AutoComplete.update(option));
}

/**
 * Match the data against the target table
 *
 * @params {Object} args 
 *		The string representation of the option object. The option object looks like below
 *             var option = {
 *               // Indicates if the client needs the link definition
 *               format: "form1.g",
 *               // The field the user is filling data
 *               field: "srcField.1",
 *               // The text that has been typed in
 *               value: "abc",
 *             }
 *
 * @return {Boolean}
 *		true if the result is match.
 */
function match(args) {
    var option = JSON.parse(args);
    return AutoComplete.match(option);
}

/**
 * Provides auto-completing function for a field with a link line defined for it.
 */
var AutoComplete = function() {
    // Filter the data against the target table
    function _filter(option) {

        if (!(option != null && option.value != null && option.field != null)) {
            funcs.msg('You must provide the field name and the value', 2);
            return {};
        }

        var MAX_RECORDS = option.size;
        if (!option.size) {
            // by default, return 10 records to client
            MAX_RECORDS = 10;
        }

        var record = vars.$L_file;
        if (record == null) {
            return {};
        }

        var currentFile = funcs.filename(record);
        if (option.table && option.table != currentFile) {
            funcs.msg('The current file (' + currentFile + ') is not as you expected (' + option.table + ')', 2);
            return {};
        }

        var fieldWrapper = _fieldWrapper(record, option.field);

        var dbdict = _loadDbdict(currentFile);
        var changes = option.changes;

        // Apply model changes
        var dateType = lib.DataTypeConst.typeDateTime();

        if (changes) {
            if (log.isDebugEnabled()) {
                log.debug("filter changes: " + JSON.stringify(changes));
            }

            var c;
            for (c in changes) {
                if (c != null && c != "") {
                    var fieldType = _getFieldType(dbdict, record, c);
                    // Ignore date time field
                    if (dateType != fieldType && fieldType != null) {
                        try {
                            var v = _convertValue4Record(dbdict, record, c, changes[c]);
                            if (c.charAt(0) == '$') {
                                vars[c] = v;
                            } else {
                                record[c] = v;
                            }
                        } catch (e) {
                            print("Error to apply model change to field " + c + " with value " + changes[c]);
                        }
                    }
                }
            }
        }

        option.value = lib.StringUtil.escapeAllStr(option.value);

        var oldValue = _getValue(record, fieldWrapper);
        _setValue(record, fieldWrapper, option.value);
        _updateCursorInfo(fieldWrapper, option.value);

        vars['$autocomplete.msg'] = null;

        // get advFind format
        if (option.format == "FilterEditForm") {
            option.format = _getAdvFindFormat(currentFile);
        }

        var link = lib.LinkUtil.getLink(record, option.format, fieldWrapper, option.value);
        var message = funcs._null(vars['$autocomplete.msg']) ? "" : vars['$autocomplete.msg'];
        var noRecordMsg = funcs.scmsg(1, "autocomplete");

        if (!link) {
            if (message === "") {
                message = noRecordMsg;
            }
            _setValue(record, fieldWrapper, oldValue);
            return {
                "value": option.value,
                "message": message
            };
        }

        var srcField = link.sourceField;
        var fields = [];
        //Start for logica name
        var tmpField = _getFieldName(option.field);
        if (tmpField.indexOf("[") >= 0) {
            tmpField = tmpField.substring(0, tmpField.indexOf("["));
        }

        var refTable = lib.DisplayName.getRefTable(tmpField, currentFile);
        if (srcField.indexOf("$") === 0 || refTable === "" || refTable === null) {
            refTable = link.targetFile;
        }
        var displayField = "";
        var displayFields = [];
        var displayCaptions = [];
        var retCaptions = [];

        //QCCR1E123481
        displayField = lib.DisplayName.getDisplayLable(refTable);
        if (displayField !== undefined && displayField !== null && displayField !== "") {
            fields.push(displayField);
        }

        //additional configured fields in datadict to be displayed
        displayFields = ComfillAutoCompleteUtil.getAutoCompleteDisplayFields(refTable);
        var len = funcs.lng(displayFields);
        if (len > 0) {
            var z;
            for (z = 0; z < len; z++) {
                if (!lib.ArrayUtil.contains(fields, displayFields[z])) {
                    fields.push(displayFields[z]);
                }
            }
        }
        //Add caption and needshow for fields
        var x;
        for (x = 0; x < fields.length; x++) {
            retCaptions.push(ComfillAutoCompleteUtil.getFieldLocalizedCaption(fields[x], refTable));
        }
        //end for logical name

        var field;
        for (field in link.mapping) {
            if (!lib.ArrayUtil.contains(fields, field)) {
                fields.push(field);
            }
        }

        // Query the data and fill the data to an array structure
        var queryFile = lib.LinkUtil.getSCFileByLink(record, link, fields, fieldWrapper, null, option.value);
        _setValue(record, fieldWrapper, oldValue);
        var data = [];
        var displayData = [];
        var hasMoreRecords = false;
        if (queryFile) {
            var file = queryFile.file;
            var rc = file.getFirst();

            var gl = [];
            var a;
            for (a = 0; a < fields.length; a++) {
                gl.push(ComfillAutoCompleteUtil.getFeildGlobalList(link.targetFile, fields[a]));
            }

            var i;
            for (i = 0; i < MAX_RECORDS && rc == RC_SUCCESS; i++) {
                var row = [];
                var rowDisplay = [];
                var j;
                for (j = 0; j < fields.length; j++) {
                    row.push(file[fields[j]]);
                    rowDisplay.push(ComfillAutoCompleteUtil.getDisplayValueFromGlobalList(gl[j], file[fields[j]]));
                }
                data.push(row);
                displayData.push(rowDisplay);
                rc = file.getNext();
            }
            hasMoreRecords = (rc == RC_SUCCESS);
        }

        if (data.length === 0) {
            message = noRecordMsg;
        }

        var ret = {
            "value": option.value,
            "fields": fields,
            "captions": retCaptions,
            "data": data,
            "displaydata": displayData,
            "hasMoreRecords": hasMoreRecords,
            "postFields": link.postFields,
            "postValues": link.postValues,
            "hasPostStatement": link.hasPostStatement,
            "message": message
        };

        if (!link.hasPostStatement && !fieldWrapper.isArray && !fieldWrapper.isVariable) {
            ret.alias = _getFieldAlias(dbdict, fieldWrapper.field);
        }

        // Add the link definition if the client requires it
        if (option.linkInfo) {
            var target = _getTargetField(fieldWrapper, link.mapping);
            if (target == null) {
                target = link.targetField;
            }
            ret.link = {
                targetField: target,
                mapping: link.mapping,
                targetDisplayField: displayField
            };
        }

        return ret;
    }

    function _getTargetField(fieldWrapper, mapping) {
        var f;
        for (f in mapping) {
            if (mapping[f] == fieldWrapper.field) {
                return f;
            }
        }
    }

    function _loadDbdict(name) {
        var dbdict = new SCFile("dbdict");
        var rc = dbdict.doSelect("name=\"" + name + "\"");
        if (rc == RC_SUCCESS) {
            return dbdict;
        }
        return null;
    }

    function _getFieldAlias(dbdict, field) {
        var ret = [];
        if (dbdict == null) {
            return ret;
        }

        var idx = -1;
        var fields = dbdict.field;
        var length = funcs.lng(fields);
        var i;
        for (i = 0; i < length; i++) {
            if (fields[i].name === field) {
                idx = i;
                break;
            }
        }

        if (idx > -1) {
            var level = fields[idx].level;
            var index = fields[idx].index;
            for (i = idx + 1; i < length; i++) {
                if (fields[i].level === level && index === fields[i].index && fields[i].sql_column_name == null) {
                    ret.push(fields[i].name);
                } else {
                    break;
                }
            }
        }

        return ret;
    }

    function _getFieldType(dbdict, record, name) {
        if (name.charAt(0) == '$') {
            return funcs.type(vars[name]);
        } else {
            if (record[name] != null) {
                return funcs.type(record[name]);
            }
            var fields = dbdict.field;
            var length = fields.length();
            var i;
            for (i = 0; i < length; i++) {
                if (fields[i].name === name) {
                    return fields[i].type;
                }
            }
        }
        return null;
    }

    function _convertValue4Record(dbdict, record, f, v) {
        if (v == null || v == "") {
            return null;
        }
        var type = _getFieldType(dbdict, record, f);
        var typeConst = lib.DataTypeConst;

        // string
        if (type == typeConst.typeCharacter()) {
            if (funcs.type(v) == typeConst.typeArray()) {
                return v[0];
            }
            return v;
        }
        // array
        else if (type == typeConst.typeArray()) {
            if (funcs.type(v) == typeConst.typeCharacter()) {
                return [v];
            }

            var i;
            for (i = 0; i < v.length; i++) {
                if (v[i] == "") {
                    v[i] = null;
                }
            }
            return funcs.denull(v);
        }
        // datetime
        else if (type == typeConst.typeDateTime()) {
            // Ignore date time
            return null;
        }
        // boolean 
        else if (type == typeConst.typeBoolean()) {
            return !!v;
        }
        // number
        else if (type == typeConst.typeNumber()) {
            return parseFloat(v);
        }

        return v;
    }

    function _update(option) {
        if (!(option && option.data && option.field)) {
            throw new Error('You must provide the field name and the new data');
        }

        var record = vars.$L_file;
        if (record == null) {
            return {
                "status": false
            };
        }
        var currentFile = funcs.filename(record);
        if (option.table && option.table != currentFile) {
            throw new Error('The current file (' + currentFile + ') is not as you expected (' + option.table + ')');
        }
        var fieldWrapper = _fieldWrapper(record, option.field);
        var fieldlist = option.fieldlist;
        var dbdict = _loadDbdict(currentFile);
        // Update all fields per mapping
        var i;
        for (i = 0; i < fieldlist.length; i++) {
            var toValue = option.data[i];

            if (fieldlist[i] == fieldWrapper.field) {
                _setValue(record, fieldWrapper, toValue);
            } else {
                record[fieldlist[i]] = _convertValue4Record(dbdict, record, fieldlist[i], toValue);
            }
        }

        return {
            "status": true
        };
    }

    function _getFieldName(field) {
        var isVariable = false;
        if (field.indexOf("var/") == 0) {
            isVariable = true;
        }
        field = field.replace("var/", "");
        var lastIndex = field.lastIndexOf("/");
        if (lastIndex > -1) {
            field = field.substring(lastIndex + 1);
        }
        if (isVariable) {
            return "$" + field;
        }
        return field;
    }

    function _fieldWrapper(record, fieldName) {
        var fieldname = _getFieldName(fieldName);
        var regex = /(.+)\[(\d+)\]/;
        var matcher = fieldname.match(regex);
        var result = {
            isArray: false,
            field: fieldname
        };

        if (matcher != null) {
            result = {
                isArray: true,
                field: matcher[1],
                index: parseInt(matcher[2], 0) - 1
            };
        }
        result["isVariable"] = result["field"].indexOf("$") == 0;

        if (!result.isArray && record[fieldname] != null && (funcs.type(record[fieldname]) == 8 || fieldType == 8)) {
            result = {
                isArray: true,
                field: fieldname,
                index: 0
            };
        }

        var fieldType = lib.DisplayName.getFieldType(funcs.filename(record), fieldname);
        if (!result.isArray && record[fieldname] == null && fieldType == 8) {
            result = {
                isArray: true,
                field: fieldname,
                index: 0
            };
        }

        return result;
    }

    function _setValue(record, fieldWrapper, value) {
        var f = fieldWrapper.field;
        if (fieldWrapper.isArray) {
            var index;
            if (fieldWrapper.isVariable) {
                if (vars[f] == null) {
                    vars[f] = [];
                }
                var type = funcs.type(vars[f]);
                // character or number type
                if (type == 2 || type == 1) {
                    vars[f] = [vars[f]];
                }
                var obj = vars[f];
                var lng = funcs.lng(obj);
                index = fieldWrapper.index;

                var i;
                for (i = -1; i < index - lng; i++) {
                    obj.push(null);
                }
                vars[f][index] = value;
            } else {
                index = fieldWrapper.index;
                if (index == null || index == "" || index == undefined || index < 0) {
                    index = 0;
                }

                if (funcs._null(record[f]) || record[f] === null) {
                    var smArray = new SCDatum();
                    smArray.setType(8);
                    record[f] = smArray;
                }
                record[f][index] = value;
            }
        } else {
            if (fieldWrapper.isVariable) {
                vars[f] = value;
            } else {
                record[f] = value;
            }
        }
    }

    function _getValue(record, fieldWrapper) {
        var _f = record[fieldWrapper.field];
        if (fieldWrapper.isVariable) {
            _f = vars[fieldWrapper.field];
        }

        if (fieldWrapper.isArray) {
            if (fieldWrapper.index < funcs.lng(_f)) {
                return _f[fieldWrapper.index];
            } else {
                return null;
            }
        }

        return _f;
    }

    // update cursor information
    function _updateCursorInfo(fieldWrapper, value) {
        if (fieldWrapper.isArray) {
            funcs.cursor_field_name_set(fieldWrapper.field, fieldWrapper.index + 1, 1, 1);
        } else {
            funcs.cursor_field_name_set(fieldWrapper.field, 0, 1, 1);
        }
        try {
            var currentFile = funcs.filename(vars.$L_file);
            var refTable = lib.DisplayName.getRefTable(fieldWrapper.field, currentFile);
            if (refTable !== null && refTable !== "") {
                funcs.cursor_field_display_content_set(value);
                funcs.cursor_field_contents_set("");
            } else {
                funcs.cursor_field_contents_set(value);
            }
        } catch (e) {
            funcs.rtecall("log", vars.$L_void, "Problem is found which may be caused by incorrect RTE version. Error: " + e);
        }
    }

    /**
     * Get advanced find format of the table
     *
     * @param	 {String} tablename
     * @returns {String} advanced find format
     */
    function _getAdvFindFormat(tablename) {
        if (tablename == null || tablename == "") {
            return null;
        }

        var obj = $("SearchConfig", SCFILE_READONLY).setFields(["searchFormat"]).select('tablename="' + tablename + '"').uniqueResult();
        if (obj == null) {
            return null;
        }

        return obj.searchFormat;
    }

    // Match the data against the target table
    function _match(option) {

        if (!(option != null && option.format != null && option.value != null && option.field != null)) {
            funcs.msg('You must provide the field name, format name and the value', 2);
            return false;
        }

        if (log.isDebugEnabled()) {
            var debugMsg = "match() - format:" + option.format + "; value:" + option.value + "; field:" + option.field;
            log.debug(debugMsg);
        }

        var record = vars.$L_file;
        if (record == null) {
            return false;
        }

        var fieldWrapper = _fieldWrapper(record, option.field);
        _setValue(record, fieldWrapper, option.value);
        _updateCursorInfo(fieldWrapper, option.value);

        var link = lib.LinkUtil.getLink(record, option.format, fieldWrapper);
        if (!link) {
            return true;
        }

        if (log.isDebugEnabled()) {
            debugMsg = "match() - linkline - sourceField:" + link.sourceField + "; targetFile:" + link.targetFile +
                "targetField:" + link.targetField + "; query:" + link.query;
            log.debug(debugMsg);
        }

        var refTable;
        if (link.sourceField.indexOf("$") === 0) {
            refTable = link.targetFile;
        } else {
            var tmpField = _getFieldName(option.field);
            if (tmpField.indexOf("[") >= 0) {
                tmpField = tmpField.substring(0, tmpField.indexOf("["));
            }
            var currentFile = funcs.filename(record);
            refTable = lib.DisplayName.getRefTable(tmpField, currentFile);
        }

        // normal field
        if (refTable == null || refTable.length == 0) {
            var fields = [];

            var queryFile = lib.LinkUtil.getSCFileByLink(record, link, fields, fieldWrapper);
            if (queryFile) {
                var file = queryFile.file;
                var rc = file.getFirst();
                if (rc != RC_SUCCESS) {
                    return false;
                }

                var targetValue = file[link.targetField];
                return (targetValue != null && targetValue.toLowerCase() == option.value.toLowerCase());
            }
            return false;
        }
        // reference field
        else {
            // the option.value is not reference field value, so could not handle link query correctly.
            // use a simple query instead 
            var targetFile = link.targetFile;
            var targetField = link.targetField;
            var result = $(targetFile, SCFILE_READONLY).setFields([targetField]).select(targetField + "=\"" + option.value + "\"").uniqueResult();

            return (result != null);
        }

    }

    return {
        filter: _filter,
        update: _update,
        match: _match
    };

}();