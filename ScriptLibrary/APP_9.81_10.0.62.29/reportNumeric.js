var libCmn = lib.reportCmn;
var _val = system.functions.val;

var ERR_SIMPLEQUERY_NOUK          = 57;       // "Cannot find unique key in file %S, and no 'Row Label field' defined for the report %S"
var ERR_NUMERIC_NO_CALC_FIELD    = 206;      // The aggregation field is not defined for numeric chart %S (id: %S)

var ERR_TYPE_ERROR           = "3";
var ERR_TYPE_INFO            = "1";

var SIMPLE_QUERY    = "query";

function numGenQuery( meta, logger )
{
  // If it's count query, then should ignore the groupBy field
  var bAggCount = ( !meta.aggregator || !meta.aggregator.name || (meta.aggregator.name.toUpperCase() === "COUNT") );

  // Generate the adhoc sql query any way
  var fields = new Array();

  if (meta.bAggCount)
  {
    fields.push('*');
  }
  else
  {
    if ( !meta.aggregator.field || !meta.aggregator.field.ref )
      throw libCmn.createReportServiceError( ERR_NUMERIC_NO_CALC_FIELD, ERR_TYPE_ERROR, [ meta.name, meta.id ] );
    fields.push( meta.aggregator.field.ref );
  }

  if ( !meta.query )
    meta.query = 'true';
  meta['drillDownQuery'] = meta.query;

  var q = system.functions.generate_sql_query(fields, meta.query, meta.table, true);
  if ( g_logDebug )
    logger.debug('Generated query: ' + q);

  // need to re-create the SELECT-FIELD-LIST to make sure that all the fields in the desired order and naming.
  var strFROM = ' FROM ';
  var pos = q.toUpperCase().indexOf( strFROM );
  if ( pos >= 0 )
    q = q.substring(pos, q.length);

  var sql;
  var aggFieldName = null;
  if ( g_logDebug )
    logger.debug("agg name : " + meta.aggregator.name );

  if ( bAggCount )
  {
    aggFieldName = " COUNT(*) ";
  }
  else
  {
    if ( meta.aggregator.field && meta.aggregator.field.ref )
    {
      aggFieldName =  meta.aggregator.name + "( " +  meta.aggregator.field.ref + " ) ";

      meta.aggregator.field.realFile = meta.table;
      meta.aggregator.field.realField = meta.aggregator.field.ref;
    }
  }

  sql = 'SELECT ' + aggFieldName + ' AS cnt ';
  sql += q;

  if ( g_logDebug )
    logger.debug('Numeric use query : ' + sql );

  return sql;
}

function numGenSimpleQuery( meta, logger )
{
  if ( !meta.rowLabelField.ref )
    meta.rowLabelField.ref = libCmn.getFirstFieldInUK( meta.table );

  if ( !meta.rowLabelField.ref )
    throw libCmn.createReportServiceError( ERR_SIMPLEQUERY_NOUK, ERR_TYPE_ERROR, [ meta.table, meta.name ] );

  var sql;
  if ( !libCmn.IsAlreadyAdhocQuery(meta.query) )
  {
    if ( !meta.query )
      meta.query = 'true';

    sql  = ' SELECT ' + meta.rowLabelField.ref ;
    sql += ' FROM '   + meta.table ;
    sql += ' WHERE '  + meta.query ;
  }
  else
  {
    sql = meta.query;
  }

  if ( g_logDebug )
    logger.debug('Final simple query : ' + sql );

  return sql;
}

function numGenResult( meta, bRefresh, logger )
{
  var f   = new SCFile( meta.table );
  var bSimpleQuery = ( meta.source === SIMPLE_QUERY )? true : false;

  var sql = null;

  if ( bSimpleQuery )
  {
    sql = numGenSimpleQuery(meta, logger);
  }
  else
  {
    meta.bAggCount = ( !meta.aggregator || !meta.aggregator.name || (meta.aggregator.name.toUpperCase() === "COUNT") );
    sql = numGenQuery(meta, logger);
  }

  if ( bSimpleQuery )
  {
    f.setSelectTop(1);
  }
  else
  {
    libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);
  }

  sql = libCmn.fixQuery( meta.table, sql, logger );
  var rc = f.doSelect( sql );
  if ( g_logDebug )
    logger.debug('query on table ' + meta.table + ' done, rc: ' + rc);
  libCmn.checkQueryRC(rc);

  if ( bSimpleQuery )
  {
    meta.rowLabelField.caption = meta.rowLabelField.ref;
    meta.rowLabelField.type    = libCmn.getFieldType( f, meta.rowLabelField.ref );
  }
  else
  {
    meta.groupField = ( meta.bAggCount )? null : meta.aggregator.field;
  }

  var dataList = new Array();
  var dataItem = new Array();
  if (rc == RC_SUCCESS)
  {
    var data = f[0];
    if ( data == null )
      data = "";

    if ( meta.groupField && (meta.groupField.type == 'time') )
    {
      data = _val(data, 2);
    }

    dataItem.push(data.toString());
    dataList.push(dataItem);
  }
  else
  {
    if ( meta.bAggCount )
    {
      dataItem.push("0");
      dataList.push(dataItem);
    }
  }

  if ( bSimpleQuery )
  {
    // swap the groupField and rowField to align to the aggregate query
    var tmp = meta.groupField;
    meta.groupField = meta.rowLabelField;
    meta.rowLabelField = tmp;

    meta.aggregator.field = meta.rowLabelField;

    // Pretend be an "aggregate" query to client
    meta.source = SIMPLE_QUERY;
  }

  // Manually construct the drill down query for client side
  meta.query = meta.drillDownQuery;
  delete meta.drillDownQuery;
  delete meta.groupByTimeAgg;
  delete meta.stackTimeAgg;
  delete meta.bAggCount;

  meta.type      = 'numeric';
  meta['@class'] = 'numeric';

  var gadgetData = {
    "meta" : meta,

    "resultSet": {
      "hasMore": false,
      "timestamp" : libCmn.getNowString(),
      "data"   : dataList
    }
  }; // PieGadget

  return gadgetData;
}
