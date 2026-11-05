var $ = lib.c.$;

var adaptor = adaptor == null ? lib.DataService.getAdaptor(lib.dbdictHelper.getDbType()) : adaptor;

/**
 *  Return the alias name in sql
 *  For example, one table is aliased as t1 so m1 table alias is t1
 *  Other tables, m2 is t1m2, a1 is t1a1
 */
function getTableSQLAlias(mainTableSQLAlias, aliasTableSQLAlias) {
    if (aliasTableSQLAlias == null || aliasTableSQLAlias == "m1") {
        return mainTableSQLAlias;
    }

    return mainTableSQLAlias + aliasTableSQLAlias;
}

/**
 *  Return the inner join part for main table:
 */
function innerJoinMainTable(joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields) {
    return joinMainTable("JOIN", joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields);
}

/**
 *  Return the left join part for main table:
 */
function leftJoinMainTable(joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields) {
    return joinMainTable("LEFT JOIN", joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields);
}

/**
 *  When the table is joined and there is more condition for join, invoke this funciton to append the more conditions with "AND"
 *  For example, AND t1.ID=t2.ID
 */
function appendJoinMainTable(joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields) {
    return joinMainTable(null, joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields);
}

/**
 *  Parameters:
 *      joinString - the string to construct join sql, INNER JOIN, LEFT JOIN;
 *                   The value null means that to constuct a part of join sql condition.
 *      joinMainTableName - the joined database table name
 *      mainTableSQLAlias - the table alias to be joined in join sql
 *      joinMainTableSQLAlias - The joined table alias in join sql
 *      uniqueFields - the array to store the database table columns of the unique key.
 *  Return the join part for main table:
 *      If the joinString is not null, return:
 *           <joinString> <joinMainTableName> <joinMainTableSQLAlias> 
 *               ON <mainTableSQLAlias>.<uniqueFields[0]>=<joinMainTableSQLAlias>.<uniqueFields[0]> 
 *               AND <mainTableSQLAlias>.<uniqueFields[1]>=<joinMainTableSQLAlias>.<uniqueFields[1]>
 *
 *      If the joinString is null, return:
 *           AND <mainTableSQLAlias>.<uniqueFields[0]>=<joinMainTableSQLAlias>.<uniqueFields[0]> 
 *               AND <mainTableSQLAlias>.<uniqueFields[1]>=<joinMainTableSQLAlias>.<uniqueFields[1]>
 */
function joinMainTable(joinString, joinMainTableName, mainTableSQLAlias, joinMainTableSQLAlias, uniqueFields) {
    var sql = "";
    var lng = uniqueFields.length;
    var i;
    var escapedUniqueField;
    for (i = 0; i < lng; i++) {
        if (joinString == null) {
            sql += "AND ";
        } else if (i > 0) {
            sql += " AND ";
        } else {
            sql += joinString + " " + joinMainTableName + " " + joinMainTableSQLAlias + " ON ";
        }

        escapedUniqueField = adaptor.escapeField(uniqueFields[i]);
        sql += mainTableSQLAlias + "." + escapedUniqueField + "=" + joinMainTableSQLAlias + "." + escapedUniqueField;
    }

    return sql;
}


/**
 *  For a table, there may be more than one record to map the record in m1 table. Here we want to combine multi records to one record
 *  There are different method to combine multi records for different database
 *  SQL Server: use STUFF ... FOR XML PATH
 *  Oracle: use LISTAGG
 *  PostgreSQL: use STRING_AGG
 */
function leftJoinAliasTable(aliasTableName, tableSQLAlias1, tableSQLAlias2, uniqueFields, aliasFields, dbtypecode) {
    var sql = "LEFT JOIN";

    var i;
    var j;
    var k;
    var escapedAliasField;
    var escapedUniqueField;
    var escapedUniqueFields = "";
    var lng = uniqueFields.length;
    for (j = 0; j < lng; j++) {
        escapedUniqueFields += "," + adaptor.escapeField(uniqueFields[j]);
    }

    if (escapedUniqueFields.length > 0) {
        escapedUniqueFields = escapedUniqueFields.substr(1);
    }

    sql += " (SELECT " + escapedUniqueFields + ",";

    var aliasAliasTableSQL = tableSQLAlias2 + "a";

    for (k = 0; k < aliasFields.length; k++) {
        if (k > 0) {
            sql += ",";
        }

        escapedAliasField = adaptor.escapeField(aliasFields[k]);
        if (dbtypecode == lib.dbdictHelper.DBTYPECODE("ORACLE")) {
            sql += "LISTAGG(" + escapedAliasField + "||'', ',') WITHIN GROUP(ORDER BY " + escapedAliasField + ") " + escapedAliasField;
        } else if (dbtypecode == lib.dbdictHelper.DBTYPECODE("SQLSERVER")) {
            sql += escapedAliasField + "=STUFF(";
            sql += "(SELECT ','+CONVERT(VARCHAR(MAX), " + escapedAliasField + ") FROM " + aliasTableName;

            for (i = 0; i < lng; i++) {
                if (i > 0) {
                    sql += " AND ";
                } else {
                    sql += " WHERE ";
                }

                escapedUniqueField = adaptor.escapeField(uniqueFields[i]);
                sql += escapedUniqueField + "=" + aliasAliasTableSQL + "." + escapedUniqueField;
            }

            sql += " FOR XML PATH('')), 1, 1, '')";
        } else if (dbtypecode == lib.dbdictHelper.DBTYPECODE("POSTGRESQL")) {
            sql += "STRING_AGG(''||" + escapedAliasField + ", ',') " + escapedAliasField;
        } else {
            return "";
        }
    }

    sql += " FROM " + aliasTableName + " " + aliasAliasTableSQL + " GROUP BY " + escapedUniqueFields + ") " + tableSQLAlias2;

    for (i = 0; i < lng; i++) {
        if (i > 0) {
            sql += " AND ";
        } else {
            sql += " ON ";
        }

        escapedUniqueField = adaptor.escapeField(uniqueFields[i]);

        sql += tableSQLAlias1 + "." + escapedUniqueField + "=" + tableSQLAlias2 + "." + escapedUniqueField;
    }

    return sql;
}

/**
 *  Return the inner join part sql for non-main table
 */
function innerJoinTable(tableName, tableSQLAlias, mappedRelations, usedTableNames) {
    return joinTable("JOIN", tableName, tableSQLAlias, mappedRelations, usedTableNames);
}

/**
 *  Return the left join part sql for non-main table
 */
function leftJoinTable(tableName, tableSQLAlias, mappedRelations, usedTableNames) {
    return joinTable("LEFT JOIN", tableName, tableSQLAlias, mappedRelations, usedTableNames);
}

/**
 *  Return the join part sql for non-main table
 */
function joinTable(joinString, tableName, tableSQLAlias, mappedRelations, usedTableNames) {
    var sql = joinString;
    sql += " " + tableName + " " + tableSQLAlias;
    var lng = mappedRelations.length;
    var subsql = "";
    var i;
    for (i = 0; i < lng; i++) {
        if (!(lib.ArrayUtil.contains(usedTableNames, mappedRelations[i]["table1"]) && mappedRelations[i]["table2"] == tableName) &&
            !(lib.ArrayUtil.contains(usedTableNames, mappedRelations[i]["table2"]) && mappedRelations[i]["table1"] == tableName)) {
            continue;
        }

        if (subsql.length > 0) {
            subsql += " AND ";
        } else {
            subsql += " ON ";
        }

        subsql += mappedRelations[i]["table.sql.alias.1"] + "." + adaptor.escapeField(mappedRelations[i]["sql.field.1"]) +
            "=" + mappedRelations[i]["table.sql.alias.2"] + "." + adaptor.escapeField(mappedRelations[i]["sql.field.2"]);
    }

    if (subsql.length == 0) {
        return "";
    }

    sql += subsql;

    return sql;
}

/**
 *  Construct the dbdict to JSON
 *  The format is:
 *  {
 *     <dbdict name>:<dbdict JSON>
 *  }
 */
function constructDbdictJSONMappings(dbdicts) {
    var mapping = {};
    var i;
    for (i = 0; i < dbdicts.length; i++) {
        let json = constructDbdictJSON(dbdicts[i]);
        json["view.table.alias"] = "t" + i;
        mapping[dbdicts[i]] = json;
    }

    return mapping;
}

/**
 *  Construct the dbdict to JSON
 *  The format is:
 *  {
 *     "name":<name>,
 *     "fields": [{"name":<name>, "type":<type>, "sql.column.name":<sql.column.name>, "sql.table.alias":<sql.table.alias>}],
 *     "fieldsMap: {
 *                    <name> : {"name":<name>, "type":<type>, "sql.column.name":<sql.column.name>, "sql.table.alias":<sql.table.alias>}
 *                 },
 *     "tableAliasFieldMap": 
 *                     {
 *                         "m1": [<field name>],
 *                         "a1": [<fieldname>]
 *                     },
 *     "tables":[{"sql.table.name":<sql.table.name>, "sql.table.alias":<sql.table.alias>}],
 *     "tablesMap": {
 *                     <sql.table.alias>:<sql.table.name>
 *                  },
 *     "tableAliasMap" : {
 *                          <sql.table.name>:<sql.table.alias>
 *                       },
 *     "mtables": [<sql.table.name>],
 *     "unique.key.fields": [<key field>],
 *     "unique.key.columns": [<key column>],
 *     "view.table.alias":"t0"
 *  }
 */
function constructDbdictJSON(dbdict) {
    var fDbdict = new SCFile("dbdict");
    var sql = "name=\"" + dbdict + "\"";
    var rc = fDbdict.doSelect(sql);
    if (rc == RC_SUCCESS) {
        var jsonDbdict = {};
        jsonDbdict["name"] = dbdict;

        // construct table json
        jsonDbdict["tables"] = [];
        jsonDbdict["tablesMap"] = {};
        jsonDbdict["tableAliasMap"] = {};
        jsonDbdict["mtables"] = [];

        var i;
        var j;
        lng = funcs.lng(fDbdict["sql.tables"]);
        for (i = 0; i < lng; i++) {
            if (fDbdict["sql.tables"][i]["sql.table.alias"].indexOf("N") >= 0 || fDbdict["sql.tables"][i]["sql.table.alias"].indexOf("n") >= 0) { // ignore the n table
                continue;
            }

            let table = {};
            table["sql.table.name"] = fDbdict["sql.tables"][i]["sql.table.name"];
            table["sql.table.alias"] = fDbdict["sql.tables"][i]["sql.table.alias"].toLowerCase(); // always store lower case alias

            jsonDbdict["tables"].push(table);
            jsonDbdict["tablesMap"][table["sql.table.alias"]] = table["sql.table.name"];
            jsonDbdict["tableAliasMap"][table["sql.table.name"]] = table["sql.table.alias"];

            if (table["sql.table.alias"].indexOf("m") == 0) { // store m table name
                jsonDbdict["mtables"].push(table["sql.table.name"]);
            }
        }

        // construct field json
        jsonDbdict["fields"] = [];
        jsonDbdict["fieldsMap"] = {};
        jsonDbdict["tableAliasFieldMap"] = {};

        var lng = funcs.lng(fDbdict["field"]);
        for (i = 0; i < lng; i++) {
            if (fDbdict["field"][i]["sql.field.options"]["sql.column.name"] != null) { // only fetch the field that has the column
                if (fDbdict["field"][i]["sql.table.alias"].indexOf("N") >= 0 || fDbdict["field"][i]["sql.table.alias"].indexOf("n") >= 0) { // ignore the field in n table
                    continue;
                }

                let field = {};
                field["name"] = fDbdict["field"][i]["name"];
                field["type"] = fDbdict["field"][i]["type"];
                field["sql.column.name"] = fDbdict["field"][i]["sql.column.name"];
                field["sql.table.alias"] = fDbdict["field"][i]["sql.table.alias"].toLowerCase();

                // when the alias table name of this field doesn't exist in the dbdict, ignore this field
                // it happens when create one non-array/structure field in alias table
                if (field["sql.table.alias"].indexOf("a") == 0 && jsonDbdict["tablesMap"][field["sql.table.alias"]] == null) {
                    continue;
                }

                jsonDbdict["fields"].push(field);
                jsonDbdict["fieldsMap"][field["name"]] = field;

                // Store the field in the alias table
                var tableAliasFieldList = jsonDbdict["tableAliasFieldMap"][field["sql.table.alias"]];
                if (tableAliasFieldList == null) {
                    jsonDbdict["tableAliasFieldMap"][field["sql.table.alias"]] = [];
                }
                jsonDbdict["tableAliasFieldMap"][field["sql.table.alias"]].push(field["name"]);
            }
        }

        // construct unique key json
        var uniqueKeys = [];
        var uniqueColumns = [];
        lng = funcs.lng(fDbdict["key"]);
        for (i = 0; i < lng; i++) {
            // primary key or unique key
            if (fDbdict["key"][i]["flags"] == 28 || fDbdict["key"][i]["flags"] == 12) {
                let lng2 = funcs.lng(fDbdict["key"][i]["name"]);
                for (j = 0; j < lng2; j++) {
                    let keyname = fDbdict["key"][i]["name"][j];
                    if (keyname != null) {
                        let keynameparts = keyname.split(",");
                        keyname = keynameparts[keynameparts.length - 1];
                    }

                    let column = jsonDbdict["fieldsMap"][keyname]["sql.column.name"];
                    if (column != null) {
                        uniqueKeys.push(keyname);
                        uniqueColumns.push(column);
                    }
                }

                break;
            }
        }
        jsonDbdict["unique.key.names"] = uniqueKeys;
        jsonDbdict["unique.key.columns"] = uniqueColumns;

        return jsonDbdict;
    }

    return null;
}

