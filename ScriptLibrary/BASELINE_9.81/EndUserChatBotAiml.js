var _null = system.functions._null;
var scmsg = system.functions.scmsg;
var msg = system.functions.msg;

function getAimlId() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = system.functions.rtecall("getnumber", rcode, newid, "sdchatbotaiml");
    return newid.getText();
}

function initAimlForBot(aimlRecord) {
    aimlRecord['id'] = getAimlId();
    aimlRecord['input.pattern'] = "";
    aimlRecord['input.pattern.match.type'] = "anyword";
    aimlRecord['that.pattern'] = "";
    aimlRecord['that.pattern.match.type'] = "anyword";
    aimlRecord['topic.pattern'] = "";
    aimlRecord['template'] = ["This is an example"];
}
/*
Publish aiml for a bot

POST
/api/botaiml/BOT001

BOT001 is the id of the Service Desk bot

Request body:

[
{
  "id": "CATEG0001",
  "pattern": "*",
  "that": "My name is jack",
  "topic": "Coffee",
  "template": "I have no answer"
},
{
  "id": "CATEG0002",
  "pattern": "IT IS AMAZING PLACE",
  "that": "I traveled to Peking",
  "topic": "Travel",
  "template": "Happy to know you enjoyed your travel"
}
]


*/
function publishAiml(bot) {
    var aiml = new SCFile("sdchatbotaiml", SCFILE_READONLY);
    var boId = bot['number'];
    var sql = "bot.id=\"" + boId + "\"";
    if (aiml.doSelect(sql) === RC_SUCCESS) {
        var request = [];
        var body = null;
        do {
            body = {};
            var topic = _null(aiml['topic.pattern']) ? "" : aiml['topic.pattern'];
            var tmpContent = "";
            for (var i = 0; i < system.functions.lng(aiml['template']); i++) {
                tmpContent += aiml['template'][i] + "\n";
            }
            body['id'] = aiml['id'];
            body['pattern'] = getContent(aiml['input.pattern'], aiml['input.pattern.match.type']);
            body['that'] = getContent(aiml['that.pattern'], aiml['that.pattern.match.type']);
            body['topic'] = topic;
            body['template'] = tmpContent;

            request.push(body);

        } while (aiml.getNext() === RC_SUCCESS)
        pushToChatService(lib.JSON2.toJSON(request), boId);
    }
}

/**
 *  Export the aiml of sdcchatbotaiml of sdcchatbot to files
 *  Parameter botid: the id of sdcchatbot
 *            folder: the folder to export files
 */
function exportBotAiml(botid, folder) {
    if (!folder || !botid) {
        return;
    }
    folder = folder.trim();
    if (folder.charAt(folder.length-1) != "/" && folder.charAt(folder.length-1) != "\\") {
        folder += "/";
    }
    folder += botid;
    if (!funcs.isfileexist(folder, 2)) {
        if (makeDir(folder) != 0) {
            print("Failed to create the folder " + folder);
            return;
        }
    }
    folder += "/";
    
    var aimlJsonArray = getBotAimlJsonArray(botid);
    
    var i;
    var filename;
    var aimlContent;
    for (i=0; i<aimlJsonArray.length; i++) {
        filename = folder + aimlJsonArray[i]["id"] + ".aiml";
        aimlContent = getBotAimlContentFromJson(aimlJsonArray[i], true);
        print("Exporting aiml file: " + filename);
        writeFile(filename, "t", aimlContent);
    }
}

function importBotAiml(folder, filenames) {
    if (!folder || !filenames || filenames.length == 0 || typeof(filenames)!="object") {
        return;
    }
    
    if (!funcs.isfileexist(folder, 2)) {
        print("The folder " + folder + " doesn't exist.");
        return;
    }
    
    folder = folder.trim();
    if (folder.charAt(folder.length-1) != "/" && folder.charAt(folder.length-1) != "\\") {
        folder += "/";
    }
    
    vars["$G.chatbotaiml.importing"] = true;
    var sdchatbot = new SCFile("sdchatbot");
    sdchatbot["name"] = folder;
    var number = new Datum();
    var rc = new Datum()
    funcs.rtecall("getnumber", rc, number, "sdchatbot");
    sdchatbot["number"] = number;
    sdchatbot.doInsert();
    
    var i;
    var filename;
    var aiml;
    var chatbotaiml;
    for (i=0; i<filenames.length; i++) {
        if (!filenames[i]) {
            continue;
        }
        filename = folder + filenames[i].trim();
        if (!funcs.isfileexist(filename, 1)) {
            print("The file " + filename + " doesn't exist.");
            continue;
        }
        
        aiml = readFile(filename, "t");
        if (!aiml) {
            print("Failed to read the file: " + filename);
            continue;
        }
        
        chatbotaiml = aimlToChatbot(aiml);
        if (!chatbotaiml) {
            print("Failed to parse the aiml file: " + filename);
            continue;
        }
        chatbotaiml["bot.id"] = sdchatbot["number"];
        chatbotaiml["id"] = getAimlId();
        chatbotaiml.doInsert();
    }
    
    vars["$G.chatbotaiml.importing"] = false;
}

