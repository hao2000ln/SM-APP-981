var underscore = system.library.Underscore;
var _ = underscore.require();
var configDao = lib.SRCAdvSearchConfigDao;
var configComm = lib.SRCAdvSearchConfigComm;
var FileNameCapMap = configComm.FileNameCaptionMapping();
var FieldLabelTypes = configComm.FieldLabelTypes();
var NEW_LABEL_CLASS = "srcadvsearch";
var DEFAULT_LANGUAGE = "en";
var DbFields = configComm.DbFields();
var ValidationRuleTypes = lib.SRCAdvSearchConfigComm.ValidationRuleTypes();
vars.$companySelected = null;

//================LIST FIELDS SECTION=========================//
function initCompanies() {
	if(system.functions.nullsub(vars.$G_multi, false) === true 
		|| system.functions.nullsub(vars.$G_multi, false) === "true") {
		if(!_.isEmpty(vars.$lo_colist)) {			
			vars.$companies = vars.$lo_colist;			
		}
	}
	
	if(vars.$companies == null || (vars.$companies).getSize() == 0) {
		vars.$companies = [(vars.$lo_operator)["company"]];	
	}

	if(vars.$companySelected == null) {
		vars.$companySelected = (vars.$lo_operator)["company"];
	}	
}

function initFileNames() {
	//TODO: incidents only for now.
	vars.$fileNameSelected = "incidents";
	vars.$cachedFields = configDao.getAvailableFields(vars.$fileNameSelected);
}

function initExistingFields() {
	initFields();	
}

function onCompanyChanged() {
	initFields(); 
}

function removeSelectedField() {
	var ts = new configComm.TableSelection("$searchableFieldNames");
	var index = ts.getSelectedIndex();
	
	if(index < 1) {
		return;
	}
	
	if(index > 0 && index < ts.getDataSize() + 1) {
		var fieldNameToBeRemoved = vars.$searchableFieldNames[index -1];
		configDao.deleteField(vars.$companySelected, vars.$fileNameSelected, fieldNameToBeRemoved);
		initFields(vars.$companySelected, vars.$fileNameSelected);
	}	
}

function moveUpSelectedField() {
	var positionLogs = switchFieldsPosition("up");
	if(positionLogs) {
		updateOrders(positionLogs);
	}
	
}


function moveDownSelectedField() {
	var positionLogs = switchFieldsPosition("down");
	if(positionLogs) {
		updateOrders(positionLogs);
	}
}

function updateOrders(positionLogs) {
	if(positionLogs != null) {
		var fromFieldId = positionLogs[0]["field"];
		var fromPosition = positionLogs[0]["position"];
		var toFieldId = positionLogs[1]["field"];
		var toPosition = positionLogs[1]["position"];
		
		var field1 = {
			company: vars.$companySelected,
			fileName: vars.$fileNameSelected,
			fieldName: fromFieldId,
			order: toPosition 
		};
		var field2 = {
			company: vars.$companySelected,
			fileName: vars.$fileNameSelected,
			fieldName: toFieldId,
			order: fromPosition 
		};		
		configDao.bulkUpdateFieldOrders([field1, field2]);
	}	
}

function persistAllChanges() {
/**	var allFields = new Array();
	var fieldNames = (vars.$searchableFieldNames).toArray();
	for(var index=0;index<fieldNames.length;index++) {
		var field = {};
		field.fieldName = fieldNames[index].toString();
		field.order = index;
		allFields.push(field);
	}
	
	configDao.bulkUpdateFieldOrders(allFields);*/
}

//================ADD FIELD SECTION=========================//
function prepareFieldsForAdd() {
	initVariablesForAdd();	
	
	var fieldIds = configComm.cloneArray((vars.$cachedFields[0]).toArray());
	var fieldCaptions = configComm.cloneArray((vars.$cachedFields[1]).toArray());
	var fields = [fieldIds, fieldCaptions];
	var existings = (vars.$searchableFieldNames).toArray();

	removeFieldsFromList(existings, fields);
	var sortedFields = sortFieldsByValue(fields[0], fields[1]);
	vars.$fields = sortedFields[0];	
	vars.$fieldCaptions = sortedFields[1];
}



