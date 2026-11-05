var libCmn = lib.reportCmn;
var libDN = lib.DisplayName;

var ERR_SIMPLEQUERY_NOUK   = 57;       // "Cannot find unique key in file %S, and no 'Row Label field' defined for the report %S"
var ERR_TYPE_ERROR          = "3";

var SIMPLE_QUERY    = "query";
var AGGREGATE_QUERY = "aggregate";
var _val = system.functions.val;

// pieGenResult
function pieGenResult( meta, bRefresh, logger )
{
  var f = new SCFile( meta.table );
  var bSimpleQuery = ( meta.source === SIMPLE_QUERY )? true : false;
  var sql = null;

  if ( bSimpleQuery )
  {
    if ( g_logDebug )
      logger.debug("Row label field: " + meta.rowLabelField.ref);
    sql = pieGenQueryForSimpleQuery(meta, logger);
  }
  else
  {
    sql = pieGenQuery(meta, logger);
  }

  // Max group limitation
  var maxGroup      = libCmn.getMaxRecordLimit( meta, logger );
  var currGroup     = 0;
  var bHasMore      = false;

  if ( maxGroup > 0 )
    f.setSelectTop( maxGroup + 1 );
  libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);

  sql = libCmn.fixQuery( meta.table, sql, logger );
  var rc = f.doSelect( sql );
  if ( g_logDebug )
    logger.debug('Pie query on table ' + meta.table + ' done, rc: ' + rc );
  libCmn.checkQueryRC(rc);

  var pieQueryData = new Array();

  // The record layout is fixed, [aggregation-field, aggregation-result], e.g. [priority.code, count]
  var groupFieldName = meta.groupField.ref;
  var rowFieldName = null;
  
  var realRefFile=meta.groupField.realFile;
  if (!realRefFile) realRefFile = meta.table;
  
  var realRefField=meta.groupField.realField;
  if (!realRefField) realRefField = meta.groupField.ref;
  
  if ( bSimpleQuery )
  { 
  	rowFieldName = meta.rowLabelField.ref;
  	realRefFile=meta.table;
  	realRefField = meta.groupField.ref;
   
   }

  if ( bSimpleQuery )
  {
    meta.rowLabelField.caption = libCmn.getFieldCaption( f, meta.rowLabelField.ref );
    meta.rowLabelField.type    = libCmn.getFieldType( f, meta.rowLabelField.ref );
  }
  
  var refValueList=new Array();
  var refdisplayNameList=new Array();
  var fieldRefTable = libDN.getFieldReferenceTable(realRefFile, realRefField);
  while (rc == RC_SUCCESS)
  {
    if ( ( maxGroup > 0 ) && ( currGroup >= maxGroup ) )
    {
      bHasMore = true;
      if ( g_logDebug )
        logger.debug("Reach maximum group limit (" + maxGroup + "), stop fetching data");

      break;
    }

    var item = new Array();

    if ( bSimpleQuery )
    {
      if ( meta.rowLabelField.type == 'time' )
      {
        item[0] = _val(f[rowFieldName], 2);
      }
      else
      {
        item[0] = f[rowFieldName];
      }

      if (fieldRefTable){
	  	item[1] = libDN.getReferenceDisplayName(f[groupFieldName], fieldRefTable);		
	  }else{
	  	item[1]=f[groupFieldName];
	  }
    }
    else
    {
      if ( meta.groupField.type == 'time' )
      {
        item[0] = _val(f[0], 2);
      }
      else
      {
        item[0] = f[0];
      }

      item[1] = f.cnt;
      if (fieldRefTable){
	  	refValueList.push(item[0]);
	  	//refdisplayNameList.push(libDN.getReferenceDisplayName(item[0], fieldRefTable));
	  }
    }

    pieQueryData.push(item);

    currGroup++;

    rc = f.getNext();
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
  if ( !bSimpleQuery )
  {
    meta.query = meta.drillDownQuery;
    delete meta.drillDownQuery;
  }
  else
  {
    var gl = libCmn.globallistDefGet( meta.table, meta.groupField.ref );
    if ( gl && gl.found )
    {
      meta.groupField.valueList = gl.valueList;
      meta.groupField.displayList = gl.displayList;
    }
  }
  //change for display name
  if (fieldRefTable && !meta.groupField.displayList){
	  meta.groupField.valueList = refValueList;
      meta.groupField.displayList = libDN.getReferenceDisplayName(refValueList.slice(), fieldRefTable);	
   }
  // Delete unused properties since we're using more strict model
  if ( meta )
  {
    delete meta.rowLabelField;
    delete meta.stackField;

    delete meta.groupByTimeAgg;
    delete meta.stackTimeAgg;
  }

  var gadgetData = {
    "meta" : meta,

    "resultSet": {
      "hasMore": bHasMore,
      "timestamp" : libCmn.getNowString(),
      "data"   : pieQueryData
    }
  }; // PieGadget

  return gadgetData;
}

