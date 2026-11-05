var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var log = lib.ScAPI_Logger.log("ScAPI_Survey");
var $ = lib.c.$;
var _ = lib.Underscore.require();
var scmsg = funcs.scmsg;


// Title and Description configuration for different table
// However CI related are not here because of CI use join tables which can not enumerates.
var title_field_map = {
    "cm3r": "brief.description",
    "incidents": "title",
    "rootcause": "brief.description",
    "probsummary": "brief.description",
    "request": "brief.description",
    "ocmq": "brief.description"
};

var description_field_map = {
    "cm3r": "description",
    "incidents": "description",
    "rootcause": "root.cause",
    "probsummary": "action",
    "request": "description",
    "ocmq": "description"
};

function getSurveyInbox() {
    setExitType(NORMAL_EXIT);
    var status = vars.$L_file['status'];
    var operator = getCurrentOperator();
    var query = "contact.name=\"" + operator['contact.name'] + "\"";
    if (status) {
        query += " and status=\"" + status + "\"";
    }
    var fields = ['number', 'file.name', 'field.name', 'reference.number', 'open.time', 'close.time', 'status'];

    var keyword = vars.$L_file['keyword'];
    if (keyword) {
        query += " and reference.number # \"" + lib.StringUtil.escapeAllStr(keyword) + "\"";
    }

    var orderBys = ['open.time'];
    var orderBysSeq = [SCFILE_DSC];
    if (vars.$L_file['desc.by.open.time'] != null && vars.$L_file['desc.by.open.time'] == false) {
        orderBysSeq = [SCFILE_ASC];
    }

    var pageSize = vars.$L_file['pageSize'] == null ? 10 : vars.$L_file['pageSize'];
    vars.$L_file['pageSize'] = pageSize;
    var start = vars.$L_file['start'] == null ? 1 : vars.$L_file['start'];
    if (start < 1) {
        start = 1;
    }
    vars.$L_file['start'] = start;
    var survey = select("SurveyInternal", query, fields, orderBys, orderBysSeq);
    var recordCount = lib.ScAPI_RAD._count("SurveyInternal", query);
    vars.$L_file['_count'] = recordCount;
    if (survey == null) {
        setExitType(NO_RECORD_EXIT);
        return;
    }
    var i = 0;
    var count = 0;
    var titleMap = {};
    var records;

    for (count = 0; count < (start - 1); count++) {
        var rc = survey.getNext();
    }

    do {
        vars.$L_file['surveys'][i]['number'] = survey['number'];
        vars.$L_file['surveys'][i]['open.time'] = survey['open.time'];
        vars.$L_file['surveys'][i]['close.time'] = survey['close.time'];
        vars.$L_file['surveys'][i]['survey.status'] = survey['status'];
        vars.$L_file['surveys'][i]['reference.number'] = survey['reference.number'];
        vars.$L_file['surveys'][i]['file.name'] = survey['file.name'];

        if (!titleMap[survey['file.name']]) {
            titleMap[survey['file.name']] = {
                'field.name': survey['field.name'],
                'records': {}
            };
        }
        records = titleMap[survey['file.name']]['records'];
        records[funcs.str(survey['number'])] = {
            'reference.number': survey['reference.number']
        };

        count++;
        i++;
        if (count >= (start + pageSize - 1)) {
            break;
        }
        var result = survey.getNext();
    } while (result == RC_SUCCESS);

    var titleMap2 = {};

    var fileName;
    for (fileName in titleMap) {
        if (titleMap.hasOwnProperty(fileName)) {
            var fieldName = titleMap[fileName]['field.name'];
            records = titleMap[fileName]['records'];
            var ids = [];
            var id;
            for (id in records) {
                if (records.hasOwnProperty(id)) {
                    ids[ids.length] = records[id]['reference.number'];
                }
            }
            var referMap = getReferencedRecordInBatch(fileName, fieldName, ids);
            for (id in records) {
                if (records.hasOwnProperty(id)) {
                    try {
                        titleMap2[id] = {};
                        titleMap2[id]['title'] = referMap[titleMap[fileName]['records'][id]['reference.number']]['title'];
                        titleMap2[id]['description'] = referMap[titleMap[fileName]['records'][id]['reference.number']]['description'];
                    } catch (e) {
                        log.error(e);
                        titleMap2[id] = {};
                    }
                }
            }
        }
    }

    var surveyList = $.createSCArray();
    var length = funcs.lng(vars.$L_file['surveys']);
    for (i = 0; i < length; i++) {
        var number = vars.$L_file['surveys'][i]['number'];
        if (_.isEmpty(titleMap2[funcs.str(number)])) {
            continue;
        }
        vars.$L_file['surveys'][i]['title'] = titleMap2[funcs.str(number)]['title'];
        vars.$L_file['surveys'][i]['description'] = titleMap2[number]['description'];
        surveyList.push(vars.$L_file['surveys'][i]);
    }
    vars.$L_file['surveys'] = surveyList;
}

