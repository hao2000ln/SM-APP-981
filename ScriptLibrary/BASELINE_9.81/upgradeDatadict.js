var datadictUpdates = [{
        "field": "main.table",
        "value": true,
        "tables": ["assignment", "company", "contacts", "dept", "device", "location", "operator"]
    },
    {
        "field": "display.format",
        "value": "operator",
        "tables": ["operator"]
    }
];


function updateDatadict() {
    var i;
    var j;
    for (i = 0; i < datadictUpdates.length; i++) {
        for (j = 0; j < datadictUpdates[i].tables.length; j++) {
            var datadict = lib.upgradeUtility.getRecord("datadict", "name=\"" + datadictUpdates[i].tables[j] + "\"");
            if (datadict != null) {
                datadict[datadictUpdates[i].field] = datadictUpdates[i].value;
                datadict.doUpdate();
            }
        }
    }
}


function mergeDatadict(datadictOld, datadictNew) {

    // normal fields
    var normalFields = [
        "arrayType",
        "autocomplete.show.field",
        "common.name",
        "condition",
        "description",
        "display.field",
        "display.format",
        "engine.access",
        "global.inbox",
        "ir.qbe.fields",
        "ir.search.format",
        "localizedField",
        "localizedTable",
        "personal.inbox",
        "qbe.format",
        "record.id",
        "return.field",
        "scm.condition",
        "scm.inbox",
        "scm.query",
        "scm.query.name",
        "scm.search.format",
        "scm.thread.inbox.edit",
        "scm.thread.inbox.search",
        "scm.thread.list.edit",
        "scm.thread.search.list",
        "sc.area",
        "sc.manage.screen",
        "sc.module",
        "soaexclude",
        "sqlbasename",
        "system.table",
        "use.locking"
    ];

    var i;
    for (i = 0; i < normalFields.length; i++) {
        var field = normalFields[i];
        if (datadictOld[field] == null) {
            datadictOld[field] = datadictNew[field];
        }
    }
}


/**
 * compare datadict encrypt setting
 *
 * @param {SCFile} datadictOld
 * @param {SCFile} datadictNew
 * @returns {Boolean} true, old setting is empty but new setting exists 
 */
function compareDatadictEncryptSetting(datadictOld, datadictNew) {
    var fields = datadictOld.fields;

    var encryptsOld = datadictOld.encrypt;
    var encryptsNew = datadictNew.encrypt;

    var needUpdate = false;

    var i;
    var length = fields.length();
    for (i = 0; i < length; i++) {
        // encrypt setting has been updated, log message instead of update datadict because it will cause full table update
        if (encryptsOld[i] == null && encryptsNew[i] == true) {
            needUpdate = true;

            var errorMsg = funcs.scmsg("UPG_DATADICT_SETTING_EXPECT", "upg", [datadictOld.name, fields[i], "Encrypted", "null", encryptsNew[i]]);
            lib.upgradeLog.error(errorMsg);
        }
    }

    return needUpdate;
}