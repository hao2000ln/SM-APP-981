var logger = getLog("KMUtils");

/**  This function returns a SC JavaScript compliant field name by replacing
 *  "." (dot) characters in the field name with "_" (underscore) character
 *  @param {String} strFieldName - a string containing the name of a SC field
 *  @return The name of SC field in valid Javascript format
 *   @type String
 */
function scToJSName(strFieldName) {
    var reg = /(\.|\s)/g;

    if (funcs._null(strFieldName)) {
        strFieldName = " ";
    }
    return strFieldName.replace(reg, "_");
}

/**
 *  This function provides a utility to strip the SC Array style markup
 *  from a string representation of the array.  For example SC will return
 *  {"Hello"} and when passed to this function you will receive Hello
 *  @param {String} strString ServiceCenter String representation of an array
 *  @return String representation of the SC array
 *   @type String
 *  @deprecated
 *   @see #scArrayToString
 */
function cleanArrayMarkup(strString) {
    var reg = /(\{")|("\})|(\{*,\s")/g;

    return strString.replace(reg, "");
}

/**
 *  Determines if the field passes as an argument is an array field
 *  @param  {Datum} fField - a field variable
 *  @return true or false
 *   @type Boolean
 */
function isSCArray(fField) {
    return ((fField != null) && (fField.length) && (typeof(fField) == "object")) ? true : false;
}

/**
 *  Determines if the field in the file is array
 *  @param  {Datum} filename - dbdict/file name
 *  @param  {Datum} fieldname - field name
 *  @return true or false
 *   @type Boolean
 */
function isSCArray2(filename, fieldname) {
    return funcs.dbdict_helper("field.type", filename, fieldname) == 8 ? true : false;
}

/**
 *  Concatenates the elements of an array field into a single string
 *  @param {Datum}  fField - array field variable
 *  @return String representation of ServiceCenter array field
 *   @type String
 */
function scArrayToString(fField) {
    var strResult = "";
    if (isSCArray(fField)) {
        strResult = funcs.strraw(fField);
        strResult = strResult.replace(/"/g, "\\\"") + " ";
    }
    return strResult;
}


/**
 *  Concatenates the elements of an array field into a single HTML string
 *  @param {Datum}  fField - array field variable
 *  @return String representation of ServiceCenter array field
 *   @type String
 */
function scArrayToHTMLString(fField) {
    var strResult = "";
    if (isSCArray(fField)) {
        var strFieldData;
        var idx;
        for (idx in fField) {
            if (fField[idx] != null) {
                strFieldData = fField[idx];
                strFieldData = strFieldData.replace(/"/g, "&quot;");
                strFieldData = strFieldData.replace(/</g, "&lt;");
                strFieldData = strFieldData.replace(/>/g, "&gt;");
                strFieldData = strFieldData.replace(/\\/g, "\\\\");
                strResult += strFieldData + " <br />";
            }
        }
    }

    return strResult;
}


/**
 *  This function returns an array of strings containing the UID and filename of all attachments for a SCFile
 *   record.
 *  @param strSCFile String containing the SCFile name of record owning the attachment
 *  @param strId String containing the unique id of the SCFile record that owns the attachment
 *  @return {String} array of strings containing UID and filename of the attachments in the format "UID:filename"
 *  @type {String}
 */
function getAttachmentInfo(strSCFile, strId) {
    var fAttachments = new SCFile("SYSATTACHMENTS", SCFILE_READONLY);
    fAttachments.setFields(["filename", "uid"]);
    var rc = fAttachments.doSelect("application=\"" + strSCFile + "\" and topic=\"" + strId + "\" and segment=0");
    var returnArray = new Datum();
    returnArray.setType(8); //make it an array
    if (rc == RC_SUCCESS) {
        var strOutputFile = fAttachments.filename;
        var strLastUID = "";
        while (rc == RC_SUCCESS) {
            if (strLastUID != fAttachments.uid) {
                returnArray.push(fAttachments.uid + ":" + fAttachments.filename);
            }
            strLastUID = fAttachments.uid;
            rc = fAttachments.getNext();
        }
    }

    return returnArray;
}


/**
 *  This function returns a string stripped of any HTML markup
 *  @param strHTML String containing the HTML marked up text
 *  @return String containing contents of strHTML minus the HTML markup
 *   @type String
 */
function HTMLtoText(strHTML) {
    return lib.StringUtil.stripHtmlTags(strHTML);
}

/**
 *  Remove all occurrences of a token in a string
 *    s  string to be processed
 *    t  token to be removed
 *  returns new string
 */
function removetoken(s, t) {
    var i = s.indexOf(t);
    var r = "";
    if (i == -1) {
        return s;
    }
    r += s.substring(0, i) + removetoken(s.substring(i + t.length), t);
    return r;
}


/**
This function converts the DateTime string from the UI widget to a SCDateTime String
**/
function getSCDateTimeString(strDT) {
    var theXMLDate = new XMLDate(strDT);
    var returnValue = theXMLDate.getSCDateTimeString();
    return returnValue;
}

function getUTCDateTimeString(strDT) {
    var theXMLDate = new XMLDate(strDT);
    var returnValue = theXMLDate.getISODate() + "T" + theXMLDate.getISOTime() + "Z";
    return returnValue;
}

function domessageBox(message, type) {
    //if we are in a background process...just print the message
    //QCCR1E75763 Search knowledgebase in ess.do will logout directly, if delete search server
    //we are in the ESS client...just also print the message
    //add by Neilyu since 06/13/2012
    if (vars.$G_bg || vars.$L_bg || funcs.nullsub(vars.$G_ess, false)) {
        print(message);
        return;
    }

    lib.BaseUtil.ShowMessageBox(message, type);
}


/**** Character string manipulation functions ****/
function stripLeading(string, chr) {
    var finished = false;
    var i;
    for (i = 0; i < string.length && !finished; i++) {
        if (string.substring(i, i + 1) != chr) {
            finished = true;
        }
    }

    if (finished) {
        return string.substring(i - 1);
    } else {
        return string;
    }
}

function stripTrailing(string, chr) {
    var finished = false;
    var i;
    for (i = string.length - 1; i > -1 && !finished; i--) {
        if (string.substring(i, i + 1) != chr) {
            finished = true;
        }
    }

    if (finished) {
        return string.substring(0, i + 2);
    } else {
        return string;
    }
}

function stripLeadingTrailing(string, chr) {
    return stripTrailing(stripLeading(string, chr), chr);
}

/************************************************/
// Remove non filename safe characters from SC id fields.
function cleanDocID(strFieldName) {
    if (!strFieldName) {
        return strFieldName;
    }

    var reg = /[\W]/g;
    strFieldName = strFieldName.toString().replace(reg, "_");

    return strFieldName;
}

/************************************************/
// Make an SC array from a list separated by a token.
function parseListToSCArray(strFieldName, token) {
    var phraseArray = new SCDatum();
    phraseArray.setType(8); //type array

    // break strFieldName up into separate words
    if (strFieldName != null) {
        var tmpFld = strFieldName;
        var spec_loc = tmpFld.indexOf(token);
        var word = "";

        while (spec_loc >= 0) {
            word = tmpFld.substring(0, spec_loc);
            tmpFld = tmpFld.substring(spec_loc + 1, tmpFld.length);
            phraseArray.push(word);
            spec_loc = tmpFld.indexOf(token);
        }
        if (tmpFld.length > 0) { // if $anywords does not end in a blank character
            phraseArray.push(tmpFld); // then push the last word
        }
    }

    return phraseArray;
}


/************************************************/

// Change multiple sequential occurences of a token to a single token in a character string.
function removeRedundentTokens(charString, token) {
    if (charString != null && token != null && token != "") {
        var doubleToken = token + token;
        var spec_loc = charString.indexOf(doubleToken);

        while (spec_loc >= 0) {
            charString = charString.substring(0, spec_loc) + charString.substring(spec_loc + 1);
            spec_loc = charString.indexOf(doubleToken);
        }
    }
    return charString;
}

/************************************************/

function lockrecord(record) {
    var success;
    var rteReturnValue = new SCDatum();

    var lockName = new SCDatum();
    lockName.setType(2);

    funcs.rtecall("tag", rteReturnValue, lockName, record);

    success = Lock(lockName.getText());

    if (success == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}


function unlockrecord(record) {
    var success;
    var rteReturnValue = new SCDatum();

    var lockName = new SCDatum();
    lockName.setType(2);

    funcs.rtecall("tag", rteReturnValue, lockName, record);

    success = Unlock(lockName.getText());

    if (success == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}

/**
 *  Truncate a string and add ellipsis "..." if the length exceeds the maxLength passed in
 *  @param  str - the string variable to truncate if it exceeds maxLength
 *  @param  maxLength - the maximum length the returned string can be
 *  @return the string, truncated if necessary with ellipsis characters
 *
 *   Used by KMChangeManagement
 */
function truncateStringWithEllipsis(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else if (maxLength < 4) {
        return str.substring(0, maxLength);
    }

    return str.substring(0, maxLength - 3) + "...";
}

function getKMlangcode(smcode) {
    var sclangFile = new SCFile("language", SCFILE_READONLY);
    sclangFile.setFields(["km.id"]);
    var scFind = sclangFile.doSelect("unique.id = \"" + smcode + "\"");
    if (scFind == RC_SUCCESS) {
        // If the km.id column is null or blank, then Verity does not search in that language
        if (funcs._null(sclangFile.km_id) || sclangFile.km_id == "") {
            sclangFile.km_id = "en"; // Default to English if no value in km.id
        }
        return sclangFile.km_id;
    }
    return "en"; // Default to English if a read error occurs
}

function getShardInfo(searchserver) {
    var shardInfo = "";
    var searchserversFile = new SCFile("kmsearchservers", SCFILE_READONLY);
    var searchserverFind = searchserversFile.doSelect("servername = \"" + searchserver + "\"");
    if (searchserverFind == RC_SUCCESS) {
        var y;
        var length = searchserversFile.servers.length();
        for (y = 0; y < length; y++) {
            if (searchserversFile.servers[y].primarysearcher) {
                shardInfo = searchserversFile.servers[y].hostname + ":" + searchserversFile.servers[y].port + "/" + searchserversFile.searchinstancename;
            }
        }
    }
    return shardInfo;
}

function getShardInfo4SRC(searchserver) {
    var shardInfo = "";
    var searchserversFile = new SCFile("kmsearchservers", SCFILE_READONLY);
    var searchserverFind = searchserversFile.doSelect("servername = \"" + searchserver + "\"");
    if (searchserverFind == RC_SUCCESS) {
        var y;
        var length = searchserversFile.servers.length();
        for (y = 0; y < length; y++) {
            // Add ssl support for SRC connection.
            if (searchserversFile.servers[y].primarysearcher) {
                if (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y]) == 0) {
                    shardInfo = searchserversFile.servers[y].hostname + ":" + searchserversFile.servers[y].https_port + "/" + searchserversFile.searchinstancename;
                } else {
                    shardInfo = searchserversFile.servers[y].hostname + ":" + searchserversFile.servers[y].port + "/" + searchserversFile.searchinstancename;
                }
            }
        }
    }
    return shardInfo;
}

function getSearchEngineConfig(collection, type) {
    if (type == "admin" || type == "index") {
        var searchservername = "";
        var collectionFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
        collectionFile.setFields(["searchservername"]);
        var collFind = collectionFile.doSelect("kbname = \"" + collection + "\"");
        if (collFind == RC_SUCCESS) {
            searchservername = collectionFile.searchservername;
        }
    }

    var searchServerFound = false;
    var searchserverFind;
    var searchserversFile = new SCFile("kmsearchservers", SCFILE_READONLY);
    if (type == "admin" || type == "index") {
        searchserverFind = searchserversFile.doSelect("servername = \"" + searchservername + "\"");
    } else {
        searchserverFind = searchserversFile.doSelect("true");
    }

    while (searchserverFind == RC_SUCCESS) {
        var indexinstancename = searchserversFile.searchinstancename;
        var webdav = searchserversFile.webdavname;
        var searchinstancename = searchserversFile.searchinstancename;
        var validServer = true;
        var y;
        var length = searchserversFile.servers.length();
        for (y = 0; y < length; y++) {
            if (searchserversFile.servers[y].servertype == "master") {
                var indexhostname = searchserversFile.servers[y].hostname;
                var indexport = searchserversFile.servers[y].port;
                switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
                    case 0:
                        indexport = searchserversFile.servers[y].https_port;
                        break;
                    case -1:
                        validServer = false;
                        break;
                }
            }

            if (searchserversFile.servers[y].primarysearcher) {
                var args = new Datum();
                args.setType(8);
                args.push(searchserversFile.servers[y].hostname);
                switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
                    case 0:
                        args.push(searchserversFile.servers[y].https_port);
                        break;
                    case -1:
                        validServer = false;
                        break;
                    default:
                        args.push(searchserversFile.servers[y].port);
                }
                args.push(searchserversFile.searchinstancename);
                switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
                    case 0:
                        args.push('ssl.enabled');
                        break;
                    case -1:
                        validServer = false;
                        break;
                }
                var pingResponse = lib.KMSearchInterface.pingEngine(args);
                if (pingResponse == RC_SUCCESS) {
                    searchServerFound = true;
                    var searchhostname = searchserversFile.servers[y].hostname;
                    var searchport = searchserversFile.servers[y].port;
                    switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
                        case 0:
                            searchport = searchserversFile.servers[y].https_port;
                            break;
                        case -1:
                            validServer = false;
                            return;
                    }
                }

            }
        }

        if (!validServer) {
            searchserverFind = searchserversFile.getNext();
            continue;
        }

        if (!searchServerFound) {
            searchserverFind = searchserversFile.getNext();
        } else {
            break;
        }
    }

    var strCfg = "<SEConfig>";

    if (type == "index") {
        strCfg += "<indexhost>" + indexhostname + "</indexhost>";
        strCfg += "<indexport>" + indexport + "</indexport>";
        strCfg += "<indexinstance>" + indexinstancename + "</indexinstance>";
    } else if (type == "admin") {
        strCfg += "<adminhost>" + indexhostname + "</adminhost>";
        strCfg += "<adminport>" + indexport + "</adminport>";
        strCfg += "<admininstance>" + indexinstancename + "</admininstance>";
        strCfg += "<webdav>" + webdav + "</webdav>";

    } else if (type == "search") {
        strCfg += "<searchhost>" + searchhostname + "</searchhost>";
        strCfg += "<searchport>" + searchport + "</searchport>";
        strCfg += "<searchinstance>" + searchinstancename + "</searchinstance>";
    }

    if (vars.$G_km_globalenv['ssl.enabled']) {
        strCfg += "<ssl.enabled>" + 'true' + "</ssl.enabled>";
    }

    strCfg += "</SEConfig>";
    return strCfg;
}

