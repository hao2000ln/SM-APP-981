var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var arrayUtil = lib.ArrayUtil;
var getDescription = lib.QueryEditorParser.getDescription;
var assignmentWizard = lib.AssignmentWizard;

var assignmentFields = {
  varsList: [
    {"name": "$check.group.schedule", "default": false},
    {"name": "$assignment.type", "default": "auto"},
    {"name": "$default.group"},
    {"name": "$group.assign.type", "default": "predefined"},
    {"name": "$service.field.name"},
    {"name": "$contact.field.name"},
    {"name": "$group.fixed.value"},
    {"name": "$group.script"},
    {"name": "$is.service.based", "default": false},
    {"name": "$is.lang.based", "default": false},
    {"name": "$is.company.based", "default": false},
    {"name": "$is.location.based", "default": false},
    {"name": "$is.depart.based", "default": false},
    {"name": "$assignee.assign.type", "default": "none"},
    {"name": "$assignee.group.member.type"},
    {"name": "$assignment.time.field.name"},
    {"name": "$assignment.recent.days"},
    {"name": "$assignee.coordinator.type"},
    {"name": "$assignee.fixed.value"},
    {"name": "$assignee.script"},
    {"name": "$group.field.name"},
    {"name": "$assignee.field.name"},
    {"name": "$xmlStringGroup"},
    {"name": "$xmlStringAssignee"},
    {"name": "$assignment.byskill", "default": false}
  ],
  
  fieldsList: [
    'checkGroupSchedule',
    'assignmentType',
    'defaultGroup',
    'groupAssignType',
    'groupServiceFieldName',
    'contactFieldName',
    'groupFixedValue',
    'groupScript',
    'isGroupServiceBased',
    'isGroupLangBased',
    'isGroupCompanyBased',
    'isGroupLocationBased',
    'isGroupDepartmentBased',
    'assigneeAssignType',
    'assigneeGroupMemberType',
    'assignmentTimeFieldName',
    'assignmentTimeRecentDays',
    'assigneeCoordinatorType',
    'assigneeFixedValue',
    'assigneeScript',
    'groupFieldName',
    'assigneeFieldName',
    'groupQueryXml',
    'activeTicketQueryXml',
    '$assignmentBySkill'
  ],
  
  getVarByField: function(field_name) {
    var i;
    var field_len = this.fieldsList.length;
    for (i=0; i<field_len; i++) {
      if (this.fieldsList[i] === field_name && this.varsList[i]) {
        return this.varsList[i]["name"];
      }
    }
    return null;
  }
};


// reset fields with default values
function resetFields() {
  var i;
  var fields = assignmentFields.varsList;
  
  for (i=0; i<fields.length; i++) {
    if (fields[i]["default"] === undefined) {
      vars[fields[i]["name"]] = "";
    }
    else {
      vars[fields[i]["name"]] = fields[i]["default"];
    }
  }
}


