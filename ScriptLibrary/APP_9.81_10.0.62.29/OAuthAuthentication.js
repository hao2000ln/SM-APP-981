var logger = getLog("OAuthAuthentication");
//logger.setLevel("trace");
var $ = lib.c.$;


// OAuth2.0 grant type
// @see https://datatracker.ietf.org/doc/html/rfc6749

function grantTypeAuthCode() {
    return "authorization_code";
}

function grantTypeROPC() {
    return "password";
}

function grantTypeClientCredentials() {
    return "client_credentials";
}

function grantTypeRefreshToken() {
    return "refresh_token";
}


/**
 * launch login page to request authorization code
 *
 * @param {String} authUrl
 * @param {String} state
 * @param {String} clientID
 * @param {String} scope
 * @param {String} username
 * @param {Object} params
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6749
 */
function launchLoginPageForAuthorizationCode(authUrl, state, clientID, scope, username, params) {
    var redirectUri = getDefaultRedirectURI();

    var url = `${authUrl}?` +
        `client_id=` + encodeURIComponent(clientID) +
        `&response_type=code` +
        `&prompt=consent` +
        `&redirect_uri=` + encodeURIComponent(redirectUri) +
        `&scope=` + encodeURIComponent(scope) +
        `&state=` + encodeURIComponent(state);

    // login hint
    if (username) {
        url += `&login_hint=` + encodeURIComponent(username);
    }

    // append additional parameters
    if (params) {
        Object.keys(params).forEach(function(name) {
            var value = params[name];
            if (logger.isDebugEnabled()) {
                logger.debug(`${name}: ${value}`);
            }
            url += `&${name}=` + encodeURIComponent(value);
        });
    }

    if (logger.isDebugEnabled()) {
        logger.debug(url);
    }

    // open login page
    $.callrad("us.launch.external", { "name": url }, true);
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

    var ftoken = getOAuthTokenByModule(module);

    // return token if not expired
    if (ftoken && !isAccessTokenExpired(ftoken.expirationTime)) {
        return {
            accessToken: ftoken.accessToken,
            expirationTime: ftoken.expirationTime
        };
    }

    var isGrantTypeAuthCode = (grantType == grantTypeAuthCode());

    // in auth code grant mode, use refreshToken to refresh accessToken, the token record MUST exists
    if (!ftoken && isGrantTypeAuthCode) {
        var errorMsg = funcs.scmsg("70", "smis");
        logger.warn(errorMsg);
        return errorResult("InternalError", errorMsg);
    }

    // retrieve token
    var otoken;
    if (isGrantTypeAuthCode) {
        // use refreshToken to request accessToken
        otoken = retrieveAccessTokenObject(module, grantType, config, scope, ftoken.refreshToken);
    } else {
        otoken = retrieveAccessTokenObject(module, grantType, config, scope);
    }

    // return error object if error occurred
    if (otoken.error) {
        return otoken;
    }

    // save oauthToken record
    ftoken = saveTokenRecord(module, otoken);

    return {
        accessToken: ftoken.accessToken,
        expirationTime: ftoken.expirationTime
    };
}


/**
 * get oauthToken record by module
 *
 * @param {String} module
 * @returns {SCFile}
 */
function getOAuthTokenByModule(module) {
    return $("oauthToken").find("module=:module", module).one();
}


/**
 * get oauthState record by module
 *
 * @param {String} module
 * @returns {SCFile}
 */
function getOAuthStateByModule(module) {
    return $("oauthState").find("module=:module", module).one();
}


/**
 * get token status by module
 *
 * @param {String} module
 * @returns {SCFile}
 */
function getTokenStatusByModule(module) {
    var ftoken = getOAuthTokenByModule(module);
    if (isTokenAvailable(ftoken)) {
        return funcs.scmsg("tokenStatus;available", "smis");
    } else {
        return funcs.scmsg("tokenStatus;unavailable", "smis");
    }
}


/**
 * check whether token is available
 *
 * @param {SCFile} ftoken
 * @returns {Boolean}
 */
function isTokenAvailable(ftoken) {
    return !!(ftoken && ftoken.accessToken && ftoken.refreshToken);
}


/**
 * check whether time is expired for access token
 *
 * @param {Date} time
 * @returns {Boolean}
 */
