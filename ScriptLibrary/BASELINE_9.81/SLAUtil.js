var $ = lib.c.$;

var _file = lib.FileUtil._file;
var _fileCache = lib.FileUtil._fileCache;
var _cache = lib.FileUtil._cache;
var $break = lib.FileUtil.$break;

var SMTYPE = lib.SysUtil.SMTYPE;
var _tod = lib.SysUtil._tod;
var _month = lib.SysUtil._month;
var _year = lib.SysUtil._year;
var _datemake = lib.SysUtil._datemake;
var _recordcopy = lib.SysUtil._recordcopy;
var _str = lib.SysUtil._str;
var _var = lib.SysUtil._var;
var _cleanup = lib.SysUtil._cleanup;
var _evaluate = lib.SysUtil._evaluate;
var _parse = lib.SysUtil._parse;
var _updateArr = lib.SysUtil._updateArr;


/*!
 * Rewrite the RAD: sla.outage.calc.detail in JavaScript for QCCR58093 for performance improvement.
 * 
 */
function sla_outage_calc_detail(outage, bSkip) {

    var ci = outage['logical.name'];

    var cigroup = _fileCache('cigroup',
            'logical.name', 'group.type', 'group.members', 'group.query')
        .selectLazy('group.type="list" or group.type="query"');

    var joincigroup = _fileCache('joincigroup',
            'logical.name', 'baseline.version')
        .selectLazy('type="cigroup" and subtype="Baseline"');

    var deviceFile = _file('device').select('logical.name="' + ci + '"');

    var detailQuery = [
        'logical.name = "' + outage.logical_name + '"',
        'outage.id = ' + outage.outage_id
    ].join(' and ');

    var detailFiledNames = [
        'slo.id', 'agreement.id', 'year', 'month',
        'logical.name', 'outage.id', 'closed', 'cost', 'cost.currency.code', 'downtime', 'schedule', 'time.zone'
    ];

    var detailCache = _fileCache('outagedetail',
        _updateArr([], detailFiledNames, 0, 4), true);

    var calendarCache = _cache();

    _var("$L.SLAUtil.time.rt", "$L.SLAUtil.time.1", "$L.SLAUtil.time.2",
        "$L.SLAUtil.time.start", "$L.SLAUtil.time.end", "$L.SLAUtil.time.duty.table", "$L.SLAUtil.time.time.zone");

    var N = 500;
    var n = N;
    var slas = [];
    var qs = [];

    function process() {
        var len = (slas && slas.length) || 0;
        if (len > 0) {
            detailCache.select(detailQuery + ' and (' + qs.join(' or ') + ')');
            while (len--) {
                sla_outage_calc_one(outage, detailCache, slas[len], bSkip, calendarCache, deviceFile);
            }
        }
        n = N;
        slas = [];
        qs = [];
    }

    var qr = [
        'slo.id = ', '?', // 1
        ' and ',
        'agreement.id = ', '?' // 4
    ];

    if (vars.$G_slo_groups == null) {
        vars.$G_slo_groups = getAllSLOGroups();
    }

    var slatemp;
    var tod = funcs.tod();
    var starttime;
    var expirationtime;

    _file('sloavail').select('ci = "' + ci + '" or ci isin {"' + vars.$G_slo_groups.join('","') + '"}').iterate(function(sloavail) {
        if (ci == sloavail.ci ||
            _isInGroup(ci, deviceFile, cigroup, joincigroup, sloavail)) {

            slatemp = _file('sla').select('agreement.id="' + sloavail.agreement_id + '"');
            starttime = slatemp.getFieldValue('start');
            expirationtime = slatemp.getFieldValue('expiration');

            if (slatemp.success && starttime != null && expirationtime != null &&
                (tod >= starttime && tod <= expirationtime)) {

                slas.push(_recordcopy(sloavail, new SCFile('sloavail'), detailFiledNames));
                qr[1] = sloavail.slo_id;
                qr[4] = sloavail.agreement_id;
                qs.push(qr.join(''));

                if (--n == 0) {
                    process();
                }
            }
        }
    });

    // process the rest
    process();

    _cleanup("$L.SLAUtil.time.rt", "$L.SLAUtil.time.1", "$L.SLAUtil.time.2",
        "$L.SLAUtil.time.start", "$L.SLAUtil.time.end", "$L.SLAUtil.time.duty.table", "$L.SLAUtil.time.time.zone");

    // realse chaches
    var cs = [cigroup, joincigroup, detailCache, calendarCache];
    var cslen = cs.length;
    while (cslen--) {
        cs[cslen].releaseCache();
    }

}

