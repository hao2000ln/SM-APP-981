function getDistinctValues(tableName, fieldName, query) {
    var values = [];
    var seen = {};
    var file = new SCFile(tableName, SCFILE_READONLY);

    try {
        file.setFields([fieldName]);

        var rc = file.doSelect(query || "true");
        while (rc === RC_SUCCESS) {
            var value = String(file[fieldName] || "").trim();
            var key = "$" + value;

            if (value && !seen[key]) {
                seen[key] = true;
                values.push(value);
            }

            rc = file.getNext();
        }
    } finally {
        file.doClose();
    }

    values.sort();
    return values;
}

var packages = getDistinctValues("ScriptLibrary", "package");
print(JSON.stringify(packages));

//var packages = getDistinctValues(
//    "ScriptLibrary",
//    "package",
//    'name#"ESD_"'
//);
//print(JSON.stringify(packages));