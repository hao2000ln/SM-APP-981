var _ = lib.Underscore.require();
var XQuery = lib.XQuery.require();
var IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require();
var logger = getLog('IDOLKMHotnewsSearch');
var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require();
var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;
var JSON = lib.JSON.json();
    
function getAllOutOfDateHotnews() {
    try {
        var KMQuery_IDOL = lib.KMQuery_IDOL.require();
        var tod = KMQuery_IDOL.getEpochSeconds(system.functions.tod());
        var fieldquery = '(MATCH{true}:HOTNEWS_MATCH)+AND+RANGE{.,' + tod + '}:HOTNEWS_END_DATE';
        var command = {
            "action": "Query",
            "TotalResults": false,
            "IgnoreSpecials": false,
            "DatabaseMatch": "Knowledge_Library",
            "AnyLanguage": true,
            "TimeoutMS": 30000,
            "MaxResults": 2000,
            "PrintFields": "ID",
            "Text": "*",
            "FieldText": fieldquery
        };
        var IDOLClientFactory = lib.IDOLClientFactory.require();
        var gsclient = IDOLClientFactory.create('GlobalSearch');
        var doc = gsclient.executeAction(command);
        var collection = XQuery.query('responsedata/autn:hit', doc);
        var result = _.map(collection, function(hit) {
            var data = XQuery.queryObject({
                id: 'autn:content/DOCUMENT/ID'
            }, hit);
            return data;
        });
        return result;
    } catch (e) {
        logger.error('getAllOutOfDateHotnews meet exception:' + e);
    }
}

function updateHotNews() {
    //first check do we need to handle it now
    var dt = new Date();
    var hour = dt.getHours();
    //we will run it at 0,6,12,18
    if (hour % 6 != 0) {
        //logger.info("not this time");
        //nothing to do
        return;
    }
    if (system.vars.$G_bg_last_update_hotnews && system.vars.$G_bg_last_update_hotnews.getHours() == hour) {
        //logger.info("already run hot news update for this time");
        return;
    }
    //get all hotnews which need udpate 
    var kmids = getAllOutOfDateHotnews();
    var i;
    for (i = 0; kmids && i < kmids.length; i++) {
        //put it in kmupdate now
        var newkmuFile = new SCFile("kmknowledgebaseupdates");
        var kmuFind = newkmuFile.doSelect("docid = \"" + kmids[i].id + "\" and collectionname = \"Knowledge_Library\"");
        //if already in it, just ignore 
        if (kmuFind != RC_SUCCESS) {
            var kmFile = new SCFile("kmdocument", SCFILE_READONLY);
            var rc = kmFile.doSelect('id="' + kmids[i].id + '"');
            if (rc != RC_SUCCESS) {
                logger.warn("can't find the kmdocument for" + kmids[i].id + " during updateHotNews, ignore it..");
                continue;
            }
            newkmuFile.id = system.library.KMCollection_Update_Utils.getNextKMUpdateId();
            newkmuFile.collectionname = "Knowledge_Library";
            newkmuFile.docid = kmids[i].id;
            newkmuFile.recdata = system.library.KMUtils.recordToXML(kmFile);
            newkmuFile.action = "U";
            newkmuFile.sedocid = "Knowledge_Library_" + kmids[i].id + '_0';
            newkmuFile.doInsert();
        }
    }
    logger.info("Run hot news update successfully for " + i + " records");
    system.vars.$G_bg_last_update_hotnews = dt;
}

function needShowHotnewsTop() {
    if (GlobalSearchSettings.SHOW_HOTNEWS_TOP_COUNT && GlobalSearchSettings.SHOW_HOTNEWS_TOP_COUNT > 0) {
        return true;
    }
    return false;
}

function checkQuickSearchParameter(qs){
  if(!needShowHotnewsTop() || !qs || qs.from != "quick"){
    //nothing to do
    return;
  }
  var start = parseInt(qs.start, 10) || 1;
  if(start > GlobalSearchSettings.PAGE_SIZE && start % GlobalSearchSettings.PAGE_SIZE > 1){
    qs.start = start - start%GlobalSearchSettings.PAGE_SIZE + 1;
  }
}

