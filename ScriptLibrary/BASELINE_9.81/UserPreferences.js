/**
 * @fileoverview  Handles user preferences calls
 * @author weixing.zhao@hp.com
 */

var _denull = funcs.denull;
var _operator = funcs.operator;
var _rtecall = funcs.rtecall;
var _scmsg = funcs.scmsg;

function getDashboards() {
    var view_dl = [];
    var view_vl = [];

    if (vars['$lo.user.name'] != null) {
        var strGlobal = _scmsg(60, "Reporting");
        var inbox = new SCFile("inbox");
        var inbox_query = " SELECT inbox.name, inbox.id, operator.name, audience.type FROM inbox WHERE ";
        inbox_query += "(inbox.class=\"dashboard\") and " + lib.scmGetFilesHelper.getPermissionSQL4Inbox();
        inbox_query += " ORDER BY inbox.name ASC";

        if (inbox.doSelect(inbox_query) == RC_SUCCESS) {
            do {
                var localizedInboxName = lib.localizeTable.getMessageText(inbox);
                localizedInboxName = localizedInboxName == null ? inbox.inbox_name : localizedInboxName;
                if (inbox.audience_type == "oneperson") {
                    if (inbox.operator_name == _operator()) {
                        view_dl.push(localizedInboxName);
                    } else {
                        view_dl.push(localizedInboxName + " (" + inbox.operator_name + ")");
                    }
                } else {
                    view_dl.push(localizedInboxName + " (" + strGlobal + ")");
                }

                view_vl.push(inbox.inbox_id);
            } while (inbox.getNext() == RC_SUCCESS);
        }
    }

    vars.$L_temp_array = [view_dl, view_vl];

    vars['$dashboard.dl'] = vars.$L_temp_array[0];
    vars['$dashboard.vl'] = vars.$L_temp_array[1];
}


function getTodoViewList() {
    if (vars['$queue'] == null) {
        vars['$queue'] = "Todo";
    }

    var view_dl = [];
    var view_vl = [];

    if (vars['$lo.user.name'] != null) {
        var strGlobal = _scmsg(60, "Reporting");
        var inbox = new SCFile("inbox");
        var inbox_query = " SELECT inbox.name, inbox.id, operator.name, audience.type FROM inbox WHERE ";
        inbox_query += "inbox.type=\"" + lib.StringUtil.escapeAllStr(vars['$queue']) + "\" and (inbox.class=\"classList\" OR inbox.class=\"classView\")";
        inbox_query += " and " + lib.scmGetFilesHelper.getPermissionSQL4Inbox();
        inbox_query += " ORDER BY inbox.name ASC";

        if (inbox.doSelect(inbox_query) == RC_SUCCESS) {
            do {
                var localizedInboxName = lib.localizeTable.getMessageText(inbox);
                localizedInboxName = localizedInboxName == null ? inbox.inbox_name : localizedInboxName;
                if (inbox.audience_type == "oneperson") {
                    if (inbox.operator_name == _operator()) {
                        view_dl.push(localizedInboxName);
                    } else {
                        view_dl.push(localizedInboxName + " (" + inbox.operator_name + ")");
                    }
                } else {
                    view_dl.push(localizedInboxName + " (" + strGlobal + ")");
                }

                view_vl.push(inbox.inbox_name);
            } while (inbox.getNext() == RC_SUCCESS);
        }
    }

    vars.$L_temp_array = [view_dl, view_vl];

    vars['$todo.view.dl'] = vars.$L_temp_array[0];
    vars['$todo.view.vl'] = vars.$L_temp_array[1];
}

function getTimeZones() {
    var def_time_zone = vars['$G.system.info'].time_zone;
    var time_zone_dl = [];
    var time_zone_vl = [];

    var tzfile = new SCFile("tzfile", SCFILE_READONLY);
    tzfile.setFields("name");
    var sql = "true";
    var strDefault = " (" + _scmsg("default", "default") + ")";

    if (tzfile.doSelect(sql) == RC_SUCCESS) {
        do {
            time_zone_vl.push(tzfile.name);

            if (tzfile.name == def_time_zone) {
                time_zone_dl.push(tzfile.name + strDefault);
            } else {
                time_zone_dl.push(tzfile.name);
            }
        } while (tzfile.getNext() == RC_SUCCESS);
    }

    vars.$L_temp_array = [time_zone_dl, time_zone_vl];
    vars.$L_sf = _rtecall("sort", vars.$L_rc, vars.$L_temp_array, 0, 0);

    vars['$time.zone.dl'] = vars.$L_temp_array[0];
    vars['$time.zone.vl'] = vars.$L_temp_array[1];
}

