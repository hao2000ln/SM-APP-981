/******************************************************
 * Module Name: Microsoft Bot REST API
 * Function: API
 * Author: Zhang, Qi
 * Version: 1.00
 * Creation Date: Jan, 2022
 *******************************************************/
var logger = getLog("MicrosoftBotRestAPI");

const DEFAULT_ACCEPT_TYPES = [
    "text/html",
    "text/plain",
    "application/json"
];

// proxy
var proxyHost;
var proxyPort;
var proxyUsername;
var proxyPassword;


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
}


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
 * invoke MS Bot REST API
 *
 * @param   {String}    intId 
 * @param   {String}    method 
 * @param   {String}    serviceUrl 
 * @param   {String}    resource 
 * @param   {Array}     headers 
 * @param   {String}    body 
 * @param   {Object}    respHeaders
 * @returns {String}
 *
 * @see https://learn.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-overview
 */
function api(intId, method, serviceUrl, resource, headers, body, respHeaders) {

    // get access token
    var module = lib.MicrosoftTeamsUtil.getBotTokenModule(intId);
    var scope = lib.MicrosoftTeamsConstants.BOT_ENDPOINT() + "/.default";
    var grantType = lib.OAuthAuthentication.grantTypeClientCredentials();
    var tokenObj = lib.AzureAuthentication.getAccessToken(module, grantType, null, scope);

    // error occurred when retrieving access token
    if (tokenObj.error) {
        return JSON.stringify(tokenObj);
    }

    var token = tokenObj.accessToken;

    var url = serviceUrl + resource;

    if (!headers) {
        headers = [
            new Header("Content-type", "application/json"),
            new Header("Accept", DEFAULT_ACCEPT_TYPES.join(","))
        ];
    }

    if (logger.isDebugEnabled()) {
        logger.debug(`bot rest api request integration id: ${intId}`);
        logger.debug(`bot rest api request method: ${method}`);
        logger.debug(`bot rest api request url: ${url}`);

        var headerInfo = '[';
        var i;
        for (i = 0; i < headers.length; i++) {
            if (i > 0) {
                headerInfo += ',';
            }
            headerInfo += '"' + headers[i].name + '":"' + headers[i].value + '"';
        }
        headerInfo += ']';
        logger.debug(`bot rest api request headers: ${headerInfo}`);

        if (body) {
            logger.debug(`bot rest api request body: ${body}`);
        }
    }

    // add token last to avoid output in log
    headers.push(new Header("Authorization", "Bearer " + token));

    if (!respHeaders) {
        respHeaders = {};
    }

    // proxy
    if (!proxyHost) {
        proxyHost = lib.MicrosoftTeamsConfiguration.getProxyHost(intId);

        if (proxyHost) {
            proxyPort = lib.MicrosoftTeamsConfiguration.getProxyPort(intId);
            proxyUsername = lib.MicrosoftTeamsConfiguration.getProxyUsername(intId);
            proxyPassword = lib.MicrosoftTeamsConfiguration.getProxyPassword(intId);
        }
    }
    if (!proxyHost) {
        proxyPort = null;
        proxyUsername = null;
        proxyPassword = null;
    }
    if (logger.isDebugEnabled()) {
        logger.debug(`proxy host: ${proxyHost}, port: ${proxyPort}, user name: ${proxyUsername}`);
    }

    var binaryResponseData = false;

    var response;
    try {
        response = doHTTPRequest(method, url, headers, body, 0, 0, 0, respHeaders, false, binaryResponseData, true,
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
        logger.debug("bot rest api response code: " + respHeaders.returnCode);
        logger.debug("bot rest api response headers: " + JSON.stringify(respHeaders));
        if (!binaryResponseData) {
            logger.debug(`api response body: ${response}`);
        }
    }

    return response;
}


/**
 * sends an activity (message) to the specified conversation
 *
 * @param {String} intId
 * @param {String} conversationId
 * @param {Object} activityObj
 * @returns {String}
 *
 * @see https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-api-reference#send-to-conversation
 */
function sendConversationActivity(intId, serviceUrl, conversationId, activityObj) {
    var resource = `/v3/conversations/${conversationId}/activities`;
    return api(intId, "POST", serviceUrl, resource, null, JSON.stringify(activityObj));
}


/**
 * start a conversation with a user
 *
 * @param {String} intId
 * @param {String} serviceUrl
 * @param {Object} conversationObj
 * @returns {String}
 *
 * @see https://learn.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-send-and-receive-messages#start-a-conversation
 */
function startConversation(intId, serviceUrl, conversationObj) {
    var resource = `/v3/conversations`;
    return api(intId, "POST", serviceUrl, resource, null, JSON.stringify(conversationObj));
}