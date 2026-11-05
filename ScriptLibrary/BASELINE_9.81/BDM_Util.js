
function getRecordsFromFile(fileName, query) {

    var file = new SCFile(fileName);
    var rc = "";
    try {
        rc = file.doSelect(query);
        if(rc == RC_SUCCESS) {
            return file;
        }
    }catch(ex) {
        print("exception: " + ex);
    }
    print("error: " + RCtoString(rc));
    return null;

}

function isDirectionMatch( dir1, dir2 ) {
    var b = false;
    if( dir1 && dir2 ) {
        b = ( dir1.charAt( dir1.length - 1 ) == dir2.charAt( dir2.length - 1 )
                || dir1.charAt( 0 ) == dir2.charAt( 0 ) );
    }
    return b;
}

/*
 *@return [true/false, size]
 */
function isArray( obj ) {
    var rt = [false, 0];
    if( obj != null ) {
        rt[0] = ( obj instanceof Array
            || typeof obj.length == 'function' );
        if( rt[0] ) {
            rt[1] = ( obj instanceof Array ? obj.length : obj.length() );
        }
    }
    return rt;
}

/**
 * example:
 * var expr = 'abc, 123'
 *  replaceWith( expr,
                [ /b/g, "B" ],
                [ /2/g, 'B' ]
            )
    expr == 'aBc, 1B3'
 */
function replaceWith( str ) {
    var rs = '';
    if( str && typeof str == 'string' ) {
        rs = str;
        for( var i = 1; i < arguments.length; i++ ) {
            rs = rs.replace( arguments[i][0], arguments[i][1] );
        }
    }else {
        rs = str;
    }
    return rs;
}

function setObjectFieldValue(obj, field, value) {
    if(obj == null || field == null || "" == field) {
        return;
    }else {
        var f = __splitField(field);
        __setFieldValue(obj, f, value);
    }
}

function getObjectFieldValue(obj, field) {
    if(field == null || "" == field) {
        return null;
    }else {
        var value = obj;
        var f = __splitField(field);
        for(var i=0; i<f.length; i++) {
            if(value == null) {
                return null;
            }
            value = __extractValue(value, f[i]);
        }
        return value;
    }
}

function getObjectQFieldValue( xmlObj, QField ) {
    var fields = __splitQField( QField );
    var parentXmlns = new Array();
    var curObj = xmlObj;
    parentXmlns.push( curObj[ '@xmlns' ] );
    return __getObjectQFieldValue( curObj, fields, 0, parentXmlns );
}

function __getArrayObjectQFieldValue( arrObjs, fields, idx, parentXmlns ) {
    var val = null;
    if( arrObjs != null && arrObjs instanceof Array ) {
        for( var n=0; n<arrObjs.length; n++ ) {
            var tempParentXmlns = new Array();
            for( var i=0; i<parentXmlns.length; i++ ) {
                tempParentXmlns[i] = parentXmlns[i];
            }
            var tempVal = null;
            if( idx < fields.length ) {
                tempVal = __getObjectQFieldValue( arrObjs[n], fields, idx, tempParentXmlns );
            }else {
                var fdTemp = fields[ fields.length - 1 ][1];
                if( fdTemp.charAt(0) == '@' ) {
                    tempVal = __getObjectQFieldValue( arrObjs[n], fields, idx, tempParentXmlns );
                }else {
                    tempVal = arrObjs[n][ '$' ];
                }
            }
            if( tempVal != null ) {
                if( val == null) {
                    val = new Array();
                }
                if( tempVal instanceof Array ) {
                    for( var k=0; k<tempVal.length; k++ ) {
                        val.push( tempVal[k] );
                    }
                }else {
                    val.push( tempVal );
                }
            }
        }
    }

    return val;
}

