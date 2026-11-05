
function getRecordsFromFile( fileName, query ) {

	var file = new SCFile(fileName);
	var rc = "";
	try {
		rc = file.doSelect(query);
		if(rc == RC_SUCCESS) {
			return file;
		}
	}catch( ex ) {
		print( "exception: " + ex );
	}
	
	return null;

}
