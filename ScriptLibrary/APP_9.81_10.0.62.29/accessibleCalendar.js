var getClientDateStr = lib.CalendarDao.getClientDateStr;
var toSCDateTimeString = lib.CalendarDao.toSCDateTimeString;
var processMappingCondition = lib.CalendarDao.processMappingCondition;
var _calendarUtilities = lib.CalendarUtilities;
var _sf = system.functions;
var JSON = {"stringify": rteJSONStringify, "parse": rteJSONParse};

// get maintenance tp and its occurence
function getAvailableTPs(record, duration) 
{
	var calendarMapping = getCalendarMapping(system.functions.filename(record));
	var conflictNogoTP = [];
	var overlapGoTP = [];
	var nogoDurations = {};
	var tpDurations = {};
	
	var mergedNogoDurations = [];
	
	var _start = getClientDateStr(duration.start);
    var _end = getClientDateStr(duration.end);
	
	var start = toSCDateTimeString(_start);
	var end = toSCDateTimeString(_end);
	
	var selectID = "select tp.id ";
	var selectDuration = "select tp.id, tp.type, tpo.start.date as start.date, tpo.end.date as end.date ";

	var mappingCondition = _calendarUtilities.processMappingCondition(calendarMapping.mappingCondition, record);
	var mappingQuery = "from timeperiodDefinition tp inner join timeperiodOccurrence tpo on (tp.id=tpo.definition.id) where tpo.active=true"; 
	// var mappingQuery = "from timeperiodDefinition tp inner join timeperiodOccurrence tpo on (tp.id=tpo.definition.id) where tpo.active=true";
	var overlapQuery =  "tpo.start.date<'"+ end +"' and tpo.end.date>'"+ start +"'"; 
	//var insideQuery =  "tpo.start.date<='"+ start +"' and tpo.end.date>='"+ end +"'"; 	
	    
	var tpFile = new SCFile("timeperiodDefinition");
	
	var combineQuery = 	selectDuration + mappingQuery + " and (" + mappingCondition + " )" + " and (" + overlapQuery
	  +") and ( tp.type=\"nogo\" or tp.type=\"go\") order by tp.type desc, tpo.definition.id asc, tpo.start.date asc";
	
	// get all tpid first
	var ret = tpFile.doSelect(combineQuery);
	var tpids = [];
	while (ret == RC_SUCCESS) {
		var tpId = tpFile["id"];
		tpids.push(tpId);
		ret = tpFile.getNext();
	}
	
	tpFile = new SCFile("timeperiodDefinition");
	  
	var isinQuery = "tp.id isin " + _sf.str(tpids);
	var sql = selectDuration + mappingQuery + " and (" + isinQuery + " )" + " and (" + overlapQuery
	  +") and ( tp.type=\"nogo\" or tp.type=\"go\") order by tp.type desc, tpo.definition.id asc, tpo.start.date asc";

	var retcode = tpFile.doSelect(sql);
	
	if ( retcode == RC_SUCCESS  )
    {
        var startTime = system.functions.val(start, 3);
		var endTime = system.functions.val(end, 3);
		
		var lastid = null;
		var durations;	
		
		while (retcode == RC_SUCCESS) {
			var tpId = tpFile["id"]; 
			var startDate = tpFile["start.date"];
	  		var endDate = tpFile["end.date"];	
			var tpType = tpFile["type"];
			
			if (tpType != "nogo") {
				break;
			} 

			var duration = {start:startDate, end:endDate};
			
			if (tpId != lastid) {
				durations = [];
				conflictNogoTP.push(tpId);
				nogoDurations[tpId] = durations;
			}
			durations.push(duration);
			
			lastid = tpId;

			retcode = tpFile.getNext();
		}
		
		mergedNogoDurations = lib.DurationUtils.mergeNogoDurations(nogoDurations);
		
		lastid = "";	
		var lastDuration = null;
		durations = [];
		
		while (retcode == RC_SUCCESS)
		{
			var tpId = tpFile["id"];
			var startDate = tpFile["start.date"];
	  		var endDate = tpFile["end.date"];	
			var tpType = tpFile["type"];
			
			
			var duration = {start:startDate, end:endDate};
			
			if (tpId != lastid) {// new tp
				durations = [];
				overlapGoTP.push(tpId);
				tpDurations[tpId] = durations;
			}
			
			var merged = false;
			if (tpId == lastid) {
				if (duration.start <= lastDuration.end && duration.end > lastDuration.end) {
					lastDuration.end = duration.end;
					merged = true;
				}
			}
			
			if (!merged) {
				durations.push(duration);
			}
			lastid = tpId;
			lastDuration = duration;
										  
			retcode = tpFile.getNext();
		}
 	}
 	
 	var newOverlaoGoTP = [];
 	var newDurations = {};
 	for (var i = 0; i < overlapGoTP.length; i++) {
 		var tpid = overlapGoTP[i];
 		var durations = tpDurations[tpid];
 		
		var filteredDurations = lib.DurationUtils.filterOutNogoOccurences(durations, mergedNogoDurations);
		if (filteredDurations.length > 0) {
			newOverlaoGoTP.push(tpid);
			newDurations[tpid] = filteredDurations;
		}
 	}

	var result = {};
	
	result["conflictNogoTP"] = conflictNogoTP;	
	result["nogoDurations"] = nogoDurations;
	result["overlapGoTP"] = newOverlaoGoTP;	
	result["tpDurations"] = newDurations;
	
	return result;
}

