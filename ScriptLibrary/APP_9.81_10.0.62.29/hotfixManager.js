/**
Interface 
    start
    postReadType
    addToList
    showList
*/

function start() {
    vars.$L_fileInfoList = [];
    vars.$L_fileList = [];

    vars.$hotfixObjTypeList = [];
    vars.$hotfixObjNameList = [];
    vars.$hotfixResultList = [];
    vars.$hotfixActionList = [];
    vars.$hotfixIndexList = [];

    vars.$hotfix = null;
    vars.$hotfix_crid = null;
    vars.$hotfix_summary = null;
    vars.$hotfix_smversion = null;
    vars.$hotfix_buildtime = null;
    vars.$hotfix_description = null;
    vars.$fileInfoList = {};
    vars.$fileList = {};
    vars.$hotfix_result = "";
    vars.$hotfix_compare_xml = "";
    vars.$hotfixSelectedLine = 1;
}

function postReadType() {}

/**
 * Input
    type
    file
    actioncode
    status
   
   Output
    vars.$L_fileInfoList
    vars.$L_fileList
   
    vars.$hotfix
    vars.$hotfix_crid
    vars.$hotfix_summary
    vars.$hotfix_smversion
    vars.$hotfix_buildtime
    vars.$hotfix_description
 */
function addToList(type, file, actionCode, status) {

    var sig = null;
    // skip hotfix and signatures
    if ("hotfix" == type) {
        vars.$hotfix = file;
        vars.$hotfix_crid = file.crid;
        vars.$hotfix_summary = file.summary;
        vars.$hotfix_smversion = file.smversion;
        vars.$hotfix_buildtime = file.buildtime;
        vars.$hotfix_description = file.description;
        return;
    }

    if (type == "dbdict" && "hotfix" == file.name) {}

    if ("signatures" == type) {
        file.doSave();
        return;
    }

    if ((type == "dbdict" && "signatures" == file.name) || "signatures" == type) {
        return;
    }

    if (type == "signaturemake") {
        file.doSave();
        return;
    }

    var name = null;
    var queryStr = null;
    if (type == "dbdict") {
        name = file.name;
        queryStr = "name=\"" + name + "\"";
    } else {
        name = fileToString(vars.$L_dbdict, file);
        queryStr = getKeys(vars.$L_dbdict, file);
    }

    vars.$L_fileInfoList.push([type, name, actionCode, status, queryStr]);
    vars.$L_fileList.push(file);
}

/**
    vars.$hotfixObjTypeList = [];
    vars.$hotfixObjNameList = [];
    vars.$hotfixResultList = [];
    vars.$hotfixActionList = [];
    vars.$hotfixIndexList = [];
    
    vars.$fileInfoList
    vars.$fileList
 *
 */
function showList() {
    var sigMakes = {};

    vars.$hotfixObjTypeList = [];
    vars.$hotfixObjNameList = [];
    vars.$hotfixResultList = [];
    vars.$hotfixActionList = [];
    vars.$hotfixIndexList = [];
    vars.$hotfixResolveList = [];
    vars.$hotfixIndexBeginList = [];
    var newFileList = [];
    var newFileInfoList = [];

    var item;

    var i;
    var length = vars.$L_fileInfoList.length();
    for (i = 0; i < length; i++) {
        var item0 = vars.$L_fileInfoList[i];
        item0.push(i);
        item0.push(i);
        item = item0.toArray();

        if (item[0] == "dbdict" && item[1] == "dbdict") {
            continue;
        }

        if (item[0] == "dbdict" && item[2] == 101) {
            if (dbdictExist(item[1])) {
                continue;
            }

            if (isJoinFile(item[1])) {
                continue;
            }
        }

        var file = vars.$L_fileList[i];
        newFileList.push(file);
        newFileInfoList.push(item);
    }

    for (i = 0; i < newFileInfoList.length; i++) {
        item = newFileInfoList[i];

        vars.$L_record = newFileList[i];

        if (item[0] == "format") {
            if (i + 1 < newFileInfoList.length &&
                isRAD(newFileInfoList[i + 1]) && "scmessage" != newFileInfoList[i + 1][0]) {
                var itemCode = null;
                var k;
                for (k = i + 1; k < newFileInfoList.length; k++) {
                    var itemRad = newFileInfoList[k];
                    if (itemRad[0] == "code") {
                        itemCode = itemRad;
                        vars.$L_record = newFileList[k];
                    }
                    if (!isRAD(itemRad)) {
                        break;
                    }
                }

                if (itemCode) {
                    i = k - 1;
                    pushFile(["RAD", item[1], item[2], itemCode[3], itemCode[4], itemCode[5], item[6]], sigMakes);
                } else {
                    pushFile(item, sigMakes);
                }
            } else {
                pushFile(item, sigMakes);
            }
        } else {
            if (item[3] == "unknown" || item[3] == "unknownData") {
                pushFile(item, sigMakes, "Added");
            } else {
                pushFile(item, sigMakes);
            }
        }
    }

    vars.$fileInfoList = vars.$L_fileInfoList;
    vars.$fileList = vars.$L_fileList;
}

