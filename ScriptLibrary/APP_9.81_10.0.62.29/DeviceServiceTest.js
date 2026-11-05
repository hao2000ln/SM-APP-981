var $ = lib.c.$;

function getLogicalNameByDisplayName(displayName){
      var rtn = displayName;
      var device = $("device" ,SCFILE_READONLY) ;
      var sql = 'display.name="'+displayName+'"';
      //printMe( "getLogicalNameByDisplayName(); sql="+sql );
      var record = device.setFields(['logical.name']).select(sql).uniqueResult();
      if( record != null ){
            rtn = record.logical_name;
      }
      return rtn;
}

//print( getLogicalNameByDisplayName("Applications") );
