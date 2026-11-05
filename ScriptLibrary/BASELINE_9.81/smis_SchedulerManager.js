/******************************************************
 * Module Name: SMIS Schedule Manager
 * Function: provide functions to manage schedule record
 * Author: Xing, Jiang-Bin
 * Version: 1.01
 * Creation Date: spr, 2009
 *******************************************************/

function addScheduleRecord(configItem, scheduleClass) {
    if (!scheduleClass) {
        scheduleClass = getInfoType(configItem);
    }

    var log = _getLog(configItem);
    var sch = new SCFile("schedule");

    var RC = sch.doSelect("name = \"" + configItem.name + configItem.intId + "\"");
    var existed = false;

    if (RC == RC_SUCCESS) {
        if (log.isDebugEnabled()) {
            log.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_1", "smis", [configItem.name + configItem.intId]));
        }
        existed = true;
    }

    sch.name = configItem.name + configItem.intId;
    var className = _getSchClassName(scheduleClass);
    sch["class"] = className;
    sch["sched.class"] = className;

    sch.repeat = configItem.getIntervalTimeDate();
    sch.repeata = false; //Annually
    sch.repeatb = false; //Semi-Annually
    sch.repeatm = false; //Monthly
    sch.repeatq = false; //Quarterly
    sch.strings = [sch.name, sch.name];
    //the four options are all false, means the "Other" is true

    var pattern = /\$+\w+\$/i;

    sch.javascript = lib.smis_Constants.SCHEDULER_RUN().replace(pattern, configItem.intId);
    sch.description = ["Description"]; //TODO

    var result;

    if (existed) {
        result = sch.doUpdate();
    } else {
        result = sch.doInsert();
    }

    return result == RC_SUCCESS;
}

/*
 * get schedule record's status
 */
function getScheduleStatus(configItem) {
    return getScheduleStatusByName(configItem.name + configItem.intId);
}

function getScheduleStatusByName(name) {
    var sch = new SCFile("schedule", SCFILE_READONLY);
    sch.setFields(["status"]);
    var RC = sch.doSelect("name = \"" + name + "\"");

    if (RC == RC_SUCCESS) {
        return sch.status;
    }

    return null;
}


function deleteScheduleRecord(configItem) {
    var log = _getLog(configItem);
    var sch = new SCFile("schedule");
    var RC = sch.doSelect("name = \"" + configItem.name + configItem.intId + "\"");

    if (RC == RC_SUCCESS) {
        if (log.isDebugEnabled()) {
            log.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_2", "smis", [sch.name]));
        }

        RC = sch.doDelete();
        return RC == RC_SUCCESS;
    }

    return false;
}

// check if the scheduler has schedule related
function hasScheduleRecord(schedClass) {
    schedClass = _getSchClassName(schedClass);

    var sch = new SCFile("schedule", SCFILE_READONLY);
    sch.setFields(["schedule.id"]);

    var RC = sch.doSelect("sched.class = \"" + schedClass + "\"");
    return RC == RC_SUCCESS;
}


function addInfoRecord(configItem, type) {
    if (!type) {
        type = getInfoType(configItem);
    }

    var info = new SCFile("info");
    var log = _getLog(configItem);

    var RC = info.doSelect("type = \"" + type + "\"");

    var existed = false;

    if (RC == RC_SUCCESS) {
        if (log.isDebugEnabled()) {
            log.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_3", "smis", [type]));
        }
        existed = true;
        return true;
    }

    info.type = type;
    info.description = "Info for the integration " + configItem.template; //TODO
    info.format = "info.startup";

    var dd = 30; //configItem.intervalTime;

    var className = _getSchClassName(info.type);

    info["process.start.infos"][0].name = info.type;
    info["process.start.infos"][0].parameters = ["scheduler", className, "" + dd, "1"];
    info["process.start.infos"][0]["suppress.restart"] = false;

    var result;

    if (existed) {
        result = info.doUpdate();
    } else {
        result = info.doInsert();
    }

    return result == RC_SUCCESS;
}

function deleteInfoRecord(configItem, type) {
    if (!type) {
        type = getInfoType(configItem);
    }

    var info = new SCFile("info");
    var log = _getLog(configItem);

    var RC = info.doSelect("type = \"" + type + "\"");

    if (RC == RC_SUCCESS) {
        if (log.isDebugEnabled()) {
            log.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_4", "smis", [info.type]));
        }
        RC = info.doDelete();
        return RC == RC_SUCCESS;
    }

    return false;
}


function addProcessRecordToStartup(configItem) {
    var log = _getLog(configItem);
    var info = new SCFile("info");

    var infoType = getInfoType(configItem);

    var rc = info.doSelect("type = \"startup\"");
    var processes = null;

    var existed = false;

    if (rc == RC_SUCCESS) {

        //check if the current record exists.
        processes = info["process.start.infos"];
        var length = processes.length();

        var i;
        var index = -1;
        for (i = 0; i < length; i++) {
            if (info["process.start.infos"][i].name == infoType) {
                existed = true;
                index = i;
                if (log.isDebugEnabled()) {
                    log.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_5", "smis"));
                }
                return true;
            }
        }

        if (index == -1) {
            index = length;
        }
        var dd = 30;

        var className = _getSchClassName(infoType);

        info["process.start.infos"][index].name = infoType;
        info["process.start.infos"][index].parameters = ["scheduler", className, "" + dd, "1"];
        info["process.start.infos"][index]["suppress.restart"] = false;
    }

    rc = info.doUpdate();

    return rc == RC_SUCCESS;
}

