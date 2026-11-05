var $ = lib.c.$;
var logger = getLog('VirtualAgentSMAdapter');

var hasRight = lib.SecurityIntegration.hasRight;
var getLocalizedMessageText = lib.localizeTable.getLocalizedMessageText;
var getLocalizedGlobalMessageText = lib.localizeTable.getLocalizedGlobalMessageText;


function getProvidedServices(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("getProvidedServices: " + (json ? JSON.stringify(json) : "NULL"));
    }

    var returnResults = {
        "providedServices": null
    };

    if (json["operator"]) {
        var services = [];
        var interaction = new SCFile("incidents", SCFILE_READONLY);
        
        if (hasRight(json["operator"], interaction, "new")) {
            services.push("CREATE SUPPORT TICKET");
        }

        if (hasRight(json["operator"], interaction, "view")) {
            services.push("CHECK TICKET STATUS");
        }

        if (vars['$lo.idol.enabled'] && lib.KMSecurity.canOperatorSearchKnowledge(json["operator"])) {
            services.push("SEARCH KNOWLEDGE");
        }

        if (services.length > 0) {
            //services.push("SET LANGUAGE"); // do not display the button to switch language
            returnResults["providedServices"] = getButtonsFromArray(services);
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug("Provided Services: " + JSON.stringify(returnResults));
    }

    return returnResults;
}

function searchOpenedOwnerInteraction(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("searchOpenedOwnerInteraction: " + (json ? JSON.stringify(json) : "NULL"));
    }

    var language = json["language"] || "en";

    if (json["operator"]) {
        var operator = lib.operatorUtil.getOperatorByName(json["operator"], ["contact.name"]);
        if (operator && operator["contact.name"]) {
            var timeDurationQuery = "";
            var duration;
            if (json["duration"]) {
                duration = +json["duration"];
                if (duration > 0) {
                    timeDurationQuery = " and open.time>=tod()-'" + duration + " 00:00:00'";
                }
            }
            var openedInteraction = [];
            const MAX_NUMBER_LIST = 50;
            var i = 0;
            $('!incidents').fields(["incident.id", "title"]).find("(alternate.contact=:contact or callback.contact=:contact or contact.name=:contact) and open~=\"Closed\"" + timeDurationQuery, {
                contact: operator["contact.name"]
            }).each(function(item) {
                if (hasRight(json["operator"], item, "view")) {
                    openedInteraction.push([item["incident.id"], item["title"]]);
                    i++;
                }
                if (i >= MAX_NUMBER_LIST) {
                    return true;
                }
            });
            if (openedInteraction.length > 0) {
                return (!duration || duration < 0 ? getLocalizedMessageText(language, "msteams", "VA_REFER_OWNER_TICKET") : (duration == 1 ? getLocalizedMessageText(language, "msteams", "VA_REFER_OWNER_TICKET_LAST_24_HOURS") : getLocalizedMessageText(language, "msteams", "VA_REFER_OWNER_TICKET_LAST_NDAYS", [String(duration)]))) +
                    lib.VirtualAgentHelper.getVAFactsTagPrefix() +
                    JSON.stringify(openedInteraction) +
                    lib.VirtualAgentHelper.getVAFactsTagSuffix() +
                    getLocalizedMessageText(language, "msteams", "VA_ENTER_TICKET_NUMBER") + "\n";
            }

            return (!duration || duration < 0 ? getLocalizedMessageText(language, "msteams", "VA_NO_OWNER_TICKET") : (duration == 1 ? getLocalizedMessageText(language, "msteams", "VA_NO_OWNER_TICKET_LAST_24_HOURS") : getLocalizedMessageText(language, "msteams", "VA_NO_OWNER_TICKET_LAST_NDAYS", [String(duration)]))) + "\n";
        }
    }
    return getLocalizedMessageText(language, "msteams", "VA_NO_OWNER_TICKET", [""]) + "\n";
}

