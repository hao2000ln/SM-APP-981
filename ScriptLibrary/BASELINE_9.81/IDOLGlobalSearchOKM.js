var  XQuery = lib.XQuery.require();
var IDOLGlobalSearchPreview= lib.IDOLGlobalSearchPreview.require();
//var IDOLAssistantUseSolution =lib.IDOLAssistantUseSolution.require();
//global init, if you change your format, just modify here

function applyDefaultValue(km)
{
  if(km.kbtype != 'okmlib' || !km.featurescript)
  {
    return;
  }
  km.kbfields=[];
  try
  {
    eval('lib.'+km.featurescript+'.applyKmKnowledgebaseDefaultValue(km)');
  }
  catch(e)
  {
  }
}
function isOkmDocument(query, database, reference)
{
  if( query =="okm" )
  {
    return true;
  }
  if( !database || !reference )
  {
    return false;
  }
  var testFunc="lib."+database+"_OKMFeature.isOkmlib()";
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
  /***myabe we didn't need this************
  var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
  var rc = kmbase.doSelect('kbname="'+database+'"');
  if( rc == RC_SUCCESS && kmbase.kbtype == "okmlib" )
  {
    return true;
  }
   ***************************************/
  return false;
}


