var _str = funcs.str;
var _denull = funcs.denull;
var _nullsub = funcs.nullsub;
var _operator = funcs.operator;

var logger = getLog("BaseUtilities.QueryHelper");


/*
 * Map the environment variable to file name;
 * When doing query on certain file, it need it's profile to provide "append query" information.
 *
 * The profiles are stored in different database tables, they may contain different table schema,
 * so provide the field name in this record. (Currently all the field name are the same)
 */
var profiles = {
    /* Change Management Profiles        (file=cm3profile) */
    "cm3r": {
        "variable.name": "$G.cm3r.environment",
        "field.name": "append.query"
    },
    "cm3t": {
        "variable.name": "$G.cm3t.environment",
        "field.name": "append.query"
    },

    /* Configuration Management Profiles (file=icmenv) */
    "device": {
        "variable.name": "$G.am.environment",
        "field.name": "append.query"
    },

    /* Contract Management Profiles      (file=ctenv) */
    "contract": {
        "variable.name": "$G.ct.environment",
        "field.name": "append.query"
    },

    /* Incident Management Profiles      (file=pmenv) */
    "probsummary": {
        "variable.name": "$G.pm.environment",
        "field.name": "append.query"
    },

    /* Knowledge Management Profiles     (file=kmprofile) */

    /* Problem Management Profiles       (file=rcenv) */
    "rootcause": {
        "variable.name": "$G.rc.environment",
        "field.name": "append.query"
    },
    "rootcausetask": {
        "variable.name": "$G.rc.environment",
        "field.name": "append.query"
    },
    "knownerror": {
        "variable.name": "$G.rc.environment",
        "field.name": "append.query"
    },
    "knownerrortask": {
        "variable.name": "$G.rc.environment",
        "field.name": "append.query"
    },

    /* Request Management Profiles       (file=ocmprofile) */
    "ocmq": {
        "variable.name": "$G.ocmq.environment",
        "field.name": "append.query"
    },
    "ocmo": {
        "variable.name": "$G.ocmo.environment",
        "field.name": "append.query"
    },
    "ocml": {
        "variable.name": "$G.ocml.environment",
        "field.name": "append.query"
    },
    "request": {
        "variable.name": "$G.request.environment",
        "field.name": "append.query"
    },

    /* Service Desk Profiles             (file=smenv) */
    "incidents": {
        "variable.name": "$G.sm.environment",
        "field.name": "append.query"
    }
};
/**
var isEmpty = function(query) {
    if (query == null || query == undefined || query.match(/^\s*$/)) return true;
    if (query.match(/^\s*true\s*$/i)) return true;
    return false;
};
*/
/*
 * Append Query only appears at the end of query string, so the "and" clause is mandatory.
 */
var formatAppendQuery = function(query) {
    // empty
    if (isEmpty(query)) {
        return "";
    }

    if (query.match(/^\s*and\s+true\s*$/i)) {
        return "";
    }

    // append query doesn't start with "and", then add one
    if (!query.match(/^\s*and\s+/i)) {
        return " and (" + query + ")";
    }

    // append query doesn't start with space, then add one
    if (!query.match(/^\s+/)) {
        return " " + query;
    }

    return query;
};

//merge from AppendQuery
// check to see if the specified variable is null
function isEmpty(varible) {
    return varible == null || varible == undefined || varible == "";
}

//merge from AppendQuery
/**
 * 
 * Append "append.query in $L.env" to $L.sql for current user and specified module
 * 
 * Gary Sun
 */

// origin sql is $L.sql value in search engine
function appendQuery(env, originSql) {
    // return value
    var result = originSql;

    // no append query need add
    if (isEmpty(env) || isEmpty(env.append_query) || isEmpty(env.append_query.trim())) {
        return result;
    }

    var appendQuery = env.append_query.trim();
    var appendQueryLc = appendQuery.toLowerCase();

    // if origin sql is null, return append query directly but remove prefix "and" or "or"
    if (isEmpty(originSql)) {
        if (appendQueryLc.startsWith("and ")) {
            result = appendQuery.substr(4);
        } else if (appendQueryLc.startsWith("or ")) {
            result = appendQuery.substr(4);
        } else {
            result = appendQuery;
        }

        return result;
    }

    // if origin sql is not null, concate origin sql and append query
    if (appendQueryLc.startsWith("and ") || appendQueryLc.startsWith("or ")) {
        result = "(" + result + ") " + appendQuery;
    } else {
        result += " and (" + appendQuery + ")";
    }

    return result;
}