function getSurveyStatistic() {
    setExitType(NORMAL_EXIT);
    var openCount = getSurveyCount("Open");
    var closedCount = getSurveyCount("Closed");
    vars.$L_file['open.count'] = openCount;
    vars.$L_file['closed.count'] = closedCount;
}

function getSurveyCount(status) {
    var operator = getCurrentOperator();
    var query = "contact.name=\"" + operator['contact.name'] + "\" and status=\"" + status + "\"";
    var recordCount = lib.ScAPI_RAD._count("SurveyInternal", query);
    return recordCount;
}

//To get 'title' and 'description' for list.
function getReferencedRecordInBatch(referFileName, referFieldName, ids) {
    var query = referFieldName + " isin " + funcs.str(ids);

    var titleField = title_field_map[referFileName];

    if (!titleField && lib.DisplayName.hasDisplayName(referFileName)) {
        titleField = lib.DisplayName.getDisplayLable(referFileName);
    }

    var descriptionField = funcs.nullsub(description_field_map[referFileName], "comments");

    var fields = [referFieldName, descriptionField];
    if (titleField) {
        fields[fields.length] = titleField;
    }

    var record = select(referFileName, query, fields);

    var retMap = {};

    if (record != null) {
        do {
            var ret = {
                "description": convertDescription(record[descriptionField])
            };
            if (titleField) {
                ret['title'] = record[titleField];
            }

            retMap[record[referFieldName]] = ret;
            var rc = record.getNext();
        } while (rc == RC_SUCCESS);

    }
    return retMap;
}

/*
 * @public
 * @description get survey record, wrapped in svcSrcSurvey.
 * @param {Object} inRecord - The surveyinternal record
 * @return svcSrcSurvey
 */
