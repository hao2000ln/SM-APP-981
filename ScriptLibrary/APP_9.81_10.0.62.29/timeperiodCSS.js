/**
* @fileoverview  Handles the CSS layout definition for the HTML views in the timeperiod rules.
* @author Jan Steube
* @date November 2012
*/

/**
*  This functions build and return the CSS Style for the HTML tables in the Timeperiod record
*
*  	History:
*	2013-02-02, Jan Steube - function created
*	
*  @returns {string} 	style		- the CSS style
*/

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
	style +=	".TableHeading{text-align:left;}";
	style +=	".table-border{border-left: solid 1px #888;}";
	style +=	"body[style*=\"rtl\"] .TableHeading{text-align:right;}";
	style +=	"body[style*=\"rtl\"] .table-border{border-right: solid 1px #888; border-left:none}";
	style +=	"</style>"

	return style;

}


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
					"font-family:Verdana;"+
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
