/**
 * @fileoverview  Contains functions to support the tableAccess definition and Folder Entitlement
 * @author Pete Budic
 */

/**
 *  This function populates the folders Structured Array.
 *
 *	@param {Record} tableAccess - The tableAccess record variable.
 */
function setFolders(tableAccess) {
    var allRights = vars.$G_roleRights;
    var i;

    if (lib.ProcessDesignerEnablement.isRoleBasedAccessFile(tableAccess.tablename)) {
        var tableArea = lib.security.getArea(tableAccess.tablename);
        var ilng = allRights.areas.length();
        for (i = 0; i < ilng; i++) {
            //if area is same as the area in the tableAccess, then populate
            if (allRights.areas[i].area == tableArea) {
                //if area matches, then we match the folder
                var folderIndex;
                var folderIndexlng = allRights.areas[i].folders.length();
                for (folderIndex = 0; folderIndex < folderIndexlng; folderIndex++) {
                    tableAccess.folders[folderIndex].folder = allRights.areas[i].folders[folderIndex].folder;
                    tableAccess.folders[folderIndex].fNew = allRights.areas[i].folders[folderIndex].fTokenValue[1];
                    tableAccess.folders[folderIndex].fView = allRights.areas[i].folders[folderIndex].fTokenValue[0];
                    tableAccess.folders[folderIndex].fDelete = allRights.areas[i].folders[folderIndex].fTokenValue[3];
                    tableAccess.folders[folderIndex].fUpdate = allRights.areas[i].folders[folderIndex].fTokenValue[2];
                    tableAccess.folders[folderIndex].fAllowedStatus = allRights.areas[i].folders[folderIndex].fAllowedStatus;
                }
                break;
            }
        }
    } else { //if the tableArea is empty means that new security model has not been implemented and will continue the legacy logic 
        var sql = "name=\"" + tableAccess.name + "\" and tablename=\"" + tableAccess.tablename + "\"";
        i = 0;
        var folders = new SCFile("FolderRights", SCFILE_READONLY);

        if (folders.doSelect(sql) == RC_SUCCESS) {
            do {
                tableAccess.folders[i].folder = folders.folder;
                tableAccess.folders[i].fNew = folders._new;
                tableAccess.folders[i].fView = folders.view;
                tableAccess.folders[i].fDelete = folders._delete;
                tableAccess.folders[i].fUpdate = folders.update;
                tableAccess.folders[i].fAllowedStatus = folders.allowedStatus;
                i++;
            }
            while (folders.getNext() == RC_SUCCESS);
        }
    }
}

/**
 * This function will return the folder array which have view access in profile.
 */
function getFoldersWithViewAccess(profile) {
    var folderArr = [];

    // Can only use RAD variable because of a bug.
    vars.$L_table_access = profile.tableAccess;

    if (vars.$L_table_access != null) {
        var folders = vars.$L_table_access.folders;
        if (folders != null) {
            var i;
            var iLoopTimes = folders.length();
            for (i = 0; i < iLoopTimes; i++) {
                if (folders[i].fView) {
                    folderArr.push(folders[i].folder);
                }
            }
        }
    }

    return folderArr;
}

/**
 *  This function determines whether or not a user has access to view a record in the specified folder.
 *
 *	@param
 */
function getViewAccess(tableAccess, folderName) {
    if (vars.$G_folderEntitlement != true) {
        return tableAccess.view;
    }
    if (folderName == null || folderName == "") {
        return tableAccess.view;
    }

    var i;
    var iLoopTimes = tableAccess.folders.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (tableAccess.folders[i].folder == folderName) {
            return tableAccess.folders[i].fView;
        }
    }

    return false;
}

/**
 *  This function determines whether or not a user has access to create a new record for the specified folder.
 *
 *	@param
 */
function getNewAccess(tableAccess, folderName) {
    if (vars.$G_folderEntitlement != true) {
        return tableAccess._new;
    }
    if (folderName == null || folderName == "") {
        return tableAccess._new;
    }

    var i;
    var iLoopTimes = tableAccess.folders.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (tableAccess.folders[i].folder == folderName) {
            return tableAccess.folders[i].fNew;
        }
    }

    return false;
}

/**
 *  This function determines whether or not a user has access to delete a record in the specified folder.
 *
 *	@param
 */