function getDateFormats() {
    var def_date_format = vars["$G.system.info"].date_order;
    var date_format_dl = ["mm/dd/yy", "dd/mm/yy", "yy/mm/dd", "mm/dd/yyyy", "dd/mm/yyyy", "yyyy/mm/dd"];
    var date_format_vl = [1, 2, 3, 4, 5, 6];
    var strDefault = " (" + _scmsg("default", "default") + ")";

    var i;
    for (i = 0; i < date_format_vl.length; i++) {
        if (parseInt(date_format_vl[i]) == parseInt(def_date_format)) {
            date_format_dl[i] = date_format_dl[i] + strDefault;
        }
    }

    vars.$L_temp_array = [date_format_dl, date_format_vl];
    vars.$L_sf = _rtecall("sort", vars.$L_rc, vars.$L_temp_array, 0, 0);

    vars['$date.format.dl'] = vars.$L_temp_array[0];
    vars['$date.format.vl'] = vars.$L_temp_array[1];
}

function getLanguages() {
    var def_language = vars['$G.system.info'].syslanguage;
    var language_dl = [];
    var language_vl = [];
    var strDefault = " (" + _scmsg("default", "default") + ")";

    var i;
    var lng = vars['$G.language.ids'].length();

    for (i = 0; i < lng; i++) {
        language_vl.push(vars['$G.language.ids'][i]);
        if (vars['$G.language.ids'][i] == def_language) {
            language_dl.push(vars['$G.language.names'][i] + strDefault);
        } else {
            language_dl.push(vars['$G.language.names'][i]);
        }
    }
    vars.$L_temp_array = [language_dl, language_vl];
    vars.$L_sf = _rtecall("sort", vars.$L_rc, vars.$L_temp_array, 0, 0);

    vars['$language.dl'] = vars.$L_temp_array[0];
    vars['$language.vl'] = vars.$L_temp_array[1];
}

function changeTodoQueue() {
    getTodoViewList();
    findViewDefaultByTable();
}

function setupUserPrefVars() {
    vars['$canViewReporting'] = lib.reportingHelp.canViewReporting();
    vars['$isEnabledReporting'] = lib.reportingHelp.isEnabledReporting();
    vars['$canEditHomePage'] = false;
    if (funcs.sysinfo_get("ClientOSName") == "Web") {
        vars['$canEditHomePage'] = true;
    }

    var pageType_dl = [];
    var pageType_vl = [];

    pageType_dl.push(_scmsg("1", "Reporting"));
    pageType_vl.push("todo");

    if (vars['$isEnabledReporting'] == true) {
        pageType_dl.push(_scmsg("2", "Reporting"));
        pageType_vl.push("dashboard");
    }

    vars['$page.type.dl'] = pageType_dl;
    vars['$page.type.vl'] = pageType_vl;

    getTimeZones();
    getLanguages();
    getDateFormats();
    getDashboards();
}

function getMyDefaultPreferences() {
    setOperatorValToVars(vars['$lo.operator'], "def.");
}

function checkFlag4Update() {
    return checkChangeFlag("old.");
}

function checkFlag4Info() {
    return false;
}

function isValidPreferences() {
    if (!lib.ArrayUtil.contains(vars['$G.scm.files'], vars['$queue'])) {
        funcs.msg(funcs.scmsg("115", "us"), 2);
        return false;
    }
    return true;
}

function checkChangeFlag(perf) {
    if (vars['$' + perf + 'landing.page.type'] != vars['$landing.page.type']) {
        return true;
    }
    if (vars['$' + perf + 'dashboard'] != vars['$dashboard']) {
        return true;
    }
    if (vars['$' + perf + 'time.zone'] != vars['$time.zone']) {
        return true;
    }
    if (vars['$' + perf + 'date.format'] != vars['$date.format']) {
        return true;
    }
    if (vars['$' + perf + 'language'] != vars['$language']) {
        return true;
    }
    if (vars['$' + perf + 'notebookstyle'] != vars['$notebookstyle']) {
        return true;
    }
    if (vars['$' + perf + 'first.day'] != vars['$first.day']) {
        return true;
    }
    if (vars['$' + perf + 'queue'] != vars['$queue']) {
        return true;
    }
    if (vars['$' + perf + 'todo.view'] != vars['$todo.view']) {
        return true;
    }
    if (!funcs.same(vars['$' + perf + 'skill'], vars['$skill'])) {
        return true;
    }

    return false;
}

function checkChangeFlag4Queue(perf) {
    if (vars['$' + perf + 'queue'] != vars['$queue']) {
        return true;
    }
    if (vars['$' + perf + 'todo.view'] != vars['$todo.view']) {
        return true;
    }

    return false;
}

