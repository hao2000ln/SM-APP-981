var $ = lib.c.$;
var relation_tables =[];
var table_hash =  {};
var dbdictService = $("#relationManagerDbdictService");
var filename_cache = {};

vars.$G_erd_diagram_access_condition = null;

function isAccessible()
{
   if( vars.$G_erd_diagram_access_condition == null){
    
     var menu =  new SCFile("menu", SCFILE_READONLY);
     menu.setFields(["application","pname","pvalue","condition"]);
     var rc = menu.doSelect('name="SQL UTIL MENU"');
     
     if( rc ==RC_SUCCESS){
       var application = menu["application"];
       var pname = menu["pname"];
       var pvalue = menu["pvalue"];
       var conditions = menu["condition"];

       var i;
       var length = application.length();
       for( i =0; i < length;++i){
       
         if(application[i] == "us.launch.internal" && pname[i]=="url" && pvalue[i]=="diagram.jsp"){
         
            var dtype = (typeof conditions[i]);
            var cond;
            if(dtype =="object"){
              cond=conditions[i].getText();
            }
            else{
              cond = conditions[i];
            }
         
           vars.$G_erd_diagram_access_condition = funcs.parse_evaluate(cond,4);
           
           break;
         }      
       }  
     }
   }
   
   return vars.$G_erd_diagram_access_condition;
}

function isFPK(field_name, dbdict_keys )
{
    var isFPK = false;
    field_name = dbdictService.getFieldNameByPath(field_name);

    var primary_key = dbdictService.getPrimaryKey(dbdict_keys);
    if (primary_key != null) {
        var pk_names = primary_key.name;
        if (pk_names.length() == 1 && field_name == dbdictService.getFieldNameByPath(pk_names[0])) {
            isFPK = true;
        }
    }

    if( !isFPK ) {
        var unique_keys = dbdictService.getUniqueKeys( dbdict_keys );
        if( unique_keys != null && unique_keys.length > 0 ){
            var key = unique_keys[0];
            var fisrtUKNames = key.name;
            var i;
            var length = fisrtUKNames.length();
            for( i = 0; i < length; i++){
                if ( field_name == fisrtUKNames[i]) {
                    isFPK =  true;
                    break;
                }
            }
        }
    }

    return isFPK;
}

function isValidTable( fileName )
{
    return filename_cache[ fileName ] == 1;
}

function isRelationBuilt()
{
    var relation = new SCFile("relation", SCFILE_READONLY);
    relation.setFields(["id"]);
    var count = relation.doCount("true");
    return (count > 1);
}

function getRelationInfo( tableName )
{
    var relations =  [];
    var relation_hash = {};
    
    var key1 = null;
    var key2 = null;

    var relationRecord = new SCFile("relation");
    var relation_query = "(source.file=\"" + tableName + "\" or target.file =\""+tableName+"\") and def.type~=\"CombinedKey\" and def.type~=\"relatedObjectMap\"";

    var rc = relationRecord.doSelect( relation_query );

    while( RC_SUCCESS == rc ) {
        key1 = relationRecord["source.file"] + relationRecord["source.field"] + relationRecord["target.file"] + relationRecord["target.field"] + relationRecord["def.type"] + relationRecord["def.query"];
        key2 = relationRecord["target.file"] + relationRecord["target.field"] + relationRecord["source.file"] + relationRecord["source.field"] + relationRecord["def.type"] + relationRecord["def.query"];

        if (relationRecord["status"] != "invalid" || (relationRecord["target.file"] == tableName && isValidTable(relationRecord["source.file"])) || (relationRecord["source.file"] == tableName && isValidTable(relationRecord["target.file"]) ) ) {
            if (relation_hash[key1] == undefined && relation_hash[key2] == undefined) {
                var lnk = "{ \"id\":\""+relationRecord["id"] + "\",";
                lnk += ("\"st\":\"" +relationRecord["source.file"] + "\"," );
                lnk += ("\"sf\":\"" + relationRecord["source.field"] + "\",");
                lnk += ("\"sfa\":\"" + relationRecord["source.field.alias"] + "\",");
                lnk += ("\"tt\":\"" + relationRecord["target.file"] + "\",");
                lnk += ("\"tf\":\"" + relationRecord["target.field"] + "\",");
                lnk += ("\"tfa\":\"" + relationRecord["target.field.alias"] + "\",");
                lnk += ("\"dt\":\"" + relationRecord["def.type"] + "\",");
                lnk += ("\"ss\":\"" + relationRecord["status"] + "\",");
                var defQuery = relationRecord["def.query"];
                if( defQuery != null){
                    defQuery = defQuery.replace(/\"/g, "\\\"");
                }
                lnk += ("\"dq\":\"" + defQuery + "\",");
                lnk += ("\"rt\":\"" + relationRecord["relType"] + "\"}");

                relations.push(lnk);
                relation_hash[key1] = 1;
            }

            if( table_hash[relationRecord["target.file"]] == undefined )
            {
                addTable(relationRecord["target.file"]);
                table_hash[relationRecord["target.file"]] = 1;
            }

            if( table_hash[relationRecord["source.file"]] == undefined )
            {
                addTable(relationRecord["source.file"]);
                table_hash[relationRecord["source.file"]] = 1;
            }

        }

        rc = relationRecord.getNext();
    }

    relationRecord.doClose();

    return relations;
}

