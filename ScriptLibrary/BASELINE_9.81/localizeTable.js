var escapeAllStr = lib.StringUtil.escapeAllStr;
var $ = lib.c.$;

function createAllEntries(filename, fieldname) {
    if (fieldname == null) {
        fieldname = "name";
    }

    var record = new SCFile(filename);
    if (record.doSelect("true") == RC_SUCCESS) {
        do {
            createEntry(record, filename, fieldname);
        }
        while (record.getNext() == RC_SUCCESS);
    }
}

function createEntry(record, filename, fieldname) {
    var activeLanguage = [];
    activeLanguage = getActiveLanguages();

    var tag = getRecordTag(record);

    var field = record[fieldname];

    var i;
    for (i = 0; i < activeLanguage.length; ++i) {

        addMessageRecord(filename, tag, field, activeLanguage[i]);
    }
}

function getPrefix() {
    return "local";
}

function addMessageRecord(filename, tag, text, language) {
    var PREFIX = getPrefix();
    var message = new SCFile("scmessage");
    var msgclass = PREFIX + ":" + filename;
    var sql = "syslanguage=\"" + language + "\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(tag) + "\"";

    if (message.doSelect(sql) != RC_SUCCESS) {
        message.syslanguage = language;
        message._class = msgclass;
        message.message_id = tag;
        message.message = text;

        message.doInsert();
    }
}

function getMessageText(file) {
    if (file == null) {
        return null;
    }
    var filename = funcs.filename(file);
    var tag = getRecordTag(file);
    if (!tag || tag.indexOf("\"") >= 0) {
        return null;
    }
    var msgclass = getPrefix() + ":" + filename;
    var message = new SCFile("scmessage");
    var rc = message.doSelect("syslanguage=\"en\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(tag) + "\"");
    if (rc != RC_SUCCESS) {
        return null;
    }
    var msg = funcs.scmsg(tag, msgclass);

    return msg;
}

function getLocalizedInboxName(id) {
    if (id == null) {
        return null;
    }

    var inbox = new SCFile("inbox");
    var rc = inbox.doSelect("inbox.id=\"" + id + "\"");
    if (rc == RC_SUCCESS) {
        var localizedName = getMessageText(inbox);
        return localizedName == null ? inbox.inbox_name : localizedName;
    }

    return null;
}

function getDefaultLocalizedMessageText(msgclass, id, params) {
    var language = vars.$G_system_info.syslanguage || "en";
    return getLocalizedMessageText(language, msgclass, id, params);
}

function getLocalizedMessageText(language, msgclass, id, params) {
    if (!id) {
        return "";
    }
    
    if (!language) {
        language = "en";
    }

    var message = new SCFile("scmessage");
    var rc = message.doSelect("syslanguage=\"" + language + "\" and class=\"" + msgclass + "\" and message.id=\"" + id + "\"");
    if (rc != RC_SUCCESS) {
        if (language != "en") {
            rc = message.doSelect("syslanguage=\"en\" and class=\"" + msgclass + "\" and message.id=\"" + id + "\"");
        }
        if (rc != RC_SUCCESS) {
            return "";
        }
    }

    if (!params || params.length == 0) {
        return message["message"];
    }

    var i = 0;
    return message["message"].replace(/\%S/gi,
        function() {
            if (params && i < params.length) {
                return params[i++];
            }
            return arguments[0];
        });
}

function getLocalizedGlobalMessageText(language, value, glname) {
    if (!value) {
        return "";
    }
    
    var message = String(value);
    var values = [];
    var msgIds = [];
    var query = "name=\"" + glname + "\"";
    var gl = $("globallists", SCFILE_READONLY).select(query).uniqueResult();
    if (!gl) {
        return message;
    }
    values = funcs.val(gl["value.list"], 8);
    msgIds = funcs.val(gl["display.list"], 8);
    
    var index = lib.ArrayUtil.indexOf(values, message);
    if (index == -1) {
        return message;
    }
    
    return getLocalizedMessageText(language, "global", msgIds[index]);
}

function updateEntry(record, oldrecord, filename, fieldname) {
    var oldValue = oldrecord[fieldname];
    var newValue = record[fieldname];

    var oldTag = getRecordTag(oldrecord);
    var tag = getRecordTag(record);

    if (oldValue != newValue || oldTag != tag) {
        removeEntry(filename, oldrecord);

        var activeLanguage = [];
        activeLanguage = getActiveLanguages();

        var field = record[fieldname];

        var i;
        for (i = 0; i < activeLanguage.length; ++i) {
            addMessageRecord(filename, tag, field, activeLanguage[i]);
        }
    }
}

