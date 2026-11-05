/**
need comments here
*/
function cmkmUpgrade()
{
	var cmrec = new SCFile("cm3r");
	var kmrec = new SCFile("kmdocument");
	var rcCM;
	var rcKM;
	   
	rcCM = cmrec.doSelect("category=\"KM Document\" and open=true");
 
	while (rcCM == RC_SUCCESS)
	{ 
	   rcKM = kmrec.doSelect("id=\""+cmrec.id+"\"");
	   if (rcKM == RC_SUCCESS)
	   {
	     // Mapping 3 fields in KM based on current.phase,assigned.to,coordinator in CM     
	     kmrec.status = getStatus(cmrec.current_phase); 
	     kmrec.assignedEditor = cmrec.assigned_to;
	     kmrec.documentOwner = cmrec.coordinator;
	     rcKM = kmrec.doUpdate();     
	   }
	   // Change record related to the kmdocument ID to be forced to 'closed' status 
	   cmrec.open = false;
	   cmrec.completion_code = 1;
	   cmrec.status = "closed";
	   rcCM = cmrec.doUpdate();
	   
	   rcCM = cmrec.getNext();
	}
}


function getStatus(phase)
{
  switch (phase)
  {
    case "KM 1 Triage":
     return "triage";
    
    case "KM 2 Revise":
     return "revise";
     
    case "KM 3 Review Read-only":
     return "review";
    
    case "KM 4 Conclude":
     return "conclude" ;

    default:
    return "triage";
  } 
}

// Read the operators who have a capability word of SysAdmin or KMAdmin and add the secRole of system administrator
// and knowledge administrator respectively.

function updateSecRoles()
{
	var opers = new SCFile("operator")
 	var rc = opers.doSelect("cap.exec = \"SysAdmin\" or cap.exec = \"KMAdmin\"");
 
	while (rc == RC_SUCCESS)
	{
		var srarray = opers.secRole.toArray();
		var cearray = opers.cap_exec.toArray();
		
		//Begin modified by LiuYongliang for QCCR1E64831
		var index = getNewIndex(srarray);
		//End modified by LiuYongliang for QCCR1E64831
		       
		if (system.functions.index("SysAdmin",cearray)>0 
			&& system.functions.index("system administrator",srarray)==0)
	    {
		      opers.secRole[index] = "system administrator";
		      opers.doUpdate();
		}
	    else if (system.functions.index("KMAdmin",cearray)>0 
		    		&& system.functions.index("knowledge administrator",srarray)==0)
		{ 
		      opers.secRole[index] = "knowledge administrator";
		      opers.doUpdate();
		}
		 
		rc = opers.getNext();
	}
}

/*
Get the index for new item to be inserted to the arry.
the new item will be inserted to replace the first null item or empty item.

Added by LiuYongliang, for fixing the CR:
QCCR1E64831[Upgrade] System Admin does not have permisson to view RuleSet
*/
function getNewIndex(array){
	if(array.length>0){
		for (i = 0; i < array.length; i++)
		   {
		      if (array[i] == null || array[i] == "")
		      {        
		         return i;
		      }
		   }
		  return array.length;
	}
	return 0;
}
