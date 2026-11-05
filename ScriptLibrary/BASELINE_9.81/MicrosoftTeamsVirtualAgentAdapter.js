var logger = getLog("MicrosoftTeamsVirtualAgentAdapter");

/**
 *  Render the content to the json displayed in teams.
 *  Parameter channel: 
 *               msteams - the chat terminal is teams
 *               emulator - the chat terminal is emulator
 */
function render(content, language, channel) {
    if (logger.isDebugEnabled()) {
        logger.debug("render: " + content);
    }
    
    if (!content) {
        return null;
    }

    if (!language) {
        language = "en";
    }

    var answer = {
        "type": "text",
        "content": content
    };

    var text = content;

    // get title
    var titlePrefix = lib.VirtualAgentHelper.getVATitleTagPrefix();
    var titleSuffix = lib.VirtualAgentHelper.getVATitleTagSuffix();

    var indexTitlePrefix = text.indexOf(titlePrefix);
    var indexTitleSuffix = text.indexOf(titleSuffix);

    var title = null;
    if (indexTitlePrefix >= 0 && indexTitleSuffix >= 0 && indexTitlePrefix < indexTitleSuffix) {
        var title = text.substring(indexTitlePrefix + titlePrefix.length, indexTitleSuffix).trim();
        text = text.substring(0, indexTitlePrefix) + text.substring(indexTitleSuffix + titleSuffix.length);
    }

    var buttons = [];

    // get button name
    var text = text.replace(new RegExp(lib.VirtualAgentHelper.getVAButtonTagPrefix() + "([a-zA-Z0-9 ]+)" + lib.VirtualAgentHelper.getVAButtonTagSuffix(), "g"),
        function($1, $2, $3, $4) {
            buttons.push($2);
            return "";
        });

    var factPrefix = lib.VirtualAgentHelper.getVAFactTagPrefix();
    var factSuffix = lib.VirtualAgentHelper.getVAFactTagSuffix();
    text = text.replace(new RegExp(factSuffix + "\\s*" + factPrefix, "g"), ",");

    var factsPrefix = lib.VirtualAgentHelper.getVAFactsTagPrefix();
    var factsSuffix = lib.VirtualAgentHelper.getVAFactsTagSuffix();

    // reconstruct the fact list to facts tag
    text = text.replace(factPrefix, factsPrefix + '[');
    text = text.replace(factSuffix, ']' + factsSuffix);

    var facts = [];

    var indexFactsPrefix = text.indexOf(factsPrefix);
    var indexFactsSuffix = text.indexOf(factsSuffix);
    if (indexFactsPrefix >= 0 && indexFactsSuffix >= 0 && indexFactsPrefix < indexFactsSuffix) {
        var factsString = text.substring(indexFactsPrefix + factsPrefix.length, indexFactsSuffix).trim();
        if (factsString) {
            try {
                facts = JSON.parse(factsString);
            } catch (e) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Failed to convert facts string to JSON: " + e);
                }
            }
        }
        text = text.substring(0, indexFactsPrefix + factsPrefix.length) + text.substring(indexFactsSuffix);
    }

    if (buttons.length > 0 || facts.length > 0) {
        answer.type = "card";
        answer.content = adaptiveButtonCard({
            "title": title,
            "text": text.trim(),
            "facts": facts,
            "buttons": buttons
        }, language, channel);
    }

    return answer;
}

/**
 *  Generate the card content to the format of adaptive card
 */
function adaptiveButtonCard(cardContent, language, channel) {
    if (!language) {
        language = "en";
    }
    
    var title = cardContent.title;
    var text = cardContent.text;
    var facts = cardContent.facts;
    var buttons = cardContent.buttons;

    var card = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.3",
        "body": []
    };

    if (title) {
        card.body.push({
            "type": "TextBlock",
            "text": title,
            "weight": "bolder",
            "size": "large",
            "wrap": true
        });
    }

    if (facts && facts.length > 0) {
        var textArray = text.split(lib.VirtualAgentHelper.getVAFactsTagPrefix() + lib.VirtualAgentHelper.getVAFactsTagSuffix());
        if (textArray && textArray.length == 2) {
            card.body.push({
                "type": "TextBlock",
                "text": textArray[0],
                "wrap": true
            });

            var factset = lib.MicrosoftTeamsCard.generateFactSetObj(facts);
            card.body.push(factset);

            card.body.push({
                "type": "TextBlock",
                "text": textArray[1],
                "wrap": true
            });
        } else {
            card.body.push({
                "type": "TextBlock",
                "text": text,
                "wrap": true
            });
        }
    } else {
        card.body.push({
            "type": "TextBlock",
            "text": text,
            "wrap": true
        });
    }

    if (buttons && buttons.length > 0) {
        card.actions = [];
        var i;
        for (i = 0; i < buttons.length; i++) {
            let atitle = lib.localizeTable.getLocalizedMessageText(language, "msteams", lib.VirtualAgentHelper.getButtonCaption(buttons[i])) || buttons[i];
            let action = {
                "type": "Action.Submit",
                "title": atitle,
                "id": buttons[i]
            };
            if (channel == "msteams") {
                action.data = {
                    "msteams": {
                        "type": "imBack",
                        "value": atitle
                    }
                }
            } else {
                action.data = atitle;
            }
            card.actions.push(action);
        }
    }

    return card;
}
