

// This function checks for profile to see if user has profile for a given module
// If he has, add it to the delegation module list
//The sample provided here is for problem module
function checkProfileForModule(fileName, operator)
{
}

//This function returns all approval groups for custom approval module that current user has in his/her profile
//example is for problem management module
function getCustomApprovalGroups(module, operator)
{

}

//This function is called by approval inbox application to append custom approval query to OOB approval query
//Note: following the sytax in the sample file, including make sure to have a space before the or
function appendCustomApprovalSql()
{
	
	//following example shows how to append problem approval to approval inbox
}


function getCustomDelegationGroups()
{			
	//find id there is a delegate all 
	var allDele = new Array();
	var partDele = new Array();
	var delegationList = lib.ApprovalDelegationGroups.getDelegation();
	for(var i=0;i<delegationList.length;++i)
	{
		if(delegationList[i].module == "all")
			allDele.push(delegationList[i]);
	}	
	
	var allCustomGroups = new Array();
	var partCustomGroups = new Array();
	
	for(var i=0;i<allDele.length;++i)
	{
		var svcs = getAllCustomGroups(allDele[i]);
		
		for(var j=0;j<svcs.length;++j)
		{
			if(lib.ApprovalDelegationGroups.arrayIndexOf(allCustomGroups,svcs[j])<0)
				allCustomGroups.push(svcs[j]);
		}		
	}
	
	partCustomGroups = getDelegatedCustomGroups();		
	
	
	 return buildCustomSql(allCustomGroups,partCustomGroups);		
}

function getAllCustomGroups(aDele)
{	
	var approver = aDele.approver;

	var user = lib.ApprovalDelegationGroups.getApprover(approver);

	//MODIFY:
	//Modify follwoing line, to use correct profile for the module
	//
	var profileName = user.profile_rootcause;
	
	if (profileName == null || profileName.length == 0)
	{				
		return "";
	}
	
	//get all of his change profile
	var profileSql = "name=\""+profileName+"\"";
	
	//MODIFY:
	//Modify follwoing line, to use correct profile table name for the module
	//
	var profiles = new SCFile("rcenv");
	var rc = profiles.doSelect(profileSql);
	
	//go through and return change/task query
	var customGroups = new Array();
	
	//MODIFY:
	//Modify follwoing line ONLY IF approval groups is not defined in approval.groups field on profile record
	//
	var approvalGroups = profiles.approval_groups;
	for (var i=0;i<approvalGroups.length();++i)
	{
		customGroups.push(approvalGroups[i]);
	}
	customGroups.push(approver);
	return customGroups;
}	

function getDelegatedCustomGroups()
{
	var delegationList = lib.ApprovalDelegationGroups.getDelegation();
	//find id there is a delegate all 
	var groupList =  new Array();
	for(var i=0;i<delegationList.length;++i)
	{
		//MODIFY:
		//Modify follwoing line, to use correct module name
		//This is the module name defined in checkProfileForModule
		//e.g. system.vars.$avail_approval_modules_value=system.functions.insert(system.vars.$avail_approval_modules_value, 1, 1, "Problem");	
		//
		if(delegationList[i].module == "Problem")
			groupList.push(delegationList[i].group);
	}
	
	return groupList;	
}

function buildCustomSql(allCustomGroups,partCustomGroups)	
{		
	for(var j=0;j<partCustomGroups.length;++j)
	{
		if(lib.ApprovalDelegationGroups.arrayIndexOf(allCustomGroups,partCustomGroups[j])<0)
			allCustomGroups.push(partCustomGroups[j]);
	}
			
	//MODIFY:
	//Modify follwoing line with the correct file.name
	//
	var moreCustomSql = "file.name=\"rootcause\" and current.pending.groups isin {";
	for (var i=0; i<allCustomGroups.length;++i)
	{
		moreCustomSql += "\"" +allCustomGroups[i]+"\"";	
		if (i<allCustomGroups.length-1)
			moreCustomSql+=","	
	}

	moreCustomSql += "} ";
	
	var returnSql = ""; 			
	if(allCustomGroups.length > 0)
		returnSql +=  " or ("+moreCustomSql+")";	
			
	return returnSql; 
}