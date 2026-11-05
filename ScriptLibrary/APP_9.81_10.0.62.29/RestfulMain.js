var restRC = lib.RestfulConstant.getReturnCode(); //return code
var restHS = lib.RestfulConstant.getHttpStatus(); //Http Status

var INVALID_FIELD_VALUE = "invalid field value";

var log = getLog("rest.main");

/**
 DAO cpp will call the function for query and actions.

 Input Parameters
     optionsStr : the json string about the options, include the uri, query, HTTP method, resourceName
     xml: the input bean data
 Return
     JSON string about the result
 */
function processResource(opitonsStr, object, attachmentArray) {
    if (log.isDebugEnabled()) {
        log.debug("processResource::opitonsStr=" + opitonsStr);
        if (log.isTraceEnabled()) {
            log.trace("processResource::object=" + JSON.stringify(object));
        }
    }

    var ret = __processResource(opitonsStr, object, attachmentArray);
    if (log.isTraceEnabled()) {
        log.trace("processResource::return=" + JSON.stringify(ret));
    }

    return ret;
}


function __processResource(opitonsStr, object, attachmentArray) {
    try {
        var options = JSON.parse(opitonsStr);
        var uri = JSON.parse(options.uri);
        if (log.isDebugEnabled()) {
            log.debug("__processResource::uri=" + uri);
        }
    } catch (ex) {
        log.error(ex);
        log.error('Failed to parse opitonsStr: ', opitonsStr);
        return makeErrorMsg(restRC['badval'], funcs.scmsg('23', 'restful'));
    }

    if (uri.length == 0) {
        if ('GET' == options.method) {
            return lib.RestfulServiceDocument.getServiceDocumentInfo();
        } else {
            return makeErrorMsg(restRC['invalid.action'], funcs.scmsg('1', 'restful'));
        }
    } else if (lib.RestfulBase.accept(uri, options)) {
        return lib.RestfulBase.process(uri, options, object);
    }

    var config = getConfigFile(uri[0]);

    if (null == config) {
        return makeErrorMsg(restRC['no.record'], funcs.scmsg('2', 'restful', [uri[0]]));
    }

    if (uri.length > 2 && uri[uri.length - 2] == '_TAG_NEW_' && uri[uri.length - 1] == 'attachments') {
        //check url tag
        options["isnew"] = true;
        uri[uri.length - 2] = 'attachments';
        uri.pop();
    }

    var errorURI = checkURI(options.method, uri, config);
    if (errorURI != null) {
        return errorURI;
    }

    decodeUri(uri);

    if (config['rest.enabled'] != true) {
        return makeErrorMsg(restRC['badval'], funcs.scmsg('4', 'restful', [uri[0]]));
    }

    if (uri[config.rest_keys.length() + 1] == 'attachments') {
        return lib.RestfulAttachment.processAttachment(options, uri, attachmentArray, config);
    } else {
        if (options.method == 'GET') {
            return lib.RestfulQuery.processQuery(options, uri, config);
        }

        return lib.RestfulAction.processAction(options, uri, object, config);
    }
}


/**
 * URL Decode %2F %5C, because the characters are double encoded.
 */
function decodeUri(uri) {
    var i;
    for (i = 1; i < uri.length; i++) {
        uri[i] = uri[i].replace(/%2F/g, '/');
        uri[i] = uri[i].replace(/%5C/g, '\\');
    }

    return uri;
}

/**
 * Get extaccess file by rest resource name
 *
 * @param {string} name - rest resource name
 * @return {file} - extaccess file
 */
function getConfigFile(name) {
    var file = new SCFile("extaccess");
    var ret = file.doSelect('rest.list.name="' + name + '"');
    if (RC_SUCCESS == ret) {
        return file;
    } else {
        return null;
    }
}


/**
 * Create a simple Object according to Error Object
 */
function makeSimpleErrorObject(errorObj) {
    if (errorObj == null) {
        return null;
    }

    return {
        'name': errorObj.name,
        'message': errorObj.message,
        'fileName': errorObj.fileName,
        'lineNumber': errorObj.lineNumber,
        'columnNumber': errorObj.columnNumber,
        'stack': errorObj.stack
    };
}

/**
 * build error message to json
 *
 * @param {number} code - return error code number
 * @param {string} msg - return error msg
 * @param {number} code - internal return code
 *
 * @return {string} - json
 */
