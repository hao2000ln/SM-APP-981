var ComfillAutoCompleteUtil = lib.ComfillAutoCompleteUtil;
var evaluate = funcs.evaluate;
var denull = funcs.denull;
var lng = funcs.lng;
var _null = funcs._null;
var log = getLog("LinkUtil");

/**
 * Get the link line definition for the given field
 *
 * @param record
 *          The record against which the master link record is defined
 * @param format
 *          The format against which the form-based link record is defined, if not
 *          given, the current format will be used
 * @param field
 *          The source field against which the link line is defined
 * @return The link line definition, or null if not found
 */
function getLink(record, format, fieldWrapper, optionValue) {
    //return LinkUtil.getLinkDef(record, format, fieldWrapper,optionValue);
    LinkUtil.setDisplayValue(record, fieldWrapper, optionValue);
    var link = lib.LinkUtilOverride.getCustomizedLink(record, format, fieldWrapper.field, optionValue);
    if (link != null) {
        return link;
    } else {
        link = LinkUtil.getLinkDef(record, format, fieldWrapper, optionValue);
    }
    return link;
}

/**
 * Query records based on the given link line definition
 *
 * @param record
 *          The record against which the fill action is performed
 * @param link
 *          The link line definition
 * @param targetFields
 *          The fields to be selected from the target table, if not given, the fields
 *          in the mapping will be used
 * @return A SCFile object contains all matching records, or null if no records found
 */
function getSCFileByLink(record, link, targetFields, fieldWrapper, doCount, optionValue) {
    var fields = targetFields;
    if (!fields) {
        fields = [];
        var field;
        for (field in link.mapping) {
            fields.push(field);
        }
    }

    return LinkUtil.getSCFileByLink(record, link, fields, fieldWrapper, doCount, false, optionValue);
}

/**
 * Query records based on the virtual join definition
 *
 * @param record
 *          The record against which the virtual join will be performed
 * @param format
 *          The format against which the form-based link record is defined, if not
 *          given, the current format will be used
 * @param field
 *          The source field against which the link line for virtual join is defined
 * @param targetFields
 *          The fields to be selected from the target table, if not given, the fields
 *          in the mapping will be used
 * @return A SCFile object contains all matching records, or null if no records found
 */
function queryByVJ(record, format, field, targetFields, doCount) {
    var link = LinkUtil.getLinkDef(record, format, field);
    return LinkUtil.getSCFileByLink(record, link, targetFields, doCount, true);
}

function getQueryExpression(record, link, fieldWrapper, strict) {
    return LinkUtil.getQueryExpression(record, link, fieldWrapper, strict);
}

