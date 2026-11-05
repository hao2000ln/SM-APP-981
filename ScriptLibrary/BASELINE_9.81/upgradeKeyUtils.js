
/**
* Constants for database types
*/
var SQLSERVER = lib.upgradeDatabaseFieldTypeUpdate.DBTYPE("SQLSERVER");
var ORACLE = lib.upgradeDatabaseFieldTypeUpdate.DBTYPE("ORACLE");;
var DB2 = lib.upgradeDatabaseFieldTypeUpdate.DBTYPE("DB2");;
var POSTGRESQL = lib.upgradeDatabaseFieldTypeUpdate.DBTYPE("POSTGRESQL");;


/**
* Constants for key types
*/
var NULLSANDDUPLICATES = 0;
var NONULLS = 4;
var NODUPLICATES = 8;
var UNIQUE = 12;
var PRIMARY = 28;

/**
* Constants for field types
*/
var NUMBER = 1; //lib.DataTypeConst.typeNumber();
var CHARACTER = 2; //lib.DataTypeConst.typeCharacter();
var DATETIME = 3; //lib.DataTypeConst.typeDateTime();
var BOOLEAN = 4; //lib.DataTypeConst.typeBoolean();


/**
* Constants for upper limit of duplicated record to be processed
*/
var MAX_NUMBER = 10000;


//the json structure for the table which contents above one unique key
/**************************************************************
* the json structure keept the table should be:
*
* var tables = 
*	[
*		{	
*			"table_name":"",
*			"unique_key": [
*				{"key_type":"", "key_column":[""]}
*				]
*		}
*	];	
***************************************************************/
var tables = [];


	
/**
* "unique" key includes "unique" key and "no duplicates" key.
* This function is used to find all the tables which content above one "unique" key.
**/
function findTableWithMoreUniqueKey()
{
	var dbdict = new SCFile("dbdict", SCFILE_READONLY);
	var rc = dbdict.doSelect("name~#\"upgrade\"");
	var uniqueKeyCount = 0;
	var keys;
	var uniqueKeys = [];
	
	while(rc == RC_SUCCESS)
	{
		keys = dbdict.key;
		uniqueKeyCount = 0;
		uniqueKeys = [];
		
		var i = 0, iLoopTimes;
		for (i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++)
		{
			if (keys[i].flags == UNIQUE)
			{
				uniqueKeyCount++;
				
				//create an unique_key element
				uniqueKeys.push({"key_type":"unique", "key_column":keys[i].name.toArray()});
			}
			
			if (keys[i].flags == NODUPLICATES)
			{
				uniqueKeyCount++;
			
				//create an unique_key element
				uniqueKeys.push({"key_type":"noduplicated", "key_column":keys[i].name.toArray()});
			}
			
			if (keys[i].flags == PRIMARY)
			{
				uniqueKeyCount++;
			
				//create an unique_key element
				uniqueKeys.push({"key_type":"primary", "key_column":keys[i].name.toArray()});
			}
		}
		
		if(uniqueKeyCount > 1)
		{
			
			tables.push({"table_name":dbdict.name, "unique_key":uniqueKeys});
		}
		
		rc = dbdict.getNext();
	}
	
}


/**
* During upgrading data phase, the records need to be upgraded are kept in upgradeobjects table
*
* This function is used to find all the records in upgradeobjects table which will meet duplicated issue
* because some table contain more than one unique key
*
**/
function scanUpgradeObject()
{
	findTableWithMoreUniqueKey();
	
	//process each table found
	var upgradeobjects = new SCFile("upgradeobjects");
	var oldTable;
	var newTable;
	var sqlQuery;
	
	var i;
	for (i = 0; i < tables.length; i++)
	{
		rc = upgradeobjects.doSelect("object.name#\"" + tables[i].table_name + ",\"");
		
		while(rc == RC_SUCCESS)
		{
			//process the upgradeobject found
			
			oldTable = upgradeobjects.contents[0].table;
			newTable = "upgrade" + oldTable;
			sqlQuery = upgradeobjects.contents[0].query;
			
			scanDuplicatedRecord(oldTable, newTable, sqlQuery);
						
			rc = upgradeobjects.getNext();
		}
	}
	
}


/**
* During upgrading data phase, the Upgrade Utility will copy records from new "upgrade*" table
* into the existing table by the sql condition in table "upgradeobjects"
*
* The sql condition only base on one unique key in the existing table
* if the existing table content above one unique key, 
* the field (which is included in the other unique key) value in the new "upgrade*" table,
* maybe will voilate the unique with the records in the existing table.
*
* This function is used to find the potential duplicated records in the new "upgrade*" table
* according to the table name and sql condition in table "upgradeobjects".
*
* @param {character} oldTable	-  The old existing table name (e.g. inbox)
* @param {character} newTable	-  The new "upgrade*" table name (e.g. upgradeinbox)
* @param {character} oldSql	    -  The sql condition to locate the record in new "upgrade*" table
*	(e.g. container.id=11 and inbox.name="My Open Request" and inbox.type="incidents" and operator.name="%NONE%")
**/
function scanDuplicatedRecord(oldTable, newTable, oldSql)
{
	//process each table found
	var oldObject;
	var newObject;
	var rcOldObject;
	var rcNewObject;
	var uniqueKeys = [];
	
	var i, j;
	
	//retrieve the unique key for the oldTable
	for (i = 0; i < tables.length; i++)
	{
		if (tables[i].table_name == oldTable)
		{
			uniqueKeys = tables[i].unique_key;
			break;
		}
	}
	
	//parse the unique key from the oldSql
	var uniqueKeyInOldSql = parseUniqueKeyFromOldSql(oldSql);
	
	//retieve the records need to be added during upgrading
	oldObject = new SCFile(oldTable);
	newObject = new SCFile(newTable);
	
	rcOldObject = oldObject.doSelect(oldSql);
	rcNewObject = newObject.doSelect(oldSql);
	
	if(rcOldObject == RC_SUCCESS)
	{
		return;
	}		
	
	if(rcNewObject != RC_SUCCESS)
	{	
		return;
	}
	
	//find the unique key which NOT content in oldSql
	for(i = 0; i < uniqueKeys.length; i++)
	{
		if(uniqueKeys[i].key_column.length == uniqueKeyInOldSql.length)
		{
			for(j = 0; j < uniqueKeys[i].key_column.length; j++)
			{
				var found = true;

				if(system.functions.index(uniqueKeys[i].key_column[j], uniqueKeyInOldSql) == 0)
				{
					found = false;
					break;
				}
			}
		}
		else
		{
			found = false;
		}
		
		if(!found)
		{
			newSql = combineEquation(oldTable, uniqueKeys[i].key_column[0], newObject[uniqueKeys[i].key_column[0]]);
			
			for(j = 1; j < uniqueKeys[i].key_column.length; j++)
			{
				newSql += " and " + combineEquation(oldTable, uniqueKeys[i].key_column[j], newObject[uniqueKeys[i].key_column[j]]);
			}
			
			modifyOldTable2AvoidDuplicated(oldTable, newSql, uniqueKeys[i].key_column);
		}
	}
	
}


