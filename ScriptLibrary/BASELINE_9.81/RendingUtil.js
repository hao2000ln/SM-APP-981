/**
input:
the format
output:
the propertyArray which is like:
priority.code,ValueList=,DisplayList=,
priority.code,1,1 - Critical,
priority.code,2,2 - High,
priority.code,3,3 - Average,
priority.code,4,4 - Low,
severity,ValueList=,DisplayList=,
severity,1,1 - Critical,
severity,2,2 - High,
severity,3,3 - Average,
severity,4,4 - Low,
initial.impact,ValueList=,DisplayList=,
initial.impact,1,1 - Enterprise,
initial.impact,2,2 - Site/Dept,
initial.impact,3,3 - Multiple Users,
initial.impact,4,4 - User
*/
function generateFormPropertyArray(format) {
    var propertyArray = [];
    var fieldArray = format[1];
    var i;
    var length = funcs.lng(fieldArray);

    for (i = 0; i < length; i++) {
        var tempArraylength = propertyArray.length;
        // handle display list and value list.
        //formArray[i][10] contains the property of the form
        var displayStartLocation = funcs.index("DisplayList", fieldArray[i][10]);
        //formArray[i][7] contains the field name.
        if (fieldArray[i][7] != null && displayStartLocation > 0) {
            var valueStartLocation = funcs.index("ValueList", fieldArray[i][10]);
            var displayEndLocation = funcs.index("\t", fieldArray[i][10], displayStartLocation);
            var valueEndLocation = funcs.index("\t", fieldArray[i][10], valueStartLocation);

            var displayProperty = fieldArray[i][10].substring(displayStartLocation - 1, displayEndLocation - 1);
            var valueProperty = fieldArray[i][10].substring(valueStartLocation - 1, valueEndLocation - 1);

            var displayArray = [];
            var valueArray = [];

            //if we use global list in diaplayProperty, we shall parse the global list variable
            if (displayProperty.substr(12, 1) == "$") {
                var temparr1 = [];
                var temp = funcs.parse_evaluate(displayProperty.substr(12), 8);
                if (temp != null) {
                    temparr1 = temp.toArray();
                }
                displayArray[0] = "DisplayList=";
                var k;
                for (k = 0; k < temparr1.length; k++) {
                    displayArray[k + 1] = temparr1[k];
                }
            } else {
                displayProperty = displayProperty.replace('DisplayList=', 'DisplayList=;');
                displayArray = displayProperty.split(";");
            }

            //if we use global list in valueProperty, we shall parse the global list variable
            if (valueProperty.substr(10, 1) == "$") {
                var temparr2 = [];
                var valuePropertyArray = funcs.parse_evaluate(valueProperty.substr(10), 8);
                if (valuePropertyArray != null) {
                    temparr2 = valuePropertyArray.toArray();
                }
                valueArray[0] = "ValueList=";
                var l;
                for (l = 0; l < temparr2.length; l++) {
                    valueArray[l + 1] = temparr2[l];
                }
            } else {
                valueProperty = valueProperty.replace('ValueList=', 'ValueList=;');
                valueArray = valueProperty.split(";");
            }

            // add display list and value list to return array: propertyArray.
            var j;
            for (j = 0; j < valueArray.length; j++) {
                propertyArray[j + tempArraylength] = [];

                propertyArray[j + tempArraylength][0] = fieldArray[i][7];
                propertyArray[j + tempArraylength][1] = valueArray[j];
                propertyArray[j + tempArraylength][2] = (displayArray[j] != null) ? displayArray[j] : valueArray[j];
            }
        }
    }

    return propertyArray;
}


/**
input:
fieldname
propertyArray (rad array of array)
the value of the field
return:
the value in display list of our field

As this function is much slower 500% than rad, I will not use it. The time is cost at var tempArray=propertyArray[i].toArray();
if we have 10000 records, the function will cost a lot of time
*/
function replaceValueToDispaly(fieldname, propertyArray, value) {
    var i;
    var length = funcs.lng(propertyArray);
    for (i = 0; i < length; i++) {
        var tempArray = propertyArray[i].toArray();
        if (tempArray[0] == fieldname && tempArray[1] == value) {
            return tempArray[2];
        }
    }

    return value;
}


/**
 * Return max size of export external file.
 *
 * The uppper limit is 50M for uncompress file, but for some languages those  
 * which use double size such as Chinese, the limit should be 25M. 
 */
function getMaxExternalFileSize() {
    return 25000000;
}


/**
 * Parse Query parameter
 *
 * @param parameter string, e.g. {"initial.impact", "number"}
 * @return array
 */
function parseQueryParameter(arrayStr) {
    if (arrayStr.length <= 2) {
        return null;
    }

    // remove brace {}, e.g. "initial.impact", "number"
    arrayStr = arrayStr.substring(1, arrayStr.length - 1);

    // remove quote "", e.g. initial.impact, number
    arrayStr = arrayStr.replace(/"/g, "");

    var array = arrayStr.split(",");

    // empty array, return null
    if (array.length == 0) {
        return null;
    }

    var i;
    for (i = 0; i < array.length; i++) {
        // trim
        array[i] = array[i].trim();

        // change 0/1 to false/true
        if (array[i] == 0) {
            array[i] = false;
        } else if (array[i] == 1) {
            array[i] = true;
        }
    }

    return array;
}


function isEscapeChar(c) {
    return c == '=' || c == '@' || c == '-' || c == '+';
}


function escapeCsv(value, sep) {
    if (typeof(value) != 'string') {
        return value;
    }

    if (sep != ',') {
        value = value.replace(/([,\t])([\-+=@])/g, '$1\'$2');
    }

    if (value.length > 0 && isEscapeChar(value.charAt(0))) {
        return '\'' + value;
    }

    return value;
}


/**
 * Get real file fields array according to the column array
 *
 * @param {Object} array
 *             Array or SCDatum Array
 * @returns {Array} 
 */
function getFieldsArray(array) {
    if (array == null) {
        return null;
    }

    array = lib.ArrayUtil.toJsArray(array);

    // convert multi level array field to array field, e.g. "description,1" => "description" 
    return array.map(function(item) {
        if (!item) {
            return item;
        }

        var index = item.indexOf(',');
        if (index <= 0) {
            return item.trim();
        }

        return item.substring(0, index).trim();
    });
}