function makeErrorMsg(returnCode, msg, isMultiple) {

    var msgs;
    if (msg == null) {
        msgs = [];
    } else if (typeof msg == "string") {
        msgs = [msg];
    } else {
        msgs = [makeSimpleErrorObject(msg)];
    }

    msgs = msgs.concat(getMessages());

    if (msgs.length == 0) {
        msgs = getUserMessages();
    }

    var localizeMsg = funcs.scmsg('387', 'scjsdesc');
    var hardcodeMsg = 'Query could not be parsed: ';

    var k;
    for (k = 0; k < msgs.length; k++) {
        msg = msgs[k];
        if (typeof msg != "string") {
            continue;
        }
        if (msg.indexOf(hardcodeMsg) == 0 || msg.indexOf(localizeMsg) == 0) {
            log.warn(msgs.join('\n'));
            msgs = ['The query cannot be parsed. Check the log for details.'];
            break;
        }
    }

    var obj = null;

    if ((restRC['no.record'] == returnCode || restRC['no.attachment'] == returnCode) && isMultiple) {
        obj = { ReturnType: "list", HttpStatus: 200, ReturnCode: 0, Messages: msgs, "@start": 0, "@count": 0, "@totalcount": 0 };
    } else {
        var httpStatus = restHS[returnCode];
        obj = { HttpStatus: httpStatus, ReturnCode: returnCode, Messages: msgs };
        if (isMultiple) {
            obj["ReturnType"] = "list";
        } else {
            obj["ReturnType"] = "record";
        }
    }

    return JSON.stringify(obj);
}


/**
 * convert a file to an object by field name and caption
 *
 * @param {file} file - file of a record in db
 * @param {array} fieldList - file name array
 * @param {array} fieldList - file caption array
 * @param {array} fieldList - resource name defined in extaccess
 *
 * @return {object}
 */
function file2Object(file, fieldList, captionList, soaTypeList, resourceName) {
    var obj = {};
    var structureArray = [];
    var len = funcs.lng(fieldList);
    var k;
    for (k = 0; k < len && file != null; k++) {
        if (null == fieldList[k]) {
            continue;
        }

        var fieldName = fieldList[k];

        var refField = null;
        var refList = fieldName.split('..');
        if (refList.length == 2) {
            fieldName = refList[0];
            refField = refList[1];
        }

        var soapType = soaTypeList[k];
        var type = "string";

        var list = getFields(fieldName);
        if (log.isDebugEnabled()) {
            log.debug("file2Object::fieldName=", fieldName);
        }

        var nameList = list.nameList;
        var indexList = list.indexList;

        var lastName = nameList[nameList.length - 1];
        if (null == captionList[k]) {
            captionList[k] = lastName;
        }

        lastName = captionList[k];
        var obj1;
        var valueTypeMapping;

        if (indexList.length > 0) {
            var nameStartList = nameList.slice(0, indexList[0]);
            var nameEndList = nameList.slice(indexList[0] + 1);

            var value1 = getFieldValue(file, nameStartList, null);
            if (value1 == null) {
                continue;
            }

            var subLng = funcs.denull(value1).length();
            if (subLng == 0) {
                continue;
            }

            obj1 = buildStruct(obj, nameStartList, nameStartList.length - 1);

            var arrayName = nameStartList[nameStartList.length - 1];
            if (!obj1[arrayName]) {
                obj1[arrayName] = { "type": 'array', "value": [] };
            }

            var array = obj1[arrayName].value;

            var i;
            for (i = 0; i < subLng; i++) {
                var tempFields = [i].concat(nameEndList);
                var tmpValue = getFieldValue(value1, tempFields);

                valueTypeMapping = checkSimpleFieldType(tmpValue, soapType);

                var obj2 = array[i];
                if (!obj2) {
                    obj2 = { type: 'object', value: {} };
                    array[i] = obj2;
                }

                obj2.value[lastName] = { "value": valueTypeMapping.value, "type": valueTypeMapping.type };
            }
        } else {
            // build parent            
            obj1 = buildStruct(obj, nameList, nameList.length - 1);

            // Assign Value
            var value = getRefFieldValue(file, nameList, refField);
            if (vars["$extra.rest.data"] && value == null && nameList.toString().indexOf("extra_rest_") == 0) {
                value = getExtraRestData(vars["$extra.rest.data"], funcs.filename(file), nameList);
            }
            valueTypeMapping = checkSimpleFieldType(value, soapType);
            obj1[lastName] = { "value": valueTypeMapping.value, "type": valueTypeMapping.type };
        }
    }

    var result = {};
    result['value'] = {};
    result['value'][resourceName] = { type: 'object', value: obj };
    result['type'] = "object";

    return result;
}

