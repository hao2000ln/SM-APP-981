var toSCDateTimeString = lib.CalendarDao.toSCDateTimeString;
var getClientDateStr = lib.CalendarDao.getClientDateStr;
var getUniqueKeyField = lib.CalendarDao.getUniqueKeyField;
var evaluateCondition = lib.CalendarUtilities.evaluateCondition;
var processMappingCondition = lib.CalendarUtilities.processMappingCondition;
var timeperiodCalendarMappingRecord = null;
var keyField = null;
var changeTemplateName = "ChM Change Approval Approved_Timeperiod Conflict";
var JSON = system.library.JSON.json();
var log = getLog('timeperiodConflict');
var underscore = system.library.Underscore;
var _ = underscore.require();
var file_tpConflict = "timeperiodConflict";
var field_tpconflict = "tpconflict";
var freezeNogoTP = "conflictNogoTP"; 
var exceedGoTP = "overlapGoTP";
var missGoTP = "missedGoTP";

/**
 * if there has any timepeirod conflicts, it will insert timeperiod conflict result into timeperiodConflict table and set timeperiod conflict flag 
 *
 * @param {SCFile} record - entry record
 */
function calculateTPConflict(record){
    var overlap = {};
	handleTPConflicts(overlap, record);
	var overlapflag = getConflictType(overlap);
    record[field_tpconflict] = overlapflag; 
}

/**
 * This method is for manually recalculate the time period conflicts.
 * @Param {SCFile}  record - it the record to be calculated, currently it can be change only.
 */
function recalculateTimeperiodConflict(record) {
    var overlap = {};
	handleTPConflicts(overlap, record);
	var overlapFlag = getConflictType(overlap);
	
	var oldOverlapFlag = record[field_tpconflict];
	if(overlapFlag != oldOverlapFlag) {
	   	record[field_tpconflict] = overlapFlag;
	    record.doUpdate();
	}
}


/**
 * This method is to calcuate the time period conflicts and 
 * save/update/delete records in TimeperiodConflict table.
 * @Param {Object} overlap - to hold the overlap result
 * @Param {SCFile} record - the current record to be handled
 */
function handleTPConflicts(overlap, record) {
   var CalendarMapping = getTimeperiodCalendarMappingEntry(record);
   var start = getClientDateStr(record[CalendarMapping.fieldStartDate]);
   var end = getClientDateStr(record[CalendarMapping.fieldEndDate])
   var fEntry = {"start": start, "end": end};
    
    if(_.str.isBlank(fEntry["start"]) || _.str.isBlank(fEntry["end"])) {
		log.info("Start or end date is not found for time period confliction calculation.");
    	return;
    }
    var extraQuery = processMappingCondition(CalendarMapping.mappingCondition, record);
    lib.CalendarDao.getConflictTP(overlap, fEntry, extraQuery);
    var overlapflag = getConflictType(overlap);
    var tableName = system.functions.filename(record);
    var keyField = getKeyField(record);
	var entryId = record[keyField];
	var entryRecord = new SCFile(file_tpConflict);
	var entryQuery = "entryId=\"" + entryId +"\"";
	var findRecord = entryRecord.doSelect(entryQuery);
	if (overlapflag > 0 && findRecord != RC_SUCCESS)
	{
			var freezeTpId = overlap[freezeNogoTP];
			insertTimeperiodConflict(entryId, freezeNogoTP, tableName, freezeTpId);
			var exceedTpId = overlap[exceedGoTP];
			insertTimeperiodConflict(entryId, exceedGoTP, tableName, exceedTpId);
			var missgTpId = overlap[missGoTP];
			insertTimeperiodConflict(entryId, missGoTP, tableName, missgTpId);
	}
	while (findRecord == RC_SUCCESS){
		if (overlapflag > 0){
			if (entryRecord["tpType"] == freezeNogoTP ){
				entryRecord["tpId"] = overlap[freezeNogoTP];
			} else if (entryRecord["tpType"] == missGoTP){
				entryRecord["tpId"] = overlap[missGoTP];
			} else if (entryRecord["tpType"] == exceedGoTP){
				entryRecord["tpId"] = overlap[exceedGoTP];
			}
			entryRecord.doUpdate();
			findRecord = entryRecord.getNext();
		} else {
			entryRecord.doDelete();
			findRecord = entryRecord.getNext();
		}
	}		
}

/**
 * clear up conflict result in timeperiodConflict table
 * @param {String} id - entry id
 *
 */
