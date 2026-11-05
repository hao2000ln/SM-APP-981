/**
* @fileoverview  Handles functionality associated with timeperiod Occurences.
* @author Jan Steube
*/

var log = getLog("timeperiodOccurrences");

/**
*  This function edits the occurences for a timeperiodDefinition
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{String}   sAction - the action
*  @param 	{String}   sQuery - the occurrence query
*
*  @example Called by: Process timeperiodDefinition.editOccurrence
*/
function editOccurrence(sAction, sQuery) {
	
	var fTimePeriodOccurrence = new SCFile( "timeperiodOccurrence");
	var rc = fTimePeriodOccurrence.doSelect( sQuery );
	if( rc == RC_SUCCESS ) 	{
		if (sAction == "activeflag") {
			fTimePeriodOccurrence.active 		= !fTimePeriodOccurrence.active;
			fTimePeriodOccurrence.keep_active	=  fTimePeriodOccurrence.active;
			
		} else if (sAction == "keepactive") {
			fTimePeriodOccurrence.keep_active = !fTimePeriodOccurrence.keep_active;
		}
		rc = fTimePeriodOccurrence.doSave();
	} // if found
}

/**
*  This function returns the details of the occurrence in a string
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{String}   sQuery - the occurrence query
*  @return	{String}	Comma separated string with details of occurrence
*
*  @example Called by: Process timeperiodDefinition.editOccurrence
*/
function getOccurrenceDetails(sQuery) {
	
	var fTimePeriodOccurrence = new SCFile( "timeperiodOccurrence", SCFILE_READONLY);
	fTimePeriodOccurrence.setFields(['definition.id', 'rule.id', 'start.date', 'end.date', 'active','keep.active']);
	var rc = fTimePeriodOccurrence.doSelect( sQuery);
	
	var string = "";
	
	if (rc==RC_SUCCESS) {
	
		var display1;
		var display2;
        if (fTimePeriodOccurrence.active == true) {
        	display1=funcs.scmsg("11", "timeperiod");
        	display2=funcs.scmsg("12", "timeperiod");
        }
        
       if (fTimePeriodOccurrence.active == false) {
        	display1=funcs.scmsg("12", "timeperiod");
        	display2=funcs.scmsg("11", "timeperiod");
        }
	
		string =funcs.scmsg(17, "timeperiod") + ": " +  fTimePeriodOccurrence.rule_id + "; "+				// Rule ID
       			funcs.scmsg(25, "timeperiod") + ": " +  funcs.str(fTimePeriodOccurrence.start_date) + "; "+	// Start Date
       			funcs.scmsg(26, "timeperiod") + ": " +  funcs.str(fTimePeriodOccurrence.end_date) + "; "+		// End Date
       			funcs.scmsg(40, "timeperiod") + ": " +  display1 +"; "+funcs.scmsg(41, "timeperiod") + ": " +  display2; // active
    }
    
    return string;
	
}

