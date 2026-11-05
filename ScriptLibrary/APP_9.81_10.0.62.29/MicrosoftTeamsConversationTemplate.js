var $ = lib.c.$;
var _ = lib.Underscore.require();
var logger = getLog("MicrosoftTeamsConversationTemplate");


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
}


/**
 * Generate conversation html
 *
 * @param   {String} fileName
 * @param   {String} fileId
 * @param   {String} filters
 * @returns {String}
 */
function generateConversationHTML(fileName, fileId, filters) {

    if (logger.isDebugEnabled()) {
        logger.debug(`conversation filter is: ${filters}`);
    }

    var css = getConversationCSS();
    var table = getConversationTable(fileName, fileId, filters);

    return css + table;
}


/**
 * Get conversation html css
 *
 * @returns {String}
 */
function getConversationCSS() {
        // OCTCR19XW2507003 | !important is used to ensure the current styles override conflicting external styles within the iframe.

        var style =
        "<style>" +
        "img.attachment {vertical-align:middle !important;}" +
        ".attachmentLink:link {text-decoration:none !important;}" +
        ".attachmentLink:visited {text-decoration:none !important;}" +
        ".attachmentLink:hover {text-decoration:underline !important; color:RoyalBlue !important;}" +
        ".attachmentLink:active {text-decoration:underline !important;}" +
        ".messagesTable {width:100% !important; padding-left:15px !important; padding-right:15px !important;}" +
        ".messagesTable td {padding:8px !important;}" +
        ".messageRowTable {width:100% !important; background-color:#FAF9F8 !important; padding-left:5px !important;}" +
        ".dateSeparator {text-align:center !important; font: normal 11px Arial !important; word-wrap: unset !important;}" +
        //".dateSeparator sep {display:inline-block; background:#ddd; height:1px; width:44%; margin-top:4px; vertical-align:middle;}" +
        ".dateSeparator text {display:inline-block !important; vertical-align:middle !important; width:10% !important;}" +
        // tag pre
        "pre {padding:5px 10px !important; background:#EFEEED !important;}" +
        // tag blockquote
        "blockquote {padding:5px 10px !important; border-left:4px solid #E1DFDD !important; background-color:#EFEEED !important;}" +
        // blue color for mention
        ".mention {color: RoyalBlue}" +
        // add border for copy-paste-table
        "table[itemprop=copy-paste-table] {border:1px solid #d3d3d3 !important; border-collapse:collapse !important;}" +
        "table[itemprop=copy-paste-table] th, table[itemprop=copy-paste-table] td {border:1px solid #d3d3d3 !important;}" +
        "</style>";

        return style;
}


/**
 * Get conversation html table
 *
 * @param   {String} fileName
 * @param   {String} fileId
 * @param   {Array} filters
 * @returns {String}
 */
function getConversationTable(fileName, fileId, filters) {

    // date order
    var dateOrder = lib.tzFunctions.getLocalDateOrder();

    var sHtmlReturn = '<table class="messagesTable">';
    var currentDate = "";

    var query = 'fileName="' + fileName + '" and fileId="' + fileId + '"';

    $("msTeamsReplyInfo", SCFILE_READONLY).setOrderBy(["createdDateTime"], [SCFILE_DSC]).select(query).iterate(function(reply) {

        // check filter at first
        var match = filterReply(reply, filters);
        if (!match) {
            return false;
        }

        var createdDateTime = reply.createdDateTime;

        // separate by date without time
        var sDate = convertDatetoString(createdDateTime, dateOrder);

        if (currentDate != sDate) {
            currentDate = sDate;
            sHtmlReturn += '<tr><td>';
            sHtmlReturn += '<div class="dateSeparator"><sep></sep><text>' + currentDate + '</text><sep></sep></div>';
            sHtmlReturn += '</td></tr>';
        }

        // one conversion is a table has two rows
        sHtmlReturn += '<tr><td><table class="messageRowTable">';

        // first row is username + time
        var userName = reply.userDisplayName;
        sHtmlReturn += "<tr><td>";
        sHtmlReturn += "<b>" + userName + "</b>" + "&nbsp&nbsp&nbsp&nbsp";
        sHtmlReturn += funcs.str(funcs.time(createdDateTime));
        sHtmlReturn += "</td></tr>";

        // second row is content
        sHtmlReturn += "<tr><td>" + replyContent(reply) + "</td></tr>";

        sHtmlReturn += "</table></td></tr>";
    });

    sHtmlReturn += '</table>';

    return sHtmlReturn;
}


/**
 * convert date to string, ignore time part
 *
 * @param {Date} date
 * @param {Number} dateOrder
 * @returns {String}
 */
function convertDatetoString(date, dateOrder) {

    if (!date) {
        return funcs.scmsg("10", "us"); // Unknown
    }

    var sDate = lib.tzFunctions.convertDatetoString(date, dateOrder, true);

    var sToday = lib.tzFunctions.convertDatetoString(new Date(), dateOrder, true);
    if (sDate == sToday) {
        return funcs.scmsg("today", "msteams");
    }

    var sYesterday = lib.tzFunctions.convertDatetoString(new Date(Date.now() - 24 * 60 * 60 * 1000), dateOrder, true);
    if (sDate == sYesterday) {
        return funcs.scmsg("yesterday", "msteams");
    }

    return sDate;
}


/**
 * filter reply according to the filters
 *
 * @param {SCFile} reply
 * @param {Array} filters
 * @returns {Boolean} true means match filters
 */
