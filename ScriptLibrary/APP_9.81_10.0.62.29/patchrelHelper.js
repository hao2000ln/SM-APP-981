var $ = lib.c.$;
var _msg = funcs.scmsg;

// APM logger
var logger = getLog("APM");

// log file path
var logFilePath = null;


function getVersionDate(version) {
    var vDate = new Date();
    return new XMLDate(vDate).getDatum();
}


function getBaseAppVersion() {
    // base app version that patch utility relies on
    return "9.80";
}


function getBaseAppVersionShort() {
    return "9.8";
}


function getAppVersionForDiff() {
    // base app version that patch from
    return "SM" + getBaseAppVersion();
}


function getBaseSignatureVersion() {
    // base signature version
    return "SM9.80.0015";
}


/**
 * Return sub package folder for upgrade utility
 * e.g. .../package/9.8/
 * 
 * @param	 {String}	the root path of upgrade utility
 * @returns {String} the path of the version package
 */
function getSubPackagePath(path) {
    var sep = lib.upgradeUtility.getPathSeperator();
    return lib.upgradeFolderCreation.addFileSeperator(path) + lib.upgradeFolderCreation.getPackageFolder() + sep + getBaseAppVersionShort() + sep;
}


function getSchemaChangeList() {
    var list = [
        // 1.special change, dbdict 'datadict' has been updated, which need to be put in the first place

        // 2.changes not shown in signature comparison, e.g. field length enlarge, field case.insensitive update
        "displayoption", "displayoptionrev", "extaccess",

        // 3.datadict change only, without dbdict change, especially for those have value set for new "reference.table" field
        "Approval", "svcCatCurrentApprovals", "svcQuote"
    ];

    var fPatches = new SCFile("smpatches", SCFILE_READONLY);
    fPatches.setFields("tag");

    /* 
     * Signature of dbdict is different in MSSQL and Oracle, even in different Oracle environment.
     * Signature compare works OK for previous APM build which uses MSSQL, but result unexpected in current Oracle for l10n APM build.
     * So compare add action only and hard code for update situation. 
     */
    //	var sql = 'filename="dbdict"';
    var sql = 'filename="dbdict" and action="add"';

    var rcPatches = fPatches.doSelect(sql);

    // loop smpatches records of dbdict
    while (rcPatches == RC_SUCCESS) {
        var filename = fPatches.tag.slice(7);

        if (!list.includes(filename)) {
            list.push(filename);
        }

        rcPatches = fPatches.getNext();
    }

    return list;
}


/**
 * Compare patch version
 *
 * @returns	{Number}
 *				<0, target version greater than current 	
 *				=0, target version same as current 	
 *				<0, target version less than current 	
 */
function comparePatchVersion(current, target) {

    if (current == getAppVersionForDiff()) {
        return -1;
    }

    // in case the current version is like 9.7x.xxxx PROD?
    if (current.indexOf(target) == 0) {
        return 0;
    }

    var v1 = getMajorMinorPatchVersion(current);
    var v2 = getMajorMinorPatchVersion(target);

    // current versions: 9.70.xxxx
    if (v1[0] == 9 && v1[1] == 70) {
        return -1;
    }

    if (v1[0] != v2[0]) {
        return v1[0] - v2[0];
    }

    return v1[1] - v2[1];
}


/**
 * Get major and minor version
 *
 * @param		{String}	version
 * @returns	{Array}		version array contains 2 elements, major version and minor version
 */
function getMajorMinorPatchVersion(version) {
    var major = 0;
    var minor = 0;

    // version example: 9.71.0001, return [9,71]
    var versions = version.split('.');
    if (versions.length >= 1) {
        major = Number(versions[0]);
    }
    if (versions.length >= 2) {
        minor = Number(versions[1]);
    }

    return [major, minor];
}


function cleanupVersion() {
    var fVersion = $("scversion").select("true").one();
    var strVersion = fVersion.application_version.slice(0, fVersion.application_version.indexOf("-"));

    fVersion.application_version = strVersion;
    fVersion.doUpdate();
}

