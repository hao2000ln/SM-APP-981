/******************************************************
 * Module Name: Case Exchange End Point Adapter
 * Function: Manager interface
 * Author: He, Peng-Fei
 * Version: 1.00
 * Creation Date: Dec, 2013
 *******************************************************/

var Class = lib.smis_Prototype.getClass();
var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

var CaseExchangeEPAdapterClass = Class.create({
    initialize: function(configItem) {

        this.params = configItem.getAllParameters();
        this.configItem = configItem;

        var lastPullingTime = this.configItem.getConfigParameterValue('lastPullingTime');
        if (!lastPullingTime) {
            lastPullingTime = new Date().getTime();
        }

        this.logger = configItem.getLogger();

        //general parameter
        this.integrationName = this.configItem.name;
        this.object = this.configItem.getConfigParameterValue('object');
        this.timeout = this.configItem.getConfigParameterValue('timeout');
        if (!this.timeout) {
            this.timeout = 15;
        } else {
            this.timeout = Number(this.timeout);
        }

        //inbound parameter
        this.isPulling = this.configItem.getConfigParameterValue('isPulling');
        this.externalId = this.configItem.getConfigParameterValue('externalId');
        this.inboundEntityPath = this.configItem.getConfigParameterValue('inboundEntityPath');
        this.pageQuery = '';
    },


    /** 
     *   This function is to get record from end point and push to task(inbound)
     *
     *   @return - success or not
     *   @type - boolean
     */
    getRecords: function() {
        this.logger.debug('CaseExchange_EPAdapter', 'getRecords');

        //pagination parameter
        var isPagination = this.configItem.getConfigParameterValue('isPagination');
        var pageOffset = this.configItem.getConfigParameterValue('pageOffset');
        var pageSize = this.configItem.getConfigParameterValue('pageSize');

        var preRecordSize = 0;
        var curRecordSize = 0;
        vars.$currentPageOffset = 0;

        var success = true;
        var pageNumber = 0;
        var url;
        var response;
        var validateInboundResScript = this.configItem.getConfigParameterValue('validateInboundResScript');
        this.logger.debug('CaseExchange_EPAdapter.getRecords', 'validateInboundResScript: ' + validateInboundResScript);
        var epRecordList;
        var i;
        var taskId;
        do {
            if (curRecordSize != 0 && curRecordSize < pageSize) {
                pageSize = curRecordSize;
            }
            preRecordSize = curRecordSize;
            curRecordSize = 0;
            if (isPagination) {
                vars.$currentPageOffset = new Number(pageSize) * pageNumber + new Number(pageOffset);
                this.pageQuery = lib.smis_CommonLib.processPlaceholder({}, {}, this.params, {}, this.configItem.getConfigParameterValue('pageQuery'));
            } else {
                this.pageQuery = '';
            }

            url = this.getInboudUrl();
            //call ep rest api
            response = lib.CaseExchange_CommonLib.doInboundRequest(url, this.timeout, this.params, this.configItem);
            this.logger.info('CaseExchange_EPAdapter.getRecords', response);

            if (validateInboundResScript) {
                success = eval('lib.' + validateInboundResScript + '(this.params, response)');
                this.logger.debug('CaseExchange_EPAdapter.getRecords', 'success: ' + success);
            }

            if (!success) {
                this.logger.warn('error when pulling from EP: ' + response);
                return success;
            }

            response = lib.EmojiUtil.convertUnicode2Emoji(response);
            epRecordList = this.parseJson(response);
            if (epRecordList === undefined) {
                break;
            }
            //push all ep records to task queue
            for (i = 0; i < epRecordList.length; i++) {
                curRecordSize++;
                if (this.inboundEntityPath && this.inboundEntityPath != '') {
                    epRecordList[i] = epRecordList[i][this.inboundEntityPath];
                }
                taskId = this.pushTaskToQueue(epRecordList[i]);
            }

            pageNumber++;

        } while (isPagination && curRecordSize >= preRecordSize && curRecordSize !== 0);

        vars.$currentPageOffset = undefined;

        return success;
    },


    /** 
     *   This function is to send record to end point(outbound)
     *
     *   @param {task} - smis task
     *   @return - success or not
     *   @type - boolean
     */
    sendRecords: function(task) {
        this.logger.debug('CaseExchange_EPAdapter', 'sendRecords');
        this.logger.debug('CaseExchange_EPAdapter', 'destObject: ' + lib.JSON2.toJSON(task.destObject));

        var action = task.action;

        this.logger.debug('CaseExchange_EPAdapter', 'action: ' + action);

        //rest outbound parameter
        var restTargetMethods = this.configItem.getConfigParameterValue('restTargetMethods');
        var restURLs = this.configItem.getConfigParameterValue('restURLs');
        var restHTTPMethods = this.configItem.getConfigParameterValue('restHTTPMethods');
        var entityPaths = this.configItem.getConfigParameterValue('entityPaths');
        var parameters = this.configItem.getConfigParameterValue('parameters');
        var additionalPaths = this.configItem.getConfigParameterValue('additionalPaths');
        var restActionTypes = this.configItem.getConfigParameterValue('restActionTypes');
        var restOutboundParas = this.getRestOutboundPara(restTargetMethods, restURLs, restHTTPMethods, entityPaths, parameters, additionalPaths, restActionTypes);
        var outboundPara = restOutboundParas[action];
        if (!outboundPara) {
            outboundPara = restOutboundParas[lib.CaseExchangeConstants.REST_OUTBOUND_EVENT_UPDATE()];
            if (!outboundPara) {
                task.responseMsg = 'Action ' + action + ' and ' + lib.CaseExchangeConstants.REST_OUTBOUND_EVENT_UPDATE() + ' is not defined.';
                return false;
            }
        }

        var actionType = outboundPara.restActionType;
        this.logger.debug('CaseExchange_EPAdapter.sendRecords', 'check actionType: ' + actionType + ', externalId:' + task.smisContext.externalId);
        //if action type in task is create, but context already has external id, this task is failed
        if (actionType === lib.CaseExchangeConstants.REST_ACTION_TYPE_CREATE() && task.smisContext.externalId) {
            this.logger.error('CaseExchange_EPAdapter.sendRecords', 'This record is already exchanged to a record in end point. actionType: ' + actionType + ', externalId:' + task.smisContext.externalId);
            task.responseMsg = 'This record is already exchanged to end point. Cannot perform ' + action + ' action.';
            return false;
        }

        //if action type is task is update, but context has no external id, this task is failed
        if (actionType === lib.CaseExchangeConstants.REST_ACTION_TYPE_UPDATE() && !task.smisContext.externalId) {
            this.logger.error('CaseExchange_EPAdapter.sendRecords', 'This record is not exchanged to a record in end point yet. actionType: ' + actionType + ', externalId:' + task.smisContext.externalId);
            task.responseMsg = 'This record is not exchanged to end point yet. Cannot perform ' + action + ' action.';
            return false;
        }

        var httpBody = this.toJson(task, outboundPara);
        task.requestData = httpBody;

        this.logger.info('CaseExchange_EPAdapter', 'httpBody: ' + httpBody);

        var httpMethod = outboundPara.restHTTPMethod;
        var baseURL = lib.smis_CommonLib.processPlaceholder(task.inRecord, task.destObject, this.params, task.smisContext, this.configItem.getConfigParameterValue('baseURL'));
        var url = baseURL + lib.smis_CommonLib.processPlaceholder(task.inRecord, task.destObject, this.params, task.smisContext, outboundPara.restURL);
        var parameter = lib.smis_CommonLib.processPlaceholder(task.inRecord, task.destObject, this.params, task.smisContext, outboundPara.parameter);

        this.logger.debug('CaseExchange_EPAdapter', 'httpMethod: ' + httpMethod);
        this.logger.debug('CaseExchange_EPAdapter', 'url: ' + url);
        this.logger.debug('CaseExchange_EPAdapter', 'parameter: ' + parameter);

        if (parameter) {
            url += parameter;
        }

        var response = lib.CaseExchange_CommonLib.doOutboundRequest(httpMethod, url, httpBody, this.timeout, this.params, this.configItem);
        this.logger.info('CaseExchange_EPAdapter.sendRecords', response);

        var result = false;
        //validate response is success or not by script
        var validateOutboundResScript = this.configItem.getConfigParameterValue('validateOutboundResScript');
        this.logger.debug('CaseExchange_EPAdapter.sendRecords', 'validateOutboundResScript: ' + validateOutboundResScript);
        if (validateOutboundResScript) {
            result = eval('lib.' + validateOutboundResScript + '(this.params, response)');
        } else {
            result = lib.CaseExchange_EPUtil.validateOutboundRes(this.params, response);
        }
        this.logger.debug('CaseExchange_EPAdapter.sendRecords', 'result: ' + result);

        if (result === false) {
            this.logger.warn('CaseExchange_EPAdapter.sendRecords', 'error when pushing to EP: ' + response);
            task.responseMsg = response;
            return false;
        }

        task.externalId = result;

        //process attachment
        var attachSwitch = this.configItem.getConfigParameterValue('attachSwitch');
        if (attachSwitch) {
            var postedAttachments;
            if (!this.isPulling) {
                //retrieve posted attachments
                var resObj = eval('(' + response + ')');
                postedAttachments = resObj[outboundPara['entityPath']]["ExternalAttachments"];
                if (postedAttachments && postedAttachments != "") {
                    postedAttachments = lib.smis_CommonLib.fromJSON(postedAttachments);
                }
            } else {
                postedAttachments = null;
            }

            var addedAttachmentObj = lib.CaseExchange_AttachHandling.sendAttachmentsToEndPoint(task, this.configItem, postedAttachments);
            var outboundAttInfoScript = this.configItem.getConfigParameterValue('outboundAttInfoScript');
            this.logger.debug('CaseExchange_EPAdapter.sendRecords', 'outboundAttInfoScript: ' + outboundAttInfoScript);
            if (addedAttachmentObj && addedAttachmentObj.length > 0 && outboundAttInfoScript) {
                task.smisContext = lib.smis_CommonLib.task2Context(task, task.smisContext);
                eval('lib.' + outboundAttInfoScript + '(task.destObject, task.inRecord, task.outRecord, task.smisContext, this.params, addedAttachmentObj)');
            }
        }

        return true;
    },


    /** 
     *   This function is to get inboud url by instance configuration
     *
     *   @return - inbound url
     *   @type - string
     */
    getInboudUrl: function() {
        this.logger.debug('CaseExchange_EPAdapter', 'getInboudUrl');
        var baseURL = this.configItem.getConfigParameterValue('baseURL');
        if (baseURL) {
            baseURL = lib.smis_CommonLib.processPlaceholder({}, {}, this.params, {}, baseURL);
        } else {
            baseURL = '';
        }

        var restPullingURL = this.configItem.getConfigParameterValue('restPullingURL');
        if (restPullingURL) {
            restPullingURL = lib.smis_CommonLib.processPlaceholder({}, {}, this.params, {}, restPullingURL);
        } else {
            restPullingURL = '';
        }

        var query = this.configItem.getConfigParameterValue('query');
        if (query) {
            query = lib.smis_CommonLib.processPlaceholder({}, {}, this.params, {}, query);
        } else {
            query = '';
        }

        var url = baseURL + restPullingURL + query + this.pageQuery;
        this.logger.debug('CaseExchange_EPAdapter.getInboudUrl', 'url: ' + url);
        return url;
    },


    /** 
     *   This function is to parse json to obj from end point
     *
     *   @return - object
     *   @type - object
     */
    parseJson: function(incidentListJson) {
        this.logger.debug('CaseExchange_EPAdapter', 'parseJson');
        var obj = lib.smis_CommonLib.fromJSON(incidentListJson);
        var restListPath = lib.smis_CommonLib.processPlaceholder({}, {}, this.params, {}, this.configItem.getConfigParameterValue('restListPath'));
        if (!restListPath) {
            return obj;
        }
        return eval('obj.' + restListPath);
    },


    /** 
     *   This function is to push smis task to queue
     *
     *   @param {record} - inbound record
     *   @return - task id
     *   @type - number
     */
    pushTaskToQueue: function(record) {
        this.logger.debug('CaseExchange_EPAdapter', 'pushTaskToQueue');
        var task = new(lib.smis_Task.getClass())(this.intId);
        task.inRecord = record;
        task.intId = this.configItem.intId;
        task.direction = lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
        task.externalId = this.getInboundExternalId(record);
        task.integrationName = this.integrationName;
        task.object = this.object;
        return lib.smis_TaskManager.pushTask(task);
    },

    /** 
     *   Convert record to json
     *
     *   @param {record} - outbound record
     *   @param {action} - outbound action
     *   @return - json
     *   @type - string
     */
    toJson: function(task, restOutboundPara) {
        this.logger.debug('CaseExchange_EPAdapter', 'toJson');

        var record = task.destObject;
        var action = task.action;

        var entityPath = lib.smis_CommonLib.processPlaceholder(task.inRecord, task.destObject, this.params, task.smisContext, restOutboundPara['entityPath']);

        var addPath = lib.smis_CommonLib.processPlaceholder(task.inRecord, task.destObject, this.params, task.smisContext, restOutboundPara['additionalPath']);

        var jsonObj = {};
        var entityObj;

        if (entityPath) {
            var bracket = this.getOptionInBrackets(entityPath);
            this.logger.debug('CaseExchange_EPAdapter', 'bracket:' + bracket);
            if (bracket.length > 0) {
                entityObj = [];
                eval('entityObj' + bracket + ' = record');
                entityPath = entityPath.slice(0, entityPath.indexOf(bracket));
            } else {
                entityObj = record;
            }
            jsonObj[entityPath] = entityObj;
        } else {
            jsonObj = record;
        }

        if (addPath) {
            addPath = lib.smis_CommonLib.processPlaceholder({}, {}, this.params, task.smisContext, addPath);
            var addObj = lib.smis_CommonLib.fromJSON(addPath);
            jsonObj = lib.CaseExchange_CommonLib.mergeObjectDeep(addObj, jsonObj);
        }

        return lib.EmojiUtil.convertEmojiSymbol2Code(lib.JSON2.toJSON(jsonObj));
    },


    /** 
     *   Convert outbound parameter to obj
     *
     *   @param {restTargetMethods}
     *   @param {restURLs}
     *   @param {restHTTPMethods}
     *   @param {entityPaths}
     *   @param {parameters}
     *   @param {additionalPaths}
     *   @return - object
     *   @type - {method:{url,method,path,para,addPath}}
     */
    getRestOutboundPara: function(restTargetMethods, restURLs, restHTTPMethods, entityPaths, parameters, additionalPaths, restActionTypes) {
        this.logger.debug('CaseExchange_EPAdapter', 'getRestOutboundPara');
        var arrayDelimiter = lib.smis_Constants.PARAM_ARRAY_DELIMITER();
        var result = {};
        var arrRestMethods = [];
        if (restTargetMethods) {
            arrRestMethods = restTargetMethods.split(arrayDelimiter);
        }
        var arrURLs = [];
        if (restURLs) {
            arrURLs = restURLs.split(arrayDelimiter);
        }

        var arrMethods = [];
        if (restHTTPMethods) {
            arrMethods = restHTTPMethods.split(arrayDelimiter);
        }

        var arrPaths = [];
        if (entityPaths) {
            arrPaths = entityPaths.split(arrayDelimiter);
        }

        var arrParas = [];
        if (parameters) {
            arrParas = parameters.split(arrayDelimiter);
        }

        var arrAddPaths = [];
        if (additionalPaths) {
            arrAddPaths = additionalPaths.split(arrayDelimiter);
        }

        var arrActionTypes = [];
        if (restActionTypes) {
            arrActionTypes = restActionTypes.split(arrayDelimiter);
        }

        if (arrRestMethods.length > 0) {
            for (var i = 0; i < arrRestMethods.length; i++) {
                var obj = {};

                if (arrURLs[i]) {
                    obj.restURL = arrURLs[i];
                }
                if (arrMethods[i]) {
                    obj.restHTTPMethod = arrMethods[i];
                }
                if (arrPaths[i]) {
                    obj.entityPath = arrPaths[i];
                }
                if (arrParas[i]) {
                    obj.parameter = arrParas[i];
                }
                if (arrAddPaths[i]) {
                    obj.additionalPath = arrAddPaths[i];
                }
                if (arrActionTypes[i]) {
                    obj.restActionType = arrActionTypes[i];
                }
                result[arrRestMethods[i]] = obj;
            }
        }

        return result;
    },


    /** 
     *   Get [] in a string
     *
     *   @param {string}
     *   @return - string with []
     *   @type - string
     */
    getOptionInBrackets: function(string) {
        this.logger.debug('CaseExchange_EPAdapter', 'getOptionInBrackets');
        var reg = /\[(.*?)\]/gi; //regular expression for find out bracket []
        var tmp;
        var result = [];
        while ((tmp = reg.exec(string)) != null) {
            result.push(tmp[0]);
        }
        return result;
    },


    /** 
     *   Get external ep id
     *
     *   @param {record}
     *   @return - external id
     *   @type - string
     */
    getInboundExternalId: function(record) {
        return eval('record.' + this.externalId);
    }

});

