/******************************************************
 * Module Name: SMIS Field mapping manager
 * Function: validate mapping, including fields exist, mapping direction, value mapping, jscallback grammer
 * Author: Dianel Woo
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/

function validateMapping(mapping, config) {

    if (mapping == null) throw "Mapping is not passed in.";

    if (config == null) throw "Integration instance is not passed in.";

    var msg = _validateFieldExists(mapping, config);
    if (msg != null) return msg;

    msg = _validateFieldMappingDirection(mapping);
    if (msg != null) return msg;

    msg = _validateValueMappingExists(mapping);
    if (msg != null) return msg;


    return null;
}

function _validateFieldExists(mapping, config) {
    //Field must exist, in instance configuration or (TODO: defined in adapter.getFields())
    for (var i in mapping.fieldMapping) {
        var row = parseInt(i) + 1;

        var fieldMapping = mapping.fieldMapping[i];

        if (_checkAllFieldNull(fieldMapping)) continue;

        if (fieldMapping.SMField == null && fieldMapping.EPField == null) {
            return lib.smis_CommonLib.msg("14", [row]);
        }


        var msg = null;
        msg = __checkField1InConfig(fieldMapping.SMField, config);
        if (msg != null) return msg;
        msg = __checkField2InConfig(fieldMapping.EPField, config);
        if (msg != null) return msg;

    }
    return null;
}


function _validateFieldMappingDirection(mapping) {
    //Empty target mapping eg, field2 is empty, direction is ->
    for (var i in mapping.fieldMapping) {
        var fieldMapping = mapping.fieldMapping[i];
        var row = 1 + parseInt(i);
        if (fieldMapping.direction == lib.smis_Constants.MAPPING_DIRECTION_BOTH()) {
            if (fieldMapping.SMField == null) {
                return lib.smis_CommonLib.msg("15", [row]);
            }
            if (fieldMapping.EPField == null) {
                return lib.smis_CommonLib.msg("16", [row]);
            }
        } else if (fieldMapping.direction == lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT()) {
            if (fieldMapping.EPField == null) {
                return lib.smis_CommonLib.msg("16", [row]);;
            }
        } else if (fieldMapping.direction == lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT()) {
            if (fieldMapping.SMField == null) {
                return lib.smis_CommonLib.msg("15", [row]);
            }
        } else if (_checkAllFieldNull(fieldMapping)) { //skip empty lines
            continue;
        } else {
            return lib.smis_CommonLib.msg("17", [row]);
        }
    }
    return null;
}

function _validateValueMappingExists(mapping) {
    //Value mapping group must exist
    for (var i in mapping.fieldMapping) {
        var fieldMapping = mapping.fieldMapping[i];
        if (fieldMapping.valueMappingGroup != null) {
            var msg = __checkValueMappingGroup(fieldMapping.valueMappingGroup, mapping.valueMapping, parseInt(i) + 1);
            if (msg != null) return msg;
        }
    }
    return null;
}

function _checkAllFieldNull(fieldMapping) {
    for (var i in fieldMapping) {
        if (fieldMapping[i] != null) return false;
    }
    return true;
}

function __checkField1InConfig(field, config) {
    if (field != null) {
        for (var i in config.SMFields) {
            if ((field == config.SMFields[i].SMFieldName || field == config.SMFields[i].SMAlias) && config.SMFields[i].SMModuleName == vars["$smis.selected.module"]) {
                return null;
            }
        }

        return lib.smis_CommonLib.msg("18", [lib.smis_CommonLib.msg("30"), field]);
    }

}

function __checkField2InConfig(field, config) {


    if (field != null) {
        for (var i in config.EPFields) {
            if (field == config.EPFields[i].EPFieldName || field == config.EPFields[i].EPAlias) {
                return null;
            }
        }

        return lib.smis_CommonLib.msg("18", [lib.smis_CommonLib.msg("36"), field]);
    }

}

function __checkValueMappingGroup(valueMappingGroup, valueMapping, row) {
    for (var i in valueMapping) {
        if (valueMappingGroup == valueMapping[i].valueMappingGroupID) {
            return null;
        }
    }
    return lib.smis_CommonLib.msg("19", [valueMappingGroup, row]);
}


function checkJSCallbackGrammar(config, params) {
    var patt = /((sm|ep|param|context|vars)\.([\w|\$]+[\w|\.|_]+))/g;
    var pattBracket = /((sm|ep|param|context|vars)\[['|"|\\'|\\"]([\w|\$]+[\w|\.|_]+)['|"|\\'|\\"]\])/g;

    var placeholder = /\$\{([^(\$\{)]*)\}/g;

    var msg = null;
    var evalFunc = function(match, $1, $2, $3) {
        try {
            var objName = $2;
            var fieldName = $3;
            if (objName == "sm") {
                msg = __checkField1InConfig(fieldName, config);
            } else if (objName == "ep") {
                msg = __checkField2InConfig(fieldName, config);
            }
            return "" + Math.ceil(Math.random() * 10000);
        } catch (ex) {
            return "";
        }
    };

    var phFunc = function(match, $1) {
        try {
            fieldValue = eval($1);
            if (fieldValue == undefined) return "";
            else return fieldValue;
        } catch (ex) {
            print("ex: " + ex);
            return "";
        }
    };

    for (var i = 0; i < lib.smis_CommonLib.arrayLen(params); i++) {
        funcStr = params[i];
        if (funcStr == null) continue;

        funcStr = funcStr.replace(patt, evalFunc);
        if (msg != null) return msg;

        funcStr = funcStr.replace(pattBracket, evalFunc);
        if (msg != null) return msg;

        funcStr = funcStr.replace(placeholder, phFunc);

        try {
            var ret = eval(funcStr);
            return null;
        } catch (e) {
            return lib.smis_CommonLib.msg("20", [params[i]]);

        }

    }
}

/**
 *  Return the RAD variable names of fieldMapping in dbdict SMISRegistry or SMISFieldMapping
 *  Notice: the order of the fields of fieldMapping is different in the two dbdicts.
 *  The last field SMModule is not returned.
 */
