var $ = lib.c.$;
var logger = getLog('slm.view');

var j = (item) => JSON.stringify(item, null, 4);
var s = funcs.str;


function querySlm(fileName, id) {
    try {
        if (isLog()) {
            log('querySlm::' + fileName + '=' + id);
        }
        let list = calcSlm(fileName, id);
        let json = j(formatItemList(list));

        if (isLog()) {
            log('querySlm::returned json=', json);
        }
        return json;
    } catch (e) {
        logger.warn(e);
        logger.warn(e.stack);
    }
}

// *******************************************************************************************************
// **
// * calculate related functions
// */
// *******************************************************************************************************

/**
 * Build JSON object for calenar view of SLM
 * @param {*} fileName
 * @param {*} id
 */
function calcSlm(fileName, id) {
    if (isLog()) {
        log('calcSlm::', fileName, id);
    }

    vars.$slaControl = $('!slamodulecontrol')
        .fields('use.phases', 'status.progression', 'customer.field', 'technician.field', 'ci.fields', 'group.field')
        .find('table.name=:tableName', fileName)
        .one();

    const respFieldsList = [
        'foreign.filename',
        'foreign.key',
        'slo.id',
        'slo.name',
        'initial.state',
        'final.state',
        'expiration.time',
        'running',
        'suspended',
        'breached',
        'current.status',
        'active',
        'start.time',
        'end.time',
        'agreement.id',
        'total.time',
        'agreement.category',
        'group',
        'calendar',
        'holiday',
        'timezone'
    ];

    let sql = 'foreign.filename=:fileName and foreign.key=:id and current.status~=5 ';

    let stateSeqMap = makeStateSeqMap(fileName, id);
    if (isLog()) {
        log('stateSeqMap', j(stateSeqMap));
    }
    let timeObject = makeTimeList(fileName, id, stateSeqMap);
    let returnList = [];

    let sloIdList = [];
    $('!sloresponse')
        .fields(respFieldsList)
        .find(sql, fileName, id)
        .each((item) => {
            returnList.push(calcResp(stateSeqMap, timeObject, item));
            sloIdList.push(item['slo.id']);
        });

    /*
    $('!sloresponsehist', true)
    .find(sql, fileName, id)
    .each(item => {
      if (sloIdList.indexOf(item['slo.id']) < 0) {
        sloIdList.push(item['slo.id']);
        returnList.push(calcResp(stateSeqMap, timeObject, item));
      }
    });
  */
    if (isLog()) {
        log('calcSlm::result::', j(returnList));
    }

    return returnList;
}

/**
 * Make time list object
 * return {
 *    stateList => for sla,
 *    fullList => for uc/ola
 * }
 * @param {*} fileName
 * @param {*} id
 */
function makeTimeList(fileName, id, stateSeqMap) {
    let stateList = makeStateList(fileName, id, stateSeqMap);
    let assignList = makeAssignList(fileName, id);
    let fullList = mergeTimeList(stateList, assignList);
    if (isLog()) {
        log('makeTimeList, stateList===', j(stateList));
        log('makeTimeList, assignList===', j(assignList));
        log('makeTimeList, fullList===', j(fullList));
    }
    return {
        stateList,
        fullList
    };
}

/**
 * Build State List which if from slaactive
 * @param {*} fileName
 * @param {*} id
 */
function makeStateList(fileName, id, stateSeqMap) {
    // let name = funcs.dbdict_helper('unique.key', fileName);
    let sql = 'foreign.filename=:fileName and foreign.key=:id';
    let slaactive = $('!slaactive').fields('state.change', 'start.time').find(sql, fileName, id).one();
    if (null == slaactive) {
        return [];
    }

    let stateList = [];
    let size = slaactive.state_change.length();
    let k;
    for (k = 0; k < size; k++) {
        var state = slaactive.state_change[k].state;
        var stateSeq = stateSeqMap[state];

        stateList.push({
            "type": 'state',
            "state": state,
            "stateSeq": stateSeq,
            "to": null,
            "time": slaactive.state_change[k].time
        });
    }

    if (isLog()) {
        log('makeStateList::stateList=', j(stateList));
    }

    return stateList;
}

/**
 * Assignment list
 * @param {*} fileName
 * @param {*} id
 */
function makeAssignList(fileName, id) {
    let assignList = [];

    let sql = 'foreign.filename=:fileName and foreign.key=:id';
    $('!assignmentlog')
        .fields('change.time', 'to.value')
        .sortBy('change.time')
        .find(sql, fileName, id)
        .each((item) =>
            assignList.push({
                type: 'assign',
                state: null,
                to: item.to_value,
                time: item.change_time
            })
        );

    return assignList;
}

/**
 * Merge statelist and assignlist
 * Used for ola/uc
 * @param {*} stateList
 * @param {*} assignList
 */
function mergeTimeList(stateList, assignList) {
    let list = [];
    let next = 0;
    let k;
    for (k = 0; k < stateList.length; k++) {
        let item = stateList[k];
        for (; next < assignList.length; next++) {
            let assign = assignList[next];

            if (item.time >= assign.time) {
                list.push(assign);
            } else {
                break;
            }
        }

        list.push(stateList[k]);
    }

    for (; next < assignList.length; next++) {
        list.push(assignList[next]);
    }

    for (k = 1; k < list.length; k++) {
        let item = list[k];

        if (item.type == 'assign') {
            item.state = list[k - 1].state;
            item.stateSeq = list[k - 1].stateSeq;
        }

        if (item.type == 'state') {
            item.to = list[k - 1].to;
        }
    }

    return list;
}

