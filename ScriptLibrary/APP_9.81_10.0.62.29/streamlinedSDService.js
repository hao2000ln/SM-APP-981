var $ = lib.c.$;
var scmsg = funcs.scmsg;
var same = funcs.same;
var delegatecShareFields = ["company", "folder","callback.contact", "contact.name", "callback.type", "category", "subcategory", "product.type", "affected.item"];
var delegatecShareStrFields = ["description"];
var delegateFields=delegatecShareFields.concat(delegatecShareStrFields);
var ESCALATION_RELATION = "Trigger To";
var ADD_MODE = "add";
var SAVE_MODE = "save";
var EscaltionMapping = {
    incident: "Escalated Incident",
    problem: "Escalated Problem",
    change: "Escalated Change",
    request: "Escalated Request"
};

var CONTROL_MAP = {
    "interaction": {
        foreground: true,
        engineControl: "doShow",
        jobDone: function(actionMode, interactionDelegate, interaction) {

            if (isInteractionSaved(interactionDelegate, interaction)) {
                return "addnew";
            } else if (actionMode == ADD_MODE) {
                return "addretry";
            }
            return "update";
        }
    },
    "service catalog": {
        engineControl: "doCatalog",
        postOrderAction: "serviceOrderOnBehalf",
        jobDone: function(actionMode, interactionDelegate, interaction) {
            if (interaction.cartId) {
            	return "addnew";
            }
            if (actionMode == ADD_MODE && !isInteractionSaved(interactionDelegate, interaction)) {
            	return "addretry";
            }
            return "update";
        }
    },
    "support catalog": {
        engineControl: "doCatalog",
        postOrderAction: "supportOrderOnBehalf",
        jobDone: function(actionMode, interactionDelegate, interaction) {
            if (interaction.cartId) {
            	return "addnew";
            }
            if (actionMode == ADD_MODE && !isInteractionSaved(interactionDelegate, interaction)) {
            	return "addretry";
            }
            return "update";
        }
    },
    "escalation": {
        engineControl: "doSave",
        checkNeedSave: true,
        escalationControl: "doEscalation",
        jobDone: function(actionMode, interactionDelegate, interaction) {
            if (isInteractionEscalated(interaction)) {
            	return "addnew";
            }
            if (actionMode == ADD_MODE && !isInteractionSaved(interactionDelegate, interaction)) {
            	return "addretry";
            }
            return "update";
        }
    }
};


/**
 * [initialize Streamlined interaction record]
 * @param  {SCFile} record The new interactionDelegate record
 * @return {[type]}        [description]
 */
function initialization(record){
	
	//initial fields 
    record.callback_type = "E-mail";	
	initialCompanyFolder(record,vars["$lo.operator"]/*,vars["$G.multi"],vars["$G.folderEntitlement"]*/);
	
}

/**
 * [initialCompanyFolder]
 * @param  {SCFile}  record          [interactionDelegate]
 * @param  {SCFile}  operator        [login operator record]
 * @return {[type]}                  [description]
 */
function initialCompanyFolder(record, operator) {
	if (vars["$G.multi"] && record.company == null) {
		record.company = operator.company;
	}
	if (vars["$G.folderEntitlement"] && record.folder == null) {
		record.folder = operator.defaultFolder;
	}
}

/**
 * [getCancelMessage to decide whether popup message is required, and with corresponding message content]
 * @param  {SCFile} record      current interactionDelegate file
 * @param  {SCFile} savedRecord saved interactionDelegate file
 * @param  {SCFile} interaction the interaction record if created
 * @param  {String} action      the action value from Display Screen
 * @return {[type]}             [description]
 */
function getCancelMessage(record,savedRecord,interaction,action){

    if (action === "back" && record.incident_id === null && !same(record, savedRecord)){
        vars.$L_popup = true;
        vars.$L_msg = scmsg("903", "sm");
    }

    if (action === "back" && record.incident_id != null) {
        vars.$L_popup = true;
        vars.$L_msg = scmsg("904", "sm", [record.incident_id]);
    }

    if (action === "menu" && record.incident_id === null && !same(record,savedRecord)) {
        vars.$L_popup = true;
        vars.$L_msg = scmsg("903", "sm");
    }

    if (action === "menu" && record.incident_id != null && isDelegateChanged(record, interaction)) {
        vars.$L_popup = true;
        vars.$L_msg = scmsg("5", "sm");
    }
}

/**
 * [processCancel do cancel action on interaction record]
 * @param  {SCFile} record      interactionDelegate record
 * @param  {SCFile} savedRecord saved interactionDelegate record
 * @param  {SCFile} interaction interaction record.
 * @return {[type]}             [description]
 */
function processCancel(record, savedRecord, interaction){
	
	if(interaction != null){
		if (isDelegateChanged(record, interaction)) {
			copyDelgateToInteraction(record, interaction);
		}

		interaction.doAction("Cancel");
	}
}

