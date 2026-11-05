/**
 * This script contains various functions used in approval engine
 * to support approval delegation
 * 
 * Hua Zhang
 */

var delegationList;
var asDelegateList = null;
var approverList = [];
var approvalEnablement = lib.ApprovalEnablementManager;

/**
 * This function returns constructs a query for retrieve
 * approvals that a user gets from delegation. This function 
 * is called from approval inbox application 
 *
 * Hua Zhang
 */
function getDelegationSql() {
    var returnSql = lib.ApprovalDelegationService.getDelegationSql();

    if (lib.ProcessDesignerEnablement.isNonPDRequestInParallel()) {
        initDelegation();
        if (delegationList.length > 0) {
            var requestSql = getRequestDelegationGroups("ocmq");
            returnSql += requestSql;
        }
    }

    return returnSql;
}


function getRequestDelegationGroups(module) {
    //find id there is a delegate all 
    var allDele = [];
    var i;
    for (i = 0; i < delegationList.length; ++i) {
        if (delegationList[i].module == "all") {
            allDele.push(delegationList[i]);
        }
    }

    var allRequestGroups = [];
    var partRequestGroups = [];

    for (i = 0; i < allDele.length; ++i) {
        var requests = getAllRequestGroups(allDele[i], module);
        var j;
        for (j = 0; j < requests.length; ++j) {
            if (arrayIndexOf(allRequestGroups, requests[j]) < 0) {
                allRequestGroups.push(requests[j]);
            }
        }
    }

    partRequestGroups = getDelegatedRequestGroups();

    return buildRequestSql(allRequestGroups, partRequestGroups, module);
}

function getAllRequestGroups(aDele, module) {
    var approver = aDele.approver;
    var user = getApprover(approver);
    var ocmGroups = [];

    // codeless request 
    if (module != "ocmq") {
        ocmGroups = lib.MyGroupsSync.getApprovalOfInMyGroups(approver);
    }
    // ocmq, legacy classic request
    else {
        if (user.profile_request == null || user.profile_request.length == 0) {
            return "";
        }

        //get all of his change profile
        var profileNames = funcs.str(funcs.denull(user.profile_request));
        var profileSql = "name isin " + profileNames;
        var profiles = new SCFile("ocmprofile", SCFILE_READONLY);
        var rc = profiles.doSelect(profileSql);

        //go through and return change/task query
        while (rc == RC_SUCCESS) {
            var approvalGroups = profiles.approval_groups;
            var length = approvalGroups.length();
            var i;
            for (i = 0; i < length; ++i) {
                ocmGroups.push(approvalGroups[i]);
            }
            rc = profiles.getNext();
        }
    }

    ocmGroups.push(approver);

    return ocmGroups;
}

function getDelegatedRequestGroups() {
    //find id there is a delegate all 
    var groupList = [];
    var i;
    for (i = 0; i < delegationList.length; ++i) {
        var module = delegationList[i].module;
        if (module == "Request" || module == "ocmq") {
            groupList.push(delegationList[i].group);
        }
    }

    return groupList;
}

function buildRequestSql(allRequestGroups, partRequestGroups, module) {
    var j;
    for (j = 0; j < partRequestGroups.length; ++j) {
        if (arrayIndexOf(allRequestGroups, partRequestGroups[j]) < 0) {
            allRequestGroups.push(partRequestGroups[j]);
        }
    }

    //build a sql for request
    var fileName = "request";
    if (module) {
        fileName = module;
    }

    var moreRequestSql = 'file.name = "' + fileName + '" and current.pending.groups isin {';
    var i;
    for (i = 0; i < allRequestGroups.length; ++i) {
        moreRequestSql += "\"" + allRequestGroups[i] + "\"";
        if (i < allRequestGroups.length - 1) {
            moreRequestSql += ",";
        }
    }
    //add approver to the list	
    moreRequestSql += "} ";

    var returnSql = "";
    if (allRequestGroups.length > 0) {
        returnSql += " or (" + moreRequestSql + ")";
    }

    return returnSql;
}


function addDelegateGroups(currentGroups, module) {
    var length;
    var i;
    var delegateGroups;

    // legacy classic request module which could be still enabled in codeless environment
    if (module == "ocmq") {
        initDelegation();
        if (delegationList.length == 0) {
            return currentGroups;
        }

        var requestSql = getRequestDelegationGroups("ocmq");
        if (requestSql) {
            requestSql = requestSql.substring(requestSql.indexOf("{"));
            delegateGroups = funcs.evaluate(funcs.parse(requestSql, 8));
            length = funcs.lng(delegateGroups);
            for (i = 0; i < length; ++i) {
                if (!lib.ApprovalUtil.isDuplicate(currentGroups, delegateGroups[i])) {
                    currentGroups = funcs.insert(currentGroups, 1, 1, delegateGroups[i]);
                }
            }
        }

        return currentGroups;
    }
    // codeless modules
    else {
        delegateGroups = lib.ApprovalDelegationService.addDelegateGroups(currentGroups, module);
        if (delegateGroups == null || lib.ArrayUtil.length(delegateGroups) == 0) {
            return currentGroups;
        }

        length = lib.ArrayUtil.length(delegateGroups);
        for (i = 0; i < length; i++) {
            if (!lib.ApprovalUtil.isDuplicate(currentGroups, delegateGroups[i])) {
                currentGroups = funcs.insert(currentGroups, 1, 1, delegateGroups[i]);
            }
        }

        return currentGroups;
    }
}

