/**
 * @fileoverview  Handles security calls
 * @author Pete Budic
 */


/**
 *  This function determines what a specific right (or setting) is for a specific role in a given Area.  
 *  For example, this function can be used to determine if a Change Manager (role) can update (right) 
 *  tables contained in the Incidents area using the following call:
 *  getRoleRights( "Incidents", "update", "Change Manager")
 *  Note that the function returns a string which may need to be cast to another type by the calling 
 *  application.
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @param {String} right - The specific right to check (New, Update)
 *  @param {String} role - The user Role to check against (defaults to current user role)
 *  @return The security token corresponding to that right
 *  @type String  
 */

var _index = funcs.index;
var _lng = funcs.lng;
var _str = funcs.str;
var _insert = funcs.insert;
var _denull = funcs.denull;
var _val = funcs.val;
var _ = lib.Underscore.require();

var HAS_RIGHT = "true";
var NO_RIGHT = "false";
var WITH_FOLDER_RIGHTS_MERGE = 1;

var areaIndexTable = {};

function buildAreaIndexTable() {
    areaIndexTable = {};
    var rights = vars.$G_roleRights;
    var lngAreas = rights.areas.length();
    var rightArea = rights.areas;
    var i;
    for (i = 0; i < lngAreas; i++) {
        areaIndexTable[rightArea[i].area] = i;
    }
}

function getAreaFromGlobal(name) {
    if (_.isEmpty(areaIndexTable)) {
        buildAreaIndexTable();
    }

    var index = areaIndexTable[name];
    if (index == undefined) {
        return null;
    }
    var area = vars.$G_roleRights.areas[index];
    if (area.area != name) {
        buildAreaIndexTable();
        return getAreaFromGlobal(name);
    }

    return area;
}


function SecRoleRights() {
    this.role = "";
    this.areas = [];
}

function Area() {
    this.area = "";
    this.secLevel = 0;
    this.token = [];
    this.tokenValue = [];
    this.allowedStatus = [];
    this.allowedCategory = [];
    this.approvalGroup = [];
    this.assignmentGroup = [];
    this.folders = [];
}

function Folder() {
    this.folder = "";
    this.fToken = [];
    this.fTokenValue = [];
    this.fAllowedStatus = [];
    this.fSecLevel = 0;
    this.fAllowedCategory = [];
    this.fAssignmentGroup = [];
    this.fApprovalGroup = [];
}


function buildSecRoleRight(role) {
    vars.$G_roleRights_bak = vars.$G_roleRights;
    vars.$G_roleRights = null; //cut off $G.roleRights from old Datum
    rteBuildSecRoleRights(role, WITH_FOLDER_RIGHTS_MERGE); //the RTE function change $G.roleRights.
    var roleRightsNew = new SCDatum();
    var errCode;
    funcs.rtecall("copycurrent", errCode, roleRightsNew, vars.$G_roleRights);
    vars.$G_roleRights = vars.$G_roleRights_bak;
    return roleRightsNew;
}

function getRoleRights(area, right, role) {
    var rights;

    if (vars.$G_roleRights == null) {
        if (role == null) {
            if (vars.$G_role == null) {
                role = new SCDatum();
                role.setType(8);
                role = _insert(role, 1, 1);
                role[0] = "DEFAULT";
            } else {
                //For QCCR1E119275, comment out the sort.
                //var retCode = new SCDatum();
                //funcs.rtecall("sort", retCode, vars.$G_role, 0, 0);
                role = _denull(vars.$G_role);
            }
        }

        rteBuildSecRoleRights(role, WITH_FOLDER_RIGHTS_MERGE);
        rights = vars.$G_roleRights;

        if (rights == null) {
            return null;
        }

        buildAreaIndexTable();
    } else {
        rights = vars.$G_roleRights;
    }

    var objAreaPosition = getAreaFromGlobal(area);

    if (objAreaPosition != null) {
        if (right == "allowedCategory") {
            return objAreaPosition.allowedCategory;
        }
        if (right == "allowedStatus") {
            return objAreaPosition.allowedStatus;
        }
        if (right == "assignmentGroup") {
            return objAreaPosition.assignmentGroup;
        }
        if (right == "approvalGroup") {
            return objAreaPosition.approvalGroup;
        }
        var tokens = objAreaPosition.token;
        var tokenPosition = _index(right, tokens) - 1;
        if (tokenPosition >= 0) {
            if ("" === objAreaPosition.tokenValue[tokenPosition]) {
                return null;
            } else {
                return objAreaPosition.tokenValue[tokenPosition];
            }
        }

    }
    return null;
}

// Use the number to compare the value of rights.
var valueMapping = {
    "true": 30,
    "always": 30,
    "workgroup": 20,
    "assigned": 10,
    "never": 0,
    "false": 0
};

// Return the number value of right to compare. The value null will return a minus number.
function getRightValueMapping(rightValue) {
    if (rightValue == null || valueMapping[rightValue] == null) {
        return -100;
    }
    return valueMapping[rightValue];
}

// Invoke by the notification for close change task. 
// When operator has update and delete/close right, it returns true; otherwise return false;
function isAllowOperatorClose(opname, area, folder) {
    var roleRights = getOperatorRoleRights(opname);
    var updateRight = getRightsFromRoleRights(roleRights, area, "update", folder);
    var deleteRight = getRightsFromRoleRights(roleRights, area, "delete", folder);
    var notAllow = getRightValueMapping("never");
    if (getRightValueMapping(updateRight) > notAllow && getRightValueMapping(deleteRight) > notAllow) {
        return true;
    }

    return false;
}

// Return the right value from the merged secRoleRights of the operator
function getOperatorRights(opname, area, right, folder) {
    var roleRights = getOperatorRoleRights(opname);
    return getRightsFromRoleRights(roleRights, area, right, folder);
}

