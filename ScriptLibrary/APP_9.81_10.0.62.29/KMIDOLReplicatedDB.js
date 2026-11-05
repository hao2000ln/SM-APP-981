//**************************************************************
//this library for handle replicated db for KM IDOL Index
//now only adhoc file support replicated db in RTE
//so we have to convert all query to adhoc query
//if rte have father support, just remove this
//powered by HPE 2016/11/30
//**************************************************************

//add logger
var logger = getLog('KMIDOLReplicatedDB');

//get the status from db instead of glocal variable
function getReplicateDBSetting()
{
  //var f = new SCFile("environment",SCFILE_READONLY);
  //var rc = f.doSelect("name=\"knowledge management\"");
  //if(rc ==0)
  //{
 //   return f.replicate_db;
 // }
 //always return false before we want to enable this feature
  return false;
}

// make one field ahoc query
//joinfields all fields define in joindefs
//file1 joindefs file 1
//file2 joindefs file 2
//file1key the join key of file1
//file2key the join key of file2
//return correct adhoc query field string
function makeOneField(file1, file2, joinfields, field, file1key, file2key)
{
  for(var i=0; i<joinfields.length(); i++)
  {
    if(joinfields[i] == file1+","+field || joinfields[i] == field)
    {

       return field;
    }
    else if (joinfields[i] == file2+","+field)
    {
      return file1+";"+file1key+";"+file2+";"+file2key+";"+file2+";"+field;
    }
  }
  
  print("don't find match field for "+field);
}

function queryConvertor(ast,joinfields, file1, file2, file1key, file2key)
{
   var type = ast.NodeType();
   if( type == "OPERATOR" )
   {
     var op = ast.OP();
     var subnode = ast.NodeValue();
     if( subnode.length > 1)
     {
       return "("+queryConvertor(subnode[0],joinfields, file1, file2, file1key, file2key)+" "+op+" "+queryConvertor(subnode[1],joinfields, file1, file2, file1key, file2key)+")";
     }
    
     return " ("+op+" "+queryConvertor(subnode[0],joinfields, file1, file2, file1key, file2key)+")";
   }
   else
   {
     if( type == "FIELD2" )
     {
        var field = ast.NodeValue();
        //convert this field to new field
        var field = makeOneField(file1, file2, joinfields, field, file1key, file2key);
        return field;
     }
     else if (type == "TIME" )
     {
       var now = new XMLDate(new Date(ast.NodeValue().getTime()));
       return "'"+now.getSCDateTimeString()+"'";
     }
     else if(type == "STRING2" )
     {
       return "\""+ast.NodeValue()+"\"";
     }
     else if(type == "ARRAY")
     {
       //var arr = ast.NodeValue().toArray();
      // print(arr);
      // print(ast.NodeValue());
       var childnode = ast.NodeValue();
       var str ="{";
       for(var i =0;i<childnode.length;i++)
       {
         print(childnode[i]);
         if(i>0) str +=",";
         if(typeof childnode[i] == "string" )
         {
           str +="\""+childnode[i]+"\"";
         }
         else
         {
           str +=childnode[i];
         }
      }
      str +="}";
      return str;
    } else if (type == "NUMBER") {
      return ast.NodeValue();
    }
  }
   
}
//convert a sm normal query to adhoc query
// query sm norma query
// joinfields all fields define in joindefs
//file1 joindefs file 1
//file2 joindefs file 2
//file1key the join key of file1
//file2key the join key of file2
//return adhoc query
function convertToAdhocQuery(query, joinfields, file1, file2, file1key, file2key)
{
  if(query=="" || query =="true" || query =="TRUE")
  {
     //no query condition here
    return query;
  }
  var ast = parseQuery(query);
  var newQuery = queryConvertor(ast, joinfields, file1, file2, file1key, file2key);
  return newQuery;
}

//handle join file 
//fKmKnowledgebase the knowledgebase record=>scfile instance
//fileName : the filename to do index
//fieldSet: the fields to index 
//query: query condition against the index
//return adhoc sql
//limitation, only support simple join file, tow single file join
function makeAdhocQueryForJoin(fKmKnowledgebase, fileName, queryfields, query, mainfile)
{
   //first get join define
   var f = new SCFile("joindefs",SCFILE_READONLY);
   var rc = f.doSelect("join.name=\""+fileName+"\"");
   if( rc != RC_SUCCESS)
   {
     throw "can't find joindefs "+fileName;
   }
   //get join table names,
   
   if( f.join_tables == null || f.join_tables.length() != 2)
   {
      throw "wrong joindefs or not supported joindef for"+fileName;
   }
   //second check all file are not joinfile
   var erdf = new SCFile("erddef",SCFILE_READONLY);
   var file1=f.join_tables[0].table_name;
   var file2=f.join_tables[1].table_name;
   //adjust the main sequence
   if( file2 == mainfile)
   {
     file2 = file1;
     file1 = mainfile;
   }
   rc = erdf.doSelect("file1=\""+file1+"\" and file2=\""+file2+"\"");
   if(rc != RC_SUCCESS)
   { 
     throw "not supported joinquery due to can't find erddef for "+"file1=\""+file1+"\" and file2=\""+file2+"\"";
   }
   var file1key =erdf.file1_names[0];
   var file2key=erdf.file2_names[0];
   
   //print("find the erd key:"+file1key+" file2key:"+file2key);
   //now make the select list
   var numfields = queryfields.length;

   var newQuery=convertToAdhocQuery(query, f.field_names,file1, file2, file1key, file2key);
   //print("fix the query to :"+newQuery);
   var arrayfields =[];
   for (var i = 0; i< numfields; i++)
   {
      //var one_field = queryfields[i].replace(/_/g,".");
      arrayfields.push( makeOneField(file1,file2,f.field_names,queryfields[i],file1key,file2key));
   }
   var sql = system.functions.generate_sql_query(arrayfields, newQuery, file1, true);
   print(sql);
   return sql;
}

