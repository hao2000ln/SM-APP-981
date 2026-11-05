var _ = lib.Underscore.require(),
    IDOLGlobalSearchSharePointLinkBuilder = lib.IDOLGlobalSearchSharePointLinkBuilder.require();

var logger = getLog('IDOLAssistantCopyLink');

var IDOLAssistantCopyLink = (function() {

  var RESOLUTION_FIELD_MAPPINGS = {
    "incidents" : "resolution",
    "probsummary" : "resolution",
    "knownerror" : "resolution",
    "rootcause" : "workaround", 
    "request" : "resolution"
  };

  function copyLink(record, assoc, library, reference) {
    var filename = funcs.filename(record),
        fieldname = RESOLUTION_FIELD_MAPPINGS[filename];

    if (!fieldname) {
      logger.warn('no mapping for ' + filename);
      return;
    }

    if (library.kbtype === 'splib' && 
        !IDOLGlobalSearchSharePointLinkBuilder.isLinkValidate(reference)) {

      var database = library.kbname;
      reference = IDOLGlobalSearchSharePointLinkBuilder.buildLink(reference, database);
    }

    if (lib.KMUtils.isSCArray(record[fieldname])) {
      record[fieldname].push(reference);
    } else {
      record[fieldname] += reference;
    }

    funcs.cursor_field_name_set(fieldname);
  }

  return {
    handle : copyLink
  };
}());

function handle() {
  return IDOLAssistantCopyLink.handle.apply(this, arguments);
}