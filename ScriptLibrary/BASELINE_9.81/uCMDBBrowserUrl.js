/******************************************************
 * Module Name: SM and uCMDB Browser Integration
 * Function: Show the embed uCMDB Browser widget for the specific CI
 * Author: Jackey Xue
 * Version: 1.00
 * Creation Date: Jan, 2014
 */

function getUCMDBUrl(customerID) {
    var uCMDBBrowserURL = lib.uCMDBConfiguration.getBrowserUrl();
    if (uCMDBBrowserURL == null) {
        return null;
    }
    var url;
    var begin = uCMDBBrowserURL.indexOf("?");
    url = begin > 0 ? uCMDBBrowserURL.substring(0, begin) + "ucmdb_widget.html" : uCMDBBrowserURL + "/ucmdb_widget.html";

    url += "?";

    var ucmdbclient = lib.uCMDBConfiguration.getUcmdbDefaultClient();
    if (ucmdbclient) {
        ucmdbclient = ucmdbclient.trim();
        url += ucmdbclient.length > 0 ? "server=" + encodeURIComponent(ucmdbclient) + "&" : "";
    }

    customerID = customerID || lib.uCMDBConfiguration.getUcmdbCustomerID();
    if (customerID) {
        url += "customerID=" + customerID + "&";
    }

    var timezone = vars.$lo_time_zone;
    url += "timezone=" + encodeURIComponent(timezone);

    var passAuth = lib.uCMDBConfiguration.getPassAuthInURL();
    if (passAuth) {
        var browseruser = lib.uCMDBConfiguration.getBrowserUserName();
        var browserpwd = lib.uCMDBConfiguration.getBrowserPwd();
        url += "&username=" + browseruser + "&password=" + browserpwd;
    }

    var lang = vars.$G_my_language;
    var index = lang.indexOf("-");
    if (index > 0) {
        lang = lang.substring(0, index);
    }
    url += "&locale=" + lang;
    url += begin > 0 ? "&" + uCMDBBrowserURL.substring(begin + 1) : "";
    url += "#";
    return url;
}

function isShow(file, ignoreStatus) {
    if (lib.BaseUtil.isWindowsClient() || !lib.uCMDBConfiguration.getBrowserUrl() || (!ignoreStatus && file.rcStatus == "Closed")) {
        return false;
    }

    var logicalName = file.logical_name;
    if (logicalName == null) {
        return false;
    } else { // CI should have uCMDB ID and then show embed UI
        if (getUCMDBId(logicalName) == null) {
            return false;
        } else {
            return true;
        }
    }
}

function showImpact() {
    if (lib.uCMDBConfiguration.getShowUBImpact() && lib.BaseUtil.isWebClient() && lib.uCMDBConfiguration.getBrowserUrl()) {
        return true;
    }
    return false;
}

function showVisualization(ucmdbid) {
    if (lib.uCMDBConfiguration.getShowUBVisualization() && lib.BaseUtil.isWebClient() && lib.uCMDBConfiguration.getBrowserUrl()) {
        return true;
    }
    return false;
}

function showInNewBrowserPage() {
    if (lib.uCMDBConfiguration.getShowUBInNewBrowserPage() && lib.BaseUtil.isWebClient() && lib.uCMDBConfiguration.getBrowserUrl()) {
        return true;
    }
    return false;
}

function showGatewayWidget() {
    if (lib.BaseUtil.isWebClient()) {
        var url = lib.uCMDBConfiguration.getGatewayUrl();
        if (url) {
            return true;
        }
    }
    return false;
}

function getBrowserHistoryUrl(file) {
    var url = getUCMDBUrl(lib.discoveryEvent.getUCMDBCustomerID(file));
    if (url == null) {
        return null;
    }
    url = url + "widget=history;refocus-selection=" + getUCMDBId(file.logical_name);
    return url;
}

function getBrowserImpactUrl(ucmdbcis, page, customerID) {
    if (!page) {
        page = 0;
    }
    var MAX_CIS_PER_PAGE = 100;
    var cisperpage = lib.uCMDBConfiguration.getCIsPerImpactPage();
    if (cisperpage > MAX_CIS_PER_PAGE) {
        cisperpage = MAX_CIS_PER_PAGE;
    }
    var impactbundle = lib.uCMDBConfiguration.getImpactBundle();
    var impactseverity = lib.uCMDBConfiguration.getImpactSeverity();
    var start = 0 + page * cisperpage;
    var url = getUCMDBUrl(customerID);
    if (url == null) {
        return null;
    }
    var searchcis = [];
    var lng = ucmdbcis.length();

    var i;
    for (i = 0; i < cisperpage && i + start < lng; i++) {
        searchcis.push(ucmdbcis[i + start]);
    }
    var ciid = searchcis.join(",");
    if (!ciid) {
        ciid = "";
    }
    url = url + "global-id=" + ciid + ';widget=IMPACT';
    var tempposturl = [];

    if (impactbundle) {
        tempposturl.push('bundles=' + encodeURIComponent(impactbundle));
    }

    if (impactseverity) {
        tempposturl.push('severity=' + encodeURIComponent(impactseverity));
    }

    var posturl = tempposturl.join('&');
    if (posturl) {
        url = url + '~' + posturl;
    }

    return url;
}

function addCIUcmdbIDs(cis, ucmdbidarray) {
    if (!cis) {
        return ucmdbidarray;
    }

    if (typeof(cis) == 'string') {
        cis = [cis];
    }
    
    if (Array.isArray(cis)) {} else {
        cis = cis.toArray();
    }
    
    if (!lib.ArrayUtil.isEmpty(cis)) {
        var lng = cis.length;
        var i;
        for (i = 0; i < lng; i++) {
            var ucmdbid = getUCMDBId(cis[i]);
            if (ucmdbid) {
                ucmdbidarray.push(ucmdbid);
            }
        }
    }
    return ucmdbidarray;
}

function getBrowserRelatedUrl(ucmdbid, customerID) {
    var url = getUCMDBUrl(customerID);
    if (url == null) {
        return null;
    }
    url = url + "global-id=" + ucmdbid + ";widget=GET_RELATED";
    var filterTQL = lib.uCMDBConfiguration.getRelatedFilterTQL();
    if (filterTQL) {
        url = url + '~tql=' + encodeURIComponent(filterTQL);
    }
    return url;
}

function getUCMDBId(logicalName) {
    var result = null;
    var device = new SCFile("device", SCFILE_READONLY);
    device.setFields(["ucmdb.id"]);
    var rc = device.doSelect("logical.name=\"" + logicalName + "\"");
    if (rc == RC_SUCCESS) {
        result = device.ucmdb_id;
    }
    return result;
}