/**
	add record to kmknowledgebaseupdates table, to define the record range of the index. 
	KMBU represents the kmknowledgebaseupdates table.
*/
/**
	@param filename, record type
	@param query, query to find record
	add record to kmknowledgebaseupdates table according to given file type and query range.
*/
function addRecordToKBU(filename, query) {
	var f = new SCFile( filename, SCFILE_READONLY );
	var rc = f.doSelect(query);
	var count = 0;
	while( rc == RC_SUCCESS ) {
			lib.KMCollection_Update_Triggers.kmtriggerAfterAdd( filename, f );
			rc = f.getNext();
			count++;
	}
	print( count + ' records saved to kmknowledgebaseupdates table, waiting for incremental index to process.' );
}

/**
	@param libname, library name to process.
	find corresponding library and put the query range record to kmknowledgebaseupdates table for incremental index. 
*/
function addRecordToKBUFromLib(libname) {
	var kb = new SCFile( 'kmknowledgebase', SCFILE_READONLY );
	var rc = kb.doSelect('kbname = "' + libname + '"');
	if( rc == RC_SUCCESS ) {
		print( ' Start processing ' + libname );
		addRecordToKBU( kb['sclibtablename'], kb['scquery'] || 'true');
		print( ' Process ' + libname + ' completed.' );
	} else {
		print(' No library found.' );
	}
}

//addRecordToKBUFromLib('Incident_Library');

addRecordToKBU('incidents', 'true');

