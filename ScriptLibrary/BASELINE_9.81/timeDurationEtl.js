var JSON = lib.JSON.json();

var _val = funcs.val;
var _type = funcs.type;
var _vars = system.vars;
var _nullsub = funcs.nullsub;
var _tod = funcs.tod;
var _ = lib.Underscore.require();
var log = getLog("ReportETL");

var SMTYPE    = lib.SysUtil.SMTYPE;
var _evaluate = lib.SysUtil._evaluate;
var _parse    = lib.SysUtil._parse;

var ETL_RECORD_TYPE_STATE = "state";
var ETL_RECORD_TYPE_AGM   = "assignment";
var ETL_RECORD_TYPE_PHASE = "phase";

function toJSON(obj) {
  return JSON.stringify( obj );
}

function doWork(log_level)
{
  if ( !log_level ) {
    log_level = "info";
  }

  try
  {
    log.setLevel(log_level);

    if ( !isETLEnabled() )
    {
      if (log.isDebugEnabled()) {
        log.debug("Skip because the ETL is not enabled.");
      }
      return;
    }

    if ( !isSLAEnabled() )
    {
      if (log.isDebugEnabled()) {
        log.debug("Skip because the SLA is not enabled.");
      }
      return;
    }

    var etlFiles = getAllEtlFiles();
    if (log.isDebugEnabled()) {
      log.debug("etlFields: " + toJSON(etlFiles) );
    }
    
    log.info("Start to process the state");
    
    for (var i = 0; i < etlFiles.length; i++)
    {
      var etl = etlFiles[i];
      var lockname = etl.foreigntable + "_td_etl";
      var bLocked = false;

      try
      {
        var etlFields = etl.calcfields;
        if ( !etlFields ) {
          continue;
        }

        if ( Lock(lockname) == RC_SUCCESS )
        {
          bLocked = true;
          etlState( etl.foreigntable, etl.metrics, etl.fromtimequery, etl.lastprocess,
            etlFields[ETL_RECORD_TYPE_STATE], etlFields[ETL_RECORD_TYPE_PHASE], etlFields[ETL_RECORD_TYPE_AGM] );
        }
      }
      catch (e)
      {
        var msg = (e.message) ? e.message : e;
        log.error("Exception caught when file " + etl.foreigntable + ", error: " + msg);
      }
      finally
      {
        if ( bLocked ) {
          Unlock( lockname );
        }
      }

    } // for
    
    log.info("Process the state finished");
  }
  catch ( e )
  {
    var msg = (e.message) ? e.message : e;
    log.error("Exception caught while processing time duration data, error: " + msg );
  }

  forceGC();
}

function escapeTime( tm )
{
  if ( !tm ) {
    return "";
  }

  return _val(tm, 2);
}

/**
 * Only work for specific file
 *
 * @param log_level, default 2 : INFO; 1 : DEBUG
 * @param fileName
 * @param start_time
 * @param end_time
 */
function doWorkOnFile(log_level, fileName, start_time, end_time )
{
  if ( !fileName )
  {
    log.error("doWorkOnFile error, the fileName is not specified.");
    return;
  }

  if ( !start_time )
  {
    log.error("doWorkOnFile error, the start_time is not specified.");
    return;
  }

  if ( !end_time )
  {
    log.error("doWorkOnFile error, the end_time is not specified.");
    return;
  }

  if ( !log_level ) {
    log_level = "info";
  }

  try
  {
    log.setLevel(log_level);

    if ( !isETLEnabled() )
    {
      if (log.isDebugEnabled()) {
        log.debug("Skip because the ETL is not enabled.");
      }
      return;
    }

    if ( !isSLAEnabled() )
    {
      if (log.isDebugEnabled()) {
        log.debug("Skip because the SLA is not enabled.");
      }
      return;
    }

    var etlFiles = getAllEtlFiles( start_time, end_time );
    if (log.isDebugEnabled()) {
      log.debug("etlFields: " + toJSON(etlFiles) );
    }
    
    log.info("Start to process the state");
    
    for (var i = 0; i < etlFiles.length; i++)
    {
      var etl = etlFiles[i];
      if ( etl.foreigntable != fileName ) {
        continue;
      }

      var lockname = etl.foreigntable + "_td_etl_" + start_time;
      var bLocked = false;

      try
      {
        var etlFields = etl.calcfields;
        if ( !etlFields ) {
          continue;
        }

        if ( Lock(lockname) == RC_SUCCESS )
        {
          bLocked = true;

          var lastProcess = getLastModtimeCP( fileName, start_time );

          var calcRet = etlState( etl.foreigntable, etl.metrics, etl.fromtimequery, lastProcess,
                    etlFields[ETL_RECORD_TYPE_STATE], etlFields[ETL_RECORD_TYPE_PHASE], etlFields[ETL_RECORD_TYPE_AGM], true );

          saveLastModtimeCP( fileName, start_time, end_time, calcRet.lastProcess, calcRet.isFinished );
        }
      }
      catch (e)
      {
        var msg = (e.message) ? e.message : e;
        log.error("Exception caught when file " + etl.foreigntable + ", error: " + msg);
      }
      finally
      {
        if ( bLocked ) {
          Unlock( lockname );
        }
      }

    } // for
    
    log.info("Process the state finished");
  }
  catch ( e )
  {
    var msg = (e.message) ? e.message : e;
    log.error("Exception caught while processing time duration data, error: " + msg );
  }

  forceGC();
}

