/*
*   ReDesign the KMUpdate process such that you have a new KMStatusListener process which will start 
*   on demand without any administrative need, and will update, delete, insert documents into the relevant KM module tables.
*   @no QCCR1E67072 Knowledge Management (KM): The KMUpdate process needs a new JavaScript to update the status in the Service Manager (SM) database, 
*                   based on feedback from the K2 search engine.
*   @designer Barghouti, Ayman  
*   @submittor yuli
*   @mode  add
*   @date  since by 2011/8/9                
*/
function documentInserted(sedocid){
	// document inserted on K2 Engine
	// delete the queue record
   deleteKnowledgebaseupdates(sedocid);
}

function documentUpdated(sedocid){
   // document updated on K2 Engine
   // delete the queue record
   deleteKnowledgebaseupdates(sedocid);
}

function documentDeleted(sedocid){
	// document deleted on K2 Engine
	// delete the queue record
   deleteKnowledgebaseupdates(sedocid);
}

function documentException(sedocid, errorstr)
{
   //document failed on K2 Engine.
   // insert error record and then delete queue recored
   var collectionname = getCollectionNameFromDocID(sedocid);
   lib.KMCollection_Update_Utils.createKnowledgebaseerror(collectionname, sedocid, errorstr);
   deleteKnowledgebaseupdates(sedocid);
}

function deleteKnowledgebaseupdates(sedocid) {
    
	if (!funcs._null(sedocid))
	{
		//Fetch kmknowledgebaseupdates to delete have to delete all PD and PU records 
		//since we dont know which callback this is for.
		var kmuFile = new SCFile("kmknowledgebaseupdates");
		var sql = "sedocid=\""+sedocid+"\" and (action=\"PD\" or action=\"PU\" or action=\"PCU\")";
  		var kmuFind = kmuFile.doSelect(sql);

		while (kmuFind == RC_SUCCESS)
		{
			kmuFile.doDelete();
			kmuFind = kmuFile.getNext();
		}
	}
	else {
		funcs.log("Call to deleteKnowledgebaseupdates with null sedocid");
	}
		
	return RC_SUCCESS;
}

function getCollectionNameFromDocID(sedocid)
{
	var collectionname = new SCDatum();
	collectionname = funcs.str(sedocid);
	var index = funcs.index("Library", collectionname);
	if (index > 0)
	{
	    index = index + 6;
	    collectionname = funcs.substr(collectionname, 1, index);
	}
	else
	{
		index = funcs.index("_", collectionname);
		if (index > 0)
		{
			print(index);
			collectionname = funcs.substr(collectionname, 1, index-1);
		}
		else
		{
			//unable to determine collection name, just keep sedocid.
			collectionname = sedocid;
		}
	}
	return collectionname;
}

