var logger = getLog('RunRestfulGwcustominteractionlist');
var $ = lib.c.$;
var makeSort=lib.RestfulQuery.makeSort;
var fastCount=lib.GatewayAPI_RAD.fastCount;

function POST(req, res) {
    var gwcustominteraction = req.body.gwcustominteraction;
    var query = gwcustominteraction.query || 'true';
    var start = +gwcustominteraction.start || 1;
    var count = +gwcustominteraction.count || 1;
    var sortinput = gwcustominteraction.sort;
    var layout = gwcustominteraction.layout || 'incident.id';
    var fieldList;
    if (layout) {
      fieldList = layout.replace(/\s/g, '.').split(',');
    }
    if (vars.$lo_company) {
        if (query == 'NULL' || query == 'null') {
          query = 'true';
        }
        query  = '(' + query + ') and company="' + vars.$lo_company + '"';
    }
    if (sortinput != null) {
        var sort = makeSort(sortinput,{});
        var sortFields=sort.sort;
        var sortSeqs=sort.sortorder;
        var returnFile = $("incidents", SCFILE_READONLY).setFields(fieldList).setOrderBy(sortFields,sortSeqs).select(query);
    }  else {
        var returnFile = $("incidents", SCFILE_READONLY).setFields(fieldList).select(query);
    }
    var rc = returnFile.rc;
    if (rc != RC_SUCCESS && rc != RC_NO_MORE) {
        logger.error('Query failed by expression: ' + query);
        res.status(400).message('query failed');
        return;
    }
    var f = returnFile.scfile;
    var totalCount = fastCount(f);
    var result = [];
    //skip start record
    var recordIndex = 0;
    while (rc == RC_SUCCESS && recordIndex < start - 1) {
      recordIndex++;
      rc = f.getNext();
    }
    recordIndex = 0;
    
    var globallist = [];
    for (var index =0; index <fieldList.length; index++) {
      var globallistName = funcs.policyread('incidents', fieldList[index] ,'globallist');
      if (globallistName) {
        globallist[index] = getGlobalList(globallistName);
      }
    }
    while (rc == RC_SUCCESS && recordIndex < count) {
      var entity = {};
      for (var index =0; index <fieldList.length; index++) {
        var column = fieldList[index];
        entity[column.replace(/\./g, ' ')] = getValue(globallist[index], f[column]);
      }
      result.push(entity);
      rc = f.getNext();
      recordIndex ++;
    }
    res.send({entities: result, '@start': start, '@count': result.length, '@totalcount': totalCount});
}
function getValue(globallist, fieldValue) {
  if (globallist) {
    var values = globallist.values;
    var labels = globallist.labels;
    if (values != null && labels != null) {
            for (var i = 0; i < values.length(); i++) {
                if (values[i] == fieldValue)
                    return labels[i];
            }
     }
  }
  return formatValue(fieldValue);
}
/**
 * format the value for diplay.
 * for example, array need to be formatted.
 */
function formatValue(value) {
    var display = "";
    var type = funcs.type(value);
    if (type == lib.DataTypeConst.typeArray()) {
        for (var i in value) {
            if (value[i]) {
                if (display!="") {
                    display += "\n";
                }
                display += formatValue(value[i]);
            }
        }
        
    } else if (type == lib.DataTypeConst.typeNumber() || type == lib.DataTypeConst.typeBoolean()) {
      return value;
    } else if (type == lib.DataTypeConst.typeDateTime()) {
      return value.getTime();
    } else {
        display = system.functions.str(value);
    }
    return display;
}

function getGlobalList(globallistName) {
    var globallist = new SCFile("globallists");
    var rc = globallist.doSelect("name=\"" + globallistName + "\"");
    if (rc == RC_SUCCESS) {
        var listvariable = globallist["list.variable"];
        var dispvariable = globallist["display.variable"];
        var values = lib.globalListTools.getGlobalListValue(listvariable);
        var labels = lib.globalListTools.getGlobalListValue(dispvariable);
        return { 
        values: values,
        labels: labels
        };
    } else {
        return null;
    }
}

function authorize() {
    return true;
}
