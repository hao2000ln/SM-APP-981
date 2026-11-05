var _ = lib.Underscore.require();
var $ = lib.c.$;
var getLocalizedFieldCaption = lib.tableFunctions.getLocalizedFieldCaption;
var denull = funcs.denull;
var lng = funcs.lng;

//referenced by SurveyTemplateService
function getAvailableFields(fileName) {

    var availableFields = [];

    var file = new SCFile(fileName);
    var dbdict = $(fileName).dbdict();
    var datadict = $('datadict').select('name="' + fileName + '"').uniqueResult();
    //var descriptorMeta = $("#dbdictService").getDescriptorMeta(dbdict["field"]);

    var fields = datadict.fields.toArray();
    var captions = _.map(fields, function(field) {
        return getLocalizedFieldCaption(field, fileName);
    });
    var sysFieldTypes = datadict.sysFieldType;
    var avails = datadict.avail;
    var globalLists = datadict.globallist;

    //get all allowed fields with ruled iterator, can be reordered later
    var dbdictField = dbdict.field;
    var i;
    var length = dbdictField.length();
    for (i = 0; i < length; i++) {
        var name = dbdictField[i].name;
        var level = dbdictField[i].level;
        var type = dbdictField[i].type;
        var datadictIndex = _.indexOf(fields, name);

        if (datadictIndex !== -1 &&
            avails[datadictIndex] &&
            sysFieldTypes[datadictIndex] !== 1 &&
            sysFieldTypes[datadictIndex] !== 4 &&
            allowedType(type) &&
            level === 1) {

            //if field is array, only support number and character
            if (type === $.Array) {
                var subFieldType = funcs.dbdict_helper('field.type', file, name + ',' + name);
                if (subFieldType === $.Character) {
                    availableFields.push({
                        "name": name,
                        "type": type,
                        "caption": captions[datadictIndex],
                        "globalList": globalLists[datadictIndex]
                    });
                }
            } else {
                availableFields.push({
                    "name": name,
                    "type": type,
                    "caption": captions[datadictIndex],
                    "globalList": globalLists[datadictIndex]
                });
            }
        }
    }

    //order by caption
    return _.sortBy(availableFields, 'caption');
}

//private
function allowedType(type) {
    return type === $.Number || type === $.Character || type === $.Logical || type === $.Array;
}

//referenced by SurveyTemplateService
function processAddActions(record, option, availableFields, otherOptions) {
    switch (option.toString()) {
        case '6': //update field type in the wizard
            var field = _.findWhere(availableFields, {
                name: record['dest.field.name']
            });
            if (field) {
                record['dest.field.type'] = ($.scTypeToString(field.type)).toLowerCase();
                record['global.list'] = field.globalList;
            }
            return null;
        case '5': //save record
            if (otherOptions.questionLabel === 'istext') {
                var lang = _.isEmpty(vars.$G_my_language) ? 'en' : vars.$G_my_language;
                record['question.label'] = insertNewMessage(otherOptions.newLabelValue, lang);
            }
            record['dest.file.name'] = 'SurveyInternal';
            record.doSave();
            return record.id;
    }
}

/*
 * Insert a message into the message table.
 */
