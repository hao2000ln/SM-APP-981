/*   @author Tony Bray
 *
 *   Package: KMAdmin
 *
 *   Description: This library contains the default triggers for KM.  All indexed
 *   tables use these triggers.
 *
 */
var _evaluate_query = funcs.evaluate_query;
var $ = lib.c.$;
var logger = getLog("KMCollectionUpdateTriggers");

function KMCollection_Update_Triggers() {}

function isDuplicate(name, docid)
 {
   var f = new SCFile("kmattachmentupdates", SCFILE_READONLY);
   f.setFields(["id"]);
   var count = f.doCount('collectionname="'+name+'" and docid="'+docid+'"');
   if(count > 0)
   {
     return true;
   }
   return false;
 }
 
function dumpAttachment(collectionFile, sclibFile, isupdate) {
	if (vars['$G.kmsearchengine'] !== "IDOL") {
		return;
	}

	var doc_id = sclibFile[collectionFile.docid];
	if (logger.isDebugEnabled()) {
        logger.debug(`dump attachment for "${doc_id}".`);
    }

	var indexattach = collectionFile.indexattachments;
	var doc_type = sclibFile.doctype;
	if (indexattach == true || doc_type == "external") {
	    //only not duplicate, insert the attachment for it
        if(!isDuplicate(collectionFile.kbname,doc_id)) {
		  var fAttachments = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
		  fAttachments.setFields(["application"]);
		  var rc = fAttachments.doSelect("application=\"" + collectionFile.sclibtablename + "\" and topic=\"" + doc_id + "\" and segment=0");

		  if (RC_SUCCESS == rc || isupdate) {
			 lib.KMAttachmentUpdatesDAO.create(doc_id, collectionFile.kbname, collectionFile.kbname, isupdate);
		  }
	   }

	}

}

/*
 *  check file extension defined in kmknowledgebase
 */
function checkFileExt(knowledgeBase, filename) {
    var ext = filename.substr(filename.lastIndexOf(".")+1);
    if (ext) {
        ext = ext.toLowerCase();
    }
    var blackList = knowledgeBase.skipexts;

    if (blackList) {
        var blackArray = blackList.split(';');
        var i;
        for (i = 0; i < blackArray.length; i++) {
            if (ext.toLowerCase() === blackArray[i].toLowerCase()) {
                return false;
            }
        }
    }

    return true;
}

function deleteAttachmentBeforeUpdate(collectionFile, sclibFile)
{
   var doc_id = sclibFile[collectionFile.docid];
   var f = new SCFile('kmattachmentbeforeupdate');
   var rc = f.doPurge('collectionname="'+collectionFile.kbname+'" and docid="'+doc_id+'"'); 
}

function isBeforeUpdateDuplicate(name, docid)
{
   var f = new SCFile('kmattachmentbeforeupdate', SCFILE_READONLY);
   f.setFields(["id"]);
   var rc = f.doCount('collectionname="'+name+'" and docid="'+docid+'"'); 
   if(rc > 0) {
     return true;
   }
   return false;
}

function dumpAttachmentBeforeUpdate(collectionFile, sclibFile) {
    if (vars['$G.kmsearchengine'] !== "IDOL") {
        return;
    }
    var doc_id = sclibFile[collectionFile.docid];
    if (logger.isDebugEnabled()) {
        logger.debug(`dump attachment before update for "${doc_id}".`);
    }

    var indexattach = collectionFile.indexattachments;
    var doc_type = sclibFile.doctype;
    
    if (logger.isDebugEnabled()) {
        logger.debug(`index attachment: ${indexattach}`);
        logger.debug(`document type: ${doc_type}`);
    }
    
    if (indexattach == true || doc_type == "external") 
    {
       if(!isBeforeUpdateDuplicate(collectionFile.kbname,doc_id))
       {
        var fAttachments = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
        fAttachments.setFields(["uid","filename"]);
        var rc = fAttachments.doSelect("application=\"" + collectionFile.sclibtablename + "\" and topic=\"" + doc_id + "\" and segment=0");
        var uids =[];
        var names=[];
        while (RC_SUCCESS == rc) 
        {
           if(checkFileExt(collectionFile, fAttachments["filename"]))
           {
             uids.push("cid:"+fAttachments["uid"]);
             names.push(fAttachments["filename"]);
           }
           rc = fAttachments.getNext();
         }
         var KMAttachmentBeforeUpdate = new SCFile('kmattachmentbeforeupdate');
         var i;
         for(i=0;i<uids.length; i++)
         {
            KMAttachmentBeforeUpdate.uids[i]=uids[i];
            KMAttachmentBeforeUpdate.names[i]=names[i];
         }
  
         var newId = new Datum();
         var rcode = new Datum();
         rcode = funcs.rtecall('getnumber', rcode , newId, 'kmattachmentbeforeupdate');
         newId = newId.getText();
         KMAttachmentBeforeUpdate.id = newId;
         KMAttachmentBeforeUpdate.docid = doc_id;
         KMAttachmentBeforeUpdate.collectionname = collectionFile.kbname;
         KMAttachmentBeforeUpdate.dbname = collectionFile.kbname;
         KMAttachmentBeforeUpdate.doInsert();
      }
    }

}

