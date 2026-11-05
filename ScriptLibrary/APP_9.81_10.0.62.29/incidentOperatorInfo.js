//Bitmask constants
var INCIDENT_CAN_READ = 0x1;
var INCIDENT_CAN_CLOSE = 0x2;
var INCIDENT_CAN_REOPEN = 0x4;
var INCIDENT_CAN_RESOLVE = 0x8;
var INCIDENT_CAN_UPDATE= 0x10;


function getOperatorInfo (fOperatorInfo)
{
	var fOpInfo = new SCFile("mobilityoperatorinfo");
	system.library.MobilityAPI_Login.getOperatorInfo(fOpInfo);
	
	if (fOpInfo.has_incident_access)
	{
		fOperatorInfo.can_read = true;
	
		var RESOLVE_ACTIVE = getResolveStatus(); 
		var env = system.vars.$G_pm_global_environment;
		var folderEntitlement = system.vars.$G_folderEntitlement;
		
		var strIncidentId = fOperatorInfo.incident_number;
		
		var fIncident = new SCFile("probsummary");
		var fIncidentObject = new SCFile("Object");
		var rc = fIncidentObject.doSelect("file.name=\"probsummary\"");
		rc = fIncident.doSelect("number=\"" + strIncidentId + "\"");
		
		if (rc != RC_SUCCESS)
		{
			return false;
		}		
				
		var table_access_close;
		var table_access_update;
			
		if (folderEntitlement && system.functions.exists("tableAccess", env) && !system.functions._null(env.tableAccess))
		{
			system.vars.$L_tableAccess = env.tableAccess; 
			table_access_update = system.functions.evaluate(system.vars.$L_tableAccess.update) && !isIncidentResolvedOrClosed(fIncident);
			table_access_close = system.functions.evaluate(env.tableAccess.close);
		}
		else
		{		
			var fOperator = new SCFile("operator");
			fOperator.doSelect("name=\"" +  system.functions.operator() + "\"");
				
			var fPmenv = new SCFile("pmenv");
			rc = fPmenv.doSelect("name=\"" + fOperator.profile_incident + "\"");		
			
			if (rc != RC_SUCCESS)
			{
				table_access_close = false;
				table_access_update = false;	
			}
			else
			{
				table_access_close = getTableAccessCloseFromProfile(fPmenv);
				table_access_update = getTableAccessUpdateFromProfile(fPmenv, fIncident, fOperator.name) && !isIncidentResolvedOrClosed(fIncident);
			}
		}
		
		var mode = new String(system.vars.$L_mode);
		
		
		
		if (mode != null)
		{
			system.library.MobilityCommonTools.log("mode.slice(0,3) " + mode.slice(0,3));
		}
		 
		//status in $L.filed~={"closed", "resolved"} and $L.ts and evaluate($L.tableAccess.close) or evaluate($L.tableAccess.close) and $G.bg 
		//and nullsub($G.ess, false)=false
		//can.resolve
		
		fOperatorInfo.can_resolve = canResolveIncident(fIncident, RESOLVE_ACTIVE, table_access_close);
		
		//status in $L.filed~="closed" and $L.mode~="close" and nullsub($L.new.status, status in $L.filed)~="resolved" and evaluate($L.tableAccess.close) 
		//and not $L.ts or evaluate(inactivate in $G.pm.environment) and $L.ts and status in $L.filed="resolved" and nullsub($G.ess, false)=false
	
		//can.close	
		fOperatorInfo.can_close = canCloseIncident(fIncident, RESOLVE_ACTIVE, table_access_close);
		
		
		//evaluate(reopen in $G.pm.environment) and status in $L.filed={"closed", "pending callback", "resolved"} 
		//and nullsub($L.new.status, "notresolved")~="resolved" and nullsub($G.ess, false)=false
	
		//can.reopen
		fOperatorInfo.can_reopen = canReopenIncident(fIncident);
		
		//($L.mode!="close" or evaluate($L.tableAccess.update) and $L.mode~#"add") and nullsub($G.ess, false)=false
		
		//can.update	
		fOperatorInfo.can_update = canUpdateIncident(fIncident, table_access_update, mode);
		
	}
	else
	{
		fOperatorInfo.can_resolve = false;
		fOperatorInfo.can_close = false;		
		fOperatorInfo.can_reopen = false;
		fOperatorInfo.can_update = false;
		fOperatorInfo.can_read = false;
	}
	return true;
}



