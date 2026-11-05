var _ = lib.Underscore.require();
var $ = lib.c.$;

function decideIsDown(ciName) {
    var outage = new SCFile("outage", SCFILE_READONLY);
    outage.setFields(["outage.start", "outage.end"]);
    var reschedule_date = new Date();
    var isDown = false;

    reschedule_date = null;

    var currentSql = "logical.name=\"" + ciName +
        "\" and (closed=NULL or closed=false) and outage.start<=tod() and (outage.end>tod() or outage.end=NULL)";

    if (outage.doSelect(currentSql) == RC_SUCCESS) {
        isDown = true;
        do {
            if (outage.outage_end != null) {
                if (reschedule_date == null) {
                    reschedule_date = outage.outage_end;
                } else {
                    if (reschedule_date > outage.outage_end) {
                        reschedule_date = outage.outage_end;
                    }
                }
            }
        }
        while (outage.getNext() == RC_SUCCESS);
    }

    var futureSql = "logical.name=\"" + ciName + "\" and (closed=NULL or closed=false) and outage.start>tod()";

    if (outage.doSelect(futureSql) == RC_SUCCESS) {
        do {
            if (reschedule_date == null) {
                reschedule_date = outage.outage_start;
            } else {
                if (reschedule_date > outage.outage_start) {
                    reschedule_date = outage.outage_start;
                }
            }
        }
        while (outage.getNext() == RC_SUCCESS);
    }

    if (isDown == true) {
        markAsDown(ciName);
    } else {
        markAsUp(ciName);
    }

    var action = "decideDown";

    removeScheduleRecords(ciName, action);

    if (reschedule_date != null) {
        scheduleAction(ciName, action, reschedule_date);
    }
}


function markAsDown(ciName) {
    var ci = new SCFile("device");
    var reschedule_action = "decideDown";
    var sql = "logical.name=\"" + ciName + "\"";

    if (ci.doSelect(sql) == RC_SUCCESS) {
        if (ci.is_down != true) {
            ci.is_down = true;
            var ciUpdateTemp = vars.$G_am_environment.update;
            vars.$G_am_environment.update = "always";
            var rc = ci.doAction("save");
            vars.$G_am_environment.update = ciUpdateTemp;

            if (rc == RC_CANT_HAVE || rc == RC_MODIFIED) {
                var time = new Date();
                var sched = new Date(time.getTime() + 60 * 1000);
                scheduleAction(ciName, reschedule_action, sched);
            }
        }
    }
}


function markAsUp(ciName) {
    var ci = new SCFile("device");
    var reschedule_action = "decideDown";
    var sql = "logical.name=\"" + ciName + "\"";

    if (ci.doSelect(sql) == RC_SUCCESS) {
        if (ci.is_down == true) {
            ci.is_down = false;
            var ciUpdateTemp = vars.$G_am_environment.update;
            vars.$G_am_environment.update = "always";
            var rc = ci.doAction("save");
            vars.$G_am_environment.update = ciUpdateTemp;

            if (rc == RC_CANT_HAVE || rc == RC_MODIFIED) {
                var time = new Date();
                var sched = new Date(time.getTime() + 60 * 1000);
                scheduleAction(ciName, reschedule_action, sched);
            }
        }
    }
}


function scheduleAction(ciName, action, runTime) {
    var schedule = new SCFile("schedule");
    schedule._class = "linker";

    var sql = "application=\"am.decide.down\" and object=\"" + ciName + "\" and type=\"" + action + "\"";

    if (schedule.doSelect(sql) == RC_SUCCESS) {
        if (schedule.expiration <= runTime) {
            return true;
        }
    }

    var time = new Date();
    var sched = new Date();

    if (runTime == null) {
        sched = new Date(time.getTime() + 60 * 1000);
    } else {
        sched = runTime;
    }

    schedule.expiration = sched;
    schedule.name = "CI " + ciName + " - " + action;
    schedule.application = "am.decide.down";
    schedule.status = "scheduled";
    schedule.strings[0] = ciName;
    schedule.strings[1] = action;
    schedule.object = ciName;
    schedule.type = action;

    if (schedule.doInsert() == RC_SUCCESS) {
        return true;
    }
    return false;
}


