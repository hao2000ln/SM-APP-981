var AreaMapping = {
    cm3r: ["Change"],
    cm3: ["Change", "Change Tasks"],
    cm3t: ["Change Tasks"],
    rootcause: ["Problem"],
    rootcausetask: ["Problem Tasks"],
    probsummary: ["Incident"],
    incidents: ["Service Desk"],
    ocm: ["Request"],
    sla: ["Service Level Management"],
    device: ["Configuration Item"]
};

var TableWithFolder = ["cm3r", "cm3t", "device", "FolderDef", "FolderRights", "imTask", "incidents", "info", "interactionDelegate", "knownerror", "knownerrortask", "ocml", "ocmo", "ocmq", "operator", "probsummary", "prodCatalogCategory", "productCatalog", "reportscheduleDefinition", "reportScheduleHistory", "request", "requestModel", "requestTask", "rmCategory", "rmSubcategory", "rmTaskCat", "rootcause", "rootcausetask", "scFolderAccess", "secRights", "secRoleRights", "sla", "slo", "sloavail", "slocatalog", "SurveyDefinition", "tableAccess", "Template", "timeperiodDefinition", "Todo", "TodoAlertList"];
var AreaWithFolder = {
    "Change": true,
    "Change Tasks": true,
    "Incident": true,
    "Incident Tasks": true,
    "Problem": true,
    "Problem Tasks": true,
    "Report Schedule": true,
    "Request": true,
    "Request Management Configuration": true,
    "Request Tasks": true,
    "Security": true,
    "Service Desk": true,
    "Service Level Management": true,
    "Survey": true,
    "Timeperiod": true,
    "Configuration Item": true
};

var RightFolderFields = ["view", "new", "delete", "update", "expert", "admin", "allowedStatus"];

var needMigrateSLATables = {
    "slo": true,
    "sla": true,
    "sloavail": true
};

var charAuthWeight = {
    "always": 4,
    "workgroup": 3,
    "assigned": 2,
    "never": 1
};

var boolAuthWeight = {
    "true": 2,
    "false": 1
};

var $ = lib.c.$;
var dbdictService = $("#dbdictService");
var dbdict = $("FolderRights").dbdict();
var mata = dbdictService.getDescriptorMeta(dbdict["field"]);
var type = dbdictService.getFieldMeta("delete", mata, false).field.type;
var deleteAuthWeight = type == 4 ? boolAuthWeight : charAuthWeight;


/**
 *  This method is used to migrate the folde rights of SLA module
 *    
 **/
function migrateSLAFolder(rights) {
    var name = rights.role;
    var folders = {};
    var migratedFolders = [];
    var f = new SCFile("FolderRights" /*, SCFILE_READONLY*/ );
    //print('name="' + name + '" and tablename isin {"slo","sla","sloavail"}');
    var rc = f.doSelect('name="' + name + '" and tablename#"sl"');
    while (rc == RC_SUCCESS) {
        if (needMigrateSLATables[f.tablename]) {
            if (folders[f.folder]) {
                mergeFolder(folders[f.folder], f);

            } else {
                var value = new SCFile();
                funcs.fduplicate(value, f);
                folders[f.folder] = value;
            }
        }
        //f.doDelete();
        rc = f.getNext();
    }

    var folder;
    for (folder in folders) {
        migratedFolders.push(folder);
        folders[folder].tablename = "Service Level Management";
        folders[folder].doSave();
    }
    return migratedFolders;
}


/**
 *  This method is merge the folder A and B and the folder A will have the merged maximum authorization.
 *    
 **/
function mergeFolder(folderA, folderB) {

    //print(folders[i].tablename);
    folderA['view'] = maxAuth(folderA['view'], folderB['view'], boolAuthWeight);
    folderA['new'] = maxAuth(folderA['new'], folderB['new'], boolAuthWeight);
    folderA['expert'] = maxAuth(folderA['expert'], folderB['expert'], boolAuthWeight);
    folderA['admin'] = maxAuth(folderA['admin'], folderB['admin'], boolAuthWeight);
    folderA['update'] = maxAuth(folderA['update'], folderB['update'], charAuthWeight);
    //folderA['delete'] = maxAuth(folderA['delete'], folderB['delete'], deleteAuthWeight);
    var temp = maxAuth(folderA['delete'], folderB['delete'], deleteAuthWeight);
    if (temp == "t" || temp == "true" || temp == true) {
        folderA['delete'] = "always";
    } else if (temp == "f" || temp == "false" || temp == false) {
        folderA['delete'] = "never";
    } else {
        folderA['delete'] = temp;
    }
}

