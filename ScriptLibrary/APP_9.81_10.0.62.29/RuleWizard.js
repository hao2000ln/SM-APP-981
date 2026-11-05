


function populateRule(theRule, ruleset, position, type, addUpdate)
{
	var i = position - 1;
	if ( theRule.ruleId == 0 || theRule.ruleId == null )
	{
		if ( ruleset.lastRuleId == null )
		{
			ruleset.lastRuleId = 0;
		}
		theRule.ruleId = ruleset.lastRuleId + 1;
		ruleset.lastRuleId = theRule.ruleId;
	}	

	ruleset.rule[i].ruleXML = theRule.ruleXML;
	ruleset.rule[i].ruleDesc = theRule.ruleDesc;
	ruleset.rule[i].ruleId = theRule.ruleId;
	ruleset.rule[i].isGroup = theRule.isGroup;
	ruleset.rule[i].parentGroup = theRule.parentGroup;

	if (typeof(theRule.condition) == "boolean" && (ruleset.rule[i].condition == null || typeof(ruleset.rule[i].condition)=="boolean")) {	
		ruleset.rule[i].condition = (theRule.condition == true)?  "true" : "false";
	}
	else {
	    ruleset.rule[i].condition = funcs.val( theRule.condition, 10 );
	}

	if (ruleset.rule[i].condition == null ) 
	{
		if (theRule.condition != null) 
		{			
			if (typeof(theRule.condition) == "boolean") {			
				ruleset.rule[i].condition = (theRule.condition == true)?  "true" : "false";
		    }
			else {
			    ruleset.rule[i].condition = theRule.condition;
			}	
		}	
		else {
		    ruleset.rule[i].condition = "true";
		}	
	}	
	ruleset.rule[i].conditionXML = theRule.conditionXML;
	ruleset.rule[i].conditionDesc = theRule.conditionDesc;
	ruleset.rule[i].fullDesc = getFullDesc( theRule );
	ruleset.rule[i].level = theRule.level;
	// by Xiong-jie MA, to support JSON string instead of XML string
	ruleset.rule[i].type = theRule.type;
	ruleset.rule[i].ruleJSON = theRule.ruleJSON;
}

function getFullDesc( rule )
{
	var desc;
	var indent = "";

	if (typeof(rule.condition) == "boolean") {
		rule.condition = (rule.condition == true)?  "true" : "false";
	}
		
	if ( rule.condition == null || rule.condition == "")
	{
		desc =  rule.ruleDesc;
	}
	else if (rule.condition == "true" && rule.conditionDesc == null)
	{
		desc =  rule.ruleDesc;
	}
	else
	{
		var cd;
		if ( rule.conditionDesc == null || rule.condition == "" )
		{
			cd = rule.condition;
		}
		else
		{
			cd = rule.conditionDesc;
		}
		desc = rule.ruleDesc + " (when " + cd +")";
	}
	if ( rule.isGroup == true )
	{
		desc = "[" + desc + "]";
	}
	if ( rule.parentGroup > 0 )
	{
		
		for (var i=0; i < rule.level; i++)
		{
			indent = "    " + indent;
		}
		desc = indent + "-  " + desc;
	}
	return desc;
}

function getRuleForEdit( ruleset, position )
{
	var rule = new SCFile("Rule");
    if (position <= 0) {
        return rule;
    }
    
	var i = position - 1;
	
	rule.ruleXML = ruleset.rule[i].ruleXML;
	rule.ruleDesc = ruleset.rule[i].ruleDesc;
	rule.ruleId = ruleset.rule[i].ruleId;
	rule.isGroup = ruleset.rule[i].isGroup;
	rule.parentGroup = ruleset.rule[i].parentGroup;
	rule.condition = ruleset.rule[i].condition;
	rule.conditionDesc = ruleset.rule[i].conditionDesc;
	rule.conditionXML = ruleset.rule[i].conditionXML;
	rule.level = ruleset.rule[i].level;
	// by Xiong-jie MA, to support JSON string instead of XML string
	rule.type = ruleset.rule[i].type;
	rule.ruleJSON = ruleset.rule[i].ruleJSON;

	return rule;
}

