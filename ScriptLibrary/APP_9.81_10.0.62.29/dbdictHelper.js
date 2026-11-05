var $ = lib.c.$;
var MAX_SQL_ALIAS_LENGTH = 3;

function getCurrentIndex(fDbdict) {
    var iCount = 0;
    var iNextIndex = 0;

    while (fDbdict.field.length() > iCount) {
        if (fDbdict.field[iCount].level == 1 && fDbdict.field[iCount].index > iNextIndex) {
            iNextIndex = fDbdict.field[iCount].index;
        }
        iCount++;
    }

    return iNextIndex;
}

function getTablesFromDbdict(fDbdict) {
    var tables = new SCDatum();
    tables.setType(8);

    if (fDbdict.sql_tables.length() == 1) {
        return null;
    }

    var i;
    var iLoopTimes = fDbdict.sql_tables.length();
    for (i = 0; i < iLoopTimes; i++) {
        tables.push(fDbdict.sql_tables[i][1]);
    }

    return tables;
}

function getDBTypesFromDbdict(fDbdict) {
    var types = new SCDatum();
    types.setType(8);

    var i;
    var iLoopTimes = fDbdict.sql_tables.length();
    for (i = 0; i < iLoopTimes; i++) {
        types.push(fDbdict.sql_tables[i][0]);
    }

    return types;
}

function getDBTypeFromDbdict(fDbdict) {
    var i;
    var iLoopTimes = fDbdict.sql_tables.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (fDbdict.sql_tables[i][0] != null &&
            fDbdict.sql_tables[i][0] != "") {
            return fDbdict.sql_tables[i][0];
        }
    }

    return null;
}


function getTablesFromDBType(fDbdict, strDbType) {
    var tables = new SCDatum();
    var i;
    var iLoopTimes = fDbdict.sql_tables.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (fDbdict.sql_tables[i][1] != null && fDbdict.sql_tables[i][0] == strDbType) {
            tables.push(fDbdict.sql_tables[i][1]);
        }
    }

    return tables;
}

function getTableAlias(fDbdict, strTableName) {
    var i;
    var iLoopTimes = fDbdict.sql_tables.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (fDbdict.sql_tables[i][1] == strTableName) {
            return fDbdict.sql_tables[i][2];
        }
    }

    return null;
}

function checkSQLAliasLength(fDbdict) {
    var i;
    var iLoopTimes = fDbdict.sql_tables.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (fDbdict.sql_tables[i][2].length > MAX_SQL_ALIAS_LENGTH) {
            return false;
        }
    }

    return true;
}

function initDbdictFile(strFileName) {
    var fReturn = new SCFile("dbdict");
    if (fReturn.doSelect("name=\"" + strFileName + "\"") == RC_SUCCESS) {
        return fReturn;
    }

    return null;
}

function initDatadictFile(strFileName) {
    var fReturn = new SCFile("datadict");
    if (fReturn.doSelect("name=\"" + strFileName + "\"") == RC_SUCCESS) {
        return fReturn;
    }

    return null;
}

function checkForNulltableRows(fDbdict) {
    var i;
    var iLoopTimes = fDbdict.field.length();
    for (i = 1; i < iLoopTimes; i++) {
        if (fDbdict.field[i].sql_field_options[0] != null &&
            fDbdict.field[i].sql_field_options[0].indexOf("N-") == 0) {
            return true;
        }
    }

    return false;
}

function mergeSQLTables(fOldSQLTables, fNewSQLTables) {
    if (fOldSQLTables.length() == fNewSQLTables.length() ||
        fOldSQLTables.length() > fNewSQLTables.length()) {
        return null;
    }

    var oldCount = fOldSQLTables.length();
    var i;
    var iLoopTimes = fNewSQLTables.length();
    for (i = oldCount; i < iLoopTimes; i++) {
        //You have to do it this way to get the whole array value added correctly
        //push() won't do it.
        fOldSQLTables = funcs.insert(fOldSQLTables, 0, 1, fNewSQLTables[i]);
    }

    return fOldSQLTables;
}

