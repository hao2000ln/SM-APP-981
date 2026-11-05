/******************************************************
 * Module Name: SMIS Field mapping processor
 * Function: process field mapping
 * Author: Dianel Woo
 * Version: 1.00
 * Creation Date: spr, 2009
 *******************************************************/

var Class = lib.smis_Prototype.getClass();

var FieldMappingProcessorClass = Class.create({

    cachedSMFieldTypes: {},
    cachedEPFieldTypes: {},

    initialize: function(instanceConfiguration) {
        this.commLib = lib.smis_CommonLib;
        this.logger = instanceConfiguration.getLogger();
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("FieldMappingProcessor", "Initializing FieldMappingProcessor with configuration:" + instanceConfiguration.intId);
        }
        this.config = instanceConfiguration;

        var i;
        for (i in this.config.SMFields) {
            if (this.config["configItem"]["module.enabled"]) {
                var smField = this.config.SMFields[i];
                var smModule = smField['SMModuleName'];
                var smFieldName = smField['SMFieldName'];
                var smFieldType = smField['SMFieldType'];
                if (this.cachedSMFieldTypes[smModule]) {
                    this.cachedSMFieldTypes[smModule][smFieldName] = smFieldType;
                } else {
                    var module = {};
                    module[smFieldName] = smFieldType;
                    this.cachedSMFieldTypes[smModule] = module;
                }
            } else {
                this.cachedSMFieldTypes[this.config.SMFields[i].SMFieldName] = this.config.SMFields[i].SMFieldType;
            }
        }

        for (i in this.config.EPFields) {
            this.cachedEPFieldTypes[this.config.EPFields[i].EPFieldName] = this.config.EPFields[i].EPFieldType;
        }

        var record = new SCFile("SMISFieldMapping");
        var RC = record.doSelect("intId=\"" + this.config.intId + "\"");
        if (RC == RC_SUCCESS) {
            this.mapping = new(lib.smis_FieldMapping.getClass())(record);
        } else {
            throw "Cannot find FieldMapping with id=" + this.config.intId;
        }

    },

    /**
     * convert ep object, processing nested field path
     */
    convertEPObject: function(record) {
        var epObject = {};
        var i;
        for (i in this.config.EPFields) {
            var fieldName = this.config.EPFields[i].EPFieldName;
            if (!fieldName) {
                continue;
            }
            var value = calcEPValue(record, fieldName);
            if (value !== undefined) {
                epObject[fieldName] = value;
            }
        }
        return epObject;
    },

    _setSMAliasProperty: function(record) {
        var i;
        for (i in this.config.SMFields) {
            if (this.config["configItem"]["module.enabled"] && this.config["configItem"]["module"] != this.config.SMFields[i]["SMModuleName"]) {
                continue;
            }
            record[this.config.SMFields[i].SMAlias] = record[this.config.SMFields[i].SMFieldName];
        }
    },

    _setEPAliasProperty: function(record) {
        var i;
        for (i in this.config.EPFields) {
            record[this.config.EPFields[i].EPAlias] = record[this.config.EPFields[i].EPFieldName];
        }
    },

    /**
    * At runtime, check if the incoming data from the adapter contains valid fields defined in the field mapping
    * eg, adapter A returns a record X, X contains fields X.A, X.B and X.C; in field mapping A, B, C and D are defined, 
    * since D is not defined in the record, an error will be thrown.
    //TODO: need to check if the data meet JSCallback at runtime
    */
    validate: function(srcRecord, direction) {
        // convert to EP field-value
        if (rightToLeft(direction)) {
            srcRecord = this.convertEPObject(srcRecord);
        }

        if (!rightToLeft(direction) && !leftToRight(direction)) {
            throw "Invalid direction parameter: " + direction;
        }

        var i;
        for (i in this.mapping.fieldMapping) {
            var fm = this.mapping.fieldMapping[i];
            if (this.config["configItem"]["module.enabled"] && this.config["configItem"]["module"] != fm["SMModule"]) {
                continue;
            }
            var v;
            if (rightToLeft(direction) && !leftToRight(fm.direction) &&
                !this.commLib.isEmpty(fm.SMField) && !this.commLib.isEmpty(fm.EPField)) {
                v = srcRecord[fm.EPField];
                if (v === undefined) {
                    throw "Field [" + fm.EPField + "] in End Point cannot be found in the incoming task";
                }
            }
            if (leftToRight(direction) && !rightToLeft(fm.direction) &&
                !this.commLib.isEmpty(fm.SMField) && !this.commLib.isEmpty(fm.EPField)) {
                v = srcRecord[fm.SMField];
                if (v === undefined) {
                    throw "Field [" + fm.SMField + "] in SM cannot be found in the incoming task";
                }
            }

        }

        return true;
    },

    /**
     * pre process, cope with basic data mapping
     */
    getOutRecord: function(inRecord, smisContext, direction) {
        var param = this.config.getAllParameters();
        var tmpRecord = inRecord;
        // convert to EP field-value
        if (rightToLeft(direction)) {
            inRecord = this.convertEPObject(tmpRecord);
        } else {
            inRecord = {};
            var p;
            for (p in tmpRecord) {
                inRecord[p] = tmpRecord[p];
            }
        }

        if (rightToLeft(direction)) {
            this._setEPAliasProperty(inRecord);
        } else {
            this._setSMAliasProperty(inRecord);
        }

        // process pre script
        if (this.mapping.preScript != null && this.mapping.preScript != "") {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("FieldMappingProcessor", "processing pre script: " + this.mapping.preScript);
            }
            try {
                var scriptfunc = new Function('sm', 'ep', 'context', 'param', this.mapping.preScript);
                if (leftToRight(direction)) {
                    scriptfunc(inRecord, {}, smisContext, param);
                } else if (rightToLeft(direction)) {
                    scriptfunc({}, inRecord, smisContext, param);
                }
            } catch (ex) {
                this.logger.error("FieldMappingProcessor", ex);
            }
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("FieldMappingProcessor", "getOutRecord with direction " + direction);
        }

        var outRecord = {};
        var fm = this.mapping.fieldMapping;
        var i;
        var value;
        var valueMappingTable;
        var mappedValue;
        var defaultValue;
        if (leftToRight(direction)) {
            for (i in fm) {
                if (this.config["configItem"]["module.enabled"] && this.config["configItem"]["module"] != fm[i]["SMModule"]) {
                    continue;
                }
                if (!this.commLib.isEmpty(fm[i].EPField)) {
                    if (rightToLeft(fm[i].direction)) {
                        continue; //skip, except for <-> and ->
                    }
                    value = inRecord[fm[i].SMField];
                    if(value !== undefined && value !== null && funcs.type(value) == lib.DataTypeConst.typeBoolean()){
                        value = String(value);
                    }
                    
                    if (!!value && !!fm[i].valueMappingGroup) {
                        valueMappingTable = this.mapping.getValueMapingTable(fm[i].valueMappingGroup);
                        mappedValue = this._calValueMapping(valueMappingTable, direction, value, inRecord, smisContext, param);
                        if (mappedValue !== undefined) {
                            value = this.commLib.convertToType(mappedValue, this.cachedEPFieldTypes[fm[i].EPField]);
                        } else {
                            value = undefined;
                        }
                    }

                    if (!!!value && !!fm[i].EPDefValue) {
                        defaultValue = this._calDefaultValue(fm[i].EPDefValue, direction, inRecord, smisContext, param);
                        value = this.commLib.convertToType(defaultValue, this.cachedEPFieldTypes[fm[i].EPField]);
                    }

                    // skip the field if no field value in the record
                    if (value === undefined) {
                        continue;
                    }

                    outRecord[fm[i].EPField] = value;
                }
            }
        } else if (rightToLeft(direction)) {
            for (i in fm) {
                if (this.config["configItem"]["module.enabled"] && this.config["configItem"]["module"] != fm[i]["SMModule"]) {
                    continue;
                }
                if (!this.commLib.isEmpty(fm[i].SMField)) {
                    if (leftToRight(fm[i].direction)) {
                        continue; //skip, except for <-> and <-
                    }
                    value = inRecord[fm[i].EPField];

                    var valueType;
                    if (this.config["configItem"]["module.enabled"]) {
                        var module = this.config["configItem"]["module"];
                        valueType = this.cachedSMFieldTypes[module][fm[i].SMField];
                    } else {
                        valueType = this.cachedSMFieldTypes[fm[i].SMField];
                    }

                    if (!!value && !!fm[i].valueMappingGroup) {
                        valueMappingTable = this.mapping.getValueMapingTable(fm[i].valueMappingGroup);
                        mappedValue = this._calValueMapping(valueMappingTable, direction, value, inRecord, smisContext, param);
                        if (mappedValue != undefined) {
                            value = this.commLib.convertToType(mappedValue, valueType);
                        } else {
                            value = undefined;
                        }
                    }

                    if (!!!value && !!fm[i].SMDefValue) {
                        defaultValue = this._calDefaultValue(fm[i].SMDefValue, direction, inRecord, smisContext, param);
                        value = this.commLib.convertToType(defaultValue, valueType);
                    }

                    // skip the field if no field value in the record
                    if (value === undefined) {
                        continue;
                    }

                    outRecord[fm[i].SMField] = value;
                }
            }

        }

        if (rightToLeft(direction)) {
            this._setSMAliasProperty(outRecord);
        } else {
            this._setEPAliasProperty(outRecord);
        }

        return outRecord;
    },

    /*
     * param{defaultValue} - default value
     * param{direction} - inbound or outbound
     * param{inRecord} - inRecord
     * param{smisContext} - smis context
     * param{param} - parameters map
     * return - evaluated value
     */
    _calDefaultValue: function(defaultValue, direction, inRecord, smisContext, param) {
        var sm;
        var ep;
        if (leftToRight(direction)) {
            sm = inRecord;
            ep = {};
        } else if (rightToLeft(direction)) {
            sm = {};
            ep = inRecord;
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("FieldMappingProcessor", "eval default value: " + defaultValue);
        }

        var expression = this.commLib.evalJS(sm, ep, smisContext, param, defaultValue);
        try {
            var ret = eval(expression);
        } catch (ex) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("FieldMappingProcessor", "default value is simple value ");
            }
            return expression;
        }

        // NaN may be the return value of eval
        if (isNaN(ret)) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("FieldMappingProcessor", "default value is simple value ");
            }

            ret = expression;
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("FieldMappingProcessor", "eval default result: " + ret);
        }

        return ret;
    },

    _calValueMapping: function(valueMappingTable, direction, value, inRecord, smisContext, param) {
        var i;
        for (i = 0; i < valueMappingTable.length; i++) {
            var valueMapping = valueMappingTable[i];
            var sm;
            var ep;
            var mapValue;
            if (leftToRight(direction)) {
                if (value != valueMapping.smValue) {
                    continue;
                }
                sm = inRecord;
                ep = {};
                mapValue = valueMapping.epValue;
            } else if (rightToLeft(direction)) {
                if (value != valueMapping.epValue) {
                    continue;
                }
                sm = {};
                ep = inRecord;
                mapValue = valueMapping.smValue;
            }
            var condition = valueMapping.condition;
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("FieldMappingProcessor", "eval condition: " + condition);
            }
            var expression = this.commLib.evalJS(sm, ep, smisContext, param, condition);
            try {
                var ret = eval(expression);
            } catch (ex) {
                this.logger.warn("FieldMappingProcessor", "eval condition error: " + ex);
                return;
            }

            if (this.logger.isDebugEnabled()) {
                this.logger.debug("FieldMappingProcessor", "eval result: " + ret);
            }

            if (ret == true) {
                return mapValue;
            }
        }
    },


    /**
     * JavaScript callback
     */
    setFieldValues: function(inObj, outObj, destObj, smisContext, direction) {
        var param = this.config.getAllParameters();

        var i;
        var p;

        var tmpRecord = inObj;
        // convert to EP field-value
        if (rightToLeft(direction)) {
            inObj = this.convertEPObject(tmpRecord);
        } else {
            inObj = {};
            for (p in tmpRecord) {
                inObj[p] = tmpRecord[p];
            }
        }

        var mapObj = {};
        var fm = this.mapping.fieldMapping;
        var value;
        var value1;
        if (leftToRight(direction)) {
            for (i in fm) {
                if (this.config["configItem"]["module.enabled"] && this.config["configItem"]["module"] != fm[i]["SMModule"]) {
                    continue;
                }

                if (this.commLib.isEmpty(fm[i].EPField) || rightToLeft(fm[i].direction)) {
                    continue;
                }

                value = outObj[fm[i].EPField];
                if (!this.commLib.isEmpty(fm[i].EPField) && !this.commLib.isEmpty(fm[i].EPjscallback)) {
                    value1 = this._evaluateJSCallback(inObj, outObj, smisContext, param, fm[i].EPjscallback);
                    if (value1 === undefined) { //skip this mapping if the callback has no return value
                        continue;
                    } else {
                        value = value1; //override the mapping result if the callback has a valid return value
                    }
                }

                // skip the field if no field value in the record
                if (value === undefined) {
                    continue;
                }

                if (this.logger.isDebugEnabled()) {
                    this.logger.debug("FieldMappingProcessor", "setFieldValues:" + fm[i].EPField + ":" + value);
                }
                value = this.commLib.convertToType(value, this.cachedEPFieldTypes[fm[i].EPField]);
                mapObj[fm[i].EPField] = value;

            }
        } else if (rightToLeft(direction)) {
            for (i in fm) {
                if (this.config["configItem"]["module.enabled"] && this.config["configItem"]["module"] != fm[i]["SMModule"]) {
                    continue;
                }

                if (this.commLib.isEmpty(fm[i].SMField) || leftToRight(fm[i].direction)) {
                    continue;
                }

                value = outObj[fm[i].SMField];
                if (!this.commLib.isEmpty(fm[i].SMField) && !this.commLib.isEmpty(fm[i].SMjscallback)) {

                    value1 = this._evaluateJSCallback(outObj, inObj, smisContext, param, fm[i].SMjscallback);
                    if (value1 === undefined) { //skip this mapping if the callback has no return value
                        continue;
                    } else {
                        value = value1; //override the mapping result if the callback has a valid return value
                    }
                }

                // skip the field if no field value in the record
                if (value === undefined) {
                    continue;
                }

                var valueType;
                if (this.config["configItem"]["module.enabled"]) {
                    var module = this.config["configItem"]["module"];
                    valueType = this.cachedSMFieldTypes[module][fm[i].SMField];
                } else {
                    valueType = this.cachedSMFieldTypes[fm[i].SMField];
                }

                if (this.logger.isDebugEnabled()) {
                    this.logger.debug("FieldMappingProcessor", "setFieldValues:" + fm[i].SMField + ":" + value);
                }
                value = this.commLib.convertToType(value, valueType);
                mapObj[fm[i].SMField] = value;
            }
        }

        // process mapping Script
        if (this.mapping.mappingScript != null && this.mapping.mappingScript != "") {
            try {
                var scriptfunc = new Function('mapObj', 'sm', 'ep', 'context', 'param', this.mapping.mappingScript);
                if (leftToRight(direction)) {
                    scriptfunc(mapObj, inObj, outObj, smisContext, param);
                } else if (rightToLeft(direction)) {
                    scriptfunc(mapObj, outObj, inObj, smisContext, param);
                }
            } catch (ex) {
                this.logger.error("FieldMappingProcessor", ex);
            }
        }

        // convert to sm object
        if (rightToLeft(direction) && system.functions.filename(destObj) != null) { // is SM object
            lib.smis_CommonLib.convertToSMObject(mapObj, destObj);
        } else if (leftToRight(direction)) {
            for (p in mapObj) {
                if (mapObj[p] !== null) {
                    calcEPOutObject(p, mapObj[p], destObj, this.config.template);
                }
            }
        } else {
            for (p in mapObj) {
                destObj[p] = mapObj[p];
            }
        }

    },

    _evaluateJSCallback: function(sm, ep, context, param, jscallback) {

        if (jscallback.indexOf("setValue") == 0 && jscallback.lastIndexOf(")") != -1) {
            jscallback = jscallback.substring(0, jscallback.lastIndexOf(")")) +
                ", \"$smis.action\")";
        }
        var expression = this.commLib.evalJS(sm, ep, context, param, jscallback);
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("FieldMappingProcessor", "jscallback: Final evaluation expression:<" + expression + ">");
        }

        try {
            var value = eval("lib.smis_JSCallback." + expression);
        } catch (ex) {
            this.logger.warn("FieldMappingProcessor", "jscallback: evaluation error:" + ex);
            return;
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("FieldMappingProcessor", "jscallback: Final evaluation value:" + value);
        }

        return value;
    }


});

