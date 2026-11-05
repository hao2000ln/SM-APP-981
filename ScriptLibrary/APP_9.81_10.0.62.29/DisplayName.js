var $ = lib.c.$;

var dbdictService = $("#dbdictService");
var initDbdictFile = lib.dbdictHelper.initDbdictFile;
var scmsg = funcs.scmsg;
var arrayDelete = funcs._delete;
var arrayInsert = funcs.insert;
var escapeAllStr = lib.StringUtil.escapeAllStr;
var dbdictHelper = funcs.dbdict_helper;
var policyread = funcs.policyread;

var dsCache = lib.DisplayNameCache.getDisplayNameCache();
var rtCache = lib.DisplayNameCache.getReferenceTableCache();
var rtDFCache = lib.DisplayNameCache.getRefTableDisplayFieldCache();
//Constant  

//only no nulls key field can be set as display field
var AVAILABLE_KEYTYPES = [$.keyType.NoNulls];
var CREATED_BY_SYSTEM_LABEL = "auto";

var HAS_DISPLAY_FIELD_TABLES = lib.DisplayNameCustom.hasDisplayFieldTables();
//alias name for display field of a table
var TABEL_DISPLAYLABEL_MAPPING = lib.DisplayNameCustom.getTableDisplayNameMapping();

var _log = getLog("LogicalName");

/**
 *  This function is to initialize available display fields
 *
 *  @param {String} tableName - the table name for being initialized
 */
function initAvailableDisplayFields(tableName) {
    var valueList = [];
    var displayList = [];
    var fieldName = "";
    var smFile = initDbdictFile(tableName);
    var fieldList = smFile.field;
    var len = funcs.lng(fieldList);
    var avaiKeyFields = _getAvailableKeyFields(smFile, AVAILABLE_KEYTYPES);
    var i;
    for (i = 0; i < len; i++) {
        fieldName = fieldList[i].name;
        if (policyread(tableName, fieldName, "avail") && !policyread(tableName, fieldName, "invisible") && fieldList[i].type === $.Character && !_isAlias(tableName, fieldName) && lib.ArrayUtil.contains(avaiKeyFields, fieldName)) {
            valueList.push(fieldName);
            var caption = getFieldCaption(tableName, fieldName);
            displayList.push(caption + " - " + fieldList[i].name);
        }
    }
    //sort array a~z
    var temp = new SCDatum(8);
    temp.push(valueList);
    temp.push(displayList);
    var retcode = new SCDatum();
    funcs.rtecall("sort", retcode, temp, 0, 0);
    valueList = temp[0];
    displayList = temp[1];
    vars.$fieldValueList = valueList;
    vars.$fieldDisplayList = displayList;
}

function getFieldCaption(tableName, fieldName) {
    var caption = "";
    caption = policyread(tableName, fieldName, 'captions');
    if (caption === null || caption === "") {
        return fieldName;
    }
    return caption;
}

function initReferenceTableList() {
    vars['$referenctTablesList'] = HAS_DISPLAY_FIELD_TABLES;
}

/**
 *  This function is to check if there is a field named DISPLAY_LABEL except current field user selected
 *
 *  @param {String} tableName - the table name for being set
 *  @param {String} currentField - the current field user selected
 *  @return-true if there is not, false if there is
 */
function validateDisplayField(tableName, currentField) {
    var displayLabel = getDisplayLable(tableName);
    var rtn = true;
    var fieldName = "";
    var smFile = initDbdictFile(tableName);
    var fieldList = smFile.field;
    var len = funcs.lng(fieldList);
    var i;
    for (i = 0; i < len; i++) {
        fieldName = fieldList[i].name;
        if (fieldName === displayLabel && fieldName !== currentField) {
            if (!_isAlias(tableName, fieldName)) {
                rtn = false;
            }
        }
    }

    return rtn;
}

/**
 *  This function is to set display field,system will delete the alias of 'DISPLAY_LABEL' if exists and add this alias to current field
 *
 *  @param {String} tableName - the table name for being set
 *  @param {String} currentField - the current field user selected
 *  @param {String} oldField - the previous field before changing
 */
function setDisplayField(tableName, currentField, oldField) {
    var paramType = funcs.type(currentField);
    if (paramType === 2) {
        if ("object" === typeof currentField) {
            currentField = currentField.getText();
        }
    }

    var displayLabel = getDisplayLable(tableName);
    var fieldName = "";
    var smFile = initDbdictFile(tableName);
    var fieldList = smFile.field;
    var len = funcs.lng(fieldList);
    var i;
    var j = 0;
    for (i = 0; i < len; i++) {
        fieldName = fieldList[i].name;
        if (fieldName === displayLabel && fieldName !== currentField) {
            if (_isAlias(tableName, fieldName)) {
                smFile.field = arrayDelete(smFile.field, (i + 1), 1);
                fieldList = smFile.field;
                len = funcs.lng(fieldList);
                logInfo("Deleted alias '" + displayLabel + "' for field '" + oldField + "'.");
                break;
            }
        }
    }

    var a;
    for (a = 0; a < len; a++) {
        fieldName = fieldList[a].name;
        if (fieldName === currentField) {
            j = a;
        }
    }

    if (currentField !== null && currentField !== "") {
        var alias = _getFieldAlias(smFile, currentField);
        if (currentField !== displayLabel && !lib.ArrayUtil.contains(alias, displayLabel)) {
            smFile.field = arrayInsert(smFile.field, (j + 2), 1);
            smFile.field[j + 1].name = displayLabel;
            smFile.field[j + 1].type = smFile.field[j].type;
            smFile.field[j + 1].level = smFile.field[j].level;
            smFile.field[j + 1].index = smFile.field[j].index;
            logInfo("Added alias '" + displayLabel + "' for field '" + currentField + "'.");
        }
    }

    smFile.doUpdate();
}

/**
 *  This function is to log CI display name changes into dataModEvent table
 *
 *  @param {String} tableName - the table name of CI
 *  @param {String} recordId - CI logical.name
 *  @param {String} newValue - CI display name old value
 *  @param {String} oldValue - CI display name new value
 */
