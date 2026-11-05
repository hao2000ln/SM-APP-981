var underscore = system.library.Underscore;
var _ = underscore.require();
var configDao = lib.SRCSurveyConfigDao;
var configComm = lib.SRCSurveyConfigComm;
var FileNameCapMap = configComm.FileNameCaptionMapping();
var FieldLabelTypes = configComm.FieldLabelTypes();
var NEW_LABEL_CLASS = "srcsurvey";
var DEFAULT_LANGUAGE = "en";
var DbFields = configComm.DbFields();

/* 
* check if a field has already exited in the database before user wants to add it.
* @param fieldName the field to be added
* @return the check result
*/
function existField(fieldName) {
	var field = configDao.getExistingField(vars.$fileNameSelected, fieldName);
	return (field == null)?false:true;
}


/* 
* remove the selected field.
*/
function removeSelectedField() {
	var ts = new configComm.TableSelection("$surveyFieldNames");
	var index = ts.getSelectedIndex();
	
	if(index < 1) {
		return;
	}
	
	if(index > 0 && index < ts.getDataSize() + 1) {
		var fieldNameToBeRemoved = vars.$surveyFieldNames[index -1];
		configDao.deleteField(fieldNameToBeRemoved);
		initFields(vars.$fileNameSelected);
	}	
}


/* 
* get the list of fields that available for user to select
*/
function initFileNames() {
	
	vars.$fileNameSelected = "SurveyInternal";
	vars.$cachedFields = configDao.getAvailableFields(vars.$fileNameSelected);
}

/* 
* init field variables.
*/
function initExistingFields() {
	initFields();	
}

/* 
* prepare the field variables for edit operation
*/
function prepareFieldsForEdit() {
	initVariables();
	
	var ts = new configComm.TableSelection("$surveyFieldNames");
	var index = ts.getSelectedIndex();
	vars.$editEnabled = true;
	if(ts.getDataSize() < 1 && index < 0) {
		vars.$editEnabled = false;
		return;
	}
	
	//init the variables for display
	var tmpFieldNames = (vars.$surveyFieldNames).toArray();
 	var tmpFieldTypes = (vars.$surveyFieldTypes).toArray();
	var tmpFieldTypeCaps = (vars.$surveyFieldTypes).toArray();
	var tmpFieldLables = (vars.$surveyQuestionLabels).toArray();
    var tmpFieldIds = (vars.$surveyQuestionIds).toArray();
	var tmpAnswerTypes = (vars.$surveyAnswerTypes).toArray();
	var tmpFieldOrders = (vars.$surveyFieldOrders).toArray();
	var tmpGloballists = (vars.$surveyGlobalLists).toArray();
	var tmpSurveyAllowCustomAnswers = (vars.$surveyAllowCustomAnswers).toArray();
	var tmpSurveyMandatories = (vars.$surveyMandatories).toArray();
	
	
	//the value of the selected field
	vars.$field = tmpFieldNames[index - 1];
	var aField = tmpFieldNames[index - 1];
	var fieldCap = convertFieldNameCap(aField);
	
	//the selected value of the record to edit	
	vars.$fieldCaptions = [fieldCap];
	vars.$fields = [aField]
	
	vars.$fieldType = tmpFieldTypes[index - 1];
	vars.$fieldDefaultValue = convertFieldNameCap(tmpFieldNames[index -1]);

	//process the field label and field ID:	  
	vars.$labelId = tmpFieldIds[index - 1];
	vars.$labelValue = tmpFieldLables[index - 1];
   	vars.$fieldOrder = tmpFieldOrders[index-1];
	vars.$globallist = tmpGloballists[index-1];

	vars.$answerType = tmpAnswerTypes[index-1];
	vars.$allowCustomAnswer = tmpSurveyAllowCustomAnswers[index-1];
	vars.$mandatory = tmpSurveyMandatories[index-1];
	
	if(vars.$globallist != null && vars.$globallist != "") {
		vars.$hasGloballist = true;
	}
	else {
		vars.$hasGloballist = false;
	}
	
	if(vars.$globallist == "")
	{
		vars.$globallist = null;
	}
	
}

