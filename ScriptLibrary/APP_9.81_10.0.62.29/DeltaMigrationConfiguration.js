/**
 * Return the list which should not be exported
 *
 * @returns {Array}
 */
function getExportExcludeList() {

	return [
		"application",	// rad
		"code",
		"counters",
		"enclapplication",
		"enclapplrev",
		"DeltaMigToolKPI",	// used by delta migration tool only
		"displaycache",
		"licenseinfo",
		"locallist",
		"lock",
		"msglog",
		"syslog",
		"userinfo"
	];
}


/**
 * return counter table name list which should be disabled during importing
 *
 * @returns {Array}
 */
function getImportDisableCounterList() {
	
	// those counter value is stored as foreign key which should be unchanged between environments 
	return [
		"Alertlog",		//?
		"ApprovalLog",	//?
		"sla",
		"slaresponse",
		"slo",
		"Subscription"
	];
}
