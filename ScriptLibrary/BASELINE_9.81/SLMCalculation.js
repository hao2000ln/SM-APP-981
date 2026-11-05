/******************************************************
* New Duration Type "Business Hours Interval" Calculation
* Author: Neil Yu
* Version: 1.00
* Creation Date: Mar, 2015
*/

var str = funcs.str;
var val = funcs.val;
var settimezone = funcs.set_timezone;
var nullsub = funcs.nullsub;
var tzFunc = lib.tzFunctions;
var doConst = lib.DateOrderConstant;
var $ = lib.c.$;
var dayofweek=  funcs.dayofweek;
var scdsOfFullDay = 86400;

var slmUtils = lib.SLMUtils;

/**
split business interval to business days and business time


**/

function splitBusinessInterval(duration) {

    var sDuration = str(duration);
    var aDuration = sDuration.split(' ');
    if (aDuration.length === 2) {
        return {
            'bizDays': parseInt(aDuration[0], 10),
            'bizTime': aDuration[1]
        };
    } else {
        return {
            'bizDays': 0,
            'bizTime': aDuration[0]
        };

    }

}


/**
 
Convert seconds to general interval


**/
function toInterval(second) {

        return val(second, 3);

    }
    /**

    Convert sm duration to seconds


    **/
function toSecond(interval) {

    var scd = 0;
    var dInterval;
    if ("string" === typeof interval) {
        dInterval = val(interval, 3);
    } else {
        dInterval = interval;
    }
    if (dInterval instanceof Date) {
        scd = val(dInterval, 1);
    }
    return scd;
}

/**
return time zone  record by  time  zone  name

**/
function getTimeZone(tzNm)
{
    var tzRcd = null;
    if (tzNm != "" && tzNm != null) {
        tzRcd = $("tzfile", SCFILE_READONLY).select("name=\"" + tzNm + "\"").uniqueResult();

    }
    return tzRcd;
}

/**
return work schedule record by  work schedule name

**/
function getWorkSchdule(workSchNm) {
    var workSchRcd = null;
    if (workSchNm != "" && workSchNm != null) {
        workSchRcd = $("caldutyhours", SCFILE_READONLY).select("name=\"" + workSchNm + "\"").uniqueResult();
    }
    return workSchRcd;
}


/** 
 * This function gets holiday list against pre-define holiday group in work schedule record
 *
 * @param startDate - start query date for holiday
 * @param endDate - end query date for holiday
 * @param workSchRcd - Work Schedule Record
 *
 * @return holiday list - each element in list includes holiday start date and end date, but end date <= end query date
Start date>= start query date
 */
function getHolidayList(startDate, endDate, workSchRcd) {
    var holidays = getHolidays(workSchRcd);
    var holidays_len = holidays.length;
    var _duration = [];
    var i;
    
    if (holidays_len > 0) {
        var query_duration = [];
        query_duration.push({
            'start': startDate,
            'end': endDate
        });
    
        //convert date string to date
        for (i=0; i<holidays_len; i++) {
            holidays[i]["start"] = tzFunc.convertStringtoDate(holidays[i]["start"]);
            holidays[i]["end"] = tzFunc.convertStringtoDate(holidays[i]["end"]);
        }
        _duration = slmUtils.calcIntersections(query_duration, holidays);
    }

    //combine the duration in case any intersection set exists  
    var duration_len = _duration.length;
    if (duration_len > 1) {
        var duration = [];
        for (i=0; i<duration_len - 1; i++) {
            duration.push(_duration[i]);
            
            duration = slmUtils.calcUnions(duration, _duration[i + 1]);
        }
        return duration;
    }
    else {
        return _duration;
    }
}


