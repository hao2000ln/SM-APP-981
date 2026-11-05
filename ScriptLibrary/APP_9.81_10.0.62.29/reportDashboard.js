var libCmn = lib.reportCmn;
var JSON = lib.JSON.json();
var _sf = system.functions;

function toJSON(obj) {
  return JSON.stringify(obj);
}

function jsonParse(obj) {
  return JSON.parse(obj);
}

var ERR_UNAUTHORIZED_INBOX        = 50;       // "Current operator doesn't have the privilege for the report %S "
var ERR_UNAUTHORIZED_DASHBOARD    = 51;       // "Current operator doesn't have the privilege for the dashboard %S "
var ERR_REPORT_NOTFOUND           = 52;       // "Cannot find the report %S "
var ERR_DASHBOARD_NOTFOUND        = 53;       // "Cannot find the dashboard %S "
var INFO_DASHBOARD_SAVED          = 59;       // Dashboard "%S"(id: %S) saved
var ERR_DASHBOARD_INSUFFICIENT_RIGHT = 201;   // Insufficient right to current operation.
var ERR_INVALID_PARM1             = 56;       // "Invalid parameter %S in function %S"
var ERR_DASHBOARD_NOT_DEFINED     = 207;      // Dashboard not defined for current operator
var ERR_DASHBOARD_DISABLED        = 208;      // Dashboard is disabled
var ERR_REPORT_ALREADY_ADDED      = 210;      // Current report already exists in the dashboard
var ERR_DASHBOARD_MODIFIED        = 216;      // Dashboard modified after last read
var ERR_REPORT_COUNT_LIMIT        = 217;     // The report count per dashboard limitation is exceed

var MSG_CLASS_REPORT              = "Reporting";
var ERR_CODE_PREFIX               = "R";         // The error code for Report Module: "R" + ####
var ERR_CODE_PREFIX_BASE          = "E";         // The error code for Base module:   "E" + ####
var MSG_CLASS_TABLENAME           = "tablename"; // for localization of file name

var ERR_TYPE_ERROR = "3";
var ERR_TYPE_WARN  = "2";
var ERR_TYPE_INFO  = "1";

var COL_COUNT = 12;
var ROW_HELIGHT = 40;
var GADGET_MIN_WIDTH = 3;
var GADGET_MIN_HEIGHT = 4;
var GADGET_DEFAULT_HEIGHT = 8;
var gadgetContext = {};
var gadgets = [];

function queryUserDashboards( logger )
{
  var _str = system.functions.str;
  var _nullsub = system.functions.nullsub;
  var _denull = system.functions.denull;
  var _operator = system.functions.operator;

  var dashboards = [];
  var dashboardName;
  var opName = vars.$lo_operator.name;

  var strGlobal = _sf.scmsg( 60, MSG_CLASS_REPORT, [] );
  var inbox = new SCFile("inbox");
  var inbox_query = " SELECT inbox.name, inbox.id, audience.type, operator.name FROM inbox WHERE ";
  inbox_query += " ( null(report.disabled) or report.disabled=false ) and (inbox.class=\"dashboard\") and " +
  "(operator.name=\"" + opName + "\" or inbox.manager=\"" + opName + "\" or " +
  " (audience.type=\"everyone\") or " +
  " (audience.type=\"groups\" and groups isin "+ _str(_denull(vars['$lo.groups'])) + ") or " +
  " (audience.type=\"assignmentgroups\" and assignment.groups isin " + _str(_denull(vars['$lo.pm.assignments'])) + ") or " +
  " (audience.type=\"role\" and role=\""+_nullsub(vars['$G.user.role'], "NONE")+"\")) ";
  inbox_query += " ORDER BY inbox.name ASC";

  if (inbox.doSelect(inbox_query) == RC_SUCCESS)
  {
    do
    {
      var localizedInboxName = lib.localizeTable.getMessageText(inbox);
      localizedInboxName = localizedInboxName == null ? inbox.inbox_name : localizedInboxName;
      if (inbox.audience_type=="oneperson")
      {
        if (inbox.operator_name == _operator())
        {
          dashboardName = localizedInboxName;
        }
        else
        {
          dashboardName = localizedInboxName + " (" + inbox.operator_name + ")";
        }
      }
      else
      {
        dashboardName = localizedInboxName + " (" + strGlobal + ")";
      }

      var dashboard = {
        "@class": "dashboard",
        "id" : inbox.inbox_id,
        "name": dashboardName
      }
      dashboards.push(dashboard);
    } while ( inbox.getNext() == RC_SUCCESS )
  }

  return dashboards;
}

