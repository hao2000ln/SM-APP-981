function getUserName(useFullName) {
    var operator = funcs.operator();
    if (useFullName) {
        vars.$lo_ufname = vars.$lo_ufname || (operator || "NULL");
        return vars.$lo_ufname;
    } else {
        operator = operator || "NULL";
        return operator;
    }
}

function journalUpdate(record, manualUpdate) {
    var len = manualUpdate.length;
    if (record == null || record.update_action == null || len == 0) {
        return;
    }
    var operator = funcs.operator();
    var temp = funcs.str(funcs.tod()) + " " + vars['$lo.time.zone'] + " (" + operator + "):";
    var i;
    record.update_action = funcs.denull(record.update_action);
    for (i = len - 1; i >= 0; i--) {
        record.update_action.unshift(manualUpdate[i]);
    }
    record.update_action.unshift(temp);
}

function getActivityValue(filename) {
    var values = {
        "incidents": vars.$update_action,
        "sla": vars.$update_action,
        "request": vars.$update_action,
        "requestTask": vars.$rmt_update,
        "probsummary": vars.$pmc_actions,
        "timeperiodDefinition": vars.$tp_actions,
        "imTask": vars.$imt_update,
        "cm3r": vars.$cm_update,
        "cm3t": vars.$cmt_update,
        "joinsvcDisplay": vars.$svc_actions,
        "featuretracker": vars.$ft_actions,
        "SurveyDefinition": vars.$survey_actions,
        "kmdocument": vars.$km_activity_update,
        "rootcause": vars.$rc_update,
        "knownerrortask": vars.$ket_update,
        "rootcausetask": vars.$pmt_update,
        "device": vars.$ci_actions
    };

    // device joinfile
    if (lib.ArrayUtil.contains(vars.$G_joinfiles, filename)) {
        filename = "device";
    }

    var result = "";
    var value = values[filename];
    if (value != null) {
        if (typeof value == "string") {
            result = value;
        } else {
            result = value.toArray().join(" ");
        }
    }

    return result;
}

/**
 *  Check if the activity contents includes unallowed list
 *  Can only be used in RuleSet
 *  record: the current record
 *  Return JSON result.
 *    when succeed: {"returnCode": 0}
 *    when fail: {"returnCode": 1, "message": <checkxss message>, "msgType": 3}
 */
function checkHtmleditorXss(record) {
    var result = { "returnCode": 0 };

    var msg = new SCDatum();

    var file = new SCFile("incidents");
    var filename = funcs.filename(record);
    file.title = getActivityValue(filename);

    funcs.rtecall("checkxss", null, msg, file, true);
    funcs.rtecall("checkxss", null, msg, record, false);
    if (!funcs._null(msg)) {
        result.returnCode = 1;
        result.message = msg;
        result.msgType = 3;
        if (vars["$G.ess"]) {
            vars["$bypass.failed.validation"] = false;
        }
    }

    return result;
}