/**
Get holiday list against pre-define work schedule

**/
function getHolidays(workSchRcd) {

    var holidays = [];

    if (!workSchRcd["include.holidays"]) {

        if (workSchRcd["holiday.table"] != "" && workSchRcd["holiday.table"] != null) {

            var qry = "holiday.tables=\"" + workSchRcd["holiday.table"] + "\"";

            $("calholidays", SCFILE_READONLY).select(qry).iterate(function(record) {

                if (record["str.start.date"] != null && record["str.end.date"] != null) {

                    holidays.push({
                        "start": record["str.start.date"],
                        "end": record["str.end.date"]
                    });
                }

            });
        }


    }

    return holidays;
}


/** 
 * split a holiday into details
 *
 * @param (array) holiday - a holiday duration with start and end date, e.g. [2015/10/1 08:00:00,2015/10/8 18:00:00]
 *
 * @return - an object includes
 *  1. startDay - a start date array with start time and end time, e.g. [2015/10/1 08:00:00, 2015/10/1 23:59:59]
 *  2. endDay - an end date array with start time and end time, e.g. [2015/10/8 00:00:00, 2015/10/8 18:00:00]
 *  3. days - interval of days during the holiday, e.g. 6
 */
function splitHoliday(holiday) {
    var startDate = new Date(holiday[0].getTime());
    var endDate = new Date(holiday[1].getTime());
    var time_diff = endDate.setHours(0,0,0,0) - startDate.setHours(0,0,0,0);
    time_diff = Math.floor(time_diff / 1000 / 60 / 60 / 24);

    if (time_diff === 0) {
        return {
            "startDay": [holiday[0]],
            "endDay": [holiday[1]],
            "days": 0
        };
    }
    else {
        return {
            "startDay": [holiday[0], new Date(startDate.setHours(23,59,59,999))],
            "endDay": [new Date(endDate.setHours(0,0,0,0)), holiday[1]],
            "days": time_diff - 1
        };
    }
}


/**
how many business days in a week agaist work schedule


**/
function getNumberOfBusinessDaysByWeek(workSchRcd) {
    var interval = 0;
    var ttlDays = 0;
    var i = 1;

    for (i; i <= 7; i++) {

        interval = getBusinessHoursByDay(workSchRcd, i);
        if (interval != 0) {
            ttlDays++;
        }
    }
    return ttlDays;

}

/**
how seconds against  pre-define business interval  and  work schedule

**/
function calBusinessDaysInterval(sDate,sDay,bizDays, workSchRcd, holiday, tz) {



    var bizHoursInterval = 0;

    var interval = 0;
    var iDay = 0; // calendar day
    var jDay = 0; // business day
    var bizDaysbyWeek = getNumberOfBusinessDaysByWeek(workSchRcd);
    var weeks = Math.floor(bizDays / bizDaysbyWeek);
    var remainBizDays = bizDays % bizDaysbyWeek;

    if (weeks > 0) {

        bizHoursInterval += weeks * getBusinessHoursByWeek(workSchRcd);

    }

    while (jDay < remainBizDays) {

        curDay = (sDay + iDay) % 7 === 0 ? 7 : (sDay + iDay) % 7;

        iDay++;

        interval = getBusinessHoursByDay(workSchRcd, curDay);

        if (interval != 0) {

            bizHoursInterval += interval;
            jDay++;

        }

    }
    return bizHoursInterval;


}

/**

Get business duration by  day of week

**/

function getBusinessHoursByDay(workSchRcd, dayOfWeek) {

    return toSecond(workSchRcd["duration." + dayOfWeek]);

}


/**

Get business duration in a week

**/

function getBusinessHoursByWeek(workSchRcd) {

    return toSecond(workSchRcd["weekly.duration"]);

}

/**

Get start time and end time  for current business day    

**/
function getBusinessDayTime(curDT, workSch) {

    var day = curDT.getDay() + 1;

    var y = curDT.getFullYear();
    var m = curDT.getMonth();
    var d = curDT.getDate();

    var bHour = "begin.hour." + day;
    var eHour = "end.hour." + day;

    var startOfBizDay = toDate(y, m, d, workSch[bHour].getUTCHours(), workSch[bHour].getUTCMinutes(), workSch[bHour].getUTCSeconds());
    var endOfBizDay = toDate(y, m, d, workSch[eHour].getUTCHours(), workSch[eHour].getUTCMinutes(), workSch[eHour].getUTCSeconds());


    return [startOfBizDay, endOfBizDay];

}


