var log = getLog("BaseUtil");
var $ = lib.c.$;

// max record number when searching for the max value on field of string type
var MAX_NUMBER = 1000;


/**
 * Synchronize all counter & number records
 */
function synchronizeCountersAndNumbers() {
    synchronizeCounters();
    synchronizeNumbers();
}


/**
 * Synchronize all counter records
 */
function synchronizeCounters() {
    // disable trigger to improve performance
    var triggerStatus = disableTrigger();

    $("counters").selectAll().iterate(function(counter) {
        debug('Synchronize counter "' + counter.table_name + '"...');
        var rc = synchronizeCounter(counter);
        if (rc == RC_ERROR) {
            error('Error occurred when synchronizing counters record "' + counter.table_name + '".');
        }
    });

    // enable trigger
    restoreTrigger(triggerStatus);
}


/**
 * Synchronize counter value according to the related records
 *
 * @param {SCFile}
 * @returns {Number}
 */
function synchronizeCounter(counter) {

    var table = counter.table_name;
    if (!isValidTable(table)) {
        return RC_NO_MORE;
    }

    // max number of records to check
    var recordCheck = 0;

    var updated = false;
    var oldValue = counter.current_value;

    var column = counter.column_name;
    var orders = [SCFILE_DSC];

    // order by counter column
    $(table, SCFILE_READONLY).setFields([column]).setOrderBy([column], orders).selectAll().iterate(function(record) {
        var value = record[column];

        // special for those which id type is string rather than number
        if (typeof value == 'string') {

            value = Number(value);
            if (value > counter.current_value) {
                counter.current_value = value.valueOf();
                updated = true;
            }

            // check MAX_NUMBER records at most, it will cause performance issue if record size is too large
            recordCheck++;
            if (recordCheck > MAX_NUMBER) {
                return true;
            }
        }
        // normal counters data error
        else {
            if (value > counter.current_value) {
                counter.current_value = value;
                updated = true;
            }
            return true;
        }
    });

    // update Counters record				
    if (updated) {
        info("change counters table: file name: " + table + ", number from " + oldValue + " to " + counter.current_value);
        return counter.doUpdate();
    }

    return RC_NO_MORE;
}


/**
 * Synchronize all number records
 */
function synchronizeNumbers() {
    // disable trigger to improve performance
    var triggerStatus = funcs.sysinfo_get("trigger");
    var ret = new SCDatum();
    funcs.rtecall("trigger", ret, 0);

    $("number").selectAll().iterate(function(number) {
        debug('Synchronize number "' + number.name + '"...');
        var rc = synchronizeNumber(number);
        if (rc == RC_ERROR) {
            error('Error occurred when synchronizing number record "' + number.name + '".');
        }
    });

    // enable trigger
    funcs.rtecall("trigger", ret, triggerStatus);
}


/**
 * Synchronize number value according to the related records
 *
 * @param {SCFile}
 * @returns {Number}
 */
function synchronizeNumber(number) {

    var name = number.name;
    var prefix = number.prefix;
    var suffix = number.suffix;
    var fileName = getNumberFileName(name);

    if (!isValidTable(fileName)) {
        return RC_NO_MORE;
    }

    var key = getNumberKeyField(fileName, prefix, suffix);
    if (!key) {
        return RC_NO_MORE;
    }

    var maxNumber = 0;
    if (prefix || suffix) {
        maxNumber = getMaxNumber(fileName, key, prefix, suffix);
    } else {
        maxNumber = getMaxNumberBySQL(fileName, key);
    }
    if (maxNumber && number.number >= 0 && number.number < maxNumber) {
        info("change number table: file name: " + fileName + ", number from " + number.number + " to " + maxNumber);
        number.number = maxNumber;
        return number.doUpdate();
    }

    return RC_NO_MORE;
}


function isValidTable(table) {
    var fdbdict = new SCFile("dbdict", SCFILE_READONLY);
    var rc = fdbdict.doSelect("name=\"" + table + "\"");
    return rc == RC_SUCCESS;
}


function getNumberFileName(numberName) {
    var obj = $("Object", SCFILE_READONLY).setFields(["file.name"]).select('number.record="' + numberName + '"').uniqueResult();
    if (obj != null) {
        return obj.file_name;
    }
    return numberName;
}


function getNumberKeyField(fileName, prefix, suffix) {
    var keys = funcs.dbdict_helper("unique.key", fileName);
    if (!keys || keys.length() == 0) {
        return null;
    }

    var jskey = keys.toArray();

    var record = $(fileName, SCFILE_READONLY).setFields(jskey).select("true").uniqueResult();
    if (record == null) {
        return null;
    }

    var i;
    for (i = 0; i < jskey.length; i++) {
        var key = jskey[i];
        var value = record[key];

        var isStrOrNum = (typeof value == "string") || (typeof value == "number");
        if (isStrOrNum && prefix && value.indexOf(prefix) == 0) {
            return key;
        }
        if (isStrOrNum && !prefix && !Number.isNaN(value)) {
            return key;
        }
    }

    return null;
}


