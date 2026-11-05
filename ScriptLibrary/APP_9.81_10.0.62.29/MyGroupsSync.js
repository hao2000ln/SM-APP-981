/**
 * @fileOverview  Provide the functions to Sync Data between myGroups and assignment
 * @author Mi Quan
 * @date Dec. 2014/4/8
 */

var $ = lib.c.$;
var _index = funcs.index;

var logger = getLog("MyGroupsSync");

/**
 * @private
 * @description  update Assignment from approverOld to approverNew
 * @param {String} assignmentName - Assignment
 * @param {String} approverOld - Approver
 * @param {String} approverNew - Approver
 * 
 */
function updateAssignmentbyApprover(assignmentName, approverOld, approverNew) {

    var assignment = new SCFile("assignment");
    var rc = assignment.doSelect("name=\"" + assignmentName + "\"");
    if (rc != RC_SUCCESS) {
        return;
    }

    if (approverOld == null) {
        if (_index(approverNew, assignment.approvers) == 0) {
            assignment.approvers.push(approverNew);
            funcs.rtecall("sort", vars.$L_rc, assignment.approvers, 0, 0);
            assignment.doUpdate();
        }
    } else {
        var aindex = _index(approverOld, assignment.approvers) - 1;
        if (aindex >= 0) {
            assignment.approvers[aindex] = approverNew;
            funcs.rtecall("sort", vars.$L_rc, assignment.approvers, 0, 0);
            assignment.approvers = funcs.denull(assignment.approvers);
            assignment.doUpdate();
        }
    }
}


/**
 * @private
 * @description  update myGroup from approverOld to approverNew (Assignment)
 * @param {String} assignmentName - Assignment
 * @param {String} approverOld - Approver
 * @param {String} approverNew - Approver
 * 
 */
function updateMyGroupsbyApprover(myGroup, approverOld, approverNew) {

    var mygroup = new SCFile("myGroups");
    var rc = mygroup.doSelect("name=\"" + myGroup + "\"");

    if (approverOld == null) {
        if (myGroup != null && rc == RC_SUCCESS) {
            if (_index(approverNew, mygroup.approver_of) == 0) {
                mygroup.approver_of.push(approverNew);
                funcs.rtecall("sort", vars.$L_rc, mygroup.approver_of, 0, 0);
                mygroup.doUpdate();
            }
        } else {
            if (myGroup != null && myGroup != "") {
                mygroup = new SCFile("myGroups");
                mygroup.name = myGroup;
                mygroup.approver_of[0] = approverNew;
                mygroup.doInsert();
            }
        }
    } else {
        if (rc == RC_SUCCESS) {
            var aindex = _index(approverOld, mygroup.approver_of) - 1;
            if (aindex >= 0) {
                mygroup.approver_of[aindex] = approverNew;
                funcs.rtecall("sort", vars.$L_rc, mygroup.approver_of, 0, 0);
                mygroup.approver_of = funcs.denull(mygroup.approver_of);
                mygroup.doUpdate();
            }
        }
    }
}


/**
 * @private
 * @description  update Assignment from operatorOld to operatorNew 
 * @param {String} assignmentName - Assignment
 * @param {String} operatorOld - Operator
 * @param {String} operatorNew - Operator
 * 
 */
function updateAssignmentbyOperator(assignmentName, operatorOld, operatorNew) {

    var assignment = new SCFile("assignment");
    var rc = assignment.doSelect("name=\"" + assignmentName + "\"");
    if (rc != RC_SUCCESS) {
        return;
    }

    if (operatorOld == null) {
        if (_index(operatorNew, assignment.operators) == 0) {
            assignment.operators.push(operatorNew);
            funcs.rtecall("sort", vars.$L_rc, assignment.operators, 0, 0);
            assignment.doUpdate();
        }
    } else {
        var aindex = _index(operatorOld, assignment.operators) - 1;
        if (aindex >= 0) {
            assignment.operators[aindex] = operatorNew;
            funcs.rtecall("sort", vars.$L_rc, assignment.operators, 0, 0);
            assignment.operators = funcs.denull(assignment.operators);
            assignment.doUpdate();
        }
    }
}