function getExtraRestData(objstr, filename, name) {
    try {
        var data = JSON.parse(objstr);
        if (data && data[filename] && data[filename][name]) {
            return data[filename][name];
        }
    } catch (e) {
        log.error("getExtraRestData meet exception:" + e);
    }

    return null;
}

function buildStruct(obj, nameList, size) {
    var obj1 = obj;
    var i;
    for (i = 0; i < size; i++) {
        if (!obj1[nameList[i]]) {
            obj1[nameList[i]] = { type: "structure", value: {} };
        }

        obj1 = obj1[nameList[i]].value;
    }

    return obj1;
}

/**
 * Check non-structure field type. If date convert to ISO date format
 *
 * @param {object} value - field value
 *
 * @return{value, type} - converted value
 */
function checkSimpleFieldType(value, soaType) {

    var type = "string";

    if (null != value && value instanceof Date) {
        value = toDateString(new XMLDate(value));

        if (soaType == 'DateTimeType') {
            type = "datetime";
        } else if (soaType == 'DateType') {
            var k1 = value.indexOf('T');
            var k2 = value.indexOf('+');
            if (k1 > 0 && k2 > 0) {
                value = value.substring(0, k1) + value.substring(k2);
            }

            type = "date";
        } else if (soaType == 'TimeType') {
            var k = value.indexOf('T');
            if (k > 0) {
                value = value.substring(k + 1);
            }
            type = "time";
        } else if (soaType == 'DurationType') {
            type = "duration";
        } else {
            type = "datetime";
        }
    }

    if (null != value && null != value.getType) {
        if ("ARRAY" == value.getType()) {
            type = "array";
        }

        value = dealArrayField(value);
    }

    if (value != null && value.getText) {
        value = value.getText();
    }

    if (value == null) {
        value = "";
    }

    if (soaType == "Base64Type") {
        value = base64Encode(value);
    }

    return { "value": value, "type": type };
}


/**
 * convert array field to js array type
 *
 * @param {array} value - field value
 *
 * @return{array} - converted value
 */
function dealArrayField(value) {
    value = funcs.denull(value);
    var value1 = [];

    var length = value.length();
    var m;
    for (m = 0; m < length; m++) {
        if (null != value[m] && value[m] instanceof Date) {
            value1.push({ value: toDateString(new XMLDate(value[m])), type: "datetime" });
        } else {
            value1.push({ value: value[m], type: "string" });
        }
    }

    return value1;
}

/**
 * convert object to json
 *
 * @param {object} fileObject - file of a record in db or array of list
 * @param {object} returnObj - return object by query or action
 * @param {boolean} isMultiple - is single record or list
 * @param {string} resourceName - resource name in rest in extaccess
 * @param {number} start - the start index
 * @param {array} messages - messages to be returned in json response
 *
 * @return {json}
 */
function toJson(fileObject, returnObj, isMultiple, resourceName, start, messages) {
    if (messages == null) {
        messages = [];
    }
    var msgs = getMessages().concat(messages);

    if (msgs.length == 0) {
        msgs = getUserMessages();
    }

    var httpStatus = restHS[returnObj.returnCode];
    if (httpStatus == null) {
        httpStatus = restHS['other'];
    }

    var obj;
    if (isMultiple) {
        obj = {
            ReturnCode: returnObj.returnCode,
            HttpStatus: httpStatus,
            Messages: msgs,
            ReturnType: "list",
            ResourceName: resourceName,
            '@totalcount': returnObj.count
        };
        if (fileObject != null) {
            obj['@start'] = start;
            obj['@count'] = fileObject.length;
            obj['content'] = { value: fileObject, "type": "array" };
        }
    } else {
        obj = {
            ReturnCode: returnObj.returnCode,
            HttpStatus: httpStatus,
            Messages: msgs,
            ResourceName: resourceName,
            ReturnType: "record",
            value: fileObject['value'],
            type: "object"
        };
    }

    return JSON.stringify(obj);
}


