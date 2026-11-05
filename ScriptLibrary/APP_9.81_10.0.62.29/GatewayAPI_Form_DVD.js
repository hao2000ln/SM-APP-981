//Duplicate from dynamicFormDvd
var log = getLog('GatewayAPI_Form_DVD');
var strrep = system.functions.strrep;
function evaluate(fields) {
    cleanDvdResult(fields);
    for (var fieldId in fields) {
        if (!fields.hasOwnProperty(fieldId)) {
            continue;
        }
        var field = fields[fieldId];
        dvdVisibleStack = [];
        evalVisibleResult(field, fields);
        evalMandatoryResult(field, fields);
        evalQueryResult(field, fields);
        evalValueResult(field, fields);
        evalParameterResults(field, fields);
        evalReadonlyResult(field, fields);
    }
    return fields;
}

function cleanDvdResult(fields) {
    for (var fieldId in fields) {
        if (!fields.hasOwnProperty(fieldId)) {
            continue;
        }
        var field = fields[fieldId];
        delete field.visibleResult;
        delete field.mandatoryResult;
        delete field.queryResult;
        delete field.valueResult;
        delete field.parameterResults;
        delete field.readonlyResult;
    }
}

function evalVisibleResult(field, fields) {
    if (field.hasOwnProperty('visibleResult')) {
        return;
    }
    if (field.hasOwnProperty('visible')) {
        if (arrayFind(dvdVisibleStack, field) != -1) {
            throw new Error('Dynamic Form DVD detect endless loop...');
        }
        dvdVisibleStack.push(field);
        field.visibleResult = dvdEvaluate(field, 'visible', fields);
        dvdVisibleStack.pop();
    } 
}

function evalReadonlyResult(field, fields) {
    if (field.hasOwnProperty('readonlyResult')) {
        return;
    }
    if (field.hasOwnProperty('readonly')) {
        field.readonlyResult = dvdEvaluate(field, 'readonly', fields);
    }
}

function evalParameterResults(field, fields) {
    if (field.hasOwnProperty('parameterResults')) {
        return;
    }
    if (field.hasOwnProperty('parameters')) {
        field.parameterResults = [];
        var length = funcs.lng(field['parameters']);
        for (var i= 0; i< length; i++) {
            field.parameterResults.push(dvdEvaluatePropertyValue(field['parameters'][i], fields));
         }
    } 
}
function evalMandatoryResult(field, fields) {
    if (field.hasOwnProperty('mandatoryResult')) {
        return;
    }
    if (field.hasOwnProperty('mandatory')) {
        field.mandatoryResult = dvdEvaluate(field, 'mandatory', fields);
    } 
}

function evalQueryResult(field, fields) {
    if (field.hasOwnProperty('queryResult')) {
        return;
    }
    if (field.hasOwnProperty('query')) {
        field.queryResult = parseField(fields, field.query, true);
    } 
}

function evalValueResult(field, fields) {
    if (field.hasOwnProperty('valueResult')) {
        return;
    }
    if (field.hasOwnProperty('value') && field['valueAsExp']) {
        field.valueResult = dvdEvaluateValue(field, 'value', fields);
    } 
}

function dvdEvaluate(field, propName, fields) {
    var prop = field[propName];
    if (prop == 'true' || prop === true) {
        return true;
    }
    if (prop == 'false' || prop === false) {
        return false;
    }
    var cond = parseCondition(fields, prop);
	var conditionEva = system.functions.parse_evaluate(cond, 4);
	return conditionEva == true;
}

function dvdEvaluateValue(field, propName, fields) {
    var prop = field[propName];
    var cond = parseCondition(fields, prop);
	var conditionEva = system.functions.parse_evaluate(cond, 2);
	return conditionEva;
}

function dvdEvaluatePropertyValue(prop, fields) {
    var cond = parseCondition(fields, prop);
    var conditionEva = system.functions.parse_evaluate(cond, 2);
    return conditionEva;
}

