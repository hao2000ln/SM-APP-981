/****************************************************************
*  Functions used to maintain the Process Designer enablement related functions*
*  Author: Shu Shiji(shiji.shu@hp.com)
 *  Date:2013/10/09
*  Update:
*  Version:0.2
****************************************************************/

var $ = lib.c.$;


/** This method is used to enable the Process Designer on ChangeManagementModule , Help Desk module and Request Management Module
*
*/
function enableProcessDesigner(purgeFlag) {
    lib.ProcessDesignHelpDeskEnableManager.enablePDHelpDesk(purgeFlag);
    lib.ProcessDesignerChangeEnableManager.enableChangeManagement(purgeFlag);
    lib.ProcessDesignerRequestEnableManager.enablePDRequestManagement(purgeFlag);
    enableTaskPlannerConfigMenu();
}

function enableUpdated() {
   lib.ProcessDesignHelpDeskEnableManager.enableUpdated();
   lib.ProcessDesignerChangeEnableManager.enableUpdated();
   lib.ProcessDesignerRequestEnableManager.enableUpdated();	
}


/** This method is used to purge disabled objects during enablement process
*
*/
function purgeDisabled() {
  var disabledSuffix = "_disabled_by_PD";
  var _tagquery = funcs.tagquery;
  var _delete = funcs._delete;
  
  // purge disabled objects
  $("forcedobjects").selectAll().iterate(function(obj) {
    var filename = obj["filename"];
    var disabledtag = obj["disabledtag"];
    var file = new SCFile(filename);

    var query = new SCDatum();
    if (_tagquery(file, query, disabledtag)) {
      var disabledObj = $(filename).select(query.getValue()).uniqueResult();
      if (disabledObj != null) {
        print("Purge disabled object: " + disabledtag);
        disabledObj.doDelete();
      }
    }
    obj.doDelete();
  });
  
  // purge disabled links
  $("smpatches").select('filename="link" and action="update"').iterate(function(smpatch) {
    var link = new SCFile("link");
  	var tag = smpatch["tag"];
  	
  	var linkQuery = new SCDatum();
  	if (_tagquery(link, linkQuery, tag)) {
  		link = $("link").select(linkQuery.getValue()).uniqueResult();
  		if (link != null) {
  			var sourceFields = link["source.fields"];
  			var i;
  			var length = sourceFields.length();
  			for (i = 0; i < length; i++) {
  				var sourceField = sourceFields[i];
  				if (sourceField.indexOf(disabledSuffix) != -1) {
  					link["source.fields"] = _delete(link["source.fields"], i+1);
  					link["target.files"] = _delete(link["target.files"], i+1);
  					link["target.fields"] = _delete(link["target.fields"], i+1);
  					link["comment"] = _delete(link["comment"], i+1);
  					link["add.query"] = _delete(link["add.query"], i+1);
  					link["qbe.format"] = _delete(link["qbe.format"], i+1);
  					link["sort.fields"] = _delete(link["sort.fields"], i+1);
  					link["project.source.fields"] = _delete(link["project.source.fields"], i+1);
  					link["project.target.fields"] = _delete(link["project.target.fields"], i+1);
  					link["link.expressions"] = _delete(link["link.expressions"], i+1);
  					link["ind.link"] = _delete(link["ind.link"], i+1);
  					link["post.expressions"] = _delete(link["post.expressions"], i+1);
  					link["structure"] = _delete(link["structure"], i+1);
  					link["target.formats"] = _delete(link["target.formats"], i+1);
  					link["javascript.pre"] = _delete(link["javascript.pre"], i+1);
  					link["javascript.post"] = _delete(link["javascript.post"], i+1);
  					link["target.sort.field"] = _delete(link["target.sort.field"], i+1);
  					link["target.sort.order"] = _delete(link["target.sort.order"], i+1);
  					i--;
  					print("Purge disabled linkline: " + sourceField + " in link " + link["name"]);
  				}
  			}
  			link.doUpdate();
  		}
  	}
  });

  // purge smpatches
  $("smpatches").selectAll().iterate(function(smpatch) {
    smpatch.doDelete();
  });
}


/**
 * This method is used to check whether Process Designer has been enabled. 
 *    
 * @returns whether Service Desk management module has been enabled
 *
 */