function queryDashboard(inbox_id, logger)
{
  var fInbox = new SCFile('inbox');
  var rc = fInbox.doSelect('inbox.id = "' + inbox_id + '"');

  if ( rc != RC_SUCCESS )
    throw libCmn.createReportServiceError( ERR_DASHBOARD_NOTFOUND, ERR_TYPE_INFO, [ inbox_id ] );

  if ( !libCmn.isAuthorizedForThisReport( null, fInbox ) )
    throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_DASHBOARD, ERR_TYPE_ERROR, [ inbox_id ] );

  if ( fInbox.report_disabled )
    throw libCmn.createReportServiceError( ERR_DASHBOARD_DISABLED, ERR_TYPE_INFO, [ ] );

  var prop = fInbox.dashboard_content;
  
  var localizedInboxName = lib.localizeTable.getMessageText(fInbox );

  var meta = {
    "id"          : inbox_id,
    "containerId" : fInbox.container_id,
    "@class"      : "dashboard",
    "name"        : localizedInboxName == null ? fInbox.inbox_name : localizedInboxName,
    "desc"        : fInbox.inbox_description,

    "isHomePage"  : dashboardIsHomePageOfCurrentOperator( fInbox ),
    "ownedByUser" : dashboardIsOwnedByCurrentOperator( fInbox ),

    "version"      : fInbox.sysmodcount,

    "attributes"  : null
  };

  var objRight = libCmn.getInboxSecRight(fInbox);
  meta.secRights = {};
  meta.secRights.canUpdate = objRight.canUpdate;
  meta.secRights.canDelete = objRight.canDelete;

  // Process Attributes
  var rawAttrs =  fInbox.attributes;
  if ( rawAttrs )
  {
    var attrs = {};
    for (var i = 0; i < rawAttrs.getSize(); i++ )
      attrs[ rawAttrs[i].name ] = rawAttrs[i].value;

    meta.attributes = attrs;
  }
  extractRefreshInfo( fInbox, meta );

  // Assemble the final response object
  var result = {
    "meta"    : meta,
    "content" : null
  };

  if ( prop )
  {
    result.content = jsonParse(getLocalizedDashboardContents(prop));
  }
  else
  {
    if ( g_logDebug )
      logger.debug( "Converting the MySM dashboard : " + inbox_id );
    prop = assembleDashboardFromMySMRecord( inbox_id );

    if ( g_logDebug )
      logger.debug("Auto generated layout : " + toJSON(prop) );

    result.content = prop;
  }

  forceGC( true );

  return result;
}

function getLocalizedDashboardContents(prop) {
    var updated = false;
    var propJson = jsonParse(prop);
    if (propJson != null && propJson.dropZones != null) {
       var dropZones = propJson.dropZones;
       for (var i=0; i<dropZones.length; i++) {
           var children = dropZones[i]["children"];
           if (children != null) {
               for (var j=0; j<children.length; j++) {
                   var gadgets = children[j]["gadgets"];
                   if (gadgets != null) {
                       for (var k=0; k<gadgets.length; k++) {
                           var localizedInboxName = lib.localizeTable.getLocalizedInboxName(gadgets[k]["id"]);
                           if (localizedInboxName != gadgets[k]["name"]) {
                               gadgets[k]["name"] = localizedInboxName;
                               updated = true;
                           }
                       }
                   }
               }
            }
       }
    }
    
    return updated ? lib.JSON2.toJSON(propJson) : prop;
}

function queryDashboardLayout(inbox_id, logger)
{
  var fInbox = new SCFile('inbox');
  var rc = fInbox.doSelect('SELECT dashboard.content FROM inbox WHERE inbox.id = "' + inbox_id + '" and inbox.class="dashboard"');

  if ( rc != RC_SUCCESS )
    throw libCmn.createReportServiceError( ERR_DASHBOARD_NOTFOUND, ERR_TYPE_INFO, [ inbox_id ] );

  if ( !libCmn.isAuthorizedForThisReport( null, fInbox ) )
    throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_DASHBOARD, ERR_TYPE_ERROR, [ inbox_id ] );

  if ( fInbox.report_disabled )
    throw libCmn.createReportServiceError( ERR_DASHBOARD_DISABLED, ERR_TYPE_INFO, [ ] );

  var prop = fInbox.dashboard_content;
  var layout = null;

  if ( prop )
  {
    layout = prop;
  }
  else
  {
    if ( g_logDebug )
      logger.debug( "Converting the MySM dashboard : " + inbox_id );
    prop = assembleDashboardFromMySMRecord( inbox_id );

    if ( g_logDebug )
      logger.debug("Auto generated layout : " + toJSON(prop) );

    layout = toJSON(prop);
  }

  forceGC( true );

  return layout;
}

