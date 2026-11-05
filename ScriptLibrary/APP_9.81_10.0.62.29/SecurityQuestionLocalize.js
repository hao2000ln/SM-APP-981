function getActiveLanguageList() {
  var list = [];
  lib.c
    .$('!language')
    .fields('unique.id', 'language')
    .sortBy('language')
    .find('active=true')
    .each(function(item) {
      list.push({ id: item['unique.id'], name: item['language'] });
    });
  return list;
}

function makeVarNameByLang(lang) {
  var lang2 = lang.replace(/\-/g, '.');
  return '$title.' + lang2;
}

function setup() {
  vars.$title = vars['$L.file'].title;

  getActiveLanguageList().forEach(item => {
    vars[makeVarNameByLang(item.id)] = findMessage(item.id, vars['$L.file'].id);
  });
}

function findMsg(clazz, id, defaultValue){
    
}

function findMessage(lang, id) {
  var one = lib.c
    .$('!scmessage')
    .fields('message')
    .find('syslanguage=:lang and class="secQuestion" and message.id=:id', lang, id)
    .one();
  if (one) {
    return one.message;
  }

  return '';
}

function doSave() {
  var id = vars['$L.file'].id;
  getActiveLanguageList().forEach(lang => {
    doSaveMessage(lang.id, id);
  });
  
  print(funcs.scmsg('9', "pwd.question"));
}

function doSaveMessage(lang, id) {
  var one = lib.c
    .$('!scmessage', true)
    .find('syslanguage=:lang and class="secQuestion" and message.id=:id', lang, id)
    .one();

  var varName = makeVarNameByLang(lang);
  var varValue = vars[varName];

  if (null == one) {
    if (varValue) {
      var item = new SCFile('scmessage');
      item.syslanguage = lang;
      item['class'] = 'secQuestion';
      item.message_id = id;
      item.message = varValue;
      item.doInsert();
    }
  } else {
    if (varValue) {
      one.message = varValue;
      one.doUpdate();
    } else {
      one.doDelete();
    }
  }
}

function buildLocalizeForm() {
  var titleMsg = lib.SecurityQuestion.findMsg('sccaption', 'Title');
  if(null==titleMsg) {
    titleMsg = 'Title';
  }
  
  var settings = {
    name: 'secQuestion.localize',
    title: funcs.scmsg('title', "secQuestionLocalize"), //'Security Question Localize',
    fields: [
      { type: 'glue', height: 1 },
      { type: 'input', height: 1, name: '$title', title: titleMsg, readonly: true }
    ],

    layout: {
      fullWidth: 145,
      labelWidth: 15,
      inputX: 15
    }
  };

  getActiveLanguageList().forEach(item => {
    settings.fields.push({ type: 'glue', height: 1 });
    settings.fields.push({ type: 'input', height: 1, name: makeVarNameByLang(item.id), title: item.name });
  });

  return lib.DynamicFormBuilder.buildForm(settings);
}


function deleteLocalizeById(id){
    var one = lib.c.$('!scmessage', true).find('syslanguage#"*" and class="secQuestion" and message.id=:id', id).each(function(item){
        item.doDelete();
    });
}