function isAccessTokenExpired(time) {
    if (!time) {
        return false;
    }

    // to make it safe, treat it as expired if expire in 10 minutes
    var minutes = (time - new Date()) / 60000;
    return minutes < 10;
}


/**
 * check whether need to refresh the refresh token
 *
 * @param {Date} lastRefreshTime
 * @returns {Boolean}
 */
function needRefreshRefreshToken(lastRefreshTime) {
    if (!lastRefreshTime) {
        return true;
    }

    // to make it safe, refresh if over 24 hours
    var hours = (new Date() - lastRefreshTime) / (60 * 60 * 1000);
    return hours > 24;
}


/**
 * retrieve access token object
 * 
 * @param   {String} module
 * @param   {String} grantType 
 *              Authorization Code:
 *                     https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
 *              Resource Owner Password Credentials (ROPC):
 *                     https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth-ropc
 *              Client Credentials for daemon app mode:
 *                     https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow
 *                     https://learn.microsoft.com/en-us/entra/identity-platform/scenario-daemon-app-registration
 * @param   {Object} config
 *              connection parameters
 * @param   {String} scope
 *              resources to consent
 * @param   {String} refreshToken
 *              refresh token, support auth code grant type
 *
 * @returns {Object} access token object, the format is
 *          {
 *              accessToken,
 *              expiresIn,
 *              refreshToken,
 *              error: {
 *                  code,
 *                  message
 *              }
 *          }
 */
function retrieveAccessTokenObject(module, grantType, config, scope, refreshToken) {
    logger.info(`Retrieving access token for module "${module}".`);

    // connection parameters
    var username = config.username;
    var password = config.password;
    var clientID = config.clientID;
    var tenantID = config.tenantID;
    var clientSecret = config.clientSecret;

    // proxy
    var proxyHost = config.proxyHost;
    var proxyPort = config.proxyPort == null ? null : +config.proxyPort;
    var proxyUsername = config.proxyUsername;
    var proxyPassword = config.proxyPassword;

    var headers = getHTTPHeader();

    if (logger.isDebugEnabled()) {
        logger.debug(`scope: ${scope}`);
    }

    var body =
        `client_id=${clientID}` +
        `&scope=` + encodeURIComponent(scope) +
        `&client_secret=${clientSecret}`;

    // ROPC
    if (grantType == grantTypeROPC()) {
        body += `&username=${username}&password=${password}` +
            `&grant_type=${grantType}`;
    }
    // client credentials
    else if (grantType == grantTypeClientCredentials()) {
        body += `&grant_type=${grantType}`;
    }
    // auth code
    else if (grantType == grantTypeAuthCode()) {
        // use refresh token grant type
        if (refreshToken) {
            body += `&refresh_token=${refreshToken}` +
                `&grant_type=` + grantTypeRefreshToken();
        } else {
            logger.error(`Refresh token is required to request access token!`);
        }
    }
    // unsupported type
    else {
        logger.error(`The authorization grant type "${grantType}" is unsupported!`);
    }

    if (logger.isTraceEnabled()) {
        logger.trace(`body: ${body}`);
    }

    var tokenUrl = config.authTokenUrl || lib.AzureAuthentication.TOKEN_URL(tenantID);
    if (logger.isDebugEnabled()) {
        logger.debug(`url: ${tokenUrl}`);
    }

    var response;
    try {
        response = doHTTPRequest("POST", tokenUrl, headers, body, 0, 0, 0, null, false, false, true,
            proxyHost, proxyPort, proxyUsername, proxyPassword);
    } catch (e) {
        logger.error(e);
        return errorResult("ConnectionError", (typeof e == "string" ? e : e.message));
    }

    var respObj = {};
    try {
        respObj = JSON.parse(response);
    } catch (e) {
        logger.error(e);
        return errorResult("UnknownError", response);
    }

    var token = {};

    var error = respObj.error;
    if (error) {
        token.error = convertErrorResponse(respObj);
        logger.error(response);
    } else {
        if (logger.isTraceEnabled()) {
            logger.trace(`response: ${response}`);
        }
        token.accessToken = respObj.access_token;
        token.expiresIn = respObj.expires_in;
        token.refreshToken = respObj.refresh_token;
    }

    return token;
}