/*
 * Read append query from environment variables.
 */
function buildAppendQuery(filename, isexternalSearch, isWebServiceQuery) {
    /*
     * QCCR1E90473 KM doc's URL is out of security control
     * added by Zhang, Zhen-Qing
     */
    var aquery = "";
    if (filename == "secArea" && vars['$G.disabled.area'] != null) {
        return formatAppendQuery("not (name isin $G.disabled.area)");
    }
    // end QCCR1E90473

    if (filename == "inbox") {
        if (vars['$is.report'] != null && vars['$is.report'] == true) {
            aquery = buildReportQuery();
        } else {
            aquery = buildInboxQuery();
        }
        return formatAppendQuery(aquery);
    }

    /**
     *  QCRQ1E99642[SLM] As an agreement operator, I can associate others with agreement
     */
    if (filename == "sla") {

        if (vars["$targetType"] === "ola") {
            aquery = " and category=\"ola\"";
        }
        if (vars["$targetType"] === "uc") {
            aquery = " and category=\"uc\"";
        }
        return formatAppendQuery(appendQuery) + aquery;
    }

    var profile = profiles[filename];
    if (profile == null) {
        if (logger.isDebugEnabled()) {
            logger.debug("The file \"" + filename + "\" doesn't have any associated profile record.");
        }
        return aquery; //"";
    }

    var varname = profile["variable.name"];
    var env = vars[varname];
    if (env == null) {
        logger.warn("Environment variable \"" + varname + "\" hasn't been initialized yet.");
        return aquery; //"";
    }

    var fieldname = profile["field.name"];
    var appendQuery = (env[fieldname] == null ? "" : env[fieldname]);

    /*
     * Here is something wired, the "append.query" in "Profile" should be a text string.
     * But the data type of attribute "append.query" in $G.ocmq.environment is a [C++ datum], 
     * it need to convert to javascript string (getText()), otherwise type mismatch error will occur 
     * (only string can do regex match);
     */
    if (appendQuery["getText"] != undefined) {
        appendQuery = appendQuery.getText();
    }

    /*
     * QCRQ1E97643 [PbM] Separate Known Error from Problem, restrict search query.
     */
    if (isWebServiceQuery !== true && filename == "rootcause" && vars.$G_pd_pm_enabled == true) {

        if (vars.$isKnownError == true) {
            aquery = " and isKnownError=true";
        }
        if (vars.$isKnownError == false) {
            aquery = " and category~#\"known error\"";
        }
        if (vars.$relateAction && vars.$targetType == "ke") {
            aquery = " and isKnownError=true";
        }
        if (vars.$relateAction && (vars.$targetType == "pbm" || vars.$targetType == "rootcause")) {
            aquery = " and category~#\"known error\"";
        }

    }

    return formatAppendQuery(appendQuery) + aquery;
}


/*
 * Append "append query" to certain sql query string.
 */
function buildFullQuery(query, filename) {
    return concatQuery(query, buildAppendQuery(filename));
}

/*
 * Concatenate two query string into one with "and" keywords.
 */
function concatQuery(query1, query2) {
    query1 = isEmpty(query1) ? "true" : query1;

    if (query1 == "true" && !isEmpty(query2) && query2.toUpperCase().indexOf("SELECT") == 0) {
        return query2;
    }

    query2 = formatAppendQuery(query2);
    return query1 + query2;
}

function buildInboxQuery() {
    var aquery = "";
    if (funcs.index("SysAdmin", vars['$lo.ucapex']) <= 0 && lib.security.getRights("Report", "admin") != "true") {
        aquery = " " +
            " (inbox.manager=operator() or operator.name=operator() or audience.type=\"everyone\" or " +
            " (audience.type=\"assignmentgroups\" and assignment.groups isin " + _str(_denull(vars['$lo.pm.assignments'])) + ") or " +
            " (audience.type=\"groups\" and groups isin " + _str(_denull(vars['$lo.groups'])) + ") or " +
            " (audience.type=\"role\" and role=\"" + _nullsub(vars['$G.user.role'], "NONE") + "\"))";
    }

    return aquery;
}

