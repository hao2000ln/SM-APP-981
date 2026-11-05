/**
 *  JSON format:
 *    {
 *      "name" : "<name>", // AIML tag name, for example, category, pattern, template, li, etc.
 *      "attributes" : {
 *                        "name" : "<name>", // AIML tag attribute "name"
 *                        "value" : "<value>" // AIML tag attribute "value"
 *                     },
 *      "text" : "<text>", // AIML tag value, maybe empty
 *      "children" : [] // children tags, every element is a child with this json structure
 *                         the array always exists even if there is no child.
 *    }
 */
function aiml2Json(aiml, language) {
    if (!aiml) {
        return {};
    }
    
    var aimlObj = aiml;
    if (typeof(aiml) == "string") {
        var xml = new XML();
        aimlObj = xml.setContent(aiml);
    }
    
    var json = parseNode2Json(aimlObj, language);
    
    return json;
}

var excludedTagMapping = {
                             "template" : ["think"],
                         }

/**
 *  Convert xml node to json
 */
function parseNode2Json(node, language) {
    var json = null;
    var name;
    var attributeName;
    var attributeValue;
    var text;
    if (node) {
        json = {};
        name = node.getName();
        name = !name ? "" : name.trim();
        json["name"] = name;
        
        json["attributes"] = {};
        attributeName = node.getAttributeValue("name");
        if (attributeName) {
            json["attributes"]["name"] = attributeName.trim();
        }
        
        attributeValue = node.getAttributeValue("value");
        if (attributeValue) {
            json["attributes"]["value"] = attributeValue.trim();
        }
        
        //if (name != "template" && name != "srai" && name != "set" && name != "get") {
        //    text = node.getValue();
        //} else {
        text = getNodeText(node, excludedTagMapping[name], language);
        //}
        if (text && text.trim()) {
            json["text"] = text.trim();
        }
        
        var childNode = node.getFirstChildElement();
        json["children"] = [];
        
        var childJson;
        while (childNode) {
            childJson = parseNode2Json(childNode, language);
            if (childJson) {
                json["children"].push(childJson);
            }
            childNode = childNode.getNextSiblingElement();
        }
    }
    
    return json;
}

// the tags need to convert upper case
var fieldsToUpperCase = ["pattern", "that"];

/**
 *  Return the text of node including all its children nodes tag and contents.
 *  Parameter:
 *      node: xml node
 *      excludeTags: the tags can be trimmed under this node
 *      language: the language to get message; when language is null, do not get message
 */
function getNodeText(node, excludedTags, language) {
    var text = node.toXMLString().trim();
    
    text = replaceTextReturnCharacter(text);
    var nodename = node.getName();
    // remove the tag itself
    text = text.replace(new RegExp("<" + nodename + ">"), "");            // <tag>
    text = text.replace(new RegExp("<" + nodename + "\\s+[^</]+>"), "");  // <tag name="xxx">
    text = text.replace(new RegExp("</" + nodename + ">"), "");           // </tag>
    text = text.replace(new RegExp("<" + nodename + "/>"), "");           // <tag/>
    text = text.replace(new RegExp("<" + nodename + "\\s+[^</]+/>"), ""); // <tag name="xxx"/>
    
    
    if (!excludedTags) {
        excludedTags = [];
    }
    
    var i;
    for (i=0; i<excludedTags.length; i++) {
        let regex1 = new RegExp("<" + excludedTags[i] + "(\\s+[^</]+)*>.*</" + excludedTags[i] + ">", "g");
        let regex2 = new RegExp("<" + excludedTags[i] + "(\\s+[^</]+)*\\s*/>", "g");
        text = text.replace(regex1, "");
        text = text.replace(regex2, "");
    }
    
    text = replaceMessage(text, language, fieldsToUpperCase.includes(nodename));
    
    if (fieldsToUpperCase.includes(nodename)) { // regex pattern field: pattern and that
        text = escapeRegexCharacters(text);
    }
    
    text = recoverTextReturnCharacter(text);
    
    return text;
}

/**
 *  Replace the content of SM_MESSAGE by scmessage of class msteams
 *  Parameter:
 *      text: the string to replace
 *      language: the language to get scmessage; when language is null, do not get message
 *      toUpper: whether convert the return string to upper case
 */
function replaceMessage(text, language, toUpper) {
    if (!language) {
        return text;
    }
    
    toUpper = toUpper || false;
    text = text.replace(/SM_MESSAGE\(\s*([0-9a-zA-Z_]+)\s*\)/g,
                    function($1, $2) {
                        var message = lib.localizeTable.getLocalizedMessageText(language, "msteams", $2);
                        return message.length>0 ? message : $1;
                    });
    return toUpper ? text.toUpperCase() : text;
}

/**
 *  Escape the character of regular expression for pattern and that expression
 */
function escapeRegexCharacters(text) {
    var regexCharacters = ["[", "]"];
    if (text) {
        var i;
        for (i=0; i<regexCharacters.length; i++) {
            text = text.replace(new RegExp("\\" + regexCharacters[i], "g"), "\\" + regexCharacters[i]);
        }
    }
    return text;
}

function replaceTextReturnCharacter(text) {
    text = text.replace(/\n/g, "@@BR@@");
    text = text.replace(/\n\r|\r\n/g, "%%BR%%");
    return text;
}

function recoverTextReturnCharacter(text) {
    text = text.replace(/@@BR@@/g, "\n");
    text = text.replace(/%%BR%%/g, "\r\n");
    return text;
}

// replace multiline text by string with regexp matching
function replaceTextMultiline(text, regexp, string) {
    text = replaceTextReturnCharacter(text);
    text = text.replace(regexp, string);
    text = recoverTextReturnCharacter(text);
    return text;
}

function getAimlTagContent(aiml, tag) {
    var text = aiml.trim();
    text = text.replace(/\n/g, "@@BR@@");
    text = text.replace(/\n\r|\r\n/g, "%%BR%%");
    var index1 = text.indexOf("<" + tag);
    var index2 = text.indexOf("</" + tag + ">");
    if (index1<0 || index2<0) {
        return "";
    }
    text = text.substring(index1, index2);
    text = text.replace(/^<[^<>]*>/, "");
    text = text.trim();
    text = text.replace(/@@BR@@/g, "\n");
    text = text.replace(/%%BR%%/g, "\n");
    
    return text;
}
