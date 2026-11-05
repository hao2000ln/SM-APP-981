//Calculate Priority based on Impact and Urgency value
   //It is called by related Rule Sets
   
var $ = lib.c.$;

  function setPriority(impact, urgency) {
  	var impactValue = parseInt(impact, 0);
  	var urgencyValue = parseInt(urgency, 0);

  	var priority = Math.floor((impactValue + urgencyValue) / 2);

  	return priority.toString();
  }

   //Initialize Incident Module status dropdown list for workflow transition
   //It is called by related Rule Sets

  function INM_setStateList(WorkflowState) {
  	var allowStatus = lib.security.getRights("Incident", "allowedStatus");
  	if (WorkflowState == "Categorization" || WorkflowState == "Investigation") {
  		vars.$Incident_StatusValueList = ["Categorize", "Assign", "Work In Progress", "Pending Customer", "Pending Evidence", "Pending Vendor", "Pending Other", "Resolved", "Suspended"];
  	}
  	else if (WorkflowState == "Recovery") {
  		vars.$Incident_StatusValueList = ["Work In Progress", "Pending Customer", "Pending Evidence", "Pending Vendor", "Pending Other", "Resolved", "Suspended"];
  	}
  	else if (WorkflowState == "Review") {
  		vars.$Incident_StatusValueList = ["Work In Progress", "Resolved"];
  	}
	else if (WorkflowState == "Closure") {
  		vars.$Incident_StatusValueList = ["Closed"];
  	}  
  	intersect(vars.$Incident_StatusValueList, allowStatus);
  	vars.$Incident_StatusValueList = vars.$L_tmp;
  	vars.$Incident_StatusDisplayList= getDisplayList("probsummary",vars.$L_tmp);
  }

   //Initialize Service Desk status dropdown list for workflow transition
   //It is called by related Rule Sets

