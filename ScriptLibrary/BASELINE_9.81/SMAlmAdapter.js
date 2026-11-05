/******************************************************
 * Module Name: SMIS SM-Alm Adapter
 * Function: Adapter Interface
 * Author: Zhang Qi
 * Version: 1.00
 * Creation Date: Jan, 2023
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var SMAlmAdapterClass = Class.create({
    initialize: function(configItem) {
        this.configItem = configItem;
    },

    getRecords: function() {
        return [];
    },

    sendRecord: function(record, action) {},

    getFields: function() {},

    getModuleList() {
        return getModuleList(this.configItem);
    }

});


function getClass() {
    return SMAlmAdapterClass;
}


/**
 * Test Connection
 */
function testConnect(configFile) {
    let getParam = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
    let name = getParam(configFile, 'alm.name');
    let baseUrl = getParam(configFile, 'alm.baseUrl');
    let clientId = getParam(configFile, 'alm.clientId');
    let clientSecret = getParam(configFile, 'alm.clientSecret');
    let domain = getParam(configFile, 'alm.domain');
    let project = getParam(configFile, 'alm.project');

    var config = {
        name,
        domain,
        project,
        baseUrl,
        clientId,
        clientSecret
    };

    var fieldList = ['name', 'domain', 'project', 'baseUrl', 'clientId', 'clientSecret'];
    var found = fieldList.find(name => config[name] == null || config[name].trim() == '');

    if (found) {
        return funcs.scmsg('58', 'smis', [funcs.scmsg('param.' + found, 'alm')]);
    }

    let message = lib.AlmUtil.loginTest(config);

    return message;
}


function getModuleList(file) {
    let getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
    //    var file = vars.$L_file;
    let valueList = ['changeToDefect', 'changeToFeature', 'problemToDefect'];
    let valueListEnabled = valueList;
    if (file) {
        valueListEnabled = valueList.filter(item => getParmeterValue(file, 'alm.' + item + 'Enabled') == true);
    }
    // var displayList = ['Change To Defect', 'Change To Feature', 'Problem To Feature'];
    displayList = valueListEnabled.map(item => {
        let clazz = (item == 'changeToFeature') ? 'alm' : 'octane';
        return funcs.scmsg('module-' + item, clazz);
    });
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