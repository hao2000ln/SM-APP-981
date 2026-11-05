var libCmn = lib.reportCmn;
var isLogDebugEnabled = lib.ReportService.isLogDebugEnabled;

var ERR_GRID_NO_FIELDLIST = 58; // Cannot find field list for grid chart %S (id: %s)
var ERR_TITLELIST_NO_FIELD = 203; // Field "%S" is not defined for titled list "%S" (id: %S)
var ERR_TYPE_ERROR = "3";
var ERR_CODE_PREFIX_BASE = "E"; // The error code for Base module:   "E" + ####

var CHART_TITLEDGRID = "TITLEDGRID";


function getColumnsFromFormat(strFormatName) {
    if (strFormatName == null) {
        return null;
    }
    var fFormat = new SCFile("format", SCFILE_READONLY);
    fFormat.setFields("field");
    var rc = fFormat.doSelect("name=\"" + strFormatName + "\"");
    var iCount = 0;
    var column = new Datum();
    column.setType(8);
    if (rc == RC_SUCCESS) {
        while (fFormat.field.length() > iCount) {
            if (fFormat.field[iCount].property.indexOf("Column;") == 0) {
                column.push(fFormat.field[iCount].input);
            }
            iCount++;
        }
    }
    return column;
}

function getColumnsFromFormatObj(fFormat) {
    if (fFormat == null) {
        return null;
    }

    var column = new Datum();
    column.setType(8);
    var iCount = 0;

    if (fFormat.field && fFormat.field.length() > 0) {
        while (fFormat.field.length() > iCount) {
            if (fFormat.field[iCount].property.indexOf("Column;") == 0) {
                column.push(fFormat.field[iCount].input);
            }
            iCount++;
        }
    }
    return column;
}

function getDefaultColumns(file_name, fInbox, logger) {
    var defaultFormat = lib.convertToRelatedObjectCaptions.getDefaultFormat(file_name);
    if (isLogDebugEnabled()) {
        logger.debug('default format: ' + defaultFormat);
    }

    if (!defaultFormat) {
        var fmt = funcs.generate_list_view(file_name, file_name + ".qbe", fInbox);
        return fmt ? getColumnsFromFormatObj(fmt) : null;
    }

    if (defaultFormat.indexOf('$') >= 0 || defaultFormat.indexOf('jscall') >= 0) {
        // need to evaluate it
        var parsedFormat = funcs.evaluate(funcs.parse(defaultFormat, 2));
        if (isLogDebugEnabled()) {
            logger.debug("evaluated defaultFormat: " + parsedFormat);
        }

        if (parsedFormat) {
            defaultFormat = parsedFormat;
        }
    }

    var cols = getColumnsFromFormat(defaultFormat + ".g");

    if (!cols || cols.getSize() <= 0) {
        // lib.convertToRelatedObjectCaptions.getColumnsFromFormat
        cols = getColumnsFromFormat(defaultFormat);
    }

    return cols;
}

// gridGenResult
function gridGenResult(meta, bRefresh, logger) {
    var resultSet = gridGenDataList(meta, bRefresh, logger);

    delete meta.source;
    delete meta.fieldNameList;
    delete meta.sortFieldList;
    delete meta.sortOrderList;
    delete meta.iscrosstable;
    delete meta.single_query;

    if (meta.bTitleList) {
        delete meta.titleFields;
        delete meta.fields;
    }
    delete meta.bTitleList;

    if (meta.drillDownQuery) {
        meta.query = meta.drillDownQuery;
        delete meta.drillDownQuery;
    }

    var grid_result = {
        "meta": meta,
        "resultSet": resultSet
    };

    return grid_result;
}

// De-mangle the "probsummary;assignee.name;operator;name;operator;email" to an object like,
function getRealFieldNameFromAdhocFieldString(strLongFieldString) {
    var ret = null;
    var fields = strLongFieldString.split(";");
    if (fields.length >= 2) {
        ret = {
            "filename": fields[fields.length - 2],
            "fieldname": fields[fields.length - 1]
        };

        ret.fieldname = ret.fieldname.replace(/(^\s*)|(\s*$)/g, "");
    }

    return ret;
}