function pieGenQuery( meta, logger )
{
  // Generate the adhoc sql query any way
  var fields = new Array();
  fields.push( meta.groupField.ref );

  // forced to be adhoc sql query
  if ( !meta.query )
    meta.query = 'true';
  meta['drillDownQuery'] = meta.query;

  var q = system.functions.generate_sql_query(fields, meta.query, meta.table, true);
  if ( g_logDebug )
    logger.debug('Generated query: ' + q);

  // need to re-create the SELECT-FIELD-LIST to make sure that all the fields in the desired order and naming.
  var strFROM  = ' FROM ';
  var bAdhocGroup = libCmn.isAdhocField(meta.groupField.ref);
  var pos = q.toUpperCase().indexOf( strFROM );
  var qSelect = null;
  if ( pos >= 0 )
  {
    if ( bAdhocGroup )
      qSelect = q.substring(0, pos);

    q = q.substring(pos, q.length);
  }

  var sql;
  var timeField = null;
  var adhocField = null;

  var f = new SCFile(meta.table);

  if ( bAdhocGroup )
  {
    adhocField = libCmn.getRealFieldNameFromAdhocFieldString(meta.groupField.ref);
    var fAdhoc = new SCFile(adhocField.filename);
    meta.groupField.type = libCmn.getFieldType(fAdhoc, adhocField.fieldname);
    meta.groupField.caption = libCmn.getFieldCaption( fAdhoc, adhocField.fieldname );
    if ( logger.bIncludeColor )
    {
      var colorCfg = lib.ColorIndicatorService.queryFieldColor( adhocField.filename, adhocField.fieldname );
      if ( colorCfg )
        meta.groupField.colorRules = colorCfg;
    }
    else
    {
      meta.groupField.realFile = adhocField.filename;
      meta.groupField.realField = adhocField.fieldname;
    }

    var gl = libCmn.globallistDefGet( adhocField.filename,adhocField.fieldname );
    if ( gl && gl.found )
    {
      meta.groupField.valueList = gl.valueList;
      meta.groupField.displayList = gl.displayList;
    }
  }
  else
  {
    meta.groupField.caption = libCmn.getFieldCaption( f, meta.groupField.ref );
    meta.groupField.type = libCmn.getFieldType(f, meta.groupField.ref);

    if ( logger.bIncludeColor )
    {
      var colorCfg = lib.ColorIndicatorService.queryFieldColor( meta.table, meta.groupField.ref );
      if ( colorCfg )
        meta.groupField.colorRules = colorCfg;
    }
    else
    {
      meta.groupField.realFile  = meta.table;
      meta.groupField.realField = meta.groupField.ref;
    }

    var gl = libCmn.globallistDefGet( meta.table, meta.groupField.ref );
    if ( gl && gl.found )
    {
      meta.groupField.valueList = gl.valueList;
      meta.groupField.displayList = gl.displayList;
    }
  }

  if ( (meta.groupField.type === 'time') && meta.groupByTimeAgg )
  {
    timeField = libCmn.genTimeAggQuery(meta.groupByTimeAgg, meta.groupField.ref, logger);
    sql       = 'SELECT ' + timeField + ' AS fieldAlias, ';
	var timeAggIdx = system.functions.index(meta.groupByTimeAgg.toUpperCase(), vars["$G.gl.reporting.calculatorType"]);
    meta.groupField.calculator = {
      "name"    : meta.groupByTimeAgg.toUpperCase(),
      "caption" : vars["$G.gl.reporting.calculatorType.display"][timeAggIdx-1]
    };

    libCmn.pivotProcessFieldAggregator( meta.groupField.calculator );
  }
  else
  {
    if ( bAdhocGroup )
      sql = 'SELECT ' + adhocField.fullfield + " AS " + " alias1, ";
    else
      sql = 'SELECT ' + meta.groupField.ref + ', ';
  }

  var aggFieldName = null;
  if ( g_logDebug )
    logger.debug("agg name : " + meta.aggregator.name );

  if ( !meta.aggregator || !meta.aggregator.name || (meta.aggregator.name.toUpperCase() === "COUNT") )
  {
    aggFieldName = " COUNT(*) ";
  }
  else
  {
    if ( meta.aggregator.field && meta.aggregator.field.ref )
    {
      aggFieldName =  meta.aggregator.name + "( " +  meta.aggregator.field.ref + " ) ";
    }
    else
    {
      aggFieldName =  meta.aggregator.name + "( " + meta.groupField.ref + " ) ";
    }
  }

  // Order the result by aggregator result
  // e.g. Select ... FROM ... WHERE ... ORDER BY COUNT(...) DESC
  var bOrderByAgg = meta.attributes['supportTopN'];
  bOrderByAgg = (bOrderByAgg === "true") || ( parseInt(bOrderByAgg, 10) > 0);

  sql += aggFieldName + " AS cnt ";
  sql += q;
  if ( timeField )
  {
    sql += ' GROUP BY ' + timeField + ' ';

    if ( bOrderByAgg )
      sql += ' ORDER BY ' + aggFieldName + ' DESC ';
    else
      sql += ' ORDER BY ' + timeField + ' ';
  }
  else
  {
    var groupFieldName = (bAdhocGroup)? adhocField.fullfield : meta.groupField.ref;
    sql += ' GROUP BY ' + groupFieldName + ' ';

    if ( bOrderByAgg )
      sql += ' ORDER BY ' + aggFieldName + ' DESC ';
    else
      sql += ' ORDER BY ' + groupFieldName + ' ';
  }

  meta.type = 'pie';
  if ( g_logDebug )
    logger.debug('Pie use query : ' + sql );

  return sql;
}


