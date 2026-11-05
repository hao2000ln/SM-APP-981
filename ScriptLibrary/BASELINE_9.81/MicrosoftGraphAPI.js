var logger = getLog("MicrosoftGraphAPI");

const DEFAULT_ACCEPT_TYPES = [
    "text/html",
    "text/plain",
    "application/json"
];

const msGraphEndPoint = lib.AzureAuthentication.API_ENDPOINT();

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
 * invoke MS Graph API
 *
 * @param   {String}    intId 
 * @param   {String}    method 
 * @param   {String}    resource 
 * @param   {Array}     headers 
 * @param   {String}    body 
 * @param   {Object}    respHeaders
 * @param   {Boolean}   binaryResponseData
 * @returns {String}
 */
function api(intId, method, resource, headers, body, respHeaders, binaryResponseData) {

    // get access token
    var module = lib.MicrosoftTeamsUtil.getTeamsTokenModule(intId);
    var tokenObj = lib.AzureAuthentication.getAccessToken(module);

    // error occurred when retrieving access token
    if (tokenObj.error) {
        return JSON.stringify(tokenObj);
    }

    var token = tokenObj.accessToken;

    var url = msGraphEndPoint + standardizeResource(resource);

    if (!headers) {
        headers = [
            new Header("Content-type", "application/json"),
            new Header("Accept", DEFAULT_ACCEPT_TYPES.join(","))
        ];
    }

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

        if (body) {
            logger.debug(`api request body: ${body}`);
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
        logger.debug("api response code: " + respHeaders.returnCode);
        logger.debug("api response headers: " + JSON.stringify(respHeaders));
        if (!binaryResponseData) {
            logger.debug(`api response body: ${response}`);
        }
    }

    return response;
}


/**
 * standardize resource, by adding version if not have
 *
 * @param {String} resource
 * @returns {String}
 */
function standardizeResource(resource) {
    if (!resource) {
        return resource;
    }

    if (resource.indexOf("/v1.0") == 0 || resource.indexOf("/beta") == 0) {
        return resource;
    }

    return "/v1.0" + resource;
}


/**
 * get resource by link directly
 *
 * @param {String} link
 * @param {Object} respHeaders
 * @param {Boolean} binaryResponseData
 */
function resourceLink(intId, link, respHeaders, binaryResponseData) {
    var resource = link;
    if (link.indexOf(msGraphEndPoint) == 0) {
        resource = link.substring(msGraphEndPoint.length);
    }

    return api(intId, "GET", resource, null, null, respHeaders, binaryResponseData);
}


/**
 * get current user information
 *
 * @see https://learn.microsoft.com/en-us/graph/api/user-get
 */
function me(intId, queryParams) {
    var resource = `/me`;
    if (queryParams) {
        resource += "?" + queryParams;
    }
    return api(intId, "GET", resource);
}


/**
 * retrieve the properties and relationships of user object
 *
 * @see https://learn.microsoft.com/en-us/graph/api/user-get
 */
function user(intId, userId, queryParams) {
    var resource = `/users/${userId}`;
    if (queryParams) {
        resource += "?" + queryParams;
    }
    return api(intId, "GET", resource);
}


/**
 * list joined teams
 *
 * @see https://learn.microsoft.com/en-us/graph/api/user-list-joinedteams
 */
function joinedTeams(intId) {
    return api(intId, "GET", `/me/joinedTeams`);
}


/**
 * list owned objects
 *
 * @see https://learn.microsoft.com/en-us/graph/api/user-list-ownedobjects
 */
function ownedObjects(intId, queryParams) {
    var resource = `/me/ownedObjects`;
    if (queryParams) {
        resource += "?" + queryParams;
    }
    return api(intId, "GET", resource);
}


/**
 * retrieve the properties and relationships of the specified team
 *
 * @see https://learn.microsoft.com/en-us/graph/api/team-get
 */
function team(intId, teamId) {
    return api(intId, "GET", `/teams/${teamId}`);
}


/**
 * retrieve the list of channels in the team
 *
 * @see https://learn.microsoft.com/en-us/graph/api/channel-list 
 */
function teamChannels(intId, teamId) {
    return api(intId, "GET", `/teams/${teamId}/channels`);
}


/**
 * retrieve the list of members from a channel
 *
 * @see https://learn.microsoft.com/en-us/graph/api/channel-list-members
 */
function channelMembers(intId, teamId, channelId) {
    return api(intId, "GET", `/teams/${teamId}/channels/${channelId}/members`);
}


/**
 * get the metadata for the location where the files of a channel are stored
 *
 * @see https://learn.microsoft.com/en-us/graph/api/channel-get-filesfolder
 */
function channelFilesFolder(intId, teamId, channelId) {
    return api(intId, "GET", `/teams/${teamId}/channels/${channelId}/filesFolder`);
}


/**
 * return a collection of DriveItems in the children relationship of a DriveItem
 *
 * @see https://learn.microsoft.com/en-us/graph/api/driveitem-list-children
 */
function driveItemChildren(intId, driveId, driveItemId, queryParams) {
    var resource = `/drives/${driveId}/items/${driveItemId}/children`;
    if (queryParams) {
        resource += "?" + queryParams;
    }

    return api(intId, "GET", resource);
}


/**
 * download the contents of a DriveItem
 *
 * @see https://learn.microsoft.com/en-us/graph/api/driveitem-get-content
 */
function driveItemContent(intId, mimeType, driveId, driveItemId) {

    var types = [];
    if (mimeType && types.indexOf(mimeType) == -1) {
        types = [mimeType];
    }

    types = types.concat(DEFAULT_ACCEPT_TYPES);

    var headers = [
        new Header("Content-type", "application/json"),
        new Header("Accept", types.join(","))
    ];
    return api(intId, "GET", `/drives/${driveId}/items/${driveItemId}/content`, headers, null, null, true);
}


/**
 * create a new chatMessage in the specified channel
 *
 * @see https://learn.microsoft.com/en-us/graph/api/chatmessage-post
 */
function postChannelMessage(intId, teamId, channelId, messageObj) {
    return api(intId, "POST", `/teams/${teamId}/channels/${channelId}/messages`, null, JSON.stringify(messageObj));
}


/**
 * list all the replies of a message in a channel of a team
 *
 * @see https://learn.microsoft.com/en-us/graph/api/chatmessage-list-replies
 */
function channelMessageReplies(intId, teamId, channelId, messageId) {
    return api(intId, "GET", `/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies`);
}


/**
 * create a new reply to a message in a specified channel
 *
 * @see https://learn.microsoft.com/en-us/graph/api/channel-post-messagereply 
 */
function replyMessage(intId, teamId, channelId, messageId, replyObj) {
    return api(intId, "POST", `/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies`, null, JSON.stringify(replyObj));
}


/**
 * create a new chat
 *
 * @see https://learn.microsoft.com/en-us/graph/api/chat-post 
 */
function createChat(intId, chatObj) {
    return api(intId, "POST", `/chats`, null, JSON.stringify(chatObj));
}


/**
 * create a new chatMessage in the specific chat
 *
 * @see https://learn.microsoft.com/en-us/graph/api/chat-post-messages
 */
function postChatMessage(intId, chatId, messageObj) {
    return api(intId, "POST", `/chats/${chatId}/messages`, null, JSON.stringify(messageObj));
}


/**
 * combine multiple requests in one HTTP call using JSON batching
 *
 * @see https://learn.microsoft.com/en-us/graph/json-batching
 */
function jsonBatch(intId, body) {
    return api(intId, "POST", "/v1.0/$batch", null, body);
}