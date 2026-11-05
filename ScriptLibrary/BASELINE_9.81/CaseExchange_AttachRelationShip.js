/****************************************************************************************
*Auther: Zhichao Fei
*Create Date: 20140227
*Function: Provide a series Apis to manipulate the attachment relationship between SM and End Point.
*         Including estabilishing, update and delete
*         It includes below key Logical:
* 1.Estabilish the attachment relationship between SM and end point.
* 2.Update attachment relationship using internal id
* 3.Update attachment relationship using external id
* 4.Reset the delete flag when an attachment erased in SM or EP.
*
*****************************************************************************************/
var logger = getLog("CaseExchange_AttachRelationShip");

 /**
 * Create the attachment relationship relcords.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */

function createAttachRelationShip(attachRelation)
{
	if (attachRelation != null)
	{
		var relationShip = new SCFile('AttachmentRelationship');
		relationShip.id = getNextId();
		var field;
		for (field in attachRelation)
		{
			relationShip[field] = attachRelation[field];
		
		}
		relationShip.doInsert();
	}
}

/**
*	Get id from number table. class is AttachmentRelationship
*
*	@return the autoincreased number define in number
*	@type - character
**/
function getNextId() {
	var newId = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall("getnumber", rcode , newId, "AttachmentRelationship");
	return newId.getText();
}

 /**
 * Function: Distinguish which attachments are new in end point.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {externalid} - external id in SMISTaskQueue
 *  @param {epattachidList} - An array which contain CEAttachmentInfo object.
 *  @param {epCreatedAttachs} - An array which contain CEAttachmentInfo object.
 */
function getEPCreatedAttachmentIds(externalid,epattachidList,instanceID)
{
	var epCreatedAttachs = [];

	var sql = "externalid=\""+externalid+"\" and smisInstanceId=\""+instanceID+"\"";
	var attRelation = new SCFile("AttachmentRelationship", SCFILE_READONLY);
	attRelation.setFields(["epattachid"]);
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{	
		var i;
		for (i = 0; i < epattachidList.length;i++)
		{
			attRelation.getFirst();
			var isNew = true;
			do
			{
				var attarchId = epattachidList[i]['id'];
				if (attarchId == attRelation.epattachid)
				{
					isNew = false;
					break;
				}
			}while(attRelation.getNext() == RC_SUCCESS);
			if (isNew)
			{
				epCreatedAttachs.push(epattachidList[i]);//This attachment is new.
			}
		}
	}
	else
	{
		epCreatedAttachs = epattachidList;
	}
	logger.info(epCreatedAttachs.length+" attachments will created!");	
	return epCreatedAttachs;
}

 /**
 * Function: Distinguish which attachments are new.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */
function getSMCreatedAttachmentIds(internalid,smattachidList,instanceID)
{
	var smCreatedAttachs = [];
	var sql = "internalid=\""+internalid+"\" and smisInstanceId=\""+instanceID+"\"";
	var attRelation = new SCFile("AttachmentRelationship", SCFILE_READONLY);
	attRelation.setFields(["smattachid"]);
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{
		var i;
		for (i = 0; i < smattachidList.length;i++)
		{
			attRelation.getFirst();
			var isNew = true;
			do
			{
				var attachObj = smattachidList[i];
				var smAttachId = attachObj.href;
				if (smAttachId == attRelation.smattachid)
				{
					isNew = false;
					break;
				}
			}while(attRelation.getNext() == RC_SUCCESS);
			if (isNew)
			{
				smCreatedAttachs.push(smattachidList[i]);//This attachment is new.
			}
		}
	}
	else
	{
		smCreatedAttachs = smattachidList;
	}
	return smCreatedAttachs;
}

 /**
 * Function: Mark attachments has been removed by EP User
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */
function markAttachRemovedByEP(externalid,epattachidList,instanceID)
{
	var sql = "externalid=\""+externalid+"\" and smisInstanceId=\""+instanceID+"\"";
	var attRelation = new SCFile("AttachmentRelationship");
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{
		//EP User has removed all attachments.
		if (epattachidList == null || epattachidList.length == 0)
		{
			do
			{
				if (attRelation.removedinsm)
				{
					attRelation.doDelete();
				}
				else
				{
					attRelation.removedinep = true;//Mark the attachment has removed by EP user.
					attRelation.doUpdate();
				}
			}while(attRelation.getNext() == RC_SUCCESS);
		}
		//EP user may removed some one attachemt.
		else
		{
			do
			{
				var isRemoved = true;
				var i;
				for (i = 0; i < epattachidList.length;i++)
				{
					var attachmentId = epattachidList[i]['id'];
					if (attachmentId == attRelation.epattachid)
					{
						isRemoved = false;
					}	
				}
				if (isRemoved)
				{
					if (attRelation.removedinsm)
					{
						attRelation.doDelete();
					}
					else
					{
						attRelation.removedinep = true;//Mark the attachment has removed by EP user.
						attRelation.doUpdate();
					}
				}
				
			}while(attRelation.getNext() == RC_SUCCESS);
		}
	}
}

 /**
 * Function: Mark attachments has been removed by SM User
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */
function markAttachRemovedBySM(internalid,smattachidList,instanceID)
{
	var sql = "internalid=\""+internalid+"\" and smisInstanceId=\""+instanceID+"\"";
	var attRelation = new SCFile("AttachmentRelationship");
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{
		//SM User has removed all attachments.
		if (smattachidList == null || smattachidList.length == 0)
		{
			do
			{
				if (attRelation.removedinep)
				{
					attRelation.doDelete();
				}
				else
				{
					attRelation.removedinsm = true;//Mark the attachment has removed by EP user.
					attRelation.doUpdate();		
				}
				
			}while(attRelation.getNext() == RC_SUCCESS);
		}
		//SM user may removed some one attachemt.
		else
		{
			do
			{
				var isRemoved = true;
				var i;
				for (i = 0; i < smattachidList.length;i++)
				{
					var attachObj = smattachidList[i];
					var smAttachId = attachObj.href;
					
					
					if (smAttachId == attRelation.smattachid)
					{
						isRemoved = false;
					}	
				}
				if (isRemoved)
				{
					if (attRelation.removedinep)
					{
						attRelation.doDelete();
					}
					else
					{
						attRelation.removedinsm = true;
						attRelation.doUpdate();
					}
				}
				
			}while(attRelation.getNext() == RC_SUCCESS);
		}
	}
}

 /**
 * Function:Update the task attachment id to incident attachment id.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */
function updateAttachRelationBySMAttachID(externalid,internalid,taskattachid,incidentAttachid)
{
	var sql = "externalid=\""+externalid+"\" and smattachid=\""+taskattachid+"\"";
	var attRelation = new SCFile("AttachmentRelationship");
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{
		attRelation.smattachid = incidentAttachid;
		attRelation.internalid = internalid;
		attRelation.doUpdate();
	}
}

 /**
 * Function:Update the task attachment id to incident attachment id.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {attachRelation} - Attachment Relationship Reocrd
 *
 */
function updateAttachRelationByEPAttachID(internalid,externalid,taskattachid,epIncAttachid)
{
	var sql = "internalid=\""+internalid+"\" and epattachid=\""+taskattachid+"\"";
	var attRelation = new SCFile("AttachmentRelationship");
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{
		attRelation.epattachid = epIncAttachid;
		attRelation.externalid = externalid;
		attRelation.doUpdate();
	}
}

 /**
 * Function: Remove the attachment relationship when transport attachment failed.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140603
 * @param {ticketid} - internalid or externalid
 * @param {attachmentit} - internal attachment id or external attachment id
 * @param {instanceID} - SMIS instance id
 * @return {isSuccess}  Success/Failure
 *
 */
function removeAttachRelation(ticketid,attachmentid,instanceID,direction)
{
	var isSuccess = false;
	var sql = "";
	
	if (direction)              
	{
		sql = "internalid=\""+ticketid+"\" and epattachid=\""+attachmentid+"\" and smisInstanceId=\""+instanceID+"\"";
	}
	else
	{
		sql = "externalid=\""+ticketid+"\" and smattachid=\""+attachmentid+"\" and smisInstanceId=\""+instanceID+"\"";
	}
	var attRelation = new SCFile("AttachmentRelationship");
	var ret = attRelation.doSelect(sql);
	if (ret == RC_SUCCESS)
	{
		attRelation.doDelete();
		isSuccess = true;
	}
	return isSuccess;
}