// Get pretty field caption base raw field string
// probsummary;assignee.name;operator;name;operator;email --> Assignee Email
// probsummary;assignee.name;operator;name;operator;contact.name;contacts;contact.name;contacts;company  --> Assignee Contact Name Contact Name
function getFieldCaptionFromAdhocFieldString(strLongFieldString) {
    var ret = "";
    var fields = strLongFieldString.split(";");

    if (fields.length >= 6) {
        var f;

        var i;
        for (i = 0; i < fields.length - 2; i += 4) {
            var filename = fields[i];
            var fieldname = fields[i + 1];

            f = new SCFile(filename);

            if (ret) {
                ret = ret + ' - ';
            }
            ret += libCmn.getFieldCaption(f, fieldname);
        }

        f = new SCFile(fields[fields.length - 2]);

        if (ret) {
            ret = ret + ' - ';
        }
        ret += libCmn.getFieldCaption(f, fields[fields.length - 1]);
    }

    return ret;
}

function titledListMetaGetField(fInbox, meta, attrField, bNullable) {
    var field = {
        "type": null,
        "ref": null,
        "caption": null
    };

    field.ref = fInbox[attrField];
    if (!field.ref) {
        if (!bNullable) {
            throw libCmn.createReportServiceError(ERR_TITLELIST_NO_FIELD, ERR_TYPE_ERROR, [attrField, meta.name, meta.id]);
        }

        return null;
    }

    meta.titleFields.push(field.ref);

    return field;
}

function titledListSetupMeta(fInbox, meta) {
    // All the configuration of titledList is stored in attributes
    meta.uniqueField = {
        "type": "character",
        "ref": "xxxUniqueQuery",
        "caption": "xxxUniqueQuery"
    };

    /*
     "list.idField" -> "idField"
     "list.titleField" -> "titleField"
     "list.optionField1" -> "optionField1"
     "list.descField" -> "descField"
     "list.optionField2" -> "optionField2"
     */

    meta.titleFields = [];

    meta.header1Field = titledListMetaGetField(fInbox, meta, "list.tfields.header1Field", true);
    meta.header2Field = titledListMetaGetField(fInbox, meta, "list.tfields.header2Field", true);
    meta.flagField = titledListMetaGetField(fInbox, meta, "list.tfields.flagField", true);
    meta.summaryField = titledListMetaGetField(fInbox, meta, "list.tfields.summaryField", true);
    meta.footerField = titledListMetaGetField(fInbox, meta, "list.tfields.footerField", true);

    return meta;
}

function titledListUpdateField(meta, rawFieldName, field) {
    if (meta.header1Field && (rawFieldName === meta.header1Field.ref)) {
        meta.header1Field = field;
    }

    if (meta.header2Field && (rawFieldName === meta.header2Field.ref)) {
        meta.header2Field = field;
    }

    if (meta.flagField && (rawFieldName === meta.flagField.ref)) {
        meta.flagField = field;
    }

    if (meta.summaryField && (rawFieldName === meta.summaryField.ref)) {
        meta.summaryField = field;
    }

    if (meta.footerField && (rawFieldName === meta.footerField.ref)) {
        meta.footerField = field;
    }
}

function findDuplicateInJSArray(arr, item) {
    var i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            return true;
        }
    }

    return false;
}

function gridSetupDrillDownQuery(rawFieldNameList, meta, logger) {
    if (!meta.query) {
        meta.query = "true";
    }
    var rawQuery = funcs.generate_sql_query(rawFieldNameList, meta.query, meta.table, true, meta.sortFieldList);

    meta['drillDownQuery'] = meta.query;
    return rawQuery;
}

/**
 * Check whether it's a cross-table query
 */
