var filename = system.functions.filename(record);
var webUrl = system.functions.get_web_url();


function printMsg(sMessage, sSeverity) {
    sSeverity = sSeverity ? sSeverity : "1";
    if (!sMessage) {
        return false;
    }
    var scRetVal = new SCDatum();
    system.functions.rtecall("msg", scRetVal, sMessage, sSeverity);
}

// call RULESET
function callRuleSet(file, rulename) {
    //send notification
    var rteReturnValue = new SCDatum();
    var rteNames = new SCDatum();
    var rteVals = new SCDatum();
    rteNames.setType(8); //type array
    rteNames.push("file"); //Current File
    rteNames.push("name"); //RuleSet Name
    rteVals.setType(8);
    rteVals.push(file); // Incident Record
    rteVals.push(rulename); //RuleSet Name
    system.functions.rtecall("callrad", rteReturnValue, "Ruleset.run", rteNames, rteVals, false); //false to run in the same thread, true to run in new one.
}

function generateNextNumber(tableName) {
    var nRtn = new SCDatum();
    var nNumber = new SCDatum();
    system.functions.rtecall("getnumber", nRtn, nNumber, tableName);
    return nNumber.getText();
}

// RAD: se.call.process
function se_call_process(file, processName, bg, multRecord, env, tranList, fileSave, objects, names, values)
{
    var params = [
        input_File('file', file),
        input_String('name', processName),
        input_Logical('boolean1', bg),
        input_Logical('cond.input', multRecord),
        input_File('record', env),
        output_Logical('text'), // Run standard after completion
        input_File('second.file', tranList),
        input_File('second.record', fileSave),
        input_Array('file.variables', objects),
        inout_Array('names', names),
        inout_Array('values', values)
    ];
    
    var results = invokeRAD('se.call.process',params);
    
    return results;
}

/**
 * Show message box
 *
 * @param {String} message
 * @param {Number} type
 */
function ShowMessageBox(message, type) {
    var params = {
        "text": message
    };

    if (type != null) {
        params.index = type;
    }

    $.callrad("mb.ok", params, true);
}