/**
 * Get all the files need to be ETLed
 *
 * @returns {Array}
 *  foreigntable
 *  fromtime
 *  calcfields: [fieldname]
 *
 */
function getAllEtlFiles( fromTime, toTime )
{
  var q = 'enable = true';
  var f = new SCFile('timeDurationControl', SCFILE_READONLY);
  var rc = f.doSelect(q);

  var etlFiles = [];
  while ( rc == RC_SUCCESS )
  {
    if (f.enable)
    {
      var etlFile = {
        "foreigntable" : f['table.name'],
        'fromtime'     : f['calc.from.time'],
        'lastprocess'  : f['calc.last.process'],
        "calcfields"   : null
      };

      if ( !fromTime ) {
        fromTime = etlFile.fromtime;
      }

      etlFile.calcfields = getCalcFields( f['calc.field'] );
      etlFile.metrics = getCalcMetrics( f['calc.metrics'] );
      etlFile.fromtimequery = getCalcFromTimeQuery( fromTime, toTime );

      etlFiles.push(etlFile);
    }

    rc = f.getNext();
  } // while

  return etlFiles;
}

function getCalcFromTimeQuery( fromTime, toTime )
{
  if ( !fromTime ) {
    return "";
  }

  if ( !toTime ) {
    return " AND (sysmodtime >= '" + _val(fromTime, 2) + "') ";
  }

  return " AND ( (sysmodtime >= '" + _val(fromTime, 2) + "') AND (sysmodtime <= '" + _val(toTime, 2) + "') ) ";
}

function getCalcFields( rawFields )
{
  var field = {};
  var rawFieldsCount = rawFields.getSize();
  for ( var i = 0; i < rawFieldsCount; i++ )
  {
    var rawField = rawFields[i];

    if ( rawField['field.enable'] )
    {
      var fieldName = rawField['field.name'];
      field[fieldName] = true;
    }
  } // for

  return field;
}

/**
 * Extract calc.metrics
 * @param rawMetrics
 * @returns {{}}
 */

var MIN_CALC_METRICS_INDEX = 1;
var MAX_CALC_METRICS_INDEX = 5;

function getCalcMetrics( rawMetrics )
{
  var ret = {};
  if ( !ret ) {
    return ret;
  }

  var nMetrics = rawMetrics.getSize();
  for ( var i = 0; i < nMetrics; i++ )
  {
    var rawMetric = rawMetrics[i];
    var fieldName = rawMetric['calc.field.name'];
    var schIndex  = rawMetric['calc.field.num'];

    if ( !fieldName ) {
      continue;
    }

    var field;
    if ( !ret[fieldName] ) {
      ret[fieldName] = {};
    }
    field = ret[fieldName];
    if ( schIndex >= MIN_CALC_METRICS_INDEX && schIndex <= MAX_CALC_METRICS_INDEX)
    {
      var item = {
        "schType"   : rawMetric['calc.sch.type'],
        "schValue"  : rawMetric['calc.sch.value'],
        "tzType"    : rawMetric['calc.tz.type'],
        "tzValue"   : rawMetric['calc.tz.value']
      };

      if ( !item.schType )
      {
        if (log.isDebugEnabled()) {
          log.debug("getCalcMetrics, skip empty schedule type: " + rawMetric);
        }
        continue;
      }

      field[schIndex] = item;
    }
  } // for

  return ret;
}

function getTargetTable( foreignTable )
{
  return "timeDuration4" + foreignTable;
}

function getMaxWorkItem()
{
  var DEFAULT_LIMIT = 200;
  var defCfg = lib.settings.getSettingValue("Report", "TDETL.maxProcessRecord");
  if ( defCfg == null ) {
    defCfg = DEFAULT_LIMIT;
  }
  else {
    defCfg = parseInt( defCfg );
  }

  if ( defCfg <= 0 || defCfg > 5000 ) {
    defCfg = DEFAULT_LIMIT;
  }

  return defCfg;
}

function getTimeDurationControlFile(fileName)
{
  var sql = "table.name=\"" + fileName + "\"";
  var objFile = new SCFile("timeDurationControl", SCFILE_READONLY);

  if (objFile.doSelect(sql) == RC_SUCCESS)
  {
    return objFile;
  }
  return null;
}

function getSLAModControlFile(fileName)
{
  var sql = "table.name=\"" + fileName + "\"";
  var objFile = new SCFile("slamodulecontrol", SCFILE_READONLY);

  if (objFile.doSelect(sql) == RC_SUCCESS)
  {
    return objFile;
  }
  return null;
}

