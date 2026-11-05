var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = system.functions.str;
var _index = lib.ArrayUtil.indexOf;
var parse_evaluate = system.functions.parse_evaluate;
var lng = system.functions.lng;
var toJsArray = lib.ArrayUtil.toJsArray;
var getTag = lib.DBUtils.getTagByRecord;
var arrayUtil = lib.ArrayUtil;

/**
 * entrance of todoalert queue insertion
 * @param  {SCFile} object      $L.object
 * @param  {SCFile} record      $L.file
 * @param  {SCFile} alertDef    $L.alert
 * @param  {SCFile} alertRecord $L.alertrec
 * @return {[type]}             [description]
 */
function insert(object, record, alertDef, alertRecord){
	//get general field value
	var fields = {};

	var temp_fileName = system.functions.filename(record);
	var temp_unique = record[object.unique_field[0]]; 

	fields.fileName = temp_fileName;
	fields.recordId = temp_unique;
	fields.channel = alertDef['todo.type'];
	fields.msgText = alertDef['todo.msg'];
	fields.recordUpdateTime = record['sysmodtime'];
	fields.alertName = alertDef.name;
	fields.alertType = alertDef.alert_type;
	fields.folder = record['folder'];
	fields.tag = getTag(record);
	
	// set mandantan field
	var mandantenField = _getMandantenField(fields.fileName);
	if (mandantenField != null && mandantenField != "") {
		fields.company = record[mandantenField];
	}
	
	var targets = {};
	//set targets
	_setTarget(object, record, targets, fields, alertDef);
	//process insertion
	_processInsertion(fields, targets);

}

/**
 * get the mandanten field
 * @param  {String} filename
 * @return {String} mandanten field name
 */
function _getMandantenField(filename) {
	if (!system.functions.nullsub(vars.$G_system_info["multi.company"], false)) {
		return null;
	}
	
	var scmandant = $('scmandant', SCFILE_READONLY).setFields(["fieldname"]).select('filename="' + filename + '"').uniqueResult();
	if (scmandant) {
		return scmandant.fieldname;
	}
	
	return null;
}

/**
 * do the insertion and notify client
 * @param  {Object} fields  general field values
 * @param  {Object} targets target info
 * @return {[type]}         [description]
 */
function _processInsertion(fields, targets){

	var todoAlert = _findOrCreate(fields);

	var ack = todoAlert.ack;

	var temp_users = [];
	var temp_groups = [];
	var notify_users = [];

	_.each(targets, function(targetInfo, operator) {
		if(targetInfo.insert) temp_users.push(operator);
		if(targetInfo.group) temp_groups.push(targetInfo.group);
		
		//push notification by target locale
		if(targetInfo.notifyClient && !ack) {
			notify_users.push(operator);
		}
	});
	
	if (notify_users.length > 0) {
		var notify_user_groups = {};
		_.each(notify_users, function(user) {
			var user_config = lib.TodoAlertDao.getUserAlertConfig(user);
			var locale = user_config['syslanguage'];
			var date_order = user_config['date.order'];
			//group the users by the preferred language and date order
			if (locale in notify_user_groups) {
				if (date_order in notify_user_groups[locale]) {
					notify_user_groups[locale][date_order].push(user);
				}
				else {
					notify_user_groups[locale][date_order] = [user]
				}
			}
			else {
				notify_user_groups[locale] = {};
				notify_user_groups[locale][date_order] = [user];
			}
		});

		var locale_bak = system.functions.sysinfo_get("languagecode");
		_.each(notify_user_groups, function(users_by_lan, language) {
			system.functions.userlang(language);
			todoAlert['type'] = fields.channel;
			todoAlert['message.text'] = _getMsg(fields.msgText);
			
			_.each(users_by_lan, function(users_by_dateorder, dateorder) {
				lib.ClientCommandUtils.addOrUpdateTodoAlert(users_by_dateorder, todoAlert, dateorder);
			});
		});
		//set locale back
		system.functions.userlang(locale_bak);
	}		

	todoAlert['target.user'] = _.uniq(temp_users);
	todoAlert['target.group'] = _.uniq(temp_groups);
	//set type and message back to raw value
	todoAlert['type'] = fields.channel;
	todoAlert['message.text'] = fields.msgText;

	todoAlert.doSave();
}

