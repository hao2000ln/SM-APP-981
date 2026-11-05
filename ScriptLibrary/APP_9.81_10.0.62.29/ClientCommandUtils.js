var COMMAND_ADD_OR_UPDATE_TODO_ALERT = 'addOrUpdateTodoAlert';
var COMMAND_DELETE_TODO_ALERT = 'removeTodoAlert';


/**
 * send refresh command to client
 */
function addOrUpdateTodoAlert(user, alertRecord, date_order) {
	var msg = funcs.scmsg('new_alert', 'TodoAlert', [alertRecord['record.id']]);
	alertRecord.message_text = lib.TodoAlertUtil.trimMessage(alertRecord['message.text']);
	
	var alert = lib.TodoAlertDao.getAlert(alertRecord, date_order, true);
	lib.CommonClientCommandSender.sendClientCommand(COMMAND_ADD_OR_UPDATE_TODO_ALERT, [alert, msg], user);
}

/**
 * send remove alert command to client
 */
function deleteTodoAlert(user, alertRecord) {
	var msg = funcs.scmsg('remove_alert', 'TodoAlert', [alertRecord['record.id']]);
	lib.CommonClientCommandSender.sendClientCommand(COMMAND_DELETE_TODO_ALERT, [alertRecord['id'], msg, false], user);
}

/**
 * send acknowledged alert command to client
 */
function todoAlertAcknowledged(user, alertId, msg) {
	lib.CommonClientCommandSender.sendClientCommand(COMMAND_DELETE_TODO_ALERT, [alertId, msg, true], user);
}