// Return the merged secRoleRights of operator
function getOperatorRoleRights(opname) {
    var operator = lib.operatorUtil.getOperatorByName(opname);

    if (operator) {
        var roleRights = buildSecRoleRight(operator["secRole"]);
        return roleRights;
    }

    return null;
}

// Return the right value from secRoleRights. When folder entitled, use folder right; otherwise use area.
function getRightsFromRoleRights(roleRights, area, right, folder) {
    var areas = roleRights.areas;
    var lngAreas = funcs.lng(areas);
    var i;
    var j;
    for (i = 0; i < lngAreas; i++) {
        if (area == areas[i].area) {
            if (vars["$G.folderEntitlement"] && folder != null && folder != "") {
                var fValue = null;
                var folders = areas[i].folders;
                var lngFolders = funcs.lng(folders);
                for (j = 0; j < lngFolders; j++) {
                    if (folder == folders[j].folder) {
                        var fTokenPosition = _index(right, folders[j].fToken) - 1;
                        if (fTokenPosition >= 0) {
                            fValue = folders[j].fTokenValue[fTokenPosition];
                        } else {
                            fValue = folders[j][right];
                        }
                        return fValue;
                    }
                }
            } else {
                var value = null;
                var tokenPosition = _index(right, areas[i].token) - 1;
                if (tokenPosition >= 0) {
                    value = areas[i].tokenValue[tokenPosition];
                } else {
                    value = areas[i][right];
                }

                return value;
            }

            break;
        }
    }

    return null;
}


