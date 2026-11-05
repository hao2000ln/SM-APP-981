// DummyDao for Calendar.
var dummyData = lib.dummydata;
//Calendar Model
var log = getLog('CalendarDAO');


function query(start, end){
  var tps = [];
  var tpdata = dummyData.getTpData();
  var i;
  for(i=0; i<tpdata.length;i++){
    var tp = tpdata[i];
    var s = _getTpStart(tp);
    if(start <= s && end>= _getTpEnd(tp)){
      if (log.isDebugEnabled()) {
        log.debug('Found tp: ' + s +' > ' + start);
      }
      tps.push(tp);
    }
  }
  var entries = [];
  var entryData = dummyData.getEntryData();
  for(i=0;i<entryData.length;i++){
    var entry = entryData[i];
    if(start <= entry.start && end >= entry.end){
      entries.push(entry);
    }
  }
  return {
    "timePeriods":tps,
    "entries": entries
  };
}

function _getTpStart(tp){
  var durs = tp.durations;
  var vs = [];
  var i;
  for(i=0;i<durs.length;i++){
    vs.push(durs[i].start);
  }
  if (log.isDebugEnabled()) {
    log.debug('start '+vs);
  }
  return Math.min.apply(Math, vs);
}

function _getTpEnd(tp){
  var durs = tp.durations;
  var vs = [];
  var i;
  for(i=0;i<durs.length;i++){
    vs.push(durs[i].end);
  }
  return Math.max.apply(Math, vs);
}


//log.debug(query(1351353600000, 1351958400000).entries.length);


function queryFilters(){
  var data = dummyData.getFields();
  return data;
}

function queryFieldValues(field, start, size, filterValue, needCount){
  var data = dummyData.getFieldValues(field, start, size, filterValue, needCount);
    log.debug(data);  
  return data;
}

function queryFilterForm(){
  var data = dummyData.getFilterForm();
  return data;
}