/*
	QCRQ1E53294
	
	Script Lib for change field type before the upgrade process.
	@author Liu, Yong-liang
	
	Fix defect QCCR1E68319 by Tod
	when create a new field in dbdict, if the sql.data.options(sql data type) fields is null, 
	SM rte will create new field following the setting record from "sqlhints" table
	If there is no record in "sqlhints" table, SM always has a default value.
	
*/

/**
* A list of fields whose type should be changed in the pre-upgrade process.
* The changeListObjects is dependent on the target SM version. 
*
* This list may need to change upon the release of SM upgrade  utility of every minor release.
*
*/
var changeListObjects = [	
	{
		"tableName":"rootcausetask",
		"fields":
		[{
			"fieldName":"workaround",
			"oldFieldName":"workaround.old",
			"newFieldType":lib.DataTypeConst.typeArray(),
			"subFieldType":lib.DataTypeConst.typeCharacter()
		}]
	},
	{
		"tableName":"Rule",
		"fields":
		[{
			"fieldName":"tablename",
			"oldFieldName":"tablename.old",
			"newFieldType":lib.DataTypeConst.typeArray(),
			"subFieldType":lib.DataTypeConst.typeCharacter()
		}]
	}	
	/*,
	{
		"tableName":"FolderRights",
		"fields":
		[{
			"fieldName":"delete",
			"oldFieldName":"delete.old",
			"newFieldType":lib.DataTypeConst.typeCharacter(),
			"subFieldType":null,
			"rdbmsFieldType":null
		},	
		{
			"tableName":"FolderRights",
			"fieldName":"close",
			"oldFieldName":"close.old",
			"newFieldType":lib.DataTypeConst.typeCharacter(),
			"subFieldType":null,
			"rdbmsFieldType":null
		}]
	}*/
	];
	
var changeListRcformat = [	
	{
		"tableName":"htmltemplates",
		"fields":
		[{
			"fieldName":"htmlcode",
			"rcformat":true
		}]
	}
	];
	
var BOOLEAN_TRUE = ["TRUE","T","YES","Y",];
var BOOLEAN_FALSE = ["FALSE","F","NO","N",];

var fieldTypes = ["number", "character", "date/time", "logical", "label", "record", "offset", "array", "structure", 
					"operator", "expression", "pseudofield", "global var", "local var", "field"];

var changeNameObjects = [
        {
            "tableName":"calendarFilter",
            "versions":["9.32", "9.33"],
            "fields":
                [{
                    "fieldName":"value",
                    "renamedFieldName":"values.old"
                },
                {
                    "fieldName":"values",
                    "renamedFieldName":"values.old"
                }],
            "preaction": "removeCalendarFilterTable()"
        }
    ];


function updateDbdictFieldTypeChanges() {
    changeTypeOfFields();
    changeNameOfFields();
    changeRcformatOfFields();
    lib.upgradeTableAliasChanges.applyTableAliasPreChanges();
    
}

function changeNameOfFields() {
    lib.upgradeLog.upgrade("Applying field name changes ...");
    lib.upgradeLog.detail("Applying field name changes ...");
    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    var i, j, k;
    for (i=0; i<changeNameObjects.length; i++) {
        var versions = changeNameObjects[i].versions;
        var validated = false;
        for(j=0; j<versions.length; j++) {
            if (fromVersion.indexOf(versions[j]) == 0) {
                validated = true;
                break;
            }
        }
        
        if (validated) {
            if (changeNameObjects[i].preaction != null) {
                var rc = eval(changeNameObjects[i].preaction);
                if (rc) {
                    return;
                }
            }
            
            var tableName = changeNameObjects[i].tableName;
            var fields = changeNameObjects[i].fields;
            var fDbdict = getSchema(tableName);
            if (fDbdict) {
                lib.upgradeLog.detail("Applying field type changes for table: " + tableName);
                for (k=0; k<fields.length; k++) {
                    var index = indexOfField(fDbdict, fields[k].fieldName, true);
                    if (index != null) {
                        fDbdict = renameField(fDbdict,index.allLevelIndex,fields[k].renamedFieldName);
                        lib.upgradeLog.detail("The field " + fields[k].fieldName + " is renamed to " + fields[k].renamedFieldName);
                    }
                }
                lib.upgradeLog.detail("Finished applying field type changes for table: " + tableName);
            }
        }
    }
    
    lib.upgradeLog.upgrade("Finished applying field name changes. Check detail.log for more information.");
}

