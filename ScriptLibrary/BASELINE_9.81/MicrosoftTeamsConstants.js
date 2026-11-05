function API_MODULE() {
    return "teams";
}

function BOT_MODULE() {
    return "bot";
}

function BOT_ENDPOINT() {
    return "https://api.botframework.com";
}

function TEMPLATE_TEAMS() {
    return "MicrosoftTeams";
}

function NOTIFICATION_MODE_USER() {
    return "user";
}

function NOTIFICATION_MODE_BOT() {
    return "bot";
}

function ERROR_CODE_NOTFOUND() {
    return "NotFound";
}

function ERROR_CODE_FORBIDDEN() {
    return "Forbidden";
}

function EMPTY_CHANNELID() {
    return "EmptyChannelId";
}


/*
 * 6 actions for SMIS task:
 *      synchronize reply
 *      synchronize attachment
 *      synchronize attachment metadata
 *      synchronize hosted content
 *      send message
 *      refresh refreshToken (auth code grant type)
 */

function ACTION_SYNC_MESSAGE_REPLIES() {
    return "Teams Synchronize Replies";
}


function ACTION_SYNC_MESSAGE_ATTACHMENT() {
    return "Teams Synchronize Attachment";
}


function ACTION_SYNC_CHANNEL_ATTACHMENTS_METADATA() {
    return "Teams Synchronize Attachments Metadata";
}


function ACTION_SYNC_MESSAGE_HOSTEDCONTENT() {
    return "Teams Synchronize Hosted Content";
}


function ACTION_SEND_MESSAGE() {
    return "Teams Send Message";
}


function ACTION_REFRESH_REFRESHTOKEN() {
    return "Teams Refresh refreshToken";
}