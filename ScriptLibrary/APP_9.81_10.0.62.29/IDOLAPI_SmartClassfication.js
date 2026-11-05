var NORMAL_EXIT = 'normal';
var BAD_VALIDATION_EXIT = 'badval';
var _ = lib.Underscore.require();

var log = getLog("IDOLAPI_SmartClassfication");

function smartClassify() {
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
		var adapter = lib.IDOLAdapterDAO.getAdapterByFileName(filename);
		if (adapter === null) {
			log.error('No adapter for table:' + filename);
			vars.$L_exit = BAD_VALIDATION_EXIT;
			return;
		}
		
		var rc;
		var suggestedFields = [];
		do {
			if (adapter['level1.field']) {
				suggestedFields.push(adapter['level1.field']);
			}
			if (adapter['level2.field']) {
				suggestedFields.push(adapter['level2.field']);
			}
			if (adapter['level3.field']) {
				suggestedFields.push(adapter['level3.field']);
			}
			rc = adapter.getNext();
		} while (rc === RC_SUCCESS);
		
		var infile = new SCFile(filename);
		var obj;
		for (obj in paramObj) {
		    if (obj == "filename") {
		        continue;
		    }
			infile[obj] = paramObj[obj];
		}
		var company = paramObj.company;
		
		var companys= null ;
		if(company){
		   companys = _.compact(company.split(","));
		}
		
		lib.IDOL_Utilities.fillIncidentsByIdol(infile, 3, companys);
		
		var result = {};
		var i;
		for (i = 0; i < suggestedFields.length; i++) {
			result[suggestedFields[i]] = infile[suggestedFields[i]];
		}
		
		vars['$L.file']['out'] = lib.JSON.json().stringify(result);
		vars.$L_exit = NORMAL_EXIT;
	} catch (ex) {
		log.error('Error with exception:' + ex);
		vars.$L_exit = BAD_VALIDATION_EXIT;
		return;
	}
	
}