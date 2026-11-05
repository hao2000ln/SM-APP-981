/**
 * Split large database index job into chunks, but doesn't actually execute them
 * How many threads to execute, when to execute are unknown
 */
var _ = lib.Underscore.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLIndexFetcher = lib.IDOLIndexFetcher.require(),
    IDOLKMIndexStatus = lib.IDOLKMIndexStatus.require();

var DEFAULT_JOB_SIZE = 1000;

// same as global list: 'KM Reindex Job Status'
var JOB_STATUS = IDOLKMIndexStatus.JOB_STATUS;

var logger = getLog('FullReindexJobGenerator');

// TODO: grab all ID and create a plan is a time consuming work
// maybe find min/max, and then use interpolation to create ranges
function partitionBy(scfile, docid, size, callback, scope) {
  var rc = scfile.getFirst(),
      accumulatedCount = 0,
      fromDocId, 
      toDocId;

  while (rc === RC_SUCCESS) {
    if (accumulatedCount === 0) {
      fromDocId = scfile[docid];
      accumulatedCount++;
    } else if (accumulatedCount >= size) {
      toDocId = scfile[docid];
      callback.call(scope, fromDocId, toDocId);
      accumulatedCount = 0;
    } else {
      accumulatedCount++;
    }
    rc = scfile.getNext();
  }

  if (accumulatedCount > 0) {
    toDocId = scfile[docid];
    callback.call(scope, fromDocId, toDocId);
  }
}

function FullReindexJobGenerator(libf, jobsize) {
  var kbname = libf.kbname;
  if (libf.kbtype !== 'sclib') {
    throw new Error('can only generate index job for sclib, kbname: ' + kbname);
  }
  this.libf = libf;
  this.jobsize = jobsize || DEFAULT_JOB_SIZE;
  if(libf["full.reindex.batch.size"] && libf["full.reindex.batch.size"] > 10)
  {
    this.jobsize = libf["full.reindex.batch.size"];
  }
}

FullReindexJobGenerator.prototype.start = function(workers) {
    var libf = this.libf;
    var filename = libf.sclibtablename,
        libname = libf.kbname,
        scquery = libf.scquery || 'true',
        docid = libf.docid,
        jobsize = this.jobsize,
        workerCount = workers.length;

    var fields = [docid],
        orders = [SCFILE_DSC];

    logger.info('split KM library ' + libname + ' into jobs with size: ' + jobsize);
    // fetcher can read data from replica database if available
    var scfile = new SCFile(filename);
    if (scfile.isSQLFile()) {
        //scfile.setFields(fields);
        var mysql = 'select top ' + jobsize + ' ' + docid + ' from ' + filename + ' order by ' + docid + ' DESC';
        var rc = scfile.doSelect(mysql);
        var jobCount = 0;
        var finished = false;
        while (rc == RC_SUCCESS && !finished) {
            var doccount = 0;
            var start = scfile[0];
            var end = "";
            while (rc == RC_SUCCESS) {
                doccount++;
                end = scfile[0];
                rc = scfile.getNext();
            }
            var worker = workers[jobCount % workerCount];
            //var start = smallend;
            //var end = smallstart;
            logger.info('plan KM index job ' + filename + ' docid: ' + docid + ', range: [' + start + ', ' + end + '] to ' + worker.name);
            // XXX: the records are sorted in dsc order, the `start` is the larger one
            var rangeSQL = new QueryCond(docid, LE, start).and(new QueryCond(docid, GE, end)).asRAD();
            var sql = IDOLCommon.compositeCriteria([scquery, rangeSQL], ' and ');
            var name = [libname, start, end].join('_');
            var job = new SCFile('kmreindexJob');
            job['name'] = name;
            job['query.condition'] = sql;
            // schedule index job in `round robin` mode
            // XXX: may schedule jobs by system load
            job['worker'] = worker.name;
            job['status'] = JOB_STATUS.PLANNED;
            job.doInsert();
            jobCount++;
            if (doccount >= jobsize) {
                finished = false;
                mysql = 'select top ' + jobsize + ' ' + docid + ' from ' + filename + ' where ' + docid + '<"' + end + '"' + ' order by ' + docid + ' DESC';
                rc = scfile.doSelect(mysql);
            } else {
                finished = true;
            }
        }
    } else { 
        var fetcher = IDOLIndexFetcher.create();
        var scfile = fetcher.queryOptimized(filename, scquery, fields, orders);
        var jobCount = 0;
        partitionBy(scfile, docid, jobsize, function(start, end) {
            var worker = workers[jobCount % workerCount];
            logger.info('plan KM index job ' + filename + ' docid: ' + docid + ', range: [' + start + ', ' + end + '] to ' + worker.name);
            // XXX: the records are sorted in dsc order, the `start` is the larger one
            var rangeSQL = new QueryCond(docid, LE, start).and(new QueryCond(docid, GE, end)).asRAD();
            var sql = IDOLCommon.compositeCriteria([scquery, rangeSQL], ' and ');
            var name = [libname, start, end].join('_');
            var job = new SCFile('kmreindexJob');
            job['name'] = name;
            job['query.condition'] = sql;
            // schedule index job in `round robin` mode
            // XXX: may schedule jobs by system load
            job['worker'] = worker.name;
            job['status'] = JOB_STATUS.PLANNED;
            job.doInsert();
            jobCount++;
        });
    }
    return jobCount;
};

FullReindexJobGenerator.prototype.stop = function() {
  var libname = this.libf.kbname;
  logger.info('removing kmreindex schedule record, libname: ' + libname);
  var sch = new SCFile('schedule');
  var rc = sch.doSelect(new QueryCond('name', LIKE, 'Full reindex *' + libname).and(new QueryCond('sched.class', EQ, 'KMReindex')));
  while (rc === RC_SUCCESS) {
    sch.doDelete();
    rc = sch.getNext();
  }
};

FullReindexJobGenerator.prototype.toString = function() {
  return '[FullReindexJobGenerator] ' + this.libf.kbname;
};
