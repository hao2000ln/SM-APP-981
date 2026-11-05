/******************************************************
* Module Name: Case Exchange Manager
* Function: Manager interface
* Implementation: CaseExchange_Manager
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Dec, 2013
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var REQUIRED = ["object", "baseURL"];
var DEPENDENCE_REQUIRED = [
	{"param": "isPulling", "value": true, 
		"required": ["restPullingURL", "restListPath"]},
	{"param": "activateIncident", "value": true, 
		"required": ["title", "assignmentGroup", "impact", "urgency", "category", "subarea", "affected.service"]},
	{"param": "isPagination", "value": true, 
		"required": ["pageSize", "pageOffset","pageQuery"]}
	];
var DEPENDENCE_VALIDATION = [
	{param: "isPulling", value: true,
		validation: [{param: "timeDifference", rule:'!isNaN(this.configItem.getConfigParameterValue(valParam))', msgClass:'CaseExchange', msgNo:'13'}
		]},
	{param: "isPagination", value: true,
		validation: [{param:"pageSize", rule:'lib.IntegerUtil.isPositiveInteger(this.configItem.getConfigParameterValue(valParam))', msgClass:'CaseExchange', msgNo:'4'}, 
					 {param: "pageOffset", rule:'lib.IntegerUtil.isNormalInteger(this.configItem.getConfigParameterValue(valParam))', msgClass:'CaseExchange', msgNo:'5'}
		]},
	{param: "attachSwitch", value: true,
	validation: [{param:"attachSize", rule:'lib.IntegerUtil.isNormalInteger(this.configItem.getConfigParameterValue(valParam))', msgClass:'CaseExchange', msgNo:'6'}, 
				 {param: "attachTimeout", rule:'lib.IntegerUtil.isNormalInteger(this.configItem.getConfigParameterValue(valParam))', msgClass:'CaseExchange', msgNo:'7'}
	]}
	];

var CaseExchangeManagerClass = Class.create(lib.smis_Manager.getClass(), {

  initialize: function(configItem) {
  	this.configItem = configItem;
    this.intId = this.configItem.intId;
    
    //initial vars need by case exchange
    this.initiateVars();
    
    var adapter1Name = this.configItem.SMAdapter;
	this.SMAdapter = new (lib[adapter1Name].getClass())(this.configItem);
    var adapter2Name = this.configItem.EPAdapter;
    this.EPAdapter = new (lib[adapter2Name].getClass())(this.configItem);
    
    lib.CaseExchangeLogger.initLogger(configItem);
    this.logger = lib.CaseExchangeLogger.getLogger();
    
    this.errorAppendTask = false;
  },

  isScheduleBased: function() {
  	return true;
  },
  
  
  /**
  *	Validate the param in instance
  *
  **/
  validateParams: function() {
  	var paramCaption;
  	var value;
  	var k;
  	for (k = 0; k < REQUIRED.length; k++) {
  		value = this.configItem.getConfigParameterValue(REQUIRED[k]);
  		if (!value) {
  			paramCaption = this.configItem.getParameterCaption(REQUIRED[k]);
  			return lib.smis_CommonLib.msg("58",[paramCaption]);
  		}
  	}
  	
  	var i;
  	var j;
  	var paramValue;
  	
  	for (i = 0; i < DEPENDENCE_REQUIRED.length; i++) {
  		paramValue = this.configItem.getConfigParameterValue(DEPENDENCE_REQUIRED[i]["param"]);
  		if (paramValue == DEPENDENCE_REQUIRED[i]["value"]) {
  			for (j = 0; j < DEPENDENCE_REQUIRED[i].required.length; j++) {
  				value = this.configItem.getConfigParameterValue(DEPENDENCE_REQUIRED[i].required[j]);
  				if (!value && value != 0) {
		  			paramCaption = this.configItem.getParameterCaption(DEPENDENCE_REQUIRED[i].required[j]);
		  			return lib.smis_CommonLib.msg("58",[paramCaption]);
		  		}
  			}
  		}
  	}
  	
  	var restTargetMethods = this.configItem.getConfigParameterValue('restTargetMethods');
  	var restActionTypes = this.configItem.getConfigParameterValue('restActionTypes');
  	
  	if (restTargetMethods) {
  		paramCaption = this.configItem.getParameterCaption('restActionTypes');
  		restTargetMethods = restTargetMethods.split(lib.smis_Constants.PARAM_ARRAY_DELIMITER());
  		if (!restActionTypes) {
  			return lib.smis_CommonLib.msg("58",[paramCaption]);
  		}
  		
  		restActionTypes = restActionTypes.split(lib.smis_Constants.PARAM_ARRAY_DELIMITER());
  		for (i = 0; i < restTargetMethods.length; i++) {
  			if (!restActionTypes[i]) {
  				return lib.smis_CommonLib.msg("58",[paramCaption]);
  			}
  		}
  	}
  	
  	for (i = 0; i < DEPENDENCE_VALIDATION.length; i++) {
  		paramValue = this.configItem.getConfigParameterValue(DEPENDENCE_VALIDATION[i]['param']);
  		if (paramValue == DEPENDENCE_VALIDATION[i]["value"]) {
  			for (j = 0; j < DEPENDENCE_VALIDATION[i]['validation'].length; j++) {
  				var valParam = DEPENDENCE_VALIDATION[i]['validation'][j]['param'];
  				var rule = DEPENDENCE_VALIDATION[i]['validation'][j]['rule'];
  				if (!eval(rule)) {
  					var msgClass = DEPENDENCE_VALIDATION[i]['validation'][j]['msgClass'];
  					var msgNo = DEPENDENCE_VALIDATION[i]['validation'][j]['msgNo'];
  					return funcs.scmsg(msgNo, msgClass, []);
  				}
  			}
  		}
  	}
  	
  	return null;
  },
  
  /**
  *	Get records from end point
  *
  **/
  appendTasks: function() {
  	this.logger.debug('CaseExchangeManager', 'appendTasks');
  	try {
  		this.startTime = new Date();
  		var isPulling = this.configItem.getConfigParameterValue("isPulling");
  		//Only pulling is active, then we can pull data from end point.
  		if (isPulling)
  		{
  			this.EPAdapter.getRecords();
  		}
	  	//this.SMAdapter.getRecords();
	} catch (ex) {
		this.logger.error('CaseExchangeManager.appendTasks', ex);
		this.errorAppendTask = true;
	}
  },
  
  /**
  *	Pre process of task
  *
  **/
  preProcess: function(task) {
  	this.logger.debug('CaseExchangeManager', 'preProcess');
  	
  	var externalReferences;
  	var smRecord;
  	
  	if (lib.CaseExchange_CommonLib.isInbound(task.direction)){
  		//check externalId already exists, true: update, false: create
  		externalReferences = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(task.object, task.internalId, task.externalId, task.intId, true);
  		if (!externalReferences || !externalReferences.internalId) {
  			this.logger.debug('CaseExchangeManager', 'externalReferences not found.');
  			this.action = this.SMAdapter.createAction;
  			externalReferences = {};
  		} else {
  			this.logger.debug('CaseExchangeManager', 'externalReferences found.');
  			task.internalId = externalReferences.internalId;
  			this.action = this.SMAdapter.updateAction;
  			if (task.action && (task.action != this.SMAdapter.createAction)) {
  			    this.action = task.action;
  			}
  		}
  		smRecord = this.SMAdapter.getSMRecord(task.internalId);
  		task.internalObject = smRecord;
	  	task.action = this.action;
	  	task.externalReferences = externalReferences;
	} else {
		smRecord = this.SMAdapter.getSMRecord(task.internalId);
  		task.internalObject = smRecord;
		//retrieve external.ticket.id if this field is null and action is update
		
		externalReferences = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(task.object, task.internalId, null, task.intId, true);
		if (!externalReferences) {
			this.logger.debug('CaseExchangeManager', 'externalReferences not found.');
			externalReferences = {};
		}
		task.externalReferences = externalReferences;
		if (!task.externalId) {
			task.externalId = externalReferences.externalId;
		}
	}
	vars['$externalId'] = task.externalId;
	task.responseMsg = '';
	
  	this.obj = {};
  	return true;
  },
  
  getAction: function() {
  	return this.action;
  },
  
  getDestObj: function() {
  	
  	return this.obj;
  },
  
  /**
  * process the task in queue
  *
  **/
  process: function(task) {
  	this.logger.debug('CaseExchangeManager', 'process');
  	
  	var errorMsg;
  	var postScript;
  	var success;
  	
  	try{
	  	if (lib.CaseExchange_CommonLib.isInbound(task.direction)){ //inbound
	  		
	  		//if action is changed in mapping script, reload internalObject
	  		if (task.externalReferences.id && task.action === lib.CaseExchangeConstants.CREATE_ACTION()) {
	  			var smRecord = this.SMAdapter.getSMRecord(null);
  				task.internalObject = smRecord;
	  		}
    		
    		success = this.SMAdapter.sendRecords(task);
    		//task process successfully
			if (success) {
				try{
	    			postScript = this.configItem.getConfigParameterValue('inboundPostScript');
	    			if (postScript && postScript !== ''){
	    				this.logger.debug('CaseExchangeManager', 'process post script: ' + postScript);
	    				task.smisContext = lib.smis_CommonLib.task2Context(task, task.smisContext||{});
	    				eval('lib.' + postScript + '(task.destObject, task.outRecord, task.inRecord, task.smisContext, this.configItem.getAllParameters())');
	    			}
	    		} catch(ex) {
	    			//append error
	    			errorMsg = 'Error when doing post script: ' + ex;
	    			task.responseMsg = errorMsg;
	    			this.logger.error('CaseExchangeManager.process', errorMsg);
	    		}
	    		success = this.SMAdapter.saveAckRecords(task);
	    	}
	    	
	    	if (!success && task.externalReferences.internalId == null) {
	    		lib.CaseExchangeExternalReferencesDAO.deleteById(task.externalReferences.id);
	    	}
	  		return success;
	  	} else { //outbound
	  		this.action = task.action;

	  		success = this.EPAdapter.sendRecords(task);

	  		if (success) {
	  			try{
	  				var activityObj;
	  				postScript = this.configItem.getConfigParameterValue('outboundPostScript');
	  				if (postScript && postScript !== ''){
	  					this.logger.debug('CaseExchangeManager', 'process post script: ' + postScript);
	  					task.smisContext = lib.smis_CommonLib.task2Context(task, task.smisContext);
	    				activityObj = eval('lib.' + postScript + '(task.destObject, task.inRecord, task.outRecord, task.smisContext, this.configItem.getAllParameters())');
	    			}
	  			} catch(ex){
	  				errorMsg = 'Error when doing post script: ' + ex;
	    			task.responseMsg = errorMsg;
	    			this.logger.error('CaseExchangeManager.process', errorMsg);
	  			}
	  			success = this.SMAdapter.saveAckRecords(task);
	  		}
	  		
	  		return success;
	  	}
  	} catch(ex) {
  		if (lib.CaseExchange_CommonLib.isInbound(task.direction) && task.externalReferences.internalId == null) {
  			lib.CaseExchangeExternalReferencesDAO.deleteById(task.externalReferences.id);
  		}
  		var msgs = ex.toString();
  		task.responseMsg = msgs;
  		return false;
  	}
  },
  
  /**
  * post process
  */
  postProcess: function(task){
  	if (task.expired) {
  		this.logger.debug('CaseExchangeManager', 'create incident for error handling');
  		lib.CaseExchange_ErrorHandling.createIncidentByInstance(this.configItem, task.id);
  	}
  	vars['$externalId'] = null;
  },
  
  beforeDelInstance: function()
  {
  	var additionMsg = null;
  	
  	var task = new SCFile("SMISTaskQueue", SCFILE_READONLY);
  	task.setFields("id");
	var rc = task.doSelect("intId=\""+this.intId+"\"");
	if (rc == RC_SUCCESS)
	{
		additionMsg = funcs.scmsg( 67, "smis");
	}
	else
	{
		var reference = new SCFile("ExternalReferences", SCFILE_READONLY);
		reference.setFields("id");
		rc = reference.doSelect("smisInstanceId=\""+this.intId+"\"");
		if (rc == RC_SUCCESS)
		{
			additionMsg = funcs.scmsg( 67, "smis");
		}				
	}
  	
  	return additionMsg;
  }, 
  
  /**
  *	finaize work
  **/
  finalize: function(){
  	this.logger.debug('CaseExchangeManager', 'finalize');
  	if (!this.errorAppendTask) {
  		var timeDifference = Number(this.configItem.getConfigParameterValue('timeDifference')) * 1000;
  		this.logger.debug('CaseExchangeManager', 'time difference: ' + timeDifference);
  		if (this.startTime) {
  			this.logger.debug('CaseExchangeManager', 'start time: ' + this.startTime.getTime());
	  		var currentPullingTime = this.startTime.getTime() + timeDifference;
	  		this.logger.debug('CaseExchangeManager', 'set pulling time: ' + currentPullingTime);
  		} else {
  			currentPullingTime = Date.now() + timeDifference;
  		}
  		this.configItem.setConfigParameterValue('lastPullingTime', currentPullingTime);
  		lib.smis_ConfigurationManager.updateParam(this.configItem);
  	}
  	lib.CaseExchangeLogger.destoryLogger();
  },
  
  /**
  * Initiate variables needed by case exchange
  **/
  initiateVars: function() {
  	var lastPullingTime = this.configItem.getConfigParameterValue('lastPullingTime');
  	if (lastPullingTime && lastPullingTime != "") {
  		vars["$lastPullingDate"] = lib.tzFunctions.convertDatetoString(new Date(Number(lastPullingTime)), vars['$G.system.info']['date.order']);
  	}
  	else {
  		vars["$lastPullingDate"] = lib.tzFunctions.convertDatetoString(new Date(), vars['$G.system.info']['date.order']);
  	}
  }
});


function getClass() {return CaseExchangeManagerClass;}