function getMaxNumber(fileName, keyField, prefix, suffix) {
    var recordCheck = 0;
    var maxValue = 0;

    $(fileName, SCFILE_READONLY).setFields([keyField]).selectAll().iterate(function(file) {

        var tmpV = file[keyField];
        if (tmpV == null) {
            return false;
        }

        if (prefix) {
            tmpV = tmpV.substring(prefix.length);
        }

        if (suffix) {
            tmpV = tmpV.substring(0, tmpV.length - suffix.length);
        }

        if (typeof tmpV == "string") {
            tmpV = Number(tmpV).valueOf();
        }
        if (tmpV && maxValue < tmpV) {
            maxValue = tmpV;
        }

        // check MAX_NUMBER records at most, it will cause performance issue if record size is too large
        recordCheck++;
        if (recordCheck > MAX_NUMBER) {
            return true;
        }
    });

    return maxValue;
}


function getMaxNumberBySQL(fileName, numberField) {
    var file = new SCFile(fileName, SCFILE_READONLY);
    file.doSelect("select MAX(" + numberField + ") from " + fileName);
    return Number(file[0]).valueOf();
}


/**
 * Active language
 *
 * @param   {String} code
 * @returns {Number} return code
 */
function activeLanguage(code) {

    var query = 'unique.id="' + code + '"';
    var lan = $("language").select(query).uniqueResult();

    if (lan != null && !lan.active) {
        lan.active = true;
        return lan.doUpdate();
    }

    return RC_SUCCESS;
}


/**
 * Active languages
 * This function will be invoked by build script
 *
 * @param   {Object} codes, it could be Array or String which split by ','
 */
function activeLanguages(codes) {

    if (codes == null || codes.length == 0) {
        return;
    }

    if (typeof codes == "string") {
        codes = codes.split(",");
    }

    var i;
    var code;
    var rc;
    for (i = 0; i < codes.length; i++) {
        code = codes[i].replace(/\s+/g, "");
        rc = activeLanguage(code);
        if (rc == RC_SUCCESS) {
            info(funcs.scmsg(201, "object", ["language", code]));
        }
    }
}


/**
 * disable trigger
 * 
 * @returns {Number} trigger status before disable
 */
function disableTrigger() {
    var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", new SCDatum(), 0);

    return triggerStatus;
}


/**
 * restore trigger
 * 
 * @param {Number} triggerStatus
 */
function restoreTrigger(triggerStatus) {
    funcs.rtecall("trigger", new SCDatum(), triggerStatus);
}


function debug(msg) {
    log.debug(msg);
    //	print(msg);
}

function info(msg) {
    log.info(msg);
    //	print(msg);
}

function error(msg) {
    log.error(msg);
    //	var rc = new SCDatum();
    //	funcs.rtecall("msg", rc, msg, 3);
}

//QCCR1E159101, add general function to get Exit value with Return Code.
function getExitWithReturnCode(returnCode) {
    var exitStr = "";
    switch (returnCode) {
        case -1:
            exitStr = lib.BaseUtil_Constants.ERROR_EXIT();
            break;
        case 3:
            exitStr = lib.BaseUtil_Constants.CURRENTRECORD_LOCKED();
            break;
        case 9:
            exitStr = lib.BaseUtil_Constants.NO_RECORD_EXIT();
            break;
        case 28:
            exitStr = lib.BaseUtil_Constants.NO_AUTH();
            break;
        case 51:
            exitStr = lib.BaseUtil_Constants.CURRENTRECORD_CHANGED();
            break;
        case 70:
            exitStr = lib.BaseUtil_Constants.INVALID_ACTION();
            break;
        case 71:
            exitStr = lib.BaseUtil_Constants.BAD_VALIDATION_EXIT();
            break;

        default:
            exitStr = lib.BaseUtil_Constants.NORMAL_EXIT();
    }

    return exitStr;
}

function setExitType(type) {
    vars.$L_exit = type;
}

function setErrorMsg(msg) {
    vars.$L_jsmessage = msg;
}


/**
 * Show message box
 *
 * @param {String} message
 * @param {Number} type
 *      1:info; 2:warning; 3:error
 */
function ShowMessageBox(message, type) {
    if (vars.$G_bg) {
        switch (type) {
            case 2:
                log.warn(message);
                break;
            case 3:
                log.error(message);
                break;
            default:
                log.info(message);
        }
        return;
    }

    var params = {
        "text": message
    };

    if (type != null) {
        params.index = type;
    }

    $.callrad("mb.ok", params, true);
}


/**
 * Check whether current client is Windows client
 *
 * @returns {Boolean}
 */
function isWindowsClient() {
    return funcs.sysinfo_get("environment") == "scguiwswt";
}


/**
 * Check whether current client is Web client
 *
 * @returns {Boolean}
 */
function isWebClient() {
    return funcs.sysinfo_get("environment") == "scguiwweb";
}

/**
 * Call checkxss to check html enditor input content
 *
 * @returns {Object}
 */
function checkxss(value) {
    if (value == null) {
        return;
    }
    value = value.toArray().join(" ");
    var file = new SCFile("incidents");
    file.title = value;
    var msg = new SCDatum();
    system.functions.rtecall("checkxss", null, msg, file, true);
    return msg.getText();
}