function kmtriggerAfterAdd(filename, record) {
	//When adding, no need to check for old version since there isn't one
	//Query kmknowledgebase for the filename.
	//iterate through the returned records and get the stored query and the
	//field specified to be the doc_id
	//run each query + doc_id = docid from record
	//if we get a record back, add a new record to kmknowledgebaseupdates
	//with collectionname, docid, and action = "U"

	if(!lib.KMUtils.isIndexedFile(filename)) {
		return;
	}
	
	var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
	var i = 0;
	while (i < kmFiles.length) {
		var kmFile = kmFiles[i].file;
		var kmQuery = kmFile.scquery;
		var scquery = "true";
		scquery = kmQuery;
		if (scquery == null) {
			scquery = "";
		}
		else {
			scquery = "(" + scquery + ") and ";
		}

		var fQuery = scquery + kmFile.docid + " = \"" + record[kmFile.docid] + "\"";
		if (_evaluate_query(fQuery, record)) {
			//doc matches the query, we need to add it's docid, filename, and action
			//to the update table
			var kmuFile = new SCFile("kmknowledgebaseupdates");
			kmuFile.id = lib.KMCollection_Update_Utils.getNextKMUpdateId();
			kmuFile.collectionname = kmFile.kbname;
			kmuFile.docid = record[kmFile.docid] + '';
			kmuFile.recdata = lib.KMUtils.recordToXML(record);
			kmuFile.action = "U";
			kmuFile.sedocid = kmFile.kbname + "_" + (record[kmFile.docid] + '_0');
			kmuFile.doInsert();
			dumpAttachment(kmFile, record, false);
			
			checkPortalLanguage(kmFile, record);
		}
		i += 1;
	}
	
    if(filename == "joinsvcDisplay")
    {
      lib.RunRestfulEntitlement.addCatalogAccessFilterCache(record);
    }
}

function insertKMUpdateRecord(record, kmFile, action, onlyInsert)
{
   var docid = record[kmFile.docid] + '';
   var kmuFile = new SCFile("kmknowledgebaseupdates"); 
   var rc = kmuFile.doSelect('docid="'+docid+'" and collectionname="'+kmFile.kbname+'"');
   if(rc != RC_SUCCESS)
   {              
     kmuFile.id = lib.KMCollection_Update_Utils.getNextKMUpdateId();
   }
   else if(onlyInsert)
   {
     //only insert, nothing to do
     return;
   } 
   kmuFile.collectionname = kmFile.kbname;
   kmuFile.docid = record[kmFile.docid] + '';
   //kmuFile.sedocid = lib.KMUtils.scToJSName(kmFile.kbname)+"_"+(record[kmFile.docid]+"_0");
   kmuFile.recdata = lib.KMUtils.recordToXML(record);
   kmuFile.action = action;
   kmuFile.sedocid = kmFile.kbname+"_"+(record[kmFile.docid]+"_0");
   if(rc != RC_SUCCESS)
   {
     kmuFile.doInsert();
   }
   else
   {
     kmuFile.doUpdate();
   }
}

function isAttachmentChanged(collectionFile,record)
{
   var attachments = record.getAttachments();
   var uids =[];
   var i;
   for(i=0;attachments && i<attachments.length;i++)
   {
     if(checkFileExt(collectionFile, attachments[i].name))
     {
       uids.push(attachments[i].href);
     }
   }
   var doc_id = record[collectionFile.docid];
   var f = new SCFile('kmattachmentbeforeupdate', SCFILE_READONLY);
   f.setFields(["uids"]);
   
   var rc = f.doSelect('collectionname="'+collectionFile.kbname+'" and docid="'+doc_id+'"'); 
   var olduids =[];
   if(rc == RC_SUCCESS && f.uids != null)
   {
      olduids = f.uids.toArray();
   }
   if(uids.length != olduids.length)
   {
     return true;
   }
   
   for(i=0;i<uids.length;i++)
   {
      var isfind = false;
      var j;
      for(j=0;j<olduids.length;j++)
      {
         if(uids[i] == olduids[j])
         {
           isfind = true;
           break;
         }
      }
      if(!isfind)
      {
        return true;
      }
   }
  return false;
}

