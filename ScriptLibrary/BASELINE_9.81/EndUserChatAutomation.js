var $ = lib.c.$;
var _log = getLog("EndUserChatAutomation");

var _null = funcs._null;
var scmsg = funcs.scmsg;
var denull = funcs.denull;
var cursor_field_name_set = funcs.cursor_field_name_set;
var getFilename = funcs.filename;


function strToJson(str) {
    var json = (new Function("return " + str))();
    return json;
}

function getLang(lang) {
    var lan = lang;
    if (!lib.ArrayUtil.contains(vars['$G.language.all.ids'], lan)) {
        lan = "en";
    }

    return lan;
}

function getLocalizedLabel(record, idFieldValue, textFieldValue) {
    var msg = textFieldValue;
    var cls = "local:" + getFilename(record);
    var msgStr = scmsg(getMsgId(record, idFieldValue), cls);
    if (msgStr.indexOf("Could not be found") == -1) {
        msg = msgStr;
    }
    return msg;
}

function getMsgId(record, idFieldValue) {
    var fileName = getFilename(record);
    var uniqueKey = funcs.dbdict_helper("unique.key", fileName)[0];
    var keyValue = record[uniqueKey];
    var msgId = fileName + ";" + keyValue + ";" + idFieldValue;

    return msgId;
}


function getOOFlowExecuteStatus(runId, waitFor) {
    if (_log.isDebugEnabled()) {
        _log.debug("get oo flow result ===>" + runId);
    }
    return lib.SMOOHttpRequest.getExecuteStatus(runId, waitFor);
}


/**
 * get the POST HTTP request
 * 1. generate run task record in table 'sdchatooruntask'
 * 2. generate a schedule record to call function 'invokeOOFlow'
 **/

function createOORunTask(lan, user, config) {
    var lg = getLang(lan);

    if (config != null && config != undefined) {
        var sql = " number=\"" + config['kmid'] + "\" and chat.sessionid=\"" + config['chatsessionid'] + "\" and flow.id=\"" + config['flowid'] + "\" and task.status=\"created\"";
        var ooruntaskcheck = new SCFile("sdchatooruntask", SCFILE_READONLY);
        if (ooruntaskcheck.doSelect(sql) === RC_SUCCESS) {
            return {
                "result": "ERROR",
                "message": "can not create duplicate task!"
            };
        } else {
            var ooruntask = new SCFile("sdchatooruntask");

            ooruntask['id'] = getAutomationRunTaskId();
            ooruntask['number'] = config['kmid'];
            ooruntask['flow.id'] = config['flowid'];
            ooruntask['run.config'] = JSON.stringify(config);
            ooruntask['task.status'] = "created";
            ooruntask['chat.sessionid'] = config['chatsessionid'];
            ooruntask['run.lang'] = lg;

            if (ooruntask.doInsert() === RC_SUCCESS) {
                if (_log.isDebugEnabled()) {
                    _log.debug("createOORunTask : " + ooruntask['id']);
                }

                var ret = false;
                if (config['runmode'] === 'async') {
                    //async run
                    ret = generateExecuteSchedule(ooruntask['id']);
                } else {
                    //sync run
                    ret = invokeOOFlow(ooruntask['id']);
                }

                if (ret.runresult) {
                    return getReponseMesage(getConfigurationMessage(config['kmid'], config['flowid'], lg, "successmsg"), ret.runresponse);
                } else {
                    return {
                        "result": "ERROR",
                        "message": "" + getConfigurationMessage(config['kmid'], config['flowid'], lg, "failuremsg") + ""
                    };
                }
            } else {
                return {
                    "result": "ERROR",
                    "message": "can not create task!"
                };
            }
        }
    } else {
        return {
            "result": "ERROR",
            "message": "parameter error!"
        };
    }
}

/**
  base on prefix , such as "emailmsg, successmsg, failuremsg", to get CHAT oo run configuration message.

  @param km_id   the related km document id
  @param oo_flow_uuid  the active oo flow uuid for this km document
  @param lang  which language you want to get for this message, such as "en", "Zh-hans" etc.
  @param prefix such as "emailmsg, successmsg, failuremsg"
**/
function getConfigurationMessage(km_id, oo_flow_uuid, lang, prefix) {
    /**
      example messagid:
      sdchatoorunconfig;KM0585;4865855e-564b-4992-9b7a-dbc11e26f2bfemailmsg
    **/
    var msgId = "sdchatoorunconfig" + ";" + km_id + ";" + oo_flow_uuid + prefix;
    var message = new SCFile("scmessage", SCFILE_READONLY);
    var sql = "syslanguage=\"" + lang + "\" and class=\"" + "local:sdchatoorunconfig" + "\" and message.id=\"" + msgId + "\"";
    if (message.doSelect(sql) == RC_SUCCESS) {
        var msg = message.message;
        return msg;
    }

    //default value
    return "";
}

