
var _str = system.functions.str;
var logger = getLog('IDOL_Help_ParseQuery');

function parseSMQuery4UI(filename, query, objFile)
{
  query = _str(query);
  if (query=="" || query=="true") return;

  try
  {
    var candidatesQueryAst = parseQuery(query);

    var strXML = lib.IDOLQueryEditorEvaluator.convertToXML(candidatesQueryAst, filename);

    vars["$xmlString2"] = strXML;
    vars["$search.field.advquery.conddesc"] = lib.QueryEditorParser.getDescription(strXML);
    vars["$search.field.advquery.cond"] = lib.QueryEditorParser.getQuery(strXML, {CurrentRecord: objFile, SavedRecord: vars["$L.file.save"],TargetFile:filename});

  } catch(e) {
    logger.warn(e);
  }
}