//
// For the dashboard created by MySM, the dashboard_content is empty
// So just try to fetch all the inbox items belong to this dashboard and assemble them to a 2-column in-tool-report layout
function assembleDashboardFromMySMRecord( dashboard_id )
{
  var f = new SCFile("inbox");
  var rc = f.doSelect('container.id = "' + dashboard_id + '"');

  var dropZones = [];
  var dropZone = {
    "name" : "dropzone1",
    "maxSize" : 2,
    "children" : []
  };

  var i = 0;
  if ( rc == RC_SUCCESS )
  {
    var DEFAULT_GADGET_HEIGHT = 450;

    var gadgetCol0 = {
      "gadgets" : []
    };

    var gadgetCol1 = {
      "gadgets" : []
    };

    while ( rc == RC_SUCCESS )
    {
      var localizedInboxName = lib.localizeTable.getMessageText(f);
      var def = {
        "id" : f.inbox_id,
        "type" : f.inbox_class,
        "name" : localizedInboxName == null ? f.inbox_name : localizedInboxName,
        "height" : DEFAULT_GADGET_HEIGHT,
        "collapsed": false
      }

      if ( (i%2) == 0 )
        gadgetCol0.gadgets.push(def);
      else
        gadgetCol1.gadgets.push(def);

      i++;
      rc = f.getNext();
    }

    if ( gadgetCol0.gadgets.length  )
      dropZone.children.push(gadgetCol0);

    if ( gadgetCol1.gadgets.length )
      dropZone.children.push(gadgetCol1);
  }

  if ( i > 0 )
    dropZones.push( dropZone );

  var content = {
    "layout" : "column",
    "dropZones" : dropZones
  };

  return content;
}

function dashboardIsHomePageOfCurrentOperator( fInbox )
{
  return fInbox.inbox_id == vars.$lo_operator['homePage.dashboard.id'];
}

// detect whether current operator own the dashboard, has the write privilege, whether it's the homepage
function dashboardIsOwnedByCurrentOperator( fInbox )
{
  // check dashboard owner, need to take care whether it's case sensitive database
  // case.insensitive in $G.system.info

  var bCI = IsRunningCaseInsensitive();
  var bOwner = false;

  if ( bCI )
    bOwner = fInbox.inbox_manager && (fInbox.inbox_manager.toUpperCase() === vars.$lo_operator.name.toUpperCase() );
  else
    bOwner = fInbox.inbox_manager === vars.$lo_operator.name;

  return bOwner;
}

function IsRunningCaseInsensitive()
{
  return system.functions.sysinfo_get( "sqluppermode" ) || vars.$G_system_info['case.insensitive'];
}

function saveDashboard( dashboardDef, logger )
{
  var newDashboard = null;
  var fInbox       = null;
  var rc           = RC_SUCCESS;

  if ( !dashboardDef )
    throw libCmn.createReportServiceError( ERR_INVALID_PARM1, ERR_TYPE_ERROR, [ "(null dashboard object)", "saveDashboard" ] );

  newDashboard = dashboardDef;

  if ( !newDashboard || !newDashboard.meta || !newDashboard.content )
  {
    logger.warn( "Failed parse dashboard from input: " + toJSON(dashboardDef) );
    throw libCmn.createReportServiceError( ERR_INVALID_PARM1, ERR_TYPE_ERROR, [ toJSON(dashboardDef), "saveDashboard" ] );
  }
  if ( g_logDebug )
    logger.debug("saveDashboard: " + toJSON(dashboardDef));

  if ( !newDashboard.meta.containerId )
    newDashboard.meta.containerId = 0;

  if ( newDashboard.meta.version || newDashboard.meta.version == 0 )
  {
    // Check whether modified before after read
    if ( !isLatestVersion( newDashboard.meta.id, newDashboard.meta.version ) )
      throw libCmn.createReportServiceError( ERR_DASHBOARD_MODIFIED, ERR_TYPE_ERROR, [ ] );
  }

  fInbox = new SCFile('inbox');
  rc     = fInbox.doSelect('inbox.id = "' + newDashboard.meta.id + '"');

  if (rc != RC_SUCCESS)
    throw libCmn.createReportServiceError( ERR_DASHBOARD_NOTFOUND, ERR_TYPE_ERROR, [ newDashboard.meta.id ] );

  if ( !libCmn.isAuthorizedForThisReport( null, fInbox) )
    throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_DASHBOARD, ERR_TYPE_ERROR, [ newDashboard.meta.id ] );

  if ( newDashboard.meta.name )
    fInbox.inbox_name = newDashboard.meta.name;

  checkReportLimit( newDashboard.content, logger );

  fInbox.dashboard_content = toJSON(newDashboard.content);

  if ( typeof newDashboard.meta.containerId === 'string' )
    newDashboard.meta.containerId = parseInt(newDashboard.meta.containerId);
  fInbox['container.id'] = newDashboard.meta.containerId;
  rc = fInbox.doUpdate();

  if ( g_logDebug )
    logger.debug( "saveDashboard result: " + rc );

  if ( rc != RC_SUCCESS )
  {
    var errObj = new Error();
    errObj.errorCode = libCmn.padString(ERR_CODE_PREFIX_BASE, rc);
    errObj.message =  system.functions.scmsg( libCmn.getSCMsgCode(rc), "us", [] );

    throw errObj;
  }
  else
  {
//    ARG(3) - Text string of message
//    ARG(4) - Level of message (1=info, 2=action, 3=error)
//    ARG(5) - People to send it to, null for itself
//    ARG(6) - Name of the message, nullable
//    ARG(7) - Number of the message, default 1

    var tmpRet = new Datum();
    var msg = system.functions.scmsg( INFO_DASHBOARD_SAVED, MSG_CLASS_REPORT, [ fInbox.inbox_name, fInbox.inbox_id ] );
    var r = system.functions.rtecall("msg", tmpRet, msg, 1, null, null, 1);
  }

  var meta = {
    "id"          : fInbox.inbox_id,
    "containerId" : fInbox.container_id,
    "@class"      : "dashboard",
    "name"        : fInbox.inbox_name,
    "desc"        : fInbox.inbox_description,

    "isHomePage"  : dashboardIsHomePageOfCurrentOperator( fInbox ),
    "ownedByUser" : dashboardIsOwnedByCurrentOperator( fInbox ),

    "version"      : fInbox.sysmodcount,

    "attributes"  : null
  };

  var objRight = libCmn.getInboxSecRight(fInbox);
  meta.secRights = {};
  meta.secRights.canUpdate = objRight.canUpdate;
  meta.secRights.canDelete = objRight.canDelete;

  // Process Attributes
  var rawAttrs =  fInbox.attributes;
  if ( rawAttrs )
  {
    var attrs = {};
    for (var i = 0; i < rawAttrs.getSize(); i++ )
      attrs[ rawAttrs[i].name ] = rawAttrs[i].value;

    meta.attributes = attrs;
  }
  extractRefreshInfo( fInbox, meta );

  var result = {
    "meta"    : meta,
    "content" : jsonParse(fInbox.dashboard_content)
  };

  forceGC( true );

  return result;
}

