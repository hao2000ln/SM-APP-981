var $ = lib.c.$;
var log = getLog("OutageCalculation");
//log.setLevel("debug");


/**
 * recalculate outage
 *
 * @param {Number} outageId
 * @returns {Boolean}
 */
function recalculateOutage(outageId) {
    if (!outageId) {
        log.warn("Outage id is empty!");
        return false;
    }

    var outage = $("outage").find("outage.id=:id", outageId).one();
    if (!outage) {
        log.warn('Outage "' + outageId + '" not found!');
        return false;
    }

    // split outage
    var subs = splitOutage(outageId);

    // outage has no event
    if (subs.length == 0) {
        log.info('Outage "' + outageId + '" has no outage event, delete it.');
        outage.doDelete();
        return true;
    }

    if (log.isDebugEnabled()) {
        log.debug("Recalculated Outages: " + JSON.stringify(subs, null, '   '));
    }

    // update current outage
    outage.outage_start = subs[0].start;
    outage.outage_end = subs[0].end;
    outage.closed = subs[0].closed;
    outage.outage_duration = lib.SLACalculation.calculateOutageDuration(outage);

    outage.doUpdate();

    // one outage covers all events
    if (subs.length == 1) {
        return true;
    }

    const ci = outage.logical_name;

    // split into multiple outages
    var i;
    for (i = subs.length - 1; i > 0; i--) {
        var outageNew = new SCFile("outage");

        outageNew.outage_start = subs[i].start;
        outageNew.outage_end = subs[i].end;
        outageNew.closed = subs[i].closed;
        outageNew.skip_post = false;
        outageNew.logical_name = ci;
        outageNew.outage_duration = lib.SLACalculation.calculateOutageDuration(outageNew);

        var rc = outageNew.doInsert();

        // batch update old events to related with new outage from later start time
        if (rc == RC_SUCCESS) {
            batchUpdateOutageEvents(outageNew, outageId);
        }
    }

    return true;
}


/**
 * split outage by outage id
 * 
 * @param {Number} outageId
 * @returns {Array}
 *          [ {start, end, closed} ]
 */
function splitOutage(outageId) {
    // search event order by start/end time
    var event = new SCFile("outageevent", SCFILE_READONLY);
    event.setFields(["outage.start", "outage.end", "closed"]);
    event.setOrderBy(["outage.start", "outage.end"], [SCFILE_ASC, SCFILE_ASC]);
    var rc = event.doSelect('outage.id=' + outageId);

    // ignore incorrect data
    while (rc == RC_SUCCESS && event.outage_start == null) {
        rc = event.getNext();
    }

    if (rc != RC_SUCCESS) {
        return [];
    }

    return splitOutageByFirstEvent(outageId, event);
}


/**
 * split outage by first outage event
 *
 * @param {Number} outageId 
 * @param {SCFile} event
 * @returns {Array}
 *          [ {start, end, closed} ]
 */
function splitOutageByFirstEvent(outageId, event) {
    if (!event) {
        return [];
    }

    var outage = {
        "start": event.outage_start,
        "end": event.outage_end,
        "closed": !!event.closed
    };

    var outages = [outage];

    // if outage has no end time, one outage covers all events
    if (outage.end == null) {
        // outage closed only if all events closed
        if (outage.closed) {
            outage.closed = !hasOpenEventAfterTime(outageId, event.outage_start);
        }
        return outages;
    }

    var rc = event.getNext();
    while (rc == RC_SUCCESS) {

        // ignore incorrect data
        if (event.outage_start == null) {
            rc = event.getNext();
            continue;
        }

        // time intersect, merge into same outage
        if (event.outage_start <= outage.end) {

            // outage closed only if all events closed
            if (outage.closed) {
                outage.closed = !!event.closed;
            }

            if (event.outage_end == null || event.outage_end > outage.end) {
                outage.end = event.outage_end;
            }

            // one outage covers all events
            if (outage.end == null) {
                if (outage.closed) {
                    outage.closed = !hasOpenEventAfterTime(outageId, event.outage_start);
                }
                return outages;
            }
        }
        // time non-intersect, split a new outage
        else {
            if (log.isDebugEnabled()) {
                log.debug("Outage event non-intersect, split a new outage from " + outageId + ".");
            }

            var subs = splitOutageByFirstEvent(outageId, event);
            if (subs.length > 0) {
                outages = outages.concat(subs);
            }

            return outages;
        }

        rc = event.getNext();
    }

    return outages;
}


/**
 * check whether exists open outage event after certain time
 *
 * @param {Number} outageId
 * @param {Date} start
 * @returns {Boolean}
 */
function hasOpenEventAfterTime(outageId, start) {
    var query = "outage.id=" + outageId + " and outage.start>='" + funcs.str(start) + "' and closed~=true";
    var event = $("!outageevent").fields("record.tag").find(query).one();
    return event != null;
}


/**
 * batch update outage event to the new outage
 *
 * @param {SCFile} outageNew
 * @param {Number} outageIdOld
 */
function batchUpdateOutageEvents(outageNew, outageIdOld) {
    var eventSqlTable = $("#dbdictService").getPrimaryTable($("outageevent").dbdict())[1];

    var dbType = lib.dbdictHelper.getDbType();
    var adapter = lib.DataService.getAdaptor(dbType);

    var outageIdNew = outageNew.outage_id;

    log.info("Begin to update the outage events from " + outageIdOld + " to " + outageIdNew + ".");

    var batchUpdateSql = "update " + eventSqlTable +
        " set " + adapter.escapeField("OUTAGE_ID") + "=" + outageIdNew +
        " where " + adapter.escapeField("OUTAGE_ID") + "=" + outageIdOld +
        " and " + adapter.escapeField("CI_NAME") + "='" + outageNew.logical_name + "'" +
        " and " + adapter.escapeField("OUTAGE_START") + ">=" + adapter.escapeDateValue(outageNew.outage_start);

    if (log.isDebugEnabled()) {
        log.debug(batchUpdateSql);
    }

    $("#dataService").executeSQL(batchUpdateSql);

    log.info("The outage events have been updated successfully.");
}