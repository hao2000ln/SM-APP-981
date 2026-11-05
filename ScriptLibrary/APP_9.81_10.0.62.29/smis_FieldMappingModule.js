var j = JSON.stringify;
var log = getLog('smis.field.mapping.module');

/** -------------- Wizard Initialization -------------- **/

/** The function of module list */
function moduleListFunc(file) {
    var adapter = file.SMAdapter;
    if (!lib[adapter] || !lib[adapter].getModuleList) {
        print('Module not found in SMAdatper:' + adapter);
        return null;
    }

    var func = lib[adapter].getModuleList;

    if (!func || typeof(func) != 'function') {
        print('Module not found in SMAdatper:' + adapter);
    }

    return func;
}

/**
 * Module Select Wizard
 */
function initModuleSelect(includeAll) {
    resetThreadVars();

    var file = vars['$L.file'];
    var getModuleListFunc = moduleListFunc(file);
    if (!getModuleListFunc) {
        return;
    }

    var list = null;

    if (includeAll) {
        list = getModuleListFunc();
    } else {
        list = getModuleListFunc(file);
    }

    let valueList = list.valueList;
    let displayList = list.displayList;
    let currentModule = vars['$L.currentModule'];

    // No module enabled
    if (valueList.length < 1) {
        vars['$L.currentModule'] = null;
        vars['$L.currentModuleDisplay'] = null;
        return;
    }

    if (!valueList.includes(currentModule)) {
        currentModule = null;
    }

    if (!currentModule) {
        vars['$L.currentModule'] = valueList[0];
        vars['$L.currentModuleDisplay'] = displayList[0];
    }

    vars['$L.moduleValueList'] = valueList;
    vars['$L.moduleDisplayList'] = displayList;
}


function calcModuleDisplay() {
    vars['$L.currentModuleDisplay'] = vars['$L.currentModule'];

    if (!vars['$L.currentModule'] || !vars['$L.moduleValueList'] || !vars['$L.moduleDisplayList']) {
        return;
    }

    var index = vars['$L.moduleValueList'].toArray().indexOf(vars['$L.currentModule']);
    if (index >= 0) {
        vars['$L.currentModuleDisplay'] = vars['$L.moduleDisplayList'][index] || vars['$L.currentModule'];
    }
}

/**
 * Field Mapping wizard, Map field alias and name
 */
function initFieldSelect() {
    _mapFieldList(vars['$SMFields.SMFieldName'], vars['$SMFields.SMAlias'], "$L.intSMFields", "$L.intSMAlias");
    _mapFieldList(vars['$EPFields.EPFieldName'], vars['$EPFields.EPAlias'], "$L.intEPFields", "$L.intEPAlias");
}

/**
 * Mapping fields/alias to sorted variables
 */
function _mapFieldList(nameList, aliasList, toNameListVar, toAliasListVar) {

    var list = [];
    var size = nameList.length();

    aliasList = aliasList.toArray();

    for (var k = 0; k < size; k++) {
        var name = nameList[k];
        let alias = aliasList[k];

        if (name) {
            list.push({
                name,
                alias
            });
        }
    }

    // Sort
    list.sort((a, b) => a.alias > b.alias);

    vars[toNameListVar] = list.map(item => item.name);
    vars[toAliasListVar] = list.map(item => item.alias);
}


/**
 * Variable Names to field names
 */
function getFieldNameList(varList) {
    return varList.map(name => name.split('.')[1]);
}

function getEPFieldVariables() {
    var fieldVariables = [
        "$EPFields.EPFieldDesc",
        "$EPFields.EPFieldName",
        "$EPFields.EPFieldType",
        "$EPFields.EPAlias"
    ];

    return fieldVariables;
}


function getFMFieldVariables() {
    return [
        "$fieldMapping.direction",
        "$fieldMapping.EPDefValue",
        "$fieldMapping.EPField",
        "$fieldMapping.EPjscallback",
        "$fieldMapping.FMDescription",
        "$fieldMapping.SMDefValue",
        "$fieldMapping.SMField",
        "$fieldMapping.SMjscallback",
        "$fieldMapping.valueMappingGroup"
    ];
}

function getVMFieldVariables() {
    return [
        "$valueMapping.condition",
        "$valueMapping.EPValue",
        "$valueMapping.SMValue",
        "$valueMapping.valueMappingGroupID",
        "$valueMapping.VMDescription"
    ];
}

/**
 * Make the list from the file and exclude the fields for a specific module
 */
function makeDataForFile(file, parentFieldName, fieldNameList, moduleFieldName, excludedModule) {
    var length = funcs.denull(file[parentFieldName]).length();

    var fullFieldNameList = [moduleFieldName, ...fieldNameList];

    let list = [];
    for (var k = 0; k < length; k++) {
        var line = {};
        var isNull = true;
        fullFieldNameList.forEach(n => {
            line[n] = file[parentFieldName][k][n]
            if (line[n] != null) {
                isNull = false;
            }
        });

        // add only is not null and not the module to include
        if (!isNull && line[moduleFieldName] != excludedModule) {
            list.push(line);
        }
    }

    return list;
}

