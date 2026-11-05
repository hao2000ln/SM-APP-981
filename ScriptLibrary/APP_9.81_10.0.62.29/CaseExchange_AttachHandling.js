/****************************************************************************************
*Author: Zhichao Fei
*Create Date: 20140227
*Function: Handle the attachment data for Case Exchange between SM and End Point
*It includes below key Logical:
* 1.Retrieve End point attachment data and put it to SMISTaksQueue
* 2.Copy the attachment of SMISTaksQueue to ticket record (e.g. Incident/change/problem/etc)
* 3.Send SM attachment data to end point.
* 4.Add the attachment exchange log whatever attachment pulling and push
* 5.Add some validation mechanism for attachment outbound.It includes attachment type, attachment size and etc.
*
*****************************************************************************************/
var logger;

 /**
 * This function is pulling end point attachments into task queue.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {taskObj} - SMISTaskQueue Object
 *  @param {configitem} - SMIS Instance Configuration Object.
 *  @returns {isSuccess} - Success(true)/Failure(false)
 *
 */
function putAttachmentsToQueue(taskObj, configitem)
{
	var isSuccess = false;
	logger = configitem.getLogger();
	var action = taskObj.action;
	
	var ret;
	var taskId = taskObj.id;
	var task = null;
	if (taskId != null) {
		task = new SCFile("SMISTaskQueue");
		ret = task.doSelect("id=\"" + taskId + "\"");
	}
					
	if (task != null && configitem != null && ret == RC_SUCCESS)
	{
		//Try to call customization script to parse or retrieve attachment info.
		var getAttachScript = configitem.getConfigParameterValue("getAttachInforScript");
		//
		var params = configitem.getAllParameters();
		taskObj.smisContext = lib.smis_CommonLib.task2Context(taskObj, taskObj.smisContext);
		eval('var attachmentArray = lib.' + getAttachScript + '(taskObj.destObject, taskObj.inRecord, taskObj.outRecord, taskObj.smisContext, params)');	
		var newAttachmentArray = [];
		if (action == "add")
		{
			newAttachmentArray = attachmentArray;
		}
		else
		{
			lib.CaseExchange_AttachRelationShip.markAttachRemovedByEP(task['externalId'],attachmentArray,taskObj.intId);
			newAttachmentArray = lib.CaseExchange_AttachRelationShip.getEPCreatedAttachmentIds(task['externalId'],attachmentArray,taskObj.intId);
		}
		logger.debug("CaseExchange_AttachHandling.putAttachmentsToQueue:SAW has attachments:->"+newAttachmentArray.length);
		if (newAttachmentArray != null && newAttachmentArray.length > 0)
		{
			var i;
			for(i = 0; i < newAttachmentArray.length; i++)
			{
				try{
					var attachObj = newAttachmentArray[i];
					logger.debug("CaseExchange_AttachHandling.putAttachmentsToQueue:Try to pull attachment.->File name:"+attachObj.file_name);
					var attachData = _retriveEPAttachmentDataByID(taskObj,attachObj,configitem);
					_createAttachmentInSM(task,attachObj,attachData);
					logger.debug("CaseExchange_AttachHandling.putAttachmentsToQueue:Pulled the attachment to Queue.->File name:"+attachObj.file_name);
					isSuccess = true;
					/*
					_putAttachmentLogs(taskObj,attachObj.file_name,lib.CaseExchangeConstants.REST_ATTACH_ACTION_CREATE(),
					                     lib.CaseExchangeConstants.REST_ATTACH_RESULT_SUCCESS(),'',attachObj.size);*/
				}
				catch(ex)
				{
					isSuccess = false;
					logger.error("ex:"+ex);
					_putAttachmentLogs(taskObj,attachObj.file_name,lib.CaseExchangeConstants.REST_ATTACH_ACTION_CREATE(),
					                      lib.CaseExchangeConstants.REST_ATTACH_RESULT_FAILURE(),ex,attachObj.size);
				}
			}
		}
	}
	return isSuccess;
}


 /**
 * This function is put attachment log information to SMISTask Object.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {task} - SMISTaskQueue Object
 *  @param {name} - File Name.
 *  @param {action} - Delete/Add.
 *  @param {result} - Success/Failure
 *  @param {failureReason} - Exchange Attachment failure reason.
 *  @param {size} - File Size.
 *  @returns {task} - SMISTaskQueue Object.
 *
 */
