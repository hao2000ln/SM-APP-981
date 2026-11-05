/******************************************************
* Module Name: SMIS InstanceConfiguration
* Function: The instance of the Configuration
* Author: Tian, ShaoQin
* Version: 1.10
* Creation Date: Dec 25, 2013
*******************************************************/

var Class = lib.smis_Prototype.getClass();

var InstanceBuilderClass = Class.create({
	
	instance: null,
	mapping: null,
	registry: null,
	action: null,
	
	initialize: function(action, intId) {
    	this.instance = new SCFile("SMISConfiguration");
    	this.mapping = new SCFile("SMISFieldMapping");
    	this.registry = new SCFile("SMISRegistry");

    	this.action = action;
    	if (this.action == "edit") {
    		this.instance.doSelect("intId=\"" + intId + "\"");
    		this.mapping.doSelect("intId=\"" + intId + "\"");
    		this.registry.doSelect("name=\"" + this.instance.template + "\"");
    		// sync custom param format
    		this.instance.custom_param_format = this.registry.custom_param_format;
    	} else {
    		this.instance.intId = generateInstanceId();
    		this.mapping.intId = this.instance.intId;
    	}
   	},
  	
  	buildFromTemplate: function(template, importMapping) {
    	var ret = this.registry.doSelect("name=\"" + template + "\"");
    	
    	copyGeneralFromTemplate(this.instance, this.registry);
    	
    	if (importMapping) {
    		copyMappingFromTemplate(this.mapping, this.registry, true);
    	}
    	return this;
  	},

  	buildFromTemplateById: function(templateId, importMapping) {

    	this.registry.doSelect("id=\"" + templateId + "\"");
    	
    	this._copyGeneralFromTemplate();
    	
    	if (importMapping) {
    		
    		copyMappingFromTemplate(this.mapping, this.registry, true);
    	}
    	
    	return this;
  	},
  	
  	buildGeneralInfo: function(detail) {
  	    var p;
    	for (p in detail) {
    		if (p == "description") {
    			lib.smis_CommonLib.convertStringToArray(detail[p], this.instance[p], 2048);
    		}
    		else {
    			this.instance[p] = detail[p];
    		}
    	}
    	return this;
  	},
  	
  	confGeneralInfo: function(conf) {
  		var generalfields = ['name','intervalTime','SMServer','loggerLevel','sharedScheduler','runOnStartup','maxRetryTime','EPServer','logFileDir','description','status'];
    	this.confFields(conf,generalfields);
    	return this;
  	},
  	
  	confParamInfo: function(conf){
  		var paramField = 'paramInfo';
  		var paramFields = ['paramCategory','paramDesc','paramName','paramValue','ispwd','paramType'];
  		var paramKey = 'paramName';
  		var paramValue = 'paramValue';
  		this.confParams(conf,paramField,paramFields,paramKey,paramValue);
  		
  		return this;
  	},
  	
  	confParams: function(conf,paramField,paramFields,paramKey,paramValue){
  		if(conf[paramField]){
  			var params = {};
  			//print(conf[paramField]);
  			
  			var i, j;
  			
  			for(i = 0; i < conf[paramField].length; i++){
  			//print(conf[paramField][i][paramKey]);
  				if(conf[paramField][i][paramKey]){
  					params[conf[paramField][i][paramKey]] = conf[paramField][i];
  				}
  			}
  			
  			var key;
//  			for(key in params){
//  				print('----Before assign: '+key);
//  			}
  			//print(this.instance[paramField].length());

            var lng = this.instance[paramField].length();
  			for(j = 0; j < lng; j++){
  				var param = this.instance[paramField][j][paramKey];
  				//print('----assign: ' + param);
  				if(params[param]){
  				    //print('old value----' + this.instance[paramField][j][paramValue]);
	  				//print('new value----' + params[param][paramValue]);
	  				if(typeof params[param][paramValue] != 'undefined'){
	  					this.instance[paramField][j][paramValue] = params[param][paramValue];
	  				}else{
	  					this.instance[paramField][j][paramValue] = null;
	  				}
  					delete(params[param]);
  				}
  			}
  			var index = this.instance[paramField].length();
  			for(key in params){
 				this.instance[paramField][index] = lib.c.$.createSCStructure();
				this.instance[paramField][index] = lib.c.$.createSCStructure(params[key]['paramCategory'], params[key]['paramDesc'],params[key][paramKey], params[key][paramValue], params[key]['ispwd'], params[key]['paramType'], params[key]['caption']);

  				index++;
  			}
  			
  			
  		}
  		return this;
  	},
  	
  	confFields:function(conf,fields){
  		var len = fields.length;
  		for(var i = 0; i < len; i++){
			if(typeof conf[fields[i]] != 'undefined'){
				this.instance[fields[i]] = conf[fields[i]];
			}
  		}
  		return this;
  	},
  	
  	
  	buildParameters: function(paramInfo) {
  		this.instance.paramInfo = [];
  		for (var i = 0; i < paramInfo.length; i++) {
  			this.instance.paramInfo[i].paramName = paramInfo[i][0];
  			this.instance.paramInfo[i].paramValue = paramInfo[i][1];
  			this.instance.paramInfo[i].paramType = paramInfo[i][2];
  			this.instance.paramInfo[i].paramCategory = paramInfo[i][3];
  			this.instance.paramInfo[i].paramDesc = paramInfo[i][4];
  			this.instance.paramInfo[i].ispwd = paramInfo[i][5];
  		}
  		return this;
  	},
  	
  	configParameters: function(paramInfo) {
  		this.instance.paramInfo = [];
  		for (var i = 0; i < paramInfo.length; i++) {
  			this.instance.paramInfo[i].paramName = paramInfo[i][0];
  			this.instance.paramInfo[i].paramValue = paramInfo[i][1];
  			this.instance.paramInfo[i].paramType = paramInfo[i][2];
  			this.instance.paramInfo[i].paramCategory = paramInfo[i][3];
  			this.instance.paramInfo[i].paramDesc = paramInfo[i][4];
  			this.instance.paramInfo[i].ispwd = paramInfo[i][5];
  		}
  		return this;
  	},
  	
  	buildSMFields: function(fields, module) {
  		this.instance.SMFields = [];
  		for (var i = 0; i < fields.length; i++) {
  			this.instance.SMFields[i].SMFieldName = fields[i][0];
  			this.instance.SMFields[i].SMFieldType = fields[i][1];
  			this.instance.SMFields[i].SMFieldDesc = fields[i][2];
  			if (fields[i].length >= 4) {
  			    this.instance.SMFields[i].SMAlias = fields[i][3];
  			} else {
  			    this.instance.SMFields[i].SMAlias = fields[i][0];
  			}
  			if (module != null) {
  			    this.instance.SMFields[i].SMModuleName = module;
  			} else if (fields[i].length == 5) {
  			    this.instance.SMFields[i].SMModuleName = fields[i][4];
  			}
  		}
  		return this;
  	},
  	
  	buildEPFields: function(fields) {
  		this.instance.EPFields = [];
  		for (var i = 0; i < fields.length; i++) {
  			this.instance.EPFields[i].EPFieldName = fields[i][0];
  			this.instance.EPFields[i].EPFieldType = fields[i][1];
  			this.instance.EPFields[i].EPFieldDesc = fields[i][2];
  			if (fields[i].length == 4) {
  				this.instance.EPFields[i].EPAlias = fields[i][3];
  			} else {
  				this.instance.EPFields[i].EPAlias = fields[i][0];
  			}
  		}
  		return this;
  	},
  	
  	buildValueMapping: function(valueMapping) {
  		this.mapping.valueMapping = [];
  		for (var i = 0; i < valueMapping.length; i++) {
  			this.mapping.valueMapping[i].SMValue = valueMapping[i][0];
  			this.mapping.valueMapping[i].EPValue = valueMapping[i][1];
  			this.mapping.valueMapping[i].valueMappingGroupID = valueMapping[i][2];
  			this.mapping.valueMapping[i].VMDescription = valueMapping[i][3];
  			this.mapping.valueMapping[i].condition = null;
  			if (valueMapping[i].length == 5) {
  				this.mapping.valueMapping[i].condition = valueMapping[i][4];
  			}
			if (this.mapping.valueMapping[i].condition == null) {
  				this.mapping.valueMapping[i].condition = "true";
  			}
  		}
  		return this;
  	},
  	
  	buildFieldMapping: function(fieldMapping, module) {
  		this.mapping.fieldMapping = [];
  		for (var i = 0; i < fieldMapping.length; i++) {
  			this.mapping.fieldMapping[i].SMField = fieldMapping[i][0];
  			this.mapping.fieldMapping[i].EPField = fieldMapping[i][1];
  			this.mapping.fieldMapping[i].direction = fieldMapping[i][2];
  			this.mapping.fieldMapping[i].SMDefValue = fieldMapping[i][3];
  			this.mapping.fieldMapping[i].SMjscallback = fieldMapping[i][4];
  			this.mapping.fieldMapping[i].EPDefValue = fieldMapping[i][5];
  			this.mapping.fieldMapping[i].EPjscallback = fieldMapping[i][6];
  			this.mapping.fieldMapping[i].valueMappingGroup = fieldMapping[i][7];
  			this.mapping.fieldMapping[i].FMDescription = fieldMapping[i][8];
  			if (module != null) {
  			    this.mapping.fieldMapping[i].SMModule = module;
  			} else if (this.mapping.fieldMapping[i].length == 10) {
  			    this.mapping.fieldMapping[i].SMModule = fieldMapping[i][9];
  			}
  			
  		}
  		return this;
  	},
  	
  	buildPreScript: function(script) {
  		this.mapping.preScript = script;
  		return this;
  	},

  	buildMappingScript: function(script) {
  		this.mapping.mappingScript = script;
  		return this;
  	},
  	
  	add: function() {
  		var result = true;
  		
  		var ret = this.instance.doInsert();
  		if (ret == RC_SUCCESS) {
  			print("smis instance created successful.");
  			this.mapping.intId = this.instance.intId;
  			var retFM = this.mapping.doInsert();
  			if (retFM == RC_SUCCESS) {
  				print("smis mapping created successful.");
  			} else {
  				result = false;
  				print("failed to create smis mapping: " + RCtoString(retFM));
  			}
  		} else {
  			result = false;
  			print("failed to create smis instance: " + RCtoString(ret));
  		}
  		
  		if (result) {
	  		return this.instance.intId;
	  	}
	  	else {
	  		return null;
	  	}
  	},
  	
  	update: function() {
  		this.instance.doAction("save");
  		this.mapping.doAction("save");
  	},
  	
  	remove: function() {
  		this.instance.doDelete();
  		this.mapping.doDelete();
  		print("instance removed.");
  	},
  	
  	updateGeneral: function(detail) {
  	    var p;
  		for (p in detail) {
    		if (p == "description") {
    			lib.smis_CommonLib.convertStringToArray(detail[p], this.instance[p], 2048);
    		}
    		else {
    			this.instance[p] = detail[p];
    		}
    	}
    	this.instance.doSave();
    	return this;
  	},
  	
  	reload: function() {
  		this.instance.doSelect("intId=\"" + this.instance.intId + "\"");
  		this.mapping.doSelect("intId=\"" + this.mapping.intId + "\"");
  		return this;
  	}
  
});