function removeEntry(filename, record) {
    var PREFIX = "local";
    var message = new SCFile("scmessage");
    var msgclass = PREFIX + ":" + filename;
    var tag = getRecordTag(record);

    var sql = "syslanguage~=\"xxx\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(tag) + "\"";

    if (message.doSelect(sql) == RC_SUCCESS) {
        do {
            message.doDelete();
        }
        while (message.getNext() == RC_SUCCESS);
    }
}

function removeAllEntries(filename) {
    if (filename != null) {
        var PREFIX = "local";
        var message = new SCFile("scmessage");
        var msgclass = PREFIX + ":" + filename;
        var sql = "syslanguage~=\"xxx\" and class=\"" + msgclass + "\"";

        if (message.doSelect(sql) == RC_SUCCESS) {
            do {
                message.doDelete();
            }
            while (message.getNext() == RC_SUCCESS);
        }
    }
}

function createLocalLists(globalList, filename, tags, values) {
    removeAllLocalLists(globalList.name);

    var activeLanguage = getActiveLanguages();

    var i;
    for (i = 0; i < activeLanguage.length; ++i) {
        var PREFIX = "local";
        var localList = new SCFile("locallist");
        localList.name = globalList.name;
        localList.syslanguage = activeLanguage[i];

        var list = globalList.display_list;
        var index, indexLoopTimes = tags.length();
        for (index = 0; index < indexLoopTimes; index++) {
            var msgclass = PREFIX + ":" + filename;
            var id = tags[index];

            var value = getLocalValue(msgclass, id, activeLanguage[i], values[index]);
            localList.display_list[index] = value;
        }
        localList.display_list_str = funcs.str(localList.display_list);
        localList.doInsert();
    }

}

function getLocalValue(msgclass, id, language, defaultValue) {
    var message = new SCFile("scmessage", SCFILE_READONLY);
    var sql = "syslanguage=\"" + language + "\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(id) + "\"";
    if (message.doSelect(sql) == RC_SUCCESS) {
        var msg = message.message;
        if (msg != null) {
            return msg;
        } else {
            return defaultValue;
        }
    }

    return defaultValue;
}

function getActiveLanguages() {
    var language = new SCFile("language", SCFILE_READONLY);
    var activeLanguage = [];
    var sql = "active=true";

    if (language.doSelect(sql) == RC_SUCCESS) {
        do {
            activeLanguage.push(language.unique_id);
        }
        while (language.getNext() == RC_SUCCESS);
    }

    return activeLanguage;
}

/**
 *  Return true when the language exists and is active
 */
function isLanguageActive(id) {
    if (id) {
        var language = $("!language").fields(["active"]).find("unique.id=:id", id).one();
        if (language) {
            return language["active"] || false;
        }
    }
    
    return false;
}

/**
 *  Return language name
 *  When no such language, return id directly
 */
function getLanguageName(id) {
    if (id) {
        var language = $("!language").fields(["language"]).find("unique.id=:id", id).one();
        if (language) {
            return language["language"] || id;
        }
    }
    
    return id;
}

/**
 *  Return language id
 *  When no such language, return name directly
 */
function getLanguageID(name) {
    if (name) {
        var language = $("!language").fields(["unique.id"]).find("language=:name", name).one();
        if (language) {
            return language["unique.id"] || name;
        }
    }
    
    return name;
}

function getRecordTag(record) {
    var tag = new SCDatum();
    funcs.tag(tag, record);

    var stag = tag.getText();
    var index = stag.indexOf(";");
    if (index >= 0) {
        return stag.substring(index + 1);
    }

    return "";
}

function removeAllLocalLists(name) {
    var localList = new SCFile("locallist");
    var sql = "name=\"" + name + "\" and syslanguage~=\"xxx\"";

    if (localList.doSelect(sql) == RC_SUCCESS) {
        do {
            localList.doDelete();
        }
        while (localList.getNext() == RC_SUCCESS);
    }
}

function getLocalizedValues(name, defaults) {
    var localList = new SCFile("locallist");
    var sql = "name=\"" + name + "\"";
    if (localList.doSelect(sql) == RC_SUCCESS) {
        return funcs.str(localList.display_list);
    }
    return defaults;

}

function createTriggers(filename) {
    createAddTrigger(filename);
    createUpdateTrigger(filename);
    createDeleteTrigger(filename);
}

function removeTriggers(filename) {
    if (filename != null) {
        var trigger = new SCFile("triggers");
        var triggerNameAdd = "trigger.localize." + filename + ".add";
        var triggerNameUpdate = "trigger.localize." + filename + ".update";
        var triggerNameDelete = "trigger.localize." + filename + ".delete";
        var sql = "trigger.name=\"" + triggerNameAdd + "\" or trigger.name=\"" +
            triggerNameUpdate + "\" or trigger.name=\"" + triggerNameDelete + "\"";
        if (trigger.doSelect(sql) == RC_SUCCESS) {
            do {
                trigger.doDelete();
            }
            while (trigger.getNext() == RC_SUCCESS);
        }
    }
}

