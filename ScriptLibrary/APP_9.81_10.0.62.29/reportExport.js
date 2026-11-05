/*
 Populate the data for array of dashboard and report of a report-schedule-occurrance
 */ 
 
var libRs = lib.ReportService;
var log = getLog("ReportExport");
var _str = funcs.str;
var _denull = funcs.denull;
var _nullsub = funcs.nullsub;
var _userlang = funcs.userlang;
var _sysinfo_get = funcs.sysinfo_get;
var _iscurrent = funcs.iscurrent;
var _sysInfo = system.sysinfo;


function toJSON(obj) {
  return JSON.stringify(obj);
}

var PHASE_CREATED         =  "created";           // The task is just created, no data generated
var PHASE_DATA_PREPARING  =  "preparing";         // Some scheduler is working to prepare the data for this task
var PHASE_DATA_PREPARED   =  "prepared";          // The data for this occurrence is prepared, but not exported yet
var PHASE_DATA_SENDING    =  "sending";           // Scheduler(s) is sending the report
var PHASE_EXPORT_DONE     =  "exported";          // Done processing on this task, we can remove this task now

var MSG_CLASS_REPORT      = "Reporting";
var INFO_ABORT_EMAIL      = 300;                  // Abort exporting via mail because of the "Stop exporting to Email" option is enabled
//var ERR_NO_BASE_PATH      = 301;                  // Base path is not defined
var INFO_NO_EXPORT_ACTION = 302;                  // No export action performed
var INFO_TASK_EXPIRED     = 303;                  // Task exported because it's expired
var ERR_TASK_RETRY        = 304;                  // Aborted because failed to prepare the report data after %S retries
var ERR_GENERAL_FAILURE   = 306;                  // General export failure, e.g. failed when call jar method

function initLog(logLevel)
{
  log.setLevel(logLevel);
}

function createJsRuntimeError(msg){
  return lib.RemoteJavascriptService.createError('0009', 'JsRuntimeError', msg);
}

/*
 Input:
 inbox_ids: array of report ids to generate report data

 Output (Datum Array):
 [
 {
 "id" : <inbox_id>
 "succeed" : true/false
 "retVal" : <content>|<exception>
 }
 ]
 */
function genReports( inbox_ids )
{
  var ret = new SCDatum();
  ret.setType(8);

  // !!! TODO, time benchmark
  var i;
  for ( i = 0; inbox_ids && (i < inbox_ids.length); i++ )
  {
    if (log.isDebugEnabled()) {
      log.debug("Exporting dashboard: " + inbox_ids[i]);
    }

    ret.push( toJSON(genReport(inbox_ids[i])) );
  }

  return ret;
}

function genReport( inbox_id )
{
  // !!! TODO, time benchmark
  var ret = {
    "id" : inbox_id,
    "succeed" : true,
    "gadget" : null
  };

  try{
    ret.gadget = libRs.genGadgetData( inbox_id, false, true );
  }
  catch (e)
  {
    ret.succeed = false;

    if (!e.errorCode) {
      e = createJsRuntimeError(e.message);
    }
    ret.error = e;
  }

  return ret;
}

/*
 Input:
 dashboard_ids: array of dashoard ids to generate report data

 Output (Datum Array):
 [
 {
 "dashboard_id" : <dashboard_id>
 "succeed" : true/false
 "retVal" :
 [
 {
 "id" : <inbox_id>
 "retVal" : <content>|<exception>
 }
 ]
 }
 ]
 */

function genDashboards( dashboard_ids )
{
  var ret = new SCDatum();
  ret.setType(8);

  var i;
  for ( i = 0; dashboard_ids && (i < dashboard_ids.length); i++ )
  {
    // !!! TODO, time benchmark
    if (log.isDebugEnabled()) {
      log.debug("Exporting dashboard: " + dashboard_ids[i]);
    }
    ret.push( toJSON(genDashboard(dashboard_ids[i])) );
  }

  return ret;
}

