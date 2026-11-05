var libCmn = lib.reportCmn;
var _val = system.functions.val;

var ERR_SIMPLEQUERY_NOUK          = 57;       // "Cannot find unique key in file %S, and no 'Row Label field' defined for the report %S"
var ERR_NUMERIC_NO_CALC_FIELD    = 206;      // The aggregation field is not defined for numeric chart %S (id: %S)

var ERR_NOTENABLE_IDOL           = 61;

var ERR_TYPE_ERROR           = "3";
var ERR_TYPE_INFO            = "1";

var SIMPLE_QUERY    = "query";

var JSON = lib.JSON.json();

function toJSON(obj) {
  return JSON.stringify(obj);
}
function jsonParse(obj) {
  return JSON.parse(obj);
}

function htamapGenResult( meta, bRefresh, logger )
{
  var sql = null;

  var dataList = new Array();
  var dataItem = new Array();
  var TOPICMAP_DATA = {};

  lib.IDOL_Help.resetHTA();
  lib.IDOL_Help.initializeHTA4Report(meta.table);

  vars['$search.field.keyword'] = "*";
  vars['$search.field.advquery.cond'] = meta.query;

  if (meta.attributes!=null) {
    vars['$search.field.fromdate'] = meta.attributes.htamapFromdate;
    vars['$search.field.todate']   = meta.attributes.htamapTodate;
    vars['$hta.analytics.action']  = meta.attributes.htamapAction;
    vars['$search.field.keyword']  = meta.attributes.htamapKeywords;
    
    if (vars['$search.field.keyword']==null || vars['$search.field.keyword']=="") {
      vars['$search.field.keyword'] = "*";
    }
  }

  if (!!(vars.$lo_idol_enabled && lib.IDOL_Utilities.hasIDOLRight())){
    TOPICMAP_DATA = lib.IDOL_Help.doSearchHotTopicMap4Report(meta.table);
  } else {
    throw libCmn.createReportServiceError( ERR_NOTENABLE_IDOL, ERR_TYPE_INFO, [ meta.id ] );
  }

  if (TOPICMAP_DATA!=null)
  {
    dataItem.push((TOPICMAP_DATA.subtopics.length > 0) ? JSON.stringify(TOPICMAP_DATA) : '');
    dataList.push(dataItem);

    var aryExportData = lib.reportHtaD3Help.getTreeMap1st(TOPICMAP_DATA);
    dataList.push(aryExportData);
  }

  // Manually construct the drill down query for client side
  meta.query = meta.drillDownQuery;
  delete meta.drillDownQuery;
  delete meta.groupByTimeAgg;
  delete meta.stackTimeAgg;
  delete meta.bAggCount;

  meta.type      = 'htamap';
  meta['@class'] = 'htamap';

  var gadgetData = {
    "meta" : meta,

    "resultSet": {
      "hasMore": false,
      "timestamp" : libCmn.getNowString(),
      "data"   : dataList
    }
  };

  return gadgetData;
}

function htamapSetupMeta( fInbox, meta, logger )
{
  return meta;
}
