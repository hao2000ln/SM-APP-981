var $ = lib.c.$;
var _denull = system.functions.denull;
var _lng = system.functions.lng;
var _ = lib.Underscore.require();

/**
 * get to-do alert configuration info
 * @return {Object} to-do alert configuration info
 */
function getTodoAlertConfig() {
	var user = system.functions.operator();
	var config = getUserAlertConfig(user);
	return {enable: config['todo.list.enabled'], showCount: config['todo.list.max.size']};
}

/**
 * get total count
 * @param  {bool} isGroup is group
 * @return count
 */
function getTotalAlertCount() {
	var user = system.functions.operator();
	var config = getUserAlertConfig(user);
	
	// check if alert enabled.
	if (config['todo.list.enabled'] == false)
		return 0;
		
	var record = new SCFile('TodoAlertList', SCFILE_READONLY);
		
	var sql = getSql(config, user);
	var totalCount = record.doCount(sql);
	
	return totalCount;
}


/**
 * get to-do alert list for current logged user
 * @param  {bool} isGroup is group
 * @return {Object} object contains alert list and total count
 * sample: {count: 40, alerts: [{id: 1, message: "SLO expiry in 3 hours", type: "SLO", recordId: "SLO00001", file: "slo", actions: [{action: "approve", label: "Approve"}]}]}
 */
function getTodoAlertList() {
	var user = system.functions.operator();
	var config = getUserAlertConfig(user);
	// check if alert enabled.
	if (config['todo.list.enabled'] == false)
		return null;
		
	var maxCount = config['todo.list.max.size'] + 10;
	var retObject = {};
	retObject['alerts'] = [];
	
	var record = new SCFile('TodoAlertList', SCFILE_READONLY);
	record.setOrderBy(['record.update.time'], [SCFILE_DSC]);
	
	var sql = getSql(config, user);
	var totalCount = record.doCount(sql);
	retObject['count'] = totalCount;

	record.doSelect(sql);
	var ret = record.getFirst();
	var count = 0;
	while (ret == RC_SUCCESS && count < maxCount) {
		record['message.text'] = getAlertMessage(record);
		var alert = getAlert(record, config['date.order']);
		retObject['alerts'].push(alert);
		count++;
		
		ret = record.getNext();
	}
	
	return retObject;
}


function checkCompany(recordId) {
	return true;
}


function checkFolder(recordId) {
	return true;
}


/** 
 * convert alert record to client alert
 * @param  {Record} TodoAlert record
 * @return {Object}       alert
 */
function getAlert(record, date_order, locale) {
	var alert = {};
	alert.id = record['id'];
	alert.recordId = record['record.id'];
	alert.fileName = record['file.name'];
	alert.keyField = getKeyField(record['file.name']);
	
	// process alert type and message template
	alert.type = record['type'];
	alert.typeDesc = lib.TodoAlertQueue._getDisplayValue(alert.type, locale);
	
	var msg = record['message.text'];
	msg = lib.TodoAlertUtil.trimMessage(msg);
	alert.message = msg;
	
	alert.updateTime = lib.CalendarUtilities.formatDate(record['record.update.time'], lib.operatorUtil.getDateFormat(date_order));
	return alert;
}


/** 
 * get alert message
 * @param  {Record} TodoAlert record
 * @return {String} message
 */
function getAlertMessage(record) {
	vars.$L_file_backup = vars.$L_file;
	if (record['message.text'].indexOf('$L.file') != -1) {
		var fields = lib.CalendarUtilities.extractFieldsFromCondition(record['message.text']);
		var sql = lib.DBUtils.getQueryByTag(record['record.tag']);
		var scfile = new SCFile(record['file.name'], SCFILE_READONLY);
		scfile.setFields(fields);
		var ret = scfile.doSelect(sql);
		if (ret == RC_SUCCESS) {
			vars.$L_file = scfile;
		}
	}
	var msg = lib.TodoAlertQueue._getMsg(record['message.text']);
	vars.$L_file = vars.$L_file_backup;
	
	return msg;
}


/** 
 * [doAcknowledge description]
 * @param  {Number}  id  alert id
 * @param  {Boolean} self_only
 * @return {void}            void
 */
function doAcknowledge(id, self_only) {
	var record = new SCFile('TodoAlertList');
	var ret = record.doSelect('id=' + id + '');
	if (ret == RC_SUCCESS) {
		var ack_user = system.functions.operator();
		var ack_time = system.functions.tod();
		var targets = lib.TodoAlertQueue.getAllTargets(record);
		_processAck(record, ack_user, ack_time, targets);
		
		if (!self_only) {
			var ack_query = 'id<>' + id + ' and record.id="' + record.record_id + '" and file.name="' + record.file_name + '" and alert.type<>"approval"';
			$('TodoAlertList').select(ack_query).iterate(function(ack_record){
				_processAck(ack_record, ack_user, ack_time, targets);
			});
		}
	}
}


function _processAck(record, ack_user, ack_time, targets) {
	if (record.ack !== true) {
		record.ack = true;
		record['ack.by'] = ack_user;
		record['ack.time'] = ack_time;
		record.doUpdate();

		if (targets) {
			sendAcknowledgeToTarget(targets, record.id, record['record.id'], ack_user);
		}
	}
}


