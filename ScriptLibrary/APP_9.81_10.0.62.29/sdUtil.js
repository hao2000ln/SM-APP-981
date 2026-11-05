var $ = lib.c.$;
var logger = getLog("sdUtil");

/**
*  This function is to get the category of interaction to be created from service catalog request.
*  Currently, we just use 'service catalog'
*	
*  @return {string}  -  Category name. 
*/
function getSVCCategory()
{	
	return "service catalog";
}


/**
*  This function is to check whether the interaction category is for a catalog or not
*	
*  @return {boolean}
*/
function isCatalogCategory(name) {
	return /(service|support) catalog/i.test(name);
}


/**
*  This function is to get the category of interaction to be created for 'submit a request' in ESS.
*	
*  @return {string}  -  Category name. 
*/
function getSDDefaultCat()
{
	return "incident";
}

/**
*  This function is to add a schedule.
*	
*  @param {String} name - The name of schedule.
*  @param {String} app - The applicaiton to run in the schedule.
*  @returns {SCFile}  -  The schedule record. 
*/
function addSchedule(name, app, repeat, time, string1, string2, string3, string4, string5)
{
    logger.info(`add linker schedule "${name}" for "${string1}/${string3}".`);
    
	var sch = new SCFile("schedule");
	sch.name=name;
	sch.application=app;
	sch.expiration=(time==null)?new Date():time;
	sch['class']="linker";	
	sch.status="scheduled";	
	sch.numbers1[0]=repeat;
	sch.strings[0]=string1;
	sch.strings[1]=string2;
	sch.strings[2]=string3;
	sch.strings[3]=string4;
	sch.strings[4]=string5;
	sch.doInsert();
	
	return sch;
}

/**
*  This function is to get the count of related escalation.
*	
*  @param {interaction} object- The interaction record.
*  @return {count}  -  number indicate quantity of interaction escalation. 
*/
function getEscalatedCount(interaction, relation) {
    var f = new SCFile("screlation", SCFILE_READONLY);
    f.setFields("source");
    relation = relation || "Escalation";
    var count = f.doCount("source=\"" + interaction.incident_id + "\" and type=\"" + relation + "\"");
    return count;
}

function getAvtiveRelationCount(interaction)
{
	var f = new SCFile("screlation", SCFILE_READONLY);
    f.setFields("source");
	var count = f.doCount("source=\""+interaction.incident_id+"\" and depend.active=true and source.active=true and (type=\"Escalation\" or null(type))");
	return count;
}

function getCatByName(category, catFileName)
{
	if(category==null||category=="")
	{
		print("no category fed in");
		return null;
	}
	 
	var fCat = new SCFile(catFileName);
	var rc = fCat.doSelect("name=\""+category+"\"");
	if(rc==RC_SUCCESS)
	{		
		return fCat;	 
	}
	return null;
}


function getCatApproval(file, object)
{
	if(object==null)
	{
		object=lib.objectHelper.getObject(null, funcs.filename(file))[0];
	}

     var catFile=object['category.file.name'];
     if(file['category']!=null && catFile!=null)
     {
   		 var fCat = getCatByName(file['category'],catFile);
		 if(fCat!=null)
	 	{
	 		return fCat.approvals;
	 	}
	 }
	
	 return [];
}

/**
*  This function is to set the display form of interaction based on the phase and whether it's working in ESS.
*	
*  @param {record} object- The interaction record.
*  @Deprecated
*/
function setPhaseForm(record)
{
// Note : The below Format related logic has been migrated to the dynamic display form in the corresponding workflow,including Service Desk and Service Catalog
}


