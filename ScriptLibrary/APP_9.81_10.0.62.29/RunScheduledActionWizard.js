var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var scmsg = system.functions.scmsg;
var msg = system.functions.msg;
var val = system.functions.val;
var cursor_field_name_set = system.functions.cursor_field_name_set;
var getRuleSetsByTable = lib.RunActionWizard.getRuleSetsByTable;
var getWorkflowsByTable = lib.RunActionWizard.getWorkflowsByTable;
var getBackendTransitionsByTable = lib.RunActionWizard.getBackendTransitionsByTable;
var getElement = lib.xmlHelpers.getElement;
var getRadQueryFromCondtionXml = lib.conditionXmlParser.getRadQueryFromCondtionXml;

var msgCls = "local:runAction";

function getDateTimeFields(filename) {
  var dateFields = [];

  var dbdict = $(filename).dbdict();
  var datadict = $("datadict").select('name="' + filename + '"').uniqueResult();
  var setting = $("settings").select('name="Condition Editor"').uniqueResult();
  var settingIds = setting["settingId"];
  var settingValues = setting["settingValue"];
  var displaySystemfields = false;
  var displayDeprecatedfields = false;
  for (var i = 0, iLoopTimes = settingIds.length(); i < iLoopTimes; i++) {
    var settingId = settingIds[i];
    if ("display.systemfields" == settingId) {
      displaySystemfields = (settingValues[i] == "true");
    }
    if ("display.deprecatedfields" == settingId) {
      displayDeprecatedfields = (settingValues[i] == "true");
    }
  }

  if (dbdict != null) {
    var allFields = dbdict["field"];
    for (var i = 0, iLoopTimes = allFields.length(); i < iLoopTimes; i++) {
      var field = allFields[i];
      if (field["type"] == $.Datetime) {
        var name = field["name"];
        var caption = field["caption"];
        if (datadict != null) {
          var datadictFields = datadict["fields"];
          var datadictCaptions = datadict["captions"];
          var datadictTypes = datadict["sysFieldType"];
          var idx = $.indexOf(datadictFields, name);
          if (idx != -1) {
            var datadictType = datadictTypes[idx];
            // skip system fields
            if (datadictType == 1 && !displaySystemfields) {
              continue;
            }

            // skip deprecated fields
            if (datadictType == 4 && !displayDeprecatedfields) {
              continue;
            }

            caption = datadictCaptions[idx];
            var captionStr = scmsg(caption, "sccaption");
            if (captionStr.indexOf("Could not be found") == -1) {
              caption = captionStr;
            }

            dateFields.push({
              value: name,
              disp: caption
            });
          }
        }
      }
    }
  }

  if (dateFields.length > 0) {
    dateFields = _.sortBy(dateFields, "disp");
  }
  return dateFields;
}

function parseRuleXML(xmlString) {
  var xml = new XML();
  xml.setContent(xmlString);
  var calcType = getElement(xml, "calcType");
  var calcField = getElement(xml, "calcField");
  var calcInterval = getElement(xml, "calcInterval");
  var calcScript = getElement(xml, "calcScript");
  var actionCondition = getElement(xml, "actionCondition");
  var actionConditionXml = getElement(xml, "actionConditionXml");
  var rulesetName = getElement(xml, "rulesetName");
  var action = getElement(xml, "action");

  if (calcType != null) {
    calcType = parseInt(calcType.getValue());
  } else {
    // default to related records
    calcType = 1;
  }
  if (calcField != null) {
    calcField = calcField.getValue();
  } else {
    calcField = "";
  }
  if (calcInterval != null) {
    calcInterval = calcInterval.getValue();
    
  } else {
    calcInterval = "";
  }
  if (calcScript != null) {
    calcScript = calcScript.getValue();
  } else {
    calcScript = "";
  }
  if (actionCondition != null) {
    actionCondition = actionCondition.getValue();
  } else {
    actionCondition = "";
  }
  if (actionConditionXml != null) {
    actionConditionXml = actionConditionXml.getValue();
  } else {
    actionConditionXml = "";
  }
  if (rulesetName != null) {
    rulesetName = rulesetName.getValue();
  } else {
    rulesetName = "";
  }
  if (action != null) {
    action = action.getValue();
  } else {
    // default to save
    action = "1";
  }

  return {
    calcType: calcType,
    calcField: calcField,
    calcInterval: calcInterval,
    calcScript: calcScript,
    actionCondition: actionCondition,
    actionConditionXml: actionConditionXml,
    rulesetName: rulesetName,
    action: action
  };

}

