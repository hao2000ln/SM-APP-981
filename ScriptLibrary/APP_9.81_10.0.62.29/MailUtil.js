var _ = lib.Underscore.require();
var $ = lib.c.$;
var _localscmsg = lib.NotificationRecipientsHelp.determinMsg;

var token_style = getTokenPrefix() + "%S" + getTokenPostfix();
var token_regx = token_style.replace(/\*/g, "\\\*").replace("%S", ".*");

var token_style2 = getTokenPrefix2() + "%S" + getTokenPostfix();
var token_regx2 = token_style2.replace(/\*/g, "\\\*").replace("%S", ".*");

var logger = getLog('MailUtil');

function getTokenPrefix() {
    return "*****Token:";
}

function getTokenPrefix2() {
    return "*****Token%3A"; // it is not decoded so : is %3A
}

function getTokenPostfix() {
    return "*****";
}


/**
 * generate the token for email action
 * @param  {String} recipient
 * @param  {File} record
 * @param  {String} action_name
 * @param  {String} timestamp
 * @return {String} token string
 */
function genToken(recipient, record, action_name, timestamp) {
    var token_str = "";

    // append unique key values of the record to token string
    var file_name = funcs.filename(record);
    var unique_keys = lib.tableFunctions.getUniqueKey(file_name);
    if (unique_keys) {
        var key_len = unique_keys.length;
        var i;
        for (i = 0; i < key_len; i++) {
            token_str += unique_keys[i] + "=" + record[unique_keys[i]] + "&";
        }
    }
    // append file name of the record to token string
    token_str += "_file=" + file_name;
    // append current time, email recipient and action name to token string
    token_str += "&_recipient=" + recipient + "&_action=" + action_name + "&_time=" + timestamp;

    return token_style.replace("%S", token_str);
}

/**
 * encrypt the token for email action
 * @param  {String} token
 * @return {String} token encrypted
 */
function encryptToken(token) {
    return lib.EncryptUtil.encrypt(token);
}

/**
 * decrypt the token from email body.
 * @param  {String} encrypted token eg. "FEFE63B434D4479065F8F47C24137E5507C92C6D33A7CA37CD3BDEAEFE16F3EFC2721735999DBAB7F362C83359C24990031BA6FC47171394BB623FD520686D9DB4A42EF1798CB888CFBA4B6897AE97267FE57B206B25C175B43BD8F93BFC91465A3D55E67F994E0EA04F2C5E7A90A96ACF5DEFEF"
 * @return {String} decrypted token
 */
function decryptToken(encrypted) {
    var decrypted = lib.EncryptUtil.decrypt(encrypted);
    
    return encrypted == decrypted ? null : decrypted;
}

