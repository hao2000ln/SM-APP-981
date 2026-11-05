var arraySMLangCodes = ["ar", "be", "bg", "br", "ca", "cs", "cy", "da", "de", "el", "en", "es", "et", "fi", "fr", "hr", "hu", "is", "it", "iw", "ja", "ko", "lt", "lv", "mk", "mt", "nb", "nl", "no", "pl", "pt", "ro", "ru", "sh", "sk", "sl", "sq", "sr", "sv", "tr", "uk", "z2", "z3", "zh-Hans", "zh-Hant"];
var arrayKMLangCodes = ["ar", null, "bg", "br", null, "cs", "cy", "da", "de", "el", "en", "es", "et", "fi", "fr", null, "hu", "is", "it", null, "ja", "ko", "lt", "lv", null, "mt", "nb", null, null, "pl", "pt", "ro", "ru", null, "sk", "sl", null, null, "sv", "tr", null, "th", null, "zh", "zt"];

var datadictUpgrade = [{
        "table": "cirelationship",
        "names": [{
            "name": "captions",
            "values": [{
                    "field": "logical.name",
                    "oobValue": "Logical Name",
                    "upgradeValue": "Upstream CI"
                },
                {
                    "field": "related.cis",
                    "oobValue": "Related Cis",
                    "upgradeValue": "Downstream CIs"
                }
            ]
        }]
    },
    {
        "table": "cm3r",
        "names": [{
            "name": "captions",
            "values": [{
                    "field": "implementationStart",
                    "oobValue": "Actual Implementation Start",
                    "upgradeValue": "Implementation Start"
                },
                {
                    "field": "implementationEnd",
                    "oobValue": "Actual Implementation End",
                    "upgradeValue": "Implementation End"
                }
            ]
        }]
    },
    {
        "table": "cm3t",
        "names": [{
            "name": "captions",
            "values": [{
                "field": "sla.breach",
                "oobValue": "SLT Breached",
                "upgradeValue": "SLA Breached"
            }]
        }]
    },
    {
        "table": "device",
        "names": [{
                "name": "captions",
                "values": [{
                        "field": "assignment",
                        "oobValue": "Assignment",
                        "upgradeValue": "Config Admin Group"
                    },
                    {
                        "field": "device.severity",
                        "oobValue": "Device Severity",
                        "upgradeValue": "Vital Business Function"
                    },
                    {
                        "field": "display.name",
                        "oobValue": "Display Name",
                        "upgradeValue": "Configuration Item Name"
                    },
                    {
                        "field": "istatus",
                        "oobValue": "Istatus",
                        "upgradeValue": "Status"
                    },
                    {
                        "field": "sm.device.display.name",
                        "oobValue": "Sm Device Display Name",
                        "upgradeValue": "Display Name"
                    }
                ]
            },
            {
                "name": "avail",
                "values": [{
                    "field": "id",
                    "oobValue": true,
                    "upgradeValue": false
                }]
            }
        ]
    },
    {
        "table": "extensionstate",
        "names": [{
            "name": "mandatory",
            "values": [{
                "field": "extension",
                "oobValue": false,
                "upgradeValue": true
            }]
        }]
    },
    {
        "table": "probsummary",
        "names": [{
                "name": "sysFieldType",
                "values": [{
                    "field": "problem.status",
                    "oobValue": 2,
                    "upgradeValue": 1
                }]
            },
            {
                "name": "avail",
                "values": [{
                    "field": "kpf.id",
                    "oobValue": false,
                    "upgradeValue": true
                }]
            }
        ]
    },
    {
        "table": "rootcause",
        "names": [{
            "name": "captions",
            "values": [{
                "field": "workaround",
                "oobValue": "Suggested Workaround",
                "upgradeValue": "Workaround"
            }]
        }]
    },
    {
        "table": "sdCategory",
        "names": [{
            "name": "captions",
            "values": [{
                "field": "escalate.type",
                "oobValue": "Escalate Type",
                "upgradeValue": "Fulfillment Process"
            }]
        }]
    },
    {
        "table": "svcCatalog",
        "names": [{
            "name": "readonly",
            "values": [{
                "field": "name",
                "oobValue": true,
                "upgradeValue": null
            }]
        }]
    },
    {
        "table": "Workflow",
        "names": [{
            "name": "captions",
            "values": [{
                    "field": "is.legacy.workflow",
                    "oobValue": "Is Legacy Workflow",
                    "upgradeValue": "Is Migrated Workflow"
                },
                {
                    "field": "legacy.fc",
                    "oobValue": "Legacy Fc",
                    "upgradeValue": "Legacy Format Control"
                },
                {
                    "field": "optimize.autotran.save",
                    "oobValue": "Optimize Autotran Save",
                    "upgradeValue": "Optimize Save of Automatic-Transition"
                }
            ]
        }]
    }
];

function updateKMIDCodes() {
    var fLanguage = new SCFile("language");
    var rc = fLanguage.doSelect(true);

    while (rc == RC_SUCCESS) {
        var x;
        for (x = 0; x < arraySMLangCodes.length; x++) {
            if (arraySMLangCodes[x] == fLanguage.unique_id) {
                if (arrayKMLangCodes[x] != fLanguage.km_id) {
                    fLanguage.km_id = arrayKMLangCodes[x];
                    fLanguage.doUpdate();
                }
                x = arraySMLangCodes.length;
            }
        }
        rc = fLanguage.getNext();
    }
}

function setBuildNumber(iBuildNumber) {
    iBuildNumber--; //The number that goes into the number file is the LAST build number
    var fBuildNumber = new SCFile("number");
    fBuildNumber.doSelect("name=\"upgrade build\"");
    fBuildNumber.number = iBuildNumber;
    fBuildNumber.doUpdate();
}

function setSCVersion() {
    var fSCVersion = new SCFile("scversion");
    fSCVersion.doSelect(true);

    var strVersion = fSCVersion.application_version.slice(0, fSCVersion.application_version.indexOf("-"));

    fSCVersion.application_version = strVersion;
    fSCVersion.doUpdate();
}

function setSignaturemake() {
    var aRecords = ["application", "datadict", "displaymaster", "enclapplication", "enclapplrev", "sqlhints", "sqlsystemtables"];

    var fSignaturemake = new SCFile("signaturemake");
    var rc;

    var x;
    for (x = 0; x < aRecords.length; x++) {
        rc = fSignaturemake.doSelect("table.name=\"" + aRecords[x] + "\"");

        if (rc == RC_SUCCESS) {
            fSignaturemake.sql = "false";
            fSignaturemake.doUpdate();
        }
    }
}

function cleanupSCmsg() {
    var fSCMsg = new SCFile("scmessage");
    var rc = fSCMsg.doSelect("syslanguage<>\"en\"");

    while (rc == RC_SUCCESS) {
        fSCMsg.doDelete();
        rc = fSCMsg.getNext();
    }
}

function getAppUpgVersionMsg(strBuildNumber) {
    var fUpgVerBld = new SCFile("upgverbld", SCFILE_READONLY);
    fUpgVerBld.doSelect(true);

    //We're holding onto this code for future SM development builds
    /*var fAppsVer=new SCFile("scversion");
    fAppsVer.doSelect(true);
    
    var strAppBuildNumber = fAppsVer.application_version + "." + fAppsVer.build_no; 
    
    return fUpgVerBld.name + " (Apps Build " + strAppBuildNumber + ") v" + fUpgVerBld.version + " Upgrade Build " + strBuildNumber + " E";*/
    var buildname = "";
    var values = fUpgVerBld.name.split("-");
    if (values != null) {
        var i;
        for (i = 0; i < values.length; i++) {
            if (i == 0) {
                buildname += "SM" + lib.upgradeVersionUtil.getShortFullMajorMinorVersion(lib.upgradeVersionUtil.getFixedStartVersion());
            } else {
                buildname += "-" + values[i];
            }
        }
    }

    if (buildname.length == 0) {
        buildname = fUpgVerBld.name;
    }

    var version = lib.upgradeVersionUtil.getFullMajorMinorVersion(fUpgVerBld.version) + "." + lib.upgradeVersionUtil.getPatchVersion(fUpgVerBld.version);

    //return buildname + " v" + fUpgVerBld.version + " Upgrade Build " + strBuildNumber;
    return "Application Version " + version + " Build " + companyAbbreviation() + "\n" +
        "Upgrade Utility " + buildname;
}


/**
 * return company abbreviation
 *
 * @returns {String}
 */
function companyAbbreviation() {
    // OpenText
    return "OT";
}

