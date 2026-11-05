var $ = lib.c.$;
var _ = lib.Underscore.require();
var log = getLog("HTML Templates");
//log.setLevel("debug");

var sys_lang = lib.NotificationRecipientsHelp.getSysLang();

/**
 * Parses the template header and returns an HTML String
 * <br>
 * History:<br>
 * 20090126 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
 * Contains code from Outlance GmbH - www.outlance.de - Lars Detmers, Dejan Djurovski
 *
 * @date	20090126
 * @param   {String} templateName
 * @param   {File} Record
 * @param   {File} Record Old (if available, otherwise same as Record)
 * @param   {String} Email Recipient (used to determine language)
 * @param   {String} Language (used to override recipient language, optional)
 *
 * @returns	{String} HTML Code with values
 */
function getTemplate(templateName, $RECORD, $RECORDOLD, recipient, lang, templateField, removeToken) {

	var logMsgStep="getTemplate";
	var content = "";
	
	if (log.isDebugEnabled()) {
	    log.debug(logMsgStep + ";Start: " + (recipient != null ? recipient : "no recipient"));
	}

    function parseTemplate(content, data) {

        content=String(content);
        var re = /\{[a-zA-Z_|., $\[\]0-9]{0,}\}/gi;
        
        return (
            content.replace(
                re,
                function ($1,$2,$3) {
                    var tag_content = $1.substr(1, $1.length-2);
                    var splitparameters = tag_content.split(',');
                    splitparameters[0] = trimString(splitparameters[0]);
                    var splitarray = splitparameters[0].split('.');
                    var variable;
                    if ( typeof splitarray[1] != "undefined" ) {
                        variable = 'lib.StringUtil.escapeStringforXML(data[\''+splitarray[0]+'\'].' + splitarray[1] + ')';
                    } else {
                        variable = splitarray[0];
                    }

                    var splitmodifiers = variable.split("|");
					var str="";
                    if( typeof splitmodifiers[1] != "undefined" && splitmodifiers[1] == 'formatdate' ) {
                        str=( formatJSDateTime(eval(splitmodifiers[0])) );
                    } else {
                        var tmp = null;
                        try {
                            tmp = eval(variable);
                        }
                        catch (ex) {
                            tmp = funcs.scmsg("Error", "global") + ": " + ex.message;
                            log.error(logMsgStep + ';Template record "' + templateName + '" contains invalid code: ' + ex.message);
                        }
                        
                        if ( tmp == null ) {
                            str= '';
                        } else if ( typeof splitparameters[1] != "undefined" ) {
                            splitparameters[1] = trimString(splitparameters[1]);
                            str=( eval( variable + '.substr(0, ' + splitparameters[1] + ' )' ) );
                            //str = lib.StringUtil.escapeStringforXML(str);
                        } else 	{
                        	if (funcs.type(tmp) == 8){
                                str = tmp.join('##br/##');
                                if (str) {
    	                            str = lib.StringUtil.escapeStringforXML(str);
    	                            str = str.replace(/##br\/##/g, '<br/>');
                                } else {
                              	    str = '';
                                }                        
                            }else if(funcs.type(tmp) == 3){
                                str = formatJSDateTime(tmp);
                            }else{
                                //str=lib.StringUtil.escapeStringforXML(tmp);
    							str = tmp;
                            }
                        } // end if typeof
                    }
                    
                    if (str == null) {
                       str = '';
                    }
                    
                    return str;
                } // end function
            )
        );
    }

    // added by Ryan
    if (!lang)
    {
        try{
			if(recipient){
				lang = lib.NotificationRecipientsHelp.determinLang(recipient);
        	}else{
				lang = vars.$L_mailLang || determinLang();
			}

        } catch (e) {
            log.error(logMsgStep + ';Language determination: Tempalte record "' + templateName + '" contains invalid code');
            lang = sys_lang;
        }
    }
    
    /*
	var htmlTemplate = $.cachedSelect("htmltemplates", "name=\""+templateName + "\" and language=\"" + lang + "\" and active=true");
	if (htmlTemplate == null && lang != sys_lang) {
		htmlTemplate = $.cachedSelect("htmltemplates", "name=\""+templateName + "\" and language=\"" + sys_lang + "\" and active=true");
	}
        if (htmlTemplate == null) {
		htmlTemplate = $.cachedSelect("htmltemplates", "name=\""+templateName + "\" and language=\"en\" and active=true");
	}
    */
    
    //Optimize performance start added by Henrry 06/23/2015
    var htmlTemplate = new SCFile('htmltemplates', SCFILE_READONLY);
    var res = htmlTemplate.doSelect("name=\""+templateName + "\" and language=\"" + lang + "\"");
    if(res == RC_SUCCESS && htmlTemplate.active != true){
        res = RC_ERROR;
    }
    if (res != RC_SUCCESS && lang != sys_lang) {
        res = htmlTemplate.doSelect("name=\""+templateName + "\" and language=\"" + sys_lang + "\"");
        if(res == RC_SUCCESS && htmlTemplate.active != true){
            res = RC_ERROR;
        }
    }
    if (res != RC_SUCCESS) {
         res = htmlTemplate.doSelect("name=\""+templateName + "\" and language=\"en\"");
         if(res == RC_SUCCESS && htmlTemplate.active != true){
             res = RC_ERROR;
         }
    }
    if (res == RC_SUCCESS) {
     //end
    //if (htmlTemplate != null) {

		try {
			vars.$L_mailLang = htmlTemplate.language;
            var javascript_expression = htmlTemplate.expression;
			var data = {};
		   	data['$RECORD'] = $RECORD;			
            data['$RECORDOLD'] = $RECORDOLD;
			eval(javascript_expression);
			if(templateField=="subject") {
                content = _.unescape(parseTemplate(htmlTemplate.mail_title, data));
				vars.$L_mailLang = null;
                //added by Ryan
            }
			else {
		        content = lib.MailService.convertActionString2HTML(htmlTemplate.htmlcode, $RECORD, recipient, !!!removeToken);
		        content = "<html>" + parseTemplate(content, data) + "</html>";
		    }
		    content = parseXMLString(content);
		    
		    if (log.isDebugEnabled()) {
		        log.debug(logMsgStep + ";" + htmlTemplate.mail_title);
                log.debug(logMsgStep + ";" + htmlTemplate.htmlcode);
                log.debug(logMsgStep + ";" + htmlTemplate.content);
			}

			return content;
		} catch (ex) {
		    log.error(logMsgStep + ';Template record "' + templateName + '" contains invalid code: ' + ex);
			return null;
		} // end try

	} else 	{
		if (log.isDebugEnabled()) {
			log.debug(logMsgStep + ";Template " + templateName +" could not be found.");
		}
	} // end if template
	
	return null;
}


function getMailBody(templateName, $RECORD, $RECORDOLD, recipient, lang, removeToken) {

	var logMsgStep="formatMailBody";
    if (log.isDebugEnabled()) {
        log.debug(logMsgStep + ";Start " + templateName + " mail for " + recipient);
	}
	
	return getTemplate(templateName, $RECORD, $RECORDOLD, recipient, lang, "body", removeToken);
}


/**
 *  Parses the template header and returns an HTML String
 *  May add the htmltemplate name suffix
 */
function getMailHeader(templateName, $RECORD, $RECORDOLD, recipient, lang) {
    var subject = getPureMailHeader(templateName, $RECORD, $RECORDOLD, recipient, lang);
    var append = appendHtmltemplateName(templateName, subject != null);
    if (append.length == 0) {
        return subject;
    } else {
        subject = subject == null ? "" : subject;
        return subject + append;
    }
}

/**
 * Parses the template header and returns an HTML String
 * <br>
 * History:<br>
 * 20090126 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
 * Contains code from Outlance GmbH - www.outlance.de - Lars Detmers, Dejan Djurovski
 *
 * @date	20090126
 * @param   {String} templateName
 * @param   {File} Record
 * @param   {File} Record Old (if available, otherwise same as Record)
 * @param   {String} Email Recipient (used to determine language)
 * @param   {String} Language (used to override recipient language, optional)
 * @returns	{String} HTML Code with values
 *
 */
function getPureMailHeader(templateName, $RECORD, $RECORDOLD, recipient, lang) {
	var logMsgStep="getMailHeader";
	if (log.isDebugEnabled()) {
	    log.debug(logMsgStep + ";Start: " + (recipient != null ? recipient : "no recipient"));
	    log.debug(logMsgStep + ";record: " + $RECORD);
	    log.debug(logMsgStep + ";RECORDOLD: " + $RECORDOLD);
	}

	return getTemplate(templateName, $RECORD, $RECORDOLD, recipient, lang, "subject");
}

/**
 * Generates the PreView of an HTML EMail
 * <br>
 * History:<br>
 * 20090126 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
 *
 * @date	20090126
 * @param   {String} String
 * @returns	{String} HTML Code with values
 *
 */
function getPreview(tablename) {
    var previewFailMsg = funcs.scmsg(4, "HTMLTemplate");
    
    if (tablename) {
		var targetKeys = lib.tableFunctions.getUniqueKey(tablename);
		if (targetKeys) {
			var query = targetKeys[0] + "=\"" + vars.$L_file.test_record + "\"";
			var HTMLString = "";
			if (query) {
				var fRecord = new SCFile(tablename, SCFILE_READONLY);
				var rc = fRecord.doSelect(query);
				if ( rc == RC_SUCCESS ) {
					if (vars.$L_file.type == "mail") {
						HTMLString += "<b>Mail Header:</b> " + getPureMailHeader(vars.$L_file.name, fRecord, fRecord, funcs.operator(), vars.$L_file.language) + "<br><br>";
					}
					var body = getMailBody(vars.$L_file.name, fRecord, fRecord, funcs.operator(), vars.$L_file.language, true);
					if (body != null) {
						HTMLString += body;
					}
					
					return HTMLString;
				}
				else {
				    previewFailMsg += '<br>' + funcs.scmsg(5, "HTMLTemplate", [funcs.scmsg(tablename, "tablename"), vars.$L_file.test_record]);
				}
			} // if query
		} // if targetkey
	} // if tablename
	
	return previewFailMsg; 
}

/**
 *  Return htmltemplates tag seperator
 */
function getHtmltemplateTagSeperator() {
    return "<@@@htmltemplates@@@>";
}

/**
 *  Return the special tag for inactive htmltemplates
 */
function getHtmltemplateInactiveTag() {
    return "@@@Inactive@@@";
}

/**
 *  Return the htmltemplates tag
 *  Parameter active
 *      false: template is inactive and provide the special inactive template tag
 */
function appendHtmltemplateName(templateName, active) {
    if (templateName != null && templateName.length > 0) {
        var tag = getHtmltemplateTagSeperator();
        if (active == false) {
            templateName = getHtmltemplateInactiveTag();
        }
        return tag + templateName + tag;
    }
    
    return "";
}

/**
 *  Check if the htmltemplates is active
 *  Return true when the template is active
 *  Return false when the template doesn't exist or is not active
 */
function getTemplateActive(templateName) {
    if (templateName == null) {
        return false;
    }
    
    var template = new SCFile("htmltemplates", SCFILE_READONLY);
    template.setFields(["active"]);
    var query = "name=\"" + templateName + "\"";
    var rc = template.doSelect(query);
    if (rc == RC_SUCCESS && template["active"] == true) {
        return true;
    }
    
    return false;
}

/**
 *  Return the append string of htmltemplates name
 *  Parameter ignoreInactive: when the template doesn't exist or is not active, return inactive tag or not
 *      true:  return empty string
 *      false: return inactive tag
 *      null: equals to false
 *  When the template exists and is active, always return the htmltemplates name tag
 */
function checkAndAppendHtmltemplateName(templateName, ignoreInactive) {
    if (ignoreInactive == null) {
        ignoreInactive = false;
    }
    
    var active = getTemplateActive(templateName);
    if (!active && ignoreInactive) {
        return "";
    }
    
    return appendHtmltemplateName(templateName, active);
}

/**
 *  Parse the subject with htmltemplates name suffix
 *  Return one array:
 *     [pure subject, htmltemplates name]
 *  If the subject doesn't have htmltemplates name suffix, returned array is:
 *     [subject, null]
 */
function parseSubjectHtmltemplates(subject) {
    if (subject == null) {
        return [subject, null];
    }
    
    var templateName = null;
    var subj = "";
    var tag = getHtmltemplateTagSeperator();
    var result = subject.split(tag);
    if (result != null && result.length > 0) {
        subj = result[0];
        
        if (result.length > 1) {
            templateName = result[1];
        }
        
        if (result.length > 2) {
            subj += result[2];
        }
    }
    
    return [subj, templateName];
}


/**
 *  Trim the appended htmltemplates names tag to get the pure subject
 */
function getSubjectTrimmedHtmltemplates(subject) {
    var result = parseSubjectHtmltemplates(subject);
    if (result != null && result.length > 0) {
        subject = result[0];
    }
    
    return subject;
}

/**
 *  The rule of CID of email inline attachment is <uid>
 */
function getInlineAttachmentCID(filename, uid) {
    //return filename + "_" + uid;
    return uid;
}

/**
 * Replace the url in html email for the inline image attachment
 * 
 * @param {String} content
 *          the string of the html email body content
 * @returns {Array}
 */
function replaceMailBodyInlineImage(content) {

    if (!content) {
        return [
            content, []
        ];
    }
    
    var images = [];
    var result = [];

    // example: <img height="100" alt="image text" width="100" src="scattach://<uid>:<filename>:htmltemplates:<htmltemplates name>" />
    var re = /(<img\s+[^<>]+\s+src=")(scattach:\/\/)([^"]+)("[^<>]*\/>)/gi;
    content = content.replace(re,
        function($1, $2, $3, $4, $5) {
            var imgid = "unknown";
            // $4 - <uid>:<filename>:htmltemplates:<htmltemplates name>
            // After splite, 0 - uid; 1 - filename; 2 - applicaiton; 3 - topic 
            var attach = $4.split(":");
            if (attach != null && attach.length == 4) {
                imgid = getInlineAttachmentCID(attach[1], attach[0]);
                images.push(attach[0]);
            }
            return $2 + "cid:" + imgid + $5;
        });

    result[0] = content;
    result[1] = _.uniq(images);

    return result;
}

/**
 * Replace the url in html email for the inline attachment
 * 
 * @param {String} content
 *          the string of the html email body content
 * @returns {String}
 */
function replaceMailBodyInlineAttachment(content) {

    if (!content) {
        return content;
    }

    // example: <a href="scattach://<uid>:<filename>:probsummary:IM10002">linktext</a>
    var re = /<a\s+href\s*=\s*"scattach:\/\/[^"]+"\s*>([^<>]+)<\/a>/gi;
    
    // remove hyperlink, e.g. <u>linktext</u>
    return content.replace(re, "<u>$1</u>");
}

