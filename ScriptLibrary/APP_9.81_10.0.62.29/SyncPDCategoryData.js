
var checkedTableMap = {"imCategory":["sdCategory","pbmCategory"],"imSubcategory":["sdSubcategory","pbmSubcategory"],"imArea":["sdArea","pbmArea"],
					    "sdCategory":["imCategory","pbmCategory"],"sdSubcategory":["imSubcategory","pbmSubcategory"],"sdArea":["imArea","pbmArea"],
					    "pbmCategory":["sdCategory","imCategory"],"pbmSubcategory":["sdSubcategory","imSubcategory"],"pbmArea":["sdArea","imArea"]
					   };


function syncCategoryData(record,oldrecord){
  var fieldMap = {"name":"name","active":"active","avail.post":"avail.post","company":"company"};  
  var categoryCustFields =[];
/**start to insert customized field list for category during the PD migration**/
/**end to insert customized field list for category during the PD migration**/
  var checkUniqueRecord = oldrecord ? oldrecord:record;//if have old record, means it's from update trigger
  var querySql = "name=\"" + checkUniqueRecord.name + "\"";
  copyRecordData("category",fieldMap,categoryCustFields,record,querySql);
  
}

function syncSubCategoryData(record,oldrecord ){
  var fieldMap = {"subcategory.name":"subcategory","category":"category","active":"active","company":"company"};  
  var subcategoryCustFields =[];
/**start to insert customized field list for subcategory during the PD migration**/
/**end to insert customized field list for subcategory during the PD migration**/
  var checkUniqueRecord = oldrecord ? oldrecord:record;//if have old record, means it's from update trigger
  var companyAppendString = checkUniqueRecord.company==null?" and company=NULL":" and company =\"" + checkUniqueRecord.company + "\"";
  var querySql = "category=\"" + checkUniqueRecord.category + "\" and subcategory=\"" + checkUniqueRecord.subcategory_name + "\"" + companyAppendString;  
  copyRecordData("subcategory",fieldMap,subcategoryCustFields,record,querySql);

}

function syncAreaData(record,oldrecord){
  var fieldMap = {"area.name":"product.type","subcategory":"subcategory","category":"category","active":"active","company":"company"};  
  var areaCustFields =[];
/**start to insert customized field list for producttype during the PD migration**/
/**end to insert customized field list for producttype during the PD migration**/
  var checkUniqueRecord = oldrecord ? oldrecord:record;//if have old record, means it's from update trigger
  var companyAppendString = checkUniqueRecord.company==null?" and company=NULL":" and company =\"" + checkUniqueRecord.company + "\"";
  var querySql = "product.type=\"" + checkUniqueRecord.area_name + "\" and category=\"" + checkUniqueRecord.category + "\" and subcategory=\"" + checkUniqueRecord.subcategory + "\"" + companyAppendString;
  copyRecordData("producttype",fieldMap,areaCustFields,record,querySql);

}

function deleteCategoryData(record){
  var querySql = "name=\"" + record.name + "\"";
  var deleted = deleteRecordData("category",system.functions.filename(record),querySql, querySql);
  if(deleted){
     deleteRelatedData("subcategory","category=\"" + record.name + "\"");
     deleteRelatedData("producttype","category=\"" + record.name + "\"");
  }
}

function deleteSubCategoryData(record){
  var companyAppendString = record.company==null?" and company=NULL":" and company =\"" + record.company + "\"";
  var querySql = "category=\"" + record.category + "\" and subcategory=\"" + record.subcategory_name + "\"" + companyAppendString;
  var checkedQuerySql = "category=\"" + record.category + "\" and subcategory.name=\"" + record.subcategory_name + "\"" + companyAppendString;
  var deleted = deleteRecordData("subcategory",system.functions.filename(record),querySql,checkedQuerySql);
  if(deleted){
     deleteRelatedData("producttype",querySql);
  }

}