function removeCalendarFilterTable() {
    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"calendarFilter\"");
    if (dbdict != null) {
        var file = lib.upgradeUtility.getRecord("calendarFilter", "true");
        if (file != null) {
            return false;
        }
        
        var rc = dbdict.doRemove();
        if (rc == RC_SUCCESS) {
            lib.upgradeLog.detail("The dbdict calendarFilter is removed.");
            return true;
        }
    }
    
    return false;
}

/**
* 
* read data from changeListObjects and perform all field changes before the process of upgrade dbdict.
*/
function changeTypeOfFields() {
	
	//Applying required schema changes (1 table(s) )...
  	lib.upgradeLog.scUpgrade(1101,[changeListObjects.length]);
  	lib.upgradeLog.scDetail(1101,[changeListObjects.length]);
  	
  	//for every table
  	var i, j;
	for (i=0;i<changeListObjects.length;i++) {
	
		//check whether the table exist
		var fDbdict = getSchema([changeListObjects[i].tableName]);
		if(fDbdict == null)
		{
			continue;
		}
		
		//Applying required schema changes for table: rootcausetask
	  	lib.upgradeLog.scDetail(1102,[changeListObjects[i].tableName]);
  		
  		//for every fields
  		for (j=0;j<changeListObjects[i].fields.length;j++) {
  		
  			//check whether the field exist
  			if (indexOfField(fDbdict, changeListObjects[i].fields[j].fieldName) == null) 
  			{
				continue;
			}
			
  			var sqlFieldOptions = getSqlTypeOfField(changeListObjects[i].tableName, changeListObjects[i].fields[j].fieldName);
			var oldField = 
				changeFieldType(changeListObjects[i].tableName,
					changeListObjects[i].fields[j].fieldName,
					changeListObjects[i].fields[j].oldFieldName,
					changeListObjects[i].fields[j].newFieldType,
					changeListObjects[i].fields[j].subFieldType,
					sqlFieldOptions);
	
			if (oldField!=null && oldField.index !=null) {
				migrateData(changeListObjects[i].tableName,
					oldField.name,
					changeListObjects[i].fields[j].fieldName,
					changeListObjects[i].fields[j].newFieldType);					

				//update changeListObjects
				changeListObjects[i].fields[j].oldFieldLevelOneIndex = oldField.index.levelOneIndex;
				changeListObjects[i].fields[j].newFieldLevelOneIndex = oldField.index.newFieldLevelOneIndex;				
			}
		}
		//Finished applying required schema changes for table: rootcausetask
	  	lib.upgradeLog.scDetail(1112,[changeListObjects[i].tableName]);		
		
	}	
	
	//Finished applying required schema changes (1 table(s) )	
  	lib.upgradeLog.scUpgrade(1119);
}

