var _ = lib.Underscore.require();
var $ = lib.c.$;
var xmlHelpers = lib.xmlHelpers;
var CUSTOM_ANSWER = 'customized';

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var TextComponent = {

    render: function(question, questionIndex, visible) {
        var xml = '<text componentName="{{type}}" id="{{id}}" label="{{label}}" mandatory="{{mandatory}}" mandatoryResult="{{mandatoryResult}}" visible="{{visible}}" visibleResult="{{visibleResult}}">{{value}}</text>';
        var template = _.template(xml);
        var _label = _.isNumber(questionIndex) ? (questionIndex + 1) + '. ' + question['question.label'] : question['question.label'];

        return template({
            id: question['dest.field.name'],
            label: _.escape(_label),
            mandatory: question['mandatory.condition'],
            mandatoryResult: question['mandatory.condition'],
            visible: visible || 'true',
            visibleResult: 'true',
            value: _.escape(question['value']),
            type: question['answer.type']
        });
    },

    getValue: function(question, xmlElement) {
        return xmlElement.getValue();
    }
};

var selectComponent = function(style) {

    return {
        render: function(question, questionIndex) {
            var xml = '<select componentName="{{type}}" id="{{id}}" label="{{label}}" mandatory="{{mandatory}}" mandatoryResult="{{mandatoryResult}}" style="{{style}}" layout="{{layout}}" visible="{{visible}}" visibleResult="{{visibleResult}}">{{value}}{{options}}</select>';
            var template = _.template(xml);
            var optionXml = '<option label="{{label}}" img="{{img}}">{{value}}</option>';
            var optionTemp = _.template(optionXml);
            var _label = _.isNumber(questionIndex) ? (questionIndex + 1) + '. ' + question['question.label'] : question['question.label'];

            // set basic info
            var radioObject = {
                "id": question['dest.field.name'],
                "label": _.escape(_label),
                "mandatory": question['mandatory.condition'],
                "mandatoryResult": question['mandatory.condition'],
                "visible": 'true',
                "visibleResult": 'true',
                "type": question['answer.type'],
                "options": '',
                "value": '',
                "layout": question['layout'],
                "style": style
            };

            // get option lists
            var gl = $('globallists', SCFILE_READONLY).setFields(["list.variable", "display.variable"]).select('name="' + question['global.list'] + '"').uniqueResult();
            var valueList = vars[gl['list.variable']].toArray();
            var dispList = vars[gl['display.variable']];
            if (!dispList || funcs.lng(dispList) === 0) {
                dispList = valueList;
            } else {
                dispList = dispList.toArray();
            }

            // image list
            var imageGroupId = question.image_list;

            var _options = _.reduce(valueList, function(memo, option, index) {
                if (!option) {
                    return memo;
                }
                var optionObj = {
                    label: _.escape(dispList[index]),
                    img: "",
                    value: _.escape(option)
                };

                // set image url
                if (imageGroupId != null && imageGroupId > 0) {
                    var imageId = lib.SurveyImage.getImageIdByValue(imageGroupId, valueList[index]);
                    if (imageId > 0) {
                        var query = `application="SurveyImage" and topic="${imageId}" and type=3 and segment=0`;
                        var attachmentImg = $("SYSATTACHMENTS", SCFILE_READONLY).find(query).one();
                        if (attachmentImg) {
                            optionObj.img = "scattach://" + lib.AttachmentUtil.getAttachmentLinkTag(attachmentImg, "img");
                        }
                    }
                }

                return memo + optionTemp(optionObj);
            }, '');

            //append custom option
            var allowCustomAnswer = question['custom.answer.allowed'];
            if (allowCustomAnswer) {

                var optionCustomer = {
                    label: funcs.scmsg('110', 'survey'),
                    img: "",
                    value: CUSTOM_ANSWER
                };

                // set customized answer image url
                if (imageGroupId != null && imageGroupId > 0) {
                    var image = $("!SurveyImage").fields("id").find('name="Other Answer"').one();
                    if (image) {
                        var query = `application="SurveyImage" and topic="${image.id}" and type=3 and segment=0`;
                        var attachmentImg = $("SYSATTACHMENTS", SCFILE_READONLY).find(query).one();
                        if (attachmentImg) {
                            optionCustomer.img = "scattach://" + lib.AttachmentUtil.getAttachmentLinkTag(attachmentImg, "img");
                        }
                    }
                }

                _options += optionTemp(optionCustomer);
            }

            radioObject.options = _options;

            //set customized answer info, used by TextComponent
            var customizedAnswer = {
                'dest.field.name': radioObject.id + '_' + CUSTOM_ANSWER,
                'question.label': funcs.scmsg('111', 'survey'),
                'mandatory.condition': 'true',
                'value': ''
            };

            // set value
            // 1. check if value is in option lists
            // 2. if not, set value to appended customize answer with sibling text component
            var _value = question['value'];
            if (allowCustomAnswer && !_.isEmpty(_value) && !_.contains(valueList, _value)) {
                radioObject.value = CUSTOM_ANSWER;
                customizedAnswer.value = _value;
            } else {
                radioObject.value = _.escape(_value);
            }

            var result = template(radioObject);

            // append custom answer
            if (allowCustomAnswer) {
                // visible condition for customized answer TextComponent
                var visibleCondition = _.escape('[' + radioObject.id + ']="' + CUSTOM_ANSWER + '"');
                var customizedAnswerXml = TextComponent.render(customizedAnswer, null, visibleCondition);
                result += customizedAnswerXml;
            }

            return result;
        },

        getValue: function(question, xmlElement) {
            var _value = xmlElement.getValue();

            var gl = $('globallists', SCFILE_READONLY).setFields(["list.variable", "display.variable"]).select('name="' + question['global.list'] + '"').uniqueResult();
            var valueList = vars[gl['list.variable']].toArray();
            var dispList = vars[gl['display.variable']].toArray();

            if (!_.contains(valueList, _value)) {
                var customized = xmlElement.getNextSiblingElement();
                if (customized && customized.getAttributeValue('id') === question['dest.field.name'] + '_' + CUSTOM_ANSWER) {
                    _value = customized.getValue();
                }
            }

            return _value;
        }
    };

};

