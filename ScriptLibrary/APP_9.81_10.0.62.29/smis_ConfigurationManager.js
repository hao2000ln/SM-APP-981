/******************************************************
 * Module Name: SMIS Configuration manager
 * Function: contain functions to manage integration instances
 * Author: Xing, Jiang-Bing
 * Version: 1.25
 * Creation Date: spr, 2009
 * Modification: Jude Ezeobiejesi, 09/29/2011.
 * Modification:   
 *******************************************************/
var $ = lib.c.$;

//to store global singleton instance
function SingletonInstanceContainer() {}

function singletonInstance() {
    return SingletonInstanceContainer.instance;
}

/**
 * Get the whole specified Config Item instance
 *
 * @param {String} intId
 *          Integration instance ID
 */
function getInstanceConfig(intId) {
    var instance = _getInstanceConfigByIntId(intId);
    SingletonInstanceContainer.instance = instance;
    return instance;
}


function setInstanceStatus(intId, status) {
    var curConfig = _getRawInstanceConfigByIntId(intId);
    if (curConfig == null) {
        return false;
    }

    var log = _getLog(curConfig);

    if (curConfig.status == status) {
        return true;
    }

    //reset the status to "Running"
    curConfig.status = status;

    //update the current configuration instance
    var rc = curConfig.doUpdate();

    if (log.isDebugEnabled()) {
        log.debug("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_1", "smis", [funcs.scmsg("SMISConfigurationStatus;" + status, "global")]));
    }

    return rc == RC_SUCCESS;
}

/**
 * Enable the integration instance, just modify the status of the instance to Running
 * 
 * @param {String} intId
 *          Integration instance ID
 * @returns {Boolean} 
 */
function enableInstance(intId) {

    var curConfig = _getRawInstanceConfigByIntId(intId);
    var log = _getLog(curConfig);

    if ((curConfig != null && curConfig.status != null) && curConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_2", "smis"));
        return false;
    }

    // Check if can be enabled
    var configItem = _getInstanceConfigByIntId(intId);

    var managerName = configItem.mgrName;
    var manager = new(lib[managerName].getClass())(configItem);

    // hook manager's beforeEnableInstance when enabling instance
    if (manager.beforeEnableInstance) {
        var result = manager.beforeEnableInstance();
        if (result === false) {
            log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_21", "smis", [intId]));
            return false;
        }
    }

    //reset the status to "Running"
    curConfig.status = lib.smis_Constants.INSTANCE_STATUS_SLEEPING();
    //update the current configuration instance
    var rc = curConfig.doUpdate();
    log.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_2", "smis"));

    if (rc != RC_SUCCESS) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_3", "smis"));
    }

    // hook manager's enableInstance when enabling instance
    if (manager.enableInstance) {
        manager.enableInstance();
    }

    //enable flag
    _updateFlag(configItem.template, true);
    _initGlobalVariables(configItem.getParametersByCategory(lib.smis_Constants.GLOBAL_CATEGORY()));

    if (configItem.isScheduleBased()) {
        lib.smis_SchedulerManager.addScheduleRecord(configItem);
        _addScheduler(curConfig);
        //Check if the scheduler is running, if not, start it
        var hasRunningSch = lib.smis_SchedulerManager.getProcID(curConfig) != null;

        if (!hasRunningSch) {
            log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_4", "smis"));
            lib.smis_SchedulerManager.triggerSchedule(curConfig);
        }
    }

    // hook manager's afterEnableInstance
    if (manager.afterEnableInstance) {
        manager.afterEnableInstance();
    }

    return true;
}

/**
 * Disable the integration instance, just modify the status of the instance to Disable.
 * And if the status is Error, this function can be used to modify the status to Disabled
 *
 * @param {String} intId
 *          Integration instance ID
 * @param {Boolean} isForce
 */
function disableInstance(intId, isForce) {
    var curConfig = _getRawInstanceConfigByIntId(intId);
    if (curConfig == null) {
        return;
    }

    var log = _getLog(curConfig);

    if (isForce === undefined) {
        isForce = false;
    }

    // add by Scott
    // check if support scheduler
    var configItem = _getInstanceConfigByIntId(intId);
    if (configItem != null) {
        _clearGlobalVariables(configItem.getParametersByCategory(lib.smis_Constants.GLOBAL_CATEGORY()));
    }

    if (configItem != null && configItem.isScheduleBased() && (curConfig == null || curConfig.status != lib.smis_Constants.INSTANCE_STATUS_SLEEPING()) && !isForce) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_5", "smis", [funcs.scmsg("SMISConfigurationStatus;Sleeping", "global")]));
        return;
    }

    if (curConfig.status == lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
        return;
    }

    if (configItem != null) {
        var managerName = configItem.mgrName;
        var manager = new(lib[managerName].getClass())(configItem);
        if (manager.disableInstance) {
            manager.disableInstance();
        }
    }

    if (configItem != null && configItem.isScheduleBased()) {
        lib.smis_SchedulerManager.deleteScheduleRecord(configItem);

        var schedClass = lib.smis_SchedulerManager.getInfoType(configItem);
        if (!lib.smis_SchedulerManager.hasScheduleRecord(schedClass)) {
            var hasRunningSch = lib.smis_SchedulerManager.getProcID(curConfig) != null;
            if (hasRunningSch) {
                log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_6", "smis"));
                lib.smis_SchedulerManager.stopSchedule(curConfig);

                if (lib.smis_SchedulerManager.getProcID(curConfig) != null) {
                    lib.smis_SchedulerManager.stopSchedule(curConfig);
                }

                if (lib.smis_SchedulerManager.getProcID(curConfig) != null) {
                    log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_7", "smis"));
                }
            }
        }
    }

    //reset the status to "Disable" 
    curConfig.status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
    //update the current configuration instance
    var RC = curConfig.doUpdate();
    log.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_8", "smis"));

    if (RC != RC_SUCCESS) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_9", "smis"));
    }

    if (configItem != null) {
        updateScheduleFlag(configItem.template);
    }
}

/**
 * Delete the specified Instance Config. Before delete the instance, there are several steps should be considered.
 * 1.check if the current status is disabled. //TODO or sleep
 * 2.check if there is a running scheduler for this instance
 * 3.if has scheduler, kill it
 * 4.Delete the corresponding Field Mapping
 * 5.Delete the current instance config
 * 6.Delete the scheduler related Record, such as Schedule record, Info record, processor in Info 'startup'
 *
 * @param {String} intId
 *          current instance config ID
 * @param {Boolean} force
 */
