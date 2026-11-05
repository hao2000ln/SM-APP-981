var logger = getLog('RunRestfulGwattachmentwl');
var $ = lib.c.$;

function GET(req, res) {
	var attachWL = findAttachmentWhilelist();
    
    if(attachWL && attachWL.attrs && attachWL.attrs.length()>0) {
    	var attrs = [];
    	for(var i=0, len=attachWL.attrs.length(); i<len; i++) {
    		attrs.push({
    			fileextension: attachWL.attrs[i]['fileextension'],
    			description: attachWL.attrs[i]['description']
    		});
    	}
    	res.send({whitelist: attrs});
    } else {
    	res.status(404).message('Attachment Whilelist is not defined.');
    }
}

function findAttachmentWhilelist() {	
    var query = 'enabled=true';
    return $("attachmentWhitelist", SCFILE_READONLY).select(query).uniqueResult();
}

function authorize() {
	return true;
}
