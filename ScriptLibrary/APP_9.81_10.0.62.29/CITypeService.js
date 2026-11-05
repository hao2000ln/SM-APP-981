var LOGICALNAMESIZECONST = 200;
var MAX_FIELD_NAME_LENGTH = 100;
var MAX_CI_TYPE_NAME_LENGTH = 40;
var MAX_CI_TYPE_DESCRIPTION_LENGTH = 60;
var MAX_TABLE_NAME_LENGTH = 50;

var VALIDATE_CITYPE_FAILED = 10000;
var VALIDATE_CITYPE_FIELDS_FAILED = 10001;
var CREATE_CITYPE_FAILED = 10008;
var CREATE_CITYPE_FIELDS_FAILED = 10009;

var JOINDEFS_CAN_NOT_BE_REUSED = 10003;
var ERDDEF_CAN_NOT_BE_REUSED = 10004;
var DEMRULE_CAN_NOT_BE_REUSED = 10005;
var WEBSERVICE_CAN_NOT_BE_REUSED = 10006;
var DEVICETYPE_CAN_NOT_BE_REUSED = 10007;

var DATADICT_UPDATE_FAILED = 10010;
var DBDICT_STRUCTURE_FAILED = 10012;
var DATADICT_CAN_NOT_FOUND = 10013;
var INDEX_CAN_NOT_FOUND = 10014;
var DBDICT_UPDATE_FAILED = 10015;

var errMsg ={};
var successMsg = {};

errMsg["EMTPY_TABLE_NAME"] = "The value of AttrFile is empty.";
errMsg["DUPLICATE_TABLE_NAME"] = "The value of AttrFile is already used.";
errMsg["TABLE_NAME_EXCEED_MAX_LENGTH"] = "The value of AttrFile exceeds the max length.";
errMsg["CI_TYPE_NAME_EXCEED_MAX_LENGTH"] = "The value of Type exceeds the max length.";
errMsg["CI_TYPE_DESCRIPTION_EXCEED_MAX_LENGTH"] = "The value of TypeDesc exceeds the max length.";
errMsg["EMTPY_CI_TYPE"] = "The value of Type is empty.";
errMsg["DUPLICATE_CI_TYPE"] = "The value of Type is already used.";
errMsg["EMTPY_CI_TYPE_DESCRIPTION"] = "The value of TypeDesc is empty.";
errMsg["DUPLICATE_CI_TYPE_DESCRIPTION"] = "The value of TypeDesc is already used.";
errMsg["DUPLICATE_JOIN_TABLE_NAME"] = "The join table name is already used.";
errMsg["DUPLICATE_DEMRULE_ID"] = "The Discovery Event Manager rule is already used.";
errMsg["DUPLICATE_WS_OBJECT_NAME"] = "The web service object name is already used.";
errMsg["DUPLICATE_WS_COLLECTION_NAME"] = "The RESTFul collection name is already used.";
errMsg["TABLE_NAME_WHITE_SPACE"] = "White space is not allowed in the value of AttrFile.";
errMsg["CI_TYPE_WHITE_SPACE"] = "White space is not allowed in the value of Type.";

errMsg["CI_TYPE_NOT_EXIST"] = "The specified CI Type does not exist.";
errMsg["EMTPY_CI_TYPE_FIELD"] = "No field is specified to the CI Type.";
errMsg["EMTPY_FIELD_NAME"] = "Name of a CI type field is not specified.";
errMsg["EMTPY_FIELD_CAPTION"] = "Caption of a CI type field is not specified.";
errMsg["EMTPY_FIELD_TYPE"] = "Type of a CI type field is not specified.";
errMsg["FIELD_NAME_EXCEED_MAX_LENGTH"] = "Name of a CI type field exceeds the max length.";
errMsg["FIELD_TYPE_NOT_SUPPORTED"] = "Type of a CI type field is not supported.";
errMsg["FIELD_NAME_WHITE_SPACE"] = "White space is not allowed in field name of the CI type.";
errMsg["FIELD_CAPTION_WHITE_SPACE"] = "White space is not allowed in field caption of the CI type.";
errMsg["FIELD_ATTRIBUTE_DUPLICATE"] ="The field has a duplicated name or caption.";
errMsg["DUPLICATE_CI_TYPE_FIELD"] = "The CI type field is already used.";
errMsg["FIELD_STRUCTURE_EXIST_IN_DEVICE"] = "It is not allowed to add or update a field structure which has already been used in \"device\" table.";
errMsg["EMPTY_STRUCTURE_INSERT_FAILED"] = "Failed to insert the empty structure field.";
errMsg["EMPTY_STRUCTURE_UPDATE_FAILED"] = "Failed to update the empty structure field.";

errMsg["CREATE_CITYPE_FAILED"] = "Failed to create the new CI Type.";
errMsg["CREATE_CITYPE_FIELDS_FAILED"] = "Failed to insert the CI Type field.";
                                 
errMsg[JOINDEFS_CAN_NOT_BE_REUSED] = "The existing JoinDef Record cannot be reused because it is already in use.";
errMsg[ERDDEF_CAN_NOT_BE_REUSED] = "The existing ErdDef Record cannot be reused because it is already in use.";
errMsg[DEMRULE_CAN_NOT_BE_REUSED] = "The existing DemRule Record cannot be reused because it is already in use.";
errMsg[WEBSERVICE_CAN_NOT_BE_REUSED] = "The existing Web Service Record cannot be reused because it is already in use.";
errMsg[DEVICETYPE_CAN_NOT_BE_REUSED] = "The existing Device Type Record cannot be reused because it is already in use.";

errMsg[DATADICT_CAN_NOT_FOUND] = "The corresponding data policy cannot be found.";
errMsg[DATADICT_UPDATE_FAILED] = "Failed to update the corresponding data policy.";
errMsg[DBDICT_STRUCTURE_FAILED] = "Failed to initialize the structure of the Dbdict.";
errMsg[DBDICT_UPDATE_FAILED] = "Failed to update the Dbdict.";

errMsg[INDEX_CAN_NOT_FOUND] = "The field cannot be found in the dbdict.";


successMsg["CREATE_CITYPE_SUCCESS"] = "The new CI Type is successfully created.";
successMsg["INSERT_CITYPE_FIELD_SUCCESS"] = "The new CI Type field is successfully added.";

var dt = lib.DataTypeConst;
var tf = lib.tableFunctions;
var dh = lib.dbdictHelper;
var JSON = lib.JSON.json();
var toJSON = lib.JSON2.toJSON;
var log = getLog("ucmdb.citypeservice");
var tabFunc = lib.tableFunctions;
var $ = lib.c.$;
var getDisplayLable=lib.DisplayName.getDisplayLable;

var dataType = {
    "NUMBER": [1, 0],
    "STRING": [2, 0],
    "DATETIME": [3, 0],
    "LOGICAL": [4, 0],
    "STRUCTURE": [9, 0],
    "ARRAY_NUMBER": [8, 1],
    "ARRAY_STRING": [8, 2],
    "ARRAY_DATETIME": [8, 3],
    "ARRAY_LOGICAL": [8, 4],
    "ARRAY_STRUCTURE": [8, 9]
}

var tabFuncMap = {
    "joindefs": _processTable,
    "erddef": _processTable,
    "extaccess": _processTable,
    "ddmRule": _processTable,
    "devtype": _processTable,
    "ddmReconcile": _processTable
};

var rcdFuncMap = {
    "joindefs": _buildRecord4JoinDefs,
    "erddef": _buildRecord4ERDDef,
    "extaccess": _buildRecord4WebService,
    "ddmRule": _buildRecord4DEMRule,
    "devtype": _buildRecord4DeviceType,
    "ddmReconcile": _buildRecord4DdmReconcile
};



var fldFuncMap = {
    "rules": _processFldRules
}

var fldSetFuncMap = {
    "soa": _processFldSetSOA
}

var sqlFuncMap = {
    "joindefs": _genSQL4JoinDefs,
    "erddef": _genSQL4ERDDef,
    "extaccess": _genSQL4WebService,
    "ddmRule": _genSQL4DEMRule,
    "devtype": _genSQL4DeviceType,
    "ddmReconcile": _genSQL4DdmReconcile
};

var msgFuncMap = {
    "dbdict": _genMessage4DBDict,
    "joindefs": _genMessage4JoinDefs,
    "erddef": _genMessage4ERDDef,
    "ddmRule": _genMessage4DEMRule,
    "extaccess": _genMessage4WebService,
    "devtype": _genMessage4DeviceType,
    "ddmReconcile": _genMessage4DdmReconcile
};


/**
*  create the set of objects for the new CI Type from uCMDB
*/
function createCIType() {
	try {
		var requestData = vars.$L_file;
		requestData["attr.file"] = $.trim(requestData["attr.file"]);
		requestData["device.type"] = $.trim(requestData["device.type"]);

		if (requestData["device.name"] == null || requestData["device.name"] == "") {
			requestData["device.name"] = _ucfirst(requestData["device.type"]);
		}
		else {
			requestData["device.name"] = $.trim(requestData["device.name"]);
		}
		
		if (requestData["attr.file"] == null || requestData["attr.file"] == "") {
			requestData["attr.file"] = "device";
		}
		
        validate(requestData);
        var tableName = requestData["attr.file"];
        var ciType = requestData["device.type"];
        var ciTypeDesc = requestData["device.name"];
        var params = genParams(tableName, "add");
        
		if (tableName === "device") {
			//create the devtype record
        	var devTypeRecord = _buildRecord4DeviceType("add", requestData, params);
        	_processTable('devtype', devTypeRecord);
        
        	//create the extaccess record
        	var extaccessRecord = _buildRecord4WebService("add", ciType, ciTypeDesc, params, tableName, false);
        	_processTable('extaccess', extaccessRecord);
        
        	//create the ddmRule record
        	var ddmRuleRecord = _buildRecord4DEMRule("add", ciType, params, tableName, false);
        	_processTable('ddmRule', ddmRuleRecord);
		}
		else {
			//create the dbdict record
        	createDbdict([], tableName);
        
        	//create the joindef record
        	var joinDefRecord = _buildRecord4JoinDefs("add", tableName);
			_processTable('joindefs', joinDefRecord);
		
			//create the erddef record
			var erdDefRecord = _buildRecord4ERDDef("add", tableName);
        	_processTable('erddef', erdDefRecord);
        	
        	//create the devtype record
        	var devTypeRecord = _buildRecord4DeviceType("add", requestData, params);
        	_processTable('devtype', devTypeRecord);
        
        	//create the extaccess record
        	var extaccessRecord = _buildRecord4WebService("add", ciType, ciTypeDesc, params, null, true);
        	_processTable('extaccess', extaccessRecord);
        
        	//create the ddmRule record
        	var ddmRuleRecord = _buildRecord4DEMRule("add", ciType, params, null, true);
        	_processTable('ddmRule', ddmRuleRecord);
        	
        	//create the ddmReconcile record
        	var ddmReconcileRecord = _buildRecord4DdmReconcile("add", tableName);
        	_processTable('ddmReconcile', ddmReconcileRecord);
        }
        
        print(successMsg["CREATE_CITYPE_SUCCESS"]);
        vars.$L_exit = "normal";
    }
    catch(ex) {
    	if (vars.$ERROR_CODE == null) {
    		vars.$ERROR_CODE = CREATE_CITYPE_FAILED;
    		print(errMsg["CREATE_CITYPE_FAILED"]);
    	}
		print(ex);
		log.debug(ex);
        vars.$L_exit = "user.define";        
    }
}


