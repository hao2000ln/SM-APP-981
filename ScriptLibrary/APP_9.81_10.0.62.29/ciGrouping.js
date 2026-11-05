//You must pass in the logical name of the group you wish to get the members of
//If you are passing in a baseline group you must also pass in the baseline version for which
//you would like the members.
function returnGroupMembers( groupName, queryFileName, baselineVersion )
{
	//This function will return all the members that are listed as part of it's group regardless
	//of whether or not the group is query-defined or hard-coded.  These values will be returned 
	//in an array.  If the group is not found or no members are found then the value 'null' is 
	//returned	
	var groupArray = [];
	var joinFile = new SCFile("joincigroup");
	var groupQuery;

	if (joinFile.doSelect("logical.name=\"" + groupName + "\"") == RC_SUCCESS)
	{	
		if (joinFile.subtype == "Baseline")
		{
			var versionLng = funcs.lng(funcs.denull(joinFile.baseline_version));
			
			if (versionLng > 0)
			{
				var index = 0;
				var versionFound = false;
				while (index <= versionLng && versionFound == false)
				{
					if (joinFile.baseline_version[index].version_number == baselineVersion)
					{
						versionFound = true;
						groupQuery = joinFile.baseline_version[index].version_query;
					}
					index++;
				}
			}
			else {
				return null;
			}
		}
		//If the group type is a list then simply return the variable containing that list
		if (joinFile.group_type == "list")
		{
			groupArray = joinFile.group_members.toArray();
			return groupArray;
		}
		//If the group is defined as a query then perform the query and save all the devices found
		//into an array that can be returned.
		if (joinFile.group_type == "query" || joinFile.subtype == "Baseline")
		{
			if (queryFileName == null) {
				queryFileName = "device";
			}

			if (joinFile.subtype == "Baseline") {
				joinFile.group_query=groupQuery;
			}
			
			if (joinFile.group_query == null) {
				joinFile.group_query="false";
			}
			
			var deviceFile = new SCFile(queryFileName, SCFILE_READONLY);
			deviceFile.setFields(["logical.name"]);
			//use the query defined in the group to collect all the CI group members...do this against the device file
			//not the joinfile
			if (deviceFile.doSelect(joinFile.group_query) == RC_SUCCESS)
			{
				var index = 0;
				do
				{
					groupArray[index]=deviceFile.logical_name;
					index++;
				}
				while (deviceFile.getNext() == RC_SUCCESS);
				return groupArray;
			}
			else {
				return null;
			}
		}
	}
	else {
		return null;
	}
}


function isInGroup( ci, groupName, baselineVersion )
{
	//this function returns true if the ci is in the group and false if it's not
	var joinFile = new SCFile("joincigroup");
	var deviceFile = new SCFile("device");
	var isInList = false;
	var groupQuery;
	
	if (deviceFile.doSelect("logical.name=\""+ci+"\"") == RC_SUCCESS)
	{	
		if (joinFile.doSelect("logical.name=\"" + groupName + "\"") == RC_SUCCESS)
		{
			//if checking against a baseline group then the particular query for the version must be pulled out and saved
			//to use below.
			if (joinFile.subtype == "Baseline")
			{
				var versionLng = funcs.lng(funcs.denull(joinFile.baseline_version));
				if (baselineVersion != null)
				{
					if (versionLng > 0)
					{
						var index = 0;
						var versionFound = false;
						while (index <= versionLng && versionFound == false)
						{
							if (joinFile.baseline_version[index].version_number == baselineVersion)
							{
								versionFound = true;
								groupQuery = joinFile.baseline_version[index].version_query;
							}
							index++;
						}
						if (versionFound == false) {
							return isInList;
						}
					}
				}
				else {
					return isInList;
				}
			}	
			//If the group type is a list then denull the list and check to see if the ci passed in is in the list
			if (joinFile.group_type == "list")
			{
				joinFile.group_members = funcs.denull(joinFile.group_members); 
				isInList = funcs.index(ci, joinFile.group_members)>0;
				return isInList;
			}
			//If the group is defined as a query then check the values in the CI record against the query defined
			//in the group and see if they satisfy the parameters of the query
			if (joinFile.group_type == "query" || joinFile.subtype == "Baseline")
			{
				if (joinFile.group_type == "query") {
					groupQuery = joinFile.group_query;
				}
					
				if (funcs.evaluate_query(groupQuery, deviceFile) == true) {
					isInList = true;
				}
			}
		}
	}
	return isInList;
}