/**
 * Replace the url in html email for the inline record
 * 
 * @param {String} content
 *          the string of the html email body content
 * @returns {String}
 */
function replaceMailBodyInlineRecord(content) {

    if (!content) {
        return content;
    }

    // example: <a href="sclink://cm3r:number=&quot;C10001&quot;">linkrecord</a>
    var re = /(<a\s+href\s*=\s*")(sclink:\/\/)([^"]+)("\s*>)([^<>]+)(<\/a>)/gi;

    content = content.replace(re,
        function($1, $2, $3, $4, $5, $6, $7) {
            // $4 - <recordname>:<query>
            var recordUrl = $3 + $4;
            var attach = $4.split(":");
            if (attach && attach.length == 2) {
                var recordname = attach[0];
                var query = _.unescape(attach[1]);
                recordUrl = lib.urlCreator.getRecordURL(recordname, query, $6);
            }
            // replace with doc engine url: <a href="http://...">linkrecord</a>
            return $2 + recordUrl + $5 + $6 + $7;
        });

    return content;
}

/**
 * Trims a String from leading and trailing spaces
 * <br>
 * History:<br>
 * 20090126 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
 *
 * @date	20090126
 * @param   {String} String
 * @return	{String} String
 *
 */
function trimString(str) {
      str = str.replace('/^[ ]+(.*)$/', str); // Trims leading spaces
      str = str.replace('/^(.*)[ ]+$/', str); // Trims trailing spaces
      return str;
}