/**
*  validate the fields for CI Type creation
*	
*   @param {object} requestData - request data from external  
*/
function validate(requestData) {
	try {
		var tableName = requestData['attr.file'];
		var type = requestData['device.type'];
		var typeDesc = requestData['device.name'];
	
		//validate the fields which are not allowed to be empty
		var notEmptyFields = ["attr.file", "device.type", "device.name"];
    	var errMsgKey4Empty = ["EMTPY_TABLE_NAME", "EMTPY_CI_TYPE", "EMTPY_CI_TYPE_DESCRIPTION"];
    	for (i=0; i<notEmptyFields.length; i++) {
    		var fieldValue = requestData[notEmptyFields[i]];
    		if (fieldValue == null || fieldValue == "") {
    			throw errMsg[errMsgKey4Empty[i]];
    		}
    	}

		//validate the fields which should not contain white space
		var noWhiteSpaceFields = ["attr.file", "device.type"];
    	var errMsgKey4Space = ["TABLE_NAME_WHITE_SPACE", "CI_TYPE_WHITE_SPACE"];
    	for (i=0; i<noWhiteSpaceFields.length; i++) {
    		var fieldValue = requestData[noWhiteSpaceFields[i]];
    		if (fieldValue.indexOf(" ") > 0) {
    			throw errMsg[errMsgKey4Space[i]];
    		}
    	}

		//validate the attribute length
		var fieldAttr = [type, typeDesc, tableName];
		var maxLength = [MAX_CI_TYPE_NAME_LENGTH, MAX_CI_TYPE_DESCRIPTION_LENGTH, MAX_TABLE_NAME_LENGTH];
		var errMsgKey4Length = ["CI_TYPE_NAME_EXCEED_MAX_LENGTH", "CI_TYPE_DESCRIPTION_EXCEED_MAX_LENGTH", "TABLE_NAME_EXCEED_MAX_LENGTH"];
		for (i=0; i<fieldAttr.length; i++) {
    		if (fieldAttr[i].length > maxLength[i]) {
    			throw errMsg[errMsgKey4Length[i]];
    		}
    	}
		
    	if (tableName != "device") {
    		//table name should not be duplicate
			if (isTableExist(tableName)) {
				throw errMsg["DUPLICATE_TABLE_NAME"];
			}
			//join table name should not be duplicate
			if (isJoinTableExist(tableName)) {
				throw errMsg["DUPLICATE_JOIN_TABLE_NAME"];
			}
		}
		
		//CI type, type description should not be duplicate
		if (isCITypeExist(['device.type'], [type])) {
			throw errMsg['DUPLICATE_CI_TYPE'];
		}
		if (isCITypeExist(['device.name'], [typeDesc])) {
			throw errMsg['DUPLICATE_CI_TYPE_DESCRIPTION'];
		}
		
		//DEM rule id should not be duplicate
		if (isDemRuleExist(type)) {
			throw errMsg["DUPLICATE_DEMRULE_ID"];
		}

		//web service object name, collection name should not be duplicate
		var wsUniqueName = "ucmdb" + typeDesc.replace(/\s/g,"");
		if (isWebServiceExist(['object.name'], [wsUniqueName])) {
			throw errMsg['DUPLICATE_WS_OBJECT_NAME'];
		}
		if (isWebServiceExist(['rest.list.name'], [wsUniqueName + 's'])) {
			throw errMsg['DUPLICATE_WS_COLLECTION_NAME'];
		}		
	}
	catch(ex) {
		vars.$ERROR_CODE = VALIDATE_CITYPE_FAILED;
		throw(ex);
	}	
}


/**
*  check whether a CI type exists or not
*	
*   @param {array} keys - fields for the query
*   @param {array} values - field values for the query
*   @returns {boolean} 	true / false
*/
function isCITypeExist(keys, values) {
	var sql = compositeQuery(keys, values);
	
	var ciType = new SCFile("devtype", SCFILE_READONLY);
	ciType.setFields(keys.join(','));
	var rc = ciType.doSelect(sql);
	
	return rc == RC_SUCCESS;
}


/**
*  check whether a table exists or not
*	
*   @param {string} tableName - name of the table
*   @returns {boolean} 	true / false
*/
function isTableExist(tableName) {
	var dbdict = new SCFile("dbdict", SCFILE_READONLY);
	dbdict.setFields("name");
	var rc = dbdict.doSelect("name = \"" + tableName + "\"");
	
	return rc == RC_SUCCESS;
}


/**
*  check whether a join table exists or not
*	
*   @param {string} tableName - name of the table
*   @returns {boolean} 	true / false
*/
function isJoinTableExist(tableName) {
	var joinTableName = 'join' + tableName;
	var joinDef = new SCFile("joindefs", SCFILE_READONLY);
	joinDef.setFields("join.name");
	var rc = joinDef.doSelect("join.name = \"" + joinTableName + "\"");
	
	return rc == RC_SUCCESS;
}


/**
*  check whether a DEM rule exists or not
*	
*   @param {string} ciType - CI Type of the DEM rule
*   @returns {boolean} 	true / false
*/
function isDemRuleExist(ciType) {
	var demRuleId = "ucmdb" + _ucfirst(ciType);
	var demRule = new SCFile("ddmRule", SCFILE_READONLY);
	demRule.setFields("id");
	var rc = demRule.doSelect("id = \"" + demRuleId + "\"");
	
	return rc == RC_SUCCESS;
}


/**
*  check whether a web service exists or not
*	
*   @param {array} keys - fields for the query
*   @param {array} values - field values for the query
*   @returns {boolean} 	true / false
*/
function isWebServiceExist(keys, values) {
	var sql = compositeQuery(keys, values);
	
	var extaccess = new SCFile("extaccess", SCFILE_READONLY);
	extaccess.setFields(keys.join(','));
	var rc = extaccess.doSelect(sql);

	return rc == RC_SUCCESS;
}


function compositeQuery(keys, values) {
	var sql = '';
	for (i=0; i<keys.length; i++) {
		var extraStr = '';
		if (sql != '') {
			extraStr = " and ";
		}
		sql += extraStr + keys[i] + "=\"" + values[i] + "\"";
	}
	
	return sql;
}


