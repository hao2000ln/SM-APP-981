var $ = lib.c.$;
var util = lib.SMSAP_Utils;
var constants = lib.SMSAP_Constants;
var pdUpdate = lib.SMSAP_PD_Update;

//******need modify dbdict area start******

var tailoringWorkFlowList = constants.getCustomPDWorkFlowList();
var newIncidentCustomerFields = constants.getNewIncidentCustomFields();
var newIncidentCustomerFieldsCaptions = constants.getNewIncidentCustomFieldsCaptions();
var newIncidentCustomerFieldsTypes = constants.getNewIncidentCustomFieldsTypes();
var newIncidentCustomerFieldsSqlTypes = constants.getNewIncidentCustomFieldsSqlTypes();

var newIncidentSystemFields = ["sap.sid", "sap.client", "sap.installationnumber",
	"hidden.meta.data", "is.incident.exchange", "exthd",
	"sap.incident.type", "is.ictex.action.blocked", "sla.vendor"];

var newIncidentSystemFieldsCaptions = ["SapSid", "SapClient", "SapInstallationNumber",
	"HiddenMetaData", "IsIncidentExchange", "Exthd", "SLA_VENDOR"];

var newIncidentSystemFieldsTypes = [2, 2, 2, 2, 4, 2, 2, 4, 2];

var newIncidentSystemFieldsSqlTypes = ["VARCHAR(60)", "VARCHAR(60)", "VARCHAR(60)",
	"VARCHAR(60)", "CHAR(1)", "VARCHAR(60)",
	"VARCHAR(60)", "CHAR(1)", "VARCHAR(60)"];

var newIncidentArrayField = "exchange.history";
var newIncidentArrayStructureFields = ["date.stamp", "history.update"];
var newIncidentArrayStructureFieldsType = [3, 2];

function updateFrameWork(incidentCategory) {
	modifySAPDbdict();
	updateExtaccess();
	updateDeviceSapinstanceGFormat();
	var isPD = util.isPDEnabled(incidentCategory);
	if (!isPD) {
		createDisplayOption();
		updateDisplayOption();
		updateImViewStatus();
		updateProcessSeparator();
		handleSAPCIInfoInTrigger();
	}

	if (isPD) {
		var cloneResult= pdUpdate.cloneIncidentsWorkFlow();
		if (cloneResult){
			pdUpdate.updatePDWorkFlow();
			pdUpdate.updatePDWorkFlowPhase();
			pdUpdate.updateIncidentCategoryWorkFlow(incidentCategory);			
		}		
	}
}

function cloneUser(){
	util.cloneUser("falcon", "ovictex", "ovictex", "ovictex@hp.com", "Ovictex123");
}

function prepareDemoData() {
	addSAPDemoCI();
	addSAPCirelationship();
}

function prepareDemoFormat(incidentCategory) {
	var isPD = util.isPDEnabled(incidentCategory);
	if (!isPD) {
		changeOOBNonPDFormat(incidentCategory);
	} else {
		changeOOBPDFormat();
	}
}