/**
*  This function is to convert the update action into journal update if required.
*	
*  @param {record} object- The interaction record.
*  @param {actionVar} string- The Variable name of the update action.
 *  @param {actionType} string- The type of the update action.
*/
function journalAction(record, actionVar, actionType) {

	if(record.cust_visible!=true && (actionType=="Problem Update"||actionType=="Change Update"||actionType=="Request Update"||actionType=="Incident Update"))
	{
		return;
	}
     var DENULL = funcs.denull;
     var NULLSUB = funcs.nullsub;
     var LNG = funcs.lng;
     var OPERATOR = funcs.operator;
     var STR = funcs.str;
     var TOD = funcs.tod;
     var GLOBALENV = vars['$G.sm.global.environment'];
     var PERSONENV = vars['$G.sm.environment'];
     
     if (vars[actionVar]==null|| LNG(DENULL(vars[actionVar]))==0)
     {
     	return;
     }
	 if (record['update.action']==null)
	 {
	 	record['update.action']=[];
	 }
	 if (record['update.action.ess']==null)
	 {
	 	record['update.action.ess']=[];
	 }
     
     var operator = "";
     if (NULLSUB(PERSONENV['full.name'], GLOBALENV['full.name']) == true)
     {
         operator = NULLSUB(vars['$lo.ufname'], NULLSUB(OPERATOR(), "NULL"));
     }
     else
     {
         operator = NULLSUB(OPERATOR(), "NULL");
     }

     var stamp = STR(TOD()) + " " + vars['$lo.time.zone'] + " (" + operator + "):";
     var arrayStamp = [];
     arrayStamp.push(stamp);
     var arrayUpdateAction= arrayStamp.concat(DENULL(vars[actionVar]).toArray());

     //Populate update.action
     if (GLOBALENV['journal.pm'] == true )
     {
         if (NULLSUB(GLOBALENV['journal.pm.order'], 1) == 1)
         {
             record['update.action'] = arrayUpdateAction.concat(DENULL(record['update.action']).toArray());
         }
         else
         {  
             record['update.action'] = DENULL(record['update.action']).toArray().concat(arrayUpdateAction);
         }
     }
     //Populate update.action.ess (the field containing the journal updates displayed to ESS users
     //This is done irregardless of whether Journal Updates is enabled or not "
     if (record['cust.visible'] == true) // && denull($update.action)~={""}
     {
         if (NULLSUB(GLOBALENV['journal.pm.order'], 1) == 1)
         {
             record['update.action.ess'] = arrayUpdateAction.concat(DENULL(record['update.action.ess']).toArray());
         }
         else
         {  
             record['update.action.ess'] = DENULL(record['update.action.ess']).toArray().concat(arrayUpdateAction);
         }
     }
  }
  
/**
*  This function is to process the link line to interaction subcategory
*	
*  When the category is incident, the subcategory is managed by "Incident Management' module and the target file is 'imCategory'.
*  Otherwise, use the 'sdSubcategory' file.
*  @param {varFile} string- The Variable name of the interaction record.
*  @param {varQuery} string- The Variable name of the query of link line.
*  @param {varLinkSubCat} string- The Variable name of the target file of link line.
*/
function processSubcatLink(varFile,varQuery,varLinkSubCat)
{
	vars[varLinkSubCat]="sdSubcategory";	
	vars['$fill.skip.next.line']=true;
	if(vars[varFile].category=="incident")
	{//use current line			
		vars[varLinkSubCat]="imCategory";		
		vars['$fill.skip']=false;
		vars['$fill.skip.next.line']=true;
		if(vars[varFile].subcategory!=null && vars[varFile].subcategory!="")
		{
			vars[varQuery]="active = true and  name#\""+vars[varFile].subcategory+"\"";
		}
		else
		{
			vars[varQuery]="active = true";
		}
	}
	else
	{//use next line
		vars['$fill.skip']=true;
		vars['$fill.skip.next.line']=false;
		vars[varQuery] = " category=\""+vars[varFile].category+"\"";
		
		if(vars[varFile].subcategory!=null && vars[varFile].subcategory!="")
		{
			vars[varQuery]=vars[varQuery]+ " and subcategory.name#\""+vars[varFile].subcategory+"\"";
		}		
	}
	
	vars['$fill.recurse']=true;//continue lines
}

/**
*  This function is to process the link line to interaction area.
*	
*  When the category is incident, the area is managed by "Incident Management' module and the target file is 'imSubcategory'.
*  Otherwise, use the 'sdArea' file.
*  @param {varFile} string- The Variable name of the interaction record.
*  @param {varQuery} string- The Variable name of the query of link line.
*  @param {varLinkSubCat} string- The Variable name of the target file of link line.
*/
function processAreaLink(varFile,varQuery,varAreaFile)
{
	vars[varAreaFile]="sdArea";	
	vars['$fill.skip.next.line']=true;
	if(vars[varFile].category=="incident")
	{//use current line
		vars[varAreaFile]="imSubcategory";	
		vars['$fill.skip']=false;
		vars['$fill.skip.next.line']=true;
		if(vars[varFile].subcategory!=null && vars[varFile].subcategory!="")
		{
			vars[varQuery]="Active=true and category#\""+vars[varFile].subcategory+"\"";
		}
		if(vars[varFile].product_type!=null && vars[varFile].product_type!="")
		{
			vars[varQuery]=vars[varQuery]+" and  subcategory.name#\""+vars[varFile].product_type+"\"";
		}		
	}
	else
	{//use next line		
		vars['$fill.skip']=true;
		vars['$fill.skip.next.line']=false;
		if(vars[varFile].category!=null && vars[varFile].category!="")
		{
			vars[varQuery]=vars[varQuery]+" and  category#\""+vars[varFile].category+"\"";
		}		
		if(vars[varFile].subcategory!=null && vars[varFile].subcategory!="")
		{
			vars[varQuery]="subcategory#\""+vars[varFile].subcategory+"\"";
		}		
		if(vars[varFile].product_type!=null && vars[varFile].product_type!="")
		{
			vars[varQuery]=vars[varQuery]+ " and area.name#\""+vars[varFile].product_type+"\"";
		}		
	}
	
	vars['$fill.recurse']=true;//continue lines
}


