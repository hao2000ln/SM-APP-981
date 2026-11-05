var MAX_RECORDS = 200;

function getMaxRecords()
{
	return MAX_RECORDS;
}

function getSelectedFieldsAsXML ( strFileName, strRecordId, strExtaccessName, strQuery, aFields, aSortFields, sortOrder )
{
	var fFile = new SCFile(strFileName);
	var fExtaccess = new SCFile("extaccess");
		
	fExtaccess.doSelect("service.name=\"" + strExtaccessName + "\" and object.name=\"" + strExtaccessName +" \"");
		
	var rc = doRTESelect( fFile, strQuery, aSortFields, sortOrder, strExtaccessName );
	
	if (rc && fFile.number != null)
	{
		rc = RC_SUCCESS;
	}
	else
	{
		return null;
	}
		
	var returnString = "<" + strExtaccessName + "><" + strRecordId + ">" + fFile.number + "</" + strRecordId + ">" ;
	
	var fieldString;
	
	
	
	for (var i = 0; i < aFields.length; i++)
	{
		var fieldOpen = "<" + aFields[i] + ">";
		var fieldClose = "</" + aFields[i] + ">";
		var fileField = lib.extaccessTools.getFieldNameFromCaption(fExtaccess, aFields[i]);
		
		if (fileField == null)
		{
			fieldString="<error>Field " + aFields[i] + " does not exist in "+ strExtaccessName + "</error>";	
		}
		else
		{	
			if (fileField.indexOf(",") != -1)
			{
				fileField = fileField.slice(fileField.indexOf(",") + 1);
			} 
			 
			var fieldValue = fFile[fileField];
			
			/*if (fieldValue instanceof SCDatum && fieldValue.getType() == 8)
			{
				fieldString = fieldOpen + fieldValue.join() + fieldClose;
			} */
			
			if (fieldValue != null && fieldValue.toString().indexOf("[C++ object Datum]") != -1)
			{
				fieldString = fieldOpen + fieldValue.join() + fieldClose;
			}
			else
			{
				fieldString = fieldOpen + fieldValue + fieldClose;
			}
		}
		
		returnString += fieldString;
	}
	
	returnString += "</"+ strExtaccessName + ">";
	
	return returnString;
}

function getAssignmentGroupsFromOperator( fOperator )
{
	var assignmentGroups = system.functions.denull(fOperator.assignment_groups)
	var assignmentGroupsCount = system.functions.lng(assignmentGroups); 
	var retVal = "";
		
	for (var i = 0; i < assignmentGroupsCount; i++)
	{
		retVal += "\"" + assignmentGroups[i] + "\",";		
	}
	
	return retVal;
}

function log ( strMessage )
{
	var junk = new SCDatum();
	
	system.functions.rtecall("log", junk, strMessage);
}

function doRTESelect( fFile, strQuery, aSortFields, bSortOrder, strExtaccessName )
{
	var rc = new SCDatum();
	
	var rterc;
		
	var sortFields = system.library.MobilityCommonTools.convertCaptionsToDbdictFields( strExtaccessName, aSortFields );
		 
	if (sortFields == null) 	
	{
		sortFields = null;
		bSortOrder = null;
	}
	
	try
	{
	 	rterc = system.functions.rtecall("select", rc, fFile, strQuery, sortFields, bSortOrder);
	}
	catch (exception)
	{
		log("caught exception in doRTESelect");
		log(exception.toString());
		
		return false;
	}
	
	return rterc;
}

function convertCaptionsToDbdictFields( strExtaccess, aSortFields )
{
	if (system.functions._null(aSortFields))
	{
		return null;
	}
	
	var fExtaccess = new SCFile("extaccess");
		
	fExtaccess.doSelect("service.name=\"" + strExtaccess + "\" and object.name=\"" + strExtaccess +" \"");
	
	var sortFields = new SCDatum();
	
	var count = system.functions.lng(aSortFields);
	var fieldName;
	
	for (var i = 0; i < count; i++)
	{
		fieldName = system.library.extaccessTools.getFieldNameFromCaption( fExtaccess, aSortFields[i] );
		sortFields.push(fieldName);
	}
	
	return sortFields;
}

function addChangeJournalEntry( changeNumber, strEntry, strType )
{
	var activityLog = new SCFile("activitycm3r");
	
	addJournalEntry(activityLog, changeNumber, strEntry, strType);
}


function addIncidentJournalEntry( incidentNumber, strEntry, strType )
{
	var activityLog = new SCFile("activity");
	
	addJournalEntry(activityLog, incidentNumber, strEntry, strType);
}

function addJournalEntry( activityLog, recordNumber, strEntry, strType )
{
	activityLog.number=recordNumber;
	activityLog.description = [strEntry];
	activityLog.operator = system.functions.operator();
	activityLog.datestamp = system.functions.tod();
	activityLog.type = strType;
	activityLog.doSave();
}

function isOperatorInAssignmentGroup(strAssignmentGroup, strOperatorName)
{
	var fAssignment = new SCFile("assignment");
	if (fAssignment.doSelect("name=\"" + strAssignmentGroup +"\" and operators isin {\"" + strOperatorName + "\"}") == RC_SUCCESS)
	{
		return true;
	}
	
	return false;
}

// Get approval delegation sql
function getApprovalDelegationSql()
{
  var delegationSql = lib.ApprovalDelegationGroups.getDelegationSql();
  delegationSql = "false" + delegationSql;
  return delegationSql;
}
