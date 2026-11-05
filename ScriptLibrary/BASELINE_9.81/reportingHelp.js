var _ = lib.Underscore.require();

var _index = funcs.index;
var _str = funcs.str;
var _denull = funcs.denull;
var _rtecall = funcs.rtecall;
var _scmsg = funcs.scmsg;
var _nullsub = funcs.nullsub;
var _getFieldCaption = funcs.get_field_caption;

var REPORTWAININGCNT = 100000;

function isEnabledReporting() {
    var rtnValue = lib.settings.getSettingValue("Report", "Enable.Reporting");
    if (rtnValue == null) {
        rtnValue = false;
    }
    if (rtnValue == "false") {
        rtnValue = false;
    }
    if (rtnValue == "true") {
        rtnValue = true;
    }

    return rtnValue;
}

function displayReporting() {
    if (isEnabledReporting() == true && funcs.sysinfo_get("ClientOSName") == "Web") {
        return true;
    }

    return false;
}

function canViewReporting() {
    if (isEnabledReporting() == false || funcs.sysinfo_get("ClientOSName") != "Web") {
        return false;
    }

    if (funcs.index("SysAdmin", vars['$lo.ucapex']) > 0) {
        return true;
    }

    var strViewRight = lib.security.getRights("Report", "view");
    if (strViewRight == "true") {
        strViewRight = true;
    }
    if (strViewRight == true) {
        return true;
    }

    return false;
}

function canViewRptOverviewById(inboxId) {
    if (canViewReporting() == false) {
        return false;
    }
    if (funcs.index("SysAdmin", vars['$lo.ucapex']) > 0) {
        return true;
    }

    if (vars["$G.rpt.overviews"] == null) {
        vars["$G.rpt.overviews"] = queryRptOverviewLists();
    }

    if (inboxId != null) {
        return _index(inboxId, vars["$G.rpt.overviews"]) > 0;
    }
    return false;
}

function queryRptOverviewLists() {
    var aryRptOverviews = [10000338, 10000339, 10000372, 10000381, 10000437, 10000453, 10000468, 10000476, 10000493, 10000497, 10000568];
    var aryRtn = [];

    var inbox = new SCFile("inbox", SCFILE_READONLY);
    var inbox_query = " SELECT inbox.id FROM inbox WHERE (inbox.id isin " + _str(_denull(aryRptOverviews)) + ") and (" +
        lib.scmGetFilesHelper.getPermissionSQL4Inbox() + ")";

    if (inbox.doSelect(inbox_query) == RC_SUCCESS) {
        do {
            aryRtn.push(inbox.inbox_id);
        } while (inbox.getNext() == RC_SUCCESS);
    }

    return aryRtn;
}

function queryRptByID(inboxID) {
    var inbox = new SCFile("inbox");
    var inbox_query = "(inbox.id = " + _str(inboxID) + ")";

    if (funcs.index("SysAdmin", vars['$lo.ucapex']) == 0) {
        inbox_query += " and (" + lib.scmGetFilesHelper.getPermissionSQL4Inbox() + ")";
    }

    if (inbox.doSelect(inbox_query) == RC_SUCCESS) {
        return inbox;
    }

    return null;
}

function getReportRights() {
    var tgAdmin = lib.security.getRights("Report", "admin");
    var tgExpert = lib.security.getRights("Report", "expert");
    var tgNew = lib.security.getRights("Report", "new");

    if (tgAdmin == "true") {
        vars['$L.isReportAdmin'] = true;
    }
    if (tgExpert == "true") {
        vars['$L.isReportExpert'] = true;
    }
    if (tgNew == "true") {
        vars['$L.report.canNew'] = true;
    }

    //always, assigned, workgroup, never
    var tgUpdate = lib.security.getRights("Report", "update");
    var tgDelete = lib.security.getRights("Report", "delete");

    vars['$L.security.report.update'] = false;
    if (tgUpdate == "always" || tgUpdate == "assigned" || tgUpdate == "workgroup") {
        vars['$L.security.report.update'] = true;
    }

    //everyone, groups, assignmentgroups, role, oneperson
    var audienceType = vars["$L.file"].audience_type;

    if (audienceType == "groups" || audienceType == "assignmentgroups" || audienceType == "role") {
        if (tgUpdate == "assigned" && vars['$L.is.inbox.manager'] == true) {
            vars['$L.report.canUpdate'] = true;
        }
        if (tgDelete == "assigned" && vars['$L.is.inbox.manager'] == true) {
            vars['$L.report.canDelete'] = true;
        }
        if (tgUpdate == "always" || tgUpdate == "workgroup") {
            vars['$L.is.inbox.manager'] = true;
            vars['$L.report.canUpdate'] = true;
        }
        if (tgDelete == "always" || tgDelete == "workgroup") {
            vars['$L.report.canDelete'] = true;
        }
    }

    if (audienceType == "oneperson") {
        if (tgDelete == "always" || tgDelete == "assigned" || tgDelete == "workgroup") {
            vars['$L.report.canDelete'] = true;
        }
        if (tgUpdate == "always" || tgUpdate == "assigned" || tgUpdate == "workgroup") {
            vars['$L.report.canUpdate'] = true;
            vars['$L.is.inbox.manager'] = true;
        }
    }

    if (_nullsub(vars['$L.mode'], "") == "add" && vars['$L.report.canNew'] == true) {
        vars['$L.report.canUpdate'] = true;
        vars['$L.is.inbox.manager'] = true;
    }
}