//use one call to handle update
function kmtriggerForUpdate(filename, record, oldrecord)
{
    if (!lib.KMUtils.isIndexedFile(filename)) {
        return;
    }

    var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
    var i = 0;
    while (i < kmFiles.length) 
    {
         var kmFile = kmFiles[i].file;
 
          var kmQuery = kmFile.scquery;
          var scquery = "true";
          if (kmQuery) {
              scquery = kmQuery;
          }
          var beforeaction = 'F';
          if(funcs.evaluate_query(scquery, oldrecord))
          {
              beforeaction ='T';
          }
          var afteraction ='F';
          if(funcs.evaluate_query(scquery, record))
          {
            afteraction ='T';
          }
            // both match is update
         if (beforeaction == "T" && afteraction == "T") 
         {
           insertKMUpdateRecord(record, kmFile, "U"); 
           if(isAttachmentChanged(kmFile,record))
           {
             dumpAttachment(kmFile,record,true);
           }
           else
           {
             deleteAttachmentBeforeUpdate(kmFile,record);
           }
         } //if we didn't match before but we do now, it's an insert
         else if (beforeaction == "F" && afteraction == "T" )
         {
            insertKMUpdateRecord(record, kmFile, "U");     
            dumpAttachment(kmFile,record,false);
         }//if we matched before but not after, it's a delete
         else if (beforeaction == "T" && afteraction == "F")
         {
            insertKMUpdateRecord(oldrecord, kmFile, "D");     
            //dumpAttachment(kmFile,record,true);
            //deleteAttachmentBeforeUpdate(kmFile, oldrecord);
            //dumpAttachmentBeforeUpdate(kmFile, oldrecord);
         }
           //if we didn't match before or after, no action is needed, delete the record from the update table
        else if (beforeaction == "F" && afteraction == "F")
        {
          //nothing to do
        }     
                    
         i++;
    }
    if(filename == "joinsvcDisplay" && record["access.filter"] != oldrecord["access.filter"])
    {
      lib.RunRestfulEntitlement.modifyCatalogAccessFilterCache(oldrecord, record);
    }
}

function kmtriggerBeforeUpdate(filename, record) {
    
	//Query kmknowledgebase for the filename.
	//iterate through the returned records and get the stored query and the
	//field specified to be the doc_id
	//run each query + doc_id = docid from record
	//if we get a record back, add a new record to kmknowledgebaseupdates
	//with collectionname, docid, and action = true
	//otherwise, add a new record to kmknowledgebaseupdates
	//with collectionname, docid, and action = false

	if(!lib.KMUtils.isIndexedFile(filename)) {
		return;
	}
	
	var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
	var i = 0;
	while (i < kmFiles.length) {
		var kmFile = kmFiles[i].file;
		var kmQuery = kmFile.scquery;
		var scquery = "true";
		scquery = kmQuery;
		if (scquery == null) {
			scquery = "";
		}
		else {
			scquery = "(" + scquery + ") and ";
		}
		var fQuery = scquery + kmFile.docid + " = \"" + record[kmFile.docid] + "\"";
//		var kbuSql = "docid = \"" + record[kmFile.docid] + "\" and collectionname = \"" + kmFile.kbname + "\" ";
		if (_evaluate_query(fQuery, record)) {
            dumpAttachmentBeforeUpdate(kmFile, record);
        }
        // check for multiple categories here
        i += 1;
    }
}