/**
 *  This method compare the auth a & b based on its weigth and return the more weighted one..
 *    
 **/
function maxAuth(a, b, weight) {

    if (weight[a] == null || weight[a] < weight[b]) {
        return b;
    }
    return a === null ? b : a;
}

/**
 *  This method apend the folders to security rights folder field and remove duplicate and empty entry.
 *    
 **/
function apendRightFolders(rights, migratedFolders) {
    if (migratedFolders.length > 0) {
        var folders = rights.folders.toArray();
        var i;
        for (i = 0; i < migratedFolders.length; ++i) {
            folders.push(migratedFolders[i]);
        }
        rights.folders = lib.ArrayUtil.removeDuplicateEmptyElement(folders);
    }
}

/**
 *  This method migrate a legacy table based folder right to area based folder right.
 *    
 **/
function migrateFolderRight(folderRight) {
    /**
*below line is not needed, if the type is boolean, it means the dbdict field is not converted, we can not save the character
*and when the dbdict is converted, it will map the value
    if("boolean" == typeof folderRight["delete"]){
      folderRight["delete"] = folderRight["delete"] == true ? "always" : "never";
    }
	*/

    if (folderRight["tablename"].indexOf("ocm") == 0) {
        folderRight["name"] = folderRight["name"] + "_migrated";
    }
    var mappedAreas = AreaMapping[folderRight["tablename"]];
    if (mappedAreas) {
        var i;
        for (i = 0; i < mappedAreas.length; ++i) {
            folderRight["tablename"] = mappedAreas[i];
            trySaveFolderRightRecord(folderRight, (i > 0));
        }
    }
}

/**
 *  This method will save or add a folder right record if no one exists with identical key..
 *    
 **/
function trySaveFolderRightRecord(folderRight, doAdd) {
    var targetFolder = new SCFile("FolderRights", SCFILE_READONLY);
    targetFolder.setFields("name");
    var rc = targetFolder.doSelect("name=\"" + folderRight.name + "\" and tablename=\"" + folderRight.tablename + "\" and folder=\"" + folderRight.folder + "\"");
    if (rc != RC_SUCCESS) {
        if (doAdd) {
            folderRight.doInsert();
        } else {
            folderRight.doUpdate();
        }
    }
}

/**
 *  This method add folder right records for a security right that has folders defined but no folder right record created.
 *    
 **/
function migrateSecRightToFolder(secRight) {
    if (secRight.folders) {
        var folders = secRight.folders.toArray();
        if (folders && folders.length > 0) {
            if (AreaWithFolder[secRight.area]) {
                var i;
                var j;
                for (i = 0; i < folders.length; ++i) {
                    if (folders[i] && folders[i] != "") {
                        var folderRight = new SCFile("FolderRights");
                        var rc = folderRight.doSelect("name=\"" + secRight.role + "\" and tablename=\"" + secRight.area + "\" and folder=\"" + folders[i] + "\"");
                        if (rc != RC_SUCCESS) {
                            folderRight.name = secRight.role;
                            folderRight.tablename = secRight.area;
                            folderRight.folder = folders[i];
                            for (j = 0; j < RightFolderFields.length; ++j) {
                                folderRight[RightFolderFields[j]] = secRight[RightFolderFields[j]];
                            }

                            folderRight.doInsert();
                        }
                    }
                }
            }

            secRight.doUpdate();
        }
    }

}

/**
 *  This method is used to migrate the folde rights of original secRights to the FolderRights table
 *    
 **/
function migrateLegacySecurityModelFolders() {

    var secRight = new SCFile("secRights");

    var rc = secRight.doSelect("true");
    while (rc == RC_SUCCESS) {
        migrateSecRightToFolder(secRight);
        rc = secRight.getNext();
    }
}

/**
 *  This method is used to clear the folde rights value of original secRights during the customer upgrade
 *    
 **/
function clearSecRightsFolders() {

    return; //do nothing as we keep the folders now.
    //	var secRight = new SCFile("secRights");
    //	
    //	var rc = secRight.doSelect("true");
    //	
    //	while (rc == RC_SUCCESS) {
    //	    secRight.folders = [];
    //        secRight.doUpdate();
    //	    rc = secRight.getNext();
    //	}
}

/**
 *  This method is to get related security rights record for a folder right record.
 *
 **/