/**
*  This function is to check whether the 'event.linked' workflow event is valid to process.
*	
*  @return {boolean}  -  valid flag. 
*/
function isLinkValid()
{	
	var wfEventMsg = vars['$L.wfEvent.message'];
	if((vars['$L.file']['current.phase']=="Work In Progress"||vars['$L.file']['current.phase']=="Categorization" || vars['$L.file']['current.phase']=="Review") && wfEventMsg.length()>0 && (wfEventMsg[0]=="Trigger To"||wfEventMsg[0]=="Escalation"||wfEventMsg[0]=="Fulfillment"))
	{		
		return true;
	}	
	return false;
}

/**
*  This function is to check whether interaction have related required action.
*	
*/
function initReqActionFlag()
{
	var f = new SCFile("incdepends", SCFILE_READONLY);
	f.setFields("dependency.id");
	var rc = f.doSelect("incident.id=\""+vars['$L.file']['incident.id']+"\"");
	if(rc==RC_SUCCESS)
	{
		vars['$required.actions']=true;
	}
}


function clearVar()
{
	var record=vars['$L.file'];
	funcs.cleanup(vars['$update.action']);
	funcs.cleanup(vars['$ess.update.action']);
	
	funcs.cleanup(vars['$ess.close.action']);
	funcs.cleanup(vars['$ess.close.activity']);
	
	if(vars['$G.ess']==true)
	{
		record['cust.visible']=true;
	}
	else
	{
		record['cust.visible']=false;
	}
}

/**
*  This function is to check whether input date is valid.
*	
*/
function isDateValid(theDate)
{
	return null != funcs.val(theDate, 3);
}

function isInteractionEscalatedOrFulfilled(record)
{
	if($("screlation", SCFILE_READONLY).fields("source").count("source=\""+record.incident_id+"\" and type=\"Escalation\"")>0 || $("svcCartItem", SCFILE_READONLY).setFields(["cartItemId"]).count("sdID=\""+record.incident_id+"\"")>0)
	{
	 	return true;
	}
	return false; 	
}

function changeCatBlocked()
{
	if(vars['$L.mode']=="add")
	{//when new an interaction
		if(vars['$L.tableAccess.new']!=true||vars['$G.ess']==true||vars['$L.editable.flag']!=true)
		{
			return true;
		}
	}
	else
	{
		if(vars['$L.tableAccess.update']!=true||vars['$G.ess']==true||vars['$L.editable.flag']!=true)
		{
			return true;
		}
		var record=vars['$L.file']; 	
	 	if(isInteractionEscalatedOrFulfilled(record))
	 	{
	 		return true;
	 	} 	
	}
 	return false;	
}

function canCallback(interaction)
{
	var count=$("screlation", SCFILE_READONLY).fields("source").count("source=\""+interaction.incident_id+"\" and source.filename=\"incidents\" and depend.active=true");
	if(count>0) 
	{
		return false;
	}
	return true;
	
}

function popCIAssignment(interaction)
{
	var assignment = null;
	if(interaction.category=="incident")
	{
		var device = new SCFile("device", SCFILE_READONLY);
		device.setFields("assignment");
		var sql = "logical.name=\""+interaction['affected.item']+"\"";
		device.doSelect( sql );
		assignment= device.assignment;
	}
	else
	{
		assignment = vars['$lo.home.assignment'];		
	}
	//validate the assignment
	if (assignment!=null)
	{
		var fAssignment= new SCFile("assignment", SCFILE_READONLY);
		fAssignment.setFields("name");
		var RC = fAssignment.doSelect("name=\""+assignment+"\"");
		if  (RC!=RC_SUCCESS)
		{
			assignment=null;
		}
	}
	
	return assignment;
}