/**
 * request access token by authorization code.
 *      https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
 *      https://developers.google.com/identity/protocols/oauth2/web-server
 *
 * @param {String} state
 * @param {String} authCode
 * @returns {Object} result format:
 *          {
 *              message,
 *              status,
 *              error: {
 *                  code,
 *                  message
 *              }
 *          }
 */
function requestAccessTokenByAuthCode(state, authCode) {
    if (logger.isTraceEnabled()) {
        logger.trace(`authorization code: ${authCode}`);
    }

    const codeNotFound = "NotFound";

    // state should not empty
    if (!state) {
        return errorResult(codeNotFound, funcs.scmsg("1", "ruleset", ["state"]));
    }

    // authorization code should not empty
    if (!authCode) {
        return errorResult(codeNotFound, funcs.scmsg("1", "ruleset", ["authorization code"]));
    }

    // state should be valid
    var fstate = $("oauthState").find("state=:state", state).one();
    if (!fstate) {
        return errorResult(codeNotFound, funcs.scmsg("2", "ruleset", ["state"]));
    }

    // WebServer URL should set
    var redirectUri = getDefaultRedirectURI();
    if (!redirectUri) {
        return errorResult(codeNotFound, funcs.scmsg("71", "smis"));
    }

    // proxy
    var proxyHost = fstate.proxyHost;
    var proxyPort = fstate.proxyPort == null ? null : +fstate.proxyPort;
    var proxyUsername = fstate.proxyUsername;
    var proxyPassword = fstate.proxyPassword;

    var headers = getHTTPHeader();

    var body =
        `client_id=${fstate.clientID}` +
        `&client_secret=${fstate.clientSecret}` +
        `&code=${authCode}` +
        `&grant_type=` + grantTypeAuthCode() +
        `&redirect_uri=` + encodeURIComponent(redirectUri);

    // append additional parameters
    var params = fstate.params;
    var i;
    var length = params.length();
    for (i = 0; i < length; i++) {
        var param = params[i];
        var name = param.name;
        var value = param.value;

        if (name) {
            if (logger.isDebugEnabled()) {
                logger.debug(`${name}: ${value}`);
            }
            body += `&${name}=` + encodeURIComponent(value);
        }
    }

    if (logger.isTraceEnabled()) {
        logger.trace(`body: ${body}`);
    }

    var tokenUrl = fstate.host;
    if (logger.isDebugEnabled()) {
        logger.debug(`host: ${tokenUrl}`);
    }

    var module = fstate.module;

    // delete temporary fstate record
    fstate.doDelete();

    var response;
    try {
        response = doHTTPRequest("POST", tokenUrl, headers, body, 0, 0, 0, null, false, false, true,
            proxyHost, proxyPort, proxyUsername, proxyPassword);
    } catch (e) {
        logger.error(e);
        return errorResult("ConnectionError", (typeof e == "string" ? e : e.message));
    }

    var respObj = {};
    try {
        respObj = JSON.parse(response);
    } catch (e) {
        logger.error(e);
        return errorResult("UnknownError", response);
    }

    var error = respObj.error;
    if (error) {
        logger.error(response);

        return {
            "error": convertErrorResponse(respObj)
        };
    }

    if (logger.isTraceEnabled()) {
        logger.trace(`response: ${response}`);
    }

    var otoken = {
        "accessToken": respObj.access_token,
        "expiresIn": respObj.expires_in,
        "refreshToken": respObj.refresh_token
    };

    // save token
    var ftoken = saveTokenRecord(module, otoken);

    // get access token successfully
    if (ftoken) {
        return {
            "message": funcs.scmsg("72", "smis"),
            "status": funcs.scmsg("tokenStatus;available", "smis")
        };
    } else {
        var rc = getLastRC();
        return errorResult(String(rc), RCtoString(rc));
    }
}


/**
 * get default HTTP request header
 *
 * @returns {Array}
 */
function getHTTPHeader() {
    return [
        new Header("Accept", "text/html, application/json"),
        new Header("Content-Type", "application/x-www-form-urlencoded")
    ];
}


function errorResult(code, message) {
    return {
        "error": {
            "code": code,
            "message": message
        }
    };
}


/**
 * save token record
 *
 * @returns {SCFile}
 */
