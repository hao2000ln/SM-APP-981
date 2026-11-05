var _ = lib.Underscore.require();
var KMIDOLUtils = lib.KMIDOLUtils.require();
var KMDocument_Index_IDOL = lib.KMDocument_Index_IDOL.require();
var IDOLKMIndexService = lib.IDOLKMIndexService.require();
var IDOLScheduler = lib.IDOLScheduler.require();

const EXECUTOR_SCH_PREFIX = 'Full reindex Execution for Library: ';

var logger = getLog('FullReindexWorkerGenerator');

function FullReindexWorker(kmlib, repeat, threadNo) {
  var name = [kmlib.kbname, threadNo].join('_');

  this.kmlib = kmlib;
  this.repeat = repeat;
  this.name = name;
  this.id = name + '_worker';
}

FullReindexWorker.prototype.toString = function() {
  return '[FullReindexWorker] ' + this.id;
};

FullReindexWorker.prototype.createWorkerSchedule = function() {
    var kmlib = this.kmlib;
    var libname = this.kmlib.kbname;
    var id = this.id;
    var executorName = EXECUTOR_SCH_PREFIX + libname;
    var timeoutAt = new Date(Date.now() + 1000 * 120);

  logger.info('create worker schedule: ' + executorName);

  return IDOLScheduler.schedule({
    'name' : executorName,
    'sched.class' : id,
    'class' : id,
    'expiration' :  timeoutAt,
    'status' : 'rescheduled'
  })
  .set('repeat', this.repeat) // same as KMUpdate repeat interval
  .javascript(function(kmlib, id) {
    lib.FullReindexWorkerGenerator.work(kmlib, id);
  }, kmlib, id)
  .start();
};

FullReindexWorker.prototype.createWorkerProcessor = function() {
  var id = this.id;
  var fInfo = new SCFile('info');
  var rc = fInfo.doSelect(new QueryCond('type', EQ, id).and(new QueryCond('format', EQ, 'info.startup')));
  if (rc === RC_SUCCESS) {
    logger.info('info.startup ' + id + ' already exists, ignore');
  } else {
    logger.info('create worker info process: ' + id);
    fInfo.type = id;
    fInfo.format = 'info.startup';
    var scheduler = fInfo['process.start.infos'];
    scheduler[0].name = id;
    scheduler[0].parameters = ['scheduler', id,  '60', '5'];
    fInfo.doInsert();
  }
};

FullReindexWorker.prototype.startProcess = function() {
  var id = this.id;
  logger.info('start worker info process: ' + id);
  var processes = funcs.processes('ACTIVE');
  var processAlive = _.any(processes, function(p) {
    return p[.3] === id;
  });

  if (processAlive) {
    logger.warn('bg process: ' + id + ' already started, abort');
    return;
  }

  var names = ['name'];
  var values = [id];
  var rcValue = new SCDatum();
  funcs.rtecall("callrad", rcValue, "scheduler.start.bg", names, values, false);
};


FullReindexWorker.prototype.start = function() {
  var id = this.id;
  logger.info('start worker process: ' + id);
  this.createWorkerSchedule();
  this.createWorkerProcessor();
  this.startProcess();
};


function FullReindexWorkerGenerator(kmlib) {
  this.kmlib = kmlib;
}

FullReindexWorkerGenerator.prototype.toString = function() {
  return '[FullReindexWorkerGenerator] ' + this.kmlib.kbname; 
};

FullReindexWorkerGenerator.prototype.generate = function() {
  var kmlib = this.kmlib;
  var size = kmlib['full.reindex.max.thread'] || 1;
  var libname = kmlib.kbname;

  logging('plan to use ' + size + ' thread to index library: ' + libname);

  var sch = new SCFile('schedule', SCFILE_READONLY);
  var rc = sch.doSelect('sched.class="KMUpdate"');
  if (rc !== RC_SUCCESS) {
    throw new Error('unable to find KMUpdate schedule, abort');
  }

  var repeat = sch.repeat; // schedule repeat interval
  this._workers = _.map(_.range(size), function(i) {
    return new FullReindexWorker(kmlib, repeat, i); 
  });
  return this._workers;
};

