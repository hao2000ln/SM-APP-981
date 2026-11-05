/**
 * See {@link module:c}
 * 
 * @private
 * @method
 */

var $ = lib.c.$;

var IMPLMT = lib.TaskPlannerRemoteServiceImplementation;

/**
 * @class TaskPlannerRemoteService.
 * @classdesc Handles functionality associated with common task planner, used by WebTier call.
 */

var TaskPlannerRemoteService = $({
  readGraph: function(id, editorType, parentFile) {
      // QCCR1E116139, add security check to avoid security attack, this will be refined in later version after RTE and Client have a better solution
	  if(system.functions.index("SysAdmin", vars["$lo.ucapex"])>0) {
	    // ignore security if SysAdmin
	  } else if((parentFile==="request" && lib.security.getRights("Request", "view")!=="true" && lib.security.getRights("Request Management Configuration", "view")!=="true")
	   || (parentFile==="cm3r" && lib.security.getRights("Change Management Configuration", "view")!=="true"
	       && lib.security.getRights("Change", "view")!=="true")) { // only check the view rights to keep consistent as front end
	  	var resp = {};
   	    resp.error=true;
   	    resp.errorMessage="You are not authorized to save the Task Planner!";

   	    return resp;
	  }

      return IMPLMT.readGraph(id, editorType, parentFile);
  },

  getPreDefinedTaskFields: function(fileName, taskCategory) {
      return IMPLMT.getPreDefinedTaskFields(fileName, taskCategory);
  },

  getRecords: function(file, field, queryEditorQuery,start, count,inputQuery) {
      return IMPLMT.getRecords(file, field, queryEditorQuery,start, count,inputQuery);
  },

  /**
   * This function saves task plan information into changePlan table for both Model and Ticket level.
   * 
   * @param {Strinig}
   *          editorType - model or ticket.
   * @param {Strinig}
   *          taskXml - Planned task info in Task Planner Editor returned from Web Client.
   */
  saveTaskPlan: function(editorType, parentFileName, taskXml) {
      // QCCR1E116139, add security check to avoid security attack, this will be refined in later version after RTE and Client have a better solution
	  if(system.functions.index("SysAdmin", vars["$lo.ucapex"])>0) {
	    // ignore security if SysAdmin
	  } else if((parentFileName==="request" && lib.security.getRights("Request", "editTaskPlanner")!=="true")
	   || (parentFileName==="cm3r" && lib.security.getRights("Change Management Configuration", "view")!=="true"
	       && lib.security.getRights("Change", "view")!=="true")) { // only check the view rights to keep consistent as front end
	  	var resp = {};
   	    resp.error=true;
   	    resp.errorMessage="You are not authorized to save the Task Planner!";

   	    return resp;
	  }

      return IMPLMT.saveTaskPlan(editorType, parentFileName, taskXml);
  },
  /**
   * This function returns the RuleSet list of Assignment type.
   * 
   * @param {String}
   *          parentFileName - Module(cm3r/request) table name.
   * @return the RuleSet list.
   */
  getAssignmentRuleSets: function(parentFileName) {
    return IMPLMT.getAssignmentRuleSets(parentFileName);
  },
  /**
   * This function returns the task category and related Module phase list.
   * 
   * @param {String}
   *          id - Parent file id for ticket editor type, or model id for ticket model type.
   * @param {String}
   *          editorType - ticket or model.
   * @param {String}
   *          parentFileName - Module(cm3r/request) file name.
   * @return the category and available phase list.
   */
  /**
   * This function returns the Task template list. Paramater of firstResult and maxResults needs to be handled in the future.
   * 
   * @param {String}
   *          parentFileName - Module(cm3r/request) table name.
   * @param {String}
   *          firstResult - 0.
   * @param {String}
   *          maxResults - 10.
   * @return the template list.
   */
  getTaskTemplates: function(parentFileName, start, count, query) {
    return IMPLMT.getTaskTemplates(parentFileName, start, count, query);
  },
  /**
   * This function is to validate ticket and phase info during planning tasks within task editor.
   * 
   * @param {String}
   *          id - The parent file id for ticket type, or model id for model type.
   * @param {String}
   *          editorType - ticket or model.
   * @param {String}
   *          parentFileName - Module(cm3r/request) table name.
   * @param {String}
   *          startPhase - Module(cm3r/request) workflow phase.
   * @param {String}
   *          endPhase - Module(cm3r/request) workflow phase.
   * @return true or false.
   */
  validateTicketOrEndPhase: function(id, editorType, parentFileName, startPhase, endPhase) {
    return IMPLMT.validateTicketOrEndPhase(id, editorType, parentFileName, startPhase, endPhase);
  },
  /**
   * This function returns the phase list that is after StartPhase(including StartPhase).
   * 
   * @param {String}
   *          pareFileCategory - Module(cm3r/request) category.
   * @param {String}
   *          parentFileName - Module(cm3r/request) file name.
   * @param {String}
   *          taskCategory - Task(cm3t/requestTask) category.
   * @param {String}
   *          startPhase - Module(cm3r/request) workflow phase.
   * @return the phase list.
   */
  getEndPhaseList: function(parentCategory, parentFile, taskCategory, startPhase) {
    return IMPLMT.getEndPhaseList(parentCategory, parentFile, taskCategory, startPhase);
  },
  /**
   * This function gets task fields from datadict/dbdict
   * 
   * @param {String}
   *          parentFileName - Moduel file name (cm3r/request etc.)
   * @return the field list.
   */
  getAdditionalTaskFields: function(parentFileName) {
    return IMPLMT.getAdditionalTaskFields(parentFileName);
  },
  /**
   * This function returns ticket context fields from ticketContextConfig table
   * 
   * @param {String}
   *          id - The parent file id for ticket type, or model id for model type.
   * @param {String}
   *          editorType - ticket or model.
   * @param {String}
   *          parentFileName - Module(cm3r/request) table name.
   * @return the field list.
   */
  getTicketContextFields: function(id, editorType, parentFileName) {
    return IMPLMT.getTicketContextFields(id, editorType, parentFileName);
  },
  /**
   * This function gets parent file fields from datadict/dbdict
   * 
   * @param {String}
   *          parentFileName - Moduel file name (cm3r/request etc.)
   * @return the field list.
   */
  getParentFileFields: function(parentFileName) {
    return IMPLMT.getParentFileFields(parentFileName);
  },
  getUserOptionFields: function(id, editorType, parentFileName) {
    return IMPLMT.getUserOptionFields(id, editorType, parentFileName);
  },
  getOOFlowConfigurationItem: function(id, editorType, parentFileName) {
    return IMPLMT.getOOFlowConfigurationItem(id, editorType, parentFileName);
  },
  isOOFlowEnabled: function(parentFileName) {
    return IMPLMT.isOOFlowEnabled(parentFileName);
  },
  getAvailableTaskCategories: function(parentFileName, start, count, query,editorType, id, parentCategory) {
    return IMPLMT.getAvailableTaskCategories(parentFileName, start, count, query,editorType, id, parentCategory);
  },
  getAvailablePhases: function(id, editorType, parentFileName, taskCategory, openInPhase, parentCategory) {
    return IMPLMT.getAvailablePhases(id, editorType, parentFileName, taskCategory, openInPhase,parentCategory);
  },
  getSuggestedMaxTaskNumber: function(){
  	return IMPLMT.getSuggestedMaxTaskNumber();
  }
});

function getClass() {
  return TaskPlannerRemoteService;
}