/**
* This function is used to parse a sql sentence to retrieve the unique key field
*
* @param {character} sql	-  The sql sentence (e.g. object.name="SvcCatInteractionComment" and service.name="ServiceCatalogAPI")
* @return {array}			-  The unique key field array used by the sql (e.g. ["object.name", "service.name"])
**/
function parseUniqueKeyFromOldSql(sql)
{
	if(sql == null)
	{
		return null;
	}
	
	var sqlArray = sql.split(" and ");
	var uniqueKeyInOldSql = new Array(sqlArray.length);
	
	var sqlClause;

	var i;	
	for(i = 0; i < sqlArray.length; i++)
	{
		sqlClause = sqlArray[i];
		uniqueKeyInOldSql[i] = (sqlClause.split('='))[0];
	}
	
	return uniqueKeyInOldSql;
}


/**
* This function is used to combine a field equation according to the field type
* such as user.id=1001 and last.login='14/07/23 16:23:45' and 
*
* @param {character} tableName	-  The table name (e.g. inbox)
* @param {character} fieldName	-  The field name (e.g. inbox.id)
* @param {character} fieldValue	-  The field value (e.g. 1)
**/
function combineEquation(tableName, fieldName, fieldValue)
{
	var equation = "";
	
	if(fieldValue == null || fieldValue == "null")
	{	
		equation = "null(" + fieldName + ")";
		
		return equation;
	}

	//get the column type
	var fDbdict = lib.dbdictHelper.initDbdictFile(tableName);
	var columnType = lib.dbdictHelper.getFieldType(fDbdict, fieldName);
	
	switch (columnType)
	{
		case NUMBER:
        	equation = fieldName + "=" + system.functions.str(fieldValue);
            break;
                    
		case CHARACTER:
        	equation = fieldName + "=\"" + system.functions.str(fieldValue) + "\"";
            break;

		case DATETIME:
        	equation = fieldName + "='" + system.functions.str(fieldValue) + "'";
            break;

		case BOOLEAN:
        	equation = fieldName + "=" + system.functions.str(fieldValue);
            break;
	}
		
	return equation;
}


/**
* In the function scanDuplicatedRecord(), we find the new sql condition according to the other unique key 
* and field value in the new oob "upgrade*" table, 
* then we can check whether there is any record existing in the existing table, which confirms to the sql 
* condition, if found, we have to modify this field value in the existing table to avoid duplicated error.
*
* This function is used to find the records whose field value was occupied alread by the new oob records in the 
* "upgrade*" table, then modify these value in the existing table to avoid duplicated error.
*
* @param {character} oldTable	-  The old table name (e.g. inbox)
* @param {character} newSql	    -  The sql condition to locate the record in new table
*	(e.g. container.id=11 and inbox.name="My Open Request" and inbox.type="incidents" and operator.name="%NONE%")
* @param {character} keyColumnArr	-  The key column array (e.g. [inbox.id])
**/
function modifyOldTable2AvoidDuplicated(oldTable, newSql, keyColumnArr)
{
	var oldObject = new SCFile(oldTable);
	var rc = oldObject.doSelect(newSql);
	
	if(rc != RC_SUCCESS)
	{	
		return;
	}

	//update old object by adding prefix
	var oldColumnValue = oldObject[keyColumnArr[0]];
	
	//get the column type
	var fDbdict = lib.dbdictHelper.initDbdictFile(oldTable);
	var columnType = lib.dbdictHelper.getFieldType(fDbdict, keyColumnArr[0]);
	
	
	//if the column type is datatime or boolean, just ignore this record and return
	if(columnType == DATETIME || columnType == BOOLEAN)
	{	
		lib.upgradeLog.error("file:" + oldTable + ", updated the field " + keyColumnArr[0] + " value failed because the field type is datatime or boolean");
		return;
	}
	
	var currentTime = lib.upgradeCommonLib.formatDate(new Date(),"HHMMssl");
	
	var newColumnValue;
	
	if(columnType == NUMBER)
	{	
		newColumnValue = parseFloat(currentTime + system.functions.str(oldColumnValue));
	}

	if(columnType == CHARACTER)
	{	
		newColumnValue = currentTime + oldColumnValue;
	}
	
	oldObject[keyColumnArr[0]] = newColumnValue;
	
	rc = oldObject.doUpdate();
	
	if(rc == RC_SUCCESS)
	{
		lib.upgradeLog.error("file:" + oldTable + ", updated the field " + keyColumnArr[0] + " value from " + oldColumnValue + " to " + newColumnValue);
	}
	else
	{
		lib.upgradeLog.error("file:" + oldTable + ", updated the field " + keyColumnArr[0] + " value failed because the new value exceeds the field length");
	}
	
}