// pieGenQueryForSimpleQuery
// generate sql statement for "Simple Query"
// generate simple query for pie chart which using simple query instead of aggregate query
//
// For "Simple Query", we needn't issue a "group by" SQL query because all the data is prepared. Besides
//   1. If the "Row Name field" is provided, then the query would be like, SELECT ROW-NAME-FIELD, GROUP-FIELD FROM FILE WHERE CONDITION
//   2. Otherwise, the query would be like, SELECT FIRST-UK-PK, GROUP-FIELD FROM FILE WHERE CONDITION
function pieGenQueryForSimpleQuery( meta, logger )
{
  if ( !meta.rowLabelField.ref )
    meta.rowLabelField.ref = libCmn.getFirstFieldInUK( meta.table );

  if ( !meta.rowLabelField.ref )
    throw libCmn.createReportServiceError( ERR_SIMPLEQUERY_NOUK, ERR_TYPE_ERROR, [ meta.table, meta.name ] );

  if ( logger.bIncludeColor )
  {
    var colorCfg = lib.ColorIndicatorService.queryFieldColor( meta.table, meta.rowLabelField.ref );
    if ( colorCfg )
      meta.rowLabelField.colorRules = colorCfg;
  }
  else
  {
    meta.rowLabelField.realFile = meta.table;
    meta.rowLabelField.realField = meta.rowLabelField.ref;
  }

  var sql;
  if ( !libCmn.IsAlreadyAdhocQuery(meta.query) )
  {
    if ( !meta.query )
      meta.query = 'true';

    sql  = ' SELECT ' + meta.rowLabelField.ref + ', ' + meta.groupField.ref;
    sql += ' FROM ' + meta.table ;
    sql += ' WHERE ' + meta.query ;
  }
  else
  {
    sql = meta.query;
  }

  if ( g_logDebug )
    logger.debug('Final simple query : ' + sql );

  return sql;
}