function getAppPatchRelVersionMsg(bProd) {
    var fAppsVer = $("!scversion").fields("application.version").select("true").one();
    var versionMsg = "Application Version " + fAppsVer.application_version + " Build ";

    if (!bProd) {
        return versionMsg + lib.upgradeHelper.companyAbbreviation();
    } else {
        return versionMsg + "PROD";
    }
}

function getDtaPrefix() {
    return "PCHREL";
}

function addFileToTOC(strFileName) {
    var fPatchRelTOC = new SCFile("patchreltoc");
    fPatchRelTOC.name = strFileName;
    fPatchRelTOC.complete = false;
    fPatchRelTOC.doInsert();
}

function getNextFileFromTOC() {
    var fPatchRelTOC = new SCFile("patchreltoc", SCFILE_READONLY);
    var rc = fPatchRelTOC.doSelect("complete<>true");

    if (rc == RC_SUCCESS) {
        return fPatchRelTOC.name;
    }

    return null;
}

function setFileDoneInTOC(strFileName) {
    var fPatchRelTOC = new SCFile("patchreltoc");
    fPatchRelTOC.doSelect("name=\"" + strFileName + "\"");

    fPatchRelTOC.complete = true;
    fPatchRelTOC.doUpdate();
}


/**
 * create a folder (and its parent folder if parent folder is specified and not created yet.
 *
 * return 
 *	true, if the folder is created successfully;
 *	false, otherwise.
 */
function createFolder(folder) {
    if (makeDir(folder) == 0) {
        logger.info("Folder created: \"" + folder + "\".");
        return true;
    } else {
        logger.error("Folder creation failed for the folder: \"" + folder +
            "\". Please specify the right path or make suer that you have write access to this folder.");

        return false;
    }
}


/**
 * Files those need to handle tag specially
 *
 * @returns {Array}
 */
function getSpecialTagFiles() {
    return [
        "msMessageTemplate",
        "riskfactor",
        "riskgroup",
        "SurveyImage",
        "SurveyImageGroup",
        "svcSrcSurveyConfig",
        "svcAdvanceSearchConfig"
    ];
}


/**
 * Convert special tag
 *
 * @param {SCFile} file
 * @param {String} tag
 * @returns {String} 
 */
function handleSpecialTag(file, tag) {
    var filename = funcs.filename(file);

    // if the unique key is counter, change tag, the key is same as those defined in related signaturemake
    var list = getSpecialTagFiles();
    if (list.indexOf(filename) == -1) {
        return tag;
    }

    // the tag style is filename;value1;value2;... 
    var newtag = filename;

    var make = $("signaturemake", SCFILE_READONLY).setFields(["key"]).select("table.name=\"" + filename + "\"").uniqueResult();
    var key = make.key;

    var i;
    var length = key.length();
    for (i = 0; i < length; i++) {
        newtag += (";" + file[key[i]]);
    }

    return newtag;
}


/**
 * Convert special tag query
 *
 * @param {String} tagquery
 * @param {String} filename
 * @param {String} tag
 * @returns {String} 
 */
function handleSpecialTagQuery(tagquery, filename, tag) {
    // update erddef query sql, remove counter
    if (filename == "erddef") {
        var index = tagquery.indexOf(" and counter=");
        if (index > 0) {
            tagquery = tagquery.slice(0, index);
        }
    }

    /*
     * reset tag query
     *
     * the tag style is filename;value1;value2;...
     * rebuild the tagquery to key1=value1 and key2=value2 and...
     */
    var list = getSpecialTagFiles();
    if (list.indexOf(filename) == -1) {
        return tagquery;
    }

    var newquery = "";
    var values = tag.split(";");

    var make = $("signaturemake", SCFILE_READONLY).setFields(["key"]).select("table.name=\"" + filename + "\"").uniqueResult();
    var key = make.key;

    var i;
    var length = key.length();
    for (i = 0; i < length; i++) {
        if (i > 0) {
            newquery += " and ";
        }
        //TODO need to check field type is string
        newquery += (key[i] + "=\"" + values[i + 1] + "\"");
    }

    return newquery;
}


