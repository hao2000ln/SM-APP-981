var target_version = lib.upgradeConstants.TARGET_VERSION();
var sep = (funcs.version()[0] == "unix") ? "/" : "\\";

function getPathSeperator() {
    return sep;
}

function getStandardPath(path) {
    if (path == null) {
        return path;
    }

    if (path.charAt(path.length - 1) != sep) {
        path += sep;
    }

    return path;
}

/**
 * To get the record through the query in the specified table. Returns null if no records exists.
 */
function getRecord(table, query) {
    var file = new SCFile(table);
    var rc = file.doSelect(query);
    if (rc == RC_SUCCESS) {
        return file;
    }
    return null;
}

function getRecordCount(table, query) {
    if (!isDbdictExist(table)) {
        return 0;
    }

    var file = new SCFile(table, SCFILE_READONLY);
    var count = file.doCount(query);
    if (RC_ERROR == getLastRC()) {
        count = 0;
    }

    return count;
}

function isDbdictExist(name) {
    return getRecord("dbdict", "name=\"" + name + "\"") != null;
}

function getDatabaseTableName(dbdict_name) {
    var tablename = dbdict_name + "m1";
    tablename = tablename.toUpperCase();

    var dbdict = getRecord("dbdict", "name=\"" + dbdict_name + "\"");
    if (dbdict != null) {
        var i;
        var length = dbdict.sql_tables.length();
        for (i = 0; i < length; i++) {
            if (dbdict.sql_tables[i].sql_table_alias.toLowerCase() == "m1") {
                tablename = dbdict.sql_tables[i].sql_table_name;
                break;
            }
        }
    } else {
        return null;
    }

    return tablename;
}

function getUpgradeStatus() {
    return getRecord("upgradestatus", "true");
}

/**
 * To get the supported languages for creating upgrade package
 */
function getSupportedLanguages() {
    var history = new SCFile("upgradehistory", SCFILE_READONLY);
    var scverion = getRecord("scversion", "true");
    var rc = history.doSelect("new.version = \"" + scverion.application_version + "\"");
    var array = new SCDatum();
    array.setType(8);
    var codes = []; // This variable is only used for checking if the language has already existed in array.
    var element;

    if (rc == RC_SUCCESS) {
        while (rc == RC_SUCCESS) {
            var i;
            var length = history.upgraded_lang.length();
            for (i = 0; history.upgraded_lang != null && i < length; i++) {
                if (!isAlreadyIncluded(history.upgraded_lang[i].lang_code, codes)) {
                    element = new SCDatum();
                    element.setType(9);
                    element.push(true);
                    element.push(history.upgraded_lang[i].lang_name);
                    element.push(history.upgraded_lang[i].lang_code);
                    array.push(element);
                    codes[codes.length] = history.upgraded_lang[i].lang_code;
                }
            }
            rc = history.getNext();
        }
    } else {
        var language = new SCFile("language", SCFILE_READONLY);
        rc = language.doSelect("active=true and unique.id ~= \"en\"");
        while (rc == RC_SUCCESS && language != null) {
            if (lib.upgradeLanguage.isLanguageApplied(language["unique.id"])) {
                element = new SCDatum();
                element.setType(9);
                element.push(true);
                element.push(language.language);
                element.push(language.unique_id);
                array.push(element);
            }
            rc = language.getNext();
        }
    }
    return array;
}

function isAlreadyIncluded(code, codes) {
    if (code == null) {
        return true;
    }
    var i;
    for (i = 0; i < codes.length; i++) {
        if (codes[i] == code) {
            return true;
        }
    }
    return false;
}

function setUpgradeStatus(file) {
    var info = getRecord("upginfo", "true");
    var array = new SCDatum();
    array.setType(8);
    var i;
    var length = info.lang_selected.length();
    for (i = 0; i < length; i++) {
        var language = getRecord("language", "unique.id=\"" + info.lang_selected[i].language_code + "\" and active = true");
        var element = new SCDatum();
        element.setType(9);
        if (language == null) {
            element.push(false);
        } else {
            element.push(true);
        }
        element.push(info.lang_selected[i].language);
        element.push(info.lang_selected[i].language_code);
        array.push(element);
    }
    file.lang_selected = array;
}