//private
function initVariablesForAdd() {
	vars.$fields = null;
	vars.$field = null;
	vars.$fieldType = null;
	vars.$labelMode = "isdefault";
	vars.$labelValue = null;
	vars.$labelId = null;
	vars.$fieldLabelDefault = null;
	vars.$newLabelValue = null;
	vars.$hasGloballist = false;
	vars.$globallist = null;
	vars.$validationRule = "none";
	vars.$matchTable = null;
	vars.$matchField = null;
}

function onFieldChangedDuringAdd() {
	vars.$fieldType = configDao.getFieldTypeName(vars.$fileNameSelected, vars.$field);
	vars.$fieldLabelDefault = this.convertFieldNameCap(vars.$field);	
	var fields = (vars.$cachedFields)[0].toArray();
	var globallists = (vars.$cachedFields)[2].toArray();
	var globallist = configDao.getDefaultFieldGloballist(fields, globallists, vars.$field);
	
	vars.$validationRule = "none";
	vars.$matchTable = null;
	vars.$matchField = null;
	
	if(!_.isEmpty(globallist)){
		vars.$validationRule = "globallist";
		vars.$globallist = globallist;
	}
	else {	
		var matchTables = (vars.$cachedFields)[3].toArray();
		vars.$matchTable = configDao.getDefaultMatchTable(fields, matchTables, vars.$field);
		var matchFields = (vars.$cachedFields)[4].toArray();
		vars.$matchField = configDao.getDefaultMatchField(fields, matchFields, vars.$field);
		
		if(!_.isEmpty(vars.$matchTable) && !_.isEmpty(vars.$matchField)) {
			vars.$validationRule = "recordintable";
		}
	}
}

function finishAddingFields() {
	var aField = {
		company: vars.$companySelected,
		fileName: vars.$fileNameSelected,
		fieldName: vars.$field,
		fieldType: vars.$fieldType,
		fieldLabelType: vars.$labelMode,
		globallist:vars.$globallist,
		active: true, 
		validationRule: vars.$validationRule,
		matchTable: vars.$matchTable,
		matchField: vars.$matchField
	}
	
	aField.order = (vars.$searchableFieldNames).toArray().length;
	
	processLabel(aField);	
	clearFieldsValuesBasedOnValidationRule(aField);
	configDao.insertField(aField);
}