function isPDEnabled(){
    return (isChangeEnabled() || isServicedeskEnabled() || isIncidentEnabled() || isProblemEnabled() || isRequestEnabled());
}

/** This method is used to check whether Process Designer has been enabled for Change Management module. 
*    
*     @returns whether change management module has been enabled
*
*/
function isChangeEnabled(){

  if (vars.$G_pd_change_enabled != null ) return vars.$G_pd_change_enabled; 
  
  var obj = $("Object").select('file.name=\"cm3r\"').uniqueResult();

  if(obj["workflowLocation"] != null){
  
    vars.$G_pd_change_enabled = true;
  	
  }else {
  
  	vars.$G_pd_change_enabled = false;
    
  }
  
  return vars.$G_pd_change_enabled;

}

/** This method is used to check whether Process Designer has been enabled for Service Desk modules. 
*    
*     @returns whether Service Desk management module has been enabled
*
*/
function isServicedeskEnabled(){

  if (vars.$G_pd_sd_enabled != null ) return vars.$G_pd_sd_enabled; 
  
  var obj = $("Object").select('file.name=\"incidents\"').uniqueResult();
  
  if(obj["workflowLocation"] != null){
  
    vars.$G_pd_sd_enabled = true;
  	
  }else {
    vars.$G_pd_sd_enabled = false;
  }
  
  return vars.$G_pd_sd_enabled;

}

/** This method is used to check whether Process Designer has been enabled for Incident Management modules. 
*    
*     @returns whether incident management module has been enabled
*
*/
function isIncidentEnabled(){

  if (vars.$G_pd_im_enabled != null ) return vars.$G_pd_im_enabled; 
  
  var obj = $("Object").select('file.name=\"probsummary\"').uniqueResult();
  
  if(obj["workflowLocation"] != null){
  
    vars.$G_pd_im_enabled = true;
  	
  }else {
    vars.$G_pd_im_enabled = false;
  }
  
  return vars.$G_pd_im_enabled;

}

/** This method is used to check whether Process Designer has been enabled for Problem Management modules. 
*    
*     @returns whether problem management module has been enabled
*
*/
function isProblemEnabled(){

  if (vars.$G_pd_pm_enabled != null ) return vars.$G_pd_pm_enabled; 
  
  var obj = $("Object").select('file.name=\"rootcause\"').uniqueResult();
  
  if(obj["workflowLocation"] != null){
  
    vars.$G_pd_pm_enabled = true;
  	
  }else {
    vars.$G_pd_pm_enabled = false;
  }
  
  return vars.$G_pd_pm_enabled;

}

/** This method is used to check whether Process Designer has been enabled for Request Management modules. 
*    
*     @returns whether request module has been enabled
*
*/
function isRequestEnabled(){

  if (vars.$G_pd_request_enabled != null) return vars.$G_pd_request_enabled; 
  
  var obj = $("Object").select('file.name=\"request\"').uniqueResult();
  
  if(!obj) {  
	vars.$G_pd_request_enabled = false;    
  }else{
  	vars.$G_pd_request_enabled = true;
  }
  
  return vars.$G_pd_request_enabled;

}

/** This method is used to identify whether non-PD Request and PD Request modules run in parallel after the PD Request is enabled.
 *    
 *  @returns whether non-PD Request and PD Request modules run in parallel.
 *
 */
function isNonPDRequestInParallel() {
	if (vars["$G.nonpd.request.in.parallel"] != null) {
	    return vars["$G.nonpd.request.in.parallel"];
	}

	// please do NOT un-commnet below line if you don't want the non-PD and PD Request modules run in parallel
	// by default always return false
	//vars["$G.nonpd.request.in.parallel"] = true;
	return vars["$G.nonpd.request.in.parallel"];
}

/** This method is used to set whether hybrid migrated workflow is used
 *
 *
 */
function setMigratedWorkflowUsed(filename, categoryName, isMigrated) {

    var key = "$G.ismigrated." + (filename + categoryName).replace(/ /g, "");
    var keyTime = key + ".time";    
    vars[key] = isMigrated;
    vars[keyTime] = Date.now();
}

/** This method is used to identify whether hybrid migrated workflow is used
 *
 *  @returns whether migrated workflow is used
 *
 */