/**
 *  Return the dbdict JSON form mappings.
 */
function getDbdictJSONFromMapping(dbdictMapping, dbdict) {
    if (dbdictMapping != null) {
        return dbdictMapping[dbdict];
    }

    return null;
}

/**
 *  Return the all main database table names of dbdict.
 */
function getDbdictJSONMainTables(dbdictJSON) {
    if (dbdictJSON != null) {
        return dbdictJSON["mtables"];
    }

    return null;
}

/**
 *  Return the first main database table name of dbdict.
 */
function getDbdictJSONMainTable(dbdictJSON) {
    var mtables = getDbdictJSONMainTables(dbdictJSON);
    if (mtables != null) {
        return mtables[0];
    }

    return null;
}

/**
 *  Return one array:
 *    Element1: the database table, 
 *    Element2: the database table column
 *    Element3: the table alias in create view sql of one part of relation
 *  
 */
function getMappedRelationPart(dbdictJSON, fieldname) {
    var field = dbdictJSON["fieldsMap"][fieldname];
    if (field == null) {
        return null;
    }

    var alias = field["sql.table.alias"];
    if (alias == null) {
        return null;
    }

    var table = dbdictJSON["tablesMap"][alias];
    if (table == null) {
        return null;
    }

    var result = [];

    result.push(table);
    result.push(field["sql.column.name"]);
    if (alias == "m1") {
        result.push(dbdictJSON["view.table.alias"]);
    } else {
        result.push(dbdictJSON["view.table.alias"] + dbdictJSON["tableAliasMap"][table]);
    }

    return result;
}

/**
 *  Add the database table, column, alias of create view sql in the relation JSON
 *  The format is:
 *  {
 *     "dbdict1"			: <dbdict1 name>,
 *     "field1"				: <field1 name>,
 *     "dbdict2"			: <dbdict2 name>,
 *     "field2"				: <field2 name>,
 *     "table1"				: <dbdict1 table>,
 *     "sql.field.1"		: <field1 column>,
 *     "table.sql.alias.1"	: <dbdict1 view sql table alias>,
 *     "table2"				: <dbdict2 table>,
 *     "sql.field.2"		: <field2 column>,
 *     "table.sql.alias.2"	: <dbdict2 view sql table alias>
 *  }
 */
function getMappedRelation(dbdictMapping, relation) {
    var dbdict1 = relation["dbdict1"];
    var dbdict2 = relation["dbdict2"];
    var field1 = relation["field1"];
    var field2 = relation["field2"];

    if (dbdict1 == null || dbdict2 == null || field1 == null || field2 == null) {
        return null;
    }

    var dbdictJSON1 = getDbdictJSONFromMapping(dbdictMapping, dbdict1);
    if (dbdictJSON1 == null) {
        return null;
    }

    var result1 = getMappedRelationPart(dbdictJSON1, field1);
    if (result1 == null) {
        return null;
    }

    var dbdictJSON2 = getDbdictJSONFromMapping(dbdictMapping, dbdict2);
    if (dbdictJSON2 == null) {
        return null;
    }

    var result2 = getMappedRelationPart(dbdictJSON2, field2);
    if (result2 == null) {
        return null;
    }

    relation["table1"] = result1[0];
    relation["sql.field.1"] = result1[1];
    relation["table.sql.alias.1"] = result1[2];

    relation["table2"] = result2[0];
    relation["sql.field.2"] = result2[1];
    relation["table.sql.alias.2"] = result2[2];

    return relation;
}

/**
 *  Add the database table, column, alias of create view sql in every relation JSON
 */
function getMappedRelations(dbdictMapping, relations) {
    var mappedRelations = [];
    var lng = relations.length;
    var i;
    var mappedRelation;
    for (i = 0; i < lng; i++) {
        mappedRelation = getMappedRelation(dbdictMapping, relations[i]);
        if (mappedRelation != null) {
            mappedRelations.push(mappedRelation);
        }
    }

    return mappedRelations;
}

/**
 *  Check if the mapped relations (not the original relation) are valid
 *  When not all of dbdicts are defined in relations, it is not valid
 */
function validateMappedRelations(mappedRelations, numberOfDbdicts) {
    if (numberOfDbdicts == 1) {
        return true;
    }

    if (mappedRelations == null || mappedRelations.length == 0) {
        return false;
    }

    var len = mappedRelations.length;
    var dbdictSet = [];
    var i;
    var dbdict1;
    var dbdict2;
    for (i = 0; i < len; i++) {
        dbdict1 = mappedRelations[i]["dbdict1"];
        dbdict2 = mappedRelations[i]["dbdict2"];
        if (dbdictSet.length == 0) {
            dbdictSet.push(dbdict1);
            dbdictSet.push(dbdict2);
        } else {
            if (lib.ArrayUtil.contains(dbdictSet, dbdict1) || lib.ArrayUtil.contains(dbdictSet, dbdict2)) {
                lib.ArrayUtil.merge(dbdictSet, [dbdict1, dbdict2]);
            }
        }
    }

    if (dbdictSet.length < numberOfDbdicts) {
        return false;
    }

    return true;
}

function getViewTableSQLAlias(tableSQLAlias) {}

/**
 *  The parameter dbdict_fields is an array and every element is an array with 3 elements: [dbdict, field, newColumnName]
 *  Return one array:
 *      Element 1: the string of the field column list as the column list of sql
 *      Element 2: one JSON contains the non-m1 sm mtable name and its fields, for example
 *                     {
 *                        <dbdict name>:
 *                          {
 *                             "m2": [<field>, <field>]
 *                          }
 *                     }
 *      Element 3: one JSON to contains the sm table alias name of the used fields, for example
 *                     {
 *                        <dbdict name>: ["a1", "a3"]
 *                     }
 */
function processFieldList(dbdictMapping, dbdict_fields, useAlias) {
    var sqlColumnString = null;
    var fieldConcatStr = ",\n        ";
    var dbdictUsedAlias = {};
    var dbdictUsedMtables = {};
    if (dbdict_fields != null && dbdict_fields.length > 0) {
        sqlColumnString = "";
        var usedFields = [];
        var usedDbdictFields = [];
        var renamedFields = [];
        var i;
        for (i = 0; i < dbdict_fields.length; i++) {
            let dbdict = dbdict_fields[i][0];
            let field = dbdict_fields[i][1];
            let newColumnName = dbdict_fields[i][2];
            let dbdict_field = dbdict + "." + field;
            let dbdictJSON = dbdictMapping[dbdict];
            if (dbdictJSON != null) {
                let column = dbdictJSON["fieldsMap"][field] == null ? null : dbdictJSON["fieldsMap"][field]["sql.column.name"];
                if (column == null) { // When the field has no column, do not use it.
                    continue;
                }

                let alias = dbdictJSON["fieldsMap"][field]["sql.table.alias"];
                let tableSQLAlias = dbdictJSON["view.table.alias"];
                if (alias != "m1") { // Do not process the field in m1 table here
                    if (alias.indexOf("a") == 0) { // Store the a alias name in one array
                        if (!useAlias) { // When do not use alias table, do not use the field in alias table
                            continue;
                        }

                        tableSQLAlias += alias; // Generate the alias name in sql for this alias table

                        if (dbdictUsedAlias[dbdict] == null) {
                            dbdictUsedAlias[dbdict] = [];
                        }
                        if (!lib.ArrayUtil.contains(dbdictUsedAlias[dbdict], alias)) {
                            dbdictUsedAlias[dbdict].push(alias);
                        }
                    } else if (alias.indexOf("m") == 0) { // Store other m alias name and the field in other m table as JSON
                        if (dbdictUsedMtables[dbdict] == null) {
                            dbdictUsedMtables[dbdict] = {};
                        }
                        if (dbdictUsedMtables[dbdict][alias] == null) {
                            dbdictUsedMtables[dbdict][alias] = [];
                        }
                        if (!lib.ArrayUtil.contains(dbdictUsedMtables[dbdict][alias], alias)) {
                            dbdictUsedMtables[dbdict][alias].push(field);
                        }
                    }
                }

                let escapedColumn = adaptor.escapeField(column); // escape the column to adapt for different database

                if (!lib.ArrayUtil.contains(usedFields, field)) { // do not use the same field name
                    usedFields.push(field);
                    usedDbdictFields.push(dbdict_field);
                    sqlColumnString += fieldConcatStr + tableSQLAlias + "." + escapedColumn;
                    if (newColumnName != null && newColumnName.length > 0) {
                        renamedFields.push(newColumnName);
                        sqlColumnString += " " + adaptor.escapeField(newColumnName);
                    }
                } else if (!lib.ArrayUtil.contains(usedDbdictFields, dbdict_field)) { // same field column in different table but use alias column name if exists
                    usedDbdictFields.push(dbdict_field);
                    sqlColumnString += fieldConcatStr + tableSQLAlias + "." + escapedColumn;
                    if (newColumnName != null && newColumnName.length > 0) {
                        renamedFields.push(newColumnName);
                        sqlColumnString += " " + adaptor.escapeField(newColumnName);
                    }
                }
            }
        }

        if (sqlColumnString.length > 0) {
            sqlColumnString = sqlColumnString.substr(fieldConcatStr.length); // trim the first field concat string
        }
    }

    return [sqlColumnString, dbdictUsedMtables, dbdictUsedAlias];
}

var WHERE_OPERATOR = {
    "EQ": "=",
    "NEQ": "<>",
    "GT": ">",
    "LT": "<",
    "GTEQ": ">=",
    "LTEQ": "<=",
    "BTW": "BETWEEN",
    "AND": "AND",
    "EQ_STR": "LIKE",
    "LIKE": "LIKE",
    "IN": "IN",
    "NULL": "IS NULL",
    "EQ_DT": "=",
    "GTEQDT": ">=",
    "LTEQDT": "<="
};

// Define the logic operator for filter of criteria/where
var WHERE_LOGIC_OPERATOR = {
    "AND": "AND",
    "OR": "OR",
    "NOT": "NOT"
};

// Define the logic operator for compound of criteria/where
var WHERE_COMPOUND_OPERATOR = {
    "CAND": "AND (",
    "CANDCNOT": "AND NOT (",
    "COR": "OR  (",
    "CORCNOT": "OR NOT (",
    "CNOT": "NOT (",
    "CEND": ")"
};

var WHERE_COMPOUND_TAG = "<compound>";
var WHERE_FILTER_TAG = "<filter>";

// Define the index of the criteria field
var WHERE_CRITERIA_FIELD_INDEX = {
    "COMPOUND": {
        "tag": 0,
        "level": 1,
        "logic_operator": 2,
        "id": 3
    },
    "FILTER": {
        "tag": 0,
        "level": 1,
        "logic_operator": 2,
        "file_name": 3,
        "field_name": 4,
        "field_type": 5,
        "not_operator": 6,
        "operator": 7,
        "values": 8
    }
};

/**
 *  Return the index of the field of compound criteria
 */
function getWhereCriteriaCompoundFieldIndex(criteriaField) {
    return getWhereCriteriaFieldIndex("COMPOUND", criteriaField);
}

/**
 *  Return the index of the field of filter criteria
 */
function getWhereCriteriaFilterFieldIndex(criteriaField) {
    return getWhereCriteriaFieldIndex("FILTER", criteriaField);
}

/**
 *  Return the index of the field in criteria
 *  Parameter criteriaType: COMPOUND or FILTER
 *  If the type is not matched or there is such field, return -1
 */
function getWhereCriteriaFieldIndex(criteriaType, criteriaField) {
    var fieldsJSON = WHERE_CRITERIA_FIELD_INDEX[criteriaType];
    if (fieldsJSON !== null) {
        var index = fieldsJSON[criteriaField];
        if (index !== null) {
            return +index;
        }
    }

    return -1;
}

/**
 *  Return the value of the field in compound criteria
 *  Parameter criteriaField: the field name of criteria defined in WHERE_CRITERIA_FIELD_INDEX
 */
