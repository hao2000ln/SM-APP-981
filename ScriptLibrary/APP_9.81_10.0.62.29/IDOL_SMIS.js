var logger = getLog('IDOL_SMIS');
function getSMISTemplateName(type) {
	if (type === 'OCR') {
		return 'SMIDOLOCR';
	} else if (type === 'IDOL') {
		return 'SMIDOL';
	} else if (type === 'AutoFill') {
		return 'SMIDOLAutoFill';
	}
	else if(type === 'HtaLda') {
		return 'HTALDA';
	}
}


/**
*	Create an SMIS Instance if SMIS Instance doesn't exist
*
*	Returun - SMIS Instance id
*	Type - number
**/
function createSMISInstance(from, type) {
	var smis = getSMISInstance(type);
	var intIds = [];
	var enable;
	if (from === 'UI') {
		enable = true;
	}

	if (!enable && (!smis || smis.status === lib.smis_Constants.INSTANCE_STATUS_DISABLE())) {
		idolserverinfo = lib.IDOL_Utilities.getIDOLServerConfig();
		if (type === 'OCR' && idolserverinfo['image.enable']) {
			enable = true;
		} else if (type === 'IDOL' && idolserverinfo['enable']) {
			enable = true;
		} else if (type === 'AutoFill' && idolserverinfo['enable']) {
			enable = true;
		} else if (type === 'HtaLda' && idolserverinfo['enable']) {
			enable = true;
		}
	}

	if (!smis) {
		if (enable) {
			var instanceCount = 1;
			var intId = [];
			var smisTemplateName = getSMISTemplateName(type);
			if (type === 'OCR') {
				try {
					instanceCount = lib.IDOL_Utilities.getOCRThreadNumber(from);
				} catch (ex) {
					funcs.msg(funcs.scmsg('72','idol'),3);
					instanceCount = 1;
				}
			} else if (type === 'AutoFill') {
				//start up SMIDOLAutoFill template
				try {
					instanceCount = lib.IDOL_Utilities.getIDOLThreadNumber(from, 'IDOL');
				} catch (ex) {
					funcs.msg(funcs.scmsg('72','idol'),3);
					instanceCount = 1;
				}
			}
			for (var i = 0; i < instanceCount; i++) {
				var builder = new (lib.smis_InstanceBuilder.getClass())();
				var smisInfo = {runOnStartup: true, intervalTime: 30};
				smisInfo.name = smisTemplateName + i
    			var smisIntId = builder.buildFromTemplate(smisTemplateName, true).buildGeneralInfo(smisInfo).add();
    			lib.smis_ConfigurationManager.enableInstance(smisIntId);
    			intIds.push(smisIntId);
			}
			return intIds;
    	}
	} else if(smis.status === lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
		if (enable) {
			do {
				var smisIntId = smis.intId;
				lib.smis_ConfigurationManager.enableInstance(smisIntId);
				rc = smis.getNext();
				intIds.push(smisIntId);
				
				//enable SMIS instance for autofill
				var instanceCount = 1;
				
			} while (rc === RC_SUCCESS);
			return intIds;
		}
	}
	
	if (smis) {
		do {
			var smisIntId = smis.intId;
			rc = smis.getNext();
			intIds.push(smisIntId);
		} while (rc === RC_SUCCESS);
		return intIds;
	}
	return null;
}


/**
*	Delete the SMIS Instance
*
**/
function removeSMISInstance(type) {
	var smis = getSMISInstance(type);
	if (smis) {
		do {
			var smisIntId = smis.intId;
			lib.smis_ConfigurationManager.disableInstance(smisIntId, true);
			lib.smis_ConfigurationManager.deleteInstanceConfig(smisIntId, true);
			var rc = smis.getNext();
		} while (rc === RC_SUCCESS);
	}
}


