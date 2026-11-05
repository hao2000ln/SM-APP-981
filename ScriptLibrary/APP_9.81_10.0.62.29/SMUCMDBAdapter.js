/******************************************************
* Module Name: SMIS SM uCMDB Adapter
* Function: Adapter Interface
* Author: Zhang Qi
* Version: 1.00
* Creation Date: Dec, 2015
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var SMUCMDBAdapterClass = Class.create({
  	initialize: function(configItem) {
    	this.configItem = configItem;
  	},
  
  	getRecords: function() {
  		return [];
  	},
  
  	sendRecord: function(record, action) {
  	},
  
  	getFields: function() {
  	}
  
});


function getClass() {
	return SMUCMDBAdapterClass;
}


/**
 * Test Connection
 */
function testConnect(configFile) {
	var getParmeterValue = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue;
	
	var ucmdbSvc = new lib.ucmdbSMService.ucmdbSMService();

	var getAllCIPropertiesReq = new lib.ucmdbSMService.getAllCIProperties();	
	getAllCIPropertiesReq.ID.setValue("testCI_123456");
	var customerID = getParmeterValue(configFile, "ucmdb.customer.id");
	getAllCIPropertiesReq.CustomerID.setValue(customerID);
	var getAllCIPropertiesResp;
	
	// verify webservice	
	ucmdbSvc.location = getParmeterValue(configFile, "services.endpoint");
	ucmdbSvc.user     = getParmeterValue(configFile, "user");
	ucmdbSvc.password = getParmeterValue(configFile, "password");
//	ucmdbSvc.password = lib.operatorUtil.getPassword(getParmeterValue(configFile, "password"));
	
	try {
		getAllCIPropertiesResp = ucmdbSvc.invoke( getAllCIPropertiesReq );
	}
	catch(ex) {
		return funcs.scmsg(118, "smis")+"\r\n"+ ex;
	}

//	if ( getAllCIPropertiesResp.isFault() ) {
//	   return funcs.scmsg(117, "smis");
//	}

	// verify multi-tentant webservice	
	ucmdbSvc.location = getParmeterValue(configFile, "mt.services.endpoint");
	if (vars["$G.multi"] && ucmdbSvc.location != null && ucmdbSvc.location.length > 0) {
		ucmdbSvc.user     = getParmeterValue(configFile, "mt.user");
		ucmdbSvc.password = getParmeterValue(configFile, "mt.password");
		try {
			getAllCIPropertiesResp = ucmdbSvc.invoke( getAllCIPropertiesReq );
		}
		catch(ex2) {
			return funcs.scmsg(119, "smis")+"\r\n"+ ex2;
		}
	}	
	
	var gatewayUrl = getParmeterValue(configFile, "gateway.endpoint");
    if (gatewayUrl) {
        var gatewayUsername = getParmeterValue(configFile, "gateway.user");
        var gatewayPassword = getParmeterValue(configFile, "gateway.pwd");
        var message = testCmsGatewayConnection(gatewayUrl, gatewayUsername, gatewayPassword);
        if (message) {
            return message;
        }
    }

	return funcs.scmsg(116, "smis");
}

function testCmsGatewayConnection(url, username, password) {
    if (!url) {
        return null;
    }
    
    url += (url.endsWith("/") ? "" : "/") + "urest/v1/1/authentication?target=cms";
    var headers = [];
    headers.push(new Header('Content-Type', 'application/json;charset=UTF-8'));
    var body = JSON.stringify({
        "username": username,
        "password": password
    });
    var responseHeader = {};
    
    try {
        var response = doHTTPRequest('POST', url, headers, body, 0, 0, 0, responseHeader);
        if(responseHeader['returnCode'] == 200) {
            return null;
        }
        if (response) {
            try {
                var respObj = JSON.parse(response);
                if (respObj && typeof respObj == "object") {
                    return funcs.scmsg(120, "smis")+"\r\n" + (respObj['statusCode'] ? respObj['statusCode'] + ": " : "") + respObj['message'];
                }
            } catch (ex1) {
                // response is not a JSON.
            }
        }
        return funcs.scmsg(120, "smis")+"\r\nReturn code: " + responseHeader['returnCode'] + "\r\nResponse: " + response;
    } catch (ex) {
        return funcs.scmsg(120, "smis")+"\r\n"+ ex;
    }
}