function getCriteriaCompoundFieldValue(criteria, criteriaField) {
    return getCriteriaFieldValue(criteria, "COMPOUND", criteriaField);
}

/**
 *  Return the value of the field in filter criteria
 *  Parameter criteriaField: the field name of criteria defined in WHERE_CRITERIA_FIELD_INDEX
 */
function getCriteriaFilterFieldValue(criteria, criteriaField) {
    return getCriteriaFieldValue(criteria, "FILTER", criteriaField);
}

/**
 *  Return the value of the field in filter criteria
 *  Parameter criteriaType:  COMPOUND or FILTER
 *  Parameter criteriaField: the field name of criteria defined in WHERE_CRITERIA_FIELD_INDEX
 */
function getCriteriaFieldValue(criteria, criteriaType, criteriaField) {
    if (criteria == null) {
        return null;
    }

    var index = getWhereCriteriaFieldIndex(criteriaType, criteriaField);
    if (index === null) {
        return null;
    }

    return criteria[index];
}

/**
 *  Return the where part of sql
 *  The structure of wheres is (same as the criterias):
 *    [
 *       [<tag>, <level>, <logic_operator>, <file_name>, <field_name>, <field_type>, <not_operator>, <operator>, <values>], // filter
 *       [<tag>, <level>, <logic_operator>, <id>]  // compound
 *    ]
 *  tag is WHERE_COMPOUND_TAG when it is compound or WHERE_FILTER_TAG for filter
 */
function processWheres(dbdictMapping, wheres, dbtypecode) {
    if (wheres == null) {
        return "";
    }

    var jsWheres = wheres;
    if (!(jsWheres instanceof Array)) {
        jsWheres = wheres.toArray();
    }
    if (jsWheres == null) {
        jsWheres = [];
    }

    var logic_operator_compound_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
    var id_index = getWhereCriteriaCompoundFieldIndex("id");
    var file_name_index = getWhereCriteriaFilterFieldIndex("file_name");
    var field_name_index = getWhereCriteriaFilterFieldIndex("field_name");
    var logic_operator_filter_index = getWhereCriteriaFilterFieldIndex("logic_operator");
    var not_operator_index = getWhereCriteriaFilterFieldIndex("not_operator");
    var operator_index = getWhereCriteriaFilterFieldIndex("operator");
    var values_index = getWhereCriteriaFilterFieldIndex("values");

    var wheresql = "";
    var lng = jsWheres.length;
    var i;
    for (i = 0; i < lng; i++) {
        if (jsWheres[i] == null || jsWheres[i].length == 0) {
            continue;
        }

        let jsWhere = rteJSONParse(jsWheres[i]);
        let op;

        if (isCriteriaCompound(jsWhere)) {
            op = jsWhere[logic_operator_compound_index];
            if (op != null) {
                // When the compound is not END
                // Check if there is filter between this compound and its end compound;
                // If not, skip this compound to its end..
                if (op != "CEND") {
                    let filterIncluded = false;
                    let nextPosition = getNextCriteriaPosition(jsWheres, i);
                    let latestPosition = -1;
                    while (nextPosition >= 0) {
                        latestPosition = nextPosition; // Store the latest position
                        let nextWhere = rteJSONParse(jsWheres[nextPosition]);
                        if (isCriteriaCompound(nextWhere)) {
                            if (nextWhere[id_index] == jsWhere[id_index] && nextWhere[logic_operator_compound_index] == "CEND") { // found its END compound
                                break;
                            }
                        } else { // found filter
                            filterIncluded = true;
                            break;
                        }

                        nextPosition = getNextCriteriaPosition(jsWheres, nextPosition);
                    }

                    if (!filterIncluded) {
                        if (latestPosition >= 0) {
                            i = latestPosition; // When no filter and there is latest position, move i to latest position
                        }
                        continue;
                    }
                }

                let display_op = WHERE_COMPOUND_OPERATOR[op];
                if (display_op != null) {
                    wheresql += " " + display_op;
                }
            }
            continue;
        }

        let dbdictJSON = dbdictMapping[jsWhere[file_name_index]]; // dbdict name
        if (dbdictJSON == null) {
            continue;
        }

        let fieldProp = dbdictJSON["fieldsMap"][jsWhere[field_name_index]]; // field name
        if (fieldProp == null) {
            continue;
        }

        let column = fieldProp["sql.column.name"];
        let escapedColumn = adaptor.escapeField(column);
        let fieldtype = fieldProp["type"];
        let alias = fieldProp["sql.table.alias"];
        let tableSQLAlias = dbdictJSON["view.table.alias"];
        if (alias != "m1") {
            tableSQLAlias += alias;
        }

        let subwheresql = "";
        if (wheresql.length > 0) {
            if (jsWhere[logic_operator_filter_index] != null && jsWhere[logic_operator_filter_index].length > 0) {
                let logicOp = WHERE_LOGIC_OPERATOR[jsWhere[logic_operator_filter_index]];
                if (logicOp != null) {
                    subwheresql += " " + logicOp; // logic operator
                }
            }
        }

        if (jsWhere[not_operator_index] == true) { // NOT operator
            subwheresql += " " + WHERE_LOGIC_OPERATOR["NOT"];
        }

        let operator = jsWhere[operator_index];
        if (operator == null) {
            continue;
        }

        op = WHERE_OPERATOR[operator];
        if (op == null) {
            continue;
        }

        let opsql = op;

        let values = jsWhere[values_index];
        if (values != null) {
            let len = values.length;
            if (len > 0 && values[0] != null) {
                let value = values[0];

                let valuestring = "";
                if (fieldtype == lib.DataTypeConst.typeNumber()) {
                    valuestring += value;
                } else if (fieldtype == lib.DataTypeConst.typeBoolean()) {
                    valuestring += (value == "true" || value == true) ? "'t'" : "'f'";
                } else if (fieldtype == lib.DataTypeConst.typeDateTime()) {
                    if (value == "relative") {
                        let func = values[1];
                        let param_num = 0;
                        if (values[2] != null) {
                            param_num = +values[2];
                        }
                    } else {
                        value = value.replace(/\//g, "-"); // // yyyy/mm/dd hh:mm:ss GMT -> yyyy-mm-dd hh:mm:ss
                        valuestring = adaptor.escapeDateValue(value);
                    }
                } else {
                    valuestring = value.replace(/%/g, "[%]").replace(/_/g, "[_]"); // escape % and _ in sql
                    if (operator == "LIKE") {
                        valuestring = "%" + valuestring.replace(/\*/g, "%") + "%"; // * is replaced to % and add % before and after it
                    }
                    // Escapte single quote to avoid SQL injection
                    valuestring = "'" + lib.StringUtil.escapeAllSingleQuoteForSQL(valuestring) + "'";
                }

                opsql += " " + valuestring;
            }
        }

        if (opsql.length > 0) {
            subwheresql += " " + tableSQLAlias + "." + escapedColumn + " " + opsql;
            wheresql += subwheresql;
        }
    }

    if (wheresql.length > 0) {
        wheresql = "WHERE " + wheresql;
    }

    return wheresql;
}

/**
 *  Return the sql to create database view
 *  Parameter:
 *      viewName: the database view name to create
 *      dbdicts:  the array of dbdict names
 *      dbdict_fields: the array of dbdict-fields name
 *      relations: the array of the field relation between dbdicts
 *      wheres:   the array of where criterias, every element is the stringfy of JSON array of criteria
 *      useAlias: the boolean to decide if use alias table to generate the database view
 */
function generateViewSQL(viewName, dbdicts, dbdict_fields, relations, wheres, useAlias) {
    if (useAlias == null) {
        useAlias = false;
    }

    var dbtypecode = lib.dbdictHelper.getDbTypeCode();

    var dbdictMapping = constructDbdictJSONMappings(dbdicts);

    var fieldsResult = processFieldList(dbdictMapping, dbdict_fields, useAlias);

    var columnListString = fieldsResult[0];

    if (columnListString == null) {
        //print("Select one field at least");
        return null;
    }

    var mappedRelations = getMappedRelations(dbdictMapping, relations);

    var validated = validateMappedRelations(mappedRelations, dbdicts.length);
    if (!validated) {
        //print("The relations are not defined correctly or some of dbdicts are not defined in the relations.");
        return;
    }

    var usedTableNames = [];
    var sql = "";

    var dbdictJSON = getDbdictJSONFromMapping(dbdictMapping, dbdicts[0]);
    if (dbdictJSON == null) {
        return null;
    }
    var mtable = getDbdictJSONMainTable(dbdictJSON);
    if (mtable == null) {
        return null;
    }

    sql += "\nFROM " + mtable + " " + dbdictJSON["view.table.alias"];

    usedTableNames.push(mtable);

    if (fieldsResult[1] != null) {
        var mtableJSON = fieldsResult[1][dbdicts[0]];
        if (mtableJSON != null) {
            var mtable2;
            for (mtable2 in mtableJSON) {
                sql += "\n  " + leftJoinMainTable(dbdictJSON["tablesMap"][mtable2], dbdictJSON["view.table.alias"], getTableSQLAlias(dbdictJSON["view.table.alias"], mtable2), dbdictJSON["unique.key.columns"]);
                usedTableNames.push([dbdictJSON["tablesMap"][mtable2]]);
            }
        }
    }

    var i;
    var j;
    var k;

    var dbdictUsedAlias = fieldsResult[2][dbdicts[0]];
    if (useAlias && dbdictUsedAlias != null) { // only when set to use alias and the alias field is in the field list to query, join the alias table
        for (i = 0; i < dbdictUsedAlias.length; i++) {
            let aliasFields = dbdictJSON["tableAliasFieldMap"][dbdictUsedAlias[i]];
            if (aliasFields != null) {
                let aliasFieldColumns = [];
                for (k = 0; k < aliasFields.length; k++) {
                    aliasFieldColumns.push(dbdictJSON["fieldsMap"][aliasFields[k]]["sql.column.name"]);
                }
                sql += "\n    " + leftJoinAliasTable(dbdictJSON["tablesMap"][dbdictUsedAlias[i]], dbdictJSON["view.table.alias"], getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictUsedAlias[i]),
                    dbdictJSON["unique.key.columns"], aliasFieldColumns, dbtypecode);
            }
        }
    }

    var len = funcs.lng(dbdicts);

    // Start from the 2nd table construct join sql part
    for (i = 1; i < len; i++) {
        dbdictJSON = getDbdictJSONFromMapping(dbdictMapping, dbdicts[i]);
        if (dbdictJSON == null) {
            return null;
        }
        mtable = getDbdictJSONMainTable(dbdictJSON);
        if (mtable == null) {
            continue;
        }

        let substituteMtable = null; // Store the database table name to substitue m1 table as the first mail table.
        let joinedMtables = []; // Store the database table name which has used to join in this dbdict.
        // Try to left join m1 table
        let msql = innerJoinTable(mtable, dbdictJSON["view.table.alias"], mappedRelations, usedTableNames);
        if (msql.length > 0) {
            joinedMtables.push(mtable);
            usedTableNames.push(mtable);
        }

        // Loop to join all m tables defined in mapped relations
        let mtables = dbdictJSON["mtables"];
        for (j = 0; j < mtables.length; j++) {
            if (dbdictJSON["tableAliasMap"][mtables[j]] == "m1") {
                continue;
            }

            let msubsql = "";
            if (msql.length == 0) {
                // m1 table is not joined so try to find another m table as the substitute m table and left join
                msubsql = innerJoinTable(mtables[j], getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictJSON["tableAliasMap"][mtables[j]]), mappedRelations, usedTableNames);
            } else {
                // At least, one m table is left join. Try to inner join other m table when it is defined in mapped relations.
                if (!lib.ArrayUtil.contains(joinedMtables, mtables[j])) {
                    msubsql = innerJoinTable(mtables[j], getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictJSON["tableAliasMap"][mtables[j]]), mappedRelations, usedTableNames);
                    // compound join: inner join and left join to outer table by relations
                    // only when join available from mapped relation, append the unique key as the join condition.
                    if (msubsql.length > 0) {
                        msubsql = "\n  " + msubsql;
                        var appendsql = appendJoinMainTable(mtables[j], getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictJSON["tableAliasMap"][substituteMtable == null ? mtable : substituteMtable]), getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictJSON["tableAliasMap"][mtables[j]]), dbdictJSON["unique.key.columns"]);
                        if (appendsql.length > 0) {
                            msubsql += " " + appendsql;
                        }
                    }
                }
            }

            if (msubsql.length > 0) {
                // Put the database table name into the array for the current dbdict.
                joinedMtables.push(mtables[j]);
                usedTableNames.push(mtables[j]);
                msql += msubsql;
                if (substituteMtable == null) {
                    // Set substitute m table to the database table name.
                    substituteMtable = mtables[j];
                }
            }
        }

        // If no m table can be joined defined in mapped relations, ignore this table
        if (msql.length == 0) {
            continue;
        }

        // If m1 table is not joined, it means that there is no relation with m1 table and another m table is used as substitute m table
        // Try to inner join m1 table and do not append mapped relation condition
        if (!lib.ArrayUtil.contains(joinedMtables, mtable)) {
            msql += "\n  " + innerJoinMainTable(mtable, getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictJSON["tableAliasMap"][substituteMtable]), dbdictJSON["view.table.alias"], dbdictJSON["unique.key.columns"]);
            usedTableNames.push(mtable);
        }
        sql += "\n" + msql;

        if (fieldsResult[1] != null) {
            mtableJSON = fieldsResult[1][dbdicts[i]];
            if (mtableJSON != null) {
                let mtable2;
                for (mtable2 in mtableJSON) {
                    if (!lib.ArrayUtil.contains(joinedMtables, dbdictJSON["tablesMap"][mtable2])) {
                        sql += "\n  " + leftJoinMainTable(dbdictJSON["tablesMap"][mtable2], dbdictJSON["view.table.alias"], getTableSQLAlias(dbdictJSON["view.table.alias"], mtable2), dbdictJSON["unique.key.columns"]);
                    }

                    usedTableNames.push([dbdictJSON["tablesMap"][mtable2]]);
                }
            }
        }

        dbdictUsedAlias = fieldsResult[2][dbdicts[i]];
        if (useAlias && dbdictUsedAlias != null) {
            for (j = 0; j < dbdictUsedAlias.length; j++) {
                let aliasFields = dbdictJSON["tableAliasFieldMap"][dbdictUsedAlias[j]];
                if (aliasFields != null) {
                    let aliasFieldColumns = [];
                    for (k = 0; k < aliasFields.length; k++) {
                        aliasFieldColumns.push(dbdictJSON["fieldsMap"][aliasFields[k]]["sql.column.name"]);
                    }
                    sql += "\n    " + leftJoinAliasTable(dbdictJSON["tablesMap"][dbdictUsedAlias[j]], dbdictJSON["view.table.alias"], getTableSQLAlias(dbdictJSON["view.table.alias"], dbdictUsedAlias[j]),
                        dbdictJSON["unique.key.columns"], aliasFieldColumns, dbtypecode);
                }
            }
        }
    }

    sql = "SELECT " + columnListString + " " + sql;

    var createviewstring = "CREATE OR REPLACE VIEW";
    if (dbtypecode == lib.dbdictHelper.DBTYPECODE("SQLSERVER")) {
        createviewstring = "CREATE VIEW";
    }

    sql = createviewstring + " " + viewName + " AS\n" + sql;

    var wheresql = processWheres(dbdictMapping, wheres, dbtypecode);

    if (wheresql.length > 0) {
        sql += "\n" + wheresql;
    }

    return sql;
}

