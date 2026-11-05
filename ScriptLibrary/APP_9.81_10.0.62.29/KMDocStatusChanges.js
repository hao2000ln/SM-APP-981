/*  This set of scripts is called when a workingcopy kmdocument record is
*     approved internally or externally, retired, or reverted.
*
*   This is called from these processes:
*     kmdocument.retiredoc
*     kmdocument.revertdoc
*     kmdocument.approve.int
*     kmdocument.approve.ext
*     cm.km.publishext
*     cm.km.publishint
*     cm.km.retire
*     cm.km.revert
*
*   Examples of how to call this script:
*   if (system.library.KMDocStatusChanges.KMchangeDocStatus(vars.$L_kmdoc,"external") == true) ...
*   or
*   system.library.KMDocStatusChanges.KMchangeDocStatus(vars.$L_file,"retired");
*                 
*/

function KMchangeDocStatus(record, newstatus) {
  // If the document is a working copy of a published document,
  // save the wc into the published version, delete the wc,
  // and set staus in published version to newstatus, e.g., 'internal, 'external', 'retired'.

  var rc; // return code
  var fRecord = record;
  if ( newstatus == "revert" )
  {
    // Check to make sure that the user doing the reverting can revert, once cat security is done.

    // The document is a working copy of a published document, so delete the wc.
    // Remove the reference to the published document.

	var cleanupDoc = new SCFile("kmdocument"); 
	rc = cleanupDoc.doSelect( "assoc.wc.doc = \"" + fRecord.id + "\"");   
	if ( rc == RC_SUCCESS )
	{
		rc = cleanupDoc.getFirst();
		while( rc == RC_SUCCESS )
		{
			// This is the published version; clean out the reference to this workingcopy document
			cleanupDoc.assoc_wc_doc = null;
			rc = cleanupDoc.doUpdate();

		    // get the other document, working copy or published
			rc = cleanupDoc.getNext();
		}
	}	
	else
	{
		var arrayArgs = new SCDatum();
		arrayArgs.setType(8);  //type array
		arrayArgs.push(RCtoString(rc));
		print(system.functions.scmsg(60, "km", arrayArgs));
		
	}

	
	//before we revert the doc we need to delete any attachments or feedback that was added to it
	var fbrec = new SCFile("kmfeedback");
	rc = fbrec.doSelect("kmdocumentid=\"" + fRecord.id+"\"");
    if (getLastRC() == RC_SUCCESS)
    {
  	    rc = fbrec.getFirst();
        while (getLastRC() == RC_SUCCESS)
        {
			rc = fbrec.doDelete();
            rc = fbrec.getNext();
        }
    }
	
	
	
	
	var theAttach = new SCFile("SYSATTACHMENTS");
    rc = theAttach.doSelect("topic=\"" + fRecord.id + "\" and application=\"kmdocument\"");
    if (getLastRC() == RC_SUCCESS)
    {
  	    rc = theAttach.getFirst();
        while (getLastRC() == RC_SUCCESS)
        {
			rc = theAttach.doDelete();
            rc = theAttach.getNext();
        }
    }
	
  }
  
  else if ( newstatus == "deleted" )
  {
	//before we revert the doc we need to delete any attachments or feedback that was added to it
	var fbrec = new SCFile("kmfeedback");
	rc = fbrec.doSelect("kmdocumentid=\"" + fRecord.id+"\"");
    if (getLastRC() == RC_SUCCESS)
    {
  	    rc = fbrec.getFirst();
        while (getLastRC() == RC_SUCCESS)
        {
			rc = fbrec.doDelete();
            rc = fbrec.getNext();
        }
    }
	
	var theAttach = new SCFile("SYSATTACHMENTS");
    rc = theAttach.doSelect("topic=\"" + fRecord.id + "\" and application=\"kmdocument\"");
    if (getLastRC() == RC_SUCCESS)
    {
  	    rc = theAttach.getFirst();
        while (getLastRC() == RC_SUCCESS)
        {
			rc = theAttach.doDelete();
            rc = theAttach.getNext();
        }
    }
	
  }
  
  else  // old status 'candidate' or 'workingcopy'; newstatus is 'internal, 'external', or 'retired'
  {
      	
	  
	  // Save the ids of this doc and published docs for the code and for a possible error message. 
	  var savedDocId = fRecord.id; // This doc's id.
	  var savedDocStatus = fRecord.status; // This doc's status.
	  var savedPublishedId = fRecord.assoc_published_doc; // Published id for this doc, if one exists.
	  
	  // Check for working copy and for candidates, and then error check for anything else. 
	  
	  // A new candidate document has no published version
	  if ( (fRecord.status == "candidate" || fRecord.status == "workingcopy" || fRecord.status == "triage" || fRecord.status == "revise" || 
	  				fRecord.status == "review" || fRecord.status == "conclude") && fRecord.assoc_published_doc == null )
	  {
		// OK to just change the status of this document, never published.
	  	fRecord.status = newstatus;
	  	if (newstatus == "retired") // note the categories and the retirement in a feedback
			system.library.KMDocStatusChanges.retiredCleanup(fRecord);
	  	rc = fRecord.doUpdate();
	  	
			
	  }
	  else if ( (fRecord.status == "workingcopy" || fRecord.status == "triage" || fRecord.status == "revise" || 
	  				fRecord.status == "review" || fRecord.status == "conclude") && fRecord.assoc_published_doc != null)
	  {
	    // else if a working copy document has an approved version
	  	//overwrite it"
	 
	  	
	  	
	  	var fKMDoc = fRecord;
	  	var pub = new SCFile("kmdocument");
	  	var sql = "id=\""+fRecord.assoc_published_doc+"\"";
	  	if ( pub.doSelect( sql ) == RC_SUCCESS )
	  	{
	  	    var dbchanged = checkKMDatabaseChanged("kmdocument",pub,fRecord);
	  		var pubret = pub.doDelete();
	  		if (pubret==RC_SUCCESS)
	  		{
	  			//QCCR79760
	  			if(!dbchanged)
	  			{
	  			   republishWorkingcopyInUpdates(fRecord);
	  			}
	  		}
	  	}
	  	
	  	fKMDoc.id = fRecord.assoc_published_doc;
	  	fKMDoc.status = newstatus;
	  	fKMDoc.assoc_published_doc = null;
	  	fKMDoc.assoc_wc_doc = null;
	  	if (newstatus == "retired") // leave a feedback
			system.library.KMDocStatusChanges.retiredCleanup(fKMDoc);	
				
		//make the "R" revision id links into  regular id links
		system.library.KMLinksManagement.removeRevisionIDFromLinks(fKMDoc);

		tmpRec=new SCFile("kmdocument");
		
		var fieldArray = new Datum();
		fieldArray.setType(8);
		fieldArray.push("links");
		
		var unused =system.functions.recordcopy(fKMDoc, fieldArray, tmpRec, fieldArray);
		
	  	
	  	
		if(fKMDoc.links.length()==0)//saftey dance
		{
			print("KMDocStatusChanges: fKMDoc.links.length()==0, doUpdate!");
			unused=system.functions.recordcopy(tmpRec, fieldArray, fKMDoc, fieldArray);
		}
			rc = fKMDoc.doUpdate();		
	  	  	
	  	// Delete the working copy version of the document.
		//but before we do THAT we need to copy over the working copy stuff to the pub doc
		//easiest way to achieve this is to first delete all the feedback and attachments on the pub doc...
  	
    	// Modify by QCCR1E57261 start, when the new status is not equals internal, then delete the feedback.Old code delete all feedback. 
		if (newstatus != "internal" ){                         
			var fbrec = new SCFile("kmfeedback"); 
			rc = fbrec.doSelect("kmdocumentid=\"" + fKMDoc.id+"\""); 
            if (getLastRC() == RC_SUCCESS) 
    		{ 
                    rc = fbrec.getFirst(); 
        			while (getLastRC() == RC_SUCCESS) 
                	{ 
						rc = fbrec.doDelete(); 
                    	rc = fbrec.getNext(); 
        			} 
            } 
          } 
         // Modify by QCCR1E57261 end 
    	
	   
		var theAttach = new SCFile("SYSATTACHMENTS");
    	rc = theAttach.doSelect("topic=\"" + fKMDoc.id + "\" and application=\"kmdocument\"");
	    if (getLastRC() == RC_SUCCESS)
    	{
    	    
  	    	rc = theAttach.getFirst();
  	    	
	        while (getLastRC() == RC_SUCCESS)
	         {
	         
				rc = theAttach.doDelete();
            	rc = theAttach.getNext();
	        }
    	}
    	//...then change the document ids referenced from +R numbers to just the pub doc ids  	
    	// Modify by QCCR1E57261 start, when the new status is equals internal,delete the +R numbers.

		// OCTCR19XW2501270, when the status as internal or external, then delete the +R numbers
		if (newstatus === "internal" || newstatus === "external") {
			if ((savedDocId.endsWith("R") || savedDocId.endsWith("r"))) {
				savedDocId = savedDocId.slice(0, -1);
			}
		}

		        if (newstatus == "internal"){        
			fbrec = new SCFile("kmfeedback"); 
			rc = fbrec.doSelect("kmdocumentid=\"" + savedDocId+"\""); 
            if (getLastRC() == RC_SUCCESS) 
		    { 
                    rc = fbrec.getFirst(); 
        			while (getLastRC() == RC_SUCCESS) 
                	{ 
						rc = fbrec.doDelete(); 
	                    rc = fbrec.getNext(); 
        			} 
            } 
         }else{// when the new status is not equals internal, then update the feedback. This is old code 
                fbrec = new SCFile("kmfeedback"); 
				rc = fbrec.doSelect("kmdocumentid=\"" + savedDocId+"\""); 
				if (getLastRC() == RC_SUCCESS) 
				{ 
					    rc = fbrec.getFirst(); 
				        while (getLastRC() == RC_SUCCESS) 
				        { 
							fbrec.kmdocumentid = fKMDoc.id; 
							rc = fbrec.doUpdate(); 
				            rc = fbrec.getNext(); 
				        } 
            	} 
         } 
		// Modify by QCCR1E57261 end 
    	
    	
	 
	   
	    theAttach = new SCFile("SYSATTACHMENTS");
    	rc = theAttach.doSelect("topic=\"" + savedDocId + "\" and application=\"kmdocument\"");
    	
	    if (getLastRC() == RC_SUCCESS)
    	{
  	    	
  	    	rc = theAttach.getFirst();
  	    	
	        while (getLastRC() == RC_SUCCESS)
    	    {
				theAttach.topic = fKMDoc.id;
				rc = theAttach.doUpdate();
            	rc = theAttach.getNext();
	        }
    	}
    	
 
    	
	  	savedDocIdToRetire = savedPublishedId;
	  }
	  else 	if (newstatus == "retired") // leave a feedback
	  {
			system.library.KMDocStatusChanges.retiredCleanup(fRecord);
			fRecord.status = "retired";
	  }
	  else
	  {  	
	  	// Things are not right with this document.
	  	// It might have a funny status of internal, but we need to set status to newstatus and cleanup below.
	  	
	  	// The safest thing to do is to just change the status of this document.
	  	
		fRecord.status = newstatus;
		rc = fRecord.doUpdate();
			
	  }
	  
	  // General clean up just in case.
	  // If any document lists this document as a published version or as a working copy version,
	  // then remove the reference to this document that we're retiring/approving.
		  	
	  // Look in the database for any document that lists this document 
	  //  as its wc version or pub version and remove the reference.
	 
	  // This doc should not have a working copy associated with it. It's already IN a workflow.
	  // So fRecord.assoc_wc_doc should be null. We're just checking.
	
	  var cleanupDoc = new SCFile("kmdocument"); 
	  rc = cleanupDoc.doSelect( "assoc.published.doc = \"" + savedDocId + "\" or assoc.wc.doc = \"" + savedDocId + "\"");   
	  if( rc == RC_SUCCESS )
	  {
			rc = cleanupDoc.getFirst();
			while( rc == RC_SUCCESS )
			{
			  cleanupDoc.assoc_published_doc = null;
			  cleanupDoc.assoc_wc_doc = null;
			  rc = cleanupDoc.doUpdate();   
			  rc = cleanupDoc.getNext();
			}
	  }
   }
   return true;
}

