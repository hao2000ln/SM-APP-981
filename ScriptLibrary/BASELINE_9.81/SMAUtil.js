// This file provide functions which will be invoke when deploying SM in SMA suite environment

var $ = lib.c.$;
var logger = getLog("SMAUtil");


/**
 * Setup Integration
 *
 * @param	{String}	smHost
 * @param	{String}	portalServer
 */
function setupIntegration(smHost, portalServer) {

	logger.info("enable chat...");
	enableCollaboration();
	
	logger.info("enable smart analytics...");
	lib.idol_enable_container.enable();
	
	logger.info("setup webtier & mobility url..."); 
	lib.RunRestfulIntegration.setupSM(smHost);
	
	logger.info("enable XSP portal...");
	lib.RunRestfulIntegration.enableXspPortal(portalServer);
	
	logger.info("add uCMDB menu...");	
	addUcmdbMenu();
	
	logger.info("update ldap field mapping ...");
	updateLdapSetting();
	
	logger.info("create template operator *SYSDEFAULTS ...");
	createSysDefaultOperator();
	
	logger.info("create template operator Template_SelfService ...");
	updateOperatorTemplateSelfService();
	
	logger.info("create Prople User Role ...");
	updatePropelUserRole();
	
	logger.info("Adding background schedule KMReindex... ");
	addScheduleToStartUp('KMReindex');
	
	logger.info("Update PurgeUnload PurgeOutofBoxData...");
	updatePurgeDataUnload();
}


/**
 * Enable Chat
 */
function enableCollaboration() {
	var settings = $("settings").select('name="Collaboration"').uniqueResult();
	var ids = settings.settingId;
	var values = settings.settingValue;

	// new settings	
	var config = {
		"smcEnabled":"true",
		"smcBoshURL":"/of-http-bind/",
		"openfireDomainName":"sm-chat",
		"smcPluginURL":"/of-plugins/",
		"chatserviceurl":"/chatservice/",
		"chatservicedomainport":"http://sm-chatsvc-svc:8088/",
		"endUserChatEnabled":"1"
	};
	
	var i, length = ids.length();
	for (i = 0; i < length; i++) {
		var id = ids[i];
		if (config.hasOwnProperty(id)) {
			values[i] = config[id];
		}
	}
	
	settings.doUpdate();	
}


/**
 * Add uCMDB web URL and browser URL into HOME menu
 */
function addUcmdbMenu() {
	
	if (!lib.uCMDBConfiguration.isEnabled()) {
		logger.info("uCMDB integration is not enabled.");
		return;
	}
	
	var item = {};
	
	var browserUrl = lib.uCMDBConfiguration.getBrowserUrl();
	var adminUrl;
	
	if (browserUrl != null) {
		var index = browserUrl.lastIndexOf('/');
		if (index != -1) {
			adminUrl = browserUrl.substring(0, index + 1) + 'ucmdb-ui';
		}
	}
	
	// uCMDB Admin
	item.description = "uCMDB Admin";
	item.application = "us.launch.external";
	item.pname = "name";
	item.pvalue = adminUrl;
	item.condition = 'index("SysAdmin", $lo.ucapex)>0';
	addMenu("HOME", item);
	
	// uCMDB Browser
	item.description = "uCMDB Browser";
	item.application = "us.launch.external";
	item.pname = "name";
	item.pvalue = browserUrl;
	item.condition = 'index("SysAdmin", $lo.ucapex)>0';
	addMenu("HOME", item);
}


/**
 * add menu
 *
 * @param 	{String}	parent menu name
 * @item	{Object}	sub menu item
 */
