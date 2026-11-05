var _ = lib.Underscore.require();

function toJSON(obj) {
    return JSON.stringify(obj);
}

function jsonParse(obj) {
    return JSON.parse(obj);
}

// global functors
var _nullsub = funcs.nullsub;

// Default logger
var LOG = lib.log4js.Log;
var logger = new LOG(LOG.DEBUG, 'ReportService');

var LOGGER_MODULE_PIE = "Pie";
var LOGGER_MODULE_BAR = "Bar";
var LOGGER_MODULE_NUM = "Number";
var LOGGER_MODULE_CALCLINE = "CalcChart";
var LOGGER_MODULE_DURATION = "Duration";
var LOGGER_MODULE_GRID = "Grid";
var LOGGER_MODULE_PIVOT = "Pivot";

var libCmn = lib.reportCmn;
g_logDebug = false;


function getCurrentUsrMsgLogLevel() {
    var msgLvl = vars.$lo_operator.msglog_lvl;
    if (!msgLvl) {
        return LOG.ERROR;
    }

    return msgLvl;
}

function setLogLevel(log_level) {
    logger.setLevel(log_level);
    g_logDebug = (log_level == LOG.DEBUG);
    vars['g_logDebug'] = g_logDebug;
}

function initLogger(log_level) {
    if (!log_level) {
        log_level = getCurrentUsrMsgLogLevel();
    }

    logger.setLevel(log_level);
    g_logDebug = (log_level == LOG.DEBUG);
    vars['g_logDebug'] = g_logDebug;
}

function getLogger(logger, logModule) {
    logger.setPrefix(logModule);

    return logger;
}

function isLogDebugEnabled() {
    return g_logDebug;
}

initLogger(LOG.ERROR);

/* ------------------------------------------------------------
 Error code Definition
 ---------------------------------------------------------------*/
var ERR_UNAUTHORIZED_INBOX = 50; // "Current operator doesn't have the privilege for the report %S "
var ERR_UNAUTHORIZED_DASHBOARD = 51; // "Current operator doesn't have the privilege for the dashboard %S "
var ERR_REPORT_NOTFOUND = 52; // "Cannot find the report %S "
var ERR_DASHBOARD_NOTFOUND = 53; // "Cannot find the dashboard %S "
var ERR_REPORT_DISABLED = 204; // Report is disabled
var INFO_DISABLE_REPORT_DONE = 214; // Report (id: %S) disabled successfully
var INFO_DISABLE_REPORT_FAILED = 215; // Failed to disable report (id: %S)
var ERR_REPORT_MODIFIED = 219; // Report modified after last read
var ERR_REPORTING_DISABLED = 223; // The "In-tool-reporting" functionality is disabled

var ERR_TYPE_ERROR = "3";
var ERR_TYPE_WARN = "2";
var ERR_TYPE_INFO = "1";
var ERR_TYPE_DEBUG = "0";

var MSG_CLASS_REPORT = "Reporting";

/* ------------------------------------------------------------
 Error code Definition
 ---------------------------------------------------------------*/

// =======================  Bench timers ======================
//
// Use to store the execution time used for report/query/code
//
// =======================  ------------ ======================

var BenchTimeMgrObj = BenchTimeMgrObj || {
    tmStart: 0,
    tmEllapse: -1,

    start: function() {
        this.tmStart = Date.now();
    },
    stop: function() {
        this.tmEllapse = Date.now() - this.tmStart;
    },
    getLastEllapse: function() {
        return this.tmEllapse;
    }
};

