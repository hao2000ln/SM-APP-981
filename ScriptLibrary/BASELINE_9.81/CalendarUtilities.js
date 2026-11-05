var _str = funcs.str;
var _type= funcs.type;
var _syseval = funcs.parse_evaluate;
/*
 process mapping condition. 1. remove " in $L.file"; 2. replace field in $L.mapping with value of entry
 
 @param{String} exp - condition expression
 @param{file} entry - entry record
*/
function processMappingCondition(exp, entry) {
	if(exp == null || exp == "")
	{
		return "false";	
	}
	var test = function($1, field){
	    var retPhase = "";
	    var value = entry[field];
	    if (value==null)
	    {
	      return "NULL";
	    }
	    
	    var type = _type(value);
	    var strValue = _str(entry[field]);
	    if (type===2)
	    {
	      retPhase = "\""+strValue+"\"";
	    }
	    else if (type===3)
	    {
	      retPhase = "\'"+strValue+"\'";
	    }
	    else
	    {
	      retPhase = strValue;
	    }
		return retPhase;
	};
	var regToReplace=/([\w|\.]*) in \$L\.file/g;
	var query = exp.replace(regToReplace,test);
	return query;
}

/*
* extract field list from exp
*/
function extractFieldsFromCondition(exp) {
	var fields = [];
	if(exp == null || exp == "") {
		return fields;
	}
	
	var test = function($1, field) {
		fields.push(field);
	};
	var regToReplace=new RegExp("(([\\w|\\.])*) in \\$L\.file","gi");
	var query = exp.replace(regToReplace,test);
	
	return fields;
}


/*
 get global list info
*/
function getGlobalListInfo(datadict, fields) {
	var info = {};
	var i;
	for (i = 0; i < fields.length; i++) {
		var field = fields[i];
		var globallistName = getGlobalListByField(datadict, field);
		if (globallistName != null && !info[field]) {
			var globallist = new SCFile("globallists", SCFILE_READONLY);
			globallist.setFields(["list.variable","display.variable"]);
			var rc = globallist.doSelect("name=\"" + globallistName + "\"");
			
			if (rc == RC_SUCCESS) {
				var listvariable = globallist["list.variable"];
				var dispvariable = globallist["display.variable"];
				
				var values = lib.globalListTools.getGlobalListValue(listvariable);
				var labels = null;
				if (dispvariable == null || lib.SysUtil._trimStr(dispvariable) == "")
				{
				  labels = values;
				}
				else 
				{
				  labels = lib.globalListTools.getGlobalListValue(dispvariable);
				  if (labels==null) {
				    labels = values;
				  }
				} 
				info[field] = convertToMap(values, labels);
			}
		}
	}
	
	return info;
}

/*
 get global list from datadict by field name
 @param datadict - datadict file
 @param field - field name
*/
function getGlobalListByField(datadict, field) {
	var fields = datadict.fields;
	var globallist = datadict.globallist;
	var lng = funcs.lng( funcs.denull(fields));
	if ( lng == null ) {
		lng = 0;
	}
	
	var i;
	for (i = 0; i < lng; i++) {
		var fld = fields[i];
		if (fld == field) {
			return globallist[i];
		}
	}
	
	return null;
}

function convertToMap( names, values )
{
  var map = {};
  if (names != null && values != null) {
	  var i, lng = names.length();
	  for (i = 0; i < lng; i++) {
	    if (names[i] != null) {
	    	map[names[i]] = values[i];
	    }
	  }
  }
  return map;
}

function mapToArray(map)
{
  var array = [];
  var name;
  for(name in map)
  {
    if( map.hasOwnProperty(name)) {
      array.push(map[name]);
    }
  }
  
  return array;
}

/*
 @param {String} cond - condition string
 @param {String} condXml
 @param {file} record - file
 
 @return true/false
*/
function evaluateConditionWithXml(cond, record, condXml) {
	if(!cond)
	{
		return false;	
	}
	
	if ( record != null )
	{
	  //backup the original variables
	  vars.$L_file_backup = vars.$L_file;
	  vars.$L_file = record;
	}
	if ( typeof cond !== "string") {
	  cond = _str(cond);
	}
	  
	cond = cond.replace(/\"/g, '\\"');	
	var script=" $L.active=evaluate(parse(\""+cond+"\", 4))";
	
	if(condXml) {
		lib.Workflow.initVarForCondition(condXml);
	}
	
	_syseval(script, 11);
	//restore the original variables
	if ( record != null ) {
	  vars.$L_file = vars.$L_file_backup;
	}
	return vars.$L_active;
}

/*
 evaluate condition
 
 @param {String} cond - condition string
 @param {file} record - file
 
 @return true/false
*/
function evaluateCondition(cond, record) {
	return evaluateConditionWithXml(cond, record, null);
}

/** 
*     Get the primary key of a specified file.
*
*     @param {string} fileName - The file name
*     @returns {Array of string} The primary key
*/
function getFileUniqueKey(fileName)
{
    return lib.dbdictHelper.getUniqueKey(fileName);
}


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 
 dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
 return: Saturday, June 9th, 2007, 5:46:21 PM
 m/dd/yy
 
 see: http://blog.stevenlevithan.com/archives/date-time-format
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) {
			   val = "0" + val;
			}
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) {
		    throw SyntaxError("invalid date");
		}

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

