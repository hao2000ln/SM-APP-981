/******************************************************
 * Module Name: SMIS Microsoft Teams Adapter
 * Function: Adapter Interface
 * Author: Zhang Qi
 * Version: 1.10
 * Creation Date: Jan, 2021
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var MicrosoftTeamsAdapterClass = Class.create({
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
    return MicrosoftTeamsAdapterClass;
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
        grantType: getParameterValue(configFile, "grantType"),
        username: getParameterValue(configFile, "username"),
        password: getParameterValue(configFile, "password"),
        clientID: getParameterValue(configFile, "clientID"),
        tenantID: getParameterValue(configFile, "tenantID"),
        clientSecret: getParameterValue(configFile, "clientSecret"),
        botClientID: getParameterValue(configFile, "botClientID"),
        botClientSecret: getParameterValue(configFile, "botClientSecret"),
        proxyHost: getParameterValue(configFile, "proxyHost"),
        proxyPort: getParameterValue(configFile, "proxyPort"),
        proxyUsername: getParameterValue(configFile, "proxyUsername"),
        proxyPassword: getParameterValue(configFile, "proxyPassword")
    };

    // set logger level
    if (!lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
        var loggerLevel = configFile.loggerLevel || "INFO";
        lib.MicrosoftTeamsUtil.setLoggerLevel(loggerLevel);
    }

    var intId = configFile.intId;
    var module = lib.MicrosoftTeamsUtil.getTeamsTokenModule(intId);

    // retrieve new teams token
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

    // invoke Graph API /me to test
    lib.MicrosoftGraphAPI.setProxy(config.proxyHost, config.proxyPort, config.proxyUsername, config.proxyPassword);
    var response = lib.MicrosoftGraphAPI.me(intId);
    lib.MicrosoftGraphAPI.setProxy(null);

    var respObj = lib.MicrosoftTeamsUtil.parseResponse(response);

    // error occurred
    if (respObj.error) {
        return failedMessage + "\n" + lib.AzureAuthentication.errorMessage(respObj.error);
    }

    // check bot configuration
    if (config.botClientID) {
        module = lib.MicrosoftTeamsUtil.getBotTokenModule(intId);

        var botConfig = {
            clientID: config.botClientID,
            clientSecret: config.botClientSecret,
            tenantID: config.tenantID,
            proxyHost: config.proxyHost,
            proxyPort: config.proxyPort,
            proxyUsername: config.proxyUsername,
            proxyPassword: config.proxyPassword
        };

        // retrieve bot token
        scope = lib.MicrosoftTeamsConstants.BOT_ENDPOINT() + "/.default";
        otoken = lib.OAuthAuthentication.retrieveAccessTokenObject(module, lib.OAuthAuthentication.grantTypeClientCredentials(), botConfig, scope);
        if (otoken.error) {
            return "[Bot] " + failedMessage + "\n" + lib.AzureAuthentication.errorMessage(otoken.error);
        }

        lib.OAuthAuthentication.saveTokenRecord(module, otoken);
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
    var module = lib.MicrosoftTeamsUtil.getTeamsTokenModule(configFile.intId);
    return lib.OAuthAuthentication.getTokenStatusByModule(module);
}


/**
 * Get Auth Code and Token
 *
 * @returns {Boolean}
 */
function getOAuthAuthCodeAndToken(configFile) {
    var module = lib.MicrosoftTeamsUtil.getTeamsTokenModule(configFile.intId);
    return lib.AzureAuthentication.getAuthCodeAndToken(configFile, module);
}