function _slaControl() {
    return vars.$slaControl;
}

/**
 * SLM statelist defined in slamodulecontrol
 * @param {*} table
 * @param {*} id
 */
function getSlmPhases(table, id) {
    let item = vars.$slaControl;

    if (item['use.phases']) {
        return lib.SLMHistory.getPhaseList(table, id);
    } else {
        let list = item['status.progression'].toArray();
        return list;
    }
}

/**
 * Make phase value object, the phase is ordered
 * @param {} list
 */
function _makeStateSeqMap(list) {
    let stateSeqMap = {};
    let k;
    for (k = 0; k < list.length; k++) {
        stateSeqMap[list[k]] = k + 1;
    }

    return stateSeqMap;
}

/**
 * Make phase value object, the phase is ordered
 * @param {*} table
 * @param {*} id
 */
function makeStateSeqMap(table, id) {
    return _makeStateSeqMap(getSlmPhases(table, id));
}

/**
 * calculate a sloresponse
 * @param {*} stateSeqMap 
 * @param {*} timeObject 
 * @param {*} resp 

return

{
  id,
  name,
  timeList,
  groups,
    [
      {
        name,
        timeList
      }
    ]
}

 */
function calcResp(stateSeqMap, timeObject, resp) {
    if (isLog()) {
        log('\n\n\n');
        log('calcResp::resp====' + resp['expiration.time']);
    }

    let sla = $('!sla').fields('support.groups', 'external.support.groups').find('agreement.id=:id', resp.agreement_id).one();
    let slo = $('!slo')
        .fields('name', 'initial.state', 'final.state', 'type', 'suspend.states', 'duration.method', 'duration.type', 'time')
        .find('slo.id=:id', resp.slo_id)
        .one();
    let groups = sla.support_groups.toArray();
    if (resp['agreement.category'] == 'uc') {
        groups = sla['external.support.groups'].toArray();
    }

    let respObj = {
        sloId: resp['slo.id'],
        sloName: slo.name,
        duration: {
            scope: slo['duration.method'],
            type: slo['duration.type'],
            interval: slo['time']
        },
        expiration: resp['expiration.time'],
        stateList: timeObject.stateList,
        assignList: timeObject.stateList,
        fullList: timeObject.fullList,
        slaId: resp['agreement.id'],
        slaType: resp['agreement.category'],
        slaGroups: groups,
        startState: slo['initial.state'],
        endState: slo['final.state'],
        suspendStates: slo['suspend.states'].toArray(),
        calendar: resp.calendar,
        holiday: resp.holiday,
        timezone: resp.timezone,
        group: resp.group,
        tableId: resp['foreign.key'],
        tableName: resp['foreign.filename'],
        suspended: resp['suspended'],
        now: new Date()
    };

    respObj.hasExpiration = true;
    if (!respObj.expiration) {
        respObj.hasExpiration = false;
        respObj.expiration = respObj.now;
    }

    if (isLog()) {
        log('calcResp::slaType >>>: slaType', respObj.slaType, 'slo=', respObj.sloId + ' - ' + respObj.sloName + ', now=', funcs.str(respObj.now));
    }

    let respTime = _calcResp(stateSeqMap, respObj);

    if (isLog()) {
        log('calcResp::respTime=', j(respTime));
    }

    // if (!hasExpiration && !respObj.duration.interval) {
    if (respObj.suspended) {
        var lastSuspendItem = null;
        if (respTime.timeList.length > 0) {
            let item = respTime.timeList[respTime.timeList.length - 1];
            if (item.suspend) {
                lastSuspendItem = item;
            }
        }

        if (isLog()) {
            log('calcResp::lastSuspendItem=', j(lastSuspendItem));
        }

        if (lastSuspendItem) {
            // find expiratin time from table
            var id = makeRespTimeId(respObj.tableName, respObj.tableId, respObj.sloId, respObj.group, respObj.slaType);
            var item = $('!sloresponsetime').fields('expiration').find('id=:id', id).one();

            if (null != item) {
                // respTime.timeList.push();
                respTime.timeList.push({
                    start: lastSuspendItem.start,
                    end: item.expiration,
                    expired: false,
                    suspend: false,
                    visible: false,
                    pending: true
                });
            }
        }
    }

    // calc time durations
    for (let item of respTime.timeList) {
        let interval = calcInterval(resp, item.start, item.end);
        item.interval = funcs.str(interval);
        if (isLog()) {
            log('calcResp::==> item, interval=', funcs.str(interval), '\t==> item=', j(item));
        }
    }

    if (isLog()) {
        log('calcResp::groups:', j(respTime.groups));
    }
    if (respTime.groups) {
        for (let group of respTime.groups) {
            for (let gtime of group.timeList) {
                gtime.interval = calcInterval(resp, gtime.start, gtime.end);
            }
        }
    }

    return respTime;
}

/**
  phase List for the slt
 */