function getOldDeleteAccess(tableAccess, folderName) {
    if (vars.$G_folderEntitlement != true) {
        return tableAccess._delete;
    }
    if (folderName == null || folderName == "") {
        return tableAccess._delete;
    }

    var i;
    var iLoopTimes = tableAccess.folders.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (tableAccess.folders[i].folder == folderName) {
            return tableAccess.folders[i].fDelete;
        }
    }

    return false;
}

/**
 * This function determines whether or not a user has access to delete/close a record in the specified folder.
 * The priority of the delete/close access is "always", "workgroup", "assigned" and "never", for e.g., if you have "workgroup"
 * right, then you also have "assigned" right.
 *
 * Be noted that at RTE side while get the right of the area, this rule already is applied.
 *
 * @param
 */
function getDeleteAccess(tableAccess, folderName, object, status, userName, record, incr) {
    if (incr == null) {
        incr = -1;
    }

    var updateType = tableAccess._delete;
    if (vars.$G_folderEntitlement != true) {
        updateType = tableAccess._delete;
    } else if (folderName == null || folderName == "") {
        updateType = tableAccess._delete;
    } else if (incr == -1) {
        var found = false;
        var i;
        var iLoopTimes = tableAccess.folders.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (tableAccess.folders[i].folder == folderName) {
                updateType = tableAccess.folders[i].fDelete;
                found = true;
            }
        }

        if (found == false) {
            updateType = "never";
            folderName = null;
        }
    } else {
        updateType = tableAccess.folders[incr].fDelete;
    }

    //since for other module, we still use profile which means tableAccess._delete is
    //a boolean true and false, therefore we need to convert true to always and false 
    //to never
    if (updateType == true) {
        updateType = "always";
    }

    if (updateType == false) {
        updateType = "never";
    }

    return getUpdateOrCloseAccessByType(tableAccess, folderName, object, status, userName, record, incr, updateType);
}

/**
 *  This function determines whether or not a user has access to close a record in the specified folder.
 *
 *	@param
 */
function getCloseAccess(tableAccess, folderName, object, status, userName, record, incr) {
    return getDeleteAccess(tableAccess, folderName, object, status, userName, record, incr);
}

/**
 * This function determines whether or not a user has access to update a record in the specified folder.
 * The priority of the update access is "always", "workgroup", "assigned" and "never", for e.g., if you have "workgroup"
 * right, then you also have "assigned" right.
 *
 * Be noted that at RTE side while get the right of the area, this rule already is applied.
 *
 * @param
 */
function getUpdateAccess(tableAccess, folderName, object, status, userName, record, incr) {
    if (incr == null) {
        incr = -1;
    }

    var updateType = tableAccess.update;
    if (vars.$G_folderEntitlement != true) {
        updateType = tableAccess.update;
    } else if (folderName == null || folderName == "") {
        updateType = tableAccess.update;
    } else if (incr == -1) {
        var found = false;
        var i;
        var iLoopTimes = tableAccess.folders.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (tableAccess.folders[i].folder == folderName) {
                updateType = tableAccess.folders[i].fUpdate;
                found = true;
            }
        }

        if (found == false) {
            updateType = "never";
            folderName = null;
        }
    } else {
        updateType = tableAccess.folders[incr].fUpdate;
    }

    return getUpdateOrCloseAccessByType(tableAccess, folderName, object, status, userName, record, incr, updateType);
}

/**
 * This function determines whether or not a user has access to update or delete a record in the specified folder according
 * to the update/close type.
 * The priority of the update/close access is "always", "workgroup", "assigned" and "never", for e.g., that if you have "workgroup"
 * right, then you also have "assigned" right.
 *
 * Be noted that at RTE side while get the right of the area, this rule already is applied.
 *
 * @param
 */
