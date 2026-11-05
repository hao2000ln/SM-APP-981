/******************************************************
* Module Name: Case Exchange SM Adpater
* Function: Manager interface
* Author: He, Peng-Fei
* Version: 1.00
* Creation Date: Dec, 2013
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var CaseExchangeSMAdapterClass = Class.create({
    initialize: function (configItem) {
    	this.configItem = configItem;
    	this.logger = configItem.getLogger();
    	this.instanceName = configItem.name;
    	
    	//general parameter
    	this.smObject = this.configItem.getConfigParameterValue('object');
    	
    	//inbound parameter
    	this.externalId = this.configItem.getConfigParameterValue('externalId');
    	this.internalId = this.configItem.getConfigParameterValue('internalId');
    	this.externalStatus = this.configItem.getConfigParameterValue('externalStatus');
    	this.isPulling = this.configItem.getConfigParameterValue('isPulling');
    	
    	this.createAction = this.configItem.getConfigParameterValue('createAction');
    	if (!this.createAction) this.createAction = lib.CaseExchangeConstants.CREATE_ACTION();
    	this.updateAction = this.configItem.getConfigParameterValue('updateAction');
    	if (!this.updateAction) this.updateAction = lib.CaseExchangeConstants.UPDATE_ACTION();
    	
    },
    
    /**	
	*   This fuction is to retrieve sm scfile by task
	*
	*	@param {task} - smis task
	*	@return - a record of SCFile
	*	@type - SCFile
	*/
    getSMRecord: function (internalId, fields) {
    	var smRecord = null;
    	if (fields && fields.length > 0){
    		smRecord = new SCFile(this.smObject, SCFILE_READONLY);
    		smRecord.setFields(fields);
    	} else{
    		smRecord = new SCFile(this.smObject);
    	}
    	
    	if (this.logger.isDebugEnabled()) {
    	    this.logger.debug('CaseExchange_SMAdapter', this.internalId + '="' + internalId + '"');
    	}
    	var rc = smRecord.doSelect(this.internalId + '="' + internalId + '"');
    	
    	return smRecord;
    },
    

	/**	
	*   This fuction is to send record to SM (inbound)
	*
	*	@param {task} - smis task
	*	@param {smRecord} - a record of SCFile
	*	@return - success or not
	*	@type - boolean
	*/
    sendRecords: function (task) {
    	if (this.logger.isDebugEnabled()) {
    	    this.logger.debug('CaseExchange_SMAdapter', 'sendRecords');
    	}
    	
    	var smRecord = task.internalObject;
    	
    	var updatedField = lib.CaseExchange_CommonLib.compareSetSMRecord(smRecord, task.destObject, true);
    	
    	var journalUpdate = lib.CaseExchange_CommonLib.updateFieldsToString(updatedField, task.object);
    	if(!vars["$pmc.actions"] && task.action !== this.createAction) {
    		lib.CaseExchange_CommonLib.setActivityLog(true, task.action, smRecord, journalUpdate, this.smObject);
    	}

		this.createSaveExtRef(task);
    	var returnCode = smRecord.doAction(task.action);

    	if (this.logger.isDebugEnabled()) {
    	    this.logger.debug('CaseExchange_SMAdapter.sendRecords', 'returnCode: ' + returnCode);
    	}
    	task.responseCode = returnCode + '';
    	lib.CaseExchange_CommonLib.clearActivityLogVar(this.smObject);
    	
    	if (returnCode !== RC_SUCCESS) {
			task.responseMsg = 'Error occurred while doing action ' + task.action + ', return code: ' + RCtoString(returnCode);
	  		return false;
		}

		if (task.action === this.createAction){
    		task.internalId = smRecord[this.internalId];
    	}
    	
    	//process attachment
    	//attachment parameter
        var attachSwitch = this.configItem.getConfigParameterValue('attachSwitch');
    	if (attachSwitch && this.isPulling) {
			lib.CaseExchange_AttachHandling.putAttachmentsToQueue(task, this.configItem);
			lib.CaseExchange_AttachHandling.moveQueueAttachToIncident(task, smRecord,this.configItem);
		}

		return true;
    },


    removeHtmlTag: function(str) {
    	return str.replace(/<[^>]+>/g,"");
    },
    
    
    /**	
	*   This fuction is to get the id of end point ticket from task inRecord
	*
	*	@param {inRecord} - inRecord in task
	*	@return id
	*	@type - string
	*/
    getExternalId: function(inRecord){
    	return eval('inRecord.'+this.externalId);
    },
    
    
    /**	
	*   This fuction is to save sm record with request acknledge
	*
	*	@param {task} - smis task
	*/
    saveAckRecords: function(task){
    	if (this.logger.isDebugEnabled()) {
    	    this.logger.debug('CaseExchange_SMAdapter', 'saveAckRecords');
    	}
    	var action = task.action;
    	
    	if (lib.CaseExchange_CommonLib.isOutbound(task.direction)) {
    		if(action == 'Acknowledge') {
    			return true;
    		}
    		/*var smRecord = task.internalObject;
			//get update msg from task
    		var updateMsg = this.getOutboundTicketUpdate(task);
    		if (!updateMsg) {
    			updateMsg = system.functions.scmsg('3', 'CaseExchange', []);//No Field Updated
    		}
    	
			//create activity of updateMsg
    		lib.CaseExchange_CommonLib.setActivityLog(false, action, smRecord, updateMsg, this.smObject);*/
    	}
    	
		this.createSaveExtRef(task);
    	return true;
    },
    
    
    /**	
	*   This fuction is to save sm record with request acknledge
	*
	*	@param {task} - smis task
	*/
    createSaveExtRef: function(task){
    	var smRecordId = task.internalId;
    	var externalId = task.externalId;
    	if (this.logger.isDebugEnabled()) {
    	    this.logger.debug('CaseExchange_SMAdapter', 'createSaveExtRef');
    	}
    	
    	var externalReferences = task.externalReferences;
    	if (!externalReferences.id) {
    		if (lib.CaseExchange_CommonLib.isInbound(task.direction)) {
    			externalReferences = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(task.object, null, task.externalId, task.intId, true);
    		}
    		else {
    			externalReferences = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(task.object, task.internalId, null, task.intId, true);
    		}
    	}
    	if (!externalReferences) {
    		externalReferences = {};
    		if (task.externalReferences) externalReferences = task.externalReferences;
    	}
    	
    	externalReferences.internalObject = task.object;
    	externalReferences.internalId = task.internalId;
    	externalReferences.externalId = task.externalId;
    	externalReferences.smisInstanceId = task.intId;
    	externalReferences.smisInstanceName = this.instanceName;
    	externalReferences.active = true;
    	if (!externalReferences.id) {
    		externalReferences.creationTime = new Date();
    	}
		if (lib.CaseExchange_CommonLib.isInbound(task.direction)) {
    	   	externalReferences.externalStatus = eval('task.inRecord.' + this.externalStatus);
    	}

    	if (!externalReferences.initiator) {
    		externalReferences.initiator = lib.CaseExchange_CommonLib.isInbound(task.direction) ? lib.CaseExchangeConstants.CREATE_BY_EP() : lib.CaseExchangeConstants.CREATE_BY_SM();
    	}
    	
    	var extRefId = lib.CaseExchangeExternalReferencesDAO.createSave(externalReferences);
    	
    	task.externalReferences = lib.CaseExchangeExternalReferencesDAO.scfileToObj(lib.CaseExchangeExternalReferencesDAO.getById(extRefId));
    	return true;
    },
	
	/**	
	*   Get ticket update from task
	*
	*	@param {task} - smis task
	*	@return - ticket update message
	*	@type - string
	*/
	getOutboundTicketUpdate: function(task){
		return task.inRecord['ticket.updates'];;
	}
	

});

function getClass() {
    return CaseExchangeSMAdapterClass;
}


