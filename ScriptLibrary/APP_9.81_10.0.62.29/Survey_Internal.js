var $ = lib.c.$;
function AddSurveyIncident(Record){	
	var surveyRec = new SCFile("SurveyInternal");
	var rc = surveyRec.doSelect("reference.number=\""+Record.incident_id+"\"");	
	if (rc != RC_SUCCESS) {
		surveyRec.contact_name = Record.contact_name;
		surveyRec.reference_number = Record.incident_id;
		surveyRec.file_name = "incidents";
		surveyRec.field_name = "incident.id";
		var rc = surveyRec.doInsert();	
	}
	UpdateCloseDesc(Record.incident_id, Record.contact_name);
}


function UpdateCloseDesc(RefNumber, ContactName){
	var surveyRec = new SCFile("SurveyInternal");
	var rc = surveyRec.doSelect("reference.number=\""+RefNumber+"\" and contact.name=\""+ContactName+"\"");
	
	if (rc == RC_SUCCESS) {
		var surveyQuery = "number="+surveyRec.number;
		var surveyURL = system.library.urlCreator.getURLFromQuery( "SurveyInternal", surveyQuery, "" ) 		   
		vars.$SD_notify_default_close.push("", system.functions.scmsg(37, "survey"), surveyURL);
	}
}

function genSurveyInternalURLs(surveyList, Record){
	surveyList = system.functions.denull(surveyList);
	var fileName = system.functions.filename(Record);
	var numUsers = surveyList.length();
	var surveyLinks = new Array(6);

	for (var j = 0; j < numUsers; ++j) {
		var surveyURL = genSurveyInternalURL(surveyList[j], Record);
		vars.$survey_links.push(surveyURL);	
	} 
}

function genSurveyInternalURL(recipient, Record){
	
	var surveyQuery="";	
	if (!!!vars['$preview.action'])
	{
		if (recipient==null){return null;}
		var fileName = system.functions.filename(Record);
		var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fileName);
		var UniqueKey = system.functions.str(UniqueKeyObj[0]);
		var surveyRec = new SCFile("SurveyInternal");
		var rc = surveyRec.doSelect("reference.number=\""+Record[UniqueKey]+"\" and contact.name=\""+recipient+"\" and status~=\"Closed\"");
		var surveyNumber;
	
		if (rc != RC_SUCCESS){
			surveyRec.contact_name = recipient;
			surveyRec.reference_number = Record[UniqueKey];
			surveyRec.file_name = fileName;
			surveyRec.field_name = UniqueKey;
			surveyRec.open_by = system.functions.operator();
			surveyRec.open_time = system.functions.tod();
			surveyRec.status	= "Open";
			surveyRec.template_id = vars["$survey.template"];
			surveyRec.template_questions = lib.SurveyTemplateHelpers.snapshotQuestions(vars["$survey.template"]);

			var rc = surveyRec.doInsert();	;
			var surveyRec2 = new SCFile("SurveyInternal");
			var rc2 = surveyRec2.doSelect("reference.number=\""+Record[UniqueKey]+"\" and contact.name=\""+recipient+"\" and status~=\"Closed\"");
		
			if (rc2 == RC_SUCCESS) {
				surveyQuery = "number="+surveyRec2.number;
				surveyNumber = surveyRec2.number;
			}
		}else{
			surveyQuery = "number="+surveyRec.number;
			surveyNumber = surveyRec.number;

			surveyRec.open_time = system.functions.tod();
 		 	surveyRec.update_time = system.functions.tod();
			surveyRec.template_id = vars["$survey.template"];
			surveyRec.template_questions = lib.SurveyTemplateHelpers.snapshotQuestions(vars["$survey.template"]);
			var rc3 = surveyRec.doUpdate();
		}
	}


    //check global variables exist
    var info = lib.ScAPI_Util.getSystemInfo();
	  vars.$G_sm_portal = info['sm.portal'];
	  vars.$G_webserver_url = info['webserver.url'];
	  vars.$G_ess_url = info['ess.url'];
	  vars.$G_src_url = info['src.url'];
	  vars.$G_smsp_url = info['smsp.url'];

		var surveyPortal = vars["$G.sm.portal"];
		var surveyURL = system.library.urlCreator.getESSURLFromQuery( "SurveyInternal", surveyQuery, "Customer Survey" );

		if (surveyPortal === "SRC") {
			surveyURL = lib.urlCreator.getSRCURLFromQuery( "SurveyInternal", surveyQuery, "Customer Survey" );
		}

		if (surveyPortal === "SMSP") {
			surveyURL = lib.urlCreator.getSMSPURL('SurveyInternal', surveyNumber);
		}
		return surveyURL;		
}