function getEmailNotificationTemplate(km_id, oo_flow_uuid, lang, task_status) {
    /**
      example messagid:
      sdchatoorunconfig;KM0585;4865855e-564b-4992-9b7a-dbc11e26f2bfemailmsg
      sdchatoorunconfig;KM0585;4865855e-564b-4992-9b7a-dbc11e26f2bffailuremsg
    **/

    var prefix = "";
    if (task_status === null || task_status === undefined) {
        return scmsg(4, "sdchatoorunconfig");
    } else if (task_status === "finished-error") {
        prefix = "failuremsg";
    } else if (task_status === "finished-success") {
        prefix = "emailmsg";
    }

    var message = getConfigurationMessage(km_id, oo_flow_uuid, lang, prefix);
    if (message != "") {
        return message;
    }

    return scmsg(4, "sdchatoorunconfig");
}

/**
 Sample message template is :"OK Message , random number: {{flowOutput.RandomResult}}"

 Sample HPOO Run response body:

 {
  \"executionSummary\":
     {
       \"executionId\":\"198600296\",
       \"branchId\":null,
       \"startTime\":1467773580510,
       \"endTime\":1467773582230,
       \"status\":\"COMPLETED\",
       \"resultStatusType\":\"RESOLVED\",
       \"resultStatusName\":\"success\",
       \"pauseReason\":null,
       \"owner\":\"admin\",
       \"triggeredBy\":\"admin\",
       \"flowUuid\":\"06fe8531-868b-4e79-aa7a-13a5e30a66ec\",
       \"flowPath\":\"Library/Utility Operations/Samples/Generate Random Number.xml\",
       \"executionName\":\"Generate Random Number\",
       \"branchesCount\":0,\"roi\":0
     },
   \"executionLogLevel\":\"DEBUG\",
   \"flowInputs\":{},
   \"flowVars\":
      [
        {\"name\":\"min\",\"termName\":null,\"value\":\"1\"},
        {\"name\":\"max\",\"termName\":null,\"value\":\"2\"}
      ],
  \"flowOutput\":
     {
      \"Result\":\"\",
      \"RandomResult\":\"9\"
     }
 }

**/

function getReponseMesage(msgTemplate, runResponse) {
    if (runResponse != null) {
        var tagLeft = "{{";
        var tagRight = "}}";
        var msgbody = msgTemplate;
        var positions = [];

        var pos = msgTemplate.indexOf(tagLeft);
        while (pos > -1) {
            positions.push(pos);
            pos = msgTemplate.indexOf(tagLeft, pos + 1);
        }
        var keyValue = "";
        var i;
        for (i = 0; i < positions.length; i++) {
            var restpart = msgTemplate.substr(positions[i]);
            var end = restpart.indexOf(tagRight);
            var key = msgTemplate.substr(positions[i] + tagLeft.length, end - tagRight.length);
            var tkey = translateLocator(key);
            if (tkey != null) {
                var evalStr = "";
                try {
                    evalStr = "var keyValue=runResponse" + tkey;
                    eval(evalStr);

                    if (keyValue == undefined) {
                        keyValue = "";
                        _log.error("meet error when perform Eval str:" + evalStr + "exception :" + "key:" + key + " is not defined, please verify!");
                    }
                } catch (e) {
                    _log.error("meet error when perform Eval str:" + evalStr + "exception :" + e.toString());
                }


                msgbody = msgbody.replace(tagLeft + key + tagRight, keyValue);
            }
        }
        return {
            "result": "SUCCESS",
            "message": "" + msgbody + ""
        };
    } else {
        return {
            "result": "SUCCESS",
            "message": "" + msgTemplate + ""
        };
    }
}

/**
  re-format, runResponse.flowOutput.RandomResult ==> runResponse["flowOutput"]["RandomResult"]  
**/
function translateLocator(originalLocator) {
    if (originalLocator == null || originalLocator == undefined) {
        return null;
    }

    var nodes = originalLocator.split(".");
    var ret = "";
    var i;
    for (i = 0; i < nodes.length; i++) {
        ret = ret + "[\"" + nodes[i] + "\"]";
    }
    return ret;
}

