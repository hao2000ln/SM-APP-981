var log = getLog('smis.task.alm.AlmUtil');

var STATUS_NEW = 'new';
var STATUS_SUCCESS = 'success';
var STATUS_FAILED = 'failed';

var ACTIVITY_TYPE_ALM = 'ALM Update';

function toJson(data) {
    return JSON.stringify(data, null, 4);
}

var j = toJson;

var JSON_HEADER = {
    'Content-Type': 'application/json'
};

function makeConfig(configItem) {
    var getParam = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

    let clientId = getParam(configItem, 'alm.clientId');
    let clientSecret = getParam(configItem, 'alm.clientSecret');

    let baseUrl = getParam(configItem, 'alm.baseUrl');
    let domain = getParam(configItem, 'alm.domain');
    let project = getParam(configItem, 'alm.project');

    let isChangeToDefectEnabled = getParam(configItem, 'alm.changeToDefectEnabled');

    let isChangeToFeatureEnabled = getParam(configItem, 'alm.changeToFeatureEnabled');
    let isProblemToDefectEnabled = getParam(configItem, 'alm.problemToDefectEnabled');

    // alm.defect.field.smId
    // alm.defect.field.smTable

    // alm.feature.field.smId
    // alm.feature.field.smTable

    let field_defect_table_id = getParam(configItem, 'alm.defect.field.smId');
    let field_defect_table_name = getParam(configItem, 'alm.defect.field.smTable');
    let field_defect_push_to_sm = getParam(configItem, 'alm.defect.field.pushToSm');

    let field_feature_table_id = getParam(configItem, 'alm.feature.field.smId');
    let field_feature_table_name = getParam(configItem, 'alm.feature.field.smTable');

    let hasVersion = getParam(configItem, 'alm.project.version.enabled');

    let config = {
        clientId,
        clientSecret,
        baseUrl,
        domain,
        project,
        isChangeToDefectEnabled: isChangeToDefectEnabled,
        isChangeToFeatureEnabled: isChangeToFeatureEnabled,
        isProblemToDefectEnabled: isProblemToDefectEnabled,
        field_defect_table_id: field_defect_table_id,
        field_defect_table_name: field_defect_table_name,
        field_defect_push_to_sm: field_defect_push_to_sm,
        field_feature_table_id,
        field_feature_table_name,
        hasVersion
    };

    return config;
}

function createContext(configItem) {
    var ctx = new lib.OctaneUtil.Context(configItem);
    ctx.config = makeConfig(configItem);
    ctx.param_prefix = 'alm';

    // table param
    ctx.table_info = 'AlmInfo';
    ctx.table_info_more = 'AlmInfoMore';

    // fields param
    ctx.field_defect_table_name = ctx.config.field_defect_table_name; // 'user-02';
    ctx.field_defect_table_id = ctx.config.field_defect_table_id; // 'user-03';
    ctx.field_defect_push_to_sm = ctx.config.field_defect_push_to_sm; // 'user-03';
    ctx.field_defect_push_to_sm_value_done = 'Done';

    ctx.field_feature_table_name = ctx.config.field_feature_table_name; // 'user-02';
    ctx.field_feature_table_id = ctx.config.field_feature_table_id; // 'user-03';

    ctx.field_last_modified = 'last-modified';
    ctx.field_phase = 'status';
    ctx.feature_name = 'requirements';
    ctx.field_sm_action = 'almAction';
    ctx.api = {
        processEpList,
        parseItem,
        parseItemList,
        makeEpBodyUpdate,
        makeEpBodyCreate,
        processDefectToProblemList,
        parseData,
        getEpItem,
        processEpComments,
        createEpAttachment,
        doMakeEpChange: doMakeEpChange,
        phaseId: function(item) {
            return item.status;
        },
        afterAddEntity,
        afterAddAttach,
        afterAddAttachFail,
        afterAddProblem,
        makeEpDateValue,
        makeSmDateValue,
        defaultEpValue
    };

    ctx.getServerTime = getServerTime;
    ctx.hasVersion = ctx.config.hasVersion;

    ctx.doLogin = doLogin;
    ctx.workspace = `alm/${ctx.config.domain}/${ctx.config.project}`;

    ctx.smFieldValue = smFieldValue;
    ctx.epFieldValue = epFieldValue;

    return ctx;
}