function SD_setStateList(WorkflowState, Category)
{
    var allowStatus=lib.security.getRights("Service Desk", "allowedStatus");
	if(WorkflowState=="Categorization"){
        if (Category =="service catalog") {
            vars.$Interaction_statusValueList=["Categorize","Assign","Dispatched","Resolved","Suspended"];
        }
        else {
        	vars.$Interaction_statusValueList=["Categorize","Assign","In Progress","Resolved","Suspended"];
       	}
	}		
	else if(WorkflowState=="Work In Progress"){
        if (Category == "incident" || Category == "request for change") {
            vars.$Interaction_statusValueList = ["Categorize", "Assign", "In Progress","Dispatched", "Resolved", "Suspended"];
        }
        else if (Category == "service catalog") {
            vars.$Interaction_statusValueList = ["Categorize", "Assign", "Dispatched", "Resolved", "Suspended"];
        }
        else {
            vars.$Interaction_statusValueList = ["Categorize", "Assign", "In Progress", "Resolved", "Suspended"];
        }
	}
	else if(WorkflowState=="Review"){
        if (Category == "incident" || Category == "request for change") {
            vars.$Interaction_statusValueList = ["Dispatched", "In Progress", "Resolved"];
        }
        else if (Category == "service catalog") {
            vars.$Interaction_statusValueList = ["Dispatched", "Resolved"];
        }
        else {
            vars.$Interaction_statusValueList = ["In Progress", "Resolved"];
        }
	}
	else if(WorkflowState=="Withdrawal"){
        if (Category == "incident" || Category == "request for change") {
            vars.$Interaction_statusValueList = ["Dispatched", "In Progress", "Withdrawal Requested"];
        }
        else if (Category == "service catalog") {
            vars.$Interaction_statusValueList = ["Dispatched", "Withdrawal Requested"];
        }
        else {
            vars.$Interaction_statusValueList = ["In Progress", "Withdrawal Requested"];
        }
	}
 
  	else if (WorkflowState == "Logging") {
  		vars.$Interaction_statusValueList = ["Open"];
  	}
  	else if (WorkflowState == "Closure") {
  		vars.$Interaction_statusValueList = ["Closed"];
  	}
  	
  	intersect(vars.$Interaction_statusValueList, allowStatus);
  	vars.$Interaction_statusValueList = vars.$L_tmp;
  	vars.$Interaction_statusDisplayList =getDisplayList("incidents",vars.$L_tmp);
  }

   //Initialize Problem Module status dropdown list for workflow transition
   //It is called by related Rule Sets

  function PBM_setStateList(WorkflowState, Status) {
  	var allowStatus = lib.security.getRights("Problem", "allowedStatus");
  	if (WorkflowState == "Logging") {
  		vars.$Problem_StatusValueList = ["Open"];
  	}
  	else if (WorkflowState == "Categorization" && Status != "Deferred") {
  		vars.$Problem_StatusValueList = ["Categorize", "Assign", "Work In Progress", "Deferred"];
  	}
  	else if (WorkflowState == "Categorization" && Status == "Deferred") {
  		vars.$Problem_StatusValueList = ["Categorize", "Assign", "Deferred"];
  	}
  	else if (WorkflowState == "Investigation" && Status != "Deferred") {
  		vars.$Problem_StatusValueList = ["Work In Progress", "Categorize", "Assign", "Deferred"];
  	}
  	else if (WorkflowState == "Investigation" && Status == "Deferred") {
  		vars.$Problem_StatusValueList = ["Work In Progress", "Deferred"];
  	}
  	else if (WorkflowState == "Resolution" && Status != "Deferred") {
  		vars.$Problem_StatusValueList = ["Work In Progress", "Pending", "Deferred", "Resolved"];
  	}
  	else if (WorkflowState == "Resolution" && Status == "Deferred") {
  		vars.$Problem_StatusValueList = ["Work In Progress", "Pending", "Deferred"];
  	}
  	else if (WorkflowState == "Review") {
  		vars.$Problem_StatusValueList = ["Work In Progress", "Resolved"];
  	}
  	else if (WorkflowState == "Closure") {
  		vars.$Problem_StatusValueList = ["Closed"];
  	}
  	intersect(vars.$Problem_StatusValueList, allowStatus);
  	vars.$Problem_StatusValueList = vars.$L_tmp;
  	vars.$Problem_StatusDisplayList=getDisplayList("rootcause",vars.$L_tmp);
  }

   //Initialize Problem Task status dropdown list for workflow transition
   //It is called by related Rule Sets

  function PBMTask_setStateList(WorkflowState, Priority) {
  	var allowStatus = lib.security.getRights("Problem Tasks", "allowedStatus");
  	if (WorkflowState == "Waiting") {
  		vars.$ProblemTask_StatusValueList = ["Planned"];
  	}
  	else if (WorkflowState == "Active" && Priority < 3) {
  		vars.$ProblemTask_StatusValueList = ["Ready", "Assigned", "Work In Progress", "Pending", "Pending Review"];
  	}
  	else if (WorkflowState == "Active" && Priority > 2) {
  		vars.$ProblemTask_StatusValueList = ["Ready", "Assigned", "Work In Progress", "Pending"];
  	}
  	else if (WorkflowState == "Review") {
  		vars.$ProblemTask_StatusValueList = ["Pending Review", "Work In Progress"];
  	}
  	else if (WorkflowState == "Closure") {
  		vars.$ProblemTask_StatusValueList = ["Closed"];
  	}
  	intersect(vars.$ProblemTask_StatusValueList, allowStatus);
  	vars.$ProblemTask_StatusValueList = vars.$L_tmp;
  	vars.$ProblemTask_StatusDisplayList=getDisplayList("rootcausetask",vars.$L_tmp);

  }

   //Initialize Incident Task status dropdown list for workflow transition
   //It is called by related Rule Sets

  function IMTask_setStateList(WorkflowState, Priority) {
  	var allowStatus = lib.security.getRights("Incident Tasks", "allowedStatus");
  	if (WorkflowState == "Waiting") {
  		vars.$IncidentTask_StatusValueList = ["Planned"];
  	}
  	else if (WorkflowState == "Active" && Priority < 3) {
  		vars.$IncidentTask_StatusValueList = ["Ready", "Assigned", "Work In Progress", "Pending", "Pending Review"];
  	}
  	else if (WorkflowState == "Active" && Priority > 2) {
  		vars.$IncidentTask_StatusValueList = ["Ready", "Assigned", "Work In Progress", "Pending"];
  	}
  	else if (WorkflowState == "Review") {
  		vars.$IncidentTask_StatusValueList = ["Pending Review", "Work In Progress"];
  	}
  	else if (WorkflowState == "Cancelled") {
  	    vars.$IncidentTask_StatusValueList = ["Cancelled"];
  	}
  	else if (WorkflowState == "Closure") {
  	    vars.$IncidentTask_StatusValueList = ["Closed"];
  	}
  	intersect(vars.$IncidentTask_StatusValueList, allowStatus);
  	vars.$IncidentTask_StatusValueList = vars.$L_tmp;
  	vars.$IncidentTask_StatusDisplayList = getDisplayList("imTask",vars.$L_tmp);
  }

  function intersect(status, allowstatus) {
  	var intersectstatus = new SCDatum();
  	intersectstatus.setType(lib.DataTypeConst.typeArray());
  	if (funcs._null(allowstatus)) {
  		vars.$L_tmp = status;
  		return;
  	}
  	vars.$L_sf = funcs.rtecall("intersect", vars.$L_err, intersectstatus, status, allowstatus);
  	vars.$L_tmp = intersectstatus;
  }
  
  function getDisplayList(enumfield,valuelist,workflow)
  {
  	var language=vars.$G_my_language;
  	var displaylist = [];
  	var status;
  	if (valuelist != null) {
  		var i, iLoopTimes;
  		for (i = 0, iLoopTimes = lib.ArrayUtil.length(valuelist);i < iLoopTimes;i++)
  		{
  	   		status=localvalue(enumfield,valuelist[i],workflow,language);
  	   		displaylist.push(status);
  		}
  	}
  	return displaylist;
  }
  
  
 function localvalue(enumfield,value,workflow,language)
 {
	var dispLab;
	var enumDispLab = new SCFile("scmessage", SCFILE_READONLY);
 	var langQuery="class=\"local:ModuleStatus\" and syslanguage=\""+language+"\" and (message.id=\""+enumfield+";"+value+";"+workflow+"\" or message.id=\""+enumfield+";"+value+";NULL\")";
	var defaultLangQuery="class=\"local:ModuleStatus\" and syslanguage=\"en\" and (message.id=\""+enumfield+";"+value+";"+workflow+"\" or message.id=\""+enumfield+";"+value+";NULL\")";
	if (enumDispLab.doSelect(langQuery)==RC_SUCCESS)
	{
		dispLab=enumDispLab.message;
	}
	else if (enumDispLab.doSelect(defaultLangQuery)==RC_SUCCESS)
	{
		dispLab=enumDispLab.message;
	} else
	{
	    dispLab=value;
	}
 	return dispLab;
 }
 
 
 function buildStatusList(module, workflow, workflowPhase, record)
 {
  	var area = lib.security.getArea("module");
 	var allowStatus = lib.security.getRights(area, "allowedStatus");
 	var query = "module=\""+module+"\"";

 	if (workflow && workflowPhase)
 	{
 		query='module="' + module + '" and (is.bkgstatus=false or is.bkgstatus=NULL) and (workflow=NULL or workflow="'+workflow+'") and (workflowPhase=NULL or workflowPhase="'+workflowPhase+'")';
	}
	
 	var statusList = [];
 	var moduleStatus = new SCFile("ModuleStatus", SCFILE_READONLY);
 	moduleStatus.setFields(["status","condition","conditionXML"]);
 	moduleStatus.setOrderBy(["sort.order"], [SCFILE_ASC]);
 	
 	vars.$L_file=record;

  	if (moduleStatus.doSelect(query)==RC_SUCCESS)
	{
		do
		{
			var cond = funcs.nullsub(moduleStatus.condition, true);
			//initial userOption variable $L.UO.
			lib.Workflow.initVarForCondition(moduleStatus.conditionXML);

			if (funcs.parse_evaluate(funcs.str(cond),4)==true && funcs.index(moduleStatus.status, statusList)==0)
			{
				statusList.push(moduleStatus.status);
			}
			
			var rc = moduleStatus.getNext();
		} while (rc==RC_SUCCESS);
	}
	
	var recordStatus = {
		device:"istatus",
		imTask:"status",
		incidents:"open",
		probsummary:"problem.status",
		rootcause:"rcStatus",
		rootcausetask:"rcStatus",
		request:"status",
		requestTask:"status",
		svcCatalog:"status"
	};
 	
 	intersect(statusList, allowStatus);
 	
 	switch(module)
 	{
	 	case "probsummary":
	 		pushBkgStatus(recordStatus.probsummary, record);
	 		vars.$Incident_StatusValueList = vars.$L_tmp;
	  		vars.$Incident_StatusDisplayList= getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "incidents":
	 		pushBkgStatus(recordStatus.incidents, record);
	  		vars.$Interaction_statusValueList = vars.$L_tmp;
	  		vars.$Interaction_statusDisplayList =getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "rootcause":
	 		pushBkgStatus(recordStatus.rootcause, record);
	  		vars.$Problem_StatusValueList = vars.$L_tmp;
	  		vars.$Problem_StatusDisplayList=getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "rootcausetask":
	  		pushBkgStatus(recordStatus.rootcausetask, record);
	  		vars.$ProblemTask_StatusValueList = vars.$L_tmp;
	  		vars.$ProblemTask_StatusDisplayList=getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "imTask":
	  		pushBkgStatus(recordStatus.imTask, record);
	  		vars.$IncidentTask_StatusValueList = vars.$L_tmp;
	  		vars.$IncidentTask_StatusDisplayList = getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "request":
	  		pushBkgStatus(recordStatus.request, record);
	  		vars.$Request_statusValueList = vars.$L_tmp;
	  		vars.$Request_StatusDisplayList = getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "requestTask":
	  		pushBkgStatus(recordStatus.requestTask, record);
	  		vars.$RequestTask_statusValueList = vars.$L_tmp;
	  		vars.$RequestTask_StatusDisplayList = getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "svcCatalog":
	  		pushBkgStatus(recordStatus.svcCatalog, record);
	  		vars.$Catalog_StatusValueList = vars.$L_tmp;
	  		vars.$Catalog_StatusDisplayList = getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	case "device":
	  		pushBkgStatus(recordStatus.device, record);
	  		// remove inactive status when adding new CI, otherwise it will cause issue because of auto transition
	  		if (vars.$L_mode == "add") {
	  			var tmpArray = lib.ArrayUtil.toJsArray(vars.$L_tmp);
	  			tmpArray = lib.Underscore.require().without(tmpArray, "Missing","Retired/Consumed","Return for Maintenance","Return to Supplier");
		  		vars.$L_tmp = lib.ArrayUtil.toSCDatum(tmpArray);
	  		}
	  		vars.$CI_StatusValueList = vars.$L_tmp;
	  		vars.$CI_StatusDisplayList = getDisplayList(module,vars.$L_tmp,workflow);
	  		break;
	  	default:
	 		vars.$StatusValueList = vars.$L_tmp;
	  		vars.$StatusDisplayList= getDisplayList(module,vars.$L_tmp,workflow);
 	}
 	
 }


 function selectWfPhaseByWorkflow(workflow)
 {
  	var wfPhases = new SCFile("WorkflowPhase", SCFILE_READONLY);
  	if (workflow != null)
	{
		var query = 'workflowName="'+workflow+'"';
		var phasenameList = [];
		var phaseDisplayList = [];
		if (wfPhases.doSelect(query)==RC_SUCCESS)
		{
			do
			{
				phasenameList.push(wfPhases.phaseName);
				var messageId = wfPhases.phaseName+";"+wfPhases.workflowName+";"+wfPhases.tableName;
				phaseDisplayList.push(funcs.scmsg(messageId,"local:WorkflowPhase"));
				var rc = wfPhases.getNext();
			} while (rc==RC_SUCCESS);
		}
		vars.$L_WfPhaseName = phasenameList;
		vars.$L_WfPhaseName_local = phaseDisplayList;
	}
 }
 

function pushBkgStatus(statusField, record)
{
	if (lib.ArrayUtil.indexOf(vars.$L_tmp, record[statusField])==-1 && record[statusField]!=null)
 		{
 			vars.$L_tmp.push(record[statusField]);
 		}
}