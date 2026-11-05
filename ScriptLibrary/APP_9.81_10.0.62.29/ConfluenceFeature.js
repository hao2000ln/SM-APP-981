var  XQuery = lib.XQuery.require();
var IDOLKMSecurity= lib.IDOLKMSecurity.require();
var IDOLClientFactory =lib.IDOLClientFactory.require();

//idol_field is defined in the okm xml template or add by the parse.lua
var conf_fields=[
  {idol_field:"DRECONTENT",sm_field:"resolution",display:"Solution",type:"array"}
  ];

function isConfluence()
{
  return true;
}

function isConfluenceDocument(query, database, reference)
{
  var testFunc="lib."+database+"_ConfluenceFeature.isConfluence()";
  try
  {
    if(eval(testFunc))
    {
      return true;
    }
  }
  catch(e)
  {
     //just check it is there or not
    // print(e);
  }
  return false;
}
function applyKmKnowledgebaseDefaultValue(record)
{
  record.kbfields[0].kbfieldname="SPACE_NAME";
  record.kbfields[0].kbfieldvalue="Space name";
  record.kbfields[0].kbfieldtype="String";
  record.kbfields[0].hitlist= true;
  record.kbfields[0].match= false;
  record.kbfields[0].sort= 1;
  
  
  record.kbfields[1].kbfieldname="REPOSITORY_METADATA_TYPE_STRING";
  record.kbfields[1].kbfieldvalue="Category";
  record.kbfields[1].kbfieldtype="String";
  record.kbfields[1].match= false;
  record.kbfields[1].hitlist= true;
  record.kbfields[1].sort= 2;
  
  record.kbfields[2].kbfieldname="VERSION_BY_USERNAME";
  record.kbfields[2].kbfieldvalue="Author";
  record.kbfields[2].kbfieldtype="String";
  record.kbfields[2].match= false;
  record.kbfields[2].hitlist= true;
  record.kbfields[2].sort= 3;
   
  record.kbfields[3].kbfieldname="VERSION_WHEN";
  record.kbfields[3].kbfieldvalue="Publish date";
  record.kbfields[3].kbfieldtype="StringDate";
  record.kbfields[3].match= false;
  record.kbfields[3].hitlist= true;
  record.kbfields[3].sort= 4;

}

function getDisplayValue(value, type)
{
  if(type =="StringDate")
  {
     var dt = new Date(value);
     return dt.toString();
  }
  return value;
}
 function getContent(library, reference) {
    var para = {
      action : 'GetContent',
      DatabaseMatch : library.kbname,
      Reference:reference
    };
    if(!library['no.security'])
    {
      var securityinfo = IDOLKMSecurity.getSecurityInfo(funcs.operator());
      if(securityinfo && securityinfo.securityinfo)
      {
         para["securityinfo"] = securityinfo.securityinfo;
      }
    }
    var client = IDOLClientFactory.create('GlobalSearch');
    var doc = client.executeAction(para);
    return doc;
  }
//use solution for confluence to interaction
//record    => current file content
//library   => kmlibrary record
//reference => reference for current search result
//keyword   => current search text
function useSolution(record, library, reference, keyword)
{
  var doc = getContent(library, reference);
  var i=0;
  for(i=0;i<conf_fields.length;i++)
  {
     var path = 'responsedata/autn:hit/autn:content/DOCUMENT/'+conf_fields[i].idol_field;
     var value = XQuery.queryOne(path, doc);
     var smfield = conf_fields[i].sm_field;
     if(value)
     {
       if(conf_fields[i].type=="array")
       {
         if(record[smfield] == null) 
         {
            record[smfield] = [];
         }
         else
         {
            var ar = system.functions.denull(record[smfield]);
            record[smfield] = ar;
         }
         record[smfield].push(value.getValue());
       }
       else
       {
         record[smfield]=value.getValue();
       }
     }
  }
}

//after usesolution, set the cursor
function getSolutionCursorField(file)
{
  return "resolution";
}