var CheckBoxComponent = {

    render: function(question, questionIndex) {

        var xml = '<checkbox componentName="{{type}}" id="{{id}}" label="{{label}}" mandatory="{{mandatory}}" mandatoryResult="{{mandatoryResult}}" visible="{{visible}}" visibleResult="{{visibleResult}}">{{value}}</checkbox>';
        var template = _.template(xml);
        var _label = _.isNumber(questionIndex) ? (questionIndex + 1) + '. ' + question['question.label'] : question['question.label'];

        return template({
            id: question['dest.field.name'],
            label: _.escape(_label),
            mandatory: question['mandatory.condition'],
            mandatoryResult: question['mandatory.condition'],
            visible: 'true',
            visibleResult: 'true',
            value: question['value'],
            type: question['answer.type']
        });
    },

    getValue: function(question, xmlElement) {
        return funcs.val(xmlElement.getValue(), 2);
    }
};

var multiTextComponent = {

    render: function(question, questionIndex) {
        var xml = '<text componentName="multipleText" id="{{id}}" label="{{label}}" mandatory="{{mandatory}}" mandatoryResult="{{mandatoryResult}}" multiline="{{multiline}}" visible="{{visible}}" visibleResult="{{visibleResult}}">{{value}}</text>';
        var template = _.template(xml);
        var _label = _.isNumber(questionIndex) ? (questionIndex + 1) + '. ' + question['question.label'] : question['question.label'];

        return template({
            id: question['dest.field.name'],
            label: _.escape(_label),
            mandatory: question['mandatory.condition'],
            mandatoryResult: question['mandatory.condition'],
            multiline: 'true',
            visible: 'true',
            visibleResult: 'true',
            value: _.escape(question['value'])
        });
    },

    getValue: function(question, xmlElement) {
        return xmlElement.getValue();
    }
};

var RegisterInteractionComponent = {

    render: function(question, questionIndex) {
        var xml = '<select componentName="registerInteraction" id="callback.support" label="{{label}}" mandatory="false" mandatoryResult="false" style="radio" visible="true" visibleResult="true">{{value}}<option label="{{labelNormal}}">normal</option><option label="{{labelComplaint}}">complaint</option><option label="{{labelCompliment}}">compliment</option></select>';
        var template = _.template(xml);

        var _label = funcs.scmsg('112', 'survey');
        if (question['question.label']) {
            _label = question['question.label'];
        }

        return template({
            label: _.isNumber(questionIndex) ? (questionIndex + 1) + '. ' + _label : _label,
            labelNormal: funcs.scmsg('1121', 'survey'),
            labelComplaint: funcs.scmsg('1122', 'survey'),
            labelCompliment: funcs.scmsg('1123', 'survey'),
            value: (_.isEmpty(question.value)) ? 'normal' : question.value
        });
    },

    getValue: function(svcSrcSurvey, xmlElement) {
        return xmlElement.getValue();
    }
};


