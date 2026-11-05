var libCmn = lib.reportCmn;
var libDN = lib.DisplayName;
var _val = system.functions.val;

var ERR_STACKFIELD_NOTFOUND       = 55;       // "The property 'stack.field' is not defined for the stack report '%S' (id: %S)"
var ERR_SIMPLEQUERY_NOUK          = 57;       // "Cannot find unique key in file %S, and no 'Row Label field' defined for the report %S"

var ERR_TYPE_ERROR                 = "3";

var SIMPLE_QUERY    = "query";
var AGGREGATE_QUERY = "aggregate";

var PIVOT_DATE_AGG_YEAR    = 'YEAR';
var PIVOT_DATE_AGG_QUARTER = 'QUARTER';
var PIVOT_DATE_AGG_MONTH   = 'MONTH';
var PIVOT_DATE_AGG_WEEK    = 'WEEK_OF_YEAR';
var PIVOT_DATE_AGG_DAY     = 'DATE';

// compactValue: if in compact mode, then
function getTimeAggFieldName(f, meta, field, timeAgg, logger, compactMode, bAdhocField, adhocField)
{
  var timeField ;

  if ( bAdhocField )
  {
    var fAdhoc = new SCFile(adhocField.filename);
    field.type = libCmn.getFieldType(fAdhoc, adhocField.fieldname);
    field.caption = libCmn.getFieldCaption( fAdhoc, adhocField.fieldname );

    if ( logger.bIncludeColor )
    {
      var colorCfg = lib.ColorIndicatorService.queryFieldColor( adhocField.fieldname, adhocField.fieldname );
      if ( colorCfg )
        field.colorRules = colorCfg;
    }
    else
    {
      field.realFile = adhocField.filename;
      field.realField = adhocField.fieldname;
    }

    var gl = libCmn.globallistDefGet(adhocField.filename, adhocField.fieldname);
    if (gl && gl.found)
    {
      field.valueList = gl.valueList;
      field.displayList = gl.displayList;
    }
  }
  else
  {
    field.caption = libCmn.getFieldCaption(f, field.ref);
    field.type = libCmn.getFieldType(f, field.ref);

    if ( logger.bIncludeColor )
    {
      var colorCfg = lib.ColorIndicatorService.queryFieldColor( meta.table, field.ref );
      if ( colorCfg )
        field.colorRules = colorCfg;
    }
    else
    {
      field.realFile = meta.table;
      field.realField = field.ref;
    }

    var gl = libCmn.globallistDefGet(meta.table, field.ref);
    if (gl && gl.found)
    {
      field.valueList = gl.valueList;
      field.displayList = gl.displayList;
    }
  }

  if ( g_logDebug )
    logger.debug("getTimeAggFieldName field.type: " + field.type + ", timeAgg: " + timeAgg + ", bAdhocField: " + bAdhocField);
  if ( (field.type === 'time') && timeAgg )
  {
    compactMode = !(!compactMode);
    timeField = libCmn.genTimeAggQuery(timeAgg, field.ref, logger, compactMode);
    var timeAggIdx = system.functions.index(timeAgg.toUpperCase(), vars["$G.gl.reporting.calculatorType"]);
    field.calculator = {
      "name"    : timeAgg.toUpperCase(),
      "caption" : vars["$G.gl.reporting.calculatorType.display"][timeAggIdx-1],
      "simple"  : compactMode
    };

    libCmn.pivotProcessFieldAggregator( field.calculator );
  }
  else
  {
    if ( bAdhocField )
    {
      timeField = adhocField.fullfield;
    }
    else
    {
      timeField = field.ref;
    }
  }

  if ( g_logDebug )
    logger.debug("getTimeAggFieldName: " + timeField);

  return timeField;
}

function useCompactDate(groupField, groupByCalculator, stackField, stackCalculator)
{
  if ( (groupField === stackField) && groupByCalculator && stackCalculator )
  {
    if ( (groupByCalculator === PIVOT_DATE_AGG_YEAR && stackCalculator !== PIVOT_DATE_AGG_YEAR) || (groupByCalculator === PIVOT_DATE_AGG_MONTH && stackCalculator === PIVOT_DATE_AGG_DAY) )
      return true;
  }

  return false;
}

function searchFileAlias( query, filename )
{
  var ret = '';
  var prefixFileAlias =  " " + filename + " ta0";
  var pos = query.indexOf( prefixFileAlias );
  if ( pos >= 0 )
    ret = query[pos + prefixFileAlias.length];

  return ret.toString();
}

