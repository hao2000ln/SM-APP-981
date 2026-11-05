/****************************************************************************************
 *Auther: Zhichao Fei
 *Create Date: 2014-01-09
 *Function:Execute this APIs when operator add/update/close the incident tickets.
 *
 *****************************************************************************************/
var _parseXml = lib.CaseExchangeRuleType_Manager.parseRuleSetXMLAsObject;
var _splitString = lib.CaseExchangeRuleType_Manager.splitString
var _moveAttachment = lib.CaseExchange_AttachHandling.moveQueueAttachToIncident;
var JSON = system.library.JSON.json();

var PARAMETER_INTERNALID = "internalId";

/*
Function:Execute specified RuleSet

Parameter: New file, Old file and rulename are required

*/

function executeSingleRuleSet(file, oldFile, ruleName) {
    var rteReturnValue = new SCDatum();
    var rteNames = new SCDatum();
    var rteVals = new SCDatum();

    rteNames.setType(8);
    rteNames.push("file");
    rteNames.push("name");
    rteNames.push("second.file");
    rteVals.setType(8);
    rteVals.push(file);
    rteVals.push(ruleName);
    rteVals.push(oldFile);
    try {
        system.functions.rtecall("callrad", rteReturnValue, "Ruleset.run", rteNames, rteVals, false);
    } catch (ex) {
        throw ex;
    }
}
/*
Function:Put the ticket data and attachment data to SMISTaskQueue table.

*/

function putTicketDataToTaskQueue(xmlString, file, oldfile, isJSONFormat) {
    var isSuccess = false;
    if (xmlString != null && xmlString != "" &&
        file != null) {
        var rulseConfig = null;

        if (!isJSONFormat) {
            var xml = new XML();
            xml.setContent(xmlString);
            rulseConfig = _parseXml(xml);
        } else {
            rulseConfig = JSON.parse(xmlString);
            rulseConfig.selected = rulseConfig.selectedfields;
            rulseConfig.selector = rulseConfig.fieldselector;
        }

        var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(rulseConfig.connctor);
        var innerTicketKey = smisConfig.getConfigParameterValue("internalId");

        if (smisConfig == null || smisConfig.status == "Disabled") {
            return false;
        }

        //If SMIS Instance is disable, return false directly.
        var fieldArray = _splitString(rulseConfig.selected, ",");
        var taskfile = _createTask(rulseConfig.connctor, rulseConfig.event, fieldArray, file, smisConfig, oldfile);
        var attachments = file.getAttachments();
        var isActive = lib.CaseExchange_AttachHandling.isAttachmentSwitchActive(smisConfig);
        if (isActive) {
            var smNewAttachments = new Array();
            if (vars['$L.mode'] == 'add') {
                smNewAttachments = attachments;
            } else {
                lib.CaseExchange_AttachRelationShip.markAttachRemovedBySM(file[innerTicketKey], attachments, rulseConfig.connctor);
                smNewAttachments = lib.CaseExchange_AttachRelationShip.getSMCreatedAttachmentIds(file[innerTicketKey], attachments, rulseConfig.connctor);
            }
            lib.OutboundTaskReceiver.pushTask(taskfile, smNewAttachments);
        } else {
            lib.OutboundTaskReceiver.pushTask(taskfile, null);
        }
        isSuccess = true;
    }
    return isSuccess;
}

