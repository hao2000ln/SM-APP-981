lib.c.$SCFile('Subscription').selectAll().iterate(function (rel) {
	if (rel['serviceName']) {
		var device = new SCFile("device", SCFILE_READONLY);
		var rc = device.doSelect("logical.name=\"" + rel['serviceName'] + "\"");
		if (rc == RC_SUCCESS) {
			if (device['sm.device.display.name']) 
				rel['displayName'] = device['sm.device.display.name'];
			 else
			  	rel['displayName'] = device['logical.name'];
			rel.doSave();
		}
	}
});