function kmtriggerAfterUpdate(filename, record) {

	//Query kmknowledgebase for the filename.
	//iterate through the returned records and get the stored query and the
	//field specified to be the doc_id
	//run each query + doc_id = docid from record
	//if we get a record back, set a flag to true, else set it to false.
	//Query the update table where docid=docid, collection=collection, and
	//action = true or false.
	// if action = true and flag = true, then change action=true to action=U
	// if action = true and flag = false, then change action=true to action=D
	// if action = false and flag = true, then change action=false to action=U
	// if action = false and flag = false, delete the current record from the update table

	if(!lib.KMUtils.isIndexedFile(filename)) {
		return;
	}
	
	var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
	var i = 0;
	while (i < kmFiles.length) {
		var kmFile = kmFiles[i].file;
		var kmQuery = kmFile.scquery;
		var scquery = "true";
		scquery = kmQuery;
		if (scquery == null) {
			scquery = "";
		}
		else {
			scquery = "(" + scquery + ") and ";
		}
		var fQuery = scquery + kmFile.docid + " = \"" + record[kmFile.docid] + "\"";
		var match = "F";
		if (_evaluate_query(fQuery, record)) {
			match = "T";
		} else {
			match = "F";
		}

		//match is T or F depending on whether the new doc matched a query
		//now we need to know if it matched before the update
		//var kmuFile = new SCFile("kmknowledgebaseupdates");
		/**
		 * QCCR1E89815 The kmknowledgebaseupdates table becomes corrupt
		 * change the query string, add "()" in action condition
		 * if the query string is not correct, it will cause the model name and filename conflict,
		 * error happens when KMUpdates process records in kmknowledgebaseupdates table.
		 */
		var kbuSql = "docid = \"" + record[kmFile.docid] + "\" and collectionname = \"" + kmFile.kbname + "\" and (action = \"T\" or action = \"F\" or action=\"D\")";
		var kmuFile = $.cachedSelect("kmknowledgebaseupdates", kbuSql);
		if (kmuFile) {
			//if we matched before and after, it's an update
			if ((kmuFile.action == "T" || kmuFile.action == "D") && match == "T") {

				kmuFile.action = "U";
				kmuFile.recdata = lib.KMUtils.recordToXML(record);
				kmuFile.doUpdate();
				dumpAttachment(kmFile, record, true);
			}
			//if we matched before but not after, it's a delete
			if (kmuFile.action == "T" && match == "F") {
				kmuFile = $.cachedSelect("kmknowledgebaseupdates", "sedocid = \"" + kmFile.kbname + "_" + record[kmFile.docid] + "_0\" and action = \"D\"");
				if (kmuFile) {
					// we already have a delete record with this id
					//check for multiple categories, delete master if multiple
					/**
					 * QCCR1E89815 The kmknowledgebaseupdates table becomes corrupt
					 */
					kmuFile = $.cachedSelect("kmknowledgebaseupdates", "docid = \"" + record[kmFile.docid] + "\" and collectionname = \"" + kmFile.kbname + "\" and (action = \"T\" or action = \"F\")");
					if (kmuFile) {
						dumpAttachment(kmFile, record, true);
						kmuFile.doDelete();
					}
				} else {
					/**
					 * QCCR1E89815 The kmknowledgebaseupdates table becomes corrupt
					 */
					kmuFile = $.cachedSelect("kmknowledgebaseupdates", "docid = \"" + record[kmFile.docid] + "\" and collectionname = \"" + kmFile.kbname + "\" and (action = \"T\" or action = \"F\")");
					if (kmuFile) {
						kmuFile.sedocid = kmFile.kbname + "_" + lib.KMUtils.cleanDocID(record[kmFile.docid]) + "_0";
						kmuFile.action = "D";
						kmuFile.doUpdate();
						dumpAttachment(kmFile, record, true);
					}
				}
			}
			//if we didn't match before but we do now, it's an insert
			if (kmuFile.action == "F" && match == "T") {

				kmuFile.action = "U";
				kmuFile.sedocid = "";
				kmuFile.recdata = lib.KMUtils.recordToXML(record);
				kmuFile.doUpdate();
				dumpAttachment(kmFile, record, false);
			}
			//if we didn't match before or after, no action is needed, delete the record from the update table
			if (kmuFile.action == "F" && match == "F") {
				//dumpAttachment(kmFile, record);
				if (record.status == 'retired') {
					kmuFile.action = "D";
					kmuFile.sedocid = "";
					kmuFile.recdata = lib.KMUtils.recordToXML(record);
					kmuFile.doUpdate();
				} else {
					kmuFile.doDelete();
				}			
			}
			if (kmuFile.action == "D" && match == "F") {
 			  //just keep the record here
            }
		}
		i += 1;
	}

}

function checkPortalLanguage(kmFile, record)
{
   if(kmFile["portal.default.language"] && kmFile['portal.available.languages'] && kmFile['portal.available.languages'].length() > 0
      && record["syslanguage"] && kmFile["portal.default.language"] != record["syslanguage"])
   {
      //first find the default language record
      var f  = new SCFile(kmFile["sclibtablename"],SCFILE_READONLY);
      var rc = f.doSelect('name="'+record["name"]+'" and syslanguage="'+kmFile["portal.default.language"]+'"');
      if( rc ==RC_SUCCESS)
      {
        insertKMUpdateRecord(f, kmFile, "U");
      }
   }
}

