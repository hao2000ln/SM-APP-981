var $ = lib.c.$;
var wfService = lib.Workflow; 
var constants = lib.SMSAP_PD_Constants;

var customPDWorkFlow = "Incident for SAP";
function updatePDWorkFlow() {
	var tWorkFlow = $("Workflow").select("name=\"" + customPDWorkFlow + "\" and tableName=\"probsummary\"").uniqueResult();
	if (tWorkFlow) {
		tWorkFlow["onCreateRules"] = addRuleToRuleSets(tWorkFlow["onCreateRules"], ["SMSAP.im.set.sapinfo"]);
		tWorkFlow["onUpdateRules"] = addRuleToRuleSets(tWorkFlow["onUpdateRules"], ["SMSAP.im.set.sapinfo"]);
		tWorkFlow["afterUpdateRules"] = addRuleToRuleSets(tWorkFlow["afterUpdateRules"], ["SMSAP.im.process.action"]);
		tWorkFlow["onDisplayRules"] = addRuleToRuleSets(tWorkFlow["onDisplayRules"], ["SMSAP.im.init.solution.manager"]);
		tWorkFlow.doAction("save");
	}
}

function cloneIncidentsWorkFlow() {
	var result = false;
	var incWF = $("Workflow").select('name=\"Incident\"').uniqueResult();
	if (incWF) {
		var incWFSAP = $("Workflow").select("name=\"" + customPDWorkFlow + "\"").uniqueResult();
		if (!incWFSAP) {
			result = wfService.clone(incWF, customPDWorkFlow, "true", "SAP");
			print("Clone Workflow done.");
		}
	}
	return result;
}

function updateIncidentCategoryWorkFlow(incidentCategory) {

	var imCat = $("imCategory").select("name=\"" + incidentCategory + "\"").uniqueResult();
	if (imCat) {
		var incWF = $("Workflow").select("name=\"" + customPDWorkFlow + "\"").uniqueResult();
		if (incWF) {
			imCat["workflow"] = customPDWorkFlow;
			imCat.doAction("save");
			print("Change Incident Category WorkFlow done.");
		}
	} else {
		imCat = new SCFile("imCategory");
		imCat["name"] = catName;
		imCat["active"] = true;
		imCat["description"] = catName;
		imCat["sharedflag"] = 3;
		imCat["workflow"] = customPDWorkFlow;
		imCat.doAction("save");
	}
}

function addRuleToRuleSets(sets, newList) {
	if (!newList || newList.length <= 0)
		return;
	if (!sets)
		sets = $.createSCArray();
	for (var j = 0; j < newList.length; j++) {
		if (!$.contains(sets, newList[j])) {
			sets.push(newList[j]);
		}
	}
	return sets;
}
/**
function updatePDWorkFlowPhase() {
	var tailoringWorkFlowPhaseList = ["Logging", "Categorization", "Investigation", "Review", "Recovery", "Closure"];
	for (var j = 1; j < tailoringWorkFlowPhaseList.length - 1; j++) {
		var tWorkFlowPhase = $("WorkflowPhase").select("phaseName=\"" + tailoringWorkFlowPhaseList[j] + "\" and tableName=\"probsummary\" and workflowName=\"WF Incident for SAP\"").uniqueResult();
		var newWorkFlowPhase = $("WorkflowPhase").select("phaseName=\"" + tailoringWorkFlowPhaseList[j] + "\" and tableName=\"probsummary\" and workflowName=\"" + customPDWorkFlow + "\"").uniqueResult();
		if (tWorkFlowPhase && newWorkFlowPhase) {
			newWorkFlowPhase["action"] = tWorkFlowPhase["action"];
			newWorkFlowPhase["manualTransition"] = tWorkFlowPhase["manualTransition"];
			newWorkFlowPhase["autoTransition"] = tWorkFlowPhase["autoTransition"];
			if(j==2) print("****** newWorkFlowPhase: "+ lib.debugUtils.display(newWorkFlowPhase));
			newWorkFlowPhase.doAction("save");
		}
	}
}
**/