function retiredCleanup(record)
{
	// Retain any approval categories and leave a feedback that lists
	//   the categories when the doc was retired.

	var fFB = new SCFile("kmfeedback");
	fFB.kmdocumentid = record.id;
	var catList = "";
	var nbrCats = record.categories.length();
	if ( nbrCats > 0 )
	{
		for ( var loopindex = 0; loopindex < nbrCats; ++loopindex )
			catList += record.generatedcats[loopindex] + "; ";
			
		var arrayArgs = new SCDatum();
		arrayArgs.setType(8);  //type array
		arrayArgs.push(catList);
        fFB.feedbacktext = system.functions.scmsg(62, "km", arrayArgs);	
 		
 		//QCCR1E80241 
        fFB.createtime=system.functions.tod();
        fFB.author= system.functions.nullsub(system.functions.operator(), "NULL");
 		//end
 		
		var callRtn = new SCDatum;
		var nextNumber = new SCDatum;
		system.functions.rtecall("getnumber", callRtn, nextNumber, "kmfeedback");

		var strID = nextNumber.getText();
		if (!isNaN(strID))
		{
			fFB.id = parseInt(strID);
			var rcinsert = fFB.doInsert();	
		}
	}		
}


function generateCatsForDoc(record)
{
	// This function is called by the function checkForTwoNodesInSameCatTree (below) 
	//   and in the process kmdocument.view.init. 
	// It generates the readable categories for this kmdocument record by reading 
	//   each item in the kmdocument categories array, e.g., KM004T:KM006T and 
	//   generates the readable equivalent HR > Policy for the generatedcats array.
	var catIndex;
	var catId;
	// Need to clear out and then initialize generatedcats
	var docCatArrayLength = system.functions.lng(system.functions.denull(record.generatedcats));
	for( catIndex = 0; catIndex < docCatArrayLength; catIndex++ )
		catId = record.generatedcats.pop(); // Clear out the generated array of categories.
	record.generatedcats.pop();  // once more if a null one is there
		
	// To initialize generatedcats, loop through all the category ids in 
	//   the categories column and fill in the pathname + " > " + name 
	//   in generatedcats
	docCatArrayLength = system.functions.lng(system.functions.denull(record.categories));
	
	for( catIndex = 0; catIndex < docCatArrayLength; catIndex++ )
	{
		
	  	catId = record.categories[catIndex];
	  	var spec_loc = catId.indexOf(":");
	  	var tempString = "";
		
		
		 
		while (spec_loc >= 0)
		{
		    tempString = catId.substring(spec_loc+1, catId.length);
		    catId = tempString;
		    spec_loc = catId.indexOf(":");   
			
			
		}
		    
		    
		// Get the kmcategory record for this id.
		var kmcategoryFile = new SCFile("kmcategory");
	    var catRC = kmcategoryFile.doSelect( "id=\"" + catId + "\"" );  
		if ( catRC == RC_SUCCESS )
		{
			var pathname;
			catRC = kmcategoryFile.getFirst();
			if (kmcategoryFile.pathname == null || kmcategoryFile.pathname == "")
				pathname = kmcategoryFile.name;
			else
				pathname = kmcategoryFile.pathname + " > " + kmcategoryFile.name;
			record.generatedcats.push(pathname);
		}
		else
		{
			var arrayArgs = new SCDatum();
			arrayArgs.setType(8);  //type array
			arrayArgs.push(catId);
			print(system.functions.scmsg(143, "km", arrayArgs)); // Cannot find kmcategory with id = catId		
		}
		
		
	}
}