/**
* Generate the Sql statement in SQL SERVER, this sql is used to find the duplicated record
* the sql sample should like:
*	
*	INSERT INTO DUPRECORDM1 (TABLE_NAME, KEY_NAME, KEY_VALUE, RECORD_NUMBER, PROCESSED) 
*		SELECT 'producttype' as TABLE_NAME, 
*				'category|subcategory|product.type|company' as KEY_NAME, 
*	 			ISNULL(CONVERT(VARCHAR, [CATEGORY]), 'null') 
*	 			+ '|' + ISNULL(CONVERT(VARCHAR, [SUBCATEGORY]), 'null') 
*	 			+ '|' + ISNULL(CONVERT(VARCHAR, [PRODUCT_TYPE]), 'null') 
*	 			+ '|' + ISNULL(CONVERT(VARCHAR, [COMPANY]), 'null')  as KEY_VALUE, 
*				M1.CNT as RECORD_NUMBER, 
*				'f' as PROCESSED 
*		FROM 
*			(SELECT [CATEGORY], [SUBCATEGORY], [PRODUCT_TYPE], [COMPANY], COUNT(*) as CNT 
*			FROM PRODUCTTYPEM1
*			GROUP BY [CATEGORY], [SUBCATEGORY], [PRODUCT_TYPE], [COMPANY]
*			HAVING COUNT(*) > 1) M1 
* 
* @param {character} fileName	-  The table name (e.g. producttype)
* @param {structure} uniqueKey	-  The unique key
**/
function constructInsertSql4SqlServer(fileName, uniqueKey)
{
	var insertSelect = "INSERT INTO DUPRECORDM1 (TABLE_NAME, KEY_NAME, KEY_VALUE, RECORD_NUMBER, PROCESSED) \n";
	var selectTable = "SELECT '" + fileName + "' as TABLE_NAME, \n";
	
	var keyFieldUseAsConstStr;
	var keyFieldInConvert;
	var keyFieldInSearch;
	
	var wholeSql;
	
	if (uniqueKey.flags != UNIQUE && uniqueKey.flags != NODUPLICATES && uniqueKey.flags != PRIMARY)
	{
		return;
	}
			
	var fFile = new SCFile("dbdict");
	var rcfFile = fFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfFile != RC_SUCCESS)
	{
		return;
	}	
		
	var fUpgFile = new SCFile("upgradedbdict");
	var rcfUpgFile = fUpgFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfUpgFile != RC_SUCCESS)
	{
		return;
	}
	
	var fields = fFile.field;
	var uniqueKeyFields = uniqueKey.name.toArray();
	var sqlTables = fFile.sql_tables;
	
	var sqlTableName;
	var sqlTableAlias;
	
	var foundIndex = -1;
		
	var i, iLoopTimes, j, jLoopTimes;
	for (i = 0; i < uniqueKeyFields.length; i++)
	{
		//find the fields mapping info
		foundIndex = -1;
	
		for (j = 0, jLoopTimes = fields.length(); j < jLoopTimes; j++)
		{
			//find the fields mapping info
			if (uniqueKeyFields[i] == fields[j].name)
			{
				foundIndex = j;
				break;
			}
		}
			
		if(foundIndex == -1)
		{
			continue;
		}
			
		if(keyFieldUseAsConstStr == null || keyFieldUseAsConstStr == "")
		{
			keyFieldUseAsConstStr = "'" + fields[foundIndex].name;
			keyFieldInConvert = " ISNULL(CONVERT(VARCHAR(255), [" + fields[foundIndex].sql_field_options.sql_column_name + "]), 'null') ";
			keyFieldInSearch = "[" + fields[foundIndex].sql_field_options.sql_column_name + "]";
			
			//retrieve the table alias in Oracle
			sqlTableAlias = fields[foundIndex].sql_table_alias;
		}
		else
		{
			keyFieldUseAsConstStr += "|" + fields[foundIndex].name;
			keyFieldInConvert += "\n + '|' + ISNULL(CONVERT(VARCHAR(255), [" + fields[foundIndex].sql_field_options.sql_column_name + "]), 'null') ";
			keyFieldInSearch += ", [" + fields[foundIndex].sql_field_options.sql_column_name + "]";
		}
				
	}
		
	//retrieve the table name by the uniqueKeyfields
	for (i = 0, iLoopTimes = sqlTables.length(); i < iLoopTimes; i++)
	{
		if (sqlTables[i].sql_table_alias == sqlTableAlias)
		{			
			sqlTableName = sqlTables[i].sql_table_name;
		}
	}
		
	wholeSql = insertSelect + selectTable 
			+ keyFieldUseAsConstStr + "' as KEY_NAME, \n" 
			+ keyFieldInConvert + " as KEY_VALUE, \n" 
			+ "M1.CNT as RECORD_NUMBER, \n"
			+ "'f' as PROCESSED \n"
			+ "FROM \n"
			+ "(SELECT " + keyFieldInSearch + ", COUNT(*) as CNT \n"
			+ "FROM " + sqlTableName + "\n"
			+ "GROUP BY " + keyFieldInSearch + "\n"
			+ " HAVING COUNT(*) > 1) M1 \n";
	
	return wholeSql;
}


/**
* Generate the Sql statement in ORACLE, this sql is used to find the duplicated record
* the sql sample should like:
*
*	INSERT INTO DUPRECORDM1 (TABLE_NAME, KEY_NAME, KEY_VALUE, RECORD_NUMBER, PROCESSED) 
*		SELECT 'producttype' as TABLE_NAME, 
*				'category|subcategory|product.type|company' as KEY_NAME, 
*	 			NVL(TO_CHAR("CATEGORY"), 'null') 
*	 			 || '|' || NVL(TO_CHAR("SUBCATEGORY"), 'null') 
*	 			 || '|' || NVL(TO_CHAR("PRODUCT_TYPE"), 'null') 
*				 || '|' || NVL(TO_CHAR("COMPANY"), 'null')  as KEY_VALUE, 
*				M1.CNT as RECORD_NUMBER, 
*				'f' as PROCESSED 
*		FROM 
*		(SELECT "CATEGORY", "SUBCATEGORY", "PRODUCT_TYPE", "COMPANY", COUNT(*) as CNT 
*			FROM PRODUCTTYPEM1
*			GROUP BY "CATEGORY", "SUBCATEGORY", "PRODUCT_TYPE", "COMPANY"
*			HAVING COUNT(*) > 1) M1 
* 
* @param {character} fileName	-  The table name (e.g. producttype)
* @param {structure} uniqueKey	-  The unique key
**/
function constructInsertSql4Oracle(fileName, uniqueKey)
{
	var insertSelect = "INSERT INTO DUPRECORDM1 (TABLE_NAME, KEY_NAME, KEY_VALUE, RECORD_NUMBER, PROCESSED) \n";
	var selectTable = "SELECT '" + fileName + "' as TABLE_NAME, \n";
	
	var keyFieldUseAsConstStr;
	var keyFieldInConvert;
	var keyFieldInSearch;
	
	var wholeSql;
	
	if (uniqueKey.flags != UNIQUE && uniqueKey.flags != NODUPLICATES && uniqueKey.flags != PRIMARY)
	{
		return;
	}
			
	var fFile = new SCFile("dbdict");
	var rcfFile = fFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfFile != RC_SUCCESS)
	{
		return;
	}	
		
	var fUpgFile = new SCFile("upgradedbdict");
	var rcfUpgFile = fUpgFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfUpgFile != RC_SUCCESS)
	{
		return;
	}
	
	var fields = fFile.field;
	var uniqueKeyFields = uniqueKey.name.toArray();
	var sqlTables = fFile.sql_tables;
	
	var sqlTableName;
	var sqlTableAlias;
	
	var foundIndex = -1;
		
	var i, iLoopTimes, j, jLoopTimes;
	for (i = 0; i < uniqueKeyFields.length; i++)
	{
		//find the fields mapping info
		foundIndex = -1;
	
		for (j = 0, jLoopTimes = fields.length(); j < jLoopTimes; j++)
		{
			//find the fields mapping info
			if (uniqueKeyFields[i] == fields[j].name)
			{
				foundIndex = j;
				break;
			}
		}
			
		if(foundIndex == -1)
		{
			continue;
		}
			
		if(keyFieldUseAsConstStr == null || keyFieldUseAsConstStr == "")
		{
			keyFieldUseAsConstStr = "'" + fields[foundIndex].name;
			keyFieldInConvert = " NVL(TO_CHAR(\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"), 'null') ";
			keyFieldInSearch = "\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"";
			
		
			//retrieve the table alias in Oracle
			sqlTableAlias = fields[foundIndex].sql_table_alias;
		}
		else
		{
			keyFieldUseAsConstStr += "|" + fields[foundIndex].name;
			keyFieldInConvert += "\n || '|' || NVL(TO_CHAR(\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"), 'null') ";
			keyFieldInSearch += ", \"" + fields[foundIndex].sql_field_options.sql_column_name + "\"";
		}
				
	}
	
	//retrieve the table name by the uniqueKeyfields
	for (i = 0, iLoopTimes = sqlTables.length(); i < iLoopTimes; i++)
	{
		if (sqlTables[i].sql_table_alias == sqlTableAlias)
		{			
			sqlTableName = sqlTables[i].sql_table_name;
		}
	}
		
	wholeSql = insertSelect + selectTable 
			+ keyFieldUseAsConstStr + "' as KEY_NAME, \n" 
			+ keyFieldInConvert + " as KEY_VALUE, \n" 
			+ "M1.CNT as RECORD_NUMBER, \n"
			+ "'f' as PROCESSED \n"
			+ "FROM \n"
			+ "(SELECT " + keyFieldInSearch + ", COUNT(*) as CNT \n"
			+ "FROM " + sqlTableName + "\n"
			+ "GROUP BY " + keyFieldInSearch + "\n"
			+ " HAVING COUNT(*) > 1) M1 \n";
	
	return wholeSql;
}