function mergeKeys(fOldKeys, fNewKeys) {
    if (fOldKeys.length() == fNewKeys.length() ||
        fOldKeys.length() > fNewKeys.length()) {
        return null;
    }

    var oldCount = fOldKeys.length();
    var newKeys = new SCDatum();
    newKeys.setType(8);

    var i;
    var iLoopTimes = fNewKeys.length();
    for (i = oldCount; i < iLoopTimes; i++) {
        //You have to do it this way to get the whole array value added correctly
        //push() won't do it.
        fOldKeys = funcs.insert(fOldKeys, 0, 1, fNewKeys[i]);
    }

    return fOldKeys;
}

function mergeDbdictSQLMapping(fOldDbdict, fNewDbdict) {
    var oldXML = fOldDbdict.getXML();
    var newXML = fNewDbdict.getXML();

    var rebuiltFields = new XML("field");
    rebuiltFields.addAttribute("sctype", "array");

    var oldInstance = lib.xmlHelpers.getElement(oldXML, "instance", null);
    var oldFields = lib.xmlHelpers.getElement(oldInstance, "field", null);
    var oldField = oldFields.getFirstChildElement();
    //put the descriptor field in the rebuilt fields.
    rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
    oldField = oldField.getNextSiblingElement(); //skip the descriptor field

    var newInstance = lib.xmlHelpers.getElement(newXML, "instance", null);
    var newFields = lib.xmlHelpers.getElement(newInstance, "field", null);
    var newField = newFields.getFirstChildElement();
    newField = newField.getNextSiblingElement(); //skip the descriptor field

    var bDidMerge = false;

    while (newField != null && oldField != null) {
        var newName = (lib.xmlHelpers.getElement(newField, "name", null)).getText();
        var newLevel = (lib.xmlHelpers.getElement(newField, "level", null)).getValue();
        var newIndex = (lib.xmlHelpers.getElement(newField, "index", null)).getValue();
        var newType = (lib.xmlHelpers.getElement(newField, "type", null)).getValue();
        var newSQLFields = lib.xmlHelpers.getElement(newField, "sql.field.options", null);
        var newSQLTableAlias;
        var newSQLColumnName;
        var newSQLDataType;
        var newSQLRCFormat;

        var element = lib.xmlHelpers.getElement(newSQLFields, "sql.table.alias", null);
        if (element == null) {
            newSQLTableAlias = null;
        } else {
            newSQLTableAlias = element.getText();
        }

        element = lib.xmlHelpers.getElement(newSQLFields, "sql.column.name", null);
        if (element == null) {
            newSQLColumnName = null;
        } else {
            newSQLColumnName = element.getText();
        }

        element = lib.xmlHelpers.getElement(newSQLFields, "sql.data.type", null);
        if (element == null) {
            newSQLDataType = null;
        } else {
            newSQLDataType = element.getText();
        }

        element = lib.xmlHelpers.getElement(newSQLFields, "sql.rcformat", null);

        if (element == null) {
            newSQLRCFormat = null;
        } else {
            newSQLRCFormat = element.getValue();
        }

        var oldIndex = (lib.xmlHelpers.getElement(oldField, "index", null)).getValue();
        var oldName = (lib.xmlHelpers.getElement(oldField, "name", null)).getText();
        var oldLevel = (lib.xmlHelpers.getElement(oldField, "level", null)).getValue();
        var oldType = (lib.xmlHelpers.getElement(oldField, "type", null)).getValue();
        var oldSQLFields = lib.xmlHelpers.getElement(oldField, "sql.field.options", null);
        var oldSQLTableAlias;
        var oldSQLColumnName;
        var oldSQLDataType;
        var oldSQLRCFormat;

        element = lib.xmlHelpers.getElement(oldSQLFields, "sql.table.alias", null);
        if (element == null) {
            oldSQLTableAlias = null;
        } else {
            oldSQLTableAlias = element.getText();
        }

        element = lib.xmlHelpers.getElement(oldSQLFields, "sql.column.name", null);
        if (element == null) {
            oldSQLColumnName = null;
        } else {
            oldSQLColumnName = element.getText();
        }

        element = lib.xmlHelpers.getElement(oldSQLFields, "sql.data.type", null);
        if (element == null) {
            oldSQLDataType = null;
        } else {
            oldSQLDataType = element.getText();
        }

        element = lib.xmlHelpers.getElement(oldSQLFields, "sql.rcformat", null);

        if (element == null) {
            oldSQLRCFormat = null;
        } else {
            oldSQLRCFormat = element.getValue();
        }

        if (newName == oldName &&
            newLevel == oldLevel &&
            newIndex == oldIndex &&
            newType == oldType &&
            newSQLTableAlias == oldSQLTableAlias &&
            newSQLColumnName == oldSQLColumnName &&
            newSQLDataType == oldSQLDataType &&
            newSQLRCFormat == oldSQLRCFormat) {
            //fields didn't change. Move along.
            rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
        } else if (newName == oldName &&
            newLevel == oldLevel &&
            newIndex == oldIndex &&
            newType == oldType &&
            (newSQLTableAlias != oldSQLTableAlias ||
                newSQLColumnName != oldSQLColumnName ||
                newSQLDataType != oldSQLDataType ||
                newSQLRCFormat != oldSQLRCFormat)) {
            //if the field names are the same but the SQL mapping changed then take the new sql mapping.			
            bDidMerge = true;
            lib.upgradeDbdictMerge.replaceSQLFields(oldField, newSQLFields);
            rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
        } else if (newName != oldName &&
            newName.toUpperCase() == oldName.toUpperCase() &&
            newLevel == oldLevel &&
            newIndex == oldIndex &&
            newType == oldType) {
            // special scenario, only field upper/lower case changed
            bDidMerge = true;
            rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, newField);
        }

        newField = newField.getNextSiblingElement();
        oldField = oldField.getNextSiblingElement();
    }

    if (bDidMerge) {
        //Since we don't have the best DOM support right now we'll just rebuild the whole document	
        var strOldXML = oldXML.toXMLString();
        var strStart = strOldXML.slice(0, strOldXML.indexOf("<field"));
        var strEnd = strOldXML.slice(strOldXML.indexOf("<key sctype=\"array\">"));
        var strRebuiltXML = strStart + rebuiltFields.toXMLString() + strEnd;

        oldXML = oldXML.setContent(strRebuiltXML);
        fOldDbdict.setRecord(oldXML.toXMLString());
    }
}

