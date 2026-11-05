
var suffix = '_idol_enable';

var menu_to_remove = {'KM GUI MENU': ['Configure Hitlists', 'Configure Search Servers', 'Search Knowledgebase', 'Update Indexes'],
            'ESSSM': ['Search Knowledgebase'], 'ESSSM-Approval': ['Search Knowledgebase'], 'IM': ['Search Knowledgebase'], 'IM PD': ['Search Knowledgebase'],
            'PM PD': ['Search Knowledgebase'], 'KB GUI MENU': ['Search Knowledgebase'], 'TAILORING': ['View Knowledge Base'], 'CC': ['Search Knowledge Base'],
            'CC PD': ['Search Knowledgebase'], 'HELPDESK GEN':['Search Knowledge'], 'RM HELPDESK':['Search Knowledge']};

var schedulerName = 'KMAttachment';
var schedulerNames = ['KMUpdate', 'KMAttachment'];

var stop_words_to_remove = {en: ['and', 'or','about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 
                  'among', 'an', 'another', 'any', 'anybody', 'anyone', 'anything', 'anywhere', 'are', 'area', 'areas', 'around', 'as', 'ask', 'at', 'away', 'back', 
                  'backed', 'backing', 'backs', 'be', 'because', 'become', 'becomes', 'became', 'been', 'before', 'began', 'behind', 'being', 'beings', 'best', 
                  'better', 'between', 'big', 'both', 'but', 'by', 'came', 'can', 'cannot', 'case', 'cases', 'certain', 'certainly', 'clear', 'clearly', 'come', 
                  'could', 'did', 'differ', 'different', 'differently', 'do', 'does', 'done', 'down', 'downed', 'downing', 'downs', 'during', 'each', 'early', 
                  'either', 'end', 'ended', 'ending', 'ends', 'enough', 'even', 'evenly', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 
                  'face', 'faces', 'fact', 'facts', 'far', 'felt', 'few', 'find', 'finds', 'first', 'for', 'four', 'from', 'full', 'fully', 'further', 'furthered', 
                  'furthering', 'furthers', 'gave', 'general', 'generally', 'get', 'gets', 'give', 'given', 'gives', 'go', 'going', 'good', 'goods', 'got', 'great', 
                  'greater', 'greatest', 'group', 'grouping', 'groups', 'had', 'has', 'have', 'having', 'he', 'her', 'herself', 'here', 'high', 'higher', 'highest', 
                  'him', 'himself', 'his', 'how', 'however', 'if', 'important', 'in', 'interest', 'interested', 'interesting', 'interests', 'into', 'is', 'it', 'its', 
                  'itself', 'just', 'keep', 'keeps', 'kind', 'knew', 'know', 'known', 'knows', 'large', 'largely', 'last', 'later', 'latest', 'least', 'less', 'let', 
                  'lets', 'like', 'likely', 'long', 'longer', 'longest', 'made', 'make', 'making', 'man', 'many', 'me', 'member', 'members', 'men', 'might', 'more', 
                  'most', 'mostly', 'mr', 'mrs', 'much', 'must', 'my', 'myself', 'necessary', 'need', 'needed', 'needing', 'needs', 'never', 'new', 'newer', 'newest', 
                  'next', 'no', 'non', 'not', 'nobody', 'noone', 'nothing', 'now', 'nowhere', 'number', 'numbers', 'of', 'off', 'often', 'old', 'older', 'oldest', 'on', 
                  'once', 'one', 'only', 'open', 'opened', 'opening', 'opens', 'order', 'ordered', 'ordering', 'orders', 'other', 'others', 'our', 'out', 'over', 'part', 
                  'parted', 'parting', 'parts', 'per', 'perhaps', 'place', 'places', 'point', 'pointed', 'pointing', 'points', 'possible', 'present', 'presented', 
                  'presenting', 'presents', 'problem', 'problems', 'put', 'puts', 'quite', 'rather', 'really', 'right', 'room', 'rooms', 'said', 'same', 'saw', 'say', 
                  'says', 'second', 'seconds', 'see', 'sees', 'seem', 'seemed', 'seeming', 'seems', 'several', 'shall', 'she', 'should', 'show', 'showed', 'showing', 
                  'shows', 'side', 'sides', 'since', 'small', 'smaller', 'smallest', 'so', 'some', 'somebody', 'someone', 'something', 'somewhere', 'state', 'states', 
                  'still', 'such', 'sure', 'take', 'taken', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'therefore', 'these', 'they', 'thing', 'things', 
                  'think', 'thinks', 'this', 'those', 'though', 'thought', 'thoughts', 'three', 'through', 'thus', 'to', 'today', 'together', 'too', 'took', 'toward', 
                  'turn', 'turned', 'turning', 'turns', 'two', 'under', 'until', 'up', 'upon', 'us', 'use', 'uses', 'used', 'very', 'want', 'wanted', 'wanting', 'wants', 
                  'was', 'way', 'ways', 'we', 'well', 'wells', 'went', 'were', 'what', 'when', 'where', 'whether', 'which', 'while', 'who', 'whole', 'whose', 'why', 
                  'will', 'with', 'within', 'without', 'work', 'worked', 'working', 'works', 'would', 'year', 'years', 'yet', 'you', 'young', 'younger', 'youngest', 
                  'your', 'yours']};

          
