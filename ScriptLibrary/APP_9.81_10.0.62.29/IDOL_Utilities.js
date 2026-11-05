var IDOLConfigure = lib.IDOLConfigure.require();
var IDOLURLParser = lib.IDOLURLParser.require();
var IDOLFileMagic = lib.IDOLFileMagic.require();

//declare the logger instance for current script library
var logger = getLog('IDOL_Utilities');

//using IDOL to fill record's fields
function fillIncidentsByIdol(in_file,numresult,company, isbg)
{
  var fadapter = new SCFile(lib.IDOL_Constant.getCategoryConfigFileName());
  var file_name = funcs.filename(in_file);
  
  var rc = fadapter.doSelect("table.name=\"" + file_name + "\" and is.active=true");
  while(rc == RC_SUCCESS)
  {
    var i;
    
    var isContinue = true;
    //if run in background and the fields are filled, do not overwrite by idol
    if (isbg) {
      isContinue = false;
      var fields = [fadapter['level1.field'], fadapter['level2.field'], fadapter['level3.field']];
      for (i = 0; i < fields.length; i++) {
        if (fields[i] && !in_file[fields[i]]) {
          isContinue = true;
        }
      }
    }

    if (isContinue) {
      var targetFields;
      //if the adatper only has one field, call link to filter
      if (!fadapter['level2.field'] && !fadapter['level3.field']) {
          targetFields = lib.acicategory.getCategoryByContent(in_file,fadapter.adapter_id,suggestNumberBeforeFilter(),company);
          targetFields = filterIdolIndex(in_file, fadapter['level1.field'], numresult, targetFields);
      } else {
          targetFields = lib.acicategory.getCategoryByContent(in_file,fadapter.adapter_id,numresult,company);
      }
      
      var lstTop;
      
      if (fadapter.level1_field != null)
      {
        if (targetFields.length>=1)
        {
          lstTop = [];
          in_file[fadapter.level1_field.toString()]=targetFields[0][0];
          
          for(i=0;i<targetFields.length;i++)
          {
            lstTop.push(targetFields[i][0]);
          }
          vars["$idol." + fadapter.level1_field.toString()]=lstTop;
        }
      }
      
      if (fadapter.level2_field != null)
      {
        if (targetFields.length>=1)
        {
          lstTop = [];
          in_file[fadapter.level2_field.toString()]=targetFields[0][1];
          
          for(i=0;i<targetFields.length;i++)
          {
            lstTop.push(targetFields[i][1]);
          }
          vars["$idol." + fadapter.level2_field.toString()]=lstTop;
        }
      }
      if (fadapter.level3_field != null)
      {
        if (targetFields.length>=1)
        {
          lstTop = [];
          in_file[fadapter.level3_field.toString()]=targetFields[0][2];
          
          for(i=0;i<targetFields.length;i++)
          {
            lstTop.push(targetFields[i][2]);
          }
          vars["$idol." + fadapter.level3_field.toString()]=lstTop;
        }
      }
    }
    
    rc = fadapter.getNext();
  }
}

/**
*   Call the related master link to filter the auto filled record
*
*   @param {in_file} - SCFile of current record
*   @param {field} - field name of current record
*   @param {numresult} - result number
*   @param {suggestCat} - Array of auto filled category without filtering
*   @return - Filered by link
*   @type - Array
**/
function filterIdolIndex(in_file, field, numresult, suggestCat) {
    if (!suggestCat || suggestCat.length === 0) {
        return [];
    }
    var availCat = []; //available categories by link
    
    //retrieve link by file name
    var link = new SCFile('link', SCFILE_READONLY);
    var rc = link.doSelect('name = "' + funcs.filename(in_file) + '"');
    //if no link found, return the top numresult
    if (rc !== RC_SUCCESS) {
        return suggestCat.slice(0,numresult);
    }
    
    //get the source field and targe field in link
    var sourceFields = link['source.fields'];
    var targetField;
    var length = sourceFields.length();
    for (i = 0; i < length; i++) {
        if (sourceFields[i] === field) {
            targetField = link['target.fields'][i];
        }
    }
    
    //if no sorece field or target field, return the top numresult without filtering
    if (targetField === undefined) {
        return suggestCat.slice(0,numresult);
    }
    
    var category = [];

    var fieldWrapper = {isArray: false};
    fieldWrapper['field'] = field;
    //get link line
    var linkObj = lib.LinkUtil.getLink(in_file, funcs.filename(in_file), fieldWrapper);
    if (linkObj){
        //append the query as ' and *** isin {}'
        var isinQuery = ' and ' + linkObj.targetField + ' isin {"' + suggestCat.join('","')  + '"}';
        if (/^\$/.test(linkObj.query)) {
            // The query expression is defined as a variable
            vars[linkObj.query] += isinQuery;
        } else {
            linkObj.query += isinQuery;
        }

        var result = lib.LinkUtil.getSCFileByLink(in_file, linkObj, [targetField], fieldWrapper, false, false);
        //if cannot find any available category by link, return empty
        if (result) {
            var file = result.file;
            rc = file && RC_SUCCESS;
            while (rc === RC_SUCCESS) {
                availCat.push(file[targetField]);
                rc = file.getNext();
            }
        
            var i;
            var j;
            for (i = 0; i < suggestCat.length; i++) {
                if (category.length >= numresult) {
                    break;
                }
                
                for (j = 0; j < availCat.length; j++) {
                    if (availCat[j] === suggestCat[i][0]) {
                        category.push([availCat[j]]);
                        break;
                    }
                }
            }
        }
        return category;
    }
    
    return suggestCat.slice(0,numresult);
}

