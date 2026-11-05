var dvdVisibleStack;

function evaluate(fields,validationJson) {
    cleanDvdResult(fields);
    for (var fieldId in fields) {
        if (!fields.hasOwnProperty(fieldId)) {
            continue;
        }
        var field = fields[fieldId];
        dvdVisibleStack = [];
        var valField = null;
        if(validationJson.hasOwnProperty(fieldId)){
            valField = validationJson[fieldId];
        }
        if(valField && valField.hasOwnProperty("visible")){
	        evalVisibleResult(field, fields, valField);
        }else{
            evalVisibleResult(field, fields, null);
        }
        if(valField && valField.hasOwnProperty("mandatory")){
            evalMandatoryResult(field, fields, valField);
        }else{
            evalMandatoryResult(field, fields, null);
        }
        if(valField && valField.hasOwnProperty("readonly")){
            evalReadonlyResult(field, fields, valField);
        }else{
            evalReadonlyResult(field, fields, null);
        }    
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
        delete field.readonlyResult;
    }
}

function evalVisibleResult(field, fields, valField) {
    if (field.hasOwnProperty('visibleResult')) {
        return;
    }
    if (field.hasOwnProperty('visible')) {
        if (arrayFind(dvdVisibleStack, field) != -1) {
            throw new Error('Dynamic Form DVD detect endless loop...');
        }
        dvdVisibleStack.push(field);
        if(valField != null){
            field.visibleResult = dvdEvaluate(valField, 'visible', fields);
        }else{
            field.visibleResult = dvdEvaluate(field, 'visible', fields);
        }
        dvdVisibleStack.pop();
    } 
}

function evalMandatoryResult(field, fields, valField) {
     //print(rteJSONStringify(field))
    if (field.hasOwnProperty('mandatoryResult')) {
        return;
    }
    if (field.hasOwnProperty('mandatory')) {
        if(valField != null){
            field.mandatoryResult = dvdEvaluate(valField, 'mandatory', fields);
        }else{
            field.mandatoryResult = dvdEvaluate(field, 'mandatory', fields);
        }
    } 
}

function evalReadonlyResult(field, fields, valField) {
    if (field.hasOwnProperty('readonlyResult')) {
        return;
    }
    if(field.hasOwnProperty("isDefaultFirst") && field['isDefaultFirst'] == "true"){
        field.readonlyResult = true;
        return;
    }
    if (field.hasOwnProperty('readonly')) {
        if(valField != null){
            field.readonlyResult = dvdEvaluate(valField, 'readonly', fields);
        }else{
            field.readonlyResult = dvdEvaluate(field, 'readonly', fields);
        }
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

function parseCondition(fields, query) {
    var reg = /\"(.*?)\"/gi; //regular expression for finding out double quotation mark ""
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
        var tempStr = subStringArr[i];
        if (tempStr.charAt(0) != '"') {
            tempStr = parseField(fields, tempStr);
        }
        result.push(tempStr);
    }

    return result.join('');
}


function parseField(fields, query) {
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
                result.push('""');
                break;
            }
            var fieldValue = field.value;

            //referenced field has not calculate its visible status, calculate it first
            if (field.visibleResult === undefined) {
                evalVisibleResult(field, fields);
            }
            if (field.visibleResult === false) {
                fieldValue = '';
            }

            var fieldType = field.type;
            // if the depended field is a string or picklist, doulbe quotation mark should be added automatically
            if (fieldType == 'select' || fieldType == 'text'|| fieldType == "string" || fieldType == "multitext" || fieldType == "picklist" || fieldType == "combo" || fieldType == "radio")
         	{
                tempstr = '"' + fieldValue + '"';
            } else if (fieldType == "date") {
                tempstr = fieldValue == "" ? "NULL" : "'" + fieldValue + "'";
            } else {
                if (fieldType == "checkbox") {
                    tempstr = fieldValue;
                    if (tempstr == "") {
                        tempstr = "false";
                    }
                } else if (fieldType == "number") {
                    tempstr = fieldValue == "" ? "NULL" : fieldValue;
                }
                query = fieldValue;
            }
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

function printValue(fields) {
    var out = ['Field values: '];
    for (var p in fields) {
        //print(p);
        if (fields[p].value) {
            out.push(p + '=' + fields[p].value + ';');
        }
    }
    print(out.join(''));
}


function printVisibleResult(fields) {
    var out = [' Visible fields: '];
    for (var p in fields) {
        //print(p);
        if (fields[p].visibleResult) {
            out.push(p + ';');
        }
    }
    print(out.join(''));
}