function getFreignFile(fFreignFile, fileName, foreignKey, objSLAModCtl)
{
  var sql = objSLAModCtl.record_id_field + "=\"" + foreignKey + "\"";
  var objFile = fFreignFile;

  if ( !objFile ) {
    objFile = new SCFile(fileName, SCFILE_READONLY);
  }
  //var fields = new Array(objSLAModCtl.record_id_field);
  //if (objSLAModCtl["customer.field"]!=null && objSLAModCtl["customer.field"]!="") fields.push(objSLAModCtl["customer.field"]);
  //if (objSLAModCtl["technician.field"]!=null && objSLAModCtl["technician.field"]!="") fields.push(objSLAModCtl["technician.field"]);
  //if (objSLAModCtl["group.field"]!=null && objSLAModCtl["group.field"]!="") fields.push(objSLAModCtl["group.field"]);
  //var aryCIField = objSLAModCtl["ci.fields"];
  //if (aryCIField!=null && aryCIField.length()>0 && aryCIField[0]!="") fields.push(aryCIField[0]);

  if (objFile.doSelect(sql) == RC_SUCCESS)
  {
    return objFile;
  }
  return null;
}

function etlState( foreignTable, calcMetrics, fromtimequery, lastprocess, bHandleState, bHandlePhase, bHandleAssignLog, ignoreSaveProcess )
{
  if (log.isDebugEnabled()) {
    log.debug("Start to process the state for file: " + foreignTable + ", handle phase: " + (!!bHandlePhase) + ", handle assign log: " + (!!bHandleAssignLog) );
  }

  var targetFile = getTargetTable( foreignTable );

  var fSLAModCtl = getSLAModControlFile( foreignTable );
  if (fSLAModCtl==null || fSLAModCtl.enable==null || fSLAModCtl.enable==false)
  {
    log.info("Skip because the SLM Module Control of " + foreignTable + " is not enabled.");
    return false;
  }

  var q = 'foreign.filename = "' + foreignTable + '"' + getLastModTimeQuery( lastprocess ) + fromtimequery;
  var fRaw = new SCFile( 'slaactive', SCFILE_READONLY );
  fRaw.setOrderBy( ["sysmodtime"], [SCFILE_ASC]);
  var rc = fRaw.doSelect( q );

  if (log.isDebugEnabled()) {
    log.debug("etlState query: " + q );
  }

  var fEtl = new SCFile( targetFile );
  fEtl.doSelect(' false ');

  var cntTask = 0;
  var maxTask = getMaxWorkItem();
  var lastModTime = null;
  var fFreignFile;

  while ( rc == RC_SUCCESS )
  {
    fFreignFile = getFreignFile(fFreignFile, foreignTable, fRaw['foreign.key'], fSLAModCtl);

    if ( !fFreignFile )
    {
      rc = fRaw.getNext();
      continue;
    }

    if ( bHandleState )
    {
      fEtl['foreign.key'] = fRaw['foreign.key'];
      fEtl['field.name']  = ETL_RECORD_TYPE_STATE;

      var stateChanges = getStateChanges(fFreignFile, fSLAModCtl, fRaw['state.change'], fRaw['end.time'], calcMetrics[ETL_RECORD_TYPE_STATE] );
      if ( stateChanges && stateChanges.length > 0 )
      {
        etlDeleteOldState( fEtl['foreign.key'], targetFile );
      }

      for ( var i = 0; i < stateChanges.length; i++ )
      {
        var newChange       = stateChanges[i];
        fEtl['from.value']  = newChange.from;
        fEtl['to.value']    = newChange.to;
        fEtl['change.time'] = newChange.changetime;
        fEtl['rawMetrics1'] = newChange.metrics1;
        fEtl['rawMetrics2'] = newChange.metrics2;
        fEtl['rawMetrics3'] = newChange.metrics3;
        fEtl['rawMetrics4'] = newChange.metrics4;
        fEtl['rawMetrics5'] = newChange.metrics5;

        fEtl['is.sum']      = newChange.isdup;
        fEtl['sum.number']  = newChange.dupcount;
        fEtl['sumMetrics1'] = newChange.sumMetrics1;
        fEtl['sumMetrics2'] = newChange.sumMetrics2;
        fEtl['sumMetrics3'] = newChange.sumMetrics3;
        fEtl['sumMetrics4'] = newChange.sumMetrics4;
        fEtl['sumMetrics5'] = newChange.sumMetrics5;

        rc = fEtl.doInsert();
        if ( rc == -1 )
        {
          // TODO, more graceful error handling
          log.error("Failed to insert record to " + targetFile + ": " + fEtl['foreign.key'] );
        }
        else
        {
          lastModTime = fRaw.sysmodtime;
        }
      } // for
    }

    cntTask++;
    if ( cntTask >= maxTask )
    {
      log.info("Stop because reach the max task limit " + maxTask);
      break;
    }

    if ( bHandlePhase )
    {
      etlWfPhase( fFreignFile, fSLAModCtl, fEtl, foreignTable, fRaw['foreign.key'], fRaw['end.time'], calcMetrics[ETL_RECORD_TYPE_PHASE] );
    }

    if ( bHandleAssignLog )
    {
      etlAssignment( fFreignFile, fSLAModCtl, fEtl, foreignTable, fRaw['foreign.key'], fRaw['end.time'], calcMetrics[ETL_RECORD_TYPE_AGM] );
    }

    rc = fRaw.getNext();
  } // while

  if ( lastModTime && !ignoreSaveProcess ) {
    saveLastModtime( foreignTable, lastModTime );
  }

  if (log.isDebugEnabled()) {
    log.debug("Process the state for file: " + foreignTable + " finished, record converted: " + cntTask);
    log.debug("-=-");
  }
  
  forceGC();

  return {
    "lastProcess" : lastModTime,
    "isFinished" : (cntTask < maxTask)
  };
}

