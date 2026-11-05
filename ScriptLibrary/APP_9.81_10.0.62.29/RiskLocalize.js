
var _e = lib.StringUtil.escapeAllStr;

function initWizardLangList() {
    var langValueList = [];
    var langDispList = [];

    var curLang = vars['$G.my.language'];

    lib.c.$('language', SCFILE_READONLY).setFields(['unique.id', 'language']).select('active=true').iterate(function (item) {
        if (item['unique.id'] == curLang) {
            vars.$fromLangDisplay = item['language'];
            vars.$fromLangValue = item['unique.id'];
        }

        langValueList.push(item['unique.id']);
        langDispList.push(item['language']);
    });

    vars['$to.lang'] = langValueList[0];

    vars.$langValueList = langValueList;
    vars.$langDispList = langDispList;
}

function makeFactorClazz(id) {
    return 'riskfactor_' + id;
}

function initWizardFactorPage() {
    var fromLang = vars['$G.my.language'];
    var toLang = vars['$to.lang'];

    var langValueList = vars.$langValueList.toArray();
    var langDispList = vars.$langDispList.toArray();

    var index = lib.ArrayUtil.indexOf(langValueList, toLang);

    vars.$toLangValue = toLang;
    vars.$toLangDisplay = langDispList[index];

    var id = vars['$L.file'].id;
    var clazz = makeFactorClazz(id);

    // init titles  
    vars.$fromRiskTitle = vars['$L.file'].title;
    vars.$toRiskTitle = findMsg(clazz, 'title', toLang);

    // init factor answers
    var answerLength = funcs.denull(vars.$L_file.answer).length();

    var fromAnswerList = [];
    var toAnswerList = [];

      var k;
    for (k = 0; k < answerLength; k++) {
        // fromAnswerList.push(findMsg(clazz, 'answer_' + k, fromLang, vars.$L_file.answer[k].label));
        fromAnswerList.push(vars.$L_file.answer[k].label);
        toAnswerList.push(findMsg(clazz, 'answer_' + k, toLang));
    }

    vars.$fromRiskAnswer = fromAnswerList;
    vars.$toRiskAnswer = toAnswerList;
}

function findMsg(clazz, number, lang, defaultValue) {

    var sql = 'class="' + _e(clazz) + '" and message.id="' + _e(number) + '" and syslanguage="' + _e(lang) + '"';
    var msg = lib.c.$('scmessage', SCFILE_READONLY).setFields('message').select(sql).uniqueResult();

    if (!msg) {
        return defaultValue;
    }

    return msg['message'];
}

function localizeFactor(factor, lang) {
    var id = factor.id;
    var title = factor.title;
    var answerList = [];

    var k, answerLength = funcs.denull(factor.answer).length();
    for (k = 0; k < answerLength; k++) {
        answerList.push(factor.answer[k].label);
    }

    saveFactorLocalize(lang, id, title, answerList);
}

function saveFactorLocalize(lang, id, title, answerList, maxSize) {
    var clazz = makeFactorClazz(id);
    saveMsg(clazz, 'title', lang, title);
    
    var list = ['title'];
    var k = 0;
    for (k = 0; k < answerList.length; k++) {
        var number = 'answer_' + k;
        list.push(number);
        saveMsg(clazz, number, lang, answerList[k]);
    }
    
    deleteOtherMessages(clazz, lang, list);
}


function deleteOtherMessages(clazz, lang, msgList){
    vars.$L_tempMsgNumList = msgList; 
    var sql = 'syslanguage="'+_e(lang)+'" and class="' + _e(clazz) + '" and not message.id isin $L.tempMsgNumList';
    lib.c.$('scmessage').select(sql).iterate(function(item){
        if(/^answer_\d+/.test(item['message.id'])){
            item.doDelete();
        }        
    });
    vars.$L_tempMsgNumList = null;
}

function deleteMsg(clazz, number, lang) {
    var sql = 'syslanguage="'+_e(lang)+'" and class="' + _e(clazz) + '" and message.id="' + _e(number) + '"';
    var file = new SCFile('scmessage');
    if (RC_SUCCESS == file.doSelect(sql)) {
        file.doDelete();
        return true;
    }
    return false;
}

function saveMsg(clazz, number, lang, text) {
    if(!text) {
        deleteMsg(clazz, number, lang);
        return;
    }
    var sql = 'syslanguage="' + _e(lang) + '" and class="' + _e(clazz) + '" and message.id="' + _e(number) + '"';
    var file = new SCFile('scmessage');
    if (RC_SUCCESS == file.doSelect(sql)) {
        if (file.message != text) {
            file.message = text;
            file.doUpdate();
        }
    } else {
        insertMsg(clazz, number, lang, text);
    }
}

function insertMsg(clazz, number, lang, text) {
    var file = new SCFile('scmessage');
    file.syslanguage = lang;
    file._class = clazz;
    file.message = text;
    file.message_id = number;
    file.doInsert();
}


function getFactorTitleById(id, title) {
    var clazz = makeFactorClazz(id);
    return _getMsg(clazz, 'title', title);
}

function getFactorTitle(factor) {
    return getFactorTitleById(factor.id, factor.title);
}

function getFactorAnswerLabel(factorId, answerIndex, defaultValue) {
    var clazz = makeFactorClazz(factorId);
    return _getMsg(clazz, 'answer_' + answerIndex, defaultValue);
}

function _getMsg(clazz, number, defaultValue) {
    var sql = 'syslanguage="' + vars['$G.my.language'] + '" and class="' + _e(clazz) + '" and message.id="' + _e(number) + '"';
    var file = new SCFile('scmessage');
    if (RC_SUCCESS == file.doSelect(sql)) {
        return file.message;
    }

    return defaultValue;
}

function deleteFactorMsgById(id){
	var clazz = makeFactorClazz(id);
	var sql = 'syslanguage like "*" and class="' + _e(clazz) + '"';
    var file = new SCFile('scmessage');
    
    lib.c.$('scmessage').select(sql).iterate(function(item){
    	item.doDelete();
    });
}