// special rename file list
var renameList = [
    ["activitySurveyDefinition", ["number", "thenumber"]],
    ["activitytype", ["activity.name"]],
    ["application", ["application"]],
    ["calendarFilterEditForm", ["id", "fieldId"]],
    ["calholidays", ["holiday"]],
    ["civisualizationdevice", ["uniqueID"]],
    ["cm3messages", ["event"]],
    ["colorindicatorsetting", ["field"]],
    ["currency", ["currency.code", "name"]],
    ["datadict", ["name", "sqlbasename"]],
    ["dbdict", ["name"]],
    ["devtype", ["device.name", "format.name"]],
    ["displayevent", ["id"]],
    ["displayoption", ["id"]],
    ["extaccess", ["object.name"]],
    ["gwPortalFormConfig", ["name", "company"]],
    ["help", ["term", "field.name", "file.name"]],
    ["htmltemplates", ["id", "name"]],
    ["idoladapter", ["category.group.name"]],
    ["idolDataFilter", ["ID"]],
    ["idolindex", ["index.id", "table.name"]],
    ["idolpbmhunter", ["database.name", "pbmhunter.id", "table.name"]],
    ["idolserverinfo", ["server.url"]],
    ["idolStopPhrase", ["Id"]],
    ["imArea", ["area.name"]],
    ["imCategory", ["name"]],
    ["imSubcategory", ["subcategory.name"]],
    ["inbox", ["inbox.id", "inbox.name"]],
    ["kmattachments", ["name"]],
    ["kmdoctype", ["name"]],
    ["kmprofile", ["id", "name"]],
    ["migrationSetting", ["name"]],
    ["msMessageTemplate", ["id", "name"]],
    ["notification", ["id", "name"]],
    ["riskfactor", ["id"]],
    ["riskgroup", ["id"]],
    ["schedule", ["name", "schedule.id"]],
    ["screlationtype", ["name", "value"]],
    ["sdprechatconfig", ["number", "company"]],
    ["secRights", ["role"]],
    ["settingsConfig", ["id"]],
    ["slacontrol", ["unique.key"]],
    ["smartsearchpreconditions", ["id"]],
    ["SurveyImage", ["id", "name"]],
    ["SurveyImageGroup", ["id", "name"]],
    ["SurveyParameterMapping", ["id", "module"]],
    ["SurveyRecipientMapping", ["id", "module"]],
    ["SurveyTemplate", ["id", "name"]],
    ["svcAdvanceSearchConfig", ["file.name"]],
    ["svcCatInterface", ["interface.name"]],
    ["svcSrcConfig", ["name", "screen.type"]],
    ["svcSrcSurveyConfig", ["dest.file.name", "id"]],
    ["taskPlannerFieldsDef", ["fileName", "taskCategoryName"]],
    ["timeperiodCalendarMapping", ["id", "tableName"]],
    ["timeperiodCategory", ["id", "name"]],
    ["unitofmeasure", ["unit.of.measure"]],
    ["Workflow", ["name"]],
    ["WorkflowPhase", ["phaseName", "workflowName"]]
];

/**
 * rename file according to the prefix
 *
 * @param {String}	file	original file
 * @param {String}	prefix	prefix for rename
 *
 * @returns {Number}
 *		0 rename successful for common files
 *		1 rename successful for special files
 *		-1 rename failed
 */
function rename(file, prefix) {
    var increase = lib.upgradeHelper.getNumberTypeFieldIncreaseValueForRename();

    var filename = funcs.filename(file);

    // special file
    var i;
    var j;
    for (i = 0; i < renameList.length; i++) {
        var table = renameList[i][0];
        var fields = renameList[i][1];

        if (filename == table) {
            for (j = 0; j < fields.length; j++) {
                var value = file[fields[j]];
                if (typeof value == 'number') {
                    file[fields[j]] += increase;
                } else // string
                {
                    file[fields[j]] = prefix + (value != null ? value : "");
                }
            }

            // RAD parameter panel
            if (filename == "application" && file.format == file.application) {
                file.format = prefix + file.format;
            }

            return 1;
        }
    }

    // normal file
    if (typeof file[0] == 'string') {
        file[0] = prefix + file[0];
        return 0;
    } else {
        error(_msg(125, "patchrel", [filename]));
        return -1;
    }
}


