var $ = lib.c.$;
var _ = lib.Underscore.require();
var logger = getLog("KMknowledgebase");
var IDOLCommon = lib.IDOLCommon.require();


function validateFieldNames(fFile)
{
  var result=true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if(fFile.kbfields[i].kbfieldname==null) {
        result=false;
      }
   }    
  return result;
}


function validateFieldTypes(fFile)
{
  var result=true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if(fFile.kbfields[i].kbfieldtype==null) {
        result=false;
      }
   }    
  return result;
}
 
function validateFieldAlias(fFile)
{
  var result=true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if(fFile.kbfields[i].kbfieldvalue==null) {
        result=false;
      }
   }    
  return result;
}
 
 
function validateFieldHitlist(fFile)
{
  var result=true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if(fFile.kbfields[i].hitlist==null) {
       fFile.kbfields[i].hitlist="true";
        }
     }    
  return result;
}
 
 
function validateFieldDocbody(fFile)
{
    var result=true;
    var i;
    var length = fFile.kbfields.length();
    for (i = 0; i < length; i++) {
      if(fFile.kbfields[i].docbody==null) {
       fFile.kbfields[i].docbody= "true";
     }    
    }    
  return result;
}
 
 
function validateFieldSort(fFile) 
{
  var nonNumberFields = [];
  var nonMatchFields = [];
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
    if (fFile.kbfields[i].sort != null && !lib.IntegerUtil.isNormalInteger(fFile.kbfields[i].sort)) {
      nonNumberFields.push(fFile.kbfields[i].kbfieldname);
    }
    if (fFile.kbfields[i].hitlist != true && fFile.kbfields[i].sort != null) {
      nonMatchFields.push(fFile.kbfields[i].kbfieldname);
      fFile.kbfields[i].sort = null;
    }
  }
  
  if (nonNumberFields.length > 0) {
    funcs.msg(funcs.scmsg('km_5', 'fc', nonNumberFields), 3);
  }
  
  if (nonMatchFields.length > 0) {
    funcs.msg(funcs.scmsg('km_6', 'fc', nonMatchFields), 2);
  }
  
  return nonNumberFields.length == 0;
}

function validateMatchField(kmlib) {
  var fields = kmlib.kbfields;
  var i;
  var length = fields.length();
  for (i = 0; i < length; i++) {
    var field = fields[i];
    if (field.match) {
      var name = field.kbfieldname;
      var alias = field.kbfieldvalue;
      var type = field.kbfieldtype;
      if (alias && (alias.toLowerCase() === 'title' || alias.toLowerCase() === 'id')) {
        vars['$L.km.validate.msg'] = funcs.scmsg('km_9', 'fc', [ alias ]);
        funcs.cursor_field_name_set('kbfields,match', i + 1);
        return false;
      } else if (type === 'Date' || type === 'Rich Text') {
        vars['$L.km.validate.msg'] = funcs.scmsg('km_9', 'fc', [ type ]);
        funcs.cursor_field_name_set('kbfields,match', i + 1);
        return false;
      }
    }
  }
  return true;
}


function validateFieldWeight(fFile)
{
  var result = true;
  var hasIndex = false;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if (fFile.kbfields[i].weight != null && fFile.kbfields[i].weight != -1) {
    hasIndex = true;
    break;
    }
  }
  return hasIndex;
}


function setFieldWeightNoIndex(fFile)
{
  var result = true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if (fFile.kbfields[i].weight == null) {
    fFile.kbfields[i].weight = -1;
    }
  }    
  return result;
}


function setFieldMatchFalse(fFile)
{
  var result = true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++) {
      if (fFile.kbfields[i].match == null) {      
    fFile.kbfields[i].match = false;
    }
  }    
  return result;
}

function setFieldDatacleansingFalse(fFile)
{
  var result = true;
  var i;
  var length = fFile.kbfields.length();
  for (i = 0; i < length; i++){
    if (fFile.kbfields[i].datacleansing == null)
    {
      fFile.kbfields[i].datacleansing = false;
    }
  }    
  return result;
}

function getIdFieldForKB(filename)
{
  // Get the record for this knowledgebase to determine the id field.
  var kbFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
  kbFile.setFields("docid");
  var rc = kbFile.doSelect( "sclibtablename=\""+filename+"\"");  
  if ( rc == RC_SUCCESS )
  {
    return kbFile.docid;
  }
  else
  {
     return "";
  }
}

