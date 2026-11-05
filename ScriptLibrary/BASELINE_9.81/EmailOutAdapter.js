/******************************************************
 * Module Name: SMIS Email Out Endpoint Adapter
 * Function: Adapter Interface
 * Author: Zhang Qi
 * Version: 1.00
 * Creation Date: Nov, 2024
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var EmailOutAdapterClass = Class.create({

    initialize: function(configItem) {
        this.configItem = configItem;
    },

    getRecords: function() {
        return [];
    },

    sendRecord: function(record, action) {},

    getFields: function() {}
});


function getClass() {
    return EmailOutAdapterClass;
}


/**
 * Get Access Token status
 *
 * @returns {String}
 */
function getOAuthAccessTokenStatus(configFile) {
    const module = lib.EmailOutUtil.getEmailOutTokenModule(configFile.intId);
    return lib.OAuthAuthentication.getTokenStatusByModule(module);
}


/**
 * Get Auth Code and Token
 *
 * @returns {Boolean}
 */
function getOAuthAuthCodeAndToken(configFile) {
    const module = lib.EmailOutUtil.getEmailOutTokenModule(configFile.intId);
    return lib.GoogleAuthentication.getAuthCodeAndToken(configFile, module);
}