/**
 * @fileOverview  Contains generic functions for the Survey Module
 * @author Jan Steube
 * @date March 2013
 */
 
var log = getLog("SurveyUtilities");

/**
 * @description  Filter recipients based on the definition of the survey
 * 
 * @param {object} string - the object the survey is for
 * @param {connectorId} string - The connector
 * @returns {Array of String}- the available recipients 
 */
function getAvailableRecipients(object, connectorId)
{
	var fRecipient 	= new SCFile("SurveyRecipientMapping", SCFILE_READONLY);
	fRecipient.setFields(['parameter','label']);
	var query 		= "active=true and connectorId=\""+connectorId+"\" and module=\""+object+"\"";
	var rc 			= fRecipient.doSelect(query);	
	var parameterList = [];
	var recipientsList = [];
	
	if (rc==RC_SUCCESS) {
	
		do {
			parameterList.push(fRecipient.parameter);
			recipientsList.push(fRecipient.label);		
			var rcNext = fRecipient.getNext();
		
		} while (rcNext==RC_SUCCESS);
	}	
	
	return [parameterList, recipientsList];
}


/** 
*     Get the primary key of a specified file.
*
*     @param {string} fileName - The file name
*     @returns {Array of string} The primay key
*/
function getFileUniqueKey(fileName)
{
  return lib.dbdictHelper.getUniqueKey(fileName);
}

/**
*  This function gets the field names from the dbdicts available in the survey mapping.
*  It returns the dbdict field names for the given tableBame

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{string} 	- the table name
*  @returns {array} 	- the field names
*/
function getFieldData(tableName)
{
	return lib.GetFieldNames.getFieldData(tableName);
}

/**
*  This function gets the caption names from the dbdicts field names.

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{array of string} 	- the field names
*  @param 	{string} 			- the table name
*  @returns {array} 			- the caption names
*/
function getFieldCaptions(fields, tableName)
{
	 return lib.convertToCaptions.getFieldCaptions(fields, tableName);
}

/**
 evaluate condition
 
 @param {String} exp - expression
 @param {file} record - file
 
 @return true/false
*/
function evaluateExpression(exp, record) {
	//backup the original variables
	funcs.parse_evaluate("$L.file.backup = $L.file",11);
	vars.$L_file = record;
	exp = funcs.str(exp);
	exp =exp.replace(new RegExp('\"', 'g'), '\\"');
	var script=" $L.result=evaluate(parse(\""+exp+"\", 2))";
	funcs.parse_evaluate(script, 11);
	
	//restore the original variables
	vars.$L_file = vars.$L_file_backup;
	
	return vars.$L_result;
}

function getSortFields(sortArr) {
	// set sorting according to configuration
	var lng = funcs.lng( funcs.denull(sortArr));
	if ( lng == null ) {
		lng = 0;
	}
	
	var sortFields = [];
	var sortTypes = [];
	var k;
	for (k = 0; k < lng; k++) {
		var sortby = sortArr[k];
		
        if (sortby.sortFieldName == null) {           
            break;
        }
        
		var list = sortby.sortFieldName.split(";");
		var fieldName = list[list.length-1];
		
		sortFields.push(fieldName);
		if (sortby.sortType == "ascending") {
			sortTypes.push(SCFILE_ASC);
		}
		else if (sortby.sortType == "descending") {
			sortTypes.push(SCFILE_DSC);
		}
	}

	return [sortFields, sortTypes];
}