function mergeRoleRights(roles) {
    if (roles == null || roles.length() == 0 || roles[0] == null || roles[0] == "") {
        if (vars.$G_roles == null || vars.$G_roles.length() == 0 ||
            vars.$G_roles[0] == null || vars.$G_roles[0] == "") {
            roles = new SCDatum();
            roles.setType(8);
            roles = _insert(roles, 1, 1, "DEFAULT");
            vars.$G_roles = roles;
        }
    }

    var allRoleRights = buildSecRoleRights(roles);

    var rights;
    var initialized = false;

    var i;
    var j;
    var x;
    var y;

    var lngAllRoleRights = allRoleRights.length;
    var roleIndex;
    for (roleIndex = 0; roleIndex < lngAllRoleRights; ++roleIndex) {
        var roleRight = allRoleRights[roleIndex];
        if (roleRight != null) {
            if (!initialized) {
                rights = new SecRoleRights();
                rights.areas = roleRight.areas;
                rights.role = roleRight.role;
                initialized = true;
            } else {
                rights.role += "/" + roleRight.role;
                var xlng = roleRight.areas.length;
                for (x = 0; x < xlng; x++) {
                    var objRole4AreaX = roleRight.areas[x];
                    var pos = -1;
                    var objRight4AreaI;
                    var ilng = rights.areas.length;
                    var rightsArea = rights.areas;
                    for (i = 0; i < ilng; i++) {
                        objRight4AreaI = rightsArea[i];
                        if (objRole4AreaX.area == objRight4AreaI.area) {
                            pos = x;
                            break;
                        }
                    }
                    if (pos == -1) {
                        rights.areas[ilng] = objRole4AreaX;
                        continue;
                    }

                    if (pos >= 0) {
                        var objRole4AreasPos = roleRight.areas[pos];
                        // Set "view" token
                        if (objRight4AreaI.tokenValue[0] == "true" || objRole4AreasPos.tokenValue[0] == "true") {
                            objRight4AreaI.tokenValue[0] = "true";
                        }
                        // Set "new" token
                        if (objRight4AreaI.tokenValue[1] == "true" || objRole4AreasPos.tokenValue[1] == "true") {
                            objRight4AreaI.tokenValue[1] = "true";
                        }
                        // set "delete" token"
                        var objAreaToken_2 = objRight4AreaI.tokenValue[2];
                        var objRightsToken_2 = objRole4AreasPos.tokenValue[2];
                        if (objAreaToken_2 == "never") {
                            objRight4AreaI.tokenValue[2] = objRightsToken_2;
                        } else if (objAreaToken_2 == "assigned") {
                            if (objRightsToken_2 == "always" || objRightsToken_2 == "workgroup") {
                                objRight4AreaI.tokenValue[2] = objRightsToken_2;
                            }
                        } else if (objAreaToken_2 == "workgroup") {
                            if (objRightsToken_2 == "always") {
                                objRight4AreaI.tokenValue[2] = objRightsToken_2;
                            }
                        }

                        var objAreaToken_3 = objRight4AreaI.tokenValue[3];
                        var objRightsToken_3 = objRole4AreasPos.tokenValue[3];

                        // Set "update" token
                        if (objAreaToken_3 == "never") {
                            objRight4AreaI.tokenValue[3] = objRightsToken_3;
                        } else if (objAreaToken_3 == "assigned") {
                            if (objRightsToken_3 == "always" || objRightsToken_3 == "workgroup") {
                                objRight4AreaI.tokenValue[3] = objRightsToken_3;
                            }
                        } else if (objAreaToken_3 == "workgroup") {
                            if (objRightsToken_3 == "always") {
                                objRight4AreaI.tokenValue[3] = objRightsToken_3;
                            }
                        }

                        // Set "modifyTemplate" rights
                        if (objRight4AreaI.tokenValue[4] == "true" || objRole4AreasPos.tokenValue[4] == "true") {
                            objRight4AreaI.tokenValue[4] = "true";
                        }

                        // Set "expert" rights
                        if (objRight4AreaI.tokenValue[5] == "true" || objRole4AreasPos.tokenValue[5] == "true") {
                            objRight4AreaI.tokenValue[5] = "true";
                        }

                        // Set "admin" rights
                        if (objRight4AreaI.tokenValue[6] == "true" || objRole4AreasPos.tokenValue[6] == "true") {
                            objRight4AreaI.tokenValue[6] = "true";
                        }

                        var lngPosToken = objRole4AreasPos.token.length;
                        for (y = 7; y < lngPosToken; y++) {
                            var tokenPosition = _index(objRole4AreasPos.token[y], objRight4AreaI.token) - 1;
                            if (tokenPosition > -1) {
                                if (objRight4AreaI.tokenValue[tokenPosition] == null || objRight4AreaI.tokenValue[tokenPosition] == "false") {
                                    objRight4AreaI.tokenValue[tokenPosition] = objRole4AreasPos.tokenValue[y];
                                }
                            } else {
                                var currentLength = objRight4AreaI.token.length;
                                objRight4AreaI.token[currentLength] = objRole4AreasPos.token[y];
                                objRight4AreaI.tokenValue[currentLength] = objRole4AreasPos.tokenValue[y];
                            }
                        }

                        var jlng;

                        //handle allowedStatus, if allowed status is empty on any role, that means he/she is allowed
                        //for all status which will override any other allowed status from other role
                        if (objRight4AreaI.allowedStatus == null || objRight4AreaI.allowedStatus.length == 0 ||
                            objRole4AreasPos.allowedStatus == null || objRole4AreasPos.allowedStatus.length == 0) {
                            objRight4AreaI.allowedStatus = [];
                        } else {
                            var lngTmpAllowedStatus = objRole4AreasPos.allowedStatus.length;
                            jlng = lngTmpAllowedStatus;
                            for (j = 0; j < jlng; j++) {
                                var objTmpAllowedStatus = objRole4AreasPos.allowedStatus[j];
                                if (objTmpAllowedStatus != null && _index(objTmpAllowedStatus, objRight4AreaI.allowedStatus) == 0) {
                                    objRight4AreaI.allowedStatus.push(objTmpAllowedStatus);
                                }
                            }
                        }

                        //handle approvalGroup, if approvalGroup would use join and not use empty as the highest role
                        if (objRight4AreaI.approvalGroup == null) {
                            objRight4AreaI.approvalGroup = [];
                        }
                        if (objRole4AreasPos.approvalGroup != null) {
                            var lngTmpApprovalGroup = objRole4AreasPos.approvalGroup.length;
                            jlng = lngTmpApprovalGroup;
                            for (j = 0; j < jlng; j++) {
                                var objTmpApprovalGroup = objRole4AreasPos.approvalGroup[j];
                                if (objTmpApprovalGroup != null && _index(objTmpApprovalGroup, objRight4AreaI.approvalGroup) == 0) {
                                    objRight4AreaI.approvalGroup.push(objTmpApprovalGroup);
                                }
                            }
                        }
                        //handle assignmentGroup, if assignmentGroup is empty on any role, that means he/she is allowed
                        //for all assignmentGroup which will override any other allowed status from other role
                        if (objRight4AreaI.assignmentGroup == null || objRight4AreaI.assignmentGroup.length == 0 ||
                            objRole4AreasPos.assignmentGroup == null || objRole4AreasPos.assignmentGroup.length == 0) {
                            objRight4AreaI.assignmentGroup = [];
                        } else {
                            jlng = objRole4AreasPos.assignmentGroup.length;
                            for (j = 0; j < jlng; j++) {
                                var objTmpAssignmentGroup = objRole4AreasPos.assignmentGroup[j];
                                if (objTmpAssignmentGroup != null && _index(objTmpAssignmentGroup, objRight4AreaI.assignmentGroup) == 0) {
                                    objRight4AreaI.assignmentGroup.push(objTmpAssignmentGroup);
                                }
                            }
                        }

                        //handle allowedCategory, if allowedCategory is empty on any role, that means he/she is allowed
                        //for all allowedCategory which will override any other allowedCategory from other role
                        if (objRight4AreaI.allowedCategory == null || objRight4AreaI.allowedCategory.length == 0 ||
                            objRole4AreasPos.allowedCategory == null || objRole4AreasPos.allowedCategory.length == 0) {
                            objRight4AreaI.allowedCategory = [];
                        } else {
                            jlng = objRole4AreasPos.allowedCategory.length;
                            for (j = 0; j < jlng; j++) {
                                var objTmpAllowedCategory = objRole4AreasPos.allowedCategory[j];
                                if (objTmpAllowedCategory != null && _index(objTmpAllowedCategory, objRight4AreaI.allowedCategory) == 0) {
                                    objRight4AreaI.allowedCategory.push(objTmpAllowedCategory);
                                }
                            }
                        }

                        //Merge Folder rights for this area
                        var lngTmpRoleFolders = objRole4AreasPos.folders.length;
                        var objRight4FoldersG;

                        var f;
                        for (f = 0; f < lngTmpRoleFolders; f++) {
                            var fIndex = -1;
                            var objPosFolders4F = objRole4AreasPos.folders[f];
                            var fName = objPosFolders4F.folder;

                            var lngTmpRightFolder = objRight4AreaI.folders.length;

                            var g;
                            for (g = 0; g < lngTmpRightFolder; g++) {
                                objRight4FoldersG = objRight4AreaI.folders[g];
                                if (objRight4FoldersG.folder == fName) {
                                    fIndex = g;
                                    break;
                                }
                            }

                            if (fIndex > -1) {
                                // Set "view" token 
                                if (objRight4FoldersG.fTokenValue[0] == "true" || objPosFolders4F.fTokenValue[0] == "true") {
                                    objRight4FoldersG.fTokenValue[0] = "true";
                                }
                                // Set "new" token
                                if (objRight4FoldersG.fTokenValue[1] == "true" || objPosFolders4F.fTokenValue[1] == "true") {
                                    objRight4FoldersG.fTokenValue[1] = "true";
                                }
                                // set "delete" token"
                                var fobjAreaToken_2 = objRight4FoldersG.fTokenValue[2];
                                var fobjRightsToken_2 = objPosFolders4F.fTokenValue[2];
                                if (fobjAreaToken_2 == "never") {
                                    objRight4FoldersG.fTokenValue[2] = fobjRightsToken_2;
                                } else if (fobjAreaToken_2 == "assigned") {
                                    if (fobjRightsToken_2 == "always" || fobjRightsToken_2 == "workgroup") {
                                        objRight4FoldersG.fTokenValue[2] = fobjRightsToken_2;
                                    }
                                } else if (fobjAreaToken_2 == "workgroup") {
                                    if (fobjRightsToken_2 == "always") {
                                        objRight4FoldersG.fTokenValue[2] = fobjRightsToken_2;
                                    }
                                }

                                // Set "update" token
                                var fobjAreaToken_3 = objRight4FoldersG.fTokenValue[3];
                                var fobjRightsToken_3 = roleRight.areas[pos].folders[f].fTokenValue[3];
                                if (fobjAreaToken_3 == "never") {
                                    objRight4FoldersG.fTokenValue[3] = fobjRightsToken_3;
                                } else if (fobjAreaToken_3 == "assigned") {
                                    if (fobjRightsToken_3 == "always" || fobjRightsToken_3 == "workgroup") {
                                        objRight4FoldersG.fTokenValue[3] = fobjRightsToken_3;
                                    }
                                } else if (fobjAreaToken_3 == "workgroup") {
                                    if (fobjRightsToken_3 == "always") {
                                        objRight4FoldersG.fTokenValue[3] = fobjRightsToken_3;
                                    }
                                }

                                // Set "modifyTemplate" rights
                                if (objRight4FoldersG.fTokenValue[4] == "true" || objPosFolders4F.fTokenValue[4] == "true") {
                                    objRight4FoldersG.fTokenValue[4] = "true";
                                }

                                // Set "expert" rights
                                if (objRight4FoldersG.fTokenValue[5] == "true" || objPosFolders4F.fTokenValue[6] == "true") {
                                    objRight4FoldersG.fTokenValue[5] = "true";
                                }

                                var fj;

                                // Set "admin" rights
                                if (objRight4FoldersG.fTokenValue[6] == "true" || objPosFolders4F.fTokenValue[7] == "true") {
                                    objRight4FoldersG.fTokenValue[6] = "true";
                                }

                                var fjlng;

                                //allowed status   
                                if (objRight4FoldersG.fAllowedStatus == null || objRight4FoldersG.fAllowedStatus.length == 0 ||
                                    objPosFolders4F.fAllowedStatus == null || objPosFolders4F.fAllowedStatus.length == 0) {
                                    objRight4FoldersG.fAllowedStatus = [];
                                } else {
                                    fjlng = objPosFolders4F.fAllowedStatus.length;
                                    for (fj = 0; fj < fjlng; fj++) {
                                        if (objPosFolders4F.fAllowedStatus[fj] != null &&
                                            _index(objPosFolders4F.fAllowedStatus[fj], objRight4FoldersG.fAllowedStatus) == 0) {
                                            objRight4FoldersG.fAllowedStatus =
                                                _insert(objRight4FoldersG.fAllowedStatus, 0, 1, objPosFolders4F.fAllowedStatus[fj]);
                                        }
                                    }
                                }

                                //allowed category   
                                if (objRight4FoldersG.fAllowedCategory == null || objRight4FoldersG.fAllowedCategory.length == 0 ||
                                    objPosFolders4F.fAllowedCategory == null || objPosFolders4F.fAllowedCategory.length == 0) {
                                    objRight4FoldersG.fAllowedCategory = [];
                                } else {
                                    fjlng = objPosFolders4F.fAllowedCategory.length;
                                    for (fj = 0; fj < fjlng; fj++) {
                                        if (objPosFolders4F.fAllowedCategory[fj] != null &&
                                            _index(objPosFolders4F.fAllowedCategory[fj], objRight4FoldersG.fAllowedCategory) == 0) {
                                            objRight4FoldersG.fAllowedCategory =
                                                _insert(objRight4FoldersG.fAllowedCategory, 0, 1, objPosFolders4F.fAllowedCategory[fj]);
                                        }
                                    }
                                }

                                //AssignmentGroup
                                if (objRight4FoldersG.fAssignmentGroup == null || objRight4FoldersG.fAssignmentGroup.length == 0 ||
                                    objPosFolders4F.fAssignmentGroup == null || objPosFolders4F.fAssignmentGroup.length == 0) {
                                    objRight4FoldersG.fAssignmentGroup = [];
                                } else {
                                    fjlng = objPosFolders4F.fAssignmentGroup.length;
                                    for (fj = 0; fj < fjlng; fj++) {
                                        if (objPosFolders4F.fAssignmentGroup[fj] != null &&
                                            _index(objPosFolders4F.fAssignmentGroup[fj], objRight4FoldersG.fAssignmentGroup) == 0) {
                                            objRight4FoldersG.fAssignmentGroup =
                                                _insert(objRight4FoldersG.fAssignmentGroup, 0, 1, objPosFolders4F.fAssignmentGroup[fj]);
                                        }
                                    }
                                }

                                // if approvalGroup would use join and not use empty as the highest role   
                                if (objRight4FoldersG.fApprovalGroup == null) {
                                    objRight4FoldersG.fApprovalGroup = [];
                                }
                                if (objPosFolders4F.fApprovalGroup != null) {
                                    fjlng = objPosFolders4F.fApprovalGroup.length;
                                    for (fj = 0; fj < fjlng; fj++) {
                                        if (objPosFolders4F.fApprovalGroup[fj] != null &&
                                            _index(objPosFolders4F.fApprovalGroup[fj], objRight4FoldersG.fApprovalGroup) == 0) {
                                            objRight4AreaI.folders[g].fApprovalGroup =
                                                _insert(objRight4FoldersG.fApprovalGroup, 0, 1, objPosFolders4F.fApprovalGroup[fj]);
                                        }
                                    }
                                }
                            } else {
                                fIndex = objRight4AreaI.folders.length;
                                objRight4AreaI.folders[fIndex] = objPosFolders4F;
                            }

                        }
                    }
                }
            }
        } else {
            sql = "role=\"DEFAULT\"";

            if (roleRight.doSelect(sql) == RC_SUCCESS) {
                rights = roleRight;
            }
            //  If there is no default role (customer deleted it) then they will get back an empty file variable
        }

    }

    //  Now loop through the roleRights to set the Area Defaults to any necessary fields.
    var lngRightsAreas2 = rights.areas.length;
    for (i = 0; i < lngRightsAreas2; i++) {
        var thisArea = new SCFile("secArea");
        var sql = "name=\"" + rights.areas[i].area + "\"";
        var objRightsAreas4i = rights.areas[i];

        if (thisArea.doSelect(sql) == RC_SUCCESS) {
            var settingLng = thisArea.settingId.length();
            for (y = 0; y < settingLng; y++) {
                var tokenPosition = _index(thisArea.settingId[y], objRightsAreas4i.token) - 1;
                if (tokenPosition > -1) {
                    if (objRightsAreas4i.tokenValue[tokenPosition] == null || objRightsAreas4i.tokenValue[tokenPosition] == "false") {
                        objRightsAreas4i.tokenValue[tokenPosition] = thisArea.settingValue[y];
                    }
                } else {
                    var currentLength = objRightsAreas4i.token.length;
                    objRightsAreas4i.token[currentLength] = thisArea.settingId[y];
                    objRightsAreas4i.tokenValue[currentLength] = thisArea.settingValue[y];
                }
            }
        }
    }

    //Copy the value back to SecRoleRights obj
    var finalRights = new SCFile("secRoleRights");
    finalRights.role = rights.role;

    var lngAreas2 = rights.areas.length;
    for (i = 0; i < lngAreas2; i++) {
        //populate the finalRights
        var objFnlArea = finalRights.areas[i];
        var objRgtArea = rights.areas[i];
        objFnlArea.area = objRgtArea.area;

        //populate basic rights
        var lngToken = objRgtArea.token.length;
        for (j = 0; j < lngToken; ++j) {
            objFnlArea.token[j] = _str(objRgtArea.token[j]);
            objFnlArea.tokenValue[j] = _str(objRgtArea.tokenValue[j]);
        }

        objFnlArea.allowedStatus = objRgtArea.allowedStatus;
        objFnlArea.allowedCategory = objRgtArea.allowedCategory;
        objFnlArea.assignmentGroup = objRgtArea.assignmentGroup;
        objFnlArea.approvalGroup = objRgtArea.approvalGroup;

        var lng = _lng(objRgtArea.folders);
        for (j = 0; j < lng; j++) {
            var objFnlFolder = objFnlArea.folders[j];
            var objRgtFolder = objRgtArea.folders[j];

            objFnlFolder.folder = objRgtFolder.folder;
            for (x = 0; x < 7; x++) {
                objFnlFolder.fToken[x] = objRgtFolder.fToken[x];
                objFnlFolder.fTokenValue[x] = objRgtFolder.fTokenValue[x];
            }
            objFnlFolder.fAllowedStatus = objRgtFolder.fAllowedStatus;
            objFnlFolder.fAllowedCategory = objRgtFolder.fAllowedCategory;
            objFnlFolder.fAssignmentGroup = objRgtFolder.fAssignmentGroup;
            objFnlFolder.fApprovalGroup = objRgtFolder.fApprovalGroup;
        }
    }

    vars.$G_roleRights = finalRights;
    return finalRights;
}