function getInteractionContent(interaction, title, language) {
    if (logger.isDebugEnabled()) {
        logger.debug("getInteractionContent: " + interaction + " " + title);
    }

    if (!language) {
        language = "en";
    }

    if (interaction) {
        var description = null;
        if (interaction["description"] != null) {
            var descArray = interaction["description"].toArray();
            if (descArray != null) {
                description = descArray.join("\r\n\r\n");
            }
        }

        return lib.VirtualAgentHelper.getVATitleTagPrefix() +
            (title || interaction["incident.id"] + ": " + interaction["title"]) +
            lib.VirtualAgentHelper.getVATitleTagSuffix() +
            (title ? interaction["title"] : (description || "")) +
            lib.VirtualAgentHelper.getVAFactsTagPrefix() +
            JSON.stringify([
                [getLocalizedMessageText(language, "msteams", "caption;status"), getLocalizedMessageText(language, "local:ModuleStatus", "incidents;" + interaction["open"] + ";ServiceDesk")],
                [getLocalizedMessageText(language, "msteams", "caption;category"), getLocalizedMessageText(language, "local:sdCategory", interaction["category"])],
                [getLocalizedMessageText(language, "msteams", "caption;urgency"), getLocalizedGlobalMessageText(language, interaction["severity"], "Urgency")],
                [getLocalizedMessageText(language, "msteams", "caption;impact"), getLocalizedGlobalMessageText(language, interaction["initial.impact"], "Initial Impact")]
            ]) +
            lib.VirtualAgentHelper.getVAFactsTagSuffix();
    }

    return null;
}

function searchInteractionByID(json, title) {
    if (logger.isDebugEnabled()) {
        logger.debug("searchInteractionByID: " + (json ? JSON.stringify(json) : "NULL") + " " + title);
    }

    var language = json["language"] || "en";

    if (json["ID"] && json["operator"]) {
        var operator = lib.operatorUtil.getOperatorByName(json["operator"], ["contact.name"]);
        if (operator && operator["contact.name"]) {
            var interaction = $('!incidents', true).find("incident.id=:id and (alternate.contact=:contact or callback.contact=:contact or contact.name=:contact)", {
                id: json["ID"],
                contact: operator["contact.name"]
            }).one();
            if (interaction) {
                if (hasRight(json["operator"], interaction, "view")) {
                    return getInteractionContent(interaction, title, language);
                } else {
                    return getLocalizedMessageText(language, "msteams", "VA_NO_RIGHT_VIEW");
                }
            }
        }
    }
    return getLocalizedMessageText(language, "msteams", "VA_NO_TICKET_FOUND");
}

function createInteraction(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("createInteraction: " + (json ? JSON.stringify(json) : "NULL"));
    }

    if (json) {
        var language = json["language"] || "en";

        var interaction = new SCFile("incidents");
        if (!json["description"]) {
            return getLocalizedMessageText(language, "msteams", "VA_INVALID_TICKET_DESC");
        }
        var descs = json["description"].split("\r\n");
        var i;
        var line;
        var emptyLine = false;
        for (i = 0; i < descs.length; i++) {
            line = descs[i].trim();
            if (line.length > 0) {
                emptyLine = false;
                if (!interaction["title"]) {
                    interaction["title"] = line;
                }
                interaction["description"].push(line);
            } else {
                if (!emptyLine) {
                    emptyLine = true;
                    interaction["description"].push(line);
                }
            }
        }

        if (!interaction["title"]) {
            return getLocalizedMessageText(language, "msteams", "VA_INVALID_TICKET_DESC");
        }

        interaction["opened.by"] = json["operator"];
        interaction["category"] = lib.settings.getSettingValue("Service Desk", "default.category");
        if (!interaction["category"]) {
            interaction["category"] = "incident";
        }
        interaction["callback.type"] = "E-mail";
        var contact = lib.operatorUtil.getContactNameByOperatorName(json["operator"]);
        interaction["callback.contact"] = contact;
        interaction["contact.name"] = contact;
        interaction["severity"] = "3";
        interaction["initial.impact"] = "3";
        interaction["ess.entry"] = true;
        if (vars["$G.folderEntitlement"]) {
            var user = lib.operatorUtil.getOperatorByName(json["operator"], ["defaultFolder"]);
            if (user && user["defaultFolder"]) {
                interaction["folder"] = user["defaultFolder"];
            }
        }

        if (hasRight(json["operator"], interaction, "new")) {
            var rc = interaction.doAction("add");
            return searchInteractionByID({
                "ID": interaction["incident.id"],
                "operator": json["operator"],
                "language": json["language"]
            }, getLocalizedMessageText(language, "msteams", "VA_TICKET_CREATED", [interaction["incident.id"]]));
        } else {
            return getLocalizedMessageText(language, "msteams", "VA_NO_RIGHT_CREATE");
        }
    }

    return "Unknown action";
}

var result_type_mapping = {
    "Knowledge_Library": "VA_SEARCH_KNOWLEDGE_ARTICLE",
    "Catalog_Library": "VA_SEARCH_KNOWLEDGE_OFFERING"
};