function findRecordSurvey(recipient, Record){
		var surveyRec = new SCFile("SurveyInternal");
		var fileName = system.functions.filename(Record);
		var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fileName);
		var UniqueKey = system.functions.str(UniqueKeyObj[0]);
		var sql = "reference.number=\""+Record[UniqueKey]+"\" and contact.name=\""+recipient+"\" and status~=\"Closed\"";
		var rc = surveyRec.doSelect(sql);
	
		if (rc == RC_SUCCESS){
			return surveyRec;
		} else {
			print(system.functions.scmsg("29", "survey", [sql]));
		}
}


function newSupportInteraction(surveyRecord){
	try{
		var orginalOperator = system.functions.operator();
		var sourceFile = new SCFile(surveyRecord.file_name);
		var sql =system.functions.str(surveyRecord.field_name)+"=\""+surveyRecord.reference_number+"\"";
		var rc = sourceFile.doSelect(sql);
		if (rc == RC_SUCCESS){
			//change operator() to the contact of survey record
			var recipientOperator = $('operator').select('contact.name="'+ surveyRecord['contact.name'] +'"').uniqueResult().name;
			system.functions.parse_evaluate( 'operator()="'+recipientOperator+'"' , 11 );

			if (surveyRecord.support_id!=null){
				var interaction = $("incidents").select("incident.id=\""+surveyRecord.support_id+"\"").uniqueResult();
			} else {
				var interaction = new SCFile("incidents");
				var returnCode   = new Datum();
				var returnNumber = new Datum();
				system.functions.rtecall("getnumber",returnCode,returnNumber,"incidents", null);
				interaction.incident_id  	= returnNumber.getText();
			  	interaction.ess_entry		= true;
			  	interaction.contact_name 	= surveyRecord['contact.name'];
				interaction.callback_contact= surveyRecord['contact.name'];
				interaction.initial_impact	= "4";
				interaction.severity		= "4";
				interaction.priority_code	= "4";
				interaction.category 		= surveyRecord.callback_support;
				interaction.folder		 	= sourceFile.folder;
				interaction.company		 	= sourceFile.company;
				interaction.title			= surveyRecord.callback_support+" for "+surveyRecord.reference_number+" , Generated by Survey "+surveyRecord.number;
				interaction.description[0]	= surveyRecord.callback_support+" for "+surveyRecord.reference_number+" , Generated by Survey "+surveyRecord.number;
				
				interaction['callback.type'] = "E-mail";
				
				var sourcefilename=surveyRecord['file.name'];
				//If associated ticket is a configurationItem
				if (sourcefilename == "device")
				{
					interaction['affected.item'] = sourceFile['logical.name'];	
				}
				else
				{
					interaction['affected.item'] = sourceFile['affected.item'];
				}
				 var bypassAuthcheckOrig=vars.$bypass_bg_authcheck;
				 var bypassValidationOrig=vars.$bypass_failed_validation;
				 vars.$bypass_bg_authcheck = true;
				 vars.$bypass_failed_validation = true;   
		
				var rc2 = interaction.doAction("add"); // not authorized
				vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
 				vars.$bypass_failed_validation = bypassValidationOrig;
				if (rc2 == RC_SUCCESS){
					print(system.functions.scmsg("30", "survey", [interaction.incident_id]));
					var screlation =  new SCFile("screlation");
					screlation.source = surveyRecord.reference_number;
					screlation.source_filename = surveyRecord.file_name =="probsummary"?"problem":surveyRecord.file_name;
					screlation.depend_filename = "incidents";
					screlation.depend = interaction.incident_id;
					screlation.doInsert();	
				}
			}
			
			return interaction.incident_id;
			
		}	
	}catch(e){
		print(e);
	} finally{
		if (system.functions.operator() !== orginalOperator) {
			system.functions.parse_evaluate( 'operator()="'+orginalOperator+'"' , 11 );
		}
	}
}

