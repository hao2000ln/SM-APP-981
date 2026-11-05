var _ = lib.Underscore.require();
var $ = lib.c.$;
var logger = getLog('RunRestfulIntegration');
var JSON = lib.JSON.json();

var PORTAL_URL_NAME = 'url';
var SUPPORT_TICKET_URL_NAME = 'supportTicketUrl';

var ServicePortalHandler = (function() {
  function getServicePortalInfo(request, response) {
    var info = lib.c.$('info', SCFILE_READONLY).select('type="company"').uniqueResult();
    var data = {};
    data[PORTAL_URL_NAME] = info['smsp.url'];
    data[SUPPORT_TICKET_URL_NAME] = info['smsp.supportticket.url'];
    response.send({ data:data });
  }

  function updateServicePortalInfo(request, response) {
    var object = request.body;
    
    var data = object.data || {};
    if(logger.isTraceEnabled()) {
      logger.trace('data', data);    
      logger.trace('object.data', object.data);
    }
    
    if (savePortalUrl(data[PORTAL_URL_NAME], data[SUPPORT_TICKET_URL_NAME])){
    	response.send({ message: funcs.scmsg('282', 'us') });
    }
    response.send({ message: funcs.scmsg('69', 'sla') });
  }
  return {
    GET : getServicePortalInfo,
    POST: updateServicePortalInfo,
    PUT: updateServicePortalInfo
  };
}());

var UCMDBHandler = { };

var CollaborationHandler = (function(){

  function updateCollSettings(req, res){
    var object = req.body;
    var data = object.data || {};
    if(logger.isTraceEnabled()) {
      logger.trace('data', JSON.stringify(data));
    }

    // validateChatServiceUrl
    try{
      if (data.smcEnabled) {validateChatServiceUrl(data.chatservicedomainport);}
    }catch(ex){
      return res.status(500).message(ex);
    }

    var readOnlyList = [];
    var setting = $('settings').select('name="Collaboration"').uniqueResult();
    if(!setting) {return res.status(404).message('No settings Record.');}
    $("settingsConfig").select('setting="Collaboration"').iterate(function(config){
      if(config.readonly) {readOnlyList.push(config.id);}
    });
    var keys = _.keys(data);
    var configIds = setting.settingId.toArray();
    _.each(configIds, function(id, index){
      if(_.contains(keys, id) && !_.contains(readOnlyList, id)){
        setting.settingValue[index] = '' + data[id];
      }
    });

    var rc = setting.doAction('save');
    if (rc !== RC_SUCCESS) {
      var STATE_CONST = lib.RestfulConstant.getHttpStatus();
      var http_code = STATE_CONST[rc] || 500;
      return res.status(http_code).message(RCtoString(rc));
    }

    res.send({Messages: RCtoString(rc)});
  }

  return {
    POST: updateCollSettings,
    PUT: updateCollSettings
  };
}());


function validateChatServiceUrl(chatserviceurl) {
    //HTTP Header
    var httpHeaders = [];

    //Content-Type
    var contentHeader = new Header();
    contentHeader.name = "Content-Type";
    contentHeader.value = "application/json";
    httpHeaders.push(contentHeader);
    //Auth
    var authHeader = new Header();
    var token = getLwssoToken(system.functions.operator());
    authHeader.name = "Cookie";
    authHeader.value = "LWSSO_COOKIE_KEY=" + token;
    //Construct Header
    httpHeaders.push(authHeader);

    //Service API URL
    var url = chatserviceurl + "api/config/simplechatconfig";
    var response = null;

    response = doHTTPRequest("GET", url, httpHeaders, null);

    return response;
}

var dispatcher = {
  servicePortal: ServicePortalHandler,
  ucmdb: UCMDBHandler,
  collaboration: CollaborationHandler
};

function dispatch(request, response) {
  var path = request.uri[2];
  var handler = dispatcher[path];
  if (!handler) {
    return response.status(404);
  }
  var method = request.options.method;
  var handle = handler[method];
  if (!_.isFunction(handle)) {
    return response.status(404);
  }
  handle(request, response);
}

function GET(request, response) {
  dispatch(request, response);
}

function POST(request, response) {
  dispatch(request, response);
}

function PUT(request, response) {
  dispatch(request, response);
}

function authorize() {
  return lib.security.getRights("Common Configuration", "admin") === "true";
}