/**

Get start time and end time  for current calendar day    

**/

function getDayTime(curDT) {


    var y = curDT.getFullYear();
    var m = curDT.getMonth();
    var d = curDT.getDate();

    var startOfDay = toDate(y, m, d, 0, 0, 0);
    var endOfDay = toDate(y, m, d, 23, 59, 59);


    return [startOfDay, endOfDay];


}


/**

 current time  belong to which time period
 
 0-current time >= start of business day and current time < end of business day
 1-current time >= start of business day and start time < end of business day
 2-current time = end of business day
 3-current time >= end of business day and current time < end of  day
 -1- exception value

**/
function compare(curDT, workSch) {

    var bizDay = getBusinessDayTime(curDT, workSch);

    var day = getDayTime(curDT);

    if (day[0].getTime() <= curDT.getTime() && curDT.getTime() < bizDay[0].getTime()) {
        return 0;
    } else if (curDT.getTime() >= bizDay[0].getTime() && curDT.getTime() < bizDay[1].getTime()) {
        return 1;
    } else if (curDT.getTime() === bizDay[1].getTime()) {
        return 2;
    } else if (curDT.getTime() > bizDay[1].getTime() && curDT.getTime() <= day[1].getTime()) {
        return 3;
    } else {
        return -1;
    }



}

function calBusinessHoursInterval(duration) {


    return toSecond(duration);

}

function calBusinessInterval(startDT, duration, workSchNm, holiday, tz) {

    var workSchRcd = getWorkSchdule(workSchNm);
    var switchTZFlag = false;
    var interval = val('00:00:00', 3);
    var tzRcd = null;

    if (tz != null && tz != "" && tz != vars['$lo.time.zone']) {
        tzRcd = getTimeZone(tz);
        tzRcd["date.order"] = nullsub(vars['$lo.date.order'], tzRcd["date.order"]);
        settimezone(tzRcd);
        switchTZFlag = true;
    }
    try {
        if (workSchRcd != null) {
         

            var sDay = (dayofweek(startDT)+1)%7;


            var d = splitBusinessInterval(duration);

            var dSecond = calBusinessDaysInterval(startDT,sDay,d["bizDays"], workSchRcd, holiday, tz);

            var tSecond = calBusinessHoursInterval(d["bizTime"]);

            interval = toInterval(dSecond + tSecond);
        } else {



            interval = duration;


        }
    } catch (e) {

        print(e.toString());

    } finally {

        if (switchTZFlag) {

            tzRcd = getTimeZone(vars['$lo.time.zone']);
            tzRcd["date.order"] = nullsub(vars['$lo.date.order'], tzRcd["date.order"]);
            settimezone(tzRcd);

        }

    }

    return interval;

}


/*
 * the Value of End of Window is valid or not
 */

function isValidEndofDayWindow(duration) {
    var s = toSecond(duration);
    if (s < scdsOfFullDay && s >= 0) {  
        return true;
    } 
    return false;
}

function toDate(year, month, date, hours, mins, scds) {

    return new Date(year, month, date, hours, mins, scds, 0);

}

