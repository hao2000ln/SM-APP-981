var  XQuery = lib.XQuery.require();
var IDOLGlobalSearchPreview= lib.IDOLGlobalSearchPreview.require();

//idol_field is defined in the okm xml template or add by the parse.lua
var okm_fields=[
  {idol_field:"CATEGORY",sm_field:"category",display:"Category",type:"string"},
  {idol_field:"SUBCATEGORY",sm_field:"subcategory",display:"Subcategory",type:"string"},
  {idol_field:"AREA",sm_field:"product.type",display:"AREA",type:"string"},
  {idol_field:"AFFECTED_SERVICE",sm_field:"affected.item",display:"Affected Service",type:"string"},
  {idol_field:"ASSIGNMENT",sm_field:"assignment",display:"Assignment",type:"array"},
  {idol_field:"DREREFERENCE",sm_field:"document.id",display:"Doc ID",type:"string"},
  {idol_field:"DRECONTENT",sm_field:"resolution",display:"Solution",type:"array"}
  ];


function isOkmlib()
{
  return true;
}

function getOKMParseScriptName()
{
  //this script should be the oracle connector folder
  return "okmparse.lua";
}

function getOKMViewUrl(reference)
{
  //this need change to your own okm view server, so that you can open it in the okm system
  return "https://myokmserver.com/index?page=content&id="+reference;
}

function needCustimizePrview( file)
{
  if( system.functions.filename(file) == "incidents")
  {
    return true;
  }
  return false;
}

// return format "data":[{"name":"owner.name","caption":"Owner Name","value":"falcon"},{"name":"open","caption":"Status","value":"Categorize"}]
//doc: the current document idol query result
//filename: the filename,for okm, it should be incidents
function getPreviewData(doc, filename)
{
  var data =[];
  for(var i=0;i<okm_fields.length;i++)
  {
     var path = 'responsedata/autn:hit/autn:content/DOCUMENT/'+okm_fields[i].idol_field;
     var value = XQuery.queryOne(path, doc);
     if(value)
     {
       var text = value.getValue();
       if(text && text.length > 1024)
       {
         var idx = text.indexOf(" ",1024);
         if(idx == -1)
         {
           idx = 1024;
         }
         text = text.substr(0,idx)+"...";
       }
       var oneitem={ name:okm_fields[i].sm_field, caption: okm_fields[i].display, value: text };
       data.push(oneitem);
     }
  }
  return data;

}
//get the display value for pluck field
//now just format the date time
function getDisplayValue(value, type)
{
  if(type != "Date" || !value)
  {
    return value;
  }
  var newdate= parseDate(value, getNLS_DATE_FORMAT());
  if(newdate)
  {
    return lib.tzFunctions.convertDatetoString(newdate,vars["$lo.date.order"]);
  }
  else
  {
    return value;
  }
}

function parseDate(strDate, strFormat)
{  
   if(!strDate || !strFormat )
   {  
        return null;  
   }  
   var regFormat = /(\w{4})|(\w{2})|(\w{1})|(\w{2}24)/g; 
   var regDate = /(\d{4})|(\d{2})|(\d{1})/g;  
   var formats = strFormat.match(regFormat);  
   var dates = strDate.match(regDate);  
   if(!formats || !dates || formats.length != dates.length)
   {
     return null;  
   }
   var tmpDate = new Date();
   for(var i = 0; i < dates.length; i++)
   {  
     var format = formats[i];  
     if(format === "yyyy")
     {  
       tmpDate.setFullYear(parseInt(dates[i], 10));  
     }else if(format == "yy")
     {  
       var prefix = (tmpDate.getFullYear() + "").substring(0, 2);  
       var year = (parseInt(dates[i], 10) + "").length == 4? parseInt(dates[i], 10): prefix + (parseInt(dates[i], 10) + "00").substring(0, 2);  
       var tmpYear = parseInt(year, 10);  
       tmpDate.setFullYear(tmpYear);  
     }
     else if(format == "MM" || format == "M"||format=="mm")
     {  
       tmpDate.setMonth(parseInt(dates[i], 10) - 1);  
     }else if(format == "dd" || format == "d")
     {  
       tmpDate.setDate(parseInt(dates[i], 10));  
     }else if(format.substr(0,1)=="H" || format.substr(0,1)=="h")
     {  
       tmpDate.setHours(parseInt(dates[i], 10));  
     }else if(format == "mi")
     {  
       tmpDate.setMinutes(parseInt(dates[i], 10));  
     }else if(format == "ss" || format == "s")
     {  
       tmpDate.setSeconds(parseInt(dates[i], 10));  
     }  
   }  
   return tmpDate;  
}  