function getAllMappingEntries(record, tpId, duration) {
	var AllEntries = [];
	
	var filterPredefined = lib.CalendarConfiguration.getPredefinedFilter(record);
	var filter = filterPredefined["query"];
	var tables = [];
	
	var tableList = JSON.parse(vars.$embEntryObjects);
	for (var i = 0; i < tableList.length; i++) {
		tables.push(tableList[i]["tableName"]);
	}
	
	var calendarMapping = new SCFile("timeperiodCalendarMapping", SCFILE_READONLY);
	calendarMapping.setFields(["tableName", "mappingCondition", "fieldStartDate", "fieldEndDate"]);
	var sql = "tableName isin " + _sf.str(tables) + " and active=true";
	var result = calendarMapping.doSelect(sql);
	
	while (result == RC_SUCCESS) {
		var keyField = lib.CalendarDao.getUniqueKeyField(calendarMapping.tableName);
		var entries = getTPMappingEntries(calendarMapping, filter, keyField, tpId, duration);
		for (var i = 0; i < entries.length; i++) {
			AllEntries.push(entries[i]);
		}
		result = calendarMapping.getNext();
	}
	return AllEntries;
}

function getTPMappingEntries(calendarMapping, filter, keyField, tpId, duration) {
	var tpids = [];
	tpids.push(tpId);
	vars.$L_tpids = _sf.str(tpids);
	
	var overlaps = {};
	var result = lib.CalendarDao.queryEntries(calendarMapping, getClientDateStr(duration.start), getClientDateStr(duration.end), filter, 99999, 0, overlaps);
	
	var entryIds = [];
	for (var i = 0; i < result.entries.length; i++) {
		var entry = result.entries[i];
		//entryIds.push(entry.id);
		var overlapMappingQuery = entry.overlapMappingQuery;
		var flag = hasMappingTP(overlapMappingQuery, tpId);
		if (flag == true) {
			entryIds.push(entry.id);
		}
	}
	
	return entryIds;
	
	/*lib.CalendarDao.initOverlaps(overlaps, result.entries);
	
	var fileName = calendarMapping.tableName;
	var keyField = lib.CalendarDao.getUniqueKeyField(fileName);
	
	lib.CalendarDao.getMappingTPs(overlaps, fileName, keyField, entryIds, calendarMapping.mappingCondition);
	
	var mappingEntries = [];
	for (var i = 0; i < entryIds.length; i++) {
		var entryid = entryIds[i];
		var overlap = overlaps[entryid];
		if (overlap["mappingTPIds"].length > 0) {
			mappingEntries.push(entryid);
		}
	}
	return mappingEntries;*/
}


function hasMappingTP(overlapMappingQuery, tpId) 
{
	var mappingTPIds = [];
	if (vars.$L_tpids != "") 
	{
		var mappingQuery = "select tp.id from timeperiodDefinition tp where tp.id = \"" + tpId + "\" and ("+ overlapMappingQuery +") ";
		var tpFile = new SCFile("timeperiodDefinition");
	
		var retcode = tpFile.doSelect(mappingQuery); 
		while (retcode == RC_SUCCESS)
		{
			var id = tpFile["id"];
			if (id == tpId) return true;					  
			retcode = tpFile.getNext();
		}	
	}	
	return false;	
}


// get records which intersect with duration
function getMappingEntries(calendarMapping, keyField, tpId, duration) 
{
    var _start = getClientDateStr(duration.start);
    var _end = getClientDateStr(duration.end)
	
	var start = toSCDateTimeString(_start);
	var end = toSCDateTimeString(_end);
    
    var mappingCondition = processMappingCondition(calendarMapping.mappingCondition);
	var entryIds = [];
	if (vars.$L_tpids != "") 
	{
		var insideQuery =  "entry." + calendarMapping.fieldEndDate + ">'"+ start +"' and entry." + calendarMapping.fieldStartDate + "<'"+ end +"'"; 
		var mappingQuery = "select tp.id as tpid, " + "entry." + keyField + " as entryid from timeperiodDefinition tp, " + calendarMapping.tableName + " entry where tp.id =\"" + tpId + "\"";
		mappingQuery += " and ("+ insideQuery +") and (" + mappingCondition + ")";
		var tpFile = new SCFile("timeperiodDefinition");
		
		var retcode = tpFile.doSelect(mappingQuery); 
		while (retcode == RC_SUCCESS)
		{
		  var entryid = tpFile.entryid;
		  entryIds.push(entryid);				
		  
		  retcode = tpFile.getNext();
		}	
	}
	return 	entryIds;
}


