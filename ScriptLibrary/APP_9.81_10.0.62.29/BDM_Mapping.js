
//
//--- variables cache ----------------------------------
//
var DIRECTION = lib.BDM_Mapping_Constants.DIRECTION;
var MFN = lib.BDM_Mapping_Constants.FIELDNAME;
var CFN = lib.BDM_Mapping_Constants.SMBDMFIELDNAME;
var SMT = lib.BDM_Mapping_Constants.SMTYPES;
var SM2BDM = DIRECTION.EP1TOEP2;
var BDM2SM = DIRECTION.EP2TOEP1;
var ATOM2BDM = DIRECTION.EP2TOEP1;

var getSMBDMMappingMetaInfo = lib.BDM_Mapping_MetaInfo.getSMBDMMappingMetaInfo;
var getSMBDMMappingConfig = lib.BDM_Mapping_Config.getSMBDMMappingConfig;
var cb_setObjectFieldValue = lib.BDM_Mapping_Callback.__setObjectFieldValue;
var cb_getObjectFieldValue = lib.BDM_Mapping_Callback.__getObjectFieldValue;
var util_expandPrefixWithNS = lib.BDM_Util.expandPrefixWithNS;
var util_getObjectQFieldValue = lib.BDM_Util.getObjectQFieldValue;
var util_getObjectFieldValue = lib.BDM_Util.getObjectFieldValue;
var util_isArray = lib.BDM_Util.isArray;
var util_getRecordsFromFile = lib.BDM_Util.getRecordsFromFile;

var __default_version = '1.0';

//
//--- mapping handle functions --------------------------
//
function createMappingContext() {
    return {
        CREATE : 1, UPDATE : 2, DELETE : 4, VIEW : 8,

        properties : {},
        operation : this.VIEW,
        version : __default_version,
        objectName : '',

        setOperation : function( opr ) { this.operation = opr; },
        isCreate : function() { return this.__isOperation( this.CREATE ); },
        isUpdate : function() { return this.__isOperation( this.UPDATE ); },
        isDelete : function() { return this.__isOperation( this.DELETE ); },
        isView : function() { return this.__isOperation( this.VIEW ); },
        __isOperation : function( opr ) { return ( opr & this.operation ) != 0; },

        setVersion : function( v ) { this.version = v; },
        getVersion : function() { return this.version; },

        setObjectName : function( name ) { this.objectName = name; },
        getObjectName : function() { return this.objectName; },

        setActivityLog : function( actLog ) { this.set( 'activity_log', actLog ); },
        getActivityLog : function() { return this.get( 'activity_log' ); },

        set : function( key, value ) {
            if( key ) {
                this.properties[ key ] = value;
            }
        },

        get : function( key ) {
            var v = null;
            if( key ) {
                v = this.properties[ key ];
            }
            return v;
        },
        
        getMappingConfiguration : function() {
        	return this.get('mappingConfiguration');
        },
        
        setMappingConfiguration : function(mConfig) {
        	this.set('mappingConfiguration',mConfig)
        }
        
        
    };
}

function createMappingHandler( mappingContext ) {
    if( ! mappingContext ) {
        mappingContext = createMappingContext();
    }

    var handler = __createMappingHandler( mappingContext );

    //@override getMappingMetaInfo
    handler.getMappingMetaInfo = function( direction ) {
        var ret =  getSMBDMMappingMetaInfo( mappingContext, direction );
        //populate the mapping configuration
        mappingContext.setMappingConfiguration(ret.getMappingConfiguration());
        
        return ret;
    }

    handler.SMToBDMList = function( smObjList ) {
        var objectName = this.mappingContext.getObjectName();
        var list = objectName + "-list";
        
        //eval( "var o = { \"" + list + "\" : {\"" + objectName + "\" : [] } }" );
        var o = {};
        var objTemp = {};
        objTemp[objectName] = [];
        o[list] = objTemp;

        for( var smObj in smObjList ) {
            o[list][objectName].push( this.smObject2bdmObject( smObjList[ smObj ] ) );
        }

        return o;
    }

    handler.SMToBDM = function( smObj ) {
        var bdmObj = {};
        var objectName = this.mappingContext.getObjectName();
        bdmObj[objectName] = this.smObject2bdmObject( smObj );

        return bdmObj;
    }

    handler.smObject2bdmObject = function( smObj ) {
        return this.transEp1ToEp2Object( smObj );
    }

    handler.bdmObject2smObject = function( bdmObj ) {
        return this.transEp2ToEp1Object( bdmObj );
    }

    handler.SMFileForEntity = function() {
        return this.getMappingMetaInfo( SM2BDM ).mappingConfigObject.getFileName();
    }

    handler.map2smField = function( bdmField, bIgnoreDirection ) {
        if( bIgnoreDirection == null ) {
            bIgnoreDirection = false;
        }
        return this.mapFieldFromEp2ToEp1( bdmField, bIgnoreDirection );
    }

    /*
     * This function will return an array with 2 values:
     * arr[0]: the mapping field
     * arr[1]: the mapping field's value
     */
    handler.map2smFieldValue = function( bdmField, bdmFieldValue, bIgnoreDirection ) {
        if( bIgnoreDirection == null ) {
            bIgnoreDirection = false;
        }
        return this.mapFieldValueFromEp2ToEp1( bdmField, bdmFieldValue, bIgnoreDirection );
    }

    handler.getMappingConfigItemBySmField = function( smField, direction ) {
        return this.getMappingMetaInfo( direction )
                        .getMappingConfigItemBySmField( smField, direction );
    }

    handler.extractAtomMappingFields = function( ) {
        return this.getMappingMetaInfo( ATOM2BDM ).extractAtomMappingFields();
    }


    return handler;
}