/**
 * Make data list from variables
 */
function makeDataForVars(varNameList, fieldNameList, moduleFieldName, module) {
    // find max data length
    var size = 0;
    varNameList.forEach(name => {
        let length = funcs.denull(vars[name]).length();
        if (length > size) {
            size = length;
        }
    });

    var list = [];

    // loop data in vars
    for (let n = 0; n < size; n++) {
        let line = {};
        fieldNameList.forEach((name, index) => {
            var varName = varNameList[index];

            // print('n=', n, ', varName=', varName, ', value=', vars[varName]);
            if (n < vars[varName].length()) {
                line[name] = vars[varName][n];
            }
        });
        line[moduleFieldName] = module;
        list.push(line);
    }

    return list;
}

/**
 * struct used in array of structure operations
 */
function makeStruct() {
    var datum = new SCDatum();
    datum.setType(9);
    return datum;
}

/**
 * replace the data list in the file
 */
function _putDataToFile(file, list, parentFieldName, fieldNameList, moduleFieldName, moduleNeeded) {
    file[parentFieldName] = [];

    var size = list.length;
    file[parentFieldName] = funcs.insert(file[parentFieldName], 1, size, makeStruct());
    // print(file);
    // print(file[parentFieldName]);

    list.forEach((item, index) => {
        fieldNameList.forEach(fieldName => {
            file[parentFieldName][index][fieldName] = item[fieldName];
            log.debug('>>>>> _putDataToFile: parentFieldName=', parentFieldName, ', fieldName=', fieldName, ', value=', item[fieldName]);
        });

        if (moduleNeeded) {
            file[parentFieldName][index][moduleFieldName] = item[moduleFieldName];
        }
    });

    // print(file);
}

/**
 * Put Var data and other module data to file record.
 */
function putDataToFile(file, varNameList, parentFieldName, moduleFieldName, module, moduleNeeded) {
    var fieldNameList = getFieldNameList(varNameList);
    var list1 = makeDataForVars(varNameList, fieldNameList, moduleFieldName, module);

    log.debug('>>>>> putDataToFile: fieldNameList=', fieldNameList, ', moduleNeeded=', moduleNeeded);
    log.debug('>>>>> putDataToFile: list1=', j(list1));

    var list2 = makeDataForFile(file, parentFieldName, fieldNameList, moduleFieldName, module);
    log.debug('>>>>> putDataToFile: list2=', j(list2));

    var list = list1;
    if (moduleNeeded) {
        list = [...list1, ...list2];
    }

    _putDataToFile(file, list, parentFieldName, fieldNameList, moduleFieldName, moduleNeeded);
}

/**
 * Put data of a file record to Thread variables
 */
function putFileDataToVar(file, varNameList, parentFieldName, moduleVarName, moduleFieldName, moduleName, moduleNeeded) {
    var fieldNameList = getFieldNameList(varNameList);

    // find max size
    var size = 0;
    var parentFieldValue = file[parentFieldName];
    if (parentFieldValue) {
        size = funcs.lng(funcs.denull(parentFieldValue));
    }

    vars[moduleVarName] = [];
    varNameList.forEach(name => vars[name] = []);

    for (let i = 0; i < size; i++) {
        var fieldModuleValue = file[parentFieldName][i][moduleFieldName];
        if (!moduleNeeded || moduleName == fieldModuleValue) {
            fieldNameList.forEach((name, index) => {
                vars[varNameList[index]].push(file[parentFieldName][i][name]);
            });

            vars[moduleVarName].push(fieldModuleValue);
        }
    }
}

/***************************** Field Definition  *************************************/

/**
 * Field Definition
 */
function doPutFieldVarDataToFile(file, prefix, module, varNameList, moduleNeeded) {
    var fieldNameList = getFieldNameList(varNameList);

    // SMFields and EPFields
    var parentFieldName = prefix + 'Fields';
    var moduleFieldName = prefix + 'ModuleName';

    putDataToFile(file, varNameList, parentFieldName, moduleFieldName, module, moduleNeeded);
}

/**
 * variable to file
 */
function putFieldVarDataToFile(module) {
    var file = vars["$L.file"];
    doPutFieldVarDataToFile(file, 'SM', module, lib.smis_FieldMappingManager.getSMFieldVariables(), true);

    // For EP field, only module.type with "many" need module
    var moduleNeeded = file.module_type == 'many';
    doPutFieldVarDataToFile(file, 'EP', module, getEPFieldVariables(), moduleNeeded);
}

/**
 * file to variable
 */
function doPutFieldFileDataToVar(prefix, moduleName, varNameList, moduleNeeded) {
    var file = vars["$L.file"];

    // SMFields and EPFields
    var parentFieldName = prefix + 'Fields';
    var moduleFieldName = prefix + 'ModuleName';
    var moduleVarName = '$' + parentFieldName + '.' + moduleFieldName;

    putFileDataToVar(file, varNameList, parentFieldName, moduleVarName, moduleFieldName, moduleName, moduleNeeded);
}

