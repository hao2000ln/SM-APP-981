
/**
 * @fileoverview  Handles functionality associated with Report Schedule Rules.
 */

_index    = funcs.index;
_lng      = funcs.lng;
_str      = funcs.str;
_insert   = funcs.insert;
_denull   = funcs.denull;
_nullsub  = funcs.nullsub;
_operator = funcs.operator;
_rtecall  = funcs.rtecall;
_scmsg    = funcs.scmsg;
_val      = funcs.val;

//var log = getLog("reportscheduleRule");

/**
 *  This function calculates values to be saved in the Report Schedule Rule entry
 *  @param 	{record} 	fRecord 	- the current record
 */
function saveReportScheduleRule(fRecord) {
  var defCopy = new SCDatum();
  var dtTmp = new SCDatum();
  _rtecall("copycurrent", dtTmp, defCopy, fRecord);

  // check valid type of rule
  if (defCopy.rule_valid_type == "never") {
    defCopy.rule_valid_to = null;
    defCopy.rule_valid_count=null;

  } else if (defCopy.rule_valid_type == "occurence") {
    defCopy.rule_valid_to = null;
  } else if (defCopy.rule_valid_type == "date") {
    defCopy.rule_valid_count = null;
  }

  // check arbitrary of rule
  if (defCopy.rule_arbitrary==false)
  {
    defCopy.rule_arbitrary_start_time = null;

    if ( defCopy.rule_end_type == "same" ) {
      defCopy.rule_end_days = null;
    }
  }

/*
  if ((defCopy.rule_type !== "month") && (defCopy.rule_type !== "year")) {
    vars["$rpsch.monthdayrule"]  =  null;
    vars["$rpsch.dayofmonth"]    = null;
    vars["$rpsch.monthweekdays"] = null;
  }
*/

  vars["$rpsch.dayofmonth"]  = _nullsub(vars["$rpsch.dayofmonth"], "1");
  vars["$rpsch.monthdayrule"]  = _nullsub(vars["$rpsch.monthdayrule"], "-1");
  vars["$rpsch.monthweekdays"]  = _nullsub(vars["$rpsch.monthweekdays"], "1");

  if (defCopy.rule_arbitrary == true)
  {
    defCopy.rule_occurrence  = null;
    defCopy.rule_day         = null;
    defCopy.rule_weekdays    = null;
    defCopy.rule_month       = null;
    defCopy.rule_start_time  = null;
//    defCopy.rule_end_time    = null;
//    defCopy.rule_end_days    = null;
    defCopy.rule_valid_from  = null;
    defCopy.rule_valid_to    = null;
    defCopy.rule_valid_count = null;
    defCopy.rule_type	     = null;
//    defCopy.rule_end_type    = "same";
  }
  else if (defCopy.rule_type == "day")
  {
    defCopy.rule_day      = null;
    defCopy.rule_weekdays = null;
    defCopy.rule_month    = null;
  }
  else if (defCopy.rule_type == "week")
  {
    defCopy.rule_day   = null;
    defCopy.rule_month = null;

    var iWeekDays = 0;
    var i;
    for (i = 0; i < 7; i++)
    {
      iWeekDays |= eval(_nullsub(eval("vars.$rpsch_weekday_" + i), false)) << i;
    } // for weekdays
    defCopy.rule_weekdays = iWeekDays;
    fRecord.rule_weekdays = iWeekDays;
  }
  else if (defCopy.rule_type == "month")
  {
    defCopy.rule_month = null;
    if (defCopy.rule_month_type == "regular")
    {
      defCopy.rule_day = _val(vars["$rpsch.dayofmonth"], 1);
      fRecord.rule_day = _val(vars["$rpsch.dayofmonth"], 1);

      defCopy.rule_weekdays = null;
      fRecord.rule_weekdays = null;
    }
    else if (defCopy.rule_month_type == "irregular")
    {
      defCopy.rule_day      = _val(vars["$rpsch.monthdayrule"], 1);
      defCopy.rule_weekdays = _val(vars["$rpsch.monthweekdays"], 1);

      fRecord.rule_day      = _val(vars["$rpsch.monthdayrule"], 1);
      fRecord.rule_weekdays = _val(vars["$rpsch.monthweekdays"], 1);

    } // if regular
  }
  else if (defCopy.rule_type == "year")
  {
    if (defCopy.rule_year_type == "regular")
    {
      defCopy.rule_day = _val(vars["$rpsch.dayofmonth"], 1);
      fRecord.rule_day = _val(vars["$rpsch.dayofmonth"], 1);
      defCopy.rule_weekdays = null;
      fRecord.rule_weekdays = null;
    }
    else if (defCopy.rule_year_type == "irregular")
    {
      defCopy.rule_day      = _val(vars["$rpsch.monthdayrule"], 1);
      defCopy.rule_weekdays = _val(vars["$rpsch.monthweekdays"], 1);

      fRecord.rule_day      = _val(vars["$rpsch.monthdayrule"], 1);
      fRecord.rule_weekdays = _val(vars["$rpsch.monthweekdays"], 1);

    } // if regular
  } // if type

  if (fRecord.arbitrary==true)
  {
    fRecord.standard_prule = "";
    return;
  }

  // if not arbitrary create the standard RRULE and save in the database (for usage in other calcs...)
  fRecord.standard_prule = iCalRule(defCopy);
}

