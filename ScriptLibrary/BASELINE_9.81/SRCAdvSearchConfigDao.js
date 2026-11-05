var _ = lib.Underscore.require();
var confComm = lib.SRCAdvSearchConfigComm;
var tableUtil = lib.tableFunctions;
var CONFIG_TABLE = "svcAdvanceSearchConfig";
var DBDICT = "dbdict";
var DbFields = confComm.DbFields();
var FieldTypes = confComm.FieldTypes();
var FieldTypeNames = confComm.FieldTypeNames();
var log = getLog("srcAdvanceSearch");


function getExistingFields(companyName, fileName) {
	var fields = new SCFile(CONFIG_TABLE, SCFILE_READONLY);
	var query = DbFields.COMPANY + "=\"" + companyName + "\" and " + DbFields.FILE_NAME +"=\"" + fileName + "\"";
	
	var orderByFields=new Array(DbFields.ORDER);
	var orderBySort=new Array(1);
	orderBySort[0]=SCFILE_ASC;
	fields.setOrderBy(orderByFields, orderBySort);
	
	var rt = fields.doSelect(query);
	var results = [];
	
	while (rt == RC_SUCCESS) {		
		results.push(buildField(fields));
		rt = fields.getNext();
	}
	
	return results;
}

/*
function deleteExistingFields(company, fileName) {
	var fields = new SCFile(CONFIG_TABLE);
	var condition = DbFields.COMPANY+"=\"" + company + "\" and " + DbFields.FILE_NAME + "=\"" + fileName + "\"";
	var rc = fields.doSelect(condition);
	while(rc == RC_SUCCESS) {
		fields.doDelete();
		rc = fields.getNext();
	}
}
*/

function getExistingField(company, fileName, fieldName) {
	var fields = new SCFile(CONFIG_TABLE, SCFILE_READONLY);
	var condition = DbFields.COMPANY+"=\"" + company + "\" and " + DbFields.FILE_NAME + "=\"" + fileName + "\" and " + DbFields.FIELD_NAME + "=\"" + fieldName + "\"";	
	var rc = fields.doSelect(condition);
	var aField = null;
	if(rc == RC_SUCCESS) {
		if(fields[DbFields.ID] != null) {
			aField = buildField(fields);	
		}
	}
	
	return aField;
}

function buildField(dbRecord) {
	var aField = {};
	aField[DbFields.ID] = dbRecord[DbFields.ID];
	aField[DbFields.COMPANY] = dbRecord[DbFields.COMPANY];
	aField[DbFields.FILE_NAME] = dbRecord[DbFields.FILE_NAME];
	aField[DbFields.FIELD_NAME] = dbRecord[DbFields.FIELD_NAME];
	aField[DbFields.FIELD_TYPE] = dbRecord[DbFields.FIELD_TYPE];
	aField[DbFields.FIELD_LABEL] = dbRecord[DbFields.FIELD_LABEL];
	aField[DbFields.ORDER] = dbRecord[DbFields.ORDER];
	aField[DbFields.GLOBALLIST] = dbRecord[DbFields.GLOBALLIST];
	aField[DbFields.ACTIVE] = dbRecord[DbFields.ACTIVE];
	aField[DbFields.FIELD_LABEL_TYPE] = dbRecord[DbFields.FIELD_LABEL_TYPE];	
	aField[DbFields.VALIDATION_RULE] = dbRecord[DbFields.VALIDATION_RULE];
	aField[DbFields.MATCH_TABLE] = dbRecord[DbFields.MATCH_TABLE];
	aField[DbFields.MATCH_FIELD] = dbRecord[DbFields.MATCH_FIELD];
	
	return aField;
} 

function shouldIncludeType(type) {
	return FieldTypes.number === type 
		|| FieldTypes.character === type
		|| FieldTypes.datetie === type
		|| FieldTypes.logical === type;
}

