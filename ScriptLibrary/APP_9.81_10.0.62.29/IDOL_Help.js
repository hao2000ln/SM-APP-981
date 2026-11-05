var _ = lib.Underscore.require(),
    IDOLHTALauncher = lib.IDOLHTALauncher.require();

var logger = getLog('IDOL_Help');

function canOpenPH4Incident() {
  return !!(vars.$lo_idol_enabled && lib.IDOL_Utilities.hasIDOLRight());
}

function canOpenPH() {
  return !!(vars.$lo_idol_enabled && lib.IDOL_Utilities.hasIDOLRight());
}

function canOpenSmartTicket() {
  return !!(vars.$lo_idol_enabled && lib.IDOL_Utilities.hasIDOLRight());
}

function canOpenSmartTicket4ESS() {
  return !!(vars.$lo_idol_enabled && vars.$lo_idol_img_enabled);
}
function canAddStopWords()
{
  var filename =vars["$idol.hot.topic.file.name"];
  if(filename == "incidents")
  {
     // sd has sysadmin right
     return system.functions.index("SysAdmin", vars['$lo.ucapex'])>0;
  }
  else if(filename == "probsummary")
  {
    // im
    return system.functions.index("SysAdmin", vars['$lo.ucapex'])>0;
  }
  else if(filename == "SurveyInternal")
  {
    return system.functions.index("SysAdmin", vars['$lo.ucapex'])>0;
  }
  else if(filename == "cm3r")
  {
    //change module
    return system.functions.index("SysAdmin", vars['$lo.ucapex'])>0;
  }
  else if(filename == "rootcause")
  {
    return system.functions.index("SysAdmin", vars['$lo.ucapex'])>0;
  }
  return false;
}
function resetHTA() {
  vars["$idol.hta.topic.threshold"] =1;
  vars["$idol.hta.topic.number"]=10;
  _.each([
    "$idol.tableAccess.folders",
    "$search.field.keyword",
    "$search.field.fromdate",
    "$search.field.todate",
    "$search.field.advquery.cond",
    "$idol.state",
    "$idol.event.params",
    "$idol.hot.topic.json.data",
    "$search.field.language",
    "$hta.lda.add.stopwords"
  ], function(name) { vars[name] = null; });
}

function cleanup() {
  _.each([
    "$idol.state",
    "$idol.event.params",
    "$idol.hot.topic.json.data"
  ], function(name) { vars[name] = null; });
}

function detectLanguage()
 {
  
  var loginLanguage = vars['$G.my.language'];
  if(loginLanguage)
  {
    return loginLanguage;
  }
  var syslang = vars['$G.system.info']['syslanguage'];
  if(syslang)
  {
    return syslang;
  }
  
  return 'en';
}

function isPDEnabled(filename) {
  var obj = new Query('Object', new QueryCond('file.name', EQ, filename))[0];
  return obj && !!obj["workflowLocation"];
}


function hanleTopic(json)
{ 
  //remove attachment in the query results
  //var scattach =[];
  for(var i=0;i<json["subtopics"].length;i++)
  {
    if(json["subtopics"][i]== null ||json["subtopics"][i]["docs"] == null || json["subtopics"][i]["docs"].length == 0)
    {
      continue;
    }
    var tmp_doc=[];
    for(var k=0;k<json["subtopics"][i]["docs"].length;k++)
    {
      var one_doc =json["subtopics"][i]["docs"][k];
      
      if(one_doc.indexOf("scattach%3A%2F%2F") == 0)
      {
        //scattach.push(one_doc);
      }
      else
      {
        tmp_doc.push(one_doc);
      }
    }
    json["subtopics"][i].docs = tmp_doc;
    
  }
  var others =[];
  for(var i=0;json.other && i<json.other.length;i++)
  {
     var one_doc =json.other[i];
      
      if(one_doc.indexOf("scattach%3A%2F%2F") == 0)
      {
        //scattach.push(one_doc);
      }
      else
      {
        others.push(one_doc);
      }
  }
  json.other = others;
  //why has empty topic?
  var topic={};
  var dupTopic = [];
  for(var i=0;i<json["subtopics"].length;i++)
  {
    if(json["subtopics"][i]== null ||json["subtopics"][i]["docs"] == null || json["subtopics"][i]["docs"].length == 0)
    {
      //print("remove one empty topic");
      json["subtopics"].splice(i,1);
      i--;
    }
    if(json["subtopics"][i].topic)
    {
      if(topic[json["subtopics"][i].topic] != null)
      {
        var _topic=json["subtopics"][i].topic;
        var newtopic = topic[_topic].concat(json["subtopics"][i].docs);
        topic[_topic] = newtopic;
        var existing = false;
        for(var m=0;m<dupTopic.length;m++)
        {
          if(dupTopic[m] == _topic)
          {
            existing = true;
            break;
          }
        }
        if(!existing)
        {
          dupTopic.push(_topic);
        }
      }
      else
      {
        topic[json["subtopics"][i].topic] = json["subtopics"][i].docs;
      }
    }
  }
  //why has duplicated topic
  for(var j=0;j<dupTopic.length;j++)
  {  
      var firstone = true;
      for(var k=0;k<json["subtopics"].length;k++)
      {
         if(dupTopic[j]==json["subtopics"][k].topic)
        {
          if(firstone)
          {
            firstone = false;
            json["subtopics"][k].docs=topic[json["subtopics"][k].topic];
          }
          else
          {
            json["subtopics"].splice(k,1);
            k--;
          }
        }
      }
  }
  
  return json;
}

