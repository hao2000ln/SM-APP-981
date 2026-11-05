//use sl Underscore
var _ = lib.Underscore.require();

/*
 Apply change model to a existing change
*/
function applyChangeModel(change, changeModel)
{
	
	cancelPlanTasks(change);
	copyCustomFields(change, changeModel);
	applyTemplate(change, changeModel);
	// change to fisrt phase
	change["current.phase"] = getFirstPhase(changeModel.category);
	
	// in case user do this action when create new change but not save it
	if (change.open != null) {
		vars.$bypass_failed_validation = true;
		change.doAction("save");
	}
}

/*
 get activity log when apply change model
 @param {file} filenew - updated record
 @param {file} fileold - record before updated
 @return {String}
*/
function getLog(filenew, fileold) {
	var update = "";
	// fields to check
	var fields = ["changeModel", "brief.description", "category", "initial.impact", "risk.assessment", "affected.item"];
	var k = 0;
	// get datadict
	var datadict = new SCFile("datadict");
	datadict.doSelect("name=\"cm3r\"");
		
	for (var i = 0; i < fields.length; i++) {
		var field = fields[i];
		
		if (filenew[field] != fileold[field]) {
			if (k > 0) update += ", ";
			var fieldName = system.functions.get_field_caption(field, "cm3r");
			
			var oldLabel = fileold[field]==null?"":getLabel(datadict, field, fileold[field]);
			var newLabel = filenew[field]==null?"":getLabel(datadict, field, filenew[field]);
			var label = system.functions.scmsg(910, "cm3", [fieldName, oldLabel, newLabel]);
			update += label;
			k++;
		}
	}
	return update;
}

/*
 build value label pair. if has global list, get the display value from global list; if it's array, build the string from the array.
*/
function getLabel(datadict, field, value) {
	var label = "";
	var globallist = getGlobalListByField(datadict, field);
	if (globallist != null && value != null) {
		label = getGlobalLabel(globallist, value);
	} else {
		label = convertToString(value);
	}
	return label;
}

/*
 get global list from datadict by field name
 @param datadict - datadict file
 @param field - field name
*/
function getGlobalListByField(datadict, field) {
	var fields = datadict.fields;
	var globallist = datadict.globallist;
	var lng = system.functions.lng( system.functions.denull(fields));
	if ( lng == null )
		lng = 0;
	
	for (var i = 0; i < lng; i++) {
		var fld = fields[i];
		if (fld == field)
			return globallist[i];
	}
	
	return null;
}

/*
 get display label by value from global list
*/
function getGlobalLabel(globallistName, value) {
	
	var globallist = new SCFile("globallists");
	var rc = globallist.doSelect("name=\"" + globallistName + "\"");
	
	if (rc == RC_SUCCESS) {
		var listvariable = globallist["list.variable"];
		var dispvariable = globallist["display.variable"];
		
		var values = lib.globalListTools.getGlobalListValue(listvariable);
		var labels = lib.globalListTools.getGlobalListValue(dispvariable);
		
		if (values != null && labels != null) {
			for (var i = 0; i < values.length(); i++) {
				if (values[i] == value)
					return labels[i];
			}
		} else 
			return value;
	} else {
		return value;
	}
	
}

/*
 convert the value to string, in case the value is array, or date
*/
function convertToString(value) {
	if (value == null) return "";
	
	var str = "";
	//var isArray = (typeof value.length == "function")?true: false;
	var isArray = _.isArray(value);
	
	if (isArray) {
		var lng = system.functions.lng( system.functions.denull(value));
		if ( lng == null )
			lng = 0;
			
		for (var i = 0; i < lng; i++) {
			var subvalue = value[i]; 
 			str += (subvalue==null?'':subvalue);
			if ((i < lng-1) && (subvalue!=null))
				str += ", ";
		}
	} else 
		str = system.functions.str(value);
	
	return str;
}

/*
 Cancel planned tasks. status = 0
*/
function cancelPlanTasks(change) {
	
	var planTask = new SCFile("cm3t");
	var f = planTask.doSelect("parent.change=\""+change.number+"\" and status=\"0\""); // waiting or planned
	var ret = planTask.getFirst();
	while(ret != RC_NO_MORE) {
		planTask.status="31";
		planTask["completion.code"] = 5;
		var comments = system.functions.scmsg(909, "cm3");
		planTask["closing.comments"].unshift(comments); // add the comment to the beginning
		var rc = planTask.doAction("save");
		if ( rc != RC_SUCCESS ) {
			print("Can't cancel task: " + planTask.number);
		}
		ret = planTask.getNext();
	}
}