function getFieldMappingVariables(filename) {
    var fieldMappingVariables = {
        "SMISRegistry": [
            "$fieldMapping.direction",
            "$fieldMapping.EPDefValue",
            "$fieldMapping.EPField",
            "$fieldMapping.EPjscallback",
            "$fieldMapping.FMDescription",
            "$fieldMapping.SMDefValue",
            "$fieldMapping.SMField",
            "$fieldMapping.SMjscallback",
            "$fieldMapping.valueMappingGroup"
        ],
        "SMISFieldMapping": [
            "$fieldMapping.direction",
            "$fieldMapping.SMDefValue",
            "$fieldMapping.SMField",
            "$fieldMapping.SMjscallback",
            "$fieldMapping.EPDefValue",
            "$fieldMapping.EPField",
            "$fieldMapping.EPjscallback",
            "$fieldMapping.valueMappingGroup",
            "$fieldMapping.FMDescription"
        ]
    };

    return fieldMappingVariables[filename];
}

/**
 *  Return the RAD variable names of SMField in dbdict SMISRegistry and SMISConfiguration
 *  The order of the fields of SMField is same in the two dbdicts.
 *  The last field SMModuleName is not returned.
 */
function getSMFieldVariables() {
    var fieldVariables = [
        "$SMFields.SMFieldDesc",
        "$SMFields.SMFieldName",
        "$SMFields.SMFieldType",
        "$SMFields.SMAlias"
    ];

    return fieldVariables;
}

/**
 *  Return the RAD variable names of EPField in dbdict SMISRegistry and SMISConfiguration
 *  The order of the fields of SMField is same in the two dbdicts.
 *  The last field EPModuleName is not returned.
 */
function getEPFieldVariables() {
    var fieldVariables = [
        "$EPFields.EPFieldDesc",
        "$EPFields.EPFieldName",
        "$EPFields.EPFieldType",
        "$EPFields.EPAlias"
    ];

    return fieldVariables;
}

/**
 * Init SM and EP field variables for modules
 */
function initFieldVariables(module) {
    doInitFieldVariables('SM', module, getSMFieldVariables());
    doInitFieldVariables('EP', module, getEPFieldVariables());
}

function doInitFieldVariables(prefix, moduleName, variables) {
    var lng2 = variables.length;

    var i, j;
    var fieldNameList = [];

    for (i = 0; i < lng2; i++) {
        var name = variables[i];
        vars[name] = [];
        // for field varaible, $SMFields.SMFieldDesc, put 2nd part "SMFieldDesc" to array
        fieldNameList.push(name.split('.')[1]);
    }

    // SMFields and EPFields
    var parentFieldName = prefix + 'Fields';
    var parentFieldValue = vars["$L.file"][parentFieldName];
    var moduleFieldName = prefix + 'ModuleName';

    var moduleVarName = '$' + parentFieldName + '.' + moduleFieldName;
    vars[moduleVarName] = [];

    var lng = parentFieldValue == null ? 0 : funcs.lng(parentFieldValue);
    var splitVar;
    for (i = 0; i < lng; i++) {
        var fieldModuleValue = vars["$L.file"]["SMFields"][i]["SMModuleName"];
        if (moduleName == fieldModuleValue || fieldModuleValue == null) {
            for (j = 0; j < lng2; j++) {
                vars[variables[j]].push(vars["$L.file"][fieldName][i][fieldNameList[j]]);
            }
            vars[moduleVarName].push(fieldModuleValue);
        }
    }


    for (i = 0; i < lng2; i++) {
        var name = variables[i];
        print('>>> ', name, '=', vars[name]);
    }
}