/**
 * @private
 * @description  update myGroup from operatorOld to operatorNew (Assignment)
 * @param {String} myGroup - MyGroup
 * @param {String} operatorOld - Operator
 * @param {String} operatorNew - Operator
 * 
 */
function updateMyGroupsbyOperator(myGroup, operatorOld, operatorNew) {

    var mygroup = new SCFile("myGroups");
    var rc = mygroup.doSelect("name=\"" + myGroup + "\"");

    if (operatorOld == null) {
        if (myGroup != null && rc == RC_SUCCESS) {
            if (_index(operatorNew, mygroup.member_of) == 0) {
                mygroup.member_of.push(operatorNew);
                funcs.rtecall("sort", vars.$L_rc, mygroup.member_of, 0, 0);
                mygroup.doUpdate();
            }
        } else {
            if (myGroup != null && myGroup != "") {
                mygroup = new SCFile("myGroups");
                mygroup.name = myGroup;
                mygroup.member_of[0] = operatorNew;
                mygroup.doInsert();
            }
        }
    } else {
        if (rc == RC_SUCCESS) {
            var aindex = _index(operatorOld, mygroup.member_of) - 1;
            if (aindex >= 0) {
                mygroup.member_of[aindex] = operatorNew;
                funcs.rtecall("sort", vars.$L_rc, mygroup.member_of, 0, 0);
                mygroup.member_of = funcs.denull(mygroup.member_of);
                mygroup.doUpdate();
            }
        }
    }
}


/**
 * @public
 * @description  Sync to Assignment when My Groups is updated
 * @param {MyGroup} oldrecord - MyGroup
 * @param {MyGroup} record - MyGroup
 * 
 */
function syncToAssignmentWhenMyGroupsChange(oldrecord, record) {

    var i;

    var length_approver;
    var length_approver_old;
    var length_member;
    var length_member_old;

    if (oldrecord == null) {
        length_approver = record.approver_of.length();
        length_member = record.member_of.length();

        for (i = 0; i < length_approver; i++) {
            updateAssignmentbyApprover(record.approver_of[i], null, record.name);
        }

        for (i = 0; i < length_member; i++) {
            if (record.member_of[i] == null) {
                continue;
            }
            updateAssignmentbyOperator(record.member_of[i], null, record.name);
        }
    } else {
        // if name is changed 
        if (oldrecord.name != record.name) {

            length_member_old = record.member_of.length();
            length_approver_old = oldrecord.approver_of.length();

            // update approver in assignment 
            for (i = 0; i < length_approver_old; i++) {
                if (oldrecord.approver_of[i] != null) {
                    updateAssignmentbyApprover(oldrecord.approver_of[i], oldrecord.name, record.name);
                }
            }

            // update operators in assignment  
            for (i = 0; i < length_member_old; i++) {
                if (oldrecord.member_of[i] != null) {
                    updateAssignmentbyOperator(oldrecord.member_of[i], oldrecord.name, record.name);
                }
            }
        }

        // update approvers
        if (oldrecord.approver_of.toString() != record.approver_of.toString()) {

            length_approver = record.approver_of.length();
            length_approver_old = oldrecord.approver_of.length();

            for (i = 0; i < length_approver_old; i++) {
                if (oldrecord.approver_of[i] != null && _index(oldrecord.approver_of[i], record.approver_of) == 0) {
                    updateAssignmentbyApprover(oldrecord.approver_of[i], oldrecord.name, null);
                }
            }

            for (i = 0; i < length_approver; i++) {
                if (record.approver_of[i] != null) {
                    updateAssignmentbyApprover(record.approver_of[i], null, record.name);
                }
            }
        }

        // update members
        if (oldrecord.member_of.toString() != record.member_of.toString()) {

            length_member = record.member_of.length();
            length_member_old = oldrecord.member_of.length();

            // remove operator from assignment
            for (i = 0; i < length_member_old; i++) {
                if (oldrecord.member_of[i] != null && _index(oldrecord.member_of[i], record.member_of) == 0) {
                    updateAssignmentbyOperator(oldrecord.member_of[i], oldrecord.name, null);
                }
            }

            for (i = 0; i < length_member; i++) {
                if (record.member_of[i] != null) {
                    updateAssignmentbyOperator(record.member_of[i], null, record.name);
                }
            }
        }
    }

}


