//use Underscore.js
var _ = lib.Underscore.require();
var nodeNameStyle = '<span class="nodeName">';
var nodeValueStyle = '<span class="nodeValue">';
var attrNameStyle = '<span class="attrName">';
var attrValueStyle = '<span class="attrValue">';
var styleRight = '</span>';
var IDOLURLParser = lib.IDOLURLParser.require();
/**
*	Retrieve idolToolsTemplate by name
*
*	@param {name} - name of the idolToolsTempalte
*	Returun - a record in idolToolsTemplate
*	Type - SCFile
**/
function getTemplateByName(name) {
	var template = new SCFile('idolToolsTemplate', SCFILE_READONLY);
	var result = template.doSelect('name="' + name + '"');
	if (result === RC_SUCCESS) {
		return template;
	}
}



function getAllTemplate() {
	var template = new SCFile('idolToolsTemplate', SCFILE_READONLY);
	var result = template.doSelect('true');
	if (result === RC_SUCCESS) {
		return template;
	}
}


function hostArrayToUrl(arrHost, arrPort, idolUrl, isServicePort, result){
	for (var i = 0, j = arrHost.length; i < j; i++) {
		result.push(toUrl(arrHost[i], arrPort[i], idolUrl, isServicePort));
	}
}

function toUrl(host, port, idolUrl, isServicePort) {
	if (!isServicePort) {
		var idolServerEP = IDOLURLParser.parse(idolUrl);
		return idolServerEP.protocol + '://' + host + ':' + port + '/';
	}
	
	return 'http://' + host + ':' + port + '/';
}


/**
*	Check the command in idol tools is valid or not
*
*	@param {command} - the command input by user in idol tools
*	Returun - a validation failed message if the command is invalid
*	Type - String
**/
function checkCommand(command) {
//	if (!lib.IDOL_Utilities.hasAdminRight()) {
//		msg = system.functions.scmsg("113", "idol");
//		return msg;
//	}
	var msg = null;
	if (!command || _.trim(command) === '') {
		msg = system.functions.scmsg("43", "idol");
		return msg;
	}
	
	var idolServerConfig = vars['$L.idolServerInfo'];
	if (!idolServerConfig) {
		idolServerConfig = lib.IDOL_Utilities.getIDOLServerConfig();
	}

	var idolServer = idolServerConfig['server.url'];
	var imgServer = idolServerConfig['image.url'];
	var gsServer = vars['$gs.proxy'];
	var cfsServer = idolServerConfig['default.cfs.url'];
	//only specified action are allowed in SAA
	//if (command.indexOf(idolServer) < 0 && command.indexOf(imgServer) < 0 && command.indexOf(gsServer)) {
	var allowedUrlList = [idolServer, imgServer, gsServer, cfsServer];
		
	hostArrayToUrl(vars['$main.host'].toArray(), vars['$main.port'].toArray(), idolServerConfig['server.url'], false, allowedUrlList);
	hostArrayToUrl(vars['$sa.host'].toArray(), vars['$sa.port'].toArray(), idolServerConfig['server.url'], false, allowedUrlList);
	hostArrayToUrl(vars['$gsp.host'].toArray(), vars['$gsp.port'].toArray(), idolServerConfig['server.url'], false, allowedUrlList);
	hostArrayToUrl(vars['$gs.host'].toArray(), vars['$gs.port'].toArray(), idolServerConfig['server.url'], false, allowedUrlList);
	hostArrayToUrl(vars['$is.host'].toArray(), vars['$is.port'].toArray(), idolServerConfig['server.url'], false, allowedUrlList);
	hostArrayToUrl(vars['$cfs.host'].toArray(), vars['$cfs.port'].toArray(), idolServerConfig['server.url'], true, allowedUrlList);
	allowedUrlList = allowedUrlList.concat(vars['$connector.url'].toArray());

	var allowed = false;
	for (var i = 0; i < allowedUrlList.length; i++) {
		if (command.indexOf(allowedUrlList[i]) >= 0) {
			allowed = true;
		}
	}
		
	if (!allowed) {
		var availAction = allowedAction();
		var isAvailAction = false;
		for (var i = 0; i < availAction.length; i++) {
			if (command.toUpperCase().indexOf(availAction[i].toUpperCase()) >= 0) {
				isAvailAction = true;
			}
		}
		if (isAvailAction) {
			portList = [];
			if (vars['$main.index.port']) portList.push(funcs.str(vars['$main.index.port']));
			if (vars['$gsp.index.port']) portList.push(funcs.str(vars['$gsp.index.port']));
			portList = portList.concat(vars['$sa.index.port'].toArray()).concat(vars['$gs.index.port'].toArray());
			for (var i = 0; i < portList.length; i++) {
				if (command.indexOf(portList[i]) >= 0) {
					allowed = true;
				}
			}
		}
	}
	if (!allowed) {
		msg = system.functions.scmsg("64", "idol");
	}

	return msg;
}