function removeScheduleRecords(ciName, action) {
    var schedule = new SCFile("schedule");
    var sql = "application=\"am.decide.down\" and object=\"" + ciName + "\" and type=\"" + action + "\"";

    if (schedule.doSelect(sql) == RC_SUCCESS) {
        do {
            schedule.doDelete();
        }
        while (schedule.getNext() == RC_SUCCESS);
    }
}


function setBaseLineGroupName(record, oldrecord) {
    if (record.version != null) {
        record.logical_name = record.logical_name + " " + record.version;

        var device = new SCFile("device");
        var currentSql = "logical.name=\"" + record.logical_name;

        if (device.doSelect(currentSql) == RC_SUCCESS) {
            device.logical_name = record.logical.name;
            device.doUpdate();
        }
    }
}

function getBaselineDeltas(record) {
    var html;
    var strColumnWidth = "width=\"33%\"";
    var strRowClass;
    var caption;
    var fieldName;
    var fieldValue;
    if (record.baseline != null) {
        html = lib.htmlTemplates.getBasicListTemplate() +
            "<DIV class=\"resultTable\"><TABLE class=\"listTable\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
        var baseline = new SCFile("baseline", SCFILE_READONLY);
        baseline.setFields(["field.names", "field.values"]);
        var sql = "name=\"" + record.baseline + "\" and version = \"" + record.baseline_version + "\"";

        html += "<TR valign=top CLASS=\"oddRow\">" +
            "<TD></TD>" +
            "<TD><B>" + funcs.scmsg(3, "baseline") + "</TD>" +
            "<TD><B>" + funcs.scmsg(4, "baseline") + "</TD></TR>";
        if (baseline.doSelect(sql) == RC_SUCCESS) {
            var i;
            var length = baseline.field_names.length();
            for (i = 0; i < length; i++) {
                fieldName = baseline.field_names[i];
                fieldValue = record[fieldName.replace(/\./g, "_")];
                if (fieldValue != baseline.field_values[i]) {
                    strRowClass = i % 2 == 0 ? "evenRow" : "oddRow";
                    html += "<TR valign=top CLASS=\"" + strRowClass + "\">";
                    caption = lib.tableFunctions.getFieldCaption(baseline.field_names[i],
                        funcs.filename(record));
                    html += "<TD " + strColumnWidth + " >" + _.escape(caption) + ": </TD>";
                    html += "<TD>" + _.escape(baseline.field_values[i]) + "</TD>";
                    html += "<TD>" + _.escape(fieldValue) + "</TD>";
                    html += "</TR>";
                }
            }
        }

        html += "</TABLE>";
    }

    return html;
}

function getPendingChanges(id) {
    if (vars.$L_file) {
        return getActiveDataModEvents(vars.$L_file, true);
    } else {
        return "";
    }
}

function getHistoricChanges(id) {
    if (vars.$L_file) {
        return getActiveDataModEvents(vars.$L_file, false);
    } else {
        return "";
    }
}

