/******************************************************
* Module Name: SMBSM Outage Manager
* Function: manager interface
* Author: Ling, Er-Li
* Version: 1.00
* Creation Date: 2012/06/11
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var SMBSMOutageManagerClass = Class.create({

  /** This method is used to initialize the SMBSMOutageManager
  * @param configItem - the configration instance for SMBSM_OUTAGEMANAGE integration
  * @return void
  */
  initialize: function(configItem) {
  	this.configItem = configItem;
  	if (this.configItem != null) {
  		this.validateFinalApprovalPhase();
  	}  	
    this.intId = this.configItem.intId;
    var adapter1Name = this.configItem.SMAdapter;
    this.SMAdapter = new (lib[adapter1Name].getClass())(this.configItem);
    var adapter2Name = this.configItem.EPAdapter;
    this.EPAdapter = new (lib[adapter2Name].getClass())(this.configItem);
  },
  
  /** This method is used to set the isScheduleBased flag into true
  * @return true
  * @type Boolean
  */
  isScheduleBased: function() {
  	return true;
  },
  
  /** This method is used to set the PDWorkflowAndPhasePairs from WorkflowPhase table
  *	@return void
  */
  setPDWorkflowAndPhasePairs: function() {
  	this.PDWorkflowPhasePairs = new Object();
  	var PDWorkflowList = new Array();
  	var PDPhaseStr = '';
  	var workflow = '';
  	var phase = '';
  	
  	var workflowPhase = new SCFile("WorkflowPhase");
  	var sql = "tableName=\"cm3r\" or tableName=\"cm3t\"";
  	var rc = workflowPhase.doSelect(sql);
  	while ( rc == RC_SUCCESS ) {
  		workflow = workflowPhase.workflowName;
  		phase = workflowPhase.phaseName;
  		if (phase == null) {
  			phase = '';
  		}
  		
  		if (lib.ArrayUtil.contains(PDWorkflowList,workflow)) {
  			PDPhaseStr = this.PDWorkflowPhasePairs[workflow]+';'+phase;
  			this.PDWorkflowPhasePairs[workflow] = PDPhaseStr;
  		} else {
  			PDWorkflowList.push(workflow);
  			this.PDWorkflowPhasePairs[workflow] = phase;
  		}
  		rc = workflowPhase.getNext();
  	} 	
  },
  
  /** This method is used to set the setNonPDCategoryAndPhasePairsForChange from cm3rcategory table
  *	@return void
  */
  setNonPDCategoryAndPhasePairsForChange: function() {
  	this.NonPDWorkflowPhasePairsForChange = new Object();
  	var name = '';
  	var phases = '';
  	
  	var cm3rcategory = new SCFile("cm3rcategory");
  	var sql = "true";
  	var rc = cm3rcategory.doSelect(sql);
  	while ( rc == RC_SUCCESS ) {
  		name = cm3rcategory.name;
  		phases = cm3rcategory.phases;
  		if (phases != null) {
  			phases = phases.join(';');
  		} else {
  			phases = '';
  		}
  		this.NonPDWorkflowPhasePairsForChange[name] = phases;  		
  		rc = cm3rcategory.getNext();
  	}	
  },
  
  /** This method is used to set the setNonPDCategoryAndPhasePairsForTask from cm3tcategory table
  *	@return void
  */
  setNonPDCategoryAndPhasePairsForTask: function() {
  	this.NonPDWorkflowPhasePairsForTask = new Object();
  	var name = '';
  	var phases = '';
  	
  	var cm3tcategory = new SCFile("cm3tcategory");
  	var sql = "true";
  	var rc = cm3tcategory.doSelect(sql);
  	while ( rc == RC_SUCCESS ) {
  		name = cm3tcategory.name;
  		phases = cm3tcategory.phases;
  		if (phases != null) {
  			phases = phases.join(';');
  		} else {
  			phases = '';
  		}
  		this.NonPDWorkflowPhasePairsForTask[name] = phases;  		
  		rc = cm3tcategory.getNext();
  	}	
  },
  
  /** This method is used to check if Workflow enabled for Change.
  * @return true or false
  */
  isWorkflowEnabledForChange: function() {
	  var Object = new SCFile("Object",SCFILE_READONLY);
	  Object.setFields(["workflowLocation"]);
	  var sql = 'file.name = "cm3r"';
	  var rc = Object.doSelect(sql); 
      return !!Object.workflowLocation;
  },
  
  /** This method is used to check if Workflow enabled for Task.
  * @return true or false
  */
  isWorkflowEnabledForTask: function() {
      var Object = new SCFile("Object",SCFILE_READONLY);
      Object.setFields(["workflowLocation"]);
      var sql = 'file.name = "cm3t"';
      var rc = Object.doSelect(sql); 
      return !!Object.workflowLocation;
  },
  
  /** This method is used to validate the final approval phase user input is correct.
  * @return void
  */
  validateFinalApprovalPhase: function() {
  		if (this.isWorkflowEnabledForChange() && this.isWorkflowEnabledForTask()) {
  			this.setPDWorkflowAndPhasePairs();
  			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Change", this.PDWorkflowPhasePairs);
			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Task", this.PDWorkflowPhasePairs);
  		} else if (this.isWorkflowEnabledForChange() && !this.isWorkflowEnabledForTask()) {
  			this.setPDWorkflowAndPhasePairs();
  			this.setNonPDCategoryAndPhasePairsForTask();
  			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Change", this.PDWorkflowPhasePairs);
			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Task", this.NonPDWorkflowPhasePairsForTask);
  		} else if (!this.isWorkflowEnabledForChange() && this.isWorkflowEnabledForTask()) {
  			this.setNonPDCategoryAndPhasePairsForChange();
  			this.setPDWorkflowAndPhasePairs();
  			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Change", this.NonPDWorkflowPhasePairsForChange);
			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Task", this.PDWorkflowPhasePairs);
  		} else {
  			this.setNonPDCategoryAndPhasePairsForChange();
  			this.setNonPDCategoryAndPhasePairsForTask();
			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Change", this.NonPDWorkflowPhasePairsForChange);
			this.checkCategoryAndPhasesPairAgainstSMISAndDB("Task", this.NonPDWorkflowPhasePairsForTask);
  		}	
  },
  
  /** This method is used to check Category and Phases Pair against SMIS params and list from DB.
  * @param smisCategory - value in SMIS configuration, Category column
  * @param categoryAndPhasePairsFromDB - this.PDWorkflowPhasePairs or this.NonPDWorkflowPhasePairsForChange or this.NonPDWorkflowPhasePairsForTask
  * @return void
  */
  checkCategoryAndPhasesPairAgainstSMISAndDB: function(smisCategory, categoryAndPhasePairsFromDB) {
  	var finalApprovalPhases = null;
  	finalApprovalPhases = this.configItem.getParametersByCategory(smisCategory);
  	if (finalApprovalPhases != null) {
  		var phases = null;
  		for (var key in finalApprovalPhases) {
  			phases = finalApprovalPhases[key] + '';
  			if (phases != null) {
  				this.IsCategoryAndPhasesPairExist(smisCategory, key, phases, categoryAndPhasePairsFromDB);
  			}
  		}
  	}
  },
  
  /** This method is used to check the category and phase pair in pair list
  * It will log error if not existed.
  * @param smisCategory - value in SMIS configuration, Category column
  *	@param category - retrive from SMIS configration, Name column 
  * @param phases - retrive from SMIS configuration, Value column
  * @param categoryAndPhasePairsFromDB - this.PDWorkflowPhasePairs or this.NonPDWorkflowPhasePairsForChange or this.NonPDWorkflowPhasePairsForTask
  * @return void
  */
  IsCategoryAndPhasesPairExist: function(smisCategory, category, phases, categoryAndPhasePairsFromDB) {
  	var phaseArray = phases.split(';');
  	var PhaseArrayFromDB = new Array();
  	if (categoryAndPhasePairsFromDB[category] != null) {
  		PhaseArrayFromDB = categoryAndPhasePairsFromDB[category].split(';');
  	}else{
        var cmcategory;
        if(smisCategory == "Change" && this.isWorkflowEnabledForChange()){
    		cmcategory = new SCFile("cm3rcategory");
        }
        if(smisCategory == "Task" && this.isWorkflowEnabledForTask()){
            cmcategory = new SCFile("cm3tcategory");
        }
        if(cmcategory != null){
            var sql = "name=\""+category+"\"";
            var rc = cmcategory.doSelect(sql);
            if ( rc == RC_SUCCESS ) {
                var workflow = cmcategory.workflow;
                if(categoryAndPhasePairsFromDB[workflow] != null){
                     PhaseArrayFromDB = categoryAndPhasePairsFromDB[workflow].split(';');
                }
            }               
        }                               
    }
  	var phase = '';
  	var errorMsg = '';
  	
  	for (var i=0; i < phaseArray.length; i++)
	{
		phase = phaseArray[i];
		if (!lib.ArrayUtil.contains(PhaseArrayFromDB,phase)) {
			var args = new Array();
			args.push(category);
			args.push(phase);
			args.push(smisCategory);
			print(system.functions.scmsg(2, "clip", args));
		}
	}
  }
});


function getClass() {return SMBSMOutageManagerClass;}