function getDrillDownProcessName() {
    var processName = getRptAtValByKey("drillDownProcess");

    if (processName != null && processName != "") {
        return processName;
    } else {
        if (vars['$L.file'].inbox_class == "htamap") {
            return "report.drilldown4htamap";
        }
    }

    return processName;
}

function getRptAtValByKey(strKey) {
    var aryAttributes = vars['$L.file'].attributes;
    var i;
    var lng = vars['$L.file'].attributes.length();

    for (i = 0; i < lng; i++) {
        if (aryAttributes[i].name == strKey) {
            return aryAttributes[i].value;
        }
    }

    return null;
}

function getReportAttributes() {
    vars["$chart.misc.showLegend"] = getRptAtValByKey("showLegend");
    vars["$chart.misc.legendPosition"] = getRptAtValByKey("legendPosition");
    vars["$chart.misc.donut"] = getRptAtValByKey("donut");
    vars["$chart.misc.donutValue"] = getRptAtValByKey("donutValue");
    vars["$chart.misc.maxRow"] = getRptAtValByKey("maxRow");
    vars["$chart.misc.maxStackedRow"] = getRptAtValByKey("maxStackedRow");
    vars["$pivot.misc.maxRow"] = getRptAtValByKey("maxRow");
    vars["$report.misc.decimalPlaces"] = getRptAtValByKey("decimalPlaces");
    vars["$chart.misc.supportTopN"] = getRptAtValByKey("supportTopN");
    vars["$color"] = getRptAtValByKey("colorOfNumberChart");
    vars["$report.misc.drillDown"] = getRptAtValByKey("drillDownProcess");
    vars["$htamap.misc.action"] = getRptAtValByKey("htamapAction");
    vars["$htamap.misc.fromdate"] = getRptAtValByKey("htamapFromdate");
    vars["$htamap.misc.todate"] = getRptAtValByKey("htamapTodate");
    vars["$htamap.misc.keywords"] = getRptAtValByKey("htamapKeywords");
    vars["$report.misc.runinfrontend"] = getRptAtValByKey("runinFrontend");
    vars["$chart.misc.minAxis"] = getRptAtValByKey("minAxisBounds");
    vars["$chart.misc.maxAxis"] = getRptAtValByKey("maxAxisBounds");
    vars["$chart.misc.showLabels"] = getRptAtValByKey("showDataLabels");

    if (vars["$chart.misc.showLegend"] == null) {
        vars["$chart.misc.showLegend"] = "true";
    }
    if (vars["$chart.misc.legendPosition"] == null && vars["$chart.misc.showLegend"] == "true") {
        vars["$chart.misc.legendPosition"] = "right";
    }
    if (vars["$chart.misc.maxRow"] == null) {
        vars["$chart.misc.maxRow"] = lib.settings.getSettingValue("Report", "Default.maxRow");
    }
    if (vars["$chart.misc.maxStackedRow"] == null) {
        vars["$chart.misc.maxStackedRow"] = lib.settings.getSettingValue("Report", "Default.maxRow");
    }
    if (vars["$chart.misc.donutValue"] == null && vars["$chart.misc.donut"] == null) {
        vars["$chart.misc.donutValue"] = lib.settings.getSettingValue("Report", "Default.donutValue");
    }
    if (vars["$pivot.misc.maxRow"] == null) {
        vars["$pivot.misc.maxRow"] = "500";
    }
    if (vars["$report.misc.decimalPlaces"] == null) {
        vars["$report.misc.decimalPlaces"] = lib.settings.getSettingValue("Report", "Default.decimalPlaces");
    }

    vars["$list.misc.maxRow"] = vars["$chart.misc.maxRow"];

    if (vars['$chart.misc.legendPosition'] == null) {
        vars['$chart.misc.legendPosition'] = "none";
    }
    if (vars["$chart.misc.donutValue"] == null) {
        vars["$chart.misc.donutValue"] = "0";
    }
}

function updateRptAtValByKey(objKey, aryKeys) {
    var aryAttributes = vars['$L.file'].attributes;
    var lng = vars['$L.file'].attributes.length();

    var i;
    for (i = 0; i < lng; i++) {
        if (aryAttributes[i].name == objKey[1]) {
            aryAttributes[i].value = vars[objKey[0]];
            return true;
        }
    }

    aryKeys.push(objKey);
    return false;
}