function getKBObjectForFilename(filename)
{
  // Get the record for this knowledgebase given the name of the file that is indexed.
  var kbFile = new SCFile("kmknowledgebase");
  var rc = kbFile.doSelect( "sclibtablename=\""+filename+"\"");  
  if ( rc == RC_SUCCESS )
  {
    return kbFile;
  }
  else
  {
     return null;
  }
}

// Does this id exist in this knowledgebase? return true if so, else false
function checkValidIdForKB(kbname,id)
{
  //print("kbname: "+kbname+"id: "+id);
  var kbFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
  kbFile.setFields("sclibtablename");
  var rc = kbFile.doSelect( "kbname=\""+kbname+"\"");  
  if ( rc == RC_SUCCESS )
  {
    var filename = kbFile.sclibtablename;
    // Get the record for this knowledgebase to determine the id field.
    var idField = lib.KMknowledgebase.getIdFieldForKB(filename);
    //print(idField + "=\""+id+"\"");
    if (idField == "")
    {
      return false;
    }
    var kmFile = new SCFile(filename, SCFILE_READONLY);
    kmFile.setFields(idField);
    rc = kmFile.doSelect( idField + "=\""+id+"\"");  
    if ( rc != RC_SUCCESS )
    {
       return false;
  }
  }
  else
  {
    return false;
  }
     
  return true;
}


function checkExistConnectorTask(inFile) {
    var kmknowledgebase = new SCFile('kmknowledgebase', SCFILE_READONLY);
    kmknowledgebase.setFields(["spconnectorurl", "sptask"]);
    var rc = kmknowledgebase.doSelect('kbname~="' + inFile['kbname'] + '" and kbtype="' + inFile['kbtype'] + '"');
    if (rc !== RC_SUCCESS) {
      return false;
    }
      
    while (rc === RC_SUCCESS) {
      var connector = kmknowledgebase['spconnectorurl'];
      var task = kmknowledgebase['sptask'];
      if (connector === inFile['spconnectorurl'] && task === inFile['sptask']){
        return true;
      }
      rc = kmknowledgebase.getNext();
    }
      
    return false;
}

function getDivNumber() {
//fix [26120] The count of Incident_Library and Interaction_Library in SM is not corret
    var idolConfigObj = lib.IDOLConfigure.require();
    var idolConfig = idolConfigObj.getConfig();
    var idolUrl = idolConfig['server.url'];
    var result = lib.IDOL_Tools_Tree.getIDOLTree(idolUrl);
    idolUrl = result['gsProxyUrl']; 
    var response = lib.jsaci.runIDOLAction(idolUrl + 'action=EngineManagement'+'&'+'EngineAction=ShowStatus', false, false);
    
    if (response == lib.jsaci.getWrongUrlMessage()) {
        return 1;
    }
    
    var xml = new XML();
    xml.setContent(response);
    var xQuery = lib.XQuery.require();
    var engines=xQuery.query('responsedata/logical_engines',xml);
    if(engines==''){
        return 1;    
    }
    else{
        var logicalEngines=xQuery.query('responsedata/logical_engines/logical_engine', xml);
        var logicalNum = logicalEngines.length;
        var enginesNum=xQuery.queryText('responsedata/engines/num_engines', xml);
        return enginesNum/logicalNum;      
    }
}

//temporary solution (will remove in future)
function showConfluenceUI(xml)
{  
   if(vars["$G.idol.support.libs"] == null)
   {
      var xQuery = lib.XQuery.require();
      var IDOLURLParser = lib.IDOLURLParser.require();
      var idolConfig = lib.IDOLConfigure.require().getConfig();     
      vars["$G.idol.support.libs"]=["sclib","weblib","fsyslib","splib","okmlib"];
      var servicePort = xQuery.queryText('responsedata/serviceport', xml);  
      var param = 'a=getconfig';
      var url = idolConfig['server.url'];
      var idolServerEP = IDOLURLParser.parse(url);      
      var tmpHost = idolServerEP.host;
      if (tmpHost.indexOf('[') <0 && tmpHost.indexOf(':') >0)
      {
        tmpHost = '['+tmpHost+']';
      }
      var newURL = 'http://' + tmpHost + ':' + servicePort + '/';
      var configRes = lib.jsaci.sendRequestToIDOL(newURL + param, '');
      var confluenceExp = new RegExp('^HasConfluence=([^]*?)$', 'mgi');
      var confluenceRes = confluenceExp.exec(configRes);
      
      if(confluenceRes && confluenceRes[1] && confluenceRes[1].toLowerCase() === "true")
      {
         vars['$G.idol.hasconfluence']=true;
         vars["$G.idol.support.libs"].push("confluencelib");
      }
   }
}
//temporary solution end

