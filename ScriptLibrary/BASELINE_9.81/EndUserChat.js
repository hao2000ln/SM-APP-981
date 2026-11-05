var _log = getLog("EndUserChat");
var lng = funcs.lng;
var $ = lib.c.$;
var _index = funcs.index;
var _null = funcs._null;
var getLocalizedMsg = funcs.getLocalizedMsg;

var rad_resetsession = funcs.resetsession;
var rad_operator = funcs.operator;
var lib_reportExport = lib.reportExport;

var dbdictService = $("#dbdictService");
var initDbdictFile = lib.dbdictHelper.initDbdictFile;
var dbdictHelper = funcs.dbdict_helper;
var policyread = funcs.policyread;
var getFilename = funcs.filename;
var scmsg = funcs.scmsg;
var chatReqTable = "sdchat";
const upnToSam = "samAccountName=userPrincipalName".toLowerCase()===getRTEParm("ldapquerymapping").toLowerCase();

function mapOperatorName(loginName) {
  var nameMappingRequired = upnToSam && loginName && loginName.indexOf('@') > 0;
  if (nameMappingRequired) {
    loginName = lib.operatorUtil.getOperatorNameByUPN(loginName);
  }
  return loginName;
}

function initSdchat(record) {
    record['open.time'] = _null(record['open.time']) ? funcs.tod() : record['open.time'];
    record['opened.by'] = record['contact'];
    var contact = getContactByOperator(record['contact']);
    if (contact) {
        record['company'] = contact['company'];
        record['contact'] = contact['contact.name'];
    }
}

function initExistingInteraction(record) {
    var interaction = new SCFile("incidents");
    if (record['auto.sd.id']) {
        var sql = "incident.id=\"" + record['auto.sd.id'] + "\"";
        if (interaction.doSelect(sql) === RC_SUCCESS) {
            if (_null(interaction['sdchat.id'])) {
                interaction['sdchat.id'] = record['number'];
            }
            addScrelations(record, interaction);
        }
    }
}

function getContactByName(name) {
    var contact = new SCFile("contacts", SCFILE_READONLY);
    contact.setFields(["dept.name", "email", "location", "operator.id", "contact.name"]);
    var sql = "contact.name=\"" + name + "\"";
    if (contact.doSelect(sql) === RC_SUCCESS) {
        return contact;
    }
    return null;
}

function getContactByOperator(operatorId) {
    operatorId = mapOperatorName(operatorId);
    var contact = new SCFile("contacts", SCFILE_READONLY);
    var sql = "operator.id=\"" + operatorId + "\"";
    if (contact.doSelect(sql) === RC_SUCCESS) {
        return contact;
    }
    return null;
}

function getOperatorIdByContact(contactName) {
    var optId = "";
    var contact = new SCFile("contacts", SCFILE_READONLY);
    contact.setFields(["operator.id"]);
    var sql = "contact.name=\"" + contactName + "\"";
    if (contact.doSelect(sql) === RC_SUCCESS) {
        optId = contact['operator.id'];
    }
    return optId;
}

function getSdChatNumber() {
    var number = "";
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, chatReqTable);
    number = newid.getText();
    return number;
}