function deleteAreaData(record){
  var companyAppendString = record.company==null?" and company=NULL":" and company =\"" + record.company + "\"";
  var querySql = "product.type=\"" + record.area_name + "\" and category=\"" + record.category + "\" and subcategory=\"" + record.subcategory + "\"" + companyAppendString;
  var checkedQuerySql = "area.name=\"" + record.area_name + "\" and category=\"" + record.category + "\" and subcategory=\"" + record.subcategory + "\"" + companyAppendString;
  var deleted = deleteRecordData("producttype",system.functions.filename(record),querySql,checkedQuerySql);
}


/**
 * This method is used to sync the pd category data to the legacy category data. We will only sync the defined field list and customized field list
 * 
 * @param {String}
 *            triggerName - The name of table to sync the record data
 * @param {String}
 *            fieldMap - The defined field map between the source table and target synced table
 * @param {String}
 *            customizedFields - The customized field list to sync the data 
 * @param {String}
 *            updatedRecord - The script method will be called for the trigger
 * @param {String}
 *            querySql - The sql to check whether the record to be synced has already existed in the target table.
 * 
 * @return void
 */
function copyRecordData(tableName, fieldMap,customizedFields,updatedRecord,querySql){
  var syncRecord = new SCFile(tableName);
  var rc = syncRecord.doSelect(querySql);
  for(var fieldName in fieldMap){
      syncRecord[fieldMap[fieldName]]=updatedRecord[fieldName];
      //fix QCCR1E121839 , Active will always be checked when synced back 
      if (fieldMap[fieldName] =="active" && updatedRecord[fieldName] ==null ){
         syncRecord['active'] = false;
      }
  };
  
  for (var i=0; i<customizedFields.length ; i++ ){   	 
   	 syncRecord[customizedFields[i]]=updatedRecord[customizedFields[i]];
  }
  
  if(rc == RC_SUCCESS){
    syncRecord.doUpdate();
  }else {
    syncRecord.doInsert();
  }
  
}

/**
 * This method is used to delete the related table records , e.g when a category record is deleted , the related subcategory and areas shall also be deleted
 * 
 * @param {String}
 *            tableName - The name of the table on which the related records will need to be deleted
 * @param {String}
 *            querySql - The query string to locate the major record related records
 * 
 * @return void
 */
function deleteRelatedData(tableName, querySql){
  var relatedRecord = new SCFile(tableName);
  var rc = relatedRecord.doSelect(querySql); 
  while (rc == RC_SUCCESS){
  	 relatedRecord.doDelete();
     rc = relatedRecord.getNext();
  }
}

/**
 * This method is to sync the deleted record data to the target table
 * 
 * @param {String}
 *            targetTableName - The name of the table to delete the record
 * @param {String}
 *            sourceTableName - The name of the table that After Delete event is triggered
 * @param {String}
 *            querySql - The sql to check whether the record to be deleted existed in the target table
 * @param {String}
 *            checkedQuerySql - The sql to check whether the record is used in other tables which all also sync the data to the target table
 * 
 * @return void
 */
function deleteRecordData(targetTableName,sourceTableName,querySql,checkedQuerySql){
  var deleteRecord = new SCFile(targetTableName);
  var rc = deleteRecord.doSelect(querySql);
  var checkedTableList = checkedTableMap[sourceTableName];
  var tobeDeleted = true; 
  if (rc == RC_SUCCESS){
    var record, orc;
    for(var i=0 ; i <checkedTableList.length ; i++ ){
    	record = new SCFile(checkedTableList[i]);
    	orc = record.doSelect(checkedQuerySql);
    	if (orc == RC_SUCCESS){
    		tobeDeleted = false;
    		break;
    	}
    }
    
  }else {//the record to be deleted don't exist in the table to be synced to
    tobeDeleted = false; 
  }
  
  if (tobeDeleted){
  	deleteRecord.doDelete();
  }
  
  return tobeDeleted;

}