/*
 * calc outage cost based on the downtime 
 */
function _calcOutageCost(device, downtime) {
    if (!downtime) {
        return null;
    }

    var costPerHour = device.getFieldValue('costPerHour');
    var currency = device.getFieldValue('currency');

    if (currency == null) {
        currency = vars['$G.am.global.environment'].currency;
    }

    if (null == costPerHour) {
        costPerHour = vars['$G.am.global.environment'].costPerHour;
        currency = vars['$G.am.global.environment'].currency;
    }

    if (null == costPerHour) {
        return null;
    }

    var hours = funcs.val(downtime, 1) / 3600.0;
    if (hours < 0) {
        return null;
    }

    var cost = funcs.round(hours * costPerHour, 2);

    return { "cost": cost, "currency": currency };
}

/*!
 * Rewrite RAD sla.outage.calc.one in JavaScript for QCCR58093 for performance improvement.
 * 
 */
function sla_outage_calc_one(outage, detailCache, sla, bSkip, calendarCache, deviceFile) {

    bSkip = bSkip || false;
    var hasoutageend = false;

    var start = outage.outage_start;
    var stop = outage.outage_end || _tod();
    var downtime = _timeSubtract(stop, start);
    var firstDetail = getOutageDetailByOutage(outage, sla);
    var month;
    var year;
    var outage_startmonth = _month(start);
    var outage_startyear = _year(start);

    //set month, year compare by outage and outagedetail
    if (firstDetail) {
        var detailYear = firstDetail.year;
        var detailMonth = firstDetail.month + 1;
        if (detailMonth == 13) {
            detailMonth = 1;
            detailYear += 1;
        }

        var detaileom = _datemake(detailYear, detailMonth, 1);
        if (_timeLE(detaileom, start)) {
            month = firstDetail.month;
            year = firstDetail.year;
        } else {
            month = outage_startmonth;
            year = outage_startyear;
        }
    } else {
        month = outage_startmonth;
        year = outage_startyear;
    }

    var lastStart = start;
    var currentTime = _tod();

    var done = false;
    if (outage.outage_end) {
        hasoutageend = true;
    }

    do {
        // fetch.eom
        var sendmonth = month + 1;
        var sendyear = year;
        if (sendmonth == 13) {
            sendmonth = 1;
            sendyear += 1;
        }

        var eom = _datemake(sendyear, sendmonth, 1);

        var sendstart = lastStart;
        var sendstop = stop;

        if (_month(outage.outage_start) == month && _year(outage.outage_start) == year) {
            sendstart = outage.outage_start;
        }

        if (_timeLt(eom, stop) && _timeLt(outage.outage_start, eom)) {
            sendstop = eom;
        } else if ((hasoutageend && _timeLE(stop, sendstart)) || _timeLE(eom, outage.outage_start)) {
            sendstart = eom;
            sendstop = eom;
        } else {
            if (!(hasoutageend && _timeLE(sendstart, stop) && _timeLE(stop, eom))) {
                done = true;
            }
        }

        lastStart = sendstop;
        downtime = _timeSubtract(sendstop, sendstart);

        // check.schedule
        if (sla.schedule) {
            // calender
            var strSendstart = _str(sendstart);
            var strSendstop = _str(sendstop);
            downtime = calendarCache.get(strSendstart, strSendstop, sla.schedule, sla.time_zone);
            if (!downtime) {
                downtime = calendar_calc_interval_wrapper(sendstart, sendstop, sla.schedule, sla.time_zone);
                calendarCache.put(strSendstart, strSendstop, sla.schedule, sla.time_zone, downtime);
            }
        }

        // detail.test
        var detail = detailCache.get(sla.slo_id, sla.agreement_id, year, month);
        var bAdd = false;
        if (!detail) { // set.add
            bAdd = true;
            detail = new SCFile('outagedetail');
            // set.detail.go
            detail.logical_name = outage.logical_name;
            detail.agreement_id = sla.agreement_id;
            detail.outage_id = outage.outage_id;
            detail.year = year;
            detail.month = month;
            detail.slo_id = sla.slo_id;
        }

        // set.detail.go
        detail.downtime = downtime;
        detail.closed = outage.closed;
        var costObj = _calcOutageCost(deviceFile, downtime);

        if (costObj && costObj.cost != null) {
            detail.cost = costObj.cost;
            detail.currency = costObj.currency;
        } else {
            detail.cost = null;
            detail.currency = null;
        }

        if (bAdd) {
            detail.doInsert();
        } else {
            detail.doSave();
        }

        if (!bSkip) {
            // gen.schedule
            _genSchedule(detail);
        }

        // iterate
        month += 1;
        if (month == 13) {
            month = 1;
            year += 1;
        }
        if (_timeLE(currentTime, eom)) { done = true; }

    } while (!done);
}