function BenchTimeMgr() {
    this.tmStart = 0;
    this.tmEllapse = -1;
    this.msThresh = null;
    this.msThreshR = null; // time thresh in replicate db

    if (typeof BenchTimeMgr._initialized == 'undefined') {
        BenchTimeMgr.prototype.start = function() {
            this.tmStart = Date.now();
            this['startTime'] = funcs.tod();
        };
        BenchTimeMgr.prototype.stop = function() {
            this.tmEllapse = Date.now() - this.tmStart;
            this.savePerfLog();
        };

        BenchTimeMgr.prototype.getLastEllapse = function() {
            return this.tmEllapse;
        };
        BenchTimeMgr.prototype.setProperty = function(key, value) {
            this[key] = value;
        };
        BenchTimeMgr.prototype.savePerfLog = function() {
            logger.debug("Ellapse: " + this.tmEllapse + ", thresh: " + getDefaultThresh());

            var bReplicate = !!this['isReplicatedDB'];
            if (this.tmEllapse >= getDefaultThresh(bReplicate)) {
                var logId = getReportLogNextNumber();
                var logFile = new SCFile("reportLog");
                logFile['id'] = logId;
                logFile['inbox.id'] = funcs.val(this['inbox.id'], 1);
                logFile['operator'] = this['operator'];
                logFile['isBackGround'] = !!this['isBackGround'];
                logFile['query'] = this['query'];
                logFile['startTime'] = this['startTime'];
                logFile['duration'] = this.tmEllapse;
                logFile['isReplicatedDB'] = bReplicate;
                logFile['source.file'] = this['sourceFile'];
                logFile.doSave();
            }
        };

        BenchTimeMgr.prototype.init = function() {
            var op = vars.$lo_operator;
            this.setProperty('operator', op['name']);
            this.setProperty('isBackGround', vars.$G_bg);
        };
    }

    function getDefaultThresh(bReplicate) {
        var thresh = null;
        if (bReplicate) {
            thresh = getDefaultThreshOnReplicateDB();

            if (!thresh || thresh < 0) {
                thresh = getDefaultThreshProd();
            }
        } else {
            thresh = getDefaultThreshProd();
        }

        return thresh;
    }

    function getDefaultThreshProd() {
        if (!this.msThresh) {
            var defCfg = lib.settings.getSettingValue("Report", "Perf.threshold");
            if (defCfg) {
                defCfg = parseInt(defCfg, 10);
                this.msThresh = defCfg;
            }

            if (this.msThresh <= 0) {
                this.msThresh = 5000;
            }
        }

        return this.msThresh;
    }

    function getDefaultThreshOnReplicateDB() {
        if (!this.msThreshR) {
            var defCfg = lib.settings.getSettingValue("Report", "Perf.threshold.replicatedb");
            if (defCfg) {
                defCfg = parseInt(defCfg, 10);
                this.msThreshR = defCfg;
            }
        }

        return this.msThreshR;
    }

    function getReportLogNextNumber() {
        var lReturnCode = new SCDatum();
        var lNumber = new SCDatum();
        funcs.rtecall("getnumber", lReturnCode, lNumber, "reportLog");

        return funcs.val(lNumber, 1);
    }
}

// =======================  Bench timers  ======================

/**
 * Get the home dashboard id of the current user. Returns null if not set
 */
function getHomeDashboardId() {
    // Since $lo_operator might not be the latest data, so we need to fetch from operator and update the $lo.operator if necessary
    var f = new SCFile("operator", SCFILE_READONLY);
    f.setFields(['homePage.dashboard.id']);
    var rc = f.doSelect('name="' + vars.$lo_operator.name + '"');

    var homePage = null;
    if (rc == RC_SUCCESS) {
        homePage = f['homePage.dashboard.id'];
    }

    // hard coded mashup form id for dashboard
    // Update the global variable since it might out of sync with db
    var HOME_PAGE_TYPE_DASHBOARD = -5;

    var op = vars.$lo_operator;
    if ((op['homePage.type'] === HOME_PAGE_TYPE_DASHBOARD) && (homePage !== op['homePage.dashboard.id'])) {
        op['homePage.dashboard.id'] = homePage;
    }

    // homePage.dashboard.id
    return homePage;
}

// The dashboard is also stored in inbox, and the dashboard id is the inbox id
function queryDashboard(dashboard_id) {
    if (!libCmn.isReportingEnabled()) {
        throw libCmn.createReportServiceError(ERR_REPORTING_DISABLED, ERR_TYPE_INFO, []);
    }

    lib.DisplayNameCache.getDisplayNameCache().cleanAll();
    return lib.reportDashboard.queryDashboard(dashboard_id, logger);
}

function queryUserDashboards() {
    return lib.reportDashboard.queryUserDashboards(logger);
}

function createDashboard(inDashboardObj) {
    return lib.reportDashboard.createDashboard(inDashboardObj, logger);
}

function dashboardSetAsHomepage(dashboard_id, bForceAsHomePage) {
    return lib.reportDashboard.dashboardSetAsHomepage(dashboard_id, bForceAsHomePage, logger);
}

function saveDashboard(dashboardDef) {
    return lib.reportDashboard.saveDashboard(dashboardDef, logger);
}

function setHomePage(inbox_id) {
    var f = new SCFile('inbox');
    var rc = f.doSelect('inbox.id ="' + inbox_id + '"');

    if (rc != RC_SUCCESS) {
        if (isLogDebugEnabled()) {
            logger.debug('setDashboard, dashbaord not found');
        }
        throw libCmn.createReportServiceError(ERR_DASHBOARD_NOTFOUND, ERR_TYPE_INFO, [inbox_id]);
    }

    if (!libCmn.isAuthorizedForThisReport(null, f)) {
        throw libCmn.createReportServiceError(ERR_UNAUTHORIZED_DASHBOARD, ERR_TYPE_ERROR, [f.inbox_name, inbox_id]);
    }

    return lib.reportDashboard.dashboardSetAsHomepage(inbox_id, true, logger);
}

