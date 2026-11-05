/**
	This function retrieves the manager name from an Assignment Group
	and validates if that user is still an operator in the system. If so, the name is returned
	otherwise a 'null' is returned. Alternatively, it returns a specific coordinator for the 
	assignment group name provided, after validating it is an operator.
**/

function getGroupManager(groupname, table, mgrtype)
{
	var managerName = "";
	var fGroup = new SCFile("assignment", SCFILE_READONLY);
	fGroup.setFields(["wdManagerName","coordinator.change","coordinator.problem","coordinator.incident"]);
	rc = fGroup.doSelect("name=\""+groupname+"\"");
	if (rc == RC_SUCCESS)
	{
		if (mgrtype == "manager" || mgrtype == null) {
			managerName = fGroup.wdManagerName;
		}
		if (mgrtype == "change") {
			managerName = fGroup.coordinator_change;
		}
		if (mgrtype == "problem") {
			managerName = fGroup.coordinator_problem;
		}
		if (mgrtype == "incident") {
			managerName = fGroup.coordinator_incident;
		}
	}
	if (managerName != "")
	{
		var fOperator = new SCFile("operator", SCFILE_READONLY);
		fOperator.setFields(["name"]);
		rc = fOperator.doSelect("name=\""+managerName+"\"");
		if (rc == RC_SUCCESS) {
			return managerName;
		}
	}
	return null;
}

//append array to an existing array
//a copy of the "BSGFunctions" function, but now using the "length()" function.
function appendArray(appendTo, appendFrom) 
{
	var appendToLng = appendTo.length();
	var appendFromLng = appendFrom.length();
	var i;
	for(i=0;i<appendFromLng;++i)
	{
		appendTo[appendToLng+i] = appendFrom[i];
	}
	return appendTo;
}

/**
	This functions checks if a certain provided field name is used for a provided table
	as a field that holds a CI name. This is checked against the Service Level Management
	application (Configure Application). It returns either true or false.
**/

function checkIsCIfield(fieldname, tablename)
{
	if (fieldname == "affected.item")
	{
		return true;
	}
	
	var fFile = new SCFile( "slamodulecontrol", SCFILE_READONLY );
	fFile.setFields(["ci.fields"]);
	var sql = "table.name=\"" + tablename + "\"";
	
	if (fFile.doSelect( sql ) == RC_SUCCESS )
	{		
		if (funcs.index(fieldname, fFile.ci_fields) > 0) {
			return true;
		}
	}
	
	return false;
}