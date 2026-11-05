/**
 * The schedule running has dependencies
 *
 * 1. user click full reindex, create KMReindex schedule, name `Full reindex Plan for Library`
 * 2. after 5 mins (KMUpdate repeat interval) or time-perioid timeout, execute `Full reindex Plan for Library`
 * 2.1. create schedule `Full reindex Monitor for Library`
 * 2.2. create and start worker, when schedule name is `Full reindex Execution`
 */
var _ = lib.Underscore.require(),
    IDOLKMIndexService = lib.IDOLKMIndexService.require(),
    IDOLScheduler = lib.IDOLScheduler.require();

var KMReIndexJobGenerator = lib.FullReindexJobGenerator.FullReindexJobGenerator,
    KMReIndexWorkerGenerator = lib.FullReindexWorkerGenerator.FullReindexWorkerGenerator,
    KMReIndexDurationGenerator = lib.FullReindexDurationGenerator.FullReindexDuration;

var Constants = lib.KMCollection_Status_Constant;
var NOT_STARTED = Constants.INDEXSTATUS_NOTSTARTED(),
    INDEXING = Constants.INDEXSTATUS_INDEXING(),
    FINISHED = Constants.INDEXSTATUS_FINISHED();

var logger = getLog('IDOLKMReindexSample');

function createIDOLDatabase(kmlib) {
  var libname = kmlib.kbname;

  if (IDOLKMIndexService.isDBExists(libname)) {
    logger.info('IDOL database already exists, clear data: ' + libname);
    // when IDOL recovered from disaster, the database can be marked as readonly
    // in this situation, it cannot accept data any more.
    if (IDOLKMIndexService.isDBReadOnlyOnAnyContent(libname)) {
      throw new Error('The index database '+ libname +' is read-only in IDOL server');
    }
    // full RE-index, existing data need to be swipe out
    IDOLKMIndexService.removeIndexDB(libname);
  } else {
    logger.info('IDOL database not exists: ' + libname);
  }

  if (IDOLKMIndexService.createIndexDB(libname) !== RC_SUCCESS){
    throw new Error('Failed to create index db '+ libname + ' in IDOL Server');
  }
  if (IDOLKMIndexService.mappingVDB(libname) != 0) {
    throw new Error('Failed to mapping VDB to ' + libname);
  }
}

function calculateIndexScheduleExpireTime(fKmknowledgebase) {
  var dg = new KMReIndexDurationGenerator(fKmknowledgebase);
  var currentPeriod = dg.getCurrentAvailablePeriod();
  var exp = funcs.tod();
  if(!currentPeriod) {
    logger.info('current exp is null, plan to next');
    var nextPeriod = dg.getNextPeriod();
    exp = nextPeriod['start'];
  } else {
    logger.info('curr start = ' + currentPeriod['start'] + ', ' + currentPeriod['end']);
  }
  return exp;
}

function createIndexPlanSchedule(fKmknowledgebase) {
  var libname = fKmknowledgebase.kbname;
  // when time period enabled, the job plan doesn't run immediately
  var exp = calculateIndexScheduleExpireTime(fKmknowledgebase);
  logger.info('library ' + libname + ' "Plan" schedule, it expire at: ' + exp);

  // run plan index once and exit
  IDOLScheduler.schedule({
    'name' : 'Full reindex Plan for Library: ' + libname,
    'sched.class' : 'KMReindex',
    'class' : 'KMReindex',
    'expiration' : exp,
    'status' : 'rescheduled'
  })
  .javascript(function(kmlib) {
    lib.IDOLKMReindexSample.planKnowledgeLibraryIndex(kmlib);
  }, fKmknowledgebase)
  .start();
}


function createIndexMonitorSchedule(fKmknowledgebase) {
  var sch = new SCFile('schedule');
  var rc = sch.doSelect('sched.class="KMUpdate"');

  if (rc !== RC_SUCCESS) {
    throw new Error('unable to find KMUpdate schedule');
  }

  var libname = fKmknowledgebase.kbname;
  // but need to continously monitor index status
  IDOLScheduler.schedule({
    'name' : 'Full reindex Monitor for Library: ' + libname,
    'sched.class' : 'KMReindex',
    'class' : 'KMReindex',
    'expiration' : funcs.tod(),
    'status' : 'rescheduled',
    'repeat' : sch.repeat
  })
  .javascript(function(kmlib) {
    lib.FullReindexMonitor.monitorJobs(kmlib);
  }, fKmknowledgebase)
  .start();
}

function createKMIndexEnvironment(kmlib) {
  var workerGenerator = new KMReIndexWorkerGenerator(kmlib);
  var workers = workerGenerator.generate();

  if (workers.length <= 0) {
    // if no worker, the index cannot go further, should prevent this situation.
    throw new Error('no worker can be generaged from library: ' + kmlib.kbname);
  }

  var jobGenerator = new KMReIndexJobGenerator(kmlib);
  var jobCount = jobGenerator.start(workers);

  // start worker before job generated
  // when job ready, it can start index immediately
  workerGenerator.start();

  if (jobCount <= 0) {
    logger.warn('no job can be generated from library: ' + kmlib.kbname + ', mark as finished');
    logger.warn('this may related to the query cannot find any data. sql: ' + (kmlib.scquery || 'true'));

    workerGenerator.stop();
    jobGenerator.stop();

    var reloaded = new SCFile('kmknowledgebase');
    reloaded.doSelect(new QueryCond('kbname', EQ, kmlib.kbname));
    reloaded['indexstatus'] = FINISHED;
    reloaded.doUpdate();
  }
}

