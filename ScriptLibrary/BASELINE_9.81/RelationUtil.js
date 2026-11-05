var $ = lib.c.$;

var scmsg = funcs.scmsg;
var nullsub = funcs.nullsub;

var getRecordTag = lib.localizeTable.getRecordTag;
var getRights = lib.security.getRights;
var getArea = lib.security.getArea;

var securityActionMap = {
    "Problem": "rc",
    "Service Desk": "call",
    "Change": "chg",
    "Incident": "inc",
    "Knowledge": "km",
    "Quote": "qte",
    "Request": "rm",
    "Service Level Management": "agreemt",
    "Service Catalog": "cat"
};

var msgClassForScrelationtype = "local:screlationtype";

function getValueTag(record) {
    return record["value"] + ";" + record["source.file"] + ";" + record["target.file"] + ";" + record["source.type"] + ";" + record["target.type"];
}

function addMessageForValue(record) {
    var text = record["value"];
    var tag = getValueTag(record);

    var activeLanguages = lib.localizeTable.getActiveLanguages();
    var i;
    for (i = 0; i < activeLanguages.length; i++) {
        var language = activeLanguages[i];
        var message = $("scmessage", SCFILE_READONLY).select(
            'syslanguage="' + language + '" and class="' + msgClassForScrelationtype +
            '" and message.id="' + tag + '"').uniqueResult();
        if (message == null) {
            message = new SCFile("scmessage");
            message.syslanguage = language;
            message._class = msgClassForScrelationtype;
            message.message_id = tag;
            message.message = text;

            message.doInsert();
        }
    }
}

function updateMesssageForValue(record, oldRecord) {
    deleteMessageForValue(oldRecord);
    addMessageForValue(record);
}

function deleteMessageForValue(record) {
    var tag = record["value"] + ";" + record["source.file"] + ";" + record["target.file"] + ";" + record["source.type"] + ";" + record["target.type"];
    $("scmessage").select(
        'syslanguage~="xxx" and class="' + msgClassForScrelationtype + '" and message.id="' + tag +
        '"').iterate(function(scmsg) {
        scmsg.doDelete();
    });
}

/**
 * This function is used to unlink the record selected
 * 
 * @param {String}
 *          cursorLine - The line number of record that is selected
 * @returns
 * @type Void
 */
function deleteRecord(cursorContent) {
    var depend = cursorContent;
    var relation = new SCFile("screlation");
    var sql = "(depend=\"" + depend + "\"" + " and source =\"" + vars.$source + "\") or " +
        "(depend=\"" + vars.$source + "\"" + " and source =\"" + depend + "\")";
    var rc = relation.doSelect(sql);
    while (rc == RC_SUCCESS) {
        relation.doDelete();
        rc = relation.getNext();
    }
}

/**
 * This function is used to check whether user have rights to do a link action ,either link new or link existing
 * 
 * @param {String}
 *          secArea - rootcause , probsummary etc..
 * @param {String}
 *          actionType - the prefix for the action , say "assoc" for associate and "open" for link new record
 * @param {String}
 *          fileName - the target file name which is only used for specific handle for Quote, because in hybrid
 *                     mode the legacy/PD request modules are allowed to co-exist.
 * @returns
 * @type Boolean
 */
function isAuthorizedAction(secArea, actionType, fileName) {
    if (vars.$bypass_bg_authcheck) {
        return true;
    }

    var msgVariable = null;
    if (secArea != null) {
        msgVariable = (secArea == "Service Desk") ? "interaction" : secArea.toLowerCase();
    } else {
        msgVariable = fileName;
    }

    var ret = null;
    if (actionType == "open") {
        if ((secArea != null && !funcs.val(getRights(secArea, "new"), 4)) ||
            (secArea == null && fileName === "ocmq" && vars["$G.ocmq.environment"]["new"] != true)) {
            funcs.rtecall("msg", ret, scmsg("4", "relation", [msgVariable]), 3);
            return false;
        }
    } else { // assoc,unlink , operator will need "update" privilege for this operation
        if ((secArea != null && !funcs.val(getRights(secArea, "view"), 4)) ||
            (secArea == null && fileName === "ocmq" && vars["$G.ocmq.environment"]["new"] != true)) {
            var messageId = actionType == "assoc" ? "5" : "6";
            funcs.rtecall("msg", ret, scmsg(messageId, "relation", [msgVariable]), 3);
            return false;
        }
    }

    return true;
}