function calcSltPhaseList(stateSeqMap, resp) {
    let stateSeqBegin = stateSeqMap[resp.startState];
    let stateSeqEnd = stateSeqMap[resp.endState];

    resp.stateSeqBegin = stateSeqBegin;
    resp.stateSeqEnd = stateSeqEnd;

    let suspendStateList = resp.suspendStates;

    let list = resp.stateList; // => for sla

    if (resp.slaType == 'ola' || resp.slaType == 'uc') {
        list = resp.fullList; // => for ola/uc
    }

    if (isLog()) {
        log('calcSltPhaseList >>>', list.length, j(list));
    }
    let begin = -1;
    let end = -1;

    let isRunning = true;

    // find start
    let k;
    for (k = 0; k < list.length; k++) {
        let phase = list[k];
        if (phase.type !== 'state') {
            continue;
        }

        let stateSeq = stateSeqMap[phase.state];
        if (isLog()) {
            log('calcSltPhaseList::begin, end, current=', stateSeqBegin, stateSeqEnd, stateSeq);
        }
        if (begin < 0 && stateSeq >= stateSeqBegin) {
            begin = k;
            break;
        }
    }

    if (begin < 0) {
        return {
            returnList: [],
            isRunning: false
        };
    }

    // find end,
    // from end of the list find the first posistion which is after the final phase
    for (k = list.length - 1; k >= begin; k--) {
        let phase = list[k];

        let stateSeq = stateSeqMap[phase.state];

        // move back to phase before the start
        if (k == list.length - 1 && stateSeq < stateSeqBegin) {
            isRunning = false;
        }

        // greater and equal to seqEnd, not isRunning
        if (stateSeq >= stateSeqEnd) {
            isRunning = false;
        }

        // find the first phase(from end) less than seqEnd, so the next phase is the end
        if (stateSeq < stateSeqEnd) {
            end = k + 1;
            break;
        }
    }
    if (end >= list.length - 1) {
        end = list.length - 1;
    }

    if (isLog()) {
        log('calcSltPhaseList, begin=', begin, ', end==', end + 1);
    }
    if (isLog()) {
        log('calcSltPhaseList::slice before list===', j(list));
    }
    let list2 = list.slice(begin, end + 1);
    if (isLog()) {
        log('calcSltPhaseList::slice after  list===', j(list2));
    }

    let returnList = list2.map(item => {
        // log('return state === ', j(item.state));
        return {
            type: item.type,
            state: item.state,
            to: item.to,
            time: item.time,
            stateSeq: item.stateSeq,
            scoped: item.stateSeq >= stateSeqBegin && item.stateSeq < stateSeqEnd,
            suspend: suspendStateList.indexOf(item.state) >= 0
        };
    });

    log('calcSltPhaseList::add now');
    // add last to now
    if (isRunning && returnList.length > 0) {
        if (isLog()) {
            log('calcSltPhaseList:: add now before       list===', j(list));
            log('calcSltPhaseList:: add now before returnList===', j(returnList));
        }
        let lastItem = returnList[returnList.length - 1];
        var nowItem = {
            type: lastItem.type,
            state: lastItem.state,
            to: lastItem.to,
            time: resp.now,
            scoped: true,
            suspend: lastItem.suspend
        };

        returnList.push(nowItem);
    }

    if (isLog()) {
        log('calcSltPhaseList::add now after===', j(returnList));
    }

    return {
        returnList,
        isRunning
    };
}

function dateAfter(date1, date2) {
    return date1.getTime() > date2.getTime();
}

function dateBefore(date1, date2) {
    return date1.getTime() < date2.getTime();
}

function dateEqual(date1, date2) {
    return date1.getTime() == date2.getTime();
}

/**
 * calculate ola time list
 * @param {*} groups
 * @param {*} returnList
 * @param {*} expiration
 *
 * @return
 * {
 *  groups [{
 *    name: 'name',
 *    timeList:[]
 *  }, ...],
 *  timeList:[],
 * }
 */
