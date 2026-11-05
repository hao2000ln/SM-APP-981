/*
 * Version: 1.01
 * Date:    2010.06
 */

function getRecordsFromFile(fileName, query) {

	var file = new SCFile(fileName);
	var rc = "";
	try {
		rc = file.doSelect(query);
		if(rc == RC_SUCCESS) {
			return file;
		}
	}catch(ex) {
		print("exception: " + ex);
	}
	return null;

}

function deleteRecordsFromFile(fileName, query) {
	var file = new SCFile(fileName);
	var rc = file.doSelect(query);
	if(rc == RC_SUCCESS) {
		rc = file.doDelete();
		if(rc == RC_SUCCESS) {
			return;
		}
	}else {
		print("error: " + RCtoString(rc));
	}
}