function kmtriggerBeforeDelete(filename, record) {
	
	if(!lib.KMUtils.isIndexedFile(filename)) {
		return;
	}
	
	var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
	var i = 0;
	var found = false;
	while (i < kmFiles.length) {
		var kmFile = kmFiles[i].file;
		var kmQuery = kmFile.scquery;
		var scquery = "true";
		scquery = kmQuery;
		if (scquery == null) {
			scquery = "";
		}
		else {
			scquery = "(" + scquery + ") and ";
		}
		var fQuery = scquery + kmFile.docid + " = \"" + record[kmFile.docid] + "\"";
		if (!_evaluate_query(fQuery, record)) {
		    i++;
			continue;
		}

		// Record needs to be deleted from index here.
		// first look to see if we have an existing record...
		// if so, delete it, we will add a new one based on categories
		var kmuFile = new SCFile("kmknowledgebaseupdates");
		var kmuFind = kmuFile.doSelect("docid = \"" + record[kmFile.docid] + "\" and collectionname = \"" + kmFile.kbname + "\"");
		if (kmuFind == RC_SUCCESS) {
			kmuFind = kmuFile.getFirst();
			if (kmuFind == RC_SUCCESS) {
				found = true;
				kmuFile.action = "D";
				kmuFile.doUpdate();
                dumpAttachmentBeforeUpdate(kmFile, record);
                //dumpAttachment(kmFile, record, true);
            }
        }

		// check for multiple categories here
		if (found == false) {
			var categoryStr = lib[kmFile.categoryindexscript].getCategoryStr(record);
			if (funcs._null(categoryStr)) { // DE2773
				categoryStr = "";
			}
			// check categoryStr for semicolons, indicating multiple categories
			var catarray = categoryStr.split(";");
			var numcats = catarray.length;
			var cats;
			for (cats = 0; cats < numcats; cats++) {
				kmuFile.id = lib.KMCollection_Update_Utils.getNextKMUpdateId();
				kmuFile.collectionname = kmFile.kbname;
				kmuFile.docid = record[kmFile.docid];
				kmuFile.sedocid = kmFile.kbname + "_" + (record[kmFile.docid] + '_0');
				kmuFile.action = "D";
				kmuFile.doInsert();
                dumpAttachmentBeforeUpdate(kmFile, record);
                //dumpAttachment(kmFile, record, true);
			}
		}
		checkPortalLanguage(kmFile, record);
		i += 1;
	}
    if(filename == "joinsvcDisplay")
    {
      lib.RunRestfulEntitlement.removeCatalogAccessFilterCache(record);
    }
}

function kmaltriggerAfterUpdate(filename, record) {
	
	if(!lib.KMUtils.isIndexedFile(filename)) {
		return;
	}
	
	var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
	if (kmFiles.length > 0) {
		var sclibtablename = kmFiles[0].sclibtablename;
		var docidfield = kmFiles[0].docid;
	}
	// get the record that has been changed
	var collectionFile = new SCFile(sclibtablename);
	var collFind = collectionFile.doSelect(docidfield + "= \"" + lib.KMUtils.scToJSName(record.id) + "\"");
	if (collFind == RC_SUCCESS) {
		collFind = collectionFile.getFirst();
		if (collFind == RC_SUCCESS) {
			// touch the record to trigger update triggers
			collectionFile.doUpdate();
		}
	}
}

//after add msTeamsReplyInfo we need trigger the related KMupdate
function triggerKMUpdateForChat(chatrecord)
{
    var filename=chatrecord.fileName;
    if(!lib.KMUtils.isIndexedFile(filename)) {
        return;
    }
    
    var kmFiles = lib.KMCache.getKmknowledgebaseByFileName(filename);
    var i = 0;
    while (i < kmFiles.length) {
        var kmFile = kmFiles[i].file;
        if(!kmFile["index.chat.history"])
        {
          i += 1;
          continue;
        }
        var record = new SCFile(filename, SCFILE_READONLY);
        var rc = record.doSelect(kmFile.docid+'="'+chatrecord.fileId+'"');
        if(rc != RC_SUCCESS)
        {
          i += 1;
          continue;
        }
        
        var kmQuery = kmFile.scquery;
        var scquery = "true";
        scquery = kmQuery;
        if (scquery == null) 
        {
          scquery = "";
        }
        else 
        {
          scquery = "(" + scquery + ") and ";
        }
       
        var fQuery = scquery + kmFile.docid + " = \"" + record[kmFile.docid] + "\"";
        if (_evaluate_query(fQuery, record)) 
        {
          //only insert
          insertKMUpdateRecord(record, kmFile, "U", true);
        }
        i += 1;
    }

}
