var IDOLCommon = lib.IDOLCommon.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLIndexExecutor = lib.IDOLIndexExecutor.require();

var logger = getLog('aciindex');

function getIndexRecord(module) {
  var query = new QueryCond("table.name", EQ, module).and(new QueryCond("feature", EQ, IDOLCommon.FEATURES.HTA));
  var records = new Query('idolindex', query);
  return records[0];
}

function clearCache() {
  IDOLClientFactory.invalidCache();
  IDOLConfigure.clearIDOLServerConfigCache();
}

function scheduleSMISIndexTask(filename) {
  var WAITING = lib.smis_Constants.TASK_STATUS_WAITING();
  var smis = lib.IDOL_SMIS.getSMISInstance();
  // search database again to make sure data is up to date
  var idolindex = getIndexRecord(filename);
  var internalId = getInternalId(filename);
  
  if (!smis) {
    lib.IDOL_SMIS.addIDOLTask("incrementalindex", internalId, "idolindex", [{value: filename, type: "String"}]);
  } else {
    var smisTask = new SCFile('SMISTaskQueue', SCFILE_READONLY),
        smisIntId = smis.intId, // SMIS instance ID
        action = 'incrementalindex',
        query = new QueryCond("action",     EQ, action)
           .and(new QueryCond("intId",      EQ, smisIntId))
           .and(new QueryCond("internalId", EQ, internalId))
           .and(new QueryCond("expired",    EQ, false))
           .and(new QueryCond("status",     EQ, WAITING)),
        rc;
    rc = smisTask.doSelect(query);
    if (rc === RC_SUCCESS) {
      logger.warn('task (action: ' + action + ',internalId: ' + filename +  ') already exists, ignore');
    } else {
      lib.IDOL_SMIS.addIDOLTask("incrementalindex", internalId, "idolindex", [{value: filename, type: "String"}]);
    }
  }
}


function redoEnable(internalId) {
  var WAITING = lib.smis_Constants.TASK_STATUS_WAITING();
  var smis = lib.IDOL_SMIS.getSMISInstance();

  if (!smis) {
      return false;
  }
  
  var smisTask = new SCFile('SMISTaskQueue', SCFILE_READONLY),
        smisIntId = smis.intId, // SMIS instance ID
        action = 'incrementalindex',
        query = new QueryCond("action",     EQ, action)
           .and(new QueryCond("intId",      EQ, smisIntId))
           .and(new QueryCond("internalId", EQ, internalId))
           .and(new QueryCond("expired",    EQ, false))
           .and(new QueryCond("status",     EQ, WAITING)),
        rc;
  rc = smisTask.doSelect(query);
  if (rc === RC_SUCCESS) {
    return true;
  } 
    
  return false;  
}


function getInternalId(filename) {
  var query = new QueryCond("table.name", EQ, filename);
  var record = new Query('idolpbmhunter', query)[0];
  return record ? record["pbmhunter.id"] : "";
}


function fullreindex(filename) {
  clearCache();

  var idolindex = getIndexRecord(filename);
  IDOLIndexExecutor.fullReindex(idolindex, function() {
    // create incremental task when fullreindex finished
    scheduleSMISIndexTask(filename);
  });
}

// when this function was call by GUI action, pass 'delay' parameter
// create a SMIS task and runs in background
// otherwise it will block the main thread.
function incrementalIndex(filename, delay) {
  clearCache();

  var idolindex = getIndexRecord(filename);
  if (delay) {
    scheduleSMISIndexTask(filename);
  } else { 
    IDOLIndexExecutor.incrementalIndex(idolindex, function() {
      // create task when index finished
      scheduleSMISIndexTask(filename);
    });
  }
}

function manualFullReindex(filename) {
  clearCache();

  var idolindex = getIndexRecord(filename);
  return IDOLIndexExecutor.fullReindex(idolindex);
}

function manualIncrementalIndex(filename) {
  clearCache();
  
  var idolindex = getIndexRecord(filename);
  return IDOLIndexExecutor.incrementalIndex(idolindex);
}

function cancel(filename) {
  var idolindex = getIndexRecord(filename);
  return IDOLIndexExecutor.cancelIndex(idolindex);
}

function getIndexStatus(filename) {
  var idolindex = getIndexRecord(filename);
  return idolindex ? IDOLIndexExecutor.getIndexStatusMessage(idolindex) : [];
}