var _scmsg = funcs.scmsg;
var NONE_LOCAL = _scmsg("kwd:NONE", "local:imMatchQuery", ["", ""]);
var OR_LOCAL = _scmsg("kwd:or", "local:imMatchQuery", ["", ""]);

function getFieldCaption(field, fileName) {
    var caption = lib.tableFunctions.getFieldCaption(field, fileName);
    return _scmsg(caption, "sccaption");
}

/**This function returns the query used by incident matching for CI. This allows users to easiliy tailor the query.
 */
function getMatchingQueryForCI(affectedItem, logicalName, fileName) {
    return getMatchingQueryForCIWithDesc(affectedItem, logicalName, fileName)[0];
}

/**This function returns the query and query description used by incident matching for CI. 
 */
function getMatchingQueryForCIWithDesc(affectedItem, logicalName, fileName) {
    //this is the query used to be
    var sql = "false";
    var sqlDesc = "None";
    var serviceFieldCaption = getFieldCaption("affected.item", fileName);
    var CIFieldCaption = getFieldCaption("logical.name", fileName);
    var serviceName = lib.DisplayName.getDisplayNameByLogicalName(affectedItem);
    var CIName = lib.DisplayName.getDisplayNameByLogicalName(logicalName);

    if (logicalName !== null && affectedItem !== null) {
        sql = "affected.item=\"" + affectedItem + "\" or logical.name=\"" + logicalName + "\"";
        sqlDesc = _scmsg("kwd:matches", "local:imMatchQuery", [serviceFieldCaption, serviceName]) + OR_LOCAL + _scmsg("kwd:matches", "local:imMatchQuery", [CIFieldCaption, CIName]);
    } else {
        if (logicalName !== null) {
            sql = "logical.name=\"" + logicalName + "\"";
            sqlDesc = _scmsg("kwd:matches", "local:imMatchQuery", [CIFieldCaption, CIName]);
        } else {
            if (affectedItem !== null) {
                sql = "affected.item=\"" + affectedItem + "\"";
                sqlDesc = _scmsg("kwd:matches", "local:imMatchQuery", [serviceFieldCaption, serviceName]);
            }
        }
    }
    return [sql, sqlDesc];
}


/**This function sets the $L.service and $L.logical.name values.  This allows users to tailor the way these variables are set.
 */
function setServiceAndLogicalName(record, fileName) {
    vars.$L_service = record.affected_item;
    vars.$L_logical_name = record.logical_name;
}


/**This function checks to see if a interaction has any related incidents
 */
function hasRelatedIncident(interactionId) {
    var scRelation = new SCFile("screlation", SCFILE_READONLY);
    scRelation.setFields("source");
    var query = "source=\"" + interactionId + "\"";
    var rc = scRelation.doSelect(query);
    if (rc == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}

/**
 **This function generate the query to find incidents with same related CI or service.
 */
function getDupRelatedCIQuery(record, tablename, matchQueryCfg) {

    var maxRecords = matchQueryCfg.maxCI ? matchQueryCfg.maxCI : 250;
    var maxCILevel = matchQueryCfg.maxCILevel ? matchQueryCfg.maxCILevel : 1;

    var $ = lib.c.$;
    var CIList = [];
    var retArray = new SCDatum();
    var ret;

    if (record.logical_name) { //duplicated on CI
        ret = $.callradByRef("apm.get.related.query", {
            query: record.logical_name,
            number1: maxRecords,
            string1: 'up',
            boolean1: true,
            'cond.input': true,
            names: retArray,
            index: maxCILevel
        });
        if (ret[5] && ret[5].toArray) {
            CIList = ret[5].toArray();
        }
    }
    if (record.affected_item) { //duplicated on Service
        ret = $.callradByRef("apm.get.related.query", {
            query: record.affected_item,
            number1: maxRecords,
            string1: 'up',
            boolean1: true,
            'cond.input': false,
            names: retArray,
            index: maxCILevel
        });
        if (ret[5] && ret[5].toArray) {
            CIList = CIList.concat(ret[5].toArray());
        }
    }

    CIList.sort();
    CIList = lib.ArrayUtil.removeDuplicateEmptyElement(CIList);
    var query = "false";
    if (CIList.length > 0) {
        query = 'logical.name isin {"' + CIList.join('","') + '"}';
    }
    if (record.affected_item) {
        query = query + " or affected.item=\"" + record.affected_item + "\"";
    }
    query = query; //or close.time >= tod() - '1 00:00:00'
    var queryDesc = _scmsg("fixed:DupRelatedCIQueryDesc", "local:imMatchQuery", [maxCILevel, maxRecords]);
    return [query, queryDesc];
}

/**
 **This function generate the query to find incidents with same CI or service.
 */
function getDupCIIncidentQuery(record, tablename) {
    var queryCI = getMatchingQueryForCIWithDesc(record.affected_item, record.logical_name, funcs.filename(record));
    var query = queryCI[0]; //or close.time >= tod() - '1 00:00:00'
    var queryDesc = queryCI[1];
    return [query, queryDesc];
}

/**
 **This function generate the query to find incidents with similar title.
 */
function getSimilarIncidentQuery(record, tablename) {
    return getMatchingQueryForTitleWithDesc(record, tablename);
}

/**
 **This function generate the query to find problems with similar title.
 */
function getSimilarProblemQuery(record, tablename) {
    return getMatchingQueryForTitleWithDesc(record, tablename);
}

/**
 **This function generate the query to find problems with same CI or service.
 */
function getDupCIProblemQuery(record, tablename) {
    var queryCI = getMatchingQueryForCIWithDesc(record.affected_item, record.logical_name, funcs.filename(record));
    var query = queryCI[0]; //or close.time >= tod() - '1 00:00:00'
    return [query, queryCI[1]];
}

/**
 **This function generate the query to find known errors with similar title.
 */
function getSimilarKnownErrorQuery(record, tablename) {
    return getMatchingQueryForTitleWithDesc(record, tablename);
}

/**
 **This function generate the query to find known errors with with same CI or service.
 */
function getDupCIKnownErrorQuery(record, tablename) {
    var queryCI = getMatchingQueryForCIWithDesc(record.affected_item, record.logical_name, funcs.filename(record));
    var query = queryCI[0]; //or close.time >= tod() - '1 00:00:00'
    return [query, queryCI[1]];
}

/**
 **This function returns the query and query description used by incident matching for Title. 
 */
function getMatchingQueryForTitleWithDesc(record, tablename) {
    var query = "false";
    if (record.brief_description != null) {
        query = "brief.description#\"" + record.brief_description.replace(/"/g, "\\\"") + "\"";
    }
    var queryDesc = _scmsg("kwd:matches", "local:imMatchQuery", [getFieldCaption("brief.description", tablename), record.brief_description]);
    return [query, queryDesc];
}