/**
*	Retrieve the SMIS Instance id of IDOL
*
*	Returun - SMIS Instance id
*	Type - number
**/
function getSMISInstance(type){
	if (!type) type = 'IDOL';
	var smisInstance = new SCFile('SMISConfiguration', SCFILE_READONLY);
	smisInstance.setFields(['intId', 'status']);

	var result = smisInstance.doSelect('template = "' + getSMISTemplateName(type) + '"');
	if (result === RC_SUCCESS) {
		return smisInstance;
	}
	
	return null;
}

/**
 * Add an ocr task to SMIS
 */
function addOCRTask(interaction, ocrType, company, targetField, targetFileKeyField) {

  var flag = system.functions.nullsub(system.functions.lioption("Smart Analytics"), false);
  
  if (!flag) {
    logger.error("Canceling to create OCR task. You may not have the privilege to use the Smart Ticket.");
    return null;
  }
    
  var smisIntId = createSMISInstance('BG', ocrType);
  if (smisIntId) {
    var strIntId = '{';
    for (var i = 0; i < smisIntId.length; i++) {
      strIntId += smisIntId[i];
      if (i < smisIntId.length - 1) {
        strIntId += ',';
      }
    }
    strIntId += '}';

    var smisTask = new SCFile('SMISTaskQueue');
    var rc = smisTask.doSelect('select intId, count(id) from SMISTaskQueue where intId isin ' + strIntId + ' group by intId');
    var minCount = 0;
    var minIntId;
    var taskIntIds = [];
    var index = 0;
    while (rc === RC_SUCCESS) {
      var intId = smisTask[0];
      var count = smisTask[1];
      taskIntIds.push(intId);
      if (index === 0) {
        minCount = count;
        minIntId = intId;
      } else {
        if (minCount > count) {
          minCount = count;
          minIntId = intId;
        }
      }
      rc = smisTask.getNext();
      index ++;
    }

    var strTaskIntIds = taskIntIds.toString();
    if (index < smisIntId.length) {
      for (var i = 0; i < smisIntId.length; i++) {
        if (strTaskIntIds.indexOf(smisIntId[i]) < 0){
          minIntId = smisIntId[i];
          break;
        }
      }
    }

      if (targetFileKeyField!=null && targetFileKeyField!="" && targetFileKeyField != undefined) {
      } else {
      targetFileKeyField = "incident.id";
    }

    var task = new (lib.smis_Task.getClass())(minIntId);
    var configItem = lib.smis_ConfigurationManager.getInstanceConfig(minIntId);
    task.integrationName = configItem.name;
    task.intId = minIntId;

    var language = lib.IDOL_Utilities.detectLanguage(interaction);
    task.inRecord = [{value: interaction[targetFileKeyField], type: 'String'}, {value: language, type: 'Array'}];

    if (ocrType === 'OCR') {
      /*
      if (company!=null && company!="" && company != undefined) {
        task.inRecord.push({value: company, type: 'String'});
      } else {
        task.inRecord.push({value: "", type: 'String'});
      }
      */
      if (company!=null && company!="" && company != undefined) {
        task.inRecord.push({value: company, type: 'Array'});
      } else {
        task.inRecord.push({value: "[]", type: 'Array'});
      }      
    }else if (ocrType === 'AutoFill') {
      /***
         to support Smart Ticket mandant and mandant value perhaps be array (not only a string)
      ***/ 
      if (company!=null && company!="" && company != undefined) {
        task.inRecord.push({value: company, type: 'Array'});
      } else {
        task.inRecord.push({value: "[]", type: 'Array'});
      }
    }
    
    if (targetField!=null && targetField!="" && targetField != undefined) {
      task.inRecord.push({value: targetField, type: 'String'});
    } else {
      task.inRecord.push({value: "", type: 'String'});
    }
    task.inRecord.push({value: targetFileKeyField, type: 'String'});
    task.inRecord.push({value: system.functions.filename(interaction), type: 'String'});

    task.direction = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
    task.object = system.functions.filename(interaction);
    task.internalId = interaction[targetFileKeyField];

    if (ocrType === 'OCR') {
      task.action = 'ocr';
    } else if (ocrType === 'AutoFill') {
      task.action = 'autofill';
    }
    return lib.smis_TaskManager.pushTask(task);
  }
  return null;
}