//using for get all configed index status by id
function getIndexStatus()
{
    var i;
    for (i = 1; i < 6 ; i++) {
        vars["$ilstitem" + i]="";
        vars["$ilstvalue" + i]="";
    }
    var f = new SCFile("idolindex", SCFILE_READONLY);
    f.setFields(["table.name"]);
    var rc = f.doSelect(true);
    
    if (vars['$index.page.start'] > 1) {
        vars['$L.show.prev.index'] = true;
    } else {
        vars['$L.show.prev.index'] = false;
    }
    
    vars.$ilstnumber = 0;
    var index = 0;
    while(rc == RC_SUCCESS)
    {
        index ++;
        if (index >= vars['$index.page.start']){
            vars.$ilstnumber += 1;
            if (vars.$ilstnumber > 5) {
                vars['$L.show.more.index'] = true;
                break;
            }
            var itemname;
            var itemvalue;
            var ar = lib.aciindex.getIndexStatus(f.table_name);
            
            itemname = f.table_name;
            itemvalue = ar[1];
            vars["$ilstitem" + vars.$ilstnumber]=itemname + "";
            vars["$ilstvalue" + vars.$ilstnumber]=itemvalue + "";
        }
        vars['$L.show.more.index'] = false;
        rc = f.getNext();
    }
}


 //using for get all configed categorization test status by id
function getTestStatus()
{
    var i;
    for (i = 1; i < 11 ; i++) {
        vars["$tstlstitem" + i]="";
        vars["$tstlstvalue" + i]="";
    }
    
    vars.$tstlstnumber = 0;
    var index = 0;
    var f = new SCFile("idoladapter", SCFILE_READONLY);
    f.setFields(["adapter.id","category.group.name"]);
    var rc = f.doSelect(true);
    
    if (vars['$adapter.page.start'] > 1) {
        vars['$L.show.prev'] = true;
    } else {
        vars['$L.show.prev'] = false;
    }
    
    while(rc == RC_SUCCESS)
    {
        index ++;
        
        if (index >= vars['$adapter.page.start']){
            vars.$tstlstnumber += 1;
            if (vars.$tstlstnumber > 10) {
                vars['$L.show.more'] = true;
                break;
            }
            var itemname;
            var itemvalue;
            var ar = lib.acicategory.getCategoryGroupTestRunningStatus(f.adapter_id);
            
            itemname = f.category_group_name;
            itemvalue = ar[1];
            vars["$tstlstitem" + vars.$tstlstnumber] = itemname + "";
            vars["$tstlstvalue" + vars.$tstlstnumber] = itemvalue + "";
        }
        vars['$L.show.more'] = false;
        rc = f.getNext();
    }
}
 

 //using for get all configed categorization training status by id
function getTrainingStatus()
{
    var i;
    for (i = 1; i < 11 ; i++) {
        vars["$tlstitem" + i]="";
        vars["$tlstvalue" + i]="";
    }
    vars.$tlstnumber = 0;
    var index = 0;
    var f = new SCFile("idoladapter", SCFILE_READONLY);
    f.setFields(["adapter.id","category.group.name"]);
    var rc = f.doSelect(true);
    while(rc == RC_SUCCESS)
    {
        index ++;
        
        if (index >= vars['$adapter.page.start']){
            vars.$tlstnumber += 1;
            if (vars.$tlstnumber > 10) {
                vars['$L.show.more'] = true;
                break;
            }
            var itemname;
            var itemvalue;
            var ar = lib.acicategory.getAutoCategorizationRunningStatus(f.adapter_id);
            
            itemname = f.category_group_name;
            itemvalue = ar[1];
            vars["$tlstitem" + vars.$tlstnumber] = itemname + "";
            vars["$tlstvalue" + vars.$tlstnumber] = itemvalue + "";
        }
        vars['$L.show.more'] = false;
        rc = f.getNext();
    }
}
 