/**
  generate a schedule record to call 'invokeOOFlow' function
  
  @param runtaskid, it is the 'id' field of sdchatooruntask table.
**/
function generateExecuteSchedule(runtaskid) {
    var schedule = new SCFile("schedule");
    var schedulename = "EndUserChatAutomationRunTaskSchedule_" + runtaskid;

    schedule._class = "linker";
    var time = new Date();
    var sched = new Date(time.getTime());
    schedule.expiration = sched;

    schedule.name = schedulename;

    var JSStr = "lib.EndUserChatAutomation.invokeOOFlow(\"" + runtaskid + "\");";
    schedule.javascript = JSStr;

    if (schedule.doSave() == RC_SUCCESS) {
        return {
            "runresult": true,
            "runresponse": null
        };
    } else {
        return {
            "runresult": false,
            "runresponse": null
        };
    }
}

/**
  call 'execute' function to invoke OO api to run oo flow
  OO flow input parameter is read from sdchatooruntask record.

  @param runtaskid, it is the 'id' field of sdchatooruntask table.
**/
function invokeOOFlow(runtaskid) {
    var sql = "id=\"" + runtaskid + "\"";

    var ret;

    var ooruntask = new SCFile("sdchatooruntask", SCFILE_READONLY);
    if (ooruntask.doSelect(sql) === RC_SUCCESS) {
        var config = strToJson(ooruntask['run.config']);

        var paraList = [];
        var valueList = [];

        var parameters = config['parameters'];
        var i;
        for (i = 0; i < parameters.length; i++) {

            var parameter = parameters[i];
            //print("=======>;" + parameter['id'] + ","  + parameter['value']); 
            paraList.push(parameter['id']);
            valueList.push(parameter['value']);
        }

        var isAsync = true;

        if (config['runmode'] === 'async') {
            isAsync = true;
        } else {
            isAsync = false;
        }
        ret = execute(config['flowid'], paraList, valueList, isAsync, runtaskid);
    }

    return ret;
}

/**
  invoke OO api to run oo flow by given parameter and run mode(async/sync)
  sometime , when you give the wrong mode (sync) to run a OO flow, and OO flow
  sometime take time to finish, the doHTTPGetRequest will met 'read timeout ' error.
  at this time, you should run this flow by async mode to get reponse with 'runid'.

  if run oo flow by async, it will generate another schedule to retrieve run result by 'runid'
  otherwrise, SM will try to analyst the run result now. 
  
  @param runtaskid, it is the 'id' field of sdchatooruntask table.
  @param paraList, oo flow input parameter name list.
  @param valueList, oo flow input parameter value list.
  @param isAsync, boolean, run oo flow via async or sync mode.
  @param uuid, UUID of OO flow you want run.

**/
function execute(uuid, paramList, valueList, isAsync, runtaskid) {
    //var ret=false;
    var ret = {
        "runresult": false,
        "runresponse": null
    };

    var sql = "id=\"" + runtaskid + "\"";
    var ooruntask;

    try {
        var runId = lib.SMOOHttpRequest.doExecute(uuid, paramList, valueList);

        ooruntask = new SCFile("sdchatooruntask");

        if (ooruntask.doSelect(sql) === RC_SUCCESS) {
            ooruntask['run.id'] = runId;
            ooruntask['task.status'] = "running";
            ooruntask.doSave();
        }

        if (isAsync) {
            generateScheduleToAnalystOOFlowResult(runId, runtaskid);
            ret.runresult = true;
        } else {
            funcs.sleep(1);
            var response = getOOFlowExecuteStatus(runId, true);
            ret.runresponse = response;
            ret.runresult = analystOOFlowResult(response, runtaskid, runId, isAsync);
        }
    } catch (ex) {
        var errorMsg = scmsg(8, "smoo", [ex.toString()]);
        _log.error("OO Flow:" + ": " + errorMsg + "exception:" + ex.toString());

        ooruntask = new SCFile("sdchatooruntask");

        if (ooruntask.doSelect(sql) === RC_SUCCESS) {
            ooruntask['run.result'] = ex.toString();
            ooruntask['run.id'] = runId;
            ooruntask['task.status'] = "finished-error";
            ooruntask.doSave();

            var desarray = [];
            desarray[0] = "Meet Exception:";
            desarray[1] = "Exception: " + ex.toString();
            desarray[2] = "======================================================================";
            lib.SMOOHttpRequest.addActivityLogOld(desarray, ooruntask["chat.sessionid"], getRecipientBySdchatId(ooruntask["chat.sessionid"]), "sdchat");
        }
    }

    return ret;
}

