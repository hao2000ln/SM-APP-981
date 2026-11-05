var $ = lib.c.$;

/**
 *  This functions build and return incident task attachment HTML tables
 *   
 *  @param {String} incident id
 *  @returns {string} incident task attachment HTML table
 */
function getTaskAttachmentHTML(incidentId) {

    var numbers = [];
    $("imTask", SCFILE_READONLY).setFields(['id']).setOrderBy(['id'], [SCFILE_DSC]).select('parent.incident="' + incidentId + '"').iterate(function(task) {
        numbers.push(task.id);
    });

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("imTask", numbers);

    return sHtmlReturn;
}


/**
 *  This functions build and return incident attachment HTML tables
 *   
 *  @param {String} incident id
 *  @returns {string} incident attachment HTML table
 */
function getAttachmentHTML(incidentId) {

    var sHtmlReturn = lib.AttachmentUtil.getAttachmentHtmlCSS() + lib.AttachmentUtil.getAttachmentHtmlTable("probsummary", [incidentId]);

    return sHtmlReturn;
}


/**
 *  Return the total attachment number of incident tasks
 *   
 *  @param {String} incident id
 *  @returns {Number} the total attachment number of task records
 */
function countTaskAttachments(incidentId) {

    var attach_number = 0;

    $("imTask", SCFILE_READONLY).setFields(['id']).select('parent.incident="' + incidentId + '"').iterate(function(task) {
        attach_number += lib.AttachmentUtil.countAttachments(task.id, "imTask");
    });

    return attach_number;
}