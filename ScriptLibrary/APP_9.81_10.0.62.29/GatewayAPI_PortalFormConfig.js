/** @fileoverview SRC config
*   @author Roger
*/
var select = lib.GatewayAPI_RAD._select;
var fun = system.functions;
var queryBuilder = lib.GatewayAPI_RAD._queryBuilder;

var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var msgCache={};
var log = lib.GatewayAPI_Logger.log("GatewayAPI_Config");


function getConfig()
{
	setExitType(NORMAL_EXIT);
	var company = vars['$L.file']['company.in'];
	var screenType = vars['$L.file']['screen.type.in'];
	var language = vars['$L.file']['language.in'];
	
	
	if (language == null){
		language = vars['$G.my.language'];
		vars['$L.file']['language.in'] = language;
	}
	
	var query = 'true';
	
	if (company != null) {
		query = query + ' and company="' + company + '"';
	}
	
	if (screenType != null){
		query = query + ' and screen.type="' + screenType + '"';
	}
	var fields = ['company','screen.type','enable.upload','options', 'module'];
	var srcConfig = select('gwPortalFormConfig', query,fields);
	if (srcConfig == null){
		setExitType(NO_RECORD_EXIT);
		return;
	}
	var i = 0;
	do {
		vars['$L.file']['config'][i]['company'] = srcConfig['company'];
		vars['$L.file']['config'][i]['formname'] = "interactionInfo";
		vars['$L.file']['config'][i]['entitytype'] = srcConfig['module'];
		vars['$L.file']['config'][i]['screen.type'] = srcConfig['screen.type'];
		var xml = new XML();
		xml.setContent(srcConfig['options']);
		localizeLabelId(xml.getFirstChildElement(), language);
		vars['$L.file']['config'][i]['options'] = xml.toXMLString();
		i++;
		var result = srcConfig.getNext();
	} while (result == RC_SUCCESS)
}


function localizeLabelId(node, language){
	while(node != null){
		var childNode = node.getFirstChildElement();
		if (childNode != null) {
			localizeLabelId(childNode, language);
		}
		
		var labelId = node.getAttributeValue("labelId");
		if (labelId != null && labelId != ""){
			var label = getLabelMessage(language, labelId);
			node.setAttributeValue("label", label);
		}

		var nextNode = node.getNextSiblingElement();
		if (nextNode != null) {
			localizeLabelId(nextNode, language);
		}
		
		return;
	}
}

function getLabelMessage(language, labelId){
	var cacheKey = language+"_"+labelId;
	if(msgCache[cacheKey] != undefined){
		return msgCache[cacheKey];
	}
	var query = 'class="sprfconfig" and syslanguage="' + language + '" and message.id="' + labelId + '"';
	var fields = ['message'];
	var message = select('scmessage', query,fields);
	if (message != null){
		var msgValue = message['message']
		msgCache[cacheKey] = msgValue;
		return msgValue;
	} else {
		var sysLanguage = vars['$lo.operator']['syslanguage'];
		if (sysLanguage == null) {
			sysLanguage = vars['$G.system.info']['syslanguage'];
		}
		if (sysLanguage == null) {
			sysLanguage = "en";
		}
		if (language != sysLanguage) {
			
			var cacheKey = sysLanguage+"_"+labelId;
	        if(msgCache[cacheKey] != undefined){
				return msgCache[cacheKey];
			}
			var query = 'class="sprfconfig" and syslanguage="' + sysLanguage + '" and message.id="' + labelId + '"';
			var message = select('scmessage', query,fields);
			if (message != null) {
			   var msgValue=message['message'];
			   msgCache[cacheKey] = msgValue;
			   return msgValue;
		    }
		}
		
		return lib.GatewayAPI_Util.getMessage(172, new Array('sprfconfig', labelId));
	}
}


function getAdvanceSearchConfig() {
	setExitType(NORMAL_EXIT);
	var fileName = vars['$L.file']['file.name'];
	var operator = getCurrentOperator();
	var company = operator['company'];
	var fields = ['field.name','field.type','field.label', 'field.label.type', 'validation.rule', 'globallist', 'match.table', 'match.field'];
	var orderBys = ['order'];
	var query = "company=\"" + company + "\" and file.name=\"" + fileName + "\"";
	var searchConfig = select("svcAdvanceSearchConfig", query, fields, orderBys, ['asc']);
		if (searchConfig == null){
		setExitType(NO_RECORD_EXIT);
		return;
	}
	var i = 0;
	do {
		var fieldName = searchConfig['field.name'];
		vars['$L.file']['search.fields'][i]['field.name'] = fieldName;
		vars['$L.file']['search.fields'][i]['field.type'] = searchConfig['field.type'];
		
		var rule = searchConfig['validation.rule'];
		var globalList = searchConfig['globallist'];
		var matchTable = searchConfig['match.table'];
		var matchField = searchConfig['match.field'];
		if ('globallist' == rule && globalList) {
			vars['$L.file']['search.fields'][i]['global.list'] = globalList;
		} else if ('recordintable' == rule && matchTable && matchField) {
			vars['$L.file']['search.fields'][i]['match.table'] = matchTable;
			vars['$L.file']['search.fields'][i]['match.field'] = matchField;
		}
		var fieldLabelType = searchConfig['field.label.type'];
		var fieldLabel;
		if ('isdefault' == fieldLabelType) {
			fieldLabel = system.functions.get_field_caption(fieldName, fileName);
		} else {
			var fieldLabelId = system.functions.val(searchConfig['field.label'], lib.DataTypeConst.typeNumber());
			fieldLabel = system.functions.scmsg(fieldLabelId, "srcadvsearch");
		}
		vars['$L.file']['search.fields'][i]['field.label'] = fieldLabel;
		i++;
		var result = searchConfig.getNext();
	} while (result == RC_SUCCESS)
	
}