/*
 * get fulfilment configuration of given interaction category.
 *
 * @param category interaction category
 * @return fulfilment configuration
 */
function getFulfillCfg(category) {

	if (category == null) {
		return null;
	}
	
    var fulfillProcess = cacheCatFulfill(category);

    if (!fulfillProcess) {
        var catFile = lib.c.$("sdCategory").select("name=\"" + category + "\"").uniqueResult();
        if (catFile) {
            fulfillProcess = "interaction";
            if (catFile["escalate.type"] == null) {
                if (category.toLowerCase().indexOf("service catalog") >= 0) {
                    fulfillProcess = "service catalog";
                } else if (category.toLowerCase().indexOf("support catalog") >= 0) {
                    fulfillProcess = "support catalog";
                }
            } else {
                fulfillProcess = catFile["escalate.type"];
            }
            cacheCatFulfill(category, fulfillProcess);
        }
    }

    return fulfillProcess;
}


/*
 * get/set fulfilment configuration of given interaction category in cache.
 *
 * @param category interaction category
 * @param fullfill process of interaction category, leave this parameter empty(undefined) to just get from cache
 * @return fulfilment configuration
 */
function cacheCatFulfill(category, fulfillProcess) {
    
    category = category.replace(/ /g, "");
    var catFulfillCfgVar = "$G.sdFulfill." + category + "";
    if (fulfillProcess !== undefined) {
        
        vars[catFulfillCfgVar] = fulfillProcess;
    }
    
    return vars[catFulfillCfgVar];
}

/*
 * copy the delegate to interaction.
 *
 * @param interactionDelegate delegate of interaction
 * @param interaction interaction record, can be null
 * @return interaction record
 */
function copyDelgateToInteraction(interactionDelegate, interaction) {
    if (!interaction) {
    	interaction = new SCFile("incidents");
    }

	var i;
    for (i = 0; i < delegateFields.length; ++i) {
        interaction[delegateFields[i]] = interactionDelegate[delegateFields[i]];
    }
    return interaction;
}

/*
 * check whether the user has change the data.
 *
 * @param interactionDelegate delegate of interaction
 * @param interaction interaction record, can be null
 * @return whether the delegate record changed
 */
function isDelegateChanged(interactionDelegate, interaction) {
	var i;
    for (i = 0; i < delegatecShareFields.length; ++i) {
        if (interaction[delegatecShareFields[i]] != interactionDelegate[delegatecShareFields[i]]) {
            return true;
        }
    }

    for (i = 0; i < delegatecShareStrFields.length; ++i) {
        if (funcs.str(interaction[delegatecShareStrFields[i]]) != funcs.str(interactionDelegate[delegatecShareStrFields[i]])) {
            return true;
        }
    }
    return false;
}


/*
 * prepare some control varaibles before call the doc engine.
 *
 */
function preDocEngCallExt() {
    var control = preDocEngCall(vars['$L.file'], vars['$workInteraction']);
    vars['$post.order.from.catalog'] = control.postOrderAction;
    vars['$post.show.ui'] = control.postShowAction;
    vars['$L.engineControl'] = control.engineControl;
    vars['$L.action'] = control.foreground ? control.action : null;
    vars['$L.bg.action'] = control.foreground ? null : control.action;
    vars['$workInteraction'] = control.interaction;
    vars['$L.escalationControl'] = control.escalationControl;
}

/*
 * prepare some control varaibles before call the doc engine.
 *
 */
function preDocEngCall(interactionDelegate, interaction) {

    var control = {};
    var needSave = false;
    var actionMode = getActionMode(interactionDelegate);

    //Change Category
    if (actionMode == SAVE_MODE && interactionDelegate.category != interaction.category) {
        var catFile = lib.c.$("sdCategory").select("name=\"" + interactionDelegate.category + "\"").uniqueResult();
        interaction.current_phase = lib.Workflow.getNewCatPhase(catFile, "", "incidents");
    }

    //Copy Fields to interaction
    if (actionMode == ADD_MODE || (actionMode == SAVE_MODE && isDelegateChanged(interactionDelegate, interaction))) {
        interaction = copyDelgateToInteraction(interactionDelegate, interaction);
        needSave = true;
    }

    //Set Control Variables    
    var fulfillAction = getFulfillCfg(interaction.category);
    var docControlCfg = CONTROL_MAP[fulfillAction] || CONTROL_MAP["escalation"];
    control.foreground = docControlCfg.foreground;
    control.engineControl = (!docControlCfg.checkNeedSave || needSave) ? docControlCfg.engineControl : "";
    control.postOrderAction = docControlCfg.postOrderAction;
    control.action = actionMode;
    control.escalationControl = docControlCfg.escalationControl;

    control.interaction = interaction;
    return control;
}