/**
 * @public
 * @description  Sync to Assignment when My Groups is deleted
 * @param {MyGroup} oldrecord - MyGroup
 * 
 */
function syncToAssignmentWhenMyGroupsDelete(oldrecord) {

    var length_approver = oldrecord.approver_of.length();
    var length_member = oldrecord.member_of.length();
    var i;

    for (i = 0; i < length_approver; i++) {
        if (oldrecord.approver_of[i] != null) {
            updateAssignmentbyApprover(oldrecord.approver_of[i], oldrecord.name, null);
        }
    }

    for (i = 0; i < length_member; i++) {
        if (oldrecord.member_of[i] != null) {
            updateAssignmentbyOperator(oldrecord.member_of[i], oldrecord.name, null);
        }
    }
}


/**
 * @public
 * @description  Sync to MyGroup when Assignment is updated
 * @param {Assignment} oldrecord - Assignment
 * @param {Assignment} record - Assignment
 * 
 */
function syncToMyGroupsWhenAssignmentChange(oldrecord, record) {

    var i;

    var length_approver;
    var length_approver_old;
    var length_operator;
    var length_operator_old;

    if (oldrecord == null) {
        length_approver = record.approvers.length();
        length_operator = record.operators.length();

        for (i = 0; i < length_approver; i++) {
            updateMyGroupsbyApprover(record.approvers[i], null, record.name);
        }

        for (i = 0; i < length_operator; i++) {
            if (record.operators[i] == null) {
                continue;
            }
            updateMyGroupsbyOperator(record.operators[i], null, record.name);
        }

    } else {
        if (oldrecord.name != record.name) {

            length_approver_old = oldrecord.approvers.length();
            length_operator_old = oldrecord.operators.length();

            for (i = 0; i < length_approver_old; i++) {
                if (oldrecord.approvers[i] != null) {
                    updateMyGroupsbyApprover(oldrecord.approvers[i], oldrecord.name, record.name);
                }
            }

            for (i = 0; i < length_operator_old; i++) {
                if (oldrecord.operators[i] != null) {
                    updateMyGroupsbyOperator(oldrecord.operators[i], oldrecord.name, record.name);
                }
            }
        }

        if (oldrecord.approvers.toString() != record.approvers.toString()) {

            length_approver_old = oldrecord.approvers.length();
            length_approver = record.approvers.length();

            for (i = 0; i < length_approver_old; i++) {
                if (oldrecord.approvers[i] != null && _index(oldrecord.approvers[i], record.approvers) == 0) {
                    updateMyGroupsbyApprover(oldrecord.approvers[i], oldrecord.name, null);
                }
            }

            for (i = 0; i < length_approver; i++) {
                updateMyGroupsbyApprover(record.approvers[i], null, record.name);
            }
        }

        if (oldrecord.operators.toString() != record.operators.toString()) {

            length_operator_old = oldrecord.operators.length();
            length_operator = record.operators.length();

            for (i = 0; i < length_operator_old; i++) {
                if (oldrecord.operators[i] != null && _index(oldrecord.operators[i], record.operators) == 0) {
                    updateMyGroupsbyOperator(oldrecord.operators[i], oldrecord.name, null);
                }
            }

            for (i = 0; i < length_operator; i++) {
                if (record.operators[i] == null) {
                    continue;
                }
                updateMyGroupsbyOperator(record.operators[i], null, record.name);
            }
        }

    }
}


/**
 * @public
 * @description  Sync to MyGroup when Assignment is deleted
 * @param {Assignment} oldrecord - Assignment
 * 
 */