/**
* Method: changeFieldType
*
* change the type of the table denoted by the tableName.
*
* @param scFile - SCFile
* @param fieldName - field.name
* @param oldFieldName - what name to rename the field
* @param fieldType - field.type
* @param subFieldType - if field.type is "Array", then a sub type should be provided.
* @param sqlFieldOptions - if rdbms field type is to be changed, then the related rdbms field type should be provided.
*
* return an object containing the index and the name of the old field in the dbdict;
*			the index of the field is -1 is the field need not to be renamed.
*/
function changeFieldType(tableName,fieldName,oldFieldName,fieldType,subFieldType,sqlFieldOptions) {
	//set default oldFieldName to "%fieldName%.old"
	var targetFieldName = oldFieldName;
	if (oldFieldName ==null) {
		targetFieldName = fieldName + ".old";
	}
	
	//set default subFieldType to "character"
	var subType = subFieldType;
	if (fieldType == lib.DataTypeConst.typeArray() && subFieldType == null) {
		subType = lib.DataTypeConst.typeCharacter();
	}
	
	var fDbdict = getSchema(tableName);
	var newIndex = 0;
	var oldField;
	
	if (fDbdict) {
	  	//Target field change:[dbdict:rootcausetask,field:workaround,type:8]
	  	lib.upgradeLog.scDetail(1103,[getFieldDescription2(tableName,fieldName,fieldType)]);
	  	
		var index = indexOfField(fDbdict, fieldName);
		if (index != null) {
			if (isSameFieldType(fDbdict, index.allLevelIndex, fieldType)) {								

				oldField = {"index":null,"name":fDbdict.field[index.allLevelIndex].name};
			} else {
				fDbdict = renameField(fDbdict,index.allLevelIndex,targetFieldName);
				if (fDbdict != null) {
					//add the new field					
					newIndex = addNewField(fDbdict,fieldName,fieldType,subType,index.levelOneIndex,sqlFieldOptions);
					
					index.newFieldLevelOneIndex = newIndex;					
					oldField = {"index":index,"name":fDbdict.field[index.allLevelIndex].name};
				} else {
					oldField = null;
				}		
			}
		} else {
		  	//The field: [dbdict:rootcausetask,field:workaround] cannot be found, a new field : [dbdict:rootcausetask,field:workaround,type:8] will be added
		  	lib.upgradeLog.scDetail(1104,[getFieldDescription3(fDbdict.name,fieldName,fieldType),getFieldDescription2(fDbdict.name,fieldName,fieldType)]);
		
			//the new field should be added anyway
			newIndex = addNewField(fDbdict, fieldName,fieldType, subType, -1, sqlFieldOptions);

			oldField = null;
		}
		
	} else {
		//Failed applying required schema changes for table: rootcausetask
		lib.upgradeLog.scError(1118, [tableName]);
		oldField = null;
	}
	return oldField;
}

function changeRcformatOfFields() {
	
	//Applying required schema changes (1 table(s) )...
  	lib.upgradeLog.upgrade("Applying field sql.rcformat changes in "+ changeListRcformat.length +" table(s) ...");
  	lib.upgradeLog.detail("Applying field sql.rcformat changes in "+ changeListRcformat.length +" table(s) ...");
  	
  	//for every table
  	var i, j, k;
	for (i=0;i<changeListRcformat.length;i++) {
		//check whether the table exist
		var fDbdict = getSchema([changeListRcformat[i].tableName]);
		if(fDbdict == null)
		{
			continue;
		}
		
		//Applying required schema changes for table
	  	lib.upgradeLog.detail("Applying field sql.rcformat changes for table: " + changeListRcformat[i].tableName);
  		
  		var update = false;
  		//for every fields
  		for (j=0;j<changeListRcformat[i].fields.length;j++) {
  		    var length = fDbdict.field.length(); 
  		    for (k=0; k<length; k++) {
  		        if (fDbdict.field[k].name == changeListRcformat[i].fields[j].fieldName) {
  		            if (fDbdict.field[k].sql_field_options.sql_rcformat != changeListRcformat[i].fields[j].rcformat) {
  		                update = true;
  		                fDbdict.field[k].sql_field_options.sql_rcformat = changeListRcformat[i].fields[j].rcformat;
  		            }
  		            break;
  		        }
  		    }
		}
		
		if (update) {
		    fDbdict.doUpdate();
		}
		//Finished applying required schema changes for table: rootcausetask
	  	lib.upgradeLog.detail("Finished applying field sql.rcformat changes for table: " + changeListRcformat[i].tableName);		
		
	}	
	
	//Finished applying required schema changes (1 table(s) )	
  	lib.upgradeLog.upgrade("Finished applying field sql.rcformat changes. Check detail.log for more information.");
  	lib.upgradeLog.detail("Finished applying field sql.rcformat changes.");
}