function addReportToDefaultDashboard(inbox_id) {
    return lib.reportDashboard.addReportToDefaultDashboard(inbox_id, logger);
}

function savePivotMeta(pivotMeta) {
    lib.reportPivot.savePivotMeta(pivotMeta, logger);
    var meta = getGardgetQueryMeta(pivotMeta.id);
    pivotMeta.version = meta.version;

    return pivotMeta;
}

function getAggCaption(aggName) {
    var glName = "Reporting Aggregation Type";
    var gl = libCmn.globallistGetByName(glName);

    var caption = null;

    if (gl && gl.found) {
        var i;
        var valList = gl.valueList;
        for (i = 0; i < valList.length; i++) {
            if (aggName.toUpperCase() === valList[i].toUpperCase()) {
                caption = gl.displayList[i];
                break;
            }
        }
    }

    if (!caption) {
        caption = aggName;
    }

    if (isLogDebugEnabled()) {
        logger.debug("getAggCaption, name: " + aggName + ", caption: " + caption);
    }

    return caption;
}

function GadgetQueryMeta() {
    this.id = '';
    this.containerId = '';
    this['@class'] = '';
    this.inboxClass = '';
    this.type = '';
    this.name = ''; // title
    this.table = '';
    this.query = '';
    this.source = 'aggregate';
    this.desc = '';

    this.category = {};
    this.category.id = '';
    this.category.name = '';

    this.secRights = {};

    this.isStackChart = function() {
        var upperChartType = this.type;

        if (upperChartType == null) {
            return false;
        }

        upperChartType = upperChartType.toUpperCase();
        return ((upperChartType === CHART_STACKED_HBAR) || (upperChartType === CHART_STACKED_VBAR));
    };

    this.isGridChart = function() {
        return this.inboxClass.toUpperCase() === CHART_GRID;
    };

    this.setAggregator = function(agg_func_name, agg_field) {
        if (isLogDebugEnabled()) {
            logger.debug('aggregator: ' + toJSON(this.aggregator));
        }
        if (typeof this.aggregator == 'undefined') {
            this.aggregator = {};
        }
        if (agg_func_name) {
            this.aggregator.name = agg_func_name.toUpperCase();
            this.aggregator.field = agg_field;
            this.aggregator.caption = getAggCaption(this.aggregator.name);
        } else {
            this.aggregator.name = 'COUNT';
            this.aggregator.field = agg_field;
            this.aggregator.caption = getAggCaption(this.aggregator.name);
        }

        if (isLogDebugEnabled()) {
            logger.debug('aggregator: ' + toJSON(this.aggregator));
        }
    };
}

var CHART_PIE = 'PIE';
var CHART_HBAR = 'HBAR';
var CHART_STACKED_HBAR = 'STACKEDHBAR';
var CHART_VBAR = 'VBAR';
var CHART_STACKED_VBAR = 'STACKEDVBAR';
var CHART_LINE = 'LINE';
var CHART_AREA = 'AREA';
var CHART_GRID = 'GRID';
var CHART_TREND = 'TREND';
var CHART_TITLEDGRID = "TITLEDGRID";
var CHART_NUMERIC = "NUMBER";

var CHART_MODEL_STD = "STD"; // standard model
var CHART_MODEL_CALCLINE = "CALC"; // calculated
var CHART_MODEL_TIMEDURATION = "DURATION"; // time duration

var INBOX_CLASS_GRID = 'CLASSLIST';
var INBOX_CLASS_DASHBOARD = 'DASHBOARD';
var INBOX_CLASS_CHART = 'CHART';
var INBOX_CLASS_FAVFOLDER = 'FAVORITESFOLDER';
var INBOX_CLASS_PIVOT = 'PIVOT';
var INBOX_CLASS_HTAMAP = 'HTAMAP';

function genGadgetData(gadgetId, bRefresh, bIncludeColor, bPreCalculate) {
    var benchMgr = new BenchTimeMgr();
    benchMgr.init();
    benchMgr.start();

    if (bRefresh) {
        lib.DisplayNameCache.getDisplayNameCache().cleanAll();
    }
    var ret = doGenGadgetData(gadgetId, bRefresh, benchMgr, !!bIncludeColor, !!bPreCalculate);

    benchMgr.stop();

    forceGC(true);

    return ret;
}

/**
 * Transform chart to the given toChartType and persist chart type.
 */
