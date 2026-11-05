//
//--- constants --------------------------------------
//
var DIRECTION = lib.BDM_Mapping_Constants.DIRECTION;
var FN = lib.BDM_Mapping_Constants.SMBDMFIELDNAME;
var VFN = lib.BDM_Mapping_Constants.SMBDMVALUEFIELDNAME;
var SMT = lib.BDM_Mapping_Constants.SMTYPES;
var BDMT = lib.BDM_Mapping_Constants.BDMTYPES;

//
//--- variables cache --------------------------------
//
var util_getRecordsFromFile = lib.BDM_Util.getRecordsFromFile;
var util_isDirectionMatch = lib.BDM_Util.isDirectionMatch;
var util_isArray = lib.BDM_Util.isArray;

var __bdm_sm_field_types = null;
var __smbdmMappingConfigCache = lib.Memoize.createCacheObject();


//
//-- logger --------------------------------------------
//
var log = getLog("BDM_Mapping_Config");


//
//--- Mapping Config functions -----------------------
//
function getSMBDMMappingConfig(mappingContext) {

    var objectName = mappingContext.getObjectName();
    var version = mappingContext.getVersion();

    var mappingConfigObject = __smbdmMappingConfigCache.get(objectName, version);

    if (!mappingConfigObject) {
        mappingConfigObject = __createSMBDMMappingConfig(mappingContext);
        __smbdmMappingConfigCache.cache(objectName, version, mappingConfigObject);
    }

    return mappingConfigObject;
}

function __createSMBDMMappingConfig(mappingContext) {

    var objectName = mappingContext.getObjectName();
    var version = mappingContext.getVersion();

    var _functionName = "__createSMBDMMappingConfig";
    if (log.isInfoEnabled()) {
        log.info("-> " + _functionName + " ...");
        log.info("load mapping config: " + objectName + ", version = " + version);
    }

    var mappingConfigObject = null;

    var bdmmappingFile = util_getRecordsFromFile('bdmmapping',
        'id="' + objectName + '"' + ' and version="' + version + '"');

    if (bdmmappingFile) {

        var mappingFields = {};
        mappingFields[FN.smObjectField] = 'smObjectField';
        mappingFields[FN.smCallback] = 'smCallback';
        mappingFields[FN.smDefaultValue] = 'smDefaultValue';
        mappingFields[FN.bdmObjectField] = 'bdmObjectField';
        mappingFields[FN.bdmObjectFieldType] = 'bdmType';
        mappingFields[FN.bdmCallback] = 'bdmCallback';
        mappingFields[FN.bdmDefaultValue] = 'bdmDefaultValue';
        mappingFields[FN.direction] = 'direction';
        mappingFields[FN.description] = 'description';
        mappingFields[FN.valueMappingGroup] = 'valMappingGroup';

        var valueMappingFields = {};
        valueMappingFields[VFN.groupField] = 'groupName';
        valueMappingFields[VFN.smValueField] = 'smValue';
        valueMappingFields[VFN.bdmValueField] = 'bdmValue';

        mappingConfigObject = new MappingConfig(mappingFields, valueMappingFields);

        //@override getMappingRecords
        mappingConfigObject.getMappingRecords = function() {
            return bdmmappingFile.mappings;
        };

        //@override getValueMappingRecords
        mappingConfigObject.getValueMappingRecords = function() {
            return bdmmappingFile.valuemappings;
        };

        //
        //--- additional functions for SM-BDM mapping ----------
        //
        mappingConfigObject.getFileName = function() {
            return bdmmappingFile.fileName;
        };

        __resetSMBDMMappingItems(mappingConfigObject);

        __readAtomCategories(mappingConfigObject, bdmmappingFile);

        mappingConfigObject.getAtomMapping = function() {
            if (!this.atomMapping) {
                this.atomMapping = __readAtomMapping(mappingConfigObject, bdmmappingFile);
            }
            return this.atomMapping;
        };

        mappingConfigObject.getMappingConfigItemBySmField = function(smField, direction) {
            var mappingConfigItems = this.getMapping();
            if (mappingConfigItems != null) {
                var i;
                for (i = 0; i < mappingConfigItems.length; i++) {
                    var d = mappingConfigItems[i].get_field(FN.direction);
                    if ((d != null && util_isDirectionMatch(d, direction)) &&
                        mappingConfigItems[i].get_field(FN.smObjectField) == smField) {
                        return mappingConfigItems[i];
                    }
                }
            }
            return null;
        };

        mappingConfigObject.getMappingConfiguration = function() {
            var config = {};

            var n = bdmmappingFile.configuration ? bdmmappingFile.configuration.length() : 0;
            var i;
            for (i = 0; i < n; i++) {
                config[bdmmappingFile.configuration[i].cName] = bdmmappingFile.configuration[i].cValue;
            }

            return config;
        };

    }

    return mappingConfigObject;
}

//
//--- MappingConfig class -----------------------------
//
function MappingConfig(mappingFields, valueMappingFields) {
    this.mappingFields = mappingFields;
    this.valueMappingFields = valueMappingFields;
    this.mapping = null;
    this.valueMapping = null;
}

MappingConfig.prototype.getMapping = function() {
    if (!this.mapping) {
        this.mapping = this.extractMappingItems(this.mappingFields,
            this.getMappingRecords());
    }
    return this.mapping;
};

MappingConfig.prototype.getValueMapping = function() {
    if (!this.valueMapping) {
        this.valueMapping = this.extractMappingItems(this.valueMappingFields,
            this.getValueMappingRecords());
    }
    return this.valueMapping;
};

