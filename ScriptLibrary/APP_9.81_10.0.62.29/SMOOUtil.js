/******************************************************
 * Module Name: SMOO
 * Function: SMOO Common Methods
 * Author: Yang, Wen-Ying
 * Version: 1.00
 * Creation Date: Nov, 2009
 *******************************************************/
var _ = lib.Underscore.require();


function getOOFlowName(path) {
    var d = "/";
    return path.substr(path.lastIndexOf(d) + 1, path.length);
}

function checkURL(value) {
    if (value) {
        value = value.toLowerCase();
    }

    var urlregex = new RegExp("^(http:\/\/|https:\/\/){1}([0-9A-Za-z]+.)");
    if (urlregex.test(value)) {
        return true;
    }
    return false;
}


function getCIs(affectedCIs) {
    var ciList = [];
    if (affectedCIs != null) {
        var i;
        var length = affectedCIs.getSize();
        for (i = 0; i < length; i++) {
            var ciName = affectedCIs[i];
            if (isCIGroup(ciName)) {
                var members = lib.ciGrouping.returnGroupMembers(ciName);
                if (members != null) {
                    var j;
                    for (j = 0; j < members.length; j++) {
                        ciList[ciList.length] = members[j];
                    }
                }
            } else {
                ciList[ciList.length] = ciName;
            }
        }
    }

    ciList = _.uniq(ciList);
    return ciList;
}

function isCIGroup(ciName) {
    var device = new SCFile("device", SCFILE_READONLY);
    device.setFields("logical.name");
    var sql = 'logical.name="' + ciName + '" and type="cigroup"';
    if (device.doSelect(sql) == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}

function joinUrl() {
    var args = arguments;
    var url = '';
    var k;
    for (k = 0; k < args.length; k++) {
        var item = args[k];
        if (item.length > 0 && item.charAt(0) == '\\' && url.length > 0 && url.charAt(url.length - 1) == '\\') {
            item = item.substring(1);
        }

        url += item;
    }

    return url;
}


function basicAuthorHeader(user, pwd) {
    var header = new Header();
    header.name = "Authorization";
    header.value = "Basic " + lib.smis_CommonLib.encode64(user + ":" + pwd);
    return header;
}


/**
 * generate activity description
 *
 * @param {String} ooflow
 * @param {String} runId
 * @param {String} reportUrl
 * @param {Object} summaryObj
 * @returns {Array}
 */
function activityDescription(ooflow, runId, reportUrl, summaryObj) {

    var start;
    var end;
    var status;
    var response;
    var returnCode;

    if (summaryObj) {
        start = parseTimeString(summaryObj.startTime);
        end = parseTimeString(summaryObj.endTime);
        status = summaryObj.status;
        response = summaryObj.resultStatusName;
        returnCode = summaryObj.resultStatusType;
    }

    return [
        "OO Flow: " + ooflow + ". History Id: " + runId,
        "Report Link: " + reportUrl,
        "Start Time: " + (start || ""),
        "End Time: " + (end || ""),
        "Status: " + (status || ""),
        "Response: " + (response || ""),
        "Return Code: " + (returnCode || ""),
        "======================================================================"
    ];
}


/**
 * return time in UTC string
 *
 * @param {Object} time
 * @returns {String} 
 */
function parseTimeString(time) {
    if (time == null || (typeof time === 'string' && time.trim() == "")) {
        return "";
    }

    if (time instanceof Date) {
        return time.toUTCString();
    }

    var ntime = Number(time);

    if (Number.isNaN(ntime)) {
        // time is invalid, return raw value
        return String(time).trim();
    }

    var date = new Date(ntime);
    return date.toUTCString();
}