var multiSelectComponent = {

    render: function(question, questionIndex) {
        var xml = '<group componentName="{{type}}" label="{{label}}" id="{{id}}" mandatory="{{mandatory}}" mandatoryResult="{{mandatory}}">{{options}}</group>';
        var template = _.template(xml);
        var _label = _.isNumber(questionIndex) ? (questionIndex + 1) + '. ' + question['question.label'] : question['question.label'];

        var data = {
            id: question['dest.field.name'],
            label: _.escape(_label),
            mandatory: question['mandatory.condition'],
            mandatoryResult: question['mandatory.condition'],
            type: question['answer.type'],
            options: ''
        };

        //get raw value list, which may contain custom answer, normally at the end position
        var rawValueList = _.isEmpty(question['value']) ? [] : question['value'].split('\n');

        //set customized answer info, via TextComponent: [$id.op.cust]="$CUSTOM_ANSWER"
        var customizeOpionId = data.id + '.op.cust';
        var customizedAnswer = {
            'dest.field.name': data.id + '_' + CUSTOM_ANSWER,
            'question.label': funcs.scmsg('111', 'survey'),
            'mandatory.condition': 'false',
            'value': ''
        };

        //get option lists from gl defined in question
        var gl = $('globallists', SCFILE_READONLY).setFields(["list.variable", "display.variable"]).select('name="' + question['global.list'] + '"').uniqueResult();
        var valueList = vars[gl['list.variable']].toArray();
        var dispList = vars[gl['display.variable']];
        if (!dispList || funcs.lng(dispList) === 0) {
            dispList = valueList;
        } else {
            dispList = dispList.toArray();
        }

        //substract option values and customized value from rawValueList
        var parts = _.partition(rawValueList, function(value) {
            return _.contains(valueList, value);
        });

        var optionValueList = parts[0];
        var customValueList = parts[1];
        customizedAnswer.value = customValueList.join('');

        //generate options
        var optionList = _.map(valueList, function(value, index) {

            var optionData = {
                'dest.field.name': question['dest.field.name'] + '.op.' + index,
                'question.label': dispList[index],
                'mandatory.condition': 'false',
                'value': _.contains(optionValueList, value) ? true : null,
                'answer.type': ''
            };

            return CheckBoxComponent.render(optionData);
        });

        //append customized option
        var allowCustomAnswer = question['custom.answer.allowed'];
        if (allowCustomAnswer) {
            var customizeOptionData = {
                'dest.field.name': customizeOpionId,
                'question.label': funcs.scmsg('110', 'survey'),
                'mandatory.condition': 'false',
                'value': (_.isEmpty(customizedAnswer.value)) ? null : true,
                'answer.type': ''
            };

            optionList.push(CheckBoxComponent.render(customizeOptionData));
        }

        data.options = optionList.join('');

        var result = template(data);

        // append custom answer
        if (allowCustomAnswer) {
            // although visibleRsult is set by self, empty visible attribute will not trigger event to apps
            var visibleCondition = _.escape('[]="true"');
            var customizedAnswerXml = TextComponent.render(customizedAnswer, null, visibleCondition);
            result += customizedAnswerXml;
        }

        return result;
    },

    //need this function to set visibility of customize text component
    processVisiblity: function(element) {
        if (!element) {
            return null;
        }

        var id = element.getAttributeValue('id') + '.op.cust';
        var visible = 'false';
        var customizeAnswer = element.getNextSiblingElement();
        if (!customizeAnswer) {
            return;
        }

        var child = element.getFirstChildElement();
        while (child !== null) {
            if (child.getAttributeValue('id') === id) {
                visible = child.getValue() === 'true';
                break;
            }
            child = child.getNextSiblingElement();
        }

        customizeAnswer.setAttributeValue('visibleResult', visible);

    },

    getValue: function(question, xmlElement) {

        var customizeValue;
        var customizeOptionID = question['dest.field.name'] + '.op.cust';
        var _value = [];

        var gl = $('globallists', SCFILE_READONLY).setFields(["list.variable"]).select('name="' + question['global.list'] + '"').uniqueResult();
        var valueList = vars[gl['list.variable']].toArray();

        var customizeText = xmlElement.getNextSiblingElement();
        if (customizeText && _.isEmpty(customizeText.getAttributeValue('componentName'))) {
            customizeValue = customizeText.getValue();
        }

        //iterate predefined options + customize option
        var index = 0;
        var option = xmlElement.getFirstChildElement();
        while (option !== null) {
            if (option.getValue() === 'true') {
                if (!_.isEmpty(valueList[index])) {
                    _value.push(valueList[index]);
                } else if (option.getAttributeValue('id') === customizeOptionID) {
                    _value.push(customizeValue);
                }
            }
            option = option.getNextSiblingElement();
            index++;
        }

        return _value.join('\n');
    }
};


function getAllComponents() {

    return {
        'text': TextComponent,
        'radioButtons': selectComponent('radio'),
        'dropdownList': selectComponent('combo'),
        'checkBox': CheckBoxComponent,
        'multipleText': multiTextComponent,
        'registerInteraction': RegisterInteractionComponent,
        'multipleSelection': multiSelectComponent
    };

}