/**
 * convert json to SCFile
 *
 * @param {string} str - json
 * @param {file} config - extacess record
 * @param {object} dbdict - dbdict record
 * @param {file} SCFile - input file to merge
 *
 * @return {file} SCFile
 */
function fromJson(str, config, dbdict, file) {
    var obj = JSON.parse(str);

    if (!obj) {
        return file;
    }

    var returnFile = fromJsonObj(obj, config, dbdict, file);
    if (log.isTraceEnabled()) {
        log.trace("fromJson", "returnFile", funcs.str(returnFile));
    }

    return returnFile;
}


/**
 * convert obj to SCFile
 *
 * @param {object} obj - plain js object
 * @param {file} config - extacess record
 * @param {object} dbdict - dbdict record
 * @param {file} SCFile - input file to merge
 *
 * @return {file} new SCFile
 */
function fromJsonObj(obj, config, dbdict, file, msgs) {
    if (log.isTraceEnabled()) {
        log.trace("fromJsonObj::begin, file=", funcs.str(file));
    }

    var fileName = config.name;

    var fieldList = config.soafield;
    var captionList = config.soacaption;
    var soaptypeList = config.soatype;

    var k;
    var length = fieldList.length();
    for (k = 0; k < length; k++) {
        var caption = captionList[k];
        var field = fieldList[k];

        if (null == field || '' == field) {
            continue;
        }

        var type = soaptypeList[k];
        var bracketPos = field.indexOf('[');

        try {
            if (bracketPos > 0) { // array structure
                assignArrayOfStructValue(file, obj, dbdict, field, caption, type);
            } else {
                assignSimpleValue(file, obj, dbdict, field, caption, type);
            }
        } catch (e) {
            log.warn(field, e);
            if (e && e.error == INVALID_FIELD_VALUE) {
                throw funcs.scmsg('22', 'restful', [field, e.type, e.value]);
            }

            throw e;
        }
    }

    if (null != msgs) {
        var msg = _checkInvalidFields(obj);
        if (null != msg) {
            msgs.push(msg);
        }
    }

    if (log.isTraceEnabled()) {
        log.trace("fromJsonObj::return", file);
    }

    return file;
}


function _checkInvalidFields(obj) {
    var attr;
    for (attr in obj) {
        _check2(obj, attr);
    }

    var n = 0;
    var k;
    for (k in obj) {
        n++;
        break;
    }

    if (n > 0) {
        var fields = JSON.stringify(obj);
        return funcs.scmsg('35', 'restful', [fields]);
    }

    return null;
}

function _check2(obj, attr) {
    var value = obj[attr];

    if (value == null) {
        return;
    }

    if (typeof value != 'object') {
        return;
    }

    var k;
    for (k in value) {
        _check2(value, k);
    }

    var n = 0;
    for (k in value) {
        n++;
        break;
    }

    if (n == 0) {
        if (Array.isArray(obj)) {
            delete obj[attr];
        } else {
            delete obj[attr];
        }
    } else {
        log.warn("value" + value);
        if (Array.isArray(value)) {
            var m;
            for (m = 0; m < value.length; m++) {
                if (value[m] == null) {
                    value[m] = {};
                }
            }
        }
    }
}


function getFieldDef(dbdict, field) {
    var obj = dbdict[field];

    if (!obj) {
        obj = { name: field, type: dbdict.__getFile().getFieldType(field) };

        if (obj.type == 8) {
            var parent = obj;
            obj = { name: field, type: dbdict.__getFile().getFieldType(field + ',1') };
            obj.parent = parent;
        }

        dbdict[field] = obj;
    }

    return obj;
}

/**
 * Structure, or simple value
 */
function assignSimpleValue(file, obj, dbdict, field, caption, soapType) {
    var fields = getFields(field).nameList;
    var fieldValue = getFieldValue(obj, fields, caption, true);

    if (fieldValue === '') {
        fieldValue = null;
    }

    if (log.isDebugEnabled()) {
        log.debug("assignSimpleValue::fields=", field);
        if (log.isTraceEnabled()) {
            log.trace("assignSimpleValue::fieldValue=", fieldValue);
        }
    }

    if (isInvalidValue(fieldValue)) {
        return;
    }

    if (null != fieldValue) {
        fieldValue = convertValue(fieldValue, getFieldDef(dbdict, fields[fields.length - 1]), soapType);
    }

    var convertedFieldNames = convertFieldName(file, fields);
    assignFieldValue(file, convertedFieldNames, fieldValue);
}

