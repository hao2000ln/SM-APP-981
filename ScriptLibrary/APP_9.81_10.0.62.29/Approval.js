function buildAllStatus(record, fApprovalDef,keepRoleOld,keepRoleNew,tokens,tokenToDescription)
{ 
	var fApproval = new SCFile("Approval");
	var fSql = lib.DBUtils.getQueryByRecord(record);
	var rc = fApproval.doSelect(fSql);
	
	if ( rc == RC_SUCCESS )		
	{		
		var allStatusCount = record.approved_count + record.denied_count + record.pending_count;
		var t=0;
		
		record.current_pending_groups = system.functions.denull( record.current_pending_groups );	
		//do current pending
		var lng = system.functions.lng(record.current_pending_groups);
		for ( var i = 0; i < lng; i++ ) 
		{
			var approver = record.current_pending_groups[i];
			var level= record.current_pending_seq;
			var sLevel = new String(level);
					
			var desc=getDescription(approver, level, tokens,tokenToDescription,keepRoleOld,keepRoleNew);
			
			fApproval.all_status[t].approver = approver;
			fApproval.all_status[t].status ="Pending";
			fApproval.all_status[t].desc = desc;
			fApproval.all_status[t].level = sLevel.toString();
			t++;
		}

		//do future
		record.future_groups = system.functions.denull( record.future_groups);	
		var lng = system.functions.lng(record.future_groups);
		for (var i = 0; i < lng; i++ ) 
		{
			var approver = record.future_groups[i];
			var level= record.future_seq[i];
			var sLevel = new String(level);
		
			var desc=getDescription(approver, level, tokens,tokenToDescription,keepRoleOld,keepRoleNew);

			fApproval.all_status[t].approver = approver;
			fApproval.all_status[t].status ="Future";
			fApproval.all_status[t].desc = desc;
			fApproval.all_status[t].level =sLevel.toString();
			t++;
		}
		
		//do approved and denied
		record.approved_groups = system.functions.denull( record.approved_groups);	
		var lng = system.functions.lng(record.approved_groups);
		for (var i = 0; i < lng; i++) 
		{
			var approver = record.approved_groups[i];
			var level= record.approved_seq[i];
			var sLevel = new String(level);
			var desc=getDescription(approver, level, tokens,tokenToDescription,keepRoleOld,keepRoleNew);

			fApproval.all_status[t].approver = approver;
			fApproval.all_status[t].status =record.approved_action[i];
			fApproval.all_status[t].desc = desc;
			fApproval.all_status[t].level = sLevel.toString();
			fApproval.all_status[t].date = record.approved_date[i];			
			t++;
		}
		
		

		var ret;
	
		system.functions.rtecall("trigger", ret, 0);			
		var rc=	fApproval.doUpdate();
		system.functions.rtecall("trigger", ret, 1);
	}

}

function updateAllStatus(record, fApprovalDef)
{
	var fApproval = new SCFile("Approval");
	var fSql = lib.DBUtils.getQueryByRecord(record);
	var rc = fApproval.doSelect(fSql);
	
	if ( rc == RC_SUCCESS )		
	{		
		var saveDesc=new Array();
		var saveLevel=new Array();
		var saveApprover=new Array();
		var s=0;
		if(fApproval.all_status!=null)
		{
			for(var s=0;s<100;++s) 
			{
				if(fApproval.all_status[s]==null || fApproval.all_status[s].desc==null)
					break;
				saveDesc[s]=fApproval.all_status[s].desc;
				saveLevel[s]=fApproval.all_status[s].level;
				saveApprover[s]=fApproval.all_status[s].approver;
			}	
		} 

		var allStatusCount = record.approved_count + record.denied_count + record.pending_count;
		var t=0;
		var i=0;
		record.current_pending_groups = system.functions.denull( record.current_pending_groups );	

		//do current pending
		var lng = system.functions.lng(record.current_pending_groups);
		for ( var i = 0; i < lng; i++ ) 
		{
			var approver = record.current_pending_groups[i];
			var level= record.current_pending_seq;
			var sLevel = new String(level);

			
			if(fApproval.all_status != null)
			{
				fApproval.all_status[t].approver = approver;
				fApproval.all_status[t].status ="Pending";

				fApproval.all_status[t].level =sLevel.toString();
				t++;
			}	
		}

		//do future
		i=0;
		record.future_groups = system.functions.denull( record.future_groups);	
		var lng = system.functions.lng(record.future_groups);
		for ( var i = 0; i < lng; i++ ) 
		{
			var approver = record.future_groups[i];
			var level= record.future_seq[i];
			var sLevel = new String(level);

		
			if(fApproval.all_status != null)
			{
				fApproval.all_status[t].approver = approver;
				fApproval.all_status[t].status ="Future";

				fApproval.all_status[t].level =sLevel.toString();
				t++;
			}	
		}

		//do approved and denied
		i=0;
		record.approved_groups = system.functions.denull( record.approved_groups);	
		var lng = system.functions.lng(record.approved_groups);
		for (var i = 0; i < lng; i++) 
		{
			var approver = record.approved_groups[i];
			var level= record.approved_seq[i];
			var sLevel = new String(level);


			if(fApproval.all_status != null)
			{
				fApproval.all_status[t].approver = approver;
				fApproval.all_status[t].status =record.approved_action[i];

				fApproval.all_status[t].level = sLevel.toString();
				fApproval.all_status[t].date = record.approved_date[i];				
				t++;
			}	
		}
		
		//fill the description
		if(fApproval.all_status != null) {
			for(var count1=0;count1<t;++count1)
			{
				for(var count2=0;count2<t;++count2)
				{				
					if(fApproval.all_status[count1].approver == saveApprover[count2] && fApproval.all_status[count1].level == saveLevel[count2])
					{
						fApproval.all_status[count1].desc= saveDesc[count2];
					}
				}	
						
			}
		}

		var ret;
	
		system.functions.rtecall("trigger", ret, 0);			
		var rc=	fApproval.doUpdate();
		system.functions.rtecall("trigger", ret, 1);
	}

}