/*
Function:Create a task and put it in queue
*/
function _createTask(instanceid, event, fieldsArray, file, smisconfig, oldfile) {
    if ((fieldsArray == null || fieldsArray.length == 0) || file == null) {
        throw ("Case Exchange Rule type don't configure any fields or you don't pass the file.");
    }

    var intefieldname = smisconfig.getConfigParameterValue(PARAMETER_INTERNALID);
    var tablename = system.functions.filename(file);
    var task = new(lib.smis_Task.getClass())(smisconfig.intId);
    task.integrationName = smisconfig.name;
    task.action = event;
    task.internalId = file[intefieldname];
    task.intId = instanceid;
    var externalRef = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(tablename, file[intefieldname], null, instanceid);
    if (externalRef) {
        task.externalId = externalRef['externalId'];
    }

    if (!task.externalId) {
        task.externalId = vars['$externalId'];
    }

    var recordJson = {};
    var i;
    var fieldAttr;
    var currentValue;
    var oldValue;
    for (i = 0; i < fieldsArray.length; i++) {
        fieldAttr = lib.CaseExchangeRuleType_Manager.getFieldAttribute(instanceid, fieldsArray[i]);
        if (fieldAttr != null) {
            //The field is a variable
            if (fieldAttr.type == "variable") {
                if (vars[fieldsArray[i]] != null && vars[fieldsArray[i]] != "") {
                    if (system.functions.type(vars[fieldsArray[i]]) == 8) {
                        currentValue = _arrayToString(vars[fieldsArray[i]]);
                    } else {
                        currentValue = system.functions.str(vars[fieldsArray[i]]);
                    }
                }
            }
            //The field is a table field.
            else {
                if (system.functions.type(file[fieldsArray[i]]) == 8) {
                    currentValue = _arrayToString(file[fieldsArray[i]]);
                } else {
                    currentValue = file[fieldsArray[i]];
                }

                if (vars['$L.mode'] != 'add') {
                    if (system.functions.type(oldfile[fieldsArray[i]]) == 8) {
                        oldValue = _arrayToString(oldfile[fieldsArray[i]]);
                    } else {
                        oldValue = oldfile[fieldsArray[i]];
                    }
                }
            }

            recordJson[fieldsArray[i]] = currentValue;
            if (vars['$L.mode'] != 'add' && fieldAttr.type != "variable") {
                if (recordJson['oldvalues'] == null && recordJson['oldvalues'] == undefined) {
                    recordJson['oldvalues'] = {};
                }
                if (oldValue != currentValue) {
                    recordJson['oldvalues'][fieldsArray[i]] = oldValue;
                }
            }
        }
    }

    //Put ticket update
    pushTicketUpdatesAndActivity(file, oldfile, recordJson, fieldsArray);
    task.direction = lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
    task.object = tablename;
    task.inRecord = recordJson;
    return task;
}

function _arrayToString(arrDescription) {
    var strDescription = "";
    if (arrDescription != null) {
        var i;
        var linestr;
        for (i = 0; i < arrDescription.length(); i++) {
            linestr = arrDescription[i] == null ? "" : arrDescription[i];
            if (strDescription == null || strDescription == "") {
                strDescription = arrDescription[i];
            } else {
                strDescription = strDescription + "\n" + linestr;
            }
        }
    }
    return strDescription;
}

/**	
 *   This fuction is to put incident update information and update activity to TaskQueue
 *
 *	@param {file} - incident new file.
 *	@param {oldfile} - incident old file.
 *   @param {inRecords} - TaskQueue data Json
 *	@param {smFields} - Selected fields in RuleSet
 */
function pushTicketUpdatesAndActivity(file, oldfile, inRecords, smFields) {
    //Set ticket updates
    var curObject = {};
    var oldObject = {};

    var i;
    for (i = 0; i < smFields.length; i++) {
        if (system.functions.type(curObject[smFields[i]]) == 8) {
            curObject[smFields[i]] = _arrayToString(file[smFields[i]]);
            oldObject[smFields[i]] = _arrayToString(oldfile[smFields[i]]);
        } else {
            curObject[smFields[i]] = file[smFields[i]];
            oldObject[smFields[i]] = oldfile[smFields[i]];
        }
    }
    var updateFields = lib.CaseExchange_CommonLib.compareSetSMRecord(oldObject, curObject, false);
    if (updateFields != null) {
        var updateMsg = lib.CaseExchange_CommonLib.updateFieldsToString(updateFields, system.functions.filename(file));
        if (updateMsg != null && updateMsg != "") {
            inRecords['ticket.updates'] = updateMsg;
        }
    }
}