/**
 *  This function determines what a specific right (or setting) is authorized for the current role in a given Area.  
 *  For example, this function can be used to determine if the current use can update tables contained in the Incidents area using the following call:
 *  getRights( "Incidents", "update")
 *  Note that the function returns null/string/array of string which may need to be cast to another type by the calling application.
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @param {String} right - The specific right to check (New, Update)
 *  @return The security token corresponding to that right, the type of returned value depends on the type of the right, it can be null/string/array of string
 */
function getRights(area, right) {
    // Special case for Knowledge as it uses Category Based security and not Role Based
    if (area == "Knowledge Document") {
        return lib.KMSecurityModel.getTokenValue(right);
    }
    
    var roleRight = getRoleRights(area, right, null);
    if(roleRight == "false" && (right == "delete" || right == "update")){
        roleRight = "never";
    }
    return roleRight;
}

/**
 *  This function is an alias for getRights
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @param {String} right - The specific right to check (New, Update)
 *  @return The security token corresponding to that right
 *  @type String  
 */
function getToken(area, right) {
    return getRights(area, right);
}

/**
 * @deprecated  
 *   Use getRights function instead of this funciton.Note that getRights return right token instead of boolean, the returned value can be null/string/array of string.If you are 
 *   within document engine, you can use access control variables such as $L.tableAccess.new/$L.tableAccess.update etc. directly.
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @param {String} right - The specific right to check (New, Update)
 *  @return The security token value corresponding to that right.
 */