/**
*  update the set of objects for the new CI Type attribute from uCMDB
*  Example request format:
*  {
*      "ucmdbCITypeField": 
*	   {
*		   "Body":"{"type":"application","fields":[{"name":"testStructure","caption":"TestStructure","type":"ARRAY_STRUCTURE","structure":[{"name":"testStr1","type":"STRING","caption":"TestStr1"}]}]}"
*	   }
*  }
*/
function addFields(record) {
	var requestData = JSON.parse(record.body);
	requestData["type"] = $.trim(requestData["type"]);
	var ciType = requestData["type"];
	
	try {
		//validate the request data
		var ciTypeTable = validateUcmdbJson(requestData);
		var originalTable = ciTypeTable;
		
		//create a new table if original CI type table is empty or "device"
		if (ciTypeTable == null || ciTypeTable == "" || ciTypeTable == "device") {
			originalTable = "device";
			ciTypeTable = ciType;
			
			if (ciType.length > MAX_CI_TYPE_NAME_LENGTH) {
				throw errMsg["CI_TYPE_NAME_EXCEED_MAX_LENGTH"];
			}
			if (isTableExist(ciTypeTable) || isJoinTableExist(ciTypeTable)) {
				ciTypeTable = ciTypeTable + new Date().getTime().toString().substr(-5);
			}
			createDbdict([], ciTypeTable);
			
			//create the joindef record
        	var joinDefRecord = _buildRecord4JoinDefs("add", ciTypeTable);
			_processTable('joindefs', joinDefRecord);
		
			//create the erddef record
			var erdDefRecord = _buildRecord4ERDDef("add", ciTypeTable);
        	_processTable('erddef', erdDefRecord);
        	
        	//update the ci type record
        	var ciTypeRecord = new SCFile("devtype");
			ciTypeRecord.doSelect("device.type = \"" + ciType + "\"");
			
			ciTypeRecord.attr_file = ciTypeTable;
			ciTypeRecord.joindef = "join" + ciTypeTable;
			var rc = ciTypeRecord.doAction('save');
			if (rc != RC_SUCCESS) {
				throw RCtoString(rc);
			}
		}
		
		var tableFields = compareTable(requestData["fields"], ciTypeTable);
		//insert new ci type field into the dbdict record
		var dbdictActionList = getActionList4Dbdict(requestData["fields"], ciTypeTable);
		for (var i = 0; i < dbdictActionList.length; i++) {
			var dbdict = dbdictActionList[i];
            _processDbdict(dbdict["record"], dbdict["action"], ciType);
		}

		//get fields pending to be updated
		var newFields = {
			"name": [],
			"structName": [],
			"caption": []
		};
		for (var i=0; i<tableFields.extra.length; i++) {
			if (tableFields.extra[i]['type'] == "STRUCTURE" || tableFields.extra[i]['type'] == "ARRAY_STRUCTURE") {
				var structFields = tableFields.extra[i]['structure'];
			
				if (structFields) {
					for (var structIndex=0; structIndex<structFields.length; structIndex++) {
						var nameWithStruct = tableFields.extra[i]['name'] + "[" + structFields[structIndex]['name'] + "]";
						if (tableFields.extra[i]['type'] == "STRUCTURE") {
							nameWithStruct = tableFields.extra[i]['name'] + "," + structFields[structIndex]['name'];
						}
					
						newFields['name'].push(structFields[structIndex]['name']);
						newFields['structName'].push(nameWithStruct);
						newFields['caption'].push(structFields[structIndex]['caption']);
					}
				}
			}
			else {
				newFields['name'].push(tableFields.extra[i]['name']);
				newFields['structName'].push(tableFields.extra[i]['name']);
				newFields['caption'].push(tableFields.extra[i]['caption']);
			}
		}
		for (var i=0; i<tableFields.update.length; i++) {
			var structFields = tableFields.update[i]['structure'];
			
			if (structFields) {
				for (var structIndex=0; structIndex<structFields.length; structIndex++) {
					var nameWithStruct = tableFields.update[i]['name'] + "[" + structFields[structIndex]['name'] + "]";
					if (tableFields.update[i]['type'] == "STRUCTURE") {
						nameWithStruct = tableFields.update[i]['name'] + "," + structFields[structIndex]['name'];
					}
				
					newFields['name'].push(structFields[structIndex]['name']);
					newFields['structName'].push(nameWithStruct);
					newFields['caption'].push(structFields[structIndex]['caption']);
				}
			}
		}				
		
		if (newFields['name'].length > 0) {
			//get join table name of the ci type
			var ciTypeRecord = new SCFile("devtype", SCFILE_READONLY);
			ciTypeRecord.setFields(['joindef', 'device.name']);
			ciTypeRecord.doSelect("device.type = \"" + ciType + "\"");
			var joinTableName = ciTypeRecord.joindef;
			var ciTypeDesc = ciTypeRecord.device_name;

			//insert new ci type field into the web service record		
			var wsObjName = "ucmdb" + ciTypeDesc.replace(/\s/g,"");
			if (originalTable == "device") {
				joinTableName4Query = originalTable;
			}
			else {
				joinTableName4Query = joinTableName;
			}
			
			if (!isWebServiceExist(["service.name", "name", "object.name"], ["ucmdbIntegration", joinTableName4Query, wsObjName])) {
				//if no web service found, query the web service record with Service Name and Name only
				var sql = "rest.enabled=true and service.name=\"ucmdbIntegration\" and name=\""+joinTableName4Query+"\"";
				var extaccess = new SCFile("extaccess");
				if (extaccess.doSelect(sql) == RC_SUCCESS) {
					if (originalTable == "device") {
						//clone the web service record to create a new
						var extaccessNew = new SCFile("extaccess");
						extaccessNew = extaccess;
						extaccessNew.name = joinTableName;
						extaccessNew.object_name = wsObjName;
						extaccessNew.rest_list_name = wsObjName + "s";
						extaccessNew.rest_resource_name = wsObjName;
						var rcNew = extaccessNew.doAction("add");
						if (rcNew != RC_SUCCESS) {
							print("Create the web service record failed.");
							throw RCtoString(rcNew);
						}
					}
				}
				else {
					//create the web service record if not exist
					var extaccessRecord = _buildRecord4WebService("add", ciType, ciTypeDesc, [], joinTableName, false);
        			_processTable('extaccess', extaccessRecord);
        		}
			}
			else {
				var sql = "object.name=\"" + wsObjName + "\"";
				var extaccess = new SCFile("extaccess");
				rc = extaccess.doSelect(sql);
				
				if (rc == RC_SUCCESS) {
					if (originalTable == "device") {
						//clone the web service record to create a new
						wsObjName = wsObjName + "Clone";
						var extaccessNew = new SCFile("extaccess");
						extaccessNew = extaccess;
						extaccessNew.name = joinTableName;
						extaccessNew.object_name = wsObjName;
						extaccessNew.rest_enabled = true;
						extaccessNew.rest_list_name = wsObjName + "s";
						extaccessNew.rest_resource_name = wsObjName;
						var rcNew = extaccessNew.doAction("add");
						if (rcNew != RC_SUCCESS) {
							print("Create the web service record failed.");
							throw RCtoString(rcNew);
						}
					}
					else {
						if (extaccess.rest_enabled !== true) {
							extaccess.rest_enabled = true;
							extaccess.rest_list_name = wsObjName + "s";
							extaccess.rest_resource_name = wsObjName;
							var rcUpdate = extaccess.doAction("save");
							if (rcUpdate != RC_SUCCESS) {
								print("Update the web service record failed.");
								throw RCtoString(rcUpdate);
							}
						}
					}
				}
				else {
					throw RCtoString(rc);
				}
			}
			//insert the new field
			var sql = "rest.enabled=true and service.name=\"ucmdbIntegration\" and name=\""+joinTableName+"\"";
			var extaccess = new SCFile("extaccess");
			var rc = extaccess.doSelect(sql + " and object.name = \"" + wsObjName + "\"");
			if (rc != RC_SUCCESS) {
				var extaccess = new SCFile("extaccess");
				var rc = extaccess.doSelect(sql);
			}

			if (rc == RC_SUCCESS) {
				var soafieldLen = extaccess.soafield.length();
				
				for (var i=0; i<newFields['name'].length; i++) {
					extaccess.soafield[soafieldLen] = newFields['structName'][i];
					extaccess.soacaption[soafieldLen] = newFields['caption'][i];
					soafieldLen += 1;
				}
				var rc4Update = extaccess.doAction('save');
				
				if (rc4Update != RC_SUCCESS) {
					throw RCtoString(rc4Update);
				}
			}
			else {
				throw RCtoString(rc);
			}

			//insert new ci type field into the ddm rule record
			if (joinTableName != "" && joinTableName != null) {
				var query = "id # \"ucmdb\" and tableName = \"" + joinTableName + "\"";
				var ddmRule = new SCFile("ddmRule", SCFILE_READONLY);
				ddmRule.setFields("id");
				var rc = ddmRule.doSelect(query);
			
				if (rc != RC_SUCCESS) {
					//create the ddm rule record if not exist
					var ddmRuleRecord = _buildRecord4DEMRule("add", ciType, [], joinTableName);
        			_processTable('ddmRule', ddmRuleRecord);
        		}
			
				//insert the new field
        		var ddmRule = new SCFile("ddmRule");
				var rc = ddmRule.doSelect(query);

				if (rc == RC_SUCCESS) {
					var ruleLen = ddmRule.rules.length();
				
					for (var i=0; i<newFields['name'].length; i++) {
						ddmRule.rules[ruleLen]["fieldName"] = newFields['name'][i];
						ruleLen += 1;
					}
					var rc4Update = ddmRule.doAction('save');
				
					if (rc4Update != RC_SUCCESS) {
						throw RCtoString(rc4Update);
					}
				}
				else {
					throw RCtoString(rc);
				}
			}
		}
		
		print(successMsg["INSERT_CITYPE_FIELD_SUCCESS"]);
		vars.$L_exit = "normal";
	}
	catch (ex) {
    	if (vars.$ERROR_CODE == null) {
    		vars.$ERROR_CODE = CREATE_CITYPE_FIELDS_FAILED;
    		print(errMsg["CREATE_CITYPE_FIELDS_FAILED"]);
    	}

		print(ex);
		log.debug(ex);
        vars.$L_exit = "user.define";
	}
}


function _ucfirst(str) {
    var str = str.toLowerCase();
    str = str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    return str;
}

function _setStructureField(dbdict, fieldName, level, pos, index, citype) {
    log.debug("_setStructureField:: structure type field set");
    if (0 != level) {
        _setGeneralField(dbdict, fieldName, dt.typeStructure(), level, index, pos);
        
        //clean up the empty structure logged in "UCMDBEmptyCIType" table
        var emptyCITRecord = new SCFile("UCMDBEmptyCIType");
		var rc = emptyCITRecord.doSelect("name = \"" + fieldName + "\" and citype = \"" + citype + "\"");
		if (rc == RC_SUCCESS) {
			emptyCITRecord.doDelete();
		}
    }
}

function _setDbdictName(dbdict, name) {
    dbdict.name = name;
}

function _setUniqueKey(dbdict, fieldNames) {
    dbdict.key[0].flags = 12
    var lng = fieldNames.length;
    for (var i = 0; i < lng; i++)
        dbdict.key[0].name[i] = fieldNames[i];
}

function _setGeneralField(dbdict, fieldName, fieldType, level, index, pos, len) {
    log.debug("_setGeneralField:: field set");
    dbdict.field[pos].name = fieldName
    dbdict.field[pos].level = level;
    dbdict.field[pos].index = index;
    dbdict.field[pos].type = fieldType;
    if (len) dbdict.field[pos].sql_field_options['sql.data.type'] = "VARCHAR(" + len + ")";
    log.debug("_setGeneralField:: end to field set");
}


/**
 *
 *  This function to update data policy
 *
 *  @date 1/8/2013
 *  @author Neil Yu
 *  @table   {string}   datadictName       - Store all fields of relevant information agaist dbdict
 *  @param   {array}    fieldObjects    - All fields information store in Json Object
 *  @returns {String} 	0		- Succuss
 *
 */
function _updateDatadict(fieldObjects, datadictName) {
    try {
        var datadict = new SCFile("datadict")
        var sql = "name=\"" + datadictName + "\"";
        var lng = fieldObjects.length;
        if (datadict.doSelect(sql) == RC_SUCCESS) {
            for (var i = 0; i < lng; i++) {
                var index = system.functions.index(fieldObjects[i].name, datadict.fields);
                if (index > 0 && "" != fieldObjects[i].caption && null != fieldObjects[i].caption) {
                    datadict.captions[index - 1] = fieldObjects[i].caption;
                }
            }
            if (datadict.doSave() == RC_SUCCESS) {
                return 0;
            }
        } else {
            throw DATADICT_CAN_NOT_FOUND;

        }
    } catch (e) {
        log.debug("_updateDatadict::Error update datadict " + datadictName + " process:" + e.toString());
        print("Error update datadict " + datadictName + " process:" + e.toString());
        throw DATADICT_UPDATE_FAILED;
    }
}