/**
* main entry to get required time frame set with assignment groups.
* @param  {SCFile} record         $L.file
* @param  {SCFile} slmControl     $L.control
* @param  {SCFile} sla            $L.sla
* @param  {SCFile} slo            $L.slo
* @param  {SCFile} sloresponse    $L.sloresponse
* @param  {SCDatum} startTimes    $L.start: {}
* @param  {SCDatum} endTimes      $L.end: {}
* @param  {SCDatum} groups        $L.groups: {}
* @param  {SCDatum} groupCalendars $L.group.calendars: {}
* @param  {SCDatum} groupTZs       $L.group.timezones: {}
* @param  {SCDatum} re_startTimes  {}
* @param  {SCDatum} re_endTimes    {}
* @return {[type]}  null             [description]
*/
var TOD=funcs.tod();
function intersectionWithAssignment(record, slmControl, sla, slo, sloresponse, startTimes, endTimes, groups, groupCalendars, groupTZs, re_startTimes, re_endTimes, currentTime){
    

    var _ = lib.Underscore.require();
    TOD = currentTime? currentTime:TOD;
    var newTimeFrameSet;
    var slaGroups=[];
    
    if(sla["category"] === "ola") {
        slaGroups= _.uniq(_.compact(sla["support.groups"].toArray()));
    }
    else if(sla["category"] === "uc") {
        slaGroups= _.uniq(_.compact(sla["external.support.groups"].toArray()));
    }
     
    var timeFrameType = slo.duration_method;
    
    var currentGroup = record[nullsub(slmControl["group.field"],"assignment")];
    if(8==funcs.type(currentGroup)) {
        currentGroup = currentGroup[0];
    }
    
    var fileName = sloresponse["foreign.filename"];
    var recordId = sloresponse["foreign.key"];

    //transform timeframe set arrays to timeframe set object array
    var timeFrameSet = calcAssignmentDurations(startTimes, endTimes);

    //dispatch to different algorithm
    if(timeFrameType === "initial" || timeFrameType === null || timeFrameType === ""){
        newTimeFrameSet = intersectionWithInitial(fileName, recordId, slaGroups, timeFrameSet);
    }
    else if(timeFrameType === "first"){
        newTimeFrameSet = intersectionWithFirst(fileName, recordId, currentGroup, timeFrameSet);
    }
    else if(timeFrameType === "current"){
        newTimeFrameSet = intersectionWithCurrent(fileName, recordId, currentGroup, timeFrameSet);
    } 

    //transform timeframe set object array to return arrays
    calcArraysFromDurations(newTimeFrameSet, re_startTimes, re_endTimes, groups, groupCalendars, groupTZs);
}


/**
 * get the timezone and calendar from group
 * @param  {String} group group name
 * @return {Array}       calendar and time zone
 */
function getCalendarTzFromAssignment(group) {
    var assignmentGroup = $("assignment", SCFILE_READONLY).setFields(["calendar.name","time.zone"]).select('name="' + group + '"').uniqueResult();

    if (assignmentGroup) {
        var re_array = [];
        re_array[0] = assignmentGroup["calendar.name"];
        re_array[1] = assignmentGroup["time.zone"];

        return re_array;
    } else {
        return [null, null];
    }
}

/**
 * This function is used to...
 * 1. get the intersection sets of all assignment group timeframe sets with passed in timeframe set.
 * 2. get the union set of all the intersection sets.
 * 3. get corresponding properties(groupName, groupTimeZone, groupCalendar) of each timeframe object.
 * return data structure of each timeframe object...
 * {
 *     start:Date,
 *     end:Date,
 *     group:String,
 *     timeZone:String,
 *     calendar:String
 * }
 * @param  {String} fileName file name of current reord
 * @param  {String} recordId id of current record
 * @param  {Array} slaGroups    all assignment group names of the OLA/UC definition
 * @param  {Array} timeFrameSet all timeframe set object which is to be intersected with
 * @return {Array}              intersected and unioned timeframe set result
 */
function intersectionWithInitial(fileName, recordId, slaGroups, timeFrameSet){
    var i;
    var group;
    var durations, tempIntersections;
    var intersections = [];
    for (i = 0; i < slaGroups.length; i++) {
        group = slaGroups[i];
        durations = getInitialTimeFrameSetForGroup(fileName, recordId, group);
        tempIntersections = lib.SLMUtils.calcIntersections(durations, timeFrameSet, true);
        setTZInfo(tempIntersections, group);
        intersections = lib.SLMUtils.mergeDurations(intersections, tempIntersections);
    }
    
    return intersections;
}