function hasRight(area, right) {
    var r = getRoleRights(area, right, null);
    if (r != null) {
        return r;
    }
    if (funcs.operator() == "falcon") {
        return HAS_RIGHT; //return string
    }

    return NO_RIGHT;
}


function allowEditSystem() {
    return true;
}

/**
 *  This function retrieves all status based on tables in the area
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @return List of allowed statuses
 *  @type Array  
 */
function getAllowedStatusForArea(area) {
    // get all tables for the area that supports status 
    if (area == null || area.length == 0) {
        return [];
    }

    var tableList = getTableListStringForArea(area);
    if (tableList.length == 0) {
        return [];
    }

    //get all module status in those tables
    var moduleStatus = new SCFile("ModuleStatus", SCFILE_READONLY);
    moduleStatus.setFields(["status"]);

    var sql2 = "tablename isin " + tableList;

    var statusList = [];

    if (moduleStatus.doSelect(sql2) == RC_SUCCESS) {
        do {
            statusList.push(moduleStatus.status);
        }
        while (moduleStatus.getNext() == RC_SUCCESS);
    }
    return statusList;
}


/**
 *  This function retrieves all status based on tables in the area
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @returns {Object} 
 *			valueList: List of allowed statuses
 *			displayList: List of localized allowed statuses
 */
