/******************************************************
* Module Name: Case Exchange
* Function: Case Exchange ExternalReferences Table DAO
* Author: He, Peng-Fei
* Version: 1.00
* Creation Date: Mar, 2014
*******************************************************/

function TABLE_NAME() {return 'ExternalReferences';}

/**
*	Insert a new record to ExternalReferences table
*	id of this table will be generated automatically
*
*	@param {caseExchangeMapping} - SCFile of ExternalReferences
*	@return return code (RC) of success or not
*	@type - number
**/
function create(externalReferences) {
	externalReferences.id = getNextId();
	externalReferences.doInsert();
	return externalReferences.id;
}


/**
*	Get id from number table. class is ExternalReferences
*
*	@return the autoincreased number define in number
*	@type - character
**/
function getNextId() {
	var newId = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall("getnumber", rcode , newId, "ExternalReferences");
	return newId.getText();
}

/**
*	Update a record in ExternalReferences table
*
*	@param {caseExchangeMapping} - SCFile of ExternalReferences
*	@return return code (RC) of success or not
*	@type - number
*/
function update(externalReferences) {
	externalReferences.doSave();
	return externalReferences.id;
}

/**
*	Create or update record in ExternalReferences table
*	if id is not defined, create a record. else update
*
*	@param {caseExchangeMapping} - SCFile of ExternalReferences
*	@return return code (RC) of success or not
*	@type - number
**/
function createSave(extRefObj) {
	if (extRefObj.id) {
		var tmpExtRef = getById(extRefObj.id);
		if (tmpExtRef) {
			if ((!tmpExtRef.internalId || tmpExtRef.internalId === extRefObj.internalId) && (!tmpExtRef.externalId || tmpExtRef.externalId === extRefObj.externalId)) {
				tmpExtRef = objToSCFile(extRefObj, tmpExtRef);
				return update(tmpExtRef);
			} else {
				tmpExtRef.active = false;
				update(tmpExtRef);
				var newExtRef = objToSCFile(extRefObj);
				return create(newExtRef);
			}
		} else {
			var newExtRef = objToSCFile(extRefObj);
			return create(newExtRef);
		}
	} else {
		var newExtRef = objToSCFile(extRefObj);
		return create(newExtRef);
	}
}

/**
*	Get externalReference by Id
*	if id is not defined, return null
*
*	@param {id} - Id of ExternalReference
*	@return - SCFile of ExternalReference. null if not found
*	@type - SCFile
**/
function getById(id) {
	if (!id) {
		return null;
	}
	
	var extRef = new SCFile(TABLE_NAME());
	var result = extRef.doSelect('id = "' + id + '"');
	if (result === RC_SUCCESS) {
		return extRef;
	}
	return null;
}


/**
*	delete an externalReference by Id
*
*	@param {id} - Id of ExternalReference
**/
function deleteById(id) {
	if (!id) {
		return;
	}
	
	var extRef = new SCFile(TABLE_NAME());
	var result = extRef.doSelect('id = "' + id + '"');
	if (result === RC_SUCCESS) {
		extRef.doDelete();
	}
}


/**
*	Query table by internalObject, internalId, externalId, instanceId
*	if any parameter is not define, will ignore it.
*
*	@param {internalObject} - internalObject
*	@param {internalId} - internalId
*	@param {externalId} - externalId
*	@param {instanceId} - instanceId
*	@param {active}
*	@return CaseExchangeMapping or null if not found
*	@type - js object
**/
function getExternalReferencesByObjIdIntid(internalObject, internalId, externalId, instanceId, active) {
	var externalReferences = new SCFile(TABLE_NAME());
	var query = 'true';
	if (internalObject) {
		query += ' and internalObject="' + internalObject + '"';
	}
	
	if (internalId) {
		query += ' and internalId="' + internalId + '"';
	}
	
	if (externalId) {
		query += ' and externalId="' + externalId + '"';
	}
	
	if (instanceId) {
		query += ' and smisInstanceId="' + instanceId + '"';
	}
	
	if (active) {
		query += ' and active=' + active;
	}
	
	var result = externalReferences.doSelect(query);
		if (result === RC_SUCCESS) {
		return scfileToObj(externalReferences);
	}
	
	return null;
}


