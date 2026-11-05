/**
*	This ScriptLibrary is DAO to table idolsecgroup
*
*	author He, Peng-Fei
*/


/**
*	This function is to delete all records in idolsecgroup with spcified adapter.id
*
*	@param adapterId - value of adapter.id
*	@return - security.id list which cannot be deleted
*	@type - array
*/
function deleteByAdapterId(adapterId) {
	var failedArray = [];
	if (adapterId) {
		var record = new SCFile('idolsecgroup');
		var rc = record.doSelect('adapter.id="' + adapterId + '"');
		while(rc === RC_SUCCESS) {
			var result = record.doDelete();
			if (result !== RC_SUCCESS) {
				failedArray.push(record['security.id']);
			}
			rc = record.getNext();
		}
	}
	
	return failedArray;
}