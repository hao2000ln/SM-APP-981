var $ = lib.c.$;
/**
 * Genereate query expression for searching reports.
 *
 * @return {string} query expression
 */
function buildQuery() {
    var reportSet = vars["$report.set"];
    var selectTable = vars["$L.select.file"];
    var selectField = vars["$L.select.field"];
    var defintionType = vars["$L.definition.type"];
    var relationType = vars["$L.relation.type"];
    var sql = "true";
    if (!$.isEmpty(selectTable)) {
        sql += ' and (source.file#"' + selectTable + '" or target.file#"' + selectTable +'")';
    } 
    if (!$.isEmpty(selectField)) {
        sql += ' and (source.field#"' + selectField + '" or target.field#"' + selectField +'")';
    }
    if( !$.isEmpty(reportSet) ){
        sql += ' and (batch.id="' + reportSet + '")';
    }
    if( !$.isEmpty(defintionType) ){
        sql += ' and (definition.type="' + defintionType + '")';
    }
    if( !$.isEmpty(relationType) ){
        sql += ' and (relation.type="' + relationType + '")';
    }
    return sql;
}
/**
 * Get tables which can be validated.
 *
 * @return {Array} main tables
 */
function getMasterTables() {
  var ret = [];
  var datadict = new SCFile("datadict", SCFILE_READONLY);
  datadict.setFields(["name"]);
  var rc = datadict.doSelect("main.table=true");
  while ( rc == RC_SUCCESS) {
    ret.push(datadict.name);
    rc = datadict.getNext();
  }
  return ret;
}
/**
 * Check whether tables can be validated.
 * @param {Array} names - table names
 * @return {boolean} whether tables can be verified.
 */
function valid(names) {
    var files = getMasterTables();
    var length = system.functions.lng(names);
    for (var i = 0; i < length; i++) {
        if (system.functions.index(names[i], files) == 0) {
            system.functions.msg(system.functions.scmsg(2, "refCheck", [names[i]]), 2);
            return false;
        }
    }
    return true;
}
/**
 * Verify records in tables.
 * @return {boolean} whether tables are scheduled successfully.
 */
function buildRefCheck() {
    var ret = false;
    var refCheckFileNames = vars["$refCheck.files"];
    var includeBlob = vars["$include.blob"];
    if( !$.isEmpty(refCheckFileNames)){
        try {
            var names = refCheckFileNames.toArray();
            names = removeDuplicate( names );
            if (names.length > 0 && valid(names)) {
                var refReport = $("#refCheckService");
                if (!refReport.isAreadyInQueue(names)) {
                    refReport.reset();
                    // set the "scheduled" flag
                    refReport.setStatus( "2" );
                    refReport.setFileNames( names );
                    if( includeBlob == "true" ) {
                        refReport.setLobCheck( true );
                    }
                    refReport.setCurrentUser( system.functions.operator() );
                    refReport.saveStatistics();
                    refReport.sendMsgToUser( 29, refReport.INFO, system.functions.operator(), names );
                    ret = true;
                } else {
                    // already in queue, quit.
                    system.functions.msg(system.functions.scmsg(3,"refCheck", [names]), 2);
                }
                refReport.reset();
                // Check whether scheduler for reference check is started or not.
                if (!getRefCheckProcState()) {
                  system.functions.msg(system.functions.scmsg(5,"refCheck"), 2);
                }
            }
        } catch (e) {
            print(e);
        }
    } else {
        system.functions.msg(system.functions.scmsg(1,"refCheck"), 2);
    }
    return ret;
}
/**
 * Build value list and display list for report set
 *
 */
function resetReportSet() {
    vars["$L.report.set.value.list"] = new Array();
    vars["$L.report.set.display.list"] = new Array();
    var _file = new SCFile("refCheckStatistic");
    _file.setOrderBy(["batch.id"], [SCFILE_DSC]);
    var rc = _file.doSelect("true");
    while(rc == RC_SUCCESS) {
        vars["$L.report.set.value.list"].push(_file.batch_id);
        var name = "[" + _file.batch_id + "] ";
        var fields = _file.filename_list.toArray();
        name+= fields.slice(0,3).join(", ")
        if (fields.length > 3) {
            name +="...";
        }
        name+= " - " + lib.tzFunctions.convertDatetoString(_file.start_time, system.functions.get_dateformat());
        name+= " - " + lib.tzFunctions.convertDatetoString(_file.end_time, system.functions.get_dateformat());

        vars["$L.report.set.display.list"].push(name);
        rc = _file.getNext();
    }
}
/**
 * Create session variables for report status list
 *
 */
