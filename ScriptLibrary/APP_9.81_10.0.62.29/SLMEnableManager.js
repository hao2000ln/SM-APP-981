var $ = lib.c.$;
var datadictCaption = [{
    "datadictName": "sla",
    "fieldName": ["agreement.id", "contacts", "current.phase", "expiration", "external.support.groups", "next.review.date", "penalties.incentives", "review.date", "review.frequency", "start", "support.groups"],
    "caption": ["Agreement ID", "Agreed By", "Phase", "Expiration Date", "External Assignment Group", "Next Service Review Date", "Penalties and Incentives", "Next Agreement Review Date", "Service Review Frequency", "Effective From", "Assignment Groups"]
}, {
    "datadictName": "probsummary",
    "fieldName": ["agreement.id", "sla.alert.time", "sla.breach", "sla.ended", "sla.expire", "sla.started"],
    "caption": ["Agreement ID", "SLT Alert Time", "SLT Breached", "SLT Ended", "SLT Expiration", "SLT Started"]
}];

var datadictType = [{
    "datadictName": "sla",
    "fieldName": ["penalties.incentives"],
    "type": ["description"]
}];

var datadictUsage = [{
    "datadictName": "sla",
    "fieldName": ["category", "current.phase", "display.category", "penalties.incentives"],
    "usage": [1, 1, 2, 2]
}];

var datadictMadantory = [{
    "datadictName": "sla",
    "fieldName": ["title", "start", "expiration"],
    "mandatory": [false, false, false]
}];


var datadictDefault = [{
    "datadictName": "sla",
    "fieldName": ["joinValue"],
    "deflt": ["default"]
}]

function enableSlaDatadictType() {
    var types = [];
    var fields = [];
    var sql;
    for (var i = 0; i < datadictType.length; i++) {
        sql = "name=\"" + datadictType[i].datadictName + "\"";
        $("datadict").select(sql).iterate(function(record) {
            sql = "name=\"" + datadictType[i].datadictName + "\"";
            fields = record["fields"];
            types = record["fieldUsage"];
            for (var j = 0; j < datadictType[i].fieldName.length; j++) {

                for (var k = 0; k < fields.length(); k++) {
                    if (fields[k] === datadictType[i].fieldName[j]) {
                        if ("" !== datadictType[i].type[j]) {
                            types[k] = datadictType[i].type[j];
                        }

                    }
                }
            }
            record.doUpdate();
        });
    }
}


function enableSlaDatadictUsage() {
    var usages = [];
    var fields = [];
    var sql;
    for (var i = 0; i < datadictUsage.length; i++) {
        sql = "name=\"" + datadictUsage[i].datadictName + "\"";
        $("datadict").select(sql).iterate(function(record) {
            sql = "name=\"" + datadictUsage[i].datadictName + "\"";
            fields = record["fields"];
            usages = record["sysFieldType"];
            for (var j = 0; j < datadictUsage[i].fieldName.length; j++) {

                for (var k = 0; k < fields.length(); k++) {
                    if (fields[k] === datadictUsage[i].fieldName[j]) {
                        if (0 !== datadictUsage[i].usage[j]) {
                            usages[k] = datadictUsage[i].usage[j];
                        }
                    }
                }
            }
            record.doUpdate();
        });
    }
}


function enableSlaDatadictCaption() {
    var fields = [];
    var captions = [];
    var sql;
    for (var i = 0; i < datadictCaption.length; i++) {
        sql = "name=\"" + datadictCaption[i].datadictName + "\"";
        $("datadict").select(sql).iterate(function(record) {
            sql = "name=\"" + datadictCaption[i].datadictName + "\"";
            fields = record["fields"];
            captions = record["captions"];

            for (var j = 0; j < datadictCaption[i].fieldName.length; j++) {

                for (var k = 0; k < fields.length(); k++) {
                    if (fields[k] === datadictCaption[i].fieldName[j]) {
                        if ("" !== datadictCaption[i].caption[j]) {
                            captions[k] = datadictCaption[i].caption[j];
                        }
                    }
                }
            }
            record.doUpdate();
        });
    }
}

function enableSlaDatadictMadantory() {
    var madantorys = [];
    var fields = [];
    var sql;
    for (var i = 0; i < datadictMadantory.length; i++) {
        sql = "name=\"" + datadictMadantory[i].datadictName + "\"";
        $("datadict").select(sql).iterate(function(record) {
            sql = "name=\"" + datadictMadantory[i].datadictName + "\"";
            fields = record["fields"];
            madantorys = record["mandatory"];
            for (var j = 0; j < datadictMadantory[i].fieldName.length; j++) {

                for (var k = 0; k < fields.length(); k++) {
                    if (fields[k] === datadictMadantory[i].fieldName[j]) {
                        if ("" !== datadictMadantory[i].mandatory[j]) {
                            madantorys[k] = datadictMadantory[i].mandatory[j];
                        }

                    }
                }
            }
            record.doUpdate();
        });
    }
}

function enableSlaDatadictDefault() {
    var fields = [];
    var defaults = [];
    var sql;
    for (var i = 0; i < datadictDefault.length; i++) {
        sql = "name=\"" + datadictDefault[i].datadictName + "\"";
        $("datadict").select(sql).iterate(function(record) {
            sql = "name=\"" + datadictDefault[i].datadictName + "\"";
            fields = record["fields"];
            defaults = record["defaults"];
            for (var j = 0; j < datadictDefault[i].fieldName.length; j++) {

                for (var k = 0; k < fields.length(); k++) {
                    if (fields[k] === datadictDefault[i].fieldName[j]) {
                        if ("" !== datadictDefault[i].deflt[j]) {
                            defaults[k] = datadictDefault[i].deflt[j];
                        }

                    }
                }
            }
            record.doUpdate();
        });
    }
}

function enableSlaDatadict() {
    enableSlaDatadictMadantory()
    enableSlaDatadictDefault()
    enableSlaDatadictType();
    enableSlaDatadictUsage();
    enableSlaDatadictCaption();
}