function __getObjectQFieldValue( curObj, fields, idx, parentXmlns ) {
    var val = null;
    var bAttribute = false;
    var x = '';
    for( var i=idx; i<fields.length; i++, idx++ ) {
        var xmlns = '';
        var b = false;
        var sfd2 = __splitPrefixField( fields[i][1] ); // sfd2 = [ 'prefix' , 'fieldName' ]
        var fa = __splitFieldArrayName( sfd2[1] ); // fa = [ 'fieldName', '[0]' ]
        for( x in curObj ) {
            bAttribute = false;
            if( x.charAt(0) == '@' ) {
                bAttribute = true;
            }
            var sfd = __splitPrefixField( x ); // sfd = [ 'prefix' , 'fieldName' ]
            if( sfd[1] == fa[0] ) {
                var objTemp = getObjectFieldValue( curObj, x + fa[1] );
                if( objTemp == null ) {
                    break;
                }

                if( isArray( objTemp )[0] ) {
                    if( idx < fields.length ) {
                        return __getArrayObjectQFieldValue( objTemp, fields, idx + 1, parentXmlns );
                    }
                }

                if( ! bAttribute || sfd[0] != '' ) {
                    xmlns = __getFieldNamespace( objTemp, sfd[0], parentXmlns );
                }else {
                    xmlns = '';
                }

                if( xmlns == fields[i][0] ) {
                    if( ! bAttribute ) {
                        parentXmlns.push( objTemp[ '@xmlns' ] );
                    }
                    curObj = objTemp;
                    b = true;
                    break;
                }

            }
        }

        if( !b ) { // namespace or field is not match
            curObj = null;
            break;
        }

    }

    if( curObj != null ) {
        val = ( bAttribute ? curObj : curObj['$'] );
    }

    return val;
}

function expandPrefixWithNS( xmlnsObj, fieldString ) {
    var rt = '';
    if( xmlnsObj == null || fieldString == null || fieldString == ''  ) {
        rt = fieldString;
    }else {
        var fields = __splitQField( fieldString );
        for( var i=0; i<fields.length; i++ ) {
            var pf = __splitPrefixField( fields[i][1] );
            var bAttribute = pf[1].charAt(0) == '@';
            var ns = '';
            if( fields[i][0] == '' ) {
                if( ! bAttribute || pf[0] != '' ) {
                    ns = __getNamespaceByPrefix( pf[0], xmlnsObj );
                }
            }else {
                ns = fields[i][0];
            }
            rt += ( rt.length > 0 ? '/' : '' )
            + ( bAttribute ? '@' : '' )
            + ( ns != '' ? '{' + ns + '}' : '' )
            + ( bAttribute ? pf[1].substring(1) : pf[1] );
        }
    }
    return rt;
}


////////////////////////////////////////////////////////////////////////

function __extractValue(__value, __field) {
    if(__field == null || "" == __field) {
        return __value;
    }
    var s = __field.indexOf('[');
    var e = __field.indexOf(']');
    if(s >= 0 && e > s) {
        __value = (s==0 ? __value : __value[__field.substring(0, s)]);
        __value = __value[parseInt(__field.substring(s+1, e))];
        if(e >= __field.length) {
            return __value;
        }else {
            return __extractValue(__value, __field.substring(e+1)); //extract multi-dimention array
        }
    }else {
        return __value[__field];
    }
}

function __setFieldValue(obj, f, value, idx) {
    if( obj == null
        || f == null || f.length <= 0 ) {
        return;
    }
    if( typeof idx == 'undefined' ) {
        idx = 0;
    }

    var s = 0, e = 0;
    var field = f[idx];
    do {
        s = field.indexOf( '[' );
        e = field.indexOf( ']' );
        if( s >= 0 && e > s ) {
            if( s > 0 ) {
                var x = field.substring( 0, s );
                if( typeof obj[x] == 'undefined' || obj[x] == null ) {
                    obj[x] = new Array();
                }
                obj = obj[x];
            }
            var k = parseInt( field.substring( s+1, e ) );
            if( e >= field.length - 1 ) {
                __complementArrayValue( obj, k, null );
                if( idx >= f.length - 1 ) {
                    obj[k] = value;
                }else {
                    if( obj[k] == null ) {
                        obj[k] = new Object();
                    }
                    __setFieldValue( obj[k], f, value, idx+1 );
                }
                break;
            }else {
                __complementArrayValue( obj, k, null );
                if( obj[k] == null ) {
                    obj[k] = new Array();
                }
                obj = obj[k];
                field = field.substring( e+1 ); //set multi-dimention array
            }
        }else { //is not an array
            if( idx >= f.length - 1 ) {
                obj[field] = value;
            }else {
                if( typeof obj[field] == 'undefined' || obj[field] == null ) {
                    obj[field] = new Object();
                }
                __setFieldValue( obj[field], f, value, idx+1 );
            }
            break;
        }
    }while( field.length > 0 );

}