function getSurveyRecord(inRecord) {

    var record;
    var survey;
    //check argument:
    //if inRecord is SurveyInternal, initialize a new svcSrcSurvey record
    //if no inRecord, then this function is called from ws
    if (inRecord && funcs.filename(inRecord) === 'SurveyInternal') {
        record = new SCFile('svcSrcSurvey');
        record['number'] = inRecord['number'];
        survey = inRecord;
    } else {
        record = vars.$L_file;
        setExitType(NORMAL_EXIT);
        var number = record['number'];
        var query = "number=" + number;
        var operator = getCurrentOperator();
        query += " and contact.name=\"" + operator['contact.name'] + "\"";
        survey = $('SurveyInternal', SCFILE_READONLY).select(query).uniqueResult();
        if (survey == null) {
            setExitType(NO_RECORD_EXIT);
            return;
        }
    }

    // introduction
    if (survey.template_id) {
        var stemplate = $('SurveyTemplate', SCFILE_READONLY).setFields(["introduction"]).select('id="' + survey.template_id + '"').uniqueResult();
        if (stemplate) {
            var introduction = lib.SurveyTemplateHelpers.getIntroductionMessage(stemplate, vars.$G_my_language);
            if (introduction) {
                record['introduction'] = introduction.split('\n');
            }
        }
    }

    record['contact.name'] = survey['contact.name'];
    record['status'] = survey['status'];
    record['open.time'] = survey['open.time'];

    var referFileName = survey['file.name'];
    var referFieldName = survey['field.name'];
    var referId = survey['reference.number'];

    var referRecord = getReferencedRecord(referFileName, referFieldName, referId);

    record['reference.number'] = referId;

    if (referRecord != null) {
        record['title'] = referRecord['title'];
        record['description'] = referRecord['description'];
    }

    var supportId = survey['support.id'];
    if (supportId) {
        var ticket = getSupportTicket(supportId);
        if (ticket) {
            record['support.id'] = supportId;
            record['callback.support'] = ticket['category'];
        }
    }

    //get template.questions
    //here we need to consider a default template, in case of the older survey data
    //first we check if the survey has question snapshot
    if (!_.isEmpty(survey['template.questions'])) {
        lib.SurveyTemplateHelpers.restoreQuestionsFromXML(survey['template.questions'], true);
    } else {
        var templateName = lib.settings.getSettingValue("Survey", "defaultTemplateName");
        var templateQuery = survey['template.id'] ? 'id="' + survey['template.id'] + '"' : 'name="' + templateName + '"';
        var template = $('SurveyTemplate', SCFILE_READONLY).select(templateQuery).uniqueResult();
        if (!template || funcs.lng(funcs.denull(template.questions)) < 1) {
            setExitType(NO_RECORD_EXIT);
            return;
        }

        //populate question info variables, leverage the SurveyTemplateService via thread variables
        $('#SurveyTemplateService').initQuestionInfo(template);
    }

    //populate response carrier
    var surveyFieldNames = vars.$surveyFieldNames.toArray();
    var surveyQuestionLabels = vars.$surveyQuestionLabels.toArray();
    var surveyFieldTypes = vars.$surveyFieldTypes.toArray();
    var surveyQuestionIds = vars.$surveyQuestionIds.toArray();
    var surveyAnswerTypes = vars.$surveyAnswerTypes.toArray();
    var surveyGlobalLists = vars.$surveyGlobalLists.toArray();
    var surveyImageLists = vars.$surveyImageLists.toArray();
    var surveyLayouts = vars.$surveyLayouts.toArray();
    var surveyAllowCustomAnswers = vars.$surveyAllowCustomAnswers.toArray();
    var surveyMandatories = vars.$surveyMandatories.toArray();

    var dbdict = lib.ScAPI_GetOptionsLookup.getDBDICT("SurveyInternal");

    //traverse the question info lists, fill the carrier
    _.each(surveyFieldNames, function(fieldName, index) {
        record['questions'][index]['dest.field.name'] = fieldName;
        record['questions'][index]['question.label'] = surveyQuestionLabels[index];
        record['questions'][index]['answer.type'] = surveyAnswerTypes[index];
        record['questions'][index]['global.list'] = surveyGlobalLists[index];
        record['questions'][index]['image.list'] = surveyImageLists[index] != null ? Number(surveyImageLists[index]) : null;
        record['questions'][index]['layout'] = surveyLayouts[index];
        record['questions'][index]['custom.answer.allowed'] = surveyAllowCustomAnswers[index] === 'true';
        record['questions'][index]['mandatory.condition'] = surveyMandatories[index];
        record['questions'][index]['dest.field.type'] = getFiedType(dbdict, fieldName);

        //get value
        var value = survey[fieldName];
        switch (surveyFieldTypes[index]) {
            case 'array': //template only supports array of primary.
                var subType = funcs.dbdict_helper('field.type', survey, fieldName + ',' + fieldName);
                //process datetime subtype
                if (funcs.lng(funcs.denull(value)) > 0) {
                    if ($.Datetime === subType) {
                        value = _.reduce(value.toArray(), function(memo, item) {
                            if (!memo) {
                                memo = '';
                            }
                            return (!item) ? memo : memo + '\n' + lib.tzFunctions.convertDatetoString(item, 6, "Greenwich/Universal");
                        });
                    } else {
                        value = value.join("\n");
                    }
                } else {
                    value = null;
                }
                break;
            case 'logical':
                value = funcs.val(value, 2);
                break;
            case 'datetime':
                value = (!value) ? value : lib.tzFunctions.convertDatetoString(value, 6, "Greenwich/Universal");
                break;
        }
        record['questions'][index]['value'] = value;
    });

    return record;
}

