var logger = getLog('VirtualAgentProcessor');

var $ = lib.c.$;

var vaname = "VirtualAgent";
var commandGreeting = "GREETING";
var commandSetLan = "SETLANGUAGE";
var commandCancel = "CANCEL";

var SET_LANGUAGE_STATUS = {
    "NOTSET": 0,
    "ONGOING": 1,
    "SET": 2
};

var getLocalizedMessageText = lib.localizeTable.getLocalizedMessageText;

/**
 *   Return rendered answer
 *   parameter json:
 *             {
 *                 "msUserId":<msUserId>,
 *                 "ask": <ask>,
 *                 "command": <greeting|set language|cancel>,
 *                 "channel": <msteams|emulator|other>,
 *                 "conversationId": <unique id of conversation>,
 *                 "serviceUrl": <base URL for bot API requests>,
 *                 "botId": <unique id of bot>
 *             }
 */
function chat(json) {
    if (logger.isDebugEnabled()) {
        logger.debug("chat: " + (json ? JSON.stringify(json) : "NULL"));
    }

    var msUserId = json.msUserId;
    var ask = json.ask;
    var command = json.command;
    var channel = json.channel;
    var operator = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);
    var locale = json.locale;

    if (!operator) {
        return lib.MicrosoftTeamsVirtualAgentAdapter.render(getLocalizedMessageText("en", "msteams", "VA_NOT_USER"));
    }

    if (lib.operatorUtil.isRevoked(operator)) {
        return lib.MicrosoftTeamsVirtualAgentAdapter.render(getLocalizedMessageText("en", "msteams", "VA_USER_LOCKED"));
    }

    // add/update conversation reference
    var conversationReference = {
        "conversationId": json.conversationId,
        "serviceUrl": json.serviceUrl,
        "botId": json.botId,
        "userId": msUserId,
        "operatorName": operator
    };
    lib.MicrosoftBotConversation.addConversationReference(conversationReference);

    var latestActivity = getLatestAnswerActivity(operator);
    if (!latestActivity) {
        latestActivity = synchronizeLatestAnswerActivity(operator);
    }
    var context = getActivityContext(latestActivity);

    var language = getContextVariableValue(context, "language");

    if (isTimeout(latestActivity)) {
        logger.debug("timeout");
        endChat("timeout", msUserId, operator, language);
        context = getOperatorContext(operator);
    }

    var answer = "";

    // process command
    if (command) {
        command = command.trim().toUpperCase();
        if (command == commandGreeting) {
            answer = startChat(command, msUserId, operator);
        } else if (command == commandCancel) {
            answer = endChat(command, msUserId, operator, language);
            return lib.MicrosoftTeamsVirtualAgentAdapter.render(answer, language, channel);
        } else {
            answer = "Unknown action. ";
            return lib.MicrosoftTeamsVirtualAgentAdapter.render(answer, language, channel);
        }
    } else if (ask) {
        if (logger.isDebugEnabled()) {
            logger.debug("Process command in ask: " + ask);
        }

        var tempAsk = ask.trim().toUpperCase();
        if (tempAsk == commandSetLan) {
            // reset the context for this round chat
            endChat(ask, msUserId, operator, language);
            command = commandSetLan;
            ask = commandSetLan;
            context = getOperatorContext(operator);
        }
    } else {
        return lib.MicrosoftTeamsVirtualAgentAdapter.render("Invalid input.");
    }

    var isLanguageSet = getContextVariableValue(context, "isLanguageSet");

    if (logger.isDebugEnabled()) {
        logger.debug("language=" + language);
        logger.debug("isLanguageSet=" + isLanguageSet);
    }

    // 1. language is no value
    // 2. language is not set
    // 3. cmd: set language
    // 4. select button switch language
    if (!language || !isLanguageSet || isLanguageSet == getSetLanguageStatus("NOTSET") || command == commandSetLan ||
        (ask && ask.trim().toUpperCase() == lib.localizeTable.getLocalizedMessageText(language, "msteams", "VA_SET_LANGUAGE").toUpperCase())) { // ask user to select language
        if (logger.isDebugEnabled()) {
            logger.debug("Set language");
        }

        context = setContextCandidateLanguages(context, operator, locale);

        if (logger.isDebugEnabled()) {
            logger.debug("context after set candidate languages=" + (context ? JSON.stringify(context) : "NULL"));
        }

        // language is not set and candidate languages are more than 1
        if ((!isLanguageSet || isLanguageSet == getSetLanguageStatus("NOTSET")) &&
            getContextVariableValue(context, "isLanguageSet") == getSetLanguageStatus("ONGOING")) {
            ask = commandSetLan;
        }
    }

    language = getContextVariableValue(context, "language");

    var bot = lib.EndUserChat.getChatbotByName(vaname, language);
    if (!bot) {
        return null;
    }

    var intepreter = lib.VirtualAgentInterpreter.getInstance({
        "operator": operator,
        "botid": bot["number"]
    });

    intepreter.initializeVariables();
    intepreter.setParameterJson(context);
    intepreter.loadAIMLContentArrayIntoArray(lib.EndUserChatBotAiml.getBotAimlContentArray(bot));

    answer = intepreter.findAnswerInLoadedAIML(ask);
    context = intepreter.getParameterJson();
    language = getContextVariableValue(context, "language");
    answer = saveAnswer(ask, answer, msUserId, operator, context);
    if (answer) {
        return lib.MicrosoftTeamsVirtualAgentAdapter.render(answer, language, channel);
    }
    return null;
}

