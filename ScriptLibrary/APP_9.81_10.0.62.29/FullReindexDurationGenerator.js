var logger = getLog('FullReindexDurationGenerator');

var dateOrder = {
  '1':'mm/dd/yy', 
  '2':'dd/mm/yy', 
  '3':'yy/mm/dd', 
  '4':'mm/dd/yyyy', 
  '5':'dd/mm/yyyy', 
  '6':'yyyy/mm/dd'
};

function convertDate(d) {
  return parseDate(d);
}

function parseDate(date) {
  return lib.tzFunctions.convertDatetoStringonTZ(date, vars.$lo_date_order, vars.$lo_time_zone);
}

function parseDate2(date) {
  var format = dateOrder[vars.$lo_date_order] + ' hh:mm:ss';
  var d = date;
  var dd = d.getUTCDate();
  var mm = d.getUTCMonth();
  var yy = d.getUTCFullYear();
  var hh = d.getUTCHours();
  var mmm = d.getUTCMinutes();
  var ss  = d.getUTCSeconds();
  
  if(format.indexOf('yyyy')>-1) {
    format = format.replace('yyyy','yy');
  }
  yy = (yy+'').substring(2, 4);
  format = format.replace('yy', yy).replace('mm', mm+1).replace('dd',dd );
  format = format.replace('hh', hh).replace('mm', mmm).replace('ss',ss);
  return format;
}

function getShallStop(start, end ) {
  var posit = lib.SLAUtil.calendar_calc_interval_wrapper(start,end, null, null);
  var neg = lib.SLAUtil.calendar_calc_interval_wrapper(end,start, null, null);
  var interval = (posit.getTime() - neg.getTime())/2;
  //use 1/3 time to do index work
  return new Date(new Date(start).getTime() + interval/3);
};

// TODO: split into two object
// one is for schedule immediately, the other is for time period
// otherwise have to do a lot of if/else branches
function FullReindexDuration(libf, env) {
  env = env || lib.IDOLKMReindexSample.getEnv();
  this.libf = libf;
  this.envf = env;
}
/*
  check if current time /exp time met any avalable working period.
  return period occurence if met, else return null;
*/
FullReindexDuration.prototype.getCurrentAvailablePeriod = function() {
  var envf = this.envf,
      libf = this.libf,
      exp = new Date();

  var tp = envf['no.tp'];
  if(tp) {
    return {
      'start':funcs.tod(),
      'end':new Date((new Date()).getTime() + 1000*60*60*24*180), 
      'shallStop': new Date((new Date()).getTime() + 1000*60*60*24*60)
    };
  }

  var libname = libf.kbname;
  var occurence = new SCFile('timeperiodOccurrence');
  // find the occurence with defined tp id and start time passed the expiration time
  var osql = 'definition.id = "TP999999"  and start.date < \'' + convertDate(exp) + '\' and end.date> \'' + convertDate(exp) +'\'';
  logger.info(libname + ' current period = ' + osql);
  occurence.setOrderBy(['start.date'], [SCFILE_ASC]);
  var orc = occurence.doSelect(osql);
  if(orc == RC_SUCCESS) {
    logger.info('start =' + occurence['start.date']+  ', end = ' + occurence['end.date']);
    return {
      'start':occurence['start.date'], 
      'end':occurence['end.date'], 
      'shallStop': getShallStop(occurence['start.date'], occurence['end.date'])
    };
  }
};

FullReindexDuration.prototype.getNextPeriod = function() {
  var envf = this.envf;
  var tp = envf['no.tp'];
  if(tp) {
    return {
      'start':funcs.tod(),
      'end':new Date((new Date()).getTime() + 1000*60*5), 
      'shallStop': new Date((new Date()).getTime() + 1000*60*2)
    };
  }
  var occurence = new SCFile('timeperiodOccurrence');
  // find the occurence with defined tp id and start time passed the expiration time
  var osql = 'definition.id = "TP999999" and start.date > \'' + convertDate(new Date()) + '\'';
  logger.info('getNextPeriod = ' + osql);
  occurence.setOrderBy(['start.date'], [SCFILE_ASC]);
  var orc = occurence.doSelect(osql);
  logger.info(occurence);
  if(orc == RC_SUCCESS) {
    return {
      'start':occurence['start.date'], 
      'end':occurence['end.date']
    };
  } else {
    return {
      'start':new Date((new Date()).getTime() + 1000*60*5),
      'end':new Date((new Date()).getTime() + 1000*60*65), 
      'shallStop': new Date((new Date()).getTime() + 1000*60*23)
    };
  }
};


FullReindexDuration.prototype.getPrevPeriod = function() {
  var envf = this.envf;
  var tp = envf['no.tp'];
  if(tp) {
    return {
      'start':funcs.tod(),
      'end':new Date((new Date()).getTime() + 1000*60*5), 
      'shallStop': new Date((new Date()).getTime() + 1000*60*2)
    };
  }
  var occurence = new SCFile('timeperiodOccurrence');
    // find the occurence with defined tp id and start time passed the expiration time
  var osql = 'definition.id = "TP999999"  and end.date <= \'' + convertDate(new Date()) + '\'';
  logger.info('getPrevPeriod= ' + osql);
  occurence.setOrderBy(['end.date'], [SCFILE_DSC]);
  var orc = occurence.doSelect(osql);
  logger.info('getPrevPeriod = ' + occurence);
  if(orc == RC_SUCCESS) {
    return {
      'start':occurence['start.date'], 
      'end':occurence['end.date']
    };
  }
};

//var dur = new FullReindexDuration('Incident_Library');
//var next_period = dur.getNextPeriod()
//logger.info('start at: ' + next_period['start'] + ', end at :' + next_period['end']);