/**
 * Returns SC DateTime String
 * <br>
 * History:<br>
 * 20090126 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
 *
 * @date	20090126
 * @param   {Date} JS Date
 * @return	{String} SCDateTimeString
 *
 */
function formatJSDateTime(date) {
   var retVal = "";
   if (date!=null) {
   		var myDate = new XMLDate( date );
		retVal = myDate.getSCDateTimeString();
		return retVal;
   }
   return retVal;
}


function determinLang() {

    var logMsgStep="determine_language";

    var lang = "";
    var lang_temp = [];
    var temp = "";
    var operator = funcs.operator();

    //determine if it is called from notification engine
    if(vars.$L_notification)
    {
        //users is defined in process.msg panel of us.nofity rad, it's workaround to fix issue QCCR1E94254
        var userList = lib.NotificationRecipientsHelp.getUserListFromNotification(vars.$L_notification, vars.$L_i, vars.$L_users);
        
        if (log.isDebugEnabled()) {
            log.debug(logMsgStep + ";userList -- " + userList);
        }

        //parse language
        if( typeof userList == "string") {
        	lang = getLang(userList);
        }
        else{
        	userList = _.uniq(userList);
        	var i;
        	for (i = 0; i < userList.length; i++) {
        	    var user = userList[i]; 
                if( user == operator )  {
                	continue;
                }
                temp = getLang(user);
                if (lang_temp.indexOf(temp) >= 0) {
                	continue;
                }
                lang_temp.push(temp);
                
                // multiple languages found
                if (lang_temp.length > 1) {
                    break;
                }
            }

            lang = ( lang_temp.length == 1 ) ? lang_temp[0] : sys_lang;
        }

        if (log.isDebugEnabled()) {
            log.debug(logMsgStep + ";language is " + lang);
        }

        vars.$L_mailLang = lang;
    }
    else 
    {
    	lang = getLang( operator );
    }

    return lang;
}