/**
 * Pre processing for patch application..
 * This function will be called in the Process patchrel.execute
 *
 * @param module, module name of the release package. "APM" for patch release, and all others for content release.
 */
function preProcessForPatch(module) {
    // clear patchrelstatus record first
    var status = $("patchrelstatus").select("true").uniqueResult();
    if (status) {
        status.doDelete();
    }

    // stop inactivity timer	
    stopInactivityTimer();

    // fix dbdict rcenv
    lib.upgradeCommonHelper.fixDbdictRcenv();

    // remove dbdict, for example, reportcache
    lib.upgradeCommonHelper.removeDbdicts();

    // fix system dirty data
    fixSystemData();

    if (module == null || module == "APM") {
        // update legacy codes
        var fcodes = $("codes").select('type="taskStatus" and value="closed"').uniqueResult();
        if (fcodes) {
            fcodes.value = "Closed";
            fcodes.doUpdate();
            debug(_msg(201, "object", ["codes", "taskStatus-closed"]));
        }
    }
    // Content Pack
    else {
        lib.ContentPackHelper.preProcessForPatch(module);
    }
}


/**
 * Fix system dirty data
 */
function fixSystemData() {
    // fix Counters
    lib.upgradeCommonHelper.fixCounters("APM");

    // fix numbers	
    lib.upgradeCommonHelper.fixNumbers("APM");

    // synchronize unique key
    lib.patchrelKeyChanges.synchronizeDatadictUniqueKey(true);
    lib.patchrelKeyChanges.synchronizeObjectUniqueKey(true);
}


/**
 * Refresh Data
 */
function refreshData() {}


/**
 * Create background schedules
 */
function createSchedules() {
    var scheduleObjs = {
        "adds": [],
        "updates": []
    };

    lib.upgradeCommonHelper.createSchedules(scheduleObjs, "APM");
}


/**
 * Post processing for patch application. Detailed post processing will be dependent on module.
 * This function will be called in the rad:sm.patchrel.apply.post.
 *
 * @param module, module name of the release package. "APM" for patch release, and all others for content release.
 */
function postProcessForPatch(module) {
    // fix system dirty data
    fixSystemData();

    if (module == null || module == "APM") {
        // refresh Data
        refreshData();

        // update special scmessages
        lib.upgradeCommonHelper.updateScMessages("APM");

        // create background schedules
        createSchedules();

        // expire globallists
        info(_msg(419, "upg"));
        lib.upgradeCommonHelper.expireGlobalLists("APM");
        info(_msg(420, "upg"));

        // deprecate legacy content packs		
        lib.upgradeCommonHelper.deprecateLegacyContentPack("APM");
    }
    // Content Pack
    else {
        lib.ContentPackHelper.postProcessForPatch(module);
    }
}


/**
 * Stop inactivity timer
 */
function stopInactivityTimer() {
    var info = lib.InactiveTimerSetup.getInfo();
    var process = info.process_start_infos;
    var status = process[0][1][0];

    if (status == "active") {
        lib.InactiveTimerSetup.stopInactiveTimer();
    }
}


/**
 * Post processing for load application data. Detailed post processing will be dependent on module.
 * This function will be called in the rad:sm.patchrel.wizard, between load data and process data
 *
 * @param module, module name of the release package. "APM" for patch release, and all others for content release.
 */
function postProcessLoadData(module) {
    if (module == null || module == "APM") {
        // clean kmknowledgebase data
        var dtaFile = getDtaPrefix() + "kmknowledgebase";
        if (lib.upgradeCommonHelper.isValidTable(dtaFile)) {
            $(dtaFile).select("true").iterate(function(record) {
                var objName = record["kbname"];

                // smpatches
                var tagName = "kmknowledgebase;" + objName;
                var query = 'tag="' + tagName + '"';
                $("smpatches").select(query).iterate(function(patch) {
                    patch.doDelete();
                    debug(_msg(203, "object", ["smpatches", tagName]));
                });

                // patchrelobjects
                var poName = "kmknowledgebase, " + objName;
                query = 'object.name="' + poName + '"';
                $("patchrelobjects").select(query).iterate(function(po) {
                    po.doDelete();
                    debug(_msg(203, "object", ["patchrelobjects", poName]));
                });

                // record
                record.doDelete();
                debug(_msg(203, "object", [dtaFile, objName]));
            });
        }
    }
}


