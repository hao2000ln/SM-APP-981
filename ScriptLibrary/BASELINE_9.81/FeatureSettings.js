var _ = lib.Underscore.require();
var trim = lib.c.$.trim;

// >>>>>>>>>>>>>>>>>>>>>>>>>> basic tools
function getConfig(code) {
    var list = code.split('.');
    return lib[list[0]][list[1]]();
}

function initConfig(code) {
    var config = getConfig(code);
    vars['$L.file'] = config.load();
    vars['$L.form'] = config.getForm();
    vars['$L.title'] = config.getTitle();

    if (vars['$L.file'] == null) {
        vars['$L.file'] = new SCFile('!typecheck');
    }
}

function saveConfig(code, file) {
    var config = getConfig(code);
    if (config.validate()) {
        config.save(file);
    }
}
// Global Settings
var GLOBAL_CONFIG = {
    name: 'global-setting-form',
    title: funcs.scmsg("Feature Tracker Global Settings", "featuretracker"),
    fields: [{
            type: 'glue',
            height: 1
        },
        {
            name: 'releaseURL',
            type: 'input',
            title: funcs.scmsg("Release Repository URL", "featuretracker") + ":"
        },
        {
            name: 'tempFolder',
            type: 'input',
            title: funcs.scmsg("Temp Folder", "featuretracker") + ":"
        },
        {
            type: 'glue',
            height: 1
        },
        {
            name: 'remoteSM',
            type: 'input',
            title: funcs.scmsg("Remote SM End Point", "featuretracker") + ":"
        },
        {
            name: 'remoteUserName',
            type: 'input',
            title: funcs.scmsg("Remote SM User Name", "featuretracker") + ":"
        },
        {
            name: 'remotePassword',
            type: 'password',
            title: funcs.scmsg("Remote SM Password", "featuretracker") + ":"
        },
        {
            type: 'glue',
            height: 1
        },
        {
            name: 'watchedTables',
            type: 'textArea',
            title: funcs.scmsg("Watched Tables", "featuretracker") + ":",
            height: 12,
            readonly: true
        }
    ]
};

function getGlobalConfig() {
    return {
        getForm: function() {
            return lib.DynamicFormBuilder.buildForm(GLOBAL_CONFIG);
        },
        getTitle: function() {
            return GLOBAL_CONFIG.title;
        },
        load: function() {
            return loadGlobalConfig();
        },
        save: function(file) {
            saveGlobalConfig(file);
        },
        validate: function() {
            return true;
        }
    };
}

function saveGlobalConfig(file) {
    var password = file.remotePassword;
    file.remotePassword = encrypt(password);
    file.doAction("save");
}

function isEncrypted(value) {
    return lib.EncryptUtil.isEncrypted(value);
}

function isPasswordField(field) {
    return field.type == 'password';
}

function decrypt(value) {
    return lib.EncryptUtil.decrypt(value);
}

function encrypt(value) {
    return lib.EncryptUtil.encrypt(value);
}

function loadGlobalConfig() {
    var file = lib.c.$('!FeatureSettings', true).select('id="0"').one();

    if (null == file) {
        file = new SCFile("FeatureSettings");
        file.id = "0";
        file.userName = "0";
        file.doInsert();
    }
    var watchTable = getRTEParm('svc_files');
    if (watchTable == null || watchTable.indexOf("ERROR:") == 0) {
        watchTable = readFile("svc_include.props", "t");
        if (watchTable != -1) {
            file.watchedTables = watchTable;
        }
    } else {
        file.watchedTables = watchTable.replace(/,/g, "\n");
    }
    return file;
}

function getGlobalSettings() {
    var file = loadGlobalConfig();

    var list = _.map(file.watchedTables.split('\n'), function(item) {
        return trim(item);
    });

    var fields = GLOBAL_CONFIG.fields;
    var obj = {};
    var k;
    for (k = 0; k < fields.length; k++) {
        var name = fields[k].name;
        if (name) {
            obj[name] = decrypt(file[name]);
        }
    }

    obj['watchedTables'] = list;
    obj.type = 'git';

    return obj;
}

////////////////////////////////////////////////////////////////
///  Watchdog Schedule 
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///  Watchdog Schedule 
////////////////////////////////////////////////////////////////
var FEATURE_WATCHDOG_NAME = 'Feature Watchdog';

function initWatchdogSchedule() {
    var sch = lib.c.$('!schedule', true).find('name=:0', FEATURE_WATCHDOG_NAME).one();
    vars["$feature.watchdlog.sch.status"] = "";
    vars["$feature.watchdlog.last.run"] = "";
    vars["$feature.watchdlog.next.run"] = "";
    vars['$L.running'] = false;

    if (sch != null) {
        vars['$L.running'] = true;
        vars["$feature.watchdlog.sch.status"] = sch.status;
        vars["$feature.watchdlog.last.run"] = sch.action_time;
        vars["$feature.watchdlog.next.run"] = sch.expiration;
    }
}

function insertWatchdogSchedule() {
    var sch = new SCFile("schedule");
    sch["name"] = FEATURE_WATCHDOG_NAME;
    sch["class"] = "problem";
    sch["expiration"] = system.functions.tod();
    sch["javascript"] = "try {\n    lib.DevOpsBase.run();\n} catch (e) {\n    print(\"WatchDog Exception: \"+e);\n}";

    var interval = lib.FeatureSettings.getGlobalSettings().autoRefreshInterval;
    if (!interval) {
        interval = 3600; // 60 mins default
    }

    var ZERO = -62168428800000;

    interval = new Date(ZERO + interval * 1000);

    sch["repeat"] = system.functions.val(interval, 3);
    sch.doInsert();

    initWatchdogSchedule();
}

function deleteWatchdogSchedule() {
    var sch = lib.c.$('!schedule', true).find('name=:0', FEATURE_WATCHDOG_NAME).one();
    if (sch != null) {
        sch.doDelete();
    }
    initWatchdogSchedule();
}