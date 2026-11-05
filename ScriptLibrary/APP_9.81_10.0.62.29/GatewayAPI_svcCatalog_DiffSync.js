/*******************************************************************
 *             Different Synchronization                           *
 *                                                                 *
 *******************************************************************/
var lastTriggerLangs; // used for joinsvcDisplayTrigger before delete
var select = lib.GatewayAPI_RAD._select;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getMessage = lib.GatewayAPI_Util.getMessage;
var log = new lib.GatewayAPI_Logger.log('GatewayAPI_svcCatalog_DiffSync');

function getNextNumber() {
    var lReturnCode = new SCDatum();
    var lNumber = new SCDatum();
    funcs.rtecall("getnumber", lReturnCode, lNumber, "svcCatalogDiffSync");

    return funcs.val(lNumber, 1);
}

function getNextVersion() {
    var nextNumber = getNextNumber();

    var dst = new SCFile("diffSyncTrace");
    dst.uid = funcs.get_uid();
    dst.lstVer = nextNumber;
    dst.thisVer = nextNumber;
    dst.sysaddtime = lib.GatewayAPI_RAD._tod();
    dst.doInsert();

    return nextNumber;
}


function attachmentsTrigger(record, oldrecord, triggerType) {
    var type;
    switch (triggerType) {
        case 2:
            type = "add";
            break;
        case 4:
            type = "update";
            break;
        case 5:
        case 6:
            type = "delete";
            break;
        default:
            return 0;
    }

    var name;
    if (type == "add") {
        name = record.topic;
    }
    //type is update and delete
    else {
        name = oldrecord.topic;
    }

    var firstNumber = 0;
    var cds = new SCFile("catalogDiffSync");
    cds.id = getNextNumber();
    firstNumber = cds.id;
    cds.action = "update";
    cds.tablename = "SYSATTACHMENTS";
    cds.catalog_name = name;
    cds.syslanguage = "en";
    cds.doInsert();

    // If triiger type is update, delete all update traces related to this attachment
    if (cds.action == "update") {
        var query = "id<" + firstNumber;
        query += " and tablename=\"SYSATTACHMENTS\" and catalog.name=\"" + name + "\" and action=\"update\"";
        var tcds = new SCFile("catalogDiffSync");
        var tcdsRlt = tcds.doSelect(query);
        while (tcdsRlt == RC_SUCCESS) {
            tcds.doRemove();
            tcdsRlt = tcds.getNext();
        }
    }

    return 0;
}