function setOperatorValToVars(operator, perf) {
    vars['$' + perf + 'landing.page.type'] = "todo";
    vars['$' + perf + 'dashboard'] = operator.homePage_dashboard_id;
    vars['$' + perf + 'queue'] = operator.homePage_queue;

    if (vars['$' + perf + 'queue'] == null) {
        vars['$' + perf + 'queue'] = "Todo";
    }

    if (operator.homePage_type == "-5" && vars['$isEnabledReporting'] == true) {
        vars['$' + perf + 'landing.page.type'] = "dashboard";
    }

    vars['$' + perf + 'time.zone'] = operator.time_zone;
    vars['$' + perf + 'date.format'] = operator.date_order;
    vars['$' + perf + 'language'] = operator.syslanguage;
    vars['$' + perf + 'notebookstyle'] = operator.notebook_style;
    vars['$' + perf + 'first.day'] = operator.first_day;
    vars['$' + perf + 'skill'] = operator.skill;

    if (vars['$dashboard.vl'] && vars['$' + perf + 'dashboard']) {
        if (funcs.index(vars['$' + perf + 'dashboard'], vars['$dashboard.vl']) <= 0) {
            vars['$' + perf + 'dashboard'] = null;
        }
    }
}

function getViewDefaultByOperator() {
    var record = new SCFile("ViewDefault");

    if (record.doSelect("name=\"" + _operator() + "\"") == RC_SUCCESS) {}
    vars["$viewdefaultsObject"] = record;
}

function findViewDefaultByTable() {
    vars["$todo.view"] = "";

    var objDefaults = _denull(vars["$viewdefaultsObject"].defaults);
    var lng = objDefaults.getSize();
    var strTableName = "";

    var i;
    for (i = 0; i < lng; i++) {
        strTableName = vars["$viewdefaultsObject"].defaults[i].tablename;
        if (strTableName == vars["$queue"]) {
            if (vars["$viewdefaultsObject"].defaults[i].userSet) {
                vars["$todo.view"] = vars["$viewdefaultsObject"].defaults[i].view;
            }

            break;
        }
    }

    var intPos = funcs.index(vars["$todo.view"], vars["$todo.view.vl"]);
    if (intPos == 0) {
        vars["$todo.view"] = "";
    }

    vars["$old.todo.view"] = vars["$todo.view"];
    vars["$def.todo.view"] = vars["$todo.view"];
}

function getPreferencesFromOperator() {
    var operator = new SCFile("operator");

    if (operator.doSelect("name=\"" + _operator() + "\"") == RC_SUCCESS) {
        setOperatorValToVars(operator, "");
        setOperatorValToVars(operator, "old.");
    }

    getTodoViewList();
    getViewDefaultByOperator();
    findViewDefaultByTable();
}

function saveMyPreferences() {
    var needUpdateQueue = checkChangeFlag4Queue("old.");

    var operator = new SCFile("operator");
    if (operator.doSelect("name=\"" + _operator() + "\"") == RC_SUCCESS) {
        operator.homePage_type = null;
        operator.homePage_dashboard_id = vars['$dashboard'];
        operator.homePage_queue = vars['$queue'];

        if (vars['$landing.page.type'] == "dashboard") {
            operator.homePage_type = "-5";
        }

        operator.time_zone = vars['$time.zone'];
        operator.date_order = (vars['$date.format'] != null) ? parseInt(vars['$date.format']) : null;
        operator.syslanguage = vars['$language'];
        operator.notebook_style = vars['$notebookstyle'];
        operator.first_day = vars['$first.day'];
        operator.skill = vars['$skill'];

        operator.doUpdate();
    }

    if (needUpdateQueue == true) {
        updateViewDefaultByTable();

        var record = new SCFile("ViewDefault");

        if (record.doSelect("name=\"" + _operator() + "\"") == RC_SUCCESS) {
            record.defaults = vars["$viewdefaultsObject"].defaults;
            record.doUpdate();
        } else {
            record.name = _operator();
            record.defaults = vars["$viewdefaultsObject"].defaults;
            record.doInsert();
        }
    }
}

function updateViewDefaultByTable() {
    var objDefaults = _denull(vars["$viewdefaultsObject"].defaults);
    var lng = objDefaults.getSize();
    var strTableName = "";
    var intPos = -1;

    var i;
    for (i = 0; i < lng; i++) {
        strTableName = vars["$viewdefaultsObject"].defaults[i].tablename;
        if (strTableName == vars["$queue"]) {
            intPos = i;
        }
    }

    if (intPos > -1) {
        vars["$viewdefaultsObject"].defaults = funcs._delete(vars["$viewdefaultsObject"].defaults, (intPos + 1));
    }

    if (vars["$todo.view"] != null && vars["$todo.view"] != "") {
        var length = funcs.lng(_denull(vars["$viewdefaultsObject"].defaults));
        var k;
        for (k = length; k > 0; k--) {
            vars["$viewdefaultsObject"].defaults[k].tablename = vars["$viewdefaultsObject"].defaults[k - 1].tablename;
            vars["$viewdefaultsObject"].defaults[k].view = vars["$viewdefaultsObject"].defaults[k - 1].view;
            vars["$viewdefaultsObject"].defaults[k].userSet = vars["$viewdefaultsObject"].defaults[k - 1].userSet;
        }

        vars["$viewdefaultsObject"].defaults[0].tablename = vars["$queue"];
        vars["$viewdefaultsObject"].defaults[0].view = vars["$todo.view"];
        vars["$viewdefaultsObject"].defaults[0].userSet = true;
    }
}