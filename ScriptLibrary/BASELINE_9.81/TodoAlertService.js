var todoAlertDao = lib.TodoAlertDao;

/**
 * get to-do alert configuration info
 * @return {Object} to-do alert configuration info
 * sample: {enable: true, refreshInterval: 300, showCount: 20}
 */
function getTodoAlertConfig() {
	return todoAlertDao.getTodoAlertConfig();
}


/**
 * get total to-do alert count
 * @param  {boolean} isGroup 
 * @return {int} total count
 */
function getTotalAlertCount() {
	return todoAlertDao.getTotalAlertCount();
}


/**
 * get to-do alert list for current logged user
 * @param  {boolean} isGroup 
 * @return {Object} object contains alert list and total count
 * sample json: {count: 40, alerts: [{id: 1, message: "SLO expiry in 3 hours", type: "SLO", recordId: "SLO00001", fileName: "slo", actions: [{action: "approve", label: "Approve"}]}]};
 */
function getTodoAlertList() {
	// check if schedule running.
	return todoAlertDao.getTodoAlertList();
}


/** 
 * [acknowledge the alert record thru the alert id]
 * @param  {Number}  id  alert id
 * @return {String}          "xxx has been acknowledged."
 */
function doAcknowledge(id) {
	return todoAlertDao.doAcknowledge(id, true);
}


/** 
 * [acknowledge the alert record thru the alert record id and file name]
 * @param  {Number}  id  alert id
 * @return {String}          "xxx has been acknowledged."
 */
function acknowledgeRelatedRecords(id) {
	return todoAlertDao.doAcknowledge(id, false);
}