function genURL( record, logger ){

    var url = {"web":"", "ess":""};

    var record_query = "";
    var record_title = "";
    var record_id = "";
    var datadict = new SCFile("datadict");
    var joindef = new SCFile("joindefs", SCFILE_READONLY);
    joindef.setFields("join.tables");
    var file_name = funcs.filename(record);
    var record_name = funcs.scmsg(file_name,"tablename");
    var keys = null;

    var join_sql = "join.name=\"" + file_name + "\"";

    if( joindef.doSelect(join_sql) == RC_SUCCESS ) {
        file_name = joindef.join_tables[0].table_name;
    }

    if( datadict.doSelect("name=\"" + file_name + "\"") == RC_SUCCESS ) {
        keys = datadict.unique_key;
    }
    else {
        logger.error("suveyLib","Error: Can not open Data Policy for file " + file_name);
        return url;
    }

    // get record query and record title

    record_id = record[keys[0]];
    record_query = keys[0] + "=\"" + record[keys[0]] + "\"";

    var i;
    var length = keys.length(); 
    for(i=1; i<length; i++){

        record_id = record_id + ";" + record[keys[i]];
        record_query = record_query + " and " + keys[i] + "=\"" + record[keys[i]] + "\"";
    }

    record_title = record_name+" "+record_id;

    url.web = lib.urlCreator.getURLFromQuery(file_name,record_query,record_title);
    url.ess = lib.urlCreator.getESSURLFromQuery(file_name,record_query,record_title);

    return url;
}

/**
*  This function returns the first phase of an workflow in process designer
*
*  	History:
*	2012-12-06, Jan Steube - function created
*	
*  @param 	{string} 	workflow 	- the name of the workflow
*  @return  {string} 	phase		- the name of the first phase of the workflow
*/
function getFirstWorkflowPhase(workflow)
{
	var fWorkflow 	= new SCFile( "Workflow", SCFILE_READONLY);
    var rc 			= "";
    var query 		= "name=\""+workflow+"\"";
    try {
        	fWorkflow.setFields(['firstPhase']);
        	rc = fWorkflow.doSelect( query );
        	if( rc == RC_SUCCESS ) {
           		return fWorkflow.firstPhase;
        	}
    }
    catch( ex ) {
        log.error( "exception: " + ex );
    }
    return "";
}

/**
*  This function validates if the optional parameters from the survey record
*  are already used in the preconfigured parameters.
*
*  	History:
*	2013-05-02, Jan Steube - function created
*	
*  @param 	{file} 		record 		- the survey record
*  @return  {boolean} 	true, false	- true= validation passed, false= validation failed
*/
function validateParameters(record)
{
	var arrPreconfParams 	= [];
	var fPreconfParams		= new SCFile("SurveyParameterMapping",SCFILE_READONLY);
	var query				= "active=true and connectorId=\""+record.connectorId+"\" and module=\""+record.tableName+"\"";
	fPreconfParams.setFields(['parameter']);
	
	var rc 					= fPreconfParams.doSelect(query);	
	if (rc==RC_SUCCESS) {
		do {
			arrPreconfParams.push(fPreconfParams.parameter);
			var rcNext = fPreconfParams.getNext();
		
		} while (rcNext==RC_SUCCESS);
	}	

	var a;	
	var lng =  funcs.lng( funcs.denull(record.optionalParameters));
	
	for (a=0;a<lng;a++) {
	
		if (funcs.index(record.optionalParameters[a].parameter, arrPreconfParams)>0) {
			return record.optionalParameters[a].parameter;
		}
	}
	
	return "##passed##";	
}

/**
*  This function ensures that each optional parameter has an associated field name and that 
*  no values are duplicated
*
*  	History:
*	2013-05-02, Jan Steube - function created
*	
*  @param 	{file} 		record 		- the survey record
*  @return  {boolean} 	true, false	- true= validation passed, false= validation failed
*/
function validateParameterArray(record)
{
	var parameters= [];

	var a;	
	var lng =  funcs.lng( funcs.denull(record.optionalParameters));
	
	for (a=0;a<lng;a++) {
	
		parameters.push(record.optionalParameters[a].parameter);
	
		if (record.optionalParameters[a].parameter == null && record.optionalParameters[a].fieldname!=null){
			return funcs.str(a+1);
		}
		
		if (record.optionalParameters[a].parameter != null && record.optionalParameters[a].fieldname==null){
			return funcs.str(a+1);
		}
	}
	
	//check for duplicates
	var orglng 	= parameters.length;
	parameters 	= lib.ArrayUtil.removeDuplicateEmptyElement(parameters);
	var newlng 	= parameters.length;
	
	if (orglng != newlng) {
		return "##duplicates##";
	}
	
	return "##passed##";		
}