function saveReportAttributes() {
    vars['$chart.misc.showLegend'] = "true";
    if (vars['$chart.misc.legendPosition'] == "none") {
        vars['$chart.misc.showLegend'] = "false";
    }
    if (vars['$chart.misc.showLegend'] == "false") {
        vars['$chart.misc.legendPosition'] = null;
    }

    vars['$chart.misc.donut'] = "true";
    if (vars['$chart.misc.donutValue'] == "0") {
        vars['$chart.misc.donutValue'] = null;
    }
    if (vars['$chart.misc.donutValue'] == null) {
        vars['$chart.misc.donut'] = "false";
    }

    if (vars['$L.file'].chart_type == "line" || vars['$L.file'].chart_type == "area") {
        vars["$chart.misc.supportTopN"] = null;
    }

    var aryKeys = [];

    updateRptAtValByKey(["$chart.misc.showLegend", "showLegend"], aryKeys);
    updateRptAtValByKey(["$chart.misc.legendPosition", "legendPosition"], aryKeys);
    updateRptAtValByKey(["$chart.misc.donut", "donut"], aryKeys);
    updateRptAtValByKey(["$chart.misc.donutValue", "donutValue"], aryKeys);
    updateRptAtValByKey(["$chart.misc.maxStackedRow", "maxStackedRow"], aryKeys);
    updateRptAtValByKey(["$report.misc.decimalPlaces", "decimalPlaces"], aryKeys);
    updateRptAtValByKey(["$chart.misc.supportTopN", "supportTopN"], aryKeys);
    updateRptAtValByKey(["$color", "colorOfNumberChart"], aryKeys);
    updateRptAtValByKey(["$report.misc.drillDown", "drillDownProcess"], aryKeys);

    updateRptAtValByKey(["$htamap.misc.action", "htamapAction"], aryKeys);
    updateRptAtValByKey(["$htamap.misc.fromdate", "htamapFromdate"], aryKeys);
    updateRptAtValByKey(["$htamap.misc.todate", "htamapTodate"], aryKeys);
    updateRptAtValByKey(["$htamap.misc.keywords", "htamapKeywords"], aryKeys);
    updateRptAtValByKey(["$report.misc.runinfrontend", "runinFrontend"], aryKeys);

    // show data labels
    updateRptAtValByKey(["$chart.misc.showLabels", "showDataLabels"], aryKeys);

    // axis bounds
    if (_.isBlank(vars["$chart.misc.minAxis"]) || Number.isNaN(vars["$chart.misc.minAxis"])) {
        vars["$chart.misc.minAxis"] = null;
    } else {
        vars["$chart.misc.minAxis"] = parseFloat(vars["$chart.misc.minAxis"]);
    }
    updateRptAtValByKey(["$chart.misc.minAxis", "minAxisBounds"], aryKeys);

    if (_.isBlank(vars["$chart.misc.maxAxis"]) || Number.isNaN(vars["$chart.misc.maxAxis"])) {
        vars["$chart.misc.maxAxis"] = null;
    } else {
        vars["$chart.misc.maxAxis"] = parseFloat(vars["$chart.misc.maxAxis"]);
    }
    updateRptAtValByKey(["$chart.misc.maxAxis", "maxAxisBounds"], aryKeys);

    if (vars["$report.misc.runinfrontend"] != null && vars["$report.misc.runinfrontend"] == "true") {
        vars['$L.file'].calcline_interval = null;
    }

    if (vars['$L.file'].inbox_class == "classList") {
        updateRptAtValByKey(["$list.misc.maxRow", "maxRow"], aryKeys);
        if (vars['$L.file'].list_type == null) {
            vars['$L.file'].list_type = "std";
        }
    } else if (vars['$L.file'].inbox_class == "pivot") {
        updateRptAtValByKey(["$pivot.misc.maxRow", "maxRow"], aryKeys);
    } else {
        updateRptAtValByKey(["$chart.misc.maxRow", "maxRow"], aryKeys);
    }

    var objKey = null;
    var lng = null;

    var i;
    for (i = 0; i < aryKeys.length; i++) {
        vars['$L.file'].attributes = funcs.insert(vars['$L.file'].attributes, 0, 1);
        lng = vars['$L.file'].attributes.length();
        objKey = aryKeys[i];
        vars['$L.file'].attributes[lng - 1].name = objKey[1];
        vars['$L.file'].attributes[lng - 1].value = vars[objKey[0]];
    }

    if (vars['$chart.misc.legendPosition'] == null) {
        vars['$chart.misc.legendPosition'] = "none";
    }
    if (vars['$chart.misc.donutValue'] == null) {
        vars['$chart.misc.donutValue'] = "0";
    }
}

function isSlmViewField(name) {
    return name === 'next.sla.target.time' || name === 'next.ola.target.time';
}

function dropSlmViewField(rtnObjs) {
    var nameList = rtnObjs[0];
    var typeList = rtnObjs[1];

    var newNameList = new Datum();
    newNameList.setType(8);
    var newTypeList = new Datum();
    newTypeList.setType(8);

    var k;
    var size = nameList.length();
    for (k = 0; k < size; k++) {
        var name = nameList[k];
        if (!isSlmViewField(name)) {
            newNameList.push(name);
            newTypeList.push(typeList[k]);
        }
    }

    rtnObjs[0] = newNameList;
    rtnObjs[1] = newTypeList;
}