/**
 *
 *  This function to create table
 *
 *  @date 1/8/2013
 *  @author Neil Yu
 *  @table   {string}   dbdictName       - Store all fields of relevant information agaist dbdict
 *  @param   {array}    fieldObjects    - All fields information store in Json Object
 *  @returns {String} 	0		- Succuss (add table or table has been existing)
 */
function createDbdict(fieldObjects, dbdictName) {
    try {
        var dbdict = new SCFile("dbdict");
        log.debug("createDbdict::start to add new dbdict");
        _setGeneralField(dbdict, "descriptor", dt.typeStructure(), 0, 1, 0);
        
        //set default fields to the new dbdict
        _setGeneralField(dbdict, "logical.name", dt.typeCharacter(), 1, 1, 1, LOGICALNAMESIZECONST);
        _setGeneralField(dbdict, "machine.name", dt.typeCharacter(), 1, 2, 2);
        _setGeneralField(dbdict, "bios.id", dt.typeCharacter(), 1, 3, 3);
        _setGeneralField(dbdict, "bios.manufacturer", dt.typeCharacter(), 1, 4, 4);
        _setGeneralField(dbdict, "addlMacAddress", dt.typeArray(), 1, 5, 5);
        _setGeneralField(dbdict, "addlMacAddress", dt.typeCharacter(), 2, 1, 6);
        _setGeneralField(dbdict, "bios.model", dt.typeCharacter(), 1, 6, 7);
        _setGeneralField(dbdict, "physical.mem.total", dt.typeNumber(), 1, 7, 8);
        
        _setGeneralField(dbdict, "disk.device", dt.typeArray(), 1, 8, 9);
        _setStructureField(dbdict, "disk.device", 2, 10, 1);
        _setGeneralField(dbdict, "model.name", dt.typeCharacter(), 3, 1, 11);
        _setGeneralField(dbdict, "disk.vendor", dt.typeCharacter(), 3, 2, 12);
        _setGeneralField(dbdict, "disk.name", dt.typeCharacter(), 3, 3, 13);
        
        _setGeneralField(dbdict, "os.manufacturer", dt.typeCharacter(), 1, 9, 14);
        _setGeneralField(dbdict, "os.version", dt.typeCharacter(), 1, 10, 15);
        
        _setGeneralField(dbdict, "addlIPAddr", dt.typeArray(), 1, 11, 16);
        _setStructureField(dbdict, "addlIPAddr", 2, 17, 1);
        _setGeneralField(dbdict, "addlIPAddress", dt.typeCharacter(), 3, 1, 18);
        _setGeneralField(dbdict, "addlSubnet", dt.typeCharacter(), 3, 2, 19);
        
        _setGeneralField(dbdict, "cpu", dt.typeArray(), 1, 12, 20);
        _setStructureField(dbdict, "cpu", 2, 21, 1);
        _setGeneralField(dbdict, "cpu.id", dt.typeCharacter(), 3, 1, 22);
        _setGeneralField(dbdict, "cpu.name", dt.typeCharacter(), 3, 2, 23);
        _setGeneralField(dbdict, "cpu.clock.speed", dt.typeCharacter(), 3, 3, 24);
        
        _setGeneralField(dbdict, "file.system", dt.typeArray(), 1, 13, 25);
        _setStructureField(dbdict, "file.system", 2, 26, 1);
        _setGeneralField(dbdict, "file.system.type", dt.typeCharacter(), 3, 1, 27);
        _setGeneralField(dbdict, "disk.type", dt.typeCharacter(), 3, 2, 28);
        _setGeneralField(dbdict, "disk.size", dt.typeCharacter(), 3, 3, 29);
        _setGeneralField(dbdict, "mount.point", dt.typeCharacter(), 3, 4, 30);
        
        _setGeneralField(dbdict, "drivers", dt.typeArray(), 1, 14, 31);
        _setStructureField(dbdict, "drivers", 2, 32, 1);
        _setGeneralField(dbdict, "driver.name", dt.typeCharacter(), 3, 1, 33);
        _setGeneralField(dbdict, "driver.type", dt.typeCharacter(), 3, 2, 34);
        _setGeneralField(dbdict, "driver.description", dt.typeCharacter(), 3, 3, 35);
        _setGeneralField(dbdict, "driver.version", dt.typeCharacter(), 3, 4, 36);
        
        log.debug("createDbdict::dbdictName=" + dbdictName);
        
        if (0 == _initDbdict(dbdict, "", fieldObjects, 0)) {
            //set dbdict name
            _setDbdictName(dbdict, dbdictName);
            //set unique key
            var uk = ['logical.name'];
            _setUniqueKey(dbdict, uk);
            var names = ["record"];
            var values = [dbdict];
            //create dbdict
            var rc = callrad("fcreate", names, values);
            if (rc == RC_SUCCESS) {
                log.debug("createDbdict::dbidct " + dbdict.name + " record added");
                msgFuncMap["dbdict"].call(this, dbdict, "created.");
                //update data policy
                return _updateDatadict(fieldObjects, dbdictName);
            }
        }

    } catch (e) {
        throw e;
    }

}


/**
 *
 *  This function to build dbdict structure
 *
 *  @date 1/8/2013
 *  @author Neil Yu
 *  @table  {Object}    dbdict          - Store all fields of relevant information agaist dbdict
 *  @param 	{string} 	rootFieldName 	- Specify field as top field of Structure
 *  @param   {array}     fieldObjects   - All fields information store in Json Object
 *  @param   {number}    level          - The level of field in dbdict
 *  @returns {boolean} 	0		        - Succuss
 *
 */

function _initDbdict(dbdict, rootFieldName, fieldObjects, level, index, citype) {
    try {
        log.debug("_initDbdict:: dbdict start to init");
        var pos = dbdict.field.length();
        _setStructureField(dbdict, rootFieldName, level, pos, index, citype);
        level = level + 1;
        var lng = fieldObjects.length;
        
        for (var i = 0; i < lng; i++) {
            log.debug("_initDbdict:: dbdict=" + dbdict);

            var latestIndex = getLatestIndex(rootFieldName, dbdict);
            var pos = dbdict.field.length();
            var fieldName = fieldObjects[i].name;
            var fieldType = fieldObjects[i].type;
            var fieldArray = fieldObjects[i].structure;

            if ("" != fieldName && null != fieldName) {
                if ("" != fieldType && null != fieldType) {
                    var typeFromMTls = dataType[fieldType][0];
                    var subTypeFromMTls = dataType[fieldType][1];

                    // type is array of struture
                    if (dt.typeStructure() == typeFromMTls || (dt.typeArray() == typeFromMTls && dt.typeStructure() == subTypeFromMTls)) {
                        if ("" != fieldArray && fieldArray != null && 0 != fieldArray.length) {
                            if (dt.typeArray() == typeFromMTls) {
                            	_setGeneralField(dbdict, fieldName, dt.typeArray(), level, latestIndex, pos);

                            	if (0 != _initDbdict(dbdict, fieldName, fieldArray, level + 1, 1, citype)) {
									throw DBDICT_STRUCTURE_FAILED;
								}
                            }
                            else {
                            	if (0 != _initDbdict(dbdict, fieldName, fieldArray, level, latestIndex, citype)) {
									throw DBDICT_STRUCTURE_FAILED;
								}
                            }
                        } else {
                            log.debug("_initDbdict::skip field:" + fieldName + " due to the structure is null or empty.");
                        }
                        //type is array ,not array of struture
                    } else if (dt.typeArray() == typeFromMTls && dt.typeStructure() != subTypeFromMTls) {
                        _setGeneralField(dbdict, fieldName, dt.typeArray(), level, latestIndex, pos);
                        _setGeneralField(dbdict, fieldName, subTypeFromMTls, level + 1, 1, pos + 1);
                        //type is  number,string,datetime, boolean 
                    } else if (dt.typeArray() > typeFromMTls) {
                        _setGeneralField(dbdict, fieldName, typeFromMTls, level, latestIndex, pos);
                    }
                } else {

                    log.debug("_initDbdict::file name:" + fieldName + " type is null or empty");
                    print("Type of field:" + fieldName + " is NULL or Empty.");
                    throw DBDICT_STRUCTURE_FAILED;
                }

            } else {
                log.debug("_initDbdict::field name is null or empty");
                print("Field Name is Null or Empty");
                throw DBDICT_STRUCTURE_FAILED;

            }

        }
        log.debug("_initDbdict:: dbdict init is end");
        return 0;
    } catch (e) {
        log.debug("_initDbdict::Error init dbdict process:" + e.toString());
        print("Error init dbdict process:" + e.toString());
        throw DBDICT_STRUCTURE_FAILED;
    }
}


function _getFileNames(joinTable) {

    var tables = [];
    var join = new SCFile("joindefs");
    sql = "join.name=\"" + joinTable + "\"";
    if (join.doSelect(sql) == RC_SUCCESS) {
        for (var i = 0; i < join.join_tables.length(); i++) {
            tables.push(join.join_tables[i].table_name);
        }
    } else {

        tables.push(joinTable);

    }
    return tables;
}


function _getFieldIndex(tables, field) {
    try {

        if (null == tables || 0 == tables.length || null == field) throw INDEX_CAN_NOT_FOUND;
        for (var i = 0; i < tables.length; i++) {

            var index = tabFunc.getFieldIndex(field, tables[i], true);
            if (-1 != index) return index;

        }
    } catch (e) {
        log.debug("_initDbdict::Error init dbdict process:" + e.toString());
        print("-getFieldIndex::" + e.toString());
        throw INDEX_CAN_NOT_FOUND;
    }
}




/**
 *
 *  This function to update dbdict with update data
 *
 *  @date 1/22/2014
 *  @author Neil Yu
 *
 *  @param 	{Array} 	fieldObjects 	    - field object list
 *  @param 	{String} 	dbdictName 	        - dbdict name
 *  @return {Number}    0                   - Success
 *
 *
 */
function updateStructureInDbdict(filedObjects, dbdictName) {
    var lng = filedObjects.length
    for (var i = 0; i < lng; i++) {
        try {
            var rc = updateFieldsofStructureInDbdict(filedObjects[i].name, filedObjects[i].structure, dbdictName, filedObjects[i].type);
            if (rc == 0) {
                msgFuncMap["dbdict"].call(this, dbdictName, "updated.");
                return 0;
            }
            throw DBDICT_UPDATE_FAILED;
        } catch (e) {

            print("Error dbdict " + dbdictName + " update process: " + e.toString());
            log.debug("updateStructureInDbdict::Error dbdict " + dbdictName + " update process: " + e.toString());
            throw DBDICT_UPDATE_FAILED;

        }
    }
    throw DBDICT_UPDATE_FAILED;
}