function getLang(user) {

    var operator_sql = "name=\"" + user + "\"";
    var contact_sql  = "contact.name=\"" + user + "\"";
    
    /**QCCR1E101238, SM934, dengxin
	 **add readonly for doselect, and add the selected fields
	 **apply for operator, contact
	 */

    var contact = new SCFile("contacts", SCFILE_READONLY);
    var operator = new SCFile("operator", SCFILE_READONLY);
    contact.setFields(["language","operator.id"]);
    operator.setFields(["syslanguage","contact.name"]);

    if( contact.doSelect(contact_sql) == RC_SUCCESS )
    {
        if( !funcs._null(contact.language) ) 
        {
        	return contact.language;
        }
        else if( operator.doSelect( "name=\"" + contact.operator_id + "\"" ) == RC_SUCCESS )
        {
            if( !funcs._null(operator.syslanguage) ) 
            {
            	return operator.syslanguage;
            }
            else 
            {
            	return sys_lang;
            }
        }
    }

    if( operator.doSelect(operator_sql) == RC_SUCCESS )
    {
        if( !funcs._null(operator.syslanguage) ) 
        {
        	return operator.syslanguage;
        }
        else if( contact.doSelect( "contact.name=\"" + operator.contact_name + "\"" ) == RC_SUCCESS )
        {
            if( !funcs._null(contact.language) ) 
            {
            	return contact.language;
            }
            else 
            {
            	return sys_lang;
            }
        }
    }

    return sys_lang;
}