function logDisplayNameChanges(tableName, recordId, newValue, oldValue) {
    var displayLabel = getDisplayLable(tableName);
    var ddmEvent = new SCFile("dataModEvent");
    ddmEvent.active = false;
    ddmEvent.tableName = tableName;
    ddmEvent.recordId = recordId;
    ddmEvent.newValue = newValue;
    ddmEvent.oldValue = oldValue;
    ddmEvent.status = "processed";
    ddmEvent.createdDate = funcs.tod();
    ddmEvent.processedDate = funcs.tod();
    ddmEvent.fieldName = displayLabel;
    ddmEvent.linkedRecordId = "Modified by " + funcs.nullsub(funcs.operator(), "NULL");
    ddmEvent.doInsert();
}

/**
 *  This function is to check if a table should have display field,(for extaccess system will automatically append DISPLAY_LABEL into webservice Fields-->Field)
 *  if current table/jointable exists in HAS_DISPLAY_FIELD_TABLES
 *
 *  @param {String} tableName - the table name of webservice
 *  @return-true if has, false if others
 */
function hasDisplayName(tableName) {
    if (funcs._null(tableName) || tableName === "") {
        return false;
    }

    if (lib.ArrayUtil.contains(HAS_DISPLAY_FIELD_TABLES, tableName)) {
        return true;
    } else {
        var tables = dbdictHelper("joinfile.names", tableName);
        var len = funcs.lng(tables);
        var a;
        for (a = 0; a < len; a++) {
            if (lib.ArrayUtil.contains(HAS_DISPLAY_FIELD_TABLES, tables[a])) {
                return true;
            }
        }
    }

    return false;
}

/**
 *  This function is to check if a table has multi-unique key fields
 *
 *  @param {String} tableName - the table name of webservice
 *  @return-true if has, false if others
 */

function hasMultiUniqueKeyFields(tableName) {
    var keyFields = [];
    var smFile = initDbdictFile(tableName);
    if (smFile === null) {
        return false;
    }

    keyFields = _getUniqueKeyFields(smFile);
    if (keyFields.length > 1) {
        return true;
    }

    return false;
}

function getDisplayLable(tableName) {
    var displayLabel = "";
    if (lib.ArrayUtil.contains(HAS_DISPLAY_FIELD_TABLES, tableName)) {
        displayLabel = TABEL_DISPLAYLABEL_MAPPING[tableName];
    } else {
        var joinedTables = [];
        var join = new SCFile("joindefs", SCFILE_READONLY);
        join.setFields("join.tables");
        var sql = "join.name=\"" + tableName + "\"";
        if (join.doSelect(sql) == RC_SUCCESS) {
            joinedTables = join['join.tables'];
            var len = funcs.lng(joinedTables);
            var i;
            for (i = 0; i < len; i++) {
                if (lib.ArrayUtil.contains(HAS_DISPLAY_FIELD_TABLES, joinedTables[i]['table.name'])) {
                    //If all the joined tables have display label, we just pick the first one
                    if (TABEL_DISPLAYLABEL_MAPPING[joinedTables[i]['table.name']] !== undefined) {
                        displayLabel = TABEL_DISPLAYLABEL_MAPPING[joinedTables[i]['table.name']];
                    }
                }
            }
        }
    }

    return displayLabel;
}

function getSysFieldInvisible(fieldName, smDatadict) {
    var max = smDatadict.fields.length();
    var x;
    for (x = 0; x < max; x++) {
        if (smDatadict.fields[x] == fieldName) {
            if (smDatadict.invisible[x] === true) {
                return true;
            } else {
                return false;
            }
        }
    }

    return false;
}

/**
 *  This function is to update a datadcit record and check if reference table had changed, and then add/remove related linkline
 *
 *  @param {String} fileName  - the table name
 *  @param {String} fieldName - the field name
 *  @param {String} referenceTableName - the reference table name
 *  @param {String} action - 'add' to add a linkline, 'remove' to remove a linkline which created by system
 *  @return-true if has, false if others
 */
function doUpdateReferenceTable(fileName, fieldName, referenceTableName, action) {
    logInfo("doUpdateReferenceTable();fileName=" + fileName + ";fieldName=" + fieldName + ";referenceTableName=" + referenceTableName + ";action=" + action);
    var dict = $(fileName).dbdict();
    var referenceTableDict = $(referenceTableName).dbdict();
    // validate reference table
    if (referenceTableDict == null) {
        return false;
    }

    var uniqueKeyName = _getFirstUniqueKeyName(referenceTableDict);

    var sql = 'source.file="' + fileName + '" and source.field="' + _getFieldFullPath(dict, fieldName) + '"' +
        ' and target.file="' + referenceTableName + '" and target.field="' + _getFieldFullPath(referenceTableDict, uniqueKeyName) + '"' +
        ' and def.type="link"';
    var relation = new SCFile("relation", SCFILE_READONLY);
    relation.setFields(["def.query"]);

    var link = new SCFile("link");
    if ('add' == action) {
        // do nothing if find link record
        if (relation.doSelect(sql) != RC_SUCCESS) {
            sql = 'name="' + fileName + '"';
            if (link.doSelect(sql) != RC_SUCCESS) {
                // create link and linkline
                link.name = fileName;
            }
            // insert after first line
            link.source_fields = _insertLineItem(link.source_fields, fieldName);
            link.target_files = _insertLineItem(link.target_files, referenceTableName);
            link.target_fields = _insertLineItem(link.target_fields, uniqueKeyName);
            link.target_formats = _insertLineItem(link.target_formats, null);

            link.add_query = _insertLineItem(link.add_query, null);
            link.qbe_format = _insertLineItem(link.qbe_format, null);
            link.sort_fields = _insertLineItem(link.sort_fields, null);
            link.project_source_fields = _insertLineItem(link.project_source_fields, null);
            link.project_target_fields = _insertLineItem(link.project_target_fields, null);
            link.link_expressions = _insertLineItem(link.link_expressions, null);
            link.javascript_pre = _insertLineItem(link.javascript_pre, null);
            link.post_expressions = _insertLineItem(link.post_expressions, null);
            link.javascript_post = _insertLineItem(link.javascript_post, null);
            link.project_source_fields = _setValueToArray(link.project_source_fields, uniqueKeyName);
            link.project_target_fields = _setValueToArray(link.project_target_fields, fieldName);

            link.comment = _insertLineItem(link.comment, CREATED_BY_SYSTEM_LABEL);

            link.doSave();
        }
    } else if ('remove' == action) {
        var found = relation.doSelect(sql);
        while (found == RC_SUCCESS) {
            sql = relation.def_query;
            if (link.doSelect(sql) == RC_SUCCESS) {
                var removedLineNumber = -1;
                var fieldsCount = funcs.lng(link.target_files);
                var i;
                for (i = 0; i < fieldsCount; i++) {
                    if (link.source_fields[i] == fieldName &&
                        link.target_files[i] == referenceTableName &&
                        link.target_fields[i] == uniqueKeyName &&
                        link.comment[i] == CREATED_BY_SYSTEM_LABEL) {
                        removedLineNumber = i + 1;
                        break;
                    }
                }
                if (removedLineNumber != -1) {
                    // remove the linkline                    
                    link.source_fields = arrayDelete(link.source_fields, removedLineNumber, 1);
                    link.target_files = arrayDelete(link.target_files, removedLineNumber, 1);
                    link.target_fields = arrayDelete(link.target_fields, removedLineNumber, 1);
                    link.target_formats = arrayDelete(link.target_formats, removedLineNumber, 1);

                    link.add_query = arrayDelete(link.add_query, removedLineNumber, 1);
                    link.qbe_format = arrayDelete(link.qbe_format, removedLineNumber, 1);
                    link.sort_fields = arrayDelete(link.sort_fields, removedLineNumber, 1);
                    link.project_source_fields = arrayDelete(link.project_source_fields, removedLineNumber, 1);
                    link.project_target_fields = arrayDelete(link.project_target_fields, removedLineNumber, 1);
                    link.link_expressions = arrayDelete(link.link_expressions, removedLineNumber, 1);
                    link.comment = arrayDelete(link.comment, removedLineNumber, 1);
                    link.javascript_pre = arrayDelete(link.javascript_pre, removedLineNumber, 1);
                    link.post_expressions = arrayDelete(link.post_expressions, removedLineNumber, 1);
                    link.javascript_post = arrayDelete(link.javascript_post, removedLineNumber, 1);
                    link.doUpdate();
                    break;
                } else {
                    found = relation.getNext();
                }
            }
        }
    }
}

