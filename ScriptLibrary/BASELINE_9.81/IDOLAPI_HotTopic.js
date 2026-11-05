var NORMAL_EXIT = 'normal';
var BAD_VALIDATION_EXIT = 'badval';

var log = getLog("IDOLAPI_HotTopic");

function doHotTopic() {
	var inParamJson = vars['$L.file']['in'];
	try {
		var paramObj = eval('('+inParamJson+')');
	} catch (ex) {
		log.error('Error when parse parameter:' + inParamJson + '  ' + ex);
		vars.$L_exit = BAD_VALIDATION_EXIT;
		return;
	}
	
	var filename = paramObj.filename;
	try {
		var keyword, fromdate, todate, criteria, customQuery
		var infile = new SCFile(filename);
		for (var obj in paramObj) {
			if (obj === 'keyword') {
				keyword = paramObj[obj];
			} else if (obj === 'fromdate') {
				fromdate = paramObj[obj]
			} else if (obj === 'todate') {
				todate = paramObj[obj]
			} else {
				infile[obj] = paramObj[obj];
			}
		}

		var company = paramObj.company;
		
		var range = [fromdate, todate];
		var result = lib.IDOLHTALauncher.require().searchHotTopic(keyword, range, infile, customQuery);

		vars['$L.file']['out'] = result;
		vars.$L_exit = NORMAL_EXIT;
		
	} catch (ex) {
		log.error('Error with exception:' + ex);
		vars.$L_exit = BAD_VALIDATION_EXIT;
		return;
	}
}