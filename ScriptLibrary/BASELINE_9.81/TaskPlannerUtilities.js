var $ = lib.c.$;

/**
*  This function is to get task plan mapping information from taskPlannerMapping table.
*    
*  @param {String} parentFileName - The Module(cm3r/request) file name.
*  @param {String} type - "Model"/"Task".
*  @return the String of table name.
*/
function getTableNameByParentFileName(parentFileName,type){
    var tableName="";
    var sql="parentFileName=\""+parentFileName+"\"";
    var taskPlannerMapping= $.cachedSelect("taskPlannerMapping", sql);
    if(taskPlannerMapping != null)
    {
      if(type==="Model"){
        tableName=taskPlannerMapping.modelFileName;
      }
      else{
        tableName=taskPlannerMapping.taskFileName;
      }
    }

    return tableName;
}

/**
*  This function is to get task plan mapping information from taskPlannerMapping table.
*    
*  @param {String} taskFileName - The Module(cm3t/requestTask) file name.
*  @param {String} type - "Model"/"Module".
*  @return the String of table name.
*/
function getTableNameByTaskFileName(taskFileName,type){
    var tableName="";
    var sql="taskFileName=\""+taskFileName+"\"";
    var taskPlannerMapping=$.cachedSelect("taskPlannerMapping", sql);
    
    if(taskPlannerMapping != null){
        if(type==="Model"){
            tableName=taskPlannerMapping.modelFileName;
        }
        else{
            tableName=taskPlannerMapping.parentFileName;
        }
    }
    return tableName;
}

/**
*  This function is to get table unique key from datadict.
*    
*  @param {String} tableName - Service Manager file name.
*  @return the String of unique key.  
*/
function getUniqueKey(tableName){
    var uniqueKey="";
    var tempKey="";
    var sql="name=\""+tableName+"\"";
    var dataDict=$.cachedSelect("datadict", sql);
    
    if(dataDict != null){
        tempKey=dataDict.unique_key[0];
        var tempArray=[];
        tempArray=tempKey.split(",");
        uniqueKey=tempArray[tempArray.length-1];
    }
    return uniqueKey;
}

/**
*  This function is to get task template name from task category table.
*    
*  @param {String} taskFileName - Task file name.
*  @param {String} category - Task category.
*  @return the String of template name.  
*/
function getTaskTemplateFromCategory(taskFileName,category){
    var template="";
    var obj=new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["category.file.name"]);
    var sql="file.name=\""+taskFileName+"\"";
    if(obj.doSelect(sql)===RC_SUCCESS){
        var taskCatFile=obj.category_file_name;
        if(""!==taskCatFile || null!==taskCatFile){
        	
        	// request task category doesn't have template
        	if (taskCatFile == "rmTaskCat") {
        		return "";
        	}
        	 
            var cat=new SCFile(taskCatFile, SCFILE_READONLY);
            cat.setFields(["default.template"]);
            var catSql="name=\""+category+"\"";
            if(cat.doSelect(catSql)===RC_SUCCESS){
                template=cat.default_template;
            }
        }
    }
    return template;    
}

/**
*  This function is to get the Number record name from Object table for generate ticket id purpose.
*    
*  @param {String} fileName - Service Manager file name.
*  @return the String of the Number record name.  
*/
function getNumbeRecordName(fileName){
    var numberRecordName="";
    var obj=new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["number.record"]);
    var sql="file.name=\""+fileName+"\"";
    if(obj.doSelect(sql)===RC_SUCCESS){
        numberRecordName=obj.number_record;
    }
    return numberRecordName;    
}

/**
*  This function is to get the workflow name.
*    
*  @param {String} fileName - Service Manager file name.
*  @param {String} category - Object category name.
*  @return the String of the workflow name.  
*/
function getWorkFlow(fileName,category){
    var workflow="";
    var obj=new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["workflow","workflowLocation", "category.file.name"]);
    var sql="file.name=\""+fileName+"\"";
    if(obj.doSelect(sql)===RC_SUCCESS){
        if(obj.workflowLocation==="object"){
            workflow=obj.workflow;
        }
        else{
            var catFile=obj.category_file_name;
            if(""!==catFile && null!==catFile){
                var cat=new SCFile(catFile, SCFILE_READONLY);
                cat.setFields(["workflow"]);
                var catSql="name=\""+category+"\"";
                if(cat.doSelect(catSql)===RC_SUCCESS){
                    workflow=cat.workflow;
                }
            }
        }
    }
    return workflow;    
}

/**
*  This function is to get the workflow phases list ordered by phaseOrder from WorkflowPhase table.
*    
*  @param {String} fileName - Service Manager file name.
*  @param {String} workflowName - Workflow name.
*  @return the String of the workflow phase list.  
*/
function getActiveWorkFlowPhases(fileName,workflowName){
    var phases=[];
    var workflowPhase=new SCFile("WorkflowPhase", SCFILE_READONLY);
    var field = ["phaseOrder"];
    var sortOrder = [SCFILE_ASC];
    var setOrderByRC = workflowPhase.setOrderBy( field, sortOrder);
    if ( setOrderByRC !== RC_SUCCESS ){
        logInfo("Order by field 'phaseOrder' failed.");
    }
    workflowPhase.setFields(["active","phaseName"]);
    var sql = "workflowName = \"" + workflowName + "\" and tableName = \"" + fileName + "\"";
    if(workflowPhase.doSelect(sql)===RC_SUCCESS){
        do{
            if(workflowPhase.active===true){
                phases.push(workflowPhase.phaseName);
            }
        }while (workflowPhase.getNext() === RC_SUCCESS);
    }
    return phases;    
}