function allowedAction() {
	return ['DREEXPORTIDX', 'DREADD'];
}


/**
*	Encode the parameter in the command
*
*	@param {command} - the command input by user in idol tools
*	Returun - encoded command
*	Type - String
**/
function encodeCommand(command) {
	var paramPos = command.indexOf('?');
	if (paramPos < 0) {
		paramPos = command.indexOf('action');
	}
	
	if (paramPos < 0){
		return command;
	}
	
	var baseURL = command.substring(0, paramPos + 1);
	var paramURL = command.substring(paramPos + 1);
	
	//print(paramURL);
	
	var paramList = paramURL.split('&');
	var paramNames = [];
	var paramValues = [];
	//print(paramList);
	
	for(var i = 0; i < paramList.length; i++) {
		var equalPos = paramList[i].indexOf('=');
		if (equalPos < 0 ) {
			paramNames.push(paramList[i]);
			paramValues.push('');
		} else {
			paramNames.push(paramList[i].substring(0, equalPos));
			paramValues.push(paramList[i].substring(equalPos + 1));
		}
	}
	//print(paramNames);
	//print(paramValues);
	
	for (var i = 0; i < paramNames.length; i++) {
		if (i > 0) {
			baseURL += '&';
		}
		baseURL += encodeURIComponent(paramNames[i]);
		if (paramValues[i] != '') {
			//print(paramValues[i]);
			baseURL += '=' + encodeURIComponent(paramValues[i]);
		}
	}
	
	return baseURL;
}

/**
*	Run the command to idol
*
*	@param {command} - the command input by user in idol tools
*	@param {isPost} - is a post method or not
*	Returun - the result from idol
*	Type - String
**/
function runCommand(command) {
	//command = encodeCommand(command);
	//print(command);
	try {
		var response = lib.jsaci.runIDOLAction(command, false);
		system.functions.rtecall('log', vars['$L.rc'], system.functions.operator() + ' run SAA with command: ' + command);
		system.functions.rtecall('log', vars['$L.rc'], 'SAA response: ' + response);
		return response;
	} catch (e) {
		funcs.msg(funcs.scmsg('102', 'idol', [command, e]), 3);
  		return '';
	}
}


/**
*	Change an xml to readable format
*
*	@param {xmlString} - xml string
*	Returun - formatted xml string
*	Type - String
**/
function formatXML(xmlString) {
	if (xmlString.indexOf('<') != 0) {
		return xmlString;
	}
	var xml = new XML;
	xml.setContent(xmlString);

	var result = scanXML(xml);
	var style = '<style>' + lib.IDOL_Tools_Style.style() + '</style>';

	return style + result;
}