/**
  try analyst oo flow result. if the oo flow still running, it will 
  generate another record to retrive this run result later again. 
  until the oo flow finished with 'success' or 'error'

  @param response, json format response return by OO central
  @param runid, retrun from OO central to unique identify one time OO flow run.
  @param runtaskid, the record id in SDCHATOORUNTASK
  @param isAsync, invoke mode of OO flow, async / sync

**/
function analystOOFlowResult(response, runtaskid, runid, isAsync) {
    var resSummary = response.executionSummary;
    var status = resSummary.status;
    var resultStatusType = resSummary.resultStatusType;
    var resultStatusName = resSummary.resultStatusName;

    var ooruntask = new SCFile("sdchatooruntask");
    var sql = "id=\"" + runtaskid + "\"";

    if (_log.isDebugEnabled()) {
        _log.debug("analystOOFlowResult==>" + sql);
    }

    if (ooruntask.doSelect(sql) === RC_SUCCESS) {
        if (status == "COMPLETED" && resultStatusType == "RESOLVED" && resultStatusName == "success") {
            _log.info("get oo flow success finished: runid: " + runid + " runtaskid:" + runtaskid);
            ooruntask['run.result'] = JSON.stringify(response);
            ooruntask['run.id'] = runid;
            ooruntask['task.status'] = "finished-success";
            ooruntask.doSave();

            if (isAsync) {
                sendNotificationEmail(ooruntask);
            }

            addFinishedRunActivitylog(ooruntask, response);
            return true;
        } else if ((status == "COMPLETED" && resultStatusType == "ERROR" && resultStatusName == "failure") || (status == "SYSTEM_FAILURE")) {
            _log.info("get oo flow error finished: runid: " + runid + " runtaskid:" + runtaskid);
            ooruntask['run.result'] = JSON.stringify(response);
            ooruntask['run.id'] = runid;
            ooruntask['task.status'] = "finished-error";
            ooruntask.doSave();
            if (isAsync) {
                sendNotificationEmail(ooruntask);
            }

            addFinishedRunActivitylog(ooruntask, response);
            return false;
        } else {
            if (isAsync) {
                _log.info("OO flow not finished yet, re-schedule analyst result==>" + runtaskid + "," + runid);
                //refreshScheduleTask(runid, runtaskid);
                generateScheduleToAnalystOOFlowResult(runid, runtaskid);
            }
            return true;
        }
    }

    return false;
}

function addFinishedRunActivitylog(runtask, ooResponse) {
    var url = lib.SMOOHttpRequest.getBaseUrl();

    var runid = ooResponse["executionSummary"]["executionId"];
    var flowPath = ooResponse["executionSummary"]["flowPath"];
    var ooflowDN = url + flowPath;
    var reportLink = url + "/oo/#/runtimeWorkspace/runs/" + runid;

    var desarray = lib.SMOOUtil.activityDescription(ooflowDN, runid, reportLink, ooResponse["executionSummary"]);

    lib.SMOOHttpRequest.addActivityLogOld(desarray, runtask["chat.sessionid"], getRecipientBySdchatId(runtask["chat.sessionid"]), "sdchat");
}

/**
  send notification email when OO run task is finished and the end user invoke it via async mode.
**/
function sendNotificationEmail(oo_run_task) {
    callrad("us.notify", ["name", "record"], ["SDChat Knowledge document automation run result", oo_run_task]);
}

function getRecipientBySdchatId(sdchat_id) {
    var sql = "number=\"" + sdchat_id + "\"";
    var sdchat = new SCFile("sdchat", SCFILE_READONLY);
    if (sdchat.doSelect(sql) === RC_SUCCESS) {
        return getOperatorIDByContactname(sdchat["contact"]);
    } else {
        _log.error("Get recipient by sdchatid:" + sdchat_id + " failed, please confirm the sdchat record is existing!");
    }

    return "";
}

function getOperatorIDByContactname(contactname) {
    var sql = "contact.name=\"" + contactname + "\"";
    var contacts = new SCFile("contacts", SCFILE_READONLY);
    if (contacts.doSelect(sql) === RC_SUCCESS) {
        return contacts["operator.id"];
    } else {
        return "";
    }
}


function refreshScheduleTask(runid, runtaskid) {
    var schedule = new SCFile("schedule");
    var schedulename = "EndUserChatAutomationRunTaskCheckResult_Schedule_" + runtaskid + "_" + runid;
    if (_log.isDebugEnabled()) {
        _log.debug("refresh schedule : " + schedulename);
    }
    var sql = "name=\"" + schedulename + "\"";

    if (schedule.doSelect(sql) === RC_SUCCESS) {
        schedule.doDelete();
        generateScheduleToAnalystOOFlowResult(runid, runtaskid);
    }
}

