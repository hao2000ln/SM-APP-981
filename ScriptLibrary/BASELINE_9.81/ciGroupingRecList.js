function addToGroup(ci, groupName) {
    var index = 0;
    var joinFile = new SCFile("joincigroup");

    var ciType = funcs.type(ci);

    if (joinFile.doSelect("logical.name=\"" + groupName + "\"") == RC_SUCCESS) {
        if (joinFile.group_type == "query") {
            return false;
        }

        if (joinFile.group_type == "list") {
            joinFile.group_members = funcs.denull(joinFile.group_members);

            if (ciType == 2) {
                joinFile.group_members = funcs.insert(joinFile.group_members, 0, 1, ci);
            }

            if (ciType == 8) {
                var ciArray = ci.toArray();

                do {
                    joinFile.group_members = funcs.insert(joinFile.group_members, 0, 1, ciArray[index]);
                    index++;
                }
                while (index < ciArray.length);
            }

            if (ciType == 6) {
                do {
                    joinFile.group_members = funcs.insert(joinFile.group_members, 0, 1, vars.$list_file.logical_name);
                }
                while (vars.$list_file.getNext() == 1);
            }
            var result = joinFile.doAction("save");
            return result == RC_SUCCESS;
        } else {
            return false;
        }
    }
}


function removeFromGroup(ci, groupName) {
    var joinFile = new SCFile("joincigroup");
    var ciIndex = 0;
    var ciType = funcs.type(ci);
    var ciFlag = false;

    if (joinFile.doSelect("logical.name=\"" + groupName + "\"") == RC_SUCCESS) {
        if (joinFile.group_type == "query") {
            return 0;
        }

        if (joinFile.group_type == "list") {
            joinFile.group_members = funcs.denull(joinFile.group_members);

            if (ciType == 2) {
                ciIndex = funcs.index(ci, joinFile.group_members);
                if (ciIndex > 0) {
                    joinFile.group_members = funcs._delete(joinFile.group_members, ciIndex);
                    ciFlag = true;
                }
            }
            if (ciType == 8) {
                var ciArray = ci.toArray();
                var index = 0;
                do {
                    ciIndex = funcs.index(ciArray[index], joinFile.group_members);
                    if (ciIndex > 0) {
                        joinFile.group_members = funcs._delete(joinFile.group_members, ciIndex);
                        ciFlag = true;
                    }
                    index++;
                }
                while (index < ciArray.length);
            }
            if (ciType == 6) {
                do {
                    ciIndex = funcs.index(vars.$list_file.logical_name, joinFile.group_members);
                    if (ciIndex > 0) {
                        joinFile.group_members = funcs._delete(joinFile.group_members, ciIndex);
                        ciFlag = true;
                    }
                }
                while (vars.$list_file.getNext() == 1);
            }
            if (ciFlag == true && funcs.lng(joinFile.group_members) > 0) {
                joinFile.doAction("save");
                return 1;
            }
            if (funcs.lng(joinFile.group_members) == 0) {
                return "-1";
            } else {
                return 0;
            }
        }
    }
}