function clearTimeperiodConflict(id){
	var tpRecord = new SCFile(file_tpConflict);
	var findRecord = tpRecord.doSelect( "entryId=\"" + id + "\"");
    while (findRecord == RC_SUCCESS){
        tpRecord.doDelete();
        record.tpconflict = 0;
        findRecord = tpRecord.getNext();
    }
}

/**
 insert conflict result into timeperiodConflict table
 *  @param {String} entryId - entry id
 *	@param {String} type - timeperiod conflict type
 *  @param {String} tableName - entry tableName
 *  @param {Array} tpId - timeperiod id
 */
function insertTimeperiodConflict(entryId, type, tableName, tpId){
	var tpRecord = new SCFile(file_tpConflict);
	var ret;
	tpRecord["entryId"] = entryId;
	tpRecord["tableName"] = tableName;
    tpRecord["tpType"] = type;
    tpRecord["tpId"] = tpId;
    system.functions.rtecall("trigger", ret, 0);
    tpRecord.doInsert();
    system.functions.rtecall("trigger", ret, 1);	
}

/**
 query timeperiod conflict type based on timeperiod conflicts record
 *  @param {Object} overlap- timeperiod conflict record
 *	@return {Number} - 1, 2, 3, 0
 *
 */
function getConflictType(overlap){
    if ( overlap[freezeNogoTP] != null && overlap.conflictNogoTP.length > 0)
    {
        return 1;
    } else if (overlap[missGoTP] != null && overlap.missedGoTP.length > 0){
        return 2;
    } else if (overlap[exceedGoTP] != null && overlap.overlapGoTP.length > 0){
        return 3; 
    } else {
	return 0;
	}
}


/**
 * get flag whether to calculate the timeperiod conflicts, if the flag is true, it will calculate timeperiod conflicts, otherwise, not calculate timeperiod conflicts
 * @param {SCFile} record - entry record
 * @param {SCFile} oldRecord - previous entry record
 * @return {boolean} - true, false
 */
function shouldCalculateTpConflict(record,oldRecord){
    var enableCalendar = vars['$G.system.info']['nativeCCM'] || false;
    if (enableCalendar == true){
    	var calendarMapping = getTimeperiodCalendarMappingEntry(record);
        var filterQuery = evaluateCondition(calendarMapping.calculateCondition, record) || false;
        if (filterQuery == true){
			var startField = calendarMapping["fieldStartDate"];
			var endField = calendarMapping["fieldEndDate"];
			var start = record[startField];
			var end = record[endField];
			var oldStart = oldRecord[startField];
			var oldEnd = oldRecord[endField];
			return (((_.str.isBlank(oldStart) || _.str.isBlank(oldEnd)) && !_.str.isBlank(start) && !_.str.isBlank(end))
					||(!_.str.isBlank(oldStart) && !_.str.isBlank(oldEnd) && !_.str.isBlank(start) && !_.str.isBlank(end) 
					&& (start.getTime() != oldStart.getTime() || end.getTime() != oldEnd.getTime())));
		}
	}	
	return false;
}


/**
*  whether it need to clean up existing timeperiod conflict records
*	
*   @param	 {SCFile}   record - entry record
*   @param	 {SCFile}   oldRecord - old entry record
*	@return	 {boolean} true/false
*/
function shouldCleanExistingTimeperiodConflict(record, oldRecord){
	var enableCalendar = vars['$G.system.info']['nativeCCM'] || false;
	var calendarMapping = getTimeperiodCalendarMappingEntry(record);
    var filterQuery = evaluateCondition(calendarMapping.calculateCondition, record) || false;
	var startField = calendarMapping["fieldStartDate"];
	var endField = calendarMapping["fieldEndDate"];
	var start = record[startField];
	var end = record[endField];
	var oldStart = oldRecord[startField];
	var oldEnd = oldRecord[endField];
	return (record[field_tpconflict]>0 &&(enableCalendar == false || filterQuery == false ||_.str.isBlank(start) || _.str.isBlank(end)));
	
}

//check the date whether is updated
function compareTimeperiodMappingDateFields(record, oldRecord){
	var calendarMapping = getTimeperiodCalendarMappingEntry(record);
	var startField = calendarMapping["fieldStartDate"];
	var endField = calendarMapping["fieldEndDate"];
	var start = record[startField];
	var end = record[endField];
	//special case for change copy in PD environment where the oldRecord can be null.
	var oldStart = (oldRecord == null?null:oldRecord[startField]);
	var oldEnd = (oldRecord == null?null:oldRecord[endField]);
	return isDatetimeDifferent(start, oldStart) || isDatetimeDifferent(end, oldEnd);
}

