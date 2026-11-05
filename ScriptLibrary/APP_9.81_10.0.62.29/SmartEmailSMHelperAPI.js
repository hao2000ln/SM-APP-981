var REST_URL = "http://localhost:13999/SM/9/rest/";

var ReturnCode = lib.SmartEmailReturnCode.getReturnCode();

function createRESTHeader(operator) {
    var lang = lib.NotificationRecipientsHelp.getLang(operator);
    var headers = lib.smis_RestClient.createBasicAuthHttpHeaders(lang, operator, "");
    var contentType = new Header();
    contentType.name = "Content-type";
    contentType.value = "application/json";
    headers.push(contentType);

    var lwssoHeader = new Header();
    lwssoHeader.name = "Cookie";
    var token = getLwssoToken(operator);
    lwssoHeader.value = "LWSSO_COOKIE_KEY=" + token;
    headers.push(lwssoHeader);


    var ope = new SCFile("operator", SCFILE_READONLY);
    var query = 'name="' + operator + '"';
    var ret = ope.doSelect(query);
    if (ret == RC_SUCCESS) {
        if (ope['ess.access.only']) {
            var smEssUser = new Header();
            smEssUser.name = "X-SMEssUser";
            smEssUser.value = "true";
            headers.push(smEssUser);
        }
    }

    return headers;
}

function approveInteraction(interactionId, action, operator) {
    var promise = new Promise();

    var responseHeader = {};
    try {
        var interaction = {
            "incident_id": interactionId
        };
        var headers = createRESTHeader(operator);

        var postBody = '{"Interaction":{}}';
        var url = REST_URL + "interactions/" + interactionId + "/action/" + action;
        var response = lib.smis_RestClient.doRESTPostRequest(url, headers, postBody, null, null, null, responseHeader);

        var retObject = eval("(" + response + ")");
        if (retObject.ReturnCode == 0) {
            promise.fulfillPromise(ReturnCode.SUCCESS);
            return promise;
        }
    } catch (ex) {
        var responseCode = lib.smis_RestClient.getResponseCode(ex);
        if (!responseCode) {
            responseHeader["returnCode"] = responseCode;
        }
    }
    var returnCode = responseHeader["returnCode"];
    if (returnCode == "401") {
        promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
    } else {
        promise.rejectPromise(ReturnCode.SERVER_ERROR);
    }

    return promise;
}

function addApproveComment(interactionId, comment) {
    var promise = new Promise();

    var approval = new SCFile("Approval");
    var query = "unique.key=\"" + interactionId + "\" and file.name=\"incidents\" and approval.status=\"pending\"";
    var ret = approval.doSelect(query);
    if (ret == RC_SUCCESS) {
        approval.comments.push(comment);
        var ret = approval.doUpdate();
        if (ret == RC_SUCCESS) {
            promise.fulfillPromise(ReturnCode.SUCCESS);
        } else {
            promise.rejectPromise(ReturnCode.SERVER_ERROR);
        }
    } else {
        promise.rejectPromise(ReturnCode.RECORD_NOT_FOUND);
    }
    return promise;
}


function createInteraction(interaction, operator) {
    var promise = new Promise();

    var jsonBody = toJson(interaction, 'ServiceDesk', 'Interaction');
    _createRecordInternal(REST_URL + "interactions/111111/action/create", jsonBody, operator).then(
        function(retObject) {
            promise.fulfillPromise(retObject.Interaction.CallID);
        },
        function(code) {
            promise.rejectPromise(code);
        }
    );
    return promise;
}

function createIncident(incident, operator) {
    var promise = new Promise();
    var jsonBody = toJson(incident, 'IncidentManagement', 'Incident');
    _createRecordInternal(REST_URL + "incidents", jsonBody, operator).then(
        function(retObject) {
            promise.fulfillPromise(retObject.Incident.IncidentID);
        },
        function(code) {
            promise.rejectPromise(code);
        }
    );
    return promise;
}

function _createRecordInternal(restUrl, jsonBody, operator) {
    var promise = new Promise();

    var responseHeader = {};
    try {
        var headers = createRESTHeader(operator);

        var response = lib.smis_RestClient.doRESTPostRequest(restUrl, headers, jsonBody, null, null, null, responseHeader);
        var retObject = eval("(" + response + ")");
        if (retObject.ReturnCode == 0) {
            promise.fulfillPromise(retObject);
            return promise;
        }
    } catch (ex) {
        var responseCode = lib.smis_RestClient.getResponseCode(ex);
        if (!responseCode) {
            responseHeader["returnCode"] = responseCode;
        }
    }
    var returnCode = responseHeader["returnCode"];
    if (returnCode == "401") {
        promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
    } else {
        promise.rejectPromise(ReturnCode.SERVER_ERROR);
    }

    return promise;
}

// convert scfile to json compliant with web service
function toJson(file, serviceName, objectName) {
    var config = new SCFile('extaccess');
    config.doSelect('service.name="' + serviceName + '" and object.name="' + objectName + '"');
    var fieldList = config.soafield;
    var captionList = config.soacaption;
    var soaTypeList = config.soatype;

    var jsObj = lib.RestfulMain.file2Object(file, fieldList, captionList, soaTypeList, config['rest.resource.name']);
    jsObj = toSimpleObj(jsObj);

    return lib.JSON2.toJSON(jsObj)
}


function toSimpleObj(jsObj) {
    var value = jsObj["value"];
    var type = jsObj["type"];
    if (type == "array" && value.length > 0) { // if array
        var obj = [];
        for (var i = 0; i < value.length; i++) {
            var retValue = toSimpleObj(value[i]);
            if (retValue) {
                obj[i] = retValue;
            }
        }
        return obj;
    } else if (type == "object") { // if object
        var obj = {};
        for (var prop in value) {
            if (Object.hasOwnProperty.call(value, prop)) {
                var retValue = toSimpleObj(value[prop]);
                if (retValue) {
                    obj[prop] = retValue;
                }
            }
        }
        return obj;
    } else if ((type == "string" || type == "datetime") && value != "") { // stsring
        return value;
    }
}

// get json from rest web service
function getJson(interactionId, url, username, password) {
    var headers = lib.smis_RestClient.createBasicAuthHttpHeaders("en", username, password);

    var response = lib.smis_RestClient.doRESTGetRequest(url + "/" + interactionId, headers);
    return response;
}