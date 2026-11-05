/**
 * This script contains various functions used in Operator Operations
 * 
 * Zhang Qi
 */

var $ = lib.c.$;
var _ = lib.Underscore.require();

/**
 * This function returns a query that is used by link omcq file
 * to query operators by department.
 */
function getOperatorQueryByDepartment(department) {
    if (department == null) {
        return true;
    }

    var contact = new SCFile("contacts", SCFILE_READONLY);
    contact.setFields("contact.name");
    var sql = "dept = \"" + department + "\"";

    var contactArray = [];

    var rc = contact.doSelect(sql);
    while (rc == RC_SUCCESS) {
        contactArray.push(contact.contact_name);
        rc = contact.getNext();
    }

    if (contactArray.length > 0) {
        var list = "";
        var i;
        for (i in contactArray) {
            if (contactArray.hasOwnProperty(i)) {
                list += "\"" + contactArray[i] + "\",";
            }
        }
        return "contact.name isin {" + list + "}";
    } else {
        // no records found
        return false;
    }
}


function checkPassword2(password, password2) {
    if (!checkMatchPassword(password, password2)) {
        return false;
    }

    return checkPassword(password);
}


function checkMatchPassword(password, password2) {
    if (password != password2) {
        warn(342, "us");
        return false;
    }

    return true;
}

/**
Security fix:
If RAD call the checkPassword, the parameters (password) will be printed in rtm:3
Fix: Use RAD local variable to set the parameters.
*/
function checkPasswordSecure() {
    return checkPassword(vars.$L_file.password);
}


/**
Input
    @param password the password to check
Output
    return true if the password is valid
*/
function checkPassword(password) {

    var info = vars.$G_system_info;

    // check required
    if (info.no_null_password) {
        if (password == null || password.length == 0) {
            warn(11, "trigger");
            return false;
        }
    } else {
        if (password == null || password.length == 0) {
            return true;
        }
    }

    // check length
    if (info.min_pwd_len > 0) {
        if (password.length < info.min_pwd_len) {
            warn(12, "trigger", info.min_pwd_len);
            return false;
        }
    }

    if (info.max_pwd_len > 0) {
        if (password.length > info.max_pwd_len) {
            warn(13, "trigger", info.max_pwd_len);
            return false;
        }
    }

    var icount;
    var minCount;
    var i;

    // check alpha
    if (info.allow_alpha) {
        // check require Alpha
        // check min required
        if (info.require_alpha) {
            icount = 0;
            minCount = info.alpha_min;

            if (minCount == null || minCount == 0) {
                minCount = 1;
            }

            for (i = 0; i < password.length; i++) {
                if (isAlpha(password[i])) {
                    icount++;
                }

                if (icount >= minCount) {
                    break;
                }
            }

            if (icount < minCount) {
                warn(10, "trigger", minCount);
                return false;
            }
        }

        if (info.require_mixed_case) {
            // check require Mixed Case
            var hasLower = false;
            var hasUpper = false;
            for (i = 0; i < password.length; i++) {
                if (password[i] >= 'a' && password[i] <= 'z') {
                    hasLower = true;
                }

                if (password[i] >= 'A' && password[i] <= 'Z') {
                    hasUpper = true;
                }

                if (hasLower && hasUpper) {
                    break;
                }
            }

            if ((!hasLower) || !(hasUpper)) {
                warn(9, "trigger");
                return false;
            }
        }

    } else {
        for (i = 0; i < password.length; i++) {
            if (isAlpha(password[i])) {
                warn(6, "trigger");
                return false;
            }
        }
    }

    // check number
    if (!info.allow_numeric) {
        for (i = 0; i < password.length; i++) {
            if (isNum(password[i])) {
                warn(7, "trigger");
                return false;
            }
        }
    }

    // Symbolic
    if (!info.allow_symbolic) {
        for (i = 0; i < password.length; i++) {
            if ((!isAlpha(password[i])) && (!isNum(password[i]))) {
                warn(5, "trigger");
                return false;
            }
        }
    }

    // check Non-Alpha
    if (info.require_non_alpha) {
        icount = 0;
        minCount = info.symbolic_min;
        if (minCount == null || minCount == 0) {
            minCount = 1;
        }
        for (i = 0; i < password.length; i++) {
            if (!isAlpha(password[i])) {
                icount++;
            }

            if (icount >= minCount) {
                break;
            }
        }

        if (icount < minCount) {
            warn(8, "trigger", minCount);
            return false;
        }
    }

    // Check Prohibit space
    if (info.prohibit_space) {
        for (i = 0; i < password.length; i++) {
            if (password[i] == ' ') {
                warn(4, "trigger");
                return false;
            }
        }
    }

    return true;
}