/**
*	Add an idol task to SMIS
*
*	@param {action} - action of the task
*	@param {id} - internalId of the task
*	@param {filename} - object of the task
*	@param {parameters} - inrecord of the task. The inrecord is parameter of the corresponding js function.
**/
function addIDOLTask(action, id, filename, parameters) {

	var flag = system.functions.nullsub(system.functions.lioption("Smart Analytics"), false);
	
	if (!flag) {
		logger.error("Canceling to create IDOL task. You may not have the privilege to use the Smart Ticket.");
		return null;
	}
	
	var smisIntId = createSMISInstance('BG', 'IDOL')[0];
	if (smisIntId) {
		var task = new (lib.smis_Task.getClass())(smisIntId);
		var configItem = lib.smis_ConfigurationManager.getInstanceConfig(smisIntId);
		task.integrationName = configItem.name;
	  	task.intId = smisIntId;
	  	task.inRecord = parameters
	  	task.direction = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
	  	task.object = filename;
	  	task.internalId = id + '';
	  	task.action = action;
	  	return lib.smis_TaskManager.pushTask(task);
  	}
  	return null;
}


/**
*	Add an htalda task to SMIS
*
*	@param {action} - action of the task
*	@param {id} - internalId of the task
*	@param {filename} - object of the task
*	@param {parameters} - inrecord of the task. The inrecord is parameter of the corresponding js function.
**/
function addHtaTask(action, id, filename, parameters) {

	var flag = system.functions.nullsub(system.functions.lioption("Smart Analytics"), false);
	
	if (!flag) {
		logger.error("Canceling to create IDOL task. You may not have the privilege to use the Smart Ticket.");
		return null;
	}
	
	var smisIntId = createSMISInstance('BG', 'HtaLda')[0];
	if (smisIntId) {
		var task = new (lib.smis_Task.getClass())(smisIntId);
		var configItem = lib.smis_ConfigurationManager.getInstanceConfig(smisIntId);
		task.integrationName = configItem.name;
	  	task.intId = smisIntId;
	  	task.inRecord = parameters
	  	task.direction = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
	  	task.object = filename;
	  	task.internalId = id + '';
	  	task.action = action;
	  	return lib.smis_TaskManager.pushTask(task);
  	}
  	return null;
}

/**
*	Wrapper to call htalda method
*
*	@param {criteria} - criteria query condition
*	@param {maxresults} - maxresults to return for one query
    @param {minscore} - minscore for query result"

**/
function doHtaLda(endpoint, query, stopwords, maxresults, minscore, htaldaid, printfields, titlefield, topicthreshold, topicnumber, idollanguage){
    //logger.info("in dohtalda query is:"+query+" printfields:"+printfields);
    
    var criteria = lib.smis_CommonLib.fromJSON(lib.Base64Encoder.decode(query));
    var idolFields =[];
    if(printfields )
    {
      idolFields =printfields.slice(';');
    }
   var settings = {
	  action : 'query',
      Print : "Fields",
      PrintFields:idolFields,
      ldaTitleFields:titlefield,
      totalResults:true,
      //QuerySummaryPlus:true,
      QuerySummaryLength:topicnumber,
      Topicthreshold:topicthreshold,
      //QuerySummaryPhraseLength:6,
      //QuerySummaryTerms:50,
      isRunLda:true,
      LdaStopWords: stopwords,
      outputencoding : 'utf8',
      //QuerySummary : true,
      detectlanguagetype : true,
      anylanguage : true,
      //casesensitive : true,
	  //QuerySummaryAdvanced : true,
	 // QuerySummaryIDs : true,
      //summary : conf.summary,
      maxresults : maxresults,
      minscore : minscore,
      characters : 300
     };

     if(idollanguage!=null && idollanguage!=""){
      settings.anylanguage = false;
      settings.languagetype = idollanguage;
    }

     var _ = lib.Underscore.require();
     var params = _.extend(criteria, settings);
     var IDOLRequest = lib.IDOLRequest.require();
     var json = IDOLRequest.doIDOLJsonPost(endpoint, params);
     try
     {
       json = lib.smis_CommonLib.fromJSON(json.json);
       json["topic"]=criteria["text"];
     }
     catch(e)
     {
       logger.info("Parse Json error:"+lib.smis_CommonLib.toJSON(e));
     }
     if(json["subtopics"] == null || json["subtopics"].length == 0 )
     {
       var message = funcs.scmsg('610', 'idol' );
       json =  {"recommends":[message],"subtopics":[{
			"topic": message,
			"subtopics": [],
			"docs": [],
			"id": 1
		}],"summaries":{},"docs":[],"id":0,"topic":criteria["text"]};
     }
     else
     {
       json = lib.IDOL_Help.handleOther(json);
     }
     var f = new SCFile("htalda");
     var rc = f.doSelect('id='+htaldaid);
     if( rc == RC_SUCCESS)
     {
       
        f.result = lib.smis_CommonLib.toJSON(json);
        f.finish = true;
        f.lastmodify = new Date();
        f.doUpdate();
     }
     else
     {
       logger.error("can not update the result for htalda "+htaldaid+" due to record didn't existing");
     }
}