function removeProRecordInStartup(configItem, infoType) {

    var log = _getLog(configItem);
    var info = new SCFile("info");

    if (!infoType) {
        infoType = getInfoType(configItem);
    }

    var rc = info.doSelect("type = \"startup\"");
    var processes = null;

    var existed = false;

    if (rc == RC_SUCCESS) {
        //check if the current record exists.
        processes = info["process.start.infos"];
        var length = processes.length();

        var i;
        for (i = 0; i < length; i++) {
            if (info["process.start.infos"][i].name == infoType) {
                if (log.isDebugEnabled()) {
                    log.debug("smis_SchedulerManager", funcs.scmsg("SchedulerManager_6", "smis", [infoType]));
                }
                info["process.start.infos"][i].name = null;
                info["process.start.infos"][i].parameters = null;
                info["process.start.infos"][i]["suppress.restart"] = null;
                existed = true;
                break;
            }
        }
    }

    if (existed) {
        rc = info.doUpdate();
    }
    return rc == RC_SUCCESS;
}


function getProcID(config) {
    var procs = new SCDatum();
    procs.setType(8); //type array
    procs = funcs.processes();
    var procsLen = procs.length();
    var className = _getSchClassName(getInfoType(config));

    var procsCount;
    for (procsCount = 0; procsCount < procsLen; procsCount++) {
        // var proc = procs[procsCount];
        if (procs[procsCount + .3] == className) {
            return procs[procsCount + .1];
            // procs[procsCount+.4] Idle
            // procs[procsCount+.0] last expiration
        }
    }

    return null;
}

function getProcHost(config) {
    var procs = new SCDatum();
    procs.setType(8); //type array
    procs = funcs.processes();
    var procsLen = procs.length();
    var className = _getSchClassName(getInfoType(config));
    print(className);
    var procsCount;
    for (procsCount = 0; procsCount < procsLen; procsCount++) {
        if (procs[procsCount][3] == className) {
            return procs[procsCount][7];
            // procs[procsCount+.4] Idle
            // procs[procsCount+.0] last expiration
        }
    }

    return null;
}

function triggerSchedule(instanceConfig) {
    var rteReturnValue = new SCDatum();
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    argVals.setType(8); //type array
    argNames.setType(8); //type array
    var argVal;

    argVal = new SCDatum();
    argVal.setType(2); //string                           
    argVal = "name";
    argNames.push(argVal);

    argVal = new SCDatum();
    argVal.setType(6); //string                           
    argVal = getInfoType(instanceConfig);
    argVals.push(argVal);

    funcs.rtecall("callrad",
        rteReturnValue,
        "scheduler.start", //RAD app name
        argNames,
        argVals,
        true); //false to run in same thread, true to run in new thread                                 
}


/**
 * Update the stopSchedule to use RAD 'scheduler.stop' according to QCCR63491
 *
 */
function stopSchedule(config, schName) {
    if (!schName) {
        schName = _getSchClassName(getInfoType(config));
    }

    var title = "Stop " + schName + " Process";
    var fSchedule = new SCFile("schedule");
    if (fSchedule.doSelect('name="' + title + '"') != RC_SUCCESS) {
        fSchedule.name = title;
        fSchedule._class = schName;
        fSchedule.sched_class = schName;
        fSchedule.expiration = funcs.tod();
        fSchedule.application = "scheduler.stop";
        fSchedule.doInsert();
    }
}


function _getSchClassName(oriClassName) {
    if (oriClassName == null || oriClassName == "") {
        return "";
    }

    var className = oriClassName;
    className = className.replace(" ", "_");

    return className;
}

//Get Logger
function _getLog(configItem) {

    var log = new(lib.smis_Logger.getClass())();

    if (configItem != null) {
        log.setDefaultLevel(configItem.loggerLevel);
    }

    return log;
}


function getInfoType(config) {
    var type = config.name + config.intId;
    if (config.sharedScheduler != null && config.sharedScheduler != "") {
        type = "smis." + config.sharedScheduler;
    }

    return type;
}

/**
 * This method is specially for creating scheduler for upgrading.
 * It will create a scheduler with name "background purge/archive SMISTaskLog".
 */
function createSMISTaskLogArchiveSchedule() {
    var strScheduleName = "background purge/archive SMISTaskLog";

    var fschedule = new SCFile("schedule");
    var sql = "name=\"" + strScheduleName + "\"";
    var theXMLDate = new XMLDate(new Date("January 01, 2049 09:00:00"));
    if (fschedule.doSelect(sql) == RC_SUCCESS) {
        fschedule.expiration = theXMLDate.getDatum();
        fschedule.doUpdate();
    } else {
        fschedule.name = strScheduleName;
        fschedule["class"] = "report";
        fschedule["sched.class"] = "report";
        fschedule["description"] = ["Archive SMIS Task log records."];
        fschedule["strings"] = ["SMISTaskLog", "SMISTaskLog", "log.time<tod()-'7 00:00:00'", null, "purge", "append", "create", "update", null, "false", "winnt", null, null, null, null, "false"];
        fschedule["repeat"] = funcs.val("01 00:00:00", 3);
        fschedule["expiration"] = theXMLDate.getDatum();
        fschedule["number"] = 3;
        fschedule["application"] = "pa.main.appl.bg";
        fschedule.doInsert();
    }
}