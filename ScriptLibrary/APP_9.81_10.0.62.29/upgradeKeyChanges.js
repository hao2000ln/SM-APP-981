/**
 * This script is used for upgrade to automatically update keys in Service Manager tables.
 * The solution is update keys in "dbdict" table since "dbdict" table stores all the table information.
 * Furthermore, whenever we update the keys in this table, triggers will be triggered
 * to create or remove the keys in RDBMS.
 *
 * Flags for reference:
 * 0: Nulls & Duplicates
 * 4: No Nulls
 * 8: No Duplicates
 * 12: Unique
 * 
 * Author: Wang, Weihua
 * Date: 2010-12-31
 */

/**
 * Version is the index in the array located at patch.config panel of RAD apm.upgrade.wizard.
 */
var verArr = lib.upgradeConstants.FULL_VERSIONS();
var targetVer = lib.upgradeConstants.TARGET_VERSION();
var SM930 = funcs.index("9.30.000", verArr);
var SM932 = funcs.index("9.32.0016", verArr);
var SM940 = funcs.index("9.40.0015", verArr);
var SM950 = funcs.index("9.50.0025", verArr);
var SM960 = funcs.index("9.60.0025", verArr);
var SM970 = funcs.index("9.70.0024", verArr);
var LATEST = 10000;


/**
 * Constants for key types
 */
var NULLSANDDUPLICATES = 0;
var NONULLS = 4;
var NODUPLICATES = 8;
var UNIQUE = 12;
var PRIMARY = 28;
var IR = 64;

/**
 * All the key changes are listed in the below JSON object.
 * Each json object has four properties:
 *   version:The version index from when the keys were changed.
 *   adds: All the keys listed here are added from this version.
 *   updates: All the keys listed here are updated from this version.
 *   removes: All the keys listed here are removed from this version.
 * adds updates, removes have 3-4 properties also.
 *   table: The table name where the key is being applied.
 *   keyType: The type/flag of the key.
 *   columns: The columns that listed in the current key of the system.
 *   updateTo: The columns that the key is being updated to.
 *
 *************************************************************
 * Since UNQIUE key and NO DUPLICATES keys were covered by generic method:applyUniqueKeyChanges,
 * they can be removed from the following json list. 
 *************************************************************
 */
