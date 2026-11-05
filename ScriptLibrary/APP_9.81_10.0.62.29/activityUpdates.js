var $ = lib.c.$;
var logger = getLog("activityUpdates");


function relatedRecordUpdate(id, filename, relatedFile, activityType, activityText, custVisible, needNotifySD) {
    if (id == null) {
        return false;
    }

    var relation = new SCFile("screlation", SCFILE_READONLY);
    relation.setFields("source");

    var sql;
    var relatedFileAlias = relatedFile;
    var filenameAlias = filename;
    var unique = "number";

    if (relatedFileAlias == "probsummary") {
        relatedFileAlias = "problem";
    }

    if (filenameAlias == "probsummary") {
        filenameAlias = "problem";
    }

    if (relatedFile == "rootcause" || relatedFile == "knownerror") {
        unique = "id";
    }

    if (relatedFile == "incidents") {
        unique = "incident.id";
    }

    sql = "depend=\"" + id + "\" and " +
        "depend.filename=\"" + filenameAlias + "\" and " +
        "source.filename=\"" + relatedFileAlias + "\" and " +
        "source.active=true\"";

    if (relation.doSelect(sql) == RC_SUCCESS) {
        do {
            var record = new SCFile(relatedFile);
            var record_id = relation.source;
            if (record.doSelect("" + unique + "=\"" + record_id + "\"") == RC_SUCCESS) {
                lib.activityUpdatesTailoring.setSpecificFields(record, relatedFile, activityType, custVisible);
                updateRecord(record, activityType, activityText, custVisible);

                /// QCRQ1E97738, to send notification HTML email to interaction's contacts, modified by wangxun(xunw@hp.com), 
                if (needNotifySD && relatedFile === "incidents" && custVisible === true) {
                    lib.sdUtil.sendEmailToRelatedIntertion(record, record);
                }
                /// modified by wangxun

                if (relatedFileAlias == "rootcause" && filenameAlias == "knownerror" && activityType == "Error Closure") {
                    var screlation = new SCFile("screlation");

                    sql = "depend.filename=\"" + filenameAlias + "\" and " +
                        "depend.active=true and " +
                        "source = \"" + record_id + "\" and " +
                        "source.filename=\"" + relatedFileAlias + "\" and " +
                        "source.active=true";

                    if (screlation.doSelect(sql) == RC_NO_MORE) {
                        if (lib.context.GenerateCount(screlation) == 0) {
                            var strCurPhase = "XX";

                            while (record.current_phase != strCurPhase) {
                                strCurPhase = record.current_phase;
                                record.doAction("nextphase");
                            }
                        }
                    }
                }
            }
        }
        while (relation.getNext() == RC_SUCCESS);
    }

    cleanActivityFields();

    return true;
}

function updateFromQuery(filename, query, activityType, activityText, custVisible) {
    custVisible = ((custVisible == true || custVisible == "true") ? true : false);
    var record = new SCFile(filename);
    if (record.doSelect(query) == RC_SUCCESS) {
        lib.activityUpdatesTailoring.setSpecificFields(record, filename, activityType, custVisible);
        updateRecord(record, activityType, activityText, custVisible);
    }
}

function updateRecord(record, activityType, activityText, custVisible) {

    setActivityFields(activityType, activityText);

    var filename = funcs.filename(record);

    //Journal Update 
    if (filename === "request") {
        lib.RequestUtil.journalAction(record, vars['$G.bg.activity.text']);
    } else if (filename === "probsummary") { //do nothing, IM module have done this.
    } else if (filename === "cm3r") {
        if (record.update_action == null) {
            record.update_action = [""];
        }

        var len = activityText.length();
        if (len > 0) {
            var i;
            for (i = len - 1; i >= 0; i--) {
                record.update_action = funcs.insert(record.update_action, 1, 1, activityText[i]);
            }
        }
    } else if (filename === "rootcause") {
        $("#problemService").journalUpdate(record, vars['$G.bg.activity.text']);
    }

    var visible = record["cust.visible"];
    record["cust.visible"] = custVisible;

    var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
    var bypassValidationOrig = vars.$bypass_failed_validation;

    vars.$bypass_bg_authcheck = true;
    vars.$bypass_failed_validation = true;

    vars.$sync_activity = true;
    var result = record.doAction("save");
    vars.$sync_activity = false;
    vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
    vars.$bypass_failed_validation = bypassValidationOrig;

    var tablename = funcs.scmsg(filename, "tablename");
    var key = record.getUniqueFields()[0];
    var recordId = record[key];

    if (result == RC_SUCCESS) {
        // reset custom visible
        if (record["cust.visible"] != visible) {
            record["cust.visible"] = visible;

            var ret = new SCDatum();
            var triggerStatus = funcs.sysinfo_get("trigger");
            funcs.rtecall("trigger", ret, 0);
            result = record.doUpdate();
            funcs.rtecall("trigger", ret, triggerStatus);

            if (result != RC_SUCCESS) {
                logger.error(`${tablename} ${recordId} reupdate failed.`);
            }
        }
    }
    // save failed
    else {
        if (result == RC_CANT_HAVE || result == RC_MODIFIED) {
            logger.warn(`${tablename} ${recordId} update failed, retry schedule update.`);
            scheduleActivityUpdate(record, activityType, activityText, custVisible);
        } else {
            logger.error(`${tablename} ${recordId} update failed.`);
        }
    }
}