function changeOOBNonPDFormat() {
	var changFormatList = ["IM.open.incident", "IM.update.incident", "IM.close.incident"];
	var openFormat = $("format").select("name=\"IM.open.incident\" and syslanguage=\"en\"").uniqueResult();
	if (!openFormat) {
		print("format IM.open.incident can't be found!");
	} else {
		var fProperty1 = "Frame;Name=fieldset1434706751541\tArrayLength=0\tcanCollapse=1\t?Visible=[$SMSAP]=true\tfloatGroup=1\tHeight=20\tName=fieldset1434706751541\tWidth=225\tX=0\tY=65\tCaption=Sap Solution Manager\t\t";
		openFormat = util.addElementOnFormat(openFormat, 4096, 33, 1, 113, 0, null, [], null, "Sap Solution Manager", null, fProperty1);

		var fProperty2 = "SubFormat;Name=subview1434706839231\tHeight=16\tName=subview1434706839231\tFormat=hp.sap.solution.sub\tWidth=215\t\t\tX=3\tY=66\t\t";
		openFormat = util.addElementOnFormat(openFormat, 0, 34, 2, 108, 8, null, [], null, "VO", "hp.sap.solution.sub", fProperty2);
		openFormat.doSave();
	}

	var updateFormat = $("format").select("name=\"IM.update.incident\" and syslanguage=\"en\"").uniqueResult();
	if (!updateFormat) {
		print("format IM.update.incident can't be found!");
	} else {
		fProperty1 = "Frame;alwaysCollapse=0\tArrayLength=0\tcanCollapse=1\t?Visible=[$SMSAP]=true\tfloatGroup=1\tHeight=20\tName=\tisExpanded=0\tWidth=225\tX=0\tY=270\tCaption=Sap Solution Manager\t\t";
		updateFormat = util.addElementOnFormat(updateFormat, 4096, 136, 1, 113, 0, null, [], null, " Sap Solution Manager ", null, fProperty1);

		fProperty2 = "SubFormat;Height=16\tName=\tFormat=hp.sap.solution.sub\tWidth=224\t\t\tX=0\tY=272\t\t";
		updateFormat = util.addElementOnFormat(updateFormat, 0, 137, 1, 112, 8, null, [], null, " VO ", " hp.sap.solution.sub ", fProperty2);
		updateFormat.doSave();
	}

	var closeFormat = $("format").select("name=\"IM.close.incident\" and syslanguage=\"en\"").uniqueResult();
	if (!closeFormat) {
		print("format IM.close.incident can't be found!");
	} else {
		//fProperty1 = "SubFormat;Height=16\tName=\tFormat=hp.sap.solution.sub\tWidth=215\tX=9\tY=252\t\t";
		//closeFormat = util.addElementOnFormat(closeFormat, 0, 127, 5, 108, 8, null, [], null, "VO", "hp.sap.solution.sub", fProperty1);

		fProperty2 = "Frame;ArrayLength=0\tcanCollapse=1\t?Visible=[$SMSAP]=true\tfloatGroup=1\tHeight=20\tName=\tWidth=225\tX=6\tY=316\tCaption=Sap Solution Manager\t\t";
		closeFormat = util.addElementOnFormat(closeFormat, 4096, 159, 4, 113, 0, null, [], null, "Sap Solution Manager", null, fProperty2);

		var fProperty3 = "SubFormat;Height=16\tName=\tFormat=hp.sap.solution.sub\tWidth=215\t\t\tX=9\tY=318\t\t";
		closeFormat = util.addElementOnFormat(closeFormat, 0, 160, 5, 108, 8, null, [], null, "VO", "hp.sap.solution.sub", fProperty3);
		closeFormat.doSave();
	}
}

function changeOOBPDFormat() {
	var fList = ["im.incident.categorization", "im.incident.closure", "im.incident.investigation", "im.incident.recovery", "im.incident.review"];
	for (var i = 0; i < fList.length; i++) {
		var incFormat = $("format").select("name=\"" + fList[i] + "\" and syslanguage=\"en\"").uniqueResult();
		if (!incFormat) {
			print("format " + fList[i] + " can't be found!");
		} else {
			var fProperty1 = "page;Name=sapsolutionmanager\tAccessibleName=\t?Caption=\t?Visible=[$SMSAP]=true\tName=sapsolutionmanager\tVisible=1\tX=10\tY=10\tCaption=SAP Solution Manager\t\t";
			incFormat = util.insertElementOnFormat(incFormat, 4096, 6, 6, 1, 0, null, [], null, "Sap Solution Manager", null, fProperty1, -1);

			var fProperty2 = "SubFormat;Height=30\tName=\tFormat=hp.sap.solution.sub\tWidth=158\tX=0\tY=0\t\t";
			incFormat = util.insertElementOnFormat(incFormat, 0, 1, 1, 80, 15, null, [], null, "VO", "hp.sap.solution.sub", fProperty2, -1);

			incFormat = util.appendFormatEndTag(incFormat);
			incFormat.doSave();
		}
	}
}