function getLocalAllowedStatusForArea(area) {

    var tables = getTableListStringForArea(area);
    if (tables.length == 0) {
        return {
            "valueList": [],
            "displayList": []
        };
    }

    var list = [];
    var localList = [];

    //get all module status in those tables
    var moduleStatus = lib.c.$("ModuleStatus", SCFILE_READONLY).select("tablename isin " + tables).iterate(function(moduleStatus) {
        var status = moduleStatus.status;

        if (status == null || lib.ArrayUtil.contains(list, status)) {
            return false;
        }

        list.push(status);

        var messageId = moduleStatus.module + ';' + status + ';' + (moduleStatus.workflow != null ? moduleStatus.workflow : "NULL");
        var msg = funcs.scmsg(messageId, "local:ModuleStatus");
        if (msg != null) {
            status = msg;
        }
        localList.push(status);
    });

    return {
        "valueList": list,
        "displayList": localList
    };
}


function getTableListStringForArea(area) {
    // get all tables for the area that supports status 
    if (area == null || area.length == 0) {
        return "";
    }

    var table = new SCFile("datadict", SCFILE_READONLY);
    var sql = "sc.area=\"" + area + "\"";
    var tableList = "{";

    if (table.doSelect(sql) == RC_SUCCESS) {
        do {
            tableList += "\"" + table.name + "\",";
        }
        while (table.getNext() == RC_SUCCESS);
    } else {
        return "";
    }

    tableList = tableList.substring(0, tableList.length - 1) + "}";
    return tableList;
}


/**
 *  This function retrieves all allowed categories based on tables in the area
 *
 *  @param {String} area - The Security Area that is to be checked (Incidents, Changes)
 *  @return List of allowed categories
 *  @type Array  
 */
function getAllowedCategoryForArea(area) {
    if (area == null || area.length == 0) {
        return;
    }

    var tableList = getTableListStringForArea(area);
    if (tableList.length == 0) {
        return [];
    }

    //get all category file names those tables
    var object = new SCFile("Object", SCFILE_READONLY);
    object.setFields(["category.file.name"]);
    var sql2 = "file.name isin " + tableList + " and not null(category.file.name)";


    var objectList = [];

    if (object.doSelect(sql2) == RC_SUCCESS) {
        do {
            objectList.push(object.category_file_name);
        }
        while (object.getNext() == RC_SUCCESS);
    } else {
        return;
    }

    //combine those categories together
    var categoryList = [];
    var i;
    for (i = 0; i < objectList.length; ++i) {
        var category = new SCFile(objectList[i], SCFILE_READONLY);
        category.setFields(["name"]);
        var sql3 = "true";

        if (category.doSelect(sql3) == RC_SUCCESS) {
            do {
                categoryList.push(category.name);
            }
            while (category.getNext() == RC_SUCCESS);
        }
    }

    return categoryList;
}

/**
 *  This function retrieves the security area for a specific table
 *
 *  @param {String} fileName - The name of the table to be checked
 *  @return The Security Area
 *  @type String  
 */
function getArea(fileName) {
    var table = new SCFile("datadict");
    var sql = "name=\"" + fileName + "\"";

    if (table.doSelect(sql) == RC_SUCCESS) {
        return table.sc_area;
    }
    return null;
}

/**
 *  This function retrieves the tables assocated with a specific security area 
 *
 *  @param {String} area - The name of the security area to be checked
 *  @param {String} folders - If true, this will only return tables that have a "folder" field
 *  @return The List of tables
 *  @type Array  
 */
function getTablesForArea(area, folders) {
    var table = new SCFile("datadict");
    var sql = "sc.area=\"" + area + "\"";
    var table_list = [];

    if (table.doSelect(sql) == RC_SUCCESS) {
        do {
            if (folders != true || _index("folder", table.fields) > 0) {
                table_list.push(table.name);
            }
        }
        while (table.getNext() == RC_SUCCESS);
    }
    return table_list;
}

/**
 * This function retrieves all secRights record given an array of roles and builds
 * an array of secRoleRights records
 */