function getDashboardsMeta( dashboard_ids )
{
  var ret = new SCDatum();
  ret.setType(8);

  var i;
  for ( i = 0; dashboard_ids && (i < dashboard_ids.length); i++ )
  {
    if (log.isDebugEnabled()) {
      log.debug("Get dashboard layout: " + dashboard_ids[i]);
    }
    var layout = null;
    try
    {
      layout = lib.reportDashboard.queryDashboard(dashboard_ids[i], log);
    }
    catch( e )
    {
      log.info("Get DashboardsLayout failed, dashboard id: " + dashboard_ids[i] + ", error: " + e.message );
    }

    ret.push( toJSON(layout) );
  }

  return ret;
}

/*
 Output:
 {
 "dashboard_id" : <dashboard_id>
 "succeed" : true/false
 "retVal" :
 [
 {
 "id" : <inbox_id>
 "succeed" : true/false
 "retVal" : <content>|<exception>
 }
 ]
 }
 */
function genDashboard( dashboard_id )
{
  var ret = {
    "dashboard_id" : dashboard_id,
    "succeed" : true,
    "gadgets"  : []
  };

  var report_ids = null;

  try
  {
    report_ids = genAllReportFromDashboard( dashboard_id );

    var nReport;
    for ( nReport = 0; nReport < report_ids.length; nReport++ )
    {
      var reportData = genReport( report_ids[nReport] );

      ret.gadgets.push(reportData);
    } // for each report defined

  }
  catch ( e )
  {
    ret.succeed = false;
    if (!e.errorCode) {
      e = createJsRuntimeError(e.message);
    }
    ret.error = e;
  }

  return ret;
}

/*
 Input: dashboard id
 Output: array of report id
 [report_id]

 Assume the dashboard is in column mode
 */
function genAllReportFromDashboard( dashboard_id )
{
  var report_ids = [];

  var ret = libRs.queryDashboard( dashboard_id );
  var content = ret.content;
  var zones = content.dropZones;

  var nZone;
  for ( nZone = 0; nZone < zones.length; nZone++ )
  {
    var zone = zones[nZone];

    var nChild;
    for ( nChild = 0; zone.children && (nChild < zone.children.length); nChild++ )
    {
      var child = zone.children[nChild];
      var gadgets = child.gadgets;

      var nReport;
      for ( nReport = 0; nReport < gadgets.length; nReport++ )
      {
        report_ids.push(gadgets[nReport].id);
      } // reports

    } // for children
  } // for each dropzones

  return report_ids;
}

function isTaskExpired( start_date )
{
  var iExpireDay = lib.settings.getSettingValue( "Report", "Export.expire.days" );
  if ( !iExpireDay ) {
    iExpireDay = 3;
  }
  iExpireDay = funcs.val(iExpireDay, 1);

  var dtNow = new Date();
  var dDate = start_date;
  dDate.setDate( start_date.getDate() + iExpireDay );

  return dDate.getTime() < dtNow.getTime();
}

function getWorkerid()
{
  return _sysInfo.ServerNetAddress + "-" + _sysInfo.ServerPID;
}

/**
 * Prepare data for export task
 * Caution, there might be multiple schedulers running this function simultaneously
 *
 * @param log_level
 */