/**
	convert the version string to a abbreviated one..
	
	@param version, the version string to be converted,
	@param type, the type of the abbreviated version used for.
	
	@return, a abbreviated version string.
						
	@author Liu,Yong-Liang
*/
function convertTargetVersion(version, type) {
    var versionarray = version.split(" ");
    if (versionarray.length > 1) {
        if (type == "history") {
            return lib.ContentPackHelper.getContentModuleShortName(versionarray[0]) + " " + versionarray[1];
        } else {
            return "CP" + lib.ContentPackHelper.getContentModuleShortName(versionarray[0]) + versionarray[1];
        }
    } else {
        return version;
    }
}


/**
	convert the version string to a abbreviated one..
	@param currentVersion, the current version string to be converted,	
	@param targetVersion, the target version string to be converted,
	@param type, the type of the abbreviated version used for.
	
	@return, a abbreviated version string.
						
	@author Liu,Yong-Liang
*/
function convertCurrentVersion(currentVersion, targetVersion, type) {
    if (currentVersion == "Not previously installed") {
        var versionarray = targetVersion.split(" ");
        if (versionarray.length > 1) {
            if (type == "history") {
                return lib.ContentPackHelper.getContentModuleShortName(versionarray[0]);
            } else {
                return "CP";
            }
        } else {
            if (type == "history") {
                return targetVersion;
            } else {
                return "AP";
            }
        }
    } else {
        return convertTargetVersion(currentVersion, type);
    }

}


function getDataForDiff(strFileName, strTargetQuery, strPrefix) {
    if (strTargetQuery == null) {
        return null;
    }

    //	print(strTargetQuery);

    var strSourceQuery = getSourceQueryForDiff(strFileName, strTargetQuery, strPrefix);
    //	print(strSourceQuery);

    var strSrc = lib.xmlHelpers.getXmlFromRecord(strFileName, strSourceQuery);
    var strTgt = lib.xmlHelpers.getXmlFromRecord(strFileName, strTargetQuery);

    if (strSrc == null) {
        return null;
    }

    strSrc = lib.xmlHelpers.removePrefixFromXML(strPrefix, strSrc.toXMLString());

    if (strSrc == null || strTgt == null) {
        return null;
    }

    var xmlDiff = new XML("mergedata");
    var xmlSrc = new XML("source");
    var xmlTgt = new XML("target");

    xmlSrc.setAttributeValue("name", strSourceQuery);
    xmlSrc.setText(strSrc.replace(/></g, ">\n<"));

    xmlTgt.setAttributeValue("name", strTargetQuery);
    xmlTgt.setText(strTgt.toXMLString().replace(/></g, ">\n<"));

    xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlSrc);
    xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlTgt);

    // Visualize 3-way upgrade merge inside SM instead of 3rd party tool kdiff3
    var baseVersion = getBaseAppVersionShort();
    var strAncestorName = lib.upgradeMerging.getOOBFileName(strFileName, strTargetQuery, baseVersion);
    var strAncestorXml = lib.upgradeMerging.getOOBFileXML(strFileName, strTargetQuery, baseVersion, lib.patchrelMerging.getFolder());

    if (strAncestorXml != null && strAncestorXml.length > 0) {
        var xmlAncestor = new XML("ancestor");
        xmlAncestor.setAttributeValue("name", 'name="' + strAncestorName + '"');
        xmlAncestor.setText(strAncestorXml.replace(/></g, ">\n<"));
        xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlAncestor);
    }

    return xmlDiff.toXMLString();
}


/**
 * Get source query for diff
 *
 * @param {String} strFileName
 * @param {String} strTargetQuery
 * @param {String} strPrefix
 * @returns {String}
 */
