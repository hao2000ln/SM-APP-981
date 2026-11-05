var _ = lib.Underscore.require();

var IDOLIndexFetcher = (function() {

  var replicaDBFetcher = {
    query : function(filename, query, fields, orders) {
      throw new Error('replica database is not availabe at this time');
      /*
      var scfile = new SCFile(filename, SCFILE_READONLY);
      var adhocquery;
      if(scfile.isJoinFile()) { 
        var mainfile = lib.KMIDOLReplicatedDB.findMainFile(scfile, filename, keyField);
        scfile = new SCFile(mainfile, SCFILE_READONLY);
        scfile.setOrderBy(fields, [SCFILE_DSC]);
        adhocquery = lib.KMIDOLReplicatedDB.makeAdhocQueryForJoin(scfile, filename, fields, query, mainfile);           
      } else {
        adhocquery= lib.KMIDOLReplicatedDB.makeAdhocQuery(scfile, filename, fields, newquery)
      }
      scfile.setFlag("USE_REPLICATE_DB", true);
      logger.info("use replica db to perform query:" + newquery);
      scfile.doSelect(adhocquery);
      return scfile;
      */
    }
  };
  /*
    unique key field has to be the first element in `fields` array. 
  */
  var normalDBFetcher = {
    query : function(filename, query, fields, orders) {
	    var sql = "select distinct " + fields[0] + " from " + filename
	            + " where " + (query || 'true') + ' order by ' + fields[0] + ' desc'; 
	    var scfile = new SCFile(filename, SCFILE_READONLY);
	    var mainfile = '';
	    if(scfile.isJoinFile()) {
	     // mainfile = lib.KMIDOLReplicatedDB.findMainFile("", fileName, field);
	      sql = getJoinFileSql(filename, query, fields, ["desc"]);
	    }
	    scfile.doSelect(sql);
	    return scfile;
     },

     //QCCR1E147677: use normal scfile select to get data, not adhoc sql, to avoid notorious "2 million records" issue
     queryOptimized: function(filename, query, fields, orders){
        var sql = query || 'true';
        var scfile = new SCFile(filename, SCFILE_READONLY);
        scfile.setFields([fields[0]]);
        scfile.setOrderBy([fields[0]], [SCFILE_DSC]);
        scfile.doSelect(sql);
        return scfile;
     }
  };
  function getJoinFileSql(fileName, query, fields, orders) {
    field = fields[0];
      var f = new SCFile("joindefs",SCFILE_READONLY);
      var rc = f.doSelect("join.name=\""+fileName+"\"");
      var mainfile = '',secfile = '';
      if( rc != RC_SUCCESS) {
        throw new Error("can't find joindefs "+fileName);
      }
      //get join table names,
   
      if( f.join_tables == null || f.join_tables.length() != 2) {
        throw new Error("wrong joindefs or not supported joindef for"+fileName);
      }
      var file1=f.join_tables[0].table_name;
      var file2=f.join_tables[1].table_name;
      for(var i=0; i<f.field_names.length(); i++) {
        if(f.field_names[i] == file1+","+field || f.field_names[i] == field) {
          mainfile = file1;
          secfile=file2;
        } else if(f.field_names[i] == file2+","+field) {
          mainfile = file2;
          secfile=file1;
        }
    
      }
      //first get join define
      var erdf = new SCFile("erddef",SCFILE_READONLY);
      rc = erdf.doSelect("file1=\""+mainfile+"\" and file2=\""+secfile+"\"");
      if(rc != RC_SUCCESS)  { 
        throw new Error("not supported joinquery due to can't find erddef for "+"file1=\""+file1+"\" and file2=\""+file2+"\"");
      }
      var mainkey =erdf.file1_names[0];
      var seckey=erdf.file2_names[0];
      var sql = 'select distinct ' + field + ' from ' + mainfile + ' ta01 '
             + 'left join ' + secfile + ' ta02 on (ta01.' + mainkey + '= ta02.' + mainkey + ') where ' + (query || 'true')
             + ' order by ' + field + ' ' + orders[0]; 
      
      return sql;
    }

  function createDBFetcher(chooseReplica) {
    var isReplicaDBAvailable = funcs.sysinfo_get("EnableReplicateDB");
    var isKMUseReplicaDB = lib.KMIDOLReplicatedDB.getReplicateDBSetting();
    var isUseReplica = isReplicaDBAvailable && isKMUseReplicaDB && chooseReplica;
    return isUseReplica ? replicaDBFetcher : normalDBFetcher;
  }

  return {
    create :createDBFetcher
  };
}());

function require() {
  return IDOLIndexFetcher;
}