function getFiedType(dbdict, key) {
    var type;
    var j;
    var length = dbdict.field.length();
    for (j = 0; j < length; j++) {
        if (dbdict.field[j].name == key) {
            var fieldType = dbdict.field[j].type;
            if (fieldType == lib.DataTypeConst.typeCharacter()) {
                type = "character";
                break;
            } else if (fieldType == lib.DataTypeConst.typeDateTime()) {
                type = "datetime";
                break;
            } else if (fieldType == lib.DataTypeConst.typeNumber()) {
                type = "number";
                break;
            } else if (fieldType == lib.DataTypeConst.typeBoolean()) {
                type = "logical";
                break;
            } else if (fieldType == lib.DataTypeConst.typeArray()) {
                type = "character";
                var subType = dbdict.field[j + 1].type;
                if (subType == lib.DataTypeConst.typeNumber()) {
                    type = "number";
                } else if (subType == lib.DataTypeConst.typeCharacter()) {
                    type = "character";
                } else if (subType == lib.DataTypeConst.typeDateTime()) {
                    type = "datetime";
                } else if (subType == lib.DataTypeConst.typeBoolean()) {
                    type = "logical";
                }
                break;
            }
        }
    }

    return type;
}

function getSupportTicket(supportId) {
    var query = "incident.id=\"" + supportId + "\"";
    var fields = ['category'];
    var ticket = select("incidents", query, fields);
    if (ticket) {
        return {
            "category": ticket['category']
        };
    }
}

function getReferencedRecord(referFileName, referFieldName, id) {
    var query = referFieldName + "=\"" + id + "\"";

    var titleField = title_field_map[referFileName];

    if (!titleField && lib.DisplayName.hasDisplayName(referFileName)) {
        titleField = lib.DisplayName.getDisplayLable(referFileName);
    }

    var descriptionField = funcs.nullsub(description_field_map[referFileName], "comments");


    var fields = [referFieldName, descriptionField];
    if (titleField) {
        fields[fields.length] = titleField;
    }

    var record = select(referFileName, query, fields);
    if (record != null) {
        var ret = {
            "description": convertDescription(record[descriptionField])
        };
        if (titleField) {
            ret['title'] = record[titleField];
        }

        return ret;
    }
    return null;
}

function convertDescription(description) {
    var ret;
    if (description) {
        var dataType = funcs.type(description);
        if (lib.DataTypeConst.typeArray() == dataType) {
            ret = description.join("\n");
        } else {
            ret = description;
        }
    }
    return ret;
}

/**
 * We don't support multi-company for survey.
 */
function getSurveyConfigurationQuery() {
    //var company = operator['company'];
    //var query = "company=\"" + company + "\"";
    var query = "true";
    return query;
}

function getSurveyConfiguration() {
    var operator = getCurrentOperator();
    var query = getSurveyConfigurationQuery();
    var fields = ['dest.field.name', 'question.label', 'answer.type', 'global.list', 'custom.answer.allowed', 'mandatory.condition'];
    var orderByField = ['order'];
    var orderBySeq = ['asc'];
    var config = select("svcSrcSurveyConfig", query, fields, orderByField, orderBySeq);
    var surveyFields = [];
    if (config) {
        do {
            var fieldName = config['dest.field.name'];
            surveyFields[fieldName] = {
                'question.label': config['question.label'],
                'answer.type': config['answer.type'],
                'global.list': config['global.list'],
                'custom.answer.allowed': config['custom.answer.allowed'],
                'mandatory.condition': config['mandatory.condition']
            };
            var rc = config.getNext();
        } while (rc == RC_SUCCESS);
    }

    return surveyFields;
}

/*
 * @public
 * @description submit svcSrcSurvey record to corresponding surveyinternal record. if arguments provided, then context is in-app call, else is ws call.
 * @param {Object} survey - The surveyinternal record
 * @param {Object} svcSrcSurvey - The surveyinternal record
 * @return result ['status','message']
 */
