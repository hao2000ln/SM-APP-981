// drilldown process mapping 
const DRILLDOWNPROCESS_MAPPING = [{
        "name": "report.drilldown.todo",
        "tables": ["Todo"]
    },
    {
        "name": "report.drilldown.cm3r",
        "tables": ["cm3r"]
    },
    {
        "name": "report.drilldown.kmusagestats",
        "tables": ["kmusagestats"]
    }
];


/**
 * check report drill down process whether match source table
 *
 * @param {SCFile} report
 * @returns {Boolean}
 */
function checkDrillDownProcess(report) {
    if (!report) {
        return true;
    }

    var reportType = report.inbox_class;

    // check standard type report only
    if (funcs.index(reportType, vars.$G_gl_report_standard_types_key) == 0) {
        return true;
    }

    // drilldown process
    var process = getDrillDownProcessName(report);
    if (!process) {
        return true;
    }

    var sourceData = report.inbox_type;

    // unmatch if source data not set
    if (!sourceData) {
        return false;
    }

    var i;
    for (i = 0; i < DRILLDOWNPROCESS_MAPPING.length; i++) {
        var mapping = DRILLDOWNPROCESS_MAPPING[i];
        if (mapping.name == process) {
            return mapping.tables.indexOf(sourceData) >= 0;
        }
    }

    // valid if process not in the list
    return true;
}


/**
 * get drill down process name of a report
 *
 * @param {SCFile} report
 * @returns {String}
 */
function getDrillDownProcessName(report) {
    var attributes = report.attributes;
    var i;
    var length = attributes.length();

    for (i = 0; i < length; i++) {
        if (attributes[i].name == "drillDownProcess") {
            return attributes[i].value;
        }
    }
    return null;
}


function getMapping() {
    return DRILLDOWNPROCESS_MAPPING;
}