function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isNum(c) {
    return c >= '0' && c <= '9';
}

function warn(msgId, msgClass, parameterStr) {
    var msg = "";
    if (parameterStr) {
        var parArr = lib.ArrayUtil.toSCDatum([parameterStr]);
        msg = funcs.scmsg(msgId + 20, msgClass, parArr);
    } else {
        msg = funcs.scmsg(msgId, msgClass);
    }
    vars.$msg_password_check = msg;
    vars.$L_error_code = msgId;
}

/**
 * Return the file of operator by the name.
 * If the operator name is virtual (from command or integration), it returns null.
 *
 * @param {String} name
 * @param {Array} fields
 * @returns {SCFile}
 **/
function getOperatorByName(name, fields) {
    if (name == null) {
        return null;
    }

    var operator;
    if (!fields) {
        operator = new SCFile("operator");
    } else {
        operator = new SCFile("operator", SCFILE_READONLY);
        operator.setFields(fields);
    }

    var rc = operator.doSelect("name=\"" + name + "\"");

    if (rc == RC_SUCCESS) {
        return operator;
    }

    return null;
}

/**
 * Return the file of contacts by the name.
 *
 * @param {String} name
 * @param {Array} fields
 * @returns {SCFile}
 **/
function getContactByName(name, fields) {
    if (name == null) {
        return null;
    }

    var contact;
    if (!fields) {
        contact = new SCFile("contacts");
    } else {
        contact = new SCFile("contacts", SCFILE_READONLY);
        contact.setFields(fields);
    }

    var rc = contact.doSelect("contact.name=\"" + name + "\"");

    if (rc == RC_SUCCESS) {
        return contact;
    }

    return null;
}

/**
 * Return name of operator by the contact.name.
 * If the operator name is virtual (from command or integration), it returns null.
 **/
function getOperatorNameByContactName(contactName) {
    if (contactName == null) {
        return null;
    }

    var operator = new SCFile("operator", SCFILE_READONLY);
    operator.setFields(['name']);
    var rc = operator.doSelect("contact.name=\"" + contactName + "\"");

    if (rc == RC_SUCCESS) {
        return operator.name;
    }

    return null;
}

/**
 * Return name of operator by the user.principal.name.
 * If the operator name is virtual (from command or integration), it returns null.
 **/
function getOperatorNameByUPN(upn) {
    if (upn == null) {
        return null;
    }

    var operator = $("!operator").fields("name").find("user.principal.name=:upn", upn).one();
    if (operator) {
        return operator.name;
    }

    return null;
}

/**
 * Return the contact.name by name of operator.
 **/
function getContactNameByOperatorName(operatorName) {
    var contact = $("!contacts").fields("contact.name").find("operator.id=:op", operatorName).one();
    if (contact) {
        return contact.contact_name;
    }

    return null;
}

/**
 * Return the file of company in System Information Record.
 * If there is no company, return null.
 **/
function getCompany() {
    var company = new SCFile("info");
    var rc = company.doSelect("type=\"company\" and format=\"info.company\"");
    if (rc == RC_SUCCESS) {
        return company;
    }

    return null;
}


/**
 Input: vars.$L_password;
 Output: true if the password is encrypted, otherwise, false
 */
function isEncrypted() {
    var password = vars.$L_password;
    if (null == password) {
        return false;
    }

    return lib.EncryptUtil.isEncrypted(password);
}

/**
 Input: password
 Output: decrypted password if the password is encrypted, otherwise the password
 */
function getPassword(password) {
    if (null == password) {
        return '';
    }

    vars.$L_password = password;

    return lib.EncryptUtil.decrypt(password);
}