/**
 *  Parse the database view name from the sql of create view
 */
function parseViewNameFromSQL(sql) {
    if (sql == null) {
        return null;
    }

    var line = sql.split("\n")[0]; // fetch the first line of sql
    // match "create view"
    var regex = /^\s*CREATE\s+VIEW\s+([a-zA-Z0-9_]+)\s+AS.*/i;
    var viewname = line.replace(regex,
        function($1, $2) {
            return $2;
        });

    if (viewname == line) {
        // match "create or replace view"
        var regex2 = /^\s*CREATE\s+OR\s+REPLACE\s+VIEW\s+([a-zA-Z0-9_]+)\s+AS.*/i;
        var viewname2 = line.replace(regex2,
            function($1, $2) {
                return $2;
            });

        viewname = viewname2;
        if (viewname == line) {
            viewname = null;
        }
    }

    return viewname;
}

/**
 *  Return the drop view sql for the view name
 *  Only works for SQL Server
 */
function getDropViewSQL(viewname) {
    if (viewname == null) {
        return null;
    }

    var dbtypecode = lib.dbdictHelper.getDbTypeCode();
    if (dbtypecode == lib.dbdictHelper.DBTYPECODE("SQLSERVER")) {
        return "IF EXISTS (SELECT * FROM SYS.VIEWS WHERE NAME='" + viewname + "' AND SCHEMA_ID=SCHEMA_ID()) DROP VIEW " + viewname;
    }

    return null;
}

/**
 *  Execute the sql to create database view
 */
function executeViewCreateSQL(sql) {
    var viewname = parseViewNameFromSQL(sql); // parse the view name from sql
    if (viewname != null) {
        var dropviewsql = getDropViewSQL(viewname);
        if (dropviewsql != null) {
            print(funcs.scmsg("DB_VIEW_REPORT_DROP_VIEW_INFO", "dbviewreport", [viewname]));
            $("#dataService").executeSQL(dropviewsql);
        }
        print(funcs.scmsg("DB_VIEW_REPORT_CREATE_VIEW_INFO", "dbviewreport", [viewname]));

    } else { // if the view name is not parsed, it means that the sql is not for create view and do not execute the sql
        funcs.msg(funcs.scmsg("DB_VIEW_REPORT_INVALID_CREATE_VIEW_SQL", "dbviewreport"), 3);
        return;
    }

    $("#dataService").executeSQL(sql);
}

/**
 *  Create database view from the report
 */
function createDatabaseView(dbviewreport) {
    if (dbviewreport == null) {
        return;
    }

    var dbtype = lib.dbdictHelper.getDbType();
    if (dbviewreport["sql.db.type"] != dbtype) {
        dbviewreport["sql"] = generateReportViewSQL(dbviewreport);
        dbviewreport["sql.db.type"] = dbtype;
    }

    executeViewCreateSQL(dbviewreport["sql"]);
}

/**
 *  Mass create database views
 *  The parameter report is the list
 */
function massCreateDatabaseView(report) {
    var name = report["name"];
    var rc = report.getFirst();
    while (rc === RC_SUCCESS || rc === true) {
        createDatabaseView(report);
        rc = report.getNext();
    }

    // Locate to the start record.
    rc = report.getFirst();
    while (rc === RC_SUCCESS || rc === true) {
        if (report["name"] == name) {
            break;
        }
        rc = report.getNext();
    }
}

/**
 *  Mass refresh reports
 *  The parameter report is the list
 */
function massRefreshReport(report) {
    var name = report["name"];
    var report_bak;
    var rc = report.getFirst();
    while (rc === RC_SUCCESS || rc === true) {
        report_bak = new SCDatum();
        funcs.fduplicate(report_bak, report);
        refreshFieldNames(report, report_bak);
        report.doUpdate();
        funcs.msg(funcs.scmsg("DB_VIEW_REPORT_MASS_REFRESH_REPORT_UPDATE", "dbviewreport", [report["name"]]), 1);
        rc = report.getNext();
    }

    // Locate to the start record.
    rc = report.getFirst();
    while (rc === RC_SUCCESS || rc === true) {
        if (report["name"] == name) {
            break;
        }
        rc = report.getNext();
    }
}

/**
 *  Convert relation in dbviewreport to JSON array
 */
function formatReportViewRelations(dbviewreport) {
    var sourcedbdicts = dbviewreport["relation.source.dbdict"].toArray();
    var sourcefields = dbviewreport["relation.source.field"].toArray();
    var targetdbdicts = dbviewreport["relation.target.dbdict"].toArray();
    var targetfields = dbviewreport["relation.target.field"].toArray();

    var relations = [];
    var lng = sourcedbdicts.length;
    var i;
    var relation;
    for (i = 0; i < lng; i++) {
        relation = {};
        if (sourcedbdicts[i] == null || sourcedbdicts[i].length == 0 ||
            sourcefields[i] == null || sourcefields[i].length == 0 ||
            targetdbdicts[i] == null || targetdbdicts[i].length == 0 ||
            targetfields[i] == null || targetfields[i].length == 0) {
            continue;
        }

        relation["dbdict1"] = sourcedbdicts[i];
        relation["field1"] = sourcefields[i];
        relation["dbdict2"] = targetdbdicts[i];
        relation["field2"] = targetfields[i];
        relations.push(relation);
    }

    return relations;
}

/**
 *  Format the dbdict-field data from RAD to JS
 */
function formatReportViewDbdictFields(dbviewreport) {
    var fieldDbdictNames = dbviewreport["field.dbdict.name"].toArray();
    var fieldNames = dbviewreport["field.name"].toArray();
    var alternateColumns = dbviewreport["field.alternative"].toArray();
    var fieldUsedArray = dbviewreport["field.used"]; // Do NOT use toArray() as it will convert boolean array to String array

    var dbdictFields = [];
    var lng = fieldDbdictNames.length;
    var i;
    var dbdictField;
    for (i = 0; i < lng; i++) {
        if (!dbviewreport["all.fields.selected"] && !fieldUsedArray[i]) {
            continue;
        }
        dbdictField = [];
        dbdictField.push(fieldDbdictNames[i]);
        dbdictField.push(fieldNames[i]);
        dbdictField.push(alternateColumns[i]);
        dbdictFields.push(dbdictField);
    }

    return dbdictFields;
}

/**
 *  Return the sql to create database view from the report for database view
 */
function generateReportViewSQL(dbviewreport) {
    if (dbviewreport == null) {
        return null;
    }

    return generateViewSQL(dbviewreport["db.view.name"], dbviewreport["dbdict.name"].toArray(), formatReportViewDbdictFields(dbviewreport),
        formatReportViewRelations(dbviewreport), dbviewreport["criteria"], dbviewreport["use.alias.field"]);
}

/**
 *  Return the database view name
 *  Only 0-9, a-z, A-Z, _  are accepted and others are replaced to _
 */
function getDatabaseViewName(name) {
    return "V_" + name.toUpperCase().replace(/\s+/g, "_").replace(/[^0-9a-zA-Z_]+/g, "_");
}

/**
 *  Return the index of the field in the report
 *      -1: does not exist
 *  The parameters fieldDbdictNameArr and fieldNameArr are from the two array fields field.dbdict.name and field.name
 *      must be JS array and assumpt they are the same length
 */
function getFieldIndexInReport(fieldDbdictNameArr, fieldNameArr, dbdictName, fieldName) {
    var lng = fieldDbdictNameArr.length;
    if (lng == 0) {
        return -1;
    }

    var i;
    for (i = 0; i < lng; i++) {
        if (fieldDbdictNameArr[i] == dbdictName && fieldNameArr[i] == fieldName) {
            return i;
        }
    }

    return -1;
}

/**
 *  Check if the field exists in the report: exist - true otherwise false
 *  The parameters fieldDbdictNameArr and fieldNameArr are from the two array fields field.dbdict.name and field.name
 *      must be JS array and assumpt they are the same length
 */
function checkFieldExistInReport(fieldDbdictNameArr, fieldNameArr, dbdictName, fieldName) {
    return getFieldIndexInReport(fieldDbdictNameArr, fieldNameArr, dbdictName, fieldName) >= 0;
}

/**
 *  Refresh the field names
 *  The value of the field field.used is copied from the same field of oldrecord if exists
 *  When oldrecord is null, it equals to add a new report to generate field names.
 */
function refreshFieldNames(record, oldrecord) {
    var dbdicts = record["dbdict.name"];
    if (dbdicts == null) {
        return;
    }

    dbdicts = dbdicts.toArray();
    var lng = dbdicts.length;
    if (lng == 0) {
        return;
    }

    record["field.dbdict.name"] = [];
    record["field.name"] = [];
    record["field.sql.column"] = [];
    record["field.alternative"] = [];
    record["field.used"] = [];
    record["field.alias.table"] = [];

    var oldFieldUsedLng = 0;
    if (oldrecord != null && oldrecord["field.used"] != null && oldrecord["field.name"] != null) {
        oldFieldUsedLng = funcs.lng(oldrecord["field.name"]);
    }

    var dbdictUsed = [];
    var index = 0;
    var i;
    var j;
    var k;
    for (i = 0; i < lng; i++) {
        if (lib.ArrayUtil.contains(dbdictUsed, dbdicts[i])) {
            continue;
        }

        let dbdictJSON = constructDbdictJSON(dbdicts[i]);
        if (dbdictJSON == null) {
            continue;
        }

        dbdictUsed.push(dbdicts[i]);

        let fields = dbdictJSON["fields"];
        if (fields != null) {
            fields.sort(function(f1, f2) {
                return f1["name"].toLowerCase() > f2["name"].toLowerCase();
            });
            let lng2 = fields.length;
            for (j = 0; j < lng2; j++) {
                let alias = fields[j]["sql.table.alias"];

                record["field.dbdict.name"][index] = dbdicts[i];
                record["field.alternative"][index] = "";
                if (lib.ArrayUtil.contains(record["field.sql.column"], fields[j]["sql.column.name"])) { // column is duplicated with the one in another dbdict
                    record["field.alternative"][index] = dbdicts[i].toUpperCase() + "_" + fields[j]["sql.column.name"];
                }
                record["field.name"][index] = fields[j]["name"];
                record["field.sql.column"][index] = fields[j]["sql.column.name"];
                record["field.alias.table"][index] = alias;

                record["field.used"][index] = true;

                // Copy field used value from oldrecord
                for (k = 0; k < oldFieldUsedLng; k++) {
                    if (oldrecord["field.dbdict.name"][k] == dbdicts[i] && oldrecord["field.name"][k] == fields[j]["name"]) {
                        record["field.used"][index] = oldrecord["field.used"][k];
                        break;
                    }
                }

                index++;
            }
        }
    }

    record["dbdict.name"] = dbdictUsed;
}

