/**
* @fileoverview  Handles functionality associated with Change plans.
* @author Pete Budic
*/

//task initil status
var WAITING = "0";
var READY = "1";
var WITHDRAWN = "31";

//task wating
var WAITING_NOT_WAITING =  0;
var WAITING_NO_PENDING = 1;
var WAITING_PENDING = 2;
var WAITING_PENDING_DONE = 3;
/**
*  This function creates the change plan (changePlan) record from the Change and an optional Change Model
*
*  If a Model is specified, the tasks from that model are copied into the Change Plan.
*
*  @param {cm3r} change - The Change (cm3r) record
*  @param {changeModel} model - The Change Model (changeModel) record associated with this change.
*/
function createPlan( change, modelName )
{
	// If no change is passed in then simply exit
	if ( change == null || change == undefined || change.number == null ) {
		return;
	}
		
	var plan = new SCFile("changePlan");
	var id = change.number;
	
	if ( funcs.filename( change ) == "cm3t" ) {
		id = change.parent_change;
	}
	var sql = "number = \"" + id + "\"";
	
	// Check to see if a plan already exists.  If so there is no further processing.
	if ( plan.doSelect( sql ) == RC_SUCCESS )
	{
		return plan;
	}
	
	// If no plan exists, setup the new plan record
	plan.number = id;
	
	// If there is a change model, set the task information according to the model
	if ( modelName != null )
	{
		var model = new SCFile( "changeModel", SCFILE_READONLY );
		model.setFields(["tasks"]);
		sql = "id=\""+modelName+"\"";
        if ( model.doSelect( sql ) == RC_SUCCESS )
        {
        	var lng = funcs.lng( funcs.denull( model.tasks ) );
        	if ( lng == null ) {
        		lng = 0;
        	}
        	
        	var i;	
			for ( i = 0; i < lng; i++ )
			{
				plan.tasks[i].taskId = model.tasks[i].taskId;
				plan.tasks[i].taskCoords = model.tasks[i].taskCoords;
				plan.tasks[i].dependentIds = model.tasks[i].dependentIds;
				plan.tasks[i].dependentCoords = model.tasks[i].dependentCoords;
				plan.tasks[i].taskCategory = model.tasks[i].taskCategory;
				plan.tasks[i].taskTemplate = model.tasks[i].taskTemplate;
				plan.tasks[i].taskDescription = model.tasks[i].taskDescription;
				plan.tasks[i].openInPhase = model.tasks[i].openInPhase;
				plan.tasks[i].closeByPhase = model.tasks[i].closeByPhase;
				plan.tasks[i].taskStatus = WAITING;
				plan.tasks[i].activeCond = model.tasks[i].activeCond;
				plan.tasks[i].mandatory = model.tasks[i].mandatory;
				plan.tasks[i].activeCondXML = model.tasks[i].activeCondXML;
				plan.tasks[i].activeCondDesc = model.tasks[i].activeCondDesc;
			}
		}
	}
	
	var rc = plan.doInsert();
	if ( rc == RC_SUCCESS ) {
		return plan;
	}
	else {
		return rc;
	}
}

/**
*  This function create the plan task xml for the editor
*
*  @param {record} change Record - get the changePlan of this change
*/

function createXML(change)
{
	var record = new SCFile("changePlan", SCFILE_READONLY);
	var query = "number=\""+ change.number +"\"";
	var ret = record.doSelect(query);
	if (ret==RC_SUCCESS)
	{
		var xml = record.getXML();
		var instance = lib.xmlHelpers.getElement(xml, "instance",null);
		var tasks = lib.xmlHelpers.getElement(instance, "tasks",null);
		if ( tasks != null )
		{
			vars.$taskXml = tasks.toXMLString();
		}
	}
}

