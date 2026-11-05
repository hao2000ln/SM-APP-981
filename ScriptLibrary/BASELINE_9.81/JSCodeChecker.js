var $ = lib.c.$;
var _ = lib.Underscore.require();

const LINE_MAX = 999999;

// default log
var log = getLog("JSCodeChecker");
//log.setLevel("debug");

// predef globals for JSLINT sm
const predefs_jslint = [
    // global system objects
    "funcs",
    "lib",
    "system",
    "vars",

    // global methods
    "appCounter",
    "base64Decode",
    "base64Encode",
    "beginThread",
    "callrad",
    "checkAttachmentLegal",
    "collectSystemStatus",
    "compile",
    "compress",
    "compressImage",
    "CRC32",
    "createUserList",
    "deleteFile",
    "doHTTPRequest",
    "doIDOLRequest",
    "doSOAPRequest",
    "execute",
    "forceGC",
    "getLastRC",
    "getLog",
    "getLwssoToken",
    "getRecordKey",
    "getRTEParm",
    "getSimpleCacheValue",
    "getSystemCacheValue",
    "getUserList",
    "getUserMessages",
    "HandleReportExportTask",
    "HandleReportExportTask2",
    "help",
    "insertDatum",
    "Lock",
    "makeDir",
    "makeSCWebURL",
    "parseQuery",
    "print",
    "Quit",
    "RCtoString",
    "readFile",
    "removeSystemCache",
    "rteBuildSecRoleRights",
    "rteJSONParse",
    "rteJSONStringify",
    "searchUserList",
    "setAppMessage",
    "setDisableLdap",
    "setSimpleCacheValue",
    "setSystemCacheValue",
    "startProfile",
    "stopProfile",
    "stripHtml",
    "sysExec",
    "uncompressFile",
    "unescapeName",
    "uncompress",
    "Unlock",
    "writeAttachmentToFile",
    "writeFile",
    "xmlstring",

    // defined objects
    "Attachment",
    "ByteBuffer",
    "Datum",
    "Header",
    "HttpURLConnection",
    "MailReceiver",
    "SCDatum",
    "SCFile",
    "SCRecordList",
    "Script",
    "Query",
    "QueryCond",
    "XML",
    "XMLDate",

    // defined query operator
    "EQ",
    "LIKE",
    "NEQ",
    "GT",
    "GE",
    "LT",
    "LE",
    "ISIN",

    // defined constants
    "RC_SUCCESS",
    "RC_ERROR",
    "RC_NO_MORE",
    "RC_CANT_HAVE",
    "RC_DUPLICATE_KEY",
    "RC_MODIFIED",
    "RC_DELETED",
    "RC_BAD_QUERY",
    "RC_NOT_AUTHORIZED",
    "RC_VALIDATION_FAILED",
    "RC_UNABLE_TO_WRITE_TO_FILE",
    "RC_UNABLE_TO_CLOSE_FILE",
    "RC_UNABLE_TO_DELETE_FILE",
    "SCFILE_ASC",
    "SCFILE_DSC",
    "SCFILE_READONLY"
];

// default JSLint options
const options_jslint = {
    bitwise: true,
    convert: true,
    devel: true,
    eval: true,
    fart: true,
    for: true,
    fudge: true,
    getset: true,
    long: true,
    name: true,
    single: true,
    sm: true, // sm check mode
    subscript: true,
    this: true,
    unordered: true,
    white: true
};


/**
 * Check code
 *
 * @returns {String}
 */
function check(script, predefs) {
    // 1. check line code first
    var errors = lib.LineCodeChecker.check(script);

    // 2. check by 3rd party JSLINT
    errors = errors.concat(checkJSLINT(script, predefs));

    // no issue found
    if (errors.length == 0) {
        return funcs.scmsg("174", "ScriptLibrary");
    }

    var output = [];
    var i;
    for (i = 0; i < errors.length; i++) {
        var warning = errors[i];
        if (warning) {
            if (Number.isFinite(warning.line) && warning.line != LINE_MAX) {
                if (warning.column) {
                    output.push(funcs.scmsg("173", "ScriptLibrary",
                        [String(warning.line), String(warning.column)]) + '\n');
                } else {
                    output.push(funcs.scmsg("175", "ScriptLibrary",
                        [String(warning.line)]) + '\n');
                }
            }
            output.push(warning.message);

            if (i < errors.length - 1) {
                output.push('\n');
            }
        }
    }

    return output.join('');
}


/**
 * Check code by JSLINT
 *
 * @returns {Array} 
 * It returns a structure with this form:
 *
 *     errors: 
 *	   [
 *         {
 *             line: NUMBER,
 *             column: NUMBER,
 *             message: STRING,
 *         }
 *     ]
 */
function checkJSLINT(script, predefs) {
    // check whether ScriptLibrary existed
    var sl = $("ScriptLibrary", SCFILE_READONLY).setFields(["name"]).select("name=\"JSLINT\"").uniqueResult();
    if (sl == null) {
        return [];
    }

    var predefs_all = predefs_jslint;
    if (predefs) {
        predefs_all = predefs_jslint.concat(predefs);
    }
    var result = lib.JSLINT.jslint(script, options_jslint, predefs_all);

    return result.warnings;
}


/**
 * Generate a statistics report for all the ScriptLibrary records.
 *
 * @returns {Array}
 * It returns a structure with this form:
 *
 * 		report: 
 *	   	[ 
 *		   	{
 *				name: 		STRING,
 *             	lines: 		NUMBER,
 *             	warnings: 	STRING
 *         	}
 *     	]
 */
function reportAll() {
    var statistics = {};

    $("ScriptLibrary", SCFILE_READONLY).select("true").iterate(function(script) {
        var name = script.name;

        statistics[name] = {
            "name": name,
            lines: _.lines(script.script).length,
            warnings: lib.LineCodeChecker.check(script.script).length
        };
    });

    var report = [];

    Object.keys(statistics).forEach((key) => report.push(statistics[key]));

    return report;
}


/**
 * Generate a statistics report for all the ScriptLibrary records group by package.
 *
 * @returns {Array}
 * It returns a structure with this form:
 *
 * 		report: 
 *	   	[ 
 *		   	{
 *				name: 		STRING,
 *             	lines: 		NUMBER,
 *             	warnings: 	STRING
 *         	}
 *     	]
 */
function reportByPackage() {
    var statistics = {};

    $("ScriptLibrary", SCFILE_READONLY).select("true").iterate(function(script) {
        var name = script['package'];
        if (!name) {
            name = "<Empty>";
        }

        // statistics for each script package
        if (!statistics[name]) {
            statistics[name] = {
                "name": name,
                lines: 0,
                warnings: 0
            };
        }

        var lines = _.lines(script.script);
        statistics[name].lines += lines.length;
        statistics[name].warnings += lib.LineCodeChecker.check(script.script).length;
    });

    var report = [];

    Object.keys(statistics).forEach((key) => report.push(statistics[key]));

    return report;
}

function isCodeVisible(name) {
    var invisibleList = ["EncryptUtil", "FeatureSettings", "MailUtil", "operatorUtil", "smis_ConfigurationManager", "smis_InstanceConfiguration"];
    if (name && invisibleList.indexOf(name) >= 0) {
        return false;
    }

    return true;
}