function storeDelegateRecords(ownSql) {
    if (asDelegateList == null) {
        asDelegateList = [];
    }
    var approvals = new SCFile("Approval");
    var rc = approvals.doSelect(ownSql);

    while (rc == RC_SUCCESS) {
        asDelegateList.push(lib.DBUtils.getTagByRecord(approvals));
        rc = approvals.getNext();
    }
}

function isDelegateApproval(id) {
    if (asDelegateList == null) {
        return "NO";
    }
    if (asDelegateList.length == 0) {
        return "YES";
    }

    return funcs.index(id, asDelegateList) > 0 ? "NO" : "YES";
}

// This function checks for current pending groups, expand its member and query 
// current active group
function getDelegatedForNotify(module, pendingGroups, delegatedGroups) {
    //retrieve current pending groups
    var groupType = "cm3groups";
    if (module == "Change") {
        groupType = "cm3groups";
    } else if (module == "Request") {
        groupType = "ocmgroups";
    } else if (module == "SVC") {
        groupType = "assignment";
    } else if (module == "Timeperiod") {
        groupType = "assignment";
    }

    var groupSql = "name isin {";
    var length = pendingGroups.length();
    var i;
    for (i = 0; i < length; ++i) {
        groupSql += "\"" + pendingGroups[i] + "\"";
        if (i < length - 1) {
            groupSql += ",";
        }
    }
    groupSql += "}";

    var groups = new SCFile(groupType, SCFILE_READONLY);
    groups.setFields(["approvers", "operators"]);
    var rc = groups.doSelect(groupSql);

    var date = funcs.str(funcs.tod());
    var delegationSql = "Enable=true and DateFrom <='" + date + "' and DateTo >='" + date + "' and Approver isin {";

    //get member of each group
    var memberArray = [];
    while (rc == RC_SUCCESS) {
        if (module == "cm3r" || module == "cm3t" || module == "ocmq") {
            length = groups.approvers.length();
            for (i = 0; i < length; ++i) {
                memberArray.push(groups.approvers[i]);
            }
        } else if (module == "incidents" || module == "svcCartItem" || module == "timeperiodDefinition") {
            length = groups.operators.length();
            for (i = 0; i < length; ++i) {
                memberArray.push(groups.operators[i]);
            }
        }
        rc = groups.getNext();
    }

    for (i = 0; i < memberArray.length; ++i) {
        delegationSql += "\"" + memberArray[i] + "\"";
        if (i < memberArray.length - 1) {
            delegationSql += ",";
        }
    }
    delegationSql += "}";

    //select delegation
    var delegation = new SCFile("ApprovalDelegation", SCFILE_READONLY);
    rc = delegation.doSelect(delegationSql);

    var matchModule = "Change";
    if (module.substring("cm3") > 0) {
        matchModule = "Change";
    } else if (module.substring("ocm") > 0) {
        matchModule = "Request";
    } else if (module == "incidents" || module == "svcCartItem") {
        matchModule = "SVC";
    } else if (module == "timeperiodDefinition") {
        matchModule = "Timeperiod";
    }

    //build a notification list
    while (rc == RC_SUCCESS) {
        if (delegation.AppModule == "all" || delegation.AppModule == matchModule) {
            delegatedGroups = funcs.insert(delegatedGroups, 0, 1, delegation.Delegate);
        }
        rc = delegation.getNext();
    }

    return delegatedGroups;
}

function disableExpiredDelegation(user) {
    var date = funcs.str(funcs.tod());
    var delegateSql = "Enable=true and Approver=\"" + funcs.operator() + "\" and DateTo <'" + date + "'";
    var delegate = new SCFile("ApprovalDelegation");

    var rc = delegate.doSelect(delegateSql);

    while (rc == RC_SUCCESS) {
        delegate.Enable = false;
        delegate.doUpdate();
        rc = delegate.getNext();
    }
}