function syncToMyGroupsWhenAssignmentDelete(oldrecord) {

    var length_approver = oldrecord.approvers.length();
    var length_operator = oldrecord.operators.length();
    var i;

    for (i = 0; i < length_approver; i++) {
        if (oldrecord.approvers[i] != null) {
            updateMyGroupsbyApprover(oldrecord.approvers[i], oldrecord.name, null);
        }
    }

    for (i = 0; i < length_operator; i++) {
        if (oldrecord.operators[i] != null) {
            updateMyGroupsbyOperator(oldrecord.operators[i], oldrecord.name, null);
        }
    }
}


/**
 * Sync to MyGroup/Assignment Group when Operator is renamed
 * This function is called by trigger "trigger.operator.groups.update"
 *
 * @param {String} nameNew
 * @param {String} nameOld
 */
function syncToGroupWhenOperatorRename(nameOld, nameNew) {
    if (nameNew == nameOld) {
        return;
    }

    // 1. assignment groups those operator is member have been updated in trigger already

    // 2. rename myGroups
    var myGroup = $("myGroups").find("name=:name", nameOld).one();
    if (myGroup) {
        myGroup.name = nameNew;
        myGroup.doUpdate();
    }

    // 3. update assignment those operator is approver      
    $("assignment").find("approvers=:name", nameOld).each(function(assignment) {
        var approvers = assignment.approvers.toArray();
        var index = approvers.indexOf(nameOld);
        if (index >= 0) {
            approvers[index] = nameNew;
            assignment.approvers = approvers.sort();
            assignment.doUpdate();
        }
    });
}


/**
 * @public
 * @description  get ApprovalOf in myGroups
 * @param {String} operatorName - String
 * 
 */
function getApprovalOfInMyGroups(operatorName) {

    var mygroup = new SCFile("myGroups", SCFILE_READONLY);
    mygroup.setFields("approver.of");

    var rc = mygroup.doSelect("name=\"" + operatorName + "\"");
    if (rc == RC_SUCCESS) {
        if (mygroup.approver_of != null) {
            return mygroup.approver_of.toArray();
        } else {
            return null;
        }
    } else {
        return null;
    }
}


/**
 * Synchronize all myGroups records
 * You can execute this function to correct all myGroups records.
 *
 * @returns {Number} update count
 */
