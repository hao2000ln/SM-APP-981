function setSpecificFields(record, filename, activityType, custVisible) {
	var name = filename;
	var message;
	
	if (activityType == "Problem Workaround")
		message = "Problem Updated";
	if (activityType == "Problem Closure")
		message = "Problem Closed";
	if (activityType == "Problem Cancellation")
		message = "Problem Cancelled";
	
	// QCCR1E97587, updated by Xiongjie MA, the Workflow is driven by problem.status since PD4, so this field should not be updated in this scenario.
	
	record.cust_visible = false;
    custVisible = custVisible === undefined ? true : custVisible;
    if (name == "incidents" && activityType == "Incident Update")
        record.cust_visible = custVisible;

    if (name == "incidents" && activityType == "Change Update")
        record.cust_visible = custVisible;

    if (name == "incidents" && activityType == "Request Update")
        record.cust_visible = custVisible;

    if (name == "incidents" && activityType == "Problem Update")
        record.cust_visible = custVisible;
    
    if (name == "request" && activityType == "RequestTask Update")
        record.cust_visible = custVisible;
 
    return;
}