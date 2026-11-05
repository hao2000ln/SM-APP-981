/**
 * This script contains various functions used in Approval Delegation Wizard
 */

var currentUser;

/**
 * This function returns a query that is used by link record for lookup delegate
 * This function will check to make sure the operator it retrieves has a valid profile
 * for the module being delegated. It also verifies operator has approval rights in their 
 * profile for change and request. Capability words were also checked for chang and request
 * module.
 */
function getFilteredQuery(module) {
    var query = lib.ApprovalDelegationService.getFilteredQuery(module);

    if (module == "Request" && lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
        var filteredQuery = getQuoteQuery();
        filteredQuery = appendQuoteCapabilitySql(filteredQuery);

        if (query) {
            query = `(${query}) or (${filteredQuery})`;
        } else {
            query = filteredQuery;
        }
    }

    return query;
}

//This is the query to retrieve valid quote profile query
function getQuoteQuery() {
    var profileSql = "view=true and approvals=true";
    if (vars.$G_folderEntitlement) {
        profileSql += " and " + addQuoteFolderQuery();
    }

    var profile = new SCFile("ocmprofile", SCFILE_READONLY);
    profile.setFields("name");
    var rc = profile.doSelect(profileSql);

    var profileArray = [];
    while (rc == RC_SUCCESS) {
        profileArray.push(profile.name);
        rc = profile.getNext();
    }

    return buildQuoteSql(profileArray);
}

//make sure operator has the right profiles
function buildQuoteSql(profileArray) {
    var cond = "{";
    var i;
    for (i = 0; i < profileArray.length; i++) {
        cond += "\"" + profileArray[i] + "\"";
        if (i < profileArray.length - 1) {
            cond += ",";
        }
    }
    cond += "}";

    return "profile.request isin " + cond;
}


// If folder is enabled, we will also make sure to
// retrieve delegate if it has same folder access as 
// the approver
function addQuoteFolderQuery() {
    //if folder is enabled, first find all folders the user has view access to
    var folderQuery = "true";

    //get current operator record
    if (currentUser == null) {
        getCurrentUser();
    }

    var sql = "";
    var profileArray = currentUser.profile_request;

    var cond = "{";
    var profileLength = profileArray.length();
    var i;
    for (i = 0; i < profileLength; ++i) {
        cond += "\"" + profileArray[i] + "\",";
        if (i < profileArray.length - 1) {
            cond += ",";
        }
    }
    cond = cond.substring(0, cond.length - 1);
    cond += "}";

    sql = 'tablename="ocm" and name isin ' + cond;

    var folderRights = new SCFile("FolderRights", SCFILE_READONLY);
    folderRights.setFields(["view", "folder"]);
    var rc = folderRights.doSelect(sql);
    //next, check for each FolderRights record to see if it has view rights

    var folderArray = [];
    while (rc == RC_SUCCESS) {
        if (folderRights.view == true && isDuplicate(folderArray, folderRights.folder) != true) {
            folderArray.push(folderRights.folder);
        }
        rc = folderRights.getNext();
    }

    var aFolderQuery = 'tablename="ocm" and view=true ';
    if (folderArray.length != 0) {
        aFolderQuery += " and folder isin {";
        var folderLength = funcs.lng(folderArray);
        for (i = 0; i < folderLength; i++) {
            if (folderArray.hasOwnProperty(i)) {
                aFolderQuery += "\"" + folderArray[i] + "\"";
                if (i < folderArray.length - 1) {
                    aFolderQuery += ",";
                }
            }
        }
        aFolderQuery += "}";
    }

    var aRight = new SCFile("FolderRights", SCFILE_READONLY);
    aRight.setFields("name");
    rc = aRight.doSelect(aFolderQuery);

    var nodupFolderAray = [];
    var hasdupFolderAray = [];
    while (rc == RC_SUCCESS) {
        hasdupFolderAray.push(aRight.name);
        if (!isDuplicate(nodupFolderAray, aRight.name)) {
            nodupFolderAray.push(aRight.name);
        }

        rc = aRight.getNext();
    }

    var newFolderArray = isCorrectLength(nodupFolderAray, hasdupFolderAray, folderArray.length);
    var newfolderArrayLength = funcs.lng(newFolderArray);
    if (newFolderArray.length != 0) {
        folderQuery = " name isin {";
        for (i = 0; i < newfolderArrayLength; i++) {
            if (newFolderArray.hasOwnProperty(i)) {
                folderQuery += "\"" + newFolderArray[i] + "\"";
                if (i < newFolderArray.length - 1) {
                    folderQuery += ",";
                }
            }
        }
        folderQuery += "}";
    }

    return folderQuery;
}

//retrieve and cache current operator record
function getCurrentUser() {
    var operatorName = funcs.operator();
    currentUser = vars['$lo.operator'];

    if (currentUser == null || currentUser.name != operatorName) {
        currentUser = new SCFile("operator", SCFILE_READONLY);
        currentUser.setFields("profile.request");
        var sql = "name=\"" + operatorName + "\"";
        currentUser.doSelect(sql);
    }
}

