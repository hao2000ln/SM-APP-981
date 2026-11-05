//This will schedule the KMUpdate scheduler background process to run a reconcile of the database documents 
//against the KM Search Engine Indexes.  Note that regular processing of the KMUpdate will not run while this reconcile is processing.

//To run this in the background, go to the KMScheduleReconcileKB Script Library and follow the instructions there.

//To run this in the foreground (which will lock your client until the process completes) uncoment the last line of this script
//library and follow the instructions there.

function reconcileKnowledgebase( strKBName )
{
	var strId;
	var hitlistfields = new Datum();
	hitlistfields.setType(8);
	hitlistfields.push("id");
	var colls = new Datum();
	colls.setType(8);
	colls.push(strKBName);	
	var doccount = 0;
	var addcount = 0;
	var starttime = new Date();
	var endtime;
	
	//query for kmknowledgebase
    var fKB = new SCFile("kmknowledgebase", SCFILE_READONLY);
    fKB.setFields(["docid","scquery"]);
	var rc = fKB.doSelect("kbname=\"" + strKBName + "\"");
	if( rc != RC_SUCCESS)
	{
		print("Unable to locate kmknowledgebase record for " + strKBName );
		return;
	}
	
	//create a file variable for the knowledgebase table we are indexing.  Issue a query based on the query
	//field specified in the kmknolwdgebase record.
	var fKBFile = new SCFile(fKB.sclibtablename, SCFILE_READONLY);
	fKBFile.setFields([fKB.docid]);
	rc = fKBFile.doSelect(fKB.scquery);
	if( rc != RC_SUCCESS)
	{
		print("No records returned from kmknowledgebase query.");
		return;
	}
	
	//we have our recordset for the knowledgebase now iterate each document and verify it exists in the index.
	while( rc == RC_SUCCESS )
	{
		doccount++;
		var hitarray = new Datum();
		hitarray.setType(8);
		
		strId = fKBFile[fKB.docid];
				
		//build query
//        var strQuery =  "(id <MATCHES> " + strId + " <AND> _style <CONTAINS> " + strKBName +")";
//        var serverspec = vars.$G_km_globalenv.km_host + ":"+ vars.$G_km_globalenv.km_searchport;
//        funcs.plugin("KMPLUGIN", "SEARCH", serverspec, "", "0", strQuery, colls, hitlistfields, hitarray );

		if (funcs.same(hitarray,{}) || hitarray[0]== "0")
		{
			var fKBUpdates = new SCFile("kmknowledgebaseupdates");
			fKBUpdates.action = "U";
			fKBUpdates.docid = strId;
			fKBUpdates.collectionname = strKBName;
			fKBUpdates.doSave();
			addcount++;
		}
		
		rc = fKBFile.getNext();
	}
	endtime = new Date();
	print("Reconcile Knowledgebase completed.");
	print("Reconciled " + doccount+ " documents.");
	print("Added " + addcount + " documents to the index.");
	print("Reconcile started: " + starttime);
	print("Reconcile ended: " + endtime);	
}

function scheduleReconcileKnowledgebase(strKBName)
{
	var currentTime = new XMLDate(new Date());
	var fSchedule = new SCFile("schedule");
	
	fSchedule.name = "KM Reconcile Knowledgebase - " + strKBName;
	fSchedule._class = "KMUpdate";
	fSchedule.expiration= currentTime.getDatum();
	fSchedule.javascript="lib.KMReconcileKnowledgebase.reconcileKnowledgebase(\"" + strKBName + "\");";
	fSchedule.doInsert();
}

//For foreground processing only ...
//change this parameter to the KB you wish to reconcile
//Modify the parameter to correspond to the Knowledgebase name you wish to reconcile.  
//Press "Save", Press "Compile" (ensure no errors), Press "Execute"
//system.library.KMReconcileKnowledgebase.reconcileKnowledgebase("Knowledge_Library");