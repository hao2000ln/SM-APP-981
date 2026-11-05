var $ = lib.c.$;

  var CACHED_USERS = {};
  var LDAP_TEMPLATE_OPERATOR="*SYSDEFAULTS";  
  var CONTACTS_FIELDS = [{fieldName: 'full.name', objectName: 'fullName'},
    {fieldName: 'operator.id', objectName: 'loginName'},
    {fieldName: 'dept.name', objectName: 'department'},
    {fieldName: 'title', objectName: 'title'},
    {fieldName: 'contact.phone', objectName: 'workPhone'},
    {fieldName: 'extension', objectName: 'workPhoneExt'},
    {fieldName: 'email', objectName: 'email'}];
  var BASIC_TABLES = ['contacts', 'operator', 'assignment'];
  
  var topUsersNumber = 50; // the maximun number of returned searched users.
  
  var supportList = null;
  
  var config = initConfig();

  function getSupportList(){
    if(supportList == null){
      initConfig();
    }
    return supportList;
  }
  
  function initConfig(){
    supportList = [];
    config = {};
    
    $('smcconfig',SCFILE_READONLY).setFields(["userFields","fileName","idField","displayField","smcEnabled"]).selectAll().iterate(function(record){
      var userFields = record.userFields;
      var sourceFields = [];
      var targetFiles = [];
      var i;
      var length = funcs.lng(userFields);
      for(i = 0; i < length; i++){
        sourceFields.push(userFields[i].sourceField);
        targetFiles.push(userFields[i].targetFile);
      }
      config[record.fileName] = {
        "sourceFields": sourceFields,
        "targetFiles": targetFiles
      };
      if(record.smcEnabled) {
        supportList.push({
          fileName: record.fileName,
          numberField: record.idField,
          descField: record.displayField
        });
      }
    });
    return config;
  }
  
  function getConfigInfo() {

    return {
      
      smcEnabled: lib.settings.getSettingValue("Collaboration","smcEnabled"),
      domainName: lib.settings.getSettingValue("Collaboration","openfireDomainName"),
      boshURL: lib.settings.getSettingValue("Collaboration","smcBoshURL"),
      pluginURL: lib.settings.getSettingValue("Collaboration","smcPluginURL"),
      maxParticipants: lib.settings.getSettingValue("Collaboration","maxparticipants"),
      notificationDelayTime: lib.settings.getSettingValue("Collaboration","notificationDelaySeconds"),
      chatServiceURL: lib.settings.getSettingValue("Collaboration","chatserviceurl"),
      endUserChatEnabled: (funcs._null(lib.settings.getSettingValue("Collaboration","endUserChatEnabled")) || lib.settings.getSettingValue("Collaboration","endUserChatEnabled")=="0")?"false":"true"
    };
  }
  
  function getCollaborationSettingValue(setting, settingName){
	var index = funcs.index(settingName, setting.settingId );
	if(index > 0){
		if(setting.settingValue[index - 1]=="null") {
		 	setting.settingValue[index - 1]=null;
		}
		return setting.settingValue[index - 1];
	}
	return null;
  }

  function hasConversation(fileName, id){
    var conversation = $('conversation',SCFILE_READONLY).setFields(["object"]).select('object = "' + lib.StringUtil.escapeAllStr(fileName) + '" and objectid = "' + lib.StringUtil.escapeAllStr(id) + '"').uniqueResult();
    if(conversation){
      return true;
    } else {
      return false;
    }
  }
  
  function getConversation(fileName, id){
    var existing = true;
    var conversation = $('conversation', SCFILE_READONLY).select('object = "' + lib.StringUtil.escapeAllStr(fileName) + '" and objectid = "' + lib.StringUtil.escapeAllStr(id) + '"').uniqueResult();
    if(conversation == null){
      conversation = new SCFile('conversation');
      conversation.object = fileName;
	  conversation.objectid = id;
	  conversation.conversationid = lib.UUID.generateUUID().toLowerCase();
	  conversation.doInsert();
	  existing = false;
	  createActivityLog(fileName, id);
    }
    
    var names = lib.ArrayUtil.toJsArray(funcs.denull(conversation.participants));
    var users = [];
    var i;
    for(i = 0; i < names.length; i++){
      var contact = getContactByOperator(names[i], '');
      if(contact){
        users.push(contact);
      }
    }
    
    return {
      fileName: conversation.object,
      id: conversation.objectid,
      conversationId: conversation.conversationid.toLowerCase(),
      existed: existing,
      participants: users
    };
  }
  
  function addParticipants(conversationId, participants){
    var users = [];
    var conversation = $('conversation').select('conversationid = "' + lib.StringUtil.escapeAllStr(conversationId) + '"').uniqueResult();
    if(conversation != null && participants != null && participants.length > 0){
      conversation.participants = funcs.denull(conversation.participants);
      var i;
      for(i = 0; i < participants.length; i++){
        if(lib.ArrayUtil.indexOf(conversation.participants, participants[i]) == -1){
          var contact = getContactByOperator(participants[i], '');
          if(contact){
            conversation.participants.push(participants[i]);
            users.push(contact);
          }
        }
      }
      conversation.doUpdate();
    }
    
    return users;
  }
  
  function removeParticipants(conversationId, participants) {
    var conversation = $('conversation').select('conversationid = "' + lib.StringUtil.escapeAllStr(conversationId) + '"').uniqueResult();
    if(conversation != null && participants != null && participants.length > 0){
      var i;
      for(i = 0; i < participants.length; i++){
        var index = lib.ArrayUtil.indexOf(conversation.participants, participants[i]);
        if( index != -1){
          conversation.participants = funcs._delete(conversation.participants, index + 1);
        }
      }
      conversation.doUpdate();
      return true;
    }
    return false;
  }
  
  /**
   * filename 'contacts', 'operator', 'assignment' should never go here, they're basic tables.
   * device table is special, when it could be both basic table or business table, acceptable.
   * id should not be an array, it must be single.
   */
  function getSuggestedUsers(lazy, filename, ticketId, field){
    if(!ticketId){
      return getTopGroups(filename);
    }

    var group = {groups:[], users:[]};

    if(filename == 'device'){
      group.name = getDisplayName(ticketId);
      concat(group.users, getContactsByCI(ticketId));
      return group;
    }

    var configInfo = config[filename];
    if(field){
      var index = lib.ArrayUtil.indexOf(configInfo.sourceFields, field);
      var targetFile = configInfo.targetFiles[index];
      if(targetFile){
        var ticket = getTicket(filename, ticketId);
        var fieldValue = ticket[field];
        if(fieldValue){
          if(lib.ArrayUtil.indexOf(BASIC_TABLES, targetFile) == -1){
            var valueType = funcs.type(fieldValue);
            var length = funcs.lng(funcs.denull(fieldValue));
            if(valueType == 8){
              var i;
              for(i = 0; i < length; i++){ 
                concat(group.groups, getChild(lazy, targetFile, fieldValue[i]));
              }
            } else {
              concat(group.groups, getChild(lazy, targetFile, fieldValue));
            }
          } else {
            concat(group.users, getUserGroup(targetFile, fieldValue));
          }
        }
      }
    }
    return group;
  }
  
  function getChild(lazy, targetFile, fieldValue){
    var child = {
      file: targetFile,
      id: fieldValue,
      name: targetFile == 'device' ? getDisplayName(fieldValue) : fieldValue,
      groups: [], 
      users:[]
    };
    if(!lazy){
      if(targetFile == 'device'){ 
        concat(child.users, getSuggestedUsers(lazy, targetFile, fieldValue).users);
      } else {
        concat(child.groups, getSuggestedUsers(lazy, targetFile, fieldValue).groups);
      }
    }
    return child;
  }
  
  function getTopGroups(filename){
    var group = {groups:[], users:[]};
    var configInfo = config[filename];
    var sourceFields = configInfo.sourceFields;
    var i;
    for(i = 0; i < sourceFields.length; i++){
      group.groups.push({
        field: sourceFields[i],
        name: getLocalizedCaption(sourceFields[i], filename)
      });
    }
    return group;
  }
  
  /**
   * filename could be any table including basic tables. id could be single or an array
   * return an array or an single element
   */
  function getUserGroup(filename, id){
    var idType = funcs.type(id);
    if(idType == 8){
      var list = [];
      var i;
      var length = funcs.lng(funcs.denull(id));
      for(i = 0; i < length; i++){
        concat(list, getUserGroup(filename, id[i]));
      }
      return list;
    } else {
      if(filename == 'contacts'){
        return getContact(id);
      } else if(filename == 'operator'){
        return getContactByOperator(id, '');
      } else if(filename == 'assignment'){
        return getContactsByAssignment(id);
      } /*else if(filename == 'device'){
        return getContactsByCI(id);
      } */else {
        return getGroup(filename, id, true);
      }
    }
  }
  
  /**
   * basic table should never go here, except 'device'.
   * usersOnly is only designed when filename is 'device' to determine if fields needed under CI level
   * if device is supported for SMC, the fields are needed
   * but more generally, business tables that reference to device, don't need device level fields.
   */
  function getGroup(filename, id, usersOnly){
    var group = {name: id, groups:[], users: []};
    if(filename == 'device' && usersOnly){
      group.name = getDisplayName(id);
      concat(group.users, getContactsByCI(id));
      return group;
    }
    var datadict = $('datadict',SCFILE_READONLY).select('name = "' + filename + '"').uniqueResult();
    if(datadict != null){
      var key = datadict.unique_key[0]; // currectly we only support single-field unique key
      var ticket = $(filename,SCFILE_READONLY).select(key + ' = "' + id + '"').uniqueResult();
      var sourceFields = config[filename].sourceFields;
      var targetFiles = config[filename].targetFiles;
      var i;
      for(i = 0; i < sourceFields.length; i++){
        var field = sourceFields[i];
        var value = ticket[field];
        var targetFile = targetFiles[i];
        var valueType = funcs.type(value);
        var length = funcs.lng(funcs.denull(value));
        if(((valueType == 8 && length > 0) || (valueType != 8 && value)) && targetFiles[i]){
          var fieldCaption = getLocalizedCaption(field, filename);
          var child = {name: fieldCaption, groups:[], users: []};
          var userGroup = getUserGroup(targetFile, value);
          if(lib.ArrayUtil.indexOf(BASIC_TABLES, targetFile) != -1){
            concat(child.users, getUserGroup(targetFile, value));
          } else {
            concat(child.groups, getUserGroup(targetFile, value));
          }
          group.groups.push(child);
        }
      }
    }
    return group;
  }
  
  function getTicket(filename, id){
    var datadict = $('datadict',SCFILE_READONLY).select('name = "' + lib.StringUtil.escapeAllStr(filename) + '"').uniqueResult();
    if(datadict){
      var key = datadict.unique_key[0]; // currectly we only support single-field unique key
      var ticket = $(filename,SCFILE_READONLY).select(key + ' = "' + lib.StringUtil.escapeAllStr(id) + '"').uniqueResult();
      return ticket;
    }
    return null;
  }
  
  /**
   * Get a series of contact info from contacts table
   */
   
  function getContact(id){
    if(CACHED_USERS[id] != null){
      return CACHED_USERS[id];
    }
    var contact = $('contacts',SCFILE_READONLY).setFields(['full.name','operator.id','dept.name','title','contact.phone','extension','email']).select('contact.name = "' + id + '"').uniqueResult();
    var user = {};
    if(!contact){
      user['loginName'] = id;
      var operator = $('operator', SCFILE_READONLY).setFields(["full.name","company"]).select('contact.name = "' + id + '"').uniqueResult();
      user['fullName'] = operator.full_name;
      user['modifiable'] = false;
      user['department'] = operator.company;
      return user;
    }
    var i;
    for(i = 0; i < CONTACTS_FIELDS.length; i++){
      var value = contact[CONTACTS_FIELDS[i].fieldName];
      user[CONTACTS_FIELDS[i].objectName] = (value == null ? '' : value);
    }
    
    CACHED_USERS[id] = user;
    
    return user;
  }
  
  /**
   * To get the contact's info by an operator, additionally, add the label to the contact info.
   */
  function getContactByOperator(operatorName, label, needPortrait){
    //skip the ldap template user to fix defect '16447' and '16443'
    if(operatorName===LDAP_TEMPLATE_OPERATOR){
       return null;
    }
    
    // DO NOT use tolower() because it will cause big performance issue in case sensitive environment
    var operator = $('operator',SCFILE_READONLY).setFields(["name","contact.name","full.name"]).select('name = "' + lib.StringUtil.escapeAllStr(operatorName) + '"').uniqueResult();
    if(operator == null){
      var operators = $('operator',SCFILE_READONLY).setFields(["name","contact.name","full.name"]).select('full.name = "' + lib.StringUtil.escapeAllStr(operatorName) + '"').list();
      if(operators.length == 1){
        operator = operators[0];
      }
    }
    if(operator){
      var contact = getContact(operator.contact_name); // legacy SMC stored this field in xml
      contact.label = label;
      contact.loginName = operator.name;
      contact.fullName = operator.full_name;
      
      if(needPortrait){
        contact.portrait = getPortraitByOperator(operator);
      }
      //get operator's assignment groups
      if((getConfigInfo()['endUserChatEnabled']==true || getConfigInfo()['endUserChatEnabled']=="true") && operatorName!==undefined && operatorName !==null && operatorName!==""){
    	var groups=[];
      var groupResult = $('assignment',SCFILE_READONLY).setFields(["name"]).select('helpdesk.group="true" and operators = "' + lib.StringUtil.escapeAllStr(operatorName) + '"').iterate(function (record){
    		groups.push(record['name']);
    	});
    	contact['assignment']=groups;
      }
      return contact;
    }
    return null;
  }
  
  /**
   * To get a list of contacts' info by an assignment, addtionally, add the label to all the contacts.
   */
  function getContactsByAssignment(assignment){
    var group = $('assignment',SCFILE_READONLY).setFields(["operators"]).select('name = "' + assignment + '"').uniqueResult();
    var operators = group.operators;// legacy SMC stored this field in xml
    var length = funcs.lng(operators);
    var i;
    var contacts = [];
    for(i = 0; i < length; i++){
      var contact = getContactByOperator(operators[i], assignment);
      if(contact){
        contacts.push(contact);
      }
    }
    return contacts;
  }
  
  /**
   * To get all the contacts from an ci
   */
  function getContactsByCI(ci){
    if(!ci){
      return [];
    }
    var device = $('device',SCFILE_READONLY).select('logical.name = "' + lib.StringUtil.escapeAllStr(ci) + '"').uniqueResult();
    var sourceFields = config['device'].sourceFields;
    var targetFiles = config['device'].targetFiles;
    var length = funcs.lng(sourceFields);
    var contacts = [];
    var i;
    for(i = 0; i < length; i++){
      var contact;
      if(targetFiles[i] == 'contacts'){
        var contactName = device[sourceFields[i]];
        if(contactName){
          contact = getContact(device[sourceFields[i]]);
          contact.label = getLocalizedCaption(sourceFields[i], 'device');
          contacts.push(contact);
        }
      } else if(targetFiles[i] == 'operator'){
        var caption = getLocalizedCaption(sourceFields[i], 'device');
        contact = getContactByOperator(device[sourceFields[i]], caption);
        if(contact){
          contacts.push(contact);
        }
      } else if (targetFiles[i] == 'assignment'){
        concat(contacts, getContactsByAssignment(device[sourceFields[i]]));
      } 
      //only contacts, operator and assignment field in device are supported, could be added when required.
    }
    return contacts;
  }
  
  function searchUsersByKey(key){
    //all the fields that will be searched on contacts table, if more needed, please add it into the array.
    var matchFields = ['contact.name', 'full.name', 'operator.id', 'email'];
    var i;
    var query = '';
    for(i = 0; i < matchFields.length; i++){
      query += (i != 0 ? ' or ' : ' ') + matchFields[i] + ' like "*' + lib.StringUtil.escapeAllStr(key) + '*"';
    }
    var users = [];
    var initNumber = 0;
    $('contacts',SCFILE_READONLY).setOrderBy(['full.name'], [SCFILE_ASC]).select(query).iterate(function(contact){
      var operator = $('operator',SCFILE_READONLY).select('name="' + contact.operator_id + '"').uniqueResult();
      if(operator && !operator.ess_access_only){
        users.push(converContactToUserInfo(contact));
        initNumber++;
      }
      if(initNumber == topUsersNumber){
        return users;
      }
    });
    return users;
  }
  
  /**
   * concat two array or insert an element into the array
   * param: elementOrArray can be an element or an array like its name.
   */
  function concat(array, elementOrArray){
    if(elementOrArray instanceof Array){
      lib.ArrayUtil.addAll(array, elementOrArray);
    } else if(elementOrArray){
      array.push(elementOrArray);
    }
  }
  
  function converContactToUserInfo(contact){
    var i;
    var user = {};
    for(i = 0; i < CONTACTS_FIELDS.length; i++){
      var value = contact[CONTACTS_FIELDS[i].fieldName];
      user[CONTACTS_FIELDS[i].objectName] = (value == null ? '' : value);
    }
    CACHED_USERS[contact.contact_name] = user;
    return user;
  }
  
  //priority 1: get it from dedicated scmsg if defined;
  //priority 2: get it from table field caption in scmsg if defined
  //priority 3: get it from datadict
  function getLocalizedCaption(field, table){
  	var caption = funcs.scmsg(table + ";" + field, "smcconfig");
  	if (caption.indexOf("Could not be found") != -1) {
      caption = lib.tableFunctions.getFieldCaption(field, table);
      var localized = funcs.scmsg(caption, "sccaption");
      if (localized.indexOf("Could not be found") === -1) {
        caption = localized;
      }
    }
    return caption;
  }
  
  function hasViewRight(table){
    var area = lib.security.getArea(table);
    return lib.security.getRights(area, 'view')=="true";
  }
  
  function getUserInfo(operatorName, needPortrait){
    return getContactByOperator(operatorName, '', needPortrait);
  }
  
  function getChatBotInfoByContext(chatEntityId, fileName, idField){
    var query = String(idField) + " = \"" + lib.StringUtil.escapeAllStr(chatEntityId) + "\"";
    var sdchat = $(fileName,SCFILE_READONLY).setFields(["sd.chat.bot"]).select(query).uniqueResult();
    if(sdchat){
      var botId=sdchat['sd.chat.bot'];
      if(botId){
        return getChatBotInfo(botId);
      }
      return null;
    }
    return null;
  }
  
  function getChatBotInfo(botId){
    var chatBot = $('sdchatbot',SCFILE_READONLY).select('number = "' + lib.StringUtil.escapeAllStr(botId) + '"').uniqueResult();
    if(chatBot){
      var chatBotInfo={};
      chatBotInfo['loginName']=botId;
      chatBotInfo['fullName']=chatBot['name'];
      chatBotInfo['portrait']={};
      var tmpPortrait=lib.EndUserChat.getChatbotPortrait(chatBot);
      if(tmpPortrait['portrait'] && tmpPortrait['portraitType']){
        chatBotInfo['portrait']['base64Image']=tmpPortrait['portrait'];
        chatBotInfo['portrait']['mimeType']=tmpPortrait['portraitType'];
      }
      else{
        chatBotInfo['portrait']=null;
      }
      return chatBotInfo;
    }
    return null;
  }
  
  /**
   * Following function is due to logical name change, device has new field for display name instead of 
   * logical name.
   */
  function getDisplayName(logicalName){
    var datadict = $('datadict',SCFILE_READONLY).select('name = "device"').uniqueResult();
    var displayField = datadict.display_field;
    if(displayField){
      var ci = $('device', SCFILE_READONLY).setFields([displayField]).select('logical.name = "' + lib.StringUtil.escapeAllStr(logicalName) + '"').uniqueResult();
      var displayName = ci[displayField];
      if(displayName){
        return displayName;
      }
    }
    return logicalName;
  }
    
  function getPortrait(userName){
    var operator = $('operator', SCFILE_READONLY).setFields(["contact.name"]).select('name = "' + lib.StringUtil.escapeAllStr(userName) + '"').uniqueResult();
    return getPortraitByOperator(operator);
  }
  
  function getPortraitByOperator(operator){
    if(operator){
      var contact = $('contacts', SCFILE_READONLY).setFields(["contact.name"]).select('contact.name = "' + operator.contact_name + '"').uniqueResult();
      if(!contact){
        return null;
      }
      var attachments = contact.getAttachments();
      if(attachments.length>0){
      	var index;
        for(index in attachments){
          var attachment = attachments[index];
          if(attachment.name == contact.contact_name && attachment.attachmentType == 'img'){
            return {base64Image: compressImage(attachment.value, 64, 128, true), mimeType: attachment.type};
          }
        }
        return null;
      }
      return null;
    }
    return null;
  }
  
  function setPortrait(imageInBase64, mimeType){
    var portrait = {"base64Image": imageInBase64, "mimeType": mimeType};
    var operatorName = funcs.operator();
    var operator = $('operator', SCFILE_READONLY).setFields(["contact.name"]).select('name = "' + operatorName + '"').uniqueResult();
    var contact = $('contacts', SCFILE_READONLY).setFields(["contact.name"]).select('contact.name = "' + operator.contact_name + '"').uniqueResult();
    var attachments = contact.getAttachments();
    var attachment;
    var index;
    var found = false;
    for(index in attachments){
      attachment = attachments[index];
      if(attachment.name == contact.contact_name && attachment.attachmentType == 'img'){
        attachment.type = mimeType;
        attachment.value = base64Decode(imageInBase64);
        contact.updateAttachment(attachment, 3);
        found = true;
      }
    }
    if(!found){
      attachment = new Attachment();
      attachment.type = mimeType;
      attachment.name = contact.contact_name;
      attachment.value = base64Decode(imageInBase64);
      contact.insertAttachment(attachment, 3);
    }
    return portrait;
  }
  
  function createActivityLog(filename, ticketId){
    var object = $('Object', SCFILE_READONLY).setFields(["activitylog.file.name"]).select('file.name = "' + filename + '"').uniqueResult();
    if(object && object.activitylog_file_name){
      var activityTable = object.activitylog_file_name;
      if(activityTable){
        var log = new SCFile(activityTable);
        log.number = ticketId;
        //For end user chat
        var op="";
        if(filename=="sdchat"){
          var sdchat = $('sdchat',SCFILE_READONLY).setFields(["contact"]).select('number = "' + ticketId + '"').uniqueResult();
          if(sdchat){
            op=lib.EndUserChat.getOperatorIdByContact(sdchat['contact']);
            if(op){
              log.description = ["Conversation was opened by " + op + "."];
		      log.operator = op;
            }
          }
        }
        //
        else{
          log.description = ["Conversation was opened by " + funcs.operator() + "."];
		  log.operator = funcs.operator();
		}
		log.datestamp = funcs.tod();
		log.type = "Collaboration";
		log.doSave();
      }
    }
  }
  
  function getIdleTime(){
    var idleTime = {};
    var sysIdleTime = getSysIdleTime();
    var operator = vars.$lo_operator;
    //var operator = $('operator').select('name = \"' + funcs.operator() + '\"').uniqueResult();
    
    idleTime.idlewarn = operator.idlewarn || sysIdleTime.idlewarn;
    idleTime.idletime = operator.idletime || sysIdleTime.idletime;
    return idleTime;
  }
  
  function getSysIdleTime(){
    var sysIdleTime = {};
    var infos = lib.InactiveTimerSetup.getInfo().process_start_infos;
    var i;
    var length = funcs.lng(infos);
    for(i = 0; i < length; i++){
      var info = infos[i];
      if(info.name == "idletime" || info.name == "idlewarn"){
        sysIdleTime[info.name] = info.parameters[0];
      }
    }
    return sysIdleTime;
  }