function submitSurveyRecord(inSvcSrcSurvey, inSurvey) {

    var svcSrcSurvey;
    var survey;
    var inAppCall = false;
    var result = ['ok'];

    if (inSvcSrcSurvey && inSurvey) {
        inAppCall = true;
        svcSrcSurvey = inSvcSrcSurvey;
        survey = inSurvey;
    } else {
        svcSrcSurvey = vars.$L_file;
        setExitType(NORMAL_EXIT);
        var number = svcSrcSurvey['number'];
        var query = "number=" + number;
        var operator = getCurrentOperator();
        query += " and contact.name=\"" + operator['contact.name'] + "\" and status=\"Open\"";
        survey = select("SurveyInternal", query);
        if (survey == null) {
            setExitType(BAD_VALIDATION_EXIT);
            return;
        }
    }

    //get template.questions
    //here we need to consider a default template, in case of the older survey data
    //first we check if the survey has question snapshot
    if (!_.isEmpty(survey['template.questions'])) {
        lib.SurveyTemplateHelpers.restoreQuestionsFromXML(survey['template.questions'], true);
    } else {
        var templateName = lib.settings.getSettingValue("Survey", "defaultTemplateName");
        var templateQuery = survey['template.id'] ? 'id="' + survey['template.id'] + '"' : 'name="' + templateName + '"';
        var template = $('SurveyTemplate', SCFILE_READONLY).select(templateQuery).uniqueResult();
        if (!template || funcs.lng(funcs.denull(template.questions)) < 1) {
            setExitType(NO_RECORD_EXIT);
            return;
        }

        //populate question info variables, leverage the SurveyTemplateService via thread variables
        $('#SurveyTemplateService').initQuestionInfo(template);
    }

    //get question info list
    var surveyFieldNames = vars.$surveyFieldNames.toArray();
    var surveyFieldTypes = vars.$surveyFieldTypes.toArray();
    var surveyMandatories = vars.$surveyMandatories.toArray();
    var surveyCustomAnswers = vars.$surveyAllowCustomAnswers.toArray();
    var surveyGls = vars.$surveyGlobalLists.toArray();
    var surveyAnswerTypes = vars.$surveyAnswerTypes.toArray();

    var questions = lib.ArrayUtil.toJsArray(svcSrcSurvey['questions']);
    //var dbdict = lib.ScAPI_GetOptionsLookup.getDBDICT("SurveyInternal");
    //var isValid = true;

    //traverse questions, validate value and set to corresponding survey field
    //find first validation failure, if all pass, then validation pass, and all value set.
    _.find(questions, function(question, questionIndex) {

        var fieldName = question['dest.field.name'];
        var index = _.indexOf(surveyFieldNames, fieldName);
        //bypass, if this question is not defined in template
        if (index === -1) {
            return;
        }
        var value = question['value'];
        var isMandatory = surveyMandatories[index] === 'true';
        var fieldType = surveyFieldTypes[index];

        var canCustomize = surveyCustomAnswers[index] === 'true';
        var glName = surveyGls[index];
        var answerType = surveyAnswerTypes[index];

        //validation failure, break the loop
        if (isMandatory && _.isEmpty(value)) {
            result = ['fail', scmsg('100', 'survey', [questionIndex + 1])]; //Question No. %S is mandatory.
            return true;
        }

        if (!_.isEmpty(value)) {
            //evaluate value, based on field type
            switch (fieldType) {
                case 'character':
                    if (glName != null && glName != "" && !canCustomize) {
                        if (!verifyValueFromGL(value, glName)) {
                            result = ['fail', scmsg('109', 'survey', [questionIndex + 1])];
                            return true;
                        }
                    }
                    break;
                case 'datetime':
                    value = funcs.val(value, $.Datetime);
                    if (!value) {
                        result = ['fail', scmsg('103', 'survey', [questionIndex + 1])];
                        return true;
                    }
                    break;
                case 'number':
                    value = funcs.val(value, $.Number);
                    if (!_.isNumber(value)) {
                        result = ['fail', scmsg('101', 'survey', [questionIndex + 1])];
                        return true;
                    }
                    if (glName != null && glName != "" && !canCustomize) {
                        if (!verifyValueFromGL(value, glName)) {
                            result = ['fail', scmsg('109', 'survey', [questionIndex + 1])];
                            return true;
                        }
                    }

                    break;
                case 'logical':
                    value = funcs.val(value, $.Logical);
                    if (!_.isBoolean(value)) {
                        result = ['fail', scmsg('104', 'survey', [questionIndex + 1])];
                        return true;
                    }
                    break;
                case 'array':
                    var subFieldType = funcs.dbdict_helper('field.type', survey, fieldName + ',' + fieldName);
                    try {
                        value = _convertStringValueToArray(value, subFieldType);
                        if (_.isEmpty(value)) {
                            result = ['fail', scmsg('10' + subFieldType, 'survey', [questionIndex + 1])];
                            return true;
                        }

                        //check value length, according to answerType:
                        //  radio/dropdownList can only have one item,
                        //  multi-selection can have constrained number of items.
                        if ((answerType === 'radioButtons' || answerType === 'dropdownList' || answerType === 'text') && value.length > 1) {
                            result = ['fail', scmsg('109', 'survey', [questionIndex + 1])];
                            return true;
                        }

                        if (answerType === 'multipleSelection') {
                            var gl = $('globallists', SCFILE_READONLY).setFields(["list.variable"]).select('name="' + glName + '"').uniqueResult();
                            var valueList = _convertStringValueToArray(vars[gl['list.variable']].toArray().join('\n'), subFieldType);
                            var parts = _.partition(value, function(_value) {
                                return _.contains(valueList, _value);
                            });
                            var selectionList = _.uniq(parts[0]);
                            var customValueList = parts[1];

                            if ((canCustomize && customValueList.length > 1) || (!canCustomize && customValueList.length > 0)) {
                                result = ['fail', scmsg('109', 'survey', [questionIndex + 1])];
                                return true;
                            }

                            //remove duplicate selection, probably happens when ws call
                            value = selectionList.concat(customValueList);
                        }

                        //verify if value is in predefined options
                        if (glName != null && glName != "" && !canCustomize) {
                            if (!verifyValueFromGL(value, glName, true)) {
                                result = ['fail', scmsg('109', 'survey', [questionIndex + 1])];
                                return true;
                            }
                        }

                    } catch (e) {
                        result = ['fail', scmsg('10' + subFieldType, 'survey', [questionIndex + 1])];
                        return true;
                    }
                    break;
            }

            //set value if pass the validation
            survey[fieldName] = value;
        }

    });

    if (result[0] !== 'ok' && !inAppCall) {
        setExitType(BAD_VALIDATION_EXIT);
        print(result[1]);
        return;
    }

    if (!inAppCall) {
        var ess = vars.$G_ess;
        vars.$G_ess = true;
        try {
            //var rc = survey.doAction("submit");

            if (funcs.nullsub(survey['callback.support'], "normal") != "normal") {
                var sch = new SCFile("schedule");
                var sch_name = 'Survey Interaction-' + survey.number;
                var RC = sch.doSelect("name = \"" + sch_name + "\"");
                var existed = false;

                if (RC == RC_SUCCESS) {
                    existed = true;
                }

                if (!existed) {
                    //create schedule for new interaction
                    sch["name"] = sch_name;
                    sch["class"] = 'Survey_Service_Agent';
                    sch["sched.class"] = 'Survey_Service_Agent';
                    sch["status"] = 'rescheduled';
                    sch.expiration = funcs.tod();
                    sch.repeata = false; //Annually
                    sch.repeatb = false; //Semi-Annually
                    sch.repeatm = false; //Monthy
                    sch.repeatq = false; //Quterly

                    var run_js = 'lib.Survey_Internal.newInteractionFromSch("\$surveyId\$");';
                    var pattern = /\$+\w+\$/i;
                    sch.javascript = run_js.replace(pattern, survey.number);

                    sch.doInsert();
                }
            }

            survey.status = "Closed";
            survey.close_by = funcs.operator();
            survey.close_time = funcs.tod();
            survey.doSave();

        } catch (e) {}

        vars.$G_ess = ess;
    }

    return result;
}