/**
* Method: getSchema

 *Check if the table exists in the dbdict.
 *
* @param table - name of the table
*
* return an instance of SCFile denoted by the tableName.
*/
function getSchema(tableName) {
	var fDbdict = new SCFile("dbdict");
	var rc= fDbdict.doSelect("name=\"" + tableName + "\"");
	if ( rc == RC_SUCCESS ) {
		return fDbdict;
	} else {
	  //Could not get schema for the table: rootcausetask
	  //lib.upgradeLog.scError(1114,[tableName]);
	  return null;
	}
}

/**
* Method: indexOfField
*
 *Check if the field exists in the table.
* @param scFile - SCFile
* @param fieldName - field.name
*
* return the indexes of the field
*/
function indexOfField(scFile,fieldName, deep) {
	if (deep == null) {
	    deep = false;
	}
	
	var i, length = scFile.field.length();
	for (i=0; i < length; i++) {       
	    //field should be level 1
  		if ((deep || scFile.field[i].level == 1) && scFile.field[i].name == fieldName) {
			//found
			return {"allLevelIndex":i,"levelOneIndex":scFile.field[i].index};
  		}
  	}
  	//not found
  	return null;
}

/**
* Method: isSameFieldType
* check the type of the field matches the specified type.
* Note: cannot change the type of a field of complex data type for the time being. If This is required then modification of this program is needed.
*
* @param scFile - SCFile
* @param fieldIndex - field.index
* @param fieldType - field.type
*
*  return true, if the field type matches the specified type; or if the source type is a complex type;
*		false, otherwise;
*/
function isSameFieldType(scFile, fieldIndex, fieldType) {  	
	if (scFile.field[fieldIndex].type == fieldType) {
		//The field: [dbdict:rootcausetask,field:workaround,type:8] already exists!	
		lib.upgradeLog.scDetail(1106,[getFieldDescription(scFile,fieldIndex)]);	
		//matches
		return true;
	} else {
		//cannot process complex data type for the time being
		if (scFile.field[fieldIndex].type > 4) {
			lib.upgradeLog.detail("Skipping the type change for the field: " + getFieldDescription(scFile,fieldIndex)
				+". Cannot change the type of a field of complex data type for the time being.");
			return true;
		} else {
			//The field: [dbdict:rootcausetask,field:workaround,type:2] has been found and will be changed to type:8
		  	lib.upgradeLog.scDetail(1105,[getFieldDescription(scFile,fieldIndex), fieldTypes[funcs.val(fieldType)-1]]);		
			return false;
		}
	}
}

/**
* get field description for outputing to log file.
* format: [dbdict:field:type]
*/
function getFieldDescription(scFile,fieldIndex) {
	return "[dbdict:"+scFile.name+",field:"+scFile.field[fieldIndex].name+",type:"
					+ fieldTypes[funcs.val(scFile.field[fieldIndex].type)-1]+"]";
}

/**
* get field description for outputing to log file.
* format: [dbdict:field:type]
*/
function getFieldDescription2(dbdict,field,type) {
	return "[dbdict:"+dbdict+",field:"+field+",type:"+fieldTypes[funcs.val(type)-1]+"]" ;
}

/**
* get field description(without field type) for outputing to log file.
* format: [dbdict:field]
*/
function getFieldDescription3(dbdict,field,type) {
	return "[dbdict:"+dbdict+",field:"+field+"]" ;
}
/**
* Method: renameField

* rename the field and the related slq name.
*
* @param scFile - SCFile
* @param fieldIndex - field.index
* @param fieldName - field.name
*
* return the modified scfile.
*/
function renameField(scFile,fieldIndex, fieldName) {  		
	var newName = fieldName;
	var oldName = scFile.field[fieldIndex].name;
	
	if (indexOfField(scFile,fieldName) == null) {
		//the specified old field name is identical
		scFile.field[fieldIndex].name = fieldName;
		scFile.field[fieldIndex].sql_field_options.sql_column_name = fieldName.replace(/\./g, "").toUpperCase();
	} else {
		//specify another field name, by appending ".x" to the specified old field name
		var i=1;
		while (indexOfField(scFile,fieldName+"."+i)!=null) {
			i++;
		}
		newName = fieldName+"."+i;
		
		scFile.field[fieldIndex].name = newName;
		scFile.field[fieldIndex].sql_field_options.sql_column_name = newName.replace(/\./g, "").toUpperCase();
	}
		
	if (submit(scFile)) {
		//The field: [dbdict:rootcausetask,field:workaround,type:2] has been renamed to workaround.old
		lib.upgradeLog.scDetail(1107,[getFieldDescription2(scFile.name,oldName,scFile.field[fieldIndex].type),newName]);	
		return scFile;
	} else {
		return null;
	}
}

