//script for link decorator with external objects: current change, future change and incident

/**
* process different conditions of external
*/

function hasDecoratorForExternal(fCIDevice, externalTableName, externalQuery, daysOut)
{
	if (externalTableName == "cm3r" && daysOut !="0")
		return processChangeFuture(fCIDevice, externalTableName,externalQuery,daysOut);
		
	else if (externalTableName == "cm3r" && daysOut =="0")
		return processChangeCurrent(fCIDevice, externalTableName,externalQuery);
		
	else if (externalTableName == "probsummary")
		return processIncident(fCIDevice);
		
	else if (externalTableName == "slamonthly")
		return processBreached(fCIDevice);

}


/**
* process current change
*/

function processChangeCurrent(fCIDevice, externalTableName, externalQuery)
{
	var change = new SCFile("cm3r");
	var queryStr = getQueryString("currentChange",fCIDevice);
	var rc = change.doSelect(queryStr);
		
	if (rc == RC_SUCCESS)
		return true;
		
	else return false;	
	
}


/**
* process future change
*/

function processChangeFuture(fCIDevice, externalTableName,externalQuery,daysOut)
{		
	var change = new SCFile("cm3r");
	var queryStr = getQueryString("futureChange",fCIDevice,daysOut);	
	var rc = change.doSelect(queryStr);
	if (rc == RC_SUCCESS)
		return true;
		
	else return false;
}


/**
* process incident
*/

function processIncident(fCIDevice)
{
	var probsummary = new SCFile("probsummary");
	var queryStr = getQueryString("incident",fCIDevice);
	var rc = probsummary.doSelect(queryStr);

	if (rc == RC_SUCCESS)
		return true;
		
	else return false;
}


/**
* process breached
*/

function processBreached(fCIDevice)
{
	var slamonthly = new SCFile("slamonthly");
	var queryStr = getQueryString("breached",fCIDevice);
	var rc = slamonthly.doSelect(queryStr);

	if (rc == RC_SUCCESS)
		return true;
		
	else return false;
}


/**
* construct the query based on table
*/

function getQueryString(linkType, fCIDevice,daysOut)
{
	var queryStr;
	
	if (linkType == "incident")
		// IIA: Updated to support Service definitions
		queryStr = "(flag=true or flag=unknown) and (logical.name=\""+fCIDevice.logical_name+"\" or affected.item=\""+fCIDevice.logical_name+"\")";
		
	else if (linkType == "futureChange")
	{		
		queryStr = "open=true and (logical.name=\"" + fCIDevice.logical_name + "\"";
		queryStr = queryStr + " or affected.item=\"" + fCIDevice.logical_name + "\"";
		queryStr = queryStr + " or assets=\"" + fCIDevice.logical_name + "\")";
		queryStr = queryStr + " and down.start<=(tod()+'" + daysOut + " 00:00')";
		queryStr = queryStr + " and down.start>=tod()";
	}
	
	else if (linkType == "currentChange")
	{
		queryStr = "open=true and (logical.name=\"" + fCIDevice.logical_name + "\"";
		queryStr = queryStr + " or affected.item=\"" + fCIDevice.logical_name + "\"";
		queryStr = queryStr + " or assets=\"" + fCIDevice.logical_name + "\")";
		queryStr = queryStr + " and down.end>=tod()";
		queryStr = queryStr + " and down.start<=tod()";
	}
	else if (linkType == "breached")
	{
		queryStr = "logical.name=\""+fCIDevice.logical_name+"\"";
		queryStr = queryStr + " and year="+system.functions.year(system.functions.tod());
		queryStr = queryStr + " and month="+system.functions.month(system.functions.tod());
		queryStr = queryStr + " and result=3";
	}
	

	return queryStr;		
}