/**
* This function copies the translations for a survey
* <br>
* History:<br>
* 20130505 - Jan Steube Function created<br>
*
* @date     20130505
* @param   {String} sDefIdTarget -> the survey Id to copy the translations to
* @param   {String} sDefIdSource -> the survey Id to copy the translations from
* @returns {string} error / success
*/
function copyTranslations(sDefIdTarget, sDefIdSource)
{
	var fSurveyEmail	= new SCFile( "SurveyEmailLocalization");
	var sQuery 			= "surveyId=\"" + sDefIdSource + "\"";
	var rcSelect 		= fSurveyEmail.doSelect( sQuery );
	var ret;
	try {
		if( rcSelect == RC_SUCCESS ) {
			do {
	 			var fCopy = new SCFile("SurveyEmailLocalization");
     			funcs.fduplicate(fCopy, fSurveyEmail);
     	
     			var rc;
     			var scNumber = new SCDatum();
	 			funcs.rtecall("getnumber", rc, scNumber, "SurveyEmailLocalization");
	 	
	 			fCopy.id 		= scNumber.getText();
	 			fCopy.surveyId	= sDefIdTarget;
	 			var rcInsert	= fCopy.doSave();
	 			var rcNext 		= fSurveyEmail.getNext();	
	 	
			} while (rcNext==RC_SUCCESS);
		}
	}
    catch( ex ) {
        log.error( "exception: " + ex );
    }
}

/**
* This concatenated the predefined  filter query with the additional filter
* <br>
* History:<br>
* 20130505 - Jan Steube Function created<br>
*
* @date     20130505
* @param   {record} survey -> the survey record
* @returns {string} query -> the concatenated query
*/
function buildConcatenatedQuery(record)
{
	//get Inbox query
	var prequery = "";
	if (record.predefinedFilterId != null) {
		var inbox = new SCFile("inbox", SCFILE_READONLY);
		inbox.setFields(['short.query']);
		var result = inbox.doSelect("inbox.id="+record.predefinedFilterId);
		if (result == RC_SUCCESS) {				
				// replace @surveyField@
				prequery = inbox["short.query"];
				if (record.lastProcessingTime == null) {
					record.lastProcessingTime = new Date(0);
				}
				prequery = replaceSurveyField(prequery, record);
		}
	}
	
	var hasInboxQuery=false;
	var hasAddFilter=false;
	var fullSQL=null;
	
	if (prequery != null && prequery != "" && prequery!="true") {
	    hasInboxQuery = true;
	}
	if (record.filterPlain != null && record.filterPlain!="" && record.filterPlain!="true") {
	    hasAddFilter=true;
	}

	if (hasInboxQuery && hasAddFilter) {
		fullSQL="("+prequery+") and ("+record.filterPlain+")";
	}

	if (hasInboxQuery && !hasAddFilter) {
		fullSQL=prequery;
	}
	
	if (!hasInboxQuery && hasAddFilter) {
		fullSQL=record.filterPlain;
	}
	
	if (!hasInboxQuery && !hasAddFilter) {
		fullSQL="true";
	}

	var relatedQuery=lib.viewFunctions.isRelatedObjectQuery(fullSQL);
	
	if (relatedQuery=="true") {
		var filename=record.tableName;
  		var filelist= new SCDatum();
  		filelist.setType(8);
  		filelist.push(filename+";*");
  		var retQuery=funcs.generate_sql_query(filelist, fullSQL, filename);
  		fullSQL = retQuery;
	}
	return fullSQL;
}

