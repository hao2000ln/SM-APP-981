function KMUsageHistory()
{
}

/** 
	This function is used to get the next sequential key for th KMUsageHistory table
**/
function newId()
{
	var newid = new Datum();
	var rcode = new Datum();
	rcode = funcs.rtecall("getnumber", rcode, newid, "kmusagehistory");
	return newid.getText();
}

/** DO NOT CALL THIS FUNCTION FROM OUTSIDE THE SCRIPTLIBRARY.  
	Use one of the access functions below.
	
	This function performs the actual insert into kmusagehistory.
**/
function addUsage(strId, strUsageType, strTable, strContext)
{
	var usage = new SCFile("kmusagehistory");
	usage.id = newId();
	usage.kmid = strId;
	usage.userid = funcs.operator();
	if( strTable != null ) {
		usage.tablename = strTable;
	}
	if(strContext != null) {
		usage.contexttag = strContext;
	}	
	usage.usagetype = strUsageType;
	usage.doInsert();
}

/**
	This function when a document is viewed (from hitlist)  in the kmusagehistory table.
	Tt is called by kmquery.linkrequest function.
**/
function viewed(strDocId, strTable)
{
	addUsage(strDocId, "Viewed", strTable);
}

/**
	This function logs the creation of a document in the kmusagehistory table.
	It is called by kmdocument.submitapproval and kmdocument.approveimmediately functions.
**/
function created(strDocId)
{
	addUsage(strDocId, "Created", "kmdocument");
}


/**
	This function logs when a document is Submitted for approval in the kmusagehistory table.
	It is called by kmdocument.submitapproval function.
**/
function submitForApproval(strDocId)
{
	addUsage(strDocId, "Submitted for approval", "kmdocument");
	
}


/**
	This function logs when a document is approved for internal use in the kmusagehistory table.
	It is called by kmdocument.approve.int function.
**/
function approveInternal(strDocId)
{
	addUsage(strDocId, "Approved internal", "kmdocument");	
}

/**
	This function logs when a document is approved for external use in the kmusagehistory table.
	It is called by kmdocument.approve.ext function.
**/
function approveExternal(strDocId)
{
	addUsage(strDocId, "Approved external", "kmdocument");
}


/**
	This function logs the initiation of a modification to a document in the kmusagehistory table.
	It is called by kmdocument.modify function.
**/
function modified(strDocId)
{
	addUsage(strDocId, "Modify", "kmdocument");	
}

/**
	This function logs the revert of a modification to a document in the kmusagehistory table.
	It is called by kmdocument.revert function.
**/
function revert(strDocId)
{
	addUsage(strDocId, "Revert", "kmdocument");	
}


/**
	This function logs a retired event in the KMUsageHistory table.  
	It is called from kmdocument.retire process record
**/
function retired(strDocId)
{
	addUsage(strDocId, "Retired", "kmdocument");	
}

/**
	This function logs a deleted event in the KMUsageHistory table.  
	It is called from kmdocument.deletedoc process record
**/
function deleted(strDocId)
{
	addUsage(strDocId, "Deleted", "kmdocument");	
}


/**
	This function logs a unretired event in the KMUsageHistory table.  
	It is called from kmdocument.unretire process record
**/
function unretired(strDocId)
{
	addUsage(strDocId, "Unretired", "kmdocument");	
}

/**
	This function logs a usesolution event in the KMUsageHistory table.  
	It is called from kmquery.linkrequest process record
**/
function usesolution(strDocId, strTable, strContext)
{
	addUsage(strDocId, "Used Solution", strTable, strContext);	
}