// This function copies the data in description field to the new detailedDescription field in svcCatalog table 
function svcCatalog_moveDescToDetailedDesc() {
    var fCatalog = new SCFile("svcCatalog");
    var rc = fCatalog.doSelect("type<>\"category\"");

    while (rc == RC_SUCCESS) {
        var strDesc = fCatalog.description;
        var regExp = /\n/g;

        strDesc = strDesc.replace(regExp, "<br>");
        fCatalog.detailedDescription = strDesc;

        fCatalog.doUpdate();

        rc = fCatalog.getNext();
    }
}

// This function renames the attachments associated to the service catalog from svcCatalog to joinsvcDisplay
function svcCatalog_renameSYSATTACHMENTS() {
    var ret = 0;
    funcs.rtecall("trigger", ret, 0);
    var sql = "application=\"svcCatalog\" and type=3";
    var image = new SCFile("SYSATTACHMENTS");
    if (image.doSelect(sql) == RC_SUCCESS) {
        do {
            image.application = "joinsvcDisplay";
            // avoid duplicate key error QCCR1E64082
            if (notExistSYSA(image)) {
                image.doUpdate();
            }
        }
        while (image.getNext() == RC_SUCCESS);
    }

    funcs.rtecall("trigger", ret, 1);
}

function notExistSYSA(image) {
    // handler special character
    var topic = lib.upgradeCommonLib.replaceSpecialCharacter(image.topic);

    var sql = "application=\"" + image.application + "\" and type=3";
    sql += image.segment == null ? " and null(segment)" : " and segment=" + image.segment;
    sql += image.uid == null ? " and null(uid)" : " and uid=\"" + image.uid + "\"";
    sql += topic == null ? " and null(topic)" : " and topic=\"" + topic + "\"";

    image = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
    image.setFields(["topic"]);
    return (image.doSelect(sql) != RC_SUCCESS);
}

function fixApprovalDef() {
    var fApprovalDef = new SCFile("ApprovalDef");
    var rc = fApprovalDef.doSelect("name=\"Service Catalog Approval\"");

    if (rc == RC_SUCCESS) {
        fApprovalDef.doDelete();
        fApprovalDef = new SCFile("ApprovalDef");
    }

    fApprovalDef.name = "Service Catalog Approval";
    fApprovalDef.appr_condition = true;
    fApprovalDef.doInsert();
}

function isFileInTOC(strFileName) {
    var isUpgradeToPD = lib.upgradePDMigration.isUpgradeToPD();
    var file = lib.upgradeUtility.getRecord("upgradetoc", "name=\"" + strFileName + "\" and pd.enabled=" + isUpgradeToPD);

    return (file != null);
}

function addFileToTOC(strFileName) {
    if (isFileInTOC(strFileName)) {
        return;
    }

    var isUpgradeToPD = lib.upgradePDMigration.isUpgradeToPD();
    var fUpgTOC = new SCFile("upgradetoc");
    fUpgTOC.name = strFileName;
    fUpgTOC.complete = false;
    fUpgTOC.pd_enabled = isUpgradeToPD;
    fUpgTOC.doInsert();
}

function setCompleteForRerun(status) {
    var isUpgradeToPD = lib.upgradePDMigration.isUpgradeToPD();
    var toc = new SCFile("upgradetoc");
    var rc;
    var i;
    var j;
    var length = status.lang_selected == null ? 0 : status.lang_selected.length();
    var localizeTables = lib.upgradeLanguage.getLocalizeTables();
    if (localizeTables == null || localizeTables.length == 0) {
        return;
    }

    var names = "";
    for (i = 0; i < length; i++) {
        if (status.lang_selected[i].selected) {
            if (names.length > 0) {
                names += ",";
            }

            for (j = 0; j < localizeTables.length; j++) {
                if (j > 0) {
                    names += ",";
                }
                names += "\"upgrade" + localizeTables[j].table + "-" + status.lang_selected[i].language_code + ".dta\"";
            }
        }
    }
    var namesSql = "~(name isin {" + names + "})";

    var subsql = "";
    for (j = 0; j < localizeTables.length; j++) {
        if (j > 0) {
            subsql += " or ";
        }

        subsql += "name#\"upgrade" + localizeTables[j].table + "-\"";
    }
    if (subsql.length > 0) {
        subsql = "(" + subsql + ")";
    }

    var sql;
    /*
     * Before, upgrade allows to upgrade some languages at the first time and then run upgrade again for the rest languages. 
     * It means rerun - see upgradeUtility.isRerun
     * Now the mode is disabled so $G.isRerun will not be set. 
     * Here just keep the same result after refactor.
     */
    if (vars.$G_isRerun) {
        sql = namesSql;
    } else {
        sql = subsql + (names.length > 0 ? " and " + namesSql : "");
    }
    sql += " and pd.enabled=" + isUpgradeToPD;

    rc = toc.doSelect(sql);
    while (rc == RC_SUCCESS) {
        toc.complete = true;
        toc.doUpdate();
        rc = toc.getNext();
    }
}

function getNextFileFromTOC() {
    var isUpgradeToPD = lib.upgradePDMigration.isUpgradeToPD();
    var fUpgTOC = new SCFile("upgradetoc", SCFILE_READONLY);
    fUpgTOC.setFields(["name"]);
    var rc = fUpgTOC.doSelect("complete<>true and pd.enabled=" + isUpgradeToPD);

    if (rc == RC_SUCCESS) {
        return fUpgTOC.name;
    }

    return null;
}

function setFileDoneInTOC(strFileName) {
    var isUpgradeToPD = lib.upgradePDMigration.isUpgradeToPD();
    var fUpgTOC = new SCFile("upgradetoc");
    fUpgTOC.doSelect("name=\"" + strFileName + "\" and pd.enabled=" + isUpgradeToPD);

    fUpgTOC.complete = true;
    fUpgTOC.doUpdate();
}


function getDataForDiff(strFileName, strTargetQuery, strPrefix) {
    var strSourceQuery;
    strSourceQuery = buildRenamedQuery(strFileName, strTargetQuery, strPrefix);

    var srcObj = lib.upgradeUtility.getRecord(strFileName, strSourceQuery);
    var tgtObj = lib.upgradeUtility.getRecord(strFileName, strTargetQuery);

    if (srcObj == null) {
        vars.$jserror_file = strFileName;
        vars.$jserror_query = strSourceQuery;
        return null;
    }

    if (tgtObj == null) {
        vars.$jserror_file = strFileName;
        vars.$jserror_query = strTargetQuery;
        return null;
    }

    removePrefixFromNumberFields(strFileName, tgtObj, srcObj);

    var strSrc = srcObj.getXml();
    var strTgt = tgtObj.getXml();

    //var strSrc 	= lib.xmlHelpers.getXmlFromRecord( strFileName, strSourceQuery );
    //var strTgt 	= lib.xmlHelpers.getXmlFromRecord( strFileName, strTargetQuery );

    //QCCR1E72259 - Visualize 3-way upgrade merge inside SM instead of 3rd party tool kdiff3
    var strAncestorName = lib.upgradeMerging.getOOBFileName(strFileName, strTargetQuery);
    var strAncestorXml = lib.upgradeMerging.getOOBFileXML(strFileName, strTargetQuery);

    strAncestorName = "name=\"" + strAncestorName + "\"";

    if (strSrc != null) {
        strSrc = lib.xmlHelpers.removePrefixFromXML(strPrefix, strSrc.toXMLString());
    }
    //set the jserror for RAD show the message
    if (strSrc == null) {
        vars.$jserror_file = strFileName;
        vars.$jserror_query = strSourceQuery;
        return null;
    } else if (strTgt == null) {
        vars.$jserror_file = strFileName;
        vars.$jserror_query = strTargetQuery;
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

    if (strAncestorXml != null && strAncestorXml.length > 0) {
        var xmlAncestor = new XML("ancestor");
        xmlAncestor.setAttributeValue("name", strAncestorName);
        xmlAncestor.setText(strAncestorXml.replace(/></g, ">\n<"));
        xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlAncestor);
    }

    return xmlDiff.toXMLString();
}

// Remove the prefix for number field
// Copy the value of number field of obj to prefixObj
function removePrefixFromNumberFields(filename, obj, prefixObj) {
    var numberFields = getNumberTypeFieldNamesForRename(filename);
    var i;
    for (i = 0; i < numberFields.length; i++) {
        prefixObj[numberFields[i]] = obj[numberFields[i]];
    }
}

// Remove the prefix for number field in standard way.
// The value of number field subtract the increasing number for rename.
function removePrefixFromNumberFieldsStandard(filename, prefixObj, prefix) {
    if (prefix == null) {
        return;
    }

    var number = getNumberTypeFieldIncreaseValueForRename(prefix);

    var numberFields = getNumberTypeFieldNamesForRename(filename);
    var i;
    for (i = 0; i < numberFields.length; i++) {
        prefixObj[numberFields[i]] = prefixObj[numberFields[i]] >= number ? prefixObj[numberFields[i]] - number : prefixObj[numberFields[i]];
    }
}