// Define the utility
var LinkUtil = (function() {
    // Get join tables
    function _getJoinTables(name) {
        var join = new SCFile('joindefs', SCFILE_READONLY);
        join.setFields(["join.tables"]);
        var tables = [];
        var rc = join.doSelect('join.name="' + name + '"');
        if (rc == RC_SUCCESS) {
            var datum = join.join_tables;
            var i;
            for (i = 0; i < datum.getSize(); i++) {
                tables.push(datum[i].table_name);
            }
        }
        return tables;
    }

    function _getSearchConfigFormat(filename) {
        var rc, file = new SCFile('SearchConfig', SCFILE_READONLY);
        file.setFields(["searchFormat"]);
        rc = file.doSelect('tablename="' + filename + '"');
        if (rc == RC_SUCCESS) {
            return file.searchFormat;
        }
    }

    // Get the link definition
    function _getLinkDef(record, format, fieldWrapper, optionValue) {
        var field = fieldWrapper.field;
        if (!(record || format) || !field) {
            return null;
        }

        // The $File variable is usually used in the link expression
        vars.$File = record;
        var link = null,
            rc, file = new SCFile('link', SCFILE_READONLY);
        // First find the link line from the link record based on the base form
        format = format || funcs.current_format();
        format = format.replace(/^wizard-/, ''); // if format in wizard
        format = format.replace(/\.[gw]$/, ''); // link name doesn't have ".g"
        var table = funcs.filename(vars.$File);
        if (format == "FilterAdvFind") {
            var f = _getSearchConfigFormat(table);
            if (f != null) {
                format = f;
            }
        }
        rc = file.doSelect('name="' + format + '"');
        if (rc == RC_SUCCESS) {
            link = _findLinkLine(record, file, fieldWrapper, optionValue);
        }

        if (!link) {
            // Next, try to find the link line from the master link record
            rc = file.doSelect('name="' + table + '"');
            if (rc == RC_SUCCESS) {
                link = _findLinkLine(record, file, fieldWrapper, optionValue);
            }
            if (!link) {
                // Finally, it's possible join table
                var tablenames = _getJoinTables(table);
                var i;
                for (i = 0; i < tablenames.length; i++) {
                    rc = file.doSelect('name="' + tablenames[i] + '"');
                    if (rc == RC_SUCCESS) {
                        link = _findLinkLine(record, file, fieldWrapper, optionValue);
                        if (!link) {
                            break;
                        }
                    }
                }
            }
        }
        if (!link && vars.$L_link != null) {
            // at last, $L.link may be used.
            link = _findLinkLine(record, vars.$L_link, fieldWrapper, optionValue);
        }
        funcs.cleanup(vars.$File);
        return link;
    }

    // Evaluate javascript within function scope
    function _doEval(prejs) {
        var record = vars.$File;
        eval(prejs);
    }
    //
    function _setDisplayValue(record, fieldWrapper, value) {
        if (value === null || _null(value)) {
            value = "";
        }
        var field = fieldWrapper.field;
        //ignore variable
        if (field.indexOf("$") != 0) {
            if (fieldWrapper.isArray) {
                funcs.set_display_value(record, field, value, fieldWrapper.index);
            } else {
                var fieldType = system.functions.type(record[field]);
                if (lib.DataTypeConst.typeCharacter() == fieldType || lib.DataTypeConst.typeArray() == fieldType) {
                    funcs.set_display_value(record, field, value);
                } else {
                    log.warn("Field type should by STRING or ARRAY");
                }
            }
        }
    }

    // Find the link line in the link record for the given field
    function _findLinkLine(record, linkRecord, fieldWrapper, optionValue) {
        var field = fieldWrapper.field;
        var link = null;
        var i, j;
        for (i = 0, len = linkRecord.source_fields.length(); i < len; i++) {
            vars.$fill_skip = false;
            vars.$fill_recurse = false;

            // Search the link line by checking the source field
            if (linkRecord.source_fields[i] == field) {

                // set $File before eval script
                vars.$File = record;

                // If there are expressions defined, evaluate them
                var expressions = linkRecord.link_expressions[i];

                if (expressions) {
                    //set display value with user input in case the query is defined in linkline by "get.display.value" function
                    _setDisplayValue(record, fieldWrapper, optionValue);

                    for (j = 0, count = expressions.length(); j < count; j++) {
                        if (expressions[j] != null) {
                            evaluate(expressions[j]);
                        }
                    }

                }
                //check wheter this link line has post expressions or post java script
                var post_expression = denull(linkRecord.post_expressions[i]);
                var hasPostStatement = (post_expression != null && lng(post_expression) > 0) ||
                    linkRecord.javascript_post[i] != null;
                // If there is pre javascript defined, evaluate it
                var prejs = linkRecord.javascript_pre[i];
                if (prejs) {
                    _doEval(prejs);
                }

                // cleanup $File
                funcs.cleanup(vars.$File);

                // If the $fill.skip is set to true, means the link line should be skipped
                if (vars.$fill_skip) {
                    continue;
                }

                var target_file = linkRecord.target_files[i];
                var skipQryRewrite = linkRecord.skip_query_rewrite[i];
                if (funcs._null(skipQryRewrite) || skipQryRewrite === "") {
                    skipQryRewrite = false;
                }

                // if target file is local or global variable
                if (target_file != null && target_file.indexOf("$") == 0) {
                    target_file = vars[target_file];
                }

                // Got the link line
                link = {
                    sourceField: field,
                    targetFile: target_file,
                    targetField: linkRecord.target_fields[i],
                    query: null,
                    hasPostStatement: hasPostStatement,
                    mapping: {},
                    skipQueryRewrite: skipQryRewrite,
                    sortField: linkRecord['target.sort.field'][i],
                    sortOrder: linkRecord['target.sort.order'][i] == 'Descending' ? 1 : 0
                };
                // Fill the field mapping
                var sourceFields = linkRecord.project_source_fields[i];
                var targetFields = null;
                if (sourceFields && sourceFields.length() > 0) {
                    targetFields = linkRecord.project_target_fields[i];
                    for (j = 0, count = sourceFields.length(); j < count; j++) {
                        link.mapping[sourceFields[j]] = targetFields[j];
                    }
                } else {
                    link.mapping[link.targetField] = field;
                }

                link.query = linkRecord.add_query[i];
                link.postFields = [];
                link.postValues = [];

                var queryFile = _getSCFileByLink(record, link, targetFields, fieldWrapper, true, null, optionValue);
                // after execute current entry, possibly move to next entry
                if (vars.$fill_recurse) {

                    //var queryFile = _getSCFileByLink(record, link, targetFields, fieldWrapper, true,null,optionValue);

                    var recordsize = 0;
                    if (queryFile) {
                        recordsize = queryFile.count;
                    }
                    if (recordsize == 0 && linkRecord.source_fields[i + 1] == field) {
                        // move to next entry if next entry is for this field
                        continue;
                    }

                    // set poststatement to true in recurse mode to make sure web client will invoke rad us.link
                    link.hasPostStatement = true;

                    if (recordsize == 1) {
                        var file = queryFile.file;
                        // update data and move to next entry without user interruption 
                        // update set postFields and postValues in link definition
                        if (sourceFields.length() > 0) {
                            targetFields = linkRecord.project_target_fields[i];
                            for (j = 0, count = sourceFields.length(); j < count; j++) {
                                if (/^\$/.test(targetFields[j])) {
                                    vars[targetFields[j]] = file[sourceFields[j]];
                                } else {
                                    record[targetFields[j]] = file[sourceFields[j]];
                                    link.postFields[link.postFields.length] = targetFields[j];
                                    link.postValues[link.postValues.length] = file[sourceFields[j]];
                                }
                            }
                        }
                        if (linkRecord.source_fields[i + 1] == field) {
                            continue;
                        }
                    }
                }
                if (queryFile == null && linkRecord.source_fields[i + 1] == field) {
                    // move to next entry if next entry is for this field
                    continue;
                }
                break;
            }
        }

        funcs.cleanup(vars.$fill_skip);
        return link;
    }

    // Query records based on the given link
    // @param strict if set to true, means the target field must exactly match the value
    function _getSCFileByLink(record, link, targetFields, fieldWrapper, doCount, strict, optionValue) {
        if (!record || !link) {
            return null;
        }
        link.query = _getQueryExpression(record, link, fieldWrapper, strict, optionValue);
        // Init the $File variable if it is used in the query
        var fileBased = /\$File/.test(link.query);
        if (fileBased) {
            vars.$File = record;
        }
        var file = new SCFile(link.targetFile, SCFILE_READONLY);
        var fields = [];
        //Start for logica name
        if (targetFields !== null && targetFields !== "" && targetFields !== undefined && targetFields.length > 0) {
            fields = targetFields;
        }
        //end for logical name
        else {
            var srcField = link.sourceField;
            var tmpField = fieldWrapper.field;
            if (tmpField.indexOf("[") >= 0) {
                tmpField = tmpField.substring(0, tmpField.indexOf("["));
            }

            var refTable = lib.DisplayName.getRefTable(tmpField, funcs.filename(record));
            if (srcField.indexOf("$") === 0 || refTable === "" || refTable === null) {
                refTable = link.targetFile;
            }
            var displayField = "";
            var displayFields = [];
            var displayCaptions = [];
            var retCaptions = [];
            if (true || refTable !== null && refTable !== "" && refTable === link.targetFile) {
                //displayField=lib.DisplayName.getRefTableDisplayField(refTable);
                //QCCR1E123481
                displayField = lib.DisplayName.getDisplayLable(refTable);
                if (displayField !== undefined && displayField !== null && displayField !== "") {
                    fields.push(displayField);
                }

                //additional configured fields in datadict to be displayed
                displayFields = ComfillAutoCompleteUtil.getAutoCompleteDisplayFields(refTable);
                var len = lng(displayFields);
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
            }
            //end for logical name

            var field;
            for (field in link.mapping) {
                if (!lib.ArrayUtil.contains(fields, field)) {
                    fields.push(field);
                }
            }
        }
        //end for logical name

        file.setFields(fields);
        if (link.sortField) {
            file.setOrderBy([link.sortField], [link.sortOrder]);
        }

        var count = -1;
        if (doCount) {
            count = countFile(file, link.query);
            if (count == 0) {
                if (fileBased) {
                    funcs.cleanup(vars.$File);
                }
                return null;
            }
        }

        var rc = RC_SUCCESS;
        if (!doCount || (1 == count && vars.$fill_recurse == true)) {
            rc = file.doSelect(link.query);
        }

        // cleanup $File
        if (fileBased) {
            funcs.cleanup(vars.$File);
        }

        return rc == RC_SUCCESS ? { file: file, count: count } : null;
    }

    function _getValue(record, link, fieldWrapper) {
        var _f = record[link.sourceField];
        if (fieldWrapper.isVariable) {
            _f = vars[link.sourceField];
        }
        if (fieldWrapper.isArray &&
            funcs.type(_f) === lib.DataTypeConst.typeArray()) {
            if (fieldWrapper.isVariable && fieldWrapper.index >= lng(_f)) {
                value = null;
            } else {
                value = _f[fieldWrapper.index];
            }
        } else {
            value = _f;
        }
        return value;
    }

    //Get query expression
    function _getQueryExpression(record, link, fieldWrapper, strict, optionValue) {
        var link_query = link.query;

        if (funcs.type(link_query) != 2) {
            link_query = funcs.str(link_query);
        }
        if (/^\$/.test(link_query)) {
            // The query expression is defined as a variable
            link_query = vars[link_query];
        }

        if (link.targetField == null) {
            return link_query;
        }

        var refTable = lib.DisplayName.getRefTable(link.sourceField, funcs.filename(record));
        var displayField = lib.DisplayName.getRefTableDisplayField(refTable);
        var linkLineTargetTable = link.targetFile;
        if (linkLineTargetTable.indexOf("$") === 0) {
            linkLineTargetTable = evaluate(linkLineTargetTable);
        }
        var appendAutoComQuery = true;
        if (refTable !== null && refTable !== "" && refTable !== linkLineTargetTable) {
            appendAutoComQuery = false;
        }

        var op = (!!strict) ? '=' : '#';
        var value = _getValue(record, link, fieldWrapper);
        if (optionValue != null && optionValue != "") {
            value = optionValue;
        }
        var query = "true";
        if (value != null && value != "" && appendAutoComQuery) {
            if (refTable !== null && refTable !== "" && displayField !== null && displayField !== "") {
                query = displayField + op + '"' + value + '"';
            } else {
                query = link.targetField + op + '"' + value + '"';
            }
        }

        if (link_query != null && link_query != "") {
            var re = new RegExp("(^|\\(|\\s)" + link.targetField.replace(/\./g, "\\.") + "\\s*~");
            // Do not add the condition for the target field if the link.query already contains not operator
            // for it, e.g. name~#assignee.name in $File, (name~=assignee.name in $File)
            // update by Xiong-jie MA, to ignore append the query if it is adhoc sql.
            var startStr = link_query.substring(0, 7);
            startStr = startStr.toUpperCase();
            if (!re.test(link_query) && startStr !== "SELECT ") {
                query = '(' + link_query + ') and ' + query;
            } else {
                query = link_query;
            }
        }
        var append_query = null;
        if (link.targetFile == "cm3r") {
            append_query = funcs.str(vars["$G.cm3r.environment"].append_query);
        } else if (link.targetFile == "cm3t") {
            append_query = funcs.str(vars["$G.cm3t.environment"].append_query);
        }
        if (append_query != null && append_query != "") {
            query += " and (" + append_query + ")";
        }
        var srcField = link.sourceField;

        if (srcField.indexOf("$") === 0) {
            refTable = linkLineTargetTable;
        }
        if (refTable !== null && refTable !== "" && !link.skipQueryRewrite) {
            query = lib.DisplayName.reGenLinkQuery(query, link.targetFile);
        }

        log.debug("getQueryExpression() - query:" + query);
        return query;
    }

    return {
        getLinkDef: _getLinkDef,
        getSCFileByLink: _getSCFileByLink,
        getQueryExpression: _getQueryExpression,
        doEval: _doEval,
        setDisplayValue: _setDisplayValue
    };

})();