function addTable( tname ){
    relation_tables.push( tname );
}

function getCaption( tname ){

    var fmsg = new SCFile("scmessage");
    var rc = fmsg.doSelect("class=\"tablename\" and message.id=\""+tname+"\"");
    if(rc == RC_SUCCESS){ return fmsg["message"];}
    return "";
}

function isAlias(previous_field, field)
{
   return( previous_field["index"] == field["index"] && previous_field["level"] == field["level"]);
}

function getTablesColumnInfo( )
{
    var tables_info =  [];
    var key = false;
    var temp;
    var field;
    var name = "";
    var type =  "";
    var sqlname = "";
    var sqltype = "";
    var sqltable = "";
    var flevel ="";
    var findex = "";
    var target;
    var _str = funcs.str;
    var dt = new SCDatum();
    dt.setType( 8 );
    dt.setValue(relation_tables );
    var query = "name isin "+_str( dt );
    var fdbdict =  new SCFile("dbdict");
    var rc = fdbdict.doSelect( query );

    while( rc == RC_SUCCESS ){
        target = dbdictService.getValidDbdictWithCacheByName(fdbdict["name"]);
        var tname = fdbdict["name"];
        var tcaption = getCaption( tname );
        tcaption = tcaption.replace(/\"/g, "\\\"");
        var sql_tables = target["sql.tables"];
        var sqlTables = {};
        var index;
        var length = sql_tables.length();
        for(index = 0; index < length; index++){
            sqlTables[sql_tables[index].sql_table_alias] = sql_tables[index].sql_table_name;
        }

        temp = "{ \"name\":\""+tname+"\"";
        temp +=(",\"caption\":\""+tcaption+"\"");

        if( fdbdict != null)
        {
            temp +=",\"columns\":[";

            var i;
            length = fdbdict.field.length();
            for ( i = 0; i < length; ++i)
            {
                field =  fdbdict.field[i];
                
                if( i > 0 && isAlias(fdbdict.field[i-1], field)){
                    continue;
                }
                
                flevel = ""+field["level"];
                findex = field["index"];

                sqlname = field["sql.field.options"].sql_column_name;
                type =  field["type"];

                name = field["name"];
                sqltype = field["sql.field.options"].sql_data_type;
                var sqlTableAlias = field["sql.field.options"].sql_table_alias;
                var sqlTableName = sqlTables[sqlTableAlias];
                key = isFPK(name, target["key"]);

                if( i > 0 )
                {
                    temp += ",";
                }

                temp +="{ \"ln\":\"";
                temp +=(name+"\",");

                temp += ("\"lv\":\""+field["level"]+"\",");

                temp += ("\"lt\":\""+type+"\",");
                temp += ("\"sn\":\""+sqlname+"\",");
                temp += ("\"st\":\""+sqltype+"\",");
                temp += ("\"sta\":\"" + sqlTableAlias +"\",");
                temp += ("\"stn\":\"" + sqlTableName +"\"");
                if( key ){
                    temp += (",\"k\":\"true\"");
                }

                temp +="}";
            }

            temp+="]";
        }

        temp += "}";

        tables_info.push(temp);
        rc = fdbdict.getNext();
    }

    fdbdict.doClose();
    return tables_info;
}


function cacheDBDictFileNames()
{
   if ( filename_cache["cached"] != 1){
      var dbdt =  new SCFile("dbdict",SCFILE_READONLY);
       dbdt.setFields("name");
      var rc = dbdt.doSelect(true);
      while( rc == RC_SUCCESS ){
        filename_cache[dbdt["name"]] = 1;
        rc = dbdt.getNext();

    }
    
    filename_cache["cached"]=1;
  }
}
function getTableByCaption( captionName)
{
    var query = 'class="tablename" and message="'+captionName+'"';

    var fmsg = new SCFile("scmessage",SCFILE_READONLY);
    fmsg.setFields(["message.id","message"]);
    var rc =  fmsg.doSelect( query );

    if( rc == RC_SUCCESS)
    {
        return fmsg["message.id"];
    }
    else
    {
        return null;
    }
}

