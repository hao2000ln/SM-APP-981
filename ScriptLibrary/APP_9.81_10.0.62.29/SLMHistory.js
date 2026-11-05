var $ = lib.c.$;
var _ = lib.Underscore.require();
var log = getLog("SLMHistory");

var nullsub = funcs.nullsub;

var CLASS_NAME = 'report';
var DELAY_TIME = 120000; // Delay time for slo, 2 minutes 2*60*1000


function scheduleTotalTimeCaculation(name, sloResponse, slaActive, expiration, type) {

    var schedule = new SCFile("schedule");
    schedule["name"] = name;
    schedule["javascript"] = "lib.SLMHistory.callTotalTimeCaculation()";
    schedule["strings"][0] = sloResponse.getXML().toXMLString();
    schedule["strings"][1] = slaActive.getXML().toXMLString();

    schedule["strings"][2] = vars['$G.timezone'].name;
    schedule["strings"][3] = vars['$lo.date.order'];

    schedule["class"] = type || "report";
    schedule["expiration"] = expiration;
    schedule.doInsert();

    lib.SLMVisualize.updateRespTime(sloResponse);
}

function setTimeZone(name, dateOrder) {
    var tz = $('tzfile').select("name=\"" + name + "\"").uniqueResult();
    tz['date.order'] = Number(dateOrder);
    funcs.set_timezone(tz);
}

function callTotalTimeCaculation() {

    var sloResponse = new SCFile("sloresponse");
    var slaActive = new SCFile("slaactive");

    var timezoneChanged = false;
    var oldTimeZone = vars['$G.timezone'].name;
    var oldDateOrder = vars['$lo.date.order'];

    var newTimeZone = vars.$L_schedule["strings"][2];
    var newDateOrder = vars.$L_schedule["strings"][3];
    if (newTimeZone && newDateOrder) {
        if (oldTimeZone != newTimeZone || oldDateOrder != newDateOrder) {
            timezoneChanged = true;
            setTimeZone(newTimeZone, newDateOrder);
        }
    }

    sloResponse.setRecord(vars.$L_schedule["strings"][0]);
    slaActive.setRecord(vars.$L_schedule["strings"][1]);

    if (timezoneChanged) {
        setTimeZone(oldTimeZone, oldDateOrder);
    }

    calculateHistory(sloResponse, slaActive);
}

