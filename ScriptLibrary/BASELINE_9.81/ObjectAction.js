
/**
* combine States action and workflow action to a same list
* use _wfA and _wfT to make sure workflow based actions listed in the top
**/
function getActionViaFile(fileName) {
	var object = new SCFile("Object", SCFILE_READONLY);
	var ret = object.doSelect("file.name=\"" + fileName + "\"");
	var list = ["add", "delete", "save"];
	while (ret == RC_SUCCESS) {
		list = appendActionViaState(object.default_state, list);
		list = appendActionViaState(object.open_state, list);
		list = appendActionViaState(object.close_state, list);
		ret = object.getNext();
	}
	list = appendRulesetActionViaState(fileName, list, object);
	list = appendActionViaLegacyWorkflow(fileName, list);
	return list.sort();
}

function appendActionViaLegacyWorkflow(fileName, list) {
    var states = [];
    var workflow = new SCFile("Workflow", SCFILE_READONLY);
	var ret = workflow.doSelect("tableName=\"" + fileName + "\" and is.legacy.workflow=true");
	while (ret == RC_SUCCESS) {
		if (!lib.ArrayUtil.contains(states, workflow["legacy.open.state"])) {
			states.push(workflow["legacy.open.state"]);
		}
		if (!lib.ArrayUtil.contains(states, workflow["legacy.default.state"])) {
			states.push(workflow["legacy.default.state"]);
		}
		if (!lib.ArrayUtil.contains(states, workflow["legacy.close.state"])) {
			states.push(workflow["legacy.close.state"]);
		}
		ret = workflow.getNext();
	}
	for(var i=0, len=states.length; i<len; i++) {
	    list = appendActionViaState(states[i], list);
	}
	return list;
}

function appendRulesetActionViaState(fileName, list, object) {
	var phase = new SCFile("WorkflowPhase", SCFILE_READONLY);
	var ret = phase.doSelect("tableName=\"" + fileName + "\"");
	while (ret == RC_SUCCESS) {
		for (var i = 0; i < phase.action.length(); i++) {
			var value = phase.action[i].actionName;
			if (value != null) {
				value = value;
				if (!lib.ArrayUtil.contains(list, value)) {
					list.push(value);
				}
			}
		}
		for (var i = 0; i < phase.manualTransition.length(); i++) {
			var value = phase.manualTransition[i].mtOptionName;
			if (value != null) {
				value =  value;
				if (!lib.ArrayUtil.contains(list, value)) {
					list.push(value);
				}
			}
		}
		ret = phase.getNext();
	}
	
	var workflow = new SCFile("Workflow", SCFILE_READONLY);
	var ret = workflow.doSelect("tableName=\"" + fileName + "\"");
	while (ret == RC_SUCCESS) {
		for (var i = 0; i < workflow.action.length(); i++) {
			var value = workflow.action[i].actionName;
			if (value != null) {
				value =  value;
				if (!lib.ArrayUtil.contains(list, value)) {
					list.push(value);
				}
			}
		}
		ret = workflow.getNext();
	}
	
	// update by Xiong-jie MA, to support table level actions
	if(null!=object) {
		for (var i = 0; i < object.action.length(); i++) {
			var value = object.action[i].actionName;
			if (value != null) {
				value =  value;
				if (!lib.ArrayUtil.contains(list, value)) {
					list.push(value);
				}
			}
		}
	}

	return list;
}


function appendActionViaState(stateName, list) {
	var state = new SCFile("States", SCFILE_READONLY);
	var ret = state.doSelect("state=\"" + stateName + "\"");
	if (ret == RC_SUCCESS) {
		for (var i = 0; i < state.process_label.length(); i++) {
			var value = state.process_label[i];
			if (value != null && value != "back" && !lib.ArrayUtil.contains(list, value)) {
				list.push(value);
			}
		}
	}
	return list;
}