/**
*  increments the usage count for a knowledge document.  This is called from
*  KMSearch.useSolution when a knowledge document is used to reolve a ticket
*	@param  {String} kmId - id of the knowledge document (not necessarily a kmdocument)
*/
function incrementUsageCount(kmId, strTableName)
{
	var fKMUsageStats = new SCFile("kmusagestats");
	var rcode = fKMUsageStats.doSelect("id=\""+kmId+"\" and tablename=\""+strTableName+"\"");
	if(rcode == RC_SUCCESS) //found it do an update
	{
		var usagecnt = 	system.functions.nullsub(fKMUsageStats.usage_count, 0);
		fKMUsageStats.usage_count = usagecnt + 1;
		fKMUsageStats.doUpdate();
	}
	else //record not found create it
	{
		fKMUsageStats.id = kmId;
		fKMUsageStats.tablename = strTableName;
		fKMUsageStats.usage_count = 1;
	    fKMUsageStats.doInsert();		
	}
}

/**
*  increments the usage count for a knowledge document.  This is called from
*  KMSearch.useSolution when a knowledge document is used to reolve a ticket
*	@param  {String} kmId - id of the knowledge document (not necessarily a kmdocument)
*/
function incrementViewCount(kmId, strTableName)
{
	var fKMUsageStats = new SCFile("kmusagestats");

	var rcode = fKMUsageStats.doSelect("id=\""+kmId+"\" and tablename=\""+strTableName+"\"");
	if(rcode == RC_SUCCESS) //found it do an update
	{
		var viewcnt = 	system.functions.nullsub(fKMUsageStats.view_count, 0);
		fKMUsageStats.view_count = viewcnt + 1;
		fKMUsageStats.doUpdate();
	}
	else //record not found create it
	{
		fKMUsageStats.id = kmId;
		fKMUsageStats.tablename = strTableName;
		fKMUsageStats.view_count = 1;
	    fKMUsageStats.doInsert();		
	}
}