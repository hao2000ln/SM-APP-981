/****************************************************************************************
 *Auther: Zhichao Fei
 *Create Date: 20140327
 *Function: Push ticket data to SMIS task queue
 *
 *
 *****************************************************************************************/
var logger = lib.CaseExchangeLogger.getLogger();


/**
 * This function is put ticket data into task queue.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @return {internalId} - InternalID
 *
 */

function pushTicketDataToQueue() {
    var instanceId = vars['$L.file']['ce.ack.instanceId'];
    var externalId = vars['$L.file']['ce.ack.externalId'];
    var isPass = requestValidate(vars['$L.file']);

    //External system provide invalida data.
    if (!isPass) {
        return;
    }
    try {
        var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceId);
        var objectName = smisConfig.getConfigParameterValue("object");
        var rawData = getRawData();
        var wsAction = getExternalActionName();
        var smAction = getInternalAction(wsAction, smisConfig);

        var taskObj = _createTask(instanceId, smAction, objectName, externalId, smisConfig, rawData);
        var currentTask = pushTask(taskObj);
        if (currentTask != null && currentTask['internalId'] != "" && currentTask['internalId'] != null) {
            vars['$L.file']['number'] = currentTask['internalId'];

            //query and return attachments which were posted from the external system
            var attachRelations = new SCFile("AttachmentRelationship", SCFILE_READONLY);
            var sql = "internalid=\"" + currentTask['internalId'] + "\" and internalObject=\"" + objectName + "\" and smisInstanceId=\"" + instanceId + "\"";

            if (attachRelations.doSelect(sql) === RC_SUCCESS) {
                var attachObj = {};
                do {
                    attachObj[attachRelations.epattachid] = attachRelations.smattachid;
                }
                while (attachRelations.getNext() == RC_SUCCESS);

                vars['$L.file']['ce.ack.attachment'] = lib.JSON2.toJSON(attachObj);
            }
        }
        vars.$L_exit = "normal";
    } catch (ex) {
        logger.error('CaseExchange_Pushing', ex);
    }
}
/**
 *	Package the ticket data into a Json object.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @param {joinFile} - joinFile
 * @param {objectName} - the object name that configured in smis instance.
 * @return {taskJson} - an Json object.
 *
 */

function getRawData() {
    var taskJson = {};
    var extaccess = vars["$L.extaccess.file"];
    var requestData = vars["$L.file"];

    var i;
    var field;
    var caption;
    var lng = extaccess["soafield"].length();
    for (i = 0; i < lng; i++) {
        field = extaccess["soafield"][i];
        caption = extaccess.soacaption[i] != null && extaccess.soacaption[i] != "" ? extaccess.soacaption[i] : field;
        if (requestData[field] != null) {
            taskJson[caption] = lib.EmojiUtil.convertUnicode2Emoji(requestData[field]);
        }
    }
    return taskJson;
}

/**
 * Set some mandatory data to the task object.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {pass} - SMISTaskQueue Object
 *  @param {tablename} - SMIS Instance Configuration Object.
 *  @param {externalId} - SMIS Instance Configuration Object.
 *  @param {smisconfig} - SMIS Instance Configuration Object.
 *  @param {recordJson} - SMIS Instance Configuration Object.
 *  @returns {task} - SMIS Task object
 *
 */

function _createTask(instanceid, event, tablename, externalId, smisconfig, recordJson, internalId, externalStatus) {
    if (smisconfig != "n/a") {
        var task = new(lib.smis_Task.getClass())(smisconfig.intId);
        task.integrationName = smisconfig.name;
        task.intId = instanceid;
        task.inRecord = recordJson;
        task.direction = lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
    } else {
        var task = new(lib.smis_Task.getClass());
        var callRtn = new SCDatum;
        var nextNumber = new SCDatum;
        system.functions.rtecall("getnumber", callRtn, nextNumber, "SMISTaskQueue");
        task.integrationName = "n/a";
        task.intId = "n/a";
        task.id = nextNumber.getText();;
        task.direction = "Inbound";
        task.enqueueTime = new Date();
    }

    task.action = event;
    task.externalId = externalId;
    task.internalId = internalId;
    task.object = tablename;

    return task;
}


/**
 * Verify the requestion data is valid or not.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {file} - current $L.file
 *  @returns {pass} - true/false
 *
 */

function requestValidate(file) {
    var pass = true;
    var instanceId = file['ce.ack.instanceId'];
    var externalId = file['ce.ack.externalId'];
    if (instanceId == null || instanceId == "") {
        setErrorMsg(getMessage(8));
        pass = false;
    } else if (externalId == null || externalId == "") {
        setErrorMsg(getMessage(10));
        pass = false;
    }

    if (pass) {
        var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceId);
        if (smisConfig == null) {
            setErrorMsg(getMessage(9));
            pass = false;
        } else {
            if (smisConfig.status == "Disabled") {
                setErrorMsg(getMessage(11));
                pass = false;
            } else {
                var isPulling = smisConfig.getConfigParameterValue("isPulling");
                if (isPulling) {
                    setErrorMsg(getMessage(12));
                    pass = false;
                }
            }
        }
    }
    return pass;
}


