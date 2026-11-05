/**	
*   Check if the response of inbound request is successful or not
*	@param {param} - all parameters of case exchange
*	@param {response} - response body
*	@return - boolean
*	@type - boolean
*
*/
function validateInboundResponse(param, response) {
	var obj = eval('(' + response + ')');
	if (obj.ReturnCode === 0) {
		return true;
	}
	return false;
}


/**	
*   Check if the response of outbound request is successful or not
*	@param {param} - all parameters of case exchange
*	@param {response} - response body
*	@return - boolean
*	@type - boolean
*
*/
function validatePullOutboundResponse(param, response) {
	var obj = eval('(' + response + ')');
	if (obj.ReturnCode !== 0) {
		return false;
	}

	obj = obj.CEIncidentPull.IncidentID;
	return obj;
}


function validatePushOutboundResponse(param, response) {
	var obj = eval('(' + response + ')');
	if (obj.ReturnCode !== 0) {
		return false;
	}

	obj = obj.CEIncidentPush.IncidentID;
	return obj;
}


/**	
*   This fuction is to generate http request header for attachment API In SM
*
*	@param {direction} 
*	@param {param}
*	@param {attachObj}
*	@return - header
*	@type - array
*/
function getAttachHttpHeader(direction, param, attachObj) {
	var header = [];
	header = lib.CaseExchange_EPUtil.getHttpHeader(direction, param);
	header.push(new Header("Content-Type", attachObj.type));
	header.push(new Header("Content-Disposition", "attachment;filename=" + attachObj.name));
	return header;
}


/**	
*   This fuction is parse the attachment json as object.
*	@param {taskObj} - SMIS TaskQueue Record
*   @return {attachArray} - An array which includes multi-js object.
*/
function getAttachmentInfor(mapObj, sm, ep, context, param) {
	var attachArray = new Array();
	var basicUrl = param.baseURL;
	var attachUrl = param.attachRestURL;
	var attachUrl = lib.smis_CommonLib.processPlaceholder({}, {}, param, context, attachUrl);
	var attachFileListUrl = basicUrl + attachUrl;
	var headers = lib.CaseExchange_EPUtil.getHttpHeader("outbound", param);
	try {
		var response = doHTTPRequest("GET", attachFileListUrl, headers, '', 30, 30, 30, null);
		response = eval('(' + response + ')');
		var attachContent = response.content;
		if (attachContent != null && attachContent.length > 0) {
			for (var i = 0; i < attachContent.length; i++) {
				var attchObj = new(lib.CEAttachmentInfor.getClass())();
				attchObj.setID(attachContent[i]['attachment']['href']);
				attchObj.setFileName(attachContent[i]['attachment']['name']);
				attchObj.setSize(attachContent[i]['attachment']['len']);
				attchObj.setFileType(attachContent[i]['attachment']['xmime:contentType']);
				attachArray.push(attchObj);
			}
		}
	} catch(ex) {
		print("exception for getAttachmentInfor: " + ex);
	}
	return attachArray;
}


/**	
*   This fuction is to generate http request header for attachment API In SM
*
*	@param {reponse} 
*	@param {action}
*   @param {param}
*	@return - attchObj
*/
function parseSMCreateAttachResponse(reponse, action, param) {
	var attchObj = new(lib.CEAttachmentInfor.getClass())();
	reponse = eval('(' + reponse + ')');
	if (action == lib.CaseExchangeConstants.REST_CREATE_ATTACHMENT()) {
		attchObj.setID(reponse['attachment']['href']);
		var filename = reponse['attachment']['name'];
		attchObj.setFileName(filename);
		var contentType = reponse['attachment']['type'];
		attchObj.setSize(reponse['attachment']['len']);
	}
	return attchObj;
}