// meta: GardgetQuerymeta
function barGenQuery( bUseStackField, meta, logger )
{
  if ( g_logDebug )
    logger.debug('Raw query: ' + meta.query);

  // Always generate adhoc sql query for the simplicity
  var fields = new Array();
  fields.push( meta.groupField.ref );

  if ( meta.stackField && ( meta.stackField.ref != null ) )
    fields.push(meta.stackField.ref);

  // forced to be adhoc sql query
  if ( !meta.query )
    meta.query = 'true';
  meta['drillDownQuery'] = meta.query;

  var q = system.functions.generate_sql_query(fields, meta.query, meta.table, true);
  var rawQuery = q;
  if ( g_logDebug )
    logger.debug('Generated query: ' + q);

  var strFROM = ' FROM ';
  var qSelect = null;
  var bAdhocGroup = libCmn.isAdhocField(meta.groupField.ref);
  var bAdhocStack = false;
  if ( bUseStackField )
    bAdhocStack = libCmn.isAdhocField(meta.stackField.ref);

  var pos = q.toUpperCase().indexOf( strFROM );
  if ( pos >= 0 )
  {
    if ( bAdhocGroup )
      qSelect = q.substring(0, pos);

    q = q.substring(pos, q.length);
  }

  if ( g_logDebug )
    logger.debug('generate.sql: ' + q);

  var sql = '';
  var adhocGroup = null;
  var adhocStack = null;

  var bUseMetrics = (meta.aggregator.name != null) && (meta.aggregator.name.toUpperCase() !== "COUNT") ;
  if ( g_logDebug )
    logger.debug("agg name: " + meta.aggregator.name + ", bUseMetrics: " + bUseMetrics );

  var aggField;
  if ( bUseMetrics )
  {
    aggField = meta.aggregator.field.ref;
  }

  var f = new SCFile(meta.table);

  if ( bAdhocGroup )
  {
    adhocGroup = libCmn.getRealFieldNameFromAdhocFieldString(meta.groupField.ref);
    var aliasIndex = searchFileAlias(rawQuery, adhocGroup.filename);
    if ( aliasIndex )
      adhocGroup.fullfield = "ta0" + aliasIndex + "." + adhocGroup.fieldname;
  }

  if ( bAdhocStack )
  {
    adhocStack = libCmn.getRealFieldNameFromAdhocFieldString(meta.stackField.ref);
    var aliasIndex = searchFileAlias(rawQuery, adhocStack.filename);

    if ( aliasIndex )
      adhocStack.fullfield = "ta0" + aliasIndex + "." + adhocStack.fieldname;
  }

  var timeGroup = getTimeAggFieldName(f, meta, meta.groupField, meta.groupByTimeAgg, logger, false, bAdhocGroup, adhocGroup );
  var timeStack;
  if ( bUseStackField )
  {
    var compactMode = useCompactDate(meta.groupField.ref, meta.groupByTimeAgg, meta.stackField.ref, meta.stackTimeAgg);
    timeStack = getTimeAggFieldName(f, meta, meta.stackField, meta.stackTimeAgg, logger, compactMode, bAdhocStack, adhocStack);
  }

  var aggFieldName = null;
  if ( !bUseStackField )
  {
    if ( !bUseMetrics )
    {
      aggFieldName = " COUNT(*) ";
    }
    else
    {
      aggFieldName = meta.aggregator.name + '(' +  aggField + ') ';
    }
    sql = 'SELECT ' + timeGroup + ' as fieldAlias1, ' +  aggFieldName + ' AS cnt1 ';
  }
  else
  {
    if ( !bUseMetrics )
    {
      sql = 'SELECT ' + timeGroup + ' as fieldAlias1, ' + timeStack + ' as fieldAlias2, COUNT(*) AS cnt1 ';
    }
    else
    {
      sql = 'SELECT ' + timeGroup + ' as fieldAlias1, ' + timeStack + ' as fieldAlias2, ' + meta.aggregator.name + '(' + aggField + ') AS cnt1 ';
    }
  }

  sql += q;

  if ( bUseStackField )
  {
    if ( timeGroup !== timeStack )
    {
      sql += ' GROUP BY ' + timeGroup + ', ' + timeStack;
      sql += ' ORDER BY ' + timeGroup + ', ' + timeStack;
    }
    else
    {
      sql += ' GROUP BY ' + timeGroup;
      sql += ' ORDER BY ' + timeGroup;
    }
  }
  else
  {
    sql += ' GROUP BY ' + timeGroup;

    var bOrderByAgg = meta.attributes['supportTopN'];
    bOrderByAgg = (bOrderByAgg === "true") || ( parseInt(bOrderByAgg, 10) > 0);

    if ( bOrderByAgg )
      sql += ' ORDER BY ' + aggFieldName + ' DESC ';
    else
      sql += ' ORDER BY ' + timeGroup;
  }

  return sql;
}

