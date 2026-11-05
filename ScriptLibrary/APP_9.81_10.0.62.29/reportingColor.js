
/**
* This function en-/decodes the link line
* <br>
* History:<br>
* 20111022 - Tom Hauri, HP - Change / Requirement: N/A Description: Function created<br>
*
* @date     20111022
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
*  This function displayes the selected color
*	
*  @param 	{string} 	- the HTML color
*  @returns {string} 	- the HTML code
*/
function currentColor(color) {
  if (color=="" || color==null) {
    color = "#FFFFFF";	//white
  }

  var html = getCSScolorPicker();
  html += "<body><div style=\"position:absolute;top:3px;left:1px;\"><a class=\"link\" style=\"background-color:"+color+";width:100px;\"></a></div></body>";

  return html;
}

function getCSScolorPicker()
{
  var style = "<style type=\"text/css\">\n";
  style += "body { overflow: hidden;}\n";
  style += "a { font-family:Verdana; font-size:12px; color:#000000; font-weight:normal; }\n";			
  style += "a.link { display:block; width:35px; padding:8px; border:1px; margin:0px 0px; }\n";

  //internet Explorer workaround
  style += 	"* html a.link {  width:50px; heigth:10px; padding:0px; }\n";		
  style += "</style>";

  return style;
}

function colorPicker() {
  var colors = ["#0096D6", "#A449A1", "#49B250", "#FFD800", "#F85F29", "#FF0000"]

  var html = getCSScolorPicker();
	
  html += "<table>\n";

  for (var a=0;a<colors.length;a++)
  {
    if (a==0) html += "<tr>";
    if (a>20 && a%25==0) html += "</tr><tr>";
    html += "<td><a class=\"link\" style=\"background-color:"+colors[a]+";\"";
    html += " href=\"scactivelink://pickcolor:"+codeLink("&quot;"+colors[a]+"&quot;","en")+"\"></a></td>";																			
  }
  html += "</tr></table>";
  return html;
}