function saveTokenRecord(module, otoken) {
    var ftoken = getOAuthTokenByModule(module);

    var expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + otoken.expiresIn);

    // create
    if (!ftoken) {
        ftoken = new SCFile("oauthToken");
        ftoken.module = module;
        ftoken.accessToken = otoken.accessToken;
        ftoken.expirationTime = expirationTime;
        ftoken.refreshToken = otoken.refreshToken;
        if (otoken.refreshToken) {
            ftoken.lastRefreshTime = new Date();
        }

        ftoken.doInsert();
    }
    // update
    else {
        ftoken.accessToken = otoken.accessToken;
        ftoken.expirationTime = expirationTime;

        // update last refresh time if refreshToken update
        if (otoken.refreshToken && otoken.refreshToken != ftoken.refreshToken) {
            ftoken.refreshToken = otoken.refreshToken;
            ftoken.lastRefreshTime = new Date();
        }

        ftoken.doUpdate();
    }

    return ftoken;
}


/**
 * save state record
 *
 * @param {String} module
 * @param {String} state
 * @param {String} host
 * @param {Object} config
 *              connection parameters
 * @param {Object} params
 * @returns {Number}
 */
function saveStateRecord(module, state, host, config, params) {
    var fstate = getOAuthStateByModule(module);

    // create
    if (!fstate) {
        fstate = new SCFile("oauthState");
        fstate.module = module;
    }

    fstate.state = state;
    fstate.host = host;
    fstate.clientID = config.clientID;
    fstate.clientSecret = config.clientSecret;
    fstate.proxyHost = config.proxyHost;
    fstate.proxyPort = config.proxyPort;
    fstate.proxyUsername = config.proxyUsername;
    fstate.proxyPassword = config.proxyPassword;

    // params
    fstate.params = $.createSCArray();
    if (params) {
        Object.keys(params).forEach(function(name) {
            var param = $.createSCStructure(name, params[name]);
            fstate.params.push(param);
        });
    }

    return fstate.doSave();
}


/**
 * convert token error response into normal Graph API error format
 *
 * @param {Object} respObj
 * @returns {Object}
 */
function convertErrorResponse(respObj) {

    if (typeof respObj.error == "string") {

        /*
         * token error format:
         * {
         *     error (String), 
         *     error_description (String), 
         *     error_codes (Array), 
         *     error_uri (String)
         *  }
         *
         * Graph API error format:
         * {
         *     code (String),
         *     message (String)
         * }
         */
        var errorObj = {};
        errorObj.code = respObj.error_codes ? String(respObj.error_codes) + " " + respObj.error : respObj.error;
        errorObj.message = respObj.error_description || respObj.error;
        if (respObj.error_uri) {
            errorObj.message += "\r\n" + respObj.error_uri;
        }

        return errorObj;
    } else {
        return respObj.error;
    }
}


/**
 * return plain text error message
 *
 * @param {Object} error {code, message}
 * @returns {String}
 */
function errorMessage(error) {
    if (!error) {
        return "";
    }

    if (typeof error == "string") {
        return error;
    }

    var msg = "";
    if (error.code) {
        msg = error.code;
    }
    if (error.message) {
        msg += ": " + error.message;
    }

    return msg;
}


/**
 * get default redirect URI based on webtier url
 */
function getDefaultRedirectURI() {
    var webserverUrl = vars.$G_system_info.webserver_url;
    if (!webserverUrl) {
        return "";
    }

    // remove "index.do"
    if (webserverUrl.endsWith("/index.do")) {
        webserverUrl = webserverUrl.substring(0, webserverUrl.length - 8);
    }

    // append "/"
    if (!webserverUrl.endsWith('/')) {
        webserverUrl += '/';
    }

    // append callback path
    webserverUrl += "oauth/callback";

    return webserverUrl;
}


/**
 * clear OAuth data
 */
function clearOAuthData(module) {
    logger.info(`clear OAuth data of "${module}".`);

    var fstate = getOAuthStateByModule(module);
    if (fstate) {
        fstate.doDelete();
    }

    var ftoken = getOAuthTokenByModule(module);
    if (ftoken) {
        ftoken.doDelete();
    }
}


/**
 * show token status
 *
 * @param {String} status
 */
function showTokenStatus(status) {
    /*
     * $oauth.token.status is the status variable defined in SMIS param format.
     * It is checked in webtier oauthCallback.js too
     */
    vars.$oauth_token_status = status;
}