var changes = [{
        "version": SM930,
        "adds": [
            { "table": "Approval", "keyType": NULLSANDDUPLICATES, "columns": ["approvals.record"] },
            { "table": "Approval", "keyType": NONULLS, "columns": ["approval.status"] },
            { "table": "ApprovalSourceBackup", "keyType": NULLSANDDUPLICATES, "columns": ["parent.tag"] },
            { "table": "svcCartItem", "keyType": NULLSANDDUPLICATES, "columns": ["requested.for"] },
            { "table": "userinfo", "keyType": NULLSANDDUPLICATES, "columns": ["loginname", "clientip"] }
        ],
        "updates": [],
        "removes": []
    },
    {
        "version": SM940,
        "adds": [
            { "table": "Approval", "keyType": NULLSANDDUPLICATES, "columns": ["current.pending.groups"] },
            { "table": "datadict", "keyType": NULLSANDDUPLICATES, "columns": ["sc.area"] },
            { "table": "globallists", "keyType": NULLSANDDUPLICATES, "columns": ["display.variable"] },
            { "table": "globallists", "keyType": NULLSANDDUPLICATES, "columns": ["list.variable"] },
            { "table": "inbox", "keyType": NULLSANDDUPLICATES, "columns": ["report.category"] },
            { "table": "inbox", "keyType": NULLSANDDUPLICATES, "columns": ["inbox.name"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["alternate.contact", "callback.contact", "open", "opened.by"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["opened.by"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["opened.by.uid", "contact.name"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["assignee.name"] },
            { "table": "kmknowledgebaseupdates", "keyType": NULLSANDDUPLICATES, "columns": ["collectionname"] },
            { "table": "kmknowledgebaseupdates", "keyType": NULLSANDDUPLICATES, "columns": ["action"] },
            { "table": "probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["parent.incident"] },
            { "table": "probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["assignee.name"] },
            { "table": "rootcause", "keyType": NULLSANDDUPLICATES, "columns": ["assignee.name"] },
            { "table": "rootcausetask", "keyType": NULLSANDDUPLICATES, "columns": ["assignee.name"] },
            { "table": "sla", "keyType": NULLSANDDUPLICATES, "columns": ["category", "current.phase"] },
            { "table": "syslog", "keyType": NULLSANDDUPLICATES, "columns": ["user.sid"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["callback.contact", "open"] },
            // 9.41
            { "table": "ApprovalDelegation", "keyType": NULLSANDDUPLICATES, "columns": ["Enable", "AppGroup", "AppModule", "DateFrom", "DateTo"] },
            { "table": "cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["sysmodtime"] },
            { "table": "device", "keyType": NULLSANDDUPLICATES, "columns": ["sysmodtime"] },
            { "table": "device", "keyType": NULLSANDDUPLICATES, "columns": ["asset.tag"] },
            { "table": "device", "keyType": NULLSANDDUPLICATES, "columns": ["owner"] },
            { "table": "device", "keyType": NULLSANDDUPLICATES, "columns": ["subtype"] },
            { "table": "device", "keyType": NULLSANDDUPLICATES, "columns": ["assignment"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["approval.status"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["callback.contact", "open"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["sysmodtime"] },
            { "table": "probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["affected.item", "number"] },
            { "table": "probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["id"] },
            { "table": "probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["sysmodtime"] },
            { "table": "request", "keyType": NULLSANDDUPLICATES, "columns": ["open"] },
            { "table": "request", "keyType": NULLSANDDUPLICATES, "columns": ["sysmodtime"] },
            { "table": "rootcause", "keyType": NULLSANDDUPLICATES, "columns": ["sysmodtime"] }
        ],
        "updates": [],
        "removes": [
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["alternate.contact", "callback.contact", "contact.name", "open", "opened.by"] },
            { "table": "lock", "keyType": NULLSANDDUPLICATES, "columns": ["pid"] },
            { "table": "lockshared", "keyType": NULLSANDDUPLICATES, "columns": ["pid"] },
            // 9.41
            { "table": "device", "keyType": NULLSANDDUPLICATES, "columns": ["id", "location"] }
        ]
    },
    {
        "version": SM950,
        "adds": [
            { "table": "contacts", "keyType": NULLSANDDUPLICATES, "columns": ["email"] },
            { "table": "cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["header,assigned.to"] },
            { "table": "cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["affected.item"] },
            { "table": "cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["middle,assets"] }, // Cannot apply the key as upgrade doesn't convert array to alias table
            { "table": "cm3t", "keyType": NULLSANDDUPLICATES, "columns": ["header,assigned.to"] },
            { "table": "cm3t", "keyType": NULLSANDDUPLICATES, "columns": ["affected.item"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["open", "category"] }, //missed in SM941
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["logical.name"] }, //missed in SM941
            { "table": "ModuleStatus", "keyType": NONULLS, "columns": ["module"] },
            { "table": "operator", "keyType": NULLSANDDUPLICATES, "columns": ["email"] },
            { "table": "problem", "keyType": NULLSANDDUPLICATES, "columns": ["middle,logical.name"] }, //missed in SM941
            { "table": "SurveyInternal", "keyType": NULLSANDDUPLICATES, "columns": ["contact.name", "status"] },
            { "table": "SurveyInternal", "keyType": NULLSANDDUPLICATES, "columns": ["status"] }
        ],
        "updates": [],
        "removes": [
            { "table": "cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["header", "header,assigned.to"] },
            { "table": "cm3r", "keyType": NULLSANDDUPLICATES, "columns": ["middle,logical.name"] },
            { "table": "cm3t", "keyType": NULLSANDDUPLICATES, "columns": ["header", "header,assigned.to"] },
            { "table": "cm3t", "keyType": NULLSANDDUPLICATES, "columns": ["middle,logical.name"] },
            { "table": "svcSrcSurveyConfig", "keyType": UNIQUE, "columns": ["company", "dest.file.name", "dest.field.name"] }
        ]
    },
    {
        "version": SM960,
        "adds": [
            // 9.62
            { "table": "ApprovalSourceBackup", "keyType": NULLSANDDUPLICATES, "columns": ["parent.tag"] },
            { "table": "svcCart", "keyType": NULLSANDDUPLICATES, "columns": ["sdID"] },
            { "table": "svcCartItem", "keyType": NULLSANDDUPLICATES, "columns": ["cartId"] },
            { "table": "svcCartItem", "keyType": NULLSANDDUPLICATES, "columns": ["requested.for", "bundle", "completed"] },
            { "table": "svcCatalog", "keyType": NULLSANDDUPLICATES, "columns": ["type", "parent", "active", "access.list"] },
            // 9.63
            { "table": "SMISTaskLog", "keyType": NULLSANDDUPLICATES, "columns": ["internal.id"] },
            { "table": "Todo", "keyType": NULLSANDDUPLICATES, "columns": ["assignee"] }
        ],
        "updates": [],
        "removes": []
    },
    {
        "version": SM970,
        "adds": [
            // 9.70
            { "table": "probsummary", "keyType": NULLSANDDUPLICATES, "columns": ["assignee.name", "update.time"] }
        ],
        "updates": [],
        "removes": []
    },
    {
        "version": LATEST,
        "adds": [
            // 9.80
            { "table": "SMISTaskLog", "keyType": UNIQUE, "columns": ["task.id"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["update.time"] },
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
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["propel.request.id"] },
            { "table": "incidents", "keyType": NULLSANDDUPLICATES, "columns": ["propel.order.id"] }
        ]
    }
];

/**
 * When unique/primary/no duplicates key of one Dbdict is removed or updated, it may cause full table copy. If there are lots of records, it may cause low performance during upgrade.
 * So we suggest to ignore to upgrade unique/primary/no duplicates key for the dbdict.
 * Please add the dbdict name into the array after the file transfer.bin is loaded. For example, 
 *     var DBDICT_IGNORE_UNIQUE_KEY = ["dbdictA", "dbdictB"];
 */
var DBDICT_IGNORE_UNIQUE_KEY = [];

/**
 * This is the main entry.
 */
function applyKeyChanges() {

    lib.upgradeLog.scUpgrade("APPLYING_KEY_CHANGES");
    lib.upgradeLog.scDetail("APPLYING_KEY_CHANGES");

    applyUniqueKeyChanges();
    applyIRKeyChanges();
    applyNonUniqueKeyChanges();

    lib.upgradeLog.scUpgrade("KEY_CHANGES_APPLIED");
    lib.upgradeLog.scDetail("KEY_CHANGES_APPLIED");
}


function applyIRKeyChanges() {
    var newfile = new SCFile("upgradedbdict");
    var rc = newfile.doSelect("name~#\"upgrade\" and name~=\"patches\" and name~=\"signatures\" and name~=\"upgverbld\"");
    while (rc == RC_SUCCESS) {
        if (!isNewDbdict(newfile.name)) {
            var oldfile = new SCFile("dbdict");
            rc = oldfile.doSelect("name = \"" + newfile.name + "\"");
            if (rc == RC_SUCCESS) {
                mergeIRKey(newfile, oldfile);
            }
        }
        rc = newfile.getNext();
    }
}

function applyUniqueKeyChanges() {
    var newfile = new SCFile("upgradedbdict");
    var rc = newfile.doSelect("name~#\"upgrade\" and name~=\"patches\" and name~=\"signatures\" and name~=\"upgverbld\"");
    while (rc == RC_SUCCESS) {
        if (!isNewDbdict(newfile.name)) {
            var oldfile = new SCFile("dbdict");
            rc = oldfile.doSelect("name = \"" + newfile.name + "\"");
            if (rc == RC_SUCCESS) {
                if (lib.ArrayUtil.contains(DBDICT_IGNORE_UNIQUE_KEY, oldfile.name)) {
                    lib.upgradeLog.scError("UNQ_KEY_IGNORE_DBDICT", [oldfile.name]);
                } else {
                    mergeUniqueKey(newfile, oldfile);
                }
            }
        }
        rc = newfile.getNext();
    }
}

function mergeIRKey(newfile, oldfile) {
    var newIRIndex = findIRKeyIndex(newfile.key);
    var oldIRIndex = findIRKeyIndex(oldfile.key);

    var oldkey = [];
    var newkey = [];
    var updated = false;

    if (newIRIndex != -1) {
        if (oldIRIndex == -1) {
            oldfile.key.push(newfile.key[newIRIndex]);
            newkey = newfile.key[newIRIndex].name.toArray();
            updated = true;
        } else {
            var copy = oldfile.key[oldIRIndex].name.toArray();
            if (mergeColumns(oldfile.key[oldIRIndex].name, newfile.key[newIRIndex].name)) {
                oldkey = copy;
                newkey = newfile.key[newIRIndex].name.toArray();
                updated = true;
            }
        }
        if (updated) {
            var rc = oldfile.doUpdate();
            if (rc == RC_SUCCESS) {
                lib.upgradeLog.scDetail("UNQ_KEY_CHG_APPLIED", [getKeyTypeString(IR), oldfile.name, oldkey, newkey]);
            } else {
                lib.upgradeLog.scError("FAIL_TO_UPD_KEY", [getKeyTypeString(IR), oldkey, newkey, oldfile.name]);
            }
        }
    }
}

/**
 * "unique" includes "unique" and "no duplicates".
 * This function only processes those two kinds of keys. Those keys should not be modified by customer.
 * In case customer modified these keys, new keys will cover the old ones.
 */
function mergeUniqueKey(newfile, oldfile) {
    var addedkeys = [];
    var removedkeys = [];
    var updated = merge(newfile.key, oldfile, addedkeys, removedkeys, oldfile.name);
    oldfile.key = funcs.denull(oldfile.key);
    if (updated) {
        addedkeys = sortKeys(addedkeys);
        var i;
        for (i = 0; i < addedkeys.length; i++) {
            var rterc = 0;
            funcs.rtecall("scantable", rterc, 1, oldfile.name, true, addedkeys[i].name.toArray());
        }

        var rc = oldfile.doUpdate();

        if (rc == RC_SUCCESS) {
            showUniqueLog(addedkeys, removedkeys, oldfile.name);
        } else {
            lib.upgradeLog.scError("UNQ_KEY_CHG_FAILED", [oldfile.name]);
        }
    }
}

// Check if the dbdict is added by upgrade
function isNewDbdict(dbdictname) {
    if (dbdictname == null) {
        return false;
    }

    var upgresult = new SCFile("upgraderesults", SCFILE_READONLY);
    upgresult.setFields(["result"]);
    var rc = upgresult.doSelect("object.type=\"dbdict\" and object.name=\"" + dbdictname + "\"");
    if (rc == RC_SUCCESS) {
        if (upgresult["result"] == "Added") {
            return true;
        }
    }

    return false;
}

function isExistInPatches(dbdictname) {
    if (dbdictname == null || dbdictname == "") {
        return false;
    }
    var patches = new SCFile("patches", SCFILE_READONLY);
    var rc = patches.doSelect("name=\"" + lib.upgradeConstants.PATCH_NAME() + "\"");
    if (rc == RC_SUCCESS) {
        if (patches.secondary != null) {
            var length = patches.secondary.length();
            var dbdictindex;
            for (dbdictindex = 0; dbdictindex < length; dbdictindex++) {
                if (patches.secondary[dbdictindex].dbdict == dbdictname) {
                    return true;
                }
            }
        }
    }
    return false;
}

function sortKeys(keys) {
    var newkeys = [];
    var i;
    var j;
    for (i = 1; i < 10; i++) {
        for (j = 0; j < keys.length; j++) {
            if (keys[j].name.toArray().length == i) {
                newkeys.push(keys[j]);
            }
        }
    }
    return newkeys;
}

/**
 * Cover the unique keys with that of upgraded version
 */
function merge(newkeys, oldfile, addedkeys, removedkeys, filename) {
    var oldkeys = oldfile.key;
    var updated = false;

    //remove the redundant unique key
    var rtevalue = removeRedundantKeys(newkeys, oldfile, removedkeys);
    updated = rtevalue[0];
    oldkeys = rtevalue[1];

    var primaryKeyCount = getPrimaryKeyCount(oldkeys);

    var length = newkeys.length();
    var i;
    for (i = 0; i < length; i++) {
        if (newkeys[i].flags == UNIQUE || newkeys[i].flags == NODUPLICATES || newkeys[i].flags == PRIMARY) {
            var keyIndex = findKeyIndex(oldkeys, newkeys[i].flags, newkeys[i].name.toArray());
            if (keyIndex == -1) {
                var keyIndex2 = lib.upgradeKeyUtils.findKeyIndex(oldkeys, newkeys[i].name.toArray());
                if (keyIndex2 == -1) {
                    var conflicted = lib.upgradeKeyUtils.checkConflictedUniqueKey(oldfile.name, oldkeys, newkeys[i]);
                    if (conflicted) {
                        lib.upgradeLog.scError("UNQ_KEY_CONFLICT", [oldfile.name, getKeyTypeString(newkeys[i].flags), debrace(newkeys[i].name.toArray())]);
                        continue;
                    }

                    if (newkeys[i].flags == PRIMARY && vars.$G_tmpUpgFrmVerSeq < SM932) {
                        lib.upgradeLog.scError("UNQ_KEY_IGNORE_PRIMARY", [oldfile.name, getKeyTypeString(newkeys[i].flags), debrace(newkeys[i].name.toArray()), debrace(newkeys[i].name.toArray())]);
                        newkeys[i].flags = UNIQUE;
                    }

                    if (newkeys[i].flags == PRIMARY && primaryKeyCount > 0) {
                        lib.upgradeLog.scError("UNQ_KEY_MORE_PRIMARY", [oldfile.name, getKeyTypeString(newkeys[i].flags), debrace(newkeys[i].name.toArray()), debrace(newkeys[i].name.toArray())]);
                        newkeys[i].flags = UNIQUE;
                    }

                    var isFixed = lib.upgradeKeyUtils.fixIssueBeforeUpdateUniqueKey(oldfile, newkeys[i]);
                    if (isFixed) {
                        oldfile.key.push(newkeys[i]); // add new key
                        addedkeys.push(newkeys[i]); // used for data scan
                        updated = true;
                    } else {
                        lib.upgradeLog.scError("FAIL_TO_ADD_KEY", [getKeyTypeString(newkeys[i].flags), newkeys[i].name, oldfile.name]);
                    }
                } else {
                    // Upgrade UNIQUE or NODUPLICATES key flag to PRIMARY key flag can be ignored 
                    if (newkeys[i].flags == PRIMARY && lib.upgradeKeyUtils.isUniqueKey(oldkeys[keyIndex2])) {
                        continue;
                    }

                    //the field of this new key had been used by an existing key, so can not be added.
                    if (oldkeys[keyIndex2].flags < newkeys[i].flags) {
                        lib.upgradeLog.scError("UNQ_KEY_ALREADY_EXIST", [oldfile.name, getKeyTypeString(newkeys[i].flags), debrace(newkeys[i].name.toArray())]);
                    }
                }
            }
        }
    }

    return updated;
}

function mergeColumns(oldcols, newcols) {
    var updated = false;
    var length = newcols.length();
    var i;
    for (i = 0; i < length; i++) {
        var index = findColIndex(oldcols.toArray(), newcols[i]);
        if (index == -1) {
            oldcols.push(newcols[i]);
            updated = true;
        }
    }
    return updated;
}

function findColIndex(cols, col) {
    var i;
    for (i = 0; i < cols.length; i++) {
        if (cols[i] == col) {
            return i;
        }
    }
    return -1;
}

/**
 * Get the number of unique(primary, unique , no duplicates) keys
 */
function getUnqiueCount(keys) {
    var count = 0;
    var i;
    var length = keys.length();

    for (i = 0; i < length; i++) {
        if (keys[i].flags == UNIQUE || keys[i].flags == NODUPLICATES || keys[i].flags == PRIMARY) {
            count++;
        }
    }
    return count;
}

/**
 * Get the number of primary keys
 */
function getPrimaryKeyCount(keys) {
    var count = 0;
    var i;
    var length = keys.length();

    for (i = 0; i < length; i++) {
        if (keys[i].flags == PRIMARY) {
            count++;
        }
    }
    return count;
}

/**
 * Remove redundant unique or no duplicates keys since those keys maybe removed in the new version.
 * Users shouldn't update unique or no duplicates keys to Service Manager.
 */
function removeRedundantKeys(newkeys, oldfile, removedkeys) {
    var oldkeys = oldfile.key;
    var updated = false;
    var i;
    var length = oldkeys.length();

    for (i = 0; i < length; i++) {
        if (oldkeys[i].flags == UNIQUE || oldkeys[i].flags == NODUPLICATES || oldkeys[i].flags == PRIMARY) {
            if (lib.upgradeKeyUtils.isCustomUniqueKey(oldfile.name, oldkeys[i])) {
                //lib.upgradeLog.scUpgrade("UNQ_KEY_KEEP_CUSTOM", [oldfile.name, getKeyTypeString(oldkeys[i].flags), debrace(oldkeys[i].name.toArray())]);
                lib.upgradeLog.scDetail("UNQ_KEY_KEEP_CUSTOM", [oldfile.name, getKeyTypeString(oldkeys[i].flags), debrace(oldkeys[i].name.toArray())]);
                continue;
            }
            if (findUniqueKeyIndex(newkeys, oldkeys[i].name.toArray()) == -1) {
                var target = new SCFile("dbdict");
                target = copyObject(oldfile, target, ["key"]);
                removedkeys[removedkeys.length] = target.key[i];
                oldfile.key = funcs._delete(oldfile.key, i + 1);
                updated = true;
                i--;
            }
        }
    }
    return [updated, oldkeys];
}

function copyObject(src, target, fieldNames) {
    funcs.recordcopy(src, fieldNames, target, fieldNames);
    return target;
}

/**
 * "NonUnique" includes "No Nulls" and "Nulls and Duplicates".
 */
function applyNonUniqueKeyChanges() {
    scanImproperKey();
    var i;
    var j;
    for (i = 0; i < changes.length; i++) {
        if (changes[i].version > vars.$G_tmpUpgFrmVerSeq) {
            for (j = 0; j < changes[i].removes.length; j++) {
                removeKey(changes[i].removes[j]);
            }
            for (j = 0; j < changes[i].updates.length; j++) {
                updateKey(changes[i].updates[j]);
            }
            for (j = 0; j < changes[i].adds.length; j++) {
                addKey(changes[i].adds[j]);
            }
        }
    }
}

/**
 * Add the key changed in upgrade
 */
function addKey(change) {
    var file = new SCFile("dbdict");
    var rc = file.doSelect("name=\"" + change.table + "\"");
    if (rc != RC_SUCCESS) {
        lib.upgradeLog.scError("FAIL_TO_ADD_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
        return;
    }
    var keyIndex = findKeyUsedIndex(file.key, change.columns);
    if (keyIndex == -1) {
        var allow = allowFieldKey(file.field, change.columns);
        if (!allow) {
            lib.upgradeLog.scError("FAIL_TO_ADD_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
            return;
        }
        var newKey = createNewKey(change.keyType, change.columns);
        file.key.push(newKey);
        rc = file.doUpdate();
        if (rc != RC_SUCCESS) {
            lib.upgradeLog.scError("FAIL_TO_ADD_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
        } else {
            lib.upgradeLog.scDetail("SUC_TO_ADD_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
        }
    } else {
        if (change.keyType == file.key[keyIndex].flags) {
            lib.upgradeLog.scDetail("KEY_ALREADY_EXISTS", [getKeyTypeString(change.keyType), change.columns, change.table]);
        } else {
            lib.upgradeLog.scError("FAIL_TO_ADD_KEY_EXISTS", [getKeyTypeString(change.keyType), change.columns, change.table, getKeyTypeString(file.key[keyIndex].flags)]);
        }
    }
}

/**
 * Update the keys changed in upgrade
 */
function updateKey(change) {
    var file = new SCFile("dbdict");
    var rc = file.doSelect("name=\"" + change.table + "\"");
    if (rc != RC_SUCCESS) {
        lib.upgradeLog.scError("FAIL_TO_UPD_KEY", [getKeyTypeString(change.keyType), change.columns, change.updateTo, change.table]);
        return;
    }
    var keyIndex = findKeyIndex(file.key, change.keyType, change.updateTo);
    if (keyIndex != -1) {
        lib.upgradeLog.scDetail("KEY_ALREADY_EXISTS", [getKeyTypeString(change.keyType), change.updateTo, change.table]);
    } else {
        keyIndex = findKeyIndex(file.key, change.keyType, change.columns);
        if (keyIndex == -1) {
            lib.upgradeLog.scError("FAIL_TO_UPD_KEY", [getKeyTypeString(change.keyType), change.columns, change.updateTo, change.table]);
        } else {
            file.key[keyIndex].name = new SCDatum(change.updateTo);
            rc = file.doUpdate();
            if (rc != RC_SUCCESS) {
                lib.upgradeLog.scError("FAIL_TO_UPD_KEY", [getKeyTypeString(change.keyType), change.columns, change.updateTo, change.table]);
            } else {
                lib.upgradeLog.scDetail("SUC_TO_UPD_KEY", [getKeyTypeString(change.keyType), change.columns, change.updateTo, change.table]);
            }
        }
    }
}

/**
 * Remove the keys changed in upgrade
 */
function removeKey(change) {
    var file = new SCFile("dbdict");
    var rc = file.doSelect("name=\"" + change.table + "\"");
    if (rc != RC_SUCCESS) {
        lib.upgradeLog.scError("FAIL_TO_RMV_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
        return;
    }
    var keyIndex = findKeyIndex(file.key, change.keyType, change.columns);
    if (keyIndex != -1) {
        file.key = funcs._delete(file.key, keyIndex + 1);
        rc = file.doUpdate();
        if (rc != RC_SUCCESS) {
            lib.upgradeLog.scError("FAIL_TO_RMV_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
        } else {
            lib.upgradeLog.scDetail("SUC_TO_RMV_KEY", [getKeyTypeString(change.keyType), change.columns, change.table]);
        }
    } else {
        lib.upgradeLog.scDetail("KEY_NOT_EXIST", [getKeyTypeString(change.keyType), change.columns, change.table]);
    }
}

function findFields(fields, columns) {
    var indexes = [];
    var i;
    for (i = 0; i < columns.length; i++) {
        indexes.push(findField(fields, columns[i]));
    }
    return indexes;
}

function findField(fields, column) {
    var f = column.split(",");
    var i;
    var j = 0;
    var c = f[j];
    var result = [];
    var length = fields.length();
    for (i = 0; i < length; i++) {
        if (fields[i].name == c) {
            if (j < f.length - 1) {
                j++;
                c = f[j];
            } else {
                result.push(fields[i]);
            }
        }
    }
    return result;
}

function allowFieldKey(fields, columns) {
    var result = findFields(fields, columns);
    var i;
    var j;
    for (i = 0; i < result.length; i++) {
        for (j = 0; j < result[i].length; j++) {
            var type = result[i][j]["sql.field.options"]["sql.data.type"];
            if (type != null && !allowIndexType(type)) {
                return false;
            }
        }
    }
    return true;
}

function allowIndexType(type) {
    // The types in typelist are not allowed.
    var typelist = ["TEXT", "NTEXT", "CLOB", "NCLOB", "CLOB(1M) NOT LOGGED COMPACT",
        "VARBINARY", "RAW", "VARCHAR(255) FOR BIT DATA",
        "IMAGE", "BLOB", "BLOB(1M) NOT LOGGED COMPACT"
    ];
    return !lib.ArrayUtil.contains(typelist, type);
}

/**
 * To find the key index in Service Manager SCFile with the specified key type(flag) and columns
 */
function findKeyIndex(keys, keyType, columns) {
    var i;
    var j;
    var length = keys.length();
    for (i = 0; i < length; i++) {
        if (keys[i].flags == keyType && keys[i].name.length() == columns.length) {
            var found = true;
            for (j = 0; j < columns.length; j++) {
                if (funcs.index(columns[j], keys[i].name) == 0) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * To find the unique/primary/no duplicates key index in Service Manager SCFile with the unique/primary/no duplicates key type(flag) and columns
 */
function findUniqueKeyIndex(keys, columns) {
    var i;
    var j;
    var length = keys.length();
    for (i = 0; i < length; i++) {
        if ((keys[i].flags == UNIQUE || keys[i].flags == NODUPLICATES || keys[i].flags == PRIMARY) && keys[i].name.length() == columns.length) {
            var found = true;
            for (j = 0; j < columns.length; j++) {
                if (funcs.index(columns[j], keys[i].name) == 0) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * To find the key index in Service Manager SCFile with the specified columns
 */
function findKeyUsedIndex(keys, columns) {
    var i;
    var j;
    var length = keys.length();
    for (i = 0; i < length; i++) {
        if (keys[i].name.length() == columns.length) {
            var found = true;
            for (j = 0; j < columns.length; j++) {
                if (funcs.index(columns[j], keys[i].name) == 0) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * To find the IR key index in Service Manager SCFile from the specified key list
 * There should be at most only one IR key in each table, so 
 */
function findIRKeyIndex(keys) {
    var i;
    var length = keys.length();
    for (i = 0; i < length; i++) {
        if (keys[i].flags == IR) {
            return i;
        }
    }
    return -1;
}

/**
 * To create a new key.
 */
function createNewKey(flag, columns) {
    var newKey = new SCDatum();
    newKey.setType(lib.DataTypeConst.typeStructure());
    newKey.push(flag);
    newKey.push(new SCDatum(columns));
    return newKey;
}

/**
 * To get the key type String, kind of map
 */
function getKeyTypeString(type) {
    switch (type) {
        case NULLSANDDUPLICATES:
            return "Nulls & Duplicates";
        case NONULLS:
            return "No Nulls";
        case NODUPLICATES:
            return "No Duplicates";
        case UNIQUE:
            return "Unique";
        case PRIMARY:
            return "Primary";
        case IR:
            return "IR";
    }
}

function showSkippedLog(addedkeys, removedkeys, filename) {
    var addedUnq = filter(addedkeys, UNIQUE);
    var rmvedUnq = filter(removedkeys, UNIQUE);
    var addedPri = filter(addedkeys, PRIMARY);
    var rmvedPri = filter(removedkeys, PRIMARY);
    var addedNdp = filter(addedkeys, NODUPLICATES);
    var rmvedNdp = filter(removedkeys, NODUPLICATES);

    if (addedUnq.length != 0) {
        lib.upgradeLog.scError("UNQ_KEY_ADD_SKIPPED", [filename, getKeyTypeString(UNIQUE), debrace(addedUnq)]);
    }

    if (rmvedUnq.length != 0) {
        lib.upgradeLog.scError("UNQ_KEY_RMV_SKIPPED", [filename, getKeyTypeString(UNIQUE), debrace(rmvedUnq)]);
    }

    if (addedPri.length != 0) {
        lib.upgradeLog.scError("UNQ_KEY_ADD_SKIPPED", [filename, getKeyTypeString(PRIMARY), debrace(addedPri)]);
    }

    if (rmvedPri.length != 0) {
        lib.upgradeLog.scError("UNQ_KEY_RMV_SKIPPED", [filename, getKeyTypeString(PRIMARY), debrace(rmvedPri)]);
    }

    if (addedNdp.length != 0) {
        lib.upgradeLog.scError("UNQ_KEY_ADD_SKIPPED", [filename, getKeyTypeString(NODUPLICATES), debrace(addedNdp)]);
    }

    if (rmvedNdp.length != 0) {
        lib.upgradeLog.scError("UNQ_KEY_RMV_SKIPPED", [filename, getKeyTypeString(NODUPLICATES), debrace(rmvedNdp)]);
    }
}

function showUniqueLog(addedkeys, removedkeys, filename) {
    var addedUnq = filter(addedkeys, UNIQUE);
    var rmvedUnq = filter(removedkeys, UNIQUE);
    var addedPri = filter(addedkeys, PRIMARY);
    var rmvedPri = filter(removedkeys, PRIMARY);
    var addedNdp = filter(addedkeys, NODUPLICATES);
    var rmvedNdp = filter(removedkeys, NODUPLICATES);

    if (addedUnq.length != 0) {
        lib.upgradeLog.scDetail("UNQ_KEY_ADD_APPLIED", [filename, getKeyTypeString(UNIQUE), debrace(addedUnq)]);
    }

    if (rmvedUnq.length != 0) {
        lib.upgradeLog.scDetail("UNQ_KEY_RMV_APPLIED", [filename, getKeyTypeString(UNIQUE), debrace(rmvedUnq)]);
    }

    if (addedPri.length != 0) {
        lib.upgradeLog.scDetail("UNQ_KEY_ADD_APPLIED", [filename, getKeyTypeString(PRIMARY), debrace(addedPri)]);
    }

    if (rmvedPri.length != 0) {
        lib.upgradeLog.scDetail("UNQ_KEY_RMV_APPLIED", [filename, getKeyTypeString(PRIMARY), debrace(rmvedPri)]);
    }

    if (addedNdp.length != 0) {
        lib.upgradeLog.scDetail("UNQ_KEY_ADD_APPLIED", [filename, getKeyTypeString(NODUPLICATES), debrace(addedNdp)]);
    }

    if (rmvedNdp.length != 0) {
        lib.upgradeLog.scDetail("UNQ_KEY_RMV_APPLIED", [filename, getKeyTypeString(NODUPLICATES), debrace(rmvedNdp)]);
    }
}

function filter(array, keyType) {
    var values = [];
    var j = 0;
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i].flags == keyType) {
            values[j++] = array[i].name.toArray();
        }
    }
    return values;
}

function debrace(array) {
    if (array.length == 1) {
        return array[0];
    }
    return array;
}

function scanImproperKey() {
    var dbdict = new SCFile("dbdict");
    var rc = dbdict.doSelect("true");
    while (rc == RC_SUCCESS) {
        scanTable(dbdict);
        rc = dbdict.getNext();
    }
}

function scanTable(table) {
    var tableType = table.field[0].sql_field_options.sql_data_type;
    var updated = false;
    var invalidFields = [];
    var deletedKeys = [];
    var sqlTypes = [];
    var keyTypes = [];
    var i;
    var length = table.key.length();

    for (i = 0; i < length; i++) {
        if (table.key[i].flags == NODUPLICATES || table.key[i].flags == UNIQUE || table.key[i].flags == PRIMARY || table.key[i].flags == IR) {
            continue;
        }

        var key = table.key[i];
        var j;
        var klength = key.name.length();
        var keynames = funcs.denull(key.name);
        var deleted = false;
        var updatedCurrent = false;
        for (j = 0; j < klength; j++) {
            if (key.name[j] == null) {
                continue;
            }
            var column = getColumnName(key.name[j]);
            var type = getColumnType(table.field, column);
            if (!isValidTypeInKey(type, tableType, key.flags)) {
                var index = funcs.index(column, invalidFields);
                if (index == 0) {
                    type = type == null ? tableType : type;
                    invalidFields[invalidFields.length] = key.name[j];
                    sqlTypes[sqlTypes.length] = type;
                    keyTypes[keyTypes.length] = getKeyTypeString(key.flags);
                }
                updated = true;
                updatedCurrent = true;
                if (key.name.length() == 1) {
                    table.key = funcs._delete(table.key, i + 1);
                    i--;
                    length--;
                    deleted = true;
                    deletedKeys[deletedKeys.length] = keynames;
                    break;
                } else {
                    key.name = funcs._delete(key.name, j + 1);
                    j--;
                    klength--;
                }
            }
        }

        // Check if key is duplicated when some fields in the key are removed.
        if (!deleted && updatedCurrent) {
            var l;
            for (l = 0; l < length && l != i; l++) {
                var key2 = table.key[l];
                if (klength == key2.name.length()) {
                    var m;
                    for (m = 0; m < klength; m++) {
                        var n;
                        for (n = 0; n < klength; n++) {
                            if (key.name[m] == key2.name[n]) {
                                break;
                            }
                        }
                        if (n >= klength) {
                            break;
                        }
                    }

                    // Duplicated key found
                    if (m >= klength) {
                        table.key = funcs._delete(table.key, i + 1);
                        i--;
                        length--;
                        deleted = true;
                        deletedKeys[deletedKeys.length] = keynames;
                        break;
                    }
                }
            }
        }
    }

    if (updated) {
        var rc = table.doUpdate();
        if (rc == RC_SUCCESS) {
            for (i = 0; i < invalidFields.length; i++) {
                lib.upgradeLog.scDetail("IMPROPER_KEY_DELETED", [sqlTypes[i], invalidFields[i], keyTypes[i], table.name]);
            }
            if (deletedKeys.length > 0) {
                for (i = 0; i < deletedKeys.length; i++) {
                    lib.upgradeLog.scDetail("IMPROPER_KEY_DELETED_EX", [funcs.str(deletedKeys[i]), table.name]);
                }
            }
        } else {
            for (i = 0; i < invalidFields.length; i++) {
                lib.upgradeLog.scError("IMPROPER_KEY_MANUAL", [sqlTypes[i], invalidFields[i], keyTypes[i], table.name]);
            }
            if (deletedKeys.length > 0) {
                for (i = 0; i < deletedKeys.length; i++) {
                    lib.upgradeLog.scError("IMPROPER_KEY_MANUAL_EX", [funcs.str(deletedKeys[i]), table.name]);
                }
            }
        }
    }
}

function getColumnType(fields, column) {
    var i;
    var length = fields.length();
    for (i = 0; i < length; i++) {
        if (fields[i].name == column && fields[i].sql_field_options.sql_data_type != null) {
            return fields[i].sql_field_options.sql_data_type;
        }
    }
    return null;
}

function getColumnName(column) {
    var index = column.lastIndexOf(",");
    return column.substring(index + 1);
}

function isValidTypeInKey(colType, tableType, keyType) {
    if ((keyType == 64 /*&& colType != null*/ ) || (colType == null && tableType == null)) {
        return true;
    }
    colType = colType == null ? tableType : colType;
    var invalidTypes = ["CLOB", "BLOB", "TEXT", "IMAGE"];
    var index = funcs.index(colType.toUpperCase(), invalidTypes);
    if (index != 0) {
        return false;
    }
    return true;
}