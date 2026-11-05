//
//--- constants ------------------------
//
var SMOMi = 'SMOMi';
var FN_ExternalProcessReference = 'external.process.reference';
var PREFIX_OMi = 'omi.reference.prefix';
var DEFAULT_PREFIX_OMi = 'urn:x-hp:2009:opr:';
var PREFIX_SM = 'sm.reference.prefix';
var DEFAULT_PREFIX_SM = 'urn:x-hp:2009:sm:';
var SMMGRID = 'sm.mgr.id';
var OMIMGRID = 'omi.mgr.id';
var ESCALATED = 'escalated';
var INFORMATIONAL = 'informational';

//--- Test variables ---------
var TEST = false;
var smisMockObj = null;
var httpClientMockObj = null;

//
//--- log ------------------------------
//
var log = getLog("SMOMi");

/**
Called by trigger before.update.omi
*/
function takeOwnership(record) {}

/**
Invoded in display screen apm.edit.problem -> display options for "save", "save&exit" -> Post Javascript
lib.SMOMi.onUpdateFromUI(vars.$L_file)
*/
function onUpdateFromUI(record) {
    if (log.isDebugEnabled()) {
        log.debug("onUpdateFromUI()");
    }

    var smisConfig = _getEnabledOMiConfig(record[FN_ExternalProcessReference][0]); //for fixng QCCR1E64751
    if (smisConfig == null) {
        if (record[FN_ExternalProcessReference] != null && record[FN_ExternalProcessReference][0] != null && record[FN_ExternalProcessReference][0] != "") {
            // print("There is no OMi setting enabled in Integration Manager, sync operation will not be performed.");
            return;
        }
    }

    if (record[FN_ExternalProcessReference] != null && record[FN_ExternalProcessReference][0] != null && record[FN_ExternalProcessReference][0] != "") {
        if (log.isDebugEnabled()) {
            log.debug("In Before onUpdateFromUI(), extRef=" + record[FN_ExternalProcessReference][0]);
        }

        var handler = new ExternalReference(record[FN_ExternalProcessReference][0], smisConfig);
        if (handler.isInformational() && 'Work In Progress' == record['problem.status']) {
            handler.escalate();
        }

        handler.setToSMPrefix();

        if (!(record[FN_ExternalProcessReference] instanceof Array)) {
            record[FN_ExternalProcessReference] = [];
        }
        record[FN_ExternalProcessReference][0] = handler.toString();
    }
}

var referenceReg = new RegExp().compile("([^|]+:)([^:]+):([^:|]+)\\|([^|]+)\\|([^:]+):([^:]+)");

function ExternalReference(ref, smisConfig) {
    this.smisConfig = smisConfig;
    this.rawReference = ref;
    this._omiPrefix = false;
    var prefixLen = 0;

    if (log.isDebugEnabled()) {
        log.debug("raw reference:" + ref);
    }

    var arr = referenceReg.exec(ref);
    if (arr == null || arr.length < 1) {
        log.error("Wrong external process reference field: " + ref);
        return;
    }
    if (log.isDebugEnabled()) {
        log.debug(arr[0]);
    }

    this.prefix = arr[1];
    this.mgrId = arr[2];
    this.types = [arr[3], arr[4], arr[5]];
    this.evtId = arr[6];

    // is SM prefix?
    var smPrefix = DEFAULT_PREFIX_SM;
    if (smisConfig != null) {
        smPrefix = smisConfig.getConfigParameterValue(PREFIX_SM);
    }
    if (smPrefix == null) {
        smPrefix = DEFAULT_PREFIX_SM;
    }
    this._smPrefix = smPrefix == this.prefix;
    this.SM_PREFIX = smPrefix;
    if (log.isDebugEnabled()) {
        log.debug("is SM prefix:" + this.isSMPrefix());
    }

    // is OMi prefix?
    // var omiPrefix = DEFAULT_PREFIX_OMi;
    // if(smisConfig != null)
    //  omiPrefix =  smisConfig.getConfigParameterValue( PREFIX_OMi );
    // if(omiPrefix == null)
    //  omiPrefix = DEFAULT_PREFIX_OMi;
    // this._omiPrefix = smPrefix != this.prefix;
    // if(log.isDebugEnabled())
    //  log.debug("is OMi prefix:"+ this.isOMiPrefix());

    // is informational?
    this._isInformational = INFORMATIONAL == this.getInteractionTypes()[1];
}

