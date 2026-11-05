var $ = lib.c.$;

/**
 * synchronize cm3groups to MyGroups when cm3groups update 
 */
function syncCM3GroupsMyGroups(oldrecord, record) {
    var mygroup;

    var i;
    var length;
    var aindex;

    var approver;
    var member;

    // rename
    if (oldrecord.name != record.name) {
        length = oldrecord.approvers.length();
        for (i = 0; i < length; i++) {
            approver = oldrecord.approvers[i];
            if (!oldrecord.approvers[i]) {
                continue;
            }

            mygroup = new SCFile("myGroups");
            mygroup.doSelect("name=\"" + approver + "\"");

            aindex = funcs.index(oldrecord.name, mygroup.approver_of) - 1;
            if (aindex < 0) {
                continue;
            }

            // check same name of assignment group
            if (!checkAssignmentGroupByApprover(oldrecord.name, approver)) {
                mygroup.approver_of[aindex] = record.name;
            } else {
                mygroup.approver_of.push(record.name);
            }

            funcs.rtecall("sort", vars.$L_rc, mygroup.approver_of, 0, 0);
            mygroup.approver_of = funcs.denull(mygroup.approver_of);
            mygroup.doUpdate();
        }

        length = oldrecord.members.length();
        for (i = 0; i < length; i++) {
            member = oldrecord.members[i];
            if (!member) {
                continue;
            }

            mygroup = new SCFile("myGroups");
            mygroup.doSelect("name=\"" + member + "\"");
            aindex = funcs.index(oldrecord.name, mygroup.member_of) - 1;
            if (aindex < 0) {
                continue;
            }

            // check same name of assignment group
            if (!checkAssignmentGroupByOperator(oldrecord.name, member)) {
                mygroup.member_of[aindex] = record.name;
            } else {
                mygroup.member_of.push(record.name);
            }

            funcs.rtecall("sort", vars.$L_rc, mygroup.member_of, 0, 0);
            mygroup.member_of = funcs.denull(mygroup.member_of);
            mygroup.doUpdate();
        }
    }

    // approvers updated
    if (oldrecord.approvers.toString() != record.approvers.toString()) {
        mygroup = new SCFile("myGroups");
        length = oldrecord.approvers.length();
        for (i = 0; i < length; i++) {
            approver = oldrecord.approvers[i];

            // approver removed 
            if (approver && funcs.index(approver, record.approvers) == 0) {
                mygroup.doSelect("name=\"" + approver + "\"");
                aindex = funcs.index(record.name, mygroup.approver_of) - 1;
                if (aindex < 0) {
                    continue;
                }

                // check same name of assignment group
                if (!checkAssignmentGroupByApprover(record.name, approver)) {
                    mygroup.approver_of[aindex] = null;
                    funcs.rtecall("sort", vars.$L_rc, mygroup.approver_of, 0, 0);
                    mygroup.approver_of = funcs.denull(mygroup.approver_of);
                    mygroup.doUpdate();
                }
            }
        }

        length = record.approvers.length();
        for (i = 0; i < length; i++) {
            mygroup = new SCFile("myGroups");
            if (record.approvers[i] != null && mygroup.doSelect("name=\"" + record.approvers[i] + "\"") == RC_SUCCESS) {
                if (funcs.index(record.name, mygroup.approver_of) == 0) {
                    mygroup.approver_of.push(record.name);
                    funcs.rtecall("sort", vars.$L_rc, mygroup.approver_of, 0, 0);
                    mygroup.doUpdate();
                }
            } else {
                if (record.approvers[i] != null) {
                    mygroup = new SCFile("myGroups");
                    mygroup.name = record.approvers[i];
                    mygroup.approver_of[0] = record.name;
                    mygroup.doInsert();
                }
            }
        }
    }

    // members updated
    if (oldrecord.members.toString() != record.members.toString()) {
        length = oldrecord.members.length();
        for (i = 0; i < length; i++) {
            member = oldrecord.members[i];

            // member removed
            if (member && funcs.index(member, record.members) == 0) {
                mygroup = new SCFile("myGroups");
                mygroup.doSelect("name=\"" + member + "\"");

                aindex = funcs.index(record.name, mygroup.member_of) - 1;
                if (aindex < 0) {
                    continue;
                }

                // check same name of assignment group
                if (!checkAssignmentGroupByOperator(record.name, member)) {
                    mygroup.member_of[aindex] = null;
                    funcs.rtecall("sort", vars.$L_rc, mygroup.member_of, 0, 0);
                    mygroup.member_of = funcs.denull(mygroup.member_of);
                    mygroup.doUpdate();
                }
            }
        }

        length = record.members.length();
        for (i = 0; i < length; i++) {
            mygroup = new SCFile("myGroups");
            if (record.members[i] != null && mygroup.doSelect("name=\"" + record.members[i] + "\"") == RC_SUCCESS) {
                if (funcs.index(record.name, mygroup.member_of) == 0) {
                    mygroup.member_of.push(record.name);
                    funcs.rtecall("sort", vars.$L_rc, mygroup.member_of, 0, 0);
                    mygroup.doUpdate();
                }
            } else {
                if (record.members[i] != null) {
                    mygroup = new SCFile("myGroups");
                    mygroup.name = record.members[i];
                    mygroup.member_of[0] = record.name;
                    mygroup.doInsert();
                }
            }
        }
    }
}


/**
 * synchronize cm3groups to MyGroups when cm3groups delete 
 */
function syncCM3GroupsMyGroupsDelete(oldrecord) {

    var groupName = oldrecord.name;

    var mygroup = new SCFile("myGroups");
    var i;
    var aindex;

    // approvers
    var length = oldrecord.approvers.length();
    for (i = 0; i < length; i++) {
        var approver = oldrecord.approvers[i];
        if (!approver) {
            continue;
        }

        mygroup.doSelect("name=\"" + approver + "\"");
        aindex = funcs.index(groupName, mygroup.approver_of) - 1;
        if (aindex < 0) {
            continue;
        }

        // check same name of assignment group
        if (!checkAssignmentGroupByApprover(groupName, approver)) {
            mygroup.approver_of[aindex] = null;
            funcs.rtecall("sort", vars.$L_rc, mygroup.approver_of, 0, 0);
            mygroup.approver_of = funcs.denull(mygroup.approver_of);
            mygroup.doUpdate();
        }
    }

    // members
    length = oldrecord.members.length();
    for (i = 0; i < length; i++) {
        var member = oldrecord.members[i];
        if (!member) {
            continue;
        }

        mygroup.doSelect("name=\"" + member + "\"");
        aindex = funcs.index(groupName, mygroup.member_of) - 1;
        if (aindex < 0) {
            continue;
        }
        // check same name of assignment group
        if (!checkAssignmentGroupByOperator(groupName, member)) {
            mygroup.member_of[aindex] = null;
            funcs.rtecall("sort", vars.$L_rc, mygroup.member_of, 0, 0);
            mygroup.member_of = funcs.denull(mygroup.member_of);
            mygroup.doUpdate();
        }
    }
}

function checkAssignmentGroupByOperator(name, operator) {
    var assignment = $("!assignment").fields("name").find("name=:name and operators=:operator", name, operator).one();
    return assignment != null;
}

function checkAssignmentGroupByApprover(name, approver) {
    var assignment = $("!assignment").fields("name").find("name=:name and approvers=:approver", name, approver).one();
    return assignment != null;
}