/**
 * Parse content, convert XML symbol
 * 
 * @param {String} content
 * @returns {String}
 */
function parseXMLString(content) {
	if (content == null) {
		return null;
	}
	
	var string = content;
	
	var regExp = /&apos;/g;
	string = string.replace(regExp, "'");
	
	return string;
}


/**
 * Get localized global scmessage
 *
 * @param {Number} value
 * @param {Array} values
 * @param {Array} msgIds
 * @returns {String}
 */
function getGlobalScmessage(value, values, msgIds, glname) {
	if (value == null) {
		return "";
	}
	
	var message = String(value);

	var index = lib.ArrayUtil.indexOf(values, value);
	if (index == -1) {
		return message;
	}
    if (values.length > msgIds.length && glname != undefined) {
        log.warn("Globallist [ " + glname + " ] contains more value than the display items. This Globallist may need to be rebuilt.");
    }
    var msgId = msgIds[index];
	var lang = vars.$L_mailLang || sys_lang;
	var query = "syslanguage=\"" + lang + "\" and class=\"global\" and message.id=\"" + msgId + "\""; 

	var scmessage = $("scmessage", SCFILE_READONLY).select(query).uniqueResult();
	if (scmessage) {
		message = scmessage.message;
	}
	else if (lang != "en") {
		// query en scmessage
		query = "syslanguage=\"en\" and class=\"global\" and message.id=\"" + msgId + "\"";
		scmessage = $("scmessage", SCFILE_READONLY).select(query).uniqueResult();
		if (scmessage) {
			message = scmessage.message;
		}
	}

	return message;
}