function getIdolServerStatus(ServerUrl, isOem)
{
    var result = lib.jsaci.checkServerStatus(ServerUrl, isOem);
    return result;
} 


 /**
* This counts the number of records the filter is returning
* <br>
* History:<br>
* 20130505 - Jan Steube Function created
* 20131128 - Shuangshan Chang updated<br>
*
* @date     20131128
* @param   {record}
*
*/
function testFilter(record)
{
    var query       = record.query;         
    var fFile       = new SCFile(record.table_name, SCFILE_READONLY);
    
    var dStart      = Date.now(); 

    if (query == null || query == "")
    {
        query = "true";
    }
    
    var nCount      = fFile.doCount(query);
    
    var dEnd = Date.now(); 
    
    var nDuration = Math.round((dEnd-dStart)/1000);
    
    var message;
    if (nCount > 0) {
        message = funcs.scmsg("23","survey",[nCount, nDuration]);
    }
    else {
        message = funcs.scmsg("24","survey",[nDuration]);
    }
    
    lib.KMUtils.domessageBox(message);
}


/**
*   Call IDOL Image Service to process the attachment in a ticket and set it to target field
*
*   @param {record} - scfile of a ticket record
**/
function processOCR(record, targetField, language, retryTimes, intervalTimes, priority){
    var attachments = record.getAttachments();
    var isInDAH = checkOCRInDAH();
    var description = '';
    var text;
    
    if (attachments && vars.$lo_idol_img_enabled) {
        var index = 0;
        var i;
        for (i in attachments) {
            if (isImage(attachments[i])){
                var fileSize = attachments[i].len;
                if (isInDAH && fileSize > maxImageSizeDAH()) {
                    text = funcs.scmsg('67', 'idol', [attachments[i].name]);
                } else {
                    text = lib.IDOLImageOCRService.synchronousParse(attachments[i].value, language, retryTimes, intervalTimes, priority);
                }
                if (text) {
                   if (index > 0) {
                        description += '\n' + ocrSeperator() + '\n';
                    }
                    description += text;
                    index ++;
                }
            }
        }
    }
    
    if (description !== '') {
        var msgrecord = '1';
        var msgclass = 'idol';
        var args = [];
        args.push( 'The following text was recognized within the attached image: ');
        text = funcs.scmsg(msgrecord,msgclass,args);
        text += '\n' + ocrFlag() + '\n';
        text += description;
        text += '\n' + ocrFlag();
        record[targetField] = [removeOCRDescription(record[targetField])];
        record[targetField].push(text);
        return true;
    }
    return false;
}


/**
*   Call IDOL Image Service to process the attachment in interaction from GUI
*
*   @param {interactionId} - scfile of interaction
**/
function processOCRFG(interaction, targetField){
    var retryTimes = 5;
    var intervalTimes = 5;
    var priority = 50;
    var attachments = interaction.getAttachments();
    if (attachments.length === 0) {
        funcs.msg(funcs.scmsg('4', 'idol', []), 1);
    }
    try {
        // XXX: from operator or from contacts?
        var language = detectLanguage(interaction);

        if (targetField!=null && targetField!="" && targetField != undefined) {
        } else {
            targetField = "description";
        }

        processOCR(interaction, targetField, language, retryTimes, intervalTimes, priority);
    } catch(ex) {
        funcs.msg("Call OCR interface error:" + ex, 3);
    }
}
/**
QCCR1E151040: Get the related incidents by specified types
@relationTypes: (Optional) Array for relation types from interaction view
*/
function getRelatedIncident(interactionId, relationTypes){
    var relation = new SCFile("screlation", SCFILE_READONLY);
    relation.setFields(["source"]);
    var sql = 'depend="'+interactionId+'" and depend.filename="incidents" and source.filename="problem" and source.active=true';
    if(!!relationTypes) {
        sql += ' and type isin ' + funcs.str(relationTypes);
    }
    var relatedFile = "probsummary";
    var unique = "number";
    var target;
    if ( relation.doSelect( sql ) == RC_SUCCESS ){
        var record_id = relation.source;
        var prob_file = new SCFile(relatedFile);
        if (prob_file.doSelect("" + unique +"=\"" + record_id + "\"" ) == RC_SUCCESS ){
            return prob_file;
        }
    }
    return null;
}