//private: check if the field should be included in selection list.
function getAvailableFields(fileName) {
	var dbdict = new SCFile(DBDICT, SCFILE_READONLY);
	var fields = new Datum();
	fields.setType(8);
	var exclude = [
		"incident.id.vj",
		"incident.id.vj.alerts",
		"incident.id.vj.sla",
		"incident.id.vj.slo",
		"vj.incident.id.1",
		"vj.incident.id.2",
		"vj.incident.id.3",
		"vj.incident.id.4",
		"vj.incident.id.6",
		"vj.incident.id.7",
		"approval.status",
		"open",
		"requesttype"	
		
	];
	
	var includeArray = []; //currently, no exceptioinal fields to be included here.

	if(dbdict.doSelect("name=\"" + fileName + "\"")==RC_SUCCESS){
		var i;
		var length = dbdict.field.length();
		for (i=0;i<length;++i) {
			if((dbdict.field[i].type != FieldTypes.structure 
					&& dbdict.field[i].type !=  FieldTypes.array 
					&& dbdict.field[i].type != FieldTypes.expression 
					&& dbdict.field[i].level=="1" 
					&& exclude.indexOf(dbdict.field[i].name) == -1
				)
				||
				(
					dbdict.field[i].level=="1" 
					&& dbdict.field[i].type == FieldTypes.array
					&& includeArray.indexOf(dbdict.field[i].name) >=0
				)) {
				fields.push(dbdict.field[i].name);
			}
		}			
	}
	
	var captions = lib.convertToCaptions.getFieldCaptions(fields, fileName);
	var validationInfo = getValidationInfo(fileName, fields.toArray());
	var relatedGloballists = validationInfo[0];
	var relatedMatchTables = validationInfo[1];
	var relatedMatchFields = validationInfo[2];
	
	return [fields, captions, relatedGloballists, relatedMatchTables, relatedMatchFields];
}

//get field type of a field 
function getFieldTypeName(fileName, field) {
	var dbdict = new SCFile(DBDICT, SCFILE_READONLY);
	if(dbdict.doSelect("name=\"" + fileName + "\"")==RC_SUCCESS){
		var i;
		var length = dbdict.field.length();
		for (i=0;i<length;++i)
		{
			if (field == dbdict.field[i].name){
				var type;
				if(dbdict.field[i].type == FieldTypes.number) {
					type = FieldTypeNames.number;
				} else if (dbdict.field[i].type == FieldTypes.character 
					|| dbdict.field[i].name == "description"){
					type =  FieldTypeNames.character;
				} else if (dbdict.field[i].type == FieldTypes.datetime) {
					type =  FieldTypeNames.datetime;
				} else if (dbdict.field[i].type == FieldTypes.logical) {
					type =  FieldTypeNames.logical;
				}
				return (type);
			}
		}
	}
}

/**
* get the default caption from existing array
* @param fields is Datum
* @param fieldCaptions is Datum
*/
function getFieldDefaultCaption(fields, fieldCaptions, field) {
	if(fields == null || fieldCaptions == null) {
	    return "";
	}
	
	var fieldsArr = fields;
	var fieldCaptionsArr = fieldCaptions;
	
	if(fieldsArr.length != fieldCaptionsArr.length) {
	    return "";
	}
	var fieldsLength = fieldsArr.length;
	
	var i;
	for(i=0;i<fieldsLength;i++) {
		if(fieldsArr[i] === field) {
			return fieldCaptionsArr[i];
		}
	}
	return "";
}

//to insert a new message
function insertNewMessage(labelClass, label, lang) {
	var scmessage = new SCFile ("scmessage");
	var sql = "class=\"srcadvsearch\" and syslanguage=\""+lang+"\"";
	var labelId=0;
	if ( scmessage.doSelect(sql)==RC_SUCCESS){
		do{
			if(parseInt(scmessage.message_id) >labelId){
				labelId=parseInt(scmessage.message_id) ;
			}
		}while(scmessage.getNext() == RC_SUCCESS);
	}	
	scmessage["class"] = "srcadvsearch";
	scmessage.message = label;
	scmessage.message_id = String(labelId+1);
	scmessage.syslanguage = lang;
	try {	
		var result = scmessage.doInsert();
		if ( result == RC_SUCCESS) {
	   		return scmessage.message_id;
	   	}
	}
	catch(ex) {
   		log.error("Exception when insert message: " + ex);
	}
  	return null;
}