function saveChartType(inbox_id, version, toChartType) {
    var f = new SCFile('inbox');
    var rc = f.doSelect('inbox.id ="' + inbox_id + '" and inbox.class = "chart" ');

    if (rc != RC_SUCCESS) {
        if (isLogDebugEnabled()) {
            logger.debug('saveChartType: the report is not found ' + rc);
        }
        throw libCmn.createReportServiceError(ERR_REPORT_NOTFOUND, ERR_TYPE_INFO, [inbox_id]);
    }

    if (f.sysmodcount > version) {
        throw libCmn.createReportServiceError(ERR_REPORT_MODIFIED, ERR_TYPE_ERROR, []);
    }

    if (!libCmn.isAuthorizedForThisReport(null, f)) {
        throw libCmn.createReportServiceError(ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [f.inbox_name, inbox_id]);
    }

    if (f.report_disabled) {
        throw libCmn.createReportServiceError(ERR_REPORT_DISABLED, ERR_TYPE_INFO, []);
    }

    var objRight = libCmn.getInboxSecRight(f);
    if (!objRight.canUpdate) {
        throw libCmn.createReportServiceError(ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [f.inbox_name, inbox_id]);
    }

    f.chart_type = toChartType;
    rc = f.doUpdate();
    libCmn.checkQueryRC(rc);

    var ret = {
        "id": f.inbox_id,
        "version": f.sysmodcount,
        "type": f.chart_type,
        "@class": 'chart'
    };

    return ret;
}

function doGenGadgetData(inbox_id, bRefresh, benchMgr, bIncludeColor, bPreCalculate) {
    if (!libCmn.isReportingEnabled()) {
        throw libCmn.createReportServiceError(ERR_REPORTING_DISABLED, ERR_TYPE_INFO, []);
    }

    if (isLogDebugEnabled()) {
        logger.debug('genGadgetData, inbox_id ' + inbox_id);
    }

    logger.benchMgr = benchMgr;
    logger.bIncludeColor = bIncludeColor;
    logger.bPreCalculate = bPreCalculate;

    var meta = getGardgetQueryMeta(inbox_id);

    benchMgr.setProperty("inbox.id", inbox_id);
    benchMgr.setProperty("isReplicatedDB", meta.usereplicatedb);

    var chart_type = meta.type.toUpperCase();
    var oldLogger = logger;
    var result = null;

    if (meta['@class'].toUpperCase() === INBOX_CLASS_CHART) {
        var chartModel = meta.model;
        if (chartModel) {
            chartModel = chartModel.toUpperCase();
        }

        if (chartModel == CHART_MODEL_CALCLINE) {
            logger.setPrefix(LOGGER_MODULE_CALCLINE);
            logSourceFile(logger, meta.table);

            if (logger.bPreCalculate) {
                result = lib.reportCalcLine.lineGenResult(meta, bRefresh, logger);
            } else {
                if (meta.attributes["runinFrontend"] != null && meta.attributes["runinFrontend"] == "true") {
                    result = lib.reportCalcLine.lineGenResult(meta, bRefresh, logger);
                } else {
                    result = lib.reportCalcSvc.fetchResult(inbox_id, bRefresh, logger);
                }
            }
            delete meta.model;
        } else if (chartModel == CHART_MODEL_TIMEDURATION) {
            logger.setPrefix(LOGGER_MODULE_DURATION);
            logSourceFile(logger, meta.table);

            if (logger.bPreCalculate) {
                result = lib.reportDuration.durationGenResult(meta, bRefresh, logger);
            } else {
                if (meta.attributes["runinFrontend"] != null && meta.attributes["runinFrontend"] == "true") {
                    result = lib.reportDuration.durationGenResult(meta, bRefresh, logger);
                } else {
                    result = lib.reportCalcSvc.fetchResult(inbox_id, bRefresh, logger);
                }
            }
            delete meta.model;
        } else {
            if (chart_type === CHART_PIE) {
                logger.setPrefix(LOGGER_MODULE_PIE);

                logSourceFile(logger, meta.table);
                result = lib.reportPie.pieGenResult(meta, bRefresh, logger);
            } else if (chart_type === CHART_NUMERIC) {
                logger.setPrefix(LOGGER_MODULE_NUM);
                logSourceFile(logger, meta.table);

                result = lib.reportNumeric.numGenResult(meta, bRefresh, logger);
            } else {
                logger.setPrefix(LOGGER_MODULE_BAR);
                logSourceFile(logger, meta.table);

                result = lib.reportBar.barGenResult(meta, bRefresh, logger);
            }
        }

        //merge thresholds to result
        result.meta.attributes.thresholdsBarWidth = meta.attributes.thresholdsBarWidth;
        result.meta.attributes.thresholds = meta.attributes.thresholds;

        // merge min/max axis bounds to result
        result.meta.attributes.minAxisBounds = meta.attributes.minAxisBounds;
        result.meta.attributes.maxAxisBounds = meta.attributes.maxAxisBounds;

        // merge show data labels option
        result.meta.attributes.showDataLabels = meta.attributes.showDataLabels;

        //update number color if thresholds exists
        if (result.meta.attributes.thresholds.length > 0) {
            var value = parseFloat(result.resultSet.data[0]);
            var thldItem = _.find(result.meta.attributes.thresholds, function(thld) {
                if (!thld.from) {
                    return value <= thld.to;
                }
                if (!thld.to) {
                    return value > thld.from;
                }
                return value > thld.from && value <= thld.to;
            });
            if (thldItem) {
                result.meta.attributes['colorOfNumberChart'] = thldItem.color;
            }
        }
    }

    if (meta.isGridChart() || (meta.type.toUpperCase() === CHART_TITLEDGRID)) {
        logger.setPrefix(LOGGER_MODULE_GRID);
        logSourceFile(logger, meta.table);
        result = lib.reportGrid.gridGenResult(meta, bRefresh, logger);
    } else {
        if (meta.type.toUpperCase() === INBOX_CLASS_PIVOT) {
            logger.setPrefix(LOGGER_MODULE_PIVOT);
            logSourceFile(logger, meta.table);

            result = lib.reportPivot.pivotGenResult(meta, bRefresh, logger);
        } else if (meta.type.toUpperCase() === INBOX_CLASS_HTAMAP) {
            logger.setPrefix(INBOX_CLASS_HTAMAP);
            logSourceFile(logger, meta.table);

            result = lib.reportHtamap.htamapGenResult(meta, bRefresh, logger);
        }
    }
    if (isLogDebugEnabled()) {
        logger.debug('genGadgetData done, chart type:' + chart_type);
    }

    delete meta.usereplicatedb;

    meta.query = libCmn.fixDrilldownQuery(meta.query);

    logger = oldLogger;
    return result;
}

