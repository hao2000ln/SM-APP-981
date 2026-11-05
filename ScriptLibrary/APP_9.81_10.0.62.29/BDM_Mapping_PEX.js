
//
//-- cache for improving performance ------------------
//
var util_replaceWith = lib.BDM_Util.replaceWith;


//
//--- pattern & parse functions -----------------------
//
function getParseProcessor( expr ) {
    return __parseExpr( expr );
}

var ID = '[A-Za-z\\$_][\\$A-Za-z\\d_]*';
var FIELD = '\\.' + ID + '(((:)' + ID + ')|(' + ID + ')*)(\\[\\d+\\])*';

var EX1 = __EX( [ '\\$(', [ "id", ID ], ')',
                    '(', [ "field", '(' + FIELD + ')+' ], ')',
                    '(', [ "right", '[^\\[]|$' ], ')'
                ] );

var EX2 = __EX( [ '\\$\\{(', [ "ex0", '[^\\}]*' ], ')\\}' ] );

function __ex0( ex ) {
    return __EX( [ '(', [ "left", '.*' ], ')(', [ "middle", ex ], ')(', [ "right", '.*' ], ')' ] );
}

function __exq( q ) {
    return __EX( [ '(', [ "left", '[^' + q + ']*' ], ')',
                    q + '(', [ "middle", '[^' + q + ']*' ], ')' + q,
                    '(', [ "right", '.*' ], ')' ] );
}

var EX10 = __ex0( EX1 );
EX10.processPerformed = function( p, context ) {
    var parser = null;
    if( p.isMatch() ) {
        parser = __createParser10( p.ev( 'middle/id' ),
                        p.ev( 'middle/field' ),
                        p.ev( 'middle/right' ),
                        context ? context.bString : true );
        var pEX10 = __P( EX10 );
        __next( parser, pEX10.parse( p.ev( 'right' ), context ) );
        parser = __pre( pEX10.parse( p.ev( 'left' ), context ), parser );
    }else {
        parser = __createParser0( p.getExpr() );
    }
    return parser;
}

var EXq1 = __exq( "'" );
var EXq2 = __exq( '"' );
EXq1.processPerformed =
EXq2.processPerformed = function( p, context ) {
    var parser = null;
    var pEXq = __P( this == EXq1 ? EXq2 : EXq1 );
    var p2 = ( context ? context.p2 : null );
    var _f = function( _p ) {
        var q = ( _p.getEX() == EXq1 ? "'" : '"' );
        parser = __P( EX20 ).parse( _p.ev( 'middle' ) );
        __next( parser, __createParser0( q ) );
        __next( parser, __P( _p.getEX() ).parse( _p.ev( 'right' ) ) );
        parser = __pre( __createParser0( q ), parser );
        parser = __pre( __P( EX10 ).parse( _p.ev( 'left' ), { 'bString' : false } ), parser );
    };
    if( p.isMatch() ) {
        if( context ) {
            var p0 = p;
            if( p2 ) {
                var left1 = p.ev( 'left' );
                var left2 = p2.ev( 'left' );
                p0 = ( ( left1 ? left1.length : 0 ) < ( left2 ? left2.length : 0 ) ? p : p2 );
            }
            _f( p0 );
        }else {
            parser = pEXq.parse( p.getExpr(), { 'p2' : p } );
        }
    }else {
        if( context ) {
            if( p2 ) {
                _f( p2 );
            }else { // p2 not match
                parser = __P( EX10 ).parse( p.getExpr(), { 'bString' : false } );
            }
        }else {
            parser = pEXq.parse( p.getExpr(), { 'p2' : null } ); // p2 not match
        }
    }

    return parser;
}

var EX20 = __ex0( EX2 );
EX20.processPerformed = function( p, context ) {
    var parser = null;
    var pEX10 = __P( EX10 );
    if( p.isMatch() ) {
        parser = __createParser20( p.ev( 'middle/ex0' ) );

        __next( parser, pEX10.parse( p.ev( 'right' ) ) );
        parser = __pre( __P( EX20 ).parse( p.ev( 'left' ) ), parser );

    }else {
        parser = pEX10.parse( p.getExpr() );
    }

    return parser;
}

function __pre( pre, cur ) {
    if( pre ) {
        var p = cur;
        while( p.last ) {
            p = p.last;
        }
        while( pre.next ) {
            pre = pre.next;
        }
        pre.next = p;
        p.last = pre;
        while( cur.last ) { // go to the head of the list
            cur = cur.last;
        }
    }
    return cur;
}

function __next( cur, next ) {
    if( next ) {
        while( cur.next ) {
            cur = cur.next;
        }
        while( next.last ) {
            next = next.last;
        }
        cur.next = next;
        next.last = cur;
        while( cur.next ) { // go to the end of the list
            cur = cur.next;
        }
    }
    return cur;
}