function matchDesc(oldStatus,level,approver)
{
	print( system.functions.scmsg( 154, "ScriptLibrary", [oldStatus.length] ) );
	for(var i=0; i<oldStatus.length;++i)
	{
	  	print( system.functions.scmsg( 155, "ScriptLibrary", [level, approver] ) );
		print( system.functions.scmsg( 156, "ScriptLibrary", [oldStatus[i].level, oldStatus[i].approver] ) );
		if(oldStatus[i].level==level && oldStatus[i].approver==approver)
			return oldStatus[i].desc;
	}
	return "";
}	

function getDescription2(fADef, approver, seq, keepRoleOld,keepRoleNew)
{
	var x =0;
	
	//check if the approver is a role
	approver=getApproverFromRole(approver,keepRoleOld,keepRoleNew);
	
	for ( x in fADef.group_name )
	{
		if ( fADef.group_name[x] == approver && fADef.sequence[x] == seq)
		{						
			return fADef.short_desc[x];		
		}
	}
	
	return "";
}

function getDescription(approver, seq,tokens,tokenToDescription,keepRoleOld,keepRoleNew)
{
        var tokenObj=new SCDatum(tokens);
        var descriptionObj=new SCDatum(tokenToDescription);     
        var tokenArray=tokenObj.toArray();      
        var descriptionArray=descriptionObj.toArray();
        for(var i=0;i<tokenArray.length;++i)
        {
                var aToken=approver+":"+seq;            
                if(tokenArray[i]==aToken) {
                        return descriptionArray[i];
                }       
        }       
        //check if the approver is a role
        approver=getApproverFromRole(approver,keepRoleOld,keepRoleNew);
                
        
        for(var i=0;i<tokenArray.length;++i)
        {
                var aToken=approver+":"+seq;            
                if(tokenArray[i]==aToken) {
                        return descriptionArray[i];
                }       
        }
        return "";              
}

/*
	If any approvals are pending, make interaction read only if the requestor is viewing the interaction
	record - Approval record
*/

function approvalsPending(Lfile)
{
	var ret = false;
	var requestor = vars.$L_file.alternate_contact;
 	if ( requestor == system.vars.$lo_contact_name )	
 	{
		if (vars.$L_file.approval_status=="pending")
			var ret = true;
	}

	return ret;
}

/*
	If any approvals have been denied, and logged in user is requestor, then return true.
*/

function beenDenied(Lfile)
{
	var ret = false;
	var requestor = vars.$L_file.alternate_contact;
 	if ( requestor == system.vars.$lo_contact_name )	
 	{
		if (vars.$L_file.approval_status=="denied")
			var ret = true;
	}

	return ret;
}



/**
	If approver is a role, get its role name so that description can be
	retrieved
*/
function getApproverFromRole(approverName, rolesOld,rolesNew) 
{	
	var oldObj=new SCDatum(rolesOld);
	var newObj=new SCDatum(rolesNew);	
	var oldArray=oldObj.toArray();	
	var newArray=newObj.toArray();	
	
	for(var i=0;i<newArray[0].length;++i)
	{
		if(approverName==newArray[i])
			return oldArray[i];
	}
	return approverName;
}

function setApprovalsRecordState(id, state, fileName, name)
{
	var fApproval = new SCFile("Approval");
	var fSql = "unique.key=\"" + id + "\"";
	if (fileName != undefined && fileName != null)
	{
	    fSql += " and file.name=\"" + fileName + "\"";
	}
	if (name != undefined && name != null)
	{
	    fSql += " and name=\"" + name + "\"";
	}
	var rc = fApproval.doSelect(fSql);
	
	if (rc == RC_SUCCESS)
	{
		var ret;
		system.functions.rtecall("trigger", ret, 0);
			
		do
		{
			fApproval.approvals_record = state;
			var rc = fApproval.doUpdate();
			//Start: Added for New Portal Notification coz here trigger cannot be fired
            if (lib.PortalNotification){
		        lib.PortalNotification.convertToPortalNotification('', fApproval, fApproval);
		    }
		    //End
		}while(fApproval.getNext() == RC_SUCCESS);
		
		// if table is incidents, update all related records
		if (fApproval.file_name == "incidents")
		{
		    lib.ApprovalItem.updateItemApprovalRecordFromRequest(id, state);		
		}
		
		system.functions.rtecall("trigger", ret, 1);
	}
}