function getClass() {
    return FieldMappingProcessorClass;
}

function rightToLeft(direction) {
    return direction == lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
}

function leftToRight(direction) {
    return direction == lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT();
}

function both(direction) {
    return direction == lib.smis_Constants.MAPPING_DIRECTION_BOTH();
}

function calcEPValue(record, fieldName) {
    var path = fieldName.split(/\./);
    var value = record;
    var k;
    for (k = 0; k < path.length; k++) {
        if (value[path[k]] == undefined) {
            return record[fieldName];
        }
        value = value[path[k]];
    }
    return value;
}

function calcEPOutObject(fieldName, value, destObj, templateName) {
    var path = fieldName.split(/\./);
    if (path.length > 2 && "CaseExchangeSM_SAW" == templateName) {
        var firstIndex = fieldName.indexOf(".");
        path = [];
        path.push(fieldName.substr(0, firstIndex));
        path.push(fieldName.substr(firstIndex + 1));
    }
    if ("SMPPM" == templateName) {
        path = [fieldName];
    }
    var obj = destObj;
    var i;
    for (i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) {
            obj[path[i]] = {};
        }
        obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = value;
}


function checkPreScriptGrammer(script) {
    var message = null;
    try {
        var checkfunc = new Function('sm', 'ep', 'context', 'param', script);
        checkfunc({}, {}, {}, {});
    } catch (ex) {
        message = ex.toString();
    }
    return message;
}

function checkPostScriptGrammer(script) {
    var message = null;
    try {
        var checkfunc = new Function('mapObj', 'sm', 'ep', 'context', 'param', script);
        checkfunc({}, {}, {}, {}, {});
    } catch (ex) {
        message = ex.toString();
    }
    return message;
}