function getFieldCaptionList(tableName) {
    var rtnObjs = lib.GetFieldNames.getFieldData(tableName, false, true);
    dropSlmViewField(rtnObjs);

    var rtnAryFields = new Datum();
    rtnAryFields.setType(8);
    rtnAryFields = rtnObjs[0];

    var rtnAryFieldsAll = new Datum();
    rtnAryFieldsAll.setType(8);
    rtnAryFieldsAll = rtnObjs[0];

    var rtnAryTypes = new Datum();
    rtnAryTypes.setType(8);
    rtnAryTypes = rtnObjs[1];

    var rtnAryDateFields = new Datum();
    rtnAryDateFields.setType(8);

    var rtnAryNumberFields = new Datum();
    rtnAryNumberFields.setType(8);

    var rtnAryLocalCaptions = new Datum();
    rtnAryLocalCaptions.setType(8);

    var rtnAryDateLocalCaptions = new Datum();
    rtnAryDateLocalCaptions.setType(8);

    var rtnAryNumberLocalCaptions = new Datum();
    rtnAryNumberLocalCaptions.setType(8);

    var flarrayLength = 0;
    var strCaption = "";
    if (rtnAryFields != null) {
        flarrayLength = rtnAryFields.length();

        var m;
        for (m = 0; m < flarrayLength; m++) {
            var theField = rtnAryFields[m];
            var theType = rtnAryTypes[m];

            if (theField != null && theField != "") {
                strCaption = _getFieldCaption(theField, tableName);
                rtnAryLocalCaptions.push(strCaption);

                //return datetime and number type for fields 2
                if (theType != null && (theType == 3 || theType == 1)) {
                    if (theType == 3) {
                        rtnAryDateFields.push(theField);
                        rtnAryDateLocalCaptions.push(strCaption);
                    }
                    if (theType == 1) {
                        rtnAryNumberFields.push(theField);
                        rtnAryNumberLocalCaptions.push(strCaption);
                    }
                }
            }
        }
    }

    var rtnCode = new SCDatum();
    var objFields = new Datum();
    objFields.setType(8);
    objFields.push(rtnAryLocalCaptions);
    objFields.push(rtnAryFields);
    _rtecall("sort", rtnCode, objFields, 0, 0);

    rtnAryFields = objFields[1];
    rtnAryLocalCaptions = objFields[0];

    var objFieldsNumberDate = new Datum();
    objFieldsNumberDate.setType(8);
    objFieldsNumberDate.push(rtnAryDateLocalCaptions);
    objFieldsNumberDate.push(rtnAryDateFields);
    _rtecall("sort", rtnCode, objFieldsNumberDate, 0, 0);

    rtnAryDateFields = objFieldsNumberDate[1];
    rtnAryDateLocalCaptions = objFieldsNumberDate[0];

    var objFieldsNumber = new Datum();
    objFieldsNumber.setType(8);
    objFieldsNumber.push(rtnAryNumberLocalCaptions);
    objFieldsNumber.push(rtnAryNumberFields);
    _rtecall("sort", rtnCode, objFieldsNumber, 0, 0);

    rtnAryNumberFields = objFieldsNumber[1];
    rtnAryNumberLocalCaptions = objFieldsNumber[0];

    return [rtnAryFields, rtnAryLocalCaptions, rtnAryDateFields, rtnAryDateLocalCaptions, rtnAryFieldsAll, rtnAryTypes, rtnAryNumberFields, rtnAryNumberLocalCaptions];
}

function initFormatField() {
    var objFile = vars['$L.file'];
    var aryRtn = getFieldCaptionList(objFile.inbox_type);

    vars['$report.fields.key'] = aryRtn[0];
    vars['$report.fields.display'] = aryRtn[1];

    vars['$report.fields.date.key'] = aryRtn[2];
    vars['$report.fields.date.display'] = aryRtn[3];

    vars['$report.fields.all.key'] = aryRtn[4];
    vars['$report.fields.all.type'] = aryRtn[5];

    vars['$report.fields.number.key'] = aryRtn[6];
    vars['$report.fields.number.display'] = aryRtn[7];

    vars['$report.fields.aggregation.key'] = vars['$report.fields.number.key']; //vars['$report.fields.numberdate.key'];
    vars['$report.fields.aggregation.display'] = vars['$report.fields.number.display']; //vars['$report.fields.numberdate.display'];

    vars['$report.fields.calc.aggregation.key'] = vars['$report.fields.number.key'];
    vars['$report.fields.calc.aggregation.display'] = vars['$report.fields.number.display'];

    if (_nullsub(vars['$L.file'].aggregation_field_timeduration, false) == true) {
        vars['$report.fields.calc.aggregation.key'] = vars['$report.fields.date.key'];
        vars['$report.fields.calc.aggregation.display'] = vars['$report.fields.date.display'];
    }

    vars['$report.groupby.fields.key'] = vars['$report.fields.key'];
    vars['$report.groupby.fields.display'] = vars['$report.fields.display'];

    if (vars['$L.file'].chart_type == "line" || vars['$L.file'].chart_type == "area") {
        vars['$report.groupby.fields.key'] = vars['$report.fields.date.key'];
        vars['$report.groupby.fields.display'] = vars['$report.fields.date.display'];
    }

    vars['$report.duration.fields.key'] = vars['$report.fields.date.key'];
    vars['$report.duration.fields.display'] = vars['$report.fields.date.display'];

    if (objFile.chart_break_down_by == "problem.status") {
        if (_index("problem.status", vars['$report.fields.key']) == 0) {
            objFile.chart_break_down_by = vars['$report.fields.key'][0];
        }
    }

    var fieldCaption;
    var fieldType;

    if (_index(objFile.duration_startfield, vars['$report.duration.fields.key']) == 0) {
        fieldCaption = _getFieldCaption(objFile.duration_startfield);
        vars['$report.duration.fields.key'].push(objFile.duration_startfield);
        vars['$report.duration.fields.display'].push(fieldCaption);
    }

    if (_index(objFile.duration_endfield, vars['$report.duration.fields.key']) == 0) {
        fieldCaption = _getFieldCaption(objFile.duration_endfield);
        vars['$report.duration.fields.key'].push(objFile.duration_endfield);
        vars['$report.duration.fields.display'].push(fieldCaption);
    }

    if (_index(objFile.stack_field, vars['$report.fields.key']) == 0) {
        fieldCaption = _getFieldCaption(objFile.stack_field);
        fieldType = getFieldType(objFile.stack_field, objFile.inbox_type);
        checkMultiLevelField(objFile.stack_field, fieldCaption, fieldType);
    }

    if (_index(objFile.chart_break_down_by, vars['$report.groupby.fields.key']) == 0) {
        fieldCaption = _getFieldCaption(objFile.chart_break_down_by);
        fieldType = getFieldType(objFile.chart_break_down_by, objFile.inbox_type);
        checkMultiLevelField(objFile.chart_break_down_by, fieldCaption, fieldType, true);
    }

    if (vars["$L.mode"] == "add" && objFile.report_category == null) {
        objFile.report_category = getReportCategoryByTableName(objFile.inbox_type);
    }

    if (objFile.inbox_class == "chart") {
        changeGroupByField();
    }

    if (objFile.inbox_class == "chart") {
        changeStackField();
    }
}