function barGenQueryForSimpleQuery( bUseStackField, meta, logger )
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
    meta.rowLabelField.realField =  meta.rowLabelField.ref;
  }

  var q;
  var bAdhocSql = libCmn.IsAlreadyAdhocQuery(meta.query);
  if ( !bAdhocSql )
  {
    var fields = new Array();
    fields.push( meta.groupField.ref );

    if ( bUseStackField )
    {
      fields.push( meta.stackField.ref );

      if ( logger.bIncludeColor )
      {
        var colorCfg = lib.ColorIndicatorService.queryFieldColor( meta.table, meta.stackField.ref );
        if ( colorCfg )
          meta.stackField.colorRules = colorCfg;
      }
      else
      {
        meta.stackField.realFile = meta.table;
        meta.stackField.realField =  meta.stackField.ref;
      }
    }

    if ( !meta.query )
      meta.query = 'true';

    q = system.functions.generate_sql_query(fields, meta.query, meta.table, true);
  }
  else
  {
    q = meta.query;
  }

  var strFROM = ' FROM ';
  var pos = q.toUpperCase().indexOf( strFROM );
  if ( pos >= 0 )
  {
    q = q.substring(pos, q.length);
  }

  var sql;

  if ( bUseStackField )
  {
    sql = ' SELECT ' + meta.rowLabelField.ref + ', ' + meta.stackField.ref + ', ' + meta.groupField.ref;
  }
  else
  {
    sql = ' SELECT ' + meta.rowLabelField.ref + ', ' + meta.groupField.ref;
  }

  sql += q;

  if ( g_logDebug )
    logger.debug('Final simple query : ' + sql );

  return sql;
}