function addSAPCirelationship() {
	var ciID = util.getCIIDByName("MyDevices");
	util.addCirelationship("SAPInstance200", ciID, ["SAPInstance200"], "Logical", "Contains", "MyDevices SAPInstance200");
	util.addCirelationship("SAPInstance300", ciID, ["SAPInstance300"], "Logical", "Contains", "MyDevices SAPInstance300");
}

function addSAPDemoCI() {
	util.addCI("SAPInstance200", "CI10078", "sapinstance", "sapinstance", "sapinstance", "In Use", "joinsapinstance", "sapinstance", "SAP Support (Asia)");
	util.addCI("SAPInstance300", "CI10079", "sapinstance", "sapinstance", "sapinstance", "In Use", "joinsapinstance", "sapinstance", "SAP Support (Asia)");
}

function addSAPDeviceType() {
	var devType = $("devtype").select("device.name=\"SAPInstance\"").uniqueResult();
	if (devType)
		return;
	devType = new SCFile("devtype");
	devType["device.name"] = "SAPInstance";
	devType["device.type"] = "sapinstance";
	devType["name"] = "sapinstance";
	devType["format.name"] = "device.sapinstance.g";
	devType["bitmap"] = "lbox";
	devType["active"] = true;
	devType["attr.file"] = "SAPInstance";
	devType["joindef"] = "joinsapinstance";
	devType.doSave();
}

function updateDeviceSapinstanceGFormat() {
	var isDSMode = util.isDisplayNameMode();
	if (!isDSMode)
		return;
	var format = $("format").select("name=\"device.sapinstance.g\" and syslanguage=\"en\"").uniqueResult();
	if (!format)
		return;
	var len = format["field"].length();
	for (var i = 0; i < len; i++) {
		var outC = format["field"][i]["output"]
			var outP = format["field"][i]["property"]
			if ($.contains(outP, "display.name"))
				return;
	}
	var initField = ["CI Name", "CI Identifier", "id", "logical.name"];
	var changedField = ["CI Identifier", "Display Name", "logical.name", "display.name"];
	var completeChange = 0;
	for (var i = 0; i < len; i++) {
		var foutput = format["field"][i]["output"];
		if (foutput && foutput.indexOf(initField[0]) >= 0) {
			format["field"][i]["output"] = changedField[0];
			format["field"][i]["property"] = format["field"][i]["property"].replace(initField[0], changedField[0]);
			completeChange += 1;
			continue;
		}
		if (foutput && foutput.indexOf(initField[1]) >= 0) {
			format["field"][i]["output"] = changedField[1];
			format["field"][i]["property"] = format["field"][i]["property"].replace(initField[1], changedField[1]);
			completeChange += 1;
			continue;
		}
		var fintput = format["field"][i]["input"];
		if (fintput && fintput.indexOf(initField[2]) >= 0) {
			format["field"][i]["input"] = changedField[2];
			format["field"][i]["property"] = format["field"][i]["property"].replace("Input=id", "Input=logical.name");
			completeChange += 1;
			continue;
		}
		if (fintput && fintput.indexOf(initField[3]) >= 0) {
			format["field"][i]["input"] = changedField[3];
			format["field"][i]["property"] = format["field"][i]["property"].replace(initField[3], changedField[3]);
			completeChange += 1;
			continue;
		}
		if (completeChange > 3)
			break;
	}
	format.doSave();
}


function handleSAPCIInfoInTrigger() {
	var jsString = "lib.HPSAPTrigger.fillSAPInfo(record, oldrecord);";
	var beforeAddTrigger = $("triggers").select("trigger.name=\"before.probsummary.add\"").uniqueResult();
	if (beforeAddTrigger) {
		if (!beforeAddTrigger["javascript"]) {
			beforeAddTrigger["javascript"] = jsString;
		} else {
			if (!$.contains(beforeAddTrigger["javascript"], jsString)) {
				beforeAddTrigger["javascript"] = "\n" + jsString;
			}
		}
		beforeAddTrigger.doSave();
	}

	var beforeUpdateTrigger = $("triggers").select("trigger.name=\"before.probsummary.update\"").uniqueResult();
	if (beforeUpdateTrigger) {
		if (!beforeUpdateTrigger["javascript"]) {
			beforeUpdateTrigger["javascript"] = jsString;
		} else {
			if (!$.contains(beforeUpdateTrigger["javascript"], jsString)) {
				beforeUpdateTrigger["javascript"] += "\n" + jsString;
			}
		}
		beforeUpdateTrigger.doSave();
	}
}

