var logger = getLog("VirtualAgentInterpreter");

// The elements of domArray are aiml raw contents
var domArray;
var domArrayIndex;
// localizedDomArrayJson = {<language> : [{aiml dom json}]}
var localizedDomArrayJson;

var isAIMLFileLoaded;
var forceReload;

var interpreterQueue;

var isDebug;


//botAttributes contain things like name, age, master, gender...
var AIMLInterpreter = function(botAttributesParam) {
    var self = this;
    this.botAttributes = botAttributesParam || {};

    this.storedVariableValues = {};

    this.lastWildCardValue = '';
    this.wildCardArray = [];

    //indexOfSetTagAmountWithWildCard indicates how many sets with wildcard occur so that those sets store the correct wildcard value
    this.indexOfSetTagAmountWithWildCard = 0;

    this.previousAnswer = '';

    this.categoryStack = [];

    // ----------- Process parameters below -----------------------------

    // recover the json string of parameters of the old interpreter
    this.setParameterString = function(parametersString) {
        if (!parametersString) {
            return;
        }

        var parametersJson = JSON.parse(parametersString);
        this.setParameterJson(parametersJson);
    };

    // recover the json of parameters of the old interpreter
    this.setParameterJson = function(parametersJson) {
        if (isDebugEnabled()) {
            debug("[function] setParameterJson: " + (parametersJson ? JSON.stringify(parametersJson) : "NULL"));
        }

        if (!parametersJson) {
            return;
        }

        if (parametersJson["storedVariableValues"]) {
            this.storedVariableValues = Object.assign(this.storedVariableValues, parametersJson["storedVariableValues"]);
        }

        if (parametersJson["previousAnswer"]) {
            this.previousAnswer = parametersJson["previousAnswer"];
        }
    };

    // return the json string of the current parameters
    this.getParameterString = function() {
        return JSON.stringify(this.getParameterJson());
    };

    // return the json object of the current parameters
    this.getParameterJson = function() {
        return {
            "storedVariableValues": this.storedVariableValues,
            "wildCardArray": this.wildCardArray,
            "lastWildCardValue": this.lastWildCardValue,
            "indexOfSetTagAmountWithWildCard": this.indexOfSetTagAmountWithWildCard,
            "previousAnswer": this.previousAnswer
        };
    };

    this.initializeVariables = function() {
        this.storedVariableValues["smLoginUser"] = this.botAttributes["operator"];
        this.storedVariableValues["smLoginUserFullName"] = lib.operatorUtil.getFullName(this.botAttributes["operator"]);
        this.storedVariableValues["smBotId"] = this.botAttributes["botid"];
    };

    // ----------- Process parameters above -----------------------------

    // Initial dom 
    this.initializeDom = function() {
        domArray = [];
        domArrayIndex = 0;
        localizedDomArrayJson = {};
    };

    // Get the localized dom
    // When the dom array for this language doesn't exist, load aiml content array of bot to convert
    this.getLocalizedDom = function(index, language) {
        if (isDebugEnabled()) {
            debug("[function] getLocalizedDom");
            debug("index=" + index);
            debug("language=" + language);
        }

        if (index < 0 || index >= domArrayIndex) {
            return null;
        }

        // default language is en
        language = language || "en";

        if (!localizedDomArrayJson[language]) {
            this.loadAIMLContentArrayIntoLocalizedArray(domArray, language);
        }

        return localizedDomArrayJson[language][index];
    };

    // ----------- Load AIML below -----------------------------

    // Load aiml files into dom array
    this.loadAIMLFilesIntoArray = function(fileArray) {
        if (!forceReload && isAIMLFileLoaded) {
            return;
        }

        this.initializeDom();

        var fileIndex = 0;
        for (fileIndex = 0; fileIndex < fileArray.length; fileIndex++) {
            if (funcs.isfileexist(fileArray[fileIndex], 1)) {
                this.loadAIMLContentIntoArray(readFile(fileArray[fileIndex], "t")); // parse xml to json
            }
        }

        isAIMLFileLoaded = true;

        if (forceReload) {
            forceReload = false;
        }
    };

    // Load aiml content array into dom array
    this.loadAIMLContentArrayIntoArray = function(aimlContentArray) {
        if (!forceReload && isAIMLFileLoaded) {
            return;
        }

        this.initializeDom();

        var aimlIndex = 0;
        var dom;
        for (aimlIndex = 0; aimlIndex < aimlContentArray.length; aimlIndex++) {
            this.loadAIMLContentIntoArray(aimlContentArray[aimlIndex]); // parse xml to json
        }

        isAIMLFileLoaded = true;

        if (forceReload) {
            forceReload = false;
        }
    };

    // Load aiml content into dom array
    this.loadAIMLContentIntoArray = function(aimlContent) {
        if (!aimlContent) {
            return;
        }
        //var dom = lib.AIMLParser.aiml2Json(aimlContent);
        //debug("dom=" + (dom ? JSON.stringify(dom) : "NULL"));
        domArray[domArrayIndex] = aimlContent;
        domArrayIndex++;
        // default language is en
        this.loadAIMLContentIntoLocalizedArray(aimlContent, this.storedVariableValues["language"] || "en");
    };

    // load aiml content array and convert them to localized to localized dom array json
    // When the localized dom array exists for the language, return it directly without loading
    this.loadAIMLContentArrayIntoLocalizedArray = function(aimlContentArray, language) {
        if (isDebugEnabled()) {
            debug("[function] loadAIMLContentArrayIntoLocalizedArray");
            debug("language=" + language);
        }

        if (localizedDomArrayJson[language]) {
            return;
        }

        localizedDomArrayJson[language] = [];
        var aimlIndex = 0;
        for (aimlIndex = 0; aimlIndex < aimlContentArray.length; aimlIndex++) {
            this.loadAIMLContentIntoLocalizedArray(aimlContentArray[aimlIndex], language); // parse xml to localized json
        }
    };

    // load aiml content and convert it to localized into localized dom array json
    this.loadAIMLContentIntoLocalizedArray = function(aimlContent, language) {
        if (isDebugEnabled()) {
            debug("[function] loadAIMLContentIntoLocalizedArray");
        }

        if (!language) {
            return;
        }

        var localizedDom = lib.AIMLParser.aiml2Json(aimlContent, language);
        if (isDebugEnabled()) {
            debug("localizedDom=" + (localizedDom ? JSON.stringify(localizedDom) : "NULL"));
        }

        if (!localizedDomArrayJson[language]) {
            localizedDomArrayJson[language] = [];
        }
        localizedDomArrayJson[language].push(localizedDom);
    };

    // ----------- Load AIML above -----------------------------

    // main function
    // find answer from loaded aiml (dom array)
    // return found text
    this.findAnswerInLoadedAIML = function(clientInput, cb) {
        if (isDebugEnabled()) {
            debug("[function] findAnswerInLoadedAIML clientInput: " + clientInput);
        }

        if (!clientInput) {
            return "Invalid input.";
        }

        //check if all AIML files have been loaded. If not, call this method again after a delay
        if (isAIMLFileLoaded) {
            //clientInput = clientInput.toUpperCase();
            this.wildCardArray = [];
            this.indexOfSetTagAmountWithWildCard = 0;

            this.categoryStack = [];

            var result;
            var foundResult = null;
            var i;
            for (i = 0; i < domArray.length; i++) {
                if (isDebugEnabled()) {
                    debug("domArray index=" + i);
                }
                let localizedDom = this.getLocalizedDom(i, this.storedVariableValues["language"]);
                if (!localizedDom) {
                    continue;
                }

                if (isDebugEnabled()) {
                    debug("localizedDom=" + JSON.stringify(localizedDom));
                }

                this.cleanDom(localizedDom.children);

                result = this.searchCorrectCategory(clientInput, localizedDom.children, i);
                if (isDebugEnabled()) {
                    debug("dom searched result=" + (result ? JSON.stringify(result) : "NULL"));
                }
                if (result != null && result[1] != null) {
                    if (foundResult && this.comparePatternPriority(foundResult[1], result[1], foundResult[2], result[2])) {
                        continue;
                    }

                    if (!foundResult) {
                        foundResult = ["", "", false];
                    }

                    foundResult[0] = result[0]; // found text
                    foundResult[1] = result[1]; // found pattern text
                    foundResult[2] = result[2]; // found that
                }
            }

            var foundText = '';

            if (isDebugEnabled()) {
                debug("foundResult=" + (foundResult ? JSON.stringify(foundResult) : "NULL"));
            }

            if (foundResult) {
                foundText = foundResult[0];
                //foundText = this.cleanStringFormatCharacters(foundText);
                this.previousAnswer = foundText.trim();
                if (isDebugEnabled()) {
                    debug("this.previousAnswer found=" + this.previousAnswer);
                }
                this.previousAnswer = this.trimSMJS(this.previousAnswer);
                if (isDebugEnabled()) {
                    debug("this.previousAnswer processed=" + this.previousAnswer);
                }
            }

            if (isDebugEnabled()) {
                debug("foundText=" + foundText);
            }
            foundText = this.trimSMJSPrefixSuffix(foundText);
            if (isDebugEnabled()) {
                debug("foundText trimmed=" + foundText);
            }

            if (cb) {
                return cb(foundText, this.wildCardArray, clientInput);
            } else {
                return foundText;
            }
        } else {
            return "Virtual Agent is offline.";
        }
    };


    // remove string control characters (like line-breaks '\r\n', leading / trailing spaces etc.)
    this.cleanStringFormatCharacters = function(str) {
        if (isDebugEnabled()) {
            debug("[function] cleanStringFormatCharacters str: " + str);
        }
        var cleanedStr = str.replace(/\r\n/gi, '');
        cleanedStr = cleanedStr.replace(/^\s*/, '');
        cleanedStr = cleanedStr.replace(/\s*$/, '');

        return cleanedStr;
    };

    this.cleanDom = function(childNodes) {
        if (isDebugEnabled()) {
            debug("[function] cleanDom");
        }
        var i;
        for (i = 0; i < childNodes.length; i++) {
            if (childNodes[i].text && typeof(childNodes[i].text) === 'string') {

                // remove all nodes of type 'text' when they just contain '\r\n'. This indicates line break in the AIML file
                if (childNodes[i].text.match(/^\s*\r\n\s*$/gi)) {
                    childNodes.splice(i, 1);
                }
            }
        }


        // traverse through whole tree by recursive calls
        var j;
        for (j = 0; j < childNodes.length; j++) {
            if (childNodes[j].children) {
                this.cleanDom(childNodes[j].children);
            }
        }
    };

    /**
     *  find the text by checking all categories
     *  Parameters: clientInput - user input string
     *              domCategories - category array from the category node of dom element
     *              domIndex - the index of dom element in dom array
     *              equalMatch - use equal or regex to match pattern, default is false
     *                           true:  match when equal
     *                           false: use regex to match
     *  return one array: [found text, the pattern matched the found text, whether that matched (true/false)]
     *  nothing found return [null, null, null]             
     */
    this.searchCorrectCategory = function(clientInput, domCategories, domIndex, equalMatch) {
        if (isDebugEnabled()) {
            debug("[function] searchCorrectCategory");
        }

        equalMatch = equalMatch || false; // default is false, true means match equal
        if (isDebugEnabled()) {
            debug("equalMatch=" + equalMatch);
        }

        var domLength = domArray.length;
        var categoryIndex = -1;

        var foundText = "";
        var foundPattern = null;
        var foundThat = false;
        var i;
        var j;
        for (i = 0; i < domCategories.length; i++) {
            if (isDebugEnabled()) {
                debug("domCategories i=" + i);
                debug("domCategory=" + (domCategories[i] ? JSON.stringify(domCategories[i]) : "NULL"));
            }
            if (domCategories[i].name !== 'category') { // not category, skip
                continue;
            }

            categoryIndex = domIndex * domLength + i;
            if (this.categoryStack.includes(categoryIndex)) { // avoid re-loop category
                if (isDebugEnabled()) {
                    debug("loop duplicate category");
                }
                continue;
            }

            let childNodes = domCategories[i].children;
            if (isDebugEnabled()) {
                debug("childNodes=" + (childNodes ? JSON.stringify(childNodes) : "NULL"));
            }
            for (j = 0; j < childNodes.length; j++) {
                if (childNodes[j].name === 'pattern') {
                    let pattern = this.resolveChildNodesInPatternNode(childNodes[j].children, childNodes[j].text); // parse pattern text

                    if (!pattern) {
                        continue;
                    }

                    pattern = pattern.toUpperCase();

                    if (isDebugEnabled()) {
                        debug("clientInput=" + clientInput);
                        debug("pattern=" + pattern);
                    }

                    //check if the input of the user matches the pattern text
                    let matches = equalMatch ? clientInput.toUpperCase() === pattern : this.checkIfMessageMatchesPattern(clientInput, pattern);
                    if (isDebugEnabled()) {
                        debug("matches=" + matches);
                    }
                    if (matches) {
                        //check if a 'that' tag is existing. If yes, check if the text of the that tag matches the previous given answer.
                        //If it does not match, continue the loop through the AIML file
                        let matchingThatValue = this.checkForThatMatching(childNodes);
                        let isMatchingThat = matchingThatValue > 0; // that matched
                        if (isDebugEnabled()) {
                            debug("isMatchingThat=" + isMatchingThat);
                            debug("foundPattern=" + foundPattern);
                        }

                        // this matched pattern is lower priority than the found pattern
                        if (foundPattern != null && this.comparePatternPriority(foundPattern, pattern, foundThat, isMatchingThat)) {
                            continue;
                        }

                        if (matchingThatValue >= 0) { //  both matched for that matched and no that existing
                            this.categoryStack.push(categoryIndex); // store the current category before find
                            let text = this.searchFinalTextInTemplateNode(childNodes);
                            if (isDebugEnabled()) {
                                debug("searched text=" + text);
                            }
                            if (text) {
                                foundPattern = pattern;
                                foundText = text;
                                foundThat = isMatchingThat;
                            }

                            this.categoryStack.pop(); // remove the current category after find
                            //break;   // cannot break because we don't know if this match is highest priority unless loop all
                        }
                    }
                }
            }
        }

        if (foundPattern != null) {
            if (isDebugEnabled()) {
                debug("this.storedVariableValues after found=" + JSON.stringify(this.storedVariableValues));
            }
            return [foundText, foundPattern, foundThat];
        }

        return [null, null, null];
    };

    // return -1  -  that exists but not matched
    //         0  -  no that
    //         1  -  that exists and matched
    this.checkForThatMatching = function(categoryChildNodes) {
        if (isDebugEnabled()) {
            debug("[function] checkForThatMatching categoryChildNodes: " + (categoryChildNodes ? JSON.stringify(categoryChildNodes) : "NULL"));
        }
        var i;
        for (i = 0; i < categoryChildNodes.length; i++) {
            if (categoryChildNodes[i].name === 'that') {
                //if the previous answer of the bot does not match the that-tag text, then return undefined!
                /*
                if (categoryChildNodes[i].text != this.previousAnswer) {
                    return false;
                } else {
                    return true;
                }*/
                // enhance to match that-tag by Regex
                if (isDebugEnabled()) {
                    debug("categoryChildNodes[i]=" + JSON.stringify(categoryChildNodes[i]));
                    debug("this.previousAnswer=" + this.previousAnswer);
                }
                if (this.checkIfMessageMatchesPattern(this.previousAnswer, categoryChildNodes[i].text, true)) {
                    return 1; // found that and matched
                }

                return -1; // found that and but not matched
            }
        }
        //if no that tag was found, no that match
        return 0;
    };

    /**
     *  resolve the pattern node text
     *  return the text after resoved
     */
    this.resolveChildNodesInPatternNode = function(patternChildNodes, patternText) {
        if (isDebugEnabled()) {
            debug("[function] resolveChildNodesInPatternNode patternText: " + patternText);
        }
        var text = patternText;
        var notext = false;
        if (!text) {
            notext = true;
        }

        var i;
        var resolvedText;
        for (i = 0; i < patternChildNodes.length; i++) {
            if (patternChildNodes[i].name === 'bot') {
                resolvedText = this.resolveBotNode(patternChildNodes[i], text);
            } else if (patternChildNodes[i].name === 'get') {
                resolvedText = this.resolveGetNode(patternChildNodes[i], text);
            } else if (patternChildNodes[i].name === 'set') {
                resolvedText = this.resolveSetNode(patternChildNodes[i], text);
            } else {
                resolvedText = this.removeUnknownTagText(text, patternChildNodes[i].name);
            }

            text = notext ? text + resolvedText : resolvedText; // concat the resolved text if no text or replace by the resolved text
        }

        return text;
    };

    // clean unuseful tag from template text
    this.cleanTemplateText = function(templateText) {
        if (!templateText) {
            return '';
        }

        templateText = this.replaceResolvedTagText(templateText, 'think', null, '');
        return templateText;
    };

    this.searchFinalTextInTemplateNode = function(childNodesOfCategory) {
        if (isDebugEnabled()) {
            debug("[function] searchFinalTextInTemplateNode");
        }
        var i;
        for (i = 0; i < childNodesOfCategory.length; i++) {
            if (childNodesOfCategory[i].name === 'template') {
                if (childNodesOfCategory[i].children.length == 0) { // template has no child node
                    return childNodesOfCategory[i].text;
                }

                if (isDebugEnabled()) {
                    debug("template text=" + childNodesOfCategory[i].text);
                }
                let templateText = this.cleanTemplateText(childNodesOfCategory[i].text);
                if (isDebugEnabled()) {
                    debug("cleaned template text=" + templateText);
                }
                var text = this.searchFinalTextInTemplateChildrenNodes(childNodesOfCategory[i].children, templateText);

                if (isDebugEnabled()) {
                    debug("template text found=" + text);
                }

                return text;
            }
        }
    };

    this.searchFinalTextInTemplateChildrenNodes = function(childNodesOfTemplate, templateText) {
        if (isDebugEnabled()) {
            debug("[function] searchFinalTextInTemplateChildrenNodes templateText: " + templateText);
        }

        var text = '';

        //traverse through template nodes until final text is found
        //return it then to very beginning
        var i;
        var j;
        var resolvedText;
        var attributeName;
        for (i = 0; i < childNodesOfTemplate.length; i++) {
            if (isDebugEnabled()) {
                debug("childNodesOfTemplate[i]=" + (childNodesOfTemplate[i] ? JSON.stringify(childNodesOfTemplate[i]) : "NULL"));
            }

            resolvedText = '';
            attributeName = null;

            if (childNodesOfTemplate[i].name === 'random') {
                //if random node was found, it's children are 'li' nodes.
                //pick one li node by random and continue dom traversion until final text is found
                let randomNumber = Math.floor(Math.random() * (childNodesOfTemplate[i].children.length));
                resolvedText = this.searchFinalTextInTemplateChildrenNodes([childNodesOfTemplate[i].children[randomNumber]]);
                if (isDebugEnabled()) {
                    debug("random resolved text=" + resolvedText);
                }
            } else if (childNodesOfTemplate[i].name === 'srai') {
                let sraiText = '';
                if (childNodesOfTemplate[i].text) {
                    sraiText = childNodesOfTemplate[i].text;
                }
                let originalSraiText = sraiText;
                sraiText = sraiText.replace(new RegExp("<star/>", "g"), this.lastWildCardValue);
                //if (childNodesOfTemplate[i].children.length>0) {
                //take pattern text of srai node to get answer of another category
                //    sraiText += this.searchFinalTextInTemplateChildrenNodes(childNodesOfTemplate[i].children);
                //}
                sraiText = sraiText.toUpperCase();
                if (isDebugEnabled()) {
                    debug("sraiText=" + sraiText);
                }

                let result;
                let foundResult = null;
                //for-loop to go through all loaded AIML files
                for (j = 0; j < domArray.length; j++) {
                    let localizedDom = this.getLocalizedDom(j, this.storedVariableValues["language"]);
                    if (!localizedDom) {
                        continue;
                    }

                    result = this.searchCorrectCategory(sraiText, localizedDom.children, j, true);
                    //if in one of the dom trees a matching pattern was found, exit this inner loop
                    if (result && result[1]) {
                        if (foundResult && this.comparePatternPriority(foundResult[1], result[1])) {
                            continue;
                        }

                        if (!foundResult) {
                            foundResult = ["", ""];
                        }

                        foundResult[0] = result[0]; // found text
                        foundResult[1] = result[1]; // found pattern text
                    }
                }

                if (foundResult && foundResult[0]) {
                    resolvedText = foundResult[0];
                    if (isDebugEnabled()) {
                        debug("srai resolved text=" + resolvedText);
                    }
                }

                //call searchCorrectCategory again to find the category that belongs to the srai node
                //text += this.searchCorrectCategory(referredPatternText, domCategories);
            } else if (childNodesOfTemplate[i].name === 'li') {
                if (childNodesOfTemplate[i].children.length == 0) { // li has no child node
                    resolvedText = childNodesOfTemplate[i].text;
                } else {
                    resolvedText = this.searchFinalTextInTemplateChildrenNodes(childNodesOfTemplate[i].children, childNodesOfTemplate[i].text);
                }
                if (isDebugEnabled()) {
                    debug("li resolved text=" + resolvedText);
                }
            } else if (childNodesOfTemplate[i].name === 'pattern' || childNodesOfTemplate[i].name === 'that') {

            } else if (childNodesOfTemplate[i].name === 'bot' || childNodesOfTemplate[i].name === 'set' ||
                childNodesOfTemplate[i].name === 'sr' || childNodesOfTemplate[i].name === 'star' ||
                childNodesOfTemplate[i].name === 'condition') {
                resolvedText = this.resolveSpecialNode(childNodesOfTemplate[i]);
                if (childNodesOfTemplate[i].attributes) {
                    attributeName = childNodesOfTemplate[i].attributes.name;
                }
            } else if (childNodesOfTemplate[i].name === 'get') {
                resolvedText = this.resolveSpecialNode(childNodesOfTemplate[i]);
                if (isDebugEnabled()) {
                    debug("get resolved text=" + resolvedText);
                }
                if (childNodesOfTemplate[i].attributes) {
                    attributeName = childNodesOfTemplate[i].attributes.name;
                }
            } else if (childNodesOfTemplate[i].name === 'think') {
                this.searchFinalTextInTemplateChildrenNodes(childNodesOfTemplate[i].children);
            } else if (childNodesOfTemplate[i].name === 'SMJS') {
                resolvedText = this.resolveSMJSNodes(childNodesOfTemplate[i].children);
            } else {
                //this is the text of template node
                //after all special functions (bot, get, set,...) were resolved
                //return that text
                resolvedText = this.resolveSpecialNode(childNodesOfTemplate[i]);
                //if ((t.match('[\\n|\\t]*[^A-Z|^a-z|^!|^?]*')[0] === '') && (t.indexOf('function ()') === -1)) {
                //    return (text);
                //}
            }

            if (isDebugEnabled()) {
                debug("template text before replace=" + templateText);
            }
            if (templateText) {
                if (isDebugEnabled()) {
                    debug("attributeName=" + attributeName);
                }
                templateText = this.replaceResolvedTagText(templateText, childNodesOfTemplate[i].name, attributeName, resolvedText);
                text = templateText;
            } else {
                text += resolvedText;
            }
            if (isDebugEnabled()) {
                debug("template text after replace=" + text);
            }
        }

        return text;
    };

    this.resolveSpecialNodes = function(innerNodes) { // currently only used by resolving condition
        if (isDebugEnabled()) {
            debug("[function] resolveSpecialNodes");
        }

        var text = '';

        var i;
        for (i = 0; i < innerNodes.length; i++) {
            text += this.resolveSpecialNode(innerNodes[i]);
        }

        return text;
    };

    this.resolveSpecialNode = function(innerNode, parentText) {
        if (isDebugEnabled()) {
            debug("[function] resolveSpecialNode innerNodes: " + (innerNode ? JSON.stringify(innerNode) : "NULL"));
            //concatenate string of all node children - normal text, bot tags, get tags, set tags...
            debug("this.storedVariableValues=" + JSON.stringify(this.storedVariableValues));
        }

        var text = '';
        var i;
        var j;

        if (innerNode.name === 'bot') {
            //replace bot tags by the belonging bot attribute value
            text = this.botAttributes[innerNode.attributes.name];
            text = text || "";
        } else if (innerNode.name === 'get') {
            text = this.resolveGetNode(innerNode, parentText);
        } else if (innerNode.name === 'set') {
            text = this.resolveSetNode(innerNode, parentText);
        } else if (innerNode.name === 'sr') { //??
            let result;

            let foundResult = null;

            //for-loop to go through all loaded AIML files
            for (j = 0; j < domArray.length; j++) {
                let localizedDom = this.getLocalizedDom(j, this.storedVariableValues["language"]);
                if (!localizedDom) {
                    continue;
                }

                result = this.searchCorrectCategory(this.lastWildCardValue, localizedDom.children, j, true);
                //if in one of the dom trees a matching pattern was found, exit this inner loop
                if (result && result[1]) {
                    if (foundResult && this.comparePatternPriority(foundResult[1], result[1])) {
                        continue;
                    }

                    if (!foundResult) {
                        foundResult = ["", ""];
                    }

                    foundResult[0] = result[0]; // found text
                    foundResult[1] = result[1]; // found pattern text
                }
            }
            if (foundResult && foundResult[0]) {
                text = foundResult[0];
            }
        } else if (innerNode.name === 'star') {
            text = this.resolveStarNode(innerNode, parentText);
        } else if (innerNode.name === 'condition') {
            if (isDebugEnabled()) {
                debug("resolve condition name=" + innerNode.attributes.name);
                debug("resolve condition value=" + innerNode.attributes.value);
            }

            let child;
            let c;

            // condition tag specification: list condition tag
            if (innerNode.attributes.name === undefined) {
                if (isDebugEnabled()) {
                    debug("resolve condition name");
                }
                for (c in innerNode.children) {
                    child = innerNode.children[c];
                    if (child.name === 'li') {
                        if (child.attributes.value == undefined ||
                            this.storedVariableValues[child.attributes.name] === child.attributes.value.toUpperCase()) {
                            return this.searchFinalTextInTemplateChildrenNodes(child.children);
                        }
                    }
                }
            }
            // condition tag specification: multi condition tag
            else if (innerNode.attributes.value !== undefined) {
                if (isDebugEnabled()) {
                    debug("resolve condition value");
                }
                if (this.storedVariableValues[innerNode.attributes.name] === innerNode.attributes.value.toUpperCase()) {
                    text = this.resolveSpecialNodes(innerNode.children);
                }
            }
            // condition tag specification: single name list condition tags
            else {
                if (isDebugEnabled()) {
                    debug("resolve li");
                }
                let found = false;
                for (c in innerNode.children) {
                    child = innerNode.children[c];
                    if (isDebugEnabled()) {
                        debug("resolve li name=" + child.name);
                    }
                    if (child.name === 'li') {
                        if (isDebugEnabled()) {
                            debug("resolve li value=" + child.attributes.value);
                        }
                        if (child.attributes.value === undefined || (this.storedVariableValues[innerNode.attributes.name] != null &&
                                (child.attributes.value == "*" || this.storedVariableValues[innerNode.attributes.name].toString().toUpperCase() === child.attributes.value.toUpperCase().trim()))) {
                            if (child.attributes.value !== undefined) {
                                found = true; // set found to true when the value of li is not undefined
                            } else if (found) {
                                continue; // skip the undefined value of li if other value of li is found
                            }

                            if (child.children.length == 0 && child.text) {
                                text = child.text;
                            } else if (child.children.length > 0) {
                                text = this.searchFinalTextInTemplateChildrenNodes(child.children, child.text);
                            }

                            // * is the last choice
                            if (child.attributes.value !== undefined && child.attributes.value != "*") {
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            //normal text (no special tag)
            text = innerNode.text;
        }

        //if (text) {
        //text = this.cleanStringFormatCharacters(text);
        //}
        return text;
    };

    // replace the tag in text by the resolved text
    this.replaceResolvedTagText = function(text, tagname, variableName, resolvedText) {
        if (isDebugEnabled()) {
            debug("[function] replaceResolvedTagText");
            debug("text=" + text);
            debug("tagname=" + tagname);
            debug("variableName=" + variableName);
            debug("resolvedText=" + resolvedText);
        }

        if (!resolvedText) {
            resolvedText = '';
        }

        var startindex;
        var endindex;
        if (variableName) {
            //text = text.replace(new RegExp('<' + tagname + '\\s+name\\s*=\\s*"' + variableName + '"\\s*>.*</' + tagname + '>', 'g'), resolvedText);
            startindex = text.indexOf('<' + tagname + ' name="' + variableName + '">');
            if (startindex >= 0) {
                endindex = text.indexOf('</' + tagname + '>', startindex);
                if (endindex >= 0) {
                    text = text.substring(0, startindex) + resolvedText + text.substring(endindex + 3 + tagname.length);
                }
            }
            //text = lib.AIMLParser.replaceTextMultiline(text, new RegExp('<' + tagname + '\\s+name\\s*=\\s*"' + variableName + '"\\s*>.*</' + tagname + '>', 'g'), resolvedText);
            text = text.replace(new RegExp('<' + tagname + '\\s+name\\s*=\\s*"' + variableName + '"\\s*/>', 'g'), resolvedText);
        } else {
            text = text.replace(new RegExp('<' + tagname + '/>', 'g'), resolvedText);
            //text = lib.AIMLParser.replaceTextMultiline(text, new RegExp('<' + tagname + '/>', 'g'), resolvedText);
            startindex = text.indexOf('<' + tagname + '>');
            if (startindex >= 0) {
                endindex = text.indexOf('</' + tagname + '>', startindex);
                if (endindex >= 0) {
                    text = text.substring(0, startindex) + resolvedText + text.substring(endindex + 3 + tagname.length);
                }
            }
            //text = text.replace(new RegExp('<' + tagname + '>.*</' + tagname + '>', 'g'), resolvedText);
            //text = lib.AIMLParser.replaceTextMultiline(text, new RegExp('<' + tagname + '>.*</' + tagname + '>', 'g'), resolvedText);
        }

        if (isDebugEnabled()) {
            debug("resolved tag text=" + text);
        }

        return text;
    };

    // tag is unknown in text, remove the tag from text
    this.removeUnknownTagText = function(text, tagname) {
        if (isDebugEnabled()) {
            debug("[function] removeUnknownTagText");
        }

        if (!text) {
            return '';
        }

        if (text.indexOf(tagname) < 0) {
            return text;
        }

        text = text.replace(new RegExp('<' + tagname + '[^<>]*>.*</' + tagname + '>', 'g'), '');
        text = text.replace(new RegExp('<' + tagname + '[^<>]*/>', 'g'), '');

        return text;
    };

    /** 
     * return the parent text replaced by the variable value in bot node
     * node: the json of bot node
     * parent: the text of parent node
     */
    this.resolveBotNode = function(node, parentText) {
        if (isDebugEnabled()) {
            debug("[function] resolveBotNode");
        }

        var text = this.botAttributes[node.attributes.name];
        if (!text) {
            text = '';
        }
        if (!parentText || parentText.indexOf("<bot ") < 0) {
            return text;
        }

        parentText = this.replaceResolvedTagText(parentText, "bot", node.attributes.name, text);
        return parentText;
    };

    // resolve think node and resolve its child set nodes, always return ''
    this.resolveThinkNode = function(node, parentText) {
        if (isDebugEnabled()) {
            debug("[function] resolveThinkNode");
        }

        var i;
        for (i = 0; i < node.children.length; i++) {
            let childNode = node.children[i];
            if (childNode.name == 'set') { // only process set node
                this.resolveSetNode(childNode, ''); // do not use return text
            }
        }
        return '';
    };

    /** 
     * resolve the set node and return the variable value in set node
     * the name and value of the resolve variable is stored into storedVariableValues
     * node: the json of set node
     * parent: the text of parent node
     */
    this.resolveSetNode = function(node, parentText) {
        if (isDebugEnabled()) {
            debug("[function] resolveSetNode");
        }

        var notext = false; // whether no text content, default text content exists
        var text = node.text; // the text content of set node
        if (isDebugEnabled()) {
            debug("this.wildCardArray=" + this.wildCardArray);
            debug("this.indexOfSetTagAmountWithWildCard=" + this.indexOfSetTagAmountWithWildCard);
        }
        if (text) {
            text = text.trim();
            if (text === '*') {
                //the first set-Tag with wildCard gets the first wildCardValue, the second set-Tag with wildCard gets the second wildCardValue etc.
                if (this.wildCardArray[this.indexOfSetTagAmountWithWildCard]) {
                    this.storedVariableValues[node.attributes.name] = this.wildCardArray[this.indexOfSetTagAmountWithWildCard].trim();
                    this.indexOfSetTagAmountWithWildCard++;
                }
            } else if (node.children.length == 0) { // no child means pure text for set
                this.storedVariableValues[node.attributes.name] = text;
            }
        } else {
            text = '';
            notext = true;
        }

        // the child tag need to be resolved and replaced
        if (node.children.length > 0) {
            var i;
            var resolvedText;
            for (i = 0; i < node.children.length; i++) {
                if (node.children[i].name == 'get') {
                    resolvedText = this.resolveGetNode(node.children[i], text);
                } else if (node.children[i].name == 'star') {
                    resolvedText = this.resolveStarNode(node.children[i], text);
                } else {
                    resolvedText = this.removeUnknownTagText(text, node.children[i].name);
                }

                text = notext ? text + resolvedText : resolvedText; // concat all resolved tag text or replace tag by the resolved text.
            }

            this.storedVariableValues[node.attributes.name] = text;
        }

        return text;
    };

    /** 
     * return the parent text replaced by the variable value in get node
     * node: the json of get node
     * parent: the text of parent node
     */
    this.resolveGetNode = function(node, parentText) {
        if (isDebugEnabled()) {
            debug("[function] resolveGetNode");
        }

        var text = this.storedVariableValues[node.attributes.name];
        if (!text) {
            text = '';
        }

        if (!parentText || parentText.indexOf("<get ") < 0) {
            return text;
        }

        parentText = this.replaceResolvedTagText(parentText, "get", node.attributes.name, text);
        return parentText;
    };

    /** 
     * return the parent text replaced by the value in star node
     * the value is the lastWildCardValue
     * node: the json of star node
     * parent: the text of parent node
     */
    this.resolveStarNode = function(node, parentText) {
        if (isDebugEnabled()) {
            debug("[function] resolveStarNode");
        }

        var text = '';
        if (node && node.name === 'star') {
            text = this.lastWildCardValue;
        }

        if (!parentText || parentText.indexOf("<star/>") < 0) {
            return text;
        }

        parentText = this.replaceResolvedTagText(parentText, "star", null, text);

        return parentText;
    };

    this.resolveSMJSNodes = function(innerNodes) { // innerNodes is the children of tag SMJS
        if (isDebugEnabled()) {
            debug("[function] resolveSMJSNodes");
        }

        this.tempStoredVariableEnabled = true;
        var text = '';
        var methods = {};
        var params = {};
        var i;
        var j;
        var childNode;
        for (i = 0; i < innerNodes.length; i++) {
            if ((innerNodes[i].name === 'JSCALL' || innerNodes[i].name === 'PRECLEAN') && innerNodes[i].text) {
                var libfunc = innerNodes[i].text.split(".");
                if (libfunc.length != 2 && (libfunc.length != 3 || libfunc[0].trim() != "lib")) {
                    return text;
                }
                let functions = [];
                functions.push(libfunc[libfunc.length - 2]);
                functions.push(libfunc[libfunc.length - 1]);
                methods[innerNodes[i].name] = functions;
            } else if (innerNodes[i].name === 'JSPARAMS') {
                for (j = 0; j < innerNodes[i].children.length; j++) {
                    childNode = innerNodes[i].children[j];
                    if (isDebugEnabled()) {
                        debug("JSPARAM node=" + (childNode ? JSON.stringify(childNode) : "NULL"));
                    }
                    if (childNode.name === 'JSPARAM' && childNode.attributes.name) {
                        if (isDebugEnabled()) {
                            debug("JSPARAM  name=" + childNode.attributes.name);
                            debug("JSPARAM  text=" + childNode.text);
                            debug("JSPARAM  children.length=" + childNode.children.length);
                        }
                        if (childNode.children.length == 0 && childNode.text) {
                            if (isDebugEnabled()) {
                                debug("JSPARAM text");
                            }
                            params[childNode.attributes.name] = childNode.text;
                        } else if (childNode.children.length > 0) {
                            var t = this.searchFinalTextInTemplateChildrenNodes(childNode.children, childNode.text);
                            if (isDebugEnabled()) {
                                debug("JSPARAM tag resolved=" + t);
                            }
                            params[childNode.attributes.name] = t;
                        }
                    }
                }
            }
        }

        if (isDebugEnabled()) {
            debug("params=" + JSON.stringify(params));
        }

        var func = methods["PRECLEAN"];
        if (func && func.length == 2 && lib[func[0]] && lib[func[0]][func[1]]) {
            var cleanParameters = lib[func[0]][func[1]]();
            if (cleanParameters) {
                if (isDebugEnabled()) {
                    debug("this.storedVariableValues before clean =" + JSON.stringify(this.storedVariableValues));
                }
                for (j = 0; j < cleanParameters.length; j++) {
                    if (cleanParameters[j].indexOf("%d") >= 0) {
                        let k = 1;
                        while (true) {
                            let fixedCleanParameter = cleanParameters[j].replace(/%d/g, k);
                            if (isDebugEnabled()) {
                                debug("fixedCleanParameter=" + fixedCleanParameter);
                            }
                            if (this.storedVariableValues[fixedCleanParameter] == undefined) {
                                break;
                            } else {
                                this.storedVariableValues[fixedCleanParameter] = undefined;
                            }
                            k++;
                        }
                    } else {
                        if (this.storedVariableValues[cleanParameters[j]]) {
                            this.storedVariableValues[cleanParameters[j]] = undefined;
                        }
                    }
                }
                if (isDebugEnabled()) {
                    debug("this.storedVariableValues after clean =" + JSON.stringify(this.storedVariableValues));
                }
            }
        }

        func = methods["JSCALL"];
        if (func && func.length == 2 && lib[func[0]] && lib[func[0]][func[1]]) {
            if (this.storedVariableValues && this.storedVariableValues["language"]) {
                params["language"] = this.storedVariableValues["language"]; // set language parameter by default
            }
            var executable = 'lib.' + func[0] + '.' + func[1] + '(' + params + ')';
            if (isDebugEnabled()) {
                debug("executable=" + executable);
            }
            var result = null;
            try {
                result = lib[func[0]][func[1]](params);
            } catch (e) {
                logger.error(e);
                logger.error(e.stack);
            }

            if (!result) {
                return this.getSMJSPrefix() + text + this.getSMJSSuffix();
            }

            if (typeof(result) == "object") {
                if (isDebugEnabled()) {
                    debug("JSCALL result object=" + JSON.stringify(result));
                }
                var key;
                for (key in result) { // cannot be cleaned, to do
                    this.storedVariableValues[key] = result[key];
                }
                if (isDebugEnabled()) {
                    debug("this.storedVariableValues after JSCALL=" + JSON.stringify(this.storedVariableValues));
                }
                return "";
            } else {
                text = funcs.str(result);
            }
        }

        return this.getSMJSPrefix() + text + this.getSMJSSuffix();
    };

    this.getSMJSPrefix = function() {
        return "##SMJS##";
    };

    this.getSMJSSuffix = function() {
        return "==SMJS==";
    };

    this.trimSMJSPrefixSuffix = function(str) {
        return str.replace(new RegExp(this.getSMJSPrefix(), "g"), "").replace(new RegExp(this.getSMJSSuffix(), "g"), "");
    };

    this.trimSMJS = function(str) {
        if (!str) {
            return str;
        }

        var prefix = this.getSMJSPrefix();
        var suffix = this.getSMJSSuffix();

        var prefixIndex = str.indexOf(prefix);
        var suffixIndex = str.indexOf(suffix);
        while (prefixIndex >= 0 && suffixIndex >= 0) {
            str = str.substring(0, prefixIndex) + str.substring(suffixIndex + suffix.length);
            prefixIndex = str.indexOf(prefix);
            suffixIndex = str.indexOf(suffix);
        }

        return str;
    };

    this.getHighestPatternPriority = function() {
        return 50;
    };

    this.getLowestPatternPriority = function() {
        return 10;
    };

    this.getEqualPatternPriority = function() {
        return 30;
    };

    this.getThatPatternPriority = function() {
        return 1000;
    };

    this.getPatternPriority = function(patternText) {
        var priority = this.getEqualPatternPriority();
        if (patternText.indexOf("*") >= 0) {
            priority = this.getLowestPatternPriority();
        } else if (patternText.indexOf("^") >= 0) {
            priority = this.getHighestPatternPriority();
        }

        return priority;
    };

    // higher or equal returns true;
    // Parameter isThat for patternText2
    this.comparePatternPriority = function(patternText1, patternText2, isThat1, isThat2) {
        if (isDebugEnabled()) {
            debug("[function] comparePatternPriority");
            debug("compare pattern1=" + patternText1);
            debug("compare pattern2=" + patternText2);
            debug("compare isThat1=" + isThat1);
            debug("compare isThat2=" + isThat2);
        }

        // priority is the sum of pattern priority and that pattern priority
        // that pattern priority is much higher than pattern priority
        var priority1 = this.getPatternPriority(patternText1) + (isThat1 == true ? this.getThatPatternPriority() : 0);
        var priority2 = this.getPatternPriority(patternText2) + (isThat2 == true ? this.getThatPatternPriority() : 0);
        if (isDebugEnabled()) {
            debug("compare priority1=" + priority1);
            debug("compare priority2=" + priority2);
        }
        if (priority1 == priority2) {
            return patternText1.length >= patternText2.length;
        }
        return priority1 >= priority2;
    };

    this.checkIfMessageMatchesPattern = function(userInput, patternText, isThatCheck) {
        if (isDebugEnabled()) {
            debug("[function] checkIfMessageMatchesPattern");
        }

        if (!patternText) {
            return false;
        }

        if (!isThatCheck) {
            isThatCheck = false;
        }

        //convert wildcards in of the pattern node into a regex that matches every char
        if (isDebugEnabled()) {
            debug("patternText=" + patternText);
        }
        var regexPattern = this.convertWildcardToRegex(patternText);
        if (isDebugEnabled()) {
            debug("regexPattern=" + regexPattern);
        }

        //add one with the text in function 'convertWildcardToRegex' here a space is added before and after the user input
        //to prevent false matching
        if (userInput.charAt(0) != " ") {
            userInput = " " + userInput;
        }

        var lastCharacterPosition = userInput.length - 1;
        var lastCharacter = userInput.charAt(lastCharacterPosition);
        if (lastCharacter == '\n') {
            lastCharacter = ' ';
            userInput = userInput.substring(0, userInput.length - 1) + lastCharacter;
        }
        if (lastCharacter != " ") {
            userInput = userInput + " ";
        }

        //match userInput with the regex pattern
        //if it matches, matchedString is defined
        var trimedUserInput = userInput.replace(/\n/g, " ");
        if (isDebugEnabled()) {
            debug("userInput=" + userInput);
            debug("trimedUserInput=" + trimedUserInput);
        }

        var matchedString = trimedUserInput.match(regexPattern);
        if (isDebugEnabled()) {
            debug("matchedString=" + matchedString);
        }

        if (matchedString) {
            /*
            debug("matchedString[0].length="+matchedString[0].length);
            debug("userInput.length="+userInput.length);
            debug("regexPattern.toString()="+regexPattern.toString());
            //the matched pattern must be at least as long as the user input or must contain the regex
            if (matchedString[0].length >= userInput.length || regexPattern.toString().indexOf('[A-Z|0-9|\\s]*[A-Z|0-9|-]*[A-Z|0-9]*[!|,|;|:|.|?|\\s]*') > -1) {
                //if patternText contained a wild card, get the user input that were put into this wild card
                //use original patternText (* is not replaced by regex!)
                var information = this.getWildCardValue(userInput, patternText);
                debug("information="+information);

                return true;
            }*/
            // store wild card value
            if (!isThatCheck) {
                var information = this.getWildCardValue(userInput, patternText);
            }
            return true;
        }

        return false;
    };

    this.convertWildcardToRegex = function(text) {
        //text = text.replace(/\s/g, '\\s+');
        var firstCharacter = text.charAt(0);
        //add a space before and after the pattern text (THIS IS LATER ALSO DONE FOR THE USER INPUT)
        //prevents false matchings
        //e.g. (HI as regex also matches HIM or HISTORY, but <space>HI</space> does only match <space>HI</space>)
        if (firstCharacter != "*") {
            text = " " + text;
        }
        var lastCharacterPosition = text.length - 1;
        var lastCharacter = text.charAt(lastCharacterPosition);

        //replace space before wildcard
        var modifiedText = text.replace(' *', '*');
        //replace wildcard (*) by regex
        modifiedText = modifiedText.replace(/\*|\^|\^\s|\s\^/g, '[A-Z|0-9|\\s]*[A-Z|0-9|\*|-]*[A-Z|0-9]*[!|,|;|:|.|?|\\s]*');
        modifiedText = modifiedText.replace(/\s/g, '\\s+');

        if (lastCharacter != "*") {
            //        text = text + " ";
            //pattern should also match when user inputs ends with a space, ?, ! or .
            modifiedText = modifiedText + '[\\s|,|;|:|?|!|.]*';
        }

        return new RegExp(modifiedText, 'i');
    };

    // Get the matched wild card value of pattern
    // userInput should be matched by patternText when ignoring case sensitive
    this.getWildCardValue = function(userInput, patternText) {
        //get all strings of the pattern that are divided by a *
        //e.g. WHAT IS THE RELATION BETWEEN * AND * -> [WHAT IS THE RELATION BETWEEN , AND ]
        var replaceArray = patternText.split('*');
        // patternText is always upper case so need to convert userInput to uppercase to compare
        var wildCardInput = userInput.toUpperCase();

        if (replaceArray.length > 1) {
            //replace the string of the userInput which is fixed by the pattern
            var i;
            for (i = replaceArray.length - 1; i >= 0; i--) {
                let index = wildCardInput.indexOf(replaceArray[i]);
                if (index >= 0) { // generally it should be greater or equal than 0 as 
                    userInput = userInput.substring(0, index) + '|' + userInput.substring(index + replaceArray[i].length);
                }
            }
            //split the wildCardInput string by | to differentiate multiple * inputs
            //e.g. userInput = WHAT IS THE RELATION BETWEEN TIM AND STRUPPI?
            //-> | TIM | STRUPPI
            //-> [TIM, STRUPPI]
            wildCardInput = userInput.split('|');
            //split function can create an array which also includes spaces etc. -> e.g. [TIM, " ", "", STRUPPI, " "]
            //we just want the information
            var wildCardArrayIndex = 0;
            for (i = 0; i < wildCardInput.length; i++) {
                if (wildCardInput[i] != '' && wildCardInput[i] != ' ' && wildCardInput != undefined) {
                    let wildCard = wildCardInput[i];
                    let wildCardLastCharIndex = wildCard.length - 1;
                    let firstCharOfWildCard = wildCard.charAt(0);
                    let lastCharOfWildCard = wildCard.charAt(wildCardLastCharIndex);

                    try {
                        //harmonize the wildcard string
                        //remove first char if it is a space.
                        //calculate the last index again since the length of the string changed
                        if (firstCharOfWildCard === ' ') {
                            wildCard = wildCard.splice(0);
                            wildCardLastCharIndex = wildCard.length - 1;
                            lastCharOfWildCard = wildCard.charAt(wildCardLastCharIndex);
                        }
                        //if the last char is a space, remove it
                        //calculate the last index again since the length of the string changed
                        if (lastCharOfWildCard === ' ') {
                            wildCard = wildCard.substr(0, wildCardLastCharIndex);
                            wildCardLastCharIndex = wildCard.length - 1;
                            lastCharOfWildCard = wildCard.charAt(wildCardLastCharIndex);
                        }
                        if (lastCharOfWildCard === '?') {
                            wildCard = wildCard.substr(0, wildCardLastCharIndex);
                        }
                    } catch (e) {}

                    this.wildCardArray[wildCardArrayIndex] = wildCard;
                    wildCardArrayIndex++;
                }
            }
        }
        if (this.wildCardArray.length - 1 >= 0) {
            this.lastWildCardValue = this.wildCardArray[this.wildCardArray.length - 1];
        }

        return this.wildCardArray;
    };
};

function getInstance(paramJson) {
    if (!interpreterQueue) {
        interpreterQueue = {};
    }

    if (paramJson.name && interpreterQueue[paramJson.name]) {
        return interpreterQueue[paramJson.name];
    }

    var interpreter = new AIMLInterpreter(paramJson);
    if (paramJson.name) {
        interpreterQueue[paramJson.name] = interpreter;
    }
    return interpreter;
}

function setForceReload(forced) {
    forced = (forced == null ? false : forced);
    forceReload = forced;
}

function setDebug(flag) {
    isDebug = (flag == null ? false : flag);
}

function debug(info) {
    if (isDebug) {
        print("[Debug] " + info);
    } else if (logger.isDebugEnabled()) {
        logger.debug(info);
    }
}

function isDebugEnabled() {
    return isDebug || logger.isDebugEnabled();
}


var callback = function(answer, wildCardArray, input) {
    if (isDebugEnabled()) {
        debug("End User: " + input);
        debug("VA: " + answer);
        //debug(answer + ' | ' + wildCardArray + ' | ' + input);
    }
    return answer;
};

forceReload = true;

isDebug = false;