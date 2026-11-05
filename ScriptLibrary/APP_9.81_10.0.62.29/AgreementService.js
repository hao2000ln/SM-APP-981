var $ = lib.c.$;
var _denull = funcs.denull;

var AgreementService = $(new function() {
    return {
        journalUpdate: function(file, update) {
            if (update != null && funcs.lng(funcs.denull(update)) != 0) {
                var operator = funcs.nullsub(funcs.operator(), "NULL");
                var stamp = funcs.str(funcs.tod()) + " " + vars['$lo.time.zone'] + " (" + operator + "):";
                var arrayStamp = [];
                arrayStamp.push(stamp);
                if (null == file["update.action"]) {
                    file["update.action"] = [];
                }
                var arrayUpdateAction = arrayStamp.concat(funcs.denull(update).toArray());
                file['update.action'] = arrayUpdateAction.concat(funcs.denull(file['update.action']).toArray());
            }
        },

        clearActivityVars: function() {
            funcs.cleanup(vars['$slm.activity']);
            funcs.cleanup(vars['$update.action']);
        },

        getAgreementCategory: function(agreementID) {
            var agreement = this.getAgreementRecordByID(agreementID, ["category"]);
            if (null == agreement) {
                return null;
            } else {
                return agreement.category;
            }
        },

        getWFPhase: function(agreement) {
            var objectFile = $("Object").select("file.name=\"sla\"").uniqueResult();
            if (null == objectFile) {
                return null;
            }
            var categoryFile = $(objectFile.category_file_name, SCFILE_READONLY).fields("workflow").select("name=\"" + agreement.category + "\"").uniqueResult();
            if (null == categoryFile) {
                return null;
            }
            return $("WorkflowPhase").select("tableName=\"sla\" and phaseName=\"" + agreement.current_phase + "\" and workflowName=\"" + categoryFile.workflow + "\"").uniqueResult();
        },

        getAgreementRecordByID: function(agreementID, fields) {
            if (agreementID == null) {
                return null;
            }
            var agreement;
            if (fields) {
                agreement = $("!sla").fields(fields);
            } else {
                agreement = $("sla");
            }
            return agreement.select("agreement.id=" + agreementID).uniqueResult();
        }
    };
});

function getClass() {
    return AgreementService;
}