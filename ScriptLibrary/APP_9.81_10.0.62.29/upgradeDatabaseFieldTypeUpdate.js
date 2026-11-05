/**
 *    							SM Upgrade
 *    Scanning field type change, compare dbdict with upgradedbdict,update field type if necessary, 
 *
 *    Tod
 *    2011-02-25
 **/

var DB2_SHORT_BLOB_REGEX = /VARCHAR\(\d+\)\sFOR\sBIT\sDATA/;
var FIELD_LENGTH_REGEX = /\((\d+|MAX)\)/i;
var FIELD_LENGTH_REGEX_PGCI = /_(\d+)/i;


/**
 *   sql type data from "sqldbinfo" table:
 *
 *   SM			Oracle		Sqlserver		DB2								PostgreSQL		PostgreSQL CI
 *	number		number		float			double							float/int
 *	character	varchar2	varchar			varchar							varchar			civarchar
 *	date/time	date		datetime		timestamp						timestamp
 *	logical		char(1)		char(1)			char(1)							char(1)	
 *	label		varchar2	varchar			varchar							varchar
 *	expression	blob		image			BLOB(1M) NOT LOGGED COMPACT		bytea
 *	record					image	
 *	Long Text 	clob		text			CLOB(1M) NOT LOGGED COMPACT		text			citext
 *	Long Blob 	blob		image			BLOB(1M) NOT LOGGED COMPACT		bytea
 *	Short Blob	raw(255)	varbinary(255)	varchar(255) FOR BIT DATA		bytea
 **/
var SQL_TYPE_INDEX =  [
					{ type : "NUMB", index : 0, ntype : false },
				    { type : "FLOA", index : 0, ntype : false },
					{ type : "DOUB", index : 0, ntype : false },
					{ type : "INT",  index : 0.5, ntype : false },
					{ type : "INTE", index : 0.5, ntype : false },
					{ type : "VARC", index : 1, ntype : false },
					{ type : "NVAR", index : 1, ntype : true }, // NVARCHAR
					{ type : "VARG", index : 1, ntype : true }, // vargraphic  NVARCHAR in db2
					{ type : "CIVA", index : 1, ntype : false }, // CIVARCHAR in PostgreSQL CI
					{ type : "DATE", index : 2, ntype : false },
					{ type : "TIME", index : 2, ntype : false },
					{ type : "CHAR", index : 3, ntype : false },
					{ type : "NCHA", index : 3, ntype : true }, // NCHAR
					{ type : "GRAP", index : 3, ntype : true }, // graphic  NCHAR in db2
					{ type : "CICH", index : 3, ntype : false }, // CICHAR in PostgreSQL CI
					{ type : "CLOB", index : 4, ntype : false },
					{ type : "TEXT", index : 4, ntype : false },
					{ type : "NCLO", index : 4, ntype : true }, // NCLOB
					{ type : "NTEX", index : 4, ntype : true }, // NTEXT
				    { type : "DBCL", index : 4, ntype : true }, // dbclob   NCLOB in db2
				    { type : "CITE", index : 4, ntype : false }, // CITEXT in PostgreSQL CI
					{ type : "RAW(", index : 5, ntype : false },
					{ type : "VARB", index : 5, ntype : false },
					{ type : "BLOB", index : 6, ntype : false },
					{ type : "IMAG", index : 6, ntype : false },
					{ type : "BYTE", index : 6, ntype : false }
];
// SQL Field that can't be find in SQL_TYPE_INDEX
var UNDEFINED_INDEX = 20;

var SQL_TYPE_FULLNAME = {
    "0": [],
    "0.5": ["INT", "INTEGER", "INT", "INT", "INT"],
    "1": ["VARCHAR", "VARCHAR2", "VARCHAR", "VARCHAR", "CIVARCHAR"],
    "10": ["NVARCHAR", "NVARCHAR", "VARGRAPHIC", "VARCHAR", "CIVARCHAR"],
    "2": [],
    "3": ["CHAR", "CHAR", "CHAR", "CHAR", "CHAR"],
    "30": ["NCHAR", "NCHAR", "GRAPHIC", "CHAR", "CHAR"],
    "4": ["TEXT", "CLOB", "CLOB(1M) NOT LOGGED COMPACT", "TEXT", "CITEXT"],
    "5": ["VARBINARY", "RAW", "VARCHAR(255) FOR BIT DATA", "BYTEA", "BYTEA"],
    "6": ["IMAGE", "BLOB", "BLOB(1M) NOT LOGGED COMPACT", "BYTEA", "BYTEA"]
};

// SQL type index is from SQL_TYPE_INDEX					
var CONVERT_MATRIX = {
    "0": [],
    "0.5": [],
    "1": [1, 3, 6],
    "2": [],
    "3": [1, 3, 5, 6],
    "4": [],
    "5": [],
    "6": []
};

// refer to "DataTypeConst" in ScriptLibrary
var SM_TYPE = {
    "1": "number",
    "2": "character",
    "3": "date/time",
    "4": "logical",
    "5": "label",
    "8": "array",
    "9": "structure",
    "11": "expression"
};