function joinsvcDisplayTrigger(record, oldrecord, triggerType) {
    var type;
    switch (triggerType) {
        case 2:
            type = "add";
            break;
        case 4:
            type = "update";
            break;
        case 5:
        case 6:
            type = "delete";
            break;
        default:
            return 0;
    }

    var id;
    var name;
    var tj;
    var tr;
    if (type == "add") {
        id = funcs.val(record.file_svcCatalog.id, 1);
        name = record.file_svcCatalog.name;
        lastTriggerLangs = new Array(record.file_svcDisplay.syslanguage);
    } else if (type == "update") {
        id = funcs.val(oldrecord.file_svcCatalog.id, 1);
        name = oldrecord.file_svcCatalog.name;

        var bCatalogSame = isRecordSame(oldrecord.file_svcCatalog, record.file_svcCatalog);
        var bDisplaySame = isRecordSame(oldrecord.file_svcDisplay, record.file_svcDisplay);
        if (bCatalogSame && bDisplaySame) {
            return 0;
        }
        if (bCatalogSame) {
            lastTriggerLangs = [oldrecord.file_svcDisplay.syslanguage];
        } else {
            tj = new SCFile("joinsvcDisplay");
            tr = tj.doSelect("id=\"" + id + "\" and syslanguage like \"*\"");
            lastTriggerLangs = [];
            while (tr == RC_SUCCESS) {
                lastTriggerLangs.push(tj.file_svcDisplay.syslanguage);
                tr = tj.getNext();
            }
        }
    }
    //type is delete
    else {
        id = funcs.val(oldrecord.file_svcCatalog.id, 1);
        name = oldrecord.file_svcCatalog.name;
        if (triggerType == 5) {
            tj = new SCFile("joinsvcDisplay");
            tr = tj.doSelect("id=\"" + id + "\" and syslanguage like \"*\"");
            lastTriggerLangs = [];
            while (tr == RC_SUCCESS) {
                lastTriggerLangs.push(tj.file_svcDisplay.syslanguage);
                tr = tj.getNext();
            }
            return 0;
        }
    }

    var firstNumber = 0;
    var cds = new SCFile("catalogDiffSync");
    cds.action = type;
    cds.tablename = "joinsvcDisplay";
    if (type == 6) {
        cds.tablename = "svcDisplay";
    }
    cds.catalog_id = id;
    cds.catalog_name = name;
    var i;
    for (i = 0; i < lastTriggerLangs.length; i++) {
        cds.id = getNextNumber();
        if (i == 0) {
            firstNumber = cds.id;
        }
        cds.syslanguage = lastTriggerLangs[i];
        cds.doInsert();
    }

    // If triiger type is update, delete all update traces related to this catalog
    if (cds.action == "update") {
        var query = "id<" + firstNumber;
        query += " and tablename=\"joinsvcDisplay\" and catalog.id=" + id + " and action=\"update\"";
        query += " and syslanguage isin " + funcs.str(lastTriggerLangs);
        var tcds = new SCFile("catalogDiffSync");
        var tcdsRlt = tcds.doSelect(query);
        while (tcdsRlt == RC_SUCCESS) {
            tcds.doRemove();
            tcdsRlt = tcds.getNext();
        }
    }

    return 0;
}

function svcCatalogTrigger(record, oldrecord, triggerType) {
    var type;
    switch (triggerType) {
        case 4:
            type = "update";
            break;
        default:
            return 0;
    }

    var id;
    var name;
    var langs = [];
    if (type == "update") {
        id = funcs.val(oldrecord.id, 1);
        name = oldrecord.name;

        if (isRecordSame(oldrecord, record)) {
            return 0;
        }
        var tj = new SCFile("joinsvcDisplay");
        var tr = tj.doSelect("id=\"" + id + "\" and syslanguage like \"*\"");
        while (tr == RC_SUCCESS) {
            langs.push(tj.file_svcDisplay.syslanguage);
            tr = tj.getNext();
        }
    }

    var firstNumber = 0;
    var cds = new SCFile("catalogDiffSync");
    cds.action = type;
    cds.tablename = "joinsvcDisplay";
    cds.catalog_id = id;
    cds.catalog_name = name;
    var i;
    for (i = 0; i < langs.length; i++) {
        cds.id = getNextNumber();
        if (i == 0) {
            firstNumber = cds.id;
        }
        cds.syslanguage = langs[i];
        cds.doInsert();
    }

    // If triiger type is update, delete all update traces related to this catalog
    if (cds.action == "update") {
        var query = "id<" + firstNumber;
        query += " and tablename=\"joinsvcDisplay\" and catalog.id=" + id + " and action=\"update\"";
        query += " and syslanguage isin " + funcs.str(langs);
        var tcds = new SCFile("catalogDiffSync");
        var tcdsRlt = tcds.doSelect(query);
        while (tcdsRlt == RC_SUCCESS) {
            tcds.doRemove();
            tcdsRlt = tcds.getNext();
        }
    }

    return 0;
}

function getCatalogIdByName(lName) {
    var fCatalog = new SCFile("svcCatalog", SCFILE_READONLY);
    fCatalog.setFields("id");
    fCatalog.doSelect("name=\"" + lib.GatewayAPI_RAD.__escapeString(lName) + "\"");

    return funcs.val(fCatalog.id, 1);
}