/**
*  This function checks to see if a Change is allowed to leave the current phase based on the
*  closedByPhase fields in the Change Plan.
*
*
*  @param {String} fromPhase - The Name of the current phase
*  @param {changePlan} plan - The current Change Plan
*  @param {String} workflowName - The Name of the current workflow
*  @param {String} toPhase - next phase you want to move to
*/
function checkCanLeavePhase(workflowName,fromPhase,toPhase, plan, allowOpen )
{
	//  If there is no plan simply return true
	if ( plan == null )
	{
		return null;
	}
	var needToClose = [];
	if ( allowOpen != true )
	{
		allowOpen = false;
	}
		
	//  Otherwise loop through the tasks and make sure the correct ones are closed
	var i, lng = plan.tasks.length();
	for ( i = 0; i < lng; i++ )
	{
		if ( plan.tasks[i].closeByPhase == fromPhase || !isReachabletoCloseByPhase(workflowName,toPhase,plan.tasks[i].closeByPhase))
		{
			if (allowOpen == false && plan.tasks[i].taskActive == true && !isLegacyFinishedStatus(plan.tasks[i].taskStatus) )
			{
				needToClose.push( plan.tasks[i].taskNumber );
			}
		}
		else if ( plan.tasks[i].closeByPhase == null )
		{
			if ( allowOpen == false && plan.tasks[i].taskActive == true && !isLegacyFinishedStatus(plan.tasks[i].taskStatus) )
			{
				needToClose.push( plan.tasks[i].taskNumber );
			}
		}	
	}
	//  Return the list of tasks that need to close.

	return needToClose;
}

/**
*  This function is to check whether whether the status in legacy task category should be considerred as finished.
*  With these status , category phase with this task can move to next phase successfully. 
*  Currently for legacy task category , if the status is cancelled(30) or withdrawed(31),we will treat them as finished . 
*
*  @param {number} status - The value of status
*  
*/
function isLegacyFinishedStatus(status)
{
	var CANCELLED = "30";
	var WITHDRAWED = "31";
	
	if(status === CANCELLED || status === WITHDRAWED ){	
		return true;
	}
    return false;
}


/**
*  This function return the String of task list that need to be closed .
*
*
*  @param {String} fromPhase - The Name of the current phase
*  @param {changePlan} plan - The current Change Plan
*  @param {String} workflowName - The Name of the current workflow
*  @param {String} toPhase - next phase you want to move to
*/
function getNeedToCloseTaskList(fromPhase, plan, allowOpen,workflowName,toPhase )
{
	var needToCloseArray = checkCanLeavePhase(workflowName,fromPhase,toPhase, plan, allowOpen);
	
	if(needToCloseArray !=null){
	
	    return needToCloseArray.join(",");
	    
	}else {
	
		return "";
	}
	
}

/**
* This function checks to see if the CloseByPhase can be reachable from the phase you want to move to.
*  @param {String} workflowName - The Name of the current workflow
*  @param {String} toPhase - next phase you want to move to
*  @param {String} closeByPhase - The closeByPhase of task in current Change Plan
*/
function isReachabletoCloseByPhase(workflowName,toPhase,closeByPhase)
{
   var allReachablePhase=[];
   lib.ChangePlanHelper.getToPhases(workflowName,toPhase,allReachablePhase);
   return lib.ArrayUtil.contains(allReachablePhase,closeByPhase); 
}

/**
*  This function gets the default template for a specified task category
*
*
*  @param {String} category - The Name of the category to check
*/
function getDefaultTaskTemplate( category )
{
	if ( category == null )
	{
		return null;
	}
		
	var taskcat = new SCFile(cm3tcategory, SCFILE_READONLY);
	taskcat.setFields(["default.category"]);
	var sql = "name=\"" + category + "\"";
	
	if ( taskcat.doSelect( sql ) == RC_SUCCESS )
	{
		return taskcat.default_category;
	}		
	
	return null;
}

/**
*  This function gets the grouping field values from the settings record
*
*/
function getModelGroupFields()
{
	var fields = [];
	var fieldString = lib.settings.getSettingValue( "Change", "modelGroup" );
	if ( fieldString == null || fieldString == "" )
	{
		return fields;
	}
	fields = fieldString.split(",");
	
	var i, lng = fields.length;
	for ( i = 0; i < lng; i++ )
	{	
    	fields[i] = fields[i].replace(/^\s*/, '').replace(/\s*$/, ''); 
	}

	return fields;
}


