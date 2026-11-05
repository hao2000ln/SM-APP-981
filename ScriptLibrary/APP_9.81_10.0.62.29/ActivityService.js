var $ = lib.c.$;
var logger = getLog("ActivityService");

function getAllowList() {
   var result = {};
    var allowList = findHtmlEditorAllowList();
    var attrs = [], protocols = [];
    if (allowList && allowList.attrs && allowList.attrs.length() > 0) {
        for (var i = 0, len = allowList.attrs.length(); i < len; i++) {
            attrs.push({
                tag: allowList.attrs[i]['tag'],
                value: allowList.attrs[i]['attr']
            });
        }
            }

    if (allowList && allowList.protocols && allowList.protocols.length() > 0) {
        for (var i = 0, len = allowList.protocols.length(); i < len; i++) {
            var pArr = allowList.protocols[i]['protocol'];
            if (pArr != null) {
                pArr = allowList.protocols[i]['protocol'].split(" ");
            }
            protocols.push({
                tag: allowList.protocols[i]['ptag'],
                attr: allowList.protocols[i]['pattr'],
                value: pArr
            });

        }
    }

    result.attrs = attrs;
    result.protocols = protocols;
    return result;
}

function findHtmlEditorAllowList() {
    var query = 'enabled=true';
    return $("htmltags", SCFILE_READONLY).select(query).uniqueResult();
}

function getActivityTypeGlobalList() {
    var typeGlobleListName = 'ActivityTypesAll';
    var globallist = new SCFile("globallists", SCFILE_READONLY);
    var rc = globallist.doSelect("name=\"" + typeGlobleListName + "\"");

    var typeGlobleList = {};
    if (rc == RC_SUCCESS) {
        var listvariable = globallist["list.variable"];
        var dispvariable = globallist["display.variable"];

        var values = lib.globalListTools.getGlobalListValue(listvariable);
        var labels = lib.globalListTools.getGlobalListValue(dispvariable);

        var len = Math.min(values.length(), labels.length());
        var i;
        for (i = 0; i < len; i++) {
            typeGlobleList[values[i]] = labels[i];
        }
    }
    return typeGlobleList;
}

function queryActivityLogs(field) {
    var ACTIVITY_FIELDS = ["thenumber", "type", "datestamp", "operator", "description", "cust.visible"];

    var record = vars.$L_file;
    if (record == null) {
        return null;
    }

    var currentFile = funcs.filename(record);
    var fieldWrapper = {};
    fieldWrapper.field = field;

    var link = lib.LinkUtil.getLink(record, currentFile, fieldWrapper);
    if (!link) {
        return null;
    }

    var typeGlobleList = getActivityTypeGlobalList();
    var queryFile = lib.LinkUtil.queryByVJ(record, currentFile, fieldWrapper, ACTIVITY_FIELDS, true);

    var activityLogs = [];
    if (queryFile) {
        var file = queryFile.file;

        var rc = file.getFirst();
        while (rc == RC_SUCCESS) {
            var activityLog = {};
            var j;
            for (j = 0; j < ACTIVITY_FIELDS.length; j++) {
                var value = file[ACTIVITY_FIELDS[j]];

                var type = system.functions.type(value);
                if (type == lib.DataTypeConst.typeArray()) {
                    activityLog[ACTIVITY_FIELDS[j]] = lib.ArrayUtil.toJsArray(value);
                } else if (type == lib.DataTypeConst.typeDateTime()) {
                    activityLog[ACTIVITY_FIELDS[j]] = value.getTime();
                } else {
                    activityLog[ACTIVITY_FIELDS[j]] = value;
                }
            }

            var typeValue = activityLog.type;
            var typeLabel = typeGlobleList[typeValue];
            if (!typeLabel){
                typeLabel = typeValue;  
            }
            activityLog.type = {
                "value": typeValue,
                "label": typeLabel
            };
            var name = activityLog.operator;
            activityLog.operator = {
                "name": name
            };
            activityLog.custVisible = activityLog["cust.visible"];
            delete activityLog["cust.visible"];

            activityLogs.push(activityLog);
            rc = file.getNext();
        }
    }
    return activityLogs;
}