function calculateHistory(sloResponse, slaActive) {

    var moduleControl = $("slacontrol", SCFILE_READONLY).select('true').uniqueResult();
    if (!moduleControl) {
        return null;
    }
    if (!nullsub(moduleControl['log.response'], false)) {
        return null;
    }

    if (!sloResponse || !slaActive) {
        return null;
    }

    var TOD = funcs.tod();
    var start = [];
    var end = [];
    var groups = [];
    var groupCalendars = [];
    var groupTimezones = [];
    var agreementCategory = sloResponse.agreement_category;
    var suspendedStart = [];
    var suspendedEnd = [];
    var statProgression = [];
    var sloInitIndex = 0;
    var sloFinIndex = 0;
    var sloSuspendStates = [];
    var sloValidStates = [];

    //get SLO record from slo response
    var sloQuery = 'slo.id=' + sloResponse["slo.id"];
    var slo = $("slo").select(sloQuery).uniqueResult();

    //get Module control
    var slmControl = $("slamodulecontrol").select('table.name="' + sloResponse.foreign_filename + '"').uniqueResult();
    if (!slmControl) {
        return null;
    }
    if (!slmControl['status.progression']) {
        return null;
    }

    // get expiration time
    var expirationTime = sloResponse["expiration.time"];

    // get reassign time
    var fileName = sloResponse["foreign.filename"];
    var recordId = sloResponse["foreign.key"];

    var latestReassignTime = lib.SLMCalculation.getLatestAssignTime(fileName, recordId);

    //get SLA
    var slaQuery = 'agreement.id="' + sloResponse.agreement_id + '"';
    var sla = $('sla').select(slaQuery).uniqueResult();

    //prepare the data for calculation
    if (slmControl['use.phases']) {
        statProgression = getPhaseList(fileName, recordId);
    } else {
        //prepare the data for calculation
        statProgression = _.compact(slmControl['status.progression'].toArray()); //$L.stat.progression=denull(nullsub(status.progression in $L.control, {}))
    }

    if (statProgression.length === 0) {
        return null;
    }

    if (slo != null) {
        sloSuspendStates = _.compact(slo.suspend_states.toArray());
        sloInitIndex = _.indexOf(statProgression, slo.initial_state); //$L.slo.init.index=index($L.slo.init.state, $L.stat.progression)
        sloFinIndex = _.indexOf(statProgression, slo.final_state); //$L.slo.final.index=index($L.slo.fin.state, $L.stat.progression)
    }

    //get valid state progression of this slo from statProgression list
    sloValidStates = statProgression.slice(sloInitIndex, sloFinIndex + 1);

    //get the time arrays of: start and end, suspend start. suspend end.
    var lng = funcs.lng(funcs.denull(slaActive.state_change)) || 0;
    var preIsNotTakenAsCalState = false;
    var preIsFinalState = false;
    var preIsSuspendState = false;
    var preState;

    var maxStartTime = slaActive.start_time;
    var minEndTime = slaActive.end_time;

    if (!maxStartTime) {
        maxStartTime = slaActive.state_change[0].time;
    }

    if (!minEndTime) {
        var lastState = slaActive.state_change[lng - 1].state;

        var lastIndex = _.indexOf(statProgression, lastState);
        if (lastIndex < sloFinIndex) {
            minEndTime = TOD;
        } else {
            minEndTime = slaActive.state_change[lng - 1].time;
        }
    }

    var i;
    for (i = 0; i < lng; i++) {
        var state = slaActive.state_change[i].state;
        if (i > 0) {
            preState = slaActive.state_change[i - 1].state;
        }
        var curIndex = _.indexOf(statProgression, state);
        var preIndex = _.indexOf(statProgression, preState);
        if (sloInitIndex > curIndex || curIndex >= sloFinIndex || !_.contains(sloValidStates, state)) {
            continue;
        }
        if (sloInitIndex > preIndex || !_.contains(sloValidStates, preState)) {
            preIsNotTakenAsCalState = true;
        }
        if (preIndex >= sloFinIndex) {
            preIsFinalState = true;
        }
        if (_.contains(sloValidStates, preState) && _.contains(sloSuspendStates, preState)) {
            preIsSuspendState = true;
        }
        var startTime = slaActive.state_change[i].time;
        var endTime = slaActive.state_change[i + 1].time;
        var tmpEndTime;

        // preIsNotTakenAsCalState that is previous state is not taken as calculation state
        // preIsFinalState that is previous state is final state
        // preIsSuspendState that is previous state is suspend state
        if (expirationTime != null && latestReassignTime != null) {
            if ((preIsFinalState || preIsNotTakenAsCalState || preIsSuspendState) && endTime == null && TOD.getTime() < expirationTime.getTime() && expirationTime.getTime() > startTime.getTime() && startTime.getTime() > latestReassignTime.getTime()) {
                break;
            }
            if (_.contains(sloValidStates, state) && !_.contains(sloSuspendStates, state)) {
                if (TOD.getTime() > expirationTime.getTime()) {
                    tmpEndTime = TOD;
                } else {
                    tmpEndTime = latestReassignTime;
                }

                endTime = endTime || tmpEndTime;
                if (endTime >= maxStartTime && startTime < minEndTime) {
                    start.push(maxDate(startTime, maxStartTime));
                    end.push(minDate(endTime, minEndTime));
                }
            }
        } else if (expirationTime == null && latestReassignTime != null) {
            if ((preIsFinalState || preIsNotTakenAsCalState || preIsSuspendState) && endTime == null && startTime.getTime() > latestReassignTime.getTime()) {
                break;
            }

            if (_.contains(sloValidStates, state) && !_.contains(sloSuspendStates, state)) {
                if (TOD.getTime() > latestReassignTime.getTime()) {
                    tmpEndTime = TOD;
                } else {
                    tmpEndTime = latestReassignTime;
                }
                endTime = endTime || tmpEndTime;
                if (endTime >= maxStartTime && startTime < minEndTime) {
                    start.push(maxDate(startTime, maxStartTime));
                    end.push(minDate(endTime, minEndTime));
                }
            }
        } else {
            if ((preIsFinalState || preIsNotTakenAsCalState || preIsSuspendState) && endTime == null) {
                break;
            }
            if (_.contains(sloValidStates, state) && !_.contains(sloSuspendStates, state)) {
                endTime = endTime || TOD;

                if (endTime >= maxStartTime && startTime < minEndTime) {
                    start.push(maxDate(startTime, maxStartTime));
                    end.push(minDate(endTime, minEndTime));
                }
            }
        }
        if (_.contains(sloValidStates, state) && _.contains(sloSuspendStates, state)) {
            suspendedStart.push(startTime);
            suspendedEnd.push(endTime || TOD);
        }
    }

    //Calculate the elapsed time
    //fake record
    var record = {};
    record[nullsub(slmControl["group.field"], "assignment")] = funcs.str(sloResponse.group);

    var totalInterval;

    //Calculate sla elapsed time
    if (agreementCategory === "sla") {
        //for sla we don`t log assignment group info to history, so set it to null;
        record[nullsub(slmControl["group.field"], "assignment")] = null;

        totalInterval = calcInterval(
            start, end,
            null, null, null,
            sloResponse,
            null, null);

        //set sloresopnse start and end time and total
        sloResponse['start.time'] = start[0];
        sloResponse['end.time'] = end[end.length - 1];
        sloResponse['total.time'] = totalInterval;
        sloResponse['start.time'] = sloResponse['start.time'] || maxStartTime;
        sloResponse['end.time'] = sloResponse['end.time'] || minEndTime;

        //purge and insert sloresopnse history record
        logSloResponseHist(sloResponse, record, slmControl, slo, null);

    } else if (agreementCategory === "ola" || agreementCategory === "uc") {
        //Calculate ola/uc elapsed time
        //intersection result
        var newStart = [];
        var newEnd = [];
        groups = [];
        groupCalendars = [];
        groupTimezones = [];

        lib.SLMCalculation.intersectionWithAssignment(
            record, slmControl, sla, slo, sloResponse,
            start, end,
            groups,
            groupCalendars,
            groupTimezones,
            newStart,
            newEnd,
            TOD);

        totalInterval = calcInterval(
            newStart, newEnd,
            groups, groupCalendars, groupTimezones,
            sloResponse,
            slo['schedule.type'], slo['tz.type']);

        //total.time.group: do the intersection for current group
        //intersction result
        var currentGroup_newStart = [];
        var currentGroup_newEnd = [];
        var currentGroup_groups = [];
        var currentGroup_groupCalendars = [];
        var currentGroup_groupTimezones = [];

        var fake_slo = {
            duration_method: "first"
        };

        lib.SLMCalculation.intersectionWithAssignment(
            record, slmControl, sla, fake_slo, sloResponse,
            start, end,
            currentGroup_groups,
            currentGroup_groupCalendars,
            currentGroup_groupTimezones,
            currentGroup_newStart,
            currentGroup_newEnd,
            TOD);

        var currentGroup_totalInterval = calcInterval(
            currentGroup_newStart, currentGroup_newEnd,
            currentGroup_groups, currentGroup_groupCalendars, currentGroup_groupTimezones,
            sloResponse,
            "group", "group"); //use group calendar and timezone here? 

        //set sloresopnse start and end time and total
        sloResponse['total.time'] = totalInterval;
        sloResponse['start.time'] = newStart[0];
        sloResponse['start.time'] = newStart[0] || maxStartTime;

        if (preIsFinalState) {
            sloResponse['end.time'] = newEnd[newEnd.length - 1];
            sloResponse['end.time'] = sloResponse['end.time'] || minEndTime;
        }

        //purge and insert sloresopnse history record
        logSloResponseHist(sloResponse, record, slmControl, slo, currentGroup_totalInterval);
    }

}