function newSupportInteraction2(filename, query){
	try{
		var surveyFile = new SCFile(filename);
		var rc0 = surveyFile.doSelect(query);
		
		if (rc0 != RC_SUCCESS)
		{
			print(system.functions.scmsg("no.surveyinternal.record", "survey", [filename, query]));
			return null;
		}
		
		var surveyRecord = surveyFile;
				
		var sourceFile = new SCFile(surveyRecord.file_name);
		var sql =system.functions.str(surveyRecord.field_name)+"=\""+surveyRecord.reference_number+"\"";
		var rc = sourceFile.doSelect(sql);
		if (rc == RC_SUCCESS){
			var returnCode   = new Datum();
			var returnNumber = new Datum();
			system.functions.rtecall("getnumber",returnCode,returnNumber,"incidents", null);
				
				var interaction = new SCFile("incidents");
					
				interaction.incident_id  	= returnNumber.getText();
			  	interaction.ess_entry		= true;
			  	interaction.contact_name 	= system.vars.$lo_contact_name;
				interaction.callback_contact= system.vars.$lo_contact_name;
				interaction.initial_impact	= "4";
				interaction.severity		= "4";
				interaction.priority_code	= "4";
				interaction.category 		= vars.$sdCat;
				interaction.folder		 	= sourceFile.folder;
				interaction.company		 	= sourceFile.company;
				interaction.title			= vars.$sdCat +" for "+surveyRecord.reference_number+" , Generated by Survey "+surveyRecord.number;
				interaction['callback.type'] = "E-mail";
				
				var sourcefilename=surveyRecord['file.name'];
				//If associated ticket is a configurationItem
				if (sourcefilename == "device")
				{
					interaction['affected.item'] = sourceFile['logical.name'];	
				}
				else
				{
					interaction['affected.item'] = sourceFile['affected.item'];
				}
				 var bypassAuthcheckOrig=vars.$bypass_bg_authcheck;
				 var bypassValidationOrig=vars.$bypass_failed_validation;
				 vars.$bypass_bg_authcheck = true;
				 vars.$bypass_failed_validation = true;   
				 
				var rc2 = interaction.doAction("add"); // not authorized				
				if (rc2 == RC_SUCCESS){
					print(system.functions.scmsg("30", "survey", [interaction.incident_id]));
					var desc = [];
					while (rc0==RC_SUCCESS)
					{
						var screlation =  new SCFile("screlation");
						screlation.source = surveyFile.reference_number;
						screlation.source_filename = surveyFile.file_name =="probsummary"?"problem":surveyRecord.file_name;
						screlation.depend_filename = "incidents";
						screlation.depend = interaction.incident_id;
						screlation.doInsert();
						
						desc.push(vars.$sdCat+" for "+surveyFile.reference_number+" , Generated by Survey "+surveyFile.number);							
						rc0 = surveyFile.getNext();
					}
									
					interaction.description = desc;
					interaction.doUpdate();					
				}
				
				vars.$bypass_bg_authcheck = bypassAuthcheckOrig;
 				vars.$bypass_failed_validation = bypassValidationOrig;
			
			return interaction.incident_id;
			
		}	
	}catch(e){
		print(e);
	}
}

	
function getContactbyFullname(ufname, email){
	var fContact = new SCFile("contacts");
 	var rc = fContact.doSelect("full.name=\"" + ufname+ "\" and email=\"" + email + "\"");
    if ( rc == RC_SUCCESS ) {
    	return fContact.contact_name;
    }else{
    	return ufname;
    }
}

function getConnectorType(surveyID){
	var surveyDefinition = new SCFile("SurveyDefinition");
	var rc = surveyDefinition.doSelect("id=\""+surveyID+"\"");
	if (rc == RC_SUCCESS){
		return surveyDefinition.connectorType;
	} else{
		return null;
	}
	
}

