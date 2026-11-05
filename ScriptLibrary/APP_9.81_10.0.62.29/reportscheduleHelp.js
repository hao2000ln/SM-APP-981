/**
 * @fileoverview  Handles functionality associated with reportscheduleDefinitions.
 */

var _str    = funcs.str;
var _denull = funcs.denull;
var _scmsg  = funcs.scmsg;
var $ = lib.c.$;

// -- logger ------------------------
//
var log = getLog("reportschedule");

/**
 *  This function get some Approval Details for the reportschedule records.
 *  It returns the content of the field passed as parameter
 *
 *  @param 	{string} 	id ID 	- the unique ID of the record
 *  @param 	{string} 	fieldname 		- the content of the field to return
 *  @returns {string} 	field content	- the content of the field
 */

function getApprovalDetails(id, fieldname)
{
  var fApproval = new SCFile( "Approval", SCFILE_READONLY);
  var rc        = "";
  var sql     = "unique.key=\""+id+"\" and file.name=\"reportscheduleDefinition\"";

  try {
    fApproval.setFields(fieldname);
    rc = fApproval.doSelect( sql );
    if( rc == RC_SUCCESS ) {
      fieldname = fieldname.replace(/\./g, "_");
      return fApproval[fieldname];
    }
  } catch( ex ) {
    log.error( "exception: " + ex );
  }
  return null;
}

function convertReportId2Array(sourceId, aryId, aryOld)
{
  var lng = sourceId.length();
  var intId;

  var i;
  for (i=0;i<lng;i++)
  {
    intId = funcs.val(sourceId[i],1);
    if (funcs.index(intId, aryOld)<=0) {
      aryId.push(intId);
    }
  }
}

function setupReportNames(aryDashboard, aryReport)
{
  var aryId = [];
  if (aryReport!=null) {
    convertReportId2Array(_denull(aryReport), aryId, vars["$rpsch.report.key"]);
  }
  if (aryDashboard!=null) {
    convertReportId2Array(_denull(aryDashboard), aryId, vars["$rpsch.dashboard.key"]);
  }

  if (aryId.length==0) {
    return;
  }

  var record = new SCFile("inbox", SCFILE_READONLY);
  var rc     = "";
  var sql    = "inbox.id isin "+_str(_denull(aryId))+"";
  var fields = ["inbox.id", "inbox.name", "inbox.class"];

  try {
    record.setFields(fields);
    rc = record.doSelect( sql );
    if( rc == RC_SUCCESS ) {
      
      do
      {
        if (record.inbox_class=="dashboard") {
          if (vars["$rpsch.dashboard.key"] && vars["$rpsch.dashboard.display"]) {
            vars["$rpsch.dashboard.key"].push(record.inbox_id);
            vars["$rpsch.dashboard.display"].push(record.inbox_name);
          }
        } else {
          if (vars["$rpsch.report.key"] && vars["$rpsch.report.display"]) {
            vars["$rpsch.report.key"].push(record.inbox_id);
            vars["$rpsch.report.display"].push(record.inbox_name);
          }
        }
      }while (record.getNext() == RC_SUCCESS);
    }
  } catch( ex ) {
    log.error( "exception: " + ex );
  }
}

function setScheduledCaption()
{
  var ObjFile = vars["$L.file"];

  vars["$rpsch.histories.caption"] = _scmsg("caption.histories","reportschedule");

  if (ObjFile == null || ObjFile["rule.arbitrary"]==true)
  {
    vars["$rpsch.rule.caption"] = _scmsg("caption.rule.arbitrary","reportschedule");
  } else {
    vars["$rpsch.rule.caption"] = _scmsg("caption.rule."+ObjFile["rule.type"],"reportschedule");
  }

  if (ObjFile) {
    vars["$rpsch.displayRule.readonly"] = ( ObjFile.current_phase === "scheduled" ) || ( ObjFile.current_phase === "retired" );
    vars["$rpsch.html.history"] = getHistoryRecords( ObjFile.id );
    vars["$rpsch.html.occurrences"] = getOccurrencesDetails(ObjFile.id, true);
  }

  vars["$rpsch.occurrences.caption"] = _scmsg("caption.occurrences.1","reportschedule", $.createSCArray(vars["$rpsch.occurrences.count"]));
}

function getOperatorContactNames( arrLoginNames )
{
  var ret = new SCDatum();
  ret.setType(8);

  var i;
  var length = arrLoginNames.getSize();
  for ( i = 0; i < length; i++ )
  {
    ret.push( getContactName(arrLoginNames[i]) );
  }

  return ret;
}