/**
 * This function is used to...
 * 1. get the intersection set of current assignment group timeframe set with passed in timeframe set.
 * 2. get corresponding properties(groupName, groupTimeZone, groupCalendar) of each timeframe object.
 * return data structure of each timeframe object...
 * {
 *     start:Date,
 *     end:Date,
 *     group:String,
 *     timeZone:String,
 *     calendar:String
 * }
 * @param  {String} fileName file name of current reord
 * @param  {String} recordId id of current record
 * @param  {String} currentGroup current assignment group name
 * @param  {Array} timeFrameSet all timeframe set object which is to be intersected with
 * @return {Array}              intersected timeframe set result
 */
function intersectionWithFirst(fileName, recordId, currentGroup, timeFrameSet){
    return intersectionWithInitial(fileName, recordId, [currentGroup], timeFrameSet);
}


/**
 * This function is used to...
 * 1. get intersection set of current assignment group from last assignment start with passed in timeframe set.
 * 2. get corresponding properties(groupName, groupTimeZone, groupCalendar) of each timeframe object.
 * return data structure of each timeframe object...
 * {
 *     start:Date,
 *     end:Date,
 *     group:String,
 *     timeZone:String,
 *     calendar:string
 * }
 * @param  {String} fileName file name of current reord
 * @param  {String} recordId id of current record
 * @param  {String} currentGroup current assignment group name
 * @param  {Array}  timeFrameSet all timeframe set object which is to be intersected with
 * @return {Array}              intersected timeframe set result
 */
function intersectionWithCurrent(fileName, recordId, currentGroup, timeFrameSet){
    var newTimeFrameSet = [];
    
    var durations = getInitialTimeFrameSetForGroup(fileName, recordId, currentGroup);
    if(durations.length > 0){
        var lastDuration = [durations[durations.length - 1]];
        var intersections = lib.SLMUtils.calcIntersections(lastDuration, timeFrameSet, true);
        setTZInfo(intersections, currentGroup);
        newTimeFrameSet = lib.SLMUtils.mergeDurations(newTimeFrameSet, intersections);
        return newTimeFrameSet;
        
    }
    return newTimeFrameSet;
}

/**
 * get Initial TimeFrameSet For Group
 * @param  {string} fileName file name
 * @param  {string} recordId record id
 * @param  {string} group    group
 * @return {Array}          time from set
 */
function getInitialTimeFrameSetForGroup(fileName, recordId, group) {
    // get from and to times
    var toTimes = getAssignmentTimes('to', fileName, recordId, group);
    var fromTimes = getAssignmentTimes('from', fileName, recordId, group);
    var durations = calcAssignmentDurations(toTimes, fromTimes);
    
    return durations;
}

/**
 * calculate assignment durations based on to times and from times from assignmentlog
 * @param  {Array} toTimes assignment time for to.group
 * @param  {Array} fromTimes assignment time for from.group
 * @return {Array} duration array
 */
function calcAssignmentDurations(toTimes, fromTimes) {
    var durations = [];
    var i, j;
    var toTimelng = lib.ArrayUtil.length(toTimes);
    var fromTimelng = lib.ArrayUtil.length(fromTimes);
    var start, end;
    for (i = 0; i < toTimelng; i++) {
        start = toTimes[i];
        if (fromTimes[i]) {
            end = fromTimes[i];
        } else {
            end = TOD;
        }
        durations.push({
            'start': start,
            'end': end
        });
    }

    return durations;
}

/**
 * calculate to times and from times from assignment durations
 * @param  {Array} duration array
 * @param  {Array} startTimes array
 * @param  {Array} endTimes array
 * @param  {Array} groups array
 * @param  {Array} calendars array
 * @param  {Array} tzs array
 * @return {void}
 */
function calcArraysFromDurations(durations, startTimes, endTimes, groups, calendars, tzs) {
    var i;
    var duration;
    for (i = 0; i < durations.length; i++) {
        duration = durations[i];
        startTimes.push(duration.start);
        endTimes.push(duration.end);
        groups.push(duration.group);
        calendars.push(duration.calendar);
        tzs.push(duration.timeZone);
    }
}


