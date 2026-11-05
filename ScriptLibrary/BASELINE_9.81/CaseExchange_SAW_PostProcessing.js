/******************************************************
* Module Name: Case Exchange
* Function: Post scripts for Case Exchange Inbound/Outbound
* Author: He, Peng-Fei
* Version: 1.00
* Creation Date: Feb, 2014
*******************************************************/
function postInbound(mapObj, sm, ep, context, param){
   	var comments = new Array();
   	var smRecord = context.internalObject;
   	
   	var instanceName = context.instanceName;
	var objectName = param.object;
	var externalReferences = context.externalReferences;
	
   	for (var i = 0; i < ep['Comments'].length; i++)
   	{
   		var comment = new Object();
   		comment.body = ep['Comments'][i]['Body'];
   		comment.createdTime = ep['Comments'][i]['CreatedTime'];
   		comments.push(comment);
   	}
   	lib.CaseExchange_CommonLib.commentsToActivityLog(comments, smRecord, context.direction, instanceName, objectName);
   	lib.CaseExchange_SAWUtil.linkSawImageToTickets(smRecord,ep,context,param);
   	
   	//smRecord.doSave();
}

function postPushing(mapObj, sm, ep, context, param){
	var smRecord = context.internalObject;
	var comment = {};
	
	if (sm['update.action'] != null)
	{
		comment.body = sm['update.action'];
		comment.createdTime = new Date();
		
		var comments = new Array();
		comments.push(comment);
		//insert comment to activity log
		var instanceName = context.instanceName;
		var objectName = param.object;
		var externalReferences = context.externalReferences;
		lib.CaseExchange_CommonLib.commentsToActivityLog(comments, smRecord, context.direction, instanceName, objectName);
		smRecord.doSave();
	}
}