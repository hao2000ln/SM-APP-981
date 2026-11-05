/**
*	This script library is DAO for table kmattachmentupdates
**/


/**
*	Create a record in table kmattachmenttoken
**/
function create(docId, collectionName, uid, filename, token) {
	var KMAttachmentToken = new SCFile('kmattachmenttoken');
	KMAttachmentToken.docid = docId;
	KMAttachmentToken.collectionname = collectionName;
	KMAttachmentToken.uid = uid;
	KMAttachmentToken.filename = filename;
	KMAttachmentToken.token = token;
	KMAttachmentToken.doInsert();
}


function updateStatus(id, status) {
	var KMAttachmentToken = new SCFile('kmattachmenttoken');
	var rc = KMAttachmentToken.doSelect('id="' + id + '"');
	if (rc === RC_SUCCESS) {
		KMAttachmentToken['status'] = status;
		KMAttachmentToken.doUpdate();
	}
}

function updateStatus2(KMAttachmentToken, id, status) {
    //var KMAttachmentToken = new SCFile('kmattachmenttoken');
    var rc = KMAttachmentToken.doSelect('id="' + id + '"');
    if (rc === RC_SUCCESS) {
        KMAttachmentToken['status'] = status;
        KMAttachmentToken.doUpdate();
    }
}

/**
*	Get all record in table kmattachmenttoken
**/
function getAll() {
	var KMAttachmentToken = new SCFile('kmattachmenttoken');
	var rc = KMAttachmentToken.doSelect('true');
	
	if (rc === RC_SUCCESS) {
		return KMAttachmentToken;
	}
	return null;
}

/**
*	Delete by docname
**/
function deleteById(id) {
	var KMAttachmentToken = new SCFile('kmattachmenttoken');
	KMAttachmentToken.doPurge('id="' + id + '"');
}

function deleteById2(KMAttachmentToken,id) {
    //var KMAttachmentToken = new SCFile('kmattachmenttoken');
    KMAttachmentToken.doPurge('id="' + id + '"');
}

function getCount() {
	var KMAttachmentToken = new SCFile('kmattachmenttoken');
	var count = KMAttachmentToken.doCount('true');
	return count;
}