/**
*	Format the xml to an readable format in html
*
*	@param {node} - xml node
*	Returun - formatted xml string
*	Type - String
**/
function scanXML(node, result, level) {
	if (result == null) result = '';
	if (level == null) level = 0;
	var indent = '';
	for (var i = 0; i < level; i++){
		indent += lib.IDOL_Tools_Style.indent();
	}
	
	do {
		var nodeName = _.escapeHTML(node.getQualifiedName());
		var attributes = {};
		var firstAttribute = node.getFirstAttribute();
		if (firstAttribute != null) {
			attributes[firstAttribute.getQualifiedName()] = firstAttribute.getNodeValue();
			var nextAttribute = node.getNextAttribute();
			while (nextAttribute != null) {
				attributes[nextAttribute.getQualifiedName()] = nextAttribute.getNodeValue();
				nextAttribute = node.getNextAttribute();
			}
		}
		
		var attributeStr = '';
		for (var obj in attributes) {
			attributeStr += ' ' + attrNameStyle + _.escapeHTML(obj) + '="' + styleRight + attrValueStyle + _.escapeHTML(attributes[obj]) + styleRight + attrNameStyle + '"' + styleRight;
		}
	
		var nodeValue = _.escapeHTML(node.getValue());
		
		if (result.length > 0) {
			result += '<br/>';
		}
		var childNode = node.getFirstChildElement();
		if (childNode) {
			result += indent + nodeNameStyle + '&lt;' + nodeName + styleRight + attributeStr + nodeNameStyle + '&gt;' + styleRight + nodeValueStyle + nodeValue + styleRight;
		} else {
			if (nodeValue && _.trim(nodeValue) != '') {
				result += indent + nodeNameStyle + '&lt;' + nodeName + styleRight + attributeStr + nodeNameStyle + '&gt;' + styleRight + nodeValueStyle + nodeValue + styleRight;
			} else {
				result += indent + nodeNameStyle + '&lt;' + nodeName + styleRight + attributeStr + nodeNameStyle + '/&gt;' + styleRight;
			}
		}
		
		if (childNode) {
			result = scanXML(childNode, result, level+1);
		}
		
		if (childNode) {
			result += '<br/>' + indent + nodeNameStyle + '&lt;/' + nodeName + '&gt;' + styleRight;
		} 
		
		if (nodeValue && _.trim(nodeValue) != '') {
			result += nodeNameStyle + '&lt;/' + nodeName + '&gt;' + styleRight;
		}
	} while(node = node.getNextSiblingElement());
	
	return result;
}

function getStatus(host, port, idolUrl) {
	var idolServerEP = IDOLURLParser.parse(idolUrl);
	var url = idolServerEP.protocol + '://' + host + ':' + port + '/';
	return getStatusByUrl(url);
	
}