function getMassOperatorInfo (fOperatorInfo)
{	
	var RESOLVE_ACTIVE = getResolveStatus(); 
	var env = system.vars.$G_pm_global_environment;
	var folderEntitlement = system.vars.$G_folderEntitlement;
	
	var fIncident = new SCFile("probsummary");
	var fIncidentObject = new SCFile("Object");
	var rc = fIncidentObject.doSelect("file.name=\"probsummary\"");
	var fOpInfo = new SCFile("mobilityoperatorinfo");
	
	system.library.MobilityAPI_Login.getOperatorInfo(fOpInfo);
	
	var length = system.functions.lng(fOperatorInfo.record_id);
	var permissionsMasks = [];
	
	for (var x = 0; x < length; x++)
	{	
		var permissionsMask = 0;
		
	
		if (fOpInfo.has_incident_access)
		{
			permissionsMask = INCIDENT_CAN_READ
			
			var strIncidentId = fOperatorInfo.record_id[x];
			rc = fIncident.doSelect("number=\"" + strIncidentId + "\"");
			
			if (rc != RC_SUCCESS)
			{
				return false;
			}		
					
			var table_access_close;
			var table_access_update;
				
			if (folderEntitlement && system.functions.exists("tableAccess", env) && !system.functions._null(env.tableAccess))
			{
				system.vars.$L_tableAccess = env.tableAccess;
				table_access_update = system.functions.evaluate(system.vars.$L_tableAccess.update) && !isIncidentResolvedOrClosed(fIncident);
				table_access_close = system.functions.evaluate(env.tableAccess.close);
			}
			else
			{		
				var fOperator = new SCFile("operator");
				fOperator.doSelect("name=\"" +  system.functions.operator() + "\"");
					
				var fPmenv = new SCFile("pmenv");
				rc = fPmenv.doSelect("name=\"" + fOperator.profile_incident + "\"");		
				
				if (rc != RC_SUCCESS)
				{
					table_access_close = false;
					table_access_update = false;	
				}
				else
				{
					table_access_close = getTableAccessCloseFromProfile(fPmenv);
					table_access_update = getTableAccessUpdateFromProfile(fPmenv, fIncident, fOperator.name) && !isIncidentResolvedOrClosed(fIncident);
				}
			}
			
			var mode = new String(system.vars.$L_mode);
			
			
			
			if (mode != null)
			{
				system.library.MobilityCommonTools.log("mode.slice(0,3) " + mode.slice(0,3));
			}
			 
			//status in $L.filed~={"closed", "resolved"} and $L.ts and evaluate($L.tableAccess.close) or evaluate($L.tableAccess.close) and $G.bg 
			//and nullsub($G.ess, false)=false
			//can.resolve
			if (canResolveIncident(fIncident, RESOLVE_ACTIVE, table_access_close))
			{
				permissionsMask = INCIDENT_CAN_RESOLVE | permissionsMask;
			} 
			
			//status in $L.filed~="closed" and $L.mode~="close" and nullsub($L.new.status, status in $L.filed)~="resolved" and evaluate($L.tableAccess.close) 
			//and not $L.ts or evaluate(inactivate in $G.pm.environment) and $L.ts and status in $L.filed="resolved" and nullsub($G.ess, false)=false
		
			//can.close
			if (canCloseIncident(fIncident, RESOLVE_ACTIVE, table_access_close))
			{
				permissionsMask = INCIDENT_CAN_CLOSE | permissionsMask;		
			}		
			//evaluate(reopen in $G.pm.environment) and status in $L.filed={"closed", "pending callback", "resolved"} 
			//and nullsub($L.new.status, "notresolved")~="resolved" and nullsub($G.ess, false)=false
		
			//can.reopen
			if (canReopenIncident(fIncident))
			{
				permissionsMask = INCIDENT_CAN_REOPEN | permissionsMask;
			}
			
			//($L.mode!="close" or evaluate($L.tableAccess.update) and $L.mode~#"add") and nullsub($G.ess, false)=false
			
			//can.update	
			if (canUpdateIncident(fIncident, table_access_update, mode))
			{
				permissionsMask = INCIDENT_CAN_UPDATE | permissionsMask;
			}
		} 
		
		permissionsMasks[x] = permissionsMask;
		
		
	}
	
	fOperatorInfo.permissions_mask = new SCDatum(permissionsMasks);
		
	return true;
}

function getResolveStatus()
{
 	var status = system.vars.$G_pm_global_environment.two_step;
	
	if (status == null)
	{
		return false;
	}
	
	return status;
}		

function canResolveIncident(fIncident, RESOLVE_ACTIVE, table_access_close)
{
	if (fIncident.status != "closed" && fIncident.status != "resolved" && RESOLVE_ACTIVE && table_access_close)
	{
		return true;
	}
	
	return false;
}

function canCloseIncident(fIncident, RESOLVE_ACTIVE, table_access_close)
{
	if ((fIncident.status != "closed" && system.vars.$L_mode != "close" && 
	  	 system.vars.$L_new_status != "resolved" && fIncident.status != "resolved" && !RESOLVE_ACTIVE && table_access_close) 
				|| 
		(system.functions.evaluate(system.vars.$G_pm_environment.inactivate) && RESOLVE_ACTIVE && 
		(system.vars.$L_new_status == "resolved" || fIncident.status == "resolved") && table_access_close))
	{
		return true;
	}

	return false;	
}

function canUpdateIncident(fIncident, table_access_update, mode)
{
	if (((system.vars.$L_mode != "close" && table_access_update) && !(mode.slice(0,3) == "add")) || 
	    fIncident.status == "resolved" && table_access_update)
	{
		return true;
	} 
	
	return false;

}

function canReopenIncident(fIncident)
{
	if (system.functions.evaluate(system.vars.$G_pm_environment.reopen) && 
 	    (fIncident.status == "closed" || fIncident.status == "pending callback" || fIncident.status == "resolved") && 
		 system.vars.$L_new_status != "resolved")
	{
		return true;
	}
	
	return false;

}


function getTableAccessCloseFromProfile ( fPmenv )
{
	return fPmenv.close;
}

function isIncidentResolvedOrClosed( fIncident )
{
	if (fIncident.status == "resolved" || fIncident.status == "closed")
	{
		return true;
	}
	
	return false;
		
}

function getTableAccessUpdateFromProfile( fPmenv, fIncident, strOperatorName )
{
	var allowed = fPmenv.update;
	
	if (allowed == "never")
	{
		return false;
	}
	else if (allowed == "always")
	{
		if (fIncident.status != "closed" || fPmenv.closed_update)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else if (allowed == "assigned")
	{
		if (fIncident.assignee_name == strOperatorName && (fIncident.status != "closed" || fPmenv.closed_update))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	
	return false;
}