function isAutoRefreshEnabled()
{
  var rptEnabled = lib.settings.getSettingValue("Report", "Enable.Reporting.AutoRefresh");
  return ( !rptEnabled || (rptEnabled.toString() === "false") )? false : true;
}

function isAutoRefreshforAudience( )
{
  var rptEnabled = lib.settings.getSettingValue("Report", "Enable.Dashboard.AutoRefresh.Audience");
  return ( !rptEnabled || (rptEnabled.toString() === "false") )? false : true;
}

function extractRefreshInfo( fInbox, meta )
{
	
  var currOp = vars['$lo.operator'];
  if ( currOp )
  {
    // Only the owner or SysAdmin can refresh the dashboard
    var capWords = _sf.denull(currOp.cap_exec);
    if ( _sf.index("SysAdmin", capWords) <= 0)
    {
      if ( fInbox['inbox.manager'] != currOp.name && !isAutoRefreshforAudience())
        return;
    }
  }	
	
  if ( !meta.attributes )
    meta.attributes = {};

  var bRefresh  = false;
  var nInterval = 10000;

  if ( isAutoRefreshEnabled() )
  {
    bRefresh  = fInbox['dashboard.refresh.enable'];
    nInterval = fInbox['dashboard.refresh.interval'];
  }

  meta.attributes['refresh'] = !!bRefresh;
  meta.attributes['refreshInterval'] = nInterval;
}

function isLatestVersion ( inbox_id, versionNow )
{
  var f = new SCFile("inbox");
  var q = "SELECT sysmodcount FROM inbox WHERE inbox.id=" + inbox_id;
  var rc = f.doSelect(q);
  if ( rc == RC_SUCCESS )
  {
    return f.sysmodcount <= versionNow;
  }

  return true;
}

/*
 Request,

 {
 "meta": {
 "name": "Falcon Home Page",
 "isHomePage": true,
 "desc": "some description"
 },
 "content":{...}
 }
 */