ExternalReference.prototype = {
    isSMPrefix: function() {
        return this._smPrefix;
    },
    isOMiPrefix: function() {
        return this._omiPrefix;
    },
    //isOMiPrefix: function(){
    //  return this._omiPrefix;
    //},
    setPrefix: function(prefix) {
        this.prefix = prefix;
    },
    getPrefix: function() {
        return this.prefix;
    },
    getMgrId: function() {
        return this.mgrId;
    },
    getInteractionTypes: function() {
        return this.types;
    },
    getEvtId: function() {
        return this.evtId;
    },
    isInformational: function() {
        return this._isInformational;
    },
    escalate: function() {
        this.types[1] = ESCALATED;
    },
    setToSMPrefix: function() {
        this.prefix = this.SM_PREFIX;
    },

    toString: function() {
        return this.getPrefix() + this.getMgrId() + ":" + this.getInteractionTypes().join("|") + ":" + this.getEvtId();
    }
};

/**
Called by trigger after.update.omi
*/
function updateIncidentInOMi(incidentObj) {
    if (incidentObj[FN_ExternalProcessReference] == null || incidentObj[FN_ExternalProcessReference][0] == null) {
        return;
    }

    var smisConfig = _getEnabledOMiConfig(incidentObj[FN_ExternalProcessReference][0], true);
    if (smisConfig == null) {
        //print("There is no OMi setting enabled in Integration Manager, sync operation will not be performed.");
        return;
    }

    if (log.isDebugEnabled()) {
        log.debug("In After trigger, extRef=" + incidentObj[FN_ExternalProcessReference][0]);
    }

    var ref = new ExternalReference(incidentObj[FN_ExternalProcessReference][0], smisConfig);
    if (ref.isSMPrefix()) {
        // remove task from SMIS if existed
        lib.SMOMi_SMISAdapter.removeTaskFromSMIS(incidentObj);

        // sync to OMi
        var result = updateOMi(incidentObj);

        // if failed, then push the task into SMIS to reschedule
        if (result && result.error) {
            log.warn(result.error.message);
            log.warn("Sync incident[" + incidentObj.number + "] to OMi failed, reschedule the task in SMIS...");
            lib.SMOMi_SMISAdapter.pushTaskIntoSMIS(incidentObj);
        }
    }
}

function updateOMi(incidentObj) {
    if (log.isInfoEnabled()) {
        log.info("Sync incident[" + incidentObj.number + "] to OMi ...");
    }
    var handler = __createSMOMiHandler(incidentObj);
    return handler.updateOMi();
}

function getSMOMiIntIdInSMIS(incidentObj) {
    var configItem = _getEnabledOMiConfig(incidentObj[FN_ExternalProcessReference][0]);
    return configItem.intId;
}