/**
*  This function try to update a waiting task to 'READY' or 'WITHDRAWN'.
*
*
*  @param {changePlan} plan - The Change Plan(changePlan) record
*  @param {number} index - The index of the task in the change plan.
*  @param {string} newStatus - The task's new status.
*/
function tryWatingTaskActivation(plan, index, newStatus)
{
	var taskNumber = plan.tasks[index].taskNumber;

	var task = new SCFile( "cm3t" );
	var tsql = "number = \"" + taskNumber + "\"";
	if ( task.doSelect( tsql ) == RC_SUCCESS )
	{		
		if (plan.tasks[index].taskStatus==WAITING &&( newStatus==WITHDRAWN||newStatus==READY))
		{						
			task.status = newStatus;
			
			vars.$bypass_bg_authcheck = true;
			var rc = task.doAction("save");
			vars.$bypass_bg_authcheck = false;
			
			plan.tasks[index].taskActive = task.open;
			plan.tasks[index].taskStatus = task.status;
			if(RC_SUCCESS==rc && task.status!= WAITING)
			{	
				return 1;
			}			
		}
	}

	return 0;
}


/**
*  This function update the XML for changePlan task editor.
*
*  @param {fromClient} should be true.
*/
function saveFromXML(fromClient)
{
	var record = new SCFile("changePlan");
	var query = "number=\""+ vars.$L_file.number +"\"";
	var ret = record.doSelect(query);
	if (ret==RC_SUCCESS)
	{
		if ( vars.$taskXml != null && vars.$taskXml!= "" )
		{
			var taskxml = new XML();
			var i = 0;
			var n, lng = record.tasks.length();
			for ( n=0; n < lng; n++ )
			{
				record.tasks = funcs._delete( record.tasks, 1, 1);
			}
			if ( fromClient )
			{
				vars.$taskXml=vars.$taskXml.replace(/\&/g, "&");
			}
			taskxml.setContent( vars.$taskXml  );
			
			var xml = taskxml.getDocumentElement();
			if ( xml != null )
			{
				element = xml.getFirstChildElement();
				if ( element != null )
				{
					do
					{
						record.tasks = funcs.insert( record.tasks, 1, 0 );
						var tempElement = lib.xmlHelpers.getElement( element, "taskId", null );
						if ( tempElement != null )
						{
							record.tasks[i].taskId = funcs.val( tempElement.getValue() );
						}
						tempElement = lib.xmlHelpers.getElement( element, "taskCategory", null );
						if ( tempElement != null )
						{
							record.tasks[i].taskCategory = tempElement.getValue();
						}
						tempElement = lib.xmlHelpers.getElement( element, "taskCoords", null );
						if ( tempElement != null )
						{
							record.tasks[i].taskCoords = tempElement.getValue();
						}
						tempElement = lib.xmlHelpers.getElement( element, "taskTemplate", null );
						if ( tempElement != null )
						{
							record.tasks[i].taskTemplate = tempElement.getValue();
						}
						tempElement = lib.xmlHelpers.getElement( element, "taskDescription", null );
						if ( tempElement != null )
						{
							record.tasks[i].taskDescription = tempElement.getValue();
						}			
						tempElement = lib.xmlHelpers.getElement( element, "openInPhase", null );
						if ( tempElement != null )
						{
							record.tasks[i].openInPhase = tempElement.getValue();
						}	
						tempElement = lib.xmlHelpers.getElement( element, "closeByPhase", null );
						if ( tempElement != null )
						{
							record.tasks[i].closeByPhase = tempElement.getValue();
						}
						/*Active Condition*/
						tempElement = lib.xmlHelpers.getElement( element, "activeCondDesc", null );
						if ( tempElement != null )
						{
							record.tasks[i].activeCondDesc = tempElement.getValue();
						}
						tempElement = lib.xmlHelpers.getElement( element, "activeCondXML", null );					
						if ( tempElement != null )
						{					
							tempElement =  tempElement.getFirstChildElement();						
							if ( tempElement != null )
							{						
								record.tasks[i].activeCondXML = tempElement.toXMLString();
								var result = lib.conditionXmlParser.getRadQueryFromCondtionXml(record.tasks[i].activeCondXML );								
								record.tasks[i].activeCond = lib.WorkflowTriggers.convertResult(result[0]);	
							}
						}
						tempElement = lib.xmlHelpers.getElement( element, "mandatory", null );					
						if ( tempElement != null )
						{	
							tempElement =  tempElement.getValue();
							record.tasks[i]["mandatory"]=tempElement;
						}
						var dI;
						tempElement = lib.xmlHelpers.getElement( element, "dependentIds", null );
						if ( tempElement != null )
						{
							dI = 0;
							var dIdElement = tempElement.getFirstChildElement();
							
							if ( dIdElement != null )
							{
								do 
								{
									record.tasks[i].dependentIds = funcs.insert(record.tasks[i].dependentIds,0,1, 
												funcs.val( dIdElement.getValue() ) );
												
									dIdElement = dIdElement.getNextSiblingElement();
									dI++;
								}
								while ( dIdElement != null );
							}
						}
						tempElement = lib.xmlHelpers.getElement( element, "dependentCoords", null );
						if ( tempElement != null )
						{
							dI = 0;
							var dCoordElement = tempElement.getFirstChildElement();
							if ( dCoordElement != null )
							{	
								do 
								{
									record.tasks[i].dependentCoords = funcs.insert( record.tasks[i].dependentCoords,0,1, 
												funcs.str( dCoordElement.getValue() ) );
									dCoordElement = dCoordElement.getNextSiblingElement();
									dI++;
								}
								while ( dCoordElement != null );
							}			
						}
						i++;
						element = element.getNextSiblingElement();
					}
					while ( element != null );
				}
			}
		}
	}
}

