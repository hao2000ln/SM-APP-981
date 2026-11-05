/** The utility for Service Catalog Dynamic Value Dependency.
*   @author Sean
*/

var log = lib.ScAPI_Logger.log("ScAPI_DVD_Utility");
/**
* Partially evaluate expression like (company = company in $lo.operator and dept.name like "asia*") or dept.name="abc"
* According to protocol with SRC-UI, API only handle expression which only SM can evaluate, such as "company in $lo.operator".
* The other parts are leave as it is.
*/
function parseDVDExpression(exp) {
  var logicOp = /\s+(and|or)\s+/i;
  var expUnits = exp.split(logicOp);
  //var boolOp = /(=|>|<|!=|\(|\))/;
  var boolOp = /(=|<|>|\(|\)|~|¬|#)/;
  var afterEvaluatedExp = "";
  var isSimpleRadExpression = true;
  for (var i=0; i<expUnits.length;i++) {
  	var units = expUnits[i].split(boolOp);
    var afterEvaluatedExpUnit = "";
    if (units.length>=3) {
      isSimpleRadExpression = false;
  	  for (var j=0; j<units.length; j++) {
  	    if (units[j].indexOf("$lo.")>=0 || units[j].indexOf("$G")>=0) {
	      units[j] = "\"" + evaluateRad(units[j]) + "\"";
  	    }
  	    afterEvaluatedExpUnit += "" + units[j];
  	  }
  	  expUnits[i] = afterEvaluatedExpUnit;
    }
    afterEvaluatedExp += " " + expUnits[i];
  }
  if (expUnits.length == 1 && isSimpleRadExpression) {
  	afterEvaluatedExp = evaluateRad(exp);
  }
  return afterEvaluatedExp;
}

function evaluateRad(exp) {
	var exp1 = system.functions.parse(exp, 11);
	if (exp1) {
		return system.functions.evaluate(exp1);
	}
	return null;
}

function evaluateRadDate(exp) {
	return system.functions.parse_evaluate(exp, 3);
}

function parseFormElementVisibility(form) {
	if (form == null || form == "") {
		return null;
	}
	
	var formXML = new XML();	
	formXML.setContent(form);
	var node = formXML.getFirstChildElement();
	while (node != null) {
		if(node.getAttributeNode("visible")) {
			var visibleExp = node.getAttributeValue("visible");
			node.setAttributeValue("visible",parseDVDExpression(visibleExp));
		}
		node = node.getNextSiblingElement();
	}
	return formXML.toXMLString();
}


function parseFormElementMandatory(form) {
	if (form == null || form == "") {
		return null;
	}
	
	var formXML = new XML();	
	formXML.setContent(form);
	var node = formXML.getFirstChildElement();
	while (node != null) {
		if(node.getAttributeNode("mandatory")) {
			var mandatoryExp = node.getAttributeValue("mandatory");
			node.setAttributeValue("mandatory",parseDVDExpression(mandatoryExp));
		}
		node = node.getNextSiblingElement();
	}
	return formXML.toXMLString();
}

function parseDateRangeValidation(form) {
	if (form == null || form == "") {
		return null;
	}
	
	var formXML = new XML();	
	formXML.setContent(form);
	var node = formXML.getFirstChildElement();
	while (node != null) {
		if (node.getName()=="date") {
			evaluateDateAttribute(node, "gt");
			evaluateDateAttribute(node, "lt");
			evaluateDateAttribute(node, "gte");
			evaluateDateAttribute(node, "lte");
		}
		node = node.getNextSiblingElement();
	}
	return formXML.toXMLString();
}

function evaluateDateAttribute(node, attribute) {
	if (node.getAttributeNode(attribute)) {
		var dateExp = node.getAttributeValue(attribute);
		var dateExpConverted = lib.tzFunctions.convertDateStringToLocal(dateExp, 6);
		var dateObj = system.functions.val(dateExpConverted, 3);
		if (!dateObj) {
			var date1 = parseDVDExpression(dateExp);
			var date2 = evaluateRadDate(date1);
			var dateString = lib.tzFunctions.convertDatetoStringonTZ(date2, 6, "Greenwich/Universal");
			node.setAttributeValue(attribute, dateString);
		} else {
			node.setAttributeValue(attribute, dateExp);
		}
	}
	return node;
}