/**
 * Verify meta data of inbox record
 * Currently only support Chart with model calc, duration
 *
 * @param f : SCFile of inbox file
 * @returns {
 *            valid: true for succeed
 *            message: not null if <retcode> is not 0
 *          }
 */
function verifyMeta(f) {
    var bValid = false;
    var errMsg = null;
    var fieldName = null;

    try {
        var meta = new GadgetQueryMeta();
        meta = extractMeta(f, meta);

        var chart_type = meta.type.toUpperCase();
        if (meta['@class'].toUpperCase() === INBOX_CLASS_CHART) {
            var chartModel = meta.model;
            if (chartModel) {
                chartModel = chartModel.toUpperCase();
            }

            if (chartModel == CHART_MODEL_CALCLINE) {
                logger.setPrefix(LOGGER_MODULE_CALCLINE);

                lib.reportCalcLine.setupMeta(f, meta, logger);
            } else if (chartModel == CHART_MODEL_TIMEDURATION) {
                logger.setPrefix(LOGGER_MODULE_DURATION);
                lib.reportDuration.setupMeta(f, meta, logger);
            }
        }

        bValid = true;
    } catch (e) {
        errMsg = e.message || e;
        fieldName = e.fieldName;
    }

    return {
        "valid": bValid,
        "message": errMsg,
        "fieldName": fieldName
    };
}

// The property "attributes" is defined as an array of {attributename: attributevalue} structure
// The protocol wants
//    "attributes": {           // attributes field is for saving chart options. See the chart options part for all chart options.
//        "attr1": "value1",
//        "attr2": "value2",
//        "attr3": "value3"
//    }
//
function metaProcessAttributes(fInbox, meta) {
    var rawAttrs = fInbox.attributes;
    if (rawAttrs) {
        var attrs = {};
        var i;
        var size = rawAttrs.getSize();
        for (i = 0; i < size; i++) {
            attrs[rawAttrs[i].name] = rawAttrs[i].value;
        }

        meta.attributes = attrs;
    }

    // To fix the match
    var chart_type = meta.type;
    chart_type = chart_type.toUpperCase();

    if (meta['@class'].toUpperCase() === INBOX_CLASS_CHART) {
        meta.attributes["showLegend"] = _nullsub(meta.attributes["showLegend"], "true");
        meta.attributes["legendPosition"] = _nullsub(meta.attributes["legendPosition"], "right");
        meta.attributes["donut"] = _nullsub(meta.attributes["donut"], "false");
        meta.attributes["colorOfNumberChart"] = _nullsub(meta.attributes["colorOfNumberChart"], "");
        meta.attributes["decimalPlaces"] = _nullsub(meta.attributes["decimalPlaces"], "2");

        if (meta.attributes["donut"] && (!meta.attributes["donutValue"])) {
            meta.attributes["donutValue"] = "35";
        }

        //add threshold data to attributes
        meta = metaAddChartThresholdAttributes(fInbox, meta);
    }

    return meta;
}

