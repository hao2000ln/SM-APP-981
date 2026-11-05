//Calendar DAO 
var log = getLog('CalendarDAO');
// use latest RTE JSON utilities
var JSON = {"stringify": rteJSONStringify, "parse": rteJSONParse};

var keyMap = {"cm3r": "number"};
var ArrayUtil = lib.ArrayUtil;

var _lng = funcs.lng;
var _denull = funcs.denull;
var _str = funcs.str;
var _getFieldCaption = funcs.get_field_caption;

var _displayName=lib.DisplayName;
var _calendarUtilities = lib.CalendarUtilities;
var _convertDateStringOnTZ = lib.tzFunctions.convertDateStringOnTZ;
var _testValue = lib.XML_JSON.textValue;
var _evaluateCondition = _calendarUtilities.evaluateCondition;
var _getEval = _calendarUtilities.getEval;
var underscore = lib.Underscore;
var _ = underscore.require();

var dateSeparator = "/";
if (vars.$G_timezone["date.separator"] != null) {
  dateSeparator = vars.$G_timezone["date.separator"];
}
/**
* The pattern to match column name. A column name must be:
* - At the line beginning, or after a space or one of these characters: '(', '&', '|', ',', '+', '*', '/', '%', '=', '<', '>', '-'
* - Begins with a letter or underscore
* - Consists of letters, numbers, underscore or dot
* - Stop at the line ending, or followed by a space or one of these characters: ')', '&', '|', ',', '+', '*', '/', '%', '=', '#', '<', '>', '~', '-'
*/
var COL_REGEXP = /(^|[\s(&|,+*/%=<>-])([a-zA-Z_][\w.]*)(?=[\s)&|+*/%=#<>~-]|$)/g;
var SQL_KEYWORDS = new Set(['and', 'or', 'not', 'like', 'isin', 'in', 'null', 'true', 'false']);

var COLOR_INDICATOR = {};


function getColorInicator (table, field, value){
	if(COLOR_INDICATOR[field]){
		return COLOR_INDICATOR[field][value];
	}
	
	var fields = ['value', 'fgcolor', 'bgcolor'];
	var sql = 'file="'+table+'" and field="'+field+'"';
	var item = lib.c.$('colorindicatorsetting', SCFILE_READONLY).setFields(fields).select(sql).uniqueResult();
	
	if(!item) {
		return {};
	}
	
	var map = {};
	var k;
	var length = item.value.length();
	for(k=0;k<length;k++) {
		if(item.value[k]!=null) {
			map[item.value[k]] = {fg: item.fgcolor[k], bg:item.bgcolor[k]};
		}
	}
	
	COLOR_INDICATOR[field] = map;
	
	return map[value];
}

function getColorInicatorStyle(table, field, value){
	var color = getColorInicator(table, field, value);
	if(!color){
		return '';
	}
	return 'background-color:'+color.bg+';color:'+color.fg;
}


function hasCollision(item){
	if(item && item['collision']=='T') {
		return true;
	}
	
	return false;
}

function findLatestRiskResult(changeNum){
	var item = lib.c.$('riskresulttotal', SCFILE_READONLY).setFields(['collision']).select('related.id="'+changeNum+'" and current=true').uniqueResult();
	
	if(!item){
		item = {id:null};
	}
	
	return item;
}

function startQueryCalendar(start, end, filter, entryObjects)
{
  vars.$L_calStart = start;
  vars.$L_calEnd = end;
  vars.$L_calFilter = JSON.stringify(filter);
  vars.$L_entryObjects = entryObjects;
  vars.$L_allEntryJson = "";
  vars.$L_allTPMapJson = "";  
  vars.$L_tpids = "";
  vars.$L_overlaps = "";
}

function queryTimePeriods()
{
  var start = vars.$L_calStart;
  var end = vars.$L_calEnd;
  if (!start || !end) {
    return [];
  }
  var timeperiodMapping = getTimeperiodMapping();
  // query time period
  if (timeperiodMapping != null)
  {	
    var filter = {};
    if (vars.$L_calFilter) {
      filter = JSON.parse(vars.$L_calFilter);
    }
    return getTimePeriods(start, end, filter, timeperiodMapping);
  }
  else { 
    return [];
  }
}

function getTimePeriods(start, end, filter, timeperiodMapping) {
	var tpResult = {};
    var tpMore = false;
    var tpList = [];
	var tpoQuery = "tpo.start.date<'"+toSCDateTimeString(end)+"' and tpo.end.date>'"+toSCDateTimeString(start)+"' and tpo.active=true";
	var extendQuery = "";//extendQuery contains mapping default query and filter converted query
	var tpOrderby = "";
	var fields = timeperiodMapping["fields"];
	var sorting = timeperiodMapping["sorting"];
	var sortFieldCount = _lng(_denull(sorting));
	var i;
	if (sortFieldCount > 0)
	{
	  var filedCount = _lng(sorting[0]);
      for (i=0; i<filedCount; i++)
	  {
	    var orderDesc = "asc";
	    if (sorting[1][i]=="1")
	    {
	      orderDesc = "desc";
	    }
		tpOrderby +=" tp."+sorting[0][i]+" "+ orderDesc;
		if (i<(filedCount-1))
		{ 
		  tpOrderby +=",";
		}
      }
	}
	if (tpOrderby!="") {
	  tpOrderby = " tpo.definition.id asc, tpo.start.date asc, " + tpOrderby;
	}
	else {
	  tpOrderby = " tpo.definition.id asc, tpo.start.date asc " ;
	}
	
	var calendarMapping = timeperiodMapping["mapping"];
	var defaultQuery = calendarMapping["defaultQuery"];
	if (defaultQuery != null) {
	  extendQuery += " and (" + appendTableAlias(defaultQuery) + ") ";
	}
		
	var filterQuery = lib.CalendarFilterUtil.buildFilterQueryStr(filter,"timeperiodDefinition");
	if (filterQuery != null && filterQuery != "") {
		extendQuery += " and (" + filterQuery + ") ";
	}

	 // set select tp fields dynamically
    var tpFields = "tp.id as id, tp.name as name, tp.type as type";
    for (i = 0; i < fields.length; i++) {
         if (fields[i] != "id" && fields[i] != "name" && fields[i] != "type") {
             tpFields += ", tp." + fields[i]+" as "+fields[i];
         }
    }
    
    var selQuery = "select " + tpFields + ", tpo.start.date as start.date, tpo.end.date as end.date from timeperiodOccurrence tpo inner join timeperiodDefinition tp on (tp.id=tpo.definition.id) where ";
	var tpSql =  selQuery + tpoQuery  + extendQuery + " order by " + tpOrderby;
	
	var datadict = new SCFile("datadict", SCFILE_READONLY);
	datadict.doSelect("name=\"timeperiodDefinition\"");
	var globalInfo = _calendarUtilities.getGlobalListInfo(datadict, fields);

    var titleFields = calendarMapping["titleFields"];
    var titleFieldSeparator = calendarMapping["titleFieldSeparator"];
    var colors = calendarMapping.colors;
    var defaultColor = calendarMapping.defaultColor;

	var tpFile = new SCFile("timeperiodDefinition");
	var ret = tpFile.doSelect(tpSql);

	var lastid = "";
	var lastDuration;
	var lastTPO;	
	var tpidList = [];
    var allTPMap = {};
	
	var startInterval = getCurrentTimeInMillis();	
	var tpCount = 0;	
	var maxRecords 	= funcs.nullsub(lib.settings.getSettingValue( "Calendar", "maxreturnedTimeperiods" ),50);	
	//backup the $L.file
	vars.$L_fileBackupCalendar = vars.$L_file;
     	
 	try {
 		while (ret == RC_SUCCESS)
 		{
 		  var tpid = tpFile["id"];
 		  if (tpCount > maxRecords-1)
 		  {
 		    tpMore = true;
 		    break;
 		  }
 		  else
 		  {
 			  var startDate = tpFile["start.date"];
 			  var endDate = tpFile["end.date"];
 			  var duration = {start:getClientDateStr(startDate), end: getClientDateStr(endDate)};
 			  if (tpid != lastid) {
 				var tpEntry = {};
 				tpEntry['id'] = tpid;
 				tpEntry['uniqueQuery'] = "id='" + tpid + "'";
 				tpEntry['file'] = "timeperiodDefinition";
 				tpEntry['@type'] = "tp";
 				tpEntry['durations'] = [];
 				tpEntry['durations'].push(duration);
 				tpEntry["title"] = composeTitle(globalInfo, tpFile, titleFields, titleFieldSeparator); // fTP["name"];
 				tpEntry["description"] = ""; //composeTooltip(toollipFieldCaptions, globalInfo, tpFile, tooltipFields); // fTP["name"];
 				tpEntry["color"] = getColor(tpFile, colors, defaultColor);
 		
 			    tpidList.push(tpid);
 				tpList.push(tpEntry);	
 			    allTPMap[tpid] = tpEntry;	    
 			    		
 				lastDuration = duration;
 				lastTPO = tpFile;
 				lastid = tpid;
 			    tpCount++;				
 			  } 
 			  else {
 				// merge to last duration if duration is overlapped
 				if (getTime(duration.start) <= getTime(lastDuration.end) )
 				{
 				  if(getTime(duration.end) > getTime(lastDuration.end))
 				  {	
 				      lastDuration.end = duration.end;
 					  lastTPO["end.date"] = endDate;
 				  }
 				} 
 				else {
 			      lastDuration = duration;
 				  allTPMap[tpid]['durations'].push(lastDuration);
 			      lastTPO = tpFile;
 			    }
 			  }
 			//
 			  queryProtect(startInterval);
 			  ret = tpFile.getNext();
 		  }
 		}
 	}
 	catch(e) {
 	  	vars.$L_file = vars.$L_fileBackupCalendar;
 	  	log.warn("exception during process timeperiod entry:" + e.getMessage());
 	  	throw e;
 	}
 	
 	//restore $L.file.
 	vars.$L_file = vars.$L_fileBackupCalendar;
 	
	vars.$L_tpids = _str(tpidList);
	tpResult.tpMore = tpMore;
	tpResult.tps = tpList;
	return tpResult;
}

function appendTableAlias(query) {
  if (query == null) {
    return null;
  }
  var strValues = findStrValues(query);
  return query.replace(COL_REGEXP, (m, p1, p2, i) => isValidColName(p2, i + p1.length, strValues) ? p1 + "tp." + p2 : m);
}

function findStrValues(query) {
  var values = [];
  var re = new RegExp('"(?:\\\\.|[^\\\\])*?"', 'g');
  var match;

  while ((match = re.exec(query)) !== null) {
    values.push(match);
  }
  return values;
}

function isValidColName(name, offset, strValues) {
  // A keyword is considered as a column name if it is not a SQL keyword and is not in a string value literal
  return !SQL_KEYWORDS.has(name.toLowerCase()) &&
    (strValues.length == 0 || strValues.findIndex(s => offset >= s.index && offset <= s.index + s[0].length) == -1);
}

function queryProtect(startInterval)
{
  var currentInterval = getCurrentTimeInMillis();
  if ( currentInterval-startInterval > 30000 )
  {
	//Throw exception for huge query data. 
	//Message : "Excution timeout, please optimize your filter data and try again."  
    throw funcs.scmsg(1001, "CalendarAPI");
  }
}

function queryCalendarEntries()
{
    var entryResult = {};
    var entryMore =false;
    var start = vars.$L_calStart;
    var end = vars.$L_calEnd;
    if (!start || !end) {
        return [];
    }
    var entryObjs = vars.$L_entryObjects;
    var filter = {};
    if (vars.$L_calFilter) {
        filter = JSON.parse(vars.$L_calFilter);
    }
	var entryQuery = "";
	if (entryObjs!=null && entryObjs!="")
	{   
	    entryQuery+="{";
		var objs = entryObjs.split(",");
		var k;
		var lng = _lng(objs);
		for (k = 0; k < lng;k++)
		{
		  if (objs!="")
		  {
		    entryQuery+="\""+ objs[k] +"\"";
		    if (k < _lng(objs)-1 )
			{
			  entryQuery += ",";
			}
		  }
		}
		entryQuery+="}";
	}
	if (entryQuery != "")
	{
	  entryQuery = "active=true and tableName isin " + entryQuery;
	}
	else 
	{
	  entryQuery = "false";
	}
	
	var allEntries = [];
	var maxRecords 	= funcs.nullsub(lib.settings.getSettingValue( "Calendar", "maxreturnedRecords" ),50);
	var calendarMapping = new SCFile("timeperiodCalendarMapping", SCFILE_READONLY);
	var result = calendarMapping.doSelect(entryQuery);
	var startInterval = getCurrentTimeInMillis();
	var currentCount = 0;
	
	var overlaps = {};
	while (result == RC_SUCCESS) {
	  var tableName = calendarMapping["tableName"];
	  // If user has table view right
	  if (hasFileViewRight(tableName))
	  {
		result = queryEntries(calendarMapping, start, end, filter, maxRecords, currentCount, overlaps);
		var i;
		for (i = 0; i < result.entries.length; i++) {
			allEntries.push(result.entries[i]);
		}
		if (result.morethanmax)
		{ 
		  entryMore = true;
		  break;
		}
		currentCount = currentCount + result.count;
	  }
	  queryProtect(startInterval);	  
	  result = calendarMapping.getNext();
	}
	overlaps = _calendarUtilities.mapToArray(overlaps);
	vars.$L_overlaps = JSON.stringify(overlaps);
	
	entryResult.entryMore = entryMore;
	entryResult.entries = allEntries;
	
	return entryResult;
}

function hasFileViewRight(filename)
{
   var viewRight = false;
   if (filename == "cm3t")
   {
     viewRight = vars.$G_cm3t_environment.view;
   }
   else if (filename == "cm3r")
   {
     viewRight = vars.$G_cm3r_environment.view;
   }
   else if (filename == "probsummary")
   {
     viewRight = vars.$G_pm_environment.view;
   }
   else if (filename == "incidents")
   {
     viewRight = vars.$G_sm_environment.view;
   }
   else if (filename == "rootcause")
   {
     viewRight = vars.$G_rc_environment.view;
   } 
   return viewRight;
}

function queryEntries(calendarMapping, start, end, filter, maxRecords, currentCount, overlaps) {
	var entryList = [];
	var count = 0;
	var morethanmax = false;
	var fileName = calendarMapping.tableName;
	// get all configured fields	
	var fields = calendarMapping.titleFields.toArray(); //mergeArrays(calendarMapping.titleFields, calendarMapping.tooltipFields);
	addToList(fields, _calendarUtilities.extractFieldsFromCondition(calendarMapping.mappingCondition));
	
	addConditionFieldsToList(calendarMapping, fields);
	
	// set sorting according to configuration
	var sorting = getSortFields(calendarMapping["sortby"]);

	// query timeperiod based on id list
	var tpSql= calendarMapping.fieldEndDate+">'"+toSCDateTimeString(start)+"' and "+ calendarMapping.fieldStartDate+"<'"+toSCDateTimeString(end)+"'";
	var defaultQuery = calendarMapping["defaultQuery"];
	if (defaultQuery != null) {
		tpSql += " and (" + calendarMapping["defaultQuery"] + ")";
	}
    
	// add filter
	var filterQuery = lib.CalendarFilterUtil.buildFilterQueryStr(filter,fileName);
	if (filterQuery != null && filterQuery != "") {
		tpSql += " and (" + filterQuery + ")";
	}
    
    var fEntry = new SCFile(fileName, SCFILE_READONLY);
	// set fields according to configuration
	var keyfield = getUniqueKeyField(fileName);
	var fieldsArr = [keyfield, calendarMapping.fieldStartDate, calendarMapping.fieldEndDate];
	
	if(fileName=='cm3r' || fileName=='cm3t') {
		fieldsArr.push('risk.assessment');
		fieldsArr.push('initial.impact');
	}
	
	addToList(fieldsArr, fields);
	fEntry.setFields(fieldsArr);
	if(sorting[0].length > 0)
	{
		fEntry.setOrderBy(sorting[0], sorting[1]);
	}
	
	
	var ret1 = fEntry.doSelect(tpSql);
	if (ret1 == RC_SUCCESS) {
	    var startInterval = getCurrentTimeInMillis();
		
		// get datadict
		var datadict = new SCFile("datadict", SCFILE_READONLY);
		datadict.doSelect("name=\""+fileName+"\"");
		var globalInfo = _calendarUtilities.getGlobalListInfo(datadict, fieldsArr);
    	var mappingCondition = calendarMapping.mappingCondition;
    	var objectExceptions = calendarMapping.exceptions;

    	var titleFields = calendarMapping["titleFields"];
    	var titleFieldSeparator = calendarMapping["titleFieldSeparator"];
    	var colors = calendarMapping.colors;
    	var defaultColor = calendarMapping.defaultColor;
    	
    	var entryIds = [];
    	vars.$L_fileBackupCalendar = vars.$L_file;
    	vars.$L_file = fEntry;
    	
    	try {
	    	do {
	    		if ((count + currentCount) >= maxRecords)
			    {
			      morethanmax = true;
			      break;
			    }
	    		if ((count + currentCount) < maxRecords)
			    {
					var entry = {"file": fileName};
					entry["id"] = fEntry[keyfield];
					
					// Add impact and risk for change and change task
					if(fileName=='cm3r' || fileName=='cm3t') {
					    entry['impact'] = getLabel(globalInfo, 'initial.impact', fEntry['initial.impact']);
					    entry['impactStyle'] = getColorInicatorStyle(fileName, 'initial.impact', fEntry['initial.impact']);
					    entry['risk'] = getLabel(globalInfo, 'risk.assessment', fEntry['risk.assessment']);
					    entry['riskStyle'] = getColorInicatorStyle(fileName, 'risk.assessment', fEntry['risk.assessment']);
					}
					
					// Add collision and riskresult for Change
					if(fileName=='cm3r'){
					    var riskResult = findLatestRiskResult(fEntry[keyfield]);
					    entry['collision'] = hasCollision(riskResult);
					    entry['riskResult'] = riskResult.id;
					}
 					
					entry["uniqueQuery"] = keyfield+"='" + fEntry[keyfield] + "'";
					entry["@type"] = "ce";
					entry["start"] = getClientDateStr(fEntry[calendarMapping.fieldStartDate]);
					entry["end"] = getClientDateStr(fEntry[calendarMapping.fieldEndDate]);    			
					entry["title"] = composeTitle(globalInfo, fEntry, titleFields, titleFieldSeparator); // fEntry["name"];
					entry["description"] = ""; //composeTooltip(toollipFieldCaptions, globalInfo, fEntry, tooltipFields); // fEntry["name"];
					entry["overlapMappingQuery"] = _calendarUtilities.processMappingCondition(mappingCondition, fEntry);
					entry["objectExceptions"] = getObjectExceptions(objectExceptions, null);
					entry["color"] = getColor(fEntry, colors, defaultColor);
					entryList.push(entry);
					entryIds.push(fEntry[keyfield]);
					count++;
				}
				queryProtect(startInterval);
				ret1 = fEntry.getNext();
			} while (ret1 == RC_SUCCESS);
		} catch(e) {
			vars.$L_file = vars.$L_fileBackupCalendar;
			throw e;
		}
		vars.$L_file = vars.$L_fileBackupCalendar;
			
		initOverlaps(overlaps, entryList);	
		
		getMappingTPs(overlaps, fileName, keyfield, entryIds, mappingCondition);	
		queryExistingTimeperiodConflict(overlaps, fileName, entryIds);
	}
	return {"morethanmax": morethanmax, "count": count , "entries": entryList};	
}


/*
* query tooltip for entry&timeperiod
*/
function queryTooltip(fileName, entryId) {
	var tooltip = "";
	var entryQuery = "active=true and tableName=\"" + fileName + "\"";
	var calendarMapping = new SCFile("timeperiodCalendarMapping", SCFILE_READONLY);
	var result = calendarMapping.doSelect(entryQuery);
	if (result == RC_SUCCESS) {
		var fields = calendarMapping.tooltipFields.toArray();
		var datadict = new SCFile("datadict", SCFILE_READONLY);
		datadict.doSelect("name=\""+fileName+"\"");
		var globalInfo = _calendarUtilities.getGlobalListInfo(datadict, fields);
		
		var fEntry = new SCFile(fileName, SCFILE_READONLY);
		var keyfield = getUniqueKeyField(fileName);
		var fieldsArr = [keyfield];
		addToList(fieldsArr, fields);
		fEntry.setFields(fieldsArr);
		var ret1 = fEntry.doSelect(keyfield + "=\"" + entryId + "\"");
		if (ret1 == RC_SUCCESS) {
			var tooltipFields = calendarMapping["tooltipFields"];
			var toollipFieldCaptions = getFieldCaptions(tooltipFields,fileName);
			tooltip = composeTooltip(toollipFieldCaptions, globalInfo, fEntry, tooltipFields);

		}
	}
	return tooltip;
}


/*
API: Query Overlaps
Change Logs,
March 4: 
	Changed by Jason Ye, to retrieve timeperiod conflicts from table instead of calculate evertime.
	The reason is, in 9.34, the timeperiod conflict calcuation happens when insert and update a change,
	no need to calcuate the conflicts everytime.

*/
function queryOverlaps() {
	var overlaps = [];
	if (vars.$L_overlaps != "") {
		overlaps = JSON.parse(vars.$L_overlaps);
		vars.$L_overlaps = "";
	}
	return overlaps;
	
}

function processMappingCondition(exp) {
	if(exp == null || exp == "")
	{
		return "false";	
	}
	var test = function($1, field){  
		return "entry."+field;
	};
	var regToReplace=/([\w|\.]*) in \$L\.file/g;
	var query = exp.replace(regToReplace,test);
	return query;
}

function initOverlaps(overlaps, entryList)
{
    var i;
	for (i=0; i < entryList.length; i++)
	{
		var fEntry = entryList[i];
		var entryid = fEntry["id"];
		var overlap = overlaps[entryid];
		if (overlap == null )
		{
			overlap = {};
			overlap.entryId = entryid;
			overlap.mappingTPIds = [];	
			overlaps[entryid] = overlap;
		}
	}
	return 	overlaps;
}

function getMappingTPs(overlaps, fileName, keyField, entryIds, mappingCondition) 
{
    mappingCondition = processMappingCondition(mappingCondition);
	var mappingTPIds = [];
	if (vars.$L_tpids != "") 
	{
		var mappingQuery = "select distinct tp.id as tpid, " + "entry." + keyField + " as entryid from timeperiodDefinition tp, " + fileName + " entry where tp.id isin " + vars.$L_tpids;
		mappingQuery += " and entry." + keyField + " isin " + _str(entryIds) + "  and ("+ mappingCondition +") ";
		var tpFile = new SCFile("timeperiodDefinition", SCFILE_READONLY);
	
		var retcode = tpFile.doSelect(mappingQuery); 
		while (retcode == RC_SUCCESS)
		{
		  var entryid = tpFile.entryid;
		  var overlap = overlaps[entryid];
	      var tpId = tpFile["tpid"];
		  overlap["mappingTPIds"].push(tpId);				
		  
		  retcode = tpFile.getNext();
		}	
	}
	return 	overlaps;
}

function getMappingTP(overlap, fEntry, extraQuery) 
{
	var mappingTPIds = [];
	if (vars.$L_tpids != "") 
	{
		var mappingQuery = "select tp.id from timeperiodDefinition tp where tp.id isin " + vars.$L_tpids + " and ("+ extraQuery +") ";
		var tpFile = new SCFile("timeperiodDefinition", SCFILE_READONLY);
	
		var retcode = tpFile.doSelect(mappingQuery); 
		while (retcode == RC_SUCCESS)
		{
			var tpId = tpFile["id"];
			mappingTPIds.push(tpId);					  
			retcode = tpFile.getNext();
		}	
	}	
	overlap["mappingTPIds"] = mappingTPIds;	
}

function getConflictTP(overlap, fEntry, extraQuery) 
{
	var conflictNogoTP = [];
	var overlapGoTP = [];
	var missedGoTP = [];
	var tpId;
	
	overlap["conflictNogoTP"] = conflictNogoTP;	
	overlap["overlapGoTP"] = overlapGoTP;	
	overlap["missedGoTP"] = missedGoTP;		

	var start = toSCDateTimeString(fEntry["start"]);
	var end = toSCDateTimeString(fEntry["end"]);
	
	var selectID = "select tp.id ";
	var selectDuration = "select tp.id, tp.type, tpo.start.date as start.date, tpo.end.date as end.date ";

	var mappingQuery = "from timeperiodDefinition tp inner join timeperiodOccurrence tpo on (tp.id=tpo.definition.id) where tpo.active=true and (" + extraQuery + " )"; 
	var overlapQuery =  "tpo.start.date<'"+ end +"' and tpo.end.date>'"+ start +"'"; 
	var insideQuery =  "tpo.start.date<='"+ start +"' and tpo.end.date>='"+ end +"'"; 	
	    
	var tpFile = new SCFile("timeperiodDefinition", SCFILE_READONLY);
	
	var combineQuery = 	selectDuration + mappingQuery + "and (" + overlapQuery
	  +") and ( tp.type=\"nogo\" or tp.type=\"go\") order by tp.type desc, tpo.definition.id asc, tpo.start.date asc";
	  
	var retcode = tpFile.doSelect(combineQuery);
	  
    while ( retcode == RC_SUCCESS  )
    {
		var tpType = tpFile["type"];
		if ( tpType != "nogo" ) {
			break;
		}
        
		tpId = tpFile["id"];
		if(!lib.ArrayUtil.contains(conflictNogoTP, tpId))
		{
			conflictNogoTP.push(tpId);	
		}				  
		retcode = tpFile.getNext();
	}
	
	if ( retcode == RC_SUCCESS  )
    {
        var insideGo = false;
        var startTime = funcs.val(start, 3);
		var endTime = funcs.val(end, 3);
		var lastid = "";	
		var lastDuration;		
		while (retcode == RC_SUCCESS)
		{
			tpId = tpFile["id"];
			var startDate = tpFile["start.date"];
	  		var endDate = tpFile["end.date"];	
	  		
	  		if ( startDate <= startTime && endDate >= endTime )
	  		{
	  		  insideGo = true;
	  		  break;
	  		}
	  		
	  		var duration = {start:startDate, end:endDate};
	  		//If it's a new TP	
			if(tpId != lastid)
			{
				overlapGoTP.push(tpId);
				lastid = tpId;
				lastDuration = duration;
			}
			//If still the same TP
			else
			{							
				// merge the current duration to the last duration if overlapped		
				if (duration.start <= lastDuration.end && duration.end > lastDuration.end) 
				{
				    lastDuration.end = duration.end;
					//Check if the entry is inside a merged duration
					if(lastDuration.start <= startTime && lastDuration.end >= endTime)
					{
						insideGo = true;
						break;
					}					    
				} 
				else
				{
					lastDuration = duration;
				}									
			}
							  
			retcode = tpFile.getNext();
		}
		//If the entry is inside a merged duration, clear the exceed Go TO(overlapGoTP)
		if(insideGo)
		{
			overlap["overlapGoTP"] = [];
		}
 	}
 	else
	{
		var missedGoTPQuery = "select tp.id from timeperiodDefinition tp where tp.type=\"go\"" + " and ("+ extraQuery +") ";
		retcode = tpFile.doSelect(missedGoTPQuery); 
		while (retcode == RC_SUCCESS)
		{
			tpId = tpFile["id"];
			missedGoTP.push(tpId);					  
			retcode = tpFile.getNext();
		}				
	}
	
	localizeTimeperiodConflictType(overlap);	
}


function getUniqueKeyField(tableName)
{	
	// get key field from datadict
	var keyfield;
	var keyFieldArray = _calendarUtilities.getFileUniqueKey(tableName);
	if (keyFieldArray != null) {
		var list = keyFieldArray[0].split(",");
		keyfield = list[list.length-1];
	}
	if (keyfield == null) {
		keyfield = keyMap[tableName];
	}
			
	return 	keyfield;	
}


/*
 get overlapped durations from tp entry
*/
function getOverlappedDuration(tpEntry, start, end, overlapedTimeperiod) {
	var durations = tpEntry.durations;
	var i;
	for (i = 0; i < durations.length; i++) {
		var duration = durations[i];
		if (getTime(duration.start) < getTime(end) && getTime(duration.end) > getTime(start)) { 
			overlapedTimeperiod.durations.push(duration);
		}
	}
}

function getTimeperiodMapping() {
	// get the time period mapping
	var calendarMapping = new SCFile("timeperiodCalendarMapping", SCFILE_READONLY);
	calendarMapping.setFields(["defaultQuery", "titleFields", "titleFieldSeparator", "tooltipFields", "sortby", "colors", "defaultColor"]);
	var result = calendarMapping.doSelect("tableName=\"timeperiodDefinition\" and active=true");
	if (result != RC_SUCCESS) {
		return null;
	}
	// get all configured fields
	var fields = calendarMapping.titleFields.toArray(); //mergeArrays(calendarMapping.titleFields, calendarMapping.tooltipFields);
	addConditionFieldsToList(calendarMapping, fields);
	// set sorting according to configuration
	var sorting = getSortFields(calendarMapping["sortby"]);
	return {"mapping": calendarMapping, "fields": fields, "sorting": sorting};
}

/**
*  merge two arrays to a new one
*
*  	History:
*	2013-02-01, Tian, Shao-Qin - function created
*	
*   @param	 {SM Array}   arr1 - array
*   @param	 {SM Array}   arr2 - array
*	@returns {Array} 	- new array
*/
function mergeArrays(arr1, arr2) {
	var arr = [];
	var lng1 = _lng( _denull(arr1));
	if ( lng1 == null ) {
		lng1 = 0;
	}
	var i;
	for (i = 0; i < lng1; i++) {
		arr.push(arr1[i]);
	}
	var lng2 = _lng( _denull(arr2));
	if ( lng2 == null ) {
		lng2 = 0;
	}
	for (i = 0; i < lng2; i++) {
		if (!inArray(arr2[i], arr)) {
			arr.push(arr2[i]);
		}
	}
	return arr;
}

/**
*  if the array contains the element
*
*  	History:
*	2013-02-01, Tian, Shao-Qin - function created
*	
*   @param	 {String}   elem - value to check
*   @param	 {Array}   arr - array
*	@returns {bool} 	- true if in array, false while not
*/
function inArray(elem, arr) {
    var i;
	for (i = 0; i < arr.length; i++) {
		if (elem == arr[i]) {
			return true;
		}
	}
	return false;
}

function getSortFields(sortArr) {
	// set sorting according to configuration
	var lng = _lng( _denull(sortArr));
	if ( lng == null ) {
		lng = 0;
	}
	
	var sortFields = [];
	var sortTypes = [];
	var k;
	for (k = 0; k < lng; k++) {
		var sortby = sortArr[k];
		sortFields.push(sortby.sortField);
		if (sortby.sortType == "asc") {
			sortTypes.push(SCFILE_ASC);
		}
		else if (sortby.sortType == "dsc") {
			sortTypes.push(SCFILE_DSC);
		}
	}

	return [sortFields, sortTypes];
}


function toSCDateTimeString(dtstr) {
	var temp = dtstr.replace(/-/g, dateSeparator);
	return convertDataOrder( temp, 6, vars.$lo_date_order );
}

function getClientDateStr(date)
{
  var dtStr = _str(date);
  var localDate = convertDataOrder( dtStr,vars.$lo_date_order, 6 );
  var clientStr = localDate.replace(/\//g, "-");
  return clientStr;
}

// add by WuFei for performance
var MMDDYY = 1;
var DDMMYY = 2;
var YYMMDD = 3;
var MMDDYYYY = 4;
var DDMMYYYY = 5;
var YYYYMMDD = 6;

function convertDataOrder( dtstr, oldOrder, newOrder )
{
   if ( oldOrder == newOrder ) {
  	//total 3 seperators in SM: . or / or -
  	if(dtstr != null && dateSeparator != "/") {  	
		if(dateSeparator == ".") {
		  return dtstr.replace(/\./g, "/");
		} 
		if(dateSeparator == "-") {
		  return dtstr.replace(/-/g, "/");
		} 
  	}
  	return dtstr;
  }
  return fromDateObj(toDateObj(dtstr,oldOrder),newOrder);
}

function toFullYear(year) {
	if (year.length == 4) {
		return year;
	}
	if (year < "50") {
		return "20" + year;
	}
	return "19" + year;
}

function toDateObj( dtstr, order )
{
  var dateObj = {};
  var dateTime = "";
  if (dtstr != null && dtstr != "" ){
  	  dateTime = dtstr.split(" ");
	  dateObj.time = dateTime[1];
	  var datePart = dateTime[0].split(dateSeparator);
	  switch( order )
	  {
	    case MMDDYY:
	    dateObj.date = datePart[1];
	    dateObj.month = datePart[0];
	    dateObj.year = toFullYear(datePart[2]);
	    break;
	    case DDMMYY:
	    dateObj.date = datePart[0];
	    dateObj.month = datePart[1];
	    dateObj.year = toFullYear(datePart[2]);
	    break;
	    case YYMMDD:
	    dateObj.date = datePart[2];
	    dateObj.month = datePart[1];
	    dateObj.year = toFullYear(datePart[0]);
	    break;
	    case MMDDYYYY:
	    dateObj.date = datePart[1];
	    dateObj.month = datePart[0];
	    dateObj.year = datePart[2];
	    break;
	    case DDMMYYYY:
	    dateObj.date = datePart[0];
	    dateObj.month = datePart[1];
	    dateObj.year = datePart[2];
	    break;
	    case YYYYMMDD:
	    dateObj.date = datePart[2];
	    dateObj.month = datePart[1];
	    dateObj.year = datePart[0];
	    break;
	  }
	 }
  return dateObj;
}

function fromDateObj( dateObj, order )
{
  var dtstr = "";
  if (dateObj.month !== undefined || dateObj.date !== undefined || dateObj.year !== undefined){
	  switch( order )
	  {
	    case MMDDYY:
	    dtstr = dateObj.month + "/" + dateObj.date + "/" + dateObj.year.substr(2);
	    break;
	    case DDMMYY:
	    dtstr = dateObj.date + "/" + dateObj.month + "/" + dateObj.year.substr(2);
	    break;
	    case YYMMDD:
	    dtstr = dateObj.year.substr(2) + "/" + dateObj.month + "/" + dateObj.date;
	    break;
	    case MMDDYYYY:
	    dtstr = dateObj.month + "/" + dateObj.date + "/" + dateObj.year;
	    break;
	    case DDMMYYYY:
	    dtstr = dateObj.date + "/" + dateObj.month + "/" + dateObj.year;
	    break;
	    case YYYYMMDD:
	    dtstr = dateObj.year + "/" + dateObj.month + "/" + dateObj.date;
	    break;
	  }
	  
	  dtstr += " " + dateObj.time;
	  }
  return dtstr;
}


function getTime(dtstr)
{
  var temp = dtstr.toString(); 
  temp = temp.replace(/-/g, "/"); 
  var jsDate = new Date(Date.parse(temp));
  return jsDate.getTime();
}

function getCurrentTimeInMillis()
{
  var jsDate = new Date();
  return jsDate.getTime();
}

/**
*  compose title according to fields configured
*
*  	History:
*	2013-02-01, Tian, Shao-Qin - function created
*	
*   @param	 {SCFile}   tpFile - time period record
*   @param	 {Array}   titleFields - array
*	@returns {String} - title
*/
function composeTitle(globalInfo, tpFile, titleFields, titleFieldSeparator) {
      var sep = titleFieldSeparator;
      if (sep == null || sep == "") {
            sep = "-";
      }
      sep = " " + sep.replace(/^\s+|\s+$/g, '') + " ";
      
      var title = "";
      var lng = _lng( _denull(titleFields));
      if ( lng == null ) {
            lng = 0;
      }
      var refTable="";
      var fileName=funcs.filename(tpFile);
      var i;
      for (i = 0; i < lng; i++) {
            //Added by Henrry for logical name solution
            refTable=_displayName.getRefTable(titleFields[i], fileName);
            var value=tpFile[titleFields[i]];
            if(refTable!=="" && refTable!==null){
                  value=_displayName.getDisplayNameByLogicalName(value);
            }
            var label = getLabel(globalInfo, titleFields[i], value);
            title += label;
            if (i < lng-1) {
                  title += sep;
            }
      }
      
      return title;
}

/**
*  compose tooltip according to fields configured
*
*  	History:
*	2013-02-01, Tian, Shao-Qin - function created
*	
*   @param	 {SCFile}   tpFile - time period record
*   @param	 {Array}   tooltipFields - array
*	@returns {String} - tooltip
*/
function composeTooltip(toollipFieldCaptions, globalInfo, tpFile, tooltipFields) {
      var sep = "<br>";
      var tooltip = "";
      var lng = _lng( _denull(tooltipFields));
      if ( lng == null ) {
            lng = 0;
      }
      var refTable="";
      var fileName=funcs.filename(tpFile);
      var i;
      for (i = 0; i < lng; i++) {
            //Added by Henrry for logical name solution
            refTable=_displayName.getRefTable(tooltipFields[i], fileName);
            var value = tpFile[tooltipFields[i]];
            if(refTable!=="" && refTable!==null){
                  value=_displayName.getDisplayNameByLogicalName(value);
            }
            var fieldName = toollipFieldCaptions[tooltipFields[i]];
            var label = getLabel(globalInfo, tooltipFields[i], value);
            tooltip += "<b>" + fieldName + "</b>: " + _testValue(label);
            if (i < lng-1) {
                  tooltip += sep;
            }
      }
      
      return tooltip;
}

function getFieldCaptions( fields, filename )
{
  var fieldCaptions = [];
  var lng = _lng( _denull(fields));
  if ( lng == null ) {
	lng = 0;
  }
	
  var i;	
  for (i = 0; i < lng; i++) {
    fieldCaptions[fields[i]] = _getFieldCaption(fields[i], filename);
  }
    
  return fieldCaptions;
}

/*
 build value label pair. if has global list, get the display value from global list; if it's array, build the string from the array.
*/
function getLabel(globalInfo, field, value) {
	var label = null;
	var globallist = globalInfo[field];
	if (globallist != null && value != null) {
		label = globallist[value];
	}
    if (!label) {
		label = lib.ApplyChangeModel.convertToString(value);
	}
	return label;
}


function getObjectExceptions(exceptions, record)
{
	var ret = "";	
	if(exceptions)
	{
		var lng = _lng(exceptions);
		var i;
		for(i = 0; i < lng; i++)
		{
			var condition = exceptions[i]["exceptionCondition"];
			if(_evaluateCondition(condition, record))
			{
				var description = _getEval(exceptions[i]["exceptionDescription"], record);
				if(description && description != "") {
					ret += description + "<br>";
				}
			}		
		}	
	}
	return ret;	
}

/*
 get color for the entry based on color conditions. if any condition met, return the color, otherwise, return default color
 
 @param{file} entry - entry record
 @param{array} colors - color conditons array
 @param{String} defaultColor - default color
 @return{String} color
*/
function getColor(entry, colors, defaultColor) {
	var color;
	var lng = _lng( _denull(colors));
	if ( lng == null ) {
		lng = 0;
    }
	
	var i;	
	for (i = 0; i < lng; i++) {
		var colorItem = colors[i];
		var condition = _str(colorItem.condition);
		vars['$L.file'] = entry;
		lib.Workflow.initVarForCondition(colorItem.conditionXML);
		if (condition != null && _evaluateCondition(condition, entry)) {
			color = colorItem.color;
			break;
		}
	}

	if (color == null) {
		color = defaultColor;
	}
	
	if (color == null || color == "#") {
		color = "#000000"; // if no default color
	}
	if (color.indexOf("#")!=0) {
		color = "#"+color;
	}
		
	return color;
}

/**
 * @public
 * @description  Query the configuration info from apps.
 * @param {string} embed, flag indicating whether it is embedded calendar
 * @returns A json object including some of the cofigured parameters in "Calendar Setting" 
 */ 
function queryConfiguration(embed){
  var embEntryObjs = vars.$embEntryObjects;
  var startDayOfWeek = vars.$lo_operator["first.day"];
  if(!startDayOfWeek)
  {
  	startDayOfWeek = lib.settings.getSettingValue( "Calendar", "startDayOfWeek");
  }
  var timeRange = lib.settings.getSettingValue( "Calendar", "timeRangeDayView");
  var filterRights = {};
  filterRights.addPublicFilter = lib.security.getRights("Calendar Administration","AddPublicFilter")==null?false : true;
  filterRights.deletePublicFilter = lib.security.getRights("Calendar Administration","DeletePublicFilter")==null?false : true;
  filterRights.updatePublicFilter = lib.security.getRights("Calendar Administration","UpdatePublicFilter")==null?false : true;
  var entryObjs = {};
  if (embed === "1" && embEntryObjs != null )
  {
    entryObjs = JSON.parse(embEntryObjs);
  }
  else
  {
    entryObjs = _calendarUtilities.getCalendarMappingTables();
  }
  var todayStr = getToday();
  var dateFormatList = ["mm/dd/yy","dd/mm/yy","yy/mm/dd","mm/dd/yyyy","dd/mm/yyyy","yyyy/mm/dd"];
  var dateFormat = dateFormatList[vars.$lo_date_order-1];
  return {"startDayOfWeek":startDayOfWeek,"timeRange":timeRange,"filterRights":filterRights, "entryObjects": entryObjs, "today":todayStr , "dateFormat":dateFormat , "weekNumber":false};
}

function getSessionTimezone(){
  return vars.$lo_time_zone;
}

/**
*  query filter config for filter form
*
*  	History:
*	2013-03-28, Li, Huan - function created
*	
*	@returns json filter form string
*/
function queryFilterForm(){
  var filterForm = {};
  filterForm.groups=[];
  var panelNames = lib.timeperiodMapping.getCalendarMappingObjects()[0];
  panelNames.push("common");
  var i;
  for (i=0; i<panelNames.length; i++)
  {
    var groupObj = {};
    groupObj.groupName = panelNames[i];
    groupObj.fields = [];
    var calendarFilterEditForm = new SCFile("calendarFilterEditForm", SCFILE_READONLY);
    calendarFilterEditForm.setOrderBy(["order"], [SCFILE_ASC]);
    var query = "active=true and panel=\""+ panelNames[i] +"\"";
    var ret = calendarFilterEditForm.doSelect(query);
    while (ret == RC_SUCCESS)
    {
      var fieldObj = {};
      fieldObj.field = calendarFilterEditForm.fieldId;
      fieldObj.label = calendarFilterEditForm.alternateLabel;
      fieldObj.type = calendarFilterEditForm.type;
      fieldObj.multiSelect = calendarFilterEditForm.multiSelectable ? true : false ;
      groupObj.fields.push(fieldObj);
      ret = calendarFilterEditForm.getNext();
    }
    filterForm.groups.push(groupObj);
  }
  return filterForm;
}

function getToday(){
  return getClientDateStr(new Date());
}


function addToList(target, source) {
	if(_.isEmpty(source)) {
		return;
	}
	var i;
	var j;
	for (i = 0; i < source.length; i++) {
		var exists = false;
		for (j = 0; j < target.length; j++) {
			if (target[j] == source[i]) {
				exists = true;
				break;
			}
		}
		if (exists == false) {
			target.push(source[i]);
		}
	}
}

var conflictTypes = null;
function localizeTimeperiodConflictType(overlap) {
  if ( conflictTypes === null )
  {
    conflictTypes = {"conflictNogoTP":"","overlapGoTP":"","missedGoTP":""};
  
    if(vars.$G_tp_conflicttypes_list == null || vars.$G_tp_conflicttypes_disp == null) {
      log.info("The timeperiod conflict types are not initialized");
    }
    else {
      var conflictTypeKeys = vars.$G_tp_conflicttypes_list;
      var conflictTypeDescs = vars.$G_tp_conflicttypes_disp;
  
      var length = conflictTypeKeys.length();
      var i;
      for( i = 0; i < length; i++ )
      {
  	     var name = conflictTypeKeys[i];
  	     if ( typeof conflictTypes[name] !== "undefined") {
  	         conflictTypes[name] = conflictTypeDescs[i];
  	     }
      }
    }
  }
  
  overlap.conflictNogoTpDesc = conflictTypes["conflictNogoTP"];	
  overlap.overlapGoTpDesc = conflictTypes["overlapGoTP"];	
  overlap.missedGoTpDesc = conflictTypes["missedGoTP"];	
}


/**
To query the existing timeperiod conflicts from database.
@Param {Array} overlap - the array to hold the result
@Param {Object} fEntry - the object needs to be calculate timeperiod conflict

@Return return values are held in overlap object.
	
*/
function queryExistingTimeperiodConflict(overlaps, fileName, entryIds) {
	var FIELD_TP_ID = "tpId";
	var FIELD_CONFLICT_TYPE = "tpType";
	var FILE_TP_CONFLICT = "timeperiodConflict";

	var tpRecord = new SCFile(FILE_TP_CONFLICT, SCFILE_READONLY);
	var resultIndicator = tpRecord.doSelect( "entryId isin " + _str(entryIds) + " and tableName=\"" + fileName + "\"");
	while(resultIndicator == RC_SUCCESS) {
		var conflictTPIDs = tpRecord[FIELD_TP_ID];
		if(conflictTPIDs != null && conflictTPIDs.length() > 0 && conflictTPIDs[0] != null) {
		    var overlap = overlaps[tpRecord["entryId"]];
		    if (overlap != null)
		    {
			  overlap[tpRecord[FIELD_CONFLICT_TYPE]] = conflictTPIDs.toArray();
			  localizeTimeperiodConflictType(overlap);	
			}
		}
		
		resultIndicator = tpRecord.getNext();
	}
}

/**
* This method is speically for delete old Embedded Calendar Configuration for upgrading. It's not for business logics.
* See defect QCCR1E111384.
* Updated on Nov 7, 2014, QCCR1E118159, to remove the old configratuion by IDs instead of Date.
*/
 function removeOldEmbeddedCalendarConfiguration() { 
 	var dbdict = new SCFile("dbdict");
 	var exist = dbdict.doSelect("name=\"calendarFilterPredefined\"");
 	if(exist != RC_SUCCESS) {
 	  return;
 	}
    
    var embeddedCalendarConf = new SCFile("calendarFilterPredefined");
    var currDateOrder = lib.tzFunctions.getLocalDateOrder();
    
    var rc = embeddedCalendarConf.doSelect("id=\"004\" and module=\"probsummary\"");    
    if (rc == RC_SUCCESS) {
        embeddedCalendarConf.doDelete();
    } 
    
    rc = embeddedCalendarConf.doSelect("id=\"003\" and module=\"incidents\"");    
    if (rc == RC_SUCCESS) {
        embeddedCalendarConf.doDelete();
    }
    
    rc = embeddedCalendarConf.doSelect("id=\"005\" and module=\"rootcause\"");    
    if (rc == RC_SUCCESS) {
        embeddedCalendarConf.doDelete();        
    }
 }
 
 /**
 * This method is speically for delete old Enable Calendar from settingsConfig for upgrading. 
 * See defect QCCR1E118159
 */
 function removeEnablementFromCalendarSettings() {
  	var dbdict = new SCFile("dbdict");
 	var exist = dbdict.doSelect("name=\"settingsConfig\"");
 	if(exist != RC_SUCCESS) {
 	  return;
 	}
 	
 	var settingsConfig = new SCFile("settingsConfig");
 	var rc = settingsConfig.doSelect("setting=\"Calendar\" and id=\"enbleCalendar\"");
 	if(rc == RC_SUCCESS) {
 		settingsConfig.doDelete();
 	}
 }
 
 /**
 * query the url of calendar
 * @return {CalendarUrlResponse}
 */
function queryCalendarUrl(){
  var calendarUrlResponse = {};
  if (vars.$G_system_info["nativeCCM"] == true)
  {
    calendarUrlResponse.calendarUrl="calendar.jsp";
    calendarUrlResponse.calendarType="1";
    calendarUrlResponse.returnCode="0";
    calendarUrlResponse.errorMsg="";
  }
  else 
  {
    calendarUrlResponse.calendarUrl="";
    calendarUrlResponse.calendarType="0";
    calendarUrlResponse.returnCode="404";
    calendarUrlResponse.errorMsg=funcs.scmsg(3, "cc");
  }
  return calendarUrlResponse;
}


// add all condition fields to the fields list
function addConditionFieldsToList(calendarMapping, fields) {
	var colors = calendarMapping['colors'];
	var i;
	var length = colors.length();
	for (i = 0; i < length; i++) {
		var selectFields = lib.conditionXmlParser.getFieldsFromCondtionXml(colors[i]['conditionXML']);
		addToList(fields, selectFields);
	} 	
}