function __createSMOMiHandler(incidentObj) {
    return {
        configItem: _getEnabledOMiConfig(incidentObj[FN_ExternalProcessReference][0]),

        getMappingHandler: function() {
            var mappingContext = lib.BDM_Mapping.createMappingContext();
            mappingContext.setObjectName("incident");
            mappingContext.setVersion("1.1");
            _setMappingHandlerContext(mappingContext, this.configItem);

            return lib.BDM_Mapping.createMappingHandler(mappingContext);
        },

        updateOMi: function() {
            if (incidentObj[FN_ExternalProcessReference] == null) {
                return null;
            }

            var externalProcessRef = incidentObj[FN_ExternalProcessReference][0];
            if (log.isDebugEnabled()) {
                log.debug(externalProcessRef);
            }
            if (externalProcessRef) {
                return this.invokeOMi(lib.XML_JSON.json2xml(
                        this.getMappingHandler().SMToBDM(incidentObj), ""),
                    externalProcessRef.substring(externalProcessRef.lastIndexOf(':') + 1));
            }
        },

        invokeOMi: function(reqContent, externalId) {
            var baseUrl = this.configItem.getConfigParameterValue("omi.server.url");
            baseUrl += externalId;

            var headers = this.getHTTPHeaders();

            // timeouts
            var connTimeout = parseInt(this.configItem.getConfigParameterValue("http.conn.timeout"));
            var sendTimeout = parseInt(this.configItem.getConfigParameterValue("http.send.timeout"));
            var recvTimeout = parseInt(this.configItem.getConfigParameterValue("http.rec.timeout"));

            return this.doRESTPutRequest(baseUrl, headers, reqContent, connTimeout, sendTimeout, recvTimeout);
        },

        getHTTPHeaders: function() {
            var hashMap = this.configItem.getParametersByCategory("Header");

            var list = [];
            list.push(new Header("Content-Type", "application/xml"));
            var user = "";
            var password = "";

            var key;
            for (key in hashMap) {
                var value = hashMap[key];
                if (key == "username") {
                    user = value;
                } else if (key == "password") {
                    password = value;
                } else {
                    list.push(new Header(key, value));
                }
            }
            var authHeader = new Header();
            authHeader.name = "Authorization";
            authHeader.value = "Basic " + lib.smis_CommonLib.encode64(user + ":" + password);

            list.push(authHeader);

            return list;
        },

        doRESTPutRequest: function(url, httpHeaders, httpBody, connTimeout, sendTimeout, recvTimeout) {
            if (connTimeout == null) {
                connTimeout = 15;
            }
            if (sendTimeout == null) {
                sendTimeout = 15;
            }
            if (recvTimeout == null) {
                recvTimeout = 15;
            }

            var result = {};

            try {
                if (log.isDebugEnabled()) {
                    log.debug("doRESTPutRequest -----------------");
                    log.debug("url: " + url);
                    log.debug("httpBody:");
                    log.debug(httpBody);
                }

                // constants
                const HTTP_ACTION = "PUT";

                var rawResponse = null;
                var respHeaders = {};

                if (!TEST) {
                    rawResponse = doHTTPRequest(HTTP_ACTION, url, httpHeaders, httpBody, connTimeout, sendTimeout, recvTimeout, respHeaders);
                } else {
                    rawResponse = "dummy response ...";
                }

                var returnCode = respHeaders.returnCode;

                if (log.isDebugEnabled()) {
                    log.debug("response code: " + returnCode);
                    log.debug("rawResponse:");
                    log.debug(rawResponse);
                    log.debug("----------------------------------");
                }

                if (returnCode == 200 || returnCode == 201) {
                    result.message = rawResponse;
                }
                // operation failed, e.g. 401 unauthorized
                else {
                    result.error = {
                        "code": returnCode,
                        "message": rawResponse
                    };
                }
            } catch (ex) {
                log.error("exception: " + ex);
                result.error = {
                    "code": "ConnectionError",
                    "message": typeof ex == "string" ? ex : ex.message
                };
            }

            return result;
        }
    };
}

function enableTest(smisMock, httpClientMock) {
    TEST = true;
    smisMockObj = smisMock;
    httpClientMockObj = httpClientMock;
}

function disableTest(smisMock, httpClientMock) {
    TEST = false;
    smisMock = null;
    httpClientMock = null;
}