/**
* Generate the Sql statement in DB2, this sql is used to find the duplicated record
* the sql sample should like:
*
*	INSERT INTO DUPRECORDM1 (TABLE_NAME, KEY_NAME, KEY_VALUE, RECORD_NUMBER, PROCESSED) 
*		SELECT 'producttype' as TABLE_NAME, 
*				'category|subcategory|product.type|company' as KEY_NAME, 
*	 			VALUE(CHAR("CATEGORY"), 'null') 
*	 			 || '|' || VALUE(CHAR("SUBCATEGORY"), 'null') 
*	 			 || '|' || VALUE(CHAR("PRODUCT_TYPE"), 'null') 
*				 || '|' || VALUE(CHAR("COMPANY"), 'null')  as KEY_VALUE, 
*				M1.CNT as RECORD_NUMBER, 
*				'f' as PROCESSED 
*		FROM 
*		(SELECT "CATEGORY", "SUBCATEGORY", "PRODUCT_TYPE", "COMPANY", COUNT(*) as CNT 
*			FROM PRODUCTTYPEM1
*			GROUP BY "CATEGORY", "SUBCATEGORY", "PRODUCT_TYPE", "COMPANY"
*			HAVING COUNT(*) > 1) M1
* 
* @param {character} fileName	-  The table name (e.g. producttype)
* @param {structure} uniqueKey	-  The unique key
**/
function constructInsertSql4DB2(fileName, uniqueKey)
{
	var insertSelect = "INSERT INTO DUPRECORDM1 (TABLE_NAME, KEY_NAME, KEY_VALUE, RECORD_NUMBER, PROCESSED) \n";
	var selectTable = "SELECT '" + fileName + "' as TABLE_NAME, \n";
	
	var keyFieldUseAsConstStr;
	var keyFieldInConvert;
	var keyFieldInSearch;
	
	var wholeSql;
	
	if (uniqueKey.flags != UNIQUE && uniqueKey.flags != NODUPLICATES && uniqueKey.flags != PRIMARY)
	{
		return;
	}
			
	var fFile = new SCFile("dbdict");
	var rcfFile = fFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfFile != RC_SUCCESS)
	{
		return;
	}	
		
	var fUpgFile = new SCFile("upgradedbdict");
	var rcfUpgFile = fUpgFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfUpgFile != RC_SUCCESS)
	{
		return;
	}
	
	var fields = fFile.field;
	var uniqueKeyFields = uniqueKey.name.toArray();
	var sqlTables = fFile.sql_tables;
	
	var sqlTableName;
	var sqlTableAlias;
	
	var foundIndex = -1;
		
	var i, iLoopTimes, j, jLoopTimes;
	for (i = 0; i < uniqueKeyFields.length; i++)
	{
		//find the fields mapping info
		foundIndex = -1;
	
		for (j = 0, jLoopTimes = fields.length(); j < jLoopTimes; j++)
		{
			//find the fields mapping info
			if (uniqueKeyFields[i] == fields[j].name)
			{
				foundIndex = j;
				break;
			}
		}
			
		if(foundIndex == -1)
		{
			continue;
		}
			
		if(keyFieldUseAsConstStr == null || keyFieldUseAsConstStr == "")
		{
			keyFieldUseAsConstStr = "'" + fields[foundIndex].name;
			keyFieldInConvert = " VALUE(CHAR(\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"), 'null') ";
			keyFieldInSearch = "\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"";
			
		
			//retrieve the table alias in Oracle
			sqlTableAlias = fields[foundIndex].sql_table_alias;
		}
		else
		{
			keyFieldUseAsConstStr += "|" + fields[foundIndex].name;
			keyFieldInConvert += "\n || '|' || VALUE(CHAR(\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"), 'null') ";
			keyFieldInSearch += ", \"" + fields[foundIndex].sql_field_options.sql_column_name + "\"";
		}
				
	}
	
	//retrieve the table name by the uniqueKeyfields
	for (i = 0, iLoopTimes = sqlTables.length(); i < iLoopTimes; i++)
	{
		if (sqlTables[i].sql_table_alias == sqlTableAlias)
		{			
			sqlTableName = sqlTables[i].sql_table_name;
		}
	}
		
	wholeSql = insertSelect + selectTable 
			+ keyFieldUseAsConstStr + "' as KEY_NAME, \n" 
			+ keyFieldInConvert + " as KEY_VALUE, \n" 
			+ "M1.CNT as RECORD_NUMBER, \n"
			+ "'f' as PROCESSED \n"
			+ "FROM \n"
			+ "(SELECT " + keyFieldInSearch + ", COUNT(*) as CNT \n"
			+ "FROM " + sqlTableName + "\n"
			+ "GROUP BY " + keyFieldInSearch + "\n"
			+ " HAVING COUNT(*) > 1) M1 \n";
	
	return wholeSql;
}