function setCompletionCodeList(mode)
{	
	var index;
	if (mode=="firstCallClose"||mode=="normalClose")
	{
		index = funcs.index("Invalid",vars['$G.sdCompletionCodes']);
		if (index>0)
		{
			vars['$G.resolution.code.selection']=funcs._delete(vars['$G.sdCompletionCodes'],index,1);
		}
		if(index>0 && vars['$G.sdCompletionCodes.local']!=null)
		{
			vars['$G.resolution.code.selection.local']=funcs._delete(vars['$G.sdCompletionCodes.local'],index,1);
		}
		index = funcs.index("Withdrawn by User",vars['$G.resolution.code.selection']);
		if (index>0)
		{
			vars['$G.resolution.code.selection']=funcs._delete(vars['$G.resolution.code.selection'],index,1);
		}
		if(index>0 && vars['$G.sdCompletionCodes.local']!=null)
		{
			vars['$G.resolution.code.selection.local']=funcs._delete(vars['$G.resolution.code.selection.local'],index,1);
		}
	}
	if (mode=="invalidClose")
	{
		index = funcs.index("Invalid",vars['$G.sdCompletionCodes']);
		if (index>0) 
		{
			vars['$G.resolution.code.selection']=[vars['$G.sdCompletionCodes'][index-1]];
		}
		if(index>0 && vars['$G.sdCompletionCodes.local']!=null)
		{
			vars['$G.resolution.code.selection.local']=[vars['$G.sdCompletionCodes.local'][index-1]];
		}
	}
	if (mode=="withdrawClose")
	{
		index = funcs.index("Withdrawn by User",vars['$G.resolution.code']);
		if (index>0) 
		{
			vars['$G.resolution.code.selection']=[vars['$G.sdCompletionCodes'][index-1]];
		}
		if(index>0 && vars['$G.sdCompletionCodes.local']!=null)
		{
			vars['$G.resolution.code.selection.local']=[vars['$G.sdCompletionCodes.local'][index-1]];
		}
	}

}


/** 
 * Introduction: Set escalation relation for interaction.
 * Date:20140417
 * Author:xiaoning.li 
 * @param category The category of interaction
 * @return The escalation relation which will be called by sd.escalate process
 */ 
function getEscalationRelation(category)
{   var categoryfile = new SCFile("sdCategory",SCFILE_READONLY);
      categoryfile.setFields("escalate.type");        
     var query="name=\""+category+"\"";
      var rc=categoryfile.doSelect(query);
      var escalateRelation;
      if (rc==RC_SUCCESS)
      { var escalatetype=categoryfile.escalate_type;
        if (category=="request for change" || category=="request for change codeless")
        {
             escalateRelation="Escalated Change";
        }   
        else if (category=="request for administration" && escalatetype=="request")
        {
         escalateRelation="Escalated Request";
        }
        else if ((category=="request for information" || category=="request for information codeless") && escalatetype=="request")
        {
         escalateRelation="Escalated Request";
        }
        else if (category=="service request" || category=="service request codeless")
        {
         escalateRelation="Escalated Request";
        }
        else if (category=="problem" || category=="problem codeless")
        {
         escalateRelation="Escalated Problem";
        }
        else 
      {
      escalateRelation="Escalated Incident";
      }
      }
      
      else 
    {
     escalateRelation=null;
    }        

      return escalateRelation;
}  

/**
*  This function is to check if the interaction has been related to other ticket.
*	
*  @param {interactionid} The interaction id.
*  @return {bollean} true or false  
*/
function isSDLinked(interactionid)
{   
	var f = new SCFile("screlation", SCFILE_READONLY);
	f.setFields("source");
	
	//Upadted the validation for End User Chat, if the current interaction is only related to chat request, it can still be changed category
	var nCount = f.doCount("source=\""+interactionid+"\" and depend.filename~=\"sdchat\"");
	if (nCount > 0)	{
 		return true;
 	}else {
	return false;
	} 
}

function isCanBeClosed(interactionid){
	if(!lib.ServiceDeskSwitch.getSDSwitch()){
		return true;
	}
	var screlation = new SCFile("screlation", SCFILE_READONLY);
	screlation.setFields("source");
	
	var sql = "source=\""+interactionid+"\"";
	if(screlation.doSelect(sql)===RC_SUCCESS){
		do{
			if(screlation.depend_active){
				return false;
			}
		}while(screlation.getNext()===RC_SUCCESS);
		
		return true;
	}else{
		return true;
	}
}

