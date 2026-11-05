var NORMAL_EXIT = 'normal';
var BAD_VALIDATION_EXIT = 'badval';

var log = getLog("IDOLAPI_SmartSearch");

function search() {
	var inParamJson = vars['$L.file']['in'];
	try {
		var paramObj = eval('('+inParamJson+')');
	} catch (ex) {
		log.error('Error when parse parameter:' + inParamJson + '  ' + ex);
		vars.$L_exit = BAD_VALIDATION_EXIT;
		return;
	}
	
	try {
		var keyword = paramObj.keyword;
		var startIndex = paramObj.start;
		var pageSize = paramObj.pagesize;
		var searchResult = lib.KMSearchInterface.srcSearch(keyword, null, startIndex, pageSize);
		if (searchResult) {
			vars['$L.file']['out'] = searchResult.toXMLString();;
		}
	} catch (ex) {
		log.error('Error with exception:' + ex);
		vars.$L_exit = BAD_VALIDATION_EXIT;
		return;
	}
}