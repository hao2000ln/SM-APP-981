/*  This set of scripts is called when a kmdocument record needs an 
*   associated change request. 
*
*   This is called from these kmdocument processes:
*     kmdocument.submitapproval
*     kmdocument.transfer
*     kmdocument.modify
*/

function KMCreateChangeRequest(record)
{
  var misc2_length = 49; // truncate so that database doSave does not need to
  var description_length = 109; // truncate so that database doSave does not need to

  
  // Create a new change request for this kmdocument. 
  vars.$L_changerequest = new SCFile("cm3r");
  vars.$L_changerequest.middle.id = record.id;
  vars.$L_changerequest.middle.kmdoctype = "kmdocument."+record.doctype;
  
  vars.$L_changerequest.header.brief_description = record.id + " - " + record.title;
  vars.$L_changerequest.middle.misc2 = record.id + " - " + record.title;

  // Don't use middle.logical_name. It's reserved.
  vars.$L_changerequest.header.category = "KM Document";
  var theXMLDate = new XMLDate( new Date() );
  var todaysDate = theXMLDate.getDatum();
  vars.$L_changerequest.header.date_entered = todaysDate;
  vars.$L_changerequest.header.planned_start = todaysDate;
  vars.$L_changerequest.header.reason = "";
  if (record.assoc_published_doc == null) 
  {
  	vars.$L_changerequest.header.reason = "new"; //Display value: New Knowledge, see globallist: KM Change Reasons
  	vars.$L_changerequest.header.description_structure.description[0] = record.id + " - " + record.title + " - A new knowledge document was contributed. Determine whether to approve it, edit and review it further, or retire it.";
    vars.$L_changerequest.header.description_structure.backout_method[0] = "Delete the new knowledge document that was contributed.";
  }	
  else 
  {
    vars.$L_changerequest.header.reason = "Revision of an Approved Document";
    // Determine the status of the approved version
    var fAppVersion = new SCFile("kmdocument", SCFILE_READONLY);
    fAppVersion.setFields(["status"]);
    var apprc = fAppVersion.doSelect("id=\""+record.assoc_published_doc+"\"");
    vars.$L_changerequest.header.description_structure.description[0] = record.id + " - " + record.title + " - An approved knowledge document needs revision. Determine whether to re-approve it, edit and review it further, retire it, or revert back to the approved version. Status of the approved version: " + fAppVersion.status;
    vars.$L_changerequest.header.description_structure.backout_method[0] = "Revert this document back to the approved version, or retire the approved version.";
  }
  
  // Truncate these fields so the database doSave does not need to.
  vars.$L_changerequest.header.brief_description = lib.KMUtils.truncateStringWithEllipsis( vars.$L_changerequest.header.brief_description, description_length );
  vars.$L_changerequest.middle.misc2 = lib.KMUtils.truncateStringWithEllipsis( vars.$L_changerequest.middle.misc2, misc2_length );
  vars.$L_changerequest.header.description_structure.description[0] = lib.KMUtils.truncateStringWithEllipsis( vars.$L_changerequest.header.description_structure.description[0], description_length );
   
  var login = funcs.operator();
 
  var fOperator = new SCFile("operator", SCFILE_READONLY);
  fOperator.setFields(["contact.name"]);
  var rc = fOperator.doSelect("name=\""+login+"\"");
  
  // need to check Phase definition to know if login (funcs.operator()) 
  //   or fullname is used.

  var name = login;
  if (fOperator.contact_name != null)
  {
  	name = fOperator.contact_name;
  }

  vars.$L_changerequest.header.requested_by = name; 


  vars.$L_changerequest.header.operator = login;

  // not flushed out by category  
  
  vars.$L_changerequest.middle.user_name = login;
  vars.$L_changerequest.header.orig_operator = login;

  // Make the planned end a week later. 7D is 7 days, and P is duration
  theXMLDate.addDuration('P7D');
  var nextWeeksDate = theXMLDate.getDatum();

  vars.$L_changerequest.header.planned_end = nextWeeksDate; 
  vars.$L_changerequest.header.open = true;
  vars.$L_changerequest.header.current_phase = "KM 1 Triage"; // below, too
  vars.$L_changerequest.middle.misc1 = "Determine how to proceed with a Knowledge Document";
  vars.$L_changerequest.middle.misc_array1 = record.categories;
  
  vars.$L_changerequest.header.risk_assessment = "0";
  vars.$L_changerequest.close.completion_code = 1;
  vars.$L_changerequest.header.last = true;

  var callRtn = new SCDatum();
  var nextNumber = new SCDatum();
  funcs.rtecall("getnumber", callRtn, nextNumber, "cm3r");

  vars.$L_changerequest.header.number = nextNumber.getText();
  vars.$L_changerequest.header.priority_code = "3";
  vars.$L_changerequest.severity = "3";  // urgency
  vars.$L_changerequest.initial_impact = "3";
  vars.$L_changerequest.header.page = 1;
  vars.$L_changerequest.header.total_pages = 1;
  vars.$L_changerequest.header.risk_assessment = "0";

  vars.$L_changerequest.header.status = "evaluate";
 
  // The cm3rpage table needs this string for auditing.
  vars.$L_changerequest.header.number_string = vars.$L_changerequest.header.number; 
  
  // determine the need for a Service Level Agreement (SLA) number
  
  // Before calling doAction(), we need to init $L.category, $L.phase, 
  //  $L.fc, $L.fc.master, $L.saved
  
  // ****** Create the new cm3r change request record below ******
  // ******   by calling cm.open.save or doAction("add").   ******
  if (record.status=="retired" || record.assoc_published_doc != null)
  {
		var rcinsert = vars.$L_changerequest.doInsert();
  } 
  else
  {
	  // Call cm.open.save process on already-saved cm3r record so that notifications will be created
	  // and whatever else needs to be done. Every object knows best about how to save itself on an open 
	  // or update or close. The customer will customize cm.open.save for his own sla's.
	  
	  // Need to init $L.category, $L.phase, $L.fc, $L.fc.master, $L.saved, $L.bg before calling cm.open.save.
	  // The first 5 are objects, and the last two are booleans
	    
	  // Initialize the 2 booleans for the cm.open.save process.
	  vars.$L_saved = false;  // false if we don't save the cm3r record; we let cm.save.open save it.
	  vars.$L_bg = true; // If this user has several cm profiles and background is false, ChM won't ask him which one he's using.
	  
	  // Initialize the 4 objects for the cm.open.save process. 
	  vars.$L_category = new SCFile("cm3rcategory");
	  vars.$L_phase = new SCFile("cm3rcatphase");
	  vars.$L_fc = new SCFile("formatctrl");
	  vars.$L_fc_master = new SCFile("formatctrl");
	  // For the 5th object vars.L_file, in the Final JavaScript of the calling process, 
	 
	  rc = vars.$L_category.doSelect( "name=\"KM Document\"");
	  
	  rc = vars.$L_phase.doSelect( "name =  \"KM 1 Triage\"" );
	  vars.$L_phase.upd_script=null;
	  vars.$L_phase.upd_script_cond=false;
	  /*QCCR1E54805 begin*/
	  /*corrected by yuli since 10/09/19*/
	  /*Making format control to be retrieved from the phase, it is the value of default view configuring in phase*/
	  rc =vars.$L_fc.doSelect( "name = \""+vars.$L_phase.view_default+"\"");
	  if (!rc)
	  {  
		print("Cannot find the filectrl record.");
	  }
	  /*QCCR1E54805 end*/
	  
	  vars.$L_fc_master.doSelect( "name = \"cm3r\""); 
  } 
  return true;
}