function buildReportQuery() {
    var aquery = "inbox.class isin {\"classList\",\"chart\",\"pivot\"}";
    if (lib.IDOL_Utilities.hasIDOLRight() == true) {
        aquery = "inbox.class isin {\"classList\",\"chart\",\"pivot\",\"htamap\"}";
    }

    if (vars['$is.dashboard'] != null && vars['$is.dashboard'] == true) {
        aquery = "inbox.class=\"dashboard\" ";
    }

    if (vars['$is.report.search'] != null && vars['$is.report.search'] == true) {
        aquery = "inbox.class isin {\"classList\",\"chart\",\"pivot\",\"dashboard\"}";
        if (lib.IDOL_Utilities.hasIDOLRight() == true) {
            aquery = "inbox.class isin {\"classList\",\"chart\",\"pivot\",\"htamap\",\"dashboard\"}";
        }
    }

    if (funcs.index("SysAdmin", vars['$lo.ucapex']) <= 0 && lib.security.getRights("Report", "admin") != "true") {
        aquery += " and " +
            " (inbox.manager=operator() or operator.name=operator() or audience.type=\"everyone\" or " +
            " (audience.type=\"assignmentgroups\" and assignment.groups isin " + _str(_denull(vars['$lo.pm.assignments'])) + ") or " +
            " (audience.type=\"groups\" and groups isin " + _str(_denull(vars['$lo.groups'])) + ") or " +
            " (audience.type=\"role\" and role=\"" + _nullsub(vars['$G.user.role'], "NONE") + "\"))";
    }

    return aquery;
}


/**
 * Whether it is a safe query
 */
function isSafe(query) {
    if (query == null) {
        return true;
    }

    // these methods are not security safe using in query
    var unsafes = [
        "parse",
        "evaluate",
        "jscall",
        "js"
    ];

    var i;
    for (i = 0; i < unsafes.length; i++) {
        if (query.indexOf(unsafes[i] + "(") >= 0) {
            return false;
        }
    }

    return true;
}

//merge from queryHelpers
/**  This function is used to translate a string into a "query safe" version
 *	*  All double quotes (") are replaced by escaped double quotes (\")
 *
 *	@param {Record} record - The current category record
 *	@return		True if successful, false if not.
 *	@type	Boolean
 */
function querySafe(string) {
    var regExp = /"/g;

    string = string.replace(regExp, "\\\"");

    return string;
}


/**
 * enable query timeout
 */
function enableQueryTimeOut() {
    // check function available first
    var value = getDefaultQueryTimeOut();
    if (!value) {
        return;
    }

    setQueryTimeOut(value);
}

function getDefaultQueryTimeOut() {
    var value = lib.rtecallUtil.getRTEParameter("sqltimeoutlimit");
    if (!value || value == "0") {
        return null;
    }

    var nvalue = Number(value);
    if (Number.isNaN(nvalue)) {
        logger.warn('Parameter value "' + value + '" of sqltimeoutlimit is invalid!');
        return null;
    }

    return nvalue;
}

/**
 * set the minimum limit value of query timeout (in seconds)
 *
 * @param {Number} timeout
 * @returns {Boolean}
 */
function setQueryTimeOut(timeout) {
    if (timeout == null || timeout < 0) {
        timeout = 0;
    }

    // minimum 30s
    if (timeout != 0 && timeout < 30) {
        timeout = 30;
    }

    logger.info("set query timeout to " + timeout + "s.");

    var rc = new SCDatum();
    funcs.rtecall("querytimeout", rc, timeout);
    return String(RC_SUCCESS) == rc.getText();
}

/**
 * disable query time out
 */
function disableQueryTimeOut() {
    // check function available first
    var value = getDefaultQueryTimeOut();
    if (!value) {
        return;
    }

    setQueryTimeOut(0);
}