function getSourceQueryForDiff(strFileName, strTargetQuery, strPrefix) {
    if (strTargetQuery == null) {
        return false;
    }

    var strSourceQuery;

    if (strFileName == "format") {
        strSourceQuery = buildRenamedQueryOnFields(strTargetQuery, strPrefix, ["name"]);
    } else if (strFileName == "scmessage") {
        strSourceQuery = buildRenamedQueryOnFields(strTargetQuery, strPrefix, ["syslanguage"]);
    } else {
        var i;
        var match = false;
        for (i = 0; i < renameList.length; i++) {
            var table = renameList[i][0];
            if (table == strFileName) {
                strSourceQuery = buildRenamedQueryOnFields(strTargetQuery, strPrefix, renameList[i][1]);
                match = true;
                break;
            }
        }

        if (!match) {
            strSourceQuery = buildRenamedQuery(strTargetQuery, strPrefix);
        }
    }

    return strSourceQuery;
}


/**
 * Build renamed query
 *
 * param {String} strQuery
 * param {String} strPrefix
 * returns {String} renamed query
 */
function buildRenamedQuery(strQuery, strPrefix) {
    var iIndex = strQuery.indexOf("\"");

    var strFront;
    var strBack;

    // string type, field="value"
    if (iIndex >= 0) {
        strFront = strQuery.slice(0, iIndex + 1);
        strBack = strQuery.slice(iIndex + 1);

        return strFront + strPrefix + strBack;
    }
    // number type, field=value
    else {
        iIndex = strQuery.indexOf("=");
        strFront = strQuery.slice(0, iIndex + 1);
        strBack = strQuery.slice(iIndex + 1);
        strBack = parseInt(strBack, 10) + lib.upgradeHelper.getNumberTypeFieldIncreaseValueForRename();

        return strFront + strBack;
    }
}

function buildRenamedQueryOnFields(strQuery, strPrefix, strFields) {
    var query = strQuery;
    var i;
    for (i = 0; i < strFields.length; i++) {
        query = buildRenamedQueryOnField(query, strPrefix, strFields[i]);
    }
    return query;
}

function buildRenamedQueryOnField(strQuery, strPrefix, strField) {
    var subs = ["=\"", " = \""];
    var sub = subs[0];
    var i;
    var iIndex;

    for (i = 0; i < subs.length; i++) {
        iIndex = strQuery.indexOf(strField + subs[i]);
        if (iIndex >= 0) {
            sub = subs[i];
            break;
        }
    }

    var strFront;
    var strBack;
    if (iIndex >= 0) {
        strFront = strQuery.slice(0, iIndex + strField.length + sub.length);
        strBack = strQuery.slice(iIndex + strField.length + sub.length);
        strQuery = strFront + strPrefix + strBack;
    } else {
        iIndex = strQuery.indexOf("null(" + strField + ")");
        if (iIndex >= 0) {
            strFront = strQuery.slice(0, iIndex);
            strBack = strQuery.slice(iIndex + strField.length + 6);
            //			strQuery = strFront + strField + '="' + strPrefix + 'null"' + strBack;
            strQuery = strFront + strField + '="' + strPrefix + '"' + strBack;
        } else {
            // number field, e.g. id=100
            var regexp = new RegExp(strField + "=\\s*(\\d+)(?:$|\\s+)");
            var result = strQuery.match(regexp);
            if (result != null) {
                var replace = String(Number(result[1]) + lib.upgradeHelper.getNumberTypeFieldIncreaseValueForRename());
                var substr = result[0].replace(/\d+/, replace);
                strQuery = strQuery.replace(regexp, substr);
            }
        }
    }

    return strQuery;
}


function getCurrentVersionString() {
    var fVer = new SCFile("scversion", SCFILE_READONLY);
    fVer.doSelect(true);

    return fVer.application_version;
}

function getNameFromTOCFile(strTOCFilename) {
    var iIndex = strTOCFilename.indexOf(".dta");
    return strTOCFilename.slice(0, iIndex);
}

function saveMergeXML(strFileName, strTargetQuery, strMergeXML) {
    return lib.xmlHelpers.saveMergeXML(strFileName, strTargetQuery, strMergeXML);
}