function createAddTrigger(filename) {
    if (filename != null) {
        var trigger = new SCFile("triggers");
        var triggerName = "trigger.localize." + filename + ".add";
        var sql = "trigger.name=\"" + triggerName + "\"";
        if (trigger.doSelect(sql) != RC_SUCCESS) {
            trigger.trigger_name = triggerName;
            trigger.trigger_type = 2;
            trigger.table_name = filename;

            trigger.javascript = "lib.localizeTable.onAddTrigger( record );";

            trigger.doInsert();
        }
    }
}

function createUpdateTrigger(filename) {
    if (filename != null) {
        var trigger = new SCFile("triggers");
        var triggerName = "trigger.localize." + filename + ".update";
        var sql = "trigger.name=\"" + triggerName + "\"";
        if (trigger.doSelect(sql) != RC_SUCCESS) {
            trigger.trigger_name = triggerName;
            trigger.trigger_type = 4;
            trigger.table_name = filename;

            trigger.javascript = "lib.localizeTable.onUpdateTrigger( record, oldrecord );";

            trigger.doInsert();
        }
    }
}

function createDeleteTrigger(filename) {
    if (filename != null) {
        var trigger = new SCFile("triggers");
        var triggerName = "trigger.localize." + filename + ".delete";
        var sql = "trigger.name=\"" + triggerName + "\"";
        if (trigger.doSelect(sql) != RC_SUCCESS) {
            trigger.trigger_name = triggerName;
            trigger.trigger_type = 6;
            trigger.table_name = filename;

            trigger.javascript = "lib.localizeTable.onDeleteTrigger( record );";

            trigger.doInsert();
        }
    }
}


function onAddTrigger(record) {

    var filename = funcs.filename(record);
    var fieldname = getLocalizedField(filename);

    createEntry(record, filename, fieldname);
}

function onUpdateTrigger(record, oldrecord) {
    var filename = funcs.filename(record);
    var fieldname = getLocalizedField(filename);

    updateEntry(record, oldrecord, filename, fieldname);
}

function onDeleteTrigger(record) {
    var filename = funcs.filename(record);
    var fieldname = getLocalizedField(filename);
    removeEntry(filename, record);
}

function getLocalizedField(filename) {
    var datapolicy = new SCFile("datadict", SCFILE_READONLY);
    if (filename != null) {
        var sql = "name=\"" + filename + "\"";
        if (datapolicy.doSelect(sql) == RC_SUCCESS) {
            if (datapolicy.localizedField != null && datapolicy.localizedField.length > 0) {
                return datapolicy.localizedField;
            }
        }
    }
    return "name";
}

function runLocalizationUtil(utilRecord) {
    var formNames = utilRecord.formatName;
    var fieldNames = utilRecord.fieldName;
    var globalNames = utilRecord.globalList;

    var datapolicy = new SCFile("datadict");
    if (utilRecord.tableName != null) {
        var sql = "name=\"" + utilRecord.tableName + "\"";
        if (datapolicy.doSelect(sql) == RC_SUCCESS) {
            var modified = false;
            var x;
            for (x = 0; x < fieldNames.length; ++x) {
                var idx = funcs.index(fieldNames[x], datapolicy.fields);
                var index = idx - 1;
                if (index > -1 && datapolicy.globallist[index] != globalNames[x]) {
                    datapolicy.globallist = funcs._delete(datapolicy.globallist, idx);
                    datapolicy.globallist = funcs.insert(datapolicy.globallist, idx, 1, globalNames[x]);
                    modified = true;
                }
            }
            if (modified) {
                var rc = datapolicy.doUpdate();
                print(funcs.scmsg(167, "ScriptLibrary", [datapolicy.name]));
            }
        }

        var i;
        for (i = 0; i < formNames.length; ++i) {
            updateForm(formNames[i], fieldNames, globalNames);
        }
    }
}

