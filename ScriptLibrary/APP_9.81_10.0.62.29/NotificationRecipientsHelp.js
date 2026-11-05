var $ = lib.c.$;
var _ = lib.Underscore.require();
var log = getLog("NotificationRecipientsHelp");
//log.setLevel("debug");

var sys_lang = getSysLang();

// user languages, key:user, value: language
var userLanguageMap = {};


function getChangeManagerBySecRole(id) {
    var role = "change manager";
    var opr = new SCFile("operator", SCFILE_READONLY);
    opr.setFields(["name"]);
    var sql = "secRole=\"" + role + "\"";
    var list = "{";
    if (opr.doSelect(sql) == RC_SUCCESS) {
        do {
            list = list + "\"" + opr.name + "\",";

        } while (opr.getNext() == RC_SUCCESS);
    }

    list = list + "\" " + "\"}";
    return list;
}
//The getChangeOwnerBySecRole() function.
//Cybele added @Sep.21th 2011. For Change Task need notification sent to Change Owner.

function getRelatedChangeOwnerByChangeID(id) {
    var chm = new SCFile("cm3r", SCFILE_READONLY);
    chm.setFields(["change.owner"]);
    var sqlchm = "number=\"" + id + "\"";

    var list = "{";
    if (chm.doSelect(sqlchm) == RC_SUCCESS) {
        do {
            list = list + "\"" + chm.change_owner + "\",";

        } while (chm.getNext() == RC_SUCCESS);
    }

    list = list + "\" " + "\"}";
    return list;
}

function getRelatedTaskAssigneeByChangeID(id) {
    var tsk = new SCFile("cm3t", SCFILE_READONLY);
    tsk.setFields(["assigned.to"]);
    var sqltsk = "parent.change=\"" + id + "\"";

    var list = "{";
    if (tsk.doSelect(sqltsk) == RC_SUCCESS) {
        do {
            list = list + "\"" + tsk.assigned_to + "\",";

        } while (tsk.getNext() == RC_SUCCESS);

    }
    list = list + "\" " + "\"}";
    return list;
}

function getDcabApprovers(id) {
    var groupfile = new SCFile("ApprovalDef", SCFILE_READONLY);
    groupfile.setFields(["group.name"]);
    var sql = "";
    var memberlist = "";
    var group = "DCAB Approval";
    sql = "name=\"" + group + "\"";
    if (groupfile.doSelect(sql) == RC_SUCCESS) {
        memberlist = "" + groupfile.group_name;
        memberlist = memberlist.substr(memberlist.indexOf("{"));
    }
    if (memberlist == "") {
        memberlist = [];
    }

    return memberlist;
}

function getEcabApprovers(id) {
    var groupfile = new SCFile("ApprovalDef", SCFILE_READONLY);
    groupfile.setFields(["group.name"]);
    var sql = "";
    var memberlist = "";
    var group = "ECAB Approval";
    sql = "name=\"" + group + "\"";
    if (groupfile.doSelect(sql) == RC_SUCCESS) {
        memberlist = "" + groupfile.group_name;
        memberlist = memberlist.substr(memberlist.indexOf("{"));
    }
    if (memberlist == "") {
        memberlist = [];
    }

    return memberlist;
}

function getTcabApprovers(id) {
    var groupfile = new SCFile("ApprovalDef", SCFILE_READONLY);
    groupfile.setFields(["group.name"]);
    var sql = "";
    var memberlist = "";
    var group = "TCAB Approval";
    sql = "name=\"" + group + "\"";
    if (groupfile.doSelect(sql) == RC_SUCCESS) {
        memberlist = "" + groupfile.group_name;
        memberlist = memberlist.substr(memberlist.indexOf("{"));
    }
    if (memberlist == "") {
        memberlist = [];
    }

    return memberlist;
}


// fix QCCR1E131463

function getSysLang() {
    var sysInfo = new SCFile("info", SCFILE_READONLY);
    sysInfo.setFields(["syslanguage"]);
    var sql = "type=\"company\"";

    if (sysInfo.doSelect(sql) == RC_SUCCESS) {
        if (sysInfo.syslanguage != null) {
            return sysInfo.syslanguage;
        }
    }

    return "en";
}