function ruleUp ( ruleset, line, action, field )
{
	var groupParent = 0;
	var level = 0;
	var i = line - 1;
	var cursorLine;
	var structure;
	var prefix;
	var type;
	
	if ( line > 1 )
	{
		if (action=="ruleUp" && field=="fullDesc" )
		{
			type = "rule";
		}
		else 	if (action=="up" && field=="actionFullDesc" )
		{
			type = "actionRuleXML";
			structure = "action";
			prefix = "action";
		}

		if ( type != null )
		{
			var pos = 0;
			
			vars.$L_temp = funcs.insert( vars.$L_temp, 1, 1 );
			vars.$L_temp[pos++] = ruleset.rule[i];
			var groupLevel = ruleset.rule[i].level;
			
			ruleset.rule= funcs._delete(ruleset.rule, line, 1 );
			while ( ruleset.rule[i].level > groupLevel )
			{
				vars.$L_temp = funcs.insert( vars.$L_temp, 0, 1 );
				vars.$L_temp[pos++] = ruleset.rule[i];
				ruleset.rule= funcs._delete( ruleset.rule, line, 1);
			}
			line -= 1;
			cursorLine = line;
			i--;
			if ( i > 0 )
			{
				groupParent = ruleset.rule[i].parentGroup;
				level = ruleset.rule[i].level;
			}
			for (var p = 0; p < pos; p++ )
			{
				ruleset.rule = funcs.insert( ruleset.rule, line++, 1, vars.$L_temp[p] );
				if ( p == 0 )
				{
					ruleset.rule[i].parentGroup = groupParent;
					ruleset.rule[i].level = level;
				}
				else
				{
					var myLevel = getParentLevel( ruleset.rule, ruleset.rule[i].parentGroup );
					
					ruleset.rule[i].level = myLevel + 1;
				}
	
				var rule = getRuleForEdit( ruleset, i + 1 );
				var desc = getFullDesc( rule );
				ruleset.rule[i].fullDesc = desc;
				i++;
			}
		}
	}

	vars.$L_line = cursorLine;
	if (vars.$L_line == null) {
	    vars.$L_line = 1;
	}
}

function ruleDown ( ruleset, line, action, field )
{
	var groupParent = 0;
	var level = 0;
	var i = line - 1;
	var cursorLine = line;
	var type;
	var structure;
	var prefix;
	
	if (action=="ruleDown" && field=="fullDesc" )
	{
		type = "rule";
	}
	else 	if (action=="down" && field=="actionFullDesc" )
	{
		type = "actionRuleXML";
		structure = "action";
		prefix = "action";
	}

	if ( type != null )
	{
		var pos = 0;
		vars.$L_temp = funcs.insert( vars.$L_temp, 1, 1 );
		vars.$L_temp[pos] = ruleset.rule[i];
		var groupLevel = ruleset.rule[i].level;
		ruleset.rule = funcs._delete( ruleset.rule, line, 1 );
		while ( ruleset.rule[i].level > groupLevel )
		{
			vars.$L_temp = funcs.insert( vars.$L_temp, 0, 1 );
			vars.$L_temp[++pos] = ruleset.rule[i];
			ruleset.rule = funcs._delete( ruleset.rule, line, 1);
		}

		if ( line  <= funcs.denull(ruleset.rule).length() )
		{	
			if ( ruleset.rule[i].isGroup == true )
			{
				groupParent = ruleset.rule[i].ruleId;
				level = ruleset.rule[i].level + 1;				
			}
			else
			{		
				groupParent = ruleset.rule[i].parentGroup;
				level = ruleset.rule[i].level;
			}

			line += 1;
			cursorLine = line;
			i++;
		}
		for ( var p = 0; p <= pos; p++ )
		{
			ruleset.rule = funcs.insert( ruleset.rule, line++, 1, vars.$L_temp[p] );
			if ( p == 0 )
			{
				ruleset.rule[i].parentGroup = groupParent;
				ruleset.rule[i].level = level;
			}
			else
			{
				var myLevel = getParentLevel( ruleset.rule , ruleset.rule[i].parentGroup);
				
				ruleset.rule[i].level = myLevel + 1;
			}
			var rule = getRuleForEdit( ruleset, i + 1 );
		
			var desc = getFullDesc( rule );
			
			ruleset.rule[i].fullDesc = desc;
			i++;
			
		}
		
	}
	vars.$L_line = cursorLine;
}