/**
 *  This function calculates the initial values to be displayed for the Report Schedule Rule entry
 *  @param 	{record} 	fRecord 	- the current record
 */
function initReportScheduleRule(fRecord) {
  //nullsub some values
  if (fRecord.rule_arbitrary==null) {
    fRecord.rule_arbitrary   = false;
  }
//  if (fRecord.rule_end_type==null) {
//    fRecord.rule_end_type    = "same";
//  }
  if (fRecord.rule_valid_type==null) {
    fRecord.rule_valid_type  = "date";
  }
  if (fRecord.rule_month_type==null) {
    fRecord.rule_month_type  = "regular";
  }
  if (fRecord.rule_year_type==null)  {
    fRecord.rule_year_type   = "regular";
  }
  if (fRecord.rule_timezone==null)   {
    fRecord.rule_timezone    = vars.$lo_time_zone;
  }
  if (fRecord.rule_type==null && fRecord.rule_arbitrary==false) {
    fRecord.rule_type = "day";
  }

  if ( !fRecord.rule_month || fRecord.rule_month <= 0 ) {
    fRecord.rule_month = 1;
  }

  //cleanup variables
  vars["$rpsch.monthdayrule"]  = "-1";
  vars["$rpsch.monthweekdays"] = "1";
  vars["$rpsch.dayofmonth"]    = "1";
  vars["$rpsch.arb.start"]     = null;
  vars["$rpsch.arb.end"]       = null;

  var i;
  for (i = 0; i < 7; i++) {
    eval("vars.$rpsch_weekday_" + i + " = false ; ");
  } // for weekdays

  if (fRecord.rule_arbitrary == false)
  {
    if (fRecord.rule_type == "week") {
      var iWeekdays = fRecord.rule_weekdays;
      for (i = 0; i < 7; i++) {
        var bDay = Boolean(iWeekdays & 1);
        eval("vars.$rpsch_weekday_" + i + " = bDay ; ");
        iWeekdays >>>= 1;
      } // for weekdays
    }
    else if (fRecord.rule_type == "month")
    {
      if (fRecord.rule_month_type === "irregular")
      {
        vars["$rpsch.monthdayrule"]  = _nullsub(fRecord.rule_day, "-1");
        vars["$rpsch.monthweekdays"] = _nullsub(fRecord.rule_weekdays, "1");
      } else {
        vars["$rpsch.dayofmonth"]    = _nullsub(fRecord.rule_day, "1");
      } // if weekdays
    }
    else if (fRecord.rule_type == "year")
    {
      if (fRecord.rule_day && fRecord.rule_month)
      {
        if (fRecord.rule_year_type === "irregular")
        {
          vars["$rpsch.monthdayrule"]  = fRecord.rule_day;
          vars["$rpsch.monthweekdays"] = fRecord.rule_weekdays;
        }
        else
        {
          vars["$rpsch.dayofmonth"]    = fRecord.rule_day;
        } // if weekdays
      } // if day / month
    } // if type
  } // if type exists
}

/**
 *  This function calculates the rule according to the standard RRULE
 *  @param 	{record} 	fRecord 	- the current record
 *  @returns {string}  	sRule 		- the iCal Rule
 *
 */