function _getLinks(mail_body) {
    return mail_body.match(/<a\s+[^<>]*?href=\"\s*mailto:.*?\".*?>/g);
}


/**
 * check whether the token is included in the email body or not
 * @param  {String} mail_body
 * @return {Boolean}
 */
function hasToken(mail_body) {
    var mail_links = _getLinks(mail_body);
    if (mail_links) {
        var re = new RegExp(token_regx);
        var re2 = new RegExp(token_regx2);
        var i;

        for (i = 0; i < mail_links.length; i++) {
            if (re.test(mail_links[i]) || re2.test(mail_links[i])) {
                return true;
            }
        }
    }

    return false;
}


/**
 * update HTML code of the smart action with given recipient
 * @param  {String} mail_body
 * @param  {String} recipient
 * @return {String} mail body
 */
function updateActionHTML(mail_body, recipient) {
    var mail_links = _getLinks(mail_body);
    if (mail_links) {
        var re = new RegExp(token_regx, 'g');
        var re2 = new RegExp(token_regx2, 'g');
        // get mailto address of the recipient
        var mto_addr = calcReplyTo(recipient);
        var i;
		var recipient_email = toEmailAddress(recipient);

        for (i = 0; i < mail_links.length; i++) {
            var tokens = mail_links[i].match(re2);
            if (tokens) {
                // replace mailto
                var mail_to = mail_links[i].match(/mailto:(.*?)\?/);
                var mail_link = mail_links[i].replace(mail_to[0], mail_to[0].replace(mail_to[1], encodeURIComponent(mto_addr).replace("%40","@")));
                //encode subject
            	var subject = mail_link.match(/mailto:.*?\?subject=(.*?)\&body/);
            	if(subject){
					mail_link = mail_link.replace(subject[0], subject[0].replace(subject[1], encodeURIComponent(_.unescape(subject[1]))));
                }
                tokens = decodeURIComponent(mail_link).match(re);
                if (!tokens) {
                    tokens = [];
                }
                var t_idx;
                for (t_idx = 0; t_idx < tokens.length; t_idx++) {
                    // replace recipient
                    var _recipient = tokens[t_idx].match(/_recipient=(.*?)&/);
                    var recipient_new = tokens[t_idx].replace(_recipient[0], "_recipient=" + recipient_email + "&");
                    var regex = token_style.replace(/\*/g, "\\\*").replace("%S", "(.*)");

                    if (recipient_new.match(regex) != null) {

                        var token_str = recipient_new.match(regex)[1];
                        // save token into database
                        //var map = lib.SmartEmailUtil.findSmartEmailSettings();
                        
                        var isOneTimeToken = lib.settings.getSettingValue("SmartEmail", "isOneTimeToken"); // null or true
                        var tokenExpirationInterval = lib.settings.getSettingValue("SmartEmail", "tokenExpirationInterval");
                        // array[0] = id, array[1] = file, array[2] = recipient, array[3] = action, array[4] = comment, array[5] = time
                        var data = lib.SmartEmailUtil.parseToken(token_str);
                        data['isOneTimeToken'] = isOneTimeToken;
					    var intervalArr = tokenExpirationInterval.split(/\s|:/g);
					    var day = parseInt(intervalArr[0]);
					    var hour = parseInt(intervalArr[1]);
					    var minute = parseInt(intervalArr[2]);
					    var second = parseInt(intervalArr[3]);
					    var interval = (((day * 24 + hour) * 60 + minute) * 60 + second) * 1000;
					    var tokenExpirationTime = new Date();
					    tokenExpirationTime = new Date(tokenExpirationTime.valueOf() + interval);
					    data['tokenExpirationTime'] = tokenExpirationTime;
					    data['recipient'] = recipient_email;
                        
                        
                        lib.SmartEmailUtil.recordToken(data);

                        var encryptToken_str = encryptToken(token_str);
                        recipient_new = getTokenPrefix() + encryptToken_str + getTokenPostfix();

                        mail_link = mail_link.replace(encodeURIComponent(tokens[t_idx]), encodeURIComponent(recipient_new));
                    }

                }

                mail_body = mail_body.replace(mail_links[i], mail_link);
            }
        }
    }

    return mail_body;
}


/**
 * get the file caption of specified record
 * @param  {File} record
 * @return {String} file caption
 */
function getFileCaption(record) {
    var file_name = funcs.filename(record);
    if (file_name == "Approval") {
        file_name = record.file_name;
    }

    switch (file_name) {
        case "incidents":
            return _localscmsg(null,"SmartEmail","request");
        default:
            return _localscmsg(null,"tablename",file_name);
    }
}


/**
 * get the contact record with specified fields
 * @param  {String} recipient
 * @param  {Array} contact_fields returned fields
 * @return {File} contact
 */
function getContactRecord(recipient, contact_fields) {
    var contact_record = new SCFile('contacts', SCFILE_READONLY);
    contact_record.setFields(contact_fields);
    rc = contact_record.doSelect('operator.id="' + recipient + '" or contact.name="' + recipient + '" or email="' + recipient + '"');
    if (rc == RC_SUCCESS) {
        return contact_record;
    }

    return null;
}

/**
 * get the email address defined in operator
 * @param  {String} user - operator name/contact name/email address
 * @return {String} email address of operator/contact or email address itself or null if operator/contact is not found
 */
function getUserEmail(user) {
    if (user) {
        if (isEmailAddress(user, true)) {
            return user;
        }
        
        var operator = lib.operatorUtil.getOperatorByName(user, ["email"]);
        if (operator && isEmailAddress(operator["email"], true)) {
            return operator["email"];
        }
        
        var contact = lib.operatorUtil.getContactByName(user, ["email"]);
        if (contact && isEmailAddress(contact["email"], true)) {
            return contact["email"];
        }
    }
    
    return null;
}

/**
 * get the email address list array defined in operator
 * @param  {Array} users - operator name array
 * @return {Array} email address list array from operator
 */
function getUsersEmail(users) {
    var emails = [];
    var lng = lib.ArrayUtil.length(users);
    var i;
    var address;
    for (i=0; i<lng; i++) {
        address = getUserEmail(users[i]);
        if (address) {
            emails.push(address);
        }
    }
    
    return emails;
}


/**
 * get service desk email address by location
 * @param  {String} location_name the first location queried from
 * @return {String} service desk email address
 */
function getLocationEmail(location_name) {
    var email_addr = null;

    while (!_.isEmpty(location_name) && _.isEmpty(email_addr)) {
        var location_record = new SCFile('location', SCFILE_READONLY);
        location_record.setFields(['servicedesk.email', 'parent']);
        var rc = location_record.doSelect('location.full.name="' + location_name + '"');
        if (rc == RC_SUCCESS) {
            email_addr = location_record.servicedesk_email;
            location_name = location_record.parent;
        }
        else {
            break;
        }
    }

    return email_addr;
}


/**
 * get service desk email address by company
 * @param  {String} company_name
 * @return {String} service desk email address
 */
function getCompanyEmail(company_name) {
    var company = new SCFile('company', SCFILE_READONLY);
    company.setFields(['servicedesk.email']);
    var rc = company.doSelect('company="' + company_name + '"');
    if (rc == RC_SUCCESS) {
        return company.servicedesk_email;
    }

    return null;
}


/**
 * get default service desk email address
 * @return {String} service desk email address
 */
function getDefaultEmail() {
    //return vars.$G_sm_global_environment["sdEmail"];
    
    var sd_env = new SCFile('environment', SCFILE_READONLY);
    sd_env.setFields(['sdEmail']);
    var rc = sd_env.doSelect('name="service desk"');
    if (rc == RC_SUCCESS) {
    	return sd_env.sdEmail;
    }
    return null;
}


/**
 * calculate the reply to email address
 * with the sequence: location > company > service desk environment
 * @param  {String} recipient
 * @return {String} email address
 */
function calcReplyTo(recipient) {
    var servicedesk_email = null;

    if (!_.isEmpty(recipient)) {
        var contact = getContactRecord(recipient, ["location.full.name", "company"]);
        if (contact) {
            // get service desk email by location
            servicedesk_email = getLocationEmail(contact.location_full_name);

            if (_.isEmpty(servicedesk_email)) {
                // get service desk email by company
                servicedesk_email = getCompanyEmail(contact.company);
            }
        }
    }

    if (_.isEmpty(servicedesk_email)) {
        // get default service desk email
        servicedesk_email = getDefaultEmail();
    }

    return servicedesk_email;
}

function smArrayToString(smarray, delimiter) {
    delimiter = delimiter || ";";
    var jsarray = lib.ArrayUtil.toJsArray(smarray);
    if (jsarray) {
        return jsarray.join(delimiter);
    }
    return null;
}

function smArrayToStringLine(smarray) {
    return smArrayToString(smarray, "\n");
}

function indexOfSeparator(subject){
    var separator = getEventOutSeparator();
    if (!subject || !separator) {
        return -1;
    }
    var index = subject.indexOf(separator);
    return index;
}

function getEventOutSeparator(){
	var separator_field = "field delimiter";
	var separator = "";
	var eventR = new SCFile("eventregister",SCFILE_READONLY);
	var query = "evappl = \"axces.email\" and evftype = \"output\" and evtype=\"email\" and evmap = \"email\"";
	var res = eventR.doSelect(query);
	if(res == RC_SUCCESS){
		var fields = lib.ArrayUtil.toJsArray(eventR.comments);
		var values = lib.ArrayUtil.toJsArray(eventR.values);
		var index_sep = lib.ArrayUtil.indexOf(fields,separator_field);
		if(index_sep > -1){
			separator = values[index_sep];
		}
	
	}
	return separator;
}

/**
* Check if the string is an Email Address or multiple email addresses.
* Allow to use semicolon to seperate multiple email addresses
*@param {String} email
*@param {boolean} multi
*@return {Boolean} isEmailAddress
*/
function isEmailAddress(email, multi) {
    if (!email) {
        return false;
    }

    var emailList = [email];
    if (multi) { // support multi email address
        emailList = email.split(";");
    }
    
    var count = 0;
    var i;
    var address;
    for (i=0; i<emailList.length; i++) {
        if (emailList[i]) {
            address = emailList[i].trim();
            if (address.length>0) { // skip empty part
                result = isSingleEmailAddress(address);
                if (!result) {
                    // failed when there is one illegal email address
                    return false;
                } else {
                    count++;
                }
            }
        }
    }
    
    // contain one email address at least
    return count>0;
}

/**
* Check if the string is an Email Address.
* Currently, only check if the string contains one and only one @, as an enhancement of RAD expression defined in check.emails isaddress panel, and check.address.
* index("@", $L.name)>1 and index("@", $L.name)<$L.lngth
* index("@", $L.email.address)>1 and index("@", $L.email.address)<lng($L.email.address)
*@param {String} email
*@return {Boolean} isSingleEmailAddress
*/
function isSingleEmailAddress(email){
	if(!email){
		return false;
	}

	//var reg = /^[_a-z0-9-+]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9]+)*$/i;
	var reg = /^[^@!^]+@[^@]+$/i;
	var index = email.search(reg);
	if(index>-1){
		return true;
	}

	return false;
}

function isRequestDetailSectionDisplay(){
	var display = "";
	if("SMSP" == vars.$G_sm_portal){
		display = "none";
	}
	return display;
}

function getEmailSubject(emailSubject,receiver){
    return getEmailMessage(emailSubject, "global",receiver);
}
    
function getEmailBody(emailBody,receiver){
    var tok = "scmsg:";
    var bindex = emailBody.indexOf(tok);
    if (bindex == 0) {
        var scTemp = emailBody.substring(tok.length, emailBody.length);
        emailBody = getEmailMessage(scTemp, "SmartEmail",receiver);
    }
    return emailBody;
}
    
function getEmailMessage(msgid,classd,receiver){
    var emailMessage = null;
    var lang = lib.NotificationRecipientsHelp.determinLang(receiver);
    emailMessage = _localscmsg(lang,classd,msgid);

    
    if (!emailMessage) {
        emailMessage = "DEFAULT EMAIL Message";
    }
    return emailMessage;
}

function toEmailAddress(recipient) {
	var query = 'contact.name="' + recipient + '" or operator.id="' + recipient + '"';
	var contact = $("contacts", SCFILE_READONLY).setFields(['email']).select(query).uniqueResult();
	if (contact) {
		return contact.email;
	}
	return recipient;
}

/**
* This function is used for upgrading, since key field is added to mail, we need set value to this field before set the field to primary key.
*
**/
function upgradeMailno(){
	var query = 'true';

	$("mail").select(query).iterate(function(record) {
		if(!record["mailno"]){
			record["mailno"] = newMailno();
			record.doUpdate();
		}
       });
}

function newMailno() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, "mail");
    return newid.getText();
}

