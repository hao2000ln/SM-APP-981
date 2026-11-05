var incidentManagment = new lib.IncidentManagement.IncidentManagement();
var request  = new lib.IncidentManagement.RetrieveIncidentRequest();
request.model.keys.query="number=\"IM10001\"";


var response = incidentManagment.invoke(request);

print(response.message);