/**
 * Get localized global scmessage by checking globallist
 *
 * @param {Number/String} value
 * @param {String} glname
 * @returns {String}
 */
function getGlobalScmessageByGloballist(value, glname) {
    var values = [];
    var msgIds = [];
    var query = "name=\"" + glname + "\"";
    var gl = $("globallists", SCFILE_READONLY).select(query).uniqueResult();
    if (gl != null) {
        values = funcs.val(gl["value.list"], 8);
        msgIds = funcs.val(gl["display.list"], 8);
    }
    
    return getGlobalScmessage(value, values, msgIds, glname);
}

/**
 * Get impact localized string, see globallist "Initial Impact"
 *
 * @param {Number} value
 * @returns {String}
 */
function getImpactString(value) {
	var values = [1,2,3,4];
	var msgIds = ["21","22","23","24"];
	return getGlobalScmessage(value, values, msgIds);
}


/**
 * Get priority localized string, see globallist "Calculated Priority"
 *
 * @param {Number} value
 * @returns {String}
 */
function getPriorityString(value) {
	var values = [1,2,3,4];
	var msgIds = ["10","12","13","14"];
	return getGlobalScmessage(value, values, msgIds);
}


/**
 * Get severity localized string, see globallist "Urgency"
 *
 * @param {Number} value
 * @returns {String}
 */
function getSeverityString(value) {
	var values = [1,2,3,4];
	var msgIds = ["10","12","13","14"];
	return getGlobalScmessage(value, values, msgIds);
}


/**
 * Get risk localized string, see globallist "Impact"
 *
 * @param {Number} value
 * @returns {String}
 */
function getRiskString(value) {
	var values = [0,1,2,3,4,5];
	var msgIds = ["0 - No Risk","1 - Low Risk","2 - Some Risk","3 - Moderate Risk","4 - High Risk","5 - Very High Risk"];
	return getGlobalScmessage(value, values, msgIds);
}

/**
 * Get Incident Task Completion Code localized string, see globallist "Incident Task Completion Codes"
 */
function getIncidentTaskCompletionCodeString(value) {
    return getGlobalScmessageByGloballist(value, "Incident Task Completion Codes");
}

/**
 * Get Incident Closure Code localized string, see globallist "Incident Closure Codes"
 */
function getIncidentClosureCodeString(value) {
    return getGlobalScmessageByGloballist(value, "Incident Closure Codes");
}

/**
 * Get Problem Closure Code localized string, see globallist "Problem Closure Codes"
 */
function getProblemClosureCodeString(value) {
    return getGlobalScmessageByGloballist(value, "Problem Closure Codes");
}

/**
 * Get Problem Task Closure Code localized string, see globallist "Problem Task Closure Codes"
 */
function getProblemTaskClosureCodeString(value) {
    return getGlobalScmessageByGloballist(value, "Problem Task Closure Codes");
}

/**
 * Get Local status localized string"
 *
 * @param {String} file, status
 * @returns {String}
 */