function getRelatedsecRight(folderRight) {
    var secRight = new SCFile("secRights");
    var rc = secRight.doSelect('role="' + folderRight.name + '" and area="' + folderRight.tablename + '"');
    if (rc == RC_SUCCESS) {
        return secRight;
    }
    return null;
}


/**
 *  This method is to sync the folder array of security right record when related folder right record added.
 *
 **/
function folderRightsAdded(record, oldrecord) {
    addSchedule(record.name, record.tablename);
}

/**
 *  This method is to sync the folder array of security right record when related folder right record deleted.
 *
 **/
function folderRightsDeleted(record, oldrecord) {
    addSchedule(oldrecord.name, oldrecord.tablename);
}

/**
 *  This method is to sync the folder array of security right record when related folder right record updated.
 *
 **/
function folderRightsUpdated(record, oldrecord, noCommit) {
    if (record.name != oldrecord.name || record.tablename != oldrecord.tablename || record.folder != oldrecord.folder) {
        addSchedule(record.name, record.tablename);
        addSchedule(oldrecord.name, oldrecord.tablename);
    }
}


/**
 *  This method is to add a schedule to sync the folder array of security right record.
 *
 **/
function addSchedule(name, area, canDuplicate) {
    var sch = new SCFile("schedule");
    sch.name = "refresh folder of security right " + name + "_" + area;
    if (canDuplicate || sch.doSelect('name="' + sch.name + '"') != RC_SUCCESS) {
        sch.expiration = new Date();
        sch['class'] = "linker";
        sch.status = "scheduled";
        sch.javascript = "lib.FolderMigrate.refreshFolderOfRight(vars.$L_schedule, '" + name + "', '" + area + "');";
        sch.doInsert();
        return sch;
    }
}

/**
 *  This method is to get the folder array of security right.
 *
 **/
function getFolderOfRight(right) {
    var fFolders = new SCFile("FolderRights", SCFILE_READONLY);
    fFolders.setFields(["folder"]);
    var folders = [];
    var rc = fFolders.doSelect('name="' + right.role + '" and tablename="' + right.area + '"');
    while (rc == RC_SUCCESS) {
        folders.push(fFolders.folder);
        rc = fFolders.getNext();
    }
    return folders;
}

/**
 *  This method is to lock a file.
 *
 **/
function lockFile(f) {
    var err = new SCDatum();
    var tag = new SCDatum();
    var ret = funcs.rtecall("tag", err, tag, f);

    tag = funcs.str(tag);
    //    print(tag.toString());
    ret = Lock(tag);
    //    print(ret);
    if (ret > 0) {
        return null;
    }
    return tag;
}

/**
 *  This method is to refresh and save the folder array of security right record if needed in schedule.
 *
 **/
function refreshFolderOfRight(schedule, role, area) {
    var f = new SCFile("secRights");
    var rc = f.doSelect('role="' + role + '" and area="' + area + '"');
    if (rc == RC_SUCCESS) {
        var tag = lockFile(f);
        if (!tag) {
            if (schedule) {
                addSchedule(f.role, f.area, true);
            }
        } else {
            var origFolders = f.folders.toArray();
            origFolders = origFolders || [];
            var newFolders = getFolderOfRight(f);
            origFolders = lib.ArrayUtil.removeDuplicateEmptyElement(origFolders);
            origFolders = origFolders.sort();
            newFolders = newFolders.sort();
            if (!lib.ArrayUtil.sameArray(origFolders, newFolders)) {
                f.folders = newFolders;
                f.doUpdate();
            }
            Unlock(tag);
        }
    }

}

/**
 *  This method is to refresh and save the folder array of security right record if needed in foregound.
 *
 **/
function refreshDisplayFile() {

    var f = vars.$L_file;
    if (funcs.same(f, vars.$L_file_save)) {
        var origFolders = f.folders.toArray();
        origFolders = origFolders || [];
        var newFolders = getFolderOfRight(f);
        origFolders = lib.ArrayUtil.removeDuplicateEmptyElement(origFolders);
        origFolders = origFolders.sort();
        newFolders = newFolders.sort();
        if (!lib.ArrayUtil.sameArray(origFolders, newFolders)) {
            f.folders = newFolders;
            var tag = lockFile(f);
            if (tag) {
                var temp = f.temp;
                f.temp = "";
                f.doUpdate();
                f.temp = temp;

                Unlock(tag);
                return true;
            }
        }
    } else {
        vars.$L_file.folders = lib.FolderMigrate.getFolderOfRight(vars.$L_file);
    }


}