/**
* replace the survey field placeholder with survey value
* <br>
* History:<br>
* 20130514 - Tian Scott Function created<br>
*
* @date     20130514
* @param   {string} exp -> query string
* @returns {record} surveyDefinition -> survey record
*/
function replaceSurveyField(exp, surveyDefinition) {
    var getSurveyField = function($1, field){
        var value = surveyDefinition[field];
        if(value == null)
        {
            return "NULL";
        }
        var fieldType = funcs.type(value);
        if (fieldType == 3) {
            return "'"+funcs.str(value)+"'";
        }
        else if (fieldType == 8) {
            return funcs.str(value);
        }
        else if (fieldType == 2) {
            return "\""+funcs.str(value)+"\"";
        }
        else if (fieldType == 1 || fieldType == 4) {
            return funcs.str(value);
        }
        else {
            return value;
        }   
    };
    return exp.replace(/@(([\w|\.])*)@/gi,getSurveyField);
}

  	
/**
* This counts the number of records the filter is returning
* <br>
* History:<br>
* 20130505 - Jan Steube Function created<br>
*
* @date     20130505
* @param   {record} survey -> the survey record
*/
function testFilter(record)
{
	var query 		= buildConcatenatedQuery(record);		
	var fFile 		= new SCFile(record.tableName, SCFILE_READONLY);
	
	var dStart		= Date.now();
	var rcSelect 	= fFile.doSelect(query);
	var nCount 		= 0;
	
	if (rcSelect == RC_SUCCESS) {
		do {
			nCount++;
			var rcNext = fFile.getNext();
		} while (rcNext == RC_SUCCESS);
	} 
	
	var dEnd = Date.now();
	var nDuration = Math.round((dEnd-dStart)/1000);
	
	var message;
	if (rcSelect == RC_SUCCESS) {
		message = funcs.scmsg("23","survey",[nCount, nDuration]);
	}
	else {
		message = funcs.scmsg("24","survey",[nDuration]);
	}
	
	lib.KMUtils.domessageBox(message);
}

/**
*  This function get some Approval Details for the timeperiod records.
*  It returns the content of the field passed as parameter
*
*  	History:
*	2013-05-13, Jan Steube - function created
*	
*  @param 	{string} 	Survey ID 		- the unique ID of the record
*  @param 	{string} 	fieldname 		- the content of the field to return
*  @returns {string} 	field content	- the content of the field
*/
function getApprovalDetails(surveyID, fieldname)
{
	var fApproval 	= new SCFile( "Approval", SCFILE_READONLY);
    var rc 			= "";
    var query 		= "unique.key=\""+surveyID+"\" and file.name=\"SurveyDefinition\"";
    try {
        	fApproval.setFields([fieldname]);
        	rc = fApproval.doSelect( query );
        	if( rc == RC_SUCCESS ) {
            	fieldname = fieldname.replace(/\./g, "_");
            	var retVal=fApproval[fieldname];
            	return retVal;
            }
    }
    catch( ex ) {
        log.error( "exception: " + ex );
    }
    return null;
}

/**
*  This function get Interactions contact or service recipient from a related related.
*  It returns the content of the field passed as parameter
*
*  	History:
*	2013-05-13, Jan Steube - function created
*	
*  @param 	{string} 	record ID 		- the record related with the Interaction
*  @param 	{string} 	fieldname 		- the content of the field to return
*  @returns {list} 		list			- array of interactions name
*/
function getInteractionContact(recordId, fieldname)
{
	//first get related interaction ids
	
	var fFile 	= new SCFile("screlation", SCFILE_READONLY);
 	fFile.setFields(['depend']);
 	var query 	= "source=\""+recordId+"\" and source.filename=\"problem\" and depend.filename=\"incidents\"";
 	var rc		= fFile.doSelect(query);
 	
 	var interactions 	= [];
 	var contacts		= [];
 	
 	if (rc==RC_SUCCESS) {
 		do {
 			interactions.push(fFile.depend);
 			var rcNext = fFile.getNext();
 		
 		} while (rcNext == RC_SUCCESS);

 		var a; 		 		
 		for (a=0;a<interactions.length;a++) {
 		
 			var fInteraction = new SCFile("incidents", SCFILE_READONLY);
 			fInteraction.setFields([fieldname]);
 			query = "incident.id=\""+interactions[a]+"\"";
 			var rcInt = fInteraction.doSelect(query);
 			
 			if (rcInt == RC_SUCCESS) {
 				contacts.push(fInteraction[fieldname]);
 			}
 		}
 		
 		return contacts;
 	}
 	 	
 	return null;
}


