function getApprovalList(changeId) {
    var list = [];
    var hash = {};

    lib.c.$('Approval').select('unique.key="' + changeId + '" and file.name="cm3r"').iterate(function (item) {
        processGroups(item['current.pending.groups'], list, hash);
        processGroups(item['future.groups'], list, hash);
    });

    return list;
}


function processGroups(groups, list, hash) {
    var groups = funcs.denull(groups).toArray();
    for (var k = 0; k < groups.length; k++) {
        var group = groups[k];
        if (group) {
            joinList(list, findUserList(group), hash);
        }
    }

}

function addToList(value, list, hash) {
    if (!hash.value) {
        list.push(value);
    }
}

function joinList(list, newList, hash) {
    for (var k = 0; k < newList.length; k++) {
        addToList(newList[k], list, hash);
    }
}

function findUserList(name) {
    var file = new SCFile('assignment', SCFILE_READONLY);
    file.setFields(['approvers']);
    var rc = file.doSelect('name="' + lib.StringUtil.escapeAllStr(name) + '"');

    if (rc == RC_SUCCESS) {
        return file.approvers.toArray();
    }

    return [name];
}


function getChangeOwners(change) {
    var list = [];
    var obj = {};

    if (change.requested_by) {
        addToList(change.requested_by, list, obj);
    }

    if (change.coordinator) {
        addToList(change.coordinator, list, obj);
    }

    if (change.assigned_to) {
        addToList(change.assigned_to, list, obj);
    }

    if (change.change_owner) {
        addToList(change.change_owner, list, obj);
    }

    return list;
}