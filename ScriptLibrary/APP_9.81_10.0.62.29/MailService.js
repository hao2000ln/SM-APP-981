var mailUtil = lib.MailUtil;
var _localscmsg = lib.NotificationRecipientsHelp.determinMsg;

/**
 * convert the build-in action string to html
 * format of the build-in function: email_action(action_name, action_display_name, record_id, record_title)
 * @param  {String} mail_body
 * @param  {File} record
 * @param  {String} recipient
 * @param  {Boolean} include_token
 * @return {String} mail body
 */
function convertActionString2HTML(mail_body, record, recipient, include_token) {
    var action_regx = /email_action\(.*?\)/gi;
    var action_strings = mail_body.match(action_regx);

    if (action_strings) {
        // convert action string to html
        var reply_to = mailUtil.calcReplyTo(recipient);
        var i;
        var timestamp = Date.now();
        for (i = 0; i < action_strings.length; i++) {
            // parse action parameters
            var parameters = action_strings[i].match(/\((.*?)\)/)[1].split(",");

            if (parameters.length >= 4) {
                var action_name = parameters[0];
                var action_display_name = parameters[1];
                // subject
                var reply_subject = _genReplySubject(record, parameters);
                // body
                if (include_token) {
                    // generate the token string
                    var token_str = mailUtil.genToken(recipient, record, action_name, timestamp);
                }
                var reply_body = _genReplyBody(action_name, token_str);

                var style = "color:#ffffff;font-weight:bold;text-decoration:none;";
                if (parameters.length >= 5) {
                    style = parameters[4];
                }
                var mailto_content = "?subject=" + reply_subject + "&body=" + reply_body;
                mail_body = mail_body.replace(action_strings[i], '<a style=' + '"' + style + '"' + ' href="mailto:' + reply_to + mailto_content + '">' + action_display_name + '</a>');
            }
        }
    }

    return mail_body;
}


/**
 * generate mail subject per the mail action
 * @param  {File} record
 * @param  {Array} action_parameters parameters of email action
 * @return {String} mail subject
 */
function _genReplySubject(record, action_parameters) {
    var action_display_name = action_parameters[1];
    var entity_id = action_parameters[2];
    var entity_title = action_parameters[3];

    return action_display_name + " - " + mailUtil.getFileCaption(record) + " " + entity_id + ": " + entity_title;
}

/**
 * generate mail body per the mail action
 * @param  {String} action_name
 * @param  {String} token
 * @return {String} mail body
 */
function _genReplyBody(action_name, token) {
    var lang = lib.NotificationRecipientsHelp.getSysLang();
    if (vars.$L_mailLang != undefined && vars.$L_mailLang) {
        lang = vars.$L_mailLang;
    }
    var default_action_body = {
        "approve": _localscmsg(lang, "SmartEmail", "approve_default_body"),
        "deny": _localscmsg(lang, "SmartEmail", "deny_default_body"),
        "accept": _localscmsg(lang, "SmartEmail", "accept_default_body"),
        "reject": _localscmsg(lang, "SmartEmail", "reject_default_body"),
        "comment": _localscmsg(lang, "SmartEmail", "comment_default_body"),
        "resolve": _localscmsg(lang, "SmartEmail", "resolve_default_body"),
        "close": _localscmsg(lang, "SmartEmail", "close_default_body")
    };

    var mail_body = "";
    if (default_action_body[action_name]) {
        mail_body += default_action_body[action_name];
    }
    mail_body += "\n\n";
    if (token) {
        mail_body += _localscmsg(lang, "SmartEmail", "token_desc");
        mail_body += "\n";
        mail_body += token;
    }

    return encodeURIComponent(mail_body);
}


/**
 * validate time interval value
 * @param  {String} interval
 * @return {Boolean}
 */
function validateTimeInterval(interval) {
    if (interval.indexOf(" ") > -1) {
        if (/^\d{1,4}\s\d{2}:\d{2}:\d{2}$/.test(interval)) {
            interval = interval.split(" ")[1];
        } else {
            return false;
        }
    } else {
        if (!/^\d{2}:\d{2}:\d{2}$/.test(interval)) {
            return false;
        }
    }

    interval = interval.split(":");
    if (interval[0] > 23 || interval[1] > 59 || interval[2] > 59) {
        return false;
    }
    return true;
}

function validatePastTime(dt) {
    var format = /^(\d{4})-(0[1-9]|1[1-2])-(0[1-9]|[1-2][0-9]|3[0-1])(\s+)(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    var format_date = /^(\d{4})-(0[1-9]|1[1-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    var errorMsg = "";
    if (dt) {
        var matches = dt.match(format);

        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var hour = 0;
        var min = 0;
        var sec = 0;

        var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var date = new Date();
        var currentDay = today.getDate();
        if (currentDay < 10) {
            currentDay = "0" + currentDay;
        }
        var monthIndex = today.getMonth();
        var year = today.getFullYear();
        var currentDate = year + "-" + monthNames[monthIndex] + "-" + currentDay + " " + "00:00:00";
        errorMsg = funcs.scmsg("SmartEmail;purgeEmailListTime", "local:settingsConfig") + '\n' + funcs.scmsg("purge_emailstore_before", "SmartEmail") + ' ' + currentDate;

        if (!matches) {
            matches = dt.match(format_date);
            if (!matches) {
                return errorMsg;
            }
        } else {
            hour = matches[5];
            min = matches[6];
            sec = matches[7];
        }

        year = matches[1];
        var month = matches[2] - 1;
        var day = matches[3];
        var purgetime = new Date(year, month, day, hour, min, sec, 0);

        if (purgetime.getTime() >= today.getTime()) {
            return errorMsg;
        }
    }
    return "";
}