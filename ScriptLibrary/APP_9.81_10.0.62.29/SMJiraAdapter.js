/******************************************************
 * Module Name: SMIS SM-Jira Adapter
 * Function: Adapter Interface
 * Author: Jiang, Zhi-Qiang
 * Version: 1.00
 * Creation Date: Nov, 2022
 *******************************************************/
var logger = getLog('SMJiraAdapter');
var jiraUtil = lib.SMJiraUtil;

var Class = lib.smis_Prototype.getClass();

var SMJiraAdapterClass = Class.create({
    initialize: function(configItem) {
        this.configItem = configItem;
    },

    getRecords: function() {
        return [];
    },

    sendRecord: function() {},

    getFields: function() {},

    getModuleList() {
        return getModuleList(this.configItem);
    }

});


function getClass() {
    return SMJiraAdapterClass;
}

function setLoggerLevel(level) {
    logger.setLevel(level);
}

function testConnect(configFile) {
    var restBase = "rest/api/2";
    var config = jiraUtil.getSMISConfig(configFile);
    var headers = jiraUtil.createRequestHeader(config);
    var url = config.baseUrl + "/" + restBase + "/project";

    var responseHeader = {};
    var message;
    try {
        var response = doHTTPRequest('GET', url, headers, null, 0, 0, 0, responseHeader, false, false, false, config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
        var returnCode = responseHeader['returnCode'];
        if (returnCode == 200) {
            if (response == "[]") {
                message = funcs.scmsg(117, "smis");
                if (responseHeader["X-Seraph-Loginreason"]) {
                    message += "\n" + responseHeader["X-Seraph-Loginreason"];
                }

                logger.error("SMJiraAdapter", "responseHeader=" + JSON.stringify(responseHeader));

            } else {
                message = funcs.scmsg(116, "smis");
            }
        } else {
            message = funcs.scmsg(117, "smis") + "\nReturn Code: " + returnCode;
            logger.error("SMJiraAdapter", "response=" + response);
        }
    } catch (ex) {
        message = funcs.scmsg(117, "smis");
        message += "\n" + ex;
    }

    return message;
}

function getModuleList(file) {
    var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
    var valueList = ['incidentModule', 'changeModule'];
    var valueListEnabled = valueList;
    if (file) {
        valueListEnabled = valueList.filter(item => getParmeterValue(file, 'jira.' + item + 'Enabled') == true);
    }
    var displayList = valueListEnabled.map(item => funcs.scmsg('module-' + item, 'jira'));
    var defaultValue = null;
    if (valueListEnabled.length > 0) {
        defaultValue = valueListEnabled[0];
    }

    return {
        "valueList": valueListEnabled,
        "displayList": displayList,
        "defaultValue": defaultValue
    };
}

function supportJsMapping() {
    return false;
}