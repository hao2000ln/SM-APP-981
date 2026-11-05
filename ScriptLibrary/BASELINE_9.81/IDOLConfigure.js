/**
 * This library is used to store/modify the configuration of IDOL integration
 * 
 * TODO: may need to cache the configure value
 */
var IDOLRequest = lib.IDOLRequest.require(),
    IDOLMandant = lib.IDOLMandant.require(),
    IDOLURLParser = lib.IDOLURLParser.require(),
    XQuery = lib.XQuery.require();

var IDOLConfig = (function() {
  function isDistributeMode() {
    var endpoint = getServerEndPoint(),
        doc = IDOLRequest.doIDOLGet(endpoint, { action : 'getstatus' }),
        engines = XQuery.query('responsedata/engines/engine', doc);
    return engines.length > 0;
  }

  function getTopicmapConfig(filename) {
    var idolpbmhunter = new SCFile("idolpbmhunter");
    var rc = idolpbmhunter.doSelect(new QueryCond('table.name', EQ, filename));
    if (rc !== RC_SUCCESS) {
      throw new Error("hot topic analytics for \"" + filename + "\" is not configured");
    }
    var f = new SCFile("kmknowledgebase");
    var db = idolpbmhunter["database.name"];
    var count = f.doCount('sclibtablename="'+filename+'"');
    var bfound = false;
    if(count > 1 && filename == "rootcause")
    {
      //root cause known error
      rc = f.doSelect('sclibtablename="'+filename+'"');
      var evfile = new SCFile("rootcause");
      evfile.isKnownError=true;
      while(rc == RC_SUCCESS)
      {
         if(!funcs.evaluate_query(f.scquery, evfile))
         {
           bfound = true;
           break;
         }
         rc = f.getNext();
      }
    }
    else
    {
      rc = f.doSelect('sclibtablename="'+filename+'"');
      if(rc == RC_SUCCESS)
      {
        bfound = true;
      }
    }
    var title_field= idolpbmhunter["title.field"];
    
    var printfields =[];
    if(bfound)
    {
      db = f.kbname;
      var scfields = idolpbmhunter["contents.fields"].toArray();
      for(var i=0;i<scfields.length;i++)
      {
        printfields.push(lib.IDOL_Help.getKMIDOLFieldName(f, scfields[i]));
      }
    }
    if( lib.IDOL_Help.checkKMTitleField(f,title_field) == false)
    {
      printfields.push(lib.IDOL_Help.getKMIDOLFieldName(f, title_field));
    }
    return {
      database :db ,
      maxresults : idolpbmhunter["limit.number"],
      showall : idolpbmhunter["show.all"],
      groupby : idolpbmhunter["group.by"],
      candidatesAction : idolpbmhunter["candidates.action"],
      candidatesQuery  : idolpbmhunter["candidates.query"],
      summary : 'context',
      maxchars : 300,
      minscore : 30,
      printFields: printfields.join(","),
      titleField: lib.IDOL_Help.getKMIDOLFieldName(f, title_field),
      async: idolpbmhunter["async"]? true: false
    };
  }

  /*
  * Get idolserverconfig record and set it to global var $G.idol.server.config
  * if $G.idol.server.config doesn't exist, retrieve from DB.
  */
  function getIDOLServerConfig() {
    if (vars['$G.idol.server.config']) {
      //print('return global');
      return vars['$G.idol.server.config'];
    }
    var server = new SCFile("idolserverinfo", SCFILE_READONLY);
    var rc = server.doSelect("true");
    if (rc !== RC_SUCCESS) {
      throw new Error("IDOL server is not configure correctly. " + RCtoString(rc));
    }
    vars['$G.idol.server.config'] = server;
    return server;
  }

  /*
  * Clear the global var $G.idol.server.config
  */
  function clearIDOLServerConfigCache() {
    vars['$G.idol.server.config'] = null;
    vars['$G.gs.index.url'] = null;
    vars['$G.km.globalenv']['km.expiration.period'] = null;
    lib.jsaci.clearIDOLServer();
  }

  function getIDOLIndexBaseURL() {
    var endpoint = IDOLConfig.getEndPoint(),
        doc = IDOLRequest.doIDOLGet(endpoint, { action : 'getstatus' }),
        indexPort = XQuery.queryText('responsedata/indexport', doc),
        ssl = XQuery.queryText('responsedata/indexport_ssl_enabled', doc);

    var query = IDOLURLParser.parse(endpoint),
        protocol = query.protocol,
        host = query.host;

    // TODO: should use protocal base on 'ssl' flag
    // but ssl option doesn't work as expected. (IDOL v10.5)
    // Even index port configured ssl, this value here will still be false
    if (host.indexOf('[') <0 && host.indexOf(':') >0)
    {
    	host = '['+host+']';
    }
   
    return protocol + '://' + host + ':' + indexPort + '/';
  }
  
  // For IDOL server
  function getServerEndPoint() 
  {
    var server = getIDOLServerConfig();
    var url = server['server.url'];
    if (!url) {
      throw new Error("IDOL Server url is not configured");
    }
    return url;
  }
  function getHTAServerEndPoint() {
    var server = getIDOLServerConfig();
    var search_msvc_url = server['search.msvc.url'];
    var index_msvc_url = server['index.msvc.url'];
    var installer_msvc_url = server['installer.msvc.url'];
    var config_msvc_url = server['config.msvc.url']
    if (search_msvc_url && index_msvc_url && installer_msvc_url && config_msvc_url) 
    {
      return search_msvc_url;
    }
    var url = server['server.url'];
    if (!url) {
      throw new Error("IDOL Server url is not configured");
    }
    return url;
  }
  // For IDOL Image server
  function getImageServerEndPoint() {
    var server = getIDOLServerConfig();
    var url = server['image.url'];
    if (!url) {
      throw new Error("IDOL Image server is not configured");
    }
    return url;
  }
  
  function getAPIChannel() {
    var server = getIDOLServerConfig();
    return server.use_oem_license ? 'oem' : 'http';
  }

  // If 'multi.company' flag is checked, the system is running in Multi-tenant mode
  // and the 'company' field are available in every business module
  // 
  // but in IDOL system, if running in multi-company mode, every company will have
  // its only database. And its IDOL database name is depend on "mandant field"
  // 
  // That is to say, even system is running in multi-company mode, but doesn't have
  // mandant field defined, all the data will still store in ONE database in IDOL.
  function isMultiCompany(filename) {
    if (!filename) return isMultiCompanyEnabled();
    return isMultiCompanyEnabled() && !!(filename ? IDOLMandant.getMandantField(filename) : true);
  }

  function isMultiCompanyEnabled() {
    // XXX: when task was running in background process, the enviroment variable may 
    // not available, has to retrieve it from database
    var info = new SCFile("info"),
        query = new QueryCond("type", EQ, "company"),
        rc;
    rc = info.doSelect(query);
    return rc === RC_SUCCESS ? !!info["multi.company"] : false;
  }
  
  function getGSIndexUrl() {
  
  	if(!isInContainer()){  	
      if (vars['$G.gs.index.url']) {
         return vars['$G.gs.index.url'];
      }
	    
	  vars['$G.gs.index.url'] = lib.IDOL_Tools_Tree.getGSIndexUrl(getServerEndPoint());
	  return vars['$G.gs.index.url'];
    }else{
      return getIndexMsvcEndPoint();
    }
  }
  
  function isInContainer() {
    var server = getIDOLServerConfig();
    var search_msvc_url = server['search.msvc.url'];
    var index_msvc_url = server['index.msvc.url'];
    var installer_msvc_url = server['installer.msvc.url'];
    var config_msvc_url = server['config.msvc.url']
    if (search_msvc_url && index_msvc_url && installer_msvc_url && config_msvc_url) {
      return true;
    }
    return false;  
  }
  
  function getIndexMsvcEndPoint() {
  	var endpoint = getIndexMsvcCommonPoint();
  	
    var doc = IDOLRequest.doIDOLGet(endpoint, { action : 'getstatus' });
    var indexPort = XQuery.queryText('responsedata/indexport', doc);
    var ssl = XQuery.queryText('responsedata/indexport_ssl_enabled', doc);
    
    var query = IDOLURLParser.parse(endpoint);
    var protocol = query.protocol;
    var host = query.host;

    if (host.indexOf('[') <0 && host.indexOf(':') >0){
    	host = '['+host+']';
    }
   
    return protocol + '://' + host + ':' + indexPort + '/';
    //return 'http://16.155.195.158:30971/';
  }
  
  function getIndexMsvcCommonPoint() {
  	var server = getIDOLServerConfig();
    var search_msvc_url = server['index.msvc.url'];

    if (!search_msvc_url) {
      throw new Error("IDOL search micro service endpoint is not configured");
    }
    return search_msvc_url;  
  }
  function getInstallerMsvcEndPoint() {
    var server = getIDOLServerConfig();
    var installer_msvc_url = server['installer.msvc.url'];

    if (!installer_msvc_url) {
      system.functions.rtecall('log','','IDOL installer micro service endpoint is not configured.');
      //throw new Error("IDOL installer micro service endpoint is not configured");
    }
    return installer_msvc_url;  
  }
  function getSearchMsvcEndPoint() {
    var server = getIDOLServerConfig();
    var index_msvc_url = server['search.msvc.url'];

    if (!index_msvc_url) {
      throw new Error("IDOL search micro service endpoint is not configured");
    }
    return index_msvc_url;  
  }
  
  function getConfigurationMsvcEndPoint() {
    var server = getIDOLServerConfig();
    var installer_msvc_url = server['config.msvc.url'];

    if (!installer_msvc_url) {
      system.functions.rtecall('log','','IDOL installer micro service endpoint is not configured.');
      //throw new Error("IDOL installer micro service endpoint is not configured");
    }
    return installer_msvc_url;  
  }
  
  var actions = {
    getHTAServerEndPoint : getHTAServerEndPoint,
    getEndPoint : getServerEndPoint,
    getImageEndPoint : getImageServerEndPoint,
    getIDOLIndexBaseURL : getIDOLIndexBaseURL,
    getConfig : getIDOLServerConfig,
    isMultiCompany : isMultiCompany,
    getAPIChannel : getAPIChannel,
    getTopicmapConfig : getTopicmapConfig,
    isDistributeMode : isDistributeMode,
    clearIDOLServerConfigCache : clearIDOLServerConfigCache,
    getGSIndexUrl : getGSIndexUrl,
    isInContainer : isInContainer,
    getIndexMsvcCommonPoint : getIndexMsvcCommonPoint,
    getSearchMsvcEndPoint : getSearchMsvcEndPoint,
    getIndexMsvcEndPoint : getIndexMsvcEndPoint,
    getInstallerMsvcEndPoint: getInstallerMsvcEndPoint,
    getConfigurationMsvcEndPoint: getConfigurationMsvcEndPoint
  };

  // This flag is used to control the cache, because configurations may access may times
  // and oughtouthg not change frequently, so can store them in cache
  // but once this option is enabled, everytime configuration change, may need reload this
  // file or user re-login, or reboot to make sure background schedule recognize these change.

  // var MEMORIZE = false;
  // if (MEMORIZE) {
  //   _.each(actions, function(v, k) {
  //     actions[k] = _.memoize(v);
  //   });
  // }

  return actions;
})();

function require() {
  return IDOLConfig;
}