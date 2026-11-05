/**
*	This ScriptLibrary is DAO to table idoladater
*
*	author He, Peng-Fei
*/


/**
*	This function is to find a record in idoladapter by adapterObj
*	The query criteria is based on the not-null fields in adapterObj
*
*	@param adapterObj - an js object not SCFile
*	@param fields - the fields need to be searched. 
*	If not null, will only retrieve the record with specifed fields and the record is read only. Otherwise it will search out all fields and the record is not read only.
*	@return - idoladapter if found. null if not found.
*	@type - SCFile
*/
function findIDOLAdapter(adapterObj, fields) {
	if (!adapterObj) {
		return null;
	}

	var query = 'true';
	if (!fields) {
		var idolAdapter = new SCFile('idoladapter');
	} else {
		var idolAdapter = new SCFile('idoladapter')//, SCFILE_READONLY);
		//idolAdapter.setFields(fields);
	}
	for (var obj in adapterObj) {
		var fieldType = idolAdapter.getFieldType(obj);
		var fieldValue = adapterObj[obj];

		if (fieldType > 0 && fieldValue) {
			if (fieldType === 1 || fieldType === 4) {	//number
				query += ' and ' + obj + '=' + fieldValue;
			} else if (fieldType === 2) {	//character
				query += ' and ' + obj + '="' + fieldValue + '"';
			} else if (fieldType === 3) {
				query += ' and ' + obj + '=\'' + fieldValue + '\'';
			}
		}
	}

	if (query === 'true') {
		return null;
	}

	var rc = idolAdapter.doSelect(query);
	if (rc === RC_SUCCESS) {
		return idolAdapter;
	}
	return null;
}


/**
*	Get all adapters
*	@return - all readonly idoladapter record
*	@type - SCFile
**/
function getAllAdapters(){
	var adapter = new SCFile('idoladapter', SCFILE_READONLY);
	var rc = adapter.doSelect('true');
	while (rc === RC_SUCCESS) {
		return adapter;
	}
	return null;
}


/**
*	Get idol adapter by name (category.group.name)
*	@return - idoladapter
*	@type - SCFile
**/
function getAdapterByName(name) {
	var adapter = new SCFile('idoladapter');
	var rc = adapter.doSelect('category.group.name="' + name + '"');
	while (rc === RC_SUCCESS) {
		return adapter;
	}
	return null;
}


/**
*	Get idolsecgroup by adapter id
*	@return - idolsecgroup
*	@type - SCFile
**/
function getSecGroupByAdapterId(id) {
	var idolsecgroup = new SCFile('idolsecgroup');
	var rc = idolsecgroup.doSelect('adapter.id=' + id);
	if (rc === RC_SUCCESS) {
		return idolsecgroup;
	}
	return null;
}


function getAdapterByFileName(tablename) {
	var adapter = new SCFile('idoladapter', SCFILE_READONLY);
	var rc = adapter.doSelect('table.name = "' + tablename + '"');
	if (rc == RC_SUCCESS) {
		return adapter;
	}
	return null;
}