function __createMappingHandler( _mappingContext ) {

    return {

        mappingContext : _mappingContext,

        getMappingMetaInfo : function( direction ) {
            throw "getMappingMetaInfo() not implemented";
        },

        transEp1ToEp2Object : function( ep1Obj ) {
            var mappingMetaInfo = this.getMappingMetaInfo( DIRECTION.EP1TOEP2 );
            return this.transToTargetObject( ep1Obj, mappingMetaInfo );
        },

        transEp2ToEp1Object : function( ep2Obj ) {
            var mappingMetaInfo = this.getMappingMetaInfo( DIRECTION.EP2TOEP1 );
            return this.transToTargetObject( ep2Obj, mappingMetaInfo );
        },

        transToTargetObject : function( srcObj, mappingMetaInfo ) {
            var targetObj = null;
            var bEp1ToEp2 = mappingMetaInfo.isEp1ToEp2();
            var mappingEntries = mappingMetaInfo.getMappingEntries();
            if( mappingEntries ) {
                targetObj = {};
                var callbackFactory = mappingMetaInfo.callbackFactory;
                for( var i = 0; i < mappingEntries.length; i++ ) {
                    var argsObj = callbackFactory.createArgsObject( this, mappingEntries[i],
                                    bEp1ToEp2 ? srcObj : targetObj,
                                    bEp1ToEp2 ? targetObj : srcObj );

                    callbackFactory.invokeCallback( mappingEntries[i].getCallback(), argsObj );
                }
            }
            return targetObj;
        },

        mapFieldFromEp1ToEp2 : function( ep1Field, bIgnoreDirection ) {
            return this.mapFieldValueFromEp1ToEp2( ep1Field, null, bIgnoreDirection )[0];
        },

        mapFieldValueFromEp1ToEp2 : function( ep1Field, ep1FieldValue, bIgnoreDirection ) {
            var mappingMetaInfo = this.getMappingMetaInfo( DIRECTION.EP1TOEP2 );
            return this.mapToTargetFieldValue( mappingMetaInfo, bIgnoreDirection, ep1Field, ep1FieldValue );
        },

        mapFieldFromEp2ToEp1 : function( ep2Field, bIgnoreDirection ) {
            return this.mapFieldValueFromEp2ToEp1( ep2Field, null, bIgnoreDirection )[0];
        },

        mapFieldValueFromEp2ToEp1 : function( ep2Field, ep2FieldValue, bIgnoreDirection ) {
            var mappingMetaInfo = this.getMappingMetaInfo( DIRECTION.EP2TOEP1 );
            return this.mapToTargetFieldValue( mappingMetaInfo, bIgnoreDirection, ep2Field, ep2FieldValue );
        },

        mapToTargetFieldValue : function( mappingMetaInfo, bIgnoreDirection, srcField, srcFieldValue ) {
            var rtArr = [ '', null ]; // [0]:field, [1]:value
            var bEp1ToEp2 = mappingMetaInfo.isEp1ToEp2();
            var bBadgerFishStyle = bEp1ToEp2 ? mappingMetaInfo.isEp1BadgerFishStyle()
                                        : mappingMetaInfo.isEp2BadgerFishStyle();
            if( bBadgerFishStyle ) {
                srcField = util_expandPrefixWithNS( 
                            bEp1ToEp2 ? mappingMetaInfo.getEp1XmlnsObject() : mappingMetaInfo.getEp2XmlnsObject(),
                            srcField );
            }
            
            var infoObj = mappingMetaInfo.getMapFieldValueInfo();
            var mappingEntry = bBadgerFishStyle ? util_getObjectQFieldValue( infoObj, srcField )
                                : util_getObjectFieldValue( infoObj, srcField );
            if( mappingEntry == null && bIgnoreDirection ) {
                var reverseInfoObj = mappingMetaInfo.getMapFieldValueReverseInfo();
                mappingEntry = bBadgerFishStyle ? util_getObjectQFieldValue( reverseInfoObj, srcField )
                                : util_getObjectFieldValue( reverseInfoObj, srcField );
            }
            if( mappingEntry != null ) {
                rtArr[0] = mappingEntry.getProperty( 
                            bEp1ToEp2 ? ( mappingMetaInfo.isEp2BadgerFishStyle() ? MFN.ep2ObjectQField : MFN.ep2ObjectField )
                                : ( mappingMetaInfo.isEp1BadgerFishStyle() ? MFN.ep1ObjectQField : MFN.ep1ObjectField ) );
                if( srcFieldValue != null ) {
                    this.__mapToTargetValue( mappingMetaInfo, rtArr, mappingEntry,
                                mappingEntry.getProperty( bEp1ToEp2 ? MFN.ep1ObjectField : MFN.ep2ObjectField ),
                                srcFieldValue );
                }
            }

            return rtArr;
        },

        __mapToTargetValue : function( mappingMetaInfo, rtArr, mappingEntry,
                                srcField, srcFieldValue ) {

            var ep1Obj = {};
            var ep2Obj = {};
            var bEp1ToEp2 = mappingEntry.isEp1ToEp2();
            if( bEp1ToEp2 ) {
                cb_setObjectFieldValue( ep1Obj, srcField,
                    srcFieldValue, mappingMetaInfo.isEp1BadgerFishStyle() );
                // set namespace
                if( mappingMetaInfo.isEp1BadgerFishStyle() ) {
                    cb_setObjectFieldValue( ep1Obj,
                        '@xmlns', mappingMetaInfo.getEp1XmlnsObject() );
                }
            }else {
                cb_setObjectFieldValue( ep2Obj, srcField,
                    srcFieldValue, mappingMetaInfo.isEp2BadgerFishStyle() );
                // set namespace
                if( mappingMetaInfo.isEp2BadgerFishStyle() ) {
                    cb_setObjectFieldValue( ep2Obj,
                        '@xmlns', mappingMetaInfo.getEp2XmlnsObject() );
                }
            }
            
            var callbackFactory = mappingMetaInfo.callbackFactory;
            var argsObj = callbackFactory.createArgsObject( this, mappingEntry,
                                ep1Obj, ep2Obj );

            callbackFactory.invokeCallback( mappingEntry.getCallback(), argsObj );

            if( bEp1ToEp2 ) {
                rtArr[1] = cb_getObjectFieldValue( ep2Obj, mappingEntry.getProperty( MFN.ep2ObjectField ),
                                    mappingMetaInfo.isEp2BadgerFishStyle() );
            }else {
                rtArr[1] = cb_getObjectFieldValue( ep1Obj, mappingEntry.getProperty( MFN.ep1ObjectField ),
                                    mappingMetaInfo.isEp1BadgerFishStyle() );
            }

        }

    }; // end of return

}