/**
 * Get threshold settings fror the chart report
 *
 * @param fInbox: the inbox record
 * @param meta: the meta object
 * @returns {Object}
 */
function metaAddChartThresholdAttributes(fInbox, meta) {
    meta.attributes.thresholdsBarWidth = 6;
    meta.attributes.thresholds = [];

    var colorIndicatorSetting = lib.ColorIndicatorService.queryFieldColor('inbox', 'chart.threshold.color');

    var isNumberChartWithColor = meta.type && meta.type.toUpperCase() === CHART_NUMERIC && !_.isEmpty(meta.attributes['colorOfNumberChart']);
    var hasThresholds = funcs.lng(funcs.denull(fInbox['chart.threshold.color'])) > 0;

    if (hasThresholds) {
        var fromList = lib.ArrayUtil.toJsArray(fInbox['chart.threshold.from']);
        var toList = lib.ArrayUtil.toJsArray(fInbox['chart.threshold.to']);
        var colorList = lib.ArrayUtil.toJsArray(funcs.denull(fInbox['chart.threshold.color']));

        var thresholdObjList = new Array(colorList.length);
        _.each(colorList, function(color, index) {
            var _colorInd = _.find(colorIndicatorSetting, function(setting) {
                return setting.value === color;
            });
            thresholdObjList[index] = {
                from: _.isNumber(fromList[index]) ? fromList[index] : null,
                to: _.isNumber(toList[index]) ? toList[index] : null,
                color: _colorInd ? _colorInd.backgroundColor : null,
                bar: _.isNumber(toList[index]) ? toList[index] : null
            };
        });

        meta.attributes.thresholds = thresholdObjList;

        //special case for number chart, fill default color to outside-range
        if (isNumberChartWithColor) {
            var firstItem = thresholdObjList[0];
            var prefix = (_.isNumber(firstItem.from)) ? [{
                from: null,
                to: firstItem.from,
                color: meta.attributes['colorOfNumberChart'],
                bar: firstItem.to
            }] : [];
            var lastItem = _.last(thresholdObjList);
            var suffix = (_.isNumber(lastItem.to)) ? [{
                from: lastItem.to,
                to: null,
                color: meta.attributes['colorOfNumberChart'],
                bar: null
            }] : [];
            meta.attributes.thresholds = [].concat(prefix, thresholdObjList, suffix);
        }

    }

    return meta;
}

var SIMPLE_QUERY = "query";
var AGGREGATE_QUERY = "aggregate";

function getGardgetQueryMeta(inbox_id) {
    var meta = new GadgetQueryMeta();
    var f = new SCFile('inbox');
    var rc = f.doSelect('inbox.id ="' + inbox_id + '"');

    if (rc != RC_SUCCESS) {
        if (isLogDebugEnabled()) {
            logger.debug('getGardgetQueryMeta: no meta ' + rc);
        }
        throw libCmn.createReportServiceError(ERR_REPORT_NOTFOUND, ERR_TYPE_INFO, [inbox_id]);
    }

    if (!libCmn.isAuthorizedForThisReport(null, f)) {
        throw libCmn.createReportServiceError(ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [f.inbox_name, inbox_id]);
    }

    if (f.report_disabled) {
        throw libCmn.createReportServiceError(ERR_REPORT_DISABLED, ERR_TYPE_INFO, []);
    }

    return extractMeta(f, meta);
}