function gridIsCrossTable(rawFieldNameList, meta, logger) {
    if (!meta.query) {
        meta.query = "true";
    }
    var rawQuery = funcs.generate_sql_query(rawFieldNameList, meta.query, meta.table, false, meta.sortFieldList);

    var q = rawQuery.replace(/^\s+/, "").toUpperCase();
    meta.iscrosstable = q.indexOf("SELECT ") == 0;
    if (!meta.iscrosstable) {
        meta.single_query = rawQuery;
    }

    return rawQuery;
}

function gridSetupMeta(fInbox, meta, logger) {
    var fieldNameList = fInbox.fieldlist;
    var pfnVisible = libCmn.isFieldVisible;

    if (fieldNameList) {
        fieldNameList = funcs.denull(fieldNameList);
    }

    if (!fieldNameList || fieldNameList.getSize() == 0) {
        if (isLogDebugEnabled()) {
            logger.debug("No field list defined, try to get default columns: " + fieldNameList);
        }
        fieldNameList = getDefaultColumns(meta.table, fInbox, logger);
    }

    if (isLogDebugEnabled()) {
        logger.debug("field list: " + fieldNameList);
    }

    if (!fieldNameList || fieldNameList.getSize() == 0) {
        throw libCmn.createReportServiceError(ERR_GRID_NO_FIELDLIST, ERR_TYPE_ERROR, [meta.name, meta.id]);
    }

    var fields = [];
    // __uniquequery is a constant field name which depicts a unique query field.
    var ukField = {
        "type": "character",
        "ref": "xxxUniqueQuery",
        "caption": "xxxUniqueQuery"
    };
    fields.push(ukField);

    var f = new SCFile(meta.table);

    var adhocFieldList = [];
    var adhocFieldCnt = 0;
    var adhocFieldPrefix = "aDhOcsQLsPeCiALnAmE"; // I'm "AdhocSqlSpecialName" :), don't use "_" and "." and other special characters since RTE might escaping them

    // handle order-by field list, build the sort-field-list and sort-order-list
    var SORT_ASC = "ascending"; // SM uses 0 for ASC
    var SORT_DESC = "descending"; // SM uses 1 for DESC

    fInbox.sortBy = funcs.denull(fInbox.sortBy);

    var sortByList = fInbox.sortBy;
    var sortFieldList = [];
    var sortOrderList = [];

    var sortByItem;
    var sortField;
    var sortOrder;

    // sort by the group-by fields
    var pos;
    var realField;
    var groupByfields = fInbox.groupBy;

    if (isLogDebugEnabled()) {
        logger.debug("groupBy conf: " + groupByfields);
    }

    var nGrp;
    var groupSize = groupByfields.getSize();
    for (nGrp = 0; nGrp < groupSize; nGrp++) {
        // definition of sortBy item, [bShowField, rawFieldName, sortOrder]
        sortByItem = groupByfields[nGrp];
        sortField = null;
        sortOrder = sortByItem[1];

        if (sortByItem) {
            sortField = sortByItem[0];
        }

        if (sortField) {
            // need to extract the field name from rawFieldName, since it could be like "probsummary;number"
            pos = sortField.indexOf(';', 0);

            if (isLogDebugEnabled()) {
                logger.debug("groupBy item: " + sortByItem + ", groupBy field: " + sortField + ", pos: " + pos);
            }

            var groupFieldName;
            if (pos > 0) {
                realField = getRealFieldNameFromAdhocFieldString(sortField);
                if (!realField) {
                    continue;
                }

                groupFieldName = realField.fieldname;
            } else {
                groupFieldName = sortField;
            }
            var posStruct = groupFieldName.indexOf(',');
            if (posStruct > 0) {
                groupFieldName = groupFieldName.substring(posStruct + 1);
            }

            if (findDuplicateInJSArray(sortFieldList, groupFieldName)) {
                continue;
            }
            sortFieldList.push(groupFieldName);

            // sort direction
            sortOrderList.push((sortOrder === SORT_DESC) ? 1 : 0);
        }
    } // for group by

    if (isLogDebugEnabled()) {
        logger.debug("sortBy conf: " + sortByList);
    }

    var nSort;
    var sortSize = sortByList.getSize();
    for (nSort = 0; nSort < sortSize; nSort++) {
        // definition of sortBy item, [bShowField, rawFieldName, sortOrder]
        sortByItem = sortByList[nSort];
        sortField = null;
        sortOrder = sortByItem[2];

        if (sortByItem) {
            sortField = sortByItem[1];
        }

        if (sortField) {
            // need to extract the field name from rawFieldName, since it could be like "probsummary;number"
            pos = sortField.indexOf(';', 0);

            if (isLogDebugEnabled()) {
                logger.debug("sortBy item: " + sortByItem + ", sortBy field: " + sortField + ", pos: " + pos);
            }

            var sortFieldname;
            if (pos > 0) {
                realField = getRealFieldNameFromAdhocFieldString(sortField);
                if (!realField) {
                    continue;
                }

                sortFieldname = realField.fieldname;
            } else {
                sortFieldname = sortField;
            }

            var posStruct = sortFieldname.indexOf(',');
            if (posStruct > 0) {
                sortFieldname = sortFieldname.substring(posStruct + 1);
            }

            if (findDuplicateInJSArray(sortFieldList, sortFieldname)) {
                continue;
            }

            sortFieldList.push(sortFieldname);

            // sort direction
            sortOrderList.push((sortOrder === SORT_DESC) ? 1 : 0);
        }

    } // for

    if (isLogDebugEnabled()) {
        logger.debug("Sort fields: " + sortFieldList + ", sort order: " + sortOrderList);
    }

    if (sortFieldList && sortFieldList.length > 0) {
        meta.sortFieldList = sortFieldList;
        meta.sortOrderList = sortOrderList;
    }

    // setup all the field list, which would be used in "setFields" before consequent "select"
    //
    // For Title List
    // Filter out the fields which is uninterested, i.e. not contained in meta.titleFields
    meta.bTitleList = (meta.type.toUpperCase() === CHART_TITLEDGRID);
    if (meta.bTitleList) {
        fieldNameList = meta.titleFields;
    } else {
        fieldNameList = fieldNameList.toArray();
    }
    var rawFieldNameList = fieldNameList;
    var rawQuery = gridSetupDrillDownQuery(fieldNameList, meta, logger);
    gridIsCrossTable(fieldNameList, meta, logger);

    if (isLogDebugEnabled()) {
        logger.debug("rawFieldNameList: " + rawFieldNameList);
        logger.debug("raw query: " + rawQuery);
    }

    var pfnRemovePrefix = lib.ReportService.removePrefixOfStructureField;

    // ----------------------------
    // Build up the field list
    var nField;
    for (nField = 0; nField < fieldNameList.length; nField++) {
        var fieldname = fieldNameList[nField];
        fieldname = pfnRemovePrefix(fieldname);
        var rawFieldName = fieldname;
        pos = fieldname.indexOf(';', 0);

        var adhocField = null;
        var adhocFieldFakeName = null;
        var realAdhocField = null;

        if (pos >= 0) {
            // For field like "probsummary;assignee.name;operator;name;operator;email" (rawFieldName),
            // After generate-sql-query, the field would be like "probsummary_assignee.name_operator_name_operator_email" (genFieldName)
            // But the problem is, if we pass "probsummary_assignee.name_operator_name_operator_email" to SCFile, it would be converted to "probsummary.assignee.name.operator.name.operator.email"
            // So we cannot get the field data finally
            // The solution is to replace the field name from generate-sql-query (genFieldName) with a fake but valid alias
            // The naming convention is, ADHOCSQL_SPECIAL_NAME_###, the ### started from 0

            realAdhocField = getRealFieldNameFromAdhocFieldString(fieldname);

            if (realAdhocField && (realAdhocField.filename !== meta.table)) {
                adhocField = []; // [rawFieldName, genFieldName, fakeFieldName]
                adhocField.push(fieldname);

                fieldname = fieldname.replace(new RegExp(";", 'g'), "_");

                adhocField.push(fieldname);

                adhocFieldFakeName = adhocFieldPrefix + adhocFieldCnt;
                adhocField.push(adhocFieldFakeName);
                adhocFieldList.push(adhocField);
                adhocFieldCnt++;

                fieldNameList[nField] = adhocFieldFakeName;
            } else {
                // convert the 'probsummary;open.time' to 'open.time'
                fieldname = fieldname.substring(pos + 1, fieldname.length);
                fieldname = fieldname.replace(/(^\s*)|(\s*$)/g, "");
                fieldNameList[nField] = fieldname;
            }
        }

        var field = {
            "type": null,
            "ref": fieldname,
            "caption": null
        };

        var colorCfg;

        // For the fields from adhoc sql, decorate the field-name and field-caption
        // The naming convention of field-caption is: "Caption-Of-Field-In-Main-File" + " " + "Caption-Of-Field-In-Secondary-File"
        if (adhocFieldFakeName) {
            field.ref = adhocFieldFakeName;

            var fAdhoc = new SCFile(realAdhocField.filename);
            if (!pfnVisible(fAdhoc, realAdhocField.filename)) {
                fieldNameList.splice(nField, 1);
                nField--;

                if (meta.bTitleList) {
                    titledListUpdateField(meta, rawFieldName, null);
                }

                continue;
            }

            field.type = libCmn.getFieldType(fAdhoc, realAdhocField.fieldname);
            field.caption = getFieldCaptionFromAdhocFieldString(adhocField[0]);

            if (logger.bIncludeColor) {
                colorCfg = lib.ColorIndicatorService.queryFieldColor(realAdhocField.filename, realAdhocField.fieldname);
                if (colorCfg) {
                    field.colorRules = colorCfg;
                }
            } else {
                field.realFile = realAdhocField.filename;
                field.realField = realAdhocField.fieldname;
            }
        } else {
            if (!pfnVisible(f, fieldname)) {
                fieldNameList.splice(nField, 1);
                nField--;

                if (meta.bTitleList) {
                    titledListUpdateField(meta, rawFieldName, null);
                }

                continue;
            }

            field.type = libCmn.getFieldType(f, fieldname);
            if (isLogDebugEnabled()) {
                logger.debug("Field: " + fieldname + ", type: " + field.type);
            }
            field.caption = libCmn.getFieldCaption(f, fieldname);

            if (logger.bIncludeColor) {
                colorCfg = lib.ColorIndicatorService.queryFieldColor(meta.table, fieldname);
                if (colorCfg) {
                    field.colorRules = colorCfg;
                }
            } else {
                field.realFile = meta.table;
                field.realField = fieldname;
            }
        }

        var gl = null;
        if (adhocFieldFakeName && realAdhocField) {
            gl = libCmn.globallistDefGet(realAdhocField.filename, realAdhocField.fieldname);
        } else {
            gl = libCmn.globallistDefGet(meta.table, fieldname);
        }

        if (gl && gl.found) {
            field.valueList = gl.valueList;
            field.displayList = gl.displayList;
            field.type = "character";
        }

        fields.push(field);

        if (meta.bTitleList) {
            titledListUpdateField(meta, rawFieldName, field);
        }
    } // for fields

    // replace the genFieldName with fakeFieldName
    var nField;
    for (nField = 0; nField < adhocFieldList.length; nField++) {
        // [rawFieldName, genFieldName, fakeFieldName]
        var adhocField = adhocFieldList[nField];
        rawQuery = rawQuery.replace(' ' + adhocField[1], ' ' + adhocField[2]);

        if (isLogDebugEnabled()) {
            logger.debug("Replace " + adhocField[1] + " by " + adhocField[2]);
        }
    } // for

    meta.query = rawQuery;

    // append adhoc table sort fields to query
    mergeCrossTableSortList(meta);

    if (isLogDebugEnabled()) {
        logger.debug("final query: " + ((meta.iscrosstable) ? meta.query : meta.single_query));
    }

    meta.fields = fields;
    meta.fieldNameList = fieldNameList; // field-name-list is for temporary usage which would be used to generate the final query

    if (isLogDebugEnabled()) {
        logger.debug("Final fieldNameList: " + fieldNameList);
    }

    return meta;
}

