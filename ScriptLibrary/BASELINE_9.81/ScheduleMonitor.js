var log = getLog('sch.monitor');
// log.setLevel('debug');

var MONITOR_USER = 'sch-monitor';
var MONITOR_LOCK = 'bg:sch:lock:monitor';
var TABLE_MONITOR = 'schmonitor';

/** Wrapper for Lock */
function lock(name) {
    return RC_SUCCESS == Lock(name);
}

/** Wrapper for Unlock */
function unlock(name) {
    return RC_SUCCESS == Unlock(name);
}

function _desc(item) {
    return 'id=' + item.id + ', class=' + (item['class'] || item.sched_class) + ' name=' + item.name;
}

/** Wrapper for checkLockOwnerExists */
function isLockOwnerExists(name) {
    return RC_SUCCESS == checkLockOwnerExists(name);
}

/**
 * If a schedule lock is more than a fix time
 *
 */
function checkDeadLocks(actionList, dateStr) {
    var monitorUser = getMonitorClass();
    var sql = 'resourcename#"bg:sch:id:" and lockat < \'' + funcs.str(dateStr) + "'";
    log.debug('checkDeadLocks:sql=', sql);
    // Find locks which is before 10 minutes
    lib.c
        .$('!lock')
        .fields('resourcename', 'lockat', 'user')
        .find(sql)
        .each(function(item) {
            if (item.user == monitorUser) {
                log.info('checkDeadLocks:foceUnlock ' + name + ', which is by ' + monitorUser);
                forceUnlock(name);
                return;
            }
            var name = item.resourcename;
            log.debug('checkDeadLocks:check lock=', item.resourcename);
            // check owner schedule process if it is alive
            // If alive, ignore it
            if (isLockOwnerExists(name)) {
                log.debug('checkDeadLocks:lock owner exists, ignore it, lock=', item.resourcename);
                return;
            }

            // Not Found, the owner proces should run to error,
            // Mark the schedule record and unlock the schedule
            log.debug('checkDeadLocks:lock owner run to error, lock=', item.resourcename);
            fixDeadLockSchedule(actionList, name);

            log.warn('checkDeadLocks:forceUnlock:', name);
            actionList.push({
                type: 'force-unlock',
                value: name
            });
            forceUnlock(name);
        });
}

/**
 * Mark dead lock schedule as error
 */
function fixDeadLockSchedule(actionList, name) {
    // Try to find the schedule which is locked
    var index = name.lastIndexOf(':');
    var schId = name.substring(index + 1);
    log.debug('fixDeadLockSchedule::fix shedule id, =', schId);
    var sch = lib.c
        .$('!schedule', true)
        // .fields('schedule.id', 'name', 'class', 'sched.class', 'application')
        .find('schedule.id="' + schId + '"')
        .one();
    if (null == sch) {
        return;
    }

    // If the schedule is still running, mark it as error
    if (sch.status == 'application running') {
        rescheduleRunningRecord(actionList, sch);
    }
}

/**
 * Reschedule Running Schedule Record
 * @param {*} item
 * @returns
 */
function rescheduleRunningRecord(actionList, item) {
    if (log.isDebugEnabled()) {
        log.debug('rescheduleRunningRecord::begin schedule', _desc(item));
    }

    var lockName = schLock(item.schedule_id);
    var actionOwner = item.action_owner;
    if (isLockOwnerExists(actionOwner)) {
        log.debug('rescheduleRunningRecord::schedule owner is still runnning, ingore it');
        return;
    }

    try {
        if (!lock(lockName)) {
            return;
        }

        actionList.push({
            type: 'reschedule-running',
            value: item.schedule_id + '-' + item.name
        });
        log.info('reschedule running schedule: ', _desc(item));
        if (log.isDebugEnabled()) {
            log.debug('rescheduleRunningRecord:reschedule running schedule', funcs.str(item));
        }

        item['class'] = item['sched.class'];
        item.status = 'rescheduled';
        item['action.owner'] = '';

        var rc = item.doUpdate();
        if (RC_SUCCESS == rc) {
            log.info('succeeded to reschedule running schedule:', _desc(item));
        } else {
            log.info('failed to reschedule running schedule:', _desc(item));
        }
    } catch (e) {
        log.error('error to reschedule record:', e, funcs.str(schedule));
    }

    unlock(lockName);
}

