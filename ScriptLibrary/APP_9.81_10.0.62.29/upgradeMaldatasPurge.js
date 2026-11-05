
/* 
 * Purge the mal datas to facilitate the upgrade process   
 * 
 */
var sys_str = system.functions.str;

var maldatas = [
    // QCCR61970
    _update( 'displayoption', 'screen.id="cm.view.display" and id#"cm.view.display_nextphase"', function( record ) {
        // add a prior false condition to prevent the displayoption to display
        var con = sys_str( record.condition );
        if( ! /^false\s+and\s*\(.*\)\s*$/.test( con ) ) {
            record.condition = 'false and (' + con + ')';
        }
    }),
    // QCCR74044
    _update( 'displayoption', 'screen.id="scm.advanced" and id="scm.advanced_refresh"', function( record ) {
        // add a prior false condition to prevent the displayoption to display
        var con = sys_str( record.condition );
        if( ! /^false\s+and\s*\(.*\)\s*$/.test( con )) {
            record.condition = 'false and (' + con + ')';
        }
    })
]

function purgeMaldatas() {

    function handleRecords( malEntry ) {
        var f = typeof malEntry.handler == 'function' ? malEntry.handler : function() { return true; };
        var file = new SCFile( malEntry.fileName );
        var rc = file.doSelect( malEntry.query );
        while( rc == RC_SUCCESS ) {
            if( ! f( file ) ) {
                file.doSave();
            }
            rc = file.getNext();
        }
    }
    
    if( maldatas ) {
        for( var i = 0; i < maldatas.length; i++ ) {
            if( maldatas[i] && maldatas[i].fileName
                    && maldatas[i].query ) {
                    
                handleRecords( maldatas[i] );
            }
        }
    }
}

function _update( fileName, query, handler ) {
    return new MalDataEntry( fileName, query, handler );
}

function _remove( fileName, query ) {
    return new MalDataEntry( fileName, query, _removeHandler );
}

function _removeHandler( record ) {
    record.doDelete();
    return true;
}

function MalDataEntry( fileName, query, handler ) {
    this.fileName = fileName;
    this.query = query;
    this.handler = handler;
}

function compileDisplayScreen() {
	system.functions.rtecall("callrad", 1, "us.compile.screen", ["name", "text"], ["scm.advanced", "ENG"], false);
}
