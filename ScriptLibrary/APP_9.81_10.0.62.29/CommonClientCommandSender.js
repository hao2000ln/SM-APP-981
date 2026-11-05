
var MSGTYPE = 1;


/**
* send client command
* @param  {String} command command name
* @param  {Array} arguments
*/
function sendClientCommand(command, args, user) {
	var cmdObj = {'command': "", 'arguments': []};
	cmdObj['command'] = command;
	cmdObj['arguments'] = args;
	
	system.functions.msg("<<application_command>>" + lib.JSON2.toJSON(cmdObj), MSGTYPE, user);
}