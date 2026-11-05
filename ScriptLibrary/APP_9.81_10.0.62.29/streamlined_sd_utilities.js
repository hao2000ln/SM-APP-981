var _lng = system.functions.lng;
var _denull = system.functions.denull;


    /*
     * get user list for notification when interaction opened or cancelled
     *
     * @param users Array of user list
     * @param record interaction record
     * @return void
     */
    function getNotificationUsersWhenSDOpenedOrCancelled(users, record) {
        if (record.callback_contact != null) {
            users.push(record.callback_contact);
        }
        if (record.contact_name != null) {
            users.push(record.contact_name);
        }
    }

    /*
     * get user list for notification when Service catalog pending
     *
     * @param users Array of user list
     * @param record interaction record
     * @return void
     */
    function getNotificationUsersWhenSCPending(users, record) {
		var lng = _lng( _denull(record.current_pending_groups));
		if ( lng == null )
			lng = 0;
	
		for (var k = 0; k < lng; k++) {
            users.push(record.current_pending_groups[k]);
        }
    }

    /*
     * get user list for notification when Complaint or compliment cancelled or closed
     *
     * @param users Array of user list
     * @param record interaction record
     * @return void
     */
    function getNotificationUsersWhenComplaintCancelledOrClosed(users, record) {
        if (record.callback_contact != null) {
            users.push(record.callback_contact);
        }
        if (record.contact_name != null) {
            users.push(record.contact_name);
        }
        if (record.assignee_name != null) {
        	users.push(record.assignee_name);
        }
    }

    /*
     * get ESS web url for interaction record
     *
     * @param record interaction record
     * @return ESS web url
     */
    function getESSWebURL(incidentId) {
        var file_name = "incidents";
        var record_name = system.functions.scmsg(file_name, "tablename");
        var record_title = record_name + " " + incidentId;
        var record_query = "incident.id=\"" + incidentId + "\"";
        var web_url = lib.urlCreator.getRecordURL(file_name, record_query, record_title, incidentId);

        return web_url
    }