/**
* Method: createField

* construct a field with the specified values.
*
* @param scFile - SCFile
* @param fieldName - field.name
* @param level - field.level
* @param index - field.index
* @param fieldType - field.type
* @param subFieldType - if field.type is "Array", then a sub type should be provied.
*
* return the field created.
*/
function createField(scFile,fieldName,level,index,fieldType,subFieldType,sqlFieldOptions) {
    // a field is of type of structure
	var field = new SCDatum();
	field.setType(lib.DataTypeConst.typeStructure());
	field.push(fieldName);
	field.push(level);
	field.push(index);
	
	//type
	if (fieldType == null) {
		field.push(subFieldType);
	} else {
	   field.push(fieldType);
	}
	
	//structure
	field.push(null);
	
	//db2.field.name
	field.push(null);	
	
	//db2.length
	field.push(null);
	
	//sql.field.options
	//var sqlFieldOptions = createStructure([null,null,rdbmsFieldType,false]);  
	field.push(sqlFieldOptions);
	
	//structure.array.options
	var structArrayOptions = createStructure([false,null,null,false]);	
	field.push(structArrayOptions);
	
	return field;
}

/**
* Create structure-typed property for  a field.
*/
function createStructure(array) {
	var struct = new SCDatum();
	struct.setType(lib.DataTypeConst.typeStructure());
	for (var i=0; i<array.length; i++) {
		struct.push(array[i]);
	}
	return struct;
	
}

/**
* Method: getMaxFieldIndex
*
* get the max index value of the field of the table.
* 
* @param scFile - SCFile
*
* return the max index value
*/
function getMaxFieldIndex(scFile) {
  var max=1;
  var i, length = scFile.field.length();
  for (i=0;i<length;i++) { 
     //field should be level 1
    if (scFile.field[i].level == 1) {   
        max = funcs.max(max, scFile.field[i].index);
    }
  }                                      
  return max; 	
}

/**
* Method: getIndexForNewField
*
* get the index value for creating a new field in the table.
* 
* @param scFile - SCFile
* @param fieldName - name of the field
* @param oldFieldIndex - index of the old field that has been renamed before this adding operation
* return the index value
*/
function getIndexForNewField(scFile,fieldName,oldFieldIndex) {
	var alias = findFieldAlias(scFile,fieldName,oldFieldIndex);
  	if (alias) {
	  	return alias.newFieldLevelOneIndex	;	  		
  	}
	 return getMaxFieldIndex(scFile)+1;

}

function findFieldAlias(scFile,fieldName,oldFieldIndex) {
	if (oldFieldIndex==-1) {
		return null;
	}
	
	var i, j;
	for (i=0;i<changeListObjects.length;i++) {
  		if (changeListObjects[i].tableName==scFile.name) {  		
	  		//as field and its alias has the same index value, they have to be changed together
	  		for (j=0;j<changeListObjects[i].fields.length;j++) {
	  			//the new fields of field and alias has the same index value too
	  			if (changeListObjects[i].fields[j].oldFieldLevelOneIndex != null 
	  				&& oldFieldIndex==changeListObjects[i].fields[j].oldFieldLevelOneIndex) {
	  				return changeListObjects[i].fields[j];
	  			}
	  		}	 		
	  		return null;
	  	}
  	}
}