/** 
  This function sets the status of a cm3r change request where the category is "KM Document".
  In the Final Javascript section of the Processes cm.next.phase and cm.chg.phase, this
    function is called like this:
  if (vars.$L_file.category=="KM Document")
      lib.KMChangeManagement.setStatus(vars.$L_file); // set status based on phase
**/
function setStatus(record)
{
	if (record.current_phase=="KM 1 Triage") {
		record.status="evaluate";
	}
	else if (record.current_phase=="KM 2 Revise") {
		record.status="update";
	}
	else if (record.current_phase=="KM 3 Review Read-only") {
		record.status="comment";
	}
	else if (record.current_phase=="KM 4 Conclude") {
		record.status="resolve: approve/reject";
	}
	return record;
}


/** 
  This function fills in 6 arrays for the 'KM get ChM users' wizard based on a
  document's categories and the permission passed in.
  
  docRec - kmdocument record associated with the change request
  permissionName - (approve) internal for owners or edit.in.workflow for assignees
  logins,fullnames,profiles,groups,categories - 6 arrays for the wizard
  
**/
function getChangeOwnersOrAssignees(docRec,permissionName,logins,fullnames,profiles,groups,categories,phones)
{
	// permissionName is (approve) internal or edit.in.workflow
	var idx = 0; // index for inserting into the arrays
	
	// Get the id of the KM Admin profile
	var adminProfile = new SCFile("kmprofile", SCFILE_READONLY);
	adminProfile.setFields(["name"]);
	var adminId = funcs.scmsg(20, "km");	
	
	// If the permissionName is edit.in.workflow, then do not add the admins to the list.
	// An admin is not a subject matter expert and should not be a possible assignee, 
	//   unless he is in a kmgroup explicitly associated with a category and a profile 
	//   that has edit.in.workflow rights.
	if (permissionName != "edit.in.workflow")
	{
		// Read the name of the profile with id KMP006 (presumably KM ADMIN)
		var adminProfileName = "KM ADMIN";
		var rc = adminProfile.doSelect( "id = \"" + adminId + "\"");  
		if ( rc != RC_SUCCESS )
		{
			var arrayArgs = new SCDatum();
			arrayArgs.setType(8);  //type array
			arrayArgs.push(RCtoString(rc));
			arrayArgs.push(adminId);
			print(funcs.scmsg(56, "km", arrayArgs));
			
		}
		else
		{
			adminProfileName = adminProfile.name;
			// Read the operators who have a capability word of SysAdmin or KMAdmin
			// Add the users' login names, full names, phones, and the profile name to thread arrays, with
			//   a blank group and category
			var admins = new SCFile("operator", SCFILE_READONLY);
			admins.setFields(["name","full.name"]);
			rc = admins.doSelect( "cap.exec = \"SysAdmin\" or cap.exec = \"KMAdmin\"");  
			if ( rc == RC_SUCCESS )
			{
				rc = admins.getFirst();
				while(rc == RC_SUCCESS)
				{
					logins.push(admins.name);
					fullnames.push(admins.full_name);
					profiles.push(adminProfileName);
					groups.push("");
					categories.push("");
					var ret = lib.userUtils.findContactByField("operator.id", admins.name);
					if ( ret != null && ret.contact_phone != null ) {
						phones.push(ret.contact_phone);
					}
					else {
						phones.push("");
				    }
	
					rc = admins.getNext();	
				}
			}
			else {
			    print(funcs.scmsg(57, "km"));
			}
				
		}
	} // end if permissionName is not "edit.in.workflow"

	// Create part of a where clause that lists the categories in the docRec
	var whereClause = "";
	if (docRec.categories.length() == 0) {
	    print(funcs.scmsg(58, "km")); // This document has no associated categories. Only Admins can be selected.
	}
	else
	{
	    var i, iLength = docRec.categories.length();
		for (i = 0; i < iLength; i++)
		{
			var splitArray = docRec.categories[i].split(":");
			var splitIndex;
			for (splitIndex = 0; splitIndex < splitArray.length; splitIndex++)
			{
				if (whereClause == "") {
					whereClause += " and (id = \"" + splitArray[splitIndex] + "\"";
				}
				else {
					whereClause += " or id = \"" + splitArray[splitIndex] + "\"";
				}
			}	
		}
		if (whereClause != "") {
			whereClause += ")";
		}
				
		// Read all the profiles (besides KMP006) that have the permissionName
		var profileFile = new SCFile("kmprofile", SCFILE_READONLY);
		profileFile.setFields(["id","name"]);

		// The KM ADMIN profile cannot be associated with a category, since the wizard to
		//   associate a group to a profile to a category does not list KM ADMIN as a profile.
		var selectStmt = "id ~= \"" + adminId + "\" and " + permissionName + " = true";  

		var rcProfile = profileFile.doSelect( selectStmt );  
		if ( rcProfile != RC_SUCCESS )
		{
			arrayArgs = new SCDatum();
			arrayArgs.setType(8);  //type array
			arrayArgs.push(RCtoString(rcProfile));
			arrayArgs.push(permissionName);
			print(funcs.scmsg(59, "km", arrayArgs));
			
		}
		else
		{
			// Loop through the profiles
			// For each category in docRec and for the categories above the category, 
			//   determine all groups associated with the profile
			rcProfile = profileFile.getFirst();
			while(rcProfile == RC_SUCCESS)
			{
				var catFile = new SCFile("kmcategory", SCFILE_READONLY);
				
				var rcCat = catFile.doSelect( "kmprofile = \"" + profileFile.id + "\"" + whereClause);  
				if ( rcCat == RC_SUCCESS )
				{
					// Loop through the categories for this profile
					// For each category in docRec and for the categories above the category, 
					//   determine all groups associated with the profile
					rcCat = catFile.getFirst();
					while(rcCat == RC_SUCCESS)
					{					
						// Get the group for this profile and category
						var catFilePermissions = catFile.permission;
						
						// Determine which groups have this profile, then read the group records to get the members.
						var pIndex, pLength = catFilePermissions.length();
						for( pIndex = 0; pIndex < pLength; pIndex++)
						{
							
							idx = funcs.index( profileFile.id, catFilePermissions[pIndex].kmprofile); 
							if(idx > 0)
							{
								// This permission has the profile in it. Get the associated group id.
								var groupId = catFilePermissions[pIndex].kmgroup;
								
								// Get the category's full path name for display purposes.
								var fullpathname = catFile.name; // in case top level
								if (catFile.pathname != null && catFile.pathname != "")	 {	
									fullpathname = catFile.pathname + " > " + catFile.name; // e.g., HR > Benefits						
								}
								
								// Loop through groups. 
								// Not coded but cold be added:
								//   If present group not already in processed group list, get the members and add:
								//   login names, full names, and profile name, group name, and category to thread arrays
								// Read the group members and add them to the lists
								var groupFile = new SCFile("kmgroup", SCFILE_READONLY);
								var rcGroup = groupFile.doSelect( "id = \"" + groupId + "\""); 
								if ( rcGroup == RC_SUCCESS )
								{
									// Loop through the members
									rcGroup = groupFile.getFirst();
									while(rcGroup == RC_SUCCESS)
									{
										// Get the group for this profile and category
										var operatorArray = groupFile.operators;
	
										// Determine which groups have this profile, then read the group records to get the members.
										var opIndex, opLength = operatorArray.length();
										for( opIndex = 0; opIndex < opLength; opIndex++)
										{
											
											idx = funcs.index( operatorArray[opIndex], logins); 
											if(idx == 0)
											{	
												logins.push(operatorArray[opIndex]);
												var ret = lib.userUtils.findOperatorByField("name", operatorArray[opIndex]);
												if ( ret != null && ret.full_name != null ) {
													fullnames.push(ret.full_name);
												}
												else {
													fullnames.push("");
												}
												profiles.push(profileFile.name);
												groups.push(groupFile.name);
												categories.push(fullpathname);
												ret = lib.userUtils.findContactByField("operator.id", operatorArray[opIndex]);
												if ( ret != null && ret.contact_phone != null ) {
													phones.push(ret.contact_phone);
												}
												else {
													phones.push("");
											    }
											}
										}
										rcGroup = groupFile.getNext();	
									}
								}		
							}						
						}
						rcCat = catFile.getNext();
					}						
				}	
				rcProfile = profileFile.getNext();	
			}			
		}
	}
	return;	
}