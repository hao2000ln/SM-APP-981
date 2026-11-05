/**
*  This method is used to migrate the fields from source dbdict to the target dbdict 
*  
*  @param  sourceTableName  old SM dbdict scfile
*  @param  targetTableName  new SM dbdict scfile
*  @param  sourceTableFieldList  OOB source dbdict field list
*  @param  fieldsMapping  fields mapping list used to extend the field db field length. e.g. The source field length is VARCHAR2(100) and target field is VARCHAR2(60),
*                         then the target field legnth will be extended to VARCHAR2(100)	
*  @return  addedFieldList   list of added fields from source dbdict to target dbdict
**/
function migrateDbdict(sourceTableName, targetTableName, sourceTableFieldList, fieldsMapping){

	//add the new added fields in the sourceTable
	
	var sourcedbdict = lib.upgradeDbdictChangeFieldType.getSchema(sourceTableName);
	
	var targetdbdict = lib.upgradeDbdictChangeFieldType.getSchema(targetTableName);
	
	var addedFieldList = addNewFields(sourcedbdict,targetdbdict,sourceTableFieldList);
	
	applyFieldLengthChange(targetdbdict,sourcedbdict,fieldsMapping);
	
	return addedFieldList;

}


/**
*  This method is used to add the fields from  source dbdict to target dbdict
*  
*  @param  sourceTableName  old SM dbdict scfile
*  @param  targetTableName  new SM dbdict scfile
*  @param  sourceTableFieldList  OOB source dbdict field list
*  @return  addedFieldList   list of added fields from source dbdict to target dbdict
**/
function addNewFields(sourcedbdict,targetdbdict,sourceTableFieldList){

	var STRUCTURE_TYPE_CONSTANT = system.library.DataTypeConst.typeStructure();
	
	var ARRAY_TYPE_CONSTANT = system.library.DataTypeConst.typeArray();
	
	var addedFieldList = {};
	
	var sourceDbdictLength = sourcedbdict.field.length();
	
	var oldLevelOneFieldIndex =1;
	
	for (var i=0; i < sourceDbdictLength; i++) { 
            
            var fieldName = sourcedbdict.field[i].name;
	        var fieldType = sourcedbdict.field[i].type;
	        var fieldLevel = sourcedbdict.field[i].level; 
	        var sqlFieldOptions = sourcedbdict.field[i].sql_field_options;
	        var newIndex = -1;     
	        var field =null;
	       
	      
	        //if the field is a alias field , skip it 
	        if (i> 0 && sourcedbdict.field[i].level ==1 && sourcedbdict.field[i].index != oldLevelOneFieldIndex){
	            oldLevelOneFieldIndex = sourcedbdict.field[i].index;
	        }else {
	        	continue;
	        }
	        
            
	  		if (!lib.ArrayUtil.contains(sourceTableFieldList,fieldName) 
	  		                       && fieldLevel ==1
	  		                       && lib.tableFunctions.getFieldIndex(fieldName, targetdbdict.name) ==-1 ){
	  		                        
	  		                                                                                                 
		       var isTobeAdded = true ;
		       var subIndex = 1;
		       
	  		   if(ARRAY_TYPE_CONSTANT == fieldType){
	  		   
	  		   	     if(sourcedbdict.field[i+1].type != STRUCTURE_TYPE_CONSTANT ){//add simple array type fields
	  		   	        
	  		   	        newIndex =	lib.upgradeDbdictChangeFieldType.getIndexForNewField(targetdbdict,fieldName,null);
	  		   	     	field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, fieldName, 1, newIndex++, fieldType, null);
	  		   	     	targetdbdict.field.push(field);
	  		   	     	
	  		   	     	var j = i+1;
	  		   	     	subIndex = 1;
	  		   	     	field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, sourcedbdict.field[j].name, 2, subIndex, sourcedbdict.field[j].type, sourcedbdict.field[j].sql_field_options);
	  		   	        targetdbdict.field.push(field);

	  		   	        //lib.upgradeDbdictChangeFieldType.addNewField(targetdbdict,fieldName, fieldType, sourcedbdict.field[i+1].type, -1, sqlFieldOptions);
	  		   	        
	  		   	     }else {//add array of structure fields
	  		   	         
	  		   	     	 newIndex =	lib.upgradeDbdictChangeFieldType.getIndexForNewField(targetdbdict,fieldName,null);
	  		   	     	 field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, fieldName, 1, newIndex++, fieldType, sqlFieldOptions);
	  		   	     	 targetdbdict.field.push(field);
	  		   	     	 field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, fieldName, 2, 1, STRUCTURE_TYPE_CONSTANT, null);
	  		   	     	 targetdbdict.field.push(field);
	  		   	     	 
	  		   	     	 var j = i+2;
	  		   	     	 while (sourcedbdict.field[j].level == 3 ){
	  		   	     	    if(sourcedbdict.field[j].type !== STRUCTURE_TYPE_CONSTANT && sourcedbdict.field[j].type !== ARRAY_TYPE_CONSTANT  ){
	  		   	     	      field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, sourcedbdict.field[j].name, 3, subIndex++, sourcedbdict.field[j].type, null);
	  		   	     	      targetdbdict.field.push(field);
	  		   	     	    } else {
	  		   	     	      targetdbdict = lib.upgradeDbdictChangeFieldType.getSchema(targetdbdict.name);
	  		   	     	      isTobeAdded =false;
	  		   	     	      break;
	  		   	     	    } 
	  		   	     	    
	  		   	     	    j++;	     
	  		   	     	 }
	  		   	     	 
	  		   	     }
	  		   
	  		   } else if (STRUCTURE_TYPE_CONSTANT == fieldType){//Add structure field	  		   
	  		            newIndex =	lib.upgradeDbdictChangeFieldType.getIndexForNewField(targetdbdict,fieldName,null);
	  		   	     	field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, fieldName, 1, newIndex++, fieldType, sqlFieldOptions);
	  		   	     	targetdbdict.field.push(field);
	  		   	     	
	  		   	     	var j = i+1;
	  		   	     	subIndex = 1;
	  		   	     	while (sourcedbdict.field[j].level == 2 ){
	  		   	     	    if(sourcedbdict.field[j].type !== STRUCTURE_TYPE_CONSTANT && sourcedbdict.field[j].type !== ARRAY_TYPE_CONSTANT  ){
	  		   	     	    	field = lib.upgradeDbdictChangeFieldType.createField(targetdbdict, sourcedbdict.field[j].name, 2, subIndex++, sourcedbdict.field[j].type, null);
	  		   	     	   		targetdbdict.field.push(field);
	  		   	     	    }else {
	  		   	     	      targetdbdict = lib.upgradeDbdictChangeFieldType.getSchema(targetdbdict.name);//rollback the dbdict and get from db
	  		   	     	      isTobeAdded =false;
	  		   	     	      break;
	  		   	     	    } 
	  		   	     	    j++;	     
	  		   	     	}
	  		   	     
	  		   	        
	  		   
	  		   }else {//add simple type fields 
	  		    
	  		          lib.upgradeDbdictChangeFieldType.addNewField(targetdbdict, fieldName,fieldType, null, -1, sqlFieldOptions);
	  		   }
	  			
	  		if(isTobeAdded){
	  			lib.upgradeDbdictChangeFieldType.submit(targetdbdict);
                addMigrationPatchRecord("dbdict", targetdbdict, targetdbdict["name"], false);
	  		   	addedFieldList[fieldName]=fieldType;
	  		}
	  		
	  	   }
       }

   return addedFieldList;
}


