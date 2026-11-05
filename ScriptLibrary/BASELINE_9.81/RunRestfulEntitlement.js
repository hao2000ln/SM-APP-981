/**
 * Smart Search entitlement API
 */
var _ = lib.Underscore.require();
var IDOLKMQuery = lib.IDOLKMQuery.require();
var IDOLKMSecurity = lib.IDOLKMSecurity.require();
var XQuery = lib.XQuery.require();
// Flag to switch between global cache and IDOL way to retrieve access filters for evaluating invisible catalog ids for current operator.
var ENABLE_CACHE_FLAG = true;
var CATALOG_ACCESS_FILTER_CACHE_QUERY_LIMIT=2000;
var CATALOG_ACCESS_FILTER_QUERY_LIMIT=1000;

var logger = getLog('RunRestfulEntitlement');

var fakeKMQuery = new SCFile('kmquery', SCFILE_READONLY);
fakeKMQuery.query = '*';
var fakeCriteria = {
    'ignorelanguage': true
};

function IDOLEntitlementKMQuery(fKMQuery, criteria, ctx) {
    this._ctx = ctx || {};
    IDOLKMQuery.apply(this, arguments);
}

function F() {}
F.prototype = IDOLKMQuery.prototype;
IDOLEntitlementKMQuery.prototype = new F();
IDOLEntitlementKMQuery.prototype.constructor = IDOLEntitlementKMQuery;

IDOLEntitlementKMQuery.prototype.getSelectedLibraries = function() {
    var libnames = this._ctx.libnames || [];
    var kmlibs = this.getAvailableLibraries(funcs.operator());
    var selectedLibs = [];
    _.each(libnames, function(libname) {
        var kmlib = _.findWhere(kmlibs, {
            kbname: libname
        });
        if (!kmlib) {
            logger.warn('library ' + libname + ' is not available');
        } else {
            selectedLibs.push(kmlib);
        }
    });

    this.getSelectedLibraries = function() {
        return selectedLibs;
    };

    return selectedLibs;
};

IDOLEntitlementKMQuery.prototype.hasAttachmentLibrary = function() {
    return false;
};

IDOLEntitlementKMQuery.prototype.hasSharePoint = function() {
    return false;
};


function isTrueFilter(filter) {
    return (filter == null || filter == "" || filter == true || filter.toLowerCase() == "true");
}

function getCacheRecord(name) {
    var f = new SCFile("systemCache");
    var rc = f.doSelect('name="' + name + '"');
    if (rc == RC_SUCCESS) {
        return f;
    }
    return null;
}

//call in trigger after add
function addCatalogAccessFilterCache(file) {
    var oldfilter = file.access_filter;
    if (isTrueFilter(oldfilter)) {
        //nother to do 
        return;
    }
    try {
        var cache = getCacheRecord("joinsvcDisplay");
        if (cache == null || !cache.isEnabled) {
            //if not enable, nothing to do here
            return;
        }
        var result = cache.value ? lib.smis_CommonLib.fromJSON(cache.value) : [];
        result.push({
            id: file["id"],
            access_filter: oldfilter
        });
        cache.value = lib.smis_CommonLib.toJSON(result);
        cache.doUpdate();
    } catch (e) {
        logger.error("addCatalogAccessFilterCache meet exception:" + e);
    }
}

//call in trigger before delete 
function removeCatalogAccessFilterCache(file) {
    var oldfilter = file.access_filter;
    if (isTrueFilter(oldfilter)) {
        //nother to do 
        return;
    }
    try {
        var cache = getCacheRecord("joinsvcDisplay");
        if (cache == null || !cache.isEnabled) {
            //if not enable, nothing to do here
            return;
        }
        var result = cache.value ? lib.smis_CommonLib.fromJSON(cache.value) : [];
        var i;
        for (i = 0; result && i < result.length; i++) {
            if (file["id"] == result[i].id) {
                result.splice(i, 1);
                i--;
            }
        }
        cache.value = lib.smis_CommonLib.toJSON(result);
        cache.doUpdate();
    } catch (e) {
        logger.error("removeCatalogAccessFilterCache meet exception:" + e);
    }
}

function refreshCatalogAccessFilterCache() {
    try {
        var f = new SCFile("systemCache");
        var rc = f.doPurge('name="joinsvcDisplay"');
    } catch (e) {
        logger.error("refreshCatalogAccessFilterCache meet exception:" + e);
    }
}