function logSloResponseHist(sloResponse, record, slmControl, slo, duration) {
    //do the purge
    var recordList = new SCFile("sloresponsehist");
    var category = sloResponse.agreement_category;
    var query = "foreign.key=\"" + sloResponse.foreign_key + "\" and slo.id=\"" + sloResponse.slo_id + "\"";
    if (category === "ola" || category === "uc") {
        query = query + " and assignment=\"" + sloResponse.group + "\"";
    }

    recordList.doPurge(query);

    //do the logging

    var recordcopy = funcs.recordcopy;

    var fieldsToCopy = ["active", "agreement.category", "agreement.id", "breached",
        "current.status", "end.time", "expiration.time", "final.state",
        "foreign.filename", "foreign.key", "initial.state", "running",
        "slo.id", "slo.name", "start.time", "suspended", "total.time"
    ];

    var currentGroup = record[nullsub(slmControl["group.field"], "assignment")];
    if (8 == funcs.type(currentGroup)) {
        currentGroup = currentGroup[0];
    }

    var sloresponsehist = new SCFile("sloresponsehist");
    var rteReturnValue = new SCDatum();
    var rteNumber = new SCDatum();
    try {
        funcs.rtecall("getnumber", rteReturnValue, rteNumber, "sloresponsehist", null);
        recordcopy(sloResponse, fieldsToCopy, sloresponsehist, fieldsToCopy);
    } catch (e) {
        log.error(e.message);
        return -1;
    }

    sloresponsehist["id"] = rteNumber;
    sloresponsehist["assignment"] = currentGroup;
    sloresponsehist["total.time.group"] = duration;

    var rc = sloresponsehist.doInsert();
    return rc;
}