/**
 *  Update the field names for save
 */
function updateFieldNames(record) {
    var dbdicts = record["dbdict.name"];
    if (dbdicts == null) {
        return;
    }

    dbdicts = dbdicts.toArray();
    var lng = dbdicts.length;
    if (lng == 0) {
        return;
    }

    var oldrecord = new SCDatum();
    funcs.fduplicate(oldrecord, record);

    // check if new dbdict is added
    var fieldDbdictNameArr = record["field.dbdict.name"].toArray();
    var dbdictAdded = false;
    var j;
    for (j = 0; j < dbdicts.length; j++) {
        if (!lib.ArrayUtil.contains(fieldDbdictNameArr, dbdicts[j])) {
            dbdictAdded = true;
            break;
        }
    }

    // if new dbdict is added, invoke refreshFieldNames to fetch field names
    if (dbdictAdded) {
        refreshFieldNames(record, oldrecord);
        return;
    }

    // when dbdict is removed, its field names will not be kept
    record["field.dbdict.name"] = [];
    record["field.name"] = [];
    record["field.sql.column"] = [];
    record["field.alternative"] = [];
    record["field.used"] = [];
    record["field.alias.table"] = [];

    lng = funcs.lng(oldrecord["field.name"]);
    var i;
    for (i = 0; i < lng; i++) {
        if (lib.ArrayUtil.contains(dbdicts, oldrecord["field.dbdict.name"][i])) {
            record["field.dbdict.name"].push(oldrecord["field.dbdict.name"][i]);
            record["field.name"].push(oldrecord["field.name"][i]);
            record["field.sql.column"].push(oldrecord["field.sql.column"][i]);
            record["field.alternative"].push(oldrecord["field.alternative"][i]);
            record["field.used"].push(oldrecord["field.used"][i]);
            record["field.alias.table"].push(oldrecord["field.alias.table"][i]);
        }
    }
}

/**
 *  Invoked by trigger before add to generate report
 */
function triggerReportBeforeAdd(record) {
    triggerFieldNamesBeforeAdd(record);

    if (record["db.view.name"] == null || record["db.view.name"].length == 0) {
        record["db.view.name"] = getDatabaseViewName(record["name"]);
    }

    record["sql"] = generateReportViewSQL(record);
    record["sql.db.type"] = lib.dbdictHelper.getDbType();
}

/**
 *  Invoked by trigger before add to fetch fields information from dbdicts
 */
function triggerFieldNamesBeforeAdd(record) {
    refreshFieldNames(record);
}


/**
 *  Invoked by trigger before add to update report
 */
function triggerReportBeforeUpdate(oldrecord, record) {
    triggerRelationsBeforeUpdate(record);

    if (record["db.view.name"] == null || record["db.view.name"].length == 0) {
        record["db.view.name"] = lib.reportDatabaseView.getDatabaseViewName(record["name"]);
    }

    record["sql"] = generateReportViewSQL(record);
    record["sql.db.type"] = lib.dbdictHelper.getDbType();
}

/**
 *  Invoked by trigger before update to fetch fields information from dbdicts when dbdicts are updated
 */
function triggerFieldNamesBeforeUpdate(oldrecord, record) {
    var olddbdicts = oldrecord["dbdict.name"];
    if (olddbdicts == null) {
        triggerFieldNamesBeforeAdd(record);
        return;
    }

    olddbdicts = olddbdicts.toArray();

    var dbdicts = record["dbdict.name"];
    if (dbdicts == null) {
        return;
    }

    dbdicts = dbdicts.toArray();

    // if the files and their order are not changed, do not refresh field names
    if (lib.ArrayUtil.sameArray(olddbdicts, dbdicts)) {
        return;
    }

    // duplicate the current record as old record to keep the updated values of field selected
    oldrecord = new SCDatum();
    funcs.fduplicate(oldrecord, record);
    refreshFieldNames(record, oldrecord);
}

/**
 *  Invoked by trigger before update to trim empty or duplicated relation lines
 */
function triggerRelationsBeforeUpdate(record) {
    var dbdicts = record["dbdict.name"];
    if (dbdicts == null) {
        return;
    }

    dbdicts = dbdicts.toArray();

    var sourceDbdicts = funcs.denull(record["relation.source.dbdict"]);
    var sourceFields = funcs.denull(record["relation.source.field"]);
    var targetDbdicts = funcs.denull(record["relation.target.dbdict"]);
    var targetFields = funcs.denull(record["relation.target.field"]);

    // no relation is defined
    if (sourceDbdicts == null && sourceFields == null && targetDbdicts == null && targetFields == null) {
        return;
    }

    // at least one field is null
    if (sourceDbdicts == null || sourceFields == null || targetDbdicts == null || targetFields == null) {
        return;
    }

    var sourceDbdictsLng = funcs.lng(sourceDbdicts);

    // when the length of the four arrays are equal
    if (sourceDbdictsLng == funcs.lng(sourceFields) && sourceDbdictsLng == funcs.lng(targetDbdicts) && sourceDbdictsLng == funcs.lng(targetFields)) {
        var definedRelations = [];
        var updatedSourceDbdicts = [];
        var updatedSourceFields = [];
        var updatedTargetDbdicts = [];
        var updatedTargetFields = [];

        var i;
        var sourceField;
        var targetField;
        for (i = 0; i < sourceDbdictsLng; i++) {
            sourceField = $.trim(sourceFields[i]);
            targetField = $.trim(targetFields[i]);

            // empty relation line item
            if ((sourceDbdicts[i] == null || sourceDbdicts[i].length == 0) && (sourceField == null || sourceField.length == 0) &&
                (targetDbdicts[i] == null || targetDbdicts[i].length == 0) && (targetField == null || targetField.length == 0)) {
                continue;
            }

            // check if all fields are defined in this line item
            if (sourceDbdicts[i] != null && sourceDbdicts[i].length > 0 && sourceField != null && sourceField.length > 0 &&
                targetDbdicts[i] != null && targetDbdicts[i].length > 0 && targetField[i] != null && targetField.length > 0) {
                // when the dbdicts in relation are not included in the dbdicts defined in this report, trim them
                // generally happens when dbdicts are changed
                if (!lib.ArrayUtil.contains(dbdicts, sourceDbdicts[i]) || !lib.ArrayUtil.contains(dbdicts, targetDbdicts[i])) {
                    continue;
                }

                // combine this line item to one string
                let relationLine = sourceDbdicts[i] + "|" + sourceField + "|" + targetDbdicts[i] + "|" + targetField;

                // no duplicated relation line item
                if (!lib.ArrayUtil.contains(definedRelations, relationLine)) {
                    // store the line item string
                    definedRelations.push(relationLine);
                    // store every field into the updated array
                    updatedSourceDbdicts.push(sourceDbdicts[i]);
                    updatedSourceFields.push(sourceField);
                    updatedTargetDbdicts.push(targetDbdicts[i]);
                    updatedTargetFields.push(targetField);
                }
            }
        }

        // update to the updated array
        record["relation.source.dbdict"] = updatedSourceDbdicts;
        record["relation.source.field"] = updatedSourceFields;
        record["relation.target.dbdict"] = updatedTargetDbdicts;
        record["relation.target.field"] = updatedTargetFields;
    }
}

/**
 *  Return the array of field names in dbdict, which has SQL Column in database
 */
function getDbdictFieldNamesInDatabase(dbdict, includeAlias) {
    if (dbdict == null) {
        return [];
    }

    var dbdictJSON = constructDbdictJSON(dbdict);
    if (dbdictJSON == null) {
        return [];
    }

    var fields = dbdictJSON["fields"];
    if (fields == null) {
        return [];
    }

    if (includeAlias == null) {
        includeAlias = true;
    }

    var fieldNames = [];
    var lng = fields.length;
    var i;
    for (i = 0; i < lng; i++) {
        if (isAllowedFilterFieldType(fields[i]["type"]) && (includeAlias || fields[i]["sql.table.alias"].indexOf("a") != 0)) {
            fieldNames.push(fields[i]["name"]);
        }
    }

    return fieldNames.sort();
}


/************************************************************************
 **  UI to define criterias
 ************************************************************************/

/**
 *  Return the current maximum ID of compound in the criterias
 *  The ID of compound starts from 0
 *  If there is no compound, return -1
 *  Compound Criteria: [<COMPOUND>, WHERE_COMPOUND_TAG, <id>, <level>]
 *  <COMPOUND> defined in WHERE_COMPOUND_OPERATOR, empty is special - means (
 *  The element of criterias may be a JSON string from an array
 */
function getCriteriaCompoundMaxID(criterias) {
    var max = -1;

    if (criterias == null || criterias.length == 0) {
        return max;
    }

    var id_index = getWhereCriteriaCompoundFieldIndex("id");
    var lng = criterias.length;
    var i;
    for (i = 0; i < lng; i++) {
        let criteria = rteJSONParse(criterias[i]);
        if (criteria == null || criteria.length < 3) {
            continue;
        }

        if (isCriteriaCompound(criteria) && criteria[id_index] != null) {
            let id = criteria[id_index];
            if (max < id) {
                max = id;
            }
        }
    }

    return max;
}

/**
 *  Return the next ID of compound: max id + 1
 */
function getCriteriaCompoundNextID(criterias) {
    var max = getCriteriaCompoundMaxID(criterias);
    return max + 1;
}

/**
 *  Check if the criteria is compound
 *  The criteria may be a JSON string from an array or an array
 */
function isCriteriaCompound(criteria) {
    if (criteria == null) {
        return false;
    }

    var type = funcs.type(criteria);

    var tag_index = getWhereCriteriaCompoundFieldIndex("tag");

    if (type == lib.DataTypeConst.typeCharacter()) {
        var jsCriteria = rteJSONParse(criteria);
        return jsCriteria[tag_index] == WHERE_COMPOUND_TAG;
    } else if (type == lib.DataTypeConst.typeArray()) {
        return criteria[tag_index] == WHERE_COMPOUND_TAG;
    }

    return false;
}

/**
 *  Return if the criteria is the compound CEND
 */
function isCriteriaEndCompound(criteria) {
    if (criteria == null) {
        return false;
    }

    var type = funcs.type(criteria);

    var tag_index = getWhereCriteriaCompoundFieldIndex("tag");
    var logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
    if (type == lib.DataTypeConst.typeCharacter()) {
        var jsCriteria = rteJSONParse(criteria);
        return jsCriteria[tag_index] == WHERE_COMPOUND_TAG && jsCriteria[logic_operator_index] == "CEND";
    } else if (type == lib.DataTypeConst.typeArray()) {
        return criteria[tag_index] == WHERE_COMPOUND_TAG && criteria[logic_operator_index] == "CEND";
    }

    return false;
}

/**
 *  Return the level of the criteria
 */
function getCriteriaLevel(criteria) {
    if (criteria == null) {
        return -1;
    }

    var level_compound_index = getWhereCriteriaCompoundFieldIndex("level");
    var level_filter_index = getWhereCriteriaFilterFieldIndex("level");
    var level = -1;

    var type = funcs.type(criteria);
    if (type == lib.DataTypeConst.typeCharacter()) {
        var jsCriteria = rteJSONParse(criteria);
        level = isCriteriaCompound(jsCriteria) ? jsCriteria[level_compound_index] : jsCriteria[level_filter_index];
    } else if (type == lib.DataTypeConst.typeArray()) {
        level = isCriteriaCompound(criteria) ? criteria[level_compound_index] : criteria[level_filter_index];
    }

    if (level == null) {
        level = -1;
    }

    return level;
}

/**
 *  Return the criteria JSON in the position of the criteria array
 */
function getCriteria(criterias, position) {
    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null || position == null || position < 0 || position >= jsCriterias.lng) {
        return null;
    }

    var criteria = rteJSONParse(jsCriterias[position]);

    return criteria;
}

/**
 *  Return the array containing the compound information.
 *      example: [<isnot>, <CAND or COR>, <id>, <start position>]
 */