function pushFile(item, sigMakes, status) {
    if (item[0] == "scmessage" && item[2] == "202") {}

    if (item[0] == "dbdict" && item[2] == "101") {}

    if (!status) {
        status = getFileStatus(item[0], vars.$L_record, sigMakes);
    }

    vars.$hotfixObjTypeList.push(item[0]);
    vars.$hotfixObjNameList.push(item[1]);
    vars.$hotfixResultList.push(status);
    vars.$hotfixActionList.push(getAction(item[2]));
    vars.$hotfixIndexList.push(item[5]);
    vars.$hotfixIndexBeginList.push(item[6]);
    vars.$hotfixResolveList.push(status);
}

function getFileStatus(fileName, file, sigMakes) {
    var tag = getTag(file);
    var query = getTagQuery(file, tag);
    var sigQuery = null;
    if ("RAD" == fileName) {
        fileName = "code";
    }
    try {
        var sig = null;
        var fileOld = new SCFile(fileName);
        if (RC_SUCCESS == fileOld.doSelect(query)) {

            // Cache signaturemake
            if (sigMakes[fileName]) {

            } else {
                var file1 = new SCFile("signaturemake");
                file1.doSelect("table.name=\"" + fileName + "\"");
                sigMakes[fileName] = file1;
            }

            // Init sig make
            var fields = sigMakes[fileName].fields;
            var type = sigMakes[fileName].fieldarray_type;

            sigQuery = getSigQuery(file, sigMakes[fileName], fileName);
            if (null == type) {
                type = new SCDatum();
                type.setType(1);
                type.setValue(0);
                fields = new SCDatum();
                fields.setType(8);
            }

            // Make sig for old and new records
            sig = funcs.make_sig(fileOld, fields, type);
            var sigNew = funcs.make_sig(file, fields, type);

            if (sig == sigNew) {
                return "Already Current";
            }

            if (fileName == "code" || fileName == "dbdict" || fileName == "displaycache") {
                return "Updated";
            }
        } else {
            return "Added";
        }
    } catch (e) {
        print(e);
    }

    var sigFile = new SCFile("signatures", SCFILE_READONLY);
    sigFile.setFields("signature");
    var ret = sigFile.doSelect(sigQuery);

    while (RC_SUCCESS == ret) {
        if (sigFile.signature == sig) {
            return "Updated";
        }
        ret = sigFile.getNext();
    }

    return "Conflict";
}

/**
 */
function isRAD(item) {
    var filename = null;
    if (item[0] == "dbdict") {
        filename = item[1];
    } else {
        filename = item[0];
    }

    if ("enclapplication" == filename || "code" == filename || "application" == filename || "enclapplrev" == filename || "scmessage" == filename) {
        return true;
    }

    return false;
}

function getTag(file) {
    var tag = new SCDatum();
    funcs.rtecall("tag", 1, tag, file);
    var tagStr = tag.getText();
    return tagStr;
}

function getTagQuery(file, tag) {
    var fileTag = new SCFile();
    funcs.fduplicate(fileTag, file);

    var query = new SCDatum();
    var ret = 0;
    funcs.rtecall("tagquery", ret, fileTag, query, tag);

    return query.getText();
}

