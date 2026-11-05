var $ = lib.c.$;

var logger = getLog("[SmartEmailUtil]");

function setLogger(log) {
    if (log != null) {
        logger = log;
    }
}

/**
 * get Last Processed email's Receive Time
 */
function getLastReceivedTimeForEmail(email, smis_interval, protocol) {
    var time = funcs.tod();
    var table_name;
    if (isPOP3orPOP3s(protocol)) {
        table_name = "smartemailpop3store";
    } else if (isIMAPorIMAPs(protocol)) {
        table_name = "smartemailimapstore";
    } else if (isEWS(protocol)) {
        table_name = "smartemailewsstore";
    }
    time = queryLastReceivedTimeForEmail(table_name, email, smis_interval);
    return time;
}

function queryLastReceivedTimeForEmail(table_name, email, smis_interval) {
    var store = new SCFile(table_name, SCFILE_READONLY);
    var query = "select top 1 receivedtime from " + table_name + " where source=\"" + email + "\"  order by receivedtime desc";
    var res = store.doSelect(query);
    if (res == RC_SUCCESS) {
        var x = store["receivedtime"].getTime();
        return new Date(x - smis_interval * 1000);
    } else {
        return null;
    }
}

/**
 * check the email message whether has been processed or not.
 */
function isProcessed(source, msgid, protocol) {
    var table_name;
    if (isPOP3orPOP3s(protocol)) {
        table_name = "smartemailpop3store";
    } else if (isIMAPorIMAPs(protocol)) {
        table_name = "smartemailimapstore";
    } else if (isEWS(protocol)) {
        table_name = "smartemailewsstore";
        if (lib.Base64Encoder.isBase64(msgid)) {
            msgid = lib.Base64Encoder.encodeBase64Again(msgid);
        }
    }
    var store = new SCFile(table_name, SCFILE_READONLY);
    var query = "source=\"" + source + "\" and msgid=\"" + msgid + "\"";
    var res = store.doSelect(query);

    return res == RC_SUCCESS;
}

/**
 * Convert String time in mm/dd/yyyy HH:mm:ss to Date.
 */
function convertString2Time(receivedTime) {
    if (!receivedTime) {
        return funcs.tod();
    }
    var rectime_date_time = receivedTime.split(" ");

    var rectime_date = rectime_date_time[0].split("/");
    var rectime_time = rectime_date_time[1].split(":");

    var rectime_conv = new Date();
    rectime_conv.setUTCFullYear(rectime_date[2], rectime_date[0] - 1, rectime_date[1]);
    rectime_conv.setUTCHours(rectime_time[0], rectime_time[1], rectime_time[2], 0);
    return rectime_conv;
}

/**
 * Convert current Date time to mm/dd/yyyy HH:mm:ss format string.
 */
function convertTime2String(now) {
    var result = "";
    if (!now) {
        now = new Date();
    }
    var year = now.getUTCFullYear();
    var month = now.getUTCMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = now.getUTCDate();
    if (day < 10) {
        day = "0" + day;
    }
    var hour = now.getUTCHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = now.getUTCMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    var second = now.getUTCSeconds();
    if (second < 10) {
        second = "0" + second;
    }
    result = month + "/" + day + "/" + year + " " + hour + ":" + minute + ":" + second;
    return result;
}

/**
 * Find msg id into database.
 */
function find_msgId(data, protocol) {
    var store;
    var msgid = data["msgid"];
    if (isPOP3orPOP3s(protocol)) {
        store = new SCFile("smartemailpop3store");
    } else if (isIMAPorIMAPs(protocol)) {
        store = new SCFile("smartemailimapstore");
    } else if (isEWS(protocol)) {
        store = new SCFile("smartemailewsstore");
        if (lib.Base64Encoder.isBase64(msgid)) {
            msgid = lib.Base64Encoder.encodeBase64Again(msgid);
        }
    }

    store["msgid"] = msgid;

    var query = "msgid=\"" + store["msgid"] + "\"";
    if (RC_SUCCESS == store.doSelect(query)) {
        return store;
    } else {
        return null;
    }
}

/**
 * Record msg id into database.
 */
function record_msgId(data, protocol) {
    var store;
    var msgid = data["msgid"];
    var msgid_origin = msgid;
    if (isPOP3orPOP3s(protocol)) {
        store = new SCFile("smartemailpop3store");
    } else if (isIMAPorIMAPs(protocol)) {
        store = new SCFile("smartemailimapstore");
    } else if (isEWS(protocol)) {
        store = new SCFile("smartemailewsstore");
        if (lib.Base64Encoder.isBase64(msgid)) {
            store["msgid.origin"] = msgid_origin;
            msgid = lib.Base64Encoder.encodeBase64Again(msgid);
        }
    }

    store["msgid"] = msgid;
    store["receivedtime"] = data["receivedtime"];
    store["source"] = data["source"];

    var query = "source=\"" + store["source"] + "\" and msgid=\"" + store["msgid"] + "\"";
    if (RC_SUCCESS != store.doSelect(query)) {
        store.doInsert();
        return true;
    } else if (store.progress && (store.inQueue == 0)) {
        update_msgId(msgid_origin, protocol, store.progress, lib.SmartEmailConstants.SMARTEMAIL_MSGID_INQUE());
        return true;
    } else {
        return false;
    }
}

/**
 * Update msg id into database.
 */
function update_msgId(msgid, protocol, progress, inQueue) {
    var store;
    if (isPOP3orPOP3s(protocol)) {
        store = new SCFile("smartemailpop3store");
    } else if (isIMAPorIMAPs(protocol)) {
        store = new SCFile("smartemailimapstore");
    } else if (isEWS(protocol)) {
        store = new SCFile("smartemailewsstore");
        if (lib.Base64Encoder.isBase64(msgid)) {
            store["msgid.origin"] = msgid;
            msgid = lib.Base64Encoder.encodeBase64Again(msgid);
        }
    }

    store["msgid"] = msgid;

    var query = "msgid=\"" + msgid + "\"";
    if (RC_SUCCESS == store.doSelect(query)) {
        store["progress"] = progress;
        store["inQueue"] = inQueue;
        store.doUpdate();
        return true;
    } else {
        return false;
    }
}

/**
 * remove msg id from database.
 */