function __compact( parser ) {
    var executor = {
        b : false,
        _exec : function() { this.b = true; }
    }
    var _p = function( expr ) {
        return {
            process : function() { return expr; }
        }
    }
    var p0 = null;
    var b0 = false;
    while( parser ) {
        executor.b = false;
        var v = parser.process( executor );
        if( ! executor.b ) {
            if( p0 ) {
                if( b0 ) {
                    v = p0.process() + v;
                    var ptmp = _p( v );
                    if( p0.last ) {
                        p0.last.next = ptmp;
                        ptmp.last = p0.last;
                    }
                    p0 = ptmp;
                }else {
                    p0.next = parser;
                    parser.last = p0;
                    p0 = parser;
                }
            }else {
                p0 = parser;
            }

            b0 = true;

        }else {
            if( p0 ) {
                p0.next = parser;
                parser.last = p0;
                p0 = parser;
            }else {
                p0 = parser;
            }

            b0 = false;
        }

        parser = parser.next;
    }

    while( p0.last ) { // go back to head
        p0 = p0.last;
    }

    return p0;
}

function __protectKeys( expr ) {
    return util_replaceWith( expr,
                [ /\\\$/g, "`\0`" ],    // \$ -> `\0`
                [ /\.\$/g, "`.\0`" ],   // .$ -> `.\0`
                [ /\\\}/g, "`r\0`" ],   // \} -> `r\0`
                [ /\\'/g, "`q`" ],      // \' -> `q`
                [ /\\"/g, "`o`" ],       // \" -> `o`
                [ /\r/g, "`\\r`" ],      // \r -> `\r`
                [ /\n/g, "`\\n`" ]       // \n -> `\n`
            );
}

function __restoreKeys( expr ) {
    return util_replaceWith( expr,
                [ /`\.\0`/g, ".$" ],    // `.\0` -> .$
                [ /`\0`/g, "$" ],       // `\0` -> $
                [ /`r\0`/g, "}" ],       // `r\0` -> }
                [ /`q`/g, "\\'" ],      // `q` -> \'
                [ /`o`/g, '\\"' ],       // `o` -> \"
                [ /`\\r`/g, "\r" ],      // `\r` -> \r
                [ /`\\n`/g, "\n" ]       // `\n` -> \n
            );
}

function __protectQuote( expr ) {
    return util_replaceWith( expr,
                [ /'/g, "`q1`" ],
                [ /"/g, "`q2`" ]
            );
}

function __restoreQuote( expr ) {
    return util_replaceWith( expr,
                [ /`q1`/g, "'" ],
                [ /`q2`/g, '"' ]
            );
}

function __change$2this( expr ) {
    return util_replaceWith( expr, [ /\$/g, "this." ] );
}

function __preparse( expr ) {

    var ex20 = __ex0( EX2 );
    ex20.processPerformed = function( p, context ) {
        var parser = null;
        if( p.isMatch() ) {
            var v = __protectQuote( p.ev( 'middle/ex0' ) );
            parser = {
                process : function() {
                    return v;
                }
            };
            parser = __pre( { process : function(){ return '${'; } }, parser );
            parser = __pre( __P( ex20 ).parse( p.ev( 'left' ) ), parser );
            __next( parser, { process : function(){ return '}'; } } );
            __next( parser, __P( ex20 ).parse( p.ev( 'right' ) ) );

        }else {
            parser = {
                process : function() {
                    return p.getExpr();
                }
            };
        }

        return parser;
    }

    var parser = __P( ex20 ).parse( expr );
    var e = '';
    while( parser ) {
        e += parser.process();
        parser = parser.next;
    }

    return e;
}

function __parseExpr( expr ) {
    var p = __P( EXq1 );
    return __compact( p.parse( __preparse( __protectKeys( expr ) ) ) );
}

function __createParser0( expr ) {
    expr = __change$2this( expr );
    return {
        process : function() {
            return expr;
        }
    };
}

function __createParser10( id, fields, r, bString ) {
    r = r || '';
    bString = ( bString == false ? false : true );
    var e = __transFields( id, fields, r );
    return {
        process : function( executor ) {
            var rst = null;
            if( bString ) {
                rst = executor._exec( e );
                rst = __escapeString( rst ? rst : '' ) + r;
            }else {
                rst = e + r;
            }
            return rst;
        }
    };
}

function __createParser20( expr ) {
    var pp = __P( EXq1 ).parse( __restoreQuote( expr ) );
    return {
        process : function( executor ) {
            var e = '';
            var p = pp;
            while( p ) {
                e += p.process( executor );
                p = p.next;
            }
            var r = executor._exec( __restoreKeys( e ) );
            return __escapeString( r ? r : '' );
        }
    };
}

function __transFields( id, strFields, r ) {
    var expr = null;
    if( strFields ) {
    	var s2 = '';
    	if( r == '(' ) {
            var li = strFields.lastIndexOf('.');
            s2 = strFields.substring( li );
            strFields = strFields.substring( 0, li );
    	}
        if( strFields ) {
            if( strFields.charAt( 0 ) == '.' ) {
                strFields = strFields.substring( 1 ); // ignore the first '.'
            }
            strFields = strFields.replace( /\./g, '/' );
            if( 'sm' == id ) {
                strFields = strFields.replace( /_/g, '.' );
            }
            strFields = '.value("' + strFields + '")';
        }
    }
    expr = 'this.' + id + strFields + s2;
    return expr ? expr : '';
}

function __escapeString( str, bRestore ) {
    if( str && typeof str == 'string' ) {
        if( bRestore ) {
            str = str.replace( /\\\\/g, "\\" ).replace( /\\"/g, "\"" ).replace( /\\'/g, "\'" );
        }else {
            str = str.replace( /\\/g, "\\\\" ).replace( /"/g, "\\\"" ).replace( /'/g, "\\\'" )
                    .replace( /\r/g, "\\r" ).replace( /\n/g, "\\n" );
        }
    }
    return str;
}

//
//-- PEX functions ------------------------------------
//
function __EX( exprArray ) {

    var ex = {
        expr : exprArray,
        pts : __cp( exprArray )[0],
        regExp : new RegExp( __joinExpr( exprArray ) ),

        labelObj : {},
        subexObj : {},

        subEX : function( label ) {
            var r = this.subexObj[label];
            return r || null;
        },

        labelIndex : function( label ) {
            var r = this.labelObj[label];
            return r || -1;
        },

        // override this method to process biz logic
        processPerformed : function( p, context ) {

            return {
                process : function() {
                    return p.result;
                }
            };
        },

        _init : function() {
            for( var i = 0; i < exprArray.length; i++ ) {
                if( exprArray[i] instanceof Array ) {
                    this.labelObj[ exprArray[i][0] ] = i;
                    if( typeof exprArray[i][1] != 'string' ) {
                        this.subexObj[ exprArray[i][0] ] = exprArray[i][1];
                    }
                }
            }
        }

    };

    ex._init();

    return ex;
}

function __P( ex ) {
    return {
        pts : ex.pts,
        regExp : ex.regExp,
        expr : null,
        result : null,

        getEX : function() { return ex; },

        getExpr : function() { return this.expr; },

        parse : function( expr, context ) {
            this.expr = expr;
            this.result = this.regExp.exec( expr );
            return this.getParser( context );
        },

        isMatch : function() {
          return this.result != null;
        },

        ev : function( path ) {
            var s = path.split( '/' );
            var t = this.pts;
            var x = ex;
            for( var i = 0; i < s.length; i++ ) {
                if( ! x ) {
                    throw "EX object is null!!!";
                }
                var m = x.labelIndex( s[i] );
                if( m ) {
                    t = ( t instanceof Array ? t[ m ] : m );
                    x = x.subEX( s[i] );
                }else {
                    throw "expr path is error!!!";
                }
            }
            return this.result[ ( t instanceof Array ? t[0] : t ) ];
        },

        getParser : function( context ) {
            return ex.processPerformed( this, context );
        }
        
    };
}

function __joinExpr( exprArr ) {
    var e = '';
    for( var i = 0; i < exprArr.length; i++ ) {
        if( exprArr[i] instanceof Array ) {
        	if( typeof exprArr[i][1] == 'string' ) {
            	e += exprArr[i][1];
            }else {
            	e += __joinExpr( exprArr[i][1].expr );
            }
        }else {
            e += exprArr[i];
        }
    }
    return e;
}

function __cp( expr, delta ) {
    delta = ( delta == null ? 0 : delta );
    var result = [ null, 0 ];
    if( expr instanceof Array ) {
        if( expr.length > 0 ) {
            var arr = new Array( expr.length );
            for( var i = 0; i < expr.length; i++ ) {
                var r = null;
                if( expr[i] instanceof Array ) {
                	if( typeof expr[i][1] == 'string' ) {
                    	r = __cp( expr[i][1], delta );
                    }else {
                    	r = __cp( expr[i][1].expr, delta );
                    }
                }else {
                    r = __cp( expr[i], delta );
                }
                arr[i] = r[0];
                delta = r[1];
            }
            result[0] = arr;
            result[1] = delta;
        }
    }else {
        result[0] = delta;
        result[1] = delta + __cm( expr );
    }
    return result;
}

function __cm( str ) {
    var n = 0;
    var c0 = 0;
    for( var i = 0; i < str.length; i++ ) {
    	var c = str.charAt(i);
        if( c == '(' && ( c0 % 2 == 0 ) ) {
            n++;
        }
        if( c == '\\' ) {
            c0 += 1;
        }else {
            c0 = 0;
        }
    }
    return n;
}