/**
 * This function is used to check whether the record selected belong to the related section. Meanwhile , if the return value is true , the corresponding message used for popup message will also be initialized here
 * 
 * @param {String}
 *          cursorField - The cursor field that is clicked
 * @param {String}
 *          cursorContent - The cursor content that is selected
 * @returns
 * @type Boolean
 */
function isRelationRecordSelected(cursorField, cursorContent) {

    if (cursorField == "depend") {
        var type = $("screlation", SCFILE_READONLY).select('source="' + vars.$source + '" and depend="' + cursorContent + '"').uniqueResult();

        //var dependFilename = vars.$relatedFilename[cursorLine - 1];
        var dependFilename = type['depend.filename'];
        var relationType = type['type'];
        if (dependFilename == "incidents" && (relationType == "Trigger From" || relationType == "Fulfillment From Interaction")) {
            var rteReturnValue = new SCDatum();
            var rteNames = new SCDatum();
            var rteVals = new SCDatum();
            rteNames.setType(8); //type array
            rteNames.push("name"); //Ruleset Name - INTO.NAME
            rteVals.setType(8);
            rteVals.push("unlink.sd.message"); //RuleSet Name
            funcs.rtecall("callrad", rteReturnValue, "Ruleset.run", rteNames, rteVals, true); //false to run in the same thread, true to run in new one.  
            return false;
        }
        var secArea = getArea(dependFilename);
        if (secArea != null && secArea != "Knowledge") {
            if (!isAuthorizedAction(secArea, "unlink", dependFilename)) {
                return false;
            }
        }

        // initialize the message variable
        vars.$L_message = scmsg("1", "relation", [cursorContent]);
        return true;
    }

    var ret = null;
    var selectRecordMsgNumber = lib.BaseUtil.isWindowsClient() ? "2" : "21";
    funcs.rtecall("msg", ret, scmsg(selectRecordMsgNumber, "relation"), 3);
    return false;
}

/**
 * This function is used to get the caption for related records tab with related records number
 * 
 * @returns caption with related records number
 * @type String
 */
function getRelatedCaption() {
    return scmsg("caption.1", "screlation", [vars.$relatedRecordCount]);
}

/**
 * This function is used to get the security Area for the relation type selected
 * 
 * @deprecated
 * @param {String}
 *          relationType - The relation type between the linked records
 * @returns
 * @type String
 */
function getSecArea(relationType) {
    var targetFile = getRelationFileName(relationType);
    if (targetFile != null) {
        return getArea(targetFile);
    }
    return null;
}

/**
 * This function is used to populate the actual action called when link new or link existing button is clicked
 * 
 * @param {String}
 *          relationType - The relation type from the dropdown list
 * @param {String}
 *          actionType - the prefix for the action , say "assoc" for associate and "open" for link new record
 * @returns
 * @type Void
 */
function populateAction(relationType, actionType) {
    if (!relationType) {
        var ret = new SCDatum();
        funcs.rtecall("msg", ret, scmsg("3", "relation"), 3);
        return;
    }

    var secArea = null;
    var targetFile = getRelationFileName(relationType);
    if (targetFile != null) {
        secArea = getArea(targetFile);
    }

    // Knowledge has its own permission check mechnism, bypass secArea
    if (secArea != "Quote" && secArea != "Knowledge" && !isAuthorizedAction(secArea, actionType, targetFile)) {
        return;
    }

    if (secArea != null) {
        vars.$relateAction = actionType + securityActionMap[secArea];
    } else if (secArea == null && targetFile === "ocmq") {
        vars.$relateAction = actionType + securityActionMap["Quote"];
    }

    //Return the relationAction name 
    if (relationType.indexOf("Known Error") > 0) {
        vars.$relateAction = actionType + "rc";
    }
}

/**
 * This function is used to get the file name for the relation type selected
 * 
 * @param {String}
 *          relationType - The relation type between the linked records
 * @returns
 * @type String
 */
function getRelationFileName(relationType) {
    var type = $("screlationtype", SCFILE_READONLY).fields("target.file").select('name="' + relationType + '"').uniqueResult();
    if (type != null) {
        return type["target.file"];
    } else {
        return null;
    }
}