/**
  generate a schedule to handle the analyst of oo flow run result
**/
function generateScheduleToAnalystOOFlowResult(runid, runtaskid) {
    var schedule = new SCFile("schedule");
    var schedulename = "EndUserChatAutomationRunTaskCheckResult_Schedule_" + runtaskid + "_" + runid;
    if (_log.isDebugEnabled()) {
        _log.debug("generateScheduleToAnalystOOFlowResult : " + schedulename);
    }

    schedule._class = "linker";
    var time = new Date();
    var sched = new Date(time.getTime());
    schedule.expiration = sched;
    schedule.name = schedulename;
    var JSStr = "lib.EndUserChatAutomation.analystOOFlowResult(lib.EndUserChatAutomation.getOOFlowExecuteStatus(\"" + runid + "\"), \"" + runtaskid + "\", \"" + runid + "\", true);";
    schedule.javascript = JSStr;
    if (schedule.doSave() == RC_SUCCESS) {
        return true;
    } else {
        return false;
    }
}

function getAutomationRunTaskId() {
    var newid = new Datum();
    var rcode = new Datum();
    rcode = funcs.rtecall("getnumber", rcode, newid, "EndUserChatAutomationRunTask");
    return newid.getText();
}

function isChatAutomationEnable(kmid) {
    if (!funcs.nullsub(vars["$G.system.info"]["SMOO"], false)) {
        return false;
    }

    var sql = "active=true and number=\"" + kmid + "\"";
    var oorunconfig = new SCFile("sdchatoorunconfig", SCFILE_READONLY);
    if (oorunconfig.doSelect(sql) === RC_SUCCESS) {
        return true;
    }
    return false;
}

/**
Here is the example of getOORunConfig reponse body

  {
      "parameters":       
      [
        {
            "id": "max",
            "label": "max",
            "value": "",
            "mandatory": false,
            "secure": false,
            "displayType": "text"
         },
         {
            "id": "min",
            "label": "min",
            "value": "",
            "mandatory": false,
            "secure": false,
            "displayType": "text"
         }
      ],
      "runmode": "sync",
      "flowid": "4865855e-564b-4992-9b7a-dbc11e26f2bf",
      "kmid": "KM0585",
      "chatsessionid": "SDC10001"
   },
   "kmid": "KM0585",
   "attachments": ""
}
**/
function getOORunConfig(lan, user, kmid, oo_flow_uuid) {
    var lg = getLang(lan);
    var result = {};
    var forms;
    var sql = "active=true and number=\"" + kmid + "\"";

    if (oo_flow_uuid != null && oo_flow_uuid != undefined) {
        sql = sql + " and oo.flow.uuid=\"" + oo_flow_uuid + "\"";
    }

    var oorunconfig = new SCFile("sdchatoorunconfig", SCFILE_READONLY);
    if (oorunconfig.doSelect(sql) === RC_SUCCESS) {
        forms = oorunconfig['oo.parameters'].toArray();
        var ret = [];
        var i;
        var f;
        for (i = 0; i < forms.length; i++) {
            if (!_null(forms[i])) {
                f = strToJson(forms[i]);
                if (f != undefined) {
                    f['label'] = getTargetLanguageLabel(oorunconfig, oorunconfig["oo.flow.uuid"] + f['para.id'], f['para.label'], lg);
                    forms[i] = f;

                    var row = {};
                    row['id'] = f['para.id'];
                    row['label'] = f['label'];
                    row['value'] = "";
                    row['secure'] = f['para.secure'];
                    row['displayType'] = f['para.displaytype'];
                    row['mandatory'] = f['para.required'];

                    ret.push(row);
                }
            }
        }
        result['parameters'] = ret;
        result['runmode'] = oorunconfig['oo.run.mode'];

        //result['msgs']=getTargetLanguageLabel(oorunconfig, oorunconfig["oo.flow.uuid"] + "successmsg", record["message.success"], lg);   
        //result['msgf']=getTargetLanguageLabel(oorunconfig, oorunconfig["oo.flow.uuid"] + "failuremsg", record["message.failure"], lg);  

        result['flowid'] = oorunconfig['oo.flow.uuid'];
        result['kmid'] = kmid;
        result['chatsessionid'] = "";
    }

    return result;
}

function displayPrechatConfig(record) {
    var rows = record['oo.parameters'];

    vars['$para.ids'] = $.createSCArray();
    vars['$para.labels'] = $.createSCArray();
    vars['$para.displaytypes'] = $.createSCArray();
    vars['$para.secures'] = $.createSCArray();
    vars['$para.requires'] = $.createSCArray();

    var i;
    var f;
    var length = rows.length();
    for (i = 0; i < length; i++) {
        if (!_null(rows[i])) {
            f = strToJson(rows[i]);
            if (f != undefined) {
                vars['$para.ids'].push(f['para.id']);
                vars['$para.labels'].push(getLocalizedLabel(record, record["oo.flow.uuid"] + f['para.id'], f['para.label']));
                vars['$para.displaytypes'].push(f['para.displaytype']);
                vars['$para.secures'].push(f['para.secure']);
                vars['$para.requires'].push(f['para.required']);
            }
        }
    }

    record["message.success"] = getLocalizedLabel(record, record["oo.flow.uuid"] + "successmsg", record["message.success"]);
    record["message.failure"] = getLocalizedLabel(record, record["oo.flow.uuid"] + "failuremsg", record["message.failure"]);
    record["email.message.template"] = getLocalizedLabel(record, record["oo.flow.uuid"] + "emailmsg", record["email.message.template"]);
}