MappingConfig.prototype.extractMappingItems = function(fields, records) {
    var items = null;
    var ar = util_isArray(records);
    if (ar[0]) {
        items = [];
        var i;
        for (i = 0; i < ar[1]; i++) {
            items.push(this.createMappingItem(fields, records[i]));
        }
    }
    return items;
};

MappingConfig.prototype.createMappingItem = function(__fields, __fileRecord) {

    var mappingItem = {
        fields: __fields,
        fileRecord: __fileRecord,

        get_field: function(fieldName) {
            return this.fileRecord[this.fields[fieldName]];
        }
    };

    return mappingItem;
};

MappingConfig.prototype.getMappingRecords = function() {
    return null;
};

MappingConfig.prototype.getValueMappingRecords = function() {
    return null;
};

//
//--- assist functions --------------------------------
//
function __resetSMBDMMappingItems(mappingConfigObject) {
    var mappingItems = mappingConfigObject.getMapping();
    if (mappingItems) {

        var fileName = mappingConfigObject.getFileName();

        var __getFileName = function() {
            return fileName;
        };

        var __trimSMFieldName = function(smObjectField) {
            var fd = smObjectField;
            if (fd == null || fd == '') {
                return false; // undefined
            }
            var idx = fd.indexOf('[');
            if (idx > 0) {
                fd = fd.substring(0, idx);
            }
            return fd;
        };

        var i;
        for (i = 0; i < mappingItems.length; i++) {
            var item = mappingItems[i];
            // add getFileName function
            item.getFileName = __getFileName;

            // add is_smFieldArray function
            item.is_smFieldArray = function() {
                var fd = __trimSMFieldName(this.get_field(FN.smObjectField));
                return __getSMFieldTypes(fileName).isFieldArray(fd);
            };

            //@override get_field
            item.__get_field = item.get_field;
            item.get_field = function(fieldName) {
                if (fieldName == FN.smObjectFieldType) {
                    var fd = __trimSMFieldName(this.get_field(FN.smObjectField));
                    return __getSMFieldTypes(this.getFileName()).getFieldType(fd);
                } else {
                    var r = this.__get_field(fieldName); // invoke original get_field
                    if (!r && fieldName == FN.bdmObjectFieldType) {
                        r = BDMT.String; // default type is String
                    }
                    return r;
                }
            };
        } //for
    }
}

function __readAtomMapping(mappingConfigObject, file) {
    var mappingItems = null;
    if (file.atommappings != null) {

        var fieldNames = {};
        fieldNames[FN.abdmObjectField] = 'asmObjectField';
        fieldNames[FN.atomObjectField] = 'atomObjectField';
        fieldNames[FN.atomObjectFieldType] = 'atomType';

        var atomConfig = new MappingConfig(fieldNames, null);

        atomConfig.getMappingRecords = function() {
            return file.atommappings;
        };

        mappingItems = atomConfig.getMapping();
        if (mappingItems) {
            var i;
            for (i = 0; i < mappingItems.length; i++) {
                var item = mappingItems[i];
                //@verride get_field
                item.__get_field = item.get_field;
                item.get_field = function(fieldName) {
                    if (fieldName == FN.direction) {
                        return DIRECTION.BOTH;
                    } else {
                        return this.__get_field(fieldName);
                    }
                };
            }
        }
    }

    return mappingItems;
}

function __readAtomCategories(mappingConfigObject, file) {
    if (file.atomcategories != null) {
        mappingConfigObject.atomCategories = file.atomcategories.toArray();
        if (log.isDebugEnabled()) {
            log.debug("load configObject.atomCategories = " + JSON.stringify(mappingConfigObject.atomCategories));
        }
    } else {
        mappingConfigObject.atomCategories = [];
    }
}

function __getSMFieldTypes(fileName) {
    var _functionName = "__getSMFieldTypes";
    if (__bdm_sm_field_types == null) {
        if (log.isInfoEnabled()) {
            log.info("init __bdm_sm_field_types ...");
        }
        __bdm_sm_field_types = {
            getFieldTypes: function(__fileName) {
                if (typeof this[__fileName] != 'undefined' && this[__fileName] != null) {
                    return this[__fileName];
                }
                return null;
            }
        };
    }
    var smFieldTypes = __bdm_sm_field_types.getFieldTypes(fileName);
    if (smFieldTypes == null) {
        if (log.isInfoEnabled()) {
            log.info("load smFieldTypes, fileName = " + fileName);
        }
        var file = util_getRecordsFromFile('dbdict', 'name="' + fileName + '"');
        if (file.field != null) {
            smFieldTypes = {
                fieldTypes: {},

                getFieldType: function(__field) {
                    var ft = this.__getFieldType(__field);
                    if (ft != null) {
                        return ft[0];
                    }
                    return -1;
                },

                isFieldArray: function(__field) {
                    var ft = this.__getFieldType(__field);
                    if (ft != null) {
                        return ft[1];
                    }
                    return false;
                },

                __getFieldType: function(__field) {
                    if (__field != '' && null != __field) {
                        return this.fieldTypes[__field];
                    }
                    return null;
                },

                __setFieldType: function(__field, type) {
                    if (__field != '' && null != __field) {
                        var ft = this.__getFieldType(__field);
                        if (ft == null) {
                            ft = [-1, false];
                            this.fieldTypes[__field] = ft;
                        }
                        if (type == SMT.Array) {
                            ft[1] = true;
                        } else {
                            ft[0] = type;
                        }
                    }
                }
            };

            var i;
            var length = file.field.length();
            for (i = 0; i < length; i++) {
                var type = file.field[i].type;
                if (SMT.Structure == type) {
                    continue;
                }
                smFieldTypes.__setFieldType(file.field[i].name, type);
            }
            __bdm_sm_field_types[fileName] = smFieldTypes;
        }
    }

    return smFieldTypes;
}