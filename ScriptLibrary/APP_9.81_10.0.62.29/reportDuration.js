
var libCmn = lib.reportCmn;
var JSON = lib.JSON.json();

var _sf = system.functions;
var _val = system.functions.val;
var _type = system.functions.type;
var _ = lib.Underscore.require();

var setTimeUnit = lib.reportCalcLine.setTimeUnit;
var convertTimeUnit = lib.reportCalcLine.convertTimeUnit;

var ERR_TYPE_ERROR         = "3";
var SIMPLE_QUERY           = "query";

var ERR_NO_STARTFIELD = 320;   // The start field of duration chart is not defined
var ERR_NO_ENDFIELD = 321;     // The end field of duration chart is not defined
var ERR_STARTFIELD_TYPE = 322; // The start field should be in date/time type
var ERR_ENDFIELD_TYPE = 323;   // The end field should be in date/time type
var ERR_TD_NO_AGG = 324;       // The aggregate function of time duration chart is not defined
var ERR_TD_COUNT = 325;        // The aggregate function \"COUNT\" is not applicable for time duration chart
var ERR_SAME_STACK_BAR = 326;  // The group field should not be same as stack field
var ERR_SAME_STACK_LINE = 327; // The trend field should not be same as group by field
var ERR_SAME_STACK_AREA = 332; // The trend field should be different from the stacked field.

// TimeUnit
var TIMEUNIT_YEAR   = "YEAR";
var TIMEUNIT_MONTH  = "MONTH";
var TIMEUNIT_WEEK   = "WEEK";
var TIMEUNIT_DAY    = "DAY";
var TIMEUNIT_HOUR   = "HOUR";
var TIMEUNIT_MINUTE = "MINUTE";
var TIMEUNIT_SECOND = "SECOND";

function toJSON(obj) {
  return JSON.stringify( obj );
}

/**
 * Set meta info for duration chart
 * @param fInbox
 * @param meta
 * @param logger
 * @constructor
 */
function setupMeta( fInbox, meta, logger )
{
  /*
   layout of calc meta,
   durationMeta: {
   startfield:
   endfield:
   label:
   }
   */
  var durationMeta = extractDurationMeta( fInbox, meta, logger );

  if ( meta.groupField && meta.groupField.ref )
  {
    meta.groupField = doHandleField( meta, meta.groupField );

    if ( meta.groupField.type === 'time' && meta.groupByTimeAgg )
    {
      var timeAggIdx = system.functions.index(meta.groupByTimeAgg.toUpperCase(), vars["$G.gl.reporting.calculatorType"]);
      meta.groupField.calculator = {
        "name"    : meta.groupByTimeAgg.toUpperCase(),
        "caption" :  vars["$G.gl.reporting.calculatorType.display"][timeAggIdx-1]
      };

      libCmn.processTimeAgg( meta.groupField.calculator );
    }

    // Stack field is only visible when the group field exists.
    if ( meta.stackField && meta.stackField.ref )
    {
      meta.stackField = doHandleField( meta, meta.stackField );

      if ( meta.stackField.type === 'time' && meta.stackTimeAgg )
      {
        var stackTimeAggIdx = system.functions.index(meta.stackTimeAgg.toUpperCase(), vars["$G.gl.reporting.calculatorType"]);
        meta.stackField.calculator = {
          "name"    : meta.stackTimeAgg.toUpperCase(),
          "caption" : vars["$G.gl.reporting.calculatorType.display"][stackTimeAggIdx-1]
        };

        libCmn.processTimeAgg( meta.stackField.calculator );
      }
    }
  }

  //logger.debug("meta: " + toJSON(meta) );
  //logger.debug("durationMeta: " + toJSON(durationMeta) );
  meta.durationMeta = durationMeta;

  var bOrderByAgg = meta.attributes['supportTopN'];
  meta.durationMeta.bOrderByAgg = (bOrderByAgg === "true") || ( parseInt(bOrderByAgg, 10) > 0);

  verifyMeta( fInbox, meta, durationMeta, logger );

  return meta;
}