function _convertStringValueToArray(value, type) {
    var ary = value.split("\n");
    var i;
    var _ary = [];
    for (i = 0; i < ary.length; i++) {
        _ary[i] = funcs.val(ary[i], type);
        if (_ary[i] == null) {
            throw "invalid";
        }
    }
    return _ary;
}

function _convertTimeArrayToString(ary) {
    var i;
    var _ary = [];
    for (i = 0; i < ary.length; i++) {
        _ary[i] = lib.tzFunctions.convertDatetoString(ary[i], 6, "Greenwich/Universal");
    }
    return _ary.join("\n");
}

function verifyValueFromGL(value, glName, isList) {
    var globallist = new SCFile("globallists", SCFILE_READONLY);
    globallist.setFields(["list.variable"]);
    var rc = globallist.doSelect("name=\"" + glName + "\"");
    if (rc == RC_SUCCESS) {
        var listvariable = globallist["list.variable"];
        if (listvariable == null || listvariable == "") {
            return false;
        }
        var values = lib.globalListTools.getGlobalListValue(listvariable);
        if (isList) {
            var k;
            for (k = 0; k < value.length; k++) {
                if (funcs.index(value[k], values) <= 0) {
                    return false;
                }
            }
            return true;

        } else {
            if (funcs.index(value, values) > 0) {
                return true;
            }
        }
    }
    return false;
}