/**
 *
 *  This function to add extra fields into Structure of specify field in  dbdict
 *
 *  @date 1/22/2014
 *  @author Neil Yu
 *
 *  @param 	{String} 	fieldName 	        - field name
 *  @param 	{Array} 	fieldObjects 	    - field object list
 *  @param 	{String} 	dbdictName 	        - dbdict name
 *  @return {Number}    0                   - Success
 *
 *
 */
function updateFieldsofStructureInDbdict(fieldName, fieldObjects, dbdictName, type) {
    var dbdict = new SCFile("dbdict")
    var sql = "name=\"" + dbdictName + "\"";
    var tempDbdict = new SCFile("dbdict")
    if (dbdict.doSelect(sql) == RC_SUCCESS) {
        var lng = dbdict.field.length();
        var index = getLatestIndex(fieldName, dbdict);
        if (-1 == index) throw DBDICT_UPDATE_FAILED;
        var lng = fieldObjects.length;;
        var pos = getPosOfFieldInStructure(fieldName, dbdict);
        if (-1 == pos) throw DBDICT_UPDATE_FAILED;
        
        // move all fields to temp dbdict fields
        var tempPos = 0;
        for (var i = 0; i < lng; i++) {

            var fieldType = fieldObjects[i].type;
            var typeFromMTls = dataType[fieldType][0];
            var subTypeFromMTls = dataType[fieldType][1];
            
            if (type == "STRUCTURE") {
            	//type is array
            	if (dt.typeArray() == typeFromMTls) {
            		_setGeneralField(tempDbdict, fieldObjects[i].name, dt.typeArray(), 2, index, tempPos);
                    _setGeneralField(tempDbdict, fieldObjects[i].name, subTypeFromMTls, 3, 1, tempPos+1);
            	}
            	else {
            		_setGeneralField(tempDbdict, fieldObjects[i].name, dataType[fieldType][0], 2, index, tempPos);
            	}
            }
            else {
            	//type is array
            	if (dt.typeArray() == typeFromMTls) {
            		_setGeneralField(tempDbdict, fieldObjects[i].name, dt.typeArray(), 3, index, tempPos);
                    _setGeneralField(tempDbdict, fieldObjects[i].name, subTypeFromMTls, 4, 1, tempPos+1);
            	}
            	else {
            		_setGeneralField(tempDbdict, fieldObjects[i].name, dataType[fieldType][0], 3, index, tempPos);
            	}
            }
            index++;
            
            tempPos++;
            if (dt.typeArray() == typeFromMTls) {
            	tempPos++;
            }
        }
        // move add fields into Structure of field from temp dbdict fields
        var lng = tempDbdict.field.length();
        for (var j = 0; j < lng; j++) {
        	
        	dbdict.field = system.functions.insert(dbdict.field, pos + 1, 1, tempDbdict.field[j]);
        	pos ++;
        	
        }
        
        if (type == "STRUCTURE") {
			var names = ["record", "boolean1"];
            var values = [dbdict, true];
			callrad("dbdict.sql.changes", names, values);
		}
        if (dbdict.doSave() == RC_SUCCESS) {        
            return 0;
        }
    }
    throw DBDICT_UPDATE_FAILED;
}

/**
 *
 *  This function to add extra fields into dbdict
 *
 *  @date 1/22/2014
 *  @author Neil Yu
 *
 *  @param 	{Array} 	fieldObjects 	    - field object list
 *  @param 	{String} 	dbdictName 	        - dbdict name
 *  @return {Number}    0                   - Success
 *
 */


function updateDbdict(fieldObjects, dbdictName, citype) {
    try {
        var dbdict = new SCFile("dbdict")
        var sql = "name=\"" + dbdictName + "\"";
        log.debug("updateDbdict::sql= " + sql);
        if (dbdict.doSelect(sql) == RC_SUCCESS) {
            if (0 == _initDbdict(dbdict, "", fieldObjects, 0, null, citype)) {
            	log.debug("updateDbdict::dbdict= " + dbdict);
                var names = ["record", "boolean1"];
                var values = [dbdict, true];
               	callrad("dbdict.sql.changes", names, values);
            	
                if (dbdict.doUpdate() == RC_SUCCESS) {
                    msgFuncMap["dbdict"].call(this, dbdict, "updated.");
                    return 0;
                }
            }
            throw DBDICT_STRUCTURE_FAILED;
        }
    } catch (e) {
        throw DBDICT_UPDATE_FAILED;
    }
}


/**
 *
 *  This function to get latest index  on dbdict
 *
 *  @date 1/22/2014
 *  @author Neil Yu
 *
 *  @param 	{String} 	fieldName 	        - field name
 *  @param 	{Object} 	dbdict 	       		- dbdict object
 *  @returns {String} 	index	    	    - return latest index
 *                       -1                 - error when get index
 *
 */
function getLatestIndex(fieldName, dbdict) {

    try {
        if ("" == fieldName) {
            var lng = dbdict.field.length();
            var index = 0;
            for (var i = 0; i < lng; i++) {
                if (1 == dbdict.field[i].level) {
                    
                    index = dbdict.field[i].index;
                }
            }
            return index + 1;
        } else {
            return getLatestIndexInStructure(fieldName, dbdict);
        }
    } catch (e) {
        print("Error get latest index process: " + e.toString());
        log.debug("getLatestIndex::Error get latest index process: " + e.toString());
        return -1;

    }

}
/**
 *
 *  This function to get the pos of specify field  in dbdict
 *
 *  @date 1/22/2014
 *  @author Neil Yu
 *
 *  @param 	{String} 	fieldName 	        - field name
 *  @param 	{Object} 	dbdict 	       		- dbdict object
 *  @returns {Number} 	pos	    	        - return  pos of field
 *                      -1                 -  error when get pos
 *
 */
function getPosOfFieldInStructure(fieldName, dbdict) {
    try {
        var lng = dbdict.field.length();
        for (var i = 0; i < lng; i++) {
            //field level is equal with 2 and  field type is structure,it  so this field is Struture
            if ((2 == dbdict.field[i].level || 1 == dbdict.field[i].level) && dt.typeStructure() == dbdict.field[i].type) {
                if (fieldName == dbdict.field[i].name) {
                    // has fields in the Struture
                    if (i + 1 < lng) {

                        // start to search from next field behind struture field and compare adjacent two fields
                        for (var j = i + 1; j < lng; j++) {

                            // if adjacent two fields level is different, and next field level is not equal with 3, so previous field is last field in the structure of specify field

                            if ((dbdict.field[j - 1].level != dbdict.field[j].level) && 1 == dbdict.field[j].level) {

                                return j;

                            }

                        }
                        //previous field is the last field in dbdict
                        return j;
                        // no fields in the Structure
                    } else

                        return 1;
                }

            }

        }
        print("No Struture field " + fieldName + " in the current dbdict you specify");
        log.debug("getPosOfFieldInStructure::No Struture field " + fieldName + " in the current dbdict you specify");
        return -1;
    } catch (e) {
        print("Error get pos of field " + fieldName + " process: " + e.toString());
        log.debug("getPosOfFieldInStructure::Error get pos of field " + fieldName + " process: " + e.toString());
        return -1

    }
}

/**
 *
 *  This function to get the latest index of Structure of specify field in dbdict
 *
 *  @date 1/22/2014
 *  @author Neil Yu
 *
 *  @param 	{String} 	fieldName 	        - field name
 *  @param 	{Object} 	dbdict 	       		- dbdict object
 *  @returns {String} 	index	    	    - return latest index
 *                      -1                  - No Struture field in the current dbdict you specify
 *
 */
function getLatestIndexInStructure(fieldName, dbdict) {
	var lng = dbdict.field.length();
	var maxIndex = 0;

    for (var i = 0; i < lng; i++) {
        //field level is equal with 2 and  field type is structure,it  so this field is Struture
        if (dt.typeStructure() == dbdict.field[i].type) {
            if (fieldName == dbdict.field[i].name) {
                if (i + 1 == lng) {
                	return 1;
                }
                if (dbdict.field[i+1].level == dbdict.field[i].level) {
					return 1;
				}
                // start to search from next field behind struture field and compare adjacent two fields
                for (var j = i + 1; j < lng; j++) {
                	if (dbdict.field[j].level === 1) {
                    	return maxIndex + 1;
                    }
                    else {
                    	if (dbdict.field[j].index > maxIndex) {
                        	maxIndex = dbdict.field[j].index;
                        }
                    }
                }
                return maxIndex + 1;
            }
        }
    }
    print("No Struture field " + fieldName + " in the current dbdict you specify");
    log.debug("getLatestIndexInStructure::No Struture field " + fieldName + " in the current dbdict you specify");
    return -1;
}


/**
 *
 *  This function to compare requested table fields with device, substract the difference.
 *
 *  @date 1/22/2013
 *  @author Ryan
 *
 *  @param  {Object}    CIType              - request object
 *  @param  {String}    dbdictName          - dbdict name
 *  @returns {Object}                       - extra fields and update fields
 *                      null                - Failure
 */

function compareTable(fieldObjects, dbdictName) {
    var mapArray = function (object, array) {
        for (var i = 0; i < array.length; i++) {

            var fld = array[i];
            object[fld.name] = fld;

        }
    }

    var fields = {
        "extra": [],
        "update": []
    };
    var citype_fields = fieldObjects;
    var current_fields = lib.uCMDBCIDef.setFieldsList(dbdictName);
    var current_fields_map = {};
    //map current fields names
    mapArray(current_fields_map, current_fields); 
    //compare citype fields with current table fields

    for (var i = 0; i < citype_fields.length; i++) {
        var fld2 = citype_fields[i];

        //find extra fields
        if (undefined == current_fields_map[fld2.name]) fields.extra.push(fld2);
        if (fld2.type == "STRUCTURE" || fld2.type == "ARRAY_STRUCTURE") {
        	if (current_fields_map[fld2.name] && -1 != current_fields_map[fld2.name]["type"].toUpperCase().indexOf("STRUCTURE")) {
            	//compare structure fields
            	var current_structure_map = {};
            	var extra_structure_fields = [];
            
            	mapArray(current_structure_map, current_fields_map[fld2.name].structure);
            	for (var ii = 0; ii < fld2.structure.length; ii++) {
                	if (undefined == current_structure_map[fld2.structure[ii].name]) extra_structure_fields.push(fld2.structure[ii]);
            	}

            	//if there is new structure field, push to fields.update
            	if (extra_structure_fields.length > 0) {
                	var update_field = {
                    	"name": fld2.name,
                    	"caption": fld2.caption,
                    	"type": fld2.type,
                    	"structure": extra_structure_fields
                	};
                	fields.update.push(update_field);
            	}
        	}
        }
    }
    return fields;
}