function _getOperatorLocale(operator){
	var op = $('operator', SCFILE_READONLY).setFields(['syslanguage']).select('name="'+operator+'"').uniqueResult();
	if(!op) return system.functions.sysinfo_get("languagecode");
	else if(!op.syslanguage) return system.functions.sysinfo_get("languagecode");
	return op.syslanguage;
}

function _findOrCreate(fields){

	var todoAlert = new SCFile("TodoAlertList");
	var query = 'alert.name="'+fields.alertName+'" and record.id="'+fields.recordId+'" and file.name="'+fields.fileName+'"';

	var rc = todoAlert.doSelect(query);
	if (rc === RC_SUCCESS){
		_copyFields(fields, todoAlert);
		return todoAlert;
	}
	else{
		_copyFields(fields, todoAlert);
		todoAlert.ack = false;
		todoAlert.doSave();
		return todoAlert;
	}
}

/**
 * copy fields to record
 * @param  {Object} fields  general field values
 * @param  {SCFile} record todoalertlist
 * @return {[type]}        [description]
 */
function _copyFields(fields, record){
	record['type'] = fields.channel;
	record['record.id'] = fields.recordId;
	record['file.name'] = fields.fileName;
	record['message.text'] = fields.msgText;
	record['record.update.time'] = fields.recordUpdateTime;
	record['alert.name'] = fields.alertName;
	record['alert.type'] = fields.alertType;
	record['folder'] = fields.folder;
	record['record.tag'] = fields.tag;
	if (fields.company) {
		record['company'] = fields.company;
	}
}

/**
 * set target user info
 * @param {SCFile} object  $L.object
 * @param {SCFile} record  $L.file
 * @param {Object} targets target user info
 * @param {Object} fields  general field values
 */
function _setTarget(object, record, targets, fields, alertDef){
	
	if(alertDef['alert.type'] === "approval"){
		_setApprovalTargets(object, record, targets, fields);
		return;
	}

	var assignees = [];
	var assigneeFields = toJsArray(system.functions.denull(object.assignedToFields));
	var assignGroupFields = toJsArray(system.functions.denull(object.workgroupFields));

	//get current assignees from record
	for (var i = assigneeFields.length - 1; i >= 0; i--) {
		var assignee = record[assigneeFields[i]];
		if (assignee) assignees.push(_getOperator(assignee));
	};
	assignees = _.uniq(assignees);
	//get all groups and operators from recrod, and set operator to targets.
	for (var i = assignGroupFields.length - 1; i >= 0; i--) {
		var groupName = record[assignGroupFields[i]];
		if(groupName){		
			var members = _getGroupMembers(groupName, fields.fileName);
			if (members != null) {
				for (var j = members.length - 1; j >= 0; j--) {
					var operator = members[j].operator;
					var target = {};
					target.group = members[j].group;
					target.notifyClient = _notifyRule(operator, assignees, fields, true);

					targets[operator] = target;
				};
			}
		} 

	};

	_.each(assignees, function(operator){
		if(targets[operator]) targets[operator].insert = true;
		else targets[operator] = {
			group: null,
			insert: true,
			notifyClient:_notifyRule(operator, assignees, fields, false)
		};
	});

}

var MODULE = {
	'incidents':'SVC',
	'svcCatalog': 'SVC',
	'cm3r':'Change',
	'cm3t': 'Change',
	'request': 'Request',
	'ocmq': 'Request',
	'timeperiodDefinition': 'Timeperiod'
};

function _setApprovalTargets(object, record, targets, fields){
	//for approval, only supports records with pending groups field
	if(!system.functions.exists("current.pending.groups", record)) return;

	var pendingList = _.uniq(toJsArray(system.functions.denull(record['current.pending.groups'])));
	if(pendingList.length === 0) return;

	_.each(pendingList, function(pendingItem){
		var individuals = _getGroupMembers(pendingItem, fields.fileName, "approval");
		//if can`t find this item as group, this should be an operator, then it must be notify target.
		if(!individuals){
			var _approver = pendingItem;
			if (!targets[_approver]) {
				var target = {};
				target.group = null;
				target.insert = true;
				target.notifyClient = _notifyRule(_approver, pendingList, fields, false);
				targets[_approver] = target;
			}
			
		}
		else{ //if this is a group, then get their approvers, set to targets collection.
			_.each(individuals, function(approver){
				var _group = pendingItem;
				var target = {};
				target.group = _group;
				target.insert = _.contains(pendingList, approver.operator);
				target.notifyClient = _notifyRule( approver.operator, pendingList, fields, true);
				targets[approver.operator] = target;
			})
		}
	});

	//get delegate
	var appGroup = system.functions.str(system.functions.denull(record['current.pending.groups']));
	var module = MODULE[fields.fileName];
	if (module) {
		var query = 'Enable=true and AppGroup isin ' + appGroup + ' and AppModule="' + module + '" and DateFrom<tod() and DateTo>tod()';
		$('ApprovalDelegation', SCFILE_READONLY).setFields(['Delegate']).select(query).iterate(function(record) {
			var operator = record.Delegate;
			var concatedPnedingList = pendingList.concat([operator]);
			var isInGroup = false;
			if (targets[operator]) {
				if (targets[operator].group) isInGroup = true;
				targets[operator].insert = true;
				targets[operator].notifyClient = _notifyRule(operator, concatedPnedingList, fields, isInGroup);
			} else {
				var target = {};
				target.group = null;
				target.insert = true;
				target.notifyClient = _notifyRule(operator, concatedPnedingList, fields, isInGroup);

				targets[operator] = target;
			}

		});
	}
	


}