function saveAnswer(ask, answer, msUserId, operator, context) {
    if (!answer) {
        return null;
    }
    var activity = new SCFile("vachatactivity");
    activity["ask"] = ask;
    activity["status"] = getChatOngoingStatus();
    var cmdEndChat = getChatEndCommand();
    if (answer.indexOf(cmdEndChat) >= 0) {
        activity["status"] = getChatEndStatus();
        answer = answer.replace(cmdEndChat, "");
        if (logger.isDebugEnabled()) {
            logger.debug("answer trimmed for end chat=: " + answer);
        }
    }
    activity["answer"] = answer;
    activity["msuser.id"] = msUserId;
    activity["operator"] = operator;
    activity["context"] = typeof context == "object" ? JSON.stringify(context, null, "   ") : context;
    activity.doInsert();
    
    var latestActivity = getLatestAnswerActivity(operator);
    var updateLatest = true;
    if (!latestActivity) {
        latestActivity = new SCFile("vachatactivitylatest");
        latestActivity["operator"] = operator;
        updateLatest = false;
    }
    
    latestActivity["number"] = activity["number"];
    latestActivity["ask"] = activity["ask"];
    latestActivity["status"] = activity["status"];
    latestActivity["answer"] = activity["answer"];
    latestActivity["msuser.id"] = activity["msuser.id"];
    latestActivity["context"] = activity["context"];
    
    if (updateLatest) {
        latestActivity.doUpdate();
    } else {
        latestActivity.doInsert();
    }
    
    return answer;
}

function getLatestAnswerActivity(operator) {
    var latestActivity = new SCFile("vachatactivitylatest");
    var rc = latestActivity.doSelect("operator=\"" + operator + "\"");
    if (rc == RC_SUCCESS) {
        // todo: check timeout
        return latestActivity;
    }
    return null;
}

/**
 *  Synchronize the latest record in vachatactivity to vachatactivitylatest
 *  Expect that it is executed when there is no record in vachatactivitylatest
 *  for the operator. It should be executed ony once for every operator
 */