function convertSelectedArray(fReturnArray, fStringArray) {
    if (fStringArray == null) {
        return;
    }

    var length = fStringArray.length();
    var i;
    for (i = 0; i < length; i++) {
        if (fStringArray[i] == "true" || fStringArray[i] == true) {
            fReturnArray.push(true);
        } else {
            fReturnArray.push(false);
        }
    }
}

function convertStringToArray(strInput, aOutput) {
    var aArray = strInput.split("!!");

    var i;
    for (i = 0; i < aArray.length; i++) {
        var value = aArray[i];
        if (value == "true") {
            aOutput.push(true);
        } else if (value == "false") {
            aOutput.push(false);
        } else {
            aOutput.push(aArray[i]);
        }
    }
}


function saveLangInfo() {
    var fPatchInfo = new SCFile("patchrelinfo");

    fPatchInfo.version = "SELECTED LANGUAGE";

    var i;
    var length = lib.ArrayUtil.length(vars.$wiz_selected);
    for (i = 0; i < length; i++) {
        fPatchInfo.lang_selected[i].selected = vars.$wiz_selected[i];
        fPatchInfo.lang_selected[i].language = vars.$wiz_language[i];
        fPatchInfo.lang_selected[i].language_code = vars.$wiz_codes[i];
    }

    fPatchInfo.doSave();
}


/**
 * Get all supported languages
 */
function getLanguages() {
    return ["ar", "cs", "de", "es", "fr", "he", "hu", "it", "ja", "ko", "nl", "pl", "pt-Br", "ru", "tr", "zh-Hans"];
}

/**
 * Get upgrade field value
 * @param table: the name of datadict
 * @param name: the name of the column
 * @param field: the value of the fields in the same row
 * @param value: the original value
 */
function getUpgradeFieldValue(table, name, field, value) {
    return lib.upgradeHelper.getUpgradeFieldValue(table, name, field, value);
}


/**
 * Purge Non-English Format Records For RAD Parameter Panels
 *
 * This function reads all the records in the code file and deletes 
 * the corresponding NON-ENGLISH (ie, syslanguage not "en") record(s) 
 * in the format file. The effect of this is that RAD applications 
 * should ONLY have an ENGLISH version of its parameter format.
 *
 * The reason for getting rid of these non-English parameter formats 
 * for RAD applications is because they cause confusion. For examle, 
 * say a RAD application is modified so that it now accepts a new 
 * parameter. When the RAD application is compiled, the RTE compiles 
 * ONLY the English version of the format, leaving the non-English 
 * parameter formats alone. Because of this, these formats are now 
 * obsolete (in fact, they are no longer valid because they are not 
 * aware of this new parameter).
 */
function purgeNonEnglishParameterFormat() {
    info(_msg(126, "patchrel"));

    lib.upgradeHelper.purgeNonEngRADFormat();
}


/**
 * Purge Patches records
 * This function is called before loading patchrel.mak
 *
 * @param {String} base 
 *		the name of patches record to be purged 
 */
function purgePatches(base) {
    var names = [base];
    if (base == "APM") {
        names.push("APM_PD");
        names.push("LanguagePack");
    }

    var rc;

    var i;
    for (i = 0; i < names.length; i++) {
        var name = names[i];
        var record = $("patches").select("name=\"" + name + "\"").uniqueResult();
        if (record != null) {
            rc = record.doDelete();
            if (rc == RC_SUCCESS) {
                debug(_msg(203, "object", ["patches", name]));
            } else {
                error(_msg(122, "patchrel", ["patches", name]));
            }
        }
    }

    // delete upgrade patches
    if (base == "APM") {
        $("patches").select("name#\"SM9\"").iterate(function(patches) {
            rc = patches.doDelete();
            if (rc == RC_SUCCESS) {
                debug(_msg(203, "object", ["patches", patches.name]));
            } else {
                error(_msg(122, "patchrel", ["patches", patches.name]));
            }
        });
    }
}


/**
 * Get post upgrade prompt message
 *
 * @param {String} module
 * @returns {String}
 */
function getPostUpgradePromptMessage(module) {
    if (module == null || module == "APM") {
        return lib.upgradeCommonHelper.getPostUpgradePromptMessage("APM");
    } else {
        return "";
    }
}


