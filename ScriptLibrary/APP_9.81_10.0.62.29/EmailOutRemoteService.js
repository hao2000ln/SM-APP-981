/*
 * This Script is for EmailOut remote JS, called by server directly
 */

var logger = getLog("EmailOutRemoteService");
//logger.setLevel("debug");

var $ = lib.c.$;

/**
 * get SMIS configuration of EmailOut integration
 *
 * @returns {String} configuration in JSON format
 */
function getConfiguration() {
    // smis configuration item
    const template = lib.EmailOutUtil.TEMPLATE_EMAILOUT();

    var configItem = $("SMISConfiguration").find("template=:template", template).one();

    if (!configItem) {
        return "";
    }

    logger.info("Get integration configuration.");

    // refresh config status
    lib.smis_ConfigurationManager.refreshIntegrationInstance(configItem);

    configItem = $("!SMISConfiguration").fields(["intId", "status", "paramInfo", "loggerLevel"]).find("template=:template", template).one();

    if (logger.isDebugEnabled()) {
        logger.debug(lib.debugUtils.display(configItem));
    }

    var getParameterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

    var configObj = {
        "status": configItem.status,
        "smtphost": getParameterValue(configItem, "smtpHost"),
        "smtpport": getParameterValue(configItem, "smtpPort"),
        "smtpusername": getParameterValue(configItem, "smtpUsername"),
        "smtppassword": getParameterValue(configItem, "smtpPassword"),
        "smtpTLS": getParameterValue(configItem, "smtpTLS"),
        "smtpEnableSSL": getParameterValue(configItem, "smtpEnableSSL"),
        "smtpSSLPort": getParameterValue(configItem, "smtpSSLPort"),
        "mailFrom": getParameterValue(configItem, "mailFrom"),
        "mailBCC": getParameterValue(configItem, "mailBCC"),
        "enableOAuth": getParameterValue(configItem, "enableOAuth"),
        "keepmail": getParameterValue(configItem, "keepmail"),
        "sleep": getParameterValue(configItem, "sleep"),
        "debug": configItem.loggerLevel == "DEBUG",
        "clean": getParameterValue(configItem, "clean"),
        "mailThreadCount": getParameterValue(configItem, "mailThreadCount"),
        "SMIMEKeyAlias": getParameterValue(configItem, "smimeKeyAlias"),
        "SMIMEKeystore": getParameterValue(configItem, "smimeKeystore"),
        "SMIMEKeystorePass": getParameterValue(configItem, "smimeKeystorePass")
    };

    return JSON.stringify(configObj);
}


/**
 * get access token for EmailOut integration
 *
 * @returns {String}
 */
function getAccessToken() {
    logger.info("Get access token.");

    // smis configuration item
    var configItem = lib.EmailOutUtil.getConfigurationItem();

    if (!configItem) {
        return null;
    }

    var intId = configItem.intId;
    const module = lib.EmailOutUtil.getEmailOutTokenModule(intId);

    var getParameterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

    var configObj = {
        "clientID": getParameterValue(configItem, "clientID"),
        "clientSecret": getParameterValue(configItem, "clientSecret"),
        "proxyHost": getParameterValue(configItem, "proxyHost"),
        "proxyPort": getParameterValue(configItem, "proxyPort"),
        "proxyUsername": getParameterValue(configItem, "proxyUsername"),
        "proxyPassword": getParameterValue(configItem, "proxyPassword"),
        "authTokenUrl": lib.GoogleAuthentication.TOKEN_URL()
    };

    // oauth token object
    var token = lib.GoogleAuthentication.getAccessToken(module, configObj);

    if (token) {
        return token.accessToken;
    }

    if (token.error) {
        logger.error(lib.OAuthAuthentication.errorMessage(token.error));
    }

    return null;
}