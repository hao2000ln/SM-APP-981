/**
* @fileoverview  Handles functionality associated with timeperiodDefinitions.
* @author Jan Steube
* @date November 2012
*/
// -- logger ------------------------
//
var log = getLog("timeperiod");

/**
*  This function get the Timeperiod Settings for Sort Order or Group By configuration.
*  It returns the configured field names from the setting file to the RAD application tp.new, panel create.final.category.sql
*
*  	History:
*	2012-11-20, Jan Steube - function created
*	
*  @param 	{string} 	setting ID 	- the setting id of the required property in the settings file
*  @returns {array} 	fields		- the identified fields
*/
function getTimePeriodCategoryFields(settingID) 
{
	var fields = [];
	var fieldString = lib.settings.getSettingValue( "Timeperiod", settingID );
	if ( fieldString == null || fieldString == "" ) {
		return fields;
	}
	fields = fieldString.split(",");
	var i;
	for ( i = 0; i < fields.length; i++ ) {	
    	fields[i] = fields[i].replace(/^\s*/, '').replace(/\s*$/, ''); 
	}

	return fields;
}

/**
*  This function returns a query containing ONLY the valid TP categories for the user logged on.
*
*  	History:
*	2012-11-20, Jan Steube - function created
*	
*   @returns {string} 	query - the calculated query
*/
function getCategoryQuery() {
	
	var allowedCats	= allowedCategories();
		
		if (allowedCats.length>0) {
			catSql=" name isin "+funcs.str(allowedCats);
			return catSql;
		}
		
	return "false";	
}


/**
*  This function returns all categories the user is allowed use.
*
*  	History:
*	2012-11-20, Jan Steube - function created
*	
*   @returns {array} 	allowedCats - the allowed categories
*/
function allowedCategories()
{
	var allowedCats 	= [];
	var catInitSql		= "active=true";
	var catRights		= lib.security.getToken("Timeperiod", "allowedCategory");
	
	if (typeof catRights != 'object') {
		catRights = [];
	} else {
    catRights = catRights.toArray();
	}
	
	if ( catRights != null && catRights != "" ) {
		if (catRights.length>0) {
			catInitSql+=" and name isin "+funcs.str(catRights);
		}
	} 
	
	var fTPcat = new SCFile("timeperiodCategory", SCFILE_READONLY);	
	var rcQuery = fTPcat.doSelect(catInitSql);
	if (rcQuery == RC_SUCCESS) 	{
		vars.$L_file_backup = vars.$L_file;
		try {			
			do 	{
				var cond = funcs.nullsub(fTPcat.usageCondition, true);
				vars.$L_file=fTPcat;
				if (funcs.parse_evaluate(funcs.str(cond),4)==true)
				{
					allowedCats.push(fTPcat.name);
				}

				var rcNext = fTPcat.getNext();
			} while (rcNext == RC_SUCCESS);
		}
		catch(exception) {
			log.error(exception.getMessage());
		}		
		vars.$L_file = vars.$L_file_backup;		
	}
	
	return allowedCats;
}