function getStatusByUrl(url) {
	var param = 'action=getstatus';
	try {
		var response = lib.jsaci.runIDOLAction(url + param, false);
		var xml = formatXML(response);
		return xml;
	} catch (e) {
		funcs.msg(funcs.scmsg('102', 'idol', [url + param, e]), 3);
  		return '';
	}
}
function getContentCount(){
  if(!lib.IDOLConfigure.require().isInContainer() && !vars['$L.isInContainer']) {
    system.functions.rtecall('msg','','This function shall only work in container environment.',2);
    return -1;
  }
  var tmp = lib.IDOL_Tools_Tree.getGSContent();
  return tmp['gsContent'].length;
}
/*
  accept the response as :
  {result: success/fail, rc:<address>/1/2/3
  success : 0
  fail: 1  failed to write content config
        2  failed to generate the content service config (yaml)
		3. failed to start content service.
		4. failed to write dih/dah cfg
		5. failed to stop dih/dah
*/
function addContentService(type) {
  var IDOLConfigureObj = lib.IDOLConfigure.require();
  var _scmsg = system.functions.scmsg;
  var add_content_service_url = IDOLConfigureObj.getInstallerMsvcEndPoint();
  if(!add_content_service_url) {
    return;
  }
  add_content_service_url = add_content_service_url ;
  var param = 'smartanalytics/scale?feature=[ss]&component=content'.replace('[ss]', type);
  //doHTTPRequest('GET', listCommitsUrl+'?page=' + (++page), new Array(),10,10,10);
  var headers = new Array();
  var response = '';
  try{
    response = doHTTPRequest('GET',add_content_service_url+param, headers, 10,10,10);
    //print('response = ' + response);
    response = lib.JSON.json().parse(response);
  } catch ( e ) {
    system.functions.rtecall('msg','',_scmsg('add.content.fail.connect.installer.service','idolfarm',[response]) );
    return ;
  }
  
  //
  var rc = parseInt(response['result']);
  if(rc == 0) {
    system.functions.rtecall('msg', '', _scmsg('add.content.success','idolfarm'));
  } else { 
    switch (parseInt(rc)) {
      case 1: 
        system.functions.rtecall('msg','',_scmsg('add.content.fail.write.content.config','idolfarm'), 3);
        break;
      case 2: 
        system.functions.rtecall('msg','',_scmsg('add.content.fail.gen.content.config','idolfarm'), 3);
        break;
      case 3: 
        system.functions.rtecall('msg','',_scmsg('add.content.fail.start.content.service','idolfarm'), 3);
        break;
      case 4: 
        system.functions.rtecall('msg','',_scmsg('add.content.fail.update.proxy.config','idolfarm'), 3);
        break;
      case 5: 
        system.functions.rtecall('msg','',_scmsg('add.content.fail.shut.proxy','idolfarm'), 3);
        break;
      case 7: 
        system.functions.rtecall('msg','',_scmsg('add.content.not.complete','idolfarm'), 2);
        break;
    }    
   
  }
  
  
}
function addContent(dihUrl,dahUrl,host,port){
	addContentDIH(dihUrl,host,port);
	addContentDAH(dahUrl,host,port);
	return 0;
	
}
function addContentDAH(url, host, port) {
	var param = 'action=EngineManagement&EngineAction=EngineAdd&EngineHost=' + host + '&EnginePort=' + port;
	try {
		var response = lib.jsaci.runIDOLAction(url + param, false);
		var xml = new XML();
		xml.setContent(response);
		var xQuery = lib.XQuery.require();
		var errorNode = xQuery.query('responsedata/error', xml);
		if (errorNode != null && errorNode.length > 0) {
			return response;
		}
	} catch (e) {
		funcs.msg(funcs.scmsg('102', 'idol', [url + param, e]), 3);
	}
	return 0;
}

function addContentDIH(url, host, port) {
	var param = 'action=EngineManagement&EngineAction=Add&Host=' + host + '&Port=' + port + '&weight=1';
	try {
		var response = lib.jsaci.runIDOLAction(url + param, false);
		var xml = new XML();
		xml.setContent(response);
		var xQuery = lib.XQuery.require();
		var errorNode = xQuery.query('responsedata/error', xml);
		if (errorNode != null && errorNode.length > 0) {
			return response;
		}
	} catch (e) {
		funcs.msg(funcs.scmsg('102', 'idol', [url + param, e]), 3);
	}
	return 0;
}

function redistribute(dihUrl) {
  if(!lib.IDOLConfigure.require().isInContainer()) {
    return redistributePP(dihUrl)
  } else {
    return redistributeInContainer();
  }
}

function sendDistributeRequest(url) {
  var param = 'DREREDISTRIBUTE';
	try {
		var response = lib.jsaci.runIDOLAction(url + param, false);
		funcs.msg(funcs.scmsg('110', 'idol'), 1);
	} catch (e) {
		funcs.msg(funcs.scmsg('102', 'idol', [url + param, e]), 3);
	}
	return 0;	
}
function redistributePP(dihUrl){
	var dihIndexport = lib.IDOL_Tools_Tree.getIndexPort(dihUrl);
	var dih = lib.IDOLURLParser.require().parse(dihUrl);
	var dihHost = dih.host, 
		protocol = dih.protocol;
	var url = protocol + "://" + dihHost + ":" + dihIndexport + "/";
	return sendDistributeRequest(url);	 
}

function redistributeInContainer(){
  var IDOLConfigureObj = lib.IDOLConfigure.require();
  var dih_service_url = IDOLConfigureObj.getIndexMsvcEndPoint();
  if(!dih_service_url) {
    return;
  }
  return sendDistributeRequest(dih_service_url)
}