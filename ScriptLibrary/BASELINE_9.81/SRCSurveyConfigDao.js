var _ = lib.Underscore.require();
var confComm = lib.SRCSurveyConfigComm;
var tableUtil = lib.tableFunctions;

var CONFIG_TABLE = "svcSrcSurveyConfig";
var DEST_TABLE = "SurveyInternal";

var DBDICT = "dbdict";
var DbFields = confComm.DbFields();
var FieldTypes = confComm.FieldTypes();
var FieldTypeNames = confComm.FieldTypeNames();
var log = getLog("srcSurvey");

/* 
 * Get the default catpion of a field.
 */
function getFieldDefaultCaption(fields, fieldCaptions, field) {
    if (fields == null || fieldCaptions == null) {
        return "";
    }

    var fieldsArr = fields;
    var fieldCaptionsArr = fieldCaptions;

    if (fieldsArr.length != fieldCaptionsArr.length) {
        return "";
    }
    var fieldsLength = fieldsArr.length;

    var i;
    for (i = 0; i < fieldsLength; i++) {
        if (fieldsArr[i] === field) {
            return fieldCaptionsArr[i];
        }
    }
    return "";
}

/* 
 * Check if field already existed in the config table.
 * @param fileName the file name of the config, user will select fields from this table.
 * @return fieldName the field Name of the config.
 */
function getExistingField(fileName, fieldName) {
    var fields = new SCFile(CONFIG_TABLE, SCFILE_READONLY);
    var condition = DbFields.DEST_FILE_NAME + "=\"" + fileName + "\" and " + DbFields.DEST_FIELD_NAME + "=\"" + fieldName + "\"";
    var rc = fields.doSelect(condition);
    var aField = null;
    if (rc == RC_SUCCESS) {

        if (fields[DbFields.ID] != null) {

            aField = {};
            aField[DbFields.ID] = fields[DbFields.ID];
            aField[DbFields.DEST_FILE_NAME] = fields[DbFields.DEST_FILE_NAME];
            aField[DbFields.DEST_FIELD_NAME] = fields[DbFields.DEST_FIELD_NAME];
            aField[DbFields.DEST_FIELD_TYPE] = fields[DbFields.DEST_FIELD_TYPE];
            aField[DbFields.QUESTION_LABEL] = fields[DbFields.QUESTION_LABEL];
            aField[DbFields.ANSWER_TYPE] = fields[DbFields.ANSWER_TYPE];
            aField[DbFields.ORDER] = fields[DbFields.ORDER];
            aField[DbFields.MANDATORY_CONDITION] = fields[DbFields.MANDATORY_CONDITION];
            aField[DbFields.GLOBALLIST] = fields[DbFields.GLOBALLIST];
            aField[DbFields.CUSTOM_ANSWER_ALLOWED] = fields[DbFields.CUSTOM_ANSWER_ALLOWED];
        }
    }

    return aField;
}


/* 
 * Update a configure.
 * @param aField form variables containing the user input.
 */
function updateField(aField) {
    var field = new SCFile(CONFIG_TABLE);
    var query = DbFields.DEST_FILE_NAME + "=\"" + aField.fileName +
        "\" and " + DbFields.DEST_FIELD_NAME + "=\"" + aField.fieldName + "\"";

    try {
        var rc = field.doSelect(query);
        if (rc == RC_SUCCESS) {

            convertFormField2DBField(field, aField);

            var rcIn = field.doUpdate();
            if (rcIn !== RC_SUCCESS) {
                log.error("Can not update field: " + rcIn);
            }
        }
    } catch (ex) {
        log.error("Exception when update field: " + ex);
    }

}

/* 
 * Get the label by label ID.
 * @param labelId
 */
function getExistingLabel(labelId) {
    var label = funcs.scmsg(labelId, "srcsurvey", []);
    return label;
}

/* 
 * Delete a field.
 */
function deleteField(fieldName) {
    var fields = new SCFile(CONFIG_TABLE);
    var query = DbFields.DEST_FIELD_NAME + "=\"" + fieldName + "\"";
    try {
        var rc = fields.doSelect(query);
        if (rc == RC_SUCCESS) {
            fields.doDelete();
        }
    } catch (ex) {
        log.error("Exception when delete a field" + ex);
    }
}


/* 
 * Insert a message into the message table.
 */