function getActiveDataModEvents(record, active) {
    var html;
    var strColumnWidth = "width=\"20%\"";
    var strRowClass;
    var caption;
    var row = 0;
    var oldValue;
    var newValue;

    html = lib.htmlTemplates.getBasicListTemplate() +
        "<DIV class=\"resultTable\"><TABLE class=\"listTable\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";

    var events = new SCFile("dataModEvent", SCFILE_READONLY);
    var filename = funcs.filename(record);

    var sql = "(tableName=\"device\" or tableName=\"cirelationship\" or tableName=\"" + filename + "\") and recordId=\"" + lib.StringUtil.escapeAllStr(record.logical_name) +
        "\" and active=" + active;


    if (events.doSelect(sql) == RC_SUCCESS) {
        html += "<TR valign=top CLASS=\"oddRow\">" +
            "<TD><B>" + funcs.scmsg(1, "dataModEvent") + "</TD>" +
            "<TD><B>" + funcs.scmsg(2, "dataModEvent") + "</TD>" +
            "<TD><B>" + funcs.scmsg(3, "dataModEvent") + "</TD>" +
            "<TD><B>" + funcs.scmsg(4, "dataModEvent") + "</TD>" +
            "<TD><B>" + funcs.scmsg(5, "dataModEvent") + "</TD>" +
            "<TD><B>" + funcs.scmsg(6, "dataModEvent") + "</TD>" +
            "<TD><B>" + funcs.scmsg(7, "dataModEvent") + "</TD>" + "</TR>";
        // var change = new SCFile("cm3r");
        do {
            var fieldType = lib.tableFunctions.getFieldType(events.fieldName, filename);

            strRowClass = row % 2 == 0 ? "evenRow" : "oddRow";
            html += "<TR valign=top CLASS=\"" + strRowClass + "\">";
            caption = lib.tableFunctions.getFieldCaption(events.fieldName,
                events.tableName);

            var isDisplayField = lib.ddmEventHelper.isDisplayField(events.tableName, events.fieldName);

            html += "<TD " + strColumnWidth + " >" + _.escape(caption) + ": </TD>";
            if (fieldType == 3) {
                //convert the ISO date to user format
                events.oldValue = funcs.str(lib.dmeTimeConvert.formatFromISODate(events.oldValue));
            }

            if (isDisplayField) {
                oldValue = lib.ddmEventHelper.getDisplayValue(events.oldValue);
            } else {
                oldValue = stripArray(events.oldValue);
            }

            if (events.is_password) {
                oldValue = "********";
            }

            html += "<TD>" + _.escape(oldValue) + "</TD>";
            if (fieldType == 3) {
                //convert the ISO date to user format
                events.newValue = funcs.str(lib.dmeTimeConvert.formatFromISODate(events.newValue));
            }

            if (isDisplayField) {
                newValue = lib.ddmEventHelper.getDisplayValue(events.newValue);
            } else {
                newValue = stripArray(events.newValue);
            }

            if (events.is_password) {
                newValue = "********";
            }

            html += "<TD>" + _.escape(newValue) + "</TD>";
            html += "<TD>" + funcs.scmsg("status:" + _.escape(events.status), "dataModEvent") + "</TD>";

            if (events.linkedTableName && events.linkedRecordId) {
                html += '<TD><a href="sclink://' + events.linkedTableName + ':number=&quot;' + events.linkedRecordId + '&quot;">' + events.linkedRecordId + '</TD>';
            } else {
                var lri = "";
                if (events.linkedRecordId) {
                    lri = events.linkedRecordId;
                }
                html += '<TD>' + lri + '</TD>';
            }

            /*
            var csql = "number=\""+events.linkedRecordId+"\"";
            if ( change.doSelect( csql ) == RC_SUCCESS )
            {
            	if ( change.planned_start != null)
            	{
            		html += "<TD>" + _.escape(funcs.str( change.planned_start ))+ "</TD>";
            	}
            	else
            	{
            		html += "</TD>";
            	}
            	if ( change.planned_end != null )
            	{
            
            		html += "<TD>" + _.escape(funcs.str( change.planned_end ))+ "</TD>";
            	}
            	else
            	{
            		html += "</TD>";
            	}
            }
            else
            {
            	html+= "<TD>" + _.escape(funcs.str( events.createdDate ))+ "</TD>";
            	html+= "<TD>" + _.escape(funcs.str( events.processedDate ))+ "</TD>";
            	html+= "</TD></TD>";
            }
            */
            html += "<TD>" + _.escape(funcs.str(events.createdDate)) + "</TD>";
            html += "<TD>" + _.escape(funcs.str(events.processedDate)) + "</TD>";
            html += "</TD></TD>";

            html += "</TR>";
            row++;
        }
        while (events.getNext() == RC_SUCCESS);
    }

    html += "</TABLE>";

    return html;

}

function stripArray(field) {
    if (funcs.index("{", field) == 1) {
        field = funcs.val(field, 8);
    }
    if (funcs.type(field) == 8) {
        var string = "";
        var i;
        var length = field.length();
        for (i = 0; i < length; i++) {
            if (field[i] == null) {
                field[i] = "";
            }
            string += funcs.str(field[i]);
            if (i < length - 1) {
                string += ", ";
            }
        }
        return string;
    } else {
        if (field == null) {
            field = "";
        }
    }

    return field;
}