/**
 *  This function is to update a datadcit record and check if reference table had changed, and then add/remove related linkline
 *
 *  @param {SCFile} oldrecord      - the old file
 *  @param {SCFile} record         - the updated file
 *  @return-true if has, false if others
 */
function updateReferenceTable(oldrecord, record) {
    var sourceFileName = record.name;
    var fieldsCount = funcs.lng(record.reference_table);
    var oldFieldsCount = funcs.lng(oldrecord.reference_table);
    var i;
    var j;
    for (i = 0; i < fieldsCount; i++) {
        var flag = false;
        for (j = 0; j < oldFieldsCount; j++) {
            if (record.fields[i] == oldrecord.fields[j]) {
                flag = true;
                if (oldrecord.reference_table[j] == null) {
                    if (record.reference_table[i] != null) {
                        logInfo("add reference table on a field");
                        doUpdateReferenceTable(sourceFileName, record.fields[i], record.reference_table[i], 'add');
                    }
                } else {
                    if (record.reference_table[i] == null) {
                        logInfo("remove a reference table on a field");
                        doUpdateReferenceTable(sourceFileName, record.fields[i], oldrecord.reference_table[j], 'remove');

                    } else if (oldrecord.reference_table[j] != record.reference_table[i]) {
                        //change a reference talbe on a field
                        doUpdateReferenceTable(sourceFileName, record.fields[i], oldrecord.reference_table[j], 'remove');
                        doUpdateReferenceTable(sourceFileName, record.fields[i], record.reference_table[i], 'add');
                    }
                }
                break;
            }
        }

        if (flag == false && record.reference_table[i] != null) {
            logInfo("add reference table on a field");
            doUpdateReferenceTable(sourceFileName, record.fields[i], record.reference_table[i], 'add');
        }
    }
}

/**
 *  This function is to validate the input display field or reference table.
 *    rules:
 *        display.field:
 *            1. current table should only has one unique key
 *            2. display field should be character
 *            3. only no nulls key field can be set as display field
 *        reference.table:
 *            1. reference table exists in dbdict
 *            2. Field type should be character or number
 *            3. Field should not be store in the CLob
 *            4. Reference table should have and only have one unique key
 *            5. Unique key type should same with field type ( e.g. character <-> character ; number <-> number )
 *            6. Field should not be an alias
 *
 *  @param {SCFile} record         - the updated file
 *  @return-true/false
 */
function doValidate(record) {
    var rtn = true;
    vars.$setFlg = null;
    vars.$msg = null;

    var sourceFileName = record.name;
    var displayField = record.display_field;
    logInfo("do validattion. sourceFileName=" + sourceFileName + ";displayField=" + displayField);

    if (hasDisplayName(sourceFileName)) {
        var dt = new SCFile("datadict", SCFILE_READONLY);
        dt.setFields(["display.field"]);
        var sql = "name=\"" + sourceFileName + "\"";
        if (dt.doSelect(sql) === RC_SUCCESS) {
            if (displayField !== dt.display_field) {
                vars.$setFlg = validateDisplayField(sourceFileName, displayField);
                if (!vars.$setFlg) {
                    vars.$msg = scmsg("logical.name_01", "fc", ["'" + getDisplayLable(sourceFileName) + "'"]);
                    return false;
                }
            }
        }

        rtn = hasMultiUniqueKeyFields(sourceFileName);
        if (rtn && displayField !== null && displayField !== "") {
            vars.$setFlg = false;
            vars.$msg = scmsg("logical.name_02", "fc");
            return false;
        }

        rtn = getSysFieldInvisible(displayField, record);
        if (rtn && displayField !== null && displayField !== "") {
            vars.$setFlg = false;
            vars.$msg = scmsg("logical.name_03", "fc", ["'" + displayField + "'"]);
            return false;
        }

        if (displayField === null || displayField === "") {
            vars.$setFlg = false;
            vars.$msg = scmsg("logical.name_04", "fc");
            return false;
        }
    }

    var dbdict = $(sourceFileName).dbdict(); //initDbdictFile(sourceFileName);
    var fieldsCount = funcs.lng(record.reference_table);
    var i;
    for (i = 0; i < fieldsCount; i++) {
        var referenceTableName = record.reference_table[i];
        if (referenceTableName != null) {
            var fieldName = record.fields[i];
            var fieldType = lib.tableFunctions.getFieldType(fieldName, sourceFileName);
            //1.Field type should be character or number
            rtn = _checkFieldType(fieldName, fieldType);
            if (rtn) {
                //2.Field should not be an alias
                rtn = _checkFieldAlias(sourceFileName, fieldName);
                if (rtn) {
                    //3.Field should not be store in the CLob
                    rtn = _checkFieldIsLob(dbdict, fieldName);
                    if (rtn) {
                        //4.Reference table should have and only have one unique key
                        var referenceTableDict = $(referenceTableName).dbdict(); //initDbdictFile(referenceTableName);
                        if (referenceTableDict == null) {
                            rtn = false;
                            vars.$setFlg = rtn;
                            vars.$msg = '';
                        }

                        if (rtn) {
                            rtn = _checkOnlyOneUniqueKey(referenceTableDict, fieldName);
                            if (rtn) {
                                //5.Unique key type should same with field type ( e.g. character <-> character ; number <-> number )
                                rtn = _checkSameFieldType(referenceTableDict, dbdict, fieldName, fieldType);
                            }
                        }
                    }
                }
            }

            if (!rtn) {
                break;
            }
        }
    } // for
}