var DB_TYPE = {
    "SQLSERVER": 0,
    "ORACLE": 1,
    "DB2": 2,
    "POSTGRESQL": 3
};

var PGCI = 0;

function DBTYPE(dbname) {
    if (dbname == null) {
        return -1;
    }
    var type = DB_TYPE[dbname];
    return type == null ? -1 : type;
}

function getPGCI() {
    if (PGCI == 0) {
        var value = getRTEParm("sqlcitext");
        lib.upgradeLog.detail("RTE sqlcitext parameter value: " + value);
        
        if (value.indexOf("ERROR") < 0) {
            value = Number(value);
            if (Number.isInteger(value)) {
                PGCI = value;
            }
        }
    }

    return PGCI;
}

/**
 *  apply database field type change 
 *  called in RAD: apm.upgrade.dbdict  merge.field panel
 *  @param  oldfile  old SM dbdict scfile
 *  @param  newfile  new SM dbdict scfile
 *  @return  change status   true/false
 **/
function applyFieldTypeChange(oldfile, newfile) {
    if (oldfile != null && newfile != null) {
        var dbdictObjArray = createDbdictObjectArray(oldfile);
        var upgradedbdictObjArray = createDbdictObjectArray(newfile);
        return compareDbdictObjArray(dbdictObjArray, upgradedbdictObjArray, oldfile, newfile);
    }

    return false;
}

/**
 *  create array of dbdict field object 
 *
 *  @param  dbdict     SM dbdict
 *  @return  dbdict object array
 **/
function createDbdictObjectArray(dbdict) {
    var dbdictFieldArray = [];
    var fieldPositionArray = generateDbdictFieldPositionArray(dbdict.field);
    var i;
    var length= dbdict.field.length();
    for (i = 0; i < length; i++) {
        dbdictFieldArray[i] = createDbdictObject(dbdict.field[i].name, dbdict.field[i].type,
            dbdict.field[i].level, null,
            dbdict.field[i].sql_field_options ? dbdict.field[i].sql_field_options.sql_table_alias : null,
            dbdict.field[i].sql_field_options ? dbdict.field[i].sql_field_options.sql_column_name : null,
            dbdict.field[i].sql_field_options ? dbdict.field[i].sql_field_options.sql_data_type : null,
            dbdict.field[i].sql_field_options ? dbdict.field[i].sql_field_options.sql_rcformat : null,
            fieldPositionArray[i]);
    }
    
    return dbdictFieldArray;
}

/**
 *  create dbdict field object 
 *
 *  @param  name     field name 
 *  @param  smType   type in SM
 *  @param  level    SM field level
 *  @param  index    sql data type index defined in array "SQL_TYPE_INDEX"
 *  @param  sqlTableAlias	field table alias in database
 *  @param  sqlColumnName   	field name in database
 *  @param  sqlDataType   	field type in database
 *  @param  sqlRC   			field rc format in database
 **/
function createDbdictObject(name, smType, level, index, sqlTableAlias, sqlColumnName, sqlDataType, sqlRC, fieldPosition) {
    var obj = {};
    obj.name = name;
    obj.smType = smType;
    obj.level = level;
    obj.index = index;
    obj.sqlTableAlias = sqlTableAlias;
    obj.sqlColumnName = sqlColumnName;
    obj.sqlDataType = sqlDataType;
    obj.sqlRC = sqlRC;
    obj.fieldPosition = fieldPosition;
    
    return obj;
}

/**
 *  compare dbdict with upgradedbdict
 *
 *  @param  array1   old dbdict fields array
 *  @param  array2   new dbdict fields array
 *  @param  oldfile  old dbdict file
 *  @param  newfile  new dbdict file
 **/
function compareDbdictObjArray(array1, array2, oldfile, newfile) {
    var changed = false;
    if (array1 != null && array2 != null) {
        var i;
        var j;
        for (i = 0; i < array1.length; i++) {
            if (array1[i].level == 0 && array1[i].name == "descriptor" && array1[i].sqlDataType != null) {
                continue;
            }
            for (j = 0; j < array2.length; j++) {
                if (array1[i].name == array2[j].name &&
                    array1[i].level == array2[j].level &&
                    array1[i].fieldPosition == array2[j].fieldPosition) {
                    if (array1[i].smType == lib.DataTypeConst.typeArray()) {
                        if (array2[j].smType == lib.DataTypeConst.typeArray()) {
                            var range1 = getArrayFieldsRange(array1, i);
                            var range2 = getArrayFieldsRange(array2, j);
                            if (compareArrayFields(array1, range1, array2, range2, oldfile)) {
                                changed = true;
                            }
                            if (i < range1.endIndex) {
                                i = range1.endIndex;
                            }
                        } else {
                            lib.upgradeLog.scError(1155, [oldfile.name, array1[i].name, SM_TYPE[array1[i].smType], SM_TYPE[array2[j].smType]]);
                        }
                    } else {
                        if (compareFields(array1[i], array2[j], oldfile.field[i], oldfile.name)) {
                            changed = true;
                        }
                    }
                    break;
                }
            }
        }
    }
    
    return changed;
}