//call in trigger after update
function modifyCatalogAccessFilterCache(oldfile, newfile) {
    try {
        var cache = getCacheRecord("joinsvcDisplay");
        if (cache == null || !cache.isEnabled) {
            //if not enable, nothing to do here
            return;
        }

        var oldfilter = oldfile.access_filter;
        var newfilter = newfile.access_filter;
        //todo: check the change type
        if (oldfilter == newfilter || (isTrueFilter(oldfilter) && isTrueFilter(newfilter))) {
            //the same
            return;
        }
        var isremove = false;
        if (isTrueFilter(newfilter)) {
            isremove = true;
        }
        //notrue =>true or null

        var result = cache.value ? lib.smis_CommonLib.fromJSON(cache.value) : [];
        var i;

        //add or modify
        if (!isremove) {
            var isalreadyin = false;
            for (i = 0; result && i < result.length; i++) {
                if (newfile["id"] == result[i].id) {
                    isalreadyin = true;
                    result[i].access_filter = newfilter;
                }
            }
            if (!isalreadyin) {
                result.push({
                    id: newfile["id"],
                    access_filter: newfilter
                });
            }
        } else {
            //to remove one json object
            for (i = 0; result && i < result.length; i++) {
                if (newfile["id"] == result[i].id) {
                    result.splice(i, 1);
                    i--;
                }
            }
        }
        cache.value = lib.smis_CommonLib.toJSON(result);
        cache.doUpdate();
    } catch (e) {
        logger.error("modifyCatalogAccessFilterCache meet exception:" + e);
    }
}

function setCatalogAccessFilterCache() {
    try {
        var fieldquery = "(NOTMATCH{true}:ACCESS_FILTER)";
        var command = {
            "action": "Query",
            "TotalResults": false,
            "IgnoreSpecials": false,
            "DetectLanguagetype": true,
            "DatabaseMatch": "Catalog_Library",
            "Predict": false,
            "AnyLanguage": true,
            "TimeoutMS": 3000,
            "MaxResults": CATALOG_ACCESS_FILTER_CACHE_QUERY_LIMIT,
            "PrintFields": "ID,ACCESS_FILTER",
            "Text": "*",
            "FieldText": fieldquery
        };
        var IDOLClientFactory = lib.IDOLClientFactory.require();
        var gsclient = IDOLClientFactory.create('GlobalSearch');
        var doc = gsclient.executeAction(command);
        var collection = XQuery.query('responsedata/autn:hit', doc);
        var result = _.map(collection, function(hit) {
            var data = XQuery.queryObject({
                id: 'autn:content/DOCUMENT/ID',
                access_filter: 'autn:content/DOCUMENT/ACCESS_FILTER'
            }, hit);
            return data;
        });
        if (result.length == CATALOG_ACCESS_FILTER_CACHE_QUERY_LIMIT) {
          logger.warn('Access filter query limit hit when build cache');
        }
        var strdata = lib.smis_CommonLib.toJSON(result);
        var cache = getCacheRecord("joinsvcDisplay");
        if (cache == null) {
            //do insert
            var f = new SCFile("systemCache");
            f.name = "joinsvcDisplay";
            f.isEnabled = true;
            f.value = strdata;
            f.doInsert();
        } else {
            cache.value = strdata;
            cache.isEnabled = true;
            f.doUpdate();
        }
    } catch (e) {
        logger.error('setCatalogCache meet exception:' + e);
    }

}

function checkCatalogQueryPolicy(query) {
    var cache = getCacheRecord("joinsvcDisplay");
    //need check catalog already indexed
    if (ENABLE_CACHE_FLAG && cache == null && lib.KMUtils.isIndexedFile("joinsvcDisplay")) {
        //set flag first
        setCatalogAccessFilterCache();
        cache = getCacheRecord("joinsvcDisplay");
    }
    if (ENABLE_CACHE_FLAG && cache != null && cache.isEnabled) {
        var filter = cache.value;
        //print("get cache is:"+filter);
        var result = lib.smis_CommonLib.fromJSON(filter);
        var invalidids = [];
        var i;
        for (i = 0; result && i < result.length; i++) {
            var access_filter = result[i].access_filter || "true";
            var canaccess = funcs.parse_evaluate(access_filter, 2);
            if (!canaccess) {
                invalidids.push(result[i].id);
            }
        }
        if (invalidids.length > 0) {
            return "(NOTMATCH{" + invalidids.join(",") + "}:ID)";
        }
    } else {
        return makeCatalogQuery(query);
    }
    return null;
}

