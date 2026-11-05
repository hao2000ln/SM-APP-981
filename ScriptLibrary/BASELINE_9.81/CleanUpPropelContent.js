function cleanSxRegistration(){
    if (lib.upgradeCommonHelper.isValidTable("SxRegisteredEntitiesV2")) {
    	var SxReg = new SCFile("SxRegisteredEntitiesV2");
    	SxReg.doPurge(true);
    }
}

function cleanSxEntityChangesV2(){
    if (lib.upgradeCommonHelper.isValidTable("SxEntityChangesV2")) {
    	var SxEntityC = new SCFile("SxEntityChangesV2");
	    SxEntityC.doPurge(true);
	}
}

function disablePropelSyncSchedule(){
	var schedule = new SCFile("info");
	var query='type="propel"';
	if(schedule.doSelect(query)===RC_SUCCESS){
		schedule.doDelete();
	}
	var scheduleRecord = new SCFile("schedule");
	query='name="PropelSync" and class="propel"';
	if(scheduleRecord.doSelect(query)===RC_SUCCESS){
		scheduleRecord.doDelete();
	}
}

function disableSxRelatedTriggers(){
	//table incidents
	var query='table.name="incidents" and trigger.name#"SX.incidents."';
	commentTriggerJS(query);
	//table probsummary
	query='table.name="probsummary" and trigger.name#"SX.probsummary."';
	commentTriggerJS(query);
	//table activity
	query='table.name="activity" and trigger.name#"SX.activity."';
	commentTriggerJS(query);
	//table activityincidenttasks
	query='table.name="activityincidenttasks" and trigger.name#"SX.activityincidenttasks."';
	commentTriggerJS(query);
	//table Approval
	query='table.name="Approval" and trigger.name#"SX.approval."';
	commentTriggerJS(query);
	//table cm3r
	query='table.name="cm3r" and trigger.name#"SX.cm3r."';
	commentTriggerJS(query);
	//table imTask
	query='table.name="imTask" and trigger.name#"SX.imTask."';
	commentTriggerJS(query);
	//table ocmq
	query='table.name="ocmq" and trigger.name#"SX.ocmq."';
	commentTriggerJS(query);
	//table request
	query='table.name="request" and trigger.name#"SX.request."';
	commentTriggerJS(query);
	//table Subscription
	query='table.name="Subscription" and trigger.name#"SX.subscription."';
	commentTriggerJS(query);
	
	/*
	//table svcCatalog
	query='table.name="svcCatalog"';
	commentTriggerJS(query);
	//table svcDisplay
	query='table.name="svcDisplay"';
	commentTriggerJS(query);
	*/
	query='trigger.name#"DiffSync-"';
	commentTriggerJS(query);
	//table SYSATTACHMENTS
	query='table.name="SYSATTACHMENTS" and trigger.name#"SX.sysattachments."';
	commentTriggerJS(query);
	//table kmdocument
	query='table.name="kmdocument" and trigger.name#"SX.hotnews."';
	commentTriggerJS(query);
}

function commentTriggerJS(query){
	var trigger=new SCFile("triggers");
	
    if(trigger.doSelect(query)===RC_SUCCESS){ 
		do{
			/*
			if(trigger['table.name']==="svcCatalog" || trigger['table.name']==="svcDisplay"){
				if(!funcs._null(trigger['javascript'])&&trigger['javascript'].indexOf("lib.SX_EntityChangeV2.")>=0 ){
					var js=trigger['javascript'];
					trigger['javascript']=js.replace(/lib.SX_EntityChangeV2./g, "//lib.SX_EntityChangeV2.");
				    trigger.doUpdate();
				}
			}
			else if(!funcs._null(trigger['javascript'])&&(trigger['javascript'].indexOf("lib.SX_EntityChangeV2.")>=0 || trigger['javascript'].indexOf("system.library.SX_HotNewsNotification.")>=0)){
			    
				//trigger['javascript']=js.replace(/lib.SX_EntityChangeV2./g, "//lib.SX_EntityChangeV2.");
				//trigger.doUpdate();
				trigger.doDelete();
			}*/
			trigger.doDelete();
		}while(trigger.getNext()===RC_SUCCESS);
	}
}

function cleanup() {
    cleanSxRegistration();
    cleanSxEntityChangesV2();
    disablePropelSyncSchedule();
    disableSxRelatedTriggers();
}