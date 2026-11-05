/*
 * Author: Ming-Di, Zhang
 * KM reindex process monitor class
 * check pending result jobs status in IDOL
 * set retry for the failed jobs. 
*/
var _ = lib.Underscore.require(),
    IDOLKMIndexStatus = lib.IDOLKMIndexStatus.require();

var JOB_STATUS = IDOLKMIndexStatus.JOB_STATUS;

var logger = getLog('FullReindexMonitor');

function FullReindexMonitor(libname) {
  this.libname = libname;
}

FullReindexMonitor.prototype.checkPendingJobs = function() {
  var libname = this.libname;
  var jobs = new SCFile('kmreindexJob');
  var rc = jobs.doSelect('worker # "' + libname + '" and status=3');
  var result = '';
  while(rc == RC_SUCCESS) {
    var jobId = jobs['jobId'];
    var result = '';
    logger.info('working on id = ' + jobId);
    // TODO: refine IDOL index status check
    result = IDOLKMIndexStatus.checkIndexStatus(jobId);
    logger.info('index result = ' + result['rc'] + ', ' + result['reason']);
    var dtValue = lib.tzFunctions.convertDateStringOnTZ(funcs.tod(), vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, 1);
    var res = result['rc'];
    if(res == 0) {  // job status is finished
      jobs['status'] = 4;
      jobs['confirm.time'] = funcs.tod();
    } else if (res == 1) { // should be job pending commit
      rc = jobs.getNext();
      continue;
    } else if (res == 2 ) { // job failed
      jobs['status'] = 5;
      var fa = jobs['failures'].toArray();
      fa.push(result['reason']|| 'Unexpected failure');
      jobs['failures'] = fa;
      var fta = jobs['failure.time'].toArray();
      //fta.push(funcs.tod());
      fta.push(dtValue);
      jobs['failure.time'] = fta;
    } else if (res == -1) {  //failure existed
      jobs['status'] = 5;
      var fa = jobs['failures'].toArray();
      fa.push(result['reason']|| 'Unexpected failure');
      jobs['failures'] = fa;
      var fta = jobs['failure.time'].toArray();
      
      fta.push(dtValue);
      jobs['failure.time'] = fta;
    }
    jobs.doUpdate();
    rc = jobs.getNext();
  }
};


FullReindexMonitor.prototype.checkFailedJobs = function() {
  var libname = this.libname;
  var jobs = new SCFile('kmreindexJob');
  var rc = jobs.doSelect('worker # "' + libname + '" and status=5');
  while(rc == RC_SUCCESS) {
    if(jobs['failures'].length()<3) {
      logger.info('failed job found, reset status: ' + jobs['id']); 
      jobs['status'] = 1;
      jobs['start.time'] = null;
      jobs['end.time'] = null;
      jobs['confirm.time'] = null;
      jobs.doUpdate();
    } else {
      logger.info('failed job found, but retries more than 3 times:  ' + jobs['id']);
    }
    rc = jobs.getNext();
  }
};

FullReindexMonitor.prototype.checkSendingJobs = function() {
  var libname = this.libname;
  var jobs = new SCFile('kmreindexJob');
  var rc = jobs.doSelect('worker # "' + libname + '" and status=2');
  var tod = new Date(funcs.tod());
    
  while( rc == RC_SUCCESS ) {
    logger.info('start  = ' + jobs['start.time'] + ' , tod = ' + tod);
    var start = lib.tzFunctions.convertDatetoStringonTZ(new Date(jobs['start.time']), vars.$lo_date_order, vars.$lo_time_zone); 
    start = new Date(start); 
    var end = jobs['end'];
    if( !end && (tod.getTime() - start.getTime() > 1000*60*5)) { 
      if(jobs['failures'].length()<3) {
        logger.info('Time out job found, job id = ' + jobs['id']);
        jobs['status'] = 1;
          var fa = jobs['failures'].toArray();
          fa.push('Processing Timeout, more that 5 minutes');
          jobs['failures'] = fa;
          var fta = jobs['failure.time'].toArray();
          var dtValue = lib.tzFunctions.convertDateStringOnTZ(funcs.tod(), vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, 1);
          //fta.push(funcs.tod());
          fta.push(dtValue);
          jobs['failure.time'] = fta;
          jobs['start.time'] = null;
          jobs['end.time'] = null;
          jobs['confirm.time'] = null;
      } else {
        jobs['status'] = 5;
      }
      jobs.doUpdate();
    } 
    rc = jobs.getNext();
  }
};

function restartProcessIfNotActive(processName) {
  var processes = funcs.processes('ACTIVE');
  var processAlive = _.any(processes, function(p) {
    return p[.3] === processName;
  });
  if (processAlive) { return; }

  logger.info('process ' + processName + ' is not active, restart');
  var names = ['name'],
      values = [processName],
      rcValue = new SCDatum();
  funcs.rtecall("callrad", rcValue, "scheduler.start.bg", names, values, false);
}

function restartDeadThread(kmlib) {
  var libname = kmlib.kbname;
  var fInfo = new SCFile('info', SCFILE_READONLY);
  var rc = fInfo.doSelect(new QueryCond('type', LIKE, libname));
  while (rc === RC_SUCCESS) {
    restartProcessIfNotActive(fInfo['type']);
    rc = fInfo.getNext();
  }
}

function monitorJobs(kmlib) {
  var libname = kmlib.kbname;
  logger.info('checking reindex status, libname: ' + libname);
  var ret1 = lib.IDOLKMIncrementalIndex.verifyEnvironment();
  if(ret1!= RC_SUCCESS) {
    logger.error( 'verify environment failed. Monitor work will continue on next interval.' );
    return -1;
  }
  var jobs = new SCFile('kmreindexJob');
  if(jobs.doCount('worker # "' + libname + '" and (status = 2 or status=3 or status=5)')>0) {
    var mon = new FullReindexMonitor(libname);
    mon.checkPendingJobs();
    mon.checkFailedJobs();
    mon.checkSendingJobs();
  }

  var jobT = new SCFile('kmreindexJob'); 
  var jobCF = new SCFile('kmreindexJob');
  if(jobT.doCount('worker # "' + libname + '" and (status=1 or status=2 or status=3)') == 0 && 
     jobCF.doCount('worker # "' + libname + '"') != 0) {
    var libf = new SCFile('kmknowledgebase');
    // reload to make sure status is up to date
    var rc2 = libf.doSelect(new QueryCond('kbname', EQ, libname));
    if(rc2 == RC_SUCCESS && libf['indexstatus'] === 'indexing') {
      logger.info('library ' + libname + ' has completed full indexing, set status to finished');
      libf['indexstatus'] = 'finished';
      // in fact, last index time should be the index 'start time', not 'end time'
      libf['lastindextime'] = funcs.tod();
      libf.doUpdate();
      lib.IDOLKMReindexSample.stopKMIndexSchedule(libf);
    }
  } else {
    logger.info('library ' + libname + ' is actively indexing');
    restartDeadThread(kmlib);
  }
}

function isAnyWorking() {
  var workers = new SCFile('schedule');
  var wsql = 'name #"Full" and sched.class="KMReindex"';
  var rcw = workers.doSelect(wsql);
  if(rcw == RC_SUCCESS) {
    return true;
  } else {
    return false;
  }
}