function _getEnabledOMiConfig(externalProcessReference, printlog) {
    if (TEST && smisMockObj != null) {
        log.info("lib.SMOMi is in test mode");
        return null;
    }

    if (externalProcessReference == null || externalProcessReference == undefined) {
        return null;
    }

    var omiid = getOmiMgrID(externalProcessReference);
    if (omiid == null) {
        return null;
    }

    var instance = null;
    if (externalProcessReference) {
        instance = lib.smis_ConfigurationManager.getEnabledConfigItemByParamNameValue(SMOMi, OMIMGRID, omiid);
    }

    if (instance == null) {
        var instanceAccount = countEnabledOMiInstance();
        var totalInstance = instanceAccount[0];
        if (totalInstance == 0) {
            if (printlog == true) {
                log.warn(funcs.scmsg(104, "smis"));
            }
            return null;
        }

        var parArr;

        if (totalInstance > 1 && printlog == true) {
            if (instanceAccount[1] > 0) {
                parArr = lib.ArrayUtil.toSCDatum([instanceAccount[1], instanceAccount[0]]);
                log.error(funcs.scmsg(100, "smis", parArr));
            }
            if (instanceAccount[2] > 0) {
                parArr = lib.ArrayUtil.toSCDatum([instanceAccount[2], instanceAccount[0]]);
                log.error(funcs.scmsg(101, "smis", parArr));
            }

            if (instanceAccount[1] == 0 && instanceAccount[2] == 0) {
                parArr = lib.ArrayUtil.toSCDatum([instanceAccount[0]]);
                log.warn(funcs.scmsg(102, "smis", parArr));
            }
            return null;
        }

        if (totalInstance == 1 && (instanceAccount[1] == 1)) {
            instance = lib.smis_ConfigurationManager.getEnabledConfigItem(SMOMi);
        } else {
            if (instanceAccount[3] == 1) {
                parArr = lib.ArrayUtil.toSCDatum([instanceAccount[0]]);
                if (printlog == true) {
                    log.warn(funcs.scmsg(102, "smis", parArr));
                }
            } else {
                if (printlog == true) {
                    log.error(funcs.scmsg(103, "smis"));
                }
            }
        }
    }

    return instance;
}


/**
Invoked by event link from display option "apm.edit.problem_OMiEvent"
jscall("SMOMi.isRefBelongsToOMi", 1 in external.process.reference in $L.file)
*/
function isRefBelongsToOMi(externalRef) {
    if (externalRef == null) {
        return false;
    }
    var smisConfig = _getEnabledOMiConfig(externalRef);
    return _isRefBelongsToOMi(externalRef, smisConfig);
}

function _isRefBelongsToOMi(externalRef, smisConfig) {
    if (externalRef == null) {
        return false;
    }
    if (smisConfig != null && smisConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
        var smPrefix = smisConfig.getConfigParameterValue(PREFIX_SM);
        var omiPrefix = smisConfig.getConfigParameterValue(PREFIX_OMi);
        return (externalRef.indexOf(smPrefix) == 0 || externalRef.indexOf(omiPrefix) == 0);
    } else {
        return false;
    }
}

/**
OMI Auto-Close condition
old condition:
flag in $L.file=true and incident.autoclose in $G.pm.global.environment and not null(1 in external.process.reference in $L.file) and not nullsub(no.autoclose in $L.file, false) and jscall("SMOMi.isRefBelongsToOMi", 1 in external.process.reference in $L.file)

new condition is jscall("SMOMi.isAutoCloseEnabled")
*/
function isAutoCloseEnabled() {
    var incident = vars.$L_file;
    var b = ((incident.flag == true) && (vars.$G_pm_global_environment["incident.autoclose"] == true) &&
        (incident["no.autoclose"] != true));

    if (log.isDebugEnabled()) {
        log.debug(incident.number + " isAutoCloseEnabled() return " + b + ", flag = " + incident.flag + ", $G_pm_global_environment[\"incident.autoclose\"]" + vars.$G_pm_global_environment["incident.autoclose"] +
            ", no.autoclose = " + incident["no.autoclose"]);
    }

    return b;
}