/**
 * Check running schedule without Dead Lock
 * @param {*} date
 */
function checkRunningSchedule(actionList, dateStr) {
    // var dateStr = funcs.str(new Date(funcs.tod().getTime() - 600 * 1000));
    // expiration time > 10 minutes
    var sql = 'status="application running" and action.time<\'' + dateStr + "'";
    log.debug('checkRunningSchedule:sql=', sql);
    lib.c
        .$('!schedule', true)
        .find(sql)
        .each(function(item) {
            var actionOwner = item.action_owner;
            if (log.isDebugEnabled()) {
                log.debug('checkRunningSchedule:', _desc(item));
            }
            if (!isLockOwnerExists(actionOwner)) {
                // revert to
                var lockName = schLock(item.schedule_id);
                if (lock(lockName)) {
                    rescheduleRunningRecord(actionList, item);
                    unlock(lockName);
                }
            }
        });
}

/**
 * Remove Stop Schedule that it is not for alive SM threads
 */
function checkStopSchedule(actionList, dateStr) {
    // var dateStr = funcs.str(new Date(funcs.tod().getTime() - 60 * 1000));
    // expiration time > 10 minutes
    var sql = 'application="scheduler.stop" and expiration<\'' + dateStr + "'";
    log.debug('checkStopSchedule:sql=', sql);
    lib.c
        .$('!schedule', true)
        .find(sql)
        .each(function(item) {
            var actionOwner = item.strings1[0];
            if (!isLockOwnerExists(actionOwner)) {
                log.info('delete stop schedule for:' + actionOwner, 'schedule.id=', item.schedule_id, ',name=' + item.name);
                actionList.push({
                    type: 'delete-stop-schdule',
                    value: item.schedule_id + '-' + item['class'] + '-' + actionOwner
                });
                item.doDelete();
            }
        });
}

function _addToBgList(bgList, name) {
    var currentCount = bgList[name] || 0;
    bgList[name] = currentCount + 1;
}

/**
 * Background Processes that of "System"
 *
 * @returns
 */
function listBgProcess() {
    var systemList = funcs.processes('SYSTEM');
    var bgList = {};
    for (var k = 0; k < systemList.length(); k++) {
        var item = systemList[k].toArray();
        var userName = item[3];
        if (userName.indexOf('ThreadControllerId-') == 0) {
            continue;
        }

        _addToBgList(bgList, userName);
    }

    var list = [];
    for (var item in bgList) {
        list.push({
            name: item,
            count: bgList[item]
        });
    }

    list.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase);
    return list; // JSON.stringify(bgList);
}

function schLock(id) {
    return 'bg:sch:id:' + id;
}

function agentLock() {
    return 'bg:sch:agent:' + user.processID + ':' + user.threadID;
}

function createMail(templateName, username, emailAddr, actionList, bgList, oldBgList) {
    let lang = vars['$G.my.language'] || 'en';
    var $record = {
        bgList: bgList,
        oldBgList: oldBgList,
        actionList: actionList
    };

    var emailSubject = lib.htmlemailtemplates.getMailHeader(templateName, $record, null, null, lang);
    var emailBody = lib.htmlemailtemplates.getMailBody(templateName, $record, null, null, lang);

    if (emailBody == null) {
        return null;
    }

    var mail = new SCFile('mail');
    mail['user.from'] = username;
    mail['user.to'] = emailAddr;
    mail['user.array'] = [emailAddr];
    mail['subject'] = emailSubject;
    mail['text'] = emailBody.split('\n');
    mail['date.to.send'] = funcs.tod();
    mail['status'] = 'sent';
    mail['application'] = 'email';
    mail['bccuser.array'] = null;
    mail['ccuser.array'] = null;

    return mail;
}

// lib.systemSettings.getStringValue('')
// lib.systemSettings.getNumberValue('')

