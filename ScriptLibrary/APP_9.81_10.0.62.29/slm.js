
/*
 * added for QCIM1E128355/QCCR1E135156
 * return two work schedule instersection, added for Sberbank Escalation
 * in OOB data, this function was not invoked
 */

function workScheduleIntersection(schedule1, schedule2) {
	//both of the work schedule is empty, return null;
	if (isEmpty(schedule1) && isEmpty(schedule2))
		return null;
	var wsRecord1 = null;
	var wsRecord2 = null;
	if (!isEmpty(schedule1))
		wsRecord1 = lib.c.$("caldutyhours").select("name=\"" + schedule1 + "\"").uniqueResult();
	if (!isEmpty(schedule2))
		wsRecord2 = lib.c.$("caldutyhours").select("name=\"" + schedule2 + "\"").uniqueResult();
	var zeroTime = system.functions.parse("00:00:00", 3);
	//both of the work schedule exist, calculate them intersection;
	if (wsRecord1 && wsRecord2) {
		var intersectionWS = "Intersection" + "_" + schedule1 + "_" + schedule2;
		for (var i = 0; i < 7; i++) {
			var dayindex = i + 1;
			var beginhourName = "begin.hour." + dayindex;
			var endhourName = "end.hour." + dayindex;
			var breakstartName = "break.start." + dayindex;
			var breakendName = "break.end." + dayindex;
			var fulldayName = "full.day." + dayindex;
			var durationName = "duration." + dayindex;
			if (!wsRecord2[fulldayName] && !wsRecord1[fulldayName]) {
				if (system.functions.same(wsRecord1[beginhourName], wsRecord1[endhourName])) {
					wsRecord1[durationName] = null;
				} else if (system.functions.same(wsRecord2[beginhourName], wsRecord2[endhourName])) {
					wsRecord1[beginhourName] = wsRecord2[beginhourName];
					wsRecord1[endhourName] = wsRecord2[endhourName];
				} else if (wsRecord1[endhourName] <= wsRecord2[beginhourName] || wsRecord2[endhourName] <= wsRecord1[beginhourName]) {
					wsRecord1[endhourName] = wsRecord1[beginhourName];
					wsRecord1[durationName] = null;
				} else {
					wsRecord1[beginhourName] = system.functions.max(wsRecord1[beginhourName], wsRecord2[beginhourName]);
					if (isZeroTime(wsRecord1[endhourName]) || isZeroTime(wsRecord2[endhourName])) {
						wsRecord1[endhourName] = system.functions.max(wsRecord1[endhourName], wsRecord2[endhourName]);
					} else {
						wsRecord1[endhourName] = system.functions.min(wsRecord1[endhourName], wsRecord2[endhourName]);
					}
				}
			} else if (!wsRecord2[fulldayName]) {
				wsRecord1[beginhourName] = wsRecord2[beginhourName];
				wsRecord1[endhourName] = wsRecord2[endhourName];
				wsRecord1[breakstartName] = wsRecord2[breakstartName];
				wsRecord1[breakendName] = wsRecord2[breakendName];
				wsRecord1[fulldayName] = false;
			}

			if (system.functions.same(wsRecord1[beginhourName], wsRecord1[endhourName])) {
				wsRecord1[breakstartName] = wsRecord1[beginhourName];
				wsRecord1[breakendName] = wsRecord1[beginhourName];
			} else if (system.functions.same(wsRecord1[breakstartName], wsRecord1[breakendName])) {
				wsRecord1[breakstartName] = wsRecord2[breakstartName];
				wsRecord1[breakendName] = wsRecord2[breakendName];
			} else {
				if (!system.functions.same(wsRecord2[breakstartName], wsRecord2[breakendName])) {
					wsRecord1[breakstartName] = system.functions.min(wsRecord1[breakstartName], wsRecord2[breakstartName]);
					if (isZeroTime(wsRecord1[breakendName]) || isZeroTime(wsRecord2[breakendName])) {
						wsRecord1[breakendName] = system.functions.min(wsRecord1[breakendName], wsRecord2[breakendName]);
					} else {
						wsRecord1[breakendName] = system.functions.max(wsRecord1[breakendName], wsRecord2[breakendName]);
					}
				}
			}
			if (system.functions.same(wsRecord1[breakstartName], wsRecord1[breakendName]) || 
				wsRecord1[breakstartName] >= wsRecord1[endhourName] || 
				wsRecord1[breakendName] <= wsRecord1[beginhourName]) {
				wsRecord1[breakstartName] = new XMLDate("P0DT0H00M00S").getDatum();
				wsRecord1[breakendName] = new XMLDate("P0DT0H00M00S").getDatum();
			}
		}
		//holiday group of wsRecord1 is empty, set wsRecord2 holiday group to it;
		if (isEmpty(wsRecord1["holiday.table"])) {
			wsRecord1["holiday.table"] = wsRecord2["holiday.table"];
		}
		//wsRecord1["weekly.duration"] = "00:00:00";
		wsRecord1["name"] = intersectionWS;
		return callRAD(wsRecord1);
	} else if (wsRecord1) { //wsRecord2 doesn't exist, return wsRecord1;
		return wsRecord1;
	} else if (wsRecord2) { //wsRecord1 doesn't exist, return wsRecord2;
		return wsRecord2;
	} else {
		return null;
	}
}

function callRAD(calNew) {
	var RADName = "calendar.calc.duration";
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var argTypes = new SCDatum();
	var results = new SCDatum();
	argNames.setType(8);
	argVals.setType(8);
	argTypes.setType(8);
	results.setType(8);
	argNames.push("file");
	argVals.push(calNew);
	argTypes.push(6);
	results.push("file");
	var radResults = lib.RAD.run(RADName, argNames, argVals, argTypes, results);
	return system.functions.val(radResults.results[0], 6);
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}

function isZeroTime(dt) {
	if (system.functions.type(dt) == 3)
		dt = system.functions.str(dt);
	return '00:00:00' == dt;
}