function getCINameFromUcmdbId(id, companyCode) {
    if (id == null || id == "") {
        return null;
    }
    var ci = new SCFile("device", SCFILE_READONLY);
    ci.setFields("logical.name");
    var sql = "ucmdb.id=\"" + id + "\"";

    if (vars.$G_multi && companyCode != null && companyCode.length != 0) {
        sql = "ucmdb.id=\"" + id + "\" and company=\"" + companyCode + "\"";
    }

    if (ci.doSelect(sql) == RC_SUCCESS) {
        return ci.logical_name;
    } else {
        return null;
    }
}

function populateCompanyCode(relationship, oldRelationship) {
    var parentName = relationship.logical_name;
    var isSame = funcs.same(relationship, oldRelationship);
    if (!isSame) {
        var parentCi = new SCFile("device", SCFILE_READONLY);
        parentCi.setFields("company");
        var sql = "logical.name=\"" + parentName + "\"";
        if (parentCi.doSelect(sql) == RC_SUCCESS) {
            if (!funcs._null(parentCi.company)) {
                relationship.company = parentCi.company;
            }
        }
    }
}


/*
Author: Fei, Zhi-Chao
Push UCMDB ID to Service Manager when finish population ci.
*/
function pushUcmdbIDToSM() {
    var setExitType = lib.BaseUtil.setExitType;

    var logicalName = vars.$L_file.logical_name;
    var ucmdbid = vars.$L_file.ucmdb_id;

    setExitType(lib.BaseUtil_Constants.NORMAL_EXIT());

    var ciobject = new SCFile("device");
    var sql = "logical.name=\"" + logicalName + "\"";
    if (ciobject.doSelect(sql) == RC_SUCCESS) {
        ciobject.ucmdb_id = ucmdbid;
        ciobject.doUpdate();
    } else {
        setExitType(lib.BaseUtil_Constants.NO_RECORD_EXIT());
    }
}


/**
 * @param record -> $L.file
 * @param object -> $L.object
 * @param list -> $L.list
 */
function isJoinedCI(record, object, list) {

    if (funcs.index(funcs.filename(record), vars.$G_joinfiles) > 0) {
        if (record["logical.name"] == list["logical.name"] && record["current.phase"] != list["current.phase"]) {
            return true;
        }
    }

    return false;
}


/**
 * check whether CI is retired or not
 *
 * @param {String} logicalName
 * @returns {Boolean}
 */
function isCIRetired(logicalName) {
    if (!logicalName) {
        return true;
    }

    var ci = $("!device").fields("istatus").find("logical.name=:name", logicalName).one();
    if (!ci) {
        return true;
    }

    return (ci.istatus == 'Retired/Consumed');
}


/**
 * filter out retired CIs
 *
 * @param {SCDatum} logicalNames
 * @returns {Array}
 */
function filterOutRetiredCIs(logicalNames) {
    var cis = [];

    var i;
    var length = lib.ArrayUtil.length(logicalNames);

    for (i = 0; i < length; i++) {
        var logicalName = logicalNames[i];
        if (!isCIRetired(logicalName)) {
            cis.push(logicalName);
        }
    }

    return cis;
}


/**
 * return allowed CI types according to the security setting
 *
 * @returns {Array} [types, names]
 */
function getAllowedTypes() {
    var fullTypes = [vars.$G_devtypes, vars.$G_devnames];

    var area = lib.security.getArea("device");
    var allowedTypes = lib.security.getToken(area, "allowedCategory");

    if (allowedTypes == null) {
        return fullTypes;
    }

    allowedTypes = allowedTypes.toArray();
    if (allowedTypes.length == 0) {
        return fullTypes;
    }

    var types = [];
    var names = [];

    var i;
    var length = vars.$G_devtypes.length();
    for (i = 0; i < length; i++) {
        if (allowedTypes.indexOf(vars.$G_devtypes[i]) >= 0) {
            types.push(vars.$G_devtypes[i]);
            names.push(vars.$G_devnames[i]);
        }
    }

    return [types, names];
}