function stopKMIndexSchedule(kmlib) {
  new KMReIndexWorkerGenerator(kmlib).stop();
  new KMReIndexJobGenerator(kmlib).stop();
}

function fixCatalogData(kmlib)
{
   if(kmlib.sclibtablename === 'joinsvcDisplay')
   {
     //QCCR1E157040 SMA Search is not working,when display id is null, will only index one record
     lib.KMUtils.fixNULLID("svcDisplay", "displayId");
     lib.KMUtils.fixNULLID("svcCatalog", "id");
   }
}
//reindex will start so ignore all increament index
function removeUpdates(kmlib)
{
    var file = new SCFile("kmattachmentupdates");
    file.doPurge('collectionname="'+kmlib.kbname+'"');
    file = new SCFile("kmattachmentbeforeupdate");
    file.doPurge('collectionname="'+kmlib.kbname+'"');
    file = new SCFile("kmknowledgebaseupdates");
    file.doPurge('collectionname="'+kmlib.kbname+'"');
    file = new SCFile("kmattachmenttoken");
    file.doPurge('collectionname="'+kmlib.kbname+'"');
}
function planKnowledgeLibraryIndex(kmlib){
  try {
    removeUpdates(kmlib);
    fixCatalogData(kmlib);
    createIDOLDatabase(kmlib);
    createKMIndexEnvironment(kmlib);
    createIndexMonitorSchedule(kmlib);

    kmlib['indexstatus'] = INDEXING;
    kmlib.doUpdate();
    logger.info('KM reindex plan for ' + kmlib.kbname + ' finished. check db -> kmreindexJob for detail');
  } catch (e){
    logger.info(e.message);
    logger.info(e.stack);
  }
}

function removeKMReindexJobDefinitions(kmlib) {
  var libname = kmlib.kbname;
  logger.info('removing reindex jobs, libname = ' + libname);
  var jobs = new SCFile('kmreindexJob');
  // for large database table, it can exists thousands of jobs, may use purge
  var rc = jobs.doSelect(new QueryCond('name', LIKE, libname));
  while(rc === RC_SUCCESS) {
    jobs.doDelete();
    rc = jobs.getNext();
  }
}

function cleanupKMIndexRecords(kmlib) {
  stopKMIndexSchedule(kmlib);
  removeKMReindexJobDefinitions(kmlib);
}

// user click 'Full reindex' in UI, submit a plan schedule, and done
function fullReindexSubmit(fKmknowledgebase){
  cleanupKMIndexRecords(fKmknowledgebase);

  var libname = fKmknowledgebase.kbname;
  if (!IDOLKMIndexService.isDBExists(libname)) {
    IDOLKMIndexService.createIndexDB(libname);
  }
  IDOLKMIndexService.mappingVDB(libname); 
  print(funcs.scmsg('reindex.scheduled.jointype', 'idol', [libname])); 

  createIndexPlanSchedule(fKmknowledgebase);
  fKmknowledgebase['indexstatus'] = NOT_STARTED;
  fKmknowledgebase.doUpdate();
}

function getEnv() {
  var envf = new SCFile('environment', SCFILE_READONLY);
  var rc = envf.doSelect('name="knowledge management"');
  if(rc == RC_SUCCESS) {
    return envf;
  }
}

function transferFailedToIncr() {
  var jobs = new SCFile('kmreindexJob');
  var sql = 'status=6';
  var rc = jobs.doSelect(sql);
  var counter = 0;
  while(rc == RC_SUCCESS){
    var libname = jobs['worker'].replace(/\_\d+/,'');
    var sql = jobs['query.condition'];
    var kb = new SCFile('kmknowledgebase');
    var krc = kb.doSelect('kbname="' + libname +'"');
    while(krc == RC_SUCCESS) {
      var fn = kb['sclibtablename'];
      var f = new SCFile(fn);
      var frc = f.doSelect(sql);
      
      while(frc == RC_SUCCESS ) {
        lib.KMCollection_Update_Triggers.kmtriggerAfterAdd(fn,f);
        if(++counter%100 == 0){
          logger.info( counter + ' records transfer to incremental index');
        }
        frc = f.getNext();
      }
      krc =kb.getNext();
    }
    jobs['status'] = 7;
    var fa = jobs['failures'].toArray();
    fa.push('retry with incremental index.');
    jobs['failures'] = fa;
    var fta = jobs['failure.time'].toArray();
    var dtValue = lib.tzFunctions.convertDateStringOnTZ(funcs.tod(), vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, 1);
    //fta.push(funcs.tod());
    fta.push(dtValue);
    jobs['failure.time'] = fta;
    jobs.doUpdate();
    rc = jobs.getNext();
  }
}

function monitorOphanSchedule() {
  var processes = funcs.processes('ACTIVE');
  var ophans = new SCFile('schedule');
  var sql = 'name#"Stop " and sched.class like "*worker"';
  var rc = ophans.doSelect(sql);
  while(rc == RC_SUCCESS) {
    var schedClass = ophans['sched.class'];
    var inf = new SCFile('info');
    var irc = inf.doSelect('type = "' + schedClass + '" and format#"info.startup"');
    if(!_.contains(processes, schedClass) && irc!=RC_SUCCESS) {
      logger.info('ophan found: ' + schedClass + ', will be deleted.');
      ophans.doDelete();
      inf.doDelete();
    }
    rc = ophans.getNext();
  }
}