function enableIDOL(idolConfig) {
  removeMenu();
  addScheduleToStartUp();
  removeStopWords();
  upgradeKnowledgeBase();
  setLDAPFields(idolConfig);
  updateDbdict();
  
  print(funcs.scmsg('94', 'idol', []));
}

function enableKnowlegebase() {
  var kmknowledgebase = new SCFile('kmknowledgebase');
  var rc = kmknowledgebase.doSelect('visible=false');
  while (rc === RC_SUCCESS) {
    kmknowledgebase.visible = true;
    kmknowledgebase.doUpdate();
    print(funcs.scmsg('93', 'idol', ['knowledgebase', kmknowledgebase.kbname]));
    rc = kmknowledgebase.getNext();
  }
}


function removeMenu() {
  var obj;
  for (obj in menu_to_remove) {
    var menu = new SCFile('menu');
    var menuNodes = menu_to_remove[obj];
    var rc = menu.doSelect('name="' + obj + '"');
    if (rc === RC_SUCCESS) {
      var description = menu['description'];
      var i;
      for (i = description.length() - 1; i >= 0; i--) {
        if (lib.ArrayUtil.contains(menuNodes, description[i])) {
          menu['description'] = removeElementInArray(menu['description'], i);
          menu['command'] = removeElementInArray(menu['command'], i);
          menu['condition'] = removeElementInArray(menu['condition'], i);
          menu['application'] = removeElementInArray(menu['application'], i);
          menu['pname'] = removeElementInArray(menu['pname'], i);
          menu['pvalue'] = removeElementInArray(menu['pvalue'], i);
          menu['system'] = removeElementInArray(menu['system'], i);
          menu['thread'] = removeElementInArray(menu['thread'], i);
          menu['group'] = removeElementInArray(menu['group'], i);
          menu['icon'] = removeElementInArray(menu['icon'], i);
          menu['option'] = removeElementInArray(menu['option'], i);
        }
      }
      menu.doUpdate();
      print(funcs.scmsg('93', 'idol', ['menu', obj]));
    }
  }
  updateOperatorDefaultESSMenu();
}


function removeElementInArray(scArray, index){
  if (scArray == null || scArray.length() == 0) {
    return scArray;
  }
  var array = new SCDatum();
  array.setType(8);
  var i;
  var length = scArray.length();
  for (i = 0; i < length; i++){
    if (i !== index) {
      array.push(scArray[i]);
    }
  }
  return array;
}


function addScheduleToStartUp(){
  var info = new SCFile('info', SCFILE_READONLY);
  info.doSelect('type = "startup"');

  var i;
  var length = info['process.start.infos'].length();
  for (i = 0; i < length; i++) {
    if (info['process.start.infos'][i]['name'] === schedulerName) {
      return;
    }
  }

  var parameters = new SCDatum();
  parameters.setType(8);
  parameters.push('scheduler');
  parameters.push(schedulerName);
  parameters.push('300');
  parameters.push('1');

  var name = schedulerName;

  var processInfo = new SCDatum();
  processInfo.setType(9);
  processInfo.push(name);
  processInfo.push(parameters);

  info['process.start.infos'].push(processInfo);

  info.doUpdate();
  removeStopSchedule();
  print(funcs.scmsg('101', 'idol', [schedulerName]));
}