/*
 add changeModel's tasks to change's change plan
*/
function addTasksToChangePlan(change, changeModel) {
	
	var planTasks = null;
	var changePlan = new SCFile("changePlan");
	var rc = changePlan.doSelect("number=\""+change.number+"\"");
	if (rc == RC_SUCCESS) {
		// clean changePlan tasks first
    	var planlng = system.functions.lng( system.functions.denull(changePlan.tasks));
    	changePlan.tasks = system.functions._delete(tasks, 1,  planlng);
	} else {
		changePlan.number = change.number;
		changePlan.doInsert();
	}
	
	var tasks = changeModel.tasks;
	
	var lng = system.functions.lng( system.functions.denull(tasks));
	if ( lng == null )
		lng = 0;
	
	for ( var i = 0; i < lng; i++ )
	{
		changePlan.tasks[i].taskId = tasks[i].taskId;
		changePlan.tasks[i].activeCond = tasks[i].activeCond;
		changePlan.tasks[i].closeByPhase = tasks[i].closeByPhase;
		changePlan.tasks[i].dependentCoords = tasks[i].dependentCoords;
		changePlan.tasks[i].dependentIds = tasks[i].dependentIds;
		changePlan.tasks[i].mandatory = tasks[i].mandatory;
		changePlan.tasks[i].openInPhase = tasks[i].openInPhase;
		changePlan.tasks[i].taskCategory = tasks[i].taskCategory;
		changePlan.tasks[i].taskCoords = tasks[i].taskCoords;
		changePlan.tasks[i].taskDescription = tasks[i].taskDescription;
		changePlan.tasks[i].taskStatus = "0";
		changePlan.tasks[i].taskTemplate = tasks[i].taskTemplate;
		changePlan.tasks[i].activeCondXML = tasks[i].activeCondXML;
		changePlan.tasks[i].activeCondDesc = tasks[i].activeCondDesc;
	}
	
	
	var ret = changePlan.doSave();
	
	if (ret != RC_SUCCESS)
		print("Failed to add tasks to change plan: " + change.number);
	
}

/*
 Apply changeModel's templates to change
*/
function applyTemplate(change, changeModel) {
	
	var templates = changeModel.changeTemplate;
	var lng = system.functions.lng( system.functions.denull(templates ) );
	if ( lng == null )
		lng = 0;
	
	for ( var i = 0; i < lng; i++ ) {
		var templateName = templates[i];
		
		var template = new SCFile("Template");
		var ret = template.doSelect("name=\""+templateName+"\"");
		if (ret == RC_SUCCESS) {
			lib.Template.applyTemplate(change, template, false);
		}
	}
}

// completed status
var completedStatus = ["30", "31"];

/*
 if status in completed status list
*/
function isCompletedStatus(status) {
	for (var i = 0; i < completedStatus.length; i++) {
		if (status == completedStatus[i])
			return true;
	}
	return false;
}

/*
 Has open tasks
*/
function hasOpenTasks(changeNumber) {
	var cm3t = new SCFile("cm3t");
	var query ="parent.change=\""+changeNumber+"\" and open=true";
	for (var i = 0; i < completedStatus.length; i++) {
		query += " and status~=\""+ completedStatus[i] +"\""
	}
	var ret = cm3t.doSelect(query);
	if (ret==RC_SUCCESS)
	{
		return true;
	}
	return false;
}

/**
	Function: Cancel the task if it is open
		
	@param {record} 	file				- the task record
	@param {String} 	closurecode		  	- the closure code
	@param {String} 	closurecomment		- the closure comment
**/
function CancelOpenedTask(file, closurecode, closurecomment)
{
	var status = file["status"];
	if (file.open == true & !isCompletedStatus(status)) {
		CancelTask(file, closurecode, closurecomment);
	}
	return 0;
}

/**
	Function: Cancel the task if is Planed status ("0")
		
	@param {record} 	file				- the task record
	@param {String} 	closurecode		  	- the closure code
	@param {String} 	closurecomment		- the closure comment
**/
function CancelPlannedTask(file, closurecode, closurecomment)
{
	var status = file["status"];
	if (status == "0") {
		CancelTask(file, closurecode, closurecomment);
	}
	return 0;
}