function addMenu(parent, item) {

	var menu = $("menu").select('name="' + parent + '"').uniqueResult();
	if (menu == null || menu.description == null) {
		logger.warn('menu "' + parent + '" not found.');
		return;
	}
	
	var length = menu.description.length();

	// get current option
	var currentOption = -1;
	if (menu.option != null && menu.option.length() == length) {
		var lastOption = menu.option[length - 1];
		if (lastOption != null) {
			currentOption = lastOption + 1;
		}
	}
	
	// add new menu item
	if (currentOption > 0) {
		menu.option[length] = currentOption;
	}
	menu.description[length] = item.description;
	menu.application[length] = item.application;
	menu.pname[length] = item.pname;
	menu.pvalue[length] = item.pvalue;
	menu.condition[length] = item.condition;
	
	var rc = menu.doUpdate();
	if (rc != RC_SUCCESS) {
		logger.error('menu "' + parent + '" update failed.');
	}
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
/**
 * add Web Service related capability word "RESTful API" and "SOAP API" to operator
 */
function addWebServiceCapToOperator(name) {
	$('operator').select('name="'+name+'"').iterate(function(o){
		var list = o['cap.exec'].toArray();
		
		var f = function(word) {
			var k;
			for (k=0;k<list.length;k++) {
				if(list[k]==word) {
					return;
				}
			}
			
			list.push(word);
		};

		f('RESTful API');
		f('SOAP API');
		
		o['cap.exec'] = list;
		o.doUpdate();
	});
	
}

/**
 * Update Operator Template Template_SelfService
 */
function updateOperatorTemplateSelfService() {
	addWebServiceCapToOperator('Template_SelfService');
}

/**
 * Add LDAP Field mapping for operator and contacts. 
 */
function updateLdapSetting() {
	var count, k, length;
	
	$('datadict').select('name="operator"').iterate(function(item){
		item.ldapfirst = true;
		count=0;
		length = item.fields.length();
		for (k=0; k<length && count<4; k++) {
			var field = item.fields[k];
			if(field=='contact.name') {
				item.ldapattrname[k]='cn';
				count++;
			} else if(field=='email') {
				item.ldapattrname[k]='mail';
				count++;
			} else if(field=='full.name') {
				item.ldapattrname[k]='cn';
				count++;
			} else if(field=='name') {
				item.ldapattrname[k]='uid';
				count++;
			}
		}
		
		item.doUpdate();
	});
	
	
	$('datadict').select('name="contacts"').iterate(function(item){
		item.ldapfirst = true;
		count=0;
		length = item.fields.length(); 
		for (k = 0; k < length && count<4;k++) {
			var field = item.fields[k];
			if(field=='contact.name') {
				item.ldapattrname[k]='cn';
				count++;
			} else if(field=='first.name') {
				item.ldapattrname[k]='sn';
				count++;
			} else if(field=='full.name') {
				item.ldapattrname[k]='cn';
				count++;
			} else if(field=='operator.id') {
				item.ldapattrname[k]='uid';
				count++;
			}
		}
		
		item.doUpdate();
	});
}

/**
 * Create template operator *SYSDEFAULTS
 */
function createSysDefaultOperator() {
	var item = new SCFile('operator');
	if(item.doSelect('name="*SYSDEFAULTS"')==RC_SUCCESS) {
		return;
	}
	
    item["name"]="*SYSDEFAULTS";
    item["cap.exec"] = ["service desk", "svcCatEmployeeRequester","service catalog","change request", "RESTful API","SOAP API"];
	item.password='=SH557BB7EE759076EAF01F4CB3ADA64A0529F21163D98FCE524EF72EF90D49B3197437BFEEA578C1B20AE7C054CE5289BF6331435A1C7E96C6DCA979E9B20A98B1F512=';
	item["password.errors"] = 0;
	item["login.revoked"] = false;
	item["display.currency.code"] = "USD";
	item["profile.service"]= "self service";
	item["user.role"] = "self service";
	item["man.lockout.user"] = false;
	item["user.login.count"] = 0;
	item["reset.by"] = "falcon";
	item["locked.reason"] = 0;
	item["do.password.reset"] = false;
	item["expire.password"] = false;
	item["ess.access.only"] = false;
	item["ess.menu"] = "ESSSM";
	item["ess.initial.app"] = "7";
	item["profile.sla"] = "DEFAULT";
	item["template.operator"] = true;
	item["syslanguage"] = "en";
	item["secRole"] = ["DEFAULT", "self service"];
	item["todo.list.max.size"] = 20;
	item["todo.list.interval"] = 3;
	item["todo.list.source.isgroup"] = false;
		
	item.doInsert();
}

/**
 * Prople Settings
 * Add Web Service Capbility Word to User Role and Operator 
 */
function updatePropelUserRole() {
	var f = function(list, word) {
		var k;
		for (k=0;k<list.length;k++) {
			if(list[k]==word) {
				return;
			}
		}
		
		list.push(word);
	};
	
	$('userrole').select('name="service catalog manager" or name="self service"').iterate(function(item){
		var list = item['cap.exec'].toArray();
		f(list, 'RESTful API');
		f(list, 'SOAP API');
		item['cap.exec'] = list;
		item.doUpdate();
	});
	
	$('operator').select('name="Amy.Lopez"').iterate(function(o){
		var list = o['cap.exec'].toArray();
		f(list, 'RESTful API');
		f(list, 'SOAP API');		
		o['cap.exec'] = list;
		o.doUpdate();
	});
	
	addWebServiceCapToOperator('Aaron.Caffrey');
}

/**
 * Update Purge OOB Unload to align Suite operator and contacts.
 */
function updatePurgeDataUnload() {
	$('unload').select('name="PurgeOutofBoxData"').iterate(function(item){
		var k, length = item.record.length(); 
		for (k = 0; k < length; k++) {
			var fileName = item.record[k]['filename'];
			if(fileName=='contacts') {
				item.record[k]['query']='contact.name~="FALCON, JENNIFER" and contact.name~="INTEGRATION, ADMIN" and contact.name~="SYS, ADMIN" and contact.name~#"TEMPLATE"';
			}else if(fileName=='operator'){
				item.record[k]['query']='name~="falcon" and name~="intgAdmin" and name~="sysadmin" and name~#"TEMPLATE" and name~#"Template" and name~="*SYSDEFAULTS"';
			} else if (fileName=='idolpbmhunter') {
				item.record[k]['query']='false';
			}
		}
		
		item.doUpdate();
	});
}

/**
 * Add a background schedule to startup
 */
function addScheduleToStartUp(schedulerName){
  	var info = new SCFile('info');
  	info.doSelect('type = "startup"');

	var i, length = info['process.start.infos'].length();
  	for (i = 0; i < length; i++) {
    	if (info['process.start.infos'][i]['name'] === schedulerName) {
    	  	return;
    	}
  	}

  	var parameters = new SCDatum();
  	parameters.setType(8);
  	parameters.push('scheduler');
  	parameters.push(schedulerName);
  	parameters.push('300');
  	parameters.push('1');

  	var name = schedulerName;

  	var processInfo = new SCDatum();
  	processInfo.setType(9);
  	processInfo.push(name);
  	processInfo.push(parameters);

  	info['process.start.infos'].push(processInfo);

  	info.doUpdate();  
}


function updateLDAPInfo(LDAPServer, LDAPPort, isSSLEnabled, LDAPCertPath, LDAPBase) {

	logger.info("update LDAP information");
	
    var fLdapconfig = new SCFile("scldapconfig");
    var ldap = fLdapconfig.doSelect("counter=1");
    fLdapconfig["ldaphost"] = LDAPServer;
    fLdapconfig["ldapport"] = LDAPPort;
    fLdapconfig["ldapssl"] = isSSLEnabled;
    
	if (isSSLEnabled === "true") {
		fLdapconfig["ldapssl"] = true;
	    fLdapconfig["ldapssldbpath"] = LDAPCertPath;
	}
	else {
		fLdapconfig["ldapssl"] = false;
	}
    fLdapconfig["ldapbase"] = LDAPBase;
    fLdapconfig.doUpdate();
}


function updateLDAPAttributeMapping(filename, field, attribute) {

	logger.info("update LDAP attribute mapping: " + filename + "," + field + "," + attribute);

    var fDatadict = new SCFile("datadict");
    var operator = fDatadict.doSelect("name=\"" + filename + "\"");
    var fields = fDatadict["fields"];
    var attrs = fDatadict["ldapattrname"];
    var ind = funcs.index(field, fields);
    if (ind > 0) {
    	attrs[ind - 1] = attribute;
    	fDatadict.doUpdate();
    }
}