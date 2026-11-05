var $ = lib.c.$;

var assignmentFields = {
    "incidents": "assignment",
    "probsummary": "assignment",
    "imTask": "assignment",
    "cm3r": "assign.dept",
    "cm3t": "assign.dept",
    "request": "assigned.group",
    "requestTask": "assigned.group"
};

var assigneeFields = {
    "incidents": "assignee.name",
    "probsummary": "assignee.name",
    "imTask": "assignee.name",
    "cm3r": "assigned.to",
    "cm3t": "assigned.to",
    "request": "assigned.to",
    "requestTask": "assigned.to"
};

/**
 *  Return true when the operator has the right to do the action for the file ticket
 *         otherwise false
 *  Parameters:
 *         operator: operator name
 *         file: ticket file record
 *         action: the right to check, such as update, close, etc
 *         area: Security Area, if it is null, retrieve from the field sc.area in datadict
 */
function hasRight(operator, file, action, area) {
    if (!operator || file == null || action == null) {
        return false;
    }

    var filename = funcs.filename(file);
    if (area == null) { // get area from datadict
        area = lib.security.getArea(filename);
        if (area == null) {
            return false;
        }
    }

    var roleRights = lib.security.getOperatorRoleRights(operator);
    if (!roleRights) {
        return false;
    }

    var right = lib.security.getRightsFromRoleRights(roleRights, area, action, file["folder"]);

    if (right == null || right == false || right == "never") {
        return false;
    }

    if (right == true || right == "true" || right == "always") {
        return true;
    }

    var assigneeField = assigneeFields[filename];
    if (right == "assigned") {
        if (assigneeField == null) {
            assigneeField = "assignee.name"; // default assignee field
        }

        if (file[assigneeField] == operator) {
            return true;
        }

        return false;
    }

    if (right == "workgroup") {
        if (file[assigneeField] == operator) { // when assignee is the operator, return true
            return true;
        }

        var mygroup = $("myGroups", SCFILE_READONLY).setFields(["member.of"]).select('name="' + operator + '"').uniqueResult();
        if (mygroup == null) {
            return false;
        }

        var workgroupField = assignmentFields[filename];
        if (workgroupField == null) {
            workgroupField = "assignment"; // default assignment group field
        }

        var workgroup = file[workgroupField];
        if (funcs.type(file[workgroupField]) == lib.DataTypeConst.typeArray()) {
            workgroup = file[workgroupField][0]; // this field is array in dbdict incidents
        }

        if (lib.ArrayUtil.contains(mygroup["member.of"], workgroup)) {
            return true;
        }

        return false;
    }

    //TODO need to consider allowed statuses & allowed categories

    return false;
}


/**
 * set current operator, on behalf of different user in integration scenario 
 * 
 * @param {String} operator
 */
function setOperator(operator) {
    // change current operator
    funcs.parse_evaluate('operator()="' + operator + '"');

    // set full name
    var fOperator = $('!operator').setFields(['full.name']).find('name=:name', operator).one();
    if (fOperator && fOperator['full.name']) {
        vars.$lo_ufname = fOperator['full.name'];
    } else {
        vars.$lo_ufname = operator;
    }
}