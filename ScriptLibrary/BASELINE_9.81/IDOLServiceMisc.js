/*
*	Smart Analytics Services for Query/Search functions
*
*	author He, Peng-Fei
*	
*	var IDOLServiceMisc = lib.IDOLServiceMisc.require();
*	var result = IDOLServiceMisc.getStatus();
*/

var logger = getLog('IDOLServiceMisc');

var IDOLServiceMisc = function() {

	/**
	*   Call action=getStatus to retrieve the status info from idol
	*
	*	@return - The xml document of status info from idol
	*   @type - XML
	**/
	function getStatus() {
		var params = {action: 'getStatus'};
		
		var IDOLConfigureObj = lib.IDOLConfigure.require();
		
		var idolUrl = IDOLConfigureObj.getConfig()['server.url'];
		
		if(IDOLConfigureObj.isInContainer()){
			idolUrl = IDOLConfigureObj.getSearchMsvcEndPoint();
		}

		var result = lib.IDOLRequest.require().doIDOLGet(idolUrl, params);
		logger.trace('finish call lib.IDOLRequest.require().doIDOLPost() with result: ' + result);
		
		return result
	}
	
	return {
		getStatus: getStatus
	}
}()

function require() {
	return IDOLServiceMisc;
}