function buildSecRoleRights(roles) {
    var allRights = [];

    //first, iterate through all secRights records associated with this role
    var secRights = new SCFile("secRights");
    var sql;
    if (roles.length() == 1) {
        sql = "role=\"" + roles[0] + "\"";
    } else {
        sql = "role isin " + _str(roles);
    }

    var i = 0;
    var roleName = "";
    var roleIndex = 0;
    var secRoleRights;
    if (secRights.doSelect(sql) == RC_SUCCESS) {
        do {
            if (secRights.role != roleName) {
                i = 0;
                //init a secRoleRights table
                secRoleRights = new SecRoleRights();

                roleName = secRights.role;
                secRoleRights.role = secRights.role;
                allRights.push(secRoleRights);
            }
            var secRoleRightsArea = new Area();
            //populate the secRoleRights               
            secRoleRightsArea.area = secRights.area;
            secRoleRightsArea.token = ["view", "new", "update", "delete", "modifyTemplate", "expert", "admin"];
            //populate basic rights
            var j;
            for (j = 0; j < 7; ++j) {
                secRoleRightsArea.tokenValue[j] = _str(secRights[j + 2]);
            }
            //populate addtional settings
            var moreIndex = 7;
            var settingLng = secRights.settingId.length();
            for (j = 0; j < settingLng; ++j) {
                var tokenIndex = moreIndex + j;
                secRoleRightsArea.token[tokenIndex] = secRights.settingId[j];
                secRoleRightsArea.tokenValue[tokenIndex] = secRights.settingValue[j];
            }

            secRoleRightsArea.allowedStatus = lib.ArrayUtil.toJsArray(_denull(secRights.allowedStatus));
            secRoleRightsArea.allowedCategory = lib.ArrayUtil.toJsArray(_denull(secRights.allowedCategory));
            secRoleRightsArea.assignmentGroup = lib.ArrayUtil.toJsArray(_denull(secRights.assignmentGroup));
            secRoleRightsArea.approvalGroup = lib.ArrayUtil.toJsArray(_denull(secRights.approvalGroup));

            var lng = _lng(_denull(secRights.folders));

            for (j = 0; j < lng; j++) {
                var secfolder = new Folder();
                secfolder.folder = secRights.folders[j];
                var x;
                for (x = 0; x < 7; x++) {
                    secfolder.fToken[x] = secRoleRightsArea.token[x];
                    secfolder.fTokenValue[x] = secRoleRightsArea.tokenValue[x];
                }
                secfolder.fAllowedStatus = secRoleRightsArea.allowedStatus;
                secfolder.fAllowedCategory = secRoleRightsArea.allowedCategory;
                secfolder.fAssignmentGroup = secRoleRightsArea.assignmentGroup;
                secfolder.fApprovalGroup = secRoleRightsArea.approvalGroup;
                secRoleRightsArea.folders.push(secfolder);
            }
            secRoleRights.areas.push(secRoleRightsArea);

            ++i;
        }
        while (secRights.getNext() == RC_SUCCESS);
    } else {
        return null;
    }

    return allRights;
}

/**
 * this function is called from doc engine and it will merge folder rights into $G.roleRights and return the area
 * this method is deprecated from pd4, no code reference 
 */
function setupFolderRights() {
    if (vars.$G_secFolderRightsSetup) {
        return;
    }
    //get all roles in $G.role
    var roles = _str(vars.$G_role);

    //get all FolderRights associated with all Roles
    var sql = "name isin " + roles;
    var folderRights = new SCFile("FolderRights");
    var initialized = false;
    var folderName = "";
    var folderIndex = 0;
    var roleName = "";
    var roleChange = false;

    if (folderRights.doSelect(sql) == RC_SUCCESS) {
        do {
            if (folderRights.name != roleName && roleName != "") {
                roleName = folderRights.name;
                roleChange = true;
            } else if (folderRights.name != roleName) {
                roleName = folderRights.name;
            }

            if (!roleChange) {
                var secRoleRights1 = populateFolderRights(folderRights, folderIndex);
                ++folderIndex;
            } else {
                mergeFolderRights(folderRights);
            }
        }
        while (folderRights.getNext() == RC_SUCCESS);
    }
    vars.$G_secFolderRightsSetup = true;
}

function populateFolderRights(folderRights, folderIndex) {
    var allRights = vars.$G_roleRights;
    var ilng = allRights.areas.length();
    var i;
    for (i = 0; i < ilng; i++) {
        var objArea = allRights.areas[i];
        //if area is same as the area in the folder rights, then populate the 
        if (objArea.area == folderRights.tablename) {
            var objFolder = objArea.folders[folderIndex];

            objFolder.folder = folderRights.folder;
            //set view value
            objFolder.fToken[0] = "view";
            objFolder.fTokenValue[0] = Boolean(folderRights.view).toString();
            //set new value
            objFolder.fToken[1] = "new";
            objFolder.fTokenValue[1] = Boolean(folderRights._new).toString();
            //set delete value
            objFolder.fToken[2] = "delete";
            objFolder.fTokenValue[2] = folderRights._delete;
            //set update value
            objFolder.fToken[3] = "update";
            objFolder.fTokenValue[3] = folderRights.update;
            //set modifyTemplate value
            objFolder.fToken[4] = "modifyTemplate";
            objFolder.fTokenValue[4] = "false";
            //set dupliate value
            objFolder.fToken[5] = "duplicate";
            objFolder.fTokenValue[5] = "false";
            //set expert value
            objFolder.fToken[6] = "expert";
            objFolder.fTokenValue[6] = Boolean(folderRights.expert).toString();
            //set expert value
            objFolder.fToken[7] = "admin";
            objFolder.fTokenValue[7] = Boolean(folderRights.admin).toString();
            //set allowed status
            objFolder.fAllowedStatus = folderRights.allowedStatus;
            //set allowed category
            objFolder.fAllowedCategory = folderRights.allowedCategory;
            //set fAssignmentGroup
            objFolder.fAssignmentGroup = folderRights.assignmentGroup;
            //set fApprovalGroup
            objFolder.fApprovalGroup = folderRights.approvalGroup;
        }
    }
}


