var $ = lib.c.$;

var parseRuleXML = lib.RunActionWizard.parseRuleXML;
var parseRuleJSON = lib.RunActionWizard.parseRuleJSON;
var FILENAME = funcs.filename;
var TPUTILITY = lib.TaskPlannerUtilities;
var CallRad = lib.executor.CallRad;
var CallRadWithBackend = lib.executor.CallRadWithBackend;
var getQuerySql = lib.QueryEditorParser.getQuery;
var scmsg = funcs.scmsg;
var msg = funcs.msg;
var msgCls = "local:runAction";
var exceptionMsg = "Ruleset has been stopped";

var RunActionExecutor = $({
    actionType: 1, //1: related records; 2: other records; 3: current record
    relationType: "",
    filename: "",
    query: "",
    ruleset: "",
    action: 0, //0: do nothing; 1: do save; event.close (backend transition name)
    stop: false,

    init: function(request) {
        var jsonString = request.getParameter("$L.ruleJSON");
        var xmlString = request.getParameter("$L.ruleXML");
        var runActionConf = null;

        if (null == jsonString || "" == jsonString) {
            var ruleSet = new XML();
            ruleSet.setContent(xmlString);
            var parent = ruleSet.getDocumentElement();
            var rule = parent.getFirstChildElement();
            runActionConf = parseRuleXML(rule.toXMLString());
        } else {
            runActionConf = parseRuleJSON(jsonString);
        }

        this.actionType = runActionConf.actionType;
        this.relationType = runActionConf.relationType;
        this.filename = runActionConf.filename;
        this.query = runActionConf.actionQueryXml;
        this.ruleset = runActionConf.ruleset;
        this.action = runActionConf.action;

        var runnedRecord = request.getGlobal().getAttribute("$L.runnedRecord");

        if (runnedRecord === undefined) {
            runnedRecord = [];
        }

        var runningRuleSet = request.getParameter("$L.runningRuleset");
        var runningRuleId = request.getParameter("$L.runningRuleId");
        var ticketId = this.getRecordId(request.getParameter("$L.file"));
        var runningRecord = FILENAME(request.getParameter("$L.file")) + ":" + ticketId + ":" + runningRuleSet + ":" + runningRuleId;

        if (!lib.ArrayUtil.contains(runnedRecord, runningRecord)) {
            this.stop = false;
            runnedRecord.push(runningRecord);
            request.getGlobal().setAttribute("$L.runnedRecord", runnedRecord);
        } else {
            this.stop = true;
            msg(scmsg("deadloop", msgCls, ["'" + request.getParameter("$L.runningRuleset") + "'"]), 3);
            request.setAttribute("$L.result", 1);
            request.getGlobal().removeAttribute("$L.runnedRecord");
        }

    },

    getFileNameByRelationType: function(relationName, srcFilename) {
        var screlationtype = new SCFile("screlationtype", SCFILE_READONLY);
        screlationtype.setFields(["target.file"]);
        var targetFilename = "INVALID";
        var sql = "name = \"" + relationName + "\" and source.file = \"" + srcFilename + "\"";
        if (screlationtype.doSelect(sql) === RC_SUCCESS) {
            targetFilename = screlationtype.target_file;
        }

        return targetFilename;
    },

    getRelationValueByType: function(relationName, srcFilename, targetFilename) {
        var screlationtype = new SCFile("screlationtype", SCFILE_READONLY);
        screlationtype.setFields(["value"]);
        var relationValue = "";
        var sql = "name =\"" + relationName + "\" and source.file = \"" + srcFilename + "\" and target.file=\"" + targetFilename + "\"";
        if (screlationtype.doSelect(sql) === RC_SUCCESS) {
            relationValue = screlationtype.value;
        }
        return relationValue;
    },
    getRecordId: function(record) {
        var recordId = "";
        var fileName = FILENAME(record);
        var key = TPUTILITY.getUniqueKey(fileName);
        if ("" === key) {
            logInfo("Can not find the UniqueKey of table " + fileName);
            return;
        }
        recordId = record[key];
        return recordId;
    },

    executeRule: function(request) {
        if (!this.stop) {
            request.setExceptionHandler(this.exceptionHandler);
            var smFile;
            var sql;
            var handlers;
            var i;

            //Related records
            if (this.actionType === 1) {
                var srcFileName = FILENAME(request.getParameter("$L.file"));
                var dependFileName = this.getFileNameByRelationType(this.relationType, srcFileName);
                /** commented the validation to improve performance
                if ("INVALID"===dependFileName){
                    //throw "The Relation Type of "+this.relationType+" is not valid, please reselect a correct one.";
                    //print("The Relation Type "+"'"+this.relationType+"'"+" is not valid, please reselect a correct one in your RunAction rule "+"'"+this.ruleset+"'"+" for Related Records.");
                    msg(scmsg("relationtype", msgCls,["'"+this.relationType+"'","'"+request.getParameter("$L.runningRuleset")+"'"]), 3);
                    request.setAttribute("$L.result", 1);
                    request.getGlobal().removeAttribute("$L.runnedRecord");
                    return;
                }
                */
                smFile = new SCFile(dependFileName);
                var screlation = new SCFile("screlation", SCFILE_READONLY);
                screlation.setFields(["depend"]);
                var ticketid = this.getRecordId(request.getParameter("$L.file"));
                var srcFile = srcFileName;
                var depFile = dependFileName;

                if ("probsummary" === srcFileName) {
                    srcFile = "problem";
                }
                if ("probsummary" === dependFileName) {
                    depFile = "problem";
                }
                var relationValue = this.getRelationValueByType(this.relationType, srcFileName, dependFileName);
                sql = "source=\"" + ticketid + "\" and source.filename=\"" + srcFile + "\" and depend.filename=\"" + depFile + "\" and type=\"" + relationValue + "\"";

                if (screlation.doSelect(sql) === RC_SUCCESS) {
                    var relatedIds = [];

                    //handle query
                    var querySql = "";
                    if (null !== this.query && "" !== this.query && "null" !== this.query) {
                        querySql = getQuerySql(this.query, {
                            CurrentRecord: request.getParameter("$L.file"),
                            SavedRecord: request.getParameter("$L.file.save"),
                            TargetFile: dependFileName
                        });
                    }

                    var dependKey = TPUTILITY.getUniqueKey(dependFileName);
                    if ("" === dependKey) {
                        logInfo("Can not find the UniqueKey of table " + dependFileName);
                        return;
                    }
                    do {
                        relatedIds.push(screlation['depend']);
                    } while (screlation.getNext() === RC_SUCCESS);

                    var dependSql = "";
                    var strIds = "{";
                    var h;
                    for (h = 0; h < relatedIds.length; h++) {
                        strIds += "\"" + relatedIds[h] + "\",";
                    }
                    strIds += "}";
                    dependSql = "" + dependKey + " isin " + strIds;
                    if (null !== querySql && "" !== querySql) {
                        dependSql = dependSql + " and " + querySql;
                    }

                    var mCount = smFile.doCount(dependSql);
                    if (mCount > 0) {
                        smFile.doSelect(dependSql);
                        request.setAttribute("$L.smFile", smFile);
                        handlers = request.handlers;
                        for (i = 0; i < mCount; i++) {
                            handlers.push(this.callRuleSetRunOnOtherRecord);
                            handlers.push(this.callbackActionRuleSetRunOnOtherRecord);
                        }
                    } else {
                        request.setAttribute("$L.result", 0);
                        request.getGlobal().removeAttribute("$L.runnedRecord");
                    }
                } else {
                    request.setAttribute("$L.result", 0);
                    request.getGlobal().removeAttribute("$L.runnedRecord");
                }
            }
            //Other records
            else if (this.actionType === 2) {
                smFile = new SCFile(this.filename);
                sql = false;
                if (null !== this.query && "" !== this.query && "null" !== this.query) {
                    sql = getQuerySql(this.query, {
                        CurrentRecord: request.getParameter("$L.file"),
                        SavedRecord: request.getParameter("$L.file.save"),
                        TargetFile: this.filename
                    });
                }

                var nCount = smFile.doCount(sql);
                if (nCount > 0) {
                    smFile.doSelect(sql);
                    request.setAttribute("$L.smFile", smFile);
                    handlers = request.handlers;
                    for (i = 0; i < nCount; i++) {
                        handlers.push(this.callRuleSetRunOnOtherRecord);
                        handlers.push(this.callbackActionRuleSetRunOnOtherRecord);
                    }

                } else {
                    request.setAttribute("$L.result", 0);
                    request.getGlobal().removeAttribute("$L.runnedRecord");
                }
            }
            //Current record
            else {
                var handlers = request.handlers;
                handlers.push(this.callRuleSetRunOnCurrentRecord);
                handlers.push(this.callbackActionRuleSetRunOnCurrentRecord);
            }
        }
    },

    callRuleSetRunOnOtherRecord: function(request) {
        var smrecord = request.getAttribute("$L.smFile");
        var textDatum = new SCDatum();
        textDatum.setType(2);
        request.textDatum = textDatum;
        if (vars.$G_bg === true) {
            CallRadWithBackend("Ruleset.run", ["file", "second.file", "name", "names", "values", "text"], [smrecord, smrecord, this.ruleset, ["$L.file.src"],
                [request.getParameter("$L.file")], textDatum
            ]);
        } else {
            CallRad("Ruleset.run", ["file", "second.file", "name", "names", "values", "text"], [smrecord, smrecord, this.ruleset, ["$L.file.src"],
                [request.getParameter("$L.file")], textDatum
            ]);
        }
    },

    callbackActionRuleSetRunOnOtherRecord: function(request) {
        var actionResult = RC_SUCCESS;
        var resultVal = request.textDatum;
        if (resultVal.getValue() === "bad.val") {
            throw new Error(exceptionMsg);
        }

        var smrecord = request.getAttribute("$L.smFile");
        var bypassAuthcheckOrig;
        var bypassValidationOrig;

        if (this.action === "1") {
            bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
            bypassValidationOrig = vars.$bypass_failed_validation;
            vars.$bypass_bg_authcheck = true;
            vars.$bypass_failed_validation = true;
            actionResult = smrecord.doAction("save");
            vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
            vars.$bypass_failed_validation = bypassValidationOrig;
        } else if (this.action !== "0" && this.action !== "1") {
            var ac = "_wfE:" + this.action;
            bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
            bypassValidationOrig = vars.$bypass_failed_validation;
            vars.$bypass_bg_authcheck = true;
            vars.$bypass_failed_validation = true;
            actionResult = smrecord.doAction(ac);
            vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
            vars.$bypass_failed_validation = bypassValidationOrig;
        } else if (this.action === "0") {
            actionResult = RC_SUCCESS;
        }

        if (actionResult === RC_SUCCESS || actionResult === RC_VALIDATION_FAILED) {
            request.setAttribute("$L.result", 0);
        } else {
            request.setAttribute("$L.result", 1);
            throw new Error(exceptionMsg + " while executing action " + this.action + " in rule set " + request.getParameter("$L.runningRuleset"));
        }
        var nxt = smrecord.getNext();
        if (nxt !== RC_SUCCESS) {
            request.getGlobal().removeAttribute("$L.runnedRecord");
        }
    },
    callRuleSetRunOnCurrentRecord: function(request) {
        var smrecord = request.getParameter("$L.file");
        var smrecordSave = request.getParameter("$L.file.save");
        var textDatum = new SCDatum();
        textDatum.setType(2);
        request.textDatum = textDatum;
        if (vars.$G_bg === true) {
            CallRadWithBackend("Ruleset.run", ["file", "second.file", "name", "names", "values", "text"], [smrecord, smrecordSave, this.ruleset, ["$L.file.src"],
                [request.getParameter("$L.file")], textDatum
            ]);
        } else {
            CallRad("Ruleset.run", ["file", "second.file", "name", "names", "values", "text"], [smrecord, smrecordSave, this.ruleset, ["$L.file.src"],
                [request.getParameter("$L.file")], textDatum
            ]);
        }
    },

    callbackActionRuleSetRunOnCurrentRecord: function(request) {
        var actionResult = RC_SUCCESS;
        var resultVal = request.textDatum;
        if (resultVal.getValue() === "bad.val") {
            throw new Error(exceptionMsg);
        }

        var smrecord = request.getParameter("$L.file");
        var bypassAuthcheckOrig;
        var bypassValidationOrig;
        var savedFile;

        if (this.action === "1") {
            bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
            bypassValidationOrig = vars.$bypass_failed_validation;
            vars.$bypass_bg_authcheck = true;
            vars.$bypass_failed_validation = true;
            actionResult = smrecord.doAction("save");
            vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
            vars.$bypass_failed_validation = bypassValidationOrig;

            // refresh the saved record for save action
            savedFile = request.getParameter("$L.file.save");
            if (null != savedFile) {
                funcs.copycurrent(savedFile, request.getParameter("$L.file"));
            }
        } else if (this.action !== "0" && this.action !== "1") {
            var ac = "_wfE:" + this.action;
            bypassAuthcheckOrig = vars.$bypass_bg_authcheck;
            bypassValidationOrig = vars.$bypass_failed_validation;
            vars.$bypass_bg_authcheck = true;
            vars.$bypass_failed_validation = true;
            actionResult = smrecord.doAction(ac);
            vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
            vars.$bypass_failed_validation = bypassValidationOrig;

            // refresh the saved record for backend transitions
            savedFile = request.getParameter("$L.file.save");
            if (null != savedFile) {
                funcs.copycurrent(savedFile, request.getParameter("$L.file"));
            }
        } else if (this.action === "0") {
            actionResult = RC_SUCCESS;
        }
        if (actionResult === RC_SUCCESS || actionResult === RC_VALIDATION_FAILED) {
            request.setAttribute("$L.result", 0);
        } else {
            request.setAttribute("$L.result", 1);
            throw new Error(exceptionMsg + " while executing action " + this.action + " in rule set " + request.getParameter("$L.runningRuleset"));
        }
        request.getGlobal().removeAttribute("$L.runnedRecord");
    },

    exceptionHandler: function(exception, request) {
        if (("Error: " + exceptionMsg) !== exception.toString()) {
            logInfo("Exception: " + exception + " Please check your RuleSet " + "'" + this.ruleset + "'" + " configuration!");
        }
        request.getGlobal().removeAttribute("$L.runnedRecord");
    }

});

function logInfo(info) {
    var log = getLog("RunActionExecutor");
    if (log.isInfoEnabled()) {
        log.info(info);
    }
}

function getClass() {
    return RunActionExecutor;
}