/**
*  apply database field type change 
*  called in RAD: apm.upgrade.dbdict  merge.field panel
*  @param  oldfile  old SM dbdict scfile
*  @param  newfile  new SM dbdict scfile
*  @return  change status   true/false
**/
function applyFieldLengthChange(oldfile, newfile,fieldsMapping) {
	if (oldfile != null && newfile != null) {
		var dbdictObjArray = lib.upgradeDatabaseFieldTypeUpdate.createDbdictObjectArray(oldfile);
		var copyFromObjArray = lib.upgradeDatabaseFieldTypeUpdate.createDbdictObjectArray(newfile);
		var isFieldChanged = compareDbdictObjectArray(dbdictObjArray, copyFromObjArray, oldfile, newfile,fieldsMapping);
		if (isFieldChanged){
		     lib.upgradeDbdictChangeFieldType.submit(oldfile);
            addMigrationPatchRecord("dbdict", oldfile, oldfile["name"], false);
		}
		
	}
	
	return false;
}


/**
*  compare dbdict with upgradedbdict
*
*  @param  array1   old dbdict fields array
*  @param  array2   new dbdict fields array
*  @param  oldfile  old dbdict file
*  @param  newfile  new dbdict file
*  @param  fieldsMapping  new dbdict file
**/
function compareDbdictObjectArray(array1, array2, oldfile, newfile,fieldsMapping) {
	var changed = false;
	if (array1 != null && array2 != null) {
		for (var i=0; i<array1.length; i++) {
			for (var j=0; j<array2.length; j++) {	
				if (fieldsMapping[array1[i].name] == array2[j].name
					 && array1[i].level == array2[j].level) {
				    if (compareFields(array1[i], array2[j], oldfile.field[i], oldfile.name)) {
				    	changed = true;
				    }
					break;
				}
			}
		}
	}
	return changed;
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

	var currentType = oldObj.sqlDataType;
	var upgradeType = newObj.sqlDataType;
	
	var currentTypeObj;	
	var upgradeTypeObj;	
	var currentTypeIndex;
	var upgradeTypeIndex;
	
	
	
	if (currentType != null && upgradeType != null) 
	{
	
		//SQLSERVER and DB2 convert to Oracle
		upgradeTypeObj = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(upgradeType);	
		upgradeTypeIndex = upgradeTypeObj.index;
		currentTypeObj = lib.upgradeDatabaseFieldTypeUpdate.getSqlTypeIndex(currentType);	
	    currentTypeIndex = currentTypeObj.index;
		
		if (oldObj.smType == newObj.smType) 
		{
			// synchronize sql type for the log
			upgradeType = lib.upgradeDatabaseFieldTypeUpdate.convertSqlTypeByDb(currentTypeIndex, upgradeTypeIndex, currentType, upgradeType, currentTypeObj.ntype);  
			
			//SQL RC flag change will trigger RTE full table copy, disable it due to performace issue and log to expect log for workaround						
			if (lib.upgradeDatabaseFieldTypeUpdate.isLargeDataType(upgradeTypeIndex)) 
			{  
				lib.upgradeLog.scError(1157, [tableName, oldObj.name, "EMPTY", upgradeType]);  							
			} 
			else
			{
				// Log: Updating field SQL type table for %S in %S dbdict from %S to %S
				lib.upgradeLog.scDetail(1150, [oldObj.name, tableName, "EMPTY", upgradeType]);
				// we will only extend the field length and will not touch other dbdict changes									
				oldfilefield.sql_field_options.sql_data_type = upgradeType;			
				return true;
			}								
		}
		
		return false;
	}
							
	
	return false;
}



