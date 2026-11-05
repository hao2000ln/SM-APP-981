var Sections = lib.GatewayAPI_PortalFormConfigXML.Sections;
var Section  = lib.GatewayAPI_PortalFormConfigXML.Section;
var Artifact = lib.GatewayAPI_PortalFormConfigXML.Artifact;
var TextField = lib.GatewayAPI_PortalFormConfigXML.TextField;
var log = lib.ScAPI_Logger.log("PortalFormConfigWizard");

function getConfs(module){
	var svcSrcConfig = new SCFile("gwPortalFormConfig");
	var configs = new Array();
	var namearr = new Array();
	var screentypearr = new Array();
	var companyarr = new Array();
	
	var screenTypeDisplay = {
		'support catalog': 'Support Catalog',
		'service catalog': 'Service Catalog',
		'self-service':    'General Support',
		'cm3r': 'Change Approval',
		'request': 'Request Fulfillment Approval'
	};
	
	var i = 0;
	var query ;
	if (module != null) {
        query = "module=\"" + module + "\"";
	} else {
	    query = '1=1';
	}
	if(svcSrcConfig.doSelect(query) == RC_SUCCESS){
		do{
			 namearr[i]=svcSrcConfig.name;
			 screentypearr[i]=svcSrcConfig.screen_type;
			 screentypearr[i]=
			 		screenTypeDisplay[svcSrcConfig.screen_type] ? 
			 			screenTypeDisplay[svcSrcConfig.screen_type] : 
			 			svcSrcConfig.screen_type;
			 companyarr[i]=svcSrcConfig.company;
			 i++;
		}while(svcSrcConfig.getNext() == RC_SUCCESS)
	}
	configs[0]=namearr;
	configs[1]=screentypearr;
	configs[2]=companyarr;
	return configs;
}

function getConfByName(name){
	var svcSrcConfig = new SCFile("gwPortalFormConfig");
	if(svcSrcConfig.doSelect("name=\""+name+"\"") == RC_SUCCESS){
		return svcSrcConfig;
	}
}

function insertLabel(label, syslanguage){
	var scmessage = new SCFile ("scmessage");
	var sql = "class=\"sprfconfig\" and syslanguage=\""+syslanguage+"\"";
	var labelid=0;
	if ( scmessage.doSelect(sql)==RC_SUCCESS){
		do{
			if(parseInt(scmessage.message_id) >labelid){
				labelid=parseInt(scmessage.message_id) ;
			}
		}while(scmessage.getNext() == RC_SUCCESS)
	}	
	scmessage["class"] = "sprfconfig";
	scmessage.message = label;
	scmessage.message_id = (labelid+1).toString() ;
	scmessage.syslanguage = syslanguage;
	var result = scmessage.doInsert();
	if ( result == RC_SUCCESS)
   		return scmessage.message_id;
   	else {
   		print(RCtoString(result));
   	}
  	return false;
}

function insertSrcConfig(name, screentype, company, options, enableupload, module, test){
	var svcSrcConfig = new SCFile("gwPortalFormConfig");
	if (svcSrcConfig.doSelect("name=\""+name+"\"")==RC_SUCCESS){
		print(system.functions.scmsg(128, 'wizard'));
		return false;
	}else if(svcSrcConfig.doSelect("screen.type=\""+screentype+"\" and company =\""+company+"\"")==RC_SUCCESS){
		print(system.functions.scmsg(129, 'wizard'));
		return false;
	}
	if (test)
		return true;
	svcSrcConfig.name=name;
	svcSrcConfig["screen.type"] =screentype;
	svcSrcConfig.company=company;
	svcSrcConfig.options= options ? options : "<sections/>";
	svcSrcConfig["enable.upload"]= enableupload;
	svcSrcConfig["module"]= module;
	if ( svcSrcConfig.doInsert() == RC_SUCCESS)
   		return true;
  	return false;
}
function updateSrcConfig(name, screentype, company){
	var svcSrcConfig = new SCFile("gwPortalFormConfig");
	if(svcSrcConfig.doSelect("name=\""+name+"\"") == RC_SUCCESS) {
		svcSrcConfig.name = name;
		svcSrcConfig.screentype = screentype;
		svcSrcConfig.company = company;
		return svcSrcConfig.doUpdate() == RC_SUCCESS;
  	} else {
  		return false;
  	}
}