function isMigratedWorkflowUsed(filename, categoryName) {
    var key = "$G.ismigrated." + (filename + categoryName).replace(/ /g, "");
    var keyTime = key + ".time";
    var isMigrated = vars[key];    
    if (isMigrated == null || (Date.now() - vars[keyTime]) > 120000) {        
        var sql = "file.name=\"" + filename + "\"";
        var object = $("Object", SCFILE_READONLY).setFields(["category.file.name"]).select(sql).uniqueResult();
        if (object == null) {
            return false;
        }

        var categoryFile = object['category.file.name'];
        if (categoryFile == null) {
            return false;
        }

        sql = "name=\"" + categoryName + "\"";
        var category = $(categoryFile, SCFILE_READONLY).setFields(["workflow"]).select(sql).uniqueResult();
        if (category == null) {
            return false;
        }

        var workflowname = category['workflow'];
        if (workflowname == null) {
            return false;
        }

        sql = "name=\"" + workflowname + "\" and tableName=\"" + filename + "\"";
        var workflow = $("Workflow", SCFILE_READONLY).setFields(["is.legacy.workflow"]).select(sql).uniqueResult();
        isMigrated = workflow && workflow['is.legacy.workflow'] == true;
        vars[key] = isMigrated;
        vars[keyTime] = Date.now();
    }

    return isMigrated;
}

/** This method is used to get the list of disabled security areas
*
*/
function getDisabledSecurityArea()
{
	var arrDisabledSecArea = [];
	if(isChangeEnabled()==false){
	  arrDisabledSecArea=arrDisabledSecArea.concat(["Change","Change Management Configuration","Change Tasks"]);  		
	}
	
	if(isIncidentEnabled() == false){
	  arrDisabledSecArea=arrDisabledSecArea.concat(["Incident","Incident Management Configuration","Incident Tasks"]);  		
	}
	
	if(isProblemEnabled() == false){
	arrDisabledSecArea=arrDisabledSecArea.concat(["Problem","Problem Management Configuration","Problem Tasks"]);
	}
	
	if(isServicedeskEnabled() == false){
	  arrDisabledSecArea=arrDisabledSecArea.concat(["Service Desk","Service Desk Configuration"]);  		
	}
	
	if(isRequestEnabled() == false){
	  arrDisabledSecArea=arrDisabledSecArea.concat(["Request","Request Management Configuration","Request Tasks"]);  		
	}
	if(arrDisabledSecArea.length==0)
	{
		arrDisabledSecArea = null;
	}
	return arrDisabledSecArea;
}


/**
function isChangeSecurityEnabled(){


}

function isHelpdeskSecurityEnabled(){


}
*/
function enableProcessDesignerChangeManagment(){

//TODO

}

function enableProcessDesignerRequestManagment(){

//TODO
}

/** 
*	This function checks whether the file use role based access
*
*/
function isRoleBasedAccessFile(filename)
{	
 	var obj = $("Object", SCFILE_READONLY).select("file.name=\""+filename+"\"").uniqueResult();  
  	if(obj!=null && obj["profile.appl"] == "secRoleBasedAccess"){
  		return true;
  	}
  	
  	return false;  

}
/** This method is used to Enable Common Task Planner configuration menu items of Pre-defined Task Fields and Task Planner Mapping
*
*/

function enableTaskPlannerConfigMenu(){
	var menuToBeModified="TAILORING";
	var menuToBeReplaced="NONE PD CONF MENU";
	var menuToBeUsed="PD CONF MENU";
		
	var menu=new SCFile("menu");
	var sql="name=\""+menuToBeModified+"\"";
	if(menu.doSelect(sql)===RC_SUCCESS){
		print("Start enabling Common Task Planner configuration menu items...");
		var oldMenu = new SCFile("menu");
        vars.$L_void=funcs.fduplicate(oldMenu, menu);
		
		var i;
		var length = menu['pvalue'].length(); 
		for(i=0;i<length;i++){
			if(menu['pvalue'][i]===menuToBeReplaced){
				menu['pvalue'][i]=menuToBeUsed;
				break;
			}
		}
		menu.doUpdate();
		lib.ProcessDesignHelpDeskEnableManager.addSMPatches(menu, oldMenu, "menu;" + menuToBeModified, "update");
		print("Finish enabling Common Task Planner configuration menu items");
	}
}