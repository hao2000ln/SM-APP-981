function LobRecordCheck()
{
    this.invalid_count = 0;
    this.null_count = 0;
    this.relation_record = null;
    this.refCheckService = null;
    this.reportID = null;

}

LobRecordCheck.prototype.checkRecord = function ( relation_record, refCheckService )
{

    this.invalid_count = 0;
    this.null_count = 0;
    this.reportID = null;

    this.checkLobField( relation_record );
    if(this.invalid_count > 0)
    {
        var isSourceFUK = refCheckService.isFieldinFUK(this.relation_record["source.file"], this.relation_record["source.field"] );
        var isTargetFUK = refCheckService.isFieldinFUK(this.relation_record["target.file"], this.relation_record["target.field"] );

        refCheckService.insertToReport(this.reportID, this.relation_record, this.invalid_count, this.null_count, isSourceFUK, isTargetFUK );
        refCheckService.incInvalidCount();
        refCheckService.incLobCount( this.invalid_count );
    }
    refCheckService.incCompleteCount();
};

LobRecordCheck.prototype.checkRelations = function( filename, refCheckService )
{
    this.refCheckService = refCheckService;
    var relationRecord = new SCFile("relation");
    var query = "target.file=\"" + filename + "\" and (target.sqlfield like \"In LOB*\" or source.sqlfield like \"In LOB*\") and status ~= \"invalid\""+" and (def.type=\"link\" or def.type=\"erddef\") and post.expression~=\"t\" and do.ref.check = \"t\"";
    //query += ' and relType="C"';
    
    var recordCount = relationRecord.doCount(query);
    refCheckService.incRelationCount( recordCount );
    
    if( recordCount <= 0) {
        return;
    }
    
    var rc = relationRecord.doSelect(query);

    var i = 0;

    while(rc == RC_SUCCESS)
    {
        if( relationRecord != null )
        {
            ++i;

            if( !refCheckService.isSQLFile(relationRecord.source_file) || !refCheckService.isSQLFile(relationRecord.target_file))
            {
                rc = relationRecord.getNext();
                continue;
            }

            // compare whether two fields have the same data type
            if ( refCheckService.isTwoFieldsSameType( relationRecord.source_file, relationRecord.source_field, relationRecord.target_file, relationRecord.target_field ) == false )
            {

                refCheckService.sendMsgToUser( 33, 3, refCheckService.currentUser, [relationRecord.source_file,relationRecord.source_field,relationRecord.target_file,relationRecord.target_field] );
                rc = relationRecord.getNext();
                continue;
            }

            if ( relationRecord.def_type == "CombinedKey" ) {
                rc = relationRecord.getNext();
                continue;
            }

            if ( relationRecord.post_expression == true ) {
                rc = relationRecord.getNext();
                continue;
            }

            if(refCheckService.checkDuplicate( relationRecord ))
            {
                rc = relationRecord.getNext();
                continue;
            }

            if ( !refCheckService.isFieldinFUK(filename, relationRecord.target_field) ){

                // to check whether target only
                var  source_query = "source.field=\""+relationRecord.target_field+"\"";
                var relation = new SCFile("relation", SCFILE_READONLY);
                var count = relation.doCount( source_query );
                var rc2 =  getLastRC();
                relation.doClose();

                if ( rc2 == RC_SUCCESS && count > 0){
                    //not target only
                    rc = relationRecord.getNext();
                    continue;
                }

            }
            
            var sfield = relationRecord["source.field"];
            var sfile  = relationRecord["source.file"];
            var fDbdict=lib.dbdictHelper.initDbdictFile( sfile );
            var fieldType = -1;
            
            var indexComma = sfield.lastIndexOf(',');
            if( indexComma > 0)
            {

                sfield = sfield.substring(indexComma+1);
            }
            
            fieldType = lib.dbdictHelper.getFieldType(fDbdict,sfield);
            
            if( fieldType == 1 || fieldType == 2 ){
              this.checkRecord( relationRecord, refCheckService );
            }
        }

        rc = relationRecord.getNext();
    }
};