function deleteInstanceConfig(intId, force) {

    var curConfig = _getInstanceConfigByIntId(intId);
    var log = _getLog(curConfig);

    // check the status of the current of this instance
    if ((curConfig == null || (curConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE() && curConfig.status != null)) && !force) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_10", "smis", [funcs.scmsg("SMISConfigurationStatus;Disabled", "global")]));
        return false;
    }

    var configItem = _getInstanceConfigByIntId(intId);

    // check if exists the field mapping with the specified intid, and delete it
    var mapping = new SCFile("SMISFieldMapping");
    var RC = mapping.doSelect("intId=\"" + intId + "\"");
    var delFM = true;

    // delete the corresponding Filed Mapping
    if (RC == RC_SUCCESS) {
        log.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_11", "smis", [intId]));
        if (mapping.doDelete() != RC_SUCCESS) {
            log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_12", "smis", [intId]));
            delFM = false;
        }
    }

    // delete the Instance Config
    var intConfig = _getRawInstanceConfigByIntId(intId);
    if (intConfig == null) {
        return false;
    }

    var delInt = true;
    log.info("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_13", "smis", [intId]));

    if (intConfig.doDelete() != RC_SUCCESS) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_14", "smis", [intId]));
        delInt = false;
    }

    if (!configItem) {
        return delInt && delFM;
    }

    // check if support scheduler
    var isScheduleBased = configItem.isScheduleBased();

    var delScheduler = true;
    if (isScheduleBased) {
        // delete the corresponding scheduler
        delScheduler = _deleteScheduler(curConfig);
    }

    // after delete instance
    if (delInt) {
        var managerName = configItem.mgrName;
        var manager = new(lib[managerName].getClass())(configItem);
        if (manager.afterDelInstance) {
            manager.afterDelInstance();
        }
    }

    return delInt && delFM && delScheduler;
}


function refreshIntegrationInstances() {

    var instanceConfig = new SCFile("SMISConfiguration");
    var RC = instanceConfig.doSelect("intId <> \"0\"");

    while (RC == RC_SUCCESS) {
        refreshIntegrationInstance(instanceConfig);
        RC = instanceConfig.getNext();
    }
}


/**
 * refresh integration instance
 *
 * @param {SCFile} instanceConfig
 */
function refreshIntegrationInstance(instanceConfig) {

    if (!instanceConfig) {
        return;
    }

    // add by Scott
    // check if support scheduler
    var configItem = _getInstanceConfigByIntId(instanceConfig.intId);

    if (configItem.isScheduleBased()) {
        // Reset the status
        var procId = lib.smis_SchedulerManager.getProcID(instanceConfig);
        var scheduleStatus = lib.smis_SchedulerManager.getScheduleStatus(instanceConfig);

        if (procId == null) {
            if (instanceConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
                setInstanceStatus(instanceConfig.intId, lib.smis_Constants.INSTANCE_STATUS_DISABLE());
                instanceConfig.status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
            }
        } else {
            if (scheduleStatus == lib.smis_Constants.SCHEDULE_STATUS_RUNNING()) {
                setInstanceStatus(instanceConfig.intId, lib.smis_Constants.INSTANCE_STATUS_RUNNING());
                instanceConfig.status = lib.smis_Constants.INSTANCE_STATUS_RUNNING();
            } else if (scheduleStatus == lib.smis_Constants.SCHEDULE_STATUS_RESCHEDULED()) {
                setInstanceStatus(instanceConfig.intId, lib.smis_Constants.INSTANCE_STATUS_SLEEPING());
                instanceConfig.status = lib.smis_Constants.INSTANCE_STATUS_SLEEPING();
            } else if (scheduleStatus == lib.smis_Constants.SCHEDULE_STATUS_FAILED()) {
                setInstanceStatus(instanceConfig.intId, lib.smis_Constants.INSTANCE_STATUS_ERROR());
                instanceConfig.status = lib.smis_Constants.INSTANCE_STATUS_ERROR();
            }
        }
    } else {
        // For the non-ScheduleBased integration, define the function refreshInstanceStatus in Manager Class
        // Return the instance status by checking the status of process and schedule
        var manager = new(lib[configItem.mgrName].getClass())(configItem);
        if (manager.refreshInstanceStatus) {
            instanceConfig.status = manager.refreshInstanceStatus();
            setInstanceStatus(instanceConfig.intId, instanceConfig.status);
        }
    }

    if (vars.$G_system_info) {
        var flag = vars.$G_system_info[configItem.template];
        if (instanceConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
            if (!flag) {
                _updateFlag(configItem.template, true);
                _initGlobalVariables(configItem.getParametersByCategory(lib.smis_Constants.GLOBAL_CATEGORY()));
            }
        } else {
            if (flag) {
                _updateFlag(configItem.template, false);
            }
        }
    }
}


function updateScheduleFlag(template) {
    var flag = false;

    var instanceConfig = new SCFile("SMISConfiguration", SCFILE_READONLY);
    instanceConfig.setFields(["intId", "status"]);
    var RC = instanceConfig.doSelect("intId <> \"0\" and template=\"" + template + "\"");

    if (RC == RC_SUCCESS) {
        while (RC == RC_SUCCESS) {

            // add by Scott
            // check if support scheduler
            var configItem = _getInstanceConfigByIntId(instanceConfig.intId);

            //Reset the status
            if (instanceConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
                flag = true;
                _initGlobalVariables(configItem.getParametersByCategory(lib.smis_Constants.GLOBAL_CATEGORY()));
                break;
            }

            RC = instanceConfig.getNext();
        }
    }
    _updateFlag(template, flag);
}


/**
 * Save the Instance Config
 * @param config {Object}. this config is generated from the method getInstanceConfig
 */
