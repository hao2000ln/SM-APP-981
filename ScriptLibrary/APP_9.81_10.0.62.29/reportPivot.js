var libCmn = lib.reportCmn;
var libDN = lib.DisplayName;
var _val = system.functions.val;

var ERR_PIVOT_EMPTY_FIELDS   = 202;      // The fields "%S" should not be empty for pivot table "%S" (id: %S)
var ERR_PIVOT_TOO_MANY_ROW   = 205;      // Size of resultset exceeded the limitation (%S records), please revise your query filter or enlarge the record count limitation
var ERR_REPORT_MODIFIED      = 224;      // Report modified after last read ( Inbox ID: %S, received version: %S, current version: %S )

var ERR_TYPE_ERROR           = "3";

var MSG_CLASS_REPORT         = "Reporting";
var ERR_CODE_PREFIX          = "R";         // The error code for Report Module: "R" + ####
var ERR_CODE_PREFIX_BASE     = "E";         // The error code for Base module:   "E" + ####

var MSG_CLASS_TABLENAME      = "tablename";    // for localization of file name

var PIVOT_DATE_AGG_YEAR    = 'YEAR';
var PIVOT_DATE_AGG_QUARTER = 'QUARTER';
var PIVOT_DATE_AGG_MONTH   = 'MONTH';
var PIVOT_DATE_AGG_WEEK    = 'WEEK_OF_YEAR';
var PIVOT_DATE_AGG_DAY     = 'DATE';

function pivotProcessFields( f, tablename, nameArrayField, aggArrayField, pivotFieldList, logger , pivotType)
{
  var fields = new Array();

  nameArrayField = system.functions.denull(nameArrayField);
  aggArrayField = system.functions.denull(aggArrayField);

  for (var i = 0; nameArrayField && (i < nameArrayField.getSize() ); i++)
  {
    var fieldname = nameArrayField[i];
    if ( !fieldname )
      continue;

    var field = {
      "ref" : fieldname,
      "type" : libCmn.getFieldType( f, fieldname ),
      "caption" : libCmn.getFieldCaption( f, fieldname ),
      "calculator" : null
    };

    if ( logger.bIncludeColor )
    {
      var colorCfg = lib.ColorIndicatorService.queryFieldColor( tablename, fieldname );
      if ( colorCfg )
        field.colorRules = colorCfg;
    }
    else
    {
      field.realFile = tablename;
      field.realField = fieldname;
    }

    var gl = libCmn.globallistDefGet( tablename, fieldname );
    if ( gl && gl.found )
    {
      field.valueList = gl.valueList;
      field.displayList = gl.displayList;
    }

    var aggName = null;
    var agg = null;
    if ( aggArrayField && aggArrayField.getSize()>i )
      agg = aggArrayField[i];

    if ( agg )
    {
      aggName = agg.toUpperCase();
      field.calculator = {
        "name"    : aggName,
        "caption" : agg
      }

      libCmn.pivotProcessFieldAggregator( field.calculator );
      pivotSetTimeAggLocalCaption( field.calculator );
    }

    fields.push( field );

		pivotFieldList.push({
			"name" : fieldname,
			"filename" : tablename,
			"pivotType": pivotType,
			"type" : field.type,
			"agg" : aggName
		});
	} // for

  return fields;
}

// Get localized caption for time aggregation functions
function pivotSetTimeAggLocalCaption(agg)
{
  var glTimeAggType = "Reporting Calculator Type";
  var gl = libCmn.globallistGetByName( glTimeAggType );

  if ( gl && gl.found )
  {

    var valList = gl.valueList;
    var agg_name = agg.name;
    for ( var i = 0; i < valList.length; i++)
    {
      if ( agg_name.toUpperCase() == valList[i].toUpperCase() )
      {
        agg.caption = gl.displayList[i];
        break;
      }
    }
  }
}