function updateLinkLineOnProbsummaryLink() {

	var linkPro = $("link").select("name=\"probsummary\"").uniqueResult();
	if (linkPro) {
		if (!linkPro["link.expressions"])
			linkPro["link.expressions"] = $.createSCArray();

		if (!linkPro["post.expressions"])
			linkPro["post.expressions"] = $.createSCArray();

		var locationIndex = $.indexOf(linkPro["source.fields"], "location");
		if (locationIndex >= 0) {

			var locationInitExpression = "$fill.recurse=false;$fill.replace=false";
			var locationReplaceExpression = "if ($continue=true) then ($fill.recurse=true) else ($fill.recurse=false);$fill.replace=false";
			linkPro["link.expressions"][locationIndex] = util.replaceExpression(linkPro["link.expressions"][locationIndex], [locationInitExpression], [locationReplaceExpression]);

			linkPro["post.expressions"][locationIndex] = util.addExpression(linkPro["post.expressions"][locationIndex], ["cleanup($continue)"]);
		}
		linkPro.doAction("save");
	}	

}

function updateProbsummaryFC() {
	var fc = $("formatctrl").select("name=\"probsummary\"").uniqueResult();
	if (fc) {
		for (var i = 0; i < fc["subroutines"].length(); i++) {
			if (fc["subroutines"][i]["application"] == "fill.fc")
				return;
		}
		var subStructure = $.createSCStructure("null(logical.name in $file) and not  (null(sap.sid in $file))",
				"null(logical.name in $file) and not  (null(sap.sid in $file))",
				null,
				"fill.fc",
				null,
				["record", "text"],
				["$file", "logical.name"],
				true);
		fc["subroutines"].push(subStructure);
		fc.doSave();
	}
}

function updateExtaccess() {
	var extaccess = $("extaccess").select("object.name=\"Incident\" and service.name=\"IncidentManagement\"").uniqueResult();
	if (extaccess) {
		var initExpress = "update.action in $L.file=update.action in $L.file.save";
		var replacesExpress = "if (not null(number in $L.file)) then (update.action in $L.file=update.action in $L.file.save)";
        var addExpress = "if (hidden.meta.data in $L.file=\"Closed\") then ($L.isIMPD=jscall(\"SMSAP_Utils.isPDEnabled\", category in $L.file);problem.status in $L.file=\"Closed\";if (not  (nullsub($L.isIMPD, false))) then (status in $L.file=\"closed\");if ($L.isIMPD and null(subcategory in $L.file)) then (subcategory in $L.file=\"failure\";product.type in $L.file=\"error message\");if null(resolution.code in $L.file) then (resolution.code in $L.file=\"Automatically Closed\";resolution in $L.file=insert(resolution in $L.file, 1, 1, \"Closed by SMSAP integration.\")))";		extaccess["expressions"] = util.replaceExpression(extaccess["expressions"], [initExpress], [replacesExpress]);
		extaccess["expressions"] = util.addExpression(extaccess["expressions"], [addExpress]);


		var addFieldsCaptions = newIncidentCustomerFieldsCaptions.concat(newIncidentSystemFieldsCaptions);
		addFieldsCaptions.push("PriorityCode");
		addFieldsCaptions.push("PlannedEnd");

		var addFields = newIncidentCustomerFields.concat(newIncidentSystemFields.slice(0, newIncidentSystemFields.length - 2));
		addFields.push("priority.code");
		addFields.push("planned.end");

		var addFieldType = newIncidentCustomerFieldsTypes.concat(newIncidentSystemFieldsTypes.slice(0, newIncidentSystemFieldsTypes.length - 2));
		addFieldType.push(2);
		addFieldType.push(3);
		util.addExtaccessExposeField(extaccess, addFieldsCaptions, addFields, addFieldType);
		extaccess.doSave();
	}

	var extaccessContact = $("extaccess").select("object.name=\"Contact\" and service.name=\"ConfigurationManagement\"").uniqueResult();
	if (extaccessContact) {
		addFieldsCaptions = ["Fax", "OperatorID"];
		addFields = ["fax.phone", "operator.id"];
		addFieldType = [2, 2];
		util.addExtaccessExposeField(extaccessContact, addFieldsCaptions, addFields, addFieldType);
		extaccessContact.doSave();
	}
}


