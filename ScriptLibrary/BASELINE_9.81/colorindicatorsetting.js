
/**
*  This functions is used for color indicator setting
*
*
*/

var $ = lib.c.$;

function getCSS()
{

    var style;
    style =		"<style> ";
    style +=	"body{border:0 0 0 0;margin:0;font-size:14px;padding:0}";
    style +=	".error{color: #454323;background: white;}";
    style +=	".error td{padding:1 2 1 1;color: red;line-height: 12;}";
    style +=	".main{width:100%;font-size: 12px;text-align: left}";
    style +=	".main th{font-size: 14px; font-weight: normal;padding:0;background: #ebebeb;border-right: solid 1px #888;border-bottom: solid 1px #888;text-align: left;}";
    style +=	"th.rowtitle{font-weight: bold;padding:0;background: #99BBE8;}";
    style +=	".main td{border-bottom: 1px solid #ededed}";
    style +=	"</style>"

    return style;

}

function getGlobalList(tablename, fieldname) {
  // get global list from datadict
  if (tablename == null || fieldname == null) {
    return null;
  }
  var datadict = $("datadict").select('name="' + tablename + '"').uniqueResult();
  if (datadict != null) {
    var index = system.functions.index(fieldname, datadict.fields);
    if (index > 0) {
      var gl = datadict.globallist[index - 1];
      if (gl != null) {
        return $("globallists").select('name="' + gl + '"').uniqueResult();
      }
    }
  }
  return null;
}

function getDisplayValue( v, gl) {
  if (gl == null || v == null) return v;
  if (gl.list_variable != null) {
    var valueList = vars[gl["list.variable"]];
    var index = system.functions.index(v, valueList);
    if (index > 0 && gl.display_variable != null && vars[gl["display.variable"]] != null) {
      return vars[gl["display.variable"]][index - 1]
    }
  }
  return v;
}

// Get field names and captions for dbdict and datadict tables.
function getFields4Dict(tablename) {
  if (tablename == "datadict" || tablename == "dbdict") {
    vars.$L_com_list  = $("#datadictService").getAvailableFields(tablename);
    var returnCode;
    system.functions.rtecall("sort", returnCode, vars.$L_com_list, 1, 0);
    vars.$fieldNames = vars.$L_com_list[0];
    vars.$fieldCaptions = vars.$L_com_list[1];
  }
}

function codeLink(sLink, sType) {

       if (sType == "en") {
             sLink = sLink.replace(/\(/g, "::opnb1::");
             sLink = sLink.replace(/\)/g, "::clsb1::");
             sLink = sLink.replace(/\[/g, "::opnb2::");
             sLink = sLink.replace(/\]/g, "::clsb2::");
             sLink = sLink.replace(/\*/g, "::star1::");
             sLink = sLink.replace(/\\/g, "::slas0::");
             sLink = sLink.replace(/\?/g, "::ques3::");
           return sLink;
       } else if (sType == "de") {

             sLink = sLink.replace(/::opnb1::/g, "(");
             sLink = sLink.replace(/::clsb1::/g, ")");
             sLink = sLink.replace(/::opnb2::/g, "[");
             sLink = sLink.replace(/::clsb2::/g, "]");
             sLink = sLink.replace(/::star1::/g, "*");
             sLink = sLink.replace(/::slas0::/g, "\\");
             sLink = sLink.replace(/::ques3::/g, "?");
           return sLink;
       }
}


