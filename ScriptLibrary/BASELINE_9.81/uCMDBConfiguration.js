

/**
 * Get the configuration item of UCMDB Integration
 */
function getConfigurationItem(){
	return lib.smis_ConfigurationManager.getEnabledConfigItem("SMtoUCMDB");
}


function isEnabled(){
	return getConfigurationItem()!=null;
}


function getWebserviceUrl(){
	var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("services.endpoint");
 	}
  	else { 
  		return null;
  	}
}

  
function getMultiTenantWebserviceUrl(){
	var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("mt.services.endpoint");
 	}
  	else { 
  		return null;
  	}
}

   
function  getUsername(){
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("user");
 	}
  	else { 
  		return null;
  	}
}


function  getPassword(){
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("password");
	}
  	else { 
  		return null;
  	}
}


function getMultiTenantUsername(){
   var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("mt.user");
 	}
  	else { 
  		return null;
  	}
}


function getMultiTenantPassword(){   
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("mt.password");
 	}
  	else { 
  		return null;
  	}
}


function getBrowserUrl() {
    var config = getConfigurationItem();
   	if (config != null) {
 	 	return config.getConfigParameterValue("ucmdb.browser");
 	}
  	else { 
  		return null;
  	}

}


function getCIsPerImpactPage(){
	var config = getConfigurationItem();
	if(config!=null) {
		if(config.getConfigParameterValue("impactcisperpage")){
			return parseInt(config.getConfigParameterValue("impactcisperpage"), 0);
		}
	}

	return 100;

}

function getUcmdbDefaultClient(){
	var config = getConfigurationItem();
	var ucmdbclient = "Default Client";
   	if(config!=null) {
 	 	ucmdbclient = config.getConfigParameterValue("ucmdbserver");
 	}
  	return ucmdbclient;
}

function getUcmdbCustomerID(){
    var config = getConfigurationItem();
    var customerID = 1;
    if(config!=null) {
        customerID = config.getConfigParameterValue("ucmdb.customer.id");
    }
    return customerID;
}

function getImpactBundle(){
	var config = getConfigurationItem();
	var impactBundle = "";
   	if(config!=null) {
 	 	impactBundle = config.getConfigParameterValue("impactbundle");
 	}

  	return impactBundle;
}

function getImpactSeverity(){
	var config = getConfigurationItem();
	var impactSeverity = "";
   	if(config!=null) {
 	 	impactSeverity = config.getConfigParameterValue("impactseverity");
 	}
  	if(!impactSeverity){
  		impactSeverity = "critical";
  	}
  	return impactSeverity;
}

function getRelatedFilterTQL(){
	var config = getConfigurationItem();
	var filterTQL = "";
   	if(config!=null) {
 	 	filterTQL = config.getConfigParameterValue("filtertql");
 	}

  	return filterTQL;
}

function getPassAuthInURL(){
	var config = getConfigurationItem();
	var passAuth = false;
   	if(config!=null && config.getConfigParameterValue("passuserpwdinurl")) {
 	 	passAuth = true;
 	}

  	return passAuth;
}

function getShowUBImpact(){
	var config = getConfigurationItem();
	var show = false;
   	if(config!=null && config.getConfigParameterValue("showImpactWidget")) {
 	 	show = true;
 	}

  	return show;
}

function getShowUBVisualization(){
	var config = getConfigurationItem();
	var show = false;
   	if(config!=null && config.getConfigParameterValue("showVisualizeWidget")) {
 	 	show = true;
 	}

  	return show;
}

function getShowUBInNewBrowserPage(){
	var config = getConfigurationItem();
	var show = false;
   	if(config!=null && config.getConfigParameterValue("showInNewBrowserPage")) {
 	 	show = true;
 	}

  	return show;
}

function getBrowserUserName(){
	var config = getConfigurationItem();
	var browseruser = "";
   	if(config!=null) {
 	 	browseruser = config.getConfigParameterValue("browseruser");
 	}

  	return browseruser;
}

function getBrowserPwd(){
	var config = getConfigurationItem();
	var browserpwd = "";
   	if(config!=null) {
 	 	browserpwd = config.getConfigParameterValue("browserpwd");
 	}

  	return browserpwd;
}

function getGatewayUrl(config) {
    if (!config) {    
        config = getConfigurationItem();
    }
    var gatewayurl = "";
    if(config) {
        gatewayurl = config.getConfigParameterValue("gateway.endpoint");
    }

    return gatewayurl;
}

function getGatewayUserName(config) {
    if (!config) {    
        config = getConfigurationItem();
    }
    var gatewayuser = "";
    if(config) {
        gatewayuser = config.getConfigParameterValue("gateway.user");
    }

    return gatewayuser;
}

