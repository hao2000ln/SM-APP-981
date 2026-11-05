var $ = lib.c.$;
var _ = lib.Underscore.require();
var log = getLog("MicrosoftTeamsTemplate");
//log.setLevel("debug");

var getDisplayValue = lib.globalListTools.getDisplayValue;

// labels
const LABEL_PRIORITY = funcs.scmsg("caption;priority", "msteams");
const LABEL_STATUS = funcs.scmsg("caption;status", "msteams");
const LABEL_PHASE = funcs.scmsg("caption;phase", "msteams");
const LABEL_CATEGORY = funcs.scmsg("caption;category", "msteams");

const TITLE_CREATIONTIME = funcs.scmsg("18", "msteams");


/**
 * generate messages according to the record
 * the message object is in Adaptive Card format
 *
 * @param {SCFile} record
 * @param {String} mode, default, ess or smsp
 * @returns {Object}
 */
function generateMessage(record, mode) {
    var filename = funcs.filename(record);
    switch (filename) {
        case "probsummary":
            return incidentMessage(record, mode);
        case "incidents":
            return interactionMessage(record, mode);
        case "rootcause":
            return problemMessage(record, mode);
        case "cm3r":
            return changeMessage(record, mode);
        case "request":
            return requestMessage(record, mode);
        default:
            return defaultMessage(record, mode);
    }
}


function incidentMessage(record, mode) {
    var title = record.number + ": " + record.brief_description;
    var subtitle = TITLE_CREATIONTIME + " " + funcs.str(record.open_time);
    var text = multiLineText(record.action);

    var facts = [
        [LABEL_PRIORITY, getDisplayValue(record.priority_code, vars.$G_calc_priority, vars.$G_calc_priority_disp)],
        [LABEL_STATUS, getDisplayValue(record.problem_status, vars.$G_imStatuses, vars.$G_imStatuses_local)],
        [LABEL_PHASE, getDisplayValue(record.current_phase, vars.$G_imWfPhases, vars.$G_imWfPhases_local)],
        [LABEL_CATEGORY, getDisplayValue(record.category, vars.$G_imCategories, vars.$G_imCategories_local)]
    ];

    return adaptiveCard(record, mode, title, subtitle, text, facts);
}


function interactionMessage(record, mode) {
    var title = record.incident_id + ": " + record.title;
    var subtitle = TITLE_CREATIONTIME + " " + funcs.str(record.open_time);
    var text = multiLineText(record.description);

    var facts = [
        [LABEL_PRIORITY, getDisplayValue(record.priority_code, vars.$G_calc_priority, vars.$G_calc_priority_disp)],
        [LABEL_STATUS, getDisplayValue(record.open, vars.$G_sdStatuses, vars.$G_sdStatuses_local)],
        [LABEL_PHASE, getDisplayValue(record.current_phase, vars.$G_sdWfPhases, vars.$G_sdWfPhases_local)],
        [LABEL_CATEGORY, getDisplayValue(record.category, vars.$G_sdCategories, vars.$G_sdCategories_local)]
    ];

    return adaptiveCard(record, mode, title, subtitle, text, facts);
}


function problemMessage(record, mode) {
    var title = record.id + ": " + record.brief_description;
    var subtitle = TITLE_CREATIONTIME + " " + funcs.str(record.open_time);
    var text = multiLineText(record.description);

    var facts = [
        [LABEL_PRIORITY, getDisplayValue(record.priority_code, vars.$G_calc_priority, vars.$G_calc_priority_disp)],
        [LABEL_STATUS, getDisplayValue(record.rcStatus, vars.$G_pbmStatuses, vars.$G_pbmStatuses_local)],
        [LABEL_PHASE, getDisplayValue(record.current_phase, vars.$G_pbmWfPhases, vars.$G_pbmWfPhases_local)],
        [LABEL_CATEGORY, getDisplayValue(record.category, vars.$G_pbmCategories, vars.$G_pbmCategories_local)]
    ];

    return adaptiveCard(record, mode, title, subtitle, text, facts);
}


