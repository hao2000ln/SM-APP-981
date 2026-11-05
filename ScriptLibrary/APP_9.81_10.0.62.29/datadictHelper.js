/**
 * Check the duration fields of datadict
 * Return json array object
 *       [
 *            {
 *               "name": <datadict name>,
 *               "fields": [duration field names],
 *               "unmatched": <records number not to match duration field>,
 *               "field.unmatched": [records number not to match duration field to "fields"]
 *           }
 *       ]
 */
function checkDatadictDurationField(name) {
    var durationLine = "'" + lib.tzFunctions.convertDateStringToLocal("01/01/3000") + "'";
    
    var results = [];
    var foundResult = {};
    
    var datadict = new SCFile("datadict");
    var rc = datadict.doSelect(name ? "name=\"" + name + "\"" : "true");
    var rc2;
    var i;
    var lng;
    var fieldUsages;
    var found;
    var foundFields;
    var dbdict;
    var query;
    while (rc == RC_SUCCESS) {
        found = false;
        foundFields = [];
        fieldUsages = datadict["fieldUsage"];
        lng = lib.ArrayUtil.length(fieldUsages);
        for (i=0; i<lng; i++) {
            if (fieldUsages[i] == "duration") {
                if (!found) {
                    found = true;
                    print("datadict: " + datadict["name"]);
                }
                foundFields.push(datadict["fields"][i]);
            }
        }
    
        if (foundFields.length>0) {
            foundResult = {};
            foundResult["name"] = datadict["name"];
            foundResult["fields"] = foundFields;
            
            dbdict = new SCFile(datadict["name"]);
            query = "";
            for (i=0; i<foundFields.length; i++) {
                query += "or " + foundFields[i] + "<" + durationLine;
            }
            if (query.length>=3) {
                query = query.substring(3);
            }
        
            rc2 = dbdict.doCount(query);
        
            if (rc2>0) {
                foundResult["unmatched"] = rc2;
                foundResult["field.unmatched"] = [];
                for (i=0; i<foundFields.length; i++) {
                    query = foundFields[i] + "<" + durationLine;
                    rc2 = dbdict.doCount(query);
                    foundResult["field.unmatched"].push(rc2);
                }
            }
            
            results.push(foundResult);
        }
        rc = datadict.getNext();
    }
    
    return results;
}

/**
 * Export the duration fields of datadict to file
 */
function exportDatadictDurationFields(filename, name) {
    filename = filename || "data_policy_duration_fields.csv";
    var results = checkDatadictDurationField(name);
    if (results && results.length>0) {
        writeFile(filename, "b", "Data Policy,Duration Fields,Unmatched Records\n");
        var i;
        for (i=0; i<results.length; i++) {
            writeFile(filename, "a", "" + results[i]["name"] + "," + lib.MailUtil.smArrayToString(results[i]["fields"]) + "," + (results[i]["unmatched"] || 0) + "\n");
        }
        
        print("The data policy duration fields information is exported to " + filename);
        return;
    }
    
    print("All data policy duration fields are matched.");
}
