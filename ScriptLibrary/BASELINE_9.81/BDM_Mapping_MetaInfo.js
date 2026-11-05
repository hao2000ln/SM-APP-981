
//
//--- Constants of Ep1 & Ep2 mapping ------------------
//
var FN = lib.BDM_Mapping_Constants.FIELDNAME;
var VFN = lib.BDM_Mapping_Constants.VALUEFIELDNAME;
var DIRECTION = lib.BDM_Mapping_Constants.DIRECTION;
var CFN = lib.BDM_Mapping_Constants.SMBDMFIELDNAME;
var CBF = lib.BDM_Mapping_Constants.CALLBACKFACTORY;
var SM2BDM = DIRECTION.EP1TOEP2;
var BDM2SM = DIRECTION.EP2TOEP1;

//
//--- variables cache --------------------------------
//
var getSMBDMMappingConfig = lib.BDM_Mapping_Config.getSMBDMMappingConfig;
var getCallbackFactory = lib.BDM_Mapping_Callback.getCallbackFactory;
var util_isDirectionMatch = lib.BDM_Util.isDirectionMatch;
var util_expandPrefixWithNS = lib.BDM_Util.expandPrefixWithNS;
var cb_setObjectFieldValue = lib.BDM_Mapping_Callback.__setObjectFieldValue;

var __smbdmMappingMetaInfoCache = lib.Memoize.createCacheObject();


//
//--- MappingMetaInfo class --------------------------
//

function getSMBDMMappingMetaInfo( mappingContext, direction ) {
    
    var objectName = mappingContext.getObjectName();
    var version = mappingContext.getVersion();
    
    var metaInfo = __smbdmMappingMetaInfoCache.get( objectName, version, direction );
    if( ! metaInfo ) {
        metaInfo = __createSMBDMMappingMetaInfo( mappingContext, direction );
        __smbdmMappingMetaInfoCache.cache( objectName, version, direction, metaInfo );
    }

    return metaInfo;
}

function __createSMBDMMappingMetaInfo( mappingContext, direction ) {

    var metaInfo = new MappingMetaInfo( getSMBDMMappingConfig( mappingContext ),
                                        getCallbackFactory( CBF.SMBDM ),
                                        direction, false, true );

    //-- methods of SMBDM meta info -------------
    metaInfo.getBdmMappingMetaObj = function() {
        return this.getMapFieldValueInfo();
    }

    metaInfo.getBdmMappingReverseDirectionMetaObj = function() {
        return this.getMapFieldValueReverseInfo();
    }

    metaInfo.getMappingConfigItemBySmField = function( smField, direction ) {
        return this.mappingConfigObject.getMappingConfigItemBySmField( smField, direction );
    }

    metaInfo.getBdmXmlnsObject = function() {
        return this.getEp2XmlnsObject();
    }

    metaInfo.extractAtomMappingFields = function( ) {
        var atomF = {};
        var atomMappingItems = this.mappingConfigObject.getAtomMapping();
        for( var i=0; i < atomMappingItems.length; i++ ) {
            var atomField = atomMappingItems[i].get_field( CFN.atomObjectField );
            if( atomField != null && atomField != '' ) {
                cb_setObjectFieldValue( atomF, atomField,
                    atomMappingItems[i].get_field( CFN.abdmObjectField ),
                    true );
            }
        }
        return atomF;
    }

    //@override createEntryOfMapping
    metaInfo.createEntryOfMapping = function( mapping, valueMapping ) {

        var entry = this.createDefaultEntryOfMapping( mapping, valueMapping, this.direction );

        entry.isSMFieldArray = function() { return mapping.is_smFieldArray(); }

        return entry;
    }
    
    metaInfo.getMappingConfiguration = function() {
    	return this.mappingConfigObject.getMappingConfiguration();
    	
    }

    return metaInfo;
}

function getDefaultMappingMetaInfo( mappingConfigObject, callbackFactory,
                            direction, bEp1BadgeFishStyle, bEp2BadgeFishStyle ) {

    return new MappingMetaInfo( mappingConfigObject, callbackFactory,
                                    direction, bEp1BadgeFishStyle, bEp2BadgeFishStyle );
}