function moveField(record, currentPosition, targetPosition) {
    var prechatForms = record['oo.parameters'].toArray();
    var lng = prechatForms.length;
    if (lng > 0) {
        var acp = currentPosition - 1;
        var atp = targetPosition - 1;
        if (atp >= 0 && atp < lng) {
            var tmpTargetElement = prechatForms[atp];
            prechatForms[atp] = prechatForms[acp];
            prechatForms[acp] = tmpTargetElement;
            record['oo.parameters'] = prechatForms;
            record.doSave();
            displayPrechatConfig(record);
            cursor_field_name_set("$para.ids", targetPosition);
        } else if (atp < 0) {
            cursor_field_name_set("$para.ids", 1);
        } else if (atp >= lng) {
            cursor_field_name_set("$para.ids", lng);
        }
    }
}

function configPrechat(record, action, lineNumber) {
    var customField = {
        "para.id": "",
        "para.label": "",
        "para.displaytype": "",
        "para.secure": false,
        "para.value": "",
        "para.required": false
    };

    customField['para.id'] = vars['$para.id'];
    customField['para.label'] = vars['$para.label'];
    customField['para.displaytype'] = vars['$para.displaytype'];
    customField['para.secure'] = vars['$para.secure'];
    customField['para.required'] = vars['$para.required'];

    if (action == "add") {
        record['oo.parameters'].push(JSON.stringify(customField));

    } else {
        var prechatForms = record['oo.parameters'].toArray();
        if (action == "edit") {
            prechatForms.splice((lineNumber - 1), 1, JSON.stringify(customField));
        } else {
            prechatForms.splice((lineNumber - 1), 1);
        }
        record['oo.parameters'] = denull(prechatForms);
    }
    record["active"] = true;
    record.doSave();
    displayPrechatConfig(record);
}

function editConfig(record, selectedField) {
    var forms = record['oo.parameters'];
    var i;
    var f;
    var length = forms.length();
    for (i = 0; i < length; i++) {
        if (!_null(forms[i])) {
            f = strToJson(forms[i]);
            if (f['para.id'] == selectedField) {
                vars['$para.id'] = f['para.id'];
                vars['$para.label'] = f['para.label'];
                vars['$para.displaytype'] = f['para.displaytype'];
                vars['$para.secure'] = f['para.secure'];
                vars['$para.required'] = f['para.required'];
                break;
            }
        }
    }
}

function getUuidByFlowPath(km_id, oo_flow_path) {
    var linkFile = new SCFile("OOFlowLinks", SCFILE_READONLY);
    linkFile.setFields("OOFlow.uuid");
    var sql = "number = \"" + km_id + "\" and OOFlow.path = \"" + oo_flow_path + "\" and type = \"" + "kmdocument" + "\"";

    var rc = linkFile.doSelect(sql);
    if (rc == RC_SUCCESS) {
        return linkFile["OOFlow.uuid"];
    } else {
        return null;
    }
}

function getAction(km_id, oo_flow_uuid) {
    var ret = "add"; // no found, Add Config
    var ooRunConfigFile = new SCFile("sdchatoorunconfig", SCFILE_READONLY);
    ooRunConfigFile.setFields(["oo.flow.uuid", "active"]);
    var sql1 = "number = \"" + km_id + "\"";

    var rc = ooRunConfigFile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        ret = "replace"; // found but config data is not related to this oo flow uuid, Replace Config
        if (ooRunConfigFile["oo.flow.uuid"] === oo_flow_uuid) {
            if (ooRunConfigFile["active"] === true) {
                ret = "edit"; // found and config data is related to this oo flow uuid, Modify Config
            } else {
                ret = "reactive"; //end user has configured this oo flow before but disabled, and now user want it back
            }
            break;
        }
        rc = ooRunConfigFile.getNext();
    }

    return ret;
}