function validateNumberOfProcessor(str){
	var valid =  /^\+?([1-9]\d*)$/.test(str);
	var result = true;
	var msg = '';
	if(valid){
		var processors = str - 0;
		if(processors < 1){
			result = false;
		}
	}else{
		result = false;
	}
	if(!result){
		var label = funcs.scmsg("SmartEmail;numOfProcessors", "local:settingsConfig");
		msg = funcs.scmsg("invalid_num_processors", "SmartEmail",[label]);
	}
			
	return msg;
}

function validateNumberOfSchedulePerProcessor(str){
	var valid =  /^\+?([1-9]\d*)$/.test(str);
	var result = true;
	var msg = '';
	if(valid){
		var processors = str - 0;
		if(processors < 1 || processors > 10){
			result = false;
		}
	}else{
		result = false;
	}

	if(!result){
		var label = funcs.scmsg("SmartEmail;smartEmailSchedulePerProcessor", "local:settingsConfig");
		msg = funcs.scmsg("invalid_schedule_per_processor", "SmartEmail",[label]);
	}
			
	return msg;
}

function setupSmartEmailProcessors(numOfProcessors,numOfSchPerProc){
	var msg1 = validateNumberOfProcessor(numOfProcessors);
	if(msg1){
		return msg1;
	}
	var msg2 = validateNumberOfSchedulePerProcessor(numOfSchPerProc);
	if(msg2){
		return msg2;
	}
	numOfProcessors = numOfProcessors - 0;
	numOfSchPerProc = numOfSchPerProc - 0;
	var sch_name = 'background SmartEmail processor';
	var processor_name = 'SmartEmail_Processor';
	var class_name = 'SmartEmail_Processor';

	var sch_temp = new SCFile("schedule",SCFILE_READONLY);
	var query = 'name = "' + sch_name + '"';
	var ret = sch_temp.doSelect(query);
	if(ret != RC_SUCCESS){
		
		return funcs.scmsg("scheduler_not_exist", "SmartEmail",[sch_name]);
	}
	
	var processor = new SCFile("info",SCFILE_READONLY);
	var query_processor = 'type = "' + processor_name + '"';
	ret = processor.doSelect(query_processor);
	if(ret != RC_SUCCESS){
		return funcs.scmsg("processor_not_exist", "SmartEmail",[processor_name]);
	}

	var rad_param1 = processor["process.start.infos"][0]['parameters'][0];
	var rad_param3 = processor["process.start.infos"][0]['parameters'][2];
	var rad_param4 = processor["process.start.infos"][0]['parameters'][3];
	var used_sch_names = [];
	var used_processor_names = [];
	used_processor_names.push(processor_name);
	used_sch_names.push(sch_name);
	var j;
	for(j = 0; j < numOfProcessors; j++){
		var temp = new SCFile("info");
		var processor_name_temp = processor_name;
		if(j > 0){
			processor_name_temp = processor_name + j;
		}
		
		var i;
		for (i = 0; i < numOfSchPerProc; i++){
			
			var index = j * numOfSchPerProc + i;
			var clazname = class_name;
			if(index > 0){
				clazname = class_name + index;
			}
			temp["process.start.infos"][i]['name'] = clazname;
			temp["process.start.infos"][i]['parameters'][0] = rad_param1;
			temp["process.start.infos"][i]['parameters'][1] = clazname;
			temp["process.start.infos"][i]['parameters'][2] = rad_param3;
			temp["process.start.infos"][i]['parameters'][3] = rad_param4;
			if(index > 0){
				var sch = new SCFile("schedule");
				var sch_name_temp = sch_name + index;
				var query_temp = 'name="' + sch_name_temp + '"';
				ret = sch.doSelect(query_temp);
				if(ret != RC_SUCCESS){
					recordCopy(sch_temp,sch,"schedule");
					sch.name = sch_name_temp;
					sch.schedule_id = newScheduleId();
					sch["class"] = clazname;
					sch["rescheduled"] = 'rescheduled';
					sch.sched_class = clazname;
					ret = sch.doInsert();
					if(ret != RC_SUCCESS){
						return funcs.scmsg("fail_create_schedule", "SmartEmail",[sch.name]);
					}
				}
			}
			used_sch_names.push(sch_name_temp);
		}
		
		var processor_new = new SCFile('info');
		var query_processor_create = 'type = "' + processor_name_temp + '"';
		ret = processor_new.doSelect(query_processor_create);
		if(ret != RC_SUCCESS){
			processor_new["type"] = processor_name_temp;
			processor_new["format"] = processor['format'];
			processor_new["description"] = processor['description'];
			processor_new["process.start.infos"] = temp["process.start.infos"];
			ret = processor_new.doInsert();
		}else{
			processor_new["process.start.infos"] = temp["process.start.infos"];
			ret = processor_new.doUpdate();
		}

		if(ret != RC_SUCCESS){
			return funcs.scmsg("fail_update_processor", "SmartEmail",[processor_name]);
		}
		used_processor_names.push(processor_name_temp);
	}
	
	try{
		var deleteQuery = 'name#"' + sch_name + '" and not name isin ' + funcs.str(used_sch_names);
		$("schedule").select(deleteQuery).iterate(function(record){
			record.doDelete();
		});
		var deleteQuery2 = 'type#"' + processor_name + '" and not type isin ' + funcs.str(used_processor_names);
		$("info").select(deleteQuery2).iterate(function(record){
			record.doDelete();
		});
		
	}catch(e){
		logger.warn('Failed to delete redundant schedule for SmartEmail.');
	}
	
	return '';
}

