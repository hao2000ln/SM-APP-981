var $ = lib.c.$;
var needAudit = lib.settings.getSettingValue("Request", "auditRecs");

/**
 * Generate the status list by the allowed status
 */
function intersect(status, allowstatus) {
    var intersectstatus = new SCDatum();
    intersectstatus.setType(lib.DataTypeConst.typeArray());
    if (funcs._null(allowstatus)) {
        return status;
    }
    vars.$L_sf = funcs.rtecall("intersect", vars.$L_err, intersectstatus, status, allowstatus);
    return intersectstatus;
}

/**
 * Retrieve status list 
 */
function getDisplayList(enumfield, valuelist) {
    var language = vars.$G_my_language;
    var displaylist = [];
    var status;
    if (valuelist != null) {
        var i;
        var length = valuelist.length();
        for (i = 0; i < length; i++) {
            status = localvalue(enumfield, valuelist[i], language);
            displaylist.push(status);
        }
    }
    return displaylist;
}

/**
 * retrieve message by language
 */
function localvalue(enumfield, value, language) {
    var dispLab;
    var enumDispLab = new SCFile("scmessage", SCFILE_READONLY);
    enumDispLab.setFields("message");
    var langQuery = "class=\"local:ModuleStatus\" and syslanguage=\"" + language + "\" and message.id=\"" + enumfield + ";" + value + "\"";
    var defaultLangQuery = "class=\"local:ModuleStatus\" and syslanguage=\"en\" and message.id=\"" + enumfield + ";" + value + "\"";
    if (enumDispLab.doSelect(langQuery) == RC_SUCCESS) {
        dispLab = enumDispLab.message;
    } else if (enumDispLab.doSelect(defaultLangQuery) == RC_SUCCESS) {
        dispLab = enumDispLab.message;
    } else {
        dispLab = value;
    }
    return dispLab;
}


/**
 * Generate journal updates for request and request task record.
 */
function journalAction(record, manualUpdate) {
    if (manualUpdate != null) {
        var len = manualUpdate.length();

        if (record.update_action == null) {
            record.update_action = [""];
        }

        if (len > 0) {
            var tempo = funcs.operator();

            if (lib.settings.getSettingValue("RequestEnv", "full.name") == "true") {
                var fullname = getFullNameByOperator(tempo);
                if (fullname) {
                    tempo = fullname;
                }
            }
            var temp = funcs.str(funcs.tod()) + " (" + tempo + "):";
            var i;
            for (i = len - 1; i >= 0; i--) {
                record.update_action = funcs.insert(record.update_action, 1, 1, manualUpdate[i]);
            }

            record.update_action = funcs.insert(record.update_action, 1, 1, temp);
        }
    }
}


/**
 * Is Number
 * @param {value} string
 * return boolean
 */
function isNumber(value) {
    return /^(\s*)(-?\d+)(\.\d+)?(\s*)$/.test(value);
}


/** 
 * Introduction: Get globalist display value by globalist name and input number value
 * Date:20140114
 * Author:xiaoning.li 
 * Requirement No. in QC:QCRQ1E92737
 */
function getGlobalDisplayValue(globallistName, value) {
    var globallist = new SCFile("globallists", SCFILE_READONLY);
    globallist.setFields(["list.variable", "display.variable"]);
    var rc = globallist.doSelect("name=\"" + globallistName + "\"");

    if (rc == RC_SUCCESS) {
        var listvariable = globallist["list.variable"];
        var dispvariable = globallist["display.variable"];
        var values = getGlobalListValue(listvariable);
        var labels = getGlobalListValue(dispvariable);
        if (values != null && labels != null) {
            var i;
            var length = values.length();
            for (i = 0; i < length; i++) {
                if (values[i] == value) {
                    return labels[i];
                }
            }
        } else {
            return value;
        }
    } else {
        return value;
    }
}

/**
 * getGlobalListValue
 * @param {strGlobalList} The variable of globalist.
 * return The value list or display list.
 */
function getGlobalListValue(strGlobalList) {
    var listString = strGlobalList.toString();

    return vars[listString];
}


/** 
 * Introduction: Check if category is used by target file.
 * Date:20140219
 * Author:xiaoning.li 
 * @param categoryname The name in category table
 * @param filename  The target filename which used category.
 * @param categoryfieldname  The fieldname in target file which link to  the the name category table
 * @return If category is used, return true, else return false.
 */
function isCategoryUsed(categoryname, filename, categoryfieldname) {
    var targetfilename = new SCFile(filename, SCFILE_READONLY);
    var count = targetfilename.doCount(categoryfieldname + "=\"" + categoryname + "\"");
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}


/** 
 * Introduction: Gets the grouping field values from the settings record.
 * Date:20140225
 * Author:xiaoning.li 
 *
 */