// Setup the meta for pivot table
function pivotSetupMeta( fInbox, meta, logger )
{
  // rowFields, colFields, candidateFields, aggregator

  if ( g_logDebug )
    logger.debug("rowFields: " + fInbox.pivot_rowField + ", colFields: " + fInbox.pivot_colField + ", candFields: " + fInbox.pivot_candField );
  if ( !fInbox.pivot_rowField )
    throw libCmn.createReportServiceError( ERR_PIVOT_EMPTY_FIELDS, ERR_TYPE_ERROR, ["pivot.rowField", fInbox.inbox_name, fInbox.inbox_id] );
  if ( !fInbox.pivot_colField )
    throw libCmn.createReportServiceError( ERR_PIVOT_EMPTY_FIELDS, ERR_TYPE_ERROR, ["pivot.colField", fInbox.inbox_name, fInbox.inbox_id] );

  var f = new SCFile( meta.table );

  var pivotFieldList = new Array();

	meta.rowFields = pivotProcessFields(f, meta.table, fInbox.pivot_rowField, fInbox.pivot_rowCalculator, pivotFieldList, logger, "rowField");
	meta.colFields = pivotProcessFields(f, meta.table, fInbox.pivot_colField, fInbox.pivot_colCalculator, pivotFieldList, logger, "colField");
	meta.candidateFields = pivotProcessFields(f, meta.table, fInbox.pivot_candField, fInbox.pivot_candCalculator, pivotFieldList, logger, "candidateField");

  meta.pivotFieldList = pivotFieldList;

  meta.inboxClass = "report";
  meta.type = "pivot";

  return meta;
}

function pivotSetupDrillDownQuery(meta, logger)
{
  var fields = new Array();

  // push at least one field to satisfy the generate.sql.query
  fields.push(meta.pivotFieldList[0].name);

  if( !meta.query )
    meta.query = "true";

  meta['drillDownQuery'] = meta.query;

  var q = system.functions.generate_sql_query(fields, meta.query, meta.table, true );
  var strFROM = ' FROM ';
  var pos = q.toUpperCase().indexOf( strFROM );
  if ( pos >= 0 )
    q = q.substring(pos, q.length);

  return q;
}

function searchStringInArray (str, strArray)
{
  for (var j=0; j< strArray.length; j++)
  {
    if ( strArray[j] === str )
      return j;
  }
  return -1;
}

function pivotGenQuery( meta, logger )
{
  var sqlFrom = "";
  var sqlGroup = "";
  var sqlOrder = "";

  var orderFields = [];

  // select row-field-list, col-field-list, cand-field-list, agg(agg_field) from table group by row-field-list, cold-field-list, cand-field-list where ###
  for ( var i = 0; i < meta.pivotFieldList.length; i++ )
  {
    var field = meta.pivotFieldList[i];

    var field_alias = field.name;
    var aliasForAgg = "";
    if ( field.agg && (field.type === "time") )
    {
      field_alias = libCmn.genTimeAggQuery(field.agg, field.name, logger);
      aliasForAgg = ' AS fieldalias' + i.toString();
    }

    if ( g_logDebug )
      logger.debug("field: " + field.name + ", field_alias: " + field_alias + aliasForAgg);

    sqlFrom += field_alias + aliasForAgg + ", ";

    if ( i == 0 )
    {
      sqlGroup += field_alias;
      sqlOrder += field_alias;
      orderFields.push(field_alias);
    }
    else
    {
      if ( searchStringInArray(field_alias, orderFields ) < 0 )
      {
        sqlGroup += ", " + field_alias;
        sqlOrder += ", " + field_alias;
        orderFields.push( field_alias );
      }
    }
  }

  // Gen the adhoc sql query for the where condition like, probsummary;assignee.name;operator;name;operator;email like "*"com"*"
  // For the simplicity, we don't support the manually written adhocsql query here
  var qAdhocWhere;
  // forced to be adhoc sql query
  qAdhocWhere = pivotSetupDrillDownQuery(meta, logger);

  if ( g_logDebug )
    logger.debug('Generated query: ' + qAdhocWhere);

  var aggFieldName = "*";
  var aggregator = meta.aggregator;

  if ( !aggregator || !aggregator.name )
    sqlFrom += " COUNT(*) as pivotAGGval ";
  else
  {
    var aggName = aggregator.name.toUpperCase();

    if ( aggName === "AVG" )
    {
      // For "AVG", we return SUM and COUNT instead, so that the client won't need to refresh all the data
      if ( aggregator.field && aggregator.field.ref )
        sqlFrom += " SUM( " +  aggregator.field.ref + " ) as pivotavgSUM, COUNT(*) as pivotavgCOUNT ";
      else
        sqlFrom += " SUM( * ) as pivotavgSUM, COUNT(*) as pivotavgCOUNT ";
    }
    else
    {
      if ( aggregator.field && aggregator.field.ref )
        sqlFrom += aggName + "( " +  aggregator.field.ref + " ) as pivotAGGval ";
      else
        sqlFrom += aggName + "(*) as pivotAGGval ";
    }
  }

  var sql = "SELECT " + sqlFrom + qAdhocWhere + " GROUP BY " + sqlGroup + " ORDER BY " + sqlOrder;

  return sql;
}

