/**
*	This script library is DAO for table kmattachmentupdates
**/


/**
*	Create a record in table kmattachmentupdates
*	@param {docId} - document id (ticket id)
*	@param {docName} - table name of the document(ticket)
**/
function create(docId, kbname,dbname, isupdate) {
	var newId = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall('getnumber', rcode , newId, 'kmattachmentupdates');
	newId = newId.getText();

	var KMAttachmentUpdates = new SCFile('kmattachmentupdates');
	KMAttachmentUpdates.id = newId;
	KMAttachmentUpdates.docid = docId;
	KMAttachmentUpdates.collectionname = kbname;
	KMAttachmentUpdates.dbname = dbname;
	if(isupdate)
	{
	   KMAttachmentUpdates.isupdate = true;
	}
	else
	{
	   KMAttachmentUpdates.isupdate = false;
	}
	KMAttachmentUpdates.doInsert();
}

/**
*	Get all record in table kmattachmentupdates
**/
function getAll() {
	var KMAttachmentUpdates = new SCFile('kmattachmentupdates');
	var rc = KMAttachmentUpdates.doSelect('true');
	
	if (rc === RC_SUCCESS) {
		return KMAttachmentUpdates;
	}
	return null;
}

/**
*	Delete by docname
**/
function deleteByDocName(docName) {
	var KMAttachmentUpdates = new SCFile('kmattachmentupdates');
	KMAttachmentUpdates.doPurge('collectionname="' + docName + '"');
}