function syncOCR2Incident(interactionId, ocrMsg, targetField){
    logger.info("syncOCR2Incident("+interactionId+", ocrMsg,"+targetField+")");
    var file_prob = getRelatedIncident(interactionId);
    if(file_prob){
        file_prob[targetField].push(ocrMsg);
        file_prob.doUpdate();
    }       
}

/**
*   Call IDOL Image Service to process the attachment in interaction in background
*
*   @param {interactionId} - value of incident.id
**/
function processOCRBG(interactionId, language, company, targetField, targetFileKeyField, targetFileName){
    var retryTimes = 10;
    var intervalTimes = 60;
    logger.info("set retry time:"+retryTimes+", interval time:"+intervalTimes);
    if (!interactionId) {
      return null;
    }

    if (targetFileName!=null && targetFileName!="" && targetFileName != undefined) {
    } else {
        targetFileName = "incidents";
    }
    if (targetFileKeyField!=null && targetFileKeyField!="" && targetFileKeyField != undefined) {
    } else {
        targetFileKeyField = "incident.id";
    }

    var interaction = new SCFile(targetFileName);

    var result = interaction.doSelect(targetFileKeyField + ' = "' + interactionId + '"');
    if (result !== RC_SUCCESS){
        return null;
    }

    if (targetField!=null && targetField!="" && targetField != undefined) {
    } else {
        targetField = "description";
    }

    processOCR(interaction, targetField, language, retryTimes, intervalTimes);

    if (vars.$lo_idol_enabled) {
        /**
        * to support Smart Ticket mandant and mandant value perhaps be array (not only a string)
        **/
        lib.IDOL_SMIS.addOCRTask(interaction, 'AutoFill', company);
    }
    interaction.doUpdate();
    /*
    the following is for QCCR1E134493
    OCR and Classification result doesn't copy from interaction to incident in Streamline interaction mode
    */
    try{
        var ocrMsg = interaction[targetField][1];
        syncOCR2Incident(interactionId, ocrMsg, "action");
    }catch(ex){
        logger.error("error trying to sync interaction to related incident (" + interactionId + "):" + ex);
    } 

    return true;
}


/**
*   Remove the ocr description from ticket description
*
*   @param {description} - The ticket description
*   @return - description without OCR
*   @type - string
**/
function removeOCRDescription(description){
    var descriptionToPlainText = function(description){
        var result = '';
        var i;
        var length = funcs.lng(description);
        for (i = 0; i < length; i++) {
            if (description[i]) {
                result += description[i];
                if (i < length - 1) {
                    result += '\n';
                }
            }
        }
        return result;
    };
    
    var tmpDesc = descriptionToPlainText(description);
    
    var OCR_FLAG = ocrFlag();
    
    var strReg = '\n(.*)\n\\' + OCR_FLAG + '\n([\\s\\S]*)\n\\' + OCR_FLAG;
    var reg = new RegExp(strReg, 'gm');
    
    tmpDesc = tmpDesc.replace(reg, '');
    
    return tmpDesc;
}

function ocrFlag(){
    return '---------------------------------------------------------------------';
}

function ocrSeperator(){
    return '------------------------------------------------------------';
}


/**
*   Check level1.field, level2.field & level3.field in idoladapter have duplcated value.
*
*   @param {adapter} - the adapter instance
*   @return - true duplicated/false
*   @type - boolean
**/
function checkAdapterDuplicatedFields(adapter) {
    var arrField = [];
    var field1 = adapter['level1.field'];
    if (field1) {
        arrField.push(field1);
    }
    
    var field2 = adapter['level2.field'];
    if (field2) {
        arrField.push(field2);
    }
    
    var field3 = adapter['level3.field'];
    if (field3) {
        arrField.push(field3);
    }
    
    if (hasDuplicateElement(arrField)) {
        return true;
    }
    
    return false;
}


/**
*   Check content.fields in idoladapter have duplcated value.
*
*   @param {adapter} - the adapter instance
*   @return - true duplicated/false
*   @type - boolean
**/
function checkDuplicatedContent(arrField) {
    var categoryArr = arrField.toArray();
    if (hasDuplicateElement(categoryArr)) {
        return true;
    }
    
    return false;
}


/**
*   Check an array has duplcated element.
*
*   @param {adapter} - the adapter instance
*   @return - true duplicated/false
*   @type - boolean
**/
function hasDuplicateElement(array) {
    var i;
    var j;
    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array.length; j++) {
            if (array[i] === array[j] && i !== j){
                return true;
            }
        }
    }
    return false;
}