function calcOlaTimeList(groups, returnList, expiration, isRunning, now, isPendingAllowed) {
    if (isLog()) {
        log('calcOlaTimeList::groups = ', j(groups));
        log('calcOlaTimeList::returnList=', j(returnList));
        log('calcOlaTimeList::expiration', j(expiration));
        log('calcOlaTimeList::isRunning=', isRunning);
        log('calcOlaTimeList::now', j(now));
    }
    groups.has = item => groups.indexOf(item) >= 0;

    let samePeriod = (begin, item) => {
        return item.suspend === begin.suspend && item.scoped === begin.scoped;
    };

    let sameGroup = (begin, item) => {
        if (isLog()) {
            log('calcOlaTimeList::sameGroup', item.to, '<->', begin.to);
        }
        return item.to === begin.to;
    };

    if (returnList.length == 0 && !isRunning) {
        return {
            timeList: []
        };
    }

    let timeList = [];

    // Group Time List
    let groupTimeList = {};
    for (let group of groups) {
        groupTimeList[group] = [];
    }

    let beginItem = null;
    let groupBeginItem = null;
    let k;

    // find first phase which is in groups, and set k to beginitem
    for (k = 0; k < returnList.length; k++) {
        let item = returnList[k];
        item.index = k;

        if (isLog()) {
            log('calcOlaTimeList::try has', j(groups), item.to);
        }
        if (item.to && groups.has(item.to)) {
            beginItem = item;
            groupBeginItem = item;
            break;
        }
    }

    if (isLog()) {
        log('calcOlaTimeList::>>>>>> begin-item', k, returnList.length);
    }

    let addGroupTimePeriod = (endIndex, beginItem, endTime, expired, pending) => {
        if (isLog()) {
            log('calcOlaTimeList::>>>>> addGroupTimePeriod::' + beginItem.to);
        }

        if (!beginItem.scoped) return;

        groupTimeList[beginItem.to].push({
            startIndex: beginItem.index,
            endIndex: endIndex,
            start: beginItem.time,
            end: endTime,
            expired: expired,
            pending: pending,
            visible: !(beginItem.visible === false),
            suspend: beginItem.suspend
        });
    };

    let addTimePeriod = (item, endTime, expired, pending) => {
        if (!item.scoped) {
            return;
        }
        timeList.push({
            start: item.time,
            end: endTime,
            expired: expired,
            pending: pending,
            visible: !(item.visible === false),
            suspend: item.suspend
        });
    };

    // Loop for time period before expiration (not breached)
    let expired = false;

    let prevItem = beginItem;
    for (; k < returnList.length; k++) {
        let item = returnList[k];
        item.index = k;

        let isLast = k == returnList.length - 1;
        if (isLog()) {
            log('calcOlaTimeList::>>>>> process, isLast=', isLast, k, 'of', returnList.length, ', ', j(item));
        }
        // check expiration time
        if (dateAfter(item.time, expiration)) {
            if (beginItem) {
                addTimePeriod(beginItem, expiration, expired);
                addGroupTimePeriod(k, groupBeginItem, expiration, expired);
            }

            expired = true;
            break;
        }

        // check groups
        if (!groups.has(item.to)) {
            // skip time period which is not part of the slo
            if (!beginItem) continue;

            addTimePeriod(beginItem, item.time, expired);
            addGroupTimePeriod(k, groupBeginItem, item.time, expired);

            beginItem = null;
            groupBeginItem = null;

            continue;
        }

        if (!beginItem) {
            beginItem = item;
            groupBeginItem = item;
            continue;
        }

        // check suspend state
        if (item.to && (isLast || !samePeriod(beginItem, item))) {
            addTimePeriod(beginItem, item.time, expired);
            if (isLog()) {
                log('calcOlaTimeList::>>>>>process groupBeginItem = ', j(groupBeginItem));
                log('calcOlaTimeList::>>>>>process beginItem = ', j(beginItem));
                log('calcOlaTimeList::>>>>>process item = ', j(item));
            }
            addGroupTimePeriod(k, groupBeginItem, item.time, expired);

            beginItem = item;
            groupBeginItem = item;

            continue;
        }

        // check group
        if (!sameGroup(groupBeginItem, item)) {
            addGroupTimePeriod(k, groupBeginItem, item.time, expired);
            groupBeginItem = item;
        }
    }

    // loop for time period after expiration (breached)
    if (expired) {
        if (beginItem) {
            beginItem.time = expiration;
            groupBeginItem.time = expiration;
        }

        for (; k < returnList.length; k++) {
            let item = returnList[k];
            item.index = k;

            let isLast = k == returnList.length - 1;
            if (isLog()) {
                log('calcOlaTimeList::>>>>> expired expired, isLast=', isLast, k, 'of', returnList.length, ', ', j(item));
                log('calcOlaTimeList::>>>>> expired item.to=', j(item.to));
                log('calcOlaTimeList::>>>>> expired beginItem=', j(beginItem));
                log('calcOlaTimeList::>>>>> expired groupBeginItem=', j(groupBeginItem));
            }
            // check groups
            if (!groups.has(item.to)) {
                // skip time period which is not part of the slo
                if (!beginItem) continue;

                addTimePeriod(beginItem, item.time, expired);
                addGroupTimePeriod(k, groupBeginItem, item.time, expired);

                beginItem = null;
                groupBeginItem = null;

                continue;
            }

            if (!beginItem) {
                beginItem = item;
                groupBeginItem = item;
                continue;
            }

            // check suspend state
            if (isLast || !samePeriod(beginItem, item)) {
                addTimePeriod(beginItem, item.time, expired);
                addGroupTimePeriod(k, groupBeginItem, item.time, expired);

                beginItem = item;
                groupBeginItem = item;

                continue;
            }

            // check group
            if (!sameGroup(groupBeginItem, item)) {
                addGroupTimePeriod(k, groupBeginItem, item.time, expired);
                groupBeginItem = item;
            }
        }
    }

    if (isPendingAllowed && beginItem) {
        let pendingEndTime = isRunning ? now : beginItem.time;
        if (!expired && dateAfter(expiration, pendingEndTime)) {
            // now is pending, if not runnimg set visible to false
            let visible = isRunning ? true : false;
            addTimePeriod({
                time: pendingEndTime,
                suspend: beginItem.suspend,
                scoped: true,
                visible: visible
            }, expiration, false, true);
            addGroupTimePeriod(k - 1, {
                index: k - 1,
                time: pendingEndTime,
                suspend: groupBeginItem.suspend,
                to: groupBeginItem.to,
                scoped: true,
                visible: visible
            }, expiration, false, true);
        }
    }

    if (isLog()) {
        log('calcOlaTimeList::final::>>> timeList', j(timeList));
    }

    return {
        timeList,
        groups: makeGroupResult(groupTimeList)
    };
}

/**
 * Make groups result
 *
 * return [{
        name: groupName,
        timeList; groupTimeList
   }]
 */
function makeGroupResult(groupTimeList) {
    let groups = [];

    for (let name in groupTimeList) {
        let groupTime = groupTimeList[name];
        if (groupTime.length > 0) {
            groups.push({
                name,
                timeList: groupTime
            });
        }
    }

    return groups;
}

/**
 * calculate sla time list
 */