function etlDeleteOldState( key, targetFile )
{
  etlDeleteOld(key, ETL_RECORD_TYPE_STATE, targetFile);
}

function etlDeleteOldWfPhase( key, targetFile )
{
  etlDeleteOld(key, ETL_RECORD_TYPE_PHASE, targetFile);
}

function etlDeleteOldAssignLog( key, targetFile )
{
  etlDeleteOld(key, ETL_RECORD_TYPE_AGM, targetFile);
}

function etlDeleteOld( key, fieldtype, targetFile )
{
  var q = 'field.name = "' + fieldtype + '" AND foreign.key="' + key + '"';
  var fEtl = new SCFile( targetFile );
  var rc = fEtl.doSelect( q );

  while ( rc == RC_SUCCESS )
  {
    fEtl.doRemove();
    rc = fEtl.getNext();
  }
}

/**
 * extract the state.change array from slaactive file
 *
 * @param rawChanges: state.change in slaactive file
 * @param endTime : end.time in slaactive file, could be null
 * @param calcMetrics
 * {
 *    <fieldname>: [ {"schType", "schValue", "tzType", "tzValue" } ]
 * }
 *
 * @returns {Array}
 *   from
 *   to
 *   time
 *   metrics0, datediff( nextchange - currchange )
 *
 */
function getStateChanges( fFreignFile, fSLAModCtl, rawChanges, endTime, calcMetrics )
{
  var stateChanges = [];
  if ( !rawChanges ) {
    return stateChanges;
  }

  var cntStates = rawChanges.getSize();

  var rawChange;
  var rawNextChange;
  var prevState;
  for ( var i = 0; i < cntStates; i++ )
  {
    rawChange = (i > 0)? rawNextChange : rawChanges[i];
    var newChange = {
      "from" : null,
      "to"   : rawChange.state,
      "changetime" : rawChange['time'],
      "nextChangeTime" : null,
      "metrics1" : null,
      "metrics2" : null,
      "metrics3" : null,
      "metrics4" : null,
      "metrics5" : null,
      "dupcount"   : 0,
      "isdup"      : false
    };

    if ( i > 0 ) {
      newChange.from = prevState;
    }

    if ( i >= cntStates - 1 )
    {
      if ( endTime ) {
        newChange.nextChangeTime = endTime;
      }
      else {
        newChange.nextChangeTime = _tod();
      }
    }
    else
    {
      rawNextChange = rawChanges[i + 1];
      newChange.nextChangeTime = rawNextChange['time'];
    }

    // evaluate the calc.metrics fields
    for ( var nMetrics = MIN_CALC_METRICS_INDEX; nMetrics <= MAX_CALC_METRICS_INDEX; nMetrics++ )
    {
      if (!calcMetrics) {
        continue;
      }
      
      var metrics = calcMetrics[nMetrics];
      if ( !metrics || !metrics.schType ) {
        continue;
      }

      var interval = getInterval( fFreignFile, fSLAModCtl, newChange.changetime, newChange.nextChangeTime, metrics.schType, metrics.schValue, metrics.tzType, metrics.tzValue );
      var attrMetrics = "metrics" + nMetrics.toString();
      newChange[attrMetrics] = interval;

      if (log.isDebugEnabled()) {
        log.debug("    New duration: [" + newChange.from + " --> " + newChange.to + "], [" + _val(newChange.changetime,2) + " --> " +
            _val(newChange.nextChangeTime, 2) + "], " + metrics.schValue + ", " + metrics.tzType + ": " + _val(interval, 2) );
      }
    }

    stateChanges.push(newChange);

    prevState = newChange.to;
  } // for

  return etlHandleDupToValue(stateChanges);
}