/**
 * Whether the record could skip during upgrade
 *
 * @param {String} type, object type
 * @param {String} name, object name
 * @returns {boolean}
 */
function isSkipUpgrade(type, name) {
    // The records of migrate category for wrapped PD will be skipped during upgrade

    // Interaction
    if (type == "imCategory") {
        return lib.ProcessDesignerEnablement.isMigratedWorkflowUsed("incidents", name);
    }
    // Incident
    else if (type == "sdCategory") {
        return lib.ProcessDesignerEnablement.isMigratedWorkflowUsed("probsummary", name);
    }

    return false;
}


/**
 * Check whether the smpatches record is language support
 *
 * @param	 {Array}  languages
 * @param	 {SCFile} smpatches record
 * @returns {Boolean}
 */
function isPatchRecordLanguegeSupport(langs, smpatches) {

    var tags;
    var lang;
    var filename = smpatches.filename;

    if (filename == "format" || filename == "scmessage") {
        tags = smpatches.tag.split(';');
        lang = tags[1];
        return lib.ArrayUtil.contains(langs, lang);
    } else if (filename == "help" || filename == "htmltemplates" || filename == "msMessageTemplate") {
        tags = smpatches.tag.split(';');
        lang = tags[tags.length - 1];
        return lib.ArrayUtil.contains(langs, lang);
    }

    return true;
}


/**
 * return default log file
 *
 * @returns {String}
 */
function getDefaultLogFile() {
    return "upgrade.log";
}


/**
 * print debug message
 */
function debug(msg) {
    detailLog(msg);
    logger.debug(msg);
}


/**
 * print information message
 */
function info(msg) {
    print(msg);

    detailLog(msg);
    logger.debug(msg);
}


/**
 * print error message
 */
function error(msg) {
    var rc = new SCDatum();
    funcs.rtecall("msg", rc, msg, 3);

    errorLog(msg);
    logger.warn(msg);
}


/**
 * write detail log
 *
 * @param {String} msg	-  The log statements
 */
function detailLog(msg) {
    var path = getLogPath();
    if (path == null || path.length == 0) {
        return;
    }

    writeLog(msg, path + "detail.log");
}


/**
 * write error log
 *
 * @param {String} msg	-  The log statements
 */
function errorLog(msg) {
    var path = getLogPath();
    if (path == null || path.length == 0) {
        return;
    }

    writeLog(msg, path + "except.log");
}


/**
 * get log message path
 *   
 * @return the log path. eg: apm package path.
 */
function getLogPath() {
    if (logFilePath != null) {
        return logFilePath;
    }

    var status = $("patchrelstatus", SCFILE_READONLY).select("true").uniqueResult();
    if (status && status.path != null && status.path.length > 0) {
        logFilePath = status.path + "logs" + lib.upgradeUtility.getPathSeperator();
        return logFilePath;
    }

    // try same folder as sm.log
    var defaultPath = lib.upgradeUtility.getRteLogPath();
    if (defaultPath != null && defaultPath.length > 0) {
        return defaultPath;
    }

    return null;
}


/**
 * write log function does same works like RAD: sm.patchrel.log
 *   
 * @param content  string -->  log content
 * @param logFile  string -->  log file name
 */
function writeLog(content, logFile) {
    var fullText = lib.upgradeCommonLib.formatDate(funcs.tod(), "yyyy-mm-dd HH:MM:ss") + " " + content + "\n";

    // write external log
    writeFile(logFile, 'a', fullText);
}


/**
 * Check if current build is a release build
 *
 * release version is like: 9.80.0015
 * daily build version is like: 1000.00.0000-SNAPSHOT
 *
 * @returns {Boolean}
 */
function isReleaseBuild() {
    var scversion = $("scversion", SCFILE_READONLY).select("true").uniqueResult();
    var version = scversion['application.version'];

    return checkReleaseBuild(version);
}


function checkReleaseBuild(version) {
    if (!version) {
        return false;
    }

    // 1. check string "SNAPSHOT"
    if (version.indexOf("SNAPSHOT") > 0) {
        return false;
    }

    // 2. check minor minor version
    var parts = version.split('.');
    return (parts.length == 3 && parts[2] != "0000");
}