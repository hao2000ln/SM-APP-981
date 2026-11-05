var $ = lib.c.$;
var log = getLog("RuleEngineRunRulesets");

var SUCCESS = 0;
var BAD_VALIDATION = 1;
var JUMP_OUT = 2;

/**
 * This method is used to replace the RAD Ruleset.runMultiple
 * QCCR1E119215, [Performance Improvement] implement run rules in js code to avoid too many jscall.
 * @param {SCFile} record - the current record.
 * @param {SCFile} oldRecord - the saved record.
 * @param {array of ruleset} rulesets - the rulesets.
 * @param {string} type - the type.
 * @param {SCFile} obj - the current object record.
 * @returns {int} the int value, 0-SUCCESS, 1-BAD_VALIDATION, 2-JUMP_OUT
 */
function runRulesets(record, oldRecord, rulesets, type, obj) {
    if (null == rulesets) {
        return 0;
    }
    var len = rulesets.length();

    if (type == null) {
        type = "all";
    }

    var rulesetRet;
    var i;
    for (i = 0; i < len; i++) {
        var rulesetID = rulesets[i];
        if (null == rulesetID || "" == rulesetID) {
            log.warn("Ingore the ruleset which id is empty.");
            continue;
        }
        var ruleset = $("RuleSet", SCFILE_READONLY).select("id=\"" + rulesetID + "\"").uniqueResult();
        if (null == ruleset) {
            log.warn("Can not find RuleSet according to id \"" + rulesetID + "\", ignore this RuleSet!");
            return 0;
        }

        rulesetRet = runRuleset(record, oldRecord, ruleset, type, obj);
        if (rulesetRet["code"] == BAD_VALIDATION) {
            return BAD_VALIDATION;
        }
        if (rulesetRet["exit.val"] == "jump.out") {
            return JUMP_OUT;
        }
    }
}

/**
 * This method is used to replace the RAD Ruleset.run
 * QCCR1E119215, [Performance Improvement] implement run rules in js code to avoid too many jscall.
 * @param {SCFile} record - the current record.
 * @param {SCFile} oldRecord - the saved record.
 * @param {RuleSet} ruleset - the ruleset record.
 * @param {string} type - the type.
 * @param {SCFile} obj - the current object record.
 * @returns {{"code":int, "exit.val":string}} the code value: 0-SUCCESS, 1-BAD_VALIDATION.
 */