/**
 * get from or to times For Group
 * @param  {string} fromto 'from' or 'to'
 * @param  {string} fileName file name
 * @param  {string} recordId record id
 * @param  {string} group    group
 * @return {Array}          time from set
 */
function getAssignmentTimes(fromto, fileName, recordId, group) {
    var assignmentlog = new SCFile('assignmentlog', SCFILE_READONLY);
    assignmentlog.setFields(['change.time']);

    var times = [];
    var sql = fromto + '.value=\"' + lib.StringUtil.escapeAllStr(group) + '\" and foreign.key=\"' + recordId + '\" and foreign.filename=\"' + fileName + '\"';

    assignmentlog.setOrderBy(['id'], [SCFILE_ASC]);
    var rc = assignmentlog.doSelect(sql);
    while (rc == RC_SUCCESS) {
        times.push(assignmentlog['change.time']);
        rc = assignmentlog.getNext();
    }
    
    return times;
}

function getLatestAssignTime(fileName, recordId)
{
    var assignmentlog = new SCFile('assignmentlog', SCFILE_READONLY);
    assignmentlog.setFields(['change.time']);
    assignmentlog.setOrderBy(['id'], [SCFILE_DSC]);

    var sql = 'foreign.key=\"' + recordId + '\" and foreign.filename=\"' + fileName + '\"';
    var rc = assignmentlog.doSelect(sql);
    if (rc == RC_SUCCESS) {
        return assignmentlog['change.time'];
    }

    return null;
}


/**
 * set timezone and calendar info into timeframe set
 * @param  {Array} timeframe array
 * @param  {string} group name
 * @return {void} 
 */
function setTZInfo(intersections, group) {
    var info = getCalendarTzFromAssignment(group);
    for (i = 0; i < intersections.length; i++) {
        var intersection = intersections[i];
        intersection['calendar'] = info[0];
        intersection['timeZone'] = info[1];
        intersection['group'] = group;
    }
}


/**
 * called by trigger, this function is used to check if assignment has changed and need to log to somewhere
 * @param  {SCFile} record    $L.file
 * @param  {SCFile} oldRecord $L.file.save
 * @return {[type]}           [description]
 */
function logAssignmentChange(record, oldRecord){
    
    var fileName = funcs.filename(record);
    var object = $("Object", SCFILE_READONLY).select('file.name="' + fileName + '"').uniqueResult();
    if(object){
        if(funcs.lng(object.workgroupFields) > 0 && object.workgroupFields[0] != null){
            var groupField = object.workgroupFields[0];
            var rc = logAssignment(groupField, record, oldRecord);
        }
    }

}

function toStringGroup(group){
    if(funcs.type(group)==8){
        if(lib.ArrayUtil.length(funcs.denull(group))>0) {
            group = group[0];
        } else {
            group = 'null';
        }
    }
    
    return group;
}

/**
* this function is used log re-assignment
* @param  {String} groupField  field name
* @param  {SCFile} record      $L.file
* @param  {SCFile} savedRecord $L.file.save
* @return {[type]}             [description]
*/
function logAssignment(groupField, record, savedRecord){
    
    if(!record[groupField] && !savedRecord[groupField]) {
        return null;
    }

    //get basic data of this record
    var currentGroup1 = nullsub(record[groupField],"null");
    var oldGroup1 = nullsub(savedRecord[groupField],"null");
    var currentGroup = toStringGroup(currentGroup1);
    var oldGroup = toStringGroup(oldGroup1);
    
    var uniqIDs = new SCDatum();
    var successflg =  new SCDatum();
    var rteReturnValue = new SCDatum();
    try{
        successflg = funcs.rtecall("getunique", rteReturnValue, uniqIDs, record);
    }catch(e){
        return -1;
    }
    var id = uniqIDs[0];
    var fileName = funcs.filename(record);

    //check if this assignment change already logged
    var okToLog = validateAssignmentLog(id, fileName, oldGroup, currentGroup);

    //do the log
    if(okToLog && currentGroup != oldGroup){
        
        var assignmentlog = new SCFile("assignmentlog");
        var rteNumber = new SCDatum();
        var now = funcs.tod();

        try{
            successflg = funcs.rtecall("getnumber",rteReturnValue,rteNumber,"assignmentlog",null);
        }catch(e){
            return -1;
        }
        
        assignmentlog["id"] = rteNumber;
        assignmentlog["foreign.key"] = id;
        assignmentlog["foreign.filename"] = fileName;
        assignmentlog["from.value"] = oldGroup;
        assignmentlog["to.value"] = currentGroup;
        assignmentlog["change.time"] = now;

        var rc = assignmentlog.doInsert();
        return (rc==RC_SUCCESS)?{rc_code:rc,id:rteNumber}:{rc_code:rc,id:null};
    }
    else {
        return null;
    }
}

