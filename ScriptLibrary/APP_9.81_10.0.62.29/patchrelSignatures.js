var $ = lib.c.$;

/**
 * Generate signature according the patch record
 *
 * @param 	{String}	patch, name of patches record
 * @param	{String}	version, name of signature version
 */
function generatePatchSignature(patch, version) {

    var count = 0;

    // patches record
    var patches = $("patches", SCFILE_READONLY).select("name=\"" + patch + "\"").uniqueResult();
    var tables = patches.secondary;

    var i;
    var length = tables.length();
    for (i = 0; i < length; i++) {
        var table = tables[i];
        var tableName = table[0];
        var tableQuery = table[2];

        if (tableQuery == "false") {
            continue;
        }

        // generate signatures by each table
        count += generateFileSignatures(tableName, tableQuery, version);
    }

    print("Make " + count + " Signatures totally.");
}


/**
 * Generate file signatures
 *
 * @param 	{String}	table, table name
 * @param 	{String}	query, query string
 * @param	{String}	version, name of signature version
 * @returns {Number}	count of created signature
 */
function generateFileSignatures(table, query, version) {

    if (!lib.upgradeUtility.isDbdictExist(table)) {
        return 0;
    }

    // signaturemake record
    var make = $("signaturemake", SCFILE_READONLY).select("table.name=\"" + table + "\"").uniqueResult();
    var key = make.key;

    var tod = new Date();
    var count = 0;

    $(table, SCFILE_READONLY).select(query).iterate(function(record) {

        // ignore rad parameter format
        if (table == "format") {
            var code = $("code", SCFILE_READONLY).setFields(["application"]).select('application="' + record.name + '"').uniqueResult();
            if (code) {
                return false;
            }
        }

        // make signature
        var sig;
        var fieldType = make.fieldarray_type;
        if (fieldType != null) {
            sig = funcs.make_sig(record, make.fields, make.fieldarray_type);
        } else {
            sig = funcs.make_sig(record);
        }

        // generate object name
        var length = key.length();
        var i;
        var objName = "";
        for (i = 0; i < length; i++) {
            var value = record[key[i]];
            value = (value != null ? funcs.str(value) : "NULL");
            objName += value;
        }

        // query existed signature
        var sigQuery = "object.type=\"" + table + "\" and " +
            "object.name=\"" + lib.StringUtil.escapeAllStr(objName) + "\" and " +
            "signature=\"" + sig + "\"";

        var sigRecord = $("signatures", SCFILE_READONLY).setFields(["object.type"]).select(sigQuery).uniqueResult();
        if (sigRecord) {
            return false;
        }

        // insert signature record
        sigRecord = new SCFile("signatures");
        sigRecord.object_type = table;
        sigRecord.object_name = objName;
        sigRecord.signature = sig;
        sigRecord.release_version = version;
        sigRecord.type = "Release";
        sigRecord.signature_date = tod;
        sigRecord.tag = lib.upgradeSignatures.getTag(record);

        var rc = sigRecord.doInsert();
        if (rc != RC_SUCCESS) {
            print(funcs.scmsg(124, "patchrel", [table, objName]));
            return false;
        }

        count++;

        if (count % 1000 == 0) {
            print("Make " + count + " Signatures for table " + table + ".");
        }
    });

    print("Make " + count + " Signatures for table " + table + ".");

    return count;
}


//generatePatchSignature("APM", "SM9.71.0008");
//generateFileSignatures("scmessage", 'class="tablename" and message.id="OctaneInfoMore"', "SM9.71.0008Fix");
//generateFileSignatures("ScriptLibrary", "true", "SM9.71.0008");
//generateFileSignatures("dbdict", "true", "SM9.71.0008");