function filterReply(reply, filters) {
    if (!filters || filters.length == 0) {
        return true;
    }

    if (!reply) {
        return false;
    }

    var user = reply.userDisplayName;
    var content = reply.content;
    var strip = lib.StringUtil.stripHtmlTags(content);
    var attachments = reply.attachments;

    var i;
    for (i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (!filter) {
            continue;
        }
        filter = filter.trim().toLocaleUpperCase();

        // 1. user
        if (user && user.toLocaleUpperCase().indexOf(filter) >= 0) {
            continue;
        }

        // 2. content
        if (strip && strip.toLocaleUpperCase().indexOf(filter) >= 0) {
            continue;
        }

        var match = false;

        // 3. attachment filename
        if (attachments && attachments.length() > 0) {
            var j;
            var alength = attachments.length();

            for (j = 0; j < alength; j++) {
                var attachment = attachments[j].name;
                if (attachment && attachment.toLocaleUpperCase().indexOf(filter) >= 0) {
                    match = true;
                    break;
                }
            }
        }

        if (!match) {
            return false;
        }
    }

    return true;
}


/**
 * get reply content, convert hosted content & attachment url if has
 */
function replyContent(reply) {
    var content = reply.content;
    if (!content) {
        return content;
    }

    // replace hosted content tag with SM style embeded image src
    var hostedContentUrls = lib.MicrosoftTeamsHostedContent.getHostedContentUrls(reply);
    if (hostedContentUrls && hostedContentUrls.length > 0) {
        hostedContentUrls.forEach(function(url) {
            // get attachment name
            var attachmentName = getAttachmentNameFromContentUrl(url);

            if (attachmentName) {
                // hosted content support image only
                var sysattach = findAttachment(reply, attachmentName, ["png", "jpg", "jpeg", "gif", "bmp"]);
                if (sysattach) {
                    // <img src="scattach://uid:filename:application:topic">         
                    var newUrl = "scattach://" + lib.AttachmentUtil.getAttachmentLinkTag(sysattach);
                    content = content.replace('"' + url + '"', '"' + newUrl + '"');
                }
            }
        });
    }

    // replace at tag with hyper link color text
    // e.g. <at id="0">SMChatOpsBot</at> test => SMChatOpsBot test 
    var contentWithoutAt = content;
    var regexp = /<at\s+id="\d+">([^<]+)<\/at>/g;
    var matchAt = regexp.exec(content);
    while (matchAt !== null) {
        contentWithoutAt = contentWithoutAt.replace(matchAt[0], '<span class="mention">' + matchAt[1] + "</span>");
        matchAt = regexp.exec(content);
    }
    content = contentWithoutAt;

    // replace attachment tag with SM style url
    var attachments = reply.attachments;
    var attachmentContent = "";

    if (attachments && attachments.length() > 0) {
        var i;
        var length = attachments.length();

        for (i = 0; i < length; i++) {

            var attachment = attachments[i];
            var attachmentId = attachment.id;
            if (!attachmentId) {
                continue;
            }

            var source = '<attachment id="' + attachmentId + '"></attachment>';
            if (content.indexOf(source) == -1) {
                continue;
            }

            var target = attachment.name;

            var sysattach = findAttachment(reply, target);
            if (sysattach) {
                // <a href="scattach://uid:filename:application:topic">attachment name</a>            
                target = '<a href="scattach://' + lib.AttachmentUtil.getAttachmentLinkTag(sysattach) + '" class="attachmentLink"><b>' + target + '</b></a>';
            }

            // show paper clip icon in web client
            if (lib.BaseUtil.isWebClient()) {
                target = '<img src="../images/smc/paperclip.png" class="attachment"></img>&nbsp' + target;
            }

            // attachmentContent += '<br/>' + target;
            attachmentContent += '<p>' + target + '</p>';
        }
    }

    // avoid XSS attack    
    if (reply.contentType == "text") {
        // simply escape all HTML tags if no attachment tag
        if (!attachments || funcs.denull(attachments).length() == 0) {
            content = _.escapeHTML(content);
        }
        // sanitize XSS tag if exists attachment tag
        else {
            content = lib.StringUtil.sanitize(content);
        }
    }

    content += attachmentContent;

    return content;
}


/**
 * find attachnemt according to reply and attachment name
 *
 * @param {SCFile} reply
 * @param {String} attachmentName
 * @param {Array} supportedTypes
 * @returns {SCFile}
 */
function findAttachment(reply, attachmentName, supportedTypes) {
    var sysattach = $("!SYSATTACHMENTS").fields(["uid", "filename", "application", "topic"]);

    if (!supportedTypes || supportedTypes.length == 0) {
        sysattach = sysattach.find("application=:application and topic=:topic and filename=:filename", reply.fileName, reply.fileId, attachmentName).one();
    }
    // file type is unknown for hosted content attachment, try search all supported types
    else {
        var strNames = "{";
        var i;
        for (i = 0; i < supportedTypes.length - 1; i++) {
            strNames += '"' + attachmentName + '.' + supportedTypes[i] + '",';
        }
        strNames += '"' + attachmentName + '.' + supportedTypes[i] + '"}';
        sysattach = sysattach.find(`application=:application and topic=:topic and filename isin ${strNames}`, reply.fileName, reply.fileId).one();
    }

    return sysattach;
}


/**
 * get attachment name from hosted content url
 */
function getAttachmentNameFromContentUrl(hostedContentUrl) {
    if (!hostedContentUrl) {
        return "";
    }

    var contentId = lib.MicrosoftTeamsHostedContent.getHostedContentIdFromUrl(hostedContentUrl);
    if (!contentId) {
        return "";
    }

    return lib.MicrosoftTeamsHostedContent.convertContentIdToAttachmentName(contentId);
}