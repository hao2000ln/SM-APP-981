/**
* @fileoverview  Handles functionality associated with timeperiod Rules.
* @author Jan Steube
*/

var log = getLog("timeperiodRules");

/**
*  This function calculates values to be saved in the timeperiodRule entry
*
*  	History:
*	2012-12-05, Jan Steube - function created
*  @param 	{record} 	fRecord 	- the current record
*  @example Called by: Process timeperiodRule.save, timeperiodRule.add
*	
*/
function saveTimePeriodRule(fRecord) {
	
	if (fRecord.valid_type == "never") {
		fRecord.valid_to = null;
		fRecord.valid_count=null;
	} else if (fRecord.valid_type == "occurence") {
		fRecord.valid_to = null;
	} else if (fRecord.valid_type == "date") {
		fRecord.valid_count=null;
	} // if valid type
	
	if (fRecord.arbitrary==false) {
		fRecord.arbitrary_start_time = null;
		fRecord.arbitrary_end_time = null;
		if (fRecord.end_type == "same") {
			fRecord.end_days = null;
		} // if end type
		
	} // not arbitrary

	if ((!fRecord.type == "month") && (!fRecord.type == "year")) {
		vars.$tp_monthdayrule =  null;
		vars.$tp_dayofmonth = null;
		vars.$tp_monthweekdays = null;
	}
	
	if (fRecord.arbitrary==true) {
		fRecord.occurrence = null;
		fRecord.day = null;
		fRecord.weekdays = null;
		fRecord.month = null;
		fRecord.start_time = null;
		fRecord.end_time = null;
		fRecord.end_days = null;
		fRecord.valid_from = null;
		fRecord.valid_to = null;
		fRecord.valid_count=null;
		fRecord.end_type = "same";
		fRecord.type	= null;
	} else if (fRecord.type == "day") {
		fRecord.day = null;
		fRecord.weekdays = null;
		fRecord.month = null;
	} else if (fRecord.type == "week") {
		fRecord.day = null;
		fRecord.month = null;
		var iWeekDays = 0;
		var i;
		for (i = 0; i < 7; i++) {
			iWeekDays |= eval(funcs.nullsub(vars["$tp.weekday." + i], false)) << i; // keep the first eval as it is not easy to have parse a string to boolean
		} // for weekdays
		fRecord.weekdays = iWeekDays;
	} else if (fRecord.type == "month") {
		fRecord.month = null;
		if (fRecord.month_type == "regular") {
			fRecord.day = funcs.val(vars.$tp_dayofmonth, 1);
			vars.$tp_monthdayrule =  null;
			vars.$tp_monthweekdays = null;
			fRecord.weekdays = null;
		} else if (fRecord.month_type == "irregular") {
			fRecord.day = funcs.val(vars.$tp_monthdayrule, 1);
			fRecord.weekdays = funcs.val(vars.$tp_monthweekdays, 1);
			vars.$tp_dayofmonth = null;
		} // if regular
	} else if (fRecord.type == "year") {
		if (fRecord.year_type == "regular") {
			fRecord.day = funcs.val(vars.$tp_dayofmonth, 1);
			vars.$tp_monthdayrule =  null;
			vars.$tp_monthweekdays = null;
			fRecord.weekdays = null;
		} else if (fRecord.year_type == "irregular") {
			fRecord.day = funcs.val(vars.$tp_monthdayrule, 1);
			fRecord.weekdays = funcs.val(vars.$tp_monthweekdays, 1);
			vars.$tp_dayofmonth = null;	
		} // if regular
	} // if type

	if (fRecord.arbitrary==true) {
		fRecord.icalendar_rule = "";
		return;
	}
	
	// if not arbitrary create the iCalendar rule and save in the database (for usage in other calcs...)
	fRecord.icalendar_rule = iCalRule(fRecord);
}