function getIndexerSearchConfig(collection) {
    var searchservername = "";
    var collectionFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
    collectionFile.setFields(["searchservername"]);
    var collFind = collectionFile.doSelect("kbname = \"" + collection + "\"");
    if (collFind == RC_SUCCESS) {
        searchservername = collectionFile.searchservername;
    }

    var indexport;

    var searchserversFile = new SCFile("kmsearchservers", SCFILE_READONLY);
    var searchserverFind = searchserversFile.doSelect("servername = \"" + searchservername + "\"");

    if (searchserverFind == RC_SUCCESS) {
        var indexinstancename = searchserversFile.searchinstancename;
        var y;
        var length = searchserversFile.servers.length();
        for (y = 0; y < length; y++) {
            if (searchserversFile.servers[y].servertype == "master") {
                var indexhostname = searchserversFile.servers[y].hostname;
                switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
                    case 0:
                        indexport = searchserversFile.servers[y].https_port;
                        break;
                    case -1:
                        return null;
                    default:
                        indexport = searchserversFile.servers[y].port;
                }
            }
        }
    }

    var strCfg = "<SEConfig>";
    strCfg += "<searchhost>" + indexhostname + "</searchhost>";
    strCfg += "<searchport>" + indexport + "</searchport>";
    strCfg += "<searchinstance>" + indexinstancename + "</searchinstance>";

    if (vars.$G_km_globalenv['ssl.enabled']) {
        strCfg += "<ssl.enabled>true</ssl.enabled>";
    }
    strCfg += "</SEConfig>";

    return strCfg;
}
/**
 *  reads the current KMEnvironment record and compares it to the vars.$G_km_globalenv
 *   Used by KMSearchInterface
 */