/**
*  Enlarge the charcter type field length to expected length if currently this field's length is less than the expected length.Only the first level field will be covered
*  
 *  @param  tableName         the table name.
*  @param  fieldName         the field name.
*  @param  expectedLength  the expected length of this field.
**/
function enlargeFieldLength(tableName, fieldName, expectedLength) {

  var SQL_TYPE_FULLNAME = {
						0 : [ ],
						1 : [ "VARCHAR" ,"VARCHAR2","VARCHAR", "VARCHAR"],
					   10 : [ "NVARCHAR", "NVARCHAR", "VARGRAPHIC" ],
						2 : [ ],
						3 : [ "CHAR", "CHAR", "CHAR" ],
					   30 : [ "NCHAR", "NCHAR", "GRAPHIC"],
						4 : [ "TEXT", "CLOB", "CLOB(1M) NOT LOGGED COMPACT"],
						5 : [ "VARBINARY", "RAW",  "VARCHAR(255) FOR BIT DATA"  ],
						6 : [ "IMAGE",     "BLOB", "BLOB(1M) NOT LOGGED COMPACT" ] 
					};	

  var FIELD_LENGTH_REGEX = /\((\d+)\)/;
  
  var dbdict = lib.upgradeDbdictChangeFieldType.getSchema(tableName);
  
  var dbdictLength = dbdict.field.length();
  
  var dbType = lib.upgradeDatabaseFieldTypeUpdate.getDbType();

  for (var i=0; i < dbdictLength; i++) {
  
    if(dbdict.field[i].level ==1 && dbdict.field[i].type==lib.DataTypeConst.typeCharacter() && dbdict.field[i].name == fieldName){
    
        var orgLength = dbdict.field[i].sql_field_options.sql_data_type.match(FIELD_LENGTH_REGEX)[1];
        
        if(parseInt(orgLength) <expectedLength){
  	    
        	dbdict.field[i].sql_field_options.sql_data_type = SQL_TYPE_FULLNAME[1][dbType] + "(" + expectedLength +")";
        
       	    lib.upgradeDbdictChangeFieldType.submit(dbdict);
                addMigrationPatchRecord("dbdict", dbdict, dbdict["name"], false);
        }
        
        break;
  
    }   
  }
    
}


