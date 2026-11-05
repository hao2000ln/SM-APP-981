/* 
 * system.functions
 */

function SMTYPE() {}
SMTYPE.Number = 1;
SMTYPE.Character = 2;
SMTYPE.Datetime = 3;
SMTYPE.Logical = 4;
SMTYPE.Array = 8;
SMTYPE.Structure = 9;
SMTYPE.Expression = 11;

var $str = funcs.str;
var $scmsg = funcs.scmsg;
var $val = funcs.val;
var $evaluate = funcs.evaluate;
var $parse = funcs.parse;
var $tod = funcs.tod;
var $month = funcs.month;
var $year = funcs.year;
var $datemake = funcs.datemake;
var $fduplicate = funcs.fduplicate;
var $cleanup = funcs.cleanup;
var $recordcopy = funcs.recordcopy;

// str
function _str( strArr ) {
    return $str( strArr );
}

function _scmsg( id, classType, subArr ) {
    return $scmsg( id, classType, subArr || [''] );
}

function _val( value, type ) {
    return $val( value, ( type == null ) ? SMTYPE.Number : type );
}

function _evaluate( expr ) {
    return $evaluate( typeof expr == 'string' ? $parse( expr, SMTYPE.Expression )
                : expr );
}

function _parse( value, type ) {
    return $parse( value, type );
}

function _fduplicate( src, target ) {
    target = target || new SCFile();
    $fduplicate( target, src );
    return target;
}

function _fcleanup( file ) {
    return file && $cleanup( file );
}

function _recordcopy( src, target, fieldNames ) {
    $recordcopy( src, fieldNames, target, fieldNames );
    return target;
}

function _tod() {
    return $tod();
}

function _month( date ) {
    return $month( date );
}

function _year( date ) {
    return $year( date );
}

function _datemake( year, month, day, hour, minute, second ) {
    var dt = new SCDatum();
    dt.setType( SMTYPE.Datetime );
    $datemake( dt, year, month || 1, day || 1, hour || 0, minute || 0, second || 0 );
    return dt;
}

function _cleanup( /*vnames*/ ) {
    var arr = [];
    var i = arguments.length;
    while( i-- ) {
        arr[i] = "cleanup(" + arguments[i] + ")";
    }
    if( arr.length > 0 ) {
        _evaluate( arr.join( ';' ) );
    }
}

function _var( /*vnames*/ ) {
    var arr = [];
    var  i = arguments.length;
    while( i-- ) {
        arr[i] = arguments[i] + "=NULL";
    }
    if( arr.length > 0 ) {
        _evaluate( arr.join( ';' ) );
    }
}

function _trimStr( str ) {
    return str && ( str.replace( /(^\s+)|(\s+$)/g, '' ) ) || str;
}

function _updateArr( target, src, i, n ) {
    var slen = src && ( typeof src.length == 'function' && src.length() || src.length ) || 0;
    if( slen > 0 ) {
        n = Math.abs( typeof n != 'number' && slen || n );
        i = ( typeof i == 'number' && i || 0 );
        if( i < 0 ) {
            slen += i + 1;
            i = ( slen - n >= 0 ? slen - n : 0 );
        }else if( i + n < slen ) {
            slen = i + n;
        }
        var tlen = target && target.length - i || 0;
        while( slen-- > i ) {
            target[ tlen + slen ] = src[slen];
        }
    }
    return target;
}

function _arrEquals( arr1, arr2 ) {
    var b = false;
    var len1 = arr1 && ( typeof arr1.length == 'function' && arr1.length() || arr1.length ) || 0,  
        len2 = arr2 && ( typeof arr2.length == 'function' && arr2.length() || arr2.length ) || 0;
    if( len1 == len2 ) {
        b = true;
        for( var i = 0; b && i < len1; i++ ) {
            b = ( arr1[i] === arr2[i] );
        }
    }
    
    return b;
}

function _arrContains( arr, value ) {
    var b = false;
    var len1 = arr && ( typeof arr.length == 'function' && arr.length() || arr.length ) || 0;
    if( len1 > 0 ) {
        for( var i = 0; ! b && i < len1; i++ ) {
            b = ( value === arr[i] );
        }
    }
    return b;
}

function hasIr(){
    var param = getRTEParm('ir_disable');
    return !('1'===param);
}