function getUpdateOrCloseAccessByType(tableAccess, folderName, object, status, userName, record, incr, updateType) {
    if (updateType == "always") {
        return getStatusAccess(tableAccess, folderName, status, incr);
    } else if (updateType == "never") {
        return false;
    } else if (updateType == "assigned") {
        return getAssignedAccess(tableAccess, folderName, object, status, userName, record);
    } else if (updateType == "workgroup") {
        // check whether this record is assigned to current user first
        if (getAssignedAccess(tableAccess, folderName, object, status, userName, record)) {
            return true;
        }

        // check whether this record is assigned to group
        var tablename = funcs.filename(record);
        if (object.workgroupFields != null) {
            if (object.workgroupFields.length() > 0) {
                var j;
                var y;
                var x;
                var jLoopTimes = object.workgroupFields.length();
                for (j = 0; j < jLoopTimes; j++) {
                    var temp = object.workgroupFields[j];
                    if (temp != null && temp != "") {
                        var xLoopTimes;
                        if (funcs.type(record[temp]) == 8) {
                            var lng = record[temp].length();
                            for (y = 0; y < lng; y++) {
                                var arrayTemp = record[temp][y];
                                if (arrayTemp === null) { // continue if record's assignment group value is null
                                    continue;
                                }
                                xLoopTimes = tableAccess.workgroups.length();
                                for (x = 0; x < xLoopTimes; x++) {
                                    if (arrayTemp == tableAccess.workgroups[x]) {
                                        return getStatusAccess(tableAccess, folderName, status, -1);
                                    }
                                }
                            }
                        } else {
                            var tempValue = record[temp];
                            if (tempValue === null) { // continue if record's assignment group value is null
                                continue;
                            }
                            xLoopTimes = tableAccess.workgroups.length();
                            for (x = 0; x < xLoopTimes; x++) {
                                if (record[temp] == tableAccess.workgroups[x]) {
                                    return getStatusAccess(tableAccess, folderName, status, -1);
                                }
                            }
                        }
                    }
                } // for j
            }
        }

        return false;
    }

    return false;
}

function getAssignedAccess(tableAccess, folderName, object, status, userName, record) {
    if (object.assignedToFields != null) {
        var j;
        var jLoopTimes = object.assignedToFields.length();
        for (j = 0; j < jLoopTimes; j++) {
            var temp = object.assignedToFields[j];
            var tempValue = record[temp];

            if (temp != null && temp != "") {
                if (funcs.filename(record) == "device") {
                    var operator = new SCFile("operator", SCFILE_READONLY);
                    operator.setFields(["name"]);
                    var rc = operator.doSelect("contact.name=\"" + tempValue + "\"");
                    tempValue = operator["name"];
                }
                if ((record[temp] == userName) || (funcs.filename(record) == "device" && tempValue == userName)) {
                    return getStatusAccess(tableAccess, folderName, status, -1);
                }
            }
        }
    }

    return false;
}

/**
 *  This function determines whether or not a user has access to update a record based on status
 *	in the specified folder
 *
 *	@param
 */
function getStatusAccess(tableAccess, folderName, status, incr) {
    if (vars.$G_folderEntitlement != true) {
        return statusMatch(status, tableAccess.allowedStatus);
    }
    if (folderName == null || folderName == "") {
        return statusMatch(status, tableAccess.allowedStatus);
    }
    if (incr == -1) {
        var i;
        var iLoopTimes = tableAccess.folders.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (tableAccess.folders[i].folder == folderName) {
                return statusMatch(status, tableAccess.folders[i].fAllowedStatus);
            }
        }
    } else {
        return statusMatch(status, tableAccess.folders[incr].fAllowedStatus);
    }

    return false;

}

/**
 *  This function determines whether or not a user has access to update a record based on status
 *	in the specified folder
 *
 *	@param
 */
function statusMatch(status, statusList) {
    statusList = funcs.denull(statusList);
    if (statusList == null) {
        return true;
    }

    var iLoopTimes = statusList.length();
    if (iLoopTimes == 0) {
        return true;
    }

    var i;
    for (i = 0; i < iLoopTimes; i++) {
        if (statusList[i] == status) {
            return true;
        }
    }

    return false;
}

/**
 *  grant the access by record and set the value to vars.$L_tableAccess_update
 *	only will run when the tableAccess is not set.
 *
 *	@param record, the record you want
 */