/**
*  Add the alias name for the field specified
*  
 *  @param  tableName         the table name.
*  @param  fieldName         the field name.
*  @param  aliasName  the expected aliasName
**/
function addFieldAliasName(tableName, fieldName, aliasName) {
  
  var dbdict = lib.upgradeDbdictChangeFieldType.getSchema(tableName);
  
  var dbdictLength = dbdict.field.length();
  
  var dbType = lib.upgradeDatabaseFieldTypeUpdate.getDbType();

  for (var i=0; i < dbdictLength; i++) {
  
    if(dbdict.field[i].level ==1 && dbdict.field[i].name == fieldName){
    
        if(!isFieldAlreadyExist(tableName,aliasName)){
        
            var field = createField(dbdict, aliasName, 1, dbdict.field[i].index, dbdict.field[i].type, null);
            
            dbdict.field = funcs.insert(dbdict.field,i+2,1,field);
            
            dbdict.doUpdate();
                addMigrationPatchRecord("dbdict", dbdict, dbdict["name"], false);
            
        	break;
        	
        }
     }
   }   
    
}

/**
* Method: create a field to be added as the alias

* construct a field with the specified values.
*
* @param scFile - SCFile
* @param fieldName - field.name
* @param level - field.level
* @param index - field.index
* @param fieldType - field.type
*
* return the field created.
*/
function createField(scFile,fieldName,level,index,fieldType) {
    // a field is of type of structure
	var field = new SCDatum();
	field.setType(system.library.DataTypeConst.typeStructure());
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
	field.push(null);
	
	//structure.array.options
	field.push(null);
	
	return field;
}


/**
*  Check whether the field has already exist in the dbdict of table specified
*  
*  @param  tableName         the table name.
*  @param  fieldName         the field name.
**/
function isFieldAlreadyExist(tableName , fieldName){
	
  var dbdict = lib.upgradeDbdictChangeFieldType.getSchema(tableName);
  
  var dbdictLength = dbdict.field.length();

  for (var i=0; i < dbdictLength; i++) {
  
    if(dbdict.field[i].level ==1 && dbdict.field[i].name == fieldName){
    	return true;
    }
  }
  return false;
}



/**
*  This method is used to do data migration for the solution matching security option for Incident , Service Desk and Problem areas during the upgrade to ensure the 
*  solution matching behaviour is consistent with PD4 which is true by default
**/
function migrateSolutionMatchingSecuritySetting(){
   var rights = new SCFile("secRights");
   
   var sql , rc;
   
   var migratedAreaList = ["Incident"];
   
   for (var i=0; i<migratedAreaList.length ; i++){

	   sql = "area=\""+migratedAreaList[i]+"\"";
		
	   rc = rights.doSelect(sql);
		
	   while (rc == RC_SUCCESS){
		
			var length = rights.settingId.length();
			
			if(length ==0 ){//If the original settingId and settingValue for this secRights is empty , initialized it firstly via the save action
			
			   rights.doAction("save");
		
			}
			
			length = rights.settingId.length();
			
			for (var i=1; i<=length; i++){
			
				if(rights.settingId[i]=="use.solution.matching" 
				   && rights.settingValue[i]!=="true"&&rights.settingValue[i]!=="false"//
				){
				
				  rights.settingValue[i]="true";
				  rights.doUpdate();
				  break;
				
				}
			}
			
			   rc = rights.getNext();
	   }
	}

}

/**
 *  Add a pdmpatches record
 *
 *  @param  filename         the table name.
 *  @param  record         the record.
 *  @param  recordName         name of the record.
 *  @param  needManualCheck         whether manual check needed.
 **/
function addMigrationPatchRecord(filename, record, recordName, needManualCheck) {
    var tag=new SCDatum();
    funcs.rtecall("tag",1,tag,record);
    tag =tag.getText();
    var pdmPatch = new SCFile("pdmpatches");
    pdmPatch.filename = filename;
    pdmPatch.tag = tag;
    pdmPatch.recordName = recordName;
    pdmPatch.type = needManualCheck ? "manual" : "information";
    pdmPatch.doSave();

}