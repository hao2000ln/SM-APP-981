var libCmn = lib.reportCmn;
var _val = system.functions.val;

var MSG_CLASS_REPORT          = "Reporting";

var MSG_ID_UNCATEGORIED       = "Uncategoried"

var CHART_GRID                = 'GRID';
var CHART_TITLEDGRID          = 'TITLEDGRID';

var INBOX_CLASS_GRID          = 'CLASSLIST';
var INBOX_CLASS_CHART         = 'CHART';
//Get the wildcard character 
function getWildCardCfg()
{
    var chrcfg=funcs.sysinfo_get("WildCardMultiCharacter");
    return chrcfg;
}
var chr=getWildCardCfg();
// Get the filename to category map
// Return
//   hash-map
function getCategoryMap()
{
  var f = new SCFile("reportCategory");
  var rc = f.doSelect("true");

  var hash_table = {};
  while ( rc == RC_SUCCESS )
  {
    var tables = f.table_names.toArray();
    var catName = f.name;
    for ( var i = 0; i < tables.length; i++ )
    {
      hash_table[tables[i]] = catName;
    }
    rc = f.getNext();
  }

  return hash_table;
}

function getCategoryOfFile( filename )
{
  var mapCat = getCategoryMap();
  return mapCat[filename];
}

function getCategoryLocalName( catName )
{
  var localName = system.functions.scmsg( catName, "local:reportCategory" );

  if ( !localName || (localName.indexOf("Could not be found") >= 0) )
  {
    localName = catName;
  }

  return localName;
}

function getFilesOfCategory( catName )
{
  var f = new SCFile('reportCategory');
  var q = 'name="' + catName + '"';
  var rc = f.doSelect(q);

  var ret = null;
  if ( rc == RC_SUCCESS )
  {
    var files = system.functions.denull(f.table_names);
    if ( files && (files.getSize() > 0) )
      ret = system.functions.str(system.functions.denull(f.table_names));
  }

  return ret;

}

/**
 * @param {Number} categoryId
 * @param {String} queryStr the string to query
 * @param {String} inboxClass type of gadget, must be 'chart','pivot' or 'grid'
 * @param {String} orderBy, must be 'name' or 'updateTime'
 * @param {String} bDesc must be '0' or '1', '0' means false
 * @param {Number} start the start number for paging query
 * @param {Number} size the page size for paging query
 * @returns {Array}
 */
function queryGadgetMetaListGetQuery (categoryId, filter, inboxClass, orderBy, bDesc, startPos, count, logger )
{
  var qCount = 'SELECT count(*) as CNT FROM inbox WHERE ';
  var q      = 'SELECT inbox.id, inbox.name, inbox.class, chart.type, inbox.description,operator.name, sysmodtime, list.type FROM inbox WHERE ';
  var qCondition = getInboxQuery();

  var qOrder = null;
  if ( orderBy && (orderBy.toLowerCase() === "updatetime") )
  {
    qOrder = " ORDER BY sysmodtime ";
  }
  else
  {
    qOrder = " ORDER BY inbox.name ";
  }

  qOrder += (bDesc)? "DESC " : "ASC ";
  if ( categoryId )
  {
    categoryId = sql_escape_string(categoryId);


    // Hope we can disable this assumption later
    if ( categoryId === MSG_ID_UNCATEGORIED )
      qCondition += ' AND ( null(report.category) ) ';
    else
      qCondition += ' AND ( report.category = "'+ categoryId + '" ) ';
  }

  if ( inboxClass )
  {
    inboxClass = sql_escape_string(inboxClass);

    if ( inboxClass.toUpperCase() == CHART_GRID )
    {
      qCondition += ' AND ( toupper(inbox.class) = "'+ INBOX_CLASS_GRID + '" ) AND ( null(list.type) or (list.type = "std") ) ';
    }
    else if ( inboxClass.toUpperCase() == CHART_TITLEDGRID )
    {
      qCondition += ' AND ( toupper(inbox.class) = "'+ INBOX_CLASS_GRID + '" ) AND (list.type="title") ';
    }
    else
    {
      qCondition += ' AND ( inbox.class = "'+ inboxClass + '" ) ';
    }
  }

  if ( filter )
  {
    var bIsNumeric = (parseInt(filter, 10).toString() === filter.toString());

    if ( bIsNumeric )
    {
      qCondition += ' AND ( ( inbox.name like "' + filter + ''+chr+'" ) OR ( inbox.id = ' + filter + ') ) ';
    }
    else
    {
      filter = sql_escape_string(filter);
      qCondition += ' AND ( toupper(inbox.name) like "' + filter.toUpperCase() + ''+chr+'" ) ';
    }
  }

  var nCount = 0;

  if ( qCondition )
  {
    qCount += qCondition;
  }

  qCondition += qOrder;
  if ( qCondition )
  {
    q += qCondition;
  }

  if ( g_logDebug )
    logger.debug("query: " + q );

  var ret = {
    "q" : q,
    "qCount" : qCount
  };

  return ret;
}