function isDuplicate(array, element) {
    return lib.ArrayUtil.contains(array, element);
}


function isCorrectLength(nodupFolderAray, hasdupFolderAray, length) {
    var folderArray = [];
    var match = 0;

    var nodupFolderArrayLength = funcs.lng(nodupFolderAray);
    var i;
    for (i = 0; i < nodupFolderArrayLength; i++) {
        if (nodupFolderAray.hasOwnProperty(i)) {
            var hasdupFolderArrayLength = funcs.lng(hasdupFolderAray);
            var j;
            for (j = 0; j < hasdupFolderArrayLength; j++) {
                if (hasdupFolderAray.hasOwnProperty(j)) {

                    if (hasdupFolderAray[j] == nodupFolderAray[i]) {
                        folderArray.push(nodupFolderAray[i]);
                        ++match;
                    }
                    if (match == length) {
                        match = 0;
                        break;
                    }
                }
            }
        }
    }

    return folderArray;
}

// append capability words for change and request
function appendQuoteCapabilitySql(approvalQry) {
    approvalQry += ' and (cap.exec isin {"SysAdmin","OCMAdmin","OCMQ"})';

    return approvalQry;
}

//check to see whether a approver can do delegate all approvals
//approver can do delegate all only if can delegate flag is set
//to true for all his approval module
function canDelegateAll() {
    if (!lib.ApprovalDelegationService.canDelegateAll()) {
        return false;
    }

    if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
        return checkQuoteProfileForDelegate();
    }

    return true;
}

function checkQuoteProfileForDelegate() {
    //retrieve user profile
    getCurrentUser();

    if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
        var profileNames = funcs.str(funcs.denull(currentUser.profile_request));
        var profileSql = "name isin " + profileNames;
        var profiles = new SCFile("ocmprofile", SCFILE_READONLY);
        profiles.setFields("approve.delegate");
        var rc = profiles.doSelect(profileSql);

        while (rc == RC_SUCCESS) {
            if (profiles.approve_delegate == true) {
                return true;
            }
            rc = profiles.getNext();
        }
    }

    return false;
}

/**
 * check if current user is approval's delegate
 */
function checkApprovalDelegate(approvalQry, module) {
    var approval = new SCFile("Approval", SCFILE_READONLY);
    approval.setFields("current.pending.groups");
    approval.doSelect(approvalQry);

    var pendingGroups = approval.current_pending_groups;
    var groups = lib.ApprovalDelegationGroups.flattenPendingGroups(pendingGroups);

    var delegate;
    var i;
    for (i = 0; i < groups.length; i++) {
        delegate = checkDelegates(approvalQry, module, groups[i]);
        if (delegate != '') {
            return delegate;
        }
    }

    return '';
}

//check to see if this is a delegate approval, if it is, return delegate, else return empty string
function checkDelegate(approvalQry, module) {
    return checkDelegates(approvalQry, module, null);
}

function checkDelegates(approvalQry, module, delegateGrp) {
    return lib.ApprovalDelegationService.checkDelegates(approvalQry, module, delegateGrp);
}

//Get an array of modules which the current user has the permission to delegate approval
//The result is for actual values
function getCanDelegateModulesValue() {
    var modules = lib.ApprovalDelegationService.getCanDelegateModulesValue();

    if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel() && checkQuoteProfileForDelegate()) {
        modules.push("Request");
    }

    return modules;
}

//Get an array of modules which the current user has the permission to delegate approval
//The result is for diaplay values
function getCanDelegateModules() {
    var modules = lib.ApprovalDelegationService.getCanDelegateModules();

    if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel() && checkQuoteProfileForDelegate()) {
        modules.push(funcs.scmsg("Request", "approval"));
    }

    return modules;
}

/**
 *  This function retrieves the Approval Manager Group for specific secRoles 
 *
 *  @param {String} fileName - The name file
 *  @param {Array} secRoles - All secRoles
 *  @return The List of Manager Groups
 *  @type Array  
 */
function getApprovalManagerGroup(fileName, secRoles) {

    var manageGroup = [];
    var right;
    if (fileName == "request") {
        right = lib.security.getRights("Request", "manager.group");
        if (right != null) {
            manageGroup.push(right);
        }
        if (secRoles != null) {
            var length = secRoles.length;
            var i;
            for (i = 0; i < length; i++) {
                right = lib.security.getRoleRights("Request", "manager.group", secRoles[i]);
                manageGroup.push(right);
            }
        }
    }

    return manageGroup;
}

/**
 *  This function used by eventin -- find approval_of in myGroups 
 *  @param {String} user 
 *  @returns {Array} The List of Approval_of  Groups
 */
function findApprovelGroups(user) {
    var query = "name = \"" + user + "\"";
    var file = new SCFile("myGroups", SCFILE_READONLY);
    file.setFields(["approver.of"]);
    var rc = file.doSelect(query);
    if (rc == RC_SUCCESS) {
        return file.approver_of;
    }

    return [];
}