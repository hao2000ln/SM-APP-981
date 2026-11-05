var xQuery = lib.XQuery.require(),
    IDOLURLParser = lib.IDOLURLParser.require(),
    protocol = getProtocol();


function getProxyService(url) {
	var result = [];
	var statusParam = 'action=getstatus';
	var response = '';
	try {
		response = lib.jsaci.runIDOLAction(url + statusParam, '');
		var statusInfos = getInfoFromStatusResponse(response, url);
		for (var i = 0; i < statusInfos.length; i++) {
			result.push({name: statusInfos[i].name, host: statusInfos[i].host, port: statusInfos[i].port, status: statusInfos[i].status})
		}
	} catch (e) {
		throw funcs.scmsg('102', 'idol', [url + statusParam, e]);
	}
	return result;
}

function getContentService(url) {
	var result = [];
	var param = 'action=EngineManagement&EngineAction=ShowStatus';
	var response = '';
	try {
		response = lib.jsaci.runIDOLAction(url + param, '');
	} catch (e) {
		throw funcs.scmsg('102', 'idol', [url + param, e]);
	}
	var statusInfos = getInfoFromResponse(response, url);
	for ( var i = 0; i < statusInfos.length; i++) {
		result.push({name: statusInfos[i].name, host: statusInfos[i].host, port: statusInfos[i].port, status: statusInfos[i].status, id: statusInfos[i].id});
	}
	return result;
}

function getIDOLTree(idolUrl) {
	var mainProxy = [], gsProxy = [], saContent = [], gsContent = [], gsProxyUrl = '';
	try {
		//call action=getStatus to retrieve all service under main proxy
		mainProxy = getProxyService(idolUrl);
	} catch (ex) {
		funcs.msg(ex, 3);
		return {mainProxy: mainProxy, gsProxy: gsProxy, saContent: saContent, gsContent: gsContent, gsProxyUrl: gsProxyUrl};
	}
	
	var l1Content = [];
	try {
		//call action=EngineManagement&EngineAction=ShowStatus to retrieve all sub content or L2 proxy under main proxy
		l1Content = getContentService(idolUrl);
	} catch (ex) {
		funcs.msg(ex, 3);
	}
	
	var idolConfig = lib.IDOLConfigure.require();
	
	var idolServerEP = IDOLURLParser.parse(idolUrl);
	for (var i = 0; i < l1Content.length; i++) {
		var id = l1Content[i].id;
		var host = l1Content[i].host;
		var port = l1Content[i].port;
		var name = l1Content[i].name;
		var status = l1Content[i].status;
		if (status === 'online') {
			// engine 0 is for global search
			if (id === '0' && !idolConfig.isInContainer()) {
				gsProxyUrl = idolServerEP.protocol + '://'  + host + ':' + port + '/';
				try {
					gsProxy = getProxyService(gsProxyUrl);
				} catch (ex) {
					funcs.msg(ex, 3);
				}
				try {
					gsContent = getContentService(gsProxyUrl);
				} catch (ex) {
					funcs.msg(ex, 3);
				}
			} else {
				saContent.push(l1Content[i]);
			}
		}
	}
	
	//var ret = {mainProxy: mainProxy, gsProxy: gsProxy, saContent: saContent, gsContent: gsContent, gsProxyUrl: gsProxyUrl};	
	
	if(idolConfig.isInContainer()){
		var temp = getGSContent();
		gsProxy = temp['gsProxy'];
		gsContent = temp['gsContent'];
		gsProxyUrl = '';
	}
	
	return {mainProxy: mainProxy, gsProxy: gsProxy, saContent: saContent, gsContent: gsContent, gsProxyUrl: gsProxyUrl};
}


function getImageTree(imageUrl) {
	var param = 'action=EngineManagement&EngineAction=ShowStatus';
	var isProxies = []; //Smart Analytics proxies
	var result = {};
	var response = lib.jsaci.sendRequestToIDOL(imageUrl + param, '');
	var idolInfos = getInfoFromResponse(response, imageUrl);
	for (var j = 0; j < idolInfos.length; j++) {
		var host = idolInfos[j].host;
		var port = idolInfos[j].port;
		var name = idolInfos[j].name;
		var status = idolInfos[j].status;
		isProxies.push({name: name, host: host, port: port, status: status});
	}
	
	return isProxies;
	
}