/**
*  This function updates the Change Plan when a task is created or updated
*  @param {cm3t} task - the task that is created or updated.
*/
function updatePlan( task )
{
	var startTasks = false;
	var sql, change;
	
	if ( vars.$from_changePlan == null || vars.$from_changePlan != true || vars.$from_changePlan == undefined )
	{
		var plan = new SCFile("changePlan");
		sql = "number=\""+task.parent_change+"\"";
		if ( plan.doSelect( sql ) == RC_SUCCESS )
		{
			if ( plan != null )
			{
			     
				var exists = false;
				var i, lng = funcs.lng(funcs.denull(plan.tasks));
				var lastId=1;
				for ( i = 0; i<lng; i++ )
				{
					if ( plan.tasks[i].taskNumber == task.number )
					{
						exists = true;
						plan.tasks[i].taskActive = task.open;
						plan.tasks[i].taskStatus = task.status;
						
						var intStatus = funcs.val( task.status );
						if ( (task.active == false) || (intStatus != null && intStatus > 19) )	
						{							
							startTasks = true;
						}

					}
					lastId = Math.max( lastId, plan.tasks[i].taskId );
				}	
				if ( exists == false )
				{
					plan.tasks = funcs.insert( plan.tasks, 1, 0 );
					plan.tasks[i].taskId = lastId + 1;
					plan.tasks[i].taskNumber = task.number;
					plan.tasks[i].taskStatus = task.status;
					plan.tasks[i].taskCategory = task.category;
					plan.tasks[i].taskDescription = task.brief_desc;
					plan.tasks[i].taskAssignment = task.assign_dept;
					plan.tasks[i].taskActive = task.open;
					
					change = new SCFile("cm3r", SCFILE_READONLY);
					change.setFields(["current.phase"]);
					var query = "number=\""+ task.parent_change +"\"";
					var ret = change.doSelect(query);
					if (ret == RC_SUCCESS)
					{
						plan.tasks[i].openInPhase = change.current_phase;
					}
				}
				plan.doUpdate();
				// Logic to start tasks that were dependent on tasks that have been closed.
			}
		}
	}

	if(startTasks==true)
	{
		change = new SCFile("cm3r");
		sql = "number=\""+task.parent_change+"\"";
		if ( change.doSelect( sql ) == RC_SUCCESS )
		{
			updateWaitingTasks(plan, change);
		}
	}	
}



/**
*  This function determines the status of a newly opened task
*
*  @param {number} index - the index of the task in the change plan
*  @param {changePlan} plan - The Change Plan(changePlan) record
*  @param {cm3r} change - The Change (cm3r) record associated with this change plan.
*/
function setInitStatus( index, plan, change )
{	
	return lib.TaskPlannerHelper.setInitStatus(index, plan, change);
}

/**
*  This function gets the Change Plan for a specific Change ID
*
*  @param {cm3r} change - The Change (cm3r) record associated with this change plan.
*/
function getPlan( change )
{
	var plan = new SCFile("changePlan");
	var sql = "number=\""+change.number+"\"";
	if ( plan.doSelect( sql ) == RC_SUCCESS )
	{
		return plan;
	}
	else {
		return createPlanFromExisting( change );
	}
}