// get the NLS_DATE_FORMAT setting
//linux  export  NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS '
function getNLS_DATE_FORMAT()
{
  return "dd/MM/yyyy hh24:mi:ss";
}

function applyKmKnowledgebaseDefaultValue(record)
{
  record.kbfields[0].kbfieldname="CHANNEL";
  record.kbfields[0].kbfieldvalue="Channel";
  record.kbfields[0].kbfieldtype="String";
  record.kbfields[0].match= true;
  
  
  record.kbfields[1].kbfieldname="CONTENTCATEGORY";
  record.kbfields[1].kbfieldvalue="Categories";
  record.kbfields[1].kbfieldtype="String";
  record.kbfields[1].match= false;
  record.kbfields[1].hitlist= true;
  record.kbfields[1].sort= 4;
  
  record.kbfields[2].kbfieldname="PUBLISH";
  record.kbfields[2].kbfieldvalue="Published date ";
  record.kbfields[2].kbfieldtype="Date";
  record.kbfields[2].match= false;
  record.kbfields[2].hitlist= true;
  record.kbfields[2].sort= 5;
   
  record.kbfields[3].kbfieldname="DOCUMENTID";
  record.kbfields[3].kbfieldvalue="Doc ID";
  record.kbfields[3].kbfieldtype="String";
  record.kbfields[3].match= false;
  record.kbfields[3].hitlist= true;
  record.kbfields[3].sort= 1;
  
  record.kbfields[4].kbfieldname="AUTHOR";
  record.kbfields[4].kbfieldvalue="Author";
  record.kbfields[4].kbfieldtype="String";
  record.kbfields[4].match= false;
  record.kbfields[4].hitlist= true;
  record.kbfields[4].sort= 3;
  
  record.kbfields[5].kbfieldname="VERSION";
  record.kbfields[5].kbfieldvalue="Version";
  record.kbfields[5].kbfieldtype="String";
  record.kbfields[5].match= false;
  record.kbfields[5].hitlist= true;
  record.kbfields[5].sort= 2;
}


//use solution for okm to interaction
//record    => current file content
//library   => kmlibrary record
//reference => reference for current search result
//keyword   => current search text
function useSolution(record, library, reference, keyword)
{
  var doc =IDOLGlobalSearchPreview.getContent(library.kbname,reference);
  var solution = createSolutionFile(doc);
  
  for(var i=0;i<okm_fields.length;i++)
  {
     if(solution[okm_fields[i].sm_field])
     {
       record[okm_fields[i].sm_field]=solution[okm_fields[i].sm_field];
     }
  }
  //apply template if we have exactly template, depends on the solution content
  applyTemplate(record, doc);
}
//apply template if need
function applyTemplate(record, doc)
{
   var template=XQuery.queryOne('responsedata/autn:hit/autn:content/DOCUMENT/APPLY_TEMPLATE', doc);
   if(template)
   {
     //if have more than one template, we need parse the really value
     var tmpname= template.getValue();
     var f = new SCFile("Template");
	 var ret = f.doSelect("name=\""+tmpname+"\"");
     if (ret == RC_SUCCESS) 
     {
        lib.Template.applyTemplate(record, f, false);
     }
   }
}

//create related file, then use this file to usesolution
function createSolutionFile(doc)
{
  if(!doc)
  {
    return null;
  }
  var f = new SCFile("incidents");
  var found = false;
  for(var i=0;i<okm_fields.length;i++)
  {
     var path = 'responsedata/autn:hit/autn:content/DOCUMENT/'+okm_fields[i].idol_field;
     var value = XQuery.queryOne(path, doc);
     if(value)
     {
       if(okm_fields[i].type=="array")
       {
         f[okm_fields[i].sm_field].push(value.getValue());
       }
       else
       {
         f[okm_fields[i].sm_field]=value.getValue();
       }
       found = true;
     }
  }
  if(found)
  {
    f.open="Resolved";
  }
  
  return f;
}
//after usesolution, set the cursor
function getSolutionCursorField(file)
{
  return "resolution";
}