/**
*  This function calculates the initial values to be displayed for the timeperiodRule entry
*
*  	History:
*	2012-12-05, Jan Steube - function created
*
*  @param 	{record} 	fRecord 	- the current record
*
*  @example Called by: Process timeperiodRule.view.init
*	
*/
function initTimePeriodRule(fRecord) {
	
	//nullsub some values
	if (fRecord.active==null)     { fRecord.active 		= true; }
	if (fRecord.arbitrary==null)  {	fRecord.arbitrary 	= false; }
	if (fRecord.locked==null) 	  {	fRecord.locked 		= false; }
	if (fRecord.end_type==null)   {	fRecord.end_type 	= "same"; }
	if (fRecord.valid_type==null) {	fRecord.valid_type 	= "date"; }
	if (fRecord.month_type==null) {	fRecord.month_type 	= "regular"; }
	if (fRecord.year_type==null)  {	fRecord.year_type 	= "regular"; }
	if (fRecord.type==null && fRecord.arbitrary==false)			
								  {	fRecord.type 		= "day"; }
	if (fRecord.timezone==null)	  {	fRecord.timezone 	= vars.$lo_time_zone; }
	
	//cleanup variables
	vars.$tp_monthdayrule 	= null;
	vars.$tp_monthweekdays 	= null;
	vars.$tp_dayofmonth		= null;
	vars.$tp_arb_start		= null;
	vars.$tp_arb_end		= null;
	
	var i;
	for (i = 0; i < 7; i++) {
		vars["$tp.weekday." + i] = false;
	} // for weekdays
	
	if (fRecord.type) {
		if (fRecord.arbitrary==false) {
			if (fRecord.type == "week") {
				var iWeekdays = fRecord.weekdays;
				for (i = 0; i < 7; i++) {
					var bDay = Boolean(iWeekdays & 1);
					vars["$tp.weekday." + i] = bDay;
					iWeekdays >>>= 1;
				} // for weekdays
			} else if (fRecord.type == "month") {
				if (fRecord.day) {
					if (fRecord.weekdays) {
						vars.$tp_monthdayrule =  fRecord.day;
						vars.$tp_monthweekdays = fRecord.weekdays;
						vars.$tp_dayofmonth = "";
					} else {
						vars.$tp_dayofmonth = fRecord.day;
						vars.$tp_monthdayrule = "";
						vars.$tp_monthweekdays = "";
					} // if weekdays
				} // if day
			} else if (fRecord.type == "year") {
				if ((fRecord.day) && (fRecord.month)) {
					if (fRecord.weekdays) {
						vars.$tp_monthdayrule =  fRecord.day;
						vars.$tp_monthweekdays = fRecord.weekdays;
						vars.$tp_dayofmonth = "";
					} else {
						vars.$tp_dayofmonth = fRecord.day;
						vars.$tp_monthdayrule = "";
						vars.$tp_monthweekdays = "";
					} // if weekdays
				} // if day / month
			} // if type
		} // if not arbitrary
	} // if type exists
}