function setTableAccess(record) {
    if (vars.$L_tableAccess_view != null) {
        return null;
    }

    var tableName = funcs.filename(record);
    var tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = tableName;
    var areaName = lib.security.getArea(tableName);
    if (areaName == null) {
        return null;
    }

    var object = lib.objectHelper.getObject(null, tableName, null, record, null, null)[0];
    if (object == null) {
        return null;
    }

    tableAccess.name = vars.$G_role;
    tableAccess.view = funcs.val(lib.security.getRights(areaName, "view"), 4);
    tableAccess["new"] = funcs.val(lib.security.getRights(areaName, "new"), 4);
    tableAccess.expert = funcs.val(lib.security.getRights(areaName, "expert"), 4);
    tableAccess.admin = funcs.val(lib.security.getRights(areaName, "admin"), 4);
    tableAccess.update = lib.security.getRights(areaName, "update");
    tableAccess["delete"] = lib.security.getRights(areaName, "delete") != null && lib.security.getRights(areaName, "delete") != "never";
    tableAccess.allowedStatus = lib.security.getRights(areaName, "allowedStatus");

    return setAccessVars(record, tableAccess, object, funcs.exists("folder", record));
}


/**
 *  This function sets up the tableAccess variables used by the document engine
 *
 *	@param
 */
function setAccessVars(record, env, object, exists) {
    var folder = null;
    if (exists == true) {
        folder = record.folder;
    }

    var temp = object.statusField;
    if (temp == null || temp == "") {
        temp = "status";
    }
    var status = record[temp];

    var restricted = false;
    var hpsystem = funcs.exists("sysrestricted", record);
    if (hpsystem) {
        if (!funcs.lioption("HP System")) {
            if (record.sysrestricted == true) {
                restricted = true;
            }
        }
    }
    var name = funcs.operator();
    if (restricted) {
        vars.$L_tableAccess_delete = false;
        vars.$L_tableAccess_close = false;
        vars.$L_tableAccess_update = false;
    } else {
        vars.$L_tableAccess_delete = getDeleteAccess(env, folder, object, status, name, record);
        vars.$L_tableAccess_close = vars.$L_tableAccess_delete;
    }
    vars.$L_tableAccess_view = getViewAccess(env, folder);
    vars.$L_tableAccess_new = getNewAccess(env, folder);

    vars.$L_tableAccess_expert = getExpertAccess(env, folder);
    vars.$L_tableAccess_admin = getAdminAccess(env, folder);

    temp = object.statusField;
    if (temp == null || temp == "") {
        temp = "status";
    }
    status = record[temp];

    name = funcs.operator();
    var fullName = vars.$lo_ufname;
    if (restricted) {
        vars.$L_tableAccess_update = false;
    } else {
        vars.$L_tableAccess_update = getUpdateAccess(env, folder, object, status, name, record, -1) ||
            getUpdateAccess(env, folder, object, status, fullName, record, -1);
    }

    var count = 0;
    var list = [];
    var mode = vars.$L_mode;
    if (mode == null) {
        mode = "browse";
    }

    //QCCR1E123914,commemt out 
    //it's useless to add a null entry in the folder list.
    //if ( getUpdateAccess( env, null, object, status, name, record, -1 ) ||
    //				  getUpdateAccess( env, null, object, status, fullName, record, -1) ) 
    //{		
    //	list[count++] = null;
    //}
    //QCCR1E123914,commemt out
    var i;
    var iLoopTimes = env.folders.length();
    for (i = 0; i < iLoopTimes; i++) {
        var folderName = env.folders[i].folder;
        if (folderName != null) {
            if (mode == "search") {
                if (getViewAccess(env, folderName)) {
                    list[count++] = folderName;
                }
            } else if (mode.substring(0, 3) == "add") {
                if (getNewAccess(env, folderName)) {
                    list[count++] = folderName;
                }
            } else if (getUpdateAccess(env, folderName, object, status, name, record, i) ||
                getUpdateAccess(env, folderName, object, status, fullName, record, i)) {
                list[count++] = folderName;
            }
        }

    }

    vars.$L_tableAccess_folders = list;
}

/**
 *  This function determines whether or not a user has access to expert rights for a record in the specified folder.
 *
 *	@param
 */
function getExpertAccess(tableAccess, folderName) {
    if (vars.$G_folderEntitlement != true) {
        return tableAccess.expert;
    }
    if (folderName == null || folderName == "") {
        return tableAccess.expert;
    }

    var i;
    var iLoopTimes = tableAccess.folders.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (tableAccess.folders[i].folder == folderName) {
            return tableAccess.folders[i].fExpert;
        }
    }

    return false;
}