function kmConfigChanged() {
    var kmEnv = new SCFile("environment", SCFILE_READONLY);
    var rc = kmEnv.doSelect("name = \"knowledge management\"");
    if (kmEnv.km_host != vars.$G_km_globalenv.km_host) {
        vars.$G_km_globalenv.km_host = kmEnv.km_host;
        return true;
    }
    if (kmEnv.km_indexport != vars.$G_km_globalenv.km_indexport) {
        vars.$G_km_globalenv.km_indexport = kmEnv.km_indexport;
        return true;
    }
    if (kmEnv.km_adminport != vars.$G_km_globalenv.km_adminport) {
        vars.$G_km_globalenv.km_adminport = kmEnv.km_adminport;
        return true;
    }
    if (kmEnv.km_searchport != vars.$G_km_globalenv.km_searchport) {
        vars.$G_km_globalenv.km_searchport = kmEnv.km_searchport;
        return true;
    }

    return false;

}
/**
 *@QCNo:QCCR1E63625
 *@Desc:KMUpdate background process error: Field contains an invalid date/time value (scheduler.process,process.javascript)
 *Since K2 default date format is "mm/dd/yy",So when current date format is inconsistent with k2, there are some errors occur
 *during index process. Hence SM must be switch current date format to that is consistent with K2  before index process.
 *so that index process doesn't fail
 *@author:yuli
 *@since:2011/7/21
 **/
