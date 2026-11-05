var _msg = system.functions.scmsg;
var _lng = system.functions.lng;
var $ = lib.c.$;

function isActivityTypeVisible(type, file_name) {
	var query = 'activity.name="' + type + '" and visible="YES" and table="' + file_name + '"';
	var activitytype = $("activitytype", SCFILE_READONLY).setFields(["activity.name"]).select(query).uniqueResult();
	
	return activitytype != null;
}

function updateIncidentWorkaround(problem) {
    var str = "Problem " + problem.id + " updated with new workaround.";
    var workaround = system.functions.insert(problem.workaround, 1, 1, str);

    return relatedIncidentUpdate(problem.id, "rootcause", "Problem Workaround", workaround);
}

function problemClosure( problem )
{
	var str; 
	var resolution;

	if ( problem.status == "Closed" ){
		str = "Problem "+ problem.id +" has been closed.";
		resolution = system.functions.insert(problem.resolution,1,1,str);
		return relatedIncidentUpdate( problem.id, "rootcause", "Problem Closure", resolution );
	}
	else
	if ( problem.status == "Cancelled" ){
		str = "Problem "+ problem.id +" has been cancelled.";
		resolution = system.functions.insert(problem.resolution,1,1,str);
		return relatedIncidentUpdate( problem.id, "rootcause", "Problem Cancellation", resolution );
	}
	else
		return false;
}

function errorClosure( knownError )
{
	var str = "Known Error "+ knownError.id +" has been closed." 
	var resolution = system.functions.insert(knownError.resolution,1,1,str);
	
	if ( knownError.status == "Closed" )
		return relatedProblemUpdate( knownError.id, "knownerror", "Error Closure", resolution );
	else
	if ( knownError.status == "Cancelled" )
		return relatedProblemUpdate( knownError.id, "knownerror", "Error Cancellation", resolution );
	else
		return false;
}

// for incident module only
function customerVisibleUpdate(activity) {
    var str = _msg("incident", "activitySync", [activity.number, activity.operator]);
    var update = system.functions.insert(activity.description, _lng(activity.description) + 1, 1, str);
    if (activity.cust_visible == true) {
        childIncidentRelatedCallUpdate(activity.number, "probsummary", "Incident Update", update, activity.cust_visible);
    }
    var needNotifySD = isActivityTypeVisible(activity.type, "probsummary");
    return relatedCallUpdate(activity.number, "probsummary", "Incident Update", update, activity.cust_visible, needNotifySD);
}
 
function childIncidentRelatedCallUpdate(id, filename, activityType, activityText, custVisible) {
    var returnCode = true;
    if (system.library.MasterIncidentService.isMasterIncident(id))
    {
    	print("is master:"+system.library.MasterIncidentService.isMasterIncident(id));
    	var childIMs = [];
       	var query = 'parent.incident=\"' + id + '\"';
        var children = new SCFile("probsummary");
    	var rc = children.doSelect(query);
    	while (rc == RC_SUCCESS) {
    	    print("incident number="+children.number);
        	childIMs.push(children.number);
            system.library.activityUpdates.updateRecord(children, activityType, activityText, custVisible);
        	rc = children.getNext();
    	}
    	var i;
    	for (i= 0; i < childIMs.length; i++) 
    	{
    	    print("incident id="+childIMs[i]);
            returnCode = system.library.activityUpdates.relatedRecordUpdate(childIMs[i], filename, "incidents", activityType, activityText, custVisible);
    		if (!returnCode) return returnCode;
		}
	}
	return returnCode;
}

// for change module only
function customerVisibleUpdate4ChM( activity )
{

	var args = new SCFile();
	args.setType( 8 );	//type array
	args.push( activity.number );
	args.push(activity.operator);
	
	var str = _msg(902, "cm3", args);
	
    var update = system.functions.insert(activity.description, _lng(activity.description) + 1, 1, str);
    return relatedCallUpdate(activity.number, "cm3r", "Change Update", update, activity.cust_visible);
}


// for request module only
function customerVisibleUpdate4Request(activity) {
    var str = _msg("request", "activitySync", [activity.number, activity.operator]);
    var update = system.functions.insert(activity.description, _lng(activity.description) + 1, 1, str);
    var needNotifySD = isActivityTypeVisible(activity.type, "request");
    return relatedCallUpdate(activity.number, "request", "Request Update", update, activity.cust_visible, needNotifySD);
}


// for requestTask module only
function customerVisibleUpdate4RequestTask(activity) {
   
    var str_requestTask = _msg("requestTask", "activitySync", [activity.number, activity.operator]);
    var update_requestTask = system.functions.insert(activity.description, _lng(activity.description) + 1, 1, str_requestTask);       
  
    var requestId = relatedRequestUpdateforRequestTask(activity.number, "requestTask", "RequestTask Update", update_requestTask, activity.cust_visible);     	
    
    var str_request = _msg("request", "activitySync", [requestId, activity.operator]);
    var update_request = system.functions.insert(activity.description, _lng(activity.description) + 1, 1, str_request);
    if( activity.cust_visible== true) {
    	return relatedCallUpdate(requestId, "request", "Request Update", update_request, activity.cust_visible);    	
    } 
}


function relatedRequestUpdateforRequestTask(id, filename, activityType, activityText, custVisible){

    var request = lib.RequestTaskService.getParentTikcetbyTaskId(id);
    if(custVisible == true){
    	request["cust.visible"] = true;
    }
   	lib.activityUpdates.updateRecord(request, activityType, activityText, custVisible);
  	return request.number;
 
}

// for PBM module only
function customerVisibleUpdate4Problem(activity) {
    var str = _msg("problem", "activitySync", [activity.number, activity.operator]);
    var update = system.functions.insert(activity.description,  _lng(activity.description) + 1, 1, str);
    var needNotifySD = isActivityTypeVisible(activity.type, "rootcause");
    return relatedCallUpdate(activity.number, "rootcause", "Problem Update", update, activity.cust_visible, needNotifySD);
}


function relatedIncidentUpdate( id, filename, activityType, activityText, custVisible )
{
	return system.library.activityUpdates.relatedRecordUpdate( id, filename, "probsummary", activityType, activityText, custVisible );
}

function relatedProblemUpdate( id, filename, activityType, activityText, custVisible )
{
	return system.library.activityUpdates.relatedRecordUpdate( id, filename, "rootcause", activityType, activityText, custVisible );
}

function relatedCallUpdate(id, filename, activityType, activityText, custVisible, needNotifySD) {
    return system.library.activityUpdates.relatedRecordUpdate(id, filename, "incidents", activityType, activityText, custVisible, needNotifySD);
}

function relatedRequestUpdate( id, filename, activityType, activityText, custVisible )
{
	return system.library.activityUpdates.relatedRecordUpdate( id, filename, "request", activityType, activityText, custVisible);
}

function relatedChangeUpdate( id, filename, activityType, activityText, custVisible )
{
	return system.library.activityUpdates.relatedRecordUpdate( id, filename, "cm3r", activityType, activityText, custVisible );
}