/**
* Generate the Sql statement in POSTGRESQL, this sql is used to find the duplicated record
* the sql sample should like:
*
*	INSERT INTO DUPRECORDM1 ("TABLE_NAME", "KEY_NAME", "KEY_VALUE", "RECORD_NUMBER", "PROCESSED") 
*		SELECT 'producttype' as "TABLE_NAME", 
*				'category|subcategory|product.type|company' as "KEY_NAME", 
*	 			COALESCE(CAST("CATEGORY" AS TEXT), 'null') 
*	 			 || '|' || COALESCE(CAST("SUBCATEGORY" AS TEXT), 'null') 
*	 			 || '|' || COALESCE(CAST("PRODUCT_TYPE" AS TEXT), 'null') 
*				 || '|' || COALESCE(CAST("COMPANY" AS TEXT), 'null')  as "KEY_VALUE", 
*				M1."CNT" as "RECORD_NUMBER", 
*				'f' as "PROCESSED" 
*		FROM 
*		(SELECT "CATEGORY", "SUBCATEGORY", "PRODUCT_TYPE", "COMPANY", COUNT(*) as "CNT" 
*			FROM PRODUCTTYPEM1
*			GROUP BY "CATEGORY", "SUBCATEGORY", "PRODUCT_TYPE", "COMPANY"
*			HAVING COUNT(*) > 1) M1 
* 
* @param {character} fileName	-  The table name (e.g. producttype)
* @param {structure} uniqueKey	-  The unique key
**/
function constructInsertSql4POSTGRESQL(fileName, uniqueKey) {
    var insertSelect = "INSERT INTO DUPRECORDM1 (\"TABLE_NAME\", \"KEY_NAME\", \"KEY_VALUE\", \"RECORD_NUMBER\", \"PROCESSED\") \n";
	var selectTable = "SELECT '" + fileName + "' as \"TABLE_NAME\", \n";
	
	var keyFieldUseAsConstStr;
	var keyFieldInConvert;
	var keyFieldInSearch;
	
	var wholeSql;
	
	if (uniqueKey.flags != UNIQUE && uniqueKey.flags != NODUPLICATES && uniqueKey.flags != PRIMARY)
	{
		return;
	}
			
	var fFile = new SCFile("dbdict");
	var rcfFile = fFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfFile != RC_SUCCESS)
	{
		return;
	}	
		
	var fUpgFile = new SCFile("upgradedbdict");
	var rcfUpgFile = fUpgFile.doSelect("name=\"" + fileName + "\"");
	
	if(rcfUpgFile != RC_SUCCESS)
	{
		return;
	}
	
	var fields = fFile.field;
	var uniqueKeyFields = uniqueKey.name.toArray();
	var sqlTables = fFile.sql_tables;
	
	var sqlTableName;
	var sqlTableAlias;
	
	var foundIndex = -1;
		
	var i, iLoopTimes, j, jLoopTimes;
	for (i = 0; i < uniqueKeyFields.length; i++)
	{
		//find the fields mapping info
		foundIndex = -1;
	
		for (j = 0, jLoopTimes = fields.length(); j < jLoopTimes; j++)
		{
			//find the fields mapping info
			if (uniqueKeyFields[i] == fields[j].name)
			{
				foundIndex = j;
				break;
			}
		}
			
		if(foundIndex == -1)
		{
			continue;
		}
			
		if(keyFieldUseAsConstStr == null || keyFieldUseAsConstStr == "")
		{
			keyFieldUseAsConstStr = "'" + fields[foundIndex].name;
			keyFieldInConvert = " COALESCE(CAST(\"" + fields[foundIndex].sql_field_options.sql_column_name + "\" AS TEXT), 'null') ";
			keyFieldInSearch = "\"" + fields[foundIndex].sql_field_options.sql_column_name + "\"";
			
		
			//retrieve the table alias in Oracle
			sqlTableAlias = fields[foundIndex].sql_table_alias;
		}
		else
		{
			keyFieldUseAsConstStr += "|" + fields[foundIndex].name;
			keyFieldInConvert += "\n || '|' || COALESCE(CAST(\"" + fields[foundIndex].sql_field_options.sql_column_name + "\" AS TEXT), 'null') ";
			keyFieldInSearch += ", \"" + fields[foundIndex].sql_field_options.sql_column_name + "\"";
		}
				
	}
	
	//retrieve the table name by the uniqueKeyfields
	for (i = 0, iLoopTimes = sqlTables.length(); i < iLoopTimes; i++)
	{
		if (sqlTables[i].sql_table_alias == sqlTableAlias)
		{			
			sqlTableName = sqlTables[i].sql_table_name;
		}
	}
		
	wholeSql = insertSelect + selectTable 
			+ keyFieldUseAsConstStr + "' as \"KEY_NAME\", \n" 
			+ keyFieldInConvert + " as \"KEY_VALUE\", \n" 
			+ "M1.\"CNT\" as \"RECORD_NUMBER\", \n"
			+ "'f' as \"PROCESSED\" \n"
			+ "FROM \n"
			+ "(SELECT " + keyFieldInSearch + ", COUNT(*) as \"CNT\" \n"
			+ "FROM " + sqlTableName + "\n"
			+ "GROUP BY " + keyFieldInSearch + "\n"
			+ " HAVING COUNT(*) > 1) M1 \n";
	
	return wholeSql;
}


/**
* Execute the Sql statement on the unique key, this sql is used to find the duplicated record
* the Sql statement is generate by function constructInsertSelectSql()
*
* @param {character} sqlStatement	-  The sql statement 
**/
function executeInsertSelectSql(sqlStatement)
{
	var names = new SCDatum();
	var values = new SCDatum(); 		
		
	names.push("values"); 		  	
	values.push([sqlStatement, "commit"]); 
		
	system.functions.rtecall("callrad", new SCDatum(), "SQLexecute", names, values, false);
}



/**
* Process the duplicated record in the result table "dupRecord"
* 
* To process the duplicated error, we can add prefix to the first field depending on its type
*									number: add 99900000
*									string: add dup
*
* @param {character} fileName	-  The table name (e.g. producttype)
* @param {structure} uniqueKey	-  The unique key
* @param {structure} ignoreUpperLimit	-  The symbol whether to proces the duplicated record 
*                                          when its number above the upper limit.
**/
function processDupRecord(fileName, uniqueKey, ignoreUpperLimit)
{
	var fDupRecord = new SCFile("dupRecord");
	var query = "table.name=\"" + fileName + "\" and processed = false";
	var count = fDupRecord.doCount(query);
	
	if(count > 0)
	{
		lib.upgradeLog.upgrade("Process duplicated key issue for the file:" + fileName + ", unique key: {" + uniqueKey.name.toArray() + "}");
		lib.upgradeLog.detail("Process duplicated key issue for the file:" + fileName + ", unique key: {" + uniqueKey.name.toArray() + "}");
	}	
	
	var rc = fDupRecord.doSelect(query);
	
	var keyNameArr = [];
	var keyValueArr = [];
	
	var fDbdict;
	var columnType;
	
	var fFile;
	var tmpKeyValue;
	var currentTime;
	var lastPrefix = "";
	
	query = "";
	
	var ind;
	for (ind = 0; ind < count && rc == RC_SUCCESS; ind++)
	{
		keyNameArr = (fDupRecord.key_name).split('|');
		keyValueArr = (fDupRecord.key_value).split('|');

		if (ignoreUpperLimit == null || ignoreUpperLimit == false)
		{
			if (fDupRecord.record_number > MAX_NUMBER)
			{
				lib.upgradeLog.upgrade("The duplicated number of the unique key: {" + keyNameArr + "} and unique key value: {" + keyValueArr + "} exceed the upper limit " + MAX_NUMBER);
				lib.upgradeLog.detail("The duplicated number of the unique key: {" + keyNameArr + "} and unique key value: {" + keyValueArr + "} exceed the upper limit " + MAX_NUMBER);
				rc = fDupRecord.getNext();
				continue;
			}
		}
		
		//get the column type
		fDbdict = lib.dbdictHelper.initDbdictFile(fileName);
		columnType = lib.dbdictHelper.getFieldType(fDbdict, keyNameArr[0]);
		
		//if the column type is datatime or boolean, just ignore this record and return
		if(columnType == DATETIME || columnType == BOOLEAN)
		{	
			lib.upgradeLog.error("file:" + fileName + ", updated the field " + keyNameArr[0] + " value failed because the field type is datatime or boolean");
			rc = fDupRecord.getNext();
			continue;
		}
		
		//get the select query
		query = combineEquation(fileName, keyNameArr[0], keyValueArr[0]);

		var i;		
		for (i = 1; i < keyNameArr.length; i++)
		{
			query += " and " + combineEquation(fileName, keyNameArr[i], keyValueArr[i]);
		}
		
		fFile = new SCFile(fileName);
		rc = fFile.doSelect(query);
		
		while(rc == RC_SUCCESS)
		{
			currentTime = lib.upgradeCommonLib.formatDate(new Date(),"HHMMssl");
			
			while(lastPrefix == currentTime)
			{
				currentTime = lib.upgradeCommonLib.formatDate(new Date(),"HHMMssl");
			}
			
			lastPrefix = currentTime;
			
			if(columnType == NUMBER)
			{
				if (keyValueArr[0] == "null")
				{
					tmpKeyValue = 0;
				}
				else
				{
					tmpKeyValue = keyValueArr[0];
				}
		
				tmpKeyValue = parseFloat(currentTime + system.functions.str(tmpKeyValue));
			}
			
			if(columnType == CHARACTER)
			{
				if (keyValueArr[0] == "null")
				{
					tmpKeyValue = "";
				}
				else
				{
					tmpKeyValue = keyValueArr[0];
				}
		
				tmpKeyValue = currentTime + tmpKeyValue;
			
			}
			
			fFile[keyNameArr[0]] = tmpKeyValue;
			
			rc = fFile.doUpdate();
			
			if(rc == RC_SUCCESS)
			{
				lib.upgradeLog.detail("file:" + fileName + ", updated the field " + keyNameArr[0] + " value from " + keyValueArr[0] + " to " + tmpKeyValue);
			}
			else
			{
				lib.upgradeLog.error("file:" + fileName + ", updated the field " + keyNameArr[0] + " value failed because the new value exceeds the field length");
			}
			
			rc = fFile.getNext();
		}
	
		//modify the process signal as true.				
		fDupRecord.processed = true;
	
		fDupRecord.doUpdate();

		rc = fDupRecord.getNext();
	}

}