function getLangCount(status) {
    var langs = status.lang_selected;
    var count = 0;
    var i;
    var length = langs.length();
    for (i = 0; i < length; i++) {
        if (langs[i].selected) {
            count++;
        }
    }
    return count;
}

function addInstalledLang(status, history) {
    history.upgraded_lang = funcs._delete(history.upgraded_lang, 1);
    var i;
    var slength = status.lang_selected.length();
    for (i = 0; i < slength; i++) {
        if (status.lang_selected[i].selected) {
            var length = history.upgraded_lang.length();
            history.upgraded_lang[length].lang_code = status.lang_selected[i].language_code;
            history.upgraded_lang[length].lang_name = status.lang_selected[i].language;
        }
    }
}

// Fetch the count of the upgrade utility data file from upginfo for language
function getFileCountFromInfo(info, filename, language) {
    if (language == null || language.length == 0) {
        language = "en";
    }

    var fieldname = "data.file.lang";

    var length = funcs.lng(info[fieldname]);
    var i;
    for (i = 0; i < length; i++) {
        if (info[fieldname][i]["file.language.code"] == language && info[fieldname][i]["file.name"] == filename) {
            return info[fieldname][i]["file.count"];
        }
    }

    return 0;
}

// Return the sum of data file for all selected languages
function getFileCountFromInfoForLanguages(info, filename, languages) {
    if (languages == null || languages.length == 0) {
        return 0;
    }

    var count = 0;
    var length = funcs.lng(languages);
    var i;

    for (i = 0; i < length; i++) {
        count += getFileCountFromInfo(info, filename, languages[i]);
    }

    return count;
}

// Fetch the count of the upgrade utility inf file from upginfo for language
function getInfCountFromInfo(info, language) {
    if (language == null || language.length == 0) {
        language = "en";
    }

    var fieldname = "upgrade.inf.lang";

    var length = funcs.lng(info[fieldname]);
    var i;

    for (i = 0; i < length; i++) {
        if (info[fieldname][i]["inf.language.code"] == language) {
            return info[fieldname][i]["inf.count"];
        }
    }

    return 0;
}

/**
get last version before upgrade to 930.

return the version variable.

@author Li, Huan
*/
function getLatestVersionB4UpgradeTo930() {
    var ret = target_version;
    var fData = new SCFile("upgradehistory", SCFILE_READONLY);
    var query = "old.version<>\"" + ret + "\" and new.version=\"" + ret + "\"";
    var rc = fData.doSelect(query);
    if (rc == RC_SUCCESS) {
        ret = fData.old_version;
    }
    return ret;
}

/**
 * Upgraded languages are stored in upgradehistory table, they sometimes may be duplicated or re-upgraded.
 * We originally use this to display upgraded languages in re-run wizard.
 * Author: Wang Weihua
 */
function getUpgradedLang() {
    if (vars.$G_tmpUpgToVer == null) {
        return null;
    }
    var langs = "";
    var history = new SCFile("upgradehistory", SCFILE_READONLY);
    var rc = history.doSelect("new.version = \"" + vars.$G_tmpUpgToVer + "\"");
    while (rc == RC_SUCCESS) {
        var i;
        var length = history.upgraded_lang.length();
        for (i = 0; history.upgraded_lang != null && i < length; i++) {
            if (langs.indexOf(history.upgraded_lang[i].lang_name) == -1 && history.upgraded_lang[i].lang_name != null) {
                if (langs != "") {
                    langs += ", ";
                }
                langs += history.upgraded_lang[i].lang_name;
            }
        }
        rc = history.getNext();
    }
    return langs;
}

/**
 * To determine if it is in rerun process
 */
function isRerun() {
    var history = getRecord("upgradehistory", "new.version = \"" + vars.$G_tmpUpgToVer + "\"");
    if (history == null) {
        return false;
    }
    return true;
}


