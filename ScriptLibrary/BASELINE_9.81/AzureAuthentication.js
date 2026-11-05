var logger = getLog("AzureAuthentication");
//logger.setLevel("debug");
var $ = lib.c.$;


function API_ENDPOINT() {
    return "https://graph.microsoft.com";
}

function TOKEN_URL(tenantID) {
    return `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;
}

function AUTH_URL(tenantID) {
    return `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/authorize`;
}

// this token url is for multi tenants bot which is unnecessary now
//function BOT_TOKEN_URL() {
//    return "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";
//}


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
        tenantID: getParmeterValue(configFile, "tenantID"),
        clientSecret: getParmeterValue(configFile, "clientSecret"),
        username: getParmeterValue(configFile, "username"),
        proxyHost: getParmeterValue(configFile, "proxyHost"),
        proxyPort: getParmeterValue(configFile, "proxyPort"),
        proxyUsername: getParmeterValue(configFile, "proxyUsername"),
        proxyPassword: getParmeterValue(configFile, "proxyPassword")
    };

    const host = TOKEN_URL(config.tenantID);
    const scope = API_ENDPOINT() + "/.default";
    const params = {
        "scope": `${scope} offline_access`
    };

    // save temporary state 
    lib.OAuthAuthentication.saveStateRecord(module, state, host, config, params);

    /*
     * open login page
     * @see https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
     * don't use form_post mode, since it will cause Chrome browser cookie JSESSIONID "SameSite" issue
     */
    const authUrl = AUTH_URL(config.tenantID);
    lib.OAuthAuthentication.launchLoginPageForAuthorizationCode(authUrl, state, config.clientID, scope, config.username);

    return true;
}


/**
 * get access token object
 *
 * @param {String} module
 * @param {String} grantType
 * @param {Object} config
 * @param {String} scope
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
function getAccessToken(module, grantType, config, scope) {

    var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);

    // return token if not expired
    if (ftoken && !lib.OAuthAuthentication.isAccessTokenExpired(ftoken.expirationTime)) {
        return {
            accessToken: ftoken.accessToken,
            expirationTime: ftoken.expirationTime
        };
    }

    var intId = lib.MicrosoftTeamsUtil.getIntIdInTokenModule(module);

    // teams integration not start
    if (lib.MicrosoftTeamsUtil.isTokenModuleForTeams(module)) {
        if (!intId || !lib.MicrosoftTeamsConfiguration.isEnabled(intId)) {
            logger.warn(`[${intId}]`, `The Microsoft Teams integration instance is disabled.`);
            return {
                error: {
                    code: "InternalError",
                    message: funcs.scmsg("ConfigurationManager_8", "smis")
                }
            };
        }
    }

    if (!config) {
        var configuration = lib.MicrosoftTeamsConfiguration;

        // teams graph api
        if (lib.MicrosoftTeamsUtil.isTokenModuleForTeams(module)) {
            config = {
                grantType: configuration.getGrantType(intId),
                username: configuration.getUsername(intId),
                password: configuration.getPassword(intId),
                clientID: configuration.getClientID(intId),
                tenantID: configuration.getTenantID(intId),
                clientSecret: configuration.getClientSecret(intId),
                proxyHost: configuration.getProxyHost(intId),
                proxyPort: configuration.getProxyPort(intId),
                proxyUsername: configuration.getProxyUsername(intId),
                proxyPassword: configuration.getProxyPassword(intId)
            };
        }
        // bot restful api
        else if (lib.MicrosoftTeamsUtil.isTokenModuleForBot(module)) {
            config = {
                clientID: configuration.getBotClientID(intId),
                clientSecret: configuration.getBotClientSecret(intId),
                tenantID: configuration.getTenantID(intId),
                proxyHost: configuration.getProxyHost(intId),
                proxyPort: configuration.getProxyPort(intId),
                proxyUsername: configuration.getProxyUsername(intId),
                proxyPassword: configuration.getProxyPassword(intId)
            };
        }
        // other, e.g. email
        else {
            config = {};
        }
    }

    // default grant type ROPC for Graph API
    grantType = grantType || config.grantType || lib.OAuthAuthentication.grantTypeROPC();

    // default scope is https://graph.microsoft.com/.default
    scope = scope || API_ENDPOINT() + "/.default";

    return lib.OAuthAuthentication.getAccessToken(module, grantType, config, scope);
}


/**
 * refresh the refresh token
 *
 * @param {SCFile} configFile
 * @param {String} module
 * @returns {Object} the format is
 *          {
 *              error
 *          }
 */
function refreshRefreshToken(configFile, module) {
    var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);
    if (!ftoken || !ftoken.refreshToken) {
        return {
            "error": funcs.scmsg("70", "smis")
        };
    }

    var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
    var config = {
        clientID: getParmeterValue(configFile, "clientID"),
        tenantID: getParmeterValue(configFile, "tenantID"),
        clientSecret: getParmeterValue(configFile, "clientSecret"),
        proxyHost: getParmeterValue(configFile, "proxyHost"),
        proxyPort: getParmeterValue(configFile, "proxyPort"),
        proxyUsername: getParmeterValue(configFile, "proxyUsername"),
        proxyPassword: getParmeterValue(configFile, "proxyPassword")
    };

    var scope = API_ENDPOINT() + "/.default offline_access";

    var otoken = lib.OAuthAuthentication.retrieveAccessTokenObject(module, lib.OAuthAuthentication.grantTypeAuthCode(), config, scope, ftoken.refreshToken);

    // return error object if error occurred
    if (otoken.error) {
        return otoken;
    }

    // save oauthToken record
    lib.OAuthAuthentication.saveTokenRecord(module, otoken);
    return {};
}


/**
 * return plain text error message
 *
 * @param {Object} error {code, message}
 * @returns {String}
 */
function errorMessage(error) {
    return lib.OAuthAuthentication.errorMessage(error);
}


/**
 * parse Graph API response
 *
 * @param {String} response
 * @returns {Object} standard API response format
 */
function parseResponse(response) {
    var respObj = {};
    try {
        respObj = JSON.parse(response);
    } catch (e) {
        respObj = {
            error: {
                code: "UnknownError",
                message: response
            }
        };
    }

    return respObj;
}