function getClass() {return InstanceBuilderClass;}

// utilities functions
function copyGeneralFromTemplate(instance, registry) {
	instance.name = registry.name;
	instance.version = registry.version;
	instance.ctrlName = registry.ctrlName;
	instance.mgrName = registry.mgrName;
	instance.SMAdapter = registry.SMAdapter;
	instance.EPAdapter = registry.EPAdapter;
	instance.supportRT = registry.supportRT;
	instance.description = registry.description;
	instance.template = registry.name;
	instance.category = registry.category;
	instance.status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
	instance.loggerLevel = "INFO";
	instance.custom_param_format = registry.custom_param_format;
	instance.sharedScheduler = registry.sharedScheduler;
	instance.module_type = registry.module_type;
	
	if (instance.category == "Schedule-based") {
		instance.intervalTime = 300;
		instance.maxRetryTime = 5;
	} else if (instance.category == "UI-based") {
		instance.sharedScheduler = null;
	}
	
	_copyParamFromTemplate(instance, registry);
	_copyFieldsFromTemplate(instance, registry);
}

function _copyParamFromTemplate(instance, registry) {
    var i;
	for (i in registry.paramInfo) {
		instance.paramInfo[i].paramName = registry.paramInfo[i].paramName;
		instance.paramInfo[i].paramValue = registry.paramInfo[i].paramValue;
		instance.paramInfo[i].paramDesc = registry.paramInfo[i].paramDesc;
		instance.paramInfo[i].paramCategory = registry.paramInfo[i].paramCategory;
		instance.paramInfo[i].ispwd = registry.paramInfo[i].ispwd;
		instance.paramInfo[i].paramType = registry.paramInfo[i].paramType;
		instance.paramInfo[i].caption = registry.paramInfo[i].caption;
		if (instance.paramInfo[i].paramType == null) {
			instance.paramInfo[i].paramType = "Character";
		}
	}
}