function scheduleActivityUpdate(record, type, text, custVisible) {
    var schedule = new SCFile("schedule");
    schedule._class = "linker";

    // expireation less then linker processor interval to execute next round
    var sched = new Date(Date.now() + 40 * 1000);
    schedule.expiration = sched;

    schedule.name = "Interoperability Record - Activity Update";
    schedule.application = "sc.activity.bg.update";

    var dTag = new Datum();
    funcs.tag(dTag, record);

    schedule.strings[0] = dTag;
    schedule.strings[1] = type;
    schedule.strings[2] = custVisible ? ("" + custVisible) : "";
    schedule.strings1 = text;

    return schedule.doInsert() == RC_SUCCESS;
}


function initActivityFields() {
    vars.$G_bg_activity_type = "External Update";
    vars.$G_bg_activity_text[0] = "External Update";
}

function setActivityFields(activityType, activityText) {
    if (activityType != null) {
        vars.$G_bg_activity_type = activityType;
    }
    if (activityText != null) {
        vars.$G_bg_activity_text = activityText;
    }
}

function readActivityType() {
    return vars.$G_bg_activity_type;
}

function readActivityAction() {
    return vars.$G_bg_activity_text;
}

function cleanActivityFields() {
    vars.$G_bg_activity_text = null;
    vars.$G_bg_activity_type = null;
}

function getActivityFilename(filename) {
    var act_filename = null;
    var object = new SCFile("Object", SCFILE_READONLY);
    object.setFields(["activitylog.file.name"]);
    var query = "file.name=\"" + filename + "\"";
    var rc = object.doSelect(query);
    if (rc == RC_SUCCESS) {
        act_filename = object["activitylog.file.name"];
    }

    return act_filename;
}

function getMailReceiverString(receivers) {
    var str = "";
    var i;
    for (i = 0; i < receivers.length; i++) {
        if (i != 0) {
            str += ";";
        }
        str += receivers[i];
    }

    return str;
}

function addActivitySendMail(filename, mail) {
    if (filename == null || mail == null) {
        return;
    }

    var act_filename = getActivityFilename(filename);
    if (act_filename == null || funcs.lng(act_filename) == 0) {
        return;
    }

    var activity = new SCFile(act_filename);

    activity["number"] = mail["reference.id"];
    activity["datestamp"] = mail["date.to.send"];
    activity["operator"] = funcs.operator();

    var number = new Datum();
    var rc = new Datum();
    funcs.rtecall("getnumber", rc, number, act_filename);
    activity["thenumber"] = number;

    activity["type"] = "Send Mail";
    activity["cust.visible"] = false;
    var content = [];
    if (mail["subject"] != null) {
        content.push(mail["subject"]);
        content.push("");
    }
    content.push("From:      " + mail["user.from"]);
    content.push("Sent:      " + funcs.str(mail["date.to.send"]));
    if (mail["user.array"] != null && funcs.lng(mail["user.array"]) > 0) {
        content.push("To:         " + getMailReceiverString(mail["user.array"].toArray()));
    } else if (mail["user.to"] != null) {
        content.push("To:         " + mail["user.to"]);
    } else if (mail["user.group"] != null) {
        content.push("To:         " + mail["user.group"]);
    }
    if (mail["ccuser.array"] != null && funcs.lng(mail["ccuser.array"]) > 0) {
        content.push("Cc:         " + getMailReceiverString(mail["ccuser.array"].toArray()));
    }
    //if (mail["bccuser.array"] != null && funcs.lng(mail["bccuser.array"]) > 0) {
    //    content.push("Bcc:      " + getMailReceiverString(mail["bccuser.array"].toArray()));
    //}

    if (mail["subject"] != null) {
        content.push("Subject:  " + mail["subject"]);
    }
    content.push("");
    lib.ArrayUtil.addAll(content, mail["text"]);
    activity["description"] = content;

    activity.doInsert();
}