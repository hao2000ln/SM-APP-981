var Sections = lib.SrcConfigXML.Sections;
var Section  = lib.SrcConfigXML.Section;
var Artifact = lib.SrcConfigXML.Artifact;
var TextField = lib.SrcConfigXML.TextField;
//var log = getLog("SRCConfigWizard");

function getConfs(){
	var svcSrcConfig = new SCFile("svcSrcConfig");
	var configs = [];
	var namearr = [];
	var screentypearr = [];
	var companyarr = [];
	
	var screenTypeDisplay = {
		'support catalog': 'Support Catalog',
		'service catalog': 'Service Catalog',
		'self-service':    'General Support'
	};
	
	var i = 0;
	if(svcSrcConfig.doSelect("1=1") == RC_SUCCESS){
		do{
			 namearr[i]=svcSrcConfig.name;
			 screentypearr[i]=
			 		screenTypeDisplay[svcSrcConfig.screen_type] ? 
			 			screenTypeDisplay[svcSrcConfig.screen_type] : 
			 			svcSrcConfig.screen_type;
			 companyarr[i]=svcSrcConfig.company;
			 i++;
		}while(svcSrcConfig.getNext() == RC_SUCCESS);
	}
	configs[0]=namearr;
	configs[1]=screentypearr;
	configs[2]=companyarr;
	return configs;
}

function getConfByName(name){
	var svcSrcConfig = new SCFile("svcSrcConfig");
	if(svcSrcConfig.doSelect("name=\""+name+"\"") == RC_SUCCESS){
		return svcSrcConfig;
	}
}

function insertLabel(label, syslanguage){
	var scmessage = new SCFile ("scmessage");
	var sql = "class=\"srcconfig\" and syslanguage=\""+syslanguage+"\"";
	var labelid=0;
	if ( scmessage.doSelect(sql)==RC_SUCCESS){
		do{
			if(parseInt(scmessage.message_id) >labelid){
				labelid=parseInt(scmessage.message_id) ;
			}
		}while(scmessage.getNext() == RC_SUCCESS);
	}	
	scmessage["class"] = "srcconfig";
	scmessage.message = label;
	scmessage.message_id = (labelid+1).toString() ;
	scmessage.syslanguage = syslanguage;
	var result = scmessage.doInsert();
	if ( result == RC_SUCCESS) {
   		return scmessage.message_id;
   	}
   	else {
   		print(RCtoString(result));
   	}
  	return false;
}

function insertSrcConfig(name, screentype, company, options, enableupload, test){
	var svcSrcConfig = new SCFile("svcSrcConfig");
	if (svcSrcConfig.doSelect("name=\""+name+"\"")==RC_SUCCESS){
		print(funcs.scmsg(128, 'wizard'));
		return false;
	}else if(svcSrcConfig.doSelect("screen.type=\""+screentype+"\" and company =\""+company+"\"")==RC_SUCCESS){
		print(funcs.scmsg(129, 'wizard'));
		return false;
	}
	if (test) {
		return true;
	}
	svcSrcConfig.name=name;
	svcSrcConfig["screen.type"] =screentype;
	svcSrcConfig.company=company;
	svcSrcConfig.options= options ? options : "<sections/>";
	svcSrcConfig["enable.upload"]= enableupload;
	
	if ( svcSrcConfig.doInsert() == RC_SUCCESS) {
   		return true;
    }
  	return false;
}
function updateSrcConfig(name, screentype, company){
	var svcSrcConfig = new SCFile("svcSrcConfig");
	if(svcSrcConfig.doSelect("name=\""+name+"\"") == RC_SUCCESS) {
		svcSrcConfig.name = name;
		svcSrcConfig.screentype = screentype;
		svcSrcConfig.company = company;
		return svcSrcConfig.doUpdate() == RC_SUCCESS;
  	} else {
  		return false;
  	}
}

function getSections(name){
   var sections = {};
   return sections;
}