function calcSlaTimeList(returnList, expiration, isRunning, now, isPendingAllowed) {
    if (isLog()) {
        log('calcSlaTimeList::', 'expiration=', s(expiration), ', now=', s(now), ', isRunning==', isRunning);
        log('calcSlaTimeList:: returnList=', j(returnList));
    }
    let samePeriod = (begin, item) => {
        return item.suspend === begin.suspend && item.scoped === begin.scoped;
    };

    if (returnList.length == 0) {
        return [];
    }

    let timeList = [];
    let beginItem = returnList[0];

    let addTimePeriod = (item, endTime, expired, pending) => {
        if (isLog()) {
            log('calcSlaTimeList::>>>>> addTime', s(item.time), s(endTime), 'expired:', expired, 'pending:', pending);
        }

        if (!item.scoped) {
            return;
        }

        timeList.push({
            start: item.time,
            end: endTime,
            expired: expired,
            suspend: item.suspend,
            visible: !(item.visible === false),
            pending: pending
        });
    };

    let expired = false;
    for (k = 1; k < returnList.length; k++) {
        let item = returnList[k];

        let isLast = k == returnList.length - 1;

        if (dateAfter(item.time, expiration)) {
            addTimePeriod(beginItem, expiration, expired);
            expired = true;
            break;
        }

        if (isLast || !samePeriod(beginItem, item)) {
            addTimePeriod(beginItem, item.time, expired);
            beginItem = item;
        }
    }

    if (expired) {
        beginItem.time = expiration;

        for (; k < returnList.length; k++) {
            let item = returnList[k];
            let isLast = k == returnList.length - 1;
            if (isLast || !samePeriod(beginItem, item)) {
                addTimePeriod(beginItem, item.time, expired);

                beginItem = item;
            }
        }
    }

    let pendingEndTime = isRunning ? now : beginItem.time;
    if (isPendingAllowed && !expired && dateAfter(expiration, pendingEndTime)) {
        // beginItem.time = now;
        if (isLog()) {
            log('calcSlaTimeList::>>>>> add pending time, isRunning=', isRunning, j(now), j(beginItem));
        }
        // for pending items, if not running, visible should be false;
        let visible = isRunning ? true : false;
        addTimePeriod({
            time: pendingEndTime,
            suspend: beginItem.suspend,
            scoped: true,
            visible: visible
        }, expiration, false, true);
    }

    return timeList;
}

function hasDiffGroup(group, returnList, begin, end) {
    var k;
    for (k = begin; k < end; k++) {
        if (returnList[k].to != group) {
            return true;
        }
    }
    return false;
}

function fixOlaGroups(resp, groups, returnList) {
    if (isLog()) {
        log('fixOlaGroups::try fix  resp', j(resp));
        log('fixOlaGroups::try fix  !isSloAllGroup(resp)', !isSloAllGroup(resp));
    }

    let returnGroups = [];
    if (groups) {
        for (let group of groups) {
            let groupName = group.name;

            if (isLog()) {
                log('fixOlaGroups::try fix  group, resp.group', groupName, resp.group);
                log('fixOlaGroups::try fix  group, group.timeList', groupName, j(group.timeList));
            }

            if (isSloCurrentGroup(resp)) {
                // keep the last continues item for ola current type
                if (isLog()) {
                    log('fixOlaGroups::fix current::group.timeList::', j(group.timeList));
                }

                if (group.timeList && group.timeList.length > 1) {
                    let prevItem = null;
                    var k;
                    for (k = group.timeList.length - 1; k >= 0; k--) {
                        var item = group.timeList[k];
                        if (prevItem && item.endIndex < prevItem.startIndex) {
                            if (hasDiffGroup(groupName, returnList, item.endIndex, prevItem.startIndex)) {
                                break;
                            }
                        }

                        prevItem = item;
                    }

                    if (k >= 0) {
                        group.timeList = group.timeList.slice(k + 1, group.timeList.length);
                    }
                }

                if (isLog()) {
                    log('fixOlaGroups::fix current::group.timeList::', j(group.timeList));
                }

                // check the items whether is there a period which archieved directly
                if (group.timeList && group.timeList.length > 0) {
                    let prevItem = null;
                    let find = false;
                    var k;
                    for (k = returnList.length - 1; k >= 0; k--) {
                        let item = returnList[k];
                        if (item.to == groupName) {
                            if (isLog()) {
                                log('fixOlaGroups::fix current::item::', j(item));
                                log('fixOlaGroups::fix current::prevItem::', j(prevItem));
                                log('fixOlaGroups::fix current::item.stateSeq, prevItem.stateSeq::', item.stateSeq, prevItem ? prevItem.stateSeq : '-');
                                log('fixOlaGroups::fix current::resp.startStateSeq, resp.endStateSeq::', resp.stateSeqBegin, resp.stateSeqEnd);
                            }

                            if (prevItem && item.stateSeq < resp.stateSeqBegin && prevItem.stateSeq >= resp.stateSeqEnd) {
                                // find the scope which is no response
                                group.timeList = [];
                                break;
                            }

                            if (item.stateSeq >= resp.stateSeqBegin && item.stateSeq < resp.stateSeqEnd) {
                                // find the time
                                break;
                            }
                        }

                        prevItem = item;
                    }
                }
            }

            if (groupName != resp.group && !isSloAllGroup(resp)) {
                // remove sloresponse if the group is not in calculated with the specified slo
                var id = makeRespTimeId(resp.tableName, resp.tableId, resp.sloId, groupName, resp.slaType);
                var item = $('!sloresponsetime').fields('expiration').find('id=:id', id).one();
                if (null == item) {
                    group.deleted = true;
                    continue;
                }

                if (isLog()) {
                    log('fixOlaGroups::try fix group', groupName, id, item);
                }

                // split time list by groups, since each and current type has different expiration than the slo
                if (null != item && null != item.expiration) {
                    group.timeList = fixTimeListByExpiration(group.timeList, item.expiration);
                }
            }
        }
        returnGroups = groups.filter(g => g.deleted != true);
    }

    // some slo is directly archieved and no groups is in the list,
    // add a default group with no timepeirod
    if (returnGroups.length == 0) {
        returnGroups.push({
            name: resp.group,
            timeList: []
        });
    }

    return returnGroups;
}

