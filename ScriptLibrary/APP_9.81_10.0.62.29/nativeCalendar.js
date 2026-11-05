//return calendar url record by displayscreen
function getCalendar(file){
	vars.$calendar_show=false;
	vars.$change_calendar_show=false;
	var tableName = funcs.filename(file);
    if (vars['$G.system.info']['nativeCCM']==true) {
    	var enableCalendar = isEmbeddedCalendarActive(tableName);
    	if (enableCalendar == true){
			var ticketIsNotClosed = isTicketIsNotClosed(file,tableName);
	    	if (ticketIsNotClosed==true){ 
			vars.$calendar_show = true;
			vars.$change_calendar_show=true;
			var predefined_filter = lib.CalendarConfiguration.getPredefinedFilter(file);
			//fix QCCR1E109933, the label contains single quote in French environment which needs to be escaped.
			var filterStr = predefined_filter['query'];
			if(filterStr != null && funcs.type(filterStr) == 2) {
				filterStr = lib.StringUtil.escapeAllStr(filterStr);
				filterStr = filterStr.replace(/'/g, "\\\'");
			}
			//end of fixing QCCR1E109933
			vars.$predefined_query_string = filterStr;
			vars.$start_date = predefined_filter['date'];
			vars.$default_view = predefined_filter['view'];
			}
		}
	} 
}

/** if active is true, the embedded Calendar will be visible, otherwise, it will be invisible
* @param {tableName} - the tableName of module
*/
function isEmbeddedCalendarActive(tableName){
	var predefinedFilter = new SCFile("calendarFilterPredefined", SCFILE_READONLY);
	predefinedFilter.setFields(["id"]);
	var result = predefinedFilter.doSelect("module=\""+ tableName +"\" and active=true");
	if (result == RC_SUCCESS){
		return true;
	}
	return false;
}

/** judge the ticket of incidents,interaction,change,change task,problem is closed or not
* @param {file} -  entry record
* @param {tableName} - the table name of entry record
*/
function isTicketIsNotClosed(file,tableName){	
	if (((tableName=="cm3r" || tableName=="cm3t" || tableName=="rootcause") && file.open==true) 
        || (tableName=="probsummary" && file.flag==true) || (tableName=="incidents" && file.open!="Closed")){
			return true;
			}
	return false;
}