/**
 *  This function is to get the related record type value.
 *
 *  @param {targetFileName} string- The name of target file.
 *  @return {string}  -  The related record type value.
 */
function getRelatedRecordType(targetFileName) {
    if (targetFileName === "problem") {
        targetFileName = "probsummary";
    }
    var typeQuery = 'source.file="incidents" and target.file="' + targetFileName + '" and value#"Related"';
    var type = $("screlationtype", SCFILE_READONLY).fields("value").select(typeQuery).uniqueResult();

    if (type != null) {
        return type["value"];
    }

    return null;
}


/**
*  This functions build and return the CSS Style for the interaction attachment HTML tables in the fulfilled record
*	
*  @returns {String} the CSS style
*/
function getSDAttachmentCSS()
{
    return lib.AttachmentUtil.getAttachmentHtmlCSS();
}


/**
 *  This functions build and return the interaction attachment HTML tables in the fulfilled record
 *	
 *  @param {fulfilled_record_id} string - id of the fulfilled record
 *  @returns {String} HTML tables - the interaction attachment HTML tables
 */
function getAttachmentHTML(fulfilled_record_id) {

    var numbers = [];
    $("screlation", SCFILE_READONLY).fields("depend").setOrderBy(['depend'], [SCFILE_ASC]).select('depend.filename="incidents" and source="' + fulfilled_record_id + '"').iterate(function(record) {
        var interaction_id = record.depend;
        numbers.push(interaction_id);
    });
    
    var sHtmlReturn = getSDAttachmentCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("incidents", numbers);
    
    return sHtmlReturn;
}


/**
 *  Get the related interaction records of the fulfilled record, and return the total attachment number of them
 *	
 *  @param {fulfilled_record_id} string - id of the fulfilled record
 *  @returns {Number} - the total attachment number of related interaction records
 */
function countAttachments(fulfilled_record_id) {
    
	var attach_number = 0;

	$("screlation", SCFILE_READONLY).fields("depend").select("depend.filename=\"incidents\" and source=\"" + fulfilled_record_id + "\"").iterate(function(record) {
		var interaction_id = record.depend;
		attach_number += lib.AttachmentUtil.countAttachments(interaction_id, "incidents"); 
	});
	return attach_number;
}

/**
*Validate Category,SubCategory, Area; if Validity return "true", otherwise return error messageID+"-"+message parameter
*	
*  @param {cat} string - Category
*  @param {subcat} string - SubCategory
*  @param {area} string - Area
*  @returns 
*/
function validateInteractionCategory(cat, subcat, area, isPD)
{ 
	isPD = funcs.nullsub(isPD, false);
	
	if (!cat) {
		return "newsmart empty-Category";
	}
	
	if (!subcat && area) {
	    return isPD?"newsmart empty-Subcategory":"newsmart empty-Area";
	}
	
	//validate Category
	var catQuery = 'name="' + cat + '" and active=true';
    var catRcd = $("sdCategory", SCFILE_READONLY).fields("name").select(catQuery).uniqueResult();
	
    if (!catRcd) {    
    	 return "newsmart invalid-Category";
    }
        
    //Validate SubCategory
    if (subcat) {
    	var subCatQuery = 'category ="'+ cat +'" and name="' + subcat + '" and active=true';
    	var subCatRcd = $("sdSubcategory", SCFILE_READONLY).fields("name").select(subCatQuery).uniqueResult();
	
    	if (!subCatRcd) {   
        	return isPD?"newsmart invalid-Subcategory":"newsmart invalid-Area";
    	}  
    
    }
    //Validate Area 
	if (subcat && area) {
		var areaQuery = 'category="' + cat + '" and subcategory="' + subcat + '" and area.name="'+ area +'" and active=true';
    	var areaRcd = $("sdArea", SCFILE_READONLY).select(areaQuery).uniqueResult();
	
    	if ( !areaRcd ) {    
    		return isPD?"newsmart invalid-Area":"newsmart invalid-Subarea";
    	}  
    }
    
    return "true";
}


/**
 *  This function is to check whether streamlined interaction is enabled or not.
 *
 *  @return {boolean}
 */
function isStreamlinedSDEnabled() {
	if (lib.settings.getSettingValue("Service Desk", "sd.new.entry.enabled") !== "true") {
		return true;
	}
	
	return false;
}