function _calcResp(stateSeqMap, resp) {
    if (isLog()) {
        log('_calcResp::', resp.sloName, j(stateSeqMap));
        log('_calcResp::resp = ', resp.sloName, j(resp));
    }

    // let calendar = funcs.nullsub(resp.calendar, "24/7");
    // let holiday = funcs.nullsub(resp.holiday, "");
    // let timezone = funcs.nullsub(resp.timezone, vars.$lo_time_zone);

    // let stateSeqBegin = stateSeqMap[resp.startPhase];
    // let stateSeqEnd = stateSeqMap[resp.endPhase];

    let { returnList, isRunning } = calcSltPhaseList(stateSeqMap, resp);

    if (isLog()) {
        log('_calcResp::returnList', j(returnList));
    }

    resp.isRunning = isRunning;

    let slt = sltJson(resp);

    if (resp.slaType == 'ola') {
        let timeList = calcOlaTimeList(resp.slaGroups, returnList, resp.expiration, isRunning, resp.now, resp.hasExpiration);
        if (isLog()) {
            log('_calcResp::after calcOlaTimeList::timeList=', j(timeList));
        }
        timeList.slt = slt;

        // fix groups
        timeList.groups = fixOlaGroups(resp, timeList.groups, returnList);
        if (isLog()) {
            log('_calcResp::after calcOlaTimeList::timeList.groups=', j(timeList.groups));
        }

        return timeList;
    }

    if (resp.slaType == 'uc') {
        let timeList = calcOlaTimeList(resp.slaGroups, returnList, resp.expiration, isRunning, resp.now);
        timeList.slt = slt;
        return timeList;
    }

    let timeList = calcSlaTimeList(returnList, resp.expiration, isRunning, resp.now, resp.hasExpiration);

    // var obj = { id: resp.sloId, sloname: resp.sloName, timeList: timeList };
    slt.isRunnning = isRunning;

    if (isLog()) {
        log('_calcResp::return timeList ', j(timeList));
    }

    return {
        timeList,
        slt
    };
}

function sltJson(resp) {
    return {
        id: resp.sloId,
        name: resp.sloName,
        slaId: resp.slaId,
        slaType: resp.slaType,
        isRunning: resp.isRunning,
        expiration: resp.expiration,
        startState: resp.startState,
        endState: resp.endState,
        type: resp.slaType,
        holiday: resp.holiday,
        timezone: resp.timezone,
        calendar: resp.calendar,
        duration: resp.duration
    };
}

function fixTimeListByExpiration(list, date) {
    if (isLog()) {
        log('fixTimeListByExpiration::>>> fixTimeListByExpiration, date=', s(date), 'list=', j(list));
    }
    var newList = [];
    let expired = false;
    let lastItem = null;
    for (let item of list) {
        lastItem = item;
        if (expired) {
            item.expired = true;
            newList.push(item);
        } else if (!dateAfter(item.end, date)) {
            // all not expired, end <= expiration
            item.expired = false;
            newList.push(item);
        } else if (!dateAfter(date, item.start)) {
            // all expired, begin >= expiration
            expired = true;
            item.expired = true;
            newList.push(item);
        } else {
            // part expired, begin > date> end, split to 2 items
            // split to 2 items
            var end = item.end;
            item.expired = false;
            item.end = date;
            newList.push(item);

            expired = true;
            // clone item
            let newItem = {};
            newItem.end = end;
            newItem.start = date;
            newItem.expired = true;
            newItem.suspend = item.suspend;
            newItem.visible = item.visible;
            newList.push(newItem);
        }
    }

    // if not expired, add now to expiration
    if (!expired && lastItem) {
        let newItem = {};
        newItem.start = lastItem.end;
        newItem.end = date;
        newItem.expired = false;
        newItem.pending = true;
        newItem.suspend = lastItem.suspend;
        newItem.visible = false;

        newList.push(newItem);
    }

    if (isLog()) {
        log('fixTimeListByExpiration', j(newList), date);
    }
    return newList;
}

/**
 * calc time duration
 */
function calcInterval(resp, start, end) {
    return lib.SLMHistory.getInterval(start, end, resp.calendar, resp.timezone, resp.holiday);
}

// *******************************************************************************************************
// **
// * Calc today of the calendar view
// */
// *******************************************************************************************************
function calcSlmViewToday(fileName, id) {
    var date = formatDate(new Date());
    vars.$slmViewDate = date;

    // if find next sla/ola time return today.
    if (null != vars.$L_file && fileName === funcs.filename(vars.$L_file)) {
        if (vars.$L_file.next_breach) return date;
        if (vars.$L_file.next_ola_breach) return date;
    }

    // find next sla time
    let sql = 'foreign.filename=:fileName and foreign.key=:id';
    $('!sloresponse')
        .fields('start.time')
        .sortBy('-start.time')
        .find(sql, fileName, id)
        .each(item => {
            if (null != item['start.time']) {
                date = formatDate(item['start.time']);
                return true;
            }
        });

    vars.$slmViewDate = date;
    return date;
}

function formatDate(date) {
    var str = new XMLDate(date).getISODateTimeWithSMTZString();
    str = str.replace('T', ' ');
    return str.substring(0, 19);
}