/**
 * This function is used to populate the attribute variables used for related section
 * 
 * @param {String}
 *          id - The id of the current file . We can use this id to retrieve all the related record from screlation table
 * @returns
 * @type Void
 */
function populateRelatedInfo() {
    var idFieldNameMap = {
        incidents: "incident.id",
        cm3r: "number",
        rootcause: "id",
        knownerror: "id",
        probsummary: "number",
        ocmq: "number",
        request: "number",
        requestTask: "number",
        sla: "agreement.id",
        sdchat: "number",
        kmdocument: "id",
        svcCatalog: "name"
    };

    var sourceFileName = funcs.filename(vars.$L_file);
    vars.$sourceFilename = lib.Workflow.getWorkflowTableName(sourceFileName);
    vars.$source = vars.$L_file[idFieldNameMap[vars.$sourceFilename]]; //get source id

    //get the related reocrd total number
    var relation = new SCFile("screlation", SCFILE_READONLY);
    relation.setFields(["source"]);
    var sql = "source=\"" + vars.$source + "\"";
    var relatedRecordCount = relation.doCount(sql);
    vars.$relatedRecordCount = relatedRecordCount;
    vars.$hasRecords = (relatedRecordCount > 0);
}

/**
 * This function is used to get the relation type list for different file type
 * 
 * @param {String}
 *          soureFileName - rootcause , probsummary etc..
 * @returns
 * @type Void
 */
function getRelationTypeList(sourceFileName) {
    var obj = {};
    obj.valueList = $.createSCArray();
    obj.dispList = $.createSCArray();

    var query = "true";
    if (sourceFileName != null) {
        query = 'source.file="' + sourceFileName + '"';
    }

    $("screlationtype", SCFILE_READONLY).setOrderBy(["target.file"], [SCFILE_ASC]).select(query).iterate(
        function(type) {
            var name = type["name"];
            var tag = getRecordTag(type);
            var nameStr = scmsg(tag, "local:screlationtype");
            if (nameStr.indexOf("Could not be found") == -1) {
                name = nameStr;
            }

            if (!$.contains(obj.valueList, type["name"])) {
                obj.valueList.push(type["name"]);
                obj.dispList.push(name);
            }
        });

    return obj;
}

/**
 * This function is used to populate the relation type list for different file type
 * 
 * @param {String}
 *          soureFileName - rootcause , probsummary etc..
 * @returns
 * @type Void
 */
function populateRelationTypeList() {
    var sourceFilename = funcs.filename(vars.$L_file);
    sourceFilename = lib.Workflow.getWorkflowTableName(sourceFilename);
    vars.$relationTypeList = $.createSCArray();
    vars.$relationTypeDisplayList = $.createSCArray();
    $("screlationtype", SCFILE_READONLY).setOrderBy(["target.file"], [SCFILE_ASC]).select(
        'source.file="' + sourceFilename + '" and isRelatedRecord=true').iterate(function(type) {

        //QCRQ1E99007 [PbM] Separate Known Error from Problem.
        if (sourceFilename === "rootcause") {

            var isKnownError = nullsub(vars.$L_file.isKnownError, false);
            var sourceType = nullsub(type["source.type"], "");
            if (isKnownError && sourceType === "pbm") {
                return "skip";
            }
            if (!isKnownError && sourceType === "ke") {
                return "skip";
            }
        }
        //QCRQ1E99007

        var name = type["name"];
        var tag = getRecordTag(type);
        var nameStr = scmsg(tag, "local:screlationtype");
        if (nameStr.indexOf("Could not be found") == -1) {
            name = nameStr;
        }
        ///QCRQ1E99757
        var typevalue = type["value"];
        if (typevalue.indexOf("Interactions") <= 0 || !lib.ServiceDeskSwitch.getSDSwitch()) {
            vars.$relationTypeList.push(type["name"]);
            vars.$relationTypeDisplayList.push(name);
        }
        ///QCRQ1E99757
    });
}

/**
 * When a record is linked , two screlation records will be added , this function is used to get the second matched relation type value
 * 
 * @param {String}
 *          soureFileName - rootcause , probsummary etc..
 * @returns
 * @type Void
 */