/**
 * Array of structure
 */
function assignArrayOfStructValue(file, obj, dbdict, field, caption, soapType) {
    var fields = getFields(field);
    var nameList = fields.nameList;
    var indexList = fields.indexList;

    if (log.isDebugEnabled()) {
        log.debug("assignArrayOfStructValue::fields=", field);
    }

    var nameStartList = nameList.slice(0, indexList[0]);
    var nameEndList = nameList.slice(indexList[0] + 1);

    var lastName = nameList[nameList.length - 1];

    var obj1 = getFieldValue(obj, nameStartList, null);

    if ('' == obj1) {
        obj1 = null;
    }

    if (isInvalidValue(obj1)) { // undefined, ignor and go ahead
        return;
    }

    var i;
    var lng = 0;
    var convertedFieldNames;

    if (obj1 == null) {
        // noop
    } else {
        lng = obj1.length;
        for (i = 0; i < lng; i++) {
            var tempFields = [i].concat(nameEndList);

            var tmpValue = getFieldValue(obj1, tempFields, caption, true);

            if ('' == tmpValue) {
                tmpValue = null;
            }

            if (null != tmpValue) {
                tmpValue = convertSimpleValue(tmpValue, getFieldDef(dbdict, lastName), soapType);
            }
            nameList[indexList[0]] = i;
            convertedFieldNames = convertFieldName(file, nameList);

            assignFieldValue(file, convertedFieldNames, tmpValue);
        }
    }

    // cleanup additional values
    var length = getFieldValue(file, nameStartList).length();
    for (i = lng; i < length; i++) {
        nameList[indexList[0]] = i;
        convertedFieldNames = convertFieldName(file, nameList);
        assignFieldValue(file, convertedFieldNames, null);
    }
}


function isInvalidValue(value) {
    return undefined === value || typeof value == 'function';
}

function assignFieldValue(file, fieldNames, value) {
    if (isInvalidValue(value)) {
        return;
    }

    if (1 == fieldNames.length) {
        file[fieldNames[0]] = value;
    } else if (2 == fieldNames.length) {
        file[fieldNames[0]][fieldNames[1]] = value;
    } else if (3 == fieldNames.length) {
        file[fieldNames[0]][fieldNames[1]][fieldNames[2]] = value;
    } else if (4 == fieldNames.length) {
        file[fieldNames[0]][fieldNames[1]][fieldNames[2]][fieldNames[3]] = value;
    } else {
        var str = "file";
        var k;
        for (k = 0; k < fieldNames.length; k++) {
            str = str + "[fieldNames[" + k + "]]";
        }
        str += " = value";
        eval(str);
    }
}

/**
 * convert a simple type from string by dbdict definition
 *
 * @param {string} value - a string need to be converted
 * @param {object} fieldDef - a field object in dbdict
 * @param {type}  string - soa type
 *
 * @return - converted value related to field type in dbdict
 */
function convertSimpleValue(value, fieldDef, type) {
    if (log.isTraceEnabled()) {
        log.trace("convertSimpleValue: value =", value, ", type =", fieldDef.type);
    }

    if (null == value) {
        return null;
    }

    var retValue = value;
    if (type === "Base64Type") {
        try {
            if (fieldDef && fieldDef.type == 2) {
                retValue = base64Decode(value, true);
            } else {
                retValue = base64Decode(value);
            }
            value = retValue;
        } catch (e) {
            // NOOP, value not changed
        }
    }

    if (value != null) {
        if (fieldDef.type == 3) {
            if (type === "DurationType") {
                retValue = new XMLDate(value).toSCDuration();
            } else if (type == null) {
                retValue = new XMLDate(value).getDate();
                if (retValue == '<null>') {
                    retValue = new XMLDate(value).toSCDuration();
                }
            }
            // datetime, date, time 
            else {
                retValue = new XMLDate(value).getDate();
            }

            if (retValue === "<null>") {
                throw { "error": INVALID_FIELD_VALUE, "type": 'datetime', "value": value };
            }
        } else if (fieldDef.type == 1) {
            if (!isNumber(value)) {
                throw { "error": INVALID_FIELD_VALUE, "type": 'number', "value": value };
            }

            retValue = funcs.val(value, fieldDef.type);
        } else if (fieldDef.type != 2) {
            retValue = funcs.val(value, fieldDef.type);
        } else {
            retValue = funcs.str(value);
        }
    }

    if (log.isTraceEnabled()) {
        log.trace("convertSimpleValue: retValue =", retValue);
    }

    return retValue;
}

