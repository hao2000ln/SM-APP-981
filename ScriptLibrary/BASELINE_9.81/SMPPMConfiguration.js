/**
 * Get the configuration item of SMPPM Intergration
 */
function getConfigurationItem(){
	return lib.smis_ConfigurationManager.getEnabledConfigItem("SMPPM");
}


function isEnabled(){
	return getConfigurationItem()!=null;
}


function getPPMURL(){
	var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("PPMServerURL");
 	}
  	else { 
  		return null;
  	}
}

function getPPMDemandServiceURI(){
	return "/itg/ppmservices/DemandService";
}

function getPPMIntegrationServiceURI(){
	return "/itg/ppmservices/IntegrationService";
}

function getPPMProjectServiceURI(){
	return "/itg/ppmservices/ProjectService";
}


function getPPMRequestType(){
	var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("PPMRequestType");
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

function  getTaskIdField(){
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("taskid");
	}
  	else { 
  		return null;
  	}
}

function  getConnTimeOut(){
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("http.conn.timeout") - 0;
	}
  	else { 
  		return 30;
  	}
}

function  getSendTimeOut(){
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("http.send.timeout") - 0;
	}
  	else { 
  		return 30;
  	}
}

function  getRecTimeOut(){
    var config = getConfigurationItem();
   	if(config!=null) {
 	 	return config.getConfigParameterValue("http.rec.timeout") - 0;
	}
  	else { 
  		return 30;
  	}
}