/**
 * check if the latest assginment log is identical to the arguments
 * @param  {String} id       id of $L.file
 * @param  {String} fileName filename
 * @param  {String} from     old group name
 * @param  {String} to       new group name
 * @return {boolean}          if it`s ok to log this assignment change
 */
function validateAssignmentLog(id, fileName, from, to){
    var re_boolean = true;
    var assignmentlog = new SCFile("assignmentlog", SCFILE_READONLY);
    assignmentlog.setFields(['from.value','to.value']);
    assignmentlog.setOrderBy(['id'], [SCFILE_DSC]);
    var query = 'foreign.key="' + id + '" and foreign.filename="' + fileName + '"';

    if(assignmentlog.doSelect(query) === RC_SUCCESS){
        if(assignmentlog['to.value'] === to) {
            re_boolean = false;
        }
    }
    
    return re_boolean;
}

/**
 * log sloresponse to sloresponsehist table
 * @param  {SCFile} SLOResponse $L.sloresponse
 * @param  {SCFile} record      $L.file
 * @param  {SCFile} slmControl  $L.control
 * @param  {SCFile} slo         $L.slo
 * @param  {Datetime} duration         $L.duration
 * @return {[type]}             [description]
 */
function logSLOResponse(SLOResponse, record, slmControl, slo, duration){

    var moduleControl = $("slacontrol", SCFILE_READONLY).select('true').uniqueResult();
    if(!moduleControl) {
        return null;
    }
    if(!nullsub(moduleControl['log.response'],false)) {
        return null;
    }

    //do the logging
    var recordcopy = funcs.recordcopy;

    var fieldsToCopy = ["active", "agreement.category", "agreement.id", "breached", 
                        "current.status", "end.time", "expiration.time", "final.state", 
                        "foreign.filename", "foreign.key", "initial.state", "running", 
                        "slo.id", "slo.name", "start.time", "suspended", "total.time"];

    var currentGroup = record[nullsub(slmControl["group.field"],"assignment")];
    if(8==funcs.type(currentGroup)) {
        currentGroup = currentGroup[0];
    }
    
    var sloresponsehist = new SCFile("sloresponsehist");
    var successflg =  new SCDatum();
    var rteReturnValue = new SCDatum();
    var rteNumber = new SCDatum();
    try{
            successflg = funcs.rtecall("getnumber",rteReturnValue,rteNumber,"sloresponsehist",null);
            successflg = recordcopy(SLOResponse, fieldsToCopy, sloresponsehist, fieldsToCopy);
        }catch(e){
            return -1;
        }

    sloresponsehist["id"] = rteNumber;
    sloresponsehist["assignment"] = currentGroup;
    sloresponsehist["total.time"] = duration;

    var rc = sloresponsehist.doInsert();
    return rc;
}

/* This function get invalid business hours in a business day
* @param  {String} workSchRcd Work Schedule Record
* @param  {String} dayofWeek   any day of one week from 1 to 7
* @param  {Array} dayofHoliday  any day of the whole holiday  eg, from  08:00:00 to 23:59:59
* @return {int} total invalid business seconds in a business day
*/
function  getInvalidBusinessHoursByDay(workSchRcd, dayOfWeek, dayOfHoliday) {
    if (dayOfHoliday.length == 0) {
        return 0;
    }
    var holiday = dayOfHoliday[0];
        
    return _getInvalidBusinessHoursByDay(workSchRcd, dayOfWeek, dayOfHoliday, holiday);
}