function getGatewayPwd(config) {
    if (!config) {    
        config = getConfigurationItem();
    }
    var gatewaypwd = "";
    if(config) {
        gatewaypwd = config.getConfigParameterValue("gateway.pwd");
    }

    return gatewaypwd;
}

/**
 *  Invoked as Remote JS by client
 *  When no SMtoUCMDB smis instance, disabled, or no gateway url, return null
 *  Otherwise, return a json object
 *      {"endpoint" : <gateway.endpoint>,
 *       "authUrl" : <gateway auth url>,
 *       "user" : <gateway.user>,
 *       "password" : <gateway.pwd>}
 *       
 */
function getGatewayConfiguration() {  
    var config = getConfigurationItem();
    if (!config) {
        return null;
    }
    
    var gatewayurl = getGatewayUrl(config);
    if (!gatewayurl) {
        return null;
    }

    if (!gatewayurl.endsWith("/")) {
        gatewayurl += "/";
    }
    var gatewayauthurl = gatewayurl + "urest/v1/1/authentication?target=cms";
    var gatewayuser = getGatewayUserName(config);
    var gatewaypwd = getGatewayPwd(config)
    
    return {"endpoint" : gatewayurl,
            "authUrl" : gatewayauthurl,
            "user" : gatewayuser,
            "password" : lib.EncryptUtil.encrypt(gatewaypwd, false, true)};
}

/**
 * Migrate legacy UCMDB configuration
 */
function migrateUCMDBConfiguration() {

	if (!vars.$G_system_info.UCMDB) {
		return;
	}
	
	var $ = lib.c.$;
	
	// check instance
    var configInstance = $("SMISConfiguration", SCFILE_READONLY).setFields(["intId"]).select('name="SMtoUCMDB"').uniqueResult();
    
    // already exists
    if (configInstance != null) {
    	return;
    }
    
    // check template
    var registry = $("SMISRegistry", SCFILE_READONLY).select('name="SMtoUCMDB"').uniqueResult();
    if (registry == null) {
    	print(funcs.scmsg("676", "us", ["SMISRegistry","\"SMtoUCMDB\""]));
    	return;
    }

    configInstance = new SCFile("SMISConfiguration");
    configInstance.name = registry.name;
    configInstance.version = registry.version;
    configInstance.ctrlName = registry.ctrlName;
    configInstance.category = registry.category;
    configInstance.mgrName = registry.mgrName;
    configInstance.SMAdapter = registry.SMAdapter;
    configInstance.EPAdapter = registry.EPAdapter;
    configInstance.supportRT = registry.supportRT;
    configInstance.description = registry.description;
    configInstance.template = registry.name;
    configInstance.status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
    configInstance.loggerLevel = "INFO";
    
    // parameters
    var i, length = registry.paramInfo.length();
    for (i = 0; i < length; i++ ) {
    	var paramInfo = configInstance.paramInfo[i]; 
    	var rparamInfo = registry.paramInfo[i];
        paramInfo.paramName = rparamInfo.paramName;
        paramInfo.paramValue = rparamInfo.paramValue;
        paramInfo.paramDesc = rparamInfo.paramDesc;
        paramInfo.paramCategory = rparamInfo.paramCategory;
        paramInfo.paramType = rparamInfo.paramType;
        paramInfo.ispwd = rparamInfo.ispwd;
        paramInfo.caption = rparamInfo.caption;
        
        migrateParamSetting(paramInfo);
    }
    
    // set id
    lib.smis_ConfigurationManager.checkNumberFile("SMISConfiguration");
    var rc = new SCDatum();
    var number = new SCDatum();
    funcs.rtecall("getnumber", rc, number, "SMISConfiguration");
    configInstance.intId = number.getText();

	// save configuration instance
	rc = configInstance.doAction("addsave");
	
	// add fieldmapping
	if (rc == RC_SUCCESS) {
		var mapping = new SCFile("SMISFieldMapping");
		mapping.intId = configInstance.intId;
		mapping.doInsert(); 
	}
}


function migrateParamSetting(param) {
	var info = vars.$G_system_info;
	
	var name = param.paramName;
	
	if (name == "services.endpoint") {
		param.paramValue = info.UCMDB_services_endpoint;
	}
	else if (name == "user") {
		param.paramValue = info.UCMDB_user;
	}
	else if (name == "password") {
		param.paramValue = lib.operatorUtil.getPassword(info.UCMDB_password);
	}
	else if (name == "mt.services.endpoint") {
		param.paramValue = info.UCMDB_mt_services_endpoint;
	}
	else if (name == "mt.user") {
		param.paramValue = info.UCMDB_mt_user;
	}
	else if (name == "mt.password") {
		param.paramValue = lib.operatorUtil.getPassword(info.UCMDB_mt_password);
	}
	else if (name == "ucmdb.browser") {
		param.paramValue = info.ucmdb_browser;
	}	
}