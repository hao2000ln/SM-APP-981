/**
 * This script is used to replace the RAD "apm.upgrade.merge.new" during Upgrade Process
 * This RAD is used to find the new fields in the Upgrade Package and generate the records
 * into the "sqlupgrade" table
 * 
 * And now, we will find the modified fields between the local version and the Upgrade Package
 * and generate the records into the "sqlupgrade" table.
 * 
 *
 * Author: Xu, Da-Lei
 * Date: 2014-08-01
 */


/**
* Constants for key types
*/
var NULLSANDDUPLICATES = 0;
var NONULLS = 4;
var NODUPLICATES = 8;
var UNIQUE = 12;
var PRIMARY = 28;

var FIELD_LENGTH_REGEX = /\((\d+)\)/;
var FIELD_LENGTH_REGEX_PGCI = /_(\d+)/;

/**
 * Version is the index in the array located at patch.config panel of RAD apm.upgrade.wizard.
 */
var verArr = lib.upgradeConstants.FULL_VERSIONS();
var currentVersion = lib.upgradeVersionUtil.getSCVersion();

var currentVersionIndex = system.functions.index(currentVersion, verArr);
var SM932 = system.functions.index("9.32.0016", verArr);

var upgradeVersion = lib.upgradeVersionUtil.getFullMajorMinorVersion(lib.upgradeConstants.TARGET_VERSION());

	
/**
 * This is the main entry.
 *
 * This function is used to find the check the fields changes and the key changes
 * in the Upgrade Package
 * 
 * @param {structure} oldDbdict	-  The old dbdict record
 * @param {structure} newDbdict	-  The new dbdict record
 */
function compareDbdict(oldDbdict, newDbdict)
{
	if (oldDbdict == null || oldDbdict.name == null || oldDbdict.name.indexOf("upgrade") == 0 || oldDbdict.name == "upginfo" || oldDbdict.name == "upgverbld") {
	    return;
	}
	compareDbdictField(oldDbdict, newDbdict);
	compareDbdictUniqueKey(oldDbdict, newDbdict);
	
}

 
/**
 * This function is used to find the field changes in the Upgrade Package and 
 * generate the records into the "sqlupgradefield" table
 * 
 * @param {structure} oldDbdict	-  The old dbdict record
 * @param {structure} newDbdict	-  The new dbdict record
 */