function removeRule ( ruleset, line, action, field )
{
	var groupParent = 0;
	var level = 0;
	var i = line - 1;
	var cursorLine;
	var structure;
	var prefix;
	var type;

	if ( line > 0 )
	{
		if (action=="removeRule" && field=="fullDesc" )
		{
			type = "ruleXML";
			structure = "rule";
		}
		else 	if (action=="removeRule" && field=="actionFullDesc" )
		{
			type = "actionRuleXML";
			structure = "action";
			prefix = "action";
		}

		if ( type != null )
		{
			var pos = 0;
			
			if ( ruleset.rule[i] != null )
			{
				var groupLevel = ruleset.rule[i].level;
			}
			else {
				var groupLevel = 0;
		    }
			ruleset.rule = funcs._delete(ruleset.rule, line, 1 );
			while ( ruleset.rule[i].level > groupLevel )
			{
				vars.$L_temp = funcs.insert( vars.$L_temp, 0, 1 );
				vars.$L_temp[pos++] = ruleset.rule[i];
				
				ruleset.rule= funcs._delete( ruleset.rule, line, 1);
			}
			line -= 1;
			cursorLine = line;
		}
	}

	vars.$L_line = cursorLine;
	if (vars.$L_line == null) {
	   vars.$L_line = 1;
	}
}

function getParentLevel( structure, parentId )
{
	if ( structure != null )
	{
		for (var i = 0, iLoopTimes = structure.length(); i < iLoopTimes; i++)
		{
			if ( structure[i].ruleId == parentId )
			{
				return  structure[i].level;
			}
		}
	}
}




/**
 * Popup the rule types of current rule set, which is invoked by triggered before add/update the rule set.
 * Also for QCCR1E119214, [Performance Improvement] convert the format of rule from xml to json, 
 * beside the type, we also add the logic to popup the ruleJSON field.
 * @return boolean true if we need to change the rule type; false if it is not necessary.
 */
