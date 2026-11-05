/**
*	This script library is for creating or deleting KM Attachment Library index functionality
**/
var CONSTANT = lib.KMAttachment_Constant,
    IDOLKMIndexService= lib.IDOLKMIndexService.require();


/*
*	Create attachment library
*	Call idol api to retrieve the attachment library first. Create if not exist
*/
function createAttachmentLibrary() {
	var idolMiscService = lib.IDOLServiceMisc.require();
	var statusXML = idolMiscService.getStatus();
	var xQuery = lib.XQuery.require();
	var databaseNodes = xQuery.query('responsedata/databases/database/name', statusXML);

	var found = false;
	for (var i = 0; i < databaseNodes.length; i++) {
		var dbname = databaseNodes[i].getValue();
		if (dbname === CONSTANT.ATTACHMENT_LIBRARY()) {
			found = true;
		}
	}
	if (!found) {
		var idolQueryService = lib.IDOLServiceQuery.require();
		try{
			return IDOLKMIndexService.createIndexDB(CONSTANT.ATTACHMENT_LIBRARY());
		} catch (ex) {
			return -1;
		}
	}
	return 0;
}


/*
*	Delete all the indexed record of a specified table name
*/
function deleteDocsByKBname(kbname) {
	var params = {
		text: '*',
		databasematch: CONSTANT.ATTACHMENT_LIBRARY(),
		fieldtext: 'MATCH{' + kbname + '}:' + CONSTANT.METADATA_KMBASENAME(),
		StoreState: 'true',
		print: 'NoResults',
		AnyLanguage: 'true',
		maxResults: 10000
	}
	
	var idolQueryService = lib.IDOLServiceQuery.require();
	var xQuery = lib.XQuery.require();
	
	while(true) {
		var xml = idolQueryService.doQuery(params);
		var numhits = xQuery.queryText('responsedata/autn:numhits', xml);
		if (numhits == '0') {
			break;
		}
	
		var stateId = xQuery.queryText('responsedata/autn:state', xml);

		if (stateId != '') {
			var delParams = {stateid: stateId};
			idolQueryService.doDelete(delParams);
		}
	}
	
	return 0;
}