function formatDate(date, format) {
	return dateFormat(date, format);
}

// For convenience...

function getDefaultEntryObjects(file)
{
  var tmpFile = new SCFile("calendarFilterPredefined");
  funcs.fduplicate(tmpFile, file);
  file.tableList = [] ;
  var tableList = tmpFile.tableList;
  var mappingObjs = getCalendarMappingTables();
  var i, length = funcs.lng(mappingObjs);
  for (i = 0 ; i < length ; i++)
  {
    var objects = new SCDatum();
    objects.setType(9);
    objects.push(getEntrySelected(mappingObjs[i].tableName, tableList));
    objects.push(mappingObjs[i].tableName);
    objects.push(mappingObjs[i].displayName);
    file.tableList.push(objects);
  }
}

function getEntrySelected(objname,tablelist)
{
  var ret = false;
  var i, length = funcs.lng(funcs.denull(tablelist));
  for (i = 0 ; i < length ; i++)
  {
    if (tablelist[i].tableName == objname)
    {
      return tablelist[i].tableCheck;
    }
  }
  return ret;
}

function getPredefinedEntryObjectsStr(file)
{
  var ret = ""; 
  var entryObjs = [];
  var tablelist = file.tableList;
  var listlen = funcs.lng(funcs.denull(tablelist));
  var i;
  for (i = 0 ; i < listlen; i++)
  {
    var entryObj = {};
    if (tablelist[i].tableCheck)
    {
      entryObj.tableName = tablelist[i].tableName;
      entryObj.displayName = tablelist[i].tableCaption;
      entryObjs.push(entryObj);
    }
  }
  ret = lib.JSON.json().stringify(entryObjs);
  return ret; 
}

function getCalendarMappingTables()
{
  var entryObjs = [];
  var calendarMapping = new SCFile("timeperiodCalendarMapping", SCFILE_READONLY);
  calendarMapping.setFields(["tableName"]);
  var result = calendarMapping.doSelect("tableName~=\"timeperiodDefinition\" and active=true");
  while (result == RC_SUCCESS) {
	 var entryObj = {};
	 entryObj.tableName = calendarMapping["tableName"];
	 entryObj.displayName = funcs.scmsg(calendarMapping["tableName"],"tablename");
	 entryObjs.push(entryObj);
	 result = calendarMapping.getNext();
  }
  return entryObjs;
}

/**
 * Get value data for queried filter filed.
 * @param {String} globallistName
 * @return {values} values: {"values":["a","b","c"] , "labels": ["A","B","C"]}
 */
function getValuesFromGL(globallistName, values)
{
  var globallist = new SCFile("globallists", SCFILE_READONLY);
  globallist.setFields(["list.variable","display.variable"]);
  var rc = globallist.doSelect("name=\"" + globallistName + "\"");
  if (rc == RC_SUCCESS) 
  {
	var listvariable = globallist["list.variable"];
	var dispvariable = globallist["display.variable"];
	var valuelist = lib.globalListTools.getGlobalListValue(listvariable);
	var labels = null;
	if (dispvariable == null || lib.SysUtil._trimStr(dispvariable) == "")
	{
	  labels = valuelist;
	}
	else 
	{
	  labels = lib.globalListTools.getGlobalListValue(dispvariable);
	  if (labels==null) {
	      labels = valuelist;
	  }
	}
	if (!valuelist) {
	    valuelist = labels;
	}
	var i, length = funcs.lng(valuelist);
	for (i = 0; i<length;i++)
	{
	  values.values.push(valuelist[i]);
	  values.labels.push(labels[i]);
	}
  }
  return values;
}

/**
 * Get value data for queried filter filed.
 * @param {String} rad expression
 * @return {values} values: {"values":["a","b","c"] , "labels": ["A","B","C"]}
 */
function getValuesFromRADExp(exp, values)
{
  if (!exp || exp=="") {
    return values;
  }
  else 
  {
    var evalValue = getEval(exp);
    if (!evalValue || lib.SysUtil._trimStr(evalValue) == "") {
        return values;
    }
    else 
    {
      var infos = lib.JSON.json().parse(evalValue);
      var valuelist = infos.values;
      var labels = infos.labels;
      var i, length = funcs.lng(valuelist);
      for (i = 0; i<length;i++)
	  {
	    values.values.push(valuelist[i]);
	    values.labels.push(labels[i]);
	  }
      return values;
    }
  }
}