/**
 * apply rule to determine if need to notify client
 * @param  {String} operator  operator name
 * @param  {Array} assignees current assignees
 * @param  {Object} fields  general field values
 * @param  {Boolean} isIngroup  is this operator in group
 * @return {Boolean}           notify?
 */
function _notifyRule(operator, assignees, fields, isInGroup){
	var re = false;
	var queryFields = ['todo.list.enabled','todo.list.source.isgroup','todo.company','todo.folder'];
	var operatorDef = $('operator', SCFILE_READONLY).setFields(queryFields).select('name="' + operator + '"').uniqueResult();
	if(operatorDef){
		var isTodoAlertEnabled = operatorDef['todo.list.enabled'];
		if (isTodoAlertEnabled) {
			var isGroup = system.functions.nullsub(operatorDef['todo.list.source.isgroup'],false);

			if( !isGroup && _.contains(assignees, operator) ) re = true;
			else if( isGroup && isInGroup) re = true;
			
			//check preferred companies
			var companyList = operatorDef['todo.company'];
			if (fields.company !== undefined && !arrayUtil.isEmptyString(companyList)) {
				if (_.isEmpty(fields.company)) {
					re = false;
				}
				else if (!_.contains(companyList,fields.company)) {
					re = false;	
				}
			}
			//check preferred folders
			var folderList = operatorDef['todo.folder'];
			if (system.functions.nullsub(vars.$G_system_info["folderEntitlement"], false) && !arrayUtil.isEmptyString(folderList)) {
				if (_.isEmpty(fields.folder)) {
					re = false;
				}
				else if (!_.contains(folderList,fields.folder)) {
					re = false;	
				}
			}
		}
	}
	
	return re;
	
}

/**
 * get operator by contact name
 * @param  {String} contactName contact name
 * @return {String}             operator name
 */
function _getOperator(contactName){
	var op;
	var contact = $('contacts').select('contact.name="'+contactName+'"').uniqueResult();
	if(contact) op = contact['operator.id'];
	return op? op:contactName;

}

/**
 * get operators from group
 * @param  {String} groupName group name
 * @return {Array}           operators list
 */
var APPROVAL_GROUP_FILES = {
    cm3r: {
        filename: lib.ProcessDesignerEnablement.isChangeEnabled() ? "assignment" : "cm3groups",
        field: "approvers"

    },
    ocmq: {
        filename: "ocmgroups",
        field: "approvers"

    },
    _default: {
        filename: "assignment",
        field: lib.ProcessDesignerEnablement.isRequestEnabled() ? "approvers" : "operators"

    }
    //"incidents": "svcCartItem": "timeperiodDefinition"
}

function _getGroupMembers(groupName, filename, type) {
    var GroupFile = "assignment";
    var memberField = "operators";
    if (type == "approval") {
        var groupFIleInfo = APPROVAL_GROUP_FILES[filename] ? APPROVAL_GROUP_FILES[filename] : APPROVAL_GROUP_FILES["_default"];
        GroupFile = groupFIleInfo.filename;
        memberField = groupFIleInfo.field;
    }

    var members = [];
    var groupString;
    var iterated = false;

    if (system.functions.type(groupName) == 8) groupString = system.functions.str(groupName);
    else groupString = '{"' + groupName + '"}';

    $(GroupFile).select('name isin ' + groupString).iterate(function(group) {
        iterated = true;
        var tempMemberItems = [];
        var tempMembers = toJsArray(system.functions.denull(group[memberField]));
        for (var i = tempMembers.length - 1; i >= 0; i--) {
            var tempMemberItem = {};
            tempMemberItem.operator = tempMembers[i];
            tempMemberItem.group = group.name;
            tempMemberItems.push(tempMemberItem);
        };
        members = members.concat(tempMemberItems);
    });

    if (!iterated) return null;
    return _.uniq(members);
}