function extractMeta(f, meta) {
    meta.id = f.inbox_id;
    meta.containerId = f.container_id;
    meta.query = !f.use_normalized ? f.short_query : f.normalized_query;
    meta.inboxClass = f.inbox_class;
    meta['@class'] = meta.inboxClass;
    meta.desc = f.inbox_description;
    meta.version = f.sysmodcount;

    var localizedInboxName = lib.localizeTable.getMessageText(f);
    meta.name = localizedInboxName == null ? f.inbox_name : localizedInboxName;
    meta.table = f.inbox_type;
    meta.source = f.chart_source;

    meta.desc = f.inbox_description;
    meta.category.id = f.inbox_type;
    meta.category.name = libCmn.getCommonName(f.inbox_type);
    meta.usereplicatedb = f['report.use.replicate.db'];

    var objRight = libCmn.getInboxSecRight(f);
    meta.secRights = {};
    meta.secRights.canUpdate = objRight.canUpdate;
    meta.secRights.canDelete = objRight.canDelete;

    if (isLogDebugEnabled()) {
        logger.debug("Report data source: " + meta.source + ", raw query: " + meta.query);
    }
    if (meta.source === SIMPLE_QUERY) {
        meta.rowLabelField = {
            "ref": f.chart_label_field
        };
    }

    if (f.chart_type) {
        meta.type = f.chart_type;
    }
    if (isLogDebugEnabled()) {
        logger.debug("chart type: " + meta.type + ", inbox_class: " + f.inbox_class + ", use-replicate-db: " + meta.usereplicatedb);
    }

    if (f.stack_field) {
        meta.stackField = {
            "ref": removePrefixOfStructureField(f.stack_field)
        };
    }

    meta = metaProcessAttributes(f, meta);

    if ((meta.inboxClass.toUpperCase() === INBOX_CLASS_CHART) || (meta.inboxClass.toUpperCase() === INBOX_CLASS_PIVOT)) {
        meta.groupField = {};
        meta.aggregator = {};

        var aggField = null;
        if (f.aggregation_field) {
            var fMainFile = new SCFile(meta.table);

            aggField = {
                "ref": removePrefixOfStructureField(f.aggregation_field)
            };
            aggField.caption = libCmn.getFieldCaption(fMainFile, aggField.ref);
            aggField.type = libCmn.getFieldType(fMainFile, aggField.ref);
        }

        meta.groupField.ref = removePrefixOfStructureField(f.chart_break_down_by);
        meta.setAggregator(f.aggregation_type, aggField);
    }

    if (meta['@class'].toUpperCase() === INBOX_CLASS_CHART) {
        meta.groupByTimeAgg = f['groupBy.calculator'];
        meta.stackTimeAgg = f['stack.calculator'];

        var chartType = meta.type.toUpperCase();
        var chartModel = f['chart.model'];
        if (chartModel) {
            chartModel = chartModel.toUpperCase();
            meta.model = chartModel;
        }

        if (chartModel == CHART_MODEL_CALCLINE) {
            //if ( !logger.bPreCalculate )
            //  return meta;

            meta = lib.reportCalcLine.setupMeta(f, meta, logger);
        } else if (chartModel == CHART_MODEL_TIMEDURATION) {
            meta = lib.reportDuration.setupMeta(f, meta, logger);
        } else {
            if (chartType === CHART_NUMERIC) {
                meta.numericChartLabel = f['chart.number.label'];
            }
        }
    }

    // specialization for pivot table
    if (meta.inboxClass.toUpperCase() === INBOX_CLASS_PIVOT) {
        meta = lib.reportPivot.pivotSetupMeta(f, meta, logger);

        meta.aggregators = [];
        meta.aggregators.push(meta.aggregator);
    } else if (meta.inboxClass.toUpperCase() === INBOX_CLASS_HTAMAP) {
        meta.type = 'htamap';
        meta['@class'] = 'htamap';
        meta.inboxClass = 'htamap';

        meta = lib.reportHtamap.htamapSetupMeta(f, meta, logger);
    } else if (meta.inboxClass.toUpperCase() === INBOX_CLASS_GRID) {
        var listType = f.list_type;
        if (listType && listType.toLowerCase() === "title") {
            meta.type = 'titledgrid';
            meta['@class'] = 'titledgrid';
            meta.inboxClass = 'list';
            meta = lib.reportGrid.titledListSetupMeta(f, meta);
        } else {
            meta.type = 'grid';
            meta.inboxClass = 'grid';
            meta['@class'] = meta.inboxClass;
        }
        meta = lib.reportGrid.gridSetupMeta(f, meta, logger);
    }

    return meta;
}

function queryCategories(queryStr, inboxClass) {
    return lib.reportCategory.queryCategories(queryStr, inboxClass, logger);
}

/**
 * @param {Number} categoryId
 * @param {String} queryStr the string to query
 * @param {String} inboxClass type of gadget, must be 'chart','pivot' or 'grid'
 * @param {String} orderBy, must be 'name' or 'updateTime'
 * @param {String} bDesc must be '0' or '1', '0' means false
 * @param {Number} start the start number for paging query
 * @param {Number} size the page size for paging query
 * @returns {Array}
 */
function queryGadgetMetaList(categoryId, filter, inboxClass, orderBy, bDesc, startPos, count) {
    return lib.reportCategory.queryGadgetMetaList(categoryId, filter, inboxClass, orderBy, bDesc, startPos, count, logger);
}