/**
* During Upgrade Utility, some unique key will be updated
* As to each table, we have take this action: 
*		1. find the duplicated record
*		2. save the duplicated record into table "duprecord"
*		3. process the duplicated record in table "duprecord"
*
* @param {structure} oldfile	-  The dbdict record
* @param {structure} newUniqueKey	-  The unique key to be added
* @param {structure} ignoreUpperLimit	-  The symbol whether to proces the duplicated record 
*                                          when its number above the upper limit.
**/
function fixIssueBeforeUpdateUniqueKey(oldfile, newUniqueKey, ignoreUpperLimit)
{
	//check the key is a unique key
	var oriKeyFlag = newUniqueKey.flags;
	if (oriKeyFlag != UNIQUE && oriKeyFlag != NODUPLICATES && oriKeyFlag != PRIMARY)
	{
		return;
	}
		
	//check the database type
	var dataType = lib.upgradeDatabaseFieldTypeUpdate.getDbType() ;
	
	//if(dataType == DB2)
	//	return;
	
	//create a temp key just for performence
	var hasAddedTempKey;
	
	//check whether this uniqueKey exist in the current table
	if(findKeyIndex(oldfile.key, newUniqueKey.name.toArray()) == -1)
	{
		newUniqueKey.flags = 0;
	
		oldfile.key.push(newUniqueKey);
		oldfile.doUpdate();
	
		hasAddedTempKey = true;
	}
		
	var sql = null;
	newUniqueKey.flags = oriKeyFlag;
	
	switch (dataType) {
	    case SQLSERVER:
	        sql = constructInsertSql4SqlServer(oldfile.name, newUniqueKey);
	        break;
	    case ORACLE:
	        sql = constructInsertSql4Oracle(oldfile.name, newUniqueKey);
	        break;
	    case DB2:
	        sql = constructInsertSql4DB2(oldfile.name, newUniqueKey);
	        break;
	    case POSTGRESQL:
	        sql = constructInsertSql4POSTGRESQL(oldfile.name, newUniqueKey);
	        break;
	    default:
	        break;
	}
	
	if (sql == null || sql == "") {
	    return false;
	}
	
	executeInsertSelectSql(sql);
	vars.$G_fix_duplicate_key = system.functions.nullsub(vars.$G_fix_duplicate_key
	                              , lib.upgradeConfiguration.isFixDuplicateKey());
	if (vars.$G_fix_duplicate_key) {
	    processDupRecord(oldfile.name, newUniqueKey, ignoreUpperLimit);
	}
	
	//remove the temp key just for performence
	if(hasAddedTempKey)
	{
		oldfile.key = system.functions._delete(oldfile.key, oldfile.key.length());
		oldfile.doUpdate();
	}
	
	return isDupRecordProcessed(oldfile.name, newUniqueKey);
}

function isDupRecordProcessed(table, uniqueKey) {
    var uniqueKeyFields = uniqueKey.name.toArray();
    var uniqueKeyName = constructDupRecordKeyName(uniqueKeyFields);
    
    var dupRecord = lib.upgradeUtility.getRecord("dupRecord", "table.name=\""+table+"\" and key.name=\""+uniqueKeyName+"\"");
    
    if (dupRecord == null) {
        return true;
    }

    return dupRecord["processed"] == null ? false : dupRecord["processed"];
}

function constructDupRecordKeyName(uniqueKeyFields) {
    var uniqueKeyName = "";
    for (var i=0; i<uniqueKeyFields.length; i++) {
        if (uniqueKeyName != "") {
            uniqueKeyName += "|";
        }
        uniqueKeyName += uniqueKeyFields[i];
    }
    return uniqueKeyName;
}


/**
 * To find the key index in Service Manager SCFile with the specified columns
 */
function findKeyIndex(keys, columns)
{
	var i, iLoopTimes;
	for(i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++)
	{
		if(keys[i].name.length() == columns.length)
		{
			var found = true;
			var j;
			for(j = 0; j < columns.length; j++)
			{
				if(system.functions.index(columns[j], keys[i].name) == 0)
				{
					found = false;
					break;
				}
			}
			if(found)
			{
				return i;
			}
		}
	}

	return -1;
}


/**
 * To get the current application version and pd version, without the dot, such as 940_pd4
 *
 */
function getCurrentVersion()
{
	var appVersion = lib.upgradeVersionUtil.getSCVersion();
	appVersion = system.functions.strrep(appVersion, ".", "");
	appVersion = system.functions.substr(appVersion, 1, 3);
	var version = appVersion; 
	
	if (version != null && version.indexOf("9.3") == 0) 
	{
		var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"contentversion\"");
	
	    if (dbdict != null)
		{
			file = new SCFile("contentversion");
			rc = file.doSelect("module=\"Process_Designer\"");
			
			// process the PD version firstly
			if(rc == RC_SUCCESS)
			{
				var pdVersion = file.version;
				
				if(pdVersion != null)
				{
					var pdVersionArray = pdVersion.split('.');
					var pdSubVersion = pdVersionArray[pdVersionArray.length-1];
					
					switch (pdSubVersion)
					{
						case "1":
				        	version += "_pd2";
				        	break;
				                    
						case "2":
				        	version += "_pd3";
				        	break;
				
						case "3":
				        	version += "_pd4";
				        	break;
					}
				}
			}
		}
	}
		
	return version;
}