/**
 *  This function is to enable/disable the settings related to Streamlined Interaction.
 *
 *  @param {status} string - enable the settings related to Streamlined Interaction when status is "on"; revert the settings changed by Streamlined Interaction when status is "off"
 */
function switchStreamlinedSD(status) {
	var disable_allow_escalation = false;
	var enable_screlationtype = true;
	var block_closures = "full";
	
	if (status === "on") {
		disable_allow_escalation = true;
		enable_screlationtype = false;
		block_closures = null;
	}

	//"Allow Escalation" in settingsConfig
	var settingsConfig = new SCFile("settingsConfig");
	var rc = settingsConfig.doSelect('setting="Service Desk" and id="allow.escalate"');
	if (rc == RC_SUCCESS) {
		settingsConfig.readonly = disable_allow_escalation;
		settingsConfig.doSave();
	}
	
	//"block.closures" in environment
	var env = new SCFile("environment");
	rc = env.doSelect('name="service desk"');
	if (rc == RC_SUCCESS) {
		env.block_closures = block_closures;
		env.doSave();
	}
	
	//screlationtype
	$("screlationtype").select("name isin {\"Related Interactions\",\"Caused Interactions\"}").iterate(function(record) {
		record.isRelatedRecord = enable_screlationtype;
		record.doSave();
	});
}

/** 
 * Introduction: Send email notification according the related record 
 * Date:20140423
 * Author:Yonglei.Wang
 * 
 * @param {SCFile} record_source    Source of the interaction record
 * @param {SCFile} record_target    Target of the interaction record
 */
function sendEmailToRelatedIntertion(record_source, record_target) {
    var visbletoCusTemplateName = getEmailNotificationTemplate();
    if (record_source["source"] === "5") {
        visbletoCusTemplateName = "sd.require.comment";
    }
    
    var interactionId = record_target.incident_id;
    
    // email template not set
    if (!visbletoCusTemplateName) {
        if (logger.isDebugEnabled()) {
            logger.debug("SendEmail", `No email template set, no email send to related Interaction ${interactionId}.`);
        }
        return;
    }
    // invalid template
    var template = $("!htmltemplates").fields("name").find("name=:name", visbletoCusTemplateName).one();
    if (!template) {
        logger.warn("SendEmail", `Template "${visbletoCusTemplateName}" is invalid, no email send to related Interaction ${interactionId}.`);
        return;
    }
    
    var recipient = getEmailAddress(record_target.contact_name);
    var subject = lib.htmlemailtemplates.getMailHeader(visbletoCusTemplateName, record_source, record_target, recipient, vars.$L_mailLang);
    var emailBody = lib.htmlemailtemplates.getMailBody(visbletoCusTemplateName, record_source, record_target, recipient, vars.$L_mailLang);
    if (record_source["source"] === "5") {
        emailBody = lib.MailUtil.updateActionHTML(emailBody, record_target.contact_name);
    }

    sendEmail(record_target.contact_name, recipient, subject, emailBody, interactionId);
}

function getEmailNotificationTemplate() {
    return lib.settings.getSettingValue("Service Desk", "customer.visible.email.template");
}

function sendEmail(contact, recipient, subject, emailBody, refId) {
    var email = new SCFile("mail");

    email["user.to"] = recipient;
    email["user.from"] = funcs.operator();
    email["date.to.send"] = funcs.tod();
    email["status"] = "sent";
    email["subject"] = subject;
    email["application"] = "email";
    email["text"].push(emailBody);
    email["user.array"][0] = contact;
    email["bccuser.array"] = null;
    email["ccuser.array"] = null;
    if (refId) {
        email["reference.id"] = refId;
    }
    var paramNames = new SCDatum();
    var paramValues = new SCDatum();

    paramNames.push("record");
    paramValues.push(email);

    var rteReturnValue = "";
    var rc = funcs.rtecall("callrad",
        rteReturnValue,
        "axces.email", //RAD app name
        paramNames,
        paramValues,
        false); //false to run in same thread, true to run in new thread

    return rc;
}

/**
 *  get the email address of recipient
 *
 *  @param  {String}   contactName -  contact name
 *  @returns {String}  email -  email address
 */
function getEmailAddress(contactName) {
    var contact = $("!contacts").fields("email").find("contact.name=:name", contactName).one();
    if (contact) {
        return contact.email;
    }
    return null;
}