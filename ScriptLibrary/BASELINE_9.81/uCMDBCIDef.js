/******************************************************
* Module Name: SM uCMDB Integration
* Function: Retrieve SM CIs/Relations detailed information
* Author: Jackey Xue
* Version: 1.00
* Creation Date: Jan, 2014
*/

// JSON related utility
var toJSON = lib.JSON2.toJSON;

/******************************************************
 * SM types mapping
 * 
 * @private
 * @type {Object.<number,string>}
 */
var smTypes = {
	1:'Number',
	2:'String',
	3:'Datetime',
	4:'Logical',
	5:'Label',
	6:'File',
	7:'Offset',
	8:'Array',
	9:'Structure',
	10:'Operator',
	11:'Expression',
	12:'PseudoField',
	13:'GlobalVariable',
	14:'LocalVariable'
};

/** This function is called to get the detailed information for SM CIs and relations
*	SM CI's fields information which exposed in web service definition
*
*	@return {String} The SM CIT and relations with JSON format
*/
function getAllDefinitions(){
	var results = {};
	try {
		// get all SM CIs
		results["CIs"] = getAllCITypes();
		
		// get all relations
		results["Relations"] = getRelationshipType();
		
		vars.$L_file.body = toJSON(results);
		if( vars.$L_file.body != null ) {
		    vars.$L_exit="normal";
		}
		
		print("Success");
		return vars.$L_file.body;	
	}
	catch (ex) {
		print(ex);
		vars.$L_exit="error";
	}
}


/**
 *
 *  This function is used to get the detailed information for SM relations
 *
 *
 *  @return {String}  - JSON string of the web service object
 */
function getRelationshipType(){
	var relations = [];
	var CIRelationshipType = new SCFile("cirelationshiptype", SCFILE_READONLY);
	CIRelationshipType.setFields(["relationship.subtype"])
	var rc = CIRelationshipType.doSelect( "relationship.type=\"Logical\"" );	
	do{
		relations.push( CIRelationshipType.relationship_subtype );
	}while(CIRelationshipType.getNext() == RC_SUCCESS);	
	return relations;
}


function _getWSDef(queryCondition, queryFields) {
	var extaccess = new SCFile("extaccess",SCFILE_READONLY);
	extaccess.setFields(queryFields);
	if (extaccess.doSelect(queryCondition) == RC_SUCCESS) {
		return extaccess;
	}
	return null;
}


/**
 *  This function is used to retrieve the RESTful web service definition of the target CI type discription
 *
 *  @return {String}  - JSON string of the web service definition
 */
function getCITypeWSDef() {
	var ciType = vars.$L_file["device.type"];
	var wsDef = {};
	
	try {
		if (ciType && ciType != "") {
			var ciTypeRecord = new SCFile("devtype", SCFILE_READONLY);
			ciTypeRecord.setFields(["device.name", "joindef"]);
			var rc = ciTypeRecord.doSelect("active=true and device.type=\""+ciType+"\"");
		
			if (rc == RC_SUCCESS) {
				var joinTable = ciTypeRecord.joindef;
				if (joinTable == null || joinTable == "") {
					joinTable = "device";
				}
				
				var sql = "rest.enabled=true and service.name=\"ucmdbIntegration\" and name=\""+joinTable+"\"";
				var queryFields = ["rest.list.name", "rest.resource.name", "allowed.actions", "action.names", "execute.actions"];
				// query the web service with object name specified
				var queryConditionWithObject = sql + " and object.name#\"ucmdb"+ciTypeRecord.device_name.replace(/\s/g,"")+"\"";
				var extaccess = _getWSDef(queryConditionWithObject, queryFields);
				if (extaccess === null) {
					// query the web service without object name specified if no web service found previously
					var extaccess = _getWSDef(sql, queryFields);
				}
				
				if (extaccess !== null) {
					wsDef["Resource Collection Name"] = extaccess.rest_list_name;
					wsDef["Resource Name"] = extaccess.rest_resource_name;
					wsDef["Action Mapping List"] = {};

                    var i;
                    var length = extaccess.allowed_actions.length();
					for (i=0; i<length; i++) {
						var action = extaccess.allowed_actions[i];
						if (action === "add" || action === "save" || action === "delete") {
							if (extaccess.execute_actions[i] === "ddm") {
								wsDef["Action Mapping List"][action] = extaccess.action_names[i];
							}
						}
					}
				}
			}
		}

		vars.$L_file["device.type"] = toJSON(wsDef);
		print("success");
		vars.$L_exit="normal";
	}
	catch (ex) {
		print(ex);
		vars.$L_exit="error";
	}
}


/**
 *  Retrieve the records (empty CI type STRUCTURE/ARRAY_STRUCTURE) stored in "UCMDBEmptyCIType" table
 *
 *  @return {Array}  - a set of objects
 */