function getModelGroupFields() {
    var fields = [];
    var fieldString = lib.settings.getSettingValue("Request", "modelGroup");
    if (fieldString == null || fieldString == "") {
        fields = ["category", "subcategory"];
    } else {
        fields = fieldString.split(",");
        var i;
        var lng = fields.length;
        for (i = 0; i < lng; i++) {
            fields[i] = fields[i].replace(/^\s*/, '').replace(/\s*$/, '');
        }
    }
    
    return fields;
}


/** 
 * This is a common function to search if a field is in one array and build the query.
 * @param array The list of array data
 * @param field name
 * @return field is in{a,b,c}, such as: category is in {Generic Request, Order}
 */
function buildArrayStringQuery(array, field) {
    var query = field + " isin {\"" + array[0] + "\"";
    var max = getMax(array);
    var i;
    for (i = 1; i < max; i++) {
        query += ", \"" + array[i] + "\"";
    }
    query += "}";

    return query;
}


function getMax(array) {
    try {
        return array.length();
    } catch (e) {
        return array.length;
    }
}


/** 
 * Introduction: Gets scmessage value by dispaly value for localized global list.
 * Date:20140414
 * Author:xiaoning.li 
 * @param displayvalue The display value of globallist
 * @param msgclass  The class field in scmessage
 * @param language  The language code in scmessage
 * @return The message field in scmessage
 */
function getscmsgvalue(displayvalue, msgclass, language) {
    var dispLab;
    var enumDispLab = new SCFile("scmessage", SCFILE_READONLY);
    enumDispLab.setFields("message");
    var langQuery = "class=\"" + msgclass + "\" and syslanguage=\"" + language + "\" and message.id=\"" + displayvalue + "\"";
    var defaultLangQuery = "class=\"" + msgclass + "\" and syslanguage=\"en\" and message.id=\"" + displayvalue + "\"";
    if (enumDispLab.doSelect(langQuery) == RC_SUCCESS) {
        dispLab = enumDispLab.message;

    } else if (enumDispLab.doSelect(defaultLangQuery) == RC_SUCCESS) {
        dispLab = enumDispLab.message;
    } else {
        dispLab = displayvalue;
    }
    return dispLab;
}

/** 
 * Audit the record(reqest/request task) if applicable.
 * Date:20140424
 * Author:wenke.xing 
 * @param record The record object after update
 * @param oldrecord  The record object before update
 */
function auditRecord(record, oldrecord) {
    if (needAudit == "true") {
        var param = {
            "file": oldrecord,
            "second.file": record
        };
        $.callrad("audit.compare", param);
    }
}


/** 
 * Introduction: Visble to Customer : update information to related interation 
 * Date:20140423
 * Author:Yonglei.Wang 
 * @param The object of record
 * @return nothing
 */
function journalActionInteration(record) {
    var manualUpdate = vars.$update_action;
    if (manualUpdate != null) {
        var len = manualUpdate.length();
        if (record.update_action == null) {
            record.update_action = [""];
        }

        if (record.update_action_ess == null) {
            record.update_action_ess = [""];
        }

        var tempo = funcs.operator();

        if (lib.settings.getSettingValue("RequestEnv", "full.name") == "true") {
            var fullname = getFullNameByOperator(tempo);
            if (fullname) {
                tempo = fullname;
            }
        }

        var i;
        var temp;

        if (len > 0) {
            temp = funcs.str(funcs.tod()) + " (" + tempo + "):";
            for (i = len - 1; i >= 0; i--) {
                record.update_action_ess = funcs.insert(record.update_action_ess, 1, 1, manualUpdate[i]);
            }
            record.update_action_ess = funcs.insert(record.update_action_ess, 1, 1, temp);
        }

        if (len > 0) {
            temp = funcs.str(funcs.tod()) + " (" + tempo + "):";
            for (i = len - 1; i >= 0; i--) {
                record.update_action = funcs.insert(record.update_action, 1, 1, manualUpdate[i]);
            }
            record.update_action = funcs.insert(record.update_action, 1, 1, temp);
        }
    }
}

/** 
 * Introduction: Update Related Link of this Object
 * Date:20140423
 * Author:Yonglei.Wang 
 * @param The object id
 * @return nothing
 */
function updateRelatedLink(id) {
    var incidents = new SCFile("incidents");

    var query = "incident.id=\"" + id + "\"";
    var rc = incidents.doSelect(query);

    if (rc == RC_SUCCESS) {
        journalActionInteration(incidents);
        incidents.doSave();
    }
    return incidents;
}

/** 
 * Introduction: According this record, and soucefile targetfile type, find the specific relation of record then update and send notification 
 * Date:20140423
 * Author:Yonglei.Wang 
 * @param The object of record
 * @param The type of screlated source file name
 * @param The type of screlated target file name
 * @return nothing
 */