function getExistingLabel(labelId) {
	var label = funcs.scmsg(labelId, "srcadvsearch", []);
	return label;	
}

function insertField(aField) {
	var field = new SCFile(CONFIG_TABLE);
	field[DbFields.COMPANY] = aField.company;
	field[DbFields.FILE_NAME] = aField.fileName;
	field[DbFields.FIELD_NAME] = aField.fieldName;
	field[DbFields.FIELD_TYPE] = aField.fieldType;
	field[DbFields.FIELD_LABEL] = aField.fieldLabel;
	field[DbFields.FIELD_LABEL_TYPE] = aField.fieldLabelType;
	field[DbFields.ORDER] = aField.order;
	field[DbFields.ACTIVE] = aField.active;
	field[DbFields.GLOBALLIST] = aField.globallist;
	field[DbFields.VALIDATION_RULE] = aField.validationRule;
	field[DbFields.MATCH_TABLE] = aField.matchTable;
	field[DbFields.MATCH_FIELD] = aField.matchField;
	
	try {
		var rc = field.doSave();
		if(rc !== RC_SUCCESS) {
			log.error("Can not insert field: " + aField);
		}
	} catch(ex) {
		log.error("Exception when insert field: " + aField);
	}
}

function updateField(aField) {
	var field = new SCFile(CONFIG_TABLE);
	var query = DbFields.COMPANY + "=\"" + aField.company 
		+ "\" and "+ DbFields.FILE_NAME + "=\"" + aField.fileName 
		+ "\" and " + DbFields.FIELD_NAME +"=\"" + aField.fieldName + "\"";
	
	try {		
		var rc = field.doSelect(query);
		if(rc == RC_SUCCESS) {
			field[DbFields.FIELD_LABEL] = aField.fieldLabel;
			field[DbFields.FIELD_LABEL_TYPE] = aField.fieldLabelType;
			field[DbFields.ACTIVE] = aField.active;
			field[DbFields.GLOBALLIST] = aField.globallist;
			field[DbFields.VALIDATION_RULE] = aField.validationRule;
			field[DbFields.MATCH_TABLE] = aField.matchTable;
			field[DbFields.MATCH_FIELD] = aField.matchField;
			
			var rcIn = field.doUpdate();
			if(rcIn !== RC_SUCCESS) {
				log.error("Can not update field: " + rcIn);
			}		
		}
	} catch(ex) {
		log.error("Exception when update field: " + ex);
	}

}

function deleteField(companyName, fileName, fieldName) {
	var fields = new SCFile(CONFIG_TABLE);
	var query = DbFields.COMPANY + "=\"" + companyName 
		+ "\" and " + DbFields.FILE_NAME + "=\"" + fileName 
		+ "\" and " + DbFields.FIELD_NAME + "=\"" + fieldName + "\"";
	try {
		var rc = fields.doSelect(query);
		if(rc == RC_SUCCESS) {
			fields.doDelete();
		}
	}catch(ex) {
		log.error("Exception when delete a field" + ex);
	}
}

function bulkUpdateFieldOrders(allFields) {
	var fields = new SCFile(CONFIG_TABLE);
	try {
		var index;
		for(index=0;index<allFields.length;index++) {
		var query = DbFields.COMPANY + "=\"" + allFields[index]["company"] 
			+ "\" and "+ DbFields.FILE_NAME + "=\"" + allFields[index]["fileName"]
			+ "\" and " + DbFields.FIELD_NAME +"=\"" + allFields[index]["fieldName"] + "\"";
		
			var rc = fields.doSelect(query);
			
			fields[DbFields.ORDER] = allFields[index][DbFields.ORDER];
			fields.doUpdate();
		}
	} catch(ex) {
		log.error("Exception when bulk update fields" + ex);
	}
}