function handleOther(json)
{ 
  var newid = json.subtopics.length+1;
   hanleTopic(json);
  
 
  if(json.other && json.other.length > 0)
  {
    var mindocs = 0;
    for(var i=0;i<json["subtopics"].length;i++)
    {
       if(json["subtopics"][i] != null && json["subtopics"][i]["docs"] != null)
       {
          if(mindocs == 0 || mindocs > json["subtopics"][i]["docs"].length)
          {
            mindocs = json["subtopics"][i]["docs"].length;
          }
       }
    }
    if(mindocs > json.other.length)
    {
      mindocs = json.other.length;
    }
    else if(mindocs > 1)
    {
      mindocs--;
    }
    var message = funcs.scmsg('611', 'idol' );
    var other={
    topic:message,
    docs: json.other,
    subtopics: [],
    id: newid,
    other: mindocs
    };
    json.subtopics.push(other);
    //json.recommends.push("other");
    json.other=null;
  }
  var msg = funcs.scmsg('614', 'idol' );
  json['doc_unit']=msg;
  return json;
}

function checkKMTitleField(knowledgeBase,field)
{
  var KMIDOLUtils = lib.KMIDOLUtils.require();
  var jsname = lib.KMUtils.scToJSName(field);
  var indexFieldSet = KMIDOLUtils.getIndexFieldSet(knowledgeBase);
  var indexFields = indexFieldSet.indexFields;
  var indexfAlias = indexFieldSet.indexfAlias;
  var numfields = knowledgeBase.kbfields.length();
  for (var i = 0; i< numfields; i++)
  {
         
    if(indexFields[i] != jsname)
    {
        continue;
    }
    var fieldName = indexfAlias[i];
    if( fieldName.toUpperCase() == 'TITLE')
    {
      return true;
    }
  }
  return false;
}
function getKMIDOLFieldName(knowledgeBase,field) {
    var jsname = lib.KMUtils.scToJSName(field);
    var REF_PREFIX = '_DN_';
    var KMIDOLUtils = lib.KMIDOLUtils.require();
    var indexFieldSet = KMIDOLUtils.getIndexFieldSet(knowledgeBase);

    var indexFields = indexFieldSet.indexFields;
    var indexfType = indexFieldSet.indexfType;
    var indexfAlias = indexFieldSet.indexfAlias;
    var indexWeights = indexFieldSet.indexWeights;

    var numfields = knowledgeBase.kbfields.length();
    for (var i = 0; i< numfields; i++)
    {
         
            if(indexFields[i] != jsname)
            {
              continue;
            }

            var weight = indexWeights[i];
            var strField = jsname;
            if (indexfType[i] == 'Reference' )
            {
              strField = REF_PREFIX+strField;
            }
            strField += KMIDOLUtils.getFieldPostfix(weight);
            strField = strField.toUpperCase();
            return strField;

        } 
}