function compareArrayFields(fieldArray1, range1, fieldArray2, range2, oldfile) {
    var changed = false;

    if (range1.endIndex < 0 || range2.endIndex < 0) {
        return false;
    }

    if ((isSimpleArrayFields(fieldArray1, range1) && isSimpleArrayFields(fieldArray2, range2)) ||
        (isArrayStructureFields(fieldArray1, range1) && isArrayStructureFields(fieldArray2, range2))) {
        if (compareTypicalArrayFields(fieldArray1, range1, fieldArray2, range2, oldfile)) {
            changed = true;
        }
    } else {
        var i;
        var j;
        for (i = range1.startIndex + 1; i <= range1.endIndex; i++) {
            for (j = range2.startIndex + 1; j <= fieldArray2.endIndex; j++) {
                if (fieldArray1[i].name == fieldArray2[j].name &&
                    fieldArray1[i].level == fieldArray2[j].level &&
                    fieldArray1[i].fieldPosition == fieldArray2[j].fieldPosition &&
                    fieldArray1[i].smType == fieldArray2[j].smType) {
                    if (compareFields(fieldArray1[i], fieldArray2[j], oldfile.field[i], oldfile.name)) {
                        changed = true;
                    }
                    break;
                }
            }
        }
    }

    return changed;
}

// Input the array including all fields created from dbdict and the index of array field
// return the index range of all fields in the array.
function getArrayFieldsRange(fieldArray, index) {
    var range = {
        "startIndex": index,
        "endIndex": -1
    };
    
    if (fieldArray != null && index >= 0 && fieldArray[index].smType == lib.DataTypeConst.typeArray()) {
        var i;
        for (i = index + 1; i < fieldArray.length; i++) {
            if (fieldArray[i].level <= fieldArray[index].level) {
                break;
            }
        }
        range.endIndex = (i >= fieldArray.length) ? fieldArray.length - 1 : i - 1;

    }

    return range;
}

// Return if the array is aliased
function isArrayFieldsAliased(fieldArray, range) {
    if (range.endInex < 0) {
        return false;
    }

    var i;
    for (i = range.startIndex; i <= range.endIndex; i++) {
        if (fieldArray[i].sqlTableAlias != null && fieldArray[i].sqlTableAlias.toLowerCase().indexOf("a") == 0) {
            return true;
        }
    }

    return false;
}

// Simple array is array-element fields, for example, array-character
function isSimpleArrayFields(fieldArray, range) {
    if (range.endInex < 0) {
        return false;
    }

    if (range.endIndex - range.startIndex == 1 &&
        fieldArray[range.startIndex].smType == lib.DataTypeConst.typeArray() //array
        &&
        fieldArray[range.startIndex].name == fieldArray[range.endIndex].name &&
        fieldArray[range.endIndex].smType != lib.DataTypeConst.typeArray() //not array
        &&
        fieldArray[range.endIndex].smType != lib.DataTypeConst.typeStructure()) { //not structure
        return true;
    }

    return false;
}

// array-structure fields, elements do not include array and structure
function isArrayStructureFields(fieldArray, range) {
    if (range.endInex < 0) {
        return false;
    }

    if (range.endIndex - range.startIndex > 1 &&
        fieldArray[range.startIndex].smType == lib.DataTypeConst.typeArray() //array
        &&
        fieldArray[range.startIndex + 1].smType == lib.DataTypeConst.typeStructure() //structure
        &&
        fieldArray[range.startIndex].name == fieldArray[range.startIndex + 1].name) {
        var i;
        for (i = range.startIndex + 2; i <= range.endIndex; i++) {
            if (fieldArray[i].smType == lib.DataTypeConst.typeArray() || fieldArray[i].smType == lib.DataTypeConst.typeStructure()) {
                return false;
            }
        }

        return true;
    }

    return false;
}

// Return the maximum index value of sql type in the array
// The index is defined in SQL_TYPE_INDEX
function getArrayFieldsMaxSqlTypeIndex(fieldArray, range) {
    var max_type_index = -1;
    var i;
    for (i = range.startIndex; i <= range.endIndex; i++) {
        var sqlDataType = fieldArray[range.startIndex].sqlDataType;
        if (sqlDataType != null) {
            var type_index = getSqlTypeIndex(sqlDataType).index;
            if (type_index > max_type_index) {
                max_type_index = type_index;
            }
        }
    }

    return max_type_index;
}