function updateDisplayOption() {
	var addedcondition = " and hidden.meta.data in $L.filed=NULL";
	var dop = $("displayoption").select("id=\"apm.edit.problem_clone\"").uniqueResult();
	if (dop && dop["condition"]) {
		var dopCondition = system.functions.str(dop["condition"]);
		if (dopCondition.indexOf(addedcondition) < 0) {
			dop["condition"] = util._parseToLogical(dopCondition + addedcondition);
		}
		dop.doSave();
	}
}

function updateImViewStatus() {
	var newStatesLableList = ["processincident", "closeincident", "verifyincidentsolution", "rejectincidentsolution", "addinfo", "acceptincidentprocessing"];
	var newStatesProcessList = ["im.exchange.incident", "im.exchange.incident", "im.exchange.incident", "im.exchange.incident", "im.exchange.incident", "im.exchange.incident"];
	var newStatesConditionList = ["not  (null(exthd in $L.file))", true, true, true, true, true, true, true];
	var states = $("States").select("state=\"im.view\"").uniqueResult();
	if (states) {
		for (var i = 0; i < newStatesLableList.length; i++) {
			var index = system.functions.index(newStatesLableList[i], states["process.label"]);
			if (index == 0) {
				states["process.label"].push(newStatesLableList[i]);
				states["valid.process"].push(newStatesProcessList[i]);
				if (i==0) 
					states["process.condition"].push(util._parseToLogical(newStatesConditionList[i]));
				else
				  states["process.condition"].push(newStatesConditionList[i]);
			}
		}
		states.doSave();
	}
}

function modifySAPDbdict() {
	util.addNewFieldToStructure("info", "SMIS", "SMSAP", 4);
	for (var i = 0; i < newIncidentCustomerFields.length; i++) {
		var sqlOptions = util.generateSqlFieldOptions("m1", util.covertSCNameToSqlName(newIncidentCustomerFields[i]), newIncidentCustomerFieldsTypes[i], false);
		util.addNewFieldToDbdict("probsummary", newIncidentCustomerFields[i], newIncidentCustomerFieldsTypes[i], null, -1, sqlOptions);
	}

	for (var i = 0; i < newIncidentSystemFields.length; i++) {
		var sqlOptions = util.generateSqlFieldOptions("m1", util.covertSCNameToSqlName(newIncidentSystemFields[i]), newIncidentSystemFieldsSqlTypes[i], false);
		util.addNewFieldToDbdict("probsummary", newIncidentSystemFields[i], newIncidentSystemFieldsTypes[i], null, -1, sqlOptions);
	}

	util.addNewArrayStructureToDbdict("probsummary", newIncidentArrayField, newIncidentArrayStructureFields, newIncidentArrayStructureFieldsType);

	util.addJoinTable("joinsapinstance", ["device", "SAPInstance"]);

}

