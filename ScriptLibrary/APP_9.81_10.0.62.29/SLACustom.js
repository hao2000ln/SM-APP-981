/**
 * Solve performance issue when there are lots of slos in SLA
 * Solution: return true to skip the slo check slo conditions in sla.state.check
 * @see RAD sla.state.check, panel: check.sla.condition and the loop for slos in the RAD
 */
function shouldRefreshSla(fileNew, fileOld) {
	
	// Return true if we want to skip the slo check. 
	if(isBEMIngration()) {
		return true;
	}
	
	return false;
}

function isBEMIngration(){
	//// if(...)
	//// return true;
}