// old array  |  new array |  action
//     a      |     m      |   skip
//     a      |     a      |   compareFields
//     m      |     a      |   except
//     m      |     m      |   compareFields if old type less than new
function compareTypicalArrayFields(fieldArray1, range1, fieldArray2, range2, file) {
    var changed = false;
    var isAliased1 = isArrayFieldsAliased(fieldArray1, range1);
    var isAliased2 = isArrayFieldsAliased(fieldArray2, range2);

    var i;
    var j;

    if (isAliased1 && isAliased2) {
        for (i = range1.startIndex; i <= range1.endIndex; i++) {
            for (j = range2.startIndex; j <= range2.endIndex; j++) {
                if (fieldArray1[i].name == fieldArray2[j].name &&
                    fieldArray1[i].level == fieldArray2[j].level &&
                    fieldArray1[i].fieldPosition == fieldArray2[j].fieldPosition) {
                    if (compareFields(fieldArray1[i], fieldArray2[j], file.field[i], file.name)) {
                        changed = true;
                    }
                    break;
                }
            }
        }
    } else if (!isAliased1 && isAliased2) {
        for (i = range1.startIndex; i <= range1.endIndex; i++) {
            for (j = range2.startIndex; j <= range2.endIndex; j++) {
                if (fieldArray1[i].name == fieldArray2[j].name &&
                    fieldArray1[i].level == fieldArray2[j].level &&
                    fieldArray1[i].fieldPosition == fieldArray2[j].fieldPosition) {
                    if (compareFieldInAliasArray(fieldArray1[i], fieldArray2[j], file.field[i], file.name)) {
                        changed = true;
                    }
                    break;
                }
            }
        }
    } else if (!isAliased1 && !isAliased2) {
        var toCompare = false;
        if (fieldArray1[range1.startIndex].sqlDataType == null &&
            fieldArray2[range2.startIndex].sqlDataType == null) {
            toCompare = true;
        } else {
            var type1 = getArrayFieldsMaxSqlTypeIndex(fieldArray1, range1);
            var type2 = getArrayFieldsMaxSqlTypeIndex(fieldArray2, range2);
            if (type1 < type2) {
                toCompare = true;
            }
        }

        if (toCompare) {
            for (i = range1.startIndex; i <= range1.endIndex; i++) {
                for (j = range2.startIndex; j <= range2.endIndex; j++) {
                    if (fieldArray1[i].name == fieldArray2[j].name &&
                        fieldArray1[i].level == fieldArray2[j].level &&
                        fieldArray1[i].fieldPosition == fieldArray2[j].fieldPosition) {
                        if (compareFields(fieldArray1[i], fieldArray2[j], file.field[i], file.name)) {
                            changed = true;
                        }
                        break;
                    }
                }
            }
        }
    }

    return changed;
}

// Compare the array field when old is not alias table but new is aliased.
function compareFieldInAliasArray(oldObj, newObj, oldfilefield, tableName) {
    var currentType = oldObj.sqlDataType;
    var upgradeType = newObj.sqlDataType;

    var currentTypeObj;
    var upgradeTypeObj;
    var currentTypeIndex;
    var upgradeTypeIndex;

    var isExcept = false;
    var exceptMsg = funcs.scmsg("UPG_DBDICT_INFO", "upg", [tableName, oldObj.name, SM_TYPE[oldObj.smType]]);

    if (oldObj.smType != newObj.smType) {
        isExcept = true;
        exceptMsg += funcs.scmsg("UPG_DBDICT_EXPECT", "upg", [tableName, oldObj.name, SM_TYPE[newObj.smType]]);
    }

    if (currentType != null && upgradeType == null) {
        isExcept = true;
        exceptMsg += ", " + funcs.scmsg("UPG_DBDICT_SQLTYPE_EXPECT", "upg", [funcs.nullsub(currentType, "EMPTY"), "EMPTY"]);
    } else if (currentType == null && upgradeType != null) {
        isExcept = true;
        //SQLSERVER and DB2 convert to Oracle
        upgradeTypeObj = getSqlTypeIndex(upgradeType);
        upgradeTypeIndex = upgradeTypeObj.index;
        upgradeType = convertSqlTypeByDb(upgradeTypeIndex, upgradeTypeIndex, upgradeType, upgradeType, upgradeTypeObj.ntype);

        exceptMsg += ", " + funcs.scmsg("UPG_DBDICT_SQLTYPE_EXPECT", "upg", ["EMPTY", funcs.nullsub(upgradeType, "EMPTY")]);
    } else if (currentType != null && upgradeType != null) {
        currentTypeObj = getSqlTypeIndex(currentType);
        currentTypeIndex = currentTypeObj.index;
        upgradeTypeObj = getSqlTypeIndex(upgradeType);
        upgradeTypeIndex = upgradeTypeObj.index;

        upgradeType = convertSqlTypeByDb(currentTypeIndex, upgradeTypeIndex, currentType, upgradeType, currentTypeObj.ntype);

        if (currentTypeIndex != upgradeTypeIndex || currentTypeObj.ntype != upgradeTypeObj.ntype) {
            if (currentType != upgradeType &&
                (getDbType() != DB_TYPE["SQLSERVER"] || (currentType != "NVARCHAR(MAX)" && currentType != "NTEXT") || upgradeType != "TEXT")) {
                isExcept = true;
                exceptMsg += ", " + funcs.scmsg("UPG_DBDICT_SQLTYPE_EXPECT", "upg", [funcs.nullsub(currentType, "EMPTY"), funcs.nullsub(upgradeType, "EMPTY")]);
            }
        }
    }

    if (oldObj.sqlTableAlias != newObj.sqlTableAlias) {
        isExcept = true;
        exceptMsg += ", " + funcs.scmsg("UPG_DBDICT_SQLTABLE_EXPECT", "upg", [funcs.nullsub(oldObj.sqlTableAlias, "EMPTY"), funcs.nullsub(newObj.sqlTableAlias, "EMPTY")]);
    }

    if (isExcept) {
        lib.upgradeLog.error(exceptMsg);
    }

    return false;
}