var _dtExpr = _parse("$L.SLAUtil.time.rt=$L.SLAUtil.time.1 - $L.SLAUtil.time.2", SMTYPE.Expression);
var _calExpr = _parse('$L.void=rtecall("callrad", NULL, "calendar.calc.interval.wrapper", {"times", "prompt", "name"}, {{$L.SLAUtil.time.start, $L.SLAUtil.time.end}, $L.SLAUtil.time.duty.table, $L.SLAUtil.time.time.zone}, false, true)', SMTYPE.Expression);

function calendar_calc_interval_wrapper(start, end, dutyTable, timeZone) {
    vars.$L_SLAUtil_time_start = start;
    vars.$L_SLAUtil_time_end = end;
    vars.$L_SLAUtil_time_duty_table = dutyTable;
    vars.$L_SLAUtil_time_time_zone = timeZone;

    _evaluate(_calExpr);

    return vars.$calendar_calc_interval_wrapper_rt;
}

function _timeSubtract(td1, td2) {
    vars.$L_SLAUtil_time_1 = td1;
    vars.$L_SLAUtil_time_2 = td2;
    _evaluate(_dtExpr);
    return vars.$L_SLAUtil_time_rt;
}

function _timeLt(td1, td2) {
    return new XMLDate(td1) < new XMLDate(td2);
}

function _timeLE(td1, td2) {
    return new XMLDate(td1) <= new XMLDate(td2);
}

function _genSchedule(detail) {
    var schedule = new SCFile('schedule');
    schedule['class'] = 'sla';
    schedule.expiration = _tod();
    schedule.name = funcs.scmsg(74, "sla", [detail.slo_id]);
    schedule.number = detail.outage_id;
    schedule.application = "sla.gen.month.wrapper";
    var numbers = new SCDatum();
    numbers.setType(SMTYPE.Number);
    numbers.push(detail.slo_id);
    numbers.push(detail.month);
    numbers.push(detail.year);
    schedule.numbers1 = numbers;
    schedule.doInsert();
}

/*!
 * Rewrite the RAD: trigger.outage.pre.add in JavaScript for QCCR58093 for performance improvement.
 * 
 */
function trigger_outage_pre_add(outage) {

    var ci = outage['logical.name'];

    var cigroup = _fileCache('cigroup',
            'logical.name', 'group.type', 'group.members', 'group.query')
        .select('group.type="list" or group.type="query"');

    var joincigroup = _fileCache('joincigroup',
            'logical.name', 'baseline.version')
        .select('type="cigroup" and subtype="Baseline"');

    var deviceFile = _file('device').select('logical.name="' + ci + '"');

    if (vars.$G_slo_groups == null) {
        vars.$G_slo_groups = getAllSLOGroups();
    }

    // init.sloavail
    // select.sloavail
    _file('sloavail').select('ci = "' + ci + '" or ci isin {"' + vars.$G_slo_groups.join('","') + '"}').iterate(
        function(sloavail) {
            if ((ci == sloavail.ci) ||
                _isInGroup(ci, deviceFile, cigroup, joincigroup, sloavail)) {
                // set.sla.flag
                // if the caluated duration(downtime) is not 0 
                if (funcs.val(calendar_calc_interval_wrapper(outage['outage.start'],
                        outage['outage.end'], sloavail.schedule, sloavail.time_zone)) > 0) {
                    outage['has.sla'] = true;
                    throw $break;
                }
            }
        }
    );

    // check.post
    if (outage['skip.post']) {
        outage['skip.post'] = false;
    } else if (outage['has.sla']) {
        // schedule
        var schedule = new SCFile('schedule');
        schedule['class'] = 'sla';
        schedule.expiration = _tod();
        schedule.name = "Outage outagedetail record for: " + outage['logical.name'];
        schedule.number = outage['outage.id'];
        schedule.application = 'sla.outage.bg';
        if (outage.closed) {
            schedule.strings = ["closed"];
        }
        schedule.doInsert();

        // set.last.posting
        outage['last.posting'] = _tod();
    }
}