//
//--- MappingMetaInfo class --------------------------
//
function MappingMetaInfo( mappingConfigObject, callbackFactory,
                            direction, bEp1BadgerFishStyle, bEp2BadgerFishStyle ) {

    this.mappingConfigObject = mappingConfigObject;
    this.callbackFactory = callbackFactory;
    this.direction = direction;
    this.bEp1BadgerFishStyle = bEp1BadgerFishStyle || false;
    this.bEp2BadgerFishStyle = bEp2BadgerFishStyle || false;

    this.mappingEntries = null;
    this.ep1XmlnsObj = null;
    this.ep2XmlnsObj = null;

    this.mapFieldValueInfo = null;
    this.mapFieldValueReverseInfo = null;

}

MappingMetaInfo.prototype.getCallbackFactory = function() {
    return this.callbackFactory;
}

MappingMetaInfo.prototype.isDirectionMatch = function( dir2 ) {
    return util_isDirectionMatch( this.direction, dir2 );
}

MappingMetaInfo.prototype.isEp1ToEp2 = function() {
    return this.isDirectionMatch( DIRECTION.EP1TOEP2 );
}

MappingMetaInfo.prototype.isEp2ToEp1 = function() {
    return this.isDirectionMatch( DIRECTION.EP2TOEP1 );
}

MappingMetaInfo.prototype.reverseDirection = function() {
    var rt = "";
    if( this.isEp1ToEp2() ) {
        rt = DIRECTION.EP2TOEP1;
    }else {
        rt = DIRECTION.EP1TOEP2;
    }
    return rt;
}

MappingMetaInfo.prototype.isEp1BadgerFishStyle = function() {
    return this.bEp1BadgerFishStyle;
}

MappingMetaInfo.prototype.isEp2BadgerFishStyle = function() {
    return this.bEp2BadgerFishStyle;
}

MappingMetaInfo.prototype.getMappingEntries = function() {
    if( this.mappingEntries == null ) {
        this.mappingEntries = this.__extractMappingEntries( this.mappingConfigObject.getMapping(),
                                    this.mappingConfigObject.getValueMapping(), this.direction );
        this.evaluateQFiledOfEntries( this.mappingEntries );
    }
    return this.mappingEntries;
}

MappingMetaInfo.prototype.__extractMappingEntries = function( mappings, valueMapping, direction ) {
    var mappingEntries = null;
    if( mappings ) {
        mappingEntries = new Array();
        for( var i = 0; i < mappings.length; i++ ) {
            var mapDir = mappings[i].get_field( FN.direction );
            if( util_isDirectionMatch( direction, mapDir ) ) {

                var entry = this.createEntryOfMapping( mappings[i], valueMapping );
                mappingEntries.push( entry );

            }
        }
    }

    return mappingEntries;
}

MappingMetaInfo.prototype.createEntryOfMapping = function( mapping, valueMapping ) {
    return this.createDefaultEntryOfMapping( mapping, valueMapping, this.direction );
}

MappingMetaInfo.prototype.createDefaultEntryOfMapping = function( mapping, valueMapping, direction ) {
    var pThis = this;
    var bEp1ToEp2 = util_isDirectionMatch( direction, DIRECTION.EP1TOEP2 );
    var entry = {
        properties : {},
        callback : null,
        defaultValue : pThis.getMappingDefaultValue( mapping, direction ),
        valueMappingHandler : pThis.getValueMappingHandler( valueMapping, direction ),

        getCallback : function() { return this.callback; },
        isEp1ToEp2 : function() { return bEp1ToEp2; },
        getDefaultValue : function() { return this.defaultValue; },
        getValueMappingHandler : function() { return this.valueMappingHandler; },
        getMappingMetaInfo : function() { return pThis; },

        setProperty : function( property, value ) {
            if( property ) {
                this.properties[ property ] = value;
            }
        },
        getProperty : function( property ) {
            return this.properties[ property ];
        }

    };

    var cbField = ( bEp1ToEp2 ? FN.ep2Callback : FN.ep1Callback );
    var callbackLiteral = mapping.get_field( cbField );
    entry.callback = pThis.callbackFactory.getCallback( callbackLiteral );

    entry.setProperty( FN.ep1ObjectField, mapping.get_field( FN.ep1ObjectField ) );
    
    entry.setProperty( FN.ep1ObjectFieldType, mapping.get_field( FN.ep1ObjectFieldType ) );

    entry.setProperty( FN.ep2ObjectField, mapping.get_field( FN.ep2ObjectField ) );

    entry.setProperty( FN.ep2ObjectFieldType, mapping.get_field( FN.ep2ObjectFieldType ) );

    entry.setProperty( FN.valueMappingGroup, mapping.get_field( FN.valueMappingGroup ) );
    
    return entry;
}