/**
 * Get REST request action name
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {taskObj} - SMISTaskQueue Object
 *  @param {configitem} - SMIS Instance Configuration Object.
 *  @returns {action} - WebService action(Create/Update)
 *
 */
function getExternalActionName() {
    var action = "";

    var currentAction = vars['$L.action'];

    currentAction = currentAction.substring(currentAction.indexOf("*SOAP*") + 6);
    var allowed_Actions = system.functions.parse(vars['$L.allowed.actions'], 8);
    var action_Names = system.functions.parse(vars['$L.action.names'], 8);

    if ((allowed_Actions != null && allowed_Actions.length() > 0) &&
        (action_Names != null && action_Names.length() > 0)) {
        for (var i = 0; i < allowed_Actions.length(); i++) {
            if (allowed_Actions[i] == currentAction) {
                action = action_Names[i];
                break;
            }
        }
    }
    return action;
}

/**
 * Get REST SM action name
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {externalAction} - SMISTaskQueue Object
 *  @param {smisConfig} - SMIS Instance Configuration Object.
 *  @returns {internalAction} - internalAction(add/save)
 *
 */
function getInternalAction(externalAction, smisConfig) {
    var internalAction = "";
    if (externalAction != null && externalAction != "") {
        var wsActionsStr = smisConfig.getConfigParameterValue("pushWSActions");
        var smActionsStr = smisConfig.getConfigParameterValue("pushSMActions");
        var wsActionArray = wsActionsStr.split("~");
        var smActionsArray = smActionsStr.split("~");
        for (var i = 0; i < wsActionArray.length; i++) {
            if (externalAction == wsActionArray[i]) {
                internalAction = smActionsArray[i];
                break;
            }
        }
    }
    return internalAction;
}


/**
 * Create a task record and execute immediately.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {task} - Task object
 *  @returns {task} - Task object
 *
 */

function pushTask(task) {
    var intId = task.intId;
    var configItem = lib.smis_ConfigurationManager._getInstanceConfigByIntId(intId);
    task.integrationName = configItem.name;
    task.status = lib.smis_Constants.TASK_STATUS_RUNNING();
    // push to task queue first
    var taskId = lib.smis_TaskManager.pushTask(task);
    if (taskId != null) {
        var findTask = new SCFile("SMISTaskQueue");
        var ret = findTask.doSelect("id=\"" + taskId + "\"");
    }

    var bootstrap = new(lib.smis_Bootstrap.getClass())(configItem);
    return bootstrap.runnow(taskId);
}


/**
 *	Put alert message to webservice response
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {msg} - Message string
 *
 */
function setErrorMsg(msg) {
    vars.$L_jsmessage = msg;
}


/**
 *	Put alert message to webservice response
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 *  @param {msgrecord} - Message reocrd id
 *  @param {msgArgs} - Message record arguments
 */
function getMessage(msgrecord, msgArgs) {
    if (msgArgs == null) {
        return system.functions.scmsg(msgrecord, "CaseExchange");
    } else {
        return system.functions.scmsg(msgrecord, "CaseExchange", msgArgs);
    }
}


/**
 * This function is to create the external reference via SMIS task queue.
 * <br>
 * History:<br>
 * 20140227 - <Zhichao Fei>  Add the function
 *
 * @date	20140227
 * @return  $L.exit=normal
 *
 */
function createExternalReferenceWithSMIS() {
    var instanceId = vars['$L.file']['ce.ack.instanceId'];
    var externalId = vars['$L.file']['ce.ack.externalId'];
    var internalId = vars['$L.file']['ce.ack.internalId'];
    var externalStatus = vars['$L.file']['ce.ack.externalStatus'];
    var isPass = requestValidate(vars['$L.file']);

    //External system provide invalida data.
    if (!isPass) {
        return;
    }
    try {
        var smisConfig = lib.smis_ConfigurationManager.getInstanceConfig(instanceId);
        var objectName = smisConfig.getConfigParameterValue("object");
        var rawData = getRawData();
        var wsAction = getExternalActionName();
        var smAction = getInternalAction(wsAction, smisConfig);
        createExternalReference(instanceId, objectName, externalId, smisConfig, internalId, externalStatus);

        var taskObj = _createTask(instanceId, smAction, objectName, externalId, smisConfig, rawData, internalId, externalStatus);
        var currentTask = pushTask(taskObj);
        if (currentTask != null && currentTask['internalId'] != "" && currentTask['internalId'] != null) {
            //query and return attachments which were posted from the external system
            var attachRelations = new SCFile("AttachmentRelationship", SCFILE_READONLY);
            var sql = "internalid=\"" + currentTask['internalId'] + "\" and internalObject=\"" + objectName + "\" and smisInstanceId=\"" + instanceId + "\"";

            if (attachRelations.doSelect(sql) === RC_SUCCESS) {
                var attachObj = {};
                do {
                    attachObj[attachRelations.epattachid] = attachRelations.smattachid;
                }
                while (attachRelations.getNext() == RC_SUCCESS);

                vars['$L.file']['ce.ack.attachment'] = lib.JSON2.toJSON(attachObj);
            }
        }


        vars.$L_exit = "normal";
    } catch (ex) {
        logger.error('Case Exchange Acknowledge: ', ex);
    }
}