/**
 * @param {Number} categoryId
 * @param {String} queryStr the string to query
 * @param {String} inboxClass type of gadget, must be 'chart','pivot' or 'grid'
 * @param {String} orderBy, must be 'name' or 'updateTime'
 * @param {String} bDesc must be '0' or '1', '0' means false
 * @param {Number} start the start number for paging query
 * @param {Number} size the page size for paging query
 * @returns {Array}
 */
function queryGadgetMetaList(categoryId, filter, inboxClass, orderBy, bDesc, startPos, count, logger )
{
  var metaQuery = queryGadgetMetaListGetQuery(categoryId, filter, inboxClass, orderBy, bDesc, startPos, count, logger );
  var q = metaQuery.q;
  var qCount = metaQuery.qCount;

  var f = new SCFile("inbox");
  f.setSelectTop(500);
  var rc = f.doSelect(q);

  var ret = new Array();
  var i = 0;

  var globalOp = system.functions.scmsg( 60, MSG_CLASS_REPORT, [] );
  while ( rc == RC_SUCCESS )
  {
    if ( ( i >= startPos ) && ( i - startPos < count) )
    {
      var chartClass = null;
      var localizedInboxName = lib.localizeTable.getMessageText(f);
      var item = {
        "id"    : f.inbox_id,
        "type" : f.inbox_class,
        "@class": null,
        "name" : localizedInboxName == null ? f.inbox_name : localizedInboxName,
        "desc" : f.inbox_description,
        "operator" : null,
        "updateTime": null
      };
      var opName = f['operator.name'];
      if ( !opName || (opName === "%NONE%") )
        item.operator = globalOp;
      else
        item.operator = opName;

      // Need to format the date/time base on operator's timezone
      // Or if we convert a date/time by JSON, it would be convert to UTC time
      item.updateTime = _val(f.sysmodtime, 2);

      if ( item.type.toUpperCase() === INBOX_CLASS_CHART )
      {
        item.type = f.chart_type;
        chartClass = INBOX_CLASS_CHART.toLowerCase();
      }
      else if ( item.type.toUpperCase() === INBOX_CLASS_GRID )
      {
        if (f.list_type === 'title')
          item.type = CHART_TITLEDGRID.toLowerCase();
        else
          item.type = CHART_GRID.toLowerCase();
      }

      if ( !chartClass )
        chartClass = item.type;
      item['@class'] = chartClass;

      ret.push(item);
    }

    rc = f.getNext();
    i++;
  }

  rc = f.doSelect(qCount);
  var nTotalCount = f.CNT;

  var response = {
    "count": nTotalCount,
    "list" : ret
  };

  forceGC(true);

  return response;
}

function getInboxQuery()
{
  var q = "";

  if (system.functions.index("SysAdmin", vars['$lo.ucapex'])>0)
  {
    q = ' (null(report.disabled) or report.disabled=false) AND (inbox.class="chart" or inbox.class="pivot" or inbox.class="classList") ';

    if (lib.IDOL_Utilities.hasIDOLRight()==true)
    {
      q = ' (null(report.disabled) or report.disabled=false) AND (inbox.class="chart" or inbox.class="pivot" or inbox.class="classList" OR inbox.class="htamap") ';
    }

    return q;
  }

  var _denull = system.functions.denull;
  var _str = system.functions.str;
  var _nullsub = system.functions.nullsub;

  var groups = _denull(vars['$lo.groups']);
  var agnGrp = _denull(vars['$lo.pm.assignments']);

  var opName = system.functions.operator();

  var q = '(null(report.disabled) OR report.disabled=false) AND ' +
    '  (inbox.class="chart" OR inbox.class="pivot" OR inbox.class="classList") AND ' +
    '  (operator.name="' +vars['$lo.user.name']+ '" or operator.name="' + opName + '" OR ' +
    '  (inbox.manager= "' + opName + '" ) OR ' +
    '  (audience.type="everyone" ';

  if (lib.IDOL_Utilities.hasIDOLRight()==true)
  {
    q = '(null(report.disabled) OR report.disabled=false) AND ' +
    '  (inbox.class="chart" OR inbox.class="pivot" OR inbox.class="classList" OR inbox.class="htamap") AND ' +
    '  (operator.name="' +vars['$lo.user.name']+ '" or operator.name="' + opName + '" OR ' +
    '  (inbox.manager= "' + opName + '" ) OR ' +
    '  (audience.type="everyone" ';
  }

  if ( groups && (groups.getSize() > 0) )
    q += ' OR (audience.type="groups" and groups isin ' + _str(groups) + ') ';
  if ( agnGrp && (agnGrp.getSize() > 0) )
    q += ' OR (audience.type="assignmentgroups" and assignment.groups isin ' + _str(agnGrp) + ') ';

  q += ' OR (audience.type="role" and role="' + _nullsub(vars['$G.user.role'], "NONE")+'"))) ';

  return q;
}