function quoteText(sText) {
  sText = sText.replace(/&/g, "&amp;");
  sText = sText.replace(/\>/g, "&gt;");
  sText = sText.replace(/\</g, "&lt;");
  sText = sText.replace(/\"/g, "&quot;");
  sText = sText.replace(/\'/g, "'");
  sText = sText.replace(/\//g, "/");  
  return sText;
}
function unquoteText(sText) {
  sText = sText.replace(/&gt;/g, ">");
  sText = sText.replace(/&lt;/g, "<");
  sText = sText.replace(/&quot;/g, "\"");
  sText = sText.replace(/&amp;/g, "&");
  return sText;
}
function list(record) {
  if(record.file=='sla') {
    return listSlmStatus(record);
  }
  
  if (record != null) {
    var html =  getCSS();
    html += "<table class=\"main\" style=\"border-spacing: 0px;\">\n";
    html += "<TR>";
    html += "<TH width='20%' style=\"padding-left: 2px;padding-right: 2px;\">" + system.functions.scmsg(1, "colorindicatorsetting") + "</TH>";
    html += "<TH width='20%' style=\"padding-left: 2px;padding-right: 2px;\">" + system.functions.scmsg(2, "colorindicatorsetting") + "</TH>";
    html += "<TH width='15%' style=\"padding-left: 2px;padding-right: 2px;\">" + system.functions.scmsg(3, "colorindicatorsetting") + "</TH>";
    html += "<TH width='15%' style=\"padding-left: 2px;padding-right: 2px;;\">" + system.functions.scmsg(4, "colorindicatorsetting") + "</TH>";
    html += "<TH width='20%' style=\"padding-left: 2px;padding-right: 2px;\">" + system.functions.scmsg(5, "colorindicatorsetting") + "</TH>";
    html += "<TH style=\"border-right: none;\">&nbsp;</TH>";
	html += "</TR>";
	var length = system.functions.lng(record.value);
	var gl = getGlobalList(record.file, record.field);
	for (var i= 0; i< length; i++) {
	  var v = record.value[i];
	  if (v == null) continue;
	  var f = record.fgcolor[i];
	  var b = record.bgcolor[i];
      html += "<TR><TD>" + quoteText("" + v) + "</TD>";
      var displayText = quoteText(getDisplayValue(v, gl));
      html += "<TD>" + displayText + "</TD>";
      html += "<TD>" + (f?f:"&nbsp;") + "</TD>";
      html += "<TD>" + (b?b:"&nbsp;") + "</TD>";
      html += "<TD style=\"" + (b?"background-color:" + b + ";" : "")
                     + (f?"color:" + f : "") + "\">" + displayText + "</TD>";
      html += "<TD>";
      var codelink = codeLink(encodeURIComponent(v), "en");
      html += "<a href=\"scactivelink://edit:"+ codelink +"\">" + system.functions.scmsg(6, "colorindicatorsetting") + "</a>";
      html += "&nbsp;<a href=\"scactivelink://remove:"+ codelink +"\">" + system.functions.scmsg(7, "colorindicatorsetting") + "</a>";
      html += "</TD>";
	  html += "</TR>";
	}
	html += "</table>";    

	return html;
  }
}


function listSlmStatus(record) {
    if (record != null) {
        var html = getCSS();
        html += "<table class=\"main\" style=\"border-spacing: 0px;\">\n";
        html += "<tr>";
        html += "<th width='20%' style=\"padding-left: 2px;padding-right: 2px;\">" + funcs.scmsg(8, "colorindicatorsetting") + "</th>"; // Type
        html += "<th width='20%' style=\"padding-left: 2px;padding-right: 2px;\">" + funcs.scmsg(9, "colorindicatorsetting") + "</th>"; // Color
        html += "<th width='20%' style=\"padding-left: 2px;padding-right: 2px;\">" + funcs.scmsg(5, "colorindicatorsetting") + "</th>";
        html += "<th style=\"border-right: none;\">&nbsp;</th>";
        html += "</tr>";
    
        var list = ['background', 'level1', 'level2', 'level3', 'level4', 'level5'];
        
        var msgClazz = ['10', '11', '12', '13', '14', '15', '16'];
        var length = list.length;
    
        for (var i = 0; i < length; i++) {
            var b = record.bgcolor[i];
            html += "<tr><td>" + quoteText(funcs.scmsg(msgClazz[i], 'colorindicatorsetting')) + "</td>";
            html += "<td>" + (b ? b : "&nbsp;") + "</td>";
            html += "<td style=\"" + (b ? "background-color:" + b + ";" : "") + "\"></td>";
            var codelink = codeLink(encodeURIComponent(list[i]), "en");
            html += "<td><a href=\"scactivelink://edit:" + codelink + "\">" + funcs.scmsg(6, "colorindicatorsetting") + "</a></td>";
            html += "</tr>";
        }
        html += "</table>";
        
        return html;
    }
}