function IDOLSearch() {
    if (logger.isDebugEnabled()) {
        logger.debug("IDOLSearch: " + (arguments[0] ? JSON.stringify(arguments[0]) : "NULL"));
    }

    var results = lib.EndUserChatBotIDOLSearch.doIDOLSearch(arguments[0]);
    var returnResults = {};
    var i;
    var predicateSearchPrefix = lib.EndUserChatBotIDOLSearch.getIDOLPredicateSearchPrefix();
    if (results.length > 0) {
        var language = arguments[0]["language"] || "en";
        returnResults['predicates'] = {};
        for (i = 0; i < results.length; i++) {
            let filename = lib.SmartEmail_IDOL.getFilenameByIdolLibrary(results[i]['database']);
            let type = results[i]['database'];
            if (result_type_mapping[results[i]['database']]) {
                type = getLocalizedMessageText(language, "msteams", result_type_mapping[results[i]['database']]);
            }
            let href = lib.urlCreator.getRecordURL(filename, results[i]['query'], results[i]['title'], results[i]['id']);
            if (vars.$G_sm_portal == 'ESS' && filename == 'joinsvcDisplay') {
                href = href + '&libname=' + results[i]['database'] + '&openRecord=true';
            }
            returnResults['predicates'][predicateSearchPrefix + (i + 1)] = lib.VirtualAgentHelper.getVAFactTagPrefix() +
                JSON.stringify([type, '[' + results[i]['title'] + '](' + href + ')']) +
                lib.VirtualAgentHelper.getVAFactTagSuffix();
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug("IDOL Search Results: " + JSON.stringify(returnResults));
    }

    return returnResults['predicates'];
}

function getIDOLPredicateParameter() {
    return [lib.EndUserChatBotIDOLSearch.getIDOLPredicateSearchPrefix() + "%d"];
}

function getButtons(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("getButtons: " + (json ? JSON.stringify(json) : "NULL"));
    }

    var buttons = "";
    if (json && json["buttons"]) {
        var buttonNames = json["buttons"].split(",");
        buttons = getButtonsFromArray(buttonNames);
    }

    if (logger.isDebugEnabled()) {
        logger.debug("buttons: " + buttons);
    }

    return buttons;
}

function getButtonsFromArray(buttonNames) {
    var buttons = "";
    if (buttonNames) {
        var len = buttonNames.length;
        var i;
        for (i = 0; i < len; i++) {
            buttons += lib.VirtualAgentHelper.getVAButtonTagPrefix() + buttonNames[i].trim() + lib.VirtualAgentHelper.getVAButtonTagSuffix();
        }
    }

    return buttons;
}

function validateLanguage(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("validateLanguage: " + (json ? JSON.stringify(json) : "NULL"));
    }

    var returnResults = {
        "validLanguage": false
    };
    if (json && json["inputLanguageName"] && json["candidateLanguageNames"]) {
        var languageNames = json["candidateLanguageNames"].split(",");
        if (languageNames) {
            var languageUpperNames = json["candidateLanguageNames"].toUpperCase().split(",");
            var index = languageUpperNames.indexOf(json["inputLanguageName"].toUpperCase());
            if (index >= 0) {
                returnResults["selectedLanguageName"] = languageNames[index];
                returnResults["selectedLanguage"] = lib.localizeTable.getLanguageID(returnResults["selectedLanguageName"]);
                returnResults["validLanguage"] = true;
            }
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug("returnResults: " + (returnResults ? JSON.stringify(returnResults) : "NULL"));
    }

    return returnResults;
}

function setLanguage(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("setLanguage: " + (json ? JSON.stringify(json) : "NULL"));
    }

    var returnResults = {
        "validLanguage": false
    };
    if (json && json["inputLanguageName"] && json["candidateLanguageNames"]) {
        var languageNames = json["candidateLanguageNames"].split(",");
        if (languageNames) {
            var languageUpperNames = json["candidateLanguageNames"].toUpperCase().split(",");
            var index = languageUpperNames.indexOf(json["inputLanguageName"].toUpperCase());
            if (index >= 0) {
                returnResults["selectedLanguageName"] = languageNames[index];
                returnResults["selectedLanguage"] = lib.localizeTable.getLanguageID(returnResults["selectedLanguageName"]);
                returnResults["language"] = returnResults["selectedLanguage"];
                returnResults["isLanguageSet"] = lib.VirtualAgentProcessor.getSetLanguageStatus("SET");
                returnResults["validLanguage"] = true;
            }
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug("returnResults: " + (returnResults ? JSON.stringify(returnResults) : "NULL"));
    }

    return returnResults;
}