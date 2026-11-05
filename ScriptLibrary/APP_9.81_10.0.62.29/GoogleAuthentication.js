var logger = getLog("GoogleAuthentication");
//logger.setLevel("debug");
var $ = lib.c.$;


function TOKEN_URL() {
    return "https://oauth2.googleapis.com/token";
}

function AUTH_URL() {
    return "https://accounts.google.com/o/oauth2/v2/auth";
}


/**
 * Get Auth Code and Token
 *
 * @param {SCFile} configFile
 * @param {String} module
 * @returns {Boolean}
 */
function getAuthCodeAndToken(configFile, module) {
    // append random number into state
    var _ = lib.Underscore.require();
    var randomInt = _.random(1000, 9999);
    var state = `${module}-${randomInt}`;

    var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
    var config = {
        clientID: getParmeterValue(configFile, "clientID"),
        clientSecret: getParmeterValue(configFile, "clientSecret"),
        username: getParmeterValue(configFile, "username"),
        proxyHost: getParmeterValue(configFile, "proxyHost"),
        proxyPort: getParmeterValue(configFile, "proxyPort"),
        proxyUsername: getParmeterValue(configFile, "proxyUsername"),
        proxyPassword: getParmeterValue(configFile, "proxyPassword")
    };

    // emailout user name
    if (lib.EmailOutUtil.isTokenModuleForEmailOut(module)) {
        config.username = getParmeterValue(configFile, "smtpUsername");
    }

    const host = TOKEN_URL();
    const scope = "https://mail.google.com";

    // save temporary state 
    lib.OAuthAuthentication.saveStateRecord(module, state, host, config);

    // open login page
    const authUrl = AUTH_URL();
    const params = {
        "access_type": "offline"
    };
    lib.OAuthAuthentication.launchLoginPageForAuthorizationCode(authUrl, state, config.clientID, scope, config.username, params);

    return true;
}


/**
 * get access token object
 *
 * @param {String} module
 * @param {Object} config
 * @returns {Object} access token object, the format is
 *          {
 *              accessToken,
 *              expirationTime,
 *              error: {
 *                  code,
 *                  message
 *              }
 *          }
 */
function getAccessToken(module, config) {

    var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);

    // return token if not expired
    if (ftoken && !lib.OAuthAuthentication.isAccessTokenExpired(ftoken.expirationTime)) {
        return {
            accessToken: ftoken.accessToken,
            expirationTime: ftoken.expirationTime
        };
    }

    // error for integration disabled
    const intDisabledError = {
        error: {
            code: "InternalError",
            message: funcs.scmsg("ConfigurationManager_8", "smis")
        }
    };

    // smartemail integration not start
    if (lib.SmartEmailUtil.isTokenModuleForSmartEmail(module) && !lib.SmartEmailUtil.isEnabled()) {
        logger.warn("The SmartEmail integration instance is disabled.");
        return intDisabledError;
    }
    // emailout integration not start
    else if (lib.EmailOutUtil.isTokenModuleForEmailOut(module) && !lib.EmailOutUtil.isEnabled()) {
        logger.warn("The EmailOut integration instance is disabled.");
        return intDisabledError;
    }

    // default grant type Auth Code
    const grantType = lib.OAuthAuthentication.grantTypeAuthCode();

    // default scope
    const scope = "https://mail.google.com";

    return lib.OAuthAuthentication.getAccessToken(module, grantType, config, scope);
}