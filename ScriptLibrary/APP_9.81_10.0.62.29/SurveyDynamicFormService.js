var _ = lib.Underscore.require();
var $ = lib.c.$;
var log = getLog("SurveyDynamicFormService");

function SurveyDynamicFormService() {
    //import
    var lng = funcs.lng;
    var denull = funcs.denull;
    var SurveyAPI = lib.ScAPI_Survey;
    var ArrayUtil = lib.ArrayUtil;
    var dynamicFormGenerator = lib.dynamicFormGenerator;

    var widgetStore = {};

    /*
     * @private
     * @description construct the final xml string from the surveyinternal record.
     * @param {Object} record - The surveyinternal record
     * @return xml string
     */
    function _renderXMLForm(record) {
        //get question info
        var svcSrcSurvey = SurveyAPI.getSurveyRecord(record);
        vars.$svcSrcSurvey = svcSrcSurvey;
        if (svcSrcSurvey == null) {
            return '<form></form>';
        }

        // introduction    
        var xmlIntro = "";
        if (record.template_id) {
            var template = $('SurveyTemplate', SCFILE_READONLY).setFields(["introduction"]).select('id="' + record.template_id + '"').uniqueResult();
            if (template) {
                var introduction = lib.SurveyTemplateHelpers.getIntroductionMessage(template, vars.$G_my_language);
                var style = 'padding="20" fontincrease="2"';
                xmlIntro = '<label ' + style + '>' + lib.StringUtil.escapeStringforXML(introduction) + '</label>';
            }
        }

        if (lng(denull(svcSrcSurvey.questions)) < 1) {
            return '<form>' + xmlIntro + '</form>';
        }

        var questions = ArrayUtil.toJsArray(svcSrcSurvey.questions);
        var xmlForm = _.reduce(questions, function(memo, question, questionIndex) {

            var type = question['answer.type'];
            if (!widgetStore[type]) {
                return memo;
            }
            return memo + widgetStore[type].render(question, questionIndex);

        }, '');

        // disable hard code append, use oob register interaction question instead   
        //append register interaction component
        //    xmlForm += widgetStore['registerInteraction'].render({value:record['callback.support']},lng(denull(svcSrcSurvey.questions)))

        return '<form>' + xmlIntro + xmlForm + '</form>';
    }

    /** This function filter dynamic form based on form elements' visible condition
     *
     *  @param {record scfile} record - file record
     *	@param {XML String} form - the dynamic form to be filtered
     *	@param {String} mode - mode
     *	@return The filtered xml dynamic form
     *  @type xmlString
     */
    function _setVisiblity(record, form, mode) {
        //pre-process visibility filter
        form = form || "<form></form>";
        form = dynamicFormGenerator.filterVisible(record, form, mode);

        var formXML = new XML();
        formXML.setContent(form);
        var element = formXML.getFirstChildElement();
        while (element !== null) {
            var componentName = element.getAttributeValue('componentName');
            if (componentName !== null && componentName !== '') {
                var component = widgetStore[componentName];
                if (component && component.hasOwnProperty('processVisiblity') && typeof component.processVisiblity === 'function') {
                    component.processVisiblity(element, formXML, record);
                }
            }
            element = element.getNextSiblingElement();
        }

        return formXML.toXMLString();
    }

    return {

        init: function() {
            widgetStore = lib.SurveyDynamicFormComponent.getAllComponents();
        },

        render: function(record) {
            var xml = _renderXMLForm(record);
            if (log.isDebugEnabled()) {
                log.debug(`render:${xml}`);
            }

            return xml;
        },

        setVisibility: function(record, xmlForm) {
            //var mode = record.status==='Open' ? 'edit': 'read';
            return _setVisiblity(record, xmlForm, 'edit');
        },

        submit: function(record, svcSrcSurvey, form) {

            var questionMap = {};
            var questions = ArrayUtil.toJsArray(svcSrcSurvey.questions);
            _.each(questions, function(question) {
                questionMap[question['dest.field.name']] = question;
            });

            var xmlForm = new XML();
            xmlForm.setContent(form);
            //traverse the form to set value to svcSrcSurvey.questions
            var element = xmlForm.getFirstChildElement();
            while (element !== null) {
                var componentName = element.getAttributeValue('componentName');
                if (componentName !== null && componentName !== '') {
                    var fieldName = element.getAttributeValue('id');
                    var component = widgetStore[componentName];
                    if (component) {
                        if (questionMap[fieldName]) {
                            questionMap[fieldName]['value'] = component.getValue(questionMap[fieldName], element, xmlForm, svcSrcSurvey, record);
                        } else {
                            svcSrcSurvey[fieldName] = component.getValue(svcSrcSurvey, element, xmlForm, record);
                        }
                    }
                }
                element = element.getNextSiblingElement();
            }

            return SurveyAPI.submitSurveyRecord(svcSrcSurvey, record);
        }
    };
}


function getClass() {
    return $(new SurveyDynamicFormService());
}