function getGlobalListValue(strGlobalList) {
    var listString = strGlobalList.toString();
    //listString = listString.replace(/\./g, "_");

    return vars[listString];
}

function getGlobalListValueByDbdict(fWsdlGlobalList) {
    fWsdlGlobalList.list_items = getGlobalListValue(fWsdlGlobalList.name);

    if (system.functions._null(fWsdlGlobalList.list_items)) {
        return false;
    }

    return true;
}

function getDisplayValue(value, valueList, displayList) {
    var arrayType = lib.DataTypeConst.typeArray();
    if (funcs.type(valueList) != arrayType || funcs.type(displayList) != arrayType ||valueList.length !=displayList.length) {
        return value;
    }
    var index = lib.ArrayUtil.indexOf(valueList, value);
    if (index == -1) {
        return value;
    } else {
        return displayList[index];
    }
}