function isAutoCloseAndResovled() {
    var incident = vars.$L_file;
    var extRef = incident["external.process.reference"];
    var b = ((incident.flag == true) && incident["problem.status"] == "Resolved" && (vars.$G_pm_global_environment["incident.autoclose"] == true) &&
        (incident["no.autoclose"] != true) && extRef != null && isRefBelongsToOMi(extRef.toArray()[0]));

    if (log.isDebugEnabled()) {
        log.debug(incident.number + " isAutoCloseAndResovled() return " + b + ", flag = " + incident.flag + ", $G_pm_global_environment[\"incident.autoclose\"]" + vars.$G_pm_global_environment["incident.autoclose"] +
            ", no.autoclose = " + incident["no.autoclose"]);
    }

    return b;
}

/**
Invoked by Alert engine "OMI-..."
jscall("SMOMi.assignAutoClosureSolution", $G.pm.global.environment, $L.file)
*/
function assignAutoClosureSolution(globalEnv, probsummary) {
    if (log.isDebugEnabled()) {
        log.debug("assignAutoClosureSolution() operator:" + vars.$L_operator);
    }
    if (globalEnv["incident.autoclose"] == null || (!globalEnv["incident.autoclose"])) {
        return probsummary;
    }

    if (probsummary["resolution.code"] == null || probsummary["resolution.code"] == "") {
        if (log.isDebugEnabled()) {
            log.debug("automatic closure code: " + globalEnv["incident.resolution.code"]);
        }
        probsummary["resolution.code"] = globalEnv["incident.resolution.code"];
    }
    if (probsummary.resolution == null || probsummary.resolution.toArray().join("") == "") {
        if (log.isDebugEnabled()) {
            log.debug("automatic solution text: " + globalEnv.incidentresolution.toArray().join());
        }
        probsummary.resolution = globalEnv.incidentresolution;
    } else {
        if (log.isDebugEnabled()) {
            log.debug("original solution text: " + probsummary.resolution.toArray().join());
        }
        var autoSolutionArr = globalEnv.incidentresolution.toArray();
        var i;
        for (i = 0; i < autoSolutionArr.length; i++) {
            probsummary.resolution.push(autoSolutionArr[i]);
        }
    }

    if (log.isDebugEnabled()) {
        log.debug("assignAutoClosureSolution() check whether incident belongs to OMi");
    }

    var ref = probsummary[FN_ExternalProcessReference];
    if (ref == null) {
        return probsummary;
    }
    var refarray = ref.toArray();
    if (refarray.length < 1) {
        return probsummary;
    }

    // this will trig SM send sync request to OMi while auto-closure
    if (log.isDebugEnabled()) {
        log.debug("going to sync auto-closed incident " + probsummary.number + " with OMi ");
    }
    var smisConfig = _getEnabledOMiConfig(probsummary[FN_ExternalProcessReference][0]);
    if (smisConfig != null && _isRefBelongsToOMi(refarray[0], smisConfig)) {
        var handler = new ExternalReference(refarray[0], smisConfig);
        handler.setToSMPrefix();
        handler.escalate();
        probsummary[FN_ExternalProcessReference][0] = handler.toString();
    }

    if (log.isDebugEnabled()) {
        log.debug("assignAutoClosureSolution() done");
    }

    return probsummary;
}

/**
Invoked by BDM_SM
*/
function setSmMgrIdToContext(mappingContext) {
    var config = _getEnabledOMiConfig();
    _setMappingHandlerContext(mappingContext, config);
}

function _setMappingHandlerContext(mappingContext, smisConfig) {
    if (smisConfig != null) {
        mappingContext.set(SMMGRID, smisConfig.getConfigParameterValue(SMMGRID));
        mappingContext.set(PREFIX_OMi, smisConfig.getConfigParameterValue(PREFIX_OMi));
        mappingContext.set(PREFIX_SM, smisConfig.getConfigParameterValue(PREFIX_SM));
    } else {
        mappingContext.set(SMMGRID, "Unknown");
        mappingContext.set(PREFIX_OMi, DEFAULT_PREFIX_OMi);
        mappingContext.set(PREFIX_SM, DEFAULT_PREFIX_SM);
    }
}