function makeSmDateValue(value) {
    return new Date(value);
}


function makeEpDateValue(smValue) {
    if (!smValue) {
        return null;
    }

    if (typeof(smValue) == 'string' && smValue.length <= 12) {
        return smValue;
    }

    return new XMLDate(smValue).getISODate();
}

function afterAddProblem(info) {
    let actTable = info.smTable == 'cm3r' ? 'activitycm3r' : 'activityproblem';
    let msg = funcs.scmsg('act-create-problem', 'alm', [info.octId]);
    lib.OctaneUtil.addActivity(ACTIVITY_TYPE_ALM, 'activityproblem', info.smId, msg);
}

function afterAddEntity(info) {
    let actTable = info.smTable == 'cm3r' ? 'activitycm3r' : 'activityproblem';
    let msg = funcs.scmsg('act-create-item', 'alm', [funcs.scmsg(info.octTable, 'alm'), info.octId]);
    lib.OctaneUtil.addActivity(ACTIVITY_TYPE_ALM, actTable, info.smId, msg);
}


function afterAddAttach(info, attachName) {
    let actTable = info.smTable == 'cm3r' ? 'activitycm3r' : 'activityproblem';
    let message = funcs.scmsg('act-add-attach', 'alm', [attachName, funcs.scmsg(info.octTable, 'alm'), info.octId]);
    lib.OctaneUtil.addActivity(ACTIVITY_TYPE_ALM, actTable, info.smId, message);
}

function afterAddAttachFail(info, attachName) {
    let actTable = info.smTable == 'cm3r' ? 'activitycm3r' : 'activityproblem';
    let message = funcs.scmsg('act-add-attach-fail', 'alm', [attachName, funcs.scmsg(info.octTable, 'alm'), info.octId]);
    lib.OctaneUtil.addActivity(ACTIVITY_TYPE_ALM, actTable, info.smId, message);
}

function makeEpBodyUpdate(data) {
    return makeEpBody(data);
}

function makeEpBodyCreate(data) {
    if (!data['creation-time']) {
        var date = new XMLDate(new Date()).getISODate();
        data['creation-time'] = date;
    }

    return makeEpBody(data);
}

/**
 * Context login
 */
function doLogin() {
    log.debug('doLogin');
    // default config
    let config = this.config;
    log.debug('doLogin1');
    _checkBaseUrl(config);

    log.debug('doLogin2');

    let baseUrl = config.baseUrl;

    let cookieList = login(baseUrl, config.clientId, config.clientSecret);
    log.debug('doLogin3');
    if (!cookieList) {
        log.info('invalid login');
        return false;
    }

    let apiUrl = makeApiUrl(baseUrl, config.domain, config.project);

    let loginInfo = new lib.OctaneUtil.LoginInfo(baseUrl, apiUrl, cookieList);
    loginInfo.context = this;
    loginInfo.logout = function() {
        return logout(this);
    }

    this.loginInfo = loginInfo;
    return this.loginInfo;
}

function logout(loginInfo) {
    log.debug('logout');
    let logoutUrl = `${loginInfo.baseUrl}/qcbin/authentication-point/logout`;
    return loginInfo.get(logoutUrl);
}

function login(baseUrl, clientId, secret) {
    log.debug('login 4');
    log.debug('AlmUtil.login');
    let url = baseUrl + '/qcbin/rest/oauth2/login';

    let body = {
        clientId,
        secret
    };

    log.debug('AlmUtil.login.post');
    var resp = lib.OctaneUtil.post(url, JSON_HEADER, JSON.stringify(body), {
        noLog: true
    });

    // print(j(resp));

    if (!resp.isOk()) {
        throw resp;
    }

    let list = lib.OctaneUtil.cookieList(resp.headers);

    return list;
}