function getFieldType(fDbdict, strFieldName) {
    var iCount = 0;
    while (fDbdict.field.length() > iCount) {
        if (fDbdict.field[iCount].name == strFieldName) {
            return fDbdict.field[iCount].type;
        }
        iCount++;
    }

    return -1;
}

/**
 * Return length of a character field
 *
 * @param fDbdict		{SCFile}
 * @param strFieldName	{String}
 * @returns {Number}
 */
function getCharacterFieldLength(fDbdict, strFieldName) {

    var fields = fDbdict.field;
    var i;
    var length = fields.length();

    for (i = 0; i < length; i++) {
        var field = fields[i];
        if (field.name == strFieldName) {
            var options = field.sql_field_options;
            var type = options.sql_data_type;

            // e.g. VARCHAR(60) => 60
            var regexp = new RegExp("^\\w+\\((\\d+)\\)$");
            var result = type.match(regexp);

            if (result != null && result.length > 1) {
                return parseInt(result[1], 0);
            }

            return 0;
        }
    }

    return 0;
}

function getDbType() {
    var dbdict = new SCFile("dbdict");
    if (dbdict.doSelect("name=\"dbdict\"") == RC_SUCCESS) {
        return dbdict.sql_tables[0][0];
    }
}

function hasDbView(tableName) {
    var hasView = false;
    var dbdict = new SCFile("dbdict");
    var query = "name=\"view" + tableName + "\"";
    if (dbdict.doSelect(query) == RC_SUCCESS) {
        hasView = true;
    }

    return hasView;
}

function isDbView(dbParam) {
    var isView = false;

    if (funcs.type(dbParam) == 6) {
        if (funcs.descriptor(dbParam)[16] == true) {
            isView = true;
        }
    } else {
        var dbdict = new SCFile("dbdict");
        var query = "name=\"" + dbParam + "\"";
        if (dbdict.doSelect(query) == RC_SUCCESS) {
            isView = true;
        }
    }

    return isView;
}