function recordToXML(record) {
    var xmlRec;
    var xmlStr;
    if (lib.tzFunctions.getLocalDateOrder() != 1) {
        var tzFile = new SCFile("tzfile");
        var tzFind = tzFile.doSelect("name = \"" + lib.tzFunctions.getLocalTimeZone() + "\"");
        if (tzFind == RC_SUCCESS) {
            var localSeparator = tzFile.date_separator;
            tzFile.date_separator = "/";
            tzFile.date_order = 1;
            funcs.set_timezone(tzFile);
            xmlRec = record.getXML();
            xmlStr = xmlRec.toXMLString();
            tzFile.date_separator = localSeparator;
            tzFile.date_order = lib.tzFunctions.getLocalDateOrder();
            funcs.set_timezone(tzFile);
        }
    } else {
        xmlRec = record.getXML();
        xmlStr = xmlRec.toXMLString();
    }

    return xmlStr;
}


/**
 *  Get security fields defined in scmandanten, scaccess, append query
 *  @param  tablename - table name configured in kmknowledgebase
 *  @param  kbfields - kbfields in kmknowledgebase
 *  @return fields array
 **/
function getSecurityFields(tablename, kbfields) {
    var result = [];
    var mandantFields = lib.IDOLSecurity.require().collectSecurityFields(tablename);
    if (mandantFields.length === 0) {
        return [];
    }

    if (kbfields == null) {
        return mandantFields;
    }

    //loop the mandantFields and check if the fields already in the obj above
    var i;
    for (i = 0; i < mandantFields.length; i++) {
        var balready_in = false;
        var k;
        var flength = kbfields.length();
        for (k = 0; kbfields && k < flength; k++) {
            var _field = kbfields[k];
            if (mandantFields[i] == _field.kbfieldname && _field.match) {
                balready_in = true;
                logger.info("find security field " + mandantFields[i] + " is already defined in the kbfield list");
                break;
            }
        }
        if (!balready_in) {
            result.push(mandantFields[i]);
        }
    }

    return result;
}