function checkMultiLevelField(fieldName, fieldCaption, fieldType, bGroupField) {
    var position = 0;

    if (bGroupField) {
        position = _index(fieldName, vars['$report.groupby.fields.key']);
    } else {
        position = _index(fieldName, vars['$report.fields.key']);
    }

    if (position == null || position <= 0) {
        if (bGroupField) {
            vars['$report.groupby.fields.key'].push(fieldName);
            vars['$report.groupby.fields.display'].push(fieldCaption);
        } else {
            vars['$report.fields.key'].push(fieldName);
            vars['$report.fields.display'].push(fieldCaption);
        }
        vars['$report.fields.all.key'].push(fieldName);

        var fTypeNumber = 1;
        if (fieldType == "date" || fieldType == "time") {
            fTypeNumber = 3;
        }

        vars['$report.fields.all.type'].push(fTypeNumber);
    }
}

function checkMLF4checkMLF4Duration(fieldName, fieldCaption, fieldType) {
    var position = _index(fieldName, vars['$report.duration.fields.key']);

    if (position == null || position <= 0) {
        vars['$report.duration.fields.key'].push(fieldName);
        vars['$report.duration.fields.display'].push(fieldCaption);

        vars['$report.fields.all.key'].push(fieldName);

        var fTypeNumber = 1;
        if (fieldType == "date" || fieldType == "time") {
            fTypeNumber = 3;
        }

        vars['$report.fields.all.type'].push(fTypeNumber);
    }
}

function changeGroupByField() {
    var position = 0;
    vars['$report.groupby.field.type'] = 1;
    var objFile = vars['$L.file'];

    if (objFile.chart_break_down_by != null) {
        position = _index(objFile.chart_break_down_by, vars['$report.fields.all.key']);
        if (position != null && position > 0) {
            vars['$report.groupby.field.type'] = vars['$report.fields.all.type'][position - 1];
            if (vars['$report.groupby.field.type'] != null && vars['$report.groupby.field.type'] == 3) {
                if (objFile.groupBy_calculator == null) {
                    objFile.groupBy_calculator = "YEAR";
                }
            } else {
                objFile.groupBy_calculator = null;
            }
        } else {
            objFile.groupBy_calculator = null;
        }
    } else {
        objFile.groupBy_calculator = null;
    }
}

function changeStackField() {
    var position = 0;
    vars['$report.stack.field.type'] = 1;
    var objFile = vars['$L.file'];

    if (objFile.stack_field != null) {
        position = _index(objFile.stack_field, vars['$report.fields.all.key']);
        if (position != null && position > 0) {
            vars['$report.stack.field.type'] = vars['$report.fields.all.type'][position - 1];

            if (vars['$report.stack.field.type'] != null && vars['$report.stack.field.type'] == 3) {
                if (objFile.stack_calculator == null) {
                    objFile.stack_calculator = "YEAR";
                }
            } else {
                objFile.stack_calculator = null;
            }
        } else {
            objFile.stack_calculator = null;
        }
    } else {
        objFile.stack_calculator = null;
    }
}

function changeAggregator() {
    if (vars['$L.file'].chart_type == "pie") {
        vars["$report.metrics"] = vars["$G.gl.reporting.metricsType"];
        vars["$report.metrics.display"] = vars["$G.gl.reporting.metricsType.display"];
    } else {
        vars["$report.metrics"] = vars["$G.gl.reporting.aggregationType"];
        vars["$report.metrics.display"] = vars["$G.gl.reporting.aggregationType.display"];
    }
}