function initializeStopWords()
{
}
function clearFormat()
{
  var name = vars["$L.format"];
  var strtemp ="idol.hta.stopwords";
  if(name.length>strtemp.length && name.indexOf(strtemp) != -1)
  {
    var f = new SCFile("format");
    var rc = f.doSelect('name="'+name+'"');
    if( rc == RC_SUCCESS)
    {
      f.doDelete();
    //print("delete template format in apps"+name);
    }
  }
}
function  setVariableForStopWords()
{
  var data  = vars["$idol.hot.topic.json.data"];
  if(data == null)return;
  if( typeof data == 'string')
  {
    data = lib.smis_CommonLib.fromJSON(data);
  }
  var f = new SCFile("format");
  var rc = f.doSelect('name="idol.hta.stopwords"');
  if( rc == RC_SUCCESS)
  {
    var onefield = f.field[2];//this is the first field
    var clone = f.field[2];
    var width = 40;
    var heidht=2;
    var x= 1;
    var y=5;
    var line = 3;
    var column = 1;
    var length = 20;
    var callRtn = new SCDatum;
	var nextNumber = new SCDatum;
	system.functions.rtecall("getnumber", callRtn, nextNumber, "htalda");
    f.name = "idol.hta.stopwords" +nextNumber.getText();
    vars["$L.format"]=f.name;
    var istart = 2;
    var topics={};
    var icount =0;
    for( var i=0;i<data.subtopics.length;i++)
    {
      //print(data.subtopics[i].topic);
      //var onefield = clone;
      if(data.subtopics[i].other || topics[data.subtopics[i].topic])
      {
        continue;
      }
      else
      {
        topics[data.subtopics[i].topic] = true;
      }
      f.field[istart+icount].input="$hta.stopwords"+i;
      vars["$hta.stopwords"+i]= false;
      f.field[istart+icount].output=data.subtopics[i].topic;
      f.field[istart+icount].line = line+parseInt(icount/4);
      f.field[istart+icount].column= parseInt(icount%4) ==0 ? column : column+parseInt(icount%4)*length+2;
      var xstr= icount%4 ==0 ? x+icount%4*width : x+icount%4*width+3;
      var ystr = 5+parseInt(icount/4)*2;
      var strpro = "Width="+width+"\tX="+xstr+"\tY="+ystr+"\tCaption="+data.subtopics[i].topic+"\tInput="+"$hta.stopwords"+i;
      var str = clone.property.toString();
      var pos = str.indexOf("Width=");
      if(pos != -1)
      {
         str = str.substring(0,pos);
         str = str+strpro;
         f.field[istart+icount].property = str;
      }
      icount++;
    }
    f.doInsert();
  }
}

function updateStopWords()
{
   var data  = vars["$idol.hot.topic.json.data"];
  if(data == null)return;
  if( typeof data == 'string')
  {
    data = lib.smis_CommonLib.fromJSON(data);
  }
  
   var topics={};
   var words=[];
    for( var i=0;i<data.subtopics.length;i++)
    {
      //print(data.subtopics[i].topic);
      //var onefield = clone;
      if(data.subtopics[i].other || topics[data.subtopics[i].topic])
      {
        continue;
      }
      else
      {
        topics[data.subtopics[i].topic] = vars["$hta.stopwords"+i];
        if(vars["$hta.stopwords"+i])
        {
          words.push(data.subtopics[i].topic);
        }
      }
    }
    var tmpRet = new Datum();
    if(words.length ==0)
    {
       var message = funcs.scmsg('607', 'idol' );
       funcs.rtecall("msg", tmpRet, message, 1, null, null, 1);
       return;
    }
    var fs = new SCFile("idolStopPhrase");
    var rc_fs = fs.doSelect("true");
    var message = funcs.scmsg('608', 'idol' );
    if(rc_fs == RC_SUCCESS)
    {
      var oldwords = fs.StopPhrases== null? [] : fs.StopPhrases.toArray();
      var len = oldwords.length;
      for(var n=0; n<words.length;n++)
      {
         var find = false;
         for(var m=0;m<len;m++)
         {
           if(words[n] == oldwords[m])
           {
             find = true;
           }
         }
         if(!find)
         {
           oldwords.push(words[n]);
         }
      }
      fs.StopPhrases = oldwords;
      fs.doUpdate();
      funcs.rtecall("msg", tmpRet, message, 1, null, null, 1);
    }
    else
    {
      fs.id="1";
      fs.initialized=0;
      fs.StopPhrases=words;
      fs.doInsert();
      funcs.rtecall("msg", tmpRet, message, 1, null, null, 1);
    }
}
function initializeHTA() {
  var IDOLSMProfile = lib.IDOLSMProfile.require(),
      IDOLModuleConfiguration = lib.IDOLModuleConfiguration.require();

  var filename = vars['$L.filename'];
  var config = IDOLModuleConfiguration.get(filename);
  vars['$idol.hta.customizedQuery.isEnabled'] = _.result(IDOLModuleConfiguration, 'isCustomizedQueryEnabled');
  // XXX: should pass ds as parameter
  vars['$L.screen.id'] = _.result(config, 'displayscreen');
  // TODO: may use docEngine to get then environment ($L.env)
  vars["$idol.tableAccess.folders"] = IDOLSMProfile.getTableAccessFolders(filename);
  vars['$idol.' + filename + '.pd.isEnabled'] = isPDEnabled(filename);
}