/**
 Build the new query statement with the specified prefix.
 The prefix will be appended to some fields.
 
 return the modified query string.
 
 Modified by Wang, Wei-Hua for the 3waymerge project.
 Modified by Li, Huan for the Purge function
 
*/
function buildRenamedQuery(table, strQuery, strPrefix) {
    var names = getFieldNamesForRename(table);
    var target = strQuery;
    var regex;
    var i;
    for (i = 0; i < names.length; i++) {
        if (table == "erddef") {
            regex = new RegExp("and counter=" + "[\\w]*");
            target = target.replace(regex, "");
        }
        /*
		else if (table == "idoladapter")
		{
			regexp = /^adapter.id=(\d+)/;
			target = target.replace(regexp, function(string, arg) {
				return "adapter.id=" + (getNumberTypeFieldIncreaseValueForRename() + Number(arg));
			});
		}*/

        if (target.indexOf("null(" + names[i] + ")") > 0) {
            target = target.replace("null(" + names[i] + ")", names[i] + "=\"" + strPrefix + "\" ");
        } else {
            regex = new RegExp(names[i] + "[\\s]*=[\\s]*\"");
            target = target.replace(regex, names[i] + "=\"" + strPrefix);
        }
    }

    var numberNames = getNumberTypeFieldNamesForRename(table);

    for (i = 0; i < numberNames.length; i++) {
        regex = new RegExp(numberNames[i] + "=(\\d+)");

        target = target.replace(regex, function(string, arg) {
            var tempNum = getNumberTypeFieldIncreaseValueForRename(strPrefix);
            return numberNames[i] + "=" + (tempNum + Number(arg));
        });
    }

    return target;
}

function getNameFromTOCFile(strTOCFilename) {
    if (strTOCFilename.indexOf("upgradeformat-") == 0) {
        return "upgradeformat";
    } else if (strTOCFilename.indexOf("upgradescmessage-") == 0) {
        return "upgradescmessage";
    } else if (strTOCFilename.indexOf("upgradehelp-") == 0) {
        return "upgradehelp";
    }
    var iIndex = strTOCFilename.indexOf(".dta");
    return strTOCFilename.slice(0, iIndex);
}

function saveMergeXML(strFileName, strTargetQuery, strMergeXML) {
    return lib.xmlHelpers.saveMergeXML(strFileName, strTargetQuery, strMergeXML);
}


function getLatestUpgradeHistory() {
    var upgHistory = new SCFile("upgradehistory", SCFILE_READONLY);
    upgHistory.doSelect(true);

    var latestDate = upgHistory.date;
    var latestName = upgHistory.upgverbld_name;
    var newversion = upgHistory.new_version;
    while (upgHistory.getNext() == RC_SUCCESS) {
        if (upgHistory.date > latestDate) {
            latestDate = upgHistory.date;
            latestName = upgHistory.upgverbld_name;
            newversion = upgHistory.new_version;
        }
    }

    upgHistory = new SCFile("upgradehistory");
    var sqlstring = "upgverbld.name=\"" + latestName + "\" and new.version=\"" + newversion + "\"";
    upgHistory.doSelect(sqlstring);
    return upgHistory;
}

/**
Return a unique SQL Base Name based on a given name
**/
var SBN_MAX_LENGTH = 13; //The max length of SQL Base Name field in datadict file
function getUniqueSQLBaseName(sqlbasename) {
    if (sqlbasename != null || true) {
        sqlbasename = sqlbasename.substring(0, SBN_MAX_LENGTH);
        var datadict = new SCFile("datadict");
        var i = 1;
        while (datadict.doSelect("sqlbasename=\"" + sqlbasename + "\"") == RC_SUCCESS) {
            sqlbasename = sqlbasename.substring(0, SBN_MAX_LENGTH - i.toString().length) + i;
            i++;
        }
    }
    return sqlbasename;
}

/**
 * When exporting unl file, the sqlbasename wasn't saved into datadict. At that time, we can't use the name in datadict.
 * Instead, we have to save the names in a variable.
 */
function getExtSQLTableName(filename, alias, tablename) {
    if (tablename != null && tablename.toUpperCase() == "NULLTABLE") {
        return "NULLTABLE";
    }

    var datadict = new SCFile("datadict");
    var rc = datadict.doSelect("name=\"" + filename + "\"");
    if (vars.$G_sql_base_names == null) {
        vars.$G_sql_base_names = [];
    }
    if (rc == RC_SUCCESS) {
        var sqlbasename = datadict.sqlbasename;
        if (sqlbasename == null) {
            sqlbasename = filename;
        }
        if (sqlbasename.length > SBN_MAX_LENGTH) {
            sqlbasename = sqlbasename.substring(0, SBN_MAX_LENGTH);
            var i = 1;
            while (true) {
                datadict = new SCFile("datadict", SCFILE_READONLY);
                datadict.setFields(["name"]);
                rc = datadict.doSelect("sqlbasename=\"" + sqlbasename + "\"");
                if (rc != RC_SUCCESS) {
                    var index = funcs.index(sqlbasename, vars.$G_sql_base_names);
                    if (index == 0) {
                        vars.$G_sql_base_names.push(sqlbasename);
                        break;
                    }
                }
                sqlbasename = sqlbasename.substring(0, SBN_MAX_LENGTH - i.toString().length) + i;
                i++;
            }
        }
        return "U_" + sqlbasename.toUpperCase() + alias.toUpperCase();
    }
    lib.upgradeLog.error("Datadict " + filename + "doesn't exist.");
    return "U_" + filename.toUpperCase() + alias.toUpperCase();
}

/**
 * get indexes of fields. the value of the fields will be renamed to make a duplicate of a record during upgrade.
 * the logic is completely complies with that from the old apm.upgrade.rename, except three tables:WorkflowPhase,settingsConfig,Workflow, 
 * which are most likely a mistake by Peter.R.
 *
 * @param tableName
 *          the name of the table
 *
 * return any array of field indexes.
 *
 * @author Liu,Yong-liang
 */
function getFieldIndexesForRename(tableName) {
    return getFieldsForRename(tableName).indexes;
}

/**
 * get names of fields. the value of the fields will be renamed to make a duplicate of a record during upgrade.
 * the logic is completely complies with that from the old apm.upgrade.rename, except three tables:WorkflowPhase,settingsConfig,Workflow, 
 * which are most likely a mistake by Peter.R.
 *
 * @param tableName
 *          the name of the table
 *
 * return any array of field names.
 *
 * @author Liu,Yong-liang
 */
function getFieldNamesForRename(tableName) {
    return getFieldsForRename(tableName).names;
}

/**
 * get indexes of fields. the value of the fields will be renamed to make a duplicate of a record during upgrade.
 *
 * @param tableName
 *          the name of the table
 *
 * @author Liu,Yong-liang
 */
function getFieldsForRename(tableName) {
    var fDbdict = lib.dbdictHelper.initDbdictFile(tableName);
    var noduplicatesKeys = getNoDuplicatesKeys(fDbdict);
    var uniqueKeys = getUniqueKeys(fDbdict);
    var noDuplicatesKeyFields = getFirstCharFieldIndexForKeys(fDbdict, noduplicatesKeys, null);
    var results = getFirstCharFieldIndexForKeys(fDbdict, uniqueKeys, noDuplicatesKeyFields);

    return results;
}


/**
 * Get number type fields for rename during upgrade
 *
 * if a unique key contains only one field only, and this field is number type,
 * need to rename too with normal string type fields together.  
 *
 * @param {String} tableName
 * @returns {Object}
 */
function getNumberTypeFieldsForRename(tableName) {
    var fDbdict = lib.dbdictHelper.initDbdictFile(tableName);
    var keys = getUniqueKeys(fDbdict);

    var names = [];
    var indexes = [];

    var i;
    for (i = 0; i < keys.length; i++) {
        var columns = keys[i][1];

        // unique key has one field only
        if (columns.length() == 1) {
            var name = columns[0];

            // number key
            if (lib.dbdictHelper.getFieldType(fDbdict, name) == lib.DataTypeConst.typeNumber()) {
                var index = lib.upgradeDbdictChangeFieldType.indexOfField(fDbdict, name).levelOneIndex;
                names.push(name);
                indexes.push(index);
            }
        }
    }

    return {
        "names": names,
        "indexes": indexes
    };
}


/**
 * Get indexes of number type fields for rename during upgrade
 *
 * if a unique key contains only one field only, and this field is number type,
 * need to rename too with normal string type fields together.  
 *
 * @param {String} tableName
 * @returns {Array}
 */
function getNumberTypeFieldIndexesForRename(tableName) {
    return getNumberTypeFieldsForRename(tableName).indexes;
}

/**
 * Get names of number type fields for rename during upgrade
 *
 * if a unique key contains only one field only, and this field is number type,
 * need to rename too with normal string type fields together.  
 *
 * @param {String} tableName
 * @returns {Array}
 */