function svcDisplayTrigger(record, oldrecord, triggerType) {
    var type;
    switch (triggerType) {
        case 2:
            type = "add";
            break;
        case 4:
            type = "update";
            break;
        case 6:
            type = "delete";
            break;
        default:
            return 0;
    }

    var id;
    var name;
    var langs = [];
    if (type == "add") {
        name = record.name;
        id = getCatalogIdByName(name);
        if (id == null) {
            return 0;
        }

        langs.push(record.syslanguage);
    } else if (type == "update") {
        name = oldrecord.name;
        id = getCatalogIdByName(name);
        if (id == null) {
            return 0;
        }

        if (isRecordSame(oldrecord, record)) {
            return 0;
        }
        langs.push(record.syslanguage);
    }
    //delete
    else {
        name = oldrecord.name;
        id = getCatalogIdByName(name);
        if (id == null) {
            return 0;
        }

        langs.push(oldrecord.syslanguage);
    }

    var firstNumber = 0;
    var cds = new SCFile("catalogDiffSync");
    cds.action = type;
    cds.tablename = "joinsvcDisplay";
    if (triggerType == 6) {
        cds.tablename = "svcDisplay";
    }
    cds.catalog_id = id;
    cds.catalog_name = name;
    var i;
    for (i = 0; i < langs.length; i++) {
        cds.id = getNextNumber();
        if (i == 0) {
            firstNumber = cds.id;
        }
        cds.syslanguage = langs[i];
        cds.doInsert();
    }

    // If triiger type is update, delete all update traces related to this catalog
    if (cds.action == "update") {
        var query = "id<" + firstNumber;
        query += " and tablename=\"joinsvcDisplay\" and catalog.id=" + id + " and action=\"update\"";
        query += " and syslanguage isin " + funcs.str(langs);
        var tcds = new SCFile("catalogDiffSync");
        var tcdsRlt = tcds.doSelect(query);
        while (tcdsRlt == RC_SUCCESS) {
            tcds.doRemove();
            tcdsRlt = tcds.getNext();
        }
    }

    return 0;
}


function syncfrVer(lstVer, thisVer) {
    // check for given version number
    var dst = new SCFile("diffSyncTrace");
    var newVer = thisVer;
    if (newVer == null) {
        var dstQry = "lstVer=" + lstVer + " or thisVer=" + lstVer;
        if (dst.doSelect(dstQry) != RC_SUCCESS) {
            return -1; //given lstVer not correct
        }
        var syncType = (lstVer == dst.lstVer) ? "lstVer" : "thisVer";

        // get diffSync Array
        newVer = getNextNumber();
    }
    var result = lib.GatewayAPI_RAD.catalog_sync_fr_ver(lstVer, newVer);
    var ids = result.numbers; //changed catalog ids
    var langs = result.prompt; //the related language of catalog ids 
    var actions = result.types; //the related actions of catalog ids
    var names = result.names; //attachment changed catalog names
    var filenames = result.sort; //the related filename of catalog ids

    var syncLangArray = []; //sync language array
    var syncAttachmentArray = []; //sync attachment array
    var resultArray = []; //sync result

    // Just for QA output
    var i;
    var length = ids.length();
    for (i = 0; i < length; i++) {
        var syncLang = new catalogSyncLang(ids[i], langs[i], actions[i], filenames[i]);
        syncLangArray.push(syncLang);
    }
    length = names.length();
    for (i = 0; i < length; i++) {
        var syncAtt = new catalogSyncAttachment(names[i], "update");
        syncAttachmentArray.push(syncAtt);
    }

    // for QA test ends

    // update trace record
    if (thisVer == null) {
        if (syncType == "lstVer") {
            dst.thisVer = newVer;
        } else {
            dst.lstVer = dst.thisVer;
            dst.thisVer = newVer;
        }
        dst.doUpdate();
    }

    resultArray[0] = syncLangArray;
    resultArray[1] = syncAttachmentArray;
    resultArray[2] = newVer;

    return resultArray;
}