function getClass() {
    return CaseExchangeEPAdapterClass;
}


function testConnect(configFile) {
    if (configFile.template == "CaseExchangeSM_SM_Push" || configFile.template == "CaseExchangeSM_SM_Pull") {
        return testConnectSM(configFile);
    } else if (configFile.template == "CaseExchangeSM_SAW") {
        return testConnectSAW(configFile);
    }

    return null;
}

function testConnectSM() {
    var targetUrl = getParmeterValue(vars.$L_file, "baseURL");
    var userName = getParmeterValue(vars.$L_file, "username");
    var userPassword = getParmeterValue(vars.$L_file, "password");

    try {
        var requestURL = targetUrl + "/rest/incidents";
        var response = lib.smis_RestClient.doRESTGetRequest(requestURL, lib.smis_RestClient.createBasicAuthHttpHeaders("en", userName, userPassword), 15, 15, 15);
    } catch (ex) {
        return funcs.scmsg(117, "smis") + "\r\n" + ex;
    }

    return funcs.scmsg(116, "smis");
}

function testConnectSAW(configFile) {
    var userName = getParmeterValue(configFile, "username");
    var userPassword = getParmeterValue(configFile, "password");
    var loginURL = getParmeterValue(configFile, "loginURL");
    var tenantId = getParmeterValue(configFile, "tenantId");
    var timeOut = getParmeterValue(configFile, "timeout");

    try {
        var response = lib.CaseExchange_SAWUtil.getToken(loginURL, userName, userPassword, tenantId, timeOut);
    } catch (ex) {
        return funcs.scmsg(117, "smis") + "\r\n" + ex;
    }
    return funcs.scmsg(116, "smis");
}