function sql_escape_string (str)
{
  return str.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function (s) {
    switch (s) {
      case "\0":
        return "\\0";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\b":
        return "\\b";
      case "\t":
        return "\\t";
      case "\x1a":
        return "\\Z";
      case "\'":
        return s;
      default:
        return "\\" + s;
    }
  });
}

function getUncategoriedMsg()
{
  var cat = system.functions.scmsg( MSG_ID_UNCATEGORIED, MSG_CLASS_REPORT );

  if ( !cat || (cat.indexOf("Could not be found") >= 0) )
  {
    cat = MSG_ID_UNCATEGORIED;
  }

  return cat;
}

function queryCategories( queryStr, inboxClass, logger )
{
  // !!! TODO !!! Append auth filter
  var q = "select report.category, count(*) AS cnt from inbox where ";
  var qCond = getInboxQuery();
  if ( queryStr )
  {
    var bIsNumeric = (parseInt(queryStr, 10).toString() === queryStr.toString());

    if ( bIsNumeric )
    {
      qCond += ' AND ( ( inbox.name like "' + queryStr + ''+chr+'" ) OR ( inbox.id = ' + queryStr + ') ) ';
    }
    else
    {
      queryStr = sql_escape_string(queryStr);
      qCond += ' AND ( toupper(inbox.name) like "' + queryStr.toUpperCase() + ''+chr+'" ) ';
    }
  }

  if ( inboxClass )
  {
    inboxClass = sql_escape_string(inboxClass);

    if ( inboxClass.toUpperCase() == CHART_GRID )
    {
      qCond += ' AND ( toupper(inbox.class) = "'+ INBOX_CLASS_GRID + '" ) AND ( null(list.type) or (list.type = "std") ) ';
    }
    else if ( inboxClass.toUpperCase() == CHART_TITLEDGRID )
    {
      qCond += ' AND ( toupper(inbox.class) = "'+ INBOX_CLASS_GRID + '" ) AND (list.type="title") ';
    }
    else
    {
      qCond += ' AND ( inbox.class = "'+ inboxClass + '" ) ';
    }
  }

  q += qCond;
  q += " GROUP BY report.category HAVING count(*) > 0";
  q += " ORDER BY report.category ";

  var qCondNullCat = qCond + " AND null(report.category) ";
  var qNullCat = "SELECT inbox.type, count(*) AS cnt FROM inbox WHERE " + qCondNullCat + " GROUP BY inbox.type HAVING count(*) > 0";

  if ( g_logDebug )
    logger.debug("query: " + q);

  var f = new SCFile("inbox");
  var rc = f.doSelect(q);

  var result = new Array();
  var cat;
  var catMap1={};

  while ( rc == RC_SUCCESS )
  {
    // !!! TODO, to-many records
    cat = f.report_category;
    if ( cat )
    {
      var item = catMap1[cat];

      if ( !item )
      {
        item = {
          "id"    : cat,
          "name"  : null,
          "count" : f.cnt
        };
        item.name = getCategoryLocalName(item.id);
      }
      else
      {
        item.count += f.cnt;
      }

      catMap1[cat] = item;
    }
    else
    {
      var item = {
        "id"   : MSG_ID_UNCATEGORIED,
        "name" : getUncategoriedMsg(),
        "count": f.cnt
      }
      catMap1[MSG_ID_UNCATEGORIED] = item;
    }

    rc = f.getNext();
  } // while
  var totalCnt = 0;
  result = [];
  for (var cat in catMap1 )
  {
    totalCnt += catMap1[cat].count;
    result.push(catMap1[cat]);
  }

  if ( g_logDebug )
    logger.debug("Total count: " + totalCnt);

  return result;
}


function guessCategoriesByFilename( q )
{
  var f = new SCFile("inbox");
  var rc = f.doSelect(q);

  var cat;
  var catMap={};

  while ( rc == RC_SUCCESS )
  {
    var fname = f.inbox_type;
    cat = getCategoryOfFile(fname);

    if ( cat )
    {
      var item = catMap[cat];
      if ( !item )
      {
        item = {
          "id"    : cat,
          "name"  : null,
          "count" : f.cnt
        };
        item.name = getCategoryLocalName(item.id);
      }
      else
      {
        item.count += f.cnt;
      }
      catMap[cat] = item;
    }
    else
    {
      var item = catMap[fname];

      if ( !item )
      {
        item = {
          "id"    : fname,
          "name"  : libCmn.getCommonName(fname),
          "count" : f.cnt
        };
      }
      else
      {
        item.count += f.cnt;
      }

      catMap[fname] = item;
    }

    rc = f.getNext();
  }

  return catMap;
}
