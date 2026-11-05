//Calendar Model
var log = getLog('CalendarModel');

function buildFilterField(filterStr) {
  var pair = filterStr.split('=');
  if (pair.length != 2) {
    log.warn('Bad filter string format:' + filterStr);
    return null;
  }
  var values = [];
  var valueStrs = pair[1].split(';');
  var i;
  for (i = 0; i < valueStrs.length; i++) {
    values.push(decodeURIComponent(valueStrs[i]));
  }
  return {
    field: pair[0],
    value: values
  };
}

function Configuration(){
  return {
    startDayOfWeek: '0',
    timeRange: '6',
    today: '',
    table: '',
    filterRights: '',
    entryObjs: [{
      tableName: '',
      displayName: ''
    }]
  };
}


function TimePeriod(){
  return {
    id: '1',
    file: 'timeperiod',
    description: 'desc',
    color: '#ffffff',
    title: 'title',
    uniqueQuery: '',
    /** @type {Duration[]} */
    durations: []
  };
}

function Duration(){
  return {
    start: '2013-05-23 15:00:00',
    end:   '2013-05-24 18:00:00'
  };
}

function CalendarEntry(){
  return {
    id: '1',
    file: 'timeperiod',
    description: 'desc',
    color: '#ffffff',
    title: 'title',
    uniqueQuery: '',
    start: '2013-04-15 02:00:00',
    end: '2013-04-18 12:00:00'
  };
}

function Overlap(){
  return {
    entryId: '1',
    /** @type {TimePeriod} **/
    timePeriods: []
  };
}

//--------------------- add for ide -------------------------
lib.CalendarModel = {
  "buildFilterField": buildFilterField
};