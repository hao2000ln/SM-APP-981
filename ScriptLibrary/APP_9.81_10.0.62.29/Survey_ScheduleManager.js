/******************************************************
* Module Name: SMIS Schedule Manager
* Function: provide functions to manage schedule record
* Author: Xing, Jiang-Bin
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/


function saveScheduleRecord(surveyDefinition) {
	var sch = new SCFile("schedule");
	
	
	var RC = sch.doSelect("name = \"" + surveyDefinition.surveyId + "\"");
	var existed = false;
	
	if(RC == RC_SUCCESS) {
	 	existed = true;
	}
	
	
	sch.name = surveyDefinition.surveyId;
	var className = lib.Survey_Constants.SCHEDULE_CLASS_NAME();
	sch["class"] = className;
	sch["sched.class"] = className;
	
	sch.expiration = surveyDefinition.activeFrom;
	sch.repeat = surveyDefinition.getIntervalTimeDate();
	sch.repeata = false;  //Annually
	sch.repeatb = false;  //Semi-Annually
	sch.repeatm = false;  //Monthy
	sch.repeatq = false;  //Quterly
	sch.strings = [sch.name,sch.name];
	//the four options are all false, means the "Other" is true
	
	var pattern = /\$+\w+\$/i;
	
	sch.javascript = lib.Survey_Constants.SCHEDULER_RUN().replace(pattern,surveyDefinition.surveyId);
	sch.description = ["Survey Schedule"]; //TODO
	
	var result = null;
	
	if(existed) {
		result = sch.doUpdate();
	} else {
		result = sch.doInsert();
	};
	
	return result == RC_SUCCESS;
}

function getLastScheduleProcessingTime(surveyDefinition) {
	var log = surveyDefinition.getLogger();
	var sch = new SCFile("schedule");
	
	
	var RC = sch.doSelect("name = \"" + surveyDefinition.surveyId + "\"");
	if(RC == RC_SUCCESS) {
	 	return sch["action.time"];
	}
	
	return null;
}

function deleteScheduleRecord(surveyDefinition) {
	var log = surveyDefinition.getLogger();
	var sch = new SCFile("schedule");
	var RC = sch.doSelect("name = \"" + surveyDefinition.surveyId + "\"");
	var existed = false;
	
	if(RC == RC_SUCCESS) {
	 	log.info("Survey_ScheduleManager", "Deleting the Schedule record for the current scheduler. Schedule name : " + sch.name);
	 	return sch.doDelete();
	}
	return false;
}

function addInfoRecord() {
	var info = new SCFile("info");
	
	var infoType = null;
	
	
	var RC = info.doSelect("type = \"" + lib.Survey_Constants.SCHEDULE_CLASS_NAME() + "\"");
	
	var existed = false;
	
	if(RC == RC_SUCCESS) {
	 	existed = true;
	}
	
	info.type = lib.Survey_Constants.SCHEDULE_CLASS_NAME();
	info.description = "Info for the Survey Integration"; //TODO
	info.format = "info.startup";
	
	var processors = info["process.start.infos"];
	
	var className = lib.survey_Constants.SCHEDULE_CLASS_NAME();
	
	info["process.start.infos"][0].name = info.type; 	
	info["process.start.infos"][0].parameters = ["scheduler", className,"60","1"];	
	info["process.start.infos"][0]["suppress.startup"] = false;
	
	var result = null;
	
	if(existed) {
		result = info.doUpdate();
	} else {
		result = info.doInsert();
	}
	
	
	
	return result == RC_SUCCESS;
}

function deleteInfoRecord() {
	var info = new SCFile("info");
	
	var RC = info.doSelect("type = \"" + lib.Survey_Constants.SCHEDULE_CLASS_NAME() + "\"");
	
	var existed = false;
	
	if(RC == RC_SUCCESS) {
		return info.doDelete();
	}
	
	return false;
}

function triggerSchedule() {
    var rteReturnValue = new SCDatum();
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	argVals.setType(8);     //type array
	argNames.setType(8);    //type array
	var argVal;
	  
	argVal=new SCDatum();
	argVal.setType(2); //string                           
	argVal="name";
	argNames.push(argVal);
	         
	argVal=new SCDatum();
	argVal.setType(6); //string                           
	argVal= lib.Survey_Constants.SCHEDULE_CLASS_NAME();;
	argVals.push(argVal); 
            
           
    system.functions.rtecall("callrad", 
                                 rteReturnValue, 
                                 "scheduler.start", //RAD app name
                                 argNames,
                                 argVals,
                                 false); //false to run in same thread, true to run in new thread                                 
                                     
}

function stopSchedule() {
    var schName = lib.Survey_Constants.SCHEDULE_CLASS_NAME();;
    var title = "Stop " + schName + " Process";
    var fSchedule = new SCFile( "schedule" );
    if( fSchedule.doSelect( 'name="' + title + '"' ) != RC_SUCCESS ) {
        fSchedule.name = title;
        fSchedule._class = schName;
        fSchedule.sched_class = schName;
        fSchedule.expiration = system.functions.tod();
        fSchedule.application = "scheduler.stop";
        fSchedule.doInsert(); 
    }
}

