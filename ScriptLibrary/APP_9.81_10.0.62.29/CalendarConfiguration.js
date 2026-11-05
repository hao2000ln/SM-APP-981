/**
*  get predefined filter field for specified module, and parse to client
*
*  	History:
*	2013-01-30, Tian, Shao-Qin - function created
*	2013-04-01, Xie, Xin - function updated
*	2013-04-09, Li, Huan - function updated (convert query string to filter json string)
*  @file {Object}    - vars.$file
*  @returns {Dict} 	- {"query": string, "date": timestamp}
*/

function getPredefinedFilter(file){
	var predefinedFilter = new SCFile("calendarFilterPredefined", SCFILE_READONLY);
	predefinedFilter.setFields(["query","startDate","condition","conditionXML","defaultview","tableList"]);
	var module = system.functions.filename(file);
	var ret = {"query":{}, "date":getClientDateStr(new Date()), "view":"week"};
	var result = predefinedFilter.doSelect("module=\""+module+"\"and active=True");
	while (result == RC_SUCCESS) {
		var startdate = file[predefinedFilter["startDate"]];
		vars.$embEntryObjects = lib.CalendarUtilities.getPredefinedEntryObjectsStr(predefinedFilter);
		var condition = system.functions.str(predefinedFilter.condition);
		var conditionXml = predefinedFilter.conditionXML;
		
		if (condition == null || lib.CalendarUtilities.evaluateConditionWithXml(condition, file, conditionXml)) {
		    var filter = lib.CalendarFilterUtil.convertPredefinedQuery(predefinedFilter.query, file);
			ret["query"] = system.library.JSON.json().stringify(filter);
			if (predefinedFilter["defaultview"] != null && predefinedFilter["defaultview"]!="")
			{
			  ret["view"] = predefinedFilter["defaultview"];
			}
			if (startdate != null && system.functions.type(startdate) == 3){
				ret["date"] = getClientDateStr(startdate);
			}
			return ret;
		}
		result = predefinedFilter.getNext();
	}
	return ret;
}

function getClientDateStr(date)
{
  var localDate = lib.tzFunctions.convertDatetoString(date, 6);
  var clientStr = localDate.replace(/\//g, "-");
  return clientStr;
}


function isCalendarEnabled() {
	return system.functions.nullsub(system.functions.val(lib.settings.getSettingValue( "Calendar", "enbleCalendar"),4), false);
}

