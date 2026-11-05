var libCmn = lib.reportCmn;
var libDN = lib.DisplayName;

var _sf = system.functions;
var _val = system.functions.val;
var _type = system.functions.type;
var _ = lib.Underscore.require();
var JSON = lib.JSON.json();
var Class = lib.Prototype.getClass();

var ERR_TYPE_ERROR         = "3";

var SIMPLE_QUERY           = "query";
var AGGREGATE_QUERY        = "aggregate";

var ERR_CALC_MORE_FIELDS  = 310;    // "Please at least define 2 field for calculation in calcline"
var ERR_CALC_TIME_AGG_LINE = 311;   // "The trend field should aggregate to some time period"
var ERR_CALC_TIME_AGG_BAR  = 331;   // "The group by field should aggregate to some time period"
var ERR_CALC_TREND_TYPE   = 312;    // "The trend should should be in same type"
var ERR_CALC_GROUP_TYPE   = 313;    // "The group by field should be in same type, found " + mType + ", " + metrics.type
var ERR_CALC_METRIC_FIELD = 314;    // "The metrics field is not defined which is mandatory"
var ERR_CALC_METRIC_TYPE  = 315;    // "The metrics field should not be in date/time type"
var ERR_SAME_STACK_BAR    = 326;    // The group field should not be same as stack field
var ERR_SAME_STACK_LINE   = 327;    // The trend field should not be same as group by field
var ERR_CALC_NO_FOMULA    = 328;    // Calculation formula should be defined
var ERR_CALC_BAD_FOMULA   = 329;    // Invalid calculation formula: %S, error: %S
var ERR_CALC_NO_TREND     = 330;    // The trend field is not defined for calculation line A%S
var ERR_SAME_STACK_AREA   = 332;    // The trend field should be different from the stacked field.
var ERR_CALC_LINE_TREND_DT = 333;   // The data type of the trend field of calculation chart A%S should be date/time.
var ERR_TD_COUNT          = 325;    // The aggregate function \"COUNT\" is not applicable for time duration chart
var ERR_CALC_METRICS_TD   = 335;    // The data type of the metrics field should be date/time if "Time Duration" option is enabled
var ERR_CALC_METRIC_SAME_TYPE = 336;// The data type of metrics fields should be the same.
var ERR_CALC_NO_QUERY     = 337;    // The query is required for calculation field A%S.
var ERR_CALC_NO_FIELD     = 338;    // There is no visible field defined.
var ERR_CALC_PARTIAL_FIELD = 339;   // The calculation field A%S is incomplete.
var ERR_CALC_NO_CALC       = 340;   // There is no calculation formula defined.
var ERR_GEN_SQL           = 402;    // Failed to generate query statement for current chart.
var ERR_EXEC_SQL          = 403;    // Failed to execute the query for current chart.
var ERR_CALC_NO_GROUPBY   = 341;    // The group by field is not defined for calculation line A%S

// TimeUnit
var TIMEUNIT_YEAR   = "YEAR";
var TIMEUNIT_QUARTER = "QUARTER";
var TIMEUNIT_MONTH  = "MONTH";
var TIMEUNIT_WEEK   = "WEEK";
var TIMEUNIT_DAY    = "DAY";
var TIMEUNIT_HOUR   = "HOUR";
var TIMEUNIT_MINUTE = "MINUTE";
var TIMEUNIT_SECOND = "SECOND";

var PREFIX_SEP      = "#||#";

function toJSON(obj) {
  return JSON.stringify( obj );
}

/**
 * Set meta info for calcuator line
 * @param fInbox
 * @param meta
 * @param logger
 * @constructor
 */
function setupMeta( fInbox, meta, logger )
{
  meta.isNumberChart = meta.type.toLowerCase() == 'number';

  var calcMeta = {};
  calcMeta.lines = extractLines( fInbox, meta, logger );
  calcMeta.calcLines = extractFormulas( fInbox, logger );
  extractTimeUnit( fInbox, calcMeta, logger );

  meta.calcMeta = calcMeta;
  meta.calcMeta = verifyMeta( fInbox, meta, meta.calcMeta, logger );
  extractMisc( fInbox, meta, logger );

  var bOrderByAgg = meta.attributes['supportTopN'];
  meta.calcMeta.bOrderByAgg = (bOrderByAgg === "true") || ( parseInt(bOrderByAgg, 10) > 0);

  // Note, disable the OrderByAggResult because the behavior is confusing.
  meta.calcMeta.bOrderByAgg = false;

  return meta;
}

function extractTimeUnit( fInbox, calcMeta, logger )
{
  var isDurationField = fInbox['aggregation.field.timeduration'];
  calcMeta.isDurationField = !!isDurationField;

  if ( isDurationField )
  {
    var timeUnit = fInbox['duration.format']; // second, hour, day, week, year
    if ( timeUnit )
      timeUnit = timeUnit.toUpperCase();

    calcMeta.timeUnit = timeUnit;
    setTimeUnit( calcMeta );
  }
}