function changeMessage(record, mode) {
    var title = record.number + ": " + record.brief_description;
    var subtitle = TITLE_CREATIONTIME + " " + funcs.str(record.orig_date_entered);
    var text = multiLineText(record.description);

    var facts = [
        [LABEL_PRIORITY, getDisplayValue(record.priority_code, vars.$G_calc_priority, vars.$G_calc_priority_disp)],
        [LABEL_PHASE, getDisplayValue(record.current_phase, vars.$G_chmWfPhases, vars.$G_chmWfPhases_local)],
        [LABEL_CATEGORY, getDisplayValue(record.category, vars.$G_cm3r_category, vars.$G_cm3r_category_local)]
    ];

    return adaptiveCard(record, mode, title, subtitle, text, facts);
}


function requestMessage(record, mode) {
    var title = record.number + ": " + record.brief_description;
    var subtitle = TITLE_CREATIONTIME + " " + funcs.str(record.submit_date);
    var text = multiLineText(record.description);

    var facts = [
        [LABEL_PRIORITY, getDisplayValue(record.priority, vars.$G_calc_priority, vars.$G_calc_priority_disp)],
        [LABEL_STATUS, getDisplayValue(record.status, vars.$G_rmStatuses, vars.$G_rmStatuses_local)],
        [LABEL_PHASE, getDisplayValue(record.current_phase, vars.$G_rmWfPhases, vars.$G_rmWfPhases_local)],
        [LABEL_CATEGORY, getDisplayValue(record.category, vars.$G_rmCategories, vars.$G_rmCategories_local)]
    ];

    return adaptiveCard(record, mode, title, subtitle, text, facts);
}


/**
 * convert text array to string
 */
function multiLineText(textArray) {
    return textArray ? textArray.toArray().join("\n\n") : "";
}


function defaultMessage(record, mode) {
    var card = generateMessageCardFromTemplate("DEFAULT", record, mode);
    if (card) {
        return card;
    }

    var key = record.getUniqueFields()[0];

    var title = record[key];
    var subtitle = "";
    var text = "";

    return adaptiveCard(record, mode, title, subtitle, text);
}


/**
 * return adaptive card JSON object
 */
function adaptiveCard(record, mode, title, subtitle, text, facts, lang) {
    var filename = funcs.filename(record);
    var key = record.getUniqueFields()[0];
    var fileid = record[key];
    var query = key + '="' + lib.StringUtil.escapeAllStr(fileid) + '"';

    var url;
    if (mode == "ess") {
        url = lib.urlCreator.getESSURLFromQuery(filename, query, title);
    } else if (mode == "smsp") {
        url = lib.urlCreator.getSMSPURL(filename, fileid);
    } else {
        url = lib.urlCreator.getURLFromQuery(filename, query, title);
    }

    return lib.MicrosoftTeamsCard.adaptiveCard(title, subtitle, text, facts, url, lang);
}


/**
 * generate message from message template
 *
 * @param {String} template
 * @param {SCFile} record
 * @param {String} mode
 * @param {String} lang
 * @returns {String}
 */
function generateMessageFromTemplate(template, record, mode, lang) {

    if (!template) {
        return "";
    }

    var card = generateMessageCardFromTemplate(template, record, mode, lang);
    if (!card) {
        return "";
    }

    return JSON.stringify(card);
}


/**
 * generate message card from message template
 *
 * @param {String} template
 * @param {SCFile} record
 * @param {String} mode
 * @param {String} lang
 * @returns {Object}
 */