function getCriteriaCompoundInformation(criterias, position) {
    var info = [null, null, null, null];

    if (criterias == null || criterias[position] == null) {
        return info;
    }

    var id_index = getWhereCriteriaCompoundFieldIndex("id");
    var logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");

    var criteria = rteJSONParse(criterias[position]);
    if (isCriteriaCompound(criteria)) {
        var id = criteria[id_index];
        if (criteria[logic_operator_index] == "CEND") {
            var i;
            for (i = 0; i < position; i++) {
                if (criterias[i] != null) {
                    let startCriteria = rteJSONParse(criterias[i]);
                    if (isCriteriaCompound(startCriteria)) {
                        if (startCriteria[id_index] == id) {
                            criteria = startCriteria;
                            position = i;
                            break;
                        }
                    }
                }
            }
        }

        if (criteria[logic_operator_index].indexOf("CNOT") >= 0) {
            info[0] = true;
        } else {
            info[0] = false;
        }

        if (info[0] == true) {
            if (criteria[logic_operator_index] != "CNOT") {
                info[1] = criteria[logic_operator_index].substring(0, criteria[logic_operator_index].length - 4); // CANDCNOT or CORCNOT, trim the last CNOT
            }
        } else {
            info[1] = criteria[logic_operator_index];
        }

        info[2] = id;
        info[3] = position;
    }

    return info;
}

/**
 *  Return the index of the next criteria from the current position (do not include the current criteria position)
 */
function getNextCriteriaPosition(criterias, position) {
    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        return -1;
    }

    // Search the next criteria
    var lng = jsCriterias.length;
    var nextPosition = position + 1;
    while (nextPosition < lng && jsCriterias[nextPosition] == null) {
        nextPosition++;
    }

    if (nextPosition < lng) {
        return nextPosition;
    }

    return -1;
}

/**
 *  Return the index of the previous criteria from the current position (include the current criteria position)
 */
function getPreviousCriteriaPosition(criterias, position) {
    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        return -1;
    }

    // Search the previous criteria
    var previousPosition = position;
    while (previousPosition >= 0 && jsCriterias[previousPosition] == null) {
        previousPosition--;
    }

    return previousPosition;
}

/**
 *  Return the assembled criteria compound JSON
 */
function assembleCriteriaCompound(logic_operator, level, id) {
    var criteria = [null, null, null, null];
    criteria[getWhereCriteriaCompoundFieldIndex("tag")] = WHERE_COMPOUND_TAG;
    criteria[getWhereCriteriaCompoundFieldIndex("level")] = level;
    criteria[getWhereCriteriaCompoundFieldIndex("logic_operator")] = logic_operator;
    criteria[getWhereCriteriaCompoundFieldIndex("id")] = id;

    return criteria;
}

/**
 *  Generate the criteria compound group
 *  The group includes two elements stringfied JSON:
 *     #1: Standard compound part stringfy 
 *     #2: CEND part stringfy
 *  Return the criteria compound group
 */
function generateCriteriaCompound(criterias, position, isnot, logic_operator) {
    if (logic_operator == null && (isnot == null || isnot == false)) {
        return [];
    }

    var criteriaGroup = [];
    var nextID = getCriteriaCompoundNextID(criterias);

    var tag_index = getWhereCriteriaCompoundFieldIndex("tag");
    var logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");

    var currentLevel = 0;
    if (criterias[position] != null) {
        var posCriteria = rteJSONParse(criterias[position]);
        var parentLevel = getCriteriaLevel(posCriteria);
        if (posCriteria[tag_index] != WHERE_COMPOUND_TAG || posCriteria[logic_operator_index] == "CEND") {
            currentLevel = parentLevel == -1 ? 0 : parentLevel;
        } else {
            currentLevel = parentLevel == -1 ? 0 : parentLevel + 1;
        }
    }

    var compoundOperator = "";

    if (logic_operator != null) {
        compoundOperator = logic_operator;
    }

    if (isnot == true) {
        compoundOperator += "CNOT";
    }

    var criteria = assembleCriteriaCompound(compoundOperator, currentLevel, nextID);
    criteriaGroup.push(rteJSONStringify(criteria));

    criteria = assembleCriteriaCompound("CEND", currentLevel, nextID);
    criteriaGroup.push(rteJSONStringify(criteria));

    return criteriaGroup;
}

/**
 *  Insert the criteria compound in the position of the criteria array
 *  Return the criteria array after added
 */
function addCriteriaCompound(criterias, position, isnot, logic_operator) {
    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        jsCriterias = [];
    }

    var criteriaGroup = generateCriteriaCompound(jsCriterias, position, isnot, logic_operator);

    if (criteriaGroup.length == 0) {
        return jsCriterias;
    }

    var nextPosition = getNextCriteriaPosition(jsCriterias, position);

    if (jsCriterias[nextPosition] != null) {
        var nextCriteria = rteJSONParse(jsCriterias[nextPosition]);
        if (nextCriteria != null && getCriteriaLevel(nextCriteria) == getCriteriaLevel(criteriaGroup[0])) { // found the criteria in front of which this compound will be inserted
            var logic_operator_index;
            if (isCriteriaCompound(nextCriteria)) {
                logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
                if (nextCriteria[logic_operator_index] == null || nextCriteria[logic_operator_index].length == 0) {
                    nextCriteria[logic_operator_index] = "CAND";
                } else if (nextCriteria[logic_operator_index] == "CNOT") {
                    nextCriteria[logic_operator_index] = "CANDCNOT";
                }
            } else {
                logic_operator_index = getWhereCriteriaFilterFieldIndex("logic_operator");
                if (nextCriteria[logic_operator_index] == null) {
                    nextCriteria[logic_operator_index] = "AND";
                }
            }
            jsCriterias[nextPosition] = rteJSONStringify(nextCriteria);
        }
    }

    criteriaGroup.unshift(position + 1, 0); // Insert the new compound group in the position.
    Array.prototype.splice.apply(jsCriterias, criteriaGroup);

    return jsCriterias;
}

/**
 *  Update the criteria compound in the criteria array
 *  compoundInfo: [<isnot>, <CAND or COR>, <id>, <start position>]
 *  The parameters isnot and logic_operator are the values of the compound to be updated 
 *  Return the updated compound criteria
 */
function updateCriteriaCompound(criterias, compoundInfo, isnot, logic_operator) {
    if (compoundInfo == null || compoundInfo[2] == null || criterias == null) {
        return criterias;
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        return criterias;
    }

    var compoundOperator = "";
    if (logic_operator != null) {
        compoundOperator = logic_operator;
    }

    if (isnot == true) {
        compoundOperator += "CNOT";
    }

    var id_index = getWhereCriteriaCompoundFieldIndex("id");

    var logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");

    var criteria;

    // Update the compound operator directly
    if (jsCriterias[compoundInfo[3]] != null) {
        criteria = rteJSONParse(jsCriterias[compoundInfo[3]]);
        criteria[logic_operator_index] = compoundOperator;
        jsCriterias[compoundInfo[3]] = rteJSONStringify(criteria);
    }

    if (compoundOperator.length == 0) { // The compound actually is removed when remove NOT for the first compound in one level
        var currentCriteria = rteJSONParse(jsCriterias[compoundInfo[3]]);
        var startPosition = compoundInfo[3];
        var endPosition = startPosition + 1;
        var id = compoundInfo[2];
        var lng = jsCriterias.length;
        var i;
        for (i = startPosition + 1; i < lng; i++) { // loop start from the next element of the compound
            criteria = rteJSONParse(jsCriterias[i]);
            if (criteria != null && isCriteriaCompound(criteria) && criteria[id_index] == id) { // If the element is compound and id is matched, the END compound is found
                endPosition = i;
                break;
            }
        }

        var nextPosition = endPosition + 1;
        if (jsCriterias[nextPosition] != null) {
            var nextCriteria = rteJSONParse(jsCriterias[nextPosition]);
            if (nextCriteria != null && getCriteriaLevel(nextCriteria) == getCriteriaLevel(currentCriteria)) { // the next criteria is the same level
                if (startPosition + 1 == endPosition) { // The current compound doesn't have sub criteria
                    jsCriterias.splice(endPosition, 1); // remove the current END compound
                    jsCriterias.splice(startPosition, 1); // remove the current compound
                    if (isCriteriaCompound(nextCriteria)) {
                        var info = getCriteriaCompoundInformation(jsCriterias, startPosition); // get the info of the next criteria
                        jsCriterias = updateCriteriaCompound(jsCriterias, info, nextCriteria[logic_operator_index].indexOf("CNOT") >= 0, null); // Recurve to update the next criteria by set its compound operator to null
                    } else {
                        // update filter, do nothing?
                    }
                } else if (startPosition + 2 == endPosition) {
                    jsCriterias.splice(endPosition, 1); // remove the current END compound
                    var subCriteria = rteJSONParse(jsCriterias[startPosition + 1]); // Process the sub criteria
                    if (subCriteria == null) {
                        jsCriterias.splice(startPosition + 1, 1);
                    } else {
                        var level_index = getWhereCriteriaCompoundFieldIndex("level");
                        subCriteria[level_index] = currentCriteria[level_index]; // Update the sub criteria level to the current criteria
                        jsCriterias[startPosition + 1] = rteJSONStringify(subCriteria);
                    }
                    jsCriterias.splice(startPosition, 1); // remove the current compound
                    // will not impace the next criteria
                } // else, make the operator to empty - means it is a left bracket

            } else { // the next criteria is not the same level
                jsCriterias.splice(endPosition, 1); // remove the current END compound
                jsCriterias.splice(startPosition, 1); // remove the current compound
            }
        } else { // no next criteria
            jsCriterias.splice(endPosition, 1); // remove the current END compound
            jsCriterias.splice(startPosition, 1); // remove the current compound
        }
    }

    return jsCriterias;
}

/**
 *  Remove the criteria compound in the position from the criteria array
 *  If the compound contains sub compound/filter, they are also removed
 *  Remove the criteria array after reomve the compound
 */
function removeCriteriaCompound(criterias, position) {
    var info = getCriteriaCompoundInformation(criterias, position);

    var startPosition = info[3];
    if (startPosition == null) {
        return criterias;
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        return criterias;
    }

    var endPosition = startPosition + 1;

    var id_index = getWhereCriteriaCompoundFieldIndex("id");

    var id = info[2];
    var lng = jsCriterias.length;
    var i;
    for (i = startPosition + 1; i < lng; i++) { // loop to find the END compound
        var criteria = rteJSONParse(jsCriterias[i]);
        if (criteria != null && isCriteriaCompound(criteria) && criteria[id_index] == id) {
            endPosition = i;
            break;
        }
    }

    if (jsCriterias[startPosition] != null) {
        var nextPosition = getNextCriteriaPosition(jsCriterias, endPosition);
        if (nextPosition >= 0) {
            var level = getCriteriaLevel(criteria);
            var nextCriteria = rteJSONParse(jsCriterias[nextPosition]);
            if (nextCriteria != null && getCriteriaLevel(nextCriteria) == level) { // Check if the next criteria is the same level
                var previousPosition = getPreviousCriteriaPosition(jsCriterias, startPosition - 1);
                // When the previous position is minus, it means that the current criteria is the first one
                var previousCriteria = previousPosition >= 0 ? rteJSONParse(jsCriterias[previousPosition]) : null;
                // Check if the previous criteria is the same level. Only when not same level, update the next criteria operator
                // Specially, when this criteria is the first criteria, its previous criteria is null and also update the operator of the next one 
                if (previousCriteria == null || getCriteriaLevel(previousCriteria) != level) {
                    if (isCriteriaCompound(nextCriteria)) {
                        var nextInfo = getCriteriaCompoundInformation(jsCriterias, nextPosition); // get the info of the next criteria
                        var logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
                        jsCriterias = updateCriteriaCompound(jsCriterias, nextInfo, nextCriteria[logic_operator_index].indexOf("CNOT") >= 0, null); // Recurve to update the next criteria by set its compound operator to null
                    } else {
                        var level_index = getWhereCriteriaFilterFieldIndex("level");
                        if (nextCriteria[level_index] != null) { // Set the next filer operator to null
                            nextCriteria[level_index] = null;
                            jsCriterias[nextPosition] = rteJSONStringify(nextCriteria);
                        }
                    }
                }
            }
        }
    }

    jsCriterias.splice(startPosition, endPosition - startPosition + 1); // Remove the current compound

    return jsCriterias;
}

/**
 *  Remove the criteria in the position from the criteria array
 *  Invoke removeCriteriaCompound or removeCriteriaFilter
 *  Return the criteria array after remove the criteria in the position
 **/
function removeCriteria(criterias, position) {
    if (criterias == null) {
        return null;
    }

    var criteria = criterias[position];
    if (isCriteriaCompound(criteria)) {
        return removeCriteriaCompound(criterias, position);
    } else {
        return removeCriteriaFilter(criterias, position);
    }
}

/**
 *  Return the assembled criteria filter JSON
 */