function setupTableList() {
    if (vars['$L.isSysAdmin']) {
        vars['$G.report.tableList.key'] = vars['$G.files'];
    } else {
        vars['$G.report.tableList.key'] = getTableList4Owner();
        vars['$G.report.tableList.key'] = appendSLATableList(vars['$G.report.tableList.key']);
    }

    if (vars['$G.report.tableList.key'] != null) {
        vars['$G.report.tableList.display'] = getArrayLocalTableName(vars['$G.report.tableList.key']);

        var rtnCode = new SCDatum();
        var objFields = new Datum();
        objFields.setType(8);
        objFields.push(vars['$G.report.tableList.display']);
        objFields.push(vars['$G.report.tableList.key']);
        _rtecall("sort", rtnCode, objFields, 0, 0);

        vars['$G.report.tableList.key'] = objFields[1];
        vars['$G.report.tableList.display'] = objFields[0];
    }
}

function sortFieldsForList() {
    if (vars["$L.file"].inbox_class == null) {
        return true;
    }
    if (vars["$L.file"].inbox_class != "classList") {
        return true;
    }

    var rtnCode = new SCDatum();
    var objFields = new Datum();
    objFields.setType(8);
    objFields.push(vars["$L.field.list.display"]);
    objFields.push(vars["$L.field.list.key"]);
    _rtecall("sort", rtnCode, objFields, 0, 0);
    vars["$L.field.list.key"] = objFields[1];
    vars["$L.field.list.display"] = objFields[0];
}

function getTableList4Owner() {
    var rtnArray = new Datum();
    rtnArray.setType(8);

    var inbox = new SCFile("inbox", SCFILE_READONLY);
    var inbox_query = "SELECT distinct inbox.type FROM inbox  " +
        " WHERE (inbox.class=\"classList\" or inbox.class=\"classView\") and " +
        " (operator.name=\"" + vars['$lo.user.name'] + "\" or operator.name=\"" + funcs.operator() + "\" or " +
        "  (audience.type=\"everyone\" or " +
        "  (audience.type=\"groups\" and groups isin " + _str(_denull(vars['$lo.groups'])) + ") or " +
        "  (audience.type=\"assignmentgroups\" and assignment.groups isin " + _str(_denull(vars['$lo.pm.assignments'])) + ") or " +
        "  (audience.type=\"role\" and role=\"" + _nullsub(vars['$G.user.role'], "NONE") + "\"))) " +
        " ORDER BY inbox.type ASC ";

    if (inbox.doSelect(inbox_query) == RC_SUCCESS) {
        do {
            if (_index(inbox.inbox_type, rtnArray) == 0) {
                rtnArray.push(inbox.inbox_type);
            }
        } while (inbox.getNext() == RC_SUCCESS);
    }

    return rtnArray;
}

function appendSLATableList(aryTableList) {
    var rtnArray = new Datum();
    rtnArray.setType(8);
    var slaProfile = vars['$G.sla.profile'];

    if (aryTableList == null) {
        aryTableList = new Datum();
        aryTableList.setType(8);
    }

    var i;
    var lng = aryTableList.length();
    for (i = 0; i < lng; i++) {
        rtnArray.push(aryTableList[i]);
    }

    if (slaProfile != null) {
        if (_nullsub(slaProfile.slocat_view, false)) {
            rtnArray.push("slocatalog");
        }
        if (_nullsub(slaProfile.slor_view, false)) {
            rtnArray.push("slo");
        }
        if (_nullsub(slaProfile.sloa_view, false)) {
            rtnArray.push("sloavail");
        }

        if (_nullsub(slaProfile.aggregate_view, false)) {
            rtnArray.push("slamonthlyag");
        }
        if (_nullsub(slaProfile.monthly_resp_view, false)) {
            rtnArray.push("slaresponse");
        }
        if (_nullsub(slaProfile.resp_detail_view, false)) {
            rtnArray.push("sloresponse");
        }
        if (_nullsub(slaProfile.sla_active_view, false)) {
            rtnArray.push("slaactive");
        }
        if (_nullsub(slaProfile.monthly_avail_view, false)) {
            rtnArray.push("slamonthly");
        }
        if (_nullsub(slaProfile.outage_detail_view, false)) {
            rtnArray.push("outagedetail");
        }
        if (_nullsub(slaProfile.outage_event_view, false)) {
            rtnArray.push("outageevent");
        }
    }

    return rtnArray;
}

function getArrayLocalTableName(aryTableName) {
    if (aryTableName == null) {
        return null;
    }

    var lng = aryTableName.length();
    var rtnArray = new Datum();
    rtnArray.setType(8);

    var i;
    for (i = 0; i < lng; i++) {
        rtnArray.push(getLocalTableName(aryTableName[i]));
    }

    return rtnArray;
}

function getLocalTableName(tableName) {
    if (tableName == null) {
        return "";
    }

    var strDisplay = _scmsg(tableName, "tablename");

    if (strDisplay.indexOf("Could not be found") >= 0) {
        strDisplay = tableName;
    }

    return strDisplay + " - " + tableName;
}

function getReportCategoryByTableName(tableName) {
    var sql = "table.names=\"" + tableName + "\" ";
    var record = new SCFile("reportCategory", SCFILE_READONLY);
    record.setFields(["name"]);

    if (record.doSelect(sql) == RC_SUCCESS) {
        return record.name;
    }

    return "";
}

