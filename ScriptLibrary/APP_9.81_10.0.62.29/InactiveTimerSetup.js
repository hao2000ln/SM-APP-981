function startInactiveTimer(idletime, warntime, excludeList) {
	return updateInfoRec('active', idletime, warntime, excludeList);
}
function updateInactiveTimer(idletime,warntime,excludeList) {
	return updateInfoRec(null, idletime, warntime, excludeList);
}
function stopInactiveTimer() {
	return updateInfoRec('inactive');
}

function validator(idletime, warntime) {
	var rc = new SCDatum();
	rc.setType(8);
	var idletmp = parseInt(idletime,10);
	var warntmp = parseInt(warntime,10);
	var reg = /^[0-9][0-9]*$/;
	switch (true) {
		case !reg.test(idletime+''): setRc(rc,0,'error','Idle time');break;
		case !reg.test(warntime+''): setRc(rc,0,'error','Warn time');break;
		case !idletime: setRc(rc,0,'invalid.idle');break;
		case !warntime: setRc(rc,0,'invalid.warn');break;
		case idletmp<0: setRc(rc,0,'neg.idle');break;
		case warntmp<0: setRc(rc,0,'neg.warn');break;
		case idletmp < warntmp: setRc(rc,0,'idle.less.than.warn');break;
		default : setRc(rc,1);
	}
	return rc;
}

function updateInfoRec( status, idletime, warntime, excludeList) {
	var rc = new SCDatum();
	rc.setType(8);
	
	//input validation
	if(status != "inactive") {
		var validation = validator(idletime, warntime);
		if(!validation[0]) return validation;
	}
	
	//obtain info record
	var infoRec = getInfo();
	setFields(infoRec,status, idletime, warntime, excludeList);
	
	var ret = infoRec.doUpdate();
	rc.push(ret);
	return rc;
}
function addInfoRec(infoRec){

	if(!infoRec) infoRec = new SCFile('info')
	infoRec.type = 'inactive.setup';
	infoRec.format = 'configuration';
	infoRec.description = 'Setup inactive timer information.'
	setFields(infoRec,'inactive',30,10,new Array());
	return infoRec.doInsert();	
}
function setFields(infoRec,status,idletime,warntime,excludeList) {
	var infos = infoRec['process.start.infos'];

	//status
	infos[0].name='status';
	infos[0]['parameters']=[status||infos[0]['parameters'][0]];
	
	//idletime
	infos[1].name='idletime';
	infos[1]['parameters']=[parseInt(idletime,10)||infos[1]['parameters'][0]];
	
	//warntime
	infos[2].name='idlewarn';
	if(warntime) infos[2]['parameters'] = [parseInt(warntime, 10)];

	//exclude list
	infos[3].name='excludelist';
	infos[3]['parameters']=excludeList||infos[3]['parameters'].toArray();
	if(status == 'active' ){
		infos[4].name = 'start.info';
		infos[4]['parameters']=[system.functions.operator(),system.functions.tod()];	
	}
	
}

function setRc(rc,code,msg,param) {
	rc.push(code);
	rc.push(msg);
	rc.push(param);
}
function getInfo() {
	var infoRec = new SCFile("info");
	var rc = infoRec.doSelect("type=\"inactive.setup\" and format=\"configuration\"");
	if(rc!=RC_SUCCESS) addInfoRec(infoRec);
	return infoRec;
}
/**
	function to remove the legacey inactivity timer information,
	suppose there is only one inactivity timer bg process, one schedule record with class "inactive"
**/
function removeInactivityTimerStartUp(){
	var infoRec = new SCFile("info");
	var rc = infoRec.doSelect("type=\"inactive.startup\" and format=\"info.startup\"");
	if(rc==RC_SUCCESS) rc = infoRec.doDelete();
	if(rc!=RC_SUCCESS) {
		print('Failed to remove Inactivity Timer BG process.');
	}
	var schedule = new SCFile("schedule");
	rc = schedule.doSelect("class=\"inactive\"");
	if(rc == RC_SUCCESS) {
		var idletime = schedule.numbers1[0];
		var warntime = schedule.numbers1[1];
		var startup =  schedule.strings;
		var excludeList = schedule.string1;
		var status = 
		getInfo();
		updateInfoRec(null,idletime,warntime,excludeList,startup);
		rc = schedule.doDelete();
	} else getInfo();
	
	if(rc!=RC_SUCCESS) {
		print('Failed to remove Inactivity Timer schedule record.');
	}
}

