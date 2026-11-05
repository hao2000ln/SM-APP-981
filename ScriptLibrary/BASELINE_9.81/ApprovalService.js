var $ = lib.c.$;

var security = lib.security;

var approvalEnablement = lib.ApprovalEnablementManager;
var approvalDelegation = lib.ApprovalDelegationService;


/**
 * @public
 * @description  Get Object Common name
 * @param {String} rec - record
 * @return {String} commonname - common name 
 */
function getObjectCommonName(rec) {

    var fileName = funcs.filename(rec);
    var commonname = funcs.scmsg(fileName, "tablename");
    return commonname;

}

/**
 * @public
 * @description  Get Unique key of record
 * @param {String} rec - record
 * @return {String} rec[name] - uniquekey name 
 */
function _getUniqueKey(rec) {

    var fileName = funcs.filename(rec);
    var dbdict = $(fileName).dbdict();
    var dbdictService = $("#dbdictService");
    var name = dbdictService.getPrimaryKey(dbdict["key"]).name[0];
    var pathIdx = name.lastIndexOf(",");
    if (pathIdx > 0) {
        name = name.substring(pathIdx + 1);
    }
    return rec[name];
}


/**
 * @public
 * @description  Check whether user can approve or retract
 * @param {String} area - SecArea
 * @param {String} right - SecRight
 * @param {String} rec - record
 * @return {Array} result - can approve, can retract 
 */
function canApproveRetract(area, rec) {

    var result = [false, false];
    var approvalAuthority = security.getRights(area, "approvals");

    if (approvalAuthority == "true" || approvalAuthority == true) {

        var filename = funcs.filename(rec);
        filename = lib.Workflow.getWorkflowTableName(filename);

        var query = "file.name=\"" + filename + "\" and unique.key=\"" + _getUniqueKey(rec) + "\"";

        var delegate_name = lib.ApprovalUtil.checkDelegate(query, filename);
        var approval_groups = lib.ApprovalDelegationGroups.addDelegateGroups(vars.$G_myGroups["approver.of"], filename);

        //for new delegation
        //var delegate_name = lib.ApprovalDelegationService.checkDelegate(query, area);         
        //var approval_groups = lib.ApprovalDelegationService.addDelegateGroups(vars.$G_myGroups["approver.of"],area);

        var err;
        var approval_intersect = new SCDatum();
        var retract_intersect = new SCDatum();
        approval_intersect.setType(8);
        retract_intersect.setType(8);
        var rc = funcs.rtecall("intersect", err, approval_intersect, approval_groups, rec["current.pending.groups"]);
        rc = funcs.rtecall("intersect", err, retract_intersect, approval_groups, rec["approved.groups"]);
        result[0] = funcs.lng(approval_intersect) ? true : false;
        result[1] = funcs.lng(retract_intersect) ? true : false;
    }
    return result;
}


//print(getAllCanApprovalDelegateApprovalSupportedSecAreas("approvals"));
/**
 * @public
 * @description  Get All secAreas
 * @param {String} type - "approvals", "delegate"
 * @return {Array} areas - All secAreas
 */
function getAllCanApprovalDelegateApprovalSupportedSecAreas(type) {

    var areas = [];
    var id = "approvals";

    if (type == "approvals") {
        id = "approvals";
    } else if (type == "delegate") {
        id = "approve.delegate";
    }
    var settingsConfig = new SCFile("settingsConfig", SCFILE_READONLY);
    var sql = "id=\"" + id + "\" and settingType=\"area\"  and type=\"boolean\"";
    settingsConfig.setFields(["setting"]);

    if (settingsConfig.doSelect(sql) == RC_SUCCESS) {
        do {
            areas.push(settingsConfig["setting"]);

        } while (settingsConfig.getNext() === RC_SUCCESS);
    }
    return areas;
}


/**
 * @public
 * @description  Get All Can Approval table for selected secAreas
 * @return {Array} areas - All secAreas
 */
function getCanApprovalTablesforSecAreas(areas) {

    var tables = [];
    var canApprove = false;
    var temp = [];

    for (i = 0; i < areas.length; i++) {
        canApprove = security.hasRight(areas[i], "approvals");
        if (canApprove == true || canApprove == "true") {
            temp = security.getTablesForArea(areas[i], false);
            lib.ArrayUtil.addAllWithoutDuplicate(tables, temp);
        }

    }
    return tables;

}
//getPendingMyApprovalsSQL();
/**
 * @public
 * @description  Get pending my approval sql query for approval.inbox
 * @return {String} query - SQL Query
 */