function getRecordNumber(cls) {
    var number = "";
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, cls);
    number = newid.getText();
    return number;
}

function _getFieldFullPath(dict, fieldName) {
    var descriptorMeta = dbdictService.getDescriptorMeta(dict["field"]);
    var fieldMeta = dbdictService.getFieldMeta(fieldName, descriptorMeta);
    return fieldMeta.path;
}

function _getFirstUniqueKeyName(dbdict) {
    var firstUniqueKey = dbdictService.getPrimaryKey(dbdict["key"]);
    return dbdictService.getFieldNameByPath(firstUniqueKey.name[0]);
}

function _setValueToArray(lineItem, value) {
    var rtn = lineItem;
    if (rtn == null || funcs.lng(funcs.denull(rtn)) === 0) {
        rtn = [
            []
        ];
    }
    rtn[0][0] = value;

    return rtn;
}

function _getFieldSqlType(dict, fieldName) {
    // lib.dbdictHelper
    var descriptorMeta = dbdictService.getDescriptorMeta(dict["field"]);
    var fieldMeta = dbdictService.getFieldMeta(fieldName, descriptorMeta);
    var meta = dbdictService.getFieldMetaWithSQLInfo(fieldMeta);
    return meta.field["sql.field.options"]["sql.data.type"];
}

function _getFieldSqlTypeNoLen(dict, fieldName) {
    var fileType = _getFieldSqlType(dict, fieldName);
    return fileType.substring(0, fileType.indexOf('('));
}

function _insertLineItem(lineItem, value) {
    if (value == null) {
        return arrayInsert(lineItem, 1, 1);
    } else {
        return arrayInsert(lineItem, 1, 1, value);
    }
}

function _checkSameFieldType(referenceDbdict, dbdict, fieldName, fieldType) {
    var rtn = true;
    var skipCheck = false;

    var firstUniqueKeyName = _getFirstUniqueKeyName(referenceDbdict);
    var keyFieldType = lib.dbdictHelper.getFieldType(referenceDbdict, firstUniqueKeyName);
    rtn = keyFieldType === fieldType;
    var theFieldType = _getFieldSqlType(dbdict, fieldName);
    if ('TEXT' == theFieldType.substring(0, 4) || 'CLOB' == theFieldType.substring(0, 4) || 'BLOB' == theFieldType.substring(0, 4) || 'NTEXT' == theFieldType.substring(0, 5) || 'NVARCHAR(MAX)' == theFieldType) {
        skipCheck = true;
    }

    if (rtn && !skipCheck) {
        var refFieldSqlType = _getFieldSqlTypeNoLen(referenceDbdict, firstUniqueKeyName);
        var fieldSqlType = _getFieldSqlTypeNoLen(dbdict, fieldName);
        rtn = refFieldSqlType === fieldSqlType;
    }

    if (!rtn) {
        vars.$setFlg = rtn;
        vars.$msg = scmsg("6", "datadict", ["'" + fieldName + "'"]);
    }

    return rtn;
}

function _checkOnlyOneUniqueKey(dbdict, fieldName) {
    var rtn = true;
    var uniqueKeys = dbdictService.getUniqueAndPrimaryKeys(dbdict["key"]);

    if (uniqueKeys.length > 1 || uniqueKeys[0].name.length() > 1) {
        rtn = false;
        vars.$setFlg = rtn;
        vars.$msg = scmsg("5", "datadict", ["'" + fieldName + "'"]);
    }

    return rtn;
}

function _checkFieldIsLob(dbdict, fieldName) {
    // skip this check.
    var rtn = true;
    return rtn;
}

function _checkFieldAlias(fileName, fieldName) {
    var rtn = true;
    if (_isAlias(fileName, fieldName)) {
        rtn = false;
        vars.$setFlg = rtn;
        vars.$msg = scmsg("3", "datadict", ["'" + fieldName + "'"]);
    }

    return rtn;
}

function _checkFieldType(fieldName, fieldType) {
    var rtn = true;
    if (fieldType != $.Character && fieldType != $.Number) {
        rtn = false;
        vars.$setFlg = rtn;
        vars.$msg = scmsg("2", "datadict", ["'" + fieldName + "'"]);
    }

    return rtn;
}

