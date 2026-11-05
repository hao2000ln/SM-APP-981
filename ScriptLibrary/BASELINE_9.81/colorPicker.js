
/**
*  This functions represents the CSS for the HTML color code picker
*
*  	History:
*	2013-02-02, Jan Steube - function created
*	
*  @returns {string} 	style		- the CSS style
*/

function getCSScolorPicker()
{
	var style;
	style =		"<style type=\"text/css\">\n";
	style += 	"a{" +
					"font-family:HPSimplified;"+
					"font-size:12px;"+
					"color:#000000;"+
					"font-weight:normal;"+
				"}\n";
				
	style +=	"a.link { " +
					"display:block;"+
					"width:35px;"+
					"padding:8px;"+
					"border:1px;"+
					"margin:0px 0px;"+
				"}\n";
	
	//internet Explorer workaround
	style += 	"* html a.link { " +
					"width:50px;"+
					"heigth:10px;"+
					"padding:0px;"+
				"}\n";		
				
	style += "</style>";
	return style;
}


/**
*  This function generates the HTML code for the color picker

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @returns {string} 	- the HTML code
*/

function colorPicker() {

var colors = [ "#FFFFFF", "#FCACBF", "#FCDDB1", "#FFF7D4", "#D5E6AD", "#C8D7E8", "#E7F6F7", "#E9D0EF",
               "#F2F2F2", "#F98A9F", "#FCD48D", "#FCF0C0", "#7EE0A5", "#A0C5EA", "#C6EAF8", "#E3A2EA",
               "#CCCCCC", "#F4677B", "#FFCE54", "#FCEBA4", "#78D18F", "#6CB4EA", "#B3E5FA", "#D8AEF4",
               "#A3A2A2", "#ED5564", "#F6BB42", "#FFE780", "#A0D468", "#65A1DD", "#9DDDF4", "#BC8AD6",
               "#7D7D7D", "#EE553B", "#F5A529", "#FFE04A", "#78BF52", "#5D9CEC", "#7EC8EE", "#B87CD8",
               "#5A5A5A", "#EE312A", "#F27D14", "#FFD800", "#49B250", "#4A89DC", "#4FC2E9", "#A061BA",
               "#353535", "#DA4453", "#F85F29", "#F9D026", "#2DA06C", "#3C76AF", "#3BAFDA", "#A449A1",
               "#000000", "#C80E04", "#D7410B", "#E7C300", "#00882B", "#10699A", "#0096d6", "#822980"];

	var	html = getCSScolorPicker();
	
	html += "<table style='width:100%;height:100%'>\n";

	for (var a=0;a<colors.length;a++) {
	
		if (a==0) html += "<tr>";
		if (a>1 && a%8==0) html += "</tr><tr>";
		html +="<td><a class=\"color-link\" style=\"display:block;position:relative;padding:11px;border:1px;margin:0;background-color:"+colors[a]+";\" href=\"scactivelink://pickcolor:"+lib.timeperiod.codeLink("&quot;"+colors[a]+"&quot;","en")+"\"></a></td>";
																				
	}
	html += "</tr></table>";
	return html;
}

function validateColor(color)
{
  return color != null? /^(#)?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(color): true;
}


/**
*  This function displayes the selected color

*  	History:
*	2013-01-29, Jan Steube - function created
*	
*  @param 	{string} 	- the HTML color
*  @returns {string} 	- the HTML code
*/

function currentColor(color) {

	 if (color=="" || color==null) {
	 	color = "#FFFFFF";	//white
	 }
	 	
	 var html = "<body bgcolor=\""+color+"\">"; 
		 html += "</body>";
	
	return html;
}

//RTE will remove "#" in color values, add it back
function handleColor(color) {
  if (color == null || color.indexOf("#") == 0) {
    return color;
  }

  return "#" + color;
}