/* 
* reset the field variables before displaying the add page.
*/
function initVariables() {
	
	vars.$fields = null;
	vars.$field = null;
	vars.$fieldType = "";
	vars.$labelValue = null;
    	vars.$newLabelValue = null;
	vars.$labelId = null;
	vars.$fieldLabelDefault = null;
    	vars.$hasGloballist = false;
	vars.$globallist = null;
    	vars.$mandatory = false;
    	vars.$allowCustomAnswer = false;
    	vars.$answerType = null;
    	vars.$questionLabel = null;
    	vars.$questionLabel = "isid";

}


/* 
* convert the form data into a data structure
* @return the data structure containing all the user input datas through the form.
*/
function getInputValues()
{
var aField = {
		fileName: vars.$fileNameSelected,
		fieldName: vars.$field,
		fieldType: vars.$fieldType,
		questionLabelType: vars.$questionLabel,
		globallist:vars.$globallist,
		mandatory:vars.$mandatory,
		answerType:vars.$answerType,
		allowCustomAnswer:vars.$allowCustomAnswer,
		order:vars.$fieldOrder
		}
		
return aField;
		
}

/* 
* update the database
*/
function finishEditingFields() {

	var aField = getInputValues();
	
	processLabel(aField);	
	configDao.updateField(aField);
}

/* 
* get the label of the field if there exsits one.
*/
function convertFieldLabelCap(fieldId) {
	var result = configDao.getExistingLabel(fieldId);
	return (_.isEmpty(result))? fieldId:result;
}

/* 
* handle the event that user selectes a field in the add form.
*/
function onFieldChangedDuringAdd() {
	vars.$fieldType = configDao.getFieldTypeName(vars.$fileNameSelected, vars.$field);
	vars.$fieldLabelDefault = this.convertFieldNameCap(vars.$field);	
	var fields = (vars.$cachedFields)[0].toArray();
	var globallists = (vars.$cachedFields)[2].toArray();
	var globallist = configDao.getDefaultFieldGloballist(fields, globallists, vars.$field);	
	if(globallist == null || globallist == "") {
		vars.$hasGloballist = false;
		vars.$globallist = null;
	}
	else {
		vars.$hasGloballist = true;
		vars.$globallist = globallist;
	}

}


//===================COMMON PART=============================//

/* 
* Get the caption of the field.
*/
function convertFieldNameCap(fieldName) {
	var fields = vars.$cachedFields;
	var result = configDao.getFieldDefaultCaption(fields[0].toArray(), fields[1].toArray(), fieldName);
	return (_.isEmpty(result))? fieldName:result;
}



/* 
* Check if a field has already been added in the config table.
*/
function existField(fieldName) {
	var field = configDao.getExistingField(vars.$fileNameSelected, fieldName);
	return (field == null)?false:true;
}


/* 
* Add the data into database.
*/
function finishAddingFields() {

	var aField = getInputValues();
	aField.order = (vars.$surveyFieldNames).toArray().length;
	processLabel(aField);	
	configDao.insertField(aField);
}


/* 
* Prepare the field variables before displaying in the add form.
*/
function prepareFieldsForAdd() {

	initVariables();	
	
	var fieldIds = configComm.cloneArray((vars.$cachedFields[0]).toArray());
	var fieldCaptions = configComm.cloneArray((vars.$cachedFields[1]).toArray());
	var fields = [fieldIds, fieldCaptions];

	var existings = (vars.$surveyFieldNames).toArray();
	removeFieldsFromList(existings, fields);
	vars.$fields = fields[0];	
	vars.$fieldCaptions = fields[1];
}