/**
*  This function creates the occurences for a timeperiodRule
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{File}    fRule - the rule
*  @param 	{Date}    dStartDate - the action start date
*  @param 	{String}  sPurgeFlag - the purge action (all, future, none)
*  @param 	{String}  sBackground - indicates whether the functions is called from the backgroung e.g. scheduler
*
*  @example Called by: trigger timeperiodRule.TimeperiodOccurrences.2 / .4 / this script
*	
*/
function createOccurrences(fRule, dStartDate, sPurgeFlag, bBackground) 
{
	var bActiveFlag		= false;
	var userTimezone	= funcs.nullsub(vars.$lo_time_zone, "Greenwich/Universal");
	var ruleTimezone = funcs.nullsub(fRule.timezone, userTimezone);
	
	if (!bBackground) {
	    bBackground=false;
	}
	if (sPurgeFlag == "all") {
	 	manageOccurrences(fRule.definition_id, fRule.id, "deleteallrule");
    }
	if (sPurgeFlag == "future") {
	    manageOccurrences(fRule.definition_id, fRule.id, "deletefuture");
	}
		
	// if the occurrence is created by a background process,
	// ensure that the active flag is set correctly, occurrences are active when time period is in status 2
	if (bBackground==true) {
		var status = lib.timeperiod.getTimeperiodDefinitionStatus(fRule.definition_id);
        if (status=="2") {
        	bActiveFlag = true;
        }
	}
	
	var i;
	var iLen;
	var dDateStart;
	var dDateEnd;
	
	//create arbitrary occurrences
	if (bBackground==false && fRule.arbitrary == true) {
		var dStartDateArray = [];
		var dStartTimeArray = [];
		var dEndDateArray = [];
		var dEndTimeArray = [];
		iLen = fRule.arbitrary_start_time instanceof Array ? fRule.arbitrary_start_time.length : fRule.arbitrary_start_time.length();
		
		// first we need to extract the several portions of the date to ensure the time zone change doesn't 
		// change the date / time values
		for (i = 0; i < iLen; i++) {
			dStartDateArray[i] 	= funcs.val(funcs.date(fRule.arbitrary_start_time[i]),3);
			dStartTimeArray[i] 	= funcs.val(funcs.time(fRule.arbitrary_start_time[i]),3);
			dEndDateArray[i] 	= funcs.val(funcs.date(fRule.arbitrary_end_time[i]),3);
			dEndTimeArray[i] 	= funcs.val(funcs.time(fRule.arbitrary_end_time[i]),3);
		}
		
		//ensure occurrences are created in the timezone specified in the time period record
		setTimezone(fRule.timezone);
		
		// now we build the new date / time string in the new timezone
		for (i = 0; i < iLen; i++) {
			dDateStart 	= getDateTime(dStartDateArray[i], dStartTimeArray[i]);
			dDateEnd 	= getDateTime(dEndDateArray[i], dEndTimeArray[i], 0);
			saveOccurrences(fRule.id, fRule.definition_id, dDateStart, dDateEnd,ruleTimezone, bActiveFlag);
		}
	} else if (fRule.type) {
		
		//ensure occurrences are created in the timezone specified in the time period record
		setTimezone(fRule.timezone);
		
		// never expires scheduled start date
		var dValidFrom;
		if (bBackground && dStartDate) {
			dValidFrom = dStartDate;
		}
		else {
			dValidFrom = new Date(funcs.date(fRule.valid_from));
		}
		var sRRule = fRule.icalendar_rule;

		// never expires initial
		if (!sRRule.match(/COUNT|UNTIL/)) {
			// get global setting
			var iFutureMonths 	= getMaxFutureMonth();
			// get end date as of now
			var xDate;
			if (bBackground) { 
				xDate = new XMLDate(new Date());
			}
			else {
				xDate = new XMLDate(new Date(dValidFrom));
			}
			xDate.addDuration("P" + iFutureMonths + "M");
			sRRule += "UNTIL=" + lib.timeperiodRule.formatXMLDate(xDate.getDate()) + ";";
		}
						
		var oScheduler 	= new ( lib.timeperiodScheduler.getClass() )( dValidFrom, sRRule, false );
		var aOccurences	= oScheduler.all_occurrences();
		iLen = aOccurences instanceof Array ? aOccurences.length : aOccurences.length();
		var statusMessageOrg = funcs.scmsg(36, "timeperiod");

        var retVal;
        var statusMessage;
        						
		// create start and end time stamps in the right timezone
		for (i = 0; i < iLen; i++) 	{
			var dDate		= new Date(aOccurences[i]);
			dDateStart	= getDateTime(dDate, fRule.start_time);								
			dDateEnd	= getDateTime(dDate, fRule.end_time, fRule.end_days);
			saveOccurrences(fRule.id, fRule.definition_id, dDateStart, dDateEnd, ruleTimezone, bActiveFlag);
			
			statusMessage = statusMessageOrg.replace("no1", i).replace("no2", iLen);
			//inform user about the status of occurrence creation
			if (iLen > 10 && i%10==0 && bBackground==false) {	
				funcs.rtecall("statusupdate", retVal, "ruleProgressMessage", statusMessage);
			}
			
		}
		
		if (bBackground==false) {
			statusMessage = statusMessageOrg.replace("no1", iLen).replace("no2", iLen);
			funcs.rtecall("statusupdate", retVal, "ruleProgressMessage", statusMessage);
		}		
	} // if arbitrary
	
	//set timezone back to users timezone
	setTimezone(userTimezone);
}

