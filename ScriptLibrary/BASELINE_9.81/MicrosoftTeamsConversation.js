var $ = lib.c.$;
var template = lib.MicrosoftTeamsConversationTemplate.generateConversationHTML;

/**
 * generate incident conversation html
 *
 * @param   {String} incidentId
 * @returns {String}
 */
function generateIncidentConversationHTML(incidentId) {
    var filters = getConversationFilters();
    return template("probsummary", incidentId, filters);
}


/**
 * generate interaction conversation html
 *
 * @param   {String} interactionId
 * @returns {String}
 */
function generateInteractionConversationHTML(interactionId) {
    var filters = getConversationFilters();
    return template("incidents", interactionId, filters);
}


/**
 * generate problem conversation html
 *
 * @param   {String} problemId
 * @returns {String}
 */
function generateProblemConversationHTML(problemId) {
    var filters = getConversationFilters();
    return template("rootcause", problemId, filters);
}


/**
 * generate change conversation html
 *
 * @param   {String} changeId
 * @returns {String}
 */
function generateChangeConversationHTML(changeId) {
    var filters = getConversationFilters();
    return template("cm3r", changeId, filters);
}


/**
 * generate request conversation html
 *
 * @param   {String} requestId
 * @returns {String}
 */
function generateRequestConversationHTML(requestId) {
    var filters = getConversationFilters();
    return template("request", requestId, filters);
}


/**
 * return conversation filters
 *
 * @returns {Array}
 */
function getConversationFilters() {
    var filterString = vars.$msteams_conversation_filter;
    if (!filterString) {
        return null;
    }

    return filterString.split(/(\s+)/).filter((e) => e.trim().length > 0);
}


/**
 * check whether show conversation action in toolbar
 *
 * @param   {SCFile}    record
 * @returns {Boolean}
 */
function isShowConversationAction(record) {
    if (!record) {
        return false;
    }

    // show conversation action if exists message even integration is disable
    // var message = lib.MicrosoftTeamsUtil.getMessageInfo(record, ["messageId"]);
    // if (message) {
    //     return true;
    // }    

    var fileName = funcs.filename(record);
    var fMapping = $("!msTeamsChannelMapping").fields("mapping").find("tablename=:tablename", fileName).one();
    if (!fMapping) {
        return false;
    }

    // if (!lib.MicrosoftTeamsConfiguration.isEnabled()) {
    //     return false;
    // }
    //
    // if (!lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
    //     return true;
    // }

    // get corresponding channel
    var channelId = lib.MicrosoftTeamsChannel.getChannelMeetCondition(fMapping);
    if (!channelId) {
        return false;
    }

    var channel = $("!msTeamsChannelInfo").fields("teamId").find("channelId=:id", channelId).one();
    if (!channel) {
        return false;
    }

    // check integration instance
    var intId = lib.MicrosoftTeamsUtil.getIntIdByTeamId(channel.teamId);
    return lib.MicrosoftTeamsConfiguration.isEnabled(intId);
}


/**
 * check whether show conversation history in UI
 *
 * @param   {SCFile}    record
 * @returns {Boolean}
 */
function isShowConversationHistory(record) {
    if (!record) {
        return false;
    }

    // show conversation history if exists reply even integration is disable
    var fileName = funcs.filename(record);
    var key = record.getUniqueFields()[0];
    var fileId = record[key];
    var query = `fileName="${fileName}" and fileId="${fileId}"`;

    var reply = $("!msTeamsReplyInfo").fields("replyId").find(query).one();
    return (reply != null);
}