function determinLang(users) {

    var lang = "";
    var temp = "";

    var userList = getUserList(users);

    //parse language
    var i;
    var leng = userList.length;
    for (i = 0; i < leng; i++) {
        if (userList[i] == "") {
            continue;
        } else {
            temp = getLang(userList[i]);
        }

        if (temp == null || temp.length == 0) {
            continue;
        }

        if (lang == "") {
            lang = temp;
            continue;
        }

        if (lang != temp) {
            return sys_lang;
        }
    }

    if (lang == "") {
        lang = sys_lang;
    }
    vars.$L_mailLang = lang;
    return lang;
}

function getUserList(users) {
    var userList = [];
    //generate user list
    if (users != null) {
        if (funcs.type(users) == 2) {
            return [users];
        } else if (users instanceof Array) {
            userList = _.uniq(users);
        } else {
            userList = users.toArray();
            userList = _.uniq(userList);
        }
    }
    return userList;
}


/**
 * get user list from notification
 *
 * @param {SCFile} notification
 * @param {Number} line
 * @param {Object} users, Array or SCDatum Array
 * @param {String} recipientType, null means to; cc or bcc
 * @returns {Object} Array or String
 */
function getUserListFromNotification(notification, line, users, recipientType) {
    const logMsgStep = "getUserListFromNotification";

    if (log.isDebugEnabled()) {
        log.debug(`${logMsgStep}`, `notification "${notification.name}", line ${line}, users: ${users}, recipientType: $(recipientType)`);
    }

    if (!users) {
        return [];
    }
    
    var suffix = "";
    if (recipientType) {
        suffix = "." + recipientType;
    }

    // evaluate recipient field
    var message = notification.message[line - 1];
    var str_recipients = funcs.nullsub(funcs.str(message["recipient" + suffix]), "");

    if (log.isDebugEnabled()) {
        log.debug(`${logMsgStep}`, `recipients is "${str_recipients}"`);
    }

    // generate user sql and user list
    var isUserCharacter = (funcs.type(users) == lib.DataTypeConst.typeCharacter());
    var userSql = isUserCharacter ? `name isin {"${users}"}` : "name isin " + funcs.str(users);
    var userList = isUserCharacter ? users : _.uniq(users.toArray());

    // determine whether it`s a group or not
    if (!funcs._null(message["group.file" + suffix])) {
        var groupFile = message["group.file" + suffix];
        var groupArea = message["group.area" + suffix];
        var subGroup = message["subgroup" + suffix];
        var groupUsers = [];
        var emptyArray = $.createSCArray();
        var groupUsersArray = [];

        if (log.isDebugEnabled()) {
            log.debug(`${logMsgStep}`, `group file is "${groupFile}"`);
        }
        var isOtherGroup = ("cm3groups, ocmgroups".indexOf(groupFile) != -1);
        if (isOtherGroup && ("c, t, q, o, l".indexOf(groupArea) != -1)) {
            userSql += ` and area="${groupArea}"`;
        }

        //extract operators
        var groupRecord = new SCFile(groupFile, SCFILE_READONLY);
        if (groupRecord.doSelect(userSql) == RC_SUCCESS) {
            do {
                if (groupFile == "assignment") {
                    groupUsersArray = lib.MailUtil.getAssignmentGroupEmail(groupRecord, subGroup);
                    if (groupUsersArray) {
                        groupUsers = groupUsers.concat(lib.ArrayUtil.toJsArray(groupUsersArray));
                    }
                }
                // change group or request group
                else if (isOtherGroup) {
                    if (subGroup == "approvers") {
                        groupUsersArray = funcs.nullsub(funcs.denull(groupRecord.approvers), emptyArray).toArray();
                        groupUsers = groupUsers.concat(groupUsersArray);
                    }

                    if (subGroup == "members") {
                        groupUsersArray = funcs.nullsub(funcs.denull(groupRecord.members), emptyArray).toArray();
                        groupUsers = groupUsers.concat(groupUsersArray);
                    }

                    if (funcs.nullsub(subGroup, "all") == "all") {
                        groupUsersArray = funcs.nullsub(funcs.denull(groupRecord.approvers), emptyArray).toArray();
                        groupUsers = groupUsers.concat(groupUsersArray);
                        groupUsersArray = funcs.nullsub(funcs.denull(groupRecord.members), emptyArray).toArray();
                        groupUsers = groupUsers.concat(groupUsersArray);
                    }
                }
            } while (groupRecord.getNext() == RC_SUCCESS);

            // set user list, remove redundant user name
            userList = _.uniq(groupUsers);
        }
    }

    if (log.isDebugEnabled()) {
        log.debug(`${logMsgStep}`, `user list is "${userList}"`);
    }

    return userList;
}