/**
*   Check the adapter already existed with same categorized fields and module in idoladapter table.
*
*   @param {adapter} - the adapter instance
*   @return - true existed or false not existed
*   @type - boolean
**/
function checkAdatperByTableCategories(adapter) {
    var adapterObj = {};
    adapterObj['table.name'] = adapter['table.name'];
    adapterObj['level1.field'] = adapter['level1.field'];
    adapterObj['level2.field'] = adapter['level2.field'];
    adapterObj['level3.field'] = adapter['level3.field'];
    var result = lib.IDOLAdapterDAO.findIDOLAdapter(adapterObj, ['adapter.id']);
    if (!result) {
        return false;
    }
    
    var rc = RC_SUCCESS;
    while (rc === RC_SUCCESS){
        if (result['adapter.id'] !== adapter['adapter.id']) {
            return true;
        } else {
            rc = result.getNext();
        }
    }

    return (rc === RC_SUCCESS);
}

/**
*   Check fields list by table name and field type
*
*   @param {tablename} - dbdict table name
*   @param {type} - int value of field type. e.g. number: 1 character: 2
*   @return - field list of dbdict name and caption name
*   @type - array of array [[dbdictList], [captionList]]
**/
function getAllFieldsByType(tablename, type){
    var tmp = getAllFields(tablename);

    var resultNames = [];
    var resultCaptions = [];
    
    if (tmp != null)
    {
        var fieldNames = tmp[0].toArray();
        var fieldCaptions = tmp[1].toArray();
    
        var i;
        var scfile = new SCFile(tablename);
        if (typeof scfile.getFieldType === 'function') {
            for (i=0;i<fieldNames.length;i++) {
                if (scfile.getFieldType(fieldNames[i]) === type){
                    resultNames.push(fieldNames[i]);
                    resultCaptions.push(fieldCaptions[i]);
                }
            }
        } else {
            var dbdict = new SCFile('dbdict');
            dbdict.doSelect('name="' + tablename + '"');
            for (i=0;i<fieldNames.length;i++) {
                if (lib.dbdictHelper.getFieldType(dbdict, fieldNames[i]) === type) {
                    resultNames.push(fieldNames[i]);
                    resultCaptions.push(fieldCaptions[i]);
                }
            }
        }
    }
    return [resultNames, resultCaptions];
}


/**
*   Get attachment size from an scfile
*
*   @param {scfile} - an record of scfile
*   @return - size of the attachment
*   @type - number
**/
function getAttachmentLength(scfile) {
    return scfile.getAttachments().length;
}


/**
*   pre javascription in do idoladapter.list_training & idoladapter.list_test
**/
function trainTestAdapterInList() {
    var index = funcs.cursor_line(1);

    if (index > vars['$adapter.number'] || index < 1) {
        vars['$error.msg'] = funcs.scmsg('6', 'idol');
    } else {
        var adapterName = vars['$adapter.names'][index - 1];
        vars['$L.file'] = lib.IDOLAdapterDAO.getAdapterByName(adapterName);
    
        /*if (vars['$G.multi']) {
            vars['$lo.securityGroups'] = '';
            vars['$securityGroup'] = [];
            var secGroup = lib.IDOLAdapterDAO.getSecGroupByAdapterId(vars['$L.file']['adapter.id']);
            if (secGroup != null) {
                do {
                    if (vars['$lo.securityGroups'] !== '') {
                        vars['$lo.securityGroups'] += ','
                    }
                    vars['$lo.securityGroups'] += secGroup['security.id'];
                    vars['$securityGroup'].push(secGroup['security.id']);
    
                } while (secGroup.getNext() === RC_SUCCESS)
            } else {
                vars['$error.msg'] = funcs.scmsg('7', 'idol', [adapterName]);
            }
        }*/
    }
}

/**
*   Get all companies configured in adapter
*
*   return - company list
*   type - Array
*/
function getCompaniesForTraining() {
    
    var companies = [];
    var secGroup = lib.IDOLAdapterDAO.getSecGroupByAdapterId(vars['$L.file']['adapter.id']);

    if (secGroup != null) {
        do {
            companies.push(secGroup['security.id']);
            
        } while (secGroup.getNext() === RC_SUCCESS);
    } 
    return companies;
}

/**
*   post javascription in do idoladapter.list_training & idoladapter.list_test
*   clean up some vars
**/
function cleanUpTrainTestInList() {
    vars['$error.msg'] = null;
    vars['$lo.securityGroups'] = null;
    vars['$securityGroup'] = null;
}


/**
*   Get record info idolserverinfo table
*
**/
function getIDOLServerConfig() {
    return IDOLConfigure.getConfig();
}


/**
*   Check if the idol url is valided or not
*
*   @param {str} - idol url
*   @return - is valided or not
*   @type - boolean
**/
function isValidIdolURL(str) {
  if (!str || str === '') {
    return true;
  }
    var reg = /^http(s)?:\/\/(.*)\/$/;
    return reg.test(str);
}


