/******************************************************
 * Module Name: SmartEmail End Point adapter
 * Function: provide adapter to process from SM
 * Author: Tian, ShaoQin
 * Version: 2.00
 * Creation Date: Mar, 2016
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var SmartEmailEPAdapterClass = Class.create({

    initialize: function(configItem) {
        this.configItem = configItem;
        this.logger = configItem.getLogger();
        this.instanceName = configItem.name;
    },

    getRecords: function() {
        return [];
    },

    sendRecord: function(record, action) {},

    getFields: function() {}
});


function getClass() {
    return SmartEmailEPAdapterClass;
}


/**
 * Test Connection
 */
function testConnect(configFile) {
    // validate parameters
    var validateParamMessage = lib.smis_ConfigurationManager.checkParameters(configFile);
    if (validateParamMessage) {
        return validateParamMessage;
    }

    const failedMessage = funcs.scmsg("117", "smis");

    var getParameterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
    var config = {
        protocol: getParameterValue(configFile, "protocol"),
        grantType: getParameterValue(configFile, "grantType"),
        username: getParameterValue(configFile, "username"),
        password: getParameterValue(configFile, "password"),
        clientID: getParameterValue(configFile, "clientID"),
        tenantID: getParameterValue(configFile, "tenantID"),
        clientSecret: getParameterValue(configFile, "clientSecret"),
        sharedInbox: getParameterValue(configFile, "sharedInbox"),
        mailboxName: getParameterValue(configFile, "mailboxName"),
        proxyHost: getParameterValue(configFile, "proxyHost"),
        proxyPort: getParameterValue(configFile, "proxyPort"),
        proxyUsername: getParameterValue(configFile, "proxyUsername"),
        proxyPassword: getParameterValue(configFile, "proxyPassword")
    };

    // support EWS Graph API only
    if (!lib.SmartEmailUtil.isEWSGraph(config.protocol)) {
        return failedMessage;
    }

    var intId = configFile.intId;
    var module = lib.SmartEmailUtil.getSmartEmailTokenModule(intId);

    // retrieve new token
    var scope = lib.AzureAuthentication.API_ENDPOINT() + "/.default";

    var otoken;
    var grantType = config.grantType || lib.OAuthAuthentication.grantTypeROPC();

    // auth code grant type
    if (grantType == lib.OAuthAuthentication.grantTypeAuthCode()) {
        var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);
        // use refreshToken to request accessToken 
        if (ftoken) {
            otoken = lib.OAuthAuthentication.retrieveAccessTokenObject(module, grantType, config, scope, ftoken.refreshToken);
        }
        // need to get access token before test connection
        else {
            return failedMessage + "\n" + funcs.scmsg("69", "smis");
        }
    }
    // ROPC grant type
    else {
        otoken = lib.OAuthAuthentication.retrieveAccessTokenObject(module, grantType, config, scope);
    }

    if (otoken.error) {
        return failedMessage + "\n" + lib.AzureAuthentication.errorMessage(otoken.error);
    }

    lib.OAuthAuthentication.saveTokenRecord(module, otoken);

    // invoke Graph API /mailFolders to test
    lib.SmartEmailGraphAPI.setProxy(config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);

    var response;
    if (config.sharedInbox) {
        response = lib.SmartEmailGraphAPI.mailFolders(intId, config.mailboxName);
    } else {
        response = lib.SmartEmailGraphAPI.myMailFolders(intId);
    }
    lib.SmartEmailGraphAPI.setProxy(null);

    var respObj = lib.AzureAuthentication.parseResponse(response);

    // error occurred
    if (respObj.error) {
        return failedMessage + "\n" + lib.AzureAuthentication.errorMessage(respObj.error);
    }

    // connection successful
    var tokenStatus = lib.OAuthAuthentication.getTokenStatusByModule(module);
    lib.OAuthAuthentication.showTokenStatus(tokenStatus);

    return funcs.scmsg(116, "smis");
}


/**
 * Get Access Token status
 *
 * @returns {String}
 */
function getOAuthAccessTokenStatus(configFile) {
    var module = lib.SmartEmailUtil.getSmartEmailTokenModule(configFile.intId);
    return lib.OAuthAuthentication.getTokenStatusByModule(module);
}


/**
 * Get Auth Code and Token
 *
 * @returns {Boolean}
 */
function getOAuthAuthCodeAndToken(configFile) {
    var module = lib.SmartEmailUtil.getSmartEmailTokenModule(configFile.intId);
    var protocol = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue(configFile, "protocol");

    // Microsoft
    if (lib.SmartEmailUtil.isEWS(protocol) || lib.SmartEmailUtil.isEWSGraph(protocol)) {
        return lib.AzureAuthentication.getAuthCodeAndToken(configFile, module);
    }
    // Google
    else if (lib.SmartEmailUtil.isIMAPs(protocol)) {
        return lib.GoogleAuthentication.getAuthCodeAndToken(configFile, module);
    }

    getLog("SmartEmailEPAdapter").warn(`[${configFile.intId}] Unknown protocol: ${protocol}`);
    return false;
}