function parseCondition(fields, query) {
    var reg = /["'](.*?)["']/gi; //regular expression for finding out double quotation mark ""
    var subStringArr = [];
    var tmp;
    var firstBracketIndex = 0;
    var secondBracketIndex = 0;
    var result = [];
    query = query + '';
    while ((tmp = reg.exec(query)) != null) {
        firstBracketIndex = tmp.index;
        if (firstBracketIndex > 0) {
            subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
        }
        secondBracketIndex = firstBracketIndex + tmp[0].length;
        subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
    }
    if (secondBracketIndex != query.length) {
        subStringArr.push(query.substring(secondBracketIndex, query.length));
    }
    for (var i = 0; i < subStringArr.length; i++) {
        var tempStr = subStringArr[i];
        if (tempStr.charAt(0) != '"') {
            tempStr = parseField(fields, tempStr);
        }
        result.push(tempStr);
    }
    return result.join('');
}

function parseField(fields, query, keepNULL) {
    var reg = /\[(.*?)\]/gi; //regular expression for find out brackets []
    var subStringArr = [];
    var tmp;
    var firstBracketIndex = 0;
    var secondBracketIndex = 0;
    var result = [];
    while ((tmp = reg.exec(query)) != null) {
        firstBracketIndex = tmp.index;
        if (firstBracketIndex > 0) {
            subStringArr.push(query.substring(secondBracketIndex, firstBracketIndex));
        }
        secondBracketIndex = firstBracketIndex + tmp[0].length;
        subStringArr.push(query.substring(firstBracketIndex, secondBracketIndex));
    }
    if (secondBracketIndex != query.length) {
        subStringArr.push(query.substring(secondBracketIndex, query.length));
    }
	
    for (var i = 0; i < subStringArr.length; i++) {
        var tempstr = subStringArr[i];
        if (tempstr.charAt(0) == '[') {
            tempstr = tempstr.substring(1, tempstr.length - 1);
            var field = fields[tempstr];
            if (field == null) {
                result.push('['+ tempstr +']');
                continue;
                // result.push('""');
                // break;
            }
            var fieldValue = field.value || '';

            //referenced field has not calculate its visible status, calculate it first
            if (field.visibleResult === undefined) {
                evalVisibleResult(field, fields);
            }

            var fieldType = field.type;
            // if the depended field is a string or picklist, doulbe quotation mark should be added automatically
            if (fieldType == 'select' || fieldType == 'text'|| fieldType == "string" || fieldType == "multitext" || fieldType == "picklist" || fieldType == "combo" || fieldType == "radio")
         	{
                tempstr = '"' + fieldValue + '"';
            } else if (fieldType == "date") {
            	if(fieldValue == "") {
            		tempstr = "NULL";
            	} else {
            		tempstr = new Date(Number(fieldValue));
            		tempstr = "'" + system.functions.str(tempstr) + "'";
            	}
            } else {
                if (fieldType == "checkbox") {
                    tempstr = fieldValue;
                    if (tempstr == "" || tempstr === null || tempstr === undefined) {
                        tempstr = "false";
                    }
                } else if (fieldType == "number") {
                    tempstr = fieldValue == "" ? "NULL" : fieldValue;
                }
                query = fieldValue;
            }
        }
        //In a double quoted string escape the double quote and backslash
        if ( tempstr[0] == '"' && tempstr[tempstr.length - 1] == '"' ) {
            tempstr = tempstr.substring( 1, tempstr.length - 1 );
            tempstr = tempstr.replace(/\\/g, '\\\\');
            tempstr = tempstr.replace(/"/g, '\\"');
            tempstr = '"' + tempstr + '"';
        }
        if(tempstr.indexOf('NULL') !== -1 && !keepNULL){
          tempstr = strrep(tempstr, 'NULL', '""');
        }
        if(tempstr.indexOf('null') !== -1){
          // tempstr = strrep(tempstr, 'null', '""');
          tempstr = tempstr.replace(/null(?!\()/g, '""');
        }
        if(tempstr.indexOf("''") !== -1){
	      tempstr = strrep(tempstr, "''", '""');
        }
        result.push(tempstr);
    }
    return result.join('');
}

function arrayFind(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) {
            return i;
        }
    }
    return -1;
}