function getNumberTypeFieldNamesForRename(tableName) {
    return getNumberTypeFieldsForRename(tableName).names;
}


/**
 * Return the increase value when Renaming number type single field unique key.
 *
 * @returns {Number}
 */
function getNumberTypeFieldIncreaseValueForRename(prefix) {
    var number = 10000;
    if (prefix != null && prefix.indexOf("PRE") >= 0) {
        number = number * 2;
    }
    return number;
}

/**
 * get unique key. keyType=8.
 *
 * @param fDbdict
 *          file variable for a dbdict
 *
 * @author Liu,Yong-liang
 */
function getNoDuplicatesKeys(fDbdict) {
    return getKeys(fDbdict, 8); //8 means No-Duplicates key
}

/**
 * get unique key. keyType=12 or 28.
 *
 * @param fDbdict
 *          file variable for a dbdict
 * @returns {Array}
 *
 * @author Liu,Yong-liang
 */
function getUniqueKeys(fDbdict) {
    var keys = getKeys(fDbdict, 28); //28 means primary key
    var ukeys = getKeys(fDbdict, 12); //12 means unique key

    // merge primary key and unique key
    var i;
    for (i = 0; i < ukeys.length; i++) {
        keys.push(ukeys[i]);
    }

    return keys;
}

/**
 * get indexes of fields. the value of the fields will be renamed to make a duplicate of a record during upgrade.
 *
 * @param fDbdict
 *          file variable for a dbdict
 * @param keyType 
 *          an integer representing a key type
 * @returns {Array}
 *
 * @author Liu,Yong-liang
 */
function getKeys(fDbdict, keyType) {
    var j = 0;
    var uniqueKeys = [];
    //get all unique keys
    if (fDbdict != null && fDbdict.key != null) {
        var i;
        var length = fDbdict.key.length();
        for (i = 0; i < length; i++) {

            if (fDbdict.key[i].flags == keyType) {
                uniqueKeys[j] = fDbdict.key[i];
                j++;
            }
        }
    }
    return uniqueKeys;
}


/**
 * get the first(order by the first level field index) character-typed field indexes for all the unique keys.
 * field from no-duplicates keys are considered first.
 *
 * @param fDbdict 
 *           file variable for a dbdict
 * @param uniqueKeys 
 *           an array of unique keys
 * @param noDuplicatesKeyFields 
 *           an array of fields to compare, e.g.,field info of no-duplicate keys
 *
 * return an array of array,
 *     the first array is field names;
 *     the second array is field indexes
 *  
 * @author Liu,Yong-liang
 */
function getFirstCharFieldIndexForKeys(fDbdict, uniqueKeys, noDuplicatesKeyFields) {
    var k = 0;
    var m = 0;
    var indexes = [];
    var names = [];
    var tempNames = [];
    var skip = false;

    if (noDuplicatesKeyFields == null) {
        noDuplicatesKeyFields = {
            "names": [],
            "indexes": []
        };
    }

    //get the first character-typed fieldnames for all the unique keys
    var i;
    for (i = 0; i < uniqueKeys.length; i++) {
        var minIndex = 1000; //a big enough index

        var j;
        var length = uniqueKeys[i].name.length();
        for (j = 0; j < length; j++) {
            var currentIndex = lib.upgradeDbdictChangeFieldType.indexOfField(fDbdict, uniqueKeys[i].name[j]).levelOneIndex;
            if (lib.ArrayUtil.contains(noDuplicatesKeyFields.names, uniqueKeys[i].name[j])) {
                skip = true; //field from no-duplicates keys first
                break;
            }

            //get the min field index
            if (lib.dbdictHelper.getFieldType(fDbdict, uniqueKeys[i].name[j]) == lib.DataTypeConst.typeCharacter() &&
                lib.ArrayUtil.contains(names, uniqueKeys[i].name[j]) == false &&
                currentIndex < minIndex) {
                if (fDbdict.name == "sdArea" && currentIndex < 3) {
                    continue;
                }
                minIndex = currentIndex;
                //should also save the names
                tempNames[m] = uniqueKeys[i].name[j];
                m++;
            }
        }
        if (skip == false && minIndex < 1000) {
            indexes[k] = minIndex;
            names[k] = tempNames[m - 1];
            k++;
        }
    }

    //add unique names/indexes to the return array
    var returnNames = noDuplicatesKeyFields.names;
    lib.ArrayUtil.addAll(returnNames, names);
    var returnIndexes = noDuplicatesKeyFields.indexes;
    lib.ArrayUtil.addAll(returnIndexes, indexes);

    return {
        "names": returnNames,
        "indexes": returnIndexes
    };
}

function getTag(file) {
    var tag = new SCDatum();
    funcs.rtecall("tag", 1, tag, file);
    return tag.getText();
}

function getTagQuery(file, tag) {
    var fileTag = new SCFile();
    funcs.fduplicate(fileTag, file);

    var query = new SCDatum();
    var ret = 0;
    funcs.rtecall("tagquery", ret, fileTag, query, tag);

    return query.getText();
}

function getTagQueryFromName(filename, tag) {
    var fileTag = new SCFile(filename);

    var query = new SCDatum();
    var ret = 0;
    funcs.rtecall("tagquery", ret, fileTag, query, tag);

    return query.getText();
}

function purgeSpecialDuplicatedRecords() {
    var count = 0;
    var dbdictArr = ["activityactions", "application", "code", "displaycache", "displayscreen",
        "enclapplication", "enclapplrev", "eventmap", "extactions", "format",
        "formatctrl", "globallists", "info", "kmdoctype", "link", "menu", "notification",
        "Object", "Process", "ScriptLibrary", "States", "triggers", "wizard"
    ];
    var queryString = "name isin " + funcs.str(dbdictArr);
    var fDbdict = new SCFile("dbdict");
    var fResults = fDbdict.doSelect(queryString);
    while (fResults == RC_SUCCESS) {
        var fDuplicatedRecord = new SCFile(fDbdict.name);
        var uniqueKeys = getUniqueKeys(fDbdict);
        queryString = uniqueKeys[0][1][0] + "#\"OLD7.11.000\"";
        if (fDbdict.name == "format") {
            queryString = "name#\"OLD7.11.000\"";
        }
        var rc = fDuplicatedRecord.doSelect(queryString);
        while (rc == RC_SUCCESS) {
            var tag = getTag(fDuplicatedRecord);
            var tagquery = getTagQuery(fDuplicatedRecord, tag);
            var rc_delete = fDuplicatedRecord.doDelete();
            if (rc_delete == RC_SUCCESS) {
                count++;
                lib.upgradeLog.detail("Finished purging " + fDbdict.name + ";" + tagquery);
            }
            rc = fDuplicatedRecord.getNext();
        }
        fResults = fDbdict.getNext();
    }

    return count;
}

function checkSpecialDuplicatedRecords() {
    var dbdictArr = ["activityactions", "application", "code", "displaycache", "displayscreen",
        "enclapplication", "enclapplrev", "eventmap", "extactions", "format",
        "formatctrl", "globallists", "info", "kmdoctype", "link", "menu", "notification",
        "Object", "Process", "ScriptLibrary", "States", "triggers", "wizard"
    ];
    var queryString = "name isin " + funcs.str(dbdictArr);
    var fDbdict = new SCFile("dbdict");
    var fResults = fDbdict.doSelect(queryString);
    while (fResults == RC_SUCCESS) {
        var fDuplicatedRecord = new SCFile(fDbdict.name);
        var uniqueKeys = getUniqueKeys(fDbdict);
        queryString = uniqueKeys[0][1][0] + "#\"OLD7.11.000\"";
        if (fDbdict.name == "format") {
            queryString = "name#\"OLD7.11.000\"";
        }
        var rc = fDuplicatedRecord.doSelect(queryString);
        if (rc == RC_SUCCESS) {
            return true;
        }
        fResults = fDbdict.getNext();
    }

    return false;
}

function validateDisplayscreen(displayscreen_id) {
    if (displayscreen_id == "subscription.search" ||
        displayscreen_id == "kmknowledgebase.search.view" ||
        displayscreen_id == "kmhitlisttemplate") {
        return false;
    }
    return true;
}

function compileDisplayscreenRecords(arrayDisplayscreen) {
    lib.upgradeLog.detail("Start compiling displayscreen records...");
    var count = 0;
    var i;
    for (i = 0; i < arrayDisplayscreen.length; i++) {
        var displayscreen_id = arrayDisplayscreen[i];
        lib.upgradeLog.detail("Compiling displayscreen;screen.id=" + displayscreen_id);
        funcs.rtecall("callrad", 1, "us.compile.screen", ["name", "text"], [displayscreen_id, "ENG"], false);
        count++;
    }
    lib.upgradeLog.detail("Finished compiling " + count + " displayscreen records.");
    return count;
}