function updateParam(config) {

    if (config == null) {
        throw "The instance configuration passed in is null.";
    }

    var log = _getLog(config);

    var con = new SCFile("SMISConfiguration");
    var RC = con.doSelect("intId = \"" + config.intId + "\"");

    if (RC != RC_SUCCESS) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_15", "smis"));
        return;
    }

    var i;
    for (i in config.paramInfo) {
        con.paramInfo[i].paramName = config.paramInfo[i].paramName;
        con.paramInfo[i].paramValue = config.paramInfo[i].paramValue;
        con.paramInfo[i].paramDesc = config.paramInfo[i].paramDesc;
        con.paramInfo[i].paramCategory = config.paramInfo[i].paramCategory;
        con.paramInfo[i].ispwd = config.paramInfo[i].ispwd;
        con.paramInfo[i].paramType = config.paramInfo[i].paramType;
        if (con.paramInfo[i].paramType == null) {
            con.paramInfo[i].paramType = "Character";
        }
    }
    RC = con.doUpdate();

    if (RC != RC_SUCCESS) {
        log.warning("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_16", "smis", [RCtoString(RC)]));
        return;
    }

    if (log.isDebugEnabled()) {
        log.debug("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_17", "smis"));
    }
}

/**
 * Add the scheduler related record.
 *
 * @param {String} intId
 * @param {String} oldIntName
 * @param {String} oldSharedScheduler
 */
function setupScheduler(intId, oldIntName, oldSharedScheduler) {

    var curConfig = _getInstanceConfigByIntId(intId);
    if (curConfig == null) {
        return;
    }

    // var log = _getLog(curConfig);

    //if the instance name is changed, delete the scheduler first.
    if (curConfig.isScheduleBased()) {
        if (!oldIntName) {
            _addScheduler(curConfig);
        } else if (curConfig.sharedScheduler != oldSharedScheduler ||
            (curConfig.sharedScheduler != null && curConfig.sharedScheduler != "" && oldIntName != null && oldIntName != curConfig.name)) {
            var cloneConfig = {};

            var p;
            for (p in curConfig) {
                cloneConfig[p] = curConfig[p];
            }

            cloneConfig.name = oldIntName;
            cloneConfig.sharedScheduler = oldSharedScheduler;

            _deleteScheduler(cloneConfig);
            _addScheduler(curConfig);
        }
    }
}

function _addScheduler(curConfig) {
    // add info record
    lib.smis_SchedulerManager.addInfoRecord(curConfig);

    // Add Insert processor to Info 'startup', ensure that the current scheduler can start automatically when SM server start.
    if (curConfig.runOnStartup) {
        lib.smis_SchedulerManager.addProcessRecordToStartup(curConfig);
    } else {
        lib.smis_SchedulerManager.removeProRecordInStartup(curConfig);
    }
}

function _deleteScheduler(curConfig) {
    var log = _getLog(curConfig);
    if (log.isDebugEnabled()) {
        log.debug("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_18", "smis"));
    }

    // delete the schedule record
    var delSch = lib.smis_SchedulerManager.deleteScheduleRecord(curConfig);

    // delete info record of this instance
    var delInfo = true;
    var delPro = true;
    if (curConfig.sharedScheduler == null || curConfig.sharedScheduler == "") {
        delInfo = lib.smis_SchedulerManager.deleteInfoRecord(curConfig);
        // delete processor record in startup
        delPro = lib.smis_SchedulerManager.removeProRecordInStartup(curConfig);
    } else {
        var schedClass = lib.smis_SchedulerManager.getInfoType(curConfig);
        var hasScheduleRecord = lib.smis_SchedulerManager.hasScheduleRecord(schedClass);
        var hasSharedInstance = _hasSharedInstance(curConfig.sharedScheduler);

        if (!hasScheduleRecord && !hasSharedInstance) {
            delInfo = lib.smis_SchedulerManager.deleteInfoRecord(curConfig);
            // delete processor record in startup for this instance
            delPro = lib.smis_SchedulerManager.removeProRecordInStartup(curConfig);
        }
    }

    return delSch && delInfo && delPro;
}

function _hasSharedInstance(sharedScheduler) {
    var smisInstance = new SCFile("SMISConfiguration", SCFILE_READONLY);
    smisInstance.setFields("intId");
    var ret = smisInstance.doSelect("sharedScheduler=\"" + sharedScheduler + "\"");
    return ret == RC_SUCCESS;
}

//////////////////////////////////////////////////////
//The functions below are used on UI 
//
//////////////////////////////////////////////////////

function validateConfiguration(config) {

    if (config == null) {
        throw "Integration instance is not passed in.";
    }

    var configItem = _getInstanceConfigByTemplate(config);

    //validate instance name
    if (config.name == null || config.name == "") {
        return lib.smis_CommonLib.msg("2");
    }
    var intId = getIntIdByName(config.name, config.intId);
    if (config.intId != null && intId != null) {
        return lib.smis_CommonLib.msg("56");
    } else if (config.intId == null && intId != null) {
        return lib.smis_CommonLib.msg("56");
    }

    if (config.mgrName == null || config.mgrName == "") {
        return lib.smis_CommonLib.msg("3");
    }
    if (config.version == null || config.version == "") {
        return lib.smis_CommonLib.msg("4");
    }
    if (config.SMAdapter == null || config.SMAdapter == "") {
        return lib.smis_CommonLib.msg("5");
    }
    if (config.EPAdapter == null || config.EPAdapter == "") {
        return lib.smis_CommonLib.msg("6");
    }
    if (configItem.isScheduleBased() && config.intervalTime == null) {
        return lib.smis_CommonLib.msg("7");
    }
    if (configItem.isScheduleBased() && config.maxRetryTime == null) {
        return lib.smis_CommonLib.msg("8");
    }

    var patternInterval = new RegExp("^[0-9]*[0-9]*$", "ig");
    if (config.intervalTime != null && !patternInterval.test(config.intervalTime)) {
        return lib.smis_CommonLib.msg("9");
    }
    var patternMax = new RegExp("^[0-9]*[0-9]*$", "ig");
    if (config.maxRetryTime != null && !patternMax.test(config.maxRetryTime)) {
        return lib.smis_CommonLib.msg("10");
    }

    return null;
}

function initParams(rawConfig) {
    var configItem = _getInstanceConfigByTemplate(rawConfig);
    if (configItem.getManager().initParams) {
        configItem.getManager().initParams(configItem);
    }
}