function populateFields() {
  var rule_file = vars.$L_file;
  var table_name = null;
  if (!arrayUtil.isEmptyString(rule_file["tablename"])) {
    table_name = rule_file["tablename"][0];
  }

  if (table_name) {
    // init $assignment.fields & $assignment.fields.local
    var char_fields = assignmentWizard.getFileFields(table_name, $.Character);
    var array_fields = assignmentWizard.getFileFields(table_name, $.Array);
    var fieldValues = $.createSCArray();
    var fieldDisps = $.createSCArray();
    _.each(char_fields, function(field) {
      fieldValues.push(field.value);
      fieldDisps.push(field.disp);
    });
    _.each(array_fields, function(field) {
      fieldValues.push(field.value);
      fieldDisps.push(field.disp);
    });

    vars.$assignment_fields = fieldValues;
    vars.$assignment_fields_local = fieldDisps;
    
    // init $assignment.time.fields & $assignment.time.fields.local
    var fields = assignmentWizard.getFileFields(table_name, $.Datetime);
    fieldValues = $.createSCArray();
    fieldDisps = $.createSCArray();
    _.each(fields, function(field) {
      fieldValues.push(field.value);
      fieldDisps.push(field.disp);
    });

    vars.$assignment_time_fields = fieldValues;
    vars.$assignment_time_fields_local = fieldDisps;
  }

  if (rule_file["ruleId"] === 0) {
    resetFields();
    
    if (table_name) {
      var obj_file = new SCFile("Object", SCFILE_READONLY);
      obj_file.setFields(['workgroupFields', 'assignedToFields']);
      var rc = obj_file.doSelect('file.name="' + table_name +'"');
      if (rc == RC_SUCCESS) {
        if (!arrayUtil.isEmptyString(obj_file.workgroupFields)) {
          if (arrayUtil.contains(vars.$assignment_fields, obj_file.workgroupFields[0])) {
            vars.$group_field_name = obj_file.workgroupFields[0];
          }
        }
        if (!arrayUtil.isEmptyString(obj_file.assignedToFields)) {
          if (arrayUtil.contains(vars.$assignment_fields, obj_file.assignedToFields[0])) {
            vars.$assignee_field_name = obj_file.assignedToFields[0];
          }
        }
      }
    }
  }
  else {
    var rule_json = rule_file["ruleJSON"];
    var rule_xml = rule_file["ruleXML"];
    
    var assignmentConf;
    if(null==rule_json || ""==rule_json) {
	  if (_str.isBlank(rule_xml)) {
	    rule_xml = "<assignment></assignment>";
	  }
	  assignmentConf = assignmentWizard.parseRuleXML(rule_xml);
	} else {
	  assignmentConf = assignmentWizard.parseRuleJSON(rule_json);
	}

    var field;
    var field_var;
    for (field in assignmentConf) {
      field_var = assignmentFields.getVarByField(field);
      if (field_var) {
        vars[field_var] = assignmentConf[field];
      }
    }
    
    if (!_str.isBlank(vars["$xmlStringAssignee"])) {
	  vars["$assignee.query.desc"] = getDescription(vars["$xmlStringAssignee"]);
	}
	if (!_str.isBlank(vars["$xmlStringGroup"])) {
	  vars["$group.query.desc"] = getDescription(vars["$xmlStringGroup"]);
	}
    
    // adapt the record saved with the legacy configuration
    if (assignmentConf["groupAssignType"] === "serviceBased") {
      vars["$group.assign.type"] = "predefined";
      vars["$is.service.based"] = true;
    }
  } 
}


function saveFields() {
  var jsonObj = {};
  var fields = assignmentFields.fieldsList;
  var i;
  var field_var;

  for (i=0; i<fields.length; i++) {
    field_var = assignmentFields.getVarByField(fields[i]);
    if (field_var) {
      jsonObj[fields[i]] = vars[field_var];
    }
  }
  jsonObj.type = 'assignment';
  
  vars.$L_file.ruleJSON = rteJSONStringify(jsonObj);
}


function getAvailableAssignmentGroup(adHoc, query, checkWorkSch, type, maxGroupLen, currentRecord) {
  var groupValue=[];
  var msg = "";
  var group = new SCFile("assignment", SCFILE_READONLY);
  if (!adHoc) {
    group.setFields(['name','calendar.name','time.zone']);
    var sortOrder = [SCFILE_ASC];
    var sortFields = ["name"];
    group.setOrderBy(sortFields, sortOrder);
  }

  if (group.doSelect(query) === RC_SUCCESS) {
    do {
      if (checkWorkSch) {
        if (assignmentGroupIsAvailable(group['calendar.name'], group['time.zone'], currentRecord)) {
          groupValue.push(group['name']);
        }
      }
      else {
        groupValue.push(group['name']);
      }
      
      if (("auto" === type && groupValue.length > 0) || groupValue.length === maxGroupLen) {
        break;
      }            
    } while(group.getNext() === RC_SUCCESS);
  }

  return {
  	"group": groupValue,
  	"msg": funcs.scmsg("return.maxGroup", "local:assignmentRule", [maxGroupLen])
  };
}


