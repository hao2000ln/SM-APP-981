
//////////////////////////////////////////////////////////////////////////////////////
//               for SM Collaboration 1.1 Previlege check before render SM link 
//////////////////////////////////////////////////////////////////////////////////////

/*
  get the list of objects(incident/probsummary) which user profile have view property set to true
  
 
  
  returns : array of objects(etch {incident, probsummary} or {incident}, or {probsummary})
  
*/
function getTicketAccess( objects )
{ 
  if(objects == null){
    return [];
  }
  var objectList = objects.split("^^^^^");
  var fOperatorInfo_has__access = new Array();
  for(var i=0; i<objectList.length; i++)
  {
	 var accessPri = getOperatorAccessPrivileges(objectList[i]);
	 if(accessPri != null && accessPri != "" && accessPri == true)
	   {
		fOperatorInfo_has__access.push(objectList[i]);		
	   }
				
	}
  return fOperatorInfo_has__access;
}

function getOperatorAccessPrivileges ( objectName )
{ 
  var currentUser = new SCFile("operator");
  var sql = "name=\""+system.functions.operator()+"\"";
  var rc = currentUser.doSelect(sql);
  var profileVar = null;
  if(objectName == "cm3r"){
    profileVar = system.vars.$G_cm3r_environment;
  } else if (objectName == "cm3t") {
    profileVar = system.vars.$G_cm3t_environment;
  } else if(objectName == "rootcause"){		
    profileVar = system.vars.$G_rc_environment;
  } else if(objectName == "incidents"){		
    profileVar = system.vars.$G_sm_environment;
  } else if(objectName == "probsummary"){   
    profileVar = system.vars.$G_pm_environment;
  } else {
    return true;
  }
  									
  if (profileVar == null || profileVar == "")
  {
	 return false;
  }
  else 
  {
     var profilePre = profileVar.view;	         
     if (profilePre == null || profilePre == false)
	   return false;						
  }
   return true;
}