function isSameOOParameters(kmid, FlowUUID) {
    var ret = true;
    var chatconfigs = getOORunConfig("en", "falcon", kmid, FlowUUID);
    var oolinkconfigs = initConfigFile("add", kmid, FlowUUID);

    if (chatconfigs != null && oolinkconfigs != null) {
        //{"id":"min","security":"false","mandtory":true},
        //JS Array
        chatconfigs = chatconfigs["parameters"];

        //{"para.id":"","para.secure":isSec, "para.required":false};
        //SC Array
        oolinkconfigs = oolinkconfigs["oo.parameters"];
    }

    if ((chatconfigs == null && oolinkconfigs != null) || (chatconfigs != null && oolinkconfigs == null)) {
        return true;
    }
    if (chatconfigs.length != oolinkconfigs.length()) {
        return false;
    } else {
        var len = chatconfigs.length;
        var i;
        for (i = 0; i < len; i++) {
            var chatconfig = chatconfigs[i];
            var same = false;
            var j;
            for (j = 0; j < len; j++) {
                var oolinkconfig = strToJson(oolinkconfigs[j]);
                if (chatconfig['id'] === oolinkconfig['para.id'] &&
                    chatconfig['secure'] === oolinkconfig['para.secure'] &&
                    chatconfig['mandatory'] === oolinkconfig['para.required']) {
                    same = true;
                    break;
                }
            }

            if (!same) {
                return false;
            }
        }
    }

    return ret;
}

function checkConfig(km_id, oo_flow_uuid) {
    var isSame = isSameOOParameters(km_id, oo_flow_uuid);

    if (!isSame) {
        print(scmsg(3, "sdchatoorunconfig"));
    }
}

function initConfigFile(action, km_id, oo_flow_uuid) {
    var configFile = new SCFile("sdchatoorunconfig");

    configFile["number"] = km_id;
    configFile["active"] = true;

    if (action === "add" || action === "replace") {
        configFile["oo.flow.uuid"] = oo_flow_uuid;
        configFile["oo.run.mode"] = "sync";
    }

    var paras = null;
    var senparas = null;
    var oolink = new SCFile("OOFlowLinks", SCFILE_READONLY);
    oolink.setFields(["paras", "senparas"]);
    var sql = "OOFlow.uuid=\"" + oo_flow_uuid + "\" and number= \"" + km_id + "\"";
    var rc = oolink.doSelect(sql);
    if (rc == RC_SUCCESS) {
        paras = oolink["paras"];
        senparas = oolink["senparas"];
    }

    if (paras != null) {
        initParas2StrOOLink(configFile, paras, false, "");
    }
    if (senparas != null) {
        initParas2StrOOLink(configFile, senparas, true, "sen");
    }

    return configFile;
}

function initParas2StrOOLink(record, paras, isSec, fieldNamePrefix) {
    record['oo.parameters'] = denull(record['oo.parameters']);
    var i;
    var length = paras.length();
    for (i = 0; i < length; i++) {
        var customField = {
            "para.id": "",
            "para.label": "",
            "para.displaytype": "",
            "para.secure": isSec,
            "para.required": false
        };
        if (paras[i][fieldNamePrefix + "para.name"] == null) {
            continue;
        }

        customField['para.id'] = paras[i][fieldNamePrefix + "para.name"];
        customField['para.label'] = paras[i][fieldNamePrefix + "para.name"];
        customField['para.displaytype'] = "text";
        customField['para.required'] = paras[i][fieldNamePrefix + "para.required"];
        record['oo.parameters'].push(JSON.stringify(customField));
    }
}

function initParas2Str(record, paras) {
    record['oo.parameters'] = denull(record['oo.parameters']);

    var i;
    var length = paras.length();
    for (i = 0; i < length; i++) {
        var customField = {
            "para.id": "",
            "para.label": "",
            "para.displaytype": "",
            "para.secure": false,
            "para.required": false
        };
        customField['para.id'] = paras[i]["para.name"];
        customField['para.label'] = paras[i]["para.name"];
        customField['para.displaytype'] = "text";
        customField['para.secure'] = paras[i]["para.sensitive"];
        customField['para.required'] = paras[i]["para.required"];

        record['oo.parameters'].push(JSON.stringify(customField));
    }
}

function disableConfig(km_id) {
    var ooRunConfigFile = new SCFile("sdchatoorunconfig");
    var sql1 = "number = \"" + km_id + "\"";

    var rc = ooRunConfigFile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        ooRunConfigFile["active"] = false;
        ooRunConfigFile.doUpdate();

        rc = ooRunConfigFile.getNext();
    }

    var kmlinkfile = new SCFile("OOFlowLinks");
    sql1 = "number = \"" + km_id + "\"";

    rc = kmlinkfile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        kmlinkfile["chatRunActive"] = false;
        kmlinkfile.doUpdate();

        rc = kmlinkfile.getNext();
    }
}