function getAssignmentInterval( fFreignFile, fSLAModCtl, start, end, schType, schValue, tzType, tzValue, groupName )
{
  var strTZ = vars["$lo.time.zone"];

  if (schValue!=null && schValue!="")
  {
    if (tzType=="customer")
    {
      var strCustomerField = funcs.nullsub(fSLAModCtl["customer.field"], "contact.name");
      var strCustomerValue = fFreignFile[strCustomerField];

      if (strCustomerValue!=null && strCustomerValue!="")
      {
        strTZ = lib.tzFunctions.getTZforContact(strCustomerValue);
      }
    }
    if (tzType=="ci")
    {
      var aryCIField = fSLAModCtl["ci.fields"];
      var strCIField = "logical.name";
      if (aryCIField!=null && aryCIField.length()>0 && aryCIField[0]!="") {
        strCIField = aryCIField[0];
      }
      var strCIValue = fFreignFile[strCIField];

      if (strCIValue!=null && strCIValue!="")
      {
        strTZ = lib.tzFunctions.getTZforDevice(strCIValue);
      }
    }
    if (tzType=="value")
    {
      strTZ = _nullsub(tzValue, strTZ);
    }
    if (tzType=="tech")
    {
      var strTechField = _nullsub(fSLAModCtl["technician.field"], "ticket.owner");
      var strTechValue = fFreignFile[strTechField];

      if (strTechValue!=null && strTechValue!="")
      {
        strTZ = lib.tzFunctions.getTZforOperator(strTechValue);
      }
    }

    if (strTZ==-1) {
      strTZ = vars["$lo.time.zone"];
    }
  }

  var strCalendar = schValue;
  var aryGroupCalendarTz = [];

  if (funcs.nullsub(schType, "")=="group" || funcs.nullsub(tzType, "")=="group")
  {
    var strGroupName = groupName;
    var strGroupFieldName = fSLAModCtl["group.field"];
    if (strGroupFieldName!=null && strGroupFieldName!="") {
      strGroupName = fFreignFile[strGroupFieldName];
    }

    if (groupName != null) {
      strGroupName = groupName;
    }
    aryGroupCalendarTz = lib.SLMCalculation.getCalendarTzFromAssignment(strGroupName);
  }
  if (funcs.nullsub(schType, "") == "group")
  {
    strCalendar = funcs.nullsub(aryGroupCalendarTz[0], strCalendar);
  }
  if (funcs.nullsub(tzType, "") == "group")
  {
    strTZ = funcs.nullsub(aryGroupCalendarTz[1], strTZ);
  }

  return calendar_calc_interval_wrapper( start, end, strCalendar, strTZ );
}

function getInterval( fFreignFile, fSLAModCtl, start, end, schType, schValue, tzType, tzValue )
{
  return getAssignmentInterval( fFreignFile, fSLAModCtl, start, end, schType, schValue, tzType, tzValue, null);
}

var zeroDuration = funcs.parse_evaluate("'00:00:00'", 2);
var _validExpr = _parse("$calendar.calc.interval.wrapper.rt >= '00:00:00'", 2);

function normalizeDuration()
{
  var greaterThanZero = _evaluate( _validExpr );
  //log.debug("normalizeDuration - greaterThanZero: " + greaterThanZero + ", interval: " + _val(vars.$calendar_calc_interval_wrapper_rt, 2) );
  return greaterThanZero ? vars.$calendar_calc_interval_wrapper_rt : zeroDuration;
}

var _calExpr = _parse( '$L.void=rtecall("callrad", NULL, "calendar.calc.interval.wrapper", {"times", "prompt", "name"}, {{$L.time.start, $L.time.end}, $L.duty.table, $L.time.zone}, false, true)', SMTYPE.Expression );
function calendar_calc_interval_wrapper( start, end, dutyTable, timeZone ) {
  vars.$L_time_start = start;
  vars.$L_time_end = end;
  vars.$L_duty_table = dutyTable;
  vars.$L_time_zone = timeZone;

  _evaluate( _calExpr );

  //return vars.$calendar_calc_interval_wrapper_rt;
  return normalizeDuration();
}