/**
 *  This function determines whether or not a user has admin access to a record in the specified folder.
 *
 *	@param
 */
function getAdminAccess(tableAccess, folderName) {
    if (vars.$G_folderEntitlement != true) {
        return tableAccess.admin;
    }

    if (folderName == null || folderName == "") {
        return tableAccess.admin;
    }

    var i;
    var iLoopTimes = tableAccess.folders.length();
    for (i = 0; i < iLoopTimes; i++) {
        if (tableAccess.folders[i].folder == folderName) {
            return tableAccess.folders[i].fAdmin;
        }
    }

    return false;
}

/**
 *  This function determines whether or not a user has access to create a new record for any folder.
 *
 *	@param
 */
function hasNewAccess(tableAccess) {
    if (tableAccess._new == true) {
        return true;
    }

    if (vars.$G_folderEntitlement == true) {
        var i;
        var iLoopTimes = tableAccess.folders.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (tableAccess.folders[i].fNew == true) {
                return true;
            }
        }
    }

    return false;
}

/**
 *  This function determines whether or not a user has access to view a record for any folder.
 *
 *	@param
 */
function hasViewAccess(tableAccess) {
    if (tableAccess.view == true) {
        return true;
    }

    if (vars.$G_folderEntitlement == true) {
        var i;
        var iLoopTimes = tableAccess.folders.length();
        for (i = 0; i < iLoopTimes; i++) {
            if (tableAccess.folders[i].fView == true) {
                return true;
            }
        }
    }

    return false;
}

/** 
 *	This function returns the status of the record
 */
function getStatus(record, object) {
    var temp = object.statusField;
    if (temp == null || temp == "") {
        temp = "status";
    }
    var status = record[temp];
    return status;
}

function getSchedulerAdminAccess(tablename) {
    var tableAccess = new SCFile("tableAccess");
    tableAccess.tablename = tablename;
    tableAccess._new = true;
    tableAccess.view = true;
    tableAccess._delete = true;
    tableAccess.close = true;
    tableAccess.update = "always";

    if (funcs.nullsub(vars.$G_folderEntitlement, false) == false) {
        return tableAccess;
    }

    var folders = lib.folderFunctions.getAllFolders();

    if (folders.length > 0) {
        tableAccess.folders = lib.c.$.createSCArray();
    }

    var i;
    for (i = 0; i < folders.length; i++) {
        tableAccess.folders[i] = lib.c.$.createSCStructure();
        tableAccess.folders[i].folder = folders[i];
        tableAccess.folders[i].fNew = true;
        tableAccess.folders[i].fView = true;
        tableAccess.folders[i].fDelete = true;
        tableAccess.folders[i].fClose = true;
        tableAccess.folders[i].fUpdate = "always";
    }

    return tableAccess;
}

/**
 * This function return whether or not a user has permission to update a record
 *
 * @param {Object} record : a record of the file
 * @param {Object} env : logon user's environment variable
 * @param {Object} object : 
 * @param {Object} exists : whether folder field exists on the file
 */
function getUpdateRight(record, env, object, exists) {
    setAccessVars(record, env, object, exists);

    if (object != null && object["file.name"] == "device") {
        vars.$L_tableAccess_update = vars.$L_tableAccess_update && !lib.ArrayUtil.contains(vars["$G.icm.types"].toArray(), record["type"]);
    }

    return vars.$L_tableAccess_update;
}


/**
 * whether tableAccess has folder update capability
 *
 * @param {SCDatum} tableAccessFolders
 * @returns {Boolean}
 */
function hasFolderUpdateCapability(tableAccessFolders) {
    if (tableAccessFolders == null || tableAccessFolders.length() == 0) {
        return false;
    }

    var i;
    var folderLength = tableAccessFolders.length();
    for (i = 0; i < folderLength; i++) {
        var folder = tableAccessFolders[i];

        if (!folder) {
            continue;
        }

        folder = folder.toArray();

        if (isUpdateCapability(folder[1]) || // new
            isUpdateCapability(folder[3]) || // delete
            isUpdateCapability(folder[4])) { // update
            return true;
        }
    }

    return false;
}


function isUpdateCapability(right) {
    return (right != null && right != false && right != "false" && right != "never");
}