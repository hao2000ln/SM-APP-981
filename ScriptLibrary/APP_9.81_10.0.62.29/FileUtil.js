
var SMTYPE = lib.SysUtil.SMTYPE;
var _fduplicate = lib.SysUtil._fduplicate;
var _fcleanup = lib.SysUtil._fcleanup;
var _recordcopy = lib.SysUtil._recordcopy;
var _trimStr = lib.SysUtil._trimStr;
var _updateArr = lib.SysUtil._updateArr;
var _arrEquals = lib.SysUtil._arrEquals;

function $break() {}

/*
 * Cache selected records for performance improving
 * 
 * !!Note: The maximum number _fileCache can hold is 10,000 for the limitation of memory size of the host machine,
 * so, it should make the best of the query string to constrain the result set within 10,000 for the _fileCache 
 * to achieve the best performance. 
 * If the result set exceeds the maximum of _fileCache can hold, it will only hold the first 10,000 records,
 * and for the overwhelming records, _fileCache will select it directly by query.
 * 
 * @param fileName name of the file queried
 * @param field0 referenced field names, can be one or more in an arry
 * @param field1 if be true will duplicate the whole file object,
 *          or else, it should be a field name
 *
 * @example: 
 *  var file1 = _fileCache( 'probsummary', 'number', 'brief.description', 'description' ) // use 'number' field as the reference fields, and only cache 'number', 'brief.description', 'description' three fields
 *  var file2 = _fileCache( 'probsummary', ['number', 'brief.description'], 'description' ) // use the 'number', 'brief.description' as the reference fields
 *  
 *  var file3 = _fileCache( 'probsummary', 'number', true )
 *  file3.select( 'number#"IM1001"' ) // IM10010 ~ IM10019
 *  var prob = file3.get( 'IM10015' ); // get by key 'number' IM10015, and the returned value is a record copy of the current SCFile record
 * 
 */
function _fileCache( fileName, field0/*one or an array*/, field1/*, field2, field3, ...*/ ) {
    
    var MAXNUM = 10000;
    
    var $file = _file( fileName ), $query = null, $bLazy = false;
    
    var $keyTypes = null, $keys = ( field0 && field0 instanceof Array ) ? field0 : [ field0 ];

    var $fieldNames = [];
    if( typeof field1 == 'string' ) {
        _updateArr( $fieldNames, arguments, 1 );
        _updateArr( $fieldNames, $keys ); 
    }else if( field1 === true ) {
        $fieldNames = $file.getFirstLevelFieldNames();
    }
    
    var $cache = _cache( MAXNUM );
    
    function select( query, bLazy ) {
        $query = ( query && _trimStr( query ) || null );
        
        _clearCache();
        
        if( bLazy === true ) {
            $bLazy = true;
        }else {
            $file.select( $query );
            this.success = $file.success;
            $bLazy = false;
        }
        
        return this;
    }
    
    function get( value0 /*, value1, value2, ... */ ) {
        var rt = undefined;
        if( value0 ) {
            var keyValue = ( value0 instanceof Array ? value0 
                : _updateArr( [], arguments ) );
            rt = $cache.get( keyValue );
            if( ! rt ) {
                if( $bLazy ) {
                    this.select( $query );
                }
                
                if( $cache.hasVolum() ) {
                    
                    $file.iterate( function( record ) {
                        var curKeyValue = _extractKeyValues( record );
                        if( $cache.hasVolum() ) {
                            rt = _createCacheObj( record );
                            $cache.put( curKeyValue, rt );
                        }else {
                            rt = _getByQuery( keyValue );
                            throw $break;
                        }

                        if( _arrEquals( curKeyValue, keyValue ) ) {
                            throw $break;
                        }else {
                            rt = undefined;
                        }
                    })
                    
                }else {
                    rt = _getByQuery( keyValue );
                }
            }
        }
        
        return rt;
    }
    
    function _createCacheObj( record ) {
        return _recordcopy( record, new SCFile( fileName ), $fieldNames );
    }
    
    function _clearCache() {
        $cache = _cache( MAXNUM );
    }
    
    function _extractKeyValues( record ) {
        var kv = [];
        for( var i = $keys.length - 1; i >= 0 ; i-- ) {
            kv[i] = record[ $keys[i] ];
        }
        return kv;
    }
    
    function _getByQuery( keyValue ) {
        var rt = undefined;
        var len1 = $keys.length, len2 = keyValue && keyValue.length || 0;
        if( len1 == len2 ) {
            _extractKeyTypes();
            var query = ( ( ! $query || $query == 'true' ) ? [] : [ '(' + $query + ')' ] );
            var len3 = query.length;
            while( len2-- ) {
                var s = $keyTypes[len2] ? '"' : '';
                query[len3 + len2] =  $keys[len2] + '=' + s + keyValue[len2] + s;
            }
            var qfile = new SCFile( fileName, SCFILE_READONLY );
            rt = qfile.doSelect( query.join( ' and ' ) ) == RC_SUCCESS ? qfile : undefined;
        }
        return rt;
    }
    
    function _extractKeyTypes() {
        if( ! $keyTypes ) {
            $keyTypes = [];
            var i = $keys.length;
            while( i-- ) {
                $keyTypes[i] = ( $file.getFieldType( $keys[i] ) == SMTYPE.Character );
            }
        }
    }
    
    return {
        success:          false,
        select:           select,
        selectAll:        select,
        selectLazy:       function( query ) { return this.select( query, true ) },
        get:              get,
        releaseCache:     _clearCache
    }
    
}

