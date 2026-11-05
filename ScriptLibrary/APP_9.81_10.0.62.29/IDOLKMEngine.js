var _ = lib.Underscore.require(),
    IDOLKMIndexStatus = lib.IDOLKMIndexStatus.require(),
    KMCollection_Update_IDOL = lib.KMCollection_Update_IDOL.require(),
    IDOL_SharePoint = lib.IDOL_SharePoint.require(),
    IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require();

var logger = getLog('IDOLKMEngine');

var IDOLKMEngine = (function() {

  var Constants = lib.KMCollection_Status_Constant;
  var OFFLINE = Constants.INDEXSTATUS_OFFLINE(),
      NOT_STARTED = Constants.INDEXSTATUS_NOTSTARTED(),
      INDEXING = Constants.INDEXSTATUS_INDEXING(),
      FINISHED = Constants.INDEXSTATUS_FINISHED();

  function iterateSCFile(scfile, callback, scope) {
    var rc = scfile.getFirst();
    // ===============================================================================================
    // XXX: behavior can change when save SCDatum into RAD variable and retrieve it back (2016/12/10)
    //
    // e.g.
    //
    // var f = new SCFile('kmknowledgebase');
    // f.doSelect(true);
    // print(f.getFirst());    // f.getFrist() === 0
    //
    // vars['$L.tmp'] = f;
    //
    // var g = vars['$L.tmp'];
    // print(g.getFirst());    // g.getFirst() === true
    //
    //
    // The return value type is changed from `number` to `boolean`
    // But there is a 'C' style mapping
    //
    //   0 => true
    //   1 => false,   or non-zero => false
    // ===============================================================================================
    while(rc === RC_SUCCESS || rc === true) {
      callback.call(scope, scfile);
      rc = scfile.getNext();
    }
  }

  function reindexKnowledgeBase(kmknowledgebase) {
    var status = KMCollection_Update_IDOL.reindex(kmknowledgebase);
    if (status == RC_SUCCESS) {
      if (kmknowledgebase.kbtype === 'sclib') {
        if (kmknowledgebase.indexstatus == OFFLINE) {
          kmknowledgebase.indexstatus = NOT_STARTED;
        }
      } else {
        kmknowledgebase.indexstatus = INDEXING;
      }
      vars['$indexstatus'] = kmknowledgebase.indexstatus;
      kmknowledgebase.doSave();
    }
  }

  // use multiple thread index to improve performance. sclib only
  function reindexKnowledgeBaseWithMultipleThread(fKmknowledgebase) {
    lib.IDOLKMReindexSample.fullReindexSubmit(fKmknowledgebase);
  }

  function planReindex(fKmknowledgebase) {
    iterateSCFile(fKmknowledgebase, function(kmlib) {
      if (kmlib.kbtype === 'sclib') {
        reindexKnowledgeBaseWithMultipleThread(kmlib);
      } else {
        reindexKnowledgeBase(kmlib);
      }
    });
    updateUIIndexStatus(fKmknowledgebase);
  }

  // TODO: Global List, use name-value on format ?
  function updateUIIndexStatus(kmknowledgebase) {
    if (vars['$G.km.index.status.name'] && vars['$G.km.index.status.name'].length() > 0 && 
        vars['$G.km.index.status.display'] && vars['$G.km.index.status.display'].length() > 0) {
      var index = lib.ArrayUtil.indexOf(vars['$G.km.index.status.name'], kmknowledgebase.indexstatus);
      vars['$indexstatus'] = vars['$G.km.index.status.display'][index];
    } else {
      vars['$indexstatus'] = kmknowledgebase.indexstatus;
    }
  }

  function refreshKnowledgebaseStatus(kmknowledgebase) {
    if (_.contains(['splib', 'weblib', 'fsyslib','okmlib','confluencelib'], kmknowledgebase.kbtype)) {
      var connType = IDOL_SharePoint.getUrlTypeByKbtype(kmknowledgebase.kbtype);
      vars['$connector'] = IDOL_SharePoint.getSharePointConnectors(connType);

      // if share point library, get index status from idol
      if (kmknowledgebase.indexstatus !== FINISHED) {
        var status = IDOL_SharePoint.getSharePointStatus(kmknowledgebase.spconnectorurl, kmknowledgebase.idoltoken);
        if (kmknowledgebase.indexstatus !== status) {
          kmknowledgebase.indexstatus = status;
          kmknowledgebase.doSave();
        }
      }
      // get task list
      vars['$task'] = IDOL_SharePoint.getTaskByConnector(kmknowledgebase.spconnectorurl);
    }

    if (kmknowledgebase.kbtype === 'sclib') {
      var jobStatus = IDOLKMIndexStatus.refreshJobStatus(kmknowledgebase);

      vars.$total_jobs = jobStatus.total || 0;
      vars.$planned_jobs = jobStatus.planned || 0;
      vars.$completed_jobs = jobStatus.completed || 0;
      vars.$failed_jobs = (jobStatus.failed || 0) + (jobStatus.plan_to_transfer || 0) + (jobStatus.transfered || 0);
      vars.$pending_jobs = jobStatus.indexing || 0;
      vars.$working_jobs = jobStatus.sending || 0;

      var workers = new SCFile('schedule');
      var rcw = workers.doSelect('name #"Full" and sched.class like "' + kmknowledgebase.kbname + '*worker"');
      if(rcw == RC_SUCCESS) {
        vars.$working=true;
      }
    }

    updateUIIndexStatus(kmknowledgebase);

    var FORMAT_MAPPING = {
      'sclib' : 'kmknowledgebase.idol.g',
      'splib' : 'kmknowledgebase.splib.g',
      'weblib' : 'kmknowledgebase.weblib.g',
      'fsyslib' : 'kmknowledgebase.fslib.g',
      'okmlib'  : 'kmknowledgebase.okmlib.g',
      'confluencelib':'kmknowledgebase.confluencelib.g'
    };

    //show different for different lib
    vars['$L.format'] = FORMAT_MAPPING[kmknowledgebase.kbtype] || 'kmknowledgebase.idol.g';
    vars.$L_exit = "refresh";
  }

  function executeQuery(fKMQuery) {
    var clientType = vars.$G_client_type;

    var IDOLKMQuery = IDOLKMQueryFactory.create(clientType, fKMQuery);
    var result = IDOLKMQuery.search();
    if (vars.$G_client_type !== "mobile") {
      var html = result.html, 
          pagination = result.page;

      var currentPage = pagination.currentPage,
          lastPage = pagination.lastPage,
          total = pagination.total;

      vars.$L_currentpage = currentPage;
      vars.$L_lastpage = lastPage;
      vars.$L_pageXofY = funcs.scmsg(201, "km", [currentPage, lastPage]);
      vars.$L_showpager = (total > 0);
      vars.$L_showprevious = (currentPage > 1);
      vars.$L_shownext = (currentPage < lastPage);

      vars.$allwords = fKMQuery.allwords;
      vars.$exactphrase = fKMQuery.exactphrase;
      vars.$anywords = fKMQuery.anywords;
      
      fKMQuery.results = html;
    } else {
      vars.$L_file.results = result;
    }

    var query = _.compact([fKMQuery.submitstring, fKMQuery.filterqueries]).join(' ');
    lib.KMSearchHistory.addSearchHistory(query, total, fKMQuery.contexttag);
  }

  function refreshIndexes() {
    vars.$G_kmsearchengine = 'IDOL';
    return KMCollection_Update_IDOL.refreshIndexes();
  }

  function dropKnowledgebase(kmknowledgebase) {
    if (kmknowledgebase.kbtype == "sclib") {
      lib.KMCollection_Delete.removeTriggers(kmknowledgebase);
    }
    var name = lib.KMUtils.scToJSName(kmknowledgebase.kbname);
    return lib.KMCollection_Delete.deleteCollection(name);      
  }

  function isProcessRunning(libname) {
    var processes = funcs.processes('ACTIVE');
    return _.find(processes, function(p) {
      var name = p[.3] || '';
      return name.indexOf(libname) >= 0;
    });
  }

  function takePlannedScheduleSnapshot(fKmknowledgebase) {
    var fSchedule = new SCFile('schedule', SCFILE_READONLY);
    var snapshot = {};
    fSchedule.doSelect('sched.class="KMReindex" and name # "Full reindex Plan for Library: "');
    iterateSCFile(fSchedule, function(sch) {
      var kbname = sch['name'].replace('Full reindex Plan for Library: ', '');
      if (snapshot[kbname]) {
        logger.warn('there are multiple "Full reindex Plan" exists in schedule, should be some reindex plan issue: ' + kbname);
      }
      snapshot[kbname] = { status : 'planned' }; // the status value doesn't used anywhere, just a placeholder for map.
    });

    iterateSCFile(fKmknowledgebase, function(kmlib) {
      var kbname = kmlib.kbname;
      if (isProcessRunning(kbname)) {
        snapshot[kbname] = { status : 'running' };
      }
    });
    return snapshot;
  }

  // reload from database to count the running thread
  // this is not very accurate, since some thread may finished their tasks, but we
  // still mark it was running ...
  // 
  // This is because we don't have a thread pool or multiple-thread lock
  // otherwise they may running into a race condition.
  function calculateUsedThreadCount(scheduleSnapshot) {
    var libnames = _.keys(scheduleSnapshot);
    var fKmknowledgebase = new SCFile('kmknowledgebase', SCFILE_READONLY);
    fKmknowledgebase.doSelect(new QueryCond('kbname', ISIN, libnames).and(new QueryCond('kbtype', EQ, 'sclib')));

    var usedThreadCount = 0;
    iterateSCFile(fKmknowledgebase, function(kmlib) {
      usedThreadCount += fKmknowledgebase['full.reindex.max.thread'] || 1;
    });
    return usedThreadCount;
  }

  function selectIndexableLibrary(fKmknowledgebase, env) {
    var totalAvailableThreadCount = env['max.threads'] || 10,
        scheduleSnapshot = takePlannedScheduleSnapshot(fKmknowledgebase);

    var usedThreadCount = calculateUsedThreadCount(scheduleSnapshot);
    var requestedThreadCount = 0;

    var kbnames = [];
    iterateSCFile(fKmknowledgebase, function(kmlib) {
      var kbname = kmlib.kbname;
      if (scheduleSnapshot[kbname]) {
        funcs.msg(funcs.scmsg('full.reindex.already.running', 'idol', [ kbname ]), 2);
      } else if (kmlib.kbtype === 'sclib') {
        kbnames.push(kbname);
        requestedThreadCount += (kmlib['full.reindex.max.thread'] || 1);
      } else {
        kbnames.push(kbname);
      }
    });

    var isAffordable = totalAvailableThreadCount >= (usedThreadCount + requestedThreadCount);

    // TODO: behavior should not depend on side effect
    // should pass-in one context object to manage the control flow
    // or, return one tuple with additional flags
    vars['$L.need.confirm'] = !isAffordable && (kbnames.length > 0);
    vars['$L.confirm.msg'] = isAffordable ? null : funcs.scmsg('not.enough.threads', 'idol', [ totalAvailableThreadCount ]);
    return kbnames;
  }

  function checkTimeperiod(fKmknowledgebase, env) {
    if (env['no.tp']) { return true; }

    var tp = new SCFile('timeperiodOccurrence', SCFILE_READONLY);
    var hasTimePeriod = !!tp.doCount('definition.id = "TP999999"');
    if (!hasTimePeriod) {
      throw new Error(funcs.scmsg('not.enough.occurrences', 'idol'));
    }
  }

  function checkReplicateDBSettings(fKmknowledgebase) {
    if (!lib.KMIDOLReplicatedDB.checkIndexFieldList(fKmknowledgebase)) {
      var kbname = fKmknowledgebase.kbname;
      throw new Error(funcs.scmsg('fail_check', 'KMReindex', [ kbname ]));
    }
  }

  // This method can be called in two different place
  // 1. displayscreen : environment.view
  // 2. displayscreen : knowledgebase.view
  //
  // return one SCFile which can contain 0, 1, or more record, in order to make
  // it work on both displayscreen
  //
  // XXX: because of the reload, kmknowledgebase must be saved before invoke this function to get start
  function selectLibrariesFromSelection(fKmknowledgebase, env) {
    // since `environment` can be editted during configuration
    // $G.km.globalenv can be running out of date, read database instead
    env = env || lib.IDOLKMReindexSample.getEnv();
    if (!env) {
      throw new Error('unable to find the KM profile, please make sure $G.km.globalenv is initialized');
    }

    var kbnames = []; 
    // return an empty scfile to prevent further processing if validation error happened
    try {
      iterateSCFile(fKmknowledgebase, function(kmlib) {
        if (kmlib.kbtype === 'sclib') {
          // eager fail, no more processing when validate failed, validators must throw exception
          checkTimeperiod(kmlib, env);
          checkReplicateDBSettings(kmlib, env);
        }
      });
      kbnames = selectIndexableLibrary(fKmknowledgebase, env);
    } catch (e) {
      logger.error(e);
      lib.KMUtils.domessageBox(e.message);
    }

    var validLibaries = new SCFile('kmknowledgebase');
    validLibaries.doSelect(new QueryCond('kbname', ISIN, kbnames));
    return validLibaries;
  }

  return {
    name : 'IDOL',
    planReindex : planReindex,
    refreshStatus : refreshKnowledgebaseStatus,
    submitSearch : executeQuery,
    refreshIndexes : refreshIndexes,
    selectValidLibrary : selectLibrariesFromSelection,
    drop : dropKnowledgebase
  };
}());

function require() {
  return IDOLKMEngine;
}