function pivotGenResult( meta, bRefresh, logger )
{
  var sql = pivotGenQuery( meta, logger );
  if ( g_logDebug )
    logger.debug("final query: " + sql);

  // Fetch the data
  // Thanks to new ADHOC sql, no need to use setFields
  var f = new SCFile( meta.table );

  // Max record limitation
  var maxGroup = libCmn.getMaxRecordLimit( meta, logger );
  var currGroup = 0;
  var bHasMore = false;
  if ( maxGroup > 0 )
    f.setSelectTop( maxGroup + 1 );

  libCmn.setFileCacheOption(f, bRefresh, meta.usereplicatedb, logger);
  sql = libCmn.fixQuery( meta.table, sql, logger );
  var rc = f.doSelect(sql);
  if ( g_logDebug )
    logger.debug("Pivot query done");
  libCmn.checkQueryRC(rc);

  var resultSet = new Array();
  var fieldList = meta.pivotFieldList;

  var bAVG = ( meta.aggregator.name.toUpperCase() === "AVG" );

  while ( rc == RC_SUCCESS )
  {
    if ( ( maxGroup > 0 ) && ( currGroup >= maxGroup ) )
    {
      throw libCmn.createReportServiceError( ERR_PIVOT_TOO_MANY_ROW, ERR_TYPE_ERROR, [ maxGroup ] );
    }

    var item = new Array();
    for ( var i = 0; i < fieldList.length; i++ )
    {
      if ( fieldList[i].type === 'time' )
      {
        item.push( _val(f[i], 2) );
      }
      else
      {
        item.push( f[i] );
      }
	 var rFileName = fieldList[i].filename;
	 if(!rFileName) rFileName = meta.table
	 
	 var rFieldName = fieldList[i].name;
	 if(!rFieldName) rFieldName =  fieldList[i].ref

	 var tmpFieldRefTable = libDN.getFieldReferenceTable(rFileName, rFieldName);
	 
	 if (tmpFieldRefTable){
		if (!fieldList[i].displayList){
			fieldList[i].valueList = new Array();
			fieldList[i].displayList = new Array();					
		}				
		fieldList[i].valueList.push(f[i]);
		//fieldList[i].displayList.push(libDN.getReferenceDisplayName(f[i], tmpFieldRefTable));
	 }	  
    }

    if ( bAVG )
    {
      item.push( f['pivotavgSUM'] );
      item.push( f['pivotavgCOUNT'] );
    }
    else
    {
      item.push( f['pivotAGGval'] );
    }

    resultSet.push(item);
    currGroup++;
    rc = f.getNext();
  }

  for (var i = 0; i < fieldList.length; i++) {
	if(!fieldList[i].valueList || fieldList[i].valueList.length==0)
		continue;
	var fieldName = fieldList[i].name;
	var pivotType = fieldList[i].pivotType;
	if(pivotType =="rowField"){
		var rowLength = meta.rowFields.length;
		for(var j = 0; j < rowLength; j++){
			var rfrowField=meta.rowFields[j].realField;
			if(!rfrowField) rfrowField = meta.rowFields[j].ref;
			
			var rFileName = meta.rowFields[j].filename;
	 		if(!rFileName) rFileName = meta.table;
	 		var rFieldRefTable = libDN.getFieldReferenceTable(rFileName, rfrowField);
			if(rfrowField && rfrowField == fieldList[i].name && !meta.rowFields[j].displayList){
				meta.rowFields[j].valueList=fieldList[i].valueList;
				//print("***** fieldList[i].valueList: "+fieldList[i].valueList);
				meta.rowFields[j].displayList=libDN.getReferenceDisplayName(fieldList[i].valueList.slice(), rFieldRefTable);
				//print("***** meta.rowFields[j].displayList: "+meta.rowFields[j].displayList);
				
			}
		}
	}else if(pivotType =="colField"){
		var colLength = meta.colFields.length;
		for(var j = 0; j < colLength; j++){
			var rfColField=meta.colFields[j].realField;
			if(!rfColField) rfColField = meta.colFields[j].ref;
			
			var cFileName = meta.colFields[j].filename;
	 		if(!cFileName) cFileName = meta.table;
	 		var cFieldRefTable = libDN.getFieldReferenceTable(cFileName, rfColField);
			if(rfColField && rfColField== fieldList[i].name && !meta.colFields[j].displayList){
				meta.colFields[j].valueList=fieldList[i].valueList;
				//print("***** colfieldList[i].valueList: "+fieldList[i].valueList);
				meta.colFields[j].displayList=libDN.getReferenceDisplayName(fieldList[i].valueList.slice(), cFieldRefTable);
				//print("***** meta.colFields[j].displayList: "+meta.colFields[j].displayList);
			}
		}
	}else if(pivotType =="candidateField"){
		var candLength = meta.candidateFields.length;
		for(var j = 0; j < candLength; j++){
			var rfCanField=meta.candidateFields[j].realField;
			if(!rfCanField) rfCanField = meta.candidateFields[j].ref;
			var canFileName = meta.candidateFields[j].filename;
	 		if(!canFileName) canFileName = meta.table;
	 		var canFieldRefTable = libDN.getFieldReferenceTable(canFileName, rfCanField);
			if(rfCanField && rfCanField == fieldList[i].name && !meta.candidateFields[j].displayList){
				meta.candidateFields[j].valueList=fieldList[i].valueList
				//print("***** canfieldList[i].valueList: "+fieldList[i].valueList);
				meta.candidateFields[j].displayList=libDN.getReferenceDisplayName(fieldList[i].valueList.slice(), canFieldRefTable);
				//print("***** meta.colFields[j].displayList: "+meta.candidateFields[j].displayList);
			}
		}
	}		
  }
  
  if ( meta.drillDownQuery )
  {
    meta.query = meta.drillDownQuery;
    delete meta.drillDownQuery;
  }

  // assemble correct resposne object
  delete meta.pivotFieldList;
  delete meta.source;
  delete meta.groupField;
  delete meta.aggregator;

  var result = {
    "meta" : meta,
    "resultSet": {
      "hasMore": bHasMore,
      "timestamp" : libCmn.getNowString(),
      "data" : resultSet
    }
  };

  return result;
}