function synchronizeLatestAnswerActivity(operator) {
    if (logger.isDebugEnabled()) {
        logger.debug("synchronize latest answer activity for " + operator);
    }
    
    if (!operator) {
        return null;
    }
    
    var activity = new SCFile("vachatactivity");
    activity.setOrderBy(["number"], [SCFILE_DSC]);
    var rc = activity.doSelect("operator=\"" + operator + "\"");
    if (rc == RC_SUCCESS) {
        var latestActivity = new SCFile("vachatactivitylatest");
        latestActivity["number"] = activity["number"];
        latestActivity["operator"] = activity["operator"];
        latestActivity["ask"] = activity["ask"];
        latestActivity["status"] = activity["status"];
        latestActivity["answer"] = activity["answer"];
        latestActivity["msuser.id"] = activity["msuser.id"];
        latestActivity["context"] = activity["context"];
    
        latestActivity.doInsert();
    
        return latestActivity;
    }
    
    return null;
}

function startChat(ask, msUserId, operator) {
    if (logger.isDebugEnabled()) {
        logger.debug("start chat session with " + operator);
    }
    var latestActivity = getLatestAnswerActivity(operator);
    if (latestActivity && !isChatEnd(latestActivity)) {
        latestActivity["status"] = getChatEndStatus();
        latestActivity.doUpdate();
        
        // update status of the latest record in vachatactivity
        var activitySqlTable = $("#dbdictService").getPrimaryTable(lib.dbdictHelper.initDbdictFile("vachatactivity"))[1];
        var dbType = lib.dbdictHelper.getDbType();
        var adapter = lib.DataService.getAdaptor(dbType);
        var updateSql="update "+activitySqlTable+" set " + adapter.escapeField("STATUS") + "='" + latestActivity["status"] + "' where " + adapter.escapeField("NUMBER") + "=" + latestActivity["number"];
        var result = $("#dataService").executeSQL(updateSql);
    }

    //return saveAnswer(ask, getLocalizedMessageText(language, "msteams", "VA_WELCOME"), msUserId, operator, "{}");
}

function endChat(ask, msUserId, operator, language) {
    if (logger.isDebugEnabled()) {
        logger.debug("end chat session with " + operator);
    }
    var context = {};
    // when language is not null, it means that language has been set
    // Otherwise, language is not set and then keep context empty
    if (language) {
        setContextVariableValue(context, "language", language);
        setContextVariableValue(context, "isLanguageSet", getSetLanguageStatus("SET"));
    }
    return saveAnswer(ask, getChatEndCommand() + getLocalizedMessageText(language, "msteams", "VA_FINISH"), msUserId, operator, context);
}

function getChatEndCommand() {
    return "BOTCMD_VIRTUAL_AGENT_END_CHAT";
}

function getChatOngoingStatus() {
    return "Ongoing";
}

function getChatEndStatus() {
    return "End";
}

function isChatEnd(activity) {
    return !activity || activity["status"] == getChatEndStatus();
}

function getOperatorContext(operator) {
    if (logger.isDebugEnabled()) {
        logger.debug("getOperatorContext: " + operator);
    }

    var latestActivity = getLatestAnswerActivity(operator);
    var context = getActivityContext(latestActivity);

    return context;
}

function getActivityContext(activity) {
    if (logger.isDebugEnabled()) {
        logger.debug("getActivityContext: " + activity);
    }

    var context = {};
    if (activity && activity["context"]) {
        if (logger.isDebugEnabled()) {
            logger.debug("activity=" + activity);
        }

        var tempContext = JSON.parse(activity["context"]);
        if (!isChatEnd(tempContext)) {
            context = tempContext;
        } else {
            setContextVariableValue(context, "language", getContextVariableValue(tempContext, "language"));
            setContextVariableValue(context, "isLanguageSet", getContextVariableValue(tempContext, "isLanguageSet"));
        }
    }

    if (logger.isDebugEnabled()) {
        logger.debug("context=" + (context ? JSON.stringify(context) : "NULL"));
    }

    return context;
}

function getContextVariableValue(context, name) {
    if (!context["storedVariableValues"]) {
        context["storedVariableValues"] = {};
    }
    return context["storedVariableValues"][name];
}

function setContextVariableValue(context, name, value) {
    if (!context["storedVariableValues"]) {
        context["storedVariableValues"] = {};
    }
    context["storedVariableValues"][name] = value;
}