/**
*  This function calculates the rule according to the iCalendar standard RRULE
*
*  	History:
*	2012-12-05, Jan Steube - function created
*
*  @param 	{record} 	fRecord 	- the current record
*  @returns {string}  	sRule 		- the iCal Rule
*	
*/
function iCalRule(fRecord) {

	// Calculate iCal Rule
	var sRule="RRULE:";
	fRecord.type == "day" 	? sRule += "FREQ=DAILY;" 	: "" ;
	fRecord.type == "week" 	? sRule += "FREQ=WEEKLY;" 	: "" ;
	fRecord.type == "month" ? sRule += "FREQ=MONTHLY;" 	: "" ;
	fRecord.type == "year" 	? sRule += "FREQ=YEARLY;" 	: "" ;
	
	if(fRecord.valid_to) {
		//put UNTIL in recurrence pattern only when VALID_TO date is within the global settings
		//otherwise handle it similar as never expires.
		var iFutureMonths = lib.timeperiodOccurrence.getMaxFutureMonth();
		if (iFutureMonths == null || iFutureMonths=="") {
		    iFutureMonths = 12;
		}
		// get end date as of now
		var dDate = new XMLDate(new Date());
		dDate.addDuration("P" + iFutureMonths + "M");
		if (formatXMLDate(dDate.getDate())>=formatXMLDate(fRecord.valid_to)) {
			// end date from the Rule
			sRule += "UNTIL=" + formatXMLDate(fRecord.valid_to) + ";"
		}
	}
	else if(fRecord.valid_count){
		// end after x occurrences 
		sRule += "COUNT=" + fRecord.valid_count + ";";
	}	
	
	// handle the recurrences
	fRecord.occurrence ?  sRule += "INTERVAL=" + fRecord.occurrence + ";" : "" ;
	
	var sWeekday = "";
	var aDays = ["SU","MO", "TU", "WE", "TH", "FR", "SA", "DAY"];
	if (fRecord.weekdays) {
		var sDays = "";
		var iWeekdays = fRecord.weekdays;
		var i;
		for (i = 0; i < 8; i++) {
			Boolean(iWeekdays & 1) ? (sDays ?  sDays += "," + aDays[i] : sDays += aDays[i]) : "" ; 
			iWeekdays >>>= 1;
		} // for weekdays
		if (fRecord.type == "week") {
			sDays ? sRule += "BYDAY=" + sDays + ";" : "" ;
		} else if (sDays) {
			sWeekday = sDays;
		}
	}
	if ((fRecord.type == "month") || (fRecord.type == "year")) {
		if (!fRecord.weekdays) {
			fRecord.day ?  sRule += "BYMONTHDAY=" + fRecord.day + ";" : "" ;
			// last day of the month
		}	// special case last day of the month
		else if (sWeekday=="DAY") {
			fRecord.day == -1 ? sRule += "BYMONTHDAY=1;" : "" ;
			fRecord.day == -2 ? sRule += "BYMONTHDAY=2;" : "" ;
			fRecord.day == -3 ? sRule += "BYMONTHDAY=3;" : "" ;
			fRecord.day == -4 ? sRule += "BYMONTHDAY=4;" : "" ;
			fRecord.day == -5 ? sRule += "BYMONTHDAY=-1;" + sWeekday + ";" : "" ;
		} else {
			fRecord.day == -1 ? sRule += "BYDAY=1" + sWeekday + ";" : "" ;
			fRecord.day == -2 ? sRule += "BYDAY=2" + sWeekday + ";" : "" ;
			fRecord.day == -3 ? sRule += "BYDAY=3" + sWeekday + ";" : "" ;
			fRecord.day == -4 ? sRule += "BYDAY=4" + sWeekday + ";" : "" ;
			fRecord.day == -5 ? sRule += "BYDAY=-1" + sWeekday + ";" : "" ;
		}
	} 
	if (fRecord.type == "year") {
		fRecord.month ?  sRule += "BYMONTH=" + fRecord.month + ";" : "" ;
	}
	
	//get start day of the week
	var sStartDayNumber	= lib.settings.getSettingValue( "Calendar", "startDayOfWeek" );
	var iStartDayNumber	= 1; //Monday
	
	if (sStartDayNumber != null || sStartDayNumber !="") {
		iStartDayNumber = funcs.val(sStartDayNumber,1);
	}
	
	var sStartDayText = aDays[iStartDayNumber];
	sRule += "WKST=" + sStartDayText + ";";
	
	return sRule;
}


/**
*  This function returns a ICal compatible date string
*
*  	History:
*	2012-12-05, Jan Steube - function created
*
*  @param 	{Date} 		dDate 	- the Date
*  @returns {String}  	sDate 	- the iCal Rule Date
*	
*/
function formatXMLDate(dDate) {

	var sDate = "";
	sDate += dDate.getFullYear();
	sDate += ("0" + (dDate.getMonth()+1)).slice (-2);
	sDate += ("0" + dDate.getDate()).slice (-2);
	sDate += "T";
	sDate += ("0" + dDate.getHours()).slice (-2);
	sDate += ("0" + dDate.getMinutes()).slice (-2);
	sDate += ("0" + dDate.getSeconds()).slice (-2);
	sDate += "Z";

	return sDate;
}


/**
*  This function checks if all the start dates are before the end dates
*
*  	History:
*	2012-12-14, Jan Steube - function created
*
*  @param 	{Date} 		dStartDate 	- the Date
*  @param 	{Date} 		dEndDate 	- the Date
*  @returns {Boolean}  	bTrue 		- False if there are dates which are not correctly sinced
*	
*/
function validateArbitraryDates(dStartDate, dEndDate) {

	var msg = funcs.scmsg("timeperiodRule_8", "fc");
	
	if ((!dStartDate) || (!dEndDate)) {
		print(msg);
		return false;
	}
	
	if (dStartDate >= dEndDate) {
		print(msg);
		return false;
	}
	
	if (dStartDate <= funcs.tod()) {
		print(msg);
		return false;
	}
	
	return true;
}