function insertNewMessage(labelClass, label, lang) {
    var scmessage = new SCFile("scmessage");
    var sql = "class=\"srcsurvey\" and syslanguage=\"" + lang + "\"";
    var labelId = 0;
    if (scmessage.doSelect(sql) == RC_SUCCESS) {
        do {
            if (parseInt(scmessage.message_id) > labelId) {
                labelId = parseInt(scmessage.message_id);
            }
        } while (scmessage.getNext() == RC_SUCCESS);
    }
    scmessage["class"] = "srcsurvey";
    scmessage.message = label;
    scmessage.message_id = String(labelId + 1);
    scmessage.syslanguage = lang;
    try {
        var result = scmessage.doInsert();
        if (result == RC_SUCCESS) {
            return scmessage.message_id;
        }
    } catch (ex) {
        log.error("Exception when insert message: " + ex);
    }
    return null;
}


/* 
 * Get the existing fields.
 */
function getExistingFields(fileName) {

    var fields = new SCFile(CONFIG_TABLE, SCFILE_READONLY);
    var query = DbFields.DEST_FILE_NAME + "=\"" + fileName + "\"";
    var orderByFields = new Array(DbFields.ORDER);
    var orderBySort = new Array(1);
    orderBySort[0] = SCFILE_ASC;
    fields.setOrderBy(orderByFields, orderBySort);

    var rt = fields.doSelect(query);
    var results = [];
    while (rt == RC_SUCCESS) {
        var aField = {};
        aField[DbFields.ID] = fields[DbFields.ID];
        aField[DbFields.DEST_FILE_NAME] = fields[DbFields.DEST_FILE_NAME];
        aField[DbFields.DEST_FIELD_NAME] = fields[DbFields.DEST_FIELD_NAME];
        aField[DbFields.DEST_FIELD_TYPE] = fields[DbFields.DEST_FIELD_TYPE];
        aField[DbFields.QUESTION_LABEL] = fields[DbFields.QUESTION_LABEL];
        aField[DbFields.ANSWER_TYPE] = fields[DbFields.ANSWER_TYPE];
        aField[DbFields.ORDER] = fields[DbFields.ORDER];
        aField[DbFields.MANDATORY_CONDITION] = fields[DbFields.MANDATORY_CONDITION];
        aField[DbFields.GLOBALLIST] = fields[DbFields.GLOBALLIST];
        aField[DbFields.CUSTOM_ANSWER_ALLOWED] = fields[DbFields.CUSTOM_ANSWER_ALLOWED];

        results.push(aField);
        rt = fields.getNext();
    }

    return results;

}


/* 
 * Check if the field should be included in selection list.
 */
function getAvailableFields(fileName) {

    var dbdict = new SCFile(DBDICT, SCFILE_READONLY);
    var fields = new Datum();
    fields.setType(8);
    var exclude = [
        "number",
        "contact.name",
        "reference.number",
        "status",
        "file.name",
        "field.name",
        "open.time",
        "open.by",
        "update.time",
        "update.by",
        "close.time",
        "close.by",
        "support.id",
        "callback.support"
    ];

    if (dbdict.doSelect("name=\"" + fileName + "\"") == RC_SUCCESS) {
        var i;
        var length = dbdict.field.length();
        for (i = 0; i < length; ++i) {

            if ((dbdict.field[i].type == FieldTypes.character ||
                    dbdict.field[i].type == FieldTypes.number ||
                    dbdict.field[i].type == FieldTypes.logical ||
                    dbdict.field[i].type == FieldTypes.array)
                && dbdict.field[i].level == "1" &&
                exclude.indexOf(dbdict.field[i].name) == -1
            ) {
                fields.push(dbdict.field[i].name);
            }
        }
    }

    var captions = lib.convertToCaptions.getFieldCaptions(fields, fileName);
    var relatedGloballists = getRelatedGloballist(fileName, fields.toArray());
    return [fields, captions, relatedGloballists];
}

/* 
 * Get the caption of the file.
 */
function getFileCaptions(files) {
    var captions = [];
    try {
        var i;
        for (i = 0; i < files.length; i++) {
            captions.push(funcs.scmsg(files[i], "tablename"));
        }
        return [files, captions];
    } catch (ex) {
        log.error("Exception when on get file captions: " + ex);
    }

    return ["", ""];
}


/* 
 * Get field type of a field
 */