function getInfoFromResponse(response, idolUrl){
	var result = [];
	if (!response) {
	   return result;
	}
	var xml = new XML();
	xml.setContent(response);
	var engineNodes = xQuery.query('responsedata/engines/engine', xml);
	if (engineNodes) {
		for (var i = 0, j = engineNodes.length; i < j; i++) {
			var engineNode = engineNodes[i];
			var host = engineNode.getAttributeValue('host');
			if (host === 'localhost' || host === '127.0.0.1') {
				host = lib.IDOL_Utilities.getIDOLHost(idolUrl);
			}
			var port = engineNode.getAttributeValue('aciport');
			var name = engineNode.getAttributeValue('name');
			var status = engineNode.getAttributeValue('status');
			var id = engineNode.getAttributeValue('id');
			result.push({name: name, host: host, port: port, status: status, id: id});
		}
	}
	return result;
}


function getInfoFromStatusResponse(response, idolUrl) {
	var result = [];
	var host = lib.IDOL_Utilities.getIDOLHost(idolUrl);
	
	var xml = new XML();
	try {
		xml.setContent(response);
	} catch (ex) {
		throw response;
	}
	var componentNode = xQuery.query('responsedata/component', xml);
	var subNode = componentNode[0].getFirstChildElement();
	while (subNode) {
		var name = subNode.getNodeName();
		var status  = xQuery.queryText('status', subNode);
		var port  = xQuery.queryText('aciport', subNode);
		result.push({name: name, host: host, port: port, status: status});
		subNode = subNode.getNextSiblingElement();
	}
	return result;
}


function getGSContent()
{
	var idolConfig = lib.IDOLConfigure.require();
	
	var indexMSVCEndPoint = idolConfig.getIndexMsvcCommonPoint();
	var searchMSVCEndPoint = idolConfig.getSearchMsvcEndPoint();
	
	var gsContent = [];
	try{
	  gsContent = getContentService(searchMSVCEndPoint);
	} catch (e) {
	  funcs.msg(e);
	}
	
	
	var gsProxy = []
	var comp = getMSVCEndPointStatus(indexMSVCEndPoint);
	comp['name'] = comp['name'] || 'dih';
	gsProxy.push(comp);
	comp = getMSVCEndPointStatus(searchMSVCEndPoint);
	comp['name'] = comp['name'] || 'dah';
	gsProxy.push(comp);
	
	return {'gsContent': gsContent, 'gsProxy': gsProxy}
}


function getMSVCEndPointStatus( msvcUrl )
{
	var result = [];
	var statusParam = 'action=getstatus';
	var response = '';
	
	var idolServerEP = IDOLURLParser.parse(msvcUrl);
	
	var name = '';
	var status = 'NO-RUNNING'
	
	try {
	
		response = lib.jsaci.runIDOLAction(msvcUrl + statusParam, false);
		var xml = new XML();
		xml.setContent(response);
		
		var name = xQuery.queryText('responsedata/product', xml);
		var status = xQuery.queryText('response', xml);
		
		if(status === 'SUCCESS'){
			status = 'RUNNING'
		}

		return {"name":name.toLowerCase(),"host":idolServerEP.host,"port":idolServerEP.port,"status":status};
	} catch (e) {
		return {"name":name.toLowerCase(),"host":idolServerEP.host,"port":idolServerEP.port,"status":status};
	}
}