function calcInterval(starts, ends, groups, groupCalendars, groupTimezones, sloResponse, scheduleType, timezoneType) {

    var duration = newDuration();
    var calendar = funcs.nullsub(sloResponse.calendar, "24/7");
    var holiday = funcs.nullsub(sloResponse.holiday, "");
    var timezone = funcs.nullsub(sloResponse.timezone, vars.$lo_time_zone);

    var i;
    for (i = 0; i < starts.length; i++) {
        var t_calendar = calendar;
        var t_timezone = timezone;
        if (scheduleType === "group") {
            t_calendar = groupCalendars[i];
        }
        if (timezoneType === "group") {
            t_timezone = groupTimezones[i];
        }

        var interval = getInterval(starts[i], ends[i], t_calendar, t_timezone, holiday);
        duration.increment(interval);
    }

    return duration.value;
}

function getInterval(sDT, eDT, workSch, tz, holiday) {

    const defaultInterval = funcs.val("00:00:00", lib.DataTypeConst.typeDateTime());

    if (dateCompare(sDT, eDT) > 0) {
        return defaultInterval;
    }

    var interval = new SCDatum();
    interval.setType(1);
    var names = ["times,1", "times,2", "times,3", "prompt", "name", "query"];
    var values = [sDT, interval, eDT, workSch, tz, holiday];

    var rc;
    try {
        rc = callrad("calendar.calc.interval", names, values);
    } catch (e) {
        log.error(e.message);
        return defaultInterval;
    }

    if (rc == RC_SUCCESS) {
        return values[1];
    }

    return defaultInterval;
}

function newDuration() {
    return {
        ZERO: funcs.val("00:00:00", 3),
        value: funcs.val("00:00:00", 3),

        increment: function(dura) {
            dura = funcs.val(dura, 3);
            this.value = new Date(dura.getTime() - this.ZERO.getTime() + this.value.getTime());
            return this;
        }
    };
}

function dateCompare(date1, date2) {
    return date1.getTime() - date2.getTime();
}

function maxDate(date1, date2) {
    if (date1.getTime() > date2.getTime()) {
        return date1;
    }

    return date2;
}

function minDate(date1, date2) {
    if (date1.getTime() > date2.getTime()) {
        return date2;
    }

    return date1;
}

function closeSloResponseHist(id) {
    var sql = 'foreign.key="' + id + '" and active=true';

    $('sloresponsehist').select(sql).iterate(function(item) {
        item.active = false;
        item.running = false;
        item.suspended = false;

        //Added 2 lines for QCCR1E152431 to update the current status field
        if (item.breached) {
            item.current_status = 1;
        } else {
            item.current_status = 4;
        }

        item.doUpdate();
    });
}

/**
 * JS Function: scheduleCheckAndUpdateFlags()
 * This is the overall function to check and update flags called by trigger hpps.sloresponsehist.after.update
 * @param:            record                       of type sloresponsehist
 * @return:
 **/
function scheduleCloseSloResponseHist(id) {
    var schedule = new SCFile("schedule");
    var name = "fix sloresponsehist ative state - " + id;
    if (RC_SUCCESS == schedule.doSelect('name="' + lib.StringUtil.escapeAllStr(name) + '"')) {
        return;
    }

    schedule.name = name;
    schedule._class = CLASS_NAME;
    var sched = new Date(funcs.tod().getTime() + DELAY_TIME);
    schedule.expiration = sched;
    schedule['javascript'] = 'lib.SLMHistory.closeSloResponseHist("' + id + '");';
    schedule.doInsert();
}

function getWorkflowName(object, fileName, id) {
    if (object['workflowLocation'] == 'object') {
        return object[2];
    } else if (object['workflowLocation'] == 'category') {
        var catFileName = object[1];
        var uniqueKey = funcs.dbdict_helper('unique.key', fileName);
        var sql = 'select workflow from ' + catFileName + ' c join ' + fileName + ' a on (a.category=c.name) where a.' + uniqueKey[0] + '="' + lib.StringUtil.escapeAllStr(id) + '"';
        return $(catFileName).select(sql).scfile[0];
    }
}

function getPhaseList(fileName, id) {
    var object = $('Object').select('select workflowLocation, category.file.name, workflow from Object o where o.file.name="' + fileName + '"').scfile;

    if (object['workflowLocation'] == 'object' || object['workflowLocation'] == 'category') { // PD Workflow  
        var workflowName = getWorkflowName(object, fileName, id);
        return lib.Workflow.getPhaseList(workflowName, fileName);
    } else {
        var catFileName = object[1];
        var uniqueKey = funcs.dbdict_helper('unique.key', fileName);
        var sql = 'select phases from ' + catFileName + ' c join ' + fileName + ' a on (a.category=c.name) where a.' + uniqueKey[0] + '="' + lib.StringUtil.escapeAllStr(id) + '"';
        return $(catFileName).select(sql).scfile[0].toArray();
    }
}