function isValidHost(str) {
  if (!str || str === '') {
    return true;
  }
  var reg = /^http(s)?:\/\/localhost|127.0.0.1(.*)\/$/;
  return !reg.test(str);
}

function isValidFilePathWindows(str){
  if (!str || str === '') {
    return false;
  }
  var reg = /^[a-z]:((\/|(\\\\?))[\w.]+)+\.*$/i;
  return reg.test(str);
}

function isValidFilePathLinux(str){
  if (!str || str === '') {
    return false;
  }
  var reg = /^\/((\/|(\\?))[\w.]+)+\.*$/i;
  return reg.test(str);
}

function isValidFilePath(str){
	return isValidFilePathWindows(str) || isValidFilePathLinux(str);
}

function isValidPort(str){
    var intPort = funcs.val(str, 1);
	if(!str ||  intPort == null){
	   return false;
	}
	
	if(intPort <1 || intPort > 65536) {
	  return false;
	}
	
	return true;
}

function getAllRestoreJob() {
    vars['$restore.jobId'] = [];
    vars['$restore.jobName'] = [];
    vars['$restore.jobStartTime'] = [];
    vars['$restore.jobStatus'] = [];


	var restorejob = new SCFile('idolrestorejob', SCFILE_READONLY);
	restorejob.setOrderBy(['starttime'], [SCFILE_DSC]);
	var rc = restorejob.doSelect('true');
	
	if (rc === RC_SUCCESS) {
	    do{
	        vars['$restore.jobId'].push(restorejob['initialID']);
	        vars['$restore.jobName'].push(restorejob['jobname']);
	        vars['$restore.jobStartTime'].push(restorejob['starttime']);
	        vars['$restore.jobStatus'].push(funcs.scmsg("restore_status_" + restorejob['restore.status'], "idol_restore"));
	    } while (restorejob.getNext() === RC_SUCCESS);    
    }
}


/**
*   This function is add current interaction to idoltuning table
*   If the interaction does already in idoltunning table, return false
*
*   @param {interaction} - scfile of interaction
*   @return - is added successfully or not
*   @type - boolean
**/
function addIDOLTuning(interaction) {
    var idolTuning = new SCFile('idoltuning');
    
    var rc = idolTuning.doSelect('file.name="incidents" and file.key="' + interaction['incident.id'] + '"');
    if (rc === RC_SUCCESS) {
        return false;
    }
    
    var newId = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode , newId, "idoltuning");
    var id = newId.getText();
    
    idolTuning['id'] = id;
    idolTuning['file.name'] = 'incidents';
    idolTuning['file.key'] = interaction['incident.id'];
    idolTuning['title'] = interaction['title'];
    idolTuning['service'] = interaction['affected.item'];
    idolTuning['category'] = interaction['category'];
    idolTuning['subcategory'] = interaction['subcategory'];
    idolTuning['area'] = interaction['product.type'];
    
    idolTuning.doInsert();
    return true;
}


/**
*   Check if the user has previledge to process idol
*
*   @param {str} - idol url
*   @return - is valided or not
*   @type - boolean
**/
function hasIDOLRight() {
    var hasRight = funcs.lioption("Smart Analytics") && (funcs.index("SysAdmin", vars['$lo.ucapex'])>0 || funcs.index("idol.assistant", vars['$lo.ucapex'])>0);
    
    return hasRight;
}


function hasAdminRight() {
    var hasRight = funcs.lioption("Smart Analytics") && funcs.index("SysAdmin", vars['$lo.ucapex'])>0;
    
    return hasRight;
}


/**
 * Check if the attachment is an image or not
 **/
function isImage(attachment) {
    var filename = attachment.name;
    var ext = filename.substr(filename.lastIndexOf("."));
    var imgNameList = ['.jpg','.jpeg','.gif','.png','.bmp','.tiff','.tif'];
    var i;
    for (i = 0; i < imgNameList.length; i++) {
        if (ext.toLowerCase() === imgNameList[i]) {
            var binary = attachment.value;
            var mineType = IDOLFileMagic.detectMineType(binary);
            return mineType.indexOf('image') >= 0;
        }
    }
    return false;
}

/**
*   Get OCR thread number
*   @return - thread number
*   @type - number
**/
function getIDOLThreadNumber(from, type) {
    if(IDOLConfigure.isInContainer()){
        return 1;
    }
    var url;
    var idolServerInfo = vars['$file'];

    if (from !== 'UI') {
        idolServerInfo = getIDOLServerConfig();
    }
    
    if (type === 'IDOL' || type === 'AutoFill') {
        url = idolServerInfo['server.url'];
    } else {
        url = idolServerInfo['image.url'];
    }
    
    var response = lib.IDOLRequest.require().doIDOLGet(url, { action : 'getstatus' });
    
    var xQuery = lib.XQuery.require();
    var threadNodes = Number(xQuery.queryText('responsedata/acithreads', response));
    
    return threadNodes;
}