function getEntityByLink() {
    var linktable = funcs.get_link_table();
    var linkquery = funcs.get_link_query();

    // Remove the kbname from the link. The kbname is used for adaptive 
    //  learning. The select statement should have only the id in the query.
    var kbnameIndex = linkquery.indexOf("&nbsp;and&nbsp;kbname=");
    if (kbnameIndex >= 0) {
        var kbname = linkquery.substring(kbnameIndex, linkquery.length - 1);
        var qindex = kbname.indexOf("\"");
        kbname = kbname.substring(qindex + 1, kbname.length);
        linkquery = linkquery.substring(0, kbnameIndex);
    }
    // we can determine the kbname if it is not sent in the query
    else {
        //        var kbObject = lib.KMknowledgebase.getKBObjectForFilename(linktable);
        //        var kbname = kbObject.kbname;
    }

    vars.$linktable = linktable;
    vars.$linkquery = linkquery;
}

function kmIDOLDateFormat(date) {
    var out = "";
    if (date && (date instanceof Date)) {
        out += date.getFullYear() + '/';
        if (date.getMonth() < 9) {
            out += "0";
        }
        out += (date.getMonth() + 1) + '/';
        if (date.getDate() < 10) {
            out += "0";
        }
        out += date.getDate();
        out += " ";

        if (date.getHours() < 10) {
            out += "0";
        }
        out += date.getHours() + ":";

        if (date.getMinutes() < 10) {
            out += "0";
        }
        out += date.getMinutes() + ":";

        if (date.getSeconds() < 10) {
            out += "0";
        }
        out += date.getSeconds();
    }

    return out;
}