//Compare two date whether is different, if it is different then return true else return false
function isDatetimeDifferent(date1, date2) {
	if ((_.str.isBlank(date1) && !_.str.isBlank(date2)) || (!_.str.isBlank(date1) && _.str.isBlank(date2))){
		return true;
	} else if (!_.str.isBlank(date1) && !_.str.isBlank(date2) && date1.getTime() != date2.getTime()){
		return true;
	} else{
		return false;
	}
}

/**
*  get timeperiodCalendarMapping record
*	
*   @param	 {SCFile}   record - entry record
*	@return	 {SCFile}   record - timeperiodCaledarMapping
*/
function getTimeperiodCalendarMapping(record){
	var tableName = system.functions.filename(record);
    var calendarMapping = new SCFile("timeperiodCalendarMapping",SCFILE_READONLY);
	calendarMapping.setFields(["mappingCondition", "calculateCondition", "fieldStartDate", "fieldEndDate"]);
    var query = "tableName = \""+ tableName + "\" and active=true";
    var CalendarMappingRecord = calendarMapping.doSelect(query);
	if (CalendarMappingRecord != RC_SUCCESS){
		return null;
	}
	return calendarMapping;
}

/**
*  set value for timeperiodCalendarMapping record
*	
*   @param	 {SCFile}   record - entry record
*	@return	 {SCFile}   record - timeperiodCalendarMapping
*/
function getTimeperiodCalendarMappingEntry(record){
	if (timeperiodCalendarMappingRecord == null){
		timeperiodCalendarMappingRecord = getTimeperiodCalendarMapping(record);
	} else {
		var tableFile = system.functions.filename(record);
		var tableName = timeperiodCalendarMappingRecord["tableName"];
		if (tableName != tableFile){
			timeperiodCalendarMappingRecord = getTimeperiodCalendarMapping(record);
		}
	}
	return timeperiodCalendarMappingRecord;
}

/**
*  get unique key field
*	
*   @param	 {SCFile}   record - entry record
*	@return	 {String}   unique key field
*/
function getUniqueKey(record){
	var tableName = system.functions.filename(record);
   	var keyField = getUniqueKeyField(tableName);
	return keyField;
}

/**
*  set value for unique key field
*	
*   @param	 {SCFile}   record - entry record
*	@return	 {String}   unique key field
*/
function getKeyField(record){
	if (keyField == null){
		keyField = getUniqueKey(record);
	}
	return keyField;
}

//check whether to pop up warning message window pompt that there have conflicts with current change.
function disablePopupMessage() {
      return lib.settings.getSettingValue( "Timeperiod", "disablePopup") == "true";
}

/**
* This is to check if need to send notification to TP owner if
* the change gets approved while it conflicts with TP.
*
* It will only send notification for old style change categories such as Hardware, Network, Release Management
* For new introduced change categories such as Emergency, Normal, will send conflict notification through RuleSet.
*
* @Author yejia
* @Date   2014,Sept 22
* @Param {SCFile} record - process record
* @Param {SCFile} oldRecord - old record before saving
*/
function processTpConflictNotification(record, oldRecord) {
	if(record != null 
		&& oldRecord != null
		&& record["tpconflict"] == 1
		&& record["approval.status"] == "approved" 
		&& oldRecord["approval.status"] == "pending"
		&& (record["current.phase"] == "Change Approval" || record["current.phase"] == "Plan and Design")) {	
		var sendNotificationFlag = lib.timeperiodConflict.sendNotificationFlag();
		if(sendNotificationFlag) {
			lib.timeperiodConflict.sendEmailToTPOwner(record, "number");
		
		}
	}
}

/**
*  send email with HTML template to per timeperiod owner when the conflict change has been approved
*	
*   @param	 {SCFile}   record - entry record
*   @param	 {string}   entryId 
*/

function sendEmailToTPOwner(record, entryId){
	var timeperiodIds = getTimeperiodId(record[entryId]);
	for (var i = 0; i< timeperiodIds.length(); i++){
		var owner = getTimeperiodOwner(timeperiodIds[i]);
		if (owner != "" && owner != null){ 
			var mapEntry = {};
			mapEntry.entryId = record[entryId]; 
			mapEntry.timeperiodId = timeperiodIds[i];
			var recipient = getEmailAddress(owner);
			var subject = lib.htmlemailtemplates.getMailHeader(changeTemplateName, record, mapEntry,recipient, vars.$L_mailLang);
			var emailBody= lib.htmlemailtemplates.getMailBody(changeTemplateName, record, mapEntry,recipient, vars.$L_mailLang);
			var rc = sendEmail( recipient, subject, emailBody );
		}
	}
}

