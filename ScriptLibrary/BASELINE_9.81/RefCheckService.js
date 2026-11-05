var $ = lib.c.$;
var _ = lib.Underscore.require();

/*
 performance consideration:
 there are two solution for get invalid data from db, one is using a sub select like:

 select ts.file_name from helpm1 ts where ts.file_name not in (select unique d."NAME" from dbdictm1 d);

 another is left outer join:
 SELECT ts.file_name, tt.name from helpm1 ts LEFT OUTER JOIN dbdictm1 tt on (ts.file_name = tt.name) WHERE tt.name is null;

 as we use find records "not in", so that will lead to a full table scan when using sub select,
 and a left outer join will also use a full table scan for main table,
 but as cross table query implement the left outer join very well and it helps ignoring the db dependent details
 so finally, we use left outer join

 The relation define in relation file is as following:
 Many to Many : 'D'
 Many to One  : 'B'
 One to Many  : 'A'
 One to One	  : 'C'

 Source file should be the child table and target file should be the parent table

 Type 'E' is used to indicate the entity integrity, which means whether there is null value in first unique key
 */

var RefCheckService = $(new function() {
    var dbdictService = $("#dbdictService");
    var logger = getLog("RefCheckService");
    var errorCode = { SUCCESS : 0, ERROR : 1, DUPLICATE : 2, INVALID : 3, TYPEMISMATCH : 4 };

    // Used for handling files like SYSATTACHMENTS, which is shared by several different modules
    var stTemp = $("sharedFiles", SCFILE_READONLY);
    var sharedTables  = stTemp.selectAll().list();

    // global parameter for switch multi-parent check and whether ignore many to many relations
    var ignoreMultiparent = true;
    var ignoreManytoMany = false;


    // avoid the performance impact when calling funcs.xxx in a loop
    var rad_denull = funcs.denull;
    var rad_null = funcs._null;
    var rad_str = funcs.str;
    var rad_log = funcs.log;
    var rad_msg = funcs.msg;
    var rad_scmsg = funcs.scmsg;
    var rad_tod = funcs.tod;
    var rad_getnumber = funcs.getnumber;
    var rad_val = funcs.val;

    function isSharedFile( tableName ) {
        var sharedFile;

        var k;
        for ( k = 0; k < sharedTables.length; k++ ) {
            sharedFile = sharedTables[k];
            if ( sharedFile["name"] == tableName ) {
                return sharedFile;
            }
        }
        return null;
    }

    // Used to append additional query condition for filtering out fake orphan values which in files like SYSATTACHMENTS
    function appendFileName( sourceTableName, targetTableName ) {
        var sharedFile = isSharedFile( sourceTableName );
        if ( sharedFile == null ) {
            return "";
        }
        var query = " and ts." + sharedFile["field.file.name"] + "=\"" + targetTableName + "\"";
        return query;
    }

    function getRecordCount( checkService, tableName ) {
        if ( tableName == null ) {
            return;
        }
        var count = 0;
        if ( checkService.countHash[tableName] == undefined ) {
            count = $(tableName, SCFILE_READONLY).count("true");
            checkService.countHash[tableName] = count;
        } else {
            count = checkService.countHash[tableName];
        }
        return count;
    }

    function log( msg ) {
        if (logger.isDebugEnabled()) {
            rad_log( msg );
            logger.debug( msg );
        }
    }

    function isFieldStruct( fileName, fieldName ) {
        var dbdict = dbdictService.getValidDbdict( fileName );
        var field = dbdictService.getFieldByName( fieldName, dbdict["field"], false );

        if ( field != null ) {
            if ( $.isPrimitiveType( field.type ) == false && field.type == $.Structure ) {
                return true;
            }
        }
        return false;
    }

    function isFieldArray( fileName, fieldName ) {
        var dbdict = dbdictService.getValidDbdict( fileName );
        var field = dbdictService.getFieldByName( fieldName, dbdict["field"], false );

        if ( field != null ) {
            if ( $.isPrimitiveType( field.type ) == false && field.type == $.Array ) {
                return true;
            }
        }
        return false;
    }

    function isValidFieldType( fileName, fieldName ) {
        var dbdict = dbdictService.getValidDbdict( fileName );
        var field = dbdictService.getFieldByName( fieldName, dbdict["field"], true );

        if ( field != null ) {
            if ( field.type == $.Number || field.type == $.Character ) {
                return true;
            }
        }
        return false;
    }

    function checkRelation( relation, checkService, relation_hash, mainTable ) {

        // skip file name or field name is null
        if ( relation.source_file == null || relation.target_file == null || relation.source_field == null || relation.target_field == null ) {
            return errorCode.INVALID;
        }

        // is a valid sql file
        if( !checkService.isSQLFile( relation.source_file ) || !checkService.isSQLFile( relation.target_file ) ) {
            return errorCode.INVALID;
        }

        // skip the field mapped to lob field
        if ( ( relation["source.sqlfield"] != null && relation["source.sqlfield"].search("In LOB:") != -1 ) ||
            ( relation["target.sqlfield"] != null && relation["target.sqlfield"].search("In LOB:") != -1 ) ) {
            return errorCode.INVALID;
        }

        // if field used in relation is structure type
        if ( isFieldStruct( relation.source_file, relation.source_field ) == true || isFieldStruct( relation.target_file, relation.target_field ) == true ) {
            return errorCode.INVALID;
        }

        // ignore combineKey type
        if ( relation.def_type == "CombinedKey" ) {
            return errorCode.INVALID;
        }

        // compare whether two fields have the same data type
        if ( checkService.isTwoFieldsSameType( relation.source_file, relation.source_field, relation.target_file, relation.target_field ) == false ) {
            return errorCode.TYPEMISMATCH;
        }

        // only character or number field can be used to check orphan
        if ( isValidFieldType( relation.source_file, relation.source_field ) == false ) {
            return errorCode.INVALID;
        }

        // the main key of main table should not be appeared in source
        if ( relation["source.file"] == mainTable && checkService.isFieldinFUK( relation["source.file"], relation["source.field"] ) == true ) {
            return errorCode.INVALID;
        }

        // check duplication in current relations
        if ( relation_hash[relation.source_file + relation.source_field + relation.target_file + relation.target_field] == undefined ) {
            relation_hash[relation.source_file + relation.source_field + relation.target_file + relation.target_field] = 1;
        }
        else {
            return errorCode.DUPLICATE;
        }

        // check duplication in the result set
        if ( checkService.checkDuplicate( relation ) == true ) {
            return errorCode.DUPLICATE;
        }

        return errorCode.SUCCESS;
    }

    function findRelations( file, field, subObject ) {
        var query;
        if ( ignoreManytoMany == true ) {
            query = "source.file=\"" + file + "\" and source.field=\"" + field + "\" and post.expression ~= \"t\" and do.ref.check = \"t\" and status ~= \"invalid\" and "
                + "((def.type = \"erddef\" and (relType =\"B\" or relType =\"C\")) or ((def.type = \"link\" or def.type = \"manual\") and relType ~= \"D\"))";
        } else {
            query = "source.file=\"" + file + "\" and source.field=\"" + field + "\" and post.expression ~= \"t\" and do.ref.check = \"t\" and status ~= \"invalid\" and "
                + "((def.type = \"erddef\" and (relType =\"B\" or relType =\"C\")) or ((def.type = \"link\" or def.type = \"manual\")))";
        }
        log( "Query used to find sub relations is: " + query );

        subObject.relation = new SCFile( "relation", SCFILE_READONLY );
        subObject.relation.setOrderBy( ["source.file"], [SCFILE_ASC] );
        var rc = subObject.relation.doSelect( query );

        subObject.count = 0;
        if( RC_SUCCESS == rc ) {
            rc = subObject.relation.getFirst();
        }
        else
        {
            return rc;
        }

        var relation_hash = {};
        do {
            if ( relation_hash[subObject.relation.source_file + subObject.relation.source_field + subObject.relation.target_file + subObject.relation.target_field] == undefined ) {
                relation_hash[subObject.relation.source_file + subObject.relation.source_field + subObject.relation.target_file + subObject.relation.target_field] = 1;
                subObject.count++;
            }
            rc = subObject.relation.getNext();
        } while ( RC_SUCCESS == rc );
        rc = subObject.relation.getFirst();

        log( "Sub relation count is: " + subObject.count );
        return rc;
    }

    function isValueIn( file, field, value ) {
        var fieldNamesArray = [];
        fieldNamesArray.push( field );
        var query;

        if ( typeof value == "object" ) {
            if ( value.getType() == "STRING2" ) {
                query = field + " = \"" + value.getText() + "\"";
            }
            else {
                query = field + " = " + value.getText();
            }
        }
        else {
            if ( typeof value == "string" ) {
                query = field + " = \"" + value + "\"";
            }
            else {
                query = field + " = " + value;
            }
        }
        log( "Query for verifying value in target file: " + query );

        var fileObj = $(file, SCFILE_READONLY);
        var count = fileObj.setFields( fieldNamesArray ).count( query );
        if ( count > 0 ) {
            return true;
        }
        else {
            return false;
        }
    }

    function findOrphan( mainRelation, relation, checkService ) {
        var rc = RC_SUCCESS;

        checkService.status = "1";

        log( "mainRelation in find orphan is: (" + mainRelation.source_file + "," + mainRelation.source_field + "/" + mainRelation.target_file + "," + mainRelation.target_field + ")" );

        var sourceFileName  = mainRelation.source_file;
        var sourceFieldName = dbdictService.getFieldNameByPath( mainRelation.source_field );
        var targetFileName  = mainRelation.target_file;
        var targetFieldName = dbdictService.getFieldNameByPath( mainRelation.target_field );

        var isSourceFieldinFUK = checkService.isFieldinFUK( sourceFileName, sourceFieldName );
        var isTargetFieldinFUK = checkService.isFieldinFUK( targetFileName, targetFieldName );

        var nullCount = 0;
        var noOrphan = false;
        var relation_hash = {};

        var parentCount = 0;
        var reportid = checkService.getReportID();

        // relation object keeps a list of source relation is mainRelation.source, but target relations are different
        // That is the multi-parent case
        do {
            var subSourceFile  = relation.source_file;
            var subSourceField = dbdictService.getFieldNameByPath( relation.source_field );
            var subTargetFile  = relation.target_file;
            var subTargetField = dbdictService.getFieldNameByPath( relation.target_field );

            var orphanCount = 0;
            var checkSpecial = false;
            var sourceFieldIsArray = false;

            // check if sub relation is valid or not
            if ( checkRelation( relation, checkService, relation_hash, mainRelation.target_file ) != errorCode.SUCCESS ) {
                rc = relation.getNext();
                checkService.incCompleteCount();
                continue;
            }

            // FIX ME, only used temporarily for avoid change in apps side
            if ( ( subSourceFile == "inbox" && subSourceField == "operator.name" ) || subSourceFile == "timeperiodDefinition" ) {
                checkSpecial = true;
            }

            // so far, for array field as source, we donot support "select distinct ... "
            if ( isFieldArray( subSourceFile, subSourceField ) == true ) {
                sourceFieldIsArray = true;
            }

            var additionQuery = appendFileName( subSourceFile, subTargetFile );

            // as right outer join is not stable in current cross table query, so we only use
            // left outer join
            var sql;
            if ( sourceFieldIsArray == true ) {
                sql = "SELECT " + "ts." + subSourceField +
                    ", tt." + subTargetField + " from " +
                    subSourceFile + " ts" + " LEFT OUTER JOIN " + subTargetFile + " tt" + " on (" +
                    "ts." + subSourceField + " = " +
                    "tt." + subTargetField + ") " + "WHERE null(" + "tt." + subTargetField + ")" + additionQuery;
            }
            else {
                sql = "SELECT DISTINCT " + "ts." + subSourceField +
                    ", tt." + subTargetField + " from " +
                    subSourceFile + " ts" + " LEFT OUTER JOIN " + subTargetFile + " tt" + " on (" +
                    "ts." + subSourceField + " = " +
                    "tt." + subTargetField + ") " + "WHERE null(" + "tt." + subTargetField + ")" + additionQuery;
            }

            log( "Query used to find orphan is: " + sql );
            var sourceFile = new SCFile( subSourceFile, SCFILE_READONLY );
            sourceFile.setFields( subSourceField );
            var SubRc = sourceFile.doSelect( sql );
            if ( SubRc == RC_SUCCESS ) {
                SubRc = sourceFile.getFirst();
            }

            while( SubRc == RC_SUCCESS ) {
                var temp = rad_denull( sourceFile[subSourceField] );
                log( "Raw source field value: " + sourceFile[subSourceField] );

                if ( temp != null && rad_null( temp ) == false ) {
                    log( "typeof of sourcefield is: " + ( typeof sourceFile[subSourceField] ) );

                    var operatorvalue;
                    
                    // If the orphan data is an array, that means it may not a real orphan, we need to check element in array one by one
                    if ( ( typeof sourceFile[subSourceField] == "object" ) && sourceFile[subSourceField].getType() == "ARRAY" ) {
                        var sourceArrayLength = sourceFile[subSourceField].length();
                        log ( "Array length of source field value is: " + sourceArrayLength );

                        var i;
                        for ( i = 0; i < sourceArrayLength; i++ ) {
                            temp = rad_denull( sourceFile[subSourceField][i] );

                            if ( temp == null ) {
                                nullCount++;
                            }
                            // check the item in array whether the real orphan
                            else if ( isValueIn( subTargetFile, subTargetField, sourceFile[subSourceField][i] ) == false ) {
                                operatorvalue = String( rad_str( sourceFile[subSourceField][i] ) );
                                log( "sourceFile[subSourceField][i]= " + operatorvalue );

                                // special check for operator/timeperioddefinition table, if value is "%NONE% or all, then skip
                                if ( checkSpecial == true ) {
                                    if ( operatorvalue == "%NONE%" || operatorvalue == "all" ) {
                                        continue;
                                    }
                                }

                                if ( parentCount == 0 ) {
                                    // insert orphan values into table
                                    checkService.insertOrphanValue( reportid, operatorvalue );
                                } else {
                                    // if orphan value is already there, update the flag, if not, we do nothing
                                    checkService.saveOrphanValue( reportid, operatorvalue );
                                }
                                orphanCount++;
                            }
                        }
                    }
                    else {
                        operatorvalue = String( rad_str( sourceFile[subSourceField] ) );
                        log( "sourceFile[subSourceField]= " + operatorvalue );

                        // special check for operator//timeperioddefinition table, if value is "%NONE% or all, then skip
                        if ( checkSpecial == true ) {
                            if ( operatorvalue == "%NONE%" || operatorvalue == "all" ) {
                                SubRc = sourceFile.getNext();
                                continue;
                            }
                        }

                        if ( parentCount == 0 ) {
                            checkService.insertOrphanValue( reportid, operatorvalue );
                        } else {
                            checkService.saveOrphanValue( reportid, operatorvalue );
                        }
                        orphanCount++;
                    }
                }
                else {
                    nullCount++;
                }
                SubRc = sourceFile.getNext();
            }

            // no records found means no orphan in one of the sub relation for this source file/field combination
            // then means no orphan for the main relation, so we break out the loop
            if ( orphanCount == 0 ) {
                noOrphan = true;
                checkService.removeNotRealOrphan( reportid, true );
                checkService.incCompleteCount();
                break;
            }

            // flush table, remove all not real orphans
            if ( parentCount > 0 ) {
                checkService.removeNotRealOrphan( reportid, false );
                checkService.resetOrphanFlag( reportid );
            }

            sourceFile.doClose();

            checkService.incCompleteCount();
            rc = relation.getNext();
            parentCount++;
        } while ( rc == RC_SUCCESS );

        // At this time, the records in table are real orphans
        var invalidCount = checkService.getTotalInvalidCount( mainRelation, reportid );

        log( "Real orphan count is: " + invalidCount );

        if ( invalidCount > 0 && noOrphan == false ) {
            checkService.incInvalidCount();

            checkService.insertToReport( reportid, mainRelation, invalidCount, nullCount, isSourceFieldinFUK, isTargetFieldinFUK );
        }
    }

    return {
        batchID : -1,
        startTime : 0,
        endTime : 0,
        fileNameList : [],

        status : null,

        currentUser : null,
        lobCheck : false,

        relationCount : 0,
        completeCount : 0,

        // number of orphan data
        batchResultCount : 0,
        batchLobCount : 0,
        // number of relations has orphan data
        invalidCount : 0,

        // message level
        INFO : 1,
        ACTION : 2,
        ERROR : 3,

        // A hash to store records number in a file for performance consideration
        // If this takes a lot of memory, then we can get rid of it.
        countHash : {},

        // BatchID will be SCDatum type, so please do the check
        getBatchID : function() {
            return this.batchID;
        },

        reset : function() {
            this.batchID = -1;
            this.startTime = 0;
            this.endTime = 0;
            this.fileNameList = [];

            this.status = null;

            this.currentUser = null;
            this.lobCheck = false;

            this.relationCount = 0;
            this.completeCount = 0;

            this.batchResultCount = 0;
            this.batchLobCount = 0;
            this.invalidCount = 0;

            this.countHash = {};
            forceGC( true );
        },

        // parameter should be array
        setFileNames : function( fileNames ) {
            this.fileNameList = fileNames;
        },

        // status should be string type
        setStatus : function( status ) {
            this.status = status;
        },

        setCurrentUser : function( username ) {
            this.currentUser = username;
        },

        setLobCheck : function( bCheck ) {
            this.lobCheck = bCheck;
        },

        checkLob : function() {
            return this.lobCheck;
        },

        incRelationCount : function( count ) {
            this.relationCount += count;
        },

        incCompleteCount : function() {
            this.completeCount++;
        },

        incLobCount : function( count ) {
            this.batchLobCount += count;
        },

        incInvalidCount : function() {
            this.invalidCount++;
        },

        setBatchID : function( batchID ) {
            this.batchID = batchID;
        },

        isTwoFieldsSameType : function ( sourceTableName, sourceFieldName, targetTableName, targetFieldName ) {
            var sourceDbdict = dbdictService.getValidDbdict( sourceTableName );
            var targetDbdict = dbdictService.getValidDbdict( targetTableName );
            var sourceField  = dbdictService.getFieldByName( sourceFieldName, sourceDbdict["field"] );
            var targetField  = dbdictService.getFieldByName( targetFieldName, targetDbdict["field"] );
            if ( sourceField != null && targetField != null ) {
                if ( sourceField.type == targetField.type ) {
                    return true;
                }
            }
            return false;
        },

        isSQLFile : function ( fileName ) {
            var mfile = new SCFile( fileName );
            var ret = mfile.isSQLFile();
            mfile.doClose();

            return ret;
        },

        // return true even if there is only record
        checkDuplicate : function ( relation ) {
            var ID = -1;
            if ( typeof( this.batchID ) != "number" ) {
                ID = rad_val( this.batchID , 1 );
            }
            else {
                ID = this.batchID;
            }
            if ( ID == -1 ) {
                return false;
            }

            var fileObj = $("refCheckResult", SCFILE_READONLY);
            var dupCount = fileObj.
                count("((source.file=\"" + relation["source.file"] + "\" and source.field=\"" + relation["source.field"]
                    + "\" and target.file=\"" + relation["target.file"] + "\" and target.field=\"" + relation["target.field"] + "\") or "
                    + "(source.file=\"" + relation["target.file"] + "\" and source.field=\"" + relation["target.field"]
                    + "\" and target.file=\"" + relation["source.file"] + "\" and target.field=\"" + relation["source.field"] + "\")) "
                    + "and batch.id=" + ID );

            if ( dupCount > 0 ) {
                return true;
            }
            return false;
        },

        // parm must be an array
        sendMsgToUser : function( msgid, level, user, parm ) {
            if ( _.isArray( parm ) == false ) {
                return;
            }

            var msg = rad_scmsg( msgid, "refCheck", parm );

            var msgLevel = new SCDatum();
            msgLevel.setType( 1 );
            msgLevel.setValue( level );

            rad_msg( msg, msgLevel, user, "refCheck" );
            log( msg );
        },

        saveStatistics : function() {
            var rteNumber = new SCDatum();

            // If this.batchID equals -1, that means this is the first time we 
            // call the saveStatistics(), so we assign a value to batchID
            if ( this.batchID == -1 ) {
                rad_getnumber( rteNumber, "refCheckStatistic", "id" );
                this.batchID = rteNumber;
            }

            var checkStat = new SCFile( "refCheckStatistic" );
            if ( this.startTime == 0 && this.status != "2" ) {
                this.startTime = rad_tod();
            }
            if ( this.endTime == 0 && this.status != "2" ) {
                this.endTime = rad_tod();
            }

            // convert the number to SM Date time type
            var startTime = new SCDatum( this.startTime );
            startTime.setType( 3 );
            var endTime = new SCDatum( this.endTime );
            endTime.setType( 3 );

            checkStat["batch.id"] 		    = this.batchID;
            checkStat["start.time"] 		= startTime;
            checkStat["end.time"] 		    = endTime;
            checkStat["batch.count"] 	    = this.batchResultCount;
            checkStat["lob.count"] 		    = this.batchLobCount;
            checkStat["invalid.count"] 	    = this.invalidCount;
            checkStat["status"] 			= this.status;
            checkStat["relation.count"] 	= this.relationCount;
            checkStat["complete.count"] 	= this.completeCount;
            checkStat["check.blob"]         = this.lobCheck;
            checkStat["user.name"]          = this.currentUser;

            var i;
            for ( i = 0; i < this.fileNameList.length; i++ ) {
                checkStat["filename.list"][i] = this.fileNameList[i];
            }

            checkStat.doSave();
            checkStat.doClose();
        },

        getReportID : function() {
            // A record should be added in number file in case id field needs to be auto increased.
            var rteNumber = new SCDatum();
            rad_getnumber( rteNumber, "refReport", "id" );

            var number = rad_val( rteNumber , 1 );
            return number;
        },

        insertOrphanValue : function( reportid, orphanValue ) {
            var valueList = new SCFile( "refCheckValueList" );

            var rteNumber = new SCDatum();
            rad_getnumber( rteNumber, "refCheckValueList", "id" );

            valueList["id"] = rteNumber;
            valueList["source.value"] = orphanValue;
            valueList["external.id"] = reportid;

            // This field is used internally to indicate whether an orphan exists in another parent relation
            // if false, we will remove it from the orphan list, as this is not the real orphan
            valueList["exist"] = false;

            valueList.doInsert();
            valueList.doClose();
        },

        saveOrphanValue : function( reportid, orphanValue ) {
            var valueList = new SCFile( "refCheckValueList" );

            var query = "source.value=" + "\"" + orphanValue + "\" and external.id=" + reportid;
            var rc = valueList.doSelect( query );
            if ( RC_SUCCESS == rc ) {
                rc = valueList.getFirst();
            }

            while ( rc == RC_SUCCESS ) {
                valueList["exist"] = true;
                valueList.doUpdate();

                rc = valueList.getNext();
            }

            valueList.doClose();
        },

        removeNotRealOrphan : function( reportid, all ) {
            var valueList = new SCFile( "refCheckValueList" );

            var query = "external.id=" + reportid;
            var rc = valueList.doSelect( query );
            if ( RC_SUCCESS == rc ) {
                rc = valueList.getFirst();
            }

            while ( rc == RC_SUCCESS ) {
                if ( valueList["exist"] == false || all == true ) {
                    valueList.doDelete();
                }
                rc = valueList.getNext();
            }

            valueList.doClose();
        },

        resetOrphanFlag : function( reportid ) {
            var valueList = new SCFile( "refCheckValueList" );

            var query = "external.id=" + reportid;
            var rc = valueList.doSelect( query );
            if ( RC_SUCCESS == rc ) {
                rc = valueList.getFirst();
            }

            while ( rc == RC_SUCCESS ) {
                valueList["exist"] = false;
                valueList.doUpdate();
                rc = valueList.getNext();
            }

            valueList.doClose();
        },

        // return -1 if no records can be found
        getOrphanCount : function( reportid ) {
            var valueList = new SCFile( "refCheckValueList", SCFILE_READONLY );

            var query = "external.id=" + reportid;
            var rc = valueList.doSelect( query );
            if ( RC_SUCCESS != rc ) {
                valueList.doClose();
                return -1;
            }

            var count = valueList.doCount( query );
            valueList.doClose();
            return count;
        },

        getTotalInvalidCount : function( relation, reportid ) {
            var file = new SCFile( relation.source_file, SCFILE_READONLY );

            var query = ["select count(*) as cnt from ",
                relation.source_file,
                " where ",
                relation.source_field,
                " isin ( select source.value from refCheckValueList where external.id=\"",
                reportid,
                "\")"].join("");
            log( "Query for invalid count is: " + query );
            var rc = file.doSelect( query );
            if ( RC_SUCCESS == rc ) {
                log( "Invalid record count by getTotalInvalidCount is: " + file.cnt );
                return file.cnt;
            }
            return -1;
        },

        insertToReport : function( reportid, relation, invalidCount, nullCount, isSourceFieldinFUK, isTargetFieldinFUK ) {
            var report = new SCFile( "refCheckResult" );

            report["id"] 			= reportid;
            report["source.file"]	= relation["source.file"];
            report["source.field"]	= relation["source.field"];
            report["target.file"] 	= relation["target.file"];
            report["target.field"]	= relation["target.field"];

            if ( this.startTime == 0 ) {
                this.startTime = rad_tod();
            }

            if ( this.batchID == -1 ) {
                var rteNumber = new SCDatum();
                rad_getnumber( rteNumber, "refCheckStatistic", "id" );
                this.batchID = rteNumber;
            }

            report["batch.id"] = this.batchID;

            report["relation.type"] 	= relation["relType"];
            report["definition.type"] 	= relation["def.type"];
            report["definition.query"] 	= relation["def.query"];

            if ( relation["source.sqlfield"] != undefined && relation["target.sqlfield"] != undefined ) {
                report["from.lob"] = ( ( relation["source.sqlfield"].search("In LOB:") != -1 )
                    || ( relation["target.sqlfield"].search("In LOB:") != -1 ) );
            } else {
                report["from.lob"] = false;
            }

            report["source.record.count"] 	= getRecordCount(this, relation["source.file"]);
            report["target.record.count"] 	= getRecordCount(this, relation["target.file"]);
            report["null.record.count"]		= nullCount;

            report["sourcefield.in.fuk"] = isSourceFieldinFUK;
            report["targetfield.in.fuk"] = isTargetFieldinFUK;

            report["report.time"] = rad_tod();

            report["solution"] = rad_scmsg( 37, "refCheck" );
            report["explanation"] = rad_scmsg( 38, "refCheck" );

            this.batchResultCount += invalidCount;
            report["invalid.record.count"] 	= invalidCount;

            report.doInsert();
            report.doClose();
            this.endTime = rad_tod();
        },

        isFieldinFUK : function( tableName, fieldName ) {
            if ( tableName == null || fieldName == null ) {
                return false;
            }
            var dbdict = dbdictService.getValidDbdict( tableName );
            var primaryKey = dbdictService.getRealPrimaryKey( dbdict["key"] );
            if ( dbdictService.isFieldFUK( fieldName, primaryKey ) == false ) {
                var firstUniqueKey = dbdictService.getFirstUniqueKey( dbdict["key"] );
                return dbdictService.isFieldFUK( fieldName, firstUniqueKey );
            }
            return true;
        },

        isAreadyInQueue : function( fileArray ) {
            var fileObj = $( "refCheckStatistic", SCFILE_READONLY );
            var refStat = fileObj.setOrderBy( ["status"], [SCFILE_ASC]).select( "status=\"1\" or status=\"2\" or status=\"3\"" );
            var taskCount = refStat.count( "status=\"1\" or status=\"2\" or status=\"3\"" );

            var fileNameList;
            if ( taskCount > 0 ) {
                refStat.rc = refStat.scfile.getFirst();
                while ( refStat.rc != RC_NO_MORE ) {
                    if ( refStat.scfile["filename.list"].length() > 0 ) {
                        fileNameList = refStat.scfile["filename.list"].toArray();
                        if ( _.difference( _.union( fileArray, fileNameList ), fileNameList ).length == 0 ) {
                            return true;
                        }
                    }
                    refStat.rc = refStat.scfile.getNext();
                }
            }

            return false;
        },

        getEntityReport : function( tableName ) {
            var dbdict = dbdictService.getValidDbdict( tableName );

            if ( dbdict == undefined || dbdict == null ) {
                return;
            }
            if ( _.indexOf( this.fileNameList, tableName ) == -1 ) {
                this.fileNameList.push( tableName );
            }

            var firstUniqueKey = dbdictService.getFirstUniqueKey( dbdict["key"] );
            this.incRelationCount( 1 );
            this.status = "1";

            // get the fields name array
            var keyNamesArray = [];
            if ( firstUniqueKey != null ) {
                var names = firstUniqueKey.name;
                var name = dbdictService.getFieldNameByPath( names[0] );
                var nameQuery = "null( " + name + " )";
                keyNamesArray.push( name );
                var nameNumber = names.length();

                if ( nameNumber > 1 ) {
                    var j;
                    for ( j = 1; j < nameNumber; j++ ) {
                        name = dbdictService.getFieldNameByPath( names[j] );
                        nameQuery += " AND null( " + name + " )";
                        keyNamesArray.push( name );
                    }
                }

                var fileObj = $(tableName, SCFILE_READONLY);
                var nullCount = fileObj.setFields( keyNamesArray ).count( nameQuery );

                var relation = [];

                relation["source.file"]  = tableName;
                relation["source.field"] = keyNamesArray.toString();
                relation["target.file"]  = null;
                relation["target.field"] = null;

                relation["relType"]   = "E";
                relation["def.type"]  = "EntityIntegrityCheck";
                relation["def.query"] = nameQuery;

                if ( nullCount > 0 ) {
                    this.insertToReport( this.getReportID(), relation, 0, nullCount, false, false );
                }
            }
            this.incCompleteCount();
            this.saveStatistics();
        },

        getRefReport : function( tableName ) {
            if ( _.indexOf( this.fileNameList, tableName ) == -1 ) {
                this.fileNameList.push( tableName );
            }

            var relation = new SCFile( "relation", SCFILE_READONLY );
            relation.setOrderBy( ["source.file", "source.field"], [SCFILE_ASC, SCFILE_ASC] );

            // query condition:
            // 1. master table as target file 2. doesn't have post expression in link 3. status is not invalid or this is a manual defined link
            // 4. only handle erddef which definition type is many to one and one to one, and the relation from link which relation type is not many to many
            var query;
            if ( ignoreManytoMany == true ) {
                query = "target.file=\"" + tableName + "\" and post.expression ~= \"t\" and do.ref.check = \"t\" and status ~= \"invalid\" and " +
                    "((def.type = \"erddef\" and (relType =\"B\" or relType =\"C\")) or ((def.type = \"link\" or def.type = \"manual\") and relType ~=\"D\"))";
            } else {
                query = "target.file=\"" + tableName + "\" and post.expression ~= \"t\" and do.ref.check = \"t\" and status ~= \"invalid\" and " +
                    "((def.type = \"erddef\" and (relType =\"B\" or relType =\"C\")) or ((def.type = \"link\" or def.type = \"manual\")))";
            }
            log( "query condition for master table:" + query );
            this.sendMsgToUser( 40, this.INFO, this.currentUser, [tableName] );

            var relCount = relation.doCount( query );

            var rc = relation.doSelect( query );

            if( RC_SUCCESS != rc ) {
                this.sendMsgToUser( 31, this.ERROR, this.currentUser, [query]);
                return;
            }

            var relation_hash = {};
            var i = 0;

            while ( RC_SUCCESS == rc ) {
                if ( relCount > 10 && i % 10 == 0 ) {
                    this.sendMsgToUser( 41, this.INFO, this.currentUser, [i.toString(), relCount.toString(), tableName] );
                }
                ++i;

                var checkReturn = checkRelation( relation, this, relation_hash, tableName );
                if ( checkReturn == errorCode.ERROR || checkReturn == errorCode.DUPLICATE || checkReturn == errorCode.INVALID ) {
                    rc = relation.getNext();
                    continue;
                }
                else if ( checkReturn == errorCode.TYPEMISMATCH ) {
                    this.sendMsgToUser( 33, this.ERROR, this.currentUser, [relation.source_file,relation.source_field,relation.target_file,relation.target_field] );
                    rc = relation.getNext();
                    continue;
                }

                var subObject = {};
                subObject.relation = new SCFile( "relation", SCFILE_READONLY );
                subObject.count = 0;

                log( "Starting to find reference missing data according to master relation..." );
                // If the target field is the first unique key/primary key, then find out the relations that source relation is "source.file" and "source.field"
                // this is the case of multi-parent
                if ( this.isFieldinFUK( relation["target.file"], relation["target.field"] ) == true ) {
                    rc = findRelations(relation["source.file"], relation["source.field"], subObject );
                    if ( rc != RC_SUCCESS ) {
                        this.sendMsgToUser( 34, this.ERROR, this.currentUser, [relation["source.file"], relation["source.field"]] );
                        rc = relation.getNext();
                        continue;
                    }

                    // we will not handle multi-parent, only when we can afford the risk and effort then we could do it
                    if ( subObject.count > 1 && ignoreMultiparent == true ) {
                        rc = relation.getNext();
                        continue;
                    }

                    this.incRelationCount( subObject.count );
                    findOrphan( relation, subObject.relation, this );
                }
                else {
                    // If target field is not the first unique key/primary key, then it could be the source of relation in other relations
                    // If it is, then we should ignore it
                    rc = findRelations( relation["target.file"], relation["target.field"], subObject );
                    if( RC_SUCCESS == rc ) {
                        this.sendMsgToUser( 35, this.ERROR, this.currentUser, [relation["target.file"], relation["target.field"]] );
                        rc = relation.getNext();
                        continue;
                    }
                    // If target field is only found in target, then we look for all the relations that source relation is "source.file" and "source.field"
                    else {
                        rc = findRelations(relation["source.file"], relation["source.field"], subObject );
                        if ( rc != RC_SUCCESS ) {
                            this.sendMsgToUser( 36, this.ERROR, this.currentUser, [relation["source.file"], relation["source.field"]] );
                            rc = relation.getNext();
                            continue;
                        }

                        // ignore multi-parent
                        if ( subObject.count > 1 && ignoreMultiparent == true ) {
                            rc = relation.getNext();
                            continue;
                        }

                        this.incRelationCount( subObject.count );
                        findOrphan( relation, subObject.relation, this );
                    }
                }
                rc = relation.getNext();
            }
        }
    };
});

function getClass() {
    return RefCheckService;
}