function makeQuery(context, date, smType, epFieldTable, epFieldId) {
    if (log.isDebugEnabled()) {
        log.debug(`makeQuery, makeQuery=${date}, smType=${smType}, epFieldTable=${epFieldTable}, epFieldId=${epFieldId}`);
    }

    let fieldsList = ['id', 'name', 'last-modified', epFieldTable, epFieldId];
    let str = new XMLDate(date).getISODateTimeString();
    let dateStr = ''.concat(str.substring(0, 10), ' ', str.substring(11, 19))

    // let query = '{last-modified[>"' + dateStr + '"]; '+context.field_table_name+'["'+smType+'"]}';
    let query = `{last-modified[>"${dateStr}"]; ${epFieldTable}[${smType}]}`;
    return 'fields=' + fieldsList.join(',') + '&query=' + encodeURIComponent(query);
}


function parseItemList(data) {
    if (!data.entities) {
        return [];
    }

    return data.entities.map(n => parseItem(n));
}


function parseItem(item) {
    let object = item.Fields.reduce(function(p, c) {
        p[c.Name] = c.values[0].value;
        return p;
    }, {});

    if (!object.type) object.type = item.Type;

    return object;
}


function processEpList(context, lastSyncTime, epType, smType, epFieldTable, epFieldId, syncAction, putEpInfoToTaskQueue) {
    // let query = `"last_modified GT ^${lastSyncTime}^ ; user-03 EQ ^${smType}^"`;
    let query = makeQuery(context, lastSyncTime, smType, epFieldTable, epFieldId);
    let url = `${epType}?` + query;

    processQueryByPage(context, url, function(context, item) {
        putEpInfoToTaskQueue(context, item, syncAction);
    });
}


function processQueryByPage(context, url, func) {
    let begin = -1;
    let pageSize = 100;
    let total = 0;

    while (begin < 0 || begin < total) {
        let pageUrl = url;

        if (begin > 0) {
            pageUrl = url + '&start-index=' + (begin + 1);
        }
        if (log.isDebugEnabled()) {
            log.debug('processQueryByPage, begin=' + begin + ', pageSize=' + pageSize + ', total=' + total + ', pageUrl=' + pageUrl);
        }
        let resp = context.getj(pageUrl);

        // let data = JSON.parse(resp.data).data;
        let data = JSON.parse(resp.data);

        let list = parseItemList(data);

        total = data.TotalResults;

        pageSize = list.length;

        if (begin < 0) {
            begin = 0;
        }

        begin = begin + pageSize;

        list.forEach(item => {
            func(context, item);
        });
    }
}


function _makeField(name, value) {
    return ({
        Name: name,
        values: [{
            value: value
        }]
    });
}

function makeEpBody(data) {
    let Fields = [];
    for (let k in data) {
        let value = data[k];
        // if (k == 'severity') value = '2-Medium';
        Fields.push(_makeField(k, value))
    }

    // Fields.push(_makeField('detected-by', 'admin'))
    // var date = new XMLDate(new Date()).getISODate();
    // Fields.push(_makeField('creation-time', date))
    return ({
        Fields: Fields
    })
}

function parseData(data) {
    let result = {};

    let fields = data.Fields;

    if (!fields) return data;

    for (var k = 0; k < fields.length; k++) {
        let field = fields[k];

        let name = field.Name;
        let values = field.values;

        if (values.length < 1) {
            // noop
        } else if (values.length < 2) {
            result[name] = values[0].value;
        } else {
            result[name] = values.map(n => n.value);
        }
    }

    if (!result.type) {
        result.type = data.Type;
    }

    return result;
}


function getEpItem(context, octType, octId, fieldList) {
    let octEntity = octType == 'defect' ? 'defects' : 'requirements';

    let fieldStr = fieldList.filter(f => !f.isEpVar).map(field => field.epField).join(',');

    if (!fieldList.some(field => field.epField == 'last-modified')) {
        fieldStr += ',last-modified'
    }

    if (!fieldList.some(field => field.epField == 'status')) {
        fieldStr += ',status'
    }

    let url = `${octEntity}/${octId}?fields=${fieldStr}`;
    let resp = context.getj(url);
    if (log.isDebugEnabled()) {
        log.debug('===' + octEntity + ': ', resp.data);
    }
    if (resp.isOk()) {
        let data = JSON.parse(resp.data);
        return parseData(data);
    } else {
        log.warn(`getEpItem, Failed alm item found: octType=${octType}, octId={octId}`);
        log.warn(`getEpItem, api-url=${context.apiUrl}`);
        log.warn(`getEpItem, http-status=${resp.status}, details=${resp.data}`);
    }
    return null;
}