//This function returns the Search View name mentioned in the object for the parameter passed as string or record.
// Example 1: getSearchTablename("pmProblem") returns "viewpmProblem"
// Example 1: getSearchTablename("viewpmProblem") returns "viewpmProblem"
// Example 1: getSearchTablename("view1pmProblem") returns "viewpmProblem"
// Example 1: getSearchTablename("operator") returns "operator"
// Example 1: If $L.file is a record of pmProblem, getSearchTablename($L.file) returns "viewpmProblem"
// Example 1: If $L.file is a record of viewpmProblem, getSearchTablename($L.file) returns "viewpmProblem"
// Example 1: If $L.file is a record of view1pmProblem, getSearchTablename($L.file) returns "viewpmProblem"
// Example 1: If $L.file is a record of operator, getSearchTablename($L.file) returns "operator"
function getSearchTablename(svParam) {
    var tableName;

    //Checking if the parameter passed is a record. If it is, initializing tableName variable to file name of the record.
    //Otherwise, setting it to the value that has been passed.
    if (funcs.type(svParam) == 6) {
        tableName = funcs.filename(svParam);
    } else {
        tableName = svParam;
    }

    //Searching the object record and returning the viewName which is SearchView name value. 
    var object = new SCFile("Object", SCFILE_READONLY);

    if (object.doSelect("file.name=\"" + tableName + "\" or viewName=\"" + tableName + "\" or displayViewName=\"" + tableName + "\"") == RC_SUCCESS) {
        if (object.viewName != null && object.viewName != "") {
            return object.viewName;
        } else {
            return tableName;
        }
    } else {
        return "Object Not Found";
    }

}

//This function returns the Display View name mentioned in the object for a particular table passed as string or record.
// Example 1: getDisplayTablename("pmProblem") returns "view1pmProblem"
// Example 1: getDisplayTablename("viewpmProblem") returns "view1pmProblem"
// Example 1: getDisplayTablename("view1pmProblem") returns "view1pmProblem"
// Example 1: getDisplayTablename("operator") returns "operator"
// Example 1: If $L.file is a record of pmProblem, getDisplayTablename($L.file) returns "view1pmProblem"
// Example 1: If $L.file is a record of viewpmProblem, getDisplayTablename($L.file) returns "view1pmProblem"
// Example 1: If $L.file is a record of view1pmProblem, getDisplayTablename($L.file) returns "view1pmProblem"
// Example 1: If $L.file is a record of operator, getDisplayTablename($L.file) returns "operator"
function getDisplayTablename(dvParam) {
    var tableName;

    if (funcs.type(dvParam) == 6) {
        tableName = funcs.filename(dvParam);
    } else {
        tableName = dvParam;
    }

    var object = new SCFile("Object", SCFILE_READONLY);

    if (object.doSelect("file.name=\"" + tableName + "\" or viewName=\"" + tableName + "\" or displayViewName=\"" + tableName + "\"") == RC_SUCCESS) {
        if (object.displayViewName != null && object.displayViewName != "") {
            return object.displayViewName;
        } else {
            return tableName;
        }
    } else {
        return "Object Not Found";
    }
}


//This function returns the primary table or a particular table passed as string or record.
// Example 1: getPrimaryTablename("pmProblem") returns "pmProblem"
// Example 1: getPrimaryTablename("viewpmProblem") returns "pmProblem"
// Example 1: getPrimaryTablename("view1pmProblem") returns "pmProblem"
// Example 1: getPrimaryTablename("operator") returns "operator"
// Example 1: If $L.file is a record of pmProblem, getPrimaryTablename($L.file) returns "pmProblem"
// Example 1: If $L.file is a record of viewpmProblem, getPrimaryTablename($L.file) returns "pmProblem"
// Example 1: If $L.file is a record of view1pmProblem, getPrimaryTablename($L.file) returns "pmProblem"
// Example 1: If $L.file is a record of operator, getPrimaryTablename($L.file) returns "operator"
function getPrimaryTablename(pvParam) {
    if (funcs.type(pvParam) == 6) {
        if (funcs.descriptor(pvParam)[16] == true) {
            return funcs.descriptor(pvParam)[17];
        } else {
            return funcs.descriptor(pvParam)[2];
        }
    } else {
        var dbdict = new SCFile("dbdict");
        if (dbdict.doSelect("name=\"" + pvParam + "\"") == RC_SUCCESS) {
            return pvParam;
        }
    }

}

function printMe(fData) {
    print(fData);
}


/**
 * Get dbdict IR key
 *
 * @param	 {String}	filename
 * @returns {Array}  	IR key array
 */
