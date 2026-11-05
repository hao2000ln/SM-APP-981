var MSG_CLASS_REPORT              = "Reporting";
var MSG_CLASS_TABLENAME           = "tablename";    // for localization of file name

var ERR_CODE_PREFIX               = "R";         // The error code for Report Module: "R" + ####
var ERR_TYPE_ERROR                = "3";

var PIVOT_DATE_AGG_YEAR    = 'YEAR';
var PIVOT_DATE_AGG_QUARTER = 'QUARTER';
var PIVOT_DATE_AGG_MONTH   = 'MONTH';
var PIVOT_DATE_AGG_WEEK    = 'WEEK_OF_YEAR';
var PIVOT_DATE_AGG_DAY     = 'DATE';

var ERR_UNKNOWN_TIME_AGG          = 209;    // Unknown time aggregator found: %S
var ERR_REPORT_NO_REPLICATEDB     = 211;    // Abort data fetching since the data from current report is from replicate db, but the replicate DB is disabled
var ERR_FAIL_EXECUTE_QUERY        = 213;    // Failed to execute the report query
var ERR_FAIL_EXECUTE_QUERY_TD     = 225;    // Failed to execute time duration query


function isAuthorizedForThisReport(operator_name, fInbox)
{
  if ( funcs.index("SysAdmin", vars['$lo.ucapex'])>0 || lib.security.getRights("Report","admin")=="true")
  {
    return true;
  }

  // get current operator
  var op = vars.$lo_operator;
  var f = fInbox;

  var userRole = [];
  userRole.push(op.user_role);

  var isAuthorized = (f.inbox_manager === op.name) ||
    (f.audience_type === "everyone") ||
    ( (f.audience_type === "groups") && isIntersect(op.groups, f.groups) ) ||
    ( (f.audience_type === "role") && isIntersect(userRole, f.role) ) ||
    ( (f.audience_type === "oneperson") && (op.name === f.operator_name) );

  if ( !isAuthorized && f.assignment_groups )
  {
    isAuthorized = (f.audience_type === "assignmentgroups") && isIntersect(vars.$lo_pm_assignments, f.assignment_groups);
  }

  return isAuthorized;
}

// Helper function to detect whether there is any common item between 2 arrays
// true for yes
function isIntersect(array1, array2)
{
  var ret = new SCDatum();
  var resultArray = new SCDatum();

  var rc = funcs.rtecall( "intersect", ret, resultArray, array1, array2 );

  return resultArray.getSize() > 0;
}

/*
 * If the id is empty, get the sec right of report module. if id is provided, return user's rights on the specific report/dashboard.
 */
function querySecRights( inbox_id )
{
  var f = null;

  if ( inbox_id )
  {
    f = new SCFile('inbox');

    var rc   = f.doSelect('inbox.id ="' + inbox_id + '"');

    if ( rc != RC_SUCCESS )
    {
      f = null;
    }
  }
  else
  {
    return getUserSecRight();
  }

  return getInboxSecRight(f);
}

function getUserSecRight()
{
  if (funcs.index("SysAdmin", vars["$lo.ucapex"])>0)
  {
    return {"canCreate": true, "canView": true, "canExport": true};
  }

  var tgView  = lib.security.getRights("Report","view");
  if (tgView==null || tgView=="false")
  {
    return {"canCreate": false, "canView": false, "canExport": false};
  }

  var tgExpert = lib.security.getRights("Report","expert");
  tgExpert = (tgExpert=="true")?true:false;

  var tgNew    = lib.security.getRights("Report","new");
  tgNew = (tgNew=="true")?true:false;

  return {"canCreate": tgNew, "canView": true, "canExport": tgExpert};
}