function getLocalStatusValue(file, status){
	if (status == "" || file =="" || file == null){
	    return status;
	}
	
	var message = String(status);
	var filename = funcs.filename(file);
	
	var msgId=null;
	var msgClass = null;
	if (filename != "cm3t") {
	    var modStatus = new SCFile("ModuleStatus", SCFILE_READONLY);
	    modStatus.setFields(["module"]);
	    var workflowName = getWorkflowNameByRecord(file);
	    var query1 = "module=\""+filename+"\" and status=\""+message+"\" and workflow=\""+workflowName+"\"";
	    var rc1 = modStatus.doSelect(query1);	
	    if (rc1 == RC_SUCCESS){
	        msgId = filename+";"+status+";"+workflowName;
	    }else{
	        msgId = filename+";"+status+";NULL";
	    }
	    msgClass = "local:ModuleStatus";
	} else {
	    msgId = "taskStatus;" + status;
	    msgClass = "local:codes";
	}
	
	message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return status;
	}else{
		return message;
	}
}

/**
 * Get Localized approval status"
 *
 * @param {String} status
 * @returns {String}
 */
function getLocalizedApprovalStatus(approvalStatus){
	if(approvalStatus != null && approvalStatus != ""){
		approvalStatus = approvalStatus.charAt(0).toUpperCase()+approvalStatus.slice(1);
		var localizedApprovalStatus = getScmessagebyMailLang(approvalStatus,"global");
		if (localizedApprovalStatus.indexOf("Could not be found")>-1){
			return approvalStatus;
		}else{
			return localizedApprovalStatus;
		} 
	}
}

function getWorkflowNameByRecord(record){
	if (record =="" || record == null){
		return null;
	}

	var filename = funcs.filename(record);
	var object = new SCFile("Object", SCFILE_READONLY);
	var query = "file.name=\""+filename+"\"";
	var rc = object.doSelect(query);
	if (rc == RC_SUCCESS){
		var workflowName = null;
	    if (object.workflowLocation == "category") {
	        if (record["category"] != null && record["category"] != "") {
	            workflowName = lib.Workflow.getWorkflowName(record, object);
	        }
	    } else if (object.workflowLocation == "object") {
	        workflowName = object.workflow;
	    } else if (object.workflowLocation == "default") {
	        workflowName = object["file.name"];
	    }
		return workflowName;
	}
}

/**
 * Get Localized category"
 *
 * @param {String} file name, category
 * @returns {String}
 */
function getLocalizedCategory(filename, category){
	if (category == "" || filename =="" || filename == null){
		return category;
	}
	var msgClass;
	switch (filename) {
		case "incidents":
			msgClass = "local:sdCategory";
			break;
		case "probsummary":
			msgClass = "local:imCategory";
			break;
		case "imTask":
			msgClass = "local:imTaskCat";
			break;
		case "cm3r":
			msgClass = "local:cm3rcategory";
			break;
		case "cm3t":
			msgClass = "local:cm3tcategory";
			break;
		case "rootcause":
			msgClass = "local:pbmCategory";
			break;
		case "rootcausetask":
			msgClass = "local:pbmTaskCat";
			break;
		case "request":
			msgClass = "local:rmCategory";
			break;
		case "requestTask":
			msgClass = "local:rmTaskCat";
			break;
		case "sla":
			msgClass = "local:slmCategory";
			break;		
		default:
			msgClass = "";
	}
	var msgId = category;
	var message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return category;
	}else{
		return message;
	}
}

/**
 * Get Localized subcategory"
 *
 * @param {String} file name, category, subcategory
 * @returns {String}
 */
function getLocalizedSubcategory(filename, category, subcategory){
	if (category == "" || subcategory == "" || filename =="" || filename == null){
		return subcategory;
	}
	var msgClass;
	var msgId;
	switch (filename) {
		case "incidents":
			msgClass = "local:sdSubcategory";
			break;
		case "probsummary":
			msgClass = "local:imSubcategory";
			break;
		case "cm3r":
			msgClass = "local:cm3rsubcat";
			break;
		case "rootcause":
			msgClass = "local:pbmSubcategory";
			break;
		case "request":
			msgClass = "local:rmSubcategory";
			break;
		default:
			msgClass = "";
	}
	if (filename == "request") {
		msgId = category+";"+subcategory;
	} else {
		msgId = subcategory+";"+category+";NULL";
	}
	
	var message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return subcategory;
	}else{
		return message;
	}
}