function compareDbdictField(oldDbdict, newDbdict)
{
	purgeSqlUpgradeField(oldDbdict.name);

	var oldField = oldDbdict.field;
	var newField = newDbdict.field;
	
	var fieldTypes = [ "number", "character", "date/time", "logical", "label", "record", "offset", "array", "structure", 
					   "operator", "expression", "pseudofield", "global var", "local var", "field" ];

	var tempStruct = ["descriptor"];
	var tempLevel = new Array(1);
	tempLevel[0] = 0;
	
	var oldFieldLength = oldField.length();
	
	var oldFieldName = new Array(oldFieldLength);
	var oldFieldType = new Array(oldFieldLength);
	var oldFieldLevel = new Array(oldFieldLength);
	var oldFieldIndex = new Array(oldFieldLength);
	
	var oldFieldSqlTable = new Array(oldFieldLength);
	var oldFieldSqlColumn = new Array(oldFieldLength);
	var oldFieldSqlType = new Array(oldFieldLength);
	var oldFieldSqlRcformat = new Array(oldFieldLength);
	
	var offset;
	var oldStructure = new Array(oldFieldLength);
	
	var aliasName = "";
	var	aliasLevel = "";
	var aliasIndex = "";
	var aliasStructure = "";
	
	var oldAlias = new Array(oldFieldLength);	
	var oldAliasItem;
	
	var i, j, x;
	
	//retrieve all the fields in the old dbdict
	for (i = 0; i < oldFieldLength; i++)
	{
		oldFieldName[i] = oldField[i][0];
		oldFieldType[i] = oldField[i][3];
		oldFieldLevel[i] = oldField[i][1];
		oldFieldIndex[i] = oldField[i][2];

		oldFieldSqlTable[i] = oldField[i][7][0];
		oldFieldSqlColumn[i] = oldField[i][7][1];
		oldFieldSqlType[i] = oldField[i][7][2];
		oldFieldSqlRcformat[i] = oldField[i][7][3];
		
		//level 0 field is the descriptor
		if(oldFieldLevel[i] == tempLevel[0])
		{
			tempStruct[0] = oldFieldName[i];
		}
		else if(oldFieldLevel[i] > tempLevel[0])
		{
			tempStruct.splice(0, 0, oldFieldName[i]);
			tempLevel.splice(0, 0, oldFieldLevel[i]);
		}
		else if(oldFieldLevel[i] < tempLevel[0])
		{
			offset = tempLevel[0] - oldFieldLevel[i];
			
			tempStruct.splice(0, offset);
			tempLevel.splice(0, offset);
			
			tempStruct[0] = oldFieldName[i];
			tempLevel[0] = oldFieldLevel[i];	
		}
		
		//compose the field structure, it includes all the parent path EXCLUDE "descriptor"
		//if it is empty, it will include "descriptor"
		
		if(tempStruct[1] == null)
		{
			oldStructure[i] = "";
		}
		else
		{
			oldStructure[i] = tempStruct[1];
		}
		
		for (j = 2; j < (tempStruct.length - 1); j++)
		{
			oldStructure[i] = tempStruct[j] + "," + oldStructure[i];
		}


		//find two fields which are totally eqaul.
		if(oldFieldLevel[i] == aliasLevel && oldFieldIndex[i] == aliasIndex && oldStructure[i] == aliasStructure)
		{
			oldAliasItem = new SCDatum();
			oldAliasItem.setType(9);
			oldAliasItem.push(aliasName);
			oldAliasItem.push(aliasStructure);
			oldAliasItem.push(aliasLevel);
			
			oldAlias[i] = oldAliasItem;
		}
		else
		{
			aliasName = oldFieldName[i];
			aliasLevel = oldFieldLevel[i];
			aliasIndex = oldFieldIndex[i];
			aliasStructure = oldStructure[i];
			oldAlias[i] = null;	
		}
		
	}


	tempStruct = ["descriptor"];
	tempLevel = new Array(1);
	tempLevel[0] = 0;
	
	var newFieldLength = newField.length();
	
	var newFieldName = new Array(newFieldLength);
	var newFieldType = new Array(newFieldLength);
	var newFieldLevel = new Array(newFieldLength);
	var newFieldIndex = new Array(newFieldLength);
	
	var newFieldSqlTable = new Array(newFieldLength);
	var newFieldSqlColumn = new Array(newFieldLength);
	var newFieldSqlType = new Array(newFieldLength);
	var newFieldSqlRcformat = new Array(newFieldLength);
		
	var newStructure = new Array(newFieldLength);
	
	aliasName = "";
	aliasLevel = "";
	aliasIndex = "";
	aliasStructure = "";
	
	var newAlias = new Array(newFieldLength);	
	var newAliasItem;
	
	//retrieve all the fields in the new dbdict
	for (i = 0; i < newFieldLength; i++)
	{
		newFieldName[i] = newField[i][0];
		newFieldType[i] = newField[i][3];
		newFieldLevel[i] = newField[i][1];
		newFieldIndex[i] = newField[i][2];

		newFieldSqlTable[i] = newField[i][7][0];
		newFieldSqlColumn[i] = newField[i][7][1];
		newFieldSqlType[i] = newField[i][7][2];
		newFieldSqlRcformat[i] = newField[i][7][3];
		
		//level 0 field is the descriptor
		if(newFieldLevel[i] == tempLevel[0])
		{
			tempStruct[0] = newFieldName[i];
		}
		else if(newFieldLevel[i] > tempLevel[0])
		{
			tempStruct.splice(0, 0, newFieldName[i]);
			tempLevel.splice(0, 0, newFieldLevel[i]);
		}
		else if(newFieldLevel[i] < tempLevel[0])
		{
			offset = tempLevel[0] - newFieldLevel[i];
			
			tempStruct.splice(0, offset);
			tempLevel.splice(0, offset);
			
			tempStruct[0] = newFieldName[i];
			tempLevel[0] = newFieldLevel[i];	
		}
		
		//build the new structure
		if(tempStruct[1] == null)
		{
			newStructure[i] = "";
		}
		else
		{
			newStructure[i] = tempStruct[1];
		}
		
		for (j = 2; j < (tempStruct.length - 1); j++)
		{
			newStructure[i] = tempStruct[j] + "," + newStructure[i];
		}
		
		//find two fields which are totally eqaul.
		if(newFieldLevel[i] == aliasLevel && newFieldIndex[i] == aliasIndex && newStructure[i] == aliasStructure)
		{
			newAliasItem = new SCDatum();
			newAliasItem.setType(9);
			newAliasItem.push(aliasName);
			newAliasItem.push(aliasStructure);
			newAliasItem.push(aliasLevel);
			
			newAlias[i] = newAliasItem;
		}
		else
		{
			aliasName = newFieldName[i];
			aliasLevel = newFieldLevel[i];
			aliasIndex = newFieldIndex[i];
			aliasStructure = newStructure[i];
			newAlias[i] = null;	
		}

	}
	
	
	var dontAdd = [];

	var sqlUpgradeField;
	var addField;
	var sameStructure;
	var varContinue;
	var rightLevel;
	var paramArray;
	var exceptMsg;
	var tempAlias;
	
	//check the old field
	for (i = 1; i < oldFieldLength; i++)
	{
		addField = false;
		
 		x = system.functions.index(oldFieldName[i], newFieldName);
 		
 		if(x == 0)	//the name of the old field does not be included in the new fields
 		{
	 		addField = true;
 		}
	    else
	    {
	    	if(x > 0)	//the name is found, then check the structure
	    	{
	    		sameStructure = false;
	    		varContinue = true;
	    		
	    		while((!sameStructure) && varContinue)
	    		{
	    			if(oldStructure[i] == newStructure[x-1])	//the structure are same
	    			{
	    				sameStructure = true;
	    			}
	    			else	//the structure are NOT same, this is a new field
	    			{
	    				y = x + 1;
	    				x = system.functions.index(oldFieldName[i], newFieldName, y);
	    				if(x == 0)
	    				{
	    					varContinue = false;
	    					addField = true;
	    				}
	    			}
	    		}
	    	}
	    	
	    	if(!addField) //if the structure is same, then check the level
	    	{
	    		rightLevel = false;
	    		varContinue = true;
	    		while((!rightLevel) && varContinue)
	    		{
	    			if(oldFieldLevel[i] == newFieldLevel[x-1])	//the level are same
	    			{
	    				rightLevel = true;
	    			}
	    			else	//the level are NOT same, this is a new field
	    			{
	    				y = x + 1;
	    				x = system.functions.index(oldFieldName[i], newFieldName, y);
	    				if(x == 0)
	    				{
	    					varContinue = false;
	    					addField = true;
	    				}
	    			}
	    		}
	    	}
	    }
    	
    	if(addField)
	    {
	    	tempAlias = "";
	    	if(oldAlias[i] != null)
	    	{
	    		tempAlias = oldAlias[i][0];
	    		if(oldAlias[i][1] != "descriptor")
	    		{
	    			tempAlias = oldAlias[i][1] + "," + tempAlias;
	    		}
	    	}
	    	
			sqlUpgradeField = new SCFile("sqlupgradefield");
			sqlUpgradeField.file_name = oldDbdict.name;
			
	    	sqlUpgradeField.field_name = oldFieldName[i];
	    	sqlUpgradeField.field_type = fieldTypes[system.functions.val(oldFieldType[i])-1];
	    	sqlUpgradeField.field_level = oldFieldLevel[i];
	    	sqlUpgradeField.field_structure = oldStructure[i];
	    	sqlUpgradeField.field_alias_of = tempAlias;
	    		
	    	sqlUpgradeField.result_type = system.functions.scmsg(9111, "upg", [upgradeVersion]);
	    	sqlUpgradeField.field_sql_table_alias = oldFieldSqlTable[i];
	    	sqlUpgradeField.field_sql_column_name = oldFieldSqlColumn[i];
	    	sqlUpgradeField.field_sql_data_type = oldFieldSqlType[i];
	    	sqlUpgradeField.field_sql_rcformat = oldFieldSqlRcformat[i];
	    			
	    	sqlUpgradeField.doInsert();
		}

	}	//end of the loop of old fields
	
	
	var savBadAddLvl = 0;	//the level where an attempt to ad an invalid structure begins
	var badStcAdd = false;	//the flag that indicates whether an attempt to add an invalid structure has occurred
	var badStcName = null;	//the name of the invalid structure that we attempted to add
	
	
	//check the new field
	for (i = 1; i < newFieldLength; i++)
	{
		addField = false;
		//if we change a character to a structure, 
		//then all the children of this structure should be ignore the adding action because the parent is not legal
		//if this structure iterate over, then new field should be process as normal
		if(badStcAdd && newFieldLevel[i] <= savBadAddLvl)	
		{
			badStcAdd = false;
			savBadAddLvl = 0;
			badStcNam = null;
		}
	
 		x = system.functions.index(newFieldName[i], oldFieldName);
 		
 		if(x == 0)	//the name of the new field does not be included in the old fields
 		{
	 		addField = true;
 		}
	    else
	    {
	    	if(x > 0)	//the name is found, then check the structure
	    	{
	    		sameStructure = false;
	    		varContinue = true;
	    		
	    		while((!sameStructure) && varContinue)
	    		{
	    			if(newStructure[i] == oldStructure[x-1])	//the structure are same
	    			{
	    				sameStructure = true;
	    			}
	    			else	//the structure are NOT same, this is a new field
	    			{
	    				y = x + 1;
	    				x = system.functions.index(newFieldName[i], oldFieldName, y);
	    				if(x == 0)
	    				{
	    					varContinue = false;
	    					addField = true;
	    				}
	    			}
	    		}
	    	}
	    	
	    	if(!addField) //if the structure is same, then check the level
	    	{
	    		rightLevel = false;
	    		varContinue = true;
	    		while((!rightLevel) && varContinue)
	    		{
	    			if(newFieldLevel[i] == oldFieldLevel[x-1])	//the level are same
	    			{
	    				rightLevel = true;
	    			}
	    			else	//the level are NOT same, this is a new field
	    			{
	    				y = x + 1;
	    				x = system.functions.index(newFieldName[i], oldFieldName, y);
	    				if(x == 0)
	    				{
	    					varContinue = false;
	    					addField = true;
	    				}
	    			}
	    		}
	    	}
	    }
    	
    	if(!addField)
	    {
	    	if(newFieldType[i] != oldFieldType[x-1]
	    	    && !lib.upgradeDatabaseFieldTypeUpdate.isFieldTypeComparable(oldFieldType[x-1], newFieldType[i]))	//the type is changed
	    	{
	    		sqlUpgradeField = new SCFile("sqlupgradefield");
				sqlUpgradeField.file_name = oldDbdict.name;
			
		    	sqlUpgradeField.field_name = newFieldName[i];
		    	sqlUpgradeField.field_type = fieldTypes[system.functions.val(newFieldType[i])-1];
	    		sqlUpgradeField.field_level = newFieldLevel[i];
	    		sqlUpgradeField.field_structure = newStructure[i];
	    		sqlUpgradeField.field_alias_of = tempAlias;
	    			
	    		sqlUpgradeField.field_sql_table_alias = newFieldSqlTable[i];
		    	sqlUpgradeField.field_sql_column_name = newFieldSqlColumn[i];
	    		sqlUpgradeField.field_sql_data_type = convertSqlTypeByDb(newFieldSqlType[i], newFieldSqlType[i]);
	    		sqlUpgradeField.field_sql_rcformat = newFieldSqlRcformat[i];
	    				
	    		
	    		if(oldFieldType[x-1] == 2 && newFieldType[i] == 8)		//the character could be modified to array by the Upgrade Utiliy.
	    		{
	    			paramArray = [newFieldName[i], newFieldName[i] + ".old"];
	    			sqlUpgradeField.result_type = system.functions.scmsg(9117, "upg", paramArray);
				}
	    		else if(newFieldType[i] == 9)		//the old field is NOT structure, however, the new field is a structure.->> error
	    		{
	    			savBadAddLvl = newFieldLevel[i];
	    			badStcAdd = true;
	    			badStcName = newFieldName[i];
	    			
	    			exceptMsg = "dbdict:" + oldDbdict.name + ", structure:" + newStructure[i]
	    								+ ", field:" + newFieldName[i] + ", type is :" + fieldTypes[system.functions.val(oldFieldType[x-1])-1]
	    								+ " -- new type is :" + fieldTypes[system.functions.val(newFieldType[i])-1]
	    								+ " -- field left as type " + fieldTypes[system.functions.val(oldFieldType[x-1])-1];
	    								
					lib.upgradeLog.error(exceptMsg);
					
					sqlUpgradeField.result_type = system.functions.scmsg(9112, "upg");
					sqlUpgradeField.exceptions = exceptMsg;
				}
	    		else
	    		{
	    			if(oldDbdict.name != "licenseinfo")
	    			{
	    				paramArray = [	oldDbdict.name, newFieldName[i], 
	    								fieldTypes[system.functions.val(oldFieldType[x-1])-1], 
	    								fieldTypes[system.functions.val(newFieldType[i])-1]
	    							 ];
	    				
	    				exceptMsg = system.functions.scmsg(1155, "upg", paramArray);
	    				lib.upgradeLog.error(exceptMsg);
						
						sqlUpgradeField.result_type = system.functions.scmsg(9113, "upg");
						sqlUpgradeField.exceptions = exceptMsg;
					}
	    		}
	    		
	    		
	    		sqlUpgradeField.doInsert();
	    		
	    		dontAdd.push(newFieldName[i]);
	    	}
	    	else
	    	{
	    		if(!badStcAdd)
	    		{
 					sqlUpgradeField = new SCFile("sqlupgradefield");
					sqlUpgradeField.file_name = oldDbdict.name;
			
		    		sqlUpgradeField.field_name = newFieldName[i];
		    		sqlUpgradeField.field_type = fieldTypes[system.functions.val(newFieldType[i])-1];
	    			sqlUpgradeField.field_level = newFieldLevel[i];
	    			sqlUpgradeField.field_structure = newStructure[i];
	    			sqlUpgradeField.field_alias_of = tempAlias;
	    			
	    			sqlUpgradeField.field_sql_table_alias = newFieldSqlTable[i];
					sqlUpgradeField.field_sql_column_name = newFieldSqlColumn[i];
					sqlUpgradeField.field_sql_data_type = convertSqlTypeByDb(oldFieldSqlType[x-1], newFieldSqlType[i]);
					sqlUpgradeField.field_sql_rcformat = newFieldSqlRcformat[i];
							
	    			//if this field will be moved to alias
	    			if(isMoved2Alias(oldFieldSqlTable[x-1], newFieldSqlTable[i]))
	    			{
	    				////if this field will be moved to alias automatically
	    				if(isMoved2AliasAuto(oldDbdict.name, oldFieldName[x-1], oldFieldType[x-1]))
	    				{
	    					sqlUpgradeField.result_type = system.functions.scmsg(9114, "upg");
	    					sqlUpgradeField.doInsert();
	    				}
	    				else
	    				{
	    					exceptMsg = system.functions.scmsg("UPG_DBDICT_INFO", "upg"
	    					                    , [oldDbdict.name, oldFieldName[x-1], fieldTypes[system.functions.val(oldFieldType[x-1])-1]]);
	    					
	    					if(compareFieldSqlType(oldFieldSqlType[x-1], newFieldSqlType[i]) == false)
	    					{
	    						exceptMsg += ", " + system.functions.scmsg("UPG_DBDICT_SQLTYPE_EXPECT", "upg"
	    						                   , [system.functions.nullsub(oldFieldSqlType[x-1], "EMPTY"), system.functions.nullsub(sqlUpgradeField.field_sql_data_type, "EMPTY")]);
	    					}
	    					
	    					if(newFieldSqlTable[i] != oldFieldSqlTable[x-1])
	    					{
	    						exceptMsg += ", " + system.functions.scmsg("UPG_DBDICT_SQLTABLE_EXPECT", "upg"
	    						                   , [system.functions.nullsub(oldFieldSqlTable[x-1], "EMPTY"), system.functions.nullsub(newFieldSqlTable[i], "EMPTY")]);
	    					}
	    								
	    					lib.upgradeLog.error(exceptMsg);
							sqlUpgradeField.exceptions = exceptMsg;
						
	    					sqlUpgradeField.result_type = system.functions.scmsg(9118, "upg");
	    					sqlUpgradeField.doInsert();
	    				}
	    			}
					else if( compareFieldSqlType(oldFieldSqlType[x-1], newFieldSqlType[i]) == false )
	    			{
				    	
				    	if(oldFieldSqlType[x-1] != null && newFieldSqlType[i] == null)
				    	{
				    		paramArray = [oldDbdict.name, oldFieldName[x-1], oldFieldSqlType[x-1], "EMPTY"];
	    					exceptMsg = system.functions.scmsg(1157, "upg", paramArray);

							lib.upgradeLog.error(exceptMsg);
							sqlUpgradeField.exceptions = exceptMsg;
	    					sqlUpgradeField.result_type = system.functions.scmsg(9119, "upg");
		    			
				    	}
				    	else if(oldFieldSqlType[x-1] == null && newFieldSqlType[i] != null)
				    	{
				    		if(isLargeDataType(newFieldSqlType[i]))
				    		{
				    			paramArray = [oldDbdict.name, oldFieldName[x-1], "EMPTY", sqlUpgradeField.field_sql_data_type];
	    						exceptMsg = system.functions.scmsg(1157, "upg", paramArray);
				    	
				    			lib.upgradeLog.error(exceptMsg);
								sqlUpgradeField.exceptions = exceptMsg;
	    						sqlUpgradeField.result_type = system.functions.scmsg(9119, "upg");
		    				}
		    				else
		    				{
		    					sqlUpgradeField.result_type = system.functions.scmsg(9114, "upg");
		    				}
				    	}
				    	else
				    	{
				    		if (lib.upgradeDatabaseFieldTypeUpdate.isEnlargableFieldType(oldFieldSqlType[x-1], newFieldSqlType[i])) {
	                            mergedType = convertSqlTypeByDb(oldFieldSqlType[x-1], newFieldSqlType[i]); 
	                            if (mergedType == oldFieldSqlType[x-1]) {
				    			    sqlUpgradeField.result_type = system.functions.scmsg(9119, "upg");
				    			} else {
				    			    sqlUpgradeField.result_type = system.functions.scmsg(9114, "upg");
				    			}
	                        } else {
				    		    var oldFieldTypeObj = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(oldFieldSqlType[x-1]);	
	                            var oldFieldTypeIndex = oldFieldTypeObj.index;
	                            var newFieldTypeObj = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(newFieldSqlType[i]);
	                            var newFieldTypeIndex = newFieldTypeObj.index;
				    		    if(!lib.upgradeDatabaseFieldTypeUpdate.findTypeFromMatrix(oldFieldTypeIndex, newFieldTypeIndex)
				    		        || isLargeDataType(newFieldSqlType[i]))
				    		    {
				    			    paramArray = [oldDbdict.name, oldFieldName[x-1], oldFieldSqlType[x-1], sqlUpgradeField.field_sql_data_type];
	    						    exceptMsg = system.functions.scmsg(1157, "upg", paramArray);
				    	
				    			    lib.upgradeLog.error(exceptMsg);
								    sqlUpgradeField.exceptions = exceptMsg;
	    						    sqlUpgradeField.result_type = system.functions.scmsg(9119, "upg");
	    						}
		    				    else
		    				    {
		    					    sqlUpgradeField.result_type = system.functions.scmsg(9114, "upg");
		    				    }
		    				}
				    	}
				    	
			    		sqlUpgradeField.doInsert();
						
	    			}
 					else if( newFieldSqlColumn[i] != oldFieldSqlColumn[x-1] 
	    				|| newFieldSqlRcformat[i] != oldFieldSqlRcformat[x-1] )
	    			{
				    	sqlUpgradeField.result_type = system.functions.scmsg(9114, "upg");
	    				sqlUpgradeField.doInsert();
						
						
	    			}
	    		}
	    	}
	    
	    }
	    else
	    {
	    	tempAlias = "";
	    	if(newAlias[i] != null)
	    	{
	    		tempAlias = newAlias[i][0];
	    		if(newAlias[i][1] != "descriptor")
	    		{
	    			tempAlias = newAlias[i][1] + "," + tempAlias;
	    		}
	    	}
	    	
	    	if(system.functions.index(newFieldName[i], dontAdd) == 0)
	    	{
	    		sqlUpgradeField = new SCFile("sqlupgradefield");
				sqlUpgradeField.file_name = oldDbdict.name;

	    		sqlUpgradeField.field_name = newFieldName[i];
	    		sqlUpgradeField.field_type = fieldTypes[system.functions.val(newFieldType[i])-1];
	    		sqlUpgradeField.field_level = newFieldLevel[i];
	    		sqlUpgradeField.field_structure = newStructure[i];
	    		sqlUpgradeField.field_alias_of = tempAlias;
	    			
	    		sqlUpgradeField.field_sql_table_alias = newFieldSqlTable[i];
	    		sqlUpgradeField.field_sql_column_name = newFieldSqlColumn[i];
	    		sqlUpgradeField.field_sql_data_type = convertSqlTypeByDb(newFieldSqlType[i], newFieldSqlType[i]);
	    		sqlUpgradeField.field_sql_rcformat = newFieldSqlRcformat[i];
	    		
	    		if(!badStcAdd)
	    		{
	    			
	    			
	    			
	    			
	    	    	sqlUpgradeField.result_type = system.functions.scmsg(9115, "upg");
	    		}
	    		else
	    		{
	    			exceptMsg = "dbdict:" + oldDbdict.name + ", structure:" + newStructure[i]
	    						+ " field:" + newFieldName[i] + " type " + newFieldType[i]
	    						+ " will not be added because its parent structure (" + badStcName + ") can not be added";
	    			
	    			lib.upgradeLog.error(exceptMsg);
					
	    			sqlUpgradeField.result_type = system.functions.scmsg(9116, "upg");
	    			sqlUpgradeField.exceptions = exceptMsg;
	    		}
	    			    			
	    		sqlUpgradeField.doInsert();
	    			
	    	}
	    }

	}	//end of the loop of new loop

}