function checkForTwoNodesInSameCatTree(record)
{
	// Before a doc in multiple categories can be saved, ensure that an 
	//   approval category occurs only one place on a tree, that is, 
	//   do not allow Cat 5 and also Cat 5 > Cat 6 to be added. 
	// Insist that the user correct this.
	
	// Return an empty string if all is well, otherwise return the error message
	// "You cannot choose two approval categories in the same hierarchy. Please remove one of these: ..."
	var catErrorStr = "";
	if (record.categories != null)
	{
		var catArray = system.functions.denull(record.categories); // Remove blank entries in cat ids
		system.library.KMDocStatusChanges.generateCatsForDoc(record);
		var catNameArray = system.functions.denull(record.generatedcats); // cat names
		var nbrCats = catArray.length();
		if (nbrCats > 0)
		{
			for( i=0; i < nbrCats && catErrorStr==""; i++ )
			{
				var cat = catArray[i];
				for( j=0; j < nbrCats && catErrorStr==""; j++ )
				{
					if(i != j && cat.indexOf(catArray[j]) >= 0) 
					{
						var arrayArgs = new SCDatum();
						arrayArgs.setType(8);  //type array
						arrayArgs.push(catNameArray[i]);
						arrayArgs.push(catNameArray[j]);
        				catErrorStr = system.functions.scmsg(63, "km", arrayArgs);
  					}
				}
			}	
		}
		else 
			catErrorStr = system.functions.scmsg(64, "km");
	}
	else	
		catErrorStr = system.functions.scmsg(64, "km");

	return 	catErrorStr;
}