function createSection(optionsString, id){
	var xmlObject = new XML();
	var sectionString = "<section></section>";
	xmlObject.setContent(sectionString);
	var parent = xmlObject.getParentNode();
  	var section = parent.getFirstChildElement();
  	section.addAttribute("labelId", id);
  	
  	xmlObject= new XML();
  	xmlObject.setContent(optionsString);
  	lib.xmlHelpers.addChildElement(xmlObject, section);
  	return xmlObject.toXMLString();
}

function createTextfield(sectionXML, field,fieldType, labelId, isMandatory, modifiability, lookupField, lookupTable, hasdefaultValue, defaultValue, useExpression,query){
  	var parser = new lib.SrcConfigXML.XmlParser();
  	var section = parser.parseXmlString(sectionXML);
  	var textField = new TextField();
	textField.setMultiline("false");
	textField.setFieldType(fieldType);
	if(lookupTable!=null){
		textField.setLookUpTable(lookupTable);
		textField.setLookUpField(lookupField);
	}
	textField = setFieldValues(textField, field, labelId, isMandatory,modifiability,hasdefaultValue,defaultValue, useExpression,query);
	section.getFields().add(textField);
	return (parser.parseArtifact(section)).toXMLString();
}

function setFieldValues(field, fieldName, labelId, isMandatory,modifiability,hasdefaultvalue,defaultValue, useExpression,query){
	field.setLabelId(labelId);
	field.setField(fieldName);
	field.setMandatory(isMandatory);
	field.setModifiability(modifiability);
	field.setModifiability(modifiability);	
	field.setQuery(query);  
	if(hasdefaultvalue==true){
		field.setDefaultValue(defaultValue);
		field.setUseExpression(useExpression);
	}
	return field;
}

function getSectionIDs(optionsString){
	var parser = new lib.SrcConfigXML.XmlParser();
	var options = parser.parseXmlString(optionsString);
	var size = options.getSections().size();
	var ids = [];
	var i;
	for(i =0; i <size; i++){
		ids[i] = options.getSections().getAt(i).getLabelId();
	}
	return ids;
}

function getLabels(labelIds, language){
	var labels = [];
	var i;
	var length = labelIds.length();
	for(i = 0; i < length; i++){
		var scmessage = new SCFile ("scmessage", SCFILE_READONLY);
		var sql = "message.id=\""+labelIds[i]+"\" and syslanguage =\""+language+"\" and class=\"srcconfig\"";
		if(scmessage.doSelect(sql)==RC_SUCCESS){
			labels[i]=scmessage.message;
		}else{
			labels[i]="no "+language+" label defined.";
		}
	}
	return labels;
}

function getInteractionFields(){
	var dbdict = new SCFile("dbdict");
	var fields = new Datum();
	fields.setType(8);
	var exclude = [
		'cartId', 'variable1', 'other', 
		'variable2', 'variable3',
		'bRequestOnBehalf',
		'open',
		'opened.by',
		'svc.cost',
		'svc.options',
		'cust.visible',
		'updated.by.uid',
		'opened.by.uid'
	];
	var includeArray = ["description"];
	
	if(dbdict.doSelect("name=\"incidents\"")==RC_SUCCESS){
	    var i;
	    var length = dbdict.field.length();
		for (i=0;i<length;++i)
		{
			if (   (dbdict.field[i].type != "9" && 
					dbdict.field[i].type !="8" 	&& 
					dbdict.field[i].type != "11" && 
					dbdict.field[i].level=="1" &&
					exclude.indexOf(dbdict.field[i].name) == -1)
					||
					(dbdict.field[i].level=="1" && dbdict.field[i].type =="8" && includeArray.indexOf(dbdict.field[i].name) >=0 )
				) {
				fields.push(dbdict.field[i].name);
			}
		}
		
	}
	return fields;
}

