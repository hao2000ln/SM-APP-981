/**
 * This ScriptLibrary is for system settings
 *
 * @author Zhang Qi
 */

var $ = lib.c.$;
var _ = lib.Underscore.require();

/**
 * create scmessage/help for add trigger
 */
function onAddTrigger(config) {
    createMessageEntry(config);
    createHelpEntry(config);
}

function createMessageEntry(config) {
    var activeLanguage = lib.localizeTable.getActiveLanguages();

    var i;
    for (i = 0; i < activeLanguage.length; i++) {
        lib.localizeTable.addMessageRecord("systemSettingsConfig", config.id, config.label, activeLanguage[i]);
    }
}

function createHelpEntry(config) {
    var activeLanguage = lib.localizeTable.getActiveLanguages();

    var i;
    for (i = 0; i < activeLanguage.length; i++) {
        addHelpRecord(config, activeLanguage[i]);
    }
}

function addHelpRecord(config, language) {
    var help = new SCFile("help");
    var fieldName = "$" + config.id;
    var sql = 'syslanguage="' + language + '" and file.name="systemSettings" and field.name="' + fieldName + '"';

    if (help.doSelect(sql) != RC_SUCCESS) {
        help.syslanguage = language;
        help.file_name = "systemSettings";
        help.field_name = fieldName;
        help.brief = config.description;

        help.doInsert();
    }
}

/**
 * update scmessage/help for update trigger
 */
function onUpdateTrigger(config, oldconfig) {
    if (oldconfig.label != config.label || oldconfig.id != config.id) {
        removeMessageEntry(oldconfig);
        createMessageEntry(config);
    }

    if (!funcs.same(oldconfig.description, config.description) || oldconfig.id != config.id) {
        removeHelpEntry(oldconfig);
        createHelpEntry(config);
    }
}

function removeMessageEntry(config) {
    lib.localizeTable.removeEntry("systemSettingsConfig", config);
}

function removeHelpEntry(config) {
    var sql = 'syslanguage~="xxx" and file.name="systemSettings" and field.name="$' + config.id + '"';

    $("help").find(sql).iterate(function(help) {
        help.doDelete();
    });
}

/**
 * remove scmessage/help for delete trigger
 */
function onDeleteTrigger(config) {
    removeMessageEntry(config);
    removeHelpEntry(config);
}

/**
 * initialize password system settings
 * used in System Information Record
 */
function initializePasswordSettings() {
    $("!systemSettingsConfig").fields("id", "value").find('module="Password"').iterate(function(setting) {
        var id = setting.id;
        vars["$" + id] = setting.value;
        vars["$label." + id] = funcs.scmsg(id, "local:systemSettingsConfig") + ":";
    });
}


/**
 * check whether password system settings changed
 * used in System Information Record
 */
function isPasswordSettingsChanged() {
    var changed = false;

    $("!systemSettingsConfig").fields("id", "value").find('module="Password"').iterate(function(setting) {
        var oldValue = setting.value;
        var newValue = vars["$" + setting.id];

        if (oldValue != newValue) {
            changed = true;
            return true;
        }
    });

    return changed;
}


/**
 * update password system settings
 * used in System Information Record
 */
function updatePasswordSettings() {
    updateSettings('module="Password"');
}


/**
 * update common system settings
 */
function updateCommonSettings() {
    updateSettings('module~="Password"');
}


function updateSettings(filter) {
    $("!systemSettingsConfig").fields("id").find(filter).iterate(function(setting) {
        var value = vars["$" + setting.id];

        // datetime
        if (_.isDate(value)) {
            value = value.toISOString();
        }

        setValue(setting.id, value);
    });
}

/**
 * initialize common system settings
 */
function initializeCommonSettings() {
    $("!systemSettingsConfig").fields("id", "value", "type").find('module~="Password"').iterate(function(setting) {
        if (setting.type == "datetime") {
            vars["$" + setting.id] = convertValueToDateTime(setting.value);
        } else {
            vars["$" + setting.id] = setting.value;
        }
    });
}


/**
 * Check password settings
 */
function checkPasswordSettings() {
    return checkSettings('module="Password"');
}


/**
 * Check common settings
 */
function checkCommonSettings() {
    return checkSettings('module~="Password"');
}