/**
 * Tests whether the file or directory denoted by this path name exists.
 *
 * @param {String} path
 * @param {int} mode
 *          0 - default, both file and directory
 *          1 - file
 *          2 - directory
 * @returns {Boolean)
 */
function fileExists(path, mode) {
    if (mode == null) {
        mode = 0;
    }
    return funcs.isfileexist(path, mode);
}


/**
 * Tests if the string ends with the specified suffix.
 *
 * @param {String} str
 * @param {String} ends
 * @returns {Boolean}
 */
function endsWith(str, ends) {
    if (ends === '') {
        return true;
    }

    if (str == null || ends == null) {
        return false;
    }

    str = String(str);
    ends = String(ends);
    return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
}


/**
 * Tests whether the file denoted by this path is a normal file.
 *
 * @param {String} path
 * @returns {Boolean)
 */
function isFile(path) {
    if (path == null || path.length == 0) {
        return false;
    }

    if (endsWith(path, sep)) {
        return false;
    }

    return fileExists(path, 1);
}


/**
 * Tests whether the file denoted by this path is a directory.
 *
 * @param {String} path
 * @returns {Boolean)
 */
function isDirectory(path) {
    if (path == null || path.length == 0) {
        return false;
    }

    return fileExists(path, 2);
}


/**
 * Get upgrade type according to the path
 *
 * @param {String} path
 * @returns {String} upgrade type, APM, Upgrade or Unknown
 */
function getUpgradePathType(path) {
    // get the standard directory
    var spath = getStandardDirectory(path);
    if (spath == null || spath.length == 0 || !fileExists(spath)) {
        return "Unknown";
    }

    var patchFiles = [
        "patchrel.unl",
        "patchrel.txt",
        "patchrel.mak"
    ];

    var upgradeFiles = [
        "upgrade.inf",
        "upgrade.mak",
        "upgrade.str"
    ];

    var i;
    for (i = 0; i < patchFiles.length; i++) {
        if (fileExists(spath + patchFiles[i])) {
            return "APM";
        }
    }

    for (i = 0; i < upgradeFiles.length; i++) {
        if (fileExists(spath + upgradeFiles[i])) {
            return "Upgrade";
        }
    }

    return "Unknown";
}


/**
 * Get standard directory according to the path
 *
 * @param {String} path
 * @returns {String} standard directory ends with "/" or "\"
 */
function getStandardDirectory(path) {
    if (path == null) {
        return null;
    }

    // directory
    if (isDirectory(path)) {
        return getStandardPath(path);
    }

    // file
    if (path.indexOf(sep) >= 0) {
        return path.substring(0, path.lastIndexOf(sep) + 1);
    }

    return null;
}

function getMissedDataFiles(path) {
    var fileList = [];
    var dataFolder = lib.upgradeFileHelper.getDataFolder();
    var subPackagePath = getSubPackagePath(path);
    var dataPath = subPackagePath + sep + dataFolder;
    if (!isDirectory(dataPath)) {
        fileList.push(dataFolder);
    } else {
        var dbdict = getRecord("dbdict", "name=\"upgradetoc\"");
        if (dbdict != null) {
            var upgradetoc = new SCFile("upgradetoc", SCFILE_READONLY);
            upgradetoc.setFields(["name"]);
            var query = "pd.enabled=" + lib.upgradePDMigration.isUpgradeToPD();
            var rc = upgradetoc.doSelect(query);
            while (rc == RC_SUCCESS) {
                var dataFile = dataFolder + sep + upgradetoc["name"];
                if (!isFile(subPackagePath + sep + dataFile)) {
                    fileList.push(dataFile);
                }
                rc = upgradetoc.getNext();
            }
        }
    }
    return fileList;
}


/**
 * Return RTE log directory defined in sm.ini
 *
 * @returns	{String}
 */
function getRteLogPath() {

    //	var path = lib.rtecallUtil.getRTEParameter("log");
    var path = getRTEParm("log");
    if (path == null || path.indexOf("ERROR:") == 0) {
        return "../logs/";
    }

    if (path.indexOf("/") >= 0) {
        return path.substring(0, path.lastIndexOf("/") + 1);
    } else if (path.indexOf("\\") >= 0) {
        return path.substring(0, path.lastIndexOf("\\") + 1);
    }

    return "../logs/";
}