function initializeHTA4Report(filename) {
  var IDOLSMProfile = lib.IDOLSMProfile.require(),
      IDOLModuleConfiguration = lib.IDOLModuleConfiguration.require();

  var config = IDOLModuleConfiguration.get(filename);
  vars['$idol.hta.customizedQuery.isEnabled'] = _.result(IDOLModuleConfiguration, 'isCustomizedQueryEnabled');
  // XXX: should pass ds as parameter
  //vars['$L.screen.id'] = _.result(config, 'displayscreen');
  // TODO: may use docEngine to get then environment ($L.env)
  vars["$idol.tableAccess.folders"] = IDOLSMProfile.getTableAccessFolders(filename);
  vars['$idol.' + filename + '.pd.isEnabled'] = isPDEnabled(filename);
}

function doSearchHotTopicMap4Report(filename) {
  var keyword = vars['$search.field.keyword'],
      range = [ vars['$search.field.fromdate'], vars['$search.field.todate'] ],
      criteria = new SCFile(filename),
      customQuery = vars['$search.field.advquery.cond'];

  var IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
      IDOLFieldProcessor = lib.IDOLFieldProcessor.require();

  try {
    cleanup();

    var jsonData = IDOLHTALauncher.searchHotTopic2Json(keyword, range, criteria, customQuery);

    if ( !jsonData && customQuery ) {
      // Check whether there is any field which is not indexed
      var ast = parseQuery(customQuery);
      var fieldsInQuery = IDOLQueryEvaluator.collectFieldNames(ast);

      if ( fieldsInQuery && fieldsInQuery.length > 0 ) {
        var fname = funcs.filename(criteria);
        var spec = IDOLFieldProcessor.create(fname);
        var indexFields = spec.propertyfields;
        if ( indexFields && spec.timefield ) {
          indexFields.push(spec.timefield);
        }

        var notIndexFields = _.difference(fieldsInQuery, indexFields);
        if ( notIndexFields && notIndexFields.length > 0 ) {
          var tmpRet = new Datum();
          var fieldCaptions = getFieldsCaption( fname, notIndexFields).join(', ');
          var message = funcs.scmsg('fields.not.indexed', 'idol', [ fieldCaptions ] );
          funcs.rtecall("msg", tmpRet, message, 1, null, null, 1);
        }
      }
    }

    return jsonData;
  } catch(e) {
    var error = e.message || e.toString();
    error = funcs.scmsg(1017, "idol", [error]);
    funcs.msg(error, 3);
  }
  return null;
}

//Set the default value for launch problem hunter rad
function setDefault4LaunchProblemHunter() {
  resetHTA();
  initializeHTA();
}

//This is for click search button in problem hunter format
function clickSearch4ProblemHunter() {
  var keyword = vars['$search.field.keyword'],
      range = [ vars['$search.field.fromdate'], vars['$search.field.todate'] ],
      criteria = vars['$L.file'],
      language = vars['$search.field.language'],
      customQuery = vars['$search.field.advquery.cond'];

  var IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
      IDOLFieldProcessor = lib.IDOLFieldProcessor.require();

  try {
    cleanup();

    var jsonData = IDOLHTALauncher.searchHotTopic(keyword, range, criteria, customQuery,language);
   
    vars["$idol.hot.topic.json.data"] = jsonData;
    var fname = funcs.filename(criteria);
    vars["$idol.hot.topic.file.name"]=fname;
    if ( !jsonData && customQuery ) {
      // Check whether there is any field which is not indexed
      var ast = parseQuery(customQuery);
      var fieldsInQuery = IDOLQueryEvaluator.collectFieldNames(ast);

      if ( fieldsInQuery && fieldsInQuery.length > 0 ) {
        
        var spec = IDOLFieldProcessor.create(fname);
        var indexFields = spec.propertyfields;
        if ( indexFields && spec.timefield ) {
          indexFields.push(spec.timefield);
        }

        var notIndexFields = _.difference(fieldsInQuery, indexFields);
        if ( notIndexFields && notIndexFields.length > 0 ) {
          var tmpRet = new Datum();
          var fieldCaptions = getFieldsCaption( fname, notIndexFields).join(', ');
          var message = funcs.scmsg('fields.not.indexed', 'idol', [ fieldCaptions ] );
          funcs.rtecall("msg", tmpRet, message, 1, null, null, 1);
        }
      }
    }
  } catch(e) {
    var error = e.message || e.toString();
    error = funcs.scmsg(1017, "idol", [error]);
    funcs.msg(error, 3);
  }
}