function addToGroup( ci, groupName )
{		
	var index=0;	
	var joinFile = new SCFile("joincigroup");
	var groupMembers = [];
	
	var ciType = funcs.type(ci);
	
	if (joinFile.doSelect("logical.name=\"" + groupName + "\"") == RC_SUCCESS)
	{
		if (joinFile.group_type == "query") {
			return 0;
		}
		
		if (joinFile.group_type == "list")
		{
			joinFile.group_members = funcs.denull(joinFile.group_members);	
						
			if (ciType == 2) {
				joinFile.group_members = funcs.insert(joinFile.group_members,0,1,ci);
		    }				

			if (ciType == 8)
			{
				var ciArray = [];
				ciArray = ci.toArray();
						
				do
				{
					joinFile.group_members = funcs.insert(joinFile.group_members,0,1,ciArray[index]);
					index++;
				}
				while (index < ciArray.length);
			}
			
			if (ciType == 6)
			{
				do {
					joinFile.group_members = funcs.insert(joinFile.group_members,0,1,vars.$L_file.logical_name);
				}
				while (vars.$L_file.getNext() == 1);
			}

			var result = joinFile.doAction("save");
			return 1;

		}
		else {
		    return 0;
		}
	}
}


//returns true if the ci(s) were removed from the group and false if they weren't
function removeFromGroup( ci, groupName )
{
	var joinFile = new SCFile("joincigroup");
	var ciIndex = 0;	
	var ciType;
	var ciFlag = false;

	ciType = funcs.type(ci);
			
	if (joinFile.doSelect("logical.name=\"" + groupName + "\"") == RC_SUCCESS)	
	{
		if (joinFile.group_type == "query") {
			return 0;
		}
			
		if (joinFile.group_type == "list")
		{
			joinFile.group_members=funcs.denull(joinFile.group_members);		
			
			if (ciType == 2)
			{
				ciIndex = funcs.index(ci, joinFile.group_members);
				if (ciIndex > 0)
				{
					joinFile.group_members = funcs._delete(joinFile.group_members, ciIndex);
					ciFlag = true;					
				}
			}			
			if (ciType == 8)
			{	
				var ciArray = [];
				ciArray = ci.toArray();
				var index = 0;
				do
				{
					ciIndex = funcs.index(ciArray[index], joinFile.group_members);
					if (ciIndex > 0)
					{
						joinFile.group_members = funcs._delete(joinFile.group_members, ciIndex);
						ciFlag = true;						
					}
					index++;
				}
				while (index < ciArray.length);
			}			
			if (ciType == 6)
			{
				do
				{
					ciIndex = funcs.index(vars.$L_file.logical_name, joinFile.group_members);
					if (ciIndex > 0)
					{
						joinFile.group_members = funcs._delete(joinFile.group_members, ciIndex);
						ciFlag = true;
					}
				}
				while (vars.$L_file.getNext() == 1);
			}
			if (ciFlag == true && funcs.lng(joinFile.group_members)>0)
			{
				joinFile.doAction("save");
				return 1;
			}
			if (funcs.lng(joinFile.group_members)==0) {
				return "-1";
		    }
			else {
			    return 0;
			}
		}
	}
}


/*!
 * Rewrite returnMyGroups function for QCCR61974 for performance issue.
 * 
 * @param ci - logical name of CI
 * @param groupType - could be "list", "query" or "both"
 * @return array of groups which ci is belong to
 *
 * @author wzeng@hp.com
 * @date   2011-3-11
 */