/**
 * file to variable, both SM and EP fields
 */
function putFieldFileDataToVar(module) {

    var varName = lib.smis_FieldMappingManager.getSMFieldVariables()[0];
    if (vars[varName] != null && vars.$current_module_save == module) {
        return;
    }

    vars.$current_module_save = module;

    module = calcCurrentModule(module);

    var file = vars["$L.file"];
    var moduleNeeded = file.module_type == 'many';

    doPutFieldFileDataToVar('SM', module, lib.smis_FieldMappingManager.getSMFieldVariables(), true);
    doPutFieldFileDataToVar('EP', module, getEPFieldVariables(), moduleNeeded);
}

function calcCurrentModule(module) {
    var file = vars.$L_file;
    if (file.module_type == 'many') return module;

    // Fix Smart Email, for SMIS Registory, the module is passed in; for SMIS instancee, the module is null    
    if(!module) {
        module = lib.smis_ConfigurationManager.getSMISConfigurationParameterValue(file, 'object');
    }

    var func = moduleListFunc(file);
    var moduleList = moduleListFunc(file)();

    let index = moduleList.valueList.indexOf(module);
    if (index >= 0) {
        var moduleDisplay = moduleList.displayList[index];
    }

    vars.$L_currentModule = module
    vars.$L_currentModuleDisplay = moduleDisplay || module;

    return module;
}


/***************************** Field Mappings / Value Mappings ******************************************/

/**
 * FieldMappings
 */
function putFieldMappingFileDataToVar(file, moduleName) {
    var parentFieldName = 'fieldMapping';
    var moduleFieldName = 'FMModuleName';
    var moduleVarName = '$' + parentFieldName + '.' + moduleFieldName;

    var varNameList = getFMFieldVariables();
    putFileDataToVar(file, varNameList, parentFieldName, moduleVarName, moduleFieldName, moduleName, true);
}

/**
 * ValueMappings
 */
function putValueMappingFileDataToVar(file, moduleName) {
    var parentFieldName = 'valueMapping';
    var moduleFieldName = 'VMModuleName';
    var moduleVarName = '$' + parentFieldName + '.' + moduleFieldName;

    var moduleNeeded = vars.$L_file.module_type == 'many';

    var varNameList = getVMFieldVariables();
    putFileDataToVar(file, varNameList, parentFieldName, moduleVarName, moduleFieldName, moduleName, moduleNeeded);
}

/**
 * Field Mapping Form: make field mappings and value mappings variables
 */
function putMappingFileDataToVar(file, moduleName) {
    if (vars['$fieldMapping.SMField'] != null) {
        return;
    }
    putFieldMappingFileDataToVar(file, moduleName);
    putValueMappingFileDataToVar(file, moduleName);

    vars.$Mapping_preScript = file.preScript;
    vars.$Mapping_mappingScript = file.mappingScript;
}
/*--------------------------------*/

/**
 * Field Mapping
 */
function doPutFieldMappingVarDataToFile(file, module) {
    var parentFieldName = 'fieldMapping';
    var moduleFieldName = 'FMModuleName';
    var moduleVarName = '$' + parentFieldName + '.' + moduleFieldName;

    var varNameList = getFMFieldVariables();

    putDataToFile(file, varNameList, parentFieldName, moduleFieldName, module, true);
}


/**
 * Field Value Mapping
 */
function doPutValueMappingVarDataToFile(file, module, moduelType) {
    var parentFieldName = 'valueMapping';
    var moduleFieldName = 'VMModuleName';
    var moduleVarName = '$' + parentFieldName + '.' + moduleFieldName;

    var varNameList = getVMFieldVariables();

    varNameList.forEach(name => log.debug('doPutValueMappingVarDataToFile=', name, '=', vars[name]));

    var moduleNeeded = moduelType == 'many';

    log.debug('>>>>> doPutValueMappingVarDataToFile:moduelType, ', moduelType, ', varNameList=', varNameList);

    putDataToFile(file, varNameList, parentFieldName, moduleFieldName, module, moduleNeeded);
}


/**
 * variable to file
 */
function putMappingVarDataToFile(file, module, moduleType) {
    doPutFieldMappingVarDataToFile(file, module);
    doPutValueMappingVarDataToFile(file, module, moduleType);

    file.preScript = vars.$Mapping_preScript;
    file.mappingScript = vars.$Mapping_mappingScript;
}

function resetThreadVars() {
    var varNameList = [
        ...lib.smis_FieldMappingManager.getSMFieldVariables(),
        ...getEPFieldVariables(),
        ...getFMFieldVariables(),
        ...getVMFieldVariables()
    ];

    for (var m of varNameList) {
        vars[m] = null;
    }
    
    vars.$current_module_save = null;
}