function getIncidentsInAssignmentGroup( fIncidentInAsgGroup, strOperator, bOpenOnly, aSortFields, sortDescending, count )
{
	var incidentQuery = buildIncidentsInAssignmentGroupQuery(strOperator, bOpenOnly);
		
	if (incidentQuery == null)
	{
		var pendingKeys = new SCDatum();
		var pendingSysmodcount = new SCDatum();
		pendingKeys.push("");
		pendingSysmodcount.push("");
		
		fIncidentInAsgGroup.incident_ids = pendingKeys;
		fIncidentInAsgGroup.sysmodcount = pendingSysmodcount;
		
		return null;
	}	
		
	var incidents = new SCFile("probsummary");
	
	rc = system.library.MobilityCommonTools.doRTESelect( incidents, incidentQuery, aSortFields, sortDescending, "MobilityIncident1" );
	
	if (rc)
	{
		if (incidents.number == null)
		{
			rc = incidents.getNext();
		}
		else
		{
			rc = RC_SUCCESS;
		}

		var pendingKeys = new SCDatum();
		var pendingSysmodcount = new SCDatum();
		
		if (count == 0 || count == null)
		{
			count = system.library.MobilityCommonTools.getMaxRecords();
		}
		
		var iCounter = 0;
		
		while (rc == RC_SUCCESS && iCounter < count)
		{
			pendingKeys.push(incidents.number);
			pendingSysmodcount.push(incidents.sysmodcount);
			rc = incidents.getNext();
			iCounter++;
		}
		
		fIncidentInAsgGroup._count = iCounter++;
		if (rc == RC_SUCCESS)
		{
			fIncidentInAsgGroup.more = true;
		}
		else
		{
			fIncidentInAsgGroup.more = false;
		}
		fIncidentInAsgGroup.incident_ids = pendingKeys;
		fIncidentInAsgGroup.sysmodcount = pendingSysmodcount;
		
		
		return true;
	}
	
	return false;
}

function getIncidentsInAssignmentGroupCount( fIncidentInAsgGroup, strOperator, bOpenOnly )
{
	var incidentQuery = buildIncidentsInAssignmentGroupQuery(strOperator, bOpenOnly);
		
	if (incidentQuery == null)
	{		
		return false;
	}	
		
	var incidents = new SCFile("probsummary");
	fIncidentInAsgGroup.recordcount = incidents.doCount(incidentQuery);
	
	return true;
}

function getIncidentsInAssignmentGroupQuery( fIncidentInAsgGroup )
{
	var incidentQuery = buildIncidentsInAssignmentGroupQuery(fIncidentInAsgGroup.operator, fIncidentInAsgGroup.open);
		
	if (incidentQuery == null)
	{		
		return false;
	}	
		
	fIncidentInAsgGroup.querystring = incidentQuery;
	
	return true;
}

function getIncidentsAssignedToMeCount( fIncidentsAssignedToMe, strOperator, bOpenOnly )
{
	var incidentQuery = buildIncidentsAssignedToMeQuery(strOperator, bOpenOnly);
		
	if (incidentQuery == null)
	{		
		return false;
	}	
		
	var incidents = new SCFile("probsummary");
	fIncidentsAssignedToMe.recordcount = incidents.doCount(incidentQuery);
	
	return true;
}

function buildIncidentsInAssignmentGroupQuery(strOperator, bOpenOnly)
{
	var incidentQuery = "assignment isin {";
	
	var assignmentQuery = "coordinator.incident=\"" + strOperator + "\" or operators isin {\"" + strOperator + "\"}";
	
	var fAssignmentGroup = new SCFile("assignment");
	
	var rc = fAssignmentGroup.doSelect(assignmentQuery);
	
	while (rc == RC_SUCCESS)
	{
		incidentQuery += "\"" +  fAssignmentGroup.name + "\",";
		
		rc = fAssignmentGroup.getNext();
	}	
	
	var fOperator = new SCFile("operator");
	fOperator.doSelect("name=\"" + strOperator + "\"");
	
	incidentQuery += system.library.MobilityCommonTools.getAssignmentGroupsFromOperator(fOperator);
	incidentQuery += "}";
	
	if (bOpenOnly)
	{
		incidentQuery += " and flag#true";
	}
	
	return incidentQuery;
}

function buildIncidentsAssignedToMeQuery(strOperator, bOpenOnly)
{
	var incidentQuery = "assignee.name =\"" + strOperator + "\"";
		
	if (bOpenOnly)
	{
		incidentQuery += " and flag#true";
	}
	
	return incidentQuery;
}


function getIncidentsInAssignmentGroupByDbdict( fIncidentInAsgGroup )
{
	return getIncidentsInAssignmentGroup( fIncidentInAsgGroup, fIncidentInAsgGroup.operator, true, fIncidentInAsgGroup.sortFields, fIncidentInAsgGroup.sortDescending, fIncidentInAsgGroup._count );
}

function getIncidentsInAssignmentGroupCountByDbdict( fIncidentInAsgGroup )
{
	return getIncidentsInAssignmentGroupCount( fIncidentInAsgGroup, fIncidentInAsgGroup.operator, true );
}

function getIncidentsAssignedToMeCountByDbdict( fIncidentMyCount )
{
	return getIncidentsAssignedToMeCount( fIncidentMyCount, fIncidentMyCount.operator, true );
}

function getFieldsAsXMLByDbdict( fRecordsByField )
{
	fRecordsByField.returnxml = getIncidentFieldsAsXML(fRecordsByField.keys, fRecordsByField.fields, fRecordsByField.sortFields, fRecordsByField.sortDescending); 
}


function getIncidentFieldsAsXML(aIncidentNumbers, aIncidentFields, aSortFields, sortDescending)
{
	var CURRENT_INCIDENT_EXTACCESS = "MobilityIncident1";
	
	var fields = aIncidentFields.toArray();
	var numbers = aIncidentNumbers.toArray();
	
	var retVal = "";
	
	for (var i = 0; i < numbers.length; i++)
	{
		var probsummaryQuery = "number=\"" + numbers[i] + "\"";
		
		retVal += system.library.MobilityCommonTools.getSelectedFieldsAsXML ( "probsummary", "IncidentID", CURRENT_INCIDENT_EXTACCESS, probsummaryQuery, fields, aSortFields, sortDescending );
	}
	
	return retVal;
}
