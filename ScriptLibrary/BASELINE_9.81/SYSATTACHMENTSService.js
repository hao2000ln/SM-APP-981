var $ = lib.c.$;

var SYSATTACHMENTSService = $({
	countAttachment : function(topic, application) {
	    return lib.AttachmentUtil.countAttachments(topic, application);
	}
});

function getClass() {
	return SYSATTACHMENTSService;
}