/**
 * This function is to create the external reference without SMIS task queue.
 * <br>
 * History:<br>
 * 20140725 - <Jan Steube  Add the function
 *
 * @date	20140725
 * @return  $L.exit=normal
 *
 */
function createExternalReferenceWithoutSMIS() {
    var instanceId = vars['$L.file']['ce.ack.instanceId'];
    var externalId = vars['$L.file']['ce.ack.externalId'];
    var internalId = vars['$L.file']['ce.ack.internalId'];
    var externalStatus = vars['$L.file']['ce.ack.externalStatus'];
    var objectName = "probsummary";
    var wsAction = getExternalActionName();
    var smAction = vars['$L.action'];
    smAction = smAction.substring(smAction.indexOf("*SOAP*") + 6);

    try {
        var smRecord = new SCFile(objectName);
        if (internalId) {
            smRecord.doSelect('number="' + internalId + '"');

            vars["$apm.activity"] = 'External Update';
            vars["$pmc.actions"] = vars['$L.file']['update.action'];
            if (vars["$pmc.actions"] == '' || (lib.smis_CommonLib.isArray(vars["$pmc.actions"]) && vars["$pmc.actions"][0] == null) || vars["$pmc.actions"] == null) {
                vars["$pmc.actions"] = 'no update provided';
            } else {
                vars["$pmc.actions"] = lib.EmojiUtil.convertUnicode2Emoji(vars["$pmc.actions"]);
            }
        }
        smRecord = syncRequestDataToSCfile(vars['$L.file'], smRecord);

        if (wsAction == 'Acknowledge') {
            smRecord.ce_pending_updates = [];
            smAction = 'save';
        }
        if (vars['$L.file']['vendor'] && vars['$L.file']['problem.status'] != 'Pending Vendor') {
            smRecord.vendor = null;
        }
        result = smRecord.doAction(smAction);
        vars["$pmc.actions"] = null;
        if (result != RC_SUCCESS) {
            return RCtoString(result);
        }

        var rawData = getRawData();
        if (!internalId) {
            internalId = smRecord.number;
        }
        createExternalReference("n/a", objectName, externalId, "n/a", internalId, externalStatus);
        var taskObj = _createTask(instanceId, wsAction, objectName, externalId, "n/a", rawData, internalId, externalStatus);
        var taskLog = lib.smis_TaskLogManager.pushSMISTaskLog(taskObj, "Success");

        vars['$L.file']['number'] = smRecord.number;
        vars.$L_exit = "normal";
    } catch (ex) {
        logger.error('Case Exchange Acknowledge: ', ex);
    }
}


function syncRequestDataToSCfile(requestData, scfile) {
    var extaccess = vars["$L.extaccess.file"];
    var i;
    var field;
    var lng = extaccess["soafield"].length();
    for (i = 0; i < lng; i++) {
        field = extaccess["soafield"][i];
        if (requestData[field] != null && field != "update.action") {
            scfile[field] = lib.EmojiUtil.convertUnicode2Emoji(requestData[field]);
        }
    }

    return scfile;
}


function createExternalReference(instanceid, tablename, externalId, smisconfig, internalId, externalStatus) {
    // check if external reference exists                           
    var externalRef = lib.CaseExchangeExternalReferencesDAO.getExternalReferencesByObjIdIntid(tablename, internalId, externalId, instanceid);

    if (!externalRef) {
        // create new reference record 
        var externalRef = {};
        if (smisconfig != "n/a") {
            externalRef.smisInstanceName = smisconfig.name;
        } else {
            externalRef.smisInstanceName = "n/a";
        }
        externalRef.smisInstanceId = instanceid;
        externalRef.creationTime = new Date();
        externalRef.externalId = externalId;
        externalRef.externalStatus = externalStatus;
        externalRef.internalId = internalId;
        externalRef.internalObject = tablename;
        externalRef.initiator = "SM";
        externalRef.active = true;
    } else {
        // if external reference exists, set new status
        externalRef.externalStatus = externalStatus;
        if (externalStatus == "Closed") externalRef.active = false;
    }
    lib.CaseExchangeExternalReferencesDAO.createSave(externalRef);

    return;
}