function sendNotification(actionList, bgList, oldBgList) {
    var emailTo = getNotifyEmail();
    if (!emailTo) {
        log.info('No notify email found, ignore check notification.');
        return;
    }

    if (actionList.length == 0 && JSON.stringify(bgList) == JSON.stringify(oldBgList)) {
        log.info('No actions and no change to background list, ignore notification.');
        return;
    }

    if (!lib.ScheduleCustom.shouldSendEmail(actionList, bgList, oldBgList)) {
        return;
    }

    // "EmailUserLocked", username, emailAddr, lang, ["Username"], [username]
    var userName = 'SheduleAdmin';
    var emailTemplate = 'EmailScheduleMonitor';
    if (log.isDebugEnabled()) {
        log.debug('createMail: userName:', userName);
        log.debug('createMail: emailTo:', emailTo);
    }

    var mail = createMail(emailTemplate, userName, emailTo, actionList, bgList, oldBgList);
    if (mail) {
        lib.ForgetPassword.sendMail(mail);
    }
}

var bgList = {};

function setBgList(list) {
    bgList = list;
}

function getBgList() {
    return bgList;
}

function mergeList(bgList, oldBgList) {
    let map = new Map();
    bgList.forEach(item => map.set(item.name, ({
        name: item.name,
        from: 0,
        to: item.count
    })));

    for (let item of oldBgList) {
        if (map.has(item.name)) {
            map.get(item.name).from = item.count;
        } else {
            map.set(item.name, {
                name: item.name,
                to: 0,
                from: item.count
            });
        }
    }

    var ret = [];
    for (let item of map.values()) {
        let isSame = item.from == item.to;
        ret.push({
            name: item.name,
            from: item.from,
            to: item.to,
            isSame: isSame
        });
    }

    return ret.sort((a, b) => (a.name > b.name))
}

/**
 * Build Background Process Count Table for Email
 */
function buildBgListTable(bgList, oldBgList) {
    var NAME = funcs.scmsg('background-process', 'bg');
    var FROM = funcs.scmsg('from', 'bg');
    var TO = funcs.scmsg('to', 'bg');

    var css = '<style>table.bg th {text-align:left} table.bg th.count{text-align:center; width:60px;}  tr.changed{ background-color: #fdf6ec; }td.count{ text-align: center; }</style>';
    var begin = '<table class="bg" border="1px" cellspacing="0" style="border-collapse: collapse;" width="400px">' +
        '<thead><th>' + NAME + '</th><th class="count">' + FROM + '</th><th class="count">' + TO + '</th></thead><tbody>';
    var end = '</tbody></table>';
    var rows = '';

    var changeList = mergeList(bgList, oldBgList);
    for (var k = 0; k < changeList.length; k++) {
        var bg = changeList[k];
        var trCss = bg.isSame ? '' : 'class="changed"';

        rows = rows + '<tr ' + trCss + ' ><td>' + bg.name + '</td><td class="count">' + bg.from + '</td><td class="count">' + bg.to + '</td></tr>';
    }

    return css + begin + rows + end;
}

/**
 * Build Action List Table for Email
 */
function buildActionListTable(actionList) {
    if (!actionList || actionList.length == 0) {
        return '';
    }

    var actionName = funcs.scmsg('Action', 'sccaption');
    var detailName = funcs.scmsg('Detail', 'sccaption');
    var actionTitle = funcs.scmsg('action-title', 'bg');

    var begin = '<table class="bg" border="1px" cellspacing="0" style="border-collapse: collapse;" width="400px"><thead><th>' + actionName + '</th><th>' + detailName + '</th></thead><tbody>';
    var end = '</tbody></table>';
    var rows = '';

    var actionNameList = ['force-unlock', 'reschedule-running', 'delete-stop-schdule'];
    var actionNameMap = {};
    for (var item in actionNameList) {
        var name = actionNameList[item];
        actionNameMap[name] = funcs.scmsg(name, 'bg-action');
    }

    for (var k = 0; k < actionList.length; k++) {
        var action = actionList[k];
        rows = rows + '<tr><td>' + (actionNameMap[action.type] || action.type) + '</td><td>' + action.value + '</td></tr>';
    }

    return begin + rows + end;
}

/*********************************************************/
/********* Monitor Configuration *************************/
/*********************************************************/
function getMonitorValue(field) {
    var item = lib.c
        .$('!' + TABLE_MONITOR)
        .fields(field)
        .select('id="1"')
        .one();
    return item && item[field];
}

function getMonitorClass() {
    if (!vars['$L.monitor.class']) {
        vars['$L.monitor.class'] = getMonitorValue('scheduleClass') || MONITOR_USER;
    }

    return vars['$L.monitor.class'];
}