//
//////// var list = run('probsummary', 'IM10262');
//try {
//  var list = calcSlm("probsummary", "IM10266");
//} catch (e) {
//  print(e);
//  print(e.stack);
//}
//////// log(j(list));

/*
{
  name,
  timeList,
  groups,
    [
      {
        name,
        timeList
      }
    ]
}
*/

// *******************************************************************************************************
// **
// * format related functions
// */
// *******************************************************************************************************

function getCurrentGroup() {
    var groupField = _slaControl()['group.field'];
    if (null == groupField) {
        groupField = 'assignment';
    }

    var groupName = vars['$L.file'][groupField];

    if (groupName && typeof groupName != 'string') {
        // should be array if not string, for interaction records
        groupName = groupName[0];
    }

    return groupName;
}

function formatItemList(list) {
    log('formatItemList:: begin');
    let nameList = [];
    let timeList = [];

    // sort list by sla/ola
    list.sort((item1, item2) => {
        return item1.slt.slaId > item2.slt.slaId;
    });

    var currentGroup = getCurrentGroup();

    // -
    var slaId = null;
    for (let item of list) {
        if (isLog()) {
            log('formatItemList::format::item=', j(item.slt));
            log('formatItemList::format::timeList=', j(item.timeList));
        }

        // Insert sla line
        if (slaId != item.slt.slaId) {
            nameList.push({
                name: slaName(item.slt.slaId),
                type: 'sla'
            });
            timeList.push({
                durations: []
            });
            slaId = item.slt.slaId;
        }

        nameList.push({
            name: item.slt.id + ' - ' + item.slt.name,
            type: 'slt'
        });
        let itemTimeList = formatTimeList(item.slt, item.timeList);
        let { runColor } = itemTimeList;

        if (item.slt.slaType == 'ola' && !isSloAllGroup(item.slt)) {
            itemTimeList.list = [];
        }
        timeList.push({
            durations: itemTimeList.list
        });

        if (item.groups) {
            for (let group of item.groups) {
                nameList.push({
                    name: group.name,
                    type: 'group'
                });

                if (isLog()) {
                    log('formatItemList::currentGroup, group.name=', currentGroup, group.name);
                }
                var disablePending = currentGroup != group.name;

                let groupTimeList = formatTimeList(item.slt, group.timeList, disablePending);

                // All groups follow the color of slt
                if (item.slt.slaType == 'uc' || isSloAllGroup(item.slt)) {
                    groupTimeList.list.forEach(d => {
                        if (d.type == 'run') {
                            d.color = runColor;
                        }
                    });
                }

                timeList.push({
                    durations: groupTimeList.list
                });
            }
        }
    }

    return {
        nameList,
        timeList,
        colorMap: getFormatColorMap()
    };
}

function isSloAllGroup(slt) {
    //initial;first;current
    return slt.duration.scope == 'initial';
}

function isSloCurrentGroup(slt) {
    return slt.duration.scope == 'current';
}

function isSloEachGroup(slt) {
    return slt.duration.scope == 'first';
}

function slaName(id) {
    var item = $('!sla').fields('title', 'category').find('agreement.id=:id', id).one();

    var category = item.category;

    var type = 'SLA';
    if (category == 'ola') {
        type = 'OLA';
    } else if (category == 'uc') {
        type = 'UC';
    }

    return id + ' - ' + type + ' ' + item.title;
}

var FORMAT_COLOR_MAP = null;

function getFormatColorMap() {
    if (null != FORMAT_COLOR_MAP) {
        return FORMAT_COLOR_MAP;
    }

    var colorMap = {
        background: '#eeeeee',
        level1: '#1bad60',
        level2: '#facc00',
        level3: '#ff9900',
        level4: '#e02020',
        level5: '#999999'
    };

    var item = $('!colorindicatorsetting').fields('value', 'bgcolor').find('file="sla" and field="sla.status"').one();
    if (null == item) {
        return colorMap;
    }

    var k;
    var length = item.value.length();
    for (k = 0; k < length; k++) {
        if (item.bgcolor[k]) {
            colorMap[item.value[k]] = item.bgcolor[k];
        }
    }
    colorMap.background = '#eee';
    FORMAT_COLOR_MAP = colorMap;
    return colorMap;
}