function checkCatPermissions(record, newstatus) {
	// Before a doc in multiple categories can be approved or retired,
	//   ensure that the operator has rights in all categories.
	
	// Return an empty string if all is well, otherwise return the unowned cat list message.

	
	var errorChkStr = "";
	var chkArray = new SCDatum();
	chkArray.setType(8);
	var prefixStr = system.functions.scmsg(139, "km"); // You do not have rights on one or more categories: 
	if (record.categories != null)
	{
		var catArray = system.functions.denull(record.categories); // Remove blank entries in cat ids
		var catNameArray = system.functions.denull(record.generatedcats); // cat names
		var nbrCats = catArray.length();
		if (nbrCats > 0)
		{
			// An admin can approve or retire anywhere.
			if (system.functions.index("SysAdmin", vars.$lo_ucapex) > 0 ||
			    system.functions.index("KMAdmin", vars.$lo_ucapex) > 0 )
				return errorChkStr;

			// No category error checking on a draft.document
			if (newstatus == "draft")
				return errorChkStr;
				
			// Operator is a KCS II or III, not an admin.
			if (newstatus == "external")
				chkArray = vars.$G_appintext;       // array of external approval cats for this KCS III
			else if (newstatus == "internal")
				chkArray = vars.$G_filterAppWcRet;	// array of internal approval cats for this KCS II
			else if (newstatus == "retired")
				chkArray = vars.$G_retire;		    // array of retire cats for this KCS II/III
			else if (newstatus == "deleted")
				chkArray = vars.$G_deleteCats;      // array of delete-able cats for this KCS II/III
				
			// Loop through all the categories for this document
			for( i=0; i < nbrCats; i++ )
			{
				var foundOne = false;
				var cat = catArray[i];
				for( j=0; j < chkArray.length() && !foundOne; j++ )
				{				
					// The document's category id KM01T:KM07T must start with a chkArray cat id, such as KM01T
					var chkCat = chkArray[j];
					
					if( chkCat == cat.substring(0,chkCat.length) )  
						foundOne = true;
				}
				if (!foundOne)
  					errorChkStr += catNameArray[i] + "; ";				
			}	
			if (errorChkStr != "")
				errorChkStr = prefixStr + errorChkStr;
		}
		else 
			errorChkStr = system.functions.scmsg(64, "km"); // You must specify an approval category under the Categorization / Flags tab.
	}
	else	
		errorChkStr = system.functions.scmsg(64, "km"); // You must specify an approval category under the Categorization / Flags tab.

	return 	errorChkStr;
}