function getFieldCaption( filename, fieldName ) {
  var ret = funcs.get_field_caption(fieldName, filename);
  if (ret.indexOf("Could not be found") >= 0) {
    ret = fieldName;
  }
  return ret;
}

function getFieldsCaption( filename, fieldNameList ) {
  var ret = [];
  _.each( fieldNameList, function( fieldName ){
    if (fieldName) {
      ret.push(getFieldCaption(filename, fieldName));
    }
  });

  return ret;
}

function getHTMLContent4ProblemHunter() {
  //vars["$hta.lda.add.stopwords"]= false;
  var data  = vars["$idol.hot.topic.json.data"],
      state = vars["$idol.state"],
      filename = funcs.filename(vars["$L.file"]);
  var htaldaid = null;
  if( typeof data == 'string')
  {
    var json = lib.smis_CommonLib.fromJSON(data);
    if(json["htaldaid"])
    {
      htaldaid = json["htaldaid"];
    }
  }
  if(htaldaid)
  {
    //no topic still here, let update it right now
    var f = new SCFile("htalda");
    var rc = f.doSelect('id='+htaldaid+' and finish=true');
    if( rc == RC_SUCCESS)
    {
       data = f.result;
       vars["$idol.hot.topic.json.data"] = data;
       vars["$hta.lda.add.stopwords"]= true;
    }
       
  }
 
  //print("idol_help:"+vars["$hta.lda.add.stopwords"]);
   //logger.info('data is:'+typeof data);
  return IDOLHTALauncher.generateHotTopic(filename, data, state);
}

function getProcessName4ProblemHunter() {
  var JSON = lib.JSON.json();
  var event = JSON.parse(vars['$idol.event.params']);
  var next = IDOLHTALauncher.getTicketsHandler.apply(null, event);
  var process = next.process,
      params = next.params;

  vars["$L.idol.selected.filename"] = params.filename;
  vars["$L.idol.selected.query"] = params.query;
  vars["$L.idol.selected.topic"] = params.topic;

  return process;
}

function createTicket(record, filename, query) {
  var IDOLTicketHandler = lib.IDOLTicketHandler.require();
  var depend = new SCFile(filename), rc;
  rc = depend.doSelect(query);
  if (rc === RC_SUCCESS) {
    return IDOLTicketHandler.build(record, depend);
  }
  return record;
}

function createProblem() {
  return createTicket.apply(null, arguments);
}
function createChange() {
  return createTicket.apply(null, arguments);
}
function createIncident() {
  return createTicket.apply(null, arguments);
}

function hasRecord4HTA(fileName, query) {
  var bRtn = false;
  
  var objFile = new SCFile(fileName, SCFILE_READONLY);
  
  if (objFile.doSelect(query) == RC_SUCCESS) {
    bRtn = true;
  }
  
  return bRtn;
}

function deleteRelatedRecords(id) {
  var objFile = new SCFile("screlation");
  var sql = "source=\""+id+"\" or depend=\""+id+"\" ";
  
  if (objFile.doSelect(sql) == RC_SUCCESS) {
    do
    {
      objFile.doDelete();
    }while (objFile.getNext() == RC_SUCCESS)
  }
}

function updateRelatedRecords(id) {
  var objFile = new SCFile("screlation");
  var sql = "source=\""+id+"\" or depend=\""+id+"\" ";
  
  if (objFile.doSelect(sql) == RC_SUCCESS) {
    do
    {
      objFile.doSave();
    }while (objFile.getNext() == RC_SUCCESS)
  }
}

