/**
 * 
 */
function run(file, action, eventin){
	if(action=='open' || action=='add') {
		action = 'create';
	} else if (action='update'){
		action = 'save';
	} else if (action='close'){
		action = 'Close';
	}

	var returnObj = lib.RestfulAction.actionEngine(file, action, 'RM');
	return returnObj.returnCode;	
}