function generateMessageCardFromTemplate(template, record, mode, lang) {

    // template support multiple languages
    if (!lang) {
        lang = determinLang();
    }

    var langs = [];
    if (lang) {
        langs.push(lang);
    }
    var syslang = lib.NotificationRecipientsHelp.getSysLang();
    if (syslang && lang != syslang) {
        langs.push(syslang);
    }
    if (lang != "en" && syslang != "en") {
        langs.push("en");
    }

    var fTemplate;
    var i;
    for (i = 0; i < langs.length; i++) {
        fTemplate = $("msMessageTemplate", SCFILE_READONLY).find("name=:name and language=:lang", template, langs[i]).one();
        if (fTemplate) {
            break;
        }
    }

    if (!fTemplate) {
        log.error(`Template "${template}" not found!`);
        return null;
    }

    var data = {
        "$RECORD": record
    };

    var title = parseTemplateMore(template, fTemplate.title, data);
    var subtitle = parseTemplateMore(template, fTemplate.subtitle, data);

    var content = multiLineText(fTemplate.content);
    content = parseTemplateMore(template, content, data);

    return adaptiveCard(record, mode, title, subtitle, content, null, lang);
}


/**
 * deternin language for the template
 *
 * @returns {String}
 */
function determinLang() {

    var syslang = lib.NotificationRecipientsHelp.getSysLang();
    var lang;

    // determine if it is called from notification engine
    if (vars.$L_notification) {
        // users is defined in process.msg panel of us.nofity rad
        var userList = lib.NotificationRecipientsHelp.getUserListFromNotification(vars.$L_notification, vars.$L_i, vars.$L_users);

        if (log.isDebugEnabled()) {
            log.debug("determinLanguage", `userList: ${userList}`);
        }

        var getLang = lib.NotificationRecipientsHelp.getLang;

        // parse language
        if (typeof userList == "string") {
            lang = getLang(userList);
        }
        // multiple users
        else {
            userList = _.uniq(userList);

            var i;
            for (i = 0; i < userList.length; i++) {
                var temp = getLang(userList[i]);
                if (!temp) {
                    continue;
                }

                if (!lang) {
                    lang = temp;
                }
                // multiple languages found, use system language instead
                else if (lang != temp) {
                    lang = syslang;
                    break;
                }
            }
        }
    } else {
        lang = syslang;
    }

    if (log.isDebugEnabled()) {
        log.debug("determinLanguage", `language is ${lang}`);
    }

    return lang;
}


/**
 * parse message template multiple times
 *
 * @param {String} template
 * @param {String} content
 * @param {Object} data
 * @returns {String}
 */
function parseTemplateMore(template, content, data) {

    // parse multiple times to support inline $RECORD
    // e.g. {$RECORD.{$RECORD.getUniqueFields()[0]}}

    const parseCount = 2;

    var i;
    for (i = 0; i < parseCount; i++) {
        content = parseTemplate(template, content, data);
        if (!content) {
            return "";
        }
    }

    return content;
}


/**
 * parse message template
 *
 * @param {String} template
 * @param {String} content
 * @param {Object} data
 * @returns {String}
 */
function parseTemplate(template, content, data) {
    if (content == null) {
        return "";
    }

    content = String(content);
    if (!content) {
        return "";
    }

    // {$RECORD.xxx}
    var reg = /\{[\w.$()\[\]]+\}/g;

    return content.replace(reg, function($1) {
        var tagContent = $1.substr(1, $1.length - 2).trim();
        var splitarray = tagContent.split('.');
        var variable;
        if (splitarray[1]) {
            variable = 'data["' + splitarray[0] + '"].' + splitarray[1];
        } else {
            variable = splitarray[0];
        }

        var tmp = null;
        try {
            tmp = eval(variable);
        } catch (ex) {
            tmp = funcs.scmsg("Error", "global") + ": " + ex.message;
            log.error(`Message Template "${template}" contains invalid code: ${ex.message}`);
        }
        if (!tmp) {
            return "";
        }

        var str;
        var fieldType = funcs.type(tmp);
        if (fieldType == lib.DataTypeConst.typeArray()) {
            str = tmp.join('\n\n');
        } else if (fieldType == lib.DataTypeConst.typeDateTime()) {
            str = formatJSDateTime(tmp);
        } else {
            str = tmp;
        }

        return str || "";
    });
}

/**
 * convert JS date to SC datetime string
 *
 * @param {Date} date
 * @returns {String} SCDateTimeString
 */
function formatJSDateTime(date) {
    if (date) {
        return new XMLDate(date).getSCDateTimeString();
    }

    return "";
}