function getIntIdByName(name, intId) {
    var configItem = new SCFile("SMISConfiguration", SCFILE_READONLY);
    configItem.setFields(["intId"]);
    var sql = "name=\"" + name + "\"";
    if (intId != null) {
        sql += " and intId <> \"" + intId + "\"";
    }
    var RC = configItem.doSelect(sql);

    if (RC == RC_SUCCESS) {
        return configItem.intId;
    } else {
        return null;
    }
}

function getInstanceCount(template) {
    var configItem = new SCFile("SMISConfiguration", SCFILE_READONLY);
    configItem.setFields(["intId"]);

    return configItem.doCount("template=\"" + template + "\"");
}

function checkParameters(file) {
    var errorMsg = checkDuplicatedParameter();
    if (errorMsg == null) {
        errorMsg = validateCustomParams(file);
    }

    return errorMsg;
}

/**
 * validate fields: name can't be empty, must be complete
 */
function validateFields(file) {
    var SMFields = file.SMFields;
    var EPFields = file.EPFields;

    var smlng = funcs.lng(SMFields);
    var eplng = funcs.lng(EPFields);

    var retValue = null;
    var i;
    for (i = 0; i < smlng; i++) {
        var smField = SMFields[i];
        if (smField.SMFieldName == null && smField.SMFieldType == null && smField.SMAlias == null && smField.SMFieldDesc == null) {
            continue;
        }

        if (smField.SMFieldName == null) {
            retValue = lib.smis_CommonLib.msg("62");
            break;
        }
        if (smField.SMFieldName == null || smField.SMFieldType == null || smField.SMAlias == null) {
            retValue = lib.smis_CommonLib.msg("63", [smField.SMFieldName]);
            break;
        }
    }

    for (i = 0; i < eplng; i++) {
        var epField = EPFields[i];
        if ((epField.EPFieldName == null || epField.EPFieldType == null || epField.EPAlias == null) && epField.EPFieldDesc == null) {
            continue;
        }
        if (epField.EPFieldName == null) {
            retValue = lib.smis_CommonLib.msg("62");
            break;
        }
        if (epField.EPFieldName == null || epField.EPFieldType == null || epField.EPAlias == null) {
            retValue = lib.smis_CommonLib.msg("63", [epField.EPFieldName]);
            break;
        }
    }
    return retValue;
}

function checkDuplicatedParameter() {

    var pars = [];
    var i;
    if (vars.$textparamName != null && vars.$textparamName.length() > 0) {
        for (i in vars.$textparamName) {
            pars.push(vars.$textparamName[i]);
        }
    }

    if (vars.$pwdparamName != null && vars.$pwdparamName.length() > 0) {
        for (i in vars.$pwdparamName) {
            pars.push(vars.$pwdparamName[i]);
        }
    }

    var retValue = null;
    if (pars.length > 0) {

        var dd = [];

        for (i = 0; i < pars.length; i++) {
            if (pars[i] != null && pars[i] != "") {
                dd.push(pars[i]);
            }
        }

        var sortedParams = dd.sort(new Function("a", "b", "return (a > b) ? 1: -1 "));

        for (i = 0; i < sortedParams.length - 1; i++) {
            if (sortedParams[i] == sortedParams[i + 1]) {
                retValue = lib.smis_CommonLib.msg("11", [sortedParams[i]]);
                break;
            }
        }
    }

    return retValue;
}

// init each param into variable like $param.<param name>
function initParamVariables(file) {
    var pars = file.paramInfo;
    var len = pars.length();
    var j;
    for (j = 0; j < len; j++) {
        if (pars[j] != null && pars[j].paramName != "" && pars[j].paramName != null) {
            var value = null;
            if (pars[j].paramType == "Character" || pars[j].paramType == "Number") {
                value = pars[j].paramValue;
            } else if (pars[j].paramType == "Logical") {
                value = pars[j].paramValue == "true" || pars[j].paramValue == "1";
            } else if (pars[j].paramType == "Array") {
                if (pars[j].paramValue) {
                    value = pars[j].paramValue.split(/\s*~\s*/);
                } else {
                    value = [];
                }
            } else if (pars[j].paramType == "DateTime") {
                if (pars[j].paramValue != null && pars[j].paramValue != "") {
                    value = new Date(parseInt(pars[j].paramValue, 0));
                } else {
                    value = new Date();
                }
            }

            if (pars[j].paramType == "Character" && pars[j].ispwd) {
                value = lib.EncryptUtil.decrypt(value); // decrypt password value
            }

            var paramName = "$param_" + pars[j].paramName.replace(/\./g, "_");
            vars[paramName] = value;
        }
    }
}

// init each param into variable like $param.<param name>
function populateParamFromVariables(file) {
    var pars = file.paramInfo;

    var len = pars.length();
    var j;
    for (j = 0; j < len; j++) {
        if (pars[j] != null && pars[j].paramName != "" && pars[j].paramName != null) {
            var paramName = "$param_" + pars[j].paramName.replace(/\./g, "_");
            var value = vars[paramName];

            if (pars[j].paramType == "Character" && pars[j].ispwd) {
                value = lib.EncryptUtil.encrypt(value); // encrypt password value
            }

            if (pars[j].paramType == "Character" || pars[j].paramType == "Number") {
                pars[j].paramValue = value;
            } else if (pars[j].paramType == "Logical") {
                if (value) {
                    pars[j].paramValue = "true";
                } else {
                    pars[j].paramValue = "false";
                }
            } else if (pars[j].paramType == "Array") {
                value = funcs.denull(value);
                if (value != null) {
                    pars[j].paramValue = value.join("~");
                } else {
                    pars[j].paramValue = null;
                }
            } else if (pars[j].paramType == "DateTime") {
                if (value != null) {
                    pars[j].paramValue = String(value.getTime());
                } else {
                    pars[j].paramValue = "";
                }
            }
        }
    }
}

function clearupParamVariables(file) {
    var pars = file.paramInfo;

    var len = pars.length();
    var j;
    for (j = 0; j < len; j++) {
        if (pars[j] != null && pars[j].paramName != "" && pars[j].paramName != null) {
            var paramName = "$param_" + pars[j].paramName.replace(/\./g, "_");
            vars[paramName] = null;
        }
    }
}

// validate custom params
function validateCustomParams(file) {
    var configItem = _getInstanceConfigByTemplate(file);

    var msg = null;
    try {
        var manager = configItem.getManager();
        msg = manager.validateParams();
    } catch (ex) {
        return ex;
    }
    return msg;
}