function getConflictTpOccurences(record) {
	var result = {};
	result["conflictNogoTPs"] = [];
	result["conflictNogoOccurences"] = [];
	result["overlapGoTPs"] = []
	result["overlapGoOccurences"] = [];
	result["missedGoTPs"] = []
	result["missedGoOccurences"] = [];
	
	var fileName = _sf.filename(record);
	var calendarMapping = getCalendarMapping(fileName);
	var duration = {start:record[calendarMapping.fieldStartDate], end:record[calendarMapping.fieldEndDate]};
	if (duration.start == null && duration.end == null) {
		return result;
	}

	var timeperiodConflict = new SCFile("timeperiodConflict");
	var keyField = lib.CalendarDao.getUniqueKeyField(fileName);
	var entryId = record[keyField];
	var entryQuery = "entryId=\"" + entryId +"\"";
	var ret = timeperiodConflict.doSelect(entryQuery);
	
	var conflictNogoTPs = [];
	var conflictNogoOccurences = [];
	var overlapGoTPs = [];
	var overlapGoOccurences = []
	
	while (ret == RC_SUCCESS) {
		var tpids = timeperiodConflict["tpId"];
		tpids = toJsArray(tpids);
		var occurences = getTPOccurences(tpids, duration);
		
		var tpType = timeperiodConflict["tpType"];
		
		if (tpType == "conflictNogoTP") {
			result["conflictNogoTPs"] = tpids;
			result["conflictNogoOccurences"] = occurences;
		} else if (tpType == "overlapGoTP") {
			result["overlapGoTPs"] = tpids;
			result["overlapGoOccurences"] = occurences;
		} else if (tpType == "missedGoTP") {
			result["missedGoTPs"] = tpids;
			result["missedGoOccurences"] = occurences;
		}

		ret = timeperiodConflict.getNext();
	}
	
	return result;
}

function toJsArray(smArray) {
	var result = [];
	for (var i = 0; i < smArray.length(); i++) {
		if (smArray[i]) result.push(smArray[i]);
	}
	return result;
}

function getTPOccurences(tpids, start, end) {
	var result = [];
	for (var i = 0; i < tpids.length; i++) {
		var tpid = tpids[i];
		if (tpid != null) {
			var occurArr = calculateOccurences(tpid, start, end);
			result.push(occurArr);
		}
	}
	return result;
}


/**
 * calculate occurences for a time period within duration or intersection with duration
 **/
function calculateOccurences(tpId, duration) {
    var _start = getClientDateStr(duration.start);
    var _end = getClientDateStr(duration.end)
	
	var start = toSCDateTimeString(_start);
	var end = toSCDateTimeString(_end);

	var timeCondition = "start.date<'"+end+"' and end.date>'"+start+"'";
	var tpSql = "definition.id=\"" + tpId + "\" and " + timeCondition + " and active=true";
	
	var tpoFile = new SCFile("timeperiodOccurrence", SCFILE_READONLY);
	tpoFile.setFields(['start.date', 'end.date']);
	tpoFile.setOrderBy(['start.date'], [SCFILE_ASC]);
	var ret = tpoFile.doSelect(tpSql);
	
	var occurences = [];
	while (ret == RC_SUCCESS) {
		var duration = {start:tpoFile["start.date"], end:tpoFile["end.date"]};
		occurences.push(duration);
		ret = tpoFile.getNext();
	}
	
	return occurences;
}

/**
*  get timeperiodCalendarMapping record
*	
*   @param	 {SCFile}   record - entry record
*	@return	 {SCFile}   record - timeperiodCaledarMapping
*/
function getCalendarMapping(tableName){
	var calendarMapping = new SCFile("timeperiodCalendarMapping",SCFILE_READONLY);
	calendarMapping.setFields(["mappingCondition", "calculateCondition", "fieldStartDate", "fieldEndDate"]);
    var query = "tableName = \""+ tableName + "\" and active=true";
    var CalendarMappingRecord = calendarMapping.doSelect(query);
	if (CalendarMappingRecord != RC_SUCCESS){
		return null;
	}
	return calendarMapping;
}


function isAccessibleMode() {
	var webUrl = system.functions.get_web_url();
	
	if (webUrl.endsWith("accessible.do")) return true;
	else return false;
	
}