/*
 * A convenient for SCFile handling
 *
 */
function _file( fileName ) {
    
    var $scfile = null;
    var $field = null;
    var $rc = null;
    var $fields = null;
    
    function setFields(fields){
    	$fields = fields;
    	return this;
    }
    
    function select( query ) {
        if( ! query ) {
            query = 'true'; // select all
        }
        $scfile = null;
        $rc = null;
        this.success = false;
        if( fileName ) {
        	if( $fields ){
        		$scfile = new SCFile( fileName, SCFILE_READONLY);
        		$scfile.setFields( $fields );
        	} else {
        		$scfile = new SCFile( fileName );
        	}
            
            this.success = ( $scfile.doSelect( query ) == RC_SUCCESS );
        }
        return this;
    }
    
    function getFieldValue( fieldName ) {
        if( $scfile && fieldName ) {
            return $scfile[ fieldName ];
        }else {
            return null;
        }
    }
    
    function setFieldValue( fieldName, value ) {
        if( $scfile && fieldName ) {
            $scfile[ fieldName ] = value;
        }
    }
    
    function update() {
        if( $scfile ) {
            $scfile.doUpdate();
        }
        return this;
    }
    
    function iterate( iterator ) {
        try {
            if( $scfile && iterator ) {
                $rc = ( $rc == null ? $scfile.getFirst() : $scfile.getNext() );
                while( $rc != RC_NO_MORE ) {
                    iterator( $scfile );
                    $rc = $scfile.getNext();
                }
            }
        }catch( ex ) {
            if( ex != $break ) {
                throw ex;
            }
        }
    }
    
    var _evaluateQuery = funcs.evaluate_query;
    
    function evaluateQuery( query ) {
        var b = false;
        if( $scfile && query ) {
            b = ( _evaluateQuery( query, $scfile ) == true );
        }
        return b;
    }
    
    function _initField() {
        if( ! $field ) {
            $field = _field( fileName );
        }
    }
    
    function _wf( fname ) {
        return function() {
            _initField();
            return $field[fname].apply( $field, arguments );
        }
    }
    
    return {
        success:           false,
        getScFile:         function() { return $scfile },
        select:            select,
        selectAll:         select,
        getFieldValue:     getFieldValue,
        setFieldValue:     setFieldValue,
        iterate:           iterate,
        update:            update,
        reset:             function() { $rc = null; return this; },
        evaluateQuery:     evaluateQuery,
        getFirstLevelFieldNames:    _wf( 'getFirstLevelFieldNames' ),
        getFieldType:      _wf( 'getFieldType' ),
        isFieldArray:      _wf( 'isFieldArray' ),
        isFieldStructure:  _wf( 'isFieldStructure' ),
        isAlias:           _wf( 'isAlias' ),
        aliasOf:           _wf( 'aliasOf' ),
        setFields:			setFields
    }
}

/*
 * A convenient for field handling
 * 
 * @param file could be a name of a file, or a record of file 'dbdict'
 * 
 */