function getContactName( loginName )
{
  var q = 'SELECT contact.name FROM operator WHERE name ="' + loginName + '"';
  var f = new SCFile("operator", SCFILE_READONLY);
  var rc = f.doSelect(q);

  var ret = loginName;
  if ( rc == RC_SUCCESS )
  {
    ret = f.contact_name;
  }

  return ret;
}

function setRetiredValues()
{
  var ObjFile = vars["$L.file"];
  if (ObjFile) {
    vars["$rpsch.displayRule.readonly"] = ( ObjFile.current_phase === "scheduled" ) || ( ObjFile.current_phase === "retired" );
  }

  vars["$L.isSysAdmin"] = false;

  if (ObjFile == null || ObjFile["rule.arbitrary"]==true)
  {
    vars["$rpsch.rule.caption"] = _scmsg("caption.rule.arbitrary","reportschedule");
  } else {
    vars["$rpsch.rule.caption"] = _scmsg("caption.rule."+ObjFile["rule.type"],"reportschedule");
  }
}

function getCSS()
{
  var style;
  style =		"<style> ";
  style +=	"body{border:0 0 0 0;margin:0;padding:0;font-family: Verdana, Arial, Helvetica, sans-serif;}";
  style +=	".error{color: #454323;background: white;}";
  style +=	".error td{padding:1 2 1 1;color: red;line-height: 12;}";
  style +=	".main{width:100%;font-size: 10;text-align: left}";
  style +=	".main th{font-weight: bold;padding:4;background: #E0E0E0;}";
  style +=	"th.rowtitle{font-weight: bold;padding:4;background: #99BBE8;}";
  style +=	".oddRow{background: #edf3fe;color: black}";
  style +=	".evenRow{background: white;color: black}";
  style +=	".message{background: white;color: blue}";
  style +=	"</style>";

  return style;
}

/**
 * This function en-/decodes the link line
 *
 * @param   {String} sLink
 * @param   {String} sType 	- en = encode; de = decode
 * @returns {String} sLink
 *
 * @example Called by: ScriptLib, displayevent 32099
 *
 */
function codeLink(sLink, sType) {
  if (sType == "en") {
    sLink = sLink.replace(/\(/g, "::opnb1::");
    sLink = sLink.replace(/\)/g, "::clsb1::");
    sLink = sLink.replace(/\[/g, "::opnb2::");
    sLink = sLink.replace(/\]/g, "::clsb2::");
    sLink = sLink.replace(/\*/g, "::star1::");

  } else if (sType == "de") {
    sLink = sLink.replace(/::opnb1::/g, "(");
    sLink = sLink.replace(/::clsb1::/g, ")");
    sLink = sLink.replace(/::opnb2::/g, "[");
    sLink = sLink.replace(/::clsb2::/g, "]");
    sLink = sLink.replace(/::star1::/g, "*");

  }
  return sLink;
}

/**
 *  This function shows and filters the occurences for a reportscheduleDefinition in HTML view
 *
 *  @param    {File}     fRecord 	- the timeperiod definition
 *  @param    {Boolean}  bEditable 	- update rights, typically $L.tableAccess.update
 *
 *  @returns {String}   sHtmlReturn - the HTML String for occurrences
 *
 */

function getOccurrencesDetails(definitionId, bEditRights) {
  //initialize variables
  var dDate = new XMLDate(new Date());
  dDate = dDate.getSCDateTimeString();

  var sCR 			= "\n";
  var iLineCount 	= 0;
  var sHtmlReturn 	= getCSS();

  //initialise occurrences file
  var fOccurrence = new SCFile( "reportscheduleTask", SCFILE_READONLY);
  var sQuery 		= 'definition.id="' + definitionId + '" and (current.phase = "created") ';

  //prepare HTML view 	  
  sHtmlReturn += "<table class=\"main\">" + sCR;
  var sAction = "";

  // Table header     
  sHtmlReturn += "<tr><th width=\"20\">" + _scmsg(123, "reportschedule") + "</th><th>" +  // No.
    _scmsg(125, "reportschedule") + "</th><th>" +  // Start Date
    _scmsg(127, "reportschedule") + "</th>";   	  // active
  sHtmlReturn += "</tr>"; // closing tag for header

  fOccurrence.setFields(['definition.id', 'start.date', 'active','keep.active']);
  fOccurrence.setOrderBy(['start.date'], [SCFILE_ASC]);

  var rc = fOccurrence.doSelect( sQuery );
  if( rc == RC_SUCCESS ) {
    // build HTML
    var sRowClass = iLineCount%2==0 ? "evenRow" : "oddRow";
    iLineCount++;  // counter for even / odd row
    sHtmlReturn += "<tr>";
    sHtmlReturn += "<td class=\""+sRowClass+"\">" + _str(iLineCount) + "</td>";
    sHtmlReturn += "<td class=\""+sRowClass+"\">" + _str(fOccurrence.start_date) + "</td>";

    var display;
    fOccurrence.active == true ? display=_scmsg("111", "reportschedule") : display=_scmsg("112", "reportschedule");

    //check if status column is editable
    sHtmlReturn += "<td class=\""+sRowClass+"\">" + _str(display) + "</td>";

    sHtmlReturn += "</tr>" + sCR;
  } else {
    sHtmlReturn += "<tr><td class=\"evenRow\" colspan=\"6\">" + _scmsg("113", "reportschedule") + "</td></tr>" + sCR;
  } // if record

  sHtmlReturn += "</table>" + sCR;

  vars["$rpsch.occurrences.count"] = iLineCount;

  return sHtmlReturn;
}

