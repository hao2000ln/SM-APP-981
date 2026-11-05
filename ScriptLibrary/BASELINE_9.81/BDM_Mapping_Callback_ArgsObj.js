
//
//--- variables cache ---------------------------
//
var MFN = lib.BDM_Mapping_Constants.FIELDNAME;
var DIRECTION = lib.BDM_Mapping_Constants.DIRECTION;
var BDMTYPES = lib.BDM_Mapping_Constants.BDMTYPES;

var cb_getObjectFieldValue = lib.BDM_Mapping_Callback.__getObjectFieldValue;
var util_isArray = lib.BDM_Util.isArray;

//
//--- args object functions ---------------------
//
function createSMBDMCallbackArgsObject( mappingHandler, mappingEntry, smObj, bdmObj ) {

    var argsObj = new CallbackArgsObject( mappingHandler, mappingEntry, smObj, bdmObj );

    argsObj.getSMObject = function() { return this.getEp1Object(); }
    argsObj.getSMField = function() { return this.getEp1Field(); }
    argsObj.getSMFieldType = function() { return this.getEp1FieldType(); }
    argsObj.getBDMObject = function() { return this.getEp2Object(); }
    argsObj.getBDMField = function() { return this.getEp2Field(); }
    argsObj.getBDMQField = function() { return this.getEp2QField(); }

    //@verride getEp2FieldType
    argsObj.__getEp2FieldType = argsObj.getEp2FieldType;
    argsObj.getEp2FieldType = function() {
        var type = this.__getEp2FieldType();
        return type ? type : BDMTYPES.String;
    }
    argsObj.getBDMFieldType = function() {
        return this.getEp2FieldType();
    }

    argsObj.isSMFieldArray = function() { return mappingEntry.isSMFieldArray(); }

    return argsObj;
}

function createDefaultCallbackArgsObject( mappingHandler, mappingEntry, ep1Obj, ep2Obj ) {

    return new CallbackArgsObject( mappingHandler, mappingEntry, ep1Obj, ep2Obj );
}


//
//--- callback args object ----------------------
//
function CallbackArgsObject( mappingHandler, mappingEntry, ep1Obj, ep2Obj ) {
    this.mappingHandler = mappingHandler;
    this.mappingEntry = mappingEntry;
    this.ep1Obj = ep1Obj;
    this.ep2Obj = ep2Obj;
}

CallbackArgsObject.prototype.getMappingHandler = function() {
    return this.mappingHandler;
}

CallbackArgsObject.prototype.getCallbackFactory = function() {
    return this.mappingEntry.getMappingMetaInfo().getCallbackFactory();
}

CallbackArgsObject.prototype.getEp1Object = function() {
    return this.ep1Obj;
}

CallbackArgsObject.prototype.getEp1FieldType = function() {
    return this.mappingEntry.getProperty( MFN.ep1ObjectFieldType );
}

CallbackArgsObject.prototype.getEp1Field = function() {
    return this.mappingEntry.getProperty( MFN.ep1ObjectField );
}

CallbackArgsObject.prototype.getEp1QField = function() {
    return this.mappingEntry.getProperty( MFN.ep1ObjectQField );
}

CallbackArgsObject.prototype.getEp2Object = function() {
    return this.ep2Obj;
}

CallbackArgsObject.prototype.getEp2FieldType = function() {
    return this.mappingEntry.getProperty( MFN.ep2ObjectFieldType );
}

CallbackArgsObject.prototype.getEp2Field = function() {
    return this.mappingEntry.getProperty( MFN.ep2ObjectField );
}

CallbackArgsObject.prototype.getEp2QField = function() {
    return this.mappingEntry.getProperty( MFN.ep2ObjectQField );
}

CallbackArgsObject.prototype.getDefaultValue = function() {
    var fieldValue = null;
    var bEp1ToEp2 = this.isEp1ToEp2();
    var defaultValue = this.mappingEntry.getDefaultValue();
    if( defaultValue != null ) {
        var defaultValueTranslator = bEp1ToEp2 ? this.getCallbackFactory().getEp2DefaultValueTranslator()
                                        : this.getCallbackFactory().getEp1DefaultValueTranslator();
        fieldValue = defaultValueTranslator.transDefaultValue( defaultValue,
                            bEp1ToEp2 ? this.getEp2FieldType() : this.getEp1FieldType() );
    }
    return fieldValue;
}

CallbackArgsObject.prototype.isEp1BadgerFishStyle = function() {
    return this.mappingEntry.getMappingMetaInfo().isEp1BadgerFishStyle();
}

CallbackArgsObject.prototype.isEp2BadgerFishStyle = function() {
    return this.mappingEntry.getMappingMetaInfo().isEp2BadgerFishStyle();
}

CallbackArgsObject.prototype.isEp1ToEp2 = function() {
    return this.mappingEntry.isEp1ToEp2();
}

CallbackArgsObject.prototype.getFieldValue = function() {

    var bEp1ToEp2 = this.isEp1ToEp2();
    var sField = null;
    var sObj = null;
    var bBadgerFishStyle = false;
    if( bEp1ToEp2 ) {
        bBadgerFishStyle = this.isEp1BadgerFishStyle();
        sField = bBadgerFishStyle ?  this.getEp1QField() : this.getEp1Field();
        sObj = this.getEp1Object();
    }else {
        bBadgerFishStyle = this.isEp2BadgerFishStyle();
        sField = bBadgerFishStyle ? this.getEp2QField() : this.getEp2Field();
        sObj = this.getEp2Object();
    }

    var fieldValue = null;

    if( sField ) {
        fieldValue = cb_getObjectFieldValue( sObj, sField, bBadgerFishStyle );
    }

    if( typeof fieldValue == 'undefined' || fieldValue == null ) {

        fieldValue = this.getDefaultValue();

    }else {
        var valMappingGroup = this.mappingEntry.getProperty( MFN.valueMappingGroup );
        var valueMappingsHandler = this.mappingEntry.getValueMappingHandler();
        if( valMappingGroup != null && valMappingGroup != "" && valueMappingsHandler != null ) {
            var arrCheck = util_isArray( fieldValue );
            if( arrCheck[0] ) {
                var arrTemp2 = new Array();
                for( var j=0; j < arrCheck[1]; j++ ) {
                    arrTemp2[j] = valueMappingsHandler( valMappingGroup, fieldValue[j] );
                }
                fieldValue = arrTemp2;
            }else {
                fieldValue = valueMappingsHandler( valMappingGroup, fieldValue );
            }
        }else {
            fieldValue = this.getCallbackFactory().getValueTranslator().transValue( bEp1ToEp2,
                                fieldValue, this.getEp1FieldType(), this.getEp2FieldType() );
        }
    }

    return fieldValue;
}