function _getFieldAlias(dbdict, field) {
    var ret = [];
    if (dbdict == null) {
        return ret;
    }

    var idx = -1;
    var fields = dbdict.field;
    var length = funcs.lng(fields);
    var j;
    for (j = 0; j < length; j++) {
        if (fields[j].name === field) {
            idx = j;
            break;
        }
    }

    if (idx > -1) {
        var level = fields[idx].level;
        var index = fields[idx].index;
        var i;
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

function _getFieldByAlias(dbdict, alias) {
    var ret = "";
    if (dbdict == null) {
        return ret;
    }

    var idx = -1;
    var fields = dbdict.field;
    var length = funcs.lng(fields);
    var j;
    for (j = 0; j < length; j++) {
        if (fields[j].name === alias) {
            idx = j;
            break;
        }
    }

    if (idx > -1) {
        var level = fields[idx].level;
        var index = fields[idx].index;
        var i;
        for (i = 0; i < length; i++) {
            if (fields[i].level === level && index === fields[i].index && fields[i].sql_column_name !== null) {
                ret = fields[i].name;
                break;
            }
        }
    }

    return ret;
}

function _isAlias(fileName, field) {
    return dbdictHelper("is.alias", fileName, field);
}

function _getAvailableKeyFields(dbdict, keys) {
    var keyFields = [];
    var uniqueKeyFields = _getUniqueKeyFields(dbdict);
    var keyList = dbdict.key;
    var len = funcs.lng(keyList);
    var len2 = funcs.lng(uniqueKeyFields);
    if (len2 === 1) {
        var i;
        var j;
        for (i = 0; i < len; i++) {
            if (lib.ArrayUtil.contains(keys, keyList[i].flags)) {
                len2 = funcs.lng(keyList[i].name);
                for (j = 0; j < len2; j++) {
                    if (null !== keyList[i].name[j] && "" !== keyList[i].name[j] && !lib.ArrayUtil.contains(uniqueKeyFields, keyList[i].name[j])) {
                        keyFields.push(keyList[i].name[j]);
                    }
                }
            }
        }
    }

    return keyFields;
}

function _getUniqueKeyFields(dbdict) {
    var keyFields = [];
    var keyList = dbdict.key;
    var len = funcs.lng(keyList);
    var len2 = 0;
    var i;
    var j;
    for (i = 0; i < len; i++) {
        if (keyList[i].flags === $.keyType.Primary || keyList[i].flags === $.keyType.Unique) {
            len2 = funcs.lng(keyList[i].name);
            for (j = 0; j < len2; j++) {
                if (null !== keyList[i].name[j] && "" !== keyList[i].name[j]) {
                    keyFields.push(keyList[i].name[j]);
                }
            }
        }
    }

    return keyFields;
}

function logInfo(info) {
    if (_log.isInfoEnabled()) {
        _log.info(info);
    }
}

function reGenLinkQuery(query, targetFileName) {
    if (query === null || query === "" || targetFileName === null || targetFileName === "") {
        return true;
    }

    var uniqueKey = "";
    var uniqueKeys = dbdictHelper("unique.key", targetFileName);
    var displayField = "";

    //check join table
    if (funcs._null(uniqueKeys)) {
        var tables = dbdictHelper("joinfile.names", targetFileName);
        if (funcs._null(tables)) {
            return query;
        }

        var len = funcs.lng(tables);
        var a;
        for (a = 0; a < len; a++) {
            uniqueKeys = dbdictHelper("unique.key", tables[a]);
            displayField = getRefTableDisplayField(tables[a]);
            if (!funcs._null(uniqueKeys) && displayField !== undefined && displayField !== null && displayField !== "") {
                uniqueKey = uniqueKeys[0];
                break;
            }
        }
    } else {
        uniqueKey = uniqueKeys[0];
        displayField = getRefTableDisplayField(targetFileName);
    }

    if (uniqueKey === undefined || uniqueKey === null || uniqueKey === "" || displayField === undefined || displayField === null || displayField === "") {
        return query;
    }

    var index = uniqueKey.lastIndexOf(",");
    if (index >= 0) {
        uniqueKey = uniqueKey.substr(index + 1);
    }

    // replace unique key field in query with display field
    if (query.indexOf(uniqueKey) >= 0) {
        query = replaceQueryWithDisplayField(query, uniqueKey, displayField);
    }

    return query;
}

function getRefTable(field, tableName) {
    if (tableName === null || tableName === "") {
        return null;
    }

    var rc = policyread(tableName, field, 'reference.table');
    //if rc is null, check if it is join table
    if (funcs._null(rc) || rc === null || rc === "" || rc === undefined) {
        var tables = dbdictHelper("joinfile.names", tableName);
        var len = funcs.lng(tables);
        var a;
        for (a = 0; a < len; a++) {
            var tmpReftable = getRefTable(field, tables[a]);
            if (tmpReftable !== null && tmpReftable !== "" && tmpReftable !== undefined) {
                return tmpReftable;
            }
        }
        return null;
    }

    return rc;
}

function getRefTableDisplayField(tableName) {
    // for display.field, a field name is really not needed, but anyway, you need put a field name for it
    // what the field name looks like is not important
    if (tableName === null || tableName === "") {
        return null;
    }

    var rc = policyread(tableName, '', 'display.field');
    //if rc is null, check if it is join table
    if (funcs._null(rc) || rc === null || rc === "" || rc === undefined) {
        var tables = dbdictHelper("joinfile.names", tableName);
        var len = funcs.lng(tables);
        var a;
        for (a = 0; a < len; a++) {
            var tmpField = getRefTableDisplayField(tables[a]);
            if (tmpField !== null && tmpField !== "" && tmpField !== undefined) {
                return tmpField;
            }
        }
        return null;
    }

    return rc;
}


/**
 * replace unique key field in query with display name field
 *
 * @param query {String}
 * @param uniqueField {String} 
 * @param displayField {String}
 * @returns {String} 
 */
function replaceQueryWithDisplayField(query, uniqueField, displayField) {
    // query is empty or true query
    if (query == null || query == true || query == "") {
        return query;
    }

    // unique field or display name field is empty
    if (uniqueField == null || uniqueField == "" || displayField == null || displayField == "") {
        return query;
    }

    // ignore same field
    if (uniqueField == displayField) {
        return query;
    }

    // replace '.' with '\.' in regexp
    var uniqueFieldReg = uniqueField.replace(/\./g, '\\.');

    // the unique key must at beginning, or not after a word character or '.', 
    // or in join SELECT e.g. ta01.logical.name
    var exStart = "(^|[^\\w.]|^ta\\d+\\.|[^\\w.]ta\\d+\\.)";

    // eg: logical.name#"AAA" or ta01.logical.name#"AAA" 
    var regex = new RegExp(exStart + uniqueFieldReg + "\\s*#", "g");
    query = query.replace(regex, function(match, p1) {
        return p1 + displayField + "#";
    });

    // eg: logical.name like "AAA" or ta01.logical.name like "AAA"
    regex = new RegExp(exStart + uniqueFieldReg + "\\s+like", "g");
    query = query.replace(regex, function(match, p1) {
        return p1 + displayField + " like";
    });

    return query;
}


function getFieldType(fileName, strFieldName) {
    //return lib.dbdictHelper.getFieldType(initDbdictFile(fileName), strFieldName);
    return dbdictHelper("field.type", fileName, strFieldName);
}

function getDisplayNameById(tableName, id) {
    var displayName = "";
    var displayField = getRefTableDisplayField(tableName);
    if (displayField === "" || displayField === null) {
        return id;
    }

    var fRecord = new SCFile(tableName, SCFILE_READONLY);
    fRecord.setFields([displayField]);
    var uniqueKeys = dbdictHelper("unique.key", tableName);
    var key = uniqueKeys[0];
    var sql = "" + key + '="' + escapeAllStr(id) + '"';

    if (fRecord.doSelect(sql) === RC_SUCCESS) {
        displayName = fRecord[displayField];
    }
    if (displayName === null || displayName === "") {
        displayName = fRecord[key];
    }

    return displayName;
}

function getDisplayNameInLink(link, sourceField, value) {
    var pos = -1;
    var sourceFields = link['source.fields'];
    var tarFields = link['target.files'];
    var refTable;

    var i;
    var length = sourceFields.length();
    for (i = 0; i < length; i++) {
        if (sourceFields[i] === sourceField) {
            pos = i;
            break;
        }
    }

    if (pos != -1) {
        refTable = tarFields[pos];
    }

    return (value && refTable) ? getDisplayNameById(refTable, value) : value;
}

function getDisplayNamesByIds(tableName, ids, keys, displays) {
    var qryIds = "{";
    var idsLen = funcs.lng(ids);
    var i;
    for (i = 0; i < idsLen; i++) {
        if ((i + 1) === idsLen) {
            qryIds += "\"" + ids[i] + "\"";
        } else {
            qryIds += "\"" + ids[i] + "\",";
        }
    }
    qryIds += "}";

    var displayField = getRefTableDisplayField(tableName);
    var fRecord = new SCFile(tableName, SCFILE_READONLY);
    var uniqueKeys = lib.dbdictHelper.getUniqueKey(tableName);
    var key = uniqueKeys[0];
    fRecord.setFields([key, displayField]);
    var sql = "" + key + " isin " + qryIds;
    if (fRecord.doSelect(sql) === RC_SUCCESS) {
        do {
            keys.push(fRecord[key]);
            displays.push(funcs._null(fRecord[displayField]) ? fRecord[key] : fRecord[displayField]);
        } while (fRecord.getNext() === RC_SUCCESS);
    }
}

function getFormInputs(name) {
    var inputs = [];
    var fd = new SCFile("format", SCFILE_READONLY);
    fd.setFields("field");
    var sql = "name=\"" + name + "\"";
    if (fd.doSelect(sql) === RC_SUCCESS) {
        var i;
        var length = fd.field.length();
        for (i = 0; i < length; i++) {
            if (fd.field[i].input !== null) {
                inputs.push(fd.field[i].input);
            }
        }
    }

    return inputs;
}

function isDuplicatedDisplayName(logicalName, ucmdbId, displayName, CIType) {
    var notFound = true;
    if (ucmdbId == null) {
        var tableName = "device";
        var device = $(tableName, SCFILE_READONLY);
        device.setFields("logical.name");
        var sql = 'logical.name~="' + escapeAllStr(logicalName) + '" and ' + getDisplayLable(tableName) + '="' + escapeAllStr(displayName) + '" and type="' + CIType + '"';
        notFound = device.count(sql) == 0;
    }

    return notFound;
}

function checkDuplicatedDisplayName(record) {
    return isDuplicatedDisplayName(record.logical_name, record.ucmdb_id, record.sm_device_display_name, record.type);
}

function getDisplayNameFieldAndAlias(tableName) {
    // handle the display name, hidden the original field and show alias field
    var rtn = null;
    if (hasDisplayName(tableName)) {
        var displayLabel = getDisplayLable(tableName);
        var smFile = initDbdictFile(tableName);
        var fieldName = _getFieldByAlias(smFile, displayLabel);
        rtn = [fieldName, displayLabel];
    }

    return rtn;
}

function convertNameToId(name, smrecord, field) {
    var rtn = null;
    if (name == null) {
        return rtn;
    }

    var refTableName = "";
    if ((funcs._null(smrecord) || smrecord === "") && (funcs._null(field) || field === "")) {
        refTableName = "device";
    } else {
        refTableName = getRefTable(field, smrecord);
    }
    var refFile = new SCFile(refTableName, SCFILE_READONLY);
    var fieldType = funcs.type(name);
    if (fieldType === $.Array) {
        rtn = [];
        var len = funcs.lng(name);
        var i;
        for (i = 0; i < len; i++) {
            rtn.push(_getID(refFile, name[i]));
        }
    } else if (fieldType === $.Character) {
        rtn = _getID(refFile, name);
    }

    return rtn;
}

function _getID(refFile, name) {
    var rtn = name;
    var uniqueKeys = dbdictHelper("unique.key", refFile);
    if (funcs._null(uniqueKeys)) {
        return rtn;
    }

    var keyFieldName = uniqueKeys[0];
    refFile.setFields([keyFieldName]);
    name = escapeAllStr(name);
    var sql = keyFieldName + '="' + name + '"';
    var rc = refFile.doSelect(sql);
    if (rc !== RC_SUCCESS) {
        var displayFieldName = getRefTableDisplayField(refFile);
        if (funcs._null(displayFieldName)) {
            return rtn;
        }
        sql = displayFieldName + '="' + name + '"';
        rc = refFile.doSelect(sql);
        if (rc === RC_SUCCESS) {
            rtn = refFile[keyFieldName];
        }
    }

    return rtn;
}

function getDisplayNameByLogicalName(logicalName) {
    var rtn = null;
    if (logicalName == null) {
        return rtn;
    }

    var device = $("device", SCFILE_READONLY);
    var fieldType = funcs.type(logicalName);
    if (fieldType === $.Array) {
        rtn = [];
        var len = funcs.lng(logicalName);
        var i;
        for (i = 0; i < len; i++) {
            rtn.push(_getSingleDisplayName(device, logicalName[i]));
        }
    } else if (fieldType === $.Character) {
        rtn = _getSingleDisplayName(device, logicalName);
    }

    return rtn;
}

function _getSingleDisplayName(device, logicalName) {
    var rtn = logicalName;
    if (rtn == null) {
        return rtn;
    }

    var sql = 'logical.name="' + escapeAllStr(logicalName) + '"';
    var fieldName = getDisplayLable('device');
    var record = device.setFields([fieldName]).select(sql).uniqueResult();
    if (record != null) {
        if (record[fieldName]) {
            rtn = record[fieldName];
        } else {
            rtn = logicalName;
        }
    }

    return rtn;
}

//Start: for non-pd refenece table fields validation called from formatctrl
function validateRefField(smrecord, field) {
    if (funcs._null(smrecord) || field === null || field === "") {
        vars['$reference.field.validation.msg'] = "Current record or fiel is null, please check your formatctrl configuration.";
        return false;
    }

    if (!funcs._null(smrecord[field])) {
        return true;
    } else {
        var notArrayFlag = true;
        if (funcs.type(smrecord[field]) == 8) {
            smrecord[field] = funcs.denull(smrecord[field]);
            if (smrecord[field].length() == 0) {
                notArrayFlag = false;
            }
        }

        var displayValue = funcs.get_display_value(smrecord, field.replace(/_/g, "."));
        var fieldCaption = getFieldCaption(funcs.filename(smrecord), field);
        if (funcs._null(smrecord[field]) &&
            ((notArrayFlag && displayValue !== null && displayValue !== "" && displayValue !== undefined) || (!notArrayFlag && funcs.lng(funcs.denull(displayValue)) > 0))) {
            vars['$reference.field.validation.msg'] = scmsg("logicalname.validation", "ruleset", [fieldCaption]);
            return false;
        } else {
            vars['$reference.field.validation.msg'] = scmsg(1, "ruleset", [fieldCaption]);
            return false;
        }
    }
}

//End: for non-pd refenece table fields validation called from formatctrl
function getActivityLogDisplayValue(logicalName) {
    if (logicalName != "NONE") {
        return getDisplayNameByLogicalName(logicalName) + '(' + logicalName + ')';
    }
    return logicalName;
}

//////////////////////////////////////////////////////////////
//this part is for export Excel/Text qbe list

function isNotEmptyString(str) {
    if (str && str != "null" && str != "NULL") {
        return true;
    } else {
        return false;
    }
}

function getCachedNameList(ids, filename) {
    var nohitList = [];
    var i;
    for (i = 0; i < ids.length; i++) {
        if (vars.$G_bg && ids[i]) {
            nohitList.push(ids[i]);
        } else {
            var dName = dsCache.get(ids[i]);
            if (dName && !vars.$G_bg) {
                ids[i] = dName;
            } else if (ids[i]) {
                nohitList.push(ids[i]);
            }
        }
    }

    if (nohitList.length > 0) {
        ids = selectDisplayName(nohitList, ids, filename);
    }

    return ids;
}

function selectDisplayName(nohitList, ids, filename) {

    var displayField = getTableDisplayField(filename);
    var fRecord = new SCFile(filename, SCFILE_READONLY);
    var uniqueKeys = lib.dbdictHelper.getUniqueKey(filename);
    var key = uniqueKeys[0];
    fRecord.setFields([key, displayField]);
    var rc = fRecord.doSelect(new QueryCond(key, ISIN, nohitList));
    while (rc == RC_SUCCESS) {
        var i;
        for (i = 0; i < ids.length; i++) {
            if (fRecord[key] && ids[i] && fRecord[key].toUpperCase() == ids[i].toUpperCase()) {
                if (!vars.$G_bg) {
                    dsCache.set(fRecord[key], fRecord[displayField]);
                }
                if (fRecord[displayField]) {
                    ids[i] = fRecord[displayField];
                }
            }
        }
        rc = fRecord.getNext();
    }

    return ids;
}

function getReferenceTable(filename) {
    var refTable = rtCache.get(filename);
    if (refTable) {
        return refTable;
    }

    refTable = [];
    var existingRT = [];
    var existingRF = [];
    var datadict = lib.dbdictHelper.initDatadictFile(filename);
    if (datadict && datadict['reference.table'] && !lib.ArrayUtil.isEmpty(datadict['reference.table'])) {

        var jsref = datadict['reference.table'].toArray();
        var jsfs = datadict['fields'].toArray();

        var i;
        for (i = 0; i < jsref.length; i++) {
            if (isNotEmptyString(jsref[i])) {
                var ix = lib.ArrayUtil.indexOf(existingRT, jsref[i]);
                if (ix == -1) {
                    existingRT.push(jsref[i]);
                    existingRF.push(jsfs[i]);
                } else {
                    existingRF[ix] = existingRF[ix].concat(";", jsfs[i]);
                }
            }
        }
    }
    rtCache.set(filename, [existingRT, existingRF]);
    return [existingRT, existingRF];
}

function replaceKeyByName(file) {
    var filename = funcs.filename(file);
    var refFieldTable = getReferenceTable(filename);

    var i;
    var j;
    for (i = 0; i < refFieldTable[0].length; i++) {
        var ids = [];
        var rfValue;

        var rFields = refFieldTable[1][i].split(";");
        for (j = 0; j < rFields.length; j++) {
            rfValue = file[rFields[j]];
            if (rfValue) {
                if (funcs.type(rfValue) == 8) {
                    ids = ids.concat(file[rFields[j]].toArray());
                } else {
                    ids.push(file[rFields[j]]);
                }
            }
        }

        if (ids.length == 0) {
            continue;
        }

        var namelist = getCachedNameList(ids, refFieldTable[0][i]);
        var k;
        for (k = 0; k < rFields.length; k++) {
            rfValue = file[rFields[k]];
            if (rfValue) {
                if (funcs.type(rfValue) == 8 && !lib.ArrayUtil.isEmptyString(rfValue)) {
                    file[rFields[k]] = lib.ArrayUtil.toSCDatum(namelist.splice(0, rfValue.length()));
                } else if (rfValue && funcs.type(rfValue) == 2) {
                    file[rFields[k]] = namelist.shift();
                }
            }
        }
    }

    return file;
}

//add for intool reporting
function getFieldReferenceTable(filename, fieldName) {
    if (!filename || !fieldName) {
        return null;
    }

    var refFieldTable = getReferenceTable(filename);
    var i;
    var j;
    for (i = 0; i < refFieldTable[0].length; i++) {
        var rFields = refFieldTable[1][i].split(";");
        for (j = 0; j < rFields.length; j++) {
            if (fieldName == rFields[j]) {
                return refFieldTable[0][i];
            }
        }
    }

    return null;
}

function getTableDisplayField(refTable) {
    var displayField = rtDFCache.get(refTable);
    if (displayField) {
        return displayField;
    }

    displayField = getRefTableDisplayField(refTable);
    rtDFCache.set(refTable, displayField);
    return displayField;
}

function getDuplicateDisplayName(displaynames, ids) {
    var dupArray = [];
    var i;
    var j;
    for (i = 0; displaynames != null && i < displaynames.length; i++) {
        var current = displaynames[i];
        var count = 0;
        var cur_id = null;
        for (j = 0; j < displaynames.length; j++) {
            if ((displaynames[j] == current && count == 0) || (displaynames[j] == current && cur_id != ids[j] && count > 0)) {
                count++;
                if (cur_id == null) {
                    cur_id = ids[i];
                }
            }
        }
        if (count > 1) {
            dupArray.push(current);
        }
    }

    return dupArray;
}

function getReferenceDisplayName(id, refTable) {

    if (!id || !refTable) {
        return null;
    }

    if (Array.isArray(id)) {
        var orgial = [];
        var k;
        for (k = 0; k < id.length; k++) {
            orgial.push(id[k]);
        }
        var disArray = getCachedNameList(id, refTable);
        var duplicateDis = getDuplicateDisplayName(disArray, orgial);
        if (duplicateDis != null && duplicateDis.length > 0) {
            //found duplicate name
            var i;
            var j;
            for (i = 0; i < duplicateDis.length; i++) {
                for (j = 0; j < disArray.length; j++) {
                    if (duplicateDis[i] == disArray[j]) {
                        //in-tool report client can't handle if displayName is same
                        if (duplicateDis[i] != orgial[j]) {
                            disArray[j] = duplicateDis[i] + " (" + orgial[j] + ")";
                        }
                    }
                }
            }
        }
        return disArray;
    } else {
        return getCachedNameList([id], refTable)[0];
    }
}

function sortReportDataByRefDisplayName(data, refTable, stackFieldRefTable) {
    if (!data || (!refTable && !stackFieldRefTable)) {
        return data;
    }

    return lib.Underscore._.sortBy(data, function(da) {
        if (refTable && !stackFieldRefTable) {
            return getReferenceDisplayName(da[0], refTable);
        } else if (!refTable && stackFieldRefTable) {
            return getReferenceDisplayName(da[1], stackFieldRefTable);
        } else {
            return [getReferenceDisplayName(da[0], refTable), getReferenceDisplayName(da[1], stackFieldRefTable)];
        }
    });
}
////////////////////////////////////////////////////////////

/**
 *  This function is to duplicate a file record with its CI field replaced with CI's display name.
 *
 *  @param {Record} record - the file record
 *  @return-Dupliated Record if the file record passed in has some reference fields, null if not.
 */
function getFileWithRefValue(record) {
    var filename = funcs.filename(record);
    var refInfo = getReferenceTable(filename);
    var refTables = refInfo[0];
    if (refTables.length > 0) {
        var recordWithRef = new SCFile(filename);
        funcs.fduplicate(recordWithRef, record);
        var i;
        var j;
        for (i = 0; i < refTables.length; ++i) {
            var refFields = refInfo[1][i].split(";");
            for (j = 0; j < refFields.length; ++j) {
                var display = funcs.get_display_value(record, refFields[j], -1, true);
                recordWithRef[refFields[j]] = display;
            }
        }
        return recordWithRef;
    }

    return null;
}

////////////////////////////////////////////////////////////
//Used for hot topic analytics
function getRefFullField(fieldName, tableName) {
    var refTable = getRefTable(fieldName, tableName);
    if (refTable == null) {
        return null;
    }

    var refDisplayField = getDisplayNameFieldAndAlias(refTable)[1];
    if (refDisplayField == null) {
        return null;
    }

    var refKeyField = funcs.str(lib.dbdictHelper.getUniqueKey(refTable)[0]);
    var refFullField = tableName + ";" + fieldName + ";" + refTable + ";" + refKeyField + ";" + refTable + ";" + refDisplayField;

    return refFullField;
}

function checkNotContainQuoteIdentifier(identifier) {
    if (identifier && identifier.indexOf("\"") >= 0) {
        return false;
    }
    return true;
}

/**********************/
function batchUpdateCIDisplayNameByLogicalName() {
    var deviceSqlTable = dbdictService.getPrimaryTable(initDbdictFile("device"))[1];

    var dbType = lib.dbdictHelper.getDbType();
    var adapter = lib.DataService.getAdaptor(dbType);

    print("Begin to update the display name.");
    var batchUpdateSql = "update " + deviceSqlTable + " set " + adapter.escapeField("DISPLAY_NAME") + "=" + adapter.escapeField("LOGICAL_NAME") + " where " + adapter.escapeField("DISPLAY_NAME") + " is NULL";
    $("#dataService").executeSQL(batchUpdateSql);
    print("Update the display name successfully.");
}

function cleanUpUCMDBIntegrationWebService() {
    var sql = "";
    var webs = new SCFile("extaccess");
    var serviceName = "ucmdbIntegration";
    var objName = ["ucmdbApplication", "ucmdbComputer", "ucmdbNetwork", "ucmdbPrinter"];
    var i;
    for (i = 0; i < objName.length; i++) {
        sql = "object.name=\"" + objName[i] + "\" and service.name=\"" + serviceName + "\"";
        if (webs.doSelect(sql) === RC_SUCCESS) {
            webs.doDelete();
        }
    }

    var ddm = new SCFile("ddmRule");
    var ddmIDs = ["ucmdbApplication", "ucmdbComputer", "ucmdbNetwork", "ucmdbPrinter"];
    var j;
    for (j = 0; j < ddmIDs.length; j++) {
        sql = "id=\"" + ddmIDs[j] + "\"";
        if (ddm.doSelect(sql) === RC_SUCCESS) {
            ddm.doDelete();
        }
    }
}
/**********************/


/**
 * Get the table fields those need to map to alias table
 *
 * @returns {Array}
 */
function getAliasTableMapFields() {
    var mapFields = [{
            "table": "cm3r",
            "fields": ["affected.services", "assets"]
        },
        {
            "table": "cm3t",
            "fields": ["asset"]
        },
        {
            "table": "probsummary",
            "fields": ["affected.services"]
        },
        {
            "table": "requestTask",
            "fields": ["CIListCMDB", "CIListContext"]
            //      },      
            //      {
            //          "table" : "rootcause",
            //          "fields": ["affected.ci"] 
        }
    ];

    return mapFields;
}

/**
 * Get field displayName from link
 */
function getDisplayNameByLink(tableName, value) {
    var displayValue = getDisplayNameById(tableName, value);
    return displayValue || value;
}