function showParamInfoSeparated(file) {
    var pars = file.paramInfo;
    vars.$pwdparamName = [];
    vars.$pwdparamValue = [];
    vars.$pwdparamCategory = [];
    vars.$pwdparamDesc = [];
    vars.$pwdparamType = [];
    vars.$pwdparamCaption = [];

    vars.$textparamName = [];
    vars.$textparamValue = [];
    vars.$textparamCategory = [];
    vars.$textparamDesc = [];
    vars.$textparamType = [];
    vars.$textparamCaption = [];

    vars.$dummyparamValue = [];
    var dummyValue = "xxxxx";

    var len = pars.length();
    var offset = 0;
    var j;
    for (j = 0; j < len; j++) {

        if (pars[j] != null && pars[j].paramName != "" && pars[j].paramName != null) { //TODO change the condition
            // initialized type to Character
            if (pars[j].paramType == null) {
                pars[j].paramType = "Character";
            }

            if (pars[j].ispwd != null && pars[j].ispwd == true) {

                vars.$pwdparamName.push(pars[j].paramName);
                vars.$pwdparamValue.push(pars[j].paramValue);
                vars.$dummyparamValue.push(dummyValue); //display this on the form instead of pwdparamValue
                vars.$pwdparamCategory.push(pars[j].paramCategory);
                vars.$pwdparamDesc.push(pars[j].paramDesc);
                vars.$pwdparamType.push(pars[j].paramType);
                vars.$pwdparamCaption.push(pars[j].caption);
            } else {
                vars.$textparamName.push(pars[j].paramName);
                vars.$textparamValue.push(pars[j].paramValue);
                vars.$textparamCategory.push(pars[j].paramCategory);
                vars.$textparamDesc.push(pars[j].paramDesc);
                vars.$textparamType.push(pars[j].paramType);
                vars.$textparamCaption.push(pars[j].caption);
                offset++;
            }
        }
    }

}

function populateParamInfo(scfileName) {
    ////////////////////////
    //populate parameters start
    /////////////////////////
    //PWD operation related
    var newFile = new SCFile(scfileName);
    var newParamInfo = newFile.paramInfo;
    //release the temp var
    newFile = null;
    var dummyValue = "xxxxx";
    var webdummyValue = "Non-Decrypted-Password";

    //populate the text param to paramInfo
    if (vars.$textparamName != null && vars.$textparamName.length() > 0) {
        var i;
        for (i in vars.$textparamName) {
            if (vars.$textparamName[i] != null) {
                newParamInfo[i].paramName = vars.$textparamName[i];
                newParamInfo[i].paramValue = paramValue(vars.$textparamValue, i);
                newParamInfo[i].paramCategory = paramValue(vars.$textparamCategory, i);
                newParamInfo[i].paramDesc = paramValue(vars.$textparamDesc, i);
                newParamInfo[i].paramType = paramValue(vars.$textparamType, i);
                newParamInfo[i].caption = paramValue(vars.$textparamCaption, i);
                newParamInfo[i].ispwd = false;
            }
        }
    }

    var textLength = newParamInfo.length();

    //populate the pwd param to paramInfo
    if (vars.$pwdparamName != null && vars.$pwdparamName.length() > 0) {
        var len = vars.$pwdparamName.length();
        var j;
        var index;
        for (j = 0; j < len; j++) {

            if (vars.$pwdparamName[j] == null || vars.$pwdparamName[j] == "") {
                continue;
            }

            index = j + textLength;

            newParamInfo[index].paramName = vars.$pwdparamName[j];

            // check if password was changed and replace the old with new
            var dummyparamValue = paramValue(vars.$dummyparamValue, j);
            if (!dummyparamValue || (dummyparamValue.indexOf(dummyValue) < 0 && dummyparamValue.indexOf(webdummyValue) < 0)) {
                newParamInfo[index].paramValue = dummyparamValue;
            }
            // retain the old password
            else {
                if (vars.$L_file && vars.$L_file.paramInfo[index] && vars.$L_file.paramInfo[index].paramValue) {
                    newParamInfo[index].paramValue = vars.$L_file.paramInfo[index].paramValue;
                } else {
                    newParamInfo[index].paramValue = vars.$pwdparamValue[j];
                }
            }

            newParamInfo[index].paramCategory = paramValue(vars.$pwdparamCategory, j);
            newParamInfo[index].paramDesc = paramValue(vars.$pwdparamDesc, j);
            newParamInfo[index].paramType = paramValue(vars.$pwdparamType, j);
            newParamInfo[index].caption = paramValue(vars.$pwdparamCaption, j);
            newParamInfo[index].ispwd = true;

            if (vars.$pwdparamType[j] == "Character") {
                newParamInfo[index].paramValue = lib.EncryptUtil.encrypt(newParamInfo[index].paramValue);
            }
        }
    }

    return newParamInfo;
}


/**
 * get param value
 *
 * @param {SCDatum} params
 * @param {Number} index
 * @returns {String}
 */
function paramValue(params, index) {
    if (params && params.length() > index) {
        return params[index];
    }

    return "";
}

/**
 *  Merge the parameter information of SMISConfiguration from SMISRegistry
 *  When the instance of SMISConfiguration in old version and then new parameters are added in SMISRegistry
 *  Need to merge the new parameters of SMISRegistry to the existing instance of SMISConfiguration
 *  Generally the default value is not copied to the existing instance of SMISConfiguration
 *  Parameters:
 *      instance: the file record of the existing SMISConfiguration
 *      registry: the file record of SMISRegistry, if it is null, retrieve it by the template of SMISConfiguration
 *      isCopyValue: boolean, true is to copy the default value, by default, it is false and don't copy
 */