function getIndexedSCFileArray() {
    if (!vars.$G_kmsearchengine) {
        return;
    }

    vars.$G_indexedSCFileArray = [];

    var kmlibFiles = lib.KMCache.getCache().getAllFiles();

    var libArray;
    if (vars.$G_kmsearchengine == "IDOL") {
        try {
            libArray = lib.KMQuery_IDOL.require().getAllOnLineLibs();
        } catch (ex) {}
    }
    var i = 0;
    var kmlibFile = null;
    while (i < kmlibFiles.length) {
        kmlibFile = kmlibFiles[i];
        if (vars.$G_kmsearchengine != "IDOL") {
            try {
                if (lib.KMCollection_Statistics.checkIndexStatus(kmlibFile.kbname) == 0) {
                    vars.$G_indexedSCFileArray.push(kmlibFile.sclibtablename);
                }
            } catch (e) {}
        } else {
            if (lib.ArrayUtil.contains(libArray, kmlibFile.kbname)) {
                vars.$G_indexedSCFileArray.push(kmlibFile.sclibtablename);
            }
        }

        i++;
    }
}

function isIndexedFile(filename) {
    if (!vars.$G_indexedSCFileArray) {
        getIndexedSCFileArray();
    }

    if (!lib.ArrayUtil.contains(vars.$G_indexedSCFileArray, filename)) {
        return false;
    }

    return true;
}