function getActionMode(interactionDelegate) {
    return interactionDelegate.incident_id == null ? ADD_MODE : SAVE_MODE;

}

function isSaveSuccess(saveResult) {
    if (saveResult == "added" || saveResult == "normal" || saveResult == "resetrec") {
        return true;
    }
    return false;
}

function isInteractionSaved(interactionDelegate, interaction) {
    if (interaction.sysmodcount !== null && (interactionDelegate.sysmodcount == null || (interaction.sysmodcount > interactionDelegate.sysmodcount))) {
        return true;
    }

    return false;
}
/*
 * prepare some control varaibles before call escalation.
 *
 */
function preEscalationCallExt() {
    if (vars['$L.escalationControl'] == "doEscalation") {
        if (vars['$L.engineControl'] == "doSave") {
            var saveResult = vars['$L.bg.action'];
            if (!isSaveSuccess(saveResult)) {
                vars['$L.escalationControl'] = "cancel";
                return;
            }
        }
        preEscalationCall(vars.$workInteraction);
    }
}

/*
 * prepare some control varaibles before call escalation.
 *
 */
function preEscalationCall(interaction) {
    var fulfillAction = getFulfillCfg(interaction.category);
    var escalationType = EscaltionMapping[fulfillAction];
    if (escalationType) {
        lib.RelationUtil.populateAction(escalationType, "open");
        vars['$relationType'] = ESCALATION_RELATION;
    }
    
    return escalationType;
}

/*
 * clean the delegate record..
 *
 * @param interactionDelegate delegate of interaction
 */
function clearDelegate(interactionDelegate) {
	var i;
    for (i = 0; i < delegateFields.length; ++i) {
        interactionDelegate[delegateFields[i]] = null;
    }
    interactionDelegate.sysmodcount = null;
    interactionDelegate.incident_id = null;
}

/*
 * set the delegate working context
 *
 * @param interaction interaction record
 */
function resetDelegateContext() {
    /** after the function all, set the context to be:
    delegate id is null, interaction is not in DB, need ADD
 	delegate id is not null, interaction is in DB, ndd SAVE, meanwhile, $workInteraction is the interaction in DB
 	*/
    var interactionDelegate = vars['$L.file'];
    var interaction = vars['$workInteraction'];
    var saveResult = vars['$L.bg.action'];
    var lastMode = getActionMode(interactionDelegate);

    //use delegate's category, after compliment interaction is saved, it can be changed category
    var fulfillAction = getFulfillCfg(interactionDelegate.category);
    var jobDone = CONTROL_MAP[fulfillAction] ? CONTROL_MAP[fulfillAction].jobDone : CONTROL_MAP["escalation"].jobDone;
    var newMode = jobDone(lastMode, interactionDelegate, interaction);
    if (newMode == "addnew") {
        if(vars.$workInteraction) {
        	funcs.cleanup(vars.$workInteraction);
        }
        
        clearDelegate(vars.$L_file);        
        initialization(vars.$L_file);
    } else if (newMode == "addretry") {
        vars.$L_file.incident_id = null;
        if(vars.$workInteraction) {
        	funcs.cleanup(vars.$workInteraction);
        }
    } else {
        if (!(isInteractionSaved(interactionDelegate, interaction) /*&& isSaveSuccess(saveResult)*/ )) {
        //if interaction is not saved, it's copy of user input, need restore
        //if interaction saved first and then saved failed, the return one should be the successfully one, no need to restore.
            var interactionInDB = $("incidents").select("incident.id=\"" + interaction.incident_id + "\"").uniqueResult();
            vars.$workInteraction = interactionInDB;
        }

        vars.$L_file.incident_id = vars.$workInteraction.incident_id;
        vars.$L_file.sysmodcount = vars.$workInteraction.sysmodcount;
    }

}
/*
 * check whether interaction is escalated
 *
 * @param interaction interaction record
 * @return {boolean}   check result
 */
function isInteractionEscalated(interaction) {
    var escalation = $("screlation").select("source=\"" + interaction.incident_id + "\" and type=\"" + ESCALATION_RELATION + "\"").uniqueResult();
    return escalation ? true : false;
}


/*
 * check whether interaction is escalated or fulfilled
 *
 * @param interaction interaction record
 * @return {boolean}   check result
 */
function isInteractionFulfilled(interaction) {
    if (isInteractionEscalated(interaction) || $("svcCartItem").count("sdID=\"" + interaction.incident_id + "\"")>0) {
    	return true;
    }
    
    return false;
}


/*
 * getter of CONTROL_MAP
 *
 */
function getControlMap() {
    return CONTROL_MAP;
}


function getDelegatecShareFields() {
    return delegatecShareFields;
}

function getDelegatecShareStrFields() {
    return delegatecShareStrFields;
}