/**
 * Module field is newly added. Try to assign default value to module field in src config
 */
function normalizeModuleInSrcConfig(){
    var svcSrcConfig = new SCFile("gwPortalFormConfig");
    if(svcSrcConfig.doSelect("null(module)") == RC_SUCCESS) {
        do{
          svcSrcConfig.module = "incidents"; // assign default value
          svcSrcConfig.doUpdate();
        }while(svcSrcConfig.getNext() == RC_SUCCESS)
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

function createTextfield(sectionXML, field,fieldType, labelId, isMandatory, modifiability, lookupField, lookupTable, hasdefaultValue, defaultValue, useExpression){
  	var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
  	var section = parser.parseXmlString(sectionXML);
  	var textField = new TextField();
	textField.setMultiline("false");
	textField.setFieldType(fieldType);
	if(lookupTable!=null){
		textField.setLookUpTable(lookupTable);
		textField.setLookUpField(lookupField);
	}
	textField = setFieldValues(textField, field, labelId, isMandatory,modifiability,hasdefaultValue,defaultValue, useExpression);
	section.getFields().add(textField);
	return (parser.parseArtifact(section)).toXMLString();
}

function setFieldValues(field, fieldName, labelId, isMandatory,modifiability,hasdefaultvalue,defaultValue, useExpression){
	field.setLabelId(labelId);
	field.setField(fieldName);
	field.setMandatory(isMandatory);
	field.setModifiability(modifiability);
	field.setModifiability(modifiability);	
	if(hasdefaultvalue==true){
		field.setDefaultValue(defaultValue);
		field.setUseExpression(useExpression);
	}
	return field;
}

function getSectionIDs(optionsString){
	var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
	var options = parser.parseXmlString(optionsString);
	var size = options.getSections().size();
	var ids = new Array();
	for(var i =0; i <size; i++){
		ids[i] = options.getSections().getAt(i).getLabelId();
	}
	return ids;
}

function getLabels(labelIds, language){
	var labels = new Array();
	for(var i = 0; i < labelIds.length(); i++){
		var scmessage = new SCFile ("scmessage");
		var sql = "message.id=\""+labelIds[i]+"\" and syslanguage =\""+language+"\" and class=\"sprfconfig\"";
		if(scmessage.doSelect(sql)==RC_SUCCESS){
			labels[i]=scmessage.message;
		}else{
			labels[i]="no "+language+" label defined.";
		}
	}
	return labels;
}

/**
*  Get Fields for specified file name
* @param {String} file name
* @returns {array} field list
*/
function getFields(filename) {
    var fields = lib.GetFieldNames.getFieldData(filename);
    if (filename == "incidents") {
        var result = new Array();
        var len = fields.length();                                                    
        for (var m = 0; m < len; m++) {
            var f = fields[m];
            if (f != 'svc.cost') {
                result.push(f);
            }
        }
        return result;
    }
    return fields;
}

function getInteractionFields(){
	var dbdict = new SCFile("dbdict");
	var fields = new Datum();
	fields.setType(8);
	var exclude = [
		'svc.cost'
	];
	exclude.indexOf = function (o) {
		for (var i=0; i<this.length; ++i)
			if (this[i] == o)
				return i;
		return -1;
	}
	var includeArray = ["description","resolution","agreement.ids"];
	includeArray.indexOf = function (o) {
		for (var i=0; i<this.length; ++i)
			if (this[i] == o)
				return i;
		return -1;
	}
	if(dbdict.doSelect("name=\"incidents\"")==RC_SUCCESS){
		for (var i=0;i<dbdict.field.length();++i)
		{
			if(
					(dbdict.field[i].type != "9" && 
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
		for (var i=0;i<dbdict.field.length();++i)
		{
			if (field == dbdict.field[i].name){
				var type;
				if(dbdict.field[i].type == "1"){
					type = "number"
				}else if (dbdict.field[i].type == "2" || dbdict.field[i].name == "description"|| dbdict.field[i].name == "resolution"){
					type =  "character"
				}else if (dbdict.field[i].type == "3"){
					type =  "datetime"
				}else if (dbdict.field[i].type == "4"){
					type =  "logical"
				}else if (dbdict.field[i].type == "8"){
					type =  "array"
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
		var fieldType = fieldArgs[2];
		var labelId = fieldArgs[3];
		var isMandatory = fieldArgs[4];
		var modifiability = fieldArgs[5];
		var lookupTable = fieldArgs[7];
		var lookupField = fieldArgs[6];
		var hasdefaultValue = fieldArgs[8];
		var defaultValue = fieldArgs[9];
		var useExpression = fieldArgs[10];
		
		return createTextfield(sectionXML, field,fieldType, labelId, isMandatory, modifiability, lookupTable, lookupField,  hasdefaultValue, defaultValue, useExpression);
	}
}
function updateSection(optionXML,sectionXML){
	var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
	var sections = parser.parseXmlString(optionXML);
	var section = parser.parseXmlString(sectionXML);
	var sectionID = section.getLabelId();
	var size = sections.getSections().size();
	var existed = false;
	for(var i = 0; i <size; i++){
		if( sections.getSections().getAt(i).getLabelId()==sectionID){
			sections.getSections().replaceAt(section,i);			
			existed = true;
			break;
		}
	}
	if(existed = false){
		sections.getSections().add(section);
	}
	return (parser.parseArtifact(sections)).toXMLString();
}

function getSectionXML(optionXML, sectionID){
	var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
	var sections = parser.parseXmlString(optionXML);
	var size = sections.getSections().size();
	var ids = new Array();
	for(var i =0; i <size; i++){
		if( sections.getSections().getAt(i).getLabelId()==sectionID){
			return parser.parseArtifact( sections.getSections().getAt(i)).toXMLString();
		}
	}
	return "";
}

function getCustomFields(sectionXML){
    var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
    var section = parser.parseXmlString(sectionXML);
    var size = section.getFields().size();
    var ids = new Array();
    var fieldTypes = new Array();
    var fieldNames = new Array();
    var fieldCaptions = new Array();
    var max =new Array();
    for(var i =0; i <size; i++){
        ids.push(section.getFields().getAt(i).getLabelId());
        var name =  section.getFields().getAt(i).getField();
        fieldNames.push(name);  
        fieldCaptions.push( system.functions.get_field_caption(name ,"incidents"));
    }
    max.push(ids);
    max.push(fieldNames);
    max.push(fieldCaptions);
    return max;
}

/**
* Get Fields Name and caption
*/
function getCurrentFields(filename) {
	var situation = new lib.GatewayAPI_PortalFormConfigWizardJobs.Situation();
	var section = situation.getCurrentSection();
	var ids = [], fieldNames = [], fieldTypes = [], fieldCaptions = [];
	var max = [];
	if (filename == null) {
	    filename = "incidents";
	}
	for (var i=0; i<section.getFields().size(); ++i) {
		ids.push(section.getFields().getAt(i).getLabelId());
		var name =  section.getFields().getAt(i).getField();
		fieldNames.push(name);	
		fieldCaptions.push( system.functions.get_field_caption(name ,filename));
	}
	max.push(ids);
	max.push(fieldNames);
	max.push(fieldCaptions);
	return max;
}

function saveOptionXML(name, optionXML){	
	var svcSrcConfig = new SCFile("gwPortalFormConfig");
	if(svcSrcConfig.doSelect("name=\""+name+"\"") == RC_SUCCESS){
		svcSrcConfig.options=optionXML;
		var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
		var sections = parser.parseXmlString(optionXML);
		var size = sections.getSections().size();
		svcSrcConfig.fields=new Array();
		for(var i =0; i <size; i++){
			var sizeS = sections.getSections().getAt(i).getFields().size();
			for(var k =0; k <sizeS; k++){
				svcSrcConfig.fields.push(sections.getSections().getAt(i).getFields().getAt(k).getField());
			}
		}
		return svcSrcConfig.doUpdate() == RC_SUCCESS;
	}
	return false;
}

function checkHasField(sectionXML, field){
	if(sectionXML!=null ||sectionXML!=""){
		var parser = new lib.GatewayAPI_PortalFormConfigXML.XmlParser();
		var section = parser.parseXmlString(sectionXML);
		var size = section.getFields().size();
		for(var i =0; i <size; i++){
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
	//print("datasize"+this.dataSize);
}
TableSelection.prototype = {
	fixSelectedIndex: function () {
		system.functions.cursor_field_name_set(this.tableName, this.dataSize ? 1 : 0);
	},
	
	getSelectedIndex: function () {
		return this.dataSize ? system.functions.cursor_line(1) : 0;
	},
	
	setSelectedIndex: function (index) {
		if (!this.dataSize)
			index = 0;
		else if (index < 1)
			index = 1;
		else if (index > this.dataSize)
			index = this.dataSize;
		system.functions.cursor_field_name_set(this.tableName, index);
	}
}

function LabelManager (language) {
	this.language = language;
	this.labelList = null;
}
LabelManager.prototype = {
	getLabels: function () {
		if (!this.labelList) {
			var file = new SCFile('scmessage');
			var query = 'syslanguage="' + this.language + '" and class="sprfconfig"';
			this.labelList = [];
			if (RC_SUCCESS == file.doSelect(query)) {
				for (var r=file.getFirst(); RC_SUCCESS == r; r=file.getNext()) {
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
		if (labelId === false)
			labelId = insertLabel(label, this.language);
		if (labelId !== false)
			this.labelList.push({
				id: labelId,
				text: label
			});
			
		return labelId;
	},
	
	labelExists: function (label) {
		this.getLabels();
		for (var i=0; i<this.labelList.length; ++i)
			if (this.labelList[i].text == label)
				return this.labelList[i].id;
		return false;
	},
	
	getLabelById: function (id) {
		this.getLabels();
		for (var i=0; i<this.labelList.length; ++i)
			if (this.labelList[i].id == id)
				return this.labelList[i].text;
		return 'label not found';
	}
}
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
	for (var i=0; i<names.length; ++i) {
		vars['$' + names[i]] = null
	}		
}

function getGLName(fieldname, module) {
    var globalListMap = {
        // common global list setting
        'DEFAULT': {
            'severity':'Urgency'
        },
        // global list for change approval details 
        'cm3r':{
            'completion.code':'Change Closure Codes',
            'folder':'Folders',
            'approval.status':'Change Approval Status',
            'category':'cm3rcategory',
            'current.phase':'Change Local WorkflowPhases',
            'priority.code':'Calculated Priority',
            'reason':'Change Reasons',
            'risk.assessment':'Impact',
            'status':'Change Status',
            'subcategory':'cm3rsubcategory',
            'initial.impact':'Initial Impact'
        },
        // global list for request fulfillment details
        'request': {
            'approval.status':'Change Approval Status',
            'category':'Request Local Categories',
            'closure.code':'Request Closure Codes',
            'current.phase':'Request Local WorkflowPhases',
            'folder':'Folders',
            'impact':'Initial Impact',
            'modelname':'Request Local Models',
            'priority':'Calculated Priority',
             'reason':'Request Reason Codes',
            'status':'Request Local Statuses',
            'subcategory':'Request Local Subcategories'
        },
        // global list for interaction 
        'incidents':{
            'severity': 'Urgency',
            'initial.impact': 'Initial Impact',
            'priority.code': 'Calculated Priority',
            'open': 'Interaction Local Statuses',
            'current.phase': 'Service Desk Local WorkflowPhases',
            'category': 'Interaction Local Categories',
            'resolution.code': 'Interaction Local Completion Codes',
            'subcategory':'Interaction Local Subcategories',
            'product.type':'Interaction Local Areas',
            'source': 'Source',
            'callback.type': 'Callback Type'
        }
    };
		
	var glName = globalListMap[module][fieldname];
	if (glName == null) {
	  glName=globalListMap["DEFAULT"][fieldname];
	}
	return glName;
}