/**
 *
 *  This function to check dbdict before create new dbdict against json data
 *
 *  @date 2/17/2014
 *  @author Neil Yu
 *
 *  @param  {String}    citype             - all relevate information about CI Type Creation in JSON Data
 *  @returns {String}   0                  - Success
 *                          
 */
function getActionList4Dbdict(ciTypeFields, tableName) {

    var dbdictActionList = [];

    if ("" != tableName) {

        var table = dh.initDbdictFile(tableName);
        var rs = compareTable(ciTypeFields, tableName);
        
        if (null != table) {
            if (null != rs.extra && 0 != rs.extra.length) {
				dbdictActionList.push({
                	"name": "dbdict",
                    "action": "update",
                    "record": {
                    	"name": tableName,
                        "action": "add",
                        "fields": rs.extra
                    }
				});
			}
                
			if (null != rs.update && 0 != rs.update.length) {
				dbdictActionList.push({
                    "name": "dbdict",
                    "action": "update",
                    "record": {
                    	"name": tableName,
                        "action": "update",
                        "fields": rs.update
                     }
				});
			}
        }
    } 
    
    return dbdictActionList;
}


/**
 *
 *  This function to check joindefs record has been existing and can be reused  before create new joindefs record
 *  @date 2/24/2014
 *  @author Neil Yu
 *  @param   {Jason Data}            ciType          - CI Type Data
 *  @param   {Array_Struture}    tableActionList     - table created and updated list
 *  @param   {Array_Struture}    dbdictActionList    - dbdict created and updated list
 *  @returns {Array_Struture}   tableActionList   - table created and updated list
 *           
 */
function getActionList4JoinDefs(ciType, tableActionList, dbdictActionList) {

    var tableName = ciType["table"];

    if (null != getAction(tableName, dbdictActionList)) {
        var table = new SCFile("joindefs");

        var sql = "join.name=\"" + "join" + tableName + "\""
        
        if (table.doSelect(sql) == RC_SUCCESS) {



            var joinTables = table["join_tables"][0][0] + table.join_tables[1][0];
            //join tables only include  "device" and table created
            if (2 == table["join_tables"].length() && (joinTables == "device" + tableName || joinTables == tableName + "device")) {
                // if  "device" or specify table  will be updated , need update joindefs to refresh field list in joindefs
                if ("update" == getAction(tableName, dbdictActionList) || "update" == getAction("device", dbdictActionList)) {

                    tableActionList.push({
                        "name": "joindefs",
                        "action": "update"

                    });
                }

            } else {

                throw JOINDEFS_CAN_NOT_BE_REUSED;

            }

        } else {
            tableActionList.push({
                "name": "joindefs",
                "action": "add"

            });


        }

    }
    return tableActionList;



}


function _buildRecord4JoinDefs(action, tableName) {

    var record = null;
    if ("add" == action) {

        record = {
            "join.name": "join" + tableName,
            "join.tables": [{
                "table.name": "device"
            }, {
                "table.name": tableName
            }]

        }

    }
    if ("update" == action) {
        record = {
            "join.name": "join" + tableName
        }


    }
    return record;

}

/**
 *
 *  This function to check ERDDef record has been existing and can be reused before create new ERDDef record
 *
 *  @date 2/25/2014
 *  @author Neil Yu
 *
 *  @param   {Jason Data}            ciType          - CI Type Data
 *  @param   {Array_Struture}    tableActionList     - table created and updated list
 *  @param   {Array_Struture}    dbdictActionList    - dbdict created and updated list
 *  @returns {Array_Struture}    tableActionList     - table created and updated list
 *           
 */
function getActionList4ERDDef(ciType, tableActionList, dbdictActionList) {

    var tableName = ciType["table"];

    if (null != getAction(tableName, dbdictActionList)) {
        var table = new SCFile("erddef");

        var sql = "(file1=\"device\" and file2=\"" + tableName + "\") or ( file1=\"" + tableName + "\" and file2=\"device\")";

        if (table.doSelect(sql) == RC_SUCCESS) {

            // one of file1 and file2 hasn't field name "logical.name"
            if ("logical.name" != table["file1.names"][0] || "logical.name" != table["file2.names"][0]) {
                throw ERDDEF_CAN_NOT_BE_REUSED;
            }

        } else {
            // erddef record does not exist
            tableActionList.push({
                "name": "erddef",
                "action": "add"

            });

        }
    }
    return tableActionList;




}

function _buildRecord4ERDDef(action, tableName) {

    var record = null;

    if ("add" == action) {
        record = {
            "file1": "device",
            "file2": tableName,
            "reltype": "C",
            "cascade.deletes": true,
            "file1.names": ["logical.name"],
            "file2.names": ["logical.name"]
        }

    }
    return record;


}
/**
 *
 *  This function to check DEMRule record has been existing and can be reused before create new DEMRule record
 *
 *  @date 2/25/2014
 *  @author Neil Yu
 *
 *  @param   {Jason Data}            ciType          - CI Type Data
 *  @param   {Array_Struture}    tableActionList     - table created and updated list
 *  @param   {Array_Struture}            params      - param for DEMRule list
 *  @returns {Array_Struture}    tableActionList     - table created and updated list
 *           
 */
function getActionList4DEMRule(ciType, tableActionList, params) {


    var table = new SCFile("ddmRule");
    var type = _ucfirst(ciType["type"]);
    var sql = "id=\"" + "ucmdb" + type + "\"";
    

    if (table.doSelect(sql) == RC_SUCCESS) {


        if (params[0]["tableName"] == table["tableName"])

        {


            tableActionList.push({
                "name": "ddmRule",
                "action": "update"

            });

        } else

        {
            throw DEMRULE_CAN_NOT_BE_REUSED;


        }

    } else {
        // ddmrule record does not exist
        tableActionList.push({
            "name": "ddmRule",
            "action": "add"

        });

    }
    return tableActionList;
}

function _buildRecord4DdmReconcile(action, tableName) {
	var joinTableName = "join" + tableName;
	return {
        	"tableName": joinTableName,
        	"fieldName": getDisplayLable(joinTableName),
            "sequence": 1
        	}
}

function _buildRecord4DEMRule(action, ciType, params, tableName, setExtraFields) {
    var type = _ucfirst(ciType);
    var record = null;
    var name = tableName;
    if (name == undefined) {
    	name = params[0]["tableName"];
    }

    if ("add" == action) {
    	var defaultRuleFields = ['type', 'company', 'display.name', 'default.gateway', 'network.name', 'building', 'floor',
    							  'room', 'location', 'operating.system', 'serial.no.', 'vendor', 'asset.tag', 'id'];
    	if (setExtraFields) {
    		defaultRuleFields = ['type', 'company', 'display.name', 'default.gateway', 'network.name', 'building', 'floor',
    							 'room', 'location', 'operating.system', 'serial.no.', 'vendor', 'asset.tag', 'id',
    							 'addlMacAddress', 'bios.id', 'os.version', 'physical.mem.total', 'machine.name'];
    	}
        var defaultRules = [];
        for (i=0; i<defaultRuleFields.length; i++) {
        	var caption = system.functions.get_field_caption(defaultRuleFields[i],'device');
        	if (caption == null || caption == "") {
        		caption = defaultRuleFields[i];
        	}
        	defaultRules.push({"fieldName": caption});
        }
        
        if (isDemRuleExist(type)) {
        	type = type + new Date().getTime().toString().substr(-5);
        }
        
        record = {
            "id": "ucmdb" + type,
            "tableName": name,
            "condition": system.functions.parse("type in $L.file=\"" + ciType + "\"", 4),
            "insertAction": "add",
            "updateAction": "change",
            "deleteAction": "deleteByStatus",
            "deleteStatus": "Retired/Consumed",
            "dupNameAction": "postfix",
            "dupNamePostfix": "_RENAMED_",
            "rules": defaultRules
        }

    }
    return record;
}

function _processFldRules(ciType, tableName) {


    var fields = ciType["fields"];
    var lng = fields.length;
    var rules = [];
    var tables = _getFileNames(tableName);

    for (var i = 0; i < lng; i++) {
        // type is array of struture
        if (dt.typeArray() == dataType[fields[i].type][0] && dt.typeStructure() == dataType[fields[i].type][1]) {
            var structure_fields = fields[i].structure;
            for (var j = 0; j < structure_fields.length; j++) {
                var index = _getFieldIndex(tables, structure_fields[j].name);

                rules.push({
                    "fieldName": structure_fields[j].name,
                    "structure": fields[i].name,
                    "structureIndex": index
                });

            }

        } else {
            rules.push({
                "fieldName": fields[i].name
            });

        }

    }

    return rules;
}
/**
 *
 *  This function to check Web Service record has been existing and can be reused before create new Web Service  record
 *
 *  @date 2/25/2014
 *  @author Neil Yu
 *
 *  @param   {Jason Data}            ciType          - CI Type Data
 *  @param   {Array_Struture}    tableActionList     - table created and updated list
 *  @param   {Array_Struture}            params      - param for web service list
 *  @returns {Array_Struture}    tableActionList     - table created and updated list
 *          
 */
function getActionList4WebService(ciType, tableActionList, params) {


    var table = new SCFile("extaccess");
    var type = _ucfirst(ciType["type"]);
    var sql = "service.name=\"ucmdbIntegration\" and object.name=\"" + "ucmdb" + type + "\"";

    if (table.doSelect(sql) == RC_SUCCESS) {

        if (params[2]["name"] == table["name"])

        {
            tableActionList.push({
                "name": "extaccess",
                "action": "update"

            });


        } else

        {
            throw WEBSERVICE_CAN_NOT_BE_REUSED;


        }

    } else {

        tableActionList.push({
            "name": "extaccess",
            "action": "add"

        });

    }
    return tableActionList;
}