function savePivotMeta( meta, logger )
{
  var f = new SCFile("inbox");
  var rc = f.doSelect( 'inbox.id = ' + meta.id );

  if ( rc != RC_SUCCESS )
  {
    throw libCmn.createReportServiceError( ERR_REPORT_NOTFOUND, ERR_TYPE_INFO, [ meta.id ] );
  }

  if ( !libCmn.isAuthorizedForThisReport( null, f ) )
  {
    throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [ f.inbox_name, meta.id ] );
  }

  var objRight = libCmn.getInboxSecRight(f);
  if ( !objRight.canUpdate )
  {
    throw libCmn.createReportServiceError( ERR_UNAUTHORIZED_INBOX, ERR_TYPE_ERROR, [ f.inbox_name, meta.id ] );
  }

  // Check whether modified before after read
  if ( f.sysmodcount != meta.version )
    throw libCmn.createReportServiceError( ERR_REPORT_MODIFIED, ERR_TYPE_ERROR, [ meta.id, meta.name ] );

  // Only take care the changes in name, rowFields, colFields, candidateFields
  f.inbox_name = meta.name;

  pivotFieldsFromMeta( f, meta.table, 'pivot_rowField', 'pivot_rowCalculator', meta.rowFields, logger );
  pivotFieldsFromMeta( f, meta.table, 'pivot_colField', 'pivot_colCalculator', meta.colFields, logger );
  pivotFieldsFromMeta( f, meta.table, 'pivot_candField', 'pivot_candCalculator', meta.candidateFields, logger );

  rc = f.doUpdate();
  if ( rc != RC_SUCCESS )
  {
    var errObj = new Error();
    errObj.errorCode = libCmn.padString(ERR_CODE_PREFIX_BASE, rc);
    errObj.message =  system.functions.scmsg( libCmn.getSCMsgCode(rc), "us", [] );

    throw errObj;
  }

  return f.inbox_id;
}

/**
 * Construct from meta information
 *
 * @param nameArrayField
 * @param aggArrayField
 * @param pivotFieldList
 * @param logger
 * @returns {Array}
 */
function pivotFieldsFromMeta( f, table, fieldname, aggfieldname, pivotFieldList, logger )
{
  var nameArrayField = new SCDatum();
  var aggArrayField = new SCDatum();

  nameArrayField.setType(8);
  aggArrayField.setType(8);

  for ( var i = 0; i < pivotFieldList.length; i++ )
  {
    var field = pivotFieldList[i];

    nameArrayField.push( field.ref );
    aggArrayField.push ( (field.calculator)? field.calculator.name : null );
  }

  f[ fieldname ] = nameArrayField;
  f[ aggfieldname ] = aggArrayField;
}