function getInboxSecRight( objInbox )
{
  if (objInbox == null)
  {
    return {"canCreate": false, "canView": false, "canUpdate": false, "canDelete": false, "canExport": false};
  }

  if (funcs.index("SysAdmin", vars["$lo.ucapex"])>0)
  {
    return {"canCreate": true, "canView": true, "canUpdate": true, "canDelete": true, "canExport": true};
  }

  var tgView  = lib.security.getRights("Report","view");
  if (tgView==null || tgView=="false")
  {
    return {"canCreate": false, "canView": false, "canUpdate": false, "canDelete": false, "canExport": false};
  }

  tgView = isAuthorizedForThisReport(null, objInbox);
  if (tgView==false)
  {
    return {"canCreate": false, "canView": false, "canUpdate": false, "canDelete": false, "canExport": false};
  }

  var tgExpert = lib.security.getRights("Report","expert");
  tgExpert = (tgExpert=="true")?true:false;

  var tgNew    = lib.security.getRights("Report","new");
  tgNew = (tgNew=="true")?true:false;

  var tgCanDelete = false;
  var tgCanUpdate = false;

  //always, assigned, workgroup, never
  var tgUpdate = lib.security.getRights("Report","update");
  var tgDelete = lib.security.getRights("Report","delete");

  //everyone, groups, assignmentgroups, role, oneperson
  var audienceType = objInbox.audience_type;
  if (audienceType=="groups" || audienceType=="assignmentgroups" || audienceType=="role")
  {
    if (tgUpdate=="assigned" && objInbox.inbox_manager === vars.$lo_operator.name)
    {
      tgCanUpdate = true;
    }

    if (tgDelete=="assigned" && objInbox.inbox_manager === vars.$lo_operator.name)
    {
      tgCanDelete = true;
    }

    if (tgUpdate=="always" || tgUpdate=="workgroup")
    {
      tgCanUpdate = true;
    }
    if (tgDelete=="always" || tgDelete=="workgroup")
    {
      tgCanDelete = true;
    }
  }
  else if (audienceType=="oneperson")
  {
    if (tgUpdate=="always" || tgUpdate=="assigned" || tgUpdate=="workgroup")
    {
      tgCanUpdate = true;
    }
    if (tgDelete=="always" || tgDelete=="assigned" || tgDelete=="workgroup")
    {
      tgCanDelete = true;
    }
  }

  return {"canCreate": tgNew, "canView": true, "canUpdate": tgCanUpdate, "canDelete": tgCanDelete, "canExport": tgExpert};
}

function createReportServiceError( errCode, severity, errArgs )
{
  var errObj = new Error();
  errObj.errorCode  = padString(ERR_CODE_PREFIX, errCode);
  errObj.errorType  = MSG_CLASS_REPORT;
  errObj.severity   = severity;
  errObj.message    = funcs.scmsg( errCode, MSG_CLASS_REPORT, errArgs );

  return errObj;
}

function padString( prefix, str )
{
  str = "" + str;
  var pad = "0000";

  return prefix + pad.substring(0, pad.length - str.length) + str;
}

function getCommonName( file_name )
{
  var common_name = funcs.scmsg( file_name, MSG_CLASS_TABLENAME );

  if ( !common_name || (common_name.indexOf("Could not be found") >= 0) )
  {
    common_name = file_name;
  }

  return common_name;
}

function isReportingEnabled()
{
  var rptEnabled = lib.settings.getSettingValue("Report", "Enable.Reporting");
  return ( !rptEnabled || (rptEnabled.toString() === "false") )? false : true;
}

function getDefaultRecordLimit()
{
  var DEFAULT_LIMIT = 12;
  var defCfg = lib.settings.getSettingValue("Report", "Default.maxRow");
  if ( defCfg == null ) {
    defCfg = DEFAULT_LIMIT;
  }
  else {
    defCfg = parseInt( defCfg );
  }

  return defCfg;
}