function buildStatusList() {
    vars.$batch_id = new Array();
    vars.$start_time = new Array();
    vars.$end_time = new Array();
    vars.$filename_list = new Array();
    vars.$invalid_count = new Array();
    vars.$status = new Array();
    vars.$username = new Array();
    vars.$checkblob = new Array();
    var _file = new SCFile("refCheckStatistic");
    var sortFields, sortOrder;
    if (vars.$sortField == null) {
        sortFields = ["status", "batch.id"];
        sortOrder = [SCFILE_ASC, SCFILE_DSC];
    } else {
        sortFields = [vars.$sortField];
        sortOrder = [vars.$sortOrder];
    }
    _file.setOrderBy(sortFields, sortOrder);
    var rc = _file.doSelect("true");
    while(rc == RC_SUCCESS) {
        vars.$batch_id.push( _file["batch.id"]);
        vars.$start_time.push(_file["start.time"]);
        vars.$end_time.push(_file["end.time"]);
        vars.$filename_list.push(_file["filename.list"].toArray().join(' / '));
        vars.$invalid_count.push(parseFloat(_file["batch.count"]) + parseFloat(_file["lob.count"]));
        vars.$status.push(_file["status"]);
        vars.$username.push(_file["user.name"]);
        vars.$checkblob.push(_file["check.blob"]);
        rc = _file.getNext();
    }
}

/**
 * Purge all records in reference checking result
 */
function purgeAllReports() {
    var file = new SCFile("refCheckResult");
    var rc = file.doPurge("true");
    file = new SCFile("refCheckStatistic");
    rc = file.doPurge("true");
    file = new SCFile("refCheckValueList");
    rc = file.doPurge("true");
}

/**
 * Purge all records for chart data
 */
function purgeChartData(){
    var file = new SCFile("refCheckResultChart");
    var rc = file.doPurge("true");
}

/**
 * Genereate records for rendering chart data
 */
function generateChartData(record) {
    if (record != null) {
        if (record["source.record.count"] > 0) {
            var file = new SCFile("refCheckResultChart");
            var number = record["source.record.count"] - record["invalid.record.count"];
            if (number > 0) {
                file.number = number;
                file.label = system.functions.scmsg(24, "refCheck");
                file.doInsert();
            }
            number = record["invalid.record.count"];
            if (number > 0) {
                file.number = number;
                file.label = system.functions.scmsg(23, "refCheck");
                file.doInsert();
            }
        }
    }
}
/**
 * Delete reports
 */
function deleteReports(ids) {
  if (ids != null) {
    for (var i = 0; i < ids.length; i++) {
      var q = "batch.id=\"" + ids[i] + "\"";
      lib.c.$("refCheckResult").select(q).
        iterate(
          function (record) {
             new SCFile("refCheckValueList").doPurge("external.id=\"" + record.id + "\"");
             record.doDelete();
          }
        );
      new SCFile("refCheckStatistic").doPurge(q);
    }
  }
}
/**
 * remove duplicate and empty elements in array
 */
function removeDuplicate(oldArray) {
    var newArray=[];
    var m = oldArray.length;
    for(var i=0; i < m; i++) {
        if (oldArray[i] == null || oldArray[i] == "") {
          continue;
        }
        var flag=true;
        var n = newArray.length;
        for(var j=0; j < n; j++) {
            if(newArray[j] == oldArray[i]){
                flag = false;
            }
        }
        if(flag) {
            newArray[n] = oldArray[i];
        }
    }
    return newArray;
}
/**
 * Get fields in Unique Key
 */
function getFieldInUnique(table) {
    var file = new SCFile("dbdict");
    var rc = file.doSelect('name="' + table + '"');
    if (rc == RC_SUCCESS) {
        var len = system.functions.lng(file.key);
        for (var i = 0; i< len; i++) {
          if (file.key[i].flags == 28) {
            return file.key[i].name.toArray();
          }
        }
        for (var i = 0; i< len; i++) {
          if (file.key[i].flags == 12) {
            return file.key[i].name.toArray();
          }
        }
    }
    return [];
}

function getCSS()
{

    var style;
    style =		"<style> ";
    style +=	"body{border:0 0 0 0;margin:0;font-size:12px;padding:0;font-family: HPSimplified, Arial, Helvetica, sans-serif;}";
    style +=	".error{color: #454323;background: white;}";
    style +=	".error td{padding:1 2 1 1;color: red;line-height: 12;}";
    style +=	".main{width:100%;font-size: 12px;text-align: left}";
    style +=	".main th{font-weight: bold;padding:4;background: #E0E0E0;}";
    style +=	"th.rowtitle{font-weight: bold;padding:4;background: #99BBE8;}";
    style +=	".oddRow{background: #edf3fe;color: black}";
    style +=	".evenRow{background: white;color: black}";
    style +=	".message{background: white;color: blue}";
    style +=	"</style>"

    return style;

}
/**
 * Get field caption
 * @param {String} file name
 * @param {Array} field list
 * @return {Array} field caption.
 */
function getFieldCaption(filename, fields) {
    var datadict = new SCFile("datadict");
    var rc = datadict.doSelect("name=\"" + filename + "\"");
    var captions = [];
    if (rc == RC_SUCCESS) {
        for (var i=0;i < fields.length; i++) {
            var f =  fields[i];
            if (f.lastIndexOf(",") > -1) {
                f = f.substring(f.lastIndexOf(",") + 1);
            }
            var idx = system.functions.index(f, datadict.fields);
            if (idx > 0 ) {
                captions. push(datadict.captions[idx - 1]);
            } else {
                captions.push(f);
            }
        }
    } else {
        return fields;
    }
    return captions;
}

