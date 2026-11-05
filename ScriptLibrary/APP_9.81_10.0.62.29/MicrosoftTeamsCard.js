/**
 * generate adaptive card object
 *
 * @see https://adaptivecards.io/explorer/
 *
 * @param {String} title
 * @param {String} subtitle
 * @param {String} text
 * @param {Array} facts
 * @param {String} url
 * @param {String} lang
 * @returns {Object}
 */
function adaptiveCard(title, subtitle, text, facts, url, lang) {
    var card = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.3",
        "body": [{
                "type": "TextBlock",
                "text": title || "",
                "weight": "bolder",
                "size": "large",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": subtitle || "",
                "wrap": true,
                "isSubtle": true
            },
            {
                "type": "TextBlock",
                "text": text || "",
                "wrap": true
            }
        ]
    };

    if (facts && facts.length > 0) {
        var factset = generateFactSetObj(facts);
        card.body.push(factset);
    }

    // action
    var actionTitle;
    if (lang) {
        actionTitle = lib.NotificationRecipientsHelp.determinMsg(lang, "msteams", "19");
    } else {
        actionTitle = funcs.scmsg("19", "msteams");
    }
    card.actions = [{
        "type": "Action.OpenUrl",
        "title": actionTitle,
        "url": url
    }];

    return card;
}


function generateFactSetObj(facts) {

    var factsObj = [];
    facts.forEach(function(fact) {
        factsObj.push({
            "title": fact[0],
            "value": fact[1] || ""
        });
    });

    return {
        "type": "FactSet",
        "separator": true,
        "facts": factsObj
    };
}