function mergeParamInfoFromRegistry(instance, registry, isCopyValue) {
    isCopyValue = !!isCopyValue;

    if (registry == null) {
        // Get the relevant SMISRegistry
        var template = instance["template"];
        registry = $("SMISRegistry", SCFILE_READONLY).setFields([]).select("name=\"" + template + "\"").uniqueResult();
        if (registry == null) {
            return;
        }
    }

    var registryPars = registry["paramInfo"];
    if (registryPars == null) {
        return;
    }
    var lng = registryPars.length();

    var instancePars = instance["paramInfo"];
    if (instancePars == null) {
        return;
    }
    var lng2 = instance["paramInfo"].length();

    var i;
    var j;
    var k;
    var regParamName;
    var insParamName;
    for (i = 0; i < lng; i++) { // loop all parameters info of SMISRegistry
        if (registryPars[i] == null || registryPars[i]["paramName"] == null) {
            continue;
        }

        regParamName = registryPars[i]["paramName"].trim();
        if (regParamName.length == 0) {
            continue;
        }

        for (j = 0; j < lng2; j++) { // loop all parameters info of the existing instance of SMISConfiguration
            if (instancePars[j] == null || instancePars[j]["paramName"] == null) {
                continue;
            }

            insParamName = instancePars[j]["paramName"].trim();
            if (insParamName.length == 0) {
                continue;
            }

            if (regParamName == insParamName) { // The parameter info exists in both
                break;
            }
        }

        if (j >= lng2) { // found new parameter info of SMISRegistry
            k = instancePars.length(); // locate the end of the parameter info array in SMISConfiguration
            // Copy parameter info from SMISRegistry
            instancePars[k].paramName = registryPars[i].paramName;
            if (isCopyValue) { // decide to copy default value
                instancePars[k].paramValue = registryPars[i].paramValue;
            }
            instancePars[k].paramDesc = registryPars[i].paramDesc;
            instancePars[k].paramCategory = registryPars[i].paramCategory;
            instancePars[k].ispwd = registryPars[i].ispwd;
            instancePars[k].paramType = registryPars[i].paramType;
            instancePars[k].caption = registryPars[i].caption;
        }
    }
}

function splitExpression(expression, needEval) {
    var preProcess;

    if (needEval == undefined) {
        needEval = true;
    }

    if ((typeof expression) == "string") {
        preProcess = expression.split(",");
    } else if (lib.smis_CommonLib.isArray(expression)) {
        preProcess = expression;
    } else {
        return expression;
    }
    var parameters = [];
    var temp = "";

    try {

        temp = preProcess[0];
        eval(temp);

        if (needEval) {
            temp = eval(temp);
        }

        parameters.push(temp);
        preProcess.splice(0, 1);
    } catch (e) {
        temp = preProcess[0];
        var i;
        for (i = 1; i < preProcess.length; i++) {
            try {
                temp = temp + "," + preProcess[i];
                eval(temp);
                break;
            } catch (ex) {}
        }

        if (needEval) {
            temp = eval(temp);
        }

        parameters.push(temp);
        preProcess.splice(0, i + 1);

    }
    if (preProcess.length > 0) {
        parameters = parameters.concat(splitExpression(preProcess, needEval));
    }
    return parameters;
}

function splitWhenExpression(expression, needEval) {
    return splitExpression(expression, needEval);
}

function showSelectedActions(actions) {
    var isInsert = "false";
    var isUpdate = "false";
    var isClose = "false";
    if (actions == undefined || actions == null || actions == "") {
        return;
    }

    var actionArray = actions.split("|");

    var i;
    for (i = 0; i < actionArray.length; i++) {
        switch (lib.smis_CommonLib.trimStr(actionArray[i])) {
            case "insert":
                isInsert = "true";
                break;
            case "update":
                isUpdate = "true";
                break;
            case "close":
                isClose = "true";
                break;
        }
    }

    var ret = [];
    ret.push(isInsert);
    ret.push(isUpdate);
    ret.push(isClose);
    return ret;
}

function generateActionString(insertAction, updateAction, closeAction) {

    if (insertAction == "false" && updateAction == "false" && closeAction == "false") {
        return null;
    }
    var retStr = "";
    if (insertAction == "true") {
        retStr += "insert|";
    }
    if (updateAction == "true") {
        retStr += "update|";
    }
    if (closeAction == "true") {
        retStr += "close|";
    }

    retStr = retStr.substr(0, retStr.length - 1);

    return retStr;
}

function toJSONforJSCallback(param, noJson) {

    if (noJson == undefined) {
        noJson = false;
    }

    if (noJson) {
        return param;
    } else {
        return lib.smis_CommonLib.toJSON(param);
    }
}

function checkNumberFile(fileName) {
    var number = new SCFile("number");

    var RC = number.doSelect("name=\"" + fileName + "\"");

    if (RC != RC_SUCCESS) {
        number.name = fileName;
        number.number = 0;
        var RC_Int = number.doInsert();

        if (RC_Int != RC_SUCCESS) {
            print("Can't insert record to Number file, " + RCtoString(RC_Int));
        }
    }
}


//////////////////////////////////////////////////////
//The functions above are used on UI 
//
//////////////////////////////////////////////////////

function _getInstanceConfigByTemplate(config) {
    var cItem = new(lib.smis_InstanceConfiguration.getClass())(config.intId);

    // configItem reference to avoid gc
    cItem.configItem = config;

    cItem.name = config.name;
    cItem.mgrName = config.mgrName;
    cItem.ctrlName = config.ctrlName;
    cItem.SMAdapter = config.SMAdapter;
    cItem.EPAdapter = config.EPAdapter;
    cItem.paramInfo = config.paramInfo;
    cItem.version = config.version;
    cItem.sharedScheduler = config.sharedScheduler;
    return cItem;
}

function _getInstanceConfigByIntId(intId) {
    var cItem = new(lib.smis_InstanceConfiguration.getClass())(intId);
    var configItem = new SCFile("SMISConfiguration");
    var RC = configItem.doSelect("intId=\"" + intId + "\"");

    if (RC == RC_SUCCESS) {
        // configItem reference to avoid gc
        cItem.configItem = configItem;

        // populate a value object of configuration item
        cItem.intId = configItem.intId;
        cItem.name = configItem.name;
        cItem.mgrName = configItem.mgrName;
        cItem.ctrlName = configItem.ctrlName;
        cItem.SMAdapter = configItem.SMAdapter;
        cItem.EPAdapter = configItem.EPAdapter;
        cItem.version = configItem.version;
        cItem.maxRetryTime = configItem.maxRetryTime;
        cItem.status = configItem.status;

        if (configItem.loggerLevel == null) {
            cItem.loggerLevel = "INFO";
        } else {
            cItem.loggerLevel = configItem.loggerLevel;
        }

        cItem.Desc = configItem.Desc;
        cItem.runOnStartup = configItem.runOnStartup;
        cItem.logFileDir = configItem.logFileDir;

        cItem.intervalTime = configItem.intervalTime;
        cItem.paramInfo = configItem.paramInfo;
        cItem.SMFields = configItem.SMFields;
        cItem.EPFields = configItem.EPFields;
        cItem.SMServer = configItem.SMServer;
        cItem.EPServer = configItem.EPServer;
        cItem.template = configItem.template;
        cItem.sharedScheduler = configItem.sharedScheduler;

        var mapping = new SCFile("SMISFieldMapping");
        var ret = mapping.doSelect("intId=\"" + intId + "\"");
        if (ret == RC_SUCCESS) {
            cItem.mapping = mapping;
        }

        return cItem;
    } else {
        return null;
    }
}