/**
 * Convert value as type
 */
function convertValue(value, fieldDef, type) {
    if (log.isTraceEnabled()) {
        log.trace("convertValue: value =", value, ", type =", fieldDef.type);
    }
    var retValue = value;

    var c1 = fieldDef;

    var isArray = false;
    if (c1.parent != null) {
        if (c1.parent.type == 8) {
            isArray = true;
        }
    }

    if (isArray) {
        if (!Array.isArray(value)) {
            value = [value];
        }

        retValue = [];
        var k;
        for (k = 0; k < value.length; k++) {
            retValue.push(convertSimpleValue(value[k], fieldDef, type));
        }
    } else {
        retValue = convertSimpleValue(value, fieldDef, type);
    }

    if (log.isTraceEnabled()) {
        log.trace("convertValue::retValue =", retValue);
    }

    return retValue;
}


/**
 * Get dbdict definition
 */
function getdbdict(fileName) {
    var __file = new SCFile(fileName);
    return {
        __getFile: function() { return __file; }
    };
}


/**
 * Get keys' caption
 */
function getCaptions(keys, fields, captions) {
    var keysLen = funcs.lng(keys);
    var fieldsLen = funcs.lng(fields);

    var keyCaptions = [];

    var i;
    for (i = 0; i < keysLen; i++) {
        var tmpKey = keys[i];
        var found = false;

        var j;
        for (j = 0; j < fieldsLen; j++) {
            var tmpField = fields[j];
            if (tmpKey == tmpField && captions[j] != null) {
                found = true;
                keyCaptions.push(captions[j]);
                break;
            }
        }
        if (!found) {
            keyCaptions.push(tmpKey);
        }
    }

    return keyCaptions;
}

/**
 * Get messages from message queue
 *
 * @return array - message array
 */
function getMessages() {
    var messages = funcs.messages(5, 0); //5: retrieve messages 0: all levels

    funcs.messages(3); // clean message queue;

    return messages.toArray();
}

/**
 * Is Number
 *
 * @param {value} string
 * return boolean
 */
function isNumber(value) {
    if (/^[+\-]?\d+$/.test(value)) {
        return true;
    }

    if (/^[+\-]?\d+\.\d+$/.test(value)) {
        return true;
    }

    return false;
}

/**
 * Convert a field if it is identical to file method name
 *
 * @param {SCFile} file - a record in file
 * @param {Array} fieldNames - array of field names
 *
 * @return array - converted field names
 */
function convertFieldName(file, fieldNames) {

    var i;
    for (i = 0; i < fieldNames.length; i++) {
        if (typeof file[fieldNames[i]] == 'function') {
            fieldNames[i] = '_' + fieldNames[i];
        }
    }
    return fieldNames;
}


/**
 * Check uri is correct or not
 *
 * @param {String} method - method of the rest call, Get/Post/Put/Delete
 * @param {Array} uri - array of uri of the rest call
 * @param {SCFile} config - record in extaccess
 *
 * @return string - error message if uri is not correct. otherwise, return null
 */
function checkURI(method, uri, config) {

    var keyLen = config['rest.keys'].length();

    //empty uri was checked before this function
    if (uri.length <= 1) {
        return;
    }

    //uri cannot shorter than resource/keys, otherwise keys is not input correctly
    if (uri.length < (keyLen + 1)) {
        // keys are not set correctly. However it will be checked later, so return true here. 
        return;
    }
    //uri cannot be longer than /resource/keys/attachments(action)/id(actionName) 
    else if (uri.length > (keyLen + 3)) {
        if (log.isDebugEnabled()) {
            log.debug('RestfulMain::checkURI::uri length ' + uri.length + ' is longer than keyLen + 3:' + (keyLen + 3));
        }
        return makeErrorMsg(restRC['badval'], funcs.scmsg('30', 'restful'));
    }
    //uri cannot be equal to /resource/keys/action without actionName if method is PPD 
    else if (method != 'GET' && uri.length == (keyLen + 2) && uri[keyLen + 1] == 'action') {
        if (log.isDebugEnabled()) {
            log.debug('checkURI::missing action name');
        }
        return makeErrorMsg(restRC['badval'], funcs.scmsg('31', 'restful'));
    } else if (uri.length > (keyLen + 1)) {
        var tmpActionKey = uri[keyLen + 1];
        //if uri matchs /resource/keys/attachments(/id), need check attachments word spelling
        if (method == 'GET' && tmpActionKey != 'attachments') {
            if (log.isDebugEnabled()) {
                log.debug('checkURI::key word "attachments" is missing in GET');
            }
            return makeErrorMsg(restRC['badval'], funcs.scmsg('32', 'restful', ['"attachments"']));
        }
        //if uri matchs /resource/keys/attachments(action)(/id), need check attachments/action word spelling 
        else if (method != 'GET' && tmpActionKey != 'attachments' && tmpActionKey != 'action') {
            if (log.isDebugEnabled()) {
                log.debug('checkURI::key word "attachments" or "action" is missing in PPD');
            }
            return makeErrorMsg(restRC['badval'], funcs.scmsg('32', 'restful', ['"attachments" or "action"']));
        }
    }
}