function etlWfPhase( fFreignFile, fSLAModCtl, fEtl, foreignTable, key, endTime, calcMetrics )
{
  if (log.isDebugEnabled()) {
    log.debug("Process the WorkflowHistory for " + key);
  }

  var targetFile = getTargetTable( foreignTable );
  etlDeleteOldWfPhase( key, targetFile );
  
  var q = 'linkedTableName = "' + foreignTable + '" AND linkedId="' + key + '"' ;
  var fRaw = new SCFile( 'WorkflowHistory', SCFILE_READONLY );
  fRaw.setOrderBy( [ "sysmodtime" ], [SCFILE_ASC] );
  var rc = fRaw.doSelect( q );

  var rawPhases = [];
  while ( rc == RC_SUCCESS )
  {
    var rawPhase = {
      "from" : fRaw['fromPhase'],
      "to"   : fRaw['toPhase'],
      "changetime" : fRaw['dateTime'],
      "dupcount"   : 0,
      "isdup"      : false
    };
    rawPhases.push( rawPhase );

    rc = fRaw.getNext();
  } // while

  var cntTask = 0;
  rawPhases = etlWfPhaseProcessPhases( fFreignFile, fSLAModCtl, rawPhases, endTime, calcMetrics );

  for ( var i = 0; i < rawPhases.length; i++ )
  {
    var phase = rawPhases[i];

    fEtl['foreign.key'] = key;
    fEtl['field.name']  = ETL_RECORD_TYPE_PHASE;
    fEtl['from.value']  = phase.from;
    fEtl['to.value']    = phase.to;
    fEtl['change.time'] = phase.changetime;
    fEtl['rawMetrics1'] = phase.metrics1;
    fEtl['rawMetrics2'] = phase.metrics2;
    fEtl['rawMetrics3'] = phase.metrics3;
    fEtl['rawMetrics4'] = phase.metrics4;
    fEtl['rawMetrics5'] = phase.metrics5;

    fEtl['is.sum']      = phase.isdup;
    fEtl['sum.number']  = phase.dupcount;
    fEtl['sumMetrics1'] = phase.sumMetrics1;
    fEtl['sumMetrics2'] = phase.sumMetrics2;
    fEtl['sumMetrics3'] = phase.sumMetrics3;
    fEtl['sumMetrics4'] = phase.sumMetrics4;
    fEtl['sumMetrics5'] = phase.sumMetrics5;

    rc = fEtl.doInsert();
    if ( rc == -1 )
    {
      log.error("Failed to insert record to " + targetFile + ": " + key );
    }
    else {
      cntTask++;
    }
  } // for

  //log.debug("Process the WorkflowHistory for " + key + " finished, record converted: " + cntTask);
  // forceGC();
}

function etlWfPhaseProcessPhases( fFreignFile, fSLAModCtl, rawPhases, endTime, calcMetrics )
{
  if ( !rawPhases ) {
    return rawPhases;
  }

  var cntPhases = rawPhases.length;
  for ( var i = 0; i < cntPhases; i++ )
  {
    var rawPhase = rawPhases[i];
    var nextChangeTime;

    if ( i >= cntPhases - 1 )
    {
      if ( endTime ) {
        nextChangeTime = endTime;
      }
      else {
        nextChangeTime = _tod();
      }
    }
    else
    {
      var rawNextPhase = rawPhases[i + 1];
      nextChangeTime = rawNextPhase['changetime'];
    }

    rawPhase.nextChangeTime = nextChangeTime;

    // evaluate the calc.metrics fields
    for ( var nMetrics = MIN_CALC_METRICS_INDEX; nMetrics <= MAX_CALC_METRICS_INDEX; nMetrics++ )
    {
      if (!calcMetrics) {
        continue;
      }
      
      var metrics = calcMetrics[nMetrics];
      if ( !metrics || !metrics.schType ) {
        continue;
      }

      var interval = getInterval( fFreignFile, fSLAModCtl, rawPhase.changetime, rawPhase.nextChangeTime, metrics.schType, metrics.schValue, metrics.tzType, metrics.tzValue );
      var attrMetrics = "metrics" + nMetrics.toString();
      rawPhase[attrMetrics] = interval;

      if (log.isDebugEnabled()) {
        log.debug("    New duration: [" + rawPhase.from + " --> " + rawPhase.to + "], [" + _val(rawPhase.changetime,2) + " --> " + _val(nextChangeTime, 2) + "], " + metrics.schValue + ", " + metrics.tzType );
      }
    }

  } // for

  return etlHandleDupToValue( rawPhases );
}

function etlAssignmentProcessPhases( fFreignFile, fSLAModCtl, rawPhases, endTime, calcMetrics )
{
  if ( !rawPhases ) {
    return rawPhases;
  }

  var cntPhases = rawPhases.length;
  for ( var i = 0; i < cntPhases; i++ )
  {
    var rawPhase = rawPhases[i];
    var nextChangeTime;

    if ( i >= cntPhases - 1 )
    {
      if ( endTime ) {
        nextChangeTime = endTime;
      }
      else {
        nextChangeTime = _tod();
      }
    }
    else
    {
      var rawNextPhase = rawPhases[i + 1];
      nextChangeTime = rawNextPhase['changetime'];
    }

    rawPhase.nextChangeTime = nextChangeTime;

    // evaluate the calc.metrics fields
    for ( var nMetrics = MIN_CALC_METRICS_INDEX; nMetrics <= MAX_CALC_METRICS_INDEX; nMetrics++ )
    {
      if (!calcMetrics) {
        continue;
      }
      
      var metrics = calcMetrics[nMetrics];
      if ( !metrics || !metrics.schType ) {
        continue;
      }

      var interval = getAssignmentInterval( fFreignFile, fSLAModCtl, rawPhase.changetime, rawPhase.nextChangeTime, metrics.schType, metrics.schValue, metrics.tzType, metrics.tzValue, rawPhase.to );
      var attrMetrics = "metrics" + nMetrics.toString();
      rawPhase[attrMetrics] = interval;

      if (log.isDebugEnabled()) {
        log.debug("    New duration: [" + rawPhase.from + " --> " + rawPhase.to + "], [" + _val(rawPhase.changetime,2) + " --> " + _val(nextChangeTime, 2) + "], " + metrics.schValue + ", " + metrics.tzType );
      }
    }

  } // for

  return etlHandleDupToValue( rawPhases );
}