/**
 * get user list array by merging users of to, cc and bcc
 *
 * @param {Array/String} tousers
 * @param {Array/String} ccusers
 * @param {Array/String} bccusers
 * @param {String} delimiter
 * @returns {Array} merged users, cc/bcc users are added its prefix cc:/bcc:
 */
function mergeRecipientUsers(tousers, ccusers, bccusers, delimiter) {
    if (!tousers) {
        return [];
    }
    delimiter = delimiter || ";"
    var users = [];
    if (_.isString(tousers)) {
        users = tousers.split(delimiter);
    } else {
        users = lib.ArrayUtil.toJsArray(tousers);
    }
    
    var recipientList = lib.ArrayUtil.merge([], users);
    
    var lng;
    var i;
    
    if (ccusers) {
        if (_.isString(ccusers)) {
            users = ccusers.split(delimiter);
        } else {
            users = lib.ArrayUtil.toJsArray(ccusers);
        }
        
        lng = users.length;
        for (i=0; i<lng; i++) {
            recipientList.push("cc:" + users[i]);
        }
    }
    if (bccusers) {
        if (_.isString(bccusers)) {
            users = bccusers.split(delimiter);
        } else {
            users = lib.ArrayUtil.toJsArray(bccusers);
        }

        lng = users.length;
        for (i=0; i<lng; i++) {
            recipientList.push("bcc:" + users[i]);
        }
    }
    
    return recipientList;
}

/**
 * expand the merged users to one array including 3 arrays for to, cc and bcc users
 *
 * @param {Array} users - include to, cc and bcc users, cc/bcc users have prefix cc:/bcc:
 * @returns {array(array, array, array)} expanded users, cc/bcc users and their prefix cc:/bcc: are trimmed
 *           [[tousers], [ccusers], [bccusers]]
 */
function expandRecipientUsers(users) {
    if (users && _.isString(users)) {
        users = [users];
    }
    var recipients = [[], [], []];
    var userList = lib.ArrayUtil.toJsArray(users);
    if (userList && userList.length > 0) {
        var lng = userList.length;
        var i;
        for (i=0; i<lng; i++) {
            var userParts = userList[i].split(":");
            if (userParts) {
                if (userParts.length == 1) {
                    recipients[0].push(userParts[0]);
                } else if (userParts.length == 2) {
                    if (userParts[0] == "cc") {
                        recipients[1].push(userParts[1]);
                    } else if (userParts[0] == "bcc") {
                        recipients[2].push(userParts[1]);
                    }
                }
            }
        }
    }
    
    return recipients;
}


function getLang(user) {

    // query cache map first
    var userKey = "user:" + user;
    if (_.has(userLanguageMap, userKey)) {
        return userLanguageMap[userKey];
    }

    var userLang = sys_lang;

    var operator_sql = "name=\"" + user + "\" or email=\"" + user + "\" or contact.name=\"" + user + "\"";
    var contact_sql = "contact.name=\"" + user + "\" or email=\"" + user + "\" or operator.id=\"" + user + "\"";

    var contact = new SCFile("contacts", SCFILE_READONLY);
    var operator = new SCFile("operator", SCFILE_READONLY);
    contact.setFields(["language"]);
    operator.setFields(["syslanguage"]);

    if (contact.doSelect(contact_sql) == RC_SUCCESS) {
        if (!funcs._null(contact.language)) {
            userLang = contact.language;
        } else if (operator.doSelect(operator_sql) == RC_SUCCESS) {
            if (!funcs._null(operator.syslanguage)) {
                userLang = operator.syslanguage;
            }
        }
        userLanguageMap[userKey] = userLang;
    } else if (operator.doSelect(operator_sql) == RC_SUCCESS) {
        if (!funcs._null(operator.syslanguage)) {
            userLang = operator.syslanguage;
        }
        userLanguageMap[userKey] = userLang;
    }

    return userLang;
}

// if RC_SUCCESS, return object;else return format's name
function determinFormat(lan, format) {
    if (format == null) {
        return null;
    }

    var form = new SCFile("format");
    if (lan != null) {
        var formResult = form.doSelect("syslanguage=\"" + lan + "\" and name=\"" + format + "\"");
        if (formResult == RC_SUCCESS) {
            return form;
        }
    }
    return format;
}

