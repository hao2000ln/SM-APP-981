/******************************************************
 * Module Name: SMIS TaskLog Manager
 * Function: provide functions to check whether case exchange is enabled.
 * Author: DeHong Wang
 * Version: 1.00
 * Creation Date: Jan, 2014
 *******************************************************/

var updateFieldVar = {};
var activitySelectionVar = {};
var INBOUND_ACTIVITY_TYPE = 'Update from customer';
var OUTBOUND_ACTIVITY_TYPE = 'Communication with customer';

var _ = lib.Underscore.require();
var logger = lib.CaseExchangeLogger.getLogger();
if (!logger) {
    logger = getLog('CaseExchange_CommonLib');
}

/**	
 *  This fuction is to check whether there's a CaseExchange connector is enalbed.
 *
 *	@return true or false
 *	@type - boolean
 */
function isCaseExchangeEnabled() {
    var caseExchangeEnabled = false;
    var OBJECT_KEY = "object";

    var smisTemplate = new SCFile("SMISRegistry", SCFILE_READONLY);
    smisTemplate.setFields(["name"]);

    var RC_template = smisTemplate.doSelect("name #\"CaseExchange\"");

    while (RC_template == RC_SUCCESS) {
        var templateName = smisTemplate.name;

        var instanceConfig = new SCFile("SMISConfiguration", SCFILE_READONLY);
        instanceConfig.setFields(["intId"]);
        var RC_instance = instanceConfig.doSelect("intId <> \"0\" and template=\"" + templateName + "\"");

        while (RC_instance == RC_SUCCESS) {
            var instanceID = instanceConfig.intId;
            var integrationInstance = lib.smis_ConfigurationManager.getInstanceConfig(instanceID);

            if (integrationInstance != null) {
                if (integrationInstance.getConfigParameterValue(OBJECT_KEY) == "probsummary") {
                    if (integrationInstance.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
                        caseExchangeEnabled = true;
                        break;
                    }
                }
            }

            RC_instance = instanceConfig.getNext();
        }

        RC_template = smisTemplate.getNext();
    }

    return caseExchangeEnabled;
}

/**	
 *  This function is to check whether there's a CaseExchange reference for an object(probsummary etc,.).
 *
 *	@param {internalObject} - internalObject
 *	@param {internalId} - internalId
 *	@return true or false
 *	@type - boolean
 */
function isCaseExchangeEnabledByRecord(internalObject, internalId) {
    var isEnabled = false;

    if (internalObject != null && internalId != null) {
        var caseExchangeReferenceRecord = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(internalObject, internalId, false, false);

        if (caseExchangeReferenceRecord != null) {
            isEnabled = true;
        }

        return isEnabled;
    }

    return isEnabled;
}


/**	
 *  This function is to set the value from destObject in task to sm SCFile and return the changed fields
 *
 *	@param {smRecord} - SCFile in SM
 *	@param {destObject} - destObject in task
 *	@param {isSetValue} - boolean. If set the value in destObject to smRecord
 *	@return the changed field with origin and updated value
 *	@type - object {field:[], oldValue:[], newValue[]}
 */
function compareSetSMRecord(smRecord, destObject, isSetValue) {
    logger.debug('CaseExchange_CommonLib', 'compareSetSMRecord');

    var updatedField = {};

    var i = 0;

    var obj;
    for (obj in destObject) {
        if (obj !== 'id') {
            // convert reserved field
            if (lib.dbdictHelper.isReservedField(obj)) {
                obj = '_' + obj;
            }

            if (destObject[obj] != null) {
                //var isArray = funcs.type(destObject[obj]) === 8;
                var isArray = _.isArray(destObject[obj]);

                var field;
                var oldValue;
                var newValue;

                if (isArray) {
                    var subObj;
                    for (subObj in smRecord[obj]) {
                        if (_.string.trim(smRecord[obj][subObj]) != _.string.trim(destObject[obj][subObj])) {
                            field = obj;
                            oldValue = funcs.str(smRecord[obj]);
                            newValue = funcs.str(destObject[obj]);
                            logger.debug('CaseExchange_CommonLib', 'field: ' + obj);
                            logger.debug('CaseExchange_CommonLib', 'oldValue: ' + oldValue + ' --> newValue: ' + newValue);
                            updatedField[obj] = { "oldValue": oldValue, "newValue": newValue };
                            i++;
                            break;
                        }
                    }
                } else {
                    if (_.string.trim(smRecord[obj]) != _.string.trim(destObject[obj])) {
                        field = obj;
                        oldValue = smRecord[obj];
                        newValue = destObject[obj];
                        logger.debug('CaseExchange_CommonLib', 'field: ' + obj);
                        logger.debug('CaseExchange_CommonLib', 'oldValue: ' + oldValue + ' --> newValue: ' + newValue);
                        updatedField[obj] = { "oldValue": oldValue, "newValue": newValue };
                        i++;
                    }
                }
            }

            if (isSetValue) {
                if (destObject[obj] != null && destObject[obj] != undefined && destObject[obj] !== "") {
                    if (smRecord.getFieldType(obj) !== funcs.type(destObject[obj])) {
                        throw 'The field type of ' + obj + ' in SM is not consistent with definition in dbdict.';
                    } else {
                        smRecord[obj] = destObject[obj];
                    }
                }
            }
        }
    }

    updatedField['$size'] = i;
    return updatedField;
}