function processDefectToProblemList(context, putDefectToProblemToTaskQueue) {
    log.debug('processDefectToProblemList');
    let field_id = context.field_defect_table_id;
    let field_name = context.field_defect_table_name;

    let fields = ['id', context.field_defect_table_name, context.field_defect_table_id];

    var url = 'defects?fields=' + fields.join(',') + '&query={' + context.field_defect_push_to_sm + '[Y]}';

    processQueryByPage(context, url, putDefectToProblemToTaskQueue);
    // processQueryByPage(context,url, ()=>{});
}


function processEpComments(context, info, epType, epId) {
    if (log.isDebugEnabled()) {
        log.debug(`processEpComments, info.id=${info.id}, epId=${epId}`);
    }
    let size = info.comment.length();

    let list = [];

    for (let k = 0; k < size; k++) {
        let status = info.comment[k].commentSyncStatus;

        if (isStatusNew(status)) {
            let id = info.comment[k].commentId;
            let table = info.comment[k].commentTable;
            var item = lib.c.$('!' + table).fields('description').find('thenumber=:id', id).one();

            if (!item.description) {
                continue;
            }

            let message = item.description.join('\n');
            message = lib.EmojiUtil.convertEmojiSymbol2Code(message);
            list.push(message);
        }
    }


    if (list.length < 1) {
        return;
    }

    list.reverse();

    let resp = createEpComments(context, epType, epId, list);

    let date = funcs.tod();
    let syncStatus = resp.isOk() ? STATUS_SUCCESS : STATUS_FAILED;
    let syncResult = resp.isOk() ? '' : resp.result();

    for (let k = 0; k < size; k++) {
        let status = info.comment[k].commentSyncStatus;
        if (isStatusNew(status)) {
            info.comment[k].commentSyncAt = funcs.tod();
            info.comment[k].commentSyncStatus = syncStatus;
            info.comment[k].commentSyncResult = syncResult;
        }
    }
}

function createEpComments(context, epType, epId, commentsList) {
    if (log.isDebugEnabled()) {
        log.debug('createEpComments, size=', commentsList.length);
    }
    if (!commentsList || commentsList.length < 1) {
        return successData("no comments");
    }

    let listName = epType + 's';

    let commentsField = 'dev-comments';
    if (epType == 'requirement') {
        commentsField = 'comments';
    }

    let resp = context.getj('/' + listName + '/' + epId + '?fields=' + commentsField);
    let data = parseData(JSON.parse(resp.data));

    let text = makeCommentsList(commentsField, data, commentsList);
    let json = {
        Fields: [{
            "Name": commentsField,
            "values": [{
                "value": text
            }]
        }]
    }

    return updateEpItem(context, epType + 's', epId, json);
}

function doMakeEpChange(context, epType, epId, data) {
    return updateEpItem(context, epType, epId, data);
}

function isLockSuccess(resp) {
    var lock = JSON.parse(resp.data);
    if (lock.LockStatusEntity && lock.LockStatusEntity.LockStatus == 'UNLOCKED') {
        return true;
    }

    return false;
}

function updateEpItem(context, epType, epId, data) {
    if (log.isDebugEnabled()) {
        log.debug(`updateEpItem: ${epType}, ${epId}`);
    }
    // get lock
    let path = `/${epType}/${epId}`;

    // {"LockStatusEntity": {"LockStatus": "UNLOCKED"}}
    // {"LockStatusEntity": {"LockStatus": "LOCKED_BY_OTHER","LockedByMe": false,"LockUser": "admin" }}

    var resp = null;
    if (context.hasVersion && epType == 'requirements') {
        resp = context.postj(`${path}/versions/check-out`, '{"CheckOutParameters": {"Comment": "check out from SMALM Integration"}}');
    } else {
        resp = context.getj(`${path}/lock`);
        if (!isLockSuccess(resp)) {
            context.addError(`Failed to allocate lock for ${epType}:${epId}`);
            context.setSkip();
        }
    }


    //    let updated = login.putj(`${path}?fields=id,name,last-modified`, j(data));
    let updated = context.putj(`${path}`, j(data));
    if (log.isDebugEnabled()) {
        log.debug(`updateEpItem: updated.status=${updated.status}`);
    }
    if (isRespLockFailure(resp)) {
        context.setSkip(true);
        let message = `Failed to update  ${epType}:${epId} due to lock failure`;

        context.addError(message);
        log.info(`updateEpItem:`, message);
    }

    var resp3 = null;

    if (context.hasVersion && epType == 'requirements') {
        resp3 = context.postj(`${path}/versions/check-in`, '{"CheckInParameters": {"Comment": "check in from SMALM Integration"}}');
    } else {
        resp3 = context.deletej(`${path}/lock`);
    }

    return updated;
}