/**
*  This function update waiting task's status based task's activation condition and pending tasks'status
*
*  When task is updated in this function, its trigger to update pending tasks is turned off. Then this function
*  run another loop to check whether there still are tasks to update.
*
*  @param {changePlan} plan - The Change Plan(changePlan) record
*  @param {cm3r} change - The Change (cm3r) record associated with this change plan.
*/

function updateWaitingTasks(plan, change, depth)
{
	var numberOfUpdate = null;
	var numberofLoop=0;

	//set up control variables
	var tempValid = false;
	if ( vars.$bypass_failed_validation != null )
	{
		tempValid = vars.$bypass_failed_validation;
	}
	vars.$bypass_failed_validation = true;

	//disable task's trigger to update pending task
	var tempFromPlan = false;
	if ( vars.$from_changePlan != null )
	{
		tempFromPlan = vars.$from_changePlan;
	}
	vars.$from_changePlan = true;

	while(numberOfUpdate==null||numberOfUpdate>0)
	{
		numberOfUpdate = 0;
		numberofLoop++;
		var i, lng = plan.tasks.length();
		for ( i = 0; i<lng; i++ )
		{
			if ( plan.tasks[i].taskNumber!=null )
			{
				if (plan.tasks[i].taskActive==true && plan.tasks[i].taskStatus==WAITING)
				{
				    var targetStatus = setInitStatus(i, plan, change);
					numberOfUpdate = numberOfUpdate + tryWatingTaskActivation(plan, i, targetStatus);
				}
			}
		}	
	}

	//restore the original bypass validation flag.	
	vars.$bypass_failed_validation = tempValid;
	vars.$from_changePlan = tempFromPlan;
	plan.doUpdate();
}

/**
*  This function create plan from exsiting change
*
*
*  @param {cm3r} change - The Change (cm3r) record associated with this change plan.
*/
function createPlanFromExisting( change )
{
	// If no change is passed in then simply exit
	if ( change == null || change == undefined || change.number == null ) {
		return null;
	}

	var plan = new SCFile("changePlan");
	plan.number = change.number;

	var task = new SCFile("cm3t", SCFILE_READONLY);
	task.setFields(["number","category","brief.desc","status","assign.dept","active"]);
	
	var tasksql = "parent.change=\""+change.number+"\"";
	var i = 0;
	if ( task.doSelect( tasksql ) == RC_SUCCESS ) {
		do
		{
			plan.tasks[i].taskId = i + 1;
			plan.tasks[i].taskNumber = task.number;
			plan.tasks[i].taskCategory = task.category;
			plan.tasks[i].taskDescription = task.brief_desc;
			plan.tasks[i].openInPhase = vars.$L_orig_phase;
			plan.tasks[i].taskStatus = task.status;
			plan.tasks[i].taskAssignment = task.assign_dept;
			plan.tasks[i].taskActive = task.active;
			i++;
		}
		while ( task.getNext() == RC_SUCCESS );
	}	

	var rc = plan.doInsert();
	if ( rc == RC_SUCCESS ) {
		return plan;
	}
	else {
		return null;
	}
}

/**
* This function checks to see if the dependent task has been activated or not.
* The condition is that predecessor task status is completed-20, Completed with Problems-21, or failed-32
*  @param {cm3t} currentTask - The current task record
*/
function canDependentTaskActivate(currentTask){
	if ( currentTask == null || currentTask == "undefined" ){
		return false;
	}
	var change_number = currentTask.parent_change;
	var plan = new SCFile("changePlan", SCFILE_READONLY);
	var sql_cp = "number = \"" + change_number + "\"";

	var taskMap ={};
	var i, lng;
	
	if(plan.doSelect(sql_cp)==RC_SUCCESS){//add task id and task number to the map for later use
		for ( i = 0, lng = plan.tasks.length(); i < lng; i++ ){
			var tempId = plan.tasks[i].taskId;
			var tempNumber = plan.tasks[i].taskNumber;
			taskMap[tempId] = ""+tempNumber;
		}
	}

	if(plan.doSelect(sql_cp)==RC_SUCCESS){
		for ( i = 0, lng = plan.tasks.length(); i < lng; i++ ){
//			var task_Id = plan.tasks[i].taskId;
			if(plan.tasks[i].taskNumber != null && plan.tasks[i].taskNumber == currentTask.number){
				if(plan.tasks[i].dependentIds != null){
					var j, jlng = plan.tasks[i].dependentIds.length();
					for ( j = 0; j < jlng; j++ ){
						var task_Id = plan.tasks[i].dependentIds[j];//get dependent id for example "3"
						var tempTaskNumber = taskMap[task_Id];
						if(tempTaskNumber == null || tempTaskNumber =="null"){
							//the predecessor task is not opened yet
							return false;
						}
						var sql_task = "number = \"" + tempTaskNumber +"\"";
						
						var task = new SCFile("cm3t", SCFILE_READONLY);
						task.setFields(["status"]);
						if ( task.doSelect(sql_task) == RC_SUCCESS){
							//if the status of the task is Completed(20),Completed with Problems(21), or Failed(32).
							if ( task.status == 20 || task.status == 21 || task.status == 32 ){
								continue;
							}else{
								return false;
							}
						}
					}
				}
			}
		}
	}
	return true;
}