/**	
 *  Create comment title of activity & ticket update
 *
 *	@param {direction} - exchange direction
 *	@param {createdTime} - comment's created time
 *	@param {instanceName} - case exchange instance
 *	@return - message title
 *	@type - string
 */
function createMsgTitle(direction, createdTime, instanceName) {
    logger.debug('CaseExchange_CommonLib', 'createMsgTitle');

    if (!createdTime) {
        createdTime = funcs.tod();
    } else {
        var jsDate = new Date();
        jsDate.setTime(createdTime);
        createdTime = new XMLDate(jsDate).getDatum();
    }

    var str = funcs.str(createdTime) + '(' + vars['$lo.time.zone'] + '), ' + instanceName;
    if (isOutbound(direction)) {
        str += '(' + funcs.scmsg('2', 'CaseExchange', []) + ')';
    } else if (isInbound(direction)) {
        str += '(' + funcs.scmsg('1', 'CaseExchange', []) + ')';
    }
    str += ': ';

    return str;
}

/**	
 *  Convert update field obj to string
 *
 *	@param {updatedFields} - object of update fields {field: {oldValue: ***, newValue: ***}}
 *	@return - Converted value
 *	@type - string
 */
function updateFieldsToString(updatedFields, objectName) {
    logger.debug('CaseExchange_CommonLib', 'updateFieldsToString');
    var str = '';
    var size = updatedFields['$size'];
    if (size === 0) {
        return funcs.scmsg('3', 'CaseExchange', []);
    }
    var i = 0;
    var obj;
    for (obj in updatedFields) {
        i++;
        if (obj !== '$size') {
            var oldValue = updatedFields[obj].oldValue;
            var newValue = updatedFields[obj].newValue;
            var fieldCaption = funcs.get_field_caption(obj, objectName);
            str += fieldCaption + ': ' + oldValue + ' -> ' + newValue;
            if (i < size) {
                str += '\n';
            }
        }
    }

    return str;
}


/**
 *	Set activity log of sm record
 *
 *	@param {isInbound} - boolean is inbound or not
 *	@param {action} - action of inbound process
 *	@param {smRecord} - a record of scfile
 *	@param {journalUpdate} - journal update message
 *	@param {objectName} - object name in SM
 */
function setActivityLog(isInbound, action, smRecord, journalUpdate, objectName, activityType) {
    logger.debug('CaseExchange_CommonLib', 'setActivityLog');

    if (!updateFieldVar[objectName] || !activitySelectionVar[objectName]) {
        var object = new SCFile('Object', SCFILE_READONLY);
        object.setFields(['activitylog.file.name', 'activity.selection.var', 'update.field.var']);
        object.doSelect('file.name="' + objectName + '"');
        updateFieldVar[objectName] = object['update.field.var'];
        activitySelectionVar[objectName] = object['activity.selection.var'];
    }
    vars[updateFieldVar[objectName]] = [journalUpdate];

    if (activityType && activityType != "") {
        vars[activitySelectionVar[objectName]] = activityType;
    } else {
        if (isInbound) {
            vars[activitySelectionVar[objectName]] = INBOUND_ACTIVITY_TYPE;
        } else {
            vars[activitySelectionVar[objectName]] = OUTBOUND_ACTIVITY_TYPE;
        }
    }

    // if is outbound or inbound with add(create) action, call rad to insert activity log
    if (!isInbound || (isInbound && action === lib.CaseExchangeConstants.CREATE_ACTION())) {
        createActivityLog(smRecord, smRecord, 'update');
    }
}