/* 
* process the label field. if user add a new lable, then first save it then get the message id.
* @param aField the data containing the label value.
*/
function processLabel(aField) {

	if(FieldLabelTypes.IS_ID == aField.questionLabelType) {
		aField.fieldLabel = vars.$labelId;
	}
	else if(FieldLabelTypes.IS_TEXT == aField.questionLabelType) {
		var msgId = configDao.insertNewMessage(NEW_LABEL_CLASS, vars.$newLabelValue, getLoginLanguage());
		aField.fieldLabel = msgId;
		aField.fieldLabelType = FieldLabelTypes.IS_ID;//set type to IS_ID.
	}
	
	
}

/* 
* get the user login language
*/
function getLoginLanguage() {
	var userLang = vars.$G_my_language;
	if(!_.isEmpty(userLang)) return userLang;
	return DEFAULT_LANGUAGE;
}


/* 
* before presenting the list of fields to user for adding, first remove the already added ones.
* @param fieldToBeRemoved the fields to be removed.
* @param targetFields the field list that the field will be removed from
*/
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


/* 
* init the fields
*/
function initFields() {
	
	//get the existing data from the config table.
	var result = configDao.getExistingFields(vars.$fileNameSelected);
    	vars.$surveyFieldNames= [];
	vars.$surveyFieldTypes = [];
	vars.$surveyQuestionLabels= [];
	vars.$surveyAnswerTypes= [];
	vars.$surveyGlobalLists= [];
	vars.$surveyAllowCustomAnswers= [];
	vars.$surveyMandatories= [];
	vars.$surveyFieldOrders = [];
        vars.$surveyQuestionIds = [];
	for(var i=0;i<result.length;i++) {
	
        (vars.$surveyFieldNames).push(result[i][DbFields.DEST_FIELD_NAME]);
	(vars.$surveyQuestionLabels).push(convertFieldLabelCap(result[i][DbFields.QUESTION_LABEL]));
	(vars.$surveyFieldTypes).push(result[i][DbFields.DEST_FIELD_TYPE]);
	(vars.$surveyQuestionIds).push(result[i][DbFields.QUESTION_LABEL]);
	(vars.$surveyAnswerTypes).push(result[i][DbFields.ANSWER_TYPE]);
	(vars.$surveyGlobalLists).push(result[i][DbFields.GLOBALLIST]);
        (vars.$surveyAllowCustomAnswers).push(result[i][DbFields.CUSTOM_ANSWER_ALLOWED]);
        (vars.$surveyMandatories).push(result[i][DbFields.MANDATORY_CONDITION]);
        (vars.$surveyFieldOrders).push(result[i][DbFields.ORDER]);
        }
	
        //set default selection to first one.
	var ts = new configComm.TableSelection("$surveyFieldNames");
	ts.fixSelectedIndex();	     	
}


/////////////////////functions handling the order action///////////////////////////////////