function setDefaultValue4ChangeReportType() {
    vars["$chart.misc.maxRow"] = lib.settings.getSettingValue("Report", "Default.maxRow");
    vars["$chart.misc.maxStackedRow"] = lib.settings.getSettingValue("Report", "Default.maxRow");
    vars["$pivot.misc.maxRow"] = "500";
    vars["$list.misc.maxRow"] = vars["$chart.misc.maxRow"];

    if (vars["$L.file"].inbox_class == "chart") {
        vars["$L.file"].chart_type = "pie";
        changeAggregator();
    }
}

function setDefaultValue4ChangeTable() {
    var aryRtn = getFieldCaptionList(vars['$L.file'].inbox_type);

    vars['$report.fields.key'] = aryRtn[0];
    vars['$report.fields.display'] = aryRtn[1];
    vars['$report.fields.date.key'] = aryRtn[2];
    vars['$report.fields.date.display'] = aryRtn[3];
    vars['$report.fields.all.key'] = aryRtn[4];
    vars['$report.fields.all.type'] = aryRtn[5];
    vars['$report.fields.number.key'] = aryRtn[6];
    vars['$report.fields.number.display'] = aryRtn[7];

    vars['$report.fields.aggregation.key'] = vars['$report.fields.number.key']; //vars['$report.fields.numberdate.key'];
    vars['$report.fields.aggregation.display'] = vars['$report.fields.number.display']; //vars['$report.fields.numberdate.display'];

    vars['$report.fields.calc.aggregation.key'] = vars['$report.fields.number.key'];
    vars['$report.fields.calc.aggregation.display'] = vars['$report.fields.number.display'];

    if (_nullsub(vars['$L.file'].aggregation_field_timeduration, false) == true) {
        vars['$report.fields.calc.aggregation.key'] = vars['$report.fields.date.key'];
        vars['$report.fields.calc.aggregation.display'] = vars['$report.fields.date.display'];
    }

    vars['$report.groupby.fields.key'] = vars['$report.fields.key'];
    vars['$report.groupby.fields.display'] = vars['$report.fields.display'];

    vars['$report.duration.fields.key'] = vars['$report.fields.date.key'];
    vars['$report.duration.fields.display'] = vars['$report.fields.date.display'];

    if (vars['$L.file'].chart_type == "line" || vars['$L.file'].chart_type == "area") {
        vars['$report.groupby.fields.key'] = vars['$report.fields.date.key'];
        vars['$report.groupby.fields.display'] = vars['$report.fields.date.display'];
    }

    vars['$report.groupby.field.type'] = 1;
    vars['$report.stack.field.type'] = 1;

    vars['$L.file'].chart_break_down_by = null;
    vars['$L.file'].aggregation_field = null;
    vars['$L.file'].stack_field = null;
    vars['$L.file'].short_query = "true";
    vars['$L.file'].list_type = "std";
    vars['$L.file'].list_tfields_header1Field = null;
    vars['$L.file'].list_tfields_header2Field = null;
    vars['$L.file'].list_tfields_flagField = null;
    vars['$L.file'].list_tfields_summaryField = null;
    vars['$L.file'].list_tfields_footerField = null;

    vars['$L.file'].pivot_rowField = null;
    vars['$L.file'].pivot_rowCalculator = null;
    vars['$L.file'].pivot_colField = null;
    vars['$L.file'].pivot_colCalculator = null;
    vars['$L.file'].pivot_candField = null;
    vars['$L.file'].pivot_candCalculator = null;

    vars["$chart.misc.maxRow"] = lib.settings.getSettingValue("Report", "Default.maxRow");
    vars["$chart.misc.maxStackedRow"] = lib.settings.getSettingValue("Report", "Default.maxRow");
    vars["$pivot.misc.maxRow"] = "500";
    vars["$list.misc.maxRow"] = vars["$chart.misc.maxRow"];

    if (vars['$L.file'].inbox_class == "chart" && aryRtn[0] != null) {
        if (vars['$report.fields.key'].getSize() > 0) {
            vars['$L.file'].chart_break_down_by = vars['$report.fields.key'][0];
            changeGroupByField();
        } else {
            vars['$L.file'].chart_break_down_by = null;
        }
    }

    vars['$L.file'].report_category = getReportCategoryByTableName(vars['$L.file'].inbox_type);
}

function getColumnsFromFields(aryList) {
    if (aryList == null) {
        return null;
    }

    var lng = aryList.length();
    var rtnArray = new Datum();
    rtnArray.setType(8);

    var i;
    for (i = 0; i < lng; i++) {
        if (_index(aryList[i], vars['$report.fields.key']) > 0) {
            rtnArray.push(aryList[i]);
        }
    }

    return rtnArray;
}

function addReportToDefaultDashboard(inboxId) {
    var ret = lib.ReportService.addReportToDefaultDashboard(vars['$L.file'].inbox_id);

    if (ret == RC_SUCCESS) {
        funcs.msg(_scmsg(110, "Reporting", [inboxId]), 1);
    } else if (ret && ret.message) {
        funcs.msg(ret.message, 3);
    }
}