// read the file sqloptions for the dbtype
function getSqlDbType() {
    var f = new SCFile("sqloptions", SCFILE_READONLY);
    f.setFields("sql.db.type");
    var rc = f.doSelect("true");

    return f.sql_db_type;
}

function isOracle() {
    var strDBtype = getSqlDbType();
    strDBtype = strDBtype.toLowerCase();

    if (strDBtype.indexOf("ora", 0) >= 0) {
        return true;
    }
    return false;
}

// gridGenDataList
function gridGenDataList(meta, bRefresh, logger) {
    var f = new SCFile(meta.table, SCFILE_READONLY);

    var jsFieldList = meta.fieldNameList;

    // Max Group Limitation
    var maxGroup = libCmn.getMaxRecordLimit(meta, logger);
    var currGroup = 0;
    var bHasMore = false;

    if (maxGroup > 0) {
        f.setSelectTop(maxGroup + 1);
    } else {
        f.setSelectTop(500);
    }

    libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);
    meta.query = libCmn.fixQuery(meta.table, meta.query, logger);

    if (meta.sortFieldList && meta.sortFieldList.length > 0) {
        // "setsort" should be called after select
        // "setOrderBy" should be called before select
        f.setOrderBy(meta.sortFieldList, meta.sortOrderList);
    }

    var rc = (meta.iscrosstable) ? f.doSelect(meta.query, true) : f.doSelect(meta.single_query, true);

    if (isLogDebugEnabled()) {
        logger.debug("Grid query done, rc: " + rc);
    }
    libCmn.checkQueryRC(rc);

    if ((rc != RC_SUCCESS) && (rc != RC_NO_MORE)) {
        var errObj = new Error();
        errObj.errorCode = libCmn.padString(ERR_CODE_PREFIX_BASE, rc);
        errObj.message = funcs.scmsg(libCmn.getSCMsgCode(rc), "us", []);

        throw errObj;
    }

    var datalist = [];
    var reflist = [];
    var ii;
    for (ii = 0; ii < jsFieldList.length; ii++) {
        reflist.push([]);
    }
    while (rc == RC_SUCCESS) {
        if ((maxGroup > 0) && (currGroup >= maxGroup)) {
            bHasMore = true;
            if (isLogDebugEnabled()) {
                logger.debug("Reach maximum record limit (" + maxGroup + "), stop fetching data");
            }

            break;
        }

        var item = [];
        item.push(getTagQuery(f, meta.table));

        var i;
        for (i = 0; i < jsFieldList.length; i++) {
            var val = f[jsFieldList[i]];

            if (val) {
                var fieldType = meta.fields[i + 1].type;
                if (fieldType === 'time') {
                    val = funcs.val(val, 2);
                } else if (fieldType === 'array') {
                    val = val.toArray();
                }
                var fieldRefTable = lib.DisplayName.getFieldReferenceTable(meta.table, jsFieldList[i]);
                if (fieldRefTable) //refrence field
                {
                    if (fieldType === 'array') {
                        var len;
                        for (len = 0; len < val.length; len++) {
                            if (!lib.ArrayUtil.contains(reflist[i], val[len])) {
                                reflist[i].push(val[len]);
                            }
                        }
                    } else if (!lib.ArrayUtil.contains(reflist[i], val)) {
                        reflist[i].push(val);
                    }
                }
            }

            if (val || val === false || val === 0) {
                item.push(val);
            } else {
                item.push("");
            }
        }

        datalist.push(item);
        rc = f.getNext();

        currGroup++;
    } // data

    //check reference field and update the display value
    for (ii = 0; ii < jsFieldList.length; ii++) {
        var onefield = reflist[ii];
        var fieldRefTable = lib.DisplayName.getFieldReferenceTable(meta.table, jsFieldList[ii]);
        var refValueList = [];
        lib.ArrayUtil.addAll(refValueList, onefield);
        var refdisplayNameList = lib.DisplayName.getCachedNameList(onefield, fieldRefTable);
        if (onefield.length > 0) {
            var fieldType = meta.fields[ii + 1].type;
            if (fieldType === 'array') // array didn't support global list, need a enhance for client
            {
                var irow;
                for (irow = 0; irow < datalist.length; irow++) {
                    var onerow = datalist[irow];
                    var onecol = onerow[ii + 1];
                    if (onecol && onecol.length > 0) {
                        //replace it with display name
                        var icell;
                        for (icell = 0; icell < onecol.length; icell++) {
                            var index = lib.ArrayUtil.indexOf(refValueList, onecol[icell]);
                            if (index != -1) {
                                onecol[icell] = refdisplayNameList[index];
                            }
                        }
                    }
                }
            } else {

                meta.fields[ii + 1].valueList = refValueList;
                meta.fields[ii + 1].displayList = refdisplayNameList;
            }
        }
    }
    return {
        "hasMore": bHasMore,
        "timestamp": libCmn.getNowString(),
        "data": datalist
    };
}


