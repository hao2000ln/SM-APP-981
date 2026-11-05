var $ = lib.c.$;

/**
 * Function: Check whether a change model is valid based on the id, name ,category and subcategory.
 * @param changeModel {String} change model id
 * @param changeModelName {String} change model name
 * @param category {String} 
 * @param subcategory {String} 
 * @return {boolean}
 */
function isChangeModelValid(changeModel, changeModelName, category, subcategory)
{
	if(changeModel != null && changeModel != "" && changeModelName != null && changeModelName != "")
	{
		var file = new SCFile("changeModel", SCFILE_READONLY);
		file.setFields(["id"]);
		var query = "id=\"" + changeModel + "\"";
		query += getCondition("name", changeModelName);
		query += getCondition("category", category);
		query += getCondition("subcategory", subcategory);
		if(RC_SUCCESS==file.doSelect(query))
		{
			return true;
		}
	}
	return false;
}

/**
 * Function: return a additional query condition
 * @param fieldName {String} change model id
 * @param fieldValue {String} change model name
 * @return {String}
 * @private 
 */
function getCondition(fieldName, fieldValue)
{
	if(fieldValue != null && fieldValue != "")
	{
		return " and " + fieldName + "=\"" + fieldValue + "\"";
	}
	return "";
}


/**
 * Check model for clone
 *
 * @returns	{Boolean}	true if match for clone
 */
function checkModelForClone(fileName, oldModelId, newModelId) {

	if (oldModelId == newModelId || newModelId == null) {
		return true;
	}
	
	// check new model's change plan
	var planQuery = 'fileName="' + fileName + '" and number="' + newModelId + '"';
	var plan = $("changePlan", SCFILE_READONLY).setFields(["fileName"]).select(planQuery).uniqueResult();
	if (plan == null) {
		return true;
	}
	
	// compare workflow if new model has change plan
	var oldWorkflow = getWorkflowFromModel(fileName, oldModelId);
	var newWorkflow = getWorkflowFromModel(fileName, newModelId);
	
	if (oldWorkflow == newWorkflow || newWorkflow == null) {
		return true;
	}
	  
	return false;
}


/**
 * get workflow from change/request model
 *
 * @returns  {String}	workflow name
 */
function getWorkflowFromModel(fileName, modelId) {

	if (modelId == null) {
		return null;
	}
	
	var model = $(fileName, SCFILE_READONLY).setFields(["category"]).select('id="' + modelId + '"').uniqueResult();
	if (model == null) {
		return null;
	}

	var category = model.category;
	if (category == null) {
		return null;
	}
	
	var categoryFile;
	if (fileName == "changeModel") {
		categoryFile = "cm3rcategory";
	}
	else if (fileName == "requestModel") {
		categoryFile = "rmCategory";
	}
	else {
		return null;
	}
	
	var fCategory = $(categoryFile, SCFILE_READONLY).setFields(["workflow"]).select('name="' + category + '"').uniqueResult();
	if (fCategory) {
		return fCategory.workflow;
	}
	
	return null;
}


/**
 * Create new Model record
 *
 * @param	{SCFile}	newModel, model file to create
 * @param	{String}	modelIdforPlan, model id of taskplan to copy from
 */
function createModel(newModel, modelIdforPlan) {

	var rc = newModel.doAction("add");
	if (rc == false) {
		return;
	}
	
	var fileName = funcs.filename(newModel);

	// copy plan
	var planQuery = 'fileName="' + fileName + '" and number="' + modelIdforPlan + '"';
	var plan = $("changePlan").select(planQuery).uniqueResult();
	if (plan) {
		plan.number = newModel.id;
		plan.doInsert();
	}
	
	// copy config
	var configQuery = 'fileName="' + fileName + '" and fileId="' + modelIdforPlan + '"';
	$("ticketContextConfig").select(configQuery).iterate(function(config) {
		config.fileId = newModel.id;
		config.doInsert();
	});
}