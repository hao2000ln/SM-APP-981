var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var CallRadWithBackend = lib.executor.CallRadWithBackend;

var RunScheduledActionScheduleExecutor = $(new function() {

    const FILENAME_PARAM = "$L.fileName";
    const RECORDID_PARAM = "$L.recordID";
    const COND_PARAM = "$L.condition";
    // this parameter is only used for preparing the user option related variables while the User Option is used in condition.
    const CONDXML_PARAM = "$L.conditionXml";
    const RULESETNAME_PARAM = "$L.rulesetName";
    const ACTION_PARAM = "$L.action";

    const SMFILE_ATTR = "$L.smFile";
    const RULESETNAME_ATTR = "$L.rulesetName";
    const ACTION_ATTR = "$L.action";

    var logger = getLog("RunScheduledActionScheduleExecutor");

    return {
        init: function(request) {},

        /**
         * To run the schedule action, which is invoked by schedule in backend while it is expired.
         *
         * @public
         * @param {object}
         *          request - request, the parsed in attributes are fileName, recordID, condition, rulesetName and action.
         *
         */
        executeScheduleApplication: function(request) {
            var fileName = request.getParameter(FILENAME_PARAM);
            var recordID = request.getParameter(RECORDID_PARAM);
            var condition = request.getParameter(COND_PARAM);
            var conditionXml = request.getParameter(CONDXML_PARAM);
            var rulesetName = request.getParameter(RULESETNAME_PARAM);
            var action = request.getParameter(ACTION_PARAM);

            // 1. get the record according to fileName and recordID
            var dbdictService = $("#dbdictService");
            var dbdict = dbdictService.getValidDbdict(fileName);
            if (null == dbdict) {
                funcs.log("dbdict " + fileName + " does not exist...");
                return;
            }
            var pk = dbdictService.getPrimaryKey(dbdict.key);
            if (null == pk) {
                logger.warn("Primary Key of dbdict " + fileName + " does not exist...");
                return;
            }
            var pkField = (pk.name)[0];

            // find the record
            var query = pkField + "=\"" + recordID + "\"";
            var record = $(fileName).select(query).uniqueResult();
            if (null == record) {
                logger.warn("The record of " + fileName + " with primary key value " + recordID + " does not exist...");
                return;
            }

            // 2. check condition
            if (condition != null && condition != "") {
                // init context for checking condition
                vars.$L_file = record;
                vars.$L_file_save = record;
                vars.$L_object = $("Object", SCFILE_READONLY).select("file.name=\"" + fileName + "\"").uniqueResult();
                //QCCR1E157996, add check for category is null or empty value
                //if(null != vars.$L_object) {
                if (null != vars.$L_object && (null != vars.$L_object["category.file.name"] && "" != vars.$L_object["category.file.name"])) {
                    vars.$L_category = $(vars.$L_object["category.file.name"], SCFILE_READONLY).select("name=\"" + record["category"] + "\"").uniqueResult();
                }
                // prepare for UO
                lib.Workflow.initVarForCondition(conditionXml);

                // evaluate condition
                var condResult = funcs.parse_evaluate(condition, 2);
                //print("--> the cond:" + condition);
                //print("--> the cond result:" + condResult);
                if (!condResult) {
                    // condition fails, then return directly
                    return;
                }
            }
            var handlers = request.handlers;

            // 3. run ruleset
            request.setAttribute(RULESETNAME_ATTR, rulesetName);
            request.setAttribute(ACTION_ATTR, action);
            request.setAttribute(SMFILE_ATTR, record);
            handlers.push(this.callRuleSetRun);

            // 4. run action
            handlers.push(this.callbackendAction);
        },

        /**
         * To run the ruleset if ruleset is configured.
         *
         * @private
         * @param {object}
         *          request - the request.
         *
         */
        callRuleSetRun: function callRuleSetRun(request) {
            var record = request.getAttribute(SMFILE_ATTR);
            var rulesetName = request.getAttribute(RULESETNAME_ATTR);

            //if (rulesetName!=null && rulesetName!="") {
            if (!_str.isBlank(rulesetName)) {
                var retDatum = new SCDatum();
                retDatum.setType(2);

                var rteNames = [];
                rteNames.push("file");
                rteNames.push("second.file");
                rteNames.push("name");
                rteNames.push("names");
                rteNames.push("values");
                rteNames.push("text");

                var rteValues = [];
                rteValues.push(record);
                rteValues.push(record);
                rteValues.push(rulesetName);
                rteValues.push([]);
                rteValues.push([]);
                rteValues.push(retDatum);
                //print("executing Ruleset.run...");
                var textDatum = new SCDatum();
                textDatum.setType(2);
                request.textDatum = textDatum;
                CallRadWithBackend("Ruleset.run", rteNames, rteValues);
            }
        },

        /**
         * To run the action if action is configured.
         *
         * @private
         * @param {object}
         *          request - the request.
         *
         */
        callbackendAction: function callbackendAction(request) {
            var result = request.getHandlerResult();
            var resultVal = request.textDatum;
            if (result === "-1" || resultVal === "bad.val") {
                request.setAttribute("$L.result", 1);
                throw "Executing RAD error.";
            }

            var bypass_bg_authcheck_org = vars.$bypass_bg_authcheck;
            var bypass_failed_validation_org = vars.$bypass_failed_validation;
            var rc;

            request.setAttribute("$L.result", 0);

            var record = request.getAttribute(SMFILE_ATTR);
            var tablename = funcs.scmsg(funcs.filename(record), "tablename");
            var key = record.getUniqueFields()[0];
            var recordId = record[key];

            var action = request.getAttribute(ACTION_ATTR);
            if (action === "1") {
                vars.$bypass_bg_authcheck = true;
                vars.$bypass_failed_validation = true;
                if (logger.isDebugEnabled()) {
                    logger.debug("executing save...");
                }
                rc = record.doAction("save");
                if (rc != RC_SUCCESS) {
                    logger.warn(`${tablename} ${recordId} callbackendAction "save" failed: ` + RCtoString(rc));
                    // Resource Unavailable or Modified
                    if (rc == RC_CANT_HAVE || rc == RC_MODIFIED) {
                        request.setAttribute("$L.result", 3);
                    } else {
                        request.setAttribute("$L.result", 1);
                    }
                }
                vars.$bypass_bg_authcheck = bypass_bg_authcheck_org;
                vars.$bypass_failed_validation = bypass_failed_validation_org;
            } else if (action !== "0" && action !== "1") {
                var ac = "_wfE:" + action;
                vars.$bypass_bg_authcheck = true;
                vars.$bypass_failed_validation = true;
                if (logger.isDebugEnabled()) {
                    logger.debug("executing backend transition " + ac + "...");
                }
                rc = record.doAction(ac);
                if (rc != RC_SUCCESS) {
                    logger.warn(`${tablename} ${recordId} callbackendAction "${ac}" failed: ` + RCtoString(rc));
                    // Resource Unavailable or Modified
                    if (rc == RC_CANT_HAVE || rc == RC_MODIFIED) {
                        request.setAttribute("$L.result", 3);
                    } else {
                        request.setAttribute("$L.result", 1);
                    }
                }
                vars.$bypass_bg_authcheck = bypass_bg_authcheck_org;
                vars.$bypass_failed_validation = bypass_failed_validation_org;
            } else {
                //print("executing do nothing");
            }
        }
    };
});

function getClass() {
    return RunScheduledActionScheduleExecutor;
}