/**
Purge all PRE<version> objects.

return the number of records purged.

@author Liu,Yong-liang
*/
function purgeAllDuplicatedRecords() {
    lib.upgradeLog.detail("Start purging duplicate upgrade records prefixed by NEW, PRE and OLD...");

    var fDbdict = new SCFile("dbdict", SCFILE_READONLY);
    var query = "name=\"upgraderesults\"";
    var rc = fDbdict.doSelect(query);
    if (rc != RC_SUCCESS) {
        return 0;
    }
    var count = 0;
    var count2 = 0;
    var countprd = 1000;
    var queryString = "result=\"Forced\" or result=\"Renamed\" or result=\"Auto Merged\" or " +
        "result=\"Reconciled\" or result=\"Previously Reconciled\" or result=\"Replaced\" or " +
        "result=\"Kept Customer Non-OOB\" or (result#\"Kept Customer\" and object.type=\"Application Cluster\")";
    var fData = new SCFile("upgraderesults");
    var fResults = fData.doSelect(queryString);
    var retCode = 0;
    var closedTrigger = funcs.rtecall("trigger", retCode, 0);
    var aDisplayscreenHasDuplicate = [];
    while (fResults == RC_SUCCESS) {
        if (fData.object_type == "displayoption") {
            var displayoption = new SCFile("displayoption", SCFILE_READONLY);
            displayoption.setFields(["screen.id"]);
            var returnCode = displayoption.doSelect("id=\"" + fData.object_name + "\"");
            if (returnCode == RC_SUCCESS) {
                aDisplayscreenHasDuplicate.push(displayoption.screen_id);
            }
        }

        var fObject = getTableData("upgradeobjects", "object.name=\"" + lib.StringUtil.escapeAllStr(fData.upgobject_key) + "\"");

        var prefix = lib.upgradeVersionUtil.getOldPrefix(getOldVersion());
        count += purgeDuplicatedRecords(fObject, prefix);

        prefix = lib.upgradeConstants.NEW_PREFIX();
        count += purgeDuplicatedRecords(fObject, prefix);

        // Since APM has used the "OLD7.11.000" prefix, so UP has to use another one
        prefix = lib.upgradeVersionUtil.getOldPrefix(getOldVersion(), "unconditional");
        if (prefix == "OLD7.11.000") {
            prefix = "OLD711";
        }
        count += purgeDuplicatedRecords(fObject, prefix);

        count2 += 1;
        if (count2 % countprd == 0) {
            print("Purge " + count2 + " duplicate upgrade records prefixed by NEW, PRE and OLD.");
        }

        fResults = fData.getNext();
    }

    if (count2 > 0) {
        print("Purge " + count2 + " duplicate upgrade records prefixed by NEW, PRE and OLD.");
    }

    // Purge records prefixed by OLD7.11.000, which are generated by Application Patch Manager
    count += purgeSpecialDuplicatedRecords();

    if (count > 0) {
        lib.upgradeLog.detail("Finished purging with " + count + " duplicate upgrade records prefixed by NEW, PRE and OLD.");
    }

    aDisplayscreenHasDuplicate.sort();
    var aDisplayscreenNoDuplicate = [];
    var displayscreen_id = "";
    var i;
    for (i = 0; i < aDisplayscreenHasDuplicate.length; i++) {
        if (displayscreen_id != aDisplayscreenHasDuplicate[i] && validateDisplayscreen(aDisplayscreenHasDuplicate[i])) {
            displayscreen_id = aDisplayscreenHasDuplicate[i];
            aDisplayscreenNoDuplicate.push(displayscreen_id);
        }
    }

    compileDisplayscreenRecords(aDisplayscreenNoDuplicate);

    return count;
}

function checkAllDuplicatedRecords() {
    var hasDuplicated = false;

    var fDbdict = new SCFile("dbdict", SCFILE_READONLY);
    var query = "name=\"upgraderesults\"";
    var rc = fDbdict.doSelect(query);
    if (rc != RC_SUCCESS) {
        return false;
    }

    var queryString = "result=\"Forced\" or result=\"Renamed\" or result=\"Auto Merged\" or " +
        "result=\"Reconciled\" or result=\"Previously Reconciled\" or result=\"Replaced\" or " +
        "result=\"Kept Customer Non-OOB\" or (result#\"Kept Customer\" and object.type=\"Application Cluster\")";
    var fData = new SCFile("upgraderesults", SCFILE_READONLY);
    fData.setFields(["upgobject.key"]);
    var fResults = fData.doSelect(queryString);
    var retCode = 0;
    var closedTrigger = funcs.rtecall("trigger", retCode, 0);
    while (fResults == RC_SUCCESS) {
        var fObject = getTableData("upgradeobjects", "object.name=\"" + lib.StringUtil.escapeAllStr(fData.upgobject_key) + "\"");

        var prefix = lib.upgradeVersionUtil.getOldPrefix(getOldVersion());
        hasDuplicated = checkDuplicatedRecords(fObject, prefix);
        if (hasDuplicated) {
            return true;
        }

        prefix = lib.upgradeConstants.NEW_PREFIX();
        hasDuplicated = checkDuplicatedRecords(fObject, prefix);
        if (hasDuplicated) {
            return true;
        }

        // Since APM has used the "OLD7.11.000" prefix, so UP has to use another one
        prefix = lib.upgradeVersionUtil.getOldPrefix(getOldVersion(), "unconditional");
        if (prefix == "OLD7.11.000") {
            prefix = "OLD711";
        }
        hasDuplicated = checkDuplicatedRecords(fObject, prefix);
        if (hasDuplicated) {
            return true;
        }

        fResults = fData.getNext();
    }

    // Purge records prefixed by OLD7.11.000, which are generated by Application Patch Manager
    hasDuplicated = checkSpecialDuplicatedRecords();

    return hasDuplicated;
}

function getOldVersion() {
    var fHist = getLatestUpgradeHistory();
    if (fHist != null) {
        return fHist.old_version;
    }
    return "";
}

/**
 * Purge PRE<version> objects with a specific table.
 *
 * @param fObject 
 *          file variable of a record of upgradeobjects.
 * @param prefix 
 *          prefix that added to the value of some fields to form a query string.
 *
 * return the number of records purged.
 *
 * @author Liu,Yong-liang
 */
function purgeDuplicatedRecords(fObject, prefix) {
    if (fObject == null || fObject.contents == null || prefix == null || prefix == "") {
        return 0;
    }

    var count = 0;
    var queryString;
    var temp_queryString;
    var i;
    var length = fObject.contents.length();
    for (i = 0; i < length; i++) {
        var table = fObject.contents[i].table;

        if (!lib.upgradeCommonHelper.isValidTable(table)) {
            lib.upgradeLog.error(table + " is not valid table when purging.");
            continue;
        }

        queryString = buildRenamedQuery(table, fObject.contents[i].query, prefix);
        var fDuplicatedRecord = new SCFile(table);
        var rc = fDuplicatedRecord.doSelect(queryString);
        while (rc == RC_SUCCESS) {
            var rc_delete = fDuplicatedRecord.doDelete();
            if (rc_delete == RC_SUCCESS) {
                count++;
                // Only log removal action of the first panel record within the same application
                if (temp_queryString != queryString) {
                    temp_queryString = queryString;
                    lib.upgradeLog.detail("Finished purging " + table + ";" + queryString);
                }
            }
            rc = fDuplicatedRecord.getNext();
        }
    }

    return count;
}

function checkDuplicatedRecords(fObject, prefix) {
    if (fObject == null || fObject.contents == null || prefix == null || prefix == "") {
        return 0;
    }

    var queryString;
    var i;
    var length = fObject.contents.length();
    for (i = 0; i < length; i++) {
        queryString = buildRenamedQuery(fObject.contents[i].table, fObject.contents[i].query, prefix);
        var fDuplicatedRecord = new SCFile(fObject.contents[i].table);
        var rc = fDuplicatedRecord.doSelect(queryString);
        if (rc == RC_SUCCESS) {
            return true;
        }
    }

    return false;
}

/**
 * get records from table.
 *
 * @param tableName     
 *          name of the table to retrieve records.
 * @param query     
 *          query string for retrieve specific records.
 *
 * return a file variable of the table.
 *
 * @author Liu,Yong-liang
 */
function getTableData(tableName, query) {
    var fData = new SCFile(tableName);
    var rc = fData.doSelect(query);
    if (rc == RC_SUCCESS) {
        return fData;
    } else {
        return null;
    }
}