/**
* Method: addNewField
*
* add the field to dbdict.
* @param scFile - SCFile
* @param fieldName - field.name
* @param fieldType - field.type
* @param subFieldType - if field.type is "Array", then a sub type should be provied.
* @param oldFieldIndex - index of the old field that has been renamed before this adding operation
* 
* return the index of the new filed in the table,
*			or -1, if the field add operation failed.
*/
function addNewField(scFile, fieldName, fieldType, subFieldType, oldFieldIndex, sqlFieldOptions) {  	
	 //field
	var newIndex =	getIndexForNewField(scFile,fieldName,oldFieldIndex);
    var field;
    
    if (fieldType == lib.DataTypeConst.typeArray()) {
		field = createField(scFile, fieldName, 1, newIndex, fieldType, null);
		scFile.field.push(field);
		 //sub field
		field = createField(scFile, fieldName, 2, 1, null, subFieldType, sqlFieldOptions);		 		
		scFile.field.push(field);
	} else {
		field = createField(scFile, fieldName, 1, newIndex, fieldType, sqlFieldOptions);
		scFile.field.push(field);
	}
	  
	if (submit(scFile)) {	
		//New field added: [dbdict:rootcausetask,field:workaround,type:8]  		
  		lib.upgradeLog.scDetail(1108,[getFieldDescription2(scFile.name,fieldName,fieldType)]);
  		return newIndex;
  	} else {
  		return -1;
  	}
}

/*
	 all changes to SM dbdict and backend Database.
	@param scFile - SCFile
	
	return ture, if the submit succed; false otherwise.
*/
function submit(scFile) {  
	//update to backend RDBMS TABLE
	if (updateDB(scFile) == true) {
		//update dbdict
		if (scFile.doUpdate() == RC_SUCCESS) {
			return true;
		} else {
			//Update of dbdict:rootcausetask failed
			lib.upgradeLog.scError(1115,[scFile.name]);
			return false;
		}
	} else {
		//Update of RDBMS table schema:rootcausetask failed
		lib.upgradeLog.scError(1116,[scFile.name]);
		return false;
	}
}


/**
* Method: updateDB
*
* Update field in the backend RDBMS TABLE
*/
function updateDB(scFile) {
	var rteReturnValue ;
	var rteNames = new SCDatum();
	var rteValues = new SCDatum(); 		
	rteNames.push("record"); 		  
	rteNames.push("all.null");
	rteNames.push("boolean1");
	rteValues.setType(8);
	
	rteValues=funcs.insert(rteValues, 0, 1, scFile);
	rteValues=funcs.insert(rteValues, 0, 1, true);
	rteValues=funcs.insert(rteValues, 0, 1, true);
	rteReturnValue = new SCDatum();
	
	//this rad app will have to run in the same thread
	var result = funcs.rtecall("callrad", 
							rteReturnValue, 
							"dbdict.sql.changes", //RAD app name
							rteNames, 
							rteValues,
							false); //false to run in same thread, true to run in new thread
	
	return 	result;
}