function putToFieldVariablesToFile() {
    var file = vars["$L.file"];

    var variables = lib.smis_FieldMappingManager.getSMFieldVariables();

    var i, j;
    if (file["module.enabled"]) {
        file = new SCFile(funcs.filename(vars["$L.file"]));
        file["SMFields"] = [];
        file["EPFields"] = vars["$L.file"]["EPFields"];

        var lng = lib.smis_CommonLib.alignVariableArrayLength(variables);
        var lng2 = variables.length;
        
        var size = file["SMFields"].length();
        
        var temp;
        var strStruct = "{[";
        for (j = 0; j < lng2; j++) {
            strStruct += ",";
        }
        strStruct += "]}";
        var allnull;
        for (i = 0; i < lng; i++) {
            allnull = true;
            temp = "$L.temp" + i;
            funcs.parse_evaluate(temp + "=" + strStruct);
            for (j = 0; j < lng2; j++) {
                // order follows the fields of SMField in dbdict SMISConfiguration
                vars[temp][j] = vars[variables[j]][i];
                if (allnull && vars[variables[j]][i] != null) {
                    allnull = false;
                }
            }

            // The line that all values are null is not valid
            if (allnull) {
                continue;
            }

            vars[temp][j] = vars["$smis.selected.module"];
            file["SMFields"].push(vars[temp]);
        }
    }

    vars["$L.validateFieldMessage"] = lib.smis_ConfigurationManager.validateFields(file);

    if (vars["$L.validateFieldMessage"] == null && !vars["$L.viewModel"] && vars["$L.file"]["module.enabled"]) {
        vars["$L.file.bak"] = new SCFile(funcs.filename(vars["$L.file"]));
        funcs.fduplicate(vars["$L.file.bak"], vars["$L.file"]);
        vars["$L.file"]["SMFields"] = [];
        var lng = vars["$L.file.bak"]["SMFields"] == null ? 0 : vars["$L.file.bak"]["SMFields"].length();
        var i;
        for (i = 0; i < lng; i++) {
            if (vars["$L.file.bak"]["SMFields"][i]["SMModuleName"] != vars["$smis.selected.module"] &&
                vars["$L.file.bak"]["SMFields"][i]["SMFieldName"] != null &&
                vars["$L.file.bak"]["SMFields"][i]["SMFieldType"] != null &&
                vars["$L.file.bak"]["SMFields"][i]["SMAlias"] != null) {
                vars["$L.file"]["SMFields"].push(vars["$L.file.bak"]["SMFields"][i]);
            }
        }

        lng = file["SMFields"] == null ? 0 : file["SMFields"].length();
        for (i = 0; i < lng; i++) {
            vars["$L.file"]["SMFields"].push(file["SMFields"][i]);
        }
    }

}