function assignmentGroupIsAvailable(workSch,timeZone, currentRecord) {
  if (_str.isBlank(workSch)) {
    return true;
  }

  var workSchRecord = new SCFile("caldutyhours", SCFILE_READONLY);
  var sql = "name=\"" + workSch + "\"";
  if (workSchRecord.doSelect(sql) === RC_SUCCESS) {
   	var weeklyDuration = funcs.val(workSchRecord["weekly.duration"],1);
  	if(604800 == weeklyDuration){
  		return true;
  	}
  	
  	// use system default time zone if timeZone is empty
  	timeZone = _str.isBlank(timeZone)?vars.$G_system_info["time.zone"]:timeZone;
  	if (_str.isBlank(timeZone)) {
  		return false;
  	}

    var baseTime = getChatDateTime();
    var baseTimeStr = funcs.str(baseTime);
    var hdg = workSchRecord['holiday.table'];
    //there is holiday, need exclude holiday time
    if (hdg!==null && hdg!=="") {
      var hdRecord = new SCFile("calholidays",SCFILE_READONLY);
      var hdSql = "holiday.tables=\"" + hdg + "\" and start.date<='" + baseTimeStr + "' and end.date>='" + baseTimeStr + "'";
      //Current time is in holiday, group is not available, return false
      if (hdRecord.doSelect(hdSql) === RC_SUCCESS) {
        return false;
      }
    }
    //no holiday
    return checkWorkSchedule(workSchRecord, baseTime, timeZone, currentRecord);
  }
  return false;
}

function getChatDateTime() {
  return new Date();
}


function checkWorkSchedule(workSchRecord,baseTime,timeZone, currentRecord) {
  //conver basetime to assignment timezone
  var asgnmentTZTimeStr = lib.tzFunctions.convertDatetoStringonTZ(baseTime,lib.DateOrderConstant.yyyymmdd(),timeZone);
  var asgnmentTZTime = new Date(asgnmentTZTimeStr);
  var strTime = checkTime(asgnmentTZTime.getHours())+":"+checkTime(asgnmentTZTime.getMinutes())+":"+checkTime(asgnmentTZTime.getSeconds());
  var dayofweek = asgnmentTZTime.getDay();//0--6, 0 is sunday
  //full.day.1 begin.hour.1 end.hour.1 break.start.1 break.end.1 service.hours 
  if (dayofweek === 0) {
    dayofweek = 7;
  }
  var zeroTime = "00:00:00";
  var currentFullDay = workSchRecord["full.day."+dayofweek];
  var currentBeginHour = funcs.str(funcs.nullsub(workSchRecord["begin.hour."+dayofweek],zeroTime));
  var currentEndHour = funcs.str(funcs.nullsub(workSchRecord["end.hour."+dayofweek],zeroTime));
  if ((currentFullDay && currentEndHour===zeroTime) || (currentBeginHour!==zeroTime && currentEndHour===zeroTime)) {
    currentEndHour="24:00:00";
  }
  var currentBreakStart = funcs.str(funcs.nullsub(workSchRecord["break.start."+dayofweek],zeroTime));
  var currentBreakEnd = funcs.str(funcs.nullsub(workSchRecord["break.end."+dayofweek],zeroTime));
    
  var currentBreakStartOffset;
    
  //Full day
  if (currentFullDay) {
    //No break time, current work schedule is available
    if (currentBreakStart===zeroTime) {
      return true;
    }
    //there is break time
    else {
      if (currentBreakEnd===zeroTime) {
        //return strTime<=currentBreakStart;// TODO exclude offset
        currentBreakStartOffset=timeSubduction(getChatAsssignmentTimeOffset(currentRecord),currentBreakStart);
        return strTime<=currentBreakStartOffset;
      }
      //check current strTime is in start and end
      else{
        return !withinStartAndEnd(timeSubduction(getChatAsssignmentTimeOffset(currentRecord),currentBreakStart),currentBreakEnd,strTime);
      }
    }
  }
  //not full day, need check begin/end/break hours
  else{
    //working hours is zero
    if (currentBeginHour===currentEndHour) {
      return false;
    }
    else {
      //is in working hours
      if (withinStartAndEnd(currentBeginHour,timeSubduction(getChatAsssignmentTimeOffset(currentRecord),currentEndHour),strTime)) {
        //No break time, check if current work schedule is available
        if (currentBreakStart===zeroTime) {
          //return strTime<=currentEndHour;// TODO exclude offset
          currentBreakStartOffset=timeSubduction(getChatAsssignmentTimeOffset(currentRecord),currentEndHour);
          return strTime<=currentBreakStartOffset;
        }
        //there is break time
        else {
          if (currentBreakEnd===zeroTime) {
            //return strTime<=currentBreakStart;// TODO exclude offset
            currentBreakStartOffset=timeSubduction(getChatAsssignmentTimeOffset(currentRecord),currentBreakStart);
            return strTime<=currentBreakStartOffset;
          }
          //check current strTime is in start and end
          else {
            return !withinStartAndEnd(timeSubduction(getChatAsssignmentTimeOffset(currentRecord),currentBreakStart),currentBreakEnd,strTime);
          }
        }
      }
      //not in working hours
      else {
        return false;
      }
    }
  }
}