//if doSelect fails, return scmsg
function determinMsg(lan, clas, id, args) {
    if (!args) {
        args = [];
    }

    if (!lan && !vars.$L_mailLang) {
        return funcs.scmsg(id, clas, args);
    } else if (!lan) {
        lan = vars.$L_mailLang;
    }

    var msgReturn = "";
    var scmsg = new SCFile("scmessage", SCFILE_READONLY);
    var msgResult = scmsg.doSelect("syslanguage=\"" + lan + "\" and class =\"" + clas + "\" and message.id=\"" + id + "\"");
    if (msgResult == RC_SUCCESS) {
        msgReturn = scmsg.message;
        if (args != null) {
            if (typeof args == 'string') {

                msgReturn = msgReturn.replace("%S", args);

            } else {
                var i;
                var len = funcs.lng(args);
                for (i = 0; i < len; i++) {
                    msgReturn = msgReturn.replace("%S", args[i]);
                }
            }

        }

    } else {
        msgReturn = funcs.scmsg(id, clas, args);
    }
    return msgReturn;
}

function getEmailAttachmentQueryTag() {
    return "AttachmentQuery";
}

function getEmailAttachmentQuerySeperator() {
    return "<@@@" + getEmailAttachmentQueryTag() + "@@@>";
}

function appendEmailAttachmentQuery(condition, filter, filename, key) {
    if (condition == null || lib.Utilities.trim("" + condition).length == 0) {
        return "";
    }

    if (filter == null || lib.Utilities.trim(filter).length == 0) {
        return "";
    }

    if (funcs.evaluate(condition)) {
        return getEmailAttachmentQuerySeperator() + "application=\"" + filename + "\" and topic=\"" + key + "\" and " + filter;
    }

    return "";
}

function parseEmailAttachmentQuery(text) {
    if (text == null || lib.Utilities.trim(text).length == 0) {
        return [text, null];
    }

    var result = text.split(getEmailAttachmentQuerySeperator());

    return result;
}


/**
 * append email inline attachment query
 *
 * @param {SCFile} record
 * @param {String} emailMessage
 * @returns {String} append query, empty string if no inline attachment found
 */
function appendEmailInlineAttachmentQuery(record, emailMessage) {
    if (!record || !emailMessage) {
        return "";
    }

    emailMessage = emailMessage.toArray();
    if (emailMessage.length == 0) {
        return "";
    }
    emailMessage = emailMessage.join("\n");

    var fileName = funcs.filename(record);
    var key = record.getUniqueFields()[0];
    var fileId = record[key];

    /* 
     * search all the matched uids, there are 2 types:
     *
     * 1. linked attachment: <a href="scattach://uid:attachnemtname:filename:fileid">
     * 2. embeded image: <img src="scattach://uid:attachnemtname:filename:fileid"/>
     */
    var regStr = `<a\\s+href\\s*=\\s*"scattach:\/\/([^":]+):[^":]+:${fileName}:${fileId}"\s*>`;
    var uids = matchAttachmentUids(emailMessage, regStr);

    regStr = `<img\\s+[^<>]+src\\s*=\\s*"scattach:\/\/([^":]+):[^":]+:${fileName}:${fileId}"[^<>]*\/>`;
    uids = uids.concat(matchAttachmentUids(emailMessage, regStr));

    if (uids.length == 0) {
        return "";
    }

    var filter = 'uid isin {';
    var i;
    for (i = 0; i < uids.length; i++) {
        filter += `"${uids[i]}"`;
        if (i < uids.length - 1) {
            filter += ",";
        }
    }
    filter += "}";

    var attachmentQuery = appendEmailAttachmentQuery(true, filter, fileName, fileId);
    return attachmentQuery;
}

/**
 * find matched attachment uids
 *
 * @param {String} message
 * @param (String} regStr
 * @returns {Array}
 */
function matchAttachmentUids(message, regStr) {
    var regExp = new RegExp(regStr, 'ig');
    var founds = message.match(regExp);
    if (!founds || founds.length == 0) {
        return [];
    }

    var uids = [];

    regExp = new RegExp(regStr, 'i');
    founds.forEach(function(str) {
        var found = str.match(regExp);
        uids.push(found[1]);
    });

    return uids;
}