//Set the default value for launch quick ticket rad 
function setDefault4QuickNewInteraction() {
  vars["$idol.category"] = [];
  vars["$idol.subcategory"] = [];
  vars["$idol.product.type"] = [];
  vars["$idol.affected.item"] = [];
}

function clearFields4QuickTicket() {

  var objFile = vars["$L.file"];

  objFile["callback.contact"] = null;
  objFile["description"] = null;
  objFile["title"] = null;
  objFile["contact.name"] = null;
  objFile["callback.type"] = null;
  objFile["initial.impact"] = null;
  objFile["severity"] = null;

  objFile["category"] = null;
  objFile["subcategory"] = null;
  objFile["product.type"] = null;
  objFile["affected.item"] = null;

  objFile["resolution"] = null;

  vars["$idol.category"] = [];
  vars["$idol.subcategory"] = [];
  vars["$idol.product.type"] = [];
  vars["$idol.affected.item"] = [];
  vars["$L.classification.clicked"] = false;
}

function setDefFields4QuickTicket() {
  var objFile = vars["$L.file"];

  objFile["contact.name"] = objFile["callback.contact"];
  objFile["callback.type"] = "Telephone";
  if(objFile["description"]!=null) {
    objFile["title"] = objFile["description"][0];
  }
  objFile["initial.impact"] = "3";
  objFile["severity"] = "3";
}

function isPDEnabled4SDModule() {
  var isPDEnv = false;

  var objFile = new SCFile("Object");
  var sql = "file.name=\"incidents\"";

  if (objFile.doSelect(sql) == RC_SUCCESS) {
    if (objFile["workflowLocation"]!=null && objFile["workflowLocation"]!="") {
      isPDEnv = true;
    }
  }

  return isPDEnv;
}

function isPDEnabled4IMModule(filename) {
  var isPDEnv = false;

  var objFile = new SCFile("Object");
  var sql = "file.name=\""+filename+"\"";

  if (objFile.doSelect(sql) == RC_SUCCESS) {
    if (objFile["workflowLocation"]!=null && objFile["workflowLocation"]!="") {
      isPDEnv = true;
    }
  }

  return isPDEnv;
}

function smartFill4SD() {
  if (vars.$lo_idol_enabled) {
    vars["$L.file"].category = null;
    vars["$L.file"].subcategory = null;
    vars["$L.file"].product_type = null;
    vars["$L.file"].affected_item = null;
    
    vars["$query"] = "true";

    vars["$idol.category"] = [];
    vars["$idol.subcategory"] = [];
    vars["$idol.product.type"] = [];
    vars["$idol.affected.item"] = [];
    vars["$idol.affected.item.key"] = [];
    vars["$idol.affected.item.display"] = [];

	/*
    var company = "";    
    if (vars['$G.multi']) {
      company = vars["$L.file"].company;
    }
    */
    
    company = [];
    company_file = lib.SmartTicketMandantTools.getMandantValueOfCurrentFile(vars["$L.file"]);
    //company_user = lib.SmartTicketMandantTools.getCurrentUserMandantValue();
    company = _.union(company_file, []);

    tryFillIncidentsByIdol(vars["$L.file"], 3, company, true);
    //Added for logical name
    var tableName=funcs.filename(vars["$L.file"]);
    var DiplayNameHelp = lib.DisplayName;
    var formInputs=DiplayNameHelp.getFormInputs(vars["$L.format"]);
    if(formInputs!==null && formInputs!==""){
      for(var i=0;i<formInputs.length;i++){
        if(formInputs[i].indexOf("$idol.")===0){
          var field=formInputs[i].substr(formInputs[i].indexOf(".")+1);
          var refTable=DiplayNameHelp.getRefTable(field, tableName);
          if(refTable!==null && refTable!==""){
            var values=vars["$idol." + field];
            if(values!==null && values!==""){
              DiplayNameHelp.getDisplayNamesByIds(refTable,values,vars["$idol.affected.item.key"],vars["$idol.affected.item.display"]);
            }
          }
        }
      }
    }
    //End for logical name
  }
}