/**
 * Concatenate link lines
 *
 * @param {SCFile} link
 * @param {SCFile} appendLink, the link to be append
 */
function concatLinkLines(link, appendLink) {
    /*
     * the type of "add.query" field is always 2 (string) when trying to use JS to merge link lines,
     * this field handle correctly only in RAD with type 13 (global variable). 
     */
    callrad("se.merge.link", ["file", "second.file"], [link, appendLink]);
}

function countFile(file, sql) {
    return file.doCount(sql);
}

function isFillSkip(stringSource) {
    if (stringSource == null || stringSource == "{}") {
        return false;
    }
    //remove {}
    stringSource = stringSource.substring(1, stringSource.length - 1)
    //separate source to lines 
    var lines = stringSource.split(", ");
    for (line of lines) {
        if (line.trim() !== "") {
            var segs = formatLine(line);
            for (var i = 0, n = segs.length; i < n; i++) {
                var seg = segs[i];
                 // ignore "if-then / else" or "for / do" or "while / do" or  "if-then / else" or "//"
                if (isSegment(seg, "if") || isSegment(seg, "for") || isSegment(seg, "while") || seg.startsWith("//")) {
                    continue;
                }
                if (seg.startsWith("$fill.skip=true")) {
                    return true;
                }
            }
        }
    }
    return false;
}

