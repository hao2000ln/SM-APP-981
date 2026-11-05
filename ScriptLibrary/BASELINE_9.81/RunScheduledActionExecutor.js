var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;

var parseRuleXML = lib.RunScheduledActionWizard.parseRuleXML;
var parseRuleJSON = lib.RunScheduledActionWizard.parseRuleJSON;
var TPUTILITY = lib.TaskPlannerUtilities;
var CallRad = lib.executor.CallRad;

var RunScheduledActionExecutor = $(new function() {
    var calcType = 1;
    var actionCondition = "";
    var actionConditionXml = "";
    var rulesetName = "";
    var action = "";
    var calcScript = "";
    var calcField = "";
    var calcInterval = "";

    /**
     * Execute the JS of schedule action while calculation type is set to use JavaScript,
     * and returns the variable actionExecutionTime.
     */
    function executeScheduledActionJS(js, record, oldRecord) {
        try {
            eval(js);
            return actionExecutionTime;
        } catch (e) {
            print("Could not process javascript in the \"Run Scheduled Action\" Rule.");
            print(e.toString());
            return "Error";
        }
    }

    return {
        init: function(request) {
            var jsonString = request.getParameter("$L.ruleJSON");
            var xmlString = request.getParameter("$L.ruleXML");
            var runActionConf = null;

            if (null == jsonString || "" == jsonString) {
                var ruleXML = new XML();
                ruleXML.setContent(xmlString);
                var parent = ruleXML.getDocumentElement();
                var rule = parent.getFirstChildElement();
                runActionConf = parseRuleXML(rule.toXMLString());
            } else {
                runActionConf = parseRuleJSON(jsonString);
            }

            calcType = runActionConf.calcType;
            actionCondition = runActionConf.actionCondition;
            actionConditionXml = runActionConf.actionConditionXml;
            rulesetName = runActionConf.rulesetName;
            if (_str.isBlank(rulesetName) || rulesetName === "null") { // the rulesetName should not be "null" here, TODO, the wizard GUI should not set null here, will update after wizard GUI fix it
                rulesetName = "";
            }
            action = runActionConf.action;
            calcScript = runActionConf.calcScript;
            calcField = runActionConf.calcField;
            calcInterval = runActionConf.calcInterval;
        },

        /**
         * To generate the schedule record while the rule is executed.
         * @public
         * @param {object}
         *          request - the request.
         */
        executeRule: function(request) {
            var record = request.getParameter("$L.file");
            var oldRecord = request.getParameter("$L.file.save");
            var filename = funcs.filename(record);
            // calcType
            if (calcType == null) {
                request.setAttribute("$L.message", funcs.scmsg(35, "scev"));
                request.setAttribute("$L.result", 1);

                return;
            }
            // actionCondition
            // rulesetName
            // action
            if (calcType === 1) {
                // calcField
                if (calcField == null) {
                    request.setAttribute("$L.message", funcs.scmsg(35, "scev"));
                    request.setAttribute("$L.result", 1);
                    return;
                }

                if (!funcs.exists(calcField, record)) { // calculate field does not exist
                    // message is not localized because it is only be used by extreme cases
                    request.setAttribute("$L.message", "The Field \"" + calcField + "\" does not exist");
                    request.setAttribute("$L.result", 1);
                    return;
                }

                if (record[calcField] == null) { // calculate field value is null
                    funcs.log("The Field \"" + calcField + "\" value is null, so ignore generating the scheudle for this Run Scheduled Action");
                    request.setAttribute("$L.result", 0);
                    return;
                }
                // calcInterval
                if (calcInterval == null) {
                    request.setAttribute("$L.message", funcs.scmsg(35, "scev"));
                    request.setAttribute("$L.result", 1);
                    return;
                }
            } else {
                // calcScript
                if (calcScript == null) {
                    calcScript = "";
                }
            }
            var dbdictService = $("#dbdictService");
            var dbdict = dbdictService.getValidDbdict(filename);
            if (null == dbdict) {
                // message is not localized because it is only be used by extreme cases
                request.setAttribute("$L.message", "dbdict " + filename + " does not exist...");
                request.setAttribute("$L.result", 1);
                return;
            }
            var pk = dbdictService.getPrimaryKey(dbdict.key);
            if (null == pk) {
                // message is not localized because it is only be used by extreme cases
                request.setAttribute("$L.message", "Primary Key of dbdict " + filename + " does not exist...");
                request.setAttribute("$L.result", 1);
                return;
            }
            var pkField = (pk.name)[0];

            var ticketID = record[pkField];
            var actionName = action;
            if (action === "0") {
                actionName = "Do nothing";
            } else if (action === "1") {
                actionName = "Save";
            }
            // the format of scheuld name: ScheduledAction - [ticket id] - [ruleset] - [actionName]
            var scheduleName = "ScheduledAction - " + ticketID + " - " + rulesetName + " - " + actionName;

            // create schedule record
            var bInsert = false;
            var query = "class=\"scheduledAction\" and sched.class=\"scheduledAction\" and name=\"" + scheduleName + "\"";
            var schedule = $("schedule").select(query).uniqueResult();
            if (null == schedule) {
                schedule = new SCFile("schedule");
                schedule["class"] = "scheduledAction";
                schedule.sched_class = "scheduledAction";
                schedule.status = "scheduled";
                schedule.name = scheduleName;
                bInsert = true;
            } else {
                schedule.status = "rescheduled";
            }
            if (calcType === 1) {
                // here we use SM function to calculate the date value which is calcuated by a fix date + a interval string
                vars.$L_schedule_expiration_tmp = record[calcField];
                if (calcInterval.indexOf("-") == 0) {
                    calcInterval = funcs.substr(calcInterval, 2);
                    schedule.expiration = funcs.parse_evaluate("$L.schedule.expiration.tmp - '" + calcInterval + "'", 2);
                } else {
                    schedule.expiration = funcs.parse_evaluate("$L.schedule.expiration.tmp + '" + calcInterval + "'", 2);
                }

                vars.$L_schedule_expiration_tmp = null;

                if (schedule.expiration === null) {
                    // message is not localized because it is only be used by extreme cases
                    request.setAttribute("$L.message", "The interval \"" + calcInterval + "\"is not valid");
                    request.setAttribute("$L.result", 1);
                    return;
                }
            } else {
                var executionTime = executeScheduledActionJS(calcScript, record, oldRecord);

                if (executionTime === "Error") {
                    request.setAttribute("$L.message", funcs.scmsg(64, "ruleset"));
                    request.setAttribute("$L.result", 1);
                    return;
                }
                schedule.expiration = executionTime;
            }
            schedule.application = "Controller.schedule.run";
            schedule.query = "#runScheduledActionScheduleExecutor.executeScheduleApplication";
            // set parameters to schedule strings
            schedule.strings = $.createSCArray("$L.fileName", "$L.recordID", "$L.condition", "$L.conditionXml", "$L.rulesetName", "$L.action");
            schedule.strings1 = $.createSCArray(filename, ticketID, actionCondition, actionConditionXml, rulesetName, action);

            if (bInsert) {
                schedule.doInsert();
            } else {
                schedule.doSave();
            }
            request.setAttribute("$L.result", 0);
            return;
        },

        exceptionHandler: function(exception, request) {
            print("exceptionHandler: " + _str(exception));
            request.setAttribute("$L.result", 1);
        },

        getRecordId: function(record) {
            var recordId = "";
            var fileName = funcs.filename(record);
            var key = TPUTILITY.getUniqueKey(fileName);
            if ("" === key) {
                print("Can not find the UniqueKey of table " + fileName);
                return;
            }
            recordId = record[key];
            return recordId;
        }
    };
});

function getClass() {
    return RunScheduledActionExecutor;
}