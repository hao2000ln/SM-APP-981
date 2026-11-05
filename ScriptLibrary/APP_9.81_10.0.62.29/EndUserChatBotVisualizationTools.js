var $ = lib.c.$;

var aimls = [];


/**
 * create chat bot workflow graph
 *
 * @param {String} botId
 * @param {String} aimlId
 * @returns {String}
 */
function createGraph(botId, aimlId) {

    var graph = new lib.VisualizationTools.Graph(botId, aimlId);

    // node
    $("sdchatbotaiml", SCFILE_READONLY).find("bot.id=:id", botId).each(function(aiml) {

        var param = {};
        var id = aiml.id;
        var that = aiml.that_pattern;
        var input = aiml.input_pattern;

        var templates = [];
        if (aiml.template) {
            templates = aiml.template.toArray();
        }

        var label = input || that || "*";
        label = lib.AIMLParser.replaceMessage(label, "en");

        // start shape
        if (!that && !input) {
            param.shape_type = 3;
        }
        // end shape
        else if (label == "END CHAT COMMAND") {
            param.shape_type = 3;
        }

        var tooltip = id;
        graph.addNode(id, label, tooltip, param);

        aimls.push({
            "id": id,
            "that": that,
            "input": input,
            "templates": templates
        });
    });

    // edge
    $("sdchatbotaiml", SCFILE_READONLY).find("bot.id=:id", botId).each(function(aiml) {
        if (!aiml.template) {
            return false;
        }

        var templates = aiml.template.toArray();
        var templateXML = "<template>" + templates.join('\n') + "</template>";
        var xml = new XML();
        xml.setContent(templateXML);

        var toIds = new Set();

        // 1. direct bot command input
        if (templates && templates.length == 1 && templates[0] && templates[0].trim().startsWith("BOTCMD_")) {
            getAimlIdByInput(templates[0], toIds);
        }

        // 2. srai
        getSraiToIds(xml, toIds);

        // 3. that
        getThatToIds(xml, toIds);

        toIds.forEach(function(toId) {
            graph.addEdge(aiml.id + "-" + toId, aiml.id, toId, "");
        });
    });

    return graph.output();
}


/**
 * get srai node ids according to the template content
 *
 * @param {XML} xml
 * @param {Set} toIds
 */
function getSraiToIds(xml, toIds) {
    var srais = new Set();

    // 1. direct srai
    var srai = lib.xmlHelpers.getElementValue(xml, "srai");
    if (srai) {
        srais.add(srai);
    }

    // 2. condition srai
    var node = xml.getFirstChildElement();
    while (node != null) {
        if (node.getName() == "condition") {
            var subnode = node.getFirstChildElement();
            while (subnode != null) {
                if (subnode.getName() == "li") {
                    srai = lib.xmlHelpers.getElementValue(subnode, "srai");
                    if (srai) {
                        srais.add(srai);

                        // check li that
                        var text = subnode.getValue();
                        if (text) {
                            getAimlIdsByThat(text, toIds);
                        }
                    }
                    // check li text
                    else {
                        var liText = subnode.getValue();
                        if (liText) {
                            getAimlIdsByThat(liText, toIds);
                        }
                    }
                }
                subnode = subnode.getNextSiblingElement();
            }
        }
        node = node.getNextSiblingElement();
    }

    srais.forEach(function(srai) {
        getAimlIdByInput(srai, toIds);
    });
}


/**
 * get aiml category id by input value
 *
 * @param {String} value
 * @param {Set} toIds
 */
function getAimlIdByInput(value, toIds) {
    if (!value) {
        return;
    }

    var i;
    for (i = 0; i < aimls.length; i++) {
        var input = aimls[i].input;
        if (!input) {
            continue;
        }
        if (input == value || input.replace(/\sUNDERSCORE\s/g, "_") == value) {
            toIds.add(aimls[i].id);
        }
    }
}


/**
 * get that node ids according to the template content
 *
 * @param {XML} xml
 * @param {Set} toIds
 */
function getThatToIds(xml, toIds) {

    var text = xml.getValue();
    if (!text) {
        return;
    }

    getAimlIdsByThat(text, toIds);
}


/**
 * get aiml category ids by that value
 *
 * @param {String} text
 * @param {Set} toIds
 */
function getAimlIdsByThat(text, toIds) {
    aimls.forEach(function(aiml) {
        var that = aiml.that;
        if (that && text.toUpperCase().indexOf(that.toUpperCase()) >= 0) {
            toIds.add(aiml.id);
        }
    });
}