/**
*   Get OCR thread number
*   @return - thread number
*   @type - number
**/
function getOCRThreadNumber(from) {
    var imgURL;
    if (from === 'UI') {
        imgURL = vars['$file']['image.url'];
    } else {
        imgURL = getIDOLServerConfig()['image.url'];
    }
    
    var response = lib.IDOLRequest.require().doIDOLGet(imgURL, { action : 'threadstatus' });
    
    var xQuery = lib.XQuery.require();
    var threadNodes = xQuery.query('responsedata/autn:threads/autn:thread', response);
    
    return threadNodes.length;
}


/**
*   Check if the OCR is in DAH mode or not
*   @param {imgURL} - The image server (OCR) address
*   @return - The image server is in DAH or not
*   @type - boolean
**/

function checkOCRInDAH(imgURL) {
    
    if (vars['$G.idol.ocr.dah'] != null) {
        return vars['$G.idol.ocr.dah'];
    }
    if (!imgURL) {
        imgURL = getIDOLServerConfig()['image.url'];
    }
    try {
      var response = lib.jsaci.runIDOLAction(imgURL + 'action=getchildren');
    } catch (e) {
        throw new Error(funcs.scmsg('102', 'idol', [imgURL + 'action=getchildren', e]));
    }

    var xml = new XML();
    xml.setContent(response);
    
    var secondLevelNode = xml.getFirstChildElement();
    var responsedataNode = secondLevelNode.getNextSiblingElement().getNextSiblingElement();
    var subdataNode = responsedataNode.getFirstChildElement();
    
    var childcount = '0';

    while (subdataNode != null) {
        if (subdataNode.getName() === 'children') {
            var subchildrenNode = subdataNode.getFirstChildElement();
            while (subchildrenNode != null) {
                if (subchildrenNode.getName() === 'num_children') {
                    childcount = subchildrenNode.getValue();
                }
                subchildrenNode = subchildrenNode.getNextSiblingElement();
                break;
            }
            break;
        }
        subdataNode = subdataNode.getNextSiblingElement();
    }
    var isDAH = (childcount !== '0');
    vars['$G.idol.ocr.dah'] = isDAH;
    return isDAH;
}


function detectLanguage(interaction) {
  var result = [];
  
  var callbackContact = interaction['callback.contact'];
  var contact = new Query('contacts', new QueryCond('contact.name', EQ, callbackContact))[0];
  var language = contact ? contact["language"] : "";
  result = addOCRLanguage(result, language);
  
  var openedBy = interaction['opened.by'];
  contact = new Query('contacts', new QueryCond('operator.id', EQ, openedBy))[0];
  language = contact ? contact["language"] : "";
  result = addOCRLanguage(result, language);
  
  var loginLanguage = vars['$G.my.language'];
  result = addOCRLanguage(result, loginLanguage);
  
  var syslang = vars['$G.system.info']['syslanguage'];
  result = addOCRLanguage(result, syslang);
  
  var defaultLang = 'en';
  result = addOCRLanguage(result, defaultLang);
  
  return result;
}


function addOCRLanguage(langs, newLang) {
  var IDOL_Image_Lang_Rule = lib.IDOL_Image_Lang_Rule.require();
  var idolLanguage = IDOL_Image_Lang_Rule.mappingIDOLLang(newLang);
  langs = IDOL_Image_Lang_Rule.addLanguage(langs, idolLanguage);
  return langs;
}

/**
 * Get All fields name and caption by table and sort by caption
 * @param {tablename} - table name
 * @return - array of caption array and name array
 * @type - array
 */
function getAllFields(tablename) {
  var tmp = lib.GetFieldNames.getAllFields(tablename);
  funcs.rtecall("sort", vars['$L.rc'], tmp, 1,0);
  return tmp;
}

function suggestNumberBeforeFilter() {
  return 10;
}

function maxImageSizeDAH() {
  return 1024*1024;
}

function getIDOLHost(url) {
    
  //var idolHostExp = new RegExp('http[s]?://([^]*?):', 'mgi');
  //var host = idolHostExp.exec(url)[1];
  var idolServerEP = IDOLURLParser.parse(url);
  var host =idolServerEP.host;
   
  if (host.indexOf(':') >0) { 
    return '['+host+']';
  }
  else {
    return host;
  }
}