function updateProcessSeparator() {
	var updateSeparatorProcessList = ["im.save", "im.close", "im.resolve", "im.reopen"];
	var initSeparator = "$L.stamp=str(tod())+\" (\"+$L.operator+\"):\";if exit in $G.pm.global.environment then ($L.stamp=str(tod())+\" \"+$lo.time.zone+\" (\"+$L.operator+\"):\")";
	var replaceSeparartor = "$L.stamp=\"----\"+str(tod())+\" (\"+$L.operator+\"):\";if exit in $G.pm.global.environment then ($L.stamp=\"----\"+str(tod())+\" \"+$lo.time.zone+\" (\"+$L.operator+\"):\")";
	for (var i = 0; i < updateSeparatorProcessList.length; i++) {
		var process = $("Process").select("process=\"" + updateSeparatorProcessList[i] + "\"").uniqueResult();
		if (process && process["pre.expressions"]) {
			process["pre.expressions"] = util.replaceExpression(process["pre.expressions"], [initSeparator], [replaceSeparartor]);
			process.doSave();
		}
	}

	var ciID = util.getCIIDByName("MyDevices");
	var addFistProcessExpList = new Array();
	addFistProcessExpList.push(" ");
	addFistProcessExpList.push("if ((operator()=\"problem\" or operator()=\"EXTERNAL\") and $G.bg) then ($L.add=true) else ($L.add=nullsub(evaluate(scm.add.condition in $L.object), false))");
	addFistProcessExpList.push("if (is.incident.exchange in $L.file=true) then (subcategory in $L.file=\"access\";product.type in $L.file=\"authorization error\";problem.type in $L.file=\"incident\";assignment in $L.file=\"Application\";if null(severity in $L.file) then (severity in $L.file=\"4\");initial.impact in $L.file=\"1\";site.category in $L.file=\"B\";action in $L.file={\"default description\"});affected.item in $L.file=\""+ciID+"\"");
	addFistProcessExpList.push("$L.comment=\"siehe JS\"");
	addFistProcessExpList.push("if same(nullsub(full.name in $G.pm.environment, full.name in $G.pm.global.environment), true) then ($L.operator=nullsub($lo.ufname, nullsub(operator(), \"NULL\"))) else ($L.operator=nullsub(operator(), \"NULL\"))");
	addFistProcessExpList.push("$L.stamp=\"----\"+str(tod())+\" (\"+$L.operator+\"):\";if exit in $G.pm.global.environment then ($L.stamp=\"----\"+str(tod())+\" \"+$lo.time.zone+\" (\"+$L.operator+\"):\")");
	addFistProcessExpList.push("if (is.incident.exchange in $L.file=true) then (update.action in $L.file={$L.stamp}+denull(update.action in $L.file))");

	var processFirst = $("Process").select("process=\"im.first\"").uniqueResult();
	if (processFirst) {
		processFirst["pre.expressions"] = util.addExpression(processFirst["pre.expressions"], addFistProcessExpList);
		processFirst.doSave();
	}

	var processViewInit = $("Process").select("process=\"im.view.init\"").uniqueResult();
	if (processViewInit) {
		var addPreExpression = "$SMSAP=nullsub(SMSAP in $G.system.info, \"false\")";
		var addPreJS = "var configItem = lib.smis_ConfigurationManager.getEnabledConfigItem(\"SMSAP\");\r\nif (configItem != null) {\r\n\tvar solMans = configItem.getParametersByCategory(\"SolutionManager\");\r\n\tvar values = [];\r\n\tvar names = [];\r\n\tfor (var id in solMans) {\r\n\t\tvalues.push(id);\r\n\t\tnames.push(solMans[id]);\r\n\t}\r\n\t\tsystem.vars.$G_solMans_values=values;\r\n\t\tsystem.vars.$G_solMans_names=names;\r\n\t}";
		processViewInit["pre.expressions"] = util.addExpression(processViewInit["pre.expressions"], [addPreExpression]);
		if (!processViewInit["javascript.pre"]) {
			processViewInit["javascript.pre"] = addPreJS;
		} else if (processViewInit["javascript.pre"] && processViewInit["javascript.pre"].indexOf(addPreJS) < 0) {
			processViewInit["javascript.pre"] = processViewInit["javascript.pre"].concat("\r\n\t", addPreJS);
		}
		processViewInit.doSave();
	}

	var processOpenSetUp = $("Process").select("process=\"im.open.setup\"").uniqueResult();
	if (processOpenSetUp) {
		var addPreExpression = "$SMSAP=false";
		processOpenSetUp["pre.expressions"] = util.addExpression(processOpenSetUp["pre.expressions"], addPreExpression);
		processOpenSetUp.doSave();
	}
}

