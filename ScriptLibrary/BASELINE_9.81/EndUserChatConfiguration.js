var _log = getLog("EndUserChatConfiguration");

function handleCollaborationConfiguration(CollaborationConfiguration) {
    var chatserviceUrl = lib.settings.getValue("Collaboration", "chatservicedomainport", CollaborationConfiguration);
    if (!validateChatServiceUrl(chatserviceUrl)) {
        return -1;
    }
    var len=chatserviceUrl.length;
  
    if(chatserviceUrl.substring(len-1) != "/"){
      chatserviceUrl = chatserviceUrl + "/";
    }
  
    var remoteConfig = lib.EndUserChat.strToJson(getRemoteConfiguration(chatserviceUrl));

    if (remoteConfig != null) {
        if (remoteConfig.code == "404") {
            printErrorMessage(remoteConfig.message);
            _log.warn("Exception for connecting chat service: " + remoteConfig.message);
        } 

        lib.settings.setValue("Collaboration", "smcBoshURL", CollaborationConfiguration, remoteConfig["boshUrl"]);
        lib.settings.setValue("Collaboration", "chatserviceurl", CollaborationConfiguration, remoteConfig["chatServiceUrl"]);
        lib.settings.setValue("Collaboration", "smcPluginURL", CollaborationConfiguration, remoteConfig["pluginUrl"]);
        lib.settings.setValue("Collaboration", "openfireDomainName", CollaborationConfiguration, remoteConfig["xmppDomain"]);
    }
}

function validateChatServiceUrl(url) {
    var ret = true;
    if (url === null || url === "") {
        ret = false;
    }

    var len = url.length;
    if (len < 7) {
        ret = false;
    }
    /*
    if (url.substring(len - 1) != "/") {
        ret = false;
    }
    */
    if (url.substring(0, 4) != "http") {
        ret = false;
    }
    return ret;
}

function printErrorMessage(message) {
    var rc = new SCDatum();
    funcs.rtecall("msg", rc, message, 3);
}

function isEnableCollaboration() {
    var ret = false;
    var settings = new SCFile("settings", SCFILE_READONLY);
    var sql = "name=\"Collaboration\"";
    if (settings.doSelect(sql) == RC_SUCCESS) {
        ret = lib.settings.getValue("Collaboration", "smcEnabled", settings);
    }
    return ret;
}

function getRemoteConfiguration(chatserviceurl) {
    //HTTP Header
    var httpHeaders = [];

    //Content-Type
    var contentHeader = new Header();
    contentHeader.name = "Content-Type";
    contentHeader.value = "application/json";
    httpHeaders.push(contentHeader);
    //Auth
    var authHeader = new Header();
    var token = getLwssoToken(funcs.operator());
    authHeader.name = "Cookie";
    authHeader.value = "LWSSO_COOKIE_KEY=" + token;
    //Construct Header
    httpHeaders.push(authHeader);

    //Service API URL
    var url = chatserviceurl + "api/config/simplechatconfig";
    var response = null;

    try {
        response = doHTTPRequest("GET", url, httpHeaders, null);
    }
    catch (ex) {
        _log.warn("Exception for connecting chat service: " + ex);
        printErrorMessage(ex.toString());
    }
    
    return response;
}

function getPortalConfiguration() {
    var ret = {
        "portalType": "",
        "portalUrl": "",
        "smsptSupportTicketUrl": ""
    };

    ret["portalType"] = vars["$G.sm.portal"];

    if (vars["$G.sm.portal"] == "ESS") {
        ret["portalUrl"] = vars["$G.ess.url"];
    }
    else if (vars["$G.sm.portal"] == "SRC") {
        ret["portalUrl"] = vars["$G.src.url"];
    }
    else if (vars["$G.sm.portal"] == "SMSP") {
        ret["portalUrl"] = vars["$G.smsp.url"];
        ret["smsptSupportTicketUrl"] = vars["$G.smsp.supportticket.url"];
    }

    return ret;
}


function deleteLegacyConfigurations() {
    var sql = 'setting="Collaboration" and id isin {"chatservicedomainport","openfireDomainName","smcPluginURL","smcBoshURL"}';
    lib.c.$('settingsConfig').select(sql).each(function(item){
        item.doDelete();
    });
}