/**
*	Wrapper to call idol rule base method
*
*	@param {adapterId} - adapter id
*	@param {company} - string of company list "company1,company2,..."
**/
function doRuleBase(id,oldrulses){
	var msg = lib.IDOLCategoryRuleBase.addRuleBase(id,oldrulses);
	var exception = lib.IDOLCategoryException.getLastRuleBaseException();
	if (exception) {
		throw exception;
	}
	return msg;
}

function syncFillIncidentsByIdol(in_file, prob_file){
  var fadapter = new SCFile(lib.IDOL_Constant.getCategoryConfigFileName());
  var file_name = system.functions.filename(in_file);
  
  var rc = fadapter.doSelect("table.name=\"" + file_name + "\" and is.active=true");
  while(rc == RC_SUCCESS)
  {
    if (fadapter.level1_field != null){
    	prob_file[fadapter.level1_field] = in_file[fadapter.level1_field];
    }
    if (fadapter.level2_field != null){
    	prob_file[fadapter.level2_field] = in_file[fadapter.level2_field];
    }
    if (fadapter.level3_field != null){	
    	prob_file[fadapter.level3_field] = in_file[fadapter.level3_field];
    }
 	rc = fadapter.getNext();
   }
   prob_file.doUpdate();
}

/**
*	Wrapper to call idol auto fill method
*
**/
function doAutoFill(interactionId, language, company){
	var interaction = new SCFile('incidents');
	interaction.doSelect('incident.id = "' + interactionId + '"');
	lib.IDOL_Utilities.fillIncidentsByIdol(interaction, 3, company, true);
	var ex = lib.IDOLCategoryException.getLastSuggestException();
	if (ex) {
		throw ex;
	}else{
		/*this section is for QCCR1E134493
		OCR and Classification result doesn't copy from interaction to incident in Streamline interaction mode
		*/
		/*QCCR1E151040:Category of Incident gets changed to compliment if a related Survey is completed
        It is defected caused by QCCR1E134493. Only the direct-related incidents with specified relation should be synchronized
        Here the relation types are identified by : Escalate From/Trigger From
        Interaction from ESS user, including smart interaction with/without image attachment(OCR/None-OCR).
        */
		var DIRECT_RELATION_TYPES=["Escalate From","Trigger From"];
		prob_file = lib.IDOL_Utilities.getRelatedIncident(interactionId,DIRECT_RELATION_TYPES);
		if(prob_file){
			syncFillIncidentsByIdol(interaction, prob_file)
		}
	}
	
	var ess = vars['$G.ess'];
	vars['$G.ess'] = true;
	
	//for steamlined interaction which needs auto-trigger.
	vars['$post.open.fulfillment.record'] = true;
	
	var bypassValidation = vars['$bypass.failed.validation'];
	vars['$bypass.failed.validation'] = true;
	
	var bypassAuthcheck = vars['$bypass.bg.authcheck'];
	vars['$bypass.bg.authcheck'] = true;
	
	var rc = interaction.doAction("save");
	
	vars['$bypass.failed.validation'] = bypassValidation;
	vars['$bypass.bg.authcheck'] = bypassAuthcheck;
	vars['$G.ess'] = ess;
	
	if(rc != RC_SUCCESS) throw rc;

	return null;
}


