/*
*  These functions are used by kmdocument Process records to perform updates in between a call to se.lock.object 
*    and se.unlock.object 
*/

/**
*   creates a working copy for fKMDocument
*   called by kmdocument.modify
*   param fKMDocument - $L.file record for the document to create a working copy for 
*/

function createWorkingcopy(fKMDocument)
{

	  fKMDocument.assoc_wc_doc = fKMDocument.id + "R";
	
	  system.library.KMUsageHistory.modified(fKMDocument.id);
	  
	
	  // Create a new KM document and read the published version to create a new KM document.
	  vars.$L_workingcopyDoc = new SCFile("kmdocument");
	  system.functions.fduplicate(vars.$L_workingcopyDoc,fKMDocument);
	
	  vars.$L_workingcopyDoc.assoc_wc_doc = null; 
	    
	  // Set the status.
	  vars.$L_workingcopyDoc.status = "revise"; 
	  
	  // Set the associated published doc id.
	  vars.$L_workingcopyDoc.assoc_published_doc = fKMDocument.id; 
	  
	  // Set this working copy's doc id to the published doc id plus "R"; e.g., mark a revision of K36 as K36R
	  vars.$L_workingcopyDoc.id = fKMDocument.id + "R";
	  
	  
	  //after creating the working copy we are going to copy over any attachments to new
	  //attachment records that point to the new id which = old id + R
	  
	  //we now need to go through every RTF field and modify the links to the new id
	  system.library.KMLinksManagement.workingCopyAttachmentsCopy(vars.$L_workingcopyDoc, fKMDocument.id);  
	 
	  // Save the new kmdocument record.
	  rc = vars.$L_workingcopyDoc.doInsert();
	  
	  //then we need to copy over the feedbacks to the new, altered id as well
	  //first thing we need to do is a query to find all the kmfeedback recs that
	  //currently point to the old id and then loop through them to change each one
	  
	  system.library.KMLinksManagement.workingCopyFeedbackCopy(fKMDocument.id);    
	
	var arrayArgs = new SCDatum();
	arrayArgs.setType(8);  //type array
	arrayArgs.push(vars.$L_workingcopyDoc.id);
	print(system.functions.scmsg(130, "km", arrayArgs)); // Working copy document %S was created for revision.
}

// Called by Process kmdocument.retire when retiring internal or external documents
//   from the Search results or the Approved Documents screen.
function retire(fKMDocument)
{
	system.library.KMUsageHistory.retired(fKMDocument.id);
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"retired");
}

// Called by Process kmdocument.repubishexternal when editing internal or external documents 'in place',
//   i.e., after clicking Edit from the Search results or the Approved Documents screen.
function republishexternal(fKMDocument)
{
	fKMDocument.status="external";
	system.library.KMDocPreview.getDocWithView(fKMDocument);
	system.library.KMUsageHistory.modified(fKMDocument.id);
	system.library.KMUsageHistory.approveExternal(fKMDocument.id);
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"external");
}

// Called by Process kmdocument.republishinternal when editing internal or external documents 'in place',
//   i.e., after clicking Edit from the Search results or the Approved Documents screen.
function republishinternal(fKMDocument)
{
	fKMDocument.status="internal";
	system.library.KMDocPreview.getDocWithView(fKMDocument);
	system.library.KMUsageHistory.modified(fKMDocument.id);
    system.library.KMUsageHistory.approveInternal(fKMDocument.id);	
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"internal");
}

// Called by Process kmdocument.approve.ext when 1) editing draft documents 'in place' 
//   i.e., after clicking Edit from the Search results or the Approved Documents screen, or
//   2) editing workingcopy docs if no Change Management license after clicking edit from Working Copy screen (no ChM).
function approveext(fKMDocument)
{
	system.library.KMUsageHistory.approveExternal(fKMDocument.id );
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"external");
}

// Called by Process kmdocument.approve.int when 1) editing draft documents 'in place' 
//   i.e., after clicking Edit from the Search results or the Approved Documents screen, or.
//   2) editing workingcopy docs if no Change Management license after clicking edit from Working Copy screen (no ChM).
function approveint(fKMDocument)
{
	system.library.KMUsageHistory.approveInternal(fKMDocument.id );
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"internal");
}