function setTimeUnit( dMeta )
{
  if ( !dMeta.timeUnit )
    dMeta.timeUnit = TIMEUNIT_HOUR;

  var timeUnit = dMeta.timeUnit;

  // timeUnit should be in UPPER CASE
  switch ( timeUnit )
  {
    case TIMEUNIT_YEAR:
      dMeta.timeLabel = _sf.scmsg( 'Year', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_QUARTER:
      dMeta.timeLabel = _sf.scmsg( 'Quarter', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_MONTH:
      dMeta.timeLabel = _sf.scmsg( 'Month', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_WEEK:
      dMeta.timeLabel = _sf.scmsg( 'Week', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_DAY:
      dMeta.timeLabel = _sf.scmsg( 'Day', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_HOUR:
      dMeta.timeLabel = _sf.scmsg( 'Hour', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_MINUTE:
      dMeta.timeLabel = _sf.scmsg( 'Minute', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_MINUTE;
      break;

    case TIMEUNIT_SECOND:
      dMeta.timeLabel = _sf.scmsg( 'Second', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_SECOND;
      break;

    default:
      dMeta.timeLabel = _sf.scmsg( 'Hour', "global" );
      dMeta.queryTimeUnit = TIMEUNIT_HOUR;
  }

  dMeta.queryTimeUnit = dMeta.queryTimeUnit.toLowerCase();
}

function extractMisc( fInbox, meta, logger )
{
  if ( meta.isNumberChart )
  {
    meta.calcMeta.numLabel = fInbox['chart.number.label'];
  }

  meta.calcMeta.xlabel = fInbox['chart.labelx'];
  meta.calcMeta.ylabel = fInbox['chart.labely'];
}

function extractFormulas( fInbox )
{
  // extract Calculators
  var formulas = [];
  var rawFormulas = fInbox['calcformula'];
  for ( var i = 0; i < rawFormulas.getSize(); i++ )
  {
    var item = rawFormulas[i];
    var formula = {
      "label": item.label,
      "formula": item.formula,
      "drilled": item.drilled==null?true:item.drilled
    };

    // Only push the formula
    if ( formula.formula )
      formulas.push( formula );
  }

  return formulas;
}

function getValidCalcFieldCount( calcFields )
{
  var rawSize = calcFields.getSize();

  for ( var i = rawSize - 1; i >= 0; i-- )
  {
    var rawLine = calcFields[i];
    var tfield = rawLine['tfield'];
    var mfield = rawLine['mfield'];
    var visible = !!rawLine.visible;
    var query =  rawLine.linequery;

    if ( tfield || mfield || visible || query || visible )
    {
      break;
    }
  }

  return i + 1;
}

function extractLines( fInbox, meta, logger )
{
  var firstEmpty = -1;

  // extract calcLines
  var lines = [];
  var calcFields = fInbox['calcline'];
  var nValidLine = getValidCalcFieldCount(calcFields);

  logger.debug("calc lines(" + nValidLine + "): " + calcFields);
  var metaQuery = "";


  for (var i = 0; i < nValidLine; i++)
  {
    var rawLine = calcFields[i];
    // a line contains trendfield and metrics field
    var tfield = {
      "ref": rawLine['tfield']
    };
    var mfield = {
      "ref": rawLine['mfield']
    };

    if ( !meta.isNumberChart )
    {
      if ( tfield.ref )
      {
        tfield = doHandleField(meta, tfield);
        var timeAgg = rawLine['timeagg'];
        if ( tfield.type === 'time' && timeAgg )
        {
          var timeAggIdx = system.functions.index(timeAgg.toUpperCase(), vars["$G.gl.reporting.calculatorType"]);

          tfield.calculator = {
            "name"    : timeAgg.toUpperCase(),
            "caption" : vars["$G.gl.reporting.calculatorType.display"][timeAggIdx-1],
            "simple"  : false
          };

          libCmn.processTimeAgg( tfield.calculator );
        }
      }
    }

    if ( mfield.ref )
    {
      mfield = doHandleField( meta, mfield );
    }

    var line = {
      "tfield": tfield,
      "mfield": mfield,
      "query": rawLine.linequery,
      "visible": !!rawLine.visible
    };

    logger.debug( " raw line: " + rawLine + ", visible: " + rawLine.visible );

    // the trend field is mandatory, or we ignore it
    if ( tfield.ref || meta.isNumberChart )
    {
      if ( !mfield.ref && !line.query && !line.visible )
      {
        if ( firstEmpty < 0 )
          firstEmpty = i;
      }
    }
    else
    {
      if ( firstEmpty < 0 )
        firstEmpty = i;
    }

    if ( line.query )
    {
      if ( metaQuery )
        metaQuery += " OR (" + line.query + ")";
      else
        metaQuery = " ( " +  line.query + " ) ";
    }

    lines.push( line );
  }

  if ( lines.length <= 0 )
  {
    firstEmpty = 0;
  }

  logger.debug("firstEmpty: " + firstEmpty + ", line size: " + lines.length);
  if ( ( (firstEmpty >= 0) && (firstEmpty < lines.length) ) || (firstEmpty == 0 && lines.length == 0) )
  {
    var isCount = false;;
    if ( meta.aggregator )
    {
      var agg = meta.aggregator.name;
      if ( agg && agg.toUpperCase() === "COUNT" )
      {
        isCount = true;
      }
    }

    var errNo = ERR_CALC_NO_GROUPBY;

    if ( (meta.type.toLowerCase()=="line" || meta.type.toLowerCase()=="area") && meta.model.toUpperCase()=="CALC")
    {
      errNo = ERR_CALC_NO_TREND;
    }

    if ( meta.isNumberChart )
      errNo = (isCount)? ERR_CALC_PARTIAL_FIELD : ERR_CALC_METRIC_FIELD;

    var e = libCmn.createReportServiceError( errNo, ERR_TYPE_ERROR, [ (firstEmpty + 1).toString() ] );
    e.fieldName = "calcline[" + i.toString() + "].tfield";
    throw e;
  }

  if (metaQuery)
    metaQuery = "( " + metaQuery + " )"
  meta.query = metaQuery;
  // !!! TODO, it doesn't make sense to set same field for field1/field2/field3

  return lines;
}

/**
 * Throw exception when the configuration is invalid or unsupported
 *
 * @param fInbox
 * @param calcMeta
 * @param logger
 */
function verifyMeta( fInbox, meta, calcMeta, logger )
{
  /*
   Verification rules:

   Metrics and Metrics Field

   0. Metrics is mandatory (!!!)
   1. Metrics can be count, sum, total, max, min
   2. If the Metrics is count, then the Metrics field is empty (ignored). Otherwise, the Matrics field is mandatory.
   3. The Metrics field should not be in date/time type

   Trend Field

   0. TrendField is mandatory. so does the time aggregator
   1. The TrendField should be in date/time type, and don't support cross-table field

   Group By Field

   1. The group by field is optional, and can be cross-table field
   2. Group by field can be in date/time type

   */

  // Handle GroupBy field, which would be pretend as "StackField"
  if ( meta.stackField && meta.stackField.ref )
  {
    meta.stackField = doHandleField( meta, meta.stackField );

    if ( meta.stackField.type === 'time' && meta.stackTimeAgg )
    {
      meta.stackField.calculator = {
        "name"    : meta.stackTimeAgg.toUpperCase(),
        "caption" : meta.stackTimeAgg
      };

      libCmn.processTimeAgg( meta.stackField.calculator );
    }
  }

  if ( !meta.isNumberChart )
  {
    verifyTrendField( meta, calcMeta.lines, logger );
  }

  verifyMetricsField( meta, calcMeta.lines, logger );
  verifyFormulas( calcMeta.calcLines, calcMeta.lines, logger );
  verifyQuery( meta, calcMeta, logger );
  fixForNumberPieChart( meta, calcMeta, logger );
  verifyVisibleLine( meta, calcMeta, logger );

  return calcMeta;
}

/**
 * For number and pie chart, only support 1 visible number, either the calculation field, or the calculation formula
 *
 * @param meta
 * @param calcMeta
 * @param logger
 */
function fixForNumberPieChart( meta, calcMeta, logger )
{
  if ( !meta.isNumberChart && (meta.type!="pie" || meta.model!="CALC"))
    return;

  var nVisibleField = 0;
  var lines = calcMeta.lines;
  for (var i = 0; i < lines.length; i++)
  {
    var line = lines[i];
    if (line.visible)
      nVisibleField++;
  }
  var calcLines = meta.calcMeta.calcLines;
  var nTotalVisible = nVisibleField + calcLines.length;

  // If there is no visible field/formula, just skip it. Let the verifyXXX routines take care that
  if ( nTotalVisible <= 1 )
    return;

  var bIgnoreAllField = false;
  var nFormula = nTotalVisible - nVisibleField;
  if (nFormula >= 1)
  {
    // 1. only keep 1 formula
    calcMeta.calcLines.splice(1, calcMeta.calcLines.length - 1 );

    // 2. set all calculation field as invisible
    bIgnoreAllField = true;
  }

  //logger.debug("fixForNumberChart, total-visible: " + nTotalVisible + ", visible-field: " + nVisibleField + ", ignore-all-field: " + bIgnoreAllField);

  // 1. set all calculation field as invisible if there is already calc formula defined.
  // 2. Only keep 1 visible line if there is no visible calculation formula
  var bFoundVisibleField = false;
  if ( nVisibleField >= 1 )
  {
    var lines = calcMeta.lines;
    for (var i = 0; i < lines.length; i++)
    {
      var line = lines[i];
      if ( line.visible )
      {
        if ( bFoundVisibleField || bIgnoreAllField )
        {
          line.visible = false;
        }
        else if ( !bFoundVisibleField )
        {
          bFoundVisibleField = true;
        }
      }
    }
  }

}

function verifyVisibleLine( meta, calcMeta, logger )
{
  var nVisibleLine = 0;
  var lines = calcMeta.lines;
  for (var i = 0; i < lines.length; i++)
  {
    var line = lines[i];
    if (line.visible)
      nVisibleLine++;
  }

  var calcLines = meta.calcMeta.calcLines;
  meta.cntVisibleLine = nVisibleLine + calcLines.length;

  if ( meta.cntVisibleLine < 1 )
  {
    var errNo = ( meta.isNumberChart )? ERR_CALC_NO_CALC : ERR_CALC_NO_FIELD;
    e = libCmn.createReportServiceError( errNo, ERR_TYPE_ERROR, [ ] );
    e.fieldName = "calcline["+ 0 + "].linequery";
    throw e;
  }
}

function verifyQuery( meta, calcMeta, logger )
{
  var q = "true";
  var calcLines = calcMeta.lines;
  for ( var i = 0; i < calcLines.length; i++ )
  {
    var fields = [];
    var line = calcLines[i];
    q = line.query;
    if ( !q )
      q = "true";

    if ( line.tfield && line.tfield.ref )
      fields.push( line.tfield.ref );

    if ( meta.stackField && meta.stackField.ref )
      fields.push( meta.stackField.ref );

    if ( fields.length == 0 )
      fields.push('*');

    q = system.functions.generate_sql_query( fields, q, meta.table, true );
    if ( !q )
    {
      e = libCmn.createReportServiceError( ERR_GEN_SQL, ERR_TYPE_ERROR, [ (i + 1).toString() ] );
      e.fieldName = "calcline["+ i + "].linequery";
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
      e = libCmn.createReportServiceError( ERR_EXEC_SQL, ERR_TYPE_ERROR, [ (i + 1).toString() ] );
      e.fieldName = "calcline["+ i + "].linequery";
      throw e;
    }
  }
}

function verifyFormulas( formulas, lines, logger )
{
  if ( !formulas )
    return;

  var cntLines = lines.length;
  var cntFormulas = formulas.length;
  for ( var i = 0; i < cntFormulas; i++ )
  {
    verifyFormula(i, cntLines, formulas[i].formula, logger );
  }
}

function verifyFormula( nIndex, lineCount, formula, logger )
{
  if ( !formula )
  {
    e = libCmn.createReportServiceError( ERR_CALC_NO_FOMULA, ERR_TYPE_ERROR, [] );
    e.fieldName = "calcformula["+ nIndex + "].formula";
    throw e;
  }

  var opArray=[];
  for ( var i = 0; i < lineCount; i++ )
  {
    opArray.push( Math.random() * 100);
  }

  try{
    var strFunc = constructCalc( opArray, formula, logger );
    testCalcItem( strFunc );
  }
  catch( e )
  {
    e = libCmn.createReportServiceError( ERR_CALC_BAD_FOMULA, ERR_TYPE_ERROR, [formula, e.message] );
    e.fieldName = "calcformula["+ nIndex + "].formula";
    throw e;
  }
}

function verifyTrendField ( meta, calcLineArray, logger )
{
  var e;
  if ( !calcLineArray || calcLineArray.length < 1 )
  {
    e = libCmn.createReportServiceError( ERR_CALC_MORE_FIELDS, ERR_TYPE_ERROR, [] );
    e.fieldName = "calcline[0].tfield";
    throw e;
  }

  var bCheckTrendType = (meta.type.toLowerCase() == "line") || (meta.type.toLowerCase() == "area");
  if ( vars['$G.bg'] )
    bCheckTrendType = false;

  var timeAgg;
  var fieldType;

  /*
   Verification rules:

   1. The TrendField is mandatory, all the trend field should be in same type
   2. If the first trend field is in time type, then time aggregator is mandatory
   3. Otherwise, the time aggregators are all ignored
   */
  for ( var i = 0; i < calcLineArray.length; i++ )
  {
    var line = calcLineArray[i].tfield;

    if ( !line || !line.ref )
    {
      e = libCmn.createReportServiceError( ERR_CALC_NO_TREND, ERR_TYPE_ERROR, [ (i+1).toString() ] );
      e.fieldName = "calcline[" + i.toString() + "].tfield";
      throw e;
    }

    if ( i == 0 )
    {
      fieldType = line.type;
      timeAgg = line.calculator;
      if ( (line.type === 'time') && (!timeAgg) )
      {
        var errNo = ( meta.type == "line" || meta.type == "area" ) ? ERR_CALC_TIME_AGG_LINE : ERR_CALC_TIME_AGG_BAR;

        e = libCmn.createReportServiceError( errNo, ERR_TYPE_ERROR, [] );
        e.fieldName = "calcline[" + i.toString() + "].timeagg";
        throw e;
      }
    }
    else if ( ( i > 0 ) && ( timeAgg && (!line.calculator || (timeAgg.name !== line.calculator.name) ) ) )
    {
      line.calculator = timeAgg;
    }

    if ( bCheckTrendType && line.type !== "time" )
    {
      e = libCmn.createReportServiceError( ERR_CALC_LINE_TREND_DT, ERR_TYPE_ERROR, [ (i+1).toString() ] );
      e.fieldName = "calcline[" + i.toString() + "].tfield";
      throw e;
    }

    if ( line.type !== fieldType )
    {
      var errNo = ( meta.type == "line" || meta.type == "area" ) ? ERR_CALC_TREND_TYPE : ERR_CALC_GROUP_TYPE;
      e = libCmn.createReportServiceError( errNo, ERR_TYPE_ERROR, [] );
      e.fieldName = "calcline[" + i.toString() + "].tfield";
      throw e;
    }

    if ( meta.stackField && meta.stackField.ref )
    {
      if ( line.ref === meta.stackField.ref )
      {
        var bSameField = true;
        if ( line.type == 'time' )
        {
          bSameField = false;
          // for date/time field, different time aggregator means different field
          if ( line.calculator && line.calculator.name && meta.stackTimeAgg )
            bSameField = line.calculator.name.toUpperCase() === meta.stackTimeAgg.toUpperCase();
        }

        if ( bSameField )
        {
          var errNo = ERR_SAME_STACK_BAR;

          if ( meta.type == "line" )
            errNo = ERR_SAME_STACK_LINE;
          else if ( meta.type == "area" )
            errNo = ERR_SAME_STACK_AREA;

          e = libCmn.createReportServiceError( errNo, ERR_TYPE_ERROR, [] );
          e.fieldName = "calcline[" + i.toString() + "].tfield";
          throw e;
        }
      }

    }
  }
}

function verifyMetricsField( meta, calcLineArray, logger )
{
  // the Metrics fields are ignored when the aggregator is COUNT
  var agg;
  if ( meta.aggregator )
  {
    agg = meta.aggregator.name;
    if ( agg && agg.toUpperCase() === "COUNT" )
    {
      // If "COUNT" is used, then the duration flag is ignored
      meta.calcMeta.isDurationField = false;
      return;
    }
  }

  var mType;

  // 1. The metrics field should be in same type
  for ( var i = 0; i < calcLineArray.length; i++ )
  {
    var metrics = calcLineArray[i].mfield;

    if ( !metrics.ref )
    {
      e = libCmn.createReportServiceError( ERR_CALC_METRIC_FIELD, ERR_TYPE_ERROR, [ (i+1).toString() ] );
      e.fieldName = "calcline[" + i.toString() + "].mfield";
      throw e;
    }

    if ( i == 0 )
      mType = metrics.type;
    else if ( ( i > 0 ) && ( mType !== metrics.type ) )
    {
      logger.warn( "The metrics fields should be in same type, found " + mType + ", " + metrics.type );

      e = libCmn.createReportServiceError( ERR_CALC_METRIC_SAME_TYPE, ERR_TYPE_ERROR, [] );
      e.fieldName = "calcline[" + i.toString() + "].mfield";
      throw e;
    }

    if ( meta.calcMeta.isDurationField )
    {
      if ( metrics.type !== 'time' )
      {
        e = libCmn.createReportServiceError( ERR_CALC_METRICS_TD, ERR_TYPE_ERROR, [] );
        e.fieldName = "calcline[" + i.toString() + "].mfield";
        throw e;
      }
    }
    else if ( metrics.type === 'time' )
    {
      e = libCmn.createReportServiceError( ERR_CALC_METRIC_TYPE, ERR_TYPE_ERROR, [] );
      e.fieldName = "calcline[" + i.toString() + "].mfield";
      throw e;
    }
  }

  // TODO, verify the metrics field for numeric chart
}

function getFieldCaption( filename, field_name )
{
  var ret = _sf.get_field_caption(field_name, filename);
  if (ret.indexOf("Could not be found") >= 0)
  {
    ret = field_name;
  }

  return ret;
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
    field.caption = getFieldCaption( adhocField.filename, adhocField.fieldname );

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

    field.caption = getFieldCaption( meta.table, field.ref );
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
function calcLinePostHandling( meta, logger )
{
  meta.source = AGGREGATE_QUERY;

  if ( !meta.isNumberChart )
  {
    meta.groupField = meta.calcMeta.lines[0].tfield;
    var colorCfg = lib.ColorIndicatorService.queryFieldColor( meta.groupField.realFile, meta.groupField.realField );
    if ( colorCfg )
      meta.groupField.colorRules = colorCfg;

    if ( meta.calcMeta.xlabel )
      meta.groupField.caption = meta.calcMeta.xlabel;
  }

  meta.aggregator.field = null;

  renderAs( meta, logger );

  {

    if (meta.calcMeta.ylabel && meta.type !="numeric")
      meta.aggregator.caption = meta.calcMeta.ylabel;

    if ( meta.calcMeta.calcLines && meta.calcMeta.calcLines.length >= 1 && meta.calcMeta.calcLines[0].label )
    {
      if ( meta.calcMeta.ylabel )
        meta.aggregator.caption = meta.calcMeta.ylabel;
      else
        meta.aggregator.caption = meta.calcMeta.calcLines[0].label;
    }
  }

  delete meta.groupByTimeAgg;
  delete meta.stackTimeAgg;
  delete meta.calcMeta;
  delete meta.cntVisibleLine;
  delete meta.isNumberChart;
  delete meta.chartModel;
}

function renderAs( meta, logger )
{
  if ( meta.groupField.type != "time" )
    meta.groupField.calculator = null;

  if ( meta.type !== 'pie' && meta.type !== 'number' && meta.type !== 'vbar' && meta.type !== 'hbar' &&
    meta.type !== 'line' && meta.type !== 'area' && meta.type !== 'stackedvbar' && meta.type !== 'stackedhbar' )
  {
    meta.type = (meta.groupField.type == 'time')? "line" : "vbar";
  }

  // if it's a line, but the trend field is not in date/time type, then still render it as vbar
  if ( ( meta.type == 'line' ) && meta.groupField && ( meta.groupField.type != 'time' ) )
  {
    meta.type = 'vbar';
  }

  if ( meta.isNumberChart )
  {
    if (meta.cntVisibleLine == 1)
    {
      meta.groupField = null;
      meta.stackField = null;

      meta.type      = 'numeric';
      meta['@class'] = 'numeric';
      meta['numericChartLabel'] = meta.calcMeta.numLabel;
    }
    else
    {
      meta.stackField = null;
      meta.type = 'vbar';
      meta.groupField.caption = (meta.calcMeta.xlabel)? meta.calcMeta.xlabel : meta.calcMeta.numLabel;
    }
  }

  // If the aggergator is COUNT, then the browser would handle the calculated result as integer
  // So we pretend to be an SUMM to keep the float result
  if ( meta.aggregator && meta.aggregator.name === "COUNT" )
  {
    meta.aggregator.name = "SUM";
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
function lineGenQuery( meta, logger )
{
  var generator = (meta.isNumberChart)? new numericQueryGenerator( meta, logger ) : new generalQueryGenerator( meta, logger );
  generator.genQuery();
}

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
var generalQueryGenerator = function( meta, logger ){
  this.meta = meta;
  this.logger = logger;

  // Alias of each file
  // The key is SM file name, the value is the alias in the adhoc query
  this.fileAlias = {};

  var getTrendFieldQuery = function( field, qFrom ){
    var fileAlias = extractFileAlias( qFrom, field.realFile, logger);
    logger.debug('field: ' + field.realField + " (" + field.realFile + "), fileAlias: " + fileAlias);

    if ( field.type == 'time' )
      return libCmn.genTimeAggQuery( field.calculator.name, field.realField, logger, false, fileAlias );

    return fileAlias + "." + field.realField;
  };

  var getGroupFieldQuery = function( qFrom ){
    if ( !meta.stackField || !meta.stackField.ref )
      return "";

    var fileAlias = extractFileAlias( qFrom, meta.stackField.realFile, logger );
    if ( meta.stackTimeAgg )
      return libCmn.genTimeAggQuery( meta.stackTimeAgg, meta.stackField.realField, logger, false, fileAlias );

    return fileAlias + "." + meta.stackField.realField;
  };

  var getGroupByClause = function( qTrend, qGroupField ){
    var ret = " GROUP BY " + qTrend + " ";
    if ( qGroupField )
      ret += ", " + qGroupField + " ";

    return ret;
  }

  var getOrderByClause = function( qTrend, bAscTrend, qGroupField ){
    var ret = " ORDER BY " + qTrend;
    ret += (bAscTrend)? " ASC " : " DESC ";
    if ( qGroupField )
      ret += ", " + qGroupField + " ASC ";

    return ret;
  }

  /**
   * Extract the file alias from FROM clause
   * e.g. consider the following SQL
   *   SELECT ... FROM rootcause ta01 LEFT OUTER JOIN assignment ta02 ON  ( ta01.assignee.name = ta02.name )  WHERE (  )
   *
   * For filename: rootcause, we return ta01
   * For filename: assignment, we return ta02
   *
   * @param qFrom
   */
  var extractFileAlias = function( qFrom, filename, logger ){
    if ( filename === meta.table )
      return "ta01";

    var fnamePattern = " " + filename + " ";
    var pos  = qFrom.indexOf( fnamePattern );
    if ( pos >= 0 )
      qFrom = qFrom.substring( pos + fnamePattern.length, qFrom.length );

    pos  = qFrom.indexOf( "ta0" );
    if ( pos >= 0 )
      qFrom = qFrom.substring( pos, pos + 4 );

    return qFrom;
  };

  var setFileAlias = function( smFileName, alias ){
    var oldAlias = fileAlias[smFileName];
    logger.debug( "sm file: " + smFileName + ", old-alias: " + oldAlias + ", alias: " + alias );

    fileAlias[smFileName] = alias;
  };

  var generateFinalQuery = function(){
    generateRawQuery();
    processRawQuery();
  };

  var processRawQuery = function(){
    var calcLines =  meta.calcMeta.lines;
    for ( var i = 0; i < calcLines.length; i++ )
    {
      var line = calcLines[i];
      var q    = line.finalquery;

      var posFrom  = q.toUpperCase().indexOf(" FROM ");
      var qFrom;

      if ( posFrom > 0 )
        qFrom = q.substring( posFrom, q.length );

      var qTrend = getTrendFieldQuery( line.tfield, qFrom );
      var qGroupField = getGroupFieldQuery( qFrom );
      var qGroupBy = getGroupByClause( qTrend, qGroupField );

      q = " SELECT " + qTrend + ", ";
      if ( qGroupField )
        q += qGroupField + ", ";

      var qAgg = "";

      if ( meta.aggregator.name.toUpperCase() === "COUNT" )
        qAgg += " COUNT(*) ";
      else
      {
        if ( meta.calcMeta.isDurationField )
        {
          var queryTimeUnit = meta.calcMeta.queryTimeUnit;

          qAgg += meta.aggregator.name + '( datediff(' + queryTimeUnit + ', \'4000-01-01 00:00:00\', ';
          qAgg += extractFileAlias( qFrom, line.mfield.realFile, logger ) + "." + line.mfield.realField;
          qAgg += ') )';
        }
        else
          qAgg += meta.aggregator.name + " (" + extractFileAlias( qFrom, line.mfield.realFile, logger ) + "." + line.mfield.realField + ") ";
      }

      q += qAgg;

      if (  meta.calcMeta.isDurationField )
      {
        var qWhere = " WHERE ";
        var posWhere = qFrom.toUpperCase().indexOf(qWhere);
        if ( posWhere > 0 )
        {
          var qCond = " (" + extractFileAlias( qFrom, line.mfield.realFile, logger ) + "." + line.mfield.realField + " >= \"4000-01-01 00:00:00\") and ";
          qFrom = qFrom.substring(0, posWhere+ qWhere.length ) + qCond + qFrom.substring(posWhere+ qWhere.length);
        }
      }

      q += qFrom;

      var qOrderBy;
      if ( meta.calcMeta.bOrderByAgg )
        qOrderBy = getOrderByClause( qAgg, false, qGroupField );
      else
        qOrderBy = getOrderByClause( qTrend, true, qGroupField );

      q += qGroupBy + qOrderBy;

      line.finalquery = q;
      logger.debug("Query for field - A" + (i+1).toString() + ": " + q);
    }
  }

  /**
   * Generate the queries
   */
  var generateRawQuery = function(){
    var q = "true";
    var calcLines = meta.calcMeta.lines;
    for ( var i = 0; i < calcLines.length; i++ )
    {
      var fields = [];
      var line = calcLines[i];
      q = line.query;
      if ( !q )
        q = "true";

      if ( line.tfield && line.tfield.ref )
      {
        fields.push( line.tfield.ref );

        // It doesn't make sense to group by null value
        // Furthermore, Oracle DB would be happy for these NOT NULLs and the indexes ( if there is any ) would be pickup
        // Sample: not (probsummary;assignee.name;operator;name;operator;sysmodtime=NULL)
        q += " and not (" + line.tfield.ref + "=NULL) ";
      }

      if ( meta.stackField && meta.stackField.ref )
      {
        fields.push( meta.stackField.ref );

        q += " and not (" + meta.stackField.ref + "=NULL) ";
      }

      line.finalquery = system.functions.generate_sql_query( fields, q, meta.table, true );
    }
  }

  return {
    "genQuery" : generateFinalQuery
  };
};

/**
 * Generate query for numeric chart
 *
 * @param meta
 * @param logger
 * @returns {{genQuery: Function}}
 */
var numericQueryGenerator = function( meta, logger ){

  this.meta = meta;
  this.logger = logger;

  // Alias of each file
  // The key is SM file name, the value is the alias in the adhoc query
  this.fileAlias = {};

  var bIsCount = ( meta.aggregator && meta.aggregator.name && meta.aggregator.name.toLowerCase() == 'count' );

  var generateFinalQuery = function(){
    generateRawQuery();
    processRawQuery();
  };

  var getGroupQuery = function( mfieldname ){
    if ( bIsCount )
      return '*';

    // The metrics field in duration chart is always from main file, i.e. ta01
    var fileAlias = "ta01";
    var qMetric = "";

    if ( meta.calcMeta.isDurationField )
    {
      var queryTimeUnit = meta.calcMeta.queryTimeUnit;

      qMetric = ' datediff(' + queryTimeUnit + ',\'4000-01-01 00:00:00\', ';
      qMetric += fileAlias + "." + mfieldname;
      qMetric += ')';
    }
    else
      qMetric = fileAlias + "." + mfieldname;

    return qMetric;
  };

  var processSelect = function( q, aggName, mfieldname ){
    var qFrom   = " FROM ";
    var qSelect = "SELECT ";

    var posFrom   = q.toUpperCase().indexOf( qFrom );

    var qFinal = "SELECT " + aggName + "(" + getGroupQuery( mfieldname );
    qFrom = q.substring( posFrom );

    if (  meta.calcMeta.isDurationField )
    {
      var qWhere = " WHERE ";
      var posWhere = qFrom.toUpperCase().indexOf(qWhere);
      if ( posWhere > 0 )
      {
        var qCond = " (" + "ta01." + mfieldname + " >= \"4000-01-01 00:00:00\") and ";
        qFrom = qFrom.substring(0, posWhere+ qWhere.length ) + qCond + qFrom.substring(posWhere+ qWhere.length);
      }
    }

    qFinal += ")" + qFrom;

    return qFinal;
  }

  var processRawQuery = function(){
    var calcLines =  meta.calcMeta.lines;
    for ( var i = 0; i < calcLines.length; i++ )
    {
      var line = calcLines[i];
      var q    = line.finalquery;
      var mfieldname = (bIsCount)? "" : line.mfield.realField;

      line.finalquery = processSelect( q, meta.aggregator.name.toUpperCase(), mfieldname );

      logger.debug("Query for field - A" + (i+1).toString() + ": " + line.finalquery);
    }
  }

  /**
   * Generate the queries
   */
  var generateRawQuery = function(){
    var q = "true";
    var calcLines = meta.calcMeta.lines;
    for ( var i = 0; i < calcLines.length; i++ )
    {
      var fields = [];
      var line = calcLines[i];
      q = line.query;
      if ( !q )
        q = "true";

      fields.push( ( bIsCount )? '*' : line.mfield.ref );
      line.finalquery = system.functions.generate_sql_query( fields, q, meta.table, true );

    }
  }

  return {
    "genQuery" : generateFinalQuery
  };
};

function normalizeStackVal (str)
{
  return str.replace(/[\s\+\*\/\(\)\=\'\"\\]/gi, function (s) {
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

function normalizeStackDisp (str)
{
  return str.replace(/[\'\"\\]/gi, function (s) {
    switch(s)
    {
      case '\'':
      case '\"':
        return "";
      case '\\':
        return "\/";
    }
    return "_";
  });
}

function calcWithoutStack( cntVisibleLine, stackField, calcLines, trendArray, lines, bNullIsZero, logger)
{

  var glWrapper = createGLWrapper( null, logger );
  var resultData = [];

  var prefixSep = getPrefixSep( stackField, logger );
  for ( var i = 0; i < trendArray.length; i++ )
  {
    var opArray = [];
    var trend = trendArray[i];
    for ( var nLine = 0; nLine < lines.length; nLine++ )
    {
      var line = lines[nLine];
      var dataMap = line.dataSet;

      if ( bNullIsZero && (dataMap[trend] == null) )
        opArray.push(0);
      else
        opArray.push(dataMap[trend]);

      if ( line.visible )
      {
        var stackName;
        var reField;
        if ( line.mfield && line.mfield.ref ){
            stackName = line.mfield.caption;
            reField = line.mfield.realField;
        }
        else{
            stackName = line.tfield.caption;
            reField = line.tfield.realField;
        }

        var prefix = ( cntVisibleLine > 1 )? ("A" + (nLine+1).toString() + "-") : "";

        if ( cntVisibleLine > 1 )
        {
          resultData.push( [trend, normalizeStackVal(prefix + prefixSep + stackName), dataMap[trend]] );
          glWrapper.addItem( null, normalizeStackVal(prefix + prefixSep + stackName), normalizeStackDisp(prefix + stackName), line.query, true, reField );
          
        }
        else if ( cntVisibleLine == 1 )
        {
          resultData.push( [trend, dataMap[trend]] );
        }
      }
    }

    for (var nCalc = 0; nCalc < calcLines.length; nCalc++)
    {
      var calcLine = calcLines[nCalc];
      var strFunc = constructCalc( opArray, calcLine.formula, logger );

      if ( cntVisibleLine > 1 )
      {
        var stackName = calcLine.label;
        resultData.push( [trend, normalizeStackVal(stackName) + nCalc.toString() + prefixSep, calcItem(strFunc, logger)] );
        var query = makeCalcLineQuery(lines, calcLine);
        var refField =  getCalcsRealField(calcLine.formula, calcLine.drilled, lines);
        var drillflag = true;
        drillflag = calcLine.drilled;
        //glWrapper.addItem( null, normalizeStackVal(stackName) + nCalc.toString() + prefixSep, normalizeStackDisp(stackName), query);
        glWrapper.addItem( null, normalizeStackVal(stackName) + nCalc.toString() + prefixSep, normalizeStackDisp(stackName), query, drillflag, refField);
      
      }
      else if ( cntVisibleLine == 1 )
        resultData.push( [trend, calcItem(strFunc, logger)] );
    }
  }

  if ( cntVisibleLine > 1 )
    updateStackGL( stackField, glWrapper, logger );

  logger.debug("resultData: " + toJSON(resultData) );

  return resultData;
}

function calcWithoutGroup( cntVisibleLine, stackField, calcLines, lines, bNullIsZero, logger)
{

  var glWrapper = createGLWrapper( null, logger );
  var resultData = [];
  var opArray = [];

  for ( var nLine = 0; nLine < lines.length; nLine++ )
  {
    var line = lines[nLine];
    var dataSet = line.dataSet;
    var lineData = null;

    if ( bNullIsZero && ( (dataSet.length == 0) || (dataSet[0] == null) ) )
    {
      lineData = 0;
    }
    else
    {
      lineData = (dataSet.length > 0)? dataSet[0] : null;
    }

    opArray.push(lineData);
    if ( line.visible )
    {
      if ( cntVisibleLine > 1 )
      {
        var prefix = ( cntVisibleLine > 1 )? ("A" + (nLine+1).toString()) : "";

        resultData.push( [normalizeStackVal(prefix+ PREFIX_SEP ), lineData ] );
        glWrapper.addItem( null, normalizeStackVal(prefix+ PREFIX_SEP ), normalizeStackDisp(prefix) );
      }
      else if ( cntVisibleLine == 1 )
      {
        resultData.push( [lineData] );
      }
    }
  }

  for (var nCalc = 0; nCalc < calcLines.length; nCalc++)
  {
    var calcLine = calcLines[nCalc];
    var strFunc = constructCalc( opArray, calcLine.formula, logger );

    if ( cntVisibleLine > 1 )
    {
      var stackName = calcLine.label;
      resultData.push( [normalizeStackVal(stackName) + nCalc.toString() + PREFIX_SEP, calcItem(strFunc, logger)] );

      glWrapper.addItem( null, normalizeStackVal(stackName) + nCalc.toString() + PREFIX_SEP, normalizeStackDisp(stackName) );
    }
    else if ( cntVisibleLine == 1 )
      resultData.push( [calcItem(strFunc, logger)] );
  }

  if ( cntVisibleLine > 1 )
    updateStackGL( stackField, glWrapper, logger );
  else
  {
    resultData = (resultData.length > 0)? [ [resultData[0].toString()] ]: "0";
  }

  return resultData;
}

/**
 * DNGlobalListWrapper is used for a global list
 */
var DNGlobalListWrapper = Class.create({
  initialize : function ( srcField, log){
    this.logger = log;

    if ( srcField && !srcField.valueList )
    {
      this.fromFile  = srcField.realFile;
      this.fromField = srcField.realField;

      this.refFile = libDN.getFieldReferenceTable( this.fromFile, this.fromField);
      if ( this.refFile )
      {
        this.valueList = [];
        this.displayList = [];
      }
    }
  },

  addItem : function ( val ){
    if ( this.refFile && (val !== null))
    {
      this.valueList.push(val);
      this.displayList.push(libDN.getReferenceDisplayName( val, this.refFile));
    }
  },

  addValueList : function ( valList ){
    if ( this.refFile && (valList !== null))
    {
      for ( var i = 0; i < valList.length; i++ )
      {
        var val = valList[i];

        this.valueList.push(val);
        this.displayList.push(libDN.getReferenceDisplayName( val, this.refFile));
      }
    }
  },

  getDisplayList : function(){
    if ( !this.refFile )
      return null;

    return {
      "valueList": this.valueList,
      "displayList": this.displayList
    };
  },

  hasDisplayNameRef : function(){
    return !!this.refFile;
  }

});

// for export of DNGlobalListWrapper Object
// To caller, use the code like,
//   var DNGlobalListWrapper = lib.reportCalcLine.getDNGlobalListWrapper();
//   var t1 = new DNGlobalListWrapper( fieldDef, logger);
//
function getDNGlobalListWrapper()
{
  return DNGlobalListWrapper;
}

/**
 * For calc chart with
 */
var GlobalListWrapperEmpty = Class.create({
  initialize : function (ignore1, ignore2, log){
    this.logger = log;
    this.glMergedMap = {};
    this.glQueryMap = {};
    this.glDrilledMap = {};
    this.glRealFieldMap = {};
  },

  addItem : function ( ignored1, key, val, query, drilled, reField ){
    if ( key ) {
      this.glMergedMap[key] = val;
      this.glQueryMap [key] = query;
      this.glDrilledMap[key] = drilled;
      this.glRealFieldMap[key] = reField;
      
    }

  },

  getDisplayList : function (){
    if ( !this.glMergedMap || (this.glMergedMap.length <= 0) )
      return null;

    var gl = {
      "valueList": [],
      "displayList": [],
      "queryList": [],      
      "drillList":[],
      "realFieldList":[]
    };
    
    var logger = this.logger;
    var glQueryMap = this.glQueryMap;
    var glDrilledMap = this.glDrilledMap;
    var glRealFieldMap = this.glRealFieldMap;
    
    _.map(this.glMergedMap, function (val, key)
    {
      gl.valueList.push(key);
      gl.displayList.push(val);
      gl.queryList.push(glQueryMap[key]);
      gl.drillList.push(glDrilledMap[key]);
      gl.realFieldList.push(glRealFieldMap[key]);
    });

    return gl;
  }
});

var GlobalListWrapper = Class.create({
  initialize : function (vList, dList, log){
    this.valueList = vList;
    this.dispList = dList;
    this.logger = log;
    this.glMap = {};
    this.glQueryMap = {};
    this.glMergedMap = {};
    
    this.glDrilledMap = {};
    this.glRealFieldMap = {};

    if (! this.valueList )
      return;

    for (var i = 0; i < this.valueList.length; i++)
    {
      this.glMap[this.valueList[i]] = this.dispList[i];
    }
  },

  addItem : function (rawItem, keyPrefix, valPrefix, query, drilled, reField ){
    if (!rawItem )
      return;

    var dispVal = this.glMap[rawItem];

    if (typeof dispVal === "undefined")
      dispVal = rawItem;

    var decorateItem = keyPrefix + rawItem;
    this.glMergedMap[decorateItem] = valPrefix + dispVal;
    this.glQueryMap [decorateItem] = query;
    this.glDrilledMap[decorateItem] = drilled;
    this.glRealFieldMap[decorateItem] = reField;
  },  

  getDisplayList : function (){
    if ( !this.glMergedMap || (this.glMergedMap.length <= 0) )
      return null;

    var gl = {
      "valueList": [],
      "displayList": [],
      "queryList": [],      
      "drillList":[],
      "realFieldList":[]
 
    };

    var glQueryMap = this.glQueryMap;
    var glDrilledMap = this.glDrilledMap;
    var glRealFieldMap = this.glRealFieldMap;
    
    _.map(this.glMergedMap, function (val, key)
    {
      gl.valueList.push(key);
      gl.displayList.push(val);
      gl.queryList.push(glQueryMap[key]);
      gl.drillList.push(glDrilledMap[key]);
      gl.realFieldList.push(glRealFieldMap[key]);
    });

    return gl;
  }
});

var GlobalListWrapperMonth = Class.create(GlobalListWrapper, {
  addItem : function( rawItem, decoratePrefix, valPrefix, query){
    if ( !rawItem || !this.valueList )
      return;

    var year = rawItem.substring(0, 4);
    var month = rawItem.substring(4);
    if ( !month )
      return;

    var dispVal = this.glMap[ month ];
    if ( typeof dispVal === "undefined" )
      dispVal = month;

    var decorateItem = decoratePrefix + rawItem;
    this.glMergedMap[ decorateItem ] = valPrefix + year + dispVal;
    this.glQueryMap [decorateItem] = query;
  },
  
  addItem : function( rawItem, decoratePrefix, valPrefix, query, drilled, reField){
    if ( !rawItem || !this.valueList || !this.valueList.length )
      return;

    var year = rawItem.substring(0, 4);
    var quarter = rawItem.substring(4);
    if ( !quarter )
      return;

    var pattern = this.valueList[0];
    var dispVal = pattern.replace( /\{[0]+\}/g, quarter );

    if ( typeof dispVal === "undefined" )
      dispVal = quarter;

    var decorateItem = decoratePrefix + rawItem;
    this.glMergedMap[ decorateItem ] = valPrefix + year + dispVal;
    this.glQueryMap [decorateItem] = query;
    this.glDrilledMap[decorateItem] = drilled;
    this.glRealFieldMap[decorateItem] = reField;
  }
});

var GlobalListWrapperQuarterWeek = Class.create(GlobalListWrapper, {
  addItem : function( rawItem, decoratePrefix, valPrefix, query, drilled, reField){
    if ( !rawItem || !this.valueList || !this.valueList.length )
      return;

    var year = rawItem.substring(0, 4);
    var quarter = rawItem.substring(4);
    if ( !quarter )
      return;

    var pattern = this.valueList[0];
    var dispVal = pattern.replace( /\{[0]+\}/g, quarter );

    if ( typeof dispVal === "undefined" )
      dispVal = quarter;

    var decorateItem = decoratePrefix + rawItem;
    this.glMergedMap[ decorateItem ] = valPrefix + year + dispVal;
    this.glQueryMap [decorateItem] = query;
    this.glDrilledMap[decorateItem] = drilled;
    this.glRealFieldMap[decorateItem] = reField;
  }
});

function createGLWrapper( stackField, logger )
{

  if ( !stackField )
    return new GlobalListWrapperEmpty( null, null, logger );

  var DATE_AGG_QUARTER = 'QUARTER';
  var DATE_AGG_MONTH   = 'MONTH';
  var DATE_AGG_WEEK    = 'WEEK_OF_YEAR';

  var glWrapper;
  if ( stackField && stackField.type === 'time' )
  {
    if ( stackField.calculator && stackField.calculator.valueList )
    {
      var timeAgg = stackField.calculator.name;
      timeAgg = timeAgg.toUpperCase();

      switch ( timeAgg )
      {
        case DATE_AGG_QUARTER: // OOB: {"Q{0}"}
        case DATE_AGG_WEEK:    // OOB: {"W{0}"}
          glWrapper = new GlobalListWrapperQuarterWeek( stackField.calculator.valueList, stackField.calculator.displayList, logger );
          break;

        case DATE_AGG_MONTH:   // OOB {"1", "2",... , "12"} : {"JAN", "FEB", ..., "DEC"}
          glWrapper = new GlobalListWrapperMonth( stackField.calculator.valueList, stackField.calculator.displayList, logger );
          break;
      }
    }
  }

  if ( !glWrapper )
    glWrapper = new GlobalListWrapper( stackField.valueList, stackField.displayList, logger );

  return glWrapper;
}

function updateStackGL( stackField, glWrapper, logger )
{
  var gl = glWrapper.getDisplayList();
  if ( gl )
  {
    if ( stackField && (stackField.type === 'time') && stackField.calculator )
    {
      stackField.type = "string";
      delete stackField.calculator;
    }

    stackField.valueList = gl.valueList;
    stackField.displayList = gl.displayList;
    stackField.queryList = gl.queryList;
    stackField.drillList = gl.drillList;
    stackField.realFieldList = gl.realFieldList;
  }
}

function getPrefixSep( stackField, logger )
{
  if ( !stackField )
    return "";

  var prefix = PREFIX_SEP;

  var PREFIX_STR     = "STR";
  var PREFIX_NUMBER  = "NUM";
  var PREFIX_BOOL    = "BOL";
  var PREFIX_YEAR    = "DTY";
  var PREFIX_QUARTER = "DTQ";
  var PREFIX_MONTH   = "DTM";
  var PREFIX_WEEK    = "DTW";
  var PREFIX_DAY     = "DTD";

  switch (stackField.type)
  {
    case "time":
      if ( stackField.calculator )
      {
        var timeAgg = stackField.calculator.name.toUpperCase();
        switch ( timeAgg )
        {
          case "YEAR"    :      prefix += PREFIX_YEAR; break;
          case "QUARTER" :      prefix += PREFIX_QUARTER; break;
          case "MONTH" :        prefix += PREFIX_MONTH; break;
          case "WEEK_OF_YEAR" : prefix += PREFIX_WEEK; break;
          case "DATE" :         prefix += PREFIX_DAY; break;

          default:
            prefix += PREFIX_STR;
        } // switch
      }
      break;

    case "character": prefix += PREFIX_STR;    break;
    case "number"   : prefix += PREFIX_NUMBER; break;
    case "boolean"  : prefix += PREFIX_BOOL;   break;

    default:
      prefix += PREFIX_STR;
  }

  return prefix;
}

function calcWithStack( cntVisibleLine, stackField, calcLines, trendArray, stackArray, lines, bNullIsZero, logger)
{

  var glWrapper = createGLWrapper( stackField, logger );
  var resultData = [];
  logger.debug("trend-array size: " + trendArray.length + ", stackArray.length: " + stackArray.length)

  var prefixSep = getPrefixSep( stackField, logger );
  for (var i = 0; i < trendArray.length; i++)
  {
    var trend = trendArray[i];

    for (var j = 0; j < stackArray.length; j++)
    {
      var opArray = [];
      var stack = stackArray[j];

      for (var nLine = 0; nLine < lines.length; nLine++)
      {
        var line = lines[ nLine ];
        var dataMap = line.dataSet;
        var dataItem = null;

        if ( dataMap[trend] )
          dataItem = dataMap[trend][stack];

        if ( bNullIsZero && (dataItem == null) )
          opArray.push(0);
        else
          opArray.push(dataItem);

        if ( line.visible )
        {
          var stackName;
          var reField;
          if ( line.mfield && line.mfield.ref ){
            stackName = line.mfield.caption;
            reField = line.mfield.realField;
          }
          else{
            stackName = line.tfield.caption;
            reField = line.tfield.realField;
          }
          
          var prefix = ( cntVisibleLine > 1 )? ("A" + (nLine+1).toString() + "-" + stackName + "-") : "";

          resultData.push( [trend, normalizeStackVal(prefix + prefixSep ) + stack, dataItem ] );
          var query = stackField.ref+'="'+lib.StringUtil.escapeAllStr(stack)+'" and ('+line.query+')' 
            
          glWrapper.addItem( stack, normalizeStackVal(prefix + prefixSep ), normalizeStackDisp(prefix) ,query, true, reField );
        
        }
      }

      for (var nCalc = 0; nCalc < calcLines.length; nCalc++)
      {
        var calcLine = calcLines[nCalc];
        
        var refField = getCalcsRealField(calcLine.formula, calcLine.drilled, lines);
        var drillflag = true;
        drillflag = calcLine.drilled;
        
        
        var strFunc = constructCalc(opArray, calcLine.formula, logger);
        var itemData = calcItem(strFunc, logger);

        var prefix = ( cntVisibleLine > 1 )? (calcLine.label + "-") : "";
        if ( cntVisibleLine > 1 )
        {
          var prefix = calcLine.label + "-";

          resultData.push( [trend, normalizeStackVal(prefix)  + nCalc.toString() + prefixSep + stack, itemData] );
          var query = makeCalcLineQuery(lines, calcLine, stackField.ref, stack);
          glWrapper.addItem( stack, normalizeStackVal(prefix) + nCalc.toString() + prefixSep, normalizeStackDisp(prefix) , query, drillflag, refField);
        }
        else if ( cntVisibleLine == 1 )
        {
          var prefix = "";
          resultData.push( [trend, stack, itemData] );
          var query = makeCalcLineQuery(lines, calcLine, stackField.ref, stack);
           glWrapper.addItem( stack, prefix, prefix, query, drillflag, refField);
        }

      } // calcline
    } // stack array
  } // trendarray

  updateStackGL( stackField, glWrapper, logger );

  return resultData;
}

function makeCalcLineQuery(lines, calcLine, stackField, stackFieldValue){
    var formula = calcLine.formula;
    var list = ['+', '-', '*', '/'];
    for (var k=0;k<list.length;k++) {
        if(formula.indexOf(list[k])>0){
            return null;
        }
    }
    
    if(/^A([1-9]|10])$/.test(formula)){
        var lineNumber = +formula.substring(1);
        if(lines.length<lineNumber){
            return null;
        }
        
        return lines[lineNumber-1].query;
    }
    
    return null;
}

/**
 * For the aggregator count/sum, if the value is null, then it's safe to substitute it as 0
 * e.g. count( close.time, month ), then uses 0 might be more safe
 *
 * @param aggName : name of aggregator
 * @returns {boolean}
 */
function substituteNull( aggName )
{
  // Always think null is 0
  return true;

  /*
   aggName = aggName.toLowerCase();
   return ( aggName == "count" || aggName == "sum" );
   */
}

function genResultWithGroupField(meta, logger, bRefresh, result)
{

  // Max group limitation
  var maxGroup = libCmn.getMaxRecordLimit(meta, logger);
  var maxStack = 0;

  var lineMaxStack = 0;
  var bUseStackField = meta.stackField && meta.stackField.ref;
  if (bUseStackField)
  {
    maxStack = libCmn.getMaxStackedRecordLimit(meta, logger);
    var lineMaxStack = (!isNaN(maxStack))? (maxStack * 2) : maxStack;
  }
  var lineMaxGroup = (!isNaN(maxGroup))? (maxGroup * 2) : maxGroup;

  // fetch the dataset of each line
  var trendArray = [];
  var stackArray = [];

  var nVisibleLine = 0;
  var lines = meta.calcMeta.lines;
  var firstGroup = null;

  for (var i = 0; i < lines.length; i++)
  {
    var line = lines[i];
    if (line.visible)
      nVisibleLine++;

    if ( i == 0 && line.tfield )
      firstGroup = line.tfield;

    fetchLineData(meta, bRefresh, logger, lineMaxGroup, bUseStackField, lineMaxStack, line);
    logger.debug("line - trendA" + (i+1).toString() + ": " + toJSON(line.trendArray));

    trendArray = _.union(line.trendArray, trendArray);
    if ( trendArray && maxGroup!==0 && trendArray.length > maxGroup )
    {
      trendArray.splice( maxGroup, trendArray.length - maxGroup );
    }

    if (bUseStackField)
    {
      stackArray = _.union(line.stackArray, stackArray);
      if ( stackArray && maxStack!==0 && stackArray.length > maxStack )
      {
        stackArray.splice( maxStack, stackArray.length - maxStack );
      }
    }
  }

  var dnGroupFieldWrapper = null;
  var dnStackFieldWrapper = null;

  // Handle the display name substitution for Group Field
  if ( firstGroup )
  {
    logger.debug("trendArray: " + trendArray);
    dnGroupFieldWrapper = new DNGlobalListWrapper( firstGroup, logger );
    dnGroupFieldWrapper.addValueList(trendArray);
    if ( dnGroupFieldWrapper.hasDisplayNameRef() )
    {
      var gl = dnGroupFieldWrapper.getDisplayList();
      if ( gl )
      {
        firstGroup.valueList   = gl.valueList;
        firstGroup.displayList = gl.displayList;
      }
    }
  }

  // Handle the display name substitution for the stack field
  if ( bUseStackField )
  {
    logger.debug("stackArray: " + stackArray);
    dnStackFieldWrapper = new DNGlobalListWrapper( meta.stackField, logger );
    dnStackFieldWrapper.addValueList(stackArray);

    if ( dnStackFieldWrapper.hasDisplayNameRef() )
    {
      var gl = dnStackFieldWrapper.getDisplayList();
      if ( meta.stackField && gl )
      {
        meta.stackField.valueList = gl.valueList;
        meta.stackField.displayList = gl.displayList;
        meta.stackField.queryList = gl.queryList;
        meta.stackField.drillList = gl.drillList;
        meta.stackField.realFieldList = gl.realFieldList;
      }
    }
  }

  var bNullIsZero = substituteNull(meta.aggregator.name);

  var calcLines = meta.calcMeta.calcLines;
  meta.cntVisibleLine = nVisibleLine + calcLines.length;
  if (stackArray && stackArray.length > 0)
  {
    result.resultSet = calcWithStack(meta.cntVisibleLine, meta.stackField, calcLines, trendArray, stackArray, lines, bNullIsZero, logger);
  }
  else
  {
    if (( meta.cntVisibleLine > 1 ) || bUseStackField)
    {
      // We still need to construct a stack field, so that the browser can render multiple field and calcfield properly
      if (!bUseStackField)
      {
        meta.stackField = {
          "ref": "fakestack",
          "caption": "[FakeStack]",
          "type": "string",
          "drillDownIgnored" : true,
          "realFile": meta.table,
          "realField": "fakestack"
        };

        /*
         var groupField = meta.calcMeta.lines[0].tfield;
         meta.stackField = {
         "ref": groupField.ref,
         "caption": "[FakeStack]",
         "type": groupField.type,
         "realFile": groupField.realFile,
         "realField": groupField.realField
         };
         */
      }
    }

    result.resultSet = calcWithoutStack(meta.cntVisibleLine, meta.stackField, calcLines, trendArray, lines, bNullIsZero, logger);
  }

  if (( meta.cntVisibleLine > 1 ) || bUseStackField)
  {
    // We still need to construct a stack field, so that the browser can render multiple field and calcfield properly
    if (!bUseStackField && !meta.stackField)
    {
      meta.stackField = {
        "ref": "fakestack",
        "caption": "[FakeStack]",
        "type": "string",
        "drillDownIgnored" : true,
        "realFile": meta.table,
        "realField": "fakestack"
      };
    }

    if ( !meta.calcMeta.bOrderByAgg )
    {
      result.resultSet = _.sortBy(result.resultSet, function (arrItem)
      {
        return arrItem[0].toString() + arrItem[1].toString();
      });
    }
  }
  else
  {
    if ( !meta.calcMeta.bOrderByAgg )
    {
      // 1 calcline without stack field --> 1 line
      result.resultSet = _.sortBy(result.resultSet, function (arrItem)
      {
        return arrItem[0].toString();
      });
    }
  }

  // sort the final result if there is only 1 calculation formula [ and no stack value ] ?
  if ( meta.calcMeta.bOrderByAgg && meta.cntVisibleLine == 1 && meta.calcMeta.calcLines && meta.calcMeta.calcLines.length == 1 )
  {
    var dataSlot = (bUseStackField)? 2 : 1;

    result.resultSet = _.sortBy(result.resultSet, function (arrItem)
    {
      return arrItem[dataSlot];
    });

    // UnderscroeJS sortBy always return the result in ascending order
    result.resultSet.reverse();
  }


}

function genResultWithoutGroupField( meta, logger, bRefresh, result )
{

  var nVisibleLine = 0;
  var lines = meta.calcMeta.lines;
  for (var i = 0; i < lines.length; i++)
  {
    var line = lines[i];
    if (line.visible)
      nVisibleLine++;

    fetchFieldDataWithoutGroup( meta, bRefresh, logger, line )
  }

  var bNullIsZero = substituteNull( meta.aggregator.name );

  var calcLines = meta.calcMeta.calcLines;
  meta.cntVisibleLine = nVisibleLine + calcLines.length;

  if ( meta.cntVisibleLine > 1 )
  {
    // Construct a group field if there are multiple numbers, so that we can render then in vbar
    meta.groupField = {
      "ref": "PseudoGroup",
      "caption": "[PseudoGroup]",
      "type": "string",
      "realFile": meta.table,
      "realField": "PseudoGroup"
    };
  }
  result.resultSet = calcWithoutGroup(meta.cntVisibleLine, meta.groupField, calcLines, lines, bNullIsZero, logger);
}

/**
 *
 * @param meta
 * @param bRefresh
 * @param logger
 * @returns {null}
 */
function lineGenResult( meta, bRefresh, logger )
{
  lineGenQuery( meta, logger );

  // create the result value
  var result = {
    "meta" : meta
  };

  if ( !meta.isNumberChart )
    genResultWithGroupField(meta, logger, bRefresh, result);
  else
    genResultWithoutGroupField(meta, logger, bRefresh, result);

  result.resultSet = {
    "hasMore" : false,
    "timestamp" : libCmn.getNowString(),
    "data" : result.resultSet
  };

  calcLinePostHandling( meta, logger );

  return result;
}

function constructCalc( opArray, formula, logger )
{
  var strFunc = "(function(){\n";
  for ( var i = 0; i < opArray.length; i++ )
  {
    strFunc += "var A" + (i+1).toString() + "=" + opArray[i] + ";\n"
  }

  strFunc += " var ret=" + formula.toUpperCase() + ";\n";
  strFunc += " return ret; \n})();";


  return strFunc;
}

function testCalcItem( strFunc )
{
  var result = eval(strFunc);
}

function calcItem( strFunc, logger )
{
  var result = null;
  try{
    result = eval(strFunc);
  }
  catch( e ){
    // !!! TODO !!!
    logger.warn("Exception while evaluating func: " + strFunc + ", msg: " + e.message );
  }
  return (isFinite(result) && !isNaN(result) )? result : null;
}

var LineDataList = function(){
  var dataMap = {};
  var trendArray = [];
  var stackArray = [];

  var getTrendArray = function(){
    return _.compact( trendArray );
  };

  var getStackArray = function(){
    return _.compact( stackArray );
  };

  var getDataMap = function(){
    return dataMap;
  };

  var addItem = function(f, groupValue, aggValue, bUseStack, stackValue){
    var item = [];

    if ( groupValue && _type(groupValue) == 3 )
    {
      groupValue = _val(groupValue, 2);
    }
    trendArray.push( groupValue );

    if ( bUseStack )
    {
      if ( stackValue && _type(stackValue) == 3 )
      {
        stackValue = _val(stackValue, 2);
      }

      stackArray.push( stackValue );

      var item = dataMap[groupValue];
      if ( !item )
      {
        dataMap[groupValue] = {};
        item = dataMap[groupValue];
      }
      item[ stackValue ] = aggValue;
    }
    else
    {
      dataMap[groupValue] = aggValue;
    }
  }; // addItem

  return {
    "getDataMap" : getDataMap,
    "addItem" : addItem,
    "getTrendArray" : getTrendArray,
    "getStackArray" : getStackArray
  };
}

function fetchLineData( meta, bRefresh, logger, maxGroup, bUseStackField, maxStack, line )
{
  try {
    var isDurationField = meta.calcMeta.isDurationField;
    var fromTimeUnit  = meta.calcMeta.queryTimeUnit;
    var toTimeUnit    = meta.calcMeta.timeUnit;

    var f = new SCFile(meta.table);
    libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);
    f.setSelectTop((maxGroup <= 0 || bUseStackField) ? 500 : maxGroup + 1);

    var sql = libCmn.fixQuery(meta.table, line.finalquery, logger);
    var rc = f.doSelect(sql);

    if ( isDurationField )
      libCmn.checkQueryRC4TDSum(rc);
    else
      libCmn.checkQueryRC(rc);

    var groupName     = null;
    var prevGroupName = null;
    var bFirstRow     = true;

    var currGroup     = 0;
    var curStack      = 0;

    var dataSet = new LineDataList();

    while ( rc == RC_SUCCESS )
    {
      groupName = f[0];

      if ( bFirstRow )
      {
        prevGroupName = groupName;
        bFirstRow = false;
      }

      if ( groupName !== prevGroupName )
      {
        currGroup++;
        prevGroupName = groupName;
        curStack = 0;
      }

      if ( (maxGroup > 0) && (currGroup >= maxGroup) )
      {
        if ( g_logDebug )
          logger.debug("Reach maximum group limit (" + maxGroup + "), stop fetching data");

        break;
      }

      if ( bUseStackField )
      {
        if ( (maxStack <= 0) || (curStack < maxStack ) )
        {

          var val = ( isDurationField )? convertTimeUnit(fromTimeUnit, toTimeUnit, f[2]) : f[2];

          dataSet.addItem(f, groupName, val, true, f[1] );
          curStack++;
        }
      }
      else
      {
        var val = ( isDurationField )? convertTimeUnit(fromTimeUnit, toTimeUnit, f[1]) : f[1];

        dataSet.addItem(f, groupName, val, false );
      }

      rc = f.getNext();
    }


    line.succeed = true;
    line.dataSet = dataSet.getDataMap();
    line.trendArray = dataSet.getTrendArray();
    line.stackArray = dataSet.getStackArray();

  }
  catch ( e )
  {
    // !!! When there is exception happened, then we just abort all the works
    line.succeed = false;
    logger.error( e.message );
    throw e;
  }
}

/**
 * Convert the <timeVal> base on time unit
 * Year, Quarter, Month, Week, Day <-- Minute
 * Hour, Minute, Second            <-- Second
 *
 * @param fromUnit
 * @param toUnit
 * @param timeVal
 * @returns {*}
 */
function convertTimeUnit( fromUnit, toUnit, timeVal )
{
  if ( isNaN(timeVal) || (fromUnit === toUnit) )
    return timeVal;

  toUnit = toUnit.toUpperCase();
  switch ( toUnit )
  {
    // From Minutes
    case TIMEUNIT_YEAR:
      return timeVal / ( 365.0 * 24.0 * 60.0 );

    case TIMEUNIT_QUARTER:
      return timeVal / ( 91.0 * 24.0 * 60.0 );

    case TIMEUNIT_MONTH:
      return timeVal / ( 30.0 * 24.0 * 60.0 );

    case TIMEUNIT_WEEK:
      return timeVal / ( 7.0 * 24.0 * 60.0 );

    case TIMEUNIT_DAY:
      return timeVal / ( 24.0 * 60.0 );

    // From minutes
    case TIMEUNIT_HOUR:
      return timeVal / 60.0;

    case TIMEUNIT_MINUTE:
      return timeVal;

    case TIMEUNIT_SECOND:
      return timeVal;
  }

  return timeVal;
}

/**
 * Fetch calculation field for numeric chart
 *
 * @param meta
 * @param bRefresh
 * @param logger
 * @param line
 */
function fetchFieldDataWithoutGroup( meta, bRefresh, logger, line )
{
  try {
    var isDurationField = meta.calcMeta.isDurationField;
    var fromTimeUnit  = meta.calcMeta.queryTimeUnit;
    var toTimeUnit    = meta.calcMeta.timeUnit;

    var f = new SCFile(meta.table);
    libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);

    var sql = libCmn.fixQuery(meta.table, line.finalquery, logger);
    var rc = f.doSelect(sql);

    if ( isDurationField )
      libCmn.checkQueryRC4TDSum(rc);
    else
      libCmn.checkQueryRC(rc);

    var dataSet = [];
    if ( rc == RC_SUCCESS )
    {
      dataSet.push(  ( isDurationField )? convertTimeUnit(fromTimeUnit, toTimeUnit, f[0]) : f[0] );
    }

    line.succeed = true;
    line.dataSet = dataSet;
  }
  catch ( e )
  {
    // !!! When there is exception happened, then we just abort all the works
    line.succeed = false;
    logger.error( e.message );
    throw e;
  }
}

function getCalcsRealField(formula, drilled, lines){
    if(drilled){ //if the line's drilled down is enabled
       
        formula = formula.toUpperCase();
        
        if(/^A\d\d?$/.test(formula)){ //if formula equals "A1-A19"
            var line = lines[formula.substring(1)-1];
            if ( line.mfield && line.mfield.ref ){
              return line.mfield.realField;
            }
            else{
              return line.tfield.realField;
            }
        }
        else{   //get the first element of the formula's realfield
            var matchedFormula = formula.match(/A\d{1,2}/);
            if (!matchedFormula) {
                return null;
            }
            var ind = matchedFormula.toString().substring(1)-1;
            var line = lines[ind];
            if ( line.mfield && line.mfield.ref ){
              return line.mfield.realField;
            }
            else{
              return line.tfield.realField;
            }
        }
    }
    else{
        return null;
    }
   
}