function mergeFolderRights(folderRights) {
    var allRights = vars.$G_roleRights;
    var ilng = allRights.areas.length();
    var jlng;
    var i;
    var j;
    for (i = 0; i < ilng; i++) {
        var objArea = allRights.areas[i];
        //if area is same as the area in the folder rights, then populate the 
        if (objArea.area == folderRights.tablename) {
            //if area matches, then we match the folder
            var folderIndex;
            var folderIndexlng = objArea.folders.length();
            for (folderIndex = 0; folderIndex < folderIndexlng; folderIndex++) {
                var objFolder = objArea.folders[folderIndex];
                if (objFolder.folder == folderRights.folder) {
                    //set view value
                    if (objFolder.fTokenValue[0] == "true" || folderRights.view == true) {
                        objFolder.fTokenValue[0] = "true";
                    }

                    //set new value
                    if (objFolder.fTokenValue[1] == "true" || folderRights._new == true) {
                        objFolder.fTokenValue[1] = "true";
                    }

                    //set delete value
                    if (objFolder.fTokenValue[2] == "never") {
                        objFolder.fTokenValue[2] = folderRights._delete;
                    } else if (objFolder.fTokenValue[2] == "assigned") {
                        if (folderRights._delete == "always" || folderRights._delete == "workgroup") {
                            objFolder.fTokenValue[2] = folderRights._delete;
                        }
                    } else if (objFolder.fTokenValue[2] == "workgroup") {
                        if (folderRights._delete == "always") {
                            objFolder.fTokenValue[2] = folderRights._delete;
                        }
                    }

                    //set update value
                    if (objFolder.fTokenValue[3] == "never") {
                        objFolder.fTokenValue[3] = folderRights.update;
                    } else if (objFolder.fTokenValue[3] == "assigned") {
                        if (folderRights.update == "always" || folderRights.update == "workgroup") {
                            objFolder.fTokenValue[3] = folderRights.update;
                        }
                    } else if (objFolder.fTokenValue[3] == "workgroup") {
                        if (folderRights.update == "always") {
                            objFolder.fTokenValue[3] = folderRights.update;
                        }
                    }

                    //set expert value
                    if (objFolder.fTokenValue[6] == "true" || folderRights.expert == true) {
                        objFolder.fTokenValue[6] = "true";
                    }

                    //set admin
                    if (objFolder.fTokenValue[7] == "true" || folderRights.admin == true) {
                        objFolder.fTokenValue[7] = "true";
                    }

                    //set allow status
                    jlng = objFolder.fAllowedStatus.length();
                    for (j = 0; j < jlng; j++) {
                        if (objFolder.fAllowedStatus[j] != null && _index(objFolder.fAllowedStatus[j], folderRights.fAllowedStatus[j]) == 0) {
                            objFolder.fAllowedStatus = _insert(objFolder.fAllowedStatus, 0, 1, folderRights.fAllowedStatus[j]);
                        }
                    }
                    //set allow category
                    jlng = objFolder.fAllowedCategory.length();
                    for (j = 0; j < jlng; j++) {
                        if (objFolder.fAllowedCategory[j] != null && _index(objFolder.fAllowedCategory[j], folderRights.fAllowedCategory[j]) == 0) {
                            objFolder.fAllowedCategory = _insert(objFolder.fAllowedCategory, 0, 1, folderRights.fAllowedCategory[j]);
                        }
                    }
                    //set ApprovalGroup
                    jlng = objFolder.fApprovalGroup.length();
                    for (j = 0; j < jlng; j++) {
                        if (objFolder.fApprovalGroup[j] != null && _index(objFolder.fApprovalGroup[j], folderRights.fApprovalGroup[j]) == 0) {
                            objFolder.fApprovalGroup = _insert(objFolder.fApprovalGroup, 0, 1, folderRights.fApprovalGroup[j]);
                        }
                    }
                    //set AssignmentGroup
                    jlng = objFolder.fAssignmentGroup.length();
                    for (j = 0; j < jlng; j++) {
                        if (objFolder.fAssignmentGroup[j] != null && _index(objFolder.fAssignmentGroup[j], folderRights.fAssignmentGroup[j]) == 0) {
                            objFolder.fAssignmentGroup = _insert(objFolder.fAssignmentGroup, 0, 1, folderRights.fAssignmentGroup[j]);
                        }
                    }
                }
            }
        }
    }
}

/**
 * gets default rights from folder, this used for generating scFolderAccess query
 */
function getDefaultViewRights(folderRights) {
    if (funcs.filename(folderRights) == "secRights") {
        return folderRights.view;
    }
    var defaultRights = new SCFile("secRights", SCFILE_READONLY);
    defaultRights.setFields(["view"]);
    var sql = "role=\"" + folderRights.name + "\" and area=\"" + folderRights.tablename + "\"";

    if (defaultRights.doSelect(sql) == RC_SUCCESS) {
        return defaultRights.view;
    }
    return false;
}

function allowDeleteArea(areaName) {
    var internalAreas = ["Tailoring", "Knowledge Administration", "Security"];
    var i;
    for (i = 0; i < internalAreas.length; ++i) {
        if (areaName == internalAreas[i]) {
            return false;
        }
    }
    return true;
}

function createFolderForm(rights) {
    var form = new XML("form");
    var folders = new SCFile("FolderDef", SCFILE_READONLY);
    folders.setFields(["name"]);
    var sql = "true";

    if (folders.doSelect(sql) == RC_SUCCESS) {
        do {
            var type = "text";
            var option;
            var suffix = ":";
            var isRecord = false;
            type = "checkbox";

            var node = form.addElement(type);
            node.setAttributeValue("id", folders.name);
            node.setAttributeValue("label", folders.name);

            var index = _index(folders.name, rights.folders);

            if (index > 0) {
                node.setValue(true);
            }
        }
        while (folders.getNext() == RC_SUCCESS);

    }
    return form.toXMLString();
}

function parseForm(formXML, rights) {
    var form = new XML();
    var folders = [];
    if (formXML != null && formXML != "") {
        if (form.setContent(formXML)) {
            var parent = form.getDocumentElement();
            var node = parent.getFirstChildElement();
            while (node != null) {
                var id = node.getAttributeValue("id");
                if (node.getValue() == true || node.getValue() == "true") {
                    folders.push(id);
                }
                node = node.getNextSiblingElement();
            }
        }
    }

    rights.folders = folders;
    return;
}