FullReindexWorkerGenerator.prototype.getWorkers = function() {
  if (!this._workers) {
    throw new Error('have to generate worker first');
  }
  return this._workers;
};

FullReindexWorkerGenerator.prototype.start = function() {
  var workers = this.getWorkers();
  _.each(workers, function(worker) {
    worker.start();
  });
};

FullReindexWorkerGenerator.prototype.stop = function() {
  // stop cannot be exactly the reverse operator of `start`
  // since customer may have change the thread number, the final worker count vary
  this.stopProcess();
  this.destroyWorkers();
};


FullReindexWorkerGenerator.prototype.stopProcess = function() {
  var libname = this.kmlib.kbname;
  var processes = funcs.processes();
  _.each(processes, function(p) {
    var name = p[.3] || '';
    if (name.indexOf(libname) >= 0) {
      logger.info('terminating process: ' + name);
      terminateSession(p[.1]);
    }
  });
};

// there can be several worker exists if thread count is larger than 1
FullReindexWorkerGenerator.prototype.destroyWorkers = function() {
  var libname = this.kmlib.kbname;
  var namePrefix = EXECUTOR_SCH_PREFIX + libname;
  
  var fSchedule = new SCFile('schedule');
  var rc1 = fSchedule.doSelect(new QueryCond('name', LIKE, namePrefix).and(new QueryCond('sched.class', LIKE, libname)));
  while (rc1 === RC_SUCCESS) {
    fSchedule.doDelete();
    rc1 = fSchedule.getNext();
  }

  var fInfo = new SCFile('info');
  var rc2 = fInfo.doSelect(new QueryCond('type', LIKE, libname).and(new QueryCond('format', EQ, 'info.startup')));
  while (rc2 === RC_SUCCESS) {
    fInfo.doDelete();
    rc2 = fInfo.getNext();
  }
};


function terminateSession(sessionId) {
  var names = ['name'];
  var values = [sessionId];
  var rcValue = new SCDatum();
  funcs.rtecall("callrad", rcValue, "signal", names, values, false);
}


function work(kmlib, workerName) {
  var period = new lib.FullReindexDurationGenerator.FullReindexDuration(kmlib);
  var currentPeriod = period.getCurrentAvailablePeriod();
  if(currentPeriod) {
    index(currentPeriod, workerName);
    plan(period, workerName);
  } else {
    logging('no available working time, wait.  schedule: ' + workerName);
  }
}


