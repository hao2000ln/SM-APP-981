
/**
*   is out of office
*
*   @param {entry} - SCFile
*	@return - true/false
*   @type - Boolean - true/false
**/
function isOutOfOffice(entry) {
	var assignment = entry['assignment'];
	
	if(!assignment){
		return false;
	}
	if((typeof assignment)!="string"){
		assignment = assignment[0];
	}
	
	var fAssignment = new SCFile("assignment", SCFILE_READONLY);
	fAssignment.setFields(['name', 'time.zone']);
	var query="name=\""+assignment+"\"";
	
	var rc = fAssignment.doSelect(query);
	var timeZone = null;
	var workSch = null;
	if (rc == RC_SUCCESS) {
		timeZone = fAssignment['time.zone'];
		workSch = fAssignment['calendar.name'];
	}

	if (workSch) {
		return !(lib.AssignmentUtil.assignmentGroupIsAvailable(workSch, timeZone));
	}
	
	return false;
}