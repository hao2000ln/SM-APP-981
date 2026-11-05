/******************************************************
 * Module Name: SMIS Common Library
 * Function: common library functions
 * Author: Tian, Shao-Qin
 * Version: 1.10
 * Creation Date: spr, 2009
 *******************************************************/

var _ = lib.Underscore.require();
var logger = getLog('smis_CommonLib');

function setSMObjectValue(smobj, fieldname, value) {
    var finalObj = smobj;
    var finalFieldName;
    var path = fieldname.split("#");
    var pathlen = path.length;
    finalFieldName = path[pathlen - 1];
    if (pathlen > 1) {
        var k;
        for (k = 0; k < pathlen - 1; k++) {
            finalObj = finalObj[path[k]];
        }
    }
    if (isArray(finalObj[finalFieldName])) {
        if (!isArray(value)) {
            value = [value];
        }
    }

    finalObj[finalFieldName] = value;
}

function isSMObjectFieldNull(smobj, fieldname) {
    var finalObj = smobj;
    var finalFieldName;
    var path = fieldname.split("#");
    var pathlen = path.length;
    finalFieldName = path[pathlen - 1];
    if (pathlen > 1) {
        var k;
        for (k = 0; k < pathlen - 1; k++) {
            finalObj = finalObj[path[k]];
        }
    }
    if (isArray(finalObj[finalFieldName])) {
        return arrayLen(finalObj[finalFieldName]) == 0;
    }

    return finalObj[finalFieldName] == null;
}

function _isArrayDataType(value) {
    try {
        var type = value.getType();
        if (type == "ARRAY") {
            return true;
        }
    } catch (ex) {}
    return false;
}

function isArray(object) {
    return _.isArray(object);
}

function isDate(object) {

    return object != null && typeof object == "object" &&
        'getDate' in object && 'getTime' in object;
}

function arrayLen(array) {
    if (!isArray(array)) {
        throw new Error("Not a Array.");
    }

    if (typeof array.length == "function") {
        return array.length();
    } else {
        return array.length;
    }
}

/**
 *  Align the length of a series of array to the maximum one
 *  The element to fill is null
 *  Parameter:
 *    variables is an array with the name of RAD array variable
 *  Return the length of array
 *  Example, variables = ["$array1", "$array2", "$array3"],
 *  $array1 has 3 elements, $array2 has 2 elements, $array3 has 5 elements,
 *  All of them will have 5 elements:
 *      2 null elements are appended in $array1
 *      3 null elements are appended in $array2
 *      return the length 5.
 */
function alignVariableArrayLength(variables) {
    if (variables == null) {
        return -1;
    }

    var lng = 0;
    var lng2 = arrayLen(variables);
    var ll;
    var i;

    // Loop to get the maximum length of these arrays
    // Store it in the variable lng
    for (i = 0; i < lng2; i++) {
        if (vars[variables[i]] != null) {
            ll = vars[variables[i]].length();
            if (lng < ll) {
                lng = ll;
            }
        }
    }

    // Loop to fill all arrays to the same length as the maximum one
    for (i = 0; i < lng2; i++) {
        if (vars[variables[i]] == null) {
            vars[variables[i]] = [];
            ll = 0;
        } else {
            ll = vars[variables[i]].length();
        }

        if (ll < lng) {
            var j;
            for (j = ll; j < lng; j++) {
                vars[variables[i]].push(null);
            }
        }
    }

    return lng;
}

function convertToType(value, type) {
    if (value == null) {
        return null;
    }

    if (typeof value == type) {
        return value;
    }
    if (type == "date" && isDate(value)) {
        return value;
    }

    var ret = null;
    if (type === "number") {
        var tempvalue = parseInt(value);
        if (!Number.isNaN(tempvalue)) {
            ret = value;
        }
    } else if (type === "boolean") {
        if (value == "true" || value == "false") {
            ret = (value === "true");
        }
    } else if (type === "string" || type === "String") {
        ret = "" + value;
    } else if (type === "date") {
        var tempdt = new Date(value);
        if (!isNaN(tempdt)) {
            ret = tempdt;
        } else {
            // try to parse the value to RAD datetime
            tempdt = funcs.val(value, 3);
            if (tempdt != null) {
                ret = tempdt;
            } else {
                // match interval like: +'1 00:00:00'
                var regex = /^\s*[+-]\s*'\s*\d+\s+(\d|[0-1][0-9]|2[0-3]):(\d|[0-5][0-9]):(\d|[0-5][0-9])'\s*$/;
                if (regex.test(value)) {
                    funcs.parse_evaluate("$L.temp=tod()" + value);
                    ret = vars["$L.temp"];
                }
            }
        }
    } else if (type === "array") {
        if (isArray(value)) {
            ret = value;
        } else {
            ret = [];
            convertStringToArray(value, ret, 1024);
        }
    }

    return ret;
}