//exportBotAiml("SDCB10001", "C:/SM/AIML/test/");
//importBotAiml("C:/SM/AIML/test/SDCB10001", ["SDCBAIML10001.aiml"]);

/**
 *  Get the aiml content array from sdcchatbot 
 *  Parameter bot: the record of sdcchatbot
 *  Return the aiml content array of all sdcchatbotaiml of sdchatbot
 */
function getBotAimlContentArray(bot) {
    return getBotAimlContentArrayById(bot['number']);
}

function getBotAimlContentArrayByName(name, language) {
    var bot = lib.EndUserChat.getChatbotByName(name, language);
    if (bot) {
        return getBotAimlContentArrayById(bot['number']);
    }
    
    return [];
}

/**
 *  Get the aiml content array from sdcchatbot 
 *  Parameter botid: the id of sdcchatbot
 *  Return the aiml content array of all sdcchatbotaiml of sdchatbot
 */
function getBotAimlContentArrayById(botid) {
    var aimlContentArray = [];
    var jsonArray = getBotAimlJsonArray(botid);
    
    var i;
    var aimlContent = '';
    for (i=0; i<jsonArray.length; i++) {
        aimlContent = getBotAimlContentFromJson(jsonArray[i]);
        aimlContentArray.push(aimlContent);
    }
    
    return aimlContentArray;
}

/**
 *  Get the aiml content from sdcchatbotaiml json object
 *  Parameter aimlJson: the json object of sdcchatbotaiml
 *  Return the aiml content of sdcchatbotaiml
 */
function getBotAimlContentFromJson(aimlJson, formatted) {
    var aimlContent = '';
    var linebreak = '';
    if (formatted) {
        linebreak = '\n';
    }
    aimlContent = '<?xml version="1.0" encoding="UTF-8"?>' + linebreak;
    aimlContent += '<aiml>' + linebreak;
    aimlContent += '<category name="' + aimlJson["id"] + '">' + linebreak;
    aimlContent += '<pattern>' + aimlJson["pattern"] + '</pattern>' + linebreak;
    if (aimlJson["topic"]) {
        aimlContent += '<topic>' + aimlJson["topic"] + '</topic>' + linebreak;
    }
    if (aimlJson["that"]) {
        aimlContent += '<that>' + aimlJson["that"] + '</that>' + linebreak;
    }
    aimlContent += '<template>' + aimlJson["template"] + '</template>' + linebreak;
    aimlContent += '</category>' + linebreak;
    aimlContent += '</aiml>';
    
    return aimlContent;
}

/**
 *  Get the json object array from sdcchatbotaiml file objects of one sdchatbot
 *  Parameter botid: the id of sdchatbot
 *  Return json object array of sdcchatbotaiml
 */
function getBotAimlJsonArray(botid) {
    var jsonArray = [];
    var aiml = new SCFile("sdchatbotaiml", SCFILE_READONLY);
    var sql = "bot.id=\"" + botid + "\"";
    var body;
    var i;
    var rc = aiml.doSelect(sql);
    while (rc === RC_SUCCESS) {
        body = getBotAimlJson(aiml);
        jsonArray.push(body);
            
        rc = aiml.getNext();
    }
    
    return jsonArray;
}

/**
 *  Get the json object from sdcchatbotaiml file object
 *  Parameter aiml: the sdcchatbotaiml file object
 *  Return json object of sdcchatbotaiml
 */
function getBotAimlJson(aiml) {
    var body = {};
    var topic = _null(aiml['topic.pattern']) ? "" : aiml['topic.pattern'];
    var tmpContent = "";
    var i;
    for (i = 0; i < system.functions.lng(aiml['template']); i++) {
        tmpContent += aiml['template'][i] + "\n";
    }
    body['id'] = aiml['id'];
    body['pattern'] = getContent(aiml['input.pattern'], aiml['input.pattern.match.type']);
    body['that'] = getContent(aiml['that.pattern'], aiml['that.pattern.match.type']);
    if (body['that'] == '*') {
        body['that'] = undefined;
    }
    body['topic'] = topic;
    body['template'] = tmpContent;
    
    return body;
}