/**
has renamed records exist in upgraderesults.

return a boolean variable to show if has.

@author Li, Huan
*/
function hasRenamedRecord() {
    var ret = false;
    var fData = new SCFile("dbdict", SCFILE_READONLY);
    var query = "name=\"upgraderesults\"";
    var rc = fData.doSelect(query);
    if (rc == RC_SUCCESS) {
        var resultsData = new SCFile("upgraderesults", SCFILE_READONLY);
        resultsData.setFields(["object.name"]);
        var sql = "result=\"Renamed\" or result=\"Previously Reconciled\"";
        var has = resultsData.doSelect(sql);
        if (has == RC_SUCCESS) {
            ret = true;
        }
    }
    return ret;
}

/**
 * Extract fields in Query. field should be the word before 'in $L.file'.
 */
function getFieldsInQuery(qStr) {
    var reg = /[\w|.]*\s+in\s+\$L.file/g;

    var arr = qStr.match(reg);
    var ele;
    for (ele = 0; ele < arr.length; ele++) {
        arr[ele] = arr[ele].replace(/\s+in\s+\$L.file/, "");
    }
    return arr;
}

/**
 * Remove 'in $L.file' in query.
 */
function getFieldsQuery(qStr) {
    qStr = funcs.str(qStr);
    qStr = qStr.replace(/\s+in\s+\$L.file/g, " ");
    return qStr;
}

function getPrimaryKey(keys) {
    var i;
    for (i in keys) {
        var key = keys[i];
        if (key.flags == 12) {
            return key;
        }
    }
    return null;
}

function getTableByAlias(alias, sqlTables) {
    var i;
    for (i in sqlTables) {
        var sqlTable = sqlTables[i];
        if (alias.toUpperCase() == sqlTable.sql_table_alias.toUpperCase()) {
            return sqlTable;
        }
    }
    return null;
}

function getFieldByName(name, fields) {
    var i;
    for (i in fields) {
        var field = fields[i];
        // skip array
        if (field.type != 8 && field.name == name) {
            return field;
        }
    }
    return null;
}

