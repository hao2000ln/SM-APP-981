var _ = lib.Underscore.require();

/*
 * Deprecated
 * Try to find what you need in lib.Underscore instead
 */

/**
 * This file contains some common methods for string object
 */

// This function is used when generating XML
// to escape things like double quotes, reserved XML chars, etc.
function escapeStringforXML(value) {
    if (value != null && typeof value == 'string') {
        value = value.replace(/&/g, "&amp;"); // escape all & characters
        value = value.replace(/>/g, "&gt;"); // escape all > characters
        value = value.replace(/</g, "&lt;"); // escape all < characters
        value = value.replace(/"/g, "&quot;"); // escape all " characters to &quot;
    }
    return value;
}


function escapeStr(str) {
    if (str != null) {
        str = str.replace("\\", "\\\\");
        str = str.replace("\"", "\\\"");
    }
    return str;
}


function escapeAllStr(str) {
    if (str != null) {
        str = str.replace(/\\/g, "\\\\");
        str = str.replace(/"/g, "\\\"");
    }
    return str;
}

function escapeAllBackSlash(str) {
    if (str != null) {
        str = str.replace(/\\/g, "\\\\");
    }
    return str;
}


/**
 *  Escape the single quote in SQL by adding one more single quote
 */
function escapeAllSingleQuoteForSQL(str) {
    if (str != null) {
        str = str.replace(/'/g, "''");
    }
    return str;
}

/**
 * Search all date type part of string and convert to the correct time zone and data order
 * @param {string} string - The input string
 * @param {boolean} reverse - true to convert local to GMT, false to convert GMT to local. Default is false.
 * @param {boolean} hasQuotation - true to has single quotation for date part and false not. Default is true.
 * @return the converted string
 **/
function convertDateInString(string, reverse, hasQuotation) {
    if (string == null) {
        return string;
    }

    if (reverse == null) {
        reverse = false;
    }

    if (hasQuotation == null) {
        hasQuotation = true;
    }

    var newstr = "";

    var index = [];
    var lastindex = [];
    lastindex.push(0);
    var orig = [];
    var dest = [];

    var pattern;
    var offset = 0;
    var dateseparator = "\/";
    if (reverse) {
        var localtz = lib.tzFunctions.getTZFileByTZName(vars.$lo_time_zone);
        dateseparator = funcs.nullsub(localtz.date_separator, "\/");
    }
    if (hasQuotation) {
        pattern = new RegExp("'([0-9]+" + dateseparator + "[0-9]+" + dateseparator + "[0-9]+s*( [0-9]+:[0-9]+(:[0-9]+)?)?)'", "g");
        offset = 1;
    } else {
        pattern = new RegExp("([0-9]+" + dateseparator + "[0-9]+" + dateseparator + "[0-9]+s*( [0-9]+:[0-9]+(:[0-9]+)?)?)", "g");
    }
    var matches = pattern.exec(string);
    while (matches != null) {
        index.push(matches.index + offset);
        lastindex.push(matches.index + matches[0].length - offset);
        var origstr = matches[0].substr(offset, matches[0].length - 2 * offset);
        orig.push(origstr);
        if (reverse) {
            dest.push(lib.tzFunctions.convertDateStringToGMT(origstr));
        } else {
            dest.push(lib.tzFunctions.convertDateStringToLocal(origstr));
        }
        matches = pattern.exec(string);
    }

    var i;
    for (i = 0; i < index.length; i++) {
        newstr += string.substring(lastindex[i], index[i]);
        var str = dest[i];
        if (hasQuotation) {
            var ch;
            if (index[i] > 1) {
                ch = string.charAt(index[i] - offset - 1);
                if (ch == "'") {
                    str = orig[i];
                }
            }
            if (lastindex[i + 1] < string.length - 1) {
                ch = string.charAt(lastindex[i + 1] + 1);
                if (ch == "'") {
                    str = orig[i];
                }
            }
        }
        newstr = newstr + str;
    }

    newstr += string.substring(lastindex[index.length]);

    return newstr;
}


/**
 * Strip HTML tags of the text
 *
 * @param {String} HTML string
 * @returns {String}
 */
function stripHtmlTags(htmlString) {

    if (htmlString == null) {
        return null;
    }

    if (htmlString.length == 0) {
        return "";
    }

    // change <br/> to line feed
    var stripedHtml = htmlString.replace(/<br\s*\/>/ig, '\n');

    // remove tags    
    stripedHtml = stripedHtml.replace(/<[^>]+>/g, '');

    // decode
    stripedHtml = _.unescapeHTML(stripedHtml);

    // replace &nbsp; with space
    stripedHtml = stripedHtml.replace(/&nbsp;/ig, ' ');

    return stripedHtml;
}


/**
 * sanitize html tag to avoid XSS attack
 *
 * @param {String} htmlString
 * @returns {String}
 * @see com.hp.ov.sm.client.common.util.XssFilter.java
 */
function sanitize(htmlString) {

    if (htmlString == null) {
        return null;
    }

    if (htmlString.length == 0) {
        return "";
    }

    // remove eval()
    var cleanHtml = htmlString.replace(/eval\((.*)\)/g, '');

    // remove "javascript:"
    cleanHtml = cleanHtml.replace(/["'][\s]*(javascript):(.*)["']/ig, '""');

    // remove <script></script>
    cleanHtml = cleanHtml.replace(/<script\s?[^>]*?>([\s\S])*?<\/script\s?[^>]*?>/ig, '');

    return cleanHtml;
}


/**
 * Returns the calling string value converted to lower case
 * 
 * @param {String} str
 * @param {String} locale
 * @returns {String} A new string representing the calling string converted to lower case
 */
function toLocaleLowerCase(str, locale) {
    if (!str) {
        return str;
    }

    // handle Turkish specially, there is a bug in current JS engine
    if (isTurkishLocale(locale)) {
        str = str.replace(/I/g, "ı");
    }

    return str.toLocaleLowerCase();
}


/**
 * Returns the calling string value converted to upper case
 * 
 * @param {String} str
 * @param {String} locale
 * @returns {String} A new string representing the calling string converted to upper case
 */
function toLocaleUpperCase(str, locale) {
    if (!str) {
        return str;
    }

    // handle Turkish specially, there is a bug in current JS engine
    if (isTurkishLocale(locale)) {
        str = str.replace(/i/g, "İ");
    }

    return str.toLocaleUpperCase();
}


function isTurkishLocale(locale) {
    if (!locale) {
        return false;
    }

    locale = locale.toLowerCase();
    return locale == "tr" || locale.startsWith("tr-");
}