function arrangeDiffSyncTrace() {
    var dst = new SCFile("diffSyncTrace");
    var dstQry = "tod()-modtime(currec())>'3 00:00:00'"; // record not used for 3 days
    var dstRlt = dst.doSelect(dstQry);
    while (dstRlt == RC_SUCCESS) {
        dst.doRemove();
        dstRlt = dst.getNext();
    }
}

function removeNotUsedDiffSync() {
    arrangeDiffSyncTrace();

    var dst = new SCFile("diffSyncTrace", SCFILE_READONLY);
    dst.setFields("lstVer");
    var dstRlt = dst.doSelect("true");
    var minID = dst.lstVer;
    while (dstRlt == RC_SUCCESS) {
        if (dst.lstVer < minID) {
            minID = dst.lstVer;
        }
        dstRlt = dst.getNext();
    }

    var cds = new SCFile("catalogDiffSync");
    var cdsQry = "true";
    if (minID != null) {
        cdsQry += " and id<" + minID;
    }
    var cdsRlt = cds.doSelect(cdsQry);
    while (cdsRlt == RC_SUCCESS) {
        cds.doRemove();
        cdsRlt = cds.getNext();
    }
}

function isRecordSame(o, n) {
    var ignoreFields = ["sysmoduser", "sysmodtime", "sysmodcount"];

    var i = 0;
    // backup
    var backup = [];
    for (i = 0; i < ignoreFields.length; i++) {
        backup[i] = o[ignoreFields[i]];
    }
    // copy new
    for (i = 0; i < ignoreFields.length; i++) {
        o[ignoreFields[i]] = n[ignoreFields[i]];
    }
    // compare
    var bSame = funcs.same(funcs.denull(o), funcs.denull(n));
    // write back
    for (i = 0; i < ignoreFields.length; i++) {
        o[ignoreFields[i]] = backup[i];
    }

    return bSame;
}

function catalogSyncLang(id, language, action, filename) {
    this.id = id;
    this.language = language;
    this.action = action;
    this.filename = filename;
}

function catalogSyncAttachment(name, action) {
    this.name = name;
    this.action = action;
}