/**
 * Get Localized workflow phase"
 *
 * @param {String} file, category, subcategory
 * @returns {String}
 */
function getLocalizedPhase(file, phase){
	var filename = funcs.filename(file);
	if (phase == "" || filename =="" || filename == null){
		return phase;
	}
	var msgClass = "local:WorkflowPhase";
	var workflowName = getWorkflowNameByRecord(file);
	var msgId = phase + ";" + workflowName + ";" + filename;
	var message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return phase;
	}else{
		return message;
	}
}

/**
 * Get localized document type, see globallist "KM DocTypes"
 *
 * @param {Number} value
 * @returns {String}
 */
function getKmDoctype(value) {
	var values = ["errormsg", "external", "probsol", "howto", "reference"];
	var msgIds = ["60", "61", "62", "63", "64"];
	return getGlobalScmessage(value, values, msgIds);
}

/**
 * Get localized document subtype, see globallist "SLA Document SubType"
 *
 * @param {Number} subtype
 * @returns {String}
 */
function getKmSubtype(subtype) {
	var msgClass = "global";
	var msgId = String(subtype);
	var message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return subtype;
	}else{
		return message;
	}
}

/**
 * Get localized request model, see globallist "KM DocTypes"
 *
 * @param {Number} model
 * @returns {String}
 */
function getRequestModel(model) {
	if (model == "" || model == null){
		return model;
	}
	var msgClass = "local:requestModel";
	var msgId = String(model);
	var message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return model;
	}else{
		return message;
	}
}

/**
 * Get localized agreement type
 *
 * @param {Number} slatype
 * @returns {String}
 */
function getSlaType(slatype) {
	if (slatype == "" || slatype == null){
		return slatype;
	}
	var msgClass = "global";
	//var msgId = String(slatype);
	var msgId = "";
	if (slatype == "customer") {
		msgId = "Customer";
	}else{
		msgId = String(slatype);
	}
	var message = getScmessagebyMailLang(msgId,msgClass);
	if (message.indexOf("Could not be found")>-1){
		return slatype;
	}else{
		return message;
	}
}

// Fetch the relevant record of probcause and the search the relevant scmessage to return
// The display list is defined in globallists "Interaction Local Completion Codes"
function getLocalizedResolutionCode(code) {
    var query = "resolution.code=\"" + code + "\" and category=\"prob\"";
    var probcause = $("probcause", SCFILE_READONLY).select(query).uniqueResult();
    if (probcause) {
        var tag = new SCDatum();
        var ret = new SCDatum();
        funcs.rtecall("tag", ret, tag, probcause);
        var msgId = tag.getText().substring(10);
        return getScmessagebyMailLang(msgId, "local:probcause");
    }
    
    return code;
}

/**
 * Get scmessage by email recipient's language
 *
 * @param {String} msgId
 * @param {String} msgClass
 * @returns {String}
 */
function getScmessagebyMailLang(msgId, msgClass) {
	var lang = vars.$L_mailLang || sys_lang;
	var query = "syslanguage=\"" + lang + "\" and class=\"" + msgClass + "\" and message.id=\"" + msgId + "\""; 

	var scmessage = $("scmessage", SCFILE_READONLY).select(query).uniqueResult();
	var message = "";
	if (scmessage) {
		message = scmessage.message;
	}
	else if (lang != "en") {
		// query en scmessage
		query = "syslanguage=\"en\" and class=\"" + msgClass + "\" and message.id=\"" + msgId + "\"";
		scmessage = $("scmessage", SCFILE_READONLY).select(query).uniqueResult();
		if (scmessage) {
			message = scmessage.message;
		}
	}

	return message;
}

/**
 * wrap html mail content with html tag
 *
 * @param {String} content
 * @returns {String}
 */
function wrapHtmlTag(content) {
    if (!content) {
        return "<html></html>";
    }

    content = content.trim();

    if (!content.startsWith("<html>")) {
        content = `<html>${content}</html>`;
    }

    return content;
}