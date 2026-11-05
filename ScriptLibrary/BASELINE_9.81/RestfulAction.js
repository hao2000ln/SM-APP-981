var restRC = lib.RestfulConstant.getReturnCode();
var restm = lib.RestfulMain;
var _parseJson = lib.JSON3.parse;

/**
* process post/put/delete action for rest API
* @param {object} options - Options input by user
* @param {array} uri - uri input by user. [filename, id1 ...]
* @param {string} object - json string of an object
* @param {file} config - extaccess record related to the rest service

* @return {object} - error message if failed. json object if succeed.
**/
function processAction(options, uri, object, config){
	try{
		var method = options.method;
		var action = null;
		var keyLength = config.rest_keys.length();
		if (uri.length >= keyLength+3 && 'action'==uri[1+keyLength]){ // + incidents/<keys>/+action+actionname
			action = uri[2+keyLength];
		}
		
		var resource = uri[0];
		if (method != "DELETE"){
			var obj = _parseJson(object); //to do need to change the name val
			
			var resourceName = config['rest.resource.name'];
			for (var attributeName in obj){
				if (attributeName!=resourceName && attributeName!=="ResourceName"){
					return restm.makeErrorMsg(restRC['badval'], system.functions.scmsg('34', 'restful', [resourceName, attributeName]));
				}
			}
			
			var fileObj = obj[config['rest.resource.name']];
		} else {
			var obj = null;
			var fileObj = null;
		}
		
		//if action is not set in url, retrieve default action defined
		if (action == null){
			if (uri.length == 1 && method == 'POST'){
				action = config['rest.list.post'];
			} else if (uri.length==1+keyLength){
				action = config['rest.resource.' + method.toLowerCase()];
			}
		}
		
		//if no action, return error
		if (action == null || action == ''){
			//no default action for method
			return restm.makeErrorMsg(restRC['invalid.action'], system.functions.scmsg('6', 'restful', [resource, method]));
		}
		
		//if action is not correct
		
		var actioNames = config['action.names'];
		
		var actionIndex = -1;
		
		for (var n =0;n<actioNames.length();n++) {
			if (null!=actioNames[n] && actioNames[n].toLowerCase() == action.toLowerCase()){
				action = actioNames[n];
				actionIndex = n;
				break;
			}
		}
		
		if (actionIndex < 0){
			//Action is not defined
			return restm.makeErrorMsg(restRC['invalid.action'], system.functions.scmsg('7', 'restful', [action]));
		}
		
		var file = new SCFile(config['name']);
		
		var actionType = (method != "PATCH") ? config['action.type'][actionIndex] : "update"; // PATCH only support update
		if(null==actionType){ // create, update, merge, passthru
			actionType = "merge";
		}
		
		var dbdict = restm.getdbdict(config.name);
		
		//if action type is not create only, retrieve from database by key
		if (actionType != 'create' && !(action=="search" && resource=="SmartAnalytics")){
			if (uri.length > 1){ //key from url
				var keyValues = uri.slice(1);
				var fromURI = true;
			} else { //key from json
				var keyValues = getKeyValueFromJsonObj(fileObj, config);
				var fromURI = false;
			}
			
			var queryFields = lib.RestfulQuery.resolveQueryFields("false", keyValues, config, dbdict);
		
			if (fromURI && queryFields[0].length > 0){					
				return restm.makeErrorMsg(restRC['badval'], system.functions.scmsg('8', 'restful', [queryFields[0].toString()]));
			}
			
			var query = queryFields[1];
			log.debug("processAction::query::", query);
			var count = file.doCount(query);
			
			if (count > 1){
				return restm.makeErrorMsg(restRC['badval'], system.functions.scmsg('26', 'scxmlapi'));
			}
			
			if (count == 0 && actionType == 'update'){
				//if update only, return no records found
				return restm.makeErrorMsg(restRC['no.record'], system.functions.scmsg('330', 'scjsdesc'));
			}
			
			
			file.doSelect(query);
			
		}
		
		var msgs = [];
		//no need to set $L.file.save
		if (method != "DELETE") {
			try{
				if (fileObj){
					file = restm.fromJsonObj(fileObj, config, dbdict, file, msgs);
				}
			}catch(e){			
				return restm.makeErrorMsg(restRC['badval'], e);
			}
		}	
	
		vars['$restful.results'] = null;
		
		var ret = actionEngine(file, action, config['object.name']);
		
		var fieldList = config.soafield;
		var captionList = config.soacaption;
		var soaTypeList = config.soatype;
		
		
		if (vars['$restful.results']) {
			var _ = lib.Underscore.require(),
		    		JSON = lib.JSON.json();
		      
			var strResults = vars['$restful.results'];
			var results = JSON.parse(strResults);
			var records = _.map(results, function(data) {
				var f = new SCFile(funcs.filename(file));
				_.each(data, function(v, k) {
					f[k] = v;
			  	});
				return f;			
		   });

         	var results = _.map(records, function(r) {
           		return restm.file2Object(r, fieldList, captionList, soaTypeList, config['rest.resource.name']);
         	});
          		
         	var start = vars['$start'];  
		 	vars['$start'] = null;		  		       
         	return restm.toJson(results, ret, true, config['rest.resource.name'], start, ret.message);
		}
		
		else {
			var file = restm.file2Object(ret.file, fieldList, captionList, soaTypeList, config['rest.resource.name']);	
		
			if (ret.message==null || ret.message.length==0) {
				ret.message = getUserMessages();
			}
		
			if (ret.message==null) {
				ret.message = msgs;
			} else {
				ret.message = ret.message.concat(msgs);
			}
		
			return restm.toJson(file, ret, false, config['rest.resource.name'], null, ret.message);		
		}
		
	}catch(ex){
		
		return restm.makeErrorMsg(restRC['error'], ex);
	}finally {
		vars['$start'] = null;
	}
	
}