function assembleCriteriaFilter(filename, fieldname, fieldOperator, values, isnot, logic_operator, fieldtype) {
    var filter = [null, null, null, null, null, null, null, null, null];
    filter[getWhereCriteriaFilterFieldIndex("tag")] = WHERE_FILTER_TAG;
    filter[getWhereCriteriaFilterFieldIndex("file_name")] = filename;
    filter[getWhereCriteriaFilterFieldIndex("field_name")] = fieldname;
    filter[getWhereCriteriaFilterFieldIndex("operator")] = fieldOperator;
    filter[getWhereCriteriaFilterFieldIndex("values")] = (fieldOperator == "NULL" || values == null) ? [] : values.toArray();
    filter[getWhereCriteriaFilterFieldIndex("not_operator")] = (isnot == "true" || isnot == true) ? true : false;
    filter[getWhereCriteriaFilterFieldIndex("logic_operator")] = logic_operator;
    filter[getWhereCriteriaFilterFieldIndex("field_type")] = fieldtype;

    return rteJSONStringify(filter);
}

/**
 *  Insert the criteria filter in the position of the criteria array
 *  Return the updated criteria array
 */
function addCriteriaFilter(criterias, position, filter) {
    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        jsCriterias = [];
    }

    var level_index = getWhereCriteriaFilterFieldIndex("level");

    var jsFilter = rteJSONParse(filter);

    if (position == 0 && jsCriterias[position] == null) {
        jsFilter[level_index] = 0;
        jsCriterias.push(rteJSONStringify(jsFilter));
        return jsCriterias;
    }

    // Search the previous criteria
    var previousPosition = getPreviousCriteriaPosition(jsCriterias, position);

    var logic_operator_compound_index = getWhereCriteriaCompoundFieldIndex("logic_operator");

    // Set the level for the current filter
    if (previousPosition < 0) {
        jsFilter[level_index] = 0;
        //jsCriterias.unshift(rteJSONStringify(filter));
    } else {
        var previousCriteria = rteJSONParse(jsCriterias[previousPosition]);
        var previousLevel = getCriteriaLevel(previousCriteria);
        if (!isCriteriaCompound(previousCriteria) || previousCriteria[logic_operator_compound_index] == "CEND") {
            jsFilter[level_index] = previousLevel; // The same level
        } else {
            jsFilter[level_index] = previousLevel + 1; // The previous criteria is the parent of the current filter
        }
    }

    // Search the next criteria
    var nextPosition = getNextCriteriaPosition(jsCriterias, position);

    if (nextPosition >= 0) {
        var nextCriteria = rteJSONParse(jsCriterias[nextPosition]);
        var nextLevel = getCriteriaLevel(nextCriteria);
        if (jsFilter[level_index] == nextLevel) { // The next criteria is the same level as the fitler to insert
            if (isCriteriaCompound(nextCriteria)) {
                if (nextCriteria[logic_operator_compound_index] == null || nextCriteria[logic_operator_compound_index].length == 0) { // When the next compound operator is "(", set its operator to "AND"
                    nextCriteria[logic_operator_compound_index] = "CAND";
                } else if (nextCriteria[logic_operator_compound_index] == "CNOT") { // When the next criteria compound is "NOT" only, set its operator to "AND NOT"
                    nextCriteria[logic_operator_compound_index] = "CANDCNOT";
                }
            } else {
                var logic_operator_filter_index = getWhereCriteriaFilterFieldIndex("logic_operator");
                if (nextCriteria[logic_operator_filter_index] == null || nextCriteria[logic_operator_filter_index].length == 0) { // When there is no operator for the next filter, set its operator to "AND"
                    nextCriteria[logic_operator_filter_index] = "AND";
                }
            }

            jsCriterias[nextPosition] = rteJSONStringify(nextCriteria);
        }
    }

    jsCriterias.splice(position + 1, 0, rteJSONStringify(jsFilter)); // Insert the filter

    return jsCriterias;
}


/**
 *  Update the criteria filter in the position of the criteria array
 *  Return the updated criteria array
 */
function updateCriteriaFilter(criterias, position, filter) {
    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null || jsCriterias[position] == null) {
        return criterias;
    }

    var criteria = rteJSONParse(jsCriterias[position]);
    if (criteria == null) {
        return criterias;
    }

    var jsFilter = rteJSONParse(filter);

    var level = getCriteriaLevel(criteria);

    jsFilter[getWhereCriteriaFilterFieldIndex("level")] = level;

    jsCriterias[position] = rteJSONStringify(jsFilter);

    return jsCriterias;
}


/**
 *  Remove the criteria filter in the position from the criteria array
 *  Need to check if it has the succeeding filter/compound and adjust the logical operator
 *  Return the criteria array after remove the filter.
 */
function removeCriteriaFilter(criterias, position) {
    if (position == null) {
        return criterias;
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        return criterias;
    }

    if (position < 0 || jsCriterias[position] == null) {
        return criterias;
    }

    var jsFilter = rteJSONParse(jsCriterias[position]);
    if (jsFilter == null) {
        return criterias;
    }

    var nextPosition = getNextCriteriaPosition(jsCriterias, position);
    if (nextPosition >= 0) {
        var level = getCriteriaLevel(jsFilter);
        var nextCriteria = rteJSONParse(jsCriterias[nextPosition]);
        if (nextCriteria != null && getCriteriaLevel(nextCriteria) == level) { // Check if the next criteria is the same level
            var previousPosition = getPreviousCriteriaPosition(jsCriterias, position - 1);
            // When the previous position is minus, it means that the current criteria is the first one
            var previousCriteria = previousPosition >= 0 ? rteJSONParse(jsCriterias[previousPosition]) : null;
            // Check if the previous criteria is the same level. Only when not same level, update the next criteria operator
            // Specially, when this criteria is the first criteria, its previous criteria is null and also update the operator of the next one 
            if (previousCriteria == null || getCriteriaLevel(previousCriteria) != level) {
                if (isCriteriaCompound(nextCriteria)) {
                    var nextInfo = getCriteriaCompoundInformation(jsCriterias, nextPosition); // get the info of the next criteria
                    var logic_operator_compound_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
                    jsCriterias = updateCriteriaCompound(jsCriterias, nextInfo, nextCriteria[logic_operator_compound_index].indexOf("CNOT") >= 0, null); // Recurve to update the next criteria by set its compound operator to null
                } else {
                    var logic_operator_filter_index = getWhereCriteriaFilterFieldIndex("logic_operator");
                    if (nextCriteria[logic_operator_filter_index] != null) { // Set the next filer operator to null
                        nextCriteria[logic_operator_filter_index] = null;
                        jsCriterias[nextPosition] = rteJSONStringify(nextCriteria);
                    }
                }
            }
        }
    }

    jsCriterias.splice(position, 1); // Remove the current criteria

    return jsCriterias;
}

/**
 *  Check if the criteria(compound/filter) is the first item of the current level in criterias
 *  Parameter criterias: the array of criterias
 *            position:  the current index in the criterias
 *            current:   whether the current index is used to check. By default, check the current one. Only when it is false, check from its previous index
 */
function isCriteriaFirst(criterias, position, current) {
    if (criterias == null) {
        return true;
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        jsCriterias = [];
    }

    var fromPosition = position;
    if (current == false) {
        fromPosition--;
    }

    var previousPosition = getPreviousCriteriaPosition(jsCriterias, fromPosition);

    if (previousPosition < 0 || (previousPosition == 0 && jsCriterias[previousPosition] == null)) { // When there is no previous criteria, this criteria is the first
        return true;
    }

    if (isCriteriaCompound(jsCriterias[previousPosition])) { // When the previous criteria is compound but not the compound end, this criteria is the first
        var jsCriteria = rteJSONParse(jsCriterias[previousPosition]);
        var logic_operator_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
        if (jsCriteria[logic_operator_index] != "CEND") {
            return true;
        }
    }

    return false;
}

/**
 *  Parse the field SM type to string when the type is accepted to process
 *  Currently four types are accepted: 1, 2, 3, 4
 *                             return: number, character, date, boolean
 */
function parseSMFieldType(type) {
    if (type == null) {
        return type;
    }

    switch (+type) { // Generally the type is passed as String type so process it as number in the function
        case 1:
            return "number";
        case 2:
            return "character";
        case 3:
            return "date";
        case 4:
            return "boolean";
        default:
            return type;
    }
}

/**
 *  Check if the field type is allowed to add as filter
 *  When parsed type is equal to the type, it means that the type is not parsed and return false
 */
function isAllowedFilterFieldType(type) {
    var parsedType = parseSMFieldType(type);
    if (parsedType != type) {
        return true;
    }

    return false;
}

/**
 *  Return the type of the field in the filename
 */
function getSMFieldType(filename, fieldname) {
    var type = lib.tableFunctions.getFieldType(fieldname, filename);

    return parseSMFieldType(type);
}


var WHERE_OPERATOR_DISPLAY = {
    "EQ": funcs.scmsg("eq", "view"),
    "GT": funcs.scmsg("gt", "view"),
    "LT": funcs.scmsg("lt", "view"),
    "GTEQ": funcs.scmsg("gteNum", "view"),
    "LTEQ": funcs.scmsg("lteNum", "view"),
    "EQ_STR": funcs.scmsg("eq", "view"),
    "LIKE": funcs.scmsg("isin", "view"),
    "NULL": funcs.scmsg("null", "view"),
    "EQ_DT": funcs.scmsg("eqDate", "view"),
    "GTEQDT": funcs.scmsg("gteDate", "view"),
    "LTEQDT": funcs.scmsg("lteDate", "view")
};


/**
 *  Return the compare operator list and display list: [[value1, value2, ...], [display1, display2, ...]]
 */
function getCriteriaFilterOperatorList(filename, fieldname, fieldoperator) {
    var operatorListMap = {
        "1": { // number
            "valueList": ["EQ", "GT", "LT", "GTEQ", "LTEQ", "NULL"],
            "displayList": [WHERE_OPERATOR_DISPLAY["EQ"], WHERE_OPERATOR_DISPLAY["GT"], WHERE_OPERATOR_DISPLAY["LT"], WHERE_OPERATOR_DISPLAY["GTEQ"], WHERE_OPERATOR_DISPLAY["LTEQ"], WHERE_OPERATOR_DISPLAY["NULL"]]
        },
        "2": { // character
            "valueList": ["EQ_STR", "LIKE", "NULL"],
            "displayList": [WHERE_OPERATOR_DISPLAY["EQ_STR"], WHERE_OPERATOR_DISPLAY["LIKE"], WHERE_OPERATOR_DISPLAY["NULL"]]
        },
        "3": { // date
            "valueList": ["EQ_DT", "GTEQDT", "LTEQDT", "NULL"],
            "displayList": [WHERE_OPERATOR_DISPLAY["EQ_DT"], WHERE_OPERATOR_DISPLAY["GTEQDT"], WHERE_OPERATOR_DISPLAY["LTEQDT"], WHERE_OPERATOR_DISPLAY["NULL"]]
        },
        "4": { // boolean
            "valueList": ["EQ", "NULL"],
            "displayList": [WHERE_OPERATOR_DISPLAY["EQ"], WHERE_OPERATOR_DISPLAY["NULL"]]
        }
    };

    var type = lib.tableFunctions.getFieldType(fieldname, filename);
    var operatorListJSON = operatorListMap[type];
    if (operatorListJSON == null) {
        // if the field doesn't exist in dbdict, only fetch the field operator display value as list
        if (fieldoperator != null) {
            var operatordisplay = WHERE_OPERATOR_DISPLAY[fieldoperator];
            if (operatordisplay != null) {
                return [
                    [fieldoperator],
                    [operatordisplay]
                ];
            }
        }
        return [
            [],
            []
        ];
    }

    return [operatorListJSON["valueList"], operatorListJSON["displayList"]];
}

/**
 *  Convert the value of the criteria to display string
 */
function getCriteriaFieldValueString(values, type) {
    if (values == null || values.length == 0) {
        return "";
    }

    var value = values[0];
    if (value == null) {
        return "";
    }

    if (type == "character") {
        value = "\"" + value + "\"";
    } else if (type == "date") {
        if (value != "relative") {
            value = "'" + lib.tzFunctions.convertDateStringToLocal(value, 6) + "'"; // Convert the date string (yyyy/mm/dd) to local date string
        } else {
            value = values[1];

            var date_unit = ["Year", "Month", "Day", "Hour", "Minute"];

            var param_num = 0;
            if (values[2] != null) {
                param_num = +values[2];
                param_num = param_num > 5 ? 5 : param_num;
            }

            var i;
            for (i = 0; i < param_num; i++) {
                if (values[i + 3] != null) {
                    value += " " + values[i + 3] + date_unit[i];
                }
            }

            if (param_num > 0) {
                value = "(" + value + ")";
            }
        }
    }

    return value;
}

var CRITERIA_DISPLAY_INDENT_SPACES = 4;

/**
 *  Return the array of the criteria display string list by parsing the array of criteria
 */