function getPendingMyApprovalsSQL() {


    var query = "";
    var fileNames = "(";
    var files = getCanApprovalTablesforSecAreas(getAllCanApprovalDelegateApprovalSupportedSecAreas("approvals"));

    //skip timeperiod since they are using $lo.pm.assignments not myGroups and any others? 
    var index = lib.ArrayUtil.indexOf(files, "timeperiodDefinition");
    if (index > 0) {
        files.splice(index, 1);
    }
    //skip incident and svcCartItem table for same reason: $G.sm.environment
    //index= lib.ArrayUtil.indexOf(files,"incidents");
    //files.splice(index,1);	

    //index= lib.ArrayUtil.indexOf(files,"svcCartItem");
    //files.splice(index,1);

    var len = files.length;
    if (len == 0) {
        return query;
    }

    for (i = 0; i < len; i++) {
        //if(files[i]!="timeperiodDefinition"){			 
        fileNames = fileNames + "file.name= \"" + files[i] + "\"";

        if (i < len - 1) {
            fileNames = fileNames + " or ";
        }
        //}
    }


    var approver_of = funcs.str(vars.$G_myGroups["approver.of"]);
    query = fileNames + ") and current.pending.groups isin " + approver_of;
    //print(query)
    //"file.name=\"request\" and current.pending.groups isin  str(denull(approver.of in $G.myGroups)	
    return query;
}


function getMyAllApprovalsViewSQL() {

    var mySQL = getMyPendingApprovalsViewSQL();
    var myPendingSQL = approvalDelegation.getMyPendingDelegatedApprovalsViewSQL();
    var query = mySQL + "or (" + myPendingSQL + ")";
    return query;
}

/**
 * @public
 * @description  Get pending my approval sql query for view: My Pending Approvals
 * @return {String} query - SQL Query
 */
function getMyPendingApprovalsViewSQL() {

    //var query="approval.status=\"pending\" and (approvals.record=NULL or approvals.record=true) and (";
    var query = " (";
    var oobquery = "(file.name=\"cm3r\" and (current.pending.groups isin approval.groups in $G.cm3r.environment or current.pending.groups isin {$lo.user.name})) or (file.name=\"request\" and (current.pending.groups isin approval.groups in $G.ocmq.environment or current.pending.groups isin {$lo.user.name})) or ((file.name=\"incidents\" or file.name=\"svcCartItem\") and (current.pending.groups isin approval.groups in $G.sm.environment or current.pending.groups isin {$lo.user.name})) or (file.name=\"timeperiodDefinition\" and (current.pending.groups isin $lo.pm.assignments or current.pending.groups isin {$lo.user.name}))";


    if (approvalEnablement.isNewApprovalInboxDelegation()) {
        var sql = getPendingMyApprovalsSQL();
        if (sql != null && sql != "") {
            sql = oobquery + "or (" + sql + ")";
            query = query + sql + ")";
        } else {
            query = query + oobquery + ")";
        }
    } else {

        query = query + oobquery + ")";

    }
    //print(query);

    return query;
}

/**
 * @public
 * @description  Check if the ticket id specifiec in extquery is in the current operator's approval inbox.
 *                if yes, return the ticket, if not, return empty string.
 *                For probsummary only
 * @return {String} ticket list
 */
function getPendingApprovalTickets(extquery, file) {
    if (!extquery || !file) {
        return funcs.str([]);
    }

    var tickets_temp = [];
    var query = getMyAllApprovalsViewSQL();
    var fApproval = $("Approval", SCFILE_READONLY).setFields(["unique.key"]);
    query = 'file.name = "' + file + '" and (' + query + ')';
    fApproval.select(query).iterate(function(record) {
        tickets_temp.push(record["unique.key"]);
    });
    if (tickets_temp.length == 0) {
        return "{}";
    }

    var isRelatedQuery = lib.viewFunctions.isRelatedObjectQuery(extquery);
    var tickets = [];
    // split into small array to avoid sql too long error
    var subs = lib.ArrayUtil.split(tickets_temp, 300);
    var i;
    var subQuery;
    var key = lib.dbdictHelper.getUniqueKey(file)[0];
    var smFile = $(file, SCFILE_READONLY).setFields([key]);
    for (i = 0; i < subs.length; i++) {
        subQuery = key + " isin " + funcs.str(subs[i]) + " and (" + extquery + ")";
        if (isRelatedQuery == "true" && (file == "incidents" || file == "probsummary")) {
            var fieldList = new Array(file + ";*");
            subQuery = funcs.generate_sql_query(fieldList, subQuery, file);
        }
        smFile.select(subQuery).iterate(function(record) {
            tickets.push(record[key]);
        });
    }
    return funcs.str(tickets);
}