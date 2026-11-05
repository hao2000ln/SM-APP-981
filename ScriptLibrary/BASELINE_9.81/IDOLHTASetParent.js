
_denull  = system.functions.denull;
_scmsg   = system.functions.scmsg;
_str     = system.functions.str;
_nullsub = system.functions.nullsub;
var IDOLTopicSuggestion = lib.IDOLTopicSuggestion.require();

function proceedSetParent4Master(pIncidentId)
{
  var objFile = new SCFile('probsummary');
  var rc = objFile.doSelect('number="' + pIncidentId + '"');
  if (rc == RC_SUCCESS)
  {
    objFile["master.incident"] = true;
    objFile["parent.incident"] = null;

    objFile.doUpdate();
  }
}

function proceedSetParent4Childs(aryIncidentIds, pParentId)
{
  var objFile = new SCFile('probsummary');
  var sql = "number isin " + _str(_denull(aryIncidentIds)) + "";

  if (objFile.doSelect(sql) == RC_SUCCESS)
  {
    do
    {
      if (pParentId!=objFile["number"])
      {
        objFile["master.incident"] = null;
        objFile["parent.incident"] = pParentId;

        objFile.doUpdate();
      }
    }while (objFile.getNext() == RC_SUCCESS)
  }
}

function initSetParentUI(pFileName, pQuery)
{
  vars["$htachilds.incidentid"]       = [];
  vars["$htachilds.prioritycode"]     = [];
  vars["$htachilds.problemstatus"]    = [];
  vars["$htachilds.briefdescription"] = [];
  vars["$htachilds.parentincident"]   = [];
  vars["$htachilds.masterincident"]   = [];
  vars["$htachilds.affectedci"]       = [];
  vars["$htachilds.affecteditem"]     = [];
  vars["$htachilds.incidentdisplayname"] = [];

  vars["$idolhta.parent.list"]        = [];
  vars["$idolhta.parent.list.display"]= [];

  initSetParentUI4Childs(pFileName, pQuery);

  vars["$idolhta.parent.list"]        = vars["$htachilds.incidentid"];
  vars["$idolhta.parent.list.display"]= vars["$htachilds.incidentdisplayname"];

  initSetParentUI4IDOL();

  vars["$idolhta.parent.list"].push("CreateNewParentIncident");
  vars["$idolhta.parent.list.display"].push(_scmsg(694,"idol"));

  if (vars["$idolhta.parent.list"]!=null && vars["$idolhta.parent.list"].length()>0)
  {
    vars["$idolhta.selected.parent.incident"] = vars["$idolhta.parent.list"][0];
  }
}

function refreshSetParentChildUI(pFileName, pQuery)
{
  vars["$htachilds.incidentid"]       = [];
  vars["$htachilds.prioritycode"]     = [];
  vars["$htachilds.problemstatus"]    = [];
  vars["$htachilds.briefdescription"] = [];
  vars["$htachilds.parentincident"]   = [];
  vars["$htachilds.masterincident"]   = [];
  vars["$htachilds.affectedci"]       = [];
  vars["$htachilds.affecteditem"]     = [];
  vars["$htachilds.incidentdisplayname"] = [];

  initSetParentUI4Childs(pFileName, pQuery);
}

function initSetParentUI4Childs(pFileName, pQuery)
{
  var objFile = new SCFile(pFileName, SCFILE_READONLY);

  var fields = new Array("number", "priority.code", "problem.status", "brief.description", "parent.incident", "master.incident");
  fields.push("probsummary;logical.name;device;logical.name;device;sm.device.display.name");
  fields.push("probsummary;affected.item;device;logical.name;device;sm.device.display.name");

  var sql = system.functions.generate_sql_query(fields, pQuery, pFileName, true);
  var strDisplayName = "";

  if (objFile.doSelect(sql) == RC_SUCCESS)
  {
    do
    {
      vars["$htachilds.incidentid"].push(objFile[0]);
      vars["$htachilds.prioritycode"].push(objFile[1]);
      vars["$htachilds.problemstatus"].push(objFile[2]);
      vars["$htachilds.briefdescription"].push(objFile[3]);
      vars["$htachilds.parentincident"].push(objFile[4]);
      vars["$htachilds.masterincident"].push(objFile[5]);
      vars["$htachilds.affectedci"].push(objFile[6]);
      vars["$htachilds.affecteditem"].push(objFile[7]);
      
      strDisplayName = _scmsg(696,"idol", [objFile[0], objFile[3]]);
      vars["$htachilds.incidentdisplayname"].push(strDisplayName);
      
    }while (objFile.getNext() == RC_SUCCESS)
  }
}

function initSetParentUI4IDOL()
{
  var arySugParents = IDOLTopicSuggestion.suggestParentIncident(vars["$idol.selected.topic"]);
  var lng = arySugParents.length;
  var strID  = "";
  var strDisplayName = "";
  var strTitle = "";

  vars["$idolhta.parent.list"] = _nullsub(vars["$idolhta.parent.list"], []);
  vars["$idolhta.parent.list.display"] = _nullsub(vars["$idolhta.parent.list.display"], []);

  for (var i=0;i<lng;i++)
  {
    strID = arySugParents[i].reference;
    strTitle = arySugParents[i].title;
    strDisplayName = _scmsg(695,"idol", [strID, strTitle]);

    vars["$idolhta.parent.list"] = system.functions.insert( vars["$idolhta.parent.list"], i+1, 1 );
    vars["$idolhta.parent.list"][i] = strID;

    vars["$idolhta.parent.list.display"] = system.functions.insert( vars["$idolhta.parent.list.display"], i+1, 1 );
    vars["$idolhta.parent.list.display"][i] = strDisplayName;
  }
}

function generateTicketID(cls) {
  var rtc = new SCDatum(), next = new SCDatum();
  funcs.rtecall("getnumber", rtc, next, cls);
  return next;
}

function createNewParentRecord(pFields, pKeyField, pNumberCls)
{
  var objFile = new SCFile(vars["$idol.selected.filename"], SCFILE_READONLY);
  var objParentFile = new SCFile(vars["$idol.selected.filename"]);

  pKeyField  = _nullsub(pKeyField, "number");
  pNumberCls = _nullsub(pNumberCls, "incident management");

  var sql = " " + pKeyField + "=\"" + vars["$idolhta.selectedchilds"][0] + "\" ";
  var fields = new Array("problem.status", "initial.impact", "severity", "priority.code", 
                          "action", "brief.description", "affected.item", "logical.name", "category", "subcategory", "product.type");
  if (pFields==null) pFields = fields;
  var lng = pFields.length;
  var strID = "";

  if (objFile.doSelect(sql) == RC_SUCCESS)
  {
    strID = generateTicketID(pNumberCls);
    objParentFile[pKeyField] = strID;

    for (var i=0;i<lng;i++)
    {
      objParentFile[pFields[i]] = objFile[pFields[i]];
    }
    objParentFile["master.incident"] = true;

    objParentFile.doInsert();

    vars["$L.query"] = " " + pKeyField + "=\"" + _str(strID) + "\" ";
    proceedSetParent4Childs(vars["$idolhta.selectedchilds"],strID);
  }
}