function setQuickTicketValue4SD() {
  var objFile = vars["$L.file"];

  if (vars.$lo_idol_enabled) {
    /*
    var company = "";
    
    if (vars.$G_multi) company = vars.$lo_operator.company;
    */
    
    var company = [];
    company = lib.SmartTicketMandantTools.getCurrentUserMandantValue();

    vars["$L.fill.file"] = new SCFile("incidents");
    vars["$L.fill.file"].description = objFile.description;
    vars["$L.fill.file"].callback_contact = objFile.callback_contact;

    tryFillIncidentsByIdol(vars["$L.fill.file"], 3, company, false);

    if (objFile.category==null || objFile.category=="")
    {
      objFile["category"] = vars["$L.fill.file"].category;
      objFile["subcategory"] = vars["$L.fill.file"].subcategory;
      objFile["product.type"] = vars["$L.fill.file"].product_type;
    }
    if (objFile.affected_item==null || objFile.affected_item=="")
    {
      objFile["affected.item"] = vars["$L.fill.file"].affected_item;
    }
  }

  setDefFields4QuickTicket();

  vars["$L.qt.file"] = new SCFile("incidents");
  funcs.fduplicate(vars["$L.qt.file"], objFile);
}

function tryFillIncidentsByIdol(in_file, numresult, company, bInfo)
{
  if (in_file['callback.contact'] == null || in_file['callback.contact'] == "")
  {
    if (bInfo==true) funcs.msg(funcs.scmsg(40,"idol"),3);
    if (bInfo==true) funcs.cursor_field_name_set("description");
    return;
  }

  if (in_file.description!=null && in_file.description!="")
  {
    if (funcs.str(in_file.description)=="{}")
    {
      if (bInfo==true) funcs.msg(funcs.scmsg(20,"idol"),3);
      if (bInfo==true) funcs.cursor_field_name_set("description");
      return;
    }
  }
  else
  {
    if (bInfo==true) funcs.msg(funcs.scmsg(20,"idol"),3);
    if (bInfo==true) funcs.cursor_field_name_set("description");
    return;
  }

  fillIncidentsByIdol(in_file, numresult, company);
}


//using IDOL to fill record's fields
function fillIncidentsByIdol(in_file, numresult, company)
{
  var fadapter = new SCFile(lib.IDOL_Constant.getCategoryConfigFileName());
  var file_name = funcs.filename(in_file);

  var rc = fadapter.doSelect("table.name=\"" + file_name + "\" and is.active=true");
  while(rc == RC_SUCCESS)
  {
    var targetFields;

    if (!fadapter['level2.field'] && !fadapter['level3.field']) {
      targetFields = lib.acicategory.getCategoryByContent(in_file,fadapter.adapter_id,lib.IDOL_Utilities.suggestNumberBeforeFilter(),company);
      targetFields = lib.IDOL_Utilities.filterIdolIndex(in_file, fadapter['level1.field'], numresult, targetFields);
    } else {
      targetFields = lib.acicategory.getCategoryByContent(in_file,fadapter.adapter_id,numresult,company);
    }

    if (fadapter.level1_field != null)
    {
      if (targetFields.length>=1)
      {
        var strLevel1FieldName = fadapter.level1_field.toString();

        in_file[strLevel1FieldName] = targetFields[0][0];

        vars["$idol." + strLevel1FieldName] = [];
        for(var i=0;i<targetFields.length;i++)
        {
          vars["$idol." + strLevel1FieldName].push(targetFields[i][0]);
        }
      }
    }
    if (fadapter.level2_field != null)
    {
      if (targetFields.length>=1)
      {
        var strLevel2FieldName = fadapter.level2_field.toString();

        in_file[strLevel2FieldName] = targetFields[0][1];

        vars["$idol." + strLevel2FieldName] = [];
        for(var i=0;i<targetFields.length;i++)
        {
          vars["$idol." + strLevel2FieldName].push(targetFields[i][1]);
        }
      }
    }
    if (fadapter.level3_field != null)
    {
      if (targetFields.length>=1)
      {
        var strLevel3FieldName = fadapter.level3_field.toString();

        in_file[strLevel3FieldName] = targetFields[0][2];

        vars["$idol." + strLevel3FieldName] = [];
        for(var i=0;i<targetFields.length;i++)
        {
          vars["$idol." + strLevel3FieldName].push(targetFields[i][2]);
        }
      }
    }
    rc = fadapter.getNext();
  }
}

function checkMultiLevelField(fieldName)
{
  var position = funcs.index(fieldName, vars['$fieldNames4Rule']);

  if (position==null || position<=0)
  {
    var fieldCaption = funcs.get_field_caption(fieldName);
    vars['$fieldNames4Rule'].push(fieldName);
    vars['$fieldCaptions4Rule'].push(fieldCaption);
  }
}

