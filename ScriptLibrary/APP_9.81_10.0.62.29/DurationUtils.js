var _sf = system.functions;

// filter out no go durations from go durations
function filterOutNogoOccurences(durations, nogoDurations) {
	if (nogoDurations.length == 0) return durations;
	var result = [];
	jstart = 0;
	for (var i = 0; i < durations.length; i++) {
		var duration = durations[i];
		
		if (jstart >= nogoDurations.length) {
			mergePush(result, duration);
			continue;
		}
		
		for (var j = jstart; j < nogoDurations.length; j++) {
			var nogoDuration = nogoDurations[j];
			
			if (!isIntersect(duration, nogoDuration)) {
				if (nogoDuration.start < duration.start) {
					//result.push(nogoDuration);
					jstart = j+1;
					
				} else {
					mergePush(result, duration);
					jstart = j;
					
					break;
				}
			} else {
				var newDurations = excludeDuration(duration, nogoDuration);
				jstart = j+1;
				// if no duation, break;
				if (newDurations.length == 0) break;
				
				// add new durations to result
				for (var k = 0; k < newDurations.length-1; k++) {
					mergePush(result, newDurations[k]);
				}
				
				var lastDuration = newDurations[newDurations.length-1];
				for (var m = j+1; m < nogoDurations.length; m++) {
					nogoDuration = nogoDurations[m];
					if (isIntersect(lastDuration, nogoDuration)) {
						newDurations = excludeDuration(lastDuration, nogoDuration);
						// add new durations to result
						for (var k = 0; k < newDurations.length-1; k++) {
							mergePush(result, newDurations[k]);
						}
						lastDuration = newDurations[newDurations.length-1];
						jstart = m+1;
					} else {
						break;
					}
				}
				mergePush(result, lastDuration);
				break;
			}
			if (jstart == nogoDurations.length) {
				mergePush(result, duration);
			}
		}
	}
	return result;
}

function isIntersect(srcDuration, targetDuration) {
	if ((targetDuration.start >= srcDuration.start && targetDuration.start < srcDuration.end)
		|| (targetDuration.end > srcDuration.start && targetDuration.end <= srcDuration.end)) {
		return true;
	}
	
	return false;
}

function excludeDuration(srcDuration, targetDuration) {
	var durations = [];
	if (targetDuration.start >= srcDuration.start && targetDuration.start <= srcDuration.end) {
		if (srcDuration.start < targetDuration.start)
			durations.push({start:srcDuration.start, end:targetDuration.start});
		if (targetDuration.end < srcDuration.end) {
			if (targetDuration.end < srcDuration.end)
				durations.push({start:targetDuration.end, end:srcDuration.end});
		}
	} else if (targetDuration.end >= srcDuration.start && targetDuration.end <= srcDuration.end) {
		if (targetDuration.end < srcDuration.end)
			durations.push({start:targetDuration.end, end:srcDuration.end});
	} else {
		durations.push(srcDuration);
	}
	
	return durations;
}


// merge no go durations
function mergeNogoDurations(nogoDurations) {
	var allDurations = [];
	for (var tpid in nogoDurations) {
		allDurations.push(nogoDurations[tpid]);
	}
	if (allDurations.length == 0) return [];
	if (allDurations.length == 1) return allDurations[0];
	
	var durations = allDurations[0];
	
	for (var j = 1; j < allDurations.length; j++) {
		var durations2 = allDurations[j];
		durations = mergeDurations(durations, durations2);
	}
	return durations;
}

function mergeDurations(durations1, durations2) {
	var result = [];
	var firstDurations, lastDurations;
	if (durations1[0].start <= durations2[0].start) {
		firstDurations = durations1;
		lastDurations = durations2;
	} else {
		firstDurations = durations2;
		lastDurations = durations1;
	}
	
	var jstart = 0;
	for (var i = 0; i < lastDurations.length; i++) {
		var duration1 = lastDurations[i];
		for (var j = jstart; j < firstDurations.length; j++) {
			var duration2 = firstDurations[j];
			var mergedDuration = merge(duration1, duration2);
			if (mergedDuration == null) {
				if (duration2.start < duration1.start) {
					mergePush(result, duration2);
					jstart = j+1;
				} else {
					mergePush(result, duration1);
					jstart = j;
					break;
				}
			} else {
				mergePush(result, mergedDuration);
				jstart = j+1;
				break;
			}
		}
		
		if (jstart == firstDurations.length) {
			mergePush(result, duration1);
		}
	}
	if (jstart <= firstDurations.length-1) {
		for (var j = jstart; j < firstDurations.length; j++) {
			var duration2 = firstDurations[j];
			mergePush(result, duration2);
		}
	}
	return result;
}

function mergePush(result, duration) {
	if (result.length == 0) result.push(duration);
	var merged = merge(result[result.length-1], duration);
	if (merged == null) {
		result.push(duration);
	} else {
		result[result.length-1] = merged;
	}
}

function merge(duration1, duration2) {
	if (duration1.start >= duration2.start && duration1.start <= duration2.end) {
		return {start: duration2.start, end: max(duration1.end, duration2.end)};
	} else if (duration1.end >= duration2.start && duration1.end <= duration2.end) {
		return {start: min(duration1.start, duration2.start), end: duration2.end};
	} else {
		return null;
	}
	
}

function max(time1, time2) {
	if (time1 >= time2) return time1;
	return time2;
}

function min(time1, time2) {
	if (time1 <= time2) return time1;
	return time2;
}

function printDurations(durations) {
	for (var i = 0; i < durations.length; i++) {
		var duration = durations[i];
		printDuration(duration);
	}
}

function printDuration(duration) {
	print(toStr(duration.start) + " - " + toStr(duration.end));
}

function toStr(dateStr) {
	return system.functions.str(dateStr);
}


/*
 * month utilities
**/

function getCurrentMonthDuration() {
	var today = _sf.date(_sf.tod());
	return getMonthDuration(today);
}

function getNextMonthDuration() {
	var today = _sf.date(_sf.tod());
	var year = _sf.year(today);
	var month = _sf.month(today);
	
	if (month == 12) {
		year += 1;
		month = 1;
	} else {
		month += 1;
	}

	var firstDay = _sf.val(month + "/01/" + year, 3);
	return getMonthDuration(firstDay);
}

function getMonthDuration(date) {
	var year = _sf.year(date);
	var month = _sf.month(date);

	var firstDay = _sf.val(month + "/01/" + year, 3);
	//var lastDate = getLastDateOfMonth(firstDay);
	//var lastDay = _sf.val(month + "/" + lastDate + "/" + year, 3);
	if (month == 12) {
		year += 1;
		month = 1;
	} else {
		month += 1;
	}
	var firstDayOfNextMonth = _sf.val(month + "/01/" + year, 3);
	
	return {start: firstDay, end: firstDayOfNextMonth};

}

function getLastDateOfMonth(targetDate) {
	var date = targetDate;
	var currMonth = date.getMonth();
	var currDate = date.getDate();
	while (date.getMonth() == currMonth) {
		currDate = date.getDate();
		date = new Date(date.getFullYear(), date.getMonth(), currDate+1);
	}
	return currDate;
}