/**
*	Retrieve task id list by smis intId, task internaId and actions
*
*	@param {smisIntId} - smis intId
*	@param {internalId} - task internalId
*	@param {actions} - task action array
*	Returun - SMIS task id list
*	Type - Array
**/
function getTaskIds(smisIntId, internalId, actions){
	var taskIds = [];
	var smisTasks = new SCFile('SMISTaskQueue', SCFILE_READONLY);
	smisTasks.setFields(['id']);
	var actionStr = '';
	for (var i = 0; i < actions.length; i++) {
		actionStr += '"' + actions[i] + '"';
		if (i < actions.length - 1) {
			actionStr += ',';
		}
	}
	var query = 'intId="' + smisIntId + '" and internalId="' + internalId + '" and action isin {' + actionStr + '}';
	var rc = smisTasks.doSelect(query);
	while (rc === RC_SUCCESS) {
		taskIds.push(smisTasks.id);
		rc = smisTasks.getNext();
	}
	return taskIds;
}


/**
*	Retrieve task log id list by smis intId, task internaId and actions
*
*	@param {smisIntId} - smis intId
*	@param {internalId} - task internalId
*	@param {actions} - task action array
*	Returun - SMIS task id list
*	Type - Array
**/
function getTaskLogId(type, internalId, actions, status){
	var taskLogIds = [];
	
	var smis = getSMISInstance(type);
	if (!smis) return taskLogIds;
	var smisIntId = smis.intId;

	var smisTaskLog = new SCFile('SMISTaskLog', SCFILE_READONLY);
	smisTaskLog.setFields(['id']);
	var actionStr = '';
	var actionStr = '';
	for (var i = 0; i < actions.length; i++) {
		actionStr += '"' + actions[i] + '"';
		if (i < actions.length - 1) {
			actionStr += ',';
		}
	}
	
	var query = 'intId="' + smisIntId + '" and internal.id="' + internalId + '" and action isin {' + actionStr + '} and status="' + status + '"';
	
	var rc = smisTaskLog.doSelect(query);
	while (rc === RC_SUCCESS) {
		taskLogIds.push(smisTaskLog.id);
		rc = smisTaskLog.getNext();
	}
	return taskLogIds;
}

/**
*	Cancel/stop smis tasks
*	If the tasks are not running, remove it from queue.
*	If the task is running, call add function to stop it and remove it.
*
*	@param {internalId} - task internalId
*	@param {actions} - task action array
**/
function cancelSMISTask(internalId, actions){
	var smis = getSMISInstance();
	if (!smis) return;
	var smisIntId = smis.intId;
	var taskIds = getTaskIds(smisIntId, internalId, actions);

	lib.smis_ConfigurationManager.getInstanceConfig(smisIntId);
	for (var i = 0; i < taskIds.length; i++) {
		var taskObj = lib.smis_TaskManager.readTask(smisIntId, taskIds[i]);
		// if this task is not running, remove the task directly
		if (taskObj.status !== lib.smis_Constants.TASK_STATUS_RUNNING() && !taskObj.expired){
			lib.smis_TaskManager.removeTask(taskObj);
		} 
		// if the task is running, stop the training, testing, index process and then remove the task
		else if (taskObj.status === lib.smis_Constants.TASK_STATUS_RUNNING()){
			if (taskObj.action === 'training' || taskObj.action === 'tuning') {
				lib.acicategory.stopTrainingTask();
			} else if (taskObj.action === 'testing') {
				lib.acicategory.stopTestTask();
			}
			lib.smis_TaskManager.removeTask(taskObj);
		}
	}
}