function showIDOLTreeInUI() {
	vars['$main.proxy'] = '', vars['$gs.proxy'] = '';
	vars['$main.name'] = [], vars['$main.host'] = [], vars['$main.port'] = [], vars['$main.status'] = [];
	vars['$sa.name'] = [], vars['$sa.host'] = [], vars['$sa.port'] = [], vars['$sa.status'] = [];
	vars['$gsp.name'] = [], vars['$gsp.host'] = [], vars['$gsp.port'] = [], vars['$gsp.status'] = [];
	vars['$gs.name'] = [], vars['$gs.host'] = [], vars['$gs.port'] = [], vars['$gs.status'] = [];
	vars['$main.index.port'], vars['$main.category.port'], vars['$gsp.index.port'], vars['$sa.index.port'] = [], vars['$gs.index.port'] = [];
	vars['$main.dih.url'], vars['$gs.dih.url'];
	vars['$main.dah.url'], vars['$gs.dah.url'];
	
	var idolConfigObj = lib.IDOLConfigure.require();
	var idolConfig = idolConfigObj.getConfig();
	var idolUrl = idolConfig['server.url'];
	var idolServerEP = IDOLURLParser.parse(idolUrl);
	vars['$main.proxy'] = idolUrl;
	var idolStatus = lib.jsaci.checkCurrentServerStatus(idolUrl, true);
	if (idolStatus == true) {
		var result = getIDOLTree(idolUrl);		
		//main proxy
		var mainProxy = result['mainProxy'];
		for (var i = 0; i < mainProxy.length; i++) {
			vars['$main.name'].push(mainProxy[i].name);
			vars['$main.host'].push(mainProxy[i].host);
			vars['$main.port'].push(mainProxy[i].port);
			if (mainProxy[i].status !== 'online' && mainProxy[i].status !== 'RUNNING') {
	    		vars['$main.status'].push(funcs.scmsg('77', 'idol')); // offline
	    	} else {
	    		vars['$main.status'].push(funcs.scmsg('76', 'idol')); // online
	    	}
	    	
	    	if (mainProxy[i].name === 'dih') {
	    		vars['$main.dih.url'] = idolServerEP.protocol + '://' + mainProxy[i].host + ':' + mainProxy[i].port + '/';
	    	}
		}
		vars['$main.index.port'] = getIndexPort(idolUrl);
		vars['$main.category.port'] = getCategoryPort(idolUrl);
		
		//Smart Ticket & Hot Topic content
		var saContent = result['saContent'];
		for (var i = 0; i < saContent.length; i++) {
			vars['$sa.name'].push(saContent[i].name);
			vars['$sa.host'].push(saContent[i].host);
			vars['$sa.port'].push(saContent[i].port);
			if (saContent[i].status !== 'online' && saContent[i].status !== 'RUNNING') {
	    		vars['$sa.status'].push(funcs.scmsg('77', 'idol')); // offline
	    	} else {
	    		vars['$sa.status'].push(funcs.scmsg('76', 'idol')); // online
	    	}
	    	
	    	var indexPort = getIndexPort(idolServerEP.protocol + '://' + saContent[i].host + ':' + saContent[i].port + '/');
	    	vars['$sa.index.port'].push(indexPort);
		}
		
		//Global Search Proxy
		vars['$gs.proxy'] = result['gsProxyUrl'];
		vars['$has.gsproxy'] = true;
		var inContainer = idolConfigObj.isInContainer();
		if (vars['$gs.proxy'] !== '' || inContainer) {
		    try{
		      if(inContainer){
				vars['$gsp.index.port'] = IDOLURLParser.parse(idolConfigObj.getIndexMsvcEndPoint()).port;
			  }else{
				vars['$gsp.index.port'] = getIndexPort(result['gsProxyUrl']);
			  }
		    } catch (e) {
		      funcs.msg('not able to connect to dih');
		    }
			
			var gsProxy = result['gsProxy'];
			
			for (var i = 0; i < gsProxy.length; i++) {
				vars['$gsp.name'].push(gsProxy[i].name);
				vars['$gsp.host'].push(gsProxy[i].host);
				vars['$gsp.port'].push(gsProxy[i].port);
				if (gsProxy[i].status !== 'online' && gsProxy[i].status !== 'RUNNING') {
	    			vars['$gsp.status'].push(funcs.scmsg('77', 'idol')); // offline
	    		} else {
	    			vars['$gsp.status'].push(funcs.scmsg('76', 'idol')); // online
	    		}
	    		
	    		
	    		if (gsProxy[i].name === 'dih') {
	    		    vars['$gs.dih.url'] = idolServerEP.protocol + '://' + gsProxy[i].host + ':' + gsProxy[i].port + '/';
	    	    }
	    	    else if (gsProxy[i].name === 'dah') {
	    		    vars['$gs.dah.url'] = idolServerEP.protocol + '://' + gsProxy[i].host + ':' + gsProxy[i].port + '/';
	    	    }
			}
			//Global Search Content
			var gsContent = result['gsContent'];
			for (var i = 0; i < gsContent.length; i++) {
				vars['$gs.name'].push(gsContent[i].name);
				vars['$gs.host'].push(gsContent[i].host);
				vars['$gs.port'].push(gsContent[i].port);
				if (gsContent[i].status !== 'online' && gsContent[i].status !== 'RUNNING') {
	    			vars['$gs.status'].push(funcs.scmsg('77', 'idol')); // offline
	    		} else {
	    			vars['$gs.status'].push(funcs.scmsg('76', 'idol')); // online
	    		}
	    		var indexPort = getIndexPort(idolServerEP.protocol + '://' + gsContent[i].host + ':' + gsContent[i].port + '/');
	    		vars['$gs.index.port'].push(indexPort);
			}
		}
		
	} else if(idolConfigObj.isInContainer()) {
	  try{
        if(inContainer){
		  vars['$gsp.index.port'] = IDOLURLParser.parse(idolConfigObj.getIndexMsvcEndPoint()).port;
	    }
      } catch (e) {
        funcs.msg('not able to connect to dih');
      }
	  var temp = getGSContent();
	  vars['$has.gsproxy'] = true;
	  gsProxy = temp['gsProxy'];
	  gsContent = temp['gsContent'];
	  gsProxyUrl = '';
      for (var i = 0; i < gsProxy.length; i++) {
			vars['$gsp.name'].push(gsProxy[i].name);
			vars['$gsp.host'].push(gsProxy[i].host);
			vars['$gsp.port'].push(gsProxy[i].port);
			if (gsProxy[i].status !== 'online' && gsProxy[i].status !== 'RUNNING') {
    			vars['$gsp.status'].push(funcs.scmsg('77', 'idol')); // offline
    		} else {
    			vars['$gsp.status'].push(funcs.scmsg('76', 'idol')); // online
    		}
    		
    		
    		if (gsProxy[i].name === 'dih') {
    		    vars['$gs.dih.url'] = idolServerEP.protocol + '://' + gsProxy[i].host + ':' + gsProxy[i].port + '/';
    	    }
    	    else if (gsProxy[i].name === 'dah') {
    		    vars['$gs.dah.url'] = idolServerEP.protocol + '://' + gsProxy[i].host + ':' + gsProxy[i].port + '/';
    	    }
		}
	  //get global search contents
	  for (var i = 0; i < gsContent.length; i++) {
		vars['$gs.name'].push(gsContent[i].name);
		vars['$gs.host'].push(gsContent[i].host);
		vars['$gs.port'].push(gsContent[i].port);
		if (gsContent[i].status !== 'online' && gsContent[i].status !== 'RUNNING') {
	      vars['$gs.status'].push(funcs.scmsg('77', 'idol')); // offline
	    } else {
		  vars['$gs.status'].push(funcs.scmsg('76', 'idol')); // online
	    }
		  var indexPort = getIndexPort(idolServerEP.protocol + '://' + gsContent[i].host + ':' + gsContent[i].port + '/');
		  vars['$gs.index.port'].push(indexPort);
		}
	}

	
	//image server
	vars['$is.name'] = [], vars['$is.host'] = [], vars['$is.port'] = [], vars['$is.status'] = [];
	var imageUrl = idolConfig['image.url'];
	if(vars['$lo.idol.img.enabled'] && imageUrl) {
		vars['$isproxy'] = imageUrl;
		var statusResponse = lib.jsaci.sendRequestToIDOL(imageUrl + 'action=GetStatus', '');
		if (statusResponse && statusResponse.indexOf("<engines>") != -1) {
			var result = getImageTree(imageUrl);
			var isProxies = result;
			for (var i = 0; i < isProxies.length; i++) {
				vars['$is.name'].push(isProxies[i].name);
				vars['$is.host'].push(isProxies[i].host);
				vars['$is.port'].push(isProxies[i].port);
				if (isProxies[i].status !== 'online' && isProxies[i].status !== 'RUNNING') {
		    		vars['$is.status'].push(funcs.scmsg('77', 'idol')); // offline
		    	} else {
		    		vars['$is.status'].push(funcs.scmsg('76', 'idol')); // online
		    	}
			}
		}
	}
	
	//all cfs, connctor url
	vars['$cfs.port'] = [], vars['$cfs.host'] = [], vars['$connector.url'] = [];
	var idolMonitor = lib.IDOL_Monitor.require();
	var connector = idolConfig['other.urls'];
	for (var i = 0; i < connector.length(); i++) {
		var connectorUrl = connector[i][0];
		
		if (connectorUrl != null) {;
		vars['$connector.url'].push(connectorUrl);
		var cfsInfo = idolMonitor.retrieveCFS(connectorUrl);
			if (cfsInfo) {
				vars['$cfs.host'].push(cfsInfo[1]);
				vars['$cfs.port'].push(cfsInfo[2]);
			}
		}
		
	}
	
	var omniGroupServer = idolMonitor.retrieveOMNIGroupServer();
	if (omniGroupServer && omniGroupServer.length > 0) {
		vars['$cfs.host'].push(omniGroupServer[0]);
		vars['$cfs.port'].push(omniGroupServer[1]);
	}

}

