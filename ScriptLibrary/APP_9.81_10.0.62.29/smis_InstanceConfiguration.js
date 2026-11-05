/******************************************************
 * Module Name: SMIS InstanceConfiguration
 * Function: The instance of the Configuration
 * Author: Xing, jiang-bing
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var InstanceConfigurationClass = Class.create({

    // configItem reference to avoid gc
    configItem: null,

    intId: null,
    name: null,
    mgrName: null,
    ctrlName: null,
    SMAdapter: null,
    EPAdapter: null,
    version: null,
    maxRetryTime: null,
    status: null,
    loggerLevel: "INFO",
    intervalTime: null,
    runOnStartup: false,
    logFileDir: null,

    paramInfo: null,
    SMFields: null,
    SMServer: null,
    EPFields: null,
    EPServer: null,

    initialize: function(intId) {
        this.intId = intId;
    },

    getManager: function() {
        if (!this.manager) {
            var managerName = this.mgrName;
            this.manager = new(lib[managerName].getClass())(this);
        }
        return this.manager;
    },

    /**
     *	Get the specified configuration Value
     *	@param {String} key: Specified configuration name
     * @param {Boolean} rawValue
     *              true:  return value in the raw String type
     *              false: return in correspoding type
     */
    getConfigParameterValue: function(key, rawValue) {
        var ret = null;
        if (key == null || key == "") {
            return null;
        }
	
        if (this.paramInfo == null) {
            return ret;
        }

        var i;
        var length = this.paramInfo.length();
        for (i = 0; i < length; i++) {
            if (this.paramInfo[i].paramName == key) {
                ret = this.paramInfo[i].paramValue;

                var paramType = this.paramInfo[i].paramType;
                if (paramType == "Character" && this.paramInfo[i].ispwd) {
                    ret = lib.EncryptUtil.decrypt(ret); // decrypt the password value
                } else if (paramType == "Number" && !rawValue) {
                    return ret ? Number(ret) : null;
                } else if (paramType == "Logical") {
                    return (ret == "true");
                }
                break;
            }
        }

        return ret;
    },

    /**
     * get parameter caption
     *
     * @ param key - parameter name
     * @ return string caption
     */
    getParameterCaption: function(key) {
        var ret = null;
        if (key == null || key == "") {
            return null;
        }

        if (this.paramInfo == null) {
            return ret;
        }

        var i;
        var length = this.paramInfo.length();
        for (i = 0; i < length; i++) {
            if (this.paramInfo[i].paramName == key) {
                ret = this.paramInfo[i].caption;
                break;
            }
        }
        if (ret == null) {
            ret = key;
        }

        return ret;
    },

    /**
     *	Set the specified configuration Value
     *	@param {String} key: Specified configuration name
     */
    setConfigParameterValue: function(key, value) {

        if (key == null || key == "" || value == null) {
            return;
        }
        if (this.paramInfo == null) {
            return;
        }
        if (typeof value != "string") {
            value = value + "";
        }

        var i;
        var length = this.paramInfo.length();
        for (i = 0; i < length; i++) {

            if (this.paramInfo[i].paramName == key) {
                this.paramInfo[i].paramValue = value;
                break;
            }
        }
    },

    getParametersByCategory: function(category) {
        if (this.paramInfo == null) {
            return null;
        }

        var ret = {};

        var i;
        var length = this.paramInfo.length();
        for (i = 0; i < length; i++) {
            var param = this.paramInfo[i];

            if (param.paramCategory == category) {
                var paramValue = param.paramValue;

                if (param.paramType == "Logical") {
                    paramValue = (paramValue == "true");
                } else if (param.ispwd && param.paramType == "Character") {
                    paramValue = lib.EncryptUtil.decrypt(paramValue); // decrypt the password value
                }
                ret[param.paramName] = paramValue;
            }
        }

        return ret;
    },

    /** 
     * This method is used to get the first parameter value from smis configuration by category and parameter name
     * @return paramValue
     * @type String
     * @author Ling, Er-Li
     */
    getParameterByCategoryAndName: function(category, name) {
        if (this.paramInfo == null) {
            return null;
        }

        var paramValue = null;

        var i;
        var length = this.paramInfo.length();
        for (i = 0; i < length; i++) {
            var param = this.paramInfo[i];
            if (param.paramCategory == category && param.paramName == name) {
                paramValue = param.paramValue;

                if (param.paramType == "Logical") {
                    paramValue = (paramValue == "true");
                } else if (param.ispwd && param.paramType == "Character") {
                    paramValue = lib.EncryptUtil.decrypt(paramValue); // decrypt the password value
                }
                break;
            }
        }

        return paramValue;
    },


    /**
     * This method is used to get all parameters' key-value
     * @return {paramName: paramValue}
     * @type object
     * @author He, Peng-Fei
     */
    getAllParameters: function() {
        var ret = {};

        if (!this.paramInfo) {
            return ret;
        }

        var i;
        var length = this.paramInfo.length();
        for (i = 0; i < length; i++) {
            var param = this.paramInfo[i];
            var key = param.paramName;
            var value = param.paramValue;

            if (param.paramType == "Logical") {
                if (value == "true") {
                    value = true;
                } else {
                    value = false;
                }
            } else if (param.ispwd && param.paramType == "Character") {
                value = lib.EncryptUtil.decrypt(value); // decrypt the password value
            }
            ret[key] = value;
        }

        return ret;
    },

    /**
     * get field by name
     */
    getSMField: function(fieldName) {
        var module = this.configItem["module"];
        var moduleEnabled = this.configItem["module.enabled"];
        var i;
        var length = this.SMFields.length();
        var SMField;
        for (i = 0; i < length; i++) {
            SMField = this.SMFields[i];
            if (SMField && SMField.SMFieldName == fieldName && (!moduleEnabled || SMField.SMModuleName == module)) {
                return SMField;
            }
        }
        return null;
    },

    /**
     *  Get one array including all SM field names as an array and types as an array
     */
    getSMFieldNameTypeList: function() {
        var fieldList = [];
        var typeList = [];
        var module = this.configItem["module"];
        var moduleEnabled = this.configItem["module.enabled"];
        var i;
        var length = this.SMFields.length();
        var SMField;
        var fieldName;
        var fieldType;
        for (i = 0; i < length; i++) {
            SMField = this.SMFields[i];
            if (SMField && SMField.SMFieldName && (!moduleEnabled || SMField.SMModuleName == module)) {
                fieldName = SMField.SMFieldName.trim();
                if (fieldName.length > 0) {
                    fieldList.push(fieldName);
                    fieldType = "";
                    if (SMField.SMFieldType) {
                        fieldType = SMField.SMFieldType.trim();
                    }
                    typeList.push(fieldType);
                }
            }
        }

        return [fieldList, typeList];
    },

    /**
     * get field by name
     */
    getEPField: function(fieldName) {
        var i;
        var length = this.EPFields.length();
        var EPField;
        for (i = 0; i < length; i++) {
            EPField = this.EPFields[i];
            if (EPField && EPField.EPFieldName == fieldName) {
                return EPField;
            }
        }
        return null;
    },

    getIntervalTimeDate: function() {
        if (this.intervalTime == null || this.intervalTime == "") {
            this.intervalTime = 0;
        }

        return funcs.val(this.intervalTime, 3);
    },

    getLogger: function() {
        if (this.log != null) {
            return this.log;
        }

        if (lib.smis_CommonLib.isEmpty(this.name)) {
            this.log = new(lib.smis_Logger.getClass())();
        } else {
            var fileDir = this.logFileDir;
            if (lib.smis_CommonLib.isEmpty(fileDir)) {
                this.log = new(lib.smis_Logger.getClass())();
                this.log.setDefaultLevel(this.loggerLevel);
                return this.log;
            }
            fileDir = fileDir.replace(/^\s+|\s+$/g, "");
            var c = fileDir.charAt(fileDir.length - 1);
            fileDir += (c == '/' || c == '\\') ? "" : "/";

            var date = lib.smis_CommonLib.formatDate(new Date(), "yyyymmdd");

            fileDir += (this.name + "-" + date + ".log");
            this.log = new(lib.smis_Logger.getClass())(fileDir);
        }

        this.log.setDefaultLevel(this.loggerLevel);
        return this.log;
    },

    isScheduleBased: function() {
        var managerName = this.mgrName;
        var manager = new(lib[managerName].getClass())(this);
        return manager.isScheduleBased();
    }

});

function getClass() {
    return InstanceConfigurationClass;
}