/**
 *	Clear activity log var of sm record
 *
 *	@param {objectName} - object name in SM
 */
function clearActivityLogVar(objectName) {
    logger.debug('CaseExchange_CommonLib', 'clearActivityLogVar');

    if (!updateFieldVar[objectName] || !activitySelectionVar[objectName]) {
        var object = new SCFile('Object', SCFILE_READONLY);
        object.setFields(['activitylog.file.name', 'activity.selection.var', 'update.field.var']);
        object.doSelect('file.name="' + objectName + '"');
        updateFieldVar[objectName] = object['update.field.var'];
        activitySelectionVar[objectName] = object['activity.selection.var'];
    }
    vars[updateFieldVar[objectName]] = null;
    vars[activitySelectionVar[objectName]] = null;
}

/**
 * Create activity log for sm record by calling RAD sc.activity
 */
function createActivityLog(file, oldfile, actType) {
    logger.debug('CaseExchange_CommonLib', 'createActivityLog');
    var rteNames = new SCDatum();
    rteNames.push("file");
    rteNames.push("second.file");
    rteNames.push("text");
    rteNames.push("boolean1");

    var rteValues = new SCDatum();
    rteValues.push(file);
    rteValues.push(oldfile);
    rteValues.push(actType);
    rteValues.push(false);

    // call rad "sc.activity" to create an activity log
    funcs.rtecall("callrad", new SCDatum(), "sc.activity", rteNames, rteValues, false);
}

/**	
 *   Save comments from EP to activity log
 *
 *	@param {comments} - comments array. [{body:***, createdTime:***, submitter:***}]
 *	@param {smRecord} - record in sm
 *	@param {direction} - exchange direction
 *	@param {smisInstanceName} - case exchange instance
 *	@param {objectName} - object name in SM
 */
function commentsToActivityLog(comments, smRecord, direction, smisInstanceName, objectName) {
    logger.debug('CaseExchange_CommonLib', 'commentsToActivityLog');

    if (!comments) {
        return;
    }

    var i;
    for (i = 0; i < comments.length; i++) {
        var body = comments[i].body;
        var createdTime = comments[i].createdTime;
        body = lib.CaseExchange_CommonLib.createMsgTitle(direction, createdTime, smisInstanceName) + body;
        setActivityLog(true, lib.CaseExchangeConstants.CREATE_ACTION(), smRecord, body, objectName);
        clearActivityLogVar(objectName);
    }
}

/**
 *	A wrap function to call inbound doHTTPRequest and update the config parameter if any parameter is updated
 *
 *	@param {url} - rest url
 *	@param {timeout}
 *	@param {param} - all parameters in config item
 *	@param {timeout}
 *	@return - string of field list
 *	@type - string
 */
function doInboundRequest(url, timeout, param, configItem) {
    logger.debug('CaseExchange_CommonLib', 'doInboundRequest');

    var restRequest = new(lib.CaseExchange_RestRequest.getClass())(param);
    var response = restRequest.doInboundRequest(url, timeout, {});
    var paramChanged = false;
    if (restRequest.param) {
        var obj;
        for (obj in restRequest.param) {
            if (restRequest.param[obj] !== configItem.getConfigParameterValue(obj)) {
                configItem.setConfigParameterValue(obj, restRequest.param[obj]);
                paramChanged = true;
            }
        }
        if (paramChanged) {
            lib.smis_ConfigurationManager.updateParam(configItem);
        }
    }

    return response;
}


/**
 *	A wrap function to call outbound doHTTPRequest and update the config parameter if any parameter is updated
 *
 *	@param {httpMethod} - action as GET/POST/PUT
 *	@param {url} - rest url
 *	@param {httpBody}
 *	@param {timeout}
 *	@param {param} - all parameters in config item
 *	@param {timeout}
 *	@return - string of field list
 *	@type - string
 */
function doOutboundRequest(httpMethod, url, httpBody, timeout, param, configItem) {
    logger.debug('CaseExchange_CommonLib', 'doOutboundRequest');

    var restRequest = new(lib.CaseExchange_RestRequest.getClass())(param);
    var response = restRequest.doOutboundRequest(httpMethod, url, httpBody, timeout, {});
    var paramChanged = false;
    if (restRequest.param) {
        var obj;
        for (obj in restRequest.param) {
            if (restRequest.param[obj] !== configItem.getConfigParameterValue(obj)) {
                configItem.setConfigParameterValue(obj, restRequest.param[obj]);
                paramChanged = true;
            }
        }
        if (paramChanged) {
            lib.smis_ConfigurationManager.updateParam(configItem);
        }
    }

    return response;
}