/**
*  This function calculated the start and end date in the users timezone (ignoring browsers timezone)
*
*  	History:
*	2013-01-31, Jan Steube - function created
*
*  @param 	{Date}	dDate - The date
*  @param 	{Date}	dTime - the time
*  @return 	{Date}	dFinalDate - The constructed final date / time
*	
*/
function getDateTime(dDate, dTime, iEndDay)
{
	//nullsub  number of days to add
	var iDays = funcs.nullsub(iEndDay,0);
	
	//construct the date and split into year, month, day
	dDate.setDate(dDate.getDate()+iDays);
	var JSYEAR 		= funcs.year(dDate);
	var JSMONTH		= funcs.month(dDate);
	var JSDAY		= funcs.day(dDate);
		
	//construct the time
	var SCTIME		= funcs.time(funcs.val(dTime,3));
			
	//build the date string in Service Manager syntax
	var y			= funcs.val(JSYEAR,2);
	var m			= funcs.val(JSMONTH,2);
	var d			= funcs.val(JSDAY,2);
	var time 		= funcs.val(SCTIME,2);
	var dateOrder	= funcs.get_dateformat();	
	var sDateTime	= "";
	
	funcs.lng(m) == 1 ? m = "0" + m : m ;
	funcs.lng(d) == 1 ? d = "0" + d : d ;
		
	// put the date/time value into the right format (user dependend)		
	if (dateOrder == lib.DateOrderConstant.mmddyy() ) {
		sDateTime = m + "/" + d + "/" + y.substr(2) +" " + time;
	}
	else if (dateOrder == lib.DateOrderConstant.ddmmyy() ) {
		sDateTime = d + "/" + m + "/" + y.substr(2) +" " + time;	
	}
	else if (dateOrder == lib.DateOrderConstant.yymmdd() ) {
		sDateTime = y.substr(2) + "/" + m + "/" + d +" " + time;
	}
	else if (dateOrder == lib.DateOrderConstant.mmddyyyy() ) {
		sDateTime = m + "/" + d + "/" + y.substr(2) +" " + time;
	}
	else if (dateOrder == lib.DateOrderConstant.ddmmyyyy() ) {
		sDateTime = d + "/" + m + "/" + y.substr(2) +" " + time;
	}
	else if (dateOrder == lib.DateOrderConstant.yyyymmdd() ) {
		sDateTime = y.substr(2) + "/" + m + "/" + d +" " + time;	
	}
	
	var dFinalDate = new SCDatum(sDateTime);
	return dFinalDate;
}

/**
*  This function creates the occurences for a timeperiodRule
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{String}    sQuery - query to search for records to purge
*
*  @example Called by: trigger timeperiodRule
*	
*/
function purgeOccurrences(sQuery) {
	
	if (sQuery=="") {return ""}
	var fTimePeriodOccurrence	= new SCFile("timeperiodOccurrence");
	var rc = fTimePeriodOccurrence.doPurge( sQuery );
}

/**
*  This function creates the occurences for a timeperiodRule
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{String}    sRuleId - the rule id
*  @param 	{String}    sDefId - the definition id
*  @param 	{Date}    	dStart - start date
*  @param 	{Date}    	dEnd - end date
*  @param   {String}	sTimeZone - time zone
*  @param 	{String}    bActive - status
*
*/
function saveOccurrences(sRuleId, sDefId, dStart, dEnd, sTimeZone, bActive) 
{	
	var sQuery = "rule.id=\"" + sRuleId + "\" and definition.id=\"" + sDefId + "\" and start.date='" + funcs.val(dStart,2) + "' and end.date='" + funcs.val(dEnd,2)+ "'";
	var fTimePeriodOccurrence	= new SCFile("timeperiodOccurrence");
	var rc = fTimePeriodOccurrence.doSelect( sQuery );
	if( rc != RC_SUCCESS ) {
		var rc, scNumber 					= new SCDatum;
		funcs.rtecall("getnumber", rc, scNumber, "timeperiodOccurrence");
		fTimePeriodOccurrence.id 			= scNumber.getText()
		fTimePeriodOccurrence.rule_id 		= sRuleId;
		fTimePeriodOccurrence.definition_id = sDefId;
		fTimePeriodOccurrence.start_date 	= dStart;
		fTimePeriodOccurrence.end_date 		= dEnd;
		fTimePeriodOccurrence.timezone		= sTimeZone
		fTimePeriodOccurrence.active 		= bActive;
		fTimePeriodOccurrence.keep_active 	= true;
		fTimePeriodOccurrence.doSave();
	}	
	
	delete fTimePeriodOccurrence;
}


