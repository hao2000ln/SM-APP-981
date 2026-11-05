function createRecord() {
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    var argTypes = new SCDatum();
    var results = new SCDatum();


    if (!verifyRequestCategory(vars.$L_file)) {
        vars.$L_exit = "bad.val";
        system.functions.msg(system.functions.scmsg(78, "request"));
        return;
    }


    argNames.setType(8);
    argVals.setType(8);
    argTypes.setType(8);
    results.setType(8);

    argNames.push("file");
    argNames.push("name");
    argNames.push("boolean1");
    argNames.push("names");
    argNames.push("values");

    argVals.push(vars.$L_file);
    argVals.push("rm.open");
    argVals.push("true");
    argVals.push("{$L.exit}");
    argVals.push("{}");

    argTypes.push(6);
    argTypes.push(2);
    argTypes.push(4);
    argTypes.push(8);
    argTypes.push(8);

    results.push("values");

    var radResults = system.library.RAD.run("se.call.process", argNames, argVals, argTypes, results);
    vars.$L_exit = radResults.results[0].pop();

    if (vars.$L_exit == "bg")
        vars.$L_exit = "normal"
}


function verifyRequestCategory(request) {
    if (request.category == null && request.model == null) {
        return false;
    } else if (request.category != null) {
        var category = new SCFile("rmCategory");
        var rc = category.doSelect("name=\"" + request.category + "\"" + " and active=true");

        if (rc != RC_SUCCESS) {
            return false;

        }
    }

    return true;
}


/*******************************************************************************************************************************************
function nextRequestPhase(): This function would move a request to next available phase. The exceptions are Abandoned, Backout and Closure/Closed 
phases.
*******************************************************************************************************************************************/


function nextRequestPhase() {
    vars.$L_exit = "normal";

    if (vars.$L_file != null) {
        var category = "";
        var workflow = "";
        var nextPhase = "";

        funcs.cleanup(vars.$update_action);
        funcs.cleanup(vars.$rm_activity);

        if (funcs._null(vars.$L_file.update_action)) {
            vars.$update_action = ["No update provided"];
        } else {
            vars.$update_action = vars.$L_file.update_action;
            var oldrecord = new SCFile(funcs.filename(vars.$L_file));
            var rc = oldrecord.doSelect("number=\"" + vars.$L_file.number + "\"");
            if (rc == RC_SUCCESS) {
                vars.$L_file.update_action = oldrecord.update_action;
            }
        }

        vars.$rm_activity = "external update";

        var catRec = new SCFile("rmCategory");
        catRec.doSelect("name=\"" + vars.$L_file.category + "\"");

        workflow = catRec.workflow;

        var wfPhase = new SCFile("WorkflowPhase");
        wfPhase.doSelect("workflowName=\"" + workflow + "\" and tableName=\"request\" and phaseName=\"" + vars.$L_file.current_phase + "\"");

        for (i = 0; i < wfPhase.manualTransition.length(); i++) {
            if (wfPhase.manualTransition[i].mtToPhase != null && wfPhase.manualTransition[i].mtToPhase != "") {
                if (wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "ABANDONED" && wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "BACKOUT" && wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "CLOSURE") {
                    var ts = vars.$L_file.doAction(wfPhase.manualTransition[i].mtOptionName);
                    if (!ts) {
                        vars.$L_exit = "bad.val";
                    }
                    break;
                }
            }
        }

    }
}


/*******************************************************************************************************************************************
function nextTaskPhase(): This function would move a task to next available phase. The exceptions are Cancelled and Closed phases.
*******************************************************************************************************************************************/

function nextRequestTaskPhase() {
    vars.$L_exit = "normal";

    ret = true;

    if (vars.$L_file.current_phase === "Active" && vars.$L_file.status === "In Progress") {
        ret = vars.$L_file.doAction("save");
    }

    if (!ret) {
        vars.$L_exit = "bad.val";
    }

    if (vars.$L_file != null && ret) {
        var catRec = new SCFile("rmTaskCat", SCFILE_READONLY);
        catRec.doSelect("name=\"" + vars.$L_file.category + "\"");
        var workflow = catRec.workflow;

        var wfPhase = new SCFile("WorkflowPhase", SCFILE_READONLY);
        wfPhase.doSelect("workflowName=\"" + workflow + "\" and tableName=\"requestTask\" and phaseName=\"" + vars.$L_file.current_phase + "\"");

        for (i = 0; i < wfPhase.manualTransition.length(); i++) {
            if (wfPhase.manualTransition[i].mtToPhase != null && wfPhase.manualTransition[i].mtToPhase != "") {
                if (wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "CANCELLED" && wfPhase.manualTransition[i].mtToPhase.toUpperCase() != "CLOSURE") {
                    var ts = vars.$L_file.doAction(wfPhase.manualTransition[i].mtOptionName);
                    if (!ts) {
                        vars.$L_exit = "bad.val";
                    }
                    break;
                }
            }
        }
    }
}