function remove_msgId(msgid, protocol) {
    var store;
    if (isPOP3orPOP3s(protocol)) {
        store = new SCFile("smartemailpop3store");
    } else if (isIMAPorIMAPs(protocol)) {
        store = new SCFile("smartemailimapstore");
    } else if (isEWS(protocol)) {
        store = new SCFile("smartemailewsstore");
        if (lib.Base64Encoder.isBase64(msgid)) {
            msgid = lib.Base64Encoder.encodeBase64Again(msgid);
        }
    }

    var query = "msgid=\"" + msgid + "\"";
    if (RC_SUCCESS == store.doSelect(query)) {
        store.doDelete();

        var ret = store.getNext();
        while (ret != RC_NO_MORE) {
            store.doDelete();
            ret = store.getNext();
        }
    }
}

/**
 * Convert format YYYY-MM-DDThh:mm:ssTZD to UTC Time(fromat. YYYY-MM-DD HH:MM:SS)
 */
function convertPurgeTimeToUTCTime(dt) {
    var format = /^(\d{4})-(0[1-9]|1[1-2])-(0[1-9]|[1-2][0-9]|3[0-1])(\s+)(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    var format_date = /^(\d{4})-(0[1-9]|1[1-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    if (dt.match(format)) {
        dt = dt.replace(new RegExp(/-/g), '/');
        return generateUTCTime(dt);
    } else if (dt.match(format_date)) {
        dt = dt.replace(new RegExp(/-/g), '/');
        dt = dt + " 00:00:00";
        return generateUTCTime(dt);
    }
}

function generateUTCTime(dt) {
    var date = new Date(dt);
    var utcYear = date.getUTCFullYear();
    var utcMonth = date.getUTCMonth() + 1;
    var utcDate = date.getUTCDate();
    var utcHours = date.getUTCHours();
    var utcMins = date.getUTCMinutes();
    var utcSecs = date.getUTCSeconds();
    if (utcMonth < 10) {
        utcMonth = "0" + utcMonth;
    }
    if (utcDate < 10) {
        utcDate = "0" + utcDate;
    }
    if (utcHours < 10) {
        utcHours = "0" + utcHours;
    }
    if (utcMins < 10) {
        utcMins = "0" + utcMins;
    }
    if (utcSecs < 10) {
        utcSecs = "0" + utcSecs;
    }
    var resultDate = utcYear + "-" + utcMonth + "-" + utcDate + " " + utcHours + ":" + utcMins + ":" + utcSecs;
    return resultDate;
}

function buildPurgeSmartEmailMsgIdQuery() {
    var purgeEmailListTime = lib.settings.getSettingValue("SmartEmail", "purgeEmailListTime");
    if (purgeEmailListTime) {
        var query = "receivedtime<\"" + convertPurgeTimeToUTCTime(purgeEmailListTime) + "\"";
        return query;
    } else {
        return null;
    }
}

/**
 * Check whether the given protocol is POP3 or POP3s
 *
 * @param protocol
 * @returns {boolean}
 */
function isPOP3orPOP3s(protocol) {
    if (protocol && ('pop3' == protocol.toLowerCase() || 'pop3s' == protocol.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check whether the given protocol is IMAP or IMAPs
 *
 * @param protocol
 * @returns {boolean}
 */
function isIMAPorIMAPs(protocol) {
    if (protocol && ('imap' == protocol.toLowerCase() || 'imaps' == protocol.toLowerCase())) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check whether the given protocol is EWS
 *
 * @param protocol
 * @returns {boolean}
 */
function isEWS(protocol) {
    if (protocol && 'ews' == protocol.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check whether the given protocol is POP3s
 *
 * @param protocol
 * @returns {boolean}
 */
function isPOP3s(protocol) {
    if (protocol && 'pop3s' == protocol.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check whether the given protocol is IMAPs
 *
 * @param protocol
 * @returns {boolean}
 */
function isIMAPs(protocol) {
    if (protocol && 'imaps' == protocol.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check whether the given protocol is EWS Graph API
 *
 * @param protocol
 * @returns {boolean}
 */
function isEWSGraph(protocol) {
    if (protocol && 'microsoft graph' == protocol.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}

/**
 * trim spaces
 */
function trim(str) {
    if (typeof str == 'string' && str != null) {
        str = str.trim();
    }
    return str;
}

/**
 * Remove html tags.
 * Split lines.
 */
function removeTag(str) {
    if (!str) {
        return null;
    }
    //str = str.replace(/&amp;lt;/gmi, "&lt;");
    str = str.replace(/&gt;/gmi, ">");
    str = str.replace(/&#8203;/gmi, "");
    str = str.replace(/&#8206;/gmi, "\u200E");
    str = str.replace(/&nbsp;/gmi, " ");
    str = str.replace(/<script.*<\/script>/gmi, "");
    // remove [image: image name]
    str = str.replace(/\[image:.*\]/gmi, '');
    str = str.replace(/\[cid:.*\]/gmi, '');
    if (/^<html/i.test(str)) {
        str = str.replace(/\r\n/gmi, "\n");
        str = str.replace(/\r/gmi, "\n");
        // OCTCR19X1795869 special process for empty character + new line + <span> tag
        str = str.replace(/(\S)(\n+<span[^>]*>)/gmi, "$1 $2");
        str = str.replace(/\n/gmi, "");
    }
    str = str.replace(/<head(\s+[^>]*|\s*)>.*<\/head\s*>/gmi, "");
    str = str.replace(/\r\n/gmi, "<BR>"); //Windows OS Style
    str = str.replace(/\r/gmi, "<BR>"); //MAC OS Style
    str = str.replace(/\n/gmi, "<BR>"); //UNIX OS Style
    str = str.replace(/<style>((?!<style>).)*<\/style>/gmi, "");
    str = str.replace(/<\/p[^>]*><p[^>]*>/gmi, "\r\n");
    str = str.replace(/<(\/?br|\/?ul|\/?ol|\/?dt|\/?dl|\/?div|\/?p|\/?dd|tr|li|\/?h[1-6]|\/?table|\/?form|\/?iframe)[^>]*>/gmi, "\r\n");
    str = str.replace(/<[^>]*>/gm, "");
    str = str.replace(/\r\n/gmi, "<BR>"); //Windows OS Style
    str = str.replace(/(\s*<BR>){3,}/gm, "<BR><BR>");
    str = str.replace(/^(\s*<BR>){1,}/m, "");
    str = str.replace(/(\s*<BR>\s*){1,}$/m, "");
    // remove HTML Code
    str = removeHTMLCode(str);
    str = lib.Underscore.require().unescape(str);
    str = decodeHtmlEntity(str);
    str = str.split("<BR>");

    return str;
}

/**
 *  Resolve plain text to split lines
 */
function resolvePlainText(str, action, operatorName) {
    if (!str) {
        return null;
    }

    // when resolve again, str is array and convert it to string
    if (Array.isArray(str)) {
        str = str.join("\n");
    }

    var lang = "en";
    if (operatorName) {
        lang = lib.NotificationRecipientsHelp.determinLang(operatorName) || "en";
    }

    str = str.replace(/\r\n/gmi, "\n"); //Windows OS Style
    str = str.replace(/\r/gmi, "\n"); //MAC OS Style

    // remove oob default body for some actions
    var defaultBodyActions = ["approve", "close", "comment", "deny"];
    if (action && defaultBodyActions.indexOf(action) >= 0) {
        var defaultBodyID = action + "_default_body";

        var body = lib.localizeTable.getLocalizedMessageText(lang, "SmartEmail", defaultBodyID);

        if (body && body.startsWith("<") && body.endsWith(">")) {
            var regex = new RegExp(body, "g");
            str = str.replace(regex, "");
        }
    }

    str = str.replace(/^\s*\n/gm, ""); //remove empty line

    str = str.split("\n");

    return str;
}

/**
 *  Resolve email subject as the attachment file name
 */
function resolveSubjectFilename(subject) {
    if (!subject) {
        return "";
    }

    subject = subject.replace(/<[^>]*>/gm, ""); // remove html tag
    subject = subject.replace(/[\\/:*?"<>|]/gm, ""); // remove illegal character for file name
    subject = subject.replace(/^\s+/, ""); // remove empty character of prefix
    subject = subject.replace(/\s+$/, ""); // remove empty character of suffix

    return subject;
}

function decodeHtmlEntity(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCodePoint(dec);
    });
}

function removeHTMLCode(str) {
    str = lib.HTMLCodeConverter.convertCzechSlovenianHTMLCode(str);
    str = lib.HTMLCodeConverter.convertFrenchHTMLCode(str);
    str = lib.HTMLCodeConverter.convertGermanHTMLCode(str);
    str = lib.HTMLCodeConverter.convertItalianHTMLCode(str);
    str = lib.HTMLCodeConverter.convertPolishHTMLCode(str);
    str = lib.HTMLCodeConverter.convertRussianHTMLCode(str);
    str = lib.HTMLCodeConverter.convertSpanishHTMLCode(str);
    str = lib.HTMLCodeConverter.convertTurkishHTMLCode(str);

    return str;
}

function getUniqueKeyField(filename) {
    return lib.CalendarDao.getUniqueKeyField(filename);
}

function containsToken(desc) {
    if (!desc) {
        return false;
    }

    var desc_temp = desc;
    if (Array.isArray(desc)) {
        //        desc_temp = desc.join("\r\n");
        desc_temp = desc.join("<BR>");
    }

    var token_prefix = lib.MailUtil.getTokenPrefix();
    var token_postfix = lib.MailUtil.getTokenPostfix();

    var token_regx = token_prefix.replace(/\*/g, "\\*") + ".*?" + token_postfix.replace(/\*/g, "\\*");

    var index = desc_temp.search(token_regx);

    return index > -1;
}

/**
 * Remove the token from email body.
 * @param  {String} email body with encrypted token, eg. "******Token:FEFE63B434D4479065F8F47C24137E5507C92C6D33A7CA37CD3BDEAEFE16F3EFC2721735999DBAB7F362C83359C24990031BA6FC47171394BB623FD520686D9DB4A42EF1798CB888CFBA4B6897AE97267FE57B206B25C175B43BD8F93BFC91465A3D55E67F994E0EA04F2C5E7A90A96ACF5DEFEF*****"
 * @return {String} email body without encrypted token
 */
function removeToken(emailBody) {
    if (!emailBody) {
        return null;
    }
    var regx = /\*{5}.*?\*{5}/g;
    if (Array.isArray(emailBody)) {
        emailBody = emailBody.join("<BR>");
        emailBody = emailBody.replace(regx, '').replace(/(<BR>){2,}/gm, "<BR>").replace(/(<BR>)*$/, '').split("<BR>");
        return emailBody;
    }
    return emailBody.replace(regx, '');
}

/**
 * Capture the token from email body.
 * @param  {String} email body with encrypted token, eg. "******Token:FEFE63B434D4479065F8F47C24137E5507C92C6D33A7CA37CD3BDEAEFE16F3EFC2721735999DBAB7F362C83359C24990031BA6FC47171394BB623FD520686D9DB4A42EF1798CB888CFBA4B6897AE97267FE57B206B25C175B43BD8F93BFC91465A3D55E67F994E0EA04F2C5E7A90A96ACF5DEFEF*****"
 * @return {String} decrypted token
 */
function captureToken(emailBody) {
    var token_prefix = lib.MailUtil.getTokenPrefix();
    var token_postfix = lib.MailUtil.getTokenPostfix();
    var token_regx = token_prefix.replace(/\*/g, "\\*") + ".*?" + token_postfix.replace(/\*/g, "\\*");
    var result = null;
    if (Array.isArray(emailBody)) {
        emailBody = emailBody.join("<BR>");
    }
    var array = emailBody.match(token_regx);
    if (array) {
        var i;
        for (i = 0; i < array.length; i++) {
            array[i] = array[i].replace(token_prefix, "").replace(token_postfix, "").replace(/(\s*<BR>\s*)/gm, "");
            result = array[i];
        }
    }
    return result;
}


/**
 * Parse the token to object.
 * @param  {String} decrypted token, eg. "unique.key=SD10202&file.name=incidents&name=Service Catalog Approval&component=null&_file=Approval&_ recipient=xiaojingw@hpe.com&_action=approve&_time=1461657364448"
 * @return {Object} split token to an object. {"unique.key":"SD10202","file.name":"incidents","name":"Service Catalog Approval","component":"null","_file":"Approval","_ recipient":"xiaojingw@hpe.com","_action":"approve","_time":"1461657364448"}
 */
function parseToken(token) {
    var result = {};
    var array = token.split("&");
    var i;
    for (i = 0; i < array.length; i++) {
        var innerArray = array[i].split("=");
        result[innerArray[0]] = innerArray[1];
    }
    var data = {};
    var file = result["_file"];
    var keyField = getUniqueKeyField(file);
    if ("incidents" == file || "probsummary" == file || "rootcause" == file || "request" == file || "cm3r" == file || "cm3t" == file) {
        data['id'] = result[keyField];
        if (data['id'] == null) {
            var keyFields = lib.tableFunctions.getUniqueKey(file);
            var ukeyField = null;
            if (keyFields != null && keyFields.length > 0) {
                ukeyField = keyFields[0];
            }
            data['id'] = result[ukeyField];
        }
        data['file'] = file;
    } else if ("Approval" == file) {
        data['id'] = result["unique.key"];
        data['file'] = result["file.name"];
        data['name'] = result["name"];
    }

    data['recipient'] = result["_recipient"];
    data['action'] = result["_action"];
    data['timestamp'] = result["_time"];

    return data;
}


/**
 * Find incident.
 * @param  {String} id
 * @return
 */
function findIncident(id) {
    var table = 'probsummary';
    var sc = new SCFile(table, SCFILE_READONLY);
    var query = "number=\"" + id + "\"";
    var res = sc.doSelect(query);
    if (res == RC_SUCCESS) {
        return sc;
    }
    return null;
}

/**
 * Find interaction.
 * @param  {String} id
 * @return
 */
function findInteraction(id) {
    var table = 'incidents';
    var sc = new SCFile(table, SCFILE_READONLY);
    var query = "incident.id=\"" + id + "\"";
    var res = sc.doSelect(query);
    if (res == RC_SUCCESS) {
        return sc;
    }
    return null;
}

/**
 * Find SmartEmail Settings.
 * @param  {String} id
 * @return {Object} key = isOneTimeToken, tokenExpirationInterval
 */
function findSmartEmailSettings() {
    var settings = new SCFile("settings", SCFILE_READONLY);
    var query = "name=\"SmartEmail\"";
    var record = settings.doSelect(query);
    if (record == RC_SUCCESS) {
        var settingIdArr = lib.ArrayUtil.toJsArray(settings["settingId"]);
        var settingValueArr = lib.ArrayUtil.toJsArray(settings["settingValue"]);
        var isOneTimeToken;
        var tokenExpirationInterval;
        var i;
        for (i = 0; i < settingIdArr.length; i++) {
            if ("isOneTimeToken" == settingIdArr[i]) {
                isOneTimeToken = settingValueArr[i];
            }
            if ("tokenExpirationInterval" == settingIdArr[i]) {
                tokenExpirationInterval = settingValueArr[i];
            }
        }
        var map = {};
        map["isOneTimeToken"] = isOneTimeToken;
        map["tokenExpirationInterval"] = tokenExpirationInterval;
        return map;
    }
    return null;
}

/**
 * Save token info into table smartemailtokenstore.
 * @param  {Object} data, key = id, file, timestamp, isOneTimeToken, tokenExpirationTime
 */
function recordToken(data) {
    var tokenRecord = new SCFile("smartemailtokenstore");
    tokenRecord['id'] = data['id'];
    tokenRecord['file'] = data['file'];
    tokenRecord['recipient'] = data['recipient'];
    tokenRecord['timestamp'] = data['timestamp'];
    tokenRecord['isOneTimeToken'] = data['isOneTimeToken'];
    tokenRecord['tokenExpirationTime'] = data['tokenExpirationTime'];
    tokenRecord['expired'] = "false";

    var query = "id=\"" + data['id'] + "\" and file=\"" + data['file'] + "\" and timestamp=\"" + data['timestamp'] + "\" and recipient=\"" + data['recipient'] + "\"";
    // If the token doesn't exist in the database, insert.
    if (RC_SUCCESS != tokenRecord.doSelect(query)) {
        tokenRecord.doInsert();
    } else {
        //throw new Error("The record already exists. Detail: " + data['id']);
    }
}

/**
 * Check the token whether has been used or not.
 * @param  {Object} data, key = id, file, timestamp
 * @return true means the token is been used or vice verse .
 */
function isTokenUsed(data) {
    var tokenRecord = new SCFile("smartemailtokenstore", SCFILE_READONLY);
    var query = "id=\"" + data['id'] + "\" and file=\"" + data['file'] + "\" and timestamp=\"" + data['timestamp'] + "\" and expired=true and isOneTimeToken=true";
    return RC_SUCCESS == tokenRecord.doSelect(query);
}

/**
 * Check the token whether has been expired or not.
 * @param  {Object} data, key = id, file, timestamp
 * @return true means the token is expired or vice verse .
 */
function isTokenExpiration(data) {
    var tokenRecord = new SCFile("smartemailtokenstore");
    var query = "id=\"" + data['id'] + "\" and file=\"" + data['file'] + "\" and timestamp=\"" + data['timestamp'] + "\"";
    if (RC_SUCCESS == tokenRecord.doSelect(query)) {
        if ("true" == tokenRecord['expired']) {
            return true;
        }

        var tokenExpirationTime = tokenRecord['tokenExpirationTime'];
        // If the tokenExpirationTime is later than current time, it means expired.
        if (tokenExpirationTime.getTime() > Date.now()) {
            if ("true" == tokenRecord['isOneTimeToken']) {
                expireToken(tokenRecord);
            }
            return false;
        } else {
            expireToken(tokenRecord);
            return true;
        }
    }
    return true;
}

/**
 * Expire the token.
 * @param  new SCFile("smartemailtokenstore")
 *
 */
function expireToken(tokenRecord) {
    tokenRecord['expired'] = "true";
    tokenRecord.doUpdate();
}

function sendEmail(recipient, subject, emailBody, refId) {
    var email = new SCFile("mail");
    var lang = lib.NotificationRecipientsHelp.determinLang(recipient);
    email["user.to"] = recipient.join(",");
    //email["user.from"] = funcs.operator();
    email["date.to.send"] = funcs.tod();
    email["user.from"] = "Email Agent";
    if (refId) {
        email["reference.id"] = refId;
    }
    email["status"] = "sent";
    email["subject"] = subject;
    email["application"] = "email";
    email["text"].push(populateEmailBody(emailBody, lang));
    email["user.array"] = recipient;
    email["bccuser.array"] = null;
    email["ccuser.array"] = null;

    var paramNames = new SCDatum();
    var paramValues = new SCDatum();

    paramNames.push("record");
    paramValues.push(email);

    var rteReturnValue = "";
    var rc = funcs.rtecall("callrad",
        rteReturnValue,
        "axces.email", //RAD app name
        paramNames,
        paramValues,
        false); //false to run in same thread, true to run in new thread
    return rc;
}

/**
 *  Return the originating email information
 *  It is a string of html table
 */
function getOriginatingEmailInfo(task, recipient, isFrom) {
    if (task == null) {
        return "";
    }

    if (isFrom == null) {
        isFrom = true;
    }

    var inRecord = task["inRecord"];
    if (inRecord == null) {
        inRecord = {};
    }
    var token = inRecord["token"];
    var action = inRecord["action"];


    var emailFromInfo = "";
    var fromEmailInfoEx = "";

    if (inRecord["subject"] != null) {
        emailFromInfo += "<tr><td width=\"30%\">" + lib.MailUtil.getEmailMessage("eh_email_info_subject", "SmartEmail", recipient) + "</td>" +
            "<td width=\"10%\">&nbsp;</td>" +
            "<td width=\"60%\">" + inRecord["subject"] + "</td></tr>";
    }

    if (token != null && token["action"] != null && token["file"] != null) {
        emailFromInfo += "<tr><td width=\"30%\">" + lib.MailUtil.getEmailMessage("eh_email_info_module", "SmartEmail", recipient) + "</td>" +
            "<td width=\"10%\">&nbsp;</td>" +
            "<td width=\"70%\">" + lib.MailUtil.getEmailMessage(token["file"], "tablename", recipient) + "</td></tr>";
        if (token["id"] != null) {
            emailFromInfo += "<tr><td width=\"30%\">" + lib.MailUtil.getEmailMessage("eh_email_info_id", "SmartEmail", recipient) + "</td>" +
                "<td width=\"10%\">&nbsp;</td>" +
                "<td width=\"70%\">" + token["id"] + "</td></tr>";
        }
        emailFromInfo += "<tr><td width=\"30%\">" + lib.MailUtil.getEmailMessage("eh_email_info_action", "SmartEmail", recipient) + "</td>" +
            "<td width=\"10%\">&nbsp;</td>" +
            "<td width=\"70%\">" + lib.MailUtil.getEmailMessage(token["action"] + "_action_label", "SmartEmail", recipient) + "</td></tr>";
    }

    if (!isFrom && inRecord["from"] != null && inRecord["from"].length > 0 && inRecord["from"][0]["address"] != null) {
        emailFromInfo = "<tr><td width=\"30%\">" + lib.MailUtil.getEmailMessage("eh_email_info_from", "SmartEmail", recipient) + "</td>" +
            "<td width=\"10%\">&nbsp;</td>" +
            "<td width=\"70%\">" + inRecord["from"][0]["address"] + "</td></tr>" + emailFromInfo;
    }

    if (emailFromInfo.length > 0) {
        emailFromInfo = "<BR><BR><BR>" + lib.MailUtil.getEmailMessage("eh_email", "SmartEmail", recipient) + "<BR><table width=\"600\">" + emailFromInfo + "</table>";
    }

    return emailFromInfo;
}

/**
 *  Return the email information of update field value
 *  It is a string of html table
 */
function getUpdateFieldValuesEmailInfo(task, recipient) {
    if (!task) {
        return "";
    }

    // only works when there is valid update field value
    if (task["updateFieldValueList"] == null || task["updateFieldValueList"].length == 0) {
        return "";
    }

    var updateFieldValuesInfo = "";

    var lng = task["updateFieldValueList"].length;
    var i;
    var fieldValue;

    for (i = 0; i < lng; i++) {
        fieldValue = task["updateFieldValueList"][i];
        // only when field name is not empty
        if (fieldValue != null && fieldValue.length == 2 && fieldValue[0] != null && fieldValue[0].length > 0) {
            updateFieldValuesInfo += "<tr><td width=\"30%\">" + fieldValue[0] + "</td>" +
                "<td width=\"10%\">&nbsp;</td>" +
                "<td width=\"70%\">" + (fieldValue[1] === null ? "" : fieldValue[1]) + "</td></tr>";
        }
    }

    if (updateFieldValuesInfo.length > 0) {
        var align = "left";
        var lang = lib.NotificationRecipientsHelp.determinLang(recipient);
        //if (lang == "ar" || lang == "he") { // Arabic and Hebrew is right to left
        //    align = "right";
        //}
        updateFieldValuesInfo = "<BR><BR><BR>" + lib.MailUtil.getEmailMessage("ufv_info", "SmartEmail", recipient) +
            "<BR><table width=\"600\"><tr><th width=\"30%\" align=\"" + align + "\">" + lib.MailUtil.getEmailMessage("ufv_field", "SmartEmail", recipient) + "</th>" +
            "<th width=\"10%\">&nbsp;</th>" +
            "<th width=\"70%\" align=\"" + align + "\">" + lib.MailUtil.getEmailMessage("ufv_value", "SmartEmail", recipient) + "</th></tr>" +
            updateFieldValuesInfo + "</table><BR>";
    }

    return updateFieldValuesInfo;
}

/**
This function is used to get the next sequential key for th probsummary table
**/
function newIncidentId() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, "incident management");
    return newid.getText();
}

function checkConnectionStatus(msg) {
    var returnCode = lib.SmartEmailReturnCode.getReturnCode();
    if (msg.match(lib.SmartEmailConstants.LOGIN_FAILED())) {
        return returnCode.LOGIN_FAILED;
    } else if (msg.match(lib.SmartEmailConstants.MAIL_CONNECT_EXCEPTION())) {
        if (msg.match(lib.SmartEmailConstants.MAIL_CONNECT_PROXY_EXCEPTION())) {
            return returnCode.MAIL_CONNECT_PROXY_EXCEPTION;
        } else {
            return returnCode.MAIL_CONNECT_EXCEPTION;
        }
    } else if (msg.match(lib.SmartEmailConstants.WRONG_PROTOCOL())) {
        return returnCode.WRONG_PROTOCOL;
    } else if (msg.match(lib.SmartEmailConstants.EWS_LOGIN_FAILED())) {
        return returnCode.LOGIN_FAILED;
    } else if (msg.match(lib.SmartEmailConstants.EWS_MAIL_CONNECT_EXCEPTION())) {
        return returnCode.MAIL_CONNECT_EXCEPTION;
    } else if (msg.match(lib.SmartEmailConstants.EWS_MAIL_CONNECT_PROXY_EXCEPTION())) {
        return returnCode.MAIL_CONNECT_PROXY_EXCEPTION;
    } else if (msg.match(lib.SmartEmailConstants.WRONG_DOMAIN_NAME())) {
        return returnCode.WRONG_DOMAIN_NAME;
    } else {
        return returnCode.UNKNOWN_CONNECTION_EXCEPTION;
    }
}

function getAttachments(app, topic, inlineList) {
    var datum = new SCDatum();
    datum.setType(lib.DataTypeConst.typeArray());
    var query = "application=\"" + app + "\" and topic=\"" + topic + "\" and segment=0";
    $("SYSATTACHMENTS", SCFILE_READONLY).fields(["uid", "application", "topic"]).select(query).iterate(function(attachment) {
        var datumTemp = new SCDatum();
        datumTemp.push(attachment["uid"]);
        datumTemp.push(attachment["application"]);
        datumTemp.push(attachment["topic"]);
        if (inlineList != null && lib.ArrayUtil.contains(inlineList, attachment["uid"])) {
            datumTemp.push(true);
        } else {
            datumTemp.push(false);
        }
        datum.push(datumTemp);
    });

    return datum;
}

function getUpdatedAttachments(app, topic, seq) {
    var datum = new SCDatum();
    datum.setType(lib.DataTypeConst.typeArray());
    var query = "application=\"" + app + "\" and topic=\"" + topic + "\"";
    $("SYSATTACHMENTS").select(query).iterate(function(attachment) {
        attachment["application"] = "eventout";
        attachment["topic"] = seq;
        attachment.doUpdate();
        if (attachment["segment"] == 0) {
            var datumTemp = new SCDatum();
            datumTemp.push(attachment["uid"]);
            datumTemp.push(attachment["application"]);
            datumTemp.push(attachment["topic"]);
            datumTemp.push(false);
            datum.push(datumTemp);
        }
    });

    return datum;
}

function getClonedAttachments(query, seq, inlineList) {
    cloneAttachmentsFromTicket(query, seq);
    return getAttachments("eventout", seq, inlineList);
}

function checkDuplicateAttachment(attachment) {
    var query = "application=\"" + attachment["application"] + "\" and topic=\"" + attachment["topic"] +
        "\" and type=" + attachment["type"] + " and uid=\"" + attachment["uid"] + "\" and segment=" + attachment["segment"];
    var attach = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
    attach.setFields(["application"]);
    var count = attach.doCount(query);
    return (count > 0);
}

function cloneAttachmentsFromTicket(query, seq) {
    $("SYSATTACHMENTS").select(query).iterate(function(attachment) {
        var attach = new SCFile("SYSATTACHMENTS");
        funcs.fduplicate(attach, attachment);
        attach["application"] = "eventout";
        attach["topic"] = seq;
        if (!checkDuplicateAttachment(attach)) {
            attach.doInsert();
        }
    });
}

function removeEmailAttachments() {
    var dbType = lib.dbdictHelper.getDbType();
    var attachmentDbdict = $("dbdict").select("name=\"SYSATTACHMENTS\"").uniqueResult();
    if (attachmentDbdict == null) {
        return;
    }

    var eventoutDbdict = $("dbdict").select("name=\"eventout\"").uniqueResult();
    if (eventoutDbdict == null) {
        return;
    }

    var adaptor = lib.DataService.getAdaptor(dbType);

    var sql = "delete from " + attachmentDbdict.sql_tables.sql_table_name +
        " where " + adaptor.escapeField("APPLICATION") + "='eventout' and not " + adaptor.escapeField("TOPIC");
    sql += " in (select " + adaptor.escapeField("EVSYSSEQ") + " from " + eventoutDbdict.sql_tables.sql_table_name + ")";

    $("#dataService").executeSQL(sql);
}

// set operator to another name
function setOperator(operator) {
    //vars['$L.op'] = operator;
    //funcs.parse_evaluate('operator()=$L.op', 11);
    lib.reportExport.setOpertor(operator);
    //QCCR1E146393 Smart-email do not use full name in activity
    if (operator != lib.SmartEmailConstants.EMAIL_AGENT_NAME()) {
        var opeRecord = lib.operatorUtil.getOperatorByName(operator);
        if (opeRecord != null) {
            vars.$lo_ufname = opeRecord.full_name != null ? opeRecord.full_name : opeRecord.name;
        }
    }
}

function populateEmailBody(text, lang) {
    var emailBody = lib.htmlemailtemplates.getMailBody("SmartEmailErrorHandling", null, null, null, lang);
    if (emailBody) {
        emailBody = emailBody.replace(/\$\$\$\$/, text);
    } else {
        emailBody = text;
    }
    return emailBody;
}

function populateRecipient(email) {
    if (!email) {
        return null;
    }
    if (lib.MailUtil.isEmailAddress(email)) {
        return email;
    } else {
        var ope = new SCFile("operator", SCFILE_READONLY);
        var query = 'name="' + email + '"';
        ope.setFields(["email"]);
        var ret = ope.doSelect(query);
        if (ret == RC_SUCCESS) {
            return ope.email;
        }
    }
    return null;
}

function convertSmartEmailEWSStore(oneday) {
    print("Converting smartemaileswstore ...");

    var query = "true";
    if (oneday == true) {
        query = "receivedtime > '" + funcs.str(funcs.tod()) + "' - '1 00:00:00'";
    }

    var store = new SCFile("smartemailewsstore");
    var rc = store.doSelect(query);
    var count = 0;

    while (rc == RC_SUCCESS) {
        if (store["msgid.origin"] == null && lib.Base64Encoder.isBase64(store["msgid"])) {
            store["msgid.origin"] = store["msgid"];
            store["msgid"] = lib.Base64Encoder.encodeBase64Again(store["msgid"]);
            store.doUpdate();
            count++;
            if (count % 1000 == 0) {
                print("" + count + " records of smartemaileswstore are converted.");
            }
        }

        rc = store.getNext();
    }

    if (count % 1000 != 0) {
        print("" + count + " records of smartemaileswstore are converted.");
    }

    print("Converting smartemaileswstore is finished.");
}

/**
 * Get the configuration item of SmartEmail Integration
 */
function getConfigurationItem() {
    return lib.smis_ConfigurationManager.getEnabledConfigItem("SmartEmail");
}


function isEnabled() {
    return getConfigurationItem() != null;
}

/**
 *  Check if configuration item of SmartEmail Integration is defined
 */
function exists() {
    return lib.smis_ConfigurationManager.getInstanceCount("SmartEmail") > 0;
}

/**
 *  Parse the ticket ID from email subject
 *  The subject format must be [Update <ID>]
 */
function parseUpdateTagID(subject) {
    if (subject == null || subject.length == 0) {
        return null;
    }

    var updateTag = "Update";

    var regex = new RegExp("^\\s*\\[\\s*" + updateTag + "\\s+([^\\[\\]\\s]+)\\s*\\].*$", "i");
    var result = regex.exec(subject);

    if (result == null || result.length != 2) {
        return null;
    }

    return result[1];
}

/**
 *  Parse the field-value from every line of email body
 *  The parameter body must be an array with string elements
 *  The format is [<field name>]=<value>
 */
function parseUpdateFieldValues(body, descriptionField) {
    var fieldValues = {};

    if (body != null) {
        var regex = /^\s*\[\s*([a-zA-Z0-9.]+)\s*\]\s*=(.*)$/;

        var len = lib.ArrayUtil.length(body);
        var i;
        var result;
        for (i = 0; i < len; i++) {
            result = body[i].match(regex);

            if (result != null && result.length == 3) {
                switch (result.length) {
                    case 2:
                        fieldValues[result[1]] = "";
                        break;
                    case 3:
                        fieldValues[result[1]] = result[2].trim();
                        break;
                }
            }
        }
    }

    return fieldValues;
}

/**
 *  Project the field value into file
 *  Parameters:
 *    scfile - the ticket file
 *    fieldValues - JSON object for field value mapping
 *    fieldNameList - The array contains the field names allowed to update.
 *    fieldTypeList - The array contains the field smis type defined in SMIS field mapping
 *    user - the operator used to convert datetime
 *  Return the array of field value pair array to update
 */
function projectFieldValuesToFile(scfile, fieldValues, fieldNameList, fieldTypeList, user) {
    if (scfile == null || fieldValues == null || fieldNameList == null) {
        return [];
    }

    if (fieldTypeList == null) {
        fieldTypeList = [];
    }

    var filename = funcs.filename(scfile);
    if (filename == null) {
        return [];
    }

    var keyfield = getUniqueKeyField(filename);

    if (user == null) {
        user = funcs.operator();
    }

    if (logger.isDebugEnabled()) {
        logger.debug("SmartEmailUtil", "Project field values to this record.");
    }

    var field;
    var type;
    var value;
    var values;
    var i;
    var parsedValue;
    var parsedValues;
    var isValueParsed;
    var index;
    var smisType;
    var parsedFieldValueList = [];
    for (field in fieldValues) {
        if (logger.isDebugEnabled()) {
            logger.debug("SmartEmailUtil", "Parse the value for the field \"" + field + "\".");
        }

        // check if the field exists in fieldNameList defined in SMIS
        index = lib.ArrayUtil.indexOf(fieldNameList, field);
        if (index < 0) {
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "this field is not allowed to update.");
            }
            continue;
        }

        // get smis type
        smisType = "";
        if (index < fieldTypeList.length) {
            smisType = fieldTypeList[index];
        }

        // Cannot update key field
        if (field == keyfield) {
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "cannot update the key field.");
            }
            continue;
        }

        value = $.trim(fieldValues[field]);

        // value is empty, skip this field
        if (value == null || value.length == 0) {
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "the value is empty, do not update this field.");
            }
            continue;
        }

        // value is the string NULL, clean the value of this field
        if (value == "NULL") {
            scfile[field] = null;
            parsedFieldValueList.push([field, value]);
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "set this field to null.");
            }
            continue;
        }

        // It works as funcs.dbdict_helper("field.type", filename, field);
        type = scfile.getFieldType(field);
        // If the field is not defined, return 0
        if (type <= 0) {
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "its type cannot be recognized.");
            }
            continue;
        }

        isValueParsed = false;
        // type is array
        if (type == lib.DataTypeConst.typeArray()) {
            // get type of array element
            type = scfile.getFieldType(field + ",1");
            // Use \n as string split
            values = value.split("\\n");
            parsedValues = [];
            for (i = 0; i < values.length; i++) {
                parsedValue = parseValueForFieldType(values[i], type, smisType, user);
                if (parsedValue == null) {
                    break;
                }
                parsedValues.push(parsedValue);
            }

            // When all values are parsed, the number of parsed values are same as the one of the original values
            if (parsedValues.length == values.length) {
                scfile[field] = parsedValues;
                isValueParsed = true;
            }
        } else { // non-array field: string, number, boolean and datetime
            parsedValue = parseValueForFieldType(value, type, smisType, user);
            if (parsedValue != null) {
                scfile[field] = parsedValue;
                isValueParsed = true;
            }
        }

        if (isValueParsed) {
            // put the parsed field and value into the list
            parsedFieldValueList.push([field, value]);
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "its value is set to " + scfile[field]);
            }
        }
    }

    return parsedFieldValueList;
}

/**
 *  Parse string value from type
 *  Return the parsed value, if parse failed, return null
 *  Parameters
 *    value: string, cannot be null
 *    type: the field type in dbdict, refer to ScriptLibray DataTypeConst
 *    smisType: the field type defined in SMIS field mapping
 *    user: the operator user login name, datetime value is parsed by the user's time zone and date order
 */
function parseValueForFieldType(value, type, smisType, user) {
    // validate if the value is matched by the smis type
    if (smisType == "number") {
        if (Number.isNaN(Number(value))) { // smis type is number but the value is not valid
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "The smis number value is illegal.");
            }
            return null;
        }
    }

    var parsedValue = null;
    if (type == lib.DataTypeConst.typeCharacter()) { // string
        // When the string starts with and end by double quote, they are trimmed
        if (value.length >= 2 && value.charAt(0) == "\"" && value.charAt(value.length - 1) == "\"") {
            value = value.substring(1, value.length - 1);
        }
        parsedValue = value;
    } else if (type == lib.DataTypeConst.typeNumber()) { // number
        if (!Number.isNaN(Number(value))) {
            parsedValue = +value;
        } else {
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "The number value is illegal.");
            }
        }
    } else if (type == lib.DataTypeConst.typeBoolean()) { // boolean
        if (value.toLowerCase() == "t" || value.toLowerCase() == "true") {
            parsedValue = true;
        } else if (value.toLowerCase() == "f" || value.toLowerCase() == "false") {
            parsedValue = false;
        }
    } else if (type == lib.DataTypeConst.typeDateTime()) { // datetime
        // match interval like: +'1 00:00:00'
        var regex = /^\s*[+-]\s*'\s*\d+\s+(\d|[0-1][0-9]|2[0-3]):(\d|[0-5][0-9]):(\d|[0-5][0-9])'\s*$/;
        if (regex.test(value)) {
            funcs.parse_evaluate("$L.temp=tod()" + value);
            parsedValue = vars["$L.temp"];
            if (logger.isDebugEnabled()) {
                logger.debug("SmartEmailUtil", "the datetime is parsed to tod()" + value);
            }
        } else {
            // When the string starts with and end by single quote, they are trimmed
            if (value.length > 2 && value.charAt(0) == "'" && value.charAt(value.length - 1) == "'") {
                value = value.substring(1, value.length - 1);
            }

            // Fetch the user's time zone and date order
            var tz = lib.tzFunctions.retrieveOperatorTimeZone(user);
            // Convert the datetime string from the user's time zone and date order to the current user's
            var localvalue = lib.tzFunctions.convertDateStringOnTZ(value, tz[0], tz[1], vars["$lo.time.zone"], vars["$lo.date.order"]);
            // Convert to the datetime object
            var v = funcs.val(localvalue, 3);

            if (v != null) {
                parsedValue = v;
            } else {
                if (logger.isDebugEnabled()) {
                    logger.debug("SmartEmailUtil", "The datetime value cannot be parsed.");
                }
            }
        }
    }

    return parsedValue;
}