MappingMetaInfo.prototype.evaluateQFiledOfEntries = function( entries ) {
    if( entries ) {
        for( var i = 0; i < entries.length; i++ ) {
            var entry = entries[i];
            var metaInfo = entry.getMappingMetaInfo();
            if( metaInfo.isEp1BadgerFishStyle() ) {
                entry.setProperty( FN.ep1ObjectQField,
                        util_expandPrefixWithNS( this.getEp1XmlnsObject(),
                            entry.getProperty( FN.ep1ObjectField ) ) );
            }

            if( metaInfo.isEp2BadgerFishStyle() ) {
                entry.setProperty( FN.ep2ObjectQField,
                        util_expandPrefixWithNS( this.getEp2XmlnsObject(),
                            entry.getProperty( FN.ep2ObjectField ) ) );
            }
        }
    }
    
    return entries;
}

MappingMetaInfo.prototype.getEp1XmlnsObject = function() {
    if( ! this.ep1XmlnsObj ) {
        this.ep1XmlnsObj = this.__getXmlnsObject( DIRECTION.EP2TOEP1 );
    }
    return this.ep1XmlnsObj;
}

MappingMetaInfo.prototype.getEp2XmlnsObject = function() {
    if( ! this.ep2XmlnsObj ) {
        this.ep2XmlnsObj = this.__getXmlnsObject( DIRECTION.EP1TOEP2 );
    }
    return this.ep2XmlnsObj;
}

MappingMetaInfo.prototype.__getXmlnsObject = function( direction ) {
    var xmlnsObj = null;
    var mappings = this.mappingConfigObject.getMapping();
    var bEp1ToEp2 = util_isDirectionMatch( direction, DIRECTION.EP1TOEP2 );
    for( var i = 0; i < mappings.length; i++ ) {
        if( '@xmlns' == mappings[i].get_field( bEp1ToEp2 ? FN.ep2ObjectField : FN.ep1ObjectField )
                && util_isDirectionMatch( direction, mappings[i].get_field( FN.direction ) ) ) {
            var ep1Obj = {};
            var ep2Obj = {};
            var entry = this.createDefaultEntryOfMapping( mappings[i], this.mappingConfigObject.getValueMapping(), direction );
            var argsObj = this.callbackFactory.createArgsObject( null, entry,
                                    ep1Obj, ep2Obj );
            this.callbackFactory.invokeCallback( entry.getCallback(), argsObj );
            xmlnsObj = bEp1ToEp2 ? ep2Obj['@xmlns'] : ep1Obj['@xmlns'];
            break;
        }
    }
    return xmlnsObj;
}

MappingMetaInfo.prototype.getMapFieldValueInfo = function() {
    if( ! this.mapFieldValueInfo ) {

        this.mapFieldValueInfo = this.__extractFieldValueMappingInfo( this.getMappingEntries(), this.direction );

        var bBadgerFishStyle = this.isEp1ToEp2() ? this.isEp1BadgerFishStyle() : this.isEp2BadgerFishStyle();
        if( bBadgerFishStyle ) {
            // set namespace
            this.mapFieldValueInfo['@xmlns'] =
                this.isEp1ToEp2() ? this.getEp1XmlnsObject() : this.getEp2XmlnsObject();
        }
    }
    return this.mapFieldValueInfo;
}