function getMatchedTypeValue(sourceFileName, targetFileName) {
    if (sourceFileName === "problem") {
        sourceFileName = "probsummary";
    }
    if (targetFileName === "problem") {
        targetFileName = "probsummary";
    }
    var typeQuery = 'source.file="' + sourceFileName + '" and value="' + vars.$relationType + '"';
    if (targetFileName != null) {
        typeQuery += ' and target.file="' + targetFileName + '"';
    }
    if (nullsub(vars.$sourceType, false)) {
        typeQuery += ' and source.type="' + vars.$sourceType + '"';
    }
    if (nullsub(vars.$targetType, false)) {
        typeQuery += ' and target.type="' + vars.$targetType + '"';
    }

    var type = $("screlationtype", SCFILE_READONLY).select(typeQuery).uniqueResult();

    if (type != null) {
        var reversedName = type["reversed.name"];
        var reversedType = $("screlationtype", SCFILE_READONLY).select(
            'source.file="' + type["target.file"] + '" and name="' + reversedName +
            '" and target.file="' + type["source.file"] + '"' + ' and source.type="' + type["target.type"] + '"' + ' and target.type="' + type["source.type"] + '"').uniqueResult();
        if (!reversedType) {
            return reversedName;
        } else {
            return reversedType["value"];
        }
    }

    return null;
}

/**
 * This is used to check whether the category copy over from related record are valid in the current module. Meanwhile , if user don't the privilege to open the copy category , it will also return false
 * 
 * @param {String}
 *          soureFileName - rootcause , probsummary etc..
 * @returns
 * @type boolean
 */
function isValidCategory(categoryTable, category) {
    if (categoryTable != null && category != null) {
        var catFile = new SCFile(categoryTable, SCFILE_READONLY);
        catFile.setFields(["name"]);
        var rc = catFile.doSelect("name=\"" + category + "\"");
        if (rc == RC_SUCCESS) {
            var areaName = getArea(vars.$L_filename);
            var allowedCategories = lib.security.getToken(areaName, "allowedCategory");
            if (allowedCategories != null) {
                allowedCategories = allowedCategories.toArray();
            }

            if (allowedCategories == null || allowedCategories.length == 0) {
                return true;
            } else {
                if ($.contains(allowedCategories, category)) {
                    return true;
                } else {
                    return false;
                }
            }

        } else {
            vars.$L_file["category"] = null;
            return false;
        }
    }
    return true;
}


/**
 * This function is used to retrieve source.type and target.type value from screlationtype record.
 * 
 * @param {String}
 *          relationType - Related Problem, etc..
 *
 */
function populateSourceTargetType(relationType) {

    var file = vars.$L_file;
    var sourceFileName = funcs.filename(file);
    sourceFileName = lib.Workflow.getWorkflowTableName(sourceFileName);
    var query = 'name="' + relationType + '" and source.file="' + sourceFileName + '"';
    var apendQuery = "";

    if (sourceFileName === "rootcause") {
        apendQuery = (file.isKnownError == true) ? ' and source.type="ke"' : ' and (source.type="pbm" or source.type="rootcause")';
    }

    var screlationtype = $("screlationtype", SCFILE_READONLY).select(query + apendQuery).uniqueResult();
    if (screlationtype != null) {
        /**
         *QCCR1E126479 Hard code string "Trigger From" and "Trigger To" are seen under related record table after submitting one interaction.
         *add 4 screlationtype files but need ignore assignment of variable "$sourceType" and "$targetType"
         */
        if ((screlationtype["name"] == "Escalation" || "Trigger To") && screlationtype["source.file"] == "incidents" && screlationtype["target.file"] == "incidents") {
            return null;
        }

        vars.$sourceType = nullsub(screlationtype.source_type, "");
        vars.$targetType = nullsub(screlationtype.target_type, "");
    }

    return screlationtype;
}


/**
 * Delete all related screlations. This function is called when the record has been deleted.
 *
 * @param {String} filename, file name of the record
 * @param {String} value, key value of the record
 */
function deleteAllRelations(filename, value) {
    var query = "(source.filename=\"" + filename + "\" and source=\"" + value + "\")" +
        " or (depend.filename=\"" + filename + "\" and depend=\"" + value + "\")";

    $("screlation").select(query).iterate(function(relation) {
        relation.doDelete();
    });
}