function fileToString(dbdict, file) {

    var filename = dbdict.name;

    if ("dbdict" == filename) {
        return file.name;
    }

    if ("format" == filename) {
        return file.name;
    }

    if ("formatctrl" == filename) {
        return file.name;
    }

    if ("displayevent" == filename) {
        return file.id;
    }

    if ("displayscreen" == filename) {
        return file.screen_id;
    }

    if ("displayoption" == filename) {
        return file.id;
    }

    if ("ioaction" == filename) {
        return file.name;
    }

    if ("link" == filename) {
        return file.name;
    }

    if ("menu" == filename) {
        return file.name;
    }

    if ("notification" == filename) {
        return file.name;
    }

    if ("Object" == filename) {
        return file.file_name;
    }

    if ("Process" == filename) {
        return file.process;
    }

    if ("ScriptLibrary" == filename) {
        return file.name;
    }

    if ("States" == filename) {
        return file.state;
    }

    if ("application" == filename) {
        return file.application + "-" + file.label;
    }

    return getKeys(dbdict, file);
}

function strParam(value) {
    return "\"" + value + "\"";
}

function getAction(type) {

    if ("101" == type) { return "create"; }
    if ("102" == type) { return "replace"; }
    if ("103" == type) { return "remove"; }
    if ("104" == type) { return "keys"; }
    if ("105" == type) { return "map"; }
    if ("106" == type) { return "both"; }

    if ("201" == type) { return "update"; }
    if ("202" == type) { return "add only"; }
    if ("203" == type) { return "delete"; }

    if ("301" == type) { return "execute"; }

    return "unknown";
}


/**
Is Description Record?
 */
function isDbdict(fileInfo) {
    if ("dbdict" != fileInfo[1]) {
        return false;
    }

    if (fileInfo[2] != "101" && fileInfo[2] != "102" && fileInfo[2] != "103" && fileInfo[2] != "104" && fileInfo[2] != "105" && fileInfo[2] != "106") {
        return false;
    }

    return true;
}


function saveHotfixInfo() {
    if (!vars.$hotfix) {
        return;
    }

    var hotfixCopy = new SCFile("hotfix");
    funcs.fduplicate(hotfixCopy, vars.$hotfix);

    updateHotfix(hotfixCopy);
    hotfixCopy.doSave();
}

function updateHotfix(hotfix) {
    hotfix.applytime = funcs.tod();
    hotfix.loadby = funcs.scmsg(61, "hm");
    hotfix.files = [];

    var i;
    var length = vars.$hotfixObjTypeList.length();
    for (i = 0; i < length; i++) {

        var fileIndex = vars.$hotfixIndexList[i];
        var query = vars.$fileInfoList[fileIndex].toArray()[4];
        hotfix.files[i].files_file = vars.$hotfixObjTypeList[i];
        hotfix.files[i].files_name = vars.$hotfixObjNameList[i];
        hotfix.files[i].files_query = query; // vars.$hotfixObjNameList[i];
        hotfix.files[i].files_status = vars.$hotfixResultList[i];
        hotfix.files[i].files_content = "";
        hotfix.files[i].files_resolved = vars.$hotfixResolveList[i];

        if ("RAD" == vars.$hotfixObjTypeList[i]) {
            hotfix.files[i].files_query = "application.name=\"" + vars.$hotfixObjNameList[i] + "\"";
        }
    }
}


/**
 * execute post script
 */
function runPostScript() {
    if (!vars.$hotfix) {
        return;
    }

    var script = vars.$hotfix.script;
    if (script != null && script.length > 0) {
        eval(script);
    }
}


function getSigQuery(file, makeFile, fileName) {
    var query = null;
    var obName = "";

    var key = funcs.denull(makeFile.key);

    if (fileName == "wdCodeDetails") {
        obName = validateStr(file.wdCodeID) + ":" + validateStr(file.wdCodeType);
    } else {

        var keyLength = key.length();

        if (fileName == "erddef") {
            key = ["file1", "file2", "file1.names", "file2.names"];
            keyLength = key.length;
        }

        var i;
        for (i = 0; i < keyLength; i++) {
            if (fileName == "help" && "syslanguage" == key[i]) {

            } else {
                obName += validateStr(file[key[i]]);
            }
        }

        obName = obName.replace(/"/g, "\\\"");
    }

    if (fileName == "help") {
        query = "object.type=\"help\" and object.name=\"" + obName + "en\"";
    } else if (fileName == "enclapplication") {
        query = "object.type=\"code\" and object.name=\"" + file.application_name + "\"";
    } else {
        query = "object.type=\"" + fileName + "\" and object.name=\"" + obName + "\"";
    }

    return query;
}

