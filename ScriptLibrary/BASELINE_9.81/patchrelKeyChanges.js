/**
 * Constants for key types
 */
var NULLSANDDUPLICATES = 0;
var NONULLS = 4;
var NODUPLICATES = 8;
var UNIQUE = 12;
var IR = 64;


/**
 * All the key changes are listed in the below JSON object.
 * Each json object has 3 properties:
 *   adds: All the added keys
 *   updates: All the updated keys
 *   removes: All the removed keys
 * adds updates, removes have 3-4 properties also.
 *   table: The table name where the key is being applied.
 *   keyType: The type/flag of the key.
 *   columns: The columns that listed in the current key of the system.
 *   updateTo: The columns that the key is being updated to.
 */
var changes = [{
    "adds": [
        // 9.81
        { "table": "timeDuration4cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4cm3t", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4imTask", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4incidents", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4request", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4requestTask", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4rootcause", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4rootcausetask", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] },
        { "table": "timeDuration4svcCartItem", "keyType": NULLSANDDUPLICATES, "columns": ["foreign.key"] }
    ],
    "updates": [
        // 9.81
        { "table": "userinfo", "keyType": NULLSANDDUPLICATES, "columns": ["loginname", "clientip"], "updateTo": ["loginname", "clientip", "logintype"] }
    ],
    "removes": [
        // 9.81
        // { "table": "", "keyType": NULLSANDDUPLICATES, "columns": [] }
    ]
}];


/**
 * This is the main entry.
 */
function applyKeyChanges() {
    var i;
    for (i = 0; i < changes.length; i++) {
        var change = changes[i];

        var j;
        for (j = 0; j < change.adds.length; j++) {
            lib.upgradeKeyChanges.addKey(change.adds[j]);
        }
        for (j = 0; j < change.updates.length; j++) {
            lib.upgradeKeyChanges.updateKey(change.updates[j]);
        }
        for (j = 0; j < change.removes.length; j++) {
            lib.upgradeKeyChanges.removeKey(change.removes[j]);
        }
    }
}


/*
 * these datadict are special, 
 * need to change unique key of dbdict instead of datadict
 */
var excludeDatadictList = ["computerprintersuniq", "outage"];


/**
 * synchronize unique key of datadict
 */
function synchronizeDatadictUniqueKey(bUpdate) {
    var count = 0;
    var fDbdict = new SCFile("dbdict", SCFILE_READONLY);
    fDbdict.setFields(["name", "key"]);
    var rc = fDbdict.doSelect("true");

    while (rc == RC_SUCCESS) {
        var name = fDbdict.name;

        // query datadict
        var fDatadict = new SCFile("datadict");
        var rc2 = fDatadict.doSelect("name=\"" + name + "\"");

        if (rc2 == RC_SUCCESS) {
            var key = getUniqueKey(fDbdict);

            // correct the key value if dbdict and datadict are not same		
            if (!sameKey(key, fDatadict.unique_key) && !lib.ArrayUtil.contains(excludeDatadictList, name)) {
                count++;

                if (bUpdate) {
                    fDatadict.unique_key = key;

                    var rcDatadict = fDatadict.doUpdate();
                    if (rcDatadict == RC_SUCCESS) {
                        lib.patchrelHelper.info(funcs.scmsg(201, "object", ["datadict", name]));
                    } else {
                        lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["datadict", name]));
                    }
                } else {
                    print(name + ": " + "dbdict key - {" + key.toArray() + "}, datadict key - {" + fDatadict.unique_key.toArray() + "}");
                }
            }
        }

        rc = fDbdict.getNext();
    }

    return count;
}


/**
 * synchronize unique key of object
 */
function synchronizeObjectUniqueKey(bUpdate) {
    var count = 0;
    var fObject = new SCFile("Object");
    var rc = fObject.doSelect("true");

    while (rc == RC_SUCCESS) {
        var name = fObject.file_name;

        // query datadict
        var fDatadict = new SCFile("datadict", SCFILE_READONLY);
        fDatadict.setFields(["unique.key"]);
        var rc2 = fDatadict.doSelect("name=\"" + name + "\"");

        if (rc2 == RC_SUCCESS) {
            var key = fDatadict.unique_key;

            // correct the key value if Object and datadict are not same		
            if (!sameKey(fObject.unique_field, key)) {
                // sometimes dbdict/datadict has no unique key
                if (key != null && key.length() > 0) {
                    count++;

                    if (bUpdate) {
                        fObject.unique_field = key;

                        var rcObject = fObject.doUpdate();
                        if (rcObject == RC_SUCCESS) {
                            lib.patchrelHelper.info(funcs.scmsg(201, "object", ["Object", name]));
                        } else {
                            lib.patchrelHelper.error(funcs.scmsg(121, "patchrel", ["Object", name]));
                        }
                    } else {
                        print(name + ": " + "Object key - {" + fObject.unique_field.toArray() + "}, datadict key - {" + key.toArray() + "}");
                    }
                }
            }
        }

        rc = fObject.getNext();
    }

    return count;
}


/**
 * get unique key of dbdict
 */
function getUniqueKey(dbdict) {
    var keys = dbdict.key;
    var ukey = null;
    var length = keys.length();
    var i;

    for (i = 0; i < length; i++) {
        var key = keys[i];

        // primary key
        if (key[0] == 28) {
            ukey = key[1];
            break;
        }

        // first unique key
        if (key[0] == 12 && ukey == null) {
            ukey = key[1];
        }
    }

    return ukey;
}


/**
 * determine whether 2 keys are same
 */
function sameKey(key1, key2) {
    if (key1 == null && key2 == null) {
        return true;
    }

    if ((key1 == null && key2.length() == 0) || (key2 == null && key1.length() == 0)) {
        return true;
    }

    if (key1 == null || key2 == null) {
        return false;
    }

    var lng = key1.length();
    if (lng != key2.length()) {
        return false;
    }

    var i;
    for (i = 0; i < lng; i++) {
        if (key1[i] != key2[i]) {
            return false;
        }
    }

    return true;
}