function getNextRun() {
    return getMonitorValue('nextRun') || funcs.tod();
}

function getSleepTime() {
    if (!vars['$L.monitor.sleep.time']) {
        vars['$L.monitor.sleep.time'] = getMonitorValue('sleepTime') || funcs.val('0 00:10:00', 3);
    }
    return vars['$L.monitor.sleep.time'];
}

function getNotifyEmail() {
    return getMonitorValue('notifyEmail');
}

function getBgList() {
    return getMonitorValue('bgList') || '{}';
}

function saveNextRun(date) {
    var item = lib.c
        .$('!' + TABLE_MONITOR, true)
        // .fields('nextRun')
        .select('id="1"')
        .one();

    if (item == null) {
        item = new SCFile(TABLE_MONITOR);
        item.id = '1';
        item.nextRun = date;
        item.doInsert();
        return;
    }

    item.nextRun = date;
    item.doUpdate();
}

function saveBgList(bgList) {
    var item = lib.c
        .$('!' + TABLE_MONITOR, true)
        // .fields('nextRun')
        .select('id="1"')
        .one();

    if (item == null) {
        item = new SCFile(TABLE_MONITOR);
        item.id = '1';
        item.bgList = bgList;
        item.doInsert();
        return;
    }

    item.bgList = bgList;
    item.doUpdate();
}
/*********************************************************/
/********* End of Monitor Configuration ******************/
/*********************************************************/
function _run() {
    log.debug('Schedule monitor gets to work.');
    log.debug('Got monitor unlock, checking sleep time');
    var nextRun = getNextRun();
    if (nextRun && nextRun > funcs.tod()) {
        if (log.isDebugEnabled()) {
            log.debug('Not up to run time, sleeping until: ' + funcs.str(nextRun));
        }
        return;
    }

    var sleepTime = getSleepTime();
    // var newNextRun = new Date(funcs.tod().getTime() + sleepTime.getTime());
    var newNextRun = funcs.parse_evaluate("tod()+'" + funcs.str(sleepTime) + "'", 2);
    if (log.isDebugEnabled()) {
        log.debug('Start to work, set nextRun to:' + funcs.str(newNextRun));
    }

    saveNextRun(newNextRun);

    vars.$L_locked = true;

    var actionList = [];

    var dateStr = funcs.str(new Date(funcs.tod().getTime() - 60 * 1000));

    if (log.isDebugEnabled()) {
        log.debug('checkDeadLocks with date:', dateStr);
    }
    checkDeadLocks(actionList, dateStr);

    if (log.isDebugEnabled()) {
        log.debug('checkRunningSchedule with date:', dateStr);
    }
    checkRunningSchedule(actionList, dateStr);

    if (log.isDebugEnabled()) {
        log.debug('checkStopSchedule with date:', dateStr);
    }
    checkStopSchedule(actionList, dateStr);

    var bgList = listBgProcess();
    var oldBgList = getBgList();
    saveBgList(JSON.stringify(bgList));

    if (log.isDebugEnabled()) {
        log.debug('sendNotification actionList:', JSON.stringify(actionList));
        log.debug('sendNotification     bgList:', JSON.stringify(bgList));
        log.debug('sendNotification  oldBgList:', oldBgList);
    }
    sendNotification(actionList, bgList, JSON.parse(oldBgList));

    log.debug('Schedule monitor work is complete.');
    return true;
}

function run() {
    // log.debug('>>> begin-run');
    if (!vars.$L_locked && !lock(MONITOR_LOCK)) {
        if (!isLockOwnerExists(MONITOR_LOCK)) {
            log.info('Force monitor unlock: ' + MONITOR_LOCK);
            forceUnlock(MONITOR_LOCK);
            return false;
        }

        log.debug('Failed to get monitor lock, sleeping..');
        return true;
    }

    try {
        _run();
    } catch (e) {
        log.error(e, e.stack);
    }

    unlock(MONITOR_LOCK);
}

// function run2() {
//   var bgList = listBgProcess();
//   var actionList = [];
//   var mail = createMail('EmailScheduleMonitor', '', '', 'en', bgList, actionList);

//   print(mail.text.toArray().join('\n'));
// }
//
//run();