/**
*  This function locks the rules associated with a Time period once the TP was approved
*
*  	History:
*	2012-12-14, Jan Steube - function created
*
*  @param 	{string} 	sDefinitonId - the id of the time period definition
*	
*/
function lockRules(sDefinitionId)
{
 	var fTimePeriodRule = new SCFile( "timeperiodRule");
	var sQuery = "definition.id=\"" + sDefinitionId + "\" and active=true and locked=false";
	var rc = fTimePeriodRule.doSelect( sQuery );
    if( rc == RC_SUCCESS ) {
		rc = fTimePeriodRule.getFirst();
		while (getLastRC() == RC_SUCCESS) { 
            fTimePeriodRule.locked=true;
           	
           	//deactivate RULE triggers, to avoid having the occurrences recreated, when record gets locked
           	var ret;	
			funcs.rtecall("trigger", ret, 0);			
			fTimePeriodRule.doSave();		
			funcs.rtecall("trigger", ret, 1);		
            var rcNext = fTimePeriodRule.getNext();
        } // while records
    }
}

/**
*  This function activates / or deactivates the rules associated with a Time period (called by trigger)
*
*  	History:
*	2012-12-14, Jan Steube - function created
*
*  @param 	{string} 	sDefinitonId - the id of the time period definition
*	
*/
function deActivateRules(sDefinitionId, flag)
{
 	var fTimePeriodRule = new SCFile( "timeperiodRule");
	var sQuery = "definition.id=\"" + sDefinitionId + "\"";
	var rc = fTimePeriodRule.doSelect( sQuery );
    if( rc == RC_SUCCESS ) {
		rc = fTimePeriodRule.getFirst();
		while (getLastRC() == RC_SUCCESS) { 
            fTimePeriodRule.active=flag;
           	
           	//deactivate RULE triggers, to avoid having the occurrences recreated, when record gets locked
           	var ret;	
			funcs.rtecall("trigger", ret, 0);			
			fTimePeriodRule.doSave();		
			funcs.rtecall("trigger", ret, 1);		
            var rcNext = fTimePeriodRule.getNext();
        } // while records
    }
}

/**
*  This function checks wheter the rule can be edited or not. Its sets several variables to true and false.
* these variables are used in the init processes to set the screen to readonly
*
*  	History:
*	2012-12-14, Jan Steube - function created
*
*  @param 	{record} 	the RULE
*	
*/
function getEditRights(record)
{
	var bRecordLocked 	= funcs.nullsub(record.locked, false);
	var bLockSetting	= funcs.nullsub(funcs.val(lib.settings.getSettingValue( "Timeperiod", "lockRules"),4),false);
	var bEdit			= vars.$tp_edit_rule;  //$tp_edit_rule is initialised in process: timeperiodDefinition.htmllink
	var bReadonly		= vars.$tp_displayRule_readonly; //$tp_displayRule_readonly is initialised in process: timeperiodDefinition.htmllink 
	var bEnable			= vars.$tp_enable_flag; // display the activate / deactivate button
	var bDelete			= vars.$tp_delete_flag; // display the delete button
	
	// new record is added ensure full edit rights
	if (record.sysmodtime==null) {
		bReadonly 	= false;
		bEnable		= false;
		bDelete		= true;
	} else {
		if (bLockSetting==true) {
			// is lock enabled in time period settings
			if (bRecordLocked==true) {
				// record is locked therefore display form in readonly
				bReadonly = true;
				bEnable	= true;
				bDelete	= false;
			} 
		
			if (bRecordLocked==false) {
				// record is not locked (not in publish phase so far) check if user has update rights
				if (bEdit==true) {bReadonly = false;bDelete=true; bEnable=false}
				if (bEdit==false) {bReadonly = true;bDelete=false; bEnable=false}
			}
		} else {
			// lock in time period settings is not set, check if user has update rights 
			// to allow edit rights
			if (bEdit==true) {bReadonly = false;bDelete=true; bEnable=false}
			if (bEdit==false) {bReadonly = true;bDelete=false; bEnable=false}
		}
	}
	
	vars.$tp_displayRule_readonly 	= bReadonly;
	vars.$tp_enable_flag			= bEnable;
	vars.$tp_delete_flag			= bDelete;
	
	return;
}