function getCalclineFields2Vars() {
    var objFile = vars['$L.file'];

    var i;
    for (i = 1; i <= 10; i++) {
        vars['$calcline.tfield' + i] = null;
        vars['$calcline.timeagg' + i] = null;
        vars['$calcline.mfield' + i] = null;
        vars['$calcline.linequery' + i] = null;
        vars['$calcline.visible' + i] = null;
    }

    var objCalcline;
    var n;
    var lng = objFile.calcline.length();
    for (i = 0; i < lng; i++) {
        objCalcline = objFile.calcline[i];
        n = i + 1;

        vars['$calcline.tfield' + n] = objCalcline.tfield;
        vars['$calcline.timeagg' + n] = objCalcline.timeagg;
        vars['$calcline.mfield' + n] = objCalcline.mfield;
        vars['$calcline.linequery' + n] = objCalcline.linequery;
        vars['$calcline.visible' + n] = objCalcline.visible;
        vars['$calcline.tfieldtype' + n] = 1;

        if (vars['$calcline.tfield' + n] != null && vars['$calcline.tfield' + n] != "") {
            if (_index(vars['$calcline.tfield' + n], vars['$report.groupby.fields.key']) == 0) {
                var fieldCaption = _getFieldCaption(vars['$calcline.tfield' + n]);
                var fieldType = getFieldType(vars['$calcline.tfield' + n], objFile.inbox_type);
                checkMultiLevelField(vars['$calcline.tfield' + n], fieldCaption, fieldType, true);

                if (fieldType == "date" || fieldType == "time") {
                    vars['$calcline.tfieldtype' + n] = 3;
                }
            } else {
                var position = _index(vars['$calcline.tfield' + n], vars['$report.fields.all.key']);
                if (position != null && position > 0) {
                    vars['$calcline.tfieldtype' + n] = vars['$report.fields.all.type'][position - 1];
                }
            }
        }
    }
}

function setCalclineFields2File() {
    var objFile = vars['$L.file'];

    var i;
    var lng = objFile.calcline.length();
    for (i = 0; i < lng; i++) {
        objFile.calcline = funcs._delete(objFile.calcline, 1, 1);
    }

    var objCalcline;
    var n;
    for (i = 0; i < 10; i++) {
        objFile.calcline = funcs.insert(objFile.calcline, 1, 0);

        objCalcline = objFile.calcline[i];
        n = i + 1;

        objCalcline.tfield = vars['$calcline.tfield' + n];
        objCalcline.timeagg = vars['$calcline.timeagg' + n];
        objCalcline.mfield = vars['$calcline.mfield' + n];
        objCalcline.linequery = vars['$calcline.linequery' + n];
        objCalcline.visible = funcs.val(vars['$calcline.visible' + n], 4);

        if (objCalcline.tfield != null && objCalcline.tfield != "") {
            if (objCalcline.linequery == null || objCalcline.linequery == "") {
                objCalcline.linequery = "true";
            }
        }

        if (objFile.aggregation_type == "Count") {
            objCalcline.mfield = "";
        }
    }
}

function changeCalcField() {
    var position;
    var fieldName;
    var i;
    for (i = 1; i <= 10; i++) {
        fieldName = vars['$calcline.tfield' + i];
        if (fieldName != null && fieldName != "") {
            position = _index(fieldName, vars['$report.fields.all.key']);
            if (position != null && position > 0) {
                vars['$calcline.tfieldtype' + i] = vars['$report.fields.all.type'][position - 1];

                if (vars['$calcline.tfieldtype' + i] != null && vars['$calcline.tfieldtype' + i] == 3) {
                    if (vars['$calcline.timeagg' + i] == null || vars['$calcline.timeagg' + i] == "") {
                        vars['$calcline.timeagg' + i] = "YEAR";
                    }
                } else {
                    vars['$calcline.timeagg' + i] = "";
                }
            } else {
                vars['$calcline.timeagg' + i] = "";
            }
        } else {
            vars['$calcline.timeagg' + i] = "";
        }
    }
}

/**
 * Evaluate the field type and real file/field name if it's from another file
 * @param fieldName
 * @param tableName
 */
function getFieldType(fieldName, tableName) {
    if (lib.reportCmn.isAdhocField(fieldName)) {
        var adhocField = lib.reportCmn.getRealFieldNameFromAdhocFieldString(fieldName);
        tableName = adhocField.filename;
        fieldName = adhocField.fieldname;
    }

    var f = new SCFile(tableName);

    return lib.reportCmn.getFieldType(f, fieldName);
}


/**
 * Change Aggregator According to the first one
 */
function changeAggByFirst() {
    var i;
    for (i = 2; i <= 10; i++) {
        if (vars['$calcline.tfield' + i] != null && vars['$calcline.tfieldtype' + i] == 3) {
            vars['$calcline.timeagg' + i] = vars['$calcline.timeagg' + 1];
        } else {
            vars['$calcline.timeagg' + i] = null;
        }
    }
}

/**
 * Display warning when inbox record number exceeds 100k 
 */
function displayWarningOverSize() {
    var f = new SCFile("inbox", SCFILE_READONLY);
    f.setFields(["inbox.id"]);
    var amount = f.doCount("true");
    if (amount > REPORTWAININGCNT) {
        funcs.msg(_scmsg("too.many.inbox.records", "Reporting", [REPORTWAININGCNT]), 1);
    }
}


/* Append field (which is not in list) to list */
function appendFieldToList(fieldName, fieldCaption, valList, displayList) {
    var position = 0;

    position = _index(fieldName, valList);

    if (position == null || position <= 0) {
        valList.push(fieldName);
        displayList.push(fieldCaption);
    }
}