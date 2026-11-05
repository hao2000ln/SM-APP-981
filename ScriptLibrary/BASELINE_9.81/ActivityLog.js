/**
  * Create activity log.
  *
  * @param {SCFile} file:		The record that activity log create for 
  * @param {SCFile} filesave: 
  * @param {String} actMode:	Mode of activity actions
  */
function createActivityLog(file, filesave, actMode)
{
    var rteNames = new SCDatum();
    rteNames.push("file");
    rteNames.push("second.file");
    rteNames.push("text");
    rteNames.push("boolean1");
	
    var rteValues = new SCDatum();
    rteValues.push(file);
    rteValues.push(filesave);
    rteValues.push(actMode);
    rteValues.push(false);

    // call rad "sc.activity" to create an activity log
    funcs.rtecall("callrad", new SCDatum(), "sc.activity", rteNames, rteValues, false);
}


/**
  * Create activity log for attachment, call from the triggers of SYSATTACHMENTS.
  *
  * @param {SCFile} attachment:		SYSATTACHMENTS SCFile, the attachment record that has been added/deleted.
  * @param {Number} triggerType:	Integer, the type of the trigger.
  */
function createAttachmentActivityLog(attachment, triggerType) {
	if (attachment.segment != 0) {
		return;
    }
    
	if (attachment.topic == null || attachment.topic == "") {
		return;
	}
		
	// only support "after add" & "after delete"
	if (triggerType != 2 && triggerType != 6) {
		return;
	}
	
	// backup application because it is changed unexpected in special scenario
	var applicationBak = attachment.application;
	
	var actType = "";
	if (triggerType == 2) {			// after add
		actType = "add";
	}
	else if (triggerType == 6)	{	// after delete
		actType = "delete";
	}
		
	var rteNames = new SCDatum();
	rteNames.push("file");
	rteNames.push("text");
	rteNames.push("boolean1");

	var rteValues = new SCDatum();
	rteValues.push(record);
	rteValues.push(actType);
	rteValues.push(false);

	// backup activity type, because it isn't set for attachment and rad "sc.activity" will cleanup it
	var activityBak = vars.$apm_activity;
	
	// call rad "sc.activity" to create an activity log
	funcs.rtecall("callrad", new SCDatum(), "sc.activity",	rteNames, rteValues, false);
	
	// restore activity type 
	vars.$apm_activity = activityBak;
	
	// restore application
	attachment.application = applicationBak;
}