function popupRuleType(ruleset) {
    if(null === ruleset) {
    	return false;
    }
    var rules = ruleset.rule;
    if(rules===null || rules.length()<=0) {
        return false;
    }
    var retFlag = false;
	for(var i=0, len=rules.length(); i<len; i++) {
	    var rule = rules[i];
	    if(rule.type===null || rule.type==="") {
	        if(rule.isGroup==true) {
	            rule.type = "ruleGroup";
	        } else {
	            if(rule.ruleXML==null) {
	                continue;
	            }
	            rule.type = lib.RuleEngine.getType("<rule>" + rule.ruleXML + "</rule>");
	        }
	        retFlag = true;
	    }
	    if(rule.type!="ruleGroup" && (rule.ruleJSON===null || rule.ruleJSON==="")) {
	        var xml = new XML();
	        var jsonObj = {"type":rule.type};

	        if(rule.type=="clearFields") {
	            if (xml.setContent(rule.ruleXML)) {
	                var fields = [];
	                jsonObj.fieldList = fields;
	                var parent = xml.getDocumentElement();
					var fieldList = lib.xmlHelpers.getElement(parent, "fieldList", null);
					if(null!=fieldList) {
						var checkField = fieldList.getFirstChildElement();
						do {
						    var aField = {};
							var clear = checkField.getAttributeValue("Clear");
							var fieldName = checkField.getValue();
							aField.fieldName = fieldName;
							aField.Clear = clear;
							fields.push(aField);
	
						    checkField = checkField.getNextSiblingElement();
						} while (checkField != null);
					}
				}
	        } else if(rule.type=="mandatoryFields") {
	            if (xml.setContent(rule.ruleXML)) {
	                var fields = [];
	                jsonObj.fieldList = fields;
	                var parent = xml.getDocumentElement();
	                var messageType = lib.xmlHelpers.getElement(parent, "messageType", null);
	                if(null!=messageType) {
	                    jsonObj.messageType = messageType.getValue();
	                }
	                var validateAll = lib.xmlHelpers.getElement(parent, "validateAll", null);
	                if(null!=validateAll) {
	                    jsonObj.validateAll = validateAll.getValue();
	                }
					var fieldList = lib.xmlHelpers.getElement(parent, "fieldList", null);
					if(null!=fieldList) {
						var checkField = fieldList.getFirstChildElement();
						do {
						    var aField = {};
							var defaultV = checkField.getAttributeValue("default");
	
							var fieldName = checkField.getValue();
							aField.fieldName = fieldName;
							aField["default"] = defaultV;
							fields.push(aField);
	
						    checkField = checkField.getNextSiblingElement();
						} while (checkField != null);
					}
				}
	        } else if(rule.type=="popupMessageBox") {
	            if (xml.setContent(rule.ruleXML)) {
	                var parent = xml.getDocumentElement();
					var popupMessage = lib.xmlHelpers.getElement(parent, "popupMessage");
					var popupType = lib.xmlHelpers.getElement(parent, "popupType");
					var okLevel = lib.xmlHelpers.getElement(parent, "okLevel");
					var okType = lib.xmlHelpers.getElement(parent, "okType");
					var yesnoType = lib.xmlHelpers.getElement(parent, "yesnoType");
					var yesnocancelType = lib.xmlHelpers.getElement(parent, "yesnocancelType");

					if (popupMessage != null) {
					    var messageNumber = lib.xmlHelpers.getElement(popupMessage, "messageNumber");
					    var messageScript = lib.xmlHelpers.getElement(popupMessage, "messageScript");
					    if (messageNumber != null) {
					      jsonObj.messageNumber = messageNumber.getValue();
					    } else if (messageScript != null) {
					      jsonObj.messageScript = messageScript.getValue();
					    } else {
					      jsonObj.popupMessage = popupMessage.getValue();
					    }
					} else {
					    jsonObj.popupMessage = "";
					}
					if (popupType != null) {
					    jsonObj.popupType = popupType.getValue();
					} else {
					    // default to OK
					    jsonObj.popupType = "0";
					}
					if (okLevel != null) {
					    jsonObj.okLevel = okLevel.getValue();
					} else {
					    // default to info
					    jsonObj.okLevel = "1";
					}
					if (okType != null) {
					    jsonObj.okType = okType.getValue();
					} else {
					    jsonObj.okType = "";
					}
					if (yesnoType != null) {
					    jsonObj.yesnoType = yesnoType.getValue();
					} else {
					    // default to Yes=Continue,No=Stop
					    jsonObj.yesnoType = "1";
					}
					
					if (yesnocancelType != null) {
					    jsonObj.yesnocancelType = yesnocancelType.getValue();
					} else {
					    // default to Cancel=Stop
					    jsonObj.yesnocancelType = "1";
					}
				}
	        } else if(rule.type=="sendHTMLEmail") {
	            if (xml.setContent(rule.ruleXML)) {
	                var parent = xml.getDocumentElement();
	                var tempName = lib.xmlHelpers.getElement(parent, "tempName", null);	
	                var recipient = lib.xmlHelpers.getElement(parent, "recipient", null);
	                var js = lib.xmlHelpers.getElement(parent, "js", null);

	                var userList = lib.xmlHelpers.getElement(parent, "userList", null);
	                var group = lib.xmlHelpers.getElement(parent, "group", null);
	                var field = lib.xmlHelpers.getElement(parent, "field", null);
	                if (tempName != null) {
		                jsonObj.tempName = tempName.getValue();
		                jsonObj.recipient = recipient.getValue();
		                if(jsonObj.recipient=="Set Using Javascript") {
			                jsonObj.js = js.getValue();
		                }  
		                if(jsonObj.recipient=="Users") {
			                var userListObj = {};
			                jsonObj.userList = userListObj;
			                userListObj.sendTo = userList.getAttributeValue("sendTo");
			                var checkUser= userList.getFirstChildElement();
			                userListObj.user = [];
			                do {
				                if (checkUser != null) {
					                var user = checkUser.getValue();
					                userListObj.user.push(user);
				                }		
				                checkUser = checkUser.getNextSiblingElement();
			                } while(checkUser != null); 
		                } 
	
		                if(jsonObj.recipient=="Group") {
			                var groupObj = {};
			                jsonObj.group = groupObj;
			                groupObj.type = group.getAttributeValue("type");
			                if(groupObj.type=="assignment") {
			                    groupObj.value = group.getValue();
			                }
			                if(groupObj.type=="cm3groups") {
			                    groupObj.value = group.getValue();
			                }
			                if(groupObj.type=="ocmgroups") {
			                    groupObj.value = group.getValue();
			                }
			                if(groupObj.type=="kmgroup") {
			                    groupObj.value = group.getValue();
			                }
			                if(groupObj.type=="assignment" || groupObj.type=="kmgroup") {
			                	groupObj.sendTo=group.getAttributeValue("sendTo");
			                }
			                if(groupObj.type=="cm3groups" || groupObj.type=="ocmgroups") {
			                	groupObj.sendTo=group.getAttributeValue("sendTo");
			                }
		                }
		                if(jsonObj.recipient=="Current Record") {
		                	var fieldObj = {};
			                jsonObj.field = fieldObj;
			                fieldObj.value = field.getValue();
			                fieldObj.type = field.getAttributeValue("type");
			                if(fieldObj.type=="cm3groups" || fieldObj.type=="ocmgroups") {
			                	fieldObj.sendTo = field.getAttributeValue("sendTo");
			                }
			                if(fieldObj.type=="assignment" || fieldObj.type=="kmgroup") {
			                	fieldObj.sendTo = field.getAttributeValue("sendTo"); 
			                }
		                } 
	                }
				}
            } else if (rule.type == "validateList") {
                if (xml.setContent(rule.ruleXML)) {
                    var parent = xml.getDocumentElement();
                    var messageType = lib.xmlHelpers.getElement(parent, "messageType", null);
                    if (messageType != null) {
                        jsonObj.messageType = messageType.getValue();
                    }

                    if (lib.xmlHelpers.getElement(parent, "toList", null) != null) {
                        jsonObj.toList = lib.xmlHelpers.getElement(parent, "toList", null).getValue();
                    }
                    if (lib.xmlHelpers.getElement(parent, "fieldName", null) != null) {
                        jsonObj.fieldName = lib.xmlHelpers.getElement(parent, "fieldName", null).getValue();
                    }
                    if (lib.xmlHelpers.getElement(parent, "toGlobal", null) != null) {
                        jsonObj.toGlobal = lib.xmlHelpers.getElement(parent, "toGlobal", null).getValue();
                    }

                    var manualItems = [];
                    jsonObj.manualList = manualItems;

                    var List = lib.xmlHelpers.getElement(parent, "manualList", null);
                    if (List != null) {
                        var checkList = List.getFirstChildElement();
                        do {
                            if (checkList == null) {
                                break;
                            }

                            var toManual = checkList.getValue();

                            if (toManual != null) {
                                manualItems.push(toManual);
                            }

                            checkList = checkList.getNextSiblingElement();
                        }
                        while (checkList != null);
                    }
                }
            } else if (rule.type == "validateRange") {
                if (xml.setContent(rule.ruleXML)) {
                    var parent = xml.getDocumentElement();

                    var messageType = lib.xmlHelpers.getElement(parent, "messageType", null);
                    var fieldName = lib.xmlHelpers.getElement(parent, "fieldName", null);
                    var comparison = lib.xmlHelpers.getElement(parent, "comparison", null);
                    var rangeType = lib.xmlHelpers.getElement(parent, "rangeType", null);
                    var compareField = lib.xmlHelpers.getElement(parent, "compareField", null);
                    var value = lib.xmlHelpers.getElement(parent, "value", null);

                    var not = comparison.getFirstChildElement();
                    var operator = not.getNextSiblingElement();

                    var compareField1 = compareField.getFirstChildElement();
                    var compareField2 = compareField1.getNextSiblingElement();

                    var value1 = value.getFirstChildElement();
                    var value2 = value1.getNextSiblingElement();

                    if (messageType != null) {
                        jsonObj.messageType = messageType.getValue();
                    }
                    if (fieldName != null) {
                        jsonObj.fieldName = fieldName.getValue();
                    }
                    if (rangeType != null) {
                        jsonObj.rangeType = rangeType.getValue();
                    }
                    jsonObj.comparison = {};
                    if (not != null) {
                        jsonObj.comparison.not = not.getValue();
                    }
                    if (operator != null) {
                        jsonObj.comparison.operator = operator.getValue();
                    }

                    jsonObj.compareField = {};
                    if (compareField1 != null) {
                        jsonObj.compareField.cField1 = compareField1.getValue();
                    }
                    if (compareField2 != null) {
                        jsonObj.compareField.cField2 = compareField1.getValue();
                    }

                    jsonObj.value = {};
                    if (value1 != null) {
                        jsonObj.value.value1 = value1.getValue();
                    }
                    if (value2 != null) {
                        jsonObj.value.value2 = value2.getValue();
                    }

                }
            } else if (rule.type == "validateRecord") {
                if (xml.setContent(rule.ruleXML)) {
                    var parent = xml.getDocumentElement();
                    var elm = parent.getFirstChildElement();
                    while (elm != null) {
                        jsonObj[elm.getName()] = elm.getValue();
                        elm = elm.getNextSiblingElement(jsonObj);
                    }
                    var fillFields = [];
                    jsonObj.fillDataList = fillFields;

                    //get fill data
                    var fieldList = lib.xmlHelpers.getElement(parent, "fillDataList", null);
                    if (fieldList != null) {
                        var checkField = fieldList.getFirstChildElement();
                        do {
                            if (checkField == null) {
                                break;
                            }
                            var fillField = {};
                            var fillFrom = lib.xmlHelpers.getElement(checkField, "fillFrom");
                            if (fillFrom != null) {
                                fillField.fillFrom = fillFrom.getValue();
                            }
                            var fillTo = lib.xmlHelpers.getElement(checkField, "fillTo");
                            if (fillTo != null) {
                                fillField.fillTo = fillTo.getValue();
                            }
                            fillFields.push(fillField);
                            checkField = checkField.getNextSiblingElement();
                        }
                        while (checkField != null);
                    }

                }
	        } else if(rule.type=="mandatoryVariables") {
	            if (xml.setContent(rule.ruleXML)) {
	                var fields = [];
	                jsonObj.fieldList = fields;
	                var parent = xml.getDocumentElement();
	                var messageType = lib.xmlHelpers.getElement(parent, "messageType", null);
	                if(null!=messageType) {
	                    jsonObj.messageType = messageType.getValue();
	                }
	                var validateAll = lib.xmlHelpers.getElement(parent, "validateAll", null);
	                if(null!=validateAll) {
	                    jsonObj.validateAll = validateAll.getValue();
	                }
					var fieldList = lib.xmlHelpers.getElement(parent, "variableList", null);
					if(null!=fieldList) {
						var checkField = fieldList.getFirstChildElement();
						do {
						    var aVariable = {};
							var defaultV = checkField.getAttributeValue("default");
	
							var variableName = checkField.getValue();
							aVariable.variableName = variableName;
							aVariable["default"] = defaultV;
							fields.push(aVariable);
	
						    checkField = checkField.getNextSiblingElement();
						} while (checkField != null);
					}
				}
			} else if (rule.type == "validateDate") {
				if (xml.setContent(rule.ruleXML)) {
					var parent = xml.getDocumentElement();				
					var messageType = lib.xmlHelpers.getElement( parent, "messageType", null );	
					var fieldName = lib.xmlHelpers.getElement( parent, "fieldName", null );
					var comparison = lib.xmlHelpers.getElement( parent, "comparison", null );
					var rangeType = lib.xmlHelpers.getElement( parent, "rangeType", null );
					var compareField = lib.xmlHelpers.getElement( parent, "compareField", null );
					var dateValue = lib.xmlHelpers.getElement( parent, "dateValue", null );
					 
					 jsonObj.comparison = {};
					 jsonObj.compareField = {};
					 jsonObj.dateValue = {};
					
					if (fieldName != null) 
					{
					 jsonObj.messageType = messageType.getValue();
					 jsonObj.fieldName = fieldName.getValue();
					 jsonObj.rangeType = rangeType.getValue(); 
					 
					 var not = comparison.getFirstChildElement();
					 jsonObj.comparison.not=not.getValue();
					 var operator=not.getNextSiblingElement();
					 jsonObj.comparison.operator= operator.getValue();
					
					 
					 var compareField1 = compareField.getFirstChildElement();
					 jsonObj.compareField.cField1=compareField1.getValue();
					 var offset1=compareField1.getNextSiblingElement();
					 jsonObj.compareField.offset1=offset1.getValue();
					 var daysValue1 = offset1.getNextSiblingElement();
					 jsonObj.compareField.days1 = daysValue1.getValue();
					 var hoursValue1 = daysValue1.getNextSiblingElement();
					 jsonObj.compareField.hours1 = hoursValue1.getValue();
					 var minutesValue1 =hoursValue1.getNextSiblingElement();
					 jsonObj.compareField.mins1 =minutesValue1.getValue();
					 var compareField2 =minutesValue1.getNextSiblingElement();
					 jsonObj.compareField.cField2=compareField2.getValue();
					 var offset2=compareField2.getNextSiblingElement();
					 jsonObj.compareField.offset2=offset2.getValue();
					 var daysValue2 = offset2.getNextSiblingElement();
					 jsonObj.compareField.days2 = daysValue2.getValue();
					 var hoursValue2 = daysValue2.getNextSiblingElement();
					 jsonObj.compareField.hours2 = hoursValue2.getValue();
					 var minutesValue2 =hoursValue2.getNextSiblingElement();
					 jsonObj.compareField.mins2 =minutesValue2.getValue();
					 
					 var dateValue1 =dateValue.getFirstChildElement();
					 jsonObj.dateValue.dateValue1 =dateValue1.getValue();
					 var dateValue2 =dateValue1.getNextSiblingElement();
					 jsonObj.dateValue.dateValue2 =dateValue2.getValue(); 
					 
					}
					else
					{
					 jsonObj.messageType="pop-up";
					 	
					 jsonObj.rangeType="Field";
					
					 jsonObj.compareField.offset1="+";
					
					 jsonObj.compareField.days1 = 0;
					
					 jsonObj.compareField.hours1 =0;
					
					 jsonObj.compareField.mis1 =0;
					
					 jsonObj.compareField.offset2="+";
					
					 jsonObj.compareField.days2 = 0;
					
					 jsonObj.compareField.hours2 = 0;
					
					 jsonObj.compareField.mins2 =0;
					}
				}
	        } else if(rule.type != "setField" && rule.type!="JSValidate" && rule.type!="callMacro"
	           && rule.type!="callExternalURL" && rule.type!="callProcess" && rule.type!="callWizard" && rule.type!="CaseExchange" && rule.type!="notification" && rule.type!="runSMScript"
	           && rule.type!="assignment" && rule.type!="runAction" && rule.type!="runScheduledAction" && rule.type!="setNumber" && rule.type!="setClock") { // TODO, only handle js validation rule type for the time being, to be remove later...
	            continue;
	        } else {// common approch to convert
				if (xml.setContent(rule.ruleXML)) {
					var parent = xml.getDocumentElement();
					var elm = parent.getFirstChildElement();
			        while(elm!=null) {
			            jsonObj[elm.getName()] = elm.getValue();

			            elm = elm.getNextSiblingElement(jsonObj);
			        }
				}
			}
	        rule.ruleJSON = rteJSONStringify(jsonObj);
	        rule.ruleXML = null;
	        retFlag = true;
	    }
	}

	return retFlag;
}