// Get maximum record count
//   For pie/bar charts, it means the group limit
//   For grid charts, it means the record limit
//
// Return
//   0  - unlimited
//   >0 - max group limit count
//   If no limit specified, then the default limit returned
function getMaxRecordLimit( meta, logger )
{
  var defaultLimit = getDefaultRecordLimit();
  var ATTR_MAX_ROW = "maxRow";
  var maxRecord = defaultLimit;

  var attrs = meta.attributes;

  if ( attrs )
  {
    var maxRow = attrs[ ATTR_MAX_ROW ];

    // if not defined or unspecified, then return default limit
    if ( ( typeof maxRow != 'undefined' ) && ( maxRow != null ) ) {
      maxRecord = parseInt(maxRow);
    }
  }
  
  if (vars['$G.bg'] && (meta.isGridChart() || ( meta.type.toUpperCase() === "GRID" )) )
  {
  		var defExportCfg = lib.settings.getSettingValue("Report", "Default.BackendExport.ListReport.maxRow");
		
		if (defExportCfg != null)
  		{
  	 		defExportCfg = parseInt(defExportCfg);
  	 		maxRecord=(defExportCfg>maxRecord)?defExportCfg:maxRecord;
  		}
  }

  if ( g_logDebug ) {
    logger.debug("Max record limit: " + maxRecord );
  }
  
  return maxRecord;
}

// Get maximum stack value per bar group
// Only valid in bar chart which contains a stack field
function getMaxStackedRecordLimit( meta, logger )
{
  var defaultLimit = getDefaultRecordLimit();
  var ATTR_MAX_ROW = "maxStackedRow";
  var maxRecord = defaultLimit;

  var attrs = meta.attributes;

  if ( attrs )
  {
    var maxRow = attrs[ ATTR_MAX_ROW ];

    // if not defined or unspecified, then return default limit
    if ( ( typeof maxRow != 'undefined' ) && ( maxRow != null ) ) {
      maxRecord = parseInt(maxRow);
    }
  }
  if ( g_logDebug ) {
    logger.debug("Stacked record limit: " + maxRecord );
  }

  return maxRecord;
}

function getFieldCaption( fileobj, field_name )
{
  var ret = funcs.policyread( fileobj, field_name, "captions" );
  if ( !ret ) {
    ret = field_name;
  }

  return ret;
}

function isFieldVisible( fileobj, field_name )
{
  return !funcs.policyread( fileobj, field_name, "invisible" );
}

function getFieldType( fileobj, field_name )
{
  return getTypeName(funcs.policyread( fileobj, field_name, "types" ));
}

function getTypeName( sm_type )
{
  var strType;

  switch ( parseInt(sm_type) )
  {
    case 1:  strType = "number";      break;
    case 2:  strType = "character";   break;
    case 3:  strType = "time";        break;
    case 4:  strType = "boolean";     break;
    case 5:  strType = "label";       break;
    case 6:  strType = "relation";    break;
    case 7:  strType = "offset";      break;
    case 8:  strType = "array";       break;
    case 9:  strType = "structure";   break;
    case 10: strType = "operator";    break;
    case 11: strType = "expression";  break;
    case 12: strType = "pseudofield"; break;
    case 13: strType = "globalvar";   break;
    case 14: strType = "localvar";    break;
    case 15: strType = "field2";      break;
    default:
      strType = "unknown" + sm_type;
  }

  return strType;
}

// =======================  Globallist  ========================

// Get the name of GlobalList related with specific {file, field}
// Return NULL if not found
function globallistNameGet(file_name, field_name)
{
  // find the list variable and display variable from datadict
  var fDatadict = new SCFile("datadict");
  var rc = fDatadict.doSelect('name="'+file_name+'"');
  var globalListName = null;

  if (rc == RC_SUCCESS)
  {
    var i;
    var fields = fDatadict.fields;
    var length = fields.getSize();
    for (i = 0; i < length; i++)
    {
      if (fields[i] === field_name)
      {
        globalListName = fDatadict.globallist[i];
        break;
      }
    }
  }

  return globalListName;
}

// Get the DisplayList and ValueList specific to a {file, field}
// An object would be returned
// If not found the, the property "found" would be false
//
function globallistDefGet(file_name, field_name)
{
  // find the list variable and display variable from datadict
  var globalListName = globallistNameGet(file_name, field_name);

  return globallistGetByName(globalListName);
}

