var _ = lib.Underscore.require();
var $ = lib.c.$;

var IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require();
var changeUserSession = lib.EndUserChat.changeUserSession;
var isOOEnabled = lib.EndUserChatAutomation.isChatAutomationEnable;
var IDOLGlobalSearchSandbox = lib.IDOLGlobalSearchSandbox.require();
var reloadQuery = lib.AddQuotation.reloadQuery;
var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require();
var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;

var IDOLGlobalSearch = (function() {
    function doSearch(keyword, params) {
        var args = params || {};
        var start = args.start || 1;
        var limit = args.size || 10;
        var fKMQuery = new SCFile('kmquery');
        fKMQuery.query = reloadQuery(keyword) || "*";

        var criteria = args.filters || {};
        criteria['__library__'] = _.keys(criteria);

        var IDOLKMQuery = IDOLKMQueryFactory.create('quicksearch', fKMQuery, criteria);

        // XXX: All the IDOL search options can be override here.
        var ignoreSpecials = GlobalSearchSettings.IGNORE_SPECIALS;
        var minScore = (GlobalSearchSettings.MINSCORE || GlobalSearchSettings.MINSCORE == 0) ? GlobalSearchSettings.MINSCORE : 30;
        var results = IDOLKMQuery.search({
            "Start": start,
            "IgnoreSpecials": ignoreSpecials,
            "MinScore": minScore,
            "MaxResults": start + limit - 1,
            "Predict": true,
            "Highlight": '',
            "StartTag": '',
            "EndTag": '',
            "TotalResults": false,
            "Summary": ''
        });
        return results.data;
        /*
        return _.map(results.data, function(doc) {
          return {
            id : doc['id'],
            title : doc['title'],
            content : doc['content'],
            attachment: doc['isAttachment']?doc['isAttachment']:false,
            external: doc['isExternal'] && !doc['isAttachment'],
            database: doc['database'],
            query: doc['query']
          };
          
        });*/
    }

    return {
        search: doSearch
    };
}());


var predicatePrefix = "BOTCUSTPREDICATE";
var IDOLDSearchPredicate = "SMIDOLSEARCH";
var IFIDOLEnabled = "IFIDOLENABLED";

function IDOLSearch() {
    var endUserLoginName = arguments[0]['smLoginUser'];
    var botId = arguments[0]['smBotId'];
    var content = arguments[0]['problemDesc'];
    var smSdChatId = arguments[0]['smSdChatId'];
    var IDOLSearchCfg = getIDOLSearchCfg(botId);
    var returnResults = {};

    if (IDOLSearchCfg && vars['$lo.idol.enabled']) {
        changeUserSession(endUserLoginName);
        var results = IDOLGlobalSearchSandbox.evaluate({
            '$G.my.language': getEndUserLanguage(smSdChatId)
        }, function() {
            return IDOLGlobalSearch.search(content, {
                filters: IDOLSearchCfg['lib'],
                start: 1,
                size: IDOLSearchCfg['size']
            });

        });
        var lng = funcs.lng(results);

        if (lng > 0) {
            returnResults['predicates'] = {};
            var i;
            for (i = 0; i < lng; i++) {
                //returnResults['predicates'][predicatePrefix+(i+1)]=predicatePrefix+(i+1)+": "+genereateChatLink(results[i]);
                //returnResults['predicates'][predicatePrefix+"_"+IDOLDSearchPredicate+(i+1)]=predicatePrefix+(i+1)+": "+genereateChatLink(results[i]);
                if (lib.IDOLGlobalSearchOKM.isOkmDocument(results[i].query, results[i].database, results[i].reference)) {
                    returnResults['predicates'][predicatePrefix + "_" + IDOLDSearchPredicate + (i + 1)] = genereateChatLinkForOKM(results[i]);
                } else {
                    returnResults['predicates'][predicatePrefix + "_" + IDOLDSearchPredicate + (i + 1)] = genereateChatLink(results[i]);
                }
            }
            return returnResults;
        } else {
            return {};
        }
    }

    return {};
}