/**
*  This function get some Approval Details for the timeperiod records.
*  It returns the content of the field passed as parameter
*
*  	History:
*	2012-12-05, Jan Steube - function created
*	
*  @param 	{string} 	Timeperiod ID 	- the unique ID of the timeperiod record
*  @param 	{string} 	fieldname 		- the content of the field to return
*  @returns {string} 	field content	- the content of the field
*/
function getApprovalDetails(timeperiodID, fieldname)
{
	var fApproval 	= new SCFile( "Approval", SCFILE_READONLY);
    var rc 			= "";
    var query 		= "unique.key=\""+timeperiodID+"\" and file.name=\"timeperiodDefinition\"";
    if (fieldname != null) {
        fApproval.setFields(fieldname);
    }
    
    try {
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
*  This function returns the workflow of the associated TP category
*
*  	History:
*	2012-12-06, Jan Steube - function created
*	
*   @param 	{string} 	category 	- the category name to get the workflow for
*	@return {string}	workflow	- the name of the workflow
*/
function getWorkflowOfCategory(category)
{
	var fCategory 	= new SCFile( "timeperiodCategory", SCFILE_READONLY);
    var rc 			= "";
    var query 		= "name=\""+category+"\"";
    try {
        fCategory.setFields(['workflow']);
        rc = fCategory.doSelect( query );
        if( rc == RC_SUCCESS ) {
           	return fCategory.workflow;
        }
    }
    catch( ex ) {
        log.error( "exception: " + ex );
    }
    return "";
}

/**
*  This function shows and filters the occurences for a timeperiodDefinition in HTML view
*
*      History:
*      2012-12-11, Jan Steube - function created
*
*  @param    {File}     fRecord 	- the timeperiod definition
*  @param    {Boolean}  bEditable 	- update rights, typically $L.tableAccess.update
*
*  @returns {String}   sHtmlReturn - the HTML String for occurrences
*
*  @example Called by: DisplayScreen timeperiodDefinition.new, timeperiodDefinition.view
*      
*/
function getOccurrencesDetails(fRecord, bEditRights) {

       // set filter criterias
       var sQueryTmp	=	setFilter();
       
       //initialize variables
	   var dDate = new XMLDate(new Date());
 		   dDate = dDate.getSCDateTimeString();
 	   
 	   var iTreshold 	= funcs.nullsub(lib.settings.getSettingValue( "Timeperiod", "nbOccurrencesDisplay" ),50);
	   iTreshold 		= funcs.val(iTreshold,1);
 	   var iCounter 	= 1;
 	   var iOccCount 	= 0;
       var sCR 			= "\n";
       //var iLineCount 	= 0;
       var sHtmlReturn 	= lib.timeperiodCSS.getCSS();
       
       //initialise occurrences file
	   var fTimePeriodOccurrence = new SCFile( "timeperiodOccurrence", SCFILE_READONLY);
       var sQuery 		= "definition.id=\"" + fRecord.id + "\"";
       
        if (sQueryTmp) {
			sQuery += sQueryTmp;
		}
       
       // count occurrences first
       iOccCount 	= fTimePeriodOccurrence.doCount(sQuery);
	     
	   //prepare HTML view 	  
       sHtmlReturn += "<table class=\"TableResults\" width=\"100%\">" + sCR;
       var sAction = "";
       
        // if treshold is reached 
        // - add the start date to the query
        // - add message on top of the HTML view to inform the user that not all occurrences are displayed
       if (iOccCount>iTreshold) {
	       		sQuery += " and start.date>'"+dDate+"'";
	       		sHtmlReturn += "<tr><td class=\"message\" colspan=\"6\"><b>" + funcs.scmsg("13a", "timeperiod") + "</b></td></tr>" + sCR;
	   }
	   
	    // additional message for copy mode on top of HTML table
       var copyMode = funcs.nullsub(vars.$copyMode, false); 
       if (copyMode) {
       		var sCopyOption	= lib.settings.getSettingValue( "Timeperiod", "copyOptions" );
			// if copy option is invalid or customer decided to not copy rules and occurrences, then return without doing something
			if (sCopyOption =="rulesAndOccurrences") {
				sHtmlReturn += "<tr><td class=\"message\" colspan=\"7\"><b>" + funcs.scmsg("37", "timeperiod" ,["Occurrences"]) + "</b></td></tr>" + sCR;
			}
	   }
              
       // Table header          
       sHtmlReturn += "<tr><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + 	funcs.scmsg(17, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" +  // Rule ID
       								funcs.scmsg(25, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" +  // Start Date
       								funcs.scmsg(26, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" +  // End Date
       								funcs.scmsg("26a", "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" +  // Time Zone
       								funcs.scmsg(27, "timeperiod") + "</span></div></div></th>";   	  // active

       	//show the activate column only in the first phase or when record is pending approval
       	var bFirstPhase = getFirstWorkflowPhase(vars.$L_wfPhase.workflowName)==fRecord.current_phase;
       	
       	//check if the current user is able to approve
       	var bCanApprove = hasApprovalRights(fRecord, bEditRights);
       	
       	if (bFirstPhase || fRecord.approval_status=="pending") {
       		sHtmlReturn += "<th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + funcs.scmsg(28, "timeperiod") + "</span></div></div></th></tr>";  // Activate after approval column
       	}
       	else {
       		sHtmlReturn += "</th></tr>"; // closing tag for header
       	}

       fTimePeriodOccurrence.setFields(['definition.id', 'rule.id', 'start.date', 'end.date', 'timezone', 'active','keep.active']);
       fTimePeriodOccurrence.setOrderBy(['start.date'], [SCFILE_ASC]);
       var rc = fTimePeriodOccurrence.doSelect( sQuery );
       if( rc == RC_SUCCESS ) {
            while (getLastRC() == RC_SUCCESS && iCounter<=iTreshold) {
                    
                    // build HTML
                    var sRowClass = "TableCellResults";//iLineCount%2==0 ? "TableCellResults" : "oddRow";//evenRow->TableCellResults
                    iCounter++; 	// counter for treshold     				                   
                    //iLineCount++;  // counter for even / odd row
                    sHtmlReturn += "<tr class=\"TableNormalRow\">";                 	
                    sHtmlReturn += "<td class=\""+sRowClass+"\" ><div><a class=\"shadowFocus\" tabindex=\"0\" href=\"scactivelink://timeperiodRule:" + codeLink("id=&quot;" + fTimePeriodOccurrence.rule_id + "&quot;", "en") + "\"><div class=\"Text FormatTableElementReadonly\"><span class=\"xTableCell FormatTableElementReadonly\" style=\"text-decoration:underline;color:#0000FF;\">" + fTimePeriodOccurrence.rule_id + "</span></div></a></div></td>";
                    sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(fTimePeriodOccurrence.start_date) + "</span></div></div></td>";
                    sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(fTimePeriodOccurrence.end_date) + "</span></div></div></td>";
                    sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.nullsub(vars.$lo_time_zone, funcs.nullsub(fTimePeriodOccurrence.timezone, "")) + "</span></div></div></td>";                    
                    var display;
                    fTimePeriodOccurrence.active == true ? display=funcs.scmsg("11", "timeperiod") : display=funcs.scmsg("12", "timeperiod");
                    
                    //check if status column is editable
                    if (isStatusEditable(fRecord, bEditRights, fTimePeriodOccurrence, bFirstPhase, bCanApprove)) {              	
                        sHtmlReturn += "<td class=\""+sRowClass+"\" ><div><a class=\"shadowFocus\" tabindex=\"0\" href=\"scactivelink://activeflag:" + codeLink("id=&quot;" + fTimePeriodOccurrence.id + "&quot;", "en") + "\"><div class=\"Text FormatTableElementReadonly\"><span class=\"xTableCell FormatTableElementReadonly\" style=\"text-decoration:underline;color:#0000FF;\">" + funcs.str(display) + "</span></div></a></div></td>";
                    }
                    else {
                        sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(display) + "</span></div></div></td>";
                    }
                    
                    // display activate after approval column
                    if (bFirstPhase || fRecord.approval_status=="pending") {
                    	fTimePeriodOccurrence.keep_active == true ? display=funcs.scmsg("15", "timeperiod") : display=funcs.scmsg("16", "timeperiod");
                                                                      				
       					if (isKeepActiveEditable(fRecord, bEditRights, fTimePeriodOccurrence, bFirstPhase, bCanApprove)) {
                        	sHtmlReturn += "<td class=\""+sRowClass+"\" ><div><a class=\"shadowFocus\" tabindex=\"0\" href=\"scactivelink://keepactive:" + codeLink("id=&quot;" + fTimePeriodOccurrence.id + "&quot;", "en") + "\"><div class=\"Text FormatTableElementReadonly\"><span class=\"xTableCell FormatTableElementReadonly\" style=\"text-decoration:underline;color:#0000FF;\">" + funcs.str(display) + "</span></div></a></div></td>";
                    	}
                    	else {
       					sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(display) + "</span></div></div></td>";
       					}
       				}
                    
                    sHtmlReturn += "</tr>" + sCR;
                    rcNext = fTimePeriodOccurrence.getNext();
             } // while records
       } else {
             sHtmlReturn += "<tr><td class=\"evenRow\" colspan=\"6\">" + funcs.scmsg("13", "timeperiod") + "</td></tr>" + sCR;
       } // if record
       
       sHtmlReturn += "</table>" + sCR;

       return sHtmlReturn;
}

/**
*  This function sets the filter for the HTML view
*
*      History:
*      2013-02-03, Jan Steube - function created
*
*  @returns {String}   sQueryTmp - the filter query
*    
*/
function setFilter()
{
	var sQueryTmp="";
	if (vars.$tp_filter_rule !="" && vars.$tp_filter_rule != null) {
          sQueryTmp += " and rule.id like \"*" + vars.$tp_filter_rule + "*\"";
    }
    if (vars.$tp_filter_start !="" && vars.$tp_filter_start != null) {
          sQueryTmp += " and start.date>='" + vars.$tp_filter_start + "'";
    }
    if (vars.$tp_filter_end !="" && vars.$tp_filter_end != null) {
          sQueryTmp += " and end.date<='" + vars.$tp_filter_end + "'";
    }
    if (vars.$tp_filter_status != "" && vars.$tp_filter_status != null) {
          sQueryTmp += " and active=" + funcs.val(vars.$tp_filter_status,4);
    }
       
    if (vars.$tp_filter_keep_active != "" && vars.$tp_filter_keep_active != null) {
          sQueryTmp += " and keep.active=" + funcs.val(vars.$tp_filter_keep_active,4);
    }
    
    return sQueryTmp;
}

/**
*  This function verifies whether the status column is editable in the HTML vie
*
*      History:
*      2013-02-03, Jan Steube - function created
*
*  @param	{record}		fDefRecord	-  the current timeperiod record
*  @param	{boolean}		bEditRights	-  update rights to the timeperiod?	
*  @param	{record}		fOccRecord	-  the occurrence to evaluate	
*  @returns {boolean}   	true/false - editable / not editable
*    
*/
function isStatusEditable(fDefRecord, bEditRights, fOccRecord, bFirstPhase, bCanApprove)
{
	//status is not editable in first phase
	if (bFirstPhase) {
       	return false;
    }
    
    if (!fDefRecord.active) {
       	return false;
    }
    
    //if timeperiod is pensing approval dont allow changing the status
	if (fDefRecord.approval_status=="pending") {
		return false;
	}
    
    var now = funcs.tod();    
    //if start date and end date in the past, return false
    if (now>fOccRecord.start_date && now>fOccRecord.end_date) {
    	return false;
    }
	
	//if timeperiod is approved and the user has edit right he is able to "deactivate" occurrences
	if (bEditRights && fOccRecord.active==true && fDefRecord.approval_status!="pending") {
		return true;
	}

	if (bCanApprove) {
    	return true;
    }
			
	// otherwise return false
	return false;
}

/**
*  This function verifies whether the status column is editable in the HTML vie
*
*      History:
*      2013-02-03, Jan Steube - function created
*
*  @param	{record}		fDefRecord	-  the current timeperiod record
*  @param	{boolean}		bEditRights	-  update rights to the timeperiod?	
*  @param	{record}		fOccRecord	-  the occurrence to evaluate	
*  @returns {boolean}   	true/false - editable / not editable
*    
*/
function isKeepActiveEditable(fDefRecord, bEditRights, fOccRecord, bFirstPhase, bCanApprove)
{
	var now = funcs.tod();    
	
    //if start date and end date in the past, return false
    if (now>fOccRecord.start_date && now>fOccRecord.end_date) {
    	return false;
    }
	
	//user has edit right and timeperiod is in first phase then return true
	if (bEditRights && bFirstPhase) {
       		return true;
    }
    
    if (bCanApprove) {
    	return true;
    }
    
	// otherwise return false
	return false;
}

/**
*  This function verifies if the current user has approval rights for the current timeperiod
*  even if the approval phase has been passed.
*
*      History:
*      2013-02-03, Jan Steube - function created
*
*  @param	{record}		fDefRecord	-  the current timeperiod record
*  @param	{record}		fOccRecord	-  the occurrence to evaluate	
*  @returns {boolean}   	true/false - editable / not editable
*    
*/
function hasApprovalRights(fDefRecord, bEditRights)
{
	//if timeperiod is approved and users with "can approve" or 
	// "expert" rights are able to reactivate after approval	
	
	var sApprovalRights		= funcs.nullsub(lib.security.getToken("Timeperiod", "approvals"), "false");
    var sExpertRights		= funcs.nullsub(lib.security.getToken("Timeperiod", "expert"), "false");
    var sAdminRights		= funcs.nullsub(lib.security.getToken("Timeperiod", "admin"), "false");
     
     // Expert or Admin users can always change the occurrences	
    if (sExpertRights=="true" || sAdminRights=="true") {
    	return true;
    }
    
    // no approval rights mean no rigth to change the occurrences	
    if (sApprovalRights!="true") {
    	return false;
    }
       
    // when we are here this means, the user has approval right, so we need to check if he can approve for the current pending group
    // if yes we allow him to 	
    if (fDefRecord.approval_status=="pending" && funcs.lng(funcs.denull(vars.$L_approval_intersect))>0) {
    	return true;
    }
   	
   	// the last case is required after the Approval Phase, to reactive occurrences once inactive.
   	// in case the user and approval rights
   	// check if is user is member of any group approved for this time period
   	
   	if (fDefRecord.approval_status=="approved") {
   		var aGroups			= vars.$lo_pm_assignments.toArray();
   		aGroups.push(vars.$lo_user_name);
   		aGroups				= lib.ArrayUtil.toSCDatum(aGroups);
   		var fApprovalLog  	= new SCFile("ApprovalLog", SCFILE_READONLY);
   		fApprovalLog.setFields(["counter"]);
   		var sQuery			= "file.name=\"timeperiodDefinition\" and unique.key=\""+fDefRecord.id+"\" and group isin "+ funcs.str(aGroups);
   		var rcSelect		= fApprovalLog.doSelect(sQuery);
   	
   		// if a record is found he is member of the approval group
   		if (rcSelect==RC_SUCCESS) {
   			return true;
   		}
	}
	// otherwise return false
	return false;
}

/**
*  This function returns the Rule ID and the Rule name of the current definition
*
*      History:
*      2012-12-11, Jan Steube - function created
*
*  @param    	{sDefId}     definition Id
*  @param    	{bActive}     active flag
*  @param    	{bLocked}     locked flag
*  @returns 	{Array}    	 aReturn - the filter rule
*  @example:
*      
*/
function getRules(sDefId, bActive, bLocked) {

	var aReturn = [];
	var aRuleId = [];
	var aRuleName = [];

	var fTimePeriodRule = new SCFile( "timeperiodRule", SCFILE_READONLY);
	fTimePeriodRule.setFields(['name', 'id']);
	fTimePeriodRule.setOrderBy(['name'], [SCFILE_ASC]);
	
	var sQuery = "definition.id=\"" + sDefId + "\"";
	if (bActive==true || bActive==false) {
		sQuery += " and active="+funcs.val(bActive,4);
	}
	
	if (bLocked==true || bLocked==false) {
		sQuery += " and locked="+funcs.val(bLocked,4);
	}
		
	var rc = fTimePeriodRule.doSelect( sQuery );
	if( rc == RC_SUCCESS ) {
		rc = fTimePeriodRule.getFirst();
		while (getLastRC() == RC_SUCCESS) {
			aRuleId.push(fTimePeriodRule.id);
			aRuleName.push(fTimePeriodRule.name);
			rcNext = fTimePeriodRule.getNext();
		}
		aReturn[0] = aRuleId;
		aReturn[1] = aRuleName;
	}
		
	return aReturn;
}


/**
*  This function shows the rules for a timeperiodDefinition in HTML view
*
*      History:
*      2012-12-11, Jan Steube - function created
*
*  @param    {File}     fRecord - the definition
*  @param    {Boolean}  bEditable - if editable
*
*  @returns {String}   sHtmlReturn - the HTML String
*
*  @example Called by: DisplayScreen timeperiodDefinition.view
*      
*/
function getRuleDetails(fRecord) {

       var firstPhase = false;
       if (getFirstWorkflowPhase(vars.$L_wfPhase.workflowName)==fRecord.current_phase) {
       		firstPhase=true;
       }
       
	   var sAction = "";     
       var sCR = "\n";
       //var iLineCount = 0;
       var sHtmlReturn = lib.timeperiodCSS.getCSS();
       sHtmlReturn += "<table class=\"TableResults\" width=\"100%\">" + sCR;
       
       // additional message for copy mode on top ot HTML table
       var copyMode = funcs.nullsub(vars.$copyMode, false); 
       if (copyMode) {
       		var sCopyOption	= lib.settings.getSettingValue( "Timeperiod", "copyOptions" );
			// if copy option is invalid or customer decided to not copy rules and occurrences, then return without doing something
			if (sCopyOption == "rulesOnly" || sCopyOption =="rulesAndOccurrences") {
				sHtmlReturn += "<tr><td class=\"message\" colspan=\"6\"><b>" + funcs.scmsg("37", "timeperiod" ,["Rules"]) + "</b></td></tr>" + sCR;
			}
				
	   }

       // Table header     
       sHtmlReturn += "<tr><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + 	funcs.scmsg(17, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + // Id
       								funcs.scmsg(18, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + // Name
       								funcs.scmsg(21, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + // Type
       								funcs.scmsg(19, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + // Effective from
       								funcs.scmsg(20, "timeperiod") + "</span></div></div></th><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\" class=\"table-border\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + // Expires
       								funcs.scmsg(22, "timeperiod") + "</span></div></div></th></tr>"; // Active

       var fTimePeriodRule = new SCFile( "timeperiodRule", SCFILE_READONLY);
       var sQuery = "definition.id=\"" + fRecord.id + "\"";
       fTimePeriodRule.setFields(['definition.id', 'id', 'valid.from', 'valid.count', 'valid.to', 'type','active', 'name', 'valid.type',"arbitrary"]);
       fTimePeriodRule.setOrderBy(['id'], [SCFILE_ASC]);
       var rc = fTimePeriodRule.doSelect( sQuery );
       if( rc == RC_SUCCESS ) {
             rc = fTimePeriodRule.getFirst();
             while (rc == RC_SUCCESS) {
					var sRowClass = "TableCellResults";//iLineCount%2==0 ? "TableCellResults" : "oddRow";
					//iLineCount++;
                   	sHtmlReturn += "<tr class=\"TableNormalRow\">";
                    sHtmlReturn += "<td class=\""+sRowClass+"\" ><div><a tabindex=\"0\" class=\"shadowFocus\" href=\"scactivelink://timeperiodRule:" + codeLink("id=&quot;" + fTimePeriodRule.id + "&quot;", "en") + "\"><div class=\"Text FormatTableElementReadonly\"><span class=\"xTableCell FormatTableElementReadonly\" style=\"text-decoration:underline;color:#0000FF;\">" + fTimePeriodRule.id + "</span></div></a></div></td>";
                    sHtmlReturn += "<td class=\""+sRowClass+"\" ><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + quoteText(funcs.str(fTimePeriodRule.name)) + "</span></div></div></td>";
                                    
                    // spezial display for arbitrary
                    var displayExpires = "";
                    if (fTimePeriodRule.arbitrary==false) {
                    	sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.scmsg(fTimePeriodRule.type,"timeperiod") + "</span></div></div></td>"; 			// type column
                    	sHtmlReturn += "<td class=\""+sRowClass+"\"><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(funcs.nullsub(fTimePeriodRule.valid_from, "")) + "</span></div></div></td>";  	// effective from column
                    	if (fTimePeriodRule.valid_type=="date") {
							displayExpires = funcs.str(fTimePeriodRule.valid_to);
						} else if (fTimePeriodRule.valid_type=="occurence") {
							displayExpires = funcs.scmsg("24", "timeperiod", [funcs.str(fTimePeriodRule.valid_count)]);
						} else if (fTimePeriodRule.valid_type=="never") {
							displayExpires = funcs.scmsg("30", "timeperiod");
						} 
                    }
                    else {
                    	sHtmlReturn += "<td class=\""+sRowClass+"\" ><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.scmsg("arbitrary", "timeperiod") + "</span></div></div></td>"; // type column
                    	sHtmlReturn += "<td class=\""+sRowClass+"\" ><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + "" + "</span></div></div></td>";	// effective from column
                    	displayExpires = funcs.scmsg("arbitrary", "timeperiod");
                    }      
      
                    sHtmlReturn += "<td class=\""+sRowClass+"\" ><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(displayExpires) + "</span></div></div></td>";
                   
                   	// active / inactive?
                    var display;
                    fTimePeriodRule.active == true ? display=funcs.scmsg("15", "timeperiod") : display=funcs.scmsg("16", "timeperiod");
                    sHtmlReturn += "<td class=\""+sRowClass+"\" ><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\">" + funcs.str(display) + "</span></div></div></td>";
                    
                    sHtmlReturn += "</tr>" + sCR;
                    rc = fTimePeriodRule.getNext();
             } // while records
       } else {
             sHtmlReturn += "<tr><td class=\"evenRow\" colspan=\"6\">" + funcs.scmsg("23", "timeperiod") + "</td></tr>" + sCR;
       } // if record
       
       sHtmlReturn += "</table>" + sCR;

       return sHtmlReturn;
}

/**
* This function en-/decodes the link line
* <br>
* History:<br>
* 20111022 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
*
* @date     20111022
* @param   {String} sLink
* @param   {String} sType 	- en = encode; de = decode
 * @returns {String} sLink
*
* @example Called by: ScriptLib, displayevent 32099
*
*/
function codeLink(sLink, sType) {

       if (sType == "en") {
             sLink = sLink.replace(/\(/g, "::opnb1::");
             sLink = sLink.replace(/\)/g, "::clsb1::");
             sLink = sLink.replace(/\[/g, "::opnb2::");
             sLink = sLink.replace(/\]/g, "::clsb2::");
             sLink = sLink.replace(/\*/g, "::star1::");  
           return sLink;
       } else if (sType == "de") {

             sLink = sLink.replace(/::opnb1::/g, "(");
             sLink = sLink.replace(/::clsb1::/g, ")");
             sLink = sLink.replace(/::opnb2::/g, "[");
             sLink = sLink.replace(/::clsb2::/g, "]");
             sLink = sLink.replace(/::star1::/g, "*");   
           return sLink;
       }
}


/**
* This function enquotes some special characters to prevent some malicious code attacks
* <br>
* History:<br>
* 20130315 - Jan Steube function created <br>
*
* @date    20111022
* @param   {String} sText
* @returns {String} sText
*
*/
function quoteText(sText) {

	sText = sText.replace(/\>/g, "&gt;");
    sText = sText.replace(/\</g, "&lt;");
    sText = sText.replace(/\"/g, "&quot;");
    sText = sText.replace(/\'/g, "'");
    sText = sText.replace(/\//g, "/");  
    return sText;
}



/**
* This function checks if timeperiod has active rules
* <br>
* History:<br>
* 20121222 - Jan Steube Function created<br>
*
* @date     20121222
* @param   {String} sDefId
* @returns {boolean} true / false
*
* @example Called by: used in transition from planning to approval phase
*
*/
function hasActiveRule(sDefId)
{
	var fTimePeriodRule = new SCFile( "timeperiodRule", SCFILE_READONLY);
	fTimePeriodRule.setFields(["id", "active"]);
	var sQuery = "definition.id=\"" + sDefId + "\" and active=true";
	var rc = fTimePeriodRule.doSelect( sQuery );
	if( rc == RC_SUCCESS ) {
		return true;
	}
	
	return false;
}

/**
* This function return the status (1-planning, 2 published, 3- retired) of a timeperiod record
* <br>
* History:<br>
* 20121222 - Jan Steube Function created<br>
*
* @date     20121222
* @param   {String} sDefId
* @returns {string} status
*
* @example Called by: used in transition from planning to approval phase
*
*/
function getTimeperiodDefinitionStatus(sDefId)
{
	var fTP = new SCFile("timeperiodDefinition", SCFILE_READONLY);
	var rc 			= "";
    var query 		= "id=\""+sDefId+"\"";
    fTP.setFields(['status']);
    rc = fTP.doSelect( query );
    if (rc==RC_SUCCESS) {
        return fTP.status;
    }
}

/**
* This function copies rules and occurrcences of a timeperiod definition
* <br>
* History:<br>
* 20130131 - Jan Steube Function created<br>
*
* @date     20130131
* @param   {String} sDefIdTarget -> the timeperiod Id to copy the rules to
* @param   {String} sDefIdSource -> the timeperiod Id to copy the rules from
* @returns {string} error / success
*
*/
function copyRulesOccurrences(sDefIdTarget, sDefIdSource)
{
	var sCopyOption	= lib.settings.getSettingValue( "Timeperiod", "copyOptions" );
	
	// if copy option is invalid or customer decided to not copy rules and occurrences, then return without doing something
	if (sCopyOption == "" || sCopyOption == null || sCopyOption=="nothing") {
		return;
	}
	
	var fTimePeriodRule	= new SCFile( "timeperiodRule");
	var sQuery 			= "definition.id=\"" + sDefIdSource + "\"";
	var rcSelect 		= fTimePeriodRule.doSelect( sQuery );
	var ret;
		
	try {
		if( rcSelect == RC_SUCCESS ) {
			do {
	 			var fCopiedRule = new SCFile("timeperiodRule");
     			funcs.fduplicate(fCopiedRule, fTimePeriodRule);
     	
     			var rc, scNumber = new SCDatum();
	 			funcs.rtecall("getnumber", rc, scNumber, "timeperiodRule");
	 	
	 			fCopiedRule.id 				= scNumber.getText();
	 			fCopiedRule.definition_id	= sDefIdTarget;
	 			fCopiedRule.active			= true;
	 			fCopiedRule.locked			= false;
	 			
	 			// if only rules should be copied, deactivate the trigger to avoid getting occurrences created
	 			if (sCopyOption == "rulesOnly") {
	 				funcs.rtecall("trigger", ret, 0);	
	 			}
	 		
	 			var rcInsert	= fCopiedRule.doSave();
	 			
	 			if (sCopyOption == "rulesOnly") {
	 				funcs.rtecall("trigger", ret, 1);	
	 			}
	 				
	 			var rcNext 		= fTimePeriodRule.getNext();	
	 	
			} while (rcNext==RC_SUCCESS);
		}
	}
    catch( ex ) {
        log.error( "exception: " + ex );
    }
}

/**
* This function validates the time period array in the applies to section
* it: removes duplicate and null values, empty strings
* in case <all> and other items are in the list <all> is removed
* <br>
* History:<br>
* 20130131 - Jan Steube Function created<br>
*
* @date     20130131
* @param   {array} array -> the array to validate
* @returns {array} array -> the modified array
*
*/
function validateArray(array)
{
	var i, len = array.length;
	
	for(i = 0; i < len; i++ ) {
    	array[i] && array.push(array[i]);  // copy non-empty values to the end of the array
    }

	array.splice(0 , len);  
  	
 	array = lib.ArrayUtil.removeDuplicateEmptyElement(array);
   	//check if "all" is in the list with some more items, if yes remove "all"
  	var idx=funcs.index("all", array);
   	if (len>1 && idx>0) {
     	array.splice(idx-1,1);
   }
   array.sort();
   return array;
}