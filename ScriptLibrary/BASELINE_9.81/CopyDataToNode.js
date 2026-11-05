/** 
* @fileoverview This javascript is use to copy computer data to node due to Configuration change after uCMDB enhancement
*/


/**
* Find join table via joindefs
*/
function getJoinFileName(datadictname) {
        var fJoinDefs = new SCFile("joindefs");
        var rc = fJoinDefs.doSelect("join.name=\"" + datadictname + "\"");
        if (rc != RC_SUCCESS)
                throw ("The record \"joindefs(join.name=" + datadictname +")\" could not be found.");
    
    	var tables = fJoinDefs.join_tables;
     	for(var i=0;i<tables.length();i++){
     		name = tables[i].table_name;
	    	if(name != "device"){
	      		return name;
	    	}
        }
  return null;
}
function showAllFields(dbdictname){
	var list=new Array();
	if(dbdictname!=null && dbdictname!=""){
	var allTotalFields=getAllFields(dbdictname);
	
	for (var m = 0; m < allTotalFields.length; m++) {
		var totalFields=allTotalFields[m];
		var currentStructure=null;
		var currentArray=null;
		var isStructureArray=false;
		for (var i = 0; i < totalFields.length(); i++) {
		  if(totalFields[i]!=null){
		  	if(totalFields[i].type!=null && totalFields[i].level > 0){
		  		if(totalFields[i].level==1){
		  			 currentStructure=null;
		  			 currentArray=null;
		  		}
	  	 		if(totalFields[i].type==8){
		  	 		currentArray= totalFields[i].name;
		  	 	} else if(totalFields[i].type==9){
		  	 		currentStructure = totalFields[i].name;
		  	 		isStructureArray = currentArray!=null;
		  	 	}
		  		if(currentStructure!=null &&  totalFields[i].level > 1){
			  	 	if(!isStructureArray){
			  	 		name=totalFields[i].name; 
			  	 	}else{
			  	 		name=currentStructure+"["+totalFields[i].name+"]";
			  	 	}
		  	 	}else{
		  	 		name=totalFields[i].name; 
		  	 	}
		  	 	 if(totalFields[i].type!=9 && !lib.ArrayUtil.contains(list,name)) 
		  	 		list.push(name);
		  	 }
		  }
		}
	 }
	 }
	list.sort();
 	return list;
}


function getAllFields(dbdictname){
		var fieldsArray=new Array();
        var fJoinDefs = new SCFile("joindefs");
        var rc = fJoinDefs.doSelect("join.name=\"" + dbdictname + "\"");
        if (rc != RC_SUCCESS){
       		var sourceDbdict = new SCFile("dbdict");
			sourceDbdict.doSelect("name=\"" + dbdictname + "\"");
			fieldsArray.push(sourceDbdict.field);
        }else{
	        var tables = fJoinDefs.join_tables;
	     	for(var i=0;i<tables.length();i++){
	     		if(tables[i].table_name!="device"){ //ignore device
			     	var dbdict = new SCFile("dbdict");
					dbdict.doSelect("name=\"" + tables[i].table_name + "\"");
					fieldsArray.push(dbdict.field);
				}
	        }
        }
     return fieldsArray;   
}

var is_physical_mem_total_string=false;
/**
 * verify the table and fields exists and the mapping fields type.
 * @param mapping
 * @returns {boolean} true if the validation is passed.
 */
function verifyConfigration(mapping){

	// get source file definiation
	var sourceFields= getAllFields(mapping.source_table); //source table may contains multi fies, I.E. joinmainframe
	// get target file definiation
	var targetFields= getAllFields(mapping.target_table);

	for (var i=0;i< mapping.fields.length();i++) {
			    var field=mapping.fields[i];
				if(field==null || field.source_field==null || field.source_field=="" || field.target_field==null || field.target_field==""){
					continue;
				}
			  
				var sourceType=getFieldsType(field.source_field,sourceFields);
				var targetType=getFieldsType(field.target_field,targetFields);
				
				if(field.target_field=="physical.mem.total" && targetType==2 &&  sourceType==1){
				    is_physical_mem_total_string=true;
			    }
				
			  if(sourceType==null){
			  	system.functions.msg(system.functions.scmsg(6,"cidatacopy", [field.source_field,mapping.source_table]) ,3);
			 	 return false;
			  }
			  else if(	targetType==null){
			  	 system.functions.msg(system.functions.scmsg(6,"cidatacopy", [field.target_field,mapping.target_table]) ,3);
			  	 return false;
			  }else  if(sourceType!=targetType && !(field.target_field=="physical.mem.total" && targetType==2 && sourceType==1)){
			  	// it is save to put number into string 
				// and ucmdbCP have set the inconsistent type for physical.mem.total
			  	 system.functions.msg(system.functions.scmsg(4,"cidatacopy", [field.source_field,mapping.source_table,sourceType,field.target_field,mapping.target_table,targetType]),3);
			 	 return false;
			}
	}
	return true;	
}

