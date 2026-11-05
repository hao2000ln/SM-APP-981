/******************************************************
 * Module Name: SMOO Controller
 * Function: provide default workflow control
 * Author: Yang, Wen-Ying
 * Version: 1.00
 * Creation Date: Dec, 2009
 *******************************************************/
var _ = lib.Underscore.require();

var Class = lib.smis_Prototype.getClass();

var ControllerClass = Class.create({
    initialize: function(configItem) {

        this.configItem = configItem;

        this.log = this.configItem.getLogger();
        this.ooservice_url = lib.SMOOUtil.joinUrl(this.configItem.getConfigParameterValue("oo.server.url"), '/oo/rest/v2');
        this.userName = this.configItem.getConfigParameterValue("oo.user.name");
        this.password = this.configItem.getConfigParameterValue("oo.password");
        this.SMOOScheduled = this.getSMOOScheduled();
    },

    /**
     *	Default invoketion flow
     */
    startup: function() {
        try {
            this.scheduleSync();
            if (this.log.isDebugEnabled()) {
                this.log.debug("SMOOController", "startup");
            }
            //Update the config parameter
            //lib.smis_ConfigurationManager.updateParam(this.configItem);

            //if this round is over set the status to Sleep();
            lib.smis_ConfigurationManager.setInstanceStatus(this.configItem.intId, lib.smis_Constants.INSTANCE_STATUS_SLEEPING());
        } catch (e) {
            this.exceptionCatch(e);
        }
    },

    exceptionCatch: function(e) {},

    getSMOOScheduled: function() {
        var info = new SCFile("info", SCFILE_READONLY);
        info.setFields(["SMOO.scheduled"]);
        var RC = info.doSelect("type=\"company\"");

        if (RC == RC_SUCCESS) {
            if (info.SMOO_scheduled == null) {
                return 0;
            } else {
                return info.SMOO_scheduled;
            }
        } else {
            return 0;
        }
    },

    scheduleSync: function() {
        this.log.info("SMOOController", "SMOO scheduler starts.");
        try {
            var basePathStr = this.configItem.getConfigParameterValue("basepath");
            // basePathStr = 'Library/Test1';
            var delimiter = this.configItem.getConfigParameterValue("basepath.delimiter");
            var basePaths = this.getBasePaths(basePathStr, delimiter);

            var flowList = [];
            var i = 0;
            for (i = 0; i < basePaths.length; i++) {
                this.queryFolder(basePaths[i], flowList);
            }
            this.syncOOFlow(flowList);
            this.removeOOFlows(basePaths);
            this.updateScheduled(this.SMOOScheduled);
            this.log.info("SMOOController", "SMOO scheduler ends.");
        } catch (e) {
            this.log.error("SMOOController", e);
        }
    },

    doGet: function(url) {
        // this.log.debug('doGet', url);

        var headers = [lib.SMOOUtil.basicAuthorHeader(this.userName, this.password)];
        var respHeaders = {};
        var rawResponse;

        try {
            rawResponse = lib.smis_RestClient.doRESTGetRequest(url, headers, null, null, null, respHeaders);
        } catch (e) {
            return {
                "error": {
                    "code": "ConnectionError",
                    "message": typeof e == "string" ? e : e.message
                }
            };
        }

        var returnCode = respHeaders.returnCode;
        if (returnCode == 200) {
            return rteJSONParse(rawResponse);
        }

        // operation failed, e.g. 401 unauthorized
        return {
            "error": {
                "code": returnCode,
                "message": rawResponse
            }
        };
    },

    findNextLevel: function(path) {
        var url = this.ooservice_url + '/flows/tree/level?path=' + encodeURIComponent(path);
        return this.doGet(url);
    },

    queryFolder: function(path, list) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("SMOOController", 'queryFolder:' + path);
        }

        var json = this.findNextLevel(path);

        if (json.error) {
            this.log.error("SMOOController", 'queryFolder error: ' + JSON.stringify(json.error));
            return list;
        }

        var folderList = [];
        var k = 0;
        for (k = 0; k < json.length; k++) {
            var item = json[k];
            if (this.log.isDebugEnabled()) {
                this.log.debug("SMOOController", `${item.id},${item.leaf},${item.path}`);
            }

            if (item.leaf == false) {
                folderList.push(item.path);
            } else {
                list.push(item.id);
            }
        }

        for (k = 0; k < folderList.length; k++) {
            var childList = this.queryFolder(folderList[k], list);
        }

        return list;
    },

    syncOOFlow: function(list) {
        // this.log.debug('syncOOFlow...');
        var i = 0;
        for (i = 0; i < list.length; i++) {
            var flowId = list[i];
            var item = this.queryDetail(flowId);

            if (!item) {
                continue;
            }

            if (this.checkInSMByPath(item.path) == null) {
                if (this.checkInSM(item.id) == null) {
                    this.insertOOFlow(item);
                }
            } else {
                this.updateOOFlow(item);
            }
        }
    },

    queryDetail: function(flowId) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("SMOOController", 'queryDetail:' + flowId);
        }
        var url = this.ooservice_url + '/flows/' + flowId;
        var paramUrl = url + '/inputs';

        var props = this.doGet(url);
        if (props.error) {
            this.log.error("SMOOController", 'queryDetail error: ' + JSON.stringify(props.error));
            return null;
        }

        var paramList = this.doGet(paramUrl);

        var path = props.path;
        path = path.substring(0, path.lastIndexOf('/') + 1) + props.name;
        // this.log.debug('>>>>>', path);

        var item = {
            "id": props.id,
            "name": props.name,
            "path": path,
            "desc": props.description
        };

        // Add leading slash for path
        if (item.path.charAt(0) != '/') {
            item.path = '/' + item.path;
        }

        var list = [];
        if (paramList) {
            var k;
            for (k = 0; k < paramList.length; k++) {
                var param = paramList[k];
                list.push({
                    name: param.name,
                    required: param.mandatory,
                    sensitive: param.encrypted
                });
            }
        }

        item.paramList = list;
        return item;
    },

    insertOOFlow: function(item) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("SMOOController", 'insertOOFlow:' + item.path);
        }
        var newOOFlow = new SCFile("OOFlow");
        newOOFlow.uuid = item.id;
        newOOFlow.path = item.path;
        newOOFlow.name = item.name;
        newOOFlow.description = item.desc;
        newOOFlow.lastmodifiedtime = Date.now() + '';
        newOOFlow.scheduled = this.SMOOScheduled;

        // set params
        var paraSize = item.paramList.length;
        var i = 0;
        for (i = 0; i < paraSize; i++) {
            var param = item.paramList[i];
            // if (param.encrypted == null || param.encrypted == "") {
            //     encrypted = false;
            // }
            newOOFlow.paras[i].para_name = param.name;
            newOOFlow.paras[i].para_required = param.required;
            newOOFlow.paras[i].para_sensitive = param.encrypted;
        }

        // do insert and log result
        var rc = newOOFlow.doInsert();
        if (rc != RC_SUCCESS) {
            this.log.info("SMOOController", "Can't insert record to OOFlow file, " + RCtoString(rc));
        } else {
            this.log.info("SMOOController", "OO flow inserted: " + newOOFlow.path);
        }
    },

    sameItem: function(oldItem, item) {
        // this.log.debug('sameItem', item.path);
        // this.log.debug('sameItem', '> name...');
        if (item.name != oldItem.name) {
            return false;
        }
        // this.log.debug('sameItem', '> description...');
        // this.log.debug('sameItem', '> item.desc          ', item.desc);
        // this.log.debug('sameItem', '> oldItem.description', oldItem.description);
        if (item.desc != oldItem.description) {
            return false;
        }
        // if (item.id != oldItem.uuid) return false;
        // this.log.debug('sameItem', '> paramList.length...');
        if (item.paramList.length != funcs.denull(oldItem.paras).length()) {
            return false;
        }

        var param = null;
        var k = 0;

        /*
        var paramObj = {};
        for(k=0;k<item.paramList.length;k++){
        	param = item.paramList[k];
        	paramObj[param.name] = param;
        }
        
        if(log.isTraceEnabled()) {
            this.log.debug('paramObj', rteJSONStringify(paramObj));
        }
        */
        for (k = 0; k < item.paramList.length; k++) {
            // param = paramObj[oldItem.paras[k].para_name];
            param = item.paramList[k];

            if (param.name != oldItem.paras[k].para_name) {
                return false;
            }

            // this.log.debug('sameItem', '> !param...', oldItem.paras[k].para_name);
            if (!param) {
                return false;
            }
            // this.log.debug('sameItem', '> !para_required...');
            if (param.required != oldItem.paras[k].para_required) {
                return false;
            }
            // this.log.debug('sameItem', '> !para_sensitive...');
            if (param.para_sensitive != oldItem.paras[k].para_sensitive) {
                return false;
            }
        }

        // this.log.debug('sameItem is true');
        return true;
    },

    updateOOFlow: function(item) {
        if (this.log.isDebugEnabled()) {
            this.log.debug("SMOOController", 'updateOOFlow: ' + item.path);
        }
        var oldItem = new SCFile("OOFlow");
        var rc = oldItem.doSelect('path="' + lib.StringUtil.escapeAllStr(item.path) + '"');

        var oldUUID = oldItem.uuid;
        if (this.sameItem(oldItem, item)) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("SMOOController", "OO flow no change: " + oldItem.path);
            }

            if (item.id != oldUUID) {
                oldItem.uuid = item.id;
            }
            oldItem.scheduled = this.SMOOScheduled;
            // print('scheduleId', oldItem.scheduled, this.SMOOScheduled);

            if (item.id == oldUUID || this.checkInSM(item.id) == null) {
                var RC_Int = oldItem.doUpdate();
                if (RC_Int != RC_SUCCESS) {
                    this.log.warn("SMOOController", "Can't update record to OOFlow file, " + RCtoString(RC_Int));
                }
            }

            if (item.id != oldUUID) {
                this.refreshOOFlowConfigurationItemsUUID(item.path, item.id);
            }

            return;
        }
        var oldPath = oldItem.path;

        oldItem.uuid = item.id;
        oldItem.path = item.path;
        oldItem.name = item.name;
        oldItem.description = item.desc;
        oldItem.scheduled = this.SMOOScheduled;

        //update parameters
        //if the parameter is existed, keep the user settings about default value and ci mapping, update required
        //if not, add the parameter
        //if the existed parameter is not in OO, remove it
        //cannot be awared of parameter name change, if a parameter's name is changed,
        //take it as removed and add a new parameter. 
        var newParaSize = item.paramList.length;
        var oldParaSize = oldItem.paras.getSize();
        var temp = new Datum();
        var i;
        var k;
        for (i = 0; i < newParaSize; i++) {
            var existed = false;
            var para_name = item.paramList[i].name;
            var required = item.paramList[i].required;
            var encrypted = item.paramList[i].encrypted;
            if (para_name != null && para_name != "") {
                for (k = 0; k < oldParaSize; k++) {
                    if (para_name == oldItem.paras[k].para_name) {
                        oldItem.paras[k].para_required = required;
                        oldItem.paras[k].para_sensitive = encrypted;
                        temp.push(oldItem.paras[k]);
                        existed = true;
                        break;
                    }
                }
                if (!existed) {
                    var tempOOFlow = new SCFile("OOFlow");
                    var tempPara = tempOOFlow.paras;
                    tempPara[0].para_name = para_name;
                    tempPara[0].para_required = required;
                    temp.push(tempPara[0]);
                }
            }
        }

        oldItem.paras = temp;
        this.updateKMLinks(oldPath, item.path, item.paramList);

        if (item.id == oldUUID || this.checkInSM(item.id) == null) {
            var rc1 = oldItem.doUpdate();
            if (rc1 != RC_SUCCESS) {
                this.log.warn("SMOOController", "Can't update record to OOFlow file, " + RCtoString(rc1));
            } else {
                this.log.info("SMOOController", "OO flow updated: " + item.path);
            }
        }

        if (item.id != oldUUID) {
            this.refreshOOFlowConfigurationItemsUUID(item.path, item.id);
        }
    },

    getMaxRequestSize: function() {
        return 10;
    },

    checkInSM: function(uuid) {
        // this.log.debug('checkInSM', uuid);
        var ooFlowFile = new SCFile("OOFlow");
        var sql = "uuid = \"" + uuid + "\"";
        var rc_result = ooFlowFile.doSelect(sql);
        if (rc_result == RC_SUCCESS) {
            return ooFlowFile;
        } else {
            return null;
        }
    },

    checkInSMByPath: function(ooflowpath) {
        // this.log.debug('checkInSM', ooflowpath);
        var ooFlowFile = new SCFile("OOFlow");
        var sql = "path = \"" + ooflowpath + "\"";
        var rc_result = ooFlowFile.doSelect(sql);
        if (rc_result == RC_SUCCESS) {
            return ooFlowFile;
        } else {
            return null;
        }
    },

    refreshOOFlowConfigurationItemsUUID: function(ooflowpath, newUUID) {
        // this.log.debug('refreshOOFlowConfigurationItemsUUID', ooflowpath, '->', newUUID);
        var ooFCI = new SCFile("OOFlowConfigurationItem");
        var sql = "OOFlow.path = \"" + ooflowpath + "\"";
        var rc_result = ooFCI.doSelect(sql);
        while (rc_result == RC_SUCCESS) {
            ooFCI['OOFlow.uuid'] = newUUID;
            ooFCI.doUpdate();
            rc_result = ooFCI.getNext();
        }
    },

    updateScheduled: function() {
        var info = new SCFile("info");
        var RC = info.doSelect("type=\"company\"");
        info.SMOO_scheduled++;
        var RC_Int = info.doUpdate();
        if (RC_Int != RC_SUCCESS) {
            this.log.error("SMOOController", "Can't update record to info file, " + RCtoString(RC_Int));
        }
    },

    removeOOFlows: function(basePaths) {
        var i = 0;
        for (i = 0; i < basePaths.length; i++) {
            if (basePaths[i] != null && basePaths[i] != "") {
                var ooFlowFile = new SCFile("OOFlow");
                //QCCR1E53372 QL exception in Service Manager log when retrieving OO flow from OO.
                //YWY
                //use ~= to replace <>
                var sql = "scheduled ~=NULL and scheduled <> " + this.SMOOScheduled + " and path #\"/" + basePaths[i] + "\"";
                var rc = ooFlowFile.doSelect(sql);
                while (rc == RC_SUCCESS) {
                    var uuid = ooFlowFile.uuid;
                    this.removeKMLinks(uuid);
                    var RC_Int = ooFlowFile.doDelete();
                    if (RC_Int != RC_SUCCESS) {
                        this.log.error("SMOOController", "Can't delete record from OOFlow file, " + RCtoString(RC_Int));
                    } else {
                        this.log.info("SMOOController", "OO flow removed: " + ooFlowFile.path);
                    }

                    rc = ooFlowFile.getNext();
                }
            }
        }
    },

    getBasePaths: function(basePathStr, delimiter) {
        var list = [basePathStr];
        if (basePathStr == null || basePathStr == "" || delimiter == null || delimiter == "") {
            list = [basePathStr];
        } else {
            list = basePathStr.split(delimiter);
        }

        list = _.filter(list, function(item) {
            return item != null && item.length > 0;
        });

        return _.map(list, function(item) {
            if (item && item.length > 0 && item.charAt(0) == '/') {
                item = item.substring(1);
            }
            return item;
        });
    },

    updateKMLinks: function(oldPath, newPath, newParas) {
        var kmlinkFile = new SCFile("OOFlowLinks");
        var sql = "OOFlow.path = \"" + oldPath + "\"";
        var RC_Int = kmlinkFile.doSelect(sql);
        while (RC_Int == RC_SUCCESS) {
            kmlinkFile.OOFlow_path = newPath;
            var oldParaSize = kmlinkFile.paras.getSize();
            var newParaSize = newParas.length;
            var paras = new Datum();
            var i;
            var k;
            for (i = 0; i < newParaSize; i++) {
                var existed = false;
                var para_name = newParas[i].name;
                var required = newParas[i].required;
                if (para_name != null && para_name != "") {
                    for (k = 0; k < oldParaSize; k++) {
                        if (para_name == kmlinkFile.paras[k].para_name) {
                            kmlinkFile.paras[k].para_required = required;
                            paras.push(kmlinkFile.paras[k]);
                            existed = true;
                            break;
                        }
                    }
                }
                if (!existed) {
                    var tempOOFlowLink = new SCFile("OOFlowLinks");
                    var tempPara = tempOOFlowLink.paras;
                    tempPara[0].para_name = para_name;
                    tempPara[0].para_required = required;
                    paras.push(tempPara[0]);
                }
            }
            kmlinkFile.paras = paras;
            var rc = kmlinkFile.doUpdate();
            if (rc != RC_SUCCESS) {
                this.log.error("SMOOController", "Can't update record from OOFlowLinks file, " + RCtoString(rc));
            }
            RC_Int = kmlinkFile.getNext();
        }
    },

    removeKMLinks: function(uuid) {
        var kmlinkFile = new SCFile("OOFlowLinks");
        var sql = "OOFlow.uuid = \"" + uuid + "\"";
        var RC_Int = kmlinkFile.doSelect(sql);
        while (RC_Int == RC_SUCCESS) {
            var rc = kmlinkFile.doDelete();
            if (rc != RC_SUCCESS) {
                this.log.error("SMOOController", "Can't update record from OOFlowLinks file, " + RCtoString(rc));
            }

            RC_Int = kmlinkFile.getNext();
        }
    }

});

function getClass() {
    return ControllerClass;
}

function basicAuthor(user, pwd) {
    var header = new Header();
    header.name = "Authorization";
    header.value = "Basic " + lib.smis_CommonLib.encode64(user + ":" + pwd);
    return header;
}