function __complementArrayValue( arr, idx, value ) {
    for( var i=arr.length; i<=idx; i++ ) {
        arr.push(value);
    }
}

function __getFieldNamespace( obj, prefix, parentXmlnsArr ) {
    var xmlns = "";
    xmlns = __getNamespaceByPrefix( prefix, obj[ '@xmlns' ] );
    if( xmlns == "" ) {
        for( var i = parentXmlnsArr.length - 1; i >= 0; i-- ) {
            xmlns = __getNamespaceByPrefix( prefix, parentXmlnsArr[i] );
            if( xmlns != "" ) {
                break;
            }
        }
    }
    return xmlns;
}

function __getNamespaceByPrefix( prefix, objXmlns ) {
    var xmlns = "";
    if( objXmlns != null ) {
        if( prefix == '' ) {
            xmlns = objXmlns[ '$' ];
        }else {
            for( var x in objXmlns ) {
                if( x == prefix ) {
                    xmlns = objXmlns[ x ];
                    break;
                }
            }
        }
    }
    return xmlns == null ? "" : xmlns;
}

function __splitField( field ) {
    if( field != null && field != null ) {
        return field.split( /\ *\/\ */ );
    }else {
        return new Array();
    }
}

function __splitQField( fieldString ) {
    var defNS = '';
    var fields = new Array();
    var b = false;
    var bAttribute = false;
    var v = "";
    var p = null;
    for( var i=0; i < fieldString.length; i++ ) {
        var c = fieldString.charAt( i );
        switch( c ) {
            case '@' :
                bAttribute = true;
                break;
            case '{' :
                b = true;
                p = [ defNS, "" ];
                break;
            case '}' :
                b = false;
                p[0] = v;
                v = "";
                break;
            case '/' :
                if( !b ) {
                    v = ( bAttribute ? '@' : '' ) + v;
                    if( p == null ) {
                        p = [ defNS, v ];
                    }else {
                        p[1] = v;
                    }
                    fields.push( p );
                    v = "";
                    p = null;
                    bAttribute = false;
                }else {
                    v += c;
                }
                break;
            default:
                v += c;
        }
    }
    if( v != '' ) {
        v = ( bAttribute ? '@' : '' ) + v;
        if( p == null ) {
            p = [ defNS, v ];
        }else {
            p[1] = v;
        }
        fields.push( p );
    }
    return fields;
}

function __splitPrefixField( field ) {
    var bAttribute = false;
    if( field.charAt(0) == '@' ) {
        bAttribute = true;
        field = field.substring(1);
    }
    var rt = [ '', '' ];
    if( field != null && field != "" ) {
        var fs = field.split( /\ *:\ */ );
        if( fs.length > 1 ) {
            rt[0] = fs[0];
            rt[1] = ( bAttribute ? '@' : '' ) + fs[1];
        }else {
            rt[1] = ( bAttribute ? '@' : '' ) + fs[0];
        }
    }
    return rt;
}

function __splitFieldArrayName( field ) {
    var rt = ['', ''];
    if( field != null && field != '' ) {
        var idx = field.indexOf( '[' );
        if( idx >= 0) {
            rt[0] = field.substring( 0, idx );
            rt[1] = field.substring( idx );
        }else {
            rt[0] = field;
        }
    }
    return rt;
}