//================EDIT FIELDS SECTION=========================//
function prepareFieldsForEdit() {
	initVariablesForEdit();
	
	var ts = new configComm.TableSelection("$searchableFieldNames");
	var index = ts.getSelectedIndex();
	vars.$editEnabled = true;
	if(ts.getDataSize() < 1 && index < 0) {
		vars.$editEnabled = false;
		return;
	}
	
	var tmpFieldNames = (vars.$searchableFieldNames).toArray();
	var tmpFieldTypes = (vars.$searchableFieldTypes).toArray();
	var tmpFieldTypeCaps = (vars.$searchableFieldTypeCaps).toArray();
	var tmpFieldLables = (vars.$searchableFieldLabels).toArray();
	var tmpFieldLableCaps = (vars.$searchableFieldLabelCaps).toArray();
	var tmpFieldLabelTypes = (vars.$searchableFieldLabelTypes).toArray();
	var tmpFieldOrders = (vars.$searchableFieldOrders).toArray();
	
	vars.$field = tmpFieldNames[index - 1];
	var aField = tmpFieldNames[index - 1];
	
	var fieldCap = convertFieldNameCap(aField);	
	vars.$fieldCaptions = [fieldCap];
	vars.$fields = [aField];
	vars.$fieldType = tmpFieldTypes[index - 1];
	vars.$fieldDefaultValue = convertFieldNameCap(tmpFieldNames[index -1]);
	
	var mode = tmpFieldLabelTypes[index - 1];
	if(FieldLabelTypes.IS_TEXT == mode || FieldLabelTypes.IS_ID == mode) {
		vars.$labelMode = FieldLabelTypes.IS_ID;
		vars.$labelId = tmpFieldLables[index - 1];
		vars.$labelValue = convertFieldLabelCap(tmpFieldLables[index - 1]);
	}
	else {
		vars.$labelMode = FieldLabelTypes.IS_DEFAULT;	
	}
	vars.$fieldDefaultLabel = fieldCap;
	vars.$fieldOrder = tmpFieldOrders[index-1];
	
	//process validation rule
	var existingField = configDao.getExistingField(vars.$companySelected, vars.$fileNameSelected, aField);
	var rule = existingField[DbFields.VALIDATION_RULE];
	if(ValidationRuleTypes.GLOBALLIST == rule) {
		vars.$validationRule = ValidationRuleTypes.GLOBALLIST;
		vars.$globallist = existingField[DbFields.GLOBALLIST];
	}
	else if(ValidationRuleTypes.TABLE_RECORD == rule) {
		vars.$validationRule = ValidationRuleTypes.TABLE_RECORD;
		vars.$matchTable = existingField[DbFields.MATCH_TABLE];
		vars.$matchField = existingField[DbFields.MATCH_FIELD];			
	}
	else if(ValidationRuleTypes.NONE == rule) {
		vars.$validationRule = ValidationRuleTypes.NONE;
	}
	else {
		vars.$validationRule = ValidationRuleTypes.NONE;
	}
}

function initVariablesForEdit() {
	vars.$fields = null;
	vars.$field = null;
	vars.$fieldType = null;
	vars.$labelMode = "isdefault";
	vars.$labelValue = null;
	vars.$labelId = "";
	vars.$fieldLabelDefault = "";
    vars.$newLabelValue = "";
   	vars.$hasGloballist = false;
	vars.$globallist = null;
	vars.$validationRule = "none";
	vars.$matchTable = null;
	vars.$matchField = null;
}

function finishEditingFields() {
	var labelMode = vars.$labelMode;
	var aField = {
		company: vars.$companySelected,
		fileName: vars.$fileNameSelected,
		fieldName: vars.$field,
		fieldType: vars.$fieldType,
		active: true,
		fieldLabelType:labelMode,
		order: vars.$fieldOrder,
		globallist:vars.$globallist,
		validationRule:vars.$validationRule,
		matchTable:vars.$matchTable,
		matchField:vars.$matchField
	}
	
	processLabel(aField);	
	clearFieldsValuesBasedOnValidationRule(aField);
	configDao.updateField(aField);
}

//===================COMMON PART=============================//
function clearFieldsValuesBasedOnValidationRule(aField) {
	if(ValidationRuleTypes.GLOBALLIST == aField.validationRule) {
		aField.matchTable = null;
		aField.matchField = null;
	}
	else if(ValidationRuleTypes.TABLE_RECORD == aField.validationRule) {
		aField.globallist = null;
	}
	else {
		aField.matchTable = null;
		aField.matchField = null;
		aField.globallist = null;
	}
}

function sortFieldsByValue(keys, values) {
	if(keys == null || values == null) return [keys, values];
		
	var size = keys.length;		
	var objArray = new Array(size);;
	for(i=0;i<size;i++) {
		objArray[i] = {key:keys[i], value: values[i]};
	}
	
	var sortedObjArray = _.sortBy(objArray, "value");
	var resultKeys = new Array(size);
	var resultValues = new Array(size);
	for(i=0;i<size;i++) {
		resultKeys[i] = sortedObjArray[i].key;
		resultValues[i] = sortedObjArray[i].value;
	}
	
	return [resultKeys, resultValues];
}

function existMatchTable(matchTable) {
	if(_.isEmpty(matchTable)) return false;
	
	return configDao.existMatchTable(matchTable);
}

