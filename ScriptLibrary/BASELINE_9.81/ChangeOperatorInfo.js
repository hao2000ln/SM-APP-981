function evaluateRADExpression(strRADExpression, fFile)
{
	if (strRADExpression == null || strRADExpression=="")
	{
		return true;
	}
	var parsestring = system.functions.str(strRADExpression);	
	parsestring = parsestring.replace(/(\$L\.file)/g, "$G.parsefile");	
	parsestring = parsestring.replace(/(\$file)/g, "$G.parsefile");	
	system.vars.$G_parsefile=fFile;
		
	return system.functions.parse_evaluate( parsestring , 2 );	
}

function hasOperatorApproval( strChangeNumber, retract_intersect, strFileType )
{
	var strRetractIntersectCond = "";
	for(i=0; i< system.functions.lng(retract_intersect); i++ )
	{
		if( i == 0 && system.functions.lng(retract_intersect) > 0)
			strRetractIntersectCond += "(";
		else if( i > 0 )
			strRetractIntersectCond += " or ";
		strRetractIntersectCond += "group=\""+retract_intersect[i]+"\"";
		
		if(i == system.functions.lng(retract_intersect)-1)
			strRetractIntersectCond += ")";			
	}
	var fApprovalLog = new SCFile("ApprovalLog");
	//JA..not sure of we need to match current phase to the approval log phase?
	var rc = fApprovalLog.doSelect("file.name=\""+strFileType+"\" and unique.key=\""+strChangeNumber+"\" and " + (strRetractIntersectCond!="")?strRetractIntersectCond:"true"+" and action=\"Approved\"");
	if(getLastRC() == RC_SUCCESS)
		return true;
	else
		return false; 
} 

