/**
	This function is called from the cm3profile to build the correct list of approval 
	groups based on the operator name provided. It also passes the area, but as the
	main reason is a "like for like" approval group-to-operator functionality this is
	currently not used.
	
		@param {operator} 	operator		- an operator name
		@param {area} 		area	  		- the change area [a, c, t]
		
		Output: an array of approval groups
**/

function getApprovalGroups(operator, area)
{
	var fOperator = new SCFile( "operator" );
	
	if (fOperator.doSelect( "name = \"" + operator + "\"" ) == RC_SUCCESS )
	{
		return fOperator.approvalGroups;
	}
}

/**
	This function is called from the cm3profile to build the correct list of review 
	groups based on the operator name provided. It also passes the area, but as the
	main reason is a "like for like" approval group-to-operator functionality this is
	currently not used.
	
	@param {operator} 	operator		- an operator name
	@param {area} 		area	  		- the change area [a, c, t]
	
	Output: an array of review groups
**/

function getReviewGroups(operator, area)
{
	var fOperator = new SCFile( "operator" );
	
	if (fOperator.doSelect( "name = \"" + operator + "\"" ) == RC_SUCCESS )
	{
		return fOperator.reviewGroups;
	}
}

/**
	This function is called from the rebuild.group process and rebuilds the provided
	cm3groups record based on the operators (from the oprerator file) that have
	this group in their profile (as approvalGroups entry).
	
	@param {fFile} 		record		- a cm3groups record
	
	Output: None. Updates record provided directly.
**/

function getApprovingOperators(fFile)
{
	var fOperator = new SCFile( "operator" );
	var iIdx = 0;
	sql = "approvalGroups = \"" + fFile.name +"\"";
	
	var rc = fOperator.doSelect( sql );
	
	while (rc == RC_SUCCESS)
	{
		fFile.approvers[iIdx] = fOperator.name;
		iIdx = system.functions.lng(fFile.approvers);
		rc = fOperator.getNext();
	}
}

/**
	This function is called from the rebuild.group process and rebuilds the provided
	cm3groups record based on the operators (from the oprerator file) that have
	this group in their profile (as reviewGroups entry).
	
	@param {fFile} 		record		- a cm3groups record
	
	Output: None. Updates record provided directly.
**/

function getMemberOperators(fFile)
{
	var fOperator = new SCFile( "operator" );
	var iIdx = 0;
	sql = "reviewGroups = \"" + fFile.name +"\"";
	
	var rc = fOperator.doSelect( sql );
	
	while (rc == RC_SUCCESS)
	{
		fFile.members[iIdx] = fOperator.name;
		iIdx = system.functions.lng(fFile.members);
		rc = fOperator.getNext();
	}
}

/**
	This function is called from the operator triggers to rebuild the cm3groups file
	for the specific operator after it has been added, updated or removed.
		
	@param {operator} 		operator		- an operator name
	@param {action} 		action	  		- the database action [add, update, delete]
	@param {type} 			type			- the type of group [review, approval]
	@param {currentGroups} 	groups			- the list of current (assigned) groups
	@param {oldGroups} 		groups			- the list of previous (assigned) groups
		
	This function has no output.
**/