/**
 *	The function is to judge if the direction is inbound(right-left) or not
 *
 *	@param {direction} 
 *	@return - true/false
 *	@type - boolean
 */
function isInbound(direction) {
    return direction === lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
}


/**
 *	The function is to judge if the direction is outbound(left-right) or not
 *
 *	@param {direction} 
 *	@return - true/false
 *	@type - boolean
 */
function isOutbound(direction) {
    return direction === lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
}


/**
 *	This function is to merge two js object into one DEEPLY
 *	All attributes in the 2 obj should be merged into one including array
 *
 *	@param {obj1}
 *	@param {obj2}
 *	@param {path} - This parameter is only used for recusive call. Don't need to pass anything
 *	@param {parentPath} - This parameter is only used for recusive call. Don't need to pass anything
 *	@param {isArray} - This parameter is only used for recusive call. Don't need to pass anything
 *
 *	@return - merged object
 *	@type - object
 **/
function mergeObjectDeep(obj1, obj2, path, parentPath, isArray) {
    logger.debug('CaseExchange_CommonLib', 'mergeObjectDeep');

    if (!path) {
        path = '';
    }

    //if obj1 is in an array, need to check if the array in obj2 has the same object
    //if has, need merge
    //if no, create a new object into this array
    if (isArray) {
        var obj2Array = eval('obj2' + parentPath);
        var found = false;
        var index = 0;
        for (index = 0; index < obj2Array.length; index++) {
            var key2 = _.keys(obj2Array[index]);
            var key1 = _.keys(obj1);

            //check the key2 and key1 has a same value
            var key1Index;
            var key2Index;
            for (key2Index = 0; key2Index < key2.length; key2Index++) {
                for (key1Index = 0; key1Index < key1.length; key1Index++) {
                    if (key1[key1Index] === key2[key2Index]) {
                        found = true;
                        index = key2Index;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
            if (found) {
                path = parentPath + '[' + index + ']';
            } else {
                path = parentPath + '[' + (obj2Array.length) + ']';
            }
        }
    }

    //create a new object if obj2 has no obj
    if (!eval('obj2' + path)) {
        eval('obj2' + path + '= {}');
    }

    //if obj1 is not an object, means primitive type, copy it to obj2 directly
    if (typeof obj1 !== 'object') {
        eval('obj2' + path + '= obj1');
        return obj2;
    }

    isArray = false;
    var i;
    for (i in obj1) {
        var newPath;
        if (obj1 instanceof Array) {
            newPath = path + '[' + i + ']';
            isArray = true;
        } else {
            newPath = path + '.' + i;
        }
        obj2 = mergeObjectDeep(obj1[i], obj2, newPath, path, isArray);
    }

    return obj2;
}

/**
 *	This function is to remove all html tags in a string
 *
 *	@param {str}
 *
 *	@return - a string without html tags
 *	@type - string
 **/
function removeHtmlTag(str) {
    if (!str) {
        return null;
    }
    return str.replace(/<[^>]+>/g, "");
}

/**
 *	This function is to remove all html tags but image tag in a string
 *
 *	@param {String} str
 *
 *	@returns {String} - a string without html tags
 *	@type - string
 **/
function removeHtmlTagButImage(str) {
    if (!str) {
        return null;
    }

    // the Regexp will cause out of memory if the text is large, e.g.5M
    //	return str.replace(/<(?!img)[^>]+>/g,"");

    var begin = str.indexOf("<", 0);
    if (begin == -1) {
        return str;
    }

    var end = str.indexOf(">", begin);
    if (end == -1) {
        return str;
    }

    var strA = "";

    // if the tag is <img...>, keep the string unchanged
    if (end - begin > 3 && str.charAt(begin + 1) == "i" && str.charAt(begin + 2) == "m" && str.charAt(begin + 3) == "g") {
        strA = str.substring(0, end + 1);
    }
    // normal text, keep unchanged
    else if (begin > 0) {
        strA = str.substring(0, begin);
    }

    // ">" is the last character
    if (end == str.length - 1) {
        return strA;
    }

    // drop the non image content those start with "<" and end with ">"
    var strB = str.substring(end + 1);

    return strA + removeHtmlTagButImage(strB);
}