/*
 * convert JS obj to SM obj
 */
function convertToSMObject(mapObj, smObj) {

    var p;
    for (p in mapObj) {
        if (!funcs.exists(p, smObj)) {
            logger.info("Field " + p + " does not exist in table " + funcs.filename(smObj));
            continue;
        }

        if (isArray(mapObj[p])) {
            var arr = mapObj[p];
            if (isArray(smObj[p])) {
                smObj[p] = funcs.denull(smObj[p]);
                var i;
                for (i = 0; i < arr.length; i++) {
                    smObj[p].push(arr[i]);
                }
            } else {
                smObj[p] = arr.toString();
            }
        } else {
            if (isArray(smObj[p])) {
                smObj[p] = funcs.denull(smObj[p]);
                smObj[p].push(mapObj[p]);
            } else {
                smObj[p] = mapObj[p];
            }
        }
    }
}

function converXSDateToJSDate(xsDate) {
    return new XMLDate(xsDate).JSDate();
}


function toJSON(obj) {
    if (!obj) {
        return "";
    }

    // if is sm array
    if (isArray(obj)) {
        var arr = [];
        var i;
        for (i in obj) {
            arr.push(obj[i]);
        }
        return JSON.stringify(arr);
    }

    return JSON.stringify(obj);
}

function fromJSON(jsonStr) {
    return JSON.parse(jsonStr);
}


//variable format: $external.xxx$,$internal.xxx$

function convertStringToArray(data, array, maxlen) {
    if (data == null) {
        return;
    }

    var str;
    while (data.length > maxlen) {
        str = data.substr(0, maxlen);
        data = data.substr(maxlen, data.length - maxlen);
        array.push(str);
    }
    if (data != null && data.length > 0) {
        array.push(data);
    }
}

function getStringFromArray(array) {
    if (!isArray(array)) {
        throw new Error("Not a Array.");
    }
    var data = "";
    var arrLen = arrayLen(array);
    var i;
    for (i = 0; i < arrLen; i++) {
        data = data + array[i];
    }

    return data;
}


/*
 * set $G.pm.environment close previlege
 */
function setTableAccessClose(bClose) {
    var rteReturnValue = new SCDatum();
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    argVals.setType(8); //type array
    argNames.setType(8); //type array
    var argVal;

    argVal = new SCDatum();
    argVal.setType(2); //string                           
    argVal = "boolean1";
    argNames.push(argVal);

    argVal = new SCDatum();
    argVal.setType(4); //boolean                           
    argVal = bClose;
    argVals.push(argVal);

    funcs.rtecall("callrad",
        rteReturnValue,
        "set.tableAccess.close", //RAD app name
        argNames,
        argVals,
        false); //false to run in same thread, true to run in new thread
}

/*
 * set $G.pm.environment update previlege
 */
function setTableAccessUpdate(strUpdate) {
    var rteReturnValue = new SCDatum();
    var argNames = new SCDatum();
    var argVals = new SCDatum();
    argVals.setType(8); //type array
    argNames.setType(8); //type array
    var argVal;

    argVal = new SCDatum();
    argVal.setType(2); //string                           
    argVal = "string1";
    argNames.push(argVal);

    argVal = new SCDatum();
    argVal.setType(2); //string                           
    argVal = strUpdate;
    argVals.push(argVal);

    funcs.rtecall("callrad",
        rteReturnValue,
        "set.tableAccess.update", //RAD app name
        argNames,
        argVals,
        false); //false to run in same thread, true to run in new thread
}


var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;

    var i = 0;

    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }

    return output;
}

function decode64(input) {
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;

    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    input = input.replace(/[^A-Za-z0-9+\/=]/g, "");

    while (i < input.length) {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }

    return output;
}


/**
 * processing string contains placeholder like: ${sm.name} and ${ep[\"street.home\"]}
 */
function evalJS(sm, ep, context, param, str) {
    if (!!!str) {
        return str;
    }

    context = context || {};
    var patt = /\$\{([^}]*)}/g;

    var funcStr = str;
    var objName;
    var fieldName;
    var fieldValue;

    var evalFunc = function(match, $1) {
        try {
            fieldValue = eval($1);
            if (fieldValue == undefined) {
                return "";
            } else {
                return fieldValue;
            }
        } catch (ex) {
            print("ex: " + ex);
            return "";
        }
    };

    funcStr = funcStr.replace(patt, evalFunc);

    return funcStr;
}