function _getEmptyStructure() {
	var results = [];
	
	var ciTypeRecord = new SCFile("UCMDBEmptyCIType", SCFILE_READONLY);
	ciTypeRecord.setFields(["name", "citype", "caption", "type"]);
	var rc = ciTypeRecord.doSelect(true);
	if (rc == RC_SUCCESS) {
		do {
			var entity = {};
			entity["name"] = ciTypeRecord.name;
			entity["citype"] = ciTypeRecord.citype;
			entity["caption"] = ciTypeRecord.caption;
			entity["type"] = ciTypeRecord.type;
			
			results.push(entity);
		} while(ciTypeRecord.getNext() == RC_SUCCESS);
	}
	
	return results;
}


/**
 *  Get the field type in DBdict
 *
 *  @param fieldName - Name of the field
 *  @param tableName - Name of the query table
 *  @param upperLevelType - "STRUCTURE", "ARRAY_STRUCTURE" or null for simple field
 *  @param structureName - required when upperLevelType is not null
 *  @return - Type of the field in DBdict
 */
function getFieldTypeInDbdict(fieldName, tableName, upperLevelType, structureName) {
	var table = new SCFile("dbdict");
  	var sql = "name=\"" + tableName + "\"";
	if ( table.doSelect( sql ) == RC_SUCCESS ) { 
  		var fieldList = setFieldsList(tableName);
  		for (var i=0; i<fieldList.length; i++) {
  			if (upperLevelType) {
  				//field in STRUCTURE or ARRAY_STRUCTURE
  				if (fieldList[i].type === upperLevelType && fieldList[i].name === structureName) {
  					var fieldListStructure = fieldList[i].structure;
  					for (var j=0; j<fieldListStructure.length; j++) {
  						if (fieldName == fieldListStructure[j].name) {
  							return fieldListStructure[j].type;
  						}
  					}
  				}
  			}
  			else {
  				if (fieldName == fieldList[i].name) {
  					return fieldList[i].type;
  				}
  			}
  		}
  	}
  	
  	if ( tableName !== "device" ) {
  		return getFieldTypeInDbdict(fieldName, "device", upperLevelType, structureName);
  	}
  	
  	return -1;
}


/** This function is called to get the detailed information for SM CIs
*	SM CIT's info and the field info which exposed in web service definition
*
*	@return {String} The SM CIT with JSON format
*/
function getAllCITypes(){
	var CIs = [], result = {};
	var emptyStructFields = _getEmptyStructure();
	
	var CIType = new SCFile("devtype",SCFILE_READONLY);
	CIType.setFields(["device.type","attr.file","joindef","device.name","sub.type"]);
	var rc = CIType.doSelect( "active=true" );
	do{
		var tablename = CIType.attr_file;
		var captionFileName = CIType.joindef;
		if(captionFileName==null) captionFileName = "device";
	
		result = {};
		result['type'] = CIType.device_type;
		result['typeDesc'] = CIType.device_name;
		result['table'] = tablename==null?"device":tablename;
		if(CIType.sub_type[0]!=null) result['subtype'] = CIType.sub_type.toArray();;
		// only return the fields which exposed in enabled Restful WS
		var fieldsList = new Array(), fieldType, childName, childFieldName;
		var sql = "rest.enabled=true and service.name=\"ucmdbIntegration\" and name=\""+captionFileName+"\"";
		var queryFields = ["soafield","soacaption","rest.list.name","rest.resource.name"];
		// query the web service with object name specified
		var queryConditionWithObject = sql + " and object.name#\"ucmdb"+CIType.device_name.replace(/\s/g,"")+"\"";
		var extaccess = _getWSDef(queryConditionWithObject, queryFields);
		if (extaccess === null) {
			// query the web service without object name specified if no web service found previously
			var extaccess = _getWSDef(sql, queryFields);
		}	
		if (extaccess !== null) {
		    var i;
		    var length = extaccess.soafield.length();
			for(i=0;i<length;i++){
				var field = {};
				var fieldName = extaccess.soafield[i];
				var captionName = extaccess.soacaption[i];
				
				if (fieldName === null || fieldName === "") {
					continue;
				}
				var iBegin = fieldName.indexOf('[');
				if( iBegin>0 ){
					// array_structure
					childName = fieldName.substring(0,iBegin);
					childFieldName = fieldName.substring(iBegin+1,fieldName.indexOf(']'));
					_setChildField(fieldsList, childName, childFieldName, captionName, result['table'], "ARRAY_STRUCTURE");
				}else{
					iBegin = fieldName.indexOf(',');
					if( iBegin>0 ){
						// structure
						childName = fieldName.substring(0,iBegin);
						childFieldName = fieldName.substring(iBegin+1);
						_setChildField(fieldsList, childName, childFieldName, captionName, result['table'], "STRUCTURE");
					}else{
						//single attribute
						field['name']=fieldName;
						fieldType = getFieldTypeInDbdict(fieldName,result['table']);
						if (fieldType === -1) {
							print('Failed to retrieve field "' + fieldName + '" from table "' + captionFileName + '", skip it.');
							continue;
						}
						field['type']=fieldType;
						field['caption']=captionName;
						
						fieldsList.push(field);
					}
				}
			}
		}
		
		//retrieve the fields (empty CI type STRUCTURE/ARRAY_STRUCTURE) stored in "UCMDBEmptyCIType" table
		for (var i=0; i<emptyStructFields.length; i++) {
			if (emptyStructFields[i]["citype"] == CIType.device_type) {
				fieldsList.push({
        	  	  "name": emptyStructFields[i]["name"],
        	  	  "type": emptyStructFields[i]["type"],
        	  	  "caption": emptyStructFields[i]["caption"]
    			});
    		}
		}
		
		result['fields'] = fieldsList;
		CIs.push(result);
	}while(CIType.getNext() == RC_SUCCESS);
	
	return CIs;
}