function getFieldTypeName(fileName, field) {
    var dbdict = new SCFile(DBDICT, SCFILE_READONLY);
    if (dbdict.doSelect("name=\"" + fileName + "\"") == RC_SUCCESS) {
        var i;
        var length = dbdict.field.length();
        for (i = 0; i < length; ++i) {
            if (field == dbdict.field[i].name) {

                var type;
                if (dbdict.field[i].type == FieldTypes.number) {
                    type = FieldTypeNames.number;
                } else if (dbdict.field[i].type == FieldTypes.character) {
                    type = FieldTypeNames.character;
                } else if (dbdict.field[i].type == FieldTypes.datetime) {
                    type = FieldTypeNames.datetime;
                } else if (dbdict.field[i].type == FieldTypes.logical) {
                    type = FieldTypeNames.logical;
                } else if (dbdict.field[i].type == FieldTypes.array) {
                    type = FieldTypeNames.array;
                }

                return (type);
            }
        }

    }
}

/* 
 * Check if the field has global list associated.
 */
function getRelatedGloballist(fileName, fieldIds) {

    var datadict = new SCFile("datadict", SCFILE_READONLY);

    var rc = datadict.doSelect("name=\"" + fileName + "\"");
    var result = new Array(fieldIds.length);
    if (rc === RC_SUCCESS) {
        var fields = datadict["fields"].toArray();
        var globallists = datadict["globallist"].toArray();
        var i;
        for (i = 0; i < fields.length; i++) {
            var targetIndex = _.indexOf(fieldIds, fields[i]);
            if (targetIndex != -1) {

                if (globallists == null) {
                    result[targetIndex] = null;
                } else {
                    result[targetIndex] = globallists[i];
                }

            }
        }
    }

    var j;
    for (j = 0; j < result.length; j++) {
        if (_.isNull(result[j]) || result[j] === "NULL" || _.isUndefined(result[j])) {
            result[j] = "--";
        }
    }
    return result;
}

/* 
 * get the default global lists.
 */
function getDefaultFieldGloballist(fields, globallists, fieldId) {
    if (fields == null || globallists == null) {
        return "";
    }
    var targetIndex = _.indexOf(fields, fieldId);
    var result = "";
    if (targetIndex != -1) {
        result = globallists[targetIndex];
    }
    return (result === "--") ? "" : result;
}


/* 
 * Insert a field into DB
 */
function insertField(aField) {
    var field = new SCFile(CONFIG_TABLE);

    convertFormField2DBField(field, aField);
    field[DbFields.ORDER] = aField.order;

    try {
        var rc = field.doSave();
        if (rc !== RC_SUCCESS) {
            log.error("Can not insert field: " + aField);
        }
    } catch (ex) {
        log.error("Exception when insert field: " + aField);
    }
}

/* 
 * bulk update field orders
 */
function bulkUpdateFieldOrders(allFields) {
    var fields = new SCFile(CONFIG_TABLE);
    try {
        var index;
        for (index = 0; index < allFields.length; index++) {
            var query = DbFields.DEST_FILE_NAME + "=\"" + allFields[index]["fileName"] +
                "\" and " + DbFields.DEST_FIELD_NAME + "=\"" + allFields[index]["fieldName"] + "\"";

            var rc = fields.doSelect(query);

            fields[DbFields.ORDER] = allFields[index][DbFields.ORDER];
            fields.doUpdate();
        }
    } catch (ex) {
        log.error("Exception when bulk update fields" + ex);
    }
}


/* 
 * get the user input.
 */
function convertFormField2DBField(dbField, formField) {
    dbField[DbFields.DEST_FILE_NAME] = formField.fileName;
    dbField[DbFields.DEST_FIELD_NAME] = formField.fieldName;
    dbField[DbFields.DEST_FIELD_TYPE] = formField.fieldType;
    dbField[DbFields.QUESTION_LABEL] = formField.fieldLabel;
    dbField[DbFields.ANSWER_TYPE] = formField.answerType;
    dbField[DbFields.MANDATORY_CONDITION] = formField.mandatory.toString();
    dbField[DbFields.CUSTOM_ANSWER_ALLOWED] = formField.allowCustomAnswer;
    if (formField.answerType !== "radioButtons" && formField.answerType !== "dropdownList" && formField.answerType !== "multipleSelection") {
        formField.globallist = null;
    }

    dbField[DbFields.GLOBALLIST] = formField.globallist;
}