/**
 * Reset password date for all operators, because password policy has 
 * been enhanced cause all operator password expired.
 */
function resetAllPasswordDate() {
    // disable trigger first
    var rc = new SCDatum();
    funcs.rtecall("trigger", rc, 0);

    // update all operator's password.date
    var operators = $("operator").selectAll().iterate(function(operator) {
        if (!operator.never_expire_pass) {
            operator.password_date = new Date();
            operator.doUpdate();
        }
    });

    funcs.rtecall("trigger", rc, 1);
}

// get operator's data format
var formats = ['mm/dd/yy', 'dd/mm/yy', 'yy/mm/dd', 'mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy/mm/dd'];

function getDateFormat(dateOrder) {
    if (dateOrder != null) {
        return formats[dateOrder - 1];
    } else {
        return "yyyy-mm-dd";
    }
}


function getCapabilityWordsByOperator(ope) {
    var capExec = [];
    if (!ope) {
        return capExec;
    }
    var operator = new SCFile("operator", SCFILE_READONLY);
    operator.setFields(['cap.exec']);

    var rc = operator.doSelect('name="' + ope + '"');
    if (rc == RC_SUCCESS) {
        capExec = lib.ArrayUtil.toJsArray(operator.cap_exec);
    }
    return capExec;
}

/**
 * return Display Name of an operator
 */
function displayName(name) {
    if (!name) {
        return name;
    }

    var item = $('!operator').setFields(['full.name']).find('name=:name', name).one();
    if (item && item['full.name']) {
        return item['full.name'] + ' (' + name + ')';
    }

    return name;
}

/**
 * return Full Name of an operator
 */
function getFullName(name) {
    if (!name) {
        return name;
    }

    var operator = getOperatorByName(name, ['full.name']);
    if (operator && operator['full.name']) {
        return operator['full.name'];
    }

    return name;
}


function checkPasswordHist(userName, password) {
    var info = vars.$G_system_info;

    if (!info['keep.history']) {
        return true;
    }

    var user = $('!operator').fields('pwd.history', 'password').find('name=:name', userName).one();
    if (user == null) {
        return false;
    }

    var size = funcs.denull(user['pwd.history']).length();
    if (info['pwd.history.type'] == 'limited.hist') {
        size = Math.min(size, info['pwd.hist.limit']);
    }

    var currentPWD = user['password'];
    if (currentPWD && funcs.password_match(password, currentPWD)) {
        return false;
    }

    var k;
    for (k = 0; k < size; k++) {
        var oldPassword = user['pwd.history'][k]['old.passwords'];
        if (oldPassword && funcs.password_match(password, oldPassword)) {
            return false;
        }
    }

    return true;
}

function checkPasswordForServer(userName, password) {
    vars.$msg_password_check = null;

    if (null == vars.$G_system_info) {
        vars.$G_system_info = getCompany();
    }

    if (!checkPasswordHist(userName, password)) {
        return JSON.stringify({
            code: 'fail',
            msg: funcs.scmsg('16', 'trigger')
        });
    }

    var ret;

    var success = checkPassword(password);
    if (!success) {
        ret = {
            code: 'fail',
            msg: vars.$msg_password_check
        };
        return JSON.stringify(ret);
    }

    success = saveHist(userName, password);
    ret = {
        code: success ? 'success' : 'fail',
        msg: 'save password history failed'
    };
    return JSON.stringify(ret);
}

