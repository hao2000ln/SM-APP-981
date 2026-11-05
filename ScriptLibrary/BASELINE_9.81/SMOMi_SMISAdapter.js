/*
 *
 */

var Class = lib.smis_Prototype.getClass();

function getClass() {
    return Class.create({

        configItem: null,

        initialize: function(configItem) {
            this.configItem = configItem;
        },

        sendRecord: function(record, action) {
            return __updateOMi(record, this.configItem);
        },

        getFields: function() {}
    });
}

function __updateOMi(record, configItem) {
    var b = true;

    if (record) {
        var incident = lib.SMOMiUtil.getRecordsFromFile("probsummary", 'number="' + record.id + '"');
        if (incident) {
            var result = lib.SMOMi.updateOMi(incident);
            if (result && result.error) {
                print("update OMi failed: " + JSON.stringify(result.error));
                b = false;
            }
        }
    }

    return b;
}

function pushTaskIntoSMIS(incident) {
    if (incident) {
        var intId = lib.SMOMi.getSMOMiIntIdInSMIS(incident);
        var incidentId = incident.number;

        var task = new(lib.smis_Task.getClass())(intId);
        task.inRecord = {
            id: incidentId
        };
        task.object = "probsummary";
        task.internalId = incidentId;
        task.direction = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
        return lib.smis_TaskManager.pushTaskWithId(task, incidentId);
    }

    return null;
}

function removeTaskFromSMIS(incident) {
    if (incident) {
        var intId = lib.SMOMi.getSMOMiIntIdInSMIS(incident);
        lib.smis_TaskManager.removeTaskWithId(intId, incident.number);
    }
}


function testConnect(configFile) {
    var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

    var targetUrl = getParmeterValue(vars.$L_file, "omi.server.url");
    var userName = getParmeterValue(vars.$L_file, "username");
    var userPassword = getParmeterValue(vars.$L_file, "password");
    try {
        var requestURL = targetUrl.substring(0, targetUrl.indexOf('synchronization'));
        var respHeaders = {};
        var response = lib.smis_RestClient.doRESTGetRequest(requestURL, lib.smis_RestClient.createBasicAuthHttpHeaders("en", userName, userPassword), 15, 15, 15, respHeaders);
        var httpCode = respHeaders['returnCode'];

        if (httpCode == '401') {
            throw new Error('HTTP Status 401 - Unauthorized');
        }
    } catch (ex) {
        return funcs.scmsg(117, "smis") + "\r\n" + ex;
    }
    return funcs.scmsg(116, "smis");
}