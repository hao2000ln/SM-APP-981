/**
 * This file contains some common methods for array object
 *
 * Deprecated
 * Try to find what you need in lib.Underscore instead
 */
var _ = lib.Underscore.require();

function isEmpty(array) {
    return array == null || length(array) == 0;
}

var breaker = 'breaker';

function length(array) {
    if (array == null) {
        return 0;
    }

    if (Array.isArray(array)) {
        return array.length;
    }

    return array.length();
}


/**
 * if the array has empty string value only
 */
function isEmptyString(array) {
    if (isEmpty(array)) {
        return true;
    }

    var i;
    var l = length(array);
    for (i = 0; i < l; i++) {
        if (array[i] != null && array[i] != "") {
            return false;
        }
    }

    return true;
}

function indexOf(array, value) {
    if (isEmpty(array) || value == null) {
        return -1;
    }

    var i;
    var l = length(array);
    for (i = 0; i < l; i++) {
        if (array[i] == value) {
            return i;
        }
    }

    return -1;
}


function contains(array, value) {
    return indexOf(array, value) != -1;
}


function addAll(array, a) {
    if (isEmpty(a)) {
        return;
    }

    if (array == null) {
        throw new Error("Array is null!");
    }

    var i;
    var l = length(a);
    for (i = 0; i < l; i++) {
        array.push(a[i]);
    }
}

function addAllWithoutDuplicate(array, a) {
    if (isEmpty(a)) {
        return;
    }

    if (array == null) {
        throw new Error("Array is null!");
    }

    var i;
    var l = length(a);
    for (i = 0; i < l; i++) {
        if (!contains(array, a[i])) {
            array.push(a[i]);
        }
    }
}

/**
 * merge two or more array to one
 */
function merge(a1, a2 /*.....*/ ) {
    addAllWithoutDuplicate(a1, a2);

    var alength = arguments.length;
    if (alength > 2) {
        var i;
        for (i = 2; i < alength; i++) {
            addAllWithoutDuplicate(a1, arguments[i]);
        }
    }
    return a1;
}


/**
 * Split large Array into multiple arrays
 */
function split(array, count) {
    var arrayCount = Math.ceil(length(array) / count);
    var children = new Array(arrayCount);

    var i;
    for (i = 0; i < arrayCount; i++) {
        children[i] = array.slice(count * i, count * (i + 1));
    }

    return children;
}


function toSCDatum(array) {
    if (array == null) {
        return null;
    }

    var datum = new SCDatum();
    datum.setType(lib.DataTypeConst.typeArray()); // array type

    var i;
    for (i = 0; i < array.length; i++) {
        datum.push(array[i]);
    }

    return datum;
}


/**
 * This method is used to convert the Datum Array to Js Array
*/
function toJsArray(datumArray) {
    if (datumArray == null) {
        return null;
    }

    // already JS array
    if (Array.isArray(datumArray)) {
        return datumArray;
    }

    var array = [];
    var i;
    var alength = funcs.lng(datumArray);
    for (i = 0; i < alength; i++) {
        array.push(datumArray[i]);
    }

    return array;
}

function toJsArrayRemoveDuplicateEmptyElement(datumArray) {
    if (datumArray == null) {
        return null;
    }
    var array = [];
    var i;
    var alength = funcs.lng(datumArray);
    for (i = 0; i < alength; i++) {
        if (datumArray[i] != null && datumArray[i] != "" && !contains(array, datumArray[i])) {
            array.push(datumArray[i]);
        }
    }
    return array;
}


function binarySearch(array, value) {

    if (isEmpty(array) || value == null) {
        return -1;
    }

    var l = 0;

    var h = array.length - 1;

    while (l <= h) {
        var m = (l + h) >>> 1;
        if (array[m] == value) {
            return m;
        }
        if (array[m] > value) {
            h = m - 1;
        } else {
            l = m + 1;
        }
    }

    return -(l + 1);
}