function existMatchField(matchTable, matchField) {
	if(_.isEmpty(matchField)) return false;
	return configDao.existMatchField(matchTable, matchField);
}

function existGloballist(globallist) {
	if(_.isEmpty(globallist)) return false;
	return configDao.existGloballist(globallist);
}

function convertFieldNameCap(fieldName) {
	var fields = vars.$cachedFields;
	var result = configDao.getFieldDefaultCaption(fields[0].toArray(), fields[1].toArray(), fieldName);
	return (_.isEmpty(result))? fieldName:result;
}

function convertFieldLabelCap(fieldLabel) {
	var result = configDao.getExistingLabel(fieldLabel);
	return (_.isEmpty(result))? fieldLabel:result;
}

function convertFieldTypeCap(fieldType) {
	//TODO: localization???
	return fieldType;
}

function existField(fieldName) {
	var field = configDao.getExistingField(vars.$companySelected, vars.$fileNameSelected, fieldName);
	return (field == null)?false:true;
}

//private
function removeFieldsFromList(fieldsToBeRemoved, targetFields) {
	var fields = targetFields[0];
	var captions = targetFields[1];
	
	for(var index=0;index<fieldsToBeRemoved.length;index++) {
		var pos = _.indexOf(fields, fieldsToBeRemoved[index]);
		if(pos > -1) {
			(fields).splice(pos, 1);
			(captions).splice(pos, 1);
		}
	}
	
	targetFields[0] = fields;
	targetFields[1] = captions;
}

//private
function processLabel(aField) {
	if(FieldLabelTypes.IS_ID == aField.fieldLabelType) {
		aField.fieldLabel = vars.$labelId;
	}
	else if(FieldLabelTypes.IS_DEFAULT == aField.fieldLabelType) {
		aField.fieldLabel = "DEFAULT";
	}
	else if(FieldLabelTypes.IS_TEXT == aField.fieldLabelType) {
		var msgId = configDao.insertNewMessage(NEW_LABEL_CLASS, vars.$newLabelValue, getLoginLanguage());
		aField.fieldLabel = msgId;
		aField.fieldLabelType = FieldLabelTypes.IS_ID;//set type to IS_ID.
	}
}


//private
function initFields() {
	var result = configDao.getExistingFields(vars.$companySelected,vars.$fileNameSelected);
	var fieldNames=[];
	var fieldLabels=[];
	var fieldLabelCaps=[];
	var fieldLabelTypes=[];
	var fieldTypes=[];
	var fieldTypeCaps=[];
	var fieldOrders=[];
	var globallists = [];

	for(var i=0;i<result.length;i++) {
		fieldNames.push(result[i]["field.name"]);
		fieldLabels.push(result[i]["field.label"]);
		fieldTypes.push(result[i]["field.type"]);
		fieldTypeCaps.push(convertFieldTypeCap(result[i]["field.type"]));
		fieldOrders.push(result[i]["order"]);
		fieldLabelTypes.push(result[i]["field.label.type"]);
		
				
		var mode = result[i]["field.label.type"];
		if(FieldLabelTypes.IS_TEXT == mode || FieldLabelTypes.IS_ID == mode) {
			vars.$labelMode = FieldLabelTypes.IS_ID;
			vars.$labelId = result[i]["field.label"]
			var fieldLabel = convertFieldLabelCap(result[i]["field.label"]);
			fieldLabelCaps.push(fieldLabel);
		}
		else {
			vars.$labelMode = FieldLabelTypes.IS_DEFAULT;
			var fieldNameCap = convertFieldNameCap(result[i]["field.name"]);
			fieldLabelCaps.push(fieldNameCap);	
		}
	}
	
	vars.$searchableFieldNames = fieldNames;
	vars.$searchableFieldLabels = fieldLabels;
	vars.$searchableFieldLabelCaps = fieldLabelCaps;
	vars.$searchableFieldTypes = fieldTypes;
	vars.$searchableFieldTypeCaps = fieldTypeCaps;
	vars.$searchableFieldOrders = fieldOrders;
	vars.$searchableFieldLabelTypes = fieldLabelTypes;
	
	
	//set default selection to first one.
	var ts = new configComm.TableSelection("$searchableFieldNames");
	ts.fixSelectedIndex();
}