// Called by Process cm.km.edit when the user clicks Edit on a workingcopy document in the Change Queue 
function cmkmedit(fKMDocument)
{
	// This is coordinated with kmdocument.save.workingcopy cm.km.edit and with this Process's Final Javascript tab
	// Before popping up the kmdocument edit window, save the local copy of this cm3r record's kmdoc 
	//   and we will restore it later with any saved version of the kmdoc
	// For DE2053 - If user cancels, do not show the doc changes under cm3r "KM Document" tab
	vars.$kmdoc = new SCFile("kmdocument"); 
	system.functions.fduplicate(vars.$kmdoc, fKMDocument);
}


// Called by Process cm.km.approveext when the user clicks Approve External for a workingcopy document in the Change Queue 
function cmkmapproveext(fKMDocument,fChMRecord)
{
	fChMRecord.open=false;
	fChMRecord.status="closed";
	fChMRecord.operator=system.functions.operator();
	fChMRecord.doUpdate();
	system.library.KMUsageHistory.approveExternal(fKMDocument.id);
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"external");
	var arrayArgs = new SCDatum();
    arrayArgs.setType(8);  //type array
    arrayArgs.push(fChMRecord.header.number);
    arrayArgs.push(fKMDocument.id);
    print(system.functions.scmsg(344, "cm3", arrayArgs)); // Change yyy Closed. Document KMxxx approved externally.
}

// Called by Process cm.km.approveint when the user clicks Approve Internal for a workingcopy document in the Change Queue 
function cmkmapproveint(fKMDocument,fChMRecord)
{
	fChMRecord.open=false;
	fChMRecord.status="closed";
	fChMRecord.operator=system.functions.operator();
	fChMRecord.doUpdate();
	system.library.KMUsageHistory.approveInternal(fKMDocument.id );
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"internal");
	var arrayArgs = new SCDatum();
    arrayArgs.setType(8);  //type array
    arrayArgs.push(fChMRecord.header.number);
    arrayArgs.push(fKMDocument.id);
    print(system.functions.scmsg(345, "cm3", arrayArgs)); // Change yyy Closed. Document KMxxx approved internally.
}

// Called by Process cm.km.retire when the user clicks Retire for a workingcopy document in the Change Queue 
function cmkmretire(fKMDocument,fChMRecord)
{
	fChMRecord.open=false;
	fChMRecord.status="closed";
	fChMRecord.operator=system.functions.operator();
	fChMRecord.doUpdate();
	system.library.KMUsageHistory.retired(fKMDocument.id );
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"retired");
	var arrayArgs = new SCDatum();
    arrayArgs.setType(8);  //type array
    arrayArgs.push(fChMRecord.header.number);
    arrayArgs.push(fKMDocument.id);
    print(system.functions.scmsg(355, "cm3", arrayArgs)); // Change yyy Closed. Document KMxxx retired.
}

// Called by Process cm.km.revert when the user clicks Revert for a workingcopy document in the Change Queue 
function cmkmrevert(fKMDocument,fChMRecord)
{
	fChMRecord.open=false;
	fChMRecord.status="closed";
	fChMRecord.operator=system.functions.operator();
	fChMRecord.doUpdate();
	system.library.KMUsageHistory.revert(fKMDocument.id );
	system.library.KMDocStatusChanges.KMchangeDocStatus(fKMDocument,"revert");
	var arrayArgs = new SCDatum();
    arrayArgs.setType(8);  //type array
    arrayArgs.push(fChMRecord.header.number);
    arrayArgs.push(fKMDocument.id);
    print(system.functions.scmsg(356, "cm3", arrayArgs)); // Change yyy Closed. Document KMxxx reverted.
}

// Before, we tried to save a DB call by not re-reading the $L.kmdoc 
//   but QC8973 has locking issues because we don't re-read the document, so we must re-read it here
function rereadLkmdoc()
{
	var id = vars.$L_kmdoc.id;
	vars.$L_kmdoc = new SCFile("kmdocument"); 
	var	rc = vars.$L_kmdoc.doSelect("id=\"" + id+"\"");
	if (getLastRC() != RC_SUCCESS ) 
	{
		var arrayArgs = new SCDatum();
		arrayArgs.setType(8);  //type array
		arrayArgs.push("kmdocument");
		arrayArgs.push(RCtoString(getLastRC()));
	
		print(system.functions.scmsg(192, "km", arrayArgs)); // Error reading kmdocument file with return code %S.
	}
}