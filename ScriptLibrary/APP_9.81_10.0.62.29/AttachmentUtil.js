var $ = lib.c.$;

/**
 * Build and return the CSS Style for the attachment HTML table
 *   
 * @returns {String} style - the CSS style
 */
function getAttachmentHtmlCSS() {

    var style =
        "<style> " +
        "body{border:0 0 0 0;margin:0;padding:0;font-family: Verdana, Arial, Helvetica, sans-serif;}" +
        ".main{width:100%;font-size: 12;text-align: left}" +
        ".main th{font-weight: bold;font-size: 14;padding:4;background: #E0E0E0;}" +
        ".main td{padding:8}" +
        ".oddRow{background: #edf3fe;color: black}" +
        ".evenRow{background: white;color: black}" +
        ".TableHeading{text-align:left;} " +
        ".table-border{border-left: solid 1px #888;} " +
        "body[style*=\"rtl\"] .TableHeading{text-align:right;} " +
        "body[style*=\"rtl\"] .table-border{border-right: solid 1px #888; border-left:none} " +
        "</style>";

    return style;
}


/**
 * Return attachment HTML table
 * 
 * @param {String} related file name  
 * @param {Array} related file id list  
 * @returns {String} html table
 */
function getAttachmentHtmlTable(filename, ids) {

    var sHtmlReturn = '<table class="TableResults" style="width:100%;" summary="' + getAttachmentHtmlTableSummary(filename) + '">\n';

    // table header          
    sHtmlReturn += getAttachmentHtmlTableHead(filename);

    // table body
    var i;
    for (i = 0; i < ids.length; i++) {
        sHtmlReturn += getAttachmentHtmlTableBody(ids[i]);
    }

    sHtmlReturn += '</table>';

    return sHtmlReturn;
}


/**
 * Return attachment HTML table summary
 * 
 * @param {String} related file name  
 * @returns {String} table summary
 */
function getAttachmentHtmlTableSummary(filename) {
    var table = funcs.scmsg(filename, "tablename");
    return funcs.scmsg("tablesummary", "SYSATTACHMENTS", [table]);
}


/**
 * Return attachment HTML table head
 * 
 * @param {String} related file name  
 * @returns {String} table head
 */
function getAttachmentHtmlTableHead(filename) {

    var col1 = funcs.get_field_caption("filename", "SYSATTACHMENTS");
    var col2 = funcs.scmsg("sizekb", "SYSATTACHMENTS");
    var col3 = funcs.scmsg(filename, "tablename");

    var sHtmlReturn =
        '<tr>' +
        // Attachment Name
        '<th class="TableHeading"><div style="border-bottom: solid 1px #888;"><div tabindex="0" class="table-hd-inner"><span class="TableHeadingText">' + col1 + '</span></div></div></th>' +
        // Size            
        '<th class="TableHeading"><div style="border-bottom: solid 1px #888;" class="table-border"><div tabindex="0" class="table-hd-inner"><span class="TableHeadingText">' + col2 + '</span></div></div></th>' +
        // Record Type
        '<th class="TableHeading"><div style="border-bottom: solid 1px #888;" class="table-border"><div tabindex="0" class="table-hd-inner"><span class="TableHeadingText">' + col3 + '</span></div></div></th>' +
        '</tr>\n';

    return sHtmlReturn;
}


/**
 * Return attachment HTML table rows
 * 
 * @param {String} recordId  
 * @returns {String} table rows
 */
function getAttachmentHtmlTableBody(recordId) {

    var sHtmlReturn = "";

    var query = 'topic="' + recordId + '" and segment=0';
    var fields = ["application", "topic", "size", "filename", "uid"];

    $("SYSATTACHMENTS", SCFILE_READONLY).setFields(fields).select(query).iterate(function(attachment) {
        // build HTML
        var file_size = Math.round(attachment.size / 1024);
        if (file_size == 0) {
            file_size = 1;
        }

        var filenameShow = attachment.filename;
        // append .UNSAFE if not in allow list
        if (!isAttachmentAllowed(filenameShow)) {
            filenameShow += ".UNSAFE";
        }

        var tag = getAttachmentLinkTag(attachment);

        sHtmlReturn +=
            '<tr class="TableNormalRow">' +
            '<td class="TableCellResults"><div><a class="shadowFocus" tabindex="0" href="scattach://' + tag + '"><div class="Text FormatTableElementReadonly"><span dir="ltr" class="xTableCell FormatTableElementReadonly" style="text-decoration:underline;color:#0000FF;">' + filenameShow + '</span></div></a></div></td>' +
            '<td class="TableCellResults"><div tabindex="0" class="shadowFocus"><div class="Text FormatTableElementReadonly"><span class="xTableCell FormatTableElementReadonly">' + file_size + '</span></div></div></td>' +
            '<td class="TableCellResults"><div tabindex="0" class="shadowFocus"><div class="Text FormatTableElementReadonly"><span class="xTableCell FormatTableElementReadonly">' + attachment.topic + '</span></div></div></td>' +
            '</tr>\n';
    });

    return sHtmlReturn;
}


/**
 * get scattach link tag
 *
 * @param {SCFile} attachment
 * @param {String} type
 *              file or img
 * @returns {String}
 */
function getAttachmentLinkTag(attachment, type) {
    // file type prefix
    var prefix = type ? type + ":" : "";
    return prefix + attachment.uid + ':' + attachment.filename + ':' + attachment.application + ':' + attachment.topic;
}


/**
 * Return the total attachment number
 *   
 * @param {String} record id  
 * @param {String} application  
 * @returns {Number} the total attachment number
 */