/**
*  This function manages the occurences for a timeperiodRule
*	Following actions are supported:
*	- activate = activates all occurrences
*	- deactivate = deactivates all occurrences
*	- deletefuture = deletes all future occurrences
*	- deleteallrule = deletes all occurrences for a rule
*	- deleteall = deletes all occurrences of rules which havent been approved. For approved rules only future occurrences are deleted
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{String}    sRuleId - the rule id
*  @param 	{String}    sDefinitionId - the definition id
*  @param 	{String}    	sAction - action as described above
*
*/
function manageOccurrences(sDefinitionId, sRuleId, sAction)
{
 	var dDate = new XMLDate(new Date());
 		dDate = dDate.getSCDateTimeString();
 	var fTimePeriodOcc = new SCFile( "timeperiodOccurrence");
 	
 	if (sDefinitionId=="" || sDefinitionId==null) {return ""}
 	
 	var baseQuery="definition.id=\"" + sDefinitionId + "\""; 	
 	if (sRuleId!="" && sRuleId!=null) {baseQuery += " and rule.id=\""+sRuleId+"\"";}
 	
 	switch (sAction) {
 		case "activate" : 
 			var sQuery = baseQuery+ " and start.date>='"+dDate+"' and keep.active=true";
 			var rc = fTimePeriodOcc.doSelect( sQuery );
    		if( rc == RC_SUCCESS ) {
				rc = fTimePeriodOcc.getFirst();
				while (getLastRC() == RC_SUCCESS) 	{ 
					fTimePeriodOcc.active=true;
					fTimePeriodOcc.doSave();
					var rcNext = fTimePeriodOcc.getNext();
				}
			}
 			break;
 		case "deactivate" : 
 			var sQuery =  baseQuery + " and start.date>='"+dDate+"' and keep.active=true";
 			var rc = fTimePeriodOcc.doSelect( sQuery );
    		if( rc == RC_SUCCESS ) 	{
				rc = fTimePeriodOcc.getFirst();
				while (getLastRC() == RC_SUCCESS) 	{ 
					fTimePeriodOcc.active=false;
					fTimePeriodOcc.doSave();
					var rcNext = fTimePeriodOcc.getNext();
				}
			}
 			break;	
 			
		case "deletefuture" : 
			// deletes all future occurrences for this rule
			var sQuery =  baseQuery + " and start.date>='"+dDate+"'";
			purgeOccurrences(sQuery) 
 			break;
 			
 		case "deleteallrule" : 
 			// deletes all occurrences for this rule
 			if (sRuleId=="" || sRuleId==null) {return ""}
			var sQuery =  baseQuery;
			purgeOccurrences(sQuery) 
 			break;
 		
 		case "deleteall" : 
			// get all locked rules, this means the record was in publish phase and historic approved occurrences should not be deleted
			var baseQuery		= "definition.id=\"" + sDefinitionId + "\""; 	
			var rules 			= lib.timeperiod.getRules(sDefinitionId, null, true);
			var rulesLocked		= rules[0];
			
			//get not locked Rules
			var rules 			= lib.timeperiod.getRules(sDefinitionId, null, false);
			var rulesNotLocked	= rules[0];
						
			if (rulesLocked && rulesNotLocked) {
				var sQuery = "("+baseQuery + " and rule.id isin " + funcs.str(rulesLocked) + " and start.date>='"+dDate+"') or ("+baseQuery + " and rule.id isin " + funcs.str(rulesNotLocked)+")";
			}
			
			if (rulesLocked && !rulesNotLocked) {
				var sQuery = baseQuery + " and rule.id isin " + funcs.str(rulesLocked) + " and start.date>='"+dDate+"'";
			}
		
			if (!rulesLocked && rulesNotLocked) {
				var sQuery = baseQuery + " and rule.id isin " + funcs.str(rulesNotLocked);
			}
			if (sQuery) {
				purgeOccurrences(sQuery);
			}
 			break;
 			
	}
}

