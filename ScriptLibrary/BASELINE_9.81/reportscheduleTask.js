/**
 * @fileoverview  Handles functionality associated with report schedule occurence.
 */

var log = getLog("ExportTask");

var PHASE_CREATED         =  "created";           // The task is just created, no data generated
var PHASE_DATA_PREPARING  =  "preparing";         // Some scheduler is working to prepare the data for this task
var PHASE_DATA_PREPARED   =  "prepared";          // The data for this occurrence is prepared, but not exported yet
var PHASE_EXPORT_DONE     =  "exported";          // Done processing on this task, we can remove this task now

function initLog(logLevel)
{
  log.setLevel(logLevel);
}


/**
 *  This function creates the occurences for a rule
 *
 *  @param 	{File}    fRule - the rule
 *  @param 	{Date}    dStartDate - the action start date
 *  @param 	{String}  sPurgeFlag - the purge action (all, future, none)
 *  @param 	{String}  sBackground - indicates whether the functions is called from the background e.g. scheduler
 *
 */

function createOccurrences(fRule, dStartDate, sPurgeFlag, bBackground)
{
  var bActiveFlag   = false;
  var userTimezone  = funcs.nullsub(vars.$lo_time_zone, "Greenwich/Universal");

  if (!bBackground) {
    bBackground = false;
  }

  if (sPurgeFlag == "all") {
    manageOccurrences(fRule.id, "deleteallrule");
  }

  if (sPurgeFlag == "allcreated") {
    manageOccurrences(fRule.id, "deleteallcreated");
  }

  if (sPurgeFlag == "future") {
    manageOccurrences(fRule.id, "deletefuture");
  }

  // if the occurrence is created by a background process,
  // ensure that the active flag is set correctly, occurrences are active when reportscheduleDefinition is in current.phase scheduled
  bActiveFlag = true;

  var tzRule = lib.tzFunctions.getTZforOperator(fRule.owner);
  
  if (log.isDebugEnabled()) {
    log.debug("rule: " + fRule.getText() + ", rule_type: " + fRule.rule_type + ", rule_arbitrary: " + fRule.rule_arbitrary + ", timezone: " + tzRule);
  }

  // create arbitrary occurrences
  if (fRule.rule_arbitrary == true)
  {
    var dStartDateArray = [];
    var dStartTimeArray = [];
    var iLen = fRule.rule_arbitrary_start_time instanceof Array ? fRule.rule_arbitrary_start_time.length : fRule.rule_arbitrary_start_time.length();

    // first we need to extract the several portions of the date to ensure the time zone change doesn't 
    // change the date / time values
    var i;
    for (i = 0; i < iLen; i++)
    {
      dStartDateArray[i] = funcs.val(funcs.date(fRule.rule_arbitrary_start_time[i]),3);
      dStartTimeArray[i] = funcs.val(funcs.time(fRule.rule_arbitrary_start_time[i]),3);
    }

    //ensure occurrences are created in the timezone specified in the record
    setTimezone(tzRule);

    // now we build the new date / time string in the new timezone
    for (i = 0; i < iLen; i++)
    {
      var dDateStart   = getDateTime(dStartDateArray[i], dStartTimeArray[i]);
      createTask(fRule, dDateStart, bActiveFlag);
    }
  }
  else
  {
    if (fRule.rule_type)
    {
      var tmStart = fRule.rule_start_time;
      //ensure occurrences are created in the timezone specified in the record
      setTimezone(tzRule);

      // never expires scheduled start date
      var now = new Date();
      var dRuleStart = getDateTime( fRule.rule_valid_from, tmStart, 0);
      if ( dRuleStart < now )
      {
        dRuleStart = getDateTime( fRule.rule_valid_from, tmStart, 1);
      }

      if ( !dStartDate || dStartDate < now )
      {
        dStartDate = getDateTime( funcs.tod(), tmStart, 0);
        if (log.isDebugEnabled()) {
          log.debug("dStartDate: " + funcs.val(dStartDate, 2) );
        }
      }

      if ( dStartDate < now )
      {
        dStartDate = getDateTime( funcs.tod(), tmStart, 1);
      }

      var dValidFrom = dStartDate;
      var sRRule = fRule.standard_prule;

      // !!! Only generate the next several months
      // Or we might generate hundreds of events for a regular task
      // never expires initial
      //if (!sRRule.match(/COUNT|UNTIL/))
      if ( sRRule.match(/COUNT/) || (!sRRule.match(/UNTIL/)) )
      {
        // get global setting
        var iFutureMonths   = getMaxFutureMonth();

        // get end date as of now
        var xDate = new XMLDate(new Date());
        xDate.addDuration("P" + iFutureMonths + "M");

        if ( (fRule.rule_valid_type === 'date') && ( xDate.getDate() >= fRule.rule_valid_to ) ) {
          sRRule += "UNTIL=" + lib.reportscheduleRule.formatXMLDate(fRule.rule_valid_to) + ";";
        }
        else {
          sRRule += "UNTIL=" + lib.reportscheduleRule.formatXMLDate(xDate.getDate()) + ";";
        }
      }
      if (log.isDebugEnabled()) {
        log.debug("sRRule: " + sRRule);
      }

      var oScheduler   = new ( lib.timeperiodScheduler.getClass() )( dRuleStart, sRRule, false );
      var aOccurrences  = oScheduler.all_occurrences( dValidFrom );

      if (log.isDebugEnabled()) {
        log.debug("ValidFrom: " + funcs.val(dValidFrom, 2) );
      }

      iLen = aOccurrences instanceof Array ? aOccurrences.length : aOccurrences.length();
      var statusMessageOrg = funcs.scmsg(136, "reportschedule");

      var statusMessage;
      var retVal = new SCDatum();
      
      // create start and end time stamps in the right timezone
      for (i = 0; i < iLen; i++)
      {
        var dDate       = new Date(aOccurrences[i]);

        createTask( fRule, dDate, bActiveFlag );

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

  }

  //set timezone back to users timezone
  setTimezone(userTimezone);
}

/**
 *  This function calculated the start and end date in the users timezone (ignoring browsers timezone)
 *
 *  @param 	{Date}	dDate - The date
 *  @param 	{Date}	dTime - the time
 *  @return 	{Date}	dFinalDate - The constructed final date / time
 *
 */
function getDateTime(dDate, dTime, iEndDay)
{
  //nullsub  number of days to add
  var iDays = funcs.nullsub(iEndDay, 0);

  dDate.setDate(dDate.getDate() + iDays);

  var sDate = funcs.val(dDate, 2);
  var pos = sDate.indexOf(' ');
  sDate = (pos >= 0)? sDate.substring(0, pos + 1) : sDate;
  sDate += funcs.val(dTime, 2);

  return funcs.val(sDate, 3);

/*
  var JSYEAR   = dDate.getFullYear();
  var JSMONTH  = dDate.getMonth()+1;
  var JSDAY    = dDate.getDate();

  //construct the time
  var SCTIME    = funcs.time(funcs.val(dTime,3));

  //build the date string in Service Manager syntax
  var y      = funcs.val(JSYEAR, 2);
  var m      = funcs.val(JSMONTH, 2);
  var d      = funcs.val(JSDAY, 2);
  var time   = funcs.val(SCTIME, 2);
  var dateOrder  = funcs.get_dateformat();
  var sDateTime  = "";

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
    sDateTime = m + "/" + d + "/" + y.substr(0) +" " + time;
  }
  else if (dateOrder == lib.DateOrderConstant.ddmmyyyy() ) {
    sDateTime = d + "/" + m + "/" + y.substr(0) +" " + time;
  }
  else if (dateOrder == lib.DateOrderConstant.yyyymmdd() ) {
    sDateTime = y.substr(0) + "/" + m + "/" + d +" " + time;
  }

  log.debug("-- sDate: " + sDateTime + ", day: " + d + ", JSDAY: " + JSDAY);

  var dFinalDate = new Datum(sDateTime);
  dFinalDate = funcs.val( dFinalDate, 3 );

  log.debug("-- dFinalDate: " + funcs.val( dFinalDate, 2 ));

  return dFinalDate;
*/
}

/**
 *  This function creates the occurences
 *
 *  @param 	{String}    sQuery - query to search for records to purge
 *
 */

function purgeOccurrences(sQuery)
{
  if ( sQuery )
  {
    var f	= new SCFile("reportscheduleTask");
    var rc = f.doPurge( sQuery );
  }
}

/**
 * Create a export task
 *
 * @param {ReportScheduleDefinition} taskDef
 * @param {Date}                     dStart
 * @param {Date}                     bActive
 */
function createTask(taskDef, dStart, bActive)
{
  var sDefId = taskDef.id;

  var sQuery = "definition.id=\"" + sDefId + "\" and start.date='" + funcs.val(dStart,2) + "'";
  var record  = new SCFile("reportscheduleTask");
  var rc = record.doSelect( sQuery );
  if (log.isDebugEnabled()) {
    log.debug("createTask Query: " + sQuery );
  }

  if ( rc != RC_SUCCESS )
  {
    var retVal = new SCDatum();
    var scNumber = new SCDatum();
    funcs.rtecall("getnumber", retVal, scNumber, "reportscheduleTask");
    record.id            = scNumber.getText();
    record.definition_id = sDefId;
    record.start_date    = dStart;
    record.active        = bActive;
    record.keep_active   = true;
    record.succeed       = true;
    record.name          = taskDef.name;
    record.description   = taskDef.description;

    record.current_phase = PHASE_CREATED;
    record.owner         = taskDef.owner;
    record.inbox_dashboard  = taskDef.inbox_dashboard;
    record.inbox_report  = taskDef.inbox_report;

    record.flag_email      = taskDef.flag_email;
    record.flag_notification = taskDef.flag_notification;
    record.email_notification_name = taskDef.email_notification_name;
    record.flag_file       = taskDef.flag_file;
    record.file_type_pdf   = taskDef.file_type_pdf;
    record.file_type_html  = taskDef.file_type_html;
    record.email_subject   = taskDef.email_subject;
    record.email_content_msg = taskDef.email_content;
    record.email_to_groups = taskDef.email_to_groups;
    record.email_to_users  = taskDef.email_to_users;
    record.page_direction  = taskDef.page_direction;
    record.retry_count     = 0;
    record.message_id      = [];
    record.copyright       = funcs.scmsg("copyright", "Reporting");

    record.doSave();
  }
}

/**
 *  This function manages the occurences for a rule
 *	Following actions are supported:
 *	- activate = activates all occurrences
 *	- deactivate = deactivates all occurrences
 *	- deletefuture = deletes all future occurrences
 *	- deleteallrule = deletes all occurrences for a rule
 *	- deleteall = deletes all occurrences of rules which havent been approved
 *
 *  @param 	{String}    sDefinitionId - the definition id
 *  @param 	{String}    	sAction - action as described above
 *
 */

function manageOccurrences(sDefinitionId, sAction)
{
  var dDate = new XMLDate(new Date());
  dDate = dDate.getSCDateTimeString();

  var fOccurrence = new SCFile( "reportscheduleTask");
  if (sDefinitionId=="" || sDefinitionId==null) {return "";}

  var baseQuery="definition.id=\"" + sDefinitionId + "\"";

  var sQuery;
  var rc;
  
  switch (sAction) {
    case "activate" :
      sQuery = baseQuery+ " and start.date>='"+dDate+"' and keep.active=true";
      rc = fOccurrence.doSelect( sQuery );
      if( rc == RC_SUCCESS )
      {
        do
        {
          fOccurrence.active=true;
          fOccurrence.doSave();
        }while (fOccurrence.getNext() == RC_SUCCESS);
      }
      break;

    case "deactivate" :
      sQuery =  baseQuery + " and start.date>='"+dDate+"' and keep.active=true";
      rc = fOccurrence.doSelect( sQuery );
      if( rc == RC_SUCCESS )  {
        do
        {
          fOccurrence.active=false;
          fOccurrence.doSave();
        }while (fOccurrence.getNext() == RC_SUCCESS);
      }
      break;

    case "deletefuture" :
      // deletes all future occurrences for this rule
      sQuery =  baseQuery + " and start.date>='"+dDate+"'";
      purgeOccurrences(sQuery);
      break;

    case "deleteallrule" :
      // deletes all occurrences for this rule
      sQuery =  baseQuery;
      purgeOccurrences(sQuery);
      break;

    case "deleteall" :
      // deletes all occurrences for this rule
      sQuery =  baseQuery;
      purgeOccurrences(sQuery);
      break;

    case "deleteallcreated" :
      // delete all tasks which not been processed
      sQuery = baseQuery + ' and current.phase="created"';
      purgeOccurrences(sQuery);
      break;
  }
}

/**
 *  This function creates the occurrences for a never expire rule up to the current threshold
 *
 *  @param 	- none
 *
 */

function generateTasks()
{
  if ( lib.reportingHelp.isEnabledReporting() == false ) {
    return false;
  }

  var nowDate = new XMLDate(new Date());
  var now     = nowDate.getSCDateTimeString();

  // get end max future date as of now to check how far in future to create new occurrences
  var iFutureMonths = getMaxFutureMonth();
  var xMaxFutureDate = new XMLDate(new Date());
  xMaxFutureDate.addDuration("P" + iFutureMonths + "M");
  var dMaxFutureDate = funcs.val(xMaxFutureDate.getSCDateTimeString(), 3);

  if (log.isDebugEnabled()) {
    log.debug("futuremonth: " + iFutureMonths + ", maxfuturedate: " + funcs.val(dMaxFutureDate, 2) );
  }

  // get the rules
  var fRule = new SCFile( "reportscheduleDefinition", SCFILE_READONLY);
  var sQuery = 'current.phase="scheduled" and active=true and ( ( rule.type~="arbitrary" and (rule.valid.type="never" or rule.valid.to>=\'' + now + '\' ) or rule.valid.type="occurence" ) )';
  var rc = fRule.doSelect( sQuery );

  if (log.isDebugEnabled()) {
    log.debug("task query: " + sQuery + ", rc: " + rc);
  }

  if ( rc == RC_SUCCESS )
  {
    do
    {
      var tzRule = lib.tzFunctions.getTZforOperator(fRule.owner);

      // set time zone stored in the rule
      setTimezone(tzRule);
      now     = nowDate.getSCDateTimeString();
      
      var bArbitrary = fRule.rule_arbitrary;

      // Do not generate the arbitrary schedule tasks any more, it should already generated when get scheduled
      if ( !bArbitrary )
      {
        // get last occurrence startdate
        var fTask = new SCFile( "reportscheduleTask", SCFILE_READONLY );
        sQuery = ' definition.id = "' + fRule.id + '" and current.phase = "' + PHASE_CREATED + '" ';
        sQuery += ' and start.date >= \'' + now + '\' ';

        fTask.setFields(['start.date']);
        fTask.setOrderBy(['start.date'], [SCFILE_DSC]);

        var rcTPO = fTask.doSelect( sQuery );
        if (log.isDebugEnabled()) {
          log.debug("reportscheduleTask, query: " + sQuery + ", rc: " + rc + ", data:" + fTask.getText() );
        }
        if ( rcTPO == RC_SUCCESS )
        {
          // get next date for occurrence and check if next occurrence is within limit for future
          var dStartDate = getDateTime( fTask.start_date, funcs.time(fTask.start_date), 0 );
          dMaxFutureDate = getDateTime( dMaxFutureDate, funcs.time(fTask.start_date), 0 );
          if (dMaxFutureDate > dStartDate)
          {
            createOccurrences(fRule, dStartDate, "none", true);
          }
        }
        else
        {
          // create all occurrences
          createOccurrences(fRule, null, "none", true);
        }
      }
    } while (fRule.getNext() == RC_SUCCESS);
  }

  forceGC();
}

/**
 *  This function checks if a definition is still active
 *
 *  @param 	{string}    sDefId - the Definition id
 *  @param 	{boolean}   active - the active flag of the time period
 *
 */

function isDefinitionActive(sDefId)
{
  var fRecord = new SCFile( "reportscheduleDefinition", SCFILE_READONLY);
  fRecord.setFields(['active']);
  var sQuery = "id=\""+sDefId+"\"";
  var rc = fRecord.doSelect( sQuery );
  if( rc == RC_SUCCESS ) {
    return fRecord.active;
  }

  return false;
}

/**
 *  This function sets the timezone of the current operator / process to calculate the occurrences correctly
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
function setTimezone(sTimezone)
{
  // set the timezone
  var fTz	= new SCFile("tzfile");
  var rc	= fTz.doSelect("name = \""+sTimezone+"\"");

  if (rc==RC_SUCCESS)
  {
    fTz.date_order = funcs.nullsub(vars.$lo_date_order,1);
    funcs.set_timezone(fTz);
    var ttt = funcs.fduplicate(vars.$G_timezone, fTz);
  }
}

/**
 *  This function returns the global setting for the max future occurrence creation
 *
 *  @param 	- none
 *  @return	{Integer}	- the number of month
 *
 */
function getMaxFutureMonth()
{
  var iFutureMonths = lib.settings.getSettingValue( "Report", "monthOccurrences" );

  if ( !iFutureMonths ) {
    iFutureMonths = 1;
  }

  return funcs.val(iFutureMonths, 1);
}

/**
 * Get the maximum days to keep log
 * @returns {days}, 0 or undefined means we don't want to clean the log item
 */
function getReportLogCleanup()
{
  var daysInterval = lib.settings.getSettingValue( "Report", "Perf.clean.interval" );

  if ( !daysInterval ) {
    daysInterval = 0;
  }

  return funcs.val(daysInterval, 1);
}

function cleanReportLogs()
{
  if ( !lib.reportCmn.isReportingEnabled() ) {
    return;
  }

  var daysInterval = getReportLogCleanup();
  if ( daysInterval <= 0 )
  {
    if (log.isDebugEnabled()) {
      log.debug("Report log cleanup interval is not configured, assume we want to save all the report log");
    }
    return;
  }

  if (log.isDebugEnabled()) {
    log.debug("Report log clean interval (days): " + daysInterval);
  }

  var dDate = new Date();
  dDate.setDate( dDate.getDate() - daysInterval);
  if (log.isDebugEnabled()) {
    log.debug("Cleaning report logs before: " + funcs.val(dDate, 2) );
  }

  var i = 0;
  var q = "SELECT id FROM reportLog WHERE startTime < '" + funcs.val(dDate, 2) + "' ";
  var f = new SCFile("reportLog");
  var rc = f.doSelect(q);
  while ( rc == RC_SUCCESS )
  {
    rc = f.doDelete();
    if ( rc == RC_SUCCESS ) {
      i++;
    }
    rc = f.getNext();
  }
  
  if (log.isDebugEnabled()) {
    log.debug("Cleaned " + i + " report log items, query: " + q);
  }
}

function cleanAllReportLogs()
{
  var i = 0;
  var f = new SCFile("reportLog");
  var rc = f.doSelect("SELECT id FROM reportLog WHERE true");
  while ( rc == RC_SUCCESS )
  {
    rc = f.doDelete();
    if ( rc == RC_SUCCESS ) {
      i++;
    }
    rc = f.getNext();
  }
  if (log.isDebugEnabled()) {
    log.debug("Cleaned " + i + " report log items.");
  }
}