function newScheduleId()
{
      var count = new SCFile("counters");
      var query = 'table.name="schedule"';
      count.doSelect(query);
      var id = count["current.value"];
      count["current.value"] = id + 1;
      count.doUpdate();
      return id;
}


function recordCopy(source,target,file){
		var sch_file = lib.dbdictHelper.initDbdictFile(file);
		var field;
		for (field in sch_file.field){
			var field_name = sch_file.field[field].name;
			target[field_name] = source[field_name];
		}
	
}


/** >>>> Added for group email */ 
function _getAssignmentMemberGroup(group, hasSmartToken){
	if(hasSmartToken || _.isEmpty(group.memberGroupEmail)){
		return funcs.denull(group.operators);
	} else {
		return [group.memberGroupEmail];
	}
}

function _getAssignmentApproverGroup(group, hasSmartToken){
	if(hasSmartToken || _.isEmpty(group.approverGroupEmail)){
		return funcs.denull(group.approvers);
	} else {
		return [group.approverGroupEmail];
	}
}

function getAssignmentGroupEmail(group, subGroupName, body){
	var hasSmartToken = false;
	if(body) {
		hasSmartToken = hasToken(funcs.str(body));
	}
	
	if("Manager"==subGroupName){
		return [group.wdManagerName];
	}
	
	if("members"==subGroupName || "Operators"==subGroupName){
		return _getAssignmentMemberGroup(group, hasSmartToken);
	}
	
	if("approvers"==subGroupName || "Approvers"==subGroupName){
		return _getAssignmentApproverGroup(group, hasSmartToken);
	}
	
	if(_.isEmpty(subGroupName) || subGroupName=="all" || subGroupName=="All") {
		var list = [];
		lib.ArrayUtil.addAll(list, _getAssignmentMemberGroup(group, hasSmartToken));
		lib.ArrayUtil.addAll(list, _getAssignmentApproverGroup(group, hasSmartToken));
		return list;
	}
	
	return [];	
}