function initDelegation() {
    var date = funcs.str(funcs.tod());
    var delegateSql = "Enable=true and Delegate=\"" + funcs.operator() + "\" and DateFrom <='" + date + "' and DateTo >'" + date + "'";

    var delegate = new SCFile("ApprovalDelegation", SCFILE_READONLY);
    var rc = delegate.doSelect(delegateSql);

    delegationList = [];
    while (rc == RC_SUCCESS) {
        var aDele = {};
        aDele.module = delegate.AppModule;
        aDele.group = delegate.AppGroup;
        aDele.approver = delegate.Approver;
        aDele.area = delegate.AppArea;
        delegationList.push(aDele);

        rc = delegate.getNext();
    }
}

function getDelegation() {
    return delegationList;
}

/**
 * gets current approver operator record
 *
 */
function getApprover(approver) {
    var i;
    for (i = 0; i < approverList.length; ++i) {
        var aUser = approverList[i];
        if (aUser.name == approver) {
            return aUser;
        }
    }

    //get approver operator
    var user = new SCFile("operator");
    var sql = "name=\"" + approver + "\"";
    var rc = user.doSelect(sql);
    if (rc == RC_SUCCESS) {
        approverList.push(user);
        return user;
    } else {
        return null;
    }
}

function arrayIndexOf(array1, string1) {
    return lib.ArrayUtil.indexOf(array1, string1);
}


/**
 * flatten approval's current pending groups
 */
function flattenPendingGroups(pendingGroups) {
    var result = [];
    var groups = lib.ArrayUtil.toJsArray(pendingGroups);
    var i;
    for (i = 0; i < groups.length; i++) {
        if (groups[i] == null || groups[i] == '') {
            continue;
        }
        result.push(groups[i]);
        var approvers = getApprovers(groups[i]);
        if (approvers) {
            result = result.concat(approvers);
        }
    }
    return result;
}

/**
 * get approvers of assignment group
 */
function getApprovers(groupName) {
    var assignment = new SCFile("assignment", SCFILE_READONLY);
    assignment.setFields("approvers");
    var ret = assignment.doSelect("name=\"" + groupName + "\"");
    if (ret == RC_SUCCESS) {
        return lib.ArrayUtil.toJsArray(assignment.approvers);
    }
    return null;
}


//This function is the fix of QC48598(Emails do not get sent out to the approval delegates as the documentation says). Find the delegations and store them
//in the $L.delegates.The notification should add another msg to send the email.
function checkDelegation() {
    var needToSend = false;
    var approvalDelegation = new SCFile("ApprovalDelegation", SCFILE_READONLY);
    var query = false;
    var filename = funcs.filename(vars.$L_file);

    var pendingGroups = vars.$L_file.current_pending_groups;
    pendingGroups = flattenPendingGroups(pendingGroups);

    if (filename == "timeperiodDefinition") {
        pendingGroups = lib.timeperiod.getApprovalDetails(vars.$L_file.id, "current.pending.groups");
    }

    if (pendingGroups == null) {
        return needToSend;
    }

    var pendingGroupsLength = funcs.lng(funcs.denull(pendingGroups));

    if (pendingGroupsLength == 0) {
        return needToSend;
    }

    var dDate = new XMLDate(new Date());
    dDate = dDate.getSCDateTimeString();
    query = "AppGroup isin " + funcs.str(pendingGroups) + " and (DateFrom<='" + dDate + "' and DateTo>='" + dDate + "')";

    if (filename == "Approval") {
        filename = vars.$L_file.file_name;
    }

    if (filename == "incidents" || filename == "svcCartItem") {
        query = query + " and (AppModule=\"SVC\" or AppModule=\"all\")";
    }
    if (filename == "cm3r" || filename == "cm3t") {
        query = query + " and (AppModule=\"Change\" or AppModule=\"all\")";
    }
    if (filename == "timeperiodDefinition") {
        query = query + " and (AppModule=\"Timeperiod\" or AppModule=\"all\")";
    }
    if (filename == "ocmq" || filename == "request") {
        query = query + " and (AppModule=\"Request\" or AppModule=\"all\")";
    }

    var delegate = approvalDelegation.doSelect(query);
    if (delegate == RC_SUCCESS) {
        var moreOperators = [];
        while (delegate == RC_SUCCESS) {
            var currentTime = funcs.tod();
            if (approvalDelegation.Enable && currentTime >= approvalDelegation.DateFrom && currentTime <= approvalDelegation.DateTo) {
                var alreadyIn = false;

                var i;
                for (i = 0; i < pendingGroupsLength; i++) {
                    if (pendingGroups[i] == approvalDelegation.Delegate) {
                        alreadyIn = true;
                        break;
                    }
                }

                if (alreadyIn == false) {
                    moreOperators.push(approvalDelegation.Delegate);
                    needToSend = true;
                }
            }
            delegate = approvalDelegation.getNext();
        }
    }

    vars.$L_delegates = moreOperators;
    return needToSend;
}