/**
 * Handle the duplication of to-values
 * This routine might be call by etlWtfPhase and etlAssignmentLog
 *
 * @param rawPhases
 * @param endTime
 * @param calcMetrics
 * @returns {*}
 */
function etlHandleDupToValue( rawPhases )
{
  if ( !rawPhases ) {
    return rawPhases;
  }

  var cntPhases = rawPhases.length;
  for ( var i = 0; i < cntPhases; i++ )
  {
    var item = rawPhases[i];
    if ( item.dupcount && item.dupcount >= 1 ) {
      continue;
    }

    item.sumMetrics1 = item.metrics1;
    item.sumMetrics2 = item.metrics2;
    item.sumMetrics3 = item.metrics3;
    item.sumMetrics4 = item.metrics4;
    item.sumMetrics5 = item.metrics5;

    var baseTo = item.to;
    item.dupcount = 1;
    var durations = [];
    durations.push( item.metrics1 );
    durations.push( item.metrics2 );
    durations.push( item.metrics3 );
    durations.push( item.metrics4 );
    durations.push( item.metrics5 );

    var dupCount = 1;
    var prevItem = null;
    for ( var j = i+1; j < cntPhases; j++ )
    {
      var nextItem = rawPhases[j];
      if ( nextItem.dupcount && nextItem.dupcount >= 1 ) {
        continue;
      }

      var nextTo = nextItem.to;
      //log.debug("baseTo: " + baseTo + ", nextTo: " + nextTo)

      if ( nextTo === baseTo )
      {
        dupCount++;
        nextItem.dupcount = dupCount;
        // Only set the "is.sum" of last record as true
        if ( prevItem ) {
          prevItem.isdup = false;
        }
        nextItem.isdup = true;
        prevItem = nextItem;

        durations = updateDurations( durations, nextItem );
      }
    } // for j

    if ( dupCount == 1 ) {
      item.isdup = true;
    }
  } // for i

  return rawPhases;
}

/**
 * Add newItem.metrics1..5 to durations Array and return it
 *
 * @param durations
 * @param nextItem
 */
function updateDurations( durations, nextItem )
{
  if ( !durations || !nextItem ) {
    return durations;
  }

  durations[0] = addInterval( durations[0], nextItem.metrics1 );
  durations[1] = addInterval( durations[1], nextItem.metrics2 );
  durations[2] = addInterval( durations[2], nextItem.metrics3 );
  durations[3] = addInterval( durations[3], nextItem.metrics4 );
  durations[4] = addInterval( durations[4], nextItem.metrics5 );

  nextItem.sumMetrics1 = durations[0];
  nextItem.sumMetrics2 = durations[1];
  nextItem.sumMetrics3 = durations[2];
  nextItem.sumMetrics4 = durations[3];
  nextItem.sumMetrics5 = durations[4];

  return durations;
}

function addInterval( intv1, intv2 )
{
  if ( !intv1 || !intv2 ) {
    return intv1;
  }

  var strIntv = "'" + _val(intv1, 2) + "' + '" + _val(intv2, 2) + "'";
  return funcs.parse_evaluate( strIntv, 2);
}

function etlAssignment( fFreignFile, fSLAModCtl, fEtl, foreignTable, key, endTime, calcMetrics )
{
  if (log.isDebugEnabled()) {
    log.debug("Process the assignmentlog for " + key);
  }

  var targetFile = getTargetTable( foreignTable );
  etlDeleteOldAssignLog( key, targetFile );

  var q = 'foreign.filename = "' + foreignTable + '" AND foreign.key="' + key + '"' ;
  var fRaw = new SCFile( 'assignmentlog', SCFILE_READONLY );

  //log.debug("etlAssignment query: " + q );
  fRaw.setOrderBy( ["sysmodtime"], [SCFILE_ASC]);
  var rc = fRaw.doSelect( q );

  var rawLogs = [];
  while ( rc == RC_SUCCESS )
  {
    var rawLog = {
      "from" : fRaw['from.value'],
      "to"   : fRaw['to.value'],
      "changetime" : fRaw['change.time'],
      "dupcount"   : 0,
      "isdup"      : false
    };
    rawLogs.push( rawLog );

    rc = fRaw.getNext();
  } // while

  var cntTask = 0;
  rawLogs = etlAssignmentProcessPhases( fFreignFile, fSLAModCtl, rawLogs, endTime, calcMetrics );
  for ( var i = 0; i < rawLogs.length; i++ )
  {
    var phase = rawLogs[i];

    fEtl['foreign.key'] = key;
    fEtl['field.name']  = ETL_RECORD_TYPE_AGM;
    fEtl['from.value']  = phase.from;
    fEtl['to.value']    = phase.to;
    fEtl['change.time'] = phase.changetime;
    fEtl['rawMetrics1'] = phase.metrics1;
    fEtl['rawMetrics2'] = phase.metrics2;
    fEtl['rawMetrics3'] = phase.metrics3;
    fEtl['rawMetrics4'] = phase.metrics4;
    fEtl['rawMetrics5'] = phase.metrics5;

    fEtl['is.sum']      = phase.isdup;
    fEtl['sum.number']  = phase.dupcount;
    fEtl['sumMetrics1'] = phase.sumMetrics1;
    fEtl['sumMetrics2'] = phase.sumMetrics2;
    fEtl['sumMetrics3'] = phase.sumMetrics3;
    fEtl['sumMetrics4'] = phase.sumMetrics4;
    fEtl['sumMetrics5'] = phase.sumMetrics5;

    rc = fEtl.doInsert();
    if ( rc == -1 )
    {
      log.error("Failed to insert record to " + targetFile + ": " + key );
    }
    else {
      cntTask++;
    }
  } // for

  //log.debug("Process the assignmentlog for " + key + " finished, record converted: " + cntTask);
  // forceGC();
}