function updateForm(formName, fieldNames, listNames) {
    var form = new SCFile("format");
    var modified = false;
    if (formName == null || fieldNames == null || listNames == null) {
        return false;
    }

    var formSQL = "name=\"" + formName + "\" and syslanguage~=\"xxx\"";

    if (form.doSelect(formSQL) == RC_SUCCESS) {
        do {
            var lng = form.field.length();
            var flng = fieldNames.length();

            var f;
            for (f = 0; f < flng; f++) {
                var fieldName = fieldNames[f];
                var listName = listNames[f];

                var i;
                for (i = 0; i < lng; i++) {
                    if (form.field[i].input == fieldName) {
                        if (form.field[i].property != null) {
                            var prop = translateFieldProperty(form.field[i].property, listName);
                            if (prop != form.field[i].property && prop != null) {
                                form.field[i].property = prop;
                                modified = true;
                            }
                        }
                    }
                }
            }

            if (modified) {
                form.doUpdate();
                print(funcs.scmsg(166, "ScriptLibrary", [form.name]));
            }
        }
        while (form.getNext() == RC_SUCCESS);
    }

}

function translateFieldProperty(property, listName) {
    var tab = "\t";
    var displayList;
    var valueList;
    var index = funcs.index(";", property);
    var list = new SCFile("globallists", SCFILE_READONLY);
    if (listName == null) {
        return property;
    }

    var listSQL = "name=\"" + listName + "\"";
    if (list.doSelect(listSQL) == RC_SUCCESS) {
        displayList = list.display_variable;
        valueList = list.list_variable;
    } else {
        return property;
    }

    if (index > 0) {
        var lng = funcs.lng(property);
        var header = funcs.substr(property, 1, index - 1);
        if (header == "Text") {
            header = "ComboBox";
        }

        var propstring = funcs.substr(property, index + 1, lng);
        var props = propstring.split(tab);
        var hasDisplay = false;
        var hasValue = false;
        var hasCombo = false;

        var i;
        for (i = 0; i < props.length; ++i) {
            var x = funcs.index("=", props[i]);
            var l = funcs.lng(props[i]);
            var type = funcs.substr(props[i], 1, x - 1);

            if (type == "ValueList") {
                props[i] = "ValueList=" + valueList;
                hasValue = true;
            }
            if (type == "DisplayList") {
                if (displayList != null) {
                    props[i] = "DisplayList=" + displayList;
                    hasDisplay = true;
                } else {
                    props[i] = null;
                }
            }
            if (header == "ComFill" && type == "ComboButtonVisible") {
                props[i] = "ComboButtonVisible=1";
                hasCombo = true;
            }
        }

        if (!hasValue) {
            props.push("ValueList=" + valueList);
        }
        if (!hasDisplay && displayList != null) {
            props.push("DisplayList=" + displayList);
        }
        if (header == "ComFill" && !hasCombo) {
            props.push("ComboButtonVisible=1");
        }

        var temp;
        temp = header + ";";

        for (i = 0; i < props.length; ++i) {
            if (props[i] != null) {
                if (i > 0) {
                    temp += tab;
                }
                temp += props[i];
            }
        }

        property = temp;
    }

    return property;
}

function localizeList(ids, labels, language, msgclass, actionType) {
    if (language == null) {
        language = $G.my.language;
    }

    var i, msg, sql;

    if (actionType == "add" || actionType == "addonly") {

        for (i = 0; i < ids.length; ++i) {
            var lang = new SCFile("language");
            var langSql = "active=true";
            if (lang.doSelect(langSql) == RC_SUCCESS) {

                do {
                    msg = new SCFile("scmessage");
                    sql = "syslanguage=\"" + lang.unique_id + "\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(ids[i]) + "\"";
                    if (msg.doSelect(sql) == RC_SUCCESS) {
                        if (msg.syslanguage == language && actionType == "add") {
                            msg.message = labels[i];
                        }
                        msg.doUpdate();
                    } else {
                        msg.syslanguage = lang.unique_id;
                        msg._class = msgclass;
                        msg.message_id = funcs.str(ids[i]);
                        msg.message = labels[i];
                        msg.doInsert();
                    }
                }
                while (lang.getNext() == RC_SUCCESS);
            }
        }
    }
    if (actionType == "update") {
        for (i = 0; i < ids.length; ++i) {
            msg = new SCFile("scmessage");
            sql = "syslanguage=\"" + language + "\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(ids[i]) + "\"";
            if (msg.doSelect(sql) == RC_SUCCESS) {
                msg.message = labels[i];
                msg.doUpdate();
            } else {
                msg.syslanguage = language;
                msg._class = msgclass;
                msg.message_id = funcs.str(ids[i]);
                msg.message = labels[i];
                msg.doInsert();
            }
        }
    }
    if (actionType == "delete") {
        for (i = 0; i < ids.length; ++i) {
            msg = new SCFile("scmessage");
            sql = "syslanguage~=\"xxx\" and class=\"" + msgclass + "\" and message.id=\"" + escapeAllStr(ids[i]) + "\"";
            if (msg.doSelect(sql) == RC_SUCCESS) {
                do {
                    msg.doDelete();
                }
                while (msg.getNext() == RC_SUCCESS);
            }
        }
    }

}