function getCommonEndpoint(endpoint) {
    
    if (endpoint==null || endpoint=="") {
        return endpoint;
    }
    
    var idolHostExp = new RegExp('http[s]?://([^]*?):[0-9]+/', 'mgi');
    var host = idolHostExp.exec(endpoint)[1];
    if (host.indexOf(':') > 0 && host.indexOf('[')<0)
    {
        endpoint = endpoint.replace(host , '['+host+']');
    }
    return endpoint;
}

// the 3 functions below are used in schedule JavaScript   
function scheduleKMAttachment() {
  try {
    IDOLConfigure.clearIDOLServerConfigCache();
    
    //refresh vars['$G.km.globalenv']['km.expiration.period']
    var environment = new SCFile("environment",SCFILE_READONLY);
    var rc = environment.doSelect("name=\"knowledge management\"");
    if(rc == RC_SUCCESS)
    {
        vars['$G.km.globalenv']['km.expiration.period'] = environment["km.expiration.period"];
    }
    
    lib.KMAttachment_Index.doIndex();
  } catch(e) {
    logger.error(e);
  }
}

function scheduleKMAttachmentStatus() {
  try {
    IDOLConfigure.clearIDOLServerConfigCache();
    lib.KMAttachment_GetStatus.processToken();  
  } catch(e) {
    logger.error(e);
  }
}

function scheduleKMUpdate() { 
  try {
    var KMEngineFactory = lib.KMEngineFactory.require();
    var engine = KMEngineFactory.create();
    engine.refreshIndexes();

    lib.KMUtils.getIndexedSCFileArray();
  } catch (e) {
    logger.error(e);
  }
}


/**
 * Retrieve and display all categorizer status information
 * displayscreen: idoladapter.list
 */
function getAllAdapterFromGUI() {
  vars['$adapter.names'] = [];
  vars['$adapter.modules'] = [];
  vars['$adapter.active'] = [];
  vars['$adapter.test.status'] = [];
  vars['$adapter.training.status'] = [];
  vars['$adapter.number'] = 0;

  var fCatgorizer = new SCFile('idoladapter', SCFILE_READONLY);
  var rc = fCatgorizer.doSelect(true);
  while (rc === RC_SUCCESS) {
    var status = lib.acicategory.getCategorizerStatus(fCatgorizer);

    vars['$adapter.names'].push(status.name);
    vars['$adapter.modules'].push(status.moduleName);
    vars['$adapter.active'].push(status.isActive);
    vars['$adapter.training.status'].push(status.trainingStatus);
    vars['$adapter.test.status'].push(status.testStatus);
    
    vars['$adapter.number']++;

    rc = fCatgorizer.getNext();
  }
}

//return empty array if not find any expert
function findExpertAssignee(text, group) {
    try {
        //check parameter
        if (!text) {
            return [];
        }
        //check KM index status
        var kmFiles = lib.KMCache.getKmknowledgebaseByFileName('operator');
        if (kmFiles == null || kmFiles.length == 0) {
            return [];
        }
        var database = [];
        var i = 0;
        var assignees = [];
        //remove none used symbol
        var content = text.replace(/\(/g, " ");
        content = content.replace(/\)/g, " ");
        content = content.replace(/\?/g, " ");
        content = content.replace(/\:/g, " ").trim();
        if (!content) {
            return [];
        }
        for (i = 0; i < kmFiles.length; i++) {
            var kmFile = kmFiles[i].file;
            database.push(kmFile.kbname);
        }
        var command = {
            "action": "Query",
            "TotalResults": false,
            "IgnoreSpecials": false,
            "DetectLanguagetype": true,
            "DatabaseMatch": database.toString(),
            "Predict": false,
            "AnyLanguage": true,
            "TimeoutMS": 3000,
            "MaxResults": 5,
            "PrintFields": "NAME",
            "Text": content
        };
        if (group) {
            command["FieldText"] = "(MATCH{" + group.toString() + "}:ASSIGNMENT_GROUPS_MATCH)";
        }
        var IDOLClientFactory = lib.IDOLClientFactory.require();
        var gsclient = IDOLClientFactory.create('GlobalSearch');
        var doc = gsclient.executeAction(command);
        var XQuery = lib.XQuery.require();
        var collection = XQuery.query('responsedata/autn:hit', doc);
        var _ = lib.Underscore.require();
        var result = _.map(collection, function(hit) {
            var data = XQuery.queryObject({
                NAME: 'autn:content/DOCUMENT/NAME'
            }, hit);
            assignees.push(data.NAME);
            return data;
        });
        return assignees;
    } catch (e) {
        logger.error('findExpertAssignee meet exception:' + e);
        return [];
    }
}