function globallistGetByName( globalListName )
{
  var gl = {};
  gl.valueList   = null;
  gl.displayList = null;
  gl.found       = false;

  if ( globalListName )
  {
    if ( globalListName === "files" )
    {
      lib.reportingHelp.setupTableList();

      gl.valueList = vars['$G.report.tableList.key'];
      gl.displayList = vars['$G.report.tableList.display'];
    }
    else
    {
      var fGlobalList = new SCFile("globallists", SCFILE_READONLY);
      var rc = fGlobalList.doSelect('name="' + globalListName + '"');

      if ( rc == RC_SUCCESS )
      {
        // the found value doesn't mean the globallist exists, but whether it is necessary for localization.
        // if it is not for l10n, there is no need to send value list/display list to the client.
        // sometimes there exists huge list in customer environment e.g. "Assignment Groups" which will cause error.
        if (!isLocalizedGloballist(fGlobalList)) {  
          return gl;
        } 
              
        gl.valueList = vars[fGlobalList.list_variable];
        gl.displayList = vars[fGlobalList.display_variable];
      }
    }

    if ( gl.valueList )
    {
      var i;
      var jsValueList = [];
      var vl = gl.valueList;
      var length = vl.getSize();
      for ( i = 0; i < length; i++ )
      {
        jsValueList.push(vl[i]);
      }
      gl.valueList = jsValueList;
    }

    if ( gl.displayList ) {
      gl.displayList = gl.displayList.toArray();
    }

    gl.found = true;

    // sometimes, there is only valueList defined in global-list, so to duplicate it to display list, or the client might be panic
    if ( !gl.displayList || gl.displayList.length <= 0 )
    {
      gl.displayList = gl.valueList;
    }
  }

  return gl;
}

/**
 * is globallist for localization
 *
 * @param {SCFile} fGlobalList
 * @returns {Boolean}
 */
function isLocalizedGloballist(fGlobalList) {
    // no display variable or same as list variable
    if (!fGlobalList.display_variable || fGlobalList.list_variable == fGlobalList.display_variable) {
        return false;
    }

    // use localized values / user defined list / use localized list
    if (fGlobalList.localize_values || fGlobalList.user_defined || fGlobalList.use_scmessage) {
        return true;
    }

    // display field different than list field
    if (fGlobalList.display_field && fGlobalList.display_field != fGlobalList.list_field) {
        return true;
    }

    // generated by rad application 
    if (fGlobalList.application || fGlobalList.server_application) {
        return true;
    }

    return false;
}

// =======================  Globallist  ========================

// Check whether the query is already a converted ADHOC SQL statement, i.e. started with "SELECT";
function IsAlreadyAdhocQuery(query)
{
  /*
   String.prototype.leftTrim = function() {
   return this.replace(/^\s+/,"");
   }
   */
  if (query == null) {
    return false;
  }

  var q = query;
  q = q.replace(/^\s+/,"").toUpperCase();
  return  q.indexOf("SELECT ") == 0;
}

// Helper function, get the first field defined in the first UK
function getFirstFieldInUK( file_name )
{
  var f = new SCFile("datadict");
  var rc = f.doSelect('name="' + file_name + '"');

  var uk = null;
  if ( rc == RC_SUCCESS )
  {
    var uks = f.unique_key;
    if ( uks && uks.getSize() > 0 ) {
      uk = uks[0];
    }
  }

  return uk;
}

// return SM array instead of JS array
function getFieldsInFirstUK( file_name )
{
  var f = new SCFile("datadict");
  var rc = f.doSelect('name="' + file_name + '"');

  var ret = null;
  if ( rc == RC_SUCCESS ) {
    ret = f.unique_key.toArray();
  }

  return ret;
}


// The painful fact is, the SM base error code just like RC_DUPLICATE_KEY, the int value is 48, but in scmessage file, the message-number is 92 (class 'us')
// So we need a map to such kind of mismatch
function getSCMsgCode( smRC )
{
  switch ( parseInt(smRC) )
  {
    // duplicate key
    case 48:
      return '92';

    default:
      return smRC;
  }
}

function pivotProcessFieldAggregator( timeAgg )
{
  return processTimeAgg( timeAgg );
}