//private
function switchFieldsPosition(direction) {
	var ts = new configComm.TableSelection("$searchableFieldNames");
	var index = ts.getSelectedIndex();
	var dataSize = ts.getDataSize();
		
	if((index <= 1 && direction =="up") 
		|| (index >= dataSize && direction == "down")) {
		ts.setSelectedIndex(index);
		return;
	}
	
	var fromIndex = -1;
	if(direction == "up") {
		var fromIndex = index - 1;
		var targetIndex = index - 2;
	}
	else if(direction == "down") {
		var fromIndex = index - 1;
		var targetIndex = index;
	}	
	
	if(index >= 1 && index <  dataSize + 1 && dataSize > 1 ) {
		
		 var tmpFieldNames = (vars.$searchableFieldNames).toArray();
		 var tmpFieldTypes = (vars.$searchableFieldTypes).toArray();
		 var tmpFieldTypeCaps = (vars.$searchableFieldTypeCaps).toArray();
		 var tmpFieldLables = (vars.$searchableFieldLabels).toArray();
 		 var tmpFieldLableCaps = (vars.$searchableFieldLabelCaps).toArray();
		 var tmpFieldLabelTypes = (vars.$searchableFieldLabelTypes).toArray();
		 
		 var posFromLog = {
		 	field: tmpFieldNames[fromIndex],
		 	position: fromIndex
		 };
		 
		 var posToLog = {
		 	field: tmpFieldNames[targetIndex],
		 	position: targetIndex
		 };
		 
		 var tmpFieldNameToBeMove = tmpFieldNames.splice(fromIndex, 1);
		 var tmpFieldTypeToBeMove = tmpFieldTypes.splice(fromIndex, 1);
		 var tmpFieldTypeCapToBeMove = tmpFieldTypeCaps.splice(fromIndex, 1);		 
		 var tmpFieldLabelToBeMove = tmpFieldLables.splice(fromIndex, 1);
		 var tmpFieldLabelCapToBeMove = tmpFieldLableCaps.splice(fromIndex, 1);		 
		 var tmpFieldLabelTypeToBeMove = tmpFieldLabelTypes.splice(fromIndex, 1);
		 
		 tmpFieldNames.splice(targetIndex, 0, tmpFieldNameToBeMove.toString());
		 tmpFieldTypes.splice(targetIndex, 0, tmpFieldTypeToBeMove.toString());
		 tmpFieldTypeCaps.splice(targetIndex, 0, tmpFieldTypeCapToBeMove.toString());		 
		 tmpFieldLables.splice(targetIndex, 0, tmpFieldLabelToBeMove.toString());
		 tmpFieldLableCaps.splice(targetIndex, 0, tmpFieldLabelCapToBeMove.toString());
		 tmpFieldLabelTypes.splice(targetIndex, 0, tmpFieldLabelTypeToBeMove.toString());
		 
		 
		 vars.$searchableFieldNames = tmpFieldNames;
		 vars.$searchableFieldTypes = tmpFieldTypes;
		 vars.$searchableFieldTypeCaps = tmpFieldTypes;		 
		 vars.$searchableFieldLabels = tmpFieldLables;
		 vars.$searchableFieldLabelCaps = tmpFieldLableCaps;		 
		 vars.$searchableFieldLabelTypes = tmpFieldLabelTypes;	
		 ts.setSelectedIndex(targetIndex + 1);
		 
		 return [posFromLog, posToLog];
	}
}

//private
function getLoginLanguage() {
	var userLang = vars.$G_my_language;
	if(!_.isEmpty(userLang)) return userLang;
	return DEFAULT_LANGUAGE;
}