function getContent(content, matchType) {
    var finalContent = content;
    switch (matchType) {
        case 'startswith':
            finalContent = content + " ^";
            break;
        case 'endswith':
            finalContent = "^ " + content;
            break;
        case 'contains':
            finalContent = "^ " + content + " ^";
            break;
            //case 'exact' :
            //finalContent=content;
            //break;
        case 'anyword':
            finalContent = "*";
            break;
    }
    return finalContent;
}

/**
 *  Convert aiml content to sdchatbotaiml file object
 */
function aimlToChatbot(aiml) {
    if (!aiml) {
        return null;
    }
    
    var pattern = lib.AIMLParser.getAimlTagContent(aiml, "pattern");
    var topic = lib.AIMLParser.getAimlTagContent(aiml, "topic");
    var that = lib.AIMLParser.getAimlTagContent(aiml, "that");
    var template = lib.AIMLParser.getAimlTagContent(aiml, "template");
    
    var chatbotaiml = new SCFile("sdchatbotaiml");
    var contentandtype = getBotAimlContentAndMatchType(pattern);
    chatbotaiml["input.pattern.match.type"] = contentandtype[1];
    chatbotaiml["input.pattern"] = contentandtype[0];
    chatbotaiml["topic.pattern"] = topic == "*" ? "" : topic;
    contentandtype = getBotAimlContentAndMatchType(that);
    chatbotaiml["that.pattern.match.type"] = contentandtype[1];
    chatbotaiml["that.pattern"] = contentandtype[0];
    chatbotaiml["template"] = template.split("\n");
    
    return chatbotaiml;
}

/**
 *  Return the match type of bot aiml from the content
 *  When start with "^ "  and end with " ^", type is "contains"
 *  When start with "^ ", type is "endswith"
 *  When end with " ^", type is "startswith"
 *  When content is only "*", type is "anyword"
 *  Other is "exact"
 *  Refer to the function getContent.
 */
function getBotAimlMatchType(content) {
    return getBotAimlContentAndMatchType(content)[1];
}

/**
 *  Return one array with two elements:
 *      element 1: the content after trimming wildcard character
 *      element 2: the match type
 */
function getBotAimlContentAndMatchType(content) {
    if (!content) {
        return ["", "anyword"];
    }
    
    var matchType = "exact";
    var prefixWildcard = "^ ";
    var suffixWildcard = " ^";
    var isPrefixWildcard = content.length >= prefixWildcard.length && content.indexOf(prefixWildcard) == 0;
    var isSuffixWildcard = content.length >= suffixWildcard.length && content.indexOf(suffixWildcard) == content.length - suffixWildcard.length;
    if (isPrefixWildcard && isSuffixWildcard) {
        matchType = "contains";
        content = content.substring(prefixWildcard.length, content.length - suffixWildcard.length);
    } else {
        if (isPrefixWildcard) {
            matchType = "endswith";
            content = content.substring(prefixWildcard.length);
        } else if (isSuffixWildcard) {
            matchType = "startswith";
            content = content.substring(0, content.length - suffixWildcard.length);
        } else if (content == "*") {
            matchType = "anyword";
            content = "";
        }
    }
    
    return [content, matchType];
}

function pushToChatService(request, boId) {
    var chatService = lib.settings.getSettingValue("Collaboration", "chatservicedomainport");

    var httpHeaders = new Array();

    var contentHeader = new Header();
    contentHeader.name = "Content-Type";
    contentHeader.value = "application/json";
    httpHeaders.push(contentHeader);
    var authHeader = new Header();
    authHeader.name = "Cookie";
    var token = getLwssoToken(system.functions.operator()); //
    authHeader.value = "LWSSO_COOKIE_KEY=" + token;

    httpHeaders.push(authHeader);

    var url = chatService + "api/botaiml/" + boId;

    var requestBody = request;

    try {
        var response = doHTTPRequest("POST", url, httpHeaders, requestBody);
        if (response.indexOf("200 OK") > 0) {
            msg(scmsg("AIML.publish.success", "AIML"), 1);
        }
    }
    catch (ex) {
        print("Exception for connecting chat service: " + ex);
    }
}