/**
 * To print all the unique key for all table
 */
function printUniqueKey()
{
	var dbdict = new SCFile("dbdict");
	var rc = dbdict.doSelect("true");
	var keys;
	var keyFieldStr;
	var firstUniqueKey;
	
	var fileName = "c:\\upgradeUniqueKey_" + getCurrentVersion() + ".txt";
	
	writeFile(fileName, 'a', " \n");
	writeFile(fileName, 'a', "/*** \n");
	writeFile(fileName, 'a', "* this file is generated automatically by code.\n");
	writeFile(fileName, 'a', "***/ \n");
	
	writeFile(fileName, 'a', "var oobUniqueKey = \n");
	writeFile(fileName, 'a', "\t[ \n");
	
	/**************************************************************
	* the json structure keeping the unique key should like:
	*
	* var oobUniqueKey = 
	*	[
	*		{	
	*			"table_name":"",
	*			"unique_key": [
	*				{"key_type":"", "key_column":[""]}
	*				]
	*		},
	*	];	
	***************************************************************/
	var seperator = "|";
	
	while(rc == RC_SUCCESS)
	{
		writeFile(fileName, 'a', "\t\t{ \n");
		writeFile(fileName, 'a', "\t\t\t\"table_name\":\"" + dbdict.name + "\", \n");
		writeFile(fileName, 'a', "\t\t\t\"unique_key\": [ \n");
		
		keys = dbdict.key;
		keyFieldStr = "";
		firstUniqueKey = true;
		
		var i, iLoopTimes, j, jLoopTimes;
		for (i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++)
		{
			if (keys[i].flags == UNIQUE)
			{
			
				keyFieldStr = keys[i].name[0];
				
				for (j = 1, jLoopTimes = keys[i].name.length(); j < jLoopTimes; j++)
				{
					keyFieldStr = keyFieldStr + seperator + keys[i].name[j];
				}
				
				keyFieldStr = system.functions.strrep(keyFieldStr, seperator, "\", \"");
				
				if(!firstUniqueKey)
				{
					writeFile(fileName, 'a', ", \n");
				}

				writeFile(fileName, 'a', "\t\t\t\t{\"key_type\":\"12\", \"key_column\":[\"" + keyFieldStr + "\"]}");
				firstUniqueKey = false;
			}
			
			if (keys[i].flags == NODUPLICATES)
			{
				keyFieldStr = keys[i].name[0];
				
				for (j = 1, jLoopTimes = keys[i].name.length(); j < jLoopTimes; j++)
				{
					keyFieldStr = keyFieldStr + seperator + keys[i].name[j];
				}
				
				keyFieldStr = system.functions.strrep(keyFieldStr, seperator, "\", \"");
				
				if(!firstUniqueKey)
				{
					writeFile(fileName, 'a', ", \n");
				}

				writeFile(fileName, 'a', "\t\t\t\t{\"key_type\":\"8\", \"key_column\":[\"" + keyFieldStr + "\"]}");
				firstUniqueKey = false;
			}
			
			if (keys[i].flags == PRIMARY)
			{
				keyFieldStr = keys[i].name[0];
				
				for (j = 1, jLoopTimes = keys[i].name.length(); j < jLoopTimes; j++)
				{
					keyFieldStr = keyFieldStr + seperator + keys[i].name[j];
				}
				
				keyFieldStr = system.functions.strrep(keyFieldStr, seperator, "\", \"");
				
				if(!firstUniqueKey)
				{
					writeFile(fileName, 'a', ", \n");
				}

				writeFile(fileName, 'a', "\t\t\t\t{\"key_type\":\"28\", \"key_column\":[\"" + keyFieldStr + "\"]}");
				firstUniqueKey = false;
			}
		}
		
		writeFile(fileName, 'a', "\n\t\t\t] \n");
		writeFile(fileName, 'a', "\t\t}, \n");
		
		rc = dbdict.getNext();
	}
	
	writeFile(fileName, 'a', "\t]; \n");
	
	writeFile(fileName, 'a', "function getOobUniqueKey(){ return oobUniqueKey; } \n");
}

/**
 *  Check if the key is UNIQUE, NODUPLICATES or PRIMARY
 */
function isUniqueKey(key) {
    if (key.flags == UNIQUE || key.flags == NODUPLICATES || key.flags == PRIMARY) {
        return true;
    }
    
    return false;
}