function getGSIndexUrl(idolUrl){
	try {
		var l1Content = getContentService(idolUrl);
	} catch (ex) {
		return null;
	}
	
	var idolServerEP = IDOLURLParser.parse(idolUrl);
	
	var gsProxyUrl = null
	for (var i = 0; i < l1Content.length; i++) {
		var id = l1Content[i].id;
		var host = l1Content[i].host;
		var port = l1Content[i].port;
		var name = l1Content[i].name;
		var status = l1Content[i].status;
		if (status === 'online') {
			// engine 0 is for global search
			if (id === '0') {
				gsProxyUrl = idolServerEP.protocol + '://'  + host + ':' + port + '/';
				break;
			}
		}
	}
	
	if (gsProxyUrl) {
		var action = 'action=getstatus';
		try {
			var response = lib.jsaci.runIDOLAction(gsProxyUrl + action, '');
			var xml = new XML();
			xml.setContent(response);
			var indexPort = xQuery.queryText('responsedata/indexport', xml);
			return protocol+'://' + host + ':' + indexPort + '/';
		} catch (e) {
			return null;
		}
	}
}


function getGSACIUrl(idolUrl)
{
   	var gsProxy = getIDOLTree(idolUrl, true);
	if (!gsProxy) {
		return null;
	}
	var host = gsProxy.host;
	var port = gsProxy.port;
	if (!host || !port) {
		return null;
	}
	
	return protocol+'://' + host + ':' + port + '/';
}