/**
 *  compare and update fields
 *  
 *  @param  oldObj    		old dbdict field object
 *  @param  newObj    		new dbdict field object
 *  @param  oldfilefield   	old filed database type (referenced variable)
 *  @param  tableName      	SM table name
 **/
function compareFields(oldObj, newObj, oldfilefield, tableName) {
    var changed = false;

    if (oldObj.smType != newObj.smType) {
        changed = compareFieldType(oldObj, newObj, oldfilefield, tableName);
        if (!changed) {
            return false;
        }
    }

    var currentType = oldObj.sqlDataType;
    var upgradeType = newObj.sqlDataType;

    var currentTypeObj;
    var upgradeTypeObj;
    var currentTypeIndex;
    var upgradeTypeIndex;

    if (currentType == null && upgradeType == null) {
        return changed;
    } else if (currentType != null && upgradeType == null) {
        lib.upgradeLog.scError(1157, [tableName, oldObj.name, currentType, "EMPTY"]);
        return changed;
    } else if (currentType == null && upgradeType != null) {
        //SQLSERVER and DB2 convert to Oracle
        upgradeTypeObj = getSqlTypeIndex(upgradeType);
        upgradeTypeIndex = upgradeTypeObj.index;

        if (oldObj.smType == newObj.smType) {
            // synchronize sql type for the log
            upgradeType = convertSqlTypeByDb(upgradeTypeIndex, upgradeTypeIndex, upgradeType, upgradeType, upgradeTypeObj.ntype);

            //SQL RC flag change will trigger RTE full table copy, disable it due to performace issue and log to expect log for workaround						
            if (isLargeDataType(upgradeTypeIndex)) {
                lib.upgradeLog.scError(1157, [tableName, oldObj.name, "EMPTY", upgradeType]);
            } else {
                // Log: Updating field SQL type table for %S in %S dbdict from %S to %S
                lib.upgradeLog.scDetail(1150, [oldObj.name, tableName, "EMPTY", upgradeType]);

                oldfilefield.sql_field_options.sql_table_alias = newObj.sqlTableAlias;
                oldfilefield.sql_field_options.sql_column_name = newObj.sqlColumnName;
                oldfilefield.sql_field_options.sql_data_type = upgradeType;
                oldfilefield.sql_field_options.sql_rcformat = newObj.sqlRC;

                return true;
            }
        }

        return changed;
    }

    //SQLSERVER and DB2 convert to Oracle
    currentTypeObj = getSqlTypeIndex(currentType);
    currentTypeIndex = currentTypeObj.index;
    upgradeTypeObj = getSqlTypeIndex(upgradeType);
    upgradeTypeIndex = upgradeTypeObj.index;
    currentType = convertSqlTypeByDb(currentTypeIndex, currentTypeIndex, currentType, currentType, currentTypeObj.ntype);

    if (oldObj.smType == newObj.smType) {
        // Use to replace the codes in panel merge.fields of RAD apm.upgrade.dbdict, sm.patchrel.dbdict
        //  and panel merge.sql.mapping of RAD sm.hotfix.update.dbdict
        if (isEnlargableFieldType(currentType, upgradeType)) {
            var enlargedFieldType = convertSqlTypeByDb(currentTypeIndex, upgradeTypeIndex, currentType, upgradeType, currentTypeObj.ntype);
            if (enlargedFieldType != currentType) {
                oldfilefield.sql_field_options.sql_data_type = enlargedFieldType;
                lib.upgradeLog.scDetail(1100, [oldObj.name, tableName, currentType, enlargedFieldType]);
                return true;
            } else {
                return changed;
            }
        }

        if (!compareSqlTypeObject(currentTypeObj, upgradeTypeObj)) {
            upgradeType = convertSqlTypeByDb(currentTypeIndex, upgradeTypeIndex, currentType, upgradeType, currentTypeObj.ntype);
            if (currentType == upgradeType) {
                return changed;
            }

            if (getDbType() == DB_TYPE["SQLSERVER"] && (currentType == "NVARCHAR(MAX)" || currentType == "NTEXT")) {
                if (upgradeType == "TEXT") {
                    return changed;
                }
            }

            if (findTypeFromMatrix(currentTypeIndex, upgradeTypeIndex)) {
                // synchronize sql type for the log
                //upgradeType = convertSqlTypeByDb(currentTypeIndex, upgradeTypeIndex, currentType, upgradeType, currentTypeObj.ntype);   

                //QCCR67397
                //SQL RC flag change will trigger RTE full table copy, disable it due to performace issue and log to expect log for workaround						
                if (isLargeDataType(upgradeTypeIndex)) {
                    lib.upgradeLog.scError(1157, [tableName, oldObj.name, currentType, upgradeType]);
                } else {
                    // Log: Updating field SQL type table for %S in %S dbdict from %S to %S
                    lib.upgradeLog.scDetail(1150, [oldObj.name, tableName, currentType, upgradeType]);
                    oldfilefield.sql_field_options.sql_data_type = upgradeType;
                    return true;
                }
            } else {
                //upgradeType = convertSqlTypeByDb(currentTypeIndex, upgradeTypeIndex, currentType, upgradeType, currentTypeObj.ntype);
                if (!lib.upgradeCompareDbdict.isMoved2AliasAuto(tableName, oldObj.name, oldObj.smType)) {
                    lib.upgradeLog.scError(1157, [tableName, oldObj.name, currentType, upgradeType]);
                }
            }
        }
    }
    
    return changed;
}