function checkSettings(filter) {
    var result = {
        "returnCode": RC_SUCCESS,
        "message": "",
        "cursorPosition": ""
    };

    $("!systemSettingsConfig").select(filter).iterate(function(setting) {
        var valid = checkSetting(setting, true);
        if (!valid) {
            result.returnCode = RC_VALIDATION_FAILED;

            var id = setting.id;
            var field = "$" + id;
            result.cursorPosition = field;

            var label = funcs.scmsg(id, "local:systemSettingsConfig");
            var value = vars[field];

            if (setting.type == "number") {
                result.message = funcs.scmsg(1, "settings", [label, value]);
            } else if (setting.type == "datetime") {
                result.message = funcs.scmsg(2, "settings", [label, value]);
            }

            return true;
        }
    });

    return result;
}


/**
 * Check whether the setting value is valid
 */
function checkSetting(setting, withVariable) {
    var value = withVariable ? vars["$" + setting.id] : setting.value;

    switch (setting.type) {
        case "boolean":
            if (!value) {
                return true;
            }
            switch (value.toLowerCase()) {
                case "true":
                case "false":
                case "t":
                case "f":
                case "0":
                case "1":
                    return true;
            }
            return false;

        case "number":
            if (!value) {
                return !setting.mandatory;
            }

            if (!_.isFinite(value)) {
                return false;
            }

            // validation check
            var valid = setting.validationJSON;
            if (valid) {
                var validObj;
                try {
                    validObj = JSON.parse(valid);
                } catch (e) {
                    return false;
                }
                var min = validObj.min;
                var max = validObj.max;

                var nvalue = Number(value);
                if ((min && nvalue < min) || (max && nvalue > max)) {
                    return false;
                }
            }
            return true;

        case "datetime":
            return value ? !Number.isNaN(Date.parse(value)) : !setting.mandatory;

        case "string":
            return value ? true : !setting.mandatory;

        default:
            return true;
    }
}


function getStringValue(id) {
    var config = $("!systemSettingsConfig").fields("value").find('id=:1', id).uniqueResult();

    return config ? config.value : "";
}


function getNumberValue(id) {
    var value = getStringValue(id);
    return value ? parseInt(value, 10) : null;
}


function getBooleanValue(id) {
    var value = getStringValue(id);
    return convertValueToBoolean(value);
}

function convertValueToBoolean(value) {
    if (!value) {
        return false;
    }

    value = value.trim();
    if (value.length == 0) {
        return false;
    }

    value = value.toLowerCase();
    if (value == "false" || value == "f" || value == "0") {
        return false;
    }

    return true;
}

function convertValueToDateTime(value) {
    if (!value) {
        return null;
    }

    value = value.trim();

    if (value.length == 0) {
        return null;
    }

    return new Date(value);
}

function setValue(id, value) {
    var config = $("systemSettingsConfig").find('id=:1', id).uniqueResult();
    if (config == null) {
        return;
    }

    config.value = value;
    config.doUpdate();
}


/**
 * Create system settings dynamic form
 */
function buildForm() {
    var settings = {
        name: getSystemSettingsFormat(),
        title: funcs.scmsg("systemSettings", "tablename"),
        border: {
            width: 200,
            height: 30
        },
        fields: [],

        layout: {
            fullWidth: 100,
            labelWidth: 60
            // inputX: 40,
            // inputWidth: 20
        }
    };

    settings.fields.push({
        type: 'glue',
        height: 1
    });

    // ignore password settings which shown in the System Information Record directly
    var query = 'module~="Password"';

    $("!systemSettingsConfig").fields("id", "value", "type").
    setOrderBy(["module", "type", "id"], [SCFILE_ASC, SCFILE_ASC, SCFILE_ASC]).
    find(query).iterate(function(config) {
        var id = config.id;
        var name = "$" + id;
        vars[name] = config.value;
        var title = funcs.scmsg(id, "local:systemSettingsConfig");
        var type = config.type;

        // checkbox for boolean       
        if (type == "boolean") {
            vars[name] = convertValueToBoolean(vars[name]);
            settings.fields.push({
                "type": 'checkbox',
                "height": 1,
                "name": name,
                "title": title
            });
        }
        // datetime
        else if (type == "datetime") {
            vars[name] = convertValueToDateTime(vars[name]);
            settings.fields.push({
                "type": type,
                "height": 1,
                "name": name,
                "title": title + ":"
            });
        }
        // default
        else {
            settings.fields.push({
                "type": 'input',
                "height": 1,
                "name": name,
                "title": title + ":"
            });
        }
    });

    return lib.DynamicFormBuilder.buildForm(settings);
}


function getSystemSettingsFormat() {
    // this is a virtual format
    return "systemSettings";
}