/**
 * Get history records in recent 30 days
 * @param definitionId
 * @returns {*}
 */
function getHistoryRecords( definitionId )
{
  var iLineCount    = 0;
  var sCR 			    = "\n";
  var sHtmlReturn 	= getCSS();

  var fHis = new SCFile( "reportScheduleHistory", SCFILE_READONLY);
  var sQuery 		= 'definition.id="' + definitionId + '" and (finished.time >= tod() - \'30 00:00:00\') ';

  // prepare HTML view
  sHtmlReturn += "<table class=\"main\">" + sCR;

  // Table header
  sHtmlReturn += "<tr><th width=\"20%\">" + _scmsg(125, "reportschedule") + "</th><th>" +  // Start Date
    _scmsg(128, "reportschedule") + "</th><th>" +   // Succeed
    _scmsg(129, "reportschedule") + "</th>";   	    // Elapse
  sHtmlReturn += "</tr>"; // closing tag for header

  fHis.setFields(['id', 'start.date', 'succeed','duration']);
  fHis.setOrderBy(['start.date'], [SCFILE_ASC]);

  var strSucceed = _scmsg("succeed", "reportschedule");
  var strFailed  = _scmsg("failed", "reportschedule");

  var rc = fHis.doSelect( sQuery );
  if( rc != RC_SUCCESS )
  {
    sHtmlReturn += "<tr><td class=\"evenRow\" colspan=\"6\">" + _scmsg("114", "reportschedule") + "</td></tr>" + sCR;
  }

  while ( rc == RC_SUCCESS )
  {
    // build HTML
    var sRowClass = iLineCount%2 == 0 ? "evenRow" : "oddRow";
    sHtmlReturn += "<tr>";
    sHtmlReturn += "<td class=\""+sRowClass+"\"><a href=\"scactivelink://reportScheduleHistory:id=&quot;" + fHis.id + "&quot;\">" + _str(fHis.start_date) + "</a></td>";

    var strStatus = ( fHis.succeed )? strSucceed : strFailed;
    sHtmlReturn += "<td class=\""+sRowClass+"\">" + strStatus + "</td>";
    sHtmlReturn += "<td class=\""+sRowClass+"\">" + _str(fHis.duration) + "</td>";

    sHtmlReturn += "</tr>" + sCR;
    iLineCount++;
    rc = fHis.getNext();
  }

  sHtmlReturn += "</table>" + sCR;
  return sHtmlReturn;
}

function isGeneratePDFByDefault()
{
  var enabled = lib.settings.getSettingValue( "Report", "Export.file.pdf" );
  return (!enabled || (enabled.toString() === "false")) ? false: true;
}

function isGenerateHtmlByDefault()
{
  var enabled = lib.settings.getSettingValue( "Report", "Export.file.html" );
  return (!enabled || (enabled.toString() === "false")) ? false: true;
}

function getMaxDashboardPerTask()
{
  var nMax = lib.settings.getSettingValue( "Report", "Export.maxReportPerTask" );
  if ( !nMax ) {
    nMax = 5;
  }

  return funcs.val(nMax, 1);
}

function setDefaultProperties()
{
  if (vars.$L_file == null) {
    return;
  }
  
  vars.$L_file.page_direction = funcs.nullsub(vars.$L_file.page_direction, "portrait");
  vars.$L_file.file_type_pdf  = isGeneratePDFByDefault();
  vars.$L_file.file_type_html = isGenerateHtmlByDefault();
}

function testFolderExists( folderPath )
{
  var ret = false;
  if ( folderPath )
  {
    if ( folderPath[folderPath.length - 1] == "\\" || folderPath[folderPath.length - 1] == "/") {
      folderPath = folderPath.substring(0, folderPath.length - 1);
    }

    ret = funcs.isfileexist(folderPath);
  }

  return ret;
}
