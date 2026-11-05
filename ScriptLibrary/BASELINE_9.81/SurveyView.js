var $ = lib.c.$;
var _ = lib.Underscore.require();
var msg = funcs.scmsg;

var fileMapping = {
    "cm3r": "change",
    "incidents": "interaction",
    "probsummary": "incident"
};

var SurveyView = $({

    doOpen: function(request) {
        return "SurveySend.new";
    },

    doSend: function(request) {
        var text;

        var file = request.getParameter("$L.file");
        var fileName = funcs.filename(file);

        var devtype = new SCFile("devtype", SCFILE_READONLY);
        devtype.setFields(["device.name"]);
        var rc = devtype.doSelect("joindef=\"" + fileName + "\"");
        if (rc == RC_SUCCESS) {
            fileName = "device";
        }

        if (vars["$survey.template"] == null) {
            text = msg(38, "survey");
            request.setAttribute("$L.mb.message", text);
            request.setAttribute("$L.mb.ok", "#surveyView.doOk");
            return "mb.ok";
        } else {
            //var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fileName);
            //var UniqueKey = funcs.str(UniqueKeyObj[0]);

            var template = $('SurveyTemplate', SCFILE_READONLY).select('id="' + vars["$survey.template"] + '" and current.phase="published" and (module="' + fileName + '" or module=NULL)').uniqueResult();
            var flag = false;
            if (template != null) {
                var cat = request.getParameter("$L.category");
                var obj = request.getParameter("$L.object");
                var fileOld = request.getParameter("$L.file.save");
                var wf = request.getParameter("$L.wfPhase1");
                var wfOld = request.getParameter("$L.wfPhase.save1");
                var phase = request.getParameter("$L.phase1");

                var file_save = vars["$L.file"];
                var cat_save = vars["$L.category"];
                var fileOld_save = vars["$L.file.save"];
                var obj_save = vars["$L.object"];
                var wf_save = vars["$L.wfPhase"];
                var wfOld_save = vars["$L.wfPhase.save"];
                var phase_save = vars["$L.phase"];

                vars["$L.file"] = file;
                vars["$L.file.save"] = fileOld;
                vars["$L.category"] = cat;
                vars["$L.object"] = obj;
                vars["$L.wfPhase"] = wf;
                vars["$L.wfPhase.save"] = wfOld;
                vars["$L.phase"] = phase;

                flag = lib.SurveyTemplateHelpers.checkSurvey(template);

                vars["$L.file"] = file_save;
                vars["$L.category"] = cat_save;
                vars["$L.object"] = obj_save;
                vars["$L.file.save"] = fileOld_save;
                vars["$L.wfPhase"] = wf_save;
                vars["$L.wfPhase.save"] = wfOld_save;
                vars["$L.phase"] = phase_save;
            }
            if (!flag) {
                text = msg(41, "survey");
                request.setAttribute("$L.mb.message", text);
                request.setAttribute("$L.mb.ok", "#surveyView.doOk");
                return "mb.ok";
            }
        }

        var users_number = 0;
        if (vars["$survey.users"]) {
            var survey_users = _.uniq(funcs.denull(vars["$survey.users"]).toArray());
            users_number = survey_users.length;
        }

        if (users_number <= 0) {
            text = msg(36, "survey");
            request.setAttribute("$L.mb.message", text);
            request.setAttribute("$L.mb.ok", "#surveyView.doOk");
            return "mb.ok";
        }

        var maxReceivers = parseInt(lib.settings.getSettingValue("Survey", "maxRecipients"));
        if (!maxReceivers) {
            maxReceivers = 0;
        }
        if (users_number > maxReceivers && maxReceivers > 0) {
            text = msg(42, "survey", [maxReceivers]);
            request.setAttribute("$L.mb.message", text);
            request.setAttribute("$L.mb.level", 2);
            request.setAttribute("$L.mb.yes", "#surveyView.doYes");
            request.setAttribute("$L.mb.no", "#surveyView.doNo");
            request.setAttribute("$L.mb.needCancel", false);
            return "mb.yes.no";
        }

        text = msg(34, "survey");
        request.setAttribute("$L.mb.message", text);
        request.setAttribute("$L.mb.level", 2);
        request.setAttribute("$L.mb.yes", "#surveyView.doYes");
        request.setAttribute("$L.mb.no", "#surveyView.doNo");
        request.setAttribute("$L.mb.needCancel", false);
        return "mb.yes.no";
    },

    doYes: function(request) {
        var file = request.getParameter("$L.file.save");
        var file_tag = fileMapping[funcs.filename(file)];
        var i;
        var format_list = "";

        //filter out invalid contact name
        var bufferList = $.createSCArray();
        var survey_users = (funcs.denull(vars["$survey.users"])).toArray();
        _.each(survey_users, function(user) {
            var count = $('contacts', SCFILE_READONLY).fields("contact.name").count('contact.name="' + user + '"');
            if (count > 0) {
                bufferList.push(user);
            }
        });
        vars["$survey.users"] = bufferList;
        var users_number = funcs.lng(vars["$survey.users"]);

        for (i = 0; i < users_number; i++) {
            format_list += "\n" + vars["$survey.users"][i];
        }
        lib.SurveyTemplateHelpers.sendSurvey(file, vars["$survey.users"], file_tag);

        var text = msg(35, "survey", [funcs.str(format_list + "\n")]);

        request.setAttribute("$L.mb.message", text);
        request.setAttribute("$L.mb.level", 1);
        request.setAttribute("$L.mb.ok", "#surveyView.doContinue");
        return "mb.ok";
    },

    doContinue: function(request) {
        vars['$survey.template'] = null;
        return;
    },

    doNo: function(request) {
        request.setAttribute("$L.tile", funcs.scmsg(31, "survey"));
        request.setAttribute("$L.format", "SurveyInternal.contacts");
        return "SurveySend.new";
    },

    doOk: function(request) {
        return "SurveySend.new";
    },

    doFillSurveyTemplate: function(request) {

        var file = request.getParameter("$L.file");
        var cat = request.getParameter("$L.category");
        var obj = request.getParameter("$L.object");
        var fileOld = request.getParameter("$L.file.save");
        var wf = request.getParameter("$L.wfPhase1");
        var wfOld = request.getParameter("$L.wfPhase.save1");
        var phase = request.getParameter("$L.phase1");

        var fname = funcs.filename(file);
        //var UniqueKeyObj = lib.tableFunctions.getUniqueKey(fname);
        //var UniqueKey = funcs.str(UniqueKeyObj[0]);

        var devtype = new SCFile("devtype", SCFILE_READONLY);
        devtype.setFields(["device.name"]);
        var rc = devtype.doSelect("joindef=\"" + fname + "\"");
        if (rc == RC_SUCCESS) {
            fname = "device";
        }

        vars.$surveyTemplateIDs = [];
        vars.$surveyTemplateNames = [];

        var query = 'current.phase="published" and (module=NULL or module="' + fname + '")';

        var file_save = vars["$L.file"];
        var cat_save = vars["$L.category"];
        var fileOld_save = vars["$L.file.save"];
        var obj_save = vars["$L.object"];
        var wf_save = vars["$L.wfPhase"];
        var wfOld_save = vars["$L.wfPhase.save"];
        var phase_save = vars["$L.phase"];

        vars["$L.file"] = file;
        vars["$L.file.save"] = fileOld;
        vars["$L.category"] = cat;
        vars["$L.object"] = obj;
        vars["$L.wfPhase"] = wf;
        vars["$L.wfPhase.save"] = wfOld;
        vars["$L.phase"] = phase;

        $('SurveyTemplate', SCFILE_READONLY).setFields(["id", "name"]).select(query).iterate(function(template) {
            var flag = lib.SurveyTemplateHelpers.checkSurvey(template);
            if (flag) {
                vars.$surveyTemplateIDs.push(template.id);
                vars.$surveyTemplateNames.push(template.name);
            }
        });

        vars["$L.file"] = file_save;
        vars["$L.category"] = cat_save;
        vars["$L.object"] = obj_save;
        vars["$L.file.save"] = fileOld_save;
        vars["$L.wfPhase"] = wf_save;
        vars["$L.wfPhase.save"] = wfOld_save;
        vars["$L.phase"] = phase_save;

        var length = vars.$surveyTemplateIDs.length();
        if (length < 1) {
            print(msg(96, "us"));
        } else if (length == 1) {
            vars.$survey_template = vars.$surveyTemplateIDs[0];
        } else if (length > 1) {
            return "SurveyTemplate.list";
        }

        request.setAttribute("$L.tile", funcs.scmsg(31, "survey"));
        request.setAttribute("$L.format", "SurveyInternal.contacts");
        return "SurveySend.new";
    },

    doSelectTemplate: function(request) {
        funcs.cleanup(vars.$surveyTemplateIDs);
        funcs.cleanup(vars.$surveyTemplateNames);

        request.setAttribute("$L.tile", funcs.scmsg(31, "survey"));
        request.setAttribute("$L.format", "SurveyInternal.contacts");
        return "SurveySend.new";
    },

    //below functions doOpenSearch,doSearchQuestions, doSelect are used in Survey Template to link existing questions
    //Open Search format to search existing questions
    doOpenSearch: function(request) {
        lib.SurveyTemplateHelpers.getFieldsCaptions(vars.$surveyFieldNames.toArray());
        return "SurveySearch.question.new";
    },

    //Search existing question from search format
    doSearchQuestions: function(request) {

        var file = request.getParameter("$L.file");

        vars.$questionIds = [];
        vars.$questionFlds = [];
        vars.$questionLabels = [];
        vars.$questionTypes = [];
        vars.$questionMandatoryFlags = [];
        vars.$questionCustomizedFlags = [];
        vars.$questionFldTypes = [];
        vars.$questionGLs = [];

        var msgIds = [];
        var query = "dest.file.name=\"SurveyInternal\"";

        var availableIds = lib.SurveyTemplateHelpers.getUnselectedQuestions(file.questions, "dest.file.name=\"SurveyInternal\"");
        query = query + " and id isin {" + availableIds.join(',') + "}";

        if (vars.$id) {
            query = query + " and id#" + vars.$id;
        }

        if (vars.$fieldName) {
            query = query + " and dest.field.name#\"" + vars.$fieldName + "\"";
        } else {
            // don't check dest.field.name if answer type is registerInteraction
            if ((vars.$sqlFildList).length() > 0) {
                query += ' and (dest.field.name isin {' + vars.$sqlFildList.join(',') + '} or answer.type="registerInteraction")';
            } else {
                query += ' and (dest.field.name=NULL or answer.type="registerInteraction")';
            }
        }

        if (vars.$questionLabel) {
            $('!scmessage').fields("message.id").select("class=\"srcsurvey\" and message like \"*" + vars.$questionLabel + "*\"").iterate(function(message) {
                msgIds.push(message.message_id);
            });
            query = query + " and question.label isin {" + msgIds.join(',') + "}";
        }

        if (vars.$answerType) {
            query = query + " and answer.type#\"" + vars.$answerType + "\"";
        }

        if (vars.$globalList) {
            query = query + " and global.list#\"" + vars.$globalList + "\"";
        }

        if (vars.$customFlag) {
            if (vars.$customFlag == "true") {
                query = query + " and custom.answer.allowed#true";
            } else {
                query = query + " and (custom.answer.allowed#false or custom.answer.allowed=NULL)";
            }
        }

        if (vars.$mandatoryFlag) {
            if (vars.$mandatoryFlag == "true") {
                query = query + " and mandatory.condition#\"true\"";
            } else {
                query = query + " and mandatory.condition#\"false\"";
            }
        }

        if (vars.$fieldType) {
            query = query + " and dest.field.type#\"" + vars.$fieldType + "\"";
        }

        var showList = false;

        $('svcSrcSurveyConfig', SCFILE_READONLY).select(query).iterate(function(config) {
            showList = true;
            (vars.$questionIds).push(config.id);
            (vars.$questionFlds).push(config.dest_field_name);
            (vars.$questionTypes).push(config.answer_type);
            (vars.$questionMandatoryFlags).push(config.mandatory_condition);
            (vars.$questionCustomizedFlags).push(config.custom_answer_allowed);
            (vars.$questionFldTypes).push(config.dest_field_type);
            (vars.$questionGLs).push(config.global_list);

            var labelId = config.question_label;
            var label = msg(labelId, "srcsurvey", []);

            (vars.$questionLabels).push((_.isEmpty(label)) ? labelId : label);
        });

        if (showList) {
            return "svcSrcSurveyConfig.list";
        }

        var text = msg(96, "us");
        request.setAttribute("$L.mb.message", text);
        request.setAttribute("$L.mb.ok", "#surveyView.doNoRecordOk");
        return "mb.ok";
    },

    doNoRecordOk: function(request) {
        return "SurveySearch.question.new";
    },

    //select the questions from question list
    doSelect: function(request) {

        if (vars.$newquestionIds) {
            if (lib.SurveyTemplateHelpers.HasSameField(vars.$newquestionIds)) {
                print(msg("link.question.same.field", "survey", []));
                return "svcSrcSurveyConfig.list";
            }

            var file = request.getParameter("$L.file");

            var len = (vars.$newquestionIds).length();
            if (len > 0) {
                var k;
                for (k = 0; k < len; k++) {
                    if (file.questions[0] === null) {
                        file.questions[0] = parseInt(vars.$newquestionIds[k]);
                    } else {
                        file.questions.push(parseInt(vars.$newquestionIds[k]));
                    }
                }
            }

            return;
        } else {
            print(msg(1624, "us", []));
            return "svcSrcSurveyConfig.list";
        }
    },

    doBack: function(request) {
        return "SurveySearch.question.new";
    },

    doCancel: function(request) {
        return;
    }

});


function getClass() {
    return SurveyView;
}