LobRecordCheck.prototype.getParents = function( relation )
{
    var parents =  [];
    var hash_set=  {};
    var source_file = relation.source_file;
    var source_field = relation.source_field;
    var query  = "source.file=\""+source_file+"\" and source.field=\""+source_field+"\" and status ~=\"invalid\""+" and (def.type=\"link\" or def.type=\"erddef\") and post.expression~=\"t\"";
    var record =  new SCFile("relation", SCFILE_READONLY);
    var rc = record.doSelect( query );
    if( rc == RC_SUCCESS){ rc = record.getFirst();}

    while(rc == RC_SUCCESS){
        if( !record.post_express && hash_set[record.target_file+record.target_field]==undefined){

            var parent = {};
            parent.target_file = record.target_file;
            parent.target_field = record.target_field;
            parents.push( parent );
            hash_set[record.target_file+record.target_field] = 1;
        }

        rc = record.getNext();
    }

    record.doClose();
    return parents;
};


LobRecordCheck.prototype.checkLobField= function( relationRecord )
{
    var parents = this.getParents(relationRecord);
    var sfile   = relationRecord["source.file"];
    var sfield  = relationRecord["source.field"];


    this.relation_record  = relationRecord;


    if(sfile != null&& sfield != null && parents.length == 1)
    {
        var srecord = new SCFile( sfile , SCFILE_READONLY );

        srecord.setFields(sfield);

        srecord.doSelect("true");

        this.check(sfile,srecord, sfield, parents);
    }
};

LobRecordCheck.prototype.doCheck= function( source_value, parents)
{
    var isOrphan = true;
    var i;
    for( i = 0; i < parents.length; ++i ){

        var parent = parents[i];
        var target_record = new SCFile( parent.target_file , SCFILE_READONLY );
        var tfield = parent.target_field;

        target_record.setFields(tfield);
        var rc2 =RC_SUCCESS;

        rc2 = target_record.doSelect(tfield+"=\""+source_value+"\"");

        target_record.doClose();

        if( rc2 == RC_SUCCESS ){
            isOrphan = false;
            break;
        }

    }

    return isOrphan;
};

LobRecordCheck.prototype.check = function( source_file, source_record, source_field, parents )
{
    if(source_record != null )
    {
        var fDbdict=lib.dbdictHelper.initDbdictFile(source_file);
        var rc1 = source_record.getFirst();
        var fieldType = -1;
        var parent_field;

        while( rc1 == RC_SUCCESS )
        {
            var isOrphan = false;
            if( source_record[source_field] == null)
            {
                this.null_count++;

                rc1 = source_record.getNext();
                continue;
            }
            
            var indexComma = source_field.lastIndexOf(',');
            if( indexComma > 0)
            {

                parent_field = source_field.substring(0,indexComma);
                indexComma = parent_field.lastIndexOf(',');
                
                
                if( indexComma > 0){
                  var direct_parent = parent_field.substring(indexComma+1);
                }
                
                fieldType = lib.dbdictHelper.getFieldType(fDbdict,direct_parent);
            }

            if ( lib.DataTypeConst.typeArray() == fieldType){         
                var field_value = source_record[parent_field];
                var index, index2, length = field_value.length();
                for(index = 0; index < length; index++){
                    var subField = field_value[index];
                    isOrphan=this.doCheck(subField,parents);

                    if( isOrphan ){
                        this.invalid_count++;
                        if( this.reportID == null){
                            this.reportID = this.refCheckService.getReportID();
                        }
                        
                        length = field_value.length();
                        for(index2 = 0; index2 < length; index2++) {
                            this.refCheckService.insertOrphanValue(this.reportID, String(field_value[index2]));
                        }

                     break;
                    }
                }

            }
            else{
                isOrphan = this.doCheck(source_record[source_field], parents);
                if(isOrphan){
                    this.invalid_count++;
                    if( this.reportID == null){
                        this.reportID = this.refCheckService.getReportID();
                    }

                    this.refCheckService.insertOrphanValue(this.reportID, String(source_record[source_field]));
                }
            }

            rc1 = source_record.getNext();
        }
    }
};