function triggerScheduler() {
  var i;
  for (i = 0; i < schedulerNames.length; i++) {
    var tmpSchedulerName = schedulerNames[i];
    //check if the scheduler is already started
    var proc = funcs.processes();
    var started = false;
    var j;
    var length = proc.length();
    for (j = 0; j < length; j++) {
      if (funcs.str(proc[j]).indexOf(tmpSchedulerName) > 0) {
        //print(funcs.str(proc[i]));
        started = true;
        break;
      }
    }

    //start scheduler
    if (!started) {
      
        var rteReturnValue = new SCDatum();
      var argNames = new SCDatum();
      var argVals = new SCDatum();
      argVals.setType(8);     //type array
      argNames.setType(8);    //type array
      var argVal;
        
      argVal = new SCDatum();
      argVal.setType(2); //string                           
      argVal="name";
      argNames.push(argVal);
               
      argVal = new SCDatum();
      argVal.setType(6); //string                           
      argVal = tmpSchedulerName;
      argVals.push(argVal); 
                
        funcs.rtecall("callrad", 
                         rteReturnValue, 
                         "scheduler.start", //RAD app name
                         argNames,
                         argVals,
                         false); //false to run in same thread, true to run in new thread  
      }
    }                               
                                     
}


function removeStopSchedule() {
  var schedule = new SCFile('schedule');
  var rc = schedule.doSelect('name="Stop KMUpdate Process" and class="KMUpdate"');
  if (rc === RC_SUCCESS) {
    schedule.doDelete();
  }
}

function setLDAPFields(idolConfig) {
  var result;
  var scfile = new SCFile('datadict');
  scfile.doSelect('name="operator"');
  var ldapAttrs = scfile['ldapattrname'];
  var i;
  var length = ldapAttrs.length();
  for (i = 0; i < length; i++) {
    var ldapAttr = ldapAttrs[i];
    if (ldapAttr === 'sAMAccountName') {
      result = scfile['fields'][i];
    }
  }
  
  if (result) {
    idolConfig['sp.map.operator.prop'] = result;
    print(funcs.scmsg('105', 'idol', [result]));
  }
}


function removeStopWords() {
  var stopWordsFile = new SCFile('kmstopword');
  var rc = stopWordsFile.doSelect('true');
  while (rc === RC_SUCCESS) {
    var langCode = stopWordsFile['langcode'];
    var removeStopWords = stop_words_to_remove[langCode];
    if (removeStopWords) {
      var stopWordsArr = [];
      var stopWords = funcs.denull(stopWordsFile['stopwords']);
      var i;
      var ilength = stopWords.length();
      for (i = 0; i < ilength; i++) {
        var toRemove = false;
        var j;
        for (j = 0; j < removeStopWords.length; j++) {
          if (removeStopWords[j].toLocaleLowerCase() === stopWords[i].toLocaleLowerCase()) {
            toRemove = true;
          }
        }
        if (!toRemove) {
          stopWordsArr.push(stopWords[i]);
        }
      }
      stopWordsFile['stopwords'] = stopWordsArr;
      stopWordsFile.doUpdate();
    }
    rc = stopWordsFile.getNext();
  }
  print(funcs.scmsg('106', 'idol'));
}


function upgradeKnowledgeBase() {
  var kmbaseTemp = new SCFile('kmknowledgebasetemp');
  var rc = kmbaseTemp.doSelect('true');
  while (rc === RC_SUCCESS) {
    var kbname = kmbaseTemp['kbname'];
    var tablename = kmbaseTemp['sclibtablename'];
    var kmbase = new SCFile('kmknowledgebase');
    var query = 'sclibtablename="' +  tablename + '"';
    if (lib.ProcessDesignerEnablement.isProblemEnabled() && tablename === 'rootcause') {
      query = 'kbname="' + kbname + '"';
    }
    var rc1 = kmbase.doSelect(query);
    if (rc1 !== RC_SUCCESS) {
      copyKmbase(kmbaseTemp, kmbase);
      kmbase.doInsert();
      funcs.msg(funcs.scmsg('111', 'idol', [kmbase['kbname']]), 1);
    }else {
      while (rc1 === RC_SUCCESS) {
        mergeToKmbase(kmbaseTemp, kmbase);
        kmbase.doUpdate();
        funcs.msg(funcs.scmsg('112', 'idol', [kmbase['kbname']]), 1);
        rc1 = kmbase.getNext();
      }
    }
    rc = kmbaseTemp.getNext();
  }
}

var _ = lib.Underscore.require();