/**
 *  Parse the mail body and project the field value to the file
 */
function projectMailBodyToFile(scfile, body, fieldNameList, fieldTypeList, user) {
    return projectFieldValuesToFile(scfile, parseUpdateFieldValues(body), fieldNameList, fieldTypeList, user);

}

// The field of object used for OCR
var objectOCRField = {
    "incidents": "description",
    "probsummary": "action",
    "cm3r": "description"
};

/**
 *  Return the OCR field name of the object
 *  The parameter object is the dbdict name.
 */
function getObjectOCRField(object) {
    return objectOCRField[object];
}

// Define the mapping between the add action option in SmartEmail form and object
var displayObjects = {
    "interaction": "incidents",
    "incident": "probsummary",
    "change": "cm3r"
};

// Return the object name mapped by the add action option in SmartEmail form
function getObjectNameByOption(option) {
    return displayObjects[option];
}

/**
 *  The JSON defines the mapping between class and number prefix in number table
 *  The class in number table is actually the relevant dbdict name.
 *  object name : number prefix
 */
var objectNumberPrefix = {};

/**
 *  Initialize the JSON objectNumberPrefix to store the mapping between object and number prefix
 *  Fetch the candidate object list and get the number class in the field number.record of Object
 *  Search number table with the class is the value of the field number.record
 */