function extractDurationMeta( fInbox, meta, logger )
{
  var startField = {
    "ref": fInbox['duration.startfield']
  };
  var endField = {
    "ref": fInbox['duration.endfield']
  };

  var isDurationField = fInbox['aggregation.field.timeduration'];
  if ( !isDurationField && startField.ref )
  {
    startField = doHandleField(meta, startField);
  }

  if ( isDurationField )
  {
    startField = null;
  }
  if ( meta.isNumberChart )
  {
    meta.groupField = null;
  }
  else
  {
    if ( meta.groupField )
    {
      var colorCfg = lib.ColorIndicatorService.queryFieldColor( meta.groupField.realFile, meta.groupField.realField );
      if ( colorCfg )
        meta.groupField.colorRules = colorCfg;
    }
  }

  if ( endField.ref )
  {
    endField = doHandleField(meta, endField);
  }

  var timeUnit = fInbox['duration.format']; // second, hour, day, week, year
  if ( timeUnit )
    timeUnit = timeUnit.toUpperCase();

  var durationMeta = {
    "startField": startField,
    "endField": endField,
    "timeUnit" : timeUnit,
    "isDurationField" : !!isDurationField,
    "label": fInbox['chart.number.label']
  };

  setTimeUnit( durationMeta );

  return durationMeta;
}

/**
 * Throw exception when the configuration is invalid or unsupported
 *
 * @param fInbox
 * @param durationMeta
 * @param logger
 */