function enableConfig(km_id, ooflow_uuid) {
    var ooRunConfigFile = new SCFile("sdchatoorunconfig");
    var sql1 = "number = \"" + km_id + "\" and oo.flow.uuid=\"" + ooflow_uuid + "\"";

    var rc = ooRunConfigFile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        ooRunConfigFile["active"] = true;
        ooRunConfigFile.doUpdate();

        rc = ooRunConfigFile.getNext();
    }

    var kmlinkfile = new SCFile("OOFlowLinks");
    sql1 = "number = \"" + km_id + "\" and OOFlow.uuid=\"" + ooflow_uuid + "\"";

    rc = kmlinkfile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        kmlinkfile["chatRunActive"] = true;
        kmlinkfile.doUpdate();

        rc = kmlinkfile.getNext();
    }
}

function cleanUpRunActive(km_id, ooflow_uuid) {
    var kmlinkfile = new SCFile("OOFlowLinks");
    var sql1 = "number = \"" + km_id + "\" and OOFlow.uuid=\"" + ooflow_uuid + "\"";

    var rc = kmlinkfile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        kmlinkfile["chatRunActive"] = false;
        kmlinkfile.doUpdate();

        rc = kmlinkfile.getNext();
    }
}

function cleanUpRunConfig(km_id, ooflow_uuid) {
    var ooRunConfigFile = new SCFile("sdchatoorunconfig");
    var sql1 = "number = \"" + km_id + "\" and oo.flow.uuid=\"" + ooflow_uuid + "\"";

    var rc = ooRunConfigFile.doSelect(sql1);
    while (rc == RC_SUCCESS) {
        ooRunConfigFile.doDelete();
        rc = ooRunConfigFile.getNext();
    }
}

function cleanUpConfigScmessage(km_id, ooflow_uuid) {
    //sdchatoorunconfig;KM0626;06fe8531-868b-4e79-aa7a-13a5e30a66ecfailuremsg
    var scmsgfile = new SCFile("scmessage");
    var sql2 = "message.id#\"" + "sdchatoorunconfig;" + km_id + ";" + ooflow_uuid + "\"";
    var rc = scmsgfile.doSelect(sql2);
    while (rc == RC_SUCCESS) {
        scmsgfile.doDelete();
        rc = scmsgfile.getNext();
    }
}

function addLocalizedLabeAfterAdd(file) {
    var rows = file['oo.parameters'];
    var i;
    var f;
    var length = rows.length();
    for (i = 0; i < length; i++) {
        if (!_null(rows[i])) {
            f = strToJson(rows[i]);
            if (f != undefined) {
                lib.EndUserChat.localizeLabel(file, file["oo.flow.uuid"] + f['para.id'], f['para.label']);
            }
        }
    }
    lib.EndUserChat.localizeLabel(file, file["oo.flow.uuid"] + "successmsg", file["message.success"]);
    lib.EndUserChat.localizeLabel(file, file["oo.flow.uuid"] + "failuremsg", file["message.failure"]);
    lib.EndUserChat.localizeLabel(file, file["oo.flow.uuid"] + "emailmsg", file["email.message.template"]);
}


function getTargetLanguageLabel(record, idFieldValue, textFieldValue, lan) {
    var msg = textFieldValue;
    var msgId = getMsgId(record, idFieldValue);

    var cls = "local:" + getFilename(record);
    var message = new SCFile("scmessage", SCFILE_READONLY);
    var sql = "syslanguage=\"" + lan + "\" and class=\"" + cls + "\" and message.id=\"" + msgId + "\"";
    if (message.doSelect(sql) == RC_SUCCESS) {
        msg = message.message;
    }
    return msg;
}


function setOOParameterInfo(km_view, km_file) {
    var regularstr = '<span id="ooparades"></span>';
    var replacestr = "";
    if (funcs.nullsub(vars["$G.system.info"]["SMOO"], false)) {
        var sql = "active=true and number=\"" + km_file["id"] + "\"";
        var oorunconfig = new SCFile("sdchatoorunconfig", SCFILE_READONLY);
        if (oorunconfig.doSelect(sql) === RC_SUCCESS) {
            var sql1 = "uuid=\"" + oorunconfig["oo.flow.uuid"] + "\"";
            var ooflow = new SCFile("OOFlow", SCFILE_READONLY);
            if (ooflow.doSelect(sql1) === RC_SUCCESS) {
                replacestr = ooflow["description"];
                if (replacestr != null) {
                    replacestr = replacestr.replace(/<pre>/g, "<br/>");
                    replacestr = replacestr.replace(/<\/pre>/g, "<br/>");
                    replacestr = replacestr.replace(/\n/g, "<br/>");
                    return km_view.replace(regularstr, "<div class=\"formSectionHeading\">" + scmsg("ooparades", "sdchatoorunconfig") + "</div><p>" + replacestr + "</p>");
                }
            }
        }
    }

    return km_view.replace("${{ooparades}}", "");
}