function _getRawInstanceConfigByIntId(intId) {
    var cItem = new(lib.smis_InstanceConfiguration.getClass())(intId);
    var configItem = new SCFile("SMISConfiguration");
    var RC = configItem.doSelect("intId=\"" + intId + "\"");

    if (RC == RC_SUCCESS) {
        if (configItem.loggerLevel == null) {
            configItem.loggerLevel = "INFO";
        }
        return configItem;
    } else {
        print("There is no corresponding instance. " + RCtoString(RC));
        return null;
    }
}


//Get Logger
function _getLog(configItem) {

    var log = new(lib.smis_Logger.getClass())();
    if (configItem != null) {
        log.setDefaultLevel(configItem.loggerLevel);
    }
    return log;
}


//**************************************************************************
//* SMIS Integration Flag
//***************************************************************************/

function _updateFlag(intName, flag) {
    var info = new SCFile("info");
    var RC = info.doSelect("type=\"company\"");

    if (RC == RC_SUCCESS) {
        if (funcs.exists(intName, info)) {
            info[intName] = flag;
            info.doUpdate();
        } else {
            var log = _getLog();
            if (log.isDebugEnabled()) {
                log.debug("smis_ConfigurationManager", funcs.scmsg("ConfigurationManager_20", "smis", [intName]));
            }
        }
    } else {
        print("\"company\" entity not exist in info file. " + RCtoString(RC));
    }

    if (funcs.exists(intName, vars.$G_system_info)) {
        vars.$G_system_info[intName] = flag;
    }
}

function _initGlobalVariables(params) {
    var info = new SCFile("info");
    info.doSelect("type=\"company\"");

    var param;
    for (param in params) {
        try {
            var type = info.getFieldType(param);

            if (type != funcs.type(params[param])) {
                params[param] = funcs.val(params[param], type);
            }

            info[param] = params[param];
            info.doUpdate();
            vars.$G_system_info[param] = params[param];
        } catch (e) {
            print("\"" + param + "\" field not exist in info dbdict.");
        }
    }
}

function _clearGlobalVariables(params) {
    var info = new SCFile("info");
    info.doSelect("type=\"company\"");

    var param;
    for (param in params) {
        try {
            info[param] = false;
            info.doUpdate();
            vars.$G_system_info[param] = false;
        } catch (e) {
            print("\"" + param + "\" field not exist in info dbdict.");
        }
    }
}

/*************************************
 * get enabled instance's configItem by template
 * @param {String} template
 *              template name
 * return configItem, if no enabled instance, return null
 * add by SQ (2009-12-02)
 ************************************/
function getEnabledConfigItem(template) {
    var instanceConfig = new SCFile("SMISConfiguration", SCFILE_READONLY);
    instanceConfig.setFields(["intId", "status"]);
    var RC = instanceConfig.doSelect("intId <> \"0\" and template=\"" + template + "\"");

    while (RC == RC_SUCCESS) {
        // add by Scott
        // check if support scheduler
        var configItem = _getInstanceConfigByIntId(instanceConfig.intId);

        //Reset the status
        if (instanceConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
            return configItem;
        }

        RC = instanceConfig.getNext();
    }

    return null;
}

/*************************************************
 * get SMIS template file
 * add by SQ (2013-12-19)
 **************************************************/
function getInstanceTemplate(template) {
    var smisRegistry = new SCFile("SMISRegistry", SCFILE_READONLY);
    smisRegistry.setFields(["schedulerPerInstance", "name", "instCount", "category"]);
    var ret = smisRegistry.doSelect("name=\"" + template + "\"");
    if (ret == RC_SUCCESS) {
        return smisRegistry;
    }

    return null;
}


/***************************************************************************
 * get enabled instance's configItem by template, paramName and paramValue *
 * param paramName and paramValue                                          *
 * return configItem, if no enabled instance, return null                  *
 * add by Zhang, Zhenqing (2014-03-03) for QCCR1E64751                     *
 ***************************************************************************/
function getEnabledConfigItemByParamNameValue(template, paramName, paramValue) {
    var instanceConfig = new SCFile("SMISConfiguration", SCFILE_READONLY);
    instanceConfig.setFields(["intId", "paramInfo", "status"]);
    var RC = instanceConfig.doSelect("intId <> \"0\" and  template=\"" + template + "\" and paramInfo,paramName=\"" + paramName + "\" and paramInfo,paramValue=\"" + paramValue + "\"");

    while (RC == RC_SUCCESS) {
        var i;
        var length = instanceConfig.paramInfo.length();
        for (i = 0; i < length; i++) { //double check, RTE can't return correct result.
            if (instanceConfig.paramInfo[i][2] == paramName) {
                if (instanceConfig.paramInfo[i][3] == paramValue) {
                    var configItem = _getInstanceConfigByIntId(instanceConfig.intId);
                    if (instanceConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
                        return configItem;
                    }
                }
                break;
            }
        }
        RC = instanceConfig.getNext();
    }
    return null;
}

// check there are ConfigItems have the paramName
function existEnabledConfigItemByParamName(template, paramName) {

    var instanceConfig = new SCFile("SMISConfiguration", SCFILE_READONLY);
    instanceConfig.setFields(["intId", "status"]);
    var RC = instanceConfig.doSelect("intId <> \"0\" and  template=\"" + template + "\" and paramInfo,paramName=\"" + paramName + "\"");

    while (RC == RC_SUCCESS) {
        var configItem = _getInstanceConfigByIntId(instanceConfig.intId);

        if (instanceConfig.status != lib.smis_Constants.INSTANCE_STATUS_DISABLE()) {
            return true;
        }
        RC = instanceConfig.getNext();
    }

    return false;
}