function formatLine(stringLine) {
    var line = stringLine.trim();

    if (line.startsWith("//")) {
        return line;
    }

    //split one line source code to multiple lines by character ';', ignore the ';' between braces or quotes
    var index = 0;
    var braceNumber = 0;
    var quoteNumber = 0;
    var segs = [];

    var chars = Array.from(line);

    for (var i = 0; i < chars.length; i++) {
        var c = chars[i];

        switch (c) {
            case '(':
                braceNumber++;
                break;
            case ')':
                braceNumber--;
                break;
            case '"':
                if (i === 0 || chars[i - 1] !== '\\') {
                    quoteNumber++;
                }
                break;
            case ';':
                if (braceNumber === 0 && (quoteNumber % 2 === 0)) {
                    var newindex = i + 1;
                    var seg = line.substring(index, newindex).trim();
                    segs.push(seg);
                    index = newindex;
                }
                break;
        }
    }

    if (index < line.length) {
        var seg = line.substring(index, line.length).trim();
        segs.push(seg);
    }

    return segs;
}


function isSegment(seg, keyword) {
    if (seg.length >= keyword.length + 2 && seg.startsWith(keyword)) {
        // the next char should be space or '('
        var c = seg.charAt(keyword.length);
        return (c === '(') || /\s/.test(c);
    }
    return false;
}