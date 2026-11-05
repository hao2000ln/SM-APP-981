var unrelateReason;
var relateReason;

function cacheReason(reason)
{
	unrelateReason = reason;
}

function retrieveReasonCache()
{
	return unrelateReason;
}	

function cleanupReasonCache()
{
	unrelateReason="";
	return unrelateReason;
}

function cacheRelateReason(reason)
{
	relateReason = reason;
}

function retrieveRelateReasonCache()
{
	return relateReason;
}	

function cleanupRelateReasonCache()
{
	relateReason="";
	return relateReason;
}

function getRelatedFileName(sourceId, targetId) 
{
	var relation = new SCFile("screlation");
	var sql = "source=\""+sourceId+"\" and depend=\""+targetId+"\"";
	var rc = relation.doSelect(sql);
	if (rc == RC_SUCCESS)
	{
		var fileName;
		if (relation.depend_filename == "problem")
			fileName = "probsummary";
		else fileName = relation.depend_filename;
		return fileName;
	}
	else
	{
		var array1 = new Array();
		array1[0]=sourceId;
		array1[1]=targetId;
		var errorMsg = system.functions.scmsg(1,"screlate",array1);
		print(errorMsg);
	}
}

function getUniqueField(fileName)
{
	var objRecord = new SCFile("Object");
	var sql = "file.name=\""+fileName+"\"";
	var rc = objRecord.doSelect(sql);
	return objRecord.unique_field[0];
}