function iCalRule(fRecord) {
  // Calculate iCal Rule
  var sRule="RRULE:";
  fRecord.rule_type == "day" 	? sRule += "FREQ=DAILY;" 	: "" ;
  fRecord.rule_type == "week" 	? sRule += "FREQ=WEEKLY;" 	: "" ;
  fRecord.rule_type == "month"  ? sRule += "FREQ=MONTHLY;" 	: "" ;
  fRecord.rule_type == "year" 	? sRule += "FREQ=YEARLY;" 	: "" ;

  if(fRecord.rule_valid_to)
  {
    //put UNTIL in recurrence pattern only when VALID_TO date is within the global settings
    //otherwise handle it similar as never expires.
    var iFutureMonths = getMaxFutureMonth();
    if (iFutureMonths == null || iFutureMonths=="") {
        iFutureMonths = 1;
    }
    // get end date as of now
    var dDate = new XMLDate(new Date());
    dDate.addDuration("P" + iFutureMonths + "M");
    if (formatXMLDate(dDate.getDate())>=formatXMLDate(fRecord.rule_valid_to)) {
      // end date from the Rule
      sRule += "UNTIL=" + formatXMLDate(fRecord.rule_valid_to) + ";";
    }
  } else if(fRecord.rule_valid_count)
  {
    // end after x occurrences
    sRule += "COUNT=" + fRecord.rule_valid_count + ";";
  }

  // handle the recurrences
  fRecord.rule_occurrence ?  sRule += "INTERVAL=" + fRecord.rule_occurrence + ";" : "" ;

  var sWeekday = "";
  var aDays = ["SU","MO", "TU", "WE", "TH", "FR", "SA", "DAY"];
  if (fRecord.rule_weekdays) {
    var sDays = "";
    var iWeekdays = fRecord.rule_weekdays;

    var i;
    for (i = 0; i < 8; i++) {
      Boolean(iWeekdays & 1) ? (sDays ?  sDays += "," + aDays[i] : sDays += aDays[i]) : "" ;
      iWeekdays >>>= 1;
    } // for weekdays
    if (fRecord.rule_type == "week") {
      sDays ? sRule += "BYDAY=" + sDays + ";" : "" ;
    } else if (sDays) {
      sWeekday = sDays;
    }
  }
  if ((fRecord.rule_type == "month") || (fRecord.rule_type == "year"))
  {
    if (!fRecord.rule_weekdays)
    {
      fRecord.rule_day ?  sRule += "BYMONTHDAY=" + fRecord.rule_day + ";" : "" ;
      // last day of the month
    }
    else if (sWeekday=="DAY")
    {
      // special case last day of the month
      fRecord.rule_day == -1 ? sRule += "BYMONTHDAY=1;" : "" ;
      fRecord.rule_day == -2 ? sRule += "BYMONTHDAY=2;" : "" ;
      fRecord.rule_day == -3 ? sRule += "BYMONTHDAY=3;" : "" ;
      fRecord.rule_day == -4 ? sRule += "BYMONTHDAY=4;" : "" ;
      fRecord.rule_day == -5 ? sRule += "BYMONTHDAY=-1;" + sWeekday + ";" : "" ;
    }
    else
    {
      fRecord.rule_day == -1 ? sRule += "BYDAY=1" + sWeekday + ";" : "" ;
      fRecord.rule_day == -2 ? sRule += "BYDAY=2" + sWeekday + ";" : "" ;
      fRecord.rule_day == -3 ? sRule += "BYDAY=3" + sWeekday + ";" : "" ;
      fRecord.rule_day == -4 ? sRule += "BYDAY=4" + sWeekday + ";" : "" ;
      fRecord.rule_day == -5 ? sRule += "BYDAY=-1" + sWeekday + ";" : "" ;
    }
  }
  if (fRecord.rule_type == "year")
  {
    fRecord.rule_month ?  sRule += "BYMONTH=" + fRecord.rule_month + ";" : "" ;
  }

  //get start day of the week
  var sStartDayNumber = vars["$lo.operator"].first_day;
  var iStartDayNumber = 1; //Monday

  if (sStartDayNumber!=null && sStartDayNumber!="") {
    iStartDayNumber = funcs.val(sStartDayNumber,1);
  }

  var sStartDayText = aDays[iStartDayNumber];
  sRule += "WKST=" + sStartDayText + ";";

  return sRule;
}

function getMaxFutureMonth()
{
  var iFutureMonths = lib.settings.getSettingValue( "Report", "monthOccurrences" );

  if ( !iFutureMonths ) {
    iFutureMonths = 1;
  }

  return _val(iFutureMonths, 1);
}

/**
 *  This function returns a ICal compatible date string
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

function validateArbitraryDates(dStartDate)
{
  if ((!dStartDate)) {
    funcs.msg(_scmsg(31, "reportschedule"),3);

    return false;
  }

  if (dStartDate <= funcs.tod()) {
    funcs.msg(_scmsg(31, "reportschedule"),3);

    return false;
  }

  return true;
}

function manageArbitrary(action)
{
  var objFile = vars["$L.file"];

  if (action=="arbitraryAdd") {
    var dStartDate 	= _val(vars["$rpsch.arb.start"],3);

    // validate start date
    if (validateArbitraryDates(dStartDate)) {
      objFile.rule_arbitrary_start_time = _denull(_insert(objFile.rule_arbitrary_start_time, 0,1, dStartDate));
      vars["$rpsch.arb.start"] 	= null;
    }
  } else if (action == "arbitraryRemove") {
    var fieldname = funcs.cursor_field_name();
    if (fieldname=="rule.arbitrary.start.time") {
      var line = funcs.cursor_line(1);
      var startDatetoDelete = _val(objFile.rule_arbitrary_start_time[line-1],3);

      //don't allow the removal of arbitrary values in the past
      if (startDatetoDelete!= null && startDatetoDelete <= funcs.tod()){
        objFile.rule_arbitrary_start_time 	= funcs._delete(objFile.rule_arbitrary_start_time, line);
      } else {
        objFile.rule_arbitrary_start_time 	= funcs._delete(objFile.rule_arbitrary_start_time, line);
      }
    }
  } else if (action == "arbitraryRemoveAll") {
    var startArray = objFile.rule_arbitrary_start_time.toArray();
    startArray.length = 0;
    objFile.rule_arbitrary_start_time = startArray;
  }
}

