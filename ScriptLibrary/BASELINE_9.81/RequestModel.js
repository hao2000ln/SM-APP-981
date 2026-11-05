
/** 
 * Introduction:Apply request model to request which will be called by RAD apply.requestModel
 * Date:2014018
 * Author:xiaoning.li 
 *
 * @param request The target request ticket.
 * @param requestModele  The request model to be applied
 */
function applyRequestModel(request,requestModel)
{
	CancelPlannedTasks(request);
    copyModelFields(request,requestModel);
    applyTemplate(request,requestModel);

	// change to first phase
	request["current.phase"] = getFirstPhase(requestModel.category);
    request.doAction("save");
} 

/** 
 * Introduction:Apply company and folder value when create new request
 * Date:20140818
 *
 * @param request The target request ticket.
 */
function setInitCompanyAndFolder(request)
{
  //[$G.folderEntitlement]=true
  //[$G.multi]=true
  if (!vars.$G_bg)
  {
	if (vars.$G_multi && (request.company == null || request.company == ""))
	{
	  request.company = vars.$lo_company;
	}
	if (vars.$G_folderEntitlement && (request.defaultFolder == null || request.defaultFolder == ""))
	{
      var operator = funcs.operator();
      var op = new SCFile("operator" , SCFILE_READONLY);
      var query = "name=\""+ operator +"\"";
      var queryFieldList=["defaultFolder"];
      op.setFields(queryFieldList);
      var scFind = op.doSelect(query);
      if (scFind === RC_SUCCESS){
        request.folder = op.defaultFolder;
      }
	}
  }
}


/*
 * Introduction:Automatically cancel planned tasks while applying request model.
 * @param request The target request ticket.
 */
function CancelPlannedTasks(request)
{
	var planTask = new SCFile("requestTask");
	var rc= planTask.doSelect("parent.request=\""+request.number+"\" and status=\"Planned\""); 
	var closurecode="9";
	var closurecomments=funcs.scmsg(13, "requestModel");
	while(rc==RC_SUCCESS) {
		planTask.closure_code = closurecode;
	    planTask.closure_comments=closurecomments;
	    planTask.current_phase="Cancelled";
	    planTask.status="Cancelled";
	    planTask.open=false;
	    planTask.doAction("save");
		rc = planTask.getNext();
	}
}

/*
 * Introduction:Get the first phase of workflow by category.
 * @param category The category for request.
 * @return The first phase of workflow of this category.
 */
function getFirstPhase(category) {
	var firstPhase = null;
	var cat = new SCFile("rmCategory", SCFILE_READONLY);
		cat.setFields(["workflow"]);
	var rc1= cat.doSelect("name=\""+ category +"\"");
	if (rc1==RC_SUCCESS) {	
		var workflow = new SCFile("Workflow", SCFILE_READONLY);
		workflow.setFields(["firstPhase"]);
		var rc2 = workflow.doSelect("name=\""+ cat.workflow +"\"");
		if (rc2 == RC_SUCCESS) {
			firstPhase = workflow.firstPhase;
		}
	}
	
	return firstPhase;
}

/*
 * Introduction:Copy the field in request model to request.
 * @param request The target request ticket.
 * @param requestModele  The request model to be applied
 */
function copyModelFields(requestFile, modelFile)
{ 
  requestFile.category=modelFile.category;
  requestFile.subcategory=modelFile.subcategory;
  requestFile.model=modelFile.id;
  requestFile.modelname=modelFile.name;
  requestFile.total_cost=modelFile.cost;
  requestFile.cost_currency_code =modelFile.cost_currency_code; 
  requestFile.bill_to_dept=modelFile.department;
  requestFile.company=modelFile.company;
  requestFile.folder=modelFile.folder;
  
  requestFile.global_lead_time=modelFile.global_lead_time;
}

/*
 * Introduction:Apply request Model's templates to request.
 * @param request The target request ticket.
 * @param requestModele  The request model to be applied
 */
function applyTemplate(request, requestModel) {
	var templates = requestModel.request_template;
	var lng = funcs.lng( funcs.denull(templates ) );
	if ( lng == null ) {
		lng = 0;
	}

    var i;	
	for ( i = 0; i < lng; i++ ) {
		var templateName = templates[i];
		var template = new SCFile("Template");
		var ret = template.doSelect('name="' + templateName +'" and tablename="request"');
		if (ret == RC_SUCCESS) {
			lib.Template.applyTemplate(request, template, false);
		}
	}
}