/**
*	This function is to check if the same idol action has already in the smis task queue
*
*	@param {internalId} - task internalId
*	@param {action} - task action
*	Returun - The same task with same internalid is already in the smis task or not
*	Type - boolean
**/
function hasAvailableTask(internalId, action){
	var smis = getSMISInstance();
	if (!smis) return false;
	
	var smisIntId = smis.intId;
	var smisTask = new SCFile('SMISTaskQueue', SCFILE_READONLY);
	var query = 'intId="' + smisIntId + '" and internalId="' + internalId + '" and action="' + action + '" and expired=false';

	var count = smisTask.doCount(query);
	return count > 0;
}











var _ = lib.Underscore.require(),
    JSON = lib.JSON.json(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLSmartTicketCategory = lib.IDOLSmartTicketCategory.require(),
    IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require(),
    IDOLSmartTicketCategorizerTestRunner = lib.IDOLSmartTicketCategorizerTestRunner.require(),
    IDOLSmartTicketCategorizerTuningRunner = lib.IDOLSmartTicketCategorizerTuningRunner.require(),
    IDOLSmartTicketCategorizerTrainingRunner = lib.IDOLSmartTicketCategorizerTrainingRunner.require();


// XXX: compatible, record can be a `idoladapter` id, a number
function id2fCategorizerCompatible(record) {
  if (_.isNumber(record) || _.isString(record)) {
    var id = record;
    record = new SCFile('idoladapter');
    var rc = record.doSelect(new QueryCond('adapter.id', EQ, id));
    if (rc !== RC_SUCCESS) {
      throw new Error('unable to find categorizer definition, id: ' + id);
    }
  }
  return record;
}


function addTrainingTask(record, company) {
  record = id2fCategorizerCompatible(record);
  var id = IDOLCommon.getIdentity(record);
  var filename = funcs.filename(record);
  var args = _.toArray(arguments);

  var params = lib.IDOL_SMIS_SMAdapter.encodeParameters.apply(null, args);

  // reset status, and display them on the configuration page
  var categorizer = IDOLSmartTicketCategorizerFactory.create(record);
  categorizer.resetTrainingStatus();
  categorizer.resetTestingStatus();

  company = company || '';
  var companies = company.split(',');
  _.each(companies, function(company) {
    var categorizer = IDOLSmartTicketCategorizerFactory.create(record, company);
    categorizer.resetTrainingStatus();
    categorizer.resetTestingStatus();
    
    var sql = 'categorizer.id="'+ id +'" and company="'+ company +'"';
    //clean test results
    var test_result_file = new SCFile("SmartTicketTestResults");
    test_result_file.doPurge(sql);
    //clean test rounds 
    var test_result_file = new SCFile("SmartTicketTestRounds");
    test_result_file.doPurge(sql);
  });

  var taskId = addIDOLTask('training', id, filename, params);
  if (taskId) {
    funcs.msg(funcs.scmsg('8','idol'), 1);
  }
}

/**
 * Wrapper to call idol training method
 *
 * @param {adapterId} - adapter id
 * @param {company} - string of company list "company1,company2,..."
 **/
function doTraining(record, company){
  record = id2fCategorizerCompatible(record);
  IDOLSmartTicketCategorizerTrainingRunner.create(record, company).run();
}







function addTestingTask(record, company) {
  record = id2fCategorizerCompatible(record);
  var id = IDOLCommon.getIdentity(record);
  var filename = funcs.filename(record);
  var args = _.toArray(arguments);

  var params = lib.IDOL_SMIS_SMAdapter.encodeParameters.apply(null, args);

  // reset status, and display them on the configuration page
  var categorizer = IDOLSmartTicketCategorizerFactory.create(record);
  categorizer.resetTestingStatus();

  company = company || '';
  var companies = company.split(',');
  _.each(companies, function(company) {
    var categorizer = IDOLSmartTicketCategorizerFactory.create(record, company);
    categorizer.resetTestingStatus();
  });

  var taskId = addIDOLTask('testing', id, filename, params);
  if (taskId) {
    funcs.msg(funcs.scmsg('9','idol'), 1);
  }
}

function doTesting(record, company) {
  record = id2fCategorizerCompatible(record);
  IDOLSmartTicketCategorizerTestRunner.create(record, company).run();
}



function addCalculateDistributionTask(record, company) {
  record = id2fCategorizerCompatible(record);
  var id = IDOLCommon.getIdentity(record);
  var filename = funcs.filename(record);
  var args = _.toArray(arguments);
  var params = lib.IDOL_SMIS_SMAdapter.encodeParameters.apply(null, args);
  
  company = company || '';
  var taskId = addIDOLTask('distribution', id, filename, params);
  if (taskId) {
    funcs.msg(funcs.scmsg('9','idol'), 1);
  }  
}



function doCalculateDistribution(record, company){
  record = id2fCategorizerCompatible(record);
  lib.IDOLSmartTicketDistributionHelper.calculateDistribution(record, company)
}



/**
 * overrided version available
 *
 * for multi-company
 *   function addTuningTask(record, company) { ... }
 *
 * for category training snapshot restore
 *   function addTuningTask(record, company, round) { ... }
 * 
 * argument round is the SmartTicketTestRound.id indicate which version of 
 * category training will be rollbacked to
 */
function addTuningTask(record) {
  var filename = funcs.filename(record);
  if (!_.contains(['cate2idol2', 'idoladapter'], filename)) {
    throw new Error('unable to create tuning task for: ' + filename);
  }

  var id = IDOLCommon.getIdentity(record);
  var args = _.toArray(arguments);
  // XXX: for compatible reason
  var params = lib.IDOL_SMIS_SMAdapter.encodeParameters.apply(null, args);
  return addIDOLTask('tuning', id, filename, params);
}


function doTuning(record, company, round) {
  record = id2fCategorizerCompatible(record);
  // TODO: tuning task doesn't have compnay associated, should allow admin to choose
  // which company category need refine.
  var filename = funcs.filename(record), category;
  if (filename === 'cate2idol2') {
    category = IDOLSmartTicketCategory.wrap(record);
  } else if (filename === 'idoladapter') {
    var categorizer = IDOLSmartTicketCategorizerFactory.create(record, company);
    category = categorizer.getTrainedCategory();
  } else {
    throw new Error('unable to tune SCFile: ' + filename);
  }

  // this `client` allow UI to trace the action which IDOL server currently execution
  var client = category.createClient();
  var runner = IDOLSmartTicketCategorizerTuningRunner.create(category, round);
  runner.run(client);
}

function findSMISTask(record) {
  var queue = new SCFile('SMISTaskQueue', SCFILE_READONLY);
  var filename = funcs.filename(record),
      id = IDOLCommon.getIdentity(record);
  var query = 'object="' + filename + '" and internalId="' + id + '" and nullsub(expired, false)=false';
  var rc = queue.doSelect(query);
  if (rc === RC_SUCCESS) {
    var status = queue.status;
    if (status === lib.smis_Constants.TASK_STATUS_RUNNING()) {
      status = 'Runing';
    } else if (status === lib.smis_Constants.TASK_STATUS_WAITING()){
      status = 'Waiting';
    }
    return {
      id : queue.id,
      status : status,
      enqueueTime : queue.enqueueTime,
      retry : queue.retry,
      expired : queue.expired || false,
      action : queue.action,
      message : queue.responseMsg
    };
  } else {
    return null;
  }
}