function getFieldType(field){
	var dbdict = new SCFile("dbdict");
	if(dbdict.doSelect("name=\"incidents\"")==RC_SUCCESS){
	    var i;
	    var length = dbdict.field.length();
		for (i=0;i<length;++i)
		{
			if (field == dbdict.field[i].name){
				var type;
				if(dbdict.field[i].type == "1"){
					type = "number";
				}else if (dbdict.field[i].type == "2" || dbdict.field[i].name == "description"){
					type =  "character";
				}else if (dbdict.field[i].type == "3"){
					type =  "datetime";
				}else if (dbdict.field[i].type == "4"){
					type =  "logical";
				}
				return (type);
			}
		}
	}
}

function createfield(fieldType, fieldArgs){
	
	if(fieldType=="text"){	    
		var sectionXML = fieldArgs[0];
		var field = fieldArgs[1];
		fieldType = fieldArgs[2];
		var labelId = fieldArgs[3];
		var isMandatory = fieldArgs[4];
		var modifiability = fieldArgs[5];
		var lookupTable = fieldArgs[7];
		var lookupField = fieldArgs[6];
		var hasdefaultValue = fieldArgs[8];
		var defaultValue = fieldArgs[9];
		var useExpression = fieldArgs[10];
		var query=fieldArgs[11];
		
		return createTextfield(sectionXML, field,fieldType, labelId, isMandatory, modifiability, lookupTable, lookupField,  hasdefaultValue, defaultValue, useExpression,query);
	}
}

function updateSection(optionXML,sectionXML){
	var parser = new lib.SrcConfigXML.XmlParser();
	var sections = parser.parseXmlString(optionXML);
	var section = parser.parseXmlString(sectionXML);
	var sectionID = section.getLabelId();
	var size = sections.getSections().size();
	var existed = false;
	var i;
	for(i = 0; i <size; i++){
		if( sections.getSections().getAt(i).getLabelId()==sectionID){
			sections.getSections().replaceAt(section,i);			
			existed = true;
			break;
		}
	}
	if(existed == false){
		sections.getSections().add(section);
	}
	return (parser.parseArtifact(sections)).toXMLString();
}

function getSectionXML(optionXML, sectionID){
	var parser = new lib.SrcConfigXML.XmlParser();
	var sections = parser.parseXmlString(optionXML);
	var size = sections.getSections().size();
	var ids = [];
	var i;
	for(i =0; i <size; i++){
		if( sections.getSections().getAt(i).getLabelId()==sectionID){
			return parser.parseArtifact( sections.getSections().getAt(i)).toXMLString();
		}
	}
	return "";
}

function getCustomFields(sectionXML){
	var parser = new lib.SrcConfigXML.XmlParser();
	var section = parser.parseXmlString(sectionXML);
	var size = section.getFields().size();
	var ids = [];
	var fieldTypes = [];
	var fieldNames = [];
	var fieldCaptions = [];
	var max = [];
	var i;
	for(i =0; i <size; i++){
		ids.push(section.getFields().getAt(i).getLabelId());
		var name =  section.getFields().getAt(i).getField();
		fieldNames.push(name);	
		fieldCaptions.push( funcs.get_field_caption(name ,"incidents"));
	}
	max.push(ids);
	max.push(fieldNames);
	max.push(fieldCaptions);
	return max;
}

function getCurrentFields() {
	var situation = new lib.SRCConfigWizardJobs.Situation();
	var section = situation.getCurrentSection();
	var ids = [];
	var fieldNames = [];
	var fieldTypes = [];
	var fieldCaptions = [];
	var max = [];
	var i;
	var length = section.getFields().size();
	for (i=0; i<length; ++i) {
		ids.push(section.getFields().getAt(i).getLabelId());
		var name =  section.getFields().getAt(i).getField();
		fieldNames.push(name);	
		fieldCaptions.push( funcs.get_field_caption(name ,"incidents"));
	}
	max.push(ids);
	max.push(fieldNames);
	max.push(fieldCaptions);
	return max;
}

