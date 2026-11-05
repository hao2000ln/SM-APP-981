//
//SMSSM1.01 SM9.31
//
function isEmpty(o)
{
	return (o == null || o == "");
}

var triggerCnt = 0;

function trigger(incidentId, action, extHdId)
{
	if (isEmpty(incidentId) || isEmpty(action))
	{
		print("assertion failed!");
		return false;
	}
	
	if (isEmpty(extHdId))
	{
		print(system.functions.scmsg( 2, "SMSAP" ));
		return false;
	}
	
	print(system.functions.scmsg( 5, "SMSAP", [new Date(), ++triggerCnt, incidentId, action, extHdId]));
	
	return triggerIctEx(incidentId, action, extHdId);
}

function triggerIctEx(incidentId, action, extHdId)
{
	var configItem = lib.smis_ConfigurationManager.getEnabledConfigItem("SMSAP");
	var baseUrl = configItem.getConfigParameterValue("baseurl");
	var url = baseUrl + "?parameters=" + encodeURIComponent(action) + ";" + encodeURIComponent(incidentId) + ";" + encodeURIComponent(extHdId);
	var headers = new Array();
	try
	{
		var response = doHTTPRequest("GET", url, headers, null, 30, 30, 30);
		print(system.functions.scmsg( 1, "SMSAP", [incidentId, response]));
	}
	catch (e)
	{
		print(system.functions.scmsg( 4, "SMSAP", [incidentId, e]));
		return false;
	}
	return true;
}

function getCIType(ciName) {
	var file = new SCFile("device");
	var ret = file.doSelect("logical.name=\"" + ciName + "\"");
	
	if (ret == RC_SUCCESS) {
		return file.type;
	}
}

function setSAPInfoByCI(ciName, incident) {
	incident["sap.sid"] = null;
	incident["sap.client"] = null;
	incident["sap.installationnumber"] = null;
	
	if (ciName == null || ciName == "") 
		return;

	var citype = getCIType(ciName);
	
	if (citype.toLowerCase() == "sapinstance") {
		var file = new SCFile("joinsapinstance");
		var ret = file.doSelect("logical.name=\"" + ciName + "\"");
		
		if (ret == RC_SUCCESS) {
			incident["sap.sid"] = file["SID"];
			incident["sap.client"] = file["client"];
			incident["sap.installationnumber"] = file["installation.number"];
		}
	} 
}

function setCIBySAPInfo(incident) {
	var sid = incident["sap.sid"];
	var client = incident["sap.client"];
	var installationnumber = incident["sap.installationnumber"];
	
	var file = new SCFile("joinsapinstance");
	var ret = file.doSelect("SID=\""+sid+"\" and client=\""+client+"\" and installation.number=\""+installationnumber+"\"");
	if (ret == RC_SUCCESS) {
		incident["logical.name"] = file["logical.name"];
	}
}

function fillSAPInfo(incident, oldIncident) {
	if (!incident)
		return;
	if (!incident["logical.name"] && incident["sap.sid"] && incident["is.incident.exchange"] == true) {
		setCIBySAPInfo(incident);
	} else if (oldIncident && incident["logical.name"] && incident["logical.name"] != oldIncident["logical.name"]) {
		setSAPInfoByCI(incident["logical.name"], incident);
	}
}