function _putAttachmentLogs(task,name,action,result,failureReason,size)
{
	if (task.attachLogs == undefined || task.attachLogs == null)
	{
		task.attachLogs= [];
	}
	var logObj = {};
	logObj.filename = name;
	logObj.action = action;
	logObj.result = result;
	logObj.reason = failureReason;
	logObj.len = size;
	logObj.date = new Date();
	task.attachLogs.push(logObj);
	
	return task;
}


 /**
 * This function is to retrieve end point attachments data.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {taskObj} - SMISTaskQueue Object
 *  @param {attachObj} - File Name.
 *  @returns {attachData} - Attachment binary data .
 *
 */
function _retriveEPAttachmentDataByID(taskObj,attachObj,smisConfig)
{
	var attachData = "";
	var attachTimeout = smisConfig.getConfigParameterValue("attachTimeout");
	var restRequest = new (lib.CaseExchange_RestRequest.getClass())(smisConfig.getAllParameters());
	var attachmentID = attachObj.id;
	
	var reqAddress = _getRealRestURL(lib.CaseExchangeConstants.REST_FETCH_ATTACHMENT(),attachmentID,taskObj,smisConfig);
	if (reqAddress != null && reqAddress != "")
	{
		attachData = restRequest.doAttachInboundRequest(lib.CaseExchangeConstants.HTTP_ACTION_GET(),reqAddress,attachTimeout,{},attachObj);
	}
	return attachData;
}

 /**
 * This function is get real rest url base on different action name.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {reqAction} - FETCH_ATTACHMENT/CREATE_ATTACHMENT
 *  @param {attachid} - Attachment unique id in End point.
 *  @param {taskObj} - Task Object
 *  @returns {completedUrl} - full attachment rest webservice url(Create/Retrieve)
 */
function _getRealRestURL(reqAction, attachid,taskObj,smisConfig)
{
	var completedUrl = "";
	if (smisConfig != null)
	{
		var basicUrl = smisConfig.getConfigParameterValue("baseURL");
		var params = smisConfig.getAllParameters();
		
		var attachUrl = lib.smis_CommonLib.processPlaceholder(taskObj.inRecord,taskObj.outRecord,params,taskObj.smisContext,
		                                                           smisConfig.getConfigParameterValue("attachRestURL"));
		if (attachUrl != null && attachUrl != "")
		{  
			var fitstStr = attachUrl.substring(0,1);
			var endStr = attachUrl.substring(attachUrl.length - 1,attachUrl.length);
			if (fitstStr != "/") 
			{
				attachUrl = "/"+attachUrl;
			}
			if (endStr != "/") 
			{
				attachUrl = attachUrl+"/";
			}                                                
			//Get fetch attachment url
			if (reqAction == lib.CaseExchangeConstants.REST_FETCH_ATTACHMENT())
			{
				if (attachid != null)
				{
					completedUrl=basicUrl+attachUrl+attachid;
				}
			}
			//Get create attachment url
			else if(reqAction == lib.CaseExchangeConstants.REST_CREATE_ATTACHMENT())
			{
				completedUrl=basicUrl+attachUrl;
			}
		}
	}
	return completedUrl;
}

 /**
 * Create an attachment using end point data and link to current SMISTaskQueue record.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {file} - SMISTaskQueue record
 *  @param {attachObj} - CaseExchange Attachment Object
 *  @param {data} - Attachment Binary data
 *
 */