function runRuleset(record, oldRecord, ruleset, type, obj) {
    var ret = {
        "code": 0,
        "exit.val": "normal"
    };

    if (null == ruleset) {
        log.warn("RuleSet is null, ignore this RuleSet!");
        return ret;
    }
    var rules = ruleset.rule;
    if (null == rules) {
        return ret;
    }
    var groupId = [];
    var groupCond = [];
    var i;
    var len = rules.length();
    for (i = 0; i < len; i++) {
        // start rule
        var rType = "";
        var rule = rules[i];
        var jsonObj = null;
        if (rule.ruleJSON != null) {
            jsonObj = JSON.parse(rule.ruleJSON);
        } else {
            rule.ruleXML = "<rule>" + rule.ruleXML + "</rule>";
        }

        if (rule.isGroup == true) {
            rType = "ruleGroup";
        } else {
            rType = rule.type;
            if (null == rType || "" == rType) {
                if (rule.ruleJSON != null) {
                    rType = jsonObj.type;
                } else {
                    //TODO
                    //rType = getType(rule.ruleXML);
                }
            }
        }

        if (log.isDebugEnabled()) {
            log.debug("the rules type of " + rules[i].ruleId + " is:" + rType);
        }

        var conditionXML = rule.conditionXML;
        if (conditionXML != null && conditionXML != "" && (conditionXML.indexOf("\"crosstablefield\"") >= 0 || conditionXML.indexOf("\"useroption\"") >= 0)) {
            lib.Workflow.initVarForCondition(conditionXML);
        }
        if (null == rule.condition) {
            rule.condition = true;
        }
        var condition = funcs.parse_evaluate(rule.condition, 4);
        var groupOk = true;

        if (rule.parentGroup > 0) {
            var temp = groupId.indexOf(rule.parentGroup);
            groupOk = groupCond[temp];
        }
        if (null == condition) {
            condition = true;
        }

        if (log.isDebugEnabled()) {
            log.debug("the condition of " + rules[i].ruleId + " is:" + condition);
            log.debug("the groupOk of " + rules[i].ruleId + " is:" + groupOk);
            log.debug("the rType of " + rules[i].ruleId + " is:" + rType);
            log.debug("the isGroup of " + rules[i].ruleId + " is:" + rule.isGroup);
        }

        // check group
        if (rType == "ruleGroup" || rule.isGroup == true) {
            groupId.push(rule.ruleId);
            var groupCondition = funcs.parse_evaluate(rule.condition, 4);
            groupCond.push(groupCondition);
        } else { // check condition
            if (condition != true) {
                continue;
            }
            if (groupOk != true) {
                continue;
            }
            // TODO, cache rule type here
            var ruleType = $("RuleType", SCFILE_READONLY).select("id=\"" + rType + "\"").uniqueResult();

            if (log.isDebugEnabled()) {
                log.debug("the ruleType:" + ruleType);
            }
            if (null == ruleType) {
                log.warn("Can not find RuleType according to id \"" + rType + "\", ignore current rule \"" + rule.ruleId + "\":" + "\"" + rule.ruleDesc + "\" in RuleSet \"" + ruleset.id + "\"!");
                continue;
            }
            var executeType = ruleType.executeType;
            if (log.isDebugEnabled()) {
                log.debug("the executeType of rule type is:" + executeType);
            }

            if (executeType == "js") {
                vars["$L.message"] = null;
                vars["$L.result"] = 0;
                vars["$L.cursorField"] = null;
                if (log.isDebugEnabled()) {
                    log.debug("eval the js:" + "lib." + ruleType.executeName + "(\"" + rule.ruleXML + "\", record, oldRecord)");
                }
                eval("lib." + ruleType.executeName + "('" + rule.ruleXML + "', record, oldRecord)");
            } else if (executeType == "rad") {
                var argNames = new SCDatum();
                var argVals = new SCDatum();
                var argTypes = new SCDatum();
                var results = new SCDatum();

                argNames.setType(8);
                argVals.setType(8);
                argTypes.setType(8);
                results.setType(8);

                argNames.push("name");
                argNames.push("names");
                argNames.push("values");

                argVals.push(ruleType.executeName);
                argVals.push(["text", "file", "second.file", "index", "prompt", "names", "values"]);
                argVals.push([vars["$L.xml"], vars["$L.file"], vars["$L.file.save"], vars["$L.result"], vars["$L.message"], vars["$L.names"], vars["$L.values"]]);

                argTypes.push($.Character);
                argTypes.push($.Array);
                argTypes.push($.Array);

                results.push("values");

                var radResults = system.library.RAD.run("callref", argNames, argVals, argTypes, results);
            } else if (executeType == "asynjs") {
                // TODO, 
            }

            // check result
            if (vars["$L.result"] == 100) { //jump out
                ret["exit.val"] = "jump.out";
                return ret;
            } else if (vars["$L.result"] != 0 && (vars["$L.message"] == null || vars["$L.message"] == "")) { //bad validation
                // do nothing, let handle later
            } else if (vars["$L.result"] != 0 && (vars["$L.msgType"] == "screen" || vars["$G.bg"])) { //send.screen.msg
                var argNames = new SCDatum();
                var argVals = new SCDatum();
                var argTypes = new SCDatum();
                var results = new SCDatum();

                argNames.setType(8);
                argVals.setType(8);
                argTypes.setType(8);
                results.setType(8);

                argNames.push("index");
                argNames.push("text");

                argVals.push(2);
                argVals.push(vars["$L.message"]);

                argTypes.push($.Number);
                argTypes.push($.Character);

                results.push("values");

                var radResults = system.library.RAD.run("msg", argNames, argVals, argTypes, results);
            } else if (vars["$L.result"] != 0 && (vars["$trigger"] == null || !(vars["$trigger"]))) { //send.msg
                var argNames = new SCDatum();
                var argVals = new SCDatum();
                var argTypes = new SCDatum();
                var results = new SCDatum();

                argNames.setType(8);
                argVals.setType(8);
                argTypes.setType(8);
                results.setType(8);

                argNames.push("index");
                argNames.push("text");

                argVals.push(1);
                argVals.push(vars["$L.message"]);

                argTypes.push($.Number);
                argTypes.push($.Character);

                results.push("values");

                var radResults = system.library.RAD.run("apm.mb.ok", argNames, argVals, argTypes, results);
            } else if (vars["$L.result"] == 0 && vars["$L.cursorField"] != null) { //set.cursor
                funcs.cursor_field_name_set(vars["$L.cursorField"]);
            }

            // goto bad.val, a little bit behavior change comparing to RAD Ruleset.run -> Panel check.result
            if (vars["$L.result"] != 0) { //bad validation
                ret["code"] = BAD_VALIDATION;
                funcs.cursor_field_name_set(vars["$L.cursorField"]);
                // if(exists $L.exit) vars["$L.exit"] = "bad.val";
                return ret;
            }
        }
    }

    return ret;
}