function containsIgnoreCase(array, value) {
    if (!array) {
        return false;
    }
    var i;
    var len = lng(array);
    for (i = 0; i < len; i++) {
        if (array[i].toLowerCase() == value.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function sysCaseInsensitive() {
    var smFile = initDbdictFile("sdchat");
    return smFile['case.insensitive'];
}

function getPreviousSupportTickets(endUser) {
    var list = {
        valueList: [],
        displayList: []
    };
    var contactName = "";
    var maxItems = 10;
    var contact = getContactByOperator(endUser);
    if (contact) {
        contactName = contact['contact.name'];
        if (contactName) {
            var interaction = new SCFile("incidents", SCFILE_READONLY);
            var orderBySeq = [SCFILE_DSC];
            var fields = ['open.time'];
            interaction.setOrderBy(fields, orderBySeq);
            var sql = "callback.contact=\"" + contactName + "\"";
            if (interaction.doSelect(sql) === RC_SUCCESS) {
                var count = 0;
                do {
                    list['valueList'].push(interaction['incident.id']);
                    list['displayList'].push(interaction['incident.id'] + " - " + interaction['title']);
                    count++;
                } while (count < maxItems && interaction.getNext() === RC_SUCCESS);
            }
        }
    }
    return list;
}

function getSubscriptions(endUser) {
    var list = {
        valueList: [],
        displayList: []
    };
    var contact = getContactByOperator(endUser);
    var contactName = "";
    if (contact) {
        contactName = contact['contact.name'];
        if (contactName) {
            var interaction = new SCFile("incidents");
            interaction['contact.name'] = contactName;

            var rteReturnValue = new SCDatum();
            var rteNames = new SCDatum();
            var rteVals = new SCDatum();

            rteNames.setType(8);
            rteNames.push("file");
            rteNames.push("name");

            rteVals.setType(8);
            rteVals.push(interaction);
            rteVals.push("sd.SubscriptionItem");
            funcs.cleanup(vars['$subscribed.cis']);
            funcs.cleanup(vars['$subscribed.cis.dis']);
            try {
                funcs.rtecall("callrad", rteReturnValue, "se.call.process", rteNames, rteVals, false);
                if (!_null(vars['$subscribed.cis'])) {
                    var i;
                    for (i = 0; i < lng(vars['$subscribed.cis']); i++) {
                        list['valueList'].push(vars['$subscribed.cis'][i]);
                        list['displayList'].push(vars['$subscribed.cis.dis'][i]);
                    }
                }
            }
            catch (e) {
                print(e.toString());
            }
        }
    }
    return list;
}

/**
 * Customized action to handle RESTful call.
 *
 * URL example:
 * http://localhost:13080/SM/9/rest/sdchatutils/
 *
 * Parameter example1:
 * {'sdchatutil':
 *   {
 *       "Action":"ValidateAssignmentGroup",
 *       "Parameter" :"{'groupName': 'Application','member':'falcon'}"
 *   }
 * }
 *
 * Result example1:
 * {
 *  "Messages": ["XXXXXXXXXXXXXXXXXXXXXXX"],
 *  "ReturnCode": 0,
 *  "sdchatutil": {"Result": "true"}
 * }
 *
 * Parameter example2:
 * {'sdchatutil':
 *   {
 *       "Action":"GetEndReason",
 *       "Parameter" :"{'language':'en'}" //language
 *   }
 * }
 *
 * Result example2:
 * {
 *  "Messages": ["XXXXXXXXXXXXXXXXXXXXXXX"],
 *  "ReturnCode": 0,
 *  "sdchatutil": {"Result": "[{\"value\":\"1\",\"displayValue\":\"1 - Problems Solved\"},{\"value\":\"2\",\"displayValue\":\"2 - Support Ticket Submitted\"}]"}
 * }
 */
function sdChatUtil() {
    var action = vars['$L.file']['action'];
    var param = vars['$L.file']['parameter'];
    //convert to JSON object
    param = eval("(" + param + ")");
    var sdchatutil = new SCFile("sdchatutil");
    sdchatutil['result'] = "false";
    var sql = "";
    
    var kmid;
    var optor = param['user'];
    optor = mapOperatorName(optor);
    
    //validate assignment info
    if (action == "ValidateAssignmentGroup") {
        var id = param['groupName'];
        var member = param['member'];
        member = mapOperatorName(member);
        var tableName = "assignment";
        var uniqueKeys = dbdictHelper("unique.key", tableName);
        var uniqueKey = uniqueKeys[0];
        var vRecord = new SCFile(tableName, SCFILE_READONLY);
        sql = "" + uniqueKey + "=\"" + id + "\"";
        var msgCls = "local:EndUserChatAssignmentValidation";
        if (vRecord.doSelect(sql) === RC_SUCCESS) {
            if (member === undefined) {
                sdchatutil['result'] = "true";
                sdchatutil['errorCode'] = "0";
                sdchatutil['errorMsg'] = "";
            }
            else {
                if ( (sysCaseInsensitive() && containsIgnoreCase(vRecord['operators'], member)) || 
                     (!sysCaseInsensitive() && lib.ArrayUtil.contains(vRecord['operators'], member)) ) {
                    sdchatutil['result'] = "true";
                    sdchatutil['errorCode'] = "0";
                    sdchatutil['errorMsg'] = "";
                    sdchatutil['loginName'] = member.toLowerCase();
                }
                else {
                    sdchatutil['errorCode'] = "1022";
                    sdchatutil['errorMsg'] = scmsg("validate.group.member", msgCls, ["'" + member + "'", "'" + id + "'"]);
                }
            }

        }
        else {
            sdchatutil['errorCode'] = "1020";
            sdchatutil['errorMsg'] = scmsg("validate.group", msgCls, ["'" + tableName + "'"]);
        }
    }
    else if (action == "GetEndReason") {
        sdchatutil['result'] = lib.JSON2.toJSON(getChatRequestEndReason(param['language']));
    }
    else if (action == "GetPrechatForm") {
        var lg = param['language'];
        sdchatutil['result'] = lib.JSON2.toJSON(getPrechatForm(lg, optor));
    }
    else if (action == "GetAvailableChatRequest") {
        sdchatutil['result'] = lib.JSON2.toJSON(getAvailChatRequest(optor));
        sdchatutil['loginName'] = optor;
    }

    else if (action == "GetChatBotInfo") {
        var botid = param['botId'];
        sdchatutil['result'] = lib.JSON2.toJSON(getChatbotInfo(botid));
    }
    else if (action == "ValidateAccess") {
        var itemName = param['itemId'];
        var fileName = param['fileName'];

        if (fileName === "joinsvcDisplay") {
            sdchatutil['result'] = canAccessServiceCatalogItem(itemName,optor);
        }
        else if (fileName === "kmdocument") {
            sdchatutil['result'] = canAccessKmdocument(itemName);
        }
        else {
            sdchatutil['result'] = "no enough parameter";
        }
    }

    else if (action == "GetKM") {
        kmid = param["kmid"];
        sdchatutil['result'] = lib.JSON2.toJSON(getKM(kmid, optor, param['language']));
    }
    else if (action == "GetAutoRunConfig") {
        kmid = param["kmid"];
        sdchatutil['result'] = lib.JSON2.toJSON(lib.EndUserChatAutomation.getOORunConfig(param['language'], optor, kmid));
    }
    else if (action == "CreateAutoRunTask") {
        var config = param["config"];
        sdchatutil['result'] = lib.JSON2.toJSON(lib.EndUserChatAutomation.createOORunTask(param['language'], optor, config));
    }
    else if (action == "GetPortalConfig") {
        sdchatutil['result'] = lib.JSON2.toJSON(lib.EndUserChatConfiguration.getPortalConfiguration());
    }

    else if (action == "CheckLocalAccount") {
        sdchatutil['result'] = userExistedInSM(optor);
    }
    else if (action == "ValidateAcceptAction") {
        var sdchatId = param['sdcid'];
        sdchatutil['result'] = validateAcceptAction(sdchatId);
    }
    vars['$L.file'] = sdchatutil;
    vars.$L_exit = "normal";
}

function validateAcceptAction(sdchatId) {
    var rtn = "true";
    var sdchat = $('sdchat',SCFILE_READONLY).setFields(["current.phase"]).select('number = "' + sdchatId + '"').uniqueResult();
    if (sdchat) {
        if (sdchat['current.phase'] != "Logged") {
           rtn="false";
        }
    }
    
    return rtn;
}
function userExistedInSM(name) {
    var oldValue = setDisableLdap(true);
    var rtn = "false";
    var op = new SCFile("operator", SCFILE_READONLY);
    var sql = "SELECT name from operator where name=\"" + name + "\"";
    if (op.doSelect(sql) == RC_SUCCESS) {
        rtn = "true";
    }
    setDisableLdap(oldValue);
    return rtn;
}

function getKM(kmid, user, lang) {
    var rtn = {
        "kmid": "",
        "kmcontent": "",
        "attachments": "",
        "ooparameters": ""
    };
    rtn['kmid'] = kmid;
    rtn['attachments'] = "";
    var ooparameters = lib.EndUserChatAutomation.getOORunConfig(lang, user, kmid);
    rtn['ooparameters'] = ooparameters;
    var chatview = "Default End User Chat Automation View";
    if (ooparameters["parameters"] === undefined) {
        chatview = "Default End User Chat View";
    }
    rtn['kmcontent'] = replaceImageSrc(getKMPage(kmid, chatview, lang), null, kmid);
    lib.KMUsageStats.incrementViewCount(kmid, "kmdocument");
    return rtn;
}

function getKMPage(kmid, view, lang) {
    vars["$chat.get.km.content"] = lang;
    var kmdocument = new SCFile("kmdocument");
    var sql = "id = \"" + kmid + "\"";

    var rc = kmdocument.doSelect(sql);
    while (rc == RC_SUCCESS) {
        if (lib.KMDocPreview.getDocWithViewName(kmdocument, view)) {
            return vars["$L.docwithview"];
        }
        rc = kmdocument.getNext();
    }
    funcs.cleanup(vars["$chat.get.km.content"]);
    return null;
}

function replaceImageSrc(kmpageorg, attachments, km_id) {
    if (kmpageorg == null) {
        return "";
    }
    var i = 0;
    var kmpage = kmpageorg;
    var key = "scattach";
    var positions = [];
    var keyA = [];
    var finalkeyA = [];
    var pos = kmpage.indexOf(key);

    while (pos > -1) {
        positions.push(pos);
        pos = kmpage.indexOf(key, pos + 1);
    }
    for (i = 0; i < positions.length; i++) {
        var restpart = kmpage.substr(positions[i]);
        var end = restpart.indexOf("\" ");
        if (end === -1) {
            end = restpart.indexOf("\">");
        }
        key = kmpage.substr(positions[i], end + 1);
        keyA.push(key);
        var url = key.split(":");
        var cid = url[1].substring(2);
        var kmid = url[4];
        var finalkey = "\"../km/" + kmid.substring(0, kmid.length - 1) + "/cid:" + cid + "\"";
        var chatserviceurl = lib.settings.getSettingValue("Collaboration", "chatserviceurl");
        if (chatserviceurl == null) {
            chatserviceurl = "";
        }
        //old: var finalkey = "src=\""+chatserviceurl+"api/km/"+kmid.substring(0,kmid.length-1)+"/cid:" + cid +"\"";
        finalkey = "" + chatserviceurl + "api/km/" + kmid.substring(0, kmid.length - 1) + "/attachments/cid:" + cid + "\"";
        finalkeyA.push(finalkey);
    }

    for (i = 0; i < keyA.length; i++) {
        if (keyA[i] === undefined) {
            continue;
        }
        //print("--->" + keyA[i] +"---" + finalkeyA[i]);
        kmpage = kmpage.replace(keyA[i], finalkeyA[i]);
    }

    return kmpage;
}

function getKMAttachments(kmid) {
    var ret = "";
    var kmdocument = new SCFile("kmdocument", SCFILE_READONLY);
    var sql = "id=\"" + kmid + "\"";
    if (kmdocument.doSelect(sql) === RC_SUCCESS) {
        var attachments = kmdocument.getAttachments();
        if (attachments != null && attachments != undefined) {
            var len = attachments.length;
            var i;
            for (i = 0; i < len; i++) {
                var attachment = attachments[i];
                ret = ret + attachment['href'] + ";";
                /**
                print(attachment['len']);
                print(attachment['href']);
                print(attachment['name']);
                print(attachment['type']);
                **/
            }
        }
    }
    return ret;
}

function getPrechatForm(lan, user) {
    var lg = lan;
    var result = {};
    var forms;
    if (!lib.ArrayUtil.contains(vars['$G.language.all.ids'], lg)) {
        lg = "en";
    }
    var sql = true;
    if (vars['$G.multi']) {
        var contact = getContactByOperator(user);
        if (contact) {
            sql = "company=\"" + contact['company'] + "\"";
        }
    }
    var prechatForm = new SCFile("sdprechatconfig", SCFILE_READONLY);
    if (prechatForm.doSelect(sql) === RC_SUCCESS) {
        forms = prechatForm['prechat.forms'].toArray();
        var i;
        var f;
        for (i = 0; i < forms.length; i++) {
            if (!_null(forms[i])) {
                f = strToJson(forms[i]);
                if (f != undefined) {
                    f['label'] = getTargetLanguageLabel(prechatForm, f['id'], f['label'], lg);

                    var options;
                    if (f['displayType'] == "picklist" && f['globalList']) {
                        options = getLocalizedGlobalList(f['globalList'], lg);
                        f['options'] = options;
                        delete f['globalList'];
                    }
                    else if (f['displayType'] == "picklist" && f['js']) {
                        options = getListByJavascript(f['js']);
                        f['options'] = options;
                        delete f['js'];
                    }
                    forms[i] = f;
                }
            }
        }
        result['fields'] = forms;
    }
    return result;
}

function getListByJavascript(script) {
    var options = [];
    var valueList;
    var displayList;
    try {
        eval(script);
        var i;
        var length = lng(valueList);
        for (i = 0; i < length; i++) {
            if (!_null(valueList[i])) {
                options.push({
                    value: valueList[i],
                    displayValue: displayList[i]
                });
            }
        }
    }
    catch (e) {
        print("Exception for evaluate js: " + script);
    }
    return options;
}

function getAvailChatRequest(optor) {
    var rtn = {};
    var contactName = getContactByOperator(optor)['contact.name'];
    var chatReq = new SCFile(chatReqTable, SCFILE_READONLY);
    var sql = "contact=\"" + contactName + "\" and (current.phase=\"Logged\" or current.phase=\"Accepted\") and ended.by.user=NULL";

    if (chatReq.doSelect(sql) === RC_SUCCESS) {
        rtn['refId'] = chatReq['number'];
        rtn['description'] = chatReq['description'];
        rtn['assignee'] = _null(chatReq['assignee']) ? "" : chatReq['assignee'];
        rtn['phase'] = chatReq['current.phase'];
        rtn['node'] = _null(chatReq['assignment']) ? "" : chatReq['assignment'];
        rtn['openTime'] = chatReq['open.time'];
        rtn['botId'] = chatReq['sd.chat.bot'];
        rtn['chatRequestId'] = chatReq['chatreq.id'];
        var conversation = getConversation(chatReqTable, chatReq['number']);
        if (conversation) {
            rtn['conversationId'] = conversation['conversationid'];
            rtn['participants'] = conversation['participants'].toArray();
        }
    }
    return rtn;
}

function getConversation(obj, id) {
    var conversation = $('conversation').select("object = \"" + lib.StringUtil.escapeAllStr(obj) + "\" and objectid = \"" + lib.StringUtil.escapeAllStr(id) + "\"").uniqueResult();
    if (conversation) {
        return conversation;
    }
    return null;
}

function getChatbotByName(name, language) {
    if (!language) {
        language = "en";
    }
    var bot = new SCFile("sdchatbot");
    var rc = bot.doSelect("name=\"" + name + "\" and language=\"" + language + "\"");
    if (rc == RC_SUCCESS) {
        return bot;
    }
    
    if (language != "en") {
        rc = bot.doSelect("name=\"" + name + "\" and language=\"en\"");
        if (rc == RC_SUCCESS) {
            return bot;
        }
    }
    
    return null;
}

function getChatbotInfo(botid) {
    var rtn = {
        "Number": "",
        "Name": "",
        "Language": "",
        "portrait": "",
        "portraitType": ""
    };
    var chatbot = new SCFile("sdchatbot", SCFILE_READONLY);
    var sql = "number=\"" + botid + "\"";
    if (chatbot.doSelect(sql) === RC_SUCCESS) {
        rtn['Number'] = botid;
        rtn['Name'] = chatbot['name'];
        rtn['Language'] = chatbot['language'];
        var tmpPortrait = getChatbotPortrait(chatbot);
        rtn['portrait'] = tmpPortrait['portrait'];
        rtn['portraitType'] = tmpPortrait['portraitType'];
        return rtn;
    }
    return null;

}

function getChatbotPortrait(chatbot) {
    var rtn = {
        "portrait": "",
        "portraitType": ""
    };
    var attachments = chatbot.getAttachments();
    var index;
    for (index in attachments) {
        var attachment = attachments[index];
        if (attachment['name'] == chatbot['number'] && attachment['attachmentType'] == 'img') {
            rtn['portrait'] = compressImage(attachment['value'], 64, 128, true);
            rtn['portraitType'] = attachment['type'];
        }
    }
    return rtn;
}

function getUserProfiles() {
    var userprofile = new SCFile("userprofile");
    var loginName = vars['$L.file']['user.name'];
    loginName = mapOperatorName(loginName);

    var operator = null;
    if (funcs.sysinfo_get("AuthMode") === "ldap") {
        operator = $('operator', SCFILE_READONLY).setFields(['full.name']).select('name = "' + lib.StringUtil.escapeAllStr(loginName) + '"').uniqueResult();
    }
    else {
        operator = $('operator', SCFILE_READONLY).setFields(['full.name']).select('tolower(name) = "' + lib.StringUtil.escapeAllStr(loginName.toLowerCase()) + '"').uniqueResult();
    }

    if (operator) {
        userprofile['user.name'] = loginName;
        userprofile['user.fullname'] = operator['full.name'];
        var contact = lib.SMCRemoteService.getContactByOperator(loginName, null, true);
        if (contact) {
            userprofile['user.fullname'] = contact['fullName'];
            if (contact['portrait']) {
                userprofile['user.portrait'] = contact['portrait']['base64Image'];
                userprofile['user.portrait.type'] = contact['portrait']['mimeType'];
            }
        }
    }
    vars['$L.file'] = userprofile;
    vars.$L_exit = "normal";
}

function getEnduserInfoByChatReq(chatReqId) {
    var contact = null;
    var chatReq = new SCFile(chatReqTable, SCFILE_READONLY);
    var sql = "number=\"" + lib.StringUtil.escapeAllStr(chatReqId) + "\"";
    if (chatReq.doSelect(sql) === RC_SUCCESS) {
        if (chatReq['contact']) {
            contact = lib.SMCRemoteService.getContact(chatReq['contact']);
        }
    }
    return contact;
}

function canAccessServiceCatalogItem(itemId, user) {
    var optor = $('operator',SCFILE_READONLY).setFields(["cap.exec","contact.name"]).select('name = "' + user + '"').uniqueResult();
    //var requestFor = lib.ScAPI_Util.getCurrentOperator();
    if (optor) {
        var requestFor = optor;
        var caps = lib.ScAPI_WSInterface_svcCatalogGather._getAllCapabilityByUser(requestFor["cap.exec"]);
        var interaction = lib.ScAPI_WSInterface_svcCatalogGather._getInteractionInstance(requestFor["contact.name"]);
        var sql = "id = \"" + itemId + "\" and active=true and (null(access.list) or access.list isin " + funcs.str(caps) +
            ") and (evaluate(parse(nullsub(access.filter, \"true\"), 2))=true or evaluate(nullsub(access.filter, \"true\"))=true)";

        var item = new SCFile("joinsvcDisplay", SCFILE_READONLY);
        var RC = item.doSelect(sql);
        if (RC == RC_SUCCESS) {
            return "true";
        }
    }
    return "false";
}

function canAccessKmdocument(itemName) {
    if (getKMPage(itemName, "Default View") !== null) {
        return "true";
    }
    else {
        return "false";
    }
}

function linkNewInteration(sdchat, autoCreation) {
    var interactionId = "";
    var chat = sdchat;

    var interaction = new SCFile("incidents");
    interaction['category'] = getSDDefaultCategory();
    var linkName = "screlate.sdchat.incidents.bg";
    var link = new SCFile("link", SCFILE_READONLY);
    link.setFields(["name"]);
    var linkSql = "name=\"" + linkName + "\"";
    if (link.doSelect(linkSql) === RC_SUCCESS) {
        var rteReturnValue = new SCDatum();
        var rteNames = new SCDatum();
        var rteVals = new SCDatum();
        rteNames.setType(8);
        rteNames.push("file");
        rteNames.push("record");
        rteNames.push("name");

        rteVals.setType(8);
        rteVals.push(interaction);
        rteVals.push(chat);
        rteVals.push(linkName);

        var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
        var bypassValidationOrig = vars.$bypass_failed_validation;
        vars.$bypass_bg_authcheck = true;
        vars.$bypass_failed_validation = true;
        var oriBg = vars.$G_bg;
        vars.$G_bg = true;

        //false to run in the same thread, true to run in new one. 
        try {
            if (chat['auto.sd.id'] && (autoCreation == true || autoCreation == "true")) {
                interactionId = chat['auto.sd.id'];
                /*
                var sql="incident.id=\""+chat['auto.sd.id']+"\"";
                if(interaction.doSelect(sql)===RC_SUCCESS){
                    interactionId=interaction['incident.id'];
                }*/
            }
            else {
                funcs.rtecall("callrad", rteReturnValue, "move.fields.by.link", rteNames, rteVals, false);
                interaction['resolution.channel'] = "chat";
                interaction['source'] = "4";
                var addResult = interaction.doAction("add");
                if (addResult === RC_SUCCESS) {
                    interactionId = interaction['incident.id'];
                    if (autoCreation == true || autoCreation == "true") {
                        chat['auto.sd.id'] = interactionId;
                    }
                    addScrelations(chat, interaction);
                }
            }
            if (_null(interaction['sdchat.id'])) {
                interaction['sdchat.id'] = chat['number'];
            }
        }
        catch (e) {
            vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
            vars.$bypass_failed_validation = bypassValidationOrig;
            vars.$G_bg = oriBg;
            print(e.toString());
        }
        vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
        vars.$bypass_failed_validation = bypassValidationOrig;
        vars.$G_bg = oriBg;
        return interactionId;
    }
}

function addScrelations(sdchat, interaction) {
    if (sdchat == null) {
        return;
    }
     
    var screl = new SCFile("screlation");
    var screlconfig = new SCFile("screlconfig", SCFILE_READONLY);
    screlconfig.setFields("desc.fields");
    var sql = 'filename="incidents"';
    if (screlconfig.doSelect(sql) === RC_SUCCESS) {
        screl['source'] = sdchat['number'];
        screl['source.filename'] = chatReqTable;
        screl['depend'] = interaction['incident.id'];
        screl['depend.filename'] = "incidents";
        screl['depend.active'] = true;
        screl['type'] = "Related to Interaction";
        var descFields = screlconfig['desc.fields'];
        var i;
        var length = lng(descFields);
        for (i = 0; i < length; i++) {
            //screl['desc'] = funcs.insert(screl['desc'], 1, 0);
            screl['desc'][i] = interaction[descFields[i]];
        }
        screl.doSave();
        sql = "filename=\"" + chatReqTable + "\"";
        if (screlconfig.doSelect(sql) === RC_SUCCESS) {
            screl['source'] = interaction['incident.id'];
            screl['source.filename'] = "incidents";
            screl['depend'] = sdchat['number'];
            screl['depend.filename'] = chatReqTable;
            screl['source.active'] = true;
            screl['type'] = "Initiated by Chat Request";
            descFields = screlconfig['desc.fields'];
            length = lng(descFields);
            for (i = 0; i < length; i++) {
                //screl['desc'] = funcs.insert(screl['desc'], 1, 0);
                screl['desc'][i] = sdchat[descFields[i]];
            }
            screl.doSave();
        }
        else {
            _log.info("No screlconfig found for Service Desk Chat.");
        }
    }
    else {
        _log.info("No screlconfig found for Interaction.");
    }
}

function getSDDefaultCategory() {
    var s = new SCFile("settings", SCFILE_READONLY);
    var sql = 'name="Service Desk"';
    if (s.doSelect(sql) === RC_SUCCESS) {
        var stids = s.settingId;
        var stvalues = s.settingValue;
        var i;
        var length = stids.length();
        for (i = 0; i < length; i++) {
            if (stids[i] === "default.category") {
                if (funcs._null(stvalues[i]) || stvalues[i] === "null" || stvalues[i] === "") {
                    stvalues[i] = "incident";
                }
                return stvalues[i];
            }
        }
    }
    else {
        return "incident";
    }
}

function getSdChatBotEnablement() {
    var s = new SCFile("settings", SCFILE_READONLY);
    var sql = 'name="Collaboration"';
    if (s.doSelect(sql) === RC_SUCCESS) {
        var stids = s.settingId;
        var stvalues = s.settingValue;
        var i;
        var length = stids.length();
        var smcEnabled = "false";
        var botEnabled = "false";
        for (i = 0; i < length; i++) {
            if (stids[i] === "smcEnabled") {
                if (stvalues[i] === true || stvalues[i] === "true") {
                    smcEnabled = "true";
                }
            }
            if (stids[i] === "endUserChatEnabled") {
                if (stvalues[i] === 1 || stvalues[i] === "1") {
                    botEnabled = "true";
                }
            }
        }
        if (smcEnabled === "true" && botEnabled === "true" && vars['$lo.idol.enabled']) {
            return "true";
        }
        else {
            return "false";
        }
    }
    else {
        return "false";
    }
}

function sdChatBotAssignment(record) {
    var sdChatBot = "";
    if (getSdChatBotEnablement() === "true") {
        var userLanguage = (record['user.language'] == "" || record['user.language'] == null) ? "en" : record['user.language'];
        var v = new SCFile("sdchatbot", SCFILE_READONLY);
        var sql = "language=\"" + userLanguage + "\"";
        if (v.doSelect(sql) === RC_SUCCESS) {
            sdChatBot = v.number;
        }
        /*
        else{//find default bot
            sql="default.bot=true";
            if(v.doSelect(sql)===RC_SUCCESS){
                sdChatBot=v.number;
            }
        }
        */
    }
    return sdChatBot;
}

function getSdChatBotNameById(id) {
    var name = "";
    var sdcb = new SCFile("sdchatbot", SCFILE_READONLY);
    var sql = "number=\"" + id + "\"";
    if (sdcb.doSelect(sql) === RC_SUCCESS) {
        name = sdcb.name;
    }
    return name;
}

function getChatRequestClosureCode() {
    var codes = [];
    var globalListName = "Service Desk Chat Closure Codes";
    codes = getLocalizedGlobalList(globalListName, "");
    return codes;
}

function getChatRequestEndReason(lan) {
    var codes = [];
    var globalListName = "Service Desk Chat User End Codes";

    codes = getLocalizedGlobalList(globalListName, lan);

    return codes;
}

function getLocalizedGlobalList(gl, lan) {
    var language = lan;
    if (language == "" || language == undefined) {
        language = vars['$G.my.language'];
    }
    var result = [];
    var tmpResult = getLocalizedMsg(gl, language);
    if (!_null(tmpResult)) {
        var i;
        var length = tmpResult.length();
        for (i = 0; i < length; i++) {
            result.push({
                value: tmpResult[i].toArray()[0],
                displayValue: tmpResult[i].toArray()[1]
            });
        }
    }

    return result;
}

function getKBMapping() {
    var rtn = [];
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    var query = "true";
    if (kmbase.doSelect(query) === RC_SUCCESS) {
        do {
            rtn.push({
                file: kmbase['sclibtablename'],
                libName: kmbase['kbname']
            });
        } while (kmbase.getNext() === RC_SUCCESS);

        return rtn;
    }
    return null;
}

function closeChatRequest(id, closureCode) {
    var file = chatReqTable;
    var ret = -1;
    var chat = new SCFile(file);
    var sql = "number=\"" + lib.StringUtil.escapeAllStr(id) + "\"";
    if (chat.doSelect(sql) === RC_SUCCESS) {
        chat['closure.code'] = closureCode;
        chat['closed.by'] = rad_operator();
        var bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
        vars.$bypass_bg_authcheck = true;
        var oriBg = vars.$G_bg;
        vars.$G_bg = true;
        ret = chat.doAction("Close");
        vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
        vars.$G_bg = oriBg;
    }
    return ret;
}

function createAddlInteraction(chatReqId) {
    var interactionId = "";
    var result = {
        fileName: "",
        id: ""
    };
    var chatReq = new SCFile(chatReqTable, SCFILE_READONLY);
    var sql = "number=\"" + lib.StringUtil.escapeAllStr(chatReqId) + "\"";
    if (chatReq.doSelect(sql) === RC_SUCCESS) {
        if (chatReq['current.phase'] == "Accepted") {
            interactionId = linkNewInteration(chatReq, false);
            result.fileName = "incidents";
            result.id = interactionId;
        }
    }

    return result;
}

function getChatRequestRelatedInteraction(chatReqId) {
    var result = {
        fileName: "",
        query: ""
    };
    var relation = new SCFile("screlation", SCFILE_READONLY);
    var sql = "source=\"" + lib.StringUtil.escapeAllStr(chatReqId) + "\" and source.filename=\"sdchat\" and depend.filename=\"incidents\"";
    var count = relation.doCount(sql);
    var i = 0;
    if (count > 0) {
        relation.doSelect(sql);
        var qry = "incident.id isin {";
        do {
            i++;
            qry += '"' + relation['depend'] + '"';
            if (i !== count) {
                qry += ",";
            }
        } while (relation.getNext() === RC_SUCCESS);
        qry += "}";
        result['fileName'] = "incidents";
        result['query'] = qry;
    }

    return result;
}

function createConversation() {
    var fileName = vars['$L.file']['object'];
    var id = vars['$L.file']['objectid'];
    var conversation = $('conversation').select('object = "' + fileName + '" and objectid = "' + id + '"').uniqueResult();
    if (conversation == null) {
        conversation = new SCFile('conversation');
        conversation.object = fileName;
        conversation.objectid = id;
        conversation.conversationid = lib.UUID.generateUUID().toLowerCase();
        conversation.doInsert();
        lib.SMCRemoteService.createActivityLog(fileName, id);
    }
    vars['$L.file'] = conversation;
    vars.$L_exit = "normal";
}

function removeParticipants(record) {
    var conversation = getConversation(getFilename(record), record['number']);
    if (conversation) {
        var conversationId = conversation['conversationid'];
        var participants = [];
        participants.push(getOperatorIdByContact(record['contact']));
        lib.SMCRemoteService.removeParticipants(conversationId, participants);
    }
}

function retrieveChatReqCustomizedInfo(chatReqId) {
    var rtn;
    rtn = lib.EndUserChatCustomization.overrideChatRequestInfo(chatReqId, chatReqTable);
    if (!rtn) {
        return defaultChatReqInfo(chatReqId);
    }
    return rtn;
}

function defaultChatReqInfo(id) {
    var chat = new SCFile(chatReqTable, SCFILE_READONLY);
    var sql = "number=\"" + lib.StringUtil.escapeAllStr(id) + "\"";
    if (chat.doSelect(sql) === RC_SUCCESS) {
        var contact = getContactByName(chat['contact']);
        var rtn = [];
        rtn.push({
            "label": getFieldLocalizedCaption("dept.name", "contacts"),
            "value": contact['dept.name']
        });
        rtn.push({
            "label": getFieldLocalizedCaption("email", "contacts"),
            "value": contact['email']
        });
        rtn.push({
            "label": getFieldLocalizedCaption("location", "contacts"),
            "value": contact['location']
        });
        rtn.push({
            "label": getFieldLocalizedCaption("description", chatReqTable),
            "value": chat['description']
        });
        return rtn;
    }
    else {
        return null;
    }
}

/**********************************Pre chat Configuration Start*************************************************/
function configDefaultPrechat(record) {
    var defaultCustomField = {
        "id": "desc",
        "label": "Description",
        "value": "",
        "mandatory": true,
        "mappedField": "description",
        "maxLength": 1000,
        "displayType": "multitext"
    };
    if (_null(record['prechat.forms'])) {
        record['prechat.forms'] = funcs.denull(record['prechat.forms']);
        record['prechat.forms'].push(lib.JSON2.toJSON(defaultCustomField));
    }
    localizeLabel(record, "desc", "Description");
}

function configPrechat(record, action, lineNumber) {
    var customField = {
        "id": "",
        "label": "",
        "value": "",
        "mandatory": false,
        "mappedField": "",
        "maxLength": "",
        "displayType": ""
    };
    customField['id'] = vars['$fieldId'];
    customField['label'] = vars['$fieldLabel'];
    customField['mandatory'] = vars['$mandatory'];
    customField['mappedField'] = vars['$mappedField'];
    customField['maxLength'] = vars['$maxLength'];
    customField['displayType'] = vars['$displayType'];
    //Drop down pick list
    if (vars['$displayType'] == "picklist") {
        if (vars['$option.type'] == "options") {
            delete customField['globalList'];
            delete customField['js'];
            /*
            var options={"value":[],"displayValue":[]};
            var i;
            for (i=0;i<lng(vars['$pickListValue']);i++){
                if(!_null(vars['$pickListValue'][i])){
                    options['value'].push(vars['$pickListValue'][i]);
                    options['displayValue'].push(_null(vars['$pickListDisp'][i])?vars['$pickListValue'][i]:vars['$pickListDisp'][i]);
                }
            }
            */
            var options = [];
            var i;
            for (i = 0; i < lng(vars['$pickListValue']); i++) {
                if (!_null(vars['$pickListValue'][i])) {
                    options.push({
                        value: vars['$pickListValue'][i],
                        displayValue: _null(vars['$pickListDisp'][i]) ? vars['$pickListValue'][i] : vars['$pickListDisp'][i]
                    });
                }
            }
            customField['options'] = options;
        }
        else if (vars['$option.type'] == "globallist") {
            delete customField['options'];
            delete customField['js'];
            customField['globalList'] = vars['$globallist'];
        }
        else { //vars['$option.type']=="js"
            delete customField['options'];
            delete customField['globalList'];
            customField['js'] = vars['$js'];
        }
    }
    else { //none pick list type
        delete customField['globalList'];
        delete customField['options'];
        vars['$globallist'] = "";
        vars['$option.type'] = "";
    }
    if (action == "add") {
        record['prechat.forms'].push(lib.JSON2.toJSON(customField));

    }
    //edit or remove
    else {
        var prechatForms = record['prechat.forms'].toArray();
        if (action == "edit") {
            prechatForms.splice((lineNumber - 1), 1, lib.JSON2.toJSON(customField));
        }
        //action=="remove"
        else {
            if (!isDefaultMapping(prechatForms[lineNumber - 1])) {
                prechatForms.splice((lineNumber - 1), 1);
            }
        }
        record['prechat.forms'] = funcs.denull(prechatForms);
    }
    record.doSave();
    displayPrechatConfig(record);
}

function isDefaultMapping(form) {
    var rtn = false;
    if (!_null(form)) {
        var f = strToJson(form);
        if (f != undefined) {
            if (f['mappedField'] == "description") {
                rtn = true;
            }
        }
    }
    return rtn;
}

function moveField(record, currentPosition, targetPosition) {
    var prechatForms = record['prechat.forms'].toArray();
    var length = prechatForms.length;
    if (length > 0) {
        var acp = currentPosition - 1;
        var atp = targetPosition - 1;
        if (atp >= 0 && atp < length) {
            var tmpTargetElement = prechatForms[atp];
            prechatForms[atp] = prechatForms[acp];
            prechatForms[acp] = tmpTargetElement;
            record['prechat.forms'] = prechatForms;
            record.doSave();
            displayPrechatConfig(record);
            funcs.cursor_field_name_set("$fieldIds", targetPosition);
        }
        else if (atp < 0) {
            funcs.cursor_field_name_set("$fieldIds", 1);
        }
        else if (atp >= length) {
            funcs.cursor_field_name_set("$fieldIds", length);
        }
    }
}

function displayPrechatConfig(record) {
    var forms = record['prechat.forms'];

    vars['$fieldIds'] = $.createSCArray();
    vars['$fieldLabels'] = $.createSCArray();
    vars['$mandatories'] = $.createSCArray();
    vars['$mappedFields'] = $.createSCArray();
    vars['$maxLengths'] = $.createSCArray();
    vars['$displayTypes'] = $.createSCArray();
    var i;
    var length = forms.length();
    var f;
    for (i = 0; i < length; i++) {
        if (!_null(forms[i])) {
            f = strToJson(forms[i]);
            if (f != undefined) {
                vars['$fieldIds'].push(f['id']);
                vars['$fieldLabels'].push(getLocalizedLabel(record, f['id'], f['label']));
                vars['$mandatories'].push(f['mandatory']);
                vars['$mappedFields'].push(f['mappedField']);
                vars['$maxLengths'].push(f['maxLength']);
                vars['$displayTypes'].push(f['displayType']);
            }
        }
    }
    vars['$sortField'] = true;
    if (lng(vars['$fieldIds']) == 1) {
        vars['$sortField'] = false;
    }
}

function editPrechatConfig(record, selectedField) {
    var forms = record['prechat.forms'];
    var i;
    var length = forms.length();
    var f;
    for (i = 0; i < length; i++) {
        if (!_null(forms[i])) {
            f = strToJson(forms[i]);
            if (f['id'] == selectedField) {
                vars['$fieldId'] = f['id'];
                vars['$fieldLabel'] = f['label'];
                vars['$mandatory'] = f['mandatory'];
                vars['$mappedField'] = f['mappedField'];
                vars['$maxLength'] = f['maxLength'];
                vars['$displayType'] = f['displayType'];
                if (vars['$displayType'] == "picklist") {
                    if (f['globalList']) {
                        vars['$option.type'] = "globallist";
                        vars['$globallist'] = f['globalList'];
                    }
                    else if (f['options']) {
                        vars['$option.type'] = "options";
                        var options = f['options'];
                        var j;
                        for (j = 0; j < lng(options); j++) {
                            vars['$pickListValue'].push(options[j]['value']);
                            vars['$pickListDisp'].push(options[j]['displayValue']);
                        }
                    }
                    else { //js
                        vars['$option.type'] = "js";
                        vars['$js'] = f['js'];
                    }
                }
                break;
            }
        }
    }

}

function prechatConfigValidation(record, action) {
    var valid = true;
    if (action == "add") {
        var forms = record['prechat.forms'];
        var i;
        var length = forms.length();
        var f;
        for (i = 0; i < length; i++) {
            if (!_null(forms[i])) {
                f = strToJson(forms[i]);
                if (f['id'] == vars['$fieldId'] || f['mappedField'] == vars['$mappedField']) {
                    vars['$valMsg'] = scmsg("5103", "fc");
                    return false;
                }
            }
        }
    }
    valid = dataTypeCheck(vars['$displayType'], chatReqTable, vars['$mappedField']);
    if (!valid) {
        vars['$valMsg'] = scmsg("5104", "fc");
    }
    return valid;
}

function dataTypeCheck(displayType, tableName, mField) {
    var result = false;
    var fieldType = dbdictHelper("field.type", tableName, mField);
    if (displayType == "text") {
        if (fieldType == $.Character || fieldType == $.Datetime) {
            result = true;
        }
    }
    else if (displayType == "multitext") {
        if (fieldType == $.Array || fieldType == $.Character) {
            result = true;
        }
    }
    else if (displayType == "checkbox") {
        if (fieldType == $.Logical) {
            result = true;
        }
    }
    else if (displayType == "picklist") {
        if (fieldType == $.Character || fieldType == $.Number) {
            result = true;
        }
    }
    return result;
}

function strToJson(str) {
    try {
        var json = (new Function("return " + str))();
        return json;
    }
    catch (e) {
        var rc = new SCDatum();
        funcs.rtecall("msg", rc, str, 3);
        return ""; 
    }
}

function initPrechatConfigMappingFields(tableName) {
    var restrictFields = ["number", "contact", "description", "accept.time", "accepted.by", "assignee", "assignment", "close.time", "closed.by", "closure.code", "current.phase", "ended.reason", "ended.by.user", "open.time", "opened.by", "sd.chat.bot", "sysmodcount", "sysmodtime", "sysmoduser", "active", "prechat.forms", "user.language", "company", "journal.updates", "first.time.resolved", "bot.only", "trans.to.live.time", "first.response.time", "pubsub.id"];
    var valueList = [];
    var displayList = [];
    var fieldName = "";
    var caption = "";
    var smFile = initDbdictFile(tableName);
    var fieldList = smFile.field;
    var fieldType = "";
    var len = funcs.lng(fieldList);
    var i;
    for (i = 0; i < len; i++) {
        fieldName = fieldList[i].name;
        fieldType = dbdictHelper("field.type", tableName, fieldName);
        if (fieldList[i].level == 1 && policyread(tableName, fieldName, "avail") && fieldType !== $.Structure && !policyread(tableName, fieldName, "invisible") && !lib.ArrayUtil.contains(restrictFields, fieldName) && !dbdictHelper("is.alias", tableName, fieldName)) {
            valueList.push(fieldName);
            caption = getFieldLocalizedCaption(fieldName, tableName);
            displayList.push(caption + " - " + fieldList[i].name);
        }
    }
    //sort array a~z
    var temp = new SCDatum(8);
    temp.push(valueList);
    temp.push(displayList);
    var retcode;
    funcs.rtecall("sort", retcode, temp, 1, 0);
    valueList = temp[0];
    displayList = temp[1];
    vars['$mappingFieldList'] = valueList;
    vars['$mappingFieldDisplayList'] = displayList;
}

function getFieldLocalizedCaption(fieldName, tableName) {
    var caption = "";
    caption = policyread(tableName, fieldName, 'captions');
    if (caption === null || caption === "") {
        return fieldName;
    }
    return caption;
}

function getCharacterFieldLength(fileName, fieldName) {
    var length = "";
    var fieldType = dbdictHelper("field.type", fileName, fieldName);
    if (fieldType == $.Character) {
        var dict = initDbdictFile(fileName);
        var descriptorMeta = dbdictService.getDescriptorMeta(dict["field"]);
        var fieldMeta = dbdictService.getFieldMeta(fieldName, descriptorMeta);
        var meta = dbdictService.getFieldMetaWithSQLInfo(fieldMeta);
        var sqlType = meta.field["sql.field.options"]["sql.data.type"];
        var sqlLng = sqlType.substring(sqlType.indexOf("(") + 1, sqlType.indexOf(")"));
        length = parseInt(sqlLng / 2);
    }
    return length;
}

function localizeLabel(record, idFieldValue, textFieldValue) {
    var activeLanguage = [];
    activeLanguage = lib.localizeTable.getActiveLanguages();
    var msgId = getMsgId(record, idFieldValue);
    var i;
    for (i = 0; i < activeLanguage.length; ++i) {
        lib.localizeTable.addMessageRecord(getFilename(record), msgId, textFieldValue, activeLanguage[i]);
    }
}

function updateLocalizedMessage(record, idFieldValue, textFieldValue) {
    var cls = "local:" + getFilename(record);
    var msgId = getMsgId(record, idFieldValue);
    var message = new SCFile("scmessage");
    var sql = "class=\"" + cls + "\" and message.id=\"" + msgId + "\"";
    if (message.doSelect(sql) == RC_SUCCESS) {
        if (textFieldValue != message.message) {
            message.message = textFieldValue;
            message.doUpdate();
        }
    }
    else {
        localizeLabel(record, idFieldValue, textFieldValue);
    }
}

function getMsgId(record, idFieldValue) {
    var fileName = getFilename(record);
    var uniqueKey = dbdictHelper("unique.key", fileName)[0];
    var keyValue = record[uniqueKey];
    var msgId = fileName + ";" + keyValue + ";" + idFieldValue;

    return msgId;
}

function getLocalizedLabel(record, idFieldValue, textFieldValue) {
    var msg = textFieldValue;
    var cls = "local:" + getFilename(record);
    var msgStr = scmsg(getMsgId(record, idFieldValue), cls);
    if (msgStr.indexOf("Could not be found") == -1) {
        msg = msgStr;
    }
    return msg;
}

function getTargetLanguageLabel(record, idFieldValue, textFieldValue, lan) {
    var msg = textFieldValue;
    var msgId = getMsgId(record, idFieldValue);
    var cls = "local:" + getFilename(record);
    var message = new SCFile("scmessage", SCFILE_READONLY);
    var sql = "syslanguage=\"" + lan + "\" and class=\"" + cls + "\" and message.id=\"" + msgId + "\"";
    if (message.doSelect(sql) == RC_SUCCESS) {
        msg = message.message;
    }
    return msg;
}
/**********************************Pre chat Configuration End*************************************************/

/**************************Swich user session start**********************************/
function preChangeUserSession(action, record) {
    var fileName = getFilename(record);
    if (fileName == "sdchat") {
        changeUserSessionForChatRequest(action, record);
    }
    else if (fileName == "sdchatutil") {
        var param = strToJson(vars['$L.file']['parameter']);
        action = vars['$L.file']['action'];
        if (param && param['user']) {
            if (funcs.sysinfo_get("AuthMode") === "ldap" && action == "CheckLocalAccount") {
                changeUserSession(param['user'], true);
            }
            else {
                changeUserSession(param['user'], false);
            }
        }
    }
    //Chat ui get user portrait, use the session of the user whose portrait is being getted.
    else if (fileName == "userprofile") {
        changeUserSession(record['user.name'], false);
    }
}

function changeUserSessionForChatRequest(action, record) {
    //action:Create,Accept,Update,Close

    //End user create sdchat through chat service - use operator name
    if (vars['$G.bg'] && action == "Create") {
        changeUserSession(record['contact'], false);
    }
    //IT Agent accept sdchat through chat service - use operator name
    else if (vars['$G.bg'] && action == "Accept") {
        var loginName = record['assignee'];
        // update sdchat with the mapped name
        record['assignee'] = mapOperatorName(loginName);
        changeUserSession(loginName, false);
    }
    /*End user sdchat - update, close;
      or go to Live Chat by chat bot. - all use contact name
    */
    else if (vars['$G.bg'] && lib.ArrayUtil.indexOf(['Update','Close','LiveChat'], action) > -1) {
        changeUserSession(record['contact'], false, true);
    }
}

function changeUserSession(newOperator, directlyChange, isContact) {
    var oriOperator = rad_operator();
    //In case the "newOperator" is a contact
    if (isContact) {
        var contact = getContactByName(newOperator);
        if (contact) {
            newOperator = contact['operator.id'];
        }
    }
    newOperator = mapOperatorName(newOperator);

    if (directlyChange || oriOperator != newOperator) {
        var oldBG = vars['$G.bg'];

        try {
            lib_reportExport.setOpertor(newOperator);
            rad_resetsession();
            lib_reportExport.loginAs(newOperator);
        }
        catch (e) {
            lib_reportExport.setOpertor(oriOperator);
            rad_resetsession();
            lib_reportExport.loginAs(oriOperator);
            vars['$G.bg'] = oldBG;
            print("Changing session failed for user " + newOperator);
        }
        vars['$G.bg'] = oldBG;
    }

}
/**************************Swich user session end**********************************/

function autoPrePublishWebsvcFields(newRecord, oldRecord) {
    var newFieldList = newRecord['field'];
    var oldFieldList = oldRecord['field'];
    var newFieldListLen = lng(newFieldList);
    var oldFieldListLen = lng(oldFieldList);
    var maxLen = funcs.max(newFieldListLen, oldFieldListLen);
    var i;
    var newSortFieldList = [];
    var oldSortFieldList = [];
    var fieldName;
    var fieldType;
    for (i = 0; i < maxLen; i++) {
        if (newFieldList[i] && newFieldList[i]['name']) {
            fieldName = newFieldList[i]['name'];
            fieldType = dbdictHelper("field.type", newRecord['name'], fieldName);
            if (newFieldList[i]['level'] == 1 && fieldType !== $.Structure && !dbdictHelper("is.alias", newRecord['name'], fieldName)) {
                newSortFieldList.push(newFieldList[i]['name']);
            }
        }
        if (oldFieldList[i] && oldFieldList[i]['name']) {
            fieldName = oldFieldList[i]['name'];
            fieldType = dbdictHelper("field.type", newRecord['name'], fieldName);
            if (oldFieldList[i]['level'] == 1 && fieldType !== $.Structure && !dbdictHelper("is.alias", newRecord['name'], fieldName)) {
                oldSortFieldList.push(oldFieldList[i]['name']);
            }
        }
    }

    newFieldListLen = lng(newSortFieldList);
    oldFieldListLen = lng(oldSortFieldList);
    maxLen = funcs.max(newFieldListLen, oldFieldListLen);
    var updatedFields = [];
    var addedFields = [];
    var reomvedFields = [];
    for (i = 0; i < maxLen; i++) {
        //Added or updated fields
        if (newFieldListLen >= oldFieldListLen) {
            if (i < oldFieldListLen) {
                if (newSortFieldList[i] !== oldSortFieldList[i]) {
                    updatedFields.push({
                        oldValue: oldSortFieldList[i],
                        newValue: newSortFieldList[i]
                    });
                }
            }
            else {
                addedFields.push(newSortFieldList[i]);
            }
        }
        //Removed or updated fields
        else {
            if (i < newFieldListLen) {
                if (newSortFieldList[i] !== oldSortFieldList[i]) {
                    updatedFields.push({
                        oldValue: oldSortFieldList[i],
                        newValue: newSortFieldList[i]
                    });
                }
            }
            else {
                reomvedFields.push(oldSortFieldList[i]);
            }
        }
    }
    autoPublishWebsvcFields(addedFields, lib.JSON2.toJSON(updatedFields), reomvedFields);
}

function autoPublishWebsvcFields(addedFields, updatedFields, reomvedFields) {
    var ext = new SCFile("extaccess");
    var query = "service.name=\"ServiceDeskChat\" and name=\"sdchat\" and object.name=\"ServiceDeskChat\"";
    if (ext.doSelect(query) == RC_SUCCESS) {
        var i;
        ext['soafield'] = funcs.denull(ext['soafield']);
        var soaFields = ext['soafield'];
        var soaFieldsLen = lng(soaFields);
        if (!_null(addedFields)) {
            var addedFieldsLen = lng(addedFields);
            for (i = 0; i < addedFieldsLen; i++) {
                ext['soafield'][soaFieldsLen + i] = addedFields[i];
            }
        }
        if (!_null(updatedFields) && lng(strToJson(updatedFields)) > 0) {
            updatedFields = strToJson(updatedFields);
            var updatedFieldsLen = lng(updatedFields);
            for (i = 0; i < updatedFieldsLen; i++) {
                var updatedField = updatedFields[i];
                var j;
                for (j = 0; j < lng(ext['soafield']); j++) {
                    if (updatedField['oldValue'] == ext['soafield'][j]) {
                        ext['soafield'][j] = updatedField['newValue'];
                    }
                }
            }
        }
        if (!_null(reomvedFields)) {
            var removedFieldsLen = lng(reomvedFields);
            for (i = 0; i < removedFieldsLen; i++) {
                var k;
                for (k = 0; k < lng(ext['soafield']); k++) {
                    if (reomvedFields[i] == ext['soafield'][k]) {
                        ext['soafield'][k] = null;
                    }
                }
            }
        }
        ext.doAction("save");
    }
}

function getSdchat(sdchatid) {
    var sdchat = new SCFile("sdchat");
    var sql = "number=\"" + sdchatid + "\"";
    if (sdchat.doSelect(sql) === RC_SUCCESS) {
        return sdchat;
    }
    return null;
}

function chatIconVisible(sdchatid) {
    var sdchat = new SCFile("sdchat", SCFILE_READONLY);
    var sql = "number=\"" + lib.StringUtil.escapeAllStr(sdchatid) + "\"";
    if (sdchat.doSelect(sql) === RC_SUCCESS) {
        if ((sdchat['current.phase'] == "Closed" && (sdchat["sd.chat.bot"] != null || sdchat["assignee"] != null)) ||
            (sdchat["current.phase"] == "Accepted" && sdchat["assignee"] != null)) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
}

function getSMSPLink(databaseName, ticketId) {
    var ret = lib.urlCreator.getSMSPURL(databaseName, ticketId);
    return lib.JSON2.toJSON({
        "smsplink": ret
    });
}

function getSdChatClosureStatusByIDs(idArray) {
    if (idArray === null || idArray === undefined) {
        return null;
    }
    var sql = "number isin {";
    var i;
    for (i = 0; i < idArray.length; ++i) {
        sql += "\"" + idArray[i] + "\"";
        if (i < idArray.length - 1) {
            sql += ",";
        }
    }
    sql += "} ";
    var ret = [];
    var sdchat = new SCFile("sdchat", SCFILE_READONLY);
    var rc = sdchat.doSelect(sql);
    var closureCode = getLocalizedGlobalList("Service Desk Chat Full Closure Codes", vars["$G.my.language"]);
    while (rc == RC_SUCCESS) {
        var row = {};
        row['id'] = sdchat["number"];
        row['closurecode'] = getLocalizedClosureCode(closureCode, sdchat["closure.code"]);
        row['phase'] = sdchat["current.phase"];
        if (sdchat['ended.by.user']) {
            row['endby'] = getOperatorIdByContact(sdchat["contact"]);
            row['endreason'] = getLocalizedClosureCode(closureCode, sdchat["ended.reason"]);
        }
        else {
            row['endby'] = "";
            row['endreason'] = "";
        }

        if (sdchat['assignee'] != null && sdchat['assignee'] == sdchat['closed.by']) {
            row['closedby'] = sdchat['assignee'];
        }
        else {
            row['closedby'] = "";
        }
        ret.push(row);
        rc = sdchat.getNext();
    }

    return lib.JSON2.toJSON(ret);
}

function getLocalizedClosureCode(closureCode, closureCodeValue) {
    var i;
    for (i = 0; i < closureCode.length; i++) {
        var row = closureCode[i];
        if (closureCodeValue === row["value"]) {
            return row["displayValue"];
        }
    }

    return closureCodeValue;
}