function barGenDataList( isStackChart, meta, bRefresh, logger )
{
  var bUseStackField = false;

  if ( meta.stackField )
    bUseStackField = meta.stackField.ref;

  if ( isStackChart && !bUseStackField )
  {
    logger.warn( "Invalid configuration, the stack field should not be null for StackedChart, inbox id: " + meta.id );

    throw libCmn.createReportServiceError( ERR_STACKFIELD_NOTFOUND, ERR_TYPE_ERROR, [ meta.name, meta.id ] );
  }

  var bSimpleQuery = (meta.source === SIMPLE_QUERY) ? true : false;
  var sql;

  if ( bSimpleQuery )
    sql = barGenQueryForSimpleQuery( bUseStackField, meta, logger );
  else
    sql = barGenQuery( bUseStackField, meta, logger );

  if ( g_logDebug )
    logger.debug("Bar query: " + sql);
  var f = new SCFile( meta.table );

  // For maximum group limitation
  var maxGroup      = libCmn.getMaxRecordLimit( meta, logger );
  var currGroup     = 0;

  // For stack field limitation
  var maxStack      = 0;
  var curStack      = 0;
  if ( bUseStackField )
    maxStack = libCmn.getMaxStackedRecordLimit( meta, logger );

  f.setSelectTop( (maxGroup <= 0 || bUseStackField)? 500 : maxGroup + 1 );

  libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);
  sql = libCmn.fixQuery( meta.table, sql, logger );
  var rc = f.doSelect(sql);

  if ( g_logDebug )
    logger.debug("Bar query done ");
  libCmn.checkQueryRC(rc);

  // ---------------------- Generate group_field, stack_field(optional), metrics --------------------------

  var bHasMore = false;
  if ( bSimpleQuery )
  {
    var gl = libCmn.globallistDefGet(meta.table, meta.groupField.ref);
    if (gl && gl.found)
    {
      meta.groupField.valueList = gl.valueList;
      meta.groupField.displayList = gl.displayList;
    }

    if ( bUseStackField )
    {
      var gl = libCmn.globallistDefGet(meta.table, meta.stackField.ref);
      if (gl && gl.found)
      {
        meta.stackField.valueList = gl.valueList;
        meta.stackField.displayList = gl.displayList;
      }
    }
  }

  // ---------------------- Generate field list --------------------------
  var barDataList = new Array();
  var _type = system.functions.type;

  barDataList.addItem = function(f, group_field_value, use_stack, stack_item_value, aggregate_value){
    var item = new Array();

    if ( group_field_value && _type(group_field_value) == 3 )
    {
      group_field_value = _val(group_field_value, 2);
    }
    item.push(group_field_value);

    if ( use_stack )
    {
      if ( stack_item_value && _type(stack_item_value) == 3 )
      {
        stack_item_value = _val(stack_item_value, 2);
      }

      item.push(stack_item_value);
    }

    item.push(aggregate_value);

    this.push(item);
  }; // addItem

  if ( meta.stackField && g_logDebug )
    logger.debug('stack field: ' + meta.stackField.ref);

  var groupFieldName = meta.groupField.ref;
  var stackFieldName;
  var rowFieldName;
  var realRefFile=meta.groupField.realFile;
  if (!realRefFile) realRefFile = meta.table;
  
  var realRefField=meta.groupField.realField;
  if (!realRefField) realRefField = meta.groupField.ref;
  
  var stackFieldRefTable ;
  if ( meta.stackField ){
       stackFieldName = meta.stackField.ref;
       var stackFieldrealFile = meta.stackField.realFile;
       if (!stackFieldrealFile) stackFieldrealFile = meta.table;
       stackFieldRefTable = libDN.getFieldReferenceTable(stackFieldrealFile,stackFieldName);
    }
  if ( bSimpleQuery )
  {
    rowFieldName = meta.rowLabelField.ref;
    realRefFile=meta.table;
    realRefField = meta.groupField.ref;
   }

  var groupName     = null;
  var prevGroupName = null;
  var bFirstRow     = true;
  
  var refValueList=new Array();
  var refdisplayNameList=new Array();
  var stackFieldrefValueList=new Array();
  var stackFieldrefdisplayNameList=new Array();
  var fieldRefTable = libDN.getFieldReferenceTable(realRefFile,realRefField);
  while ( rc == RC_SUCCESS )
  {
    if ( bSimpleQuery )
      groupName = f[rowFieldName];
    else
      groupName = f[0];
      
      if (fieldRefTable){
	  	refValueList.push(groupName);
	  	//refdisplayNameList.push(libDN.getReferenceDisplayName(groupName, fieldRefTable));
	  } 

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
      bHasMore = true;

      if ( g_logDebug )
        logger.debug("Reach maximum group limit (" + maxGroup + "), stop fetching data");

      break;
    }

    if ( bSimpleQuery )
    {
      if ( bUseStackField  )
      {
        if ( (maxStack <= 0) || (curStack < maxStack) )
        {
          barDataList.addItem(f, groupName, true, f[1], f[groupFieldName] );
		  if(stackFieldRefTable){
			stackFieldrefValueList.push(f[1]);
			//stackFieldrefdisplayNameList.push(libDN.getReferenceDisplayName(f[1], stackFieldRefTable));
		  }
          curStack++;
        }
      }
      else
      {
        barDataList.addItem(f, groupName, false, null, f[groupFieldName] );
      }
    }
    else
    {
      if ( bUseStackField )
      {
        if ( (maxStack <= 0) || (curStack < maxStack ) )
        {
          barDataList.addItem(f, groupName, true, f[1], f.cnt1 );
          curStack++;
		  if(stackFieldRefTable){
			stackFieldrefValueList.push(f[1]);
			//stackFieldrefdisplayNameList.push(libDN.getReferenceDisplayName(f[1], stackFieldRefTable));
		  }
        }
      }
      else
      {
        barDataList.addItem(f, groupName, false, null, f.cnt1 );
      }
    }


    rc = f.getNext();
  } // while

  
  	if (fieldRefTable && !meta.groupField.displayList){
	  meta.groupField.valueList = refValueList;
      meta.groupField.displayList = libDN.getReferenceDisplayName(refValueList.slice(), fieldRefTable);	
	}
	
	if(stackFieldRefTable && meta.stackField && !meta.stackField.displayList){
		meta.stackField.valueList=stackFieldrefValueList;
		meta.stackField.displayList=libDN.getReferenceDisplayName(stackFieldrefValueList.slice(), stackFieldRefTable);;
		
	}
  if ( bSimpleQuery )
  {
    meta.rowLabelField.caption =  libCmn.getFieldCaption( f, meta.rowLabelField.ref );
    meta.rowLabelField.type = libCmn.getFieldType( f, meta.rowLabelField.ref );

    // swap the groupField and rowField to align to the aggregate query
    var tmp = meta.groupField;
    meta.groupField = meta.rowLabelField;
    meta.rowLabelField = tmp;

    meta.aggregator.field = meta.rowLabelField;

    // Pretend be an "aggregate" query to client
    meta.source = SIMPLE_QUERY;
  }
  else
  {
    if ( !meta.aggregator.field )
      meta.aggregator.field = meta.groupField;

    // Manually construct the drill down query for client side
    meta.query = meta.drillDownQuery;
    delete meta.drillDownQuery;
  }

  delete meta.groupByTimeAgg;
  delete meta.stackTimeAgg;

  var query_result = {
    "meta" : meta,

    "resultSet": {
      "hasMore": bHasMore,
      "timestamp" : libCmn.getNowString(),
      "data"   : barDataList
    }
  }

  return query_result;
}

// barGenResult: generate complete result set including all necessary attributes
function barGenResult( query_meta, bRefresh, logger )
{
  var query_result = barGenDataList(query_meta.isStackChart(), query_meta, bRefresh, logger);

  if ( query_result.meta && query_result.meta.query == null )
    query_result.meta.query = 'true';

  return query_result;
}