/**
 * merge cross table sort list to query if sort by cross table field
 *
 * @param {Object} meta
 */
function mergeCrossTableSortList(meta) {

    var sortFieldList = meta.sortFieldList;
    if (!sortFieldList || sortFieldList.length == 0) {
        return;
    }

    var sortOrderList = meta.sortOrderList;

    var file = new SCFile(meta.table, SCFILE_READONLY);
    var i;

    if (!meta.iscrosstable) {
        for (i = sortFieldList.length - 1; i >= 0; i--) {
            // remove cross table sort field
            if (!funcs.exists(sortFieldList[i], file)) {
                sortFieldList.splice(i, 1);
                sortOrderList.splice(i, 1);
            }
        }

        return;
    }

    // check whether sort field is cross table field 
    var needSort = false;
    for (i = 0; i < sortFieldList.length; i++) {
        if (!funcs.exists(sortFieldList[i], file)) {
            needSort = true;
            break;
        }
    }

    if (!needSort) {
        return;
    }

    // generate order by clause
    var orderSql = " ORDER BY ";
    for (i = 0; i < sortFieldList.length; i++) {
        orderSql += sortFieldList[i] + " " + (sortOrderList[i] == 0 ? "ASC" : "DESC");
        if (i < sortFieldList.length - 1) {
            orderSql += ', ';
        }
    }

    // append order by to query and clear sort list
    meta.query += orderSql;
    meta.sortFieldList = [];
    meta.sortOrderList = [];
}


function getTagQuery(record, file_name) {
    var tag = getTagByRecord(record);
    var query = getQueryByTag(tag, file_name);

    return query;
}

function getTagByRecord(record) {
    var lRtnCode = new SCDatum();
    var lTag = new SCDatum();
    var lVoid = funcs.rtecall("tag", lRtnCode, lTag, record);

    return funcs.str(lTag);
}

function getQueryByTag(lTag, file_name) {
    var lInitedFile = new SCFile(file_name);
    var lRtnCode = new SCDatum();
    var lRtnSql = new SCDatum();

    var lVoid = funcs.rtecall("tagquery", lRtnCode, lInitedFile, lRtnSql, lTag);
    var sql = funcs.str(lRtnSql);

    return sql;
}