function getProtocol()
{
  var endpoint = lib.IDOLConfigure.require().getEndPoint();
  var query = IDOLURLParser.parse(endpoint);
  return query.protocol;      
}


function getIndexPort(url)
{
	var strurl = url + 'action=getStatus';
	var result =  lib.jsaci.sendRequestToIDOL(strurl, "");
 	if (result == null)
	{
   		return '9001';
	}

	if(result != null)
	{
		var xml = new XML();
		xml.setContent(result);
		var port = xQuery.queryText('responsedata/indexport', xml);
		if (port) {
			return port;
		}
	}
	return '9001';
}


function getCategoryPort(url)
{
	for (var i = 0; i < vars['$sa.host'].length(); i++) {
		var tmpUrl = vars['$sa.host'][i] + ':' + vars['$sa.port'][i];
		if (url.indexOf(tmpUrl) > 0) {
			return [vars['$sa.host'][i], vars['$sa.port'][i]];
		}
	}
	
	for (var i = 0; i < vars['$gs.host'].length(); i++) {
		var tmpUrl = vars['$gs.host'][i] + ':' + vars['$gs.port'][i]
		if (url.indexOf(tmpUrl) > 0) {
			return [vars['$gs.host'][i], vars['$gs.port'][i]];
		}
	}

	var strurl = url + 'action=getStatus';

	var result =  lib.jsaci.sendRequestToIDOL(strurl, "");
 	if (result == null)
	{
   		return [null, '9020'];
	}

	if(result != null)
	{
		var xml = new XML();
		xml.setContent(result);
		var port = xQuery.queryText('responsedata/category/aciport', xml);
		if (port) {
			return [null, port];
		}
	}
	return [null, '9020'];
}