// actual function to send client message
function sendAcknowledgeToTarget(targets, alertId, recordId, user) {
	lib.ArrayUtil.removeA(targets, user);

	if (targets.length > 0) {
		var temp_notify = lib.TodoAlertQueue.splitGroupByLan(targets);
		var locale_bak = system.functions.sysinfo_get("languagecode");
		_.each(temp_notify, function(users, language) {
			system.functions.userlang(language);
			var msg = system.functions.scmsg('acknowledged', 'TodoAlert', [recordId, user]);
			lib.ClientCommandUtils.todoAlertAcknowledged(users, alertId, msg);
		});
		//set locale back
		system.functions.userlang(locale_bak);
	}
}

// create schedule for sending acknowledge message to user
function createBackgroundAcknowledgeSchedule(target, alertId, recordId, user) {
	var sch = new SCFile("schedule");
	sch.name = "background acknowledge " + target + " - " + alertId;
	sch["class"] = "problem";
	var template = "lib.TodoAlertDao.sendAcknowledgeToTarget(\"$target$\", $alertId$, \"$recordId$\", \"$user$\");";
	sch.javascript = template.replace(/\$target\$/i, target).replace(/\$alertId\$/i, alertId).replace(/\$recordId\$/i, recordId).replace(/\$user\$/i, user);
	sch.doInsert();
}


/**
 * get sql
 * @param  {Object} config user alert config
 * @return {String} sql
 */
function getSql(config, user) {
	var sql = "";
	
	var isGroup = false;
	if (config['todo.list.source.isgroup'] == true)
		isGroup = true;

	if (isGroup) {
		var groups = getUserGroups(user);
		var assignGroupsStr = system.functions.str(groups["assignment"]);
		var approvalGroupsStr = system.functions.str(groups["approval"]);
		sql = '((target.group isin ' + approvalGroupsStr + ' and alert.type = "approval")';
		sql += ' or (target.group isin ' + assignGroupsStr + ' and alert.type <> "approval"))';
	} else {
		sql = 'target.user isin {"' + user + '"}';
	}
	
	if (vars.$G_multi === true) {
		var companies = config['todo.company'];
		if (_lng(_denull(companies)) > 0) {
			var companiesStr = system.functions.str(companies);
			sql += " and company isin " + companiesStr;
		}
	}
	
	if (vars.$G_folderEntitlement === true) {
		var folders = config['todo.folder'];
		if (_lng(_denull(folders)) > 0) {
			var foldersStr = system.functions.str(folders);
			sql += " and folder isin " + foldersStr;
		}
	}
	
	return sql + " and record.update.time>tod()-'" + config['todo.list.interval'] + " 00:00:00' and ack=false"
}


function getUserGroups(user) {
	var pdEnabled = lib.ProcessDesignerEnablement.isPDEnabled();
	
	if (pdEnabled == true) {
		var myGroups = new SCFile('myGroups', SCFILE_READONLY);
		var ret = myGroups.doSelect('name="' + user + '"');
		if (ret == RC_SUCCESS) {
			var memberOf = _.toJSArray(myGroups['member.of']);
			var approverOf = _.toJSArray(myGroups['approver.of']);
			return {
				assignment: memberOf,
				approval: approverOf
			};
		} else {
			return {
				assignment: [],
				approval: []
			};
		}
	} else {
		var cm3groups = getTableGroups('cm3groups', 'members', 'approvers', user);
		var ocmgroups = getTableGroups('ocmgroups', 'members', 'approvers', user);
		var assigngroups = getTableGroups('assignment', 'operators', 'approvers', user);
		return {
			assignment: _.uniq(cm3groups["assignment"].concat(ocmgroups["assignment"].concat(assigngroups["assignment"]))),
			approval: _.uniq(cm3groups["approval"].concat(ocmgroups["approval"].concat(assigngroups["approval"])))
		};
	}
}

function getTableGroups(file, membersField, approversField, user) {
	var assignment_groups = [];
	var approval_groups = [];
	var query = membersField + ' isin {"' + user + '"} or ' + approversField + ' isin {"' + user + '"}';
	$(file, SCFILE_READONLY).setFields(['name']).select(query).iterate(function(record){
		if (_.contains(record[approversField], user)) {
			approval_groups.push(record.name);
		}
		if (_.contains(record[membersField], user)) {
			assignment_groups.push(record.name);
		}
	});
	return {
		assignment: assignment_groups,
		approval: approval_groups
	};
}


/**
 * get user's alert config
 * @return {Object} config
 */
function getUserAlertConfig(user) {
	var alert_config = {};
	var alert_fields = ['todo.list.source.isgroup','todo.list.enabled','todo.list.max.size','todo.list.interval','todo.company',
		'todo.folder', 'date.order', 'syslanguage'];
	
	var operator = new SCFile('operator', SCFILE_READONLY);
	operator.setFields(alert_fields);
	var rc = operator.doSelect('name="' + user + '"');  
    if (rc == RC_SUCCESS) {
    	for (var i=0;i<alert_fields.length;i++) {
    		var field_name = alert_fields[i];
    		if (field_name === "date.order") {
    			alert_config[field_name] = operator[field_name]||vars.$G_system_info["date.order"];
    		}
    		else if (field_name === "syslanguage") {
    			alert_config[field_name] = operator[field_name]||vars.$G_system_info["syslanguage"];
    		}
    		else {
    			alert_config[field_name] = operator[field_name];
    		}
    	}
    }
    
	return alert_config;
}


var keyFieldMap = {};

/**
 * get sql
 * @param  {String} fileName file name
 * @return {String} key field
 */
function getKeyField(fileName) {
	if (keyFieldMap[fileName])
		return keyFieldMap[fileName];
		
	var keyField = lib.CalendarDao.getUniqueKeyField(fileName);
	keyFieldMap[fileName] = keyField;
	
	return keyField;
}
