//Bitmask constants
var CHANGE_CAN_READ = 0x1;
var CHANGE_CAN_APPROVE = 0x2;
var CHANGE_CAN_DENY = 0x4;
var CHANGE_CAN_CLOSE = 0x8;
var CHANGE_CAN_UPDATE = 0x10;
var CHANGE_CAN_RETRACT = 0x20;


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

function getMassOperatorInfo(fChangeOperatorInfo, strFileType)
{	
	var last=false;
	var phase_close_control=false;
	var table_access_close=false;
	var bApplicationControl=false;
	var env_approvals = false;

	var fOperatorInfo = new SCFile("mobilityoperatorinfo");
	
	system.library.MobilityAPI_Login.getOperatorInfo(fOperatorInfo);
	

	var fChange = new SCFile(strFileType);
	var env = (strFileType=="cm3r") ? vars.$G_cm3r_environment : vars.$G_cm3t_environment;
	
	var length = system.functions.lng(fChangeOperatorInfo.record_id);
	var permissionsMasks = [];
	
	for (var x = 0; x < length; x++)
	{
		var permissionsMask = 0;
		
		if (fOperatorInfo.has_change_access)
		{
			permissionsMask = CHANGE_CAN_READ;		
			var rc = fChange.doSelect("number=\""+ fChangeOperatorInfo.record_id[x] + "\"");
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
				system.functions.msg("Unable to locate "+ (strFileType=="cm3r")?"change":"task" +" number: " + fChangeOperatorInfo.change_number );
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
		  	if(canApproveThisChange(bApplicationControl, fChange, env, env_approvals, approval_intersect))
		  	{
				permissionsMask = CHANGE_CAN_APPROVE | CHANGE_CAN_DENY | permissionsMask;
			}
				
			//Can Retract?
			var retract_intersect = new SCDatum();	
			retract_intersect.setType(8);
			rc=system.functions.rtecall("intersect", err, retract_intersect, env.approval_groups, fChange.approved_groups );
		  	if( canRetractThisChange(bApplicationControl, fChange, fChangeOperatorInfo, strFileType, env, env_approvals, retract_intersect ))
		  	{
				permissionsMask = CHANGE_CAN_RETRACT | permissionsMask;
			}
				
			//Can Close?
			//is this the last phase?
			var fCategory= new SCFile(strFileType+"category");
			rc = fCategory.doSelect("name=\"" + fChange.category + "\"");
			if(getLastRC() == RC_SUCCESS)
			{
				if (system.functions.index(fChange.current_phase, fCategory.phases)==system.functions.lng(system.functions.denull(fCategory.phases))) 
				{
					last=true;
					
				}
				else
				{ 
					last=false;
				}
			}
			else
			{
				system.functions.msg("Unable to locate "+strFileType+"category: " + fChange.category );
				return false;
			}
		
			var fChangeObject = new SCFile("Object");
			rc = fChangeObject.doSelect("file.name=\""+strFileType+"\"");
		
			if (system.functions.exists("tableAccess", env) && !system.functions._null(env.tableAccess)) 
			{
				vars.$L_tableAccess = env.tableAccess;
			}
			
			//get the current phase record
			fPhase = new SCFile(strFileType+"catphase");
			rc = fPhase.doSelect("name=\""+fChange.current_phase+"\"");
			if(getLastRC() == RC_SUCCESS)
			{		
				phase_close_control = evaluateRADExpression(fPhase.cls_control, fChange);
				table_access_close = evaluateRADExpression(vars.$L_tableAccess.close, fChange);	
			}
			//evaluate($L.tableAccess.close) and open in $L.file=true and nullsub($G.ess, false)=false and approval.status in $L.file="approved"			
			if(canCloseThisChange (fChange, last, phase_close_control, table_access_close))	  	
			{
				permissionsMask = CHANGE_CAN_CLOSE | permissionsMask;
			}
		
			//CAN UPDATE??
			var strParse=system.functions.strrep(system.functions.str(fPhase.upd_control), "$L.filed", "$L.file");
			var update_control = evaluateRADExpression(strParse, fChange);
			var closed_update = system.library.ChangeOperatorInfo.evaluateRADExpression(env.closed_update, fChange);
			var updateTableAccess = getTableAccessUpdateFromProfile(fChange, vars.$L_tableAccess.update);
			var update_flag = (update_control && updateTableAccess && (closed_update || fChange.open==true));
			if(canUpdateThisChange(update_flag))
		  	{
				permissionsMask = CHANGE_CAN_UPDATE | permissionsMask;
			}
		}
		
		permissionsMasks[x] = permissionsMask;
	}
		
	fChangeOperatorInfo.permissions_mask = new SCDatum(permissionsMasks);
					
	return true;
}

function canApproveThisChange(bApplicationControl, fChange, env, env_approvals, approval_intersect)
{
	//Can Approve?
  	if( bApplicationControl==true && 
 		(fChange.approval_status != "approved" && fChange.approval_status != "denied" || env.approve_override==true) &&
  		system.functions.lng(system.functions.denull(env.approval_groups))>0 && 
 		env_approvals==true && 
  		fChange.open==true && 
  		(system.functions.lng(approval_intersect)>0) && 
  		system.functions.nullsub(vars.$G_ess, false)==false)
  	{
		return true;
	}
	return false;
}

function canRetractThisChange(bApplicationControl, fChange, fChangeOperatorInfo, strFileType, env, env_approvals, retract_intersect )
{
  	if( bApplicationControl==true &&
  		system.library.ChangeOperatorInfo.hasOperatorApproval(fChangeOperatorInfo.change_number, retract_intersect, strFileType) &&
  		system.functions.lng(system.functions.denull(env.approval_groups))>0 && 
		env_approvals==true && 
  		fChange.open==true && 
  		(system.functions.lng(retract_intersect)>0 || env.approve_override==true ) && 
  		system.functions.nullsub(vars.$G_ess, false)==false)
  	{
		return true;
	}
	
	return false;
}

function canCloseThisChange (fChange, last, phase_close_control, table_access_close)
{
	if(last && phase_close_control && table_access_close && fChange.open && 
	   system.functions.nullsub(vars.$G_ess, false)==false && 
	   fChange.approval_status=="approved" )			
	{
		return true;;
	}
	
	return false;
}

function canUpdateThisChange(update_flag)
{
	if(update_flag && system.functions.nullsub(vars.$G_ess, false)==false)
	{
		return true;
	}
	
	return false;
}

function getTableAccessCloseFromProfile( fChange, changeCanClose )
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

function getTableAccessUpdateFromProfile( fChange, canUpdateChange )
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