/**
*  This function creates the occurences for a never expire timeperiodRule up to the current threshold
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*
*  @param 	- none
*	
*/
function scheduledOccurrences() 
{
	var now 	= new XMLDate(new Date());
	now 		= now.getSCDateTimeString();
	
	// get end max future date as of now to check how far in future to create new occurrences
	var iFutureMonths = getMaxFutureMonth();
	var xMaxFutureDate = new XMLDate(new Date());
	xMaxFutureDate.addDuration("P" + iFutureMonths + "M");
	var dMaxFutureDate = funcs.val(xMaxFutureDate.getSCDateTimeString(), 3);
	
	// get the rules
	var fTimePeriodRule = new SCFile( "timeperiodRule", SCFILE_READONLY);
	var sQuery = "type~=\"arbitrary\" and active=true and (valid.type=\"never\" or valid.to>='"+now+"')";
	var rc = fTimePeriodRule.doSelect( sQuery );
	
	if( rc == RC_SUCCESS ) {
		rc = fTimePeriodRule.getFirst();
		while (getLastRC() == RC_SUCCESS) 	{
			
			// set time zone stored in the rule
			setTimezone(fTimePeriodRule.timezone);
			
			// check if definition is active, otherwise take next rule
			if (isTPDefinitionActive(fTimePeriodRule.definition_id)==true) {
				
				// get last occurrence startdate
				var fTimePeriodOccurrence = new SCFile( "timeperiodOccurrence", SCFILE_READONLY);
				var sQuery = "rule.id=\"" + fTimePeriodRule.id + "\"";
				fTimePeriodOccurrence.setFields(['start.date']);
				fTimePeriodOccurrence.setOrderBy(['start.date'], [SCFILE_DSC]);
				
				var rcTPO = fTimePeriodOccurrence.doSelect( sQuery );
				
				if( rcTPO == RC_SUCCESS ) {
					// get next date for occurence and check if next occurrence is within limit for future
					var dStartDate = funcs.val(getDateTime(fTimePeriodOccurrence.start_date, funcs.val('00:00:00',3), 1),3);
					if (dMaxFutureDate>=dStartDate) {				
						createOccurrences(fTimePeriodRule, dStartDate, "none", true);
					}
				} else {
					// create all occurrences
					createOccurrences(fTimePeriodRule, null, "none", true);
				}
			}
			rcNext = fTimePeriodRule.getNext();
		}
	}	
}

/**
*  This function checks if a time period definition is still active
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{string}    sDefId - the Definition id
*  @param 	{boolean}   active - the active flag of the time period
*	
*/
function isTPDefinitionActive(sDefId)
{
	var fTimePeriod = new SCFile( "timeperiodDefinition", SCFILE_READONLY);
	fTimePeriod.setFields(['active']);
	var sQuery = "id=\""+sDefId+"\"";
	var rc = fTimePeriod.doSelect( sQuery );
	if( rc == RC_SUCCESS ) {
		return fTimePeriod.active;
	}
	
	return false;
}

/**
*  This function sets the timezone of the current operator / process to calculate the occurrences correctly
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	{string}   	sTimezone - the name of the time zone to set
*  @param 	{integer}   iDateOrder - the date order to set
		MMDDYY 		= 1
		DDMMYY 		= 2
		YYMMDD 		= 3
		MMDDYYYY 	= 4
		DDMMYYYY 	= 5
		YYYYMMDD 	= 6
*	
*/
function setTimezone(sTimezone) {

	// set the timezone
	var fTz	= new SCFile("tzfile");
	var rc	= fTz.doSelect("name = \""+sTimezone+"\"");
	
	if (rc==RC_SUCCESS)	{
	
		fTz.date_order = funcs.nullsub(vars.$lo_date_order,1);
		funcs.set_timezone(fTz);
		var ttt = funcs.fduplicate(vars.$G_timezone, fTz)
	}
}

/**
*  This function returns the global setting for the max future occurrence creation
*
*  	History:
*	2012-12-11, Jan Steube - function created
*
*  @param 	- none
*  @return	{integer}	- the numbe of month
*	
*/
function getMaxFutureMonth() {

	var iFutureMonths 	= lib.settings.getSettingValue( "Timeperiod", "monthOccurrences" );
	
	if (!iFutureMonths) 
		iFutureMonths = 12
	
	return funcs.val(iFutureMonths,1);
}


/**
* This method is speically for creating scheduler for upgrading. It's not for business logics.
* It will create a scheduler with name "Time period manage occurrences".
* See defect QCCR1E107985.
*/
function createTimePeriodOccurrenceSchedule()
{
	var strScheduleName = "Time period manage occurrences";

	var fschedule = new SCFile("schedule");
	var sql = "name=\"" + strScheduleName + "\"";
	var theXMLDate = new XMLDate( new Date() );
	if (fschedule.doSelect(sql) == RC_SUCCESS )
	{
		fschedule.expiration = theXMLDate.getDatum();
		fschedule.doUpdate();
	}
	else
	{
		fschedule.name = strScheduleName;
		fschedule["class"] ="report";
		fschedule["sched.class"] ="report";
		fschedule["description"]=["Manages the time period Occurrences.", "1. writes new occurrences for the never expires rules or the rules expiring if far future"] ;
		fschedule["repeat"] = funcs.val("00 01:00:00", 3);
		fschedule["action.time"] = theXMLDate.getDatum();
		fschedule["expiration"] = theXMLDate.getDatum();
		fschedule["javascript"] = "lib.timeperiodOccurrence.scheduledOccurrences();";
		fschedule.doInsert();
		
		log.info("successfully insert schedule 'Time period manage occurrences'");
	}
}