/**
*  get timeperiod id by searching entryId in timeperiodConflict table
*
*   @param	 {string}   entryId
*	@returns {Array}	timeperiodIds
*/
function getTimeperiodId(entryId){
	var timeperiodIds = [];
	var timeperiodConflict = new SCFile(file_tpConflict,SCFILE_READONLY);
	timeperiodConflict.setFields(["tpId"]);
	var query = "entryId = \""+ entryId +"\" and tpType =\"conflictNogoTP\"";
	if (timeperiodConflict.doSelect(query) == RC_SUCCESS){
		timeperiodIds = timeperiodConflict["tpId"];
	}
	return timeperiodIds;
}

// get the contact name of operator
function getContactName(operator){
	var operatorRecord = new SCFile("operator", SCFILE_READONLY);
	operatorRecord.setFields(["contact.name"]);
	var rc = operatorRecord.doSelect("name = \"" + operator + "\"");
	var contactName ="";
	if (rc == RC_SUCCESS){
	    contactName = operatorRecord["contact.name"];
	}
	return contactName;
}


//get the email address of recipient
function getEmailAddress(operator){
	var emailAddress = "";
	var contact = new SCFile("contacts",SCFILE_READONLY);
	contact.setFields(["email"]);
	var contactName = getContactName(operator);
	var rc = contact.doSelect("contact.name=\"" + contactName + "\"") ;
	if (rc == RC_SUCCESS){
		emailAddress = contact["email"];
	}
	return emailAddress;
}

/**
*  get time period owner
*
*   @param	 {string}   timeperiodId - the id of time period
*	@returns {String}	Owner - the owner of time period
*/

function getTimeperiodOwner(timeperiodId){
	var owner = "";
	var timeperiod = new SCFile("timeperiodDefinition", SCFILE_READONLY);
	timeperiod.setFields(["owner"]);
	var query = "id = \""+ timeperiodId +"\"";
	if (timeperiod.doSelect(query) == RC_SUCCESS){
		owner = timeperiod["owner"];
		}	
	return owner;
}

/**
*   get flag to decide whether send notification or not when conflict change has been approved. if flag is true, it will send notification.
*
*	@returns {boolean}	flag - true/false
*/

function sendNotificationFlag() {
    return lib.settings.getSettingValue( "Timeperiod", "sendNotification") == "true";   
}

/**
*  get flag to listener the mapping fields if they are updated when opening a task
*
*   @param	 {SCFile}   record - entry record
*	@returns {boolean}	true/false 
*/
function isTaskWithTimeperiodCalculation(record){
	var calendarMapping = getTimeperiodCalendarMappingEntry(record);
	var startField = calendarMapping["fieldStartDate"];
	var endField = calendarMapping["fieldEndDate"];
	return (!_.str.isBlank(record[startField]) && !_.str.isBlank(record[endField]));
}
/**
*  send email to per recipient
*
*   @param	 {String}   recipient - the recipient of the email
*	@param	 {String}   subject - the subject of the email
*	@param	 {String}   emailBody -  the email body
*/

function sendEmail( recipient, subject, emailBody ) {
	var email = new SCFile("mail");

	email["user.to"] = recipient;
	email["user.from"] = system.functions.operator();
	email["date.to.send"] = system.functions.tod();
	email["status"] = "sent";
	email["subject"] = subject;
	email["application"] = "email";
	email["text"].push(emailBody);
	email["user.array"][0] = recipient;

	var paramNames = new SCDatum();
	var paramValues = new SCDatum();

	paramNames.push("record");
	paramValues.push(email);

	var rteReturnValue = "";
	var rc = system.functions.rtecall("callrad",
										rteReturnValue,
										"axces.email", //RAD app name
										paramNames,
										paramValues,
										false); //false to run in same thread, true to run in new thread

	return rc;

}


/**
 * To check if existing conflicts on the time period
 * @param   {tpId} timeperiod ID to check
 * @returns {boolean} true/false
 */
function existingConflictsOnTP(tpId) {
	var existingConflicts = new SCFile(file_tpConflict, SCFILE_READONLY);
	var query = "tpId=\"" + tpId + "\"";
	
	var rc = existingConflicts.doSelect(query);
	if(rc == RC_SUCCESS) {
		var result = existingConflicts["entryId"];
		if(!_.str.isBlank(result)) {
			return true;
		}		
	}
	return false;
}
