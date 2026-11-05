var _ = lib.Underscore.require();
var $ = lib.c.$;

function SurveyTemplateService() {

    const FIELD_NAMES = {
        ID: "id",
        COMPANY: "company",
        DEST_FILE_NAME: "dest.file.name",
        DEST_FIELD_NAME: "dest.field.name",
        DEST_FIELD_TYPE: "dest.field.type",
        QUESTION_LABEL: "question.label",
        ANSWER_TYPE: "answer.type",
        ORDER: "order",
        MANDATORY_CONDITION: "mandatory.condition",
        CUSTOM_ANSWER_ALLOWED: "custom.answer.allowed",
        GLOBALLIST: "global.list",
        IMAGELIST: "image.list",
        LAYOUT: "layout"
    };
    const FILE_NAME = 'SurveyInternal';

    //import helper functions
    const HELPERS = lib.SurveyTemplateHelpers;

    //availableFields hold the fields to avoid too many query and iteration on field info
    var availableFields;

    function _convertFieldLabelCap(labelId) {
        var label = funcs.scmsg(labelId, "srcsurvey", []);
        return (_.isEmpty(label)) ? labelId : label;
    }


    /*
     * @private
     * @description get question info from table svcSrcSurveyConfig
     * @param {Object} record - The SurveyTemplate record
     * @return NULL
     */
    function _initQuestions(record) {

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
        //vars.$surveyFieldOrders = [];
        vars.$surveyQuestionIds = [];

        //check if this record has question defined
        if (funcs.lng(funcs.denull(record.questions)) === 0) {
            return null;
        }

        //get qestions from svcSrcSurveyConfig file in one query, better performance.
        var questionQuery = FIELD_NAMES.ID + ' isin ' + funcs.str(record.questions);
        var questionConfigStore = {};
        $('svcSrcSurveyConfig', SCFILE_READONLY).select(questionQuery).iterate(function(config) {
            var questionConfigItem = {};
            //copy field value from the svcSrcSurveyConfig record
            _.each(FIELD_NAMES, function(configFieldName) {
                questionConfigItem[configFieldName] = config[configFieldName];
            });
            questionConfigStore[config.id] = questionConfigItem;
        });

        //fill info variables in same order of question array
        var questions = record.questions;
        var i;
        var lng = questions.length();
        for (i = 0; i < lng; i++) {
            var configItem = questionConfigStore[questions[i]];

            if (configItem) {
                (vars.$surveyFieldNames).push(configItem[FIELD_NAMES.DEST_FIELD_NAME]);
                (vars.$surveyQuestionLabels).push(_convertFieldLabelCap(configItem[FIELD_NAMES.QUESTION_LABEL]));
                (vars.$surveyFieldTypes).push(configItem[FIELD_NAMES.DEST_FIELD_TYPE]);
                (vars.$surveyQuestionIds).push(configItem[FIELD_NAMES.ID]);
                (vars.$surveyAnswerTypes).push(configItem[FIELD_NAMES.ANSWER_TYPE]);
                (vars.$surveyGlobalLists).push(configItem[FIELD_NAMES.GLOBALLIST]);
                (vars.$surveyImageLists).push(configItem[FIELD_NAMES.IMAGELIST]);
                (vars.$surveyLayouts).push(configItem[FIELD_NAMES.LAYOUT]);
                (vars.$surveyAllowCustomAnswers).push(configItem[FIELD_NAMES.CUSTOM_ANSWER_ALLOWED]);
                (vars.$surveyMandatories).push(configItem[FIELD_NAMES.MANDATORY_CONDITION]);
                //(vars.$surveyFieldOrders).push(configItem[FIELD_NAMES.ORDER]);
            }
        }

    }

    /*
     * SurveyTemplateService singleton object, shared by all sessions in one login.
     */
    return {

        //init field list from surveyinternal table for user to choose
        initFieldsList: function() {
            availableFields = HELPERS.getAvailableFields(FILE_NAME);
            vars.$fields = [];
            vars.$fieldCaptions = [];
            _.each(availableFields, function(field) {
                if (!_.contains(vars.$surveyFieldNames.toArray(), field.name)) {
                    vars.$fields.push(field.name);
                    vars.$fieldCaptions.push(field.caption);
                }
            });
        },

        initEditFieldsList: function(record) {
            availableFields = HELPERS.getAvailableFields(FILE_NAME);
            vars.$fields = [];
            vars.$fieldCaptions = [];
            _.each(availableFields, function(field) {
                if (!_.contains(vars.$surveyFieldNames.toArray(), field.name)) {
                    vars.$fields.push(field.name);
                    vars.$fieldCaptions.push(field.caption);
                }
                if (field.name == record.dest_field_name) {
                    vars.$fields.push(field.name);
                    vars.$fieldCaptions.push(field.caption);
                }
            });
        },

        initQuestionInfo: function(record) {
            _initQuestions(record);
        },

        processAddActions: function(record, option) {
            record = record || vars.$L_file;
            option = option || funcs.option();
            var otherOptions = {
                questionLabel: vars.$questionLabel,
                newLabelValue: vars.$newLabelValue
            };
            var rv = HELPERS.processAddActions(record, option, availableFields, otherOptions);
            if (rv) {
                vars.$newQuestionId = rv;
            }
        }
    };

}


function getClass() {
    return $(new SurveyTemplateService());
}