/**
This method is used to remove the duplicated value or null value from the array
*/
function removeDuplicateEmptyElement(arr) {

    var i;
    var len = arr.length;
    var out = [];
    var obj = {};
    for (i = 0; i < len; i++) {
        if (arr[i] != null && arr[i] !== "") {
            obj[arr[i]] = 0;
        }
    }
    for (i in obj) {
        out.push(i);
    }

    return out;
}

/**
This method is used to get the first nonnull element from the array
*/
function getFirstNoneNullValue(arr) {

    var i;
    var iLoopTimes = arr.length();
    for (i = 0; i < iLoopTimes; i++) {

        if (arr[i] != null && arr[i] != "") {
            return arr[i];
        }
    }

}

/**
This method is used to remove duplicate element from RAD array 
*/
function removeDuplicateDatumElement(arrDat) {

    var arr = arrDat.toArray();
    var o = {};
    var re = new SCDatum();
    re.setType(8);
    if (arr == null) {
        return re;
    }

    var i;
    for (i = 0; i < arr.length; i++) {
        if (!o[arr[i]]) {
            o[arr[i]] = true;
            re.push(arr[i]);
        }
    }
    return re;
}


/**
 * This method is used to remove empty element from RAD array 
 */
function removeEmptyDatumElement(arrDat) {

    if (arrDat == null) {
        return null;
    }

    var arr = arrDat.toArray();
    var re = new SCDatum();
    re.setType(lib.DataTypeConst.typeArray());

    if (arr == null) {
        return re;
    }

    var i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i]) {
            re.push(arr[i]);
        }
    }

    return re;
}


/**
 *	Implemented as forEach function
 *	If Object passed in contains forEach function, invoke it directly.
 *	If length function exists in object, iterate with index. E.g., Array
 *	Otherwise iterate the inherit properties
 */
function each(object, iterator, context) {
    _.each(object, iterator, context);
}

/**
 *	Implemented as Array.map
 *	Iterate the whole object and create a new array,
 *	with the element according to the iterator setting.
 */
function map(object, iterator, context) {
    return _.map(object, iterator, context);
}


/**
 *	Implemented as Array.filter
 *	Select out the element equals to the function.
 */
function filter(object, iterator, context) {
    return _.filter(object, iterator, context);
}

/**
 *	Determine if all the elements in Array matches the given function
 */
function every(object, iterator, context) {
    return _.every(object, iterator, context);
}

/**
 *	Determine if any elements in Array matches the given function.
 */
function some(object, iterator, context) {
    return _.some(object, iterator, context);
}

/**
 * Fold the element in Array from left
 * Iterate all the element inside and calculate the result to the initial variable.
 */
function reduce(object, iterator, initial, context) {
    return _.reduce(object, iterator, initial, context);
}

/**
 *	Sort the object's values by a criterion produced by an iterator.
 */
function sortBy(object, iterator, context) {
    return _.sortBy(object, iterator, context);
}

/**
 * compare the SC arrays are same or not
 */
function sameArray(array1, array2) {

    if (array1 == null) {
        if (array2 == null) {
            return true;
        } else {
            return false;
        }
    } else {
        if (array2 == null) {
            return false;
        } else {
            if (array1.toString() == array2.toString()) {
                return true;
            } else {
                return false;
            }
        }
    }
}

/**
 * remove the value from array
 */
function removeA(arr) {
    if (!(arr instanceof Array)) {
        arr = arr.toArray();
    }
    var what;
    var a = arguments;
    var L = a.length;
    var ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        ax = indexOf(arr, what);
        while (ax !== -1) {
            arr.splice(ax, 1);
            ax = indexOf(arr, what);
        }
    }
    return arr;
}

/**
 * convert Array of String to String
 */
function plainText(content) {
    if (content == null || content.length() === 0) {
        return "NONE";
    } else {
        return ("{ " + content.toArray().join() + " }");
    }
}

/**
 * remove subArray from array
 */
function removeSubArray(array, subArray) {
    var arr = toJsArray(array);
    subArray = toJsArray(subArray);
    var i;
    var len = subArray.length;
    for (i = 0; i < len; i++) {
        var index = arr.indexOf(subArray[i]);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
    return arr;
}