function createDashboard( inDashboardObj, logger )
{
  // verify whether the user has the right to create dashboard
  var userSecRight = libCmn.getUserSecRight();
  if ( userSecRight && !userSecRight.canCreate )
  {
    if ( g_logDebug )
      logger.debug("createDashboard, Current operator doesn't have the privilege to create dashboard ");
    throw libCmn.createReportServiceError( ERR_DASHBOARD_INSUFFICIENT_RIGHT, ERR_TYPE_ERROR, [ ] );
  }

  var f = new SCFile("inbox");
  var rc = f.doSelect("false");

  var dashboardName = inDashboardObj.meta.name;
  var isHomePage = inDashboardObj.meta.isHomePage;
  var desc = inDashboardObj.meta.desc;
  var layout = null;

  if ( !dashboardName )
    throw libCmn.createReportServiceError( ERR_DASHBOARD_EMPTY_NAME, ERR_TYPE_ERROR, [ ] );

  if ( g_logDebug )
    logger.debug( "createDashboard input: " + toJSON(inDashboardObj) );

  if ( inDashboardObj.content )
    layout = inDashboardObj.content;
  if ( !inDashboardObj.meta.containerId )
    inDashboardObj.meta.containerId = 0;

  f.inbox_name = dashboardName;
  f.inbox_class = "dashboard";

  if ( typeof inDashboardObj.meta.containerId === 'string' )
    inDashboardObj.meta.containerId = parseInt(inDashboardObj.meta.containerId);
  f.container_id = inDashboardObj.meta.containerId;

  f.audience_type = "operator";
  f.operator_name = vars.$lo_operator.name;
  f.inbox_manager = f.operator_name;
  f.inbox_description = inDashboardObj.meta.desc;

  f.audience_type = "oneperson"
  f.operator_name = vars.$lo_operator.name;

  if ( !inDashboardObj.meta.desc )
    inDashboardObj.meta.desc = null;

  if ( layout )
  {
    checkReportLimit( layout, logger );
    f.dashboard_content = toJSON(layout);
  }

  rc = f.doInsert();

  if ( rc != RC_SUCCESS )
  {
    var errObj = new Error();
    errObj.errorCode = libCmn.padString(ERR_CODE_PREFIX_BASE, rc);
    errObj.message =  system.functions.scmsg( libCmn.getSCMsgCode(rc), "us", [] );

    logger.error("Failed to create dashboard: " + errObj.message);

    throw errObj;
  }

  // update current operator's homepage if necessary
  dashboardSetAsHomepage( f.inbox_id, isHomePage, logger );

  var objRight = libCmn.getInboxSecRight(f);
  var secRights = {};
  secRights.canUpdate = objRight.canUpdate;
  secRights.canDelete = objRight.canDelete;

  return {
    "meta": {
      "id": f.inbox_id,
      "containerId": f.container_id,
      "@class": "dashboard",
      "name": dashboardName,
      "desc": inDashboardObj.meta.desc,

      "secRights" : secRights,
      "ownedByUser": true,
      "isHomePage": !!isHomePage
    },

    "content": layout
  }
}

function dashboardSetAsHomepage( dashboard_id, bForceAsHomePage, logger )
{
  var bSuccess = true;
  if ( bForceAsHomePage )
  {
    bSuccess = false;
    var op = vars.$lo_operator;

    if ( g_logDebug )
      logger.debug("dashboardSetAsHomepage for operator: " + op['name'] + ", dashbaord id: " + dashboard_id );

    var HOME_PAGE_TYPE_DASHBOARD = -5;

    op['homePage.type'] = HOME_PAGE_TYPE_DASHBOARD.toString();
    op['homePage.dashboard.id'] = dashboard_id.toString();

    var f = new SCFile('operator');

    var rc = f.doSelect('name = "' + op['name'] + '"');
    if ( rc == RC_SUCCESS )
    {
      f['homePage.type'] = HOME_PAGE_TYPE_DASHBOARD.toString();
      f['homePage.dashboard.id'] = dashboard_id.toString();

      rc = f.doUpdate();

      if ( rc == RC_SUCCESS )
      {
        bSuccess = true;

        if ( g_logDebug )
          logger.debug( "dashboardSetAsHomepage succeed, dashboard id - " + dashboard_id );
      }
      else
      {
        logger.warn( "dashboardSetAsHomepage failed, dashboard id - " + dashboard_id + ", rc: " + rc );
      }
    }

    return bSuccess;
  }
}

/**
 * Get the report count from dashboard
 * @param content: layout of dashboard
 * @returns {integer}
 */
function geReportCount( content )
{
  var nCount = 0;
  if ( content )
  {
    var zones = content.dropZones;

    for ( var nZone = 0; nZone < zones.length; nZone++ )
    {
      var zone = zones[nZone];

      for ( var nChild = 0; zone.children && (nChild < zone.children.length); nChild++ )
      {
        var child = zone.children[nChild];
        nCount += child.gadgets.length;
      } // for children
    } // for each dropzones
  }

  return nCount;
}

function getReportCountLimit( )
{
  var DEFAULT_LIMIT = 16;
  var defCfg = lib.settings.getSettingValue("Report", "Default.maxReportPerPage");
  defCfg = (defCfg != null)? parseInt( defCfg ) : DEFAULT_LIMIT;

  return defCfg;
}

function checkReportLimit( layout, logger )
{
  var nLimit = getReportCountLimit();
  var nCount = geReportCount( layout );

  if ( nCount > nLimit )
  {
    if ( g_logDebug )
      logger.debug("Report per page count limitation reached, " + nLimit);

    throw libCmn.createReportServiceError( ERR_REPORT_COUNT_LIMIT, ERR_TYPE_ERROR, [ nLimit ] );
  }
}

function addReportToDefaultDashboard( inbox_id, logger )
{
  var ret = RC_SUCCESS;
  try {
    var rptRights = libCmn.querySecRights( inbox_id );
    if ( !rptRights || !rptRights.canView )
    {
      throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [ inbox_id ] );
    }

    var op = vars.$lo_operator;
    var HOME_PAGE_TYPE_DASHBOARD = -5;
    var f = new SCFile('operator');

    var rc = f.doSelect('name = "' + op['name'] + '"');
    if ( rc == RC_SUCCESS )
    {
      var dashboard_id = f['homePage.dashboard.id'];
      if ( !dashboard_id )
      {
        if ( g_logDebug )
          logger.debug("addReportToDefaultDashboard failed, no dashboard configured for current operator");
        throw libCmn.createReportServiceError( ERR_DASHBOARD_NOT_DEFINED, ERR_TYPE_ERROR, [ ] );
      }

      var dashboardRights = libCmn.querySecRights( dashboard_id );
      if ( !dashboardRights || !dashboardRights.canUpdate )
      {
        throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_DASHBOARD, ERR_TYPE_ERROR, [ dashboard_id ] );
      }

      doAddReportToDashboard( inbox_id, dashboard_id, logger );
    }
  }
  catch (e)
  {
    if ( g_logDebug )
      logger.debug("addReportToDashboard failed: " + e);
    ret = e;
  }

  return ret;
}