MappingMetaInfo.prototype.__extractFieldValueMappingInfo = function( mappingEntries, direction ) {
    var infoObj = { };
    var bEp1ToEp2 = util_isDirectionMatch( DIRECTION.EP1TOEP2, direction );
    var sField = bEp1ToEp2 ? FN.ep1ObjectField : FN.ep2ObjectField;
    for( var i = 0; i < mappingEntries.length; i++ ) {
        var field = mappingEntries[i].getProperty( sField );
        if( field ) {
            cb_setObjectFieldValue( infoObj, field,
                mappingEntries[i], 
                bEp1ToEp2 ? this.isEp1BadgerFishStyle() : this.isEp2BadgerFishStyle() );
        }
    }
    return infoObj;
}

MappingMetaInfo.prototype.getMapFieldValueReverseInfo = function() {
    if( ! this.mapFieldValueReverseInfo ) {
        var reverseDirection = this.reverseDirection();
        var mappingsTemp = new Array();
        var mappings = this.mappingConfigObject.getMapping();
        var __createDummyConfObj = function( mapping ) {
            var confObj = {};
            for( var x in mapping ) {
                confObj[x] = mapping[x];
            }
            //@override get_field function
            confObj.get_field = function( fieldName ) {
                if( fieldName == FN.direction ) {
                    return reverseDirection;
                }else {
                    return mapping.get_field( fieldName );
                }
            };
            return confObj;
        };
        
        for( var i = 0; i < mappings.length; i++ ) {
            var mapDir = mappings[i].get_field( FN.direction );
            var ns = mappings[i].get_field( this.isEp1ToEp2() ? FN.ep1ObjectField : FN.ep2ObjectField );
            if( ns && ns != '@xmlns'
                    && mapDir && ! this.isDirectionMatch( mapDir ) ) {
                mappingsTemp.push( __createDummyConfObj( mappings[i] ) );
            }
        }
        
        this.mapFieldValueReverseInfo =
            this.__extractFieldValueMappingInfo(
                this.evaluateQFiledOfEntries(
                    this.__extractMappingEntries(
                        mappingsTemp, this.mappingConfigObject.getValueMapping(), reverseDirection ) ) );

        var bBadgerFishStyle = this.isEp1ToEp2() ? this.isEp1BadgerFishStyle() : this.isEp2BadgerFishStyle();
        if( bBadgerFishStyle ) {
            // set namespace
            this.mapFieldValueReverseInfo['@xmlns'] =
                this.isEp1ToEp2() ? this.getEp1XmlnsObject() : this.getEp2XmlnsObject();
        }
    }
    return this.mapFieldValueReverseInfo;
}

MappingMetaInfo.prototype.getMappingDefaultValue = function( mapping, direction ) {
    var defaultValue = "";
    if( util_isDirectionMatch( direction, mapping.get_field( FN.direction ) ) ) {
        if( util_isDirectionMatch( direction, DIRECTION.EP1TOEP2 ) ) {
            defaultValue = mapping.get_field( FN.ep2DefaultValue );
        }else {
            defaultValue = mapping.get_field( FN.ep1DefaultValue );
        }
    }
    return defaultValue;
}

MappingMetaInfo.prototype.getValueMappingHandler = function( valueMappings, direction ) {
    var handler = null;
    if( valueMappings != null && valueMappings.length > 0 ) {
        var s = "";
        var t = "";
        if( util_isDirectionMatch( direction, DIRECTION.EP1TOEP2 ) ) {
            s = VFN.ep1ValueField;
            t = VFN.ep2ValueField;
        }else {
            s = VFN.ep2ValueField;
            t = VFN.ep1ValueField;
        }
        handler = function( groupName, srcValue ) {
            for( var i = 0; i < valueMappings.length; i++ ) {
                if( groupName == valueMappings[i].get_field( VFN.groupField )
                        && valueMappings[i].get_field( s ) == srcValue ) {

                    return valueMappings[i].get_field( t );
                }
            }
            return null;
        }
    }

    return handler;
}


