/*
*	Display kmbase info in the idol configuration page
*	The infos are set to the local vars $L.kbname, $L.kbdescription, $L.kbtype, $L.kbinterval, $L.kbtime, $L.kbstatus
*/
function displayKMBaseList() {
	vars['$kbname'] = vars['$kbdescription'] = vars['$kbtype'] = vars['$kbinterval'] = vars['$kbtime'] = vars['$kbstatus'] = [];
	var kmbase = new SCFile('kmknowledgebase', SCFILE_READONLY);
	kmbase.setFields['kbname', 'kbdescription', 'kbtype', 'interval'];
	var rc = kmbase.doSelect('true');
	
	var kmBaseStatus = getKMBaseStatus();
	
	while (rc === RC_SUCCESS) {
		vars['$kbname'].push(kmbase['kbname']);
		vars['$kbdescription'].push(kmbase['kbdescription']);
		vars['$kbtype'].push(kmbase['kbtype']);
		vars['$kbinterval'].push(funcs.scmsg('70', 'idol', [kmbase['interval'] * 5])); //* mins
		
		vars['$kbtime'].push();
		var status = funcs.scmsg(209, "km"); //offline
		if (vars['$lo.idol.enabled']) {
			var count = kmBaseStatus[kmbase['kbname']];
			if ( count && count > 0) {
				status = funcs.scmsg(208, "km"); //online
			} else if ( count && count == 0) {
				status = funcs.scmsg(211, "km"); //online
			}	
		}
		vars['$kbstatus'].push(status);
		rc = kmbase.getNext();
	}
}

/*
*	Save the expiration days to km envrionment
*/
function saveExpiration() {
	if (vars['$expiration'] !== vars['$G.km.globalenv']['km.expiration.period']) {
		var expiration = Number(vars['$expiration']);
		var kmenv = new SCFile('environment');
		var rc = kmenv.doSelect('name = "knowledge management"');
		if (rc === RC_SUCCESS) {
			kmenv['km.expiration.period'] = expiration;
			var updateRC = kmenv.doUpdate();
			if (updateRC === RC_SUCCESS) {
				vars['$G.km.globalenv']['km.expiration.period'] = expiration;
			}
		}
	}
}



function getKMBaseStatus() {
	if (vars['$lo.idol.enabled']) {
		var result = {};
		var IDOLConfigureObj = lib.IDOLConfigure.require();
		
		var url = IDOLConfigureObj.getConfig()['server.url'];
		
		if(IDOLConfigureObj.isInContainer()){
			url = IDOLConfigureObj.getSearchMsvcEndPoint();
		}
		
		var response = lib.IDOLRequest.require().doIDOLGet(url, { action : 'getstatus' });
		
		var xQuery = lib.XQuery.require();
		var threadNodes = xQuery.query('responsedata/databases/database', response);

		for (var i = 0; i < threadNodes.length; i++) {
			var name = xQuery.queryText('name', threadNodes[i]);
			var count = xQuery.queryText('documents', threadNodes[i]);
			result[name] = count;
		}
	}
    
	return result;
}