/**
 * Parse the rule JSON.
 *
 * @param {string}
 *          jsonString - the JSON string.
 * @return {object}.
 */
function parseRuleJSON(jsonString) {
  var JSON = system.library.JSON.json();
  var jsonObj = JSON.parse(jsonString);
  if (jsonObj.calcType!=null && jsonObj.calcType!="") {
    jsonObj.calcType = parseInt(jsonObj.calcType);
  } else {
    // default to related records
    jsonObj.calcType = 1;
  }

  return jsonObj;
}

var BaseRuleSetOKOnlyWizard = lib.BaseRuleSetOKOnlyWizard.getClass();
var RunScheduledActionWizard = $(
        BaseRuleSetOKOnlyWizard,
        {
          calcType: 1,
          calcField: "",
          calcInterval: "2 00:00:00",
          calcScript: "",
          actionConditionDesc: "",
          actionConditionXml: "",
          rulesetName: "",
          action: "1",

          // constructor
          init: function init(request) {
            this._super.apply(this, arguments);
            this.calcType = request.getParameter("$L.calc.type");
            this.calcField = request.getParameter("$L.calc.field");
            this.calcInterval = request.getParameter("$L.calc.interval");
            this.calcScript = request.getParameter("$L.calc.script");
            this.actionConditionDesc = request
                    .getParameter("$L.actionCondition.desc");
            this.actionConditionXml = request
                    .getParameter("$L.actionCondition.xml");
            this.rulesetName = request.getParameter("$L.ruleset.name");
            this.action = request.getParameter("$L.btAction");
          },

          /**
           * @protected
           */
          getTitle: function getTitle(request) {
            return scmsg(63, "ruleset");
          },

          /**
           * @protected
           */
          getMainTitle: function getMainTitle(request) {
            return scmsg(105, "ruleset");
          },

          /**
           * @protected
           */
          getPrompt: function getPrompt(request) {
            return scmsg("description2", msgCls);
          },

          /**
           * @protected
           */
          getSubFormat: function getSubFormat(request) {
            return "RuleSet.runScheduledAction";
          },

          /**
           * @protected
           */
          setResult: function setResult(request) {
            this._super.apply(this, arguments);

            // used for auto complete
            var formatName = "wizard.js.okonly";
            var format = $("format").select('name="' + formatName + '"')
                    .uniqueResult();
            format["name"] = "wizard-RuleSet.runAction";
            request.setAttribute("$L.format", format);

            request.setAttribute("$L.calc.type", this.calcType);
            request.setAttribute("$L.calc.field", this.calcField);
            request.setAttribute("$L.calc.interval", this.calcInterval);
            request.setAttribute("$L.calc.script", this.calcScript);
            request.setAttribute("$L.ruleset.name", this.rulesetName);
            request.setAttribute("$L.btAction", this.action);
            request.setAttribute("$L.actionCondition.xml",
                    this.actionConditionXml);
            request.setAttribute("$L.actionCondition.desc",
                    this.actionConditionDesc);

            // get calculation fields list
            if (!_str.isBlank(this.tablename)) {
              var fields = getDateTimeFields(this.tablename);
              var fieldValues = $.createSCArray();
              var fieldDisps = $.createSCArray();
              _.each(fields, function(field) {
                fieldValues.push(field.value);
                fieldDisps.push(field.disp);
              });

              request.setAttribute("$L.calcFields", fieldValues);
              request.setAttribute("$L.calcFields.local", fieldDisps);
            }

            request.setAttribute("$L.ruleset.name", this.rulesetName);

            // get bt action list
            var btActions = getBackendTransitionsByTable(this.tablename, 1);
            var btActionValues = $.createSCArray();
            var btActionDisps = $.createSCArray();

            _.each(btActions, function(btAction) {
              btActionValues.push(btAction.value);
              btActionDisps.push(btAction.disp);
            });
            request.setAttribute("$L.btActions", btActionValues);
            request.setAttribute("$L.btActions.local", btActionDisps);
            request.setAttribute("$L.btAction", this.action);

            var btAction = _.findWhere(btActions, {
              value: this.action
            });

            var btDesc = "";
            if (this.action != "0" && this.action != "1") {
              if (btAction != null) {
                var allFlows = getWorkflowsByTable(this.tablename);
                var workflows = btAction.workflows;
                var exceptWorkflows = _.difference(allFlows, workflows);
                if (exceptWorkflows.length > 0) {
                  var workflowsDesc = $.createSCArray(workflows.join(),
                          exceptWorkflows.join());
                  btDesc = scmsg("btDesc", msgCls, workflowsDesc);
                } else {
                  var workflowsDesc = $.createSCArray(workflows.join());
                  btDesc = scmsg("btDesc2", msgCls, workflowsDesc);
                }
              }
            }
            request.setAttribute("$L.btAction.desc", btDesc);
          },

          /**
           * @protected
           */
          doWizard: function doWizard(request) {
            this._super.apply(this, arguments);
            // setup action condition editor
            if (this.actionConditionXml != null) {
              vars["$xmlString2"] = this.actionConditionXml;
            } else {
              vars["$xmlString2"] = '';
            }

            return "runScheduledActionWizard.view";
          },

          /**
           * @protected
           */
          validate: function validate(request) {
            if (_str.isBlank(this.rule["ruleDesc"])) {
              msg(scmsg(2103, "fc"), 3);
              cursor_field_name_set("ruleDesc");
              return false;
            }

            if (_str.isBlank(this.action)) {
              msg(scmsg("require.btAction", msgCls), 3);
              cursor_field_name_set("$L.btAction");
              return false;
            } else {
              var btActions = getBackendTransitionsByTable(this.tablename, 1);
              var btAction = _.findWhere(btActions, {
                value: this.action
              });
              if (btAction == null) {
                msg(scmsg("validate.btAction", msgCls, $
                        .createSCArray(this.action)), 3);
                cursor_field_name_set("$L.btAction");
                return false;
              }

            }

            if (this.action == "0") {
              if (_str.isBlank(this.rulesetName)) {
                msg(scmsg("require.rulesetName", msgCls), 3);
                cursor_field_name_set("$L.ruleset.name");
                return false;
              }
            }

            if (!_str.isBlank(this.rulesetName)) {
              // validate ruleSetName isin the set
              var rulesets = getRuleSetsByTable(this.tablename,
                      this.ruleset["id"]);
              var rulesetObj = _.findWhere(rulesets, {
                value: this.rulesetName
              });
              if (rulesetObj == null) {
                msg(scmsg("validate.rulesetName", msgCls, $
                        .createSCArray(this.rulesetName)), 3);
                cursor_field_name_set("$L.ruleset.name");
                return false;
              }
            }

            if (this.calcType == 1) {
              if (_str.isBlank(this.calcField)) {
                msg(scmsg("require.field", msgCls), 3);
                cursor_field_name_set("$L.calc.field");
                return false;
              } else {
                var fields = getDateTimeFields(this.tablename);
                var fieldObj = _.findWhere(fields, {
                  value: this.calcField
                });
                if (fieldObj == null) {
                  msg(scmsg("validate.field", msgCls, $
                          .createSCArray(this.calcField)), 3);
                  cursor_field_name_set("$L.calc.field");
                  return false;
                }
              }

              if (_str.isBlank(this.calcInterval)) {
                msg(scmsg("require.interval", msgCls), 3);
                cursor_field_name_set("$L.calc.interval");
                return false;
              } else {
              		var tmpInterval=this.calcInterval;
              		if(this.calcInterval.indexOf("-")==0){
              			tmpInterval=system.functions.substr(this.calcInterval,2);
              		}
                	var datetime = val(tmpInterval, $.Datetime);
                	if (datetime == null) {
                  		msg(scmsg("validate.interval", msgCls, $.createSCArray(this.calcInterval)), 3);
                  		cursor_field_name_set("$L.calc.interval");
                  		return false;
                	}
              }
            } else {
              if (_str.isBlank(this.calcScript)) {
                msg(scmsg("require.script", msgCls), 3);
                cursor_field_name_set("$L.calc.script");
                return false;
              }
            }

            return true;
          },

          showWizard: function showWizard(request) {
            var xmlString = this.rule["ruleXML"];
            var jsonString = this.rule["ruleJSON"];
            var runActionConf = null;

            if (_str.isBlank(this.rule["ruleDesc"])) {
              this.rule["ruleDesc"] = "Run Scheduled Action";
            }
            
            if(null==jsonString || ""==jsonString) {
              if (_str.isBlank(xmlString)) {
                xmlString = "<runScheduledAction></runScheduledAction>";
              }
              runActionConf = parseRuleXML(xmlString);
            } else {
              runActionConf = parseRuleJSON(jsonString);
            }

            this.calcType = runActionConf.calcType;
            this.calcField = runActionConf.calcField;
            this.calcInterval = runActionConf.calcInterval;
            this.calcScript = runActionConf.calcScript;
            this.actionConditionXml = runActionConf.actionConditionXml;
            if (!_str.isBlank(this.actionConditionXml)) {
              var actionConditions = getRadQueryFromCondtionXml(this.actionConditionXml);
              this.actionConditionDesc = actionConditions[1];
            }

            this.rulesetName = runActionConf.rulesetName;
            this.action = runActionConf.action;

            return this.doWizard(request);
          },

          wizard: function wizard(request) {
            return this.doWizard(request);
          },

          ok: function ok(request) {
            if (this.validate(request)) {
              this._super.apply(this, arguments);
              var jsonObj = {};
		      jsonObj.type = "runScheduledAction";
		      jsonObj.calcType = "";
		      jsonObj.calcField = "";
		      jsonObj.calcInterval = "";
		      jsonObj.calcScript = "";
		      jsonObj.actionCondition = "";
		      jsonObj.actionConditionXml = "";
		      jsonObj.rulesetName = "";
		      jsonObj.action = "";

              if (this.calcType != null) {
                jsonObj.calcType = this.calcType;
              }
              if (this.calcField != null) {
                jsonObj.calcField = this.calcField;
              }
              if (this.calcInterval != null) {
                jsonObj.calcInterval = this.calcInterval;
              }
              if (this.calcScript != null) {
                jsonObj.calcScript = this.calcScript;
              }
              if (this.actionConditionXml != null) {
                jsonObj.actionConditionXml = this.actionConditionXml;
              }

              var actionConditions = getRadQueryFromCondtionXml(this.actionConditionXml);
              if (actionConditions != null) {
                jsonObj.actionCondition = system.functions.str(actionConditions[0]);
              }
              if (this.rulesetName != null) {
                jsonObj.rulesetName = this.rulesetName;
              }
              if (this.action != null) {
                jsonObj.action = this.action;
              }

              this.rule["type"] = "runScheduledAction";
              this.rule["ruleJSON"] = rteJSONStringify(jsonObj);
              this.rule["ruleXML"] = null;
            } else {
              return this.doWizard(request);
            }
          }
        });

function getClass() {
  return RunScheduledActionWizard;
}