function mergeToKmbase(kmbaseTemp, kmbase) {
  var kbfields = kmbase['kbfields'];
  var kbfieldsTemp = kmbaseTemp['kbfields'];
  
  var i;
  var j;
  var ilength;
  var jlength;
  
  ilength = kbfields.length();  
  for (i = 0; i < ilength; i++) {
    var isExist = false;
    jlength = kbfieldsTemp.length();
    for (j = 0; j < jlength; j++) {
      if (kbfields[i]['kbfieldname'] === kbfieldsTemp[j]['kbfieldname']) {
      	if (!_.isNumber(kbfields[i]['weight']))
      	{
      		kbfields[i]['weight'] = kbfieldsTemp[j]['weight'];
        	kbfields[i]['match'] = kbfieldsTemp[j]['match'];
        	kbfields[i]['sort'] = kbfieldsTemp[j]['sort'];
        	kbfields[i]['datacleansing'] = kbfieldsTemp[j]['datacleansing'];
        	kbfields[i]['hitlist'] = kbfieldsTemp[j]['hitlist'];
        	kbfields[i]['kbfieldtype'] = kbfieldsTemp[j]['kbfieldtype'];
        	kbfields[i]['kbfieldvalue'] = kbfieldsTemp[j]['kbfieldvalue'];
      	}
       
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      kbfields[i]['weight'] = 0;
      kbfields[i]['match'] = true;
      kbfields[i]['sort'] = null;
      kbfields[i]['datacleansing'] = false;
    }
  }
  
  //if new fields in kmknowledgebasetemp, add to kmknowledgebase
  ilength = kbfieldsTemp.length();
  for (i = 0; i < ilength; i++) {
    var isNew = true;
    jlength = kbfields.length();
    for (j = 0; j < jlength; j++) {
      if (kbfields[j]['kbfieldname'] === kbfieldsTemp[i]['kbfieldname']) {
        isNew = false;
        break;
      }
    }
    if (isNew) {
      var newkbFields = new SCDatum();
      newkbFields.setType(9);
      newkbFields.push(kbfieldsTemp[i]['kbfieldname']);
      newkbFields.push(kbfieldsTemp[i]['kbfieldvalue']);
      newkbFields.push(kbfieldsTemp[i]['kbfieldtype']);
      newkbFields.push(kbfieldsTemp[i]['hitlist']);
      newkbFields.push(kbfieldsTemp[i]['docbody']);
      newkbFields.push(kbfieldsTemp[i]['weight']);
      newkbFields.push(kbfieldsTemp[i]['match']);
      newkbFields.push(kbfieldsTemp[i]['sort']);
      newkbFields.push(kbfieldsTemp[i]['datacleansing']);
      kbfields.push(newkbFields);
    }
  }
  
  kmbase['indexstatus'] = kmbaseTemp['indexstatus'];
  kmbase['lastindextime'] = kmbaseTemp['lastindextime'];
}


function copyKmbase(kmbaseTemp, kmbase) {
  var xmlRecord = kmbaseTemp.getXML().toXMLString();
  xmlRecord = xmlRecord.replace('kmknowledgebasetemp', 'kmknowledgebase');
  var xml = new XML();
  xml.setContent(xmlRecord);
  kmbase.setRecord(xmlRecord);
}

/*
//remart this function since in some time, below sql is not exactly follow SQL rules, then cause some error in postgresql database.
function updateOperatorDefaultESSMenu() {
  var batchUpdateSql = "update OPERATORM1 set \"ESS_INITIAL_APP\"='0' where \"ESS_INITIAL_APP\"='7'";
  var result=lib.c.$("#dataService").executeSQL(batchUpdateSql);
  print(funcs.scmsg('115', 'idol'));
}
*/

function updateOperatorDefaultESSMenu() {
  var operators = new SCFile('operator');
  var rc = operators.doSelect('ess.initial.app=7');
  while (rc === RC_SUCCESS) {
    //print(operators['name']);
    operators['ess.initial.app'] = 0;
    operators.doUpdate();
    rc = operators.getNext();
  }	
}

function updateDbdict() {
  var dbdict = new SCFile('dbdict');
  var rc = dbdict.doSelect('name="kmknowledgebaseupdates"');
  if (rc === RC_SUCCESS) {
    //update the sql rc of recdata field to true
    dbdict['field'][9][7][3] = true;
    dbdict.doUpdate();
  }
}