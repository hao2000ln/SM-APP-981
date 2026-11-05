
//
//--- constans -----------------------------
//
var SMT = lib.BDM_Mapping_Constants.SMTYPES;
var BDMT = lib.BDM_Mapping_Constants.BDMTYPES;


//
//--- variables cache ----------------------
//
var util_isArray = lib.BDM_Util.isArray;


//
//--- translator functions -----------------
//
function getSMBDMTranslator() {

    var translator = createDefaultTranslator();

    translator[ SMT.Character + '->' + BDMT.Number ] = 
    translator[ SMT.Number + '<-' + BDMT.String ] = function( value ) {
        return value ? Number( value ) : null ;
    }

    translator[ SMT.Number + '->' + BDMT.String ] =
    translator[ SMT.Character + '<-' + BDMT.Number ] = function( value ) {
        return value != null ? String( value ) : value ;
    }
    translator[ SMT.Number + '<-' + BDMT.Number ] = function( value ) {
        return value != null ? Number( value ) : null;
    }

    translator[ SMT.Logical + '->' + BDMT.String ] = function( value ) {
        return value == null ? null : ( value ? "true" : "false" );
    }

    translator[ SMT.Logical + '<-' + BDMT.String ] = function( value ) {
        return __transStrToBoolean( value );
    }

    translator[ SMT.Character + '->' + BDMT.Datetime ] = function( value ) {
        if( value ) {
            var dt = new Date( value );
            var y = dt.getYear();
            if( y < 100 ) {
                dt.setFullYear( Math.floor( new Date().getFullYear() / 100 ) * 100 + y );
            }
            value = new XMLDate( dt ).getISODateTimeString();
        }
        return value;
    }
    
    translator[ SMT.Datetime + '->' + BDMT.Datetime ] = function( value ) {
        return value != null && value != ""
                ? new XMLDate( value ).getISODateTimeString() : null ;
    }

    translator[ SMT.Datetime + '<-' + BDMT.String ] =
    translator[ SMT.Datetime + '<-' + BDMT.Datetime ] = function( value ) {
        if( value ) {
            value = new XMLDate( value ).getDate();
        }else {
            value = null;
        }
        return  value;
    }
    
    return translator;
}

function getSMDefaultValueTranslator() {

    var dvt = createDefaultValueTranslator();

    dvt[ '->' + SMT.Datetime ] = function( value ) {
        if( value ) {
            var d = new Datum();
            d.setType( SMT.Datetime );
            d.setValue( value );
            value = d;
        }
        return  value;
    }

    dvt[ '->' + SMT.Number ] = function( value ) {
        return value ? Number( value ) : null ;
    }

    dvt[ '->' + SMT.Logical ] = function( value ) {
        return __transStrToBoolean( value );
    }

    return dvt;

}

function getBDMDefaultValueTranslator() {

    var dvt = createDefaultValueTranslator();

    dvt[ '->' + BDMT.Number ] = function( value ) {
        return value ? Number( value ) : null ;
    }

    return dvt;

}

function getDefaultTranslator() {
    var translator = createDefaultTranslator();

    translator[ BDMT.String + '->' + BDMT.Number ] =
    translator[ BDMT.Number + '<-' + BDMT.String ] = function( value ) {
        return value ? Number( value ) : null ;
    }

    return translator;
}

function getDefaultValueTranslator() {
    return createDefaultValueTranslator();
}

function createDefaultTranslator() {
    var translator = {
        transValue : function( bEp1ToEp2, value, ep1Type, ep2Type ) {
            var tval = null;
            var tf = ep1Type + ( bEp1ToEp2 ? "->" : "<-" ) + ep2Type;
            var __f = this[tf];
            if( ! __f || typeof __f != 'function' ) {
                __f = this._default;
            }

            var arrCheck = util_isArray( value );
            if( arrCheck[0] ) {
                tval = new Array();
                for( var i = 0; i < arrCheck[1]; i++ ) {
                    tval[i] = __f.apply( this, [ value[i] ] );
                }
            }else {
                tval = __f.apply( this, [value] );
            }

            return tval;
        },

        _default : function( value ) {
            return value;
        }
    };

    return translator;
}

function createDefaultValueTranslator() {
    return {
        transDefaultValue : function( defaultValue, targetType ) {
            var tf = '->' + targetType;
            var __f = this[ tf ];
            if( ! __f || typeof __f != 'function' ) {
                __f = this._default;
            }

            return __f.apply( this, [ defaultValue ] );
        },

        _default : function( value ) {
            return value;
        }
    }
}

//
//--- assist functions --------------------------------
//

function __transStrToBoolean( str ) {
    str = str.toLowerCase();
    return "false" == str ? false : true;
}