function returnMyGroups( ci, groupType ) {
    
    var _file = lib.FileUtil._file;
    
    var groupArray = new SCDatum();
    groupArray.setType( 8 ); // array
    
    //we must get the ci device record
    var deviceFile = _file( "device" ).select( 'logical.name="' + ci + '"' );
    
    if( deviceFile.success ) {
        
        groupType = groupType || "both";

        var handleList = function( file ) {
            if( _isMemberOf( file['group.members'], deviceFile.getFieldValue( 'logical.name' ) ) ) {
                groupArray.push( file['logical.name'] );
            }
        };

        var handleQuery = function( file ) {
            if( deviceFile.evaluateQuery( file.group_query ) ) {
                groupArray.push( file['logical.name'] );
            }
        };

        var handleBaseline = function( file ) {
            var baselineVersions = file['baseline.version'];
            if( baselineVersions != null ) {
                for( var i = 0, n = baselineVersions.length(); i < n; i++ ) {
                    if( deviceFile.evaluateQuery( baselineVersions[i]['version.query'] ) ) {
                        groupArray.push( file['logical.name'] );
                        break;
                    }
                }
            }
        };

        if( groupType == "list" ) {
            _file( "cigroup" ).select( 'group.type="list"' ).iterate( handleList );
            
        }else if( groupType == "query" ) {
            _file( "cigroup" ).select( 'group.type="query"' ).iterate( handleQuery );
            _file( "joincigroup" ).select( 'type="cigroup" and subtype="Baseline"' ).iterate( handleBaseline );
            
        }else if( groupType == "both" ) {
            _file( "cigroup" ).select( 'group.type="list" or group.type="query"' ).iterate( 
                function( cigroup ) {
                    ( cigroup[ 'group.type' ] == 'list' ? handleList : handleQuery )( cigroup );
                }
            );
            _file( "joincigroup" ).select( 'type="cigroup" and subtype="Baseline"' ).iterate( handleBaseline );
        }
    }
    
    return groupArray;
}

function _isMemberOf( members, ci ) {
    var b = false;
    if( members != null ) {   
        for( var i = 0, n = members.length(); ( ! b ) && ( i < n ); i++ ) {
            if( members[i] == ci ) {
                b = true;
            }
        }
    }
    return b;
}


/*!
 * This function is to get all the children CIs in case some CIs passed in the list are CIGroup.
 * 
 * @param ciList - the original ci list which might include some CIGroup CIs
 * @param actCiList - used to invoke the function recursively, not used for external call
 * @param groupList - used to avoid infinite recursive invoke, not used for external call
 * @return a SCDatum array which contains all the children CIs
 * 
 */
function getActualCiList(ciList, actCiList, groupList) {	
	if(actCiList == null)
	{
		actCiList = new SCDatum();
    	actCiList.setType( 8 ); 	
    }
	if(ciList == null || ciList.length == 0)    
	{
		return actCiList;
	}   
    if(groupList == null)
    {
		groupList = new SCDatum();
    	groupList.setType( 8 ); 
    }
    
    var device = new SCFile("device", SCFILE_READONLY);
    device.setFields(["device.type"]);
    var i, length = ciList.length();        
	for(i = 0; i < length; i++){	
		var ciName = ciList[i];
		var query = "logical.name=\"" + ciName + "\" or display.name=\""+ciName+"\"";
		if(device.doSelect(query) == RC_SUCCESS)
		{			
			if(device.device_type!="cigroup")
			{

				if(funcs.index(ciName, actCiList) == 0)
				{
					actCiList.push(ciName);								
				}
			}
			else
			{
				if(funcs.index(ciName, groupList) == 0)
				{
					groupList.push(ciName);
					var members = returnGroupMembers(ciName);
					if(members != null)
					{
						members = lib.ArrayUtil.toSCDatum(members); 
						actCiList = getActualCiList(members, actCiList, groupList);
					}					
				}			
								
			}				
		}								
	}
	return actCiList;	
}

function getAffectItemsList(file) {
	var cis = new SCDatum();
	cis.setType(8);

	var fileName = funcs.filename(file);
	if ((fileName == "incidents" || fileName == "probsummary") && file.logical_name) {
		cis.push(file.logical_name);
	}
	
	if (fileName == "cm3r") {
		if (file.assets && file.assets.length() > 0) {
			lib.ArrayUtil.addAllWithoutDuplicate(cis, file.assets);
		}
		 
		if (file.logical_name && (file.category == "Subscription" || file.category == "Unplanned Change")) {
			cis.push(file.logical_name);
		}
	}
	return getActualCiList(cis);
}







