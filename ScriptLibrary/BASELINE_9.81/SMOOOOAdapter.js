/******************************************************
* Module Name: SMIS Adapter
* Function: Adapter Interface
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Nov, 2009
*******************************************************/

var Class = lib.smis_Prototype.getClass();
var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;

var SMOOOOAdapterClass = Class.create({
  initialize: function(configItem) {
    this.configItem = configItem;
  },
  
  getRecords: function() {
  	var records = [];
  	return records;
  },
  
  sendRecord: function(record, action) {
  },
  
  getFields: function() {
  }
  
});

function getClass() {return SMOOOOAdapterClass;}


function testConnect(){
    var targetUrl = getParmeterValue(vars.$L_file, "oo.server.url");
    var userName = getParmeterValue(vars.$L_file, "oo.user.name");
    var userPassword = getParmeterValue(vars.$L_file, "oo.password");
    var basePath = getParmeterValue(vars.$L_file, "basepath");
    var delimiter = getParmeterValue(vars.$L_file, "basepath.delimiter");
    var path = basePath;

    if (path && path.indexOf(delimiter) > 0) {
        path = path.substring(0, path.indexOf(delimiter));
    }
    
    if (path && path.length > 0 && path.charAt(0) == '/') {
        path = path.substring(1);
    }
    
    var url = lib.SMOOUtil.joinUrl(targetUrl, '/oo/rest/v2/flows/tree/level');
    if (path) {
        url = url + '?path=' + encodeURIComponent(path);
    }
    
    var respList = {};
    try {
        var json = doHTTPRequest("GET", url, [lib.SMOOUtil.basicAuthorHeader(userName, userPassword)], '', 20, 20, 20, respList);
        var contentType = '' + respList['Content-Type'];
        var httpCode = respList['returnCode'];
        if (httpCode == '401') {
            throw new Error('HTTP Status 401 - Unauthorized');
        }

        if (httpCode == '400') {
            throw new Error('HTTP Status 400 - Bad Request');
        }

        if (!lib.c.$.startsWith(contentType, "application/json")) {
            return system.functions.scmsg(117, "smis");
        }
    } catch (e) {
        return system.functions.scmsg(117, "smis") + "\r\n" + e;
    }
    return system.functions.scmsg(116, "smis");
}