function getERDData( tableName )
{
  var erddata = "";
    
  if( isAccessible() ){
    var relation_info =null;
    var flag ="\"flag\":";
    var tname = "";
    var caption_name="";
    var subindex = tableName.lastIndexOf("-");
    if( subindex > -1)
    {
        caption_name = tableName.substring(0,subindex);
        tname = tableName.substring(subindex+1);
    }
    else
    {
        tname = tableName;
        caption_name = tableName;
    }

    tname = tname.replace(/(^\s*)|(\s*$)/g, "");
    caption_name = caption_name.replace(/(^\s*)|(\s*$)/g, "");
    cacheDBDictFileNames();

    var tname2 = getTableByCaption(caption_name);

    var validTable  =(tname2 != null ? true :false);
    if(!validTable){

        validTable = isValidTable( tname );
    }
    else
    {
      tname = tname2;
    }

    var isBuilt = isRelationBuilt();
    var mtname= tname.replace(/\"/g, "\\\"");

    var displayField = '"displayField":"' + lib.DisplayName.getRefTableDisplayField(tname) + '",';
    var relations = "\"mainTable\":\""+mtname+"\","+ displayField +"\"relations\":[";
    var tables_info = "\"tables\":[";

    if( validTable && isBuilt ){
        relation_info  = getRelationInfo( tname );
        relations += relation_info.toString();
        tables_info  += getTablesColumnInfo();
        flag += "\"0\",";

    }
    else if ( !isBuilt ){
        flag += "\"2\",";
    }
    else {
        flag += "\"1\",";
    }
    relations +="],";
    tables_info +="]";
    erddata = "{"+flag+relations+tables_info+"}";
  }
  return erddata;
}

function searchTables( arg )
{
  if( isAccessible() ){
    var obj = JSON.parse(arg);
    var fuzzySearch = false;
    var header = "{\"tables\":[";
    var tailer = "]}";
    var strtables = "";
    var caption="";
    var tname="";

    var name = obj.name;
    var count = obj.count;
    if( name == '***'){ fuzzySearch = true;}
    
    cacheDBDictFileNames();
    
    var fmsg = new SCFile("scmessage",SCFILE_READONLY);
    fmsg.setFields(["message.id","message"]);
    fmsg.setOrderBy(["message"],[SCFILE_ASC]);
    
    if( !fuzzySearch ){
    
      var rcount = 0;
    
      var subindex = name.lastIndexOf("-");
      if( subindex > 0){
          name = name.substring(subindex+1);
      }
      name = name.replace(/(^\s*)|(\s*$)/g, "");

      var query = 'class="tablename" and (message.id like "'+name+'*" or message like "'+name+'*")';
      
      var rc =  fmsg.doSelect( query );

      if(rc == RC_SUCCESS)
      {
        while(RC_SUCCESS == rc  && rcount < count)
        {
            caption = fmsg["message"].replace(/\"/g, "\\\"");
            tname = fmsg["message.id"];
            if(filename_cache[tname] != 1){
              rc = fmsg.getNext();
              continue;
            }
            
            tname = tname.replace(/\"/g, "\\\"");
            
            if(strtables.length > 1)
            {
                strtables +=",";
            }
            
            strtables += "\"";
            strtables += caption+" - " +tname;
            strtables += "\"";
            rc = fmsg.getNext();
            rcount++;
        }
      }
    }
    else
    {
        var query2 = 'class="tablename"';
        rc = fmsg.doSelect( query2 );
        
        while(RC_SUCCESS == rc )
        {
            caption = fmsg["message"].replace(/\"/g, "\\\"");
            tname = fmsg["message.id"];
            
            if(filename_cache[tname] != 1){
              rc = fmsg.getNext();
              continue;
            }
            
            tname = tname.replace(/\"/g, "\\\"");
            
            if(strtables.length > 1)
            {
                strtables +=",";
            }
            
            strtables += "\"";
            strtables += caption+" - " +tname;
            strtables += "\"";
            rc = fmsg.getNext();
        }
    }

    return header+strtables+tailer;
   }
   else
   {
     return "";
   }
}