// Similar as IDOLSearch but return the idol search results directly
function doIDOLSearch() {
    var content = arguments[0]['problemDesc'];
    if (!content || content.trim().length == 0) {
        return [];
    }

    var endUserLoginName = arguments[0]['smLoginUser'];
    var botId = arguments[0]['smBotId'];
    var language = arguments[0]['language'];
    if (!language) {
        language = "en";
    }
    var IDOLSearchCfg = getIDOLSearchCfg(botId);
    var results = [];

    if (IDOLSearchCfg && vars['$lo.idol.enabled']) {
        var tempVirtualAgent = vars["$G.virtualagent"];
        var tempKMSearchList = vars["$G.kmSearchList"];
        
        var operator = funcs.operator();
        changeUserSession(endUserLoginName);
        
        vars["$G.virtualagent"] = tempVirtualAgent;
        vars["$G.kmSearchList"] = lib.KMSecurity.getOperatorKMSearchList(endUserLoginName, true);
        
        results = IDOLGlobalSearchSandbox.evaluate({
            '$G.my.language': language
        }, function() {
            return IDOLGlobalSearch.search(content, {
                filters: IDOLSearchCfg['lib'],
                start: 1,
                size: IDOLSearchCfg['size']
            });

        });
        changeUserSession(operator);
        
        vars["$G.virtualagent"] = tempVirtualAgent;
        vars["$G.kmSearchList"] = tempKMSearchList;
    }

    return results;
}

function getIDOLPredicateSearchPrefix() {
    return predicatePrefix + "_" + IDOLDSearchPredicate;
}

function checkIfIDOLEnabled() {
    var ifEnable = "false";
    if (vars['$lo.idol.enabled']) {
        ifEnable = "true";
    }
    var returnResults = {};
    returnResults['predicates'] = {};
    returnResults['predicates'][predicatePrefix + "_" + IFIDOLEnabled] = ifEnable;

    return returnResults;
}

function genereateChatLinkForOKM(data) {
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    kmbase.setFields("kbname");
    var query = "kbname=\"" + data['database'] + "\"";
    if (kmbase.doSelect(query) != RC_SUCCESS) {
        //no avalible
        return "";
    }
    var chatLink = ['[chatlink://'];
    var meta = {};
    var title = decodeXML(data['title']);
    meta['title'] = data['id'] + " " + title;
    meta['id'] = data['id'];
    meta['external'] = true;
    meta['attachment'] = data['isAttachment'] ? data['isAttachment'] : false;
    meta['OOEnabled'] = false;
    chatLink.push(data['href']);
    chatLink.push(' meta=');
    chatLink.push(JSON.stringify(meta));
    chatLink.push(']');
    return chatLink.join('');
}

function genereateChatLink(data) {
    var chatLink = ['[chatlink://'];
    var meta = {};
    var title = decodeXML(data['title']);
    meta['title'] = data['isAttachment'] ? data['id'] + ":" + title : title;
    meta['id'] = data['id'];
    meta['external'] = (data['isExternal'] ? data['isExternal'] : false) && !(data['isAttachment'] ? data['isAttachment'] : false);
    meta['attachment'] = data['isAttachment'] ? data['isAttachment'] : false;

    if (getTableNameForKB(data['database']) == "kmdocument") {
        meta['OOEnabled'] = isOOEnabled(data['id']);
    }
    if (data['href'].indexOf("scattach:") == -1 && data['href'].indexOf("scactivelink:") == -1) {
        chatLink.push(data['href']);
        meta['external'] = true;
    } else {
        var query = "file=" + getTableNameForKB(data['database']) + "&query=" + encodeURIComponent(data['query']) + "&libname=" + data['database'];
        chatLink.push(query);
    }
    chatLink.push(' meta=');
    if (vars["$G.sm.portal"] === "SMSP" && !meta['external']) {
        meta['smsplink'] = lib.urlCreator.getSMSPURL(getTableNameForKB(data['database']), data['id']);
    }
    chatLink.push(JSON.stringify(meta));
    chatLink.push(']');
    return chatLink.join('');
}

function decodeXML(s) {
    return (s && typeof(s) == "string") ? s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&") : s;
}

function getTableNameForKB(lib) {
    var tableName = "";
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    kmbase.setFields("sclibtablename");
    var query = "kbname=\"" + lib + "\"";
    if (kmbase.doSelect(query) === RC_SUCCESS) {
        tableName = kmbase['sclibtablename'];
    }
    return tableName;
}

function getIDOLSearchCfg(botId) {
    var cfg = {};
    var bot = new SCFile("sdchatbot", SCFILE_READONLY);
    var query = "number=\"" + botId + "\"";
    if (bot.doSelect(query) === RC_SUCCESS) {
        cfg['size'] = bot['max.results'];
        cfg['lib'] = {};
        var libLen = funcs.lng(bot['kblibs']);
        var i;
        for (i = 0; i < libLen; i++) {
            cfg['lib'][bot['kblibs'][i]] = {};
        }
        return cfg;
    }
    return null;
}

function getEndUserLanguage(sdChatId) {
    var lan = "en";
    var sdchat = $('!sdchat').fields('user.language').select('number = "' + sdChatId + '"').uniqueResult();
    if (sdchat && sdchat['user.language']) {
        lan = sdchat['user.language'];
    }
    return lan;
}