/**
* Call RAD se.external.action for rest API if action is put/post/delete
* @param {SCFile} file - selected file merged with user input
* @param {string} actionName - action name defined in extaccess
* @param {string} objectName - object name defined in extaccess
*
* @return {return code, message}
**/
function actionEngine(file, actionName, objectName){
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var argTypes = new SCDatum();
	var results = new SCDatum();
			
	argNames.setType(8); 
	argVals.setType(8);      
	argTypes.setType(8);
	results.setType(8);

	argNames.push("file");  //file
	argVals.push(file);
	argTypes.push(6);

	argNames.push("prompt"); //action name
	argVals.push(actionName);
	argTypes.push(2);
	
	argNames.push("name"); //object name
	argVals.push(objectName);
	argTypes.push(2);
	
	argNames.push("index");
	argVals.push(null);
	argTypes.push(1);
			
	argNames.push("description");
	argVals.push(null);
	argTypes.push(2);

	results.push("index");  //return code
	results.push("description");  //message
	results.push("file");

	var radResults = lib.RAD.run("se.external.action", argNames, argVals, argTypes, results);
	
	var msgList = [];
	if (null!=radResults.results[1]){
		msgList =radResults.results[1].toArray();
	}
	
	return {'returnCode': system.functions.val(radResults.results[0], 1),
			 'message': msgList,
			 'file': system.functions.val(radResults.results[2], 6)}
}


/**
* Get values of unique key defined in extaccess rest api from json object evaluated.
* @param {object} jsonObj - json object evaluated from json string
* @param {SCFile} config - extaccess record
*
* @return {array} - value array
**/
function getKeyValueFromJsonObj(jsonObj, config){
	if (!jsonObj){
	    return [];
	}	
	
	var result = [];
	var keys = config['rest.keys'];
	var keyCaptions = restm.getCaptions(keys, config['soafield'], config['soacaption']);

	var len = keyCaptions.length;
	for (var i = 0; i < len; i++){		
		result.push(jsonObj[keyCaptions[i]]);
	}
	
	var nullkey = true;
	for (var i = 0; i < len; i++){		
		if (null!=result[i]){
			nullkey = false;
		}
	}
	if (nullkey) {
	   return [];
	}
	return result;
}

var log = getLog("rest.action");