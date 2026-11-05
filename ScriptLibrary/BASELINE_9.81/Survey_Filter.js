/**
 * @fileOverview  Proivde the functionality of filtering the recipients
 * @author Jianxin Zheng
 * @date March 2013
 */



/**
 * @public
 * @description  Filter recipients based on the definition of the survey
 * @param {Array of String} recipientList - A list of recipients
 * @param {record} surveyRecord - The survey definition record
 * @returns {Array of String} The list of recipients after filtering 
 */
function filterRecipients(recipientList, surveyRecord)
{
	//filter for avoiding duplicated recipient
	if(surveyRecord.avoidDuplicate)
	{
		recipientList = filterRecipientsAvoidDuplicate(recipientList);
	}
	//filter for no disturb in a time period
	if(surveyRecord.noDisturb)
	{
		recipientList = filterRecipientsForNoDisturb(surveyRecord.id, recipientList, surveyRecord.noDisturbDuration);
	}
	//filter for random selection of a percetange recipients
	if(surveyRecord.randomSelection)
	{
		recipientList = filterRecipientsForRandomSelection(recipientList, surveyRecord.randomSelectionPercentage);		
	}
	return recipientList;
}

/**
 * @private
 * @description  Filter the recipients for avoiding duplicated recipient
 * @param {Array of String} recipientList - A list of recipients
 * @returns {Array of String} The list of recipients 
 */
function filterRecipientsAvoidDuplicate(recipientList)
{
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "filter duplicated from:" + recipientList.length);			
	return lib.ArrayUtil.removeDuplicateEmptyElement(recipientList);
}



/**
 * @private
 * @description  Filter the recipients for the no disturb function
 * @param {String} surveyId - The survey Id
 * @param {Array of String} recipientList - A list of recipients
 * @param {number} noDisturbDuration - The duration of no disturb, measured in days
 * @returns {Array of String} The list of recipients 
 */
function filterRecipientsForNoDisturb(surveyId, recipientList, noDisturbDuration)
{
	var ret = new Array();
	var length = recipientList.length;
	for(var i=0; i < length; i ++)
	{
		var recipient = recipientList[i];
		if(!isSentRecently(surveyId, recipient, noDisturbDuration))
		{
			ret.push(recipient);		
		}
	}
	return ret;
}



/**
 * @private
 * @description  Check whether a survey is already sent to a recipient recently
 * @param {String} surveyId - The survey Id
 * @param {String} recipient - The recipient
 * @param {number} duration - The duration to query, measured by days
 * @returns {Boolean} 
*/
function isSentRecently(surveyId, recipient, duration)
{
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "check recently sent for survey:" + surveyId + ", recipient:" + recipient + ", duration:" + duration);			
	var surveySendLog = new SCFile("SurveySendLog", SCFILE_READONLY);
	surveySendLog.setFields(["id"]);
	
	var query = "surveyId=\"" + surveyId + "\" and recipient=\"" + recipient + "\"";
	
	var sendDate = new XMLDate(new Date(new Date().getTime() - duration*86400000)).getSCDateTimeString();
	query += " and sendDate>='" + sendDate + "'";	
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "query string:" + query);	
	if(surveySendLog.doSelect(query) == RC_SUCCESS)
	{
		lib.Survey_Logger.getLogger().debug("Survey_Filter", "recently sent log found:" + surveySendLog.id);		
		return true;
	}
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "no recently sent log found");		
	return false;
}




/**
 * @private
 * @description Randmomly select the recipients 
 * @param {Array of String} recipientList - A list of recipients
 * @param {number} percentage - The percentage of recipients to be selected
 * @returns {Array of String} The list of recipients
 */
function filterRecipientsForRandomSelection(recipientList, percentage)
{
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "randmon selection percentage:" + percentage)	;
	var length = recipientList.length;
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "randmon selection total count:" + length);	
	var selected = Math.ceil(length * percentage/100);
	lib.Survey_Logger.getLogger().debug("Survey_Filter", "randmon selection selected count:" + selected);	
	//If the selected count is <= 0 or >= original length, do not filter. in case percentage is not in 0 ~ 100.
	if(length > 0 && selected >= 0 && selected < length)
	{
		var count =0 ;
		var ret = new Array();
		var indexArray = new Array();
		while (count < selected)
		{
			var index = Math.floor(Math.random()*length)
			if(!lib.ArrayUtil.contains(indexArray, index))
			{
				lib.Survey_Logger.getLogger().debug("Survey_Filter", "randmon selection choose index:" + index);	
				indexArray.push(index);
				ret.push(recipientList[index]);
				count++;		
			}		
		}
		return ret;	
	}
	lib.Survey_Logger.getLogger().warn("Survey_Filter", "random selection percentage has no sence:" + percentage);	
	return recipientList;
}