function saveOptionXML(name, optionXML){	
	var svcSrcConfig = new SCFile("svcSrcConfig");
	if(svcSrcConfig.doSelect("name=\""+name+"\"") == RC_SUCCESS){
		svcSrcConfig.options=optionXML;
		var parser = new lib.SrcConfigXML.XmlParser();
		var sections = parser.parseXmlString(optionXML);
		var size = sections.getSections().size();
		svcSrcConfig.fields = [];
		var i;
		for(i =0; i <size; i++){
			var sizeS = sections.getSections().getAt(i).getFields().size();
			var k;
			for(k =0; k <sizeS; k++){
				svcSrcConfig.fields.push(sections.getSections().getAt(i).getFields().getAt(k).getField());
			}
		}
		return svcSrcConfig.doUpdate() == RC_SUCCESS;
	}
	return false;
}

function checkHasField(sectionXML, field){
	if(sectionXML!=null ||sectionXML!=""){
		var parser = new lib.SrcConfigXML.XmlParser();
		var section = parser.parseXmlString(sectionXML);
		var size = section.getFields().size();
		var i;
		for(i =0; i <size; i++){
			if( section.getFields().getAt(i).getField()==field){
				return 1;
			}
		}
	}
	return 0;	
}

function TableSelection(fieldName) {
	this.tableName = fieldName;
	this.dataSize = vars[fieldName].length();
}
TableSelection.prototype = {
	fixSelectedIndex: function () {
		funcs.cursor_field_name_set(this.tableName, this.dataSize ? 1 : 0);
	},
	
	getSelectedIndex: function () {
		return this.dataSize ? funcs.cursor_line(1) : 0;
	},
	
	setSelectedIndex: function (index) {
		if (!this.dataSize) {
			index = 0;
		}
		else if (index < 1) {
			index = 1;
		}
		else if (index > this.dataSize) {
			index = this.dataSize;
	    }
		funcs.cursor_field_name_set(this.tableName, index);
	}
};

function LabelManager (language) {
	this.language = language;
	this.labelList = null;
}
LabelManager.prototype = {
	getLabels: function () {
		if (!this.labelList) {
			var file = new SCFile('scmessage', SCFILE_READONLY);
			var query = 'syslanguage="' + this.language + '" and class="srcconfig"';
			this.labelList = [];
			if (RC_SUCCESS == file.doSelect(query)) {
				var r;
				for (r=file.getFirst(); RC_SUCCESS == r; r=file.getNext()) {
					this.labelList.push({
						id: file.message_id,
						text: file.message
					});
				}
			}
		}
		return this.labelList;
	},
	
	insertOrFindLabel: function (label) {
		var labelId = this.labelExists(label);
		if (labelId === false) {
			labelId = insertLabel(label, this.language);
		}
		if (labelId !== false) {
			this.labelList.push({
				id: labelId,
				text: label
			});
		}
			
		return labelId;
	},
	
	labelExists: function (label) {
		this.getLabels();
		var i;
		for (i=0; i<this.labelList.length; ++i) {
			if (this.labelList[i].text == label) {
				return this.labelList[i].id;
			}
		}
		return false;
	},
	
	getLabelById: function (id) {
		this.getLabels();
		var i;
		for (i=0; i<this.labelList.length; ++i) {
			if (this.labelList[i].id == id) {
				return this.labelList[i].text;
			}
		}
		return 'label not found';
	}
};
LabelManager.prototype.findOrInsertLabel = LabelManager.prototype.insertOrFindLabel;


function clearFieldVars() {
	var names = [
		'labelmode', 'labelid', 'labelvalue', 'newlabelvalue', 
		'slabelmode', 'slabelid', 'slabelvalue', 'newslabelvalue', 
		'field', 'modifiability', 'display.type', 'defaultvalue',
		'hasdefaultvalue', 'mandatory', 'lookuptable', 'lookupfield',
		'pick.list.type', 'option.type', 'globallist', 'pick.list',
		'pick.list.value', 'hasmandatory','hasvisible','visible'
	];
	var i;
	for (i=0; i<names.length; ++i) {
		vars['$' + names[i]] = null;
	}		
}