function _createAttachmentInSM(file,attachObj,data)
{
	try
	{
		var smattach = new Attachment();
		smattach.type = attachObj.mime_type;
		smattach.name = attachObj.file_name;
		smattach.value = data;
		var smAttachId = file.insertAttachment( smattach );
		//Below lines start create attachment relationship.
		var attachRelation = {};
		attachRelation.smattachid = smAttachId;
		attachRelation.epattachid = attachObj.id;
		attachRelation.externalid = file['externalId'];
		attachRelation.createdby = lib.CaseExchangeConstants.CREATE_BY_EP();
		attachRelation.filenameinsm = attachObj.file_name;
		attachRelation.filenameinep = attachObj.file_name;
		
		attachRelation.smisInstanceId = file['intId'];//SMIS Instance id
		attachRelation.internalObject = file['object'];//SM Table name
		attachRelation.createdate = funcs.tod();
		lib.CaseExchange_AttachRelationShip.createAttachRelationShip(attachRelation);
	}
	catch(ex)
	{
		logger.error("Exception: " + ex);
		throw ex;
	}
}


 /**
 * Copy the task recoreds's attachment to incident.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {taskObj} - SMISTaskQueue record
 *  @param {incidentFile} - Ticket record(e.g. probsummary record/change record and etc)
 *	@param {smisConfig} - SMIS Configuration Item
 *
 */
function moveQueueAttachToIncident(taskObj,incidentFile,smisConfig)
{
	logger = smisConfig.getLogger();
	try
	{
		var taskId = taskObj.id;
		var taskRecord = null;
		if (taskId != null) {
			taskRecord = new SCFile("SMISTaskQueue");
			var ret = taskRecord.doSelect("id=\"" + taskId + "\"");
		}
		
		var attachments = taskRecord.getAttachments();
		if(attachments != null && attachments.length > 0)
		{
			var i;
			for(i = 0; i < attachments.length; i++)
			{
				try
				{
					var attriElement = attachments[i];
					var incAttachId = incidentFile.insertAttachment( attriElement);
					//Update Attachment relation with sm incident id and incident attachment id
					var ticketkey = smisConfig.getConfigParameterValue("internalId");
					lib.CaseExchange_AttachRelationShip.updateAttachRelationBySMAttachID(taskRecord['externalId'],
																								  incidentFile[ticketkey],
																								  attriElement.href,
																								  incAttachId);
					_putAttachmentLogs(taskObj,attriElement.name,lib.CaseExchangeConstants.REST_ATTACH_ACTION_CREATE(),
					                     lib.CaseExchangeConstants.REST_ATTACH_RESULT_SUCCESS(),'',attriElement.len);
				}
				catch(ex1)
				{
					_putAttachmentLogs(taskObj,attriElement.name,lib.CaseExchangeConstants.REST_ATTACH_ACTION_CREATE(),
	                 lib.CaseExchangeConstants.REST_ATTACH_RESULT_FAILURE(),'',attriElement.len);
					
					logger.error("Exception: " + ex1);
					throw ex1;
				}
			}
		}
	}
	catch(ex2)
	{
		logger.error(ex2);
		throw ex2;
	}
}

 /**
 * Function: Send SM attachments to end point.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {taskObj} - SMISTaskQueue record
 * @param {configItem} - SMIS Configure Item
 * @param {postedAttachments} - Object of the posted attachments 
 * @return {attachInfoHash} - An array which includes CEAttachmentInfo object which parse the create attachment response.
 *
 */