/* This function get invalid business hours in a business day
* @param  {String} workSchRcd Work Schedule Record
* @param  {String} dayofWeek   any day of one week from 1 to 7
* @param  {Array} dayofHoliday  any day of the whole holiday  eg, from  08:00:00 to 23:59:59
* @param  {Date} date  day in the holiday
* @return {int} total invalid business seconds in a business day
*/
function  _getInvalidBusinessHoursByDay(workSchRcd, dayOfWeek, dayOfHoliday, date) {
    
    var y = date.getFullYear(), 
        m = date.getMonth(), 
        d = date.getDate();
    
    var workDurations = calcWorkDurations(workSchRcd, dayOfWeek, y, m, d);
    var invalidDurations = lib.SLMUtils.calcIntersections(workDurations, dayOfHoliday);
    
    // calculate hours
    var i, duration;
    var seconds = 0;
    for (i = 0; i < invalidDurations.length; i++) {
        duration = invalidDurations[i];
        seconds += Math.ceil((duration.end - duration.start)/1000);
    }
    
    return seconds;
}

/* This function gets Invalid business hours during the whole holiday
* @param  {String} workSchRcd Work Schedule Record
* @param  {Array} holidays         any holiday from holiday list
* @return {Array} total invalid business seconds and total invalid business days in the whole holiday
*/
function getInvalidBussinessHoursByHolidays(workSchRcd, holidays) {
    var tempHolidays = lib.SLMUtils.sortDurations(holidays);
    tempHolidays = lib.SLMUtils.unionDurations(tempHolidays);
    
    var days = lib.SLMUtils.getDays(tempHolidays);
    
    var i, day;
    var date;
    var seconds = 0;
    var buzDays = 0;
    for (i = 0; i < days.length; i++) {
        date = days[i]; 
        day = date.getDay();
        if (day == 0) {
            day = 7;
        }
        
        var invalidSeconds = _getInvalidBusinessHoursByDay(workSchRcd, day, tempHolidays, date);
        var workSeconds = Math.ceil((workSchRcd['duration.' + day].getTime() - funcs.val('00:00:00', 3).getTime())/1000);
        if ((workSeconds - invalidSeconds) <= 1) {
            buzDays++;
        } else {
            seconds += invalidSeconds;
        }
    }
    
    return [seconds, buzDays];
}



/* This function get work durations in a business day
* @param  {String} workSchRcd Work Schedule Record
* @param  {String} dayofWeek   any day of one week from 1 to 7
* @return {Array} array of work durations in a business day
*/
function calcWorkDurations(workSchRcd, dayOfWeek, year, month, date) {
    var start = new Date(year, month, date, 0, 0, 0, 0);

    if (workSchRcd['full.day.' + dayOfWeek] == true) {
        return [start, new Date(year, month, date, 23, 59, 59, 999)];
    }
    
    var timesArr = funcs.str(workSchRcd['begin.hour.' + dayOfWeek]).split(":");
    var workStart = new Date(year, month, date, timesArr[0], timesArr[1], timesArr[2]);
    
    timesArr = funcs.str(workSchRcd['end.hour.' + dayOfWeek]).split(":");
    var workEnd = new Date(year, month, date, timesArr[0], timesArr[1], timesArr[2]);
    
    timesArr = funcs.str(workSchRcd['break.start.' + dayOfWeek]).split(":");
    var breakStart = new Date(year, month, date, timesArr[0], timesArr[1], timesArr[2]);
    
    timesArr = funcs.str(workSchRcd['break.end.' + dayOfWeek]).split(":");
    var breakEnd = new Date(year, month, date, timesArr[0], timesArr[1], timesArr[2]);
    
    return lib.SLMUtils.excludeDuration({'start': workStart, 'end': workEnd}, {'start': breakStart, 'end': breakEnd});
}