/**
 *   Retrieve all hot topic in IDOL configuration
 **/
function getAllHTA4GUI() {
  var objFile = new SCFile("idolpbmhunter", SCFILE_READONLY);
  var sql = "true";

  vars["$htalist.tablenames"] = [];
  vars["$htalist.indexstatus"] = [];
  vars["$htalist.lastindextimes"] = [];

  if (objFile.doSelect(sql) == RC_SUCCESS) {
    do {
      vars["$htalist.tablenames"].push(objFile.table_name);
      vars["$htalist.indexstatus"].push(getHTAIndexStatus(objFile.table_name));
      vars["$htalist.lastindextimes"].push(getHTALastIndexTime(objFile.table_name));
    } while (objFile.getNext() === RC_SUCCESS);
  }
}

function getHTAIndexStatus(pTableName)
{
  var strStatus = "";
  var ar = [];
  ar = lib.aciindex.getIndexStatus(pTableName);
  if (ar != null)
  {
    strStatus = ar[1];
  }

  return strStatus;
}

function getHTALastIndexTime(pTableName)
{
  var strLastIndexTime = "";
  var idolIndex = new SCFile('idolindex', SCFILE_READONLY);
  var IDOLCommon = lib.IDOLCommon.require();
  idolIndex.setFields(['last.index.time']);
  var queryCond = new QueryCond('table.name', EQ, pTableName)
    .and(new QueryCond("feature", EQ, IDOLCommon.FEATURES.HTA));
  var rc = idolIndex.doSelect(queryCond);
  if (rc === RC_SUCCESS) {
    strLastIndexTime = idolIndex['last.index.time'];
  }

  return strLastIndexTime;
}

function getHTAByTableName(pTableName)
{
  var objFile = new SCFile('idolpbmhunter');
  var rc = objFile.doSelect('table.name="' + pTableName + '"');
  return rc === RC_SUCCESS ? objFile : null;
}

function selectHTAInList()
{
  var index = funcs.cursor_line(1);
  vars['$L.has.error.msg'] = false;

  if (index > vars['$htalist.tablenames'].length() || index < 1) {
    vars['$L.error.msg'] = funcs.scmsg('699', 'idol');
    funcs.msg(vars['$L.error.msg'],3);
    vars['$L.has.error.msg'] = true;
  } else {
    var strTableName = vars['$htalist.tablenames'][index - 1];
    vars['$L.hta.file'] = getHTAByTableName(strTableName);
  }
}
function checkStopWords()
{
   print("calling check stop workds");
   return false;
}

function checkValue( fTicket ){
	var IDOLMandant = lib.IDOLMandant.require();
	//var filename = 'incidents';
	if(!fTicket || !system.functions.filename(fTicket)){
	   return;
	}
	
	var filename = system.functions.filename(fTicket);
	var $ = lib.c.$;
	var mandantFieldName = IDOLMandant.getMandantField(filename);
	var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename , true);   
	var record = fTicket;
	
	if ( mandantFieldName ) {
	   var valueExist = true;
	   if(mandantFieldType == 8) {
	      var existingValue = system.functions.denull(record[mandantFieldName]);
	      if(existingValue.length() == 0){
	         valueExist = false;
	      }
	   }else {
	      var existingValue = record[mandantFieldName];
	      if(!existingValue || existingValue == ""){
	         valueExist = false;
	      }
	   }
	   if(!valueExist || (valueExist && !vars['$G.system.info']['multi.company'])) {
     //if(!valueExist) {
	      //get contant's mandant value in current $L.file
	      var mandantValue = lib.SmartTicketMandantTools.getUserMandantValueByFile(record);	      
		  if(mandantValue && mandantValue.length > 0){
		    if(mandantFieldType == -1){
		      logger.error('Error Configuration of Mandant settings: for scfile:['+filename+']');
		    }else if(mandantFieldType == 8){
		      var t = $.createSCArray();
		      for(var i=0; i<mandantValue.length; i++) {
		         t.push(mandantValue[i]);
		      }
		      record[mandantFieldName] = t;
		    }else{
		      record[mandantFieldName] = mandantValue[0];
		    }
		  }else{
		    logger.info('No Mandant value found for: ' + fTicket);
		  }   
	   }else{
	      logger.info('value of mandant field in current $L.file is:' + existingValue);
	   }
	}
	
	logger.info('value of mandant field in current $L.file is:' +  record[mandantFieldName]);
	//return record;
}