/**
*	Convert SCFile of ExternalReferences to java object
*
*	@param {extRef} - SCFile of ExternalReferences
*	@return a js object of ExternalReferences
*	@type - js object
**/
function scfileToObj(extRef) {
	if (!extRef) {
		return null;
	}
	
	var obj = {};
	obj.id = extRef.id;
	obj.creationTime = extRef.creationTime;
	obj.externalId = extRef.externalId;
	obj.externalStatus = extRef.externalStatus;
	obj.internalId = extRef.internalId;
	obj.internalObject = extRef.internalObject;
	obj.smisInstanceId = extRef.smisInstanceId;
	obj.smisInstanceName = extRef.smisInstanceName;
	obj.initiator = extRef.initiator;
	obj.active = extRef.active;
	obj.customField1 = extRef.customField1;
	obj.customField2 = extRef.customField2;
	
	return obj;
}


/**
*	Convert js object of ExternalReferences to SCFile
*
*	@param {extRefObj} - js object of ExternalReferences
*	@return - SCFile of ExternalReferences
*	@type - SCFile
**/
function objToSCFile(extRefObj, scfile) {
	if (!extRefObj) {
		return null;
	}
	
	if(!scfile) {
		var scfile = new SCFile(TABLE_NAME());
	}
	lib.smis_CommonLib.convertToSMObject(extRefObj, scfile);
	return scfile;
}

/**
*   
*	Parse ruleset config xml and query ExternalReferences record.
*	@param {internalId} - internalId
*	@return CaseExchangeMapping or null if not found
*	@type - ExternalStatus
**/
function initCurMapping(internalid)
{
	var externalReferences = null
	var ruleFile = vars['$L.rule'];
	if (ruleFile != null && (internalid != "" && internalid!=null))
	{
		var ruleConfig = null;
        try{
	        if(ruleFile['ruleXML']){
	            var xml = new XML();
	            xml.setContent(ruleFile['ruleXML']);
	            ruleConfig = lib.CaseExchangeRuleType_Manager.parseRuleSetXMLAsObject(xml);
	        }else if(ruleFile['ruleJSON']){
	            ruleConfig = JSON.parse(ruleFile['ruleJSON']);
	        }
        }catch(ex){
            
        }
		if (ruleConfig != null)
		{
			var instanceID = ruleConfig.connctor;
			var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceID);
			var tablename = smisConfig.getConfigParameterValue("object");
			externalReferences = getExternalReferencesByObjIdIntid(tablename,internalid,null,instanceID);
		}
	}
	return externalReferences;
}
/**
*   This Api use to invoked in condition express of RuleSet.
*	Query table ExternalReferences and return externalStatus
*	@param {internalId} - internalId
*	@return CaseExchangeMapping or null if not found
*	@type - ExternalStatus
**/
function getExternalStatus(internalid)
{
	var curMapFile = initCurMapping(internalid);
	return curMapFile==null?"":curMapFile['externalStatus'];
}

/**
*   This Api use to invoked in condition express of RuleSet.
*	Query table ExternalReferences and return smisInstanceName
*	@param {internalId} - internalId
*	@return CaseExchangeMapping or null if not found
*	@type - smisInstanceName
**/

function getExternalSystem(internalid)
{
	var curMapFile = initCurMapping(internalid);
	return curMapFile==null?"":curMapFile['smisInstanceName'];	
}

/**
*   This Api use to invoked in condition express of RuleSet.
*	Query table ExternalReferences and return ExternalID
*	@param {internalId} - internalId
*	@return CaseExchangeMapping or null if not found
*	@type - ExternalID
**/

function getExternalID(internalid)
{
	var curMapFile = initCurMapping(internalid);
	return curMapFile==null?"":curMapFile['externalId'];	
} 

/**
*   This Api use to get active field of external reference.
*	@param {internalObject} - internalObject
*	@param {internalId} - internalId
*	@return CaseExchangeMapping or null if not found
*	@type - active
**/
function isExternalActive(internalObject, internalId)
{
	var externalReferences = getExternalReferencesByObjIdIntid(internalObject,internalId, null, null, true);
	return externalReferences==null?false:externalReferences['active'];
}
