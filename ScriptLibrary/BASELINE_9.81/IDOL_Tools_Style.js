/**
*	The style for the xml in idol tools
*
*	Returun - css style in html
*	Type - String
**/
function style(){
	var style = '@charset "utf-8";\
		span.nodeName\
		{	color: rgb(136, 18, 128);}\
		span.nodeValue\
		{	}\
		span.attrName\
		{	color: rgb(153, 69, 0);}\
		span.attrValue\
		{	color: rgb(26, 26, 166);}';
	return style;
}

/**
*	The indent character in xml
*
*	Returun - indent character
*	Type - String
**/
function indent() {
	return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
}