function _buildRecord4WebService(action, ciType, ciTypeDesc, params, tableName, setExtraFields) {
    var type = ciTypeDesc.replace(/\s/g,"");
    var record = null;
    var name = tableName;
    if (name == undefined) {
    	name = params[2]["name"];
    }

    if ("add" == action) {
    	if (isWebServiceExist(['object.name'], ["ucmdb" + type])) {
        	type = type + new Date().getTime().toString().substr(-5);
        }
    
    	// set default fields and captions
    	var soafields = ['ucmdb.id', 'type', 'subtype', 'company', 'logical.name', 'default.gateway', 'network.name', 'building',
            			  'floor', 'room', 'location', 'operating.system', 'serial.no.', 'vendor', 'asset.tag', 'istatus', 'sm.device.display.name'];
    	var soacaptions = ['UCMDBId', 'Type', 'Subtype', 'CustomerId', 'CIIdentifier', 'DefaultGateway', 'DNSName', 'Building',
       					    'Floor', 'Room', 'Location', 'OS', 'SerialNo', 'Vendor', 'AssetTag', 'AssetStatus','DisplayName'];
    	if (setExtraFields) {
    		soafields = ['ucmdb.id', 'type', 'subtype', 'company', 'logical.name', 'default.gateway', 'network.name', 'building',
            			 'floor', 'room', 'location', 'operating.system', 'serial.no.', 'vendor', 'asset.tag', 'istatus',
            			 'addlMacAddress', 'bios.id', 'os.version', 'physical.mem.total', 'machine.name', 'sm.device.display.name'];
            soacaptions = ['UCMDBId', 'Type', 'Subtype', 'CustomerId', 'CIIdentifier', 'DefaultGateway', 'DNSName', 'Building',
       					   'Floor', 'Room', 'Location', 'OS', 'SerialNo', 'Vendor', 'AssetTag', 'AssetStatus',
       					   'AddlMacAddress', 'BIOSID', 'OSVersion', 'PhysicalMemory', 'HostName','DisplayName'];
    	}
    
        record = {
            "object.name": "ucmdb" + type,
            "name": name,
            "service.name": "ucmdbIntegration",
            "allowed.actions": ["save", "delete", "add"],
            "action.names": ["Update", "Delete", "Create"],
            "action.type": ["create", "passthru", "create"],
            "execute.actions": ["ddm", "ddm", "ddm"],
            "expressions": ["type in $L.file=nullsub(type in $L.file, \"" + ciType + "\")"],
            "soafile": [],
            "rest.enabled":true,
            "rest.list.name":"ucmdb" + type + "s",
            "rest.resource.name":"ucmdb" + type,
            "rest.keys":["logical.name"],
            "max.records.page":1000,
            "rest.list.post":"Create",
            "rest.resource.post":"Create",
            "rest.resource.put":"Update",
            "rest.resource.delete":"Delete",
            "soafield":soafields,
       		"soacaption":soacaptions
        }
        
        lib.extaccessTools.populateSoaFile(record, name);
    }
    
    return record;
}



function _processFldSetSOA(ciType) {
    var fields = ciType["fields"];
    var lng = fields.length;

    var fieldStr = new Array();
    var captionStr = new Array();
    for (var i = 0; i < lng; i++) {
        if (dt.typeArray() == dataType[fields[i].type][0] && dt.typeStructure() == dataType[fields[i].type][1]) {


            for (var j = 0; j < fields[i].structure.length; j++) {
                fieldStr.push(fields[i].name + "[" + fields[i].structure[j].name + "]");
                captionStr.push(fields[i].structure[j].caption);

            }
        } else {
            fieldStr.push(fields[i].name);
            captionStr.push(fields[i].caption);

        }
    }
    return [fieldStr, captionStr];
}




/**
 *
 *  This function to check Device Type record has been existing and can be reused before create new Device Type  record
 *
 *  @date 2/25/2014
 *  @author Neil Yu
 *
 *  @param   {Jason Data}            ciType          - CI Type Data
 *  @param   {Array_Struture}    tableActionList     - table created and updated list
 *  @param   {Array_Struture}            params      - param for web service list
 *  @returns {Array_Struture}    tableActionList     - table created and updated list
 *           
 */
function getActionList4DeviceType(ciType, tableActionList, params) {


    var table = new SCFile("devtype");
    var qrySql = "device.type=\"" + ciType["type"] + "\" or device.name=\"" + ciType["typeDesc"] + "\"";
    
    if (table.doCount(qrySql) > 0) {

        var sql = "device.name=\"" + ciType["typeDesc"] + "\" and device.type=\"" + ciType["type"] + "\"";
        
        if (table.doSelect(sql) == RC_SUCCESS) {

            if (params[1]["attr.file"] == table["attr.file"] && params[1]["joindef"] == table["joindef"]) {
                tableActionList.push({
                    "name": "devtype",
                    "action": "update"

                });

            } else

            {
                throw DEVICETYPE_CAN_NOT_BE_REUSED;


            }
        } else {
            throw DEVICETYPE_CAN_NOT_BE_REUSED;

        }
    } else {


        tableActionList.push({
            "name": "devtype",
            "action": "add"

        });

    }
    return tableActionList;
}

function _buildRecord4DeviceType(action, ciType, params) {

    var record = null;
    if ("add" == action) {
        record = {
            "device.name": ciType["device.name"],
            "device.type": ciType["device.type"],
            "attr.file": params[1]["attr.file"],
            "joindef": params[1]["joindef"],
            "format.name": params[1]["format.name"],
            "active": true,
            "sub.type": ciType["sub.type"]
        }

    }
    if ("update" == action) {

        record = {
        	"device.name": ciType["device.name"],
        	"device.type": ciType["device.type"],
            "attr.file": params[1]["attr.file"],
            "joindef": params[1]["joindef"]
        }



    }
    return record;
}

/**
 *
 *  This function to get the action of table
 *
 *  @date 2/24/2014
 *  @author Neil Yu
 *
 *  @param   {String}             tableName          - table name
 *  @param   {Array_Structure}    tableActionList     - table created and updated list
 *  @returns {String}             "add" or "update"  - action for table
 *                                null               - no action for table
 */

function getAction(tableName, dbdictActionList) {
    for (var i = 0; i < dbdictActionList.length; i++) {
        
        var dbdict = dbdictActionList[i]["record"];
        if (tableName == dbdict["name"]) {

            return dbdictActionList[i]["action"];
        }
    }
    return null;
}

/**
 *
 *  This function to generate initial values for creating web service, dem rule, device type
 *
 *  @date 2/24/2014
 *  @author Neil Yu
 *
 *  @param  {String}    tableName          - table name
 *  @param  {String}    action             - action for table
 *  @returns {String}   param list         - param for web service, dem rule, device type list
 */

function genParams(tableName, action) {
    var params = []
    if ("node" == tableName) {
        // for ddmRule
        params.push({
            "tableName": "joinnode"
        });
        // for devtype
        params.push({
            "attr.file": "node",
            "joindef": "joinnode",
            "format.name": "configurationItem"
        });
        // for extaccess
        params.push({
            "name": "joinnode"
        });


    } else if ("device" == tableName) {

        params.push({
            "tableName": "device"
        });
        params.push({
            "attr.file": null,
            "joindef": null,
            "format.name": "configurationItem"
        });
        params.push({
            "name": "device"
        });

    } else if ("node" != tableName && "device" != tableName && ("add" == action || "update" == action || "reuse" == action)) {

        params.push({
            "tableName": "join" + tableName
        });
        params.push({
            "attr.file": tableName,
            "joindef": "join" + tableName,
            "format.name": "configurationItem"
        });
        params.push({
            "name": "join" + tableName
        });

    } else {

        params.push({
            "tableName": "device"
        });
        params.push({
            "attr.file": null,
            "joindef": null,
            "format.name": "configurationItem"
        });
        params.push({
            "name": "device"
        });

    }
    return params;

}

function getTableActionList(ciType, params, dbdictActionList) {

    var tableActionList = [];
    try {

        //check  Device Type
        tableActionList = getActionList4DeviceType(ciType, tableActionList, params);

        // check joindefs
        tableActionList = getActionList4JoinDefs(ciType, tableActionList, dbdictActionList)

        // check erddef
        tableActionList = getActionList4ERDDef(ciType, tableActionList, dbdictActionList);

        // check DEM Rule
        tableActionList = getActionList4DEMRule(ciType, tableActionList, params);

        // check Web Service
        tableActionList = getActionList4WebService(ciType, tableActionList, params);



        return tableActionList;
    } catch (e) {

        throw e;
    }

}


function _processDbdict(record, action, citype) {
	try {
        if ("add" == action) {
            createDbdict(record["fields"], record["name"])
        }
        if ("update" == action) {
            if ("add" == record["action"]) {
                updateDbdict(record["fields"], record["name"], citype);
            }
            if ("update" == record["action"]) {
                updateStructureInDbdict(record["fields"], record["name"]);
            }
        }
    }
    catch (ex) {
        throw ex;
    }
}

function _genSQL4DEMRule(record) {

    return "id=\"" + record["id"] + "\"";
}

function _genSQL4JoinDefs(record) {

    return "join.name=\"" + record["join.name"] + "\"";
}

function _genSQL4ERDDef(record) {;

    return "(file1=\"device\" and file2=\"" + record["file2"] + "\") or ( file1=\"" + record["file1"] + "\" and file2=\"device\")";
}

function _genSQL4WebService(record) {

    return "service.name=\"" + record["service.name"] + "\" and object.name=\"" + record["object.name"] + "\"";
}

function _genSQL4DeviceType(record) {

    return "device.name=\"" + record["device.name"] + "\" and device.type=\"" + record["device.type"] + "\"";
}

function _genSQL4DdmReconcile(record) {
    return "tableName=\"" + record["tableName"] + "\"";
}

function _genMessage4DBDict(table, action) {

    var tableName = table["name"];
    if (!tableName) tableName = table;
    print("dbdict : " + tableName + " is " + action);

}

function _genMessage4JoinDefs(table, action) {

    print("joindefs : " + table["join.name"] + " is " + action);

}

function _genMessage4ERDDef(table, action) {

    print("erddef : " + table["file1"] + " and " + table["file2"] + " is " + action);

}