// Check if the field type is able to be updated.
function isFieldTypeComparable(oldType, newType) {
    if ((oldType == lib.DataTypeConst.typeBoolean() && newType == lib.DataTypeConst.typeCharacter()) ||
        (oldType == lib.DataTypeConst.typeNumber() && newType == lib.DataTypeConst.typeCharacter())) {
        return true;
    }

    return false;
}

// The field types must be different.
// When the field type is able to be updated, update it
// Or report the except as before
function compareFieldType(oldObj, newObj, oldfilefield, tableName) {
    if (isFieldTypeComparable(oldObj.smType, newObj.smType)) {
        var msg = funcs.scmsg("UPG_DBDICT_TYPE_UPDATE", "upg", [oldObj.name, tableName, SM_TYPE[oldObj.smType], SM_TYPE[newObj.smType]]);
        lib.upgradeLog.detail(msg);
        lib.upgradeLog.error(msg + " -- " + funcs.scmsg("UPG_DBDICT_TYPE_UPDATE_ACTION", "upg", [tableName]));
        oldObj.smType = newObj.smType;
        oldfilefield.type = newObj.smType;
        return true;
    }

    lib.upgradeLog.scError(1155, [tableName, oldObj.name, SM_TYPE[oldObj.smType], SM_TYPE[newObj.smType]]);
    return false;
}


/**
 *    convert field sql type to base on database type, compare sql type field length , 
 *    and choose the longer one as new sql field length
 *
 *    @param  oldTypeIndex    old sql type index (index in array SQL_TYPE_INDEX)
 *    @param  newTypeIndex    new sql type index (index in array SQL_TYPE_INDEX)
 *    @param  oldType         old sql type
 *    @param  newType         new sql type
 *    @return converted sql type
 *    
 *    eg: input 1  3  varchar2(63)	 char(60)	---> VARCHAR2(63)	
 **/
function convertSqlTypeByDb(oldTypeIndex, newTypeIndex, oldType, newType, isNtype) {
    var db = getDbType();
    var pgci = 0;
    if (db == DB_TYPE["POSTGRESQL"]) {
        pgci = getPGCI();
    }
    var length;

    switch (newTypeIndex) {
        // VARCHAR  
        case 1:
            // CHAR	
        case 3:
            length = compareSqlTypeLength(oldTypeIndex, oldType, newType, db);
            if (isNtype) {
                newTypeIndex *= 10;
            }

            // When Oracle and field type is NVARCHAR2, do not update it and only enlarge length.
            if (db == 1 && oldType.toUpperCase().indexOf("NVARCHAR2") == 0 &&
                newType.toUpperCase().indexOf("VARCHAR") >= 0) {
                return "NVARCHAR2" + length;
            }

            return SQL_TYPE_FULLNAME[newTypeIndex][db + pgci] + length;
            // CLOB
        case 4:
            return SQL_TYPE_FULLNAME[4][db + pgci];
            // SHORT BLOB
        case 5:
            length = compareSqlTypeLength(oldTypeIndex, oldType, newType);
            if (db == DB_TYPE["DB2"]) {
                return SQL_TYPE_FULLNAME[5][db].replace("(255)", length);
            } else if (db == DB_TYPE["POSTGRESQL"]) { // POSTGRESQL type doesn't have number suffix.
                return SQL_TYPE_FULLNAME[5][db];
            } else {
                return SQL_TYPE_FULLNAME[5][db] + length;
            }
            //BLOB	
            case 6:
                return SQL_TYPE_FULLNAME[6][db];
            default:
                if (db == DB_TYPE["POSTGRESQL"] && SQL_TYPE_FULLNAME[newTypeIndex] != null && SQL_TYPE_FULLNAME[newTypeIndex].length > db + pgci) {
                    return SQL_TYPE_FULLNAME[newTypeIndex][db + pgci];
                }
                return newType;
    }
}


/**
 *   compare sqlType length, update the new sqltype, if its length less than the old one.
 *   
 *   eg: old dbdict type = VARCHAR(62) new dbdict type = CHAR(60) 
 *       the result should be CHAR(62)
 **/