function validateStr(str) {
    if (null == str) {
        return "NULL";
    }

    return funcs.str(str);
}


function dbdictExist(name) {
    var file = new SCFile("dbdict", SCFILE_READONLY);
    file.setFields("name");
    var ret = file.doSelect("name=\"" + name + "\"");

    return RC_SUCCESS == ret;
}

function isJoinFile(name) {
    var file = new SCFile("joindefs", SCFILE_READONLY);
    file.setFields("join.name");
    var ret = file.doSelect("join.name=\"" + name + "\"");

    return RC_SUCCESS == ret;
}

function getKeys(dbdict, file) {
    var keyList = dbdict[1];

    var uniqueKey = null;

    var i;
    for (i in keyList) {
        if (keyList[i][0] == 12 || keyList[i][0] == 28) {
            uniqueKey = keyList[i][1];
            break;
        }
    }

    var str = "";
    var begin = false;
    for (i in uniqueKey) {
        var value = getFieldValue(dbdict, file, uniqueKey[i]);
        if (value != "") {
            if (begin) {
                str = str + " and ";
            }
            begin = true;

            if (value == null) {
                value = '';
            }

            str += uniqueKey[i] + "=\"" + value + "\"";
        }
    }

    return str;
}

/**
Input: dbdict, file, fieldName

fieldName could be structure field with format "file.sfcDisplay,name"

*/
function getFieldValue(dbdict, file, fieldName) {
    var strField = fieldName;
    var fieldNameList = [];
    var index = 0;
    while (-1 != (index = strField.indexOf(','))) {
        var field1 = strField.substr(0, index);
        strField = strField.substr(index + 1);
        fieldNameList.push(field1);
    }

    fieldNameList.push(strField);

    var fieldList = dbdict[0];
    var field = null;
    var fieldValue = file;
    var k = 0;

    var i;
    for (i in fieldList) {

        if (fieldList[i][0] == fieldNameList[k]) {

            k++;
            field = fieldList[i];

            var fieldIndex = 0;
            if (k == 1) {
                fieldIndex = field[2] - 1;
            } else {
                fieldIndex = field[2] - 1;
            }

            fieldValue = fieldValue[fieldIndex];
        }
    }

    return fieldValue;
}


function debug(msg) {}

function escapeStr(str) {
    if (null == str) {
        return null;
    }

    var ret = "";
    var i;
    for (i = 0; i < str.length; i++) {
        var c = str[i];
        if (c == '"') {
            ret += "\\\"";
        } else if (c == '\\') {
            ret += "\\\\";
        } else {
            ret += str[i];
        }
    }

    return ret;
}

function hotfixDetailBefore() {
    var line = vars.$hotfixSelectedLine;
    if (!line) {
        line = 1;
    }
    funcs.cursor_field_name_set("$hotfixObjTypeList", line);
}

function hasConflictItem() {
    var i;
    var length = vars.$hotfixResultList.length();
    for (i = 0; i < length; i++) {
        if (vars.$hotfixResultList[i] == "Conflict") {
            var msg = funcs.scmsg(23, "hm");
            print(msg);
            vars.$hotfixSelectedLine = i + 1;
            return true;
        }
    }

    return false;
}