function sendAttachmentsToEndPoint(taskObj,smisConfig,postedAttachments)
{
	var attachInfoHash = [];
	logger = smisConfig.getLogger();
	//Check If the attachment switch is on.
	var isActive =lib.CaseExchange_AttachHandling.isAttachmentSwitchActive(smisConfig);
	taskObj.smisContext = lib.smis_CommonLib.task2Context(taskObj, taskObj.smisContext);
	
	if (taskObj != null && isActive)
	{
		var taskId = taskObj.id;
		var taskRecord = null;
		if (taskId != null) {
			taskRecord = new SCFile("SMISTaskQueue");
			var ret = taskRecord.doSelect("id=\"" + taskId + "\"");
		}
	
		var action = taskRecord['action'];
		if (action != null && action != "")
		{
			var attachs = taskRecord.getAttachments();
			if (attachs != null && attachs.length > 0)
			{
				var i;	
				for (i = 0; i < attachs.length; i++)
				{
					try
					{
						var taskAttachId = attachs[i]['href'];
						
						//filter out the attachment which has been posted
						if (postedAttachments && postedAttachments != "") {
							//retrieve the attachment relationship entity (initialized by "OutboundTaskReceiver")
							var attachRelation = new SCFile("AttachmentRelationship");
							var sql = "internalid=\"" + taskObj['internalId'] + "\" and internalObject=\"" + taskObj['object'] + "\" and smisInstanceId=\""
										+ taskObj['intId'] + "\" and epattachid=\"" + taskAttachId + "\" and createdby=\"" + lib.CaseExchangeConstants.CREATE_BY_SM() + "\"";
								
							if (attachRelation.doSelect(sql) === RC_SUCCESS) {
								var smattachid = attachRelation.smattachid;	
								if (postedAttachments[smattachid]) {
									attachRelation.epattachid = postedAttachments[smattachid];
									attachRelation.externalid = taskObj['externalId'];
									attachRelation.createdby = lib.CaseExchangeConstants.CREATE_BY_EP();
									attachRelation.doUpdate();
									
									continue;
								}
							}
						}
											
						var isAllowed = lib.CaseExchange_AttachHandling.validateAttachment(attachs[i],smisConfig);
						var attachmentInfoObj = _createAttachmentInEP(attachs[i],taskObj,smisConfig);
						if (attachmentInfoObj) {
							attachInfoHash.push(attachmentInfoObj);
							_putAttachmentLogs(taskObj,attachs[i].name,lib.CaseExchangeConstants.REST_ATTACH_ACTION_CREATE(),
    						                     lib.CaseExchangeConstants.REST_ATTACH_RESULT_SUCCESS(),'',attachs[i].len);
							lib.CaseExchange_AttachRelationShip.updateAttachRelationByEPAttachID(taskObj['internalId'],
																									 taskObj['externalId'],
																			  						 taskAttachId,
																			                         attachmentInfoObj.getID());
						}
					}
					catch(ex)
					{
						logger.error("Exception:"+ex);
						_putAttachmentLogs(taskObj,attachs[i].name,lib.CaseExchangeConstants.REST_ATTACH_ACTION_CREATE(),
						                     lib.CaseExchangeConstants.REST_ATTACH_RESULT_FAILURE(),ex,attachs[i].len);
						lib.CaseExchange_AttachRelationShip.removeAttachRelation(taskObj.internalId,taskAttachId,taskObj.intId,true);
					}
				}
			}
		}
	}
	return attachInfoHash;
}


 /**
 * Function: Create an attachment object in end point by call corresponding Rest webservice
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {taskObj} - SMISTaskQueue record
 * @param {attachObj} - Attachment Object in SM Side
 * @return {attachmentInforObj} - An attay which includes CEAttachmentInfo object which parse the crete attachment response.
 *
 */
function _createAttachmentInEP(attachObj,taskObj,smisConfig)
{
	var response;
	var attachTimeout = smisConfig.getConfigParameterValue("attachTimeout");
	if (!attachTimeout) {
	    attachTimeout = 20;
	}
	else {
	    attachTimeout = Number(attachTimeout);
	}
	var parseAttachRep = smisConfig.getConfigParameterValue("parseCreateAttaRepScript");
	var param = smisConfig.getAllParameters();
	
	var createAttachUrl = _getRealRestURL(lib.CaseExchangeConstants.REST_CREATE_ATTACHMENT(),null,taskObj,smisConfig);
	logger.debug("CaseExchange_AttachHandling._createAttachmentInSaw:Call url to create attachment in SAW:->"+createAttachUrl);
	if (createAttachUrl != null && createAttachUrl != "")
	{
		response = doAttachOutboundRouter(lib.CaseExchangeConstants.HTTP_ACTION_POST(),createAttachUrl,attachObj.value,attachTimeout,attachObj,param);
	}

	var attachmentInforObj = null; 
	if(parseAttachRep != null && parseAttachRep != "")
	{
		param = smisConfig.getAllParameters();
		eval('attachmentInforObj = lib.' + parseAttachRep + '(response,lib.CaseExchangeConstants.REST_CREATE_ATTACHMENT(),param)');	
	}
	else
	{
		throw("Operator doesn't configured response parser for attachment creation.");
	}
	
	return attachmentInforObj;
}


 /**
 * To judge if the attachment exchange is on
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {config} - SMIS Instance Configuration
 * @return {isOn} - true(attachment switch is on)/
 *                  false(attachment switch is off)
 *
 */
