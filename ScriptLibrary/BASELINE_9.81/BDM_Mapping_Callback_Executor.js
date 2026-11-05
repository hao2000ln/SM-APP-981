
//
//--- variables cache ---------------------------------
//
var util_isArray = lib.BDM_Util.isArray;
var util_getRecordsFromFile = lib.BDM_Util.getRecordsFromFile;
var BDMQueryParser = lib.BQLPARSE.BDMQueryParser;
var createMappingContext = lib.BDM_Mapping.createMappingContext;
var createMappingHandler = lib.BDM_Mapping.createMappingHandler;

//
//--- executor for eval callback ----------------------
//
function createSMBDMExecutor( argsObj, smObj, bdmObj ) {
    var exr = new Executor( argsObj, smObj, bdmObj );
    exr.sm = smObj;
    exr.bdm = bdmObj;
    return exr;
}

function createDefaultExecutor( argsObj, ep1Obj, ep2Obj ) {

    return new Executor( argsObj, ep1Obj, ep2Obj );
}

//
//--- Executor class ---------------------------------
//
function Executor( argsObj, ep1Obj, ep2Obj ) {
    this.argsObj = argsObj;
    if( argsObj.getMappingHandler() ) {
        this.ctx = argsObj.getMappingHandler().mappingContext;
    }
    this.ep1 = ep1Obj;
    this.ep2 = ep2Obj;
}

Executor.prototype._exec = function( expr ) {
    var r = null;
    if( expr != null && expr != '' ) {
        r = eval( expr );
    }
    return ( typeof this.result != 'undefined' ) ? this.result : r;
}

Executor.prototype.isView = function() {
    return this.ctx.isView();
}

Executor.prototype.isCreate = function() {
    return this.ctx.isCreate();
}

Executor.prototype.isUpdate = function() {
    return this.ctx.isUpdate();
}

Executor.prototype.isDelete = function() {
    return this.ctx.isDelete();
}

Executor.prototype.prefix = function( pref ) {
    return ( pref || '' ) + this.argsObj.getFieldValue();
}

Executor.prototype.afterString = function( str ) {
    var astr = null;
    if( str != null && str != '' ) {
        var curValue = this.argsObj.getFieldValue();
        if( typeof curValue == 'string' ) {
            var idx = curValue.indexOf( str );
            if( idx >= 0 ) {
                astr = curValue.substring( idx + str.length );
            }
        }
    }
    return astr;
}

Executor.prototype.beforeString = function( str ) {
    var bstr = null;
    if( str != null && str != '' ) {
        var curValue = this.argsObj.getFieldValue();
        if( typeof curValue == 'string' ) {
            bstr = '';
            var idx = curValue.indexOf( str );
            if( idx > 0 ) {
                bstr = curValue.substring( 0, idx );
            }
        }
    }
    return bstr;
}

Executor.prototype.append = function( str ) {
    return this.argsObj.getFieldValue() + ( str || '' );
}

Executor.prototype.metaInfo = function(metaInfo, value) {
	this.ctx.set(this.argsObj.getEp1Field()+"_"+metaInfo , value);
	return this.argsObj.getFieldValue() ;
}

Executor.prototype.combine = function( delimit ) {
    return this.join.apply( this, arguments );
}

Executor.prototype.join = function( delimit ) {
    var str = null;
    if( arguments.length <= 1 ) {
        str = __arrayJoin( delimit, this.argsObj.getFieldValue() );
    }else {
        str = __arrayJoin( delimit, arguments, 1 );
    }
    return str;
}

Executor.prototype.defaultValueOfCreate = function( defaultValue ) {
    var v = this.argsObj.getFieldValue();
    if( ! v && this.isCreate() ) {
        v = defaultValue;
    }
    return v;
}

Executor.prototype.xmlns = function( xmlnsObj ) { // just an adapter of @xmlns mapping configuration
    return xmlnsObj;
}

Executor.prototype.select = function( fileName, query ) {
    return util_getRecordsFromFile( fileName, query );
}

var defaultBizService;
Executor.prototype.getBizService = function (BizName) {
	if (defaultBizService)
		return defaultBizService;
   defaultBizService = lib.DisplayName.convertNameToId(BizName,"",""); 
   return defaultBizService;
}


function queryHash( smid ) {              
    var url = lib.urlCreator.getURLFromQuery( "probsummary", "number=\""+smid+"\"", "");
    var index = url.indexOf("queryHash");
    return index<0?null:url.substring(index+10); 

}


//
//--- common functions -----------------------------
//

function combine( arr, delimiter ) {
    return __arrayJoin( delimiter, arr );
}

//
//--- assist functions ------------------------------
//

function __arrayJoin( delimit, array, sidx, length ) {
    var str = null;
    var r = util_isArray( array );
    if( r[0] ) {
        delimit = delimit || '';
        sidx = sidx || 0;
        sidx = sidx < 0 ? 0: sidx;
        length = length || r[1];
        length = sidx + length;
        length = ( length < array.length ) ? length : r[1];
        for( var i=sidx; i < length; i++ ) {
            if( array[i] != null ) {
                var ar = util_isArray( array[i] );
                if( ar[0] && ar[1] <= 0 ) { continue; }
                var value = ( ar[0] ? __arrayJoin( delimit, array[i] ) : array[i] );
                if( value != null ) {
                    str = ( str == null ? '' : str )
                            + ( ( str == null ? '' : delimit )  + value );
                }
            }
        }
    }else { // in case argument 'array' is not an array
        str = array;
    }
    return str;
}