function processTimeAgg( timeAgg )
{
  // Global list for time aggregator
  var PIVOT_FORMAT_QUARTER_GL = "Reporting Format Quarter";
  var PIVOT_FORMAT_MONTH_GL   = "Reporting Format Month";
  var PIVOT_FORMAT_WEEK_GL    = "Reporting Format Week";
  var glName = null;

  switch(timeAgg.name)
  {
    case PIVOT_DATE_AGG_QUARTER : glName = PIVOT_FORMAT_QUARTER_GL; break;
    case PIVOT_DATE_AGG_MONTH :   glName = PIVOT_FORMAT_MONTH_GL; break;
    case PIVOT_DATE_AGG_WEEK :    glName = PIVOT_FORMAT_WEEK_GL; break;
  } // switch


  if ( glName )
  {
    var gl = globallistGetByName( glName );

    if ( gl && gl.found )
    {
      timeAgg.valueList = gl.valueList;
      timeAgg.displayList = gl.displayList;
    }
  }
}

function genTimeAggQuery( agg, fieldName, logger, compactMode, fieldAlias )
{
  if ( !fieldAlias ) {
    fieldAlias = "";
  }
  else {
    fieldAlias += ".";
  }

  var field_alias;
  var timeAgg = agg.toUpperCase();
  if ( timeAgg == PIVOT_DATE_AGG_YEAR )
  {
    field_alias = 'tochar(' + fieldAlias + fieldName + "," + '"YYYY") ';
  }
  else if ( timeAgg == PIVOT_DATE_AGG_MONTH )
  {
    field_alias = (compactMode)? 'tochar(' + fieldAlias + fieldName + "," + '"MM") ' : 'tochar(' + fieldAlias + fieldName + "," + '"YYYYMM") ';
  }
  else if ( timeAgg == PIVOT_DATE_AGG_QUARTER )
  {
    field_alias = (compactMode)? 'tochar(' + fieldAlias + fieldName + "," + '"Q") ' : 'tochar(' + fieldAlias + fieldName + "," + '"YYYYQ") ';
  }
  else if ( timeAgg == PIVOT_DATE_AGG_WEEK )
  {
    field_alias = (compactMode)? 'tochar(' + fieldAlias + fieldName + "," + '"WW") ' : 'tochar(' + fieldAlias + fieldName + "," + '"YYYYWW") ';
  }
  else if ( timeAgg == PIVOT_DATE_AGG_DAY )
  {
    field_alias = (compactMode)? 'tochar(' + fieldAlias + fieldName + "," + '"DD") ' : 'tochar(' + fieldAlias + fieldName + "," + '"YYYYMMDD") ';
  }
  else
  {
    // !!! TODO !!! unknown aggregator for pivot table chart
    logger.error("genTimeAggQuery, unknown aggregator for pivot table chart: " + agg);
    throw createReportServiceError( ERR_UNKNOWN_TIME_AGG, ERR_TYPE_ERROR, [ agg ] );
  }

  return field_alias;
}

function uesReplicateDB( bReportOnDuplicate )
{
  var ret = bReportOnDuplicate;

  var globalReplicateDB = funcs.sysinfo_get( "EnableReplicateDB" );

  // if replicate db is not enabled, but the data of current report comes from replicate db
  // When the "UseProductionDB" option is enabled, then we uses product db instead
  // Otherwise, just throw an exception and don't fetch any report data
  if ( !globalReplicateDB && bReportOnDuplicate )
  {
    var cfgUseProdDB = lib.settings.getSettingValue("Report", "UseProductionDB");

    if ( cfgUseProdDB.toString() === "true" ) {
      ret = false;
    }
    else {
      throw createReportServiceError( ERR_REPORT_NO_REPLICATEDB, ERR_TYPE_ERROR, [ ] );
    }
  }

  return ret;
}

function setFileCacheOption( fileObj, bRefresh, bUseReplicateDB, logger )
{
  var nReplicate = uesReplicateDB(!!bUseReplicateDB)? 1 : 0;
  if ( g_logDebug ) {
    logger.debug("usesReplicateDB: " + nReplicate);
  }

  fileObj.setFlag("CACHE_AGGREGATE_RESULT", 1 );
  fileObj.setFlag("USE_REPLICATE_DB", nReplicate );
  fileObj.setFlag("REFRESH_AGGREGATE_RESULT", ((bRefresh)? 1 : 0) );
}