// extracts PeerMgrId from ExternalProcessReference,ExternalProcessReference data structure like the following:
//"urn:x-hp:2009:opr:f3832ff4-a6b9-4228-9fed-b79105afa3e4:incident|escalated|provider:146c182b-5cbf-4eae-b7e0-da7a22018e51"
function getOmiMgrID(externalProcessReference) {
    if (!externalProcessReference) {
        return null;
    }

    var arr = referenceReg.exec(externalProcessReference);
    if (arr == null || arr.length < 1) {
        log.error("Wrong external process reference field: " + externalProcessReference);
        return null;
    }

    return arr[2];
}

// extracts ProcessRecordID from ExternalProcessReference,ExternalProcessReference data structure like the following:
//"urn:x-hp:2009:opr:f3832ff4-a6b9-4228-9fed-b79105afa3e4:incident|escalated|provider:146c182b-5cbf-4eae-b7e0-da7a22018e51"
function getOmiEventID(externalProcessReference) {
    if (!externalProcessReference) {
        return null;
    }

    var arr = referenceReg.exec(externalProcessReference);
    if (arr == null || arr.length < 1) {
        log.error("Wrong external process reference field: " + externalProcessReference);
        return null;
    }

    return arr[6];
}

var UUIDReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function countEnabledOMiInstance() {
    var amount = [];
    amount[0] = 0; //total
    amount[1] = 0; //no parameter omi.mgr.id
    amount[2] = 0; //Configured omi.mgr.id but no value or wrong value
    amount[3] = 0; //Configured omi.mgr.id and have correct value

    var instanceConfig = new SCFile("SMISConfiguration", SCFILE_READONLY);
    instanceConfig.setFields("paramInfo");
    var RC = instanceConfig.doSelect("intId <> \"0\" and template=\"SMOMi\" and status <> \"Disabled\"");
    while (RC == RC_SUCCESS) {
        amount[0] += 1;
        var hasParameter = false;
        //print(lib.debugUtils.display(instanceConfig));
        var i;
        var length = instanceConfig.paramInfo.length();
        for (i = 0; i < length; i++) {
            //print(instanceConfig.paramInfo[i][2]);
            if (instanceConfig.paramInfo[i][2] == OMIMGRID) {
                hasParameter = true;
                var isuuid = UUIDReg.test(instanceConfig.paramInfo[i][3]);
                if (isuuid) {
                    amount[3] += 1;
                } else {
                    amount[2] += 1;
                }
                break;
            }
        }
        if (!hasParameter) {
            amount[1] += 1;
        }

        RC = instanceConfig.getNext();
    }

    return amount;
}

//add for QCCR1E120261
function isOMiIncidents(file) {
    if (file && file["external.process.reference"] && file["external.process.reference"][0]) {
        return isRefBelongsToOMi(file["external.process.reference"][0]);
    }
    return false;
}


/**
 * get recent opened incident according to external process reference
 *
 * @param {String} externalProcessReference
 * @returns {String} incident number
 */
function getRecentIncidentByReference(externalProcessReference) {

    if (!externalProcessReference) {
        return null;
    }

    // OMi event id
    var eventId = getOmiEventID(externalProcessReference);
    if (!eventId) {
        return null;
    }

    // check recent 1 day
    var date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    var query = `id="${eventId}" and open.time>'` + funcs.str(date) + "'";

    var incident = lib.c.$("!probsummary").fields("number").find(query).one();
    if (incident) {
        var incidentId = incident.number;
        log.info(`Incident ${incidentId} existed with the external process reference "${externalProcessReference}".`);
        return incidentId;
    }

    return null;
}