// var resp = { data: results, total : total, statistic : statistic };
//{"mode":"","criteria":"{\"__library__\":[\"Knowledge_Library\"],
//                        \"__history__\":{\"ext-gen-top1119\":{\"__text__\":\"brand\"}},
//                          \"Knowledge_Library\":{\"locale\":[\"en\"]}}",
// "query":"brand","from":"main","force":"false","_dc":"1670306251443"}
function mergeHotnews(resp, qs, criteria) {
    var start = parseInt(qs.start, 10) || 1;
    if (!resp || start > 1 || !needShowHotnewsTop()) {
        //do nothing
        return;
    }
    //didn't choose Knowledge_Library
    var libraries = criteria['__library__'] || [];
    if (libraries.indexOf('Knowledge_Library') == -1) {
        //do nothig
        return;
    }
    var km_criteria = criteria.Knowledge_Library;
    if (km_criteria && km_criteria.hotnews != null) {
        //do nothing
        return;
    }
    var hotnews_criteria = {
        "__library__": ["Knowledge_Library"],
        "Knowledge_Library": criteria.Knowledge_Library,
        "__history__": criteria.__history__
    }
    if (!hotnews_criteria.Knowledge_Library) {
        hotnews_criteria.Knowledge_Library = {
            "hotnews": ["true"]
        }
    } else {
        hotnews_criteria.Knowledge_Library.hotnews = ["true"];
    }
    //to do add the hotnews condition
    var hotnews_qs = {
        "criteria": JSON.stringify(hotnews_criteria),
        "query": qs.query,
        "from": qs.from,
        "force": qs.force,
        "limit": GlobalSearchSettings.SHOW_HOTNEWS_TOP_COUNT
    };
    var ignoreSpecials = GlobalSearchSettings.IGNORE_SPECIALS;
    var minScore = (GlobalSearchSettings.MINSCORE || GlobalSearchSettings.MINSCORE == 0) ? GlobalSearchSettings.MINSCORE : 30;
    var options = {
        "Start": 1,
        "IgnoreSpecials": ignoreSpecials,
        "MinScore": minScore,
        "MaxResults": GlobalSearchSettings.SHOW_HOTNEWS_TOP_COUNT,
        "MaxPrintChars": GlobalSearchSettings.MAX_PRINT_CHARACTERS,
        "Characters": qs.from == "main" ? GlobalSearchSettings.MAIN_SEARCH_CHARACTERS : GlobalSearchSettings.QUICK_SEARCH_CHARACTERS
    };

    var fKMQuery = new SCFile('kmquery');
    fKMQuery.query = lib.AddQuotation.reloadQuery(qs.query) || "";
    var IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require();
    var IDOLKMQuery = IDOLKMQueryFactory.create('quicksearch', fKMQuery, hotnews_criteria);
    try {
        // print hit list when running in main search mode
        IDOLKMQuery.from = qs.from;
        // XXX: typeof qs.force === 'string'
        IDOLKMQuery.force = qs.force === 'true';
        // Search within results
        IDOLKMQuery.searchWithinResults = !!criteria['__history__'];
        var hotnews = IDOLKMQuery.search(options);
        var i = 0;
        for (; hotnews && hotnews.data && i < hotnews.data.length; i++) {
            if (hotnews.data[i].hotnews == true) {
                hotnews.data[i].weight = 100;
            } else {
                hotnews.data[i].weight = 99;
            }
        }
        if (hotnews && hotnews.data && hotnews.data.length > 0) {
            if(resp.messages && (resp.data == null || resp.data.length == 0)){
              //clear the message
              resp.messages=[];
            }
            resp.data = hotnews.data.concat(resp.data);
            resp.total = resp.total == null ? hotnews.total : resp.total + hotnews.total;
            resp.statistic.Knowledge_Library = resp.statistic.Knowledge_Library == null ? hotnews.statistic.Knowledge_Library : resp.statistic.Knowledge_Library + hotnews.statistic.Knowledge_Library;
        }
    } catch (e) {
        logger.error("mergeHotnews meet exception:" + e);
    }
}

function validateShowHotnewsTopRange(value, result, setting, id, message)
{
    if(value!=null && value!="" && (value<0 ||value>9)) {
        result.setValue(1);
        var msg = system.functions.scmsg(setting+";"+ id, "local:settingsConfig");
        message.setValue( system.functions.scmsg( 11, "settings", [ msg, value ] ));
    } 
}