function getEval(exp, file)
{
  // return if like <Null>
  if (/^<.*>$/.test(exp)) {
      return exp;
  }
  
  var evalValue = null;
  if (exp)
  {
    exp = _str(exp);
    if (exp.toLowerCase()=="null") {
      return exp;
    }
    var script=" $L.result="+exp;
    var validExp = funcs.isExpressionValid(script,11);
    if (validExp)
    {
      if (file)
      {
        _syseval("$L.file.backup = $L.file", 11);
        vars.$L_file = file;
      }
      _syseval(script, 11);
      evalValue = vars.$L_result;
      if (file)
      {
        _syseval("$L.file = $L.file.backup", 11);
      }
      if (evalValue)
	  {
	    var dataType = _type(evalValue);
	    if (dataType == 3)
	    {
	      var dtStr = _str(evalValue);
	      var localDate = lib.tzFunctions.convertDateStringOnTZ(dtStr, vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, vars.$lo_date_order);
	      evalValue = localDate;
	    }
	  } else {
	  }
    }
    else 
    {
      evalValue = exp;
    }
  }
  return evalValue;
}

function getDateTimeEval(exp, file)
{
  var evalValue = null;
  if (exp)
  {
    exp = _str(exp);
    if (exp.toLowerCase()=="null") {
      return exp;
    }
    var script=" $L.result="+exp;
    var validExp = funcs.isExpressionValid(script,11);
    if (validExp)
    {
      if (file)
      {
        _syseval("$L.file.backup = $L.file", 11);
        vars.$L_file = file;
      }
      _syseval(script, 11);
      evalValue = vars.$L_result;
      vars.$L_result = null;
      if (file)
      {
        _syseval("$L.file = $L.file.backup", 11);
      }
      if (evalValue)
	  {
	    var dataType = _type(evalValue);
	    if (dataType == 3)
	    {
	      return evalValue;
	    }
	  }
    }
    else 
    {
      return null;
    }
  }
  return null;
}

/**
 * Get value data for queried filter filed.
 * @param {String} valueField
 * @param {String} displayField
 * @param {String} queryTable
 * @param {String} query
 * @param {String} filterQuery
 * @param {number} start
 * @param {number} size
 * @return {values} values: {"values":["a","b","c"] , "labels": ["A","B","C"]}
 */
function getFiledValuesFromQuery( valueField, displayField, queryTable, query, 
                                     sortField, filterQuery, start, size, infos)
{
  var allValues = {};
  allValues.values = [];
  if ((isEmpty(valueField) && isEmpty(displayField)) || isEmpty(queryTable)) {
    return {};
  }
  else 
  {
    if (isEmpty(displayField) && !isEmpty(valueField)) {
      displayField = valueField;
    }
    else if (isEmpty(valueField) && !isEmpty(displayField)) {
      valueField = displayField;
    }
    
    var table = new SCFile(queryTable, SCFILE_READONLY);
    table.setFields([valueField, displayField]);
    if (!isEmpty(sortField))
    {
      table.setOrderBy([sortField], [SCFILE_ASC]);
    }
    var tmpquery = "";
    if (!isEmpty(query))
    {
      tmpquery += query;
    }
    if (!isEmpty(filterQuery))
    { 
	  if (!isEmpty(tmpquery))
	  {
	    tmpquery += " and ";
	  }
	  filterQuery = filterQuery.replace(/(\\)/g,"\\\\");
	  tmpquery += displayField + " like \"*" + filterQuery + "*\"";
    }
    if (isEmpty(tmpquery)) {
      tmpquery = "true" ;
    }
    var count = table.doCount(tmpquery);
    var values = [];
	var labels = [];
	if (filterQuery && filterQuery!="")
	{   
      var tmpreg = lib.CalendarFilterUtil.convertQueryToRegexp(filterQuery);
	  var tmpvalues = infos.values;
	  var tmplabels = infos.labels;
	  var j, length = funcs.lng(tmpvalues);
	  for (j = 0; j < length; j++)
	  {
	    var tmpText = "";
	    if (tmplabels[j] && tmplabels[j]!="") {
          tmpText = tmplabels[j];
        }
        else { 
          tmpText = tmpvalues[j];
        }
        var ret = tmpText.match(tmpreg);
        if (ret)
        {
          values.push(tmpvalues[j]);
          labels.push(tmplabels[j]);
        }
      }
    }
    else 
    {
      values = infos.values;
      labels = infos.labels;
    }
    var selfdefinedCount = funcs.lng(values);
    if (start >= selfdefinedCount) {
      start = start - selfdefinedCount;
    }
    allValues.valueCount = count + selfdefinedCount;
    if (size == 0 ) 
    {
      start = 0;
      tmpCount = selfdefinedCount;
    }
    else 
    {
      tmpCount = start + Math.min(size, selfdefinedCount - start);
    }
    var z;
    for (z = start;  z < tmpCount ; z++)
    {
      var valueObj = {};
	  valueObj.value = values[z];
	  valueObj.text = labels[z];
      allValues.values.push(valueObj);
    }
    if (funcs.lng(allValues.values)>0 && size!=0)
    {
      start = 0;
      size = Math.max(0, size - funcs.lng(allValues.values));
      if (size == 0)
      {
        return allValues;
      }
    }
    if (!validFieldInFile(valueField,queryTable) || !validFieldInFile(displayField,queryTable))
    {
      allValues.valueCount = selfdefinedCount;
      return allValues;
    }
    var rc = table.doSelect(tmpquery);
    var i = 0; 
    while (rc==RC_SUCCESS)
    {
      var valueData = table[valueField];
      var dispData = table[displayField];
      var valueDataType = _type(table[valueField]);
	  if (valueDataType == 3)
	  {
	    var valueDtStr = _str(table[valueField]);
	    valueData = lib.tzFunctions.convertDateStringOnTZ(valueDtStr, vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, vars.$lo_date_order);
	  }
	  var dispDataType = _type(table[displayField]);
	  if (dispDataType == 3)
	  {
	    var dispDtStr = _str(table[displayField]);
	    dispData = lib.tzFunctions.convertDateStringOnTZ(dispDtStr, vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, vars.$lo_date_order);
	  }
      if (size == 0 || ( start<=i && i <= start + size - 1 ))
      {
        var valueObj = {};
	    valueObj.value = _str(valueData);
	    valueObj.text = _str(dispData);
        allValues.values.push(valueObj);
      }
      else if (i > start + size - 1)
      {
        break;
      }
      i++;
      rc = table.getNext();
    }
  }
  return allValues;
}

