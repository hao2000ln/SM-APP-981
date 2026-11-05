
/** 
 * QCCR67564
 * Revise the records that contain full-angle char '-'(it's unicode is \u2013) in file 'help'.
 * (invoked in rad/label: apm.upgrade.wizard/maldatas.revise)
 */
function reviseHelpRecords() {
    
    function _r( str, ignorQuote ) {
        return str.replace( /\u2013|"/g, function( c ) { 
            switch( c ) {
                case '\u2013': 
                    c = '-'; 
                    break; 
                case '"': 
                    if( ! ignorQuote ) c = '\\"'; 
                    break;
            }
            return c;
        });
    }
    
    var helpTempFile = new SCFile( 'help' );

    function semiangleExists( file ) {
        var queryTemp = 'syslanguage="' + file.syslanguage + '" and term="' + _r( file.term ) + '"';
        var rcTemp = helpTempFile.doSelect( queryTemp );
        if( rcTemp == RC_SUCCESS ) {
            return true;
        }else {
            return false;
        }
    }
    
    var helpFile = new SCFile( 'help' );
    var rc = helpFile.doSelect( 'term#"Format Control maintenance \u2013" and syslanguage~="xxx"' );
    while( rc == RC_SUCCESS ) {
        if( semiangleExists( helpFile ) ) {
            // if the record contains the semiangle char '-' existed, then remove the full-angle record
            helpFile.doDelete();
        }else {
            // if the record contains the semiangle '-' does not exist, then update the char '-' from full-angle to semiangle
            helpFile.term = _r( helpFile.term, true );
            helpFile.doUpdate();
        }
        rc = helpFile.getNext();
    }
}