function synchronizeAllMyGroups() {
    var updateCount = 0;

    if (logger.isDebugEnabled()) {
        logger.debug("synchronize myGroups...");
    }

    var updateRecords = [];

    $("myGroups").selectAll().iterate(function(groups) {
        // 1. synchronize myGroups with assignment groups
        var memberUpdate = checkMyGroupsSyncStatus(groups, "member.of");
        var approverUpdate = checkMyGroupsSyncStatus(groups, "approver.of");

        if (memberUpdate || approverUpdate) {
            printUpdateInfo(groups);
            updateCount++;
            groups.doUpdate();
        }

        // 2. synchronize assignment groups with myGroups 
        var operator = groups.name;

        var members = funcs.denull(groups.member_of).toArray();
        members.forEach(function(groupName) {
            var assignment = $("!assignment").fields(["operators", "sysmodtime", "sysmoduser"]).find("name=:name", groupName).one();
            // operator missed in assignment
            if (assignment && _index(operator, assignment.operators) == 0) {
                if (updateRecords.indexOf(groupName) == -1) {
                    updateRecords.push(groupName);
                    printUpdateInfo(assignment);
                    updateCount++;
                }
                updateAssignmentbyOperator(groupName, null, operator);
            }
        });

        var approvers = funcs.denull(groups.approver_of).toArray();
        approvers.forEach(function(groupName) {
            var assignment = $("!assignment").fields(["approvers", "sysmodtime", "sysmoduser"]).find("name=:name", groupName).one();
            // approver missed in assignment
            if (assignment && _index(operator, assignment.approvers) == 0) {
                if (updateRecords.indexOf(groupName) == -1) {
                    updateRecords.push(groupName);
                    printUpdateInfo(assignment);
                    updateCount++;
                }
                updateAssignmentbyApprover(groupName, null, operator);
            }
        });
    });

    // 3. synchronize assignment groups with operators
    if (logger.isDebugEnabled()) {
        logger.debug("synchronize assignment groups with operators...");
    }

    $("!operator").fields("name", "assignment.groups").selectAll().each(function(operator) {
        var groups = funcs.denull(operator.assignment_groups).toArray();
        groups.forEach(function(groupName) {
            var group = $("!assignment").fields(["operators", "sysmodtime", "sysmoduser"]).find("name=:name", groupName).one();
            // operator missied in assignment group
            if (group && _index(operator.name, group.operators) == 0) {
                if (updateRecords.indexOf(groupName) == -1) {
                    updateRecords.push(groupName);
                    printUpdateInfo(group);
                    updateCount++;
                }
                updateAssignmentbyOperator(groupName, null, operator.name);
            }
        });
    });

    // 4. synchronize operators with assignment groups
    if (logger.isDebugEnabled()) {
        logger.debug("synchronize operators with assignment groups...");
    }

    updateRecords = [];

    $("!assignment").fields("name", "operators").selectAll().each(function(assignment) {
        var operators = funcs.denull(assignment.operators).toArray();
        operators.forEach(function(operatorName) {
            var operator = $("!operator").fields("assignment.groups").find("name=:name", operatorName).one();
            // assignment group missed in operator
            if (operator && _index(assignment.name, operator.assignment_groups) == 0) {
                operator = $("operator").find("name=:name", operatorName).one();
                var assignmentNew = funcs.denull(operator.assignment_groups).toArray();
                assignmentNew.push(assignment.name);
                operator.assignment_groups = assignmentNew.sort();

                if (updateRecords.indexOf(operatorName) == -1) {
                    updateRecords.push(operatorName);
                    printUpdateInfo(operator);
                    updateCount++;
                }

                operator.doUpdate();
            }
        });
    });

    logger.info(`total ${updateCount} records synchronized.`);

    return updateCount;
}


/**
 * Check myGroups record synchronize status, correct data if not synchronized.
 * 
 * @param {SCFile}  groups
 * @param {String}  field
 * @returns {Boolean} true if need update
 */
function checkMyGroupsSyncStatus(groups, field) {

    var members = groups[field];
    if (members == null) {
        return false;
    }

    var needUpdate = false;

    var queryFields = ["name"];
    var assignmentField;
    if (field == "member.of") {
        assignmentField = "operators";
        queryFields.push(assignmentField);
    } else if (field == "approver.of") {
        assignmentField = "approvers";
        queryFields.push(assignmentField);
    }

    var i;
    var length = members.length();
    for (i = 0; i < length; i++) {
        var member = members[i];
        if (member == null || member.length == 0) {
            continue;
        }

        var assignment = $("!assignment").fields(queryFields).select('name="' + member + '"').one();

        // name may not same in case insensitive db
        if (assignment && member != assignment.name) {
            // print(groups.name + ": " + member);
            // correct data
            members[i] = assignment.name;
            needUpdate = true;
        }
    }

    // add assignment those not found in myGroups
    if (assignmentField) {
        // query assignment by the operator
        $("!assignment").fields("name").find(`${assignmentField}="${groups.name}"`).each(function(assignment) {
            // assignment not in MyGroups
            if (_index(assignment.name, members) == 0) {
                groups[field].push(assignment.name);
                needUpdate = true;
            }
        });
    }

    if (needUpdate) {
        var rc = new SCDatum();
        funcs.rtecall("sort", rc, groups[field], 0, 0);
        groups[field] = funcs.denull(groups[field]);
    }

    return needUpdate;
}


function printUpdateInfo(obj) {
    var objType = funcs.filename(obj);
    var objName = obj.name;

    var message = funcs.scmsg(201, "object", [objType, objName]);
    print(message);

    if (logger.isDebugEnabled()) {
        message += ` Last modified on ${obj.sysmodtime} by ${obj.sysmoduser}.`;
        logger.debug(message);
    }
}