function insertNewMessage(label, lang) {
    var scmessage = new SCFile("scmessage");
    var sql = "class=\"srcsurvey\"";
    var labelId = 0;
    if (scmessage.doSelect(sql) == RC_SUCCESS) {
        do {
            if (parseInt(scmessage.message_id, 10) > labelId) {
                labelId = parseInt(scmessage.message_id, 10);
            }
        } while (scmessage.getNext() == RC_SUCCESS);
    }
    scmessage["class"] = "srcsurvey";
    scmessage.message = label;
    scmessage.message_id = String(labelId + 1);
    // scmessage.syslanguage = lang;

    var flag = true;
    var add_lang_list = [];
    var langRcd = new SCFile("language", SCFILE_READONLY);
    langRcd.setFields(["unique.id"]);
    var rc = langRcd.doSelect('survey.active=true');

    while (rc == RC_SUCCESS) {
        var langId = langRcd['unique.id'];
        scmessage.syslanguage = langId;

        try {
            var result = scmessage.doInsert();
            if (result == RC_SUCCESS) {
                add_lang_list.push(langId);
            } else {
                flag = false;
                break;
            }
        } catch (ex) {
            flag = false;
            print("Exception when insert message: " + ex);
            break;
        }
        rc = langRcd.getNext();
    }

    if (flag) {
        return scmessage.message_id;
    } else {
        var i;
        for (i = 0; i < add_lang_list.length; i++) {
            var del = new SCFile("scmessage");
            var del_rc = del.doSelect('class="srcsurvey" and message.id=' + scmessage.message_id + ' and syslanguage="' + add_lang_list[i] + '"');
            if (del_rc == RC_SUCCESS) {
                del.doDelete();
            }
        }
    }

    return null;
}