function getSyncfrVerAPI() {
    var lstVer = vars.$L_file.lstVer;

    if (lstVer == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(getMessage(147));
        return;
    }

    var showDetail = vars.$L_file['showDetail'] == null ? false : vars.$L_file['showDetail'];
    if (showDetail == false) {
        vars.$L_file['thisVer'] = null;
    }
    var thisVer = vars.$L_file['thisVer'];
    if (thisVer == null && showDetail == true) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(getMessage(148));
        return;
    }

    if (showDetail == true) {
        var dst = new SCFile("diffSyncTrace", SCFILE_READONLY);
        dst.setFields("uid");
        var dstQry = "lstVer=" + lstVer + " and thisVer=" + thisVer;
        if (dst.doSelect(dstQry) != RC_SUCCESS) {
            setExitType(BAD_VALIDATION_EXIT);
            setErrorMsg(getMessage(149));
            return;
        }
    }

    var syncRes = syncfrVer(lstVer, thisVer);
    if (syncRes == -1) {
        setExitType(NO_RECORD_EXIT);
        return;
    }


    var syncLang = syncRes[0]; //sync language array
    var syncAttachment = syncRes[1];

    if (showDetail == true) {

        var total = 0;
        var pagesize = vars.$L_file['pagesize'] == null ? 10 : vars.$L_file['pagesize'];
        vars.$L_file.pagesize = pagesize;
        var start = vars.$L_file['start'] == null ? 1 : vars.$L_file['start'];
        if (start <= 0) {
            start = 1;
        }
        var end = start + pagesize - 1;
        var index = 0;
        var i;
        var catalog;
        if (start <= syncLang.length) {
            for (i = 0; i < syncLang.length; i++) {
                if (total >= end) {
                    break;
                }
                if (total >= start - 1) {
                    if (syncLang[i].action != "delete") {
                        catalog = select(lib.GatewayAPI_Constants.JOINSVCDISPLAY_FILENAME(), "id=" + syncLang[i].id + ' and syslanguage="' + syncLang[i].language + '"');
                        if (catalog != null) {
                            vars.$L_file.catalog[index]['catalogid'] = catalog['id'] + "";
                            if (catalog['cost'] != null) {
                                vars.$L_file.catalog[index]['cost'] = catalog['cost'] + "";
                            }
                            vars.$L_file.catalog[index]['currency'] = catalog['currency'];
                            if (vars.$L_file.catalog[index]['currency'] == null || vars.$L_file.catalog[index]['currency'] == "") {
                                vars.$L_file.catalog[index]['currency'] = vars.$G_root_currency;
                            }
                            vars.$L_file.catalog[index]['description'] = catalog['description'];
                            vars.$L_file.catalog[index]['detailedDescription'] = catalog['detailedDescription'];
                            vars.$L_file.catalog[index]['displayName'] = catalog['displayName'];
                            vars.$L_file.catalog[index]['lang'] = catalog['syslanguage'];
                            vars.$L_file.catalog[index]['name'] = catalog['name'];
                            vars.$L_file.catalog[index]['type'] = catalog['type'];
                            vars.$L_file.catalog[index]['non.cart'] = catalog['non.cart'];
                            vars.$L_file.catalog[index]['support.item'] = catalog['support.item'];
                            vars.$L_file.catalog[index]['infoOnly'] = catalog['infoOnly'];
                            vars.$L_file.catalog[index]['active'] = catalog['active'];
                            var parentlist = catalog['parent'];
                            if (parentlist != null && parentlist.length() > 0) {
                                var j;
                                var plength = parentlist.length();
                                for (j = 0; j < plength; j++) {
                                    if (parentlist[j] != null) {
                                        vars.$L_file.catalog[index].parent = parentlist[j];
                                        break;
                                    }
                                }
                            }
                            if (catalog['recurring.cost'] != null) {
                                vars.$L_file.catalog[index]['recuringcost'] = catalog['recurring.cost'] + "";
                            }
                            vars.$L_file.catalog[index]['recurringCostInterval'] = catalog['recurring.cost.interval'];
                            vars.$L_file.catalog[index]['action'] = syncLang[i].action;
                        }
                    } else {
                        vars.$L_file.catalog[index]['catalogid'] = syncLang[i].id + "";
                        vars.$L_file.catalog[index]['action'] = syncLang[i].action;

                        if (syncLang[i].filename == 'joinsvcDisplay' || syncLang[i].filename == 'svcDisplay') {
                            vars.$L_file.catalog[index]['language'] = syncLang[i].language;
                        }
                    }
                    index++;
                }
                total++;
            }
        } else {
            total = syncLang.length;
        }

        index = 0;

        if (total <= end) {
            for (i = 0; i < syncAttachment.length; i++) {
                if (total >= end) {
                    break;
                }
                if (total >= start - 1) {
                    catalog = select(lib.GatewayAPI_Constants.SVCCATALOG_FILENAME(), 'name="' + syncAttachment[i]['name'] + '"');
                    if (catalog != null) {
                        vars.$L_file.attachmentCat[index]['attCatalogid'] = catalog['id'] + "";
                        vars.$L_file.attachmentCat[index]['attCatalogName'] = catalog['name'];
                        index++;
                    }
                }
                total++; //for QCCR1E106278
            }
        }
    } else {
        vars.$L_file['thisVer'] = syncRes[2];
    }

    vars.$L_file._count = syncLang.length + (syncAttachment.length || 0);
    setExitType(NORMAL_EXIT);
}