/**
 *Check whether this field in table is in lob
 *@param {string} table - table name
 *@param {string} field - field name
* @return {boolean} in lob or not
 */
function isInLob(table, field) {
  var relationRecord = new SCFile("relation", SCFILE_READONLY);
  var query = ["(source.file=\"",
                table,
                "\" and source.field=\"",
                field,
                "\" and source.sqlfield like \"In LOB*\")",
                " or (target.file=\"",
                table,
                "\" and target.field=\"",
                field,
                "\" and target.sqlfield like \"In LOB*\")"
                ].join("");
  var rc = relationRecord.doSelect(query);
  return RC_SUCCESS == rc;
}
/**
 * Get sql expression for show all invalid records.
 *
 * @param {SCFile} file - SCFile for refCheckResult.
 * @return {string} sql expression
 */
function getSourceTableSQL(file) {
  file = file || null;
  if (file == null) {
    file == vars.$L_file;
  }
  var query = "false";
  if (file.relation_type != "E") {
    var inLob = isInLob(file.source_file, file.source_field);
    if (inLob) {
      var arr = [];
      var _f = new SCFile("refCheckValueList", SCFILE_READONLY);
      var rc = _f.doSelect("external.id=\"" + file.id  + "\"");
      _f.setFields(["source.value"]);
      while ( rc == RC_SUCCESS) {
        var source_value = _f.source_value;
        if (system.functions.index(source_value, arr) == 0) {
          arr.push(source_value);
          if (arr.length >= 1000) break;  // only show recods for the first 1000 values
        }
        rc = _f.getNext();
      }
      if (arr.length > 0) {
        vars.$lo_refValueList = arr;
        query = file.source_field + " isin $lo.refValueList";
      }
    } else {
      query = ["select * from ", 
                  file.source_file,
                  " where ",
                  file.source_field,
                  " isin ( select source.value from refCheckValueList where external.id=\"",
                  file.id,
                  "\")"].join("");
    }
  } else {
    // if "Value in First Unique Key is null"
    query = file.definition_query;
  }
  return query;
}
/**
 * Get invalid record count of source table.
 * @param {SCFile} file - SCFile for refCheckResult.
 * @return {number} record count
 */
function getSourceTableRecordCount(file) {
  file = file || null;
  if (file == null) {
    file == vars.$L_file;
  }
  var query = getSourceTableSQL(file);
  var file = new SCFile( file.source_file, SCFILE_READONLY);
  return file.doCount( query);
}
/**
 * Generate label for related records when record num is larger than 100
 * @param {SCFile} file record
 * @return {string} label
 */
function getLabelforRelatedRecords(file) {
    if (file == null) {
        return "";
    }
    var count = file.invalid_record_count;
    if ( count > 100) {
      return "100 / " + count;
    }
    return "";
}
/**
 * Generate html view when display report.
 * @return {string} html view
 */
function generateHtml(record) {
    var default_html = "";
    var html =  getCSS();
    if (record == null || record.source_file == null) {
        return default_html;
    }
    vars.$L_query = getSourceTableSQL(record);
    var file = new SCFile( record.source_file, SCFILE_READONLY);
    var fields = getFieldInUnique(record.source_file);
    if (system.functions.index(record.source_field, fields) == 0) {
      fields.push(record.source_field);
    }
    for (var i = 0; i < fields.length; i++) {
      var lastIndex = fields[i].lastIndexOf(",");
      if (lastIndex > -1) {
        fields[i] = fields[i].substring(lastIndex + 1);
      }
    }
    file.setFields( fields );
    var rc = file.doSelect( vars.$L_query);
    if (rc != RC_SUCCESS) {
        return default_html;
    }

    html += "<Table class=\"main\"><TR>";
    var captions = getFieldCaption(record.source_file, fields);
    for (var j = 0; j<fields.length; j++) {
        html += "<TH>" + captions[j]+ "</TH>"
    }
    html += "<TR>";
    var index=0;
    // only display first 100 records
    while(rc == RC_SUCCESS && index < 100) {
        index ++;
        if (index % 2 ==0) {
            html += "<TR class=\"oddRow\">";
        } else {
            html += "<TR class=\"evenRow\">";
        }
        for (var j = 0; j<fields.length; j++) {
          var v = file[fields[j]];
          if (v != null && v.toArray) {
            v = v.toArray().join(" | ");
          } else if ( v == null) {
            v = "";
          }
          html+= "<TD>" + v + "</TD>"
        }
        html + "</TR>";
        rc = file.getNext();
    }
    html += "</Table>";
    return html;
}


function getRefCheckProcState()
{
  var result = false;
  var procs = new SCDatum();
  procs.setType(8);     //type array
  procs = system.functions.processes();
  var procsLen = procs.length();
  for (var procsCount=0; procsCount < procsLen; procsCount ++)
  {
    if (procs[procsCount+.3] == "refcheck")
    {
      result = true;
    }
    
  }
  return result;  
}