function checkKMServerActive() {
    logger.info("Checking KM Server active...");

    if (vars.$G_kmsearchengine == "IDOL") {
        return;
    }

    var serverlist = [];

    var kmlibFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
    var fields = [];
    fields.push('sclibtablename');
    fields.push('kbname');
    fields.push('searchservername');
    kmlibFile.setFields(fields);
    var rc = kmlibFile.doSelect(true);

    while (rc == RC_SUCCESS) {
        var serverFile = new SCFile("kmsearchservers");
        var serverFind = serverFile.doSelect("servername = \"" + kmlibFile.searchservername + "\"");
        if (serverFind == RC_SUCCESS) {
            var y;
            var length = serverFile.servers.length();
            for (y = 0; y < length; y++) {
                if (serverFile.servers[y].primarysearcher) {
                    var args = new Datum();
                    args.setType(8);
                    args.push(serverFile.servers[y].hostname);
                    args.push(serverFile.servers[y].port);
                    args.push(serverFile.searchinstancename);
                    if (lib.ArrayUtil.contains(serverlist, serverFile.servers[y].hostname + ":" + serverFile.servers[y].port)) {
                        break;
                    } else {
                        serverlist.push(serverFile.servers[y].hostname + ":" + serverFile.servers[y].port);
                    }
                    var pingResponse = lib.KMSearchInterface.pingEngine(args);
                    var update = false;
                    if (pingResponse == RC_SUCCESS) {
                        if (serverFile.servers[y].active != true) {
                            serverFile.servers[y].active = true;
                            update = true;
                        }
                    } else {
                        if (serverFile.servers[y].active != false) {
                            serverFile.servers[y].active = false;
                            update = true;
                        }
                    }

                    if (update) {
                        logger.info("KM Server " + serverFile.servers[y].hostname + " active is updated to " + serverFile.servers[y].active);
                        serverFile.doUpdate();
                    }
                    break;
                }
            }
        }
        rc = kmlibFile.getNext();
    }

    logger.info("Checking KM Server active is finished.");
}

function getNextPossibleID(filename, field) {
    var f = new SCFile("counters", SCFILE_READONLY);
    f.setFields(["current.value"]);
    var rc = f.doSelect('table.name="' + filename + '"');
    var fitem = new SCFile(filename, SCFILE_READONLY);
    rc = fitem.doSelect('select max(' + field + ') as maxid from ' + filename);
    if (rc == RC_SUCCESS) {
        if (f.current_value < fitem[0] + 1) {
            return fitem[0] + 1;
        }
        return f.current_value;
    }
    return f.current_value;
}


function updatePossibleID(filename, id) {
    var f = new SCFile("counters");
    var rc = f.doSelect('table.name="' + filename + '"');
    f.current_value = id;
    f.doSave();
    logger.info("successfully update counter to " + id + " for " + filename);
}

function fixNULLID(filename, field) {
    var f = new SCFile(filename);
    var rc = f.doSelect(field + '=NULL');
    var cur = -1;
    if (rc == RC_SUCCESS) {
        cur = getNextPossibleID(filename, field);
    }
    var count = 0;
    while (rc == RC_SUCCESS) {
        cur++;
        count++;
        f[field] = cur;
        f.doSave();
        rc = f.getNext();
    }

    if (count > 0) {
        cur++;
        updatePossibleID(filename, cur);
        logger.info("successfully fix " + count + " for " + filename);
    }
}