function countAttachments(recordId, application) {
    var query = "";

    // use application field as first condition to match with index to improve performance
    if (application) {
        query = 'application="' + application + '" and ';
    }
    query += 'topic="' + recordId + '" and segment=0';
    return $("SYSATTACHMENTS", SCFILE_READONLY).setFields(["uid"]).count(query);
}


/**
 * Check whether the attachment is allowed
 *
 * @param {String} attachment
 * @returns {Boolean}
 */
function isAttachmentAllowed(attachment) {
    if (!attachment) {
        return false;
    }

    // all file extensions are allowed if list is disabled
    if (!isAttachmentAllowListEnabled()) {
        return true;
    }

    var index = attachment.lastIndexOf(".");
    if (index < 0 || index == attachment.length - 1) {
        return false;
    }

    var extension = attachment.substring(index + 1).toLowerCase();

    var list = getFileExtensionAllowList();

    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].toLowerCase() == extension) {
            return true;
        }
    }

    return false;
}


/**
 * Check whether attachment allow list is enabled
 *
 * @returns {Boolean}
 */
function isAttachmentAllowListEnabled() {
    var list = $("!attachmentWhitelist").fields("id").find("enabled=true").one();
    return list != null;
}


/**
 * Get file extension allow list
 *
 * @returns {Array} 
 */
function getFileExtensionAllowList() {
    var list = $("!attachmentWhitelist").fields("attrs").find("enabled=true").one();
    if (!list || !list.attrs) {
        return [];
    }

    var extensions = [];
    var i;
    var length = list.attrs.length();
    for (i = 0; i < length; i++) {
        var attr = list.attrs[i];
        if (attr.fileextension) {
            extensions.push(attr.fileextension);
        }
    }

    return extensions;
}

/**
 * adjust attachment name of the record
 *
 * @param {String} fileName
 * @param {String} fileId
 * @param {String} attachmentName
 * @returns {String}
 */
function adjustAttachmentName(fileName, fileId, attachmentName) {
    var query = "application=:fileName and topic=:fileId and filename=:attachment";
    var sysattachment = $("!SYSATTACHMENTS").fields("uid").find(query, fileName, fileId, attachmentName).one();
    if (!sysattachment) {
        return attachmentName;
    }

    // rename if attachment exists
    var structure = getFileNameStructure(attachmentName);
    var name = structure[0];
    var ext = structure[1];

    var i = 1;
    while (sysattachment) {

        if (name) {
            attachmentName = name + " (" + i + ")";
        } else {
            attachmentName = "(" + i + ")";
        }

        if (ext) {
            attachmentName += "." + ext;
        }

        sysattachment = $("!SYSATTACHMENTS").fields("uid").find(query, fileName, fileId, attachmentName).one();

        i++;
    }

    return attachmentName;
}


/**
 * get file name structure
 *
 * @param {String} filename
 * @returns {Array}
 */
function getFileNameStructure(filename) {

    var name = "";
    var extension = "";

    var index = filename.lastIndexOf(".");

    if (index == -1) {
        name = filename;
    } else {
        name = filename.substring(0, index);
        extension = filename.substring(index + 1);
    }

    return [name, extension];
}

var ATTACHMENT_DEFAULT_MAX_SIZE = 10485760; // 10*1024*1024
var ATTACHMENT_DEFAULT_TOTAL_SIZE = 52428800; // 50*1024*1024

/**
 * Check if the attachment size exceeds the max limit 
 * The check order is operator, company and default
 * Return true when not exceed or false
 * @param {Number} attachmentSize
 * @returns boolean
 */
function checkMaxAttachmentSize(attachmentSize, operatorName) {
    var maxSize = 0;

    var operator = lib.operatorUtil.getOperatorByName(operatorName, ["max.attach.size"]);
    if (operator && operator.max_attach_size) {
        maxSize = +operator.max_attach_size;
    }

    if (!maxSize || maxSize <= 0) {
        maxSize = vars.$G_system_info.max_attach_size;
        if (!maxSize || maxSize <= 0) {
            maxSize = ATTACHMENT_DEFAULT_MAX_SIZE;
        }
    }

    if (!attachmentSize || attachmentSize <= 0) {
        return true;
    }

    return attachmentSize <= maxSize;
}

/**
 * Check if the attachment size exceeds the total limit
 * The check order is operator, company and default
 * Return true when not exceed or false
 * @param {String} fileName
 * @param {String} fileId
 * @param {Number} attachmentSize
 * @returns boolean
 */
function checkTotalAttachmentSize(fileName, fileId, attachmentSize, operatorName) {
    var totalSize = 0;

    var operator = lib.operatorUtil.getOperatorByName(operatorName, ["total.attach.size"]);
    if (operator && operator.total_attach_size) {
        totalSize = +operator.total_attach_size;
    }
    if (!totalSize || totalSize <= 0) {
        totalSize = vars.$G_system_info.total_attach_size;
        if (!totalSize || totalSize <= 0) {
            totalSize = ATTACHMENT_DEFAULT_TOTAL_SIZE;
        }
    }

    if (!attachmentSize || attachmentSize <= 0) {
        return true;
    }

    if (attachmentSize > totalSize) {
        return false;
    }

    var query = 'application="' + fileName + '" and topic="' + fileId + '" and segment=0';
    var currentSize = attachmentSize;
    $("!SYSATTACHMENTS").fields("size").find(query).each(function(attach) {
        currentSize += attach.size;
    });

    return currentSize <= totalSize;
}