function setContextCandidateLanguages(context, operator, locale) {
    if (logger.isDebugEnabled()) {
        logger.debug("setContextCandidateLanguages");
    }

    var candidateLanguages = [];
    var candidateLanguageNames = [];

    var excludeLanguages = ["tr"];

    // system language is candidate
    if (vars["$G.system.info"] && vars["$G.system.info"]["syslanguage"] &&
        !candidateLanguages.includes(vars["$G.system.info"]["syslanguage"]) &&
        !excludeLanguages.includes(vars["$G.system.info"]["syslanguage"]) &&
        lib.localizeTable.isLanguageActive(vars["$G.system.info"]["syslanguage"])) {
        candidateLanguages.unshift(vars["$G.system.info"]["syslanguage"]);
        candidateLanguageNames.unshift(lib.localizeTable.getLanguageName(vars["$G.system.info"]["syslanguage"]));
    }

    // operator language is candidate
    var operatorLanguage = lib.operatorUtil.getOperatorLanguage(operator);
    if (logger.isDebugEnabled()) {
        logger.debug("operatorLanguage: " + operatorLanguage);
    }
    if (!candidateLanguages.includes(operatorLanguage) && !excludeLanguages.includes(operatorLanguage) && lib.localizeTable.isLanguageActive(operatorLanguage)) {
        candidateLanguages.unshift(operatorLanguage);
        candidateLanguageNames.unshift(lib.localizeTable.getLanguageName(operatorLanguage));
    }

    // chat language is candidate
    var chatLanguage = getLocaleLanguage(locale);
    if (logger.isDebugEnabled()) {
        logger.debug("chatLanguage: " + chatLanguage);
    }
    if (chatLanguage && !candidateLanguages.includes(chatLanguage) && !excludeLanguages.includes(chatLanguage) && lib.localizeTable.isLanguageActive(chatLanguage)) {
        candidateLanguages.unshift(chatLanguage);
        candidateLanguageNames.unshift(lib.localizeTable.getLanguageName(chatLanguage));
    }

    // When no candidate language, set English as language
    if (candidateLanguages.length == 0) {
        candidateLanguages.push("en");
        candidateLanguageNames.push("English");
    }

    if (logger.isDebugEnabled()) {
        logger.debug("candidateLanguages: " + candidateLanguages);
        logger.debug("candidateLanguageNames: " + candidateLanguageNames);
    }

    setContextVariableValue(context, "candidateLanguages", candidateLanguages.toString());
    setContextVariableValue(context, "candidateLanguageNames", candidateLanguageNames.toString());

    if (candidateLanguages.length == 1) {
        setContextVariableValue(context, "language", candidateLanguages[0]);
        setContextVariableValue(context, "isLanguageSet", getSetLanguageStatus("SET"));
    } else {
        setContextVariableValue(context, "isLanguageSet", getSetLanguageStatus("ONGOING"));
    }

    return context;
}

function getSetLanguageStatus(status) {
    return SET_LANGUAGE_STATUS[status];
}

function getLocaleLanguage(locale) {
    var language = null;

    if (locale) {
        var localeParts = locale.trim().split("-");
        if (localeParts && localeParts[0]) {
            language = localeParts[0];
            if (language == "zh") {
                if (localeParts[1] && localeParts[1].toUpperCase() == "CN") {
                    language = "zh-Hans";
                }
            } else if (language == "pt" && localeParts[1] && localeParts[1].toUpperCase() == "BR") {
                language = "pt-Br";
            }
        }
    }

    return language;
}

function isTimeout(activity) {
    if (logger.isDebugEnabled()) {
        logger.debug("isTimeout: " + activity);
    }
    if (!activity || !activity["sysmodtime"]) {
        return false;
    }

    var timeoutHours = "24";
    if (!timeoutHours) {
        return false;
    }
    var time2out = +timeoutHours * 3600000;
    var interval = new Date() - activity["sysmodtime"];
    if (logger.isDebugEnabled()) {
        logger.debug("time2out: " + time2out);
        logger.debug("interval: " + interval);
    }

    if (interval > time2out) {
        return true;
    }

    return false;
}