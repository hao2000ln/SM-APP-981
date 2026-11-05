

function initDefaultParameter(fileName)
{
  vars["$L.selectmodel.screenid"]  = "selectModel.new";
  vars["$L.selectmodel.qbeformat"] = "selectModel4New.display.qbe";

  if ("request"==fileName) {
    vars["$L.model.filename"]    = "requestModel";
    vars["$L.area.name"]         = "Request";
    vars["$L.category.filename"] = "rmCategory";
    vars["$L.selectmodel.screenid"] = "request.selectRequestModel";
    vars["$L.selectmodel.qbeformat"]    = "requestModel.display.qbe";
  } else if ("probsummary"==fileName) {
    vars["$L.model.filename"]    = "incidentModel";
    vars["$L.area.name"]         = "Incident";
    vars["$L.category.filename"] = "imCategory";
    //vars["$L.selectmodel.screenid"] = "incident.selectIncidentModel";
    //vars["$L.selectmodel.qbeformat"]    = "incidentModel.display.qbe";
  }
  
}

function setupModelSQL(fileName)
{
  vars["$L.sort"]  = getModelSortby(fileName);
  vars["$L.group"] = getModelGroupFields(fileName);
  vars["$L.sql"]   = buildRequestModelQuery(vars["$L.request"].model, vars["$modelfilter"]);
}

function getModelSortby(fileName) 
{
  if ("request"==fileName) {
    return ["name","id"];
  }

  return ["name","id"];
}

function getModelGroupFields(fileName)
{
  return [];
}

function buildRequestModelQuery(oldModelID, filtertext)
{
  var query = "(security.role={} or " + lib.RequestUtil.buildArrayStringQuery(vars["$G.role"],"security.role") + ") and active=true";

  // check if category are in allowed category list;
  var catrights = lib.security.getToken(vars["$L.area.name"], "allowedCategory");
  if (catrights.length()>0) {
    query += " and " + lib.RequestUtil.buildArrayStringQuery(catrights, "category");
  }

  if(oldModelID!=null && oldModelID!="") {
    query += " and id ~=\""+oldModelID+"\"";
  }

  if(filtertext!=null && filtertext!=""){
    var filter = system.functions.val(lib.QueryHelper.querySafe(filtertext),2).toLowerCase();
    query += " and (tolower(name) like \"*" + filter + "*\" or tolower(description) like \"*" + filter + "*\")";
  }

  return (query);
}

function copyModelFields(pFile, pModelFile)
{
  if ("request"==vars["$L.filename"]) {
    pFile.category   = pModelFile.category;
    pFile.subcategory= pModelFile.subcategory;
    pFile.model      = pModelFile.id;
    pFile.modelname  = pModelFile.name;
    pFile.total_cost = pModelFile.cost;
    pFile.cost_currency_code = pModelFile.cost_currency_code;
    pFile.bill_to_dept     = pModelFile.department;
    pFile.company          = pModelFile.company;
    pFile.folder           = pModelFile.folder;
    pFile.global_lead_time = pModelFile.global_lead_time;
  } else if ("probsummary"==vars["$L.filename"]) {
    pFile.category   = pModelFile.category;
    pFile.subcategory= pModelFile.subcategory;
    pFile.model      = pModelFile.id;
    pFile.modelname  = pModelFile.name;
    pFile.company          = pModelFile.company;
    pFile.folder           = pModelFile.folder;
  }
}

function setInitCompanyAndFolder(pFile)
{
  //[$G.folderEntitlement]=true
  //[$G.multi]=true
  //if (!vars.$G_bg && ("request"==vars["$L.filename"])) {
  if (!vars.$G_bg) {
	if (vars.$G_multi && (pFile.company == null || pFile.company == "")) {
	  pFile.company = vars.$lo_company;
	}

	if (vars.$G_folderEntitlement && (pFile.defaultFolder == null || pFile.defaultFolder == "")) {
      var op = new SCFile("operator" , SCFILE_READONLY);
      var query = "name=\""+ system.functions.operator() +"\"";
      op.setFields(["defaultFolder"]);

      if (op.doSelect(query) === RC_SUCCESS){
        pFile.folder = op.defaultFolder;
      }
	}
  }
}