function showListInUI() {
  if (vars['$G.kmsearchengine'] === 'IDOL' && vars['$L.file']['name'] === 'knowledge management') {
    var idolConfigObj = lib.IDOLConfigure.require();
    var idolConfig = idolConfigObj.getConfig();
    var idolUrl = idolConfig['server.url'];
    if(idolConfigObj.isInContainer()){
    	idolUrl = idolConfigObj.getSearchMsvcEndPoint();
    }
    var idoldb = {};
    var connected = true;
    try {
      var response = lib.jsaci.runIDOLAction(idolUrl + 'action=getStatus', false, false);
      var xml = new XML();
      xml.setContent(response);
      var xQuery = lib.XQuery.require();
      var databases = xQuery.query('responsedata/databases/database', xml);
      var i;
      for (i = 0; i < databases.length; i++) {
        idoldb[xQuery.queryText('name', databases[i])] = xQuery.queryText('documents', databases[i]);
      }
      //temporary call
      showConfluenceUI(xml);      
    } catch (ex) {
      funcs.msg(funcs.scmsg('102', 'idol', [idolUrl + 'action=getStatus']), 2);
      connected = false;
    }

    vars['$kbname'] = [];
    vars['$L.kbdescription'] = [];
    vars['$L.kbtype'] = [];
    vars['$L.indexstatus'] = [];
    vars['$L.lastindextime'] = [];
    vars['$L.interval']= [];
    vars['$L.doccount']= [];
    vars['$L.thread.num'] = [];

    var kmknowledgebase = new SCFile('kmknowledgebase');
    //kmknowledgebase.setFields(['kbname', 'kbdescription', 'kbtype', 'indexstatus', 'lastindextime', 'interval', 'spconnectorurl', 'sptask', 'idoltoken', 'full.reindex.max.thread']);
    var rc = kmknowledgebase.doSelect('true');
    var divNum=getDivNumber();
    while (rc === RC_SUCCESS) {
      vars['$kbname'].push(kmknowledgebase['kbname']);
      vars['$L.kbdescription'].push(kmknowledgebase['kbdescription']);
      vars['$L.kbtype'].push(kmknowledgebase['kbtype']);
      
      //if the library doesn't exist in idol, offline
      if (idoldb[kmknowledgebase['kbname']]) {
        //since in container the content is duplicate sturcture, so the document number for every database is duplication(double) as well, then need div with 2.
      // vars['$L.doccount'].push(Math.floor(parseInt(idoldb[kmknowledgebase['kbname']])/divNum));
        if(idolConfigObj.isInContainer()){
    	  vars['$L.doccount'].push(Math.floor(parseInt(idoldb[kmknowledgebase['kbname']])/2));
        }else{
          vars['$L.doccount'].push(idoldb[kmknowledgebase['kbname']]/divNum);
        }
        
      } else {
        vars['$L.doccount'].push('');
      }

      if (kmknowledgebase.kbtype === 'sclib') {
        vars['$L.thread.num'].push(kmknowledgebase['full.reindex.max.thread'] || 1);
      } else {
        vars['$L.thread.num'].push('');
      }

      if (connected && kmknowledgebase['kbtype'] !== 'sclib') {
        var status = lib.IDOL_SharePoint.require().getSharePointStatus(kmknowledgebase['spconnectorurl'], kmknowledgebase['idoltoken']);
        if (status !== kmknowledgebase['indexstatus']) {
          kmknowledgebase['indexstatus'] = status;
          kmknowledgebase.doSave();
        }
      }
      if (vars['$G.km.index.status.name'] && vars['$G.km.index.status.name'].length() > 0 && vars['$G.km.index.status.display'] && vars['$G.km.index.status.display'].length() > 0){
        var index = lib.ArrayUtil.indexOf(vars['$G.km.index.status.name'], kmknowledgebase['indexstatus']);
        vars['$L.indexstatus'].push(vars['$G.km.index.status.display'][index]);
      } else {
        vars['$L.indexstatus'].push(kmknowledgebase['indexstatus']);
      }
      vars['$L.lastindextime'].push(kmknowledgebase['lastindextime']);
      vars['$L.interval'].push(kmknowledgebase['interval']);
      rc = kmknowledgebase.getNext();
    }
    
    if (!vars['$new.kbtype']) {
      vars['$new.kbtype'] = 'sclib';
    }
    vars['$L.mult'] = false;
  }
}


/**
 * Check kmquery dbdict structure
 *
 * @returns {Boolean}
 */