function findRelatedLinkandUpdate(record, sourcefile, targetfile) {
    var screlation = new SCFile("screlation", SCFILE_READONLY);
    screlation.setFields(["depend"]);
    var query = "source=\"" + record.number + "\"" + " and source.filename=\"" + sourcefile + "\"" + " and depend.filename=\"" + targetfile + "\"";
    var rc = screlation.doSelect(query);
    if (rc == RC_SUCCESS) {
        do {
            var relatedobject = updateRelatedLink(screlation.depend);
            lib.sdUtil.sendEmailToRelatedIntertion(record, relatedobject);
        }
        while (screlation.getNext() == RC_SUCCESS);
    }
}

/** 
 * Introduction: When user update the request, sync visble to customer data to the related record. 
 * Date:20140423
 * Author:Yonglei.Wang 
 * @param The object of record
 * @param The type of screlated source file name
 * @param The type of screlated target file name
 * @return nothing
 */
function visibletoCustomer(record, sourcefile, targetfile) {
    // var rmp_activity = vars.$rm_activity;
    var cust_visible = record.cust_visible;

    if (cust_visible != null && cust_visible != "" && cust_visible === true) {
        findRelatedLinkandUpdate(record, sourcefile, targetfile);
    }
    //record.cust_visible = false;
}

function getFullNameByOperator(operator) {

    var contact = new SCFile("contacts", SCFILE_READONLY);
    contact.setFields(["full.name"]);
    var rc = contact.doSelect("operator.id=\"" + operator + "\"");
    if (rc == RC_SUCCESS) {
        return contact["full.name"];
    }
    return null;
}

function broadCastUserUpdateFromEssToActivity(record) {

    var description = vars.$update_action;
    if (description == null) {
        return;
    }

    if (!vars.$G_ess) {
        if (vars.$sm_activity !== "Update from customer") {
            return;
        }
    }

    if (description.length() > 0) {
        var relation = new SCFile("screlation", SCFILE_READONLY);
        relation.setFields(["depend.filename", "depend"]);
        var sql = "source=\"" + record.incident_id + "\"";
        if (relation.doSelect(sql) === RC_SUCCESS) {
            do {
                var activityFileName = getActivityLogFile(relation.depend_filename);
                if (activityFileName != null) {
                    var activity = new SCFile(activityFileName);
                    activity.datestamp = new Date();
                    activity.type = "Update from customer";
                    activity.operator = "Background";
                    activity.description = description;
                    activity.number = relation.depend;
                    activity.doSave();
                }
            } while (relation.getNext() === RC_SUCCESS);
        }
    }
}

function getActivityLogFile(filename) {
    var fn = filename;

    if (filename === "problem") {
        fn = "probsummary";
    }

    var sql = "file.name=\"" + fn + "\"";
    var obj = new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["activitylog.file.name"]);

    if (obj.doSelect(sql) === RC_SUCCESS) {
        return obj.activitylog_file_name;
    } else {
        return null;
    }
}


/** 
 * Introduction: get Request closure code display value to show in close activity
 * Date:20140508
 * Author:Ricky Huang 
 * @param sValue, closure code
 * @param aValueList, closure code global list value list 
 * @param aDisplayList, closure code global list display list 
 * @return display value
 */
function getDisplayValue(sValue, aValueList, aDisplayList) {
    var sDisplay = lib.globalListTools.getDisplayValue(sValue, aValueList, aDisplayList);
    return sDisplay;
}


/**
 *  This functions build and return request task attachment HTML tables
 *   
 *  @param {String} request number
 *  @returns {string} request task attachment HTML table
 */
function getTaskAttachmentHTML(requestNumber) {

    var numbers = [];
    $("requestTask", SCFILE_READONLY).setFields(['number']).setOrderBy(['number'], [SCFILE_DSC]).select('parent.request="' + requestNumber + '"').iterate(function(task) {
        numbers.push(task.number);
    });

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("requestTask", numbers);

    return sHtmlReturn;
}


/**
 *  This functions build and return request attachment HTML tables
 *   
 *  @param {String} request number
 *  @returns {string} request attachment HTML table
 */
function getAttachmentHTML(requestNumber) {

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("request", [requestNumber]);

    return sHtmlReturn;
}


/**
 *  Return the total attachment number of request tasks
 *   
 *  @param {String} request number
 *  @returns {Number} the total attachment number of task records
 */
function countTaskAttachments(requestNumber) {

    var attach_number = 0;

    $("requestTask", SCFILE_READONLY).setFields(['number']).select('parent.request="' + requestNumber + '"').iterate(function(task) {
        attach_number += lib.AttachmentUtil.countAttachments(task.number, "requestTask");
    });

    return attach_number;
}