var logger = getLog('GatewayAPI_Security');
var $ = lib.c.$;
var _getInteractionSQL=lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getInteractionSQL;
var _getInteractionApprovalSQL=lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getInteractionApprovalSQL;
var _getCartItemApprovalSQL=lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getCartItemApprovalSQL;
var select = lib.GatewayAPI_RAD._select;

function checkInteractionRights(id) {
    var fields = ["incident.id"];
    var query = _getInteractionSQL(id, vars.$lo_operator.name);
    var incident = select("incidents", query, fields);
    if (incident == null) {             
        var incident = select("incidents", _getInteractionApprovalSQL(id), fields);
    }
    if (incident == null) {             
        var incident = select("incidents", _getCartItemApprovalSQL(id), fields);
    }
    return incident != null;
}

function checkRequestRights(id) {
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$gwgroups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'request');
    var sql =  'select * from request a inner join Approval b on (a.number=b.unique.key) where b.current.pending.groups isin $gwgroups and a.number="' + id + '"';
    var request = select("request", sql, ['number']);
    return request != null;
}

function checkChangeRights(id) {
    vars.$L_groups1 = vars.$G_sm_environment.approval_groups;
    vars.$gwgroups=lib.ApprovalDelegationGroups.addDelegateGroups(vars.$L_groups1, 'cm3r');
    var sql =  'select * from cm3r a inner join Approval b on (a.number=b.unique.key) where b.current.pending.groups isin $gwgroups and a.number="' + id + '"';
    var cm3r = select("cm3r", sql,  ["number"]);
    return cm3r != null;
}

function checkInteractionRightsWithSQL(id, query) {
    var fields = ["incident.id"];
    var query = lib.GatewayAPI_svcCatApprovals._getInteractionSQLByQuery(id, query);
    var incident = select("incidents", query, fields);
    return incident != null;
}