function checkTime(i) {
  if (i<10) {
    i = "0" + i;
  }
  return i;
}


function withinStartAndEnd(start,end,dateStr) {
  if (end>=start) {
    return (dateStr>=start && dateStr<=end);
  }
  else {
    return !(dateStr>end && dateStr<start);
  }
}


function timeSubduction(timeStr1,timeStr2) {
  var hour1=timeStr1.substring(0,timeStr1.indexOf(":"));
  timeStr1=timeStr1.substring(timeStr1.indexOf(":")+1);
  var minute1=timeStr1.substring(0,timeStr1.indexOf(":"));
  var second1=timeStr1.substring(timeStr1.indexOf(":")+1);
       
  var hour2=timeStr2.substring(0,timeStr2.indexOf(":"));
  timeStr2=timeStr2.substring(timeStr2.indexOf(":")+1);
  var minute2=timeStr2.substring(0,timeStr2.indexOf(":"));
  var second2=timeStr2.substring(timeStr2.indexOf(":")+1);
        
  var hour=(hour2-hour1)<0?(hour2-hour1)+24:(hour2-hour1);
  if((minute2-minute1)<0) {
    hour--;
  }
  var minute=(minute2-minute1)<0?(minute2-minute1)+60:(minute2-minute1);
  if((second2-second1)<0) {
    minute--;
  }
  var second=(second2-second1)<0?(second2-second1)+60:(second2-second1);
    
  return(checkTime(hour)+":"+checkTime(minute)+":"+checkTime(second));
}


function getChatAsssignmentTimeOffset(currentRecord){
  if(currentRecord===undefined || currentRecord === null || funcs.filename(currentRecord)!=="sdchat"){
    return "00:00:00";
  }
  var s = new SCFile("settings", SCFILE_READONLY);
  var sql = 'name="Service Desk"';
  if (s.doSelect(sql)===RC_SUCCESS) {
    var stids=s.settingId;
    var stvalues=s.settingValue;
    var i;
    var stids_len = stids.length();
    for (i=0;i<stids_len;i++) {
	  if (stids[i]==="chat.assignment.offset") {
	    if (stvalues[i]===null || stvalues[i]==="") {
	      stvalues[i]="00:00:00";
	    }
	    return stvalues[i];
      }
    }
  }
  else {
    return "00:00:00";
  }
}


//get contacts infor by contact.name (not full name)
function getUserProfile(record,contactfieldname) {
  var profile={};
  profile['invalid']=true;
  if(contactfieldname===null || contactfieldname==="" || record[contactfieldname]===null||record[contactfieldname]===""){
    return profile;
  }
  var contact=new SCFile("contacts",SCFILE_READONLY);
  var sql="contact.name=\""+record[contactfieldname]+"\"";
  sql += " or operator.id=\""+record[contactfieldname]+"\"";
  if(contact.doSelect(sql)===RC_SUCCESS){
    profile['invalid']=false;
    profile['company']=contact['company'];
    profile['dept']=contact['dept'];
    profile['location']=contact['location'];
    if(funcs.filename(record)=="sdchat"){
      profile['language']=(record['user.language']==""||record['user.language']==null)?"en":record['user.language'];
    }
    else{
      profile['language']=(contact['language']==""||contact['language']==null)?"en":contact['language'];
    }
  }
  return profile;
}