function _isInGroup(ci, deviceFile, cigroup, joincigroup, sloavail) {
    var isInList = false;
    if (deviceFile.success) {
        var logicalName = sloavail.ci;
        var blv = null;
        var record = cigroup.get(logicalName);
        if (record) {
            var groupType = record['group.type'];
            if ('list' == groupType) {
                if (_isMemberOf(record['group.members'], ci)) {
                    isInList = true;
                }
            } else { // query
                if (deviceFile.evaluateQuery(record['group.query'])) {
                    isInList = true;
                }
            }
        } else {
            blv = sloavail['ci.version'];
            record = joincigroup.get(logicalName);
            if (blv && record) {
                var baselineVersions = record['baseline.version'];
                if (baselineVersions != null) {
                    var i;
                    var n = baselineVersions.length();
                    for (i = 0; i < n; i++) {
                        if ((blv == baselineVersions[i]['version.number']) &&
                            deviceFile.evaluateQuery(baselineVersions[i]['version.query'])) {
                            isInList = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    return isInList;
}

function _isMemberOf(members, ci) {
    var b = false;
    if (members != null) {
        var i;
        var n = members.length();
        for (i = 0; !b && i < n; i++) {
            if (members[i] == ci) {
                b = true;
            }
        }
    }
    return b;
}

// this function was modified by dalei.xu for QCCR1E127332
function updateAffectedUpCI(logicname, outageStart, outageEnd, closed, recordtag) {
    //check the spread configuration
    var slamodulecontrol = new SCFile("slamodulecontrol", SCFILE_READONLY);
    slamodulecontrol.setFields(["spread", "spread.multi"]);
    var recordInfo = recordtag.split(";");
    var sql = "table.name=\"" + recordInfo[0] + "\"";
    var rc = slamodulecontrol.doSelect(sql);
    var spread = false;
    var spreadMulti = false;
    if (rc == RC_SUCCESS) {
        spread = slamodulecontrol["spread"];
        spreadMulti = slamodulecontrol["spread.multi"];
    }

    if (spread == false) {
        return;
    }

    var rslist = [];
    var rs_query = "related.cis =\"" + logicname + "\" and outage.dependency=true";
    var relationship = new SCFile("cirelationship", SCFILE_READONLY);
    relationship.setFields(["logical.name", "outage.threshold", "related.cis"]);
    var starttime = funcs.str(outageStart);
    var endtime;
    if (outageEnd != null) {
        endtime = funcs.str(outageEnd);
    } else {
        endtime = funcs.str(lib.SysUtil._datemake(2999, 1, 1, 0, 0, 0));
    }
    rc = relationship.doSelect(rs_query);

    if (rc == RC_SUCCESS) {
        do {
            var cidowncount = 0;
            var cioutagethreshold = relationship.outage_threshold;
            var upstreamci = relationship.logical_name;
            var relatedcilist = relationship.related_cis;
            var tmpOutageStart = outageStart;
            var tmpOutageEnd = outageEnd;
            var tmpRecordtag = new SCDatum();
            tmpRecordtag.push(recordtag);
            var outage_sql;
            var outage_rc;

            var cioutageevent = new SCFile("outageevent", SCFILE_READONLY);
            cioutageevent.setFields(["record.tag", "outage.start", "outage.end"]);
            var i;
            var length = funcs.lng(relatedcilist);
            for (i = 0; i < length; i++) {
                var rsci = funcs.str(relatedcilist[i]);
                //Query outage according to ci name and specified outage duration.
                outage_sql = "ci.name=\"" + rsci + "\" and (closed=NULL or closed=false) and ((outage.start< '" + endtime + "' and outage.start >='" + starttime + "') or (outage.end=NULL and outage.start<'" + endtime + "') or  (outage.end<>NULL and outage.end< '" + endtime + "' and outage.end >='" + starttime + "' ))";
                outage_rc = cioutageevent.doSelect(outage_sql);

                //If found any outage record, that indicate this CI is down.
                if (outage_rc == RC_SUCCESS) {
                    if (rsci == logicname) {
                        continue;
                    }
                    if (cioutagethreshold == funcs.lng(relatedcilist)) {
                        tmpOutageStart = funcs.max(tmpOutageStart, cioutageevent.outage_start);
                        if (cioutageevent.outage_end) {
                            tmpOutageEnd = funcs.min(tmpOutageEnd, cioutageevent.outage_end);
                        }
                    } else if (cioutagethreshold == 1) {
                        tmpOutageStart = funcs.min(tmpOutageStart, cioutageevent.outage_start);
                        tmpOutageEnd = funcs.max(tmpOutageEnd, cioutageevent.outage_end);
                    } else { // TODO:here, we should handle threshold is not 1 and all downstream outage
                    }

                    tmpRecordtag.push(cioutageevent.record_tag);
                    cidowncount++;
                }
            }

            if (closed == false) {
                cidowncount++;
            }
            var updated = false;
            var cioutageeventupdate;

            //If related ci down count less than ci relationship's outage threshol, then add to return list. 
            if (cidowncount < cioutagethreshold && closed == true) {
                //Add need one upstream ci to the return list
                outage_sql = "record.tag isin " + funcs.str(tmpRecordtag) + " and ci.name=\"" + upstreamci + "\" and ((outage.start<= '" + endtime + "' and outage.start >='" + starttime + "') or (outage.end=NULL and outage.start<= '" + endtime + "') or  (outage.end<>NULL and outage.end<= '" + endtime + "' and outage.end >='" + starttime + "' ))";
                cioutageeventupdate = new SCFile("outageevent");
                outage_rc = cioutageeventupdate.doSelect(outage_sql);
                //If found any outage record, that indicate this CI is down.
                while (outage_rc == RC_SUCCESS) {
                    cioutageeventupdate.outage_start = tmpOutageStart;
                    cioutageeventupdate.outage_end = tmpOutageEnd;
                    cioutageeventupdate.closed = closed;
                    cioutageeventupdate.doUpdate();
                    updated = true;

                    //update up stream ci recursively
                    if (updated && spreadMulti) {
                        updateAffectedUpCI(cioutageeventupdate.ci_name, cioutageeventupdate.outage_start, cioutageeventupdate.outage_end, cioutageeventupdate.closed, cioutageeventupdate.record_tag);
                    }

                    outage_rc = cioutageeventupdate.getNext();
                }
            } else if (cidowncount >= cioutagethreshold && closed == false) {
                outage_sql = "record.tag isin " + funcs.str(tmpRecordtag) + " and ci.name=\"" + upstreamci + "\"";
                cioutageeventupdate = new SCFile("outageevent");
                outage_rc = cioutageeventupdate.doSelect(outage_sql);
                while (outage_rc == RC_SUCCESS) {
                    //rslist.push(cioutageevent);
                    cioutageeventupdate.outage_start = tmpOutageStart;
                    cioutageeventupdate.outage_end = tmpOutageEnd;
                    cioutageeventupdate.closed = closed;
                    cioutageeventupdate.doUpdate();
                    updated = true;

                    //update up stream ci recursively
                    if (updated && spreadMulti) {
                        updateAffectedUpCI(cioutageeventupdate.ci_name, cioutageeventupdate.outage_start, cioutageeventupdate.outage_end, cioutageeventupdate.closed, cioutageeventupdate.record_tag);
                    }

                    outage_rc = cioutageeventupdate.getNext();
                }
            }

        } while (relationship.getNext() == RC_SUCCESS);
    }
}

function getCiList(recordtag) {
    var slamodulecontrol = new SCFile("slamodulecontrol", SCFILE_READONLY);
    slamodulecontrol.setFields(["ci.fields", "record.id.field"]);
    var recordInfo = recordtag.split(";");

    var sql = "table.name=\"" + recordInfo[0] + "\"";
    var rc = slamodulecontrol.doSelect(sql);
    var IdField = null;
    var fields = null;
    if (rc == RC_SUCCESS) {
        IdField = slamodulecontrol["record.id.field"];
        fields = slamodulecontrol["ci.fields"];
    } else {
        return null;
    }

    var cis = [];
    var tbl = new SCFile(recordInfo[0], SCFILE_READONLY);
    tbl.setFields(fields.toArray());
    sql = IdField + "=\"" + recordInfo[1] + "\"";
    rc = tbl.doSelect(sql);
    if (rc == RC_SUCCESS) {
        var i;
        var ilength = funcs.lng(fields);
        var j;
        var jlength;
        for (i = 0; i < ilength; i++) {
            var fieldName = fields[i];
            if (tbl[fieldName] != null) {
                var fieldValue = tbl[fieldName];
                var fieldType = funcs.type(fieldValue);
                if (fieldType == 2) {
                    //is string
                    cis.push(fieldValue);
                } else {
                    jlength = funcs.lng(fieldValue);
                    for (j = 0; j < jlength; j++) {
                        if (fieldValue[j] != null) {
                            cis.push(fieldValue[j]);
                        }
                    }
                }
            }
        }
    }

    return cis;
}

function getAllSLOGroups() {
    var groups = [];

    $("!sloavailcigroup").fields("logical.name").find("not null(logical.name) and not null(ci)").each(function(group) {
        groups.push(group.logical_name);
    });

    return groups;
}

function isDownStreamOutageEvent(logicname, outageStart, outageEnd) {
    var starttime = funcs.str(outageStart);
    var endtime;
    if (outageEnd != null) {
        endtime = funcs.str(outageEnd);
    } else {
        endtime = funcs.str(lib.SysUtil._datemake(2999, 1, 1, 0, 0, 0));
    }

    var rs_query = "related.cis =\"" + logicname + "\"";
    var relationship = new SCFile("cirelationship", SCFILE_READONLY);
    relationship.setFields(["outage.dependency", "logical.name"]);
    var rc = relationship.doSelect(rs_query);
    if (rc == RC_SUCCESS) {
        do {
            if (relationship.outage_dependency) {
                var upstreamci = relationship.logical_name;
                var cioutageevent = new SCFile("outageevent", SCFILE_READONLY);
                cioutageevent.setFields("ci.name");
                var outage_sql = "ci.name=\"" + upstreamci + "\" and ((outage.start< '" + endtime + "' and outage.end >='" + starttime + "') or (outage.end=NULL and outage.start<'" + endtime + "')) and (closed=NULL or closed=false)";
                var outage_rc = cioutageevent.doSelect(outage_sql);
                if (outage_rc == RC_SUCCESS) {
                    return true;
                }
            }
        } while (relationship.getNext() == RC_SUCCESS);
    }

    return false;
}


/**
 * Get SLA schedule expire time interval when record update
 *
 * @returns {SCDatum} expire time, e.g. '00:02:00'
 */
function getScheduleExpireTime() {
    // default is 2 minutes
    var interval = '00:02:00';

    var control = $("!slacontrol").fields("schedule.expire.time").select('true').uniqueResult();
    if (control != null && control.schedule_expire_time != null) {
        interval = control.schedule_expire_time;
    }

    return new XMLDate(interval).getDatum();
}

//QCCR1E137713
function getOutageDetailByOutage(outage, sla) {
    var sql = "outage.id=\"" + outage.outage_id + "\" and logical.name=\"" + outage.logical_name + "\" and agreement.id=" + sla.agreement_id + "\"";
    var outagedetail = new SCFile("outagedetail", SCFILE_READONLY);
    outagedetail.setOrderBy(['year', 'month'], [SCFILE_ASC, SCFILE_ASC]);
    var ret = outagedetail.doSelect(sql);

    if (ret == RC_SUCCESS) {
        return outagedetail;
    }

    return null;
}