/******************************************************
* Module Name: Survey integration Filter
* Function: get survey targets
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Mar., 2013
*******************************************************/

var $ = lib.c.$;
var _ = lib.Underscore.require();
var Class = lib.smis_Prototype.getClass();

var TaskProducerClass = Class.create({

  	initialize: function(surveyDefinition) {
		this.surveyDefinition = surveyDefinition;
		this.connector = lib.Survey_ConfigurationManager.getConnector(this.surveyDefinition);
        this.BATCH_COUNT = 5000;
  	},
  	
  	checkActiveTime: function() {
  		var now = new Date();
  		return this.surveyDefinition.activeFrom != null && this.surveyDefinition.activeFrom.getTime() <= now.getTime() && 
  			this.surveyDefinition.activeTo != null && this.surveyDefinition.activeTo.getTime() > now.getTime();
  	},
  	
  	// prepare survey tasks and push them to taskQueue
  	produceSurveyTasks: function() {
  		var log = this.surveyDefinition.getLogger();
  		log.info("Survey_TaskProducer", "producing tasks for survey: " + this.surveyDefinition.surveyId);
  		
  		this.updateLastUpdateTime();
  		if (!this.checkActiveTime()) {
  			log.info("Survey_TaskProducer", "This survey is not valid, please check active time.");
  			return;
  		}
		
		try {
        this.getSurveyData(this.surveyDefinition);
	  		log.info("Survey_TaskProducer",  "tasks will be pushed to task queue.");
		} catch (ex) {
            	log.error("Survey_TaskProducer", "Produce survey task for for survey:" + this.surveyDefinition.surveyId + ", error:" + ex);
		}
  	},
  	
  	/*
  	 @private
  	 @description get survey data: parameters and recipients after filtering
  	 @param {record} surveyDefinition - survey definition record
  	 @returns {array of object} - list of object containing parameters and recipients
  	*/
  	getSurveyData: function(surveyDefinition) {
  		var allEntryMap = [];
  		var allRecipients = [];
  		var log = this.surveyDefinition.getLogger();
  		
  		var key = this._getKeyField(surveyDefinition.tableName);

  		var entry = new SCFile(surveyDefinition.tableName);
  		var query = lib.Survey_Utilities.buildConcatenatedQuery(surveyDefinition);
			
		if (surveyDefinition.predefinedFilterId != null) {
			var inbox = new SCFile("inbox", SCFILE_READONLY);
			inbox.setFields(["sortBy"]);
			var result = inbox.doSelect("inbox.id="+surveyDefinition.predefinedFilterId);
			if (result == RC_SUCCESS) {
				var sorting = lib.Survey_Utilities.getSortFields(inbox.sortBy);
				if (sorting[0] && sorting[0].length > 0) {
				    entry.setOrderBy(sorting[0], sorting[1]);
				}
			}
		}
		
		try {
		    if (log.isDebugEnabled()) {
			    log.debug("Survey_TaskProducer", "querying entries using: " + query);
			}
			var ret = entry.doSelect(query);

      //QCCR1E136020 out of memory issue: refactor data processing to avoid holding all task in memory.
      //traverse one: prepare recipient list for filter, if no recipient filter defined, then skip.
      if (this.surveyDefinition.avoidDuplicate || this.surveyDefinition.noDisturb || this.surveyDefinition.randomSelection) {
          while (ret == RC_SUCCESS) {
              var tempRecipient = _.pluck(this.calculateRecipients(entry), 'email');
              _.each(tempRecipient,function(recp){allRecipients.push(recp);});
  			  ret = entry.getNext();
  		  }
      }

      //filter recipients
      var filterResult = lib.Survey_Filter.filterRecipients(allRecipients, surveyDefinition);

      //traverse two: process data
      ret = entry.getFirst();
      var counter = 0;
      var entryMaps;
      while (ret == RC_SUCCESS) {
        var entryMap = this.prepareMapData(entry, surveyDefinition, key);
        allEntryMap.push(entryMap);
        if (++counter === this.BATCH_COUNT) {
          //filter data
          entryMaps = this.filterEntries(allEntryMap, filterResult);
          //process data, subclass will implement this function
          this.processEntryList(entryMaps);
          //reset counter, allEntryMap
          counter = 0;
          allEntryMap = [];
        }

        ret = entry.getNext();
      }
      entryMaps = this.filterEntries(allEntryMap, filterResult);
      this.processEntryList(entryMaps);

		} catch(ex) {
			log.info("Survey_TaskProducer", "Failed to querying the entries: " + ex);
		}

		return null;
  	},
  	
  	_getKeyField: function(tableName) {
  		var key = null;
  		var keyField = lib.Survey_Utilities.getFileUniqueKey(tableName);
		if (keyField != null) {
			var list = keyField[0].split(",");
			key = list[list.length-1];
		}
		return key;
  	},
  	
  	prepareMapData: function(entry, surveyDefinition, key) {
		var paramMap = this.calculateParameters(entry);
		var recipients = this.calculateRecipients(entry);
		
		// generate weburl and essurl
		var url = lib.Survey_Utilities.genURL(entry, surveyDefinition.getLogger());
		paramMap["$WEBURL"] = url.web;
		paramMap["$ESSURL"] = url.ess;
		paramMap["$EXURL"] = surveyDefinition.externalSurveyUrl;
		paramMap["$EXTSID"] = surveyDefinition.externalSurveyId;
		
		var id = null;
		if (!key) {
			key = this._getKeyField(surveyDefinition.tableName);
		}
			
		if (key != null) {
			id = entry[key];
		}
		return {"ticketId": id, "surveyId": surveyDefinition.surveyId, "paramMap": paramMap, "recipients": recipients};
  	},
  	
  	calculateParameters: function(entry) {
  		var paramMap = {};
  		var parameterMapping = this.surveyDefinition.connectorDefinition.parameterMapping;
  		for (var i = 0; i < parameterMapping.length; i++) {
  			var parameterFile = parameterMapping[i];
			var paramNameValue = this._calculateParameter(entry, parameterFile);
			paramMap[paramNameValue.name] = paramNameValue.value;
  		}
  		
  		// calculate optional parameters
  		for (var j = 0; j < this.surveyDefinition.optionalParameters.length; j++) {
  			if (this.surveyDefinition.optionalParameters[j].fieldname != null) {
  				paramMap[this.surveyDefinition.optionalParameters[j].parameter] = this._getFieldValue(entry,this.surveyDefinition.optionalParameters[j].fieldname);
  	        }
  		}
  		
  		return paramMap;
  	},
  	
  	/*
  	 @private
  	 @description calculate parameter's value for a parameter mapping record
  	 @param {record} entry - entry file
  	 @param {record} entry - parameter mapping file
  	 @returns {object} - name/value pair
  	*/
  	_calculateParameter: function(entry, parameterFile) {
  		var value = null;
  		var mappingValue = parameterFile.mappingValue.replace(/^\s+|\s+$/g, '');
  		switch (parameterFile.mappingType) {
	  		case "field":
	  			//check field type, to avoid direct assignment of data type other than primitive types.
	  			//AGMCR10H9205 QCCR1E130401
	  			value = this._getFieldValue(entry,mappingValue);
	  			break;
	  		case "variable":
	  			value = vars[mappingValue];
	  			break;
	  		case "query":
	  			var scfile = new SCFile(parameterFile.lookupTable);
	  			
	  			var test = function($1, field){
					return "\""+funcs.str(entry[field])+"\"";
				};
				var regToReplace=new RegExp("(([\\w|\\.])*) in \\$L\.file","gi");
				var lookupQuery = parameterFile.lookupQuery.replace(regToReplace, test);
				
	  			var ret = scfile.doSelect(lookupQuery);
	  			if (ret == RC_SUCCESS) {
	  				value = scfile[parameterFile.lookupField];
	  			}
	  			break;
  			case "value":
  			case "predefined":
  				value = mappingValue;
  				break;
  			case "javascript":
  				try {
  					//value = eval("lib."+parameterFile.mappingValue+"(entry, this.surveyDefinition)");
  					value = lib.Survey_Utilities.evaluateExpression(mappingValue, entry);
  				} catch (ex) {
  					var log = this.surveyDefinition.getLogger();
  					log.error("Survey_TaskProducer", "Error when evaluating JavaScript: " + parameterFile.mappingValue + "Error: " + ex);
  				}
  				break;
	  	}
  		
  		return {"name": parameterFile.parameter, "value": value};
  	},
  	
  	/*
  	 @private
  	 @get the field value based on the field type, which does not support array of structure
  	 @param {record} entry - entry file
  	 @param {fieldName} string - field name
  	 @returns {string} - normalized string value
  	*/
  	_getFieldValue: function(entry, fieldName){
  		var value = 'Error: Complex field type is not supported.';
  		var fieldType = funcs.dbdict_helper("field.type", entry, fieldName);
	  	if($.isPrimitiveType(fieldType)){
	  		value = funcs.str(entry[fieldName]);
	  	}
	  	else if(fieldType === $.Array){
	  		var childFieldType = funcs.dbdict_helper("field.type", entry, fieldName+','+fieldName);
	  		if($.isPrimitiveType(childFieldType)){
	  			value = entry[fieldName].join();
	  		}
	  	}
  		return value;
  	},
  	
  	calculateRecipients: function(entry) {
  		var recipients = [];
  		var recipientMapping = this.surveyDefinition.connectorDefinition.recipientMapping;
  		var i, j, k;
  		for (i = 0; i < recipientMapping.length; i++) {
  			var recipientFile = recipientMapping[i];
  			var emailList = this._calculateRecipient(entry, recipientFile);
  			for (k = 0; k < emailList.length; k++) {
  				var notFound = true;
  				for (j = 0; j < recipients.length; j++) {
  					if (emailList[k].email == recipients[j].email) {
  						notFound = false;
  						break;
  					}
  				}
  				if (notFound) {
  					recipients.push(emailList[k]);
  				}
  			}
  		}
  		
  		return recipients;
  	},
  	
  	/*
  	 @private
  	 @description calculate recipient for a recipient mapping record
  	 @param {record} entry - entry file
  	 @param {record} entry - recipient mapping file
  	 @returns {array of string} - recipient list
  	*/
  	_calculateRecipient: function(entry, recipientFile) {
  		var list = [];
  		
  		var value = null;
  		switch (recipientFile.mappingType) {
  			case "field":
  				value = entry[recipientFile.recipient];
  				break;
  			case "variable":
  				var variableValue = recipientFile.recipient;
	  			value = vars[variableValue];
  				break;
  			case "value":
  				value = recipientFile.recipient;
   				break;
  			case "javascript":
  				try {
  					value = lib.Survey_Utilities.evaluateExpression(recipientFile.recipient, entry);
  				} catch (ex) {
  					var log = this.surveyDefinition.getLogger();
  					log.error("Survey_TaskProducer", "Error when evaluating JavaScript: " + recipientFile.recipient + ", Error: " + ex);
  				}
  				break;
  		}

		if (value != null) {
			// support multiple values
			var names = [];
			var len = 0;
			if (funcs.type(value) == 2) {
				names = value.split(";");
				len = names.length;
			}
			else if (funcs.type(value) == 8) {
				names = value;
				if (typeof names.length == "function") {
					len = names.length();
				}
				else {
					len = names.length;
				}
			}
				
			for (var i = 0; i < len; i++) {
				this._calculateRecipientInternal(list, names[i].replace(/^\s+|\s+$/g, ''), recipientFile);
			}
  		}
		
  		return list;
  	},
  	
  	_calculateRecipientInternal: function(list, value, recipientFile) {
  		switch (recipientFile.recipientType) {
  			case "person":
               var email = this._getRecipientEmail(value);
                        
               if (email != null) {
                       list.push(email);
               }                       
               else {
                	var res = /^[0-9a-zA-Z_\-\.]+@[0-9a-zA-Z_\-]+(\.[0-9a-zA-Z_\-]+)*$/;
  				 	var re = new RegExp(res);         
              	 	if (value.match(re) != null) { // is email
                		list.push({"email": value, "lan": null, "name": null});
               		}                       
               }
  				break;
  			case "group":
  				switch (recipientFile.group) {
  					case "assignment":
  						this._getGroupEmail(this._getAssignmentGroupMembers(value), list);
  						break;
  					case "cm3groups":
  						this._getGroupEmail(this._getCm3GroupMemebers(value, recipientFile.subgroup), list);
  						break;
  					case "ocmgroups":
  						this._getGroupEmail(this._getOcmGroupMemebers(value, recipientFile.subgroup), list);
  						break;
  					default:
  						break;
  				}
  				break;
  			default:
  				break;
  		}
  	},
  	
  	_getAssignmentGroupMembers: function(groupName) {
  		var list = [];
  		var assignment = new SCFile("assignment", SCFILE_READONLY);
  		assignment.setFields(["operators"]);
  		var ret = assignment.doSelect("name=\"" + groupName + "\"");
  		if (ret == RC_SUCCESS) {
  			this._getMembersFromSMList(assignment.operators, list);
  		}
  		return list;
  	},
  	
  	_getCm3GroupMemebers: function(groupName, subgroup) {
  		var list = [];
  		var cm3groups = new SCFile("cm3groups", SCFILE_READONLY);
  		cm3groups.setFields(["approvers", "members"]);
  		var ret = cm3groups.doSelect("name=\"" + groupName + "\"");
  		if (ret == RC_SUCCESS) {
			switch (subgroup) {
				case "approvers":
					this._getMembersFromSMList(cm3groups.approvers, list);
					break;
				case "members":
					this._getMembersFromSMList(cm3groups.members, list);
					break;
				case "all":
					this._getMembersFromSMList(cm3groups.approvers, list);
					this._getMembersFromSMList(cm3groups.members, list);
					break;
			}
  		}
  		return list;
  	},
  	
  	_getOcmGroupMemebers: function(groupName, subgroup) {
  		var list = [];
  		var ocmgroups = new SCFile("ocmgroups", SCFILE_READONLY);
  		ocmgroups.setFields(["approvers", "members"]);
  		var ret = ocmgroups.doSelect("name=\"" + groupName + "\"");
  		if (ret == RC_SUCCESS) {
			switch (subgroup) {
				case "approvers":
					this._getMembersFromSMList(ocmgroups.approvers, list);
					break;
				case "members":
					this._getMembersFromSMList(ocmgroups.members, list);
					break;
				case "all":
					this._getMembersFromSMList(ocmgroups.approvers, list);
					this._getMembersFromSMList(ocmgroups.members, list);
					break;
			}
  		}
  		return list;
  	},
  	
  	_getMembersFromSMList: function(smList, jsList) {
		var lng = funcs.lng( funcs.denull(smList));
		if ( lng == null ) {
			lng = 0;
		}
		for (var i = 0; i < lng; i++) {
			if (!lib.ArrayUtil.contains(jsList, smList[i])) {
				jsList.push(smList[i]);
			}
		}
  	},
  	
  	_getGroupEmail: function(members, list) {
  		for (var i = 0; i < members.length; i++) {
  			var email = this._getRecipientEmail(members[i]);
  			if (email != null) {
  				list.push(email);
  			}
  		}
  	},
  	
  	_getRecipientEmail: function(name) {
		var email = null;
		email = this._getContactEmail(name);
		if (email == null) {
			email = this._getOperatorEmail(name);
		}
			
		return email;
  	},
  	
  	/*
  	 get email from contact by contact.name
  	*/
  	_getContactEmail: function(contactName) {
  		var query = "contact.name=\"" + contactName + "\"";
  		var contact = new SCFile("contacts", SCFILE_READONLY);
  		contact.setFields(["email", "language", "full.name"]);
  		var ret = contact.doSelect(query);
  		if (ret == RC_SUCCESS && contact["email"] && lib.MailUtil.isEmailAddress(contact["email"])) {
  			return {"email": contact["email"], "lan": contact["language"], "name": contact["full.name"]};
  		}
  		return null;
  	},
	
	/*
	 get email from operator by name
	*/
  	_getOperatorEmail: function(name) {
  		var query = "name=\"" + name + "\"";
  		var operator = new SCFile("operator", SCFILE_READONLY);
  		operator.setFields(["email", "syslanguage", "full.name"]);
  		var ret = operator.doSelect(query);
  		if (ret == RC_SUCCESS && operator["email"] && lib.MailUtil.isEmailAddress(operator["email"])) {
  			return {"email": operator["email"], "lan": operator["syslanguage"], "name": operator["full.name"]};
  		}
  		return null;
  	},
  	
  	/*
  	 filter entries according to the recipients filtering result
  	 
  	 @param {Array} allEntryMap - list contains all entries
  	 @param {Array} filterResult - list contains filtering recipients
  	 
  	 @return {Array} - result contains all entries contains the filterred recipients
  	*/
  	filterEntries: function(allEntryMap, filterResult) {
        if(!this.surveyDefinition.avoidDuplicate && !this.surveyDefinition.noDisturb && !this.surveyDefinition.randomSelection){
            return allEntryMap;
        }
        
        var entryMap = [];
        var i, j, k;
  		for (i = 0; i < allEntryMap.length; i++) {
  			var map = allEntryMap[i];
  			var arr = [];
  			for (j = 0; j < map.recipients.length; j++) {
  				for (k = 0; k < filterResult.length; k++) {
  					if (filterResult[k] == map.recipients[j].email) {
  						arr.push(map.recipients[j]);
  						filterResult[k] = null;
  						break;
  					}
  				}
  			}
  			if (arr.length > 0) {
  				map = {"ticketId": map.ticketId, "surveyId": map.surveyId, "paramMap": map.paramMap, "recipients": arr};
  				entryMap.push(map);
  			}
  		}
  		return entryMap;
  	},

  	updateLastUpdateTime: function() {
  		var actionTime = lib.Survey_ScheduleManager.getLastScheduleProcessingTime(this.surveyDefinition);
  		if (actionTime == null) {
  			actionTime = new Date(0);
  		}
  		// update survey Definition record
  		var surveyFile = new SCFile("SurveyDefinition");
		var ret = surveyFile.doSelect("id=\"" + this.surveyDefinition.surveyId + "\"");
		if (ret == RC_SUCCESS) {
			surveyFile.lastProcessingTime = actionTime;
			var result = surveyFile.doAction("save");
			if (result == RC_SUCCESS) {
				lib.Survey_Logger.getLogger().info("Survey_TaskProducer", "Update last processing time successfully.");
			} else {
				lib.Survey_Logger.getLogger().info("Survey_TaskProducer", "Failed to update last processing time.");
			}
		}
  	}
});


function getClass() {return TaskProducerClass;}