function getInfo(fChangeOperatorInfo, strFileType)
{	
	var fOperatorInfo = new SCFile("mobilityoperatorinfo");
	system.library.MobilityAPI_Login.getOperatorInfo(fOperatorInfo);
	
	if (fOperatorInfo.has_change_access)
	{
		fChangeOperatorInfo.canRead = true;
		
		var last=false;
		var phase_close_control=false;
		var table_access_close=false;
		var bApplicationControl=false;
		var env_approvals = false;
		var fChange = new SCFile(strFileType);
		var env = (strFileType=="cm3r") ? vars.$G_cm3r_environment : vars.$G_cm3t_environment;
		if(lib.ProcessDesignerEnablement.isChangeEnabled()==true)
		{
			env.approval_groups=vars.$G_myGroups.approver_of;
			env.approvals=(strFileType=="cm3r")?(system.library.security.getRights("Change", "approvals")=="true") : (system.library.security.getRights("Change Tasks", "approvals")=="true");
		}
		
		var rc = fChange.doSelect("number=\""+ fChangeOperatorInfo.change_number + "\"");
		if( getLastRC() == RC_SUCCESS )
		{
			var fCatPhase = new SCFile(strFileType+"catphase");
			rc = fCatPhase.doSelect("name=\""+ fChange.current_phase + "\"");
			if(getLastRC() == RC_SUCCESS)
				bApplicationControl = evaluateRADExpression(fCatPhase.app_control, fChange);
			else
			{
				system.functions.msg("Unable to locate "+strFileType+"catphase name: " + fChange.current_phase );
				return false;
			}
		}
		else
		{
			system.functions.msg("Unable to locate "+ ((strFileType=="cm3r")?"change":"task") + " number: " + fChangeOperatorInfo.change_number );
			return false;
		}
		
			
		var appr_query="file.name=\""+strFileType+"\" and unique.key=\"" + fChangeOperatorInfo.change_number + "\"";
		
		
		
		var approval_groups = new SCDatum();	
		approval_groups.setType(8);	
		if( parseFloat(system.sysinfo.ClientVersion.substring(0,3)) >= 7.1) //approval delegation only supported in 7.1 and later
		{
			approval_groups = system.library.ApprovalDelegationGroups.addDelegateGroups( env.approval_groups, strFileType)
		}
		else
		{
			approval_groups = env.approval_groups;
		}
	
		var err;
		var approval_intersect = new SCDatum();	
		approval_intersect.setType(8);
		rc=system.functions.rtecall("intersect", err, approval_intersect, approval_groups, fChange.current_pending_groups );
	

		env_approvals = evaluateRADExpression(env.approvals, fChange);
		
		
		
		//Can Approve?
		if(system.library.cm3OperatorInfo.canApproveThisChange(bApplicationControl, fChange, env, env_approvals, approval_intersect))
			fChangeOperatorInfo.canApprove = true;
		else
			fChangeOperatorInfo.canApprove = false;
			
		//Can Retract?
		var retract_intersect = new SCDatum();	
		retract_intersect.setType(8);
		rc=system.functions.rtecall("intersect", err, retract_intersect, env.approval_groups, fChange.approved_groups );
	  	if( system.library.cm3OperatorInfo.canRetractThisChange(bApplicationControl, fChange, fChangeOperatorInfo, strFileType, env, env_approvals, retract_intersect ))
			fChangeOperatorInfo.canRetract = true;
		else
			fChangeOperatorInfo.canRetract = false;	
			
		//Can Close?
		//is this the last phase?
		
		var fCategory= new SCFile(strFileType+"category");
		
		if(fCategory.doSelect("name=\"" + fChange.category + "\"") == RC_SUCCESS)
		{
			if(lib.ProcessDesignerEnablement.isChangeEnabled()==true)
			{
			    var workflow = fCategory.workflow;
				var wfPhase = new SCFile("WorkflowPhase");
			 	wfPhase.doSelect("workflowName=\""+workflow+"\" and tableName=\""+strFileType+"\" and phaseName=\""+fChange.current_phase+"\"");
		    
			 	for(i=0;i<wfPhase.manualTransition.length();i++)
			 	{
					if(wfPhase.manualTransition[i].mtToPhase!=null && wfPhase.manualTransition[i].mtToPhase!="")
					{	
						if(strFileType=="cm3r" && (wfPhase.manualTransition[i].mtToPhase.toUpperCase()=="ABANDONED" || wfPhase.manualTransition[i].mtToPhase.toUpperCase()=="CLOSURE" || wfPhase.manualTransition[i].mtToPhase.toUpperCase()=="CLOSED" )) 	
			 			{
			 				last=true;	
			 			    break;
			 			}
			 			if(strFileType=="cm3t" && (wfPhase.manualTransition[i].mtToPhase.toUpperCase()=="CANCELLED" || wfPhase.manualTransition[i].mtToPhase.toUpperCase()=="CLOSED")) 	
			 			{			
							last=true;	
			 			    break;
			 			}		 			
			 					 			
			 		}
			 	}	

                if (last == false && lib.ProcessDesignerEnablement.isMigratedWorkflowUsed(strFileType, fCategory.name)) {
                    //for migrated workflow.
                    if (system.functions.index(fChange.current_phase, fCategory.phases) == system.functions.lng(system.functions.denull(fCategory.phases))) {
                        last = true;

                    }
                }
            } else {
                if (system.functions.index(fChange.current_phase, fCategory.phases) == system.functions.lng(system.functions.denull(fCategory.phases))) {
                    last = true;

                } else {
                    last = false;
                }
            }
        } else {
			system.functions.msg("Unable to locate "+strFileType+"category: " + fChange.category );
			return false;
		}
	
		var fChangeObject = new SCFile("Object");
		rc = fChangeObject.doSelect("file.name=\""+strFileType+"\"");	
	
		if(lib.ProcessDesignerEnablement.isChangeEnabled()==true)
		{
	 		vars.$L_tableAccess=(strFileType=="cm3r")?getsecRoleRights("Change"):getsecRoleRights("Change Tasks");
	 	}
	 	else
	 	{
	 		if (system.functions.exists("tableAccess", env) && !system.functions._null(env.tableAccess)) 
			{
				vars.$L_tableAccess = env.tableAccess;
			}	 	
	 	}
	 	
	
		//get the current phase record
		fPhase = new SCFile(strFileType+"catphase");
		rc = fPhase.doSelect("name=\""+fChange.current_phase+"\"");
		if(getLastRC() == RC_SUCCESS)
		{		
			phase_close_control = evaluateRADExpression(fPhase.cls_control, fChange);
			if(lib.ProcessDesignerEnablement.isChangeEnabled()==true)
			{
				table_access_close = canCloseThisChange(fChange,vars.$L_tableAccess.close);
			}
			else
			{
				table_access_close = evaluateRADExpression(vars.$L_tableAccess.close, fChange);	
			}	
		}
		
		if(system.library.cm3OperatorInfo.canCloseThisChange (fChange, last, phase_close_control, table_access_close))
			fChangeOperatorInfo.canClose = true;
		else
			fChangeOperatorInfo.canClose = false;
	
		//CAN UPDATE??
		var strParse=system.functions.strrep(system.functions.str(fPhase.upd_control), "$L.filed", "$L.file");
		var update_control = evaluateRADExpression(strParse, fChange);
		var closed_update = system.library.ChangeOperatorInfo.evaluateRADExpression(env.closed_update, fChange);
		var updateTableAccess = canUpdateThisChange(fChange, vars.$L_tableAccess.update);
		var update_flag = (update_control && updateTableAccess && (closed_update || fChange.open==true));
		if(system.library.cm3OperatorInfo.canUpdateThisChange(update_flag))
			fChangeOperatorInfo.canUpdate = true;
		else
			fChangeOperatorInfo.canUpdate = false;
	}
	else
	{
		fChangeOperatorInfo.canRead = false;
		fChangeOperatorInfo.canUpdate = false;
		fChangeOperatorInfo.canClose = false;
		fChangeOperatorInfo.canRetract = false;	
		fChangeOperatorInfo.canApprove = false;	
	}
					
	return true;
}