// Add the report to the top of dashboard
function doAddReportToDashboard( inbox_id, dashboard_id, logger )
{
  gadgetContext = {};
  var fDashboard = new SCFile("inbox");
  var fReport = new SCFile("inbox");

  var rc = fDashboard.doSelect('inbox.id = "' + dashboard_id + '"');

  if ( rc != RC_SUCCESS )
    throw createReportServiceError( ERR_DASHBOARD_NOTFOUND, ERR_TYPE_ERROR, [ dashboard_id ] );

  rc = fReport.doSelect('inbox.id = "' + inbox_id + '"');
  if ( rc != RC_SUCCESS )
    throw createReportServiceError( ERR_REPORT_NOTFOUND, ERR_TYPE_ERROR, [ inbox_id ] );

  var layout = fDashboard.dashboard_content;

  var def = {
    "id" : fReport.inbox_id,
    "type" : fReport.inbox_class,
    "name" : fReport.inbox_name,
    "height" : GADGET_DEFAULT_HEIGHT * ROW_HELIGHT,
    "h": GADGET_DEFAULT_HEIGHT,
    "collapsed": false
  }
  if ( !layout )
  {
    // need to create an empty dashboard
    var dropZones = new Array();
    var dropZone = {
      "name" : "dropzone1",
      "children" : []
    };
    addGadget(def, "top");

    var defaultLayout = {
      "colCount": COL_COUNT,
      "layout": "column",
      "dropZones": dropZones
    };

    layout = toJSON(defaultLayout);

    fDashboard.dashboard_content = layout;
    rc = fDashboard.doUpdate();

    if ( rc != RC_SUCCESS )
    {
      var errObj = new Error();
      errObj.errorCode = padString(ERR_CODE_PREFIX_BASE, rc);
      errObj.message =  system.functions.scmsg( getSCMsgCode(rc), "us", [] );

      throw errObj;
    }

    return layout;
  }

  var layoutObj = jsonParse( layout );
  layoutObj = convertDataModel(layoutObj);

  var dropZones = layoutObj.dropZones;

  if ( !dropZones )
    dropZones = new Array();

  if ( findReportInDashboard(inbox_id, dropZones, logger) )
    throw libCmn.createReportServiceError( ERR_REPORT_ALREADY_ADDED, ERR_TYPE_ERROR, [ ] );

  var dropZone = dropZones[0];
  if ( !dropZone )
  {
    dropZone = {
      "name" : "dropzone1",
      "children" : []
    };

    dropZones.push( dropZone );
    dropZone = dropZones[0];
  }

  if ( !dropZone.children )
    dropZone.children = [];

  addGadget(def, "top");

  if ( !layoutObj.layout )
    layoutObj.layout = 'column';

  checkReportLimit( layoutObj, logger );

  layout = toJSON(layoutObj);

  fDashboard.dashboard_content = layout;
  rc = fDashboard.doUpdate();

  if ( rc != RC_SUCCESS )
  {
    var errObj = new Error();
    errObj.errorCode = padString(ERR_CODE_PREFIX_BASE, rc);
    errObj.message =  system.functions.scmsg( getSCMsgCode(rc), "us", [] );

    throw errObj;
  }

  if ( g_logDebug )
  {
    logger.debug("doAddReportToDashboard, inbox_id - " + inbox_id + ", rc: " + rc + ", dashbaordid: " + dashboard_id);
    logger.debug("layout: " + layout);
  }

  return layout;
}

function findReportInDashboard(inbox_id, dropZones, logger)
{
  for (var zone = 0; zone < dropZones.length; zone++ )
  {
    var child = dropZones[zone].children;
    for ( var i = 0; i < child.length; i++ )
    {
      var gadgets = child[i].gadgets;

      for ( var nGadget = 0; nGadget < gadgets.length; nGadget++ )
      {
        var gadget = gadgets[nGadget];
        if ( gadget && parseInt(gadget.id,10) === parseInt(inbox_id,10) )
          return true;
      }
    }
  }

  return false;
}

/**
 *
 * @returns {*}
 *   -1 : no limitation
 *   0  : no refresh dashboard
 *   >0 : limitation
 */
function getMaxAutoRefreshDashboard()
{
  var defCfg = lib.settings.getSettingValue("Report", "Default.maxRefreshDashboard");
  defCfg = (defCfg != null)? parseInt( defCfg ) : -1;

  return defCfg;
}