function updatePDWorkFlowPhase() {

	var tailoringWorkFlowPhaseList = ["Logging", "Categorization", "Investigation", "Review", "Recovery", "Closure"];
	var addActionNames = ["Copy Record", "Add Info", "Send Back", "Send Incident", "Refuse Solution", "Send Solution", "Close SAP Incident"];
	//copyRecordAction addInfoAction. sendBackAction, sendIncidentAction refuseSolutionAction sendSolutionAction closeSAPIncidentAction
		for (var j = 1; j < tailoringWorkFlowPhaseList.length - 1; j++) {
			var tWorkFlowPhase = $("WorkflowPhase").select("phaseName=\"" + tailoringWorkFlowPhaseList[j] + "\" and tableName=\"probsummary\" and workflowName=\"" + customPDWorkFlow + "\"").uniqueResult();
			if (tWorkFlowPhase) {
				var phaseName = tailoringWorkFlowPhaseList[j];
				var crIndex = getActionIndex(tWorkFlowPhase, "Copy Record");				
				if (crIndex != -1) {					
					tWorkFlowPhase["action"][crIndex]["actionCondXML"] = constants.get("copyRecordActionCondXML");
					tWorkFlowPhase["action"][crIndex]["actionCondition"] = constants.get("copyRecordActionCondition");
					tWorkFlowPhase["action"][crIndex]["actionCondDesc"] = constants.get("copyRecordActionCondDesc");
				}

				//add Add Info action to phase "Investigation", "Review", "Recovery"
				var aiIndex = getActionIndex(tWorkFlowPhase, "Add Info");				
				if ((j == 2 || j == 3 || j == 4) && aiIndex == -1) {					
					tWorkFlowPhase["action"].push(constants.get("addInfoAction"));
				}
				//add Send Back action to phase "Investigation", "Review", "Recovery"
				if ((j == 2 || j == 3 || j == 4) && getActionIndex(tWorkFlowPhase, "Send Back") == -1) {
					tWorkFlowPhase["action"].push(constants.get("sendBackAction"));
				}
				//add Send Incident action to phase "Investigation", "Review"
				if ((j == 2) && getActionIndex(tWorkFlowPhase, "Send Incident") == -1) {
					tWorkFlowPhase["action"].push(constants.get("sendIncidentAction"));
				}
				if ((j == 4) && getActionIndex(tWorkFlowPhase, "Reject Solution") == -1) {
					tWorkFlowPhase["action"].push(constants.get("rejectSolutionAction"));
				}
				if ((j == 4) && getActionIndex(tWorkFlowPhase, "Send Solution") == -1) {
					tWorkFlowPhase["action"].push(constants.get("sendSolutionAction"));
				}
				if ((j == 3) && getActionIndex(tWorkFlowPhase, "Close SAP Incident") == -1) {
					tWorkFlowPhase["action"].push(constants.get("closeSAPIncidentAction"));
				}
				if (j == 4) {
					var atcIndex = getAutoTransitionIndex(tWorkFlowPhase, "Closure");
					if (atcIndex == -1) {
						if (!tWorkFlowPhase["autoTransition"])
							tWorkFlowPhase["autoTransition"] = $.createSCArray();
						tWorkFlowPhase["autoTransition"].push(constants.get("closureAutoTransition"));
					}
					var mtcIndex = getManualTransitionIndex(tWorkFlowPhase, "Closure");
					if (mtcIndex != -1) {
						tWorkFlowPhase["manualTransition"][mtcIndex]["mtCondXML"] = constants.get("closureManualTransitionMtCondXML");
						tWorkFlowPhase["manualTransition"][mtcIndex]["mtCondition"] = constants.get("closureManualTransitionMtCondition");
						tWorkFlowPhase["manualTransition"][mtcIndex]["mtCondDesc"] = constants.get("closureManualTransitionMtCondDesc");
					}
				}
				if (j == 3) {
					var atcIndex = getAutoTransitionIndex(tWorkFlowPhase, "Closure");
					if (atcIndex == -1) {
						if (!tWorkFlowPhase["autoTransition"])
							tWorkFlowPhase["autoTransition"] = $.createSCArray();
						tWorkFlowPhase["autoTransition"].push(constants.get("closureAutoTransition"));
					}

					var atrIndex = getAutoTransitionIndex(tWorkFlowPhase, "Recovery");
					if (atrIndex == -1) {
						if (!tWorkFlowPhase["autoTransition"])
							tWorkFlowPhase["autoTransition"] = $.createSCArray();
						tWorkFlowPhase["autoTransition"].push(constants.get("recoveryAutoTransition"));
					}
					var mtcIndex = getManualTransitionIndex(tWorkFlowPhase, "Closure");
					if (mtcIndex != -1) {
						tWorkFlowPhase["manualTransition"][mtcIndex]["mtCondXML"] = constants.get("closureManualTransitionMtCondXML");
						tWorkFlowPhase["manualTransition"][mtcIndex]["mtCondition"] = constants.get("closureManualTransitionMtCondition");
						tWorkFlowPhase["manualTransition"][mtcIndex]["mtCondDesc"] = constants.get("closureManualTransitionMtCondDesc");
					}
				}
				//print("**** tWorkFlowPhase: " + lib.debugUtils.display(tWorkFlowPhase));
				tWorkFlowPhase.doSave();
			}
		}
}

function getActionIndex(phase, actionName) {
	if (!phase || !phase["action"] || !actionName)
		return -1;
	for (var k = 0; k < phase["action"].length(); k++) {
		if (phase["action"][k] && phase["action"][k]["actionName"] == actionName) {
			return k;
		}
	}
	return -1;
}

function getAutoTransitionIndex(phase, atName) {
	if (!phase || !phase["autoTransition"] || !atName)
		return -1;
	for (var k = 0; k < phase["autoTransition"].length(); k++) {
		if (phase["autoTransition"][k] && phase["autoTransition"][k]["atToPhase"] == atName) {
			return k;
		}
	}
	return -1;
}

function getManualTransitionIndex(phase, mtName) {
	if (!phase || !phase["manualTransition"] || !mtName)
		return -1;
	for (var k = 0; k < phase["manualTransition"].length(); k++) {
		if (phase["manualTransition"][k] && phase["manualTransition"][k]["mtToPhase"] == mtName) {
			return k;
		}
	}
	return -1;
}