function validFieldInFile(fieldname, filename)
{
  if (!isEmpty(fieldname))
  {
    var dict = new SCFile("datadict", SCFILE_READONLY);
    var query = "name=\""+ filename +"\"";
    var ret = dict.doSelect(query);
    if (ret == RC_SUCCESS)
    {
      var i, length = funcs.lng(dict.fields);
      for (i=0; i < length; i++)
      {
        if (dict.fields[i] == fieldname)
        {
          return true;
        }
      }
    }
    return false;
  }
  else {
    return false;
  }
}

function isEmpty(value)
{
    if (!value || lib.SysUtil._trimStr(value)=="") {
        return true;
    }
    else {
        return false;
    }
}


/**	
*   This fuction is to remove "Enalbe Calendar" checkbox from Calendar Settings.
**/
function removeEnableCalendarFlag() {
    var settingID="enbleCalendar";
    
    var settingConfig = new SCFile("settingsConfig");
    var query = "id=\"" + settingID + "\"";
    
    var settingConfigRecord = settingConfig.doSelect(query);
    
    if (settingConfigRecord == RC_SUCCESS){
        settingConfig.doDelete();
    } 
}

/**
 * check if the current user has rights to retrieving calendar relative data.
 * it is for web access right check only.
 * @return {Boolean}
 */
 function userAccessible() { 
	var isCalendarEnabled = (vars.$G_system_info["nativeCCM"] == "true" 
		|| vars.$G_system_info["nativeCCM"] == true);
	if(!isCalendarEnabled) {
	    return false;
	}
	
	var underscore = lib.Underscore;
	var _ = underscore.require();
	
	if(vars.$lo_accessible_result == null) {
		var menu=new SCFile("menu", SCFILE_READONLY);
		menu.setFields(["description", "condition"]);
		
		var rc = menu.doSelect("name=\"" + vars.$lo_home + "\"", SCFILE_READONLY);		
		if(rc == RC_SUCCESS) {
			var desc = menu["description"];
			var cond = menu["condition"];
			
			if(desc != null) {
				var descArray = desc.toArray();
			}
			if(cond != null) {
				var condArray = cond.toArray();
			}
			
			if(descArray.length == condArray.length) {			
				var conditionIndex = _.indexOf(descArray, "Calendar");
				var condition = condArray[conditionIndex];
				try {				
					vars.$lo_accessible_result = funcs.parse_evaluate(condition, 4);
				} catch(ex) {
					log.error("exception during checking access right for Calendar - " + ex.toString());
				}
			}			
		}	
	}
		
	return vars.$lo_accessible_result;
 }