function processDescription(approval1,approvalDef1)
{
	for ( i in approval1.current_pending_groups ) 
	{
		var approver = approval1.current_pending_groups[i];
		var level= approval1.current_pending_seq;
		var seq = new String(level);
		for ( x in approvalDef1.group_name )
		{
			if ( approvalDef1.group_name[x] == approver && approvalDef1.sequence[x] == seq && system.functions.evaluate(approvalDef1.condition[x], 10 ))
			{						
				vars.$L_tokens=system.functions.insert(vars.$L_tokens,0,1,approver+":"+seq);
				vars.$L_descriptions_for_token=system.functions.insert(vars.$L_descriptions_for_token,0,1,approvalDef1.short_desc[x]);
			}
		}
	}	
	
	for ( i in approval1.future_groups ) 
	{
		var approver = approval1.future_groups[i];
		var level= approval1.future_seq[i];
		var seq = new String(level);
		for ( x in approvalDef1.group_name )
		{
			if ( approvalDef1.group_name[x] == approver && approvalDef1.sequence[x] == seq && system.functions.evaluate(approvalDef1.condition[x], 10 ))
			{						
				vars.$L_tokens=system.functions.insert(vars.$L_tokens,0,1,approver+":"+seq);
				vars.$L_descriptions_for_token=system.functions.insert(vars.$L_descriptions_for_token,0,1,approvalDef1.short_desc[x]);
			}
		}
	}	
	
	for ( i in approval1.approved_groups ) 
	{
		var approver = approval1.approved_groups[i];
		var level= approval1.approved_seq[i];
		var seq = new String(level);
		for ( x in approvalDef1.group_name )
		{
			if ( approvalDef1.group_name[x] == approver && approvalDef1.sequence[x] == seq && system.functions.evaluate(approvalDef1.condition[x], 10 ))
			{						
				vars.$L_tokens=system.functions.insert(vars.$L_tokens,0,1,approver+":"+seq);
				vars.$L_descriptions_for_token=system.functions.insert(vars.$L_descriptions_for_token,0,1,approvalDef1.short_desc[x]);
			}
		}
	}
}

function getApprovalGroups(module,operator)
{
	var user = new SCFile("operator");
	var rc = user.doSelect("name=\""+operator+"\"");								  
	
	var groupsStr = "{\""+operator+"\",";
	
	if(rc == RC_SUCCESS && module=="cm3" && user.profile_change!=null)
	{
		var i=0;
		for (i in user.profile_change)
		{
			var profileName = user.profile_change[i];
				
		
			var profile = new SCFile("cm3profile");
			var rc = profile.doSelect("name=\""+profileName+"\"");
			var j=0;
		
			for(j in profile.approval_groups)
			{
				if(profile.approval_groups[j]!= null)
					groupsStr = groupsStr + "\""+profile.approval_groups[j] +"\",";
			}
		
		}
	}	
	else if(rc == RC_SUCCESS && module=="ocmq" && user.profile_request!=null)
	{
		var i=0;
		for (i in user.profile_request)
		{
			var profileName = user.profile_request[i];
				
		
			var profile = new SCFile("ocmprofile");
			var rc = profile.doSelect("name=\""+profileName+"\"");
			var j=0;
		
			for(j in profile.approval_groups)
			{
				if(profile.approval_groups[j]!= null)
					groupsStr = groupsStr + "\""+profile.approval_groups[j] +"\",";
			}
		
		}
	}	
	else if(rc == RC_SUCCESS && (module=="incidents" || module=="svcCartItem") && user.profile_incident!=null)
	{				
		var profileName = user.profile_incident
		
		var profile = new SCFile("smenv");
		var rc = profile.doSelect("name=\""+profileName+"\"");
			
		var j=0;
		
		for(j in profile.approval_groups)
		{
			if(profile.approval_groups[j]!= null)
				groupsStr = groupsStr + "\""+profile.approval_groups[j] +"\",";
		}				
	}	
	else if(rc == RC_SUCCESS && module=="timeperiodDefinition" && lib.security.getToken("Timeperiod","view")=="true")
	{				
		var j=0;
		for(j in vars.$lo_pm_assignments)
		{
			if(vars.$lo_pm_assignments[j]!= null)
				groupsStr = groupsStr + "\""+vars.$lo_pm_assignments[j] +"\",";
		}				
	}	
	return groupsStr +"}";		
}


/**
    If the approval request comes from a background thread, e.g. linker, retrieve the requestor
*/
function getRequestor(operator, file)
{
  var requestor=operator;
  var module=system.functions.filename(file);
  
  if(operator=="linker") 
  {
    if(module=="request") requestor=file.requestor_name; 
    else if(module=="cm3r") requestor=file.requested_by;    
    else if(module=="probsummary") requestor=file.opened_by;
  }

  if(requestor==null||requestor=="") return operator;
  return requestor;

}