/*****
* To check whether one unique key is created by customer.
*
* @param {character} fileName	-  The table name (e.g. producttype)
* @param {structure} key	-  The unique key
*****/
function isCustomUniqueKey(fileName, key)
{
	var uniqueKeyArr = getOobUnqiueKey(fileName);
	
	var keyIndex = -1;
	var columns = key.name.toArray();
	
	for(var i = 0; i < uniqueKeyArr.length; i++)
	{
		if(uniqueKeyArr[i].key_type == key.flags && uniqueKeyArr[i].key_column.length == columns.length)
		{
			var found = true;
			for(var j = 0; j < columns.length; j++)
			{
				if(system.functions.index(columns[j], uniqueKeyArr[i].key_column) == 0)
				{
					found = false;
					break;
				}
			}
			if(found)
			{
				keyIndex = i;
			}
		}
	}
	
	if(keyIndex == -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function getOobUnqiueKey(fileName) {
    var uniqueKeyArr = [];
	
	var libName = "upgradeUniqueKey_" + getCurrentVersion();
	if (!lib[libName]) {
	    return [];
	}
	var oobUniqueKey = lib[libName].getOobUniqueKey();
	
	//retrieve the unique key for the file
	var i;
	for (i = 0; i < oobUniqueKey.length; i++)
	{
		if (oobUniqueKey[i].table_name == fileName)
		{
			uniqueKeyArr = oobUniqueKey[i].unique_key;
			break;
		}
	}
	
	return uniqueKeyArr;
}

// Check if columns2 is the subset of columns1
// If any set is null, always return false
function isKeySubset(columns1, flag1, columns2, flag2) {
    if (columns1 == null || columns2 == null || columns1.length < columns2.length) {
        return false;
    }
    
    for (var i=0; i<columns2.length; i++) {
        if (system.functions.index(columns2[i], columns1) == 0) {
            return false;
        }
    }
    
    return true;
}


// 0 - Not subset
// 1 - Equal
// >1 - Is subset
function getKeySubsetMatchingDegree(columns1, flag1, columns2, flag2) {
    if (isKeySubset(columns1, flag1, columns2, flag2)) {
        return columns1.length/columns2.length;
    }
    
    return 0;
}

// Get the OOB key which is upgraded.
function getUpgradedFromOobUniqueKey(fileName, key) {
    var uniqueKeyArr = getOobUnqiueKey(fileName); 
    var columns = key.name.toArray();

	var foundIndex = -1;
	var foundDegree = 0;
	for (var i=0; i<uniqueKeyArr.length; i++) {
	    var degree = getKeySubsetMatchingDegree(columns, key.flags, uniqueKeyArr[i].key_column, uniqueKeyArr[i].key_type);
	    if (foundIndex < 0 || (degree >=1 && degree < foundDegree)) {
	        foundIndex = i;
	        foundDegree = degree;
	    }
	}
	
	if (foundIndex < 0 || foundDegree < 1) {
	    return null;
	}
	
	uniqueKeyArr[foundIndex].degree = foundDegree;
	
	return uniqueKeyArr[foundIndex];
}

function checkOobUniqueKeyCustomized(oobUniqueKey, oldKeys) {
    var foundIndex = -1;
    var foundDegree = 0;
    for (var i=0; i<oldKeys.length(); i++) {
        columns = oldKeys[i].name.toArray();
        var degree = getKeySubsetMatchingDegree(columns, oldKeys[i].flags, oobUniqueKey.key_column, oobUniqueKey.key_type);
	    if (foundIndex < 0 || (degree >=1 && degree < foundDegree)) {
	        foundIndex = i;
	        foundDegree = degree;
	    }
	}
        
    if (foundIndex < 0 || foundDegree < 1) {
	    return false;
	}
	
	return true;
}

function checkConflictedUniqueKey(fileName, oldKeys, newKey) {
    var oobUniqueKey = getUpgradedFromOobUniqueKey(fileName, newKey);
    if (oobUniqueKey != null) {
        var isCustomized = checkOobUniqueKeyCustomized(oobUniqueKey, oldKeys);
        return isCustomized;
    } else {
        return false;
    }
}


/**
 * To print all the non-unique key change
 */
function printNonUniqueKeyChange()
{
	var dbdict = new SCFile("dbdict");
	var rc = dbdict.doSelect("true");
	
	var upgradedbdict;
	
	var keyFieldStr;
	
	var allAddedKey = [];
	var allRemovedKey = [];
	
	var tableName4AddedKey = [];
	var tableName4RemovedKey = [];
	
	var version = getCurrentVersion();
	var fileName = "c:\\nonUniqueKeyChange_" + version + ".txt";
	
	writeFile(fileName, 'a', " \n");
	
	/**************************************************************
	* the json structure keeping the unique key should like:
	*
	*	{
	*		"version":SM700,
	*		"adds": [
	*			{"table":"cm3r", "keyType":NULLSANDDUPLICATES, "columns":["middle,logical.name"]},
	*			{"table":"dept", "keyType":NULLSANDDUPLICATES, "columns":["serviceRequesters"]},
	*			{"table":"incidents", "keyType":NULLSANDDUPLICATES, "columns":["affected.item"]},
	*			{"table":"ocmq", "keyType":NULLSANDDUPLICATES, "columns":["logical.name"]}
	*			], 
	*		"updates":[],
	*		"removes": []
	*	}
	***************************************************************/

	var target;
	var i, j, jLoopTimes;
	
	while(rc == RC_SUCCESS)
	{
		upgradedbdict = new SCFile("upgradedbdict");
		rc = upgradedbdict.doSelect("name=\"" + dbdict.name + "\"");

		if(rc == RC_SUCCESS)
		{
			var addedKey = [];
			var removedKey = [];
			
			lib.upgradeCompareDbdict.compareDbdictNonUniqueKey(dbdict, upgradedbdict, addedKey, removedKey);
			
			for (i = 0; i < addedKey.length; i++)
			{
				target = new SCFile("upgradedbdict");
				system.functions.recordcopy(upgradedbdict, ["key"], target, ["key"]);
				allAddedKey[allAddedKey.length] = target.key[addedKey[i]];
				
				tableName4AddedKey.push(dbdict.name);
			}
			
			for (i = 0; i < removedKey.length; i++)
			{
				target = new SCFile("dbdict");
				system.functions.recordcopy(dbdict, ["key"], target, ["key"]);
				allRemovedKey[allRemovedKey.length] = target.key[removedKey[i]];

				tableName4RemovedKey.push(dbdict.name);
			}
		}
		
		rc = dbdict.getNext();
	}		
	
	writeFile(fileName, 'a', "\t{ \n");
	writeFile(fileName, 'a', "\t\t\"version\":SM" + version + ", \n");

	// write the added key
	writeFile(fileName, 'a', "\t\t\"adds\": [ \n");
	
	var seperator = "|";
	
	for (i = 0; i < allAddedKey.length; i++)
	{
		writeFile(fileName, 'a', "\t\t\t{\"table\":\"" + tableName4AddedKey[i] + "\", ");
		
		if(allAddedKey[i].flags == NULLSANDDUPLICATES)
		{
			writeFile(fileName, 'a', "\"keyType\":NULLSANDDUPLICATES, ");
		}
		else if(allAddedKey[i].flags == NONULLS)
		{
			writeFile(fileName, 'a', "\"keyType\":NONULLS, ");
		}
		
		keyFieldStr = allAddedKey[i].name[0];
				
		for (j = 1, jLoopTimes = allAddedKey[i].name.length(); j < jLoopTimes; j++)
		{
			keyFieldStr = keyFieldStr + seperator + allAddedKey[i].name[j];
		}
				
		keyFieldStr = system.functions.strrep(keyFieldStr, seperator, "\", \"");
	
		writeFile(fileName, 'a', "\"columns\":[\"" + keyFieldStr + "\"]}");
		
		if( i == (allAddedKey.length - 1 ) )
		{
			writeFile(fileName, 'a', "\n");
		}
		else
		{
			writeFile(fileName, 'a', ",\n");
		}
		
	}
	
	writeFile(fileName, 'a', "\t\t\t], \n");
	
	writeFile(fileName, 'a', "\t\t\"updates\":[], \n");
	
	// write the removed key
	writeFile(fileName, 'a', "\t\t\"removes\": [ \n");
		
	for (i = 0; i < allRemovedKey.length; i++)
	{
		writeFile(fileName, 'a', "\t\t\t{\"table\":\"" + tableName4RemovedKey[i] + "\", ");
		
		if(allRemovedKey[i].flags == NULLSANDDUPLICATES)
		{
			writeFile(fileName, 'a', "\"keyType\":NULLSANDDUPLICATES, ");
		}
		else if(allRemovedKey[i].flags == NONULLS)
		{
			writeFile(fileName, 'a', "\"keyType\":NONULLS, ");
		}
		
		keyFieldStr = allRemovedKey[i].name[0];
				
		for (j = 1, jLoopTimes = allRemovedKey[i].name.length(); j < jLoopTimes; j++)
		{
			keyFieldStr = keyFieldStr + seperator + allRemovedKey[i].name[j];
		}
				
		keyFieldStr = system.functions.strrep(keyFieldStr, seperator, "\", \"");
	
		writeFile(fileName, 'a', "\"columns\":[\"" + keyFieldStr + "\"]}");
		
		if( i == (allRemovedKey.length - 1 ) )
		{
			writeFile(fileName, 'a', "\n");
		}
		else
		{
			writeFile(fileName, 'a', ",\n");
		}
	}
	
	writeFile(fileName, 'a', "\t\t\t] \n");
	
	writeFile(fileName, 'a', "\t} \n");
}