/**
 * Parameter path: the root path of upgrade utility
 * Parameter isApply: whether apply or create. Null means create by default.
 * return the path of the version package
 */
function getSubPackagePath(path, isApply) {
    if (path == null) {
        return null;
    }
    return lib.upgradeFolderCreation.addFileSeperator(path) + lib.upgradeFolderCreation.getPackageFolder() + sep + lib.upgradeFolderCreation.getVersionFolder(isApply) + sep;
}

/**
 * Parameter path: the root path of upgrade utility
 * return the path of logs and create it if not exists.
 */
function getLogPath(path) {
    var logpath = lib.upgradeFolderCreation.addFileSeperator(path) + "logs" + sep;
    if (!isDirectory(logpath)) {
        if (0 != makeDir(logpath)) {
            return path;
        }
    }

    vars.$G_UpgradeLogPath = logpath;
    return logpath;
}


function getLightScriptName() {
    return "upgradeLight";
}

function isLightUpgrade() {
    var lightScript = getLightScriptName();
    if (lib[lightScript] != null && lib[lightScript].isLight != null) {
        return lib[lightScript].isLight();
    }
    return false;
}

function isDumpDataLight(table, sql) {
    var lightScript = getLightScriptName();
    if (lib[lightScript] != null && lib[lightScript].isDumpDataLight != null) {
        return lib[lightScript].isDumpDataLight();
    }

    if (table != null) {
        return allowDumpDataLight(table, sql);
    }

    return false;
}

function allowDumpDataLight(table, sql) {
    if (table == null || table == "") {
        return false;
    }

    if (sql == null || sql == "") {
        sql = "true";
    }

    var TABLES_DUMP_LIGHT = ["RAD", "format", "scmessage", "help", "htmltemplates", "unitofmeasure", "msMessageTemplate"];
    var TABLES_DUMP_ALL = ["imArea", "imCategory", "imSubcategory", "pbmArea", "pbmategory", "pbmSubcategory", "sdArea", "sdCategory", "sdSubcategory",
        "Workflow", "WorkflowPhase", "Object", "States", "Process", "scmandant", "ScriptLibrary", "settings", "AlertDef", "link",
        "trigger", "displayoption"
    ];
    var TABLES_DUMP_TENTATIVE = ["OOFlowConfiguration", "ticketContext"];

    var THRESHOLD_PERCENT = 0.6;

    if (lib.ArrayUtil.contains(TABLES_DUMP_LIGHT, table)) {
        return true;
    }

    var upgradeToHybrid = true;
    var status = getRecord("upgradestatus", "true");
    if (status != null) {
        var fromVersion = status["current.version"];
        var pdVersion = lib.upgradeVersionUtil.getPdVersion(fromVersion);
        if (pdVersion == "PDCP4" || pdVersion == "PD") {
            upgradeToHybrid = false;
        }
    }

    if (upgradeToHybrid && lib.ArrayUtil.contains(TABLES_DUMP_ALL, table)) {
        return false;
    }

    if (!upgradeToHybrid || lib.ArrayUtil.contains(TABLES_DUMP_TENTATIVE, table)) {
        var query1 = "object.type=\"" + table + "\" and result~=\"Already Current\"";
        var query2 = sql;
        var count1 = getRecordCount("upgraderesults", query1);
        var count2 = getRecordCount(table, query2);

        if (count2 > 0 && count2 * THRESHOLD_PERCENT >= count1) {
            return true;
        }
    }

    return false;
}


// When build classic upgrade during CM build, do NOT dump other file (RAD apm.upgrade.build.other)
// For example, preupg.bin, DeltaMigrationTool.unl, etc.
function allowDumpOtherFiles() {
    if (vars["$G.build"] == true && !isLightUpgrade()) {
        return false;
    }

    return true;
}

// When build light upgrade, do not dump AppUpgVersion.txt in RAD apm.upgrade.build.process
function allowDumpVersionTextFile() {
    return !allowDumpOtherFiles();
}