function checkKmqueryDbdict()
{
    var dbdict = $("dbdict", SCFILE_READONLY).setFields(["field"]).select("name=\"kmquery\"").uniqueResult();
    
    var booleanType = lib.DataTypeConst.typeBoolean();  
    var fields = dbdict.field;
    var i;
    var length=fields.length();
    for (i = 0; i < length; i++)
    {
      var field = fields[i];

      // check sql table mapping
      var alias = field.sql_field_options.sql_table_alias;

      // not map to nulltable
      if (alias != null && alias.length > 0 && alias.slice(0, 1).toLowerCase() == "n")
      {
        logger.warn(`table ${alias} not map to nulltable!`);
        return false;
      }

      if (field.level == 1 && field.type == booleanType)  
      {
        // boolean type should not be null
        if (alias == null) {
          logger.warn(`field ${field.name} should not be null!`);
          return false;
        }
      }
    }
  
    return true;
}


/**
 * Rebuild kmquery dbdict according with kmknowledgebase records
 *
 * @returns {Number}
 */
function rebuildKmqueryDbdict()
{
  var dbdictName = "kmquery";
  
  // get dbdict fields those related with kmknowledgebase 
  var dbdict = $("dbdict", SCFILE_READONLY).setFields(["field"]).select("name=\"" + dbdictName + "\"").uniqueResult();
  
  var kmfields = [];  
  var booleanType = lib.DataTypeConst.typeBoolean();
  
  var fields = dbdict.field;
  var i;
  var length = fields.length();
  for (i = 0; i < length; i++)
  {
    var field = fields[i];
    if (field.level == 1 && field.type == booleanType)
    {
      kmfields.push(field.name);
    }
  }
  
  var result = RC_NO_MORE;
  
  // go through all kmknowledgebase records
  var records = $("kmknowledgebase", SCFILE_READONLY).setFields(["kbname"]).select("true").iterate(function(record)
  {
    var name = record.kbname;
    
    // ignore APM/Upgrade records
    if (name.indexOf("NEW") == 0 || name.indexOf("OLD") == 0 || name.indexOf("PRE") == 0)
    {
      return;
    }
    
    // ignore pd4 enablement records
    var pdtag = "_for_pd4_tobe_used";
    if (name.indexOf(pdtag) == name.length - pdtag.length)
    {
      return;
    }
    
    // remove '_'
    name = name.replace(/_/g, "");
    
    if (lib.ArrayUtil.contains(kmfields, name))
    {
      return;
    }
    
    //print(name);
    
    if (result == RC_NO_MORE)
    {
      result = RC_SUCCESS;
    }   
    
    // update dbdict
      var rc = callrad("add.new.dbdict.field", ["string1","number1","text"], [name,"4",dbdictName]);
      if (rc != RC_SUCCESS)
      {
        result = rc;
      } 
  });
  
  return result;
}

function removeNullKBFields(fFile) {
  var kbfields = new SCDatum();
  kbfields.setType(8);
  var i;
  var len = fFile.kbfields.length();
  for (i = 0; i < len; i++) {
      if(fFile.kbfields[i].kbfieldname!=null || fFile.kbfields[i].kbfieldvalue!=null || fFile.kbfields[i].kbfieldtype!=null || fFile.kbfields[i].hitlist!=null 
        || fFile.kbfields[i].weight!=null || fFile.kbfields[i].match!=null || fFile.kbfields[i].sort!=null || fFile.kbfields[i].datacleansing!=null) {
        kbfields.push(fFile.kbfields[i]);
      }
  }    
  fFile.kbfields = kbfields;
}

function validateSCFileFieldnameExists(kmlib) {
  var fields = kmlib.kbfields;
  var filename = kmlib.sclibtablename;
  var i;
  var length = fields.length();
  var availabeFields = IDOLCommon.getAllFields(filename);
  for (i = 0; i < length; i++) {
    var field = fields[i];
    if (field.kbfieldname) {
      var name = field.kbfieldname;
      if(name == "guids"){
         continue;
      }
      if (!_.contains(availabeFields, name)) {
        vars['$L.km.validate.msg'] = funcs.scmsg('km_12', 'fc', [ name, filename ]);
        // funcs.cursor_field_name_set('kbfields,kbfieldname', i + 1);
        return false;
      }
    }
  }
  return true;
}

function validateDocumentId(fkmknowledgebase) {
  var tablename = fkmknowledgebase.sclibtablename;
  var uniques = IDOLCommon.findUniqueKeys(tablename);
  return _.contains(uniques, fkmknowledgebase.docid);
}