function saveHist(userName, password) {
    var info = vars.$G_system_info;
    var fOp = new SCFile("operator");
    var rc = fOp.doSelect("name=\"" + userName + "\"");

    if (rc == RC_SUCCESS) {
        var size = funcs.denull(fOp['pwd.history']).length();
        if (info['keep_history'] || (size > 0 && !info['keep_history'])) {
            if (info['keep_history']) {
                var curPos = Math.min(size, info['pwd_hist_limit'] - 1);
                if (info['pwd.history.type'] == 'limited.hist' && (size > (info['pwd_hist_limit'] - 1))) {
                    var i;
                    for (i = 0; i <= size - 1; i++) {
                        if (i < (info['pwd_hist_limit'] - 1)) {
                            fOp['pwd.history'][i] = fOp['pwd.history'][(size - info['pwd_hist_limit'] + i + 1)];
                        } else {
                            fOp['pwd.history'][i] = null;
                        }
                    }
                } else {
                    curPos = size;
                }

                fOp['pwd.history'] = funcs.denull(fOp['pwd.history']);
                if (curPos >= 0) {
                    fOp['pwd.history'][curPos]['old.passwords'] = fOp['password'];
                    fOp['pwd.history'][curPos]['pwd.change.date'] = system.functions.tod();
                    fOp['pwd.history'][curPos]['pwd.changed.by'] = userName;
                }
            } else if (size > 0 && !info['keep_history']) {
                for (i = 0; i <= size - 1; i++) {
                    fOp['pwd.history'][i] = null;
                }
                fOp['pwd.history'] = funcs.denull(fOp['pwd.history']);
            }

            funcs.rtecall("trigger", 1, 0);
            var rc1 = fOp.doUpdate();
            funcs.rtecall("trigger", 1, 1);
            return rc1 == RC_SUCCESS;
        }
        return true;
    }

    return false;
}

/**
 *  Check if the operator is revoked
 *  Paramet: name - operator login name
 *  Only when the operator exists and its login revoked is true, return true
 *  Otherwise return false (Especially When the name is null or the operator doesn't exist, return false)
 */
function isRevoked(name) {
    if (!name) {
        return false;
    }

    var operator = $("!operator").fields(["login.revoked"]).find("name=:name", name).one();
    if (operator) {
        return operator["login.revoked"] || false;
    }

    return false;
}

/**
 *  Return the language id(unique.id) of the operator
 *    1. The language of the operator
 *    2. The language of system information $G.system.info
 *    3. English id: en
 */
function getOperatorLanguage(name) {
    if (!name) {
        return "en";
    }

    var contact = $("!contacts").fields(["language"]).find("operator.id=:name", name).one();
    if (contact && contact["language"]) {
        return contact["language"];
    }

    var operator = $("!operator").fields(["syslanguage"]).find("name=:name", name).one();
    if (operator && operator["syslanguage"]) {
        return operator["syslanguage"];
    } else if (vars["$G.system.info"] && vars["$G.system.info"]["syslanguage"]) {
        return vars["$G.system.info"]["syslanguage"];
    }

    return "en";
}


/**
 * Synchronize operator skills
 *
 * @param {SCFile} operator
 * @param {SCFile} oldOperator
 */
function synchronizeSkills(operator, oldOperator) {
    if (!operator) {
        return;
    }

    var skills = _.uniq(operator.skill.toArray());
    if (skills.length == 0) {
        return;
    }

    var oldSkills = oldOperator ? oldOperator.skill.toArray() : [];

    // update skill taghint
    skills.forEach(function(skill) {
        if (skill && oldSkills.indexOf(skill) == -1) {
            lib.TagUtil.updateHashtag("operator", skill);
        }
    });
}


/**
 * get operator difference of group
 *
 * @param {SCFile} groupOld
 * @param {SCFile} groupNew
 * @returns {Array}
 */
function getGroupOperatorDifference(groupOld, groupNew) {
    var membersOld = groupOld.operators.toArray();
    var membersNew = groupNew.operators.toArray();
    var approversOld = groupOld.approvers.toArray();
    var approversNew = groupNew.approvers.toArray();

    // members added/removed
    var memberAdded = _.difference(membersNew, membersOld);
    var memberRemoved = _.difference(membersOld, membersNew);
    // approvers added/removed
    var approverAdded = _.difference(approversNew, approversOld);
    var approverRemoved = _.difference(approversOld, approversNew);

    return [memberAdded, memberRemoved, approverAdded, approverRemoved];
}


/**
 * get group difference of operator
 *
 * @param {SCFile} operatorOld
 * @param {SCFile} operatorNew
 * @returns {Array}
 */
function getOperatorGroupDifference(operatorOld, operatorNew) {
    var groupsOld = operatorOld.assignment_groups.toArray();
    var groupsNew = operatorNew.assignment_groups.toArray();

    // groups added/removed    
    var added = _.difference(groupsNew, groupsOld);
    var removed = _.difference(groupsOld, groupsNew);

    return [added, removed];
}