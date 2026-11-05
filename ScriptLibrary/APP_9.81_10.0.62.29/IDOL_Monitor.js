// http://en.wikipedia.org/wiki/List_of_file_signatures

// service manager "attachment value" is interpreted as "javascript string"
// and javascript string is encoded in unicode, the "char code" size is two byte
// so need to consider big/little endian situation
var IDOL_Monitor = (function() {
  var IDOLRequest = lib.IDOLRequest.require();
  var xQuery = lib.XQuery.require(),
      IDOLKMIndexService = lib.IDOLKMIndexService.require(),
      IDOLURLParser = lib.IDOLURLParser.require(),
      logger = getLog('IDOL_Monitor');
  
  function retrieveOMNIGroupServer() {
  	
  	var idolConfig = lib.IDOLConfigure.require().getConfig();
    if(!lib.IDOLConfigure.require().isInContainer()){
      var url = idolConfig['server.url'];
    
      var param = 'a=getstatus';
      try {
        var statusRes = lib.jsaci.runIDOLAction(url + param, false);
      } catch (e) {
        funcs.msg(funcs.scmsg('102', 'idol', [url + param, e]), 3);
        return null;
      }
      var xml = new XML();
      xml.setContent(statusRes);
      var servicePort = xQuery.queryText('responsedata/serviceport', xml);  

      param = 'a=getconfig';
      var idolServerEP = IDOLURLParser.parse(url);
      
      var tmpHost = idolServerEP.host;
      if (tmpHost.indexOf('[') <0 && tmpHost.indexOf(':') >0)
      {
        tmpHost = '['+tmpHost+']';
      }
      var newURL = 'http://' + tmpHost + ':' + servicePort + '/';
    
      
      var configRes = lib.jsaci.sendRequestToIDOL(newURL + param, '');
      var hostExp = new RegExp('^groupServerHost=([^]*?)$', 'mgi');
      var portExp = new RegExp('^GroupServerPort=([^]*?)$', 'mgi');
      var host, port;  

      var hostExpRes = hostExp.exec(configRes);  

      if (!hostExpRes) {
        return null;
      }
      host = hostExpRes[1];
      
      var portExpRes = portExp.exec(configRes);  

      if (!portExpRes) {
        return null;
      }
      port = portExpRes[1];
    
      
      if (host.toLowerCase() === 'localhost' || host === '127.0.0.1') {
        var idolHostExp = new RegExp('http[s]?://([^]*?):[0-9]+/', 'mgi');
        host = idolHostExp.exec(url)[1];
        
      }
      return [host, port];
    } else {
      return retrieveOMNIGroupServerContainer();
    }
 	  
  }
  
  function retrieveOMNIGroupServerContainer() {
    var idolConfig =new SCFile("idolserverinfo");
    if (idolConfig.doSelect("true") === RC_SUCCESS) {
      var url = idolConfig['community.url'];
      var idolServerEP = IDOLURLParser.parse(url);
      var servicePort = idolConfig['community.service.port'];
      
      var tmpHost = idolServerEP.host;
      if (tmpHost.indexOf('[') <0 && tmpHost.indexOf(':') > 0)
      {
        tmpHost = '['+tmpHost+']';
      }
      
      var newURL = 'http://' + tmpHost + ':' + servicePort + '/';
    
      var param = 'a=getconfig';
      
      var configRes = lib.jsaci.sendRequestToIDOL(newURL + param, '');
      var hostExp = new RegExp('^groupServerHost=([^]*?)$', 'mgi');
      var portExp = new RegExp('^GroupServerPort=([^]*?)$', 'mgi');
      var host, port;
  
      var hostExpRes = hostExp.exec(configRes);
  
      if (!hostExpRes) {
        return null;
      }
      host = hostExpRes[1];
      
      var portExpRes = portExp.exec(configRes);
  
      if (!portExpRes) {
        return null;
      }
      port = portExpRes[1];
    
      if (host.toLowerCase() === 'localhost' || host === '127.0.0.1') {
        var idolHostExp = new RegExp('http[s]?://([^]*?):[0-9]+/', 'mgi');
        host = idolHostExp.exec(url)[1];
        
      }
      return [host, port];
    }
    return ["", ""];
  }
  
  function retrieveCFS(spUrl) {
  	var param = 'a=getstatus';
  	try {
  		var statusRes = lib.jsaci.runIDOLAction(spUrl + param, false);
  	} catch (e) {
  		funcs.msg(funcs.scmsg('102', 'idol', [spUrl + param, e]), 3);
  		return null;
  	}
  	var xml = new XML();
  	xml.setContent(statusRes);
  	var servicePort = xQuery.queryText('responsedata/serviceport', xml);
  	
  	param = 'a=getconfig';
  	
  	var idolServerEP = IDOLURLParser.parse(spUrl);
  	
  	var tmpHost = idolServerEP.host;
  	if (tmpHost.indexOf('[') <0 && tmpHost.indexOf(':') >0)
    {
    	tmpHost = '['+tmpHost+']';
    }
    
  	var newURL = 'http://' + tmpHost + ':' + servicePort + '/';
  	
  	var configRes = lib.jsaci.sendRequestToIDOL(newURL + param, '');
  	if (!configRes) {
  		return null;
  	}
    var protocolExp = new RegExp('^IngestSSLConfig=([^]*?)$', 'mgi');
  	var hostExp = new RegExp('^IngestHost=([^]*?)$', 'mgi');
  	var portExp = new RegExp('^IngestPort=([^]*?)$', 'mgi');
  	var host = hostExp.exec(configRes)[1];
  	var port = portExp.exec(configRes)[1];
  	var protocol = protocolExp.exec(configRes) == null ? 'http' : 'https';
  	if (host.toLowerCase() === 'localhost' || host === '127.0.0.1') {
  		
  		var idolHostExp = new RegExp('http[s]?://([^]*?):[0-9]+/', 'mgi');
  		host = idolHostExp.exec(spUrl)[1];
  		
  	}
  	return [protocol, host, port];
  }
  
  /*
  *This function is to show the SharePoint Status in IDOL Monitor
  */
  function showStatusInUI(idolConfig) {
  	var sharePointStatus = lib.IDOL_SharePoint.require().getSharePointConfig(idolConfig, 'sharepoint');
	vars['$sharepoint.url'] = sharePointStatus[0];
	var arrStatus = sharePointStatus[1];
	vars['$sharepoint.status'] = [];

	for (var i = 0, j = arrStatus.length; i < j; i++) {
		if (arrStatus[i] != true) {
    		vars['$sharepoint.status'].push(funcs.scmsg('77', 'idol')); // offline
    	} else {
    		vars['$sharepoint.status'].push(funcs.scmsg('76', 'idol')); // online
    	}
	}
  }
  
  function showOMNIGroupServerInUI() {
  	var omniGroupTemp = retrieveOMNIGroupServer();
  	if (!omniGroupTemp) {
  		vars['$omniGroup.url'] = '';
  		vars['$omniGroup.status'] = '';
  		return;
  	}
  	
	vars['$omniGroup.url'] = 'http://' + omniGroupTemp[0] + ':' + omniGroupTemp[1] + '/';
	var status = lib.jsaci.checkServerStatus(vars['$omniGroup.url'], false);
	if (status != true) {
    	vars['$omniGroup.status'] = funcs.scmsg('77', 'idol'); // offline
    } else {
    	vars['$omniGroup.status'] = funcs.scmsg('76', 'idol'); // online
	}
  }
  
  function showAllCFSInUI(idolConfig) {
  	
  
  	vars['$cfs.url'] = [];
  	vars['$cfs.status'] = [];
  	
  	var urls = vars['$sharepoint.url'].toArray().concat(vars['$http.url'].toArray(), vars['$fs.url'].toArray());
  	var statuses = vars['$sharepoint.status'].toArray().concat(vars['$http.status'].toArray(), vars['$fs.status'].toArray());
  	for (var i = 0; i < urls.length; i++) {
  		var status = statuses[i];
  		if (status === funcs.scmsg('76', 'idol')) {
  			var cfsInfo = retrieveCFS(urls[i]);
  			if(cfsInfo){
  			var cfsUrl = cfsInfo[0] + '://' + cfsInfo[1] + ':' + cfsInfo[2] + '/';
  			if (!lib.ArrayUtil.contains(vars['$cfs.url'], cfsUrl)){
  				vars['$cfs.url'].push(cfsUrl);
  				var status = lib.jsaci.checkServerStatus(cfsUrl, idolConfig['use.oem.license']);
  				if (status != true) {
    				vars['$cfs.status'].push(funcs.scmsg('77', 'idol')); // offline
    			} else {
    				vars['$cfs.status'].push(funcs.scmsg('76', 'idol')); // online
				}
			 }
		  }
  		}
  	}
  }
  
  function showAllHttpInUI(idolConfig) {
  	var httpStatus = lib.IDOL_SharePoint.require().getSharePointConfig(idolConfig, 'http');
	vars['$http.url'] = httpStatus[0];
	var arrStatus = httpStatus[1];
	vars['$http.status'] = [];

	for (var i = 0, j = arrStatus.length; i < j; i++) {
		if (arrStatus[i] != true) {
    		vars['$http.status'].push(funcs.scmsg('77', 'idol')); // offline
    	} else {
    		vars['$http.status'].push(funcs.scmsg('76', 'idol')); // online
    	}
	}
  }
  
  
  function showAllFSInUI(idolConfig) {
  	var httpStatus = lib.IDOL_SharePoint.require().getSharePointConfig(idolConfig, 'filesystem');
	vars['$fs.url'] = httpStatus[0];
	var arrStatus = httpStatus[1];
	vars['$fs.status'] = [];

	for (var i = 0, j = arrStatus.length; i < j; i++) {
		if (arrStatus[i] != true) {
    		vars['$fs.status'].push(funcs.scmsg('77', 'idol')); // offline
    	} else {
    		vars['$fs.status'].push(funcs.scmsg('76', 'idol')); // online
    	}
	}
  }
  
  function showAllOKMInUI(idolConfig) {
  	var httpStatus = lib.IDOL_SharePoint.require().getSharePointConfig(idolConfig, 'okm');
	vars['$okm.url'] = httpStatus[0];
	var arrStatus = httpStatus[1];
	vars['$okm.status'] = [];
	for (var i = 0, j = arrStatus.length; i < j; i++) {
		if (arrStatus[i] != true) {
    		vars['$okm.status'].push(funcs.scmsg('77', 'idol')); // offline
    	} else {
    		vars['$okm.status'].push(funcs.scmsg('76', 'idol')); // online
    	}
	}
  }
  
    function showAllConfluenceInUI(idolConfig) {
    var httpStatus = lib.IDOL_SharePoint.require().getSharePointConfig(idolConfig, 'confluence');
    vars['$confluence.url'] = httpStatus[0];
    var arrStatus = httpStatus[1];
    vars['$confluence.status'] = [];
    for (var i = 0, j = arrStatus.length; i < j; i++) {
        if (arrStatus[i] != true) {
            vars['$confluence.status'].push(funcs.scmsg('77', 'idol')); // offline
        } else {
            vars['$confluence.status'].push(funcs.scmsg('76', 'idol')); // online
        }
    }
  }

  function syncUsers()
  {
      var omniServer = retrieveOMNIGroupServer();
      if( omniServer )
      {
         var idolConfig = lib.IDOLConfigure.require().getConfig();
 	     var url = idolConfig['server.url']; 
 	     
 	     var idolServerEP = IDOLURLParser.parse(url);
 	     
         var idolhost = idolServerEP.host;
		 var idolport = idolServerEP.port;
		 
         var omniUrl = 'http://' + omniServer[0] + ':' + omniServer[1] + '/';
         var param ="action=Index&repository=combine&drehost="+idolhost+"&dreaciport="+idolport+"&DreDatabase=Users";
         
         try{
             IDOLKMIndexService.createIndexDB('Users');
           }
           catch( e ){logger.error(e.message);}
           try{
               lib.jsaci.sendRequestToIDOL(omniUrl + param, '');
           }
           catch( e){
             logger.error(e.message);
             logger.info(e.stack);
             throw e;
           }
      }
  }
  
  return {
  	retrieveOMNIGroupServer: retrieveOMNIGroupServer,
    showStatusInUI: showStatusInUI,
    showOMNIGroupServerInUI: showOMNIGroupServerInUI,
    showAllCFSInUI: showAllCFSInUI,
    showAllHttpInUI: showAllHttpInUI,
    showAllFSInUI: showAllFSInUI,
    syncUsers:syncUsers,
    retrieveCFS: retrieveCFS,
    showAllOKMInUI:showAllOKMInUI,
    showAllConfluenceInUI:showAllConfluenceInUI
  }
})();


function require() {
  return IDOL_Monitor;
}