function _copyFieldsFromTemplate(instance, registry) {
	var smFields = registry.SMFields;
	var i, length = smFields.length();
	for(i = 0; i < length; i++) {
		instance.SMFields[i].SMFieldName = smFields[i].SMFieldName;
		instance.SMFields[i].SMFieldType = smFields[i].SMFieldType;
		instance.SMFields[i].SMFieldDesc = smFields[i].SMFieldDesc;
		instance.SMFields[i].SMAlias = smFields[i].SMAlias;
		instance.SMFields[i].SMModuleName = smFields[i].SMModuleName;
	}
	
	var epFields = registry.EPFields;
	length = epFields.length();
	for(i = 0; i < length; i++) {
		instance.EPFields[i].EPFieldName = epFields[i].EPFieldName;
		instance.EPFields[i].EPFieldType = epFields[i].EPFieldType;
		instance.EPFields[i].EPFieldDesc = epFields[i].EPFieldDesc;
		instance.EPFields[i].EPAlias = epFields[i].EPAlias;
		instance.EPFields[i].EPModuleName = epFields[i].EPModuleName;
	}
	
	instance["module.enabled"] = registry["module.enabled"];
}

function copyMappingFromTemplate(mapping, registry, importing) {
	var templateMapping = new SCFile("SMISFieldMapping", SCFILE_READONLY);
	mapping.fieldMapping = templateMapping.fieldMapping;
	mapping.valueMapping = templateMapping.valueMapping;
	
	if (importing) {
	    var i, j;
		for (i in registry.fieldMapping) {
			
			mapping.fieldMapping[i].SMField = registry.fieldMapping[i].SMField;
			mapping.fieldMapping[i].EPField = registry.fieldMapping[i].EPField;
			mapping.fieldMapping[i].SMDefValue = registry.fieldMapping[i].SMDefValue;
			mapping.fieldMapping[i].EPDefValue = registry.fieldMapping[i].EPDefValue;
			mapping.fieldMapping[i].SMjscallback = registry.fieldMapping[i].SMjscallback;
			mapping.fieldMapping[i].EPjscallback = registry.fieldMapping[i].EPjscallback;
			mapping.fieldMapping[i].direction = registry.fieldMapping[i].direction;
			mapping.fieldMapping[i].FMDescription = registry.fieldMapping[i].FMDescription;
			mapping.fieldMapping[i].valueMappingGroup = registry.fieldMapping[i].valueMappingGroup;
			mapping.fieldMapping[i].FMModuleName = registry.fieldMapping[i].FMModuleName;
		}
		
		for (j in registry.valueMapping) {
		
			mapping.valueMapping[j].SMValue = registry.valueMapping[j].SMValue;
			mapping.valueMapping[j].EPValue = registry.valueMapping[j].EPValue;
			mapping.valueMapping[j].valueMappingGroupID = registry.valueMapping[j].valueMappingGroupID;
			mapping.valueMapping[j].VMDescription = registry.valueMapping[j].VMDescription;
			mapping.valueMapping[j].condition = registry.valueMapping[j].condition;
			mapping.valueMapping[j].VMModuleName = registry.valueMapping[j].VMModuleName;
			if (mapping.valueMapping[j].condition == null) {
				mapping.valueMapping[j].condition = "true";
			}
		}
		
		mapping.preScript = registry.preScript;
		mapping.mappingScript = registry.mappingScript;
	}
}

lib.smis_ConfigurationManager.checkNumberFile("SMISConfiguration");
lib.smis_ConfigurationManager.checkNumberFile("SMISTaskQueue");
function generateInstanceId() {
	var callRtn = new SCDatum();
	var nextNumber = new SCDatum();
	funcs.rtecall("getnumber", callRtn, nextNumber, "SMISConfiguration");
	return nextNumber.getText();
}