/**
* This function checks to see if the dependent task has been closed or not.
* The condition is that predecessor task's phase is Closed
*  @param {cm3t} currentTask - The current task record
*/
function canDependentTaskClose(currentTask){
	if ( currentTask == null || currentTask == "undefined" ){
		return false;
	}
	var change_number = currentTask.parent_change;
	var plan = new SCFile("changePlan", SCFILE_READONLY);
	var sql_cp = "number = \"" + change_number + "\"";

	var taskMap ={};
	var i, lng;
	if(plan.doSelect(sql_cp)==RC_SUCCESS){//add task id and task number to the map for later use
		for ( i = 0, lng = plan.tasks.length(); i < lng; i++ ){
			var tempId = plan.tasks[i].taskId;
			var tempNumber = plan.tasks[i].taskNumber;
			taskMap[tempId] = ""+tempNumber;
		}
	}

	if(plan.doSelect(sql_cp)==RC_SUCCESS){
		for ( i = 0, lng = plan.tasks.length(); i < lng; i++ ){
//			var task_Id = plan.tasks[i].taskId;
			if(plan.tasks[i].taskNumber != null && plan.tasks[i].taskNumber == currentTask.number){
				if(plan.tasks[i].dependentIds != null){
					var j, jlng = plan.tasks[i].dependentIds.length();
					for ( j = 0; j < jlng; j++ ){
						var task_Id = plan.tasks[i].dependentIds[j];//get dependent id for example "3"
						var tempTaskNumber = taskMap[task_Id];
						if(tempTaskNumber == null || tempTaskNumber =="null"){
							//the predecessor task is not opened yet
							return false;
						}
						var task = new SCFile("cm3t", SCFILE_READONLY);
						task.setFields(["record.active"]);
						var sql_task = "number = \"" + tempTaskNumber +"\"";
						if ( task.doSelect(sql_task) == RC_SUCCESS){
							if ( task.record_active == true ){
								return false;
							}
						}
					}
				}
			}
		}
	}
	return true;
}

/**
*  Remove task plan in changePlan
*  When no task plan in changePlan, remove the changePlan
*
*  @param {requestTask/cm3t} task - The task (requestTask/cm3t) record
*/
function removeTaskPlan(task) {
    if (!task) {
        return;
    }

    var taskParentField = {
        "requestTask": "parent.request",
        "cm3t": "parent.change"
    };
    var taskIDField = {
        "requestTask": "number",
        "cm3t": "number"
    };

    var taskFilename = funcs.filename(task);

    var parentField = taskParentField[taskFilename];
    if (!parentField || !task[parentField]) {
        return;
    }

    var changePlan = new SCFile("changePlan");
    var rc = changePlan.doSelect("number=\"" + task[parentField] + "\"");
    if (rc == RC_SUCCESS && !funcs._null(changePlan["tasks"])) {
        var IDField = taskIDField[taskFilename];
        var tasks = new SCDatum();
        tasks.setType(lib.DataTypeConst.typeArray());
        var lng = funcs.lng(changePlan["tasks"]);
        var i;
        for (i = lng - 1; i >= 0; i--) {
            if (changePlan["tasks"][i]["taskNumber"] != oldrecord[IDField]) {
                tasks = funcs.insert(tasks, 1, 1, changePlan["tasks"][i]);
            }
        }

        var lng2 = funcs.lng(tasks);
        if (lng2 < lng) {
            if (lng2 == 0) {
                changePlan.doDelete();
            } else {
                changePlan["tasks"] = tasks;
                changePlan.doUpdate();
            }
        }
    }
}
