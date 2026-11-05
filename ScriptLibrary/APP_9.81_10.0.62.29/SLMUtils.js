
/*
* check if two duration is overlapped
*/
function isOverlap(start1, end1, start2, end2, fullRange) {
	
	if(fullRange) return (start2 >= start1 && start2 <= end1) || (start1 >= start2 && start1 <= end2);
	else return (start2 >= start1 && start2 < end1) || (start1 >= start2 && start1 < end2);
	
}

function min(date1, date2) {
	return (date1 < date2)?date1 : date2;
}

function max(date1, date2) {
	return (date1 < date2)?date2 : date1;
}

/* 
* calculate intersection of two time duration
* @param duration1 time map containing 'start' and 'end' properties
* @param duration2 time map containing 'start' and 'end' properties
* @return time map containing intersection duration, null if no intersection
*/
function calcIntersection(duration1, duration2, fullRange) {
	var start1 = duration1.start;
	var end1 = duration1.end;
	var start2 = duration2.start;
	var end2 = duration2.end;
	
	var retStart = null, retEnd = null;
	
	if (isOverlap(start1, end1, start2, end2, fullRange)) {
		retStart = max(start1, start2);
		retEnd = min(end1, end2);
		return {'start': retStart, 'end': retEnd};
	} else {
		return null;
	}
}

/* 
* calculate union of two time duration
* @param duration1 time map containing 'start' and 'end' properties
* @param duration2 time map containing 'start' and 'end' properties
* @return time map containing union duration, null if no intersection
*/
function calcUnion(duration1, duration2) {
	var start1 = duration1.start;
	var end1 = duration1.end;
	var start2 = duration2.start;
	var end2 = duration2.end;
	
	var retStart = null, retEnd = null;

	if (isOverlap(start1, end1, start2, end2)) {
		retStart = min(start1, start2);
		retEnd = max(end1, end2);
		return {'start': retStart, 'end': retEnd};
	} else {
		return null;
	}
}

/* 
* calculate intersection array of two time duration array
* @param durationArray1 time map containing 'start' and 'end' properties
* @param durationArray2 time map containing 'start' and 'end' properties
* @return time map containing intersection duration array, null if no intersection
*/
function calcIntersections(durationArray1, durationArray2, fullRange) {
	var retDurations = [];
	
	var i = 0, j = 0;
	for (i = 0; i < durationArray1.length; i++) {
		var duration1 = durationArray1[i];
		for (j = 0; j < durationArray2.length; j++) {
			var duration2 = durationArray2[j];
			var retDuration = calcIntersection(duration1, duration2, fullRange);
			if (retDuration != null) {
				retDurations.push(retDuration);
			}
		}
	}
	
	return retDurations;
}

/* 
* merge array of two time duration array sorted by start
* @param durationArray1 time map containing 'start' and 'end' properties
* @param durationArray2 time map containing 'start' and 'end' properties
* @return time map containing sorted duration array
*/
function mergeDurations(durationArray1, durationArray2) {
	var mergedArray = durationArray1.concat(durationArray2);
	return sortDurations(mergedArray);
}

function sortDurations(mergedArray) {
	return mergedArray.sort(function(duration1, duration2) {
		if (duration1.start.getTime() <= duration2.start.getTime() && duration1.end.getTime() <= duration2.end.getTime()) 
			return -1;
		else 
			return 1;
	});
}


/* 
* calculate union array of two time duration array
* @param durationArray1 time map containing 'start' and 'end' properties
* @param durationArray2 time map containing 'start' and 'end' properties
* @return time map containing union duration array, null if no intersection
*/
function calcUnions(durationArray1, durationArray2) {
	var mergedDurations = mergeDurations(durationArray1, durationArray2);
	return unionDurations(mergedDurations);
}

function unionDurations(mergedDurations) {
	var retDurations = [];
	
	// union the array
	var duration = mergedDurations[0], unionDuration;
	for (i = 1; i < mergedDurations.length; i++) {
		
		unionDuration = calcUnion(duration, mergedDurations[i]);
		if (unionDuration != null) {
			duration = unionDuration;
		} else {
			retDurations.push(duration);
			duration = mergedDurations[i];
		}
	}
	
	// push the last
	retDurations.push(duration);
	
	return retDurations;
}

/* 
* exclude a duration from another duration
* @param duration time duration
* @param exclude time duration to be removed
* @return array containing durations after removing the excluded duration
*/
function excludeDuration(duration, exclude) {
	var retDurations = [];
	var intersection = calcIntersection(duration, exclude);
	if (intersection != null) {
		if (intersection.start > duration.start) {
			retDurations.push({'start': duration.start, 'end': intersection.start});
		}
		if (intersection.end < duration.end) {
			retDurations.push({'start': intersection.end, 'end': duration.end});
		}
	} else {
		retDurations.push(duration);
	}
	
	return retDurations;
}


/* This function get days in holiday array
* @param  {Array} holidays         any holiday from holiday list
* @return {Array} array of date
*/
function getDays(holidays) {
	var i;
	var daysArr = [];
	var holiday;
	for (i = 0; i < holidays.length; i++) {
		holiday = holidays[i];
		var startDay = holiday.start;
		
		var days = Math.ceil((holiday.end.getTime() - holiday.start.getTime())/(1000 * 60 * 60 * 24));
		for (j = 0; j <= days; j++) {
			if (daysArr.length == 0) {
				daysArr.push(startDay);
			} else if (!isSameDay(startDay, daysArr[daysArr.length - 1])) {
				daysArr.push(startDay);
			}
			startDay = new Date(startDay.getTime() + 1 * 24 * 60 * 60 * 1000);
		}
	}
	
	return daysArr;
}

/* 
*  check if the two date are the same day
*/
function isSameDay(date1, date2) {
	return (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate());
}


function jsArray(radArray) {
    var array = [];
    for( var k=0;k<radArray.length();k++) {
        array.push(radArray[k]);
    }
    
    return array;
}
/**
 * fix start time
 */
function fixStartTimeByList(start, startList, endList) {
  if(!start) {
    return start;
  }
  
   
  let startTime = start.getTime();
  if(!startList || !endList) {
    return startTime;
  }

  let startTimeList = jsArray(startList).filter(x=>x!=null).map(item =>item.getTime());
  let endTimeList = jsArray(endList).filter(x=>x!=null).map(item =>item.getTime());

  let k = 0;
  for (; k < endTimeList.length; k++) {
    if (endTimeList[k] > startTime) {
      break;
    }
  }

  if(k<startTimeList.length) {
    startTime = Math.max(startTime, startTimeList[k]);
  }

  let diff = 0;
  for (k++; k < endTimeList.length; k++) {
    let newDiff = startTimeList[k] - endTimeList[k - 1];
    if (newDiff > 0) {
      diff += newDiff;
    }
  }

  return startTime + diff;
}

/**
 * Merge Time List
 */
function viewStatus(breachTime, startTime, startTimeList, endTimeList) {
    if(!breachTime || !startTime) return '';
    startTime = fixStartTimeByList(startTime, startTimeList, endTimeList);
    return breachTime.getTime()+';'+startTime;    
}
