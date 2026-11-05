
var _file = lib.FileUtil._file;
var $break = lib.FileUtil.$break;

/*!
 * QCCR72978: Tasks stay set as "Initial" even if a change is withdrawn.
 *
 */
function hasOpenTasks( cm3r_number ) {
	return _file( 'cm3t' ).select( 'parent.change="' + cm3r_number + '" and status~="closed" and status~="Closed"' ).success;
}


function closeOpenTasks( cm3r_number ) {

	var b = false;
	var td = system.functions.tod();
	
	_file( 'cm3t' ).select( 'parent.change="' + cm3r_number + '" and status~="closed" and status~="Closed"' ).iterate(function( cm3t ) {
		cm3t.actualStart = td;
		cm3t.actualEnd = td;
		b = ( cm3t.doAction( "close" ) == RC_SUCCESS );
		if( ! b ) throw $break; // break the each method
	})
	
	return b;
}