function getFileCaptions(files) {
	var captions = [];	
	try {
	    var i;
		for ( i = 0; i < files.length; i++ ) {	
    		captions.push(funcs.scmsg(files[i], "tablename"));
		}		
		return [files, captions];
	}
    catch( ex ) {
        log.error( "Exception when on get file captions: " + ex );
    }
	
	return ["",""];
}

function getDefaultFieldGloballist(fields, globallists, fieldId) {
	if(fields == null || globallists == null) {
	    return "";
	}	
	var targetIndex = _.indexOf(fields, fieldId);
	var result = "";
	if(targetIndex != -1) {
		result = globallists[targetIndex];
	}
	return (result === "--")?"":result;
}

function getDefaultMatchTable(fields, matchTables, fieldId) {
	if(fields == null || matchTables == null) {
	    return "";
	}	
	var targetIndex = _.indexOf(fields, fieldId);
	var result = "";
	if(targetIndex != -1) {
		result = matchTables[targetIndex];
	}
	return (result === "--")?"":result;
}

function getDefaultMatchField(fields, matchFields, fieldId) {
	if(fields == null || matchFields == null) {
	    return "";
	}	
	var targetIndex = _.indexOf(fields, fieldId);
	var result = "";
	if(targetIndex != -1) {
		result = matchFields[targetIndex];
	}
	return (result === "--")?"":result;
}


function getValidationInfo(fileName, fieldIds) {
	var datadict = new SCFile("datadict", SCFILE_READONLY);
	var rc = datadict.doSelect("name=\"" + fileName + "\"");
	var resultGloballist = new Array(fieldIds.length);	
	var resultMatchTables = new Array(fieldIds.length);
	var resultMatchFields = new Array(fieldIds.length);
	
	if(rc===RC_SUCCESS) {	
		var fields = datadict["fields"].toArray();
		var globallists = datadict["globallist"].toArray();
		var matchFields = datadict["matchfields"].toArray();
		var matchFiles = datadict["matchfiles"].toArray();

		var i;
		for(i=0;i<fields.length;i++) {
			var targetIndex = _.indexOf(fieldIds, fields[i]);
			if(targetIndex != -1) {
				resultGloballist[targetIndex] = globallists[i]; 
				resultMatchTables[targetIndex] = matchFiles[i];
				resultMatchFields[targetIndex] = matchFields[i];
			}
		}
	}
	
	var j;
	for(j=0;j<fieldIds.length;j++) {
		if(_.isNull(resultGloballist[j]) || resultGloballist[j] === "NULL" || _.isUndefined(resultGloballist[j])) {
		    resultGloballist[j] = "--";
		}
		if(_.isNull(resultMatchTables[j]) || resultMatchTables[j] === "NULL" || _.isUndefined(resultMatchTables[j])) {
		    resultMatchTables[j] = "--";
		}
		if(_.isNull(resultMatchFields[j]) || resultMatchFields[j] === "NULL" || _.isUndefined(resultMatchFields[j])) {
		    resultMatchFields[j] = "--";
		}
	}
	return [resultGloballist,resultMatchTables, resultMatchFields];
}

function existMatchTable(matchTable) {
	var datadict = new SCFile("datadict", SCFILE_READONLY);
	datadict.setFields(["name"]);
	var rc = datadict.doSelect("name=\"" + matchTable + "\"");
	if(rc==RC_SUCCESS) {
	    return true;
	}
	return false;
}

function existMatchField(matchTable, matchField) {
	var datadict = new SCFile("datadict", SCFILE_READONLY);
	datadict.setFields(["name", "fields"]);
	var rc = datadict.doSelect("name=\"" + matchTable + "\"");
	if(rc==RC_SUCCESS) {
		var fields = datadict["fields"].toArray();
		if(fields != null && _.indexOf(fields, matchField) != -1) {
		    return true;
		}
	}
	return false;
}

function existGloballist(globallist) {
	var globallists = new SCFile("globallists", SCFILE_READONLY);
	globallists.setFields(["name"]);
	var rc = globallists.doSelect("name=\"" + globallist + "\"");
	if(rc==RC_SUCCESS) {
	    return true;
	}
	return false;
}