/**
 * processing string contains placeholder like: ${sm.name} and ${ep[\"street.home\"]}
 */
function processPlaceholder(sm, ep, param, context, str) {
    return evalJS(sm, ep, context, param, str);
}

function msg(msgnumber, args) {
    return msg1(msgnumber, "smis", args);
}

//TODO change the function name

function msg1(msgnumber, clazz, args) {

    var ret;

    if (args === undefined || args == null) {
        ret = funcs.scmsg(msgnumber, clazz);
    } else {
        ret = funcs.scmsg(msgnumber, clazz, args);
    }

    return ret == null ? "" : ret;
}

function trimStr(str) {
    if (typeof str != "string") {
        return str;
    }
    if (str == null || str == "") {
        return "";
    }

    return str.trim();
}

function isEmpty(str) {
    return str == undefined || str == null || str == "";
}

function smisPrint(content, file) {

    if (isEmpty(content) || (typeof(content)) != "string") {
        return;
    }

    if (isEmpty(file)) {
        print(content);
    } else {
        writeFile(file, "a", content + "\n");
    }
}


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 
 dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
 return: Saturday, June 9th, 2007, 5:46:21 PM
 m/dd/yy
 
 see: http://blog.stevenlevithan.com/archives/date-time-format
 */
var dateFormat = function() {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) {
                val = "0" + val;
            }
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function(date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date)) {
            throw new SyntaxError("invalid date");
        }

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                "d": d,
                "dd": pad(d),
                "ddd": dF.i18n.dayNames[D],
                "dddd": dF.i18n.dayNames[D + 7],
                "m": m + 1,
                "mm": pad(m + 1),
                "mmm": dF.i18n.monthNames[m],
                "mmmm": dF.i18n.monthNames[m + 12],
                "yy": String(y).slice(2),
                "yyyy": y,
                "h": H % 12 || 12,
                "hh": pad(H % 12 || 12),
                "H": H,
                "HH": pad(H),
                "M": M,
                "MM": pad(M),
                "s": s,
                "ss": pad(s),
                "l": pad(L, 3),
                "L": pad(L > 99 ? Math.round(L / 10) : L),
                "t": H < 12 ? "a" : "p",
                "tt": H < 12 ? "am" : "pm",
                "T": H < 12 ? "A" : "P",
                "TT": H < 12 ? "AM" : "PM",
                "Z": utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                "o": (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                "S": ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

function formatDate(date, format) {
    return dateFormat(date, format);
}

function task2Context(task, smisContext) {
    smisContext["object"] = task.object;
    smisContext["action"] = task.action;
    smisContext["internalId"] = task.internalId;
    smisContext["externalId"] = task.externalId;
    smisContext["direction"] = task.direction;
    smisContext["internalObject"] = task.internalObject;
    smisContext["externalReferences"] = task.externalReferences;
    smisContext["intId"] = task.intId;

    return smisContext;
}


/**
 * validate SMIS parameters
 *
 * @param {SCFile} configItem
 * @param {Array} mandatoryList
 * @param {String} msgClass
 * @returns {String}
 */
function validateSMISParams(configItem, mandatoryList, msgClass) {
    var missingCount = 0;

    var tempFieldList = "";
    var tempTranslateAnd = " " + funcs.scmsg("301", "ruleset") + " ";

    var i;
    for (i = 0; i < mandatoryList.length; i++) {
        var field = mandatoryList[i];
        var value = configItem.getConfigParameterValue(field);
        if (!value) {
            missingCount++;

            var caption = funcs.scmsg("caption;" + field, msgClass);

            if (tempFieldList == "") {
                tempFieldList = caption;
            } else {
                tempFieldList = tempFieldList.replace(tempTranslateAnd, ", ");
                tempFieldList += tempTranslateAnd + caption;
            }
        }
    }

    if (missingCount == 1) {
        return funcs.scmsg("1", "ruleset", [tempFieldList]);
    } else if (missingCount > 1) {
        return funcs.scmsg("9", "ruleset", [tempFieldList]);
    }

    return null;
}


/**
 * validate positive number SMIS parameters
 *
 * @param {SCFile} configItem
 * @param {String} field
 * @param {String} msgClass
 * @returns {String}
 */
function validatePositiveNumberSMISParams(configItem, field, msgClass) {
    var value = configItem.getConfigParameterValue(field);

    if (Number.isNaN(value) || value <= 0) {
        var caption = funcs.scmsg("caption;" + field, msgClass);
        return funcs.scmsg("2", "ruleset", [caption]);
    }

    return null;
}