function isAdhocField( fieldName )
{
  return (fieldName && (fieldName.indexOf(';') > 0) );
}

// De-mangle the "probsummary;assignee.name;operator;name;operator;email" to an object like,
//   {
//     "filename": operator,
//     "fieldname":"email"
//   }
function getRealFieldNameFromAdhocFieldString( strLongFieldString )
{
  var ret = null;
  var fields = strLongFieldString.split(";");
  if ( fields.length >= 2 )
  {
    ret = {
      "filename"  : fields[fields.length - 2 ],
      "fieldname" : fields[fields.length - 1 ],
      "filealias" : "ta0" + String(1 + parseInt( (fields.length)/4, 10))
    };

    ret.fieldname = ret.fieldname.replace(/(^\s*)|(\s*$)/g, "");
    ret.fullfield = ret.filealias + '.' + ret.fieldname;
  }

  return ret;
}

// Date.now in local zone
function getNowString()
{
  var d = new SCDatum();
  d.setType(3);
  var dt = new Date();
  d.setValue(dt);

  return d.getText();
}

// throw exception if any error
// call this function after SCFile.doSelect
function checkQueryRC(rc)
{
  if (rc == -1) {
    throw createReportServiceError(ERR_FAIL_EXECUTE_QUERY, ERR_TYPE_ERROR, []);
  }
}

// throw exception if any error on time duration chart with aggregation function SUM
// call this function after SCFile.doSelect
function checkQueryRC4TDSum(rc)
{
  if (rc == -1) {
    throw createReportServiceError(ERR_FAIL_EXECUTE_QUERY_TD, ERR_TYPE_ERROR, []);
  }
}


function fixQuery( file_name, query, logger )
{
  if ( file_name && (file_name !== "inbox") )
  {
    logQuery(logger, query);
    return query;
  }
  var strWhere  = ' WHERE ';
  var pos = query.toUpperCase().indexOf( strWhere );
  if ( q < 0 )
  {
    logQuery(logger, query);
    return query;
  }

  // inject query
  var qInject = null;

  if ( funcs.index("SysAdmin", vars['$lo.ucapex'])<= 0 && lib.security.getRights("Report","admin")!="true")
  {
    var _denull = funcs.denull;
    var _str = funcs.str;
    var _nullsub = funcs.nullsub;

    var groups = _denull(vars['$lo.groups']);
    var agnGrp = _denull(vars['$lo.pm.assignments']);

    var opName = funcs.operator();

    var q = ' (operator.name="' +vars['$lo.user.name']+ '" or operator.name="' + opName + '" OR ' +
      '  (inbox.manager= "' + opName + '" ) OR ' +
      '  (audience.type="everyone" ';

    if ( groups && (groups.getSize() > 0) ) {
      q += ' OR (audience.type="groups" and groups isin ' + _str(groups) + ') ';
    }
    if ( agnGrp && (agnGrp.getSize() > 0) ) {
      q += ' OR (audience.type="assignmentgroups" and assignment.groups isin ' + _str(agnGrp) + ') ';
    }

    q += ' OR (audience.type="role" and role="' + _nullsub(vars['$G.user.role'], "NONE")+'"))) ';

    qInject = q;
  }

  if ( qInject )
  {
    pos += strWhere.length;
    query = query.slice(0, pos) + qInject + " AND " + query.slice( pos, query.length );

    if ( g_logDebug ) {
      logger.debug("Query after patching: " + query);
    }
  }

  logQuery(logger, query);
  return query;
}

function logQuery(logger, query)
{
  var benchMgr = logger.benchMgr;
  if (benchMgr)
  {
    var oldQuery = benchMgr['query'];
    if ( oldQuery ) {
      oldQuery = oldQuery + " \n" + query;
    }
    else {
      oldQuery = query;
    }
    benchMgr.setProperty("query", oldQuery);
  }
}

/**
 * Make sure the @query is surrounded with '(' and ')'
 * @param query
 */
function fixDrilldownQuery( query )
{
  if ( !query ) {
    return query;
  }

  return ' ( ' + query + ' ) ';
}