function getsecRoleRights(area)
{
	
	var tableAccess  = new SCFile("tableAccess");
	tableAccess.update = lib.security.getRights(area,"update");
	tableAccess._delete = lib.security.getRights(area,"delete");
	return tableAccess;		

}


function canCloseThisChange( fChange, changeCanClose )
{
	if (changeCanClose == "always")
	{
		return true;
	}
	
	if (changeCanClose == "never")
	{
		return false;
	}
	
	if (changeCanClose == "workgroup")
	{
		if (changeInOperatorWorkgroup(fChange))
		{
			return true;
		}
	}
	
	if (changeCanClose == "assigned")
	{
		if (changeAssignedToOperator(fChange))
		{
			return true;
		}
	}
	
	return false;
}

function canUpdateThisChange( fChange, canUpdateChange )
{
	if (canUpdateChange == "always")
	{
		return true;
	}
	
	if (canUpdateChange == "never")
	{
		return false;
	}
	
	if (canUpdateChange == "workgroup")
	{
		if (changeInOperatorWorkgroup(fChange))
		{
			return true;
		}
	}
	
	if (canUpdateChange == "assigned")
	{
		if (changeAssignedToOperator(fChange))
		{
			return true;
		}
	}
	
	return false;
}

function changeAssignedToOperator(fChange)
{
	return fChange.coordinator == system.functions.operator();
}

function changeInOperatorWorkgroup(fChange)
{
	var workgroups = fChange.assign_dept; 
	var myworkgroups = system.functions.denull(vars.$lo_pm_assignments);
	
	var myworkgroupscount = system.functions.lng(myworkgroups);
	
	for (var i = 0; i < myworkgroupscount; i++)
	{
		if (myworkgroups[i] == workgroups)
		{
			return true;
		}
	}
	
	return false;
}

