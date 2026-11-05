/**
 * @fileOverview  Contains the fucntions of survey history
 * @author Jianxin Zheng
 * @date April 2013
 */


/**
 * @public
 * @description  Write the survey send logs for each survey task
 * @param {Object} task - The survey task object
 * @return NULL
 */
function writeSurveySendLogs(task)
{
	var surveyId = task.inRecord.surveyId;
	var ticketId = task.inRecord.ticketId;
	var sendDate = new Date();
	
	var recipients = task.inRecord.recipients;	
	if(recipients != null)
	{		
		var length = recipients.length;
		for (var i = 0; i < length; i++) {
			var recipient = recipients[i].email;
			if(recipient != null){
				writeSurveySendLog(surveyId, ticketId, recipient, sendDate)
			}
		}
	}
}


/**
 * @public
 * @description  Write the survey send log which is to a keep the survey send information for each recipient
 * @param {String} surveyId - The survey id
 * @param {String} ticketId - The ticket id 
 * @param {String} recipient - The receipient
 * @param {SM Date} sendDate - The send Date, optional, if this parameter is not passed, use the current date. 
 * @returns {String} The id the survey send log
 */
function writeSurveySendLog(surveyId, ticketId, recipient, sendDate)
{
	lib.Survey_Logger.getLogger().debug("Survey_History", "write survey send log, surveyId:" +surveyId + ",ticketId:" +ticketId + ",recipient:" + recipient);	
	var filename = "SurveySendLog";
	var surveySendLog = new SCFile(filename);
	surveySendLog.id= getUniqueNumber(filename)
	surveySendLog.surveyId=surveyId;
	surveySendLog.ticketId=ticketId;
	surveySendLog.recipient=recipient;
	if(sendDate == null)
	{
		sendDate = new Date();
	}
	surveySendLog.sendDate=sendDate;
	surveySendLog.doInsert();
	return surveySendLog.id;
}

/**
 * @public
 * @description  Write the survey send history which is to keep the survey send information for each survey defintion
 * @param {String} surveyId - The survey id
 * @param {String} status - The status of survey sending
 * @param {Object} surveyData - The survey data get from task producer
 * @param {SM Date} sendDate - The send Date, optional, if this parameter is not passed, use the current date.  
 * @returns {String} The id the survey send history
 */
function writeSurveySendHistory(surveyId, status, surveyData, sendDate)
{
	var filename = "SurveySendHistory";
	var surveySendHistory = new SCFile(filename);
	surveySendHistory.id= getUniqueNumber(filename)
	surveySendHistory.surveyId=surveyId;
	surveySendHistory.status=status;
	if(sendDate == null)
	{
		sendDate = new Date();
	}
	surveySendHistory.sendDate=sendDate;
	surveySendHistory.information=surveyData;
	lib.Survey_Logger.getLogger().debug("Survey_History", "write survey send history, surveyId:" +surveyId + ",status:" +status + ",sendDate:" + sendDate);		
	surveySendHistory.doInsert();
	return surveySendHistory.id;
}


/**
 * @private
 * @description  Get a qnieue id from number record
 * @param {String} filename - The filename
 * @returns {String} The id t
 */
function getUniqueNumber(filename)
{
	var rc, scNumber = new SCDatum;
	system.functions.rtecall("getnumber", rc, scNumber, filename);
	return scNumber.getText();
}

/**
 * @private
 * @description  Get the information from the survey data
 * @param {Object} surveyData - The survey data
 * @returns {String} The information
 */
function getInformationFromSruveyData(surveyData)
{

	var ret = "";
	if(surveyData != null)
	{
		for(var i = 0; i < surveyData.length; i++)
		{
			var ticketId = surveyData[i].ticketId;
			var recipients = surveyData[i].recipients;
			for(var j=0; j < recipients.length; j++)
			{
				var recipient = recipients[j];
				ret +=  ticketId + " - " + recipient.name + " - " + recipient.email + "\n";	
			}		
		}
	}
	return ret;
}