function conditionToSQL(condition, fields) {
    condition = getFieldsQuery(condition);
    condition = condition.replace(/"/g, "'");
    var reg = /\s*([\w|.]*)\s*=/g;
    var matchedCondition = condition;
    var arr = reg.exec(condition);
    while (arr != null) {
        var fieldName = arr[1];
        var field = getFieldByName(fieldName, fields);
        var sqlField = field.sql_field_options.sql_table_alias;
        sqlField += ".";
        sqlField += "\"";
        sqlField += field.sql_field_options.sql_column_name;
        sqlField += "\"";
        matchedCondition = matchedCondition.replace(fieldName, sqlField);
        arr = reg.exec(condition);
    }
    condition = matchedCondition;
    condition = condition.replace(/(false|FALSE|no|NO)/g, "'f'");
    condition = condition.replace(/(true|TRUE|yes|YES)/g, "'t'");
    condition = "not (" + condition + ")";
    return condition;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function constructInsertSelect(fileName, moduleFields, todoFields, condition) {
    var insertSelect = "INSERT INTO ";
    var todo = new SCFile("dbdict");
    todo.doSelect("name=\"Todo\"");
    insertSelect += todo.sql_tables[0].sql_table_name;
    insertSelect += "(";

    var field;
    var todoField;
    var alias;
    var table;

    var i;
    for (i in todoFields) {
        todoField = todoFields[i];
        field = getFieldByName(todoField, todo.field);
        insertSelect += "\"";
        insertSelect += field.sql_field_options.sql_column_name;
        insertSelect += "\",";
    }

    insertSelect += getFieldByName("itemType", todo.field).sql_field_options.sql_column_name;
    insertSelect += ") SELECT ";

    var module = new SCFile("dbdict");
    module.doSelect("name=\"" + fileName + "\"");
    var mainTableAlias = null;
    // joined table for m2
    var joinedTables = [];
    // joined table for a1
    var joinedArrays = [];
    for (i in moduleFields) {
        todoField = todoFields[i];
        var moduleField = moduleFields[i];
        var arrayIndex = moduleField.indexOf(",");
        var recordNumber = 0;
        if (arrayIndex != -1) {
            recordNumber = moduleField.substring(arrayIndex + 1);
            moduleField = moduleField.substring(0, arrayIndex);
        }
        field = getFieldByName(moduleField, module.field);
        var field2 = getFieldByName(todoField, todo.field);
        alias = field.sql_field_options.sql_table_alias;
        var sqlDataType = field.sql_field_options.sql_data_type;
        var sqlDataType2 = field2.sql_field_options.sql_data_type;
        if ((alias != null) &&
            (sqlDataType != null) &&
            (sqlDataType.toUpperCase().substr(0, 4) != "IMAG") &&
            (sqlDataType.toUpperCase().substr(0, 4) != "BLOB")) {
            if ((recordNumber > 0) && alias.indexOf("m") < 0) {
                joinedArrays.push([alias, recordNumber]);
            } else {
                if (mainTableAlias == null) {
                    mainTableAlias = alias;
                } else if ((alias != mainTableAlias) && !contains(joinedTables, alias)) {
                    joinedTables.push(alias);
                }
            }

            insertSelect += alias;
            insertSelect += ".\"";
            insertSelect += field.sql_field_options.sql_column_name;
            insertSelect += "\",";
        } else {
            var msg;
            if (alias == null) {
                msg = "The field \"" + moduleField + "\" of table \"" + fileName + "\" has no SQL Name, " +
                    "the value of mapped field \"" + todoField + "\" of table \"Todo\" is set empty.";
                funcs.msg(msg, 2);
                lib.upgradeLog.error(msg);
            }
            if ((sqlDataType != null) &&
                ((sqlDataType.toUpperCase().substr(0, 4) == "IMAG") ||
                    (sqlDataType.toUpperCase().substr(0, 4) == "BLOB"))) {
                msg = "The field \"" + moduleField + "\" of table \"" + fileName + "\" has SQL Type \"" + sqlDataType +
                    "\" which is incompatible with \"" + sqlDataType2 + "\", " +
                    "the value of mapped field \"" + todoField + "\" of table \"Todo\" is set empty.";
                funcs.msg(msg, 2);
                lib.upgradeLog.error(msg);
            }
            insertSelect += "null,";
        }
    }
    insertSelect += "'" + fileName + "'";
    insertSelect += " FROM ";
    var mainTable = getTableByAlias(mainTableAlias, module.sql_tables);
    insertSelect += mainTable.sql_table_name;
    insertSelect += " " + mainTableAlias;

    var primaryKeys = getPrimaryKey(module.key).name;
    var primaryKey;
    var primaryField;
    var layerIndex;

    var j;
    var jlength;

    // join m2
    if (joinedTables.length > 0) {
        for (i = 0; i < joinedTables.length; i++) {
            insertSelect += " LEFT OUTER JOIN ";
            alias = joinedTables[i];
            table = getTableByAlias(alias, module.sql_tables);
            insertSelect += table.sql_table_name;
            insertSelect += " " + alias;
            insertSelect += " ON ";

            jlength = lib.ArrayUtil.length(primaryKeys);
            for (j = 0; j < jlength; j++) {
                primaryKey = primaryKeys[j];
                layerIndex = primaryKey.lastIndexOf(",");
                if (layerIndex != -1) {
                    primaryKey = primaryKey.substring(layerIndex + 1);
                }
                primaryField = getFieldByName(primaryKey, module.field);
                insertSelect += mainTableAlias;
                insertSelect += ".";
                insertSelect += "\"";
                insertSelect += primaryField.sql_field_options.sql_column_name;
                insertSelect += "\"";
                insertSelect += " = ";
                insertSelect += alias;
                insertSelect += ".";
                insertSelect += "\"";
                insertSelect += primaryField.sql_field_options.sql_column_name;
                insertSelect += "\"";
                if (j < primaryKeys.length - 1) {
                    insertSelect += " AND ";
                }
            }
        }
    }

    var joinedArray;
    // join a1
    if (joinedArrays.length > 0) {
        for (i = 0; i < joinedArrays.length; i++) {
            insertSelect += " LEFT OUTER JOIN ";
            joinedArray = joinedArrays[i];
            alias = joinedArray[0];
            table = getTableByAlias(alias, module.sql_tables);
            insertSelect += table.sql_table_name;
            insertSelect += " " + alias;
            insertSelect += " ON ";

            jlength = lib.ArrayUtil.length(primaryKeys);
            for (j = 0; j < jlength; j++) {
                primaryKey = primaryKeys[j];
                layerIndex = primaryKey.lastIndexOf(",");
                if (layerIndex != -1) {
                    primaryKey = primaryKey.substring(layerIndex + 1);
                }
                primaryField = getFieldByName(primaryKey, module.field);
                insertSelect += mainTableAlias;
                insertSelect += ".";
                insertSelect += "\"";
                insertSelect += primaryField.sql_field_options.sql_column_name;
                insertSelect += "\"";
                insertSelect += " = ";
                insertSelect += alias;
                insertSelect += ".";
                insertSelect += "\"";
                insertSelect += primaryField.sql_field_options.sql_column_name;
                insertSelect += "\"";
                if (j < primaryKeys.length - 1) {
                    insertSelect += " AND ";
                }
            }
        }
    }

    condition = conditionToSQL(condition, module.field);
    insertSelect += " WHERE ";
    insertSelect += condition;
    for (i = 0; i < joinedArrays.length; i++) {
        insertSelect += " AND ";
        joinedArray = joinedArrays[i];
        alias = joinedArray[0];
        var number = joinedArray[1];
        insertSelect += alias;
        insertSelect += ".RECORD_NUMBER=";
        insertSelect += number;
    }

    return insertSelect;
}

function executeSQL(statement) {
    var names = new SCDatum();
    var values = new SCDatum();
    names.push("values");
    values.push([statement, "commit"]);
    try {
        funcs.rtecall("callrad", new SCDatum(), "SQLexecute", names, values, false);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Get upgrade field value
 *
 * @param table 
 *          the name of datadict
 * @param name 
 *          the name of the column
 * @param field 
 *          the value of the fields in the same row
 * @param value 
 *          the original value
 */
function getUpgradeFieldValue(table, name, field, value) {
    var i;
    for (i = 0; i < datadictUpgrade.length; i++) {
        if (datadictUpgrade[i].table == table) {
            var j;
            for (j = 0; j < datadictUpgrade[i].names.length; j++) {
                if (datadictUpgrade[i].names[j].name == name) {
                    var k;
                    for (k = 0; k < datadictUpgrade[i].names[j].values.length; k++) {
                        if (datadictUpgrade[i].names[j].values[k].field == field) {
                            if (datadictUpgrade[i].names[j].values[k].oobValue == value) {
                                return datadictUpgrade[i].names[j].values[k].upgradeValue;
                            } else {
                                return value;
                            }
                        }
                    }
                }
            }
        }
    }
    return value;
}


function isDbdictInPatch(dbdict, patchname) {
    if (dbdict == "code" || dbdict == "format") {
        return true;
    }

    if (patchname == null) {
        patchname = lib.upgradeConstants.PATCH_NAME();
    }

    var patch = lib.upgradeUtility.getRecord("patches", "name=\"" + patchname + "\"");
    if (patch == null) {
        return false;
    }

    var i;
    var length = patch.secondary.length();
    for (i = 0; i < length; i++) {
        if (dbdict == patch.secondary[i].dbdict) {
            return true;
        }
    }

    return false;
}

function isDbdictInPdPatch(dbdict) {
    var patch = lib.upgradeUtility.getRecord("pdpatches", "filename=\"" + dbdict + "\"");

    return (patch != null);
}

function getDbdictsInPdPatch() {
    var dbdicts = [];
    var sql = "select filename, count(*) from pdpatches group by filename";
    var patch = new SCFile("pdpatches", SCFILE_READONLY);
    var rc = patch.doSelect(sql);
    while (rc == RC_SUCCESS) {
        dbdicts.push(patch["filename"]);
        rc = patch.getNext();
    }

    return dbdicts;
}

function generatePdPatches() {
    var smpatch = new SCFile("smpatches", SCFILE_READONLY);
    var rc = smpatch.doSelect("true");
    var forcedobject;
    var rc1;
    var pdpatch;

    while (rc == RC_SUCCESS) {
        pdpatch = new SCFile("pdpatches");
        pdpatch.version = lib.upgradeVersionUtil.getCurrentVersion();
        pdpatch.filename = smpatch.filename;
        pdpatch.tag = smpatch.tag;
        pdpatch.action = smpatch.action;

        forcedobject = new SCFile("forcedobjects", SCFILE_READONLY);
        rc1 = forcedobject.doSelect("filename=\"" + smpatch.filename + "\" and tag=\"" + smpatch.tag + "\"");
        if (rc1 == RC_SUCCESS) {
            pdpatch.action = "replace";
        }
        pdpatch.doInsert();
        rc = smpatch.getNext();
    }

    forcedobject = new SCFile("forcedobjects", SCFILE_READONLY);
    rc = forcedobject.doSelect("true");
    while (rc == RC_SUCCESS) {
        smpatch = new SCFile("smpatches", SCFILE_READONLY);
        rc1 = smpatch.doSelect("filename=\"" + forcedobject.filename + "\" and tag=\"" + forcedobject.tag + "\"");
        if (rc1 != RC_SUCCESS) {
            pdpatch = new SCFile("pdpatches");
            pdpatch.version = lib.upgradeVersionUtil.getCurrentVersion();
            pdpatch.filename = forcedobject.filename;
            pdpatch.tag = forcedobject.tag;
            pdpatch.action = "remove";
            pdpatch.doInsert();
        }
        rc = forcedobject.getNext();
    }
}

function updatePdPatches() {
    var version = lib.upgradeConstants.TARGET_VERSION();
    if (version != "Unknown") {
        var pdpatch = new SCFile("pdpatches");
        var rc = pdpatch.doSelect("true");
        while (rc == RC_SUCCESS) {
            if (version != pdpatch["version"]) {
                pdpatch["version"] = version;
                pdpatch.doUpdate();
            }
            rc = pdpatch.getNext();
        }
    }
}

function cleanPdPatches() {
    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"pdpatches\"");
    if (dbdict != null) {
        lib.upgradeLog.upgrade("Clean records of pdpatches...");
        lib.upgradeLog.detail("Clean records of pdpatches...");
        var sql = "delete from PDPATCHESM1";
        executeSQL(sql);
    }
}

function getObjectNameFromTag(table, tag) {
    var subtag = tag.substring(table.length + 1);
    var strings = subtag.split("\\;");
    var objname = "";
    var i;
    for (i = 0; i < strings.length; i++) {
        if (i > 0) {
            objname += ";";
        }
        objname += strings[i].replace(/;/g, "");
    }

    return objname;
    //return tag.replace(/;/g, "").substring(table.length);
}

function getUpgradeWindowTitle() {
    return "Service Manager Applications Upgrade Utility";
}


function isUpgradeObjectIgnored(signatures, currSig) {
    if (signatures == null) {
        return false;
    }

    var baseversionIndex = lib.upgradeVersionUtil.getVersionIndex(lib.upgradeVersionUtil.getFixedBaselineVersion());

    var foundVersionIndex = -1;
    var foundSig = "";
    var dupVersions = false;

    var length = lib.ArrayUtil.length(signatures);
    var i;
    for (i = 0; i < length; i++) {
        var signature = signatures[i].toArray();
        var versionIndex = lib.upgradeVersionUtil.getVersionIndex(signature[1]); // field version

        if (versionIndex < 0) {
            continue;
        }

        if (versionIndex > baseversionIndex) {
            return false;
        } else {
            var sig = +signature[0]; // field sig
            if (versionIndex > foundVersionIndex) {
                foundVersionIndex = versionIndex;
                foundSig = sig;
                dupVersions = false;
            } else if (versionIndex == foundVersionIndex) {
                if (sig != foundSig) {
                    dupVersions = true;
                }
            }
        }
    }

    if (dupVersions || foundSig != currSig) {
        return false;
    }

    return true;
}

function removeUpgradeLightScript() {
    var name = lib.upgradeUtility.getLightScriptName();
    var sl = lib.upgradeUtility.getRecord("ScriptLibrary", "name=\"" + name + "\"");
    if (sl != null) {
        sl.doDelete();
    }
}

function generateUpgradeLightScript(isLight, baselineVersion, isDumpDataLight) {
    removeUpgradeLightScript();

    lib.upgradeLog.detail("The variable isLight=" + isLight);
    if (isLight == null || isLight == "" || isLight == "0" || isLight == 0 || (typeof(isLight) == "string" && isLight.toLowerCase() == "false") || !isLight) {
        lib.upgradeLog.detail("Building General Upgrade Utility ...");
        return;
    }
    lib.upgradeLog.detail("Building Lightweight Upgrade Utility ...");

    if (isDumpDataLight == null || isDumpDataLight == "" || isDumpDataLight == 1 || (typeof(isDumpDataLight) == "string" && isDumpDataLight.toLowerCase() == "true") || isDumpDataLight) {
        isDumpDataLight = true;
    } else {
        isDumpDataLight = false;
    }

    lib.upgradeLog.detail("The variable isDumpDataLight=" + isDumpDataLight);

    var baselineVersion0 = lib.upgradeConstants.BASELINE_VERSION();

    if (baselineVersion == null) {
        baselineVersion = baselineVersion0;
    }

    var baselineVersionIndex = lib.upgradeVersionUtil.getVersionIndex(baselineVersion);
    if (baselineVersionIndex < 0) {
        baselineVersion = baselineVersion0;
    } else {
        var baselineVersionIndex0 = lib.upgradeVersionUtil.getVersionIndex(baselineVersion0);
        if (baselineVersionIndex < baselineVersionIndex0) {
            baselineVersion = baselineVersion0;
        }
    }

    var sl = new SCFile("ScriptLibrary");
    sl["name"] = "upgradeLight";
    sl["package"] = "Upgrade";
    sl["sysrestricted"] = true;
    var script = "";
    script += "function isLight() {\n";
    script += "    return true;\n";
    script += "}\n";
    script += "\n";
    script += "function isDumpDataLight() {\n";
    script += "    if (!isLight()) {\n";
    script += "        return false\n";
    script += "    }\n";
    script += "    return " + isDumpDataLight + ";\n";
    script += "}\n";
    script += "\n";
    script += "function BASELINE_VERSION() {\n";
    script += "    return \"" + baselineVersion + "\";\n";
    script += "}\n";

    sl["script"] = script;

    sl.doInsert();
}

function updateUpgVerBld() {
    var fUpgVerBld = new SCFile("upgverbld");
    fUpgVerBld.doSelect(true);

    var i;
    var buildname = "";
    var values = fUpgVerBld.name.split("-");
    if (values != null) {
        for (i = 0; i < values.length; i++) {
            if (i == 0) {
                buildname += "SM" + lib.upgradeVersionUtil.getShortFullMajorMinorVersion(lib.upgradeVersionUtil.getFixedStartVersion());
            } else {
                buildname += "-" + values[i];
            }
        }
    }

    var update = false;
    if (buildname.length > 0 && fUpgVerBld.name != buildname) {
        fUpgVerBld.name = buildname;
        update = true;
    }

    var majorminorVersion = lib.upgradeVersionUtil.getMajorMinorVersion(lib.upgradeVersionUtil.getFixedStartVersion());
    var automergeVersions = [];
    var length = lib.ArrayUtil.length(fUpgVerBld["automerge.versions"]);

    for (i = 0; i < length; i++) {
        if (fUpgVerBld["automerge.versions"][i] == majorminorVersion) {
            if (i > 0) {
                update = true;
                var j;
                for (j = i; j < length; j++) {
                    automergeVersions.push(fUpgVerBld["automerge.versions"][j]);
                }
                fUpgVerBld["automerge.versions"] = automergeVersions;
            }
            break;
        }
    }

    if (update) {
        fUpgVerBld.doUpdate();
    }
}


function prepareUpgradeLight(isLight, baselineVersion, isDumpDataLight) {
    generateUpgradeLightScript(isLight, baselineVersion, isDumpDataLight);
    if (lib.upgradeUtility.isLightUpgrade()) {
        updateUpgVerBld();
    }
}

function getBuildSQL(type, table, field) {
    var BUILD_SQL = {
        "preupg": { // apm.upgrade.build.other - setup.preupg
            "RAD": "<KEY>=\"file.load\" or <KEY>#\"apm.upgrade.load.transfer\" or <KEY>=\"apm.upgrade.merge.new\" or <KEY>=\"dbdict.sql.changes\" or <KEY>#\"apm.upgrade.sqlsys\" or <KEY>#\"apm.upgrade.fix.sqlbasename\" or <KEY>=\"apm.upgrade.fix.help\" or <KEY>#\"apm.upgrade.get.utility.path\" or <KEY>=\"apm.upgrade.status.read\" or <KEY>=\"apm.upgrade.wizard.ux\" or <KEY>=\"apm.upgrade.create.ux\" or <KEY>=\"apm.upgrade.purge\" or <KEY>=\"apm.upgrade.load.hotfix\" or <KEY>=\"apm.upgrade.apply.bg\" or <KEY>=\"apm.upgrade.sqlcompare.bg\" or <KEY>=\"apm.upgrade.sql.compare\" or <KEY>#\"apm.upgrade.verify.sql\" or <KEY>=\"apm.upgrade.verify.sql.sub\" or <KEY>=\"wizard.run.ex\"",
            "menu": "name#\"UPGRADE\" or name=\"SYSTEM ADMINISTRATION\"",
            "Process": "process#\"upgrade.wizard\"",
            "wizard": "name#\"Upgrade - \"",
            "format": "name#\"upg.wiz.apply\" or name#\"upg.wiz.create\" or name#\"upg.wiz.sql.compare\" or name#\"upg.wiz.view\" or name#\"apm.upgrade.results\" or name#\"sqlupgrade\" or name#\"apm.upgrade.purge.prompt\" or name=\"wiz.patchrel.notes\"",
            "formatctrl": "name#\"upgrade.wizard\"",
            "datadict": "sqlbasename~=\"NULL\"",
            "JS": "name=\"upgradeCompareDbdict\" or name=\"dbdictHelper\" or name=\"tableFunctions\" or name=\"triggerUtil\" or name=\"DataTypeConst\" or name=\"ArrayUtil\" or (name#\"upgrade\" and name~=\"upgradeLight\") or name=\"tzFunctions\" or name=\"operatorUtil\" or name=\"ProcessDesignerEnablement\" or name=\"c\" or name=\"StringUtil\" or name#\"Underscore\" or name=\"Promise\" or name=\"idolUpgrade\""

        },
        "more": { // apm.upgrade.dump.more.records - setup.queries
            "RAD": "<KEY>=\"us.gen.triggers\" or <KEY>=\"us.compile.screen\"",
            "JS": "name=\"Workflow\" or name=\"objectHelper\" or name=\"security\""
        },
        "transfer": { // apm.upgrade.transfer - start
            "RAD": "<KEY>#\"apm.upg\" or <KEY>#\"apm.make.sig\" or <KEY>#\"sql.refresh\" or <KEY>=\"us.gen.datadict\" or <KEY>=\"macro.build.field.array\" or <KEY>=\"upg.regen.ir\"",
            "format": "name#\"sqlupgrade\" or name#\"upg.wiz\" or name#\"upgraderesult\" or name#\"upgradestatus\" or name#\"upgrade.configuration\"",
            "formatctrl": "name#\"apm.upgrade\"",
            "JS": "name=\"dbdictHelper\" or name=\"tableFunctions\" or name=\"tableAccess\" or name=\"triggerUtil\" or name=\"DataTypeConst\" or name#\"upgrade\" or name=\"ProcessDesignerEnablement\" or name=\"c\" or name=\"BaseUtil\" or name=\"DataService\""
        }
    };
    if (type == null || table == null || (table == "RAD" && field == null)) {
        return "false";
    }

    if (BUILD_SQL[type] == null) {
        return "false";
    }

    var sql = BUILD_SQL[type][table];
    if (sql == null) {
        return "false";
    }

    if (type == "transfer") {
        var sql2 = BUILD_SQL["preupg"][table];
        if (sql2 != null) {
            sql = "not (" + sql2 + ") and (" + sql + ")";
        }
    }

    if (table == "RAD") {
        sql = sql.replace(/<KEY>/g, field);
    }

    return sql;
}

function getExportInfSQL(language) {
    var query;
    if (language == null || language == "en") {
        query = '(object.name~#"Format Record :"' +
            ' and object.name~#"help,"' +
            ' and object.name~#"scmessage,"' +
            ' and object.name~#"unitofmeasure,"' +
            ' and object.name~#"htmltemplates,"' +
            ' and object.name~#"msMessageTemplate,")' +
            ' or language="en"';
    } else {
        query = "language=\"" + language + "\"";
    }

    query = "(" + query + ") and object.name~#\"format,\"";

    return query;
}

// Implement the codes from the Adaptor.escapeField in ScriptLibrary DataService
// Be compatible with the old version as the dbdict JSBeanFactory is added in SM9.32,
function escapeDbField(dbtype, field) {
    if (dbtype == "sqlserver") {
        return "[" + field + "]";
    }

    return "\"" + field + "\"";
}

function purgeNonEngRADFormat() {
    lib.upgradeLog.upgrade("Cleaning non-English format of RAD");
    lib.upgradeLog.detail("Cleaning non-English format of RAD");

    var formatTable = lib.upgradeUtility.getDatabaseTableName("format");
    var codeTable = lib.upgradeUtility.getDatabaseTableName("code");

    var dbType = lib.dbdictHelper.getDbType();
    // delete from FORMATM1 where SYSLANGUAGE<>'en' and NAME in (select APPLICATION from CODEM1)
    var sql = "delete from " + formatTable + " where " + escapeDbField(dbType, "SYSLANGUAGE") + "<>'en' and " +
        escapeDbField(dbType, "NAME") + " in (select " +
        escapeDbField(dbType, "APPLICATION") + " from " + codeTable + ")";

    executeSQL(sql);

    lib.upgradeLog.upgrade("Finish cleaning non-English format of RAD");
    lib.upgradeLog.detail("Finish cleaning non-English format of RAD");
}