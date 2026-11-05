var $ = lib.c.$;


var IncidentService = $({

    countActiveTasksOfIncident: function(incidentID) {

        var imTaskList = new SCFile("imTask", SCFILE_READONLY);
        imTaskList.setFields("id");
        var querySQL = "parent.incident=\"" + incidentID + "\" and open=true and (current.phase=\"Active\" or current.phase=\"Review\")";
        var nCount = imTaskList.doCount(querySQL);
        var rc = getLastRC();
        if (rc == RC_SUCCESS) {
            return nCount;
        } else {
            return -1;
        }
    },

    autoCancelWaitingTasksOfIncident: function(incidentID) {

        var imTaskList = new SCFile("imTask");
        var querySQL = "parent.incident=\"" + incidentID + "\" and open=true and current.phase=\"Waiting\"";
        if (imTaskList.doSelect(querySQL) == RC_SUCCESS) {
            do {
                imTaskList.open = false;
                imTaskList.completion_code = "Cancelled";
                imTaskList.current_phase = "Cancelled";
                vars.$imt_update = "Auto Cancelled";
                imTaskList.doUpdate();
            } while (imTaskList.getNext() == RC_SUCCESS);
        }

        return true;
    },

    getFilteredCIList: function(incidentID) {

        var ciList = [];
        if (incidentID == null || incidentID == "") {
            return ciList;
        }

        var incident = new SCFile("probsummary", SCFILE_READONLY);
        incident.setFields(["affected.item", "logical.name"]);
        var querySQL = "number=\"" + incidentID + "\"";
        if (incident.doSelect(querySQL) == RC_SUCCESS) {

            ciList.push(incident.affected_item);

            if (incident.logical_name != null) {
                ciList.push(incident.logical_name);
            }
        }

        return ciList;
    },

    getLastTaskNo: function(incidentID) {
        var initDbdictFile = lib.dbdictHelper.initDbdictFile;
        var dbType = lib.dbdictHelper.getDbType();
        var adapter = lib.DataService.getAdaptor(dbType);
        var imTaskSqlTable = $("#dbdictService").getPrimaryTable(initDbdictFile("imTask"))[1];

        var sql = "select count(*) from " + imTaskSqlTable + " WHERE " + adapter.escapeField("PARENT_INCIDENT") + "= '" + incidentID + "'";
        lib.RAD.run("SQLselect", ["table", "query"], ["", sql], [6, 6], ["table"]);
        funcs.evaluate(funcs.parse("$L.lastno=1 in contents(1 in $smtestresult)", 11));

        return funcs.nullsub(vars.$L_lastno, 0);
    },

    getIncidentTaskId: function(incidentID) {
        var taskIDTmp = (this.getLastTaskNo(incidentID) + 1).toString();
        var length = 3;
        if (vars.$G_pm_global_environment.prefix_or_suffix != null) {
            length = vars.$G_pm_global_environment.prefix_or_suffix;
        }
        var i;
        for (i = taskIDTmp.length; i < length; i++) {
            taskIDTmp = "0" + taskIDTmp;
        }

        var taskID = incidentID + "-" + taskIDTmp;
        return taskID;
    },

    clearActivityVarsOfIncident: function() {
        funcs.cleanup(vars['$apm.activity']);
        funcs.cleanup(vars['$pmc.actions']);
        var record = vars['$L.file'];
        if (record != null) {
            record['cust.visible'] = false;
        }
    },

    clearActivityVarsOfIncidentTask: function() {
        funcs.cleanup(vars.$imt_activity);
        funcs.cleanup(vars.$imt_update);
    },

    countOpenDependRecord: function(rid, dependfname) {
        var sql = "source=\"" + rid + "\" and depend.filename=\"" + dependfname + "\" and depend.active=true";
        var count = $("screlation", SCFILE_READONLY).fields("source").count(sql);
        return count;
    },

    getWFPhase: function(incident) {
        var objectFile = $("Object", SCFILE_READONLY).fields("category.file.name").select("file.name=\"probsummary\"").uniqueResult();
        if (null == objectFile) {
            return null;
        }
        var categoryFile = $(objectFile.category_file_name, SCFILE_READONLY).fields("workflow").select("name=\"" + incident.category + "\"").uniqueResult();
        if (null == categoryFile) {
            return null;
        }
        return $("WorkflowPhase").select("tableName=\"probsummary\" and phaseName=\"" + incident.current_phase + "\" and workflowName=\"" + categoryFile.workflow + "\"").uniqueResult();
    },

    //methods for master incident functions
    clearParentRecord: function(incident) {
        incident["parent.incident"] = null;
        var screlation = $("screlation").select('type="Master to Child" and depend="' + incident.number + '"').uniqueResult();
        if (screlation) {
            return screlation.doDelete();
        }
    },

    majorReview: function(file, review) {

        if (review != null && (funcs.lng(funcs.denull(review)) != 0)) {
            var operator = funcs.nullsub(funcs.operator(), "NULL");
            var stamp = funcs.str(funcs.tod()) + " " + vars['$lo.time.zone'] + " (" + operator + "):";
            var arrayStamp = [stamp];
            if (null == file["review.detail.log"]) {
                file["review.detail.log"] = [];
            }

            var arrayUpdateAction = arrayStamp.concat(funcs.denull(review).toArray());
            file['review.detail.log'] = arrayUpdateAction.concat(funcs.denull(file['review.detail.log']).toArray());
            funcs.cleanup(file['review.detail']);
        }
    },

    /**
     * activity journal update
     *
     * @param {SCFile} record
     * @param {Array} manualUpdate
     */
    journalUpdate: function(record, manualUpdate) {
        // allow journal update
        if (!vars.$G_pm_global_environment.journal_pm) {
            return;
        }

        var len = manualUpdate.length;
        if (record == null || record.update_action == null || len == 0) {
            return;
        }

        var stamp = "----" + funcs.str(funcs.tod());
        // append timezone
        if (vars.$G_pm_global_environment.exit) {
            stamp += " " + vars.$lo_time_zone;
        }
        var operator = lib.ActivityUtil.getUserName(vars.$G_pm_global_environment["full.name"]) || "NULL";
        stamp += " (" + operator + "):";

        // journal update order
        var journalOrder = vars.$G_pm_global_environment.journal_pm_order;
        if (journalOrder == null) {
            journalOrder = 1;
        }

        var i;
        record.update_action = funcs.denull(record.update_action);

        // insert to the beginning of array
        if (journalOrder == 1) {
            for (i = len - 1; i >= 0; i--) {
                record.update_action.unshift(manualUpdate[i]);
            }
            record.update_action.unshift(stamp);
        }
        // append to the end of array
        else if (journalOrder == 2) {
            record.update_action.push(stamp);
            for (i = 0; i < len; i++) {
                record.update_action.push(manualUpdate[i]);
            }
        }
    }

});

function getClass() {
    return IncidentService;
}