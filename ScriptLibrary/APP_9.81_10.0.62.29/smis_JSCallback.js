/******************************************************
* Module Name: SMIS Field mapping JSCallback
* Function: Containing all jscallback functions
* Author: Dianel Woo
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

var InvalidParameter = "Invalid parameter."

function combine(fieldArray, sep) {
	if (arguments.length != 2) throw "combine: " +InvalidParameter;
	if (sep == null) sep = " ";
    var str = "";
	str = fieldArray.join(sep);
	return str;
}
  

function lookup(filename, query, fieldname,ignore) {
	if (arguments.length != 4) throw "lookup: " +InvalidParameter;
	var item = new SCFile (filename);
	var querys = query.split("||");
	for (var i = 0; i < querys.length; i++) {
		var iquery = querys[i];
		var RC = item.doSelect(iquery);
		if ( RC == RC_SUCCESS )
		{
			return item[fieldname];
		} 
	}
	
	if (ignore == "false" || !ignore) return null;
}

function lookupEmpty(filename, query, fieldname) {
	if (arguments.length != 3) throw InvalidParameter;
	var ret = lookup(filename, query, fieldname);
	if (ret != null) return ret;
}


function when(conditions, values) {
	
	if (arguments.length < 2 || arguments.length > 2) throw "when: "+ InvalidParameter;
	
	for (var i = 0; i < conditions.length; i++) {
		var condition = conditions[i];
		var value = values[i];
		if (eval(condition)) 
			return value;
	}
	
	return null;
}


function setValue(actions, value,ignore, smisAction) {
	if (arguments.length != 4) throw "setValue: "+InvalidParameter;
	var actionArray = actions.split("|");
	for (var i = 0; i < actionArray.length; i++) {
		if (actionArray[i] == smisAction) return value;
	}
	
	if (ignore == "false" || !ignore) return null;
}

function getFuncList() {
	return [["combine",["value array","delimiter"]],
			["lookup",["file name","query", "field name","ignore"]],
			["when",["condition", "value1", "value2"]],
			["setValue",["actions", "value","ignore"]]
			].sort(new Function("a","b","return (a[0] > b[0]) ? 1: -1 "));
}