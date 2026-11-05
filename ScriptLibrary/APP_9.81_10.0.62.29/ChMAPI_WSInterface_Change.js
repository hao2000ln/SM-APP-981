var strApprovalSQL = "approval.status=\"pending\" and current.pending.groups isin approval.groups in $G.cm3r.environment and (releaseCandidate=NULL or releaseCandidate=false)"
	
function getChangesInAssignmentGroup( fChangeInAsgGroup, strOperator, bOpenOnly, aSortFields, sortDescending, count )
{	
	var cm3rQuery = buildChangesInAssignmentGroupQuery(strOperator, bOpenOnly);
	
	var cm3r = new SCFile("cm3r");
	
	rc = system.library.MobilityCommonTools.doRTESelect( cm3r, cm3rQuery, aSortFields, sortDescending, "MobilityChange1");
	
	if (rc)
	{		
		var keys = new SCDatum();
		var sysmods = new SCDatum();
		
		if (cm3r.number == null || cm3r.number == "")
		{
			rc = cm3r.getNext();
		}
		else
		{
			rc = RC_SUCCESS;
		}
		
		var iCounter = 0;
		
		if (count == 0 || count == null)
		{
			count = system.library.MobilityCommonTools.getMaxRecords();
		}
		
		while (rc == RC_SUCCESS && iCounter < count)
		{		
			keys.push(cm3r.number);
			sysmods.push(cm3r.sysmodcount);
			rc = cm3r.getNext();
			iCounter++;
		}
		
		fChangeInAsgGroup._count = iCounter++;
		if (rc == RC_SUCCESS)
		{
			fChangeInAsgGroup.more = true;
		}
		else
		{
			fChangeInAsgGroup.more = false;		
		}
		
		fChangeInAsgGroup.change_ids = keys;
		fChangeInAsgGroup.sysmodcount = sysmods;		
		
		return true;		
	}
	
	return false;
}

function getChangesInAssignmentGroupCount( fChangeInAsgGroup, strOperator, bOpenOnly )
{
	var cm3Query = buildChangesInAssignmentGroupQuery(strOperator, bOpenOnly);
	
	if (cm3Query == null)
	{
		return false;
	}
	
	var cm3r = new SCFile("cm3r");
	
	var count = cm3r.doCount(cm3Query);	
	
	fChangeInAsgGroup.recordcount = count;
	
	return true;
}

function getChangesInAssignmentGroupQuery( fChangeInAsgGroup )
{
	var cm3Query = buildChangesInAssignmentGroupQuery(fChangeInAsgGroup.operator, fChangeInAsgGroup.open);
	
	if (cm3Query == null)
	{
		return false;
	}
		
	fChangeInAsgGroup.querystring = cm3Query;
	
	return true;
}

function buildChangesInAssignmentGroupQuery(strOperator, bOpenOnly)
{
	var fOperator = new SCFile("operator");
	
	var rc = fOperator.doSelect("name=\"" + strOperator + "\"");
	var cm3rQuery = "header,assign.dept isin {"; //Service Manager","Application"}
	
	if (rc != RC_SUCCESS)
	{
		return null;
	}
	
	var changeProfiles = system.functions.denull(fOperator.profile_change)
	var changeProfileCount = system.functions.lng(changeProfiles);
		
	var cm3profile = new SCFile("cm3profile");
	
	for (var i = 0; i < changeProfileCount; i++)
	{
		rc = cm3profile.doSelect("name=\"" + changeProfiles[i] + "\"");
		if (rc == RC_SUCCESS)
		{
			var approvalGroups = system.functions.denull(cm3profile.approval_groups);
			var approvalGroupCount = system.functions.lng(approvalGroups);
			
			for (var j = 0; j < approvalGroupCount; j++)
			{
				cm3rQuery += "\"" + approvalGroups[j] + "\",";
			}
		}
	}
	
	var userrole = new SCFile("userrole");
	
	rc = userrole.doSelect("name=\"" + fOperator.user_role + "\"");
	
	changeProfiles = system.functions.denull(userrole.profile_change)
	var changeProfileCount = system.functions.lng(changeProfiles); 
	
	for (var i = 0; i < changeProfileCount; i++)
	{
		rc = cm3profile.doSelect("name=\"" + changeProfiles[i] + "\"");
		if (rc == RC_SUCCESS)
		{
			var approvalGroups = system.functions.denull(cm3profile.approval_groups);
			var approvalGroupCount = system.functions.lng(approvalGroups);
			
			for (var j = 0; j < approvalGroupCount; j++)
			{
				cm3rQuery += "\"" + approvalGroups[j] + "\",";
			}
		}
	}
	
	cm3rQuery += system.library.MobilityCommonTools.getAssignmentGroupsFromOperator( fOperator );
	
	cm3rQuery += "}";
	
	if (bOpenOnly)
	{
		cm3rQuery += " and open=true and (releaseCandidate=NULL or releaseCandidate=false)"
	}
	
	return cm3rQuery;
}