/*
 * If the id is empty, get the sec right of report module. if id is provided, return user's rights on the specific report/dashboard.
 */
function querySecRights(inbox_id) {
    return libCmn.querySecRights(inbox_id);
}

function getUserSecRight() {
    return libCmn.getUserSecRight();
}

function hasUpdateRight(inbox_id) {
    var objRight = libCmn.querySecRights(inbox_id);
    return objRight.canUpdate;
}

/**
 * Add specified inbox to the root level of favorites folder
 * @param inbox_id
 * @returns {RC-CODE} 0 means success
 */
function addReportToFavorite(inbox_id) {
    var f = new SCFile('inbox');
    var rc = f.doSelect('inbox.id ="' + inbox_id + '"');

    if (rc != RC_SUCCESS) {
        if (isLogDebugEnabled()) {
            logger.debug('addReportToFavorite: the report is not found ' + rc);
        }
        throw libCmn.createReportServiceError(ERR_REPORT_NOTFOUND, ERR_TYPE_INFO, [inbox_id]);
    }

    if (!libCmn.isAuthorizedForThisReport(null, f)) {
        throw libCmn.createReportServiceError(ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [f.inbox_name, inbox_id]);
    }

    f.container_id = null;
    rc = f.doUpdate();

    if (isLogDebugEnabled()) {
        logger.debug("Add report " + inbox_id + " to favorite, result: " + rc);
    }

    return rc;
}

function disableReport(inbox_id) {
    var f = new SCFile('inbox');
    var rc = f.doSelect('inbox.id ="' + inbox_id + '"');

    if (!libCmn.isAuthorizedForThisReport(null, f)) {
        throw libCmn.createReportServiceError(ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [f.inbox_name, inbox_id]);
    }

    var inbox_name = f.inbox_name;
    var inbox_type = f.inbox_type;
    f.report_disabled = true;
    rc = f.doUpdate();

    var msgId = (rc == RC_SUCCESS) ? INFO_DISABLE_REPORT_DONE : INFO_DISABLE_REPORT_FAILED;
    var msg = funcs.scmsg(msgId, MSG_CLASS_REPORT, [inbox_id]);
    var tmpRet = new Datum();
    var r = funcs.rtecall("msg", tmpRet, msg, 1, null, null, 1);

    if (rc == RC_SUCCESS) {
        removeDisabledReportFromViewDefault(inbox_name, inbox_type);
    }

    return rc;
}

function removeDisabledReportFromViewDefault(inbox_name, table_name) {
    // Propose not to change the ViewDefault record
    // Just Skip the "get.records" in todo queue
    return;

    //  // Remove it from ViewDefault file
    //  var fViewDef = new SCFile("ViewDefault");
    //  var rc = fViewDef.doSelect('name="' + funcs.operator() + '"');
    //  if ( rc == RC_SUCCESS )
    //  {
    //    var defaults = fViewDef.defaults;
    //
    //    if ( defaults && defaults.getSize() > 0 )
    //    {
    //      var cntDefault = defaults.getSize();
    //      var newDefaults = new Datum();
    //      newDefaults.setType(8);
    //      
    //      var i;
    //      for ( i = 0; i < cntDefault; i++ )
    //      {
    //        var item = defaults[i];
    //        if ( item.tablename !== table_name || item.view !== inbox_name )
    //        {
    //          newDefaults.push(item);
    //        }
    //      } // for
    //
    //      fViewDef.defaults = newDefaults;
    //      rc = fViewDef.doUpdate();
    //    } // there is any data
    //  }
}

/**
 * Save the source file name for log item
 * @param logger
 * @param sourceFile - source file name
 */
function logSourceFile(logger, sourceFile) {
    var benchMgr = logger.benchMgr;
    if (benchMgr) {
        benchMgr.setProperty("sourceFile", sourceFile);
    }
}

function removePrefixOfStructureField(field_name) {
    if (field_name) {
        field_name = field_name.replace(/[.\w]+,/g, '');
    }

    return field_name;
}

function queryReportModuleConfig() {
    var ret = {
        "maxGadgetPerDashboard": lib.settings.getSettingValue("Report", "Default.maxReportPerPage"),
        "defaultDecimalPlaces": lib.settings.getSettingValue("Report", "Default.decimalPlaces"),
        "isReportingEnabled": libCmn.isReportingEnabled(),
        "copyright": funcs.scmsg("copyright", "Reporting")
    };

    if (!ret.defaultDecimalPlaces) {
        ret.defaultDecimalPlaces = 2;
    }
    if (!ret.maxGadgetPerDashboard) {
        ret.maxGadgetPerDashboard = 8;
    }

    return ret;
}