function setLinks(record) {
    var kmdocument = record;
    var doctype = kmdocument.doctype;
    var km = new SCFile("kmdocument");
    var links = km.links;
    var i = 0;

    // example: <img alt="image text" width="100" height="100" src="scattach://61125A261349068400000564000004FC:Image1.png:kmdocument:KM0012" />
    // example: <a href="scattach://610D65BD0A22178000000EBC0000136C:Test.png:kmdocument:KM0015R">
    // example: <a href="scactivelink://kmdocument:id=&quot;KM0017&quot;"> 
    var re = /(<a href="|<img [^<>]+ src=")(scattach:\/\/|scactivelink:\/\/)([^"]+)("[^<>]*[\/]{0,1}>)/gi;

    //probsol -- problem/solution -- Problem/Solution
    //howto -- question/answer -- Question/Answer
    //errormsg -- error/cause/fix -- Error Message/Cause/Workaround.Fix
    //reference -- reference  -- Reference
    var kmObj = lib.KMCustom.getKmFieldsForLinks();
    var fields = kmObj[doctype];
    if (fields != null) {
        fields.forEach(function(fieldName) {
            var field = kmdocument[fieldName] || "";
            field.replace(re, function() {
                links[i].linkid = RegExp.$3;
                links[i].linktype = getLinkTypeById(RegExp.$3);
                links[i].linkfield = fieldName;
                i = i + 1;
            });
        });
    }
    return links;
}

function getLinkTypeById(id) {
    if (id.startsWith("kmdocument:id")) {
        return "kmdocument";
    } else {
        return "SYSATTACHMENTS";
    }
}

function convertFailtime(file) {
    //convert fail.time from order 1 to current order
    var fta = file['failure.time'].toArray();

    vars.$L_failure_time = [];
    var i;
    for (i = 0; fta && i < fta.length; i++) {
        var newdt = lib.tzFunctions.convertDateStringOnTZ(fta[i], vars.$lo_time_zone, 1, vars.$lo_time_zone, vars.$lo_date_order);
        vars.$L_failure_time.push(newdt);
    }
}

/*****************************************************
  current date format order, default is 1
  '1':'mm/dd/yy', 
  '2':'dd/mm/yy', 20/02/20
  '3':'yy/mm/dd', 20/02/28
  '4':'mm/dd/yyyy', 
  '5':'dd/mm/yyyy', 
  '6':'yyyy/mm/dd'
*****************************************************/
function fixWrongFailtime() {
    var file = new SCFile("kmreindexJob");
    var rc = file.doSelect(true);
    var count = 0;
    while (rc == RC_SUCCESS) {
        var fta = file['failure.time'].toArray();
        var newvalue = [];
        var i;
        for (i = 0; fta && i < fta.length; i++) {
            var old_order = checkDateOrder(fta[i]);
            var item = lib.tzFunctions.convertDateStringOnTZ(fta[i], vars.$lo_time_zone, old_order, vars.$lo_time_zone, 1);
            newvalue.push(item);
        }
        if (newvalue.length > 0) {
            file['failure.time'] = newvalue;
            file.doSave();
            count++;
        }
        rc = file.getNext();
    }
    print("successfully fix " + count + " records for failure.time of kmreindexjob");
}

//only for one or two
function checkDateOrder(strdate) {
    var npos = strdate.indexOf("\/");
    var item1 = strdate.substring(0, npos);
    var npos2 = strdate.indexOf("\/", npos + 1);
    var item2 = strdate.substring(npos + 1, npos2);
    npos = strdate.indexOf(" ");
    if (npos == -1) {
        npos = strdate.length;
    }
    var item3 = strdate.substring(npos2 + 1, npos);
    var order = vars.$lo_date_order;
    var int1 = parseInt(item1);
    var int2 = parseInt(item2);
    var year = parseInt(item3);
    var currentyear = funcs.tod().getYear() % 100;
    var currentmonth = funcs.tod().getMonth();
    var isfullyear = false;

    if (item3.length == 4) {
        isfullyear = true;
    }

    if (item1.length == 4) {
        order = 6;
    } else if (item3.length == 2 && item3 != "20") {
        order = 3;
    } else if (int1 > 12) {
        order = 2;
        if (isfullyear) {
            order = 5;
        }
    } else if (int2 > 12) {
        order = 1;
        if (isfullyear) {
            order = 4;
        }
    } else if (year == currentyear) {
        //can't be future date.
        if (int1 > currentmonth) {
            order = 2;
            if (isfullyear) {
                order = 5;
            }
        } else if (int2 > currentmonth) {
            order = 1;
            if (isfullyear) {
                order = 4;
            }
        }
    }

    return order;
}