// mapping string regex format
var regex=/(.+?)\[(.+?)\]/g;
/**
 * recognize the mapping string format
 * @param field mapping string
 * @returns array of structure and field, the simple fields will return two same value
 */
function getObjAndField(field){
	if(field==null) return [];
	var obj = field.replace(regex, "$1");
	var column = field.replace(regex, "$2");
  return [obj,column];

}

/**
 * 
 * @param fieldStr
 * @param totalFields
 * @returns
 */
function getFieldsType(fieldStr, allTotalFields){

var objColumn=getObjAndField(fieldStr);
var obj = objColumn[0];
var field =  objColumn[1];
for (var m = 0; m < allTotalFields.length; m++) {
	var totalFields=allTotalFields[m];
	for (var i = 0; i < totalFields.length(); i++) {
		if(totalFields[i]!=null && totalFields[i].name==obj){
			if(fieldStr.match(regex)){
				var type=totalFields[i].type;
				var typeSub=null;
			
				for (var j = i+1; j < totalFields.length() && (totalFields[j]==null || totalFields[j].level>totalFields[i].level); j++) {
					if(totalFields[j].name==field){
					    typeSub=totalFields[j].type;
						break;
					}
				}
				if(typeSub==null){
					return null;
				}
				
				return type+"["+typeSub+"]";	
			}else{
				return totalFields[i].type;
				break;
			}
		}
	}
 }
 return null;

}

/**
 * with the defined JSON object to clone data from old table to target table the
 * script will first varify the configuration before coping the data. mapping rule: 
 * 1. simple fileds (number, character, data/time,logical, Array) using key:value pairs 
 * 2. complex fileds (Structure) using structure[fields] as the key value. example: "printers[printer.server.name]": "disk.device[disk.name]"
 * @param mapping
 * @returns no return, just output some log.
 */
function copyData(mapping) {
	var date=new Date();
	if(!verifyConfigration(mapping)){
		system.functions.msg(system.functions.scmsg(2,"cidatacopy"),3);
		return false;
	}
	var countRecords=ignoreRecords=0;
	var sourceTable = new SCFile(mapping.source_table); //query can use join
	var ret = sourceTable.doSelect(mapping["query"]);
	var targetFileName= getJoinFileName(mapping.target_table); //target can only use single file to avoid duplicate record issue
	while (ret == RC_SUCCESS) {
		var targetTable = new SCFile(targetFileName);
		var targetExist=targetTable.doSelect("logical.name=\""+sourceTable.logical_name+"\""); //query the record to make it mergeable
		if(targetExist==RC_SUCCESS){
			++ignoreRecords;
			 system.functions.msg(system.functions.scmsg(3,"cidatacopy", [targetTable.logical_name,targetFileName]),2);
		}else{
			for (var i=0;i< mapping.fields.length();i++) {
			   var field=mapping.fields[i];
				if(field==null || field.source_field==null || field.source_field=="" ||  field.target_field==null || field.target_field=="" ){
					continue;
				}
				
				if (field.source_field.match(regex)) {
						var objSource = field.source_field.replace(regex, "$1");
						var fieldSource = field.source_field.replace(regex, "$2");
						var objTarget = field.target_field.replace(regex, "$1");
						var fieldTarget = field.target_field.replace(regex, "$2");
						for (var j = 0; sourceTable[objSource] != null && j< sourceTable[objSource].length(); j++) {
							if(sourceTable[objSource][j]!=null) // avoid null point issue
							targetTable[objTarget][j][fieldTarget] = sourceTable[objSource][j][fieldSource];
						}
					} else {
						if(field.target_field=="physical.mem.total" && is_physical_mem_total_string){
						//ucmdbCP have set the inconsistent type for physical.mem.total
							targetTable[field.target_field] = system.functions.val(sourceTable[field.source_field],2);
						}else{
							targetTable[field.target_field] = sourceTable[field.source_field];
						}
					}
			}
			targetTable.doSave();
			print(system.functions.scmsg(5,"cidatacopy", [++countRecords,targetTable.logical_name]));
		}
		ret = sourceTable.getNext();

	}
print(system.functions.scmsg(1,"cidatacopy", [countRecords, ignoreRecords, (new Date()-date)]));

}