function initObjectNumberPrefix() {
    var dispObj;
    for (dispObj in displayObjects) {
        var obj = displayObjects[dispObj];
        var prefix = objectNumberPrefix[obj];
        if (prefix == null) {
            var object = $("Object", SCFILE_READONLY).setFields(["file.name", "number.record"]).select("file.name=\"" + obj + "\"").uniqueResult();
            if (object != null) {
                var numClass = object["number.record"];
                var number = $("number", SCFILE_READONLY).setFields(["name", "prefix"]).select("name=\"" + numClass + "\"").uniqueResult();
                if (number != null) {
                    objectNumberPrefix[obj] = number["prefix"] == null ? "" : number["prefix"];
                }
            }
        }
    }
}

/**
 *  Return the object name from the id value
 */
function getObjectNameFromID(id) {
    if (id == null) {
        return null;
    }

    id = id.trim();
    if (id.length == 0) {
        return null;
    }

    var object = null;

    var obj;
    for (obj in objectNumberPrefix) {
        var prefix = objectNumberPrefix[obj];
        if (prefix != null && prefix.trim().length > 0) {
            var regex = new RegExp("^" + prefix + "\\d+");
            if (regex.test(id)) {
                object = obj;
                break;
            }
        }
    }

    return object;
}

/**
 *  Return the module list
 *     {"valueList":[value string], "displayList": [display value string], "defaultValue": <default value>}
 */
function getModuleList() {
    var valueList = ["interaction", "incident", "change"];

    var lng = valueList.length;
    var displayList = [];
    var i;
    for (i = 0; i < lng; i++) {
        var object = getObjectNameByOption(valueList[i]);
        displayList.push(funcs.scmsg(object, "tablename"));
    }

    return { "valueList": valueList, "displayList": displayList, "defaultValue": valueList[0] };
}

/**
 *  Return the module from the SMIS task wizard.
 */
function getSelectedModule() {
    return vars["$param.object"];
}

/**
 * get SmartEmail graph api token module
 *
 * @param {String} intId
 * @returns {String}
 */
function getSmartEmailTokenModule(intId) {
    // append integration id, like "SmartEmail-1" to support multiple instances
    return "SmartEmail-" + intId;
}

/**
 * check whether token module is for SmartEmail
 *
 * @param {String} module
 * @returns {Boolean}
 */
function isTokenModuleForSmartEmail(module) {
    return module && module.startsWith("SmartEmail-");
}