/**
 *  Call beforeDelInstance to validate before delete the SMIS instance.
 *
 *  @return additional message/null
 **/
function beforeDelInstance(intId) {
    var msg = null;
    var smisConfig = getInstanceConfig(intId);
    var log = _getLog(smisConfig);

    var managerClass = null;
    try {
        managerClass = smisConfig.getManager();
        if (managerClass != null && managerClass.beforeDelInstance != undefined) {
            msg = managerClass.beforeDelInstance();
        }
    } catch (ex) {
        log.error(funcs.scmsg("ConfigurationManager_19", "smis", [ex]));
    }
    return msg;
}

//add for QCCR1E120341
//Enhance SMIS framework to support test connect ep sever function
function getSMISConfigurationParameterValue(file, parameterName) {
    if (file == null || file.paramInfo == null) {
        return null;
    }

    var plength = file.paramInfo.length();
    var i;
    for (i = 0; i < plength; i++) {
        var param = file.paramInfo[i];
        if (param[2] == parameterName) {
            if (param.paramType == "Character" && param.ispwd) {
                return lib.EncryptUtil.decrypt(param[3]);
            } else if (param.paramType == "Number") {
                return Number(param.paramValue);
            } else if (param.paramType == "Logical") {
                return param.paramValue == "true";
            }

            return param.paramValue;
        }
    }
    return null;
}


/**
 * Get endpoint adapter by template name
 *
 * @param {String} templateName
 * @returns {String}
 */
function getEPAdapterByTemplate(templateName) {
    var registry = $("!SMISRegistry").fields("EPAdapter").find("name=:name", templateName).one();
    if (!registry) {
        return null;
    }

    return registry.EPAdapter;
}

/**
 * Whether show verify link action in configuration manager
 *
 * @param {String} templateName
 * @returns {Boolean}
 */
function showVerifyLink(templateName) {
    var adapter = getEPAdapterByTemplate(templateName);

    // endpoint adapter has function "testConnect"
    return !!(adapter && lib[adapter] && lib[adapter]["testConnect"]);
}


/**
 * test connection
 *
 * @param {SCFile} configFile
 * @returns {String}
 */
function testConnection(configFile) {
    var epAdapter = configFile.EPAdapter;
    if (configFile.template && epAdapter) {
        var testResult = lib[epAdapter].testConnect(configFile);
        lib.BaseUtil.ShowMessageBox(testResult);
        return testResult;
    }

    return "";
}

//end for QCCR1E120341

/**
 * Whether show extended action in configuration manager
 *
 * @param {String} templateName
 * @returns {Boolean}
 */
function showExtendedAction(templateName) {
    if (templateName == "SMtoUCMDB") {
        // show action in edit mode
        return vars.$L_instance_action == "edit";
    }

    var adapter = getEPAdapterByTemplate(templateName);

    // endpoint adapter has function "extendedAction"
    return !!(adapter && lib[adapter] && lib[adapter]["extendedAction"]);
}

/**
 * Execute extended action
 *
 * @param {SCFile} configFile
 */
function extendedAction(configFile) {
    var epAdapter = configFile.EPAdapter;
    if (epAdapter) {
        lib[epAdapter].extendedAction(configFile);
    }
}


/**
 * Whether show get access token action in configuration manager
 *
 * @param {String} templateName
 * @returns {Boolean}
 */
function showGetOAuthAccessToken(templateName) {
    var adapter = getEPAdapterByTemplate(templateName);

    // endpoint adapter has function "getOAuthAuthCodeAndToken"
    return !!(adapter && lib[adapter] && lib[adapter]["getOAuthAuthCodeAndToken"]);
}

/**
 * Execute get oauth auth code and access token action
 *
 * @param {SCFile} configFile
 * @returns {Boolean}
 */
function getOAuthAccessToken(configFile) {
    var epAdapter = configFile.EPAdapter;
    if (epAdapter) {
        // support web client only
        if (lib.BaseUtil.isWindowsClient()) {
            lib.BaseUtil.ShowMessageBox(funcs.scmsg("5000", "us"), 3);
            return false;
        }

        // validate parameters
        var validateParamMessage = checkParameters(configFile);
        if (validateParamMessage) {
            lib.BaseUtil.ShowMessageBox(validateParamMessage, 2);
            return false;
        }

        // redirect URI based on System Information Definition
        var redirectUri = lib.OAuthAuthentication.getDefaultRedirectURI();
        if (!redirectUri) {
            lib.BaseUtil.ShowMessageBox(funcs.scmsg("71", "smis"), 2);
            return false;
        }

        return lib[epAdapter].getOAuthAuthCodeAndToken(configFile);
    }

    return false;
}


function cloneInstance(intId) {
    var newId = lib.smis_InstanceBuilder.generateInstanceId();
    var instance = $('!SMISConfiguration', true).find("intId=:id", intId).one();
    if (null == instance) {
        return;
    }

    if (!lib.smis_Utils.checkCreateAvailable(instance.template)) {
        funcs.msg(funcs.scmsg("68", "smis", [instance.intId]), 2);
        return;
    }

    instance.intId = newId;
    instance.status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
    instance.name = findName(instance.name);
    instance.doAction("addsave");

    var fm = $('!SMISFieldMapping', true).find("intId=:id", intId).one();
    if (null == fm) {
        return;
    }

    fm.intId = newId;
    fm.doAction("addsave");
}


function findName(name) {
    var shortName = removeNum(name);
    var shortNameLength = shortName.length;

    var testName = 0;
    $('!SMISConfiguration').fields("name").sortBy('-name').find("name # :name", shortName).each(
        function(item) {
            var itemNum = item.name.substring(shortNameLength + 1);
            if (/^\d*$/.test(itemNum)) {
                if (testName < +itemNum) {
                    testName = +itemNum;
                }
            }
        }
    );

    if (testName) {
        return shortName + '-' + (+testName + 1);
    } else {
        return shortName + '-' + 1;
    }
}

function removeNum(name) {
    var list = /-\d+$/.exec(name);
    if (!list) {
        return name;
    }

    return name.substring(0, name.length - list[0].length);
}


//cloneInstance(1);