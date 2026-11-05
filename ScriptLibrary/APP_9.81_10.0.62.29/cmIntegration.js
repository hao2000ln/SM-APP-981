/*
The script is used to transfer ucmdb id to logic name of a CI
@author Xue Jun
@date 2011-08-24
*/
var convertNameToId=lib.DisplayName.convertNameToId;

/**
* Function: handle the request which come from the web service
* @author Xue,Jun
* @param file {Object} the request file object
* @param exit {Object} Obsolete
* @param action {Object} Obsolete
* @param fields {Object} Obsolete
* @returns null {Object} nothing
*/
function handleRequest(file,exit,action,fields){
	//1. set the default value to the mandatory fields
	if (file["reason"] == null)
	{
		file["reason"]="problem";
	}
	//2. translate to SM required value
	file["requested.by"]=getFullName(file["requested.by"]);
	file["affected.item"]=convertNameToId(getLogicNamebyUCMDBid(file["affected.item"]),file,"affected.item");
	file["assets"]=convertNameToId(getLogicNamebyUCMDBids(file["assets"]),file,"assets");

	//3. in case customer want to move to the next phase
}

/**
* Function: return the full name by specified login name
* @author Xue,Jun
* @param loginName {String} login name
* @returns loginName {String} full login name
*/
function getFullName(loginName){
	var contacts = new SCFile("contacts", SCFILE_READONLY);
	contacts.setFields(["contact.name"]);
	var rs = contacts.doSelect("operator.id=\""+loginName+"\"");
	if(rs == RC_SUCCESS){
		return contacts.contact_name;
	}
	return loginName;
}

/**
* Function: return the logic name by specified ucmdb id's list (for AffectedCis)
* @author Xue,Jun
* @param id {String} UCMDBid
* @returns logicName {String} the logic name
*/
function getLogicNamebyUCMDBid(id){
	var device = new SCFile("device", SCFILE_READONLY);
	device.setFields(["logical.name"]);
	var rs = device.doSelect("ucmdb.id=\""+id+"\"");
	if(rs == RC_SUCCESS){
		return device.logical_name;
	}
	return id;
}

/**
* Function: return the logic name by specified ucmdb id's list (for AffectedCis)
* @author Xue,Jun
* @param idList {Array} UCMDBid list
* @returns idList {Array} the logic name list
*/
function getLogicNamebyUCMDBids(idList){
	if(idList==null || idList.length()==0){
		return null;
	}
	for(var i = 0; i < idList.length(); i++){
		idList[i] = getLogicNamebyUCMDBid(idList[i]);
	}
	return idList;
}