function compareSqlTypeLength(oldTypeIndex, oldType, newType, db) {
    if (db == DBTYPE("POSTGRESQL")) {
        return compareSqlTypeLength4Postgresql(oldTypeIndex, oldType, newType);
    }

    var newLength = newType.match(FIELD_LENGTH_REGEX)[1];
    if (newLength.toUpperCase() == "MAX") {
        return "(MAX)";
    }

    if (oldTypeIndex == 1 || oldTypeIndex == 3 || oldTypeIndex == 5) {
        var oldLength = oldType.match(FIELD_LENGTH_REGEX)[1];
        if (oldLength.toUpperCase() == "MAX") {
            return "(MAX)";
        }

        // return the longer length for extending the new length		
        return "(" + Math.max(oldLength, newLength) + ")";
    }

    return "(" + newLength + ")";
}

function compareSqlTypeLength4Postgresql(oldTypeIndex, oldType, newType) {
    var prefix = "(";
    var suffix = ")";

    if (getPGCI() == 1) {
        prefix = "_";
        suffix = "";
    }

    var newLength = 0;
    var matches = newType.match(FIELD_LENGTH_REGEX);
    if (matches != null) {
        newLength = matches[1];
    } else {
        matches = newType.match(FIELD_LENGTH_REGEX_PGCI);
        if (matches != null) {
            newLength = matches[1];
        }
    }
    if (newLength.toUpperCase() == "MAX") {
        return "";
    }

    if (oldTypeIndex == 1 || oldTypeIndex == 3) {
        if (oldTypeIndex == 3) {
            prefix = "(";
            suffix = ")";
        }
        var oldLength = 0;
        matches = oldType.match(FIELD_LENGTH_REGEX);
        if (matches != null) {
            oldLength = matches[1];
            if (oldLength.toUpperCase() == "MAX") {
                return "";
            }
        } else {
            matches = oldType.match(FIELD_LENGTH_REGEX_PGCI);
            if (matches != null) {
                oldLength = matches[1];
            }
        }

        // return the longer length for extending the new length		
        return prefix + Math.max(oldLength, newLength) + suffix;
    }

    return prefix + newLength + suffix;
}


/**
 * QCCR1E120465
 * Upgrade Utility is built in Oracle db so the SQL Type of date/time fields are built to DATE in upgrade.str.
 * When upgrade in DB2, the SQL Type is set to DATE. But it should be TIMESTAMP.
 * This function replaces the SQL Type DATE to TIMESTAMP for DB2. 
 * It is invoked in the panel fcreate of apm.upgrade.dbdict before new dbdict is created.  
 **/
function updateDateSqlType(dbdict) {
    if (dbdict == null) {
        return;
    }

    if (getDbType() != DB_TYPE["DB2"]) {
        return;
    }

    var i;
    var length = dbdict["field"].length();
    for (i = 0; i < length; i++) {
        if (dbdict["field"][i] == null || dbdict["field"][i]["sql.field.options"] == null) {
            continue;
        }
        var sqltype = dbdict["field"][i]["sql.field.options"]["sql.data.type"];
        if (sqltype != null && sqltype.toUpperCase() == "DATE") {
            dbdict["field"][i]["sql.field.options"]["sql.data.type"] = "TIMESTAMP";
            lib.upgradeLog.detail("The SQL Type of the field " + dbdict["field"][i]["name"] + " is " + "TIMESTAMP");
        }
    }
}

/**
 *   query dbdict table sql db type as SM db type
 *	
 *	Assumption: 1. the SM instance has only one database type (SM allow connect to different database type)
 *               2. dbdict record exists in dbdict table
 *   
 *	@return current database type  0 --> sqlserver / 1 --> oracle / 2 --> db2
 **/
function getDbType() {
    if (vars.$G_current_db_type == null) {
        var dbdict = new SCFile("dbdict", SCFILE_READONLY);
        var rc = dbdict.doSelect("name=\"dbdict\""); // only one record
        if (rc == RC_SUCCESS) {
            switch (dbdict.sql_tables.sql_db_type.charAt(0)) {
                case "s":
                    vars.$G_current_db_type = DB_TYPE["SQLSERVER"];
                    break;
                case "o":
                    vars.$G_current_db_type = DB_TYPE["ORACLE"];
                    break;
                case "d":
                    vars.$G_current_db_type = DB_TYPE["DB2"];
                    break;
                case "p":
                    vars.$G_current_db_type = DB_TYPE["POSTGRESQL"];
                    break;
            }
        }
    }
    
    return vars.$G_current_db_type;
}


/**
 *    find sql type convert support matrix 
 *
 *	@param    currentTypeIndex
 *   @param    upgradeTypeIndex
 *   @return   true(support)/false(Not support)
 **/
function findTypeFromMatrix(currentTypeIndex, upgradeTypeIndex) {
    if (currentTypeIndex != UNDEFINED_INDEX) {
        var i;
        for (i = 0; i < CONVERT_MATRIX[currentTypeIndex].length; i++) {
            if (CONVERT_MATRIX[currentTypeIndex][i] == upgradeTypeIndex) {
                return true;
            }
        }
    }
    
    // DO NOT SUPPORT CONVERT
    return false;
}