//
//-- miscellaneous functions ---------------------------
//
function loadSMFieldNames( fileName ) {
    var fields = [];
    if( fileName ) {
        var file = util_getRecordsFromFile( 'dbdict', 'name="' + fileName + '"' );
        if( file != null && file.field != null ) {
            for( var i=0; i < file.field.length(); i++ ) {
                var type = file.field[i].type;
                if( SMT.Structure == type
                    ||  SMT.Array == type ) {
                    continue;
                }
                __push( fields, file.field[i].name );
            }
        }
    }

    var fs = new SCDatum();
    fs.setType( SMT.Array ); // as array
    if( fields.length > 0 ) {
        fs.push( "[" + fileName + "]" );
        var sn = '---';
        for( var k = fileName.length; k >= 0; k-- ) {
            sn += '-';
        }
        fs.push( sn );
        for( var j=0; j < fields.length; j++ ) {
            fs.push( fields[j] );
        }
    }

    return fs;
}

function __push( array, value ) {
    if( array.length == 0 ) {
        array.push( value );
        return;
    }
    var v0 = ( value ? value.toLowerCase() : '' ); // ignore upper or lower case
    var idx = 0;
    var s = 0, e = array.length;
    do {
        idx = Math.floor( ( s + e ) / 2 );
        var v1 = ( array[idx] ? array[idx].toLowerCase() : '' );
        if( v1 > v0 ) {
            if( e == idx ) break;
            e = idx;
        }else {
            if( s == idx ) {
                idx++;
                break;
            }
            s = idx;
        }
    }while( e > s );

    array.push( '' );
    for( var i = array.length - 1; i >= idx ; i-- ) {
        array[i] = array[ i-1 ];
    }

    array[idx] = value;
}

function isSMFieldType_Number( mapping ) {
    return SMT.Number == mapping.get_field( CFN.smObjectFieldType );
}

function isSMFieldType_String( mapping ) {
    return SMT.Character == mapping.get_field( CFN.smObjectFieldType );
}

function isSMFieldType_Datetime( mapping ) {
    return SMT.Datetime == mapping.get_field( CFN.smObjectFieldType );
}

function isSMFieldType_Boolean( mapping ) {
    return SMT.Logical == mapping.get_field( CFN.smObjectFieldType );
}