/**
 * Popup the rule types of all rule set, which should be invoked after upgrade in customer ENV.
 * Also for QCCR1E119214, [Performance Improvement] convert the format of rule from xml to json, 
 * beside the type, we also add the logic to popup the ruleJSON field.
 */
function popupAllRuleType() {
    //turn off the trigger
    var ret = new Datum();
    funcs.rtecall("trigger", ret, 0);

    var ruleset = new SCFile("RuleSet");
    var rc = ruleset.doSelect("true");
    funcs.log("Starting to fill the rule type if it is empty for all RuleSets...");
    var count=0;
    while(rc == RC_SUCCESS) {
    	if(popupRuleType(ruleset)) {
    	  ruleset.doUpdate();
    	  count++;
    	  if(count%100 == 0) {
    	      funcs.log(" " + count + " RuleSets are updated to fill rule type.");
    	  }
    	}
    	rc = ruleset.getNext();
    }
    funcs.log("Finished filling the rule type, total " + count + " RuleSets are updated.");

    //turn on the trigger
    funcs.rtecall("trigger", ret, 1);
}


function clearRuleType(ruleset) {
    if(null === ruleset) {
    	return false;
    }
    var rules = ruleset.rule;
    if(rules===null || rules.length()<=0) {
        return false;
    }
    var retFlag = false;
	for(var i=0, len=rules.length(); i<len; i++) {
	    var rule = rules[i];
	    if(rule.type!==null && rule.type!=="") {
            rule.type = null;
	        retFlag = true;
	    }
	}

	return retFlag;
}

function clearAllRuleType() {
    //turn off the trigger
    var ret = new Datum();
    funcs.rtecall("trigger", ret, 0);

    var ruleset = new SCFile("RuleSet");
    var rc = ruleset.doSelect("true");
    while(rc == RC_SUCCESS) {
    	if(clearRuleType(ruleset)) {
    	  ruleset.doUpdate();
    	}
    	rc = ruleset.getNext();
    }

    //turn on the trigger
    funcs.rtecall("trigger", ret, 1);
}