function verifyMeta( fInbox, meta, durationMeta, logger )
{
  var e;
  // startField and endField are both mandatory and should be in date/time type
  if ( !durationMeta.isDurationField && (!durationMeta.startField || !durationMeta.startField.ref) )
  {
    e = libCmn.createReportServiceError( ERR_NO_STARTFIELD, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "duration.startfield";
    throw e;
  }

  if ( !durationMeta.endField || !durationMeta.endField.ref )
  {
    e = libCmn.createReportServiceError( ERR_NO_ENDFIELD, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "duration.endfield";
    throw e;
  }

  if ( !durationMeta.isDurationField && (durationMeta.startField.type != 'time') )
  {
    e = libCmn.createReportServiceError( ERR_STARTFIELD_TYPE, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "duration.startfield";
    throw e;
  }

  if ( durationMeta.endField.type != 'time' )
  {
    e = libCmn.createReportServiceError( ERR_ENDFIELD_TYPE, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "duration.endfield";
    throw e;
  }

  if ( meta.stackField && meta.stackField.ref )
  {
    if ( meta.groupField && meta.groupField.ref === meta.stackField.ref )
    {
      var bSameField = true;
      if ( meta.groupField.type == 'time' )
      {
        // for date/time field, different time aggregator means different field
        bSameField = meta.groupByTimeAgg === meta.stackTimeAgg;
      }

      if ( bSameField )
      {
        var errNo = ERR_SAME_STACK_BAR;

        if ( meta.type == "line" )
          errNo = ERR_SAME_STACK_LINE;
        else if ( meta.type == "area" )
          errNo = ERR_SAME_STACK_AREA;

        e = libCmn.createReportServiceError( errNo, ERR_TYPE_ERROR, [] );
        e.fieldName = "chart.break.down.by";
        throw e;
      }
    }
  }

  // The aggregator should not be count
  if ( !meta.aggregator )
  {
    e = libCmn.createReportServiceError( ERR_TD_NO_AGG, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "aggregation.type";
    throw e;
  }

  if ( meta.aggregator.name.toString() == 'COUNT' )
  {
    e = libCmn.createReportServiceError( ERR_TD_COUNT, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "aggregation.type";
    throw e;
  }

  if ( meta.aggregator.name.toString() == 'SUM' )
  {
    durationMeta.isSum = true;
  }

  verifyQuery( meta, durationMeta, logger );
}

function verifyQuery( meta, durationMeta, logger )
{
  var fields = [];
  var q = meta.query;
  if ( !q )
    q = "true";

  if ( meta.groupField && meta.groupField.ref )
    fields.push( meta.groupField.ref );
  if ( meta.stackField && meta.stackField.ref )
    fields.push( meta.stackField.ref );

  if ( !durationMeta.isDurationField )
    fields.push( durationMeta.startField.ref );
  fields.push( durationMeta.endField.ref );

  q = system.functions.generate_sql_query( fields, q, meta.table, true );

  if ( !q )
  {
    e = libCmn.createReportServiceError( ERR_GEN_SQL, ERR_TYPE_ERROR, [] );
    e.fieldName = "short.query";
    throw e;
  }

  var qWhere = " where ";
  var pos = q.toLowerCase().indexOf(qWhere);
  if ( pos >= 0 )
  {
    q = q.substring(0, pos + qWhere.length) + "(1=0) and (" + q.substring(pos + qWhere.length) + ")";
  }

  var f = new SCFile( meta.table );
  var rc = f.doSelect(q);
  if ( rc == -1 )
  {
    e = libCmn.createReportServiceError( ERR_EXEC_SQL, ERR_TYPE_ERROR, [] );
    e.fieldName = "short.query";
    throw e;
  }
}

/**
 * Evaluate the field type and real file/field name if it's from another file
 * @param meta
 * @param field
 */
function doHandleField( meta, field )
{
  var isAdhocField = libCmn.isAdhocField( field.ref );
  if ( isAdhocField )
  {
    var adhocField = libCmn.getRealFieldNameFromAdhocFieldString( field.ref );
    var fAdhoc = new SCFile(adhocField.filename);
    field.type = libCmn.getFieldType(fAdhoc, adhocField.fieldname);
    field.caption = libCmn.getFieldCaption( fAdhoc, adhocField.fieldname );

    field.realFile = adhocField.filename;
    field.realField = adhocField.fieldname;

    var gl = libCmn.globallistDefGet( adhocField.filename, adhocField.fieldname );
    if ( gl && gl.found )
    {
      field.valueList = gl.valueList;
      field.displayList = gl.displayList;
    }
  }
  else
  {
    var f = new SCFile( meta.table );

    field.caption = libCmn.getFieldCaption( f, field.ref );
    field.type = libCmn.getFieldType(f, field.ref);

    field.realFile  = meta.table;
    field.realField = field.ref;

    var gl = libCmn.globallistDefGet( meta.table, field.ref );
    if ( gl && gl.found )
    {
      field.valueList = gl.valueList;
      field.displayList = gl.displayList;
    }
  }

  return field;
}

/**
 * 1. Pretend to be a normal line
 * 2. Set the data source as simple query to disable the drill-down feature
 * 3. Remove unused attributes
 *
 * @param meta
 * @param logger
 */
function durationPostHandling( meta, logger )
{
  // The duration chart can be drilled down
  meta.source = "aggregate";

  // Changes, now the time duration charts are all calculated in background processor,
  // so it doesn't make sense to enable the drill-down functionality, or we might face the mandanten problem
  //meta.source = SIMPLE_QUERY;
  meta.chartModel = "duration";

  if ( !meta.durationMeta.bUseGroupField && !meta.durationMeta.bUseStackField )
  {
    meta.groupField = null;
    meta.type      = 'numeric';
    meta['@class'] = 'numeric';
    meta['numericChartLabel'] = meta.durationMeta['label'];
  }
  else
  {
    renderAs( meta, logger );
  }
  if ( meta.aggregator )
    meta.aggregator.field = null;

  delete meta.groupByTimeAgg;
  delete meta.stackTimeAgg;
  delete meta.durationMeta;
  delete meta.chartModel;
}

function renderAs( meta, logger )
{
  if ( meta.groupField && meta.groupField.type != "time" )
    meta.groupField.calculator = null;

  if ( meta.type !== 'number' && meta.type !== 'pie' && meta.type !== 'vbar' && meta.type !== 'hbar' &&
    meta.type !== 'line' && meta.type !== 'area' && meta.type !== 'stackedvbar' && meta.type !== 'stackedhbar' )
  {
    meta.type = (meta.groupField && meta.groupField.type == 'time')? "line" : "vbar";
  }

  // if it's a line, but the trend field is not in date/time type, then still render it as vbar
  if ( ( meta.type == 'line' ) && meta.groupField && ( meta.groupField.type != 'time' ) )
  {
    meta.type = 'vbar';
  }

  if ( meta.aggregator && meta.durationMeta['label'] )
  {
    meta.aggregator.caption = meta.durationMeta['label'] + " (" + meta.durationMeta.timeLabel + ")";
  }
}

/**
 * Generate the query base on meta data
 *
 * Generate the query for non duration chart, in which the fields are not in date/time type
 * The Final query would be like,
 *
 * SELECT TIMEAGG(TrendField), [group-by-field,] AGG(field1)
 *      FROM meta.table ... <copied from gen.sql.q>
 *      WHERE (query1)
 *      GROUP BY TIMEAGG(trendfield) [, group-by-field]
 *      ORDER BY TIMEAGG(trendfield) ASC [, group-by-field ASC]
 *
 * @param meta
 * @param logger
 */
function durationGenQuery( meta, logger )
{
  var generator = new queryGenerator( meta, logger );
  generator.genQuery();
}

// TODO, do we need to support self join?

/*
 {
 ref:
 timeAgg:
 type:
 realfile:
 realfield:
 query:
 }
 */
var queryGenerator = function( meta, logger ){
  this.meta = meta;
  this.logger = logger;

  // Alias of each file
  // The key is SM file name, the value is the alias in the adhoc query
  this.fileAlias = {};

  var getGroupFieldQuery = function( qFrom ){
    if ( !meta.groupField || !meta.groupField.ref )
      return "";

    var fileAlias = extractFileAlias( qFrom, meta.groupField.realFile, logger);
    if ( meta.groupByTimeAgg )
      return libCmn.genTimeAggQuery( meta.groupByTimeAgg, meta.groupField.ref, logger, false, fileAlias );

    return fileAlias + "." + meta.groupField.realField;
  };

  var getStackFieldQuery = function( qFrom ){
    if ( !meta.stackField || !meta.stackField.ref )
      return "";

    var fileAlias = extractFileAlias( qFrom, meta.stackField.realFile, logger );
    if ( meta.stackTimeAgg )
      return libCmn.genTimeAggQuery( meta.stackTimeAgg, meta.stackField.ref, logger, false, fileAlias );

    return fileAlias + "." + meta.stackField.realField;
  };

  var getGroupByClause = function( qGroupField, qStackField ){
    var ret = "";
    if ( qGroupField || qStackField )
    {
      ret = " GROUP BY ";
      if ( qGroupField )
        ret += qGroupField + " ";
      if ( qStackField )
      {
        if ( qGroupField )
          ret += ", " + qStackField + " "
        else
          ret += qStackField + " "
      }
    }

    return ret;
  }

  var getOrderByClause = function( qGroupField, bAscGroup, qStackField ){
    var ret = "";
    if ( qGroupField || qStackField )
    {
      ret = " ORDER BY ";
      if ( qGroupField )
      {
        ret += qGroupField;
        ret += (bAscGroup)? " ASC " : " DESC ";
      }


      if ( qStackField )
      {
        if ( qGroupField )
          ret += ", " + qStackField + " ASC ";
        else
          ret += qStackField + " ASC ";
      }
    }

    return ret;
  };

  /**
   * Extract the file alias from FROM sql clause
   * e.g. consider below SQL
   *   SELECT ... FROM rootcause ta01 LEFT OUTER JOIN assignment ta02 ON  ( ta01.assignee.name = ta02.name )  WHERE (...)
   *
   * For filename: rootcause, it return ta01
   * For filename: assignment, it return ta02
   *
   * @param sqlFrom
   */
  var extractFileAlias = function( sqlFrom, file_name, logger ){
    if ( file_name === meta.table )
      return "ta01";

    var fnamePattern = " " + file_name + " ";
    var pos  = sqlFrom.indexOf( fnamePattern );
    if ( pos >= 0 )
      sqlFrom = sqlFrom.substring( pos + fnamePattern.length, sqlFrom.length );

    pos  = sqlFrom.indexOf( "ta0" );
    if ( pos >= 0 )
      sqlFrom = sqlFrom.substring( pos, pos + 4 );

    return sqlFrom;
  };

  var generateFinalQuery = function(){
    generateRawQuery();
    processRawQuery();
  };

  var processRawQuery = function(){
    var durationMeta = meta.durationMeta;
    var q = durationMeta.finalquery;
    var posFrom = q.toUpperCase().indexOf(" FROM ");
    var qFrom;

    if ( posFrom > 0 )
      qFrom = q.substring( posFrom, q.length );

    var qGroupField = getGroupFieldQuery( qFrom );
    var qStackField = getStackFieldQuery( qFrom );
    var qGroupBy = getGroupByClause( qGroupField, qStackField );

    q = " SELECT ";
    if ( qGroupField )
      q += qGroupField;
    if ( qStackField )
    {
      if ( qGroupField )
        q += "," + qStackField;
      else
        q += qStackField;
    }

    var endField = durationMeta.endField;
    if ( qGroupField || qStackField )
      q += ", ";

    var queryTimeUnit = durationMeta.queryTimeUnit;
    var qAgg = "";

    qAgg += meta.aggregator.name + "( datediff(" + queryTimeUnit + ",";

    // if the field already contain the SM time duration value, then use datediff(DAY, '4000-01-01 00:00:00', DURATION-FIELD )
    if ( durationMeta.isDurationField )
      qAgg += "'4000-01-01 00:00:00'";
    else
    {
      var startField = durationMeta.startField;
      qAgg += extractFileAlias( qFrom, startField.realFile, logger ) + "." + startField.realField;
    }
    qAgg += ", " + extractFileAlias( qFrom, endField.realFile, logger ) + "." + endField.realField + ")) ";

    q += qAgg;

    if ( durationMeta.isDurationField )
    {
      var qWhere = " WHERE ";
      var posWhere = qFrom.toUpperCase().indexOf(qWhere);
      if ( posWhere > 0 )
      {
        var qCond = " (" + extractFileAlias( qFrom, endField.realFile, logger ) + "." + endField.realField + " >= \"4000-01-01 00:00:00\") and ";
        qFrom = qFrom.substring(0, posWhere+ qWhere.length ) + qCond + qFrom.substring(posWhere+ qWhere.length);
      }
    }

    q += qFrom;

    var qOrderBy;
    if ( meta.durationMeta.bOrderByAgg )
      qOrderBy = getOrderByClause( qAgg, false, qStackField );
    else
      qOrderBy = getOrderByClause( qGroupField, true, qStackField );

    q += qGroupBy + qOrderBy;

    meta.durationMeta.finalquery = q;
  }

  /**
   * Generate the queries
   */
  var generateRawQuery = function(){
    var fields = [];
    var q = meta.query;
    if ( !q )
      q = "true";

    if ( meta.groupField && meta.groupField.ref )
    {
      fields.push( meta.groupField.ref );

      // It doesn't make sense to group by null value
      // Furthermore, Oracle DB would be happy for these NOT NULLs and the indexes ( if there is any ) would be pickup
      // Sample: not (probsummary;assignee.name;operator;name;operator;sysmodtime=NULL)
      q += " and not (" + meta.groupField.ref + "=NULL) ";
    }

    if ( meta.stackField && meta.stackField.ref )
    {
      fields.push( meta.stackField.ref );

      q += " and not (" + meta.stackField.ref + "=NULL) ";
    }

    if ( !meta.durationMeta.isDurationField )
      fields.push( meta.durationMeta.startField.ref );
    fields.push( meta.durationMeta.endField.ref );

    meta.durationMeta.finalquery = system.functions.generate_sql_query( fields, q, meta.table, true );
  }

  return {
    "genQuery" : generateFinalQuery
  };
};

function normalizeStackVal (str)
{
  return str.replace(/[\s\+\-\*\/\(\)\=\'\"\\]/gi, function (s) {
    switch(s)
    {
      case '(':
      case ')':
      case '\'':
      case '\"':
      case '\\':
        return "";
    }
    return "_";
  });
}

var DurationDataList = function(){
  var dataSet = [];

  var getDataSet = function(){
    return dataSet;
  };

  /**
   * For numeric chart which only contains 1 data
   * @param numericValue
   */
  var addNumericItem = function ( aggValue ){
    var item = [];
    if ( aggValue == null )
      aggValue = "";

    item.push( aggValue.toString() );
    dataSet.push( item );
  }

  /**
   * For chart with group field, but without stack field
   * @param numericValue
   */
  var addNoStackItem = function( f, groupFieldValue, aggValue ){
    var item = [];

    if ( groupFieldValue && _type(groupFieldValue) == 3 )
    {
      groupFieldValue = _val(groupFieldValue, 2);
    }
    item.push(groupFieldValue);
    item.push(aggValue);

    dataSet.push( item );
  }

  /**
   * For chart with both group field and stack field
   * @param numericValue
   */
  var addFullItem = function( f, groupValue, stackValue, aggValue ){
    var item = [];

    if ( groupValue && _type(groupValue) == 3 )
    {
      groupValue = _val(groupValue, 2);
    }
    item.push(groupValue);

    if ( stackValue && _type(stackValue) == 3 )
    {
      stackValue = _val(stackValue, 2);
    }
    item.push(stackValue);

    item.push(aggValue);
    dataSet.push( item );
  }

  return {
    "getDataSet" : getDataSet,
    "addNumericItem" : addNumericItem,
    "addNoStackItem" : addNoStackItem,
    "addFullItem" : addFullItem
  };
}

function fetchDurationData( meta, bRefresh, logger )
{
  // Max group limitation
  var maxStack = 0;
  var maxGroup = 0;
  var curGroup = 0;
  var curStack = 0;

  var dnGroupFieldWrapper = null;
  var dnStackFieldWrapper = null;

  var DNGlobalListWrapper = lib.reportCalcLine.getDNGlobalListWrapper();
  var bUseGroupField = meta.groupField && meta.groupField.ref;
  if ( bUseGroupField )
  {
    maxGroup = libCmn.getMaxRecordLimit( meta, logger );

    dnGroupFieldWrapper = new DNGlobalListWrapper( meta.groupField, logger );
  }

  var bUseStackField = meta.stackField && meta.stackField.ref;
  if ( bUseStackField )
  {
    maxStack = libCmn.getMaxStackedRecordLimit( meta, logger );
    dnStackFieldWrapper = new DNGlobalListWrapper( meta.stackField, logger );
  }

  var dMeta = meta.durationMeta;
  dMeta.bUseGroupField = bUseGroupField;
  dMeta.bUseStackField = bUseStackField;

  var f = new SCFile( meta.table );

  if ( bUseGroupField )
    f.setSelectTop( (maxGroup <= 0 || bUseStackField)? 500 : maxGroup + 1 );
  else if ( bUseStackField )
    f.setSelectTop( (maxStack <= 0)? 500 : maxStack + 1 );

  libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);

  var sql = dMeta.finalquery;
  sql = libCmn.fixQuery( meta.table, sql, logger );
  var rc = f.doSelect(sql);

  if ( g_logDebug )
    logger.debug("Duration query done: " + sql);

  if ( dMeta.isSum )
    libCmn.checkQueryRC4TDSum(rc);
  else
    libCmn.checkQueryRC(rc);

  // ---------------------- Generate group_field, stack_field(optional), metrics --------------------------
  if ( meta.stackField && g_logDebug )
    logger.debug('stack field: ' + meta.stackField.ref);

  var groupName     = null;
  var prevGroupName = null;
  var bFirstRow     = true;
  var dataSet       = new DurationDataList();
  var fromTimeUnit  = dMeta.queryTimeUnit;
  var toTimeUnit    = dMeta.timeUnit;

  while ( rc == RC_SUCCESS )
  {
    if ( bUseGroupField )
    {
      groupName = f[0];
    }

    if ( bFirstRow )
    {
      prevGroupName = groupName;
      bFirstRow = false;
    }

    if ( groupName !== prevGroupName )
    {
      curGroup++;
      prevGroupName = groupName;
      curStack = 0;
    }
    if ( bUseGroupField && (maxGroup > 0) && (curGroup >= maxGroup) )
    {
      if ( g_logDebug )
        logger.debug("Reach maximum group limit (" + maxGroup + "), stop fetching data");

      break;
    }

    if ( !bUseGroupField && !bUseStackField )
    {
      dataSet.addNumericItem( convertTimeUnit(fromTimeUnit, toTimeUnit, f[0]) );
      break;
    }
    else
    {
      if ( bUseStackField )
      {
        if ( (maxStack <= 0) || (curStack < maxStack) )
        {
          dataSet.addFullItem(f, groupName, f[1], convertTimeUnit(fromTimeUnit, toTimeUnit, f[2]) );
          curStack++;

          if ( dnStackFieldWrapper )
            dnStackFieldWrapper.addItem( f[1] );
        }
      }
      else
      {
        dataSet.addNoStackItem(f, groupName, convertTimeUnit(fromTimeUnit, toTimeUnit, f[1]) );
      }

      if ( dnGroupFieldWrapper )
        dnGroupFieldWrapper.addItem(groupName);
    }

    rc = f.getNext();
  } // while

  // Handle the display name substitution for Group Field
  if ( dnGroupFieldWrapper && dnGroupFieldWrapper.hasDisplayNameRef() )
  {
    var gl = dnGroupFieldWrapper.getDisplayList();
    if ( gl )
    {
      meta.groupField.valueList   = gl.valueList;
      meta.groupField.displayList = gl.displayList;
    }
  }

  // Handle the display name substitution for the stack field
  if ( bUseStackField && dnGroupFieldWrapper && dnStackFieldWrapper.hasDisplayNameRef() )
  {
    var gl = dnStackFieldWrapper.getDisplayList();
    if ( meta.stackField && gl )
    {
      meta.stackField.valueList   = gl.valueList;
      meta.stackField.displayList = gl.displayList;
    }
  }

  return {
    "hasMore": false,
    "timestamp": libCmn.getNowString(),
    "data": dataSet.getDataSet()
  };
}
/**
 *
 * @param meta
 * @param bRefresh
 * @param logger
 * @returns {null}
 */
function durationGenResult( meta, bRefresh, logger )
{
  durationGenQuery( meta, logger );

  // create the result value
  var result = {
    "meta" : meta
  };

  //logger.debug("durationGenResult meta: " + toJSON(meta) );

  result.resultSet = fetchDurationData( meta, bRefresh, logger);

  durationPostHandling( meta );

  return result;
}