function genSurveyURL(recipient, task){ 
    var connectorType = getConnectorType(task["surveyId"]);
    if (connectorType == "internal"){
    	var contactName = getContactbyFullname(recipient["name"], recipient["email"]);
  		var surveyDefinition = new SCFile("SurveyDefinition");
		var rc = surveyDefinition.doSelect("id=\""+task.surveyId+"\"");
		if (rc == RC_SUCCESS){
			var fileName = surveyDefinition.tableName;
			var record = new SCFile(fileName);
			var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fileName);
			var UniqueKey = system.functions.str(UniqueKeyObj[0]);
			var rtn = record.doSelect(UniqueKey+"=\""+task.ticketId+"\"");
			if (rtn == RC_SUCCESS){
				return genSurveyInternalURL(contactName, record);
			}
			
		}
	}else{
		return null;
	}		
}

/*
*	Here defined the fields configuration which includes the tile and description. 
*	Why we need define the constant in here?Because the field name may different if the table is different.
*   First element is for title and second element is for description.
*/
var fieldConfig = {
					probsummary:['brief.description','action'],
					cm3r:['brief.description','description'],
                   	incidents:['title','description'],
                   	rootcause:['brief.description','description'],
                   	request:['brief.description','description'],
                   	device:['title','comments'],
                   	cm3t:['brief.desc','description'],
                   	imTask:['brief.description','description'],
                   	requestTask:['title','description'],
                   	sdchat:['description','description']
				  };
 /**
 * This function is to return title and description of ticket.
 * <br>
 * History:<br>
 * 20140618 - <Zhichao Fei>  Add the function
 *
 * @date	20140618
 *  @param {key} - ticket id
 *  @param {filename} - table name
 *  @returns {ticketObj} - title/description
 *
 */

function getTicketDescInfor(keyValue,filename,fieldname)
{
	var ticketObj = new Array();
	if ((keyValue != null && keyValue != "") && 
	   (filename != null && filename != "") &&
	   (fieldname !=null && fieldname !=""))
	   {
	   		//get the key field name through table name.
		   	if (fieldConfig[filename])
		   	{
		   		var fieldConf = fieldConfig[filename];
		   		if (fieldConf != null && fieldConf.length > 0)
		   		{
					var file = new SCFile(filename);
					var sql = fieldname+"=\""+keyValue+"\"";
					var rc = file.doSelect(sql);
					if (rc == RC_SUCCESS){
						for (var i = 0; i < fieldConf.length; i++)
						{
							var fieldName = fieldConf[i];
							if (file[fieldName])
							{
								//If this field is a array, I will transform it to a string.
								if (system.functions.type(file[fieldName]) == 8)
								{
									var stringValue = transformArrayToString(file[fieldName]);
									ticketObj.push(stringValue);
								}
								//Otherwise, I will push it to the result directlly.
								else
								{
									ticketObj.push(file[fieldName]);
								}
							}
							else {
								ticketObj.push("");
							}
						}
					}
		   		}
		   	}
	   }
	return ticketObj;
}

 /**
 * This function is to transform the array to string.
 * <br>
 * History:<br>
 * 20140618 - <Zhichao Fei>  Add the function
 *
 * @date	20140618
 *  @param {value} - an array objet
 *  @returns {strDescription} - transformed string
 *
 */
function transformArrayToString(value)
{
	var strDescription="";
	if(value != null){
		for(var i=0; i<value.length();i++)
		{	
			var linestr = value[i] == null?"":value[i];
			if (strDescription == null || strDescription == "")
			{
				strDescription = linestr;
			}
			else
			{
				strDescription = strDescription +"\n"+ linestr;
			}
		}
	}
	return strDescription;
}

function newInteractionFromSch(surveyID)
{
	var query = "number=" + surveyID;
	var survey =new SCFile("SurveyInternal");
	
	if (survey.doSelect(query) == RC_SUCCESS)
	{
		survey.support_id = newSupportInteraction(survey);		
		survey.doUpdate();
	}
}