/**
 * parse str to fields
 *
 * @param {str} string - fields string "middle,erp.instances[erp.approver]"
 * @return object - {nameList:nameList, indexList:indexList};
 *   nameList: fields name list
 *   indexList: array index list
 */
function getFields(name) {

    var list = name.split(',');
    var length = list.length;
    var last = list[length - 1];
    var index = last.indexOf('[');

    var indexArray = [];

    if (index > 0) {
        list[length - 1] = last.substring(0, index);
        list[length] = 0;
        indexArray.push(length);
        list[length + 1] = last.substring(index + 1, last.length - 1);
    }
    return { nameList: list, indexList: indexArray };
}

function getRefFieldValue(file, fields, refField) {
    var value = getFieldValue(file, fields);

    if (!value) {
        return value;
    }

    if (refField) {
        var displayName = '';
        var fieldName = fields[fields.length - 1];
        var tableName = funcs.filename(file);

        var refTable = lib.DisplayName.getRefTable(fieldName, tableName);
        var fRecord = new SCFile(refTable, SCFILE_READONLY);

        fRecord.setFields([refField]);
        var uniqueKeys = funcs.dbdict_helper("unique.key", refTable);
        var key = uniqueKeys[0];
        var sql = "" + key + "=\"" + value + "\"";
        var type = funcs.dbdict_helper("field.type", tableName, fieldName);

        // Array Type        
        if (type == 8) {
            var list = [];
            var k;
            var length = value.length();
            for (k = 0; k < length; k++) {
                var item = value[k];
                if (!item) {
                    list.push(item);
                    continue;
                }
                sql = "" + key + "=\"" + item + "\"";
                if (fRecord.doSelect(sql) === RC_SUCCESS) {
                    list.push(fRecord[refField]);
                }
            }
            return lib.ArrayUtil.toSCDatum(list);
        } else {
            if (fRecord.doSelect(sql) === RC_SUCCESS) {
                displayName = fRecord[refField];
            }
        }

        return displayName;
    }

    return value;
}

/**
 * Get field value from obj
 *
 * @param {obj}    object  - the object
 * @param {fields} array   - the list of fields
 * @param {caption} string - the last field's caption, can be the key of field value
 * 
 * @return fields value
 */
function getFieldValue(obj, fields, caption, isDelete) {

    var convertedFieldNames = convertFieldName(obj, fields);

    var obj1 = obj;
    var lastIndex = fields.length - 1;

    var k;
    for (k = 0; k < lastIndex; k++) {
        var value = obj1[fields[k]];

        if (null === value || undefined === value) {
            if (isDelete) {
                delete obj1[fields[k]];
            }
            return value;
        }

        obj1 = value;
    }

    var tempValue;

    // the last field
    if (null != caption) {
        tempValue = obj1[caption];
        if (tempValue !== undefined) {
            if (isDelete) {
                delete obj1[caption];
            }
            return tempValue;
        }
    }

    tempValue = obj1[fields[lastIndex]];
    if (isDelete) {
        delete obj1[fields[lastIndex]];
    }

    return tempValue;
}


function toDateString(xmlDate) {
    if (xmlDate.getISODateTimeWithSMTZString || xmlDate.hasOwnProperty('getISODateTimeWithSMTZString')) {
        return xmlDate.getISODateTimeWithSMTZString();
    }

    return xmlDate.getISODateTimeString();
}