/**
	Function: Cancel a task
		
	@param {record} 	file				- the task record
	@param {String} 	closurecode		  	- the closure code
	@param {String} 	closurecomment		- the closure comment
**/
function CancelTask(file, closurecode, closurecomment)
{
	file["status"] = "30";
	file["completion.code"] = closurecode;
	file["closing.comments"].unshift(closurecomment); // add the comment to the beginning
	file.doAction("save");
}


/*
 Get first phase from category
*/
function getFirstPhase(category) {
	var firstPhase = null;
	var cat = new SCFile("cm3rcategory");
	var ret = cat.doSelect("name=\""+ category +"\"");
	if (ret == RC_SUCCESS) {
	
		var workflow = new SCFile("Workflow");
		ret = workflow.doSelect("name=\""+ cat.workflow +"\"");
		if (ret == RC_SUCCESS)
			firstPhase = workflow.firstPhase;
	}
	
	return firstPhase;
}

function getCategory(name)
{
	var file = new SCFile("cm3tcategory");
	file.doSelect("name=\""+ name +"\"");
	return file;
}

function getChangeCategory(name)
{
	var file = new SCFile("cm3rcategory");
	file.doSelect("name=\""+ name +"\"");
	print("get change category: " + file);
	return file;
}



function getPhase(name)
{
	var file = new SCFile("cm3tcatphase");
	file.doSelect("name=\""+ name +"\"");
	return file;
}

function getChangePhase(name)
{
	var file = new SCFile("cm3rcatphase");
	file.doSelect("name=\""+ name +"\"");
	print("get change phase: " + file);
	return file;
}

/*
copy custom fields from change model to change

@changeFile change file
@modelFile change model file
*/
function copyCustomFields(changeFile, modelFile)
{
	
	changeFile["changeModel"] = modelFile.id;
	changeFile["category"] = modelFile.category;
	var linkName="";
	var link = null;
	
	if (modelFile.link!=null) {
		linkName = modelFile.link;
		link = new SCFile("link");
		var rc = link.doSelect("name=\""+ linkName +"\"");
		if (rc != RC_SUCCESS)
			link = null;
	}
	
	if (link == null) {
		var settings = new SCFile("settings");
		var rc = settings.doSelect("name=\"Change\"");
		if (rc==RC_SUCCESS)
		{
			linkName = settings.link;
			link = new SCFile("link");
			var rc = link.doSelect("name=\""+ linkName +"\"");
			if (rc != RC_SUCCESS)
				link = null;
		}
	}
	if (link != null)
	{
		
		for (var i=0;i<system.functions.lng(link.source_fields);i++)
		{
			
			for (var j=0;j<system.functions.lng(system.functions.denull(link.project_source_fields[i]));j++)
			{
				var sourceField = link.project_source_fields[i][j];
				var targetField = link.project_target_fields[i][j];
				if (system.functions.nullsub(sourceField,"")!="" && system.functions.nullsub(targetField,"")!="" && modelFile[targetField] != null)
				{
					// if the data type is array, handle differently
					if (lib.smis_CommonLib._isArrayDataType(changeFile[sourceField])) {
						changeFile[sourceField][0] = modelFile[targetField];
						var len = system.functions.lng(system.functions.denull(changeFile[sourceField]));
						changeFile[sourceField] = system.functions._delete(changeFile[sourceField], 2, len-1);
					} else
						changeFile[sourceField]=modelFile[targetField];
				}
			}
			
		}
	}
}

/*
evaluate pre expression and script for a link line

@link link record
@index line index
*/
function evaluateLinkPreExpression(link, index) {
	var expressions = link["link.expressions"][index];
	var scripts = link["javascript.pre"][index];
	if (system.functions.lng(expressions)>0) evaluateExpressions(expressions);
	if (scripts) evaluateScripts(scripts);
}

/*
evaluate post expression and script for a link line

@link link record
@index line index
*/
function evaluateLinkPostExpression(link, index) {
	var expressions = link["post.expressions"][index];
	var scripts = link["javascript.post"][index];
	if (system.functions.lng(expressions)>0) evaluateExpressions(expressions);
	if (scripts) evaluateScripts(scripts);
}

/*
evaludate expression array

@expressions expression array
*/
function evaluateExpressions(expressions) {
	for (exp in expressions) {
		system.functions.evaluate(expressions[exp]);
	}
}

/*
evaludate script array

@expressions script array
*/
function evaluateScripts(scripts) {
	system.functions.js(scripts);
}

function println(Message)
{
	print(Message);
}