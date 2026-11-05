var $ = lib.c.$;
//var _parseToLogical = lib.SMSAP_Utils._parseToLogical;
//print(get("addInfoAction"));

function _parseToLogical(str) {
	return str;
}
function get(pName) {
	//actions rejectSolutionAction
	if (pName == "addInfoAction")
		return addInfoAction;
	
	if (pName == "sendBackAction")
		return sendBackAction;
	
	if (pName == "sendIncidentAction")
		return sendIncidentAction;
	
	if (pName == "refuseSolutionAction")
		return refuseSolutionAction;
		
	if (pName == "rejectSolutionAction")
		return rejectSolutionAction;
	
	if (pName == "sendSolutionAction")
		return sendSolutionAction;
	
	if (pName == "closeSAPIncidentAction")
		return closeSAPIncidentAction;

	if (pName == "copyRecordActionCondXML")
		return copyRecordActionCondXML;

	if (pName == "copyRecordActionCondition")
		return copyRecordActionCondition;

	if (pName == "copyRecordActionCondDesc")
		return copyRecordActionCondDesc;

	//AutoTransitions
	if (pName == "closureAutoTransition")
		return closureAutoTransition;
	if (pName == "recoveryAutoTransition")
		return recoveryAutoTransition;

	if (pName == "closureManualTransitionMtCondXML")
		return closureManualTransitionMtCondXML;
	if (pName == "closureManualTransitionMtCondition")
		return closureManualTransitionMtCondition;
	if (pName == "closureManualTransitionMtCondDesc")
		return closureManualTransitionMtCondDesc;
	return null;

}
var addInfoAction = $.createSCStructure(
		"Add Info",
		"SMSAP.im.add.info",
		"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and hidden.meta.data in $L.filed~=NULL and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\" and hidden.meta.data in $L.filed~=\"Closed\"",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and hidden.meta.data in $L.filed~=NULL and hidden.meta.data in $L.filed~=&quot;Requester:StartExchange:Error&quot; and hidden.meta.data in $L.filed~=&quot;Closed&quot;\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		72,
		false,
		"save",
		"( Expression: nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and hidden.meta.data in $L.filed~=NULL and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\" and hidden.meta.data in $L.filed~=\"Closed\")",
		41);

var sendBackAction = $.createSCStructure(
		"Send Back",
		"SMSAP.im.send.back",
		"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\" or hidden.meta.data in $L.filed=\"Requester:RequesterProcessing\" or hidden.meta.data in $L.filed=\"Requester:RequesterProcessing:Error\")",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=&quot;Provider:ProviderProcessing&quot; or hidden.meta.data in $L.filed=&quot;Provider:ProviderProcessing:Error&quot; or hidden.meta.data in $L.filed=&quot;Requester:RequesterProcessing&quot; or hidden.meta.data in $L.filed=&quot;Requester:RequesterProcessing:Error&quot;)\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		71,
		false,
		"save",
		"( Expression: nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\" or hidden.meta.data in $L.filed=\"Requester:RequesterProcessing\" or hidden.meta.data in $L.filed=\"Requester:RequesterProcessing:Error\"))",
		42);

var sendIncidentAction = $.createSCStructure(
		"Send Incident",
		"SMSAP.im.send.incident",
		"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=NULL or hidden.meta.data in $L.filed=\"Requester:StartExchange:Error\")",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=NULL or hidden.meta.data in $L.filed=&quot;Requester:StartExchange:Error&quot;)\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		79,
		false,
		"save",
		"( Expression: nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=NULL or hidden.meta.data in $L.filed=\"Requester:StartExchange:Error\"))",
		43);

var refuseSolutionAction = $.createSCStructure(
		"Refuse Solution",
		"SMSAP.im.reject.solution",
		 "nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Requester:SolutionProvided\" or hidden.meta.data in $L.filed=\"Requester:SolutionProvided:Error\")",
		 "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=&quot;Requester:SolutionProvided&quot; or hidden.meta.data in $L.filed=&quot;Requester:SolutionProvided:Error&quot;)\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		72,
		false,
		"save",
		"( Expression: nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=\"Requester:SolutionProvided\" or hidden.meta.data in $L.filed=\"Requester:SolutionProvided:Error\"))",
		44);
		