function getCriteriaDisplayList(criterias) {
    if (criterias == null) {
        return [];
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }
    if (jsCriterias == null) {
        return [];
    }

    var logic_operator_compound_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
    var level_compound_index = getWhereCriteriaCompoundFieldIndex("level");
    var level_filter_index = getWhereCriteriaFilterFieldIndex("level");
    var logic_operator_filter_index = getWhereCriteriaFilterFieldIndex("logic_operator");
    var not_operator_index = getWhereCriteriaFilterFieldIndex("not_operator");
    var operator_index = getWhereCriteriaFilterFieldIndex("operator");
    var field_name_index = getWhereCriteriaFilterFieldIndex("field_name");
    var values_index = getWhereCriteriaFilterFieldIndex("values");
    var file_name_index = getWhereCriteriaFilterFieldIndex("file_name");
    var field_type_index = getWhereCriteriaFilterFieldIndex("field_type");

    var criteriaDisplayList = [];
    var lng = jsCriterias.length;
    var i;
    for (i = 0; i < lng; i++) {
        let criteria = rteJSONParse(jsCriterias[i]); // parse the string element to JSON object
        if (criteria == null) {
            continue;
        }

        let criteriaDisplay = "";
        let op;
        if (isCriteriaCompound(criteria)) { // Process criteria compound to display
            op = WHERE_COMPOUND_OPERATOR[criteria[logic_operator_compound_index]];
            if (op != null) {
                if (op.length == 0) {
                    op = "(";
                }

                criteriaDisplay += "" + (new Array(criteria[level_compound_index] * CRITERIA_DISPLAY_INDENT_SPACES).join(" ")) + op;
            }
        } else { // Process criteria filter to display
            criteriaDisplay += "" + (new Array(criteria[level_filter_index] * CRITERIA_DISPLAY_INDENT_SPACES).join(" ")); // indent spaces

            if (criteria[logic_operator_filter_index] != null) {
                let logicOp = WHERE_LOGIC_OPERATOR[criteria[logic_operator_filter_index]];
                if (logicOp != null) {
                    criteriaDisplay += logicOp + " "; // logic operator
                }
            }

            if (criteria[not_operator_index] == true) { // NOT operator
                criteriaDisplay += WHERE_LOGIC_OPERATOR["NOT"] + " ";
            }

            criteriaDisplay += "[" + criteria[file_name_index] + "].[" + criteria[field_name_index] + "]"; // <dbdict>.<field>

            op = WHERE_OPERATOR_DISPLAY[criteria[operator_index]];
            if (op == null) {
                op = WHERE_OPERATOR[criteria[operator_index]];
            }

            let values = criteria[values_index];
            if (values.length == 0) {
                criteriaDisplay += " " + op;
            } else {
                criteriaDisplay += " " + op + " " + getCriteriaFieldValueString(values, criteria[field_type_index]);
            }
        }

        criteriaDisplayList.push(criteriaDisplay);
    }

    return criteriaDisplayList;
}


/************************************************************************
 **  Validate in formatctrl
 ************************************************************************/

/**
 *  Used for validation in formatctrl
 *  Parameter file is dbviewreport
 */
function validateRelations(file) {
    if (file == null) {
        return false;
    }

    var dbdicts = file["dbdict.name"];
    if (dbdicts == null) {
        return true;
    }

    dbdicts = dbdicts.toArray();
    if (dbdicts == null || dbdicts.length == 0) {
        return true;
    }

    var fieldDbdictNameArr = file["field.dbdict.name"].toArray();
    var fieldNameArr = file["field.name"].toArray();

    var sourceDbdicts = file["relation.source.dbdict"];
    var sourceFields = file["relation.source.field"];
    var targetDbdicts = file["relation.target.dbdict"];
    var targetFields = file["relation.target.field"];

    var fieldAliasTables = file["field.alias.table"];

    // no relation is defined
    if (sourceDbdicts == null && sourceFields == null && targetDbdicts == null && targetFields == null) {
        return true;
    }

    // at least one field is null
    if (sourceDbdicts == null || sourceFields == null || targetDbdicts == null || targetFields == null) {
        return false;
    }

    var sourceDbdictsLng = funcs.lng(sourceDbdicts);

    // when the lengths of the four arrays are equal
    if (sourceDbdictsLng == funcs.lng(sourceFields) && sourceDbdictsLng == funcs.lng(targetDbdicts) && sourceDbdictsLng == funcs.lng(targetFields)) {

        var i;
        var sourceField;
        var targetField;
        var usedRelDbdicts = [];
        for (i = 0; i < sourceDbdictsLng; i++) {
            sourceField = $.trim(sourceFields[i]);
            targetField = $.trim(targetFields[i]);

            // All fields of this line are empty - empty line, it will be trimmed by trigger automatically
            if ((sourceDbdicts[i] == null || sourceDbdicts[i].length == 0) && (sourceField == null || sourceField.length == 0) &&
                (targetDbdicts[i] == null || targetDbdicts[i].length == 0) && (targetField == null || targetField.length == 0)) {
                continue;
            }

            // check if all fields are defined in this line
            if (sourceDbdicts[i] != null && sourceDbdicts[i].length > 0 && sourceField != null && sourceField.length > 0 &&
                targetDbdicts[i] != null && targetDbdicts[i].length > 0 && targetField != null && targetField.length > 0) {
                // The dbdicts defined in relations do not exist in the dbdicts of this report
                if (!lib.ArrayUtil.contains(dbdicts, sourceDbdicts[i]) || !lib.ArrayUtil.contains(dbdicts, targetDbdicts[i])) {
                    // it will be trimmed by trigger, skip this round of the loop to avoid validate this line.
                    continue;
                }

                // cannot relate the same dbdict itself
                if (sourceDbdicts[i] == targetDbdicts[i]) {
                    funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_DBDICT_SAME", "dbviewreport", [i + 1]), 3);
                    return false;
                }

                let index = getFieldIndexInReport(fieldDbdictNameArr, fieldNameArr, sourceDbdicts[i], sourceField);
                if (index < 0) {
                    funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_SOURCE_FIELD_NOT_EXIST", "dbviewreport", [sourceField, sourceDbdicts[i], i + 1]), 3);
                    return false;
                }
                let aliasTable = fieldAliasTables[index];
                if (aliasTable != null && aliasTable.indexOf("a") == 0) {
                    funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_SOURCE_FIELD_ALIAS_TABLE", "dbviewreport", [sourceField, sourceDbdicts[i], i + 1]), 3);
                    return false;
                }

                index = getFieldIndexInReport(fieldDbdictNameArr, fieldNameArr, targetDbdicts[i], targetField);
                if (index < 0) {
                    funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_TARGET_FIELD_NOT_EXIST", "dbviewreport", [targetField, targetDbdicts[i], i + 1]), 3);
                    return false;
                }
                aliasTable = fieldAliasTables[index];
                if (aliasTable != null && aliasTable.indexOf("a") == 0) {
                    funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_TARGET_FIELD_ALIAS_TABLE", "dbviewreport", [targetField, targetDbdicts[i], i + 1]), 3);
                    return false;
                }

            } else {
                // At least one field is not defined in this line
                funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_FIELD_LACK", "dbviewreport", [i + 1]), 3);
                return false;
            }

            // Record the dbdicts in relations
            lib.ArrayUtil.addAllWithoutDuplicate(usedRelDbdicts, [sourceDbdicts[i], targetDbdicts[i]]);
        }

        // When there are more than one dbdicts, every dbdict must be defined in relations
        // Just warning as it is not an error when add report or update file name 
        if (dbdicts.length > 1 && dbdicts.length != usedRelDbdicts.length) {
            funcs.msg(funcs.scmsg("DB_VIEW_REPORT_RELATIONS_ALL_DBDICT_RELATED", "dbviewreport"), 2);
        }

        // validated
        return true;
    }

    // Not every line define 4 fields
    return false;
}

/**
 *  Validate if one field at least is selected or select all fields checked
 */
function validateFieldNameSelected(file) {
    if (file == null) {
        return false;
    }

    if (file["all.fields.selected"] == true) {
        return true;
    }

    if (file["field.used"] == null) {
        return false;
    }

    var fieldSelectedArr = file["field.used"].toArray();
    if (fieldSelectedArr == null || fieldSelectedArr.length == 0) {
        return false;
    }

    var lng = fieldSelectedArr.length;
    var i;
    for (i = 0; i < lng; i++) {
        if (fieldSelectedArr[i] == "true" || fieldSelectedArr[i] == true) {
            return true;
        }
    }

    return false;
}

/**
 *  Database view name can only use English alphabet characters, number and underline
 */
function validateDatabaseViewName(file) {
    var viewName = file["db.view.name"];
    if (viewName == null || viewName.length == 0) {
        return true;
    }

    var regex = /^\s*[0-9a-zA-Z_]+\s*$/g;

    return regex.test(viewName);
}

/**
 *  Validate the database name meaning
 */
function validateDatabaseViewNameMeaning(file) {
    var viewName = file["db.view.name"];
    if (viewName == null || viewName.length == 0) {
        return true;
    }

    var regex = /^\s*V{0,1}_+\s*$/g;

    return !regex.test(viewName);
}

/**
 *  Validate if there is the empty compound in the filters 
 */
function validateCompoundCriterias(file) {
    var criterias = file["criteria"];
    if (criterias == null) {
        return true;
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }

    if (jsCriterias == null) {
        return true;
    }

    var logic_operator_compound_index = getWhereCriteriaCompoundFieldIndex("logic_operator");
    var id_index = getWhereCriteriaCompoundFieldIndex("id");

    // Locate to the first criteria
    var currentPosition = getNextCriteriaPosition(jsCriterias, -1);
    while (currentPosition >= 0) {
        let jsCriteria = rteJSONParse(jsCriterias[currentPosition]);

        if (isCriteriaCompound(jsCriteria)) {
            let op = jsCriteria[logic_operator_compound_index];
            if (op != null) {
                // When the compound is not END
                // Check if there is filter between this compound and its end compound;
                // If not, skip this compound to its end..
                if (op != "CEND") {
                    let innerCriteriaIncluded = false;
                    let nextPosition = getNextCriteriaPosition(jsCriterias, currentPosition);

                    if (nextPosition >= 0) {
                        let nextCriteria = rteJSONParse(jsCriterias[nextPosition]);
                        // When the next criteria is filter, or the next one is another compound, or the next one is not the next one is not the same compound of CEND
                        // It means that the compound has its inner criteria
                        if (nextCriteria != null && (!isCriteriaCompound(nextCriteria) || nextCriteria[id_index] != jsCriteria[id_index] || nextCriteria[logic_operator_compound_index] != "CEND")) {
                            innerCriteriaIncluded = true;
                        }
                    }

                    if (!innerCriteriaIncluded) {
                        funcs.msg(funcs.scmsg("DB_VIEW_REPORT_FILTERS_COMPOUND_INVALID", "dbviewreport", [currentPosition + 1]), 3);
                        return false;
                    }
                }
            }
        }

        // Locate to the next criteria
        currentPosition = getNextCriteriaPosition(jsCriterias, currentPosition);
    }

    return true;
}

/**
 *  Validate if there is invalid field in the filters 
 */
function validateFilterCriterias(file) {
    var criterias = file["criteria"];
    if (criterias == null) {
        return true;
    }

    var jsCriterias = criterias;
    if (!(jsCriterias instanceof Array)) {
        jsCriterias = criterias.toArray();
    }

    if (jsCriterias == null) {
        return true;
    }

    var fieldDbdictNameArr = file["field.dbdict.name"].toArray();
    var fieldNameArr = file["field.name"].toArray();

    var file_name_filter_index = getWhereCriteriaFilterFieldIndex("file_name");
    var field_name_filter_index = getWhereCriteriaFilterFieldIndex("field_name");

    // Locate to the first criteria
    var currentPosition = getNextCriteriaPosition(jsCriterias, -1);
    while (currentPosition >= 0) {
        let jsCriteria = rteJSONParse(jsCriterias[currentPosition]);

        if (!isCriteriaCompound(jsCriteria)) {
            let filename = jsCriteria[file_name_filter_index];
            let fieldname = jsCriteria[field_name_filter_index];
            if (filename == null || filename.length == 0 || !lib.ArrayUtil.contains(fieldDbdictNameArr, filename)) {
                // file name in filter is not in file name list
                // Just warning as it is not an error when add or update file name
                funcs.msg(funcs.scmsg("DB_VIEW_REPORT_FILTERS_FILTER_DBDICT_INVALID", "dbviewreport", [currentPosition + 1]), 2);
            } else if (fieldname == null || fieldname.length == 0 ||
                !checkFieldExistInReport(fieldDbdictNameArr, fieldNameArr, filename, fieldname)) {
                funcs.msg(funcs.scmsg("DB_VIEW_REPORT_FILTERS_FILTER_FIELD_INVALID", "dbviewreport", [currentPosition + 1]), 3);
                return false;
            }
        }

        // Locate to the next criteria
        currentPosition = getNextCriteriaPosition(jsCriterias, currentPosition);
    }

    return true;
}