function _field( file ) {
    
    var $flFieldNames = null;
    var $fieldTypes = null;

    var dbdict = null;
    if( typeof file == 'string' ) {
        _file( 'dbdict' ).select( 'name="' + file + '"' ).iterate( function( db ){
            dbdict = db;
        })
    }else {
        dbdict = file;
    }
    
    if( dbdict ) {
        _extractFieldTypes( dbdict );
    }
    else {
        $flFieldNames = [];
        $fieldTypes = {};
    }

    function getFirstLevelFieldNames() {        
        return $flFieldNames;
    }
    
    function getFieldType( fieldName ) {
        var rtt = undefined;
        if( fieldName ) {
            var tr = $fieldTypes[ fieldName ];
            if( tr && tr instanceof Array ) {
                rtt = tr[0];
            }
        }
        return rtt;
    }
    
    function isFieldArray( fieldName ) {
        var b = false;
        if( fieldName ) {
            var tr = $fieldTypes[ fieldName ];
            if( tr && tr instanceof Array ) {
                b = tr[1];
            }
        }
        return b;
    }
    
    function isFieldStructure( fieldName ) {
        var b = false;
        if( fieldName ) {
            var tr = $fieldTypes[ fieldName ];
            if( tr && tr instanceof Array ) {
                b = ( SMTYPE.Structure == tr[0] );
            }
        }
        return b;
    }
    
    function isAlias( fieldName ) {
        var b = false;
        if( fieldName ) {            
            var tr = $fieldTypes[ fieldName ];
            if( tr && tr instanceof Array ) {
                b = ( null !== tr[2] );
            }
        }
        return b;
    }
    
    function aliasOf( fieldName ) {
        var aof = null;
        if( fieldName ) {            
            var tr = $fieldTypes[ fieldName ];
            if( tr && tr instanceof Array ) {
                aof = tr[2];
            }
        }
        return aof;
    }
    
    function _extractFieldTypes( dbdict ) {
        if( ! $fieldTypes ) {
            $flFieldNames = [];
            $fieldTypes = {};
            var fields = dbdict.field;
            var lastIndex = -1, lastLevel = -1, lastFieldName = null;
            for( var i = 0, n = fields.length(); i < n; i++ ) {
                if( fields[i].level > 0 ) {
                    var type = fields[i].type;
                    var fn = fields[i].name;
                    var t = $fieldTypes[ fn ];
                    if( ! t ) {
                        t = [ -1, false, null ]; // [ type, beArray, aliasOf ]
                        $fieldTypes[ fn ] = t;
                    }

                    if( type == SMTYPE.Array ) {
                        t[1] = true;
                    }else {
                        t[0] = type;
                    }

                    // first level fields
                    if( fields[i].level == 1 && fields[i].index != lastIndex ) {
                        $flFieldNames.push( fields[i].name );
                    }

                    // alias
                    if( lastIndex != -1 
                            && lastIndex == fields[i].index
                            && lastLevel == fields[i].level ) {
                        t[2] = lastFieldName;
                    }else {
                        lastIndex = fields[i].index;
                        lastLevel = fields[i].level;
                        lastFieldName = fields[i].name;
                    }
                }
            }
        }
    }
    
    return {
        getFirstLevelFieldNames:    getFirstLevelFieldNames,
        getFieldType:               getFieldType,
        isFieldArray:               isFieldArray,
        isFieldStructure:           isFieldStructure,
        isAlias:                    isAlias,
        aliasOf:                    aliasOf
    }
    
}

/*
 * A convenient for values caching
 *
 */
function _cache( maximum ) {
    
    maximum = maximum || 100000;
    
    var $store = {}, $num = 0;
    
    function _put( key0 /* key1, key2, key3 ... , keyn, value */ ) {
        var len = arguments && arguments.length || 0;
        if( len > 1 && $num < maximum ) {
            var keys = null, value = null;
            if( len == 2 && key0 instanceof Array ) {
                keys = key0;
                len = key0.length;
                value = arguments[1];
            }else {
                keys = arguments;
                value = arguments[ --len ];
            }

            var p = $store, m = len - 1;
            for( var i = 0; p && i < m; i++ ) {
                if( ! p[ keys[i] ] ) {
                    p[ keys[i] ] = {};
                }
                p = p[ keys[i] ];
            }
            var k = keys[m];
            if( typeof p[k] == 'undefined' ) {
                $num++;
            }
            p[k] = value;
        }
    }
    
    function _get( key0 /* key1, key2, key3 ... , keyn */ ) {
        var value = undefined, len = arguments && arguments.length || 0;
        if( len > 0 ) {
            var keys = null;
            if( len == 1 && key0 instanceof Array ) {
                keys = key0;
                len = key0.length;
            }else {
                keys = arguments;
            }
            var p = $store, m = len - 1;
            for( var i = 0; p && i < m; i++ ) {
                if( p[ keys[i] ] ) {
                    p = p[ keys[i] ];
                }
            }

            if( p ) {
                value = p[ keys[m] ];
            }
        }

        return value;
    }
    
    function _remove( key0 /* key1, key2, key3 ... , keyn */ ) {
        var value = undefined, len = arguments && arguments.length || 0;
        if( len > 0 ) {
            var keys = null;
            if( len == 1 && key0 instanceof Array ) {
                keys = key0;
                len = key0.length;
            }else {
                keys = arguments;
            }
            
            var p = $store, m = len - 1;
            for( var i = 0; p && i < m; i++ ) {
                if( p[ keys[i] ] ) {
                    p = p[ keys[i] ];
                }
            }

            var k = keys[m];
            if( p && typeof p[k] != 'undefined' ) {
                value = p[k];
                delete p[k];
                $num--;
            }
        }

        return value;
    }
    
    return {
        put:            _put,
        get:            _get,
        remove:         _remove,
        hasVolum:       function() { return $num < maximum },
        releaseCache:   function() { $store = {} }
    }
}