/**
 * This function is used to delete the existing sqlupgradefield record, 
 *
 * @param {string} fileName	-  The file or table name
 */
 
function purgeSqlUpgradeField(fileName)
{
	var sqlUpgradeField = new SCFile("sqlupgradefield");
	var rc = sqlUpgradeField.doSelect("file.name=\"" + fileName + "\"");
	
	while (rc == RC_SUCCESS)
	{
		sqlUpgradeField.doDelete();
		rc = sqlUpgradeField.getNext();
	}
    
}

/**
* check the fieldSqlType is large datatype.
*  
* @param  fieldSqlType    - the field sql type, e.g. BLOB
**/
function isLargeDataType(fieldSqlType) 
{
	var typeIndex = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(fieldSqlType).index;
	
	if (typeIndex == 4 || typeIndex == 5 || typeIndex == 6)
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
* compare the fields in sql type.
*  
* @param  oldFieldSqlType    old dbdict field sql.data.type
* @param  newFieldSqlType    new dbdict field sql.data.type
*
* return  	true :	same sql data type
*			false:	different sql.date.type
**/
function compareFieldSqlType(oldFieldSqlType, newFieldSqlType)
{
	if (oldFieldSqlType == null && newFieldSqlType == null) 
	{
		return true;
	}
	
	if (oldFieldSqlType == null && newFieldSqlType != null) 
	{
		return false;
	}

	if (oldFieldSqlType != null && newFieldSqlType == null) 
	{
		return false;
	}
							
	//SQLSERVER and DB2 convert to Oracle
	var oldFieldSqlTypeObj = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(oldFieldSqlType);	
	var newFieldSqlTypeObj = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(newFieldSqlType);	
	
	if(lib.upgradeDatabaseFieldTypeUpdate.compareSqlTypeObject(oldFieldSqlTypeObj, newFieldSqlTypeObj))
	{
		//only the the char, varchar, and raw will be compared the length
		if(oldFieldSqlTypeObj.index == 1 || oldFieldSqlTypeObj.index == 3 || oldFieldSqlTypeObj.index == 5)
		{
			var oldSqlTypeLength = 0;
			var matches = oldFieldSqlType.match(FIELD_LENGTH_REGEX);
			if (matches != null) {
			    oldSqlTypeLength = matches[1];
			} else {
			    matches = oldFieldSqlType.match(FIELD_LENGTH_REGEX_PGCI);
			    if (matches != null) {
			        oldSqlTypeLength = matches[1];
			    }
			}
			
			var newSqlTypeLength = newFieldSqlType.match(FIELD_LENGTH_REGEX)[1];
			
			if(oldSqlTypeLength == newSqlTypeLength)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return true;
		}
	}

	return false;
}


/**
*    convert field sql type to base on database type, compare sql type field length , 
*    and choose the longer one as new sql field length
*
*    @param  oldFieldSqlType    old field sql type
*    @param  newFieldSqlType    new field sql type
*    @return converted sql type
*    
*    eg: input 1  3  varchar2(63)	 char(60)	---> VARCHAR2(63)	
**/											
function convertSqlTypeByDb(oldFieldSqlType, newFieldSqlType) 
{
	if (newFieldSqlType == null) 
	{
		return null;
	}
	
	if (oldFieldSqlType == null) 
	{
		oldFieldSqlType = newFieldSqlType;
	}

	//get sql type index (index in array SQL_TYPE_INDEX)
	var oldSqlType = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(oldFieldSqlType);
	var oldSqlTypeIndex = oldSqlType.index;
	var newSqlTypeIndex = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(newFieldSqlType).index;	

	var newType = lib.upgradeDatabaseFieldTypeUpdate.convertSqlTypeByDb(oldSqlTypeIndex, newSqlTypeIndex, 
													oldFieldSqlType, newFieldSqlType, oldSqlType.ntype);
	
	
	return newType;
}


/**
 * This function is used to find the unique key changes in the Upgrade Package 
 * and generate the result records into the "sqlupgradekey" table
 *
 * @param {structure} oldDbdict	-  The old dbdict record
 * @param {structure} newDbdict	-  The new dbdict record
 */
 
function compareDbdictUniqueKey(oldDbdict, newDbdict)
{
	purgeSqlUpgradeKey(oldDbdict.name);

	var oldKey = oldDbdict.key;
	var newKey = newDbdict.key;
	
	var oldKeyLength = oldKey.length();
	var newKeyLength = newKey.length();
	
	var keyIndex;
	var keyIndex2;
	var sqlUpgradeKey;
	var keyFieldArray = [];
	var keyFieldStr;
	var exceptMsg;
	
	var primaryKeyCount = lib.upgradeKeyChanges.getPrimaryKeyCount(oldKey);
					
	var i, j;
	
	//check the old key
	for (i = 0; i < oldKeyLength; i++)
	{
		if(oldKey[i].flags == UNIQUE || oldKey[i].flags == NODUPLICATES || oldKey[i].flags == PRIMARY)
		{
			//generate the key field string, just like 'inbox.type|inbox.class|operator.name'	
			keyFieldArray = oldKey[i].name.toArray();
			
			keyFieldStr = keyFieldArray[0];
	
			for (j = 1; j < keyFieldArray.length; j++)
			{
				keyFieldStr += "|" + keyFieldArray[j];
			}
			
			keyIndex = lib.upgradeKeyChanges.findKeyIndex(newKey, oldKey[i].flags, oldKey[i].name.toArray());
			
			if(keyIndex == -1)	//this unique key exists in the old key, but does NOT exist in the new key
			{

				sqlUpgradeKey = new SCFile("sqlupgradekey");
				sqlUpgradeKey.file_name = oldDbdict.name;
				sqlUpgradeKey.key_flag = oldKey[i].flags;
		    	sqlUpgradeKey.key_field = keyFieldStr;
		    		
		    	if(lib.upgradeKeyUtils.isCustomUniqueKey(oldDbdict.name, oldKey[i]))	//this unique was added by the customer
				{
					sqlUpgradeKey.result_type = system.functions.scmsg(9211, "upg", [upgradeVersion]);
		    	}
				else //this unique was added by SM oob
				{
					keyIndex2 = lib.upgradeKeyUtils.findKeyIndex(newKey, oldKey[i].name.toArray());
					// Upgrade UNIQUE or NODUPLICATES key to PRIMARY key can be ignored.
					if (keyIndex2>=0 && newKey[keyIndex2].flags == PRIMARY
					                && (oldKey[i].flags == UNIQUE || oldKey[i].flags == NODUPLICATES)) {
					    continue;
					}

					sqlUpgradeKey.result_type = system.functions.scmsg(9212, "upg");
					exceptMsg = system.functions.scmsg("UNQ_KEY_REMOVED_FULL_TABLE_COPY", "upg", [oldDbdict.name, 
																lib.upgradeKeyChanges.getKeyTypeString(oldKey[i].flags), 
																lib.upgradeKeyChanges.debrace(oldKey[i].name.toArray()),
																lib.upgradeKeyChanges.getKeyTypeString(oldKey[i].flags)
																]);
				    sqlUpgradeKey.exceptions = exceptMsg;
					lib.upgradeLog.error(exceptMsg);
				}
				
				sqlUpgradeKey.doInsert();
			}
		}
		
	}	//end of the loop of old key

	//check the new key
	for (i = 0; i < newKeyLength; i++)
	{
		if(newKey[i].flags == UNIQUE || newKey[i].flags == NODUPLICATES || newKey[i].flags == PRIMARY)
		{
			//generate the key field string, just like 'inbox.type|inbox.class|operator.name'	
			keyFieldArray = newKey[i].name.toArray();
			
			keyFieldStr = keyFieldArray[0];
	
			for (j = 1; j < keyFieldArray.length; j++)
			{
				keyFieldStr += "|" + keyFieldArray[j];
			}
				
			keyIndex = lib.upgradeKeyChanges.findKeyIndex(oldKey, newKey[i].flags, newKey[i].name.toArray());
			
			if(keyIndex == -1)	//this unique key exists in the new key, but does NOT exist in the old key
			{
				sqlUpgradeKey = new SCFile("sqlupgradekey");
				sqlUpgradeKey.file_name = oldDbdict.name;
				sqlUpgradeKey.key_flag = newKey[i].flags;
		    	sqlUpgradeKey.key_field = keyFieldStr;
			
				keyIndex2 = lib.upgradeKeyUtils.findKeyIndex(oldKey, newKey[i].name.toArray());
			
				if(keyIndex2 == -1)		//this unique key field has NOT been occupied, and this unique key could be added.
				{
					/*//check the current application version
					if(newKey[i].flags == PRIMARY && currentVersionIndex < SM932)
					{
						sqlUpgradeKey.result_type = system.functions.scmsg(9214, "upg");
						
						exceptMsg = system.functions.scmsg("UNQ_KEY_IGNORE_PRIMARY", "upg", [oldDbdict.name, 
																lib.upgradeKeyChanges.getKeyTypeString(newKey[i].flags), 
																lib.upgradeKeyChanges.debrace(newKey[i].name.toArray()),
																lib.upgradeKeyChanges.debrace(newKey[i].name.toArray())
																]);
			    		sqlUpgradeKey.exceptions = exceptMsg;
						lib.upgradeLog.error(exceptMsg);
						
						sqlUpgradeKey.doInsert();
						continue;
					}*/
					
					//check the primary key count
					if(newKey[i].flags == PRIMARY && primaryKeyCount > 0)
					{
						sqlUpgradeKey.result_type = system.functions.scmsg(9214, "upg");
						
						exceptMsg = system.functions.scmsg("UNQ_KEY_MORE_PRIMARY", "upg", [oldDbdict.name, 
																lib.upgradeKeyChanges.getKeyTypeString(newKey[i].flags), 
																lib.upgradeKeyChanges.debrace(newKey[i].name.toArray()),
																lib.upgradeKeyChanges.debrace(newKey[i].name.toArray())
																]);
			    		sqlUpgradeKey.exceptions = exceptMsg;
						lib.upgradeLog.error(exceptMsg);
						
						sqlUpgradeKey.doInsert();
						continue;
					}
						
					sqlUpgradeKey.result_type = system.functions.scmsg(9213, "upg");
					
					sqlUpgradeKey.doInsert();
					continue;
		    	}
		    	else	//this unique key field has been occupied, and this unique key could NOT be added.
		    	{
					
					//if the key which use the same field is from cutomer, then this old key will be kept, and the new unique key could not be added
					if(lib.upgradeKeyUtils.isUniqueKey(oldKey[keyIndex2]) && lib.upgradeKeyUtils.isCustomUniqueKey(oldDbdict.name, oldKey[keyIndex2]))
					{
						sqlUpgradeKey.result_type = system.functions.scmsg(9214, "upg");
					
						exceptMsg = system.functions.scmsg("UNQ_KEY_ALREADY_EXIST", "upg", [oldDbdict.name, 
																lib.upgradeKeyChanges.getKeyTypeString(newKey[i].flags), 
																lib.upgradeKeyChanges.debrace(newKey[i].name.toArray())
																]);
		    			sqlUpgradeKey.exceptions = exceptMsg;
						lib.upgradeLog.error(exceptMsg);
						
						sqlUpgradeKey.doInsert();
					
					}
					else	//if the key which use the same field is from oob, then this old key will be removed, and the new unique key could be added
					{
						/*//check the current application version
						if(newKey[i].flags == PRIMARY && currentVersionIndex < SM932)
						{
							sqlUpgradeKey.result_type = system.functions.scmsg(9214, "upg");
							
							exceptMsg = system.functions.scmsg("UNQ_KEY_IGNORE_PRIMARY", "upg", [oldDbdict.name, 
																	lib.upgradeKeyChanges.getKeyTypeString(newKey[i].flags), 
																	lib.upgradeKeyChanges.debrace(newKey[i].name.toArray()),
																	lib.upgradeKeyChanges.debrace(newKey[i].name.toArray())
																	]);
				    		sqlUpgradeKey.exceptions = exceptMsg;
							lib.upgradeLog.error(exceptMsg);
							
							sqlUpgradeKey.doInsert();
							continue;
						}*/
						
						//check the primary key count
						if(newKey[i].flags == PRIMARY && primaryKeyCount > 0)
						{
							sqlUpgradeKey.result_type = system.functions.scmsg(9214, "upg");
							
							exceptMsg = system.functions.scmsg("UNQ_KEY_MORE_PRIMARY", "upg", [oldDbdict.name, 
																	lib.upgradeKeyChanges.getKeyTypeString(newKey[i].flags), 
																	lib.upgradeKeyChanges.debrace(newKey[i].name.toArray()),
																	lib.upgradeKeyChanges.debrace(newKey[i].name.toArray())
																	]);
				    		sqlUpgradeKey.exceptions = exceptMsg;
							lib.upgradeLog.error(exceptMsg);
							
							sqlUpgradeKey.doInsert();
							continue;
						}
						
						// Upgrade UNIQUE or NODUPLICATES key flags to PRIMARY key flags can be ignored
						if (newKey[i].flags == PRIMARY && (oldKey[keyIndex2].flags == UNIQUE || oldKey[keyIndex2].flags == NODUPLICATES)) {
						    continue;
						}
							
						sqlUpgradeKey.result_type = system.functions.scmsg(9213, "upg");
						
						sqlUpgradeKey.doInsert();
					}
					
				}	
				
			}
			
		}
		
	}	//end of the loop of new key

}


/**
 * This function is used to delete the existing sqlupgradekey record, 
 *
 * @param {string} fileName	-  The file or table name
 */
 
function purgeSqlUpgradeKey(fileName)
{
	var sqlUpgradeKey = new SCFile("sqlupgradekey");
	var rc = sqlUpgradeKey.doSelect("file.name=\"" + fileName + "\"");
	
	while (rc == RC_SUCCESS)
	{
		sqlUpgradeKey.doDelete();
		rc = sqlUpgradeKey.getNext();
	}
}


/**
 * This function is used to find the non-unique key changes in the Upgrade Package 
 * and generate the result records into txt file
 *
 * @param {structure} oldDbdict	-  The old dbdict record
 * @param {structure} newDbdict	-  The new dbdict record
 */
 
function compareDbdictNonUniqueKey(oldDbdict, newDbdict, addedKey, removedKey)
{
	var oldKey = oldDbdict.key;
	var newKey = newDbdict.key;
	
	var oldKeyLength = oldKey.length();
	var newKeyLength = newKey.length();
	
	var keyIndex;
	
	var i;
	
	//check the old key
	for (i = 0; i < oldKeyLength; i++)
	{
		if(oldKey[i].flags == NULLSANDDUPLICATES || oldKey[i].flags == NONULLS)
		{
			keyIndex = lib.upgradeKeyChanges.findKeyIndex(newKey, oldKey[i].flags, oldKey[i].name.toArray());
			
			if(keyIndex == -1)	//this non-unique key exists in the old key, but does NOT exist in the new key
			{
				
				removedKey.push(i);
			}
		}
		
	}	//end of the loop of old key

	//check the new key
	for (i = 0; i < newKeyLength; i++)
	{
		if(newKey[i].flags == NULLSANDDUPLICATES || newKey[i].flags == NONULLS)
		{
			keyIndex = lib.upgradeKeyChanges.findKeyIndex(oldKey, newKey[i].flags, newKey[i].name.toArray());
			
			if(keyIndex == -1)	//this non-unique key exists in the new key, but does NOT exist in the old key
			{
				
				addedKey.push(i);
			}
		}
		
	}	//end of the loop of new key

}


/**
 * This function is used to check whether this field will be moved from m* to a*
 *
 * @param {character} oldAlias		-  The old alias, it could be null or m*
 * @param {character} newAlias		-  The new alias, it must be a*
 */
function isMoved2Alias(oldAlias, newAlias) 
{
	var pattern;
	var match;
	
	var validOldAlias = false;
	var validNewAlias = false;
	
	// check the old alias
	if(oldAlias == null || oldAlias == "")
	{
		validOldAlias = true;
	}
	else
	{
		pattern = new RegExp("^m[0-9]+$");
		match = pattern.exec(oldAlias);
	
		if (match == null)
		{
			validOldAlias = false;
		}
		else
		{
			validOldAlias = true;
		}
	}
    
    // check the new alias
    if(newAlias == null || newAlias == "")
	{
		validNewAlias = false;
	}
	else
	{
		pattern = new RegExp("^a[0-9]+$");
		match = pattern.exec(newAlias);
	
		if (match == null)
		{
			validNewAlias = false;
		}
		else
		{
			validNewAlias = true;
		}
	}
	
	return validOldAlias && validNewAlias;
}


/**
 * This function is used to check whether this field will be moved from m* to a* automatically,
 * all the field that will be moved automatically are listed in the upgradeTableAliasChanges.changes
 *
 * @param {character} dbdictName	-  The dbdict name, e.g. Approval
 * @param {character} fieldName		-  The field name, e.g. current.pending.groups
 * @param {character} fieldType		-  The field type, e.g. 8(array)
 */
function isMoved2AliasAuto(dbdictName, fieldName, fieldType) 
{
	var changes = lib.upgradeTableAliasChanges.getAliasChanges();

	var i, j, k;
		
	for(i = 0; i < changes.length; i++)
	{
		if(changes[i].table == dbdictName)
		{
			for(j = 0; j < changes[i].change.length; j++)
			{
				if(fieldType == 8)
				{
					if(changes[i].change[j].array == fieldName)
					{
						return true;
					}
				}
				else
				{
					for(k = 0; k < changes[i].change[j].field.length; k++)
					{
						if(changes[i].change[j].field[k].name == fieldName)
						{
							return true;
						}
					}
				}
			}
		}
	}
	
	changes = lib.upgradeTableAliasChanges.getAliasPreChanges();
	
	for(i = 0; i < changes.length; i++)
	{
		if(changes[i].table == dbdictName)
		{
			for(j = 0; j < changes[i].change.length; j++)
			{
				if(fieldType == 8)
				{
					if(changes[i].change[j].array == fieldName)
					{
						return true;
					}
				}
				else
				{
					for(k = 0; k < changes[i].change[j].field.length; k++)
					{
						if(changes[i].change[j].field[k].name == fieldName)
						{
							return true;
						}
					}
				}
			}
		}
	}
	
	return false;
}