function initFieldMapping() {
    vars.$L_viewModel = false;

    var sm = vars.$L_file.SMAdapter;
    var ep = vars.$L_file.EPAdapter;
    vars.$L_mockSMISConfig = new SCFile("SMISConfiguration");
    var config  = new (lib.smis_InstanceConfiguration.getClass())(); //just for syntax checking
    /*
    try {
        var smAdapter = eval("new (lib."+sm+".getClass())(config)");
        var smFields = smAdapter.getFields();
        
        
        var epAdapter = eval("new (lib."+ep+".getClass())(config)");
        var epFields = epAdapter.getFields();
        
        if(lib.smis_CommonLib.isArray(smFields)) {
            var tempSMFields = new SCDatum();
            tempSMFields.setType(8);
            
            
            for(var i in smFields) {
                tempSMFields.push(smFields[i].name);
                vars.$L_mockSMISConfig.SMFields[i].SMFieldName = smFields[i].name;
                vars.$L_mockSMISConfig.SMFields[i].SMFieldType = smFields[i].type;
                vars.$L_mockSMISConfig.SMFields[i].SMFieldDesc = smFields[i].desc;
            }
            
            
            system.vars.$L_intSMFields = tempSMFields
            
        }
        
        
        if(lib.smis_CommonLib.isArray(epFields)) {
        
            var tempEPFields = new SCDatum();
            tempEPFields.setType(8);
            
            for(var i in epFields) {
                tempEPFields.push(epFields[i].name);
                vars.$L_mockSMISConfig.EPFields[i].EPFieldName = epFields[i].name;
                vars.$L_mockSMISConfig.EPFields[i].EPFieldType = epFields[i].type;
                vars.$L_mockSMISConfig.EPFields[i].EPFieldDesc = epFields[i].desc;
            }
            
            system.vars.$L_intEPFields = tempEPFields;
            
        }
        

    } catch (e) {
        
        print(e);
    }
    */
    
    
    //prepare the field list in the field mapping table
    var smFields = [];
    var epFields = vars.$L_file.EPFields;
    var resultSMAlias = [];
    var resultEPAlias = [];
    var resultSMNames = [];
    var resultEPNames = [];

    var variables = lib.smis_FieldMappingManager.getFieldMappingVariables("SMISRegistry");
    var lng = variables.length;
    var i, j;
    var splitVars = [];
    for (i=0; i<lng; i++) {
        vars[variables[i]] = [];
        splitVars.push(lib.smis_FieldMappingManager.getSplitThreadVariable(variables[i]));
    }
    vars["$fieldMapping.SMModule"] = [];

    var variables2 = lib.smis_FieldMappingManager.getSMFieldVariables();
    var lng2 = variables2.length;
    var temp, strStruct;
    strStruct = "{[";
    for (i=0; i<lng2; i++) {
        strStruct += ",";
    }
    strStruct += "]}";
    
    for (i = 0; i < vars["$SMFields.SMFieldName"].length(); i++) {
        resultSMAlias.push(vars["$SMFields.SMAlias"][i]);
        temp = "$L.temp" + i;
        funcs.parse_evaluate(temp + "=" + strStruct);
        for (j=0; j<lng2; j++) {
            vars[temp][j] = vars[variables2[j]][i];
        }
        vars[temp][j] = vars["$smis.selected.module"];
        smFields.push(vars[temp]);
    }

    var splitVar;
    var lng3 = vars.$L_file.fieldMapping == null ? 0 : vars.$L_file.fieldMapping.length();
    for (i = 0; i < lng3; i++) {
        if (vars.$L_file.fieldMapping[i]["SMModule"] == vars["$smis.selected.module"]) {
            for (j=0; j<lng; j++) {
                splitVar = splitVars[j];
                vars[variables[j]].push(vars["$L.file"][splitVar[0]][i][splitVar[1]])
            }
            vars["$fieldMapping.SMModule"].push(vars.$L_file.fieldMapping[i]["SMModule"]);
        }
    }
    
    for (i = 0; i < epFields.length(); i++) {
        resultEPAlias.push(epFields[i].EPAlias);
    }
    
    system.vars.$L_intSMAlias = resultSMAlias.sort(new Function("a","b","return (a > b) ? 1: -1 "));
    system.vars.$L_intEPAlias = resultEPAlias.sort(new Function("a","b","return (a > b) ? 1: -1 "));
    
    // build names according to the sequence of alias
    var k;
    for (k = 0; k < resultSMAlias.length; k++) {
        for (i = 0; i < vars["$SMFields.SMFieldName"].length(); i++) {
            if (resultSMAlias[k] == vars["$SMFields.SMAlias"][i]) {
                resultSMNames.push(vars["$SMFields.SMFieldName"][i]);
                break;
            }
        }
    }
    
    for (k = 0; k < resultEPAlias.length; k++) {
        for (i = 0; i < epFields.length(); i++) {
            if (resultEPAlias[k] == epFields[i].EPAlias) {
                resultEPNames.push(epFields[i].EPFieldName);
                break;
            }
        }
    }
    
    system.vars.$L_intSMFields = resultSMNames;
    system.vars.$L_intEPFields = resultEPNames;
    
    vars.$L_mockSMISConfig.SMFields = smFields;
    vars.$L_mockSMISConfig.EPFields = epFields;
}


/**
 *  Split the RAD thread variable by "." and return them as string array
 *  For example, $fieldMapping.SMField will be split to ["fieldMapping", "SMField"]
 *  If the variable is not able to be split, return null
 */
function getSplitThreadVariable(variable) {
    var splitVar = variable.split(".");
    if (splitVar == null || splitVar.length < 2) {
        return null;
    }
    
    if (splitVar[0].indexOf("$") == 0) {
        splitVar[0] = splitVar[0].substring(1);
    }
    
    return splitVar;
}

var log = getLog('xxx.log');