function _genMessage4DEMRule(table, action) {


    print("ddmRule : " + table["id"] + " is " + action);
}

function _genMessage4WebService(table, action) {

    print("extacess : " + table["object.name"] + " is " + action);

}

function _genMessage4DeviceType(table, action) {

    print("devtype : " + table["device.type"] + " is " + action);

}

function _genMessage4DdmReconcile(table, action) {

    print("devtype : " + table["tableName"] + " is " + action);

}


function _processTable(tableName, record) {
    var table = new SCFile(tableName);

    var sql = sqlFuncMap[tableName].call(this, record);

    var rc = table.doSelect(sql);

    var dbdict = $(tableName).dbdict();
    var dbdictService = $("#dbdictService");
    var descriptor = dbdictService.getDescriptorMeta(dbdict.field);
    table = _initTable(table, record, descriptor, dbdictService);


    if (table.doSave() == RC_SUCCESS) {
        if (RC_SUCCESS != rc) {

            msgFuncMap[tableName].call(this, table, "created.");
        } else {

            msgFuncMap[tableName].call(this, table, "updated.");

        }

    }

}

function _initTable(table, record, descriptor, dbdictService) {

    for (var ikey in record) {

        var fieldMeta = dbdictService.getFieldMeta(ikey, descriptor, false);

        var childs = fieldMeta.childs;

        if (dt.typeArray() == fieldMeta.field.type) {

            if (dt.typeStructure() == childs[0].field.type) {

                for (var i = 0; i < record[ikey].length; i++) {
                    // each structure record in Array as individual structure to handle 

                    table[ikey][i] = _initTable(table[ikey][i], record[ikey][i], descriptor, dbdictService);

                }

            } else {
                table[ikey] = record[ikey];

            }


        }
        else {
            table[ikey] = record[ikey];
        }

    }
    return table;

}


function validateUcmdbJson(jsonObj) {

	try {
		var ciType = $.trim(jsonObj["type"]);
		var fields = jsonObj["fields"];
		var capStr = ""; // string for all captions in JSON
    	var nameStr = ""; // string for all names in JSON
    	var dataTypeString = JSON.stringify(dataType);
	
		//ci type should not be empty	
		if (ciType == null || ciType == "") {
    		throw errMsg["EMTPY_CI_TYPE"];
    	}
    
    	//ci type should exist	
		var ciTypeRecord = new SCFile("devtype", SCFILE_READONLY);
		ciTypeRecord.setFields("device.type, attr.file");
		var rc = ciTypeRecord.doSelect("device.type = \"" + ciType + "\"");
		if (rc == RC_SUCCESS) {
			var tableName = ciTypeRecord.attr_file;
		}
		else {
			throw errMsg["CI_TYPE_NOT_EXIST"];
		}
	
    	//validate the field attribute
    	validateFieldAttribute(fields, true, null);
    
    	//validate the structure attribute
    	for (i=0; i<fields.length; i++) {
    		if (fields[i]['type'].indexOf('STRUCTURE') !== -1) {
    			if (fields[i]['structure'] == null || fields[i]['structure'] == "" || fields[i]['structure'] == []) {
    				var emptyCITRecord = new SCFile("UCMDBEmptyCIType");
					var rc = emptyCITRecord.doSelect("name = \"" + fields[i]['name'] + "\" and citype = \"" + ciType + "\"");
					//insert the empty structure into "UCMDBEmptyCIType" table
					if (rc != RC_SUCCESS) {
						var emptyCIT = new SCFile("UCMDBEmptyCIType");
						emptyCIT.name = fields[i]['name'];
						emptyCIT.citype = ciType;
						emptyCIT.caption = fields[i]['caption'];
						emptyCIT.type = fields[i]['type'];
						if (emptyCIT.doAction('add') != RC_SUCCESS) {
							throw errMsg["EMPTY_STRUCTURE_INSERT_FAILED"];
						}
					}
					//update the empty structure
					else {
						emptyCITRecord.caption = fields[i]['caption'];
						emptyCITRecord.type = fields[i]['type'];
						if (emptyCITRecord.doAction('save') != RC_SUCCESS) {
							throw errMsg["EMPTY_STRUCTURE_UPDATE_FAILED"];
						}
					}
    			}
    			else {
    				validateFieldAttribute(fields[i]['structure'], false, fields[i]['name'], fields[i]['type']);
    			}	
    		}
    	}
    	
    	return tableName;
	}
	catch (ex) {
		vars.$ERROR_CODE = VALIDATE_CITYPE_FIELDS_FAILED;
		throw(ex);
	}
	
	function validateFieldAttribute(fields, isLevel1, parentFieldName, parentFieldType) {
		//fields should not be empty
    	if (fields[0] == null) {
    		throw errMsg["EMTPY_CI_TYPE_FIELD"];
    	}

    	var requiredFields = ['name', 'caption', 'type'];
    	var msg4requiredFields = ['EMTPY_FIELD_NAME', 'EMTPY_FIELD_CAPTION', 'EMTPY_FIELD_TYPE'];
    	for (i=0; i<fields.length; i++) {
    		//validate the not empty field attribute
    		for (rfIndex=0; rfIndex<requiredFields.length; rfIndex++) {
				var fieldValue = fields[i][requiredFields[rfIndex]];
    			if(fieldValue == null || fieldValue == '') {
    				throw errMsg[msg4requiredFields[rfIndex]];
    			}
    		}

    		parseJsonNode(fields[i]);
    		
    		//validate the field name
    		if (fields[i]['name'].length > MAX_FIELD_NAME_LENGTH) {
    			throw errMsg["FIELD_NAME_EXCEED_MAX_LENGTH"];
    		}
    		if (!system.functions.rtecall("alalnum", 0, fields[i]['name'], ".")) {
    			throw system.functions.scmsg(1205, "us");
    		}	
    		
    	
    		//level2 field type should not be "STRUCTURE" or "ARRAY_STRUCTURE"
    		if (!isLevel1) {
    			if (fields[i]['type'].indexOf('STRUCTURE') !== -1) {
    				throw errMsg["FIELD_TYPE_NOT_SUPPORTED"];
    			}
    		}

    		if (!!!fields[i]['structure']) {
    			fieldsTypeCompare(fields[i], tableName, parentFieldName, parentFieldType);
    		}
    	}
	}
	

    function parseJsonNode(jsonNode) {
    	for (var i in jsonNode) {
           	var key = $.trim(i);
            
            if (key == "caption" || key == "name") {
            	jsonNode[i] = $.trim(jsonNode[i]);
            	var value = jsonNode[i];
                        
                if (key == "name") {
                	//validate the white space
                	if (value.indexOf(" ") > 0) {
                		throw errMsg["FIELD_NAME_WHITE_SPACE"];
                	}
                
                	//validate the dupliate attribute
                	if (nameStr == "") nameStr = "|";
                	if (nameStr.indexOf("|" + value + "|") >= 0) {
                		throw errMsg["FIELD_ATTRIBUTE_DUPLICATE"];
                	}
                	nameStr += value + "|";
                }
               	else {
               		//validate the white space
                	if (value.indexOf(" ") > 0) {
                		throw errMsg["FIELD_CAPTION_WHITE_SPACE"];
                	}
                
                	//validate the dupliate attribute
               		if (capStr == "") capStr = "|";
                	if (capStr.indexOf("|" + value + "|") >= 0) {
                		throw errMsg["FIELD_ATTRIBUTE_DUPLICATE"];
                	}
                	capStr += value + "|";
               	}
			}
    	}
    }


	function fieldsTypeCompare(fieldJson, tableName, parentFieldName, parentFieldType) {
        var device = lib.uCMDBCIDef.setFieldsList("device");

        if(tableName == null || tableName == "" || tableName == "device") {
        	return fieldsTypeCompareSub(fieldJson, device, true, parentFieldName, parentFieldType);
        }
        else {
        	var table = lib.uCMDBCIDef.setFieldsList(tableName);
        	// first check in device table, return true if it found; or continue to check target table
        	return fieldsTypeCompareSub(fieldJson, device, true, parentFieldName, parentFieldType) ? true : fieldsTypeCompareSub(fieldJson, table, false, parentFieldName, parentFieldType);
        }
	}


    function fieldsTypeCompareSub(jsonNode, mappingTable, isDeviceTable, parentFieldName, parentFieldType) {
        var stringMapField = JSON.stringify(mappingTable);
        if (dataTypeString.indexOf(jsonNode.type) < 0) {
            throw errMsg["FIELD_TYPE_NOT_SUPPORTED"];
        }
        
		if (parentFieldName && isDeviceTable && stringMapField.indexOf(parentFieldName) >= 0) {
        	throw errMsg["FIELD_STRUCTURE_EXIST_IN_DEVICE"];
        }
       		
        if (stringMapField.indexOf(jsonNode.name) >= 0) {
        	for (var i=0; i<mappingTable.length; i++) {
        		var fieldType = mappingTable[i].type;
        		if(dataType[fieldType][0] == dt.typeStructure() || dataType[fieldType][1] == dt.typeStructure()) {
        			if (mappingTable[i].name == jsonNode.name) {
        				throw errMsg["DUPLICATE_CI_TYPE_FIELD"];
        			}

        			var tableField = mappingTable[i].structure;
        			for (var j=0; j<tableField.length; j++) {
                    	if (jsonNode.name == tableField[j].name) {
                    		if (parentFieldName) {
                    			//field cannot be duplicated under the same structure for ARRAY_STRUCTURE
                    			if ((parentFieldType == "ARRAY_STRUCTURE") && (mappingTable[i].name == parentFieldName)) {
                    				throw errMsg["DUPLICATE_CI_TYPE_FIELD"];
                    			}
                    			//field cannot be duplicated for STRUCTURE
                    			else if (parentFieldType == "STRUCTURE") {
                    				throw errMsg["DUPLICATE_CI_TYPE_FIELD"];
                    			}
                    		}
                    		else {
                    			throw errMsg["DUPLICATE_CI_TYPE_FIELD"];
                    		}
                    	}
                    }
        		}
        		else {
        			if ((jsonNode.name == mappingTable[i].name) && (parentFieldType !== "ARRAY_STRUCTURE")) {
        				throw errMsg["DUPLICATE_CI_TYPE_FIELD"];
        			}
        		}
        	}
        }
        
        return false;
	}
}