/** This function is called to get the detailed info for SM CIT and relations
*	SM CIT's info and the field info which exposed in web service definition
*
*	@param {Array}  fieldsList	- The list of fields
*	@param {String} childName	- The name of child
*	@param {String} childFieldName - The field name of child
*
*	@return {Array} The child in array format
*/
function _setChildField(fieldsList,childName, childFieldName, captionName, captionFileName, childType){
	var returnArray;
	for(var i=0; i<fieldsList.length; i++){
		if( fieldsList[i].name == childName ){
			returnArray = fieldsList[i]['structure'];
			break;
		}
	}
	if(!returnArray){
		var child = {};
		child['name'] = childName;
		child['caption'] = childName;
		child['type'] = childType;
		child['structure'] = [];
			
		fieldsList.push(child);
		returnArray = child['structure'];
	}
	// add new field
	var field = {};
	field['name']=childFieldName;
	fieldType = getFieldTypeInDbdict(childFieldName,captionFileName,childType,childName);
	if (fieldType === -1) {
		print('Failed to retrieve structure field "' + childFieldName + '" from table "' + captionFileName + '", skip it.');
		return;
	}
	field['type']=fieldType;
	field['caption']=captionName;
	returnArray.push(field);
}


function setFieldsList(tableName){
	var field = {};
	if(tableName==null) {
	    return field;
	}
	var fieldsList3 = [];	
	var index=0;
	var level;
	var fieldsList = [];
	
	var table = new SCFile( "dbdict", SCFILE_READONLY );
	table.setFields("field")
	var sql = "name=\"" + tableName + "\"";
	table.doSelect(sql);
	var len = table.field.length();
	for (var i = 1; i < len; i++)	
	{
		if( level == table.field[i].level && index == table.field[i].index ){
			//continue;
		}
		index = table.field[i].index;

		var level = table.field[i].level;
		if(level == 0)
		{
			continue;
		}else if(level == 1)
		{
			var fieldName = table.field[i].name;
			if( fieldName == "sysmodtime" || fieldName == "sysmoduser" || fieldName == "sysmodcount"){
				continue;
			}
			if(fieldsList3.length>0)
			{
				field['structure'] = fieldsList3;
				fieldsList.pop();				
				fieldsList.push(field);				
				fieldsList3 = [];
			}
			field = getNewField(table.field[i].name,table.field[i].type,null);
			fieldsList.push( field );
		}
		else if(level == 2)
		{
			var fieldType2 = smTypes[table.field[i].type].toUpperCase();
			if (field['type'] === "ARRAY") {
				field['type'] += "_"+ fieldType2;
			}
			else {
				var field2 = getNewField(table.field[i].name,table.field[i].type,field['name']+"["+table.field[i].name+"]");
				fieldsList3.push(field2);
			}
		}
		else if(level == 3)
		{
			var fieldType3 = smTypes[table.field[i].type].toUpperCase();
			if (fieldType2 === "ARRAY") {
				field2['type'] += "_"+ fieldType3;
			}
			else {
				var field3 = getNewField(table.field[i].name,table.field[i].type,field['name']+"["+table.field[i].name+"]");
				fieldsList3.push(field3);
			}
		}
		else if(level == 4)
		{
			if (fieldType3 === "ARRAY") {
				field3['type'] += "_"+ smTypes[table.field[i].type].toUpperCase();
			}
			else {
				var field4 = getNewField(table.field[i].name,table.field[i].type,field['name']+"["+table.field[i].name+"]");
				fieldsList3.push(field4);
			}
		}
		if(i==(len-1)){
			if(fieldsList3.length>0){
				field['structure'] = fieldsList3;				
			}
			fieldsList.pop();
			fieldsList.push(field);
		}
	}
	return fieldsList;
}


function getNewField(fieldName,fieldType,captionName){
	var field = {};
	field['name']=fieldName;
	field['caption']=captionName;
	field['type']=smTypes[fieldType].toUpperCase();
	return field;
}