function prepareMergeData() {
    vars.$hotfixSelectedLine = funcs.cursor_line(1);
    var line = funcs.cursor_line(1);
    var size = funcs.lng(vars.$hotfixIndexList);
    if (size == 0) {
        vars.$hotfix_compare_xml = null;
        return;
    }

    var lineIndex = parseInt(line) - 1;

    var fileIndex = vars.$hotfixIndexList[lineIndex];
    var fileName = vars.$hotfixObjTypeList[lineIndex];
    var status = vars.$hotfixResultList[lineIndex];
    var msg;

    if ("RAD" == fileName) {
        fileName = "code";
        vars.$hotfix_compare_xml = null;
        msg = funcs.scmsg(21, "hm");
        print(msg);
        return;
    }

    if ("dbdict" == fileName) {
        vars.$hotfix_compare_xml = null;
        msg = funcs.scmsg(22, "hm");
        print(msg);
        return;
    }

    if ("displaycache" == fileName) {
        vars.$hotfix_compare_xml = null;
        msg = funcs.scmsg(67, "hm");
        print(msg);
        return;
    }

    if ("Added" == status) {
        vars.$hotfix_compare_xml = null;
        msg = funcs.scmsg(20, "hm");
        print(msg);
        return;
    }

    var file = vars.$fileList[fileIndex];
    var fileSave = new SCFile(fileName);
    funcs.fduplicate(fileSave, file);

    var keyStr = vars.$fileInfoList[fileIndex].toArray()[4];
    var fileCustomer = new SCFile(fileName, SCFILE_READONLY);
    fileCustomer.doSelect(keyStr);

    var xmlDiff = new XML("mergedata");
    var xmlSrc = new XML("source");
    var xmlTgt = new XML("target");
    var xmlAncestor = new XML("ancestor");

    var strSrc = fileCustomer.getXML().toXMLString();
    var strTgt = fileSave.getXML().toXMLString();

    xmlSrc.setAttributeValue("name", "Source File");
    xmlSrc.setText(strSrc.replace(/></g, ">\n<"));

    xmlTgt.setAttributeValue("name", "Target File");
    xmlTgt.setText(strTgt.replace(/></g, ">\n<"));

    xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlSrc);
    xmlDiff = lib.xmlHelpers.addChildElement(xmlDiff, xmlTgt);

    vars.$hotfix_compare_xml = xmlDiff.toXMLString();
    vars.$hotfix_merge_resolved = (vars.$hotfixResultList[vars.$hotfixSelectedLine - 1] == "Reconciled");
}


function appendApplyMessage(msg) {
    print(msg);
    vars.$L_total_msg += msg + "\r\n";
}

function appendTotalMessage(status) {
    var msg = funcs.scmsg(status ? 10 : 11, "hm");
    print(msg);
    vars.$hotfix_result = msg + "\r\n\r\n" + vars.$L_total_msg;
}


function mergeSave() {
    vars.$hotfixResultList[vars.$hotfixSelectedLine - 1] = vars.$hotfix_merge_resolved ? "Reconciled" : vars.$hotfixResolveList[vars.$hotfixSelectedLine - 1];
    var strTargetXML = lib.xmlHelpers.getTargetXML(vars.$hotfix_compare_xml);
    strTargetXML = lib.xmlHelpers.fixQuotes(strTargetXML);

    var fileIndex = vars.$hotfixIndexList[vars.$hotfixSelectedLine - 1];
    var fileName = vars.$hotfixObjTypeList[vars.$hotfixSelectedLine - 1];

    var fFile = new SCFile(fileName);
    var query = vars.$fileInfoList[fileIndex].toArray()[4];
    fFile.doSelect(query);
    fFile.setRecord(strTargetXML);

    vars.$fileList[fileIndex] = fFile;
}


function sortHotfixFiles(hotfix) {
    var files = lib.ArrayUtil.toJsArray(hotfix.files);
    if (files == null) {
        return;
    }

    var sorted = lib.ArrayUtil.sortBy(files, function(obj) {
        if (obj[0] != null) {
            var name = obj[0];
            var query = obj[1];

            // move dbdict to top 1
            if (name == 'dbdict') {
                name = '001';
            }

            // move displayoption after displayscreen
            if (name == 'displayoption') {
                name = 'displayscreen~option';
            }

            // And move format to the end
            if (name == 'format') {
                name = 'zzzzzzz';
            }

            // move rad before format
            if (name == 'RAD') {
                name = 'zzzzz';
            }
            return name + query;
            // return name;
        }
    });

    hotfix.files = lib.ArrayUtil.toSCDatum(sorted);
}


/**
 * get supported application versions
 * 
 * @returns [Array]
 */
function getSupportedVersions() {
    return [
        "SM9.81",
        "SM9.80",
        "SM9.72",
        "SM9.71",
        "SM9.70",
        "SM9.64",
        "SM9.63",
        "SM9.62",
        "SM9.61",
        "SM9.60",
        "SM9.52",
        "SM9.51",
        "SM9.50",
        "SM9.41",
        "SM9.40",
        "SM9.35",
        "SM9.34",
        "SM9.33",
        "SM9.32",
        "SM9.31",
        "SM9.30",
        "SM9.21",
        "SM7.11"
    ];
}