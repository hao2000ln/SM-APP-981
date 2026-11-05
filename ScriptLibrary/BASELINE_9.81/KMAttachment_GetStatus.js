var knowledgebase_list = {};


function processToken() {
	var KMAttachmentToken = lib.KMAttachmentTokenDAO.getAll();
	if (KMAttachmentToken === null) {
		return;
	}
	
	var cfsService = lib.IDOLServiceCFS.require();
	var xml = new XML();
	var xQuery = lib.XQuery.require();
	var kmtoken = new SCFile('kmattachmenttoken');
	do {
		var token = KMAttachmentToken['token'];
		try {
			var response = cfsService.getIndexStatus(token);
			xml.setContent(response);
			
			//All status: Queued, Processing, Finished, or Error
			var status = xQuery.queryText('responsedata/actions/action/status', xml);
			if(!status)
            {
              //no status, just delete it,
                var errorstring = xQuery.queryText('responsedata/error/errorstring', xml);
                if(errorstring)
                {
                  var err_str = errorstring.substring(0,255);
                  var knowledgeBase = getKnowledgeBase(KMAttachmentToken['collectionname']);
                  var document = {};
                  document[knowledgeBase['docid']] = KMAttachmentToken['docid'];
                
                  var attachment = {};
                  attachment['name'] = KMAttachmentToken['filename'];
                  lib.KMAttachment_Index.logError(document, knowledgeBase, attachment, err_str)
                }
                lib.KMAttachmentTokenDAO.deleteById2(kmtoken,KMAttachmentToken['id']);
                continue;             
            }
			if (status != 'Finished' && status != 'Error') {
				lib.KMAttachmentTokenDAO.updateStatus2(kmtoken,KMAttachmentToken['id'], status);
			} else if (status === 'Finished') {
				lib.KMAttachmentTokenDAO.deleteById2(kmtoken,KMAttachmentToken['id']);
			} else if (status === 'Error') {
				var errMsg = xQuery.queryText('responsedata/actions/action/error', xml);
				var knowledgeBase = getKnowledgeBase(KMAttachmentToken['collectionname']);
				var document = {};
				document[knowledgeBase['docid']] = KMAttachmentToken['docid'];
				
				var attachment = {};
				attachment['name'] = KMAttachmentToken['filename'];
				lib.KMAttachment_Index.logError(document, knowledgeBase, attachment, errMsg)
				lib.KMAttachmentTokenDAO.deleteById2(kmtoken,KMAttachmentToken['id']);
			}
		} catch (ex) {
			print(funcs.scmsg('102', 'idol', ex));
		}
	} while (KMAttachmentToken.getNext() === RC_SUCCESS)
}




function getKnowledgeBase(kbname) {
	//get from cache
	var knowledgeBase = knowledgebase_list[kbname];
	if (knowledgeBase) {
		return knowledgeBase;
	}
	//if not found, get from db
	knowledgeBase = new SCFile('kmknowledgebase', SCFILE_READONLY);
	var rc = knowledgeBase.doSelect('kbname="' + kbname + '"');
	if (rc === RC_SUCCESS) {
		//set it to cache
		knowledgebase_list[kbname] = knowledgeBase;
		return knowledgeBase;
	}
	return null;
}