/* 
* refresh the field variables with the updated order.
* @param direction the direction of the change order action
* @return 2 field lists before and after the order change.
*/
function switchFieldsPosition(direction) {
	var ts = new configComm.TableSelection("$surveyFieldNames");
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

	var tmpFieldNames = (vars.$surveyFieldNames).toArray();
 	var tmpFieldTypes = (vars.$surveyFieldTypes).toArray();
	var tmpFieldTypeCaps = (vars.$surveyFieldTypes).toArray();
	var tmpFieldLables = (vars.$surveyQuestionLabels).toArray();
        var tmpFieldIds = (vars.$surveyQuestionIds).toArray();

	var tmpAnswerTypes = (vars.$surveyAnswerTypes).toArray();
	var tmpFieldOrders = (vars.$surveyFieldOrders).toArray();
	var tmpGloballists = (vars.$surveyGlobalLists).toArray();
	var tmpSurveyAllowCustomAnswers = (vars.$surveyAllowCustomAnswers).toArray();
	var tmpSurveyMandatories = (vars.$surveyMandatories).toArray();
		 
		 var posFromLog = {
		 	field: tmpFieldNames[fromIndex],
		 	position: fromIndex
		 };
		 
		 var posToLog = {
		 	field: tmpFieldNames[targetIndex],
		 	position: targetIndex
		 };
		 

	var tmpFieldNamesToBeMove = tmpFieldNames.splice(fromIndex, 1);
	var tmpFieldTypesToBeMove = tmpFieldTypes.splice(fromIndex, 1);
	var tmpFieldTypeCapsToBeMove = tmpFieldTypeCaps.splice(fromIndex, 1);
	var tmpFieldLablesToBeMove = tmpFieldLables.splice(fromIndex, 1);
	var tmpGloballistsToBeMove = tmpGloballists.splice(fromIndex, 1);
	var tmpFieldIdsToBeMove = tmpFieldIds.splice(fromIndex, 1);
	var tmpAnswerTypesToBeMove = tmpAnswerTypes.splice(fromIndex, 1);
	var tmpFieldOrdersToBeMove = tmpFieldOrders.splice(fromIndex, 1);
	var tmpSurveyAllowCustomAnswersToBeMove = tmpSurveyAllowCustomAnswers.splice(fromIndex, 1);
	var tmpSurveyMandatoriesToBeMove = tmpSurveyMandatories.splice(fromIndex, 1);

		 
	tmpFieldNames.splice(targetIndex, 0, tmpFieldNamesToBeMove.toString());
	tmpFieldTypes.splice(targetIndex, 0, tmpFieldTypesToBeMove.toString());
	tmpFieldTypeCaps.splice(targetIndex, 0, tmpFieldTypeCapsToBeMove.toString());
	tmpFieldLables.splice(targetIndex, 0, tmpFieldLablesToBeMove.toString());
                 
	tmpGloballists.splice(targetIndex, 0, tmpGloballistsToBeMove.toString());
	tmpFieldIds.splice(targetIndex, 0, tmpFieldIdsToBeMove.toString());


	tmpAnswerTypes.splice(targetIndex, 0, tmpAnswerTypesToBeMove.toString());
	tmpFieldOrders.splice(targetIndex, 0, tmpFieldOrdersToBeMove.toString());
	tmpSurveyAllowCustomAnswers.splice(targetIndex, 0, tmpSurveyAllowCustomAnswersToBeMove.toString());
	tmpSurveyMandatories.splice(targetIndex, 0, tmpSurveyMandatoriesToBeMove.toString());

	vars.$surveyFieldNames= tmpFieldNames;
	vars.$surveyFieldTypes = tmpFieldTypes;
	vars.$surveyQuestionLabels= tmpFieldLables;
	vars.$surveyAnswerTypes= tmpAnswerTypes;
	vars.$surveyGlobalLists= tmpGloballists;
	vars.$surveyAllowCustomAnswers= tmpSurveyAllowCustomAnswers;
	vars.$surveyMandatories= tmpSurveyMandatories;
	vars.$surveyFieldOrders = tmpFieldOrders;
	
	ts.setSelectedIndex(targetIndex + 1);
	return [posFromLog, posToLog];
}
}


/* 
* move up the selected field
*/

function moveUpSelectedField() {
	var positionLogs = switchFieldsPosition("up");
	if(positionLogs) {
		updateOrders(positionLogs);
	}
}

/* 
* move down the selected field
*/
function moveDownSelectedField() {
	var positionLogs = switchFieldsPosition("down");
	if(positionLogs) {
		updateOrders(positionLogs);
	}
}

/* 
* update the field order in the database
*/
function updateOrders(positionLogs) {
	if(positionLogs != null) {
		var fromFieldId = positionLogs[0]["field"];
		var fromPosition = positionLogs[0]["position"];
		var toFieldId = positionLogs[1]["field"];
		var toPosition = positionLogs[1]["position"];
		
		var field1 = {
			fileName: vars.$fileNameSelected,
			fieldName: fromFieldId,
			order: toPosition 
		};
		var field2 = {
			fileName: vars.$fileNameSelected,
			fieldName: toFieldId,
			order: fromPosition 
		};		
		configDao.bulkUpdateFieldOrders([field1, field2]);
	}	
}

