
//* Fileds will add to table probsummary
var newIncidentCustomFields = ["custom.text.01", "custom.text.02", "custom.text.03", "custom.text.04", "custom.text.05",
	"custom.text.06", "custom.text.07", "custom.text.08", "custom.text.09", "custom.text.10"];

//* Fileds will add to IncidentManagement etxacess fields
var newIncidentCustomFieldsCaptions = ["CustomText01", "CustomText02", "CustomText03", "CustomText04", "CustomText05",
	"CustomText06", "CustomText07", "CustomText08", "CustomText09", "CustomText10"];

//* CustomerFields type:
//* 1: number, 2:chart, 3:date, 4:logical
var newIncidentCustomFieldsTypes = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

//CustomerFields in database
var newIncidentCustomFieldsSqlTypes =
	["VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)",
	"VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)"];

//* workflow in customerPDWorkFlowList will be tailored according to SM and SAP integration request
var customPDWorkFlowList = ["Incident for SAP"];

function getNewIncidentCustomFields() {

	return newIncidentCustomFields;
}

function getNewIncidentCustomFieldsCaptions() {

	return newIncidentCustomFieldsCaptions;
}

function getNewIncidentCustomFieldsTypes() {

	return newIncidentCustomFieldsTypes;
}

function getNewIncidentCustomFieldsSqlTypes() {
	return newIncidentCustomFieldsSqlTypes;
}

function getCustomPDWorkFlowList() {
	return customPDWorkFlowList
}
