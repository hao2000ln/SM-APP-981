var logger = getLog("SmartEmailGraphAPI");
//logger.setLevel("debug");


// proxy
var proxyHost;
var proxyPort;
var proxyUsername;
var proxyPassword;


/**
 * set proxy information
 *
 * @param {String} host
 * @param {Number} port
 * @param {String} username
 * @param {String} password
 */
function setProxy(host, port, username, password) {
    if (!host) {
        proxyHost = null;
        proxyPort = null;
        proxyUsername = null;
        proxyPassword = null;
    } else {
        proxyHost = host;
        proxyPort = port;
        proxyUsername = username;
        proxyPassword = password;
    }
}


/**
 * invoke MS Graph API
 *
 * @param   {String}    intId 
 * @param   {String}    method 
 * @param   {String}    resource 
 * @returns {String}
 */
function api(intId, method, resource) {
    // get access token
    var module = lib.SmartEmailUtil.getSmartEmailTokenModule(intId);
    var tokenObj = lib.AzureAuthentication.getAccessToken(module);

    // error occurred when retrieving access token
    if (tokenObj.error) {
        return JSON.stringify(tokenObj);
    }

    var token = tokenObj.accessToken;

    const msGraphEndPoint = lib.AzureAuthentication.API_ENDPOINT();
    var url = msGraphEndPoint + lib.MicrosoftGraphAPI.standardizeResource(resource);

    const DEFAULT_ACCEPT_TYPES = [
        "text/html",
        "text/plain",
        "application/json"
    ];
    var headers = [
        new Header("Content-type", "application/json"),
        new Header("Accept", DEFAULT_ACCEPT_TYPES.join(","))
    ];

    if (logger.isDebugEnabled()) {
        logger.debug(`api request integration id: ${intId}`);
        logger.debug(`api request method: ${method}`);
        logger.debug(`api request url: ${url}`);

        var headerInfo = '[';
        var i;
        for (i = 0; i < headers.length; i++) {
            if (i > 0) {
                headerInfo += ',';
            }
            headerInfo += '"' + headers[i].name + '":"' + headers[i].value + '"';
        }
        headerInfo += ']';
        logger.debug(`api request headers: ${headerInfo}`);
    }

    // add token last to avoid output in log
    headers.push(new Header("Authorization", "Bearer " + token));

    var respHeaders = {};

    // proxy
    if (!proxyHost) {
        proxyPort = null;
        proxyUsername = null;
        proxyPassword = null;
    }
    if (logger.isDebugEnabled()) {
        logger.debug(`proxy host: ${proxyHost}, port: ${proxyPort}, user name: ${proxyUsername}`);
    }

    var response;
    try {
        response = doHTTPRequest(method, url, headers, null, 0, 0, 0, respHeaders, false, null, true,
            proxyHost, proxyPort, proxyUsername, proxyPassword);
    } catch (e) {
        logger.error(e);
        response = JSON.stringify({
            error: {
                code: "ConnectionError",
                message: typeof e == "string" ? e : e.message
            }
        });
    }

    if (logger.isDebugEnabled()) {
        logger.debug("api response code: " + respHeaders.returnCode);
        logger.debug("api response headers: " + JSON.stringify(respHeaders));
        logger.debug(`api response body: ${response}`);
    }

    return response;
}


/**
 * get the mail folder collection directly under my root folder
 *
 * @see https://learn.microsoft.com/en-us/graph/api/user-list-mailfolders
 */
function myMailFolders(intId) {
    return api(intId, "GET", `/me/mailFolders`);
}


function mailFolders(intId, userId) {
    return api(intId, "GET", `/users/${userId}/mailFolders`);
}