var rejectSolutionAction = $.createSCStructure(
		"Refuse Solution",
		"SMSAP.im.reject.solution",
		"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Requester:SolutionProvided\" or hidden.meta.data in $L.filed=\"Requester:SolutionProvided:Error\")",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=&quot;Requester:SolutionProvided&quot; or hidden.meta.data in $L.filed=&quot;Requester:SolutionProvided:Error&quot;)\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		64,
		false,
		"save",
		"( Expression: nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=\"Requester:SolutionProvided\" or hidden.meta.data in $L.filed=\"Requester:SolutionProvided:Error\"))",
		36);

var sendSolutionAction = $.createSCStructure(
		"Send Solution",
		"SMSAP.im.send.solution",
		"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\")",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\")\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		73,
		false,
		"save",
		"( Expression: ( nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\") ))",
		45);

var closeSAPIncidentAction = $.createSCStructure(
		"Close SAP Incident",
		"SMSAP.im.close.incident",
		"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed)#\"Requester\" and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\"",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed)#\"Requester\" and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\"\"</Expression></operand></condition></collection></XmlCondition>",
		1,
		73,
		false,
		"save",
		"( Expression: ( nullsub(SMSAP in $G.system.info, false) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed)#\"Requester\" and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\" ))",
		46);

var closureAutoTransition = $.createSCStructure(
		"Closure",
		"hidden.meta.data in $L.file=\"Closed\"",
		$.createSCArray("SMSAP.im.set.status.closed"),
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"hidden.meta.data in $L.file=\"Closed\"\"</Expression></operand></condition></collection></XmlCondition>",
		"( hidden.meta.data in $L.file=\"Closed\" )",
		660,
		70,
		null,
		null);

var recoveryAutoTransition = $.createSCStructure(
		"Recovery",
		"hidden.meta.data in $L.file=\"Provider:ProviderProcessing\"",
		$.createSCArray("SMSAP.im.back.to.Recovery"),
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"hidden.meta.data in $L.file=\"Provider:ProviderProcessing\"\"</Expression></operand></condition></collection></XmlCondition>",
		"( hidden.meta.data in $L.file=\"Provider:ProviderProcessing\" )",
		590,
		140,
		null,
		null);

var copyRecordAction = $.createSCStructure(
		"Copy Record",
		"SAP.im.cloneIncident",
		"$G.ess=false and (category in $L.file) isin $G.auth.categories and $L.mode~=\"add\" and nullsub(jscall(\"security.hasRight\", \"Incident\", \"new\"), false)=\"true\" and hidden.meta.data in $L.filed=NULL",
		"<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"$G.ess=false and category in $L.file isin $G.auth.categories and $L.mode ~= \"add\" and nullsub(jscall(\"security.hasRight\", \"Incident\", \"new\"), false) = \"true\" and hidden.meta.data in $L.filed=NULL\"</Expression></operand></condition></collection></XmlCondition>",
		2,
		288,
		false,
		"( $G.ess=false and category in $L.file isin $G.auth.categories and $L.mode ~= \"add\" and nullsub(jscall(\"security.hasRight\", \"Incident\", \"new\"), false) = \"true\" and hidden.meta.data in $L.filed=NULL )",
		10);

var copyRecordActionCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"$G.ess=false and category in $L.file isin $G.auth.categories and $L.mode ~= \"add\" and nullsub(jscall(\"security.hasRight\", \"Incident\", \"new\"), false) = \"true\" and hidden.meta.data in $L.filed=NULL\"</Expression></operand></condition></collection></XmlCondition>";
var copyRecordActionCondition = "( $G.ess=false and category in $L.file isin $G.auth.categories and $L.mode ~= \"add\" and nullsub(jscall(\"security.hasRight\", \"Incident\", \"new\"), false) = \"true\" and hidden.meta.data in $L.filed=NULL )";
var copyRecordActionCondDesc = "( $G.ess=false and category in $L.file isin $G.auth.categories and $L.mode ~= \"add\" and nullsub(jscall(\"security.hasRight\", \"Incident\", \"new\"), false) = \"true\" and hidden.meta.data in $L.filed=NULL )";

var closureManualTransitionMtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\"><operand type=\"expression\"><Expression caption=\"\">\"$L.tableAccess.delete=\"true\" and two.step in $G.pm.global.environment=\"false\" and hidden.meta.data in $L.file=NULL\"</Expression></operand></condition></collection></XmlCondition>";
var closureManualTransitionMtCondition = "$L.tableAccess.delete=\"true\" and two.step in $G.pm.global.environment=\"false\" and hidden.meta.data in $L.file=NULL";
var closureManualTransitionMtCondDesc = "( $L.tableAccess.delete=\"true\" and two.step in $G.pm.global.environment=\"false\" and hidden.meta.data in $L.file=NULL )";