function isRespLockFailure(resp) {
    if (!resp) return false;

    if (resp.status == 403) {
        var data = JSON.parse(resp.data);

        if (data && log.isDebugEnabled()) {
            log.debug(`isRespLockFailure: resp.data.Id=${data.Id}`);
        }

        if (data && data.Id == 'qccore.lock-failure') {
            return true;
        }
    }


    if (resp.status == 500) {
        var data = JSON.parse(resp.data);

        if (data && log.isDebugEnabled()) {
            log.debug(`isRespLockFailure: resp.data.Id=${data.Id}`);
        }

        if (data && data.Id == 'qccore.check-out-failure') {
            return true;
        }
    }

    return false;
}


function makeCommentsList(commentsField, epItem, commentsList) {
    if (log.isDebugEnabled()) {
        log.debug('makeCommentsList, size=', commentsList.length);
    }
    let added = commentsList.map(n => makeComments(n)).join('\n');
    if (log.isDebugEnabled()) {
        log.debug('makeCommentsList, added=', added);
    }

    let text = epItem[commentsField];
    if (text && text.endsWith('</body></html>')) {
        return text.substring(0, text.length - 14) + added + '\n</body></html>';
    }

    if (text) added = text + '\n' + added;
    return '<html><body> \n' + added + '\n</body></html>';
}


function makeComments(line) {
    if (!line.match(/^<[^>]+>/)) {
        line = line.replace(/\n/g, '<br />\n');
    }
    return ( // '<div align="left" style="min-height:9pt"></div> ' +
        '<div align="left" style="min-height:9pt">' +
        '<font face="Arial"><span dir="ltr" style="font-size:8pt"><br /></span></font><font face="Arial" color="#000080"><span dir="ltr" style="font-size:8pt"><b>________________________________________</b></span></font><font face="Arial"><span dir="ltr" style="font-size:8pt"><br /></span></font><font face="Arial" color="#000080"><span dir="ltr" style="font-size:8pt"><b>From SM, ' + formatDate() + '[M/d/yyyy]:</b></span></font><font face="Arial"><span dir="ltr" style="font-size:8pt"> </span></font>' +
        '</div> ' +
        '<div align="left" style="min-height:9pt">' +
        '<font face="Arial"><span dir="ltr" style="font-size:8pt">' + line + '<br /></span></font>' +
        '</div>  ');
}


function formatDate() {
    var date = new Date();
    return ''.concat(date.getMonth() + 1, '/', date.getDate(), '/', date.getFullYear())
}

/**
 * @API
 */
function createEpAttachment(context, epType, epId, name, data) {
    if (log.isDebugEnabled()) {
        log.debug(`createEpAttachment, epType=${epType}, epId=${epId}, name=${name}`);
    }
    let path = `/${epType}s/${epId}/attachments`;
    let path1 = `/${epType}s/${epId}`;

    var resp, resp1, resp2;

    if (context.hasVersion && epType == 'requirement') {
        resp1 = context.postj(`${path1}/versions/check-out`, '{"CheckOutParameters": {"Comment": "check out from SMALM Integration"}}');
    }

    resp = context.post(path, {
        'Slug': encodeURIComponent(name),
        'Content-Type': 'application/octet-stream',
        'Accept': 'application/json',
        'Content-Length': data.length
    }, data, {
        reqRaw: true
    });

    if (context.hasVersion && epType == 'requirement') {
        resp2 = context.postj(`${path1}/versions/check-in`, '{"CheckInParameters": {"Comment": "check in from SMALM Integration"}}');
    }

    if (isRespLockFailure(resp1) || isRespLockFailure(resp)) {
        context.setSkip(true);
        let message = `Failed to add attachment ${name} to  ${epType}:${epId} due to lock failure`;
        context.addError(message);
        log.info(`createEpAttachment:`, message);
    }


    return resp;
}