/**
 * Check whether the max-auto-refresh-dashboard-count limitation is exceeded
 * This check procedure would keep running even when the "auto-refresh" feature is disabled
 *
 * @param fInbox
 */
function checkMaxAutoRefreshDashboard( fInbox )
{	
  try{
    var bAutoRefresh = fInbox['dashboard.refresh.enable'];
    if ( !bAutoRefresh )
      return;

    var cntCurr  = getAutoRefreshedDashboardCount();
    if (_nullsub(vars["$L.file.save"]['dashboard.refresh.enable'], false)==false && fInbox['dashboard.refresh.enable'])
    {
    	cntCurr+=1;    	
    }
    var cntLimit = getMaxAutoRefreshDashboard();
    
    if ( (cntCurr > cntLimit) && (cntLimit > 0) )
    {
      // The count (%S) of dashboard with "Auto-Refresh" enabled already exceeded the limitation (%S).
      return _sf.scmsg('too.auto.refresh.dashboard', MSG_CLASS_REPORT, [ cntLimit.toString() ] );
    }
  }
  catch(e){}

  
  return ;
}

function getAutoRefreshedDashboardCount()
{
  var q = 'select count(*) from inbox where (dashboard.refresh.enable=true) and ( null(report.disabled) or (report.disabled = false) )';
  var f = new SCFile('inbox');
  var rc = f.doSelect(q);

  var cnt = 0;
  if ( rc == RC_SUCCESS )
    cnt = f[0];

  return cnt;
}

function convertDataModel(content)
{
  var newContent = content;
  var dropZones = content.dropZones;
  var colPanels;
  var colWidth;
  var colGadgets;
  var gadget;
  var newGadgets = [];
  var dropZoneY = 0;
  var colPanelY = [];
  if (!newContent.colCount)
  {
    // it's legacy data model, convert it
    newContent.colCount = COL_COUNT;
    for (var i = 0; i < dropZones.length; i++)
    {
      colPanels = dropZones[i].children;
      colPanelWidth = COL_COUNT / colPanels.length;
      for (var col = 0; col < colPanels.length; col++)
      {
        colGadgets = colPanels[col].gadgets;
        colPanelY[col] = dropZoneY;
        for (var k = 0; k < colGadgets.length; k++)
        {
          gadget = colGadgets[k];
          gadget.x = colPanelWidth * col;
          gadget.y = colPanelY[col];
          gadget.w = colPanelWidth;
          gadget.h = Math.round(gadget.height / ROW_HELIGHT);
          // make sure the bottom of the gadget is aligned to the grid
          gadget.height = gadget.h * ROW_HELIGHT;
          if (gadget.collapsed)
          {
            gadget.h = 1;
          }
          colPanelY[col] += gadget.h;
          newGadgets.push(gadget);
        }
      }
      dropZoneY = Math.max.apply(null, colPanelY);
    }
    sortGadgets(newGadgets);
    newContent.dropZones = [{
      maxSize: 0,
      children: [{
        gadgets: newGadgets
      }]
    }];
  }
  else
  {
    // it's already a new data model
    newGadgets = newContent.dropZones[0].children[0].gadgets;
  }
  gadgets = newGadgets;
  return content;
}

/**
 * Add a gadget to this dashboard at the specified position.
 * @param gadgetModel The simple or detailed gadget data model
 * @param position  Optional, defaults to top. Can be one of
 *  top
 *  bottom
 */
function addGadget(gadgetModel, position)
{
  var gadget;
  var position = position || 'top';
  var rect = getInsertPosition(position);
  copyToJsonObject(gadgetModel, rect);
  if (position == 'top')
  {
    gadgets.push(gadgetModel);
  }
  else
  {
    gadgets.splice(0, 0, gadgetModel);
  }
  fixOverlap(gadgetModel);
  compact();
}

function copyToJsonObject(object, config)
{
  if (object && config && typeof config == 'object')
  {
    var i;
    for (i in config)
      object[i] = config[i];
  }
}

/**
 * Get the insert position for the new gadget.
 *
 * The first row (position: top) or the last row (position: bottom) is used as the template row
 * to determine the x, y and w attributes for the new gadget.
 * If the template row contains a gadget that occupies the whole width, it will be ignored, we
 * assume two gadgets in a row as the template.
 * If the template row contains empty space, we will try to fill up it with new placeholder rect
 * using the width of the last gadget in the template row.
 * The new gadget will be placed to the start of the row if there is no empty space at the end of
 * the template row or if there is empty space at the start of the template row. Otherwise, it will
 * be placed to the end of the row.
 *
 * @param position indicates where the new gadget should be added to, top or bottom
 * @returns a rect indicates the position the new gadget should be placed to
 */
