function isEnabled() {
    if (!allowForgotPassword()) {
        return false;
    }

    return true;
}

function questionCount() {
    var count = lib.SystemSettings.getNumberValue("system.password.user.question.count");
    if (!count) {
        return 3;
    }

    // Max 6 questions and mininum 1 question
    if (count > 6) count = 6;
    if (count < 1) count = 1;

    return +count;
}

function passwordFailed() {
    funcs.msg(pwdMsg('4'), 2);
}

function checkMySecurityQuestion() {
    let list = [];

    let modifyTime = null;
    lib.c
        .$('!userSecQuestion')
        .fields('questionId', 'sysmodtime')
        .find('username=:name', funcs.operator())
        .each(item => {
            list.push(item.questionId);
            if (!modifyTime) {
                modifyTime = item.sysmodtime;
            }
        });

    vars['$L.my.question.prompt'] = pwdMsg('1', [funcs.str(modifyTime)]) + '\n' + pwdMsg('11');

    list.forEach((item, index) => {
        var name = '$L.my.question.' + index;
        vars[name] = getQuestionTitle(item);
        // print(name, '==', vars[name]);
    });

    return modifyTime != null;
}

function pwdMsg(id, params) {
    return findMsg('pwd.question', id, params);
}

function findMsg(clazz, id, params, defaultValue) {
    if (!params) params = [];

    var title = funcs.scmsg(id, clazz, params);

    if (title == 'Message ' + clazz + '-' + id + ' Could not be found:') {

        if (defaultValue) {
            return defaultValue;
        }

        return null;
    }

    return title;
}

function getQuestionTitle(id, item) {
    if (!id) {
        return '';
    }

    var title = findMsg('secQuestion', id);

    if (null != title) {
        return title;
    }

    if (!item) {
        item = lib.c
            .$('!secQuestion')
            .fields('title')
            .find('id=:id', id)
            .one();
    }

    if (item) {
        return item.title;
    }

    return '';
}

function setupQuestionList() {
    // clear questions of current user

    var isCleared = false;
    lib.c
        .$('!userSecQuestion', true)
        .find('username=:name', funcs.operator())
        .each(item => {
            item.doDelete();
            isCleared = true;
        });
    if (isCleared) {
        addSysLog('cleared');
    }

    var titleList = [];
    var idList = [];
    lib.c
        .$('!secQuestion')
        .fields('id', 'title')
        .find('null(inactive) or inactive=false')
        .each(function(item) {
            titleList.push(getQuestionTitle(item.id, item));
            idList.push(item.id);
        });

    vars.$L_secQuestionListTitle = titleList;
    vars.$L_secQuestionListId = idList;
}

function isNull(value) {
    if (value === null || value === undefined) {
        return true;
    }

    value = value.trim();

    if (value === '') {
        return true;
    }

    return false;
}


function setFocusAnswer(index) {
    setFocus('$L.myAnswer' + index);
}

function setFocusQuestion(index) {
    setFocus('$L.myQuestion' + index);
}


function setFocus(name) {
    funcs.cursor_field_name_set(name);
}

function saveQuestions() {

    var count = questionCount();
    var answerList = [];
    var questionList = [];

    var minSize = lib.SystemSettings.getNumberValue("system.password.user.question.answer.min.length");
    var maxSize = 100;
    if (!minSize) {
        minSize = 1;
    }

    let errorList = [];
    let minList = [];
    let maxList = [];
    let dupliateList = [];
    for (var k = 1; k < count + 1; k++) {
        let question = vars['$L.myQuestion' + k];
        let answer = vars['$L.myAnswer' + k];

        if (isNull(question) || isNull(answer)) {
            errorList.push(k);
        } else {
            answer = answer.trim();

            if (answer.length < minSize) {
                minList.push(k);
            }

            if (answer.length > maxSize) {
                maxList.push(k);
            }
        }

        if (questionList.includes(question)) {
            dupliateList.push(k);
        }

        questionList.push(question);
        answerList.push(answer);
    }

    if (errorList.length > 0) {
        var k = errorList[0];
        if (isNull(vars['$L.myQuestion' + k])) {
            setFocusQuestion(k);
        } else {
            setFocusAnswer(k);
        }

        funcs.msg(pwdMsg('5', ['' + errorList]), 2);
        return false;
    }

    if (dupliateList.length > 0) {
        funcs.msg(pwdMsg('7', ['' + dupliateList]), 2);
        setFocusQuestion(dupliateList[0]);
        return false;
    }

    if (minList.length > 0) {
        setFocusAnswer(minList[0]);
        funcs.msg(pwdMsg('12', [minSize]), 2);
        return false;
    }

    if (maxList.length > 0) {
        setFocusAnswer(maxList[0]);
        funcs.msg(pwdMsg('13', [maxSize]), 2);
        return false;
    }

    //  print(questionList);
    //  return false;
    for (var k = 0; k < count; k++) {
        var item = new SCFile('userSecQuestion');
        item.username = funcs.operator();
        item.questionId = parseInt(questionList[k]);
        // print(item.questionId , questionList[k])
        item.answer = answerList[k];
        // item.questionSeq = k;
        item.doInsert();
    }

    funcs.msg(pwdMsg('6'), 1);

    addSysLog('updated');
    return true;
}

function addSysLog(name) {
    var now = funcs.tod();
    lib.RAD.run('syslog.add', ['name', 'time1', 'times', 'string1'], ['user password questions', now, now, name], [6, 6, 6, 6], []);
}

function isSecurityQuestionUsed(id) {
    var one = lib.c.$('!userSecQuestion').fields('id').find('questionId=:id', id).one();
    return null != one;
}

/**
 * 0, success, if the questions is well answerd.
 * 1, if no question is answered
 * 2, if count of answered question does not match the settings.
 *    the user need to update security questions, because the admin changed the security question count setting.
 */
function checkSecurityQuestion() {
    var item = lib.c.$('!userSecQuestion');
    var count = item.count(item.makeSql('username=:name', funcs.operator()));

    if (count == 0) return 1;
    if (count != questionCount()) return 2;

    return 0;
}


function currentPassword() {
    var one = lib.c.$('!operator').fields('password').find('name=:name', funcs.operator()).one();
    if (one) return one.password;
    return null;
}

/**
 * When user login name is changed, update the security question's name too.
 */
function updateByUserName(oldName, newName) {
    if (oldName == newName) {
        return;
    }

    lib.c.$('!userSecQuestion', true).find("username=:name", oldName).each(item => {
        item.username = newName;
        item.doUpdate();
    });
}

/**
 * When user is deleted, delete the security questions too.
 */
function deleteByUserName(userName) {
    lib.c.$('!userSecQuestion', true).find("username=:name", userName).each(item => {
        item.doDelete();
    });
}