var log = getLog('CalendarService');

var CalendarDao = lib.CalendarDao;
var FilterDao = lib.FilterDao;

var CalendarModel = lib.CalendarModel;
var Util = lib.CalendarUtil;
var RemoteJs = lib.RemoteJavascriptService;

/**
 * Query data for calendar widget. This method takes
 * @param {String} startDate
 * @param {String} endDate
 * @param {Filter} filter
 * @param {string} table
 * @param {string} include
 * @return {String} a JSON format string of QueryResult
 */
function queryCalendar(startDate, endDate, filter, table, include){
  if(!isAccessible()) {
    return;
  }
  /** log.debug(Util.formatString('Calendar.query. startDate = {0}, endDate = {1}, ' +
   * 'filter = {2}, table = {3} include = {4}',
   * startDate, endDate, filter, table, include));
   */
  var start = Util.parseDate(startDate);
  var end =   Util.parseDate(endDate);

  //require end > start
  if (start > end){
    log.error('Error unexpected start > end');
    throw RemoteJs.createError('1000', 'ApplicationError', 'Error unexpected start > end');
  }

  CalendarDao.startQueryCalendar(startDate, endDate, filter, table);
  var result = {};
  if (include) {
    if (include.indexOf('timeperiod') !== -1){
      result.timePeriods = CalendarDao.queryTimePeriods();
    }
    if (include.indexOf('entry') !== -1){
      result.entries = CalendarDao.queryCalendarEntries();
    }
    if (include.indexOf('overlap') !== -1){
      result.overlaps = CalendarDao.queryOverlaps();
    }
  }
  result.timezone = CalendarDao.getSessionTimezone();
  return result;
}

/**
 * query all time periods after CalendarDao.startQueryCalendar
 * @returns {TimePeriod[]}
 */
function queryTimePeriods(){
  if(!isAccessible()) {
    return;
  }
  return CalendarDao.queryTimePeriods();
}

/**
 * query all calendar entries after CalendarDao.startQueryCalendar
 * @returns {CalendarEntry[]}
 */
function queryCalendarEntries(){
  if(!isAccessible()) {
    return;
  }
  return CalendarDao.queryCalendarEntries();
}

/**
 * query all overlaps after CalendarDao.startQueryCalendar
 * @returns {Overlap[]}
 */
function queryOverlaps(){
  if(!isAccessible()) {
    return;
  }
  return CalendarDao.queryOverlaps();
}

/**
 * query tooltip for an entry with id
 * @param {string} fileName
 * @param {string} entryId
 * @returns {string}
 */
function queryTooltip(fileName, entryId) {
  if(!isAccessible()) {
    return;
  }
  return CalendarDao.queryTooltip(fileName, entryId);
}

/**
 * Query all filter infos
 * @return {String[]}
 */
function queryFilterInfos(){
  if(!isAccessible()) {
    return;
  }
  return FilterDao.getFilterInfos();
}

/**
 * Query filter by filter id.
 * If filter id not given, return the default filter.
 * @param {string} id
 * @return {Filter}
 */
function queryFilter(id){
  if(!isAccessible()) {
    return;
  }
  var filter;
  if (!id) {
    filter = FilterDao.getDefaultFilter();
  } else {
    filter = FilterDao.getFilter(id);
  }
  return filter;
}

/**
 * Retrieve value list in a filter field
 * @param {string} fieldName
 * @param {number} start
 * @param {number} limit
 * @param {string} queryString
 * @param {boolean} needCount
 * @return {FieldValue[]}
 */
function queryFieldValues(fieldName, start, limit, queryString, needCount){
  if(!isAccessible()) {
    return;
  }
  return FilterDao.queryFieldValues(fieldName, start, limit, queryString, needCount);
}

/**
 * Save a filter.
 * If filter's id is undefined, create a new filter, otherwise update it
 * @param {Filter} filter
 * @return {String} saved filter's Id
 */
function saveFilter(filter){
  if(!isAccessible()) {
    return;
  }
  var filterId = filter.id;
  if (filterId === undefined || filterId === ''){
    filterId = FilterDao.createFilter(filter);
  } else {
    filterId = FilterDao.updateFilter(filter);
  }
  return filterId;
}

/**
 * Delete a filter.
 * @param {string} filterId
 * @return {Boolean} true if successful deleted
 */
function deleteFilter(filterId){
  if(!isAccessible()) {
    return;
  }
  return FilterDao.deleteFilter(filterId);
}

/**
 * get filter form which includes several groups with fields
 * @return {FilterField[]}
 */
function queryFields(){
  if(!isAccessible()) {
    return;
  }
  return FilterDao.queryFields();
}

/**
 * query the start day of a week
 * @param {string} embed, flag indicating whether it is embedded calendar
 * @return {Configuration}
 */
function queryConfiguration(embed){
  if(!isAccessible()) {
    return;
  }
  return CalendarDao.queryConfiguration(embed);
}

/**
 * query the url of calendar
 * @return {CalendarUrlResponse}
 */
function queryCalendarUrl(){
  return CalendarDao.queryCalendarUrl();
}

/**
 * To check if current user can access JS method.
 * Log error if no access right and return false, otherwise return true.
 * @return {Boolean}
 */
function isAccessible() {
    if(lib.CalendarUtilities.userAccessible()) {        
        return true;
    }
    log.warn("Invalid accessing with user ID : " + vars.$lo_operator["name"]);
    return false;
}

//--------------------- add for ide -------------------------
lib.CalendarService = {
  "queryCalendar": queryCalendar,
  "queryTimePeriods": queryTimePeriods,
  "queryCalendarEntries": queryCalendarEntries,
  "queryOverlaps": queryOverlaps,
  "queryFilterInfos": queryFilterInfos,
  "queryFilter": queryFilter,
  "queryFieldValues": queryFieldValues,
  "saveFilter": saveFilter,
  "deleteFilter": deleteFilter,
  "queryFields": queryFields,
  "querySlm": querySlm,
  "queryStartDayOfWeek": queryConfiguration
};


//--------------------- add for slm view -------------------------
function querySlm() {
  let fileName = funcs.filename(vars.$L_file);

  let keyName = funcs.dbdict_helper("unique.key", fileName)[0];
  let id = vars.$L_file[keyName];

  return lib.SLMVisualize.querySlm(fileName, id);
}