function getInsertPosition(position)
{
  var context = gadgetContext && gadgetContext[position],
    offset = context && context.offset || 0,
    rects = context && context.rects,
    xMax = COL_COUNT - GADGET_MIN_WIDTH,
    x = 0,
    y = 0,
    w = COL_COUNT / 2,
    h = 0,
    rect, firstRect, lastRect, overlaps,
    filterFn, sortFn;

  // init the template row (rects) if the context of the given position is not initialized
  if (!context)
  {
    if (position === 'bottom' && gadgets.length)
    {
      lastRect = gadgets[gadgets.length - 1];
      y = lastRect.y;
      h = lastRect.h;
    }
    rects = gadgets.filter(function (item)
    {
      return item.y == y;
    }).map(function (item)
    {
      return {x: item.x, y: item.y, w: item.w};
    });

    // if a gadget occupies the whole width, do not use it as the template
    if (rects.length == 1 && rects[0].w > xMax)
      rects = [];
    if (rects.length == 0)
    {
      // by default, one row consists of two rects
      rects.push({x: 0, y: y, w: w});
      rects.push({x: w, y: y, w: w});
    }
    else
    {
      // there are gadgets exist in the first or last row, so use the width of the last gadget in the row
      // as the width of the new rect, and try to fill up the remaining space with new placeholder rect
      firstRect = rects[0];
      lastRect = rects[rects.length - 1];
      w = lastRect.w;

      filterFn = function (item)
      {
        // check if horizontally overlapped
        return rect.x < item.x + item.w && rect.x + rect.w > item.x;
      };
      sortFn = function (a, b)
      {
        return a.x - b.x;
      };

      while (x <= xMax)
      {
        rect = {
          x: x,
          y: y,
          w: Math.min(w, COL_COUNT - x)
        };

        overlaps = rects.filter(filterFn);
        if (overlaps.length == 0)
        {
          x += w;
        }
        else
        {
          rect.w = overlaps[0].x - rect.x;
          if (rect.w < GADGET_MIN_WIDTH)
          {
            // there is not enough space to insert a new rect before the overlapped rect
            rect = null;
          }
          x = overlaps[0].x + overlaps[0].w;
        }

        if (rect)
        {
          rects.push(rect);
          rects.sort(sortFn);
        }
      }

      // if there is no new rect before the existing gadgets, and there are new rects after the existing
      // gadgets, we should append new gadget after the existing gadgets
      if (rects[0] == firstRect && rects[rects.length - 1] != lastRect)
        offset = rects.indexOf(lastRect) + 1;
    }

    if (position === 'bottom')
    {
      rects.forEach(function (item)
      {
        item.y += h;
      });
    }

    gadgetContext = gadgetContext || {};
    gadgetContext[position] = context = {
      offset: offset,
      rects: rects
    }
  }

  rect = rects[offset];
  offset++;
  if (offset == rects.length)
  {
    offset = 0;
    if (position === 'bottom')
    {
      rects.forEach(function (item)
      {
        item.y += GADGET_DEFAULT_HEIGHT;
      });
    }
  }

  context.offset = offset;
  return rect;
}

function fixOverlap(gadget)
{
  var gadget = gadget || gadgets.length && gadgets[0];
  sortGadgets(gadgets);
  gadgets.filter(function (item)
  {
    return gadget != item && isIntersecting(gadget, item);
  }).reverse().forEach(function (item)
  {
    item.y = gadget.y + gadget.h;
    fixOverlap(item);
  });
}

/**
 * Compat gadgets to eliminate empty space above
 */
function compact()
{
  sortGadgets(gadgets);
  gadgets.forEach(function (gadget, i)
  {
    while (gadget.y > 0)
    {
      gadget.y--;
      if (findIntersecting(gadget, 0, i))
      {
        gadget.y++;
        break;
      }
    }
  });
}

function sortGadgets(gadgets)
{
  gadgets.sort(function (a, b)
  {
    return a.x + a.y * COL_COUNT - (b.x + b.y * COL_COUNT);
  });
}

/**
 * Find the first gadget that intersects with the given gadget
 *
 * @param gadget The given gadget data model
 * @param start Where to start search, inclusive
 * @param end Where to stop search, exclusive
 * @returns gadget data model, or undefined if no gadget intersects with the given gadget
 */
function findIntersecting(gadget, start, end)
{
  var ignores = gadget.ignores || [gadget];
  return findGadget(function (item)
  {
    return ignores.indexOf(item) == -1 && isIntersecting(item, gadget);
  }, start, end);
}

function isIntersecting(a, b)
{
  return a.x < (b.x + b.w) && (a.x + a.w) > b.x && a.y < (b.y + b.h) && (a.y + a.h) > b.y;
}

/**
 * Find the first gadget matches the given test function
 *
 * @param testFn The test function
 * @param start Where to start search, inclusive
 * @param end Where to stop search, exclusive
 * @returns gadget data model, or undefined if no gadget matches
 */
function findGadget(testFn, start, end)
{
  var gadget;
  start = start || 0;
  end === undefined && (end = gadgets.length);
  for (var i = start; i < end; i++)
  {
    if (testFn(gadgets[i]))
    {
      gadget = gadgets[i];
      break;
    }
  }
  return gadget;
}