// Return true if:
//		the kmdocument has a title
//		the kmdocument has an approval category
//		if multiple categories, that an approval category occurs only one place on a tree
//		the operator has the right to change the status to newstatus (e.g., retired) in all categories
// Otherwise, return false
function checkValidity(record, newstatus) {
	var validtosave = false;
	
	var msg = new SCDatum();
	system.functions.rtecall("checkxss",null,msg, record, false);
	if(!system.functions._null(msg)) {
		system.library.KMUtils.domessageBox(msg, 3 /*Error Type*/);
		return false; 
	}
	
	var rtnStr = "";
	if (record.title == null || record.title == "") {
		system.library.KMUtils.domessageBox(system.functions.scmsg(138, "km")); // You must specify a title.
	} else if (record.categories == null || system.functions.lng(system.functions.denull(record.categories))==0) {
		system.library.KMUtils.domessageBox(system.functions.scmsg(64, "km")); // You must specify an approval category under the Categorization / Flags tab.
	} else {
		rtnStr = system.library.KMDocStatusChanges.checkForTwoNodesInSameCatTree(record);
		if (rtnStr != "")
			system.library.KMUtils.domessageBox(rtnStr);
		else 
		{
			if (newstatus != "workingcopy") // No check here for rights; the action the user will take in ChM is not yet known
			{
				rtnStr = system.library.KMDocStatusChanges.checkCatPermissions(record, newstatus);
				if (rtnStr != "")
					system.library.KMUtils.domessageBox(rtnStr);
				else
					validtosave = true;
			}
			else
			{
				validtosave = true;
			}
		}
	}
	return validtosave;
}