function getIRKey(filename) {

    var dbdict = $("dbdict", SCFILE_READONLY).select('name="' + filename + '"').uniqueResult();
    if (dbdict != null) {
        return getIRKeyFromDbdict(dbdict);
    }

    return null;
}


/**
 * Get dbdict IR key
 *
 * @param	 {SCFile}	fDbdict
 * @returns {Array}  	IR key array
 */
function getIRKeyFromDbdict(fDbdict) {
    var keys = fDbdict.key;
    var i;
    var length = keys.length();
    for (i = 0; i < length; i++) {
        var key = keys[i];

        // IR key
        if (key[0] == 64) {
            return lib.ArrayUtil.toJsArray(key[1]);
        }
    }

    return null;
}


/**
 * Scan unsupported IR keys
 *
 * @returns  {Array}  each element is array constains tablename, fieldname and datatype
 */
function scanUnsupportedIRKeys() {

    // only Oracle has limitation
    var dbtype = lib.dbdictHelper.getDbType();
    if ("oracle" != dbtype) {
        return [];
    }

    var fieldList = [];

    var unsupportedTypes = [
        "NCHAR", "NVARCHAR2", "NCLOB"
    ];

    $("dbdict", SCFILE_READONLY).selectAll().iterate(function(dbdict) {
        var keys = getIRKeyFromDbdict(dbdict);
        if (keys == null || keys.length == 0) {
            return false;
        }

        var fields = dbdict.field;
        var i;
        var j;
        var length = fields.length();
        for (i = 0; i < length; i++) {
            var field = fields[i];
            if (lib.ArrayUtil.contains(keys, field.name)) {
                var type = field.sql_field_options.sql_data_type;
                if (type == null) {
                    continue;
                }

                for (j = 0; j < unsupportedTypes.length; j++) {
                    if (type.toUpperCase().indexOf(unsupportedTypes[j]) >= 0) {
                        fieldList.push([dbdict.name, field.name, type]);
                    }
                }
            }
        }

    });

    return fieldList;
}


/**
 * Get unique key according to the file name
 *
 * @filename:	File name
 * @returns {Array}
 */
function getUniqueKey(filename) {
    var dbdict = new SCFile("dbdict", SCFILE_READONLY);
    dbdict.setFields(["name", "key"]);

    var rc = dbdict.doSelect("name=\"" + filename + "\"");
    if (rc != RC_SUCCESS) {
        return null;
    }

    var keys = dbdict.key;
    var ukey = null;

    var i;
    var iLoopTimes = keys.length();
    for (i = 0; i < iLoopTimes; i++) {
        var key = keys[i];

        // primary key
        if (key[0] == 28) {
            ukey = key[1];
            break;
        }

        // first unique key
        if (key[0] == 12 && ukey == null) {
            ukey = key[1];
        }
    }

    if (ukey) {
        return ukey.toArray();
    }

    return null;
}

var DB_TYPE_CODE = {
    "SQLSERVER": 0,
    "ORACLE": 1,
    "POSTGRESQL": 3
};

function DBTYPECODE(dbname) {
    if (dbname == null) {
        return -1;
    }
    var type = DB_TYPE_CODE[dbname];
    return type == null ? -1 : type;
}

/**
 *  query dbdict table sql db type as SM db type
 *	
 *	Assumption: 1. the SM instance has only one database type (SM allow connect to different database type)
 *               2. dbdict record exists in dbdict table
 *   
 *	@return current database type  0 --> sqlserver / 1 --> oracle / 3 --> postgresql
 **/
function getDbTypeCode() {
    var code = -1;
    var type = getDbType();
    switch (type.charAt(0)) {
        case "s":
            code = DB_TYPE_CODE["SQLSERVER"];
            break;
        case "o":
            code = DB_TYPE_CODE["ORACLE"];
            break;
        case "p":
            code = DB_TYPE_CODE["POSTGRESQL"];
            break;
    }

    return code;
}

// reserved words for field name
const reservedFields = [
    "class",
    "length",
    "eval",
    "count",
    "shift",
    "new",
    "public",
    "default"
];

/**
 * check whether the field name is a reserved word
 *
 * @param {String} strFieldName
 * @returns {Boolean}
 */
function isReservedField(strFieldName) {
    if (!strFieldName) {
        return false;
    }

    return reservedFields.indexOf(strFieldName) >= 0;
}