function getChangesInAssignmentGroupByDbdict( fChangeInAsgGroup )
{	
	return getChangesInAssignmentGroup( fChangeInAsgGroup, fChangeInAsgGroup.operator, true, fChangeInAsgGroup.sortFields, fChangeInAsgGroup.sortDescending, fChangeInAsgGroup._count );
}

function getChangesInAssignmentGroupCountByDbdict ( fChangeInAsgGroup )
{
	return getChangesInAssignmentGroupCount( fChangeInAsgGroup, fChangeInAsgGroup.operator, true );
}

function getFieldsAsXMLByDbdict( fRecordsByField )
{
	fRecordsByField.returnxml = getChangeFieldsAsXML(fRecordsByField.keys, fRecordsByField.fields, fRecordsByField.sortFields, fRecordsByField.sortDescending); 
}


function getChangeFieldsAsXML(aChangeNumbers, aChangeFields, aSortFields, sortDescending)
{	
	var fields = aChangeFields.toArray();
	var numbers = aChangeNumbers.toArray();
		
	var CURRENT_CHANGE_EXTACCESS = "MobilityChange1";
	
	var retVal = "";
	
	for (var i = 0; i < numbers.length; i++)
	{
		var cm3rQuery = "number=\"" + numbers[i] + "\"";
		
		retVal += system.library.MobilityCommonTools.getSelectedFieldsAsXML ( "cm3r", "ChangeID", CURRENT_CHANGE_EXTACCESS, cm3rQuery, fields, aSortFields, sortDescending );
	}
	
	return retVal;
}

function getChangesAwaitingApproval( fPendingChangeApproval )
{
	var junk = new SCDatum();
	
	var fcm3r = new SCFile("cm3r");
	var pendingKeys = new SCDatum();
	var pendingSysmodcounts = new SCDatum();
	
	var rc = system.library.MobilityCommonTools.doRTESelect( fcm3r, 
																   strApprovalSQL, 
																   fPendingChangeApproval.sortFields, 
																   fPendingChangeApproval.sortDescending, 
																   "MobilityChange1" );
	
	var count = fPendingChangeApproval._count;
	
	if (count == 0 || count == null)
	{
		count = system.library.MobilityCommonTools.getMaxRecords();
	}
	
	var iCounter = 0;
	
	if (rc)
	{
		if (fcm3r.number == null)
		{
			rc = fcm3r.getNext();
		}
		else
		{
			rc = RC_SUCCESS;
		}
		
		while (rc == RC_SUCCESS && iCounter < count)
		{
			pendingKeys.push(fcm3r.number);
			pendingSysmodcounts.push(fcm3r.sysmodcount);
			rc = fcm3r.getNext();
			iCounter++;
		}
		
		if (rc == RC_SUCCESS)
		{
			fPendingChangeApproval.more = true;
		}
		else
		{
			fPendingChangeApproval.more = false;		
		}
			
		fPendingChangeApproval._count = iCounter++;	
		fPendingChangeApproval.pendingkeys = pendingKeys;
		fPendingChangeApproval.sysmodcount = pendingSysmodcounts;
	
		return true;
	}
	
	return false;
	
}

function getChangesAwaitingApprovalCount( fPendingChangeApproval )
{
	var fcm3r = new SCFile("cm3r");
	
	fPendingChangeApproval.recordcount = fcm3r.doCount(strApprovalSQL);
	
	return true;
}

function getChangesAwaitingApprovalQuery( fPendingChangeApproval )
{
	fPendingChangeApproval.querystring = strApprovalSQL;
	
	return true;
}