//handle none jone file 
//fKmKnowledgebase the knowledgebase record=>scfile instance
//fileName : the filename to do index
//queryfields: the fields to index 
//query: query condition against the index
//return adhoc sql
function makeAdhocQuery(fKmKnowledgebase, fileName, queryfields, query)
{
   var sql = system.functions.generate_sql_query(queryfields, query, fileName, true);
   return sql;
}

//find main file for joinfile 
//fKmKnowledgebase the knowledgebase record=>scfile instance
//fileName : the filename to do index
//field: one field to find belong to
//return the field's file name
function findMainFile(fKmKnowledgebase, fileName, field)
{
   var f = new SCFile("joindefs",SCFILE_READONLY);
   var rc = f.doSelect("join.name=\""+fileName+"\"");
   if( rc != RC_SUCCESS)
   {
     throw "can't find joindefs "+fileName;
   }
   //get join table names,
   
   if( f.join_tables == null || f.join_tables.length() != 2)
   {
      throw "wrong joindefs or not supported joindef for"+fileName;
   }
   var file1=f.join_tables[0].table_name;
   var file2=f.join_tables[1].table_name;
   for(var i=0; i<f.field_names.length(); i++)
  {
    if(f.field_names[i] == file1+","+field || f.field_names[i] == field)
    {

       return file1;
    }
    else if(f.field_names[i] == file2+","+field)
    {
      return file2;
    }
  }
}
//check  index fields existing or not 
//kmknowledgebase the file of km define
//return true, all fields existing 
function checkIndexFieldList(kmknowledgebase)
{
  	var fields =[];
    fields.push(kmknowledgebase.docid);//docid already the first one
    for( var i=0;i<kmknowledgebase.kbfields.length(); i++)
    {
       fields.push(kmknowledgebase.kbfields[i].kbfieldname);
    }
    return isFieldsExistingInFile(fields,kmknowledgebase['sclibtablename']);
}
//check field existing or not 
//fields array include all  filed name
//fileName : the filename to check
//return true, all fields existing 
function isFieldsExistingInFile(fields, fileName)
{
  	var table = new SCFile( "datadict", SCFILE_READONLY);
	var sql = "name=\""+fileName+"\"";
	var rc = rc =table.doSelect( sql );
	var isOkay = true;
	if( rc == RC_SUCCESS)
	{
	  for( var i=0; isOkay && i< fields.length; i++ )
	  {
	    var indexp = system.functions.index( fields[i].replace(/^\s*/, '').replace(/\s*$/, ''), table.fields );
	    if(fields[i].replace(/^\s*/, '').replace(/\s*$/, '') === "guids"){
	       continue;
	    }
		if ( indexp <= 0 )
		{
		   isOkay = false;
		   system.functions.msg(system.functions.scmsg('no_field', 'KMReindex',[fields[i]]), 2);
		   //print("Can't find the field ["+fields[i]+"] in dbdict");
		}
	  }
	}
	return isOkay;
}
//get the index record  count
//knowledgebase the kmknowledgebase file object
//fileName : the filename to check
//return the index record count 
function getIndexRecordCount(knowledgebase, fileName, query)
{
    var scfile = new SCFile(fileName, SCFILE_READONLY);
    var ttNumber = 0;
    var replica_db = getReplicateDBSetting();
    var globalReplicateDB = system.functions.sysinfo_get( "EnableReplicateDB" );
    //scfile.isJoinFile() || () dislabe this feature before we want to enable this
    if(globalReplicateDB && replica_db ) 
    {
       //print("use replicate db");
        var sql ="";
        var fields =[];
        fields.push(knowledgebase.docid);
        if(scfile.isJoinFile())
         { 
           var mainfile = lib.KMIDOLReplicatedDB.findMainFile(knowledgebase, fileName, knowledgebase.docid);
           scfile = new SCFile(mainfile, SCFILE_READONLY);
           sql = makeAdhocQueryForJoin(knowledgebase, fileName, fields, query, mainfile); 
           //replicatedindex = true;          
         }
         else
         {
           sql= makeAdhocQuery(knowledgebase, fileName , fields, query)
         }
         if( globalReplicateDB && replica_db )
         {
           scfile.setFlag("USE_REPLICATE_DB", replica_db );
           logger.info("USE_REPLICATE_DB is enable for this query");
         }
         var pos = sql.indexOf(" FROM ");
         sql = sql.substring(pos);
         sql = "SELECT count(*)" +sql;
         logger.info("use ahoc to query count:"+sql);
         var rc = scfile.doSelect(sql);
         ttNumber = scfile[0];
    }
    else
    {  
      ttNumber = scfile.doCount(query);
    }
    return ttNumber;
}