/** this function is used to update the dataModEventRel fields to synchronize with dataModEventRelItem
 ** this method is called by dataModEventRelItem trigger on add,update and delete
 ** active, only if all the field is inactive, then the value is inactive, otherwise it will be active.
 ** processDate, the lastest processDate will be stored
 ** status, all the status will be listed and separate by comma and alpha order.
 **/
function updateDataModEventRel(relId) {

	var dataModEventRel = new SCFile("dataModEventRel");
	var rc = dataModEventRel.doSelect(" id=" + relId);
	if (rc == RC_SUCCESS) {

		var relItem = new SCFile("dataModEventRelItem");
		var rc = relItem.doSelect("relEventId=" + relId);
		var activeList = [];
		var processedDate = null;
		var statusList = [];

		while (rc == RC_SUCCESS) {
			if (!lib.ArrayUtil.contains(activeList, relItem.item_active)) {
				activeList.push(relItem.item_active);
			}
			if (relItem.item_processedDate != null && relItem.item_processedDate != false) {
				if (processedDate == null || processedDate < relItem.item_processedDate) {
					processedDate = relItem.item_processedDate;
				}
			}
			if (!lib.ArrayUtil.contains(statusList, relItem.item_status)) {
				statusList.push(relItem.item_status);
			}
			rc = relItem.getNext();
		}

		if (activeList.length == 1) {
			dataModEventRel.active = activeList[0];
		}
		if (processedDate != null) {

			dataModEventRel.processedDate = processedDate;
		}
		if (statusList.length > 0) {
			statusList.sort();
			//sort the status to make it easy to find
			dataModEventRel.status = statusList.join(",");
		}
		dataModEventRel.doUpdate();
	}



}