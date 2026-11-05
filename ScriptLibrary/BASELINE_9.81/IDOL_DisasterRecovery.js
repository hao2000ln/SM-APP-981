function getRecentScrelationIDs( indexDef , resetTime) {
    //var indexDef = this.indexDef;
    //var lastIndexTime = indexDef["last.index.time"];
    var lastIndexTime = resetTime;
    var filename = indexDef["table.name"];
    var wantedFile = 'probsummary';
    if ( filename !== wantedFile )
      return "";

    if (lastIndexTime)
    {
      var f = new SCFile('screlation', SCFILE_READONLY);
      f.setFields(['source']);

      var q = new QueryCond('sysmodtime', GE, lastIndexTime)
        .and( new QueryCond('source.filename', EQ, 'problem') );
      q = q.asRAD();

      var rc = f.doSelect(q);
      var ids = [];
      var nMaxIDCount = 500;
      var i = 0;
      while ( rc == RC_SUCCESS )
      {
        ids.push( '"' + f.source + '"' );
        rc = f.getNext();

        if ( i++ >= nMaxIDCount )
          break;
      }

      var query = "";
      if ( ids.length > 0 )
      {
        ids = ids.join(',')
        query = ' or ( number isin {' + ids + '} ) ';
      }
    }

    return query;
  }

 function buildIndexQuery( indexDef , resetTime) {
    //var indexDef = this.indexDef;
    //var lastIndexTime = indexDef["last.index.time"];
    var lastIndexTime = resetTime; 
    var filterQuery = indexDef["filter.query"] || 'true';

    var query = filterQuery;
    if (lastIndexTime) {
      //incremental query condition
      //var incQC = new QueryCond('sysmodtime', GT, lastIndexTime);
      var incQC = new QueryCond('sysmodtime', GE, lastIndexTime);
      var addition = incQC.toString().replace(/\[[^\]]+\] -(.*)/, "$1");
      query = [query, addition].join(" and ");
      query += getRecentScrelationIDs( indexDef, resetTime );
    }
    return query;
  }
  
  
  function getDeltaReindexTotalCount( filename , resetTime){
  	  var ret=0;
  	  var indexRecord = lib.aciindex.getIndexRecord(filename);
  	  if(indexRecord){
   	  	var query = buildIndexQuery(indexRecord, resetTime);
      	//print(query);
      	var total = new SCFile(filename, SCFILE_READONLY).doCount(query);
      	return total;
      }
      
      return ret;
  }