var getMailbody = lib.htmlemailtemplates.getMailBody;
function doPrepareData( log_level )
{
  if ( !lib.reportCmn.isReportingEnabled() ) {
    return;
  }

  if ( !log_level ) {
    log_level = 2;
  }
  log.setLevel(log_level);

  if (log.isDebugEnabled()) {
    log.debug("------- Preparing data for export ------");
  }

  // 0. Mark all the PREPARING tasks as CREATED, if some task cannot be completed in 1 iteration, then there should be something wrong, we need to processed from the begining
  tasksResetPreparing();

  var scheduleOp = funcs.operator();
  var oldBG = vars['$G.bg'];

  // 1. Fetch 1 task marked as CREATED
  var f = new SCFile('reportscheduleTask');
  f.setOrderBy(["owner"], [SCFILE_ASC]);

  var now = new XMLDate(new Date());
  now = now.getSCDateTimeString();

  var q = 'current.phase = "' + PHASE_CREATED + '"';
  q += ' and start.date <= \'' + now + '\' ';
  q += ' and active = true ';

  var preOwner = "";
  if ( scheduleOp )
  {
    if (log.isDebugEnabled()) {
      log.debug("Current Operator: " + scheduleOp );
    }
    preOwner = scheduleOp;
  }

  var cnt = 0;
  var rc = f.doSelect( q );
  while ( rc == RC_SUCCESS )
  {
    var lockname = f.id;
    try{

      // 2. Set the current.phase to PREPARING
      // 2.1 if failed, back to step 1
      if ( f.current_phase == PHASE_CREATED && ( Lock(lockname) == RC_SUCCESS ) )
      {
        f.current_phase = PHASE_DATA_PREPARING;
        f.preparing_time = funcs.tod();

        rc = f.doUpdate();
        Unlock(lockname);
      }
      else
      {
        rc = RC_MODIFIED;
      }

      if ( rc == RC_SUCCESS )
      {
        f.duration = 0;
        f.duration_data = 0;
        f.duration_export = 0;

        var bExpired = isTaskExpired(f.start_date);

        if (bExpired)
        {
          f.finish_date = funcs.tod();
          f.current_phase = PHASE_EXPORT_DONE;
          f.succeed = false;
          f.message_id.push(INFO_TASK_EXPIRED);

          if (log.isDebugEnabled()) {
            log.debug("Task exported because it's expired, task-id: " + f.id);
          }
        }
        else
        {
          if (f.flag_email)
          {
            if (isStopExportViaMail())
            {
              f.flag_email = false;
              f.message_id.push(INFO_ABORT_EMAIL);
              if (log.isDebugEnabled()) {
                log.debug('Abort exporting via mail because of the "Stop exporting to Email" option is enabled, task-id: ' + f.id);
              }
            }
          }

          if (!f.flag_email && !f.flag_file)
          {
            f.message_id.push(INFO_NO_EXPORT_ACTION);
            f.succeed = false;
            f.current_phase = PHASE_EXPORT_DONE;
            f.finish_date = funcs.tod();
            if (log.isDebugEnabled()) {
              log.debug('No export action performed, task-id: ' + f.id);
            }
          }
          else
          {
            var tmStart = new Date();

            // 2.2 Switch to the timezone and login as owner of current operator
            var taskOwner = f.owner;
            if (preOwner !== taskOwner)
            {
              if (log.isDebugEnabled()) {
                log.debug("Switching to operator: " + taskOwner + ", previous: " + preOwner);
              }
              if (cnt > 0) {
                setOpertor(scheduleOp);
              }

              // !!! Caution, MUST call setOperator resetsession, because in side of resetsession, it would reset the mandaten data using new operator name
              setOpertor(taskOwner);
              var dTmp = new Datum();
              funcs.rtecall("resetsession", dTmp);

              loginAs(taskOwner);
              if (log.isDebugEnabled()) {
                log.debug("Operator context switch complete");
              }

              preOwner = taskOwner;
            }

            f.langcode = system.sysinfo.languagecode;
            if (f.flag_email)
            {
              // Prepare the mail content
              f.email_content = getMailbody("Report Exported", f, f, null, f.langcode);
            }

            f.copyright = funcs.scmsg("copyright", "Reporting");
            // 3. Prepare data for the task
            taskGenerateData(f);

            var tmEnd = new Date();
            f.duration = tmEnd - tmStart;
            f.duration_data = tmEnd - tmStart;

            // 4. Set the current.phase to PREPARED
            f.current_phase = PHASE_DATA_PREPARED;
          }
        }

        rc = f.doUpdate();
        if ( rc == RC_SUCCESS ) {
          cnt++;
        }

        if (log.isDebugEnabled()) {
          log.debug("data prepared: " + f.id + ", rc: " + rc + ", modcount: " + f.sysmodcount);
        }
      } // doupdate
    }
    catch (e)
    {
      Unlock(lockname);
      setOpertor( scheduleOp );
      log.error("Preparing data failed for task: " + f.id + ", error: " + e.message);
    }

    rc = f.getNext();

    vars['$G.bg'] = oldBG;
  } // while

  setOpertor( scheduleOp );
  if (log.isDebugEnabled()) {
    log.debug( "Prepared " + cnt + " tasks." );
  }

  forceGC();
}

function isStopExportViaMail()
{
  var optDisabled = lib.settings.getSettingValue("Report", "Export.email.disabled");
  return ( optDisabled && (optDisabled.toString() === "true") )? true: false;
}