function isRelateSurvey(record) {
    var survey = new SCFile("SurveyInternal", SCFILE_READONLY);
    survey.setFields(["number"]);
    var q = "template.id=\"" + record.id + "\"";
    var rc = survey.doSelect(q);
    if (rc == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}

function isRelateOpenSurvey(record) {
    var survey = new SCFile("SurveyInternal", SCFILE_READONLY);
    survey.setFields(["number"]);
    var q = "template.id=\"" + record.id + "\" and status=\"Open\"";
    var rc = survey.doSelect(q);
    if (rc == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}

/*
 * @description when edit a question, get the label value form question id
 * @param question id
 * @return question label
 */
function getQuestionLabel(questionId) {
    var question = new SCFile("svcSrcSurveyConfig", SCFILE_READONLY);
    question.setFields(["question.label"]);
    var query = "id=\"" + questionId + "\"";
    var rc = question.doSelect(query);
    if (rc == RC_SUCCESS) {
        var scmessage = new SCFile("scmessage", SCFILE_READONLY);
        var q = "class=\"srcsurvey\" and message.id=\"" + question.question_label + "\"";
        var rc2 = scmessage.doSelect(q);
        if (rc2 == RC_SUCCESS) {
            return scmessage.message;
        } else {
            return null;
        }
    }
}


//decide the question is used by other template or not
function isUsedByTemplate(questionId, templateId) {
    var template = new SCFile("SurveyTemplate", SCFILE_READONLY);
    template.setFields(["id"]);
    var questionQuery = "questions=\"" + questionId + "\" and id~=\"" + templateId + "\"";
    var count = template.doCount(questionQuery);
    if (count >= 1) {
        return true;
    } else {
        return false;
    }
}

/*
 * @description when duplicate a question,replace the old question id with the new question id in the template
 * @param {Object} record - The SurveyTemplate record;new question id;old question id
 * @return arr
 */
function replaceQuestions(record, oldQuestionId, newQuestionId) {
    var arr = record.questions;
    var i;
    var length = arr.length();
    for (i = 0; i < length; i++) {
        if (arr[i] == oldQuestionId) {
            arr[i] = newQuestionId;
        }
    }
    return arr;
}

/*
 * @description remove questions from question list
 * @param {Object} record - The SurveyTemplate record;the id of the questions need to be removed
 * @return arr
 */
function removeQuestions(record, questions) {
    var arr = record.questions;
    if (questions != null) {
        var arr2 = questions;
        var i;
        var length = arr2.length();
        for (i = 0; i < length; i++) {
            var n = funcs.index(parseInt(arr2[i], 10), arr);
            arr = funcs._delete(arr, n);
        }
    }
    return arr;
}
/*
 * @description remove questions from question list
 * @param {Object} record - The SurveyTemplate record;the id of the questions need to be removed;move direction(up/down)
 * @return arr
 */
function moveQuestions(record, questions, direction, selectRows) {
    var arr = record.questions;
    var arr2 = questions;
    var i;
    var a;
    var n;
    var canMove;

    switch (direction) {
        case 'up':
            var length = arr2.length();
            for (i = 0; i < length; i++) {
                a = parseInt(arr2[i], 10);
                n = funcs.index(a, arr);
                canMove = lib.dynamicFormGenerator.canUserSelectionsMoveupOrDown(selectRows, arr, 0);
                if (canMove[i]) {
                    arr = funcs._delete(arr, n);
                    arr = funcs.insert(arr, n - 1, 1, a);
                }
            }
            return arr;
        case 'down':
            for (i = arr2.length() - 1; i >= 0; i--) {
                a = parseInt(arr2[i], 10);
                n = funcs.index(a, arr);
                canMove = lib.dynamicFormGenerator.canUserSelectionsMoveupOrDown(selectRows, arr, 1);
                if (canMove[i]) {
                    arr = funcs._delete(arr, n);
                    arr = funcs.insert(arr, n + 1, 1, a);
                }
            }
            return arr;
    }
}

function getUnselectedQuestions(selected, sql) {
    var retArr = [];

    $('svcSrcSurveyConfig', SCFILE_READONLY).setFields(["id"]).select(sql).iterate(function(cfg) {
        if (lib.ArrayUtil.indexOf(selected, parseInt(cfg.id, 10)) < 0) {
            retArr.push(cfg.id);
        }
    });

    return retArr;
}

function getFieldsCaptions(usedFields) {
    var availableFields = getAvailableFields("SurveyInternal");

    vars.$fieldList = [];
    vars.$fieldCaptionList = [];
    vars.$sqlFildList = [];

    _.each(availableFields, function(field) {
        if (!_.contains(usedFields, field.name)) {
            vars.$fieldList.push(field.name);
            vars.$fieldCaptionList.push(field.caption);
            vars.$sqlFildList.push("\"" + field.name + "\"");
        }
    });
}

//judge if selected questions have same field Name
function HasSameField(questions) {
    var flds = [];
    var sql = "id isin {" + questions.join(',') + "}";

    $('svcSrcSurveyConfig', SCFILE_READONLY).setFields(["dest.field.name"]).select(sql).iterate(function(cfg) {
        flds.push(cfg['dest.field.name']);
    });

    var o = {};
    var i;
    for (i = 0; i < flds.length; i++) {
        if (!o[flds[i]]) {
            o[flds[i]] = true;
        } else {
            return true;
        }
    }
    return false;
}

/**
 * Set default survey Template
 * System auto set one survey template by default which is satisfied the condition in single survey
 */
function getDefaultTemplate4SingleSurvey(file, backGround) {
    var fileName = funcs.filename(file);
    //var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fileName);
    //var UniqueKey = funcs.str(UniqueKeyObj[0]);

    var devtype = new SCFile("devtype", SCFILE_READONLY);
    devtype.setFields(["device.name"]);
    var rc = devtype.doSelect("joindef=\"" + fileName + "\"");
    if (rc == RC_SUCCESS) {
        fileName = "device";
    }

    //First find template with the same module
    var query1 = 'current.phase="published" and module="' + fileName + '"';
    var template = new SCFile("SurveyTemplate");
    rc = template.doSelect(query1);

    while (rc == RC_SUCCESS) {
        var flag = false;
        flag = checkSurvey(template);

        if (flag) {
            return template.id;
        }

        rc = template.getNext();
    }

    //If not found from above, then find template with module empty
    var query2 = 'current.phase="published" and module=NULL';
    var template2 = new SCFile("SurveyTemplate", SCFILE_READONLY);
    template2.setFields(["id"]);
    if (template2.doSelect(query2) == RC_SUCCESS) {
        return template2.id;
    }

    if (!!backGround) {
        //if not found from above, then find tenplate from Survey settings
        var templateName = lib.settings.getSettingValue("Survey", "defaultTemplateName");
        var query3 = 'name="' + templateName + '" and current.phase="published" and (module="' + fileName + '" or module=NULL)';
        var template3 = $('SurveyTemplate', SCFILE_READONLY).setFields(["id"]).select(query3).uniqueResult();

        if (template3 != null) {
            return template3.id;
        }
    }

    return;
}


/**
 * Set default survey Template
 * System auto set one survey template by default in schedule survey sending page
 */
function getDefaultTemplate4SurveySchedule(fileName) {
    //var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fileName);
    //var UniqueKey = funcs.str(UniqueKeyObj[0]);

    //First find template with the same module
    var query1 = 'current.phase="published" and module="' + fileName + '"';
    var template = new SCFile("SurveyTemplate", SCFILE_READONLY);
    template.setFields(["id"]);
    if (template.doSelect(query1) == RC_SUCCESS) {
        return template.id;
    }

    //If not found from above, then find template with empty module
    var query2 = 'current.phase="published" and module=NULL';
    var template2 = new SCFile("SurveyTemplate", SCFILE_READONLY);
    template2.setFields(["id"]);
    if (template2.doSelect(query2) == RC_SUCCESS) {
        return template2.id;
    }

    return;
}


/**
 *
 * Send Survey to users
 */
function sendSurvey(file, userList, file_tag) {
    var survey_users = denull(userList);
    var users_number = lng(survey_users);

    var j;
    for (j = 0; j < users_number; j++) {
        lib.Survey_Internal.genSurveyInternalURL(survey_users[j], file);
        var surveyRcd = lib.Survey_Internal.findRecordSurvey(survey_users[j], file);
        callrad("us.notify", ["name", "record", "names"], ["Send Survey", surveyRcd, [survey_users[j], file_tag]]);
    }
}

/**
 *
 * Check survey
 */
function checkSurvey(template) {
    var flag = false;

    if (template != null) {
        if (template.module == null || template.module == "") {
            return true;
        }

        var condition = template.condition;
        condition = $.trim(condition);

        if (condition != null && condition != "") {
            var conditionXML = template.conditionXML;
            if (conditionXML != null && conditionXML != "") {
                if (conditionXML.indexOf("\"crosstablefield\"") >= 0 || conditionXML.indexOf("\"useroption\"") >= 0) {
                    lib.Workflow.initVarForCondition(conditionXML);
                }
            }

            flag = funcs.evaluate(funcs.nullsub(funcs.parse(funcs.str(condition), 2), "false"));
            if (flag == "true" || flag == true) {
                flag = true;
            } else {
                flag = false;
            }

        } else {
            flag = true;
        }
    }

    return flag;
}

/*
 * @description Snapshot the question definitions of template to surveyinternal template.questions field.
 * @param {String} templateId - The id of SurveyTemplate
 * @return {String} the generated xml respresentation of template questions
 */
function snapshotQuestions(templateId) {
    var template = $('SurveyTemplate', SCFILE_READONLY).select('id="' + templateId + '"').uniqueResult();
    var questionXML = '';
    if (template) {
        //check if this record has question defined
        if (funcs.lng(funcs.denull(template.questions)) === 0) {
            return null;
        }
        //get qestions from svcSrcSurveyConfig file in one query, better performance.
        var questionIds = template.questions.toArray();
        _.each(questionIds, function(qId) {
            var question = $('svcSrcSurveyConfig', SCFILE_READONLY).select('id=' + qId).uniqueResult();
            if (question) {
                // clear sysmod fields value
                question.sysmodtime = null;
                question.sysmoduser = null;
                question.sysmodcount = null;

                questionXML += question.getXML().toXMLString();
            }
        });
    }

    return '<questions>' + questionXML + '</questions>';
}

/*
 * @description restore question definitions in memorey from snapshot of surveyinternal template.questions field.
 * @param {String} xmlString - the raw xmlString respresnting each quetion record.
 * @param {Boolean} initQuestionVars - flag to generate question thread variables, similar with SurveyTemplateService.initQuestionInfo().
 * @return {Array} array of restored question records.
 */
function restoreQuestionsFromXML(xmlString, initQuestionVars) {
    var allQuestions = [];
    if (_.isEmpty(xmlString)) {
        return allQuestions;
    }
    var xmlObj = new XML();
    xmlObj.setContent(xmlString);
    var element = xmlObj.getFirstChildElement();
    while (element !== null) {
        var config = new SCFile('svcSrcSurveyConfig');
        config.setRecord(element.toXMLString());
        allQuestions.push(config);
        element = element.getNextSiblingElement();
    }

    if (initQuestionVars) {
        //initialize info variables
        vars.$surveyFieldNames = [];
        vars.$surveyFieldTypes = [];
        vars.$surveyQuestionLabels = [];
        vars.$surveyAnswerTypes = [];
        vars.$surveyGlobalLists = [];
        vars.$surveyImageLists = [];
        vars.$surveyLayouts = [];
        vars.$surveyAllowCustomAnswers = [];
        vars.$surveyMandatories = [];
        vars.$surveyQuestionIds = [];

        _.each(allQuestions, function(question) {

            var label = '';
            label = funcs.scmsg(question['question.label'], "srcsurvey", []);

            (vars.$surveyFieldNames).push(question['dest.field.name']);
            (vars.$surveyQuestionLabels).push(label);
            (vars.$surveyFieldTypes).push(question['dest.field.type']);
            (vars.$surveyQuestionIds).push(question['id']);
            (vars.$surveyAnswerTypes).push(question['answer.type']);
            (vars.$surveyGlobalLists).push(question['global.list']);
            (vars.$surveyImageLists).push(question['image.list']);
            (vars.$surveyLayouts).push(question['layout']);
            (vars.$surveyAllowCustomAnswers).push(question['custom.answer.allowed']);
            (vars.$surveyMandatories).push(question['mandatory.condition']);
        });
    }

    return allQuestions;
}


/**
 * get localized introduction message
 *
 * @param {SCFile} SurveyTemplate record
 * @param {String} language
 * @returns {String} introduction message
 */
function getIntroductionMessage(template, language) {

    var msgClass = "local:SurveyTemplate";
    var msgId = template.id + ";introduction";
    var queryDefault = 'class="' + msgClass + '" and message.id="' + msgId + '"';
    var query = queryDefault + ' and syslanguage="' + (language != null ? language : "en") + '"';

    var msg = $("scmessage", SCFILE_READONLY).select(query).uniqueResult();
    if (msg != null) {
        return msg.message;
    }

    // default introduction
    var sIntroduction = "";
    var introduction = template.introduction;
    var i;
    var length = introduction.length();
    for (i = 0; i < length; i++) {
        if (i > 0) {
            sIntroduction += '\n';
        }
        if (introduction[i]) {
            sIntroduction += introduction[i];
        }
    }

    return sIntroduction;
}


/**
 * update introdunction scmessage
 *
 * @param {String} template id
 * @param {String} language
 * @param {String} introduction
 */
function updateIntroductionMessage(templateId, language, introduction) {
    var msgClass = "local:SurveyTemplate";
    var msgId = templateId + ";introduction";
    var query = 'class="' + msgClass + '" and message.id="' + msgId + '" and syslanguage="' + language + '"';
    var msg = $("scmessage").select(query).uniqueResult();

    // update scmessage
    if (msg) {
        msg.message = introduction;
        msg.doUpdate();
    }
    // create new scmessage
    else {
        msg = new SCFile("scmessage");
        msg.syslanguage = language;
        msg._class = msgClass;
        msg.message_id = msgId;
        msg.message = introduction;
        msg.doInsert();
    }
}


/**
 * delete all introduction messages
 *
 * @param {String} template id
 */
function deleteIntroductionMessage(templateId) {

    var msgClass = "local:SurveyTemplate";
    var msgId = templateId + ";introduction";
    var query = 'syslanguage~="xxx" and class="' + msgClass + '" and message.id="' + msgId + '"';

    $("scmessage").select(query).iterate(function(msg) {
        msg.doDelete();
    });
}