/* 
 * Introduction:Apply request model to request which will be called by RAD apply.requestModel
 * Date:2014018
 * Author:xiaoning.li 
 *
 * @param request The target request ticket.
 * @param requestModele  The request model to be applied
 */  
 function buildRequestModelQuery(oldModelID,filtertext) 
 {  var q1= lib.RequestUtil.buildArrayStringQuery(system.vars.$G_role,"security.role");
    var queryrole= "(security.role={} or "+q1+")";
    var query=queryrole + " and active=true";
  
     // check if category are in allowed category list;
    var catrights=lib.security.getToken("Request", "allowedCategory");
	if (catrights.length()>0)
   { 
    var querycategory=lib.RequestUtil.buildArrayStringQuery(catrights, "category"); 
    query+=" and "+querycategory; 
    } 
    
    if(oldModelID!=null && oldModelID!="")
    {
    query+=" and id ~=\""+oldModelID+"\"";
    }
    
    if(filtertext!=null && filtertext!="")
    {var filter=funcs.val(lib.QueryHelper.querySafe(filtertext),2);
    query+=" and (tolower(name) like "+"\"*"+filter.toLowerCase()+"*\""+" or tolower(description) like"+"\"*" +filter.toLowerCase()+"*\")";
    }
    
    return query;
 }
       

/* 
 * Introduction:Return the sort by fields list for query request model which is called by RAD apply.requestModel
 */
function getRequestModelSortby() 
{   var sortfields= ["name","id"];
    return sortfields;
}
  
  
/**
 * Function: Check whether a request model is valid based on the id, name ,category and subcategory.
 * @param requestModel {String} request model id
 * @param requestModelName {String} request model name
 * @param category {String} 
 * @param subcategory {String} 
 * @return {boolean}
 */
function isRequestModelValid(requestModel, requestModelName, category, subcategory)
{
	if(requestModel != null && requestModel != "" && requestModelName != null && requestModelName != "")
	{
		var file = new SCFile("requestModel", SCFILE_READONLY);
		file.setFields(["id"]);
		var query = "id=\"" + requestModel + "\"" + " and active=true";
		query += getCondition("name", requestModelName);
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
 * Function: Get Request Model ID by name
 * @param Request Model name
 * @returns RequestModel ID
 */
 
function getRequestModleID(requestModelName) {
   if(requestModelName != null && requestModelName != "")
	{
		var file = new SCFile("requestModel",SCFILE_READONLY);
		file.setFields("id");
		var query = "name=\"" + requestModelName + "\"";
		if(RC_SUCCESS==file.doSelect(query))
		{
		    var requestModel=file.id;
			return requestModel;
		}
	}
		
   return null;
}	
   
/**
 * Function: return approvals defined in request model for specific phase.
 * @param fieldName {String} request model id
 * @param fieldValue {String} phase name
 * @return {Array}
 * @private 
 */     
function getApprovalDefbyPhase(requestModel, phaseName) { 

	var file = new SCFile("requestModel",SCFILE_READONLY);	 
	file.setFields("approvals");
		
	var query = "id=\"" + requestModel + "\"";
	var approvals = [];
	
	var  rc =  file.doSelect(query);
	
	if (rc == RC_SUCCESS && file.approvals!=null) {
		
		var length =file.approvals.length();
		
		for(i=0; i<length; i++) {
		
			if (file.approvals[i].approval_phase == phaseName) {
			
				approvals.push(file.approvals[i].approval_def);
			
			} 
	   }
	
	}   
 	return approvals; 
}


/*
 * Introduction:Copy task planner related information while copying request model.
 * @param oldmodelid The source request model id.
 * @param newmodelid The target request model id.
 */
function copyModelTaskPlanner(oldmodelid,newmodelid)
{
	copyTicketContextConfig(oldmodelid,newmodelid);
	copyChangePlan(oldmodelid,newmodelid);
}

 
function copyTicketContextConfig(oldmodelid,newmodelid)
{
	var contextConfig=new SCFile("ticketContextConfig");
	var fileName="requestModel";
	var query="fileId=\""+oldmodelid+"\" and fileName=\""+fileName+"\"";
	var rc=contextConfig.doSelect(query);
	while (rc== RC_SUCCESS){
    	contextConfig.fileId=newmodelid; 
    	contextConfig.doInsert();
    	rc = contextConfig.getNext();
    }
 }
 
  
function copyChangePlan(oldmodelid,newmodelid)
{
	var changePlan=new SCFile("changePlan");
	var fileName="requestModel";
	var query="number=\""+oldmodelid+"\" and fileName=\""+fileName+"\"";
	var rc=changePlan.doSelect(query);
	if (rc== RC_SUCCESS){
    	changePlan.number=newmodelid; 
    	changePlan.doInsert();
    }
}