/*
  work on indexing document
*/
function index(period, name) {
    var start = period['start'];
    var end = period['end'];
    logging(name + ' is working.');
    
    var shallStop = period['shallStop'];
    logging('in indexing function, period start = ' + start + ', period stop = ' + end + ', and I shall stop at : ' + shallStop);
    
    var kmknowledgebase = new SCFile('kmknowledgebase');
    var libname = name.replace(/\_\d+\_worker/g, '');
    var rc = kmknowledgebase.doSelect('kbname="' + libname + '"');
    if (rc != RC_SUCCESS) {
        return;
    }

    var fn = kmknowledgebase['sclibtablename'];
    var indexDBName = kmknowledgebase.kbname;
    var indexFieldSet = KMIDOLUtils.getIndexFieldSet(kmknowledgebase);
    var kbversion = kmknowledgebase['sysmodcount'];
    var jobs = new SCFile('kmreindexJob');
    var jr = jobs.doSelect('worker = "' + name.replace('_worker', '') + '" and status = 1');

    // check if replicate db is using
    var globalReplicateDB = funcs.sysinfo_get("EnableReplicateDB");
    //var replica_db = vars.$G_km_globalenv['replicate.db'];
    var replica_db = lib.KMIDOLReplicatedDB.getReplicateDBSetting();

    while (jr == RC_SUCCESS) {
        var idolDoc = '';
        if (funcs.tod() > shallStop) {
            logging('times up, no need to continue working.');
            break;
        }
        logging('job started at: ' + funcs.tod() + ',  job id = ' + jobs['id']);
        jobs['start.time'] = funcs.tod();
        var jf = new SCFile(fn, SCFILE_READONLY);
        var sql = jobs['query.condition'];
        //logging("query is:"+sql);
        var replicatedindex = false;
        var fields = [];
        fields.push(kmknowledgebase.docid);
        //fields.push(kmknowledgebase.docid);//docid already the first one
        
        var length = kmknowledgebase.kbfields.length();
        var i;
        for (i = 0; i < length; i++) {
            fields.push(kmknowledgebase.kbfields[i].kbfieldname);
        }

        if (globalReplicateDB && replica_db) {
            jf.setFlag("USE_REPLICATE_DB", replica_db);
            jf.setFlag("ALWAYS_USE_REPLICATE_DB", true);
            logging("use USE_REPLICATE_DB and ALWAYS_USE_REPLICATE_DB to query data:" + sql);
        }
        
        var rf = jf.doSelect(sql);
        jobs['status'] = 2;
        jobs.doUpdate();
        var n = 0;
        while (rf == RC_SUCCESS) {
            dumpAttachment(kmknowledgebase, jf, true);
            idolDoc += ('#DREFIELD VERSION="' + (kbversion + '' + jf['sysmodcount']) + '"' + '\n' + KMDocument_Index_IDOL.createIndexDoc(kmknowledgebase, jf, indexFieldSet, replicatedindex));

            idolDoc += '\n';
            rf = jf.getNext();
            n++;
        }
        logging("already fetch data:" + n);
        
        idolDoc += '#DREENDDATAREFERENCE\n\n';
        
        var indexRes = '';
        var error = '';
        try {
            //logging(idolDoc);
            indexRes = IDOLKMIndexService.addDocument(indexDBName, idolDoc);
        } catch (ex) {
            error = ex.message;
            logger.warn('error when index document = ' + error);
        }

        jobs['status'] = 3;
        jobs['end.time'] = funcs.tod();
        logging('res = ' + indexRes);
        if (!indexRes || indexRes < 0 || indexRes.indexOf('INDEXID') < 0 || error) {
            var fa = jobs['failures'].toArray();
            fa.push('No index Id return.' + error);
            jobs['failures'] = fa;
            var fta = jobs['failure.time'].toArray();
            var dtValue = lib.tzFunctions.convertDateStringOnTZ(funcs.tod(), vars.$lo_time_zone, vars.$lo_date_order, vars.$lo_time_zone, 1);
            //fta.push(funcs.tod());
            fta.push(dtValue);
            jobs['failure.time'] = fta;

            jobs['status'] = 5;
            jobs.doUpdate();
            logger.warn('index job failed since no index id return:  ' + jobs['id']);
            jr = jobs.getNext();
            continue;
        }
        
        indexRes = indexRes.match(/\d+/g)[0];
        jobs['jobId'] = indexRes;
        //logging('index res = ' + indexRes.match(/\d+/g)[0]);
        logging('document sent = ' + jobs['query.condition']);

        jobs.doUpdate();
        logging('job end at: ' + funcs.tod() + ',  job id = ' + jobs['id']);
        jr = jobs.getNext();
    }
}

function dumpAttachment(strCollectionFile, sclibFile,isReindex)
{
    if (strCollectionFile.indexattachments || sclibFile.doctype =="external")
    {
        var doc_id = sclibFile[strCollectionFile.docid];
        var fAttachments = new SCFile("SYSATTACHMENTS",SCFILE_READONLY);
        fAttachments.setFields(["application"]);
        var rc = fAttachments.doSelect("application=\""+strCollectionFile.sclibtablename+"\" and topic=\""+ doc_id  +"\" and segment=0");

        if( RC_SUCCESS == rc){
            var kbname = strCollectionFile.kbname;
            lib.KMAttachmentUpdatesDAO.create(doc_id, kbname, kbname)
        }
    }
}
    
/*
  work on planning next period
*/
function plan(period, sch_name) {
  logging('sch record = ' + vars.$L_expire );
  var next_period = period.getNextPeriod();
  var next_exp = next_period['start'];
  // $L.expire is defined in caller: scheduler.process, set this value to next period start.
  vars.$L_expire = next_exp;
  logging('schedule updated, exp = ' + vars.$L_expire );
  //vars.$SCHEDULE.doUpdate();
}
//work('Incident_Library_1_worker');


function logging(msg) {
  logger.info(msg);
}


//var g = new FullReindexWorkerGenerator('Incident_Library',100);
//var ws = g.gen();