// km knowledgebase library name can be mapped to IDOL database which is case-insenstive
function isKmKnowledgebaseExists(newKbName) {
  newKbName = newKbName.toLowerCase();
  var fkmknowledgebase = new SCFile('kmknowledgebase', SCFILE_READONLY);
  fkmknowledgebase.setFields("kbname");
  var rc = fkmknowledgebase.doSelect(true);
  while (rc === RC_SUCCESS) {
    var kbname = fkmknowledgebase.kbname || '';
    if (kbname.toLowerCase() === newKbName) {
      return true;
    }
    rc = fkmknowledgebase.getNext();
  }
  return false;
}

function validateKbName(record) {
  // "Error: you must spedify a name and a valid type for your knowledgebase."
  if (!record.kbname || !record.kbtype) { 
    throw funcs.scmsg(174, "km"); 
  }
  // "Error: Valid characters in the name are A-Z, a-z, 0-9 and the underscore character _ only."
  if (record.kbname.indexOf(' ') >= 0) { 
    throw funcs.scmsg(169, "km"); 
  }
  // "Error: The knowledgebase name cannot begin with a number."
  if (/^[0-9].*$/.test(record.kbname)) { 
    throw funcs.scmsg(175, "km"); 
  }
  // "Error: Valid characters in the name are A-Z, a-z, 0-9 and the underscore character _ only."
  if (!/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(record.kbname)) { 
    throw funcs.scmsg(169, "km"); 
  }
  // Error check if a knowledgebase with that name already exists
  if (isKmKnowledgebaseExists(record.kbname)) { 
    throw funcs.scmsg(173, "km"); 
  }
}

function isFieldDefined(filename, fieldname) {
  var dbdict = new SCFile("dbdict", SCFILE_READONLY); 
  var rc = dbdict.doSelect(new QueryCond('name', EQ, filename));
  if (rc === RC_SUCCESS) {
    // XXX: sometimes the field can exists but with different data type
    var isExists = _.find(dbdict.field, function(field) {
      return field.name.toLowerCase() === fieldname.toLowerCase();
    });
    return isExists;
  }
  return false;
}

function addLibrarySelectionFlagField(record) {
  var fieldname = record.kbname;
  fieldname = fieldname.replace('_', '');
  fieldname = fieldname.toLowerCase();

  if (!isFieldDefined('kmquery', fieldname)) {
    $.callrad('add.new.dbdict.field', {
      string1 : fieldname,
      number1 : 4,
      text : 'kmquery'
    }, false);

    // "A Boolean for this knowledgebase name was added to the dbdict."
    print(funcs.scmsg(172, "km")); 
  }
}

function applyKmKnowledgebaseDefaultValue(record) {
  record.locale = vars.$G_my_language.slice(0, 2);
  if (vars['$lo.idol.enabled']) {
    record.indexstatus = lib.KMCollection_Status_Constant.INDEXSTATUS_OFFLINE();

    if(record.kbtype == "weblib") {
      record.webpathlen = 100;
      record.webjumps = 2;
      record.webhost = true;
      record.mimeproperty = "unlimited";
      record.mastermimelist = "";
    }

    if(record.kbtype == "fsyslib") {
      record.webpathlen = 100;
      record.mimeproperty = "unlimited";
      record.mastermimelist = "";
    }
  }
}

// this function can be invoked by two Process
// SOLR Engine: 'kmknowledgebase.newkb'
//
// Process 'kmknowledgebase.newkb' is defined in States 'kmknowledgebase.search'
// its a standard docengine Process, its $L.file is 'kmknowledgebase'
//
// IDOL Engine: 'kmknowledgebase.add'
// But when using IDOL search engine, the add libary Process was defined
// in States 'environment.view', that is to say $L.file is not available
function initKmKnowledgeLibrary(record) {
  validateKbName(record);

  // XXX: in fact, "add field" step is not required when using IDOL as the search engine.
  // since IDOL search doesn't depends on 'kmquery' file structure

  // SOLR: add kbname as a boolean field in kmquery dbdict, use it to indicate library was selected or not
  // since in 'kmquery' format, every 'input' must have a field mapped to it
  // BTW: 
  // maybe use varialbe as 'input' binding can be a better choice, such as '$L.xxx.library.selected' ...
  addLibrarySelectionFlagField(record);

  applyKmKnowledgebaseDefaultValue(record);

  // Add the three scripts: kmaccess, kmcategoryidxscript, and kmsearchsecurity
  lib.KMCollection_Create.addScripts(record);
}