function getLastModTimeQuery( oldLastMod )
{
  if ( !oldLastMod ) {
    return "";
  }

  var strLastMod = _val( oldLastMod, 2 );
  var q = " AND (sysmodtime > '" + strLastMod + "') ";

  return q;
}

/**
 * Save the last mod time on specific field
 *
 * @param tablename
 * @param lastModTime
 * @returns {*}
 */
function saveLastModtime( tablename, lastModTime )
{
  if ( !tablename )
  {
    log.error("saveLastModtime, empty table name provided");
    return null;
  }

  var q = 'table.name="' + tablename + '"';
  var f = new SCFile('timeDurationControl');
  var rc = f.doSelect(q);

  if ( rc == RC_SUCCESS )
  {
    f['calc.last.process'] = lastModTime;
    rc = f.doUpdate();
  }

  if (log.isDebugEnabled()) {
    log.debug("saveLastModtime for table: " + tablename + ", rc: " + rc + ", lastModTime: " + _val(lastModTime, 2) );
  }

  return null;
}

function resetLastModtime()
{
  var q = 'true';
  var f = new SCFile('timeDurationControl');
  var rc = f.doSelect(q);
  while ( rc == RC_SUCCESS )
  {
    f['calc.last.process'] = null;
    rc = f.doUpdate();
    rc = f.getNext();
  }
}

/**********************************************************************************/

/**
 * Get the latest sysmodtime
 *
 * @param tablename
 * @returns {Date}
 */
function getLastModtimeCP( tablename, start_time )
{
  if ( !tablename )
  {
    log.error( "getLastModtimeCP, empty table name provided" );
    return null;
  }

  if ( !start_time )
  {
    log.error("getLastModtimeCP, empty start time");
    return null;
  }

  var q = 'table.name="' + tablename + '" AND start.time = \'' + _val(start_time, 2) + '\' ';
  var f = new SCFile('tdcheckpoint', SCFILE_READONLY);
  f.setFields(["last.process"]);
  var rc = f.doSelect(q);

  if ( rc == RC_SUCCESS ) {
    return f['last.process'];
  }

  return null;
}

/**
 * Save the last mod time on specific field
 *
 * @param tablename
 * @param lastModTime
 * @returns {*}
 */
function saveLastModtimeCP( tablename, start_time, end_time, lastModTime, isFinished )
{
  if ( !tablename )
  {
    log.error("saveLastModtimeCP, empty table name provided");
    return null;
  }

  if ( !start_time )
  {
    log.error("saveLastModtimeCP, empty start time");
    return null;
  }

  var q = 'table.name="' + tablename + '" AND start.time = \'' + _val(start_time, 2) + '\' ';
  var f = new SCFile('tdcheckpoint');
  var rc = f.doSelect(q);

  if ( rc == RC_SUCCESS )
  {
    if ( lastModTime ) {
      f['last.process'] = lastModTime;
    }

    f['finished'] = !!isFinished;
    rc = f.doUpdate();
  }
  else
  {
    f['table.name'] = tablename;
    f['start.time'] = _val(start_time, 3);
    f['end.time'] = _val(end_time, 3);

    if ( lastModTime ) {
      f['last.process'] = lastModTime;
    }
    f['finished'] = !!isFinished;

    rc = f.doInsert();
  }

  return null;
}

/**********************************************************************************/

function isETLEnabled()
{
  var rptEnabled = lib.settings.getSettingValue("Report", "Enable.TimeDurationETL");

  return ( !rptEnabled || (rptEnabled.toString() === "false") )? false : true;
}

function isSLAEnabled()
{
  var slaEnabled = false;

  if (vars["$G.sla.environment"]!=null && vars["$G.sla.environment"].enable) {
    slaEnabled = true;
  }

  return slaEnabled;
}