/**
 *   get sqlType index (index in array SQL_TYPE_INDEX)
 *
 *   @param type  sql type
 *   @return index number
 **/
function getSqlTypeIndex(type) {
    type = type.toUpperCase();
    // structure like  "VARCHAR(*) FOR BIT DATA"
    if (type.match(DB2_SHORT_BLOB_REGEX) != null) {
        return {
            index: 5,
            ntype: false
        };
    }
    // cut type string
    type = type.substr(0, 4);

    var i;
    for (i = 0; i < SQL_TYPE_INDEX.length; i++) {
        if (SQL_TYPE_INDEX[i].type == type) {
            return SQL_TYPE_INDEX[i];
        }
    }

    // LOG: SQL type do not defined
    // lib.upgrade.scError()
    return {
        index: UNDEFINED_INDEX,
        ntype: false
    };
}

function compareSqlTypeIndex(oldIndex, newIndex, db) {
    if (db == null) {
        db = getDbType();
    }

    if (db == DBTYPE("POSTGRESQL")) {
        if (oldIndex == 6 && newIndex == 5) { // In POSTGRESQL, the type BYTEA is equal to VARBINARY and CLOB, etc and has the index 5 and 6.
            return true;
        }

        return Math.floor(oldIndex) == Math.floor(newIndex); // In POSTGRESQL, the type INT is equal to FLOAT of Oracle.
    }

    return oldIndex == newIndex;
}

function compareSqlTypeObject(oldFieldSqlTypeObj, newFieldSqlTypeObj) {
    var db = getDbType();
    if (db == DBTYPE("POSTGRESQL")) {
        return compareSqlTypeIndex(oldFieldSqlTypeObj.index, newFieldSqlTypeObj.index, db); // In POSTGRESQL, the type has no "N" prefix and support unicode by default so do not compare ntype.
    }

    return compareSqlTypeIndex(oldFieldSqlTypeObj.index, newFieldSqlTypeObj.index, db) && (oldFieldSqlTypeObj.ntype != false || newFieldSqlTypeObj.ntype != true);
}


function isLargeDataType(type) {
    if (type == 4 || type == 5 || type == 6) {
        return true;
    } else {
        return false;
    }
}


// Judge if the length of type can be compared and enlarged
// Invoked by RAD apm.upgrade.dbdict panel merge.fields
function isEnlargableFieldType(oldType, newType) {
    if (oldType == null || newType == null) {
        return false;
    }
    
    oldType = oldType.toUpperCase();
    newType = newType.toUpperCase();
    return (newType.indexOf("CHAR") >= 0 && oldType.indexOf("CHAR") >= 0) ||
        ((newType.indexOf("VARBINARY") >= 0 || newType.indexOf("RAW") >= 0) &&
            (oldType.indexOf("VARBINARY") >= 0 || oldType.indexOf("RAW") >= 0 || oldType.indexOf("FOR BIT DATA") >= 0));
}

// If the length of newType is longer, update the length to oldType
// Or just return the original oldType
function enlargeFieldType(oldType, newType) {
    if (oldType == null || newType == null) {
        return oldType;
    }
    
    var pattern = new RegExp("\\((\\d+)\\)");
    if (!pattern.test(oldType) || !pattern.test(newType)) {
        return oldType;
    }
    
    var old_matches = pattern.exec(oldType);
    var old_length_str = old_matches[1];
    var old_length = parseInt(old_length_str, 10);
    var new_matches = pattern.exec(newType);
    var new_length_str = new_matches[1];
    var new_length = parseInt(new_length_str, 10);
    if (old_length >= new_length) {
        return oldType;
    }

    var mergedType = oldType.replace(old_length_str, new_length_str);
    return mergedType;
}

// For every field, generate the string which stores all parent field names from the top to the direct parent field.
// For every brother field, the string is same and unique.
// Comparing the string, we can decide if the fields are in the same level position.
function generateDbdictFieldPositionArray(fieldArray) {
    var positionStack = [];
    var fieldPositionArray = [];
    if (lib.ArrayUtil.length(fieldArray) == 0) {
        return [];
    }
    
    positionStack.push(fieldArray[0]);
    fieldPositionArray.push("");
    var i;
    var j;
    var length = lib.ArrayUtil.length(fieldArray);
    for (i = 1; i < length; i++) {
        do {
            var top = positionStack[positionStack.length - 1];
            if (top["level"] < fieldArray[i]["level"]) {
                var positionStr = "";
                for (j = 0; j < positionStack.length; j++) {
                    if (j > 0) {
                        positionStr += "|";
                    }
                    positionStr += positionStack[j]["name"];
                }
                fieldPositionArray.push(positionStr);
                positionStack.push(fieldArray[i]);
                break;
            } else {
                positionStack.pop();
            }
        } while (positionStack.length > 0);
    }

    return fieldPositionArray;
}