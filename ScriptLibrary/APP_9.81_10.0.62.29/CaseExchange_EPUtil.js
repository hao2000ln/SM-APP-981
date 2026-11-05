/******************************************************
* Module Name: Case Exchange
* Function: End point utility
* Author: He, Peng-Fei
* Version: 1.00
* Creation Date: Feb, 2014
*******************************************************/

/**	
*   This fuction is to generate http request header for common EP
*
*	@param {direction} - inbound or outbound
*	@param {param} - all parameters of case exchange
*	@return - header
*	@type - array
*/
function getHttpHeader(direction, param) {
	var header = [];
	var loginScript = param.loginScript;
	
	if (!loginScript) {
		var username = param.username;
		var password = param.password;
		httpHeader = basicAuth(header, username, password);
	}
	
	if (lib.CaseExchange_CommonLib.isOutbound(direction)){ //outbound
		//set Content-Type
		header.push(new Header('Content-Type', 'application/json;charset=UTF-8'));
	}
	
	return header;
}

/**	
*   This fuction is set basic authorization to http header
*
*	@param {httpHeader} - passed in http header
*	@param {username}
*	@param {password}
*	@return - header
*	@type - array
*/
function basicAuth(httpHeader, username, password){
	var authHeader = new Header();
	authHeader.name = "Authorization";
	authHeader.value = "Basic " + lib.smis_CommonLib.encode64(username + ":" + password);
	
	httpHeader.push(authHeader);
	
	return httpHeader;
}

/**	
*   This fuction is validate the response of outbound request is validated or not and return the id if is validated
*
*	@param {param} - all parameters of case exchange
*	@param {response}
*	@return - id/false. If response is not validated, return false. Otherwise return id.
*	@type - string/boolean
*/
function validateOutboundRes(param, response){
	var restListPath = param.restListPath;
	var externalKey = param.externalId;
	try {
		return eval('response.' + restListPath + '.' + externalKey);
	} catch (ex) {
		return false;
	}
}