function isStatusNew(status) {
    return STATUS_NEW == status;
}


var TASK_STATUS_SUCCESS = lib.smis_Constants.TASK_STATUS_SUCCESS();

function successData(data) {
    return ({
        status: TASK_STATUS_SUCCESS,
        data: data,
        isOk: function() {
            return true;
        }
    });
}


function getServerTime(context) {
    var context = context || this;
    // {"ServerTime": {
    //  "TimeInMillis": 1668669612475,
    //  "DateTime": "2022-11-17 02:20:12"
    //}}

    let resp = context.getbj('/qcbin/rest/server/time');
    let data = JSON.parse(resp.data);

    let date = data.ServerTime.DateTime;

    date = date.replace(/ /, 'T') + 'Z';

    let toDate = new XMLDate(date).getDate();

    let result = new Date(toDate.getTime() - 1000);

    context.serverTimeDiff = calcTimeDiff(data);
    if (log.isDebugEnabled()) {
        log.debug('getServerTime, context.serverTimeDiff=', context.serverTimeDiff, ', result=', funcs.str(result));
    }
    return result;
}


function calcTimeDiff(data) {
    if (!data || !data.ServerTime) return 0;

    var str = data.ServerTime.DateTime;
    str = str.replace(/ /, 'T') + 'Z';
    var xmlDate = new XMLDate(str);
    var date = xmlDate.getDate();

    var time1 = date.getTime();

    var time2 = data.ServerTime.TimeInMillis;
    time2 = time2 - time2 % 1000;
    var diff = (time1 - time2) / 3600000;

    return diff;
}


function makeApiUrl(baseUrl, domain, project) {
    return `${baseUrl}/qcbin/rest/domains/${domain}/projects/${project}`;
}

function _checkBaseUrl(config) {
    if (config.baseUrl.endsWith('/')) {
        config.baseUrl = config.baseUrl.slice(0, -1);
    }
}


function loginTest(config) {
    _checkBaseUrl(config);

    let failedMessage = funcs.scmsg(117, "smis");

    try {
        let cookieList = login(config.baseUrl, config.clientId, config.clientSecret);
        let apiUrl = makeApiUrl(config.baseUrl, config.domain, config.project);
        let loginInfo = new lib.OctaneUtil.LoginInfo(config.baseUrl, apiUrl, cookieList);

        loginInfo.logout = function() {
            return logout(this);
        }

        var resp = loginInfo.getj('/defects');


        loginInfo.logout();


        if (resp.status == 500) {
            failedMessage += '\n' + funcs.scmsg('login-test-500', 'alm') + '\n\nDetails:';
        }

        if (!resp.isOk()) {
            throw resp;
        }

        return funcs.scmsg(116, "smis");
    } catch (ex) {
        if (ex instanceof lib.OctaneUtil.Resp) {
            let message = failedMessage + '\n' + lib.OctaneUtil.makeRespErrorMessage(ex);
            return message;
        } else {
            let message = failedMessage + '\n' + ex;
            return message;
        }
    }

    return failedMessage;
}


function smFieldValue(context, field, value) {
    if (field.epType == 'boolean' && field.smType == 'boolean') {
        if (value) {
            return 'Y';
        } else {
            return 'N';
        }
    }

    // ALM only support integer, and value in JSON should be formated as string
    if (typeof(value) == 'number') {
        value = '' + Math.round(value);
    }

    return value;
}

function epFieldValue(context, field, value) {
    if (field.epType == 'boolean' && field.smType == 'boolean') {
        if (value === 'Y') {
            return true;
        } else {
            return false;
        }
    }


    return value;
}


function defaultEpValue(context, field) {
    return field.epDefault;
}