function makeCatalogQuery(query) {
    try {
        var kmentityquery = new IDOLEntitlementKMQuery(fakeKMQuery, fakeCriteria, {
            libnames: ["Catalog_Library"]
        });
        var idolrequest = kmentityquery.buildParams() || {};
        var fieldquery = "(NOTMATCH{true}:ACCESS_FILTER)";
        if (idolrequest.FieldText) {
            fieldquery += " AND " + idolrequest.FieldText;
        }
        var command = {
            "action": "Query",
            "TotalResults": false,
            "IgnoreSpecials": false,
            "DetectLanguagetype": true,
            "DatabaseMatch": "Catalog_Library",
            "Predict": false,
            "AnyLanguage": true,
            "TimeoutMS": 3000,
            "MaxResults": CATALOG_ACCESS_FILTER_QUERY_LIMIT,
            "PrintFields": "ID,ACCESS_FILTER",
            "Text": query,
            "FieldText": fieldquery
        };
        var IDOLClientFactory = lib.IDOLClientFactory.require();
        var gsclient = IDOLClientFactory.create('GlobalSearch');
        var doc = gsclient.executeAction(command);
        var collection = XQuery.query('responsedata/autn:hit', doc);
        var result = _.map(collection, function(hit) {
            var data = XQuery.queryObject({
                id: 'autn:content/DOCUMENT/ID',
                access_filter: 'autn:content/DOCUMENT/ACCESS_FILTER'
            }, hit);
            return data;
        });
        if (result.length == CATALOG_ACCESS_FILTER_QUERY_LIMIT) {
          logger.warn('Access filter query limit hit when perform catalog query');
        }
        var invalidids = [];
        var i;
        for (i = 0; result && i < result.length; i++) {
            var access_filter = result[i].access_filter || "true";
            var canaccess = funcs.parse_evaluate(access_filter, 2);
            if (!canaccess) {
                invalidids.push(result[i].id);
            }
        }
        if (invalidids.length > 0) {
            return "(NOTMATCH{" + invalidids.join(",") + "}:ID)";
        }
    } catch (e) {
        logger.error('makeCatalogQuery meet exception:' + e);
    }
    return null;
}

function GET(req, res) {
    var uri = req.uri || [];
    var libnames = uri[2] || '';
    libnames = libnames.split(',');
    libnames = _.map(libnames, function(libname) {
        return _.trim(libname);
    });
    if (libnames.length === 0) {
        return res.status(400).message('library not specified');
    }
    var query = req.options.query;
    var robUser = req.options.view;
    var oriOperator = funcs.operator();
    if (robUser && oriOperator != robUser) {
        lib.GatewayAPI_Util.changeUserSession(robUser);
    }
    var kmquery = new IDOLEntitlementKMQuery(fakeKMQuery, fakeCriteria, {
        "libnames": libnames
    });
    if (kmquery.getSelectedLibraries().length === 0) {
        // user doesn't have privilege to view any library, or library is not exists
        res.send({
            "libname": libnames.join(","),
            "entitlement": "FALSE"
        });
        if (robUser && oriOperator != robUser) {
            lib.GatewayAPI_Util.changeUserSession(oriOperator);
        }
        return;
    }
    var libs = kmquery.getSelectedLibraries();

    var cataquery = null;
    var i;
    var securityInfoFlag = false;
    for (i = 0; i < libs.length; i++) {
        if (libs[i].kbname == 'Catalog_Library') {
            cataquery = checkCatalogQueryPolicy(query);
        }
        var kbtype = libs[i].kbtype;
        if (kbtype === 'splib' || kbtype === 'confluencelib') {
            securityInfoFlag = securityInfoFlag || !libs[i].no_security;
        }
    }
    var sarequest = kmquery.buildParams() || {};
    if (cataquery) {
        var orgtext = sarequest.FieldText;
        var identifystr = "(MATCH{Catalog_Library}:KNOWLEDGEBASE_NAME_MATCH)";
        var pos = orgtext.indexOf(identifystr);
        if (pos != -1) {
            var newtext = orgtext.substring(0, pos + identifystr.length);
            newtext = newtext + " AND " + cataquery + orgtext.substr(pos + identifystr.length);
            sarequest.FieldText = newtext;
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug(JSON.stringify(sarequest));
    }
    var retEntity = {
        "libname": sarequest.DatabaseMatch,
        "entitlement": sarequest.FieldText
    };
    if (securityInfoFlag) {
        var operator = funcs.operator();
        retEntity.securityInfo = IDOLKMSecurity.getSecurityInfo(operator)['securityinfo'];
        if (!retEntity.securityInfo) {
            logger.warn('Unable to get security info for operator ' + operator);
        }
    }
    res.send(retEntity);
    if (robUser && oriOperator != robUser) {
        lib.GatewayAPI_Util.changeUserSession(oriOperator);
    }
}


function authorize() {
    return true;
}