function checkKMDatabaseChanged(filename, record, newrecord)
{
   var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
   if(kmFiles.length < 2 )
   {
     //never could change
     return false;
   }
    var i = 0;
    var iold = -1;
    var inew = -1;
	var found = false;
	while (i < kmFiles.length) 
	{
		var kmFile = kmFiles[i].file;
		var kmQuery = kmFile.scquery;
		if (!kmFile.scquery) 
		{
		   return false;
		}
		else 
		{
			if (iold == -1 && funcs.evaluate_query(kmQuery, record) )
			{
			  iold = i;
			}
			if (inew == -1 && funcs.evaluate_query(kmQuery, newrecord) )
			{
			  inew = i;
			}
		}
		if(iold > -1 && inew > -1)
		{
		  break;
		}
		i++;
	}
	if(iold != inew)
	{
	   return true;
	}
	
	return false;	
}
function republishWorkingcopyInUpdates(record)
{
	 
	 var kmuFile = new SCFile("kmknowledgebaseupdates");
     var kmuFind = kmuFile.doSelect("docid = \""+record.id+"\" and collectionname = \"Knowledge_Library\"");
     if (kmuFind == RC_SUCCESS)
     {
        kmuFind = kmuFile.getFirst();
        if (kmuFind == RC_SUCCESS)
        {
           print("Update D Working copy...."+record.id);
           kmuFile.action = "D";
           kmuFile.sedocid = "Knowledge_Library_"+record.id+'_0';
           kmuFile.doUpdate();
        }     	
     }
     else
     {
     	
     	kmuFile.id = system.library.KMCollection_Update_Utils.getNextKMUpdateId();
		kmuFile.collectionname = "Knowledge_Library";
		kmuFile.docid = record.id;
        kmuFile.recdata = system.library.KMUtils.recordToXML(record);
		kmuFile.action = "D";
		kmuFile.sedocid = "Knowledge_Library_"+record.id+'_0';
		kmuFile.doInsert();
     }
     
     
     var newkmuFile = new SCFile("kmknowledgebaseupdates");
     var kmuFind = newkmuFile.doSelect("docid = \""+record.assoc_published_doc+"\" and collectionname = \"Knowledge_Library\"");
     if (kmuFind == RC_SUCCESS)
     {
        kmuFind = newkmuFile.getFirst();
        if (kmuFind == RC_SUCCESS)
        {
            
            newkmuFile.action = "U";
            newkmuFile.sedocid = "Knowledge_Library_"+record.assoc_published_doc+'_0';
            newkmuFile.doUpdate();
        }     	
     }
     else
     {
     	
     	newkmuFile.id = system.library.KMCollection_Update_Utils.getNextKMUpdateId();
		newkmuFile.collectionname = "Knowledge_Library";
		newkmuFile.docid = record.assoc_published_doc;
        newkmuFile.recdata = system.library.KMUtils.recordToXML(record);
		newkmuFile.action = "U";
		newkmuFile.sedocid = "Knowledge_Library_"+record.assoc_published_doc+'_0';
		newkmuFile.doInsert();
     }
     
}
