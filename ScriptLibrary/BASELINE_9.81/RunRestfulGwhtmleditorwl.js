var logger = getLog('RunRestfulGwhtmleditorwl');
var $ = lib.c.$;

function GET(req, res) {
	var heWL = findHtmlEditorWhilelist();
    
    if(heWL && heWL.attrs && heWL.attrs.length()>0) {
    	var attrs = [];
    	for(var i=0, len=heWL.attrs.length(); i<len; i++) {
    		attrs.push({
    			tag: heWL.attrs[i]['tag'],
    			attr: heWL.attrs[i]['attr']
    		});
    	}
    	res.send({whitelist: attrs});
    } else {
    	res.status(404).message('Html Editor Whilelist is not defined.');
    }
}

function findHtmlEditorWhilelist() {	
    var query = 'enabled=true';
    return $("htmltags", SCFILE_READONLY).select(query).uniqueResult();
}

function authorize() {
	return true;
}
