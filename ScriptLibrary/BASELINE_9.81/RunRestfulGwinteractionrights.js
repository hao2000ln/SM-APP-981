var logger = getLog('RunRestfulGwinteractionrights');
var _getInteractionSQL=lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getInteractionSQL;
var _getInteractionApprovalSQL=lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getInteractionApprovalSQL;
var _getCartItemApprovalSQL=lib.GatewayAPI_WSInterface_Interaction_Info_Custom._getCartItemApprovalSQL;
var select = lib.GatewayAPI_RAD._select;

function checkInteractionRights(id) {
    var fields = ["incident.id"];
    var query = _getInteractionSQL(id, vars.$lo_operator.name);
    var incident = select("incidents", query, fields);
    var ret = {};
    if (incident == null) {
        ret.canApprove = select("incidents", _getInteractionApprovalSQL(id), fields) != null || 
                select("incidents", _getCartItemApprovalSQL(id), fields) != null;
        ret.canUpdate = false;
    } else {
        ret.canUpdate = true;
    }
    return ret;
}

function GET(request, response) {
    getInteractionRights(request, response);
}

function getInteractionRights(req, response) {
    var uri = req.uri || [];
    var id = uri[2] || '';
    if (!id) {
      response.status(400);
    }
    var permission = checkInteractionRights(id);
    response.send(permission);
}

function authorize() {
    return true;
}