function cm3groupsRebuild(operator, action, type, currentGroups, oldGroups)
{
	var addGroups = new SCDatum();
	var delGroups = new SCDatum();
	
	if (action == "add")
		addGroups = currentGroups;
		
	if (action == "update")
	{
		addGroups = arrayDiff(oldGroups, currentGroups);
		delGroups = arrayDiff(currentGroups, oldGroups);
	}
	
	if (action == "delete")
		delGroups = oldGroups;
		
	if (system.functions.lng(addGroups) > 0)
	{
		var fcm3groups = new SCFile( "cm3groups" );
		sql = "name isin " + addGroups.getText();
		rc = fcm3groups.doSelect( sql );
		
		while (rc == RC_SUCCESS)
		{
			if (type == "review")
				fcm3groups.members.push(operator);
			if (type == "approval")
				fcm3groups.approvers.push(operator);
			
			fcm3groups.doUpdate();
			rc = fcm3groups.getNext();
		}
	}
	
	if (system.functions.lng(delGroups) > 0)
	{
		var fcm3groups = new SCFile( "cm3groups" );
		sql = "name isin " + delGroups.getText();
		rc = fcm3groups.doSelect( sql );
		
		while (rc == RC_SUCCESS)
		{
			if (type == "review")
			{
				iIndex = system.functions.index(operator, fcm3groups.members);
				if (iIndex > 0)
				{
					fcm3groups.members = system.functions._delete(fcm3groups.members, iIndex, 1);
				}
			}
			if (type == "approval")
			{
				iIndex = system.functions.index(operator, fcm3groups.approvers);
				if (iIndex > 0)
				{
					fcm3groups.approvers = system.functions._delete(fcm3groups.approvers ,iIndex, 1);
				}
			}
			
			fcm3groups.doUpdate();
			rc = fcm3groups.getNext();
		}
	}
}

/**
	This function compares two arrays and returns the values that exist in list2
	and not exist in list1.
	
	@param {list1} 			array		- an array of values
	@param {list2} 			array	  	- an array of values
	
	Output: an array of values
**/

function arrayDiff(list1, list2)
{
	var delta = new SCDatum();

	if (list1 == null || list2 == null)
	{
		return delta;
	}
	
	for (iLst = 0; iLst < list2.length(); iLst++)
	{
		if (system.functions.index(list2[iLst], list1) == 0 )
			delta.push(list2[iLst]);
	}

	return delta;
}

/**
	This function gets the available phase names for the Workflow used by a specific category
	
	@param {category} 			Record		- the current category record
	
	Output: an array of phases
**/
function getPhaseValues( category )
{
	var phases = new Array();
	var wf = new SCFile("WorkflowPhase");
	var type = "cm3r";
	if ( system.functions.filename( category ) == "cm3tcategory" )
	{
		type = "cm3t";
	}
	var sql = "workflowName =\""+ category.workflow +"\" and tableName=\""+type+"\"";
	if ( wf.doSelect(sql) == RC_SUCCESS )
	{
		do
		{
			phases.push( wf.phaseName );
		}
		while ( wf.getNext() == RC_SUCCESS )
	}
	return phases;
}

/**
	This function gets the available phase names for the Workflow used by a specific category
	
	@param {category} 			Record		- the current category record
	
	Output: an array of phases
**/

function getNewCatPhase( category, currentPhase )
{
	var wf = new SCFile("WorkflowPhase");
	var type = "cm3r";
	if ( system.functions.filename( category ) == "cm3tcategory" )
	{
		type = "cm3t";
	}
	/*var sql = "workflowName =\""+ category.workflow +"\" and tableName=\""+type+"\" and phaseName=\""+currentPhase+"\"";
	if ( wf.doSelect(sql) == RC_SUCCESS )
	{
		//return currentPhase
	}
	*/
	
	var workflow = new SCFile("Workflow");
	sql = "name =\""+ category.workflow +"\" and tableName=\""+type+"\"";
	if ( workflow.doSelect( sql ) == RC_SUCCESS )
	{
		return workflow.firstPhase;
	}
	
	return currentPhase;
}

function getInactivePhases( category, type )
{
	var phases = new Array();
	var wf = new SCFile("WorkflowPhase");
	var type = "cm3r";
	if ( system.functions.filename( category ) == "cm3tcategory" )
	{
		type = "cm3t";
	}
	var sql = "workflowName =\""+ category.workflow +"\" and tableName=\""+type+"\" and active=false";
	if ( wf.doSelect(sql) == RC_SUCCESS )
	{
		do
		{
			phases.push( wf.phaseName );
		}
		while (wf.getNext() == RC_SUCCESS )
	}
	return phases;
}