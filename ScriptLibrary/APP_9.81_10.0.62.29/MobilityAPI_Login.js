function getOperatorInfo( fOperatorInfo )
{
	var strOperatorName = system.functions.operator();

	var fOperator = new SCFile("operator");
	
	var rc = fOperator.doSelect("name=\"" + strOperatorName + "\"");
	
	if (rc != RC_SUCCESS)
	{
		return false;
	}
	
	fOperatorInfo.operator_name = fOperator.name;
	
	fOperatorInfo.timezone_id = system.vars.$G_timezone.java_id;
	
	getOperatorIncidentInfo( fOperatorInfo, fOperator );
	getOperatorRootCauseInfo( fOperatorInfo, fOperator  );
	getOperatorServiceDeskInfo( fOperatorInfo, fOperator  );
		
	var changeProfiles = system.functions.denull(fOperator.profile_change)
	var changeProfileCount = system.functions.lng(changeProfiles);
		
	var cm3profile = new SCFile("cm3profile");
	var bCanApprove=system.functions.index("ChMAdmin", system.vars.$lo_ucapex)>0;
	var bCanViewChanges=(system.functions.index("change request", system.vars.$lo_ucapex)>0 || system.functions.index("ChMAdmin", system.vars.$lo_ucapex)>0 || system.functions.index("SysAdmin", system.vars.$lo_ucapex)>0);
	
	/*TODO: If defect 59392 is fixed then we should check the approve flag in cm3profile FIRST and make sure bCanApprove is false if approve is false.*/
	
	if (!bCanApprove)
	{
		for (var i = 0; i < changeProfileCount; i++)
		{
			rc = cm3profile.doSelect("name=\"" + changeProfiles[i] + "\"");
			if (rc == RC_SUCCESS)
			{
				if ( system.functions.lng(system.functions.denull(cm3profile.approval_groups)) > 0 && cm3profile.approvals)
				{
					bCanApprove = true;
				}
			}
		}
	}
	
	if (!bCanApprove)
	{
		var userrole = new SCFile("userrole");
		
		rc = userrole.doSelect("name=\"" + fOperator.user_role + "\"");
		
		changeProfiles = system.functions.denull(userrole.profile_change)
		var changeProfileCount = system.functions.lng(changeProfiles); 
		
		for (var i = 0; i < changeProfileCount; i++)
		{
			rc = cm3profile.doSelect("name=\"" + changeProfiles[i] + "\"");
			if (rc == RC_SUCCESS)
			{
				if ( system.functions.lng(system.functions.denull(cm3profile.approval_groups)) > 0 && cm3profile.approvals)
				{
					bCanApprove = true;
				}
				
				if (cm3profile.view)
				{
					bCanViewChanges = true;
				}
			}
		}
	}
	
	fOperatorInfo.has_change_access = bCanViewChanges;
	fOperatorInfo.can_approve_change = bCanApprove;
	
	return true;
}

function getOperatorInfoEAF ( fOperatorInfo )
{
	var strOperatorName = system.functions.operator();

	fOperatorInfo.operator_name = strOperatorName;
	
	var fOperator = new SCFile("operator");
	
	var rc = fOperator.doSelect("name=\"" + strOperatorName + "\"");
	
	if (rc != RC_SUCCESS)
	{
		return false;
	}
	
	getOperatorIncidentInfo( fOperatorInfo, fOperator );
	getOperatorRootCauseInfo( fOperatorInfo, fOperator );
	getOperatorServiceDeskInfo( fOperatorInfo, fOperator );
				
	fOperatorInfo.has_change_access = (system.library.security.getRights("Change", "view")=="true");
	fOperatorInfo.can_approve_change = (system.library.security.getRights("Change", "approvals")=="true");
	
	return true;
}

function getOperatorIncidentInfo( fOperatorInfo, fOperator )
{
	var rc;
	
	if (fOperator.profile_incident == null || fOperator.profile_incident == "")
	{
		fOperatorInfo.has_incident_access = false;
	}
	else
	{
		fOperatorInfo.has_incident_access = (system.functions.index("incident management", system.vars.$lo_ucapex)>0 || 
		                                     system.functions.index("IncidentAdmin", system.vars.$lo_ucapex)>0 || 
		                                     system.functions.index("SysAdmin", system.vars.$lo_ucapex)>0);
		
		if (fOperatorInfo.has_incident_access)
		{		
			var pmenv = new SCFile("pmenv");
			rc = pmenv.doSelect("name=\"" + fOperator.profile_incident + "\"");
		
			if (rc == RC_SUCCESS)
			{
				if (pmenv.view == null || pmenv.view == false)
				{
					fOperatorInfo.has_incident_access = false;
				}
			}
			else 
			{
				fOperatorInfo.has_incident_access = false;				
			}
		}
		
	}
}

function getOperatorRootCauseInfo( fOperatorInfo, fOperator )
{
	var rc;
	
	if (fOperator.profile_rootcause == null || fOperator.profile_rootcause == "")
	{
		fOperatorInfo.has_problem_access = false;
	}
	else 
	{
		fOperatorInfo.has_problem_access = (system.functions.index("problem management", system.vars.$lo_ucapex)>0 ||
	   									    system.functions.index("ProbAdmin", system.vars.$lo_ucapex)>0 || 
		                                    system.functions.index("SysAdmin", system.vars.$lo_ucapex)>0);
	   								
		if (fOperatorInfo.has_problem_access)
		{
			var rcenv = new SCFile("rcenv");
			rc = rcenv.doSelect("name=\"" + fOperator.profile_rootcause + "\"");
		
			if (rc == RC_SUCCESS)
			{			
				if (rcenv.view == null || rcenv.view == false)
				{
					fOperatorInfo.has_problem_access = false;
				}
			}
			else
			{
				fOperatorInfo.has_problem_access = false;				
			}
		}
	}	
}

function getOperatorServiceDeskInfo( fOperatorInfo, fOperator )
{
	var rc;

	if (fOperator.profile_service == null || fOperator.profile_service == "")
	{
		fOperatorInfo.has_interaction_access = false;
	}
	else
	{
	
		fOperatorInfo.has_interaction_access = (system.functions.index("service desk", system.vars.$lo_ucapex)>0 ||
											    system.functions.index("SDAdmin", system.vars.$lo_ucapex)>0 || 
		                                        system.functions.index("SysAdmin", system.vars.$lo_ucapex)>0);
		
		if (fOperatorInfo.has_interaction_access)
		{									
			var smenv = new SCFile("smenv");
			rc = smenv.doSelect("name=\"" + fOperator.profile_service + "\"");
		
			if (rc == RC_SUCCESS)
			{
				if (smenv.view == null || smenv.view == false)
				{
					fOperatorInfo.has_interaction_access = false;
				}
			}
			else
			{
				fOperatorInfo.has_interaction_access = false;				
			}
		}
	}
}