function savePortalUrl(url, supportTicketUrl) {
	var info = lib.c.$('info').select('type="company"').uniqueResult();
	var updated = false;
	
    if(url && url!=info['smsp.url']) {
      info['smsp.url'] = url;
      updated = true; 
    }
    
    if(supportTicketUrl && supportTicketUrl!=info['smsp.supportticket.url']) {
      info['smsp.supportticket.url'] = supportTicketUrl;
      updated = true; 
    }
    
    if(info['sm.portal'] != 'SMSP'){
      info['sm.portal'] = 'SMSP';
      updated = true;
    }
    
    if(updated){
      var rc = info.doUpdate();      
      if(rc != RC_SUCCESS) {    
        return false;
      }
    }
    
    return true;
}

/**
 * https://<hostname>:<port>/saw/ess
 * https://<hostname>:<port>/saw/ess/propelOfferingPage/defaultSupprotOffering
 */
function enableXspPortal(server){
	savePortalUrl(server+'/saw/ess', server+'/saw/ess/propelOfferingPage/defaultSupprotOffering');
}

function setupSM(smHost){
	var info = lib.c.$('info').select('type="company"').uniqueResult();
	info['webserver.url'] = smHost+'/webtier/index.do';
	info['mobility.url'] = smHost+'/mobility';
	info.doUpdate();
}

function setUcmdbParams(param, info) {
	var name = param.paramName;
	
	if (name == "services.endpoint") {
		param.paramValue = info.url;
	}
	else if (name == "user") {
		param.paramValue = info.user;
	}
	else if (name == "password") {
		param.paramValue = info.pwd;
	}
	else if (name == "mt.services.endpoint") {
		param.paramValue = info.mtUrl;
	}
	else if (name == "mt.user") {
		param.paramValue = info.mtUser;
	}
	else if (name == "mt.password") {
		param.paramValue = info.mtPwd;
	}
	else if (name == "ucmdb.browser") {
		param.paramValue = info.browser;
	}
	else if (name == "browseruser"){
		param.paramValue = info.browserUser;
	}
	else if (name == "browserpwd"){
		param.paramValue = info.browserPwd;
	}
	else if (name == "filtertql"){
		param.paramValue = info.filterTql;
	}
	else if (name == "impactbundle"){
		param.paramValue = info.impactBundle;
	}
	else if (name == "impactcisperpage"){
		param.paramValue = 100;
	}
	else if (name == "ucmdbserver"){
		param.paramValue = 'Default Client';
	}
	else if (name == "passuserpwdinurl"){
		param.paramValue = "true";
	}
	else if (name == "showImpactWidget"){
		param.paramValue = "true";
	}
	else if (name == "showVisualizeWidget"){
		param.paramValue = "true";
	}
	else if (name == "impactseverity"){
		param.paramValue = 'critical';
	}
}

function enableUcmdb(ucmdbSvc, ucmdbUser, ucmdbPass, browserUri){
	
	var info = {};

	info.url  = ucmdbSvc+'axis2/services/ucmdbSMService';
	info.user = ucmdbUser;
	info.pwd  = ucmdbPass;
	info.mtUrl = ucmdbSvc+'axis2/services/UcmdbManagementService';
	info.mtUser = ucmdbUser;
	info.mtPwd = ucmdbPass;
	info.browser = browserUri+'/ucmdb-browser';
	info.browserUser = ucmdbUser;
	info.browserPwd  = ucmdbPass;
	info.filterTql = '';
	info.impactBundle = '';
		
	saveUcmdbParams(info);
}

function saveUcmdbParams(info){
	var $ = lib.c.$;
	
	// check instance
    var configInstance = $("SMISConfiguration", SCFILE_READONLY).setFields(["intId"]).select('name="SMtoUCMDB"').uniqueResult();
    
    // already exists
    if (configInstance != null) {
    	configInstance.doRemove();
    }
    
    // check template
    var registry = $("SMISRegistry", SCFILE_READONLY).select('name="SMtoUCMDB"').uniqueResult();
    if (registry == null) {
    	print(system.functions.scmsg("676", "us", ["SMISRegistry","\"SMtoUCMDB\""]));
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
    configInstance.status = lib.smis_Constants.INSTANCE_STATUS_RUNNING();
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
        
        setUcmdbParams(paramInfo, info);
    }
    
    // set id
    lib.smis_ConfigurationManager.checkNumberFile("SMISConfiguration");
    var rc = new SCDatum();
    var number = new SCDatum();
    system.functions.rtecall("getnumber", rc, number, "SMISConfiguration");
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