/**
 * get display value from global list
 * @param  {String} value [description]
 * @param  {Bollean} locale if its another languange
 * @return {String}       [description]
 */
function _getDisplayValue(value, locale){
	
	var re_value = value;

	if(value && vars['$G.todo.alert.type.display']){
		var gValues = toJsArray(vars['$G.todo.alert.type']);
		var gDisplay = toJsArray(vars['$G.todo.alert.type.display']);
		re_value = gDisplay[_.indexOf(gValues, value)];
		if(locale && re_value){
			var gl = $("globallists",SCFILE_READONLY).setFields(['display.list']).select('name="To-Do Alert Type"').uniqueResult();
			if(gl){
				var display_value_list = toJsArray(system.functions.val(gl['display.list'],8));
				var display_value = display_value_list[_.indexOf(gValues, value)];
				re_value = system.functions.scmsg(display_value,"global");
			}		
		}
	}

	return re_value? re_value:value;
}

/**
 * evaluate msg field to get message
 * @param  {String} expression expression
 * @return {String}            message
 */
function _getMsg(expression) {
	var rvalue = "";
	if (expression) {
		try {
			var todomsgExpression = '$temptxt=' + system.functions.nullsub(expression, '""');
			var rc = parse_evaluate(todomsgExpression, 11);
			var rvalue = vars.$temptxt;
			system.functions.cleanup(vars.$temptxt);
		} catch (e) {
			rvalue = expression;
		}

	}

	return rvalue;
}

/**
 * purge todoalertlist records, this function is called by RAD alert.schedule and alert.process
 * @param  {SCFile} object     $L.object
 * @param  {SCFile} record      $L.file
 * @param  {SCFile} alertDef    $L.alert
 * @param  {SCFile} alertRecord $L.alertrec
 * @return {[type]}             [description]
 */
function purge(object, record, alertDef, alertRecord){
	
	var fileName = system.functions.filename(record);
	var recordId = record[object.unique_field[0]];
	var alertName = alertDef.name;

	var query = 'record.id="'+recordId+'" and file.name="'+fileName+'" and alert.name="'+alertName+'"';

	$('TodoAlertList').select(query).iterate(function(todoAlert){
		
		var targets = getAllTargets(todoAlert);
		if (targets && targets.length > 0) {
			var temp_notify = splitGroupByLan(targets);
			var locale_bak = system.functions.sysinfo_get("languagecode");
			_.each(temp_notify, function(users, language) {
				system.functions.userlang(language);
				lib.ClientCommandUtils.deleteTodoAlert(users, todoAlert);
			});
			//set locale back
			system.functions.userlang(locale_bak);
		}
		todoAlert.doDelete();
	})

}

function getAllTargets(todoAlert){

	var targets = [];
	var individuals = toJsArray(todoAlert['target.user']);
	var groups = todoAlert['target.group'];
	var alertName = todoAlert['alert.name'];
	var fileName = todoAlert['file.name'];
	var members = [];

	var alertDef = $("AlertDef", SCFILE_READONLY).setFields(['alert.type']).select('name="'+alertName+'"').uniqueResult();
	if(!alertDef) return null;
	
	var groupMembers = _getGroupMembers(groups, fileName, alertDef['alert.type']);

	_.each(groupMembers, function(memberItem){
		if(_notifyRule(memberItem.operator, individuals, todoAlert, true)) {
			targets.push(memberItem.operator);
			members.push(memberItem.operator);
		}
	});

	_.each(individuals, function(ind){
		if(_notifyRule(ind, individuals, todoAlert, _.contains(members, ind))) targets.push(ind);
	});
	

	return _.uniq(targets);

}


/**
 * split users into groups by the preferred language
 * @param  {Array} users
 * @return {Object}
 */
function splitGroupByLan(users) {
	var groups = {};
	
	_.each(users, function(user) {
		var locale = _getOperatorLocale(user);
			
		//group the users by the preferred language 
		if (locale in groups) {
			groups[locale].push(user);
		}
		else {
			groups[locale] = [user];
		}
	});
	
	return groups;
}