function formatTimeList(item, timeList, isDisablePending) {
    if (isLog()) {
        log('formatTimeList::>>>> item=    ', j(item));
        log('formatTimeList::>>>> timeList=', j(timeList));
        log('formatTimeList::>>>> isDisablePending=', isDisablePending);
    }
    var { isRunning } = item;

    var colorMap = getFormatColorMap();
    var runColor = null;

    var pendingTime = 0;
    var runTime = 0;

    var previousItemEnd = 0;
    var isSloCurrent = isSloCurrentGroup(item);
    for (let timeItem of timeList) {
        if (isLog) {
            log('formatTimeList::>>>> timeItem=    ', j(timeItem));
        }
        // for current, only check the time of last assignment
        if (isSloCurrent && previousItemEnd != timeItem.start) {
            var pendingTime = 0;
            var runTime = 0;
        }

        timeItem.time = intervalToTime(timeItem.interval);

        if (timeItem.expired) {
            runColor = colorMap.level3;
            break;
        }

        if (timeItem.pending) {
            pendingTime += timeItem.time;
        } else if (!timeItem.suspend) {
            runTime += timeItem.time;
        }

        previousItemEnd = timeItem.end;
    }

    if (isLog()) {
        log('xxxxx::formatTimeList::runColor==', runColor);
    }
    if (runColor == null) {
        var totalTime = intervalToTime(item.duration.interval);
        if (isLog()) {
            log('formatTimeList::runTime, pendingTime, totalTime==', runTime, pendingTime, totalTime);
        }
        if (isLog()) {
            log('xxxxx::formatTimeList::totalTime==', totalTime, pendingTime, item.hasExpiration);
        }
        if (pendingTime > 0 || item.hasExpiration) {
            totalTime = pendingTime + runTime;
        }
        if (isLog()) {
            log('xxxxx::formatTimeList::totalTime==', totalTime);
        }

        if (totalTime) {
            // calc level by progress if has total time
            var progress = (runTime * 100) / totalTime;
            if (progress > 75) {
                runColor = colorMap.level3;
            } else if (progress > 50) {
                runColor = colorMap.level2;
            } else {
                runColor = colorMap.level1;
            }
        } else {
            // no expiration, default to level1: green
            runColor = colorMap.level1;
        }
    }

    if (isLog()) {
        log('formatTimeList::runTime, pendingTime, process, color', runTime, pendingTime, progress, runColor);
    }

    let ret = [];
    let lastItem = null;
    for (let item of timeList) {
        // let label = timeToLabel(item.time);
        lastItem = item;

        let type = 'run';
        let color = runColor;

        if (item.pending) {
            color = colorMap.background;
            type = 'pending';
        }

        if (item.expired) {
            color = colorMap.level4;
            type = 'breached';
        }

        if (item.suspend) {
            color = colorMap.level5;
            type = 'suspend';
        }

        var tip = type;

        if (item.visible === false) {
            continue;
        }

        ret.push({
            start: formatDate(item.start),
            end: formatDate(item.end),
            color,
            type,
            tip: 'xxxx2',
            label: ''
        });
    }

    if (lastItem) {
        if (isLog()) {
            log('formatTimeList::lastItem.expired, isRunning =', lastItem.expired, isRunning);
        }
    }

    if (lastItem && lastItem.expired && !lastItem.suspend && isRunning && !isDisablePending) {
        var ONE_DAY = 24 * 3600 * 1000;
        ret.push({
            start: formatDate(lastItem.end),
            end: formatDate(new Date(Date.now() + ONE_DAY)),
            color: colorMap.background,
            type: 'pending',
            tip: 'xxxx',
            label: ''
        });
    }

    if (isLog()) {
        log('formatTimeList::<<<<', j(ret));
    }

    return {
        runColor,
        list: ret
    };
}

function intervalToTime(interval) {
    if (!interval) {
        return 0;
    }

    var time = funcs.val(interval, 3).getTime();
    // time = parseInt(time);

    const ZERO = funcs.val('00:00:00', 3).getTime();
    return Math.round((time - ZERO) / 1000);
}

function timeToLabel(time) {
    var leftTime = Math.round(time / 60);

    if (leftTime > 60 * 24) {
        return Math.round((leftTime * 10) / (60 * 24)) / 10 + 'd';
    }

    if (leftTime > 60) {
        return Math.round((leftTime * 10) / 60) / 10 + 'h';
    }

    return leftTime + 'm';
}


/**
 * convert sla target time to date
 *
 * @param {String} targetTime
 * @returns {Date}
 */
function convertTargetTime(targetTime) {
    if (!targetTime) {
        return null;
    }

    // target time format: endtime;starttime, e.g. 1695882360213;1695881760213
    var times = targetTime.split(";");

    var end = times[0].trim();
    if (!end) {
        return null;
    }

    end = Number(end);
    if (Number.isNaN(end)) {
        return null;
    }

    return new Date(end);
}


function isLog() {
    // return true;
    return false;
}

//
// ======================================================================================
// ======================================================================================
// ======================================================================================
// ======================================================================================
// ======================================================================================
/**
 * Log function
 */
function log(a1, a2, a3, a4, a5, a6, a7, a8) {
    if (!isLog()) {
        return;
    }

    var length = arguments.length;

    if (length < 2) {
        logger.info(a1);
        return;
    }
    if (length < 3) {
        logger.info(a1, a2);
        return;
    }
    if (length < 4) {
        logger.info(a1, a2, a3);
        return;
    }
    if (length < 5) {
        logger.info(a1, a2, a3, a4);
        return;
    }
    if (length < 6) {
        logger.info(a1, a2, a3, a4, a5);
        return;
    }
    if (length < 7) {
        logger.info(a1, a2, a3, a4, a5, a6);
        return;
    }
    if (length < 8) {
        logger.info(a1, a2, a3, a4, a5, a6, a7);
        return;
    }

    logger.info(a1, a2, a3, a4, a5, a6, a7, a8);
}

function makeRespTimeId(tableName, tableId, sloId, group, type) {
    return tableId + '.' + sloId + '.' + tableName + (type == 'sla' ? '' : '.' + group);
}

function updateRespTime(resp) {
    if (!resp['expiration.time']) {
        return;
    }

    var type = resp['agreement.category'];
    var id = makeRespTimeId(resp['foreign.filename'], resp['foreign.key'], resp['slo.id'], resp['group'], type);
    var item = new SCFile('sloresponsetime');
    var rc = item.doSelect('id="' + lib.StringUtil.escapeAllStr(id) + '"');
    if (rc == RC_SUCCESS) {
        if (item.expiration != resp['expiration.time']) {
            item.expiration = resp['expiration.time'];
            item.doUpdate();
        }
    } else {
        item.id = id;
        item.expiration = resp['expiration.time'];
        item.doInsert();
    }
}

// querySlm('probsummary', 'IM10258');