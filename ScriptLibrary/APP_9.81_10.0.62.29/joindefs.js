
var _file = lib.FileUtil._file;
var _field = lib.FileUtil._field;
var _updateArr = lib.SysUtil._updateArr;
var _arrEquals = lib.SysUtil._arrEquals;
var _arrContains = lib.SysUtil._arrContains;
var _trimStr = lib.SysUtil._trimStr;


/*!
 * Rewrite the logics of RAD trigger.update.related.joindefs 
 * for performance improvement according to QCCR54794
 * 
 */

function updateRelatedJoindefs( datadict ) {
    
    var tname = datadict.name;
    var query = 'join.tables,table.name = "' + tname + '"';
    var joinFiles = _file( 'joindefs' ).select( query );
    
    if( joinFiles.success ) {
        var dbField = _field( tname );
        var fields = datadict.fields, captions = datadict.captions,
            tns = [], nmes = [], caps = [];
        for( var i = 0, length = fields.length(); i < length; i++ ) {
            if( ! dbField.isAlias( fields[i] ) ) {
                tns.push( tname );
                nmes.push( tname + ',' + fields[i] );
                caps.push( captions[i] || '' );
            }
        }
        
        joinFiles.iterate( function( joindefs ) {

            var fieldTableNames = joindefs.field_table_name,
                fieldNames = joindefs.field_names, 
                fieldCaptions = joindefs.field_captions;
                
            var len = fieldTableNames && fieldTableNames.length() || 0;
            
            if( len > 0 ) {
                var ts = [], fs = [], cs = [];
                // push the fields of other joined tables
                for( var j = 0; j < len; j++ ) {
                    if( fieldTableNames[j] != tname ) {
                        ts.push( fieldTableNames[j] );
                        fs.push( fieldNames[j] );
                        cs.push( fieldCaptions[j] );
                    }
                }

                // push the fields of the current datadict
                _updateArr( ts, tns );
                _updateArr( fs, nmes );
                _updateArr( cs, caps );

                joindefs.field_table_name = ts;
                joindefs.field_names = fs;
                joindefs.field_captions = cs;

                joindefs.doUpdate();

            }
        })
    
    }
    
}


/*!
 * Rewrite the logics of RAD trigger.field.names.captions
 * for performance improvement according to QCCR54794
 * 
 */

function trigger_field_names_captions( oldJoindefs, joindefs ) {
    
    function _extractJoinTables( record ) {
        var tablesArr = [];
        var joinTables = record.join_tables;
        var len = joinTables && joinTables.length() || 0;
        while( len-- ) {
            var tn = _trimStr( joinTables[len].table_name );
            if( tn ) {
                tablesArr.push( tn );
            }
        }
        return tablesArr.sort();
    }
    
    var tables = _extractJoinTables( joindefs );
    var oldTables = _extractJoinTables( oldJoindefs );
    
    if( ! _arrEquals( tables, oldTables ) ) {
        
        var ts = [], fs = [], cs = [];
        
        if( tables ) {
            var tArr = [];
            
            var fieldTableNames = joindefs.field_table_name,
                fieldNames = joindefs.field_names, 
                fieldCaptions = joindefs.field_captions;
                
            var len = fieldTableNames && fieldTableNames.length() || 0;
            
            if( len > 0 ) {
                var tObj = {};
                for( var j = 0; j < len; j++ ) {
                    if( tObj[ fieldTableNames[j] ] === undefined ) {
                        tObj[ fieldTableNames[j] ] = _arrContains( tables, fieldTableNames[j] );
                    }
                    
                    if( tObj[ fieldTableNames[j] ] ) {
                        ts.push( fieldTableNames[j] );
                        fs.push( fieldNames[j] );
                        cs.push( fieldCaptions[j] );
                    }
                }
                
                var ln = tables.length;
                while( ln-- ) {
                    if( ! tObj[ tables[ln] ] ) {
                        tArr.push( tables[ln] );
                    }
                }
                
            }else {
                tArr = tables;
            }
            
            // handle newly joined tables
            if( tArr.length > 0 ) {
                var query = tArr.length > 1 ? 'name isin {"' + tArr.join( '","' ) + '"}'
                                : 'name="' + tArr[0] + '"';
                _file( 'datadict' ).select( query ).iterate( function( datadict ) {
                    var name = datadict.name;
                    var dbField = _field( name );
                    for( var i = 0, fields = datadict.fields, length = fields.length(),
                            captions = datadict.captions; i < length; i++ ) {

                        if( ! dbField.isAlias( fields[i] ) ) {
                            ts.push( name );
                            fs.push( name + ',' + fields[i] );
                            cs.push( captions[i] || '' );
                        }
                    }
                })
            }
        }
        
        joindefs.field_table_name = ts;
        joindefs.field_names = fs;
        joindefs.field_captions = cs;
        
        /*!!Note: 
         * Must not call joindefs.doUpdate, because these codes are 
         * invoked by trigger: trigger.field.names.captions
         */
    }
}