function getWorkFlowPhaseDescription(workflowName,fileName,phaseName){
    // get localized phase description
    var phaseDesc = lib.WorkflowLocalization.getPhaseDisplayName(workflowName, fileName, phaseName);
    if (phaseDesc) {
        return phaseDesc;
    }
    
    var workflowPhase=new SCFile("WorkflowPhase", SCFILE_READONLY);
    workflowPhase.setFields(["description"]);
    var sql="workflowName =\"" + workflowName + "\" and phaseName = \"" + phaseName + "\" and tableName=\"" + fileName + "\"";
    if(workflowPhase.doSelect(sql)===RC_SUCCESS){
        phaseDesc=workflowPhase.description;
    }
    return phaseDesc;
}

/**
*  This function is to get the ticket category.
*    
*  @param {String} id - Ticket id.
*  @param {String} fileName - Service Manager file name.
*  @return the String of the category.  
*/
function getParentCategory(id,fileName){
    var category="";
    var key=getUniqueKey(fileName);
    var sql=""+key+"=\""+id+"\"";
//    var f = $.cachedSelect(fileName, sql);
	var f = $(fileName, SCFILE_READONLY).setFields(["category"]).select(sql).uniqueResult();
    if(f != null){
        category=f.category;
    }
    return category;
}

/**
*  This function is to get the ticket current phase.
*    
*  @param {String} id - Ticket id.
*  @param {String} fileName - Service Manager file name.
*  @return the String of the current phase.  
*/
function getCurrentPhase(id,fileName){
    var currentPhase="";
    var key=getUniqueKey(fileName);
    var sql=""+key+"=\""+id+"\"";
//    var f = $.cachedSelect(fileName, sql);
	var f = $(fileName, SCFILE_READONLY).setFields(["current.phase"]).select(sql).uniqueResult();
    if(f != null){
        currentPhase=f.current_phase;
    }
    return currentPhase;
}

/**
*  This function is to get the available categories of an object.
*    
*  @param {String} fileName - Service Manager file name.
*  @return the String of the available category list.  
*/
function getAvailableCategories(fileName){
    var cats=[];
    var active="true";
    var obj=new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["category.file.name"]);
    var sql="file.name=\""+fileName+"\"";
    if(obj.doSelect(sql)===RC_SUCCESS){
        var catFile=obj.category_file_name;
        if(""!==catFile && null!==catFile){
            var cat=new SCFile(catFile, SCFILE_READONLY);
            cat.setFields(["name"]);
            var catSql="active=\""+active+"\"";
            if(cat.doSelect(catSql)===RC_SUCCESS){
                do{
                    cats.push(cat.name);
                }while(cat.getNext() === RC_SUCCESS);
            }
        }
        
    }
    return cats;    
}

/**
*  This function is to identify if the template State is "template.massupdate".
*    
*  @param {String} table - Service Manager file name.
*  @param {String} template - Service Manager template name.
*  @return true or false.  
*/
function getMassUpdateFlagByTemplateState(table,template){
    var massUpt="false";
    var temp=new SCFile("Template", SCFILE_READONLY);
    temp.setFields(["State"]);
    var sql="tablename=\""+table+"\" and name=\""+template+"\"";
    if(temp.doSelect(sql)===RC_SUCCESS){
        if(null!==temp.State&&""!==temp.State&&"template.massupdate"===temp.State){
            massUpt="true";
        }
    }
    return massUpt;
}

/**
*  This function is to get the template record.
*    
*  @param {String} table - Service Manager file name.
*  @param {String} template - Service Manager template name.
*  @return the template record.  
*/
function getTemplateObject(table,template){
    var temp=new SCFile("Template");
    var sql="tablename=\""+table+"\" and name=\""+template+"\"";
    if(temp.doSelect(sql)===RC_SUCCESS){
        return temp;
    }
    return null;
}

function checkTicketContext(fileName, fileId){
	var contextFile=new SCFile("ticketContext");
    var sql="fileId=\""+fileId+"\" and fileName=\""+fileName+"\"";
    if(contextFile.doSelect(sql)!== RC_SUCCESS){
        contextFile.fileName=fileName;
    	contextFile.fileId=fileId;
    	contextFile.doSave();
    }
}

function getTaskStatusField(taskFileName){
    var field="";
	var sql="taskFileName=\""+taskFileName+"\"";
	var taskplmap=$.cachedSelect("taskPlannerMapping", sql);
	
	if(taskplmap != null){
		field=taskplmap.taskStatusField;
	}
	else{
		logInfo("Can not find Task Planner Mapping record for task table "+taskFileName);
	}
	return field;
}

/**
 *  This function is to get the model id by ticket file name and id.
 *  Here we assume the ticket file contains the field "modelId".
 *    
 *  @param {String} fileName - Service Manager file name.
 *  @param {String} id - Service Manager template name.
 *  @return the modelId .  
 */
function getModelIdByTicketID(fileName, id) {
  var value = getSimpleCacheValue(fileName, fileName+";"+id);
  if( value !== undefined)
  {
    return value;
  }
  
  var query = lib.DBUtils.getQueryByTag(fileName + ";" + id);
  var file = new SCFile(fileName, SCFILE_READONLY);
  var queryFieldList = ["modelId"];
  file.setFields(queryFieldList);
  
  if(file.doSelect(query)=== RC_SUCCESS) {
    setSimpleCacheValue(fileName, fileName+";"+id, file.modelId);
	return file.modelId;
  }
  
  return null;
}

function logInfo(info){
    var log=getLog("TaskPlannerUtilities");
    if(log.isInfoEnabled()){
        log.info(info);
    }
}
