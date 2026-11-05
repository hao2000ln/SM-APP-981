//QCCR1E111285, dengxin
//add this method for legacy SLO suspend calculation: the suspended state will be unordered and should only change the running slo to suspend.
function calLegacySuspendProcessSLOState(slaactiveStates_,suspendStates_, statProgression_, sloInitIndex, sloFinalIndex, currentState){

	var slaactiveStates = lib.ArrayUtil.toJsArray(slaactiveStates_);
	var suspendStates = lib.ArrayUtil.toJsArray(suspendStates_);
	var statProgression = lib.ArrayUtil.toJsArray(statProgression_);
	
	var slaactiveLng=slaactiveStates.length;
	var slaActiveLast=slaactiveStates[slaactiveLng-1];
	
	var slaactiveLastIsSuspend=lib.ArrayUtil.contains(suspendStates,slaActiveLast);
	var slaactiveLastInProgression=lib.ArrayUtil.indexOf(statProgression,slaActiveLast);
	var returnState=currentState;
	
	var i=slaactiveLng-1;
	var temp;
	while(true){
		temp=slaactiveStates[i];
		if(i==0) {
			break;
		}
		if(lib.ArrayUtil.contains(suspendStates,temp)) {
			i-=1;
		}
		else{
			var inx=lib.ArrayUtil.indexOf(statProgression,temp);
			if(inx<0){
				i-=1;
			}
			else {
				break;
			}
		}
	}
	
	if(lib.ArrayUtil.contains(suspendStates, temp)){
		returnState=3;
	}
	else{
		var stateIndex=lib.ArrayUtil.indexOf(statProgression,temp)+1;
		if(stateIndex<0){
			returnState=5;
		}else{
			if(stateIndex<sloInitIndex) {returnState=5;}
			else 
				if (sloInitIndex<=stateIndex && stateIndex<sloFinalIndex)	{
					if(slaactiveLastInProgression<0) {returnState=2; }
					else {returnState=3;}
				}
				else{
					returnState=4;
				}
		}
	}

	return returnState;
}


/**
 * Calculate outage duration
 *
 * @param {SCFile} outage
 * @return {SCDatum} duration
 */
function calculateOutageDuration(outage) {

	if (outage.outage_start == null || outage.outage_end == null) {
		return null;
	}
	
	var duration = system.functions.val(system.functions.val(outage.outage_end) - system.functions.val(outage.outage_start), 3);
	return duration;
}

/**
 * Invoked by the panel build.svcCartItem.qry of RAD sla.refresh.active
 * Get the query to search the related svcCartItem
 */
function buildCalculatedCartItemQuery(file) {
    var filename = funcs.filename(file);
    if (filename == "request" || filename == "cm3r") {
        if (file["svcCartId"] != null) {
            return "cartId=" + file["svcCartId"];
        }
    } else {
        if (file["incident.id"] != null) {
            return "sdID=\"" + file["incident.id"] + "\"";
        }
    }
    
    return "false";
}