/**
* Method: getTableData

 *get the data from the specified table.
 *
* @param table - name of the table
*
* return an instance of SCFile denoted by the tableName.
*/
function getTableData(tableName,fromFieldName) {
	var fData = new SCFile(tableName);
	var rc = fData.doSelect(fromFieldName + " ~=NULL or "+ fromFieldName + " ~=\"\"");
	if (rc == RC_SUCCESS) {
		return fData;
	} else {
	  //No field data to be migrated for the table:rootcausetask
		lib.upgradeLog.scDetail(1113,[tableName]);
		return null;
	}

}
/**
 *Method: migrateData
 *
* change the type of the table denoted by the tableName.
*
* @param tableName - the name of the table
* @param fromFieldName - the field name of the field in dbdict, from which data are to be migrated
* @param fieldName - the new field name after renaming
* @param fieldType - field.type
*
* return true, if the data migrated successfully;
*		false, if the table not exists or the data migrated unsuccessfully;
*/
function migrateData(tableName,fromFieldName,fieldName,fieldType){	
	
	var scFile = getTableData(tableName,fromFieldName);
	var fieldValueInUpperCase;
	
	if (scFile != null) {
	    var query = fromFieldName + " ~=NULL or "+ fromFieldName + " ~=\"\"";
	    
		//get record count
		var size = scFile.doCount(query);
		//Totally %RECORD_COUNT% field data to be migrated  from workaround.old to workaround
		lib.upgradeLog.scDetail(1111,[size,fromFieldName,fieldName]);
		
		//Migrating field data from workaround.old to workaround
		lib.upgradeLog.scDetail(1109,[fromFieldName,fieldName]);

		var rc = scFile.doSelect(query);
		while (rc == RC_SUCCESS) {
			if (fieldType == lib.DataTypeConst.typeArray()) {
				scFile[fieldName][0] = scFile[fromFieldName];
			} else if(fieldType == lib.DataTypeConst.typeCharacter()) {
				scFile[fieldName] = String(scFile[fromFieldName]);	
							
			} else if(fieldType == lib.DataTypeConst.typeBoolean()) {
				fieldValueInUpperCase = String(scFile[fromFieldName]).toUpperCase();
				
				if (isItemInArray(BOOLEAN_TRUE,fieldValueInUpperCase)) {
					scFile[fieldName] = true;			
				} else if(isItemInArray(BOOLEAN_FALSE,fieldValueInUpperCase)) {
					scFile[fieldName] = false;	
				} else {
					scFile[fieldName]=Boolean(fieldValueInUpperCase);			
				}
				
			} else if(fieldType == lib.DataTypeConst.typeNumber()) {
				scFile[fieldName] = Number(scFile[fromFieldName]);
			} else if(fieldType == lib.DataTypeConst.typeDateTime()) {
				scFile[fieldName] = Date.parse(scFile[fromFieldName]);
			} else {
				scFile[fieldName] = scFile[fromFieldName];
			}
			
			if (scFile.doUpdate() != RC_SUCCESS) {	
				//Field data migration  from workaround.old to  workaround failed
				lib.upgradeLog.scError(1117,[fromFieldName,fieldName]);
				return false;
			}
		    
		    rc = scFile.getNext();	
		}
				
		//Finished migrating field data  from workaround.old to workaround
		lib.upgradeLog.scDetail(1110,[fromFieldName,fieldName]);
		return true;
	}

	return false;
}

function isItemInArray(array,item) {
	return array.toString().indexOf(item) >= 0;
}

/**
	change the rdbms data type for a field if needed.
	the change will be performed if and only if the new field length is greater than the old field length.
		
	@param fDbdict, dbdict
	@param newIndex, index of the field
	@param rdbmsFieldType, the rdbms data type
	
	return true, if the type changed successfully; false, otherwise.
*/
function changeRdbmsFieldType(fDbdict, newIndex, rdbmsFieldType) {
	var oldType = fDbdict.field[newIndex].sql_field_options[2];
	var oldLen = oldType.match(/\d+/);
	var newLen = rdbmsFieldType.match(/\d+/);
	if (oldType.toUpperCase() != rdbmsFieldType.toUpperCase() 
			&& (oldLen==null || newLen==null || (oldLen!=null && newLen!=null && Number(oldLen) <= Number(newLen)))) {
		fDbdict.field[newIndex].sql_field_options[2] = rdbmsFieldType;

		if (submit(fDbdict)) {			
		  	lib.upgradeLog.detail("The RDBMS data type of the field: " + getFieldDescription(fDbdict,newIndex) +" changed: " + oldType + "-->" + rdbmsFieldType);
			return true;
		} else {
			return false;
		}
	}
	
}

/**
*	Get the sql.field.options from dbdict
*
*	@param	table  table name of dbdict
*	@param	field  field name of dbdict
*	@return  sql.field.options
*/
function getSqlTypeOfField(table, field) {
	var dbdict = getSchema(table);
	if (dbdict != null) {
	    var i, length = dbdict.field.length();
		for (i=0; i < length; i++) {      
	  		if (dbdict.field[i].name == field) {
				return dbdict.field[i].sql_field_options;
	  		}
	  	}
	}
	// can not find this dbdict
	return null;
}