function createDisplayOption() {
	var do14 = $("displayoption").select("id=\"apm.edit.problem_processincident\"").uniqueResult();
	if (!do14) {
		do14 = new SCFile("displayoption");
		do14["id"] = "apm.edit.problem_processincident";
		do14["screen.id"] = "apm.edit.problem";
		do14["language"] = "ENG";
		do14["gui.option"] = 14;
		do14["txt.option"] = 14;
		do14["txt.bank"] = 1;
		do14["labels"] = $.createSCStructure("Send Incident", "", "Send this Incident to SAP SolutionManager");
		do14["condition"] = util._parseToLogical("(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=NULL or hidden.meta.data in $L.filed=\"Requester:StartExchange:Error\") and nullsub(SMSAP in $G.system.info, \"false\")");
		do14["action"] = "processincident";
		do14["post.expressions"] = $.createSCArray(util._parseToExpression("$work.text=$pmc.actions"));
		do14["condition.txt"] = "(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=NULL or hidden.meta.data in $L.filed=\"Requester:StartExchange:Error\") and nullsub(SMSAP in $G.system.info, \"false\")";

		do14["unique.id"] = 16529;
		do14["gui.sig"] = 3110358124;
		do14["text.sig"] = 3511188352;
		do14["modify.record"] = "true";
		do14["javascript.pre"] = "if (system.vars.$L_file.exthd==null || system.vars.$L_file.exthd==\"\") \r\n\tsystem.functions.msg(system.functions.scmsg( 2, \"SMSAP\" ),3);";
		do14.doSave();
	}

	var do15 = $("displayoption").select("id=\"apm.edit.problem_closeincident\"").uniqueResult();
	if (!do15) {
		do15 = new SCFile("displayoption");
		do15["id"] = "apm.edit.problem_closeincident";
		do15["screen.id"] = "apm.edit.problem";
		do15["language"] = "ENG";
		do15["gui.option"] = 15;
		do15["txt.option"] = 15;
		do15["txt.bank"] = 1;
		do15["labels"] = $.createSCStructure("Close SAP Incident", "", "Close this Incident in SAP SolutionManager");
		do15["condition"] = util._parseToLogical("(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed)#\"Requester\" and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\" and nullsub(SMSAP in $G.system.info, \"false\")");
		do15["action"] = "closeincident";
		do15["post.expressions"] = $.createSCArray(util._parseToExpression("$work.text=$pmc.actions"));
		do15["condition.txt"] = "(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed)#\"Requester\" and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\" and nullsub(SMSAP in $G.system.info, \"false\")";

		do15["unique.id"] = 16528;
		do15["gui.sig"] = 599573304;
		do15["text.sig"] = 3610879220;
		do15["modify.record"] = "true";
		do15.doSave();
	}

	var do16 = $("displayoption").select("id=\"apm.edit.problem_verifyincidentsolution\"").uniqueResult();
	if (!do16) {
		do16 = new SCFile("displayoption");
		do16["id"] = "apm.edit.problem_verifyincidentsolution";
		do16["screen.id"] = "apm.edit.problem";
		do16["language"] = "ENG";
		do16["gui.option"] = 16;
		do16["txt.option"] = 16;
		do16["txt.bank"] = 1;
		do16["labels"] = $.createSCStructure("Send Solution", "", "Propose a solution for this Incident to SAP SolutionManager");
		do16["condition"] = util._parseToLogical("(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\") and nullsub(SMSAP in $G.system.info, \"false\")");
		do16["action"] = "verifyincidentsolution";
		do16["post.expressions"] = $.createSCArray(util._parseToExpression("$work.text=$pmc.actions"));
		do16["condition.txt"] = "(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\") and nullsub(SMSAP in $G.system.info, \"false\")";

		do16["unique.id"] = 16531;
		do16["gui.sig"] = 532064012;
		do16["text.sig"] = 3204832532;
		do16["modify.record"] = "true";
		do16.doSave();
	}

	var do17 = $("displayoption").select("id=\"apm.edit.problem_rejectincidentsolution\"").uniqueResult();
	if (!do17) {
		do17 = new SCFile("displayoption");
		do17["id"] = "apm.edit.problem_rejectincidentsolution";
		do17["screen.id"] = "apm.edit.problem";
		do17["language"] = "ENG";
		do17["gui.option"] = 17;
		do17["txt.option"] = 17;
		do17["txt.bank"] = 1;
		do17["labels"] = $.createSCStructure("Refuse Solution", "", "Reject the solution for this Incident as proposed by SAP SolutionManager");
		do17["condition"] = util._parseToLogical("(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Requester:SolutionProvided\" or hidden.meta.data in $L.filed=\"Requester:SolutionProvided:Error\") and nullsub(SMSAP in $G.system.info, \"false\")");
		do17["action"] = "rejectincidentsolution";
		do17["post.expressions"] = $.createSCArray(util._parseToExpression("$work.text=$pmc.actions"));
		do17["condition.txt"] = "(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not nullsub(is.ictex.action.blocked in $L.filed, false) and (hidden.meta.data in $L.filed=\"Requester:SolutionProvided\" or hidden.meta.data in $L.filed=\"Requester:SolutionProvided:Error\") and nullsub(SMSAP in $G.system.info, \"false\")";

		do17["unique.id"] = 16530;
		do17["gui.sig"] = 633612194;
		do17["text.sig"] = 412239542;
		do17["modify.record"] = "true";
		do17.doSave();
	}

	var do18 = $("displayoption").select("id=\"apm.edit.problem_addinfo\"").uniqueResult();
	if (!do18) {
		do18 = new SCFile("displayoption");
		do18["id"] = "apm.edit.problem_addinfo";
		do18["screen.id"] = "apm.edit.problem";
		do18["language"] = "ENG";
		do18["gui.option"] = 18;
		do18["txt.option"] = 18;
		do18["txt.bank"] = 1;
		do18["labels"] = $.createSCStructure("Add Info", "", "Add information to this Incident in SAP SolutionManager");
		do18["condition"] = util._parseToLogical("(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and hidden.meta.data in $L.filed~=NULL and hidden.meta.data in $L.filed~=\"Requester:StartExchange:Error\" and hidden.meta.data in $L.filed~=\"Closed\" and nullsub(SMSAP in $G.system.info, \"false\")");
		do18["action"] = "addinfo";
		do18["post.expressions"] = $.createSCArray(util._parseToExpression("$work.text=$pmc.actions"));
		do18["condition.txt"] = do18["condition"];

		do18["unique.id"] = 16527;
		do18["gui.sig"] = 720936256;
		do18["text.sig"] = 1916659794;
		do18["modify.record"] = "true";
		do18.doSave();
	}

	var do19 = $("displayoption").select("id=\"apm.edit.problem_acceptincidentprocessing\"").uniqueResult();
	if (!do19) {
		do19 = new SCFile("displayoption");
		do19["id"] = "apm.edit.problem_acceptincidentprocessing";
		do19["screen.id"] = "apm.edit.problem";
		do19["language"] = "ENG";
		do19["gui.option"] = 19;
		do19["txt.option"] = 19;
		do19["txt.bank"] = 1;
		do19["labels"] = $.createSCStructure("Send Back", "", "Send this Incident back to SAP SolutionManager");
		do19["condition"] = util._parseToLogical("(evaluate(open in $G.pm.environment) or evaluate(update in $G.pm.environment)) and nullsub($G.ess, false)=false and not  (nullsub(is.ictex.action.blocked in $L.filed, false)) and (hidden.meta.data in $L.filed=\"Provider:ProviderProcessing\" or hidden.meta.data in $L.filed=\"Provider:ProviderProcessing:Error\" or hidden.meta.data in $L.filed=\"Requester:RequesterProcessing\" or hidden.meta.data in $L.filed=\"Requester:RequesterProcessing:Error\") and nullsub(SMSAP in $G.system.info, \"false\")");
		do19["action"] = "acceptincidentprocessing";
		do19["post.expressions"] = $.createSCArray(util._parseToExpression("$work.text=$pmc.actions"));
		do19["condition.txt"] = do19["condition"];

		do19["unique.id"] = 16526;
		do19["gui.sig"] = 1829575276;
		do19["text.sig"] = 131227638;
		do19["modify.record"] = "true";
		do19.doSave();
	}
}