/**
*  This function get Interactions contact or service recipient from a related related.
*  It returns the content of the field passed as parameter
*
*  	History:
*	2013-05-13, Jan Steube - function created
*	
*  @param 	{string} 	logicalName 	- the id of the Service / CI
*  @returns {string} 	owner			- owner name
*/
function getServiceContact(logicalName)
{
 	var fFile 	= new SCFile("device", SCFILE_READONLY);
 	fFile.setFields(['contact.name']);
 	var query 	= "logical.name=\""+logicalName+"\"";
 	var rc		= fFile.doSelect(query);
 	
 	if (rc==RC_SUCCESS)	{
 		return fFile.contact_name;
 	}
 
 	return null;
}

/**
*  This function gets the Service Subscribers.
*  It returns all subscribed contacts
*
*  	History:
*	2013-05-13, Jan Steube - function created
*	
*  @param 	{string} 	logicalName 	- the id of the Service
*  @returns {list} 		subscribers		- subscribers (contacts)
*/
function getServiceSubscribers(serviceName)
{
	var fFile = new SCFile("Subscription", SCFILE_READONLY);
	fFile.setFields(['subscriber']);
	var queryDept = "serviceName=\""+serviceName+"\" and subscriberType=\"dept\" and status=\"Active\"";
	var queryCont = "serviceName=\""+serviceName+"\" and subscriberType=\"contacts\" and status=\"Active\"";

	var contacts = [];

	//get contacts
	var rcNex;
	
	var rcCont = fFile.doSelect(queryCont);
	if (rcCont == RC_SUCCESS) {
	
		do {
			contacts.push(fFile.subscriber);
			rcNext = fFile.getNext();
		} while (rcNext == RC_SUCCESS);
	}
	
	//get depts
	var depts = [];
	var rcDept = fFile.doSelect(queryDept);
	
	if (rcDept == RC_SUCCESS) {
	
		do {
			depts.push(fFile.subscriber);
			rcNext = fFile.getNext();
		} while (rcNext == RC_SUCCESS);
	
		// get contacts from depts
	
		var fContacts = new SCFile("contacts", SCFILE_READONLY);
		fContacts.setFields(['contact.name']);

		var a;	
		for (a = 0; a<depts.length; a++) {
			var query="dept=\""+depts[a]+"\"";
			var rcCont2 = fContacts.doSelect(query);
		
			if (rcCont2==RC_SUCCESS) {
				do {
					contacts.push(fContacts.contact_name);
					var rcNext = fContacts.getNext();
				} while (rcNext == RC_SUCCESS);
			}
		}
	}
	
	if (contacts.length>0) {
		contacts=lib.ArrayUtil.removeDuplicateEmptyElement(contacts);
		return contacts;
	} else {
		return null;
	}
}

/**
*  This function verifies whether the predefined filter is in SM syntax. SELECT statements are not supported.
*
*  	History:
*	2013-05-28, Jan Steube - function created
*	
*  @param 	{string} 	query 	- the query to validate
*  @returns {boolean} 			- true query is valid, false query is invalid
*/
function validatePredefinedFilter(query)
{
	var prequeryBackup = query.toUpperCase();
	if (prequeryBackup.indexOf("SELECT")==0) {
		var message = funcs.scmsg("28","survey");
		var rc;
    	funcs.rtecall("msg", rc, message, 2);
		return false;
	}
	return true;		
}

/**
*  This function to get all fields name of a give table
*
*  @param 	{string} 	filename 	- the table name
*  @returns {Array of String} 		- a array contains all the fields name
*/
function getAllFields(filename) {
    var datadict = new SCFile("datadict");
    var rc = datadict.doSelect("name=\"" + filename + "\"");
    if (rc != RC_SUCCESS) {
        throw ("The record \"datadict(name=" + filename +")\" could not be found.");
    }

    var fields = datadict.fields;    
    var fieldArray = [];
    var i;
    var length = fields.length();
    for (i = 0; i < length; i++) {
        if (fields[i]) {
            fieldArray.push(fields[i]);
        }
    }
    return fieldArray;
}