/**
 * Generate file path for export task, owner + task_name;
 *
 * @param basePath : base path
 * @param fTask :  task def
 * @param opName : operator name
 */
function getExportPath( taskName, opName, startDate )
{
  if ( taskName ) {
    taskName = "_" + taskName.replace(/(<|>|\/|\\|\||\*|\*|\")/g, '');
  }
  else {
    taskName = "";
  }

  var relativePath = opName + taskName + "_" + getExportDateStr( startDate ) ;
  relativePath = relativePath.replace("%20", " ");

  return relativePath;
}

/**
 * Export the report schedules
 * Caution, there might be multiple schedulers running this function simultaneously
 *
 * @param log_level
 */
function doExport(log_level)
{
  if (!log_level) {
    log_level = 2;
  }

  log.setLevel(log_level);

  if (log.isDebugEnabled() && lib.reportCmn.isReportingEnabled()) {
    log.debug("------- Do exporting ------");
  }

  // 0. Mark all the SENDING tasks as PREPARED, if some task cannot be completed in 1 iteration, then there should be something wrong, we need to processed from the beginning
  tasksResetSending();

  // 1. Fetch 1 task marked as CREATED
  var f = new SCFile('reportscheduleTask');

  var now = new XMLDate(new Date());
  now = now.getSCDateTimeString();

  var q = 'current.phase = "' + PHASE_DATA_PREPARED + '"';
  q += ' and start.date <= \'' + now + '\' ';
  q += ' and active = true ';

  var cnt = 0;
  var rc = f.doSelect(q);
  while (rc == RC_SUCCESS)
  {
    var lockname = f.id;
    try {
      if ( f.current_phase == PHASE_DATA_PREPARED && ( Lock(lockname) == RC_SUCCESS ))
      {
        // 2. Set the current.phase to PREPARING
        // 2.1 if failed, back to step 1
        f.current_phase = PHASE_DATA_SENDING;
        f.exporting_time = funcs.tod();
        rc = f.doUpdate();
        Unlock(lockname);
      }
      else
      {
        rc = RC_MODIFIED;
      }

      if ( rc == RC_SUCCESS )
      {
        var tmStart = new Date();
        if (f.flag_email)
        {
          if (isStopExportViaMail())
          {
            f.flag_email = false;
            f.message_id.push(INFO_ABORT_EMAIL);
            if (log.isDebugEnabled()) {
              log.debug('Abort exporting via mail because of the "Stop exporting to Email" option is enabled, task-id: ' + f.id);
            }
          }
        }

        rc = RC_SUCCESS;
        if (!f.flag_email && !f.flag_file)
        {
          f.message_id.push(INFO_NO_EXPORT_ACTION);
          f.succeed = false;
          if (log.isDebugEnabled()) {
            log.debug('No export action performed, task-id: ' + f.id);
          }
        }
        else
        {
          if ( f.flag_file )
          {
            // Prepare the export path since it contains export-time which is timezone related
            var filePath = getExportPath( f.name, f.owner, f.start_date );
            if (log.isDebugEnabled()) {
              log.debug( "Export file path: " + filePath );
            }
            f.export_path = filePath;
          }

          rc = taskDoExport(f);
          var tmEnd = new Date();
          f.duration += tmEnd - tmStart;
          f.duration_export = tmEnd - tmStart;
          f.succeed = ( rc == RC_SUCCESS );
          if ( rc != RC_SUCCESS ) {
            f.message_id.push(ERR_GENERAL_FAILURE);
          }
        }

        if (!f.message_id || f.message_id.getSize() <= 0) {
          f.message_id = null;
        }

        f.current_phase = PHASE_EXPORT_DONE;
        f.finish_date = funcs.tod();

        if ( rc == RC_SUCCESS ) {
          rc = f.doUpdate();
        }
        if ( rc == RC_SUCCESS ) {
          cnt++;
        }

        if (log.isDebugEnabled()) {
          log.debug("Task export finished: " + f.id + ", rc: " + rc);
        }
      } // doupdate
    }
    catch (e) {
      Unlock(lockname);
      log.error("Sending data failed for task: " + f.id + ", error: " + e.message);
    }

    rc = f.getNext();
  } // while

  if ( cnt > 0 || lib.reportCmn.isReportingEnabled())
  {
    if (log.isDebugEnabled()) {
      log.debug( "Exported " + cnt + " tasks." );
    }
    forceGC();
  }
}

function moveFinishedTasksToHistory()
{
  if (log.isDebugEnabled()) {
    log.debug("------- Moving finished Tasks to History ------");
  }

// 1. Fetch 1 task marked as CREATED
  var f = new SCFile('reportscheduleTask');
  var q = 'current.phase = "' + PHASE_EXPORT_DONE + '"';
  var rc = f.doSelect( q );

  var cnt = 0;

  while ( rc == RC_SUCCESS )
  {
    var lockname = f.id;
    try
    {
      if ( Lock(lockname) == RC_SUCCESS )
      {
        moveTaskToHistory( f );
        Unlock(lockname);
        rc = f.getNext();

        if ( rc == RC_SUCCESS ) {
          cnt++;
        }
      }
    }
    catch ( e )
    {
      Unlock(lockname);
      log.error("Sending data failed for task: " + f.id + ", error: " + e.message);
    }

  } // while

  if (log.isDebugEnabled()) {
    log.debug(cnt + " tasks moved to history file");
  }
  forceGC();
}

function moveTaskToHistory( fTask )
{
  var sId = fTask.id;

  var sQuery = "id=\"" + sId + "\"";
  var f  = new SCFile("reportScheduleHistory");
  var rc = f.doSelect( sQuery );
  if (log.isDebugEnabled()) {
    log.debug("Task Query: " + sQuery + ", rc: " + rc);
  }

  if ( rc != RC_SUCCESS )
  {
    f.id              =  sId;
    f.definition_id   = fTask.definition_id;
    f.start_date      = fTask.start_date;
    f.owner           = fTask.owner;
    f.finished_time   = fTask.finish_date;

    f.succeed         = fTask.succeed;
    f.message_id      = fTask.message_id;
    f.duration        = fTask.duration;
    f.duration_data   = fTask.duration_data;
    f.duration_export = fTask.duration_export;
    // f.folder

    if ( fTask.doDelete() == RC_SUCCESS )
    {
      // Only the thread who deleted task successfully can insert the history record, so that we can synch multiple workers
      if (f.doSave()==RC_SUCCESS)
      {
      	var attach=new SCFile("SYSATTACHMENTS");
		var sql='application="reportscheduleTask" and topic="' + sId+ '"'; 
    	var rtn = attach.doSelect(sql);
    
    	while( rtn == RC_SUCCESS)
    	{
    		attach.application="reportScheduleHistory";
    		attach.doUpdate();
    		rtn = attach.getNext();        
    	}	      	
      }
    }
  }
}

/**
 * Mark all the PREPARING tasks as CREATED
 */
function tasksResetPreparing()
{
  var cnt = 0;
  var MAX_RETRY = 3;

  try {
    var f = new SCFile('reportscheduleTask');
    var rc = f.doSelect('current.phase = "' + PHASE_DATA_PREPARING + '" and ( (preparing.time < tod() - \'00:30:00\') or ( null(preparing.time) ) ) ');

    while (rc == RC_SUCCESS)
    {
      if (f.retry_count > MAX_RETRY)
      {
        f.succeed = false;
        f.current_phase = PHASE_EXPORT_DONE;
        f.finish_date = funcs.tod();
        f.message_id.push(ERR_TASK_RETRY);
      }
      else
      {
        f.retry_count++;
        f.current_phase = PHASE_CREATED;
        f.preparing_time = new Date();
      }

      f.doUpdate();

      rc = f.getNext();
      cnt++;
    }
    f.doClose();
  }
  catch (e)
  {
    log.error("Reset tasks failed, error: " + e.message);
  }

  if (log.isDebugEnabled()) {
    log.debug("Reset " + cnt + " PREPARING task(s)");
  }
}

/**
 * Mark all the SENDING tasks as PREPARED
 */
function tasksResetSending()
{
  var cnt = 0;
  var MAX_RETRY = 3;

  try {
    var f = new SCFile('reportscheduleTask');
    var rc = f.doSelect('current.phase = "' + PHASE_DATA_SENDING + '" and ( exporting.time < tod() - \'00:30:00\' or ( null(exporting.time) ) ) ');

    while (rc == RC_SUCCESS)
    {
      if (f.retry_count > MAX_RETRY)
      {
        f.succeed = false;
        f.current_phase = PHASE_EXPORT_DONE;
        f.finish_date = funcs.tod();
        f.message_id.push(ERR_TASK_RETRY);
      }
      else
      {
        f.retry_count++;
        f.current_phase = PHASE_DATA_PREPARED;
        f.exporting_time = new Date();
      }
      f.doUpdate();
      rc = f.getNext();
      cnt++;
    }
    f.doClose();
  }
  catch (e)
  {
    log.error("Reset SENDING tasks failed, error: " + e.message);
  }

  if (log.isDebugEnabled()) {
    log.debug("Reset " + cnt + " SENDING task(s)");
  }
}

function taskGenerateData( task )
{
  var dashboardids = task.inbox_dashboard.toArray();
  var reportids = task.inbox_report.toArray();

  var ret;
  var i;
  var size;
  var tmp;

  if ( dashboardids && (dashboardids.length > 0) )
  {
    ret = genDashboards( dashboardids );

    if ( ret && ret.getSize() > 0 )
    {
        size = ret.getSize();
    	for (i = 0; i < size; i++)
    	{
    		tmp = ret[i];
			ret[i] = tmp.replace(/&/g, "&amp;");
		}  
    	
    	task.data_dashboard = ret;
      	task.dashboard_layout = getDashboardsMeta( dashboardids );
    }
  }

  if ( reportids && (reportids.length > 0) )
  {
    ret = genReports( reportids );
	
	if ( ret && ret.getSize() > 0 )
	{
	    size = ret.getSize();
		for (i = 0; i < size; i++)
    	{
    		tmp = ret[i];
			ret[i] = tmp.replace(/&/g, "&amp;");
		}
	
		task.data_report = ret;	
	}
      
  }
}

function getExportDateStr( dt )
{
  // uses system date time
  var strMon = dt.getMonth() + 1;
  if (strMon.toString().length < 2) {
    strMon = "0" + strMon;
  }

  var strDay = dt.getDate();
  if (strDay.toString().length < 2) {
    strDay = "0" + strDay;
  }

  return dt.getFullYear() + "-" + strMon + "-" + strDay;
}

/**
 * Get Mail addresses from operator name list
 * @param opNames
 * @param (SCDatum Array, out)arrAddress
 */
function getMailAddrsFromName( opNames, arrAddress )
{
  var q = 'SELECT email FROM operator WHERE name isin ' + _str( _denull(opNames) );
  var f = new SCFile("operator", SCFILE_READONLY);
  var rc = f.doSelect(q);

  while ( rc == RC_SUCCESS )
  {
    var addr = f.email;
    if ( addr && addr.length > 0 )
    {
      arrAddress.push(addr);
    }

    rc = f.getNext();
  }
}

/**
 * Get mail addresses of all members of specific Assignment Groups
 * @param (SCDatum Array, in) groupNames - name of assignment groups
 * @param (SCDatum Array, out) arrAddress
 */
function getMailAddrsFromGroups( groupNames, arrAddress )
{
  var q = 'SELECT operators FROM assignment WHERE name isin ' + _str( _denull(groupNames) );
  var f = new SCFile("assignment", SCFILE_READONLY);
  var rc = f.doSelect(q);

  while ( rc == RC_SUCCESS )
  {
    var opNames = f.operators;
    if ( opNames && opNames.getSize() > 0 )
    {
      getMailAddrsFromName( opNames, arrAddress );
    }

    rc = f.getNext();
  }
}

function taskDoExport( task )
{
  if ( task.flag_email )
  {
    var arrAddress = new SCDatum();
    arrAddress.setType(8);
    getMailAddrsFromName( task.email_to_users, arrAddress );
    getMailAddrsFromGroups( task.email_to_groups, arrAddress );

    task.email_addresses = arrAddress.join(";");
  }
 
  var ret=HandleReportExportTask2 ( task, task.export_path ); 
  
  if (task.flag_email && ret==RC_SUCCESS) {
		if ( task.flag_notification )
		{
			var notification = "Report Exported";
			if (task.email_notification_name)
			{
				notification = task.email_notification_name;
			}
			ret = callrad("us.notify", ["name", "record"], [notification, task]);
        	
       	} else {        
  			var feventout=new SCFile("eventout");
  			
  			var newId = new Datum();    	   		
			ret = funcs.getnumber(newId, "event");
			if ( ret == RC_SUCCESS )
			{
				var evid = newId.getText();
    
  				feventout.evsysseq = evid;
  				feventout.evtype = "email";
  				feventout.evsepchar = "^";
  				var td = funcs.tod();	
  				feventout.evtime = td;
  				feventout.evexpire = td;
  			
  				var title = task.email_subject+"##Schedule Task ID:"+ task.id+"##";
  				var users = lib.ArrayUtil.toJsArray(getEmailReceivers(task.email_to_users, task.email_to_groups));
  			
  				feventout.evfields = task.email_addresses+"^"+funcs.operator()+"^"+users+"^"+title+"^"+task.email_content;
  			
  				ret = feventout.doInsert();
			}    		
		}
  	
	}	
	
	return ret;
}

/**
 * Switch to the context of specified operator
 *
 * @param {String} opName - Operator name
 */
function loginAs ( opName )
{
  // Cheat we're in bg to skip the module license checking
  vars['$G.bg'] = true;

  var fOp = new SCFile("operator");
  var rc  = fOp.doSelect('name="' + opName + '"');
  vars['$lo.operator'] = fOp;

  loginInitInfo();

  var ret = new SCDatum();
  var ArgName = new SCDatum();
  var ArgValue = new SCDatum();

  ArgName.setType( 8 );
  ArgName.push( "name" );
  ArgName.push( "file" );
  ArgName.push( "second.file" );

  ArgValue.setType( 8 );
  ArgValue.push( opName );

  var infoRecord = vars['$G.system.info'];
  if ( infoRecord )
  {
    infoRecord['disable.module.licensing'] = true;
  }

  ArgValue.push( infoRecord );
  ArgValue.push( vars['$lo.operator'] );

  rc = funcs.rtecall( "callrad", ret, "set.login.globalvars", ArgName, ArgValue, false );
  vars['$lo.pm.assignments'] = vars['$lo.operator'].assignment_groups;

  loginSetTimezone();

  loginCallFormatCAdd();
}

function loginCallFormatCAdd()
{
  var ret = new SCDatum();
  var ArgName = new SCDatum();
  var ArgValue = new SCDatum();

  ArgName.setType( 8 );
  ArgValue.setType( 8 );

  var rc = funcs.rtecall( "callrad", ret, "login.call.format.cadd", ArgName, ArgValue, false );
}

function loginInitInfo()
{
  var f = new SCFile("info");
  var rc  = f.doSelect("type=\"company\"");
  vars['$G.system.info'] = f;

  vars['$G.multi'] = _nullsub(vars['$G.system.info'].multi_company, false);
  vars['$G.root.currency'] = _nullsub(vars['$G.system.info'].root_currency_code, "USD");

  //setup.language
  var strLanguage = _nullsub(vars['$lo.operator'].syslanguage, _nullsub(vars['$G.system.info'].syslanguage, "en"));
  var strVoid = _userlang(strLanguage);
  strLanguage = _sysinfo_get("languagecode");
  vars['$G.my.language'] = strLanguage;
}

function loginSetTimezone()
{
  var ret = new SCDatum();
  var ArgName = new SCDatum();
  var ArgValue = new SCDatum();

  ArgName.setType( 8 );
  ArgName.push( "boolean1" );
  ArgName.push( "cond.input" );
  ArgName.push( "name" );
  ArgName.push( "index" );

  ArgValue.setType( 8 );
  ArgValue.push( false );
  ArgValue.push( vars['$lo.uallow.timezone'] );
  ArgValue.push( vars['$lo.time.zone'] );
  ArgValue.push( vars['$lo.date.order'] );

  var rc = funcs.rtecall( "callrad", ret, "system.setparms", ArgName, ArgValue, false );
}

/**
 * Set the operator() and $G.role
 * Might be too simple, but should be enough because we don't need the timezone/language in this module
 *
 * @param {String} opName - operator name, for scheduler, this could be the scheduler class, such as report, agent, etc
 */
function setOpertor( opName )
{
  var ret = new SCDatum();
  var ArgName = new SCDatum();
  var ArgValue = new SCDatum();

  ArgName.setType( 8 );
  ArgName.push( "name" );

  ArgValue.setType( 8 );
  ArgValue.push( opName );

  var rc = funcs.rtecall( "callrad", ret, "report.simple.setoperator", ArgName, ArgValue, false );
}

function printRole()
{
  if (log.isDebugEnabled()) {
    log.debug("------------As " + funcs.operator() + "----------------");
    var gRole = vars['$G.role'];
    log.debug(gRole);
  }
}

function doAllWork( log_level )
{
  try{
    if (!log_level) {
      log_level = 2;
    }

    log.setLevel(log_level);

    if ( lib.reportCmn.isReportingEnabled() )
    {
      doPrepareData();
    }

    doExport();
    moveFinishedTasksToHistory();

    forceGC();
  }
  catch ( e )
  {
    log.error("Unhandled exception while exporting reports: " + e.message);
    log.error("Unhandled exception while exporting reports: " + toJSON(e));
  }
}

function getMaxPrepareThread( )
{
  var maxThread = lib.settings.getSettingValue( "Report", "Export.thread.prepare" );
  return ( maxThread )? parseInt(maxThread, 10) : 1;
}

function getMaxExportThread( )
{
  var maxThread = lib.settings.getSettingValue( "Report", "Export.thread.export" );
  return ( maxThread )? parseInt(maxThread, 10) : 1;
}

function getCurThreadsCount()
{
  var dt = new SCDatum();
  dt.setType(8);

  var pid = system.sysinfo.ProcessID;

  var preparePrefix = "report.export.prepare";
  var exportPrefix = "report.export.distribute";
  var cleanlogPrefix = "report.export.misc";

  var nPrepare = 0;
  var nExport = 0;
  var nClean = 0;

  var u;
  var allUsers = system.users;
  for ( u in allUsers )
  {
    var curUser = allUsers[u];
    var thisPid = curUser.processID;
    if ( thisPid && thisPid.getNodeValue() === pid )
    {
      var threadName = curUser.name.getNodeValue();
      if ( threadName.substring(0, preparePrefix.length) === preparePrefix ) {
        nPrepare++;
      }
      else if ( threadName.substring(0, exportPrefix.length) === exportPrefix ) {
        nExport++;
      }
      else if ( threadName.substring(0, cleanlogPrefix.length) === cleanlogPrefix ) {
        nClean++;
      }
    }
  }

  dt.push(nPrepare);
  dt.push(nExport);
  dt.push(nClean);

  return dt;
}

/**
 * How many threads we still need to create, the limit is Export.thread.prepare and Export.thread.export
 */
function getRemainThreadsCount( )
{
  var dtCur = getCurThreadsCount();
  var maxPrepare = getMaxPrepareThread();
  var maxExport  = getMaxExportThread();
  var maxClean = 1;

  maxPrepare = maxPrepare - dtCur[0];
  dtCur[0] = ( maxPrepare >= 0 )? maxPrepare : 0;

  maxExport = maxExport - dtCur[1];
  dtCur[1] = ( maxExport >= 0 )? maxExport : 0;

  maxClean = maxClean - dtCur[2];
  dtCur[2] = ( maxClean >= 0 )? maxClean : 0;

  if ( maxPrepare > 0 || maxExport > 0 ) {
    log.info("Still need to create " + dtCur.getText() + " export threads ");
  }
  else if (log.isDebugEnabled()) {
    log.debug("Still need to create " + dtCur.getText() + " export threads ");
  }

  return dtCur;
}

function getEmailReceivers(opers, groups)
{
	var users = [];
    users = opers;
     
	var q = 'SELECT operators FROM assignment WHERE name isin ' + _str( _denull(groups) );
  	var f = new SCFile("assignment", SCFILE_READONLY);
  	var rc = f.doSelect(q);

  	while ( rc == RC_SUCCESS )
  	{
    	var opNames = f.operators;
    	if ( opNames && opNames.getSize() > 0 )
    	{
      		lib.ArrayUtil.addAll(users, opNames);
    	}
    	rc = f.getNext();
  	}
  	
  		
  	return users;
}