function isAttachmentSwitchActive(config)
{
	var isOn = config.getConfigParameterValue("attachSwitch");
	return isOn;
}


 /**
 * To check if the attachment size is over the size limination in SMIS configure.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {size} - Current attachment size(e.g. 1024 bye)
 * @param {config} - SMIS Instance Configuration
 * @return {isAllowed} - true(Current size is allowed)/
 *                  false(Current size is prohibited)
 */
function _isAttachSizeAllowed(size,smisConfig)
{
	var isAllowed = false;
	var allowedSize = smisConfig.getConfigParameterValue("attachSize");
	if (allowedSize == null || allowedSize == 0)
	{
		allowedSize = 1024;
	}
	isAllowed = (size <= allowedSize*1024?true:false);
	
	return isAllowed;
}

 /**
 * To check if the attachment type is supported in SMIS Configuration.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {filename} - The file name of current attachment object.
 * @param {config} - SMIS Instance Configuration
 * @return {isSupported} - true(Current file type is supported)/
 *                         false(Current file type is prohibited)
 */
function _isAttachTypeSupported(filename,smisConfig)
{
	var isSupported = true;
	var unSupportedTypes = smisConfig.getConfigParameterValue("unSupportedFileType");
	var fileInfo = filename.split(".");
	var curFileType = "";
	if (fileInfo.length > 1)
	{
		curFileType = fileInfo[fileInfo.length -1];
	}
	
	if (curFileType != "")
	{
		if (unSupportedTypes != null && unSupportedTypes != "")
		{
			var fileTypes = unSupportedTypes.split(";");
			var i;
			for (i = 0; i < fileTypes.length; i++)
			{
				if (fileTypes[i] == curFileType)
				{
					isSupported = false;
					break;
				}
			}
		}
	}
	else
	{
		isSupported = false;
	}
	return isSupported;
}

 /**
 * To check if the attachment type, file size is allowed.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {attachment} - Attachment object in SM side.
 * @param {config} - SMIS Instance Configuration
 * @return {isPass} - true(pass)/
 *                    false(prohibited)
 */
function validateAttachment(attachment,config)
{
	var isPass = true;
	
	var isSupport = _isAttachTypeSupported(attachment.name,config);
	if (!isSupport)
	{
		isPass = false;
		throw("File type "+attachment.name +" doesn't support in EP.");
	}
	var isAllowed = _isAttachSizeAllowed(attachment.len,config);
	if (!isAllowed)
	{
		isPass = false;
		throw("File "+attachment.name +" exceed allowed file size.");
	}
	return isPass;
}

/**	
*   This fuction is to do attachment inbound request
*
*	@param {url} - rest url
*	@param {responseHeader} - responseHeader
*	@return - response from end point
*	@type - string
*/
function doAttachOutboundRouter(httpAction,url,binaryData,timeout,attachmentObj,param) {
	var response="";
	var headers;
	var tranByMulti = false;
	var boundaryStr = "";
	var attachHeaderScript = param.attachHeaderScript;
	///Get Http header use it for transport attachment
	if (attachHeaderScript) {
		headers = eval('lib.' + attachHeaderScript + '(lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT(),param,attachmentObj)');
	}
	//Get boundary
	if (headers != null && headers.length > 0)
	{
		var i;
		for (i = 0 ; i < headers.length;i++)
		{
			var header = headers[i];
			if (header.name == "Content-Type")
			{
				var headerValue = header.value;
				try
				{
					var index1 = headerValue.indexOf('multipart/form-data');
					var index2 = headerValue.indexOf('boundary');
					if (index1 > -1)
					{
						tranByMulti = true;
						if (index2 > -1)
						{
							boundaryStr = headerValue.substring(index2+9);
							break;
						}
					}
				}
				catch(ex)
				{
					logger.error('CaseExchange_RestRequest', "It happened error when try to get the boundary");
				}	
			}
		}
	}
	var restRequest = new (lib.CaseExchange_RestRequest.getClass())(param);
	if (!tranByMulti)
	{
		response = restRequest.doAttachOutboundRequest(httpAction,url,binaryData,timeout,{},attachmentObj,headers);
	}
	else
	{
		response = restRequest.doAttachOutboundByStream(httpAction,url,binaryData,timeout,attachmentObj,headers,boundaryStr);
	}
	return response;
}	
