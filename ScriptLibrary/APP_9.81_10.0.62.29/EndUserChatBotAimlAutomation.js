var _null = system.functions._null;
var predicatePrefix = "BOTCUSTPREDICATE";
var endUserChat = lib.EndUserChat;
var lng = system.functions.lng;
var genLink = lib.EndUserChatBotIDOLSearch.genereateChatLink;
var ChangeUserSession = lib.EndUserChat.changeUserSession;
var $ = lib.c.$;

function getTop3QnA() {
    var top3QnAPredicate = "TOP3QNA";
    var endUserLoginName = arguments[0]['smLoginUser'];
    ChangeUserSession(endUserLoginName);
    var km = new SCFile("kmdocument", SCFILE_READONLY);
    var sql = "SELECT ta01.id as id,ta01.title as title,ta02.view.count as cnt FROM kmusagestats ta02 LEFT OUTER JOIN kmdocument ta01 ON  ( ta02.id = ta01.id )  order by ta02.view.count desc";
    var max = 3;
    var returnResults = {};
    if (km.doSelect(sql) === RC_SUCCESS) {
        returnResults['predicates'] = {};
        var top3KMs = [];
        do {

            if (endUserChat.canAccessKmdocument(km[0]) == "true") {
                top3KMs.push(genLink({
                    id: km[0],
                    title: km[1],
                    query: "id=\"" + km[0] + "\"",
                    database: "Knowledge_Library"
                }));
            }
            if (lng(top3KMs) == max) {
                break;
            }
        } while (km.getNext() === RC_SUCCESS)
        if (lng(top3KMs) > 0) {
            returnResults['predicates'][predicatePrefix + "_" + top3QnAPredicate] = top3KMs.join("");
        }
    }

    return returnResults;
}

function get3Hotnews() {
    var hotnewsPredicate = "HOTNEWS";
    var endUserLoginName = arguments[0]['smLoginUser'];
    ChangeUserSession(endUserLoginName);
    var km = new SCFile("kmdocument", SCFILE_READONLY);
    var today = system.functions.str(new Date((new Date().getTime())));
    var query = "hotnews=true and hotnews.start.date<='" + today + "' and hotnews.end.date>='" + today + "'";
    var max = 3;
    var returnResults = {};
    if (km.doSelect(query) === RC_SUCCESS) {
        returnResults['predicates'] = {};
        var top3Hotnews = [];
        do {

            if (endUserChat.canAccessKmdocument(km['id']) == "true") {
                top3Hotnews.push(genLink({
                    id: km[0],
                    title: km[1],
                    query: "id=\"" + km[0] + "\"",
                    database: "Knowledge_Library"
                }));
            }
            if (lng(top3Hotnews) == max) {
                break;
            }
        } while (km.getNext() === RC_SUCCESS)
        if (lng(top3Hotnews) > 0) {
            returnResults['predicates'][predicatePrefix + "_" + hotnewsPredicate] = top3Hotnews.join("");
        }
    }

    return returnResults;
}

function updatePhoneNumber() {
    var endUserLoginName = arguments[0]['smLoginUser'];
    var phoneNumber = arguments[0]['phoneNumber'];
    /*
    var reg=/^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/;
    if(!(new RegExp(reg).test(phoneNumber))){
        var msg="Your phone number '"+phoneNumber+"' is not valid, please correct your phone number";
        var returnResults={};
        returnResults['predicates']={};
        returnResults['predicates'][predicatePrefix+"_"+updPhonePredicate]=msg;
        return returnResults;
    }
*/
    ChangeUserSession(endUserLoginName);
    var contact = new SCFile("contacts");
    var sql = "operator.id=\"" + endUserLoginName + "\"";
    if (contact.doSelect(sql) === RC_SUCCESS) {
        var oldNumber = contact['contact.phone'];
        contact['contact.phone'] = phoneNumber;
        contact.doUpdate();

        var returnResults = {};
        returnResults['predicates'] = {};
        returnResults['predicates'][predicatePrefix + "_OLDPHONENUMER"] = oldNumber;
        returnResults['predicates'][predicatePrefix + "_NEWPHONENUMER"] = phoneNumber;
        return returnResults;
    }
}

function checkEndUserLanguage() {
    var checkEndUserLanguageRtnMsgPrefix = "BOTSPEAKINGLANGUAGE";
    var sameLanguagePrefix = "SAMELANGUAGE";
    var returnResults = {};
    returnResults['predicates'] = {};
    var smBotId = arguments[0]['smBotId'];
    var smSdChatId = arguments[0]['smSdChatId'];
    var endUserLanguage = lib.EndUserChatBotIDOLSearch.getEndUserLanguage(smSdChatId);
    var bot = $('sdchatbot').select('number = \"' + smBotId + '\"').uniqueResult();
    if (bot) {
        var botLanguageId = bot['language'];
        if (endUserLanguage !== botLanguageId) {
            var msgCls = "chatbot";
            var msgId = "1";
            returnResults['predicates'][predicatePrefix + "_" + checkEndUserLanguageRtnMsgPrefix] = getMsgByLanguage(botLanguageId, msgCls, msgId);
            returnResults['predicates'][predicatePrefix + "_" + sameLanguagePrefix] = "false";
            return returnResults;

        }
        else {
            returnResults['predicates'][predicatePrefix + "_" + sameLanguagePrefix] = "true";
            return returnResults;
        }
    }

}

function getMsgByLanguage(lan, cls, msgId) {
    var msg = "There is